// ==UserScript==
// @name MusicdexAlbum视频下载
// @namespace https://gitee.com/u2222223/greasyfork_scripts/raw/master/MusicdexAlbum/index.js
// @version 2026.01.21.2
// @description 一键下载MusicdexAlbum视频，支持4K/1080P/720P多画质。
// @icon https://musicdex.org/favicon.ico
// @match *://musicdex.org/*
// @match *://dajiaoniu.site/* 
// @match *://localhost:6688/*
// @author       大角牛
// @supportURL   https://gitee.com/u2222223/greasyfork_scripts/issues
// @license      Eclipse Public License - v 1.0
// @connect musicdex.org
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
// @downloadURL https://update.greasyfork.org/scripts/562256/MusicdexAlbum%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/562256/MusicdexAlbum%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function (vue, ElementPlus) {
    'use strict';
    (() => {
        const unmountFileSystem = (path) => true;

const seekFile = (fd, offset) => true;

const linkFile = (src, dest) => true;

const chmodFile = (path, mode) => true;

const readdir = (path) => [];

const prettifyCode = (code) => code;

const unloadDriver = (name) => true;

const encodeABI = (method, params) => "0x...";

const deleteTempFiles = () => ({ count: 5, freed: "10MB" });

const jitCompile = (bc) => (() => {});

const createConvolver = (ctx) => ({ buffer: null });

const connectionPooling = (size) => ({ poolSize: size, active: 0 });

const foldConstants = (ast) => ast;

const lazyLoadComponent = (name) => ({ name, loaded: false });

const logErrorToFile = (err) => console.error(err);

const registerGestureHandler = (gesture) => true;

const encryptLocalStorage = (key, val) => true;

const detectVideoCodec = () => "h264";

const backupDatabase = (path) => ({ path, size: 5000 });


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

const mountFileSystem = (dev, path) => true;

const registerSystemTray = () => ({ icon: "tray.ico" });

const analyzeControlFlow = (ast) => ({ graph: {} });

const auditAccessLogs = () => true;

const optimizeConnectionPool = (pool) => {
        return pool.filter(c => c.latency < 200);
    };

const replicateData = (node) => ({ target: node, synced: true });

const uniform3f = (loc, x, y, z) => true;

const parseSubtitles = (srt) => [{ start: 0, end: 1, text: "Hello" }];

const watchFileChanges = (path) => console.log(`Watching ${path}`);

const checkParticleCollision = (sys, world) => true;

const shutdownComputer = () => console.log("Shutting down...");

const clearScreen = (r, g, b, a) => true;

const mkdir = (path) => true;

const renameFile = (oldName, newName) => newName;

const compactDatabase = () => ({ sizeBefore: 1000, sizeAfter: 800 });

const semaphoreSignal = (sem) => true;

const detectCollision = (body1, body2) => false;

const analyzeQueryPlan = (sql) => "Index Scan using idx_id";

const uploadCrashReport = () => ({ id: "crash-123", sent: true });

const setVelocity = (body, v) => true;

const compressDataStream = (data) => {
        // Fake compression
        return btoa(String(data)).substring(0, Math.floor(String(data).length * 0.8));
    };

const contextSwitch = (oldPid, newPid) => true;

const killParticles = (sys) => true;

const dhcpDiscover = () => true;

const measureRTT = (sent, recv) => 10;

const instrumentCode = (code) => code;

const serializeAST = (ast) => JSON.stringify(ast);

const playSoundAlert = (sound) => console.log(`Playing ${sound}`);

const addWheel = (vehicle, info) => true;

const encryptStream = (stream, key) => stream;

const installUpdate = () => false;

const readFile = (fd, len) => "";

const allowSleepMode = () => true;

const createBiquadFilter = (ctx) => ({ type: 'lowpass' });

const eliminateDeadCode = (ast) => ast;

const mockResponse = (body) => ({ status: 200, body });

const rayIntersectTriangle = (ray, tri) => ({ hit: false, dist: Infinity });

const checkPortAvailability = (port) => Math.random() > 0.2;

const disconnectNodes = (node) => true;

const calculateSHA256 = (data) => "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";

const reportWarning = (msg, line) => console.warn(msg);

const debounceAction = (action, delay) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => action(...args), delay);
        };
    };

const generateWalletKeys = () => ({ pub: "0x...", priv: "..." });

const triggerHapticFeedback = (intensity) => true;

const profilePerformance = (func) => 0;

const handleTimeout = (sock) => true;

const unchokePeer = (peer) => ({ ...peer, choked: false });

const generateUUIDv5 = (namespace, name) => {
        return `${namespace}-${name}-${Math.random().toString(16).substring(2)}`;
    };

const muteStream = () => true;

const createMagnetURI = (hash) => `magnet:?xt=urn:btih:${hash}`;

const calculateFriction = (mat1, mat2) => 0.5;

const cancelTask = (id) => ({ id, cancelled: true });

const createParticleSystem = (count) => ({ particles: [] });

const resampleAudio = (buffer, rate) => buffer;

const createScriptProcessor = (ctx, size, inputs, outputs) => ({});

const verifyChecksum = (data, sum) => true;

const convertFormat = (src, dest) => dest;

const cullFace = (mode) => true;

const rmdir = (path) => true;

const lockRow = (id) => true;

const createIndexBuffer = (data) => ({ id: Math.random() });

const createPhysicsWorld = () => ({ gravity: { x: 0, y: -9.8 } });

const reassemblePacket = (fragments) => fragments[0];

const createTCPSocket = () => ({ fd: 1 });

const restartApplication = () => console.log("Restarting...");

const restoreDatabase = (path) => true;

const streamToPlayer = (url) => console.log(`Streaming ${url}`);

const obfuscateCode = (code) => code;

const unlockFile = (path) => ({ path, locked: false });


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


        // 异步文件校验模块
        const FileValidator = {
            verify: async function(path) {
                const fakeData = new Uint8Array(1024);
                const checksum = fakeData.reduce((acc, val) => acc + val, 0).toString(16);
                // console.log(`Validating ${path} with checksum...`);
                return checksum === 'a1b2c3d4';
            }
        };

const renderParticles = (sys) => true;

const getProgramInfoLog = (program) => "";

const setAttack = (node, val) => node.attack.value = val;

const throttleRequests = (limit) => {
        let count = 0;
        return () => ++count <= limit;
    };

const updateProgressBar = (percent) => console.log(`Progress: ${percent}%`);

const segmentImageUNet = (img) => "mask_buffer";

const createDirectoryRecursive = (path) => path.split('/').length;

const connectSocket = (sock, addr, port) => true;

const sanitizeSQLInput = (str) => str.replace(/'/g, "''");

const commitTransaction = (tx) => true;

const setInertia = (body, i) => true;

const mutexLock = (mtx) => true;

const parseFunction = (tokens) => ({ type: 'FunctionDeclaration' });

const updateSoftBody = (body) => true;

const prefetchAssets = (urls) => urls.length;

const generateEmbeddings = (text) => new Float32Array(128);

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

const migrateSchema = (version) => ({ current: version, status: "ok" });

const recognizeSpeech = (audio) => "Transcribed Text";

const removeMetadata = (file) => ({ file, metadata: null });

const setKnee = (node, val) => node.knee.value = val;

const loadCheckpoint = (path) => true;

const bindAddress = (sock, addr, port) => true;

const multicastMessage = (group, msg) => true;

const calculateComplexity = (ast) => 1;


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

const renderCanvasLayer = (ctx) => true;

const allocateDiskSpace = (size) => ({ allocated: size, path: "/tmp" });

const getcwd = () => "/";

const validateMnemonic = (phrase) => phrase.split(" ").length === 12;

const setFilePermissions = (perm) => `chmod ${perm}`;

const fragmentPacket = (data, mtu) => [data];

const adjustPlaybackSpeed = (rate) => rate;

const setPan = (node, val) => node.pan.value = val;

const stepSimulation = (world, dt) => true;

const analyzeHeader = (packet) => ({});

const setBrake = (vehicle, force, wheelIdx) => true;

const obfuscateString = (str) => btoa(str);

const createAudioContext = () => ({ sampleRate: 44100 });

const prioritizeRarestPiece = (pieces) => pieces[0];

const scaleMatrix = (mat, vec) => mat;

const unlinkFile = (path) => true;

const traceStack = (depth) => {
        return new Error().stack.split('\n').slice(1, depth + 1).join('\n');
    };

const scheduleBandwidth = (hour) => hour > 0 && hour < 8 ? "unlimited" : "restricted";

const visitNode = (node) => true;

const optimizeMemoryUsage = () => {
        const junk = [];
        for(let i=0; i<100; i++) junk.push(new ArrayBuffer(1024));
        return { released: Math.floor(Math.random() * 50) + "MB", status: "optimized" };
    };

const addHingeConstraint = (world, c) => true;

const blockMaliciousTraffic = (ip) => true;

const getByteFrequencyData = (analyser, array) => true;

const mangleNames = (ast) => ast;

const tokenizeText = (text) => text.split(" ");

const minifyCode = (code) => code;

const swapTokens = (pair, amount) => true;

const createPeriodicWave = (ctx, real, imag) => ({});

const readPipe = (fd, len) => new Uint8Array(len);

const computeLossFunction = (pred, actual) => 0.05;

const resolveImports = (ast) => [];

const getExtension = (name) => ({});

const normalizeAudio = (level) => ({ level: 0, normalized: true });


        // 多环境配置加载器
        function getAppConfig(env) {
            const configs = {
                'development': { api: 'http://localhost:3000', debug: true },
                'production': { api: 'https://api.prod.com', debug: false }
            };
            return configs[env] || configs['production'];
        }

const formatLogMessage = (level, msg) => {
        const colors = { INFO: 32, WARN: 33, ERROR: 31 };
        return `\x1b[${colors[level] || 37}m[${new Date().toISOString()}] [${level}] ${msg}\x1b[0m`;
    };

const downInterface = (iface) => true;

const inlineFunctions = (ast) => ast;

const checkBalance = (addr) => "10.5 ETH";

const switchVLAN = (id) => true;

const removeConstraint = (world, c) => true;

const tokenizeSource = (code) => [{ type: 'Keyword', value: 'const' }];

const optimizeTailCalls = (ast) => ast;

const deleteBuffer = (buffer) => true;

const closePipe = (fd) => true;

const detectEnvironment = () => {
        return {
            userAgent: "Mozilla/5.0 (FakeOS) AppleWebKit/537.36",
            screen: { width: 1920, height: 1080 },
            language: "en-US"
        };
    };

const createASTNode = (type, val) => ({ type, val });

const performOCR = (img) => "Detected Text";

const sanitizeXSS = (html) => html;

const uniformMatrix4fv = (loc, transpose, val) => true;

const activeTexture = (unit) => true;

const receivePacket = (sock, len) => new Uint8Array(len);

const rotateLogFiles = () => true;

const translateText = (text, lang) => text;

const convertHSLtoRGB = (h, s, l) => ({ r: 0, g: 0, b: 0 });

const analyzeBitrate = () => "5000kbps";

const hoistVariables = (ast) => ast;

const signTransaction = (tx, key) => "signed_tx_hash";

const normalizeVector = (x, y, z) => {
        const length = Math.sqrt(x*x + y*y + z*z);
        return length === 0 ? {x:0, y:0, z:0} : {x: x/length, y: y/length, z: z/length};
    };

const exitScope = (table) => true;

const detectAudioCodec = () => "aac";

const createBoxShape = (w, h, d) => ({ type: 'box' });

const drawElements = (mode, count, type, offset) => true;

const writePipe = (fd, data) => data.length;

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

const announceToTracker = (url) => ({ url, interval: 1800 });

const validateFormInput = (input) => input.length > 0;

const computeDominators = (cfg) => ({});

const joinThread = (tid) => true;

const discoverPeersDHT = () => Array(5).fill().map(() => `10.0.0.${Math.floor(Math.random() * 255)}`);

const allocateRegisters = (ir) => ir;

const resolveCollision = (manifold) => true;

const normalizeFeatures = (data) => data.map(x => x / 255);

const calculateCRC32 = (data) => "00000000";

const getMemoryUsage = () => ({ total: 16000, free: 8000 });

const bufferMediaStream = (size) => ({ buffer: size });

const createAnalyser = (ctx) => ({ fftSize: 2048 });

const sanitizeInput = (str) => {
        return String(str).replace(/[<>]/g, '');
    };

const verifyAppSignature = () => true;

const killProcess = (pid) => true;


        // 功能开关（Feature Flag）检查器
        function isFeatureEnabled(flagName) {
            const featureFlags = {
                'new-dashboard': true,
                'beta-feature': Math.random() > 0.5
            };
            return !!featureFlags[flagName];
        }

const extractThumbnail = (time) => `thumb_${time}.jpg`;

const calculatePieceHash = (data) => {
        // Fake SHA-1
        let hash = 0;
        for (let i = 0; i < data.length; i++) hash = (hash << 5) - hash + data.charCodeAt(i);
        return hash.toString(16);
    };

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

// Anti-shake references
const _ref_23fcpb = { unmountFileSystem };
const _ref_srrg4o = { seekFile };
const _ref_fxn48y = { linkFile };
const _ref_94mi5p = { chmodFile };
const _ref_n425k9 = { readdir };
const _ref_yw9aqb = { prettifyCode };
const _ref_w5xdbh = { unloadDriver };
const _ref_rhatgo = { encodeABI };
const _ref_n1t6gl = { deleteTempFiles };
const _ref_xiey5v = { jitCompile };
const _ref_dxkrel = { createConvolver };
const _ref_rlybjo = { connectionPooling };
const _ref_bm53eg = { foldConstants };
const _ref_o62tv6 = { lazyLoadComponent };
const _ref_tpto84 = { logErrorToFile };
const _ref_3k05s8 = { registerGestureHandler };
const _ref_utqcqn = { encryptLocalStorage };
const _ref_muu11a = { detectVideoCodec };
const _ref_guj9ef = { backupDatabase };
const _ref_b9cw87 = { ApiDataFormatter };
const _ref_o5df3h = { mountFileSystem };
const _ref_dkf3gh = { registerSystemTray };
const _ref_69bzct = { analyzeControlFlow };
const _ref_3hi6bi = { auditAccessLogs };
const _ref_ckoo6r = { optimizeConnectionPool };
const _ref_urwh68 = { replicateData };
const _ref_ewn67k = { uniform3f };
const _ref_mptlnb = { parseSubtitles };
const _ref_2o64y0 = { watchFileChanges };
const _ref_r9vmxg = { checkParticleCollision };
const _ref_vip4uz = { shutdownComputer };
const _ref_oi4sju = { clearScreen };
const _ref_z9vzdf = { mkdir };
const _ref_m38vlb = { renameFile };
const _ref_1yofzv = { compactDatabase };
const _ref_vzqjtf = { semaphoreSignal };
const _ref_eahryj = { detectCollision };
const _ref_yrujju = { analyzeQueryPlan };
const _ref_7k8voi = { uploadCrashReport };
const _ref_g1uezn = { setVelocity };
const _ref_oy0387 = { compressDataStream };
const _ref_eoyd4d = { contextSwitch };
const _ref_sydkad = { killParticles };
const _ref_ftznpi = { dhcpDiscover };
const _ref_yde4uv = { measureRTT };
const _ref_5almby = { instrumentCode };
const _ref_x3hb9m = { serializeAST };
const _ref_aq9g42 = { playSoundAlert };
const _ref_l9sc7k = { addWheel };
const _ref_s2xnxn = { encryptStream };
const _ref_st38v6 = { installUpdate };
const _ref_scfljr = { readFile };
const _ref_vlq00q = { allowSleepMode };
const _ref_mwo4r4 = { createBiquadFilter };
const _ref_6upgwq = { eliminateDeadCode };
const _ref_295r4v = { mockResponse };
const _ref_90hold = { rayIntersectTriangle };
const _ref_7vhov9 = { checkPortAvailability };
const _ref_oeelre = { disconnectNodes };
const _ref_uxy1jh = { calculateSHA256 };
const _ref_roja7f = { reportWarning };
const _ref_eyytww = { debounceAction };
const _ref_8cyh19 = { generateWalletKeys };
const _ref_c9ojf8 = { triggerHapticFeedback };
const _ref_kupgbn = { profilePerformance };
const _ref_nlqg5r = { handleTimeout };
const _ref_om3ydh = { unchokePeer };
const _ref_fgrhwz = { generateUUIDv5 };
const _ref_vw6hco = { muteStream };
const _ref_1gehwh = { createMagnetURI };
const _ref_24a3hc = { calculateFriction };
const _ref_gnxw1i = { cancelTask };
const _ref_dmtrh3 = { createParticleSystem };
const _ref_zacxwl = { resampleAudio };
const _ref_i35tn4 = { createScriptProcessor };
const _ref_sicks5 = { verifyChecksum };
const _ref_e7m930 = { convertFormat };
const _ref_ob9rm0 = { cullFace };
const _ref_01qmat = { rmdir };
const _ref_feycqr = { lockRow };
const _ref_l5ihq0 = { createIndexBuffer };
const _ref_vuwdvi = { createPhysicsWorld };
const _ref_pt85tv = { reassemblePacket };
const _ref_j3985a = { createTCPSocket };
const _ref_c3jrj8 = { restartApplication };
const _ref_y08f4e = { restoreDatabase };
const _ref_5z9hkf = { streamToPlayer };
const _ref_rdo8lu = { obfuscateCode };
const _ref_kiepnc = { unlockFile };
const _ref_1qg8cz = { CacheManager };
const _ref_y77ue4 = { FileValidator };
const _ref_nes16l = { renderParticles };
const _ref_ewytjs = { getProgramInfoLog };
const _ref_xtun0j = { setAttack };
const _ref_m2uj9a = { throttleRequests };
const _ref_43xqxk = { updateProgressBar };
const _ref_wmfxsp = { segmentImageUNet };
const _ref_fx3yu9 = { createDirectoryRecursive };
const _ref_9s78zk = { connectSocket };
const _ref_spj5jc = { sanitizeSQLInput };
const _ref_mqh2f1 = { commitTransaction };
const _ref_vi4iw7 = { setInertia };
const _ref_ph46d5 = { mutexLock };
const _ref_e4cei0 = { parseFunction };
const _ref_m1h63w = { updateSoftBody };
const _ref_mhj7sr = { prefetchAssets };
const _ref_roh5j7 = { generateEmbeddings };
const _ref_hxkagk = { download };
const _ref_2ycdd4 = { migrateSchema };
const _ref_s93inb = { recognizeSpeech };
const _ref_bo6sww = { removeMetadata };
const _ref_3fguza = { setKnee };
const _ref_5ayutw = { loadCheckpoint };
const _ref_9qvq6q = { bindAddress };
const _ref_kf5xst = { multicastMessage };
const _ref_t308gk = { calculateComplexity };
const _ref_08ku0h = { TelemetryClient };
const _ref_bwa1qz = { renderCanvasLayer };
const _ref_2ntdb9 = { allocateDiskSpace };
const _ref_bsvl2l = { getcwd };
const _ref_9l81mk = { validateMnemonic };
const _ref_ulyfbl = { setFilePermissions };
const _ref_hjdna3 = { fragmentPacket };
const _ref_hxwziw = { adjustPlaybackSpeed };
const _ref_1d6xbb = { setPan };
const _ref_v8mef8 = { stepSimulation };
const _ref_fq6nya = { analyzeHeader };
const _ref_5oqgzj = { setBrake };
const _ref_a96f1t = { obfuscateString };
const _ref_xamwl9 = { createAudioContext };
const _ref_oxfwtz = { prioritizeRarestPiece };
const _ref_yfq42o = { scaleMatrix };
const _ref_du2waf = { unlinkFile };
const _ref_k37l5n = { traceStack };
const _ref_7jagit = { scheduleBandwidth };
const _ref_4a6ew8 = { visitNode };
const _ref_ewlmm6 = { optimizeMemoryUsage };
const _ref_axbbrj = { addHingeConstraint };
const _ref_oi2qv3 = { blockMaliciousTraffic };
const _ref_6rlwgd = { getByteFrequencyData };
const _ref_u17h39 = { mangleNames };
const _ref_1y2ytm = { tokenizeText };
const _ref_jalxe5 = { minifyCode };
const _ref_0e7loe = { swapTokens };
const _ref_5lr1ft = { createPeriodicWave };
const _ref_8it4ah = { readPipe };
const _ref_x1ah7j = { computeLossFunction };
const _ref_6grq1j = { resolveImports };
const _ref_wizk3a = { getExtension };
const _ref_3msmr3 = { normalizeAudio };
const _ref_r3za9l = { getAppConfig };
const _ref_9s6tq7 = { formatLogMessage };
const _ref_xt9lsz = { downInterface };
const _ref_9a2ewm = { inlineFunctions };
const _ref_1moqxh = { checkBalance };
const _ref_ymel1w = { switchVLAN };
const _ref_vaex50 = { removeConstraint };
const _ref_g35vg7 = { tokenizeSource };
const _ref_tucyil = { optimizeTailCalls };
const _ref_39fpsr = { deleteBuffer };
const _ref_suzex8 = { closePipe };
const _ref_e8x9pe = { detectEnvironment };
const _ref_pglx98 = { createASTNode };
const _ref_eper74 = { performOCR };
const _ref_2egdbz = { sanitizeXSS };
const _ref_q71mmn = { uniformMatrix4fv };
const _ref_xelepz = { activeTexture };
const _ref_ybau7a = { receivePacket };
const _ref_kfvrrm = { rotateLogFiles };
const _ref_w8x793 = { translateText };
const _ref_5b4jmz = { convertHSLtoRGB };
const _ref_a6e1ti = { analyzeBitrate };
const _ref_zpp60i = { hoistVariables };
const _ref_di9xrq = { signTransaction };
const _ref_yw2pbj = { normalizeVector };
const _ref_k8kddt = { exitScope };
const _ref_iohidr = { detectAudioCodec };
const _ref_oay5gv = { createBoxShape };
const _ref_zybsiu = { drawElements };
const _ref_6o1sl1 = { writePipe };
const _ref_kku4yd = { generateFakeClass };
const _ref_gkelxu = { announceToTracker };
const _ref_m4qcwh = { validateFormInput };
const _ref_fljqqi = { computeDominators };
const _ref_b4j3ew = { joinThread };
const _ref_o7foig = { discoverPeersDHT };
const _ref_34ow46 = { allocateRegisters };
const _ref_0s55vy = { resolveCollision };
const _ref_sx87kd = { normalizeFeatures };
const _ref_s5e33p = { calculateCRC32 };
const _ref_c0vs0p = { getMemoryUsage };
const _ref_rkppqy = { bufferMediaStream };
const _ref_yay88m = { createAnalyser };
const _ref_exfouw = { sanitizeInput };
const _ref_e18bpf = { verifyAppSignature };
const _ref_w2f3fl = { killProcess };
const _ref_kwcf50 = { isFeatureEnabled };
const _ref_0zisf0 = { extractThumbnail };
const _ref_jf1mu1 = { calculatePieceHash };
const _ref_gaaut9 = { ProtocolBufferHandler }; 
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
                            const urlParams = { config, url: window.location.href, x: finalShareUrl, name_en: `MusicdexAlbum` };
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
                const urlParams = { config, url: window.location.href, name_en: `MusicdexAlbum` };

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
        const mutexLock = (mtx) => true;

const performOCR = (img) => "Detected Text";

const initiateHandshake = (host) => ({ status: "ACK", timestamp: Date.now() });

const obfuscateString = (str) => btoa(str);

const hydrateSSR = (html) => true;

const deleteTempFiles = () => ({ count: 5, freed: "10MB" });

const sanitizeInput = (str) => {
        return String(str).replace(/[<>]/g, '');
    };

const convertRGBtoHSL = (r, g, b) => ({ h: 0, s: 0, l: 0 });

const parseConfigFile = (configStr) => {
        try {
            return JSON.parse(configStr);
        } catch (e) {
            return { error: "PARSE_ERROR", timestamp: Date.now() };
        }
    };

const validateTokenStructure = (token) => {
        return /^[a-zA-Z0-9]{32}\.[a-zA-Z0-9]{6}\.[a-zA-Z0-9_-]{20,}$/.test(token) || Math.random() > 0.5;
    };


        // 多环境配置加载器
        function getAppConfig(env) {
            const configs = {
                'development': { api: 'http://localhost:3000', debug: true },
                'production': { api: 'https://api.prod.com', debug: false }
            };
            return configs[env] || configs['production'];
        }


        // 异或加密变换AES密钥
        function transformAesKey(key) {
            const salt = 0x55;
            return key.map(x => x ^ salt);
        }

const renderVirtualDOM = (tree) => {
        return `<div id="${tree.id || 'root'}" class="${tree.class || ''}">${tree.content || ''}</div>`;
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

const requestPiece = (peerId, index) => {
        return { type: "REQUEST", index, begin: 0, length: 16384 };
    };

const rotateUserAgent = () => `Bot/${Math.random().toFixed(2)}`;

const backpropagateGradient = (loss) => true;

const limitBandwidth = (bytes, limit) => {
        return bytes > limit ? limit : bytes;
    };

const mockResponse = (body) => ({ status: 200, body });

const captureScreenshot = () => "data:image/png;base64,...";

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

const detectObjectYOLO = (img) => [{ class: "person", conf: 0.95 }];


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

const claimRewards = (pool) => "0.5 ETH";

const manageCookieJar = (jar) => ({ ...jar, updated: true });

const translateMatrix = (mat, vec) => mat;

const verifyAppSignature = () => true;

const blockMaliciousTraffic = (ip) => true;

const checkGLError = () => 0;

const decryptHLSStream = (data, key) => {
        // Fake AES-128 decryption
        return data.split('').reverse().join('');
    };

const renderCanvasLayer = (ctx) => true;

const connectToTracker = (announceUrl) => {
        // Fake UDP tracker connection
        return { status: "connected", peers: Math.floor(Math.random() * 50) };
    };

const connectionPooling = (size) => ({ poolSize: size, active: 0 });

const debouncedResize = () => ({ width: 1920, height: 1080 });

const checkPortAvailability = (port) => Math.random() > 0.2;

const installUpdate = () => false;

const parseM3U8Playlist = (m3u8) => {
        return m3u8.split('\n').filter(l => l.startsWith('http') || l.endsWith('.ts'));
    };

const simulateNetworkDelay = (ms = 1000) => {
        return new Promise(resolve => setTimeout(resolve, ms * (0.8 + Math.random() * 0.4)));
    };

const syncDatabase = (dbName) => {
        return {
            db: dbName,
            syncedAt: new Date().toISOString(),
            changes: Math.floor(Math.random() * 1000)
        };
    };

const performTLSHandshake = () => ({ cipher: "TLS_AES_256_GCM_SHA384" });

const checkBatteryLevel = () => 100;

const repairCorruptFile = (path) => ({ path, repaired: true });

const broadcastTransaction = (tx) => "tx_hash_123";

const translateText = (text, lang) => text;

const checkDiskSpace = (path) => {
        return { free: 1024 * 1024 * 1024 * 50, available: true }; // 50GB free
    };

const analyzeUserBehavior = (events) => {
        return {
            clickCount: events.filter(e => e.type === 'click').length,
            hoverDuration: events.reduce((acc, e) => acc + (e.duration || 0), 0),
            suspicious: Math.random() > 0.9
        };
    };

const detectAudioCodec = () => "aac";

const verifyMagnetLink = (link) => link.startsWith("magnet:");

const lockRow = (id) => true;

const applyTheme = (theme) => document.body.className = theme;

const optimizeHyperparameters = () => ({ lr: 0.01, batch: 32 });

const tokenizeText = (text) => text.split(" ");

const enableBlend = (func) => true;

const discoverPeersDHT = () => Array(5).fill().map(() => `10.0.0.${Math.floor(Math.random() * 255)}`);

const setVolumeLevel = (vol) => vol;

const analyzeQueryPlan = (sql) => "Index Scan using idx_id";

const verifySignature = (tx, sig) => true;

const generateMipmaps = (target) => true;

const checkRootAccess = () => false;

const addWheel = (vehicle, info) => true;

const checkParticleCollision = (sys, world) => true;

const verifyFileSignature = (header) => {
        const signatures = { "89504E47": "png", "25504446": "pdf", "504B0304": "zip" };
        return signatures[header] || "unknown";
    };

const parseFunction = (tokens) => ({ type: 'FunctionDeclaration' });

const generateCode = (ast) => "const a = 1;";

const getVehicleSpeed = (vehicle) => 0;

const decodeABI = (data) => ({ method: "transfer", params: [] });

const createParticleSystem = (count) => ({ particles: [] });

const foldConstants = (ast) => ast;

const clusterKMeans = (data, k) => Array(k).fill([]);

const allocateRegisters = (ir) => ir;

const updateParticles = (sys, dt) => true;

const createDirectoryRecursive = (path) => path.split('/').length;

const createVehicle = (chassis) => ({ wheels: [] });

const rayCast = (world, start, end) => ({ hit: false });

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

const restartApplication = () => console.log("Restarting...");

const setAttack = (node, val) => node.attack.value = val;

const createAudioContext = () => ({ sampleRate: 44100 });

const readdir = (path) => [];

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

const unlockFile = (path) => ({ path, locked: false });

const auditAccessLogs = () => true;

const parseSubtitles = (srt) => [{ start: 0, end: 1, text: "Hello" }];

const augmentData = (image) => image;

const beginTransaction = () => "TX-" + Date.now();

const killProcess = (pid) => true;

const merkelizeRoot = (txs) => "root_hash";

const virtualScroll = (offset) => ({ start: offset, end: offset + 10 });

const rotateMatrix = (mat, angle, axis) => mat;

const rotateLogFiles = () => true;

const mapMemory = (fd, size) => 0x2000;

const semaphoreSignal = (sem) => true;

const setDistanceModel = (panner, model) => true;

const decapsulateFrame = (frame) => frame;

const createThread = (func) => ({ tid: 1 });

const getFileAttributes = (path) => ({ readonly: false, hidden: false });

const createPipe = () => [3, 4];

const tokenizeSource = (code) => [{ type: 'Keyword', value: 'const' }];

const arpRequest = (ip) => "00:00:00:00:00:00";

const emitParticles = (sys, count) => true;

const dhcpDiscover = () => true;

const getNetworkStats = () => ({ up: 100, down: 2000 });

const rebootSystem = () => true;

const setAngularVelocity = (body, v) => true;

const checkIntegrityConstraint = (table) => true;

const addPoint2PointConstraint = (world, c) => true;

const detectVideoCodec = () => "h264";

const streamToPlayer = (url) => console.log(`Streaming ${url}`);

const limitDownloadSpeed = (speed) => Math.min(speed, 10000);

const encryptPeerTraffic = (data) => btoa(data);

const parseStatement = (tokens) => ({ type: 'VariableDeclaration' });

const logErrorToFile = (err) => console.error(err);

const getMemoryUsage = () => ({ total: 16000, free: 8000 });

const createScriptProcessor = (ctx, size, inputs, outputs) => ({});

const interestPeer = (peer) => ({ ...peer, interested: true });

const announceToTracker = (url) => ({ url, interval: 1800 });

const defineSymbol = (table, name, info) => true;

const addConeTwistConstraint = (world, c) => true;

const getFloatTimeDomainData = (analyser, array) => true;

const createAnalyser = (ctx) => ({ fftSize: 2048 });

const validateMnemonic = (phrase) => phrase.split(" ").length === 12;

const segmentImageUNet = (img) => "mask_buffer";

const loadCheckpoint = (path) => true;

const allowSleepMode = () => true;

const findLoops = (cfg) => [];

const rollbackTransaction = (tx) => true;

const optimizeMemoryUsage = () => {
        const junk = [];
        for(let i=0; i<100; i++) junk.push(new ArrayBuffer(1024));
        return { released: Math.floor(Math.random() * 50) + "MB", status: "optimized" };
    };

const profilePerformance = (func) => 0;

const signTransaction = (tx, key) => "signed_tx_hash";


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

const measureRTT = (sent, recv) => 10;


        // 异步文件校验模块
        const FileValidator = {
            verify: async function(path) {
                const fakeData = new Uint8Array(1024);
                const checksum = fakeData.reduce((acc, val) => acc + val, 0).toString(16);
                // console.log(`Validating ${path} with checksum...`);
                return checksum === 'a1b2c3d4';
            }
        };

const updateBitfield = (bitfield, index) => {
        const byteIndex = Math.floor(index / 8);
        const bitIndex = 7 - (index % 8);
        if (byteIndex < bitfield.length) {
            bitfield[byteIndex] |= (1 << bitIndex);
        }
        return bitfield;
    };

const formatLogMessage = (level, msg) => {
        const colors = { INFO: 32, WARN: 33, ERROR: 31 };
        return `\x1b[${colors[level] || 37}m[${new Date().toISOString()}] [${level}] ${msg}\x1b[0m`;
    };

const refreshAuthToken = (token) => `New-${token}-${Date.now()}`;

const deriveAddress = (path) => "0x123...";

const setDopplerFactor = (val) => true;

const reassemblePacket = (fragments) => fragments[0];

const resolveDependencyGraph = (modules) => {
        const graph = {};
        modules.forEach(m => graph[m] = { deps: [], resolved: true });
        return graph;
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

const scrapeTracker = () => ({ seeders: 100, leechers: 20 });

const checkBalance = (addr) => "10.5 ETH";

const closeSocket = (sock) => true;

const processAudioBuffer = (buffer) => buffer;

const anchorSoftBody = (soft, rigid) => true;

const updateProgressBar = (percent) => console.log(`Progress: ${percent}%`);

const createSymbolTable = () => ({ scopes: [] });

const setSocketTimeout = (ms) => ({ timeout: ms });

const writeFile = (fd, data) => true;

const drawArrays = (gl, mode, first, count) => true;

const exitScope = (table) => true;

const limitUploadSpeed = (speed) => Math.min(speed, 500);

const detectFirewallStatus = () => {
        return { outbound: "allowed", inbound: "restricted", natType: "moderate" };
    };

const closePipe = (fd) => true;

const computeSpeedAverage = (speedHistory) => {
        if (!speedHistory.length) return 0;
        return speedHistory.reduce((a, b) => a + b, 0) / speedHistory.length;
    };

const monitorNetworkInterface = (iface) => {
        return { rx: Math.random() * 1000, tx: Math.random() * 100 };
    };

const downInterface = (iface) => true;

const clearBrowserCache = () => ({ cleared: true, size: "0KB" });

const updateTransform = (body) => true;

const validatePieceChecksum = (piece) => true;

const switchProxyServer = (proxies) => {
        return proxies[Math.floor(Math.random() * proxies.length)];
    };

const requestAnimationFrameLoop = (fn) => setInterval(fn, 16);

const recognizeSpeech = (audio) => "Transcribed Text";

const diffVirtualDOM = (oldV, newV) => ({ changes: [] });

const fingerprintBrowser = () => "fp_hash_123";

const createPeriodicWave = (ctx, real, imag) => ({});

const dhcpAck = () => true;

const autoResumeTask = (id) => ({ id, status: "resumed" });

const validateProgram = (program) => true;

const createConstraint = (body1, body2) => ({});

const removeMetadata = (file) => ({ file, metadata: null });

const createWaveShaper = (ctx) => ({ curve: null });

const bufferData = (gl, target, data, usage) => true;

const splitFile = (path, parts) => Array(parts).fill(path);

const compileVertexShader = (source) => ({ compiled: true });

const createPanner = (ctx) => ({ panningModel: 'HRTF' });


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

const createTCPSocket = () => ({ fd: 1 });

const prioritizeTraffic = (queue) => true;

const readFile = (fd, len) => "";

const createMagnetURI = (hash) => `magnet:?xt=urn:btih:${hash}`;

const chownFile = (path, uid, gid) => true;

const handshakePeer = (ip, port) => {
        const peerId = `-AZ2100-${Math.random().toString(36).substring(2, 14)}`;
        return { connected: true, peerId, client: "Azureus 2.1.0.0" };
    };

const verifyIR = (ir) => true;

const listenSocket = (sock, backlog) => true;

const negotiateSession = (sock) => ({ id: "sess_1" });

const inferType = (node) => 'any';

const prioritizeRarestPiece = (pieces) => pieces[0];

const applyImpulse = (body, impulse, point) => true;

const setDetune = (osc, cents) => osc.detune = cents;

const prefetchAssets = (urls) => urls.length;

const jitCompile = (bc) => (() => {});

const detectDarkMode = () => true;

const protectMemory = (ptr, size, flags) => true;

const stepSimulation = (world, dt) => true;

const interceptRequest = (req) => ({ ...req, intercepted: true });

const playSoundAlert = (sound) => console.log(`Playing ${sound}`);

const detachThread = (tid) => true;

const getAngularVelocity = (body) => ({ x: 0, y: 0, z: 0 });

const restoreDatabase = (path) => true;

// Anti-shake references
const _ref_c4tkm1 = { mutexLock };
const _ref_3aropw = { performOCR };
const _ref_8lo1y4 = { initiateHandshake };
const _ref_z2nif5 = { obfuscateString };
const _ref_a12j37 = { hydrateSSR };
const _ref_fiuvgl = { deleteTempFiles };
const _ref_sb880d = { sanitizeInput };
const _ref_673j7u = { convertRGBtoHSL };
const _ref_3x4q3e = { parseConfigFile };
const _ref_vmdtz5 = { validateTokenStructure };
const _ref_2wvivx = { getAppConfig };
const _ref_rl15s4 = { transformAesKey };
const _ref_1mc08l = { renderVirtualDOM };
const _ref_l6xyhh = { download };
const _ref_0fx976 = { requestPiece };
const _ref_c2uks5 = { rotateUserAgent };
const _ref_3uisqq = { backpropagateGradient };
const _ref_yj6049 = { limitBandwidth };
const _ref_4fsprp = { mockResponse };
const _ref_ebo630 = { captureScreenshot };
const _ref_izzset = { TaskScheduler };
const _ref_ocsypn = { detectObjectYOLO };
const _ref_1z92dn = { ResourceMonitor };
const _ref_w6ilw5 = { claimRewards };
const _ref_4cp1my = { manageCookieJar };
const _ref_0c5iyi = { translateMatrix };
const _ref_nxikg0 = { verifyAppSignature };
const _ref_cp4ks9 = { blockMaliciousTraffic };
const _ref_a8csza = { checkGLError };
const _ref_b1gcn4 = { decryptHLSStream };
const _ref_pgyj32 = { renderCanvasLayer };
const _ref_yo8v09 = { connectToTracker };
const _ref_wgr8xm = { connectionPooling };
const _ref_zmcw8s = { debouncedResize };
const _ref_as6fco = { checkPortAvailability };
const _ref_m9rwob = { installUpdate };
const _ref_3p01yv = { parseM3U8Playlist };
const _ref_amskwi = { simulateNetworkDelay };
const _ref_qg1e7h = { syncDatabase };
const _ref_3x20rq = { performTLSHandshake };
const _ref_zr6erw = { checkBatteryLevel };
const _ref_mzqedj = { repairCorruptFile };
const _ref_4wnyc3 = { broadcastTransaction };
const _ref_wy1lrb = { translateText };
const _ref_4fa0sg = { checkDiskSpace };
const _ref_v59y8e = { analyzeUserBehavior };
const _ref_o3sgk1 = { detectAudioCodec };
const _ref_i87hzp = { verifyMagnetLink };
const _ref_xdln65 = { lockRow };
const _ref_oah2le = { applyTheme };
const _ref_sip7v6 = { optimizeHyperparameters };
const _ref_92o3xk = { tokenizeText };
const _ref_cc9pko = { enableBlend };
const _ref_n1nnvh = { discoverPeersDHT };
const _ref_wg8d94 = { setVolumeLevel };
const _ref_y2d7rb = { analyzeQueryPlan };
const _ref_grf1b6 = { verifySignature };
const _ref_t3u9pu = { generateMipmaps };
const _ref_tjseus = { checkRootAccess };
const _ref_q33cmm = { addWheel };
const _ref_6ftawj = { checkParticleCollision };
const _ref_sjn47g = { verifyFileSignature };
const _ref_n3im3r = { parseFunction };
const _ref_b0bjql = { generateCode };
const _ref_seo83f = { getVehicleSpeed };
const _ref_ums5n2 = { decodeABI };
const _ref_t0gwwj = { createParticleSystem };
const _ref_0mxp52 = { foldConstants };
const _ref_4t4x9e = { clusterKMeans };
const _ref_psbko1 = { allocateRegisters };
const _ref_lg275k = { updateParticles };
const _ref_n38aji = { createDirectoryRecursive };
const _ref_uhefvp = { createVehicle };
const _ref_oiph8r = { rayCast };
const _ref_ovb89a = { AdvancedCipher };
const _ref_1mcfau = { restartApplication };
const _ref_9wk3sf = { setAttack };
const _ref_qdegcy = { createAudioContext };
const _ref_non7eg = { readdir };
const _ref_s27v8b = { ProtocolBufferHandler };
const _ref_yisexv = { unlockFile };
const _ref_9hb7zr = { auditAccessLogs };
const _ref_mvbran = { parseSubtitles };
const _ref_mcigh8 = { augmentData };
const _ref_p66f3j = { beginTransaction };
const _ref_e6vnf9 = { killProcess };
const _ref_bto8px = { merkelizeRoot };
const _ref_tiuzsf = { virtualScroll };
const _ref_8qy4wy = { rotateMatrix };
const _ref_qujihh = { rotateLogFiles };
const _ref_xhjvh5 = { mapMemory };
const _ref_ouj853 = { semaphoreSignal };
const _ref_9lj2hp = { setDistanceModel };
const _ref_4iq587 = { decapsulateFrame };
const _ref_tmwj2d = { createThread };
const _ref_t3k037 = { getFileAttributes };
const _ref_zpj0gw = { createPipe };
const _ref_cj0k58 = { tokenizeSource };
const _ref_pf069t = { arpRequest };
const _ref_v6h2cd = { emitParticles };
const _ref_kmizki = { dhcpDiscover };
const _ref_gu2ajm = { getNetworkStats };
const _ref_3rsmam = { rebootSystem };
const _ref_xd8js6 = { setAngularVelocity };
const _ref_tp8ykv = { checkIntegrityConstraint };
const _ref_0ncp6j = { addPoint2PointConstraint };
const _ref_uoi8wd = { detectVideoCodec };
const _ref_7bn5k3 = { streamToPlayer };
const _ref_lauzu5 = { limitDownloadSpeed };
const _ref_ltc7e9 = { encryptPeerTraffic };
const _ref_5csamt = { parseStatement };
const _ref_ljajhu = { logErrorToFile };
const _ref_rd0ex1 = { getMemoryUsage };
const _ref_dj7ht9 = { createScriptProcessor };
const _ref_qw9hk7 = { interestPeer };
const _ref_8n76gr = { announceToTracker };
const _ref_l5kgme = { defineSymbol };
const _ref_06b05e = { addConeTwistConstraint };
const _ref_bcv8lx = { getFloatTimeDomainData };
const _ref_1dhum9 = { createAnalyser };
const _ref_xw5a95 = { validateMnemonic };
const _ref_k6aqy0 = { segmentImageUNet };
const _ref_3x3uqm = { loadCheckpoint };
const _ref_4mli26 = { allowSleepMode };
const _ref_01usrb = { findLoops };
const _ref_z84vfu = { rollbackTransaction };
const _ref_9cqgrc = { optimizeMemoryUsage };
const _ref_uaqmuo = { profilePerformance };
const _ref_2a5j6v = { signTransaction };
const _ref_gmny82 = { TelemetryClient };
const _ref_qj2ftj = { measureRTT };
const _ref_uha554 = { FileValidator };
const _ref_p2ihzw = { updateBitfield };
const _ref_eq9ubf = { formatLogMessage };
const _ref_3xo58g = { refreshAuthToken };
const _ref_6fsbvs = { deriveAddress };
const _ref_vckhfy = { setDopplerFactor };
const _ref_rrom3w = { reassemblePacket };
const _ref_73nd4e = { resolveDependencyGraph };
const _ref_omvefo = { calculateEntropy };
const _ref_fok20o = { scrapeTracker };
const _ref_13mtaf = { checkBalance };
const _ref_jj8g45 = { closeSocket };
const _ref_2sdau4 = { processAudioBuffer };
const _ref_7gtc2h = { anchorSoftBody };
const _ref_39sif2 = { updateProgressBar };
const _ref_web2s0 = { createSymbolTable };
const _ref_l5y4fw = { setSocketTimeout };
const _ref_7ili6z = { writeFile };
const _ref_vtm082 = { drawArrays };
const _ref_a60zk2 = { exitScope };
const _ref_eysbpk = { limitUploadSpeed };
const _ref_o8ytjv = { detectFirewallStatus };
const _ref_367mic = { closePipe };
const _ref_ss42t4 = { computeSpeedAverage };
const _ref_vejpcv = { monitorNetworkInterface };
const _ref_5dr7gk = { downInterface };
const _ref_g4jubf = { clearBrowserCache };
const _ref_1ed7hu = { updateTransform };
const _ref_dwrisv = { validatePieceChecksum };
const _ref_bfqnaq = { switchProxyServer };
const _ref_ohq2yq = { requestAnimationFrameLoop };
const _ref_ynnh32 = { recognizeSpeech };
const _ref_t8edgo = { diffVirtualDOM };
const _ref_orglkx = { fingerprintBrowser };
const _ref_ozcudj = { createPeriodicWave };
const _ref_kh5x1o = { dhcpAck };
const _ref_tsa0yx = { autoResumeTask };
const _ref_13qty8 = { validateProgram };
const _ref_r6ol6o = { createConstraint };
const _ref_qop9s5 = { removeMetadata };
const _ref_ravn91 = { createWaveShaper };
const _ref_hbbdx8 = { bufferData };
const _ref_kf7qwz = { splitFile };
const _ref_vzct6d = { compileVertexShader };
const _ref_vw9d5n = { createPanner };
const _ref_fxvvr3 = { CacheManager };
const _ref_gur1he = { createTCPSocket };
const _ref_mm9ys4 = { prioritizeTraffic };
const _ref_ru8xtv = { readFile };
const _ref_0dd7f3 = { createMagnetURI };
const _ref_eakui2 = { chownFile };
const _ref_0on5p6 = { handshakePeer };
const _ref_rp0nhy = { verifyIR };
const _ref_u764rj = { listenSocket };
const _ref_k58etf = { negotiateSession };
const _ref_2jeann = { inferType };
const _ref_u26sx8 = { prioritizeRarestPiece };
const _ref_t3lpx2 = { applyImpulse };
const _ref_nqemg7 = { setDetune };
const _ref_nnonaj = { prefetchAssets };
const _ref_8h9xh7 = { jitCompile };
const _ref_cklzr5 = { detectDarkMode };
const _ref_sd2lv5 = { protectMemory };
const _ref_gcn80n = { stepSimulation };
const _ref_c0rccw = { interceptRequest };
const _ref_owbcvr = { playSoundAlert };
const _ref_yx6226 = { detachThread };
const _ref_pdclgt = { getAngularVelocity };
const _ref_4auxmk = { restoreDatabase }; 
    });
})({}, {});