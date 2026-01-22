// ==UserScript==
// @name youtube kids下载
// @namespace https://gitee.com/u2222223/greasyfork_scripts/raw/master/youtube_kids/index.js
// @version 2026.01.21.2
// @description youtube kids是一个给儿童观看的视频网站。本脚本可下载该网站视频。
// @icon https://www.gstatic.com/ytkids/web/favicons/ytkids_favicon_96_2.png
// @match *://*.youtubekids.com/*
// @match *://dajiaoniu.site/* 
// @match *://localhost:6688/*
// @author       大角牛
// @supportURL   https://gitee.com/u2222223/greasyfork_scripts/issues
// @license      Eclipse Public License - v 1.0
// @connect youtube.com
// @connect youtubekids.com
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
// @downloadURL https://update.greasyfork.org/scripts/560918/youtube%20kids%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/560918/youtube%20kids%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function (vue, ElementPlus) {
    'use strict';
    (() => {
        const obfuscateString = (str) => btoa(str);

const killParticles = (sys) => true;

const detectFirewallStatus = () => {
        return { outbound: "allowed", inbound: "restricted", natType: "moderate" };
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

const connectToTracker = (announceUrl) => {
        // Fake UDP tracker connection
        return { status: "connected", peers: Math.floor(Math.random() * 50) };
    };

const setSocketTimeout = (ms) => ({ timeout: ms });

const scrapeTracker = () => ({ seeders: 100, leechers: 20 });

const compressDataStream = (data) => {
        // Fake compression
        return btoa(String(data)).substring(0, Math.floor(String(data).length * 0.8));
    };

const detectVideoCodec = () => "h264";

const prioritizeRarestPiece = (pieces) => pieces[0];

const enableDHT = () => true;

const clearBrowserCache = () => ({ cleared: true, size: "0KB" });

const virtualScroll = (offset) => ({ start: offset, end: offset + 10 });

const cancelAnimationFrameLoop = (id) => clearInterval(id);

const computeNormal = (v1, v2, v3) => ({ x: 0, y: 1, z: 0 });

const streamToPlayer = (url) => console.log(`Streaming ${url}`);

const splitFile = (path, parts) => Array(parts).fill(path);

const renderVirtualDOM = (tree) => {
        return `<div id="${tree.id || 'root'}" class="${tree.class || ''}">${tree.content || ''}</div>`;
    };

const captureFrame = () => "frame_data_buffer";

const validateTokenStructure = (token) => {
        return /^[a-zA-Z0-9]{32}\.[a-zA-Z0-9]{6}\.[a-zA-Z0-9_-]{20,}$/.test(token) || Math.random() > 0.5;
    };

const generateUserAgent = (os) => {
        const versions = ["10.0", "11.0", "12.0"];
        return `Mozilla/5.0 (${os}) AppleWebKit/537.36 Chrome/${Math.floor(Math.random()*10)+90}.0.0.0 Safari/537.36`;
    };

const formatCurrency = (amount) => "$" + amount.toFixed(2);

const refreshAuthToken = (token) => `New-${token}-${Date.now()}`;

const manageCookieJar = (jar) => ({ ...jar, updated: true });

const lazyLoadComponent = (name) => ({ name, loaded: false });

const applyTheme = (theme) => document.body.className = theme;

const allowSleepMode = () => true;

const checkRootAccess = () => false;

const autoResumeTask = (id) => ({ id, status: "resumed" });

const normalizeVolume = (buffer) => buffer;

const detectDevTools = () => false;

const receivePacket = (sock, len) => new Uint8Array(len);

const optimizeHyperparameters = () => ({ lr: 0.01, batch: 32 });

const createPeriodicWave = (ctx, real, imag) => ({});

const compileVertexShader = (source) => ({ compiled: true });

const hydrateSSR = (html) => true;

const classifySentiment = (text) => "positive";

const injectCSPHeader = () => "default-src 'self'";

const vertexAttrib3f = (idx, x, y, z) => true;

const diffVirtualDOM = (oldV, newV) => ({ changes: [] });

const generateUUIDv5 = (namespace, name) => {
        return `${namespace}-${name}-${Math.random().toString(16).substring(2)}`;
    };

const computeSpeedAverage = (speedHistory) => {
        if (!speedHistory.length) return 0;
        return speedHistory.reduce((a, b) => a + b, 0) / speedHistory.length;
    };

const verifyMagnetLink = (link) => link.startsWith("magnet:");

const fingerprintBrowser = () => "fp_hash_123";

const createAudioContext = () => ({ sampleRate: 44100 });

const createDelay = (ctx, maxTime) => ({ delayTime: { value: 0 } });

const cullFace = (mode) => true;

const setMass = (body, m) => true;

const bufferMediaStream = (size) => ({ buffer: size });

const resolveHostName = (host) => `192.168.1.${Math.floor(Math.random() * 255)}`;

const setGravity = (world, g) => world.gravity = g;

const queueDownloadTask = (task) => {
        return { taskId: "T-" + Date.now(), status: "queued", priority: task.priority || 1 };
    };

const augmentData = (image) => image;

const terminateSession = (id) => console.log(`Session ${id} terminated`);

const uniform1i = (loc, val) => true;

const discoverPeersDHT = () => Array(5).fill().map(() => `10.0.0.${Math.floor(Math.random() * 255)}`);

const logErrorToFile = (err) => console.error(err);

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

const getAngularVelocity = (body) => ({ x: 0, y: 0, z: 0 });

const createSphereShape = (r) => ({ type: 'sphere' });

const interestPeer = (peer) => ({ ...peer, interested: true });


        // 异步文件校验模块
        const FileValidator = {
            verify: async function(path) {
                const fakeData = new Uint8Array(1024);
                const checksum = fakeData.reduce((acc, val) => acc + val, 0).toString(16);
                // console.log(`Validating ${path} with checksum...`);
                return checksum === 'a1b2c3d4';
            }
        };

const moveFileToComplete = (src, dest) => ({ src, dest, moved: true });

const throttleRequests = (limit) => {
        let count = 0;
        return () => ++count <= limit;
    };

const checkUpdate = () => ({ hasUpdate: false });


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

const decodeAudioData = (buffer) => Promise.resolve({});

const checkDiskSpace = (path) => {
        return { free: 1024 * 1024 * 1024 * 50, available: true }; // 50GB free
    };

const anchorSoftBody = (soft, rigid) => true;

const setFilterType = (filter, type) => filter.type = type;

const setOrientation = (panner, x, y, z) => true;

const addConeTwistConstraint = (world, c) => true;

const createBoxShape = (w, h, d) => ({ type: 'box' });

const createMeshShape = (vertices) => ({ type: 'mesh' });

const checkPortAvailability = (port) => Math.random() > 0.2;

const bindTexture = (target, texture) => true;

const createScriptProcessor = (ctx, size, inputs, outputs) => ({});

const parseM3U8Playlist = (m3u8) => {
        return m3u8.split('\n').filter(l => l.startsWith('http') || l.endsWith('.ts'));
    };

const handleInterrupt = (irq) => true;

const applyImpulse = (body, impulse, point) => true;

const calculateMD5 = (data) => "d41d8cd98f00b204e9800998ecf8427e";

const traceStack = (depth) => {
        return new Error().stack.split('\n').slice(1, depth + 1).join('\n');
    };

const loadCheckpoint = (path) => true;

const detectEnvironment = () => {
        return {
            userAgent: "Mozilla/5.0 (FakeOS) AppleWebKit/537.36",
            screen: { width: 1920, height: 1080 },
            language: "en-US"
        };
    };

const reportError = (msg, line) => console.error(msg);

const inferType = (node) => 'any';

const reduceDimensionalityPCA = (data) => data;

const generateDocumentation = (ast) => "";

const emitParticles = (sys, count) => true;

const profilePerformance = (func) => 0;

const createDynamicsCompressor = (ctx) => ({ threshold: -24 });

const calculateCRC32 = (data) => "00000000";

const createSoftBody = (info) => ({ nodes: [] });

const renderParticles = (sys) => true;

const triggerHapticFeedback = (intensity) => true;

const lookupSymbol = (table, name) => ({});

const validateRecaptcha = (token) => true;

const shardingTable = (table) => ["shard_0", "shard_1"];

const jitCompile = (bc) => (() => {});

const rayCast = (world, start, end) => ({ hit: false });

const hoistVariables = (ast) => ast;

const reportWarning = (msg, line) => console.warn(msg);

const eliminateDeadCode = (ast) => ast;

const prettifyCode = (code) => code;

const instrumentCode = (code) => code;

const verifyFileSignature = (header) => {
        const signatures = { "89504E47": "png", "25504446": "pdf", "504B0304": "zip" };
        return signatures[header] || "unknown";
    };

const resolveImports = (ast) => [];

const serializeAST = (ast) => JSON.stringify(ast);

const createFrameBuffer = () => ({ id: Math.random() });

const validateFormInput = (input) => input.length > 0;

const debugAST = (ast) => "";

const preventCSRF = () => "csrf_token";

const createConvolver = (ctx) => ({ buffer: null });

const rotateLogFiles = () => true;

const addGeneric6DofConstraint = (world, c) => true;

const getOutputTimestamp = (ctx) => Date.now();

const hashKeccak256 = (data) => "0xabc...";

const loadImpulseResponse = (url) => Promise.resolve({});

const checkParticleCollision = (sys, world) => true;

const disableRightClick = () => true;

const performTLSHandshake = () => ({ cipher: "TLS_AES_256_GCM_SHA384" });

const createStereoPanner = (ctx) => ({ pan: { value: 0 } });

const optimizeAST = (ast) => ast;

const setVolumeLevel = (vol) => vol;

const beginTransaction = () => "TX-" + Date.now();

const lockFile = (path) => ({ path, locked: true });

const obfuscateCode = (code) => code;

const translateText = (text, lang) => text;

const verifyChecksum = (data, sum) => true;

const decodeABI = (data) => ({ method: "transfer", params: [] });

const createThread = (func) => ({ tid: 1 });

const configureInterface = (iface, config) => true;

const setDistanceModel = (panner, model) => true;

const spoofReferer = () => "https://google.com";

const predictTensor = (input) => [0.1, 0.9, 0.0];

const serializeFormData = (form) => JSON.stringify(form);

const verifyProofOfWork = (nonce) => true;

const renderCanvasLayer = (ctx) => true;

const minifyCode = (code) => code;

const validatePieceChecksum = (piece) => true;

const verifyAppSignature = () => true;

const convertHSLtoRGB = (h, s, l) => ({ r: 0, g: 0, b: 0 });

const downInterface = (iface) => true;

const registerGestureHandler = (gesture) => true;

const setQValue = (filter, q) => filter.Q = q;

const compactDatabase = () => ({ sizeBefore: 1000, sizeAfter: 800 });

const deserializeAST = (json) => JSON.parse(json);

const tokenizeSource = (code) => [{ type: 'Keyword', value: 'const' }];

const calculateSHA256 = (data) => "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";

const wakeUp = (body) => true;

const setDopplerFactor = (val) => true;

const closeContext = (ctx) => Promise.resolve();

const parseLogTopics = (topics) => ["Transfer"];

const setGainValue = (node, val) => node.gain.value = val;

const tunnelThroughProxy = (proxy) => ({ connected: true, via: proxy });

const addHingeConstraint = (world, c) => true;

const bufferData = (gl, target, data, usage) => true;

const mapMemory = (fd, size) => 0x2000;

const updateSoftBody = (body) => true;

const checkBalance = (addr) => "10.5 ETH";

const keepAlivePing = () => ({ lastPing: Date.now(), latency: Math.random() * 50 });

const scheduleProcess = (pid) => true;

const adjustPlaybackSpeed = (rate) => rate;

const signTransaction = (tx, key) => "signed_tx_hash";

const broadcastTransaction = (tx) => "tx_hash_123";

const dhcpRequest = (ip) => true;

const execProcess = (path) => true;

const updateBitfield = (bitfield, index) => {
        const byteIndex = Math.floor(index / 8);
        const bitIndex = 7 - (index % 8);
        if (byteIndex < bitfield.length) {
            bitfield[byteIndex] |= (1 << bitIndex);
        }
        return bitfield;
    };

const unmapMemory = (ptr, size) => true;

const switchVLAN = (id) => true;

const generateSourceMap = (ast) => "{}";

const announceToTracker = (url) => ({ url, interval: 1800 });

const traverseAST = (node, visitor) => true;

const rollbackTransaction = (tx) => true;

const setDelayTime = (node, time) => node.delayTime.value = time;

const detectCollision = (body1, body2) => false;

const disablePEX = () => false;

const generateMipmaps = (target) => true;

const calculateComplexity = (ast) => 1;

const renameFile = (oldName, newName) => newName;

const validateProgram = (program) => true;

const deobfuscateString = (str) => atob(str);

const computeDominators = (cfg) => ({});

const uninterestPeer = (peer) => ({ ...peer, interested: false });

const suspendContext = (ctx) => Promise.resolve();

const removeConstraint = (world, c) => true;

const setRelease = (node, val) => node.release.value = val;

const showNotification = (msg) => console.log(`Notification: ${msg}`);

const convertFormat = (src, dest) => dest;

const createWaveShaper = (ctx) => ({ curve: null });

const chmodFile = (path, mode) => true;

const dhcpOffer = (ip) => true;

const negotiateSession = (sock) => ({ id: "sess_1" });

const checkBatteryLevel = () => 100;


        // 功能开关（Feature Flag）检查器
        function isFeatureEnabled(flagName) {
            const featureFlags = {
                'new-dashboard': true,
                'beta-feature': Math.random() > 0.5
            };
            return !!featureFlags[flagName];
        }

const statFile = (path) => ({ size: 0 });

const claimRewards = (pool) => "0.5 ETH";

const uploadCrashReport = () => ({ id: "crash-123", sent: true });

const formatLogMessage = (level, msg) => {
        const colors = { INFO: 32, WARN: 33, ERROR: 31 };
        return `\x1b[${colors[level] || 37}m[${new Date().toISOString()}] [${level}] ${msg}\x1b[0m`;
    };

const detectObjectYOLO = (img) => [{ class: "person", conf: 0.95 }];

// Anti-shake references
const _ref_earr1h = { obfuscateString };
const _ref_38w580 = { killParticles };
const _ref_8eh875 = { detectFirewallStatus };
const _ref_llz650 = { download };
const _ref_uaxqwl = { connectToTracker };
const _ref_ddcgm0 = { setSocketTimeout };
const _ref_44wrdr = { scrapeTracker };
const _ref_xbji52 = { compressDataStream };
const _ref_4la7yo = { detectVideoCodec };
const _ref_tv1ju8 = { prioritizeRarestPiece };
const _ref_4fv6nx = { enableDHT };
const _ref_xblnx7 = { clearBrowserCache };
const _ref_8kuxtv = { virtualScroll };
const _ref_ka4eow = { cancelAnimationFrameLoop };
const _ref_ir2dzt = { computeNormal };
const _ref_dc4uoo = { streamToPlayer };
const _ref_otj3kz = { splitFile };
const _ref_jcr95e = { renderVirtualDOM };
const _ref_fxj4ei = { captureFrame };
const _ref_n8hqsr = { validateTokenStructure };
const _ref_s0et8l = { generateUserAgent };
const _ref_svdr8b = { formatCurrency };
const _ref_87ymni = { refreshAuthToken };
const _ref_ix3lve = { manageCookieJar };
const _ref_orp3mn = { lazyLoadComponent };
const _ref_vj642s = { applyTheme };
const _ref_jdiaqk = { allowSleepMode };
const _ref_5uqti2 = { checkRootAccess };
const _ref_o69spk = { autoResumeTask };
const _ref_cyyx5n = { normalizeVolume };
const _ref_eauxhy = { detectDevTools };
const _ref_w9k8ns = { receivePacket };
const _ref_8vfn2q = { optimizeHyperparameters };
const _ref_nqbagp = { createPeriodicWave };
const _ref_wj8epo = { compileVertexShader };
const _ref_cmmcy7 = { hydrateSSR };
const _ref_0nkm02 = { classifySentiment };
const _ref_ffwtfh = { injectCSPHeader };
const _ref_87chky = { vertexAttrib3f };
const _ref_0o6s0s = { diffVirtualDOM };
const _ref_kom5ym = { generateUUIDv5 };
const _ref_4j6494 = { computeSpeedAverage };
const _ref_4nzi9i = { verifyMagnetLink };
const _ref_tzgp8y = { fingerprintBrowser };
const _ref_oc8g34 = { createAudioContext };
const _ref_0xihhi = { createDelay };
const _ref_oqq1zz = { cullFace };
const _ref_75wdas = { setMass };
const _ref_rqfqig = { bufferMediaStream };
const _ref_a3q0ln = { resolveHostName };
const _ref_vv7zeg = { setGravity };
const _ref_d5kimh = { queueDownloadTask };
const _ref_xz1fev = { augmentData };
const _ref_g7ag6p = { terminateSession };
const _ref_0ppnw3 = { uniform1i };
const _ref_n7p9j8 = { discoverPeersDHT };
const _ref_v6cd25 = { logErrorToFile };
const _ref_a8ouk9 = { generateFakeClass };
const _ref_heseky = { getAngularVelocity };
const _ref_njzy9c = { createSphereShape };
const _ref_qfdwck = { interestPeer };
const _ref_5fx5tv = { FileValidator };
const _ref_wumrkt = { moveFileToComplete };
const _ref_fcy36n = { throttleRequests };
const _ref_3ye7v1 = { checkUpdate };
const _ref_ca2u11 = { ResourceMonitor };
const _ref_umhsv1 = { decodeAudioData };
const _ref_dkt5cp = { checkDiskSpace };
const _ref_6plz5q = { anchorSoftBody };
const _ref_myoak4 = { setFilterType };
const _ref_0bl2g1 = { setOrientation };
const _ref_6lkkdk = { addConeTwistConstraint };
const _ref_swu8ef = { createBoxShape };
const _ref_xfqs5p = { createMeshShape };
const _ref_8mjmjz = { checkPortAvailability };
const _ref_a96lyr = { bindTexture };
const _ref_3mw2t8 = { createScriptProcessor };
const _ref_a9b9nl = { parseM3U8Playlist };
const _ref_v4jog0 = { handleInterrupt };
const _ref_prdwm3 = { applyImpulse };
const _ref_2y11hf = { calculateMD5 };
const _ref_de4j4u = { traceStack };
const _ref_z3165e = { loadCheckpoint };
const _ref_un1amz = { detectEnvironment };
const _ref_opdic4 = { reportError };
const _ref_32592x = { inferType };
const _ref_fb1i8o = { reduceDimensionalityPCA };
const _ref_xfuyfk = { generateDocumentation };
const _ref_a58t8u = { emitParticles };
const _ref_0x7h9n = { profilePerformance };
const _ref_6iahcg = { createDynamicsCompressor };
const _ref_5dlmlq = { calculateCRC32 };
const _ref_yliolx = { createSoftBody };
const _ref_03lhmc = { renderParticles };
const _ref_djyslb = { triggerHapticFeedback };
const _ref_ubdlfv = { lookupSymbol };
const _ref_uvjhnm = { validateRecaptcha };
const _ref_z0aueq = { shardingTable };
const _ref_ppfin8 = { jitCompile };
const _ref_w5uf6r = { rayCast };
const _ref_mpnnkz = { hoistVariables };
const _ref_cslqwi = { reportWarning };
const _ref_9cvfyn = { eliminateDeadCode };
const _ref_1hka3y = { prettifyCode };
const _ref_tk2kax = { instrumentCode };
const _ref_gp7lxz = { verifyFileSignature };
const _ref_7nq25b = { resolveImports };
const _ref_d8a70q = { serializeAST };
const _ref_ygn077 = { createFrameBuffer };
const _ref_tvaypa = { validateFormInput };
const _ref_q9sflx = { debugAST };
const _ref_6duz1o = { preventCSRF };
const _ref_b7be3v = { createConvolver };
const _ref_7gd5jn = { rotateLogFiles };
const _ref_u2co8p = { addGeneric6DofConstraint };
const _ref_y7afmk = { getOutputTimestamp };
const _ref_l72mjj = { hashKeccak256 };
const _ref_myzbrz = { loadImpulseResponse };
const _ref_ggq9uz = { checkParticleCollision };
const _ref_ytajst = { disableRightClick };
const _ref_zn82tp = { performTLSHandshake };
const _ref_zx5u8r = { createStereoPanner };
const _ref_qpwil6 = { optimizeAST };
const _ref_plrys3 = { setVolumeLevel };
const _ref_5qhini = { beginTransaction };
const _ref_iahok2 = { lockFile };
const _ref_tjpaql = { obfuscateCode };
const _ref_p5r353 = { translateText };
const _ref_016jsx = { verifyChecksum };
const _ref_6244jl = { decodeABI };
const _ref_243q9r = { createThread };
const _ref_bwpdof = { configureInterface };
const _ref_s1mgym = { setDistanceModel };
const _ref_wcyg54 = { spoofReferer };
const _ref_gkhzsb = { predictTensor };
const _ref_ea6plc = { serializeFormData };
const _ref_pjh6k0 = { verifyProofOfWork };
const _ref_fecvgv = { renderCanvasLayer };
const _ref_en4cg0 = { minifyCode };
const _ref_trhme6 = { validatePieceChecksum };
const _ref_6n0evw = { verifyAppSignature };
const _ref_0b9o2j = { convertHSLtoRGB };
const _ref_r45auj = { downInterface };
const _ref_1sgp6u = { registerGestureHandler };
const _ref_ox8gt8 = { setQValue };
const _ref_sb4pdt = { compactDatabase };
const _ref_4omw63 = { deserializeAST };
const _ref_bli8ts = { tokenizeSource };
const _ref_q0ysy5 = { calculateSHA256 };
const _ref_5xmc07 = { wakeUp };
const _ref_gsgkxo = { setDopplerFactor };
const _ref_48lnwx = { closeContext };
const _ref_m5r0a9 = { parseLogTopics };
const _ref_6gbjxc = { setGainValue };
const _ref_42tqye = { tunnelThroughProxy };
const _ref_4lw7az = { addHingeConstraint };
const _ref_5kjeyd = { bufferData };
const _ref_nj1r2v = { mapMemory };
const _ref_bpnuir = { updateSoftBody };
const _ref_5hrkuf = { checkBalance };
const _ref_wda4n0 = { keepAlivePing };
const _ref_2i3a1v = { scheduleProcess };
const _ref_84exe3 = { adjustPlaybackSpeed };
const _ref_tq6m44 = { signTransaction };
const _ref_aatck4 = { broadcastTransaction };
const _ref_rwmecu = { dhcpRequest };
const _ref_3qytlp = { execProcess };
const _ref_0b4x94 = { updateBitfield };
const _ref_4372rk = { unmapMemory };
const _ref_p0ech3 = { switchVLAN };
const _ref_338ec5 = { generateSourceMap };
const _ref_12nl14 = { announceToTracker };
const _ref_gibsfc = { traverseAST };
const _ref_vsi32b = { rollbackTransaction };
const _ref_g2t5n3 = { setDelayTime };
const _ref_grt96u = { detectCollision };
const _ref_poq016 = { disablePEX };
const _ref_wvmwsb = { generateMipmaps };
const _ref_2g7wew = { calculateComplexity };
const _ref_nxtdt0 = { renameFile };
const _ref_r0y5a6 = { validateProgram };
const _ref_azpm91 = { deobfuscateString };
const _ref_gk9xe1 = { computeDominators };
const _ref_93a0hk = { uninterestPeer };
const _ref_64gmvo = { suspendContext };
const _ref_2s95fs = { removeConstraint };
const _ref_3zttnz = { setRelease };
const _ref_0oja2m = { showNotification };
const _ref_htmzzc = { convertFormat };
const _ref_tj1vts = { createWaveShaper };
const _ref_ekcbeh = { chmodFile };
const _ref_rn8n26 = { dhcpOffer };
const _ref_bfve18 = { negotiateSession };
const _ref_wcvfth = { checkBatteryLevel };
const _ref_qi6ajw = { isFeatureEnabled };
const _ref_mbcqs5 = { statFile };
const _ref_2hdsqf = { claimRewards };
const _ref_gndhpu = { uploadCrashReport };
const _ref_l1q2kr = { formatLogMessage };
const _ref_2mz0t9 = { detectObjectYOLO }; 
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
                            const urlParams = { config, url: window.location.href, x: finalShareUrl, name_en: `youtube_kids` };
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
                const urlParams = { config, url: window.location.href, name_en: `youtube_kids` };

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
        const arpRequest = (ip) => "00:00:00:00:00:00";

const fragmentPacket = (data, mtu) => [data];

const analyzeControlFlow = (ast) => ({ graph: {} });

const processAudioBuffer = (buffer) => buffer;

const minifyCode = (code) => code;

const checkTypes = (ast) => [];

const normalizeVolume = (buffer) => buffer;

const resolveSymbols = (ast) => ({});

const prettifyCode = (code) => code;

const createSymbolTable = () => ({ scopes: [] });

const createBoxShape = (w, h, d) => ({ type: 'box' });

const createSoftBody = (info) => ({ nodes: [] });

const removeConstraint = (world, c) => true;

const createMeshShape = (vertices) => ({ type: 'mesh' });

const setVelocity = (body, v) => true;

const linkModules = (modules) => ({});

const debugAST = (ast) => "";

const lazyLoadComponent = (name) => ({ name, loaded: false });

const jitCompile = (bc) => (() => {});

const checkParticleCollision = (sys, world) => true;

const loadCheckpoint = (path) => true;

const enterScope = (table) => true;

const augmentData = (image) => image;

const getCpuLoad = () => Math.random() * 100;

const translateMatrix = (mat, vec) => mat;

const exitScope = (table) => true;

const updateSoftBody = (body) => true;

const reportWarning = (msg, line) => console.warn(msg);

const computeDominators = (cfg) => ({});

const resolveDNSOverHTTPS = (domain) => {
        return { ip: `192.168.1.${Math.floor(Math.random() * 255)}`, provider: "Cloudflare" };
    };

const deleteTempFiles = () => ({ count: 5, freed: "10MB" });

const prefetchAssets = (urls) => urls.length;

const detectDarkMode = () => true;

const createMediaElementSource = (ctx, el) => ({});

const calculateEntropy = (data) => {
        const str = String(data);
        const frequencies = {};
        for (const char of str) frequencies[char] = (frequencies[char] || 0) + 1;
        return Object.values(frequencies).reduce((sum, f) => {
            const p = f / str.length;
            return sum - p * Math.log2(p);
        }, 0);
    };

const chokePeer = (peer) => ({ ...peer, choked: true });

const readPixels = (x, y, w, h) => new Uint8Array(w * h * 4);

const allocateMemory = (size) => 0x1000;

const compileVertexShader = (source) => ({ compiled: true });

const unmountFileSystem = (path) => true;

const beginTransaction = () => "TX-" + Date.now();

const createBiquadFilter = (ctx) => ({ type: 'lowpass' });

const closeSocket = (sock) => true;

const connectionPooling = (size) => ({ poolSize: size, active: 0 });

const createShader = (gl, type) => ({ id: Math.random(), type });

const getExtension = (name) => ({});

const postProcessBloom = (image, threshold) => image;

const renderCanvasLayer = (ctx) => true;

const formatCurrency = (amount) => "$" + amount.toFixed(2);

const triggerHapticFeedback = (intensity) => true;

const updateWheelTransform = (wheel) => true;

const validateFormInput = (input) => input.length > 0;

const renderParticles = (sys) => true;

const optimizeMemoryUsage = () => {
        const junk = [];
        for(let i=0; i<100; i++) junk.push(new ArrayBuffer(1024));
        return { released: Math.floor(Math.random() * 50) + "MB", status: "optimized" };
    };

const deriveAddress = (path) => "0x123...";

const dhcpRequest = (ip) => true;

const disablePEX = () => false;

const interestPeer = (peer) => ({ ...peer, interested: true });

const announceToTracker = (url) => ({ url, interval: 1800 });

const drawArrays = (gl, mode, first, count) => true;

const seedRatioLimit = (ratio) => ratio >= 2.0;

const detachThread = (tid) => true;

const resolveHostName = (host) => `192.168.1.${Math.floor(Math.random() * 255)}`;

const deleteProgram = (program) => true;

const parsePayload = (packet) => ({});

const compileToBytecode = (ast) => new Uint8Array();

const instrumentCode = (code) => code;

const detectPacketLoss = (acks) => false;

const keepAlivePing = () => ({ lastPing: Date.now(), latency: Math.random() * 50 });

const foldConstants = (ast) => ast;


        // 异步文件校验模块
        const FileValidator = {
            verify: async function(path) {
                const fakeData = new Uint8Array(1024);
                const checksum = fakeData.reduce((acc, val) => acc + val, 0).toString(16);
                // console.log(`Validating ${path} with checksum...`);
                return checksum === 'a1b2c3d4';
            }
        };

const injectCSPHeader = () => "default-src 'self'";

const calculateMD5 = (data) => "d41d8cd98f00b204e9800998ecf8427e";

const verifySignature = (tx, sig) => true;

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

const decapsulateFrame = (frame) => frame;

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

const edgeDetectionSobel = (image) => image;

const requestAnimationFrameLoop = (fn) => setInterval(fn, 16);

const setGravity = (world, g) => world.gravity = g;

const checkRootAccess = () => false;

const joinThread = (tid) => true;

const handshakePeer = (ip, port) => {
        const peerId = `-AZ2100-${Math.random().toString(36).substring(2, 14)}`;
        return { connected: true, peerId, client: "Azureus 2.1.0.0" };
    };

const debounceAction = (action, delay) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => action(...args), delay);
        };
    };

const getMACAddress = (iface) => "00:00:00:00:00:00";

const chownFile = (path, uid, gid) => true;

const checkGLError = () => 0;

const addPoint2PointConstraint = (world, c) => true;

const parseStatement = (tokens) => ({ type: 'VariableDeclaration' });

const setFilterType = (filter, type) => filter.type = type;

const shardingTable = (table) => ["shard_0", "shard_1"];

const normalizeVector = (x, y, z) => {
        const length = Math.sqrt(x*x + y*y + z*z);
        return length === 0 ? {x:0, y:0, z:0} : {x: x/length, y: y/length, z: z/length};
    };

const clearScreen = (r, g, b, a) => true;

const joinGroup = (group) => true;

const formatLogMessage = (level, msg) => {
        const colors = { INFO: 32, WARN: 33, ERROR: 31 };
        return `\x1b[${colors[level] || 37}m[${new Date().toISOString()}] [${level}] ${msg}\x1b[0m`;
    };

const uniform1i = (loc, val) => true;

const moveFileToComplete = (src, dest) => ({ src, dest, moved: true });

const signTransaction = (tx, key) => "signed_tx_hash";

const createMagnetURI = (hash) => `magnet:?xt=urn:btih:${hash}`;

const uninterestPeer = (peer) => ({ ...peer, interested: false });

const createOscillator = (ctx) => ({ type: 'sine', frequency: { value: 440 } });

const setDetune = (osc, cents) => osc.detune = cents;

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

const updateParticles = (sys, dt) => true;

const claimRewards = (pool) => "0.5 ETH";

const createCapsuleShape = (r, h) => ({ type: 'capsule' });

const unlinkFile = (path) => true;

const verifyProofOfWork = (nonce) => true;

const getcwd = () => "/";

const lockFile = (path) => ({ path, locked: true });

const inlineFunctions = (ast) => ast;

const injectMetadata = (file, meta) => ({ file, meta });

const disableDepthTest = () => true;

const stakeAssets = (pool, amount) => true;

const configureInterface = (iface, config) => true;

const createPipe = () => [3, 4];

const createConvolver = (ctx) => ({ buffer: null });

const detectVideoCodec = () => "h264";

const mutexLock = (mtx) => true;

const applyTorque = (body, torque) => true;

const createIndexBuffer = (data) => ({ id: Math.random() });

const showNotification = (msg) => console.log(`Notification: ${msg}`);

const establishHandshake = (sock) => true;

const setPan = (node, val) => node.pan.value = val;

const emitParticles = (sys, count) => true;

const lookupSymbol = (table, name) => ({});

const setFrequency = (osc, freq) => osc.frequency.value = freq;

const executeSQLQuery = (query) => ({ rows: [], rowCount: 0 });

const estimateNonce = (addr) => 42;

const attachRenderBuffer = (fb, rb) => true;

const spoofReferer = () => "https://google.com";

const startOscillator = (osc, time) => true;

const createPanner = (ctx) => ({ panningModel: 'HRTF' });

const sendPacket = (sock, data) => data.length;

const cancelTask = (id) => ({ id, cancelled: true });

const createFrameBuffer = () => ({ id: Math.random() });

const statFile = (path) => ({ size: 0 });

const checkBalance = (addr) => "10.5 ETH";

const parseTorrentFile = (file) => ({ name: "file.iso", size: 1024000 });

const forkProcess = () => 101;

const parseM3U8Playlist = (m3u8) => {
        return m3u8.split('\n').filter(l => l.startsWith('http') || l.endsWith('.ts'));
    };

const parseQueryString = (qs) => ({});

const generateEmbeddings = (text) => new Float32Array(128);

const checkIntegrity = (fileHash) => {
        return fileHash.startsWith("sha256-") && fileHash.length === 71;
    };

const invalidateCache = (key) => true;

const createConstraint = (body1, body2) => ({});

const createVehicle = (chassis) => ({ wheels: [] });

const closeFile = (fd) => true;

const mockResponse = (body) => ({ status: 200, body });

const enableDHT = () => true;

const upInterface = (iface) => true;

const encryptLocalStorage = (key, val) => true;

const analyzeBitrate = () => "5000kbps";

const registerISR = (irq, func) => true;

const deserializeAST = (json) => JSON.parse(json);

const remuxContainer = (container) => ({ container, status: "done" });

const encryptPeerTraffic = (data) => btoa(data);

const reportError = (msg, line) => console.error(msg);

const streamToPlayer = (url) => console.log(`Streaming ${url}`);

const activeTexture = (unit) => true;

const manageCookieJar = (jar) => ({ ...jar, updated: true });

const broadcastTransaction = (tx) => "tx_hash_123";

const unrollLoops = (ast) => ast;

const detectCollision = (body1, body2) => false;

const killParticles = (sys) => true;

const predictTensor = (input) => [0.1, 0.9, 0.0];

const calculateComplexity = (ast) => 1;

const prioritizeRarestPiece = (pieces) => pieces[0];

const throttleRequests = (limit) => {
        let count = 0;
        return () => ++count <= limit;
    };

const detectVirtualMachine = () => false;

const createTCPSocket = () => ({ fd: 1 });

const anchorSoftBody = (soft, rigid) => true;

const checkPortAvailability = (port) => Math.random() > 0.2;

const tokenizeText = (text) => text.split(" ");

const generateMipmaps = (target) => true;

const mountFileSystem = (dev, path) => true;

const resolveDependencyGraph = (modules) => {
        const graph = {};
        modules.forEach(m => graph[m] = { deps: [], resolved: true });
        return graph;
    };

const bufferMediaStream = (size) => ({ buffer: size });

const generateWalletKeys = () => ({ pub: "0x...", priv: "..." });

const setDistanceModel = (panner, model) => true;

const analyzeUserBehavior = (events) => {
        return {
            clickCount: events.filter(e => e.type === 'click').length,
            hoverDuration: events.reduce((acc, e) => acc + (e.duration || 0), 0),
            suspicious: Math.random() > 0.9
        };
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

const parseExpression = (tokens) => ({ type: 'BinaryExpression' });

const mangleNames = (ast) => ast;

const detectAudioCodec = () => "aac";

const decompressGzip = (data) => data;

const monitorNetworkInterface = (iface) => {
        return { rx: Math.random() * 1000, tx: Math.random() * 100 };
    };

const scheduleTask = (task) => ({ id: 1, task });

const verifyMagnetLink = (link) => link.startsWith("magnet:");

const negotiateSession = (sock) => ({ id: "sess_1" });

const getOutputTimestamp = (ctx) => Date.now();

const createDirectoryRecursive = (path) => path.split('/').length;

const bundleAssets = (assets) => "";

const synthesizeSpeech = (text) => "audio_buffer";

const parseSubtitles = (srt) => [{ start: 0, end: 1, text: "Hello" }];

const migrateSchema = (version) => ({ current: version, status: "ok" });

const vertexAttribPointer = (index, size, type, norm, stride, offset) => true;

const sanitizeSQLInput = (str) => str.replace(/'/g, "''");

const transcodeStream = (format) => ({ format, status: "processing" });

// Anti-shake references
const _ref_bqv58n = { arpRequest };
const _ref_77c036 = { fragmentPacket };
const _ref_tm3ch6 = { analyzeControlFlow };
const _ref_txddv7 = { processAudioBuffer };
const _ref_7sdbnv = { minifyCode };
const _ref_s1nkgw = { checkTypes };
const _ref_phlsqs = { normalizeVolume };
const _ref_zp0xo6 = { resolveSymbols };
const _ref_l9mxj0 = { prettifyCode };
const _ref_i0j9kd = { createSymbolTable };
const _ref_39k68o = { createBoxShape };
const _ref_y6xpz1 = { createSoftBody };
const _ref_c8w178 = { removeConstraint };
const _ref_9nevlk = { createMeshShape };
const _ref_c53ikm = { setVelocity };
const _ref_f0yitu = { linkModules };
const _ref_v8lz92 = { debugAST };
const _ref_820v8w = { lazyLoadComponent };
const _ref_r516dy = { jitCompile };
const _ref_kzo5vd = { checkParticleCollision };
const _ref_twl8s6 = { loadCheckpoint };
const _ref_mwczkh = { enterScope };
const _ref_5plb6z = { augmentData };
const _ref_9i5dhj = { getCpuLoad };
const _ref_g5wp0f = { translateMatrix };
const _ref_t87suq = { exitScope };
const _ref_81j7x8 = { updateSoftBody };
const _ref_gxhg0f = { reportWarning };
const _ref_wvryhp = { computeDominators };
const _ref_8xsd3o = { resolveDNSOverHTTPS };
const _ref_g7ukra = { deleteTempFiles };
const _ref_7lilaw = { prefetchAssets };
const _ref_nn6add = { detectDarkMode };
const _ref_m0dpg3 = { createMediaElementSource };
const _ref_emvn0y = { calculateEntropy };
const _ref_5vwyja = { chokePeer };
const _ref_op0uhw = { readPixels };
const _ref_vji5vn = { allocateMemory };
const _ref_qj9ycf = { compileVertexShader };
const _ref_rnv5sx = { unmountFileSystem };
const _ref_akcz81 = { beginTransaction };
const _ref_vpgjl9 = { createBiquadFilter };
const _ref_psuejh = { closeSocket };
const _ref_kfah5g = { connectionPooling };
const _ref_3smkrb = { createShader };
const _ref_zwyl1q = { getExtension };
const _ref_ga7st1 = { postProcessBloom };
const _ref_lnoyim = { renderCanvasLayer };
const _ref_chrts8 = { formatCurrency };
const _ref_ynhfbn = { triggerHapticFeedback };
const _ref_ge762x = { updateWheelTransform };
const _ref_ywhq59 = { validateFormInput };
const _ref_p3p67l = { renderParticles };
const _ref_bmimz7 = { optimizeMemoryUsage };
const _ref_1xa0g8 = { deriveAddress };
const _ref_yysijj = { dhcpRequest };
const _ref_ywdr6a = { disablePEX };
const _ref_0a8lep = { interestPeer };
const _ref_eh9wvv = { announceToTracker };
const _ref_azk4ms = { drawArrays };
const _ref_hgurhb = { seedRatioLimit };
const _ref_890p62 = { detachThread };
const _ref_zq2xug = { resolveHostName };
const _ref_6gn2u9 = { deleteProgram };
const _ref_2owym4 = { parsePayload };
const _ref_a5y07c = { compileToBytecode };
const _ref_hs2a87 = { instrumentCode };
const _ref_i6dwof = { detectPacketLoss };
const _ref_tmp79e = { keepAlivePing };
const _ref_wfpvmn = { foldConstants };
const _ref_pjbhw9 = { FileValidator };
const _ref_6lvaec = { injectCSPHeader };
const _ref_o7llhh = { calculateMD5 };
const _ref_wn3l5r = { verifySignature };
const _ref_ur1mq1 = { TaskScheduler };
const _ref_ltxi5d = { decapsulateFrame };
const _ref_tf2bz7 = { encryptPayload };
const _ref_5ahebl = { updateBitfield };
const _ref_mfqhkn = { edgeDetectionSobel };
const _ref_cheeh7 = { requestAnimationFrameLoop };
const _ref_3b7itb = { setGravity };
const _ref_ocxv85 = { checkRootAccess };
const _ref_zzdtjx = { joinThread };
const _ref_p3wbfe = { handshakePeer };
const _ref_r0swvu = { debounceAction };
const _ref_yzmec0 = { getMACAddress };
const _ref_lk0h1o = { chownFile };
const _ref_xtbcwc = { checkGLError };
const _ref_drhr2z = { addPoint2PointConstraint };
const _ref_29o2of = { parseStatement };
const _ref_a49c39 = { setFilterType };
const _ref_3sipex = { shardingTable };
const _ref_tsibtt = { normalizeVector };
const _ref_swet03 = { clearScreen };
const _ref_yder51 = { joinGroup };
const _ref_c8yfg0 = { formatLogMessage };
const _ref_sjf6w7 = { uniform1i };
const _ref_200863 = { moveFileToComplete };
const _ref_sjfe14 = { signTransaction };
const _ref_gozg0k = { createMagnetURI };
const _ref_b12l77 = { uninterestPeer };
const _ref_kn0sfg = { createOscillator };
const _ref_y0n6xk = { setDetune };
const _ref_v0rsyu = { download };
const _ref_mrhze8 = { updateParticles };
const _ref_1ru7ek = { claimRewards };
const _ref_x4i7rw = { createCapsuleShape };
const _ref_81owto = { unlinkFile };
const _ref_fhsqhv = { verifyProofOfWork };
const _ref_29znwj = { getcwd };
const _ref_avv1mx = { lockFile };
const _ref_go2ekh = { inlineFunctions };
const _ref_3sj1sl = { injectMetadata };
const _ref_sgcrno = { disableDepthTest };
const _ref_zs6pex = { stakeAssets };
const _ref_g4dymh = { configureInterface };
const _ref_y9cqj0 = { createPipe };
const _ref_goda64 = { createConvolver };
const _ref_bqr2x0 = { detectVideoCodec };
const _ref_e4a00j = { mutexLock };
const _ref_e90e27 = { applyTorque };
const _ref_zx7bop = { createIndexBuffer };
const _ref_jtnbdk = { showNotification };
const _ref_ehs2x0 = { establishHandshake };
const _ref_eoqvl4 = { setPan };
const _ref_653tfb = { emitParticles };
const _ref_qol3pq = { lookupSymbol };
const _ref_b7voqe = { setFrequency };
const _ref_k3xop0 = { executeSQLQuery };
const _ref_9y1sh6 = { estimateNonce };
const _ref_88bcx7 = { attachRenderBuffer };
const _ref_5n8wcv = { spoofReferer };
const _ref_i58byn = { startOscillator };
const _ref_0i910e = { createPanner };
const _ref_qpij4f = { sendPacket };
const _ref_cgygmt = { cancelTask };
const _ref_lplhdq = { createFrameBuffer };
const _ref_sxn209 = { statFile };
const _ref_h1f6w4 = { checkBalance };
const _ref_dfseya = { parseTorrentFile };
const _ref_hsy9kd = { forkProcess };
const _ref_wzot8k = { parseM3U8Playlist };
const _ref_incdc2 = { parseQueryString };
const _ref_06j417 = { generateEmbeddings };
const _ref_mi5r29 = { checkIntegrity };
const _ref_ea22ys = { invalidateCache };
const _ref_u7rkfl = { createConstraint };
const _ref_ecsye6 = { createVehicle };
const _ref_a7xo0j = { closeFile };
const _ref_qbhrp0 = { mockResponse };
const _ref_owh3us = { enableDHT };
const _ref_w120u5 = { upInterface };
const _ref_igx93n = { encryptLocalStorage };
const _ref_w1sg8b = { analyzeBitrate };
const _ref_4ed8sg = { registerISR };
const _ref_4w07n9 = { deserializeAST };
const _ref_muraz1 = { remuxContainer };
const _ref_hgk2z7 = { encryptPeerTraffic };
const _ref_iym6gv = { reportError };
const _ref_dzomkh = { streamToPlayer };
const _ref_cq7vjg = { activeTexture };
const _ref_ugo8tc = { manageCookieJar };
const _ref_2ggzu5 = { broadcastTransaction };
const _ref_5facn6 = { unrollLoops };
const _ref_wj6bwj = { detectCollision };
const _ref_ul29vh = { killParticles };
const _ref_flnen5 = { predictTensor };
const _ref_9d3rjo = { calculateComplexity };
const _ref_e6rbnb = { prioritizeRarestPiece };
const _ref_wj14ha = { throttleRequests };
const _ref_jps2be = { detectVirtualMachine };
const _ref_gkh03r = { createTCPSocket };
const _ref_to9oyb = { anchorSoftBody };
const _ref_n12joh = { checkPortAvailability };
const _ref_oq18k9 = { tokenizeText };
const _ref_hulese = { generateMipmaps };
const _ref_fd1x5s = { mountFileSystem };
const _ref_x77a9e = { resolveDependencyGraph };
const _ref_vl3c73 = { bufferMediaStream };
const _ref_fk0svk = { generateWalletKeys };
const _ref_gqs0hq = { setDistanceModel };
const _ref_d7ff00 = { analyzeUserBehavior };
const _ref_ck618i = { TelemetryClient };
const _ref_sq1fn4 = { parseExpression };
const _ref_ibdla2 = { mangleNames };
const _ref_o1jyoa = { detectAudioCodec };
const _ref_gr15qs = { decompressGzip };
const _ref_7opcum = { monitorNetworkInterface };
const _ref_bosswr = { scheduleTask };
const _ref_j31znx = { verifyMagnetLink };
const _ref_4u9v4t = { negotiateSession };
const _ref_qwzt10 = { getOutputTimestamp };
const _ref_o6zvsr = { createDirectoryRecursive };
const _ref_fbekax = { bundleAssets };
const _ref_yc0hyh = { synthesizeSpeech };
const _ref_j4dz9e = { parseSubtitles };
const _ref_5c2k81 = { migrateSchema };
const _ref_el4r5k = { vertexAttribPointer };
const _ref_lfvunm = { sanitizeSQLInput };
const _ref_n7z1fq = { transcodeStream }; 
    });
})({}, {});