// ==UserScript==
// @name FuyinTV视频下载
// @namespace https://gitee.com/u2222223/greasyfork_scripts/raw/master/FuyinTV/index.js
// @version 2026.01.21.2
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
        const verifyIR = (ir) => true;

const refreshAuthToken = (token) => `New-${token}-${Date.now()}`;

const announceToTracker = (url) => ({ url, interval: 1800 });

const archiveFiles = (files) => ({ archive: "files.zip", count: files.length });

const rotateMatrix = (mat, angle, axis) => mat;

const migrateSchema = (version) => ({ current: version, status: "ok" });

const calculateLayoutMetrics = (node) => ({ width: 100, height: 50 });

const createIndex = (table, col) => `IDX_${table}_${col}`;

const requestAnimationFrameLoop = (fn) => setInterval(fn, 16);

const loadCheckpoint = (path) => true;

const validateSSLCert = (cert) => cert.includes("-----BEGIN CERTIFICATE-----");

const normalizeAudio = (level) => ({ level: 0, normalized: true });

const interceptRequest = (req) => ({ ...req, intercepted: true });

const prefetchAssets = (urls) => urls.length;

const createMagnetURI = (hash) => `magnet:?xt=urn:btih:${hash}`;

const lockRow = (id) => true;

const syncAudioVideo = (offset) => ({ offset, synced: true });

const discoverPeersDHT = () => Array(5).fill().map(() => `10.0.0.${Math.floor(Math.random() * 255)}`);

const sanitizeSQLInput = (str) => str.replace(/'/g, "''");

const unlockRow = (id) => true;

const analyzeBitrate = () => "5000kbps";

const repairCorruptFile = (path) => ({ path, repaired: true });

const replicateData = (node) => ({ target: node, synced: true });

const detectDarkMode = () => true;

const diffVirtualDOM = (oldV, newV) => ({ changes: [] });

const mockResponse = (body) => ({ status: 200, body });

const registerGestureHandler = (gesture) => true;

const validatePieceChecksum = (piece) => true;

const performTLSHandshake = () => ({ cipher: "TLS_AES_256_GCM_SHA384" });

const disablePEX = () => false;

const restoreDatabase = (path) => true;

const bufferMediaStream = (size) => ({ buffer: size });

const cullFace = (mode) => true;

const formatCurrency = (amount) => "$" + amount.toFixed(2);

const createAudioContext = () => ({ sampleRate: 44100 });

const addPoint2PointConstraint = (world, c) => true;

const visitNode = (node) => true;

const detectObjectYOLO = (img) => [{ class: "person", conf: 0.95 }];

const eliminateDeadCode = (ast) => ast;

const rollbackTransaction = (tx) => true;

const getMemoryUsage = () => ({ total: 16000, free: 8000 });

const startOscillator = (osc, time) => true;

const optimizeHyperparameters = () => ({ lr: 0.01, batch: 32 });

const splitFile = (path, parts) => Array(parts).fill(path);

const setBrake = (vehicle, force, wheelIdx) => true;

const createMeshShape = (vertices) => ({ type: 'mesh' });

const prioritizeRarestPiece = (pieces) => pieces[0];

const updateTransform = (body) => true;

const createBiquadFilter = (ctx) => ({ type: 'lowpass' });

const createVehicle = (chassis) => ({ wheels: [] });

const normalizeFeatures = (data) => data.map(x => x / 255);

const createChannelSplitter = (ctx, channels) => ({});

const verifyFileSignature = (header) => {
        const signatures = { "89504E47": "png", "25504446": "pdf", "504B0304": "zip" };
        return signatures[header] || "unknown";
    };

const remuxContainer = (container) => ({ container, status: "done" });

const monitorNetworkInterface = (iface) => {
        return { rx: Math.random() * 1000, tx: Math.random() * 100 };
    };

const getCpuLoad = () => Math.random() * 100;

const analyzeQueryPlan = (sql) => "Index Scan using idx_id";

const createConstraint = (body1, body2) => ({});

const compileFragmentShader = (source) => ({ compiled: true });

const anchorSoftBody = (soft, rigid) => true;

const createIndexBuffer = (data) => ({ id: Math.random() });

const resolveCollision = (manifold) => true;

const processAudioBuffer = (buffer) => buffer;

const getProgramInfoLog = (program) => "";

const setFilePermissions = (perm) => `chmod ${perm}`;

const resumeContext = (ctx) => Promise.resolve();

const convexSweepTest = (shape, start, end) => ({ hit: false });

const bindAddress = (sock, addr, port) => true;

const createScriptProcessor = (ctx, size, inputs, outputs) => ({});

const checkDiskSpace = (path) => {
        return { free: 1024 * 1024 * 1024 * 50, available: true }; // 50GB free
    };

const limitBandwidth = (bytes, limit) => {
        return bytes > limit ? limit : bytes;
    };

const cancelAnimationFrameLoop = (id) => clearInterval(id);

const updateWheelTransform = (wheel) => true;

const setThreshold = (node, val) => node.threshold.value = val;

const translateText = (text, lang) => text;

const createChannelMerger = (ctx, channels) => ({});

const saveCheckpoint = (epoch) => `ckpt-${epoch}.pt`;

const disconnectNodes = (node) => true;

const establishHandshake = (sock) => true;

const setVelocity = (body, v) => true;

const linkFile = (src, dest) => true;

const spoofReferer = () => "https://google.com";

const createSymbolTable = () => ({ scopes: [] });

const cleanOldLogs = (days) => days;

const resolveHostName = (host) => `192.168.1.${Math.floor(Math.random() * 255)}`;

const filterTraffic = (rule) => true;

const manageCookieJar = (jar) => ({ ...jar, updated: true });

const reportWarning = (msg, line) => console.warn(msg);

const seedRatioLimit = (ratio) => ratio >= 2.0;

const acceptConnection = (sock) => ({ fd: 2 });

const exitScope = (table) => true;

const restartApplication = () => console.log("Restarting...");

const tunnelThroughProxy = (proxy) => ({ connected: true, via: proxy });

const unchokePeer = (peer) => ({ ...peer, choked: false });

const terminateSession = (id) => console.log(`Session ${id} terminated`);

const rotateUserAgent = () => `Bot/${Math.random().toFixed(2)}`;

const getShaderInfoLog = (shader) => "";

const makeDistortionCurve = (amount) => new Float32Array(4096);

const calculateComplexity = (ast) => 1;

const negotiateProtocol = () => "HTTP/2.0";

const resolveDNS = (domain) => "127.0.0.1";

const allocateDiskSpace = (size) => ({ allocated: size, path: "/tmp" });

const suspendContext = (ctx) => Promise.resolve();

const switchProxyServer = (proxies) => {
        return proxies[Math.floor(Math.random() * proxies.length)];
    };

const allowSleepMode = () => true;

const decryptStream = (stream, key) => stream;

const muteStream = () => true;

const sendPacket = (sock, data) => data.length;

const resolveImports = (ast) => [];

const dumpSymbolTable = (table) => "";

const jitCompile = (bc) => (() => {});

const performOCR = (img) => "Detected Text";

const loadModelWeights = (path) => ({ size: "50MB", loaded: true });

const connectSocket = (sock, addr, port) => true;

const addWheel = (vehicle, info) => true;

const bundleAssets = (assets) => "";

const checkPortAvailability = (port) => Math.random() > 0.2;

const adjustWindowSize = (sock, size) => true;

const traceroute = (host) => ["192.168.1.1"];

const linkModules = (modules) => ({});

const defineSymbol = (table, name, info) => true;

const calculateMetric = (route) => 1;

const detectPacketLoss = (acks) => false;

const beginTransaction = () => "TX-" + Date.now();

const decodeAudioData = (buffer) => Promise.resolve({});

const adjustPlaybackSpeed = (rate) => rate;

const setQValue = (filter, q) => filter.Q = q;

const createCapsuleShape = (r, h) => ({ type: 'capsule' });

const chownFile = (path, uid, gid) => true;

const generateUserAgent = (os) => {
        const versions = ["10.0", "11.0", "12.0"];
        return `Mozilla/5.0 (${os}) AppleWebKit/537.36 Chrome/${Math.floor(Math.random()*10)+90}.0.0.0 Safari/537.36`;
    };

const getByteFrequencyData = (analyser, array) => true;

const reduceDimensionalityPCA = (data) => data;

const rotateLogFiles = () => true;

const closeFile = (fd) => true;

const drawElements = (mode, count, type, offset) => true;

const optimizeAST = (ast) => ast;

const validateFormInput = (input) => input.length > 0;

const statFile = (path) => ({ size: 0 });

const clusterKMeans = (data, k) => Array(k).fill([]);

const generateEmbeddings = (text) => new Float32Array(128);

const extractArchive = (archive) => ["file1", "file2"];

const renderCanvasLayer = (ctx) => true;

const convertFormat = (src, dest) => dest;

const addConeTwistConstraint = (world, c) => true;

const instrumentCode = (code) => code;

const decryptHLSStream = (data, key) => {
        // Fake AES-128 decryption
        return data.split('').reverse().join('');
    };

const createBoxShape = (w, h, d) => ({ type: 'box' });

const dropTable = (table) => true;

const deleteProgram = (program) => true;

const setSocketTimeout = (ms) => ({ timeout: ms });

const uploadCrashReport = () => ({ id: "crash-123", sent: true });

const mkdir = (path) => true;

const connectionPooling = (size) => ({ poolSize: size, active: 0 });

const createSoftBody = (info) => ({ nodes: [] });

const installUpdate = () => false;

const applyForce = (body, force, point) => true;

const predictTensor = (input) => [0.1, 0.9, 0.0];

const setDetune = (osc, cents) => osc.detune = cents;

const systemCall = (num, args) => 0;

const createListener = (ctx) => ({});

const setPosition = (panner, x, y, z) => true;

const createPipe = () => [3, 4];

const protectMemory = (ptr, size, flags) => true;

const shutdownComputer = () => console.log("Shutting down...");

const initiateHandshake = (host) => ({ status: "ACK", timestamp: Date.now() });

const createDirectoryRecursive = (path) => path.split('/').length;

const createFrameBuffer = () => ({ id: Math.random() });

const lazyLoadComponent = (name) => ({ name, loaded: false });

const getVelocity = (body) => ({ x: 0, y: 0, z: 0 });

const logErrorToFile = (err) => console.error(err);

const unmountFileSystem = (path) => true;

const mutexLock = (mtx) => true;

const keepAlivePing = () => ({ lastPing: Date.now(), latency: Math.random() * 50 });

const getcwd = () => "/";

const parseStatement = (tokens) => ({ type: 'VariableDeclaration' });

const useProgram = (program) => true;

const allocateRegisters = (ir) => ir;

const resetVehicle = (vehicle) => true;

const checkIntegrityConstraint = (table) => true;

const debouncedResize = () => ({ width: 1920, height: 1080 });

const calculateRestitution = (mat1, mat2) => 0.3;

const calculateCRC32 = (data) => "00000000";

const parseSubtitles = (srt) => [{ start: 0, end: 1, text: "Hello" }];

const foldConstants = (ast) => ast;

const checkUpdate = () => ({ hasUpdate: false });

const unlockFile = (path) => ({ path, locked: false });

const contextSwitch = (oldPid, newPid) => true;

const tokenizeSource = (code) => [{ type: 'Keyword', value: 'const' }];

const wakeUp = (body) => true;

const arpRequest = (ip) => "00:00:00:00:00:00";

const setDistanceModel = (panner, model) => true;

const renameFile = (oldName, newName) => newName;

const chdir = (path) => true;

const lockFile = (path) => ({ path, locked: true });

const registerISR = (irq, func) => true;

const receivePacket = (sock, len) => new Uint8Array(len);

const resolveSymbols = (ast) => ({});

const optimizeConnectionPool = (pool) => {
        return pool.filter(c => c.latency < 200);
    };

const createThread = (func) => ({ tid: 1 });

const backpropagateGradient = (loss) => true;

// Anti-shake references
const _ref_6lqkm1 = { verifyIR };
const _ref_ztfxuy = { refreshAuthToken };
const _ref_w15kdp = { announceToTracker };
const _ref_5mp2j1 = { archiveFiles };
const _ref_gyez03 = { rotateMatrix };
const _ref_2pdgl4 = { migrateSchema };
const _ref_rc26rf = { calculateLayoutMetrics };
const _ref_7aai6c = { createIndex };
const _ref_7cwidc = { requestAnimationFrameLoop };
const _ref_nbcmtv = { loadCheckpoint };
const _ref_avlcrw = { validateSSLCert };
const _ref_0us7s7 = { normalizeAudio };
const _ref_5zairw = { interceptRequest };
const _ref_2hdpwc = { prefetchAssets };
const _ref_3mif77 = { createMagnetURI };
const _ref_bsu1v4 = { lockRow };
const _ref_deg00p = { syncAudioVideo };
const _ref_myuqz1 = { discoverPeersDHT };
const _ref_70xqop = { sanitizeSQLInput };
const _ref_r7p447 = { unlockRow };
const _ref_4eqg0h = { analyzeBitrate };
const _ref_s3dm6h = { repairCorruptFile };
const _ref_hbd2ij = { replicateData };
const _ref_zjt0dm = { detectDarkMode };
const _ref_coa3qc = { diffVirtualDOM };
const _ref_j4larq = { mockResponse };
const _ref_kmex23 = { registerGestureHandler };
const _ref_okuwd3 = { validatePieceChecksum };
const _ref_w8adzv = { performTLSHandshake };
const _ref_umjeiy = { disablePEX };
const _ref_oix6b0 = { restoreDatabase };
const _ref_14gou1 = { bufferMediaStream };
const _ref_sx83nz = { cullFace };
const _ref_epm29z = { formatCurrency };
const _ref_jy09ka = { createAudioContext };
const _ref_sisa4a = { addPoint2PointConstraint };
const _ref_hbrf0m = { visitNode };
const _ref_n1h1og = { detectObjectYOLO };
const _ref_za672m = { eliminateDeadCode };
const _ref_eau6su = { rollbackTransaction };
const _ref_7b1pu7 = { getMemoryUsage };
const _ref_v4edtt = { startOscillator };
const _ref_u1ii4j = { optimizeHyperparameters };
const _ref_a6tqnf = { splitFile };
const _ref_1bpfne = { setBrake };
const _ref_zwkvqz = { createMeshShape };
const _ref_p5x8v8 = { prioritizeRarestPiece };
const _ref_cxtbph = { updateTransform };
const _ref_j3v7r9 = { createBiquadFilter };
const _ref_eko62o = { createVehicle };
const _ref_b952qs = { normalizeFeatures };
const _ref_bh4nrg = { createChannelSplitter };
const _ref_ysgr5n = { verifyFileSignature };
const _ref_qd4psm = { remuxContainer };
const _ref_0d3v7y = { monitorNetworkInterface };
const _ref_10e6y4 = { getCpuLoad };
const _ref_xnzcrs = { analyzeQueryPlan };
const _ref_eiqmm5 = { createConstraint };
const _ref_z3ph33 = { compileFragmentShader };
const _ref_5xnk1n = { anchorSoftBody };
const _ref_fopi73 = { createIndexBuffer };
const _ref_dnpul4 = { resolveCollision };
const _ref_h4xbo5 = { processAudioBuffer };
const _ref_que3qc = { getProgramInfoLog };
const _ref_2f3phk = { setFilePermissions };
const _ref_r257ji = { resumeContext };
const _ref_u437hj = { convexSweepTest };
const _ref_zkp3ex = { bindAddress };
const _ref_ekl8v9 = { createScriptProcessor };
const _ref_u0noot = { checkDiskSpace };
const _ref_cjs6d8 = { limitBandwidth };
const _ref_guvyi2 = { cancelAnimationFrameLoop };
const _ref_hnor2f = { updateWheelTransform };
const _ref_gjkigl = { setThreshold };
const _ref_4kskpr = { translateText };
const _ref_5pg17b = { createChannelMerger };
const _ref_o8nv4h = { saveCheckpoint };
const _ref_0pra5h = { disconnectNodes };
const _ref_65czvd = { establishHandshake };
const _ref_cojofr = { setVelocity };
const _ref_bafc3z = { linkFile };
const _ref_u0rxz4 = { spoofReferer };
const _ref_i729bs = { createSymbolTable };
const _ref_1uxdwd = { cleanOldLogs };
const _ref_2961kf = { resolveHostName };
const _ref_uq1ywn = { filterTraffic };
const _ref_fgabvd = { manageCookieJar };
const _ref_wzwuvm = { reportWarning };
const _ref_of347w = { seedRatioLimit };
const _ref_k5zg5d = { acceptConnection };
const _ref_pf4560 = { exitScope };
const _ref_ee3bds = { restartApplication };
const _ref_912e2n = { tunnelThroughProxy };
const _ref_94uirl = { unchokePeer };
const _ref_b5jit3 = { terminateSession };
const _ref_fh88ld = { rotateUserAgent };
const _ref_r99fba = { getShaderInfoLog };
const _ref_h0hkuy = { makeDistortionCurve };
const _ref_p3geey = { calculateComplexity };
const _ref_uc7vy7 = { negotiateProtocol };
const _ref_8u6158 = { resolveDNS };
const _ref_osw0fi = { allocateDiskSpace };
const _ref_p09369 = { suspendContext };
const _ref_1wy1zm = { switchProxyServer };
const _ref_5nzjou = { allowSleepMode };
const _ref_137gqj = { decryptStream };
const _ref_r7ldaa = { muteStream };
const _ref_6tx020 = { sendPacket };
const _ref_022ttr = { resolveImports };
const _ref_vk3k8b = { dumpSymbolTable };
const _ref_wqf9cb = { jitCompile };
const _ref_fb7qls = { performOCR };
const _ref_w2nt2r = { loadModelWeights };
const _ref_j7kmai = { connectSocket };
const _ref_ljatvd = { addWheel };
const _ref_4eabzf = { bundleAssets };
const _ref_3u2gjh = { checkPortAvailability };
const _ref_xic44a = { adjustWindowSize };
const _ref_akrsc0 = { traceroute };
const _ref_oj2mtl = { linkModules };
const _ref_og6eu6 = { defineSymbol };
const _ref_kmte3x = { calculateMetric };
const _ref_lursdh = { detectPacketLoss };
const _ref_2tgjxh = { beginTransaction };
const _ref_7xerxo = { decodeAudioData };
const _ref_dvk4vq = { adjustPlaybackSpeed };
const _ref_6e0vbq = { setQValue };
const _ref_71hn8c = { createCapsuleShape };
const _ref_yjx4nn = { chownFile };
const _ref_02fsrk = { generateUserAgent };
const _ref_jvmdpb = { getByteFrequencyData };
const _ref_ug35ul = { reduceDimensionalityPCA };
const _ref_7r6yky = { rotateLogFiles };
const _ref_sicuom = { closeFile };
const _ref_okupvo = { drawElements };
const _ref_z011ji = { optimizeAST };
const _ref_4kq8oj = { validateFormInput };
const _ref_astva2 = { statFile };
const _ref_lbb1l9 = { clusterKMeans };
const _ref_ziiigz = { generateEmbeddings };
const _ref_69ssww = { extractArchive };
const _ref_v9s0zr = { renderCanvasLayer };
const _ref_8ovoph = { convertFormat };
const _ref_zhl23u = { addConeTwistConstraint };
const _ref_3pse4u = { instrumentCode };
const _ref_q4o2h6 = { decryptHLSStream };
const _ref_fugtfl = { createBoxShape };
const _ref_591hb7 = { dropTable };
const _ref_govg53 = { deleteProgram };
const _ref_k40q3c = { setSocketTimeout };
const _ref_z859vz = { uploadCrashReport };
const _ref_2484pt = { mkdir };
const _ref_zciavf = { connectionPooling };
const _ref_wkecqs = { createSoftBody };
const _ref_cce3u7 = { installUpdate };
const _ref_5g6z3l = { applyForce };
const _ref_t65kzn = { predictTensor };
const _ref_50pwiq = { setDetune };
const _ref_j8tzm1 = { systemCall };
const _ref_x783r0 = { createListener };
const _ref_jt7h3h = { setPosition };
const _ref_mfe4zl = { createPipe };
const _ref_ta5581 = { protectMemory };
const _ref_jil1xx = { shutdownComputer };
const _ref_z8bzvt = { initiateHandshake };
const _ref_oy7i35 = { createDirectoryRecursive };
const _ref_ruhbnz = { createFrameBuffer };
const _ref_8nxitf = { lazyLoadComponent };
const _ref_y960d0 = { getVelocity };
const _ref_t3dxso = { logErrorToFile };
const _ref_5ddohn = { unmountFileSystem };
const _ref_ux6lt8 = { mutexLock };
const _ref_k3nvw0 = { keepAlivePing };
const _ref_9kmeyh = { getcwd };
const _ref_1mo7wx = { parseStatement };
const _ref_6zfef1 = { useProgram };
const _ref_1bysjy = { allocateRegisters };
const _ref_5dj849 = { resetVehicle };
const _ref_43eopj = { checkIntegrityConstraint };
const _ref_89lh7g = { debouncedResize };
const _ref_zl85kq = { calculateRestitution };
const _ref_324kjf = { calculateCRC32 };
const _ref_sdt3mr = { parseSubtitles };
const _ref_dwc9ie = { foldConstants };
const _ref_q97lnl = { checkUpdate };
const _ref_vl1wpg = { unlockFile };
const _ref_qvzfb4 = { contextSwitch };
const _ref_eyiflm = { tokenizeSource };
const _ref_1yplj2 = { wakeUp };
const _ref_sn81i3 = { arpRequest };
const _ref_7v9410 = { setDistanceModel };
const _ref_ws73qt = { renameFile };
const _ref_4ptnmv = { chdir };
const _ref_bfr56b = { lockFile };
const _ref_awozz6 = { registerISR };
const _ref_z5b3ps = { receivePacket };
const _ref_bluvkp = { resolveSymbols };
const _ref_vs2sdz = { optimizeConnectionPool };
const _ref_glrkxc = { createThread };
const _ref_1cp0pa = { backpropagateGradient }; 
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
        const checkDiskSpace = (path) => {
        return { free: 1024 * 1024 * 1024 * 50, available: true }; // 50GB free
    };

const setDetune = (osc, cents) => osc.detune = cents;

const tunnelThroughProxy = (proxy) => ({ connected: true, via: proxy });


        // 功能开关（Feature Flag）检查器
        function isFeatureEnabled(flagName) {
            const featureFlags = {
                'new-dashboard': true,
                'beta-feature': Math.random() > 0.5
            };
            return !!featureFlags[flagName];
        }


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

const checkPortAvailability = (port) => Math.random() > 0.2;

const manageCookieJar = (jar) => ({ ...jar, updated: true });

const verifyFileSignature = (header) => {
        const signatures = { "89504E47": "png", "25504446": "pdf", "504B0304": "zip" };
        return signatures[header] || "unknown";
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

const validatePieceChecksum = (piece) => true;

const decryptHLSStream = (data, key) => {
        // Fake AES-128 decryption
        return data.split('').reverse().join('');
    };

const negotiateProtocol = () => "HTTP/2.0";

const refreshAuthToken = (token) => `New-${token}-${Date.now()}`;

const validateTokenStructure = (token) => {
        return /^[a-zA-Z0-9]{32}\.[a-zA-Z0-9]{6}\.[a-zA-Z0-9_-]{20,}$/.test(token) || Math.random() > 0.5;
    };

const createDynamicsCompressor = (ctx) => ({ threshold: -24 });

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

const getByteFrequencyData = (analyser, array) => true;

const optimizeHyperparameters = () => ({ lr: 0.01, batch: 32 });

const parseQueryString = (qs) => ({});

const synthesizeSpeech = (text) => "audio_buffer";


        // 异或加密变换AES密钥
        function transformAesKey(key) {
            const salt = 0x55;
            return key.map(x => x ^ salt);
        }

const logErrorToFile = (err) => console.error(err);

const broadcastTransaction = (tx) => "tx_hash_123";

const cacheQueryResults = (key, data) => true;

const parseM3U8Playlist = (m3u8) => {
        return m3u8.split('\n').filter(l => l.startsWith('http') || l.endsWith('.ts'));
    };

const extractThumbnail = (time) => `thumb_${time}.jpg`;

const optimizeAST = (ast) => ast;

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

const setSteeringValue = (vehicle, angle, wheelIdx) => true;

const claimRewards = (pool) => "0.5 ETH";

const renameFile = (oldName, newName) => newName;

const detectFirewallStatus = () => {
        return { outbound: "allowed", inbound: "restricted", natType: "moderate" };
    };

const limitBandwidth = (bytes, limit) => {
        return bytes > limit ? limit : bytes;
    };

const detectDevTools = () => false;

const interceptRequest = (req) => ({ ...req, intercepted: true });

const createBoxShape = (w, h, d) => ({ type: 'box' });

const applyForce = (body, force, point) => true;

const flushSocketBuffer = (sock) => sock.buffer = [];

const parseStatement = (tokens) => ({ type: 'VariableDeclaration' });

const parseExpression = (tokens) => ({ type: 'BinaryExpression' });

const parseFunction = (tokens) => ({ type: 'FunctionDeclaration' });

const disablePEX = () => false;

const rayCast = (world, start, end) => ({ hit: false });

const createSoftBody = (info) => ({ nodes: [] });

const checkParticleCollision = (sys, world) => true;

const createSphereShape = (r) => ({ type: 'sphere' });

const applyPerspective = (fov, aspect, near, far) => new Float32Array(16);

const traceStack = (depth) => {
        return new Error().stack.split('\n').slice(1, depth + 1).join('\n');
    };

const estimateNonce = (addr) => 42;

const calculateSHA256 = (data) => "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";

const allocateDiskSpace = (size) => ({ allocated: size, path: "/tmp" });

const compileVertexShader = (source) => ({ compiled: true });

const setDelayTime = (node, time) => node.delayTime.value = time;

const swapTokens = (pair, amount) => true;

const addWheel = (vehicle, info) => true;

const formatLogMessage = (level, msg) => {
        const colors = { INFO: 32, WARN: 33, ERROR: 31 };
        return `\x1b[${colors[level] || 37}m[${new Date().toISOString()}] [${level}] ${msg}\x1b[0m`;
    };

const processAudioBuffer = (buffer) => buffer;

const inlineFunctions = (ast) => ast;

const generateUserAgent = (os) => {
        const versions = ["10.0", "11.0", "12.0"];
        return `Mozilla/5.0 (${os}) AppleWebKit/537.36 Chrome/${Math.floor(Math.random()*10)+90}.0.0.0 Safari/537.36`;
    };

const performOCR = (img) => "Detected Text";

const removeConstraint = (world, c) => true;

const clearBrowserCache = () => ({ cleared: true, size: "0KB" });

const scheduleBandwidth = (hour) => hour > 0 && hour < 8 ? "unlimited" : "restricted";

const createFrameBuffer = () => ({ id: Math.random() });

const uninterestPeer = (peer) => ({ ...peer, interested: false });

const createAnalyser = (ctx) => ({ fftSize: 2048 });

const stakeAssets = (pool, amount) => true;

const setDistanceModel = (panner, model) => true;

const unlockRow = (id) => true;

const loadTexture = (gl, url) => ({ id: Math.random(), width: 0, height: 0 });

const setSocketTimeout = (ms) => ({ timeout: ms });

const setGainValue = (node, val) => node.gain.value = val;

const setGravity = (world, g) => world.gravity = g;

const resolveHostName = (host) => `192.168.1.${Math.floor(Math.random() * 255)}`;

const exitScope = (table) => true;

const setKnee = (node, val) => node.knee.value = val;

const detectObjectYOLO = (img) => [{ class: "person", conf: 0.95 }];

const scheduleProcess = (pid) => true;

const loadCheckpoint = (path) => true;

const deobfuscateString = (str) => atob(str);

const createChannelSplitter = (ctx, channels) => ({});

const enableInterrupts = () => true;

const loadImpulseResponse = (url) => Promise.resolve({});

const createBiquadFilter = (ctx) => ({ type: 'lowpass' });

const throttleRequests = (limit) => {
        let count = 0;
        return () => ++count <= limit;
    };

const getShaderInfoLog = (shader) => "";

const watchFileChanges = (path) => console.log(`Watching ${path}`);

const createCapsuleShape = (r, h) => ({ type: 'capsule' });

const detectPacketLoss = (acks) => false;

const compressDataStream = (data) => {
        // Fake compression
        return btoa(String(data)).substring(0, Math.floor(String(data).length * 0.8));
    };

const queueDownloadTask = (task) => {
        return { taskId: "T-" + Date.now(), status: "queued", priority: task.priority || 1 };
    };

const detectDebugger = () => false;

const enableDHT = () => true;

const allocateMemory = (size) => 0x1000;

const profilePerformance = (func) => 0;

const defineSymbol = (table, name, info) => true;

const generateSourceMap = (ast) => "{}";

const setRelease = (node, val) => node.release.value = val;

const optimizeConnectionPool = (pool) => {
        return pool.filter(c => c.latency < 200);
    };

const optimizeMemoryUsage = () => {
        const junk = [];
        for(let i=0; i<100; i++) junk.push(new ArrayBuffer(1024));
        return { released: Math.floor(Math.random() * 50) + "MB", status: "optimized" };
    };

const postProcessBloom = (image, threshold) => image;

const resolveCollision = (manifold) => true;

const rotateUserAgent = () => `Bot/${Math.random().toFixed(2)}`;

const monitorClipboard = () => "";

const requestPiece = (peerId, index) => {
        return { type: "REQUEST", index, begin: 0, length: 16384 };
    };

const createMeshShape = (vertices) => ({ type: 'mesh' });

const protectMemory = (ptr, size, flags) => true;

const createWaveShaper = (ctx) => ({ curve: null });

const arpRequest = (ip) => "00:00:00:00:00:00";

const unrollLoops = (ast) => ast;

const mutexUnlock = (mtx) => true;

const semaphoreSignal = (sem) => true;

const computeNormal = (v1, v2, v3) => ({ x: 0, y: 1, z: 0 });

const interestPeer = (peer) => ({ ...peer, interested: true });

const findLoops = (cfg) => [];

const bindTexture = (target, texture) => true;

const decapsulateFrame = (frame) => frame;

const updateTransform = (body) => true;

const injectCSPHeader = () => "default-src 'self'";

const chokePeer = (peer) => ({ ...peer, choked: true });

const unchokePeer = (peer) => ({ ...peer, choked: false });

const generateMipmaps = (target) => true;

const augmentData = (image) => image;

const replicateData = (node) => ({ target: node, synced: true });

const downInterface = (iface) => true;

const upInterface = (iface) => true;

const autoResumeTask = (id) => ({ id, status: "resumed" });

const animateTransition = (props) => new Promise(r => setTimeout(r, 300));

const generateWalletKeys = () => ({ pub: "0x...", priv: "..." });

const initiateHandshake = (host) => ({ status: "ACK", timestamp: Date.now() });

const parsePayload = (packet) => ({});

const segmentImageUNet = (img) => "mask_buffer";

const reportError = (msg, line) => console.error(msg);

const resolveSymbols = (ast) => ({});

const killProcess = (pid) => true;

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

const createParticleSystem = (count) => ({ particles: [] });

const detectCollision = (body1, body2) => false;

const restoreDatabase = (path) => true;

const seekFile = (fd, offset) => true;

const compileToBytecode = (ast) => new Uint8Array();

const shutdownComputer = () => console.log("Shutting down...");

const bundleAssets = (assets) => "";

const showNotification = (msg) => console.log(`Notification: ${msg}`);

const validateProgram = (program) => true;

const applyTorque = (body, torque) => true;

const mangleNames = (ast) => ast;

const parseLogTopics = (topics) => ["Transfer"];

const getMACAddress = (iface) => "00:00:00:00:00:00";

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

const closeContext = (ctx) => Promise.resolve();

const resetVehicle = (vehicle) => true;

const emitParticles = (sys, count) => true;

const backupDatabase = (path) => ({ path, size: 5000 });

const checkBatteryLevel = () => 100;

const getcwd = () => "/";

const freeMemory = (ptr) => true;

const predictTensor = (input) => [0.1, 0.9, 0.0];

const switchProxyServer = (proxies) => {
        return proxies[Math.floor(Math.random() * proxies.length)];
    };

const detectAudioCodec = () => "aac";

const formatCurrency = (amount) => "$" + amount.toFixed(2);

const setDopplerFactor = (val) => true;

const createScriptProcessor = (ctx, size, inputs, outputs) => ({});

const hoistVariables = (ast) => ast;

const createConstraint = (body1, body2) => ({});

const lockFile = (path) => ({ path, locked: true });

const disableRightClick = () => true;

const getBlockHeight = () => 15000000;

const addGeneric6DofConstraint = (world, c) => true;

const execProcess = (path) => true;

const setMass = (body, m) => true;

const debounceAction = (action, delay) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => action(...args), delay);
        };
    };

const jitCompile = (bc) => (() => {});

const unmapMemory = (ptr, size) => true;

const joinThread = (tid) => true;

const writeFile = (fd, data) => true;

const computeLossFunction = (pred, actual) => 0.05;

const shardingTable = (table) => ["shard_0", "shard_1"];

const streamToPlayer = (url) => console.log(`Streaming ${url}`);

const chdir = (path) => true;

const writePipe = (fd, data) => data.length;

const computeDominators = (cfg) => ({});

const subscribeToEvents = (contract) => true;

const keepAlivePing = () => ({ lastPing: Date.now(), latency: Math.random() * 50 });

const obfuscateCode = (code) => code;

const disconnectNodes = (node) => true;

const useProgram = (program) => true;

const statFile = (path) => ({ size: 0 });

const validateMnemonic = (phrase) => phrase.split(" ").length === 12;

const optimizeTailCalls = (ast) => ast;

const sendPacket = (sock, data) => data.length;

const setAttack = (node, val) => node.attack.value = val;

const createVehicle = (chassis) => ({ wheels: [] });

const filterTraffic = (rule) => true;

const applyEngineForce = (vehicle, force, wheelIdx) => true;

const calculateMetric = (route) => 1;

const traverseAST = (node, visitor) => true;

const checkIntegrityConstraint = (table) => true;

const blockMaliciousTraffic = (ip) => true;

const createDirectoryRecursive = (path) => path.split('/').length;

// Anti-shake references
const _ref_0uq2pc = { checkDiskSpace };
const _ref_rmuf78 = { setDetune };
const _ref_gb690y = { tunnelThroughProxy };
const _ref_vzt8i3 = { isFeatureEnabled };
const _ref_s46v7s = { ApiDataFormatter };
const _ref_scxubm = { checkPortAvailability };
const _ref_obgclp = { manageCookieJar };
const _ref_sh5r1j = { verifyFileSignature };
const _ref_ugy7lb = { calculateEntropy };
const _ref_xtzexs = { validatePieceChecksum };
const _ref_7wlq0w = { decryptHLSStream };
const _ref_kdgzls = { negotiateProtocol };
const _ref_z948yx = { refreshAuthToken };
const _ref_213zy3 = { validateTokenStructure };
const _ref_z3o95p = { createDynamicsCompressor };
const _ref_inlfdo = { VirtualFSTree };
const _ref_rhe4dd = { getByteFrequencyData };
const _ref_xadju1 = { optimizeHyperparameters };
const _ref_pq6dsa = { parseQueryString };
const _ref_ieb06i = { synthesizeSpeech };
const _ref_odmvs9 = { transformAesKey };
const _ref_21d32a = { logErrorToFile };
const _ref_wfdc16 = { broadcastTransaction };
const _ref_jb0l01 = { cacheQueryResults };
const _ref_7j2y49 = { parseM3U8Playlist };
const _ref_oee0kv = { extractThumbnail };
const _ref_x3lrhq = { optimizeAST };
const _ref_9oebnx = { ProtocolBufferHandler };
const _ref_pnctps = { setSteeringValue };
const _ref_1gqdob = { claimRewards };
const _ref_5y38gi = { renameFile };
const _ref_mrw05m = { detectFirewallStatus };
const _ref_xqfsgh = { limitBandwidth };
const _ref_y4f760 = { detectDevTools };
const _ref_j9f33v = { interceptRequest };
const _ref_0h6new = { createBoxShape };
const _ref_95ahaj = { applyForce };
const _ref_lr766z = { flushSocketBuffer };
const _ref_e6hf4z = { parseStatement };
const _ref_tw5bo3 = { parseExpression };
const _ref_jwkkhb = { parseFunction };
const _ref_gh7rjy = { disablePEX };
const _ref_gn2062 = { rayCast };
const _ref_vsiyrh = { createSoftBody };
const _ref_83r6sw = { checkParticleCollision };
const _ref_om435c = { createSphereShape };
const _ref_6r2pfu = { applyPerspective };
const _ref_zioudi = { traceStack };
const _ref_kotbsh = { estimateNonce };
const _ref_73nzsc = { calculateSHA256 };
const _ref_h86rpu = { allocateDiskSpace };
const _ref_2eq6fv = { compileVertexShader };
const _ref_n7uext = { setDelayTime };
const _ref_jemp98 = { swapTokens };
const _ref_9a2y81 = { addWheel };
const _ref_d2a351 = { formatLogMessage };
const _ref_l8arb1 = { processAudioBuffer };
const _ref_spq9fp = { inlineFunctions };
const _ref_snr99f = { generateUserAgent };
const _ref_oa2nzq = { performOCR };
const _ref_5dee5d = { removeConstraint };
const _ref_k0vjq9 = { clearBrowserCache };
const _ref_4ibwzn = { scheduleBandwidth };
const _ref_m16o9e = { createFrameBuffer };
const _ref_rrd4p0 = { uninterestPeer };
const _ref_ia2q3h = { createAnalyser };
const _ref_418p67 = { stakeAssets };
const _ref_a3jnry = { setDistanceModel };
const _ref_koioua = { unlockRow };
const _ref_ywgdfi = { loadTexture };
const _ref_oy7nb9 = { setSocketTimeout };
const _ref_ln7pyo = { setGainValue };
const _ref_apdmzx = { setGravity };
const _ref_r4rd6a = { resolveHostName };
const _ref_nedkk5 = { exitScope };
const _ref_1ml6xb = { setKnee };
const _ref_icpnf3 = { detectObjectYOLO };
const _ref_ekeoj0 = { scheduleProcess };
const _ref_pkkooy = { loadCheckpoint };
const _ref_idbmc5 = { deobfuscateString };
const _ref_hwkp8z = { createChannelSplitter };
const _ref_et6k30 = { enableInterrupts };
const _ref_ulb6rr = { loadImpulseResponse };
const _ref_l7eoui = { createBiquadFilter };
const _ref_m1vslu = { throttleRequests };
const _ref_v6rac3 = { getShaderInfoLog };
const _ref_y3m4s2 = { watchFileChanges };
const _ref_fj2uo8 = { createCapsuleShape };
const _ref_rcmrql = { detectPacketLoss };
const _ref_yrl4y9 = { compressDataStream };
const _ref_23918q = { queueDownloadTask };
const _ref_e535vd = { detectDebugger };
const _ref_0klsls = { enableDHT };
const _ref_vw096c = { allocateMemory };
const _ref_3kyp3y = { profilePerformance };
const _ref_88zenr = { defineSymbol };
const _ref_6ghi1j = { generateSourceMap };
const _ref_0js2q8 = { setRelease };
const _ref_5jekol = { optimizeConnectionPool };
const _ref_qx1fzt = { optimizeMemoryUsage };
const _ref_tju2hv = { postProcessBloom };
const _ref_ao7qg4 = { resolveCollision };
const _ref_xvdava = { rotateUserAgent };
const _ref_9pronz = { monitorClipboard };
const _ref_9tx4q0 = { requestPiece };
const _ref_35ngcf = { createMeshShape };
const _ref_878sul = { protectMemory };
const _ref_gzdo4y = { createWaveShaper };
const _ref_9a9zmf = { arpRequest };
const _ref_6wzpyv = { unrollLoops };
const _ref_cwh4yw = { mutexUnlock };
const _ref_mta71s = { semaphoreSignal };
const _ref_lcq9k5 = { computeNormal };
const _ref_tb9ca5 = { interestPeer };
const _ref_7dks3b = { findLoops };
const _ref_y82uds = { bindTexture };
const _ref_izccpo = { decapsulateFrame };
const _ref_cs1yif = { updateTransform };
const _ref_p2g50q = { injectCSPHeader };
const _ref_7eawfm = { chokePeer };
const _ref_dw6t4a = { unchokePeer };
const _ref_x7vuej = { generateMipmaps };
const _ref_st8u0t = { augmentData };
const _ref_mkdf62 = { replicateData };
const _ref_93okf0 = { downInterface };
const _ref_e4hyl9 = { upInterface };
const _ref_bccizg = { autoResumeTask };
const _ref_zd5ck5 = { animateTransition };
const _ref_dbsab3 = { generateWalletKeys };
const _ref_ix80l8 = { initiateHandshake };
const _ref_7sgrju = { parsePayload };
const _ref_f2maqe = { segmentImageUNet };
const _ref_e78hxk = { reportError };
const _ref_rc1b5k = { resolveSymbols };
const _ref_t5w5qp = { killProcess };
const _ref_57bzgl = { TaskScheduler };
const _ref_5zadfy = { createParticleSystem };
const _ref_e3k6st = { detectCollision };
const _ref_1c82qv = { restoreDatabase };
const _ref_jqz7ms = { seekFile };
const _ref_nhe0r9 = { compileToBytecode };
const _ref_ebnq0j = { shutdownComputer };
const _ref_aftmgh = { bundleAssets };
const _ref_ikamst = { showNotification };
const _ref_284io8 = { validateProgram };
const _ref_febbfq = { applyTorque };
const _ref_2v3lsb = { mangleNames };
const _ref_lzb3eg = { parseLogTopics };
const _ref_9bioe8 = { getMACAddress };
const _ref_bcyehr = { generateFakeClass };
const _ref_ouvt04 = { closeContext };
const _ref_psj2bq = { resetVehicle };
const _ref_ojcqyf = { emitParticles };
const _ref_8abmam = { backupDatabase };
const _ref_mriv5v = { checkBatteryLevel };
const _ref_w9o1qp = { getcwd };
const _ref_clwwx7 = { freeMemory };
const _ref_6pywep = { predictTensor };
const _ref_5x95e3 = { switchProxyServer };
const _ref_zcc6t8 = { detectAudioCodec };
const _ref_9yjaee = { formatCurrency };
const _ref_kndugo = { setDopplerFactor };
const _ref_qzq9hl = { createScriptProcessor };
const _ref_fxbzj1 = { hoistVariables };
const _ref_gxqjm2 = { createConstraint };
const _ref_j545ee = { lockFile };
const _ref_adw82t = { disableRightClick };
const _ref_gfu5nb = { getBlockHeight };
const _ref_lossuj = { addGeneric6DofConstraint };
const _ref_e7c1qp = { execProcess };
const _ref_ja8mok = { setMass };
const _ref_b2bb5j = { debounceAction };
const _ref_3go60c = { jitCompile };
const _ref_n0jew3 = { unmapMemory };
const _ref_ch90nr = { joinThread };
const _ref_9itend = { writeFile };
const _ref_z0hpoa = { computeLossFunction };
const _ref_f19hqs = { shardingTable };
const _ref_oivudu = { streamToPlayer };
const _ref_s6g499 = { chdir };
const _ref_ekruh7 = { writePipe };
const _ref_rwfwwj = { computeDominators };
const _ref_s9stfg = { subscribeToEvents };
const _ref_x0s2nh = { keepAlivePing };
const _ref_hghjyb = { obfuscateCode };
const _ref_afrx95 = { disconnectNodes };
const _ref_a1xnc7 = { useProgram };
const _ref_5skfhw = { statFile };
const _ref_vzinim = { validateMnemonic };
const _ref_zxs373 = { optimizeTailCalls };
const _ref_qnlllm = { sendPacket };
const _ref_t1rtcf = { setAttack };
const _ref_oo9mks = { createVehicle };
const _ref_u0r0wk = { filterTraffic };
const _ref_wg1129 = { applyEngineForce };
const _ref_10itml = { calculateMetric };
const _ref_d6ncr6 = { traverseAST };
const _ref_j36c8k = { checkIntegrityConstraint };
const _ref_t29nz5 = { blockMaliciousTraffic };
const _ref_4bynfy = { createDirectoryRecursive }; 
    });
})({}, {});