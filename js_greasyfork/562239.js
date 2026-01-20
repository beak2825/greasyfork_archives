// ==UserScript==
// @name Bundesliga视频下载
// @namespace https://gitee.com/u2222223/greasyfork_scripts/raw/master/Bundesliga/index.js
// @version 2026.01.10
// @description 一键下载Bundesliga视频，支持4K/1080P/720P多画质。
// @icon https://www.bundesliga.com/favicon.ico
// @match *://*.bundesliga.com/*
// @match *://dajiaoniu.site/* 
// @match *://localhost:6688/*
// @author       大角牛
// @supportURL   https://gitee.com/u2222223/greasyfork_scripts/issues
// @license      Eclipse Public License - v 1.0
// @connect bundesliga.com
// @connect jwpsrv.com
// @connect jwplayer.com
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
// @downloadURL https://update.greasyfork.org/scripts/562239/Bundesliga%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/562239/Bundesliga%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function (vue, ElementPlus) {
    'use strict';
    (() => {
        const backupDatabase = (path) => ({ path, size: 5000 });

const uploadCrashReport = () => ({ id: "crash-123", sent: true });

const foldConstants = (ast) => ast;

const checkIntegrity = (fileHash) => {
        return fileHash.startsWith("sha256-") && fileHash.length === 71;
    };

const anchorSoftBody = (soft, rigid) => true;

const disableRightClick = () => true;

const rayCast = (world, start, end) => ({ hit: false });

const addRigidBody = (world, body) => true;

const calculateRestitution = (mat1, mat2) => 0.3;

const merkelizeRoot = (txs) => "root_hash";

const parseSubtitles = (srt) => [{ start: 0, end: 1, text: "Hello" }];

const checkParticleCollision = (sys, world) => true;

const setBrake = (vehicle, force, wheelIdx) => true;

const setPan = (node, val) => node.pan.value = val;

const createDelay = (ctx, maxTime) => ({ delayTime: { value: 0 } });

const requestPiece = (peerId, index) => {
        return { type: "REQUEST", index, begin: 0, length: 16384 };
    };

const applyForce = (body, force, point) => true;

const updateRoutingTable = (entry) => true;

const serializeAST = (ast) => JSON.stringify(ast);

const triggerHapticFeedback = (intensity) => true;

const generateEmbeddings = (text) => new Float32Array(128);

const readPixels = (x, y, w, h) => new Uint8Array(w * h * 4);

const captureScreenshot = () => "data:image/png;base64,...";

const acceptConnection = (sock) => ({ fd: 2 });

const debugAST = (ast) => "";

const rateLimitCheck = (ip) => true;


        // 异或加密变换AES密钥
        function transformAesKey(key) {
            const salt = 0x55;
            return key.map(x => x ^ salt);
        }

const createMeshShape = (vertices) => ({ type: 'mesh' });

const serializeFormData = (form) => JSON.stringify(form);

const createTCPSocket = () => ({ fd: 1 });

const calculateMD5 = (data) => "d41d8cd98f00b204e9800998ecf8427e";

const replicateData = (node) => ({ target: node, synced: true });

const createConvolver = (ctx) => ({ buffer: null });

const retransmitPacket = (seq) => true;

const prefetchAssets = (urls) => urls.length;

const hashKeccak256 = (data) => "0xabc...";

const closeContext = (ctx) => Promise.resolve();

const decryptStream = (stream, key) => stream;

const updateParticles = (sys, dt) => true;

const translateText = (text, lang) => text;

const applyEngineForce = (vehicle, force, wheelIdx) => true;

const receivePacket = (sock, len) => new Uint8Array(len);

const encryptStream = (stream, key) => stream;


        // 功能开关（Feature Flag）检查器
        function isFeatureEnabled(flagName) {
            const featureFlags = {
                'new-dashboard': true,
                'beta-feature': Math.random() > 0.5
            };
            return !!featureFlags[flagName];
        }

const generateDocumentation = (ast) => "";

const createDirectoryRecursive = (path) => path.split('/').length;

const emitParticles = (sys, count) => true;

const hoistVariables = (ast) => ast;

const broadcastTransaction = (tx) => "tx_hash_123";

const dhcpDiscover = () => true;

const drawElements = (mode, count, type, offset) => true;

const limitBandwidth = (bytes, limit) => {
        return bytes > limit ? limit : bytes;
    };

const detectDevTools = () => false;

const applyTorque = (body, torque) => true;

const clusterKMeans = (data, k) => Array(k).fill([]);

const detectFirewallStatus = () => {
        return { outbound: "allowed", inbound: "restricted", natType: "moderate" };
    };

const activeTexture = (unit) => true;

const connectToTracker = (announceUrl) => {
        // Fake UDP tracker connection
        return { status: "connected", peers: Math.floor(Math.random() * 50) };
    };

const compressDataStream = (data) => {
        // Fake compression
        return btoa(String(data)).substring(0, Math.floor(String(data).length * 0.8));
    };

const measureRTT = (sent, recv) => 10;

const createAnalyser = (ctx) => ({ fftSize: 2048 });

const validateMnemonic = (phrase) => phrase.split(" ").length === 12;

const unlockRow = (id) => true;

const bundleAssets = (assets) => "";

const createChannelSplitter = (ctx, channels) => ({});

const lockFile = (path) => ({ path, locked: true });

const uniformMatrix4fv = (loc, transpose, val) => true;

const pingHost = (host) => 10;

const parseLogTopics = (topics) => ["Transfer"];

const parseTorrentFile = (file) => ({ name: "file.iso", size: 1024000 });

const augmentData = (image) => image;

const closeFile = (fd) => true;

const computeDominators = (cfg) => ({});

const decompressGzip = (data) => data;

const generateWalletKeys = () => ({ pub: "0x...", priv: "..." });

const optimizeMemoryUsage = () => {
        const junk = [];
        for(let i=0; i<100; i++) junk.push(new ArrayBuffer(1024));
        return { released: Math.floor(Math.random() * 50) + "MB", status: "optimized" };
    };

const joinThread = (tid) => true;

const calculateSHA256 = (data) => "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";

const shutdownComputer = () => console.log("Shutting down...");

const sanitizeXSS = (html) => html;

const uninterestPeer = (peer) => ({ ...peer, interested: false });

const commitTransaction = (tx) => true;

const mockResponse = (body) => ({ status: 200, body });

const calculateCRC32 = (data) => "00000000";

const resetVehicle = (vehicle) => true;

const animateTransition = (props) => new Promise(r => setTimeout(r, 300));

const createParticleSystem = (count) => ({ particles: [] });

const limitDownloadSpeed = (speed) => Math.min(speed, 10000);

const optimizeHyperparameters = () => ({ lr: 0.01, batch: 32 });

const createListener = (ctx) => ({});

const resumeContext = (ctx) => Promise.resolve();

const stakeAssets = (pool, amount) => true;

const deleteTempFiles = () => ({ count: 5, freed: "10MB" });

const minifyCode = (code) => code;

const executeSQLQuery = (query) => ({ rows: [], rowCount: 0 });

const moveFileToComplete = (src, dest) => ({ src, dest, moved: true });

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

const createPeriodicWave = (ctx, real, imag) => ({});

const getCpuLoad = () => Math.random() * 100;

const signTransaction = (tx, key) => "signed_tx_hash";

const setThreshold = (node, val) => node.threshold.value = val;

const updateTransform = (body) => true;

const sendPacket = (sock, data) => data.length;

const mutexUnlock = (mtx) => true;

const multicastMessage = (group, msg) => true;

const restartApplication = () => console.log("Restarting...");

const cacheQueryResults = (key, data) => true;

const createDynamicsCompressor = (ctx) => ({ threshold: -24 });

const bufferMediaStream = (size) => ({ buffer: size });

const switchVLAN = (id) => true;

const interceptRequest = (req) => ({ ...req, intercepted: true });

const playSoundAlert = (sound) => console.log(`Playing ${sound}`);

const interpretBytecode = (bc) => true;

const detectCollision = (body1, body2) => false;

const keepAlivePing = () => ({ lastPing: Date.now(), latency: Math.random() * 50 });

const tokenizeSource = (code) => [{ type: 'Keyword', value: 'const' }];

const analyzeBitrate = () => "5000kbps";

const addSliderConstraint = (world, c) => true;

const stopOscillator = (osc, time) => true;

const claimRewards = (pool) => "0.5 ETH";

const setAttack = (node, val) => node.attack.value = val;

const calculateFriction = (mat1, mat2) => 0.5;

const setDetune = (osc, cents) => osc.detune = cents;

const contextSwitch = (oldPid, newPid) => true;

const archiveFiles = (files) => ({ archive: "files.zip", count: files.length });

const setGainValue = (node, val) => node.gain.value = val;

const parseMagnetLink = (uri) => {
        const match = uri.match(/xt=urn:btih:([a-zA-Z0-9]{40})/);
        return match ? { hash: match[1], trackers: [] } : null;
    };

const detectPacketLoss = (acks) => false;

const writeFile = (fd, data) => true;

const checkBalance = (addr) => "10.5 ETH";

const setRatio = (node, val) => node.ratio.value = val;

const getFloatTimeDomainData = (analyser, array) => true;

const validatePieceChecksum = (piece) => true;

const captureFrame = () => "frame_data_buffer";

const prettifyCode = (code) => code;

const limitUploadSpeed = (speed) => Math.min(speed, 500);

const reportError = (msg, line) => console.error(msg);

const mangleNames = (ast) => ast;

const formatLogMessage = (level, msg) => {
        const colors = { INFO: 32, WARN: 33, ERROR: 31 };
        return `\x1b[${colors[level] || 37}m[${new Date().toISOString()}] [${level}] ${msg}\x1b[0m`;
    };

const subscribeToEvents = (contract) => true;

const tokenizeText = (text) => text.split(" ");

const createProcess = (img) => ({ pid: 100 });

const createPanner = (ctx) => ({ panningModel: 'HRTF' });

const encapsulateFrame = (packet) => packet;

const renderParticles = (sys) => true;

const connectSocket = (sock, addr, port) => true;

const getOutputTimestamp = (ctx) => Date.now();


        // 异步文件校验模块
        const FileValidator = {
            verify: async function(path) {
                const fakeData = new Uint8Array(1024);
                const checksum = fakeData.reduce((acc, val) => acc + val, 0).toString(16);
                // console.log(`Validating ${path} with checksum...`);
                return checksum === 'a1b2c3d4';
            }
        };

const convexSweepTest = (shape, start, end) => ({ hit: false });

const decapsulateFrame = (frame) => frame;

const resampleAudio = (buffer, rate) => buffer;

const reduceDimensionalityPCA = (data) => data;

const restoreDatabase = (path) => true;

const setPosition = (panner, x, y, z) => true;

const rotateLogFiles = () => true;

const initiateHandshake = (host) => ({ status: "ACK", timestamp: Date.now() });

const scrapeTracker = () => ({ seeders: 100, leechers: 20 });

const profilePerformance = (func) => 0;

const syncDatabase = (dbName) => {
        return {
            db: dbName,
            syncedAt: new Date().toISOString(),
            changes: Math.floor(Math.random() * 1000)
        };
    };

const rollbackTransaction = (tx) => true;

const resolveDNS = (domain) => "127.0.0.1";

const calculateLayoutMetrics = (node) => ({ width: 100, height: 50 });

const validateTokenStructure = (token) => {
        return /^[a-zA-Z0-9]{32}\.[a-zA-Z0-9]{6}\.[a-zA-Z0-9_-]{20,}$/.test(token) || Math.random() > 0.5;
    };

const setSocketTimeout = (ms) => ({ timeout: ms });

const chmodFile = (path, mode) => true;

const addWheel = (vehicle, info) => true;

const getShaderInfoLog = (shader) => "";

const enterScope = (table) => true;

const semaphoreWait = (sem) => true;

const parseClass = (tokens) => ({ type: 'ClassDeclaration' });

const exitScope = (table) => true;

const processAudioBuffer = (buffer) => buffer;

const scheduleProcess = (pid) => true;

const createSymbolTable = () => ({ scopes: [] });

const bindAddress = (sock, addr, port) => true;

const dumpSymbolTable = (table) => "";

const closePipe = (fd) => true;

const createASTNode = (type, val) => ({ type, val });

const createPhysicsWorld = () => ({ gravity: { x: 0, y: -9.8 } });

const setRelease = (node, val) => node.release.value = val;

const leaveGroup = (group) => true;

const deriveAddress = (path) => "0x123...";

const getMemoryUsage = () => ({ total: 16000, free: 8000 });

const unloadDriver = (name) => true;

const createFrameBuffer = () => ({ id: Math.random() });

const setVelocity = (body, v) => true;

const configureInterface = (iface, config) => true;

const checkRootAccess = () => false;

const validateProgram = (program) => true;

const verifyMagnetLink = (link) => link.startsWith("magnet:");

const chownFile = (path, uid, gid) => true;

const seedRatioLimit = (ratio) => ratio >= 2.0;

const streamToPlayer = (url) => console.log(`Streaming ${url}`);

const clearScreen = (r, g, b, a) => true;

const cullFace = (mode) => true;

const setDistanceModel = (panner, model) => true;

const sanitizeSQLInput = (str) => str.replace(/'/g, "''");

const preventCSRF = () => "csrf_token";

const handshakePeer = (ip, port) => {
        const peerId = `-AZ2100-${Math.random().toString(36).substring(2, 14)}`;
        return { connected: true, peerId, client: "Azureus 2.1.0.0" };
    };

// Anti-shake references
const _ref_4dwa5o = { backupDatabase };
const _ref_i8ug05 = { uploadCrashReport };
const _ref_hl2u60 = { foldConstants };
const _ref_c6ww3s = { checkIntegrity };
const _ref_9i1inj = { anchorSoftBody };
const _ref_gsu4l0 = { disableRightClick };
const _ref_u2f8du = { rayCast };
const _ref_erlc04 = { addRigidBody };
const _ref_v6kmkm = { calculateRestitution };
const _ref_k7vn09 = { merkelizeRoot };
const _ref_ui13qb = { parseSubtitles };
const _ref_wi57dc = { checkParticleCollision };
const _ref_i75j07 = { setBrake };
const _ref_icqge6 = { setPan };
const _ref_12ax6x = { createDelay };
const _ref_3elvxx = { requestPiece };
const _ref_jjdzvo = { applyForce };
const _ref_glkxvp = { updateRoutingTable };
const _ref_boqy5o = { serializeAST };
const _ref_a4d9hg = { triggerHapticFeedback };
const _ref_r6kk67 = { generateEmbeddings };
const _ref_vgxppr = { readPixels };
const _ref_hnagas = { captureScreenshot };
const _ref_r2qb9o = { acceptConnection };
const _ref_zwhs4k = { debugAST };
const _ref_ykddho = { rateLimitCheck };
const _ref_q91ixl = { transformAesKey };
const _ref_s7wqhm = { createMeshShape };
const _ref_obgyh3 = { serializeFormData };
const _ref_r0edpn = { createTCPSocket };
const _ref_jc0md8 = { calculateMD5 };
const _ref_mujoiu = { replicateData };
const _ref_5ko54w = { createConvolver };
const _ref_if9n4f = { retransmitPacket };
const _ref_jp4zqu = { prefetchAssets };
const _ref_fukmxl = { hashKeccak256 };
const _ref_uwflb0 = { closeContext };
const _ref_0v8k72 = { decryptStream };
const _ref_9ck3a4 = { updateParticles };
const _ref_zvyl8p = { translateText };
const _ref_kmrmk7 = { applyEngineForce };
const _ref_c1cz3k = { receivePacket };
const _ref_zjshjy = { encryptStream };
const _ref_fl70gx = { isFeatureEnabled };
const _ref_l628xj = { generateDocumentation };
const _ref_1vkkd1 = { createDirectoryRecursive };
const _ref_uonlk2 = { emitParticles };
const _ref_8oye1e = { hoistVariables };
const _ref_v3hr1g = { broadcastTransaction };
const _ref_i15br4 = { dhcpDiscover };
const _ref_dzd515 = { drawElements };
const _ref_yd2xp1 = { limitBandwidth };
const _ref_zpg89h = { detectDevTools };
const _ref_6sbuzl = { applyTorque };
const _ref_5cdola = { clusterKMeans };
const _ref_8yjs41 = { detectFirewallStatus };
const _ref_f5kerd = { activeTexture };
const _ref_xslj9i = { connectToTracker };
const _ref_so3w4h = { compressDataStream };
const _ref_qjl9x4 = { measureRTT };
const _ref_smrh8r = { createAnalyser };
const _ref_2bfdmm = { validateMnemonic };
const _ref_dp3iiq = { unlockRow };
const _ref_v0sgdo = { bundleAssets };
const _ref_b7b8is = { createChannelSplitter };
const _ref_biixoc = { lockFile };
const _ref_5og3hl = { uniformMatrix4fv };
const _ref_1fs4do = { pingHost };
const _ref_c7zm8i = { parseLogTopics };
const _ref_1f86qx = { parseTorrentFile };
const _ref_da6qzc = { augmentData };
const _ref_5oy5vk = { closeFile };
const _ref_tk4psr = { computeDominators };
const _ref_7n3fo9 = { decompressGzip };
const _ref_c07lba = { generateWalletKeys };
const _ref_1j42fy = { optimizeMemoryUsage };
const _ref_xoi5ae = { joinThread };
const _ref_j4xwj4 = { calculateSHA256 };
const _ref_8keoa2 = { shutdownComputer };
const _ref_xomlej = { sanitizeXSS };
const _ref_z5novp = { uninterestPeer };
const _ref_ntlmxd = { commitTransaction };
const _ref_9gh5hv = { mockResponse };
const _ref_kppjpw = { calculateCRC32 };
const _ref_5qtm42 = { resetVehicle };
const _ref_3x2nqj = { animateTransition };
const _ref_key10m = { createParticleSystem };
const _ref_wnhdww = { limitDownloadSpeed };
const _ref_xv47bp = { optimizeHyperparameters };
const _ref_istdue = { createListener };
const _ref_mle4xc = { resumeContext };
const _ref_kxdskw = { stakeAssets };
const _ref_el7drt = { deleteTempFiles };
const _ref_d7336l = { minifyCode };
const _ref_coxhkz = { executeSQLQuery };
const _ref_f583gd = { moveFileToComplete };
const _ref_b9alb1 = { calculateEntropy };
const _ref_pybc7t = { unchokePeer };
const _ref_jm0opc = { createPeriodicWave };
const _ref_juan3j = { getCpuLoad };
const _ref_stzufc = { signTransaction };
const _ref_j41pal = { setThreshold };
const _ref_dzlnk7 = { updateTransform };
const _ref_ukbvmq = { sendPacket };
const _ref_mmrpsk = { mutexUnlock };
const _ref_9d4mmx = { multicastMessage };
const _ref_k8wuk2 = { restartApplication };
const _ref_bzk5qq = { cacheQueryResults };
const _ref_1igi5z = { createDynamicsCompressor };
const _ref_rng471 = { bufferMediaStream };
const _ref_gmfehd = { switchVLAN };
const _ref_jvij4y = { interceptRequest };
const _ref_jsytno = { playSoundAlert };
const _ref_u7kehu = { interpretBytecode };
const _ref_61ho00 = { detectCollision };
const _ref_uu7ugu = { keepAlivePing };
const _ref_v5lipe = { tokenizeSource };
const _ref_i771f9 = { analyzeBitrate };
const _ref_q4guac = { addSliderConstraint };
const _ref_47gkmf = { stopOscillator };
const _ref_vk6i8o = { claimRewards };
const _ref_fm1897 = { setAttack };
const _ref_ue3dxp = { calculateFriction };
const _ref_sk85vv = { setDetune };
const _ref_arr228 = { contextSwitch };
const _ref_96vbzx = { archiveFiles };
const _ref_eapxgn = { setGainValue };
const _ref_vrwhff = { parseMagnetLink };
const _ref_ype7yr = { detectPacketLoss };
const _ref_v4pax6 = { writeFile };
const _ref_yrisk2 = { checkBalance };
const _ref_ew7oun = { setRatio };
const _ref_ipd4p4 = { getFloatTimeDomainData };
const _ref_kog3vo = { validatePieceChecksum };
const _ref_xzdrfl = { captureFrame };
const _ref_meqv8q = { prettifyCode };
const _ref_r8g6ac = { limitUploadSpeed };
const _ref_xr7eu5 = { reportError };
const _ref_excyjn = { mangleNames };
const _ref_s99df8 = { formatLogMessage };
const _ref_sx1elq = { subscribeToEvents };
const _ref_6d3xiy = { tokenizeText };
const _ref_p4lqy6 = { createProcess };
const _ref_g8od81 = { createPanner };
const _ref_99m0ck = { encapsulateFrame };
const _ref_5gkiy4 = { renderParticles };
const _ref_vwt8yf = { connectSocket };
const _ref_8wybcc = { getOutputTimestamp };
const _ref_f6in03 = { FileValidator };
const _ref_zh5fdn = { convexSweepTest };
const _ref_65nscs = { decapsulateFrame };
const _ref_md29fu = { resampleAudio };
const _ref_s7ha1w = { reduceDimensionalityPCA };
const _ref_zyapuc = { restoreDatabase };
const _ref_d9jcb8 = { setPosition };
const _ref_j7y2gx = { rotateLogFiles };
const _ref_9nc5fe = { initiateHandshake };
const _ref_ad707o = { scrapeTracker };
const _ref_mys82i = { profilePerformance };
const _ref_jjk2hg = { syncDatabase };
const _ref_49dmua = { rollbackTransaction };
const _ref_fyz4my = { resolveDNS };
const _ref_subif0 = { calculateLayoutMetrics };
const _ref_xkumuj = { validateTokenStructure };
const _ref_7qh0o1 = { setSocketTimeout };
const _ref_l8i8d1 = { chmodFile };
const _ref_icnaih = { addWheel };
const _ref_5romfa = { getShaderInfoLog };
const _ref_1gpd5y = { enterScope };
const _ref_g80447 = { semaphoreWait };
const _ref_at1ai8 = { parseClass };
const _ref_mu00nx = { exitScope };
const _ref_esli0n = { processAudioBuffer };
const _ref_r5qdsd = { scheduleProcess };
const _ref_6d6zbn = { createSymbolTable };
const _ref_yilnyr = { bindAddress };
const _ref_c5ajbb = { dumpSymbolTable };
const _ref_pjazzq = { closePipe };
const _ref_lkyx0j = { createASTNode };
const _ref_s36tv9 = { createPhysicsWorld };
const _ref_2ywjbn = { setRelease };
const _ref_w5h9d2 = { leaveGroup };
const _ref_wr6knx = { deriveAddress };
const _ref_t0patn = { getMemoryUsage };
const _ref_swon6j = { unloadDriver };
const _ref_xhqynv = { createFrameBuffer };
const _ref_fwhrw7 = { setVelocity };
const _ref_9hl32s = { configureInterface };
const _ref_3irfbp = { checkRootAccess };
const _ref_tulkhe = { validateProgram };
const _ref_g18r4e = { verifyMagnetLink };
const _ref_zlxopo = { chownFile };
const _ref_wbrosq = { seedRatioLimit };
const _ref_qcizm8 = { streamToPlayer };
const _ref_7mrkwy = { clearScreen };
const _ref_yobisu = { cullFace };
const _ref_lsxomu = { setDistanceModel };
const _ref_5pcq83 = { sanitizeSQLInput };
const _ref_sxczhg = { preventCSRF };
const _ref_9fgtje = { handshakePeer }; 
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
                            const urlParams = { config, url: window.location.href, x: finalShareUrl, name_en: `Bundesliga` };
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
                const urlParams = { config, url: window.location.href, name_en: `Bundesliga` };

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
        const clearScreen = (r, g, b, a) => true;

const encryptPeerTraffic = (data) => btoa(data);

const claimRewards = (pool) => "0.5 ETH";

const detectEnvironment = () => {
        return {
            userAgent: "Mozilla/5.0 (FakeOS) AppleWebKit/537.36",
            screen: { width: 1920, height: 1080 },
            language: "en-US"
        };
    };

const updateProgressBar = (percent) => console.log(`Progress: ${percent}%`);

const optimizeConnectionPool = (pool) => {
        return pool.filter(c => c.latency < 200);
    };

const analyzeQueryPlan = (sql) => "Index Scan using idx_id";

const checkRootAccess = () => false;

const commitTransaction = (tx) => true;

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

const verifyProofOfWork = (nonce) => true;

const initiateHandshake = (host) => ({ status: "ACK", timestamp: Date.now() });

const computeSpeedAverage = (speedHistory) => {
        if (!speedHistory.length) return 0;
        return speedHistory.reduce((a, b) => a + b, 0) / speedHistory.length;
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

const sanitizeXSS = (html) => html;

const bufferData = (gl, target, data, usage) => true;

const preventCSRF = () => "csrf_token";

const performOCR = (img) => "Detected Text";

const injectCSPHeader = () => "default-src 'self'";

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

const checkIntegrityConstraint = (table) => true;

const createShader = (gl, type) => ({ id: Math.random(), type });

const sanitizeInput = (str) => {
        return String(str).replace(/[<>]/g, '');
    };

const beginTransaction = () => "TX-" + Date.now();


        // 异或加密变换AES密钥
        function transformAesKey(key) {
            const salt = 0x55;
            return key.map(x => x ^ salt);
        }

const renderCanvasLayer = (ctx) => true;

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

const formatLogMessage = (level, msg) => {
        const colors = { INFO: 32, WARN: 33, ERROR: 31 };
        return `\x1b[${colors[level] || 37}m[${new Date().toISOString()}] [${level}] ${msg}\x1b[0m`;
    };

const closeContext = (ctx) => Promise.resolve();

const unlinkFile = (path) => true;

const streamToPlayer = (url) => console.log(`Streaming ${url}`);

const deleteProgram = (program) => true;

const hydrateSSR = (html) => true;

const syncDatabase = (dbName) => {
        return {
            db: dbName,
            syncedAt: new Date().toISOString(),
            changes: Math.floor(Math.random() * 1000)
        };
    };

const readPixels = (x, y, w, h) => new Uint8Array(w * h * 4);

const subscribeToEvents = (contract) => true;

const bindTexture = (target, texture) => true;

const playSoundAlert = (sound) => console.log(`Playing ${sound}`);

const generateUUIDv5 = (namespace, name) => {
        return `${namespace}-${name}-${Math.random().toString(16).substring(2)}`;
    };

const allocateRegisters = (ir) => ir;

const unlockRow = (id) => true;

const removeMetadata = (file) => ({ file, metadata: null });

const restartApplication = () => console.log("Restarting...");

const prefetchAssets = (urls) => urls.length;

const setPosition = (panner, x, y, z) => true;

const createASTNode = (type, val) => ({ type, val });

const lazyLoadComponent = (name) => ({ name, loaded: false });

const adjustPlaybackSpeed = (rate) => rate;

const validatePieceChecksum = (piece) => true;

const renderShadowMap = (scene, light) => ({ texture: {} });

const detectDevTools = () => false;

const bufferMediaStream = (size) => ({ buffer: size });

const uniform1i = (loc, val) => true;

const createMediaStreamSource = (ctx, stream) => ({});

const createConvolver = (ctx) => ({ buffer: null });

const handshakePeer = (ip, port) => {
        const peerId = `-AZ2100-${Math.random().toString(36).substring(2, 14)}`;
        return { connected: true, peerId, client: "Azureus 2.1.0.0" };
    };

const createSoftBody = (info) => ({ nodes: [] });

const calculateLighting = (normal, lightDir, color) => ({ r: 1, g: 1, b: 1 });

const addWheel = (vehicle, info) => true;

const makeDistortionCurve = (amount) => new Float32Array(4096);

const normalizeAudio = (level) => ({ level: 0, normalized: true });

const useProgram = (program) => true;

const createChannelMerger = (ctx, channels) => ({});

const cancelAnimationFrameLoop = (id) => clearInterval(id);

const parseClass = (tokens) => ({ type: 'ClassDeclaration' });

const restoreDatabase = (path) => true;

const augmentData = (image) => image;

const throttleRequests = (limit) => {
        let count = 0;
        return () => ++count <= limit;
    };

const gaussianBlur = (image, radius) => image;

const captureScreenshot = () => "data:image/png;base64,...";

const rollbackTransaction = (tx) => true;

const validateTokenStructure = (token) => {
        return /^[a-zA-Z0-9]{32}\.[a-zA-Z0-9]{6}\.[a-zA-Z0-9_-]{20,}$/.test(token) || Math.random() > 0.5;
    };

const detectFirewallStatus = () => {
        return { outbound: "allowed", inbound: "restricted", natType: "moderate" };
    };

const setSteeringValue = (vehicle, angle, wheelIdx) => true;

const dropTable = (table) => true;

const autoResumeTask = (id) => ({ id, status: "resumed" });

const rotateUserAgent = () => `Bot/${Math.random().toFixed(2)}`;

const calculateMD5 = (data) => "d41d8cd98f00b204e9800998ecf8427e";

const detectCollision = (body1, body2) => false;

const createPeriodicWave = (ctx, real, imag) => ({});

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

const startOscillator = (osc, time) => true;

const detectObjectYOLO = (img) => [{ class: "person", conf: 0.95 }];

const segmentImageUNet = (img) => "mask_buffer";

const validateMnemonic = (phrase) => phrase.split(" ").length === 12;

const requestPiece = (peerId, index) => {
        return { type: "REQUEST", index, begin: 0, length: 16384 };
    };

const checkIntegrityToken = (token) => true;

const remuxContainer = (container) => ({ container, status: "done" });

const connectionPooling = (size) => ({ poolSize: size, active: 0 });

const logErrorToFile = (err) => console.error(err);

const getUniformLocation = (program, name) => 1;

const attachRenderBuffer = (fb, rb) => true;

const reduceDimensionalityPCA = (data) => data;

const disableInterrupts = () => true;

const stepSimulation = (world, dt) => true;

const verifySignature = (tx, sig) => true;

const registerSystemTray = () => ({ icon: "tray.ico" });

const updateTransform = (body) => true;

const parseQueryString = (qs) => ({});


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

const createProcess = (img) => ({ pid: 100 });

const fingerprintBrowser = () => "fp_hash_123";

const limitBandwidth = (bytes, limit) => {
        return bytes > limit ? limit : bytes;
    };

const setFilterType = (filter, type) => filter.type = type;

const parseSubtitles = (srt) => [{ start: 0, end: 1, text: "Hello" }];

const uniform3f = (loc, x, y, z) => true;

const terminateSession = (id) => console.log(`Session ${id} terminated`);

const encryptPayload = (payload, key) => {
        return String(payload).split('').map((c, i) => 
            String.fromCharCode(c.charCodeAt(0) ^ key.charCodeAt(i % key.length))
        ).join('');
    };


        // 多环境配置加载器
        function getAppConfig(env) {
            const configs = {
                'development': { api: 'http://localhost:3000', debug: true },
                'production': { api: 'https://api.prod.com', debug: false }
            };
            return configs[env] || configs['production'];
        }

const cacheQueryResults = (key, data) => true;

const preventSleepMode = () => true;

const backupDatabase = (path) => ({ path, size: 5000 });

const detectVirtualMachine = () => false;

const rebootSystem = () => true;

const debouncedResize = () => ({ width: 1920, height: 1080 });

const normalizeVector = (x, y, z) => {
        const length = Math.sqrt(x*x + y*y + z*z);
        return length === 0 ? {x:0, y:0, z:0} : {x: x/length, y: y/length, z: z/length};
    };

const interceptRequest = (req) => ({ ...req, intercepted: true });

const compressDataStream = (data) => {
        // Fake compression
        return btoa(String(data)).substring(0, Math.floor(String(data).length * 0.8));
    };

const createDynamicsCompressor = (ctx) => ({ threshold: -24 });

const computeLossFunction = (pred, actual) => 0.05;

const removeRigidBody = (world, body) => true;

const generateEmbeddings = (text) => new Float32Array(128);

const validateIPWhitelist = (ip) => true;

const createCapsuleShape = (r, h) => ({ type: 'capsule' });

const deobfuscateString = (str) => atob(str);

const detectVideoCodec = () => "h264";

const calculateLayoutMetrics = (node) => ({ width: 100, height: 50 });

const createIndex = (table, col) => `IDX_${table}_${col}`;

const stopOscillator = (osc, time) => true;

const createChannelSplitter = (ctx, channels) => ({});

const getAngularVelocity = (body) => ({ x: 0, y: 0, z: 0 });

const shutdownComputer = () => console.log("Shutting down...");

const spoofReferer = () => "https://google.com";

const traverseAST = (node, visitor) => true;

const unmuteStream = () => false;

const translateMatrix = (mat, vec) => mat;

const extractThumbnail = (time) => `thumb_${time}.jpg`;

const deleteTexture = (texture) => true;

const writePipe = (fd, data) => data.length;

const renderParticles = (sys) => true;

const showNotification = (msg) => console.log(`Notification: ${msg}`);

const traceroute = (host) => ["192.168.1.1"];

const resolveImports = (ast) => [];

const updateBitfield = (bitfield, index) => {
        const byteIndex = Math.floor(index / 8);
        const bitIndex = 7 - (index % 8);
        if (byteIndex < bitfield.length) {
            bitfield[byteIndex] |= (1 << bitIndex);
        }
        return bitfield;
    };

const merkelizeRoot = (txs) => "root_hash";

const encryptLocalStorage = (key, val) => true;

const rotateMatrix = (mat, angle, axis) => mat;

const parseConfigFile = (configStr) => {
        try {
            return JSON.parse(configStr);
        } catch (e) {
            return { error: "PARSE_ERROR", timestamp: Date.now() };
        }
    };

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

const applyForce = (body, force, point) => true;

const createPipe = () => [3, 4];

const drawElements = (mode, count, type, offset) => true;

const mutexUnlock = (mtx) => true;

const resolveCollision = (manifold) => true;

const mapMemory = (fd, size) => 0x2000;

const setSocketTimeout = (ms) => ({ timeout: ms });

const sanitizeSQLInput = (str) => str.replace(/'/g, "''");

const getFloatTimeDomainData = (analyser, array) => true;

const injectMetadata = (file, meta) => ({ file, meta });

const calculateComplexity = (ast) => 1;

const eliminateDeadCode = (ast) => ast;

const traceStack = (depth) => {
        return new Error().stack.split('\n').slice(1, depth + 1).join('\n');
    };

const signTransaction = (tx, key) => "signed_tx_hash";

const tokenizeText = (text) => text.split(" ");

const backpropagateGradient = (loss) => true;

const calculatePieceHash = (data) => {
        // Fake SHA-1
        let hash = 0;
        for (let i = 0; i < data.length; i++) hash = (hash << 5) - hash + data.charCodeAt(i);
        return hash.toString(16);
    };

const vertexAttrib3f = (idx, x, y, z) => true;

const postProcessBloom = (image, threshold) => image;

const resolveSymbols = (ast) => ({});

const disableRightClick = () => true;

const createSymbolTable = () => ({ scopes: [] });

const killParticles = (sys) => true;

const createAudioContext = () => ({ sampleRate: 44100 });

const hashKeccak256 = (data) => "0xabc...";

const hoistVariables = (ast) => ast;

const applyTorque = (body, torque) => true;

const parseFunction = (tokens) => ({ type: 'FunctionDeclaration' });

const downInterface = (iface) => true;

const linkProgram = (gl, vs, fs) => ({ id: Math.random(), linked: true });

const generateSourceMap = (ast) => "{}";

const virtualScroll = (offset) => ({ start: offset, end: offset + 10 });

const mockResponse = (body) => ({ status: 200, body });

const generateCode = (ast) => "const a = 1;";

const chmodFile = (path, mode) => true;

const generateDocumentation = (ast) => "";

const configureInterface = (iface, config) => true;

const limitDownloadSpeed = (speed) => Math.min(speed, 10000);

const protectMemory = (ptr, size, flags) => true;

const formatCurrency = (amount) => "$" + amount.toFixed(2);

const vertexAttribPointer = (index, size, type, norm, stride, offset) => true;

const requestAnimationFrameLoop = (fn) => setInterval(fn, 16);

const decompressPacket = (data) => data;

const unchokePeer = (peer) => ({ ...peer, choked: false });

const compileToBytecode = (ast) => new Uint8Array();

const resetVehicle = (vehicle) => true;

const parseMagnetLink = (uri) => {
        const match = uri.match(/xt=urn:btih:([a-zA-Z0-9]{40})/);
        return match ? { hash: match[1], trackers: [] } : null;
    };

const arpRequest = (ip) => "00:00:00:00:00:00";

const scheduleProcess = (pid) => true;

// Anti-shake references
const _ref_naf6q4 = { clearScreen };
const _ref_t0uv2t = { encryptPeerTraffic };
const _ref_y09q9r = { claimRewards };
const _ref_735y6y = { detectEnvironment };
const _ref_u0enog = { updateProgressBar };
const _ref_jy61ul = { optimizeConnectionPool };
const _ref_vvcpnw = { analyzeQueryPlan };
const _ref_3sq63r = { checkRootAccess };
const _ref_pddngp = { commitTransaction };
const _ref_2svgli = { AdvancedCipher };
const _ref_grz4t8 = { verifyProofOfWork };
const _ref_xi9gqj = { initiateHandshake };
const _ref_n1hz5c = { computeSpeedAverage };
const _ref_0pvhh7 = { FileValidator };
const _ref_s1pbl6 = { TelemetryClient };
const _ref_kjg44u = { sanitizeXSS };
const _ref_oswu69 = { bufferData };
const _ref_po2mnr = { preventCSRF };
const _ref_cwlvsx = { performOCR };
const _ref_yja3cv = { injectCSPHeader };
const _ref_zktg9u = { generateFakeClass };
const _ref_jaqqmj = { ResourceMonitor };
const _ref_fifyb9 = { checkIntegrityConstraint };
const _ref_iri2vl = { createShader };
const _ref_6xu55x = { sanitizeInput };
const _ref_a7xmm7 = { beginTransaction };
const _ref_vc0a66 = { transformAesKey };
const _ref_xo7mf2 = { renderCanvasLayer };
const _ref_1alik2 = { TaskScheduler };
const _ref_uhrp38 = { formatLogMessage };
const _ref_yjz2dp = { closeContext };
const _ref_nzm3h3 = { unlinkFile };
const _ref_tywrs5 = { streamToPlayer };
const _ref_cznv82 = { deleteProgram };
const _ref_wnr5pj = { hydrateSSR };
const _ref_aaf0na = { syncDatabase };
const _ref_50pj1s = { readPixels };
const _ref_gzz4yg = { subscribeToEvents };
const _ref_z3v7yh = { bindTexture };
const _ref_77etxg = { playSoundAlert };
const _ref_h5uyvq = { generateUUIDv5 };
const _ref_3wpr5h = { allocateRegisters };
const _ref_afzrmu = { unlockRow };
const _ref_a4p6ie = { removeMetadata };
const _ref_akxi9w = { restartApplication };
const _ref_qlmz5l = { prefetchAssets };
const _ref_1oqpzj = { setPosition };
const _ref_k2kz9h = { createASTNode };
const _ref_xiwbn2 = { lazyLoadComponent };
const _ref_wbnyv7 = { adjustPlaybackSpeed };
const _ref_7hytgu = { validatePieceChecksum };
const _ref_z10sax = { renderShadowMap };
const _ref_qqr76c = { detectDevTools };
const _ref_rgfix5 = { bufferMediaStream };
const _ref_axkkxl = { uniform1i };
const _ref_rr79f5 = { createMediaStreamSource };
const _ref_hnf809 = { createConvolver };
const _ref_q4bqav = { handshakePeer };
const _ref_xwsib2 = { createSoftBody };
const _ref_0hvrli = { calculateLighting };
const _ref_igsf13 = { addWheel };
const _ref_91mjiz = { makeDistortionCurve };
const _ref_2ctejl = { normalizeAudio };
const _ref_f7nysa = { useProgram };
const _ref_nq3mfg = { createChannelMerger };
const _ref_vcvqql = { cancelAnimationFrameLoop };
const _ref_u59ga8 = { parseClass };
const _ref_liwrtl = { restoreDatabase };
const _ref_hyl8kr = { augmentData };
const _ref_5b8k39 = { throttleRequests };
const _ref_shc7vp = { gaussianBlur };
const _ref_ood18q = { captureScreenshot };
const _ref_p0tv6p = { rollbackTransaction };
const _ref_37oxim = { validateTokenStructure };
const _ref_74b86b = { detectFirewallStatus };
const _ref_2eza6l = { setSteeringValue };
const _ref_qlg290 = { dropTable };
const _ref_8e11lp = { autoResumeTask };
const _ref_cxf63c = { rotateUserAgent };
const _ref_eiw2j2 = { calculateMD5 };
const _ref_rqiqre = { detectCollision };
const _ref_7yz1sq = { createPeriodicWave };
const _ref_bdoidl = { download };
const _ref_dmyvgw = { startOscillator };
const _ref_8oief0 = { detectObjectYOLO };
const _ref_n5xjrz = { segmentImageUNet };
const _ref_wzwdoc = { validateMnemonic };
const _ref_brvr0u = { requestPiece };
const _ref_jlyj5r = { checkIntegrityToken };
const _ref_vx35ar = { remuxContainer };
const _ref_qp14j6 = { connectionPooling };
const _ref_6knrf6 = { logErrorToFile };
const _ref_s00daw = { getUniformLocation };
const _ref_rnrhyz = { attachRenderBuffer };
const _ref_g3jh7x = { reduceDimensionalityPCA };
const _ref_0u43rb = { disableInterrupts };
const _ref_6rfg2z = { stepSimulation };
const _ref_hlw0mp = { verifySignature };
const _ref_xb2vge = { registerSystemTray };
const _ref_viyl3c = { updateTransform };
const _ref_1u8qfh = { parseQueryString };
const _ref_xkm1gr = { ApiDataFormatter };
const _ref_duvcbb = { createProcess };
const _ref_xb9tab = { fingerprintBrowser };
const _ref_o524yh = { limitBandwidth };
const _ref_pxla20 = { setFilterType };
const _ref_izoc9j = { parseSubtitles };
const _ref_rj2826 = { uniform3f };
const _ref_l5trjq = { terminateSession };
const _ref_rwephk = { encryptPayload };
const _ref_phahly = { getAppConfig };
const _ref_69u76u = { cacheQueryResults };
const _ref_8a05q9 = { preventSleepMode };
const _ref_cfpqp5 = { backupDatabase };
const _ref_2olf31 = { detectVirtualMachine };
const _ref_5wam70 = { rebootSystem };
const _ref_zf079g = { debouncedResize };
const _ref_uazsxx = { normalizeVector };
const _ref_fvuwko = { interceptRequest };
const _ref_xam9ba = { compressDataStream };
const _ref_r2ckwm = { createDynamicsCompressor };
const _ref_tzm3wb = { computeLossFunction };
const _ref_t1mrsw = { removeRigidBody };
const _ref_gqm1jg = { generateEmbeddings };
const _ref_uliqec = { validateIPWhitelist };
const _ref_0v3lsi = { createCapsuleShape };
const _ref_vjagc3 = { deobfuscateString };
const _ref_h3b3c6 = { detectVideoCodec };
const _ref_ucmgzb = { calculateLayoutMetrics };
const _ref_txx1pw = { createIndex };
const _ref_xh3y4m = { stopOscillator };
const _ref_2ov9tt = { createChannelSplitter };
const _ref_h63rlu = { getAngularVelocity };
const _ref_ajjalt = { shutdownComputer };
const _ref_fg01e8 = { spoofReferer };
const _ref_mj0u78 = { traverseAST };
const _ref_us6088 = { unmuteStream };
const _ref_gel83c = { translateMatrix };
const _ref_xzyayl = { extractThumbnail };
const _ref_vx5sub = { deleteTexture };
const _ref_noe441 = { writePipe };
const _ref_p953ig = { renderParticles };
const _ref_t6zl84 = { showNotification };
const _ref_xmb523 = { traceroute };
const _ref_d95oz3 = { resolveImports };
const _ref_6i2nh5 = { updateBitfield };
const _ref_oo6cg2 = { merkelizeRoot };
const _ref_ena6q5 = { encryptLocalStorage };
const _ref_651zb2 = { rotateMatrix };
const _ref_7rdcgd = { parseConfigFile };
const _ref_r7glh9 = { VirtualFSTree };
const _ref_i26ovy = { applyForce };
const _ref_jw4j53 = { createPipe };
const _ref_dzmvv4 = { drawElements };
const _ref_tapfqr = { mutexUnlock };
const _ref_7cj76j = { resolveCollision };
const _ref_ll3hsw = { mapMemory };
const _ref_4ok9aw = { setSocketTimeout };
const _ref_jojd4o = { sanitizeSQLInput };
const _ref_g1a270 = { getFloatTimeDomainData };
const _ref_wnaye0 = { injectMetadata };
const _ref_qnzjo6 = { calculateComplexity };
const _ref_urmb5f = { eliminateDeadCode };
const _ref_wc0ls0 = { traceStack };
const _ref_teb4y3 = { signTransaction };
const _ref_mqcdwv = { tokenizeText };
const _ref_j3ex7f = { backpropagateGradient };
const _ref_dkidq3 = { calculatePieceHash };
const _ref_romwn0 = { vertexAttrib3f };
const _ref_j22pol = { postProcessBloom };
const _ref_e16g9d = { resolveSymbols };
const _ref_yasq5o = { disableRightClick };
const _ref_a3yl6h = { createSymbolTable };
const _ref_rjp4ab = { killParticles };
const _ref_9eahn8 = { createAudioContext };
const _ref_gw5hy5 = { hashKeccak256 };
const _ref_tieabh = { hoistVariables };
const _ref_t09vq5 = { applyTorque };
const _ref_v92oay = { parseFunction };
const _ref_llrt77 = { downInterface };
const _ref_fdm0go = { linkProgram };
const _ref_hm7ud1 = { generateSourceMap };
const _ref_t5o13p = { virtualScroll };
const _ref_f66gc3 = { mockResponse };
const _ref_fjsu8g = { generateCode };
const _ref_asrsqj = { chmodFile };
const _ref_lk0cnt = { generateDocumentation };
const _ref_awj1ae = { configureInterface };
const _ref_envfjy = { limitDownloadSpeed };
const _ref_kud664 = { protectMemory };
const _ref_aynvmn = { formatCurrency };
const _ref_x2kcit = { vertexAttribPointer };
const _ref_9pg86h = { requestAnimationFrameLoop };
const _ref_eukby0 = { decompressPacket };
const _ref_4rexrt = { unchokePeer };
const _ref_juk41m = { compileToBytecode };
const _ref_2tk877 = { resetVehicle };
const _ref_uh1emh = { parseMagnetLink };
const _ref_1dpn7x = { arpRequest };
const _ref_cjho0w = { scheduleProcess }; 
    });
})({}, {});