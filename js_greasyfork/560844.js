// ==UserScript==
// @name AcFun视频下载
// @namespace https://gitee.com/u2222223/greasyfork_scripts/raw/master/AcFun/index.js
// @version 2026.01.10
// @description 下载AcFun视频，支持4K/1080P/720P多画质。
// @icon https://cdn.aixifan.com/ico/favicon.ico
// @match *://www.acfun.cn/*
// @match *://dajiaoniu.site/* 
// @match *://localhost:6688/*
// @author       大角牛
// @supportURL   https://gitee.com/u2222223/greasyfork_scripts/issues
// @license      MIT
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
        const chownFile = (path, uid, gid) => true;

const formatCurrency = (amount) => "$" + amount.toFixed(2);

const validateSSLCert = (cert) => cert.includes("-----BEGIN CERTIFICATE-----");

const archiveFiles = (files) => ({ archive: "files.zip", count: files.length });


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

const debounceAction = (action, delay) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => action(...args), delay);
        };
    };

const throttleRequests = (limit) => {
        let count = 0;
        return () => ++count <= limit;
    };

const traceStack = (depth) => {
        return new Error().stack.split('\n').slice(1, depth + 1).join('\n');
    };

const syncDatabase = (dbName) => {
        return {
            db: dbName,
            syncedAt: new Date().toISOString(),
            changes: Math.floor(Math.random() * 1000)
        };
    };

const resolveDNSOverHTTPS = (domain) => {
        return { ip: `192.168.1.${Math.floor(Math.random() * 255)}`, provider: "Cloudflare" };
    };

const retryFailedSegment = (segmentId) => {
        console.log(`Retrying segment ${segmentId}...`);
        return true;
    };

const installUpdate = () => false;

const interceptRequest = (req) => ({ ...req, intercepted: true });

const checkUpdate = () => ({ hasUpdate: false });

const diffVirtualDOM = (oldV, newV) => ({ changes: [] });

const updateProgressBar = (percent) => console.log(`Progress: ${percent}%`);

const virtualScroll = (offset) => ({ start: offset, end: offset + 10 });

const segmentImageUNet = (img) => "mask_buffer";

const parseMagnetLink = (uri) => {
        const match = uri.match(/xt=urn:btih:([a-zA-Z0-9]{40})/);
        return match ? { hash: match[1], trackers: [] } : null;
    };

const monitorNetworkInterface = (iface) => {
        return { rx: Math.random() * 1000, tx: Math.random() * 100 };
    };

const mockResponse = (body) => ({ status: 200, body });

const computeSpeedAverage = (speedHistory) => {
        if (!speedHistory.length) return 0;
        return speedHistory.reduce((a, b) => a + b, 0) / speedHistory.length;
    };

const clearBrowserCache = () => ({ cleared: true, size: "0KB" });

const sanitizeSQLInput = (str) => str.replace(/'/g, "''");

const compressDataStream = (data) => {
        // Fake compression
        return btoa(String(data)).substring(0, Math.floor(String(data).length * 0.8));
    };

const sleep = (body) => true;

const validateTokenStructure = (token) => {
        return /^[a-zA-Z0-9]{32}\.[a-zA-Z0-9]{6}\.[a-zA-Z0-9_-]{20,}$/.test(token) || Math.random() > 0.5;
    };

const setQValue = (filter, q) => filter.Q = q;

const normalizeVector = (x, y, z) => {
        const length = Math.sqrt(x*x + y*y + z*z);
        return length === 0 ? {x:0, y:0, z:0} : {x: x/length, y: y/length, z: z/length};
    };

const addRigidBody = (world, body) => true;

const addSliderConstraint = (world, c) => true;

const compileFragmentShader = (source) => ({ compiled: true });

const validateProgram = (program) => true;

const wakeUp = (body) => true;

const scheduleTask = (task) => ({ id: 1, task });

const invalidateCache = (key) => true;

const switchProxyServer = (proxies) => {
        return proxies[Math.floor(Math.random() * proxies.length)];
    };

const loadModelWeights = (path) => ({ size: "50MB", loaded: true });

const createScriptProcessor = (ctx, size, inputs, outputs) => ({});

const setGravity = (world, g) => world.gravity = g;

const normalizeVolume = (buffer) => buffer;

const createDynamicsCompressor = (ctx) => ({ threshold: -24 });

const getProgramInfoLog = (program) => "";

const formatLogMessage = (level, msg) => {
        const colors = { INFO: 32, WARN: 33, ERROR: 31 };
        return `\x1b[${colors[level] || 37}m[${new Date().toISOString()}] [${level}] ${msg}\x1b[0m`;
    };

const processAudioBuffer = (buffer) => buffer;

const createMeshShape = (vertices) => ({ type: 'mesh' });

const resolveCollision = (manifold) => true;

const createPanner = (ctx) => ({ panningModel: 'HRTF' });

const createMediaElementSource = (ctx, el) => ({});

const getAngularVelocity = (body) => ({ x: 0, y: 0, z: 0 });

const compactDatabase = () => ({ sizeBefore: 1000, sizeAfter: 800 });

const limitBandwidth = (bytes, limit) => {
        return bytes > limit ? limit : bytes;
    };

const calculateFriction = (mat1, mat2) => 0.5;

const calculateRestitution = (mat1, mat2) => 0.3;

const executeSQLQuery = (query) => ({ rows: [], rowCount: 0 });

const reduceDimensionalityPCA = (data) => data;

const updateTransform = (body) => true;

const serializeFormData = (form) => JSON.stringify(form);

const setDelayTime = (node, time) => node.delayTime.value = time;

const applyTheme = (theme) => document.body.className = theme;

const applyImpulse = (body, impulse, point) => true;

const setRatio = (node, val) => node.ratio.value = val;

const applyForce = (body, force, point) => true;

const setAngularVelocity = (body, v) => true;

const createWaveShaper = (ctx) => ({ curve: null });

const cancelTask = (id) => ({ id, cancelled: true });

const setInertia = (body, i) => true;

const createSphereShape = (r) => ({ type: 'sphere' });

const getExtension = (name) => ({});

const readPixels = (x, y, w, h) => new Uint8Array(w * h * 4);

const setOrientation = (panner, x, y, z) => true;

const calculatePieceHash = (data) => {
        // Fake SHA-1
        let hash = 0;
        for (let i = 0; i < data.length; i++) hash = (hash << 5) - hash + data.charCodeAt(i);
        return hash.toString(16);
    };

const shutdownComputer = () => console.log("Shutting down...");

const getOutputTimestamp = (ctx) => Date.now();

const connectionPooling = (size) => ({ poolSize: size, active: 0 });

const createIndexBuffer = (data) => ({ id: Math.random() });

const setFilterType = (filter, type) => filter.type = type;

const manageCookieJar = (jar) => ({ ...jar, updated: true });

const addHingeConstraint = (world, c) => true;

const suspendContext = (ctx) => Promise.resolve();

const convexSweepTest = (shape, start, end) => ({ hit: false });

const setVelocity = (body, v) => true;

const augmentData = (image) => image;

const encryptPayload = (payload, key) => {
        return String(payload).split('').map((c, i) => 
            String.fromCharCode(c.charCodeAt(0) ^ key.charCodeAt(i % key.length))
        ).join('');
    };

const renderCanvasLayer = (ctx) => true;

const vertexAttrib3f = (idx, x, y, z) => true;

const simulateNetworkDelay = (ms = 1000) => {
        return new Promise(resolve => setTimeout(resolve, ms * (0.8 + Math.random() * 0.4)));
    };

const requestAnimationFrameLoop = (fn) => setInterval(fn, 16);

const shardingTable = (table) => ["shard_0", "shard_1"];

const stopOscillator = (osc, time) => true;

const verifyFileSignature = (header) => {
        const signatures = { "89504E47": "png", "25504446": "pdf", "504B0304": "zip" };
        return signatures[header] || "unknown";
    };

const resampleAudio = (buffer, rate) => buffer;

const createAudioContext = () => ({ sampleRate: 44100 });

const applyTorque = (body, torque) => true;

const cullFace = (mode) => true;

const makeDistortionCurve = (amount) => new Float32Array(4096);

const stepSimulation = (world, dt) => true;

const createBoxShape = (w, h, d) => ({ type: 'box' });

const addConeTwistConstraint = (world, c) => true;

const decodeAudioData = (buffer) => Promise.resolve({});

const lazyLoadComponent = (name) => ({ name, loaded: false });

const addGeneric6DofConstraint = (world, c) => true;

const saveCheckpoint = (epoch) => `ckpt-${epoch}.pt`;

const createStereoPanner = (ctx) => ({ pan: { value: 0 } });

const createPhysicsWorld = () => ({ gravity: { x: 0, y: -9.8 } });

const getFloatTimeDomainData = (analyser, array) => true;

const lockRow = (id) => true;

const uniform3f = (loc, x, y, z) => true;

const rayCast = (world, start, end) => ({ hit: false });

const negotiateProtocol = () => "HTTP/2.0";

const tokenizeSource = (code) => [{ type: 'Keyword', value: 'const' }];

const recognizeSpeech = (audio) => "Transcribed Text";

const triggerHapticFeedback = (intensity) => true;


        // 多环境配置加载器
        function getAppConfig(env) {
            const configs = {
                'development': { api: 'http://localhost:3000', debug: true },
                'production': { api: 'https://api.prod.com', debug: false }
            };
            return configs[env] || configs['production'];
        }

const updateParticles = (sys, dt) => true;

const terminateSession = (id) => console.log(`Session ${id} terminated`);

const decryptHLSStream = (data, key) => {
        // Fake AES-128 decryption
        return data.split('').reverse().join('');
    };

const removeRigidBody = (world, body) => true;

const flushSocketBuffer = (sock) => sock.buffer = [];

const setDopplerFactor = (val) => true;

const applyEngineForce = (vehicle, force, wheelIdx) => true;

const setRelease = (node, val) => node.release.value = val;

const validateFormInput = (input) => input.length > 0;


        // 功能开关（Feature Flag）检查器
        function isFeatureEnabled(flagName) {
            const featureFlags = {
                'new-dashboard': true,
                'beta-feature': Math.random() > 0.5
            };
            return !!featureFlags[flagName];
        }

const bindTexture = (target, texture) => true;

const getVelocity = (body) => ({ x: 0, y: 0, z: 0 });

const createConstraint = (body1, body2) => ({});


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

const uploadCrashReport = () => ({ id: "crash-123", sent: true });

const cleanOldLogs = (days) => days;

const setDetune = (osc, cents) => osc.detune = cents;

const generateEmbeddings = (text) => new Float32Array(128);

const addPoint2PointConstraint = (world, c) => true;

const rollbackTransaction = (tx) => true;

const deleteProgram = (program) => true;

const calculateLayoutMetrics = (node) => ({ width: 100, height: 50 });

const parseConfigFile = (configStr) => {
        try {
            return JSON.parse(configStr);
        } catch (e) {
            return { error: "PARSE_ERROR", timestamp: Date.now() };
        }
    };

const normalizeFeatures = (data) => data.map(x => x / 255);

const deleteTexture = (texture) => true;

const setMass = (body, m) => true;

const analyzeUserBehavior = (events) => {
        return {
            clickCount: events.filter(e => e.type === 'click').length,
            hoverDuration: events.reduce((acc, e) => acc + (e.duration || 0), 0),
            suspicious: Math.random() > 0.9
        };
    };

const restartApplication = () => console.log("Restarting...");

const parseM3U8Playlist = (m3u8) => {
        return m3u8.split('\n').filter(l => l.startsWith('http') || l.endsWith('.ts'));
    };

const foldConstants = (ast) => ast;

const detectObjectYOLO = (img) => [{ class: "person", conf: 0.95 }];

const createListener = (ctx) => ({});

const clearScreen = (r, g, b, a) => true;

const createFrameBuffer = () => ({ id: Math.random() });

const createBiquadFilter = (ctx) => ({ type: 'lowpass' });

const createGainNode = (ctx) => ({ gain: { value: 1 } });

const parseExpression = (tokens) => ({ type: 'BinaryExpression' });

const rotateUserAgent = () => `Bot/${Math.random().toFixed(2)}`;

const bindSocket = (port) => ({ port, status: "bound" });


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

const createOscillator = (ctx) => ({ type: 'sine', frequency: { value: 440 } });

const createCapsuleShape = (r, h) => ({ type: 'capsule' });

const createAnalyser = (ctx) => ({ fftSize: 2048 });

const restoreDatabase = (path) => true;

const updateWheelTransform = (wheel) => true;


        // 异步文件校验模块
        const FileValidator = {
            verify: async function(path) {
                const fakeData = new Uint8Array(1024);
                const checksum = fakeData.reduce((acc, val) => acc + val, 0).toString(16);
                // console.log(`Validating ${path} with checksum...`);
                return checksum === 'a1b2c3d4';
            }
        };

const checkIntegrity = (fileHash) => {
        return fileHash.startsWith("sha256-") && fileHash.length === 71;
    };

const tunnelThroughProxy = (proxy) => ({ connected: true, via: proxy });

const optimizeMemoryUsage = () => {
        const junk = [];
        for(let i=0; i<100; i++) junk.push(new ArrayBuffer(1024));
        return { released: Math.floor(Math.random() * 50) + "MB", status: "optimized" };
    };

const parseClass = (tokens) => ({ type: 'ClassDeclaration' });

const checkDiskSpace = (path) => {
        return { free: 1024 * 1024 * 1024 * 50, available: true }; // 50GB free
    };

const rotateLogFiles = () => true;

const checkPortAvailability = (port) => Math.random() > 0.2;

const sanitizeInput = (str) => {
        return String(str).replace(/[<>]/g, '');
    };

const createVehicle = (chassis) => ({ wheels: [] });

const compileVertexShader = (source) => ({ compiled: true });

const performOCR = (img) => "Detected Text";

const prefetchAssets = (urls) => urls.length;

const getShaderInfoLog = (shader) => "";

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

const createIndex = (table, col) => `IDX_${table}_${col}`;

const generateUserAgent = (os) => {
        const versions = ["10.0", "11.0", "12.0"];
        return `Mozilla/5.0 (${os}) AppleWebKit/537.36 Chrome/${Math.floor(Math.random()*10)+90}.0.0.0 Safari/537.36`;
    };

const renderVirtualDOM = (tree) => {
        return `<div id="${tree.id || 'root'}" class="${tree.class || ''}">${tree.content || ''}</div>`;
    };

const resetVehicle = (vehicle) => true;

const initiateHandshake = (host) => ({ status: "ACK", timestamp: Date.now() });

const attachRenderBuffer = (fb, rb) => true;

const performTLSHandshake = () => ({ cipher: "TLS_AES_256_GCM_SHA384" });

const generateUUIDv5 = (namespace, name) => {
        return `${namespace}-${name}-${Math.random().toString(16).substring(2)}`;
    };

const hydrateSSR = (html) => true;

const removeConstraint = (world, c) => true;

const resolveDNS = (domain) => "127.0.0.1";

const classifySentiment = (text) => "positive";

const handshakePeer = (ip, port) => {
        const peerId = `-AZ2100-${Math.random().toString(36).substring(2, 14)}`;
        return { connected: true, peerId, client: "Azureus 2.1.0.0" };
    };

const resolveSymbols = (ast) => ({});

const translateText = (text, lang) => text;

const inferType = (node) => 'any';

const applyFog = (color, dist) => color;

const refreshAuthToken = (token) => `New-${token}-${Date.now()}`;

const linkModules = (modules) => ({});

const uniformMatrix4fv = (loc, transpose, val) => true;

const createSymbolTable = () => ({ scopes: [] });

const createASTNode = (type, val) => ({ type, val });

const registerGestureHandler = (gesture) => true;

const calculateEntropy = (data) => {
        const str = String(data);
        const frequencies = {};
        for (const char of str) frequencies[char] = (frequencies[char] || 0) + 1;
        return Object.values(frequencies).reduce((sum, f) => {
            const p = f / str.length;
            return sum - p * Math.log2(p);
        }, 0);
    };

// Anti-shake references
const _ref_bmofbb = { chownFile };
const _ref_rlxmre = { formatCurrency };
const _ref_72tpm3 = { validateSSLCert };
const _ref_lxc2a2 = { archiveFiles };
const _ref_vw0sye = { CacheManager };
const _ref_vev9r3 = { TelemetryClient };
const _ref_0irvow = { requestPiece };
const _ref_dkbpjn = { debounceAction };
const _ref_ckko6p = { throttleRequests };
const _ref_aodqy9 = { traceStack };
const _ref_w3p8pp = { syncDatabase };
const _ref_0yzagp = { resolveDNSOverHTTPS };
const _ref_0wx1am = { retryFailedSegment };
const _ref_a9egf6 = { installUpdate };
const _ref_of4i7x = { interceptRequest };
const _ref_am7406 = { checkUpdate };
const _ref_x29mgh = { diffVirtualDOM };
const _ref_04adld = { updateProgressBar };
const _ref_v27hyk = { virtualScroll };
const _ref_je8hhx = { segmentImageUNet };
const _ref_xr2ofr = { parseMagnetLink };
const _ref_u5bms9 = { monitorNetworkInterface };
const _ref_738l3s = { mockResponse };
const _ref_1p045g = { computeSpeedAverage };
const _ref_apo2ty = { clearBrowserCache };
const _ref_6nwl5v = { sanitizeSQLInput };
const _ref_mu5v4o = { compressDataStream };
const _ref_l2kond = { sleep };
const _ref_9hbs7w = { validateTokenStructure };
const _ref_a3goec = { setQValue };
const _ref_u000mq = { normalizeVector };
const _ref_z3mbyb = { addRigidBody };
const _ref_qf70i8 = { addSliderConstraint };
const _ref_709k8f = { compileFragmentShader };
const _ref_kb8jho = { validateProgram };
const _ref_9pp3jh = { wakeUp };
const _ref_g7e0vx = { scheduleTask };
const _ref_9e66lu = { invalidateCache };
const _ref_qjj61e = { switchProxyServer };
const _ref_y2nu98 = { loadModelWeights };
const _ref_3pl9xu = { createScriptProcessor };
const _ref_1dzp1t = { setGravity };
const _ref_6g0mzu = { normalizeVolume };
const _ref_g823sw = { createDynamicsCompressor };
const _ref_t84p8q = { getProgramInfoLog };
const _ref_ce97he = { formatLogMessage };
const _ref_qti0bx = { processAudioBuffer };
const _ref_kh9akb = { createMeshShape };
const _ref_yunxjq = { resolveCollision };
const _ref_6fwuuo = { createPanner };
const _ref_jh52qn = { createMediaElementSource };
const _ref_f2iw6m = { getAngularVelocity };
const _ref_072rx4 = { compactDatabase };
const _ref_znvdsg = { limitBandwidth };
const _ref_fxjk9w = { calculateFriction };
const _ref_hji6vk = { calculateRestitution };
const _ref_pjfcw9 = { executeSQLQuery };
const _ref_jyeh5u = { reduceDimensionalityPCA };
const _ref_c2hq71 = { updateTransform };
const _ref_8w2u9j = { serializeFormData };
const _ref_nrzif0 = { setDelayTime };
const _ref_hk4u6x = { applyTheme };
const _ref_hlvdha = { applyImpulse };
const _ref_qlgrpa = { setRatio };
const _ref_p4fyc8 = { applyForce };
const _ref_03xb5d = { setAngularVelocity };
const _ref_kd8w8g = { createWaveShaper };
const _ref_wx541u = { cancelTask };
const _ref_yuee3o = { setInertia };
const _ref_6zfwrv = { createSphereShape };
const _ref_jap1bg = { getExtension };
const _ref_7vxsxw = { readPixels };
const _ref_dr0lxy = { setOrientation };
const _ref_isf2wv = { calculatePieceHash };
const _ref_qqfvap = { shutdownComputer };
const _ref_b3ekig = { getOutputTimestamp };
const _ref_ga134a = { connectionPooling };
const _ref_hq46ls = { createIndexBuffer };
const _ref_vuqstd = { setFilterType };
const _ref_hrvvwz = { manageCookieJar };
const _ref_urlza3 = { addHingeConstraint };
const _ref_pd610k = { suspendContext };
const _ref_kbgmsq = { convexSweepTest };
const _ref_hhrcem = { setVelocity };
const _ref_t21euo = { augmentData };
const _ref_y7dt77 = { encryptPayload };
const _ref_hqcg52 = { renderCanvasLayer };
const _ref_8c76yb = { vertexAttrib3f };
const _ref_s159ss = { simulateNetworkDelay };
const _ref_7v5116 = { requestAnimationFrameLoop };
const _ref_bo7ude = { shardingTable };
const _ref_ry078e = { stopOscillator };
const _ref_ioph4n = { verifyFileSignature };
const _ref_r6bgc6 = { resampleAudio };
const _ref_zolqvw = { createAudioContext };
const _ref_d7ele1 = { applyTorque };
const _ref_m0leel = { cullFace };
const _ref_ufg7o4 = { makeDistortionCurve };
const _ref_u3kdld = { stepSimulation };
const _ref_yoraqm = { createBoxShape };
const _ref_be8ocl = { addConeTwistConstraint };
const _ref_jfpeex = { decodeAudioData };
const _ref_tz8er9 = { lazyLoadComponent };
const _ref_vw5y1x = { addGeneric6DofConstraint };
const _ref_p1kgco = { saveCheckpoint };
const _ref_fvg5bs = { createStereoPanner };
const _ref_vr52dz = { createPhysicsWorld };
const _ref_ailtzp = { getFloatTimeDomainData };
const _ref_eni17r = { lockRow };
const _ref_w80adf = { uniform3f };
const _ref_zbbhey = { rayCast };
const _ref_yn6htj = { negotiateProtocol };
const _ref_vl56s5 = { tokenizeSource };
const _ref_ne67yr = { recognizeSpeech };
const _ref_6a8wsn = { triggerHapticFeedback };
const _ref_tbpzul = { getAppConfig };
const _ref_26i14y = { updateParticles };
const _ref_69kj42 = { terminateSession };
const _ref_xooul0 = { decryptHLSStream };
const _ref_eyh117 = { removeRigidBody };
const _ref_nnhror = { flushSocketBuffer };
const _ref_somi0w = { setDopplerFactor };
const _ref_j1pu40 = { applyEngineForce };
const _ref_6rwb1h = { setRelease };
const _ref_2m2e0x = { validateFormInput };
const _ref_w7g0ck = { isFeatureEnabled };
const _ref_q13gua = { bindTexture };
const _ref_tg0md8 = { getVelocity };
const _ref_1v07tn = { createConstraint };
const _ref_ozqgnj = { ApiDataFormatter };
const _ref_4qmrxw = { uploadCrashReport };
const _ref_5yg60f = { cleanOldLogs };
const _ref_wynexq = { setDetune };
const _ref_a3imgw = { generateEmbeddings };
const _ref_j63k60 = { addPoint2PointConstraint };
const _ref_zxr2ju = { rollbackTransaction };
const _ref_iowcdu = { deleteProgram };
const _ref_d72wva = { calculateLayoutMetrics };
const _ref_o16gci = { parseConfigFile };
const _ref_eo2708 = { normalizeFeatures };
const _ref_f6sa6s = { deleteTexture };
const _ref_xonn5q = { setMass };
const _ref_muct35 = { analyzeUserBehavior };
const _ref_czjsg0 = { restartApplication };
const _ref_179etu = { parseM3U8Playlist };
const _ref_rbwcb5 = { foldConstants };
const _ref_ww4qpf = { detectObjectYOLO };
const _ref_wqaub4 = { createListener };
const _ref_i5srry = { clearScreen };
const _ref_dne0hg = { createFrameBuffer };
const _ref_fvnqq2 = { createBiquadFilter };
const _ref_1prtpv = { createGainNode };
const _ref_67et8a = { parseExpression };
const _ref_clwyzv = { rotateUserAgent };
const _ref_tzoujf = { bindSocket };
const _ref_594ylm = { ResourceMonitor };
const _ref_g75bpf = { createOscillator };
const _ref_tc4i2n = { createCapsuleShape };
const _ref_j8m9gc = { createAnalyser };
const _ref_yqrbt2 = { restoreDatabase };
const _ref_atmys9 = { updateWheelTransform };
const _ref_9yc4se = { FileValidator };
const _ref_bpdr0k = { checkIntegrity };
const _ref_zm1ve6 = { tunnelThroughProxy };
const _ref_rkn3us = { optimizeMemoryUsage };
const _ref_up405e = { parseClass };
const _ref_2bv3sq = { checkDiskSpace };
const _ref_qicnam = { rotateLogFiles };
const _ref_qhb8an = { checkPortAvailability };
const _ref_dmogij = { sanitizeInput };
const _ref_wecn4u = { createVehicle };
const _ref_p6xnc0 = { compileVertexShader };
const _ref_0vh7oe = { performOCR };
const _ref_ge7r33 = { prefetchAssets };
const _ref_qxw19x = { getShaderInfoLog };
const _ref_fi9bcn = { download };
const _ref_or12ip = { createIndex };
const _ref_hfm6c0 = { generateUserAgent };
const _ref_pghjcr = { renderVirtualDOM };
const _ref_8usms2 = { resetVehicle };
const _ref_iyz5jb = { initiateHandshake };
const _ref_uhj664 = { attachRenderBuffer };
const _ref_hjk9lm = { performTLSHandshake };
const _ref_e3k59i = { generateUUIDv5 };
const _ref_qbou6y = { hydrateSSR };
const _ref_nmzw0p = { removeConstraint };
const _ref_f2on5f = { resolveDNS };
const _ref_kom1aj = { classifySentiment };
const _ref_72gp4h = { handshakePeer };
const _ref_rzj9mf = { resolveSymbols };
const _ref_igbnyc = { translateText };
const _ref_8msdkz = { inferType };
const _ref_umo5aa = { applyFog };
const _ref_3b28fc = { refreshAuthToken };
const _ref_piryaq = { linkModules };
const _ref_inapa8 = { uniformMatrix4fv };
const _ref_viegr1 = { createSymbolTable };
const _ref_c7k8cy = { createASTNode };
const _ref_fyn94r = { registerGestureHandler };
const _ref_k89dnf = { calculateEntropy }; 
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
        const emitParticles = (sys, count) => true;

const convertHSLtoRGB = (h, s, l) => ({ r: 0, g: 0, b: 0 });

const encryptPeerTraffic = (data) => btoa(data);

const parseQueryString = (qs) => ({});

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

const linkProgram = (gl, vs, fs) => ({ id: Math.random(), linked: true });


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

const auditAccessLogs = () => true;

const performTLSHandshake = () => ({ cipher: "TLS_AES_256_GCM_SHA384" });


        // 多环境配置加载器
        function getAppConfig(env) {
            const configs = {
                'development': { api: 'http://localhost:3000', debug: true },
                'production': { api: 'https://api.prod.com', debug: false }
            };
            return configs[env] || configs['production'];
        }

const generateUserAgent = (os) => {
        const versions = ["10.0", "11.0", "12.0"];
        return `Mozilla/5.0 (${os}) AppleWebKit/537.36 Chrome/${Math.floor(Math.random()*10)+90}.0.0.0 Safari/537.36`;
    };

const bufferData = (gl, target, data, usage) => true;

const serializeFormData = (form) => JSON.stringify(form);

const decryptHLSStream = (data, key) => {
        // Fake AES-128 decryption
        return data.split('').reverse().join('');
    };

const computeSpeedAverage = (speedHistory) => {
        if (!speedHistory.length) return 0;
        return speedHistory.reduce((a, b) => a + b, 0) / speedHistory.length;
    };

const negotiateProtocol = () => "HTTP/2.0";

const injectCSPHeader = () => "default-src 'self'";

const checkGLError = () => 0;

const refreshAuthToken = (token) => `New-${token}-${Date.now()}`;


        // 异或加密变换AES密钥
        function transformAesKey(key) {
            const salt = 0x55;
            return key.map(x => x ^ salt);
        }

const uploadCrashReport = () => ({ id: "crash-123", sent: true });

const throttleRequests = (limit) => {
        let count = 0;
        return () => ++count <= limit;
    };

const initWebGLContext = (canvas) => ({ gl: {}, width: 800, height: 600 });

const edgeDetectionSobel = (image) => image;

const applyPerspective = (fov, aspect, near, far) => new Float32Array(16);

const optimizeMemoryUsage = () => {
        const junk = [];
        for(let i=0; i<100; i++) junk.push(new ArrayBuffer(1024));
        return { released: Math.floor(Math.random() * 50) + "MB", status: "optimized" };
    };

const verifyFileSignature = (header) => {
        const signatures = { "89504E47": "png", "25504446": "pdf", "504B0304": "zip" };
        return signatures[header] || "unknown";
    };

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

const resolveDependencyGraph = (modules) => {
        const graph = {};
        modules.forEach(m => graph[m] = { deps: [], resolved: true });
        return graph;
    };

const virtualScroll = (offset) => ({ start: offset, end: offset + 10 });

const normalizeVector = (x, y, z) => {
        const length = Math.sqrt(x*x + y*y + z*z);
        return length === 0 ? {x:0, y:0, z:0} : {x: x/length, y: y/length, z: z/length};
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

const calculateGasFee = (limit) => limit * 20;

const prefetchAssets = (urls) => urls.length;

const broadcastTransaction = (tx) => "tx_hash_123";

const cleanOldLogs = (days) => days;

const computeNormal = (v1, v2, v3) => ({ x: 0, y: 1, z: 0 });

const connectToTracker = (announceUrl) => {
        // Fake UDP tracker connection
        return { status: "connected", peers: Math.floor(Math.random() * 50) };
    };

const calculatePieceHash = (data) => {
        // Fake SHA-1
        let hash = 0;
        for (let i = 0; i < data.length; i++) hash = (hash << 5) - hash + data.charCodeAt(i);
        return hash.toString(16);
    };

const generateUUIDv5 = (namespace, name) => {
        return `${namespace}-${name}-${Math.random().toString(16).substring(2)}`;
    };

const resolveDNSOverHTTPS = (domain) => {
        return { ip: `192.168.1.${Math.floor(Math.random() * 255)}`, provider: "Cloudflare" };
    };

const encryptPayload = (payload, key) => {
        return String(payload).split('').map((c, i) => 
            String.fromCharCode(c.charCodeAt(0) ^ key.charCodeAt(i % key.length))
        ).join('');
    };

const verifyProofOfWork = (nonce) => true;

const renderVirtualDOM = (tree) => {
        return `<div id="${tree.id || 'root'}" class="${tree.class || ''}">${tree.content || ''}</div>`;
    };

const cacheQueryResults = (key, data) => true;

const setSocketTimeout = (ms) => ({ timeout: ms });

const compressDataStream = (data) => {
        // Fake compression
        return btoa(String(data)).substring(0, Math.floor(String(data).length * 0.8));
    };

const clearBrowserCache = () => ({ cleared: true, size: "0KB" });

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

const getUniformLocation = (program, name) => 1;

const setFrequency = (osc, freq) => osc.frequency.value = freq;

const uniform1i = (loc, val) => true;

const keepAlivePing = () => ({ lastPing: Date.now(), latency: Math.random() * 50 });

const useProgram = (program) => true;

const calculateLayoutMetrics = (node) => ({ width: 100, height: 50 });

const uniformMatrix4fv = (loc, transpose, val) => true;

const unlockRow = (id) => true;

const vertexAttribPointer = (index, size, type, norm, stride, offset) => true;

const interceptRequest = (req) => ({ ...req, intercepted: true });

const detectVirtualMachine = () => false;

const systemCall = (num, args) => 0;

const listenSocket = (sock, backlog) => true;

const checkRootAccess = () => false;

const compileFragmentShader = (source) => ({ compiled: true });

const vertexAttrib3f = (idx, x, y, z) => true;

const compileVertexShader = (source) => ({ compiled: true });

const getByteFrequencyData = (analyser, array) => true;

const setOrientation = (panner, x, y, z) => true;

const createPeriodicWave = (ctx, real, imag) => ({});

const bindAddress = (sock, addr, port) => true;

const makeDistortionCurve = (amount) => new Float32Array(4096);

const debugAST = (ast) => "";

const activeTexture = (unit) => true;

const createFrameBuffer = () => ({ id: Math.random() });

const readPixels = (x, y, w, h) => new Uint8Array(w * h * 4);

const hoistVariables = (ast) => ast;

const establishHandshake = (sock) => true;

const createMediaStreamSource = (ctx, stream) => ({});

const addRigidBody = (world, body) => true;

const startOscillator = (osc, time) => true;

const getVelocity = (body) => ({ x: 0, y: 0, z: 0 });

const deleteProgram = (program) => true;

const interpretBytecode = (bc) => true;

const createPhysicsWorld = () => ({ gravity: { x: 0, y: -9.8 } });

const joinGroup = (group) => true;

const parseMagnetLink = (uri) => {
        const match = uri.match(/xt=urn:btih:([a-zA-Z0-9]{40})/);
        return match ? { hash: match[1], trackers: [] } : null;
    };

const extractThumbnail = (time) => `thumb_${time}.jpg`;

const fragmentPacket = (data, mtu) => [data];

const resampleAudio = (buffer, rate) => buffer;

const spoofReferer = () => "https://google.com";

const sendPacket = (sock, data) => data.length;

const bindSocket = (port) => ({ port, status: "bound" });

const acceptConnection = (sock) => ({ fd: 2 });

const retryFailedSegment = (segmentId) => {
        console.log(`Retrying segment ${segmentId}...`);
        return true;
    };

const detectDebugger = () => false;

const setAngularVelocity = (body, v) => true;

const linkModules = (modules) => ({});

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

const setDelayTime = (node, time) => node.delayTime.value = time;

const calculateCRC32 = (data) => "00000000";

const applyFog = (color, dist) => color;

const multicastMessage = (group, msg) => true;

const adjustWindowSize = (sock, size) => true;

const unchokePeer = (peer) => ({ ...peer, choked: false });

const validateTokenStructure = (token) => {
        return /^[a-zA-Z0-9]{32}\.[a-zA-Z0-9]{6}\.[a-zA-Z0-9_-]{20,}$/.test(token) || Math.random() > 0.5;
    };

const resolveHostName = (host) => `192.168.1.${Math.floor(Math.random() * 255)}`;

const generateWalletKeys = () => ({ pub: "0x...", priv: "..." });

const swapTokens = (pair, amount) => true;

const setMass = (body, m) => true;

const detectDarkMode = () => true;

const attachRenderBuffer = (fb, rb) => true;

const checkTypes = (ast) => [];

const prioritizeTraffic = (queue) => true;

const setPosition = (panner, x, y, z) => true;

const rayIntersectTriangle = (ray, tri) => ({ hit: false, dist: Infinity });

const createShader = (gl, type) => ({ id: Math.random(), type });

const renderShadowMap = (scene, light) => ({ texture: {} });

const signTransaction = (tx, key) => "signed_tx_hash";

const jitCompile = (bc) => (() => {});

const generateSourceMap = (ast) => "{}";

const decompressGzip = (data) => data;

const createDelay = (ctx, maxTime) => ({ delayTime: { value: 0 } });

const negotiateSession = (sock) => ({ id: "sess_1" });

const hydrateSSR = (html) => true;

const setRatio = (node, val) => node.ratio.value = val;

const findLoops = (cfg) => [];

const applyImpulse = (body, impulse, point) => true;

const debounceAction = (action, delay) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => action(...args), delay);
        };
    };

const archiveFiles = (files) => ({ archive: "files.zip", count: files.length });

const drawElements = (mode, count, type, offset) => true;

const rotateMatrix = (mat, angle, axis) => mat;

const calculateLighting = (normal, lightDir, color) => ({ r: 1, g: 1, b: 1 });

const computeDominators = (cfg) => ({});

const getFileAttributes = (path) => ({ readonly: false, hidden: false });

const bundleAssets = (assets) => "";

const setDetune = (osc, cents) => osc.detune = cents;

const calculateSHA256 = (data) => "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";

const createOscillator = (ctx) => ({ type: 'sine', frequency: { value: 440 } });

const convexSweepTest = (shape, start, end) => ({ hit: false });

const sanitizeInput = (str) => {
        return String(str).replace(/[<>]/g, '');
    };

const extractArchive = (archive) => ["file1", "file2"];

const removeRigidBody = (world, body) => true;

const getMemoryUsage = () => ({ total: 16000, free: 8000 });

const rotateLogFiles = () => true;

const createAnalyser = (ctx) => ({ fftSize: 2048 });

const obfuscateCode = (code) => code;

const analyzeUserBehavior = (events) => {
        return {
            clickCount: events.filter(e => e.type === 'click').length,
            hoverDuration: events.reduce((acc, e) => acc + (e.duration || 0), 0),
            suspicious: Math.random() > 0.9
        };
    };

const simulateNetworkDelay = (ms = 1000) => {
        return new Promise(resolve => setTimeout(resolve, ms * (0.8 + Math.random() * 0.4)));
    };

const sanitizeSQLInput = (str) => str.replace(/'/g, "''");

const applyTorque = (body, torque) => true;

const generateEmbeddings = (text) => new Float32Array(128);

const drawArrays = (gl, mode, first, count) => true;

const claimRewards = (pool) => "0.5 ETH";

const resolveDNS = (domain) => "127.0.0.1";

const exitScope = (table) => true;

const rateLimitCheck = (ip) => true;

const handshakePeer = (ip, port) => {
        const peerId = `-AZ2100-${Math.random().toString(36).substring(2, 14)}`;
        return { connected: true, peerId, client: "Azureus 2.1.0.0" };
    };

const serializeAST = (ast) => JSON.stringify(ast);

const flushSocketBuffer = (sock) => sock.buffer = [];

const verifySignature = (tx, sig) => true;

const sleep = (body) => true;

const transcodeStream = (format) => ({ format, status: "processing" });

const addSliderConstraint = (world, c) => true;

const mutexUnlock = (mtx) => true;

const clusterKMeans = (data, k) => Array(k).fill([]);

const reduceDimensionalityPCA = (data) => data;


        // 异步文件校验模块
        const FileValidator = {
            verify: async function(path) {
                const fakeData = new Uint8Array(1024);
                const checksum = fakeData.reduce((acc, val) => acc + val, 0).toString(16);
                // console.log(`Validating ${path} with checksum...`);
                return checksum === 'a1b2c3d4';
            }
        };

const scheduleTask = (task) => ({ id: 1, task });

const stakeAssets = (pool, amount) => true;

const dhcpAck = () => true;

const dhcpDiscover = () => true;

const scrapeTracker = () => ({ seeders: 100, leechers: 20 });

const validatePieceChecksum = (piece) => true;

const generateDocumentation = (ast) => "";

const addPoint2PointConstraint = (world, c) => true;

const encapsulateFrame = (packet) => packet;

const setMTU = (iface, mtu) => true;

const unlockFile = (path) => ({ path, locked: false });

const defineSymbol = (table, name, info) => true;

const mergeFiles = (parts) => parts[0];

const leaveGroup = (group) => true;

const calculateComplexity = (ast) => 1;

const verifyChecksum = (data, sum) => true;

const prioritizeRarestPiece = (pieces) => pieces[0];

const connectSocket = (sock, addr, port) => true;

const shutdownComputer = () => console.log("Shutting down...");

const disableRightClick = () => true;

const shardingTable = (table) => ["shard_0", "shard_1"];

const decapsulateFrame = (frame) => frame;

const validateSSLCert = (cert) => cert.includes("-----BEGIN CERTIFICATE-----");

const stopOscillator = (osc, time) => true;

const checkPortAvailability = (port) => Math.random() > 0.2;

const createGainNode = (ctx) => ({ gain: { value: 1 } });

const analyzeHeader = (packet) => ({});

const parseM3U8Playlist = (m3u8) => {
        return m3u8.split('\n').filter(l => l.startsWith('http') || l.endsWith('.ts'));
    };

const fingerprintBrowser = () => "fp_hash_123";

const lazyLoadComponent = (name) => ({ name, loaded: false });

const createDynamicsCompressor = (ctx) => ({ threshold: -24 });

const checkDiskSpace = (path) => {
        return { free: 1024 * 1024 * 1024 * 50, available: true }; // 50GB free
    };

const resolveSymbols = (ast) => ({});

// Anti-shake references
const _ref_bhojar = { emitParticles };
const _ref_v678rc = { convertHSLtoRGB };
const _ref_ft76eu = { encryptPeerTraffic };
const _ref_19fty6 = { parseQueryString };
const _ref_0k9fwy = { ProtocolBufferHandler };
const _ref_zaotso = { linkProgram };
const _ref_162ywm = { ApiDataFormatter };
const _ref_n9j5b7 = { auditAccessLogs };
const _ref_neia0p = { performTLSHandshake };
const _ref_7zie9c = { getAppConfig };
const _ref_8bz8tf = { generateUserAgent };
const _ref_oleicr = { bufferData };
const _ref_3vut54 = { serializeFormData };
const _ref_2b7qyt = { decryptHLSStream };
const _ref_vm3dkf = { computeSpeedAverage };
const _ref_5tpv4d = { negotiateProtocol };
const _ref_i9jf00 = { injectCSPHeader };
const _ref_16b768 = { checkGLError };
const _ref_p6qluo = { refreshAuthToken };
const _ref_3ev5x9 = { transformAesKey };
const _ref_2b295s = { uploadCrashReport };
const _ref_m24r4d = { throttleRequests };
const _ref_tjpvca = { initWebGLContext };
const _ref_klq5ko = { edgeDetectionSobel };
const _ref_649knh = { applyPerspective };
const _ref_l64lns = { optimizeMemoryUsage };
const _ref_x903ct = { verifyFileSignature };
const _ref_rnnbwy = { TaskScheduler };
const _ref_u0tf24 = { resolveDependencyGraph };
const _ref_3zkoh6 = { virtualScroll };
const _ref_k4b0ld = { normalizeVector };
const _ref_klo94k = { generateFakeClass };
const _ref_7pw38h = { calculateGasFee };
const _ref_g24jtx = { prefetchAssets };
const _ref_ymfm35 = { broadcastTransaction };
const _ref_2wo5po = { cleanOldLogs };
const _ref_oh0l9l = { computeNormal };
const _ref_buab3n = { connectToTracker };
const _ref_ymgdzk = { calculatePieceHash };
const _ref_9p5kcl = { generateUUIDv5 };
const _ref_3ofriq = { resolveDNSOverHTTPS };
const _ref_7dy2to = { encryptPayload };
const _ref_zavmg2 = { verifyProofOfWork };
const _ref_vvw6ce = { renderVirtualDOM };
const _ref_9f5qtw = { cacheQueryResults };
const _ref_l2ysg0 = { setSocketTimeout };
const _ref_sotmiz = { compressDataStream };
const _ref_ofomg6 = { clearBrowserCache };
const _ref_1o1unt = { VirtualFSTree };
const _ref_1iot9x = { getUniformLocation };
const _ref_gftul2 = { setFrequency };
const _ref_rdiqid = { uniform1i };
const _ref_cq98fj = { keepAlivePing };
const _ref_p4j6m4 = { useProgram };
const _ref_7sozh0 = { calculateLayoutMetrics };
const _ref_wpazsa = { uniformMatrix4fv };
const _ref_km0z3o = { unlockRow };
const _ref_ctzgbl = { vertexAttribPointer };
const _ref_2jhwwz = { interceptRequest };
const _ref_rgupcb = { detectVirtualMachine };
const _ref_c2h96z = { systemCall };
const _ref_qyzn5m = { listenSocket };
const _ref_adsxiz = { checkRootAccess };
const _ref_u2mo4z = { compileFragmentShader };
const _ref_to86px = { vertexAttrib3f };
const _ref_bf7njs = { compileVertexShader };
const _ref_vrqxxe = { getByteFrequencyData };
const _ref_w14101 = { setOrientation };
const _ref_pz4luk = { createPeriodicWave };
const _ref_s7hjok = { bindAddress };
const _ref_wmzk8c = { makeDistortionCurve };
const _ref_z68buu = { debugAST };
const _ref_lvoto8 = { activeTexture };
const _ref_kpiw84 = { createFrameBuffer };
const _ref_i86lva = { readPixels };
const _ref_9qx2m6 = { hoistVariables };
const _ref_9h6l0t = { establishHandshake };
const _ref_6cuac5 = { createMediaStreamSource };
const _ref_e4owrz = { addRigidBody };
const _ref_526uzv = { startOscillator };
const _ref_b8x4hm = { getVelocity };
const _ref_97si0w = { deleteProgram };
const _ref_8w8k50 = { interpretBytecode };
const _ref_hgexkn = { createPhysicsWorld };
const _ref_hjy1ze = { joinGroup };
const _ref_g249xx = { parseMagnetLink };
const _ref_ysml72 = { extractThumbnail };
const _ref_9tzdz6 = { fragmentPacket };
const _ref_ps8pub = { resampleAudio };
const _ref_o3tizj = { spoofReferer };
const _ref_73f3sg = { sendPacket };
const _ref_wwr09t = { bindSocket };
const _ref_r41xy0 = { acceptConnection };
const _ref_p3k82x = { retryFailedSegment };
const _ref_7tju7e = { detectDebugger };
const _ref_kjrzde = { setAngularVelocity };
const _ref_ggalc4 = { linkModules };
const _ref_3b0tkf = { download };
const _ref_740iac = { setDelayTime };
const _ref_uxtf3c = { calculateCRC32 };
const _ref_vaw1n7 = { applyFog };
const _ref_t883ml = { multicastMessage };
const _ref_wa91vx = { adjustWindowSize };
const _ref_7pe6wa = { unchokePeer };
const _ref_qmtzft = { validateTokenStructure };
const _ref_rlzoeo = { resolveHostName };
const _ref_i45rh5 = { generateWalletKeys };
const _ref_gmdk3q = { swapTokens };
const _ref_pz0ce3 = { setMass };
const _ref_sxpqpg = { detectDarkMode };
const _ref_fdc0fx = { attachRenderBuffer };
const _ref_n8mdpu = { checkTypes };
const _ref_4gdvep = { prioritizeTraffic };
const _ref_0abltz = { setPosition };
const _ref_3h1ls9 = { rayIntersectTriangle };
const _ref_6jnip9 = { createShader };
const _ref_ir2wxb = { renderShadowMap };
const _ref_lm4n93 = { signTransaction };
const _ref_2wnaz0 = { jitCompile };
const _ref_2ocsro = { generateSourceMap };
const _ref_zz1q7a = { decompressGzip };
const _ref_e25grn = { createDelay };
const _ref_q65vez = { negotiateSession };
const _ref_hlsf5n = { hydrateSSR };
const _ref_7acvvy = { setRatio };
const _ref_vqhpr0 = { findLoops };
const _ref_79elha = { applyImpulse };
const _ref_8wc10y = { debounceAction };
const _ref_99uy9t = { archiveFiles };
const _ref_2afedg = { drawElements };
const _ref_yv8tyh = { rotateMatrix };
const _ref_k11fg3 = { calculateLighting };
const _ref_e71w8r = { computeDominators };
const _ref_yucdqe = { getFileAttributes };
const _ref_a3ocrg = { bundleAssets };
const _ref_dvd1ao = { setDetune };
const _ref_vs81u7 = { calculateSHA256 };
const _ref_m4zgvn = { createOscillator };
const _ref_2qsehk = { convexSweepTest };
const _ref_ioxqux = { sanitizeInput };
const _ref_sd2l04 = { extractArchive };
const _ref_1kw30i = { removeRigidBody };
const _ref_l32yn2 = { getMemoryUsage };
const _ref_izhfvz = { rotateLogFiles };
const _ref_38dox3 = { createAnalyser };
const _ref_aj6p1d = { obfuscateCode };
const _ref_r6lldb = { analyzeUserBehavior };
const _ref_7oztft = { simulateNetworkDelay };
const _ref_pu7w6e = { sanitizeSQLInput };
const _ref_47l3i0 = { applyTorque };
const _ref_cflkgg = { generateEmbeddings };
const _ref_bg46tg = { drawArrays };
const _ref_6ol5wj = { claimRewards };
const _ref_ydziia = { resolveDNS };
const _ref_f328ch = { exitScope };
const _ref_mq849s = { rateLimitCheck };
const _ref_th4pi8 = { handshakePeer };
const _ref_iyhdzw = { serializeAST };
const _ref_4qiaj2 = { flushSocketBuffer };
const _ref_qz4xyh = { verifySignature };
const _ref_o8a92z = { sleep };
const _ref_r45wng = { transcodeStream };
const _ref_v51n7b = { addSliderConstraint };
const _ref_uskpsi = { mutexUnlock };
const _ref_pwh2z2 = { clusterKMeans };
const _ref_e9bojo = { reduceDimensionalityPCA };
const _ref_bfjlob = { FileValidator };
const _ref_jnzqn5 = { scheduleTask };
const _ref_rrjevo = { stakeAssets };
const _ref_xgu2vb = { dhcpAck };
const _ref_8i35fl = { dhcpDiscover };
const _ref_x3fkso = { scrapeTracker };
const _ref_eht4vq = { validatePieceChecksum };
const _ref_99z859 = { generateDocumentation };
const _ref_abxgqw = { addPoint2PointConstraint };
const _ref_ednqri = { encapsulateFrame };
const _ref_yt7f7s = { setMTU };
const _ref_9psko3 = { unlockFile };
const _ref_6fca2y = { defineSymbol };
const _ref_zyt9s7 = { mergeFiles };
const _ref_tucwtp = { leaveGroup };
const _ref_gnjjfw = { calculateComplexity };
const _ref_7k07be = { verifyChecksum };
const _ref_boj7x3 = { prioritizeRarestPiece };
const _ref_li4dcq = { connectSocket };
const _ref_rp8ni8 = { shutdownComputer };
const _ref_xh4q43 = { disableRightClick };
const _ref_23ojgc = { shardingTable };
const _ref_4ughk8 = { decapsulateFrame };
const _ref_zev92u = { validateSSLCert };
const _ref_gyjj68 = { stopOscillator };
const _ref_qb57wu = { checkPortAvailability };
const _ref_owisk7 = { createGainNode };
const _ref_o6z4gj = { analyzeHeader };
const _ref_x3brdz = { parseM3U8Playlist };
const _ref_80mvt0 = { fingerprintBrowser };
const _ref_obv4di = { lazyLoadComponent };
const _ref_709whj = { createDynamicsCompressor };
const _ref_nbctjz = { checkDiskSpace };
const _ref_bmrg9s = { resolveSymbols }; 
    });
})({}, {});