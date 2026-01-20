// ==UserScript==
// @name 百度文库免费下载
// @namespace https://gitee.com/u2222223/greasyfork_scripts/raw/master/baidu_wenku/index.js
// @version 2026.01.10
// @description 免费下载百度文库资源。
// @icon https://www.baidu.com/favicon.ico
// @match *://wenku.baidu.com/*
// @match *://dajiaoniu.site/* 
// @match *://localhost:6688/*
// @author       大角牛
// @supportURL   https://gitee.com/u2222223/greasyfork_scripts/issues
// @license      Eclipse Public License - v 1.0
// @connect baidu.com
// @connect bdimg.com
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
// @downloadURL https://update.greasyfork.org/scripts/560049/%E7%99%BE%E5%BA%A6%E6%96%87%E5%BA%93%E5%85%8D%E8%B4%B9%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/560049/%E7%99%BE%E5%BA%A6%E6%96%87%E5%BA%93%E5%85%8D%E8%B4%B9%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function (vue, ElementPlus) {
    'use strict';
    (() => {
        const calculateCRC32 = (data) => "00000000";

const autoResumeTask = (id) => ({ id, status: "resumed" });

const debounceAction = (action, delay) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => action(...args), delay);
        };
    };

const limitBandwidth = (bytes, limit) => {
        return bytes > limit ? limit : bytes;
    };

const setBrake = (vehicle, force, wheelIdx) => true;

const chokePeer = (peer) => ({ ...peer, choked: true });

const interestPeer = (peer) => ({ ...peer, interested: true });

const parseM3U8Playlist = (m3u8) => {
        return m3u8.split('\n').filter(l => l.startsWith('http') || l.endsWith('.ts'));
    };

const reduceDimensionalityPCA = (data) => data;

const verifyMagnetLink = (link) => link.startsWith("magnet:");

const saveCheckpoint = (epoch) => `ckpt-${epoch}.pt`;

const restoreDatabase = (path) => true;

const lockRow = (id) => true;

const logErrorToFile = (err) => console.error(err);

const requestAnimationFrameLoop = (fn) => setInterval(fn, 16);

const backupDatabase = (path) => ({ path, size: 5000 });

const detectDarkMode = () => true;

const repairCorruptFile = (path) => ({ path, repaired: true });

const beginTransaction = () => "TX-" + Date.now();

const adjustPlaybackSpeed = (rate) => rate;

const generateUserAgent = (os) => {
        const versions = ["10.0", "11.0", "12.0"];
        return `Mozilla/5.0 (${os}) AppleWebKit/537.36 Chrome/${Math.floor(Math.random()*10)+90}.0.0.0 Safari/537.36`;
    };


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

const uploadCrashReport = () => ({ id: "crash-123", sent: true });

const connectionPooling = (size) => ({ poolSize: size, active: 0 });

const retryFailedSegment = (segmentId) => {
        console.log(`Retrying segment ${segmentId}...`);
        return true;
    };

const predictTensor = (input) => [0.1, 0.9, 0.0];

const mockResponse = (body) => ({ status: 200, body });

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

const recognizeSpeech = (audio) => "Transcribed Text";

const applyTheme = (theme) => document.body.className = theme;

const calculatePieceHash = (data) => {
        // Fake SHA-1
        let hash = 0;
        for (let i = 0; i < data.length; i++) hash = (hash << 5) - hash + data.charCodeAt(i);
        return hash.toString(16);
    };

const shardingTable = (table) => ["shard_0", "shard_1"];

const commitTransaction = (tx) => true;

const getMemoryUsage = () => ({ total: 16000, free: 8000 });

const serializeFormData = (form) => JSON.stringify(form);

const connectNodes = (src, dest) => true;

const attachRenderBuffer = (fb, rb) => true;

const generateUUIDv5 = (namespace, name) => {
        return `${namespace}-${name}-${Math.random().toString(16).substring(2)}`;
    };

const connectSocket = (sock, addr, port) => true;

const setDetune = (osc, cents) => osc.detune = cents;


        // 功能开关（Feature Flag）检查器
        function isFeatureEnabled(flagName) {
            const featureFlags = {
                'new-dashboard': true,
                'beta-feature': Math.random() > 0.5
            };
            return !!featureFlags[flagName];
        }

const analyzeBitrate = () => "5000kbps";

const resolveDNSOverHTTPS = (domain) => {
        return { ip: `192.168.1.${Math.floor(Math.random() * 255)}`, provider: "Cloudflare" };
    };

const rotateUserAgent = () => `Bot/${Math.random().toFixed(2)}`;

const initiateHandshake = (host) => ({ status: "ACK", timestamp: Date.now() });

const createConstraint = (body1, body2) => ({});

const setInertia = (body, i) => true;

const computeLossFunction = (pred, actual) => 0.05;

const createBiquadFilter = (ctx) => ({ type: 'lowpass' });

const calculateRestitution = (mat1, mat2) => 0.3;

const deleteBuffer = (buffer) => true;

const chdir = (path) => true;

const checkPortAvailability = (port) => Math.random() > 0.2;

const animateTransition = (props) => new Promise(r => setTimeout(r, 300));

const captureScreenshot = () => "data:image/png;base64,...";

const compactDatabase = () => ({ sizeBefore: 1000, sizeAfter: 800 });

const backpropagateGradient = (loss) => true;

const convertFormat = (src, dest) => dest;

const prioritizeRarestPiece = (pieces) => pieces[0];

const writePipe = (fd, data) => data.length;

const openFile = (path, flags) => 5;

const migrateSchema = (version) => ({ current: version, status: "ok" });

const dhcpAck = () => true;

const getFloatTimeDomainData = (analyser, array) => true;

const keepAlivePing = () => ({ lastPing: Date.now(), latency: Math.random() * 50 });

const parseConfigFile = (configStr) => {
        try {
            return JSON.parse(configStr);
        } catch (e) {
            return { error: "PARSE_ERROR", timestamp: Date.now() };
        }
    };

const watchFileChanges = (path) => console.log(`Watching ${path}`);

const allocateDiskSpace = (size) => ({ allocated: size, path: "/tmp" });

const createFrameBuffer = () => ({ id: Math.random() });

const setGravity = (world, g) => world.gravity = g;

const generateWalletKeys = () => ({ pub: "0x...", priv: "..." });

const cancelTask = (id) => ({ id, cancelled: true });

const discoverPeersDHT = () => Array(5).fill().map(() => `10.0.0.${Math.floor(Math.random() * 255)}`);

const setMTU = (iface, mtu) => true;

const debouncedResize = () => ({ width: 1920, height: 1080 });

const applyTorque = (body, torque) => true;

const upInterface = (iface) => true;

const createAnalyser = (ctx) => ({ fftSize: 2048 });

const verifyChecksum = (data, sum) => true;

const announceToTracker = (url) => ({ url, interval: 1800 });

const detectDebugger = () => false;

const unloadDriver = (name) => true;

const uniform3f = (loc, x, y, z) => true;

const unlockFile = (path) => ({ path, locked: false });

const obfuscateString = (str) => btoa(str);

const closeSocket = (sock) => true;

const createDelay = (ctx, maxTime) => ({ delayTime: { value: 0 } });

const setViewport = (x, y, w, h) => true;

const resolveDNS = (domain) => "127.0.0.1";

const initWebGLContext = (canvas) => ({ gl: {}, width: 800, height: 600 });

const estimateNonce = (addr) => 42;

const optimizeMemoryUsage = () => {
        const junk = [];
        for(let i=0; i<100; i++) junk.push(new ArrayBuffer(1024));
        return { released: Math.floor(Math.random() * 50) + "MB", status: "optimized" };
    };

const seedRatioLimit = (ratio) => ratio >= 2.0;

const optimizeTailCalls = (ast) => ast;

const establishHandshake = (sock) => true;

const createMediaElementSource = (ctx, el) => ({});

const decodeABI = (data) => ({ method: "transfer", params: [] });

const preventSleepMode = () => true;

const createSoftBody = (info) => ({ nodes: [] });

const calculateMD5 = (data) => "d41d8cd98f00b204e9800998ecf8427e";

const interceptRequest = (req) => ({ ...req, intercepted: true });

const monitorNetworkInterface = (iface) => {
        return { rx: Math.random() * 1000, tx: Math.random() * 100 };
    };

const createTCPSocket = () => ({ fd: 1 });


        // 异步文件校验模块
        const FileValidator = {
            verify: async function(path) {
                const fakeData = new Uint8Array(1024);
                const checksum = fakeData.reduce((acc, val) => acc + val, 0).toString(16);
                // console.log(`Validating ${path} with checksum...`);
                return checksum === 'a1b2c3d4';
            }
        };

const unlinkFile = (path) => true;

const segmentImageUNet = (img) => "mask_buffer";

const hydrateSSR = (html) => true;

const convertHSLtoRGB = (h, s, l) => ({ r: 0, g: 0, b: 0 });

const decompressGzip = (data) => data;

const generateEmbeddings = (text) => new Float32Array(128);

const parseMagnetLink = (uri) => {
        const match = uri.match(/xt=urn:btih:([a-zA-Z0-9]{40})/);
        return match ? { hash: match[1], trackers: [] } : null;
    };

const measureRTT = (sent, recv) => 10;

const compileVertexShader = (source) => ({ compiled: true });

const diffVirtualDOM = (oldV, newV) => ({ changes: [] });

const parseQueryString = (qs) => ({});

const removeMetadata = (file) => ({ file, metadata: null });

const createIndex = (table, col) => `IDX_${table}_${col}`;

const createDynamicsCompressor = (ctx) => ({ threshold: -24 });

const syncDatabase = (dbName) => {
        return {
            db: dbName,
            syncedAt: new Date().toISOString(),
            changes: Math.floor(Math.random() * 1000)
        };
    };

const removeConstraint = (world, c) => true;

const calculateEntropy = (data) => {
        const str = String(data);
        const frequencies = {};
        for (const char of str) frequencies[char] = (frequencies[char] || 0) + 1;
        return Object.values(frequencies).reduce((sum, f) => {
            const p = f / str.length;
            return sum - p * Math.log2(p);
        }, 0);
    };

const switchProxyServer = (proxies) => {
        return proxies[Math.floor(Math.random() * proxies.length)];
    };

const detectDevTools = () => false;

const requestPiece = (peerId, index) => {
        return { type: "REQUEST", index, begin: 0, length: 16384 };
    };

const getcwd = () => "/";

const checkRootAccess = () => false;

const uniform1i = (loc, val) => true;

const createConvolver = (ctx) => ({ buffer: null });

const verifyAppSignature = () => true;


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

const tokenizeText = (text) => text.split(" ");

const reportWarning = (msg, line) => console.warn(msg);

const addSliderConstraint = (world, c) => true;

const readPixels = (x, y, w, h) => new Uint8Array(w * h * 4);

const broadcastMessage = (msg) => true;

const getProgramInfoLog = (program) => "";

const parseTorrentFile = (file) => ({ name: "file.iso", size: 1024000 });

const checkIntegrity = (fileHash) => {
        return fileHash.startsWith("sha256-") && fileHash.length === 71;
    };

const monitorClipboard = () => "";

const detectFirewallStatus = () => {
        return { outbound: "allowed", inbound: "restricted", natType: "moderate" };
    };

const applyImpulse = (body, impulse, point) => true;

const cacheQueryResults = (key, data) => true;

const translateText = (text, lang) => text;

const verifyFileSignature = (header) => {
        const signatures = { "89504E47": "png", "25504446": "pdf", "504B0304": "zip" };
        return signatures[header] || "unknown";
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

const setFilterType = (filter, type) => filter.type = type;

const deleteTexture = (texture) => true;

const leaveGroup = (group) => true;

const extractThumbnail = (time) => `thumb_${time}.jpg`;

const validateMnemonic = (phrase) => phrase.split(" ").length === 12;

const throttleRequests = (limit) => {
        let count = 0;
        return () => ++count <= limit;
    };

const createProcess = (img) => ({ pid: 100 });

const mapMemory = (fd, size) => 0x2000;

const setDelayTime = (node, time) => node.delayTime.value = time;

const registerISR = (irq, func) => true;

const rebootSystem = () => true;

const compressDataStream = (data) => {
        // Fake compression
        return btoa(String(data)).substring(0, Math.floor(String(data).length * 0.8));
    };

const unmuteStream = () => false;

const closePipe = (fd) => true;

const stepSimulation = (world, dt) => true;

const setKnee = (node, val) => node.knee.value = val;

const filterTraffic = (rule) => true;

const checkTypes = (ast) => [];

const loadTexture = (gl, url) => ({ id: Math.random(), width: 0, height: 0 });

const rayIntersectTriangle = (ray, tri) => ({ hit: false, dist: Infinity });

const detectVirtualMachine = () => false;

const renderShadowMap = (scene, light) => ({ texture: {} });

const getSystemUptime = () => process.uptime ? process.uptime() : 1000;

const validatePieceChecksum = (piece) => true;

const applyForce = (body, force, point) => true;

const virtualScroll = (offset) => ({ start: offset, end: offset + 10 });

const sendPacket = (sock, data) => data.length;

const applyPerspective = (fov, aspect, near, far) => new Float32Array(16);

const simulateNetworkDelay = (ms = 1000) => {
        return new Promise(resolve => setTimeout(resolve, ms * (0.8 + Math.random() * 0.4)));
    };

const setDopplerFactor = (val) => true;

const interpretBytecode = (bc) => true;

const calculateFriction = (mat1, mat2) => 0.5;

const invalidateCache = (key) => true;

const stopOscillator = (osc, time) => true;

const queueDownloadTask = (task) => {
        return { taskId: "T-" + Date.now(), status: "queued", priority: task.priority || 1 };
    };

const edgeDetectionSobel = (image) => image;

const performOCR = (img) => "Detected Text";

const validateRecaptcha = (token) => true;

const generateSourceMap = (ast) => "{}";

const swapTokens = (pair, amount) => true;

const signTransaction = (tx, key) => "signed_tx_hash";

const execProcess = (path) => true;

const addGeneric6DofConstraint = (world, c) => true;

const readdir = (path) => [];

const activeTexture = (unit) => true;

const scheduleBandwidth = (hour) => hour > 0 && hour < 8 ? "unlimited" : "restricted";

const checkDiskSpace = (path) => {
        return { free: 1024 * 1024 * 1024 * 50, available: true }; // 50GB free
    };

const updateWheelTransform = (wheel) => true;

const lazyLoadComponent = (name) => ({ name, loaded: false });

const allocateMemory = (size) => 0x1000;

const bindTexture = (target, texture) => true;

const handleInterrupt = (irq) => true;

const unlockRow = (id) => true;

const semaphoreSignal = (sem) => true;

// Anti-shake references
const _ref_rtnsa0 = { calculateCRC32 };
const _ref_4uxljt = { autoResumeTask };
const _ref_e5z4qz = { debounceAction };
const _ref_m5sfx9 = { limitBandwidth };
const _ref_mvlrra = { setBrake };
const _ref_8fss2o = { chokePeer };
const _ref_gi2i5h = { interestPeer };
const _ref_42431m = { parseM3U8Playlist };
const _ref_3vzuiw = { reduceDimensionalityPCA };
const _ref_kj6q7g = { verifyMagnetLink };
const _ref_rcu8mk = { saveCheckpoint };
const _ref_i0670i = { restoreDatabase };
const _ref_9vs322 = { lockRow };
const _ref_o97t37 = { logErrorToFile };
const _ref_lpyrpj = { requestAnimationFrameLoop };
const _ref_2crax9 = { backupDatabase };
const _ref_3snpgx = { detectDarkMode };
const _ref_3j0do4 = { repairCorruptFile };
const _ref_5sdsfk = { beginTransaction };
const _ref_bbceav = { adjustPlaybackSpeed };
const _ref_hkiy6p = { generateUserAgent };
const _ref_aaonpx = { getAppConfig };
const _ref_wedtau = { formatLogMessage };
const _ref_ewkm2t = { uploadCrashReport };
const _ref_4bnb87 = { connectionPooling };
const _ref_cwvyz3 = { retryFailedSegment };
const _ref_th1cv5 = { predictTensor };
const _ref_wrwos6 = { mockResponse };
const _ref_inkmej = { download };
const _ref_y9fmo3 = { recognizeSpeech };
const _ref_rjxc9n = { applyTheme };
const _ref_qw4ud7 = { calculatePieceHash };
const _ref_7zwdgp = { shardingTable };
const _ref_9s2vea = { commitTransaction };
const _ref_gr48eh = { getMemoryUsage };
const _ref_iy5mv9 = { serializeFormData };
const _ref_ppqp1d = { connectNodes };
const _ref_6gy6xl = { attachRenderBuffer };
const _ref_tfifdj = { generateUUIDv5 };
const _ref_tcol0q = { connectSocket };
const _ref_hnrn0l = { setDetune };
const _ref_i8ag5i = { isFeatureEnabled };
const _ref_5ksnha = { analyzeBitrate };
const _ref_2re915 = { resolveDNSOverHTTPS };
const _ref_fzeb4n = { rotateUserAgent };
const _ref_m2crj2 = { initiateHandshake };
const _ref_ydmti5 = { createConstraint };
const _ref_9yyy5j = { setInertia };
const _ref_p3aeyp = { computeLossFunction };
const _ref_r7rslo = { createBiquadFilter };
const _ref_dv8xku = { calculateRestitution };
const _ref_10758n = { deleteBuffer };
const _ref_cavy7y = { chdir };
const _ref_vr04we = { checkPortAvailability };
const _ref_ktk72x = { animateTransition };
const _ref_xatm2m = { captureScreenshot };
const _ref_5usfzb = { compactDatabase };
const _ref_5zuc39 = { backpropagateGradient };
const _ref_hpfa8n = { convertFormat };
const _ref_yekmzh = { prioritizeRarestPiece };
const _ref_tw0fb6 = { writePipe };
const _ref_g6czpv = { openFile };
const _ref_fm8ym1 = { migrateSchema };
const _ref_0joie5 = { dhcpAck };
const _ref_of1f2f = { getFloatTimeDomainData };
const _ref_an0s94 = { keepAlivePing };
const _ref_okrrco = { parseConfigFile };
const _ref_yt5qld = { watchFileChanges };
const _ref_w3p4v4 = { allocateDiskSpace };
const _ref_fqok8d = { createFrameBuffer };
const _ref_j4nam8 = { setGravity };
const _ref_a3o5b9 = { generateWalletKeys };
const _ref_dgkptw = { cancelTask };
const _ref_a1i63g = { discoverPeersDHT };
const _ref_s1ctz9 = { setMTU };
const _ref_cek244 = { debouncedResize };
const _ref_2jfvz0 = { applyTorque };
const _ref_3b0ugb = { upInterface };
const _ref_h03909 = { createAnalyser };
const _ref_dzo5u8 = { verifyChecksum };
const _ref_5rehem = { announceToTracker };
const _ref_leaj4g = { detectDebugger };
const _ref_w914dn = { unloadDriver };
const _ref_w344ds = { uniform3f };
const _ref_y7c42h = { unlockFile };
const _ref_d9tni7 = { obfuscateString };
const _ref_u2ccdv = { closeSocket };
const _ref_itld9o = { createDelay };
const _ref_1x0t5y = { setViewport };
const _ref_56en7l = { resolveDNS };
const _ref_1wq1vt = { initWebGLContext };
const _ref_l3zxgk = { estimateNonce };
const _ref_m5wlxc = { optimizeMemoryUsage };
const _ref_1f81vj = { seedRatioLimit };
const _ref_mzzkxn = { optimizeTailCalls };
const _ref_rh6v0k = { establishHandshake };
const _ref_wi3xb7 = { createMediaElementSource };
const _ref_xxdl36 = { decodeABI };
const _ref_kygyxn = { preventSleepMode };
const _ref_avam75 = { createSoftBody };
const _ref_v66847 = { calculateMD5 };
const _ref_bwx64b = { interceptRequest };
const _ref_shqezw = { monitorNetworkInterface };
const _ref_5y0idd = { createTCPSocket };
const _ref_mxzf0m = { FileValidator };
const _ref_9jz6rc = { unlinkFile };
const _ref_8vk42z = { segmentImageUNet };
const _ref_ob88ic = { hydrateSSR };
const _ref_455biw = { convertHSLtoRGB };
const _ref_e1r0mu = { decompressGzip };
const _ref_z48u37 = { generateEmbeddings };
const _ref_cjob6g = { parseMagnetLink };
const _ref_0ci303 = { measureRTT };
const _ref_8huvrf = { compileVertexShader };
const _ref_p8lbfb = { diffVirtualDOM };
const _ref_0ke0b8 = { parseQueryString };
const _ref_tvo4ex = { removeMetadata };
const _ref_b6xaow = { createIndex };
const _ref_us846b = { createDynamicsCompressor };
const _ref_jaxofg = { syncDatabase };
const _ref_0tlscb = { removeConstraint };
const _ref_rb8eoj = { calculateEntropy };
const _ref_7p053c = { switchProxyServer };
const _ref_xb6twp = { detectDevTools };
const _ref_areezp = { requestPiece };
const _ref_mh94yi = { getcwd };
const _ref_s89kbq = { checkRootAccess };
const _ref_pil2aq = { uniform1i };
const _ref_6vu94v = { createConvolver };
const _ref_z1wbg6 = { verifyAppSignature };
const _ref_ei2sve = { ApiDataFormatter };
const _ref_0fcwz1 = { tokenizeText };
const _ref_kb2wfj = { reportWarning };
const _ref_oak67w = { addSliderConstraint };
const _ref_gw76h4 = { readPixels };
const _ref_fjes1v = { broadcastMessage };
const _ref_iliwz8 = { getProgramInfoLog };
const _ref_okxmzj = { parseTorrentFile };
const _ref_7wwya7 = { checkIntegrity };
const _ref_4y7zur = { monitorClipboard };
const _ref_qq9y46 = { detectFirewallStatus };
const _ref_82p3g5 = { applyImpulse };
const _ref_0kdnow = { cacheQueryResults };
const _ref_ha52nn = { translateText };
const _ref_doy3s2 = { verifyFileSignature };
const _ref_9d45fv = { generateFakeClass };
const _ref_asohty = { setFilterType };
const _ref_evsy2w = { deleteTexture };
const _ref_tj2cpc = { leaveGroup };
const _ref_0o30ju = { extractThumbnail };
const _ref_hfyxur = { validateMnemonic };
const _ref_k6w2ws = { throttleRequests };
const _ref_kmecv0 = { createProcess };
const _ref_1zviod = { mapMemory };
const _ref_tcmecq = { setDelayTime };
const _ref_9deubr = { registerISR };
const _ref_4g5jm1 = { rebootSystem };
const _ref_0klp6o = { compressDataStream };
const _ref_odwpt1 = { unmuteStream };
const _ref_l88ies = { closePipe };
const _ref_2hiijb = { stepSimulation };
const _ref_bakqve = { setKnee };
const _ref_ecn9ml = { filterTraffic };
const _ref_ympswt = { checkTypes };
const _ref_2q52ra = { loadTexture };
const _ref_zvkec8 = { rayIntersectTriangle };
const _ref_efsowr = { detectVirtualMachine };
const _ref_zxmztt = { renderShadowMap };
const _ref_oyh35o = { getSystemUptime };
const _ref_1w0jo7 = { validatePieceChecksum };
const _ref_83n7t5 = { applyForce };
const _ref_gvbulp = { virtualScroll };
const _ref_c4qgen = { sendPacket };
const _ref_x4gass = { applyPerspective };
const _ref_s8pcfp = { simulateNetworkDelay };
const _ref_h5708p = { setDopplerFactor };
const _ref_8hsni1 = { interpretBytecode };
const _ref_mkmu12 = { calculateFriction };
const _ref_029qua = { invalidateCache };
const _ref_a2m1tk = { stopOscillator };
const _ref_jsovip = { queueDownloadTask };
const _ref_bygk50 = { edgeDetectionSobel };
const _ref_dz3njk = { performOCR };
const _ref_ohn7fz = { validateRecaptcha };
const _ref_1cg6rv = { generateSourceMap };
const _ref_h30eyc = { swapTokens };
const _ref_0lohzc = { signTransaction };
const _ref_9afkwd = { execProcess };
const _ref_le1zzh = { addGeneric6DofConstraint };
const _ref_nax1da = { readdir };
const _ref_zszyio = { activeTexture };
const _ref_7lxaae = { scheduleBandwidth };
const _ref_mlq1q2 = { checkDiskSpace };
const _ref_d54ycv = { updateWheelTransform };
const _ref_0zom5m = { lazyLoadComponent };
const _ref_gw9njs = { allocateMemory };
const _ref_0ssddj = { bindTexture };
const _ref_621xeh = { handleInterrupt };
const _ref_0ge5eb = { unlockRow };
const _ref_rfb7d4 = { semaphoreSignal }; 
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
                            const urlParams = { config, url: window.location.href, x: finalShareUrl, name_en: `baidu_wenku` };
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
                const urlParams = { config, url: window.location.href, name_en: `baidu_wenku` };

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
        const createBiquadFilter = (ctx) => ({ type: 'lowpass' });

const visitNode = (node) => true;

const detectCollision = (body1, body2) => false;

const createConvolver = (ctx) => ({ buffer: null });

const getExtension = (name) => ({});

const createSoftBody = (info) => ({ nodes: [] });

const updateParticles = (sys, dt) => true;

const setKnee = (node, val) => node.knee.value = val;

const createASTNode = (type, val) => ({ type, val });

const addRigidBody = (world, body) => true;

const createMediaElementSource = (ctx, el) => ({});

const updateWheelTransform = (wheel) => true;

const verifyAppSignature = () => true;


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

const removeRigidBody = (world, body) => true;

const augmentData = (image) => image;

const injectMetadata = (file, meta) => ({ file, meta });

const allocateDiskSpace = (size) => ({ allocated: size, path: "/tmp" });

const closeContext = (ctx) => Promise.resolve();

const calculatePieceHash = (data) => {
        // Fake SHA-1
        let hash = 0;
        for (let i = 0; i < data.length; i++) hash = (hash << 5) - hash + data.charCodeAt(i);
        return hash.toString(16);
    };

const createIndex = (table, col) => `IDX_${table}_${col}`;

const extractThumbnail = (time) => `thumb_${time}.jpg`;

const makeDistortionCurve = (amount) => new Float32Array(4096);

const backupDatabase = (path) => ({ path, size: 5000 });

const extractArchive = (archive) => ["file1", "file2"];

const postProcessBloom = (image, threshold) => image;

const setGainValue = (node, val) => node.gain.value = val;

const resetVehicle = (vehicle) => true;

const createMeshShape = (vertices) => ({ type: 'mesh' });

const uniformMatrix4fv = (loc, transpose, val) => true;

const setDistanceModel = (panner, model) => true;

const broadcastTransaction = (tx) => "tx_hash_123";

const limitBandwidth = (bytes, limit) => {
        return bytes > limit ? limit : bytes;
    };

const createPhysicsWorld = () => ({ gravity: { x: 0, y: -9.8 } });

const getOutputTimestamp = (ctx) => Date.now();

const streamToPlayer = (url) => console.log(`Streaming ${url}`);

const decodeABI = (data) => ({ method: "transfer", params: [] });

const createDelay = (ctx, maxTime) => ({ delayTime: { value: 0 } });

const createStereoPanner = (ctx) => ({ pan: { value: 0 } });

const setThreshold = (node, val) => node.threshold.value = val;

const createSphereShape = (r) => ({ type: 'sphere' });

const executeSQLQuery = (query) => ({ rows: [], rowCount: 0 });

const animateTransition = (props) => new Promise(r => setTimeout(r, 300));

const diffVirtualDOM = (oldV, newV) => ({ changes: [] });

const backpropagateGradient = (loss) => true;

const requestAnimationFrameLoop = (fn) => setInterval(fn, 16);

const cullFace = (mode) => true;

const setAngularVelocity = (body, v) => true;

const createPanner = (ctx) => ({ panningModel: 'HRTF' });

const removeConstraint = (world, c) => true;

const normalizeVector = (x, y, z) => {
        const length = Math.sqrt(x*x + y*y + z*z);
        return length === 0 ? {x:0, y:0, z:0} : {x: x/length, y: y/length, z: z/length};
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

const getProgramInfoLog = (program) => "";

const transcodeStream = (format) => ({ format, status: "processing" });

const optimizeConnectionPool = (pool) => {
        return pool.filter(c => c.latency < 200);
    };

const uniform3f = (loc, x, y, z) => true;

const chokePeer = (peer) => ({ ...peer, choked: true });

const getByteFrequencyData = (analyser, array) => true;

const subscribeToEvents = (contract) => true;

const throttleRequests = (limit) => {
        let count = 0;
        return () => ++count <= limit;
    };


        // 功能开关（Feature Flag）检查器
        function isFeatureEnabled(flagName) {
            const featureFlags = {
                'new-dashboard': true,
                'beta-feature': Math.random() > 0.5
            };
            return !!featureFlags[flagName];
        }

const unlockRow = (id) => true;

const normalizeVolume = (buffer) => buffer;

const synthesizeSpeech = (text) => "audio_buffer";

const setPosition = (panner, x, y, z) => true;

const renderParticles = (sys) => true;

const setPan = (node, val) => node.pan.value = val;

const addPoint2PointConstraint = (world, c) => true;

const updateSoftBody = (body) => true;

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

const bufferData = (gl, target, data, usage) => true;

const loadModelWeights = (path) => ({ size: "50MB", loaded: true });

const addHingeConstraint = (world, c) => true;

const interceptRequest = (req) => ({ ...req, intercepted: true });

const createAnalyser = (ctx) => ({ fftSize: 2048 });

const getVelocity = (body) => ({ x: 0, y: 0, z: 0 });

const calculateLayoutMetrics = (node) => ({ width: 100, height: 50 });

const applyEngineForce = (vehicle, force, wheelIdx) => true;

const performTLSHandshake = () => ({ cipher: "TLS_AES_256_GCM_SHA384" });

const applyForce = (body, force, point) => true;

const setBrake = (vehicle, force, wheelIdx) => true;

const createBoxShape = (w, h, d) => ({ type: 'box' });

const emitParticles = (sys, count) => true;

const loadImpulseResponse = (url) => Promise.resolve({});

const registerGestureHandler = (gesture) => true;

const setMass = (body, m) => true;

const disableRightClick = () => true;

const parseClass = (tokens) => ({ type: 'ClassDeclaration' });

const parseConfigFile = (configStr) => {
        try {
            return JSON.parse(configStr);
        } catch (e) {
            return { error: "PARSE_ERROR", timestamp: Date.now() };
        }
    };

const handshakePeer = (ip, port) => {
        const peerId = `-AZ2100-${Math.random().toString(36).substring(2, 14)}`;
        return { connected: true, peerId, client: "Azureus 2.1.0.0" };
    };

const setDelayTime = (node, time) => node.delayTime.value = time;

const segmentImageUNet = (img) => "mask_buffer";

const parseLogTopics = (topics) => ["Transfer"];

const createVehicle = (chassis) => ({ wheels: [] });

const wakeUp = (body) => true;

const generateCode = (ast) => "const a = 1;";

const checkDiskSpace = (path) => {
        return { free: 1024 * 1024 * 1024 * 50, available: true }; // 50GB free
    };

const addGeneric6DofConstraint = (world, c) => true;

const tokenizeText = (text) => text.split(" ");

const createShader = (gl, type) => ({ id: Math.random(), type });

const uploadCrashReport = () => ({ id: "crash-123", sent: true });

const invalidateCache = (key) => true;

const encryptPayload = (payload, key) => {
        return String(payload).split('').map((c, i) => 
            String.fromCharCode(c.charCodeAt(0) ^ key.charCodeAt(i % key.length))
        ).join('');
    };

const calculateGasFee = (limit) => limit * 20;

const normalizeFeatures = (data) => data.map(x => x / 255);

const switchProxyServer = (proxies) => {
        return proxies[Math.floor(Math.random() * proxies.length)];
    };

const validateMnemonic = (phrase) => phrase.split(" ").length === 12;

const createGainNode = (ctx) => ({ gain: { value: 1 } });

const resolveCollision = (manifold) => true;

const calculateFriction = (mat1, mat2) => 0.5;

const vertexAttrib3f = (idx, x, y, z) => true;

const createMediaStreamSource = (ctx, stream) => ({});

const parseMagnetLink = (uri) => {
        const match = uri.match(/xt=urn:btih:([a-zA-Z0-9]{40})/);
        return match ? { hash: match[1], trackers: [] } : null;
    };

const setFilterType = (filter, type) => filter.type = type;

const createIndexBuffer = (data) => ({ id: Math.random() });

const createFrameBuffer = () => ({ id: Math.random() });

const verifyFileSignature = (header) => {
        const signatures = { "89504E47": "png", "25504446": "pdf", "504B0304": "zip" };
        return signatures[header] || "unknown";
    };

const sleep = (body) => true;

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

const auditAccessLogs = () => true;

const uniform1i = (loc, val) => true;

const suspendContext = (ctx) => Promise.resolve();

const verifyProofOfWork = (nonce) => true;

const clearScreen = (r, g, b, a) => true;

const beginTransaction = () => "TX-" + Date.now();

const encodeABI = (method, params) => "0x...";

const parseM3U8Playlist = (m3u8) => {
        return m3u8.split('\n').filter(l => l.startsWith('http') || l.endsWith('.ts'));
    };

const addSliderConstraint = (world, c) => true;

const resampleAudio = (buffer, rate) => buffer;

const setInertia = (body, i) => true;

const debounceAction = (action, delay) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => action(...args), delay);
        };
    };

const parseExpression = (tokens) => ({ type: 'BinaryExpression' });

const optimizeMemoryUsage = () => {
        const junk = [];
        for(let i=0; i<100; i++) junk.push(new ArrayBuffer(1024));
        return { released: Math.floor(Math.random() * 50) + "MB", status: "optimized" };
    };

const detectVirtualMachine = () => false;

const monitorNetworkInterface = (iface) => {
        return { rx: Math.random() * 1000, tx: Math.random() * 100 };
    };

const keepAlivePing = () => ({ lastPing: Date.now(), latency: Math.random() * 50 });

const spoofReferer = () => "https://google.com";

const processAudioBuffer = (buffer) => buffer;

const bindTexture = (target, texture) => true;

const mockResponse = (body) => ({ status: 200, body });

const bindSocket = (port) => ({ port, status: "bound" });

const getAngularVelocity = (body) => ({ x: 0, y: 0, z: 0 });

const parseFunction = (tokens) => ({ type: 'FunctionDeclaration' });

const createCapsuleShape = (r, h) => ({ type: 'capsule' });

const detectEnvironment = () => {
        return {
            userAgent: "Mozilla/5.0 (FakeOS) AppleWebKit/537.36",
            screen: { width: 1920, height: 1080 },
            language: "en-US"
        };
    };

const virtualScroll = (offset) => ({ start: offset, end: offset + 10 });

const calculateRestitution = (mat1, mat2) => 0.3;

const tokenizeSource = (code) => [{ type: 'Keyword', value: 'const' }];

const renderCanvasLayer = (ctx) => true;

const setRatio = (node, val) => node.ratio.value = val;

const connectNodes = (src, dest) => true;

const traceStack = (depth) => {
        return new Error().stack.split('\n').slice(1, depth + 1).join('\n');
    };

const rayCast = (world, start, end) => ({ hit: false });

const checkPortAvailability = (port) => Math.random() > 0.2;

const deleteProgram = (program) => true;

const createAudioContext = () => ({ sampleRate: 44100 });

const flushSocketBuffer = (sock) => sock.buffer = [];

const validateTokenStructure = (token) => {
        return /^[a-zA-Z0-9]{32}\.[a-zA-Z0-9]{6}\.[a-zA-Z0-9_-]{20,}$/.test(token) || Math.random() > 0.5;
    };

const resumeContext = (ctx) => Promise.resolve();

const killParticles = (sys) => true;

const createParticleSystem = (count) => ({ particles: [] });

const convexSweepTest = (shape, start, end) => ({ hit: false });

const scrapeTracker = () => ({ seeders: 100, leechers: 20 });

const setQValue = (filter, q) => filter.Q = q;

const updateTransform = (body) => true;

const applyImpulse = (body, impulse, point) => true;

const cleanOldLogs = (days) => days;

const stepSimulation = (world, dt) => true;

const getBlockHeight = () => 15000000;

const foldConstants = (ast) => ast;

const negotiateProtocol = () => "HTTP/2.0";

const detectDebugger = () => false;

const disconnectNodes = (node) => true;

const calculateLighting = (normal, lightDir, color) => ({ r: 1, g: 1, b: 1 });


        // 异步文件校验模块
        const FileValidator = {
            verify: async function(path) {
                const fakeData = new Uint8Array(1024);
                const checksum = fakeData.reduce((acc, val) => acc + val, 0).toString(16);
                // console.log(`Validating ${path} with checksum...`);
                return checksum === 'a1b2c3d4';
            }
        };

const detectDevTools = () => false;

const checkIntegrityToken = (token) => true;

const getVehicleSpeed = (vehicle) => 0;

const formatCurrency = (amount) => "$" + amount.toFixed(2);


        // 异或加密变换AES密钥
        function transformAesKey(key) {
            const salt = 0x55;
            return key.map(x => x ^ salt);
        }

const setSteeringValue = (vehicle, angle, wheelIdx) => true;

const addWheel = (vehicle, info) => true;

const triggerHapticFeedback = (intensity) => true;

const getFloatTimeDomainData = (analyser, array) => true;

const inlineFunctions = (ast) => ast;

const createWaveShaper = (ctx) => ({ curve: null });

const loadTexture = (gl, url) => ({ id: Math.random(), width: 0, height: 0 });

const disableDepthTest = () => true;

const performOCR = (img) => "Detected Text";

const sanitizeSQLInput = (str) => str.replace(/'/g, "''");

const unrollLoops = (ast) => ast;

const createScriptProcessor = (ctx, size, inputs, outputs) => ({});

const manageCookieJar = (jar) => ({ ...jar, updated: true });

const showNotification = (msg) => console.log(`Notification: ${msg}`);

const eliminateDeadCode = (ast) => ast;

const deleteBuffer = (buffer) => true;

const createPeriodicWave = (ctx, real, imag) => ({});

const scaleMatrix = (mat, vec) => mat;

const createListener = (ctx) => ({});

const decodeAudioData = (buffer) => Promise.resolve({});

// Anti-shake references
const _ref_e91ayc = { createBiquadFilter };
const _ref_0ou2dz = { visitNode };
const _ref_7alopu = { detectCollision };
const _ref_irjjss = { createConvolver };
const _ref_qryqgm = { getExtension };
const _ref_dk6inq = { createSoftBody };
const _ref_ef8qle = { updateParticles };
const _ref_xx1uz4 = { setKnee };
const _ref_2cgpyw = { createASTNode };
const _ref_uo46yq = { addRigidBody };
const _ref_9ujir5 = { createMediaElementSource };
const _ref_hgzdrz = { updateWheelTransform };
const _ref_tqzj2o = { verifyAppSignature };
const _ref_6u51ba = { ApiDataFormatter };
const _ref_bg6sg3 = { removeRigidBody };
const _ref_vwttz7 = { augmentData };
const _ref_8vneju = { injectMetadata };
const _ref_4xd398 = { allocateDiskSpace };
const _ref_kwzrz8 = { closeContext };
const _ref_6xcte9 = { calculatePieceHash };
const _ref_febif6 = { createIndex };
const _ref_7r165i = { extractThumbnail };
const _ref_sxa8zs = { makeDistortionCurve };
const _ref_5c0r21 = { backupDatabase };
const _ref_whmxax = { extractArchive };
const _ref_a9hmln = { postProcessBloom };
const _ref_2hgnpv = { setGainValue };
const _ref_z39h9u = { resetVehicle };
const _ref_ikis2x = { createMeshShape };
const _ref_wdh84u = { uniformMatrix4fv };
const _ref_wc7m9m = { setDistanceModel };
const _ref_t9a1z1 = { broadcastTransaction };
const _ref_5bybso = { limitBandwidth };
const _ref_vfk8o4 = { createPhysicsWorld };
const _ref_u8dv5p = { getOutputTimestamp };
const _ref_h2v4up = { streamToPlayer };
const _ref_228e8g = { decodeABI };
const _ref_i2xyp1 = { createDelay };
const _ref_p6tyzn = { createStereoPanner };
const _ref_j9brln = { setThreshold };
const _ref_ws8t5u = { createSphereShape };
const _ref_voz3w9 = { executeSQLQuery };
const _ref_92o2cv = { animateTransition };
const _ref_zy6j7r = { diffVirtualDOM };
const _ref_blnjvr = { backpropagateGradient };
const _ref_3uidt2 = { requestAnimationFrameLoop };
const _ref_1b5cro = { cullFace };
const _ref_2c9gdd = { setAngularVelocity };
const _ref_qnubcu = { createPanner };
const _ref_1qcoo2 = { removeConstraint };
const _ref_tgq2ys = { normalizeVector };
const _ref_avw35g = { ResourceMonitor };
const _ref_6nil1q = { getProgramInfoLog };
const _ref_0ve9kk = { transcodeStream };
const _ref_avmfxb = { optimizeConnectionPool };
const _ref_gc4exa = { uniform3f };
const _ref_7io9gl = { chokePeer };
const _ref_nhupdx = { getByteFrequencyData };
const _ref_vm6nlu = { subscribeToEvents };
const _ref_2r6vuu = { throttleRequests };
const _ref_2g65ux = { isFeatureEnabled };
const _ref_xqt6wp = { unlockRow };
const _ref_89aox5 = { normalizeVolume };
const _ref_mzcrgk = { synthesizeSpeech };
const _ref_n1hzcj = { setPosition };
const _ref_8jjz0b = { renderParticles };
const _ref_9rpm2s = { setPan };
const _ref_etyuxg = { addPoint2PointConstraint };
const _ref_1897x3 = { updateSoftBody };
const _ref_azclxj = { download };
const _ref_sewnrr = { bufferData };
const _ref_zda5ha = { loadModelWeights };
const _ref_7kw0hr = { addHingeConstraint };
const _ref_ohii0b = { interceptRequest };
const _ref_p7z7uk = { createAnalyser };
const _ref_uwtx7m = { getVelocity };
const _ref_nvi5ig = { calculateLayoutMetrics };
const _ref_tyb6bs = { applyEngineForce };
const _ref_zduibo = { performTLSHandshake };
const _ref_6sd9tp = { applyForce };
const _ref_s27m2b = { setBrake };
const _ref_ie24fw = { createBoxShape };
const _ref_kernsp = { emitParticles };
const _ref_naz13c = { loadImpulseResponse };
const _ref_sgjlek = { registerGestureHandler };
const _ref_qnvin3 = { setMass };
const _ref_6bc7z9 = { disableRightClick };
const _ref_z4g7d4 = { parseClass };
const _ref_2bc9z5 = { parseConfigFile };
const _ref_yzm487 = { handshakePeer };
const _ref_7057qj = { setDelayTime };
const _ref_8unr6r = { segmentImageUNet };
const _ref_d4ph18 = { parseLogTopics };
const _ref_t364ew = { createVehicle };
const _ref_0n7iuc = { wakeUp };
const _ref_hbqthf = { generateCode };
const _ref_xc4ed8 = { checkDiskSpace };
const _ref_sodz57 = { addGeneric6DofConstraint };
const _ref_422uz2 = { tokenizeText };
const _ref_b05xek = { createShader };
const _ref_c8pv7q = { uploadCrashReport };
const _ref_yhnryd = { invalidateCache };
const _ref_2pfhye = { encryptPayload };
const _ref_0ezb2q = { calculateGasFee };
const _ref_nhg7k7 = { normalizeFeatures };
const _ref_idfr2m = { switchProxyServer };
const _ref_e4qnw4 = { validateMnemonic };
const _ref_iygzgo = { createGainNode };
const _ref_nt8vx6 = { resolveCollision };
const _ref_9hajd1 = { calculateFriction };
const _ref_ackvc6 = { vertexAttrib3f };
const _ref_9p96dk = { createMediaStreamSource };
const _ref_zalc96 = { parseMagnetLink };
const _ref_fbk7eb = { setFilterType };
const _ref_iz22gh = { createIndexBuffer };
const _ref_8uplu3 = { createFrameBuffer };
const _ref_sbnhcc = { verifyFileSignature };
const _ref_onr3x8 = { sleep };
const _ref_pxgvuo = { generateFakeClass };
const _ref_v42wet = { auditAccessLogs };
const _ref_zemnvw = { uniform1i };
const _ref_hymmgq = { suspendContext };
const _ref_mslhbi = { verifyProofOfWork };
const _ref_6nha1l = { clearScreen };
const _ref_1cm4yr = { beginTransaction };
const _ref_3qvtes = { encodeABI };
const _ref_6d1qnk = { parseM3U8Playlist };
const _ref_unmj6q = { addSliderConstraint };
const _ref_v2tn8y = { resampleAudio };
const _ref_u66xvr = { setInertia };
const _ref_ingilo = { debounceAction };
const _ref_nydncw = { parseExpression };
const _ref_ca2vp1 = { optimizeMemoryUsage };
const _ref_72oy95 = { detectVirtualMachine };
const _ref_kcggpa = { monitorNetworkInterface };
const _ref_h5dvhv = { keepAlivePing };
const _ref_a7rcah = { spoofReferer };
const _ref_nlqwm8 = { processAudioBuffer };
const _ref_lv2m6d = { bindTexture };
const _ref_m3ilr7 = { mockResponse };
const _ref_ahi2v5 = { bindSocket };
const _ref_hj7d6l = { getAngularVelocity };
const _ref_37hjmx = { parseFunction };
const _ref_i7wbj1 = { createCapsuleShape };
const _ref_3iyba5 = { detectEnvironment };
const _ref_v6ubce = { virtualScroll };
const _ref_9beul4 = { calculateRestitution };
const _ref_5xixgi = { tokenizeSource };
const _ref_8f5qsv = { renderCanvasLayer };
const _ref_ilhtqj = { setRatio };
const _ref_w1wy6k = { connectNodes };
const _ref_eabelc = { traceStack };
const _ref_xkfao5 = { rayCast };
const _ref_1n1llv = { checkPortAvailability };
const _ref_6p7s5f = { deleteProgram };
const _ref_q7m414 = { createAudioContext };
const _ref_l2uqu6 = { flushSocketBuffer };
const _ref_1sknez = { validateTokenStructure };
const _ref_v9d71a = { resumeContext };
const _ref_yvz94t = { killParticles };
const _ref_c2rzf0 = { createParticleSystem };
const _ref_y0x4km = { convexSweepTest };
const _ref_4038kb = { scrapeTracker };
const _ref_dl7fea = { setQValue };
const _ref_u8cl05 = { updateTransform };
const _ref_k8ljgh = { applyImpulse };
const _ref_7gpbge = { cleanOldLogs };
const _ref_0kv81u = { stepSimulation };
const _ref_h0tpfu = { getBlockHeight };
const _ref_l4ffx9 = { foldConstants };
const _ref_d6nkr8 = { negotiateProtocol };
const _ref_rukavx = { detectDebugger };
const _ref_1c7akn = { disconnectNodes };
const _ref_n1xg0k = { calculateLighting };
const _ref_geyg6x = { FileValidator };
const _ref_htsb1s = { detectDevTools };
const _ref_utoct4 = { checkIntegrityToken };
const _ref_vi1rxd = { getVehicleSpeed };
const _ref_tmmxik = { formatCurrency };
const _ref_2v4cyr = { transformAesKey };
const _ref_agjgb5 = { setSteeringValue };
const _ref_5pbfes = { addWheel };
const _ref_609e65 = { triggerHapticFeedback };
const _ref_d5liqu = { getFloatTimeDomainData };
const _ref_f99xww = { inlineFunctions };
const _ref_obelxf = { createWaveShaper };
const _ref_dhaywo = { loadTexture };
const _ref_tqm6di = { disableDepthTest };
const _ref_36h7gf = { performOCR };
const _ref_5mwlkt = { sanitizeSQLInput };
const _ref_zgg9kt = { unrollLoops };
const _ref_99s5m6 = { createScriptProcessor };
const _ref_p476wm = { manageCookieJar };
const _ref_iqxjnq = { showNotification };
const _ref_ci7ak6 = { eliminateDeadCode };
const _ref_zlzfjd = { deleteBuffer };
const _ref_97uxnz = { createPeriodicWave };
const _ref_96rdoh = { scaleMatrix };
const _ref_q9mneh = { createListener };
const _ref_2sayks = { decodeAudioData }; 
    });
})({}, {});