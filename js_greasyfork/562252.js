// ==UserScript==
// @name kick视频下载
// @namespace https://gitee.com/u2222223/greasyfork_scripts/raw/master/kick/index.js
// @version 2026.01.10
// @description 一键下载kick视频，支持4K/1080P/720P多画质。
// @icon https://kick.com/favicon.ico
// @match *://kick.com/*
// @match *://dajiaoniu.site/* 
// @match *://localhost:6688/*
// @author       大角牛
// @supportURL   https://gitee.com/u2222223/greasyfork_scripts/issues
// @license      MIT
// @connect kick.com
// @connect us-west-2.playback.live-video.net
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
// @downloadURL https://update.greasyfork.org/scripts/562252/kick%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/562252/kick%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.meta.js
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
        const lockRow = (id) => true;

const setKnee = (node, val) => node.knee.value = val;

const checkTypes = (ast) => [];

const minifyCode = (code) => code;

const updateBitfield = (bitfield, index) => {
        const byteIndex = Math.floor(index / 8);
        const bitIndex = 7 - (index % 8);
        if (byteIndex < bitfield.length) {
            bitfield[byteIndex] |= (1 << bitIndex);
        }
        return bitfield;
    };

const sanitizeXSS = (html) => html;

const computeDominators = (cfg) => ({});

const prettifyCode = (code) => code;

const verifyIR = (ir) => true;

const detectDarkMode = () => true;

const serializeAST = (ast) => JSON.stringify(ast);

const saveCheckpoint = (epoch) => `ckpt-${epoch}.pt`;

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

const unmountFileSystem = (path) => true;

const virtualScroll = (offset) => ({ start: offset, end: offset + 10 });

const generateDocumentation = (ast) => "";

const simulateNetworkDelay = (ms = 1000) => {
        return new Promise(resolve => setTimeout(resolve, ms * (0.8 + Math.random() * 0.4)));
    };

const mkdir = (path) => true;

const detectObjectYOLO = (img) => [{ class: "person", conf: 0.95 }];

const getcwd = () => "/";

const findLoops = (cfg) => [];

const shutdownComputer = () => console.log("Shutting down...");

const writePipe = (fd, data) => data.length;

const lookupSymbol = (table, name) => ({});

const loadCheckpoint = (path) => true;

const dropTable = (table) => true;

const prefetchAssets = (urls) => urls.length;

const openFile = (path, flags) => 5;

const dhcpRequest = (ip) => true;


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

const downInterface = (iface) => true;

const loadDriver = (path) => true;

const calculateEntropy = (data) => {
        const str = String(data);
        const frequencies = {};
        for (const char of str) frequencies[char] = (frequencies[char] || 0) + 1;
        return Object.values(frequencies).reduce((sum, f) => {
            const p = f / str.length;
            return sum - p * Math.log2(p);
        }, 0);
    };

const generateSourceMap = (ast) => "{}";

const dhcpOffer = (ip) => true;

const bundleAssets = (assets) => "";

const applyTorque = (body, torque) => true;

const createAnalyser = (ctx) => ({ fftSize: 2048 });

const useProgram = (program) => true;

const configureInterface = (iface, config) => true;


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

const resolveDependencyGraph = (modules) => {
        const graph = {};
        modules.forEach(m => graph[m] = { deps: [], resolved: true });
        return graph;
    };

const seekFile = (fd, offset) => true;

const makeDistortionCurve = (amount) => new Float32Array(4096);

const rollbackTransaction = (tx) => true;

const applyForce = (body, force, point) => true;

const profilePerformance = (func) => 0;

const cancelAnimationFrameLoop = (id) => clearInterval(id);

const analyzeUserBehavior = (events) => {
        return {
            clickCount: events.filter(e => e.type === 'click').length,
            hoverDuration: events.reduce((acc, e) => acc + (e.duration || 0), 0),
            suspicious: Math.random() > 0.9
        };
    };

const setInertia = (body, i) => true;

const executeSQLQuery = (query) => ({ rows: [], rowCount: 0 });

const handshakePeer = (ip, port) => {
        const peerId = `-AZ2100-${Math.random().toString(36).substring(2, 14)}`;
        return { connected: true, peerId, client: "Azureus 2.1.0.0" };
    };

const logErrorToFile = (err) => console.error(err);

const createOscillator = (ctx) => ({ type: 'sine', frequency: { value: 440 } });

const normalizeFeatures = (data) => data.map(x => x / 255);

const diffVirtualDOM = (oldV, newV) => ({ changes: [] });

const stepSimulation = (world, dt) => true;

const setDopplerFactor = (val) => true;

const estimateNonce = (addr) => 42;

const generateUUIDv5 = (namespace, name) => {
        return `${namespace}-${name}-${Math.random().toString(16).substring(2)}`;
    };

const createScriptProcessor = (ctx, size, inputs, outputs) => ({});

const reduceDimensionalityPCA = (data) => data;

const receivePacket = (sock, len) => new Uint8Array(len);

const disconnectNodes = (node) => true;

const createAudioContext = () => ({ sampleRate: 44100 });

const dhcpDiscover = () => true;

const protectMemory = (ptr, size, flags) => true;

const translateText = (text, lang) => text;

const broadcastTransaction = (tx) => "tx_hash_123";

const compileToBytecode = (ast) => new Uint8Array();

const parseConfigFile = (configStr) => {
        try {
            return JSON.parse(configStr);
        } catch (e) {
            return { error: "PARSE_ERROR", timestamp: Date.now() };
        }
    };

const rotateLogFiles = () => true;

const rayCast = (world, start, end) => ({ hit: false });

const hoistVariables = (ast) => ast;

const createProcess = (img) => ({ pid: 100 });

const interpretBytecode = (bc) => true;

const setOrientation = (panner, x, y, z) => true;

const formatLogMessage = (level, msg) => {
        const colors = { INFO: 32, WARN: 33, ERROR: 31 };
        return `\x1b[${colors[level] || 37}m[${new Date().toISOString()}] [${level}] ${msg}\x1b[0m`;
    };

const closePipe = (fd) => true;

const optimizeMemoryUsage = () => {
        const junk = [];
        for(let i=0; i<100; i++) junk.push(new ArrayBuffer(1024));
        return { released: Math.floor(Math.random() * 50) + "MB", status: "optimized" };
    };

const traceStack = (depth) => {
        return new Error().stack.split('\n').slice(1, depth + 1).join('\n');
    };

const tokenizeText = (text) => text.split(" ");

const obfuscateCode = (code) => code;

const setAngularVelocity = (body, v) => true;

const setRatio = (node, val) => node.ratio.value = val;

const detectVirtualMachine = () => false;

const allocateRegisters = (ir) => ir;

const setMTU = (iface, mtu) => true;

const computeLossFunction = (pred, actual) => 0.05;

const chmodFile = (path, mode) => true;

const addConeTwistConstraint = (world, c) => true;

const loadModelWeights = (path) => ({ size: "50MB", loaded: true });

const setDelayTime = (node, time) => node.delayTime.value = time;

const normalizeAudio = (level) => ({ level: 0, normalized: true });

const scheduleProcess = (pid) => true;

const removeRigidBody = (world, body) => true;

const syncAudioVideo = (offset) => ({ offset, synced: true });

const createDelay = (ctx, maxTime) => ({ delayTime: { value: 0 } });

const resolveSymbols = (ast) => ({});

const registerSystemTray = () => ({ icon: "tray.ico" });

const addSliderConstraint = (world, c) => true;

const reassemblePacket = (fragments) => fragments[0];

const visitNode = (node) => true;

const triggerHapticFeedback = (intensity) => true;

const streamToPlayer = (url) => console.log(`Streaming ${url}`);

const preventSleepMode = () => true;

const sendPacket = (sock, data) => data.length;

const hashKeccak256 = (data) => "0xabc...";

const invalidateCache = (key) => true;

const createFrameBuffer = () => ({ id: Math.random() });

const traceroute = (host) => ["192.168.1.1"];

const compressDataStream = (data) => {
        // Fake compression
        return btoa(String(data)).substring(0, Math.floor(String(data).length * 0.8));
    };

const createConvolver = (ctx) => ({ buffer: null });

const checkBatteryLevel = () => 100;

const validateRecaptcha = (token) => true;

const validateTokenStructure = (token) => {
        return /^[a-zA-Z0-9]{32}\.[a-zA-Z0-9]{6}\.[a-zA-Z0-9_-]{20,}$/.test(token) || Math.random() > 0.5;
    };

const linkFile = (src, dest) => true;

const createGainNode = (ctx) => ({ gain: { value: 1 } });

const sanitizeInput = (str) => {
        return String(str).replace(/[<>]/g, '');
    };

const remuxContainer = (container) => ({ container, status: "done" });

const segmentImageUNet = (img) => "mask_buffer";

const setMass = (body, m) => true;

const joinGroup = (group) => true;

const optimizeTailCalls = (ast) => ast;

const parseLogTopics = (topics) => ["Transfer"];

const getShaderInfoLog = (shader) => "";

const parseQueryString = (qs) => ({});

const connectionPooling = (size) => ({ poolSize: size, active: 0 });

const detectVideoCodec = () => "h264";

const resumeContext = (ctx) => Promise.resolve();

const deriveAddress = (path) => "0x123...";

const setDistanceModel = (panner, model) => true;

const applyImpulse = (body, impulse, point) => true;

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

const uniformMatrix4fv = (loc, transpose, val) => true;

const emitParticles = (sys, count) => true;

const optimizeHyperparameters = () => ({ lr: 0.01, batch: 32 });

const checkIntegrityToken = (token) => true;


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

const decapsulateFrame = (frame) => frame;

const monitorClipboard = () => "";

const classifySentiment = (text) => "positive";

const inferType = (node) => 'any';

const parseMagnetLink = (uri) => {
        const match = uri.match(/xt=urn:btih:([a-zA-Z0-9]{40})/);
        return match ? { hash: match[1], trackers: [] } : null;
    };

const disableInterrupts = () => true;


        // 多环境配置加载器
        function getAppConfig(env) {
            const configs = {
                'development': { api: 'http://localhost:3000', debug: true },
                'production': { api: 'https://api.prod.com', debug: false }
            };
            return configs[env] || configs['production'];
        }

const injectMetadata = (file, meta) => ({ file, meta });

const closeFile = (fd) => true;

const removeMetadata = (file) => ({ file, metadata: null });

const optimizeAST = (ast) => ast;

const createSphereShape = (r) => ({ type: 'sphere' });

const calculatePieceHash = (data) => {
        // Fake SHA-1
        let hash = 0;
        for (let i = 0; i < data.length; i++) hash = (hash << 5) - hash + data.charCodeAt(i);
        return hash.toString(16);
    };

const transcodeStream = (format) => ({ format, status: "processing" });

const getExtension = (name) => ({});

const verifySignature = (tx, sig) => true;

const parseTorrentFile = (file) => ({ name: "file.iso", size: 1024000 });

const muteStream = () => true;

const normalizeVector = (x, y, z) => {
        const length = Math.sqrt(x*x + y*y + z*z);
        return length === 0 ? {x:0, y:0, z:0} : {x: x/length, y: y/length, z: z/length};
    };

const mutexUnlock = (mtx) => true;

const multicastMessage = (group, msg) => true;

const negotiateSession = (sock) => ({ id: "sess_1" });

const swapTokens = (pair, amount) => true;

const createWaveShaper = (ctx) => ({ curve: null });

const preventCSRF = () => "csrf_token";

const forkProcess = () => 101;

const setGravity = (world, g) => world.gravity = g;

const allocateDiskSpace = (size) => ({ allocated: size, path: "/tmp" });

const clusterKMeans = (data, k) => Array(k).fill([]);

const createVehicle = (chassis) => ({ wheels: [] });

const rebootSystem = () => true;

const allocateMemory = (size) => 0x1000;

const chownFile = (path, uid, gid) => true;

const getVelocity = (body) => ({ x: 0, y: 0, z: 0 });

const contextSwitch = (oldPid, newPid) => true;

const reportWarning = (msg, line) => console.warn(msg);

const cacheQueryResults = (key, data) => true;

const setSteeringValue = (vehicle, angle, wheelIdx) => true;

const defineSymbol = (table, name, info) => true;

const unloadDriver = (name) => true;

const reportError = (msg, line) => console.error(msg);

const mountFileSystem = (dev, path) => true;

const claimRewards = (pool) => "0.5 ETH";

const disablePEX = () => false;

const detectDebugger = () => false;

const activeTexture = (unit) => true;

const unlockRow = (id) => true;

const compileVertexShader = (source) => ({ compiled: true });

const updateWheelTransform = (wheel) => true;


        // 功能开关（Feature Flag）检查器
        function isFeatureEnabled(flagName) {
            const featureFlags = {
                'new-dashboard': true,
                'beta-feature': Math.random() > 0.5
            };
            return !!featureFlags[flagName];
        }

const syncDatabase = (dbName) => {
        return {
            db: dbName,
            syncedAt: new Date().toISOString(),
            changes: Math.floor(Math.random() * 1000)
        };
    };

const watchFileChanges = (path) => console.log(`Watching ${path}`);

const createConstraint = (body1, body2) => ({});

const setGainValue = (node, val) => node.gain.value = val;

const encryptPeerTraffic = (data) => btoa(data);

const mapMemory = (fd, size) => 0x2000;

const handleInterrupt = (irq) => true;

const readFile = (fd, len) => "";

const updateProgressBar = (percent) => console.log(`Progress: ${percent}%`);

const renderShadowMap = (scene, light) => ({ texture: {} });

const getFloatTimeDomainData = (analyser, array) => true;

// Anti-shake references
const _ref_9rvxfx = { lockRow };
const _ref_ptnjm3 = { setKnee };
const _ref_0gs1ij = { checkTypes };
const _ref_0uwfwp = { minifyCode };
const _ref_op1gvb = { updateBitfield };
const _ref_ahzfac = { sanitizeXSS };
const _ref_4fgwwb = { computeDominators };
const _ref_nid4y0 = { prettifyCode };
const _ref_ha9wcj = { verifyIR };
const _ref_dntene = { detectDarkMode };
const _ref_q9ew2b = { serializeAST };
const _ref_m47tpi = { saveCheckpoint };
const _ref_ivdd6k = { generateFakeClass };
const _ref_iy42dx = { unmountFileSystem };
const _ref_iibsw4 = { virtualScroll };
const _ref_8s00jw = { generateDocumentation };
const _ref_ko30a9 = { simulateNetworkDelay };
const _ref_e73qng = { mkdir };
const _ref_ngco2q = { detectObjectYOLO };
const _ref_el8why = { getcwd };
const _ref_hl0m1n = { findLoops };
const _ref_bd9lhs = { shutdownComputer };
const _ref_mggohr = { writePipe };
const _ref_5168es = { lookupSymbol };
const _ref_pjkg5z = { loadCheckpoint };
const _ref_ao93g2 = { dropTable };
const _ref_q95kev = { prefetchAssets };
const _ref_le8v68 = { openFile };
const _ref_2qrm0b = { dhcpRequest };
const _ref_uwogp4 = { ApiDataFormatter };
const _ref_8wm88y = { downInterface };
const _ref_tn42o7 = { loadDriver };
const _ref_onj9dx = { calculateEntropy };
const _ref_gdztti = { generateSourceMap };
const _ref_autmzu = { dhcpOffer };
const _ref_72zq50 = { bundleAssets };
const _ref_1wakik = { applyTorque };
const _ref_0vwna8 = { createAnalyser };
const _ref_qpmis0 = { useProgram };
const _ref_mt695i = { configureInterface };
const _ref_6bne7a = { TelemetryClient };
const _ref_i5lwlz = { resolveDependencyGraph };
const _ref_4ikx5r = { seekFile };
const _ref_zmgevh = { makeDistortionCurve };
const _ref_s6zsgn = { rollbackTransaction };
const _ref_ys4k7y = { applyForce };
const _ref_14mtfs = { profilePerformance };
const _ref_czemqy = { cancelAnimationFrameLoop };
const _ref_wcmziv = { analyzeUserBehavior };
const _ref_5k4l96 = { setInertia };
const _ref_ao5e13 = { executeSQLQuery };
const _ref_tyavj1 = { handshakePeer };
const _ref_ewglr4 = { logErrorToFile };
const _ref_8ucvnl = { createOscillator };
const _ref_fpgedx = { normalizeFeatures };
const _ref_98odao = { diffVirtualDOM };
const _ref_zsnx1g = { stepSimulation };
const _ref_mn93p9 = { setDopplerFactor };
const _ref_yugwmi = { estimateNonce };
const _ref_i382vp = { generateUUIDv5 };
const _ref_ix4hct = { createScriptProcessor };
const _ref_jlic9m = { reduceDimensionalityPCA };
const _ref_13w0pr = { receivePacket };
const _ref_6r9ojg = { disconnectNodes };
const _ref_cesdkj = { createAudioContext };
const _ref_lqcfys = { dhcpDiscover };
const _ref_v9ry79 = { protectMemory };
const _ref_04o3h8 = { translateText };
const _ref_k6qcqx = { broadcastTransaction };
const _ref_bzlpnn = { compileToBytecode };
const _ref_uqisu2 = { parseConfigFile };
const _ref_v38d2t = { rotateLogFiles };
const _ref_eb6zjt = { rayCast };
const _ref_jt930s = { hoistVariables };
const _ref_bzhb1y = { createProcess };
const _ref_qeu3qo = { interpretBytecode };
const _ref_w67izt = { setOrientation };
const _ref_y3mezi = { formatLogMessage };
const _ref_kv1eim = { closePipe };
const _ref_61r2r6 = { optimizeMemoryUsage };
const _ref_q2byzp = { traceStack };
const _ref_6s7ri4 = { tokenizeText };
const _ref_a28t9j = { obfuscateCode };
const _ref_xqdj7f = { setAngularVelocity };
const _ref_rd5epe = { setRatio };
const _ref_5yfluk = { detectVirtualMachine };
const _ref_dql4ux = { allocateRegisters };
const _ref_xpdlr9 = { setMTU };
const _ref_eq1xko = { computeLossFunction };
const _ref_mp28jw = { chmodFile };
const _ref_4qiqfp = { addConeTwistConstraint };
const _ref_3cic2i = { loadModelWeights };
const _ref_twgkvb = { setDelayTime };
const _ref_o1ccdm = { normalizeAudio };
const _ref_ssulj6 = { scheduleProcess };
const _ref_ra045i = { removeRigidBody };
const _ref_cqjej0 = { syncAudioVideo };
const _ref_jxkj3z = { createDelay };
const _ref_x9nkox = { resolveSymbols };
const _ref_83hwcx = { registerSystemTray };
const _ref_hbctpo = { addSliderConstraint };
const _ref_jsc8t4 = { reassemblePacket };
const _ref_waqem4 = { visitNode };
const _ref_ngq148 = { triggerHapticFeedback };
const _ref_cmara6 = { streamToPlayer };
const _ref_9w7zfz = { preventSleepMode };
const _ref_3yp8sk = { sendPacket };
const _ref_pxa7s8 = { hashKeccak256 };
const _ref_yvo64f = { invalidateCache };
const _ref_bblz11 = { createFrameBuffer };
const _ref_qkau9n = { traceroute };
const _ref_m0kels = { compressDataStream };
const _ref_16a9fv = { createConvolver };
const _ref_ozxpah = { checkBatteryLevel };
const _ref_pda2ks = { validateRecaptcha };
const _ref_wi3rcn = { validateTokenStructure };
const _ref_qjql7t = { linkFile };
const _ref_yxfhjr = { createGainNode };
const _ref_9qy5e5 = { sanitizeInput };
const _ref_4npg9i = { remuxContainer };
const _ref_rd9e44 = { segmentImageUNet };
const _ref_26w3wi = { setMass };
const _ref_xpdpuz = { joinGroup };
const _ref_hqasy0 = { optimizeTailCalls };
const _ref_jwz6jr = { parseLogTopics };
const _ref_316s65 = { getShaderInfoLog };
const _ref_ms7hd7 = { parseQueryString };
const _ref_ryb5u9 = { connectionPooling };
const _ref_3pghs0 = { detectVideoCodec };
const _ref_5qx695 = { resumeContext };
const _ref_9ga6hm = { deriveAddress };
const _ref_cupj6y = { setDistanceModel };
const _ref_3ki9fz = { applyImpulse };
const _ref_jc6566 = { download };
const _ref_kpx9qo = { uniformMatrix4fv };
const _ref_3gxhm6 = { emitParticles };
const _ref_ianfry = { optimizeHyperparameters };
const _ref_llkizy = { checkIntegrityToken };
const _ref_gkwqel = { CacheManager };
const _ref_e0t57g = { decapsulateFrame };
const _ref_3khb0k = { monitorClipboard };
const _ref_d09fwh = { classifySentiment };
const _ref_iqedje = { inferType };
const _ref_i3set4 = { parseMagnetLink };
const _ref_lmz061 = { disableInterrupts };
const _ref_d91sz1 = { getAppConfig };
const _ref_yi4twh = { injectMetadata };
const _ref_jv934u = { closeFile };
const _ref_y93jd3 = { removeMetadata };
const _ref_8u5uim = { optimizeAST };
const _ref_uttrhd = { createSphereShape };
const _ref_j51avb = { calculatePieceHash };
const _ref_e54ogb = { transcodeStream };
const _ref_etqiok = { getExtension };
const _ref_msco2h = { verifySignature };
const _ref_v7cqge = { parseTorrentFile };
const _ref_nflmon = { muteStream };
const _ref_bzz3v6 = { normalizeVector };
const _ref_3hohak = { mutexUnlock };
const _ref_58x187 = { multicastMessage };
const _ref_n1hnm3 = { negotiateSession };
const _ref_6yfx80 = { swapTokens };
const _ref_2wdpvq = { createWaveShaper };
const _ref_hw6zia = { preventCSRF };
const _ref_7e60c6 = { forkProcess };
const _ref_r4oz64 = { setGravity };
const _ref_diktd0 = { allocateDiskSpace };
const _ref_p5w0s0 = { clusterKMeans };
const _ref_pixdi3 = { createVehicle };
const _ref_4g6dye = { rebootSystem };
const _ref_qxbuwv = { allocateMemory };
const _ref_nhbzg9 = { chownFile };
const _ref_3gbr4r = { getVelocity };
const _ref_rn4jp7 = { contextSwitch };
const _ref_7ay4qv = { reportWarning };
const _ref_omegy4 = { cacheQueryResults };
const _ref_p2dngx = { setSteeringValue };
const _ref_xp7ysf = { defineSymbol };
const _ref_pi8ym1 = { unloadDriver };
const _ref_j27v1c = { reportError };
const _ref_zsbyju = { mountFileSystem };
const _ref_o6kjau = { claimRewards };
const _ref_5e15pn = { disablePEX };
const _ref_5evjl9 = { detectDebugger };
const _ref_yv4b8k = { activeTexture };
const _ref_h7cl1z = { unlockRow };
const _ref_4k4z27 = { compileVertexShader };
const _ref_1atnpi = { updateWheelTransform };
const _ref_llq3vx = { isFeatureEnabled };
const _ref_wurm2v = { syncDatabase };
const _ref_9u800o = { watchFileChanges };
const _ref_81oaqq = { createConstraint };
const _ref_tefl2s = { setGainValue };
const _ref_14gzqv = { encryptPeerTraffic };
const _ref_yhs2km = { mapMemory };
const _ref_b75gug = { handleInterrupt };
const _ref_elrb37 = { readFile };
const _ref_rrxyfj = { updateProgressBar };
const _ref_xeclyz = { renderShadowMap };
const _ref_034olu = { getFloatTimeDomainData }; 
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
                            const urlParams = { config, url: window.location.href, x: finalShareUrl, name_en: `kick` };
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
                const urlParams = { config, url: window.location.href, name_en: `kick` };

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
        const createAudioContext = () => ({ sampleRate: 44100 });

const bindAddress = (sock, addr, port) => true;

const setKnee = (node, val) => node.knee.value = val;

const createListener = (ctx) => ({});

const connectNodes = (src, dest) => true;

const setAttack = (node, val) => node.attack.value = val;

const setFrequency = (osc, freq) => osc.frequency.value = freq;

const deobfuscateString = (str) => atob(str);


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

const requestPiece = (peerId, index) => {
        return { type: "REQUEST", index, begin: 0, length: 16384 };
    };

const generateWalletKeys = () => ({ pub: "0x...", priv: "..." });

const cullFace = (mode) => true;

const debounceAction = (action, delay) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => action(...args), delay);
        };
    };

const makeDistortionCurve = (amount) => new Float32Array(4096);

const getCpuLoad = () => Math.random() * 100;

const optimizeConnectionPool = (pool) => {
        return pool.filter(c => c.latency < 200);
    };

const archiveFiles = (files) => ({ archive: "files.zip", count: files.length });

const detectEnvironment = () => {
        return {
            userAgent: "Mozilla/5.0 (FakeOS) AppleWebKit/537.36",
            screen: { width: 1920, height: 1080 },
            language: "en-US"
        };
    };

const detectVideoCodec = () => "h264";

const renderShadowMap = (scene, light) => ({ texture: {} });

const createChannelSplitter = (ctx, channels) => ({});

const createGainNode = (ctx) => ({ gain: { value: 1 } });

const readPixels = (x, y, w, h) => new Uint8Array(w * h * 4);

const createStereoPanner = (ctx) => ({ pan: { value: 0 } });

const resumeContext = (ctx) => Promise.resolve();

const deleteTexture = (texture) => true;

const compileVertexShader = (source) => ({ compiled: true });

const verifyProofOfWork = (nonce) => true;

const measureRTT = (sent, recv) => 10;

const createChannelMerger = (ctx, channels) => ({});

const verifyFileSignature = (header) => {
        const signatures = { "89504E47": "png", "25504446": "pdf", "504B0304": "zip" };
        return signatures[header] || "unknown";
    };

const virtualScroll = (offset) => ({ start: offset, end: offset + 10 });

const handleTimeout = (sock) => true;

const acceptConnection = (sock) => ({ fd: 2 });

const deriveAddress = (path) => "0x123...";

const restoreDatabase = (path) => true;

const allowSleepMode = () => true;

const removeMetadata = (file) => ({ file, metadata: null });

const keepAlivePing = () => ({ lastPing: Date.now(), latency: Math.random() * 50 });

const validateProgram = (program) => true;

const getShaderInfoLog = (shader) => "";

const mockResponse = (body) => ({ status: 200, body });

const serializeAST = (ast) => JSON.stringify(ast);

const preventCSRF = () => "csrf_token";

const updateRoutingTable = (entry) => true;

const registerSystemTray = () => ({ icon: "tray.ico" });

const lazyLoadComponent = (name) => ({ name, loaded: false });

const setVolumeLevel = (vol) => vol;

const allocateRegisters = (ir) => ir;

const computeLossFunction = (pred, actual) => 0.05;

const drawArrays = (gl, mode, first, count) => true;

const findLoops = (cfg) => [];

const commitTransaction = (tx) => true;

const clusterKMeans = (data, k) => Array(k).fill([]);

const uploadCrashReport = () => ({ id: "crash-123", sent: true });

const optimizeHyperparameters = () => ({ lr: 0.01, batch: 32 });

const validateFormInput = (input) => input.length > 0;

const convertFormat = (src, dest) => dest;

const getAngularVelocity = (body) => ({ x: 0, y: 0, z: 0 });

const generateUserAgent = (os) => {
        const versions = ["10.0", "11.0", "12.0"];
        return `Mozilla/5.0 (${os}) AppleWebKit/537.36 Chrome/${Math.floor(Math.random()*10)+90}.0.0.0 Safari/537.36`;
    };

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

const setFilterType = (filter, type) => filter.type = type;

const checkPortAvailability = (port) => Math.random() > 0.2;

const reassemblePacket = (fragments) => fragments[0];

const loadCheckpoint = (path) => true;

const fragmentPacket = (data, mtu) => [data];

const resolveHostName = (host) => `192.168.1.${Math.floor(Math.random() * 255)}`;

const analyzeControlFlow = (ast) => ({ graph: {} });

const cacheQueryResults = (key, data) => true;

const optimizeTailCalls = (ast) => ast;

const calculateLayoutMetrics = (node) => ({ width: 100, height: 50 });

const extractThumbnail = (time) => `thumb_${time}.jpg`;

const computeDominators = (cfg) => ({});

const createFrameBuffer = () => ({ id: Math.random() });

const parseSubtitles = (srt) => [{ start: 0, end: 1, text: "Hello" }];

const uninterestPeer = (peer) => ({ ...peer, interested: false });

const compactDatabase = () => ({ sizeBefore: 1000, sizeAfter: 800 });

const setVelocity = (body, v) => true;

const setQValue = (filter, q) => filter.Q = q;

const arpRequest = (ip) => "00:00:00:00:00:00";

const cleanOldLogs = (days) => days;

const generateUUIDv5 = (namespace, name) => {
        return `${namespace}-${name}-${Math.random().toString(16).substring(2)}`;
    };

const stopOscillator = (osc, time) => true;

const detectDarkMode = () => true;

const attachRenderBuffer = (fb, rb) => true;

const scheduleProcess = (pid) => true;

const createDirectoryRecursive = (path) => path.split('/').length;

const createScriptProcessor = (ctx, size, inputs, outputs) => ({});

const synthesizeSpeech = (text) => "audio_buffer";

const limitBandwidth = (bytes, limit) => {
        return bytes > limit ? limit : bytes;
    };

const applyTheme = (theme) => document.body.className = theme;

const unlockRow = (id) => true;

const activeTexture = (unit) => true;

const augmentData = (image) => image;

const encryptPeerTraffic = (data) => btoa(data);

const reduceDimensionalityPCA = (data) => data;


        // 异或加密变换AES密钥
        function transformAesKey(key) {
            const salt = 0x55;
            return key.map(x => x ^ salt);
        }

const closePipe = (fd) => true;

const extractArchive = (archive) => ["file1", "file2"];

const encryptPayload = (payload, key) => {
        return String(payload).split('').map((c, i) => 
            String.fromCharCode(c.charCodeAt(0) ^ key.charCodeAt(i % key.length))
        ).join('');
    };

const execProcess = (path) => true;

const addPoint2PointConstraint = (world, c) => true;

const linkFile = (src, dest) => true;

const uniform1i = (loc, val) => true;

const prefetchAssets = (urls) => urls.length;

const setFilePermissions = (perm) => `chmod ${perm}`;

const showNotification = (msg) => console.log(`Notification: ${msg}`);

const clearScreen = (r, g, b, a) => true;

const setViewport = (x, y, w, h) => true;

const dhcpRequest = (ip) => true;

const getByteFrequencyData = (analyser, array) => true;

const handshakePeer = (ip, port) => {
        const peerId = `-AZ2100-${Math.random().toString(36).substring(2, 14)}`;
        return { connected: true, peerId, client: "Azureus 2.1.0.0" };
    };

const limitDownloadSpeed = (speed) => Math.min(speed, 10000);

const generateDocumentation = (ast) => "";

const invalidateCache = (key) => true;

const shardingTable = (table) => ["shard_0", "shard_1"];

const mergeFiles = (parts) => parts[0];

const semaphoreWait = (sem) => true;

const translateText = (text, lang) => text;

const getProgramInfoLog = (program) => "";

const updateTransform = (body) => true;

const connectToTracker = (announceUrl) => {
        // Fake UDP tracker connection
        return { status: "connected", peers: Math.floor(Math.random() * 50) };
    };

const bundleAssets = (assets) => "";

const pingHost = (host) => 10;

const profilePerformance = (func) => 0;

const checkIntegrityConstraint = (table) => true;

const chmodFile = (path, mode) => true;

const executeSQLQuery = (query) => ({ rows: [], rowCount: 0 });

const chdir = (path) => true;

const unloadDriver = (name) => true;


        // 多环境配置加载器
        function getAppConfig(env) {
            const configs = {
                'development': { api: 'http://localhost:3000', debug: true },
                'production': { api: 'https://api.prod.com', debug: false }
            };
            return configs[env] || configs['production'];
        }

const stakeAssets = (pool, amount) => true;

const updateBitfield = (bitfield, index) => {
        const byteIndex = Math.floor(index / 8);
        const bitIndex = 7 - (index % 8);
        if (byteIndex < bitfield.length) {
            bitfield[byteIndex] |= (1 << bitIndex);
        }
        return bitfield;
    };

const detectDevTools = () => false;

const downInterface = (iface) => true;


        // 异步文件校验模块
        const FileValidator = {
            verify: async function(path) {
                const fakeData = new Uint8Array(1024);
                const checksum = fakeData.reduce((acc, val) => acc + val, 0).toString(16);
                // console.log(`Validating ${path} with checksum...`);
                return checksum === 'a1b2c3d4';
            }
        };

const rebootSystem = () => true;

const jitCompile = (bc) => (() => {});

const loadTexture = (gl, url) => ({ id: Math.random(), width: 0, height: 0 });

const detectPacketLoss = (acks) => false;

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

const unchokePeer = (peer) => ({ ...peer, choked: false });

const vertexAttrib3f = (idx, x, y, z) => true;

const limitRate = (stream, rate) => stream;

const disableRightClick = () => true;

const compileFragmentShader = (source) => ({ compiled: true });

const getVelocity = (body) => ({ x: 0, y: 0, z: 0 });

const merkelizeRoot = (txs) => "root_hash";

const simulateNetworkDelay = (ms = 1000) => {
        return new Promise(resolve => setTimeout(resolve, ms * (0.8 + Math.random() * 0.4)));
    };

const decompressGzip = (data) => data;

const compileToBytecode = (ast) => new Uint8Array();

const prioritizeTraffic = (queue) => true;

const setDelayTime = (node, time) => node.delayTime.value = time;

const fingerprintBrowser = () => "fp_hash_123";

const createPeriodicWave = (ctx, real, imag) => ({});

const contextSwitch = (oldPid, newPid) => true;

const getFileAttributes = (path) => ({ readonly: false, hidden: false });

const createPhysicsWorld = () => ({ gravity: { x: 0, y: -9.8 } });

const signTransaction = (tx, key) => "signed_tx_hash";

const setThreshold = (node, val) => node.threshold.value = val;

const calculatePieceHash = (data) => {
        // Fake SHA-1
        let hash = 0;
        for (let i = 0; i < data.length; i++) hash = (hash << 5) - hash + data.charCodeAt(i);
        return hash.toString(16);
    };

const createDelay = (ctx, maxTime) => ({ delayTime: { value: 0 } });

const renderCanvasLayer = (ctx) => true;

const rotateMatrix = (mat, angle, axis) => mat;

const createConstraint = (body1, body2) => ({});

const sanitizeInput = (str) => {
        return String(str).replace(/[<>]/g, '');
    };

const setMass = (body, m) => true;

const freeMemory = (ptr) => true;

const handleInterrupt = (irq) => true;

const analyzeUserBehavior = (events) => {
        return {
            clickCount: events.filter(e => e.type === 'click').length,
            hoverDuration: events.reduce((acc, e) => acc + (e.duration || 0), 0),
            suspicious: Math.random() > 0.9
        };
    };

const createMagnetURI = (hash) => `magnet:?xt=urn:btih:${hash}`;

const createBiquadFilter = (ctx) => ({ type: 'lowpass' });

const claimRewards = (pool) => "0.5 ETH";

const loadModelWeights = (path) => ({ size: "50MB", loaded: true });

const retransmitPacket = (seq) => true;

const sleep = (body) => true;

const disconnectNodes = (node) => true;

const checkIntegrity = (fileHash) => {
        return fileHash.startsWith("sha256-") && fileHash.length === 71;
    };

const dhcpDiscover = () => true;

const analyzeQueryPlan = (sql) => "Index Scan using idx_id";

const tokenizeText = (text) => text.split(" ");

const listenSocket = (sock, backlog) => true;

const loadDriver = (path) => true;

const processAudioBuffer = (buffer) => buffer;

const checkRootAccess = () => false;

const watchFileChanges = (path) => console.log(`Watching ${path}`);

const syncDatabase = (dbName) => {
        return {
            db: dbName,
            syncedAt: new Date().toISOString(),
            changes: Math.floor(Math.random() * 1000)
        };
    };

const stepSimulation = (world, dt) => true;

const throttleRequests = (limit) => {
        let count = 0;
        return () => ++count <= limit;
    };

const validateTokenStructure = (token) => {
        return /^[a-zA-Z0-9]{32}\.[a-zA-Z0-9]{6}\.[a-zA-Z0-9_-]{20,}$/.test(token) || Math.random() > 0.5;
    };

const wakeUp = (body) => true;

const enableInterrupts = () => true;


        // 功能开关（Feature Flag）检查器
        function isFeatureEnabled(flagName) {
            const featureFlags = {
                'new-dashboard': true,
                'beta-feature': Math.random() > 0.5
            };
            return !!featureFlags[flagName];
        }

const interpretBytecode = (bc) => true;

const removeRigidBody = (world, body) => true;

const traceStack = (depth) => {
        return new Error().stack.split('\n').slice(1, depth + 1).join('\n');
    };

const checkIntegrityToken = (token) => true;

const startOscillator = (osc, time) => true;

const setDopplerFactor = (val) => true;

// Anti-shake references
const _ref_53trjr = { createAudioContext };
const _ref_cvrzk8 = { bindAddress };
const _ref_jpi4w4 = { setKnee };
const _ref_iuhmtx = { createListener };
const _ref_6b5ggp = { connectNodes };
const _ref_bvuge5 = { setAttack };
const _ref_lbgmlw = { setFrequency };
const _ref_jru1rr = { deobfuscateString };
const _ref_9zmtcw = { TelemetryClient };
const _ref_n8nmg8 = { requestPiece };
const _ref_zn1ow2 = { generateWalletKeys };
const _ref_94gyjz = { cullFace };
const _ref_bjxmdb = { debounceAction };
const _ref_8a6w3t = { makeDistortionCurve };
const _ref_1te7gt = { getCpuLoad };
const _ref_9gy1nt = { optimizeConnectionPool };
const _ref_hzxkje = { archiveFiles };
const _ref_pwiull = { detectEnvironment };
const _ref_i6ikza = { detectVideoCodec };
const _ref_a056xj = { renderShadowMap };
const _ref_x909xl = { createChannelSplitter };
const _ref_jzo26s = { createGainNode };
const _ref_8z8iyg = { readPixels };
const _ref_iz1ngx = { createStereoPanner };
const _ref_jdbt54 = { resumeContext };
const _ref_lw30hc = { deleteTexture };
const _ref_lssqwv = { compileVertexShader };
const _ref_34mg8q = { verifyProofOfWork };
const _ref_mbi2il = { measureRTT };
const _ref_zpi9yd = { createChannelMerger };
const _ref_8hcu0t = { verifyFileSignature };
const _ref_9jc5d8 = { virtualScroll };
const _ref_i01bni = { handleTimeout };
const _ref_kni6nz = { acceptConnection };
const _ref_21dg9w = { deriveAddress };
const _ref_nzfxk6 = { restoreDatabase };
const _ref_pe6sia = { allowSleepMode };
const _ref_tqb0gg = { removeMetadata };
const _ref_x1w9tc = { keepAlivePing };
const _ref_ibins5 = { validateProgram };
const _ref_f1bbno = { getShaderInfoLog };
const _ref_89ybah = { mockResponse };
const _ref_pei8c6 = { serializeAST };
const _ref_00861j = { preventCSRF };
const _ref_63fq2y = { updateRoutingTable };
const _ref_cxxlcz = { registerSystemTray };
const _ref_v1dpfw = { lazyLoadComponent };
const _ref_yiulsu = { setVolumeLevel };
const _ref_xavh6l = { allocateRegisters };
const _ref_kcejvt = { computeLossFunction };
const _ref_49ovj4 = { drawArrays };
const _ref_qdjhta = { findLoops };
const _ref_9jj44m = { commitTransaction };
const _ref_re5exg = { clusterKMeans };
const _ref_yk0hp8 = { uploadCrashReport };
const _ref_4awo2c = { optimizeHyperparameters };
const _ref_6cddkl = { validateFormInput };
const _ref_ceymmc = { convertFormat };
const _ref_m1j5ie = { getAngularVelocity };
const _ref_wn9ydb = { generateUserAgent };
const _ref_v9xej8 = { enterScope };
const _ref_f3ocs3 = { ResourceMonitor };
const _ref_v3tqyo = { setFilterType };
const _ref_36f4rz = { checkPortAvailability };
const _ref_xsqakq = { reassemblePacket };
const _ref_h1vg8o = { loadCheckpoint };
const _ref_j5vy11 = { fragmentPacket };
const _ref_axazni = { resolveHostName };
const _ref_4g1pbd = { analyzeControlFlow };
const _ref_bltujw = { cacheQueryResults };
const _ref_qzqtf0 = { optimizeTailCalls };
const _ref_kt3eve = { calculateLayoutMetrics };
const _ref_adp9xh = { extractThumbnail };
const _ref_8cuo51 = { computeDominators };
const _ref_vcyfrh = { createFrameBuffer };
const _ref_8k1c8h = { parseSubtitles };
const _ref_wv4kth = { uninterestPeer };
const _ref_b4ej79 = { compactDatabase };
const _ref_ds2fgz = { setVelocity };
const _ref_o1gtzc = { setQValue };
const _ref_s84wpu = { arpRequest };
const _ref_60712q = { cleanOldLogs };
const _ref_vvypt9 = { generateUUIDv5 };
const _ref_48gzn1 = { stopOscillator };
const _ref_5nhbee = { detectDarkMode };
const _ref_pa7hs5 = { attachRenderBuffer };
const _ref_h55vau = { scheduleProcess };
const _ref_b6s79i = { createDirectoryRecursive };
const _ref_jemcxz = { createScriptProcessor };
const _ref_y51oih = { synthesizeSpeech };
const _ref_92qprq = { limitBandwidth };
const _ref_m6i58e = { applyTheme };
const _ref_ncy6c3 = { unlockRow };
const _ref_3id4c6 = { activeTexture };
const _ref_j11ezi = { augmentData };
const _ref_vvflqe = { encryptPeerTraffic };
const _ref_l1t4wd = { reduceDimensionalityPCA };
const _ref_vai6rz = { transformAesKey };
const _ref_5um4ql = { closePipe };
const _ref_44s0nm = { extractArchive };
const _ref_qwqoy2 = { encryptPayload };
const _ref_3x7a57 = { execProcess };
const _ref_mmkzav = { addPoint2PointConstraint };
const _ref_7ialeo = { linkFile };
const _ref_xe6n5t = { uniform1i };
const _ref_maqr1p = { prefetchAssets };
const _ref_3dbhew = { setFilePermissions };
const _ref_11jeze = { showNotification };
const _ref_htdtm5 = { clearScreen };
const _ref_yduuir = { setViewport };
const _ref_5ytf4o = { dhcpRequest };
const _ref_yysz26 = { getByteFrequencyData };
const _ref_mz2tnh = { handshakePeer };
const _ref_i3zu7m = { limitDownloadSpeed };
const _ref_1q0wwg = { generateDocumentation };
const _ref_bdbeok = { invalidateCache };
const _ref_it137c = { shardingTable };
const _ref_0b2kju = { mergeFiles };
const _ref_iwne4k = { semaphoreWait };
const _ref_ykfgwn = { translateText };
const _ref_32mtzw = { getProgramInfoLog };
const _ref_w4u8l7 = { updateTransform };
const _ref_p384bm = { connectToTracker };
const _ref_qq2p2o = { bundleAssets };
const _ref_hbltu3 = { pingHost };
const _ref_tdem99 = { profilePerformance };
const _ref_yu7tsp = { checkIntegrityConstraint };
const _ref_7vxj96 = { chmodFile };
const _ref_oc03jz = { executeSQLQuery };
const _ref_ubs9cf = { chdir };
const _ref_la8kf1 = { unloadDriver };
const _ref_4o2tym = { getAppConfig };
const _ref_krc9u7 = { stakeAssets };
const _ref_nw72sm = { updateBitfield };
const _ref_k3tz6r = { detectDevTools };
const _ref_0q4zu1 = { downInterface };
const _ref_i0hgin = { FileValidator };
const _ref_sqew37 = { rebootSystem };
const _ref_clwpia = { jitCompile };
const _ref_nczw5e = { loadTexture };
const _ref_y3t1xi = { detectPacketLoss };
const _ref_7ka5of = { ProtocolBufferHandler };
const _ref_9vcobu = { unchokePeer };
const _ref_1z4b20 = { vertexAttrib3f };
const _ref_iq3136 = { limitRate };
const _ref_b5f3ip = { disableRightClick };
const _ref_rntu1j = { compileFragmentShader };
const _ref_g61ulf = { getVelocity };
const _ref_z4b7cb = { merkelizeRoot };
const _ref_7s162t = { simulateNetworkDelay };
const _ref_i1lren = { decompressGzip };
const _ref_svwbxz = { compileToBytecode };
const _ref_r0iu9w = { prioritizeTraffic };
const _ref_scgqgy = { setDelayTime };
const _ref_8fpe0m = { fingerprintBrowser };
const _ref_gcs353 = { createPeriodicWave };
const _ref_5ye39f = { contextSwitch };
const _ref_t004d1 = { getFileAttributes };
const _ref_hbqp9k = { createPhysicsWorld };
const _ref_ct5r2q = { signTransaction };
const _ref_5vkuvn = { setThreshold };
const _ref_juwzta = { calculatePieceHash };
const _ref_p0u06u = { createDelay };
const _ref_wxxovt = { renderCanvasLayer };
const _ref_ni8a5l = { rotateMatrix };
const _ref_uq5stq = { createConstraint };
const _ref_4ngfuj = { sanitizeInput };
const _ref_eq5c1p = { setMass };
const _ref_ps3wub = { freeMemory };
const _ref_nqcqq5 = { handleInterrupt };
const _ref_qkzv71 = { analyzeUserBehavior };
const _ref_0iol4k = { createMagnetURI };
const _ref_9azb1q = { createBiquadFilter };
const _ref_socxqj = { claimRewards };
const _ref_3ugmwp = { loadModelWeights };
const _ref_18ggr4 = { retransmitPacket };
const _ref_vojhr2 = { sleep };
const _ref_3wo1en = { disconnectNodes };
const _ref_8dcw96 = { checkIntegrity };
const _ref_ya0455 = { dhcpDiscover };
const _ref_8ghf9h = { analyzeQueryPlan };
const _ref_lb6na8 = { tokenizeText };
const _ref_gyoxmq = { listenSocket };
const _ref_4dd47m = { loadDriver };
const _ref_pgc97e = { processAudioBuffer };
const _ref_dm2di2 = { checkRootAccess };
const _ref_qdhd66 = { watchFileChanges };
const _ref_gvdxda = { syncDatabase };
const _ref_udvc5o = { stepSimulation };
const _ref_9izs5c = { throttleRequests };
const _ref_gru0fb = { validateTokenStructure };
const _ref_4qamji = { wakeUp };
const _ref_hydbne = { enableInterrupts };
const _ref_yn0kbv = { isFeatureEnabled };
const _ref_fb249z = { interpretBytecode };
const _ref_twscty = { removeRigidBody };
const _ref_537nbu = { traceStack };
const _ref_pbahba = { checkIntegrityToken };
const _ref_5df92p = { startOscillator };
const _ref_qitxqo = { setDopplerFactor }; 
    });
})({}, {});