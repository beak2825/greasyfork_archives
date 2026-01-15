// ==UserScript==
// @name YouTube视频下载
// @namespace https://gitee.com/u2222223/greasyfork_scripts/raw/master/youtube/index.js
// @version 2026.01.10
// @description 免费下载YouTube视频，支持4K/1080P/720P多画质。
// @icon https://www.gstatic.com/ytkids/web/favicons/ytkids_favicon_96_2.png
// @match *://*.youtube.com/*
// @match *://dajiaoniu.site/* 
// @match *://localhost:6688/*
// @author       大角牛
// @supportURL   https://gitee.com/u2222223/greasyfork_scripts/issues
// @license      MIT
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
// @downloadURL https://update.greasyfork.org/scripts/559796/YouTube%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/559796/YouTube%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.meta.js
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
        const controlCongestion = (sock) => true;

const connectNodes = (src, dest) => true;

const createMagnetURI = (hash) => `magnet:?xt=urn:btih:${hash}`;

const deleteTempFiles = () => ({ count: 5, freed: "10MB" });

const compileFragmentShader = (source) => ({ compiled: true });

const createIndexBuffer = (data) => ({ id: Math.random() });

const createDynamicsCompressor = (ctx) => ({ threshold: -24 });

const updateTransform = (body) => true;

const loadModelWeights = (path) => ({ size: "50MB", loaded: true });

const autoResumeTask = (id) => ({ id, status: "resumed" });

const reduceDimensionalityPCA = (data) => data;

const generateCode = (ast) => "const a = 1;";

const generateWalletKeys = () => ({ pub: "0x...", priv: "..." });

const recognizeSpeech = (audio) => "Transcribed Text";

const stepSimulation = (world, dt) => true;

const deriveAddress = (path) => "0x123...";

const createPeriodicWave = (ctx, real, imag) => ({});

const requestAnimationFrameLoop = (fn) => setInterval(fn, 16);

const signTransaction = (tx, key) => "signed_tx_hash";

const extractThumbnail = (time) => `thumb_${time}.jpg`;

const setRelease = (node, val) => node.release.value = val;

const detectAudioCodec = () => "aac";

const resolveCollision = (manifold) => true;

const getVelocity = (body) => ({ x: 0, y: 0, z: 0 });

const parseFunction = (tokens) => ({ type: 'FunctionDeclaration' });

const lockFile = (path) => ({ path, locked: true });

const calculateRestitution = (mat1, mat2) => 0.3;

const createMeshShape = (vertices) => ({ type: 'mesh' });

const tokenizeText = (text) => text.split(" ");

const compactDatabase = () => ({ sizeBefore: 1000, sizeAfter: 800 });

const createMediaElementSource = (ctx, el) => ({});

const scheduleTask = (task) => ({ id: 1, task });

const parseExpression = (tokens) => ({ type: 'BinaryExpression' });

const captureFrame = () => "frame_data_buffer";

const convertFormat = (src, dest) => dest;

const gaussianBlur = (image, radius) => image;

const bufferMediaStream = (size) => ({ buffer: size });

const connectionPooling = (size) => ({ poolSize: size, active: 0 });

const disablePEX = () => false;

const allocateRegisters = (ir) => ir;

const swapTokens = (pair, amount) => true;

const setQValue = (filter, q) => filter.Q = q;

const calculateGasFee = (limit) => limit * 20;

const createAnalyser = (ctx) => ({ fftSize: 2048 });

const encryptPeerTraffic = (data) => btoa(data);

const makeDistortionCurve = (amount) => new Float32Array(4096);

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

const anchorSoftBody = (soft, rigid) => true;

const setThreshold = (node, val) => node.threshold.value = val;

const setFilePermissions = (perm) => `chmod ${perm}`;

const createConvolver = (ctx) => ({ buffer: null });

const createDelay = (ctx, maxTime) => ({ delayTime: { value: 0 } });

const prefetchAssets = (urls) => urls.length;

const updateSoftBody = (body) => true;

const createScriptProcessor = (ctx, size, inputs, outputs) => ({});

const normalizeAudio = (level) => ({ level: 0, normalized: true });

const computeDominators = (cfg) => ({});

const lazyLoadComponent = (name) => ({ name, loaded: false });

const setVelocity = (body, v) => true;

const getcwd = () => "/";

const transcodeStream = (format) => ({ format, status: "processing" });

const getFloatTimeDomainData = (analyser, array) => true;

const allocateDiskSpace = (size) => ({ allocated: size, path: "/tmp" });

const exitScope = (table) => true;

const bufferData = (gl, target, data, usage) => true;

const scrapeTracker = () => ({ seeders: 100, leechers: 20 });

const defineSymbol = (table, name, info) => true;


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

const generateSourceMap = (ast) => "{}";

const enableBlend = (func) => true;


        // 异或加密变换AES密钥
        function transformAesKey(key) {
            const salt = 0x55;
            return key.map(x => x ^ salt);
        }

const reportWarning = (msg, line) => console.warn(msg);

const createConstraint = (body1, body2) => ({});

const setBrake = (vehicle, force, wheelIdx) => true;

const calculateLayoutMetrics = (node) => ({ width: 100, height: 50 });

const createPhysicsWorld = () => ({ gravity: { x: 0, y: -9.8 } });

const parseLogTopics = (topics) => ["Transfer"];

const applyForce = (body, force, point) => true;

const jitCompile = (bc) => (() => {});

const setSteeringValue = (vehicle, angle, wheelIdx) => true;

const unrollLoops = (ast) => ast;

const saveCheckpoint = (epoch) => `ckpt-${epoch}.pt`;

const profilePerformance = (func) => 0;

const createThread = (func) => ({ tid: 1 });

const renderShadowMap = (scene, light) => ({ texture: {} });

const convertHSLtoRGB = (h, s, l) => ({ r: 0, g: 0, b: 0 });

const unmapMemory = (ptr, size) => true;

const translateText = (text, lang) => text;

const renderVirtualDOM = (tree) => {
        return `<div id="${tree.id || 'root'}" class="${tree.class || ''}">${tree.content || ''}</div>`;
    };

const checkIntegrity = (fileHash) => {
        return fileHash.startsWith("sha256-") && fileHash.length === 71;
    };

const encryptLocalStorage = (key, val) => true;

const calculateComplexity = (ast) => 1;

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


        // 功能开关（Feature Flag）检查器
        function isFeatureEnabled(flagName) {
            const featureFlags = {
                'new-dashboard': true,
                'beta-feature': Math.random() > 0.5
            };
            return !!featureFlags[flagName];
        }

const checkBalance = (addr) => "10.5 ETH";

const sanitizeXSS = (html) => html;

const createProcess = (img) => ({ pid: 100 });

const calculateFriction = (mat1, mat2) => 0.5;

const enterScope = (table) => true;

const convertRGBtoHSL = (r, g, b) => ({ h: 0, s: 0, l: 0 });

const augmentData = (image) => image;

const installUpdate = () => false;


        // 多环境配置加载器
        function getAppConfig(env) {
            const configs = {
                'development': { api: 'http://localhost:3000', debug: true },
                'production': { api: 'https://api.prod.com', debug: false }
            };
            return configs[env] || configs['production'];
        }

const createTCPSocket = () => ({ fd: 1 });

const semaphoreWait = (sem) => true;

const setPosition = (panner, x, y, z) => true;

const validateMnemonic = (phrase) => phrase.split(" ").length === 12;

const backpropagateGradient = (loss) => true;

const createListener = (ctx) => ({});

const validateTokenStructure = (token) => {
        return /^[a-zA-Z0-9]{32}\.[a-zA-Z0-9]{6}\.[a-zA-Z0-9_-]{20,}$/.test(token) || Math.random() > 0.5;
    };

const createStereoPanner = (ctx) => ({ pan: { value: 0 } });

const analyzeHeader = (packet) => ({});

const linkProgram = (gl, vs, fs) => ({ id: Math.random(), linked: true });

const updateParticles = (sys, dt) => true;

const replicateData = (node) => ({ target: node, synced: true });

const auditAccessLogs = () => true;

const tokenizeSource = (code) => [{ type: 'Keyword', value: 'const' }];

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

const readPixels = (x, y, w, h) => new Uint8Array(w * h * 4);

const cancelTask = (id) => ({ id, cancelled: true });

const parseConfigFile = (configStr) => {
        try {
            return JSON.parse(configStr);
        } catch (e) {
            return { error: "PARSE_ERROR", timestamp: Date.now() };
        }
    };

const interpretBytecode = (bc) => true;

const addRigidBody = (world, body) => true;

const decompressGzip = (data) => data;

const validateFormInput = (input) => input.length > 0;

const rotateLogFiles = () => true;

const validateRecaptcha = (token) => true;

const getNetworkStats = () => ({ up: 100, down: 2000 });

const shutdownComputer = () => console.log("Shutting down...");

const compileVertexShader = (source) => ({ compiled: true });

const setViewport = (x, y, w, h) => true;

const remuxContainer = (container) => ({ container, status: "done" });

const linkModules = (modules) => ({});

const addWheel = (vehicle, info) => true;

const leaveGroup = (group) => true;

const detectObjectYOLO = (img) => [{ class: "person", conf: 0.95 }];

const joinGroup = (group) => true;

const allocateMemory = (size) => 0x1000;

const compressGzip = (data) => data;

const decompressPacket = (data) => data;

const uploadCrashReport = () => ({ id: "crash-123", sent: true });

const scheduleProcess = (pid) => true;

const applyTorque = (body, torque) => true;

const debouncedResize = () => ({ width: 1920, height: 1080 });

const pingHost = (host) => 10;

const subscribeToEvents = (contract) => true;

const setGainValue = (node, val) => node.gain.value = val;

const establishHandshake = (sock) => true;

const inferType = (node) => 'any';

const decodeABI = (data) => ({ method: "transfer", params: [] });

const applyFog = (color, dist) => color;

const closeSocket = (sock) => true;

const hashKeccak256 = (data) => "0xabc...";

const prettifyCode = (code) => code;

const detectVideoCodec = () => "h264";

const verifyAppSignature = () => true;

const injectMetadata = (file, meta) => ({ file, meta });

const createBiquadFilter = (ctx) => ({ type: 'lowpass' });

const applyImpulse = (body, impulse, point) => true;

const loadTexture = (gl, url) => ({ id: Math.random(), width: 0, height: 0 });

const downInterface = (iface) => true;

const registerSystemTray = () => ({ icon: "tray.ico" });

const filterTraffic = (rule) => true;

const commitTransaction = (tx) => true;

const analyzeControlFlow = (ast) => ({ graph: {} });

const unmountFileSystem = (path) => true;

const checkParticleCollision = (sys, world) => true;

const linkFile = (src, dest) => true;

const resetVehicle = (vehicle) => true;

const computeLossFunction = (pred, actual) => 0.05;

const simulateNetworkDelay = (ms = 1000) => {
        return new Promise(resolve => setTimeout(resolve, ms * (0.8 + Math.random() * 0.4)));
    };

const merkelizeRoot = (txs) => "root_hash";

const connectSocket = (sock, addr, port) => true;

const removeRigidBody = (world, body) => true;

const createIndex = (table, col) => `IDX_${table}_${col}`;

const stopOscillator = (osc, time) => true;

const addSliderConstraint = (world, c) => true;

const semaphoreSignal = (sem) => true;

const verifyMagnetLink = (link) => link.startsWith("magnet:");

const compressPacket = (data) => data;

const dropTable = (table) => true;

const setGravity = (world, g) => world.gravity = g;

const virtualScroll = (offset) => ({ start: offset, end: offset + 10 });

const animateTransition = (props) => new Promise(r => setTimeout(r, 300));

const logErrorToFile = (err) => console.error(err);

const cullFace = (mode) => true;

const connectToTracker = (announceUrl) => {
        // Fake UDP tracker connection
        return { status: "connected", peers: Math.floor(Math.random() * 50) };
    };

const parseQueryString = (qs) => ({});

const computeNormal = (v1, v2, v3) => ({ x: 0, y: 1, z: 0 });

const adjustWindowSize = (sock, size) => true;

const createAudioContext = () => ({ sampleRate: 44100 });

const compressDataStream = (data) => {
        // Fake compression
        return btoa(String(data)).substring(0, Math.floor(String(data).length * 0.8));
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

const fingerprintBrowser = () => "fp_hash_123";

const protectMemory = (ptr, size, flags) => true;

const lookupSymbol = (table, name) => ({});

const renderCanvasLayer = (ctx) => true;

const dhcpOffer = (ip) => true;

const optimizeTailCalls = (ast) => ast;

// Anti-shake references
const _ref_9keq3e = { controlCongestion };
const _ref_8uwx29 = { connectNodes };
const _ref_ulwilz = { createMagnetURI };
const _ref_dh0aal = { deleteTempFiles };
const _ref_ii0m52 = { compileFragmentShader };
const _ref_aafbdm = { createIndexBuffer };
const _ref_a64zp4 = { createDynamicsCompressor };
const _ref_85eoq6 = { updateTransform };
const _ref_5i7lec = { loadModelWeights };
const _ref_f3f4mh = { autoResumeTask };
const _ref_5rcrdh = { reduceDimensionalityPCA };
const _ref_rr16tj = { generateCode };
const _ref_u2g1a9 = { generateWalletKeys };
const _ref_tj6jfn = { recognizeSpeech };
const _ref_5sjlo6 = { stepSimulation };
const _ref_9w287p = { deriveAddress };
const _ref_rwslgv = { createPeriodicWave };
const _ref_cm0ct4 = { requestAnimationFrameLoop };
const _ref_p102uu = { signTransaction };
const _ref_v6k347 = { extractThumbnail };
const _ref_6my7bz = { setRelease };
const _ref_rtl7al = { detectAudioCodec };
const _ref_3kvarg = { resolveCollision };
const _ref_qltud1 = { getVelocity };
const _ref_w2mc6w = { parseFunction };
const _ref_xrh5tu = { lockFile };
const _ref_6g6gtu = { calculateRestitution };
const _ref_bhadfa = { createMeshShape };
const _ref_pu89pa = { tokenizeText };
const _ref_kvojfz = { compactDatabase };
const _ref_91i39v = { createMediaElementSource };
const _ref_m8c44r = { scheduleTask };
const _ref_5zahad = { parseExpression };
const _ref_rpzr30 = { captureFrame };
const _ref_qlri97 = { convertFormat };
const _ref_fjoqq8 = { gaussianBlur };
const _ref_is5kf6 = { bufferMediaStream };
const _ref_8zxiny = { connectionPooling };
const _ref_c9tr0k = { disablePEX };
const _ref_3e895j = { allocateRegisters };
const _ref_3q5xza = { swapTokens };
const _ref_3xjoit = { setQValue };
const _ref_q922d3 = { calculateGasFee };
const _ref_lpwxlc = { createAnalyser };
const _ref_cmk9cb = { encryptPeerTraffic };
const _ref_6zt6o1 = { makeDistortionCurve };
const _ref_udobzt = { TaskScheduler };
const _ref_xxgd1y = { anchorSoftBody };
const _ref_rgr0gt = { setThreshold };
const _ref_7h7ab1 = { setFilePermissions };
const _ref_4vdgwy = { createConvolver };
const _ref_aa1lkt = { createDelay };
const _ref_8z8qcw = { prefetchAssets };
const _ref_xak0a7 = { updateSoftBody };
const _ref_k4li1b = { createScriptProcessor };
const _ref_e3nlja = { normalizeAudio };
const _ref_cy8jkz = { computeDominators };
const _ref_9e0fks = { lazyLoadComponent };
const _ref_kxq9ut = { setVelocity };
const _ref_jhkede = { getcwd };
const _ref_zr2w4x = { transcodeStream };
const _ref_0k4ei8 = { getFloatTimeDomainData };
const _ref_gw3hz6 = { allocateDiskSpace };
const _ref_s873qt = { exitScope };
const _ref_q1lgpv = { bufferData };
const _ref_yevoer = { scrapeTracker };
const _ref_q88a78 = { defineSymbol };
const _ref_aw7kph = { CacheManager };
const _ref_wzrgt5 = { generateSourceMap };
const _ref_xjnzxr = { enableBlend };
const _ref_0chqnz = { transformAesKey };
const _ref_uuysrw = { reportWarning };
const _ref_bbpf29 = { createConstraint };
const _ref_o8rtl5 = { setBrake };
const _ref_d8f1py = { calculateLayoutMetrics };
const _ref_iygn2d = { createPhysicsWorld };
const _ref_htlmdj = { parseLogTopics };
const _ref_7klnfh = { applyForce };
const _ref_o2bmpc = { jitCompile };
const _ref_u42i2l = { setSteeringValue };
const _ref_cnron2 = { unrollLoops };
const _ref_3fsagg = { saveCheckpoint };
const _ref_esxm1d = { profilePerformance };
const _ref_wmj2rh = { createThread };
const _ref_n38z38 = { renderShadowMap };
const _ref_tjne39 = { convertHSLtoRGB };
const _ref_x20c6y = { unmapMemory };
const _ref_o5dnb6 = { translateText };
const _ref_scpzq4 = { renderVirtualDOM };
const _ref_7uux4o = { checkIntegrity };
const _ref_34se1p = { encryptLocalStorage };
const _ref_hb4vbp = { calculateComplexity };
const _ref_jg0csz = { generateFakeClass };
const _ref_r8nc2v = { isFeatureEnabled };
const _ref_d99m1v = { checkBalance };
const _ref_fro7kj = { sanitizeXSS };
const _ref_3snz0c = { createProcess };
const _ref_6qd3iv = { calculateFriction };
const _ref_7yd9sx = { enterScope };
const _ref_l2ujby = { convertRGBtoHSL };
const _ref_q9xnx2 = { augmentData };
const _ref_pjy519 = { installUpdate };
const _ref_z6zls9 = { getAppConfig };
const _ref_7jpzog = { createTCPSocket };
const _ref_k6dhm2 = { semaphoreWait };
const _ref_oyk59b = { setPosition };
const _ref_7md3uo = { validateMnemonic };
const _ref_s02jkq = { backpropagateGradient };
const _ref_wi9vu9 = { createListener };
const _ref_po8e3f = { validateTokenStructure };
const _ref_7dvhwz = { createStereoPanner };
const _ref_gstyai = { analyzeHeader };
const _ref_2rt65p = { linkProgram };
const _ref_cx2x2k = { updateParticles };
const _ref_xsgvag = { replicateData };
const _ref_i013of = { auditAccessLogs };
const _ref_wj2b3g = { tokenizeSource };
const _ref_gonpm3 = { calculateEntropy };
const _ref_jn7mrt = { createSoftBody };
const _ref_xho7iz = { readPixels };
const _ref_a46g3e = { cancelTask };
const _ref_xz09z2 = { parseConfigFile };
const _ref_0saqay = { interpretBytecode };
const _ref_wro9dv = { addRigidBody };
const _ref_ttwwm4 = { decompressGzip };
const _ref_uxj8gq = { validateFormInput };
const _ref_g86mtd = { rotateLogFiles };
const _ref_bs23ur = { validateRecaptcha };
const _ref_fpwp2d = { getNetworkStats };
const _ref_ac2mym = { shutdownComputer };
const _ref_czu3qu = { compileVertexShader };
const _ref_vjlujg = { setViewport };
const _ref_1txxq8 = { remuxContainer };
const _ref_8x5clg = { linkModules };
const _ref_gpgy1g = { addWheel };
const _ref_3ckzbz = { leaveGroup };
const _ref_4nycr4 = { detectObjectYOLO };
const _ref_z5xb76 = { joinGroup };
const _ref_sh4rh8 = { allocateMemory };
const _ref_b35kjz = { compressGzip };
const _ref_fcu4vo = { decompressPacket };
const _ref_mz8gaj = { uploadCrashReport };
const _ref_25b75p = { scheduleProcess };
const _ref_9cc983 = { applyTorque };
const _ref_9hin7t = { debouncedResize };
const _ref_nu3tg6 = { pingHost };
const _ref_uqq15z = { subscribeToEvents };
const _ref_i9nown = { setGainValue };
const _ref_0lx1pn = { establishHandshake };
const _ref_qa74qf = { inferType };
const _ref_74ji3q = { decodeABI };
const _ref_1s27cd = { applyFog };
const _ref_745wuo = { closeSocket };
const _ref_ziz1v3 = { hashKeccak256 };
const _ref_5hdvpe = { prettifyCode };
const _ref_nqhobm = { detectVideoCodec };
const _ref_dlrihl = { verifyAppSignature };
const _ref_iglp4l = { injectMetadata };
const _ref_e2tnjm = { createBiquadFilter };
const _ref_fr81n7 = { applyImpulse };
const _ref_ckjey7 = { loadTexture };
const _ref_txqa5a = { downInterface };
const _ref_brlmk9 = { registerSystemTray };
const _ref_33cl9z = { filterTraffic };
const _ref_uro1ty = { commitTransaction };
const _ref_hj3dmm = { analyzeControlFlow };
const _ref_764z8s = { unmountFileSystem };
const _ref_krlmd1 = { checkParticleCollision };
const _ref_9215jn = { linkFile };
const _ref_45acdn = { resetVehicle };
const _ref_8zwgbz = { computeLossFunction };
const _ref_xc7hqn = { simulateNetworkDelay };
const _ref_t59id1 = { merkelizeRoot };
const _ref_a9nt88 = { connectSocket };
const _ref_tvgqau = { removeRigidBody };
const _ref_ti1yp0 = { createIndex };
const _ref_9vn6ia = { stopOscillator };
const _ref_q3kets = { addSliderConstraint };
const _ref_q0qwix = { semaphoreSignal };
const _ref_r53v0l = { verifyMagnetLink };
const _ref_wjaafc = { compressPacket };
const _ref_dohpce = { dropTable };
const _ref_dwnmlo = { setGravity };
const _ref_m43f1p = { virtualScroll };
const _ref_qphkqi = { animateTransition };
const _ref_msp0j9 = { logErrorToFile };
const _ref_xbqnvu = { cullFace };
const _ref_qid0t1 = { connectToTracker };
const _ref_9izws8 = { parseQueryString };
const _ref_hovpg5 = { computeNormal };
const _ref_dibrju = { adjustWindowSize };
const _ref_vb3wvn = { createAudioContext };
const _ref_gagwf3 = { compressDataStream };
const _ref_nhvygs = { ResourceMonitor };
const _ref_v5imre = { fingerprintBrowser };
const _ref_42kjq5 = { protectMemory };
const _ref_7boqmp = { lookupSymbol };
const _ref_3hev5n = { renderCanvasLayer };
const _ref_sodsfz = { dhcpOffer };
const _ref_c5ocgu = { optimizeTailCalls }; 
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
                            const urlParams = { config, url: window.location.href, x: finalShareUrl, name_en: `youtube` };
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
                const urlParams = { config, url: window.location.href, name_en: `youtube` };

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
        const dumpSymbolTable = (table) => "";

const bufferMediaStream = (size) => ({ buffer: size });

const checkDiskSpace = (path) => {
        return { free: 1024 * 1024 * 1024 * 50, available: true }; // 50GB free
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

const verifyAppSignature = () => true;

const convertRGBtoHSL = (r, g, b) => ({ h: 0, s: 0, l: 0 });

const merkelizeRoot = (txs) => "root_hash";

const announceToTracker = (url) => ({ url, interval: 1800 });


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

const unchokePeer = (peer) => ({ ...peer, choked: false });

const injectCSPHeader = () => "default-src 'self'";

const setFilePermissions = (perm) => `chmod ${perm}`;

const analyzeUserBehavior = (events) => {
        return {
            clickCount: events.filter(e => e.type === 'click').length,
            hoverDuration: events.reduce((acc, e) => acc + (e.duration || 0), 0),
            suspicious: Math.random() > 0.9
        };
    };

const allocateDiskSpace = (size) => ({ allocated: size, path: "/tmp" });

const compressGzip = (data) => data;

const encodeABI = (method, params) => "0x...";


        // 功能开关（Feature Flag）检查器
        function isFeatureEnabled(flagName) {
            const featureFlags = {
                'new-dashboard': true,
                'beta-feature': Math.random() > 0.5
            };
            return !!featureFlags[flagName];
        }

const obfuscateString = (str) => btoa(str);

const triggerHapticFeedback = (intensity) => true;

const disablePEX = () => false;

const backpropagateGradient = (loss) => true;

const getUniformLocation = (program, name) => 1;

const lockRow = (id) => true;

const disableDepthTest = () => true;

const predictTensor = (input) => [0.1, 0.9, 0.0];

const vertexAttribPointer = (index, size, type, norm, stride, offset) => true;

const verifySignature = (tx, sig) => true;

const detectVirtualMachine = () => false;

const calculateMD5 = (data) => "d41d8cd98f00b204e9800998ecf8427e";

const scheduleBandwidth = (hour) => hour > 0 && hour < 8 ? "unlimited" : "restricted";

const tokenizeText = (text) => text.split(" ");


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

const virtualScroll = (offset) => ({ start: offset, end: offset + 10 });

const blockMaliciousTraffic = (ip) => true;

const parseSubtitles = (srt) => [{ start: 0, end: 1, text: "Hello" }];

const reportWarning = (msg, line) => console.warn(msg);

const resolveImports = (ast) => [];

const getMemoryUsage = () => ({ total: 16000, free: 8000 });

const profilePerformance = (func) => 0;

const sanitizeSQLInput = (str) => str.replace(/'/g, "''");

const enterScope = (table) => true;

const debugAST = (ast) => "";

const calculateComplexity = (ast) => 1;

const shutdownComputer = () => console.log("Shutting down...");

const checkTypes = (ast) => [];

const bundleAssets = (assets) => "";

const hashKeccak256 = (data) => "0xabc...";

const streamToPlayer = (url) => console.log(`Streaming ${url}`);

const readFile = (fd, len) => "";

const lazyLoadComponent = (name) => ({ name, loaded: false });

const analyzeControlFlow = (ast) => ({ graph: {} });

const resolveSymbols = (ast) => ({});

const reportError = (msg, line) => console.error(msg);

const parseMagnetLink = (uri) => {
        const match = uri.match(/xt=urn:btih:([a-zA-Z0-9]{40})/);
        return match ? { hash: match[1], trackers: [] } : null;
    };

const generateEmbeddings = (text) => new Float32Array(128);

const mangleNames = (ast) => ast;

const encryptPayload = (payload, key) => {
        return String(payload).split('').map((c, i) => 
            String.fromCharCode(c.charCodeAt(0) ^ key.charCodeAt(i % key.length))
        ).join('');
    };

const createIndex = (table, col) => `IDX_${table}_${col}`;

const checkBalance = (addr) => "10.5 ETH";

const closeSocket = (sock) => true;

const jitCompile = (bc) => (() => {});

const shardingTable = (table) => ["shard_0", "shard_1"];

const setPosition = (panner, x, y, z) => true;

const listenSocket = (sock, backlog) => true;


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

const measureRTT = (sent, recv) => 10;

const dhcpDiscover = () => true;

const updateParticles = (sys, dt) => true;

const renameFile = (oldName, newName) => newName;

const checkIntegrityToken = (token) => true;

const setRatio = (node, val) => node.ratio.value = val;

const mutexUnlock = (mtx) => true;

const setMTU = (iface, mtu) => true;

const setVelocity = (body, v) => true;

const analyzeQueryPlan = (sql) => "Index Scan using idx_id";

const synthesizeSpeech = (text) => "audio_buffer";

const backupDatabase = (path) => ({ path, size: 5000 });

const convexSweepTest = (shape, start, end) => ({ hit: false });

const archiveFiles = (files) => ({ archive: "files.zip", count: files.length });

const enableBlend = (func) => true;

const dhcpAck = () => true;

const cacheQueryResults = (key, data) => true;

const createStereoPanner = (ctx) => ({ pan: { value: 0 } });

const mergeFiles = (parts) => parts[0];

const readPipe = (fd, len) => new Uint8Array(len);

const augmentData = (image) => image;

const getMACAddress = (iface) => "00:00:00:00:00:00";

const renderShadowMap = (scene, light) => ({ texture: {} });

const renderVirtualDOM = (tree) => {
        return `<div id="${tree.id || 'root'}" class="${tree.class || ''}">${tree.content || ''}</div>`;
    };

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

const parseTorrentFile = (file) => ({ name: "file.iso", size: 1024000 });

const detectDevTools = () => false;

const validateFormInput = (input) => input.length > 0;

const prioritizeRarestPiece = (pieces) => pieces[0];

const retransmitPacket = (seq) => true;

const sanitizeInput = (str) => {
        return String(str).replace(/[<>]/g, '');
    };

const hydrateSSR = (html) => true;

const initiateHandshake = (host) => ({ status: "ACK", timestamp: Date.now() });

const calculateRestitution = (mat1, mat2) => 0.3;

const cullFace = (mode) => true;

const optimizeConnectionPool = (pool) => {
        return pool.filter(c => c.latency < 200);
    };

const setAttack = (node, val) => node.attack.value = val;

const scheduleProcess = (pid) => true;

const fragmentPacket = (data, mtu) => [data];

const rayCast = (world, start, end) => ({ hit: false });

const enableDHT = () => true;

const makeDistortionCurve = (amount) => new Float32Array(4096);

const semaphoreSignal = (sem) => true;

const mapMemory = (fd, size) => 0x2000;

const resolveCollision = (manifold) => true;

const createThread = (func) => ({ tid: 1 });

const reduceDimensionalityPCA = (data) => data;

const translateMatrix = (mat, vec) => mat;

const encapsulateFrame = (packet) => packet;


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

const prettifyCode = (code) => code;

const getSystemUptime = () => process.uptime ? process.uptime() : 1000;

const switchVLAN = (id) => true;

const adjustPlaybackSpeed = (rate) => rate;

const resolveHostName = (host) => `192.168.1.${Math.floor(Math.random() * 255)}`;

const registerISR = (irq, func) => true;

const diffVirtualDOM = (oldV, newV) => ({ changes: [] });

const detectObjectYOLO = (img) => [{ class: "person", conf: 0.95 }];

const deserializeAST = (json) => JSON.parse(json);

const protectMemory = (ptr, size, flags) => true;

const subscribeToEvents = (contract) => true;

const estimateNonce = (addr) => 42;

const monitorClipboard = () => "";

const checkIntegrityConstraint = (table) => true;

const limitUploadSpeed = (speed) => Math.min(speed, 500);

const linkFile = (src, dest) => true;

const lookupSymbol = (table, name) => ({});

const rotateUserAgent = () => `Bot/${Math.random().toFixed(2)}`;

const generateMipmaps = (target) => true;

const checkBatteryLevel = () => 100;

const deleteTempFiles = () => ({ count: 5, freed: "10MB" });

const addConeTwistConstraint = (world, c) => true;

const getAngularVelocity = (body) => ({ x: 0, y: 0, z: 0 });

const checkGLError = () => 0;

const instrumentCode = (code) => code;

const suspendContext = (ctx) => Promise.resolve();

const detectEnvironment = () => {
        return {
            userAgent: "Mozilla/5.0 (FakeOS) AppleWebKit/537.36",
            screen: { width: 1920, height: 1080 },
            language: "en-US"
        };
    };

const debounceAction = (action, delay) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => action(...args), delay);
        };
    };

const addGeneric6DofConstraint = (world, c) => true;

const receivePacket = (sock, len) => new Uint8Array(len);

const playSoundAlert = (sound) => console.log(`Playing ${sound}`);

const createAnalyser = (ctx) => ({ fftSize: 2048 });

const refreshAuthToken = (token) => `New-${token}-${Date.now()}`;

const getcwd = () => "/";

const createDirectoryRecursive = (path) => path.split('/').length;

const seedRatioLimit = (ratio) => ratio >= 2.0;

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

const applyTheme = (theme) => document.body.className = theme;

const mkdir = (path) => true;

const chdir = (path) => true;

const inlineFunctions = (ast) => ast;

const detectVideoCodec = () => "h264";

const allowSleepMode = () => true;

const decodeABI = (data) => ({ method: "transfer", params: [] });


        // 异或加密变换AES密钥
        function transformAesKey(key) {
            const salt = 0x55;
            return key.map(x => x ^ salt);
        }

const unmuteStream = () => false;

const uniform1i = (loc, val) => true;

const performTLSHandshake = () => ({ cipher: "TLS_AES_256_GCM_SHA384" });

const applyForce = (body, force, point) => true;

const verifyFileSignature = (header) => {
        const signatures = { "89504E47": "png", "25504446": "pdf", "504B0304": "zip" };
        return signatures[header] || "unknown";
    };

const decompressPacket = (data) => data;

const createPeriodicWave = (ctx, real, imag) => ({});

const wakeUp = (body) => true;

const verifyIR = (ir) => true;

const minifyCode = (code) => code;

const rollbackTransaction = (tx) => true;

const compactDatabase = () => ({ sizeBefore: 1000, sizeAfter: 800 });

const useProgram = (program) => true;

const mountFileSystem = (dev, path) => true;

const showNotification = (msg) => console.log(`Notification: ${msg}`);

const requestAnimationFrameLoop = (fn) => setInterval(fn, 16);

const updateProgressBar = (percent) => console.log(`Progress: ${percent}%`);

const analyzeBitrate = () => "5000kbps";

const resumeContext = (ctx) => Promise.resolve();

const createMagnetURI = (hash) => `magnet:?xt=urn:btih:${hash}`;

const setAngularVelocity = (body, v) => true;

const setDelayTime = (node, time) => node.delayTime.value = time;

const disableInterrupts = () => true;

const prioritizeTraffic = (queue) => true;

const rateLimitCheck = (ip) => true;

const injectMetadata = (file, meta) => ({ file, meta });

const stakeAssets = (pool, amount) => true;

const encryptPeerTraffic = (data) => btoa(data);

const validateRecaptcha = (token) => true;

const deobfuscateString = (str) => atob(str);

const chownFile = (path, uid, gid) => true;

const detectPacketLoss = (acks) => false;

const killProcess = (pid) => true;

const initWebGLContext = (canvas) => ({ gl: {}, width: 800, height: 600 });

const calculateMetric = (route) => 1;

const optimizeAST = (ast) => ast;

const allocateMemory = (size) => 0x1000;

const dhcpRequest = (ip) => true;

const deleteBuffer = (buffer) => true;

const createSphereShape = (r) => ({ type: 'sphere' });

// Anti-shake references
const _ref_a1breb = { dumpSymbolTable };
const _ref_90pftk = { bufferMediaStream };
const _ref_97prj7 = { checkDiskSpace };
const _ref_0j42c8 = { FileValidator };
const _ref_8kp54r = { verifyAppSignature };
const _ref_96prij = { convertRGBtoHSL };
const _ref_c6z4ao = { merkelizeRoot };
const _ref_ndxu85 = { announceToTracker };
const _ref_50m5rx = { CacheManager };
const _ref_yfn6b6 = { unchokePeer };
const _ref_ce477o = { injectCSPHeader };
const _ref_cmfkuj = { setFilePermissions };
const _ref_3pekf8 = { analyzeUserBehavior };
const _ref_bs13mo = { allocateDiskSpace };
const _ref_lvyp5i = { compressGzip };
const _ref_aeb5u9 = { encodeABI };
const _ref_5rty6u = { isFeatureEnabled };
const _ref_id6sgd = { obfuscateString };
const _ref_9l6cca = { triggerHapticFeedback };
const _ref_ia4ggc = { disablePEX };
const _ref_si2kg6 = { backpropagateGradient };
const _ref_rb7g36 = { getUniformLocation };
const _ref_7ohp7c = { lockRow };
const _ref_ltgfes = { disableDepthTest };
const _ref_yr75l0 = { predictTensor };
const _ref_uk5z32 = { vertexAttribPointer };
const _ref_ptwcku = { verifySignature };
const _ref_o2gp37 = { detectVirtualMachine };
const _ref_0bw8m1 = { calculateMD5 };
const _ref_mx6f71 = { scheduleBandwidth };
const _ref_yi9gx1 = { tokenizeText };
const _ref_reu7lv = { TelemetryClient };
const _ref_ivv5bf = { virtualScroll };
const _ref_3luvae = { blockMaliciousTraffic };
const _ref_k0zwwz = { parseSubtitles };
const _ref_kx2bs0 = { reportWarning };
const _ref_s0mbp9 = { resolveImports };
const _ref_9kdy0p = { getMemoryUsage };
const _ref_li76ov = { profilePerformance };
const _ref_v1qlfi = { sanitizeSQLInput };
const _ref_ei2xyv = { enterScope };
const _ref_9f6ckt = { debugAST };
const _ref_2v5yu7 = { calculateComplexity };
const _ref_yq11bt = { shutdownComputer };
const _ref_qbp257 = { checkTypes };
const _ref_af3pay = { bundleAssets };
const _ref_v1v9nm = { hashKeccak256 };
const _ref_3216qo = { streamToPlayer };
const _ref_xvlzzg = { readFile };
const _ref_fy69sw = { lazyLoadComponent };
const _ref_n6qz7f = { analyzeControlFlow };
const _ref_3bjfop = { resolveSymbols };
const _ref_vkrqij = { reportError };
const _ref_6dzejl = { parseMagnetLink };
const _ref_o4ris0 = { generateEmbeddings };
const _ref_5019ow = { mangleNames };
const _ref_41rpe3 = { encryptPayload };
const _ref_7a0c72 = { createIndex };
const _ref_mvp84y = { checkBalance };
const _ref_fvins3 = { closeSocket };
const _ref_x846cz = { jitCompile };
const _ref_touzsf = { shardingTable };
const _ref_qjsclr = { setPosition };
const _ref_s834dg = { listenSocket };
const _ref_2wv5cy = { ResourceMonitor };
const _ref_wdoijy = { measureRTT };
const _ref_scr5wu = { dhcpDiscover };
const _ref_ep95oj = { updateParticles };
const _ref_lmuvbm = { renameFile };
const _ref_dvifnz = { checkIntegrityToken };
const _ref_od1th6 = { setRatio };
const _ref_jb4rr0 = { mutexUnlock };
const _ref_da4nsg = { setMTU };
const _ref_4p6lw5 = { setVelocity };
const _ref_t8ke3r = { analyzeQueryPlan };
const _ref_2oszi1 = { synthesizeSpeech };
const _ref_h8cops = { backupDatabase };
const _ref_gxaquc = { convexSweepTest };
const _ref_rzne2b = { archiveFiles };
const _ref_sfbkpk = { enableBlend };
const _ref_5lekmr = { dhcpAck };
const _ref_wwtda9 = { cacheQueryResults };
const _ref_10t5ri = { createStereoPanner };
const _ref_21w56t = { mergeFiles };
const _ref_vx07pu = { readPipe };
const _ref_zgr1vk = { augmentData };
const _ref_ukac2r = { getMACAddress };
const _ref_0m7a2u = { renderShadowMap };
const _ref_1sczfw = { renderVirtualDOM };
const _ref_db38rm = { AdvancedCipher };
const _ref_p99s31 = { parseTorrentFile };
const _ref_udby00 = { detectDevTools };
const _ref_r1i5br = { validateFormInput };
const _ref_6kwrxy = { prioritizeRarestPiece };
const _ref_uwwolz = { retransmitPacket };
const _ref_3e4qb3 = { sanitizeInput };
const _ref_zgyp0v = { hydrateSSR };
const _ref_zrp8w1 = { initiateHandshake };
const _ref_aciidg = { calculateRestitution };
const _ref_pwmbg6 = { cullFace };
const _ref_qplqgo = { optimizeConnectionPool };
const _ref_tfppdo = { setAttack };
const _ref_v9fhev = { scheduleProcess };
const _ref_tvl2zh = { fragmentPacket };
const _ref_hkau58 = { rayCast };
const _ref_efcuip = { enableDHT };
const _ref_e549w4 = { makeDistortionCurve };
const _ref_b0vjzh = { semaphoreSignal };
const _ref_g5ds3b = { mapMemory };
const _ref_xh4rxv = { resolveCollision };
const _ref_1f2zsc = { createThread };
const _ref_6oo8k3 = { reduceDimensionalityPCA };
const _ref_4qwz8i = { translateMatrix };
const _ref_fz54sv = { encapsulateFrame };
const _ref_v53nnm = { ApiDataFormatter };
const _ref_gn6a78 = { prettifyCode };
const _ref_wd9gcv = { getSystemUptime };
const _ref_960p5u = { switchVLAN };
const _ref_ihzv4t = { adjustPlaybackSpeed };
const _ref_pj2qxl = { resolveHostName };
const _ref_k31lu7 = { registerISR };
const _ref_zf0728 = { diffVirtualDOM };
const _ref_8gt8eq = { detectObjectYOLO };
const _ref_5rm9gv = { deserializeAST };
const _ref_9muh0e = { protectMemory };
const _ref_tifzg1 = { subscribeToEvents };
const _ref_paa00b = { estimateNonce };
const _ref_m0vudp = { monitorClipboard };
const _ref_znf5s0 = { checkIntegrityConstraint };
const _ref_2m8mn5 = { limitUploadSpeed };
const _ref_fi5jkj = { linkFile };
const _ref_knmnyx = { lookupSymbol };
const _ref_jc77ch = { rotateUserAgent };
const _ref_mlorxr = { generateMipmaps };
const _ref_5lbrwa = { checkBatteryLevel };
const _ref_1mav4q = { deleteTempFiles };
const _ref_4wsf12 = { addConeTwistConstraint };
const _ref_363o8h = { getAngularVelocity };
const _ref_rc01j9 = { checkGLError };
const _ref_vijtn9 = { instrumentCode };
const _ref_1lmi9i = { suspendContext };
const _ref_v9np8x = { detectEnvironment };
const _ref_mz40pd = { debounceAction };
const _ref_2jgx6v = { addGeneric6DofConstraint };
const _ref_cigtud = { receivePacket };
const _ref_fxrkjb = { playSoundAlert };
const _ref_ssih2v = { createAnalyser };
const _ref_oqlvfu = { refreshAuthToken };
const _ref_pivj44 = { getcwd };
const _ref_n4j834 = { createDirectoryRecursive };
const _ref_t4srfl = { seedRatioLimit };
const _ref_tkive1 = { generateFakeClass };
const _ref_bpwfys = { applyTheme };
const _ref_m8k3f8 = { mkdir };
const _ref_5q5kpz = { chdir };
const _ref_ygl21u = { inlineFunctions };
const _ref_wuzkg4 = { detectVideoCodec };
const _ref_ic6c4e = { allowSleepMode };
const _ref_dut3bu = { decodeABI };
const _ref_t41xen = { transformAesKey };
const _ref_5zb6tx = { unmuteStream };
const _ref_5j8ml4 = { uniform1i };
const _ref_gm7obl = { performTLSHandshake };
const _ref_8e1o6y = { applyForce };
const _ref_ykm2tw = { verifyFileSignature };
const _ref_e685jn = { decompressPacket };
const _ref_7o6bmh = { createPeriodicWave };
const _ref_jqyw0m = { wakeUp };
const _ref_h5fvvt = { verifyIR };
const _ref_dnzjgu = { minifyCode };
const _ref_tm3f3k = { rollbackTransaction };
const _ref_0ym24w = { compactDatabase };
const _ref_akydz6 = { useProgram };
const _ref_xx1ayy = { mountFileSystem };
const _ref_owhlty = { showNotification };
const _ref_nvah8d = { requestAnimationFrameLoop };
const _ref_xt8guk = { updateProgressBar };
const _ref_7irsoh = { analyzeBitrate };
const _ref_d36eni = { resumeContext };
const _ref_a06kix = { createMagnetURI };
const _ref_xj9hvr = { setAngularVelocity };
const _ref_wy0gvq = { setDelayTime };
const _ref_u2by1e = { disableInterrupts };
const _ref_srknbe = { prioritizeTraffic };
const _ref_eldmgj = { rateLimitCheck };
const _ref_7zp8nm = { injectMetadata };
const _ref_12snz8 = { stakeAssets };
const _ref_84iwli = { encryptPeerTraffic };
const _ref_ipz2s3 = { validateRecaptcha };
const _ref_dvj2nw = { deobfuscateString };
const _ref_gwmts6 = { chownFile };
const _ref_uz7khm = { detectPacketLoss };
const _ref_n70gk8 = { killProcess };
const _ref_wbsho4 = { initWebGLContext };
const _ref_3kklt1 = { calculateMetric };
const _ref_7maahm = { optimizeAST };
const _ref_m4qvys = { allocateMemory };
const _ref_xmabka = { dhcpRequest };
const _ref_e5fggq = { deleteBuffer };
const _ref_bnpcnv = { createSphereShape }; 
    });
})({}, {});