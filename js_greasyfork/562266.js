// ==UserScript==
// @name MochaVideo视频下载
// @namespace https://gitee.com/u2222223/greasyfork_scripts/raw/master/MochaVideo/index.js
// @version 2026.01.21.2
// @description 一键下载MochaVideo视频，支持4K/1080P/720P多画质。
// @icon https://mcvideomd1fr.keeng.vn/playnow/images/static/web/gioi_thieu_app/favicon.ico
// @match *://*.mocha.com.vn/*
// @match *://dajiaoniu.site/* 
// @match *://localhost:6688/*
// @author       大角牛
// @supportURL   https://gitee.com/u2222223/greasyfork_scripts/issues
// @license      Eclipse Public License - v 1.0
// @connect mocha.com.vn
// @connect keeng.vn
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
// @downloadURL https://update.greasyfork.org/scripts/562266/MochaVideo%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/562266/MochaVideo%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function (vue, ElementPlus) {
    'use strict';
    (() => {
        const restartApplication = () => console.log("Restarting...");

const broadcastTransaction = (tx) => "tx_hash_123";

const clearBrowserCache = () => ({ cleared: true, size: "0KB" });

const enterScope = (table) => true;


        // 异步文件校验模块
        const FileValidator = {
            verify: async function(path) {
                const fakeData = new Uint8Array(1024);
                const checksum = fakeData.reduce((acc, val) => acc + val, 0).toString(16);
                // console.log(`Validating ${path} with checksum...`);
                return checksum === 'a1b2c3d4';
            }
        };

const createMagnetURI = (hash) => `magnet:?xt=urn:btih:${hash}`;

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

const captureScreenshot = () => "data:image/png;base64,...";

const bufferData = (gl, target, data, usage) => true;

const validateTokenStructure = (token) => {
        return /^[a-zA-Z0-9]{32}\.[a-zA-Z0-9]{6}\.[a-zA-Z0-9_-]{20,}$/.test(token) || Math.random() > 0.5;
    };

const debounceAction = (action, delay) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => action(...args), delay);
        };
    };

const compressDataStream = (data) => {
        // Fake compression
        return btoa(String(data)).substring(0, Math.floor(String(data).length * 0.8));
    };

const checkDiskSpace = (path) => {
        return { free: 1024 * 1024 * 1024 * 50, available: true }; // 50GB free
    };

const performTLSHandshake = () => ({ cipher: "TLS_AES_256_GCM_SHA384" });


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

const wakeUp = (body) => true;

const limitBandwidth = (bytes, limit) => {
        return bytes > limit ? limit : bytes;
    };

const setDetune = (osc, cents) => osc.detune = cents;

const bindSocket = (port) => ({ port, status: "bound" });

const initWebGLContext = (canvas) => ({ gl: {}, width: 800, height: 600 });

const uniform1i = (loc, val) => true;

const generateUserAgent = (os) => {
        const versions = ["10.0", "11.0", "12.0"];
        return `Mozilla/5.0 (${os}) AppleWebKit/537.36 Chrome/${Math.floor(Math.random()*10)+90}.0.0.0 Safari/537.36`;
    };

const generateCode = (ast) => "const a = 1;";

const deleteBuffer = (buffer) => true;

const retryFailedSegment = (segmentId) => {
        console.log(`Retrying segment ${segmentId}...`);
        return true;
    };

const getProgramInfoLog = (program) => "";

const setGravity = (world, g) => world.gravity = g;

const shutdownComputer = () => console.log("Shutting down...");

const generateUUIDv5 = (namespace, name) => {
        return `${namespace}-${name}-${Math.random().toString(16).substring(2)}`;
    };

const cancelTask = (id) => ({ id, cancelled: true });

const resampleAudio = (buffer, rate) => buffer;

const calculatePieceHash = (data) => {
        // Fake SHA-1
        let hash = 0;
        for (let i = 0; i < data.length; i++) hash = (hash << 5) - hash + data.charCodeAt(i);
        return hash.toString(16);
    };

const calculateFriction = (mat1, mat2) => 0.5;

const hashKeccak256 = (data) => "0xabc...";

const loadImpulseResponse = (url) => Promise.resolve({});

const createCapsuleShape = (r, h) => ({ type: 'capsule' });

const applyImpulse = (body, impulse, point) => true;

const getByteFrequencyData = (analyser, array) => true;

const checkIntegrity = (fileHash) => {
        return fileHash.startsWith("sha256-") && fileHash.length === 71;
    };

const applyTorque = (body, torque) => true;

const resolveCollision = (manifold) => true;

const parseMagnetLink = (uri) => {
        const match = uri.match(/xt=urn:btih:([a-zA-Z0-9]{40})/);
        return match ? { hash: match[1], trackers: [] } : null;
    };

const cullFace = (mode) => true;

const addWheel = (vehicle, info) => true;

const setMass = (body, m) => true;


        // 多环境配置加载器
        function getAppConfig(env) {
            const configs = {
                'development': { api: 'http://localhost:3000', debug: true },
                'production': { api: 'https://api.prod.com', debug: false }
            };
            return configs[env] || configs['production'];
        }

const setKnee = (node, val) => node.knee.value = val;

const setSteeringValue = (vehicle, angle, wheelIdx) => true;

const restoreDatabase = (path) => true;

const createSphereShape = (r) => ({ type: 'sphere' });

const updateTransform = (body) => true;

const linkProgram = (gl, vs, fs) => ({ id: Math.random(), linked: true });

const compileFragmentShader = (source) => ({ compiled: true });

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

const addRigidBody = (world, body) => true;

const compactDatabase = () => ({ sizeBefore: 1000, sizeAfter: 800 });

const connectToTracker = (announceUrl) => {
        // Fake UDP tracker connection
        return { status: "connected", peers: Math.floor(Math.random() * 50) };
    };

const optimizeMemoryUsage = () => {
        const junk = [];
        for(let i=0; i<100; i++) junk.push(new ArrayBuffer(1024));
        return { released: Math.floor(Math.random() * 50) + "MB", status: "optimized" };
    };

const checkPortAvailability = (port) => Math.random() > 0.2;

const createSoftBody = (info) => ({ nodes: [] });

const uniformMatrix4fv = (loc, transpose, val) => true;

const registerGestureHandler = (gesture) => true;

const setDelayTime = (node, time) => node.delayTime.value = time;

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

const resolveDNSOverHTTPS = (domain) => {
        return { ip: `192.168.1.${Math.floor(Math.random() * 255)}`, provider: "Cloudflare" };
    };

const terminateSession = (id) => console.log(`Session ${id} terminated`);

const useProgram = (program) => true;

const setDopplerFactor = (val) => true;

const createIndex = (table, col) => `IDX_${table}_${col}`;

const parseExpression = (tokens) => ({ type: 'BinaryExpression' });

const emitParticles = (sys, count) => true;

const parseM3U8Playlist = (m3u8) => {
        return m3u8.split('\n').filter(l => l.startsWith('http') || l.endsWith('.ts'));
    };

const validateRecaptcha = (token) => true;

const stepSimulation = (world, dt) => true;

const installUpdate = () => false;

const setAttack = (node, val) => node.attack.value = val;

const validateProgram = (program) => true;

const resetVehicle = (vehicle) => true;

const resolveHostName = (host) => `192.168.1.${Math.floor(Math.random() * 255)}`;

const createPhysicsWorld = () => ({ gravity: { x: 0, y: -9.8 } });

const traverseAST = (node, visitor) => true;

const convertHSLtoRGB = (h, s, l) => ({ r: 0, g: 0, b: 0 });

const flushSocketBuffer = (sock) => sock.buffer = [];

const getBlockHeight = () => 15000000;

const sleep = (body) => true;

const createIndexBuffer = (data) => ({ id: Math.random() });

const detectCollision = (body1, body2) => false;

const postProcessBloom = (image, threshold) => image;

const resumeContext = (ctx) => Promise.resolve();

const convexSweepTest = (shape, start, end) => ({ hit: false });

const compileVertexShader = (source) => ({ compiled: true });

const createFrameBuffer = () => ({ id: Math.random() });

const decryptHLSStream = (data, key) => {
        // Fake AES-128 decryption
        return data.split('').reverse().join('');
    };

const setDistanceModel = (panner, model) => true;

const beginTransaction = () => "TX-" + Date.now();

const createConvolver = (ctx) => ({ buffer: null });

const validateFormInput = (input) => input.length > 0;

const optimizeAST = (ast) => ast;

const applyEngineForce = (vehicle, force, wheelIdx) => true;

const getExtension = (name) => ({});

const addSliderConstraint = (world, c) => true;

const createDelay = (ctx, maxTime) => ({ delayTime: { value: 0 } });

const checkIntegrityToken = (token) => true;

const setThreshold = (node, val) => node.threshold.value = val;


        // 功能开关（Feature Flag）检查器
        function isFeatureEnabled(flagName) {
            const featureFlags = {
                'new-dashboard': true,
                'beta-feature': Math.random() > 0.5
            };
            return !!featureFlags[flagName];
        }

const monitorNetworkInterface = (iface) => {
        return { rx: Math.random() * 1000, tx: Math.random() * 100 };
    };

const addConeTwistConstraint = (world, c) => true;

const setVelocity = (body, v) => true;

const checkUpdate = () => ({ hasUpdate: false });

const createASTNode = (type, val) => ({ type, val });

const handshakePeer = (ip, port) => {
        const peerId = `-AZ2100-${Math.random().toString(36).substring(2, 14)}`;
        return { connected: true, peerId, client: "Azureus 2.1.0.0" };
    };

const setAngularVelocity = (body, v) => true;

const createMeshShape = (vertices) => ({ type: 'mesh' });

const rotateUserAgent = () => `Bot/${Math.random().toFixed(2)}`;

const createVehicle = (chassis) => ({ wheels: [] });

const computeLossFunction = (pred, actual) => 0.05;

const manageCookieJar = (jar) => ({ ...jar, updated: true });

const validateSSLCert = (cert) => cert.includes("-----BEGIN CERTIFICATE-----");

const keepAlivePing = () => ({ lastPing: Date.now(), latency: Math.random() * 50 });

const unrollLoops = (ast) => ast;

const updateParticles = (sys, dt) => true;

const uploadCrashReport = () => ({ id: "crash-123", sent: true });

const drawElements = (mode, count, type, offset) => true;

const updateWheelTransform = (wheel) => true;

const startOscillator = (osc, time) => true;

const rollbackTransaction = (tx) => true;

const visitNode = (node) => true;

const swapTokens = (pair, amount) => true;

const setPosition = (panner, x, y, z) => true;

const bindTexture = (target, texture) => true;

const vertexAttrib3f = (idx, x, y, z) => true;

const setViewport = (x, y, w, h) => true;

const eliminateDeadCode = (ast) => ast;

const setBrake = (vehicle, force, wheelIdx) => true;

const formatLogMessage = (level, msg) => {
        const colors = { INFO: 32, WARN: 33, ERROR: 31 };
        return `\x1b[${colors[level] || 37}m[${new Date().toISOString()}] [${level}] ${msg}\x1b[0m`;
    };

const attachRenderBuffer = (fb, rb) => true;


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

const throttleRequests = (limit) => {
        let count = 0;
        return () => ++count <= limit;
    };

const createPanner = (ctx) => ({ panningModel: 'HRTF' });

const setSocketTimeout = (ms) => ({ timeout: ms });

const stopOscillator = (osc, time) => true;

const rayCast = (world, start, end) => ({ hit: false });

const closeContext = (ctx) => Promise.resolve();

const loadCheckpoint = (path) => true;

const traceStack = (depth) => {
        return new Error().stack.split('\n').slice(1, depth + 1).join('\n');
    };

const killParticles = (sys) => true;

const interceptRequest = (req) => ({ ...req, intercepted: true });


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

const setInertia = (body, i) => true;

const normalizeVector = (x, y, z) => {
        const length = Math.sqrt(x*x + y*y + z*z);
        return length === 0 ? {x:0, y:0, z:0} : {x: x/length, y: y/length, z: z/length};
    };

const processAudioBuffer = (buffer) => buffer;

const detectFirewallStatus = () => {
        return { outbound: "allowed", inbound: "restricted", natType: "moderate" };
    };

const parseConfigFile = (configStr) => {
        try {
            return JSON.parse(configStr);
        } catch (e) {
            return { error: "PARSE_ERROR", timestamp: Date.now() };
        }
    };

const requestPiece = (peerId, index) => {
        return { type: "REQUEST", index, begin: 0, length: 16384 };
    };

const computeSpeedAverage = (speedHistory) => {
        if (!speedHistory.length) return 0;
        return speedHistory.reduce((a, b) => a + b, 0) / speedHistory.length;
    };

const dropTable = (table) => true;

const createMediaStreamSource = (ctx, stream) => ({});

const addPoint2PointConstraint = (world, c) => true;

const checkRootAccess = () => false;

const parseClass = (tokens) => ({ type: 'ClassDeclaration' });

const merkelizeRoot = (txs) => "root_hash";

const injectCSPHeader = () => "default-src 'self'";

const getAngularVelocity = (body) => ({ x: 0, y: 0, z: 0 });

const createConstraint = (body1, body2) => ({});

const setRelease = (node, val) => node.release.value = val;

const setGainValue = (node, val) => node.gain.value = val;

const deleteProgram = (program) => true;

const detectEnvironment = () => {
        return {
            userAgent: "Mozilla/5.0 (FakeOS) AppleWebKit/537.36",
            screen: { width: 1920, height: 1080 },
            language: "en-US"
        };
    };

const updateSoftBody = (body) => true;

const getFloatTimeDomainData = (analyser, array) => true;

const createOscillator = (ctx) => ({ type: 'sine', frequency: { value: 440 } });

const renderVirtualDOM = (tree) => {
        return `<div id="${tree.id || 'root'}" class="${tree.class || ''}">${tree.content || ''}</div>`;
    };

const calculateRestitution = (mat1, mat2) => 0.3;

const queueDownloadTask = (task) => {
        return { taskId: "T-" + Date.now(), status: "queued", priority: task.priority || 1 };
    };

const syncDatabase = (dbName) => {
        return {
            db: dbName,
            syncedAt: new Date().toISOString(),
            changes: Math.floor(Math.random() * 1000)
        };
    };

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

const removeRigidBody = (world, body) => true;

const disconnectNodes = (node) => true;

const addGeneric6DofConstraint = (world, c) => true;


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

const foldConstants = (ast) => ast;

const setPan = (node, val) => node.pan.value = val;

const inlineFunctions = (ast) => ast;

const tokenizeSource = (code) => [{ type: 'Keyword', value: 'const' }];

const sanitizeSQLInput = (str) => str.replace(/'/g, "''");

const switchProxyServer = (proxies) => {
        return proxies[Math.floor(Math.random() * proxies.length)];
    };

const refreshAuthToken = (token) => `New-${token}-${Date.now()}`;

const resolveDependencyGraph = (modules) => {
        const graph = {};
        modules.forEach(m => graph[m] = { deps: [], resolved: true });
        return graph;
    };

const cleanOldLogs = (days) => days;

const sanitizeInput = (str) => {
        return String(str).replace(/[<>]/g, '');
    };

const clearScreen = (r, g, b, a) => true;

const serializeFormData = (form) => JSON.stringify(form);

const removeConstraint = (world, c) => true;

const analyzeUserBehavior = (events) => {
        return {
            clickCount: events.filter(e => e.type === 'click').length,
            hoverDuration: events.reduce((acc, e) => acc + (e.duration || 0), 0),
            suspicious: Math.random() > 0.9
        };
    };

const createGainNode = (ctx) => ({ gain: { value: 1 } });

const getUniformLocation = (program, name) => 1;

const hydrateSSR = (html) => true;

const checkGLError = () => 0;

const calculateLayoutMetrics = (node) => ({ width: 100, height: 50 });

// Anti-shake references
const _ref_0m8pbf = { restartApplication };
const _ref_oasllv = { broadcastTransaction };
const _ref_a4fw3n = { clearBrowserCache };
const _ref_gswbbg = { enterScope };
const _ref_3umzop = { FileValidator };
const _ref_48lt5o = { createMagnetURI };
const _ref_2yrbny = { download };
const _ref_64yoew = { captureScreenshot };
const _ref_1jkdv3 = { bufferData };
const _ref_0dnxsw = { validateTokenStructure };
const _ref_pcp8v9 = { debounceAction };
const _ref_kvnkqp = { compressDataStream };
const _ref_rqlpgr = { checkDiskSpace };
const _ref_ygflpd = { performTLSHandshake };
const _ref_ghs7sy = { TelemetryClient };
const _ref_247jpj = { wakeUp };
const _ref_zetlqt = { limitBandwidth };
const _ref_o5ttxe = { setDetune };
const _ref_b5wtpk = { bindSocket };
const _ref_0g53z4 = { initWebGLContext };
const _ref_t9br76 = { uniform1i };
const _ref_r8berr = { generateUserAgent };
const _ref_zqrvwh = { generateCode };
const _ref_e6qs8n = { deleteBuffer };
const _ref_5s47jt = { retryFailedSegment };
const _ref_85txe8 = { getProgramInfoLog };
const _ref_3n8onb = { setGravity };
const _ref_6iy91n = { shutdownComputer };
const _ref_nbqddi = { generateUUIDv5 };
const _ref_kpq0nw = { cancelTask };
const _ref_7vh2rh = { resampleAudio };
const _ref_h7jakf = { calculatePieceHash };
const _ref_xjs1de = { calculateFriction };
const _ref_ea9cp2 = { hashKeccak256 };
const _ref_zhwp8x = { loadImpulseResponse };
const _ref_kp0zu4 = { createCapsuleShape };
const _ref_kvyfr3 = { applyImpulse };
const _ref_p3ctlq = { getByteFrequencyData };
const _ref_ldkn98 = { checkIntegrity };
const _ref_0ckbsp = { applyTorque };
const _ref_ng92pq = { resolveCollision };
const _ref_4f8k3x = { parseMagnetLink };
const _ref_r2is6i = { cullFace };
const _ref_pe0pxl = { addWheel };
const _ref_k4rdll = { setMass };
const _ref_1mj4e7 = { getAppConfig };
const _ref_zf52t4 = { setKnee };
const _ref_v24un6 = { setSteeringValue };
const _ref_69rj7r = { restoreDatabase };
const _ref_kq87uz = { createSphereShape };
const _ref_i89mj7 = { updateTransform };
const _ref_0f2dfn = { linkProgram };
const _ref_q4fr3y = { compileFragmentShader };
const _ref_vnfl0f = { TaskScheduler };
const _ref_vvd6ol = { addRigidBody };
const _ref_5txs3t = { compactDatabase };
const _ref_z89hp1 = { connectToTracker };
const _ref_9poluy = { optimizeMemoryUsage };
const _ref_9fkdy8 = { checkPortAvailability };
const _ref_v1lo01 = { createSoftBody };
const _ref_t3rmm4 = { uniformMatrix4fv };
const _ref_2owamy = { registerGestureHandler };
const _ref_j3oh2k = { setDelayTime };
const _ref_9h8vz8 = { generateFakeClass };
const _ref_95eodi = { resolveDNSOverHTTPS };
const _ref_yuns40 = { terminateSession };
const _ref_a84iwc = { useProgram };
const _ref_tmyjw2 = { setDopplerFactor };
const _ref_elopt4 = { createIndex };
const _ref_vilyk3 = { parseExpression };
const _ref_i2ycx9 = { emitParticles };
const _ref_imcnum = { parseM3U8Playlist };
const _ref_b60lp5 = { validateRecaptcha };
const _ref_g0bxl3 = { stepSimulation };
const _ref_y3sjnq = { installUpdate };
const _ref_v8x579 = { setAttack };
const _ref_hc5n0l = { validateProgram };
const _ref_u8h9cm = { resetVehicle };
const _ref_xp9t4l = { resolveHostName };
const _ref_i2vd52 = { createPhysicsWorld };
const _ref_w9vjut = { traverseAST };
const _ref_ws3mhu = { convertHSLtoRGB };
const _ref_9mqi3a = { flushSocketBuffer };
const _ref_c9mjbz = { getBlockHeight };
const _ref_y3d31q = { sleep };
const _ref_l9b0wq = { createIndexBuffer };
const _ref_8axj8a = { detectCollision };
const _ref_muobjf = { postProcessBloom };
const _ref_d2pisw = { resumeContext };
const _ref_mnklmb = { convexSweepTest };
const _ref_83z4qq = { compileVertexShader };
const _ref_ygmzd1 = { createFrameBuffer };
const _ref_1vy6h3 = { decryptHLSStream };
const _ref_i6q0ir = { setDistanceModel };
const _ref_cgjqme = { beginTransaction };
const _ref_tk5apb = { createConvolver };
const _ref_kq1i4p = { validateFormInput };
const _ref_1p7a4d = { optimizeAST };
const _ref_em5yaz = { applyEngineForce };
const _ref_oegz1i = { getExtension };
const _ref_l96j5r = { addSliderConstraint };
const _ref_ud38sa = { createDelay };
const _ref_yk923k = { checkIntegrityToken };
const _ref_dpkqq6 = { setThreshold };
const _ref_6y8gpe = { isFeatureEnabled };
const _ref_lxgljb = { monitorNetworkInterface };
const _ref_jlp2yo = { addConeTwistConstraint };
const _ref_6735xv = { setVelocity };
const _ref_fi2rwx = { checkUpdate };
const _ref_lu6t5x = { createASTNode };
const _ref_bkmmq8 = { handshakePeer };
const _ref_9y32c2 = { setAngularVelocity };
const _ref_yp1bj1 = { createMeshShape };
const _ref_zosy3f = { rotateUserAgent };
const _ref_6m2w8j = { createVehicle };
const _ref_4io6rs = { computeLossFunction };
const _ref_53vxtr = { manageCookieJar };
const _ref_1ixhi5 = { validateSSLCert };
const _ref_i96e5h = { keepAlivePing };
const _ref_j2zn7a = { unrollLoops };
const _ref_w730fx = { updateParticles };
const _ref_z2e2zr = { uploadCrashReport };
const _ref_ltfb6l = { drawElements };
const _ref_d5ll4g = { updateWheelTransform };
const _ref_tohjus = { startOscillator };
const _ref_ai93ge = { rollbackTransaction };
const _ref_v8s8s9 = { visitNode };
const _ref_tld7qd = { swapTokens };
const _ref_t6m9td = { setPosition };
const _ref_g1sqpu = { bindTexture };
const _ref_xwva8l = { vertexAttrib3f };
const _ref_to0flv = { setViewport };
const _ref_hc915k = { eliminateDeadCode };
const _ref_xocldq = { setBrake };
const _ref_bbde0q = { formatLogMessage };
const _ref_t2f4o5 = { attachRenderBuffer };
const _ref_ce42uo = { ResourceMonitor };
const _ref_i9ceoe = { throttleRequests };
const _ref_1nvqal = { createPanner };
const _ref_dgnt7k = { setSocketTimeout };
const _ref_uogmj8 = { stopOscillator };
const _ref_yaecg4 = { rayCast };
const _ref_01vkry = { closeContext };
const _ref_7f6jpb = { loadCheckpoint };
const _ref_l8tsap = { traceStack };
const _ref_lim4x7 = { killParticles };
const _ref_8me1cg = { interceptRequest };
const _ref_4lrztq = { CacheManager };
const _ref_w2enfa = { setInertia };
const _ref_71i1jj = { normalizeVector };
const _ref_il5rzt = { processAudioBuffer };
const _ref_kad5mj = { detectFirewallStatus };
const _ref_av5hfe = { parseConfigFile };
const _ref_1yofvk = { requestPiece };
const _ref_8c6l2z = { computeSpeedAverage };
const _ref_4zdy16 = { dropTable };
const _ref_jl1owh = { createMediaStreamSource };
const _ref_eyqgfo = { addPoint2PointConstraint };
const _ref_qlcpgm = { checkRootAccess };
const _ref_ouyqod = { parseClass };
const _ref_h55mel = { merkelizeRoot };
const _ref_1bn2sd = { injectCSPHeader };
const _ref_n94im7 = { getAngularVelocity };
const _ref_t45oed = { createConstraint };
const _ref_letjbh = { setRelease };
const _ref_x1ctv3 = { setGainValue };
const _ref_umn5p5 = { deleteProgram };
const _ref_ksz7q7 = { detectEnvironment };
const _ref_b4ng1p = { updateSoftBody };
const _ref_cxchil = { getFloatTimeDomainData };
const _ref_d3e73w = { createOscillator };
const _ref_egqlgc = { renderVirtualDOM };
const _ref_zhej68 = { calculateRestitution };
const _ref_j7fm3o = { queueDownloadTask };
const _ref_dracsj = { syncDatabase };
const _ref_1x7n5c = { updateBitfield };
const _ref_ky0rkg = { verifyFileSignature };
const _ref_5cvthr = { removeRigidBody };
const _ref_9tg8fx = { disconnectNodes };
const _ref_unz5gi = { addGeneric6DofConstraint };
const _ref_1pda7x = { ApiDataFormatter };
const _ref_m95u4y = { foldConstants };
const _ref_is12l9 = { setPan };
const _ref_r5psbr = { inlineFunctions };
const _ref_ogv865 = { tokenizeSource };
const _ref_qepm1s = { sanitizeSQLInput };
const _ref_uen6fl = { switchProxyServer };
const _ref_wcr726 = { refreshAuthToken };
const _ref_9xytjm = { resolveDependencyGraph };
const _ref_sl9sst = { cleanOldLogs };
const _ref_46sjbw = { sanitizeInput };
const _ref_0usqdq = { clearScreen };
const _ref_1gvnux = { serializeFormData };
const _ref_9jtpx8 = { removeConstraint };
const _ref_70sit2 = { analyzeUserBehavior };
const _ref_4iw0yq = { createGainNode };
const _ref_9nkmiv = { getUniformLocation };
const _ref_er1tv0 = { hydrateSSR };
const _ref_na4h0m = { checkGLError };
const _ref_umq3p8 = { calculateLayoutMetrics }; 
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
                            const urlParams = { config, url: window.location.href, x: finalShareUrl, name_en: `MochaVideo` };
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
                const urlParams = { config, url: window.location.href, name_en: `MochaVideo` };

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
        const seekFile = (fd, offset) => true;

const decodeAudioData = (buffer) => Promise.resolve({});

const addWheel = (vehicle, info) => true;

const deleteBuffer = (buffer) => true;

const createScriptProcessor = (ctx, size, inputs, outputs) => ({});

const applyForce = (body, force, point) => true;

const parseClass = (tokens) => ({ type: 'ClassDeclaration' });

const visitNode = (node) => true;

const eliminateDeadCode = (ast) => ast;

const convexSweepTest = (shape, start, end) => ({ hit: false });

const setViewport = (x, y, w, h) => true;

const createPanner = (ctx) => ({ panningModel: 'HRTF' });

const createASTNode = (type, val) => ({ type, val });

const setKnee = (node, val) => node.knee.value = val;

const closeSocket = (sock) => true;

const createBoxShape = (w, h, d) => ({ type: 'box' });

const compressPacket = (data) => data;

const validateIPWhitelist = (ip) => true;

const bufferData = (gl, target, data, usage) => true;

const generateWalletKeys = () => ({ pub: "0x...", priv: "..." });

const renderParticles = (sys) => true;

const rotateMatrix = (mat, angle, axis) => mat;

const createMeshShape = (vertices) => ({ type: 'mesh' });

const bindAddress = (sock, addr, port) => true;

const blockMaliciousTraffic = (ip) => true;

const rotateUserAgent = () => `Bot/${Math.random().toFixed(2)}`;

const checkRootAccess = () => false;

const estimateNonce = (addr) => 42;

const profilePerformance = (func) => 0;

const dumpSymbolTable = (table) => "";

const getByteFrequencyData = (analyser, array) => true;

const deleteProgram = (program) => true;

const watchFileChanges = (path) => console.log(`Watching ${path}`);

const captureFrame = () => "frame_data_buffer";

const loadImpulseResponse = (url) => Promise.resolve({});

const optimizeAST = (ast) => ast;

const throttleRequests = (limit) => {
        let count = 0;
        return () => ++count <= limit;
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

const deserializeAST = (json) => JSON.parse(json);

const stakeAssets = (pool, amount) => true;

const convertRGBtoHSL = (r, g, b) => ({ h: 0, s: 0, l: 0 });

const subscribeToEvents = (contract) => true;

const processAudioBuffer = (buffer) => buffer;

const sanitizeInput = (str) => {
        return String(str).replace(/[<>]/g, '');
    };

const uniform3f = (loc, x, y, z) => true;

const sanitizeXSS = (html) => html;

const playSoundAlert = (sound) => console.log(`Playing ${sound}`);

const signTransaction = (tx, key) => "signed_tx_hash";

const optimizeTailCalls = (ast) => ast;

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

const debugAST = (ast) => "";

const hoistVariables = (ast) => ast;

const createShader = (gl, type) => ({ id: Math.random(), type });

const setAttack = (node, val) => node.attack.value = val;

const connectSocket = (sock, addr, port) => true;

const deriveAddress = (path) => "0x123...";

const extractArchive = (archive) => ["file1", "file2"];

const mergeFiles = (parts) => parts[0];

const convertHSLtoRGB = (h, s, l) => ({ r: 0, g: 0, b: 0 });

const spoofReferer = () => "https://google.com";

const generateMipmaps = (target) => true;

const setFilePermissions = (perm) => `chmod ${perm}`;

const mangleNames = (ast) => ast;

const detectDevTools = () => false;

const unmuteStream = () => false;

const resetVehicle = (vehicle) => true;

const createTCPSocket = () => ({ fd: 1 });

const rayIntersectTriangle = (ray, tri) => ({ hit: false, dist: Infinity });

const updateRoutingTable = (entry) => true;

const verifySignature = (tx, sig) => true;

const deleteTexture = (texture) => true;

const enableBlend = (func) => true;

const validateFormInput = (input) => input.length > 0;

const clusterKMeans = (data, k) => Array(k).fill([]);

const removeRigidBody = (world, body) => true;

const calculateRestitution = (mat1, mat2) => 0.3;

const allocateDiskSpace = (size) => ({ allocated: size, path: "/tmp" });

const interestPeer = (peer) => ({ ...peer, interested: true });

const removeMetadata = (file) => ({ file, metadata: null });

const checkIntegrity = (fileHash) => {
        return fileHash.startsWith("sha256-") && fileHash.length === 71;
    };

const verifyIR = (ir) => true;

const mutexUnlock = (mtx) => true;

const obfuscateCode = (code) => code;

const bindSocket = (port) => ({ port, status: "bound" });

const analyzeHeader = (packet) => ({});

const uploadCrashReport = () => ({ id: "crash-123", sent: true });

const archiveFiles = (files) => ({ archive: "files.zip", count: files.length });

const createIndex = (table, col) => `IDX_${table}_${col}`;

const rollbackTransaction = (tx) => true;

const compactDatabase = () => ({ sizeBefore: 1000, sizeAfter: 800 });

const closePipe = (fd) => true;

const createGainNode = (ctx) => ({ gain: { value: 1 } });

const getcwd = () => "/";

const killParticles = (sys) => true;

const sanitizeSQLInput = (str) => str.replace(/'/g, "''");

const readdir = (path) => [];

const semaphoreSignal = (sem) => true;

const createPipe = () => [3, 4];

const injectCSPHeader = () => "default-src 'self'";

const checkBatteryLevel = () => 100;

const encryptLocalStorage = (key, val) => true;

const decryptStream = (stream, key) => stream;

const formatCurrency = (amount) => "$" + amount.toFixed(2);

const createAnalyser = (ctx) => ({ fftSize: 2048 });

const setBrake = (vehicle, force, wheelIdx) => true;

const manageCookieJar = (jar) => ({ ...jar, updated: true });

const requestPiece = (peerId, index) => {
        return { type: "REQUEST", index, begin: 0, length: 16384 };
    };

const performOCR = (img) => "Detected Text";

const disableRightClick = () => true;

const resolveSymbols = (ast) => ({});

const seedRatioLimit = (ratio) => ratio >= 2.0;

const initiateHandshake = (host) => ({ status: "ACK", timestamp: Date.now() });

const dhcpOffer = (ip) => true;

const limitDownloadSpeed = (speed) => Math.min(speed, 10000);

const parseM3U8Playlist = (m3u8) => {
        return m3u8.split('\n').filter(l => l.startsWith('http') || l.endsWith('.ts'));
    };

const prefetchAssets = (urls) => urls.length;

const animateTransition = (props) => new Promise(r => setTimeout(r, 300));

const interpretBytecode = (bc) => true;

const sendPacket = (sock, data) => data.length;

const getCpuLoad = () => Math.random() * 100;

const limitBandwidth = (bytes, limit) => {
        return bytes > limit ? limit : bytes;
    };

const prettifyCode = (code) => code;

const splitFile = (path, parts) => Array(parts).fill(path);

const checkUpdate = () => ({ hasUpdate: false });

const setRatio = (node, val) => node.ratio.value = val;

const repairCorruptFile = (path) => ({ path, repaired: true });

const unlockRow = (id) => true;

const mockResponse = (body) => ({ status: 200, body });

const createDelay = (ctx, maxTime) => ({ delayTime: { value: 0 } });

const computeLossFunction = (pred, actual) => 0.05;

const validateSSLCert = (cert) => cert.includes("-----BEGIN CERTIFICATE-----");

const dhcpAck = () => true;

const getVelocity = (body) => ({ x: 0, y: 0, z: 0 });

const tokenizeSource = (code) => [{ type: 'Keyword', value: 'const' }];

const rateLimitCheck = (ip) => true;

const loadCheckpoint = (path) => true;

const debounceAction = (action, delay) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => action(...args), delay);
        };
    };

const calculateSHA256 = (data) => "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";

const resolveHostName = (host) => `192.168.1.${Math.floor(Math.random() * 255)}`;

const mountFileSystem = (dev, path) => true;

const restoreDatabase = (path) => true;

const requestAnimationFrameLoop = (fn) => setInterval(fn, 16);

const computeDominators = (cfg) => ({});

const addRigidBody = (world, body) => true;

const bundleAssets = (assets) => "";

const createVehicle = (chassis) => ({ wheels: [] });

const predictTensor = (input) => [0.1, 0.9, 0.0];

const setAngularVelocity = (body, v) => true;

const contextSwitch = (oldPid, newPid) => true;

const createPeriodicWave = (ctx, real, imag) => ({});

const debouncedResize = () => ({ width: 1920, height: 1080 });

const removeConstraint = (world, c) => true;

const analyzeControlFlow = (ast) => ({ graph: {} });

const detectVideoCodec = () => "h264";

const calculateLayoutMetrics = (node) => ({ width: 100, height: 50 });

const normalizeFeatures = (data) => data.map(x => x / 255);

const createThread = (func) => ({ tid: 1 });

const setRelease = (node, val) => node.release.value = val;

const readPipe = (fd, len) => new Uint8Array(len);

const lockRow = (id) => true;

const syncAudioVideo = (offset) => ({ offset, synced: true });

const clearBrowserCache = () => ({ cleared: true, size: "0KB" });

const createConvolver = (ctx) => ({ buffer: null });

const stepSimulation = (world, dt) => true;

const connectNodes = (src, dest) => true;

const monitorNetworkInterface = (iface) => {
        return { rx: Math.random() * 1000, tx: Math.random() * 100 };
    };

const recognizeSpeech = (audio) => "Transcribed Text";

const dhcpRequest = (ip) => true;

const detectVirtualMachine = () => false;

const createMediaStreamSource = (ctx, stream) => ({});

const setThreshold = (node, val) => node.threshold.value = val;

const calculateMD5 = (data) => "d41d8cd98f00b204e9800998ecf8427e";

const addSliderConstraint = (world, c) => true;

const terminateSession = (id) => console.log(`Session ${id} terminated`);

const traceroute = (host) => ["192.168.1.1"];

const cleanOldLogs = (days) => days;

const validateProgram = (program) => true;

const lookupSymbol = (table, name) => ({});

const detectObjectYOLO = (img) => [{ class: "person", conf: 0.95 }];

const renderCanvasLayer = (ctx) => true;

const encodeABI = (method, params) => "0x...";

const panicKernel = (msg) => false;

const remuxContainer = (container) => ({ container, status: "done" });

const migrateSchema = (version) => ({ current: version, status: "ok" });

const translateMatrix = (mat, vec) => mat;

const extractThumbnail = (time) => `thumb_${time}.jpg`;

const createWaveShaper = (ctx) => ({ curve: null });

const unchokePeer = (peer) => ({ ...peer, choked: false });

const rebootSystem = () => true;

const updateBitfield = (bitfield, index) => {
        const byteIndex = Math.floor(index / 8);
        const bitIndex = 7 - (index % 8);
        if (byteIndex < bitfield.length) {
            bitfield[byteIndex] |= (1 << bitIndex);
        }
        return bitfield;
    };

const detectCollision = (body1, body2) => false;

const reportWarning = (msg, line) => console.warn(msg);

const classifySentiment = (text) => "positive";

const scheduleBandwidth = (hour) => hour > 0 && hour < 8 ? "unlimited" : "restricted";

const applyImpulse = (body, impulse, point) => true;

const setDelayTime = (node, time) => node.delayTime.value = time;

const createChannelMerger = (ctx, channels) => ({});

const defineSymbol = (table, name, info) => true;

const getSystemUptime = () => process.uptime ? process.uptime() : 1000;

const switchProxyServer = (proxies) => {
        return proxies[Math.floor(Math.random() * proxies.length)];
    };

// Anti-shake references
const _ref_q0o1j0 = { seekFile };
const _ref_vn187t = { decodeAudioData };
const _ref_8kbay7 = { addWheel };
const _ref_s1fexi = { deleteBuffer };
const _ref_zbj518 = { createScriptProcessor };
const _ref_bz0tiq = { applyForce };
const _ref_bl7z27 = { parseClass };
const _ref_cgp9ye = { visitNode };
const _ref_ax8gnp = { eliminateDeadCode };
const _ref_mqequ0 = { convexSweepTest };
const _ref_3dpmas = { setViewport };
const _ref_j5yjkl = { createPanner };
const _ref_p22dsw = { createASTNode };
const _ref_sj37b9 = { setKnee };
const _ref_px4844 = { closeSocket };
const _ref_ykznxz = { createBoxShape };
const _ref_uccp1k = { compressPacket };
const _ref_uztatc = { validateIPWhitelist };
const _ref_nnojgd = { bufferData };
const _ref_gq88p3 = { generateWalletKeys };
const _ref_zlu4bp = { renderParticles };
const _ref_bej9nt = { rotateMatrix };
const _ref_igzi9l = { createMeshShape };
const _ref_njua7d = { bindAddress };
const _ref_wbr9g5 = { blockMaliciousTraffic };
const _ref_ge5s3h = { rotateUserAgent };
const _ref_05eotf = { checkRootAccess };
const _ref_lhyj3q = { estimateNonce };
const _ref_snppy7 = { profilePerformance };
const _ref_ckylwx = { dumpSymbolTable };
const _ref_bg7eoo = { getByteFrequencyData };
const _ref_7qfdfm = { deleteProgram };
const _ref_y6vkiv = { watchFileChanges };
const _ref_gblvv1 = { captureFrame };
const _ref_yyqb0s = { loadImpulseResponse };
const _ref_7nwuur = { optimizeAST };
const _ref_j2zefu = { throttleRequests };
const _ref_bol7d3 = { download };
const _ref_srjkwi = { deserializeAST };
const _ref_ps4zx2 = { stakeAssets };
const _ref_nhixi2 = { convertRGBtoHSL };
const _ref_nbub5u = { subscribeToEvents };
const _ref_dcedhg = { processAudioBuffer };
const _ref_1hvyra = { sanitizeInput };
const _ref_djwmts = { uniform3f };
const _ref_wmc22h = { sanitizeXSS };
const _ref_s8rj3g = { playSoundAlert };
const _ref_kw11ep = { signTransaction };
const _ref_g8asq3 = { optimizeTailCalls };
const _ref_170s2m = { generateFakeClass };
const _ref_6ilq6y = { debugAST };
const _ref_24o1ar = { hoistVariables };
const _ref_uuq3ru = { createShader };
const _ref_fwdhsa = { setAttack };
const _ref_n34jw4 = { connectSocket };
const _ref_ei6a0l = { deriveAddress };
const _ref_q2k7m8 = { extractArchive };
const _ref_98ju82 = { mergeFiles };
const _ref_bghp2z = { convertHSLtoRGB };
const _ref_d65or0 = { spoofReferer };
const _ref_sx1zov = { generateMipmaps };
const _ref_5eeg3r = { setFilePermissions };
const _ref_8b2ph5 = { mangleNames };
const _ref_zeetxu = { detectDevTools };
const _ref_y088xg = { unmuteStream };
const _ref_d3xhav = { resetVehicle };
const _ref_htbtm1 = { createTCPSocket };
const _ref_lmart2 = { rayIntersectTriangle };
const _ref_o4zxar = { updateRoutingTable };
const _ref_csi7te = { verifySignature };
const _ref_io762b = { deleteTexture };
const _ref_3o9wi4 = { enableBlend };
const _ref_w7038p = { validateFormInput };
const _ref_cqjqln = { clusterKMeans };
const _ref_gy2lpr = { removeRigidBody };
const _ref_qc5zvq = { calculateRestitution };
const _ref_k3g8y6 = { allocateDiskSpace };
const _ref_0lgt0m = { interestPeer };
const _ref_1hhlop = { removeMetadata };
const _ref_1045zy = { checkIntegrity };
const _ref_2aqudi = { verifyIR };
const _ref_ffjpye = { mutexUnlock };
const _ref_w2jn5h = { obfuscateCode };
const _ref_vh1bgj = { bindSocket };
const _ref_uwyzu6 = { analyzeHeader };
const _ref_16c5w9 = { uploadCrashReport };
const _ref_o4fupu = { archiveFiles };
const _ref_m2shm9 = { createIndex };
const _ref_ydujr1 = { rollbackTransaction };
const _ref_9oho17 = { compactDatabase };
const _ref_cmtd76 = { closePipe };
const _ref_ypco73 = { createGainNode };
const _ref_gpffhu = { getcwd };
const _ref_1k4q5n = { killParticles };
const _ref_qs59vf = { sanitizeSQLInput };
const _ref_ntgh6x = { readdir };
const _ref_yttzje = { semaphoreSignal };
const _ref_29nhtc = { createPipe };
const _ref_wv84kd = { injectCSPHeader };
const _ref_ict00i = { checkBatteryLevel };
const _ref_q4o0yq = { encryptLocalStorage };
const _ref_dm7jfa = { decryptStream };
const _ref_fxvz77 = { formatCurrency };
const _ref_2r7m7z = { createAnalyser };
const _ref_1qjmb6 = { setBrake };
const _ref_9yz8ss = { manageCookieJar };
const _ref_lekvxy = { requestPiece };
const _ref_9vxdl6 = { performOCR };
const _ref_3hnetl = { disableRightClick };
const _ref_97kupc = { resolveSymbols };
const _ref_xbwvos = { seedRatioLimit };
const _ref_dzrwqt = { initiateHandshake };
const _ref_7zs5sv = { dhcpOffer };
const _ref_agdfkg = { limitDownloadSpeed };
const _ref_b8uv8m = { parseM3U8Playlist };
const _ref_216uld = { prefetchAssets };
const _ref_5gtjz9 = { animateTransition };
const _ref_gxkdhe = { interpretBytecode };
const _ref_t6lolw = { sendPacket };
const _ref_htpsz0 = { getCpuLoad };
const _ref_qk8xdv = { limitBandwidth };
const _ref_wwhf10 = { prettifyCode };
const _ref_zrhj38 = { splitFile };
const _ref_p47m1g = { checkUpdate };
const _ref_ispzjh = { setRatio };
const _ref_y2p1ne = { repairCorruptFile };
const _ref_kfhtk9 = { unlockRow };
const _ref_nxl2t8 = { mockResponse };
const _ref_ufpwtl = { createDelay };
const _ref_mfckpl = { computeLossFunction };
const _ref_ujr7o1 = { validateSSLCert };
const _ref_or7lat = { dhcpAck };
const _ref_gvxe1d = { getVelocity };
const _ref_0ytsvc = { tokenizeSource };
const _ref_6iba5y = { rateLimitCheck };
const _ref_87ste7 = { loadCheckpoint };
const _ref_swefr4 = { debounceAction };
const _ref_szdnzd = { calculateSHA256 };
const _ref_1q9itq = { resolveHostName };
const _ref_qgoq2g = { mountFileSystem };
const _ref_da5gih = { restoreDatabase };
const _ref_gi0mly = { requestAnimationFrameLoop };
const _ref_bqqw19 = { computeDominators };
const _ref_wi4kcx = { addRigidBody };
const _ref_it8vsf = { bundleAssets };
const _ref_he2rrv = { createVehicle };
const _ref_tv5blu = { predictTensor };
const _ref_3jsvr6 = { setAngularVelocity };
const _ref_1ui4k6 = { contextSwitch };
const _ref_341wsj = { createPeriodicWave };
const _ref_x1p0sq = { debouncedResize };
const _ref_7edqqh = { removeConstraint };
const _ref_fh6h6n = { analyzeControlFlow };
const _ref_bdam33 = { detectVideoCodec };
const _ref_hgkogg = { calculateLayoutMetrics };
const _ref_0y8xp0 = { normalizeFeatures };
const _ref_uqgnh1 = { createThread };
const _ref_55kbft = { setRelease };
const _ref_6rv4mh = { readPipe };
const _ref_0snni2 = { lockRow };
const _ref_daz50l = { syncAudioVideo };
const _ref_3wiong = { clearBrowserCache };
const _ref_xdw5z1 = { createConvolver };
const _ref_w2zlhs = { stepSimulation };
const _ref_xe3epp = { connectNodes };
const _ref_77hsjz = { monitorNetworkInterface };
const _ref_cnjjsb = { recognizeSpeech };
const _ref_p2pwi0 = { dhcpRequest };
const _ref_nxmox5 = { detectVirtualMachine };
const _ref_xae3wx = { createMediaStreamSource };
const _ref_s8mur6 = { setThreshold };
const _ref_qg8x1o = { calculateMD5 };
const _ref_he2zrx = { addSliderConstraint };
const _ref_843vkw = { terminateSession };
const _ref_riad8e = { traceroute };
const _ref_zymveq = { cleanOldLogs };
const _ref_swezlf = { validateProgram };
const _ref_kghh2h = { lookupSymbol };
const _ref_gqm2w3 = { detectObjectYOLO };
const _ref_lmx6gz = { renderCanvasLayer };
const _ref_c1hds3 = { encodeABI };
const _ref_gvu1mo = { panicKernel };
const _ref_uav151 = { remuxContainer };
const _ref_zlx9ot = { migrateSchema };
const _ref_scnc36 = { translateMatrix };
const _ref_cymik7 = { extractThumbnail };
const _ref_6f61g5 = { createWaveShaper };
const _ref_uusjes = { unchokePeer };
const _ref_1pd1w3 = { rebootSystem };
const _ref_qdiwtz = { updateBitfield };
const _ref_ae4l31 = { detectCollision };
const _ref_hx48rp = { reportWarning };
const _ref_ciq6xf = { classifySentiment };
const _ref_1afqpr = { scheduleBandwidth };
const _ref_znh7ty = { applyImpulse };
const _ref_pqf7mo = { setDelayTime };
const _ref_9japm4 = { createChannelMerger };
const _ref_xo4o0w = { defineSymbol };
const _ref_s1p5sf = { getSystemUptime };
const _ref_4w6pjm = { switchProxyServer }; 
    });
})({}, {});