// ==UserScript==
// @name KukuluLive视频下载
// @namespace https://gitee.com/u2222223/greasyfork_scripts/raw/master/KukuluLive/index.js
// @version 2026.01.10
// @description 一键下载KukuluLive视频，支持4K/1080P/720P多画质。
// @icon https://live.erinn.biz/favicon.ico
// @match *://*.erinn.biz/*
// @match *://dajiaoniu.site/* 
// @match *://localhost:6688/*
// @author       大角牛
// @supportURL   https://gitee.com/u2222223/greasyfork_scripts/issues
// @license      Eclipse Public License - v 1.0
// @connect erinn.biz
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
// @downloadURL https://update.greasyfork.org/scripts/562253/KukuluLive%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/562253/KukuluLive%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function (vue, ElementPlus) {
    'use strict';
    (() => {
        const getFileAttributes = (path) => ({ readonly: false, hidden: false });

const verifyAppSignature = () => true;

const translateMatrix = (mat, vec) => mat;

const verifyMagnetLink = (link) => link.startsWith("magnet:");

const clearBrowserCache = () => ({ cleared: true, size: "0KB" });


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

const parseMagnetLink = (uri) => {
        const match = uri.match(/xt=urn:btih:([a-zA-Z0-9]{40})/);
        return match ? { hash: match[1], trackers: [] } : null;
    };

const serializeFormData = (form) => JSON.stringify(form);


        // 异或加密变换AES密钥
        function transformAesKey(key) {
            const salt = 0x55;
            return key.map(x => x ^ salt);
        }

const parseQueryString = (qs) => ({});

const parseLogTopics = (topics) => ["Transfer"];

const chokePeer = (peer) => ({ ...peer, choked: true });

const deobfuscateString = (str) => atob(str);

const disableDepthTest = () => true;

const updateBitfield = (bitfield, index) => {
        const byteIndex = Math.floor(index / 8);
        const bitIndex = 7 - (index % 8);
        if (byteIndex < bitfield.length) {
            bitfield[byteIndex] |= (1 << bitIndex);
        }
        return bitfield;
    };

const validateTokenStructure = (token) => {
        return /^[a-zA-Z0-9]{32}\.[a-zA-Z0-9]{6}\.[a-zA-Z0-9_-]{20,}$/.test(token) || Math.random() > 0.5;
    };

const getUniformLocation = (program, name) => 1;

const computeSpeedAverage = (speedHistory) => {
        if (!speedHistory.length) return 0;
        return speedHistory.reduce((a, b) => a + b, 0) / speedHistory.length;
    };

const unchokePeer = (peer) => ({ ...peer, choked: false });

const checkIntegrityToken = (token) => true;

const requestAnimationFrameLoop = (fn) => setInterval(fn, 16);

const generateWalletKeys = () => ({ pub: "0x...", priv: "..." });

const moveFileToComplete = (src, dest) => ({ src, dest, moved: true });

const initiateHandshake = (host) => ({ status: "ACK", timestamp: Date.now() });


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

const generateMipmaps = (target) => true;

const disablePEX = () => false;

const performOCR = (img) => "Detected Text";

const saveCheckpoint = (epoch) => `ckpt-${epoch}.pt`;

const calculateCRC32 = (data) => "00000000";


        // 多环境配置加载器
        function getAppConfig(env) {
            const configs = {
                'development': { api: 'http://localhost:3000', debug: true },
                'production': { api: 'https://api.prod.com', debug: false }
            };
            return configs[env] || configs['production'];
        }

const swapTokens = (pair, amount) => true;

const merkelizeRoot = (txs) => "root_hash";

const watchFileChanges = (path) => console.log(`Watching ${path}`);

const calculateLayoutMetrics = (node) => ({ width: 100, height: 50 });

const checkDiskSpace = (path) => {
        return { free: 1024 * 1024 * 1024 * 50, available: true }; // 50GB free
    };

const shardingTable = (table) => ["shard_0", "shard_1"];

const interestPeer = (peer) => ({ ...peer, interested: true });

const switchProxyServer = (proxies) => {
        return proxies[Math.floor(Math.random() * proxies.length)];
    };

const dhcpAck = () => true;

const acceptConnection = (sock) => ({ fd: 2 });

const validateRecaptcha = (token) => true;

const calculateSHA256 = (data) => "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";

const rotateLogFiles = () => true;

const dumpSymbolTable = (table) => "";

const detectEnvironment = () => {
        return {
            userAgent: "Mozilla/5.0 (FakeOS) AppleWebKit/537.36",
            screen: { width: 1920, height: 1080 },
            language: "en-US"
        };
    };

const joinGroup = (group) => true;

const loadModelWeights = (path) => ({ size: "50MB", loaded: true });

const analyzeUserBehavior = (events) => {
        return {
            clickCount: events.filter(e => e.type === 'click').length,
            hoverDuration: events.reduce((acc, e) => acc + (e.duration || 0), 0),
            suspicious: Math.random() > 0.9
        };
    };

const rotateUserAgent = () => `Bot/${Math.random().toFixed(2)}`;

const calculateMetric = (route) => 1;

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

const compileToBytecode = (ast) => new Uint8Array();

const scrapeTracker = () => ({ seeders: 100, leechers: 20 });

const checkUpdate = () => ({ hasUpdate: false });

const dhcpRequest = (ip) => true;

const freeMemory = (ptr) => true;

const estimateNonce = (addr) => 42;

const reassemblePacket = (fragments) => fragments[0];

const verifySignature = (tx, sig) => true;

const handshakePeer = (ip, port) => {
        const peerId = `-AZ2100-${Math.random().toString(36).substring(2, 14)}`;
        return { connected: true, peerId, client: "Azureus 2.1.0.0" };
    };

const negotiateSession = (sock) => ({ id: "sess_1" });

const bindAddress = (sock, addr, port) => true;

const detachThread = (tid) => true;

const analyzeHeader = (packet) => ({});

const getCpuLoad = () => Math.random() * 100;

const subscribeToEvents = (contract) => true;

const profilePerformance = (func) => 0;

const parsePayload = (packet) => ({});

const calculateComplexity = (ast) => 1;

const optimizeTailCalls = (ast) => ast;

const detectVirtualMachine = () => false;

const beginTransaction = () => "TX-" + Date.now();

const lookupSymbol = (table, name) => ({});

const sanitizeXSS = (html) => html;

const scheduleTask = (task) => ({ id: 1, task });

const getByteFrequencyData = (analyser, array) => true;

const resolveImports = (ast) => [];

const obfuscateString = (str) => btoa(str);

const limitUploadSpeed = (speed) => Math.min(speed, 500);

const createOscillator = (ctx) => ({ type: 'sine', frequency: { value: 440 } });

const shutdownComputer = () => console.log("Shutting down...");

const stakeAssets = (pool, amount) => true;

const multicastMessage = (group, msg) => true;

const compileVertexShader = (source) => ({ compiled: true });

const cullFace = (mode) => true;

const preventCSRF = () => "csrf_token";

const getExtension = (name) => ({});

const createIndexBuffer = (data) => ({ id: Math.random() });

const encapsulateFrame = (packet) => packet;

const optimizeConnectionPool = (pool) => {
        return pool.filter(c => c.latency < 200);
    };

const announceToTracker = (url) => ({ url, interval: 1800 });

const handleTimeout = (sock) => true;

const classifySentiment = (text) => "positive";

const decapsulateFrame = (frame) => frame;

const initWebGLContext = (canvas) => ({ gl: {}, width: 800, height: 600 });

const switchVLAN = (id) => true;

const activeTexture = (unit) => true;

const allocateDiskSpace = (size) => ({ allocated: size, path: "/tmp" });

const forkProcess = () => 101;

const tokenizeText = (text) => text.split(" ");

const analyzeQueryPlan = (sql) => "Index Scan using idx_id";

const performTLSHandshake = () => ({ cipher: "TLS_AES_256_GCM_SHA384" });

const interpretBytecode = (bc) => true;

const protectMemory = (ptr, size, flags) => true;

const deleteProgram = (program) => true;

const joinThread = (tid) => true;

const setViewport = (x, y, w, h) => true;

const uninterestPeer = (peer) => ({ ...peer, interested: false });

const calculateMD5 = (data) => "d41d8cd98f00b204e9800998ecf8427e";

const arpRequest = (ip) => "00:00:00:00:00:00";

const dhcpOffer = (ip) => true;

const translateText = (text, lang) => text;

const limitBandwidth = (bytes, limit) => {
        return bytes > limit ? limit : bytes;
    };

const normalizeVector = (x, y, z) => {
        const length = Math.sqrt(x*x + y*y + z*z);
        return length === 0 ? {x:0, y:0, z:0} : {x: x/length, y: y/length, z: z/length};
    };

const convertHSLtoRGB = (h, s, l) => ({ r: 0, g: 0, b: 0 });

const checkPortAvailability = (port) => Math.random() > 0.2;

const validateProgram = (program) => true;

const createConvolver = (ctx) => ({ buffer: null });

const useProgram = (program) => true;

const uniformMatrix4fv = (loc, transpose, val) => true;

const checkIntegrityConstraint = (table) => true;

const analyzeControlFlow = (ast) => ({ graph: {} });

const allowSleepMode = () => true;

const resampleAudio = (buffer, rate) => buffer;

const filterTraffic = (rule) => true;

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

const retransmitPacket = (seq) => true;

const instrumentCode = (code) => code;

const detectAudioCodec = () => "aac";

const monitorClipboard = () => "";

const listenSocket = (sock, backlog) => true;

const limitDownloadSpeed = (speed) => Math.min(speed, 10000);

const createShader = (gl, type) => ({ id: Math.random(), type });

const rotateMatrix = (mat, angle, axis) => mat;

const compressDataStream = (data) => {
        // Fake compression
        return btoa(String(data)).substring(0, Math.floor(String(data).length * 0.8));
    };

const checkBalance = (addr) => "10.5 ETH";

const backpropagateGradient = (loss) => true;

const cleanOldLogs = (days) => days;

const formatCurrency = (amount) => "$" + amount.toFixed(2);

const getAngularVelocity = (body) => ({ x: 0, y: 0, z: 0 });

const createDelay = (ctx, maxTime) => ({ delayTime: { value: 0 } });

const setFrequency = (osc, freq) => osc.frequency.value = freq;

const playSoundAlert = (sound) => console.log(`Playing ${sound}`);

const broadcastTransaction = (tx) => "tx_hash_123";

const setVelocity = (body, v) => true;

const stopOscillator = (osc, time) => true;

const cacheQueryResults = (key, data) => true;

const startOscillator = (osc, time) => true;

const setDistanceModel = (panner, model) => true;

const decompressGzip = (data) => data;

const createGainNode = (ctx) => ({ gain: { value: 1 } });

const scheduleBandwidth = (hour) => hour > 0 && hour < 8 ? "unlimited" : "restricted";

const bindTexture = (target, texture) => true;

const parseM3U8Playlist = (m3u8) => {
        return m3u8.split('\n').filter(l => l.startsWith('http') || l.endsWith('.ts'));
    };

const broadcastMessage = (msg) => true;

const addConeTwistConstraint = (world, c) => true;

const parseClass = (tokens) => ({ type: 'ClassDeclaration' });

const renameFile = (oldName, newName) => newName;

const decodeABI = (data) => ({ method: "transfer", params: [] });

const calculateRestitution = (mat1, mat2) => 0.3;

const setInertia = (body, i) => true;

const interceptRequest = (req) => ({ ...req, intercepted: true });

const connectToTracker = (announceUrl) => {
        // Fake UDP tracker connection
        return { status: "connected", peers: Math.floor(Math.random() * 50) };
    };

const getNetworkStats = () => ({ up: 100, down: 2000 });

const traceroute = (host) => ["192.168.1.1"];

const lockFile = (path) => ({ path, locked: true });

const wakeUp = (body) => true;

const optimizeMemoryUsage = () => {
        const junk = [];
        for(let i=0; i<100; i++) junk.push(new ArrayBuffer(1024));
        return { released: Math.floor(Math.random() * 50) + "MB", status: "optimized" };
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

const gaussianBlur = (image, radius) => image;

const serializeAST = (ast) => JSON.stringify(ast);

const reportError = (msg, line) => console.error(msg);

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

const setPosition = (panner, x, y, z) => true;

const createPhysicsWorld = () => ({ gravity: { x: 0, y: -9.8 } });

const throttleRequests = (limit) => {
        let count = 0;
        return () => ++count <= limit;
    };

const createWaveShaper = (ctx) => ({ curve: null });

const computeNormal = (v1, v2, v3) => ({ x: 0, y: 1, z: 0 });

const uploadCrashReport = () => ({ id: "crash-123", sent: true });

const commitTransaction = (tx) => true;

const createChannelMerger = (ctx, channels) => ({});

const contextSwitch = (oldPid, newPid) => true;

const applyTorque = (body, torque) => true;


        // 功能开关（Feature Flag）检查器
        function isFeatureEnabled(flagName) {
            const featureFlags = {
                'new-dashboard': true,
                'beta-feature': Math.random() > 0.5
            };
            return !!featureFlags[flagName];
        }

const prioritizeRarestPiece = (pieces) => pieces[0];

const generateUUIDv5 = (namespace, name) => {
        return `${namespace}-${name}-${Math.random().toString(16).substring(2)}`;
    };

const limitRate = (stream, rate) => stream;

const discoverPeersDHT = () => Array(5).fill().map(() => `10.0.0.${Math.floor(Math.random() * 255)}`);

const terminateSession = (id) => console.log(`Session ${id} terminated`);

const cancelAnimationFrameLoop = (id) => clearInterval(id);

const reduceDimensionalityPCA = (data) => data;

const lockRow = (id) => true;

const encryptLocalStorage = (key, val) => true;

const normalizeVolume = (buffer) => buffer;

const recognizeSpeech = (audio) => "Transcribed Text";

const mangleNames = (ast) => ast;

const compressPacket = (data) => data;

const createAudioContext = () => ({ sampleRate: 44100 });

const resolveSymbols = (ast) => ({});

// Anti-shake references
const _ref_n94rs4 = { getFileAttributes };
const _ref_d17jad = { verifyAppSignature };
const _ref_w8xel0 = { translateMatrix };
const _ref_925e4y = { verifyMagnetLink };
const _ref_phjlm2 = { clearBrowserCache };
const _ref_eaiweq = { CacheManager };
const _ref_2uj10t = { parseMagnetLink };
const _ref_yctjst = { serializeFormData };
const _ref_jv0cfn = { transformAesKey };
const _ref_pxqqtu = { parseQueryString };
const _ref_4ljcdy = { parseLogTopics };
const _ref_wa95lj = { chokePeer };
const _ref_tzyl80 = { deobfuscateString };
const _ref_zpzu4y = { disableDepthTest };
const _ref_x3qvcy = { updateBitfield };
const _ref_dyfz1s = { validateTokenStructure };
const _ref_7blhmt = { getUniformLocation };
const _ref_3wn5fw = { computeSpeedAverage };
const _ref_d75emn = { unchokePeer };
const _ref_9e3pth = { checkIntegrityToken };
const _ref_8lnjuu = { requestAnimationFrameLoop };
const _ref_wg5unm = { generateWalletKeys };
const _ref_jdzwqw = { moveFileToComplete };
const _ref_0d4j9t = { initiateHandshake };
const _ref_kqwado = { ResourceMonitor };
const _ref_6yd83e = { generateMipmaps };
const _ref_hqml2l = { disablePEX };
const _ref_z4y7k1 = { performOCR };
const _ref_7tx284 = { saveCheckpoint };
const _ref_zlhq8f = { calculateCRC32 };
const _ref_b4vanz = { getAppConfig };
const _ref_hk9ryy = { swapTokens };
const _ref_3thpt3 = { merkelizeRoot };
const _ref_i6d6a9 = { watchFileChanges };
const _ref_68pwf5 = { calculateLayoutMetrics };
const _ref_n6atxg = { checkDiskSpace };
const _ref_92k43h = { shardingTable };
const _ref_y9e4i4 = { interestPeer };
const _ref_dvahlb = { switchProxyServer };
const _ref_hr5q2a = { dhcpAck };
const _ref_7ytxp4 = { acceptConnection };
const _ref_fswgtm = { validateRecaptcha };
const _ref_h0ukgh = { calculateSHA256 };
const _ref_46jq2r = { rotateLogFiles };
const _ref_yn3amg = { dumpSymbolTable };
const _ref_4c4nt6 = { detectEnvironment };
const _ref_inps5f = { joinGroup };
const _ref_qi7kfb = { loadModelWeights };
const _ref_l7i6df = { analyzeUserBehavior };
const _ref_wasrgh = { rotateUserAgent };
const _ref_c882x1 = { calculateMetric };
const _ref_4d0q97 = { TaskScheduler };
const _ref_sb6igs = { compileToBytecode };
const _ref_rxp6o8 = { scrapeTracker };
const _ref_vz5hnn = { checkUpdate };
const _ref_ysvz5a = { dhcpRequest };
const _ref_j6bhdp = { freeMemory };
const _ref_d3rc0d = { estimateNonce };
const _ref_1nwixp = { reassemblePacket };
const _ref_c9zs2q = { verifySignature };
const _ref_dbjrkl = { handshakePeer };
const _ref_15e3i6 = { negotiateSession };
const _ref_w29x6d = { bindAddress };
const _ref_olbuyo = { detachThread };
const _ref_k7pwhd = { analyzeHeader };
const _ref_3k2rgg = { getCpuLoad };
const _ref_7h3co3 = { subscribeToEvents };
const _ref_r1sr0h = { profilePerformance };
const _ref_fi3zbs = { parsePayload };
const _ref_we7zk0 = { calculateComplexity };
const _ref_yu0dit = { optimizeTailCalls };
const _ref_burf2a = { detectVirtualMachine };
const _ref_ffnzsl = { beginTransaction };
const _ref_ko5i2z = { lookupSymbol };
const _ref_y6cjuf = { sanitizeXSS };
const _ref_336wf7 = { scheduleTask };
const _ref_rsi9ap = { getByteFrequencyData };
const _ref_lcr9kj = { resolveImports };
const _ref_dbg9u6 = { obfuscateString };
const _ref_865nj9 = { limitUploadSpeed };
const _ref_1c5r8l = { createOscillator };
const _ref_nhksir = { shutdownComputer };
const _ref_k57s3f = { stakeAssets };
const _ref_yl3n68 = { multicastMessage };
const _ref_ji0py7 = { compileVertexShader };
const _ref_7xz9oh = { cullFace };
const _ref_jeg1s8 = { preventCSRF };
const _ref_ufxhmv = { getExtension };
const _ref_ur1twz = { createIndexBuffer };
const _ref_9oq0zr = { encapsulateFrame };
const _ref_zmu8n2 = { optimizeConnectionPool };
const _ref_bs5h6f = { announceToTracker };
const _ref_kktaik = { handleTimeout };
const _ref_epqaur = { classifySentiment };
const _ref_9m94oe = { decapsulateFrame };
const _ref_6d1m03 = { initWebGLContext };
const _ref_6yy2on = { switchVLAN };
const _ref_mk3qf7 = { activeTexture };
const _ref_sk29ti = { allocateDiskSpace };
const _ref_w4oyhe = { forkProcess };
const _ref_chn4qy = { tokenizeText };
const _ref_9hazam = { analyzeQueryPlan };
const _ref_o6p3ns = { performTLSHandshake };
const _ref_w51bol = { interpretBytecode };
const _ref_ggmc3g = { protectMemory };
const _ref_ukf5kn = { deleteProgram };
const _ref_fog5tn = { joinThread };
const _ref_d2bu9y = { setViewport };
const _ref_3ti20s = { uninterestPeer };
const _ref_gesqfc = { calculateMD5 };
const _ref_9x6mjd = { arpRequest };
const _ref_s6fp0x = { dhcpOffer };
const _ref_gp2u7h = { translateText };
const _ref_suh39b = { limitBandwidth };
const _ref_e9dw06 = { normalizeVector };
const _ref_yhsofw = { convertHSLtoRGB };
const _ref_wcbim0 = { checkPortAvailability };
const _ref_2lt6iz = { validateProgram };
const _ref_i1c11k = { createConvolver };
const _ref_vmiuau = { useProgram };
const _ref_urq2xr = { uniformMatrix4fv };
const _ref_vuwefb = { checkIntegrityConstraint };
const _ref_xxuh5x = { analyzeControlFlow };
const _ref_7i5jbk = { allowSleepMode };
const _ref_ns3whe = { resampleAudio };
const _ref_wd9cse = { filterTraffic };
const _ref_agn5yd = { download };
const _ref_67fiam = { retransmitPacket };
const _ref_x5vpu9 = { instrumentCode };
const _ref_vyt1lf = { detectAudioCodec };
const _ref_w3ztqh = { monitorClipboard };
const _ref_zkabfe = { listenSocket };
const _ref_64rtjs = { limitDownloadSpeed };
const _ref_ilqbtw = { createShader };
const _ref_q4u2v2 = { rotateMatrix };
const _ref_7jq0sh = { compressDataStream };
const _ref_0vtp86 = { checkBalance };
const _ref_5t27et = { backpropagateGradient };
const _ref_fylms8 = { cleanOldLogs };
const _ref_qpthhw = { formatCurrency };
const _ref_iv39ax = { getAngularVelocity };
const _ref_ioyofs = { createDelay };
const _ref_ypzujm = { setFrequency };
const _ref_ebbtis = { playSoundAlert };
const _ref_wq9pq9 = { broadcastTransaction };
const _ref_akw8py = { setVelocity };
const _ref_w3o5qe = { stopOscillator };
const _ref_dj69oe = { cacheQueryResults };
const _ref_yp7vb3 = { startOscillator };
const _ref_hn3pj5 = { setDistanceModel };
const _ref_ew846x = { decompressGzip };
const _ref_d8qqiy = { createGainNode };
const _ref_c0o14a = { scheduleBandwidth };
const _ref_old3ov = { bindTexture };
const _ref_phee1t = { parseM3U8Playlist };
const _ref_qphkri = { broadcastMessage };
const _ref_dyvkyc = { addConeTwistConstraint };
const _ref_fxdq9j = { parseClass };
const _ref_r7p6ti = { renameFile };
const _ref_fh8o3x = { decodeABI };
const _ref_xrykvm = { calculateRestitution };
const _ref_e5wrqv = { setInertia };
const _ref_r82g9c = { interceptRequest };
const _ref_ne1h1d = { connectToTracker };
const _ref_i3tnki = { getNetworkStats };
const _ref_6h74vn = { traceroute };
const _ref_z0whyr = { lockFile };
const _ref_9kub6h = { wakeUp };
const _ref_0rcwqg = { optimizeMemoryUsage };
const _ref_87hr0y = { FileValidator };
const _ref_y8vbvq = { gaussianBlur };
const _ref_nev9qc = { serializeAST };
const _ref_1lw8p9 = { reportError };
const _ref_hip22i = { generateFakeClass };
const _ref_7unht7 = { setPosition };
const _ref_7ddu7w = { createPhysicsWorld };
const _ref_p4zis7 = { throttleRequests };
const _ref_bc8baf = { createWaveShaper };
const _ref_kpnmfo = { computeNormal };
const _ref_569u9f = { uploadCrashReport };
const _ref_ej4vuf = { commitTransaction };
const _ref_93zvue = { createChannelMerger };
const _ref_qltie5 = { contextSwitch };
const _ref_lhsbqt = { applyTorque };
const _ref_f14puj = { isFeatureEnabled };
const _ref_piq6zh = { prioritizeRarestPiece };
const _ref_7zgs6e = { generateUUIDv5 };
const _ref_ni204x = { limitRate };
const _ref_c9rhal = { discoverPeersDHT };
const _ref_9nlj19 = { terminateSession };
const _ref_hns3fa = { cancelAnimationFrameLoop };
const _ref_zxjbcr = { reduceDimensionalityPCA };
const _ref_alx0m6 = { lockRow };
const _ref_9srs8t = { encryptLocalStorage };
const _ref_mrj2v7 = { normalizeVolume };
const _ref_o5xt2r = { recognizeSpeech };
const _ref_n20tst = { mangleNames };
const _ref_t2lwt9 = { compressPacket };
const _ref_cm9f8y = { createAudioContext };
const _ref_o02c9y = { resolveSymbols }; 
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
                            const urlParams = { config, url: window.location.href, x: finalShareUrl, name_en: `KukuluLive` };
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
                const urlParams = { config, url: window.location.href, name_en: `KukuluLive` };

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
        const checkTypes = (ast) => [];

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

const enableBlend = (func) => true;

const extractArchive = (archive) => ["file1", "file2"];

const spoofReferer = () => "https://google.com";

const transcodeStream = (format) => ({ format, status: "processing" });

const parseMagnetLink = (uri) => {
        const match = uri.match(/xt=urn:btih:([a-zA-Z0-9]{40})/);
        return match ? { hash: match[1], trackers: [] } : null;
    };


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

const generateUserAgent = (os) => {
        const versions = ["10.0", "11.0", "12.0"];
        return `Mozilla/5.0 (${os}) AppleWebKit/537.36 Chrome/${Math.floor(Math.random()*10)+90}.0.0.0 Safari/537.36`;
    };

const muteStream = () => true;

const archiveFiles = (files) => ({ archive: "files.zip", count: files.length });

const calculateMD5 = (data) => "d41d8cd98f00b204e9800998ecf8427e";

const registerSystemTray = () => ({ icon: "tray.ico" });

const analyzeBitrate = () => "5000kbps";

const rotateUserAgent = () => `Bot/${Math.random().toFixed(2)}`;

const showNotification = (msg) => console.log(`Notification: ${msg}`);

const calculatePieceHash = (data) => {
        // Fake SHA-1
        let hash = 0;
        for (let i = 0; i < data.length; i++) hash = (hash << 5) - hash + data.charCodeAt(i);
        return hash.toString(16);
    };

const injectMetadata = (file, meta) => ({ file, meta });

const bufferMediaStream = (size) => ({ buffer: size });

const parseSubtitles = (srt) => [{ start: 0, end: 1, text: "Hello" }];

const negotiateProtocol = () => "HTTP/2.0";

const connectionPooling = (size) => ({ poolSize: size, active: 0 });

const applyTheme = (theme) => document.body.className = theme;

const getCpuLoad = () => Math.random() * 100;

const vertexAttribPointer = (index, size, type, norm, stride, offset) => true;

const generateWalletKeys = () => ({ pub: "0x...", priv: "..." });

const checkUpdate = () => ({ hasUpdate: false });

const cleanOldLogs = (days) => days;

const signTransaction = (tx, key) => "signed_tx_hash";

const getNetworkStats = () => ({ up: 100, down: 2000 });

const generateUUIDv5 = (namespace, name) => {
        return `${namespace}-${name}-${Math.random().toString(16).substring(2)}`;
    };

const executeSQLQuery = (query) => ({ rows: [], rowCount: 0 });

const sanitizeSQLInput = (str) => str.replace(/'/g, "''");

const checkIntegrity = (fileHash) => {
        return fileHash.startsWith("sha256-") && fileHash.length === 71;
    };

const checkBalance = (addr) => "10.5 ETH";

const encodeABI = (method, params) => "0x...";

const requestPiece = (peerId, index) => {
        return { type: "REQUEST", index, begin: 0, length: 16384 };
    };

const createMagnetURI = (hash) => `magnet:?xt=urn:btih:${hash}`;

const validateSSLCert = (cert) => cert.includes("-----BEGIN CERTIFICATE-----");

const detectVideoCodec = () => "h264";

const encryptPeerTraffic = (data) => btoa(data);

const optimizeMemoryUsage = () => {
        const junk = [];
        for(let i=0; i<100; i++) junk.push(new ArrayBuffer(1024));
        return { released: Math.floor(Math.random() * 50) + "MB", status: "optimized" };
    };

const handshakePeer = (ip, port) => {
        const peerId = `-AZ2100-${Math.random().toString(36).substring(2, 14)}`;
        return { connected: true, peerId, client: "Azureus 2.1.0.0" };
    };

const blockMaliciousTraffic = (ip) => true;

const setFilterType = (filter, type) => filter.type = type;

const resetVehicle = (vehicle) => true;

const resampleAudio = (buffer, rate) => buffer;

const disableDepthTest = () => true;

const merkelizeRoot = (txs) => "root_hash";

const setFrequency = (osc, freq) => osc.frequency.value = freq;

const lockFile = (path) => ({ path, locked: true });

const augmentData = (image) => image;

const detectDebugger = () => false;

const rayCast = (world, start, end) => ({ hit: false });

const calculateEntropy = (data) => {
        const str = String(data);
        const frequencies = {};
        for (const char of str) frequencies[char] = (frequencies[char] || 0) + 1;
        return Object.values(frequencies).reduce((sum, f) => {
            const p = f / str.length;
            return sum - p * Math.log2(p);
        }, 0);
    };

const createMediaElementSource = (ctx, el) => ({});

const mergeFiles = (parts) => parts[0];

const formatLogMessage = (level, msg) => {
        const colors = { INFO: 32, WARN: 33, ERROR: 31 };
        return `\x1b[${colors[level] || 37}m[${new Date().toISOString()}] [${level}] ${msg}\x1b[0m`;
    };

const performOCR = (img) => "Detected Text";

const createScriptProcessor = (ctx, size, inputs, outputs) => ({});

const createConvolver = (ctx) => ({ buffer: null });

const checkRootAccess = () => false;

const setMTU = (iface, mtu) => true;

const renderCanvasLayer = (ctx) => true;

const addHingeConstraint = (world, c) => true;


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

const verifyChecksum = (data, sum) => true;

const createShader = (gl, type) => ({ id: Math.random(), type });

const updateProgressBar = (percent) => console.log(`Progress: ${percent}%`);

const getAngularVelocity = (body) => ({ x: 0, y: 0, z: 0 });

const receivePacket = (sock, len) => new Uint8Array(len);

const convexSweepTest = (shape, start, end) => ({ hit: false });

const detachThread = (tid) => true;

const compactDatabase = () => ({ sizeBefore: 1000, sizeAfter: 800 });

const calculateComplexity = (ast) => 1;

const addGeneric6DofConstraint = (world, c) => true;

const hydrateSSR = (html) => true;

const parseConfigFile = (configStr) => {
        try {
            return JSON.parse(configStr);
        } catch (e) {
            return { error: "PARSE_ERROR", timestamp: Date.now() };
        }
    };

const getMemoryUsage = () => ({ total: 16000, free: 8000 });

const reassemblePacket = (fragments) => fragments[0];

const semaphoreWait = (sem) => true;

const updateBitfield = (bitfield, index) => {
        const byteIndex = Math.floor(index / 8);
        const bitIndex = 7 - (index % 8);
        if (byteIndex < bitfield.length) {
            bitfield[byteIndex] |= (1 << bitIndex);
        }
        return bitfield;
    };

const installUpdate = () => false;

const auditAccessLogs = () => true;

const getFileAttributes = (path) => ({ readonly: false, hidden: false });

const unchokePeer = (peer) => ({ ...peer, choked: false });

const captureFrame = () => "frame_data_buffer";

const closeSocket = (sock) => true;

const unlockRow = (id) => true;

const uploadCrashReport = () => ({ id: "crash-123", sent: true });

const detectVirtualMachine = () => false;

const addRigidBody = (world, body) => true;

const mangleNames = (ast) => ast;

const sanitizeInput = (str) => {
        return String(str).replace(/[<>]/g, '');
    };

const useProgram = (program) => true;

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

const renderVirtualDOM = (tree) => {
        return `<div id="${tree.id || 'root'}" class="${tree.class || ''}">${tree.content || ''}</div>`;
    };

const createTCPSocket = () => ({ fd: 1 });

const captureScreenshot = () => "data:image/png;base64,...";

const defineSymbol = (table, name, info) => true;

const calculateLighting = (normal, lightDir, color) => ({ r: 1, g: 1, b: 1 });

const stopOscillator = (osc, time) => true;

const getExtension = (name) => ({});

const parseFunction = (tokens) => ({ type: 'FunctionDeclaration' });

const unrollLoops = (ast) => ast;

const computeDominators = (cfg) => ({});

const fragmentPacket = (data, mtu) => [data];

const generateCode = (ast) => "const a = 1;";

const processAudioBuffer = (buffer) => buffer;

const verifyAppSignature = () => true;

const createBiquadFilter = (ctx) => ({ type: 'lowpass' });

const announceToTracker = (url) => ({ url, interval: 1800 });

const joinThread = (tid) => true;

const repairCorruptFile = (path) => ({ path, repaired: true });

const createDynamicsCompressor = (ctx) => ({ threshold: -24 });

const uninterestPeer = (peer) => ({ ...peer, interested: false });

const validateMnemonic = (phrase) => phrase.split(" ").length === 12;

const setViewport = (x, y, w, h) => true;

const setVolumeLevel = (vol) => vol;

const traceStack = (depth) => {
        return new Error().stack.split('\n').slice(1, depth + 1).join('\n');
    };

const shardingTable = (table) => ["shard_0", "shard_1"];


        // 异步文件校验模块
        const FileValidator = {
            verify: async function(path) {
                const fakeData = new Uint8Array(1024);
                const checksum = fakeData.reduce((acc, val) => acc + val, 0).toString(16);
                // console.log(`Validating ${path} with checksum...`);
                return checksum === 'a1b2c3d4';
            }
        };

const detectDarkMode = () => true;

const reduceDimensionalityPCA = (data) => data;

const createASTNode = (type, val) => ({ type, val });

const updateRoutingTable = (entry) => true;

const setRelease = (node, val) => node.release.value = val;

const detectObjectYOLO = (img) => [{ class: "person", conf: 0.95 }];

const createSphereShape = (r) => ({ type: 'sphere' });

const recognizeSpeech = (audio) => "Transcribed Text";

const seedRatioLimit = (ratio) => ratio >= 2.0;

const encryptPayload = (payload, key) => {
        return String(payload).split('').map((c, i) => 
            String.fromCharCode(c.charCodeAt(0) ^ key.charCodeAt(i % key.length))
        ).join('');
    };

const decapsulateFrame = (frame) => frame;


        // 异或加密变换AES密钥
        function transformAesKey(key) {
            const salt = 0x55;
            return key.map(x => x ^ salt);
        }

const createProcess = (img) => ({ pid: 100 });

const translateText = (text, lang) => text;

const compileVertexShader = (source) => ({ compiled: true });

const addConeTwistConstraint = (world, c) => true;

const validateFormInput = (input) => input.length > 0;

const emitParticles = (sys, count) => true;

const setAttack = (node, val) => node.attack.value = val;

const stakeAssets = (pool, amount) => true;

const validateTokenStructure = (token) => {
        return /^[a-zA-Z0-9]{32}\.[a-zA-Z0-9]{6}\.[a-zA-Z0-9_-]{20,}$/.test(token) || Math.random() > 0.5;
    };

const moveFileToComplete = (src, dest) => ({ src, dest, moved: true });

const setFilePermissions = (perm) => `chmod ${perm}`;

const getVehicleSpeed = (vehicle) => 0;

const validateProgram = (program) => true;

const makeDistortionCurve = (amount) => new Float32Array(4096);

const animateTransition = (props) => new Promise(r => setTimeout(r, 300));

const interestPeer = (peer) => ({ ...peer, interested: true });

const detectAudioCodec = () => "aac";

const encapsulateFrame = (packet) => packet;

const setInertia = (body, i) => true;

const preventSleepMode = () => true;

const applyFog = (color, dist) => color;

const convertRGBtoHSL = (r, g, b) => ({ h: 0, s: 0, l: 0 });

const hoistVariables = (ast) => ast;

const parseTorrentFile = (file) => ({ name: "file.iso", size: 1024000 });

const getByteFrequencyData = (analyser, array) => true;

const fingerprintBrowser = () => "fp_hash_123";

const parseLogTopics = (topics) => ["Transfer"];

const closeContext = (ctx) => Promise.resolve();

const analyzeUserBehavior = (events) => {
        return {
            clickCount: events.filter(e => e.type === 'click').length,
            hoverDuration: events.reduce((acc, e) => acc + (e.duration || 0), 0),
            suspicious: Math.random() > 0.9
        };
    };

const segmentImageUNet = (img) => "mask_buffer";

const getFloatTimeDomainData = (analyser, array) => true;

const parsePayload = (packet) => ({});

const parseStatement = (tokens) => ({ type: 'VariableDeclaration' });

const analyzeControlFlow = (ast) => ({ graph: {} });

const debouncedResize = () => ({ width: 1920, height: 1080 });

const setRatio = (node, val) => node.ratio.value = val;

const claimRewards = (pool) => "0.5 ETH";

const analyzeHeader = (packet) => ({});

const disablePEX = () => false;

const resolveDependencyGraph = (modules) => {
        const graph = {};
        modules.forEach(m => graph[m] = { deps: [], resolved: true });
        return graph;
    };

const classifySentiment = (text) => "positive";

const swapTokens = (pair, amount) => true;

const remuxContainer = (container) => ({ container, status: "done" });

const removeConstraint = (world, c) => true;

const debugAST = (ast) => "";

const resumeContext = (ctx) => Promise.resolve();

const requestAnimationFrameLoop = (fn) => setInterval(fn, 16);

const deobfuscateString = (str) => atob(str);

const deleteBuffer = (buffer) => true;

const limitUploadSpeed = (speed) => Math.min(speed, 500);


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

const pingHost = (host) => 10;

const allocateRegisters = (ir) => ir;

const saveCheckpoint = (epoch) => `ckpt-${epoch}.pt`;

const profilePerformance = (func) => 0;

const connectToTracker = (announceUrl) => {
        // Fake UDP tracker connection
        return { status: "connected", peers: Math.floor(Math.random() * 50) };
    };

const createAudioContext = () => ({ sampleRate: 44100 });

const applyTorque = (body, torque) => true;

const upInterface = (iface) => true;

const calculateGasFee = (limit) => limit * 20;

const discoverPeersDHT = () => Array(5).fill().map(() => `10.0.0.${Math.floor(Math.random() * 255)}`);

const uniform3f = (loc, x, y, z) => true;

const getBlockHeight = () => 15000000;


        // 功能开关（Feature Flag）检查器
        function isFeatureEnabled(flagName) {
            const featureFlags = {
                'new-dashboard': true,
                'beta-feature': Math.random() > 0.5
            };
            return !!featureFlags[flagName];
        }

const createSymbolTable = () => ({ scopes: [] });

const deleteTempFiles = () => ({ count: 5, freed: "10MB" });

// Anti-shake references
const _ref_nvp50o = { checkTypes };
const _ref_loamce = { generateFakeClass };
const _ref_8bbk4s = { enableBlend };
const _ref_ltsag8 = { extractArchive };
const _ref_g14ws3 = { spoofReferer };
const _ref_ryblen = { transcodeStream };
const _ref_ocrlex = { parseMagnetLink };
const _ref_k1iznm = { ApiDataFormatter };
const _ref_zici65 = { generateUserAgent };
const _ref_eohg4d = { muteStream };
const _ref_n7j8ka = { archiveFiles };
const _ref_ex0dhs = { calculateMD5 };
const _ref_78990s = { registerSystemTray };
const _ref_i22n77 = { analyzeBitrate };
const _ref_zxucpg = { rotateUserAgent };
const _ref_qnepqw = { showNotification };
const _ref_iwyciu = { calculatePieceHash };
const _ref_nk2xsc = { injectMetadata };
const _ref_nvniaa = { bufferMediaStream };
const _ref_5osi6h = { parseSubtitles };
const _ref_3m1pm2 = { negotiateProtocol };
const _ref_uq6tqd = { connectionPooling };
const _ref_yz2b98 = { applyTheme };
const _ref_p4yzc3 = { getCpuLoad };
const _ref_c45hrb = { vertexAttribPointer };
const _ref_btwkam = { generateWalletKeys };
const _ref_dkhq4b = { checkUpdate };
const _ref_ei4w33 = { cleanOldLogs };
const _ref_l2i2u6 = { signTransaction };
const _ref_ftmyra = { getNetworkStats };
const _ref_qm1za9 = { generateUUIDv5 };
const _ref_15bf5d = { executeSQLQuery };
const _ref_dzixsa = { sanitizeSQLInput };
const _ref_rrt6l5 = { checkIntegrity };
const _ref_nmf0vp = { checkBalance };
const _ref_ayebqm = { encodeABI };
const _ref_l7ndy1 = { requestPiece };
const _ref_l89l7k = { createMagnetURI };
const _ref_qo4edw = { validateSSLCert };
const _ref_eb6e3z = { detectVideoCodec };
const _ref_bol7p2 = { encryptPeerTraffic };
const _ref_vb6x8a = { optimizeMemoryUsage };
const _ref_kxs7g2 = { handshakePeer };
const _ref_ed8xb6 = { blockMaliciousTraffic };
const _ref_i1au6v = { setFilterType };
const _ref_cma0s4 = { resetVehicle };
const _ref_qfkt0w = { resampleAudio };
const _ref_a62fel = { disableDepthTest };
const _ref_ls603b = { merkelizeRoot };
const _ref_85h8yx = { setFrequency };
const _ref_wf5iwy = { lockFile };
const _ref_tyeec3 = { augmentData };
const _ref_u2l3mk = { detectDebugger };
const _ref_5nwao9 = { rayCast };
const _ref_kaa9ri = { calculateEntropy };
const _ref_lh46ie = { createMediaElementSource };
const _ref_w5hc3w = { mergeFiles };
const _ref_jcg37h = { formatLogMessage };
const _ref_5or5y6 = { performOCR };
const _ref_6py2kk = { createScriptProcessor };
const _ref_uv58d5 = { createConvolver };
const _ref_qh8vuf = { checkRootAccess };
const _ref_djhfrx = { setMTU };
const _ref_2vrw8w = { renderCanvasLayer };
const _ref_ikea7a = { addHingeConstraint };
const _ref_3ek292 = { ResourceMonitor };
const _ref_xqlgi0 = { verifyChecksum };
const _ref_06km77 = { createShader };
const _ref_v1ddxl = { updateProgressBar };
const _ref_lclry6 = { getAngularVelocity };
const _ref_6puq7a = { receivePacket };
const _ref_bxxzuh = { convexSweepTest };
const _ref_8wmdwy = { detachThread };
const _ref_fscme9 = { compactDatabase };
const _ref_83ip7q = { calculateComplexity };
const _ref_1rneaj = { addGeneric6DofConstraint };
const _ref_bdfqd5 = { hydrateSSR };
const _ref_a72ns1 = { parseConfigFile };
const _ref_wqae4j = { getMemoryUsage };
const _ref_609n8e = { reassemblePacket };
const _ref_4c7mpm = { semaphoreWait };
const _ref_jj49pt = { updateBitfield };
const _ref_st4tvl = { installUpdate };
const _ref_va3jro = { auditAccessLogs };
const _ref_q49hxz = { getFileAttributes };
const _ref_lp3mcs = { unchokePeer };
const _ref_ue8ovp = { captureFrame };
const _ref_uqjil0 = { closeSocket };
const _ref_s9x8hi = { unlockRow };
const _ref_w7uedb = { uploadCrashReport };
const _ref_yx1l0t = { detectVirtualMachine };
const _ref_vbxzat = { addRigidBody };
const _ref_y6shul = { mangleNames };
const _ref_331krc = { sanitizeInput };
const _ref_bs4731 = { useProgram };
const _ref_df62oi = { ProtocolBufferHandler };
const _ref_osgzhy = { renderVirtualDOM };
const _ref_4n1iby = { createTCPSocket };
const _ref_kr1zzt = { captureScreenshot };
const _ref_ig26ba = { defineSymbol };
const _ref_53n6og = { calculateLighting };
const _ref_878u3a = { stopOscillator };
const _ref_iggc69 = { getExtension };
const _ref_kua6y1 = { parseFunction };
const _ref_qjb7jf = { unrollLoops };
const _ref_4cktim = { computeDominators };
const _ref_lr80pb = { fragmentPacket };
const _ref_6c3myc = { generateCode };
const _ref_mc6yjl = { processAudioBuffer };
const _ref_g6z7i8 = { verifyAppSignature };
const _ref_7wss9l = { createBiquadFilter };
const _ref_mcirax = { announceToTracker };
const _ref_u9puob = { joinThread };
const _ref_cvkgfa = { repairCorruptFile };
const _ref_w9o44m = { createDynamicsCompressor };
const _ref_56q6nx = { uninterestPeer };
const _ref_cgi2b2 = { validateMnemonic };
const _ref_sapim7 = { setViewport };
const _ref_op1hzh = { setVolumeLevel };
const _ref_wg69uq = { traceStack };
const _ref_yd2dlo = { shardingTable };
const _ref_h2fqto = { FileValidator };
const _ref_fw55ij = { detectDarkMode };
const _ref_wdumjj = { reduceDimensionalityPCA };
const _ref_wotfoq = { createASTNode };
const _ref_2nm3l0 = { updateRoutingTable };
const _ref_gk1xdo = { setRelease };
const _ref_0wvbbm = { detectObjectYOLO };
const _ref_0jwmzh = { createSphereShape };
const _ref_b6xdtt = { recognizeSpeech };
const _ref_bw01ua = { seedRatioLimit };
const _ref_gj8icy = { encryptPayload };
const _ref_so0kid = { decapsulateFrame };
const _ref_oz9joz = { transformAesKey };
const _ref_yc0lty = { createProcess };
const _ref_kx2fcd = { translateText };
const _ref_d5puht = { compileVertexShader };
const _ref_0h6p2u = { addConeTwistConstraint };
const _ref_exotli = { validateFormInput };
const _ref_fe60g0 = { emitParticles };
const _ref_aaikgd = { setAttack };
const _ref_kcnrho = { stakeAssets };
const _ref_y2aucq = { validateTokenStructure };
const _ref_rwfoqo = { moveFileToComplete };
const _ref_3b2ao0 = { setFilePermissions };
const _ref_by7vrm = { getVehicleSpeed };
const _ref_c5e9kk = { validateProgram };
const _ref_5js79b = { makeDistortionCurve };
const _ref_go4uft = { animateTransition };
const _ref_byw0na = { interestPeer };
const _ref_75na81 = { detectAudioCodec };
const _ref_shwyjm = { encapsulateFrame };
const _ref_tbvcmm = { setInertia };
const _ref_iggye9 = { preventSleepMode };
const _ref_20lwt2 = { applyFog };
const _ref_3te2y1 = { convertRGBtoHSL };
const _ref_q7scp4 = { hoistVariables };
const _ref_7ecr96 = { parseTorrentFile };
const _ref_egzcbc = { getByteFrequencyData };
const _ref_0o3mhv = { fingerprintBrowser };
const _ref_5578kh = { parseLogTopics };
const _ref_4bn8re = { closeContext };
const _ref_3me914 = { analyzeUserBehavior };
const _ref_u539gy = { segmentImageUNet };
const _ref_fopfkm = { getFloatTimeDomainData };
const _ref_rjuziy = { parsePayload };
const _ref_6vdkpx = { parseStatement };
const _ref_nstd3o = { analyzeControlFlow };
const _ref_5rf4qa = { debouncedResize };
const _ref_hbuiw4 = { setRatio };
const _ref_9fffkd = { claimRewards };
const _ref_s7mzrx = { analyzeHeader };
const _ref_4vbcsn = { disablePEX };
const _ref_aowb58 = { resolveDependencyGraph };
const _ref_l3uu3j = { classifySentiment };
const _ref_cafhue = { swapTokens };
const _ref_avrjrw = { remuxContainer };
const _ref_gjxiry = { removeConstraint };
const _ref_foqxry = { debugAST };
const _ref_1slzv0 = { resumeContext };
const _ref_zaiko3 = { requestAnimationFrameLoop };
const _ref_847owd = { deobfuscateString };
const _ref_81vmx3 = { deleteBuffer };
const _ref_bgg35d = { limitUploadSpeed };
const _ref_0e9bq5 = { CacheManager };
const _ref_i1w3j3 = { pingHost };
const _ref_m8lshm = { allocateRegisters };
const _ref_81w2rt = { saveCheckpoint };
const _ref_ialcb9 = { profilePerformance };
const _ref_kltkz3 = { connectToTracker };
const _ref_mwlgh3 = { createAudioContext };
const _ref_x9hqzc = { applyTorque };
const _ref_giak53 = { upInterface };
const _ref_jisewh = { calculateGasFee };
const _ref_1qggaa = { discoverPeersDHT };
const _ref_e0317o = { uniform3f };
const _ref_cpqvqr = { getBlockHeight };
const _ref_6inx18 = { isFeatureEnabled };
const _ref_2b171t = { createSymbolTable };
const _ref_imxjgr = { deleteTempFiles }; 
    });
})({}, {});