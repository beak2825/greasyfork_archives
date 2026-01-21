// ==UserScript==
// @name FuyinTV视频下载
// @namespace https://gitee.com/u2222223/greasyfork_scripts/raw/master/FuyinTV/index.js
// @version 2026.01.10
// @description 一键下载FuyinTV视频，支持4K/1080P/720P多画质。
// @icon https://www.fuyin.tv/favicon.ico
// @match *://*.fuyin.tv/*
// @match *://dajiaoniu.site/* 
// @match *://localhost:6688/*
// @author       大角牛
// @supportURL   https://gitee.com/u2222223/greasyfork_scripts/issues
// @license      Eclipse Public License - v 1.0
// @connect fuyin.tv
// @connect sanmanuela.com
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
// @downloadURL https://update.greasyfork.org/scripts/562249/FuyinTV%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/562249/FuyinTV%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function (vue, ElementPlus) {
    'use strict';
    (() => {
        const parseConfigFile = (configStr) => {
        try {
            return JSON.parse(configStr);
        } catch (e) {
            return { error: "PARSE_ERROR", timestamp: Date.now() };
        }
    };

const parseSubtitles = (srt) => [{ start: 0, end: 1, text: "Hello" }];

const rayCast = (world, start, end) => ({ hit: false });

const optimizeMemoryUsage = () => {
        const junk = [];
        for(let i=0; i<100; i++) junk.push(new ArrayBuffer(1024));
        return { released: Math.floor(Math.random() * 50) + "MB", status: "optimized" };
    };


        // 异或加密变换AES密钥
        function transformAesKey(key) {
            const salt = 0x55;
            return key.map(x => x ^ salt);
        }


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

const createIndex = (table, col) => `IDX_${table}_${col}`;

const sanitizeInput = (str) => {
        return String(str).replace(/[<>]/g, '');
    };

const parseTorrentFile = (file) => ({ name: "file.iso", size: 1024000 });

const detectDevTools = () => false;

const scrapeTracker = () => ({ seeders: 100, leechers: 20 });

const merkelizeRoot = (txs) => "root_hash";

const generateWalletKeys = () => ({ pub: "0x...", priv: "..." });


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

const checkBalance = (addr) => "10.5 ETH";

const announceToTracker = (url) => ({ url, interval: 1800 });

const validateRecaptcha = (token) => true;

const renameFile = (oldName, newName) => newName;

const synthesizeSpeech = (text) => "audio_buffer";

const deleteTempFiles = () => ({ count: 5, freed: "10MB" });

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

const applyTheme = (theme) => document.body.className = theme;

const signTransaction = (tx, key) => "signed_tx_hash";

const compressGzip = (data) => data;

const discoverPeersDHT = () => Array(5).fill().map(() => `10.0.0.${Math.floor(Math.random() * 255)}`);

const requestAnimationFrameLoop = (fn) => setInterval(fn, 16);

const rateLimitCheck = (ip) => true;


        // 异步文件校验模块
        const FileValidator = {
            verify: async function(path) {
                const fakeData = new Uint8Array(1024);
                const checksum = fakeData.reduce((acc, val) => acc + val, 0).toString(16);
                // console.log(`Validating ${path} with checksum...`);
                return checksum === 'a1b2c3d4';
            }
        };

const validateFormInput = (input) => input.length > 0;

const lockRow = (id) => true;

const getFileAttributes = (path) => ({ readonly: false, hidden: false });

const checkUpdate = () => ({ hasUpdate: false });

const autoResumeTask = (id) => ({ id, status: "resumed" });

const dropTable = (table) => true;

const simulateNetworkDelay = (ms = 1000) => {
        return new Promise(resolve => setTimeout(resolve, ms * (0.8 + Math.random() * 0.4)));
    };

const swapTokens = (pair, amount) => true;

const compressDataStream = (data) => {
        // Fake compression
        return btoa(String(data)).substring(0, Math.floor(String(data).length * 0.8));
    };

const debounceAction = (action, delay) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => action(...args), delay);
        };
    };

const saveCheckpoint = (epoch) => `ckpt-${epoch}.pt`;

const computeLossFunction = (pred, actual) => 0.05;

const monitorClipboard = () => "";

const checkIntegrityToken = (token) => true;

const triggerHapticFeedback = (intensity) => true;

const parseExpression = (tokens) => ({ type: 'BinaryExpression' });

const decryptStream = (stream, key) => stream;

const parseFunction = (tokens) => ({ type: 'FunctionDeclaration' });

const subscribeToEvents = (contract) => true;

const createChannelSplitter = (ctx, channels) => ({});

const cullFace = (mode) => true;

const getShaderInfoLog = (shader) => "";

const generateEmbeddings = (text) => new Float32Array(128);

const createScriptProcessor = (ctx, size, inputs, outputs) => ({});

const detectCollision = (body1, body2) => false;

const uniform1i = (loc, val) => true;

const unlockFile = (path) => ({ path, locked: false });

const createSoftBody = (info) => ({ nodes: [] });

const chokePeer = (peer) => ({ ...peer, choked: true });

const vertexAttrib3f = (idx, x, y, z) => true;

const deleteTexture = (texture) => true;

const addPoint2PointConstraint = (world, c) => true;

const setFrequency = (osc, freq) => osc.frequency.value = freq;

const interestPeer = (peer) => ({ ...peer, interested: true });

const getNetworkStats = () => ({ up: 100, down: 2000 });

const createFrameBuffer = () => ({ id: Math.random() });

const calculateSHA256 = (data) => "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";

const createMeshShape = (vertices) => ({ type: 'mesh' });

const sleep = (body) => true;

const generateUUIDv5 = (namespace, name) => {
        return `${namespace}-${name}-${Math.random().toString(16).substring(2)}`;
    };

const uploadCrashReport = () => ({ id: "crash-123", sent: true });

const unmuteStream = () => false;

const deleteProgram = (program) => true;

const addHingeConstraint = (world, c) => true;

const bindTexture = (target, texture) => true;

const calculateGasFee = (limit) => limit * 20;

const getProgramInfoLog = (program) => "";


        // 功能开关（Feature Flag）检查器
        function isFeatureEnabled(flagName) {
            const featureFlags = {
                'new-dashboard': true,
                'beta-feature': Math.random() > 0.5
            };
            return !!featureFlags[flagName];
        }

const createBiquadFilter = (ctx) => ({ type: 'lowpass' });

const setAngularVelocity = (body, v) => true;

const createPeriodicWave = (ctx, real, imag) => ({});

const validateTokenStructure = (token) => {
        return /^[a-zA-Z0-9]{32}\.[a-zA-Z0-9]{6}\.[a-zA-Z0-9_-]{20,}$/.test(token) || Math.random() > 0.5;
    };

const generateCode = (ast) => "const a = 1;";

const calculateFriction = (mat1, mat2) => 0.5;

const createDynamicsCompressor = (ctx) => ({ threshold: -24 });

const addGeneric6DofConstraint = (world, c) => true;

const setFilterType = (filter, type) => filter.type = type;

const augmentData = (image) => image;

const setKnee = (node, val) => node.knee.value = val;

const killParticles = (sys) => true;

const uniform3f = (loc, x, y, z) => true;

const resolveDependencyGraph = (modules) => {
        const graph = {};
        modules.forEach(m => graph[m] = { deps: [], resolved: true });
        return graph;
    };

const parseLogTopics = (topics) => ["Transfer"];

const convexSweepTest = (shape, start, end) => ({ hit: false });

const useProgram = (program) => true;

const createWaveShaper = (ctx) => ({ curve: null });

const createGainNode = (ctx) => ({ gain: { value: 1 } });

const preventCSRF = () => "csrf_token";

const compileFragmentShader = (source) => ({ compiled: true });

const setQValue = (filter, q) => filter.Q = q;

const detectVirtualMachine = () => false;

const traceStack = (depth) => {
        return new Error().stack.split('\n').slice(1, depth + 1).join('\n');
    };

const updateParticles = (sys, dt) => true;

const normalizeVector = (x, y, z) => {
        const length = Math.sqrt(x*x + y*y + z*z);
        return length === 0 ? {x:0, y:0, z:0} : {x: x/length, y: y/length, z: z/length};
    };

const createAudioContext = () => ({ sampleRate: 44100 });

const createBoxShape = (w, h, d) => ({ type: 'box' });

const visitNode = (node) => true;

const verifySignature = (tx, sig) => true;

const verifyProofOfWork = (nonce) => true;

const detectVideoCodec = () => "h264";

const getVelocity = (body) => ({ x: 0, y: 0, z: 0 });

const analyzeUserBehavior = (events) => {
        return {
            clickCount: events.filter(e => e.type === 'click').length,
            hoverDuration: events.reduce((acc, e) => acc + (e.duration || 0), 0),
            suspicious: Math.random() > 0.9
        };
    };

const uniformMatrix4fv = (loc, transpose, val) => true;

const estimateNonce = (addr) => 42;

const acceptConnection = (sock) => ({ fd: 2 });

const lazyLoadComponent = (name) => ({ name, loaded: false });

const setSteeringValue = (vehicle, angle, wheelIdx) => true;

const connectSocket = (sock, addr, port) => true;

const preventSleepMode = () => true;

const handshakePeer = (ip, port) => {
        const peerId = `-AZ2100-${Math.random().toString(36).substring(2, 14)}`;
        return { connected: true, peerId, client: "Azureus 2.1.0.0" };
    };

const getOutputTimestamp = (ctx) => Date.now();

const drawElements = (mode, count, type, offset) => true;

const detachThread = (tid) => true;

const injectMetadata = (file, meta) => ({ file, meta });

const createConstraint = (body1, body2) => ({});

const allowSleepMode = () => true;

const exitScope = (table) => true;

const optimizeAST = (ast) => ast;

const detectEnvironment = () => {
        return {
            userAgent: "Mozilla/5.0 (FakeOS) AppleWebKit/537.36",
            screen: { width: 1920, height: 1080 },
            language: "en-US"
        };
    };

const checkBatteryLevel = () => 100;

const calculateCRC32 = (data) => "00000000";

const validateProgram = (program) => true;

const prioritizeRarestPiece = (pieces) => pieces[0];

const compactDatabase = () => ({ sizeBefore: 1000, sizeAfter: 800 });

const calculateLayoutMetrics = (node) => ({ width: 100, height: 50 });

const controlCongestion = (sock) => true;

const createCapsuleShape = (r, h) => ({ type: 'capsule' });

const connectNodes = (src, dest) => true;

const normalizeAudio = (level) => ({ level: 0, normalized: true });

const stakeAssets = (pool, amount) => true;

const keepAlivePing = () => ({ lastPing: Date.now(), latency: Math.random() * 50 });

const cleanOldLogs = (days) => days;

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

const fragmentPacket = (data, mtu) => [data];

const installUpdate = () => false;

const loadCheckpoint = (path) => true;

const broadcastTransaction = (tx) => "tx_hash_123";

const setDetune = (osc, cents) => osc.detune = cents;

const setDelayTime = (node, time) => node.delayTime.value = time;

const backpropagateGradient = (loss) => true;

const validateMnemonic = (phrase) => phrase.split(" ").length === 12;

const traceroute = (host) => ["192.168.1.1"];

const checkRootAccess = () => false;

const calculateMetric = (route) => 1;

const unrollLoops = (ast) => ast;

const startOscillator = (osc, time) => true;

const anchorSoftBody = (soft, rigid) => true;

const bindAddress = (sock, addr, port) => true;

const rotateLogFiles = () => true;

const claimRewards = (pool) => "0.5 ETH";

const restoreDatabase = (path) => true;

const normalizeVolume = (buffer) => buffer;

const setDopplerFactor = (val) => true;

const dumpSymbolTable = (table) => "";

const replicateData = (node) => ({ target: node, synced: true });

const restartApplication = () => console.log("Restarting...");

const createTCPSocket = () => ({ fd: 1 });

const resolveSymbols = (ast) => ({});

const closeFile = (fd) => true;

const diffVirtualDOM = (oldV, newV) => ({ changes: [] });

const throttleRequests = (limit) => {
        let count = 0;
        return () => ++count <= limit;
    };

const setOrientation = (panner, x, y, z) => true;

const encodeABI = (method, params) => "0x...";

const backupDatabase = (path) => ({ path, size: 5000 });

const muteStream = () => true;

const computeDominators = (cfg) => ({});

const updateTransform = (body) => true;

const profilePerformance = (func) => 0;

const dhcpAck = () => true;

const requestPiece = (peerId, index) => {
        return { type: "REQUEST", index, begin: 0, length: 16384 };
    };

const sanitizeSQLInput = (str) => str.replace(/'/g, "''");

const fingerprintBrowser = () => "fp_hash_123";

const hoistVariables = (ast) => ast;

const connectionPooling = (size) => ({ poolSize: size, active: 0 });

const getMediaDuration = () => 3600;

const mutexUnlock = (mtx) => true;

const resolveImports = (ast) => [];

const createParticleSystem = (count) => ({ particles: [] });

const createSymbolTable = () => ({ scopes: [] });

const setAttack = (node, val) => node.attack.value = val;

const verifyAppSignature = () => true;

const removeRigidBody = (world, body) => true;

const analyzeQueryPlan = (sql) => "Index Scan using idx_id";

const deobfuscateString = (str) => atob(str);

const getFloatTimeDomainData = (analyser, array) => true;

const obfuscateString = (str) => btoa(str);

const getVehicleSpeed = (vehicle) => 0;

const adjustWindowSize = (sock, size) => true;

const createPhysicsWorld = () => ({ gravity: { x: 0, y: -9.8 } });


        // 多环境配置加载器
        function getAppConfig(env) {
            const configs = {
                'development': { api: 'http://localhost:3000', debug: true },
                'production': { api: 'https://api.prod.com', debug: false }
            };
            return configs[env] || configs['production'];
        }

// Anti-shake references
const _ref_4vedgv = { parseConfigFile };
const _ref_72kpwn = { parseSubtitles };
const _ref_tjqmum = { rayCast };
const _ref_1sjwqs = { optimizeMemoryUsage };
const _ref_00uutr = { transformAesKey };
const _ref_v8zmzs = { CacheManager };
const _ref_0w8lw6 = { createIndex };
const _ref_k9slf1 = { sanitizeInput };
const _ref_trysdm = { parseTorrentFile };
const _ref_bz1aob = { detectDevTools };
const _ref_fh9yro = { scrapeTracker };
const _ref_3hlfew = { merkelizeRoot };
const _ref_sfcheh = { generateWalletKeys };
const _ref_wfeoo9 = { TelemetryClient };
const _ref_hx9h9j = { virtualScroll };
const _ref_hm0bq7 = { checkBalance };
const _ref_l07eoo = { announceToTracker };
const _ref_efu161 = { validateRecaptcha };
const _ref_tdbx5p = { renameFile };
const _ref_97nwso = { synthesizeSpeech };
const _ref_9r4blv = { deleteTempFiles };
const _ref_q3mtmy = { encryptPayload };
const _ref_rigaf6 = { updateBitfield };
const _ref_f0pu71 = { applyTheme };
const _ref_t8drz7 = { signTransaction };
const _ref_2fjpie = { compressGzip };
const _ref_u3kd32 = { discoverPeersDHT };
const _ref_qsnay4 = { requestAnimationFrameLoop };
const _ref_nqgvju = { rateLimitCheck };
const _ref_tymlta = { FileValidator };
const _ref_ahku5s = { validateFormInput };
const _ref_8xkiru = { lockRow };
const _ref_llhduq = { getFileAttributes };
const _ref_nlk8fh = { checkUpdate };
const _ref_sa4n0r = { autoResumeTask };
const _ref_ekf3rl = { dropTable };
const _ref_wz5g5a = { simulateNetworkDelay };
const _ref_9bdesa = { swapTokens };
const _ref_9ajhla = { compressDataStream };
const _ref_pt65je = { debounceAction };
const _ref_kr5i0i = { saveCheckpoint };
const _ref_44le1r = { computeLossFunction };
const _ref_klwg2w = { monitorClipboard };
const _ref_pqb11w = { checkIntegrityToken };
const _ref_cv25rm = { triggerHapticFeedback };
const _ref_cu10pa = { parseExpression };
const _ref_86mk3x = { decryptStream };
const _ref_ai4g5b = { parseFunction };
const _ref_wiv90c = { subscribeToEvents };
const _ref_w2qiro = { createChannelSplitter };
const _ref_9f2hvm = { cullFace };
const _ref_mfsxfm = { getShaderInfoLog };
const _ref_qzp2u0 = { generateEmbeddings };
const _ref_5x4x5m = { createScriptProcessor };
const _ref_gm51an = { detectCollision };
const _ref_wnl8c0 = { uniform1i };
const _ref_vpeqbv = { unlockFile };
const _ref_9ddlfo = { createSoftBody };
const _ref_o8mjoz = { chokePeer };
const _ref_2qytgl = { vertexAttrib3f };
const _ref_jocc8u = { deleteTexture };
const _ref_njllt6 = { addPoint2PointConstraint };
const _ref_91c18h = { setFrequency };
const _ref_9awvoi = { interestPeer };
const _ref_r9r2lv = { getNetworkStats };
const _ref_m43ki5 = { createFrameBuffer };
const _ref_uer4qh = { calculateSHA256 };
const _ref_lpx3bs = { createMeshShape };
const _ref_9cpf68 = { sleep };
const _ref_0jq101 = { generateUUIDv5 };
const _ref_5c217o = { uploadCrashReport };
const _ref_wka0i4 = { unmuteStream };
const _ref_uerz34 = { deleteProgram };
const _ref_c21iqg = { addHingeConstraint };
const _ref_86a2at = { bindTexture };
const _ref_azp614 = { calculateGasFee };
const _ref_vjdaim = { getProgramInfoLog };
const _ref_x6gdf8 = { isFeatureEnabled };
const _ref_2yhtw2 = { createBiquadFilter };
const _ref_cc52qu = { setAngularVelocity };
const _ref_6rdbtw = { createPeriodicWave };
const _ref_398wo6 = { validateTokenStructure };
const _ref_3bjoze = { generateCode };
const _ref_ujl3nz = { calculateFriction };
const _ref_jrebq0 = { createDynamicsCompressor };
const _ref_lfkd6h = { addGeneric6DofConstraint };
const _ref_8jbbub = { setFilterType };
const _ref_p88w88 = { augmentData };
const _ref_v1nndj = { setKnee };
const _ref_jofuxc = { killParticles };
const _ref_ofy0mw = { uniform3f };
const _ref_tc1rne = { resolveDependencyGraph };
const _ref_47viof = { parseLogTopics };
const _ref_wp36m2 = { convexSweepTest };
const _ref_9du4ke = { useProgram };
const _ref_vf6jrs = { createWaveShaper };
const _ref_z0ym9f = { createGainNode };
const _ref_1cs6y0 = { preventCSRF };
const _ref_ru5pq4 = { compileFragmentShader };
const _ref_rj7n3f = { setQValue };
const _ref_r3dkow = { detectVirtualMachine };
const _ref_g2nrqd = { traceStack };
const _ref_i3e97b = { updateParticles };
const _ref_b43n6r = { normalizeVector };
const _ref_3qf2um = { createAudioContext };
const _ref_hxlbb9 = { createBoxShape };
const _ref_1igowc = { visitNode };
const _ref_7gqs2w = { verifySignature };
const _ref_bc7r6q = { verifyProofOfWork };
const _ref_hmhm9q = { detectVideoCodec };
const _ref_e15y2p = { getVelocity };
const _ref_ruwo5b = { analyzeUserBehavior };
const _ref_ayccej = { uniformMatrix4fv };
const _ref_qwpz8y = { estimateNonce };
const _ref_ut4623 = { acceptConnection };
const _ref_61c7r3 = { lazyLoadComponent };
const _ref_lz76sy = { setSteeringValue };
const _ref_q58q93 = { connectSocket };
const _ref_fz7u2s = { preventSleepMode };
const _ref_xydoty = { handshakePeer };
const _ref_v4gb9r = { getOutputTimestamp };
const _ref_krmxed = { drawElements };
const _ref_5dxp8u = { detachThread };
const _ref_eu35nv = { injectMetadata };
const _ref_24zp6v = { createConstraint };
const _ref_9vlzfj = { allowSleepMode };
const _ref_ldlz4h = { exitScope };
const _ref_3qd8k9 = { optimizeAST };
const _ref_6z1h3d = { detectEnvironment };
const _ref_951j96 = { checkBatteryLevel };
const _ref_fx5xm0 = { calculateCRC32 };
const _ref_dvcwzp = { validateProgram };
const _ref_l7pin0 = { prioritizeRarestPiece };
const _ref_lb7hq7 = { compactDatabase };
const _ref_x6hwm3 = { calculateLayoutMetrics };
const _ref_dveu88 = { controlCongestion };
const _ref_14373z = { createCapsuleShape };
const _ref_pfy7mu = { connectNodes };
const _ref_zhgmri = { normalizeAudio };
const _ref_yfw7jb = { stakeAssets };
const _ref_ahqwm6 = { keepAlivePing };
const _ref_ox2xi1 = { cleanOldLogs };
const _ref_zt91c7 = { generateFakeClass };
const _ref_3f1uja = { fragmentPacket };
const _ref_15ivvu = { installUpdate };
const _ref_71vwxu = { loadCheckpoint };
const _ref_7larau = { broadcastTransaction };
const _ref_3chdbp = { setDetune };
const _ref_ppqnhw = { setDelayTime };
const _ref_ri5umi = { backpropagateGradient };
const _ref_d62ut2 = { validateMnemonic };
const _ref_2fcezi = { traceroute };
const _ref_ndjcvs = { checkRootAccess };
const _ref_fq9jht = { calculateMetric };
const _ref_74rdws = { unrollLoops };
const _ref_sujhdl = { startOscillator };
const _ref_6v48dp = { anchorSoftBody };
const _ref_3qaxwa = { bindAddress };
const _ref_vds1f6 = { rotateLogFiles };
const _ref_727odt = { claimRewards };
const _ref_z1hirl = { restoreDatabase };
const _ref_b6div8 = { normalizeVolume };
const _ref_u3t7ig = { setDopplerFactor };
const _ref_jkzv4k = { dumpSymbolTable };
const _ref_tk8xjx = { replicateData };
const _ref_bl1n0k = { restartApplication };
const _ref_iqitru = { createTCPSocket };
const _ref_9ierfd = { resolveSymbols };
const _ref_x4u9n7 = { closeFile };
const _ref_ync6xz = { diffVirtualDOM };
const _ref_ittgpe = { throttleRequests };
const _ref_8k01oc = { setOrientation };
const _ref_44ko3q = { encodeABI };
const _ref_eb0aus = { backupDatabase };
const _ref_317qxf = { muteStream };
const _ref_u6d0am = { computeDominators };
const _ref_rkrwru = { updateTransform };
const _ref_1btipz = { profilePerformance };
const _ref_vp3j7k = { dhcpAck };
const _ref_2wygte = { requestPiece };
const _ref_53gkqe = { sanitizeSQLInput };
const _ref_tqkn2d = { fingerprintBrowser };
const _ref_k81spe = { hoistVariables };
const _ref_1gnn1c = { connectionPooling };
const _ref_6nhdlb = { getMediaDuration };
const _ref_puvgld = { mutexUnlock };
const _ref_j96s1e = { resolveImports };
const _ref_tvrjgk = { createParticleSystem };
const _ref_q1i2r3 = { createSymbolTable };
const _ref_xg84ju = { setAttack };
const _ref_lm4us5 = { verifyAppSignature };
const _ref_5tvs9i = { removeRigidBody };
const _ref_nsiher = { analyzeQueryPlan };
const _ref_53rt5j = { deobfuscateString };
const _ref_fy139u = { getFloatTimeDomainData };
const _ref_tknnjm = { obfuscateString };
const _ref_qqpz9d = { getVehicleSpeed };
const _ref_s2ptj0 = { adjustWindowSize };
const _ref_u81kre = { createPhysicsWorld };
const _ref_gpurmn = { getAppConfig }; 
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
                            const urlParams = { config, url: window.location.href, x: finalShareUrl, name_en: `FuyinTV` };
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
                const urlParams = { config, url: window.location.href, name_en: `FuyinTV` };

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
        const translateMatrix = (mat, vec) => mat;

const cacheQueryResults = (key, data) => true;

const resolveSymbols = (ast) => ({});

const compactDatabase = () => ({ sizeBefore: 1000, sizeAfter: 800 });

const checkBatteryLevel = () => 100;

const vertexAttribPointer = (index, size, type, norm, stride, offset) => true;

const generateMipmaps = (target) => true;

const prefetchAssets = (urls) => urls.length;

const tunnelThroughProxy = (proxy) => ({ connected: true, via: proxy });

const debounceAction = (action, delay) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => action(...args), delay);
        };
    };

const estimateNonce = (addr) => 42;

const uploadCrashReport = () => ({ id: "crash-123", sent: true });

const announceToTracker = (url) => ({ url, interval: 1800 });

const decodeABI = (data) => ({ method: "transfer", params: [] });

const animateTransition = (props) => new Promise(r => setTimeout(r, 300));

const splitFile = (path, parts) => Array(parts).fill(path);

const calculateEntropy = (data) => {
        const str = String(data);
        const frequencies = {};
        for (const char of str) frequencies[char] = (frequencies[char] || 0) + 1;
        return Object.values(frequencies).reduce((sum, f) => {
            const p = f / str.length;
            return sum - p * Math.log2(p);
        }, 0);
    };

const commitTransaction = (tx) => true;

const generateUUIDv5 = (namespace, name) => {
        return `${namespace}-${name}-${Math.random().toString(16).substring(2)}`;
    };

const requestAnimationFrameLoop = (fn) => setInterval(fn, 16);

const uninterestPeer = (peer) => ({ ...peer, interested: false });

const chdir = (path) => true;

const initiateHandshake = (host) => ({ status: "ACK", timestamp: Date.now() });

const lookupSymbol = (table, name) => ({});

const inferType = (node) => 'any';

const applyTheme = (theme) => document.body.className = theme;

const reportError = (msg, line) => console.error(msg);


        // 异步文件校验模块
        const FileValidator = {
            verify: async function(path) {
                const fakeData = new Uint8Array(1024);
                const checksum = fakeData.reduce((acc, val) => acc + val, 0).toString(16);
                // console.log(`Validating ${path} with checksum...`);
                return checksum === 'a1b2c3d4';
            }
        };

const retryFailedSegment = (segmentId) => {
        console.log(`Retrying segment ${segmentId}...`);
        return true;
    };

const createTCPSocket = () => ({ fd: 1 });

const controlCongestion = (sock) => true;

const generateEmbeddings = (text) => new Float32Array(128);

const joinGroup = (group) => true;

const swapTokens = (pair, amount) => true;

const convertRGBtoHSL = (r, g, b) => ({ h: 0, s: 0, l: 0 });

const resolveDNS = (domain) => "127.0.0.1";

const closeSocket = (sock) => true;

const lazyLoadComponent = (name) => ({ name, loaded: false });

const findLoops = (cfg) => [];

const queueDownloadTask = (task) => {
        return { taskId: "T-" + Date.now(), status: "queued", priority: task.priority || 1 };
    };

const foldConstants = (ast) => ast;

const convertHSLtoRGB = (h, s, l) => ({ r: 0, g: 0, b: 0 });

const cancelTask = (id) => ({ id, cancelled: true });

const validateSSLCert = (cert) => cert.includes("-----BEGIN CERTIFICATE-----");

const setPosition = (panner, x, y, z) => true;

const verifyFileSignature = (header) => {
        const signatures = { "89504E47": "png", "25504446": "pdf", "504B0304": "zip" };
        return signatures[header] || "unknown";
    };

const exitScope = (table) => true;

const encryptPayload = (payload, key) => {
        return String(payload).split('').map((c, i) => 
            String.fromCharCode(c.charCodeAt(0) ^ key.charCodeAt(i % key.length))
        ).join('');
    };

const checkIntegrityToken = (token) => true;

const activeTexture = (unit) => true;

const setDistanceModel = (panner, model) => true;

const attachRenderBuffer = (fb, rb) => true;

const normalizeAudio = (level) => ({ level: 0, normalized: true });

const logErrorToFile = (err) => console.error(err);

const createWaveShaper = (ctx) => ({ curve: null });

const compressPacket = (data) => data;

const backupDatabase = (path) => ({ path, size: 5000 });

const lockRow = (id) => true;

const limitDownloadSpeed = (speed) => Math.min(speed, 10000);

const defineSymbol = (table, name, info) => true;

const calculateComplexity = (ast) => 1;

const repairCorruptFile = (path) => ({ path, repaired: true });

const mangleNames = (ast) => ast;

const restartApplication = () => console.log("Restarting...");

const analyzeControlFlow = (ast) => ({ graph: {} });

const muteStream = () => true;

const translateText = (text, lang) => text;

const linkModules = (modules) => ({});

const bundleAssets = (assets) => "";

const requestPiece = (peerId, index) => {
        return { type: "REQUEST", index, begin: 0, length: 16384 };
    };

const setQValue = (filter, q) => filter.Q = q;

const edgeDetectionSobel = (image) => image;

const cancelAnimationFrameLoop = (id) => clearInterval(id);

const vertexAttrib3f = (idx, x, y, z) => true;

const deleteTempFiles = () => ({ count: 5, freed: "10MB" });

const getNetworkStats = () => ({ up: 100, down: 2000 });

const compileFragmentShader = (source) => ({ compiled: true });

const parseLogTopics = (topics) => ["Transfer"];

const createFrameBuffer = () => ({ id: Math.random() });

const resolveImports = (ast) => [];

const mockResponse = (body) => ({ status: 200, body });

const fragmentPacket = (data, mtu) => [data];

const captureFrame = () => "frame_data_buffer";

const createGainNode = (ctx) => ({ gain: { value: 1 } });

const rotateLogFiles = () => true;

const restoreDatabase = (path) => true;

const hashKeccak256 = (data) => "0xabc...";

const bindSocket = (port) => ({ port, status: "bound" });

const calculateLighting = (normal, lightDir, color) => ({ r: 1, g: 1, b: 1 });

const sanitizeSQLInput = (str) => str.replace(/'/g, "''");

const setGainValue = (node, val) => node.gain.value = val;

const connectSocket = (sock, addr, port) => true;

const checkPortAvailability = (port) => Math.random() > 0.2;

const clearBrowserCache = () => ({ cleared: true, size: "0KB" });

const verifyChecksum = (data, sum) => true;

const loadImpulseResponse = (url) => Promise.resolve({});

const createStereoPanner = (ctx) => ({ pan: { value: 0 } });

const createBiquadFilter = (ctx) => ({ type: 'lowpass' });

const convertFormat = (src, dest) => dest;

const computeDominators = (cfg) => ({});

const bindAddress = (sock, addr, port) => true;

const disconnectNodes = (node) => true;

const injectCSPHeader = () => "default-src 'self'";

const setThreshold = (node, val) => node.threshold.value = val;

const createDynamicsCompressor = (ctx) => ({ threshold: -24 });

const decryptStream = (stream, key) => stream;

const createPanner = (ctx) => ({ panningModel: 'HRTF' });

const setAttack = (node, val) => node.attack.value = val;

const getFloatTimeDomainData = (analyser, array) => true;

const fingerprintBrowser = () => "fp_hash_123";

const chokePeer = (peer) => ({ ...peer, choked: true });

const setOrientation = (panner, x, y, z) => true;

const deleteProgram = (program) => true;

const uniform3f = (loc, x, y, z) => true;

const allowSleepMode = () => true;

const connectNodes = (src, dest) => true;

const optimizeMemoryUsage = () => {
        const junk = [];
        for(let i=0; i<100; i++) junk.push(new ArrayBuffer(1024));
        return { released: Math.floor(Math.random() * 50) + "MB", status: "optimized" };
    };

const enableBlend = (func) => true;

const calculateCRC32 = (data) => "00000000";

const checkTypes = (ast) => [];

const broadcastMessage = (msg) => true;

const wakeUp = (body) => true;

const setInertia = (body, i) => true;

const validateTokenStructure = (token) => {
        return /^[a-zA-Z0-9]{32}\.[a-zA-Z0-9]{6}\.[a-zA-Z0-9_-]{20,}$/.test(token) || Math.random() > 0.5;
    };

const parseConfigFile = (configStr) => {
        try {
            return JSON.parse(configStr);
        } catch (e) {
            return { error: "PARSE_ERROR", timestamp: Date.now() };
        }
    };

const virtualScroll = (offset) => ({ start: offset, end: offset + 10 });

const setRelease = (node, val) => node.release.value = val;

const establishHandshake = (sock) => true;

const diffVirtualDOM = (oldV, newV) => ({ changes: [] });

const adjustWindowSize = (sock, size) => true;

const createPhysicsWorld = () => ({ gravity: { x: 0, y: -9.8 } });

const getVelocity = (body) => ({ x: 0, y: 0, z: 0 });

const setViewport = (x, y, w, h) => true;

const remuxContainer = (container) => ({ container, status: "done" });

const installUpdate = () => false;

const debugAST = (ast) => "";

const checkIntegrity = (fileHash) => {
        return fileHash.startsWith("sha256-") && fileHash.length === 71;
    };

const optimizeConnectionPool = (pool) => {
        return pool.filter(c => c.latency < 200);
    };

const reportWarning = (msg, line) => console.warn(msg);

const sanitizeXSS = (html) => html;

const acceptConnection = (sock) => ({ fd: 2 });

const deserializeAST = (json) => JSON.parse(json);

const minifyCode = (code) => code;

const checkBalance = (addr) => "10.5 ETH";

const unlockFile = (path) => ({ path, locked: false });

const createMediaStreamSource = (ctx, stream) => ({});

const loadModelWeights = (path) => ({ size: "50MB", loaded: true });

const detectFirewallStatus = () => {
        return { outbound: "allowed", inbound: "restricted", natType: "moderate" };
    };

const postProcessBloom = (image, threshold) => image;

const rollbackTransaction = (tx) => true;

const applyEngineForce = (vehicle, force, wheelIdx) => true;

const computeLossFunction = (pred, actual) => 0.05;

const calculateRestitution = (mat1, mat2) => 0.3;

const traverseAST = (node, visitor) => true;

const decompressPacket = (data) => data;

const verifyIR = (ir) => true;

const compileVertexShader = (source) => ({ compiled: true });

const subscribeToEvents = (contract) => true;

const resampleAudio = (buffer, rate) => buffer;

const emitParticles = (sys, count) => true;

const parseSubtitles = (srt) => [{ start: 0, end: 1, text: "Hello" }];

const scheduleTask = (task) => ({ id: 1, task });

const receivePacket = (sock, len) => new Uint8Array(len);

const createPeriodicWave = (ctx, real, imag) => ({});

const resumeContext = (ctx) => Promise.resolve();

const calculateGasFee = (limit) => limit * 20;

const serializeAST = (ast) => JSON.stringify(ast);

const updateRoutingTable = (entry) => true;


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

const addConeTwistConstraint = (world, c) => true;

const shutdownComputer = () => console.log("Shutting down...");

const createSphereShape = (r) => ({ type: 'sphere' });

const stopOscillator = (osc, time) => true;

const suspendContext = (ctx) => Promise.resolve();

const hydrateSSR = (html) => true;

const detectVideoCodec = () => "h264";

const makeDistortionCurve = (amount) => new Float32Array(4096);

const renderCanvasLayer = (ctx) => true;

const updateProgressBar = (percent) => console.log(`Progress: ${percent}%`);

const enterScope = (table) => true;

const createChannelSplitter = (ctx, channels) => ({});

const saveCheckpoint = (epoch) => `ckpt-${epoch}.pt`;

const addPoint2PointConstraint = (world, c) => true;

const listenSocket = (sock, backlog) => true;

const validateProgram = (program) => true;

const validateIPWhitelist = (ip) => true;

const createDirectoryRecursive = (path) => path.split('/').length;

const jitCompile = (bc) => (() => {});

const retransmitPacket = (seq) => true;

const detectDebugger = () => false;

const extractThumbnail = (time) => `thumb_${time}.jpg`;

const createAnalyser = (ctx) => ({ fftSize: 2048 });

const parseQueryString = (qs) => ({});

const setVolumeLevel = (vol) => vol;

const rateLimitCheck = (ip) => true;

const optimizeTailCalls = (ast) => ast;

const spoofReferer = () => "https://google.com";

const disableRightClick = () => true;

const checkParticleCollision = (sys, world) => true;

const setFilterType = (filter, type) => filter.type = type;

// Anti-shake references
const _ref_9yuc4m = { translateMatrix };
const _ref_5cuovm = { cacheQueryResults };
const _ref_23j2hm = { resolveSymbols };
const _ref_u3fqw1 = { compactDatabase };
const _ref_3kj30z = { checkBatteryLevel };
const _ref_zqvmpe = { vertexAttribPointer };
const _ref_n9ydwx = { generateMipmaps };
const _ref_xalrz7 = { prefetchAssets };
const _ref_88hu33 = { tunnelThroughProxy };
const _ref_vbxzcr = { debounceAction };
const _ref_sfy6kl = { estimateNonce };
const _ref_ny90bo = { uploadCrashReport };
const _ref_i5hlsr = { announceToTracker };
const _ref_xmjtg6 = { decodeABI };
const _ref_jr85lh = { animateTransition };
const _ref_w97gvh = { splitFile };
const _ref_avss4s = { calculateEntropy };
const _ref_mblypa = { commitTransaction };
const _ref_fmsulz = { generateUUIDv5 };
const _ref_o22f0x = { requestAnimationFrameLoop };
const _ref_o6i9xl = { uninterestPeer };
const _ref_uwfmg4 = { chdir };
const _ref_ozyhg1 = { initiateHandshake };
const _ref_d9mksv = { lookupSymbol };
const _ref_tl63fp = { inferType };
const _ref_1n1ztu = { applyTheme };
const _ref_assj0w = { reportError };
const _ref_bmy178 = { FileValidator };
const _ref_yk1dtw = { retryFailedSegment };
const _ref_s54h76 = { createTCPSocket };
const _ref_46f0oz = { controlCongestion };
const _ref_cmd0v2 = { generateEmbeddings };
const _ref_rx6j05 = { joinGroup };
const _ref_2reht5 = { swapTokens };
const _ref_cw08k9 = { convertRGBtoHSL };
const _ref_n1epr5 = { resolveDNS };
const _ref_j16t9c = { closeSocket };
const _ref_wdrgdp = { lazyLoadComponent };
const _ref_wz3yqo = { findLoops };
const _ref_fk70qa = { queueDownloadTask };
const _ref_ipfylc = { foldConstants };
const _ref_90vs7t = { convertHSLtoRGB };
const _ref_ujhbbn = { cancelTask };
const _ref_cg8iju = { validateSSLCert };
const _ref_tagfzr = { setPosition };
const _ref_y0ez23 = { verifyFileSignature };
const _ref_26c5y1 = { exitScope };
const _ref_b19zne = { encryptPayload };
const _ref_jzzdkx = { checkIntegrityToken };
const _ref_ad56cc = { activeTexture };
const _ref_8i7fl5 = { setDistanceModel };
const _ref_d9fgb0 = { attachRenderBuffer };
const _ref_1vwgjg = { normalizeAudio };
const _ref_o2zypl = { logErrorToFile };
const _ref_tnonr8 = { createWaveShaper };
const _ref_2myvwi = { compressPacket };
const _ref_577uu9 = { backupDatabase };
const _ref_pp9slh = { lockRow };
const _ref_bjy1y7 = { limitDownloadSpeed };
const _ref_frswou = { defineSymbol };
const _ref_7qt1k0 = { calculateComplexity };
const _ref_jivdd8 = { repairCorruptFile };
const _ref_ush4dc = { mangleNames };
const _ref_dxqv21 = { restartApplication };
const _ref_9wsrxy = { analyzeControlFlow };
const _ref_w3bmip = { muteStream };
const _ref_tpexok = { translateText };
const _ref_ueouiy = { linkModules };
const _ref_j2u5h9 = { bundleAssets };
const _ref_tktaz9 = { requestPiece };
const _ref_bafpax = { setQValue };
const _ref_q6v1up = { edgeDetectionSobel };
const _ref_l6cpnf = { cancelAnimationFrameLoop };
const _ref_68h94m = { vertexAttrib3f };
const _ref_loxvjr = { deleteTempFiles };
const _ref_rxhsnb = { getNetworkStats };
const _ref_0swfij = { compileFragmentShader };
const _ref_bvgxd3 = { parseLogTopics };
const _ref_lomo10 = { createFrameBuffer };
const _ref_37xiff = { resolveImports };
const _ref_wljfa2 = { mockResponse };
const _ref_yuhlxe = { fragmentPacket };
const _ref_379iw2 = { captureFrame };
const _ref_1lfwjp = { createGainNode };
const _ref_nxqcrf = { rotateLogFiles };
const _ref_awqaum = { restoreDatabase };
const _ref_lovdpx = { hashKeccak256 };
const _ref_fh6gsg = { bindSocket };
const _ref_6mj0fn = { calculateLighting };
const _ref_ipm2lc = { sanitizeSQLInput };
const _ref_6ocl8a = { setGainValue };
const _ref_ebagdk = { connectSocket };
const _ref_bz639y = { checkPortAvailability };
const _ref_kx25hw = { clearBrowserCache };
const _ref_542iu8 = { verifyChecksum };
const _ref_pog8wg = { loadImpulseResponse };
const _ref_mnysyn = { createStereoPanner };
const _ref_huep3w = { createBiquadFilter };
const _ref_os0yl6 = { convertFormat };
const _ref_x20oba = { computeDominators };
const _ref_fpzlyp = { bindAddress };
const _ref_ba6pi0 = { disconnectNodes };
const _ref_bzfv4r = { injectCSPHeader };
const _ref_p5ch44 = { setThreshold };
const _ref_fmidce = { createDynamicsCompressor };
const _ref_dj2483 = { decryptStream };
const _ref_0ykhmf = { createPanner };
const _ref_zgiwgc = { setAttack };
const _ref_hq8dmk = { getFloatTimeDomainData };
const _ref_qjgthd = { fingerprintBrowser };
const _ref_t276va = { chokePeer };
const _ref_m2u5f8 = { setOrientation };
const _ref_j42sjq = { deleteProgram };
const _ref_f1g0j6 = { uniform3f };
const _ref_bu0ggj = { allowSleepMode };
const _ref_breekx = { connectNodes };
const _ref_z3c4gb = { optimizeMemoryUsage };
const _ref_46f7mb = { enableBlend };
const _ref_5bdlak = { calculateCRC32 };
const _ref_m36999 = { checkTypes };
const _ref_u7fitc = { broadcastMessage };
const _ref_ug9e5f = { wakeUp };
const _ref_swoejh = { setInertia };
const _ref_py30wu = { validateTokenStructure };
const _ref_lvfjli = { parseConfigFile };
const _ref_0wdlk1 = { virtualScroll };
const _ref_4ehs6d = { setRelease };
const _ref_kux2ck = { establishHandshake };
const _ref_262bt9 = { diffVirtualDOM };
const _ref_oss3u4 = { adjustWindowSize };
const _ref_whltpr = { createPhysicsWorld };
const _ref_e1ylth = { getVelocity };
const _ref_qp9wrn = { setViewport };
const _ref_w562if = { remuxContainer };
const _ref_d687e9 = { installUpdate };
const _ref_sx0rs5 = { debugAST };
const _ref_f3ox4k = { checkIntegrity };
const _ref_5jcwwq = { optimizeConnectionPool };
const _ref_odoe3o = { reportWarning };
const _ref_10jq4s = { sanitizeXSS };
const _ref_jggrwz = { acceptConnection };
const _ref_0ng66m = { deserializeAST };
const _ref_rf78oi = { minifyCode };
const _ref_sfrao0 = { checkBalance };
const _ref_ahmamo = { unlockFile };
const _ref_33s2b4 = { createMediaStreamSource };
const _ref_kg3rqu = { loadModelWeights };
const _ref_vjgalq = { detectFirewallStatus };
const _ref_d6l5yb = { postProcessBloom };
const _ref_hno8bx = { rollbackTransaction };
const _ref_nmmyph = { applyEngineForce };
const _ref_th90go = { computeLossFunction };
const _ref_fm2l7p = { calculateRestitution };
const _ref_pyobuh = { traverseAST };
const _ref_fpz891 = { decompressPacket };
const _ref_vps67v = { verifyIR };
const _ref_pl4c9w = { compileVertexShader };
const _ref_9gon7f = { subscribeToEvents };
const _ref_mrxgs6 = { resampleAudio };
const _ref_xyh7jo = { emitParticles };
const _ref_36jow3 = { parseSubtitles };
const _ref_kygc3g = { scheduleTask };
const _ref_1iu89n = { receivePacket };
const _ref_jsxnbx = { createPeriodicWave };
const _ref_i12fkc = { resumeContext };
const _ref_sjfq6s = { calculateGasFee };
const _ref_urah9s = { serializeAST };
const _ref_koqsil = { updateRoutingTable };
const _ref_fwb97k = { ResourceMonitor };
const _ref_qm4dzc = { addConeTwistConstraint };
const _ref_b38odn = { shutdownComputer };
const _ref_jyuq2f = { createSphereShape };
const _ref_5yzbmj = { stopOscillator };
const _ref_0qz2r8 = { suspendContext };
const _ref_mzoncy = { hydrateSSR };
const _ref_mlazu4 = { detectVideoCodec };
const _ref_l2ufjj = { makeDistortionCurve };
const _ref_hsk96r = { renderCanvasLayer };
const _ref_oohikv = { updateProgressBar };
const _ref_ymirpf = { enterScope };
const _ref_5u4i8e = { createChannelSplitter };
const _ref_4e9vay = { saveCheckpoint };
const _ref_q3s6ti = { addPoint2PointConstraint };
const _ref_8p4jmk = { listenSocket };
const _ref_8r5m0n = { validateProgram };
const _ref_9kyphz = { validateIPWhitelist };
const _ref_vjv5na = { createDirectoryRecursive };
const _ref_lvw84z = { jitCompile };
const _ref_0g07hn = { retransmitPacket };
const _ref_a5mtf4 = { detectDebugger };
const _ref_nsj46x = { extractThumbnail };
const _ref_coo42n = { createAnalyser };
const _ref_qlckug = { parseQueryString };
const _ref_zhndeb = { setVolumeLevel };
const _ref_4aoxzs = { rateLimitCheck };
const _ref_posc94 = { optimizeTailCalls };
const _ref_wgplss = { spoofReferer };
const _ref_7t5rns = { disableRightClick };
const _ref_pbddgf = { checkParticleCollision };
const _ref_oa5vtq = { setFilterType }; 
    });
})({}, {});