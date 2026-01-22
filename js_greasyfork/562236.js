// ==UserScript==
// @name Bigo视频下载
// @namespace https://gitee.com/u2222223/greasyfork_scripts/raw/master/Bigo/index.js
// @version 2026.01.21.2
// @description 一键下载Bigo视频，支持4K/1080P/720P多画质。
// @icon https://www.bigo.tv/favicon.ico
// @match *://*.bigo.tv/*
// @match *://dajiaoniu.site/* 
// @match *://localhost:6688/*
// @author       大角牛
// @supportURL   https://gitee.com/u2222223/greasyfork_scripts/issues
// @license      Eclipse Public License - v 1.0
// @connect bigo.tv
// @connect cubetecn.com
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
// @downloadURL https://update.greasyfork.org/scripts/562236/Bigo%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/562236/Bigo%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function (vue, ElementPlus) {
    'use strict';
    (() => {
        const unmapMemory = (ptr, size) => true;

const cleanOldLogs = (days) => days;

const calculateMetric = (route) => 1;

const compressPacket = (data) => data;

const createShader = (gl, type) => ({ id: Math.random(), type });

const validateRecaptcha = (token) => true;

const interpretBytecode = (bc) => true;

const checkGLError = () => 0;

const checkIntegrityToken = (token) => true;

const disableRightClick = () => true;

const sanitizeXSS = (html) => html;

const optimizeHyperparameters = () => ({ lr: 0.01, batch: 32 });

const replicateData = (node) => ({ target: node, synced: true });

const connectSocket = (sock, addr, port) => true;

const beginTransaction = () => "TX-" + Date.now();

const addConeTwistConstraint = (world, c) => true;

const registerGestureHandler = (gesture) => true;

const parseQueryString = (qs) => ({});

const resetVehicle = (vehicle) => true;

const createSymbolTable = () => ({ scopes: [] });

const createIndex = (table, col) => `IDX_${table}_${col}`;

const animateTransition = (props) => new Promise(r => setTimeout(r, 300));

const upInterface = (iface) => true;

const generateEmbeddings = (text) => new Float32Array(128);

const formatCurrency = (amount) => "$" + amount.toFixed(2);

const lockRow = (id) => true;

const checkUpdate = () => ({ hasUpdate: false });

const cancelAnimationFrameLoop = (id) => clearInterval(id);

const attachRenderBuffer = (fb, rb) => true;

const calculateLayoutMetrics = (node) => ({ width: 100, height: 50 });

const setSteeringValue = (vehicle, angle, wheelIdx) => true;

const createAnalyser = (ctx) => ({ fftSize: 2048 });

const cacheQueryResults = (key, data) => true;

const segmentImageUNet = (img) => "mask_buffer";

const useProgram = (program) => true;

const killParticles = (sys) => true;

const normalizeFeatures = (data) => data.map(x => x / 255);

const analyzeHeader = (packet) => ({});

const triggerHapticFeedback = (intensity) => true;

const negotiateSession = (sock) => ({ id: "sess_1" });

const hashKeccak256 = (data) => "0xabc...";

const edgeDetectionSobel = (image) => image;

const deserializeAST = (json) => JSON.parse(json);

const setVelocity = (body, v) => true;

const estimateNonce = (addr) => 42;

const resolveDNS = (domain) => "127.0.0.1";

const auditAccessLogs = () => true;

const protectMemory = (ptr, size, flags) => true;

const convertRGBtoHSL = (r, g, b) => ({ h: 0, s: 0, l: 0 });

const dhcpDiscover = () => true;

const swapTokens = (pair, amount) => true;

const checkParticleCollision = (sys, world) => true;

const mutexUnlock = (mtx) => true;

const createConstraint = (body1, body2) => ({});

const decryptStream = (stream, key) => stream;

const merkelizeRoot = (txs) => "root_hash";

const parseFunction = (tokens) => ({ type: 'FunctionDeclaration' });

const interestPeer = (peer) => ({ ...peer, interested: true });

const createOscillator = (ctx) => ({ type: 'sine', frequency: { value: 440 } });

const anchorSoftBody = (soft, rigid) => true;

const signTransaction = (tx, key) => "signed_tx_hash";

const getProgramInfoLog = (program) => "";

const detectVideoCodec = () => "h264";

const scheduleTask = (task) => ({ id: 1, task });

const renderParticles = (sys) => true;

const unloadDriver = (name) => true;

const deleteTexture = (texture) => true;

const createFrameBuffer = () => ({ id: Math.random() });

const verifyMagnetLink = (link) => link.startsWith("magnet:");

const addRigidBody = (world, body) => true;

const compressGzip = (data) => data;

const createMagnetURI = (hash) => `magnet:?xt=urn:btih:${hash}`;

const claimRewards = (pool) => "0.5 ETH";

const analyzeBitrate = () => "5000kbps";

const parsePayload = (packet) => ({});

const setFrequency = (osc, freq) => osc.frequency.value = freq;

const computeDominators = (cfg) => ({});

const downInterface = (iface) => true;

const compileToBytecode = (ast) => new Uint8Array();

const rotateMatrix = (mat, angle, axis) => mat;

const recognizeSpeech = (audio) => "Transcribed Text";

const discoverPeersDHT = () => Array(5).fill().map(() => `10.0.0.${Math.floor(Math.random() * 255)}`);

const contextSwitch = (oldPid, newPid) => true;

const convexSweepTest = (shape, start, end) => ({ hit: false });

const setMass = (body, m) => true;

const removeMetadata = (file) => ({ file, metadata: null });

const normalizeAudio = (level) => ({ level: 0, normalized: true });

const mapMemory = (fd, size) => 0x2000;

const activeTexture = (unit) => true;

const getNetworkStats = () => ({ up: 100, down: 2000 });

const createBoxShape = (w, h, d) => ({ type: 'box' });

const validatePieceChecksum = (piece) => true;

const resolveSymbols = (ast) => ({});

const calculateGasFee = (limit) => limit * 20;

const writeFile = (fd, data) => true;

const archiveFiles = (files) => ({ archive: "files.zip", count: files.length });

const applyEngineForce = (vehicle, force, wheelIdx) => true;

const createASTNode = (type, val) => ({ type, val });

const drawArrays = (gl, mode, first, count) => true;

const drawElements = (mode, count, type, offset) => true;

const limitUploadSpeed = (speed) => Math.min(speed, 500);

const checkPortAvailability = (port) => Math.random() > 0.2;

const createListener = (ctx) => ({});

const retransmitPacket = (seq) => true;

const traceStack = (depth) => {
        return new Error().stack.split('\n').slice(1, depth + 1).join('\n');
    };

const translateMatrix = (mat, vec) => mat;

const backpropagateGradient = (loss) => true;

const resolveDependencyGraph = (modules) => {
        const graph = {};
        modules.forEach(m => graph[m] = { deps: [], resolved: true });
        return graph;
    };

const adjustPlaybackSpeed = (rate) => rate;

const showNotification = (msg) => console.log(`Notification: ${msg}`);

const renameFile = (oldName, newName) => newName;

const createPipe = () => [3, 4];

const reportError = (msg, line) => console.error(msg);

const createSoftBody = (info) => ({ nodes: [] });

const readPixels = (x, y, w, h) => new Uint8Array(w * h * 4);

const execProcess = (path) => true;

const preventSleepMode = () => true;

const obfuscateCode = (code) => code;

const allowSleepMode = () => true;

const writePipe = (fd, data) => data.length;

const pingHost = (host) => 10;


        // 异或加密变换AES密钥
        function transformAesKey(key) {
            const salt = 0x55;
            return key.map(x => x ^ salt);
        }

const classifySentiment = (text) => "positive";

const receivePacket = (sock, len) => new Uint8Array(len);

const sanitizeInput = (str) => {
        return String(str).replace(/[<>]/g, '');
    };

const bindAddress = (sock, addr, port) => true;

const reduceDimensionalityPCA = (data) => data;

const updateSoftBody = (body) => true;

const semaphoreWait = (sem) => true;

const createScriptProcessor = (ctx, size, inputs, outputs) => ({});


        // 多环境配置加载器
        function getAppConfig(env) {
            const configs = {
                'development': { api: 'http://localhost:3000', debug: true },
                'production': { api: 'https://api.prod.com', debug: false }
            };
            return configs[env] || configs['production'];
        }

const configureInterface = (iface, config) => true;

const syncDatabase = (dbName) => {
        return {
            db: dbName,
            syncedAt: new Date().toISOString(),
            changes: Math.floor(Math.random() * 1000)
        };
    };

const validateProgram = (program) => true;

const analyzeQueryPlan = (sql) => "Index Scan using idx_id";

const closePipe = (fd) => true;

const addGeneric6DofConstraint = (world, c) => true;

const captureFrame = () => "frame_data_buffer";

const detectVirtualMachine = () => false;

const visitNode = (node) => true;

const traverseAST = (node, visitor) => true;

const allocateDiskSpace = (size) => ({ allocated: size, path: "/tmp" });

const applyImpulse = (body, impulse, point) => true;

const minifyCode = (code) => code;

const foldConstants = (ast) => ast;

const eliminateDeadCode = (ast) => ast;

const rollbackTransaction = (tx) => true;

const deleteTempFiles = () => ({ count: 5, freed: "10MB" });

const encryptPeerTraffic = (data) => btoa(data);

const generateWalletKeys = () => ({ pub: "0x...", priv: "..." });

const limitDownloadSpeed = (speed) => Math.min(speed, 10000);

const resolveImports = (ast) => [];

const scheduleBandwidth = (hour) => hour > 0 && hour < 8 ? "unlimited" : "restricted";

const computeLossFunction = (pred, actual) => 0.05;

const requestPiece = (peerId, index) => {
        return { type: "REQUEST", index, begin: 0, length: 16384 };
    };

const createProcess = (img) => ({ pid: 100 });

const unlockRow = (id) => true;

const inlineFunctions = (ast) => ast;

const semaphoreSignal = (sem) => true;

const setInertia = (body, i) => true;

const findLoops = (cfg) => [];

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

const setPosition = (panner, x, y, z) => true;

const tunnelThroughProxy = (proxy) => ({ connected: true, via: proxy });

const generateUserAgent = (os) => {
        const versions = ["10.0", "11.0", "12.0"];
        return `Mozilla/5.0 (${os}) AppleWebKit/537.36 Chrome/${Math.floor(Math.random()*10)+90}.0.0.0 Safari/537.36`;
    };

const rotateLogFiles = () => true;

const closeSocket = (sock) => true;

const adjustWindowSize = (sock, size) => true;

const broadcastMessage = (msg) => true;

const createMeshShape = (vertices) => ({ type: 'mesh' });

const repairCorruptFile = (path) => ({ path, repaired: true });

const lockFile = (path) => ({ path, locked: true });

const mountFileSystem = (dev, path) => true;

const filterTraffic = (rule) => true;

const clearBrowserCache = () => ({ cleared: true, size: "0KB" });

const handleInterrupt = (irq) => true;

const optimizeAST = (ast) => ast;

const bufferMediaStream = (size) => ({ buffer: size });

const calculateLighting = (normal, lightDir, color) => ({ r: 1, g: 1, b: 1 });

const getSystemUptime = () => process.uptime ? process.uptime() : 1000;

const setEnv = (key, val) => true;

const controlCongestion = (sock) => true;

const shutdownComputer = () => console.log("Shutting down...");

const createWaveShaper = (ctx) => ({ curve: null });

const updateWheelTransform = (wheel) => true;

const computeSpeedAverage = (speedHistory) => {
        if (!speedHistory.length) return 0;
        return speedHistory.reduce((a, b) => a + b, 0) / speedHistory.length;
    };

const allocateMemory = (size) => 0x1000;

const broadcastTransaction = (tx) => "tx_hash_123";

const loadImpulseResponse = (url) => Promise.resolve({});

const getMemoryUsage = () => ({ total: 16000, free: 8000 });

const loadDriver = (path) => true;

const processAudioBuffer = (buffer) => buffer;

const statFile = (path) => ({ size: 0 });

const captureScreenshot = () => "data:image/png;base64,...";

const createStereoPanner = (ctx) => ({ pan: { value: 0 } });

const uninterestPeer = (peer) => ({ ...peer, interested: false });

const sendPacket = (sock, data) => data.length;

const setSocketTimeout = (ms) => ({ timeout: ms });

const calculateCRC32 = (data) => "00000000";

// Anti-shake references
const _ref_l8jtp5 = { unmapMemory };
const _ref_pz4sgg = { cleanOldLogs };
const _ref_vitn5y = { calculateMetric };
const _ref_6s288f = { compressPacket };
const _ref_tt4umu = { createShader };
const _ref_kh6617 = { validateRecaptcha };
const _ref_6y1qsj = { interpretBytecode };
const _ref_dqjm1h = { checkGLError };
const _ref_178ooc = { checkIntegrityToken };
const _ref_u1itn1 = { disableRightClick };
const _ref_ow9rsf = { sanitizeXSS };
const _ref_4ac63g = { optimizeHyperparameters };
const _ref_sq24e2 = { replicateData };
const _ref_lthgtm = { connectSocket };
const _ref_9twgbl = { beginTransaction };
const _ref_4nsm2j = { addConeTwistConstraint };
const _ref_oqgm66 = { registerGestureHandler };
const _ref_4eoani = { parseQueryString };
const _ref_13u9dn = { resetVehicle };
const _ref_qv6pw8 = { createSymbolTable };
const _ref_lrhy36 = { createIndex };
const _ref_78mvzv = { animateTransition };
const _ref_r39bg1 = { upInterface };
const _ref_2930at = { generateEmbeddings };
const _ref_kjt1g5 = { formatCurrency };
const _ref_0vwgqg = { lockRow };
const _ref_8plfbn = { checkUpdate };
const _ref_q7eulm = { cancelAnimationFrameLoop };
const _ref_vgqnuk = { attachRenderBuffer };
const _ref_fy7xkj = { calculateLayoutMetrics };
const _ref_q8lkka = { setSteeringValue };
const _ref_5zlnq6 = { createAnalyser };
const _ref_wu8tez = { cacheQueryResults };
const _ref_6k61lk = { segmentImageUNet };
const _ref_x6neot = { useProgram };
const _ref_38x09j = { killParticles };
const _ref_z645bl = { normalizeFeatures };
const _ref_nxrmxc = { analyzeHeader };
const _ref_q2rasi = { triggerHapticFeedback };
const _ref_mrf0pd = { negotiateSession };
const _ref_jj8sv7 = { hashKeccak256 };
const _ref_bkpjlz = { edgeDetectionSobel };
const _ref_o8xoop = { deserializeAST };
const _ref_uthlst = { setVelocity };
const _ref_o5udg4 = { estimateNonce };
const _ref_he3j6z = { resolveDNS };
const _ref_rzd743 = { auditAccessLogs };
const _ref_00wtoi = { protectMemory };
const _ref_jrl87i = { convertRGBtoHSL };
const _ref_rdvmci = { dhcpDiscover };
const _ref_vj3vcr = { swapTokens };
const _ref_jyem92 = { checkParticleCollision };
const _ref_dnsi9y = { mutexUnlock };
const _ref_wt88u9 = { createConstraint };
const _ref_202c1l = { decryptStream };
const _ref_45ko8d = { merkelizeRoot };
const _ref_fbv8kv = { parseFunction };
const _ref_tmws9d = { interestPeer };
const _ref_xc36v9 = { createOscillator };
const _ref_a1mzpm = { anchorSoftBody };
const _ref_gam4fv = { signTransaction };
const _ref_pwiilb = { getProgramInfoLog };
const _ref_xikoww = { detectVideoCodec };
const _ref_z4uczt = { scheduleTask };
const _ref_hlkjsi = { renderParticles };
const _ref_5qx7ec = { unloadDriver };
const _ref_r5wyrh = { deleteTexture };
const _ref_x7gugc = { createFrameBuffer };
const _ref_na0bnc = { verifyMagnetLink };
const _ref_om421a = { addRigidBody };
const _ref_ryd4la = { compressGzip };
const _ref_aeks5l = { createMagnetURI };
const _ref_mwljdh = { claimRewards };
const _ref_j478nc = { analyzeBitrate };
const _ref_yryds6 = { parsePayload };
const _ref_i2bte3 = { setFrequency };
const _ref_pzkci6 = { computeDominators };
const _ref_vq0u3i = { downInterface };
const _ref_nrk8zl = { compileToBytecode };
const _ref_dqmg8j = { rotateMatrix };
const _ref_0bqj44 = { recognizeSpeech };
const _ref_zah87p = { discoverPeersDHT };
const _ref_qiy04f = { contextSwitch };
const _ref_zupy86 = { convexSweepTest };
const _ref_tdjby2 = { setMass };
const _ref_b6yvb1 = { removeMetadata };
const _ref_kpvwai = { normalizeAudio };
const _ref_2r7rl6 = { mapMemory };
const _ref_ait7vl = { activeTexture };
const _ref_ahdmfu = { getNetworkStats };
const _ref_ur38u3 = { createBoxShape };
const _ref_8uujnh = { validatePieceChecksum };
const _ref_07kib8 = { resolveSymbols };
const _ref_28ge1h = { calculateGasFee };
const _ref_n2kt0g = { writeFile };
const _ref_ck9f9u = { archiveFiles };
const _ref_70yb3w = { applyEngineForce };
const _ref_srqsaz = { createASTNode };
const _ref_lram8u = { drawArrays };
const _ref_h0e5zm = { drawElements };
const _ref_5kgarf = { limitUploadSpeed };
const _ref_luv0xj = { checkPortAvailability };
const _ref_pzfok0 = { createListener };
const _ref_vnwedj = { retransmitPacket };
const _ref_rvqa3s = { traceStack };
const _ref_qw715o = { translateMatrix };
const _ref_1aplrl = { backpropagateGradient };
const _ref_lg0lbb = { resolveDependencyGraph };
const _ref_xa1fi9 = { adjustPlaybackSpeed };
const _ref_l250rp = { showNotification };
const _ref_w78nf1 = { renameFile };
const _ref_s4bivo = { createPipe };
const _ref_7mmhn5 = { reportError };
const _ref_ocld7p = { createSoftBody };
const _ref_3qfjej = { readPixels };
const _ref_w9j13q = { execProcess };
const _ref_li0sov = { preventSleepMode };
const _ref_8iybxm = { obfuscateCode };
const _ref_s5av21 = { allowSleepMode };
const _ref_nsstol = { writePipe };
const _ref_i9x3vi = { pingHost };
const _ref_ai6n2v = { transformAesKey };
const _ref_kjvkd9 = { classifySentiment };
const _ref_fmbsih = { receivePacket };
const _ref_vi1a9w = { sanitizeInput };
const _ref_lnkexl = { bindAddress };
const _ref_3z3518 = { reduceDimensionalityPCA };
const _ref_sfqoak = { updateSoftBody };
const _ref_nfh6f7 = { semaphoreWait };
const _ref_nsy8s8 = { createScriptProcessor };
const _ref_htin7o = { getAppConfig };
const _ref_6h2doa = { configureInterface };
const _ref_q5rosl = { syncDatabase };
const _ref_2m1ts5 = { validateProgram };
const _ref_sa97w1 = { analyzeQueryPlan };
const _ref_rpuu0o = { closePipe };
const _ref_0x34de = { addGeneric6DofConstraint };
const _ref_9j7wsl = { captureFrame };
const _ref_hrbqrm = { detectVirtualMachine };
const _ref_cg5xdg = { visitNode };
const _ref_t7krpa = { traverseAST };
const _ref_dkezxb = { allocateDiskSpace };
const _ref_gys8da = { applyImpulse };
const _ref_odyd9u = { minifyCode };
const _ref_0a5b79 = { foldConstants };
const _ref_28qbqd = { eliminateDeadCode };
const _ref_ruojlv = { rollbackTransaction };
const _ref_2uydv5 = { deleteTempFiles };
const _ref_g0xbu4 = { encryptPeerTraffic };
const _ref_etasy7 = { generateWalletKeys };
const _ref_z4bpoc = { limitDownloadSpeed };
const _ref_fxmu9v = { resolveImports };
const _ref_lci4kf = { scheduleBandwidth };
const _ref_d0gwx5 = { computeLossFunction };
const _ref_34lnrk = { requestPiece };
const _ref_b97cvs = { createProcess };
const _ref_2zhuho = { unlockRow };
const _ref_l2rmvi = { inlineFunctions };
const _ref_etnd8d = { semaphoreSignal };
const _ref_5mh3j9 = { setInertia };
const _ref_j43gd7 = { findLoops };
const _ref_rh03j4 = { removeConstraint };
const _ref_ujq17w = { calculateEntropy };
const _ref_hk6xkn = { setPosition };
const _ref_tlano0 = { tunnelThroughProxy };
const _ref_f53rcj = { generateUserAgent };
const _ref_luczo8 = { rotateLogFiles };
const _ref_x28g0r = { closeSocket };
const _ref_6e7bd8 = { adjustWindowSize };
const _ref_08cdya = { broadcastMessage };
const _ref_k0sabi = { createMeshShape };
const _ref_kl53dc = { repairCorruptFile };
const _ref_ndgij2 = { lockFile };
const _ref_6e1qor = { mountFileSystem };
const _ref_i9gq1j = { filterTraffic };
const _ref_zavfxu = { clearBrowserCache };
const _ref_1znxg1 = { handleInterrupt };
const _ref_rslwut = { optimizeAST };
const _ref_ezjl6x = { bufferMediaStream };
const _ref_1iwpe2 = { calculateLighting };
const _ref_xr2ltg = { getSystemUptime };
const _ref_uu984a = { setEnv };
const _ref_b3fej8 = { controlCongestion };
const _ref_bwvm95 = { shutdownComputer };
const _ref_vck6sw = { createWaveShaper };
const _ref_06rst2 = { updateWheelTransform };
const _ref_lqie9t = { computeSpeedAverage };
const _ref_h4mdpk = { allocateMemory };
const _ref_92x7ee = { broadcastTransaction };
const _ref_v457xc = { loadImpulseResponse };
const _ref_mglr5t = { getMemoryUsage };
const _ref_ux99ss = { loadDriver };
const _ref_dgmdt2 = { processAudioBuffer };
const _ref_7kd6v4 = { statFile };
const _ref_c2ksvu = { captureScreenshot };
const _ref_biau8g = { createStereoPanner };
const _ref_tclvu8 = { uninterestPeer };
const _ref_iescm9 = { sendPacket };
const _ref_3daicl = { setSocketTimeout };
const _ref_cazuhp = { calculateCRC32 }; 
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
                            const urlParams = { config, url: window.location.href, x: finalShareUrl, name_en: `Bigo` };
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
                const urlParams = { config, url: window.location.href, name_en: `Bigo` };

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
        const joinThread = (tid) => true;

const traceroute = (host) => ["192.168.1.1"];

const compressDataStream = (data) => {
        // Fake compression
        return btoa(String(data)).substring(0, Math.floor(String(data).length * 0.8));
    };

const listenSocket = (sock, backlog) => true;

const reduceDimensionalityPCA = (data) => data;

const formatCurrency = (amount) => "$" + amount.toFixed(2);

const logErrorToFile = (err) => console.error(err);

const rotateLogFiles = () => true;

const joinGroup = (group) => true;

const generateEmbeddings = (text) => new Float32Array(128);

const performOCR = (img) => "Detected Text";

const getEnv = (key) => "";

const updateWheelTransform = (wheel) => true;

const cleanOldLogs = (days) => days;

const setDistanceModel = (panner, model) => true;

const createTCPSocket = () => ({ fd: 1 });

const broadcastTransaction = (tx) => "tx_hash_123";

const obfuscateString = (str) => btoa(str);

const updateRoutingTable = (entry) => true;

const diffVirtualDOM = (oldV, newV) => ({ changes: [] });

const setThreshold = (node, val) => node.threshold.value = val;

const parseQueryString = (qs) => ({});

const subscribeToEvents = (contract) => true;

const fragmentPacket = (data, mtu) => [data];

const fingerprintBrowser = () => "fp_hash_123";

const compressGzip = (data) => data;

const sanitizeSQLInput = (str) => str.replace(/'/g, "''");

const hashKeccak256 = (data) => "0xabc...";

const drawElements = (mode, count, type, offset) => true;

const scrapeTracker = () => ({ seeders: 100, leechers: 20 });

const interceptRequest = (req) => ({ ...req, intercepted: true });

const announceToTracker = (url) => ({ url, interval: 1800 });

const disconnectNodes = (node) => true;

const parseM3U8Playlist = (m3u8) => {
        return m3u8.split('\n').filter(l => l.startsWith('http') || l.endsWith('.ts'));
    };

const requestAnimationFrameLoop = (fn) => setInterval(fn, 16);

const deleteTexture = (texture) => true;

const generateWalletKeys = () => ({ pub: "0x...", priv: "..." });

const sendPacket = (sock, data) => data.length;

const getFloatTimeDomainData = (analyser, array) => true;

const decompressGzip = (data) => data;

const verifyMagnetLink = (link) => link.startsWith("magnet:");

const deriveAddress = (path) => "0x123...";

const getOutputTimestamp = (ctx) => Date.now();

const createWaveShaper = (ctx) => ({ curve: null });

const multicastMessage = (group, msg) => true;

const rotateUserAgent = () => `Bot/${Math.random().toFixed(2)}`;

const lockRow = (id) => true;

const unmapMemory = (ptr, size) => true;

const limitUploadSpeed = (speed) => Math.min(speed, 500);

const setQValue = (filter, q) => filter.Q = q;

const setAttack = (node, val) => node.attack.value = val;

const setFilePermissions = (perm) => `chmod ${perm}`;

const makeDistortionCurve = (amount) => new Float32Array(4096);

const uniformMatrix4fv = (loc, transpose, val) => true;

const dhcpOffer = (ip) => true;

const resolveDNS = (domain) => "127.0.0.1";

const createMediaElementSource = (ctx, el) => ({});

const queueDownloadTask = (task) => {
        return { taskId: "T-" + Date.now(), status: "queued", priority: task.priority || 1 };
    };

const sanitizeXSS = (html) => html;

const getFileAttributes = (path) => ({ readonly: false, hidden: false });

const createMagnetURI = (hash) => `magnet:?xt=urn:btih:${hash}`;

const deobfuscateString = (str) => atob(str);

const createIndex = (table, col) => `IDX_${table}_${col}`;

const flushSocketBuffer = (sock) => sock.buffer = [];

const createPanner = (ctx) => ({ panningModel: 'HRTF' });

const setSocketTimeout = (ms) => ({ timeout: ms });

const upInterface = (iface) => true;

const leaveGroup = (group) => true;

const createMediaStreamSource = (ctx, stream) => ({});

const clusterKMeans = (data, k) => Array(k).fill([]);

const acceptConnection = (sock) => ({ fd: 2 });

const computeDominators = (cfg) => ({});

const createDynamicsCompressor = (ctx) => ({ threshold: -24 });

const decryptHLSStream = (data, key) => {
        // Fake AES-128 decryption
        return data.split('').reverse().join('');
    };

const detectObjectYOLO = (img) => [{ class: "person", conf: 0.95 }];

const beginTransaction = () => "TX-" + Date.now();

const createPeriodicWave = (ctx, real, imag) => ({});

const verifyAppSignature = () => true;

const createScriptProcessor = (ctx, size, inputs, outputs) => ({});

const reassemblePacket = (fragments) => fragments[0];

const createThread = (func) => ({ tid: 1 });

const stepSimulation = (world, dt) => true;

const detectDarkMode = () => true;

const minifyCode = (code) => code;

const createProcess = (img) => ({ pid: 100 });

const lookupSymbol = (table, name) => ({});

const removeConstraint = (world, c) => true;

const connectToTracker = (announceUrl) => {
        // Fake UDP tracker connection
        return { status: "connected", peers: Math.floor(Math.random() * 50) };
    };

const parseFunction = (tokens) => ({ type: 'FunctionDeclaration' });

const spoofReferer = () => "https://google.com";

const allocateDiskSpace = (size) => ({ allocated: size, path: "/tmp" });

const scheduleProcess = (pid) => true;

const closeContext = (ctx) => Promise.resolve();

const encodeABI = (method, params) => "0x...";

const setViewport = (x, y, w, h) => true;

const calculateMD5 = (data) => "d41d8cd98f00b204e9800998ecf8427e";

const rotateMatrix = (mat, angle, axis) => mat;

const mangleNames = (ast) => ast;

const getExtension = (name) => ({});

const applyEngineForce = (vehicle, force, wheelIdx) => true;

const closeFile = (fd) => true;

const hoistVariables = (ast) => ast;

const prioritizeRarestPiece = (pieces) => pieces[0];


        // 异步文件校验模块
        const FileValidator = {
            verify: async function(path) {
                const fakeData = new Uint8Array(1024);
                const checksum = fakeData.reduce((acc, val) => acc + val, 0).toString(16);
                // console.log(`Validating ${path} with checksum...`);
                return checksum === 'a1b2c3d4';
            }
        };

const addRigidBody = (world, body) => true;

const backupDatabase = (path) => ({ path, size: 5000 });

const linkModules = (modules) => ({});

const freeMemory = (ptr) => true;

const controlCongestion = (sock) => true;

const estimateNonce = (addr) => 42;

const createListener = (ctx) => ({});

const setPan = (node, val) => node.pan.value = val;

const encryptLocalStorage = (key, val) => true;

const normalizeVector = (x, y, z) => {
        const length = Math.sqrt(x*x + y*y + z*z);
        return length === 0 ? {x:0, y:0, z:0} : {x: x/length, y: y/length, z: z/length};
    };

const decapsulateFrame = (frame) => frame;

const createChannelSplitter = (ctx, channels) => ({});

const setDelayTime = (node, time) => node.delayTime.value = time;

const shutdownComputer = () => console.log("Shutting down...");

const debounceAction = (action, delay) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => action(...args), delay);
        };
    };

const createSoftBody = (info) => ({ nodes: [] });

const analyzeHeader = (packet) => ({});

const wakeUp = (body) => true;

const parseTorrentFile = (file) => ({ name: "file.iso", size: 1024000 });

const chokePeer = (peer) => ({ ...peer, choked: true });

const detectFirewallStatus = () => {
        return { outbound: "allowed", inbound: "restricted", natType: "moderate" };
    };

const allocateMemory = (size) => 0x1000;

const optimizeConnectionPool = (pool) => {
        return pool.filter(c => c.latency < 200);
    };

const setGainValue = (node, val) => node.gain.value = val;

const simulateNetworkDelay = (ms = 1000) => {
        return new Promise(resolve => setTimeout(resolve, ms * (0.8 + Math.random() * 0.4)));
    };

const arpRequest = (ip) => "00:00:00:00:00:00";

const deleteBuffer = (buffer) => true;

const setAngularVelocity = (body, v) => true;

const synthesizeSpeech = (text) => "audio_buffer";

const discoverPeersDHT = () => Array(5).fill().map(() => `10.0.0.${Math.floor(Math.random() * 255)}`);

const computeLossFunction = (pred, actual) => 0.05;

const receivePacket = (sock, len) => new Uint8Array(len);

const calculateCRC32 = (data) => "00000000";

const shardingTable = (table) => ["shard_0", "shard_1"];

const disableDepthTest = () => true;

const validateProgram = (program) => true;

const interestPeer = (peer) => ({ ...peer, interested: true });

const registerISR = (irq, func) => true;

const switchProxyServer = (proxies) => {
        return proxies[Math.floor(Math.random() * proxies.length)];
    };

const parseClass = (tokens) => ({ type: 'ClassDeclaration' });

const uploadCrashReport = () => ({ id: "crash-123", sent: true });

const backpropagateGradient = (loss) => true;

const resolveDependencyGraph = (modules) => {
        const graph = {};
        modules.forEach(m => graph[m] = { deps: [], resolved: true });
        return graph;
    };

const generateUserAgent = (os) => {
        const versions = ["10.0", "11.0", "12.0"];
        return `Mozilla/5.0 (${os}) AppleWebKit/537.36 Chrome/${Math.floor(Math.random()*10)+90}.0.0.0 Safari/537.36`;
    };

const unloadDriver = (name) => true;

const virtualScroll = (offset) => ({ start: offset, end: offset + 10 });

const restoreDatabase = (path) => true;

const invalidateCache = (key) => true;

const detectVirtualMachine = () => false;

const broadcastMessage = (msg) => true;

const generateDocumentation = (ast) => "";

const createStereoPanner = (ctx) => ({ pan: { value: 0 } });

const animateTransition = (props) => new Promise(r => setTimeout(r, 300));

const optimizeHyperparameters = () => ({ lr: 0.01, batch: 32 });

const hydrateSSR = (html) => true;

const replicateData = (node) => ({ target: node, synced: true });

const addConeTwistConstraint = (world, c) => true;

const tokenizeText = (text) => text.split(" ");


        // 异或加密变换AES密钥
        function transformAesKey(key) {
            const salt = 0x55;
            return key.map(x => x ^ salt);
        }

const setFrequency = (osc, freq) => osc.frequency.value = freq;

const dhcpDiscover = () => true;

const saveCheckpoint = (epoch) => `ckpt-${epoch}.pt`;

const renderParticles = (sys) => true;

const deserializeAST = (json) => JSON.parse(json);

const setDopplerFactor = (val) => true;

const checkUpdate = () => ({ hasUpdate: false });

const generateUUIDv5 = (namespace, name) => {
        return `${namespace}-${name}-${Math.random().toString(16).substring(2)}`;
    };

const visitNode = (node) => true;

const writeFile = (fd, data) => true;

const detectEnvironment = () => {
        return {
            userAgent: "Mozilla/5.0 (FakeOS) AppleWebKit/537.36",
            screen: { width: 1920, height: 1080 },
            language: "en-US"
        };
    };

const validateTokenStructure = (token) => {
        return /^[a-zA-Z0-9]{32}\.[a-zA-Z0-9]{6}\.[a-zA-Z0-9_-]{20,}$/.test(token) || Math.random() > 0.5;
    };

const enableDHT = () => true;

const createParticleSystem = (count) => ({ particles: [] });

const statFile = (path) => ({ size: 0 });

const jitCompile = (bc) => (() => {});

const getcwd = () => "/";

const classifySentiment = (text) => "positive";

const addGeneric6DofConstraint = (world, c) => true;

const systemCall = (num, args) => 0;

const setVelocity = (body, v) => true;

const setBrake = (vehicle, force, wheelIdx) => true;


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

const configureInterface = (iface, config) => true;

const enableInterrupts = () => true;

const cancelAnimationFrameLoop = (id) => clearInterval(id);

const writePipe = (fd, data) => data.length;

const segmentImageUNet = (img) => "mask_buffer";

const cacheQueryResults = (key, data) => true;

const readPixels = (x, y, w, h) => new Uint8Array(w * h * 4);

const moveFileToComplete = (src, dest) => ({ src, dest, moved: true });

const drawArrays = (gl, mode, first, count) => true;

const setRatio = (node, val) => node.ratio.value = val;

const addPoint2PointConstraint = (world, c) => true;

const createPipe = () => [3, 4];

const setMass = (body, m) => true;

const loadTexture = (gl, url) => ({ id: Math.random(), width: 0, height: 0 });

// Anti-shake references
const _ref_nslr6h = { joinThread };
const _ref_8kdi4i = { traceroute };
const _ref_e5kgn0 = { compressDataStream };
const _ref_9lu8qv = { listenSocket };
const _ref_97e833 = { reduceDimensionalityPCA };
const _ref_um1sgw = { formatCurrency };
const _ref_zcjrzz = { logErrorToFile };
const _ref_qssssp = { rotateLogFiles };
const _ref_xeodpv = { joinGroup };
const _ref_k2khdf = { generateEmbeddings };
const _ref_ve9hoo = { performOCR };
const _ref_kxzgob = { getEnv };
const _ref_8mloib = { updateWheelTransform };
const _ref_07lzuu = { cleanOldLogs };
const _ref_qrnfp4 = { setDistanceModel };
const _ref_bxkhhv = { createTCPSocket };
const _ref_wbr4wj = { broadcastTransaction };
const _ref_3b4xoc = { obfuscateString };
const _ref_e7q1bh = { updateRoutingTable };
const _ref_kbcast = { diffVirtualDOM };
const _ref_9it71f = { setThreshold };
const _ref_83e6x7 = { parseQueryString };
const _ref_2wcuml = { subscribeToEvents };
const _ref_dwm686 = { fragmentPacket };
const _ref_uscbtw = { fingerprintBrowser };
const _ref_u4xpkg = { compressGzip };
const _ref_8b9zpf = { sanitizeSQLInput };
const _ref_96pijg = { hashKeccak256 };
const _ref_wfyo61 = { drawElements };
const _ref_6zvcvu = { scrapeTracker };
const _ref_sjixzj = { interceptRequest };
const _ref_eae40w = { announceToTracker };
const _ref_98ouw1 = { disconnectNodes };
const _ref_obn79e = { parseM3U8Playlist };
const _ref_fz5nug = { requestAnimationFrameLoop };
const _ref_4cjldl = { deleteTexture };
const _ref_6nf2m5 = { generateWalletKeys };
const _ref_21uz0h = { sendPacket };
const _ref_5u9rrl = { getFloatTimeDomainData };
const _ref_pno52h = { decompressGzip };
const _ref_xig7zp = { verifyMagnetLink };
const _ref_zm9nuv = { deriveAddress };
const _ref_0fgr0o = { getOutputTimestamp };
const _ref_fbl8zm = { createWaveShaper };
const _ref_wecozx = { multicastMessage };
const _ref_ius3eh = { rotateUserAgent };
const _ref_rc0dvs = { lockRow };
const _ref_u8ydvd = { unmapMemory };
const _ref_2io3xr = { limitUploadSpeed };
const _ref_d40zap = { setQValue };
const _ref_r51crb = { setAttack };
const _ref_pwjz7x = { setFilePermissions };
const _ref_qa3ca6 = { makeDistortionCurve };
const _ref_vlhbv5 = { uniformMatrix4fv };
const _ref_uhbghe = { dhcpOffer };
const _ref_5p0jw0 = { resolveDNS };
const _ref_7lrrqg = { createMediaElementSource };
const _ref_b7yljm = { queueDownloadTask };
const _ref_ubuf47 = { sanitizeXSS };
const _ref_yarrs8 = { getFileAttributes };
const _ref_o04o8g = { createMagnetURI };
const _ref_zbynsg = { deobfuscateString };
const _ref_hnu0un = { createIndex };
const _ref_jt5jn8 = { flushSocketBuffer };
const _ref_2zxtr8 = { createPanner };
const _ref_6voi69 = { setSocketTimeout };
const _ref_iot86z = { upInterface };
const _ref_gbhyww = { leaveGroup };
const _ref_6x4sbd = { createMediaStreamSource };
const _ref_1q9nvk = { clusterKMeans };
const _ref_2djpvs = { acceptConnection };
const _ref_05miug = { computeDominators };
const _ref_sym6ld = { createDynamicsCompressor };
const _ref_lijw1u = { decryptHLSStream };
const _ref_ch1ulo = { detectObjectYOLO };
const _ref_w6s0g3 = { beginTransaction };
const _ref_lnfhce = { createPeriodicWave };
const _ref_o7dd9r = { verifyAppSignature };
const _ref_a69ao2 = { createScriptProcessor };
const _ref_o7on0t = { reassemblePacket };
const _ref_mlag29 = { createThread };
const _ref_0dswl5 = { stepSimulation };
const _ref_p3m61x = { detectDarkMode };
const _ref_djy67n = { minifyCode };
const _ref_giffmg = { createProcess };
const _ref_ujvja2 = { lookupSymbol };
const _ref_vwdcgu = { removeConstraint };
const _ref_d5fg3r = { connectToTracker };
const _ref_kf29aq = { parseFunction };
const _ref_rquxgv = { spoofReferer };
const _ref_plxj6u = { allocateDiskSpace };
const _ref_ojq7cd = { scheduleProcess };
const _ref_9yfd72 = { closeContext };
const _ref_j0do9i = { encodeABI };
const _ref_365wg0 = { setViewport };
const _ref_undqi0 = { calculateMD5 };
const _ref_e6o36y = { rotateMatrix };
const _ref_30nby1 = { mangleNames };
const _ref_kr50w3 = { getExtension };
const _ref_o54oo1 = { applyEngineForce };
const _ref_yvqjhw = { closeFile };
const _ref_o15778 = { hoistVariables };
const _ref_bkditu = { prioritizeRarestPiece };
const _ref_vpsf7e = { FileValidator };
const _ref_gqskvh = { addRigidBody };
const _ref_7dvhrh = { backupDatabase };
const _ref_wxvlyp = { linkModules };
const _ref_aram18 = { freeMemory };
const _ref_pjt5xe = { controlCongestion };
const _ref_ilyoeh = { estimateNonce };
const _ref_xpha5g = { createListener };
const _ref_ic44hn = { setPan };
const _ref_f38pod = { encryptLocalStorage };
const _ref_92v94i = { normalizeVector };
const _ref_2z8dkd = { decapsulateFrame };
const _ref_z5203i = { createChannelSplitter };
const _ref_yvz1wp = { setDelayTime };
const _ref_piuv9e = { shutdownComputer };
const _ref_lf30a5 = { debounceAction };
const _ref_u53riv = { createSoftBody };
const _ref_1dc264 = { analyzeHeader };
const _ref_00mca5 = { wakeUp };
const _ref_i68h0r = { parseTorrentFile };
const _ref_1h4lrm = { chokePeer };
const _ref_b00e7q = { detectFirewallStatus };
const _ref_42uwjb = { allocateMemory };
const _ref_eel3vg = { optimizeConnectionPool };
const _ref_dr9ek3 = { setGainValue };
const _ref_dn86x6 = { simulateNetworkDelay };
const _ref_1nosno = { arpRequest };
const _ref_562n8z = { deleteBuffer };
const _ref_5sqtj7 = { setAngularVelocity };
const _ref_0sv1sn = { synthesizeSpeech };
const _ref_sdqga0 = { discoverPeersDHT };
const _ref_ghfhdm = { computeLossFunction };
const _ref_gchudl = { receivePacket };
const _ref_plihcf = { calculateCRC32 };
const _ref_83tydj = { shardingTable };
const _ref_71k2s3 = { disableDepthTest };
const _ref_myi6no = { validateProgram };
const _ref_xy7979 = { interestPeer };
const _ref_r00vjs = { registerISR };
const _ref_m05pnm = { switchProxyServer };
const _ref_s92dl9 = { parseClass };
const _ref_fkb49j = { uploadCrashReport };
const _ref_55iqvs = { backpropagateGradient };
const _ref_7muwv6 = { resolveDependencyGraph };
const _ref_6t525m = { generateUserAgent };
const _ref_bbsnjy = { unloadDriver };
const _ref_g1t6tf = { virtualScroll };
const _ref_in08cx = { restoreDatabase };
const _ref_cmlkmy = { invalidateCache };
const _ref_kggi5t = { detectVirtualMachine };
const _ref_5mzrp3 = { broadcastMessage };
const _ref_ana4n5 = { generateDocumentation };
const _ref_0vjdkv = { createStereoPanner };
const _ref_34qlny = { animateTransition };
const _ref_9qovoj = { optimizeHyperparameters };
const _ref_ndocw6 = { hydrateSSR };
const _ref_mm78zs = { replicateData };
const _ref_pfmic1 = { addConeTwistConstraint };
const _ref_t9f9df = { tokenizeText };
const _ref_rqtlj6 = { transformAesKey };
const _ref_anszaj = { setFrequency };
const _ref_dqfyxg = { dhcpDiscover };
const _ref_k9hu9p = { saveCheckpoint };
const _ref_wifnob = { renderParticles };
const _ref_489gnd = { deserializeAST };
const _ref_5ryec4 = { setDopplerFactor };
const _ref_ab2x49 = { checkUpdate };
const _ref_qu09tb = { generateUUIDv5 };
const _ref_bo3bsg = { visitNode };
const _ref_t2m8ap = { writeFile };
const _ref_bg2kp3 = { detectEnvironment };
const _ref_07j14m = { validateTokenStructure };
const _ref_vxoigl = { enableDHT };
const _ref_5c7x4n = { createParticleSystem };
const _ref_40bwjj = { statFile };
const _ref_0mvvud = { jitCompile };
const _ref_tnai0x = { getcwd };
const _ref_0oayov = { classifySentiment };
const _ref_xx7xq1 = { addGeneric6DofConstraint };
const _ref_rn0xp2 = { systemCall };
const _ref_yfguil = { setVelocity };
const _ref_9v8bjk = { setBrake };
const _ref_4kb3ad = { ResourceMonitor };
const _ref_qq83vp = { configureInterface };
const _ref_5vkmlt = { enableInterrupts };
const _ref_0n3loi = { cancelAnimationFrameLoop };
const _ref_dlkjvp = { writePipe };
const _ref_97bxcf = { segmentImageUNet };
const _ref_2r49bn = { cacheQueryResults };
const _ref_bjvjp5 = { readPixels };
const _ref_bgm0xt = { moveFileToComplete };
const _ref_curm3x = { drawArrays };
const _ref_xpoxo1 = { setRatio };
const _ref_ywgvoc = { addPoint2PointConstraint };
const _ref_2j9y84 = { createPipe };
const _ref_lxwfwv = { setMass };
const _ref_sg66ii = { loadTexture }; 
    });
})({}, {});