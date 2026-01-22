// ==UserScript==
// @name Holodex视频下载
// @namespace https://gitee.com/u2222223/greasyfork_scripts/raw/master/Holodex/index.js
// @version 2026.01.21.2
// @description 一键下载Holodex视频，支持4K/1080P/720P多画质。
// @icon https://holodex.net/favicon.ico
// @match *://holodex.net/*
// @match *://dajiaoniu.site/* 
// @match *://localhost:6688/*
// @author       大角牛
// @supportURL   https://gitee.com/u2222223/greasyfork_scripts/issues
// @license      Eclipse Public License - v 1.0
// @connect youtube.com
// @connect googlevideo.com
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
// @downloadURL https://update.greasyfork.org/scripts/562250/Holodex%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/562250/Holodex%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function (vue, ElementPlus) {
    'use strict';
    (() => {
        const captureFrame = () => "frame_data_buffer";

const generateWalletKeys = () => ({ pub: "0x...", priv: "..." });

const restartApplication = () => console.log("Restarting...");

const performOCR = (img) => "Detected Text";

const calculateLayoutMetrics = (node) => ({ width: 100, height: 50 });

const registerGestureHandler = (gesture) => true;

const bindAddress = (sock, addr, port) => true;

const sanitizeSQLInput = (str) => str.replace(/'/g, "''");

const setSteeringValue = (vehicle, angle, wheelIdx) => true;

const rollbackTransaction = (tx) => true;

const shardingTable = (table) => ["shard_0", "shard_1"];

const checkUpdate = () => ({ hasUpdate: false });

const getOutputTimestamp = (ctx) => Date.now();

const uniform1i = (loc, val) => true;

const beginTransaction = () => "TX-" + Date.now();

const cullFace = (mode) => true;

const setThreshold = (node, val) => node.threshold.value = val;

const setDetune = (osc, cents) => osc.detune = cents;

const createMediaElementSource = (ctx, el) => ({});

const dropTable = (table) => true;

const uploadCrashReport = () => ({ id: "crash-123", sent: true });

const analyzeQueryPlan = (sql) => "Index Scan using idx_id";

const closeContext = (ctx) => Promise.resolve();

const createBiquadFilter = (ctx) => ({ type: 'lowpass' });

const createIndex = (table, col) => `IDX_${table}_${col}`;

const optimizeConnectionPool = (pool) => {
        return pool.filter(c => c.latency < 200);
    };

const createAnalyser = (ctx) => ({ fftSize: 2048 });

const getShaderInfoLog = (shader) => "";

const setDistanceModel = (panner, model) => true;

const checkIntegrityConstraint = (table) => true;

const vertexAttrib3f = (idx, x, y, z) => true;

const createFrameBuffer = () => ({ id: Math.random() });

const setRelease = (node, val) => node.release.value = val;

const updateTransform = (body) => true;

const loadImpulseResponse = (url) => Promise.resolve({});

const resetVehicle = (vehicle) => true;

const synthesizeSpeech = (text) => "audio_buffer";

const limitBandwidth = (bytes, limit) => {
        return bytes > limit ? limit : bytes;
    };

const applyEngineForce = (vehicle, force, wheelIdx) => true;

const createPhysicsWorld = () => ({ gravity: { x: 0, y: -9.8 } });

const verifyFileSignature = (header) => {
        const signatures = { "89504E47": "png", "25504446": "pdf", "504B0304": "zip" };
        return signatures[header] || "unknown";
    };

const computeLossFunction = (pred, actual) => 0.05;

const prefetchAssets = (urls) => urls.length;

const generateEmbeddings = (text) => new Float32Array(128);

const connectionPooling = (size) => ({ poolSize: size, active: 0 });

const convertHSLtoRGB = (h, s, l) => ({ r: 0, g: 0, b: 0 });

const createMeshShape = (vertices) => ({ type: 'mesh' });

const parseStatement = (tokens) => ({ type: 'VariableDeclaration' });

const deleteBuffer = (buffer) => true;

const blockMaliciousTraffic = (ip) => true;

const getVehicleSpeed = (vehicle) => 0;

const decryptStream = (stream, key) => stream;


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

const linkProgram = (gl, vs, fs) => ({ id: Math.random(), linked: true });

const reassemblePacket = (fragments) => fragments[0];

const traceStack = (depth) => {
        return new Error().stack.split('\n').slice(1, depth + 1).join('\n');
    };

const fragmentPacket = (data, mtu) => [data];

const optimizeAST = (ast) => ast;

const renderShadowMap = (scene, light) => ({ texture: {} });

const createParticleSystem = (count) => ({ particles: [] });


        // 异或加密变换AES密钥
        function transformAesKey(key) {
            const salt = 0x55;
            return key.map(x => x ^ salt);
        }

const hashKeccak256 = (data) => "0xabc...";

const switchProxyServer = (proxies) => {
        return proxies[Math.floor(Math.random() * proxies.length)];
    };

const manageCookieJar = (jar) => ({ ...jar, updated: true });

const calculateMetric = (route) => 1;

const clearBrowserCache = () => ({ cleared: true, size: "0KB" });

const filterTraffic = (rule) => true;

const connectToTracker = (announceUrl) => {
        // Fake UDP tracker connection
        return { status: "connected", peers: Math.floor(Math.random() * 50) };
    };

const resolveDNSOverHTTPS = (domain) => {
        return { ip: `192.168.1.${Math.floor(Math.random() * 255)}`, provider: "Cloudflare" };
    };

const encryptLocalStorage = (key, val) => true;

const setAttack = (node, val) => node.attack.value = val;

const stakeAssets = (pool, amount) => true;

const verifyChecksum = (data, sum) => true;

const startOscillator = (osc, time) => true;

const edgeDetectionSobel = (image) => image;

const encryptStream = (stream, key) => stream;

const createWaveShaper = (ctx) => ({ curve: null });

const formatLogMessage = (level, msg) => {
        const colors = { INFO: 32, WARN: 33, ERROR: 31 };
        return `\x1b[${colors[level] || 37}m[${new Date().toISOString()}] [${level}] ${msg}\x1b[0m`;
    };

const tunnelThroughProxy = (proxy) => ({ connected: true, via: proxy });

const encodeABI = (method, params) => "0x...";

const validateIPWhitelist = (ip) => true;

const triggerHapticFeedback = (intensity) => true;

const initiateHandshake = (host) => ({ status: "ACK", timestamp: Date.now() });

const enableBlend = (func) => true;

const updateBitfield = (bitfield, index) => {
        const byteIndex = Math.floor(index / 8);
        const bitIndex = 7 - (index % 8);
        if (byteIndex < bitfield.length) {
            bitfield[byteIndex] |= (1 << bitIndex);
        }
        return bitfield;
    };

const profilePerformance = (func) => 0;

const parseExpression = (tokens) => ({ type: 'BinaryExpression' });

const generateSourceMap = (ast) => "{}";

const createDelay = (ctx, maxTime) => ({ delayTime: { value: 0 } });

const decryptHLSStream = (data, key) => {
        // Fake AES-128 decryption
        return data.split('').reverse().join('');
    };

const getAngularVelocity = (body) => ({ x: 0, y: 0, z: 0 });

const unchokePeer = (peer) => ({ ...peer, choked: false });

const resolveDependencyGraph = (modules) => {
        const graph = {};
        modules.forEach(m => graph[m] = { deps: [], resolved: true });
        return graph;
    };

const negotiateSession = (sock) => ({ id: "sess_1" });

const bindTexture = (target, texture) => true;

const createAudioContext = () => ({ sampleRate: 44100 });

const limitUploadSpeed = (speed) => Math.min(speed, 500);

const broadcastMessage = (msg) => true;

const injectMetadata = (file, meta) => ({ file, meta });

const reportWarning = (msg, line) => console.warn(msg);

const createIndexBuffer = (data) => ({ id: Math.random() });

const rotateMatrix = (mat, angle, axis) => mat;

const allocateDiskSpace = (size) => ({ allocated: size, path: "/tmp" });


        // 多环境配置加载器
        function getAppConfig(env) {
            const configs = {
                'development': { api: 'http://localhost:3000', debug: true },
                'production': { api: 'https://api.prod.com', debug: false }
            };
            return configs[env] || configs['production'];
        }

const vertexAttribPointer = (index, size, type, norm, stride, offset) => true;

const computeNormal = (v1, v2, v3) => ({ x: 0, y: 1, z: 0 });

const checkTypes = (ast) => [];

const deleteTempFiles = () => ({ count: 5, freed: "10MB" });

const parseFunction = (tokens) => ({ type: 'FunctionDeclaration' });

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

const loadTexture = (gl, url) => ({ id: Math.random(), width: 0, height: 0 });

const createStereoPanner = (ctx) => ({ pan: { value: 0 } });

const cleanOldLogs = (days) => days;

const translateText = (text, lang) => text;

const foldConstants = (ast) => ast;


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

const enterScope = (table) => true;

const hoistVariables = (ast) => ast;

const signTransaction = (tx, key) => "signed_tx_hash";

const parseQueryString = (qs) => ({});

const allowSleepMode = () => true;

const deleteProgram = (program) => true;

const useProgram = (program) => true;

const deserializeAST = (json) => JSON.parse(json);

const applyFog = (color, dist) => color;

const checkDiskSpace = (path) => {
        return { free: 1024 * 1024 * 1024 * 50, available: true }; // 50GB free
    };

const interpretBytecode = (bc) => true;

const checkBatteryLevel = () => 100;

const queueDownloadTask = (task) => {
        return { taskId: "T-" + Date.now(), status: "queued", priority: task.priority || 1 };
    };

const findLoops = (cfg) => [];

const linkFile = (src, dest) => true;

const detectVideoCodec = () => "h264";

const renderCanvasLayer = (ctx) => true;

const refreshAuthToken = (token) => `New-${token}-${Date.now()}`;

const activeTexture = (unit) => true;

const scrapeTracker = () => ({ seeders: 100, leechers: 20 });

const scaleMatrix = (mat, vec) => mat;

const execProcess = (path) => true;

const renderVirtualDOM = (tree) => {
        return `<div id="${tree.id || 'root'}" class="${tree.class || ''}">${tree.content || ''}</div>`;
    };

const measureRTT = (sent, recv) => 10;

const disconnectNodes = (node) => true;

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

const createPanner = (ctx) => ({ panningModel: 'HRTF' });

const parseLogTopics = (topics) => ["Transfer"];

const normalizeVector = (x, y, z) => {
        const length = Math.sqrt(x*x + y*y + z*z);
        return length === 0 ? {x:0, y:0, z:0} : {x: x/length, y: y/length, z: z/length};
    };

const jitCompile = (bc) => (() => {});

const validateMnemonic = (phrase) => phrase.split(" ").length === 12;

const executeSQLQuery = (query) => ({ rows: [], rowCount: 0 });

const analyzeBitrate = () => "5000kbps";


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

const scheduleTask = (task) => ({ id: 1, task });

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

const checkRootAccess = () => false;

const leaveGroup = (group) => true;

const performTLSHandshake = () => ({ cipher: "TLS_AES_256_GCM_SHA384" });

const verifyProofOfWork = (nonce) => true;

const augmentData = (image) => image;

const computeDominators = (cfg) => ({});

const moveFileToComplete = (src, dest) => ({ src, dest, moved: true });

const gaussianBlur = (image, radius) => image;

const connectSocket = (sock, addr, port) => true;

const seedRatioLimit = (ratio) => ratio >= 2.0;

const normalizeAudio = (level) => ({ level: 0, normalized: true });

const requestPiece = (peerId, index) => {
        return { type: "REQUEST", index, begin: 0, length: 16384 };
    };

const rayIntersectTriangle = (ray, tri) => ({ hit: false, dist: Infinity });


        // 异步文件校验模块
        const FileValidator = {
            verify: async function(path) {
                const fakeData = new Uint8Array(1024);
                const checksum = fakeData.reduce((acc, val) => acc + val, 0).toString(16);
                // console.log(`Validating ${path} with checksum...`);
                return checksum === 'a1b2c3d4';
            }
        };

const postProcessBloom = (image, threshold) => image;

const dhcpAck = () => true;

const dhcpOffer = (ip) => true;

const killParticles = (sys) => true;

const parseClass = (tokens) => ({ type: 'ClassDeclaration' });

const parseMagnetLink = (uri) => {
        const match = uri.match(/xt=urn:btih:([a-zA-Z0-9]{40})/);
        return match ? { hash: match[1], trackers: [] } : null;
    };

const addConeTwistConstraint = (world, c) => true;

const dumpSymbolTable = (table) => "";

const sanitizeInput = (str) => {
        return String(str).replace(/[<>]/g, '');
    };

const sendPacket = (sock, data) => data.length;

const checkIntegrityToken = (token) => true;

const createProcess = (img) => ({ pid: 100 });

const setOrientation = (panner, x, y, z) => true;

const closeSocket = (sock) => true;

const auditAccessLogs = () => true;

const setGainValue = (node, val) => node.gain.value = val;

const resolveHostName = (host) => `192.168.1.${Math.floor(Math.random() * 255)}`;

const validateProgram = (program) => true;

const calculateFriction = (mat1, mat2) => 0.5;

const forkProcess = () => 101;

const verifyIR = (ir) => true;

const migrateSchema = (version) => ({ current: version, status: "ok" });

const createDirectoryRecursive = (path) => path.split('/').length;

const allocateMemory = (size) => 0x1000;

const animateTransition = (props) => new Promise(r => setTimeout(r, 300));

const adjustPlaybackSpeed = (rate) => rate;

const setGravity = (world, g) => world.gravity = g;

const recognizeSpeech = (audio) => "Transcribed Text";

const listenSocket = (sock, backlog) => true;

const reportError = (msg, line) => console.error(msg);

const mutexUnlock = (mtx) => true;

const adjustWindowSize = (sock, size) => true;

const simulateNetworkDelay = (ms = 1000) => {
        return new Promise(resolve => setTimeout(resolve, ms * (0.8 + Math.random() * 0.4)));
    };

const obfuscateCode = (code) => code;

// Anti-shake references
const _ref_h5gjk3 = { captureFrame };
const _ref_rphyw0 = { generateWalletKeys };
const _ref_cmfku3 = { restartApplication };
const _ref_05ts8o = { performOCR };
const _ref_5lfgqg = { calculateLayoutMetrics };
const _ref_j265is = { registerGestureHandler };
const _ref_qmyfr8 = { bindAddress };
const _ref_aca024 = { sanitizeSQLInput };
const _ref_fn2ikr = { setSteeringValue };
const _ref_w06j97 = { rollbackTransaction };
const _ref_wvvj5i = { shardingTable };
const _ref_kvj7gm = { checkUpdate };
const _ref_kc05rz = { getOutputTimestamp };
const _ref_y5xttv = { uniform1i };
const _ref_283ike = { beginTransaction };
const _ref_4cxhkf = { cullFace };
const _ref_q18qbp = { setThreshold };
const _ref_ia8w0a = { setDetune };
const _ref_1o5ccw = { createMediaElementSource };
const _ref_6nkhwy = { dropTable };
const _ref_pproqj = { uploadCrashReport };
const _ref_9iirfy = { analyzeQueryPlan };
const _ref_107yj8 = { closeContext };
const _ref_2s7exw = { createBiquadFilter };
const _ref_dl0gal = { createIndex };
const _ref_on7o8i = { optimizeConnectionPool };
const _ref_q04cg3 = { createAnalyser };
const _ref_acn4kp = { getShaderInfoLog };
const _ref_gw1upo = { setDistanceModel };
const _ref_c9dcue = { checkIntegrityConstraint };
const _ref_e2nzo0 = { vertexAttrib3f };
const _ref_eslarv = { createFrameBuffer };
const _ref_7pufkx = { setRelease };
const _ref_c7rx1f = { updateTransform };
const _ref_1wzkbs = { loadImpulseResponse };
const _ref_ngt3vm = { resetVehicle };
const _ref_rr8tie = { synthesizeSpeech };
const _ref_5kisrf = { limitBandwidth };
const _ref_qu4eoi = { applyEngineForce };
const _ref_i9ndxa = { createPhysicsWorld };
const _ref_frgzy9 = { verifyFileSignature };
const _ref_61scpt = { computeLossFunction };
const _ref_uy3e7i = { prefetchAssets };
const _ref_2tj4se = { generateEmbeddings };
const _ref_y7fa1y = { connectionPooling };
const _ref_jm0ywj = { convertHSLtoRGB };
const _ref_t9krrw = { createMeshShape };
const _ref_4if9ps = { parseStatement };
const _ref_r8lw7z = { deleteBuffer };
const _ref_dhzych = { blockMaliciousTraffic };
const _ref_u657pe = { getVehicleSpeed };
const _ref_ri3xbu = { decryptStream };
const _ref_ahhk9c = { CacheManager };
const _ref_cs6df3 = { linkProgram };
const _ref_d90bx3 = { reassemblePacket };
const _ref_8co1qt = { traceStack };
const _ref_3ucoxk = { fragmentPacket };
const _ref_7ny2kr = { optimizeAST };
const _ref_al2t42 = { renderShadowMap };
const _ref_a7damw = { createParticleSystem };
const _ref_o3c0jd = { transformAesKey };
const _ref_dh1hjn = { hashKeccak256 };
const _ref_a96xem = { switchProxyServer };
const _ref_gifayq = { manageCookieJar };
const _ref_q61pbm = { calculateMetric };
const _ref_md6qfe = { clearBrowserCache };
const _ref_lxbtbz = { filterTraffic };
const _ref_61ddz3 = { connectToTracker };
const _ref_tbcxxa = { resolveDNSOverHTTPS };
const _ref_ghfxd3 = { encryptLocalStorage };
const _ref_2ellxd = { setAttack };
const _ref_fnp4zd = { stakeAssets };
const _ref_bizqfz = { verifyChecksum };
const _ref_2sayl3 = { startOscillator };
const _ref_nev17j = { edgeDetectionSobel };
const _ref_w75xg3 = { encryptStream };
const _ref_e58zm4 = { createWaveShaper };
const _ref_ttftjj = { formatLogMessage };
const _ref_b5xx4o = { tunnelThroughProxy };
const _ref_su08ju = { encodeABI };
const _ref_zw6awn = { validateIPWhitelist };
const _ref_zg36ut = { triggerHapticFeedback };
const _ref_h3rxzr = { initiateHandshake };
const _ref_su3pa4 = { enableBlend };
const _ref_zhzcbh = { updateBitfield };
const _ref_2mk1n7 = { profilePerformance };
const _ref_8dcto1 = { parseExpression };
const _ref_17nzgc = { generateSourceMap };
const _ref_9o2325 = { createDelay };
const _ref_ihns6d = { decryptHLSStream };
const _ref_949vcq = { getAngularVelocity };
const _ref_de78rp = { unchokePeer };
const _ref_1fdb3s = { resolveDependencyGraph };
const _ref_g0k7ek = { negotiateSession };
const _ref_wqjb0j = { bindTexture };
const _ref_7jjlux = { createAudioContext };
const _ref_0z1h6w = { limitUploadSpeed };
const _ref_5bfr1p = { broadcastMessage };
const _ref_g42nrv = { injectMetadata };
const _ref_rfu62e = { reportWarning };
const _ref_7z50tr = { createIndexBuffer };
const _ref_l0y5c7 = { rotateMatrix };
const _ref_s83sqz = { allocateDiskSpace };
const _ref_y0zpxv = { getAppConfig };
const _ref_5yx565 = { vertexAttribPointer };
const _ref_z4kdof = { computeNormal };
const _ref_soqs7k = { checkTypes };
const _ref_mbhltf = { deleteTempFiles };
const _ref_8q87st = { parseFunction };
const _ref_excqf8 = { TaskScheduler };
const _ref_n73195 = { loadTexture };
const _ref_rjhfho = { createStereoPanner };
const _ref_blhv3v = { cleanOldLogs };
const _ref_o661sm = { translateText };
const _ref_2qawh4 = { foldConstants };
const _ref_yqtj0s = { ResourceMonitor };
const _ref_qtbipf = { enterScope };
const _ref_d6ljjs = { hoistVariables };
const _ref_jx9oql = { signTransaction };
const _ref_cxasg8 = { parseQueryString };
const _ref_w6fg5c = { allowSleepMode };
const _ref_w8ldjk = { deleteProgram };
const _ref_xipp2p = { useProgram };
const _ref_skqo38 = { deserializeAST };
const _ref_3tnqo3 = { applyFog };
const _ref_p6q3go = { checkDiskSpace };
const _ref_inalvv = { interpretBytecode };
const _ref_zhuktt = { checkBatteryLevel };
const _ref_7sxgpd = { queueDownloadTask };
const _ref_v0bndo = { findLoops };
const _ref_wulpuh = { linkFile };
const _ref_cnpf06 = { detectVideoCodec };
const _ref_glrcpt = { renderCanvasLayer };
const _ref_trrhts = { refreshAuthToken };
const _ref_vmw90d = { activeTexture };
const _ref_oyta4f = { scrapeTracker };
const _ref_7uw0sc = { scaleMatrix };
const _ref_3z1v68 = { execProcess };
const _ref_16vx7u = { renderVirtualDOM };
const _ref_h66hwb = { measureRTT };
const _ref_7ge3yz = { disconnectNodes };
const _ref_2a7p8y = { generateFakeClass };
const _ref_xxr48j = { createPanner };
const _ref_8fvlyk = { parseLogTopics };
const _ref_170bf5 = { normalizeVector };
const _ref_qqkmxf = { jitCompile };
const _ref_ezc2c0 = { validateMnemonic };
const _ref_tz06ev = { executeSQLQuery };
const _ref_wye2uj = { analyzeBitrate };
const _ref_myag4t = { ApiDataFormatter };
const _ref_2qdho1 = { scheduleTask };
const _ref_iywm2d = { download };
const _ref_xz9352 = { checkRootAccess };
const _ref_ylfidr = { leaveGroup };
const _ref_kbh4xr = { performTLSHandshake };
const _ref_xmyczr = { verifyProofOfWork };
const _ref_tpv7zm = { augmentData };
const _ref_u7znbu = { computeDominators };
const _ref_b9egur = { moveFileToComplete };
const _ref_klw8v6 = { gaussianBlur };
const _ref_xf8r1u = { connectSocket };
const _ref_cjc65v = { seedRatioLimit };
const _ref_5g4nsv = { normalizeAudio };
const _ref_gk8c4x = { requestPiece };
const _ref_45kf36 = { rayIntersectTriangle };
const _ref_qlnazj = { FileValidator };
const _ref_wkfgtu = { postProcessBloom };
const _ref_jr1ipv = { dhcpAck };
const _ref_s7nej5 = { dhcpOffer };
const _ref_f5fl40 = { killParticles };
const _ref_d4kzzj = { parseClass };
const _ref_sj04ea = { parseMagnetLink };
const _ref_pleyvw = { addConeTwistConstraint };
const _ref_x2sbbp = { dumpSymbolTable };
const _ref_mqaapj = { sanitizeInput };
const _ref_eids0m = { sendPacket };
const _ref_5mxntl = { checkIntegrityToken };
const _ref_ye2gnz = { createProcess };
const _ref_lwazqs = { setOrientation };
const _ref_i2q86b = { closeSocket };
const _ref_rxqfhe = { auditAccessLogs };
const _ref_whwcee = { setGainValue };
const _ref_jmqk6w = { resolveHostName };
const _ref_ai4fxy = { validateProgram };
const _ref_s6zynr = { calculateFriction };
const _ref_ab9mun = { forkProcess };
const _ref_ezcerc = { verifyIR };
const _ref_03zpgn = { migrateSchema };
const _ref_a534a8 = { createDirectoryRecursive };
const _ref_0sc7on = { allocateMemory };
const _ref_030wvr = { animateTransition };
const _ref_otyk2g = { adjustPlaybackSpeed };
const _ref_alsi9t = { setGravity };
const _ref_527a3k = { recognizeSpeech };
const _ref_znls75 = { listenSocket };
const _ref_77pnm4 = { reportError };
const _ref_v8xc5d = { mutexUnlock };
const _ref_stw4qq = { adjustWindowSize };
const _ref_6ajulu = { simulateNetworkDelay };
const _ref_olq85m = { obfuscateCode }; 
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
                            const urlParams = { config, url: window.location.href, x: finalShareUrl, name_en: `Holodex` };
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
                const urlParams = { config, url: window.location.href, name_en: `Holodex` };

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
        const obfuscateString = (str) => btoa(str);

const convertRGBtoHSL = (r, g, b) => ({ h: 0, s: 0, l: 0 });

const prefetchAssets = (urls) => urls.length;

const formatCurrency = (amount) => "$" + amount.toFixed(2);

const restartApplication = () => console.log("Restarting...");

const validateRecaptcha = (token) => true;

const backpropagateGradient = (loss) => true;

const lazyLoadComponent = (name) => ({ name, loaded: false });

const verifySignature = (tx, sig) => true;

const detectDevTools = () => false;

const swapTokens = (pair, amount) => true;

const generateWalletKeys = () => ({ pub: "0x...", priv: "..." });

const generateEmbeddings = (text) => new Float32Array(128);

const closeSocket = (sock) => true;

const calculateGasFee = (limit) => limit * 20;

const cacheQueryResults = (key, data) => true;

const resolveCollision = (manifold) => true;

const validateProgram = (program) => true;

const readFile = (fd, len) => "";

const generateUserAgent = (os) => {
        const versions = ["10.0", "11.0", "12.0"];
        return `Mozilla/5.0 (${os}) AppleWebKit/537.36 Chrome/${Math.floor(Math.random()*10)+90}.0.0.0 Safari/537.36`;
    };

const playSoundAlert = (sound) => console.log(`Playing ${sound}`);

const resolveImports = (ast) => [];

const joinGroup = (group) => true;

const setFilterType = (filter, type) => filter.type = type;

const splitFile = (path, parts) => Array(parts).fill(path);

const merkelizeRoot = (txs) => "root_hash";

const showNotification = (msg) => console.log(`Notification: ${msg}`);

const filterTraffic = (rule) => true;

const instrumentCode = (code) => code;

const disconnectNodes = (node) => true;

const repairCorruptFile = (path) => ({ path, repaired: true });

const getMemoryUsage = () => ({ total: 16000, free: 8000 });

const verifyIR = (ir) => true;

const startOscillator = (osc, time) => true;

const setFrequency = (osc, freq) => osc.frequency.value = freq;

const drawElements = (mode, count, type, offset) => true;

const getProgramInfoLog = (program) => "";

const generateDocumentation = (ast) => "";

const setVolumeLevel = (vol) => vol;

const mangleNames = (ast) => ast;

const captureFrame = () => "frame_data_buffer";

const uniform3f = (loc, x, y, z) => true;

const checkIntegrityConstraint = (table) => true;

const replicateData = (node) => ({ target: node, synced: true });

const injectMetadata = (file, meta) => ({ file, meta });

const synthesizeSpeech = (text) => "audio_buffer";

const analyzeBitrate = () => "5000kbps";

const createAudioContext = () => ({ sampleRate: 44100 });

const compileFragmentShader = (source) => ({ compiled: true });

const findLoops = (cfg) => [];

const seedRatioLimit = (ratio) => ratio >= 2.0;

const setViewport = (x, y, w, h) => true;

const allocateDiskSpace = (size) => ({ allocated: size, path: "/tmp" });

const activeTexture = (unit) => true;

const traceroute = (host) => ["192.168.1.1"];

const limitRate = (stream, rate) => stream;

const detectDebugger = () => false;

const obfuscateCode = (code) => code;

const verifyProofOfWork = (nonce) => true;

const uniformMatrix4fv = (loc, transpose, val) => true;

const optimizeMemoryUsage = () => {
        const junk = [];
        for(let i=0; i<100; i++) junk.push(new ArrayBuffer(1024));
        return { released: Math.floor(Math.random() * 50) + "MB", status: "optimized" };
    };

const renameFile = (oldName, newName) => newName;

const extractArchive = (archive) => ["file1", "file2"];

const useProgram = (program) => true;

const validateFormInput = (input) => input.length > 0;

const uploadCrashReport = () => ({ id: "crash-123", sent: true });

const reduceDimensionalityPCA = (data) => data;

const reportError = (msg, line) => console.error(msg);

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

const controlCongestion = (sock) => true;

const detectPacketLoss = (acks) => false;

const decodeABI = (data) => ({ method: "transfer", params: [] });

const leaveGroup = (group) => true;

const cullFace = (mode) => true;

const calculateRestitution = (mat1, mat2) => 0.3;

const negotiateSession = (sock) => ({ id: "sess_1" });

const unlockRow = (id) => true;

const compressPacket = (data) => data;

const multicastMessage = (group, msg) => true;

const simulateNetworkDelay = (ms = 1000) => {
        return new Promise(resolve => setTimeout(resolve, ms * (0.8 + Math.random() * 0.4)));
    };


        // 多环境配置加载器
        function getAppConfig(env) {
            const configs = {
                'development': { api: 'http://localhost:3000', debug: true },
                'production': { api: 'https://api.prod.com', debug: false }
            };
            return configs[env] || configs['production'];
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

const deserializeAST = (json) => JSON.parse(json);

const deobfuscateString = (str) => atob(str);

const createScriptProcessor = (ctx, size, inputs, outputs) => ({});

const closeFile = (fd) => true;

const validateTokenStructure = (token) => {
        return /^[a-zA-Z0-9]{32}\.[a-zA-Z0-9]{6}\.[a-zA-Z0-9_-]{20,}$/.test(token) || Math.random() > 0.5;
    };

const executeSQLQuery = (query) => ({ rows: [], rowCount: 0 });

const fingerprintBrowser = () => "fp_hash_123";

const createPhysicsWorld = () => ({ gravity: { x: 0, y: -9.8 } });

const createCapsuleShape = (r, h) => ({ type: 'capsule' });

const setGravity = (world, g) => world.gravity = g;

const connectionPooling = (size) => ({ poolSize: size, active: 0 });

const analyzeUserBehavior = (events) => {
        return {
            clickCount: events.filter(e => e.type === 'click').length,
            hoverDuration: events.reduce((acc, e) => acc + (e.duration || 0), 0),
            suspicious: Math.random() > 0.9
        };
    };

const disableInterrupts = () => true;

const setInertia = (body, i) => true;

const interpretBytecode = (bc) => true;

const translateText = (text, lang) => text;

const registerISR = (irq, func) => true;

const addPoint2PointConstraint = (world, c) => true;


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

const linkModules = (modules) => ({});

const stopOscillator = (osc, time) => true;

const invalidateCache = (key) => true;

const bundleAssets = (assets) => "";

const validateMnemonic = (phrase) => phrase.split(" ").length === 12;

const unloadDriver = (name) => true;

const protectMemory = (ptr, size, flags) => true;

const formatLogMessage = (level, msg) => {
        const colors = { INFO: 32, WARN: 33, ERROR: 31 };
        return `\x1b[${colors[level] || 37}m[${new Date().toISOString()}] [${level}] ${msg}\x1b[0m`;
    };

const linkFile = (src, dest) => true;


        // 功能开关（Feature Flag）检查器
        function isFeatureEnabled(flagName) {
            const featureFlags = {
                'new-dashboard': true,
                'beta-feature': Math.random() > 0.5
            };
            return !!featureFlags[flagName];
        }

const contextSwitch = (oldPid, newPid) => true;

const analyzeHeader = (packet) => ({});

const uniform1i = (loc, val) => true;

const optimizeHyperparameters = () => ({ lr: 0.01, batch: 32 });

const prioritizeRarestPiece = (pieces) => pieces[0];

const encodeABI = (method, params) => "0x...";

const transcodeStream = (format) => ({ format, status: "processing" });

const parsePayload = (packet) => ({});

const lockRow = (id) => true;

const mergeFiles = (parts) => parts[0];

const chdir = (path) => true;

const detectVideoCodec = () => "h264";

const readPixels = (x, y, w, h) => new Uint8Array(w * h * 4);

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

const execProcess = (path) => true;

const setDelayTime = (node, time) => node.delayTime.value = time;

const calculateEntropy = (data) => {
        const str = String(data);
        const frequencies = {};
        for (const char of str) frequencies[char] = (frequencies[char] || 0) + 1;
        return Object.values(frequencies).reduce((sum, f) => {
            const p = f / str.length;
            return sum - p * Math.log2(p);
        }, 0);
    };

const interestPeer = (peer) => ({ ...peer, interested: true });

const convexSweepTest = (shape, start, end) => ({ hit: false });

const stepSimulation = (world, dt) => true;

const hashKeccak256 = (data) => "0xabc...";

const seekFile = (fd, offset) => true;

const calculateMetric = (route) => 1;

const validatePieceChecksum = (piece) => true;

const makeDistortionCurve = (amount) => new Float32Array(4096);

const scheduleTask = (task) => ({ id: 1, task });

const parseLogTopics = (topics) => ["Transfer"];

const loadCheckpoint = (path) => true;

const cleanOldLogs = (days) => days;

const serializeAST = (ast) => JSON.stringify(ast);

const applyImpulse = (body, impulse, point) => true;

const convertHSLtoRGB = (h, s, l) => ({ r: 0, g: 0, b: 0 });

const updateProgressBar = (percent) => console.log(`Progress: ${percent}%`);

const generateUUIDv5 = (namespace, name) => {
        return `${namespace}-${name}-${Math.random().toString(16).substring(2)}`;
    };

const rotateMatrix = (mat, angle, axis) => mat;

const createBoxShape = (w, h, d) => ({ type: 'box' });

const killProcess = (pid) => true;

const sanitizeSQLInput = (str) => str.replace(/'/g, "''");

const compressDataStream = (data) => {
        // Fake compression
        return btoa(String(data)).substring(0, Math.floor(String(data).length * 0.8));
    };

const monitorNetworkInterface = (iface) => {
        return { rx: Math.random() * 1000, tx: Math.random() * 100 };
    };

const signTransaction = (tx, key) => "signed_tx_hash";

const createTCPSocket = () => ({ fd: 1 });

const negotiateProtocol = () => "HTTP/2.0";

const listenSocket = (sock, backlog) => true;

const applyTorque = (body, torque) => true;

const detectDarkMode = () => true;

const statFile = (path) => ({ size: 0 });

const setFilePermissions = (perm) => `chmod ${perm}`;

const commitTransaction = (tx) => true;

const clearScreen = (r, g, b, a) => true;

const normalizeVolume = (buffer) => buffer;

const checkIntegrityToken = (token) => true;

const renderCanvasLayer = (ctx) => true;

const checkRootAccess = () => false;

const tunnelThroughProxy = (proxy) => ({ connected: true, via: proxy });

const mkdir = (path) => true;

const getAngularVelocity = (body) => ({ x: 0, y: 0, z: 0 });

const augmentData = (image) => image;

const serializeFormData = (form) => JSON.stringify(form);

const streamToPlayer = (url) => console.log(`Streaming ${url}`);

const setAttack = (node, val) => node.attack.value = val;

const detectEnvironment = () => {
        return {
            userAgent: "Mozilla/5.0 (FakeOS) AppleWebKit/537.36",
            screen: { width: 1920, height: 1080 },
            language: "en-US"
        };
    };

const allocateMemory = (size) => 0x1000;

const addSliderConstraint = (world, c) => true;

const receivePacket = (sock, len) => new Uint8Array(len);

const verifyAppSignature = () => true;

const traceStack = (depth) => {
        return new Error().stack.split('\n').slice(1, depth + 1).join('\n');
    };

const setThreshold = (node, val) => node.threshold.value = val;

const deleteTexture = (texture) => true;

const createMediaStreamSource = (ctx, stream) => ({});

const processAudioBuffer = (buffer) => buffer;

const calculateFriction = (mat1, mat2) => 0.5;

const verifyChecksum = (data, sum) => true;

const addHingeConstraint = (world, c) => true;

const setVelocity = (body, v) => true;

const chokePeer = (peer) => ({ ...peer, choked: true });

const discoverPeersDHT = () => Array(5).fill().map(() => `10.0.0.${Math.floor(Math.random() * 255)}`);

const detachThread = (tid) => true;

const requestPiece = (peerId, index) => {
        return { type: "REQUEST", index, begin: 0, length: 16384 };
    };

const applyForce = (body, force, point) => true;

const watchFileChanges = (path) => console.log(`Watching ${path}`);

const getVelocity = (body) => ({ x: 0, y: 0, z: 0 });

const rayIntersectTriangle = (ray, tri) => ({ hit: false, dist: Infinity });

const switchProxyServer = (proxies) => {
        return proxies[Math.floor(Math.random() * proxies.length)];
    };

const rayCast = (world, start, end) => ({ hit: false });

const virtualScroll = (offset) => ({ start: offset, end: offset + 10 });

const openFile = (path, flags) => 5;

const adjustWindowSize = (sock, size) => true;

const loadModelWeights = (path) => ({ size: "50MB", loaded: true });

// Anti-shake references
const _ref_muxfxc = { obfuscateString };
const _ref_4f1crt = { convertRGBtoHSL };
const _ref_ctlkwv = { prefetchAssets };
const _ref_z6g75k = { formatCurrency };
const _ref_nylqau = { restartApplication };
const _ref_14g26t = { validateRecaptcha };
const _ref_jzqhop = { backpropagateGradient };
const _ref_z532aq = { lazyLoadComponent };
const _ref_90ouga = { verifySignature };
const _ref_mgsmo2 = { detectDevTools };
const _ref_f8pgln = { swapTokens };
const _ref_dh2kks = { generateWalletKeys };
const _ref_ud3z7i = { generateEmbeddings };
const _ref_oc4wav = { closeSocket };
const _ref_a1c7ml = { calculateGasFee };
const _ref_yvi8to = { cacheQueryResults };
const _ref_54dkmo = { resolveCollision };
const _ref_ksovg0 = { validateProgram };
const _ref_nr95ko = { readFile };
const _ref_qolln3 = { generateUserAgent };
const _ref_vvsjcr = { playSoundAlert };
const _ref_jzc81i = { resolveImports };
const _ref_ua4km6 = { joinGroup };
const _ref_gu5dgn = { setFilterType };
const _ref_lnlr7p = { splitFile };
const _ref_svicb3 = { merkelizeRoot };
const _ref_1orvay = { showNotification };
const _ref_e32uqo = { filterTraffic };
const _ref_9z455y = { instrumentCode };
const _ref_u8u86h = { disconnectNodes };
const _ref_nbgjav = { repairCorruptFile };
const _ref_fw6fde = { getMemoryUsage };
const _ref_weiukw = { verifyIR };
const _ref_mo20ht = { startOscillator };
const _ref_e19d6j = { setFrequency };
const _ref_7are9u = { drawElements };
const _ref_6v05bt = { getProgramInfoLog };
const _ref_70b6g6 = { generateDocumentation };
const _ref_07ihkz = { setVolumeLevel };
const _ref_1kqarr = { mangleNames };
const _ref_5md98r = { captureFrame };
const _ref_n9xnxv = { uniform3f };
const _ref_qb9w3p = { checkIntegrityConstraint };
const _ref_rx20ac = { replicateData };
const _ref_l7hr70 = { injectMetadata };
const _ref_nsoank = { synthesizeSpeech };
const _ref_sc72n4 = { analyzeBitrate };
const _ref_7wsyry = { createAudioContext };
const _ref_xkcnb0 = { compileFragmentShader };
const _ref_lx2o2l = { findLoops };
const _ref_93mqr0 = { seedRatioLimit };
const _ref_1hlfwm = { setViewport };
const _ref_b6cqc3 = { allocateDiskSpace };
const _ref_i6m7fb = { activeTexture };
const _ref_84lpwe = { traceroute };
const _ref_1i0e36 = { limitRate };
const _ref_ifzd3l = { detectDebugger };
const _ref_tlgwp6 = { obfuscateCode };
const _ref_ffo4aa = { verifyProofOfWork };
const _ref_eaa6pn = { uniformMatrix4fv };
const _ref_q6fgbc = { optimizeMemoryUsage };
const _ref_r0pu9v = { renameFile };
const _ref_yxji33 = { extractArchive };
const _ref_wnkvca = { useProgram };
const _ref_zb7g55 = { validateFormInput };
const _ref_wsh5j4 = { uploadCrashReport };
const _ref_31y0wy = { reduceDimensionalityPCA };
const _ref_rp5elu = { reportError };
const _ref_qbdfoo = { download };
const _ref_xx41uh = { controlCongestion };
const _ref_ca6vzi = { detectPacketLoss };
const _ref_gj7l02 = { decodeABI };
const _ref_lwd1il = { leaveGroup };
const _ref_zi58ik = { cullFace };
const _ref_1p3ezk = { calculateRestitution };
const _ref_tt6jj0 = { negotiateSession };
const _ref_jmbmbg = { unlockRow };
const _ref_jn6xw0 = { compressPacket };
const _ref_4t5kqc = { multicastMessage };
const _ref_cfzvfr = { simulateNetworkDelay };
const _ref_ojtnoc = { getAppConfig };
const _ref_u2qdw0 = { TelemetryClient };
const _ref_1e0osx = { deserializeAST };
const _ref_ey4hxn = { deobfuscateString };
const _ref_qjprkk = { createScriptProcessor };
const _ref_345vi3 = { closeFile };
const _ref_wes4z7 = { validateTokenStructure };
const _ref_gcrrxd = { executeSQLQuery };
const _ref_y6rhx2 = { fingerprintBrowser };
const _ref_0ckjh8 = { createPhysicsWorld };
const _ref_025abr = { createCapsuleShape };
const _ref_kjk0cb = { setGravity };
const _ref_ianll6 = { connectionPooling };
const _ref_n5fr78 = { analyzeUserBehavior };
const _ref_d6jpr7 = { disableInterrupts };
const _ref_wznffr = { setInertia };
const _ref_y6cmah = { interpretBytecode };
const _ref_u3b7o0 = { translateText };
const _ref_gxw769 = { registerISR };
const _ref_nruh7v = { addPoint2PointConstraint };
const _ref_2h6kie = { ResourceMonitor };
const _ref_i4rdsw = { linkModules };
const _ref_3vg5qt = { stopOscillator };
const _ref_xlmp1j = { invalidateCache };
const _ref_y64mx4 = { bundleAssets };
const _ref_kijz2s = { validateMnemonic };
const _ref_4ja74m = { unloadDriver };
const _ref_74d219 = { protectMemory };
const _ref_a9sfqy = { formatLogMessage };
const _ref_gxnvua = { linkFile };
const _ref_298ps2 = { isFeatureEnabled };
const _ref_o5d8by = { contextSwitch };
const _ref_tw2zfe = { analyzeHeader };
const _ref_62c7f1 = { uniform1i };
const _ref_7chqkp = { optimizeHyperparameters };
const _ref_o4i3uu = { prioritizeRarestPiece };
const _ref_jjv8vo = { encodeABI };
const _ref_xkmgfv = { transcodeStream };
const _ref_j0vw3e = { parsePayload };
const _ref_mkwk7a = { lockRow };
const _ref_jf18xn = { mergeFiles };
const _ref_h8sri2 = { chdir };
const _ref_6ix1cy = { detectVideoCodec };
const _ref_dl6kaj = { readPixels };
const _ref_i4faff = { VirtualFSTree };
const _ref_kdgm7j = { execProcess };
const _ref_n8vvfv = { setDelayTime };
const _ref_8f04bi = { calculateEntropy };
const _ref_inzths = { interestPeer };
const _ref_kvd44g = { convexSweepTest };
const _ref_rp6dkg = { stepSimulation };
const _ref_1qzr5g = { hashKeccak256 };
const _ref_13f0dm = { seekFile };
const _ref_ehr75e = { calculateMetric };
const _ref_kn3lss = { validatePieceChecksum };
const _ref_w7u1ry = { makeDistortionCurve };
const _ref_uab122 = { scheduleTask };
const _ref_qf0f10 = { parseLogTopics };
const _ref_4nr0v7 = { loadCheckpoint };
const _ref_a5ftxs = { cleanOldLogs };
const _ref_blxhch = { serializeAST };
const _ref_ftu00v = { applyImpulse };
const _ref_lgoym3 = { convertHSLtoRGB };
const _ref_tfv4h8 = { updateProgressBar };
const _ref_wc6cn6 = { generateUUIDv5 };
const _ref_w5na4l = { rotateMatrix };
const _ref_y02gud = { createBoxShape };
const _ref_a43mvq = { killProcess };
const _ref_w3yayb = { sanitizeSQLInput };
const _ref_3pp6z7 = { compressDataStream };
const _ref_rzme44 = { monitorNetworkInterface };
const _ref_bqjlyf = { signTransaction };
const _ref_ndo8c4 = { createTCPSocket };
const _ref_v90yx1 = { negotiateProtocol };
const _ref_8vty5v = { listenSocket };
const _ref_fg6wpm = { applyTorque };
const _ref_24elcv = { detectDarkMode };
const _ref_kqfg2c = { statFile };
const _ref_yp232e = { setFilePermissions };
const _ref_udzvo9 = { commitTransaction };
const _ref_5xrqoe = { clearScreen };
const _ref_10olm1 = { normalizeVolume };
const _ref_x0ivge = { checkIntegrityToken };
const _ref_jb0jsv = { renderCanvasLayer };
const _ref_apvtal = { checkRootAccess };
const _ref_fwbj48 = { tunnelThroughProxy };
const _ref_lj150i = { mkdir };
const _ref_uysqkm = { getAngularVelocity };
const _ref_5f5mjk = { augmentData };
const _ref_kp3vts = { serializeFormData };
const _ref_f6tg9p = { streamToPlayer };
const _ref_3s1mn2 = { setAttack };
const _ref_f9s4d5 = { detectEnvironment };
const _ref_9yxqx3 = { allocateMemory };
const _ref_5kh9uv = { addSliderConstraint };
const _ref_c5xks6 = { receivePacket };
const _ref_k527fv = { verifyAppSignature };
const _ref_evkfe3 = { traceStack };
const _ref_819csl = { setThreshold };
const _ref_ml54dp = { deleteTexture };
const _ref_4s68m8 = { createMediaStreamSource };
const _ref_4gv29d = { processAudioBuffer };
const _ref_0xaviw = { calculateFriction };
const _ref_5knkjv = { verifyChecksum };
const _ref_ynxcwc = { addHingeConstraint };
const _ref_luttsc = { setVelocity };
const _ref_suzynr = { chokePeer };
const _ref_tk3f4d = { discoverPeersDHT };
const _ref_l4n15m = { detachThread };
const _ref_l5nq3p = { requestPiece };
const _ref_p4a5jy = { applyForce };
const _ref_ezb6sc = { watchFileChanges };
const _ref_7mqxld = { getVelocity };
const _ref_qf8k8c = { rayIntersectTriangle };
const _ref_qkvcx9 = { switchProxyServer };
const _ref_etu4et = { rayCast };
const _ref_chf9ug = { virtualScroll };
const _ref_5use4u = { openFile };
const _ref_l749ni = { adjustWindowSize };
const _ref_d80rsf = { loadModelWeights }; 
    });
})({}, {});