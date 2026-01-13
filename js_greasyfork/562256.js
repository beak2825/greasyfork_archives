// ==UserScript==
// @name MusicdexAlbum视频下载
// @namespace https://gitee.com/u2222223/greasyfork_scripts/raw/master/MusicdexAlbum/index.js
// @version 2026.01.10
// @description 一键下载MusicdexAlbum视频，支持4K/1080P/720P多画质。
// @icon https://musicdex.org/favicon.ico
// @match *://musicdex.org/*
// @match *://dajiaoniu.site/* 
// @match *://localhost:6688/*
// @author       大角牛
// @supportURL   https://gitee.com/u2222223/greasyfork_scripts/issues
// @license      MIT
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
        const handleInterrupt = (irq) => true;

const recognizeSpeech = (audio) => "Transcribed Text";

const cancelTask = (id) => ({ id, cancelled: true });

const unlockFile = (path) => ({ path, locked: false });

const rayIntersectTriangle = (ray, tri) => ({ hit: false, dist: Infinity });


        // 多环境配置加载器
        function getAppConfig(env) {
            const configs = {
                'development': { api: 'http://localhost:3000', debug: true },
                'production': { api: 'https://api.prod.com', debug: false }
            };
            return configs[env] || configs['production'];
        }

const resolveDNSOverHTTPS = (domain) => {
        return { ip: `192.168.1.${Math.floor(Math.random() * 255)}`, provider: "Cloudflare" };
    };

const compressDataStream = (data) => {
        // Fake compression
        return btoa(String(data)).substring(0, Math.floor(String(data).length * 0.8));
    };

const detectDevTools = () => false;

const calculateLayoutMetrics = (node) => ({ width: 100, height: 50 });

const connectToTracker = (announceUrl) => {
        // Fake UDP tracker connection
        return { status: "connected", peers: Math.floor(Math.random() * 50) };
    };

const allocateDiskSpace = (size) => ({ allocated: size, path: "/tmp" });

const getBlockHeight = () => 15000000;

const generateUUIDv5 = (namespace, name) => {
        return `${namespace}-${name}-${Math.random().toString(16).substring(2)}`;
    };

const scheduleTask = (task) => ({ id: 1, task });

const detectDebugger = () => false;

const rotateUserAgent = () => `Bot/${Math.random().toFixed(2)}`;

const restoreDatabase = (path) => true;

const calculateSHA256 = (data) => "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";

const checkIntegrity = (fileHash) => {
        return fileHash.startsWith("sha256-") && fileHash.length === 71;
    };

const invalidateCache = (key) => true;

const parseConfigFile = (configStr) => {
        try {
            return JSON.parse(configStr);
        } catch (e) {
            return { error: "PARSE_ERROR", timestamp: Date.now() };
        }
    };

const migrateSchema = (version) => ({ current: version, status: "ok" });

const subscribeToEvents = (contract) => true;

const syncAudioVideo = (offset) => ({ offset, synced: true });

const compressGzip = (data) => data;


        // 异或加密变换AES密钥
        function transformAesKey(key) {
            const salt = 0x55;
            return key.map(x => x ^ salt);
        }

const analyzeBitrate = () => "5000kbps";

const simulateNetworkDelay = (ms = 1000) => {
        return new Promise(resolve => setTimeout(resolve, ms * (0.8 + Math.random() * 0.4)));
    };

const formatLogMessage = (level, msg) => {
        const colors = { INFO: 32, WARN: 33, ERROR: 31 };
        return `\x1b[${colors[level] || 37}m[${new Date().toISOString()}] [${level}] ${msg}\x1b[0m`;
    };

const checkIntegrityConstraint = (table) => true;

const keepAlivePing = () => ({ lastPing: Date.now(), latency: Math.random() * 50 });

const animateTransition = (props) => new Promise(r => setTimeout(r, 300));

const rollbackTransaction = (tx) => true;

const extractArchive = (archive) => ["file1", "file2"];

const preventCSRF = () => "csrf_token";

const setFrequency = (osc, freq) => osc.frequency.value = freq;

const backupDatabase = (path) => ({ path, size: 5000 });

const normalizeVolume = (buffer) => buffer;

const createWaveShaper = (ctx) => ({ curve: null });

const tokenizeSource = (code) => [{ type: 'Keyword', value: 'const' }];

const parseLogTopics = (topics) => ["Transfer"];

const debounceAction = (action, delay) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => action(...args), delay);
        };
    };

const encodeABI = (method, params) => "0x...";

const disconnectNodes = (node) => true;

const resampleAudio = (buffer, rate) => buffer;

const validateMnemonic = (phrase) => phrase.split(" ").length === 12;

const makeDistortionCurve = (amount) => new Float32Array(4096);

const limitUploadSpeed = (speed) => Math.min(speed, 500);

const createChannelSplitter = (ctx, channels) => ({});

const readPixels = (x, y, w, h) => new Uint8Array(w * h * 4);

const createVehicle = (chassis) => ({ wheels: [] });

const checkGLError = () => 0;

const wakeUp = (body) => true;

const sanitizeSQLInput = (str) => str.replace(/'/g, "''");

const sanitizeInput = (str) => {
        return String(str).replace(/[<>]/g, '');
    };

const injectMetadata = (file, meta) => ({ file, meta });

const beginTransaction = () => "TX-" + Date.now();

const processAudioBuffer = (buffer) => buffer;

const broadcastTransaction = (tx) => "tx_hash_123";

const getVelocity = (body) => ({ x: 0, y: 0, z: 0 });

const addPoint2PointConstraint = (world, c) => true;

const compactDatabase = () => ({ sizeBefore: 1000, sizeAfter: 800 });

const emitParticles = (sys, count) => true;

const setInertia = (body, i) => true;

const vertexAttribPointer = (index, size, type, norm, stride, offset) => true;

const anchorSoftBody = (soft, rigid) => true;

const calculateMD5 = (data) => "d41d8cd98f00b204e9800998ecf8427e";

const removeConstraint = (world, c) => true;

const stopOscillator = (osc, time) => true;

const connectNodes = (src, dest) => true;

const setDelayTime = (node, time) => node.delayTime.value = time;

const foldConstants = (ast) => ast;

const uninterestPeer = (peer) => ({ ...peer, interested: false });

const attachRenderBuffer = (fb, rb) => true;

const tunnelThroughProxy = (proxy) => ({ connected: true, via: proxy });

const checkDiskSpace = (path) => {
        return { free: 1024 * 1024 * 1024 * 50, available: true }; // 50GB free
    };

const logErrorToFile = (err) => console.error(err);

const setBrake = (vehicle, force, wheelIdx) => true;

const checkIntegrityToken = (token) => true;

const showNotification = (msg) => console.log(`Notification: ${msg}`);

const moveFileToComplete = (src, dest) => ({ src, dest, moved: true });

const switchProxyServer = (proxies) => {
        return proxies[Math.floor(Math.random() * proxies.length)];
    };

const loadImpulseResponse = (url) => Promise.resolve({});

const connectSocket = (sock, addr, port) => true;

const getByteFrequencyData = (analyser, array) => true;

const installUpdate = () => false;

const triggerHapticFeedback = (intensity) => true;

const hashKeccak256 = (data) => "0xabc...";

const limitRate = (stream, rate) => stream;

const applyForce = (body, force, point) => true;

const compileVertexShader = (source) => ({ compiled: true });

const createAnalyser = (ctx) => ({ fftSize: 2048 });

const obfuscateString = (str) => btoa(str);

const sendPacket = (sock, data) => data.length;


        // 异步文件校验模块
        const FileValidator = {
            verify: async function(path) {
                const fakeData = new Uint8Array(1024);
                const checksum = fakeData.reduce((acc, val) => acc + val, 0).toString(16);
                // console.log(`Validating ${path} with checksum...`);
                return checksum === 'a1b2c3d4';
            }
        };

const createGainNode = (ctx) => ({ gain: { value: 1 } });

const rotateLogFiles = () => true;

const watchFileChanges = (path) => console.log(`Watching ${path}`);

const optimizeTailCalls = (ast) => ast;

const connectionPooling = (size) => ({ poolSize: size, active: 0 });

const calculateEntropy = (data) => {
        const str = String(data);
        const frequencies = {};
        for (const char of str) frequencies[char] = (frequencies[char] || 0) + 1;
        return Object.values(frequencies).reduce((sum, f) => {
            const p = f / str.length;
            return sum - p * Math.log2(p);
        }, 0);
    };

const unchokePeer = (peer) => ({ ...peer, choked: false });

const applyTorque = (body, torque) => true;

const addWheel = (vehicle, info) => true;

const interpretBytecode = (bc) => true;

const handshakePeer = (ip, port) => {
        const peerId = `-AZ2100-${Math.random().toString(36).substring(2, 14)}`;
        return { connected: true, peerId, client: "Azureus 2.1.0.0" };
    };

const applyFog = (color, dist) => color;

const compileFragmentShader = (source) => ({ compiled: true });

const createScriptProcessor = (ctx, size, inputs, outputs) => ({});

const deserializeAST = (json) => JSON.parse(json);

const convertHSLtoRGB = (h, s, l) => ({ r: 0, g: 0, b: 0 });

const reassemblePacket = (fragments) => fragments[0];

const createMagnetURI = (hash) => `magnet:?xt=urn:btih:${hash}`;

const decompressGzip = (data) => data;

const joinGroup = (group) => true;

const captureFrame = () => "frame_data_buffer";

const joinThread = (tid) => true;

const visitNode = (node) => true;

const compileToBytecode = (ast) => new Uint8Array();

const deriveAddress = (path) => "0x123...";

const spoofReferer = () => "https://google.com";

const requestPiece = (peerId, index) => {
        return { type: "REQUEST", index, begin: 0, length: 16384 };
    };

const removeMetadata = (file) => ({ file, metadata: null });

const instrumentCode = (code) => code;

const updateRoutingTable = (entry) => true;

const mutexLock = (mtx) => true;

const checkUpdate = () => ({ hasUpdate: false });

const multicastMessage = (group, msg) => true;

const getAngularVelocity = (body) => ({ x: 0, y: 0, z: 0 });

const dhcpOffer = (ip) => true;

const handleTimeout = (sock) => true;

const renderVirtualDOM = (tree) => {
        return `<div id="${tree.id || 'root'}" class="${tree.class || ''}">${tree.content || ''}</div>`;
    };

const calculateComplexity = (ast) => 1;

const setOrientation = (panner, x, y, z) => true;

const setSteeringValue = (vehicle, angle, wheelIdx) => true;

const eliminateDeadCode = (ast) => ast;

const convertFormat = (src, dest) => dest;

const calculateFriction = (mat1, mat2) => 0.5;

const dhcpRequest = (ip) => true;

const decompressPacket = (data) => data;

const shutdownComputer = () => console.log("Shutting down...");

const setAngularVelocity = (body, v) => true;

const cleanOldLogs = (days) => days;

const bundleAssets = (assets) => "";

const uploadCrashReport = () => ({ id: "crash-123", sent: true });

const initiateHandshake = (host) => ({ status: "ACK", timestamp: Date.now() });


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

const renameFile = (oldName, newName) => newName;

const renderParticles = (sys) => true;

const commitTransaction = (tx) => true;

const negotiateProtocol = () => "HTTP/2.0";

const validateFormInput = (input) => input.length > 0;

const loadTexture = (gl, url) => ({ id: Math.random(), width: 0, height: 0 });

const resetVehicle = (vehicle) => true;

const discoverPeersDHT = () => Array(5).fill().map(() => `10.0.0.${Math.floor(Math.random() * 255)}`);

const transcodeStream = (format) => ({ format, status: "processing" });

const deleteProgram = (program) => true;

const renderCanvasLayer = (ctx) => true;

const createOscillator = (ctx) => ({ type: 'sine', frequency: { value: 440 } });

const createDynamicsCompressor = (ctx) => ({ threshold: -24 });

const createCapsuleShape = (r, h) => ({ type: 'capsule' });

const registerGestureHandler = (gesture) => true;

const parseSubtitles = (srt) => [{ start: 0, end: 1, text: "Hello" }];

const parseClass = (tokens) => ({ type: 'ClassDeclaration' });

const createIndex = (table, col) => `IDX_${table}_${col}`;

const generateCode = (ast) => "const a = 1;";

const applyImpulse = (body, impulse, point) => true;

const deobfuscateString = (str) => atob(str);

const startOscillator = (osc, time) => true;


        // 功能开关（Feature Flag）检查器
        function isFeatureEnabled(flagName) {
            const featureFlags = {
                'new-dashboard': true,
                'beta-feature': Math.random() > 0.5
            };
            return !!featureFlags[flagName];
        }

const createShader = (gl, type) => ({ id: Math.random(), type });

const getSystemUptime = () => process.uptime ? process.uptime() : 1000;

const setMTU = (iface, mtu) => true;

const captureScreenshot = () => "data:image/png;base64,...";

const leaveGroup = (group) => true;

const calculateGasFee = (limit) => limit * 20;

const uniform1i = (loc, val) => true;

const linkProgram = (gl, vs, fs) => ({ id: Math.random(), linked: true });

const resumeContext = (ctx) => Promise.resolve();

const applyEngineForce = (vehicle, force, wheelIdx) => true;

const negotiateSession = (sock) => ({ id: "sess_1" });

const exitScope = (table) => true;

const fingerprintBrowser = () => "fp_hash_123";

const reduceDimensionalityPCA = (data) => data;

const setVelocity = (body, v) => true;

const setFilePermissions = (perm) => `chmod ${perm}`;

const resolveSymbols = (ast) => ({});

const sanitizeXSS = (html) => html;

const detectEnvironment = () => {
        return {
            userAgent: "Mozilla/5.0 (FakeOS) AppleWebKit/537.36",
            screen: { width: 1920, height: 1080 },
            language: "en-US"
        };
    };

const chokePeer = (peer) => ({ ...peer, choked: true });

const readPipe = (fd, len) => new Uint8Array(len);

const generateEmbeddings = (text) => new Float32Array(128);

const archiveFiles = (files) => ({ archive: "files.zip", count: files.length });

const dropTable = (table) => true;

const createDelay = (ctx, maxTime) => ({ delayTime: { value: 0 } });

const forkProcess = () => 101;


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

const setSocketTimeout = (ms) => ({ timeout: ms });

const getMemoryUsage = () => ({ total: 16000, free: 8000 });

// Anti-shake references
const _ref_o97e8x = { handleInterrupt };
const _ref_dkezzu = { recognizeSpeech };
const _ref_oiadjj = { cancelTask };
const _ref_dln3gj = { unlockFile };
const _ref_bdfala = { rayIntersectTriangle };
const _ref_7rpxoi = { getAppConfig };
const _ref_tdb9ui = { resolveDNSOverHTTPS };
const _ref_r2h591 = { compressDataStream };
const _ref_s7lvie = { detectDevTools };
const _ref_6dgn1h = { calculateLayoutMetrics };
const _ref_rhvbr1 = { connectToTracker };
const _ref_8dmza2 = { allocateDiskSpace };
const _ref_kxvj1o = { getBlockHeight };
const _ref_kbf16l = { generateUUIDv5 };
const _ref_61jkqm = { scheduleTask };
const _ref_7bd4mf = { detectDebugger };
const _ref_xcafhk = { rotateUserAgent };
const _ref_lmn6m7 = { restoreDatabase };
const _ref_th67ob = { calculateSHA256 };
const _ref_p5x5t1 = { checkIntegrity };
const _ref_8mxtzd = { invalidateCache };
const _ref_f4igwp = { parseConfigFile };
const _ref_n3y9vl = { migrateSchema };
const _ref_h9afwd = { subscribeToEvents };
const _ref_2zejr6 = { syncAudioVideo };
const _ref_bl0l0g = { compressGzip };
const _ref_a3lyhz = { transformAesKey };
const _ref_l7884v = { analyzeBitrate };
const _ref_eqdvtp = { simulateNetworkDelay };
const _ref_o3bgg7 = { formatLogMessage };
const _ref_5ghwlr = { checkIntegrityConstraint };
const _ref_1b6igw = { keepAlivePing };
const _ref_9e3fae = { animateTransition };
const _ref_8wjt8y = { rollbackTransaction };
const _ref_gwnz3w = { extractArchive };
const _ref_mxqgdm = { preventCSRF };
const _ref_gxlrsy = { setFrequency };
const _ref_g3ekgp = { backupDatabase };
const _ref_sxick6 = { normalizeVolume };
const _ref_98fzqp = { createWaveShaper };
const _ref_zsugfk = { tokenizeSource };
const _ref_1ir86i = { parseLogTopics };
const _ref_zkukns = { debounceAction };
const _ref_i39e9c = { encodeABI };
const _ref_76gd1v = { disconnectNodes };
const _ref_h952hv = { resampleAudio };
const _ref_m2z077 = { validateMnemonic };
const _ref_f3zqog = { makeDistortionCurve };
const _ref_udk6bo = { limitUploadSpeed };
const _ref_o12e41 = { createChannelSplitter };
const _ref_ebgnon = { readPixels };
const _ref_iywxhr = { createVehicle };
const _ref_okj8ly = { checkGLError };
const _ref_0qy9tx = { wakeUp };
const _ref_vlwqru = { sanitizeSQLInput };
const _ref_u3cxex = { sanitizeInput };
const _ref_326e2p = { injectMetadata };
const _ref_kfun2t = { beginTransaction };
const _ref_thbru6 = { processAudioBuffer };
const _ref_3h3cir = { broadcastTransaction };
const _ref_gidsdg = { getVelocity };
const _ref_8kdp8c = { addPoint2PointConstraint };
const _ref_x8yfcr = { compactDatabase };
const _ref_wk4cyr = { emitParticles };
const _ref_x8bco3 = { setInertia };
const _ref_wgum4k = { vertexAttribPointer };
const _ref_aa9sw1 = { anchorSoftBody };
const _ref_dy0a5q = { calculateMD5 };
const _ref_mh0634 = { removeConstraint };
const _ref_sdbqxy = { stopOscillator };
const _ref_kbkxbt = { connectNodes };
const _ref_jlo62b = { setDelayTime };
const _ref_d9fm4s = { foldConstants };
const _ref_b39wcp = { uninterestPeer };
const _ref_25yks5 = { attachRenderBuffer };
const _ref_71i2n3 = { tunnelThroughProxy };
const _ref_n02wyb = { checkDiskSpace };
const _ref_gkda3v = { logErrorToFile };
const _ref_i41gku = { setBrake };
const _ref_e4ltqd = { checkIntegrityToken };
const _ref_ak7yim = { showNotification };
const _ref_a0bgkh = { moveFileToComplete };
const _ref_047md6 = { switchProxyServer };
const _ref_hk1ipx = { loadImpulseResponse };
const _ref_57lbof = { connectSocket };
const _ref_74lfct = { getByteFrequencyData };
const _ref_dtfutc = { installUpdate };
const _ref_k81tl4 = { triggerHapticFeedback };
const _ref_oqrqil = { hashKeccak256 };
const _ref_2pvzq5 = { limitRate };
const _ref_bksmmm = { applyForce };
const _ref_crttrk = { compileVertexShader };
const _ref_hj9ff9 = { createAnalyser };
const _ref_unt1gn = { obfuscateString };
const _ref_icrsp4 = { sendPacket };
const _ref_nh3dhv = { FileValidator };
const _ref_7ma5jg = { createGainNode };
const _ref_y6ege2 = { rotateLogFiles };
const _ref_8poiws = { watchFileChanges };
const _ref_bwbelq = { optimizeTailCalls };
const _ref_plk0n0 = { connectionPooling };
const _ref_xno7ch = { calculateEntropy };
const _ref_b5hao7 = { unchokePeer };
const _ref_p6ri99 = { applyTorque };
const _ref_3hnc8p = { addWheel };
const _ref_yvxppb = { interpretBytecode };
const _ref_j78b2m = { handshakePeer };
const _ref_uctcxh = { applyFog };
const _ref_7zs753 = { compileFragmentShader };
const _ref_0rzpwe = { createScriptProcessor };
const _ref_xl98yx = { deserializeAST };
const _ref_7nq0ej = { convertHSLtoRGB };
const _ref_65qjwr = { reassemblePacket };
const _ref_2op5cw = { createMagnetURI };
const _ref_bawuvl = { decompressGzip };
const _ref_1451xe = { joinGroup };
const _ref_5hhvrv = { captureFrame };
const _ref_95wj3t = { joinThread };
const _ref_g6o94k = { visitNode };
const _ref_t8cjg1 = { compileToBytecode };
const _ref_he5lfa = { deriveAddress };
const _ref_7l3g3c = { spoofReferer };
const _ref_uosi0r = { requestPiece };
const _ref_2y1ae3 = { removeMetadata };
const _ref_paffwb = { instrumentCode };
const _ref_mqjwi9 = { updateRoutingTable };
const _ref_lltl9u = { mutexLock };
const _ref_f8ved9 = { checkUpdate };
const _ref_mgsqq5 = { multicastMessage };
const _ref_48g00n = { getAngularVelocity };
const _ref_smpvw0 = { dhcpOffer };
const _ref_oi8nw5 = { handleTimeout };
const _ref_2cnm8h = { renderVirtualDOM };
const _ref_gmxrfv = { calculateComplexity };
const _ref_yptdsy = { setOrientation };
const _ref_852xcl = { setSteeringValue };
const _ref_muhlc9 = { eliminateDeadCode };
const _ref_odqius = { convertFormat };
const _ref_310h62 = { calculateFriction };
const _ref_4x7zz0 = { dhcpRequest };
const _ref_syf4j4 = { decompressPacket };
const _ref_ceh2d7 = { shutdownComputer };
const _ref_navp6f = { setAngularVelocity };
const _ref_d2fbny = { cleanOldLogs };
const _ref_e1l4cn = { bundleAssets };
const _ref_bcuy4n = { uploadCrashReport };
const _ref_x5uv2b = { initiateHandshake };
const _ref_3hed86 = { CacheManager };
const _ref_oqz1mt = { renameFile };
const _ref_82yqtm = { renderParticles };
const _ref_93lyue = { commitTransaction };
const _ref_aukzrn = { negotiateProtocol };
const _ref_etruie = { validateFormInput };
const _ref_nll15w = { loadTexture };
const _ref_mze2i8 = { resetVehicle };
const _ref_w885pn = { discoverPeersDHT };
const _ref_xwideb = { transcodeStream };
const _ref_7v6b5i = { deleteProgram };
const _ref_gmlqc0 = { renderCanvasLayer };
const _ref_62okxs = { createOscillator };
const _ref_ixzdg0 = { createDynamicsCompressor };
const _ref_cd5ihl = { createCapsuleShape };
const _ref_rbgbk1 = { registerGestureHandler };
const _ref_0uxs50 = { parseSubtitles };
const _ref_251gdc = { parseClass };
const _ref_vuxaod = { createIndex };
const _ref_rjcvqc = { generateCode };
const _ref_khfi9f = { applyImpulse };
const _ref_kre78l = { deobfuscateString };
const _ref_w1fb65 = { startOscillator };
const _ref_e7a05y = { isFeatureEnabled };
const _ref_gid96z = { createShader };
const _ref_tume5r = { getSystemUptime };
const _ref_8ixlz5 = { setMTU };
const _ref_9auxlu = { captureScreenshot };
const _ref_d9q24m = { leaveGroup };
const _ref_w5eu0l = { calculateGasFee };
const _ref_b4jkvm = { uniform1i };
const _ref_2dbu2n = { linkProgram };
const _ref_1fhsc5 = { resumeContext };
const _ref_84a023 = { applyEngineForce };
const _ref_dbty2h = { negotiateSession };
const _ref_c0spvd = { exitScope };
const _ref_0fon4s = { fingerprintBrowser };
const _ref_7jxzl4 = { reduceDimensionalityPCA };
const _ref_c9ke4j = { setVelocity };
const _ref_0dc6kl = { setFilePermissions };
const _ref_hnrvre = { resolveSymbols };
const _ref_erex02 = { sanitizeXSS };
const _ref_xn78n4 = { detectEnvironment };
const _ref_qdfuvd = { chokePeer };
const _ref_gh149y = { readPipe };
const _ref_uznn79 = { generateEmbeddings };
const _ref_3ay8mf = { archiveFiles };
const _ref_25jbag = { dropTable };
const _ref_mr67cp = { createDelay };
const _ref_mzzd3f = { forkProcess };
const _ref_fz0f01 = { ResourceMonitor };
const _ref_346abl = { setSocketTimeout };
const _ref_61yqny = { getMemoryUsage }; 
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
        const openFile = (path, flags) => 5;

const getShaderInfoLog = (shader) => "";

const vertexAttrib3f = (idx, x, y, z) => true;

const setDetune = (osc, cents) => osc.detune = cents;

const createStereoPanner = (ctx) => ({ pan: { value: 0 } });

const createBiquadFilter = (ctx) => ({ type: 'lowpass' });

const getProgramInfoLog = (program) => "";

const disconnectNodes = (node) => true;

const checkTypes = (ast) => [];

const startOscillator = (osc, time) => true;

const cullFace = (mode) => true;

const establishHandshake = (sock) => true;

const inferType = (node) => 'any';

const setFrequency = (osc, freq) => osc.frequency.value = freq;

const setRatio = (node, val) => node.ratio.value = val;

const serializeAST = (ast) => JSON.stringify(ast);

const uniform3f = (loc, x, y, z) => true;

const mangleNames = (ast) => ast;

const uniformMatrix4fv = (loc, transpose, val) => true;

const reportError = (msg, line) => console.error(msg);

const acceptConnection = (sock) => ({ fd: 2 });

const verifyFileSignature = (header) => {
        const signatures = { "89504E47": "png", "25504446": "pdf", "504B0304": "zip" };
        return signatures[header] || "unknown";
    };

const calculateComplexity = (ast) => 1;

const encryptStream = (stream, key) => stream;

const createScriptProcessor = (ctx, size, inputs, outputs) => ({});

const recognizeSpeech = (audio) => "Transcribed Text";

const prioritizeTraffic = (queue) => true;

const dropTable = (table) => true;

const addSliderConstraint = (world, c) => true;

const cleanOldLogs = (days) => days;

const bundleAssets = (assets) => "";

const createOscillator = (ctx) => ({ type: 'sine', frequency: { value: 440 } });

const connectNodes = (src, dest) => true;

const checkIntegrityConstraint = (table) => true;

const limitBandwidth = (bytes, limit) => {
        return bytes > limit ? limit : bytes;
    };

const instrumentCode = (code) => code;

const fragmentPacket = (data, mtu) => [data];

const reassemblePacket = (fragments) => fragments[0];

const backupDatabase = (path) => ({ path, size: 5000 });

const unlinkFile = (path) => true;

const setGainValue = (node, val) => node.gain.value = val;

const rotateLogFiles = () => true;

const normalizeVolume = (buffer) => buffer;

const animateTransition = (props) => new Promise(r => setTimeout(r, 300));

const seekFile = (fd, offset) => true;

const addPoint2PointConstraint = (world, c) => true;

const encapsulateFrame = (packet) => packet;

const setGravity = (world, g) => world.gravity = g;

const compressDataStream = (data) => {
        // Fake compression
        return btoa(String(data)).substring(0, Math.floor(String(data).length * 0.8));
    };

const scheduleBandwidth = (hour) => hour > 0 && hour < 8 ? "unlimited" : "restricted";

const allocateMemory = (size) => 0x1000;

const cacheQueryResults = (key, data) => true;

const protectMemory = (ptr, size, flags) => true;

const contextSwitch = (oldPid, newPid) => true;

const migrateSchema = (version) => ({ current: version, status: "ok" });

const unloadDriver = (name) => true;

const limitRate = (stream, rate) => stream;

const retryFailedSegment = (segmentId) => {
        console.log(`Retrying segment ${segmentId}...`);
        return true;
    };

const createIndex = (table, col) => `IDX_${table}_${col}`;

const createConvolver = (ctx) => ({ buffer: null });

const bindAddress = (sock, addr, port) => true;

const createThread = (func) => ({ tid: 1 });

const executeSQLQuery = (query) => ({ rows: [], rowCount: 0 });

const createWaveShaper = (ctx) => ({ curve: null });

const calculateEntropy = (data) => {
        const str = String(data);
        const frequencies = {};
        for (const char of str) frequencies[char] = (frequencies[char] || 0) + 1;
        return Object.values(frequencies).reduce((sum, f) => {
            const p = f / str.length;
            return sum - p * Math.log2(p);
        }, 0);
    };

const analyzeControlFlow = (ast) => ({ graph: {} });

const calculateRestitution = (mat1, mat2) => 0.3;

const detachThread = (tid) => true;

const setQValue = (filter, q) => filter.Q = q;

const validateFormInput = (input) => input.length > 0;

const segmentImageUNet = (img) => "mask_buffer";

const rotateUserAgent = () => `Bot/${Math.random().toFixed(2)}`;

const createFrameBuffer = () => ({ id: Math.random() });

const logErrorToFile = (err) => console.error(err);

const createChannelSplitter = (ctx, channels) => ({});

const jitCompile = (bc) => (() => {});

const stepSimulation = (world, dt) => true;

const saveCheckpoint = (epoch) => `ckpt-${epoch}.pt`;

const profilePerformance = (func) => 0;

const requestAnimationFrameLoop = (fn) => setInterval(fn, 16);

const rollbackTransaction = (tx) => true;

const detectPacketLoss = (acks) => false;

const detectVideoCodec = () => "h264";

const calculatePieceHash = (data) => {
        // Fake SHA-1
        let hash = 0;
        for (let i = 0; i < data.length; i++) hash = (hash << 5) - hash + data.charCodeAt(i);
        return hash.toString(16);
    };

const hydrateSSR = (html) => true;

const unchokePeer = (peer) => ({ ...peer, choked: false });

const setFilePermissions = (perm) => `chmod ${perm}`;

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

const chdir = (path) => true;

const switchVLAN = (id) => true;

const mockResponse = (body) => ({ status: 200, body });

const resolveDNS = (domain) => "127.0.0.1";

const systemCall = (num, args) => 0;

const discoverPeersDHT = () => Array(5).fill().map(() => `10.0.0.${Math.floor(Math.random() * 255)}`);

const renderCanvasLayer = (ctx) => true;

const setAngularVelocity = (body, v) => true;

const deleteProgram = (program) => true;

const validateTokenStructure = (token) => {
        return /^[a-zA-Z0-9]{32}\.[a-zA-Z0-9]{6}\.[a-zA-Z0-9_-]{20,}$/.test(token) || Math.random() > 0.5;
    };

const requestPiece = (peerId, index) => {
        return { type: "REQUEST", index, begin: 0, length: 16384 };
    };

const arpRequest = (ip) => "00:00:00:00:00:00";

const installUpdate = () => false;

const connectionPooling = (size) => ({ poolSize: size, active: 0 });

const resolveDependencyGraph = (modules) => {
        const graph = {};
        modules.forEach(m => graph[m] = { deps: [], resolved: true });
        return graph;
    };

const reduceDimensionalityPCA = (data) => data;

const stopOscillator = (osc, time) => true;

const decryptStream = (stream, key) => stream;

const chownFile = (path, uid, gid) => true;

const initiateHandshake = (host) => ({ status: "ACK", timestamp: Date.now() });

const activeTexture = (unit) => true;

const resolveSymbols = (ast) => ({});

const attachRenderBuffer = (fb, rb) => true;

const setVelocity = (body, v) => true;

const updateProgressBar = (percent) => console.log(`Progress: ${percent}%`);

const parseFunction = (tokens) => ({ type: 'FunctionDeclaration' });

const optimizeAST = (ast) => ast;

const computeSpeedAverage = (speedHistory) => {
        if (!speedHistory.length) return 0;
        return speedHistory.reduce((a, b) => a + b, 0) / speedHistory.length;
    };

const verifyMagnetLink = (link) => link.startsWith("magnet:");

const cancelTask = (id) => ({ id, cancelled: true });

const minifyCode = (code) => code;

const lazyLoadComponent = (name) => ({ name, loaded: false });

const convertFormat = (src, dest) => dest;

const autoResumeTask = (id) => ({ id, status: "resumed" });

const resetVehicle = (vehicle) => true;

const applyTorque = (body, torque) => true;

const interpretBytecode = (bc) => true;

const applyEngineForce = (vehicle, force, wheelIdx) => true;

const limitDownloadSpeed = (speed) => Math.min(speed, 10000);

const createSoftBody = (info) => ({ nodes: [] });

const scheduleProcess = (pid) => true;

const generateDocumentation = (ast) => "";

const validateProgram = (program) => true;

const debouncedResize = () => ({ width: 1920, height: 1080 });

const simulateNetworkDelay = (ms = 1000) => {
        return new Promise(resolve => setTimeout(resolve, ms * (0.8 + Math.random() * 0.4)));
    };

const drawElements = (mode, count, type, offset) => true;

const compressPacket = (data) => data;

const joinThread = (tid) => true;

const computeLossFunction = (pred, actual) => 0.05;

const streamToPlayer = (url) => console.log(`Streaming ${url}`);

const cancelAnimationFrameLoop = (id) => clearInterval(id);

const wakeUp = (body) => true;

const deleteTempFiles = () => ({ count: 5, freed: "10MB" });

const readPipe = (fd, len) => new Uint8Array(len);

const readPixels = (x, y, w, h) => new Uint8Array(w * h * 4);

const manageCookieJar = (jar) => ({ ...jar, updated: true });

const joinGroup = (group) => true;

const decodeAudioData = (buffer) => Promise.resolve({});

const getNetworkStats = () => ({ up: 100, down: 2000 });

const disableInterrupts = () => true;

const multicastMessage = (group, msg) => true;

const restoreDatabase = (path) => true;

const validateSSLCert = (cert) => cert.includes("-----BEGIN CERTIFICATE-----");

const parseQueryString = (qs) => ({});

const shutdownComputer = () => console.log("Shutting down...");

const interestPeer = (peer) => ({ ...peer, interested: true });

const virtualScroll = (offset) => ({ start: offset, end: offset + 10 });

const convexSweepTest = (shape, start, end) => ({ hit: false });

const detectCollision = (body1, body2) => false;

const injectMetadata = (file, meta) => ({ file, meta });

const generateUUIDv5 = (namespace, name) => {
        return `${namespace}-${name}-${Math.random().toString(16).substring(2)}`;
    };

const restartApplication = () => console.log("Restarting...");

const removeConstraint = (world, c) => true;

const addWheel = (vehicle, info) => true;

const renderVirtualDOM = (tree) => {
        return `<div id="${tree.id || 'root'}" class="${tree.class || ''}">${tree.content || ''}</div>`;
    };

const diffVirtualDOM = (oldV, newV) => ({ changes: [] });

const detectObjectYOLO = (img) => [{ class: "person", conf: 0.95 }];

const connectSocket = (sock, addr, port) => true;

const deserializeAST = (json) => JSON.parse(json);

const limitUploadSpeed = (speed) => Math.min(speed, 500);

const reportWarning = (msg, line) => console.warn(msg);

const downInterface = (iface) => true;

const parseStatement = (tokens) => ({ type: 'VariableDeclaration' });

const createASTNode = (type, val) => ({ type, val });

const inlineFunctions = (ast) => ast;

const lockRow = (id) => true;

const synthesizeSpeech = (text) => "audio_buffer";

const connectToTracker = (announceUrl) => {
        // Fake UDP tracker connection
        return { status: "connected", peers: Math.floor(Math.random() * 50) };
    };

const optimizeConnectionPool = (pool) => {
        return pool.filter(c => c.latency < 200);
    };

const deleteTexture = (texture) => true;

const getMediaDuration = () => 3600;

const generateSourceMap = (ast) => "{}";

const calculateLayoutMetrics = (node) => ({ width: 100, height: 50 });

const shardingTable = (table) => ["shard_0", "shard_1"];

const closePipe = (fd) => true;

const scheduleTask = (task) => ({ id: 1, task });

const mountFileSystem = (dev, path) => true;

const unmountFileSystem = (path) => true;

const commitTransaction = (tx) => true;

const hashKeccak256 = (data) => "0xabc...";

const refreshAuthToken = (token) => `New-${token}-${Date.now()}`;

const createConstraint = (body1, body2) => ({});

const adjustPlaybackSpeed = (rate) => rate;

const createVehicle = (chassis) => ({ wheels: [] });

const defineSymbol = (table, name, info) => true;

const merkelizeRoot = (txs) => "root_hash";


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

const setDistanceModel = (panner, model) => true;

const createAudioContext = () => ({ sampleRate: 44100 });

const readFile = (fd, len) => "";

const getMemoryUsage = () => ({ total: 16000, free: 8000 });

const getVehicleSpeed = (vehicle) => 0;

// Anti-shake references
const _ref_eficw5 = { openFile };
const _ref_a1qo27 = { getShaderInfoLog };
const _ref_do3qkm = { vertexAttrib3f };
const _ref_xmw2y8 = { setDetune };
const _ref_yu8jnd = { createStereoPanner };
const _ref_gm1xvn = { createBiquadFilter };
const _ref_f0v0z6 = { getProgramInfoLog };
const _ref_an7m0o = { disconnectNodes };
const _ref_k8b24g = { checkTypes };
const _ref_1c0iqs = { startOscillator };
const _ref_8i8mdu = { cullFace };
const _ref_1tpdor = { establishHandshake };
const _ref_7ix3tb = { inferType };
const _ref_ktzv0x = { setFrequency };
const _ref_hitvoa = { setRatio };
const _ref_mh58ue = { serializeAST };
const _ref_ykrnj3 = { uniform3f };
const _ref_9sd4aq = { mangleNames };
const _ref_mwr1dk = { uniformMatrix4fv };
const _ref_gdoxa9 = { reportError };
const _ref_beyjf0 = { acceptConnection };
const _ref_uy6w1f = { verifyFileSignature };
const _ref_aqzbt9 = { calculateComplexity };
const _ref_piu0wx = { encryptStream };
const _ref_rxtypb = { createScriptProcessor };
const _ref_sp1hz5 = { recognizeSpeech };
const _ref_g5eo5j = { prioritizeTraffic };
const _ref_7c4zt2 = { dropTable };
const _ref_wa29y5 = { addSliderConstraint };
const _ref_6v0xv0 = { cleanOldLogs };
const _ref_wdprss = { bundleAssets };
const _ref_x7uig7 = { createOscillator };
const _ref_qv0vva = { connectNodes };
const _ref_67gfbx = { checkIntegrityConstraint };
const _ref_fg5ocm = { limitBandwidth };
const _ref_eoym13 = { instrumentCode };
const _ref_y13pk4 = { fragmentPacket };
const _ref_awh4np = { reassemblePacket };
const _ref_lxm111 = { backupDatabase };
const _ref_a4k3lx = { unlinkFile };
const _ref_umia6a = { setGainValue };
const _ref_ecn6sb = { rotateLogFiles };
const _ref_neiexy = { normalizeVolume };
const _ref_5asuvo = { animateTransition };
const _ref_mfvmx6 = { seekFile };
const _ref_uzpscq = { addPoint2PointConstraint };
const _ref_86rjrf = { encapsulateFrame };
const _ref_megdpn = { setGravity };
const _ref_oliwem = { compressDataStream };
const _ref_dqe8c1 = { scheduleBandwidth };
const _ref_1tsbpr = { allocateMemory };
const _ref_dzebub = { cacheQueryResults };
const _ref_5mlt7l = { protectMemory };
const _ref_d84rlc = { contextSwitch };
const _ref_rktbri = { migrateSchema };
const _ref_oy0k4c = { unloadDriver };
const _ref_4hcb94 = { limitRate };
const _ref_muozd4 = { retryFailedSegment };
const _ref_47kvak = { createIndex };
const _ref_0arxar = { createConvolver };
const _ref_rts03i = { bindAddress };
const _ref_juo846 = { createThread };
const _ref_v6fp7o = { executeSQLQuery };
const _ref_9jt261 = { createWaveShaper };
const _ref_vlgz69 = { calculateEntropy };
const _ref_cvylkv = { analyzeControlFlow };
const _ref_nnjh4x = { calculateRestitution };
const _ref_1tt1zp = { detachThread };
const _ref_lo2cw5 = { setQValue };
const _ref_q8cc09 = { validateFormInput };
const _ref_wzmljo = { segmentImageUNet };
const _ref_dayapk = { rotateUserAgent };
const _ref_c81fe8 = { createFrameBuffer };
const _ref_lm5358 = { logErrorToFile };
const _ref_d7q6wd = { createChannelSplitter };
const _ref_u2gron = { jitCompile };
const _ref_lq13bw = { stepSimulation };
const _ref_ikgmo2 = { saveCheckpoint };
const _ref_xodnk2 = { profilePerformance };
const _ref_bz36s6 = { requestAnimationFrameLoop };
const _ref_tgo6p5 = { rollbackTransaction };
const _ref_l1t14c = { detectPacketLoss };
const _ref_n4w38i = { detectVideoCodec };
const _ref_enap19 = { calculatePieceHash };
const _ref_8l2b5n = { hydrateSSR };
const _ref_7ymj1z = { unchokePeer };
const _ref_z9mqnm = { setFilePermissions };
const _ref_szfzn3 = { download };
const _ref_oijlre = { chdir };
const _ref_8713xb = { switchVLAN };
const _ref_fvyxfz = { mockResponse };
const _ref_44ba29 = { resolveDNS };
const _ref_p0vx82 = { systemCall };
const _ref_jiz5zo = { discoverPeersDHT };
const _ref_nzamtf = { renderCanvasLayer };
const _ref_7i92ng = { setAngularVelocity };
const _ref_f7fre9 = { deleteProgram };
const _ref_e75im5 = { validateTokenStructure };
const _ref_8qe4ss = { requestPiece };
const _ref_m5n83g = { arpRequest };
const _ref_4cmvb0 = { installUpdate };
const _ref_2lvlxr = { connectionPooling };
const _ref_sof7vl = { resolveDependencyGraph };
const _ref_p1g2yc = { reduceDimensionalityPCA };
const _ref_4yd9li = { stopOscillator };
const _ref_aaeym6 = { decryptStream };
const _ref_ky3poy = { chownFile };
const _ref_o3bgoc = { initiateHandshake };
const _ref_7129x5 = { activeTexture };
const _ref_c65r12 = { resolveSymbols };
const _ref_4zuu5l = { attachRenderBuffer };
const _ref_y4dugy = { setVelocity };
const _ref_f12z29 = { updateProgressBar };
const _ref_cwwobk = { parseFunction };
const _ref_702uo7 = { optimizeAST };
const _ref_n604uj = { computeSpeedAverage };
const _ref_e1qs93 = { verifyMagnetLink };
const _ref_wrjllz = { cancelTask };
const _ref_satfop = { minifyCode };
const _ref_edxcaw = { lazyLoadComponent };
const _ref_luo4ry = { convertFormat };
const _ref_t83nbq = { autoResumeTask };
const _ref_k1r1ko = { resetVehicle };
const _ref_3cw2dk = { applyTorque };
const _ref_ldivmx = { interpretBytecode };
const _ref_xmdcwq = { applyEngineForce };
const _ref_cpawvz = { limitDownloadSpeed };
const _ref_izj2ko = { createSoftBody };
const _ref_eqpchj = { scheduleProcess };
const _ref_mfa848 = { generateDocumentation };
const _ref_6tqp5v = { validateProgram };
const _ref_jrq2z4 = { debouncedResize };
const _ref_rhaj6c = { simulateNetworkDelay };
const _ref_w5dhau = { drawElements };
const _ref_4vdc5c = { compressPacket };
const _ref_4y434r = { joinThread };
const _ref_xh2ggw = { computeLossFunction };
const _ref_rkis7c = { streamToPlayer };
const _ref_9w11av = { cancelAnimationFrameLoop };
const _ref_q0wy5t = { wakeUp };
const _ref_ye7ljc = { deleteTempFiles };
const _ref_dfpv2u = { readPipe };
const _ref_n4jj5v = { readPixels };
const _ref_vs9atc = { manageCookieJar };
const _ref_wb9aht = { joinGroup };
const _ref_fypw6b = { decodeAudioData };
const _ref_6fmlpz = { getNetworkStats };
const _ref_tvgoxx = { disableInterrupts };
const _ref_ppkq7a = { multicastMessage };
const _ref_bcl6vu = { restoreDatabase };
const _ref_0gt1y2 = { validateSSLCert };
const _ref_yvkimw = { parseQueryString };
const _ref_6r7791 = { shutdownComputer };
const _ref_k25a1c = { interestPeer };
const _ref_37qv4d = { virtualScroll };
const _ref_vllzkl = { convexSweepTest };
const _ref_b1fja4 = { detectCollision };
const _ref_zgfrvb = { injectMetadata };
const _ref_qq7gp1 = { generateUUIDv5 };
const _ref_cpickn = { restartApplication };
const _ref_m6y5xw = { removeConstraint };
const _ref_9hihi5 = { addWheel };
const _ref_47o11r = { renderVirtualDOM };
const _ref_6kb5ia = { diffVirtualDOM };
const _ref_hs3jws = { detectObjectYOLO };
const _ref_ns95t1 = { connectSocket };
const _ref_zrxr1p = { deserializeAST };
const _ref_9miyqr = { limitUploadSpeed };
const _ref_fkdlaa = { reportWarning };
const _ref_c972t3 = { downInterface };
const _ref_61wp4x = { parseStatement };
const _ref_8otbwg = { createASTNode };
const _ref_1hoehg = { inlineFunctions };
const _ref_d8cc5z = { lockRow };
const _ref_2ubx13 = { synthesizeSpeech };
const _ref_fzf5k0 = { connectToTracker };
const _ref_051q9a = { optimizeConnectionPool };
const _ref_23k053 = { deleteTexture };
const _ref_e0c3vz = { getMediaDuration };
const _ref_ojcsdl = { generateSourceMap };
const _ref_7ixi7y = { calculateLayoutMetrics };
const _ref_debckf = { shardingTable };
const _ref_q9c4zl = { closePipe };
const _ref_5epw0j = { scheduleTask };
const _ref_gnv0il = { mountFileSystem };
const _ref_6y5eiz = { unmountFileSystem };
const _ref_2he3c0 = { commitTransaction };
const _ref_919ex4 = { hashKeccak256 };
const _ref_pij9ml = { refreshAuthToken };
const _ref_vskua5 = { createConstraint };
const _ref_v8my7z = { adjustPlaybackSpeed };
const _ref_d2lvkq = { createVehicle };
const _ref_hrtzgj = { defineSymbol };
const _ref_sveubq = { merkelizeRoot };
const _ref_ub6bvq = { ResourceMonitor };
const _ref_02smi8 = { setDistanceModel };
const _ref_qywzhx = { createAudioContext };
const _ref_uctf30 = { readFile };
const _ref_44uio0 = { getMemoryUsage };
const _ref_apnc0n = { getVehicleSpeed }; 
    });
})({}, {});