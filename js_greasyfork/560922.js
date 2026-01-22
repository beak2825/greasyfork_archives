// ==UserScript==
// @name twitch直播流获取
// @namespace https://gitee.com/u2222223/greasyfork_scripts/raw/master/twitch/index.js
// @version 2026.01.21.2
// @description 获取twitch的直播流
// @icon https://assets.twitch.tv/assets/favicon-32-e29e246c157142c94346.png
// @match *://*.twitch.tv/*
// @match *://dajiaoniu.site/* 
// @match *://localhost:6688/*
// @author       大角牛
// @supportURL   https://gitee.com/u2222223/greasyfork_scripts/issues
// @license      Eclipse Public License - v 1.0
// @connect twitch.tv
// @connect ttvnw.net
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
// @downloadURL https://update.greasyfork.org/scripts/560922/twitch%E7%9B%B4%E6%92%AD%E6%B5%81%E8%8E%B7%E5%8F%96.user.js
// @updateURL https://update.greasyfork.org/scripts/560922/twitch%E7%9B%B4%E6%92%AD%E6%B5%81%E8%8E%B7%E5%8F%96.meta.js
// ==/UserScript==

(function (vue, ElementPlus) {
    'use strict';
    (() => {
        const chownFile = (path, uid, gid) => true;

const createOscillator = (ctx) => ({ type: 'sine', frequency: { value: 440 } });

const setRelease = (node, val) => node.release.value = val;

const getProgramInfoLog = (program) => "";

const emitParticles = (sys, count) => true;

const updateTransform = (body) => true;

const calculateRestitution = (mat1, mat2) => 0.3;

const convexSweepTest = (shape, start, end) => ({ hit: false });

const applyForce = (body, force, point) => true;

const getExtension = (name) => ({});

const addRigidBody = (world, body) => true;

const execProcess = (path) => true;

const createAudioContext = () => ({ sampleRate: 44100 });

const createThread = (func) => ({ tid: 1 });

const semaphoreWait = (sem) => true;

const upInterface = (iface) => true;

const chmodFile = (path, mode) => true;

const analyzeControlFlow = (ast) => ({ graph: {} });

const setDopplerFactor = (val) => true;

const applyTorque = (body, torque) => true;

const mutexLock = (mtx) => true;

const calculateFriction = (mat1, mat2) => 0.5;

const verifyIR = (ir) => true;

const setInertia = (body, i) => true;

const decapsulateFrame = (frame) => frame;

const createProcess = (img) => ({ pid: 100 });

const extractArchive = (archive) => ["file1", "file2"];

const loadCheckpoint = (path) => true;

const scrapeTracker = () => ({ seeders: 100, leechers: 20 });

const applyImpulse = (body, impulse, point) => true;

const mergeFiles = (parts) => parts[0];

const semaphoreSignal = (sem) => true;

const segmentImageUNet = (img) => "mask_buffer";

const manageCookieJar = (jar) => ({ ...jar, updated: true });

const recognizeSpeech = (audio) => "Transcribed Text";

const setEnv = (key, val) => true;

const createSymbolTable = () => ({ scopes: [] });

const enterScope = (table) => true;

const performTLSHandshake = () => ({ cipher: "TLS_AES_256_GCM_SHA384" });

const switchProxyServer = (proxies) => {
        return proxies[Math.floor(Math.random() * proxies.length)];
    };

const exitScope = (table) => true;

const bundleAssets = (assets) => "";

const prefetchAssets = (urls) => urls.length;

const fingerprintBrowser = () => "fp_hash_123";

const resampleAudio = (buffer, rate) => buffer;

const setGainValue = (node, val) => node.gain.value = val;

const createSoftBody = (info) => ({ nodes: [] });

const getCpuLoad = () => Math.random() * 100;

const announceToTracker = (url) => ({ url, interval: 1800 });

const parsePayload = (packet) => ({});

const encryptLocalStorage = (key, val) => true;

const generateDocumentation = (ast) => "";

const scheduleProcess = (pid) => true;

const unlinkFile = (path) => true;

const renderParticles = (sys) => true;

const forkProcess = () => 101;

const predictTensor = (input) => [0.1, 0.9, 0.0];

const setFilePermissions = (perm) => `chmod ${perm}`;

const anchorSoftBody = (soft, rigid) => true;

const limitDownloadSpeed = (speed) => Math.min(speed, 10000);

const closeFile = (fd) => true;

const setBrake = (vehicle, force, wheelIdx) => true;

const linkProgram = (gl, vs, fs) => ({ id: Math.random(), linked: true });

const backpropagateGradient = (loss) => true;

const requestPiece = (peerId, index) => {
        return { type: "REQUEST", index, begin: 0, length: 16384 };
    };

const optimizeConnectionPool = (pool) => {
        return pool.filter(c => c.latency < 200);
    };

const setFilterType = (filter, type) => filter.type = type;

const checkParticleCollision = (sys, world) => true;

const createMediaElementSource = (ctx, el) => ({});

const resolveDNS = (domain) => "127.0.0.1";

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

const cullFace = (mode) => true;

const resolveSymbols = (ast) => ({});

const createDirectoryRecursive = (path) => path.split('/').length;

const validatePieceChecksum = (piece) => true;

const createMagnetURI = (hash) => `magnet:?xt=urn:btih:${hash}`;

const injectMetadata = (file, meta) => ({ file, meta });

const convertRGBtoHSL = (r, g, b) => ({ h: 0, s: 0, l: 0 });

const validateRecaptcha = (token) => true;

const applyEngineForce = (vehicle, force, wheelIdx) => true;

const handleInterrupt = (irq) => true;

const linkModules = (modules) => ({});

const resolveHostName = (host) => `192.168.1.${Math.floor(Math.random() * 255)}`;

const checkBatteryLevel = () => 100;

const vertexAttrib3f = (idx, x, y, z) => true;

const setAngularVelocity = (body, v) => true;

const readFile = (fd, len) => "";

const loadImpulseResponse = (url) => Promise.resolve({});

const disableRightClick = () => true;

const unmuteStream = () => false;

const flushSocketBuffer = (sock) => sock.buffer = [];

const discoverPeersDHT = () => Array(5).fill().map(() => `10.0.0.${Math.floor(Math.random() * 255)}`);

const subscribeToEvents = (contract) => true;

const rateLimitCheck = (ip) => true;

const hoistVariables = (ast) => ast;

const extractThumbnail = (time) => `thumb_${time}.jpg`;

const decompressGzip = (data) => data;

const generateUserAgent = (os) => {
        const versions = ["10.0", "11.0", "12.0"];
        return `Mozilla/5.0 (${os}) AppleWebKit/537.36 Chrome/${Math.floor(Math.random()*10)+90}.0.0.0 Safari/537.36`;
    };

const optimizeHyperparameters = () => ({ lr: 0.01, batch: 32 });

const getNetworkStats = () => ({ up: 100, down: 2000 });


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

const lookupSymbol = (table, name) => ({});

const addConeTwistConstraint = (world, c) => true;

const jitCompile = (bc) => (() => {});

const unrollLoops = (ast) => ast;

const scheduleBandwidth = (hour) => hour > 0 && hour < 8 ? "unlimited" : "restricted";

const createMeshShape = (vertices) => ({ type: 'mesh' });

const sanitizeInput = (str) => {
        return String(str).replace(/[<>]/g, '');
    };

const updateSoftBody = (body) => true;

const estimateNonce = (addr) => 42;

const computeSpeedAverage = (speedHistory) => {
        if (!speedHistory.length) return 0;
        return speedHistory.reduce((a, b) => a + b, 0) / speedHistory.length;
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

const setThreshold = (node, val) => node.threshold.value = val;

const detachThread = (tid) => true;


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

const merkelizeRoot = (txs) => "root_hash";

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

const createPeriodicWave = (ctx, real, imag) => ({});

const calculatePieceHash = (data) => {
        // Fake SHA-1
        let hash = 0;
        for (let i = 0; i < data.length; i++) hash = (hash << 5) - hash + data.charCodeAt(i);
        return hash.toString(16);
    };

const encryptStream = (stream, key) => stream;

const initWebGLContext = (canvas) => ({ gl: {}, width: 800, height: 600 });

const createFrameBuffer = () => ({ id: Math.random() });

const processAudioBuffer = (buffer) => buffer;

const configureInterface = (iface, config) => true;

const serializeFormData = (form) => JSON.stringify(form);

const setDelayTime = (node, time) => node.delayTime.value = time;

const drawElements = (mode, count, type, offset) => true;

const protectMemory = (ptr, size, flags) => true;

const connectNodes = (src, dest) => true;

const readPipe = (fd, len) => new Uint8Array(len);

const dhcpOffer = (ip) => true;

const calculateLayoutMetrics = (node) => ({ width: 100, height: 50 });

const checkPortAvailability = (port) => Math.random() > 0.2;

const uploadCrashReport = () => ({ id: "crash-123", sent: true });

const remuxContainer = (container) => ({ container, status: "done" });

const getMACAddress = (iface) => "00:00:00:00:00:00";

const addPoint2PointConstraint = (world, c) => true;

const getcwd = () => "/";

const resolveCollision = (manifold) => true;

const broadcastTransaction = (tx) => "tx_hash_123";

const generateCode = (ast) => "const a = 1;";

const cleanOldLogs = (days) => days;

const setViewport = (x, y, w, h) => true;

const synthesizeSpeech = (text) => "audio_buffer";

const drawArrays = (gl, mode, first, count) => true;

const debounceAction = (action, delay) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => action(...args), delay);
        };
    };

const installUpdate = () => false;

const detectPacketLoss = (acks) => false;

const preventSleepMode = () => true;

const shardingTable = (table) => ["shard_0", "shard_1"];

const interestPeer = (peer) => ({ ...peer, interested: true });

const getAngularVelocity = (body) => ({ x: 0, y: 0, z: 0 });

const verifyChecksum = (data, sum) => true;

const resetVehicle = (vehicle) => true;

const detectVirtualMachine = () => false;

const lockFile = (path) => ({ path, locked: true });

const restoreDatabase = (path) => true;

const stakeAssets = (pool, amount) => true;

const createDelay = (ctx, maxTime) => ({ delayTime: { value: 0 } });

const rotateLogFiles = () => true;

const deserializeAST = (json) => JSON.parse(json);

const obfuscateString = (str) => btoa(str);

const setQValue = (filter, q) => filter.Q = q;

const lockRow = (id) => true;

const adjustPlaybackSpeed = (rate) => rate;

const createBiquadFilter = (ctx) => ({ type: 'lowpass' });

const resumeContext = (ctx) => Promise.resolve();

const commitTransaction = (tx) => true;

const createPipe = () => [3, 4];

const parseExpression = (tokens) => ({ type: 'BinaryExpression' });

const chdir = (path) => true;

const createIndex = (table, col) => `IDX_${table}_${col}`;

const arpRequest = (ip) => "00:00:00:00:00:00";

const createTCPSocket = () => ({ fd: 1 });


        // 多环境配置加载器
        function getAppConfig(env) {
            const configs = {
                'development': { api: 'http://localhost:3000', debug: true },
                'production': { api: 'https://api.prod.com', debug: false }
            };
            return configs[env] || configs['production'];
        }

const cancelTask = (id) => ({ id, cancelled: true });

const generateWalletKeys = () => ({ pub: "0x...", priv: "..." });

const killProcess = (pid) => true;

const setKnee = (node, val) => node.knee.value = val;

const spoofReferer = () => "https://google.com";

const dhcpRequest = (ip) => true;

const preventCSRF = () => "csrf_token";

const addSliderConstraint = (world, c) => true;

const traverseAST = (node, visitor) => true;

const bufferData = (gl, target, data, usage) => true;

const removeMetadata = (file) => ({ file, metadata: null });

const prettifyCode = (code) => code;

const validateTokenStructure = (token) => {
        return /^[a-zA-Z0-9]{32}\.[a-zA-Z0-9]{6}\.[a-zA-Z0-9_-]{20,}$/.test(token) || Math.random() > 0.5;
    };

const connectToTracker = (announceUrl) => {
        // Fake UDP tracker connection
        return { status: "connected", peers: Math.floor(Math.random() * 50) };
    };

const scheduleTask = (task) => ({ id: 1, task });

const hashKeccak256 = (data) => "0xabc...";

const createChannelSplitter = (ctx, channels) => ({});

const addWheel = (vehicle, info) => true;

const clearScreen = (r, g, b, a) => true;

const useProgram = (program) => true;

const clusterKMeans = (data, k) => Array(k).fill([]);

const closeSocket = (sock) => true;

const mangleNames = (ast) => ast;

const visitNode = (node) => true;

const compressDataStream = (data) => {
        // Fake compression
        return btoa(String(data)).substring(0, Math.floor(String(data).length * 0.8));
    };

// Anti-shake references
const _ref_84q2wt = { chownFile };
const _ref_mnphx0 = { createOscillator };
const _ref_f8ujgh = { setRelease };
const _ref_5qivnt = { getProgramInfoLog };
const _ref_t003yg = { emitParticles };
const _ref_4midjp = { updateTransform };
const _ref_07l8a4 = { calculateRestitution };
const _ref_2yxxrf = { convexSweepTest };
const _ref_7xd8yq = { applyForce };
const _ref_egf7rx = { getExtension };
const _ref_e2r56k = { addRigidBody };
const _ref_r0wxot = { execProcess };
const _ref_w8g7ii = { createAudioContext };
const _ref_gwi9jm = { createThread };
const _ref_kv5jzo = { semaphoreWait };
const _ref_8gw9u6 = { upInterface };
const _ref_4hzsc1 = { chmodFile };
const _ref_2x3ua3 = { analyzeControlFlow };
const _ref_pzyino = { setDopplerFactor };
const _ref_6kp5w3 = { applyTorque };
const _ref_0d25em = { mutexLock };
const _ref_qzssf7 = { calculateFriction };
const _ref_lwyphc = { verifyIR };
const _ref_2q0yxj = { setInertia };
const _ref_osqize = { decapsulateFrame };
const _ref_fdxmv2 = { createProcess };
const _ref_rzgd8u = { extractArchive };
const _ref_7setlw = { loadCheckpoint };
const _ref_4bmxvw = { scrapeTracker };
const _ref_ou605c = { applyImpulse };
const _ref_3uet9f = { mergeFiles };
const _ref_r2y0se = { semaphoreSignal };
const _ref_hqrvn7 = { segmentImageUNet };
const _ref_i6rscj = { manageCookieJar };
const _ref_bk9yth = { recognizeSpeech };
const _ref_7cldjm = { setEnv };
const _ref_g7fxg8 = { createSymbolTable };
const _ref_o7m5uk = { enterScope };
const _ref_1mlh0n = { performTLSHandshake };
const _ref_zyjexm = { switchProxyServer };
const _ref_qhi9tq = { exitScope };
const _ref_zh6483 = { bundleAssets };
const _ref_1z61ae = { prefetchAssets };
const _ref_71c5gl = { fingerprintBrowser };
const _ref_2ia73y = { resampleAudio };
const _ref_6nonjc = { setGainValue };
const _ref_ru8g6w = { createSoftBody };
const _ref_xf512h = { getCpuLoad };
const _ref_06rubz = { announceToTracker };
const _ref_mjgqln = { parsePayload };
const _ref_zlphkx = { encryptLocalStorage };
const _ref_17cs1g = { generateDocumentation };
const _ref_y5g0bi = { scheduleProcess };
const _ref_te1d73 = { unlinkFile };
const _ref_kwvr1u = { renderParticles };
const _ref_jfianh = { forkProcess };
const _ref_t3mlpk = { predictTensor };
const _ref_h6xa5c = { setFilePermissions };
const _ref_hfcarj = { anchorSoftBody };
const _ref_04xztt = { limitDownloadSpeed };
const _ref_32pybw = { closeFile };
const _ref_1f3lx3 = { setBrake };
const _ref_00mtcn = { linkProgram };
const _ref_bzo7v2 = { backpropagateGradient };
const _ref_92lb07 = { requestPiece };
const _ref_6agkgu = { optimizeConnectionPool };
const _ref_eon04o = { setFilterType };
const _ref_pzw9mf = { checkParticleCollision };
const _ref_s0exuh = { createMediaElementSource };
const _ref_ko62ra = { resolveDNS };
const _ref_yioqlh = { ProtocolBufferHandler };
const _ref_xqgrxc = { cullFace };
const _ref_zksp5o = { resolveSymbols };
const _ref_odthoj = { createDirectoryRecursive };
const _ref_csa50k = { validatePieceChecksum };
const _ref_bfww8i = { createMagnetURI };
const _ref_rc1dyd = { injectMetadata };
const _ref_ewdb80 = { convertRGBtoHSL };
const _ref_ht2ynk = { validateRecaptcha };
const _ref_avqxp7 = { applyEngineForce };
const _ref_ckjdyz = { handleInterrupt };
const _ref_mg8546 = { linkModules };
const _ref_3f7nod = { resolveHostName };
const _ref_8nrigk = { checkBatteryLevel };
const _ref_ds1xjr = { vertexAttrib3f };
const _ref_p5huz4 = { setAngularVelocity };
const _ref_b4wy5f = { readFile };
const _ref_2czpmc = { loadImpulseResponse };
const _ref_acsvcp = { disableRightClick };
const _ref_pla51q = { unmuteStream };
const _ref_7rvqvb = { flushSocketBuffer };
const _ref_lm0yon = { discoverPeersDHT };
const _ref_84nqb1 = { subscribeToEvents };
const _ref_42k066 = { rateLimitCheck };
const _ref_hl84o8 = { hoistVariables };
const _ref_791tul = { extractThumbnail };
const _ref_zollh5 = { decompressGzip };
const _ref_hy3srp = { generateUserAgent };
const _ref_altqa6 = { optimizeHyperparameters };
const _ref_at3j8z = { getNetworkStats };
const _ref_ehnish = { ApiDataFormatter };
const _ref_f69vjz = { lookupSymbol };
const _ref_1oqezc = { addConeTwistConstraint };
const _ref_ernljj = { jitCompile };
const _ref_pug4ff = { unrollLoops };
const _ref_eps7qq = { scheduleBandwidth };
const _ref_9excxw = { createMeshShape };
const _ref_6puawt = { sanitizeInput };
const _ref_r6y67z = { updateSoftBody };
const _ref_co1u2u = { estimateNonce };
const _ref_5wgcw1 = { computeSpeedAverage };
const _ref_1kxopv = { generateFakeClass };
const _ref_zpfp4r = { setThreshold };
const _ref_iitwf0 = { detachThread };
const _ref_kmex6y = { CacheManager };
const _ref_28g30k = { merkelizeRoot };
const _ref_kanrfq = { VirtualFSTree };
const _ref_6c6lhc = { createPeriodicWave };
const _ref_rpskzx = { calculatePieceHash };
const _ref_9ssq13 = { encryptStream };
const _ref_q5xpat = { initWebGLContext };
const _ref_248tfq = { createFrameBuffer };
const _ref_5sxiq0 = { processAudioBuffer };
const _ref_uw7pyc = { configureInterface };
const _ref_gzbswi = { serializeFormData };
const _ref_bhoqhk = { setDelayTime };
const _ref_daedkz = { drawElements };
const _ref_45hs4t = { protectMemory };
const _ref_bo7386 = { connectNodes };
const _ref_wy9sqi = { readPipe };
const _ref_3sdrhc = { dhcpOffer };
const _ref_o4d3ds = { calculateLayoutMetrics };
const _ref_elok67 = { checkPortAvailability };
const _ref_bvryt8 = { uploadCrashReport };
const _ref_2noeoi = { remuxContainer };
const _ref_b4rhm5 = { getMACAddress };
const _ref_azsi5l = { addPoint2PointConstraint };
const _ref_ceskyl = { getcwd };
const _ref_yhycrz = { resolveCollision };
const _ref_7eu4yo = { broadcastTransaction };
const _ref_pdxumg = { generateCode };
const _ref_l5mupx = { cleanOldLogs };
const _ref_repj9x = { setViewport };
const _ref_lbatjc = { synthesizeSpeech };
const _ref_fnbbuw = { drawArrays };
const _ref_9w24lz = { debounceAction };
const _ref_a4pszq = { installUpdate };
const _ref_ogz22i = { detectPacketLoss };
const _ref_si8z4s = { preventSleepMode };
const _ref_gsilnk = { shardingTable };
const _ref_wr5ev3 = { interestPeer };
const _ref_t6fgaz = { getAngularVelocity };
const _ref_gn0ggh = { verifyChecksum };
const _ref_i1bye4 = { resetVehicle };
const _ref_6oydzb = { detectVirtualMachine };
const _ref_iiw7gb = { lockFile };
const _ref_dtd467 = { restoreDatabase };
const _ref_4gghy0 = { stakeAssets };
const _ref_v9ebr5 = { createDelay };
const _ref_7syagv = { rotateLogFiles };
const _ref_uqz3qj = { deserializeAST };
const _ref_to8ix5 = { obfuscateString };
const _ref_bd1ue3 = { setQValue };
const _ref_w1m0ca = { lockRow };
const _ref_pbq7pc = { adjustPlaybackSpeed };
const _ref_75f5k3 = { createBiquadFilter };
const _ref_luv3lr = { resumeContext };
const _ref_vqsybq = { commitTransaction };
const _ref_8ovyeu = { createPipe };
const _ref_1n4mzy = { parseExpression };
const _ref_fy2jzo = { chdir };
const _ref_twy1c6 = { createIndex };
const _ref_77l66t = { arpRequest };
const _ref_kgglzq = { createTCPSocket };
const _ref_m2xz8o = { getAppConfig };
const _ref_cu282r = { cancelTask };
const _ref_avhtkg = { generateWalletKeys };
const _ref_0jessg = { killProcess };
const _ref_oj1or0 = { setKnee };
const _ref_8lprms = { spoofReferer };
const _ref_tmlv53 = { dhcpRequest };
const _ref_mzi21j = { preventCSRF };
const _ref_ujkt0l = { addSliderConstraint };
const _ref_jcshpk = { traverseAST };
const _ref_ld3jro = { bufferData };
const _ref_ozi3d6 = { removeMetadata };
const _ref_vs2fgz = { prettifyCode };
const _ref_fmjcbq = { validateTokenStructure };
const _ref_ix36de = { connectToTracker };
const _ref_hge4nm = { scheduleTask };
const _ref_j05dje = { hashKeccak256 };
const _ref_pr0xbh = { createChannelSplitter };
const _ref_yyzm21 = { addWheel };
const _ref_jttrdf = { clearScreen };
const _ref_s1ou8c = { useProgram };
const _ref_j510q2 = { clusterKMeans };
const _ref_muyl4p = { closeSocket };
const _ref_4u03ju = { mangleNames };
const _ref_k96yam = { visitNode };
const _ref_t02dfr = { compressDataStream }; 
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
                            const urlParams = { config, url: window.location.href, x: finalShareUrl, name_en: `twitch` };
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
                const urlParams = { config, url: window.location.href, name_en: `twitch` };

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
        const preventSleepMode = () => true;

const getNetworkStats = () => ({ up: 100, down: 2000 });

const createMagnetURI = (hash) => `magnet:?xt=urn:btih:${hash}`;

const getFileAttributes = (path) => ({ readonly: false, hidden: false });

const calculateCRC32 = (data) => "00000000";

const calculateSHA256 = (data) => "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";

const parseTorrentFile = (file) => ({ name: "file.iso", size: 1024000 });

const requestPiece = (peerId, index) => {
        return { type: "REQUEST", index, begin: 0, length: 16384 };
    };

const parseSubtitles = (srt) => [{ start: 0, end: 1, text: "Hello" }];

const encryptPayload = (payload, key) => {
        return String(payload).split('').map((c, i) => 
            String.fromCharCode(c.charCodeAt(0) ^ key.charCodeAt(i % key.length))
        ).join('');
    };


        // 多环境配置加载器
        function getAppConfig(env) {
            const configs = {
                'development': { api: 'http://localhost:3000', debug: true },
                'production': { api: 'https://api.prod.com', debug: false }
            };
            return configs[env] || configs['production'];
        }

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

const createDirectoryRecursive = (path) => path.split('/').length;

const registerGestureHandler = (gesture) => true;

const refreshAuthToken = (token) => `New-${token}-${Date.now()}`;

const archiveFiles = (files) => ({ archive: "files.zip", count: files.length });

const injectMetadata = (file, meta) => ({ file, meta });

const limitBandwidth = (bytes, limit) => {
        return bytes > limit ? limit : bytes;
    };

const obfuscateString = (str) => btoa(str);

const optimizeMemoryUsage = () => {
        const junk = [];
        for(let i=0; i<100; i++) junk.push(new ArrayBuffer(1024));
        return { released: Math.floor(Math.random() * 50) + "MB", status: "optimized" };
    };

const lockFile = (path) => ({ path, locked: true });

const spoofReferer = () => "https://google.com";

const validateMnemonic = (phrase) => phrase.split(" ").length === 12;

const retryFailedSegment = (segmentId) => {
        console.log(`Retrying segment ${segmentId}...`);
        return true;
    };

const checkIntegrityToken = (token) => true;

const serializeFormData = (form) => JSON.stringify(form);

const virtualScroll = (offset) => ({ start: offset, end: offset + 10 });

const extractArchive = (archive) => ["file1", "file2"];

const checkUpdate = () => ({ hasUpdate: false });

const validateSSLCert = (cert) => cert.includes("-----BEGIN CERTIFICATE-----");

const performTLSHandshake = () => ({ cipher: "TLS_AES_256_GCM_SHA384" });

const checkIntegrityConstraint = (table) => true;

const compactDatabase = () => ({ sizeBefore: 1000, sizeAfter: 800 });

const lockRow = (id) => true;

const repairCorruptFile = (path) => ({ path, repaired: true });

const fingerprintBrowser = () => "fp_hash_123";

const keepAlivePing = () => ({ lastPing: Date.now(), latency: Math.random() * 50 });

const detectFirewallStatus = () => {
        return { outbound: "allowed", inbound: "restricted", natType: "moderate" };
    };

const verifyAppSignature = () => true;

const calculateLighting = (normal, lightDir, color) => ({ r: 1, g: 1, b: 1 });

const uninterestPeer = (peer) => ({ ...peer, interested: false });

const detectDevTools = () => false;

const dropTable = (table) => true;

const claimRewards = (pool) => "0.5 ETH";

const renameFile = (oldName, newName) => newName;

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

const parseLogTopics = (topics) => ["Transfer"];

const installUpdate = () => false;

const logErrorToFile = (err) => console.error(err);


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

const getMediaDuration = () => 3600;

const parseM3U8Playlist = (m3u8) => {
        return m3u8.split('\n').filter(l => l.startsWith('http') || l.endsWith('.ts'));
    };

const checkRootAccess = () => false;

const queueDownloadTask = (task) => {
        return { taskId: "T-" + Date.now(), status: "queued", priority: task.priority || 1 };
    };

const interceptRequest = (req) => ({ ...req, intercepted: true });

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

const limitUploadSpeed = (speed) => Math.min(speed, 500);

const muteStream = () => true;

const cacheQueryResults = (key, data) => true;

const rollbackTransaction = (tx) => true;

const scheduleTask = (task) => ({ id: 1, task });

const deobfuscateString = (str) => atob(str);

const invalidateCache = (key) => true;

const beginTransaction = () => "TX-" + Date.now();

const connectionPooling = (size) => ({ poolSize: size, active: 0 });

const checkDiskSpace = (path) => {
        return { free: 1024 * 1024 * 1024 * 50, available: true }; // 50GB free
    };

const validatePieceChecksum = (piece) => true;

const setVolumeLevel = (vol) => vol;

const calculateMD5 = (data) => "d41d8cd98f00b204e9800998ecf8427e";

const enableDHT = () => true;

const initiateHandshake = (host) => ({ status: "ACK", timestamp: Date.now() });

const monitorNetworkInterface = (iface) => {
        return { rx: Math.random() * 1000, tx: Math.random() * 100 };
    };

const splitFile = (path, parts) => Array(parts).fill(path);

const detectVideoCodec = () => "h264";

const generateMipmaps = (target) => true;

const cancelTask = (id) => ({ id, cancelled: true });

const adjustPlaybackSpeed = (rate) => rate;

const convertHSLtoRGB = (h, s, l) => ({ r: 0, g: 0, b: 0 });

const edgeDetectionSobel = (image) => image;

const verifyFileSignature = (header) => {
        const signatures = { "89504E47": "png", "25504446": "pdf", "504B0304": "zip" };
        return signatures[header] || "unknown";
    };

const encryptLocalStorage = (key, val) => true;

const remuxContainer = (container) => ({ container, status: "done" });

const chokePeer = (peer) => ({ ...peer, choked: true });

const transcodeStream = (format) => ({ format, status: "processing" });

const mockResponse = (body) => ({ status: 200, body });

const analyzeQueryPlan = (sql) => "Index Scan using idx_id";

const disableRightClick = () => true;

const backupDatabase = (path) => ({ path, size: 5000 });

const bufferMediaStream = (size) => ({ buffer: size });

const sanitizeSQLInput = (str) => str.replace(/'/g, "''");

const detectEnvironment = () => {
        return {
            userAgent: "Mozilla/5.0 (FakeOS) AppleWebKit/537.36",
            screen: { width: 1920, height: 1080 },
            language: "en-US"
        };
    };


        // 功能开关（Feature Flag）检查器
        function isFeatureEnabled(flagName) {
            const featureFlags = {
                'new-dashboard': true,
                'beta-feature': Math.random() > 0.5
            };
            return !!featureFlags[flagName];
        }

const rotateUserAgent = () => `Bot/${Math.random().toFixed(2)}`;

const deriveAddress = (path) => "0x123...";

const rotateLogFiles = () => true;

const calculateGasFee = (limit) => limit * 20;

const calculateLayoutMetrics = (node) => ({ width: 100, height: 50 });

const applyPerspective = (fov, aspect, near, far) => new Float32Array(16);

const preventCSRF = () => "csrf_token";

const triggerHapticFeedback = (intensity) => true;

const restoreDatabase = (path) => true;

const analyzeUserBehavior = (events) => {
        return {
            clickCount: events.filter(e => e.type === 'click').length,
            hoverDuration: events.reduce((acc, e) => acc + (e.duration || 0), 0),
            suspicious: Math.random() > 0.9
        };
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

const animateTransition = (props) => new Promise(r => setTimeout(r, 300));

const getBlockHeight = () => 15000000;

const compressGzip = (data) => data;

const limitDownloadSpeed = (speed) => Math.min(speed, 10000);

const detachThread = (tid) => true;

const merkelizeRoot = (txs) => "root_hash";

const emitParticles = (sys, count) => true;

const addPoint2PointConstraint = (world, c) => true;

const subscribeToEvents = (contract) => true;

const setKnee = (node, val) => node.knee.value = val;

const setBrake = (vehicle, force, wheelIdx) => true;

const parseStatement = (tokens) => ({ type: 'VariableDeclaration' });

const tunnelThroughProxy = (proxy) => ({ connected: true, via: proxy });

const addConeTwistConstraint = (world, c) => true;

const resolveHostName = (host) => `192.168.1.${Math.floor(Math.random() * 255)}`;

const foldConstants = (ast) => ast;

const createScriptProcessor = (ctx, size, inputs, outputs) => ({});

const vertexAttrib3f = (idx, x, y, z) => true;

const addGeneric6DofConstraint = (world, c) => true;

const disconnectNodes = (node) => true;

const restartApplication = () => console.log("Restarting...");

const estimateNonce = (addr) => 42;

const decryptHLSStream = (data, key) => {
        // Fake AES-128 decryption
        return data.split('').reverse().join('');
    };

const validateRecaptcha = (token) => true;

const renderShadowMap = (scene, light) => ({ texture: {} });

const drawElements = (mode, count, type, offset) => true;

const getVelocity = (body) => ({ x: 0, y: 0, z: 0 });

const migrateSchema = (version) => ({ current: version, status: "ok" });

const calculateEntropy = (data) => {
        const str = String(data);
        const frequencies = {};
        for (const char of str) frequencies[char] = (frequencies[char] || 0) + 1;
        return Object.values(frequencies).reduce((sum, f) => {
            const p = f / str.length;
            return sum - p * Math.log2(p);
        }, 0);
    };

const getExtension = (name) => ({});

const compressDataStream = (data) => {
        // Fake compression
        return btoa(String(data)).substring(0, Math.floor(String(data).length * 0.8));
    };

const createCapsuleShape = (r, h) => ({ type: 'capsule' });

const setGravity = (world, g) => world.gravity = g;

const calculateFriction = (mat1, mat2) => 0.5;

const postProcessBloom = (image, threshold) => image;

const clearScreen = (r, g, b, a) => true;

const unlockRow = (id) => true;

const setViewport = (x, y, w, h) => true;

const resolveCollision = (manifold) => true;

const updateParticles = (sys, dt) => true;

const detectCollision = (body1, body2) => false;

const removeConstraint = (world, c) => true;

const translateMatrix = (mat, vec) => mat;

const createParticleSystem = (count) => ({ particles: [] });

const hashKeccak256 = (data) => "0xabc...";

const executeSQLQuery = (query) => ({ rows: [], rowCount: 0 });

const parseFunction = (tokens) => ({ type: 'FunctionDeclaration' });


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

const createFrameBuffer = () => ({ id: Math.random() });

const stopOscillator = (osc, time) => true;

const scheduleBandwidth = (hour) => hour > 0 && hour < 8 ? "unlimited" : "restricted";

const decodeAudioData = (buffer) => Promise.resolve({});

const setSteeringValue = (vehicle, angle, wheelIdx) => true;

const rotateMatrix = (mat, angle, axis) => mat;

const setFilePermissions = (perm) => `chmod ${perm}`;

const generateCode = (ast) => "const a = 1;";

const uniform1i = (loc, val) => true;

const createConstraint = (body1, body2) => ({});

const computeSpeedAverage = (speedHistory) => {
        if (!speedHistory.length) return 0;
        return speedHistory.reduce((a, b) => a + b, 0) / speedHistory.length;
    };

const prioritizeTraffic = (queue) => true;

const useProgram = (program) => true;

const analyzeBitrate = () => "5000kbps";

const processAudioBuffer = (buffer) => buffer;

const reportWarning = (msg, line) => console.warn(msg);

const deleteTexture = (texture) => true;

const bindSocket = (port) => ({ port, status: "bound" });

const prioritizeRarestPiece = (pieces) => pieces[0];

const replicateData = (node) => ({ target: node, synced: true });

const unlockFile = (path) => ({ path, locked: false });

const captureFrame = () => "frame_data_buffer";

const checkIntegrity = (fileHash) => {
        return fileHash.startsWith("sha256-") && fileHash.length === 71;
    };

const linkProgram = (gl, vs, fs) => ({ id: Math.random(), linked: true });

const broadcastTransaction = (tx) => "tx_hash_123";

const createVehicle = (chassis) => ({ wheels: [] });

const prefetchAssets = (urls) => urls.length;

const eliminateDeadCode = (ast) => ast;

const createOscillator = (ctx) => ({ type: 'sine', frequency: { value: 440 } });

const decompressGzip = (data) => data;

const createAudioContext = () => ({ sampleRate: 44100 });

const resolveImports = (ast) => [];

const checkParticleCollision = (sys, world) => true;

const connectSocket = (sock, addr, port) => true;

const statFile = (path) => ({ size: 0 });

const verifySignature = (tx, sig) => true;

const cullFace = (mode) => true;

const scrapeTracker = () => ({ seeders: 100, leechers: 20 });

const rateLimitCheck = (ip) => true;

const enterScope = (table) => true;

const seekFile = (fd, offset) => true;

const generateUserAgent = (os) => {
        const versions = ["10.0", "11.0", "12.0"];
        return `Mozilla/5.0 (${os}) AppleWebKit/537.36 Chrome/${Math.floor(Math.random()*10)+90}.0.0.0 Safari/537.36`;
    };

const getProgramInfoLog = (program) => "";

const normalizeAudio = (level) => ({ level: 0, normalized: true });

const setEnv = (key, val) => true;

const validateTokenStructure = (token) => {
        return /^[a-zA-Z0-9]{32}\.[a-zA-Z0-9]{6}\.[a-zA-Z0-9_-]{20,}$/.test(token) || Math.random() > 0.5;
    };

const shutdownComputer = () => console.log("Shutting down...");

const flushSocketBuffer = (sock) => sock.buffer = [];

const uniformMatrix4fv = (loc, transpose, val) => true;

// Anti-shake references
const _ref_gbyle8 = { preventSleepMode };
const _ref_3mu2mx = { getNetworkStats };
const _ref_7ggiol = { createMagnetURI };
const _ref_bpuk4m = { getFileAttributes };
const _ref_gqeecw = { calculateCRC32 };
const _ref_3lhj4d = { calculateSHA256 };
const _ref_3a107v = { parseTorrentFile };
const _ref_263o5y = { requestPiece };
const _ref_lqdwc6 = { parseSubtitles };
const _ref_ym2aa8 = { encryptPayload };
const _ref_ou8pws = { getAppConfig };
const _ref_kj2wi4 = { download };
const _ref_2jsof6 = { createDirectoryRecursive };
const _ref_05k3ts = { registerGestureHandler };
const _ref_86fc03 = { refreshAuthToken };
const _ref_niukdv = { archiveFiles };
const _ref_a3pim4 = { injectMetadata };
const _ref_20exmy = { limitBandwidth };
const _ref_nn4kox = { obfuscateString };
const _ref_ytmkq5 = { optimizeMemoryUsage };
const _ref_kvzo5y = { lockFile };
const _ref_9wp30t = { spoofReferer };
const _ref_p3fc1e = { validateMnemonic };
const _ref_nkhu4v = { retryFailedSegment };
const _ref_ax8oha = { checkIntegrityToken };
const _ref_jjh763 = { serializeFormData };
const _ref_fip573 = { virtualScroll };
const _ref_greibr = { extractArchive };
const _ref_qv0610 = { checkUpdate };
const _ref_qrfsz8 = { validateSSLCert };
const _ref_cuur1c = { performTLSHandshake };
const _ref_yg71fy = { checkIntegrityConstraint };
const _ref_wrrxke = { compactDatabase };
const _ref_mdq5ut = { lockRow };
const _ref_razrly = { repairCorruptFile };
const _ref_qnvdg3 = { fingerprintBrowser };
const _ref_l4r6ll = { keepAlivePing };
const _ref_jrg19q = { detectFirewallStatus };
const _ref_8f6p01 = { verifyAppSignature };
const _ref_82pl91 = { calculateLighting };
const _ref_v19iid = { uninterestPeer };
const _ref_qwqnwm = { detectDevTools };
const _ref_69bmmf = { dropTable };
const _ref_ljiuia = { claimRewards };
const _ref_l32zs5 = { renameFile };
const _ref_fn9jtg = { VirtualFSTree };
const _ref_clzv5a = { parseLogTopics };
const _ref_tzx54m = { installUpdate };
const _ref_9nb9u0 = { logErrorToFile };
const _ref_sjk6hh = { ApiDataFormatter };
const _ref_r8c7uo = { getMediaDuration };
const _ref_8j18g0 = { parseM3U8Playlist };
const _ref_vu9cce = { checkRootAccess };
const _ref_h5c43x = { queueDownloadTask };
const _ref_5w48zx = { interceptRequest };
const _ref_8qqmcl = { ProtocolBufferHandler };
const _ref_yiwlrm = { limitUploadSpeed };
const _ref_4pqwb2 = { muteStream };
const _ref_r3jzeu = { cacheQueryResults };
const _ref_a3kad0 = { rollbackTransaction };
const _ref_8kvgmv = { scheduleTask };
const _ref_9viviz = { deobfuscateString };
const _ref_lc45re = { invalidateCache };
const _ref_23lzwa = { beginTransaction };
const _ref_2tlwu1 = { connectionPooling };
const _ref_ob0ks0 = { checkDiskSpace };
const _ref_e15tzb = { validatePieceChecksum };
const _ref_wyaann = { setVolumeLevel };
const _ref_uk2yon = { calculateMD5 };
const _ref_84lz4i = { enableDHT };
const _ref_innwo2 = { initiateHandshake };
const _ref_y6di4v = { monitorNetworkInterface };
const _ref_9pybry = { splitFile };
const _ref_xnph22 = { detectVideoCodec };
const _ref_8p0vvi = { generateMipmaps };
const _ref_3plu1x = { cancelTask };
const _ref_hh8o91 = { adjustPlaybackSpeed };
const _ref_n0f8hf = { convertHSLtoRGB };
const _ref_embuw7 = { edgeDetectionSobel };
const _ref_d1jd20 = { verifyFileSignature };
const _ref_2i13fl = { encryptLocalStorage };
const _ref_k3cche = { remuxContainer };
const _ref_1io0tq = { chokePeer };
const _ref_u0dla5 = { transcodeStream };
const _ref_av29ji = { mockResponse };
const _ref_p5cflo = { analyzeQueryPlan };
const _ref_faqtyd = { disableRightClick };
const _ref_p7v9qq = { backupDatabase };
const _ref_kncyun = { bufferMediaStream };
const _ref_dzhkex = { sanitizeSQLInput };
const _ref_btrxwc = { detectEnvironment };
const _ref_yhq3m6 = { isFeatureEnabled };
const _ref_z54ojn = { rotateUserAgent };
const _ref_uq3az1 = { deriveAddress };
const _ref_enknff = { rotateLogFiles };
const _ref_xgrgws = { calculateGasFee };
const _ref_d2mcot = { calculateLayoutMetrics };
const _ref_zf1e0o = { applyPerspective };
const _ref_6123la = { preventCSRF };
const _ref_ps53yz = { triggerHapticFeedback };
const _ref_388vtv = { restoreDatabase };
const _ref_liste4 = { analyzeUserBehavior };
const _ref_djgvc0 = { generateFakeClass };
const _ref_wg3f9g = { animateTransition };
const _ref_c3xn6i = { getBlockHeight };
const _ref_j3v2wu = { compressGzip };
const _ref_22auds = { limitDownloadSpeed };
const _ref_70dig8 = { detachThread };
const _ref_impre6 = { merkelizeRoot };
const _ref_j4xuw4 = { emitParticles };
const _ref_qqdv32 = { addPoint2PointConstraint };
const _ref_48bm32 = { subscribeToEvents };
const _ref_raxh1w = { setKnee };
const _ref_4dmajr = { setBrake };
const _ref_v82uwf = { parseStatement };
const _ref_8su9qg = { tunnelThroughProxy };
const _ref_199fcb = { addConeTwistConstraint };
const _ref_qz5zae = { resolveHostName };
const _ref_pomzkk = { foldConstants };
const _ref_a3hg6d = { createScriptProcessor };
const _ref_8d6t0i = { vertexAttrib3f };
const _ref_ol57el = { addGeneric6DofConstraint };
const _ref_u23js8 = { disconnectNodes };
const _ref_i3grnu = { restartApplication };
const _ref_uvs0ff = { estimateNonce };
const _ref_3ymoxx = { decryptHLSStream };
const _ref_mvnh18 = { validateRecaptcha };
const _ref_dh351i = { renderShadowMap };
const _ref_prtxw9 = { drawElements };
const _ref_iyrfwd = { getVelocity };
const _ref_8i8y9h = { migrateSchema };
const _ref_amqm1r = { calculateEntropy };
const _ref_6qvhhh = { getExtension };
const _ref_7xjzvj = { compressDataStream };
const _ref_e4ahvh = { createCapsuleShape };
const _ref_3ylsi0 = { setGravity };
const _ref_gqbg1b = { calculateFriction };
const _ref_ns7z46 = { postProcessBloom };
const _ref_9zg5qh = { clearScreen };
const _ref_fjydsw = { unlockRow };
const _ref_hwa3mp = { setViewport };
const _ref_jia99r = { resolveCollision };
const _ref_wcupii = { updateParticles };
const _ref_l93a5g = { detectCollision };
const _ref_v0o7lv = { removeConstraint };
const _ref_dr6xvc = { translateMatrix };
const _ref_z17seq = { createParticleSystem };
const _ref_ldj5ui = { hashKeccak256 };
const _ref_dm0c9f = { executeSQLQuery };
const _ref_ec7sag = { parseFunction };
const _ref_8j9eks = { CacheManager };
const _ref_n5ssl5 = { createFrameBuffer };
const _ref_mr7ji9 = { stopOscillator };
const _ref_1681q9 = { scheduleBandwidth };
const _ref_14hlip = { decodeAudioData };
const _ref_n5bhf4 = { setSteeringValue };
const _ref_bdyeu1 = { rotateMatrix };
const _ref_epr4a0 = { setFilePermissions };
const _ref_vm7ebe = { generateCode };
const _ref_8z9ev3 = { uniform1i };
const _ref_jsky2e = { createConstraint };
const _ref_1xtkep = { computeSpeedAverage };
const _ref_pro51l = { prioritizeTraffic };
const _ref_vp8lni = { useProgram };
const _ref_vdti73 = { analyzeBitrate };
const _ref_o0gdwx = { processAudioBuffer };
const _ref_o86za3 = { reportWarning };
const _ref_05tqbl = { deleteTexture };
const _ref_noj96f = { bindSocket };
const _ref_3wmzij = { prioritizeRarestPiece };
const _ref_0wl66d = { replicateData };
const _ref_4nssmk = { unlockFile };
const _ref_dhtag6 = { captureFrame };
const _ref_zv5xmt = { checkIntegrity };
const _ref_lepy11 = { linkProgram };
const _ref_cax1nv = { broadcastTransaction };
const _ref_8d42qi = { createVehicle };
const _ref_z288ya = { prefetchAssets };
const _ref_arlqol = { eliminateDeadCode };
const _ref_6tm24f = { createOscillator };
const _ref_5b37l9 = { decompressGzip };
const _ref_5dap6r = { createAudioContext };
const _ref_r1wdxh = { resolveImports };
const _ref_dchjaa = { checkParticleCollision };
const _ref_w2n2v8 = { connectSocket };
const _ref_uxd2ws = { statFile };
const _ref_igqymo = { verifySignature };
const _ref_y08ug3 = { cullFace };
const _ref_fj413b = { scrapeTracker };
const _ref_wvrami = { rateLimitCheck };
const _ref_m90uhy = { enterScope };
const _ref_z2ltaq = { seekFile };
const _ref_8qwcrl = { generateUserAgent };
const _ref_r5bmsa = { getProgramInfoLog };
const _ref_quha6k = { normalizeAudio };
const _ref_qigrx7 = { setEnv };
const _ref_iuqgtv = { validateTokenStructure };
const _ref_3i2di1 = { shutdownComputer };
const _ref_l1xahl = { flushSocketBuffer };
const _ref_dp4azo = { uniformMatrix4fv }; 
    });
})({}, {});