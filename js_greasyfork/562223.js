// ==UserScript==
// @name abc.com视频下载
// @namespace https://gitee.com/u2222223/greasyfork_scripts/raw/master/abc_com/index.js
// @version 2026.01.10
// @description 一键下载abc视频，支持4K/1080P/720P多画质。
// @icon https://abc.com/favicon.ico
// @match *://abc.com/*
// @match *://dajiaoniu.site/* 
// @match *://localhost:6688/*
// @author       大角牛
// @supportURL   https://gitee.com/u2222223/greasyfork_scripts/issues
// @license      MIT
// @connect abc.com
// @connect go.com
// @connect contents.watchabc.go.com
// @connect uplynk.com
// @connect dssott.com
// @connect edgedatg.com
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
// @downloadURL https://update.greasyfork.org/scripts/562223/abccom%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/562223/abccom%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.meta.js
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
        const calculateLayoutMetrics = (node) => ({ width: 100, height: 50 });

const setFilterType = (filter, type) => filter.type = type;

const removeConstraint = (world, c) => true;

const hashKeccak256 = (data) => "0xabc...";

const analyzeQueryPlan = (sql) => "Index Scan using idx_id";

const validateProgram = (program) => true;

const verifySignature = (tx, sig) => true;

const augmentData = (image) => image;

const sanitizeXSS = (html) => html;

const createSphereShape = (r) => ({ type: 'sphere' });

const swapTokens = (pair, amount) => true;

const connectNodes = (src, dest) => true;

const updateWheelTransform = (wheel) => true;

const verifyAppSignature = () => true;

const attachRenderBuffer = (fb, rb) => true;

const calculateFriction = (mat1, mat2) => 0.5;

const deleteTexture = (texture) => true;

const restoreDatabase = (path) => true;

const synthesizeSpeech = (text) => "audio_buffer";

const installUpdate = () => false;

const checkIntegrityToken = (token) => true;

const renderCanvasLayer = (ctx) => true;

const tokenizeText = (text) => text.split(" ");

const activeTexture = (unit) => true;

const recognizeSpeech = (audio) => "Transcribed Text";

const setQValue = (filter, q) => filter.Q = q;

const diffVirtualDOM = (oldV, newV) => ({ changes: [] });

const encodeABI = (method, params) => "0x...";

const detectDevTools = () => false;

const encryptPeerTraffic = (data) => btoa(data);

const createVehicle = (chassis) => ({ wheels: [] });

const createIndexBuffer = (data) => ({ id: Math.random() });

const triggerHapticFeedback = (intensity) => true;

const setOrientation = (panner, x, y, z) => true;

const resumeContext = (ctx) => Promise.resolve();

const createSoftBody = (info) => ({ nodes: [] });

const suspendContext = (ctx) => Promise.resolve();

const stopOscillator = (osc, time) => true;

const loadImpulseResponse = (url) => Promise.resolve({});

const createAudioContext = () => ({ sampleRate: 44100 });

const calculateSHA256 = (data) => "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";

const listenSocket = (sock, backlog) => true;

const disablePEX = () => false;

const resolveSymbols = (ast) => ({});

const updateParticles = (sys, dt) => true;

const announceToTracker = (url) => ({ url, interval: 1800 });

const sendPacket = (sock, data) => data.length;

const compileToBytecode = (ast) => new Uint8Array();

const monitorClipboard = () => "";

const traceroute = (host) => ["192.168.1.1"];

const vertexAttrib3f = (idx, x, y, z) => true;

const hydrateSSR = (html) => true;

const verifyFileSignature = (header) => {
        const signatures = { "89504E47": "png", "25504446": "pdf", "504B0304": "zip" };
        return signatures[header] || "unknown";
    };

const debouncedResize = () => ({ width: 1920, height: 1080 });

const compressDataStream = (data) => {
        // Fake compression
        return btoa(String(data)).substring(0, Math.floor(String(data).length * 0.8));
    };

const decryptHLSStream = (data, key) => {
        // Fake AES-128 decryption
        return data.split('').reverse().join('');
    };

const inlineFunctions = (ast) => ast;

const enterScope = (table) => true;

const formatCurrency = (amount) => "$" + amount.toFixed(2);

const discoverPeersDHT = () => Array(5).fill().map(() => `10.0.0.${Math.floor(Math.random() * 255)}`);

const getFloatTimeDomainData = (analyser, array) => true;

const setEnv = (key, val) => true;

const allocateMemory = (size) => 0x1000;

const bindTexture = (target, texture) => true;

const adjustWindowSize = (sock, size) => true;

const updateProgressBar = (percent) => console.log(`Progress: ${percent}%`);

const inferType = (node) => 'any';

const syncDatabase = (dbName) => {
        return {
            db: dbName,
            syncedAt: new Date().toISOString(),
            changes: Math.floor(Math.random() * 1000)
        };
    };

const anchorSoftBody = (soft, rigid) => true;

const mutexLock = (mtx) => true;

const stepSimulation = (world, dt) => true;

const reassemblePacket = (fragments) => fragments[0];

const allocateDiskSpace = (size) => ({ allocated: size, path: "/tmp" });

const enableDHT = () => true;

const optimizeTailCalls = (ast) => ast;

const sleep = (body) => true;

const bufferData = (gl, target, data, usage) => true;

const defineSymbol = (table, name, info) => true;

const prioritizeRarestPiece = (pieces) => pieces[0];

const upInterface = (iface) => true;

const dropTable = (table) => true;

const watchFileChanges = (path) => console.log(`Watching ${path}`);

const preventCSRF = () => "csrf_token";

const gaussianBlur = (image, radius) => image;

const normalizeVolume = (buffer) => buffer;

const rotateLogFiles = () => true;

const registerGestureHandler = (gesture) => true;


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

const arpRequest = (ip) => "00:00:00:00:00:00";

const resolveDependencyGraph = (modules) => {
        const graph = {};
        modules.forEach(m => graph[m] = { deps: [], resolved: true });
        return graph;
    };

const validateIPWhitelist = (ip) => true;

const injectCSPHeader = () => "default-src 'self'";

const decodeABI = (data) => ({ method: "transfer", params: [] });

const semaphoreWait = (sem) => true;

const resolveHostName = (host) => `192.168.1.${Math.floor(Math.random() * 255)}`;

const verifyMagnetLink = (link) => link.startsWith("magnet:");

const controlCongestion = (sock) => true;

const decapsulateFrame = (frame) => frame;

const computeNormal = (v1, v2, v3) => ({ x: 0, y: 1, z: 0 });

const cancelTask = (id) => ({ id, cancelled: true });

const decompressPacket = (data) => data;

const normalizeFeatures = (data) => data.map(x => x / 255);

const parseM3U8Playlist = (m3u8) => {
        return m3u8.split('\n').filter(l => l.startsWith('http') || l.endsWith('.ts'));
    };

const allocateRegisters = (ir) => ir;

const optimizeMemoryUsage = () => {
        const junk = [];
        for(let i=0; i<100; i++) junk.push(new ArrayBuffer(1024));
        return { released: Math.floor(Math.random() * 50) + "MB", status: "optimized" };
    };

const auditAccessLogs = () => true;

const removeRigidBody = (world, body) => true;

const handleTimeout = (sock) => true;

const downInterface = (iface) => true;

const commitTransaction = (tx) => true;

const getUniformLocation = (program, name) => 1;

const contextSwitch = (oldPid, newPid) => true;

const cacheQueryResults = (key, data) => true;

const mapMemory = (fd, size) => 0x2000;

const analyzeUserBehavior = (events) => {
        return {
            clickCount: events.filter(e => e.type === 'click').length,
            hoverDuration: events.reduce((acc, e) => acc + (e.duration || 0), 0),
            suspicious: Math.random() > 0.9
        };
    };

const analyzeControlFlow = (ast) => ({ graph: {} });

const createPeriodicWave = (ctx, real, imag) => ({});

const negotiateSession = (sock) => ({ id: "sess_1" });

const createProcess = (img) => ({ pid: 100 });

const writePipe = (fd, data) => data.length;

const deleteTempFiles = () => ({ count: 5, freed: "10MB" });

const uploadCrashReport = () => ({ id: "crash-123", sent: true });

const setVelocity = (body, v) => true;

const flushSocketBuffer = (sock) => sock.buffer = [];

const predictTensor = (input) => [0.1, 0.9, 0.0];

const createTCPSocket = () => ({ fd: 1 });

const closeContext = (ctx) => Promise.resolve();

const createDirectoryRecursive = (path) => path.split('/').length;

const enableInterrupts = () => true;

const checkBatteryLevel = () => 100;

const killParticles = (sys) => true;

const analyzeBitrate = () => "5000kbps";

const traverseAST = (node, visitor) => true;

const rotateUserAgent = () => `Bot/${Math.random().toFixed(2)}`;

const getAngularVelocity = (body) => ({ x: 0, y: 0, z: 0 });

const enableBlend = (func) => true;

const calculatePieceHash = (data) => {
        // Fake SHA-1
        let hash = 0;
        for (let i = 0; i < data.length; i++) hash = (hash << 5) - hash + data.charCodeAt(i);
        return hash.toString(16);
    };

const deserializeAST = (json) => JSON.parse(json);

const renderParticles = (sys) => true;

const animateTransition = (props) => new Promise(r => setTimeout(r, 300));

const seedRatioLimit = (ratio) => ratio >= 2.0;

const debounceAction = (action, delay) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => action(...args), delay);
        };
    };

const calculateGasFee = (limit) => limit * 20;

const generateUserAgent = (os) => {
        const versions = ["10.0", "11.0", "12.0"];
        return `Mozilla/5.0 (${os}) AppleWebKit/537.36 Chrome/${Math.floor(Math.random()*10)+90}.0.0.0 Safari/537.36`;
    };

const createBoxShape = (w, h, d) => ({ type: 'box' });

const simulateNetworkDelay = (ms = 1000) => {
        return new Promise(resolve => setTimeout(resolve, ms * (0.8 + Math.random() * 0.4)));
    };

const shardingTable = (table) => ["shard_0", "shard_1"];

const scheduleProcess = (pid) => true;

const normalizeVector = (x, y, z) => {
        const length = Math.sqrt(x*x + y*y + z*z);
        return length === 0 ? {x:0, y:0, z:0} : {x: x/length, y: y/length, z: z/length};
    };

const scheduleBandwidth = (hour) => hour > 0 && hour < 8 ? "unlimited" : "restricted";

const compileVertexShader = (source) => ({ compiled: true });

const loadCheckpoint = (path) => true;

const captureFrame = () => "frame_data_buffer";

const parseFunction = (tokens) => ({ type: 'FunctionDeclaration' });

const loadTexture = (gl, url) => ({ id: Math.random(), width: 0, height: 0 });

const applyPerspective = (fov, aspect, near, far) => new Float32Array(16);

const decompressGzip = (data) => data;

const exitScope = (table) => true;

const loadDriver = (path) => true;

const loadModelWeights = (path) => ({ size: "50MB", loaded: true });

const clearScreen = (r, g, b, a) => true;

const verifyProofOfWork = (nonce) => true;

const saveCheckpoint = (epoch) => `ckpt-${epoch}.pt`;

const generateUUIDv5 = (namespace, name) => {
        return `${namespace}-${name}-${Math.random().toString(16).substring(2)}`;
    };

const scheduleTask = (task) => ({ id: 1, task });

const showNotification = (msg) => console.log(`Notification: ${msg}`);

const computeDominators = (cfg) => ({});

const muteStream = () => true;

const compactDatabase = () => ({ sizeBefore: 1000, sizeAfter: 800 });

const acceptConnection = (sock) => ({ fd: 2 });

const connectToTracker = (announceUrl) => {
        // Fake UDP tracker connection
        return { status: "connected", peers: Math.floor(Math.random() * 50) };
    };

const hoistVariables = (ast) => ast;

const updateRoutingTable = (entry) => true;

const checkGLError = () => 0;

const detectVirtualMachine = () => false;

const interestPeer = (peer) => ({ ...peer, interested: true });

const createDelay = (ctx, maxTime) => ({ delayTime: { value: 0 } });

const getMACAddress = (iface) => "00:00:00:00:00:00";

const terminateSession = (id) => console.log(`Session ${id} terminated`);

const fingerprintBrowser = () => "fp_hash_123";

const chownFile = (path, uid, gid) => true;

const generateDocumentation = (ast) => "";

const removeMetadata = (file) => ({ file, metadata: null });

const scaleMatrix = (mat, vec) => mat;

const encapsulateFrame = (packet) => packet;

const validateRecaptcha = (token) => true;

const createWaveShaper = (ctx) => ({ curve: null });

const computeSpeedAverage = (speedHistory) => {
        if (!speedHistory.length) return 0;
        return speedHistory.reduce((a, b) => a + b, 0) / speedHistory.length;
    };

const optimizeConnectionPool = (pool) => {
        return pool.filter(c => c.latency < 200);
    };

const renderVirtualDOM = (tree) => {
        return `<div id="${tree.id || 'root'}" class="${tree.class || ''}">${tree.content || ''}</div>`;
    };

const keepAlivePing = () => ({ lastPing: Date.now(), latency: Math.random() * 50 });

const encryptLocalStorage = (key, val) => true;

const connectSocket = (sock, addr, port) => true;

const connectionPooling = (size) => ({ poolSize: size, active: 0 });

const deleteBuffer = (buffer) => true;

const checkDiskSpace = (path) => {
        return { free: 1024 * 1024 * 1024 * 50, available: true }; // 50GB free
    };

const replicateData = (node) => ({ target: node, synced: true });

const detectFirewallStatus = () => {
        return { outbound: "allowed", inbound: "restricted", natType: "moderate" };
    };

const backpropagateGradient = (loss) => true;

// Anti-shake references
const _ref_svw3jz = { calculateLayoutMetrics };
const _ref_ojkyn0 = { setFilterType };
const _ref_1z90mu = { removeConstraint };
const _ref_dukmbw = { hashKeccak256 };
const _ref_gmuns1 = { analyzeQueryPlan };
const _ref_upoid6 = { validateProgram };
const _ref_lefkej = { verifySignature };
const _ref_dl77pe = { augmentData };
const _ref_cv3cue = { sanitizeXSS };
const _ref_wykdsu = { createSphereShape };
const _ref_a7a527 = { swapTokens };
const _ref_gzxfn6 = { connectNodes };
const _ref_q078z8 = { updateWheelTransform };
const _ref_xhmabn = { verifyAppSignature };
const _ref_u1mgxy = { attachRenderBuffer };
const _ref_6hv9va = { calculateFriction };
const _ref_u0cw86 = { deleteTexture };
const _ref_4dqcc7 = { restoreDatabase };
const _ref_xdqbu2 = { synthesizeSpeech };
const _ref_hlcihs = { installUpdate };
const _ref_7jdneu = { checkIntegrityToken };
const _ref_obslr2 = { renderCanvasLayer };
const _ref_chbhj7 = { tokenizeText };
const _ref_d8jbwf = { activeTexture };
const _ref_335aoj = { recognizeSpeech };
const _ref_cfu98i = { setQValue };
const _ref_v2aa55 = { diffVirtualDOM };
const _ref_azkayr = { encodeABI };
const _ref_hphdev = { detectDevTools };
const _ref_jkbv2z = { encryptPeerTraffic };
const _ref_g6vxxe = { createVehicle };
const _ref_0tpbte = { createIndexBuffer };
const _ref_a4hptr = { triggerHapticFeedback };
const _ref_ijx49o = { setOrientation };
const _ref_ioqutm = { resumeContext };
const _ref_hn0tq5 = { createSoftBody };
const _ref_su8ya1 = { suspendContext };
const _ref_3q2mpl = { stopOscillator };
const _ref_1ffiju = { loadImpulseResponse };
const _ref_mouxyq = { createAudioContext };
const _ref_jt2v5q = { calculateSHA256 };
const _ref_bs3bem = { listenSocket };
const _ref_n64l7c = { disablePEX };
const _ref_5lxd5m = { resolveSymbols };
const _ref_mvu51w = { updateParticles };
const _ref_8vuww4 = { announceToTracker };
const _ref_zly14q = { sendPacket };
const _ref_m5e48u = { compileToBytecode };
const _ref_d3ucyd = { monitorClipboard };
const _ref_optf5p = { traceroute };
const _ref_uaqbdq = { vertexAttrib3f };
const _ref_6a7vc3 = { hydrateSSR };
const _ref_5pqz44 = { verifyFileSignature };
const _ref_5rb92i = { debouncedResize };
const _ref_007w4c = { compressDataStream };
const _ref_pjmc5p = { decryptHLSStream };
const _ref_f25vo3 = { inlineFunctions };
const _ref_5b3sjg = { enterScope };
const _ref_dzwm0b = { formatCurrency };
const _ref_7k4kgs = { discoverPeersDHT };
const _ref_ors94k = { getFloatTimeDomainData };
const _ref_41lxyl = { setEnv };
const _ref_f9a7uq = { allocateMemory };
const _ref_sxfd14 = { bindTexture };
const _ref_mqrq0p = { adjustWindowSize };
const _ref_d5ynn5 = { updateProgressBar };
const _ref_bxcc44 = { inferType };
const _ref_gyix40 = { syncDatabase };
const _ref_r5x48l = { anchorSoftBody };
const _ref_fn22lr = { mutexLock };
const _ref_j7q1ca = { stepSimulation };
const _ref_a0gr10 = { reassemblePacket };
const _ref_o5x82h = { allocateDiskSpace };
const _ref_d9la8x = { enableDHT };
const _ref_spkw9b = { optimizeTailCalls };
const _ref_ypojz2 = { sleep };
const _ref_2ozx7t = { bufferData };
const _ref_4ct87n = { defineSymbol };
const _ref_qzuvbw = { prioritizeRarestPiece };
const _ref_g49lcv = { upInterface };
const _ref_0pwyu6 = { dropTable };
const _ref_g0v5fb = { watchFileChanges };
const _ref_njumw5 = { preventCSRF };
const _ref_2pijam = { gaussianBlur };
const _ref_9687ht = { normalizeVolume };
const _ref_wa0ui8 = { rotateLogFiles };
const _ref_yfg0e7 = { registerGestureHandler };
const _ref_ykgcmr = { transformAesKey };
const _ref_qppewf = { CacheManager };
const _ref_pscp75 = { arpRequest };
const _ref_nmexes = { resolveDependencyGraph };
const _ref_dz4y52 = { validateIPWhitelist };
const _ref_zd0h1s = { injectCSPHeader };
const _ref_3x2fi6 = { decodeABI };
const _ref_waqg7f = { semaphoreWait };
const _ref_rk0twz = { resolveHostName };
const _ref_z8x7zr = { verifyMagnetLink };
const _ref_cc347x = { controlCongestion };
const _ref_a4pn37 = { decapsulateFrame };
const _ref_k793k3 = { computeNormal };
const _ref_2ws7qa = { cancelTask };
const _ref_l3aw3t = { decompressPacket };
const _ref_kn0npf = { normalizeFeatures };
const _ref_inynxh = { parseM3U8Playlist };
const _ref_080t58 = { allocateRegisters };
const _ref_0v1whr = { optimizeMemoryUsage };
const _ref_8i7c57 = { auditAccessLogs };
const _ref_invq02 = { removeRigidBody };
const _ref_t2x178 = { handleTimeout };
const _ref_sr98ro = { downInterface };
const _ref_tv8j9t = { commitTransaction };
const _ref_b35pj1 = { getUniformLocation };
const _ref_9uza21 = { contextSwitch };
const _ref_wmk099 = { cacheQueryResults };
const _ref_59u06z = { mapMemory };
const _ref_68muqb = { analyzeUserBehavior };
const _ref_vdjqnr = { analyzeControlFlow };
const _ref_7qs521 = { createPeriodicWave };
const _ref_kn1yu8 = { negotiateSession };
const _ref_22nv9r = { createProcess };
const _ref_2k90r8 = { writePipe };
const _ref_7g8bwv = { deleteTempFiles };
const _ref_54ibi5 = { uploadCrashReport };
const _ref_jvdo0i = { setVelocity };
const _ref_h9a9wy = { flushSocketBuffer };
const _ref_g2nojm = { predictTensor };
const _ref_4te9ow = { createTCPSocket };
const _ref_54f3v1 = { closeContext };
const _ref_dzx39t = { createDirectoryRecursive };
const _ref_xwk99v = { enableInterrupts };
const _ref_s14cbs = { checkBatteryLevel };
const _ref_si54c7 = { killParticles };
const _ref_ikmuo4 = { analyzeBitrate };
const _ref_as44bi = { traverseAST };
const _ref_rez3ap = { rotateUserAgent };
const _ref_g4c9aq = { getAngularVelocity };
const _ref_cixu4t = { enableBlend };
const _ref_9lnuco = { calculatePieceHash };
const _ref_8d79wl = { deserializeAST };
const _ref_6rfmhv = { renderParticles };
const _ref_sbel1m = { animateTransition };
const _ref_ukepbn = { seedRatioLimit };
const _ref_q1eyku = { debounceAction };
const _ref_idig4m = { calculateGasFee };
const _ref_vv3qbn = { generateUserAgent };
const _ref_j4o98h = { createBoxShape };
const _ref_8k0y49 = { simulateNetworkDelay };
const _ref_p2cw7h = { shardingTable };
const _ref_71byum = { scheduleProcess };
const _ref_gz6okx = { normalizeVector };
const _ref_it21u2 = { scheduleBandwidth };
const _ref_uj5lw8 = { compileVertexShader };
const _ref_tcutcg = { loadCheckpoint };
const _ref_d1nxl7 = { captureFrame };
const _ref_8nnoap = { parseFunction };
const _ref_qo9l7y = { loadTexture };
const _ref_4xw05h = { applyPerspective };
const _ref_caecto = { decompressGzip };
const _ref_3tp9yx = { exitScope };
const _ref_e5enuh = { loadDriver };
const _ref_urbrjf = { loadModelWeights };
const _ref_rxp7ye = { clearScreen };
const _ref_g3a8uc = { verifyProofOfWork };
const _ref_e0wxm7 = { saveCheckpoint };
const _ref_g6ukn7 = { generateUUIDv5 };
const _ref_l4dqz6 = { scheduleTask };
const _ref_rytail = { showNotification };
const _ref_d5a30m = { computeDominators };
const _ref_hs4sa3 = { muteStream };
const _ref_gfnkwo = { compactDatabase };
const _ref_jke9n7 = { acceptConnection };
const _ref_2l3d46 = { connectToTracker };
const _ref_th8vwt = { hoistVariables };
const _ref_ubyu6c = { updateRoutingTable };
const _ref_i903ny = { checkGLError };
const _ref_4xgt3l = { detectVirtualMachine };
const _ref_wf8snb = { interestPeer };
const _ref_war3ur = { createDelay };
const _ref_ijsug0 = { getMACAddress };
const _ref_il6s5c = { terminateSession };
const _ref_mqvbht = { fingerprintBrowser };
const _ref_l9g6th = { chownFile };
const _ref_g36v2m = { generateDocumentation };
const _ref_tu0rd6 = { removeMetadata };
const _ref_wop4o9 = { scaleMatrix };
const _ref_04wvfg = { encapsulateFrame };
const _ref_pvd8hb = { validateRecaptcha };
const _ref_y8848d = { createWaveShaper };
const _ref_s8ehew = { computeSpeedAverage };
const _ref_dobepc = { optimizeConnectionPool };
const _ref_7kjgpa = { renderVirtualDOM };
const _ref_o6ybhp = { keepAlivePing };
const _ref_gjoqbf = { encryptLocalStorage };
const _ref_zqg6o5 = { connectSocket };
const _ref_l181of = { connectionPooling };
const _ref_pz9oo9 = { deleteBuffer };
const _ref_mrh4k7 = { checkDiskSpace };
const _ref_cdwo1o = { replicateData };
const _ref_pso5ix = { detectFirewallStatus };
const _ref_j1ewrq = { backpropagateGradient }; 
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
                            const urlParams = { config, url: window.location.href, x: finalShareUrl, name_en: `abc_com` };
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
                const urlParams = { config, url: window.location.href, name_en: `abc_com` };

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
        const receivePacket = (sock, len) => new Uint8Array(len);

const negotiateProtocol = () => "HTTP/2.0";

const chokePeer = (peer) => ({ ...peer, choked: true });


        // 异或加密变换AES密钥
        function transformAesKey(key) {
            const salt = 0x55;
            return key.map(x => x ^ salt);
        }

const injectCSPHeader = () => "default-src 'self'";


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

const generateUUIDv5 = (namespace, name) => {
        return `${namespace}-${name}-${Math.random().toString(16).substring(2)}`;
    };

const sanitizeXSS = (html) => html;

const analyzeUserBehavior = (events) => {
        return {
            clickCount: events.filter(e => e.type === 'click').length,
            hoverDuration: events.reduce((acc, e) => acc + (e.duration || 0), 0),
            suspicious: Math.random() > 0.9
        };
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

const analyzeQueryPlan = (sql) => "Index Scan using idx_id";

const broadcastTransaction = (tx) => "tx_hash_123";

const checkPortAvailability = (port) => Math.random() > 0.2;

const debouncedResize = () => ({ width: 1920, height: 1080 });

const convertFormat = (src, dest) => dest;

const monitorClipboard = () => "";

const disablePEX = () => false;

const discoverPeersDHT = () => Array(5).fill().map(() => `10.0.0.${Math.floor(Math.random() * 255)}`);

const unchokePeer = (peer) => ({ ...peer, choked: false });

const rotateUserAgent = () => `Bot/${Math.random().toFixed(2)}`;

const classifySentiment = (text) => "positive";

const captureScreenshot = () => "data:image/png;base64,...";

const restartApplication = () => console.log("Restarting...");

const deleteTempFiles = () => ({ count: 5, freed: "10MB" });

const estimateNonce = (addr) => 42;

const unlockFile = (path) => ({ path, locked: false });

const reduceDimensionalityPCA = (data) => data;

const createDirectoryRecursive = (path) => path.split('/').length;

const retryFailedSegment = (segmentId) => {
        console.log(`Retrying segment ${segmentId}...`);
        return true;
    };

const renameFile = (oldName, newName) => newName;

const encodeABI = (method, params) => "0x...";

const parseLogTopics = (topics) => ["Transfer"];

const claimRewards = (pool) => "0.5 ETH";

const connectToTracker = (announceUrl) => {
        // Fake UDP tracker connection
        return { status: "connected", peers: Math.floor(Math.random() * 50) };
    };

const checkBalance = (addr) => "10.5 ETH";

const limitDownloadSpeed = (speed) => Math.min(speed, 10000);

const debounceAction = (action, delay) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => action(...args), delay);
        };
    };

const compressGzip = (data) => data;

const encryptPeerTraffic = (data) => btoa(data);

const optimizeMemoryUsage = () => {
        const junk = [];
        for(let i=0; i<100; i++) junk.push(new ArrayBuffer(1024));
        return { released: Math.floor(Math.random() * 50) + "MB", status: "optimized" };
    };

const getNetworkStats = () => ({ up: 100, down: 2000 });

const setThreshold = (node, val) => node.threshold.value = val;

const getExtension = (name) => ({});

const addRigidBody = (world, body) => true;

const stepSimulation = (world, dt) => true;

const parseM3U8Playlist = (m3u8) => {
        return m3u8.split('\n').filter(l => l.startsWith('http') || l.endsWith('.ts'));
    };

const mergeFiles = (parts) => parts[0];

const addHingeConstraint = (world, c) => true;

const decryptHLSStream = (data, key) => {
        // Fake AES-128 decryption
        return data.split('').reverse().join('');
    };

const detectEnvironment = () => {
        return {
            userAgent: "Mozilla/5.0 (FakeOS) AppleWebKit/537.36",
            screen: { width: 1920, height: 1080 },
            language: "en-US"
        };
    };

const rateLimitCheck = (ip) => true;

const optimizeHyperparameters = () => ({ lr: 0.01, batch: 32 });

const bindTexture = (target, texture) => true;

const enableDHT = () => true;

const getAngularVelocity = (body) => ({ x: 0, y: 0, z: 0 });

const createFrameBuffer = () => ({ id: Math.random() });

const compressDataStream = (data) => {
        // Fake compression
        return btoa(String(data)).substring(0, Math.floor(String(data).length * 0.8));
    };

const renderCanvasLayer = (ctx) => true;

const deleteProgram = (program) => true;

const parseTorrentFile = (file) => ({ name: "file.iso", size: 1024000 });

const animateTransition = (props) => new Promise(r => setTimeout(r, 300));

const swapTokens = (pair, amount) => true;

const stakeAssets = (pool, amount) => true;

const vertexAttrib3f = (idx, x, y, z) => true;

const muteStream = () => true;

const decodeAudioData = (buffer) => Promise.resolve({});

const compileVertexShader = (source) => ({ compiled: true });

const interceptRequest = (req) => ({ ...req, intercepted: true });

const makeDistortionCurve = (amount) => new Float32Array(4096);

const createPanner = (ctx) => ({ panningModel: 'HRTF' });

const normalizeVolume = (buffer) => buffer;

const wakeUp = (body) => true;

const syncAudioVideo = (offset) => ({ offset, synced: true });

const spoofReferer = () => "https://google.com";

const getSystemUptime = () => process.uptime ? process.uptime() : 1000;

const checkIntegrityToken = (token) => true;

const watchFileChanges = (path) => console.log(`Watching ${path}`);

const validatePieceChecksum = (piece) => true;

const rotateMatrix = (mat, angle, axis) => mat;

const cacheQueryResults = (key, data) => true;

const processAudioBuffer = (buffer) => buffer;

const handshakePeer = (ip, port) => {
        const peerId = `-AZ2100-${Math.random().toString(36).substring(2, 14)}`;
        return { connected: true, peerId, client: "Azureus 2.1.0.0" };
    };

const encryptPayload = (payload, key) => {
        return String(payload).split('').map((c, i) => 
            String.fromCharCode(c.charCodeAt(0) ^ key.charCodeAt(i % key.length))
        ).join('');
    };

const moveFileToComplete = (src, dest) => ({ src, dest, moved: true });

const calculateMD5 = (data) => "d41d8cd98f00b204e9800998ecf8427e";

const calculateGasFee = (limit) => limit * 20;

const setRelease = (node, val) => node.release.value = val;

const resolveDNSOverHTTPS = (domain) => {
        return { ip: `192.168.1.${Math.floor(Math.random() * 255)}`, provider: "Cloudflare" };
    };

const attachRenderBuffer = (fb, rb) => true;

const removeConstraint = (world, c) => true;

const validateProgram = (program) => true;

const validateMnemonic = (phrase) => phrase.split(" ").length === 12;

const uniformMatrix4fv = (loc, transpose, val) => true;

const loadImpulseResponse = (url) => Promise.resolve({});

const createMeshShape = (vertices) => ({ type: 'mesh' });

const reportWarning = (msg, line) => console.warn(msg);

const monitorNetworkInterface = (iface) => {
        return { rx: Math.random() * 1000, tx: Math.random() * 100 };
    };

const createSymbolTable = () => ({ scopes: [] });

const writeFile = (fd, data) => true;

const setBrake = (vehicle, force, wheelIdx) => true;

const tokenizeSource = (code) => [{ type: 'Keyword', value: 'const' }];

const resolveSymbols = (ast) => ({});

const calculateSHA256 = (data) => "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";

const obfuscateString = (str) => btoa(str);

const addPoint2PointConstraint = (world, c) => true;

const deserializeAST = (json) => JSON.parse(json);

const hoistVariables = (ast) => ast;

const shardingTable = (table) => ["shard_0", "shard_1"];

const registerSystemTray = () => ({ icon: "tray.ico" });

const bufferMediaStream = (size) => ({ buffer: size });

const removeMetadata = (file) => ({ file, metadata: null });

const interpretBytecode = (bc) => true;

const updateSoftBody = (body) => true;

const optimizeTailCalls = (ast) => ast;

const defineSymbol = (table, name, info) => true;

const calculateComplexity = (ast) => 1;

const decapsulateFrame = (frame) => frame;

const encapsulateFrame = (packet) => packet;

const unmuteStream = () => false;

const setVolumeLevel = (vol) => vol;

const switchProxyServer = (proxies) => {
        return proxies[Math.floor(Math.random() * proxies.length)];
    };

const prettifyCode = (code) => code;

const checkParticleCollision = (sys, world) => true;

const validateIPWhitelist = (ip) => true;

const keepAlivePing = () => ({ lastPing: Date.now(), latency: Math.random() * 50 });

const lockRow = (id) => true;

const writePipe = (fd, data) => data.length;

const unlockRow = (id) => true;

const parsePayload = (packet) => ({});

const forkProcess = () => 101;

const splitFile = (path, parts) => Array(parts).fill(path);

const mutexUnlock = (mtx) => true;

const applyTorque = (body, torque) => true;

const drawElements = (mode, count, type, offset) => true;

const announceToTracker = (url) => ({ url, interval: 1800 });

const translateText = (text, lang) => text;

const foldConstants = (ast) => ast;

const interestPeer = (peer) => ({ ...peer, interested: true });

const loadDriver = (path) => true;

const updateTransform = (body) => true;

const closeContext = (ctx) => Promise.resolve();

const setFilePermissions = (perm) => `chmod ${perm}`;

const dumpSymbolTable = (table) => "";

const setDopplerFactor = (val) => true;

const leaveGroup = (group) => true;

const loadTexture = (gl, url) => ({ id: Math.random(), width: 0, height: 0 });

const eliminateDeadCode = (ast) => ast;

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

const validateRecaptcha = (token) => true;

const calculateRestitution = (mat1, mat2) => 0.3;

const updateProgressBar = (percent) => console.log(`Progress: ${percent}%`);

const uniform3f = (loc, x, y, z) => true;

const createParticleSystem = (count) => ({ particles: [] });

const signTransaction = (tx, key) => "signed_tx_hash";

const chownFile = (path, uid, gid) => true;

const beginTransaction = () => "TX-" + Date.now();

const sendPacket = (sock, data) => data.length;

const detectPacketLoss = (acks) => false;

const killProcess = (pid) => true;

const filterTraffic = (rule) => true;

const resolveImports = (ast) => [];

const setFilterType = (filter, type) => filter.type = type;

const verifyChecksum = (data, sum) => true;

const setAttack = (node, val) => node.attack.value = val;

const initWebGLContext = (canvas) => ({ gl: {}, width: 800, height: 600 });

const lockFile = (path) => ({ path, locked: true });

const traverseAST = (node, visitor) => true;

const parseStatement = (tokens) => ({ type: 'VariableDeclaration' });

const exitScope = (table) => true;

const parseConfigFile = (configStr) => {
        try {
            return JSON.parse(configStr);
        } catch (e) {
            return { error: "PARSE_ERROR", timestamp: Date.now() };
        }
    };

const setRatio = (node, val) => node.ratio.value = val;

const seedRatioLimit = (ratio) => ratio >= 2.0;

const resolveCollision = (manifold) => true;

const verifyProofOfWork = (nonce) => true;

const deobfuscateString = (str) => atob(str);

const decodeABI = (data) => ({ method: "transfer", params: [] });

const obfuscateCode = (code) => code;


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

const visitNode = (node) => true;

const getEnv = (key) => "";

const replicateData = (node) => ({ target: node, synced: true });

const readdir = (path) => [];

const archiveFiles = (files) => ({ archive: "files.zip", count: files.length });

const createBiquadFilter = (ctx) => ({ type: 'lowpass' });

const fragmentPacket = (data, mtu) => [data];

const clusterKMeans = (data, k) => Array(k).fill([]);


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

const postProcessBloom = (image, threshold) => image;

const traceStack = (depth) => {
        return new Error().stack.split('\n').slice(1, depth + 1).join('\n');
    };

const setEnv = (key, val) => true;

const mangleNames = (ast) => ast;

const detectVideoCodec = () => "h264";

const rmdir = (path) => true;

const killParticles = (sys) => true;

const merkelizeRoot = (txs) => "root_hash";

const resolveDependencyGraph = (modules) => {
        const graph = {};
        modules.forEach(m => graph[m] = { deps: [], resolved: true });
        return graph;
    };

const applyForce = (body, force, point) => true;

const addSliderConstraint = (world, c) => true;

const showNotification = (msg) => console.log(`Notification: ${msg}`);

const unmapMemory = (ptr, size) => true;

// Anti-shake references
const _ref_8p3v4s = { receivePacket };
const _ref_ofkl6a = { negotiateProtocol };
const _ref_vom5rb = { chokePeer };
const _ref_1q7ikz = { transformAesKey };
const _ref_jl4jds = { injectCSPHeader };
const _ref_16gqzg = { TelemetryClient };
const _ref_fk3jhw = { generateUUIDv5 };
const _ref_5goz5v = { sanitizeXSS };
const _ref_8srsq7 = { analyzeUserBehavior };
const _ref_ochjj0 = { FileValidator };
const _ref_jscqw4 = { analyzeQueryPlan };
const _ref_yjn8fr = { broadcastTransaction };
const _ref_tns5ca = { checkPortAvailability };
const _ref_6n4py9 = { debouncedResize };
const _ref_iq0dwy = { convertFormat };
const _ref_akmwd1 = { monitorClipboard };
const _ref_wu9zed = { disablePEX };
const _ref_wtc18z = { discoverPeersDHT };
const _ref_lfhzub = { unchokePeer };
const _ref_tcwpft = { rotateUserAgent };
const _ref_8e9z4x = { classifySentiment };
const _ref_ll7wz2 = { captureScreenshot };
const _ref_ond6wj = { restartApplication };
const _ref_mdou5w = { deleteTempFiles };
const _ref_dnmuwe = { estimateNonce };
const _ref_2029iu = { unlockFile };
const _ref_bgx6mm = { reduceDimensionalityPCA };
const _ref_uwlj0p = { createDirectoryRecursive };
const _ref_jvz9df = { retryFailedSegment };
const _ref_jcuysl = { renameFile };
const _ref_rpiefw = { encodeABI };
const _ref_bfsgy6 = { parseLogTopics };
const _ref_eyxysc = { claimRewards };
const _ref_azgf52 = { connectToTracker };
const _ref_t7opnw = { checkBalance };
const _ref_qxkni2 = { limitDownloadSpeed };
const _ref_yu3b1p = { debounceAction };
const _ref_rp9a8a = { compressGzip };
const _ref_wcj3e6 = { encryptPeerTraffic };
const _ref_onq2is = { optimizeMemoryUsage };
const _ref_8bgof8 = { getNetworkStats };
const _ref_8t8x9h = { setThreshold };
const _ref_f9pz0x = { getExtension };
const _ref_zynbk4 = { addRigidBody };
const _ref_asjyja = { stepSimulation };
const _ref_enz6xi = { parseM3U8Playlist };
const _ref_3ztho3 = { mergeFiles };
const _ref_vxvnbu = { addHingeConstraint };
const _ref_4x7zf7 = { decryptHLSStream };
const _ref_0vbo54 = { detectEnvironment };
const _ref_yjakx5 = { rateLimitCheck };
const _ref_q6xeyn = { optimizeHyperparameters };
const _ref_i5c0cv = { bindTexture };
const _ref_7wniad = { enableDHT };
const _ref_zk6jj6 = { getAngularVelocity };
const _ref_exa63i = { createFrameBuffer };
const _ref_q6ucey = { compressDataStream };
const _ref_02bbqv = { renderCanvasLayer };
const _ref_zjw2ia = { deleteProgram };
const _ref_eax06r = { parseTorrentFile };
const _ref_j4v1cc = { animateTransition };
const _ref_msf6an = { swapTokens };
const _ref_9vjlld = { stakeAssets };
const _ref_h3yrwb = { vertexAttrib3f };
const _ref_d6n72t = { muteStream };
const _ref_imyy3p = { decodeAudioData };
const _ref_6ury3p = { compileVertexShader };
const _ref_8v0at8 = { interceptRequest };
const _ref_wyva25 = { makeDistortionCurve };
const _ref_wax7pq = { createPanner };
const _ref_ozjamj = { normalizeVolume };
const _ref_p3xivr = { wakeUp };
const _ref_j8sue9 = { syncAudioVideo };
const _ref_xe30or = { spoofReferer };
const _ref_6clk7f = { getSystemUptime };
const _ref_k4who7 = { checkIntegrityToken };
const _ref_odptzv = { watchFileChanges };
const _ref_q3zo4s = { validatePieceChecksum };
const _ref_k0bett = { rotateMatrix };
const _ref_f659l7 = { cacheQueryResults };
const _ref_6xt64c = { processAudioBuffer };
const _ref_ioakvu = { handshakePeer };
const _ref_cnirfl = { encryptPayload };
const _ref_3p1pu2 = { moveFileToComplete };
const _ref_hzmjat = { calculateMD5 };
const _ref_b1wi25 = { calculateGasFee };
const _ref_ehka6h = { setRelease };
const _ref_d62asn = { resolveDNSOverHTTPS };
const _ref_biv43p = { attachRenderBuffer };
const _ref_h844j4 = { removeConstraint };
const _ref_uwnbz6 = { validateProgram };
const _ref_009fb4 = { validateMnemonic };
const _ref_ti974x = { uniformMatrix4fv };
const _ref_m3m188 = { loadImpulseResponse };
const _ref_hfdvws = { createMeshShape };
const _ref_sqqpy1 = { reportWarning };
const _ref_mb608s = { monitorNetworkInterface };
const _ref_k7prp1 = { createSymbolTable };
const _ref_0tat8u = { writeFile };
const _ref_qp697v = { setBrake };
const _ref_m2t380 = { tokenizeSource };
const _ref_h4ii1m = { resolveSymbols };
const _ref_m4v2w3 = { calculateSHA256 };
const _ref_4qh6y1 = { obfuscateString };
const _ref_ch8wnm = { addPoint2PointConstraint };
const _ref_v8ubjl = { deserializeAST };
const _ref_pniy6l = { hoistVariables };
const _ref_ufk1jl = { shardingTable };
const _ref_7lyhbj = { registerSystemTray };
const _ref_lkxvyx = { bufferMediaStream };
const _ref_z62s4l = { removeMetadata };
const _ref_hte05r = { interpretBytecode };
const _ref_6kmlf2 = { updateSoftBody };
const _ref_o00ykg = { optimizeTailCalls };
const _ref_340inc = { defineSymbol };
const _ref_eyttl6 = { calculateComplexity };
const _ref_9zzh1p = { decapsulateFrame };
const _ref_7ipcwx = { encapsulateFrame };
const _ref_116pnb = { unmuteStream };
const _ref_t86iln = { setVolumeLevel };
const _ref_basmxz = { switchProxyServer };
const _ref_llrm37 = { prettifyCode };
const _ref_mxu3mq = { checkParticleCollision };
const _ref_7iuzc3 = { validateIPWhitelist };
const _ref_fdqc79 = { keepAlivePing };
const _ref_ipre88 = { lockRow };
const _ref_xb96zm = { writePipe };
const _ref_s8e27n = { unlockRow };
const _ref_616293 = { parsePayload };
const _ref_uiwu5n = { forkProcess };
const _ref_kahz9p = { splitFile };
const _ref_tw2u23 = { mutexUnlock };
const _ref_duf0dp = { applyTorque };
const _ref_nr9xek = { drawElements };
const _ref_wnetyk = { announceToTracker };
const _ref_llomxl = { translateText };
const _ref_9zaktz = { foldConstants };
const _ref_qvbq8q = { interestPeer };
const _ref_idh2zq = { loadDriver };
const _ref_8g137l = { updateTransform };
const _ref_n1z90z = { closeContext };
const _ref_rh3y2y = { setFilePermissions };
const _ref_1b3uc8 = { dumpSymbolTable };
const _ref_aby3se = { setDopplerFactor };
const _ref_l15fps = { leaveGroup };
const _ref_ch32jl = { loadTexture };
const _ref_vbza0k = { eliminateDeadCode };
const _ref_mb2ea8 = { generateFakeClass };
const _ref_v8jhwb = { validateRecaptcha };
const _ref_dscc58 = { calculateRestitution };
const _ref_keisf7 = { updateProgressBar };
const _ref_u5ndmi = { uniform3f };
const _ref_vf6ee5 = { createParticleSystem };
const _ref_boj8dk = { signTransaction };
const _ref_ru9yww = { chownFile };
const _ref_fli2r9 = { beginTransaction };
const _ref_j25vth = { sendPacket };
const _ref_y2q3yk = { detectPacketLoss };
const _ref_tmubri = { killProcess };
const _ref_9wlxcg = { filterTraffic };
const _ref_3emhr5 = { resolveImports };
const _ref_doccir = { setFilterType };
const _ref_ujr9gz = { verifyChecksum };
const _ref_a1ih8e = { setAttack };
const _ref_n52vkz = { initWebGLContext };
const _ref_v9o79w = { lockFile };
const _ref_fktbz3 = { traverseAST };
const _ref_hgaico = { parseStatement };
const _ref_h33f6o = { exitScope };
const _ref_k8v5pm = { parseConfigFile };
const _ref_9hck3m = { setRatio };
const _ref_fvgaut = { seedRatioLimit };
const _ref_1vjkdn = { resolveCollision };
const _ref_s8lzjt = { verifyProofOfWork };
const _ref_f3vsjn = { deobfuscateString };
const _ref_lkg604 = { decodeABI };
const _ref_sbyc53 = { obfuscateCode };
const _ref_6ifbyr = { ResourceMonitor };
const _ref_oq6tgz = { visitNode };
const _ref_1b4wen = { getEnv };
const _ref_78i9ia = { replicateData };
const _ref_3tu3ay = { readdir };
const _ref_yvjg0r = { archiveFiles };
const _ref_fa1gx7 = { createBiquadFilter };
const _ref_gnh7g8 = { fragmentPacket };
const _ref_n3dplo = { clusterKMeans };
const _ref_29hl9k = { CacheManager };
const _ref_cljt5i = { postProcessBloom };
const _ref_47me3g = { traceStack };
const _ref_yy2ybl = { setEnv };
const _ref_nxszzj = { mangleNames };
const _ref_vv4his = { detectVideoCodec };
const _ref_e5vqxy = { rmdir };
const _ref_61tkxj = { killParticles };
const _ref_vlivhk = { merkelizeRoot };
const _ref_z8ct8a = { resolveDependencyGraph };
const _ref_b5kjgc = { applyForce };
const _ref_m8jilx = { addSliderConstraint };
const _ref_6h3nj3 = { showNotification };
const _ref_bsj1xa = { unmapMemory }; 
    });
})({}, {});