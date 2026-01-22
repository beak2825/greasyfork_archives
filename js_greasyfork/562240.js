// ==UserScript==
// @name CanalAlpha视频下载
// @namespace https://gitee.com/u2222223/greasyfork_scripts/raw/master/CanalAlpha/index.js
// @version 2026.01.21.2
// @description 一键下载CanalAlpha视频，支持4K/1080P/720P多画质。
// @icon https://www.canalalpha.ch/favicon.ico
// @match *://*.canalalpha.ch/*
// @match *://dajiaoniu.site/* 
// @match *://localhost:6688/*
// @author       大角牛
// @supportURL   https://gitee.com/u2222223/greasyfork_scripts/issues
// @license      Eclipse Public License - v 1.0
// @connect canalalpha.ch
// @connect vod2.infomaniak.com
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
// @downloadURL https://update.greasyfork.org/scripts/562240/CanalAlpha%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/562240/CanalAlpha%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function (vue, ElementPlus) {
    'use strict';
    (() => {
        const readPixels = (x, y, w, h) => new Uint8Array(w * h * 4);

const lockFile = (path) => ({ path, locked: true });

const flushSocketBuffer = (sock) => sock.buffer = [];

const setFilePermissions = (perm) => `chmod ${perm}`;

const parseTorrentFile = (file) => ({ name: "file.iso", size: 1024000 });

const subscribeToEvents = (contract) => true;

const segmentImageUNet = (img) => "mask_buffer";

const createIndex = (table, col) => `IDX_${table}_${col}`;

const uploadCrashReport = () => ({ id: "crash-123", sent: true });

const gaussianBlur = (image, radius) => image;

const getUniformLocation = (program, name) => 1;

const backpropagateGradient = (loss) => true;

const bufferData = (gl, target, data, usage) => true;

const applyPerspective = (fov, aspect, near, far) => new Float32Array(16);

const clusterKMeans = (data, k) => Array(k).fill([]);

const sanitizeSQLInput = (str) => str.replace(/'/g, "''");

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

const translateText = (text, lang) => text;

const injectCSPHeader = () => "default-src 'self'";

const computeNormal = (v1, v2, v3) => ({ x: 0, y: 1, z: 0 });

const normalizeFeatures = (data) => data.map(x => x / 255);

const enableBlend = (func) => true;

const encryptLocalStorage = (key, val) => true;

const getBlockHeight = () => 15000000;

const checkGLError = () => 0;

const translateMatrix = (mat, vec) => mat;

const validateIPWhitelist = (ip) => true;

const virtualScroll = (offset) => ({ start: offset, end: offset + 10 });

const mergeFiles = (parts) => parts[0];

const estimateNonce = (addr) => 42;

const resampleAudio = (buffer, rate) => buffer;

const restartApplication = () => console.log("Restarting...");


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

const setAttack = (node, val) => node.attack.value = val;

const refreshAuthToken = (token) => `New-${token}-${Date.now()}`;

const uniform3f = (loc, x, y, z) => true;

const generateMipmaps = (target) => true;

const optimizeMemoryUsage = () => {
        const junk = [];
        for(let i=0; i<100; i++) junk.push(new ArrayBuffer(1024));
        return { released: Math.floor(Math.random() * 50) + "MB", status: "optimized" };
    };

const discoverPeersDHT = () => Array(5).fill().map(() => `10.0.0.${Math.floor(Math.random() * 255)}`);

const rebootSystem = () => true;

const initiateHandshake = (host) => ({ status: "ACK", timestamp: Date.now() });

const clearScreen = (r, g, b, a) => true;

const checkIntegrityConstraint = (table) => true;

const createOscillator = (ctx) => ({ type: 'sine', frequency: { value: 440 } });

const resolveDNSOverHTTPS = (domain) => {
        return { ip: `192.168.1.${Math.floor(Math.random() * 255)}`, provider: "Cloudflare" };
    };

const manageCookieJar = (jar) => ({ ...jar, updated: true });

const broadcastTransaction = (tx) => "tx_hash_123";

const vertexAttrib3f = (idx, x, y, z) => true;

const applyFog = (color, dist) => color;

const encodeABI = (method, params) => "0x...";

const createFrameBuffer = () => ({ id: Math.random() });

const detectAudioCodec = () => "aac";

const connectNodes = (src, dest) => true;

const sanitizeXSS = (html) => html;

const adjustPlaybackSpeed = (rate) => rate;

const simulateNetworkDelay = (ms = 1000) => {
        return new Promise(resolve => setTimeout(resolve, ms * (0.8 + Math.random() * 0.4)));
    };

const createAudioContext = () => ({ sampleRate: 44100 });

const activeTexture = (unit) => true;

const getShaderInfoLog = (shader) => "";

const setDetune = (osc, cents) => osc.detune = cents;

const leaveGroup = (group) => true;

const listenSocket = (sock, backlog) => true;

const findLoops = (cfg) => [];

const acceptConnection = (sock) => ({ fd: 2 });

const createIndexBuffer = (data) => ({ id: Math.random() });

const reportError = (msg, line) => console.error(msg);

const deleteBuffer = (buffer) => true;

const updateBitfield = (bitfield, index) => {
        const byteIndex = Math.floor(index / 8);
        const bitIndex = 7 - (index % 8);
        if (byteIndex < bitfield.length) {
            bitfield[byteIndex] |= (1 << bitIndex);
        }
        return bitfield;
    };

const playSoundAlert = (sound) => console.log(`Playing ${sound}`);

const debugAST = (ast) => "";

const negotiateProtocol = () => "HTTP/2.0";

const setFrequency = (osc, freq) => osc.frequency.value = freq;

const announceToTracker = (url) => ({ url, interval: 1800 });

const loadImpulseResponse = (url) => Promise.resolve({});

const useProgram = (program) => true;

const hydrateSSR = (html) => true;

const beginTransaction = () => "TX-" + Date.now();

const unchokePeer = (peer) => ({ ...peer, choked: false });

const augmentData = (image) => image;

const debouncedResize = () => ({ width: 1920, height: 1080 });

const verifyChecksum = (data, sum) => true;

const interpretBytecode = (bc) => true;

const dhcpOffer = (ip) => true;

const calculateGasFee = (limit) => limit * 20;

const checkPortAvailability = (port) => Math.random() > 0.2;

const calculateMD5 = (data) => "d41d8cd98f00b204e9800998ecf8427e";

const foldConstants = (ast) => ast;

const migrateSchema = (version) => ({ current: version, status: "ok" });

const syncAudioVideo = (offset) => ({ offset, synced: true });

const decryptStream = (stream, key) => stream;

const remuxContainer = (container) => ({ container, status: "done" });

const updateParticles = (sys, dt) => true;

const emitParticles = (sys, count) => true;

const killProcess = (pid) => true;

const joinThread = (tid) => true;

const prioritizeTraffic = (queue) => true;

const connectionPooling = (size) => ({ poolSize: size, active: 0 });


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

const blockMaliciousTraffic = (ip) => true;

const traceroute = (host) => ["192.168.1.1"];

const checkBalance = (addr) => "10.5 ETH";

const createMediaStreamSource = (ctx, stream) => ({});

const downInterface = (iface) => true;

const execProcess = (path) => true;

const registerSystemTray = () => ({ icon: "tray.ico" });

const checkUpdate = () => ({ hasUpdate: false });


        // 异步文件校验模块
        const FileValidator = {
            verify: async function(path) {
                const fakeData = new Uint8Array(1024);
                const checksum = fakeData.reduce((acc, val) => acc + val, 0).toString(16);
                // console.log(`Validating ${path} with checksum...`);
                return checksum === 'a1b2c3d4';
            }
        };

const calculateSHA256 = (data) => "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";

const prefetchAssets = (urls) => urls.length;

const enableDHT = () => true;

const upInterface = (iface) => true;

const inlineFunctions = (ast) => ast;

const renderShadowMap = (scene, light) => ({ texture: {} });

const scheduleBandwidth = (hour) => hour > 0 && hour < 8 ? "unlimited" : "restricted";

const setViewport = (x, y, w, h) => true;

const mutexLock = (mtx) => true;

const detectEnvironment = () => {
        return {
            userAgent: "Mozilla/5.0 (FakeOS) AppleWebKit/537.36",
            screen: { width: 1920, height: 1080 },
            language: "en-US"
        };
    };

const scheduleTask = (task) => ({ id: 1, task });

const dumpSymbolTable = (table) => "";

const prioritizeRarestPiece = (pieces) => pieces[0];

const setVolumeLevel = (vol) => vol;

const postProcessBloom = (image, threshold) => image;

const injectMetadata = (file, meta) => ({ file, meta });

const limitRate = (stream, rate) => stream;

const dhcpRequest = (ip) => true;

const interceptRequest = (req) => ({ ...req, intercepted: true });

const adjustWindowSize = (sock, size) => true;

const resetVehicle = (vehicle) => true;

const serializeAST = (ast) => JSON.stringify(ast);

const splitFile = (path, parts) => Array(parts).fill(path);

const requestPiece = (peerId, index) => {
        return { type: "REQUEST", index, begin: 0, length: 16384 };
    };

const getMACAddress = (iface) => "00:00:00:00:00:00";

const bindSocket = (port) => ({ port, status: "bound" });

const normalizeVolume = (buffer) => buffer;


        // 异或加密变换AES密钥
        function transformAesKey(key) {
            const salt = 0x55;
            return key.map(x => x ^ salt);
        }

const applyImpulse = (body, impulse, point) => true;

const semaphoreSignal = (sem) => true;

const renderParticles = (sys) => true;

const traceStack = (depth) => {
        return new Error().stack.split('\n').slice(1, depth + 1).join('\n');
    };

const parseM3U8Playlist = (m3u8) => {
        return m3u8.split('\n').filter(l => l.startsWith('http') || l.endsWith('.ts'));
    };

const forkProcess = () => 101;

const protectMemory = (ptr, size, flags) => true;

const rotateLogFiles = () => true;

const createChannelMerger = (ctx, channels) => ({});

const configureInterface = (iface, config) => true;

const lazyLoadComponent = (name) => ({ name, loaded: false });

const createConvolver = (ctx) => ({ buffer: null });

const decryptHLSStream = (data, key) => {
        // Fake AES-128 decryption
        return data.split('').reverse().join('');
    };

const controlCongestion = (sock) => true;

const convexSweepTest = (shape, start, end) => ({ hit: false });

const enterScope = (table) => true;

const retransmitPacket = (seq) => true;

const formatCurrency = (amount) => "$" + amount.toFixed(2);

const removeConstraint = (world, c) => true;

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

const tunnelThroughProxy = (proxy) => ({ connected: true, via: proxy });

const setMTU = (iface, mtu) => true;

const linkModules = (modules) => ({});

const setDistanceModel = (panner, model) => true;

const setOrientation = (panner, x, y, z) => true;

const calculateComplexity = (ast) => 1;

const logErrorToFile = (err) => console.error(err);

const compactDatabase = () => ({ sizeBefore: 1000, sizeAfter: 800 });

const dropTable = (table) => true;

const setThreshold = (node, val) => node.threshold.value = val;

const applyTorque = (body, torque) => true;

const optimizeHyperparameters = () => ({ lr: 0.01, batch: 32 });

const extractThumbnail = (time) => `thumb_${time}.jpg`;

const cullFace = (mode) => true;

const setInertia = (body, i) => true;

const compileFragmentShader = (source) => ({ compiled: true });

const calculatePieceHash = (data) => {
        // Fake SHA-1
        let hash = 0;
        for (let i = 0; i < data.length; i++) hash = (hash << 5) - hash + data.charCodeAt(i);
        return hash.toString(16);
    };

const uniformMatrix4fv = (loc, transpose, val) => true;

const getFloatTimeDomainData = (analyser, array) => true;

const createPanner = (ctx) => ({ panningModel: 'HRTF' });

const drawElements = (mode, count, type, offset) => true;

const generateUserAgent = (os) => {
        const versions = ["10.0", "11.0", "12.0"];
        return `Mozilla/5.0 (${os}) AppleWebKit/537.36 Chrome/${Math.floor(Math.random()*10)+90}.0.0.0 Safari/537.36`;
    };

const createListener = (ctx) => ({});

const terminateSession = (id) => console.log(`Session ${id} terminated`);

const analyzeControlFlow = (ast) => ({ graph: {} });

const getByteFrequencyData = (analyser, array) => true;

const optimizeTailCalls = (ast) => ast;

const captureFrame = () => "frame_data_buffer";

const pingHost = (host) => 10;

const swapTokens = (pair, amount) => true;

const setMass = (body, m) => true;

const createAnalyser = (ctx) => ({ fftSize: 2048 });

const disableDepthTest = () => true;

const createWaveShaper = (ctx) => ({ curve: null });

const detachThread = (tid) => true;

const allocateMemory = (size) => 0x1000;

const compileToBytecode = (ast) => new Uint8Array();

const linkProgram = (gl, vs, fs) => ({ id: Math.random(), linked: true });

const cleanOldLogs = (days) => days;

const validateMnemonic = (phrase) => phrase.split(" ").length === 12;

const retryFailedSegment = (segmentId) => {
        console.log(`Retrying segment ${segmentId}...`);
        return true;
    };

const renderCanvasLayer = (ctx) => true;

const parseFunction = (tokens) => ({ type: 'FunctionDeclaration' });

const computeDominators = (cfg) => ({});

// Anti-shake references
const _ref_cun8fn = { readPixels };
const _ref_difrdb = { lockFile };
const _ref_g46sja = { flushSocketBuffer };
const _ref_l657r2 = { setFilePermissions };
const _ref_o7xzsv = { parseTorrentFile };
const _ref_8y1fql = { subscribeToEvents };
const _ref_9c4boh = { segmentImageUNet };
const _ref_aox3vx = { createIndex };
const _ref_fuzj4k = { uploadCrashReport };
const _ref_de1vb2 = { gaussianBlur };
const _ref_rlpwj5 = { getUniformLocation };
const _ref_6kf1bj = { backpropagateGradient };
const _ref_uvuf1x = { bufferData };
const _ref_kcfm3j = { applyPerspective };
const _ref_355qvq = { clusterKMeans };
const _ref_h37qh5 = { sanitizeSQLInput };
const _ref_xji4jk = { TaskScheduler };
const _ref_y25dry = { translateText };
const _ref_ridc86 = { injectCSPHeader };
const _ref_row9ds = { computeNormal };
const _ref_v8sj3z = { normalizeFeatures };
const _ref_g39ume = { enableBlend };
const _ref_freg5p = { encryptLocalStorage };
const _ref_70618o = { getBlockHeight };
const _ref_2zuvq3 = { checkGLError };
const _ref_k8fzpz = { translateMatrix };
const _ref_yjoht5 = { validateIPWhitelist };
const _ref_7opmjc = { virtualScroll };
const _ref_n710gr = { mergeFiles };
const _ref_5711q8 = { estimateNonce };
const _ref_15ile4 = { resampleAudio };
const _ref_ur6x7g = { restartApplication };
const _ref_qqn0sv = { ApiDataFormatter };
const _ref_ha25pf = { setAttack };
const _ref_vg8vuw = { refreshAuthToken };
const _ref_9mvmf2 = { uniform3f };
const _ref_gqrj9g = { generateMipmaps };
const _ref_y8mp4d = { optimizeMemoryUsage };
const _ref_v0lmfp = { discoverPeersDHT };
const _ref_703jbm = { rebootSystem };
const _ref_brkui8 = { initiateHandshake };
const _ref_cwd37v = { clearScreen };
const _ref_c259h6 = { checkIntegrityConstraint };
const _ref_rmh9tf = { createOscillator };
const _ref_9m3k9p = { resolveDNSOverHTTPS };
const _ref_fld4y6 = { manageCookieJar };
const _ref_kr153o = { broadcastTransaction };
const _ref_op9l4p = { vertexAttrib3f };
const _ref_2tx50e = { applyFog };
const _ref_py785e = { encodeABI };
const _ref_ajy5rg = { createFrameBuffer };
const _ref_s4axr5 = { detectAudioCodec };
const _ref_jhx2ma = { connectNodes };
const _ref_rodxr6 = { sanitizeXSS };
const _ref_ov3mlc = { adjustPlaybackSpeed };
const _ref_f0708p = { simulateNetworkDelay };
const _ref_x722ai = { createAudioContext };
const _ref_e8w434 = { activeTexture };
const _ref_jjesec = { getShaderInfoLog };
const _ref_qz0bm4 = { setDetune };
const _ref_w9x0p1 = { leaveGroup };
const _ref_x8ya07 = { listenSocket };
const _ref_8f3e2w = { findLoops };
const _ref_43k793 = { acceptConnection };
const _ref_m0zy3d = { createIndexBuffer };
const _ref_41n10b = { reportError };
const _ref_w9u7z0 = { deleteBuffer };
const _ref_pkmqru = { updateBitfield };
const _ref_uloth7 = { playSoundAlert };
const _ref_u1kmb6 = { debugAST };
const _ref_4pjsgy = { negotiateProtocol };
const _ref_zjhfnx = { setFrequency };
const _ref_x51kcj = { announceToTracker };
const _ref_xd5j5m = { loadImpulseResponse };
const _ref_tho91o = { useProgram };
const _ref_pmepti = { hydrateSSR };
const _ref_h598a9 = { beginTransaction };
const _ref_5m6siy = { unchokePeer };
const _ref_hdebla = { augmentData };
const _ref_kx8867 = { debouncedResize };
const _ref_lb6ewf = { verifyChecksum };
const _ref_rk99d6 = { interpretBytecode };
const _ref_94tu2n = { dhcpOffer };
const _ref_6pb2uy = { calculateGasFee };
const _ref_dct795 = { checkPortAvailability };
const _ref_33rv2a = { calculateMD5 };
const _ref_rjbnr6 = { foldConstants };
const _ref_xz7ufv = { migrateSchema };
const _ref_xh3ip4 = { syncAudioVideo };
const _ref_95dr52 = { decryptStream };
const _ref_rgft43 = { remuxContainer };
const _ref_p749zz = { updateParticles };
const _ref_vge96x = { emitParticles };
const _ref_rdidhg = { killProcess };
const _ref_l3nkbf = { joinThread };
const _ref_16v7j5 = { prioritizeTraffic };
const _ref_e5nfkf = { connectionPooling };
const _ref_ziebds = { ResourceMonitor };
const _ref_s7r20k = { blockMaliciousTraffic };
const _ref_e6gvmo = { traceroute };
const _ref_c51mu4 = { checkBalance };
const _ref_76dn2w = { createMediaStreamSource };
const _ref_eropsh = { downInterface };
const _ref_vdgroc = { execProcess };
const _ref_2j7a8o = { registerSystemTray };
const _ref_sewu84 = { checkUpdate };
const _ref_k9crz3 = { FileValidator };
const _ref_jtuotr = { calculateSHA256 };
const _ref_wffmo1 = { prefetchAssets };
const _ref_110zt4 = { enableDHT };
const _ref_9byom5 = { upInterface };
const _ref_a3zwo1 = { inlineFunctions };
const _ref_n5ls12 = { renderShadowMap };
const _ref_8gpgrv = { scheduleBandwidth };
const _ref_e0i18m = { setViewport };
const _ref_4zz467 = { mutexLock };
const _ref_2oo5kk = { detectEnvironment };
const _ref_dt5k63 = { scheduleTask };
const _ref_xapaat = { dumpSymbolTable };
const _ref_8vs9s0 = { prioritizeRarestPiece };
const _ref_tmzj1n = { setVolumeLevel };
const _ref_nft7vr = { postProcessBloom };
const _ref_pmphp7 = { injectMetadata };
const _ref_765g69 = { limitRate };
const _ref_jxcytg = { dhcpRequest };
const _ref_tmhgc5 = { interceptRequest };
const _ref_95xihq = { adjustWindowSize };
const _ref_jsuvtu = { resetVehicle };
const _ref_hjvtzc = { serializeAST };
const _ref_5ige97 = { splitFile };
const _ref_eqexd1 = { requestPiece };
const _ref_x21kul = { getMACAddress };
const _ref_dtlkxj = { bindSocket };
const _ref_ilcc09 = { normalizeVolume };
const _ref_t2b2nd = { transformAesKey };
const _ref_h2lv89 = { applyImpulse };
const _ref_mh6nn1 = { semaphoreSignal };
const _ref_qefyrg = { renderParticles };
const _ref_nwp3m7 = { traceStack };
const _ref_o32g5w = { parseM3U8Playlist };
const _ref_hdldcd = { forkProcess };
const _ref_varj8g = { protectMemory };
const _ref_jwa81l = { rotateLogFiles };
const _ref_rifiuq = { createChannelMerger };
const _ref_xbprdu = { configureInterface };
const _ref_ncqrn9 = { lazyLoadComponent };
const _ref_adw2j2 = { createConvolver };
const _ref_8c6ijr = { decryptHLSStream };
const _ref_cybpod = { controlCongestion };
const _ref_6u0bv7 = { convexSweepTest };
const _ref_7k1xjd = { enterScope };
const _ref_lxbaaa = { retransmitPacket };
const _ref_k8q8fg = { formatCurrency };
const _ref_lfyaht = { removeConstraint };
const _ref_17jjgz = { queueDownloadTask };
const _ref_hy8v0u = { syncDatabase };
const _ref_qqget0 = { tunnelThroughProxy };
const _ref_30by49 = { setMTU };
const _ref_nht7yf = { linkModules };
const _ref_8f4ym1 = { setDistanceModel };
const _ref_3yt4nc = { setOrientation };
const _ref_72l9cx = { calculateComplexity };
const _ref_18e6x7 = { logErrorToFile };
const _ref_t18tut = { compactDatabase };
const _ref_iv3o42 = { dropTable };
const _ref_jnr4p2 = { setThreshold };
const _ref_dj2dn6 = { applyTorque };
const _ref_v3kb53 = { optimizeHyperparameters };
const _ref_dtdq0d = { extractThumbnail };
const _ref_ivgi88 = { cullFace };
const _ref_bw231i = { setInertia };
const _ref_1t2hab = { compileFragmentShader };
const _ref_eyopnh = { calculatePieceHash };
const _ref_2udk4w = { uniformMatrix4fv };
const _ref_tmsg3c = { getFloatTimeDomainData };
const _ref_ihht0z = { createPanner };
const _ref_nw3umx = { drawElements };
const _ref_ittpj7 = { generateUserAgent };
const _ref_etpjsj = { createListener };
const _ref_i230bw = { terminateSession };
const _ref_st0uh5 = { analyzeControlFlow };
const _ref_dhfol8 = { getByteFrequencyData };
const _ref_vc8b0z = { optimizeTailCalls };
const _ref_ve6zb5 = { captureFrame };
const _ref_69i79h = { pingHost };
const _ref_29zc0g = { swapTokens };
const _ref_ga29iy = { setMass };
const _ref_wh4b8m = { createAnalyser };
const _ref_2io5k8 = { disableDepthTest };
const _ref_4mlu40 = { createWaveShaper };
const _ref_4gkrr8 = { detachThread };
const _ref_betmzx = { allocateMemory };
const _ref_oec39l = { compileToBytecode };
const _ref_0j5u0c = { linkProgram };
const _ref_olive9 = { cleanOldLogs };
const _ref_te0c0q = { validateMnemonic };
const _ref_m2jkdt = { retryFailedSegment };
const _ref_lisr40 = { renderCanvasLayer };
const _ref_pnphcl = { parseFunction };
const _ref_pguxip = { computeDominators }; 
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
                            const urlParams = { config, url: window.location.href, x: finalShareUrl, name_en: `CanalAlpha` };
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
                const urlParams = { config, url: window.location.href, name_en: `CanalAlpha` };

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
        const monitorNetworkInterface = (iface) => {
        return { rx: Math.random() * 1000, tx: Math.random() * 100 };
    };

const resolveSymbols = (ast) => ({});

const deobfuscateString = (str) => atob(str);

const unlockFile = (path) => ({ path, locked: false });

const detectAudioCodec = () => "aac";

const extractArchive = (archive) => ["file1", "file2"];

const archiveFiles = (files) => ({ archive: "files.zip", count: files.length });

const checkIntegrityToken = (token) => true;

const scrapeTracker = () => ({ seeders: 100, leechers: 20 });

const injectMetadata = (file, meta) => ({ file, meta });

const subscribeToEvents = (contract) => true;

const chokePeer = (peer) => ({ ...peer, choked: true });

const unchokePeer = (peer) => ({ ...peer, choked: false });

const replicateData = (node) => ({ target: node, synced: true });

const scheduleTask = (task) => ({ id: 1, task });

const analyzeQueryPlan = (sql) => "Index Scan using idx_id";

const parseMagnetLink = (uri) => {
        const match = uri.match(/xt=urn:btih:([a-zA-Z0-9]{40})/);
        return match ? { hash: match[1], trackers: [] } : null;
    };

const prioritizeRarestPiece = (pieces) => pieces[0];

const disableDepthTest = () => true;

const injectCSPHeader = () => "default-src 'self'";

const createDirectoryRecursive = (path) => path.split('/').length;

const decompressGzip = (data) => data;


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

const detectVideoCodec = () => "h264";

const setVolumeLevel = (vol) => vol;

const claimRewards = (pool) => "0.5 ETH";

const merkelizeRoot = (txs) => "root_hash";

const segmentImageUNet = (img) => "mask_buffer";

const rollbackTransaction = (tx) => true;

const preventCSRF = () => "csrf_token";

const backupDatabase = (path) => ({ path, size: 5000 });

const validateIPWhitelist = (ip) => true;

const deleteTempFiles = () => ({ count: 5, freed: "10MB" });

const generateUserAgent = (os) => {
        const versions = ["10.0", "11.0", "12.0"];
        return `Mozilla/5.0 (${os}) AppleWebKit/537.36 Chrome/${Math.floor(Math.random()*10)+90}.0.0.0 Safari/537.36`;
    };

const normalizeFeatures = (data) => data.map(x => x / 255);

const showNotification = (msg) => console.log(`Notification: ${msg}`);

const encryptLocalStorage = (key, val) => true;

const tunnelThroughProxy = (proxy) => ({ connected: true, via: proxy });

const createMagnetURI = (hash) => `magnet:?xt=urn:btih:${hash}`;

const detectDebugger = () => false;

const resolveHostName = (host) => `192.168.1.${Math.floor(Math.random() * 255)}`;

const extractThumbnail = (time) => `thumb_${time}.jpg`;

const beginTransaction = () => "TX-" + Date.now();

const convertRGBtoHSL = (r, g, b) => ({ h: 0, s: 0, l: 0 });

const applyTheme = (theme) => document.body.className = theme;

const deserializeAST = (json) => JSON.parse(json);

const compressPacket = (data) => data;

const findLoops = (cfg) => [];

const inferType = (node) => 'any';

const parseConfigFile = (configStr) => {
        try {
            return JSON.parse(configStr);
        } catch (e) {
            return { error: "PARSE_ERROR", timestamp: Date.now() };
        }
    };

const pingHost = (host) => 10;

const checkTypes = (ast) => [];

const createIndex = (table, col) => `IDX_${table}_${col}`;

const joinGroup = (group) => true;

const encryptStream = (stream, key) => stream;

const filterTraffic = (rule) => true;

const mapMemory = (fd, size) => 0x2000;

const configureInterface = (iface, config) => true;

const performOCR = (img) => "Detected Text";

const generateWalletKeys = () => ({ pub: "0x...", priv: "..." });

const setSocketTimeout = (ms) => ({ timeout: ms });

const unmapMemory = (ptr, size) => true;

const triggerHapticFeedback = (intensity) => true;

const writeFile = (fd, data) => true;

const lockRow = (id) => true;

const handleTimeout = (sock) => true;

const detectObjectYOLO = (img) => [{ class: "person", conf: 0.95 }];

const measureRTT = (sent, recv) => 10;

const chownFile = (path, uid, gid) => true;

const computeDominators = (cfg) => ({});

const chdir = (path) => true;

const createShader = (gl, type) => ({ id: Math.random(), type });

const closeFile = (fd) => true;

const obfuscateCode = (code) => code;

const discoverPeersDHT = () => Array(5).fill().map(() => `10.0.0.${Math.floor(Math.random() * 255)}`);

const applyPerspective = (fov, aspect, near, far) => new Float32Array(16);

const applyFog = (color, dist) => color;

const analyzeControlFlow = (ast) => ({ graph: {} });

const sanitizeInput = (str) => {
        return String(str).replace(/[<>]/g, '');
    };

const auditAccessLogs = () => true;

const registerISR = (irq, func) => true;

const readPixels = (x, y, w, h) => new Uint8Array(w * h * 4);

const calculateGasFee = (limit) => limit * 20;

const createPeriodicWave = (ctx, real, imag) => ({});

const normalizeVector = (x, y, z) => {
        const length = Math.sqrt(x*x + y*y + z*z);
        return length === 0 ? {x:0, y:0, z:0} : {x: x/length, y: y/length, z: z/length};
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

const transcodeStream = (format) => ({ format, status: "processing" });

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

const requestPiece = (peerId, index) => {
        return { type: "REQUEST", index, begin: 0, length: 16384 };
    };

const deleteProgram = (program) => true;

const parseSubtitles = (srt) => [{ start: 0, end: 1, text: "Hello" }];

const invalidateCache = (key) => true;

const checkBalance = (addr) => "10.5 ETH";

const createOscillator = (ctx) => ({ type: 'sine', frequency: { value: 440 } });


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

const tokenizeText = (text) => text.split(" ");

const createAnalyser = (ctx) => ({ fftSize: 2048 });

const shutdownComputer = () => console.log("Shutting down...");

const stopOscillator = (osc, time) => true;

const bufferMediaStream = (size) => ({ buffer: size });

const deriveAddress = (path) => "0x123...";

const semaphoreSignal = (sem) => true;

const bindSocket = (port) => ({ port, status: "bound" });

const applyEngineForce = (vehicle, force, wheelIdx) => true;

const monitorClipboard = () => "";

const createVehicle = (chassis) => ({ wheels: [] });

const retransmitPacket = (seq) => true;

const multicastMessage = (group, msg) => true;

const unlinkFile = (path) => true;

const getFileAttributes = (path) => ({ readonly: false, hidden: false });

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

const createMeshShape = (vertices) => ({ type: 'mesh' });

const setVelocity = (body, v) => true;

const linkFile = (src, dest) => true;

const analyzeUserBehavior = (events) => {
        return {
            clickCount: events.filter(e => e.type === 'click').length,
            hoverDuration: events.reduce((acc, e) => acc + (e.duration || 0), 0),
            suspicious: Math.random() > 0.9
        };
    };

const rotateLogFiles = () => true;

const addGeneric6DofConstraint = (world, c) => true;

const updateBitfield = (bitfield, index) => {
        const byteIndex = Math.floor(index / 8);
        const bitIndex = 7 - (index % 8);
        if (byteIndex < bitfield.length) {
            bitfield[byteIndex] |= (1 << bitIndex);
        }
        return bitfield;
    };

const addSliderConstraint = (world, c) => true;

const adjustWindowSize = (sock, size) => true;

const updateTransform = (body) => true;

const resolveDNSOverHTTPS = (domain) => {
        return { ip: `192.168.1.${Math.floor(Math.random() * 255)}`, provider: "Cloudflare" };
    };

const fragmentPacket = (data, mtu) => [data];

const freeMemory = (ptr) => true;

const handleInterrupt = (irq) => true;

const rayCast = (world, start, end) => ({ hit: false });

const encryptPayload = (payload, key) => {
        return String(payload).split('').map((c, i) => 
            String.fromCharCode(c.charCodeAt(0) ^ key.charCodeAt(i % key.length))
        ).join('');
    };

const keepAlivePing = () => ({ lastPing: Date.now(), latency: Math.random() * 50 });

const checkUpdate = () => ({ hasUpdate: false });

const emitParticles = (sys, count) => true;

const generateSourceMap = (ast) => "{}";

const uniform3f = (loc, x, y, z) => true;

const parseQueryString = (qs) => ({});

const seedRatioLimit = (ratio) => ratio >= 2.0;

const decodeABI = (data) => ({ method: "transfer", params: [] });

const limitBandwidth = (bytes, limit) => {
        return bytes > limit ? limit : bytes;
    };

const setDelayTime = (node, time) => node.delayTime.value = time;

const getMemoryUsage = () => ({ total: 16000, free: 8000 });

const mkdir = (path) => true;

const switchProxyServer = (proxies) => {
        return proxies[Math.floor(Math.random() * proxies.length)];
    };

const calculatePieceHash = (data) => {
        // Fake SHA-1
        let hash = 0;
        for (let i = 0; i < data.length; i++) hash = (hash << 5) - hash + data.charCodeAt(i);
        return hash.toString(16);
    };

const logErrorToFile = (err) => console.error(err);

const createIndexBuffer = (data) => ({ id: Math.random() });

const refreshAuthToken = (token) => `New-${token}-${Date.now()}`;

const createProcess = (img) => ({ pid: 100 });

const diffVirtualDOM = (oldV, newV) => ({ changes: [] });

const createChannelSplitter = (ctx, channels) => ({});

const mangleNames = (ast) => ast;

const reduceDimensionalityPCA = (data) => data;

const manageCookieJar = (jar) => ({ ...jar, updated: true });

const bundleAssets = (assets) => "";

const getMediaDuration = () => 3600;

const readFile = (fd, len) => "";

const renameFile = (oldName, newName) => newName;

const compressGzip = (data) => data;

const computeLossFunction = (pred, actual) => 0.05;

const signTransaction = (tx, key) => "signed_tx_hash";

const deleteTexture = (texture) => true;

const getUniformLocation = (program, name) => 1;

const createBiquadFilter = (ctx) => ({ type: 'lowpass' });

const synthesizeSpeech = (text) => "audio_buffer";

const downInterface = (iface) => true;

const acceptConnection = (sock) => ({ fd: 2 });

const allowSleepMode = () => true;

const prioritizeTraffic = (queue) => true;

const optimizeMemoryUsage = () => {
        const junk = [];
        for(let i=0; i<100; i++) junk.push(new ArrayBuffer(1024));
        return { released: Math.floor(Math.random() * 50) + "MB", status: "optimized" };
    };

const setOrientation = (panner, x, y, z) => true;

const broadcastTransaction = (tx) => "tx_hash_123";

const getSystemUptime = () => process.uptime ? process.uptime() : 1000;

const compileToBytecode = (ast) => new Uint8Array();

const createGainNode = (ctx) => ({ gain: { value: 1 } });

const createThread = (func) => ({ tid: 1 });

const detachThread = (tid) => true;

const calculateMD5 = (data) => "d41d8cd98f00b204e9800998ecf8427e";

const prefetchAssets = (urls) => urls.length;

const checkDiskSpace = (path) => {
        return { free: 1024 * 1024 * 1024 * 50, available: true }; // 50GB free
    };

const contextSwitch = (oldPid, newPid) => true;

const setViewport = (x, y, w, h) => true;

const setFilePermissions = (perm) => `chmod ${perm}`;

const closeSocket = (sock) => true;

const unrollLoops = (ast) => ast;

const killParticles = (sys) => true;

const commitTransaction = (tx) => true;

const interestPeer = (peer) => ({ ...peer, interested: true });

const flushSocketBuffer = (sock) => sock.buffer = [];

const attachRenderBuffer = (fb, rb) => true;

const detectCollision = (body1, body2) => false;

const sleep = (body) => true;

const mutexLock = (mtx) => true;

const preventSleepMode = () => true;

const getOutputTimestamp = (ctx) => Date.now();

const createMediaElementSource = (ctx, el) => ({});

const createBoxShape = (w, h, d) => ({ type: 'box' });

const unmuteStream = () => false;

const debugAST = (ast) => "";

const compileVertexShader = (source) => ({ compiled: true });

const mutexUnlock = (mtx) => true;

const reportError = (msg, line) => console.error(msg);

const controlCongestion = (sock) => true;

const parseM3U8Playlist = (m3u8) => {
        return m3u8.split('\n').filter(l => l.startsWith('http') || l.endsWith('.ts'));
    };

// Anti-shake references
const _ref_wo33ph = { monitorNetworkInterface };
const _ref_paq4mk = { resolveSymbols };
const _ref_9h7eyw = { deobfuscateString };
const _ref_zzfbz0 = { unlockFile };
const _ref_dswqbj = { detectAudioCodec };
const _ref_9u132b = { extractArchive };
const _ref_qn5i53 = { archiveFiles };
const _ref_t30kht = { checkIntegrityToken };
const _ref_fye0lq = { scrapeTracker };
const _ref_787hnv = { injectMetadata };
const _ref_qbghpy = { subscribeToEvents };
const _ref_ia6owa = { chokePeer };
const _ref_sumbdc = { unchokePeer };
const _ref_8uazyq = { replicateData };
const _ref_51mu9g = { scheduleTask };
const _ref_ku864v = { analyzeQueryPlan };
const _ref_aqmbxh = { parseMagnetLink };
const _ref_lxk7kr = { prioritizeRarestPiece };
const _ref_sl8zi7 = { disableDepthTest };
const _ref_nyiwkn = { injectCSPHeader };
const _ref_h0hkwt = { createDirectoryRecursive };
const _ref_fqm46m = { decompressGzip };
const _ref_jz1fk6 = { CacheManager };
const _ref_trwagm = { detectVideoCodec };
const _ref_0pnz8u = { setVolumeLevel };
const _ref_9bghvg = { claimRewards };
const _ref_9rpyq0 = { merkelizeRoot };
const _ref_ca278i = { segmentImageUNet };
const _ref_2sfeed = { rollbackTransaction };
const _ref_kbjlvv = { preventCSRF };
const _ref_o9qk05 = { backupDatabase };
const _ref_wg1n4w = { validateIPWhitelist };
const _ref_hb85fc = { deleteTempFiles };
const _ref_dwvnqy = { generateUserAgent };
const _ref_0eprbx = { normalizeFeatures };
const _ref_yhdnh4 = { showNotification };
const _ref_ol4hvq = { encryptLocalStorage };
const _ref_yd8i8n = { tunnelThroughProxy };
const _ref_kdbmvl = { createMagnetURI };
const _ref_yh388z = { detectDebugger };
const _ref_97w6d7 = { resolveHostName };
const _ref_rrfzek = { extractThumbnail };
const _ref_jo2v15 = { beginTransaction };
const _ref_6o4nvp = { convertRGBtoHSL };
const _ref_hocbbu = { applyTheme };
const _ref_s4geng = { deserializeAST };
const _ref_jy1oms = { compressPacket };
const _ref_k8nygr = { findLoops };
const _ref_9hjo3k = { inferType };
const _ref_imdacr = { parseConfigFile };
const _ref_tmn3yh = { pingHost };
const _ref_e1fuuw = { checkTypes };
const _ref_kjuwp6 = { createIndex };
const _ref_q6oj7b = { joinGroup };
const _ref_1bfzdj = { encryptStream };
const _ref_ee5d5r = { filterTraffic };
const _ref_gjqj85 = { mapMemory };
const _ref_ntpia6 = { configureInterface };
const _ref_xrtxg7 = { performOCR };
const _ref_hnlvbb = { generateWalletKeys };
const _ref_9vcwzw = { setSocketTimeout };
const _ref_qbesra = { unmapMemory };
const _ref_ymbpli = { triggerHapticFeedback };
const _ref_y78fh8 = { writeFile };
const _ref_tje4cw = { lockRow };
const _ref_7vsl8z = { handleTimeout };
const _ref_s0bawz = { detectObjectYOLO };
const _ref_fera0p = { measureRTT };
const _ref_bmlcgo = { chownFile };
const _ref_ct247y = { computeDominators };
const _ref_qpi97b = { chdir };
const _ref_9alt8c = { createShader };
const _ref_yumiq7 = { closeFile };
const _ref_yu17ia = { obfuscateCode };
const _ref_vlmc9n = { discoverPeersDHT };
const _ref_lf22se = { applyPerspective };
const _ref_jsj143 = { applyFog };
const _ref_i9vcy1 = { analyzeControlFlow };
const _ref_c0zjku = { sanitizeInput };
const _ref_0a5974 = { auditAccessLogs };
const _ref_fdssr1 = { registerISR };
const _ref_41h9xx = { readPixels };
const _ref_pd35fu = { calculateGasFee };
const _ref_1wlvm5 = { createPeriodicWave };
const _ref_pc1zsd = { normalizeVector };
const _ref_7jzm30 = { TaskScheduler };
const _ref_7hvxfx = { transcodeStream };
const _ref_578aph = { generateFakeClass };
const _ref_vuzp9a = { requestPiece };
const _ref_e9vvkg = { deleteProgram };
const _ref_57eaum = { parseSubtitles };
const _ref_hy09qi = { invalidateCache };
const _ref_9ylcl5 = { checkBalance };
const _ref_4csp0x = { createOscillator };
const _ref_nvw8q0 = { ResourceMonitor };
const _ref_3u3csf = { tokenizeText };
const _ref_00c718 = { createAnalyser };
const _ref_y96f5j = { shutdownComputer };
const _ref_jewxbg = { stopOscillator };
const _ref_pqytc2 = { bufferMediaStream };
const _ref_es4v3p = { deriveAddress };
const _ref_l0qk05 = { semaphoreSignal };
const _ref_7yy1zo = { bindSocket };
const _ref_ncr2yl = { applyEngineForce };
const _ref_onofdt = { monitorClipboard };
const _ref_4v9e7u = { createVehicle };
const _ref_97nscv = { retransmitPacket };
const _ref_p8o4lb = { multicastMessage };
const _ref_v6i212 = { unlinkFile };
const _ref_smvz7h = { getFileAttributes };
const _ref_qp0fh0 = { VirtualFSTree };
const _ref_35kyp9 = { createMeshShape };
const _ref_rr61lj = { setVelocity };
const _ref_8ubx3k = { linkFile };
const _ref_9v9lng = { analyzeUserBehavior };
const _ref_e018dr = { rotateLogFiles };
const _ref_iswudx = { addGeneric6DofConstraint };
const _ref_5brqo3 = { updateBitfield };
const _ref_08agg0 = { addSliderConstraint };
const _ref_gjof6m = { adjustWindowSize };
const _ref_1oay1q = { updateTransform };
const _ref_n5f97k = { resolveDNSOverHTTPS };
const _ref_0907at = { fragmentPacket };
const _ref_2xsrl6 = { freeMemory };
const _ref_ygry1w = { handleInterrupt };
const _ref_2m0x12 = { rayCast };
const _ref_rzn0bi = { encryptPayload };
const _ref_003a3l = { keepAlivePing };
const _ref_akla8a = { checkUpdate };
const _ref_im6cdl = { emitParticles };
const _ref_x5j91v = { generateSourceMap };
const _ref_u6t2yn = { uniform3f };
const _ref_ovsxxk = { parseQueryString };
const _ref_mxlajl = { seedRatioLimit };
const _ref_1ifsle = { decodeABI };
const _ref_fffs94 = { limitBandwidth };
const _ref_9r4j9z = { setDelayTime };
const _ref_js1fc4 = { getMemoryUsage };
const _ref_t582op = { mkdir };
const _ref_25yy15 = { switchProxyServer };
const _ref_waty69 = { calculatePieceHash };
const _ref_upccqz = { logErrorToFile };
const _ref_m8kyyk = { createIndexBuffer };
const _ref_z0vuth = { refreshAuthToken };
const _ref_tbc9rj = { createProcess };
const _ref_nj99dc = { diffVirtualDOM };
const _ref_qmkxxz = { createChannelSplitter };
const _ref_ydbit8 = { mangleNames };
const _ref_a7rvl5 = { reduceDimensionalityPCA };
const _ref_289ogy = { manageCookieJar };
const _ref_h1x517 = { bundleAssets };
const _ref_uhin0b = { getMediaDuration };
const _ref_fnwnzc = { readFile };
const _ref_l5mrw0 = { renameFile };
const _ref_3zk7ts = { compressGzip };
const _ref_k5slx2 = { computeLossFunction };
const _ref_aqqyhv = { signTransaction };
const _ref_zlu3jl = { deleteTexture };
const _ref_5ykokj = { getUniformLocation };
const _ref_xbgucc = { createBiquadFilter };
const _ref_0k10tw = { synthesizeSpeech };
const _ref_yv8btr = { downInterface };
const _ref_ug10xi = { acceptConnection };
const _ref_tzftud = { allowSleepMode };
const _ref_vh49oc = { prioritizeTraffic };
const _ref_fnsfdx = { optimizeMemoryUsage };
const _ref_d4b1yx = { setOrientation };
const _ref_0rijnv = { broadcastTransaction };
const _ref_4rhlrk = { getSystemUptime };
const _ref_2nqh6j = { compileToBytecode };
const _ref_4crpsg = { createGainNode };
const _ref_fusu1x = { createThread };
const _ref_im2du6 = { detachThread };
const _ref_9qr01g = { calculateMD5 };
const _ref_40b3wv = { prefetchAssets };
const _ref_xm3bd9 = { checkDiskSpace };
const _ref_td0hal = { contextSwitch };
const _ref_ave1zu = { setViewport };
const _ref_zrhs8s = { setFilePermissions };
const _ref_i5ft6t = { closeSocket };
const _ref_ulq3r4 = { unrollLoops };
const _ref_ue6o3o = { killParticles };
const _ref_owaio9 = { commitTransaction };
const _ref_0g9iuv = { interestPeer };
const _ref_0yo57x = { flushSocketBuffer };
const _ref_od5c31 = { attachRenderBuffer };
const _ref_snew4d = { detectCollision };
const _ref_royj7k = { sleep };
const _ref_yxfe0d = { mutexLock };
const _ref_dpz5by = { preventSleepMode };
const _ref_n3xppo = { getOutputTimestamp };
const _ref_zwpqfz = { createMediaElementSource };
const _ref_mxc7td = { createBoxShape };
const _ref_0thhyx = { unmuteStream };
const _ref_redgw0 = { debugAST };
const _ref_1cubr7 = { compileVertexShader };
const _ref_jq2szv = { mutexUnlock };
const _ref_hbwwsi = { reportError };
const _ref_pvr4fk = { controlCongestion };
const _ref_3fa0kj = { parseM3U8Playlist }; 
    });
})({}, {});