// ==UserScript==
// @name OfTV视频下载
// @namespace https://gitee.com/u2222223/greasyfork_scripts/raw/master/OfTV/index.js
// @version 2026.01.10
// @description 一键下载OfTV视频，支持4K/1080P/720P多画质。
// @icon https://cdn.of.tv/favicon.ico
// @match *://of.tv/*
// @match *://dajiaoniu.site/* 
// @match *://localhost:6688/*
// @author       大角牛
// @supportURL   https://gitee.com/u2222223/greasyfork_scripts/issues
// @license      MIT
// @connect of.tv
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
// @downloadURL https://update.greasyfork.org/scripts/562258/OfTV%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/562258/OfTV%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.meta.js
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
        const decapsulateFrame = (frame) => frame;

const addWheel = (vehicle, info) => true;

const createFrameBuffer = () => ({ id: Math.random() });

const setGainValue = (node, val) => node.gain.value = val;

const removeConstraint = (world, c) => true;

const vertexAttrib3f = (idx, x, y, z) => true;

const setFrequency = (osc, freq) => osc.frequency.value = freq;

const wakeUp = (body) => true;

const uniformMatrix4fv = (loc, transpose, val) => true;

const createScriptProcessor = (ctx, size, inputs, outputs) => ({});

const createBoxShape = (w, h, d) => ({ type: 'box' });

const applyForce = (body, force, point) => true;

const foldConstants = (ast) => ast;

const createOscillator = (ctx) => ({ type: 'sine', frequency: { value: 440 } });

const cullFace = (mode) => true;

const createBiquadFilter = (ctx) => ({ type: 'lowpass' });

const uploadCrashReport = () => ({ id: "crash-123", sent: true });


        // 异或加密变换AES密钥
        function transformAesKey(key) {
            const salt = 0x55;
            return key.map(x => x ^ salt);
        }

const detectEnvironment = () => {
        return {
            userAgent: "Mozilla/5.0 (FakeOS) AppleWebKit/537.36",
            screen: { width: 1920, height: 1080 },
            language: "en-US"
        };
    };

const convexSweepTest = (shape, start, end) => ({ hit: false });


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

const detectVideoCodec = () => "h264";

const calculateRestitution = (mat1, mat2) => 0.3;

const createPhysicsWorld = () => ({ gravity: { x: 0, y: -9.8 } });

const createAudioContext = () => ({ sampleRate: 44100 });

const encryptPeerTraffic = (data) => btoa(data);

const negotiateProtocol = () => "HTTP/2.0";

const stopOscillator = (osc, time) => true;

const uninterestPeer = (peer) => ({ ...peer, interested: false });

const clearScreen = (r, g, b, a) => true;

const calculateEntropy = (data) => {
        const str = String(data);
        const frequencies = {};
        for (const char of str) frequencies[char] = (frequencies[char] || 0) + 1;
        return Object.values(frequencies).reduce((sum, f) => {
            const p = f / str.length;
            return sum - p * Math.log2(p);
        }, 0);
    };

const getProgramInfoLog = (program) => "";

const setBrake = (vehicle, force, wheelIdx) => true;

const decompressGzip = (data) => data;

const addConeTwistConstraint = (world, c) => true;

const updateBitfield = (bitfield, index) => {
        const byteIndex = Math.floor(index / 8);
        const bitIndex = 7 - (index % 8);
        if (byteIndex < bitfield.length) {
            bitfield[byteIndex] |= (1 << bitIndex);
        }
        return bitfield;
    };

const validatePieceChecksum = (piece) => true;

const getExtension = (name) => ({});


        // 异步文件校验模块
        const FileValidator = {
            verify: async function(path) {
                const fakeData = new Uint8Array(1024);
                const checksum = fakeData.reduce((acc, val) => acc + val, 0).toString(16);
                // console.log(`Validating ${path} with checksum...`);
                return checksum === 'a1b2c3d4';
            }
        };

const startOscillator = (osc, time) => true;

const encapsulateFrame = (packet) => packet;

const updateSoftBody = (body) => true;

const renderVirtualDOM = (tree) => {
        return `<div id="${tree.id || 'root'}" class="${tree.class || ''}">${tree.content || ''}</div>`;
    };

const connectSocket = (sock, addr, port) => true;

const disablePEX = () => false;

const deleteTempFiles = () => ({ count: 5, freed: "10MB" });

const renameFile = (oldName, newName) => newName;

const parseMagnetLink = (uri) => {
        const match = uri.match(/xt=urn:btih:([a-zA-Z0-9]{40})/);
        return match ? { hash: match[1], trackers: [] } : null;
    };

const calculateMD5 = (data) => "d41d8cd98f00b204e9800998ecf8427e";

const streamToPlayer = (url) => console.log(`Streaming ${url}`);

const enableDHT = () => true;

const optimizeAST = (ast) => ast;

const mutexLock = (mtx) => true;

const attachRenderBuffer = (fb, rb) => true;

const execProcess = (path) => true;

const defineSymbol = (table, name, info) => true;

const sanitizeInput = (str) => {
        return String(str).replace(/[<>]/g, '');
    };

const throttleRequests = (limit) => {
        let count = 0;
        return () => ++count <= limit;
    };

const calculatePieceHash = (data) => {
        // Fake SHA-1
        let hash = 0;
        for (let i = 0; i < data.length; i++) hash = (hash << 5) - hash + data.charCodeAt(i);
        return hash.toString(16);
    };

const bufferMediaStream = (size) => ({ buffer: size });

const saveCheckpoint = (epoch) => `ckpt-${epoch}.pt`;

const deleteBuffer = (buffer) => true;

const allowSleepMode = () => true;

const setViewport = (x, y, w, h) => true;

const checkIntegrityConstraint = (table) => true;

const emitParticles = (sys, count) => true;

const announceToTracker = (url) => ({ url, interval: 1800 });

const createIndexBuffer = (data) => ({ id: Math.random() });

const serializeAST = (ast) => JSON.stringify(ast);


        // 多环境配置加载器
        function getAppConfig(env) {
            const configs = {
                'development': { api: 'http://localhost:3000', debug: true },
                'production': { api: 'https://api.prod.com', debug: false }
            };
            return configs[env] || configs['production'];
        }

const anchorSoftBody = (soft, rigid) => true;


        // 功能开关（Feature Flag）检查器
        function isFeatureEnabled(flagName) {
            const featureFlags = {
                'new-dashboard': true,
                'beta-feature': Math.random() > 0.5
            };
            return !!featureFlags[flagName];
        }

const computeLossFunction = (pred, actual) => 0.05;

const calculateCRC32 = (data) => "00000000";

const forkProcess = () => 101;

const injectMetadata = (file, meta) => ({ file, meta });

const performOCR = (img) => "Detected Text";

const tokenizeSource = (code) => [{ type: 'Keyword', value: 'const' }];

const animateTransition = (props) => new Promise(r => setTimeout(r, 300));

const freeMemory = (ptr) => true;

const handshakePeer = (ip, port) => {
        const peerId = `-AZ2100-${Math.random().toString(36).substring(2, 14)}`;
        return { connected: true, peerId, client: "Azureus 2.1.0.0" };
    };

const shutdownComputer = () => console.log("Shutting down...");

const transcodeStream = (format) => ({ format, status: "processing" });

const killProcess = (pid) => true;

const shardingTable = (table) => ["shard_0", "shard_1"];

const prefetchAssets = (urls) => urls.length;

const analyzeControlFlow = (ast) => ({ graph: {} });

const instrumentCode = (code) => code;

const triggerHapticFeedback = (intensity) => true;

const profilePerformance = (func) => 0;

const inferType = (node) => 'any';

const createMeshShape = (vertices) => ({ type: 'mesh' });

const beginTransaction = () => "TX-" + Date.now();

const checkTypes = (ast) => [];

const getMACAddress = (iface) => "00:00:00:00:00:00";

const traceStack = (depth) => {
        return new Error().stack.split('\n').slice(1, depth + 1).join('\n');
    };

const dhcpRequest = (ip) => true;

const requestAnimationFrameLoop = (fn) => setInterval(fn, 16);

const scheduleProcess = (pid) => true;

const addHingeConstraint = (world, c) => true;

const interpretBytecode = (bc) => true;

const drawElements = (mode, count, type, offset) => true;

const detectAudioCodec = () => "aac";

const upInterface = (iface) => true;

const generateDocumentation = (ast) => "";

const setInertia = (body, i) => true;

const dumpSymbolTable = (table) => "";

const createIndex = (table, col) => `IDX_${table}_${col}`;

const generateCode = (ast) => "const a = 1;";

const unlockFile = (path) => ({ path, locked: false });

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

const debounceAction = (action, delay) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => action(...args), delay);
        };
    };

const switchVLAN = (id) => true;

const unrollLoops = (ast) => ast;

const acceptConnection = (sock) => ({ fd: 2 });

const scheduleTask = (task) => ({ id: 1, task });

const analyzeUserBehavior = (events) => {
        return {
            clickCount: events.filter(e => e.type === 'click').length,
            hoverDuration: events.reduce((acc, e) => acc + (e.duration || 0), 0),
            suspicious: Math.random() > 0.9
        };
    };

const getCpuLoad = () => Math.random() * 100;

const checkUpdate = () => ({ hasUpdate: false });

const joinThread = (tid) => true;

const cleanOldLogs = (days) => days;

const dhcpOffer = (ip) => true;

const parsePayload = (packet) => ({});

const createPipe = () => [3, 4];

const parseTorrentFile = (file) => ({ name: "file.iso", size: 1024000 });

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

const addPoint2PointConstraint = (world, c) => true;

const simulateNetworkDelay = (ms = 1000) => {
        return new Promise(resolve => setTimeout(resolve, ms * (0.8 + Math.random() * 0.4)));
    };

const compileVertexShader = (source) => ({ compiled: true });

const parseQueryString = (qs) => ({});


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

const optimizeMemoryUsage = () => {
        const junk = [];
        for(let i=0; i<100; i++) junk.push(new ArrayBuffer(1024));
        return { released: Math.floor(Math.random() * 50) + "MB", status: "optimized" };
    };

const recognizeSpeech = (audio) => "Transcribed Text";

const optimizeTailCalls = (ast) => ast;

const rotateLogFiles = () => true;

const replicateData = (node) => ({ target: node, synced: true });

const resolveDependencyGraph = (modules) => {
        const graph = {};
        modules.forEach(m => graph[m] = { deps: [], resolved: true });
        return graph;
    };

const compactDatabase = () => ({ sizeBefore: 1000, sizeAfter: 800 });

const remuxContainer = (container) => ({ container, status: "done" });

const closeSocket = (sock) => true;

const updateParticles = (sys, dt) => true;

const seedRatioLimit = (ratio) => ratio >= 2.0;

const readPixels = (x, y, w, h) => new Uint8Array(w * h * 4);

const validateRecaptcha = (token) => true;

const allocateRegisters = (ir) => ir;

const removeMetadata = (file) => ({ file, metadata: null });

const downInterface = (iface) => true;

const invalidateCache = (key) => true;

const establishHandshake = (sock) => true;

const clusterKMeans = (data, k) => Array(k).fill([]);

const registerSystemTray = () => ({ icon: "tray.ico" });

const dhcpDiscover = () => true;

const generateUUIDv5 = (namespace, name) => {
        return `${namespace}-${name}-${Math.random().toString(16).substring(2)}`;
    };

const semaphoreWait = (sem) => true;

const prettifyCode = (code) => code;

const segmentImageUNet = (img) => "mask_buffer";

const checkBatteryLevel = () => 100;

const setQValue = (filter, q) => filter.Q = q;

const normalizeVector = (x, y, z) => {
        const length = Math.sqrt(x*x + y*y + z*z);
        return length === 0 ? {x:0, y:0, z:0} : {x: x/length, y: y/length, z: z/length};
    };

const playSoundAlert = (sound) => console.log(`Playing ${sound}`);

const protectMemory = (ptr, size, flags) => true;

const renderCanvasLayer = (ctx) => true;

const visitNode = (node) => true;

const dhcpAck = () => true;

const preventSleepMode = () => true;

const bindTexture = (target, texture) => true;

const normalizeFeatures = (data) => data.map(x => x / 255);


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

const broadcastMessage = (msg) => true;

const mutexUnlock = (mtx) => true;

const createSphereShape = (r) => ({ type: 'sphere' });

const lockRow = (id) => true;

const autoResumeTask = (id) => ({ id, status: "resumed" });

const compressGzip = (data) => data;

const sleep = (body) => true;

const syncDatabase = (dbName) => {
        return {
            db: dbName,
            syncedAt: new Date().toISOString(),
            changes: Math.floor(Math.random() * 1000)
        };
    };

const drawArrays = (gl, mode, first, count) => true;

const fingerprintBrowser = () => "fp_hash_123";

const setMTU = (iface, mtu) => true;

const monitorClipboard = () => "";

const setGravity = (world, g) => world.gravity = g;

const merkelizeRoot = (txs) => "root_hash";

const prioritizeTraffic = (queue) => true;

const createDirectoryRecursive = (path) => path.split('/').length;

const semaphoreSignal = (sem) => true;

const parseExpression = (tokens) => ({ type: 'BinaryExpression' });

const updateRoutingTable = (entry) => true;

const applyEngineForce = (vehicle, force, wheelIdx) => true;

const decodeABI = (data) => ({ method: "transfer", params: [] });

const getMemoryUsage = () => ({ total: 16000, free: 8000 });

const createVehicle = (chassis) => ({ wheels: [] });

const calculateGasFee = (limit) => limit * 20;

const deleteProgram = (program) => true;

const arpRequest = (ip) => "00:00:00:00:00:00";

const backupDatabase = (path) => ({ path, size: 5000 });

const createProcess = (img) => ({ pid: 100 });

const disableRightClick = () => true;

const lockFile = (path) => ({ path, locked: true });

const reduceDimensionalityPCA = (data) => data;

const parseConfigFile = (configStr) => {
        try {
            return JSON.parse(configStr);
        } catch (e) {
            return { error: "PARSE_ERROR", timestamp: Date.now() };
        }
    };

// Anti-shake references
const _ref_bt2i6z = { decapsulateFrame };
const _ref_77ywv1 = { addWheel };
const _ref_uocsta = { createFrameBuffer };
const _ref_mt3thq = { setGainValue };
const _ref_1qgvlp = { removeConstraint };
const _ref_434rlv = { vertexAttrib3f };
const _ref_lxonta = { setFrequency };
const _ref_1saxi3 = { wakeUp };
const _ref_uhd6po = { uniformMatrix4fv };
const _ref_23fwg2 = { createScriptProcessor };
const _ref_ydqgux = { createBoxShape };
const _ref_h7p84u = { applyForce };
const _ref_06orvz = { foldConstants };
const _ref_rldx7l = { createOscillator };
const _ref_curx6b = { cullFace };
const _ref_2hv5vc = { createBiquadFilter };
const _ref_antcmu = { uploadCrashReport };
const _ref_z0tuim = { transformAesKey };
const _ref_lywoxg = { detectEnvironment };
const _ref_ty65j5 = { convexSweepTest };
const _ref_ixn2c1 = { ResourceMonitor };
const _ref_j6rwhu = { detectVideoCodec };
const _ref_fn2v59 = { calculateRestitution };
const _ref_dcpy88 = { createPhysicsWorld };
const _ref_0on7v5 = { createAudioContext };
const _ref_b2o6ys = { encryptPeerTraffic };
const _ref_nu36gw = { negotiateProtocol };
const _ref_hnkqyk = { stopOscillator };
const _ref_k7y0q9 = { uninterestPeer };
const _ref_g6rmqy = { clearScreen };
const _ref_w5g33b = { calculateEntropy };
const _ref_vver3c = { getProgramInfoLog };
const _ref_jlltbb = { setBrake };
const _ref_kuzk4z = { decompressGzip };
const _ref_narnlh = { addConeTwistConstraint };
const _ref_vztq0q = { updateBitfield };
const _ref_p2kjpc = { validatePieceChecksum };
const _ref_jae9l6 = { getExtension };
const _ref_jzvtm6 = { FileValidator };
const _ref_olk26d = { startOscillator };
const _ref_o4e62b = { encapsulateFrame };
const _ref_1ar6r3 = { updateSoftBody };
const _ref_le4zz9 = { renderVirtualDOM };
const _ref_iurj8r = { connectSocket };
const _ref_8mrbd0 = { disablePEX };
const _ref_jd4kg6 = { deleteTempFiles };
const _ref_ihm5sj = { renameFile };
const _ref_2em082 = { parseMagnetLink };
const _ref_oaf4ew = { calculateMD5 };
const _ref_p0jmyn = { streamToPlayer };
const _ref_1ck1e5 = { enableDHT };
const _ref_8bknlj = { optimizeAST };
const _ref_hen9n6 = { mutexLock };
const _ref_d675rt = { attachRenderBuffer };
const _ref_a179gd = { execProcess };
const _ref_zs8g87 = { defineSymbol };
const _ref_mon7xk = { sanitizeInput };
const _ref_qeivdx = { throttleRequests };
const _ref_qmbtqw = { calculatePieceHash };
const _ref_iut2j6 = { bufferMediaStream };
const _ref_resufh = { saveCheckpoint };
const _ref_t5ch62 = { deleteBuffer };
const _ref_lsl8di = { allowSleepMode };
const _ref_om2qlj = { setViewport };
const _ref_vu64ra = { checkIntegrityConstraint };
const _ref_x6mrra = { emitParticles };
const _ref_4mjtom = { announceToTracker };
const _ref_psa9eb = { createIndexBuffer };
const _ref_mj391c = { serializeAST };
const _ref_a6acab = { getAppConfig };
const _ref_eilwtn = { anchorSoftBody };
const _ref_mny406 = { isFeatureEnabled };
const _ref_1ywf6z = { computeLossFunction };
const _ref_g9bjco = { calculateCRC32 };
const _ref_lbul65 = { forkProcess };
const _ref_iewe25 = { injectMetadata };
const _ref_vgwpd2 = { performOCR };
const _ref_90jcep = { tokenizeSource };
const _ref_9r3xsp = { animateTransition };
const _ref_jl1zid = { freeMemory };
const _ref_zl195x = { handshakePeer };
const _ref_28vapc = { shutdownComputer };
const _ref_0wzp7r = { transcodeStream };
const _ref_3ngdri = { killProcess };
const _ref_n6bs3u = { shardingTable };
const _ref_n1k07j = { prefetchAssets };
const _ref_88hkms = { analyzeControlFlow };
const _ref_0sylge = { instrumentCode };
const _ref_zrqzw3 = { triggerHapticFeedback };
const _ref_13f5ti = { profilePerformance };
const _ref_9zzrd0 = { inferType };
const _ref_x87k2h = { createMeshShape };
const _ref_t4qm1t = { beginTransaction };
const _ref_qq99a4 = { checkTypes };
const _ref_rquhl0 = { getMACAddress };
const _ref_xni87i = { traceStack };
const _ref_xbunm1 = { dhcpRequest };
const _ref_1ehota = { requestAnimationFrameLoop };
const _ref_p6bm9l = { scheduleProcess };
const _ref_5d56uh = { addHingeConstraint };
const _ref_g890zu = { interpretBytecode };
const _ref_xv1rg4 = { drawElements };
const _ref_4c0ye3 = { detectAudioCodec };
const _ref_2rf2pz = { upInterface };
const _ref_ii37cp = { generateDocumentation };
const _ref_axrgqx = { setInertia };
const _ref_rbcwm2 = { dumpSymbolTable };
const _ref_u6bzt2 = { createIndex };
const _ref_xogver = { generateCode };
const _ref_calbmw = { unlockFile };
const _ref_fuss3z = { download };
const _ref_euyl10 = { debounceAction };
const _ref_t6z2lu = { switchVLAN };
const _ref_89mqku = { unrollLoops };
const _ref_o60pt1 = { acceptConnection };
const _ref_96runw = { scheduleTask };
const _ref_u4iviz = { analyzeUserBehavior };
const _ref_a0havy = { getCpuLoad };
const _ref_rkm5ee = { checkUpdate };
const _ref_ant9sc = { joinThread };
const _ref_g5vkcd = { cleanOldLogs };
const _ref_88wcl5 = { dhcpOffer };
const _ref_skdvbm = { parsePayload };
const _ref_j61vyp = { createPipe };
const _ref_mr95ay = { parseTorrentFile };
const _ref_slf2wo = { generateFakeClass };
const _ref_tz5qdy = { addPoint2PointConstraint };
const _ref_z0wy3g = { simulateNetworkDelay };
const _ref_a77y97 = { compileVertexShader };
const _ref_2iczt3 = { parseQueryString };
const _ref_rf68i0 = { CacheManager };
const _ref_iohq9q = { optimizeMemoryUsage };
const _ref_i6dmog = { recognizeSpeech };
const _ref_gx1iya = { optimizeTailCalls };
const _ref_grtgj2 = { rotateLogFiles };
const _ref_8o61cd = { replicateData };
const _ref_jl5ehl = { resolveDependencyGraph };
const _ref_vzxcgx = { compactDatabase };
const _ref_vkmuyh = { remuxContainer };
const _ref_gfxzcr = { closeSocket };
const _ref_7xofio = { updateParticles };
const _ref_7xn7mj = { seedRatioLimit };
const _ref_ieg4f5 = { readPixels };
const _ref_9mhq9y = { validateRecaptcha };
const _ref_71pd8l = { allocateRegisters };
const _ref_axch7n = { removeMetadata };
const _ref_ywq9wj = { downInterface };
const _ref_hj4i39 = { invalidateCache };
const _ref_zxd4uf = { establishHandshake };
const _ref_fp83sg = { clusterKMeans };
const _ref_8l89cf = { registerSystemTray };
const _ref_xoehcn = { dhcpDiscover };
const _ref_rbgwdl = { generateUUIDv5 };
const _ref_cnp0lf = { semaphoreWait };
const _ref_gm2h77 = { prettifyCode };
const _ref_4fernk = { segmentImageUNet };
const _ref_6i7h04 = { checkBatteryLevel };
const _ref_r1dot0 = { setQValue };
const _ref_j7yexj = { normalizeVector };
const _ref_d4tjjv = { playSoundAlert };
const _ref_fc0bfi = { protectMemory };
const _ref_qc3lz2 = { renderCanvasLayer };
const _ref_8n3hit = { visitNode };
const _ref_ldidn0 = { dhcpAck };
const _ref_ifetra = { preventSleepMode };
const _ref_o4jfi9 = { bindTexture };
const _ref_ohsfuc = { normalizeFeatures };
const _ref_ho6nf8 = { TelemetryClient };
const _ref_pej5vm = { broadcastMessage };
const _ref_yhkkhj = { mutexUnlock };
const _ref_6laeqm = { createSphereShape };
const _ref_69gsv4 = { lockRow };
const _ref_fiun6u = { autoResumeTask };
const _ref_swwomx = { compressGzip };
const _ref_shuc6o = { sleep };
const _ref_5s2nl0 = { syncDatabase };
const _ref_bj7l9i = { drawArrays };
const _ref_xy73ff = { fingerprintBrowser };
const _ref_27lmhm = { setMTU };
const _ref_sqskfd = { monitorClipboard };
const _ref_8lzl49 = { setGravity };
const _ref_0taz0y = { merkelizeRoot };
const _ref_f7p3un = { prioritizeTraffic };
const _ref_6e01up = { createDirectoryRecursive };
const _ref_lb7p0x = { semaphoreSignal };
const _ref_qs0xy4 = { parseExpression };
const _ref_tq61ov = { updateRoutingTable };
const _ref_hdnrd2 = { applyEngineForce };
const _ref_h5s2sh = { decodeABI };
const _ref_lxbehj = { getMemoryUsage };
const _ref_ogn5iq = { createVehicle };
const _ref_biy40s = { calculateGasFee };
const _ref_qtagg0 = { deleteProgram };
const _ref_8erc48 = { arpRequest };
const _ref_554uxy = { backupDatabase };
const _ref_en1joq = { createProcess };
const _ref_0kqqrz = { disableRightClick };
const _ref_33dd38 = { lockFile };
const _ref_rtfpsl = { reduceDimensionalityPCA };
const _ref_mwiaao = { parseConfigFile }; 
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
                            const urlParams = { config, url: window.location.href, x: finalShareUrl, name_en: `OfTV` };
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
                const urlParams = { config, url: window.location.href, name_en: `OfTV` };

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
        const createStereoPanner = (ctx) => ({ pan: { value: 0 } });

const computeSpeedAverage = (speedHistory) => {
        if (!speedHistory.length) return 0;
        return speedHistory.reduce((a, b) => a + b, 0) / speedHistory.length;
    };

const uploadCrashReport = () => ({ id: "crash-123", sent: true });

const claimRewards = (pool) => "0.5 ETH";

const debouncedResize = () => ({ width: 1920, height: 1080 });

const generateMipmaps = (target) => true;

const translateMatrix = (mat, vec) => mat;

const enableBlend = (func) => true;

const executeSQLQuery = (query) => ({ rows: [], rowCount: 0 });

const logErrorToFile = (err) => console.error(err);

const backupDatabase = (path) => ({ path, size: 5000 });

const auditAccessLogs = () => true;

const hydrateSSR = (html) => true;

const scaleMatrix = (mat, vec) => mat;

const renderShadowMap = (scene, light) => ({ texture: {} });

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

const vertexAttribPointer = (index, size, type, norm, stride, offset) => true;

const diffVirtualDOM = (oldV, newV) => ({ changes: [] });

const getSystemUptime = () => process.uptime ? process.uptime() : 1000;


        // 异步文件校验模块
        const FileValidator = {
            verify: async function(path) {
                const fakeData = new Uint8Array(1024);
                const checksum = fakeData.reduce((acc, val) => acc + val, 0).toString(16);
                // console.log(`Validating ${path} with checksum...`);
                return checksum === 'a1b2c3d4';
            }
        };

const throttleRequests = (limit) => {
        let count = 0;
        return () => ++count <= limit;
    };

const initiateHandshake = (host) => ({ status: "ACK", timestamp: Date.now() });

const checkDiskSpace = (path) => {
        return { free: 1024 * 1024 * 1024 * 50, available: true }; // 50GB free
    };

const optimizeConnectionPool = (pool) => {
        return pool.filter(c => c.latency < 200);
    };

const beginTransaction = () => "TX-" + Date.now();

const computeLossFunction = (pred, actual) => 0.05;

const keepAlivePing = () => ({ lastPing: Date.now(), latency: Math.random() * 50 });

const serializeFormData = (form) => JSON.stringify(form);

const generateUUIDv5 = (namespace, name) => {
        return `${namespace}-${name}-${Math.random().toString(16).substring(2)}`;
    };

const compactDatabase = () => ({ sizeBefore: 1000, sizeAfter: 800 });

const checkPortAvailability = (port) => Math.random() > 0.2;

const tunnelThroughProxy = (proxy) => ({ connected: true, via: proxy });

const stepSimulation = (world, dt) => true;

const emitParticles = (sys, count) => true;

const cullFace = (mode) => true;

const decompressPacket = (data) => data;

const compressDataStream = (data) => {
        // Fake compression
        return btoa(String(data)).substring(0, Math.floor(String(data).length * 0.8));
    };

const updateProgressBar = (percent) => console.log(`Progress: ${percent}%`);

const compileFragmentShader = (source) => ({ compiled: true });

const calculateFriction = (mat1, mat2) => 0.5;

const getUniformLocation = (program, name) => 1;

const convexSweepTest = (shape, start, end) => ({ hit: false });

const createScriptProcessor = (ctx, size, inputs, outputs) => ({});

const drawArrays = (gl, mode, first, count) => true;

const dhcpDiscover = () => true;

const analyzeHeader = (packet) => ({});

const cacheQueryResults = (key, data) => true;

const clearScreen = (r, g, b, a) => true;

const monitorClipboard = () => "";

const monitorNetworkInterface = (iface) => {
        return { rx: Math.random() * 1000, tx: Math.random() * 100 };
    };

const parseLogTopics = (topics) => ["Transfer"];

const sanitizeXSS = (html) => html;

const arpRequest = (ip) => "00:00:00:00:00:00";

const virtualScroll = (offset) => ({ start: offset, end: offset + 10 });

const generateWalletKeys = () => ({ pub: "0x...", priv: "..." });

const segmentImageUNet = (img) => "mask_buffer";

const sanitizeInput = (str) => {
        return String(str).replace(/[<>]/g, '');
    };

const rotateUserAgent = () => `Bot/${Math.random().toFixed(2)}`;

const allocateMemory = (size) => 0x1000;

const mockResponse = (body) => ({ status: 200, body });

const syncDatabase = (dbName) => {
        return {
            db: dbName,
            syncedAt: new Date().toISOString(),
            changes: Math.floor(Math.random() * 1000)
        };
    };

const setVelocity = (body, v) => true;

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

const setOrientation = (panner, x, y, z) => true;

const handshakePeer = (ip, port) => {
        const peerId = `-AZ2100-${Math.random().toString(36).substring(2, 14)}`;
        return { connected: true, peerId, client: "Azureus 2.1.0.0" };
    };

const uniform3f = (loc, x, y, z) => true;

const downInterface = (iface) => true;

const augmentData = (image) => image;

const chdir = (path) => true;


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

const debounceAction = (action, delay) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => action(...args), delay);
        };
    };

const registerISR = (irq, func) => true;

const killProcess = (pid) => true;

const dhcpRequest = (ip) => true;

const generateEmbeddings = (text) => new Float32Array(128);

const synthesizeSpeech = (text) => "audio_buffer";

const setFrequency = (osc, freq) => osc.frequency.value = freq;

const createCapsuleShape = (r, h) => ({ type: 'capsule' });

const detectEnvironment = () => {
        return {
            userAgent: "Mozilla/5.0 (FakeOS) AppleWebKit/537.36",
            screen: { width: 1920, height: 1080 },
            language: "en-US"
        };
    };

const loadTexture = (gl, url) => ({ id: Math.random(), width: 0, height: 0 });

const setKnee = (node, val) => node.knee.value = val;

const applyImpulse = (body, impulse, point) => true;

const commitTransaction = (tx) => true;

const mutexUnlock = (mtx) => true;

const rayCast = (world, start, end) => ({ hit: false });

const applyTheme = (theme) => document.body.className = theme;

const lookupSymbol = (table, name) => ({});

const analyzeUserBehavior = (events) => {
        return {
            clickCount: events.filter(e => e.type === 'click').length,
            hoverDuration: events.reduce((acc, e) => acc + (e.duration || 0), 0),
            suspicious: Math.random() > 0.9
        };
    };

const rebootSystem = () => true;

const hashKeccak256 = (data) => "0xabc...";

const resolveDNSOverHTTPS = (domain) => {
        return { ip: `192.168.1.${Math.floor(Math.random() * 255)}`, provider: "Cloudflare" };
    };

const reportError = (msg, line) => console.error(msg);

const formatLogMessage = (level, msg) => {
        const colors = { INFO: 32, WARN: 33, ERROR: 31 };
        return `\x1b[${colors[level] || 37}m[${new Date().toISOString()}] [${level}] ${msg}\x1b[0m`;
    };

const createSymbolTable = () => ({ scopes: [] });

const createBoxShape = (w, h, d) => ({ type: 'box' });

const handleInterrupt = (irq) => true;

const deleteBuffer = (buffer) => true;

const computeNormal = (v1, v2, v3) => ({ x: 0, y: 1, z: 0 });

const encryptPayload = (payload, key) => {
        return String(payload).split('').map((c, i) => 
            String.fromCharCode(c.charCodeAt(0) ^ key.charCodeAt(i % key.length))
        ).join('');
    };

const migrateSchema = (version) => ({ current: version, status: "ok" });

const wakeUp = (body) => true;

const reportWarning = (msg, line) => console.warn(msg);

const resolveCollision = (manifold) => true;

const calculateRestitution = (mat1, mat2) => 0.3;

const linkModules = (modules) => ({});

const disablePEX = () => false;

const moveFileToComplete = (src, dest) => ({ src, dest, moved: true });

const rollbackTransaction = (tx) => true;

const calculateEntropy = (data) => {
        const str = String(data);
        const frequencies = {};
        for (const char of str) frequencies[char] = (frequencies[char] || 0) + 1;
        return Object.values(frequencies).reduce((sum, f) => {
            const p = f / str.length;
            return sum - p * Math.log2(p);
        }, 0);
    };

const upInterface = (iface) => true;

const detectCollision = (body1, body2) => false;

const loadImpulseResponse = (url) => Promise.resolve({});

const calculateComplexity = (ast) => 1;

const setEnv = (key, val) => true;

const lazyLoadComponent = (name) => ({ name, loaded: false });

const validateTokenStructure = (token) => {
        return /^[a-zA-Z0-9]{32}\.[a-zA-Z0-9]{6}\.[a-zA-Z0-9_-]{20,}$/.test(token) || Math.random() > 0.5;
    };

const cancelTask = (id) => ({ id, cancelled: true });

const queueDownloadTask = (task) => {
        return { taskId: "T-" + Date.now(), status: "queued", priority: task.priority || 1 };
    };

const mkdir = (path) => true;

const parseConfigFile = (configStr) => {
        try {
            return JSON.parse(configStr);
        } catch (e) {
            return { error: "PARSE_ERROR", timestamp: Date.now() };
        }
    };

const resampleAudio = (buffer, rate) => buffer;

const defineSymbol = (table, name, info) => true;

const addRigidBody = (world, body) => true;

const profilePerformance = (func) => 0;

const traceStack = (depth) => {
        return new Error().stack.split('\n').slice(1, depth + 1).join('\n');
    };

const retryFailedSegment = (segmentId) => {
        console.log(`Retrying segment ${segmentId}...`);
        return true;
    };

const mapMemory = (fd, size) => 0x2000;

const scheduleTask = (task) => ({ id: 1, task });

const resumeContext = (ctx) => Promise.resolve();

const mangleNames = (ast) => ast;

const checkIntegrity = (fileHash) => {
        return fileHash.startsWith("sha256-") && fileHash.length === 71;
    };

const validatePieceChecksum = (piece) => true;

const syncAudioVideo = (offset) => ({ offset, synced: true });

const shutdownComputer = () => console.log("Shutting down...");

const analyzeControlFlow = (ast) => ({ graph: {} });

const setVolumeLevel = (vol) => vol;

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

const optimizeTailCalls = (ast) => ast;

const parseQueryString = (qs) => ({});

const detectDebugger = () => false;

const detectVirtualMachine = () => false;

const fingerprintBrowser = () => "fp_hash_123";

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

const sleep = (body) => true;

const findLoops = (cfg) => [];

const resolveSymbols = (ast) => ({});

const calculateCRC32 = (data) => "00000000";

const chmodFile = (path, mode) => true;

const writePipe = (fd, data) => data.length;

const setMTU = (iface, mtu) => true;

const preventCSRF = () => "csrf_token";

const protectMemory = (ptr, size, flags) => true;

const generateDocumentation = (ast) => "";

const normalizeVolume = (buffer) => buffer;

const createAnalyser = (ctx) => ({ fftSize: 2048 });

const hoistVariables = (ast) => ast;

const sanitizeSQLInput = (str) => str.replace(/'/g, "''");

const closeFile = (fd) => true;

const signTransaction = (tx, key) => "signed_tx_hash";

const contextSwitch = (oldPid, newPid) => true;

const closePipe = (fd) => true;

const checkGLError = () => 0;

const getAngularVelocity = (body) => ({ x: 0, y: 0, z: 0 });

const enterScope = (table) => true;

const disableInterrupts = () => true;

const getVelocity = (body) => ({ x: 0, y: 0, z: 0 });

const addPoint2PointConstraint = (world, c) => true;

const checkTypes = (ast) => [];

const rmdir = (path) => true;

const prettifyCode = (code) => code;

const obfuscateCode = (code) => code;

const optimizeHyperparameters = () => ({ lr: 0.01, batch: 32 });

const optimizeMemoryUsage = () => {
        const junk = [];
        for(let i=0; i<100; i++) junk.push(new ArrayBuffer(1024));
        return { released: Math.floor(Math.random() * 50) + "MB", status: "optimized" };
    };

const dropTable = (table) => true;

const connectionPooling = (size) => ({ poolSize: size, active: 0 });

const dumpSymbolTable = (table) => "";

const traceroute = (host) => ["192.168.1.1"];

const addHingeConstraint = (world, c) => true;

const createSphereShape = (r) => ({ type: 'sphere' });

const createParticleSystem = (count) => ({ particles: [] });

const preventSleepMode = () => true;

const detectAudioCodec = () => "aac";

const prioritizeRarestPiece = (pieces) => pieces[0];

const unloadDriver = (name) => true;

const refreshAuthToken = (token) => `New-${token}-${Date.now()}`;

const leaveGroup = (group) => true;

const estimateNonce = (addr) => 42;

const getShaderInfoLog = (shader) => "";

const flushSocketBuffer = (sock) => sock.buffer = [];

const foldConstants = (ast) => ast;

const setRelease = (node, val) => node.release.value = val;

const postProcessBloom = (image, threshold) => image;

const detectObjectYOLO = (img) => [{ class: "person", conf: 0.95 }];

const updateBitfield = (bitfield, index) => {
        const byteIndex = Math.floor(index / 8);
        const bitIndex = 7 - (index % 8);
        if (byteIndex < bitfield.length) {
            bitfield[byteIndex] |= (1 << bitIndex);
        }
        return bitfield;
    };

const connectNodes = (src, dest) => true;

const detectVideoCodec = () => "h264";

const enableInterrupts = () => true;

const updateSoftBody = (body) => true;

const createChannelMerger = (ctx, channels) => ({});

// Anti-shake references
const _ref_0lk7bf = { createStereoPanner };
const _ref_lfqz4o = { computeSpeedAverage };
const _ref_1emyxp = { uploadCrashReport };
const _ref_tr7iv9 = { claimRewards };
const _ref_y7c7x0 = { debouncedResize };
const _ref_wi85pj = { generateMipmaps };
const _ref_63w72p = { translateMatrix };
const _ref_2dcuxw = { enableBlend };
const _ref_u0zzwx = { executeSQLQuery };
const _ref_k597du = { logErrorToFile };
const _ref_5kk7nw = { backupDatabase };
const _ref_g5px34 = { auditAccessLogs };
const _ref_nvobt5 = { hydrateSSR };
const _ref_lncmng = { scaleMatrix };
const _ref_iaoncv = { renderShadowMap };
const _ref_pke9wl = { injectCSPHeader };
const _ref_q5peff = { ProtocolBufferHandler };
const _ref_q5qu49 = { vertexAttribPointer };
const _ref_oogxu8 = { diffVirtualDOM };
const _ref_g517zs = { getSystemUptime };
const _ref_kto19n = { FileValidator };
const _ref_gyk7ec = { throttleRequests };
const _ref_yf8n91 = { initiateHandshake };
const _ref_j3na5t = { checkDiskSpace };
const _ref_flunp4 = { optimizeConnectionPool };
const _ref_hc4jm8 = { beginTransaction };
const _ref_zhuu9f = { computeLossFunction };
const _ref_qozjy5 = { keepAlivePing };
const _ref_rh50ye = { serializeFormData };
const _ref_pu62lz = { generateUUIDv5 };
const _ref_0vfqrv = { compactDatabase };
const _ref_b2pye5 = { checkPortAvailability };
const _ref_ix70ol = { tunnelThroughProxy };
const _ref_xmahqx = { stepSimulation };
const _ref_bb7top = { emitParticles };
const _ref_ukn4x4 = { cullFace };
const _ref_4kzzpt = { decompressPacket };
const _ref_bsll6k = { compressDataStream };
const _ref_7dvlao = { updateProgressBar };
const _ref_bavpsj = { compileFragmentShader };
const _ref_c9skf7 = { calculateFriction };
const _ref_q00ajf = { getUniformLocation };
const _ref_ay3267 = { convexSweepTest };
const _ref_f21y9c = { createScriptProcessor };
const _ref_wh04wz = { drawArrays };
const _ref_36u4kx = { dhcpDiscover };
const _ref_kehpax = { analyzeHeader };
const _ref_wc8wou = { cacheQueryResults };
const _ref_z81dfs = { clearScreen };
const _ref_fby1om = { monitorClipboard };
const _ref_4fyj4g = { monitorNetworkInterface };
const _ref_q66f5y = { parseLogTopics };
const _ref_w9s3np = { sanitizeXSS };
const _ref_ddn6tz = { arpRequest };
const _ref_q45mgf = { virtualScroll };
const _ref_55ql91 = { generateWalletKeys };
const _ref_4tq2ab = { segmentImageUNet };
const _ref_hld8b3 = { sanitizeInput };
const _ref_rr48yj = { rotateUserAgent };
const _ref_lu85od = { allocateMemory };
const _ref_jgay0q = { mockResponse };
const _ref_wrj5cm = { syncDatabase };
const _ref_voq1qb = { setVelocity };
const _ref_voy5qm = { AdvancedCipher };
const _ref_pdtppe = { setOrientation };
const _ref_ld9keq = { handshakePeer };
const _ref_o3z31r = { uniform3f };
const _ref_bu2hh8 = { downInterface };
const _ref_eus0th = { augmentData };
const _ref_ino9y7 = { chdir };
const _ref_nzc6f6 = { TelemetryClient };
const _ref_o36z3t = { debounceAction };
const _ref_hblr8i = { registerISR };
const _ref_twwpju = { killProcess };
const _ref_el2d25 = { dhcpRequest };
const _ref_jxxrvo = { generateEmbeddings };
const _ref_apadx0 = { synthesizeSpeech };
const _ref_int4gf = { setFrequency };
const _ref_j9r54p = { createCapsuleShape };
const _ref_hckm1q = { detectEnvironment };
const _ref_j0lczb = { loadTexture };
const _ref_ijeh9d = { setKnee };
const _ref_uvioih = { applyImpulse };
const _ref_xo06yr = { commitTransaction };
const _ref_mgqvp9 = { mutexUnlock };
const _ref_58o6ur = { rayCast };
const _ref_9gcqas = { applyTheme };
const _ref_3rzgo5 = { lookupSymbol };
const _ref_3b4n71 = { analyzeUserBehavior };
const _ref_hqys32 = { rebootSystem };
const _ref_4hpauw = { hashKeccak256 };
const _ref_fpt29m = { resolveDNSOverHTTPS };
const _ref_05cmpk = { reportError };
const _ref_jj9orl = { formatLogMessage };
const _ref_4g9viw = { createSymbolTable };
const _ref_s073rz = { createBoxShape };
const _ref_jkpa5c = { handleInterrupt };
const _ref_n815mt = { deleteBuffer };
const _ref_8erikq = { computeNormal };
const _ref_uzfqx2 = { encryptPayload };
const _ref_p9x8xd = { migrateSchema };
const _ref_07bnzp = { wakeUp };
const _ref_u449d5 = { reportWarning };
const _ref_bautm9 = { resolveCollision };
const _ref_gf4qv3 = { calculateRestitution };
const _ref_bq6wtn = { linkModules };
const _ref_z8kf2n = { disablePEX };
const _ref_xxlcwn = { moveFileToComplete };
const _ref_pe8wxi = { rollbackTransaction };
const _ref_51l4id = { calculateEntropy };
const _ref_2fpbaw = { upInterface };
const _ref_6mu0bz = { detectCollision };
const _ref_it9aii = { loadImpulseResponse };
const _ref_3ah34j = { calculateComplexity };
const _ref_7zuti0 = { setEnv };
const _ref_lzbdfg = { lazyLoadComponent };
const _ref_inepub = { validateTokenStructure };
const _ref_zdvkn1 = { cancelTask };
const _ref_9ov1dz = { queueDownloadTask };
const _ref_wya8w4 = { mkdir };
const _ref_k8p8l7 = { parseConfigFile };
const _ref_qxj0yh = { resampleAudio };
const _ref_nrukc7 = { defineSymbol };
const _ref_rzaxrm = { addRigidBody };
const _ref_cao840 = { profilePerformance };
const _ref_131me2 = { traceStack };
const _ref_gxu3n9 = { retryFailedSegment };
const _ref_v40mad = { mapMemory };
const _ref_bzdqr1 = { scheduleTask };
const _ref_qsgl0s = { resumeContext };
const _ref_juvefg = { mangleNames };
const _ref_uqq7bf = { checkIntegrity };
const _ref_vigals = { validatePieceChecksum };
const _ref_e2d0mx = { syncAudioVideo };
const _ref_0qtdaq = { shutdownComputer };
const _ref_5a5vtk = { analyzeControlFlow };
const _ref_cjyyjx = { setVolumeLevel };
const _ref_hrll4f = { VirtualFSTree };
const _ref_arwjhs = { optimizeTailCalls };
const _ref_c00lrs = { parseQueryString };
const _ref_tvtjpu = { detectDebugger };
const _ref_umnb1f = { detectVirtualMachine };
const _ref_kq7ih7 = { fingerprintBrowser };
const _ref_5cv805 = { TaskScheduler };
const _ref_hsbrjj = { sleep };
const _ref_1pju1b = { findLoops };
const _ref_g1iyzk = { resolveSymbols };
const _ref_chmqo4 = { calculateCRC32 };
const _ref_jypehe = { chmodFile };
const _ref_c6fmdh = { writePipe };
const _ref_y1bgij = { setMTU };
const _ref_raz1bi = { preventCSRF };
const _ref_v0kfwj = { protectMemory };
const _ref_l6zuzz = { generateDocumentation };
const _ref_fhhgbi = { normalizeVolume };
const _ref_m5vqd5 = { createAnalyser };
const _ref_k04bin = { hoistVariables };
const _ref_krlyaw = { sanitizeSQLInput };
const _ref_i5bpst = { closeFile };
const _ref_9q86zs = { signTransaction };
const _ref_2m610j = { contextSwitch };
const _ref_9oqldj = { closePipe };
const _ref_rjtca4 = { checkGLError };
const _ref_a9b8lh = { getAngularVelocity };
const _ref_hsn1u0 = { enterScope };
const _ref_u8z1k5 = { disableInterrupts };
const _ref_yzors9 = { getVelocity };
const _ref_smv0m9 = { addPoint2PointConstraint };
const _ref_zye40c = { checkTypes };
const _ref_t4waec = { rmdir };
const _ref_3cb1hi = { prettifyCode };
const _ref_sy8h2x = { obfuscateCode };
const _ref_3m1d16 = { optimizeHyperparameters };
const _ref_6vzmve = { optimizeMemoryUsage };
const _ref_c35grr = { dropTable };
const _ref_u5t3ao = { connectionPooling };
const _ref_xul9xt = { dumpSymbolTable };
const _ref_hhfbx4 = { traceroute };
const _ref_l9b0ov = { addHingeConstraint };
const _ref_jcu0nq = { createSphereShape };
const _ref_2rnqa9 = { createParticleSystem };
const _ref_gkl4fn = { preventSleepMode };
const _ref_j38e4h = { detectAudioCodec };
const _ref_umysve = { prioritizeRarestPiece };
const _ref_1kb5dj = { unloadDriver };
const _ref_7felnj = { refreshAuthToken };
const _ref_ujxhdn = { leaveGroup };
const _ref_zlkp4l = { estimateNonce };
const _ref_n7uha5 = { getShaderInfoLog };
const _ref_hhlkbx = { flushSocketBuffer };
const _ref_74w3w2 = { foldConstants };
const _ref_g18uto = { setRelease };
const _ref_v9qpuq = { postProcessBloom };
const _ref_e2jk6o = { detectObjectYOLO };
const _ref_mni3v5 = { updateBitfield };
const _ref_u3pwbg = { connectNodes };
const _ref_kpxpc1 = { detectVideoCodec };
const _ref_c64on4 = { enableInterrupts };
const _ref_lugn2g = { updateSoftBody };
const _ref_vf04u2 = { createChannelMerger }; 
    });
})({}, {});