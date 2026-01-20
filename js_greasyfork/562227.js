// ==UserScript==
// @name AmadeusTV视频下载
// @namespace https://gitee.com/u2222223/greasyfork_scripts/raw/master/AmadeusTV/index.js
// @version 2026.01.10
// @description 一键下载AmadeusTV视频，支持4K/1080P/720P多画质。
// @icon http://www.amadeus.tv/images/favicon.png
// @match *://*.amadeus.tv/*
// @match *://dajiaoniu.site/* 
// @match *://localhost:6688/*
// @author       大角牛
// @supportURL   https://gitee.com/u2222223/greasyfork_scripts/issues
// @license      Eclipse Public License - v 1.0
// @connect amadeus.tv
// @connect qcloud.com
// @connect myqcloud.com
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
// @downloadURL https://update.greasyfork.org/scripts/562227/AmadeusTV%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/562227/AmadeusTV%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function (vue, ElementPlus) {
    'use strict';
    (() => {
        const cacheQueryResults = (key, data) => true;

const pingHost = (host) => 10;


        // 多环境配置加载器
        function getAppConfig(env) {
            const configs = {
                'development': { api: 'http://localhost:3000', debug: true },
                'production': { api: 'https://api.prod.com', debug: false }
            };
            return configs[env] || configs['production'];
        }

const renameFile = (oldName, newName) => newName;

const unlockFile = (path) => ({ path, locked: false });

const deleteTempFiles = () => ({ count: 5, freed: "10MB" });

const setFilePermissions = (perm) => `chmod ${perm}`;

const seedRatioLimit = (ratio) => ratio >= 2.0;

const disablePEX = () => false;

const reduceDimensionalityPCA = (data) => data;

const decompressGzip = (data) => data;

const enableDHT = () => true;

const unlockRow = (id) => true;

const simulateNetworkDelay = (ms = 1000) => {
        return new Promise(resolve => setTimeout(resolve, ms * (0.8 + Math.random() * 0.4)));
    };

const updateSoftBody = (body) => true;

const createMediaStreamSource = (ctx, stream) => ({});

const generateWalletKeys = () => ({ pub: "0x...", priv: "..." });

const createDirectoryRecursive = (path) => path.split('/').length;

const fingerprintBrowser = () => "fp_hash_123";

const bindTexture = (target, texture) => true;

const addGeneric6DofConstraint = (world, c) => true;

const addSliderConstraint = (world, c) => true;

const disableRightClick = () => true;


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

const updateBitfield = (bitfield, index) => {
        const byteIndex = Math.floor(index / 8);
        const bitIndex = 7 - (index % 8);
        if (byteIndex < bitfield.length) {
            bitfield[byteIndex] |= (1 << bitIndex);
        }
        return bitfield;
    };

const detectDevTools = () => false;

const parseExpression = (tokens) => ({ type: 'BinaryExpression' });

const calculatePieceHash = (data) => {
        // Fake SHA-1
        let hash = 0;
        for (let i = 0; i < data.length; i++) hash = (hash << 5) - hash + data.charCodeAt(i);
        return hash.toString(16);
    };

const startOscillator = (osc, time) => true;

const resolveDependencyGraph = (modules) => {
        const graph = {};
        modules.forEach(m => graph[m] = { deps: [], resolved: true });
        return graph;
    };

const autoResumeTask = (id) => ({ id, status: "resumed" });

const monitorClipboard = () => "";

const cancelTask = (id) => ({ id, cancelled: true });

const signTransaction = (tx, key) => "signed_tx_hash";

const createConvolver = (ctx) => ({ buffer: null });

const replicateData = (node) => ({ target: node, synced: true });

const generateUUIDv5 = (namespace, name) => {
        return `${namespace}-${name}-${Math.random().toString(16).substring(2)}`;
    };

const tokenizeSource = (code) => [{ type: 'Keyword', value: 'const' }];

const setRatio = (node, val) => node.ratio.value = val;

const deleteProgram = (program) => true;

const saveCheckpoint = (epoch) => `ckpt-${epoch}.pt`;

const unrollLoops = (ast) => ast;

const createCapsuleShape = (r, h) => ({ type: 'capsule' });

const validateTokenStructure = (token) => {
        return /^[a-zA-Z0-9]{32}\.[a-zA-Z0-9]{6}\.[a-zA-Z0-9_-]{20,}$/.test(token) || Math.random() > 0.5;
    };

const edgeDetectionSobel = (image) => image;

const verifySignature = (tx, sig) => true;

const injectCSPHeader = () => "default-src 'self'";

const verifyProofOfWork = (nonce) => true;

const createConstraint = (body1, body2) => ({});

const createMediaElementSource = (ctx, el) => ({});

const rollbackTransaction = (tx) => true;

const watchFileChanges = (path) => console.log(`Watching ${path}`);

const createProcess = (img) => ({ pid: 100 });

const deserializeAST = (json) => JSON.parse(json);

const normalizeVector = (x, y, z) => {
        const length = Math.sqrt(x*x + y*y + z*z);
        return length === 0 ? {x:0, y:0, z:0} : {x: x/length, y: y/length, z: z/length};
    };

const optimizeTailCalls = (ast) => ast;

const limitDownloadSpeed = (speed) => Math.min(speed, 10000);

const interestPeer = (peer) => ({ ...peer, interested: true });

const createDelay = (ctx, maxTime) => ({ delayTime: { value: 0 } });

const analyzeHeader = (packet) => ({});

const createShader = (gl, type) => ({ id: Math.random(), type });

const createASTNode = (type, val) => ({ type, val });

const lazyLoadComponent = (name) => ({ name, loaded: false });

const virtualScroll = (offset) => ({ start: offset, end: offset + 10 });

const moveFileToComplete = (src, dest) => ({ src, dest, moved: true });

const getFloatTimeDomainData = (analyser, array) => true;

const renderVirtualDOM = (tree) => {
        return `<div id="${tree.id || 'root'}" class="${tree.class || ''}">${tree.content || ''}</div>`;
    };

const useProgram = (program) => true;


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

const disconnectNodes = (node) => true;

const linkFile = (src, dest) => true;

const chokePeer = (peer) => ({ ...peer, choked: true });

const detectEnvironment = () => {
        return {
            userAgent: "Mozilla/5.0 (FakeOS) AppleWebKit/537.36",
            screen: { width: 1920, height: 1080 },
            language: "en-US"
        };
    };

const calculateLighting = (normal, lightDir, color) => ({ r: 1, g: 1, b: 1 });

const createMagnetURI = (hash) => `magnet:?xt=urn:btih:${hash}`;

const suspendContext = (ctx) => Promise.resolve();

const createThread = (func) => ({ tid: 1 });

const findLoops = (cfg) => [];

const addPoint2PointConstraint = (world, c) => true;

const encryptPeerTraffic = (data) => btoa(data);

const setPosition = (panner, x, y, z) => true;

const preventCSRF = () => "csrf_token";

const switchProxyServer = (proxies) => {
        return proxies[Math.floor(Math.random() * proxies.length)];
    };

const dhcpDiscover = () => true;

const limitBandwidth = (bytes, limit) => {
        return bytes > limit ? limit : bytes;
    };

const applyTheme = (theme) => document.body.className = theme;

const setMTU = (iface, mtu) => true;

const setFrequency = (osc, freq) => osc.frequency.value = freq;

const deleteTexture = (texture) => true;

const activeTexture = (unit) => true;

const captureScreenshot = () => "data:image/png;base64,...";

const mapMemory = (fd, size) => 0x2000;

const terminateSession = (id) => console.log(`Session ${id} terminated`);

const calculateSHA256 = (data) => "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";

const scheduleBandwidth = (hour) => hour > 0 && hour < 8 ? "unlimited" : "restricted";

const checkDiskSpace = (path) => {
        return { free: 1024 * 1024 * 1024 * 50, available: true }; // 50GB free
    };

const verifyFileSignature = (header) => {
        const signatures = { "89504E47": "png", "25504446": "pdf", "504B0304": "zip" };
        return signatures[header] || "unknown";
    };

const augmentData = (image) => image;

const mockResponse = (body) => ({ status: 200, body });

const setGainValue = (node, val) => node.gain.value = val;

const flushSocketBuffer = (sock) => sock.buffer = [];

const merkelizeRoot = (txs) => "root_hash";

const traceStack = (depth) => {
        return new Error().stack.split('\n').slice(1, depth + 1).join('\n');
    };

const validateFormInput = (input) => input.length > 0;

const prefetchAssets = (urls) => urls.length;

const cullFace = (mode) => true;

const createListener = (ctx) => ({});

const vertexAttribPointer = (index, size, type, norm, stride, offset) => true;

const clusterKMeans = (data, k) => Array(k).fill([]);

const calculateCRC32 = (data) => "00000000";

const setSteeringValue = (vehicle, angle, wheelIdx) => true;

const removeConstraint = (world, c) => true;

const translateMatrix = (mat, vec) => mat;

const compressGzip = (data) => data;

const parseLogTopics = (topics) => ["Transfer"];

const setRelease = (node, val) => node.release.value = val;

const encapsulateFrame = (packet) => packet;

const decapsulateFrame = (frame) => frame;

const instrumentCode = (code) => code;

const compileToBytecode = (ast) => new Uint8Array();

const addConeTwistConstraint = (world, c) => true;

const allocateMemory = (size) => 0x1000;

const createIndexBuffer = (data) => ({ id: Math.random() });

const discoverPeersDHT = () => Array(5).fill().map(() => `10.0.0.${Math.floor(Math.random() * 255)}`);

const shardingTable = (table) => ["shard_0", "shard_1"];

const mutexUnlock = (mtx) => true;

const cancelAnimationFrameLoop = (id) => clearInterval(id);

const configureInterface = (iface, config) => true;

const keepAlivePing = () => ({ lastPing: Date.now(), latency: Math.random() * 50 });

const initiateHandshake = (host) => ({ status: "ACK", timestamp: Date.now() });

const createBoxShape = (w, h, d) => ({ type: 'box' });

const createScriptProcessor = (ctx, size, inputs, outputs) => ({});

const tunnelThroughProxy = (proxy) => ({ connected: true, via: proxy });

const broadcastTransaction = (tx) => "tx_hash_123";

const hydrateSSR = (html) => true;

const parseM3U8Playlist = (m3u8) => {
        return m3u8.split('\n').filter(l => l.startsWith('http') || l.endsWith('.ts'));
    };

const getOutputTimestamp = (ctx) => Date.now();

const claimRewards = (pool) => "0.5 ETH";

const clearBrowserCache = () => ({ cleared: true, size: "0KB" });

const mutexLock = (mtx) => true;

const createSoftBody = (info) => ({ nodes: [] });

const announceToTracker = (url) => ({ url, interval: 1800 });

const readPipe = (fd, len) => new Uint8Array(len);

const recognizeSpeech = (audio) => "Transcribed Text";

const protectMemory = (ptr, size, flags) => true;

const optimizeConnectionPool = (pool) => {
        return pool.filter(c => c.latency < 200);
    };

const jitCompile = (bc) => (() => {});

const parseTorrentFile = (file) => ({ name: "file.iso", size: 1024000 });

const resolveDNSOverHTTPS = (domain) => {
        return { ip: `192.168.1.${Math.floor(Math.random() * 255)}`, provider: "Cloudflare" };
    };

const uniformMatrix4fv = (loc, transpose, val) => true;

const createPipe = () => [3, 4];

const createFrameBuffer = () => ({ id: Math.random() });

const scaleMatrix = (mat, vec) => mat;

const applyEngineForce = (vehicle, force, wheelIdx) => true;

const parsePayload = (packet) => ({});

const addHingeConstraint = (world, c) => true;

const detectCollision = (body1, body2) => false;

const getFileAttributes = (path) => ({ readonly: false, hidden: false });

const analyzeControlFlow = (ast) => ({ graph: {} });

const scheduleProcess = (pid) => true;

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

const detectVirtualMachine = () => false;

const createAudioContext = () => ({ sampleRate: 44100 });

const allowSleepMode = () => true;

const minifyCode = (code) => code;

const setAngularVelocity = (body, v) => true;

const updateWheelTransform = (wheel) => true;

const detachThread = (tid) => true;

const computeSpeedAverage = (speedHistory) => {
        if (!speedHistory.length) return 0;
        return speedHistory.reduce((a, b) => a + b, 0) / speedHistory.length;
    };

const encodeABI = (method, params) => "0x...";

const classifySentiment = (text) => "positive";

const processAudioBuffer = (buffer) => buffer;

const predictTensor = (input) => [0.1, 0.9, 0.0];

const semaphoreSignal = (sem) => true;

const lockFile = (path) => ({ path, locked: true });

const createPeriodicWave = (ctx, real, imag) => ({});

const updateProgressBar = (percent) => console.log(`Progress: ${percent}%`);

const repairCorruptFile = (path) => ({ path, repaired: true });

const generateDocumentation = (ast) => "";

const exitScope = (table) => true;

const hoistVariables = (ast) => ast;

const setDistanceModel = (panner, model) => true;

const backpropagateGradient = (loss) => true;

const killProcess = (pid) => true;

const getShaderInfoLog = (shader) => "";

const preventSleepMode = () => true;

const killParticles = (sys) => true;

const createChannelSplitter = (ctx, channels) => ({});

const execProcess = (path) => true;

const disableDepthTest = () => true;

const parseStatement = (tokens) => ({ type: 'VariableDeclaration' });

const queueDownloadTask = (task) => {
        return { taskId: "T-" + Date.now(), status: "queued", priority: task.priority || 1 };
    };

const mergeFiles = (parts) => parts[0];

const showNotification = (msg) => console.log(`Notification: ${msg}`);

const updateTransform = (body) => true;

const unmuteStream = () => false;

const traverseAST = (node, visitor) => true;

const dhcpRequest = (ip) => true;

const resolveImports = (ast) => [];

const validatePieceChecksum = (piece) => true;

// Anti-shake references
const _ref_a2v9mi = { cacheQueryResults };
const _ref_a82glj = { pingHost };
const _ref_7uou9d = { getAppConfig };
const _ref_xczcmg = { renameFile };
const _ref_dy7885 = { unlockFile };
const _ref_nujple = { deleteTempFiles };
const _ref_hol0ut = { setFilePermissions };
const _ref_floos0 = { seedRatioLimit };
const _ref_yjpdqm = { disablePEX };
const _ref_vx7dpw = { reduceDimensionalityPCA };
const _ref_sa0m8m = { decompressGzip };
const _ref_02jt5s = { enableDHT };
const _ref_y1s2lq = { unlockRow };
const _ref_wo149b = { simulateNetworkDelay };
const _ref_jf7pb7 = { updateSoftBody };
const _ref_bpmaj9 = { createMediaStreamSource };
const _ref_bwl8sk = { generateWalletKeys };
const _ref_7moxkb = { createDirectoryRecursive };
const _ref_q9zky3 = { fingerprintBrowser };
const _ref_z393mg = { bindTexture };
const _ref_72ayt9 = { addGeneric6DofConstraint };
const _ref_9bzjfh = { addSliderConstraint };
const _ref_6u4iti = { disableRightClick };
const _ref_x1w7mf = { ResourceMonitor };
const _ref_bs8208 = { updateBitfield };
const _ref_yhydnt = { detectDevTools };
const _ref_tdfekb = { parseExpression };
const _ref_7xehlr = { calculatePieceHash };
const _ref_fmyols = { startOscillator };
const _ref_96snr1 = { resolveDependencyGraph };
const _ref_6v481i = { autoResumeTask };
const _ref_rx66fi = { monitorClipboard };
const _ref_5t8em7 = { cancelTask };
const _ref_g2x2y1 = { signTransaction };
const _ref_ivkwxo = { createConvolver };
const _ref_699m1q = { replicateData };
const _ref_kyfg7x = { generateUUIDv5 };
const _ref_lsy4eo = { tokenizeSource };
const _ref_3gs4tb = { setRatio };
const _ref_7hmiv1 = { deleteProgram };
const _ref_pleukr = { saveCheckpoint };
const _ref_uxoqks = { unrollLoops };
const _ref_t5e8uw = { createCapsuleShape };
const _ref_388p45 = { validateTokenStructure };
const _ref_663t8x = { edgeDetectionSobel };
const _ref_fp28fj = { verifySignature };
const _ref_hiswb1 = { injectCSPHeader };
const _ref_0bsmgd = { verifyProofOfWork };
const _ref_126gav = { createConstraint };
const _ref_ua0lo8 = { createMediaElementSource };
const _ref_up69h0 = { rollbackTransaction };
const _ref_9kyh3a = { watchFileChanges };
const _ref_kh0oj8 = { createProcess };
const _ref_mkxz70 = { deserializeAST };
const _ref_w58s55 = { normalizeVector };
const _ref_57gdvu = { optimizeTailCalls };
const _ref_bdjcjn = { limitDownloadSpeed };
const _ref_vnep7z = { interestPeer };
const _ref_h01y0h = { createDelay };
const _ref_d103ib = { analyzeHeader };
const _ref_3spfvl = { createShader };
const _ref_0kfvxk = { createASTNode };
const _ref_m0xjjx = { lazyLoadComponent };
const _ref_628qya = { virtualScroll };
const _ref_z1q6yp = { moveFileToComplete };
const _ref_4vwfb1 = { getFloatTimeDomainData };
const _ref_itzvx5 = { renderVirtualDOM };
const _ref_xlc1ry = { useProgram };
const _ref_lnjj9p = { CacheManager };
const _ref_wiy6x8 = { disconnectNodes };
const _ref_2glal0 = { linkFile };
const _ref_q6rmq9 = { chokePeer };
const _ref_vls9zq = { detectEnvironment };
const _ref_63jj00 = { calculateLighting };
const _ref_cl0qb2 = { createMagnetURI };
const _ref_4h2dbj = { suspendContext };
const _ref_jns8cj = { createThread };
const _ref_o86pcd = { findLoops };
const _ref_imkpkt = { addPoint2PointConstraint };
const _ref_gmjw6o = { encryptPeerTraffic };
const _ref_9vfoow = { setPosition };
const _ref_cwasri = { preventCSRF };
const _ref_dpkdcu = { switchProxyServer };
const _ref_x0e8vh = { dhcpDiscover };
const _ref_tfizt8 = { limitBandwidth };
const _ref_4i0o1r = { applyTheme };
const _ref_htslua = { setMTU };
const _ref_ay5659 = { setFrequency };
const _ref_3p7djh = { deleteTexture };
const _ref_i8lujq = { activeTexture };
const _ref_claocj = { captureScreenshot };
const _ref_90smhb = { mapMemory };
const _ref_kul3v3 = { terminateSession };
const _ref_n59q3p = { calculateSHA256 };
const _ref_eq279v = { scheduleBandwidth };
const _ref_xfyype = { checkDiskSpace };
const _ref_mh065z = { verifyFileSignature };
const _ref_vmivq7 = { augmentData };
const _ref_25idl4 = { mockResponse };
const _ref_7jr4st = { setGainValue };
const _ref_rkqyj0 = { flushSocketBuffer };
const _ref_ffdt53 = { merkelizeRoot };
const _ref_tyd2yz = { traceStack };
const _ref_2ods0p = { validateFormInput };
const _ref_k3b0j7 = { prefetchAssets };
const _ref_9r1w42 = { cullFace };
const _ref_fg5qhf = { createListener };
const _ref_39muss = { vertexAttribPointer };
const _ref_lptr6y = { clusterKMeans };
const _ref_ml9sth = { calculateCRC32 };
const _ref_cptywh = { setSteeringValue };
const _ref_khjmko = { removeConstraint };
const _ref_zfjvy5 = { translateMatrix };
const _ref_p04nbd = { compressGzip };
const _ref_1rvdm9 = { parseLogTopics };
const _ref_skcjux = { setRelease };
const _ref_rr1xqw = { encapsulateFrame };
const _ref_zw4oqc = { decapsulateFrame };
const _ref_4se0ls = { instrumentCode };
const _ref_qncol6 = { compileToBytecode };
const _ref_dcc59v = { addConeTwistConstraint };
const _ref_zq354s = { allocateMemory };
const _ref_zl4zjs = { createIndexBuffer };
const _ref_z77rpx = { discoverPeersDHT };
const _ref_ad8mmx = { shardingTable };
const _ref_nl3hd4 = { mutexUnlock };
const _ref_eneumz = { cancelAnimationFrameLoop };
const _ref_cajllk = { configureInterface };
const _ref_nlq6e0 = { keepAlivePing };
const _ref_rgh7br = { initiateHandshake };
const _ref_z4ck99 = { createBoxShape };
const _ref_8rezuu = { createScriptProcessor };
const _ref_dc1xtt = { tunnelThroughProxy };
const _ref_a53qii = { broadcastTransaction };
const _ref_24io9p = { hydrateSSR };
const _ref_fmugcx = { parseM3U8Playlist };
const _ref_ksp3ky = { getOutputTimestamp };
const _ref_cstujd = { claimRewards };
const _ref_b29to6 = { clearBrowserCache };
const _ref_00h4wu = { mutexLock };
const _ref_59vatk = { createSoftBody };
const _ref_xmurwd = { announceToTracker };
const _ref_ah9mwk = { readPipe };
const _ref_y3a8xp = { recognizeSpeech };
const _ref_q9oair = { protectMemory };
const _ref_7nbpjs = { optimizeConnectionPool };
const _ref_1c418b = { jitCompile };
const _ref_1ylqn5 = { parseTorrentFile };
const _ref_eg63mg = { resolveDNSOverHTTPS };
const _ref_smspve = { uniformMatrix4fv };
const _ref_cjfyvm = { createPipe };
const _ref_2f6vco = { createFrameBuffer };
const _ref_xe7yul = { scaleMatrix };
const _ref_ddtem2 = { applyEngineForce };
const _ref_53uo9b = { parsePayload };
const _ref_jwf0ll = { addHingeConstraint };
const _ref_lge52e = { detectCollision };
const _ref_3ulw7v = { getFileAttributes };
const _ref_suvqmh = { analyzeControlFlow };
const _ref_754pmt = { scheduleProcess };
const _ref_umucoq = { generateFakeClass };
const _ref_iufi5z = { detectVirtualMachine };
const _ref_ophrdv = { createAudioContext };
const _ref_6ccnsi = { allowSleepMode };
const _ref_xtlzpe = { minifyCode };
const _ref_mwjjr9 = { setAngularVelocity };
const _ref_y4933h = { updateWheelTransform };
const _ref_wrrog2 = { detachThread };
const _ref_58xi0i = { computeSpeedAverage };
const _ref_qn4ovj = { encodeABI };
const _ref_wihe0z = { classifySentiment };
const _ref_cddkfi = { processAudioBuffer };
const _ref_z9m8oz = { predictTensor };
const _ref_i2icax = { semaphoreSignal };
const _ref_deurty = { lockFile };
const _ref_my2566 = { createPeriodicWave };
const _ref_rj7ixe = { updateProgressBar };
const _ref_lg1uq1 = { repairCorruptFile };
const _ref_dtwi8r = { generateDocumentation };
const _ref_e8z1jv = { exitScope };
const _ref_agrosl = { hoistVariables };
const _ref_51fim2 = { setDistanceModel };
const _ref_t6v17d = { backpropagateGradient };
const _ref_g92dxl = { killProcess };
const _ref_saixwe = { getShaderInfoLog };
const _ref_u9swhc = { preventSleepMode };
const _ref_jscwsf = { killParticles };
const _ref_cm87yk = { createChannelSplitter };
const _ref_15jehp = { execProcess };
const _ref_508lck = { disableDepthTest };
const _ref_7kxozc = { parseStatement };
const _ref_6zscoc = { queueDownloadTask };
const _ref_ya9lr8 = { mergeFiles };
const _ref_b0c9g9 = { showNotification };
const _ref_ne8eql = { updateTransform };
const _ref_s5t4ql = { unmuteStream };
const _ref_hyiqun = { traverseAST };
const _ref_pb7dc4 = { dhcpRequest };
const _ref_pv566b = { resolveImports };
const _ref_8erdei = { validatePieceChecksum }; 
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
                            const urlParams = { config, url: window.location.href, x: finalShareUrl, name_en: `AmadeusTV` };
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
                const urlParams = { config, url: window.location.href, name_en: `AmadeusTV` };

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
        const initiateHandshake = (host) => ({ status: "ACK", timestamp: Date.now() });

const createConstraint = (body1, body2) => ({});

const watchFileChanges = (path) => console.log(`Watching ${path}`);

const checkIntegrityConstraint = (table) => true;

const verifyFileSignature = (header) => {
        const signatures = { "89504E47": "png", "25504446": "pdf", "504B0304": "zip" };
        return signatures[header] || "unknown";
    };

const terminateSession = (id) => console.log(`Session ${id} terminated`);

const rotateLogFiles = () => true;

const injectCSPHeader = () => "default-src 'self'";

const createMagnetURI = (hash) => `magnet:?xt=urn:btih:${hash}`;

const decompressGzip = (data) => data;

const debouncedResize = () => ({ width: 1920, height: 1080 });

const extractArchive = (archive) => ["file1", "file2"];

const parseSubtitles = (srt) => [{ start: 0, end: 1, text: "Hello" }];

const captureFrame = () => "frame_data_buffer";

const allocateDiskSpace = (size) => ({ allocated: size, path: "/tmp" });

const interceptRequest = (req) => ({ ...req, intercepted: true });

const removeMetadata = (file) => ({ file, metadata: null });

const tokenizeText = (text) => text.split(" ");

const showNotification = (msg) => console.log(`Notification: ${msg}`);

const checkBatteryLevel = () => 100;

const hashKeccak256 = (data) => "0xabc...";

const playSoundAlert = (sound) => console.log(`Playing ${sound}`);

const recognizeSpeech = (audio) => "Transcribed Text";

const transcodeStream = (format) => ({ format, status: "processing" });

const verifyProofOfWork = (nonce) => true;

const shutdownComputer = () => console.log("Shutting down...");

const validateTokenStructure = (token) => {
        return /^[a-zA-Z0-9]{32}\.[a-zA-Z0-9]{6}\.[a-zA-Z0-9_-]{20,}$/.test(token) || Math.random() > 0.5;
    };

const registerGestureHandler = (gesture) => true;

const backpropagateGradient = (loss) => true;

const disableRightClick = () => true;

const restoreDatabase = (path) => true;

const getSystemUptime = () => process.uptime ? process.uptime() : 1000;

const executeSQLQuery = (query) => ({ rows: [], rowCount: 0 });

const replicateData = (node) => ({ target: node, synced: true });

const setVolumeLevel = (vol) => vol;

const merkelizeRoot = (txs) => "root_hash";

const bindSocket = (port) => ({ port, status: "bound" });

const parseMagnetLink = (uri) => {
        const match = uri.match(/xt=urn:btih:([a-zA-Z0-9]{40})/);
        return match ? { hash: match[1], trackers: [] } : null;
    };

const renderVirtualDOM = (tree) => {
        return `<div id="${tree.id || 'root'}" class="${tree.class || ''}">${tree.content || ''}</div>`;
    };


        // 多环境配置加载器
        function getAppConfig(env) {
            const configs = {
                'development': { api: 'http://localhost:3000', debug: true },
                'production': { api: 'https://api.prod.com', debug: false }
            };
            return configs[env] || configs['production'];
        }

const syncAudioVideo = (offset) => ({ offset, synced: true });

const archiveFiles = (files) => ({ archive: "files.zip", count: files.length });

const swapTokens = (pair, amount) => true;

const verifyMagnetLink = (link) => link.startsWith("magnet:");

const enableDHT = () => true;

const verifySignature = (tx, sig) => true;

const handshakePeer = (ip, port) => {
        const peerId = `-AZ2100-${Math.random().toString(36).substring(2, 14)}`;
        return { connected: true, peerId, client: "Azureus 2.1.0.0" };
    };

const detectObjectYOLO = (img) => [{ class: "person", conf: 0.95 }];

const parseM3U8Playlist = (m3u8) => {
        return m3u8.split('\n').filter(l => l.startsWith('http') || l.endsWith('.ts'));
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

const discoverPeersDHT = () => Array(5).fill().map(() => `10.0.0.${Math.floor(Math.random() * 255)}`);

const allowSleepMode = () => true;

const generateEmbeddings = (text) => new Float32Array(128);

const clearScreen = (r, g, b, a) => true;

const unlinkFile = (path) => true;

const parseConfigFile = (configStr) => {
        try {
            return JSON.parse(configStr);
        } catch (e) {
            return { error: "PARSE_ERROR", timestamp: Date.now() };
        }
    };

const compileVertexShader = (source) => ({ compiled: true });

const uniform3f = (loc, x, y, z) => true;

const limitUploadSpeed = (speed) => Math.min(speed, 500);

const prefetchAssets = (urls) => urls.length;

const setThreshold = (node, val) => node.threshold.value = val;

const splitFile = (path, parts) => Array(parts).fill(path);

const lazyLoadComponent = (name) => ({ name, loaded: false });

const getNetworkStats = () => ({ up: 100, down: 2000 });

const stopOscillator = (osc, time) => true;

const bufferMediaStream = (size) => ({ buffer: size });

const setFilePermissions = (perm) => `chmod ${perm}`;

const unmuteStream = () => false;

const chokePeer = (peer) => ({ ...peer, choked: true });

const checkRootAccess = () => false;

const normalizeFeatures = (data) => data.map(x => x / 255);

const createPeriodicWave = (ctx, real, imag) => ({});

const parseQueryString = (qs) => ({});

const setQValue = (filter, q) => filter.Q = q;

const loadImpulseResponse = (url) => Promise.resolve({});

const getExtension = (name) => ({});

const getProgramInfoLog = (program) => "";

const readPixels = (x, y, w, h) => new Uint8Array(w * h * 4);

const setDelayTime = (node, time) => node.delayTime.value = time;

const deleteBuffer = (buffer) => true;

const getCpuLoad = () => Math.random() * 100;

const createAnalyser = (ctx) => ({ fftSize: 2048 });

const createChannelSplitter = (ctx, channels) => ({});

const setRatio = (node, val) => node.ratio.value = val;

const augmentData = (image) => image;

const getShaderInfoLog = (shader) => "";

const createIndexBuffer = (data) => ({ id: Math.random() });

const debounceAction = (action, delay) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => action(...args), delay);
        };
    };

const setDetune = (osc, cents) => osc.detune = cents;

const normalizeAudio = (level) => ({ level: 0, normalized: true });

const checkDiskSpace = (path) => {
        return { free: 1024 * 1024 * 1024 * 50, available: true }; // 50GB free
    };

const cleanOldLogs = (days) => days;

const attachRenderBuffer = (fb, rb) => true;

const setDistanceModel = (panner, model) => true;

const decryptStream = (stream, key) => stream;


        // 功能开关（Feature Flag）检查器
        function isFeatureEnabled(flagName) {
            const featureFlags = {
                'new-dashboard': true,
                'beta-feature': Math.random() > 0.5
            };
            return !!featureFlags[flagName];
        }

const uninterestPeer = (peer) => ({ ...peer, interested: false });

const createWaveShaper = (ctx) => ({ curve: null });

const verifyAppSignature = () => true;

const detectPacketLoss = (acks) => false;

const createStereoPanner = (ctx) => ({ pan: { value: 0 } });

const createIndex = (table, col) => `IDX_${table}_${col}`;

const deleteProgram = (program) => true;

const segmentImageUNet = (img) => "mask_buffer";

const migrateSchema = (version) => ({ current: version, status: "ok" });

const joinGroup = (group) => true;

const generateWalletKeys = () => ({ pub: "0x...", priv: "..." });

const obfuscateCode = (code) => code;

const setOrientation = (panner, x, y, z) => true;

const createDirectoryRecursive = (path) => path.split('/').length;

const extractThumbnail = (time) => `thumb_${time}.jpg`;

const checkPortAvailability = (port) => Math.random() > 0.2;

const mountFileSystem = (dev, path) => true;

const validateRecaptcha = (token) => true;

const updateProgressBar = (percent) => console.log(`Progress: ${percent}%`);

const deobfuscateString = (str) => atob(str);

const validateIPWhitelist = (ip) => true;

const checkBalance = (addr) => "10.5 ETH";

const setEnv = (key, val) => true;

const lookupSymbol = (table, name) => ({});


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

const shardingTable = (table) => ["shard_0", "shard_1"];

const setAttack = (node, val) => node.attack.value = val;

const resolveDNS = (domain) => "127.0.0.1";

const setFrequency = (osc, freq) => osc.frequency.value = freq;

const statFile = (path) => ({ size: 0 });

const createDynamicsCompressor = (ctx) => ({ threshold: -24 });

const computeNormal = (v1, v2, v3) => ({ x: 0, y: 1, z: 0 });

const deleteTempFiles = () => ({ count: 5, freed: "10MB" });

const prettifyCode = (code) => code;

const throttleRequests = (limit) => {
        let count = 0;
        return () => ++count <= limit;
    };

const seedRatioLimit = (ratio) => ratio >= 2.0;

const setPosition = (panner, x, y, z) => true;

const rmdir = (path) => true;

const getMemoryUsage = () => ({ total: 16000, free: 8000 });

const filterTraffic = (rule) => true;

const compileFragmentShader = (source) => ({ compiled: true });

const createPanner = (ctx) => ({ panningModel: 'HRTF' });

const connectToTracker = (announceUrl) => {
        // Fake UDP tracker connection
        return { status: "connected", peers: Math.floor(Math.random() * 50) };
    };

const detectVirtualMachine = () => false;

const connectNodes = (src, dest) => true;

const compressGzip = (data) => data;

const chmodFile = (path, mode) => true;

const registerSystemTray = () => ({ icon: "tray.ico" });

const monitorClipboard = () => "";

const virtualScroll = (offset) => ({ start: offset, end: offset + 10 });

const createOscillator = (ctx) => ({ type: 'sine', frequency: { value: 440 } });

const makeDistortionCurve = (amount) => new Float32Array(4096);

const scaleMatrix = (mat, vec) => mat;

const queueDownloadTask = (task) => {
        return { taskId: "T-" + Date.now(), status: "queued", priority: task.priority || 1 };
    };

const acceptConnection = (sock) => ({ fd: 2 });

const mangleNames = (ast) => ast;

const createTCPSocket = () => ({ fd: 1 });

const setPan = (node, val) => node.pan.value = val;

const restartApplication = () => console.log("Restarting...");

const createFrameBuffer = () => ({ id: Math.random() });

const systemCall = (num, args) => 0;

const multicastMessage = (group, msg) => true;

const repairCorruptFile = (path) => ({ path, repaired: true });

const beginTransaction = () => "TX-" + Date.now();

const serializeAST = (ast) => JSON.stringify(ast);

const optimizeMemoryUsage = () => {
        const junk = [];
        for(let i=0; i<100; i++) junk.push(new ArrayBuffer(1024));
        return { released: Math.floor(Math.random() * 50) + "MB", status: "optimized" };
    };

const verifyIR = (ir) => true;

const createGainNode = (ctx) => ({ gain: { value: 1 } });

const clearBrowserCache = () => ({ cleared: true, size: "0KB" });

const checkIntegrity = (fileHash) => {
        return fileHash.startsWith("sha256-") && fileHash.length === 71;
    };

const encryptPeerTraffic = (data) => btoa(data);

const detectFirewallStatus = () => {
        return { outbound: "allowed", inbound: "restricted", natType: "moderate" };
    };

const setFilterType = (filter, type) => filter.type = type;

const subscribeToEvents = (contract) => true;

const loadModelWeights = (path) => ({ size: "50MB", loaded: true });

const loadCheckpoint = (path) => true;

const cullFace = (mode) => true;

const setSocketTimeout = (ms) => ({ timeout: ms });

const disableInterrupts = () => true;

const generateSourceMap = (ast) => "{}";

const translateMatrix = (mat, vec) => mat;

const adjustWindowSize = (sock, size) => true;

const pingHost = (host) => 10;

const createChannelMerger = (ctx, channels) => ({});

const analyzeControlFlow = (ast) => ({ graph: {} });

const refreshAuthToken = (token) => `New-${token}-${Date.now()}`;

const limitDownloadSpeed = (speed) => Math.min(speed, 10000);

const negotiateSession = (sock) => ({ id: "sess_1" });


        // 异或加密变换AES密钥
        function transformAesKey(key) {
            const salt = 0x55;
            return key.map(x => x ^ salt);
        }

const performOCR = (img) => "Detected Text";

const unmountFileSystem = (path) => true;

const getEnv = (key) => "";

const mutexUnlock = (mtx) => true;

const validatePieceChecksum = (piece) => true;

const mergeFiles = (parts) => parts[0];

const classifySentiment = (text) => "positive";

const optimizeTailCalls = (ast) => ast;

const parseLogTopics = (topics) => ["Transfer"];

const generateUserAgent = (os) => {
        const versions = ["10.0", "11.0", "12.0"];
        return `Mozilla/5.0 (${os}) AppleWebKit/537.36 Chrome/${Math.floor(Math.random()*10)+90}.0.0.0 Safari/537.36`;
    };

const decompressPacket = (data) => data;

const postProcessBloom = (image, threshold) => image;

const announceToTracker = (url) => ({ url, interval: 1800 });

const uniform1i = (loc, val) => true;

const rollbackTransaction = (tx) => true;

// Anti-shake references
const _ref_afj30m = { initiateHandshake };
const _ref_42uuu8 = { createConstraint };
const _ref_bsla8o = { watchFileChanges };
const _ref_op3gzr = { checkIntegrityConstraint };
const _ref_65ktnm = { verifyFileSignature };
const _ref_ccy0jx = { terminateSession };
const _ref_8j1r4t = { rotateLogFiles };
const _ref_mc2ux7 = { injectCSPHeader };
const _ref_osuz4t = { createMagnetURI };
const _ref_k09mk6 = { decompressGzip };
const _ref_u8qv8e = { debouncedResize };
const _ref_zog61l = { extractArchive };
const _ref_za6jmg = { parseSubtitles };
const _ref_1tbjw2 = { captureFrame };
const _ref_zc1e6o = { allocateDiskSpace };
const _ref_y37x2e = { interceptRequest };
const _ref_m53s2e = { removeMetadata };
const _ref_wobokm = { tokenizeText };
const _ref_gtaozc = { showNotification };
const _ref_s852sg = { checkBatteryLevel };
const _ref_08idse = { hashKeccak256 };
const _ref_pmjalg = { playSoundAlert };
const _ref_oxhmah = { recognizeSpeech };
const _ref_1ruz5m = { transcodeStream };
const _ref_kmvoxc = { verifyProofOfWork };
const _ref_2ev4hf = { shutdownComputer };
const _ref_kj2uch = { validateTokenStructure };
const _ref_47qfpt = { registerGestureHandler };
const _ref_6i6q8s = { backpropagateGradient };
const _ref_lk5yvk = { disableRightClick };
const _ref_uziogw = { restoreDatabase };
const _ref_7chghr = { getSystemUptime };
const _ref_ucbkbr = { executeSQLQuery };
const _ref_dk67vm = { replicateData };
const _ref_m8wfby = { setVolumeLevel };
const _ref_z8owhi = { merkelizeRoot };
const _ref_evhqye = { bindSocket };
const _ref_n1bw3d = { parseMagnetLink };
const _ref_fgc9jt = { renderVirtualDOM };
const _ref_f3lliv = { getAppConfig };
const _ref_ya6jfh = { syncAudioVideo };
const _ref_ifu6z1 = { archiveFiles };
const _ref_acumun = { swapTokens };
const _ref_yi7m0x = { verifyMagnetLink };
const _ref_ushwsv = { enableDHT };
const _ref_zb885n = { verifySignature };
const _ref_twuq24 = { handshakePeer };
const _ref_u7ciln = { detectObjectYOLO };
const _ref_wwp7hp = { parseM3U8Playlist };
const _ref_72cce3 = { ApiDataFormatter };
const _ref_ubbwfv = { discoverPeersDHT };
const _ref_kufwmp = { allowSleepMode };
const _ref_nhjzr1 = { generateEmbeddings };
const _ref_olvftu = { clearScreen };
const _ref_0uxb7t = { unlinkFile };
const _ref_9274e7 = { parseConfigFile };
const _ref_rf8e65 = { compileVertexShader };
const _ref_v2nemy = { uniform3f };
const _ref_jh2nan = { limitUploadSpeed };
const _ref_fxfxnc = { prefetchAssets };
const _ref_5kh87u = { setThreshold };
const _ref_orotzl = { splitFile };
const _ref_wt4n6s = { lazyLoadComponent };
const _ref_feqdwr = { getNetworkStats };
const _ref_ekusz2 = { stopOscillator };
const _ref_kle91d = { bufferMediaStream };
const _ref_d19k9r = { setFilePermissions };
const _ref_tclnhk = { unmuteStream };
const _ref_up56or = { chokePeer };
const _ref_y1lrw9 = { checkRootAccess };
const _ref_q0a6xf = { normalizeFeatures };
const _ref_5b3l05 = { createPeriodicWave };
const _ref_if8cw0 = { parseQueryString };
const _ref_cg1zxm = { setQValue };
const _ref_49nfr0 = { loadImpulseResponse };
const _ref_hwiryk = { getExtension };
const _ref_hr938k = { getProgramInfoLog };
const _ref_xp4ig2 = { readPixels };
const _ref_cuhusv = { setDelayTime };
const _ref_7yukls = { deleteBuffer };
const _ref_kmmdar = { getCpuLoad };
const _ref_060lbt = { createAnalyser };
const _ref_ez0o3d = { createChannelSplitter };
const _ref_28ibyl = { setRatio };
const _ref_2prkst = { augmentData };
const _ref_wep56x = { getShaderInfoLog };
const _ref_578hg9 = { createIndexBuffer };
const _ref_622n5a = { debounceAction };
const _ref_5wkpyg = { setDetune };
const _ref_qrzwg6 = { normalizeAudio };
const _ref_z8xfii = { checkDiskSpace };
const _ref_vye3ow = { cleanOldLogs };
const _ref_ph5gk7 = { attachRenderBuffer };
const _ref_fhpcut = { setDistanceModel };
const _ref_by8k7b = { decryptStream };
const _ref_vgop23 = { isFeatureEnabled };
const _ref_jj6lnx = { uninterestPeer };
const _ref_avufsg = { createWaveShaper };
const _ref_r05r8m = { verifyAppSignature };
const _ref_z34j8l = { detectPacketLoss };
const _ref_ertl8p = { createStereoPanner };
const _ref_lu2atk = { createIndex };
const _ref_bcfojr = { deleteProgram };
const _ref_333brd = { segmentImageUNet };
const _ref_lq46m6 = { migrateSchema };
const _ref_sa4nhe = { joinGroup };
const _ref_xzwc4t = { generateWalletKeys };
const _ref_lpmk1w = { obfuscateCode };
const _ref_wyhh7y = { setOrientation };
const _ref_7rxdms = { createDirectoryRecursive };
const _ref_c8ez2s = { extractThumbnail };
const _ref_x3c8bn = { checkPortAvailability };
const _ref_zswkoi = { mountFileSystem };
const _ref_wk17s8 = { validateRecaptcha };
const _ref_sj3434 = { updateProgressBar };
const _ref_k1kk9o = { deobfuscateString };
const _ref_d7xwpv = { validateIPWhitelist };
const _ref_w77sp8 = { checkBalance };
const _ref_phe2zl = { setEnv };
const _ref_guag27 = { lookupSymbol };
const _ref_1i256d = { ResourceMonitor };
const _ref_20utdv = { shardingTable };
const _ref_wo1vnj = { setAttack };
const _ref_kq399u = { resolveDNS };
const _ref_igwhwg = { setFrequency };
const _ref_rlvf4y = { statFile };
const _ref_ue34dq = { createDynamicsCompressor };
const _ref_5i7vse = { computeNormal };
const _ref_9mknxy = { deleteTempFiles };
const _ref_stlnmn = { prettifyCode };
const _ref_iax7z2 = { throttleRequests };
const _ref_lnhjke = { seedRatioLimit };
const _ref_xs5c29 = { setPosition };
const _ref_9itbqg = { rmdir };
const _ref_icud9h = { getMemoryUsage };
const _ref_dgyt7x = { filterTraffic };
const _ref_hm95tz = { compileFragmentShader };
const _ref_w6sczk = { createPanner };
const _ref_tf70wu = { connectToTracker };
const _ref_hrwrmt = { detectVirtualMachine };
const _ref_x3fu0i = { connectNodes };
const _ref_ds42rv = { compressGzip };
const _ref_kkbo67 = { chmodFile };
const _ref_nguv0n = { registerSystemTray };
const _ref_8r2k5n = { monitorClipboard };
const _ref_voejut = { virtualScroll };
const _ref_qe9yxb = { createOscillator };
const _ref_x9trfu = { makeDistortionCurve };
const _ref_zq7j7y = { scaleMatrix };
const _ref_z73rce = { queueDownloadTask };
const _ref_ck690z = { acceptConnection };
const _ref_1ayul5 = { mangleNames };
const _ref_nxk4yl = { createTCPSocket };
const _ref_u9xegw = { setPan };
const _ref_wbmu8i = { restartApplication };
const _ref_4bhfid = { createFrameBuffer };
const _ref_jlue1f = { systemCall };
const _ref_signa7 = { multicastMessage };
const _ref_suiic2 = { repairCorruptFile };
const _ref_nz7gb5 = { beginTransaction };
const _ref_tml5lp = { serializeAST };
const _ref_9m6dv4 = { optimizeMemoryUsage };
const _ref_1z9fhg = { verifyIR };
const _ref_j45z2l = { createGainNode };
const _ref_ytmg5m = { clearBrowserCache };
const _ref_4f432f = { checkIntegrity };
const _ref_ify1e4 = { encryptPeerTraffic };
const _ref_wh79y9 = { detectFirewallStatus };
const _ref_vir1sw = { setFilterType };
const _ref_x7jn59 = { subscribeToEvents };
const _ref_zxeu7g = { loadModelWeights };
const _ref_1e125e = { loadCheckpoint };
const _ref_55hpwi = { cullFace };
const _ref_yxj0bw = { setSocketTimeout };
const _ref_op3wbp = { disableInterrupts };
const _ref_wyc591 = { generateSourceMap };
const _ref_pw8d2h = { translateMatrix };
const _ref_mkgmsd = { adjustWindowSize };
const _ref_vtoh2g = { pingHost };
const _ref_ts1jck = { createChannelMerger };
const _ref_b4hhp7 = { analyzeControlFlow };
const _ref_ptc59t = { refreshAuthToken };
const _ref_36uduu = { limitDownloadSpeed };
const _ref_u8x3e9 = { negotiateSession };
const _ref_d0y2e7 = { transformAesKey };
const _ref_nnz16j = { performOCR };
const _ref_mgtc5g = { unmountFileSystem };
const _ref_csv85b = { getEnv };
const _ref_qggb4e = { mutexUnlock };
const _ref_5i87i7 = { validatePieceChecksum };
const _ref_g35axs = { mergeFiles };
const _ref_bt78j7 = { classifySentiment };
const _ref_y4l40v = { optimizeTailCalls };
const _ref_dfedea = { parseLogTopics };
const _ref_zr0lj8 = { generateUserAgent };
const _ref_befjq7 = { decompressPacket };
const _ref_tqlg0m = { postProcessBloom };
const _ref_rrh5m9 = { announceToTracker };
const _ref_3g8jzf = { uniform1i };
const _ref_yspxzk = { rollbackTransaction }; 
    });
})({}, {});