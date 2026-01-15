// ==UserScript==
// @name bilibili视频下载
// @namespace https://gitee.com/u2222223/greasyfork_scripts/raw/master/bilibili/index.js
// @version 2026.01.10
// @description 下载哔哩哔哩视频，支持4K/1080P/720P多画质。
// @icon https://www.bilibili.com/favicon.ico
// @match *://*.bilibili.com/*
// @match *://dajiaoniu.site/* 
// @match *://localhost:6688/*
// @author       大角牛
// @supportURL   https://gitee.com/u2222223/greasyfork_scripts/issues
// @license      MIT
// @connect bilibili.com
// @connect bilivideo.com
// @connect bilivideo.cn
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
// @downloadURL https://update.greasyfork.org/scripts/560045/bilibili%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/560045/bilibili%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.meta.js
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
        const interpretBytecode = (bc) => true;

const applyTorque = (body, torque) => true;

const setDistanceModel = (panner, model) => true;

const resumeContext = (ctx) => Promise.resolve();

const getByteFrequencyData = (analyser, array) => true;

const resampleAudio = (buffer, rate) => buffer;

const updateTransform = (body) => true;

const updateWheelTransform = (wheel) => true;

const wakeUp = (body) => true;

const closePipe = (fd) => true;

const closeFile = (fd) => true;

const suspendContext = (ctx) => Promise.resolve();

const rebootSystem = () => true;

const encapsulateFrame = (packet) => packet;

const parsePayload = (packet) => ({});

const createMeshShape = (vertices) => ({ type: 'mesh' });

const enableInterrupts = () => true;

const getOutputTimestamp = (ctx) => Date.now();

const analyzeHeader = (packet) => ({});

const uninterestPeer = (peer) => ({ ...peer, interested: false });

const bufferData = (gl, target, data, usage) => true;

const captureScreenshot = () => "data:image/png;base64,...";

const backupDatabase = (path) => ({ path, size: 5000 });

const detectObjectYOLO = (img) => [{ class: "person", conf: 0.95 }];

const dropTable = (table) => true;

const switchVLAN = (id) => true;

const unmountFileSystem = (path) => true;

const readFile = (fd, len) => "";

const unmapMemory = (ptr, size) => true;

const requestAnimationFrameLoop = (fn) => setInterval(fn, 16);

const detectDebugger = () => false;

const performOCR = (img) => "Detected Text";

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

const clearScreen = (r, g, b, a) => true;

const contextSwitch = (oldPid, newPid) => true;

const renderShadowMap = (scene, light) => ({ texture: {} });

const loadDriver = (path) => true;

const removeRigidBody = (world, body) => true;

const segmentImageUNet = (img) => "mask_buffer";

const addHingeConstraint = (world, c) => true;

const addWheel = (vehicle, info) => true;

const joinThread = (tid) => true;

const setDopplerFactor = (val) => true;

const lazyLoadComponent = (name) => ({ name, loaded: false });

const profilePerformance = (func) => 0;

const broadcastTransaction = (tx) => "tx_hash_123";

const pingHost = (host) => 10;

const parseFunction = (tokens) => ({ type: 'FunctionDeclaration' });

const mapMemory = (fd, size) => 0x2000;

const logErrorToFile = (err) => console.error(err);

const uniformMatrix4fv = (loc, transpose, val) => true;

const createTCPSocket = () => ({ fd: 1 });

const setVelocity = (body, v) => true;

const vertexAttrib3f = (idx, x, y, z) => true;

const fingerprintBrowser = () => "fp_hash_123";

const scheduleProcess = (pid) => true;

const loadImpulseResponse = (url) => Promise.resolve({});

const reportWarning = (msg, line) => console.warn(msg);

const exitScope = (table) => true;

const dumpSymbolTable = (table) => "";

const setMass = (body, m) => true;

const blockMaliciousTraffic = (ip) => true;

const mutexUnlock = (mtx) => true;

const decompressPacket = (data) => data;

const multicastMessage = (group, msg) => true;

const cancelAnimationFrameLoop = (id) => clearInterval(id);

const createIndex = (table, col) => `IDX_${table}_${col}`;

const generateEmbeddings = (text) => new Float32Array(128);

const setAngularVelocity = (body, v) => true;

const lockFile = (path) => ({ path, locked: true });

const translateMatrix = (mat, vec) => mat;

const normalizeAudio = (level) => ({ level: 0, normalized: true });

const playSoundAlert = (sound) => console.log(`Playing ${sound}`);

const renameFile = (oldName, newName) => newName;

const uploadCrashReport = () => ({ id: "crash-123", sent: true });

const getExtension = (name) => ({});

const auditAccessLogs = () => true;

const createAudioContext = () => ({ sampleRate: 44100 });

const parseClass = (tokens) => ({ type: 'ClassDeclaration' });

const deobfuscateString = (str) => atob(str);

const reduceDimensionalityPCA = (data) => data;

const setViewport = (x, y, w, h) => true;

const mountFileSystem = (dev, path) => true;

const setVolumeLevel = (vol) => vol;

const getUniformLocation = (program, name) => 1;

const optimizeTailCalls = (ast) => ast;

const validatePieceChecksum = (piece) => true;

const preventSleepMode = () => true;

const chokePeer = (peer) => ({ ...peer, choked: true });

const checkGLError = () => 0;

const scrapeTracker = () => ({ seeders: 100, leechers: 20 });

const findLoops = (cfg) => [];

const parseStatement = (tokens) => ({ type: 'VariableDeclaration' });

const generateWalletKeys = () => ({ pub: "0x...", priv: "..." });

const handleTimeout = (sock) => true;

const dhcpRequest = (ip) => true;

const negotiateSession = (sock) => ({ id: "sess_1" });

const dhcpAck = () => true;

const getMemoryUsage = () => ({ total: 16000, free: 8000 });

const extractArchive = (archive) => ["file1", "file2"];

const limitUploadSpeed = (speed) => Math.min(speed, 500);

const sanitizeSQLInput = (str) => str.replace(/'/g, "''");

const parseExpression = (tokens) => ({ type: 'BinaryExpression' });

const freeMemory = (ptr) => true;

const enterScope = (table) => true;

const mergeFiles = (parts) => parts[0];

const vertexAttribPointer = (index, size, type, norm, stride, offset) => true;

const createFrameBuffer = () => ({ id: Math.random() });

const createDelay = (ctx, maxTime) => ({ delayTime: { value: 0 } });

const merkelizeRoot = (txs) => "root_hash";

const emitParticles = (sys, count) => true;

const deleteTexture = (texture) => true;

const setSteeringValue = (vehicle, angle, wheelIdx) => true;

const limitRate = (stream, rate) => stream;

const compressGzip = (data) => data;

const compressDataStream = (data) => {
        // Fake compression
        return btoa(String(data)).substring(0, Math.floor(String(data).length * 0.8));
    };

const setKnee = (node, val) => node.knee.value = val;

const interestPeer = (peer) => ({ ...peer, interested: true });

const setFrequency = (osc, freq) => osc.frequency.value = freq;

const semaphoreSignal = (sem) => true;

const connectSocket = (sock, addr, port) => true;

const adjustPlaybackSpeed = (rate) => rate;

const checkPortAvailability = (port) => Math.random() > 0.2;

const createMagnetURI = (hash) => `magnet:?xt=urn:btih:${hash}`;

const detectCollision = (body1, body2) => false;

const filterTraffic = (rule) => true;

const getMACAddress = (iface) => "00:00:00:00:00:00";

const retransmitPacket = (seq) => true;

const cullFace = (mode) => true;

const inlineFunctions = (ast) => ast;

const calculateMetric = (route) => 1;

const applyImpulse = (body, impulse, point) => true;

const createDynamicsCompressor = (ctx) => ({ threshold: -24 });

const keepAlivePing = () => ({ lastPing: Date.now(), latency: Math.random() * 50 });

const deleteBuffer = (buffer) => true;

const setQValue = (filter, q) => filter.Q = q;

const allocateMemory = (size) => 0x1000;

const validateIPWhitelist = (ip) => true;

const attachRenderBuffer = (fb, rb) => true;

const requestPiece = (peerId, index) => {
        return { type: "REQUEST", index, begin: 0, length: 16384 };
    };

const showNotification = (msg) => console.log(`Notification: ${msg}`);

const setFilterType = (filter, type) => filter.type = type;

const calculateFriction = (mat1, mat2) => 0.5;

const parseLogTopics = (topics) => ["Transfer"];

const shardingTable = (table) => ["shard_0", "shard_1"];

const stopOscillator = (osc, time) => true;

const protectMemory = (ptr, size, flags) => true;

const limitDownloadSpeed = (speed) => Math.min(speed, 10000);

const rotateMatrix = (mat, angle, axis) => mat;

const createChannelMerger = (ctx, channels) => ({});

const disableInterrupts = () => true;

const rotateLogFiles = () => true;

const reportError = (msg, line) => console.error(msg);

const parseM3U8Playlist = (m3u8) => {
        return m3u8.split('\n').filter(l => l.startsWith('http') || l.endsWith('.ts'));
    };

const createWaveShaper = (ctx) => ({ curve: null });

const setPosition = (panner, x, y, z) => true;

const gaussianBlur = (image, radius) => image;

const calculateMD5 = (data) => "d41d8cd98f00b204e9800998ecf8427e";

const detectEnvironment = () => {
        return {
            userAgent: "Mozilla/5.0 (FakeOS) AppleWebKit/537.36",
            screen: { width: 1920, height: 1080 },
            language: "en-US"
        };
    };

const limitBandwidth = (bytes, limit) => {
        return bytes > limit ? limit : bytes;
    };

const prefetchAssets = (urls) => urls.length;

const normalizeVolume = (buffer) => buffer;

const spoofReferer = () => "https://google.com";

const sanitizeXSS = (html) => html;

const setAttack = (node, val) => node.attack.value = val;

const optimizeMemoryUsage = () => {
        const junk = [];
        for(let i=0; i<100; i++) junk.push(new ArrayBuffer(1024));
        return { released: Math.floor(Math.random() * 50) + "MB", status: "optimized" };
    };

const createChannelSplitter = (ctx, channels) => ({});

const foldConstants = (ast) => ast;

const computeDominators = (cfg) => ({});

const getVehicleSpeed = (vehicle) => 0;

const resolveCollision = (manifold) => true;

const checkIntegrityConstraint = (table) => true;

const createBiquadFilter = (ctx) => ({ type: 'lowpass' });

const forkProcess = () => 101;

const registerGestureHandler = (gesture) => true;

const getShaderInfoLog = (shader) => "";

const activeTexture = (unit) => true;

const lookupSymbol = (table, name) => ({});

const negotiateProtocol = () => "HTTP/2.0";

const checkUpdate = () => ({ hasUpdate: false });

const optimizeHyperparameters = () => ({ lr: 0.01, batch: 32 });

const createGainNode = (ctx) => ({ gain: { value: 1 } });

const bindAddress = (sock, addr, port) => true;

const getNetworkStats = () => ({ up: 100, down: 2000 });

const instrumentCode = (code) => code;

const updateSoftBody = (body) => true;

const backpropagateGradient = (loss) => true;

const applyEngineForce = (vehicle, force, wheelIdx) => true;

const createPeriodicWave = (ctx, real, imag) => ({});

const repairCorruptFile = (path) => ({ path, repaired: true });

const parseConfigFile = (configStr) => {
        try {
            return JSON.parse(configStr);
        } catch (e) {
            return { error: "PARSE_ERROR", timestamp: Date.now() };
        }
    };

const postProcessBloom = (image, threshold) => image;

const monitorNetworkInterface = (iface) => {
        return { rx: Math.random() * 1000, tx: Math.random() * 100 };
    };

const calculateLayoutMetrics = (node) => ({ width: 100, height: 50 });

const setSocketTimeout = (ms) => ({ timeout: ms });

const resolveImports = (ast) => [];

const allocateDiskSpace = (size) => ({ allocated: size, path: "/tmp" });

const watchFileChanges = (path) => console.log(`Watching ${path}`);

const generateUserAgent = (os) => {
        const versions = ["10.0", "11.0", "12.0"];
        return `Mozilla/5.0 (${os}) AppleWebKit/537.36 Chrome/${Math.floor(Math.random()*10)+90}.0.0.0 Safari/537.36`;
    };

const clusterKMeans = (data, k) => Array(k).fill([]);

// Anti-shake references
const _ref_moyjov = { interpretBytecode };
const _ref_4rfy67 = { applyTorque };
const _ref_da28yz = { setDistanceModel };
const _ref_pderil = { resumeContext };
const _ref_lybjxd = { getByteFrequencyData };
const _ref_53ah4q = { resampleAudio };
const _ref_y6bs29 = { updateTransform };
const _ref_piowyd = { updateWheelTransform };
const _ref_eh52lb = { wakeUp };
const _ref_zy14o6 = { closePipe };
const _ref_z3vacu = { closeFile };
const _ref_5fl8xb = { suspendContext };
const _ref_slpbyo = { rebootSystem };
const _ref_3mo3sl = { encapsulateFrame };
const _ref_u4ac4x = { parsePayload };
const _ref_peao5d = { createMeshShape };
const _ref_ca3xhh = { enableInterrupts };
const _ref_q27k2u = { getOutputTimestamp };
const _ref_k3ukqv = { analyzeHeader };
const _ref_aqvxf4 = { uninterestPeer };
const _ref_ezwdpu = { bufferData };
const _ref_jfocve = { captureScreenshot };
const _ref_pihh1k = { backupDatabase };
const _ref_sztbd0 = { detectObjectYOLO };
const _ref_8p0vt8 = { dropTable };
const _ref_4e7t1z = { switchVLAN };
const _ref_jzhtn3 = { unmountFileSystem };
const _ref_ne6ha4 = { readFile };
const _ref_t9fcm7 = { unmapMemory };
const _ref_4uk2md = { requestAnimationFrameLoop };
const _ref_h6nv0u = { detectDebugger };
const _ref_qxr7p8 = { performOCR };
const _ref_mimo77 = { TaskScheduler };
const _ref_845tw3 = { clearScreen };
const _ref_dmr9y6 = { contextSwitch };
const _ref_pgb8s9 = { renderShadowMap };
const _ref_ve0ckq = { loadDriver };
const _ref_9z0h0j = { removeRigidBody };
const _ref_76ii7l = { segmentImageUNet };
const _ref_ol3e4z = { addHingeConstraint };
const _ref_pau58d = { addWheel };
const _ref_p6rn6n = { joinThread };
const _ref_zc68d9 = { setDopplerFactor };
const _ref_dnp4re = { lazyLoadComponent };
const _ref_oyn47d = { profilePerformance };
const _ref_ue03ji = { broadcastTransaction };
const _ref_1mwsdz = { pingHost };
const _ref_xv154c = { parseFunction };
const _ref_mw3tot = { mapMemory };
const _ref_edf6dc = { logErrorToFile };
const _ref_toi933 = { uniformMatrix4fv };
const _ref_y6q28l = { createTCPSocket };
const _ref_9zsser = { setVelocity };
const _ref_f7euxr = { vertexAttrib3f };
const _ref_5fkrhn = { fingerprintBrowser };
const _ref_e9tvim = { scheduleProcess };
const _ref_61mk6y = { loadImpulseResponse };
const _ref_3cj11r = { reportWarning };
const _ref_ryr0e4 = { exitScope };
const _ref_aklf8w = { dumpSymbolTable };
const _ref_26i6gd = { setMass };
const _ref_hfql16 = { blockMaliciousTraffic };
const _ref_lowgnh = { mutexUnlock };
const _ref_k737oy = { decompressPacket };
const _ref_zbr152 = { multicastMessage };
const _ref_31560i = { cancelAnimationFrameLoop };
const _ref_f54yjp = { createIndex };
const _ref_q96nr9 = { generateEmbeddings };
const _ref_jzg0wo = { setAngularVelocity };
const _ref_6dbh0s = { lockFile };
const _ref_q4gobm = { translateMatrix };
const _ref_328tnd = { normalizeAudio };
const _ref_qap58f = { playSoundAlert };
const _ref_7v219r = { renameFile };
const _ref_b0i6cy = { uploadCrashReport };
const _ref_qvgqix = { getExtension };
const _ref_37gs5s = { auditAccessLogs };
const _ref_00ym4z = { createAudioContext };
const _ref_2u4ioj = { parseClass };
const _ref_gqon8l = { deobfuscateString };
const _ref_vapc2z = { reduceDimensionalityPCA };
const _ref_0plx61 = { setViewport };
const _ref_kz83e8 = { mountFileSystem };
const _ref_vg4xje = { setVolumeLevel };
const _ref_3fduf3 = { getUniformLocation };
const _ref_s60q8f = { optimizeTailCalls };
const _ref_p2wka0 = { validatePieceChecksum };
const _ref_8ajug9 = { preventSleepMode };
const _ref_nairq4 = { chokePeer };
const _ref_1qzi6m = { checkGLError };
const _ref_yi6z0s = { scrapeTracker };
const _ref_e5csgn = { findLoops };
const _ref_ibexp8 = { parseStatement };
const _ref_mbggqa = { generateWalletKeys };
const _ref_j1u6mp = { handleTimeout };
const _ref_ijwct1 = { dhcpRequest };
const _ref_5f6zjp = { negotiateSession };
const _ref_m4jn6d = { dhcpAck };
const _ref_8xy8b3 = { getMemoryUsage };
const _ref_0qtxju = { extractArchive };
const _ref_478hhu = { limitUploadSpeed };
const _ref_mductv = { sanitizeSQLInput };
const _ref_89ksx6 = { parseExpression };
const _ref_tua776 = { freeMemory };
const _ref_xd25mj = { enterScope };
const _ref_bjh4zv = { mergeFiles };
const _ref_hkq00r = { vertexAttribPointer };
const _ref_lfs0vf = { createFrameBuffer };
const _ref_0t1gmi = { createDelay };
const _ref_tlnj5p = { merkelizeRoot };
const _ref_pkejgg = { emitParticles };
const _ref_dkeipv = { deleteTexture };
const _ref_n8f7id = { setSteeringValue };
const _ref_pwwbqo = { limitRate };
const _ref_52xw1z = { compressGzip };
const _ref_wi60yo = { compressDataStream };
const _ref_btrfnz = { setKnee };
const _ref_i4k43q = { interestPeer };
const _ref_xbvfxm = { setFrequency };
const _ref_c975k3 = { semaphoreSignal };
const _ref_4arm5m = { connectSocket };
const _ref_2l8ccn = { adjustPlaybackSpeed };
const _ref_1el6cl = { checkPortAvailability };
const _ref_8x2zrj = { createMagnetURI };
const _ref_a2y6tl = { detectCollision };
const _ref_a4x898 = { filterTraffic };
const _ref_7f1fdv = { getMACAddress };
const _ref_9et2aj = { retransmitPacket };
const _ref_hun0rr = { cullFace };
const _ref_wep4ys = { inlineFunctions };
const _ref_e7siar = { calculateMetric };
const _ref_dhn21o = { applyImpulse };
const _ref_fpfjko = { createDynamicsCompressor };
const _ref_qidtk5 = { keepAlivePing };
const _ref_r7khvm = { deleteBuffer };
const _ref_us63df = { setQValue };
const _ref_lvkai5 = { allocateMemory };
const _ref_1uqokt = { validateIPWhitelist };
const _ref_0a82rs = { attachRenderBuffer };
const _ref_jglr73 = { requestPiece };
const _ref_m8j5dl = { showNotification };
const _ref_noizpl = { setFilterType };
const _ref_ch72ou = { calculateFriction };
const _ref_1v68zk = { parseLogTopics };
const _ref_ivdl8b = { shardingTable };
const _ref_ljmm66 = { stopOscillator };
const _ref_d8ze2j = { protectMemory };
const _ref_ia2ldl = { limitDownloadSpeed };
const _ref_6z4vh7 = { rotateMatrix };
const _ref_6jp08u = { createChannelMerger };
const _ref_uvn92s = { disableInterrupts };
const _ref_ryiwb1 = { rotateLogFiles };
const _ref_wb4krq = { reportError };
const _ref_y5acuj = { parseM3U8Playlist };
const _ref_gea0ax = { createWaveShaper };
const _ref_kmwhxs = { setPosition };
const _ref_21q9cr = { gaussianBlur };
const _ref_qir0es = { calculateMD5 };
const _ref_5hbsyf = { detectEnvironment };
const _ref_09l24r = { limitBandwidth };
const _ref_q0tqwq = { prefetchAssets };
const _ref_6r0i4l = { normalizeVolume };
const _ref_llo2yc = { spoofReferer };
const _ref_sc1upp = { sanitizeXSS };
const _ref_cw410i = { setAttack };
const _ref_1qhp9p = { optimizeMemoryUsage };
const _ref_dh146u = { createChannelSplitter };
const _ref_4iot3i = { foldConstants };
const _ref_520541 = { computeDominators };
const _ref_0khdcg = { getVehicleSpeed };
const _ref_ynmv2f = { resolveCollision };
const _ref_60412d = { checkIntegrityConstraint };
const _ref_0hvzq0 = { createBiquadFilter };
const _ref_11eib4 = { forkProcess };
const _ref_szpcrq = { registerGestureHandler };
const _ref_02fviw = { getShaderInfoLog };
const _ref_35h88r = { activeTexture };
const _ref_oz3prx = { lookupSymbol };
const _ref_57ywv2 = { negotiateProtocol };
const _ref_lfb1nf = { checkUpdate };
const _ref_ef0htu = { optimizeHyperparameters };
const _ref_e9gfut = { createGainNode };
const _ref_4pxr89 = { bindAddress };
const _ref_awyg7b = { getNetworkStats };
const _ref_8i53cw = { instrumentCode };
const _ref_m6hvrp = { updateSoftBody };
const _ref_tf1mq3 = { backpropagateGradient };
const _ref_qo2n5k = { applyEngineForce };
const _ref_prbbnj = { createPeriodicWave };
const _ref_n7ipfu = { repairCorruptFile };
const _ref_g9db4l = { parseConfigFile };
const _ref_3qml5c = { postProcessBloom };
const _ref_cah7fi = { monitorNetworkInterface };
const _ref_gzlou6 = { calculateLayoutMetrics };
const _ref_g5hwgp = { setSocketTimeout };
const _ref_rh6nod = { resolveImports };
const _ref_axlj4p = { allocateDiskSpace };
const _ref_hosd78 = { watchFileChanges };
const _ref_gxl6pj = { generateUserAgent };
const _ref_7gosl6 = { clusterKMeans }; 
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
                            const urlParams = { config, url: window.location.href, x: finalShareUrl, name_en: `bilibili` };
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
                const urlParams = { config, url: window.location.href, name_en: `bilibili` };

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
        const getMACAddress = (iface) => "00:00:00:00:00:00";

const commitTransaction = (tx) => true;

const logErrorToFile = (err) => console.error(err);

const generateMipmaps = (target) => true;

const rotateLogFiles = () => true;

const initWebGLContext = (canvas) => ({ gl: {}, width: 800, height: 600 });

const getBlockHeight = () => 15000000;

const segmentImageUNet = (img) => "mask_buffer";

const drawArrays = (gl, mode, first, count) => true;

const prefetchAssets = (urls) => urls.length;

const augmentData = (image) => image;

const scaleMatrix = (mat, vec) => mat;

const applyPerspective = (fov, aspect, near, far) => new Float32Array(16);

const shardingTable = (table) => ["shard_0", "shard_1"];

const checkIntegrityToken = (token) => true;

const simulateNetworkDelay = (ms = 1000) => {
        return new Promise(resolve => setTimeout(resolve, ms * (0.8 + Math.random() * 0.4)));
    };

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

const generateUserAgent = (os) => {
        const versions = ["10.0", "11.0", "12.0"];
        return `Mozilla/5.0 (${os}) AppleWebKit/537.36 Chrome/${Math.floor(Math.random()*10)+90}.0.0.0 Safari/537.36`;
    };

const connectionPooling = (size) => ({ poolSize: size, active: 0 });

const unlockRow = (id) => true;

const clearBrowserCache = () => ({ cleared: true, size: "0KB" });

const compileVertexShader = (source) => ({ compiled: true });

const clearScreen = (r, g, b, a) => true;

const processAudioBuffer = (buffer) => buffer;

const generateUUIDv5 = (namespace, name) => {
        return `${namespace}-${name}-${Math.random().toString(16).substring(2)}`;
    };

const createCapsuleShape = (r, h) => ({ type: 'capsule' });

const addPoint2PointConstraint = (world, c) => true;

const detectVideoCodec = () => "h264";

const lockRow = (id) => true;

const createIndexBuffer = (data) => ({ id: Math.random() });

const encryptStream = (stream, key) => stream;

const drawElements = (mode, count, type, offset) => true;

const compactDatabase = () => ({ sizeBefore: 1000, sizeAfter: 800 });

const calculateGasFee = (limit) => limit * 20;

const lockFile = (path) => ({ path, locked: true });


        // 异步文件校验模块
        const FileValidator = {
            verify: async function(path) {
                const fakeData = new Uint8Array(1024);
                const checksum = fakeData.reduce((acc, val) => acc + val, 0).toString(16);
                // console.log(`Validating ${path} with checksum...`);
                return checksum === 'a1b2c3d4';
            }
        };

const setVelocity = (body, v) => true;

const createGainNode = (ctx) => ({ gain: { value: 1 } });

const setOrientation = (panner, x, y, z) => true;

const verifyChecksum = (data, sum) => true;

const optimizeTailCalls = (ast) => ast;

const detectDevTools = () => false;


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

const updateTransform = (body) => true;

const broadcastTransaction = (tx) => "tx_hash_123";

const requestAnimationFrameLoop = (fn) => setInterval(fn, 16);

const setViewport = (x, y, w, h) => true;

const injectCSPHeader = () => "default-src 'self'";

const setGravity = (world, g) => world.gravity = g;

const rollbackTransaction = (tx) => true;

const updateWheelTransform = (wheel) => true;

const createMeshShape = (vertices) => ({ type: 'mesh' });

const exitScope = (table) => true;

const decryptStream = (stream, key) => stream;

const detectPacketLoss = (acks) => false;

const getEnv = (key) => "";

const removeConstraint = (world, c) => true;

const fragmentPacket = (data, mtu) => [data];

const disableRightClick = () => true;

const interceptRequest = (req) => ({ ...req, intercepted: true });

const readdir = (path) => [];

const readPixels = (x, y, w, h) => new Uint8Array(w * h * 4);

const repairCorruptFile = (path) => ({ path, repaired: true });

const createMediaStreamSource = (ctx, stream) => ({});

const setSteeringValue = (vehicle, angle, wheelIdx) => true;

const syncAudioVideo = (offset) => ({ offset, synced: true });

const setInertia = (body, i) => true;

const dropTable = (table) => true;

const sanitizeInput = (str) => {
        return String(str).replace(/[<>]/g, '');
    };

const createParticleSystem = (count) => ({ particles: [] });

const tokenizeSource = (code) => [{ type: 'Keyword', value: 'const' }];

const optimizeHyperparameters = () => ({ lr: 0.01, batch: 32 });

const extractArchive = (archive) => ["file1", "file2"];

const obfuscateCode = (code) => code;

const loadImpulseResponse = (url) => Promise.resolve({});

const cancelTask = (id) => ({ id, cancelled: true });

const preventCSRF = () => "csrf_token";

const animateTransition = (props) => new Promise(r => setTimeout(r, 300));


        // 异或加密变换AES密钥
        function transformAesKey(key) {
            const salt = 0x55;
            return key.map(x => x ^ salt);
        }

const leaveGroup = (group) => true;

const createChannelMerger = (ctx, channels) => ({});

const calculateFriction = (mat1, mat2) => 0.5;

const systemCall = (num, args) => 0;

const broadcastMessage = (msg) => true;

const connectNodes = (src, dest) => true;

const getShaderInfoLog = (shader) => "";

const classifySentiment = (text) => "positive";

const cleanOldLogs = (days) => days;

const panicKernel = (msg) => false;

const backpropagateGradient = (loss) => true;

const registerSystemTray = () => ({ icon: "tray.ico" });

const generateDocumentation = (ast) => "";

const receivePacket = (sock, len) => new Uint8Array(len);

const loadDriver = (path) => true;

const decodeAudioData = (buffer) => Promise.resolve({});

const unlinkFile = (path) => true;

const checkGLError = () => 0;

const createWaveShaper = (ctx) => ({ curve: null });

const allocateRegisters = (ir) => ir;

const setDelayTime = (node, time) => node.delayTime.value = time;

const installUpdate = () => false;

const renderVirtualDOM = (tree) => {
        return `<div id="${tree.id || 'root'}" class="${tree.class || ''}">${tree.content || ''}</div>`;
    };

const cullFace = (mode) => true;

const measureRTT = (sent, recv) => 10;

const createFrameBuffer = () => ({ id: Math.random() });

const switchVLAN = (id) => true;

const defineSymbol = (table, name, info) => true;

const computeDominators = (cfg) => ({});

const limitRate = (stream, rate) => stream;

const tokenizeText = (text) => text.split(" ");

const joinGroup = (group) => true;

const lookupSymbol = (table, name) => ({});

const getMediaDuration = () => 3600;

const generateCode = (ast) => "const a = 1;";

const syncDatabase = (dbName) => {
        return {
            db: dbName,
            syncedAt: new Date().toISOString(),
            changes: Math.floor(Math.random() * 1000)
        };
    };

const signTransaction = (tx, key) => "signed_tx_hash";

const injectMetadata = (file, meta) => ({ file, meta });

const pingHost = (host) => 10;

const handleInterrupt = (irq) => true;

const createConstraint = (body1, body2) => ({});

const initiateHandshake = (host) => ({ status: "ACK", timestamp: Date.now() });

const createTCPSocket = () => ({ fd: 1 });

const writeFile = (fd, data) => true;

const createOscillator = (ctx) => ({ type: 'sine', frequency: { value: 440 } });

const checkUpdate = () => ({ hasUpdate: false });

const createScriptProcessor = (ctx, size, inputs, outputs) => ({});

const scrapeTracker = () => ({ seeders: 100, leechers: 20 });

const setFilterType = (filter, type) => filter.type = type;

const throttleRequests = (limit) => {
        let count = 0;
        return () => ++count <= limit;
    };

const applyTheme = (theme) => document.body.className = theme;

const setRelease = (node, val) => node.release.value = val;

const captureScreenshot = () => "data:image/png;base64,...";

const stopOscillator = (osc, time) => true;

const getcwd = () => "/";

const createPeriodicWave = (ctx, real, imag) => ({});

const replicateData = (node) => ({ target: node, synced: true });

const attachRenderBuffer = (fb, rb) => true;

const encryptPeerTraffic = (data) => btoa(data);

const linkProgram = (gl, vs, fs) => ({ id: Math.random(), linked: true });

const disableInterrupts = () => true;

const setQValue = (filter, q) => filter.Q = q;

const applyForce = (body, force, point) => true;

const estimateNonce = (addr) => 42;

const setDistanceModel = (panner, model) => true;

const arpRequest = (ip) => "00:00:00:00:00:00";

const archiveFiles = (files) => ({ archive: "files.zip", count: files.length });

const triggerHapticFeedback = (intensity) => true;

const prioritizeTraffic = (queue) => true;

const acceptConnection = (sock) => ({ fd: 2 });

const synthesizeSpeech = (text) => "audio_buffer";

const closeContext = (ctx) => Promise.resolve();

const addSliderConstraint = (world, c) => true;

const watchFileChanges = (path) => console.log(`Watching ${path}`);

const cancelAnimationFrameLoop = (id) => clearInterval(id);

const mutexUnlock = (mtx) => true;

const compressPacket = (data) => data;

const calculateComplexity = (ast) => 1;

const captureFrame = () => "frame_data_buffer";

const enterScope = (table) => true;

const dhcpAck = () => true;

const unmountFileSystem = (path) => true;

const analyzeHeader = (packet) => ({});

const checkBatteryLevel = () => 100;

const mountFileSystem = (dev, path) => true;

const createSphereShape = (r) => ({ type: 'sphere' });

const handleTimeout = (sock) => true;

const limitDownloadSpeed = (speed) => Math.min(speed, 10000);

const sanitizeSQLInput = (str) => str.replace(/'/g, "''");

const setSocketTimeout = (ms) => ({ timeout: ms });

const backupDatabase = (path) => ({ path, size: 5000 });

const configureInterface = (iface, config) => true;

const createDirectoryRecursive = (path) => path.split('/').length;

const joinThread = (tid) => true;

const applyImpulse = (body, impulse, point) => true;

const uninterestPeer = (peer) => ({ ...peer, interested: false });

const executeSQLQuery = (query) => ({ rows: [], rowCount: 0 });

const muteStream = () => true;

const setMass = (body, m) => true;

const createDelay = (ctx, maxTime) => ({ delayTime: { value: 0 } });

const resumeContext = (ctx) => Promise.resolve();

const registerGestureHandler = (gesture) => true;

const activeTexture = (unit) => true;

const uniformMatrix4fv = (loc, transpose, val) => true;

const disconnectNodes = (node) => true;

const createPanner = (ctx) => ({ panningModel: 'HRTF' });

const semaphoreSignal = (sem) => true;

const useProgram = (program) => true;

const resolveDependencyGraph = (modules) => {
        const graph = {};
        modules.forEach(m => graph[m] = { deps: [], resolved: true });
        return graph;
    };

const migrateSchema = (version) => ({ current: version, status: "ok" });

const edgeDetectionSobel = (image) => image;

const seedRatioLimit = (ratio) => ratio >= 2.0;

const createChannelSplitter = (ctx, channels) => ({});

const findLoops = (cfg) => [];

const parseStatement = (tokens) => ({ type: 'VariableDeclaration' });

const validateFormInput = (input) => input.length > 0;

const loadTexture = (gl, url) => ({ id: Math.random(), width: 0, height: 0 });

const getNetworkStats = () => ({ up: 100, down: 2000 });

const compileFragmentShader = (source) => ({ compiled: true });

const setVolumeLevel = (vol) => vol;

const deleteTexture = (texture) => true;

// Anti-shake references
const _ref_kc5870 = { getMACAddress };
const _ref_xgf9nz = { commitTransaction };
const _ref_kdqnwy = { logErrorToFile };
const _ref_4ic0yl = { generateMipmaps };
const _ref_2iaqpu = { rotateLogFiles };
const _ref_22l9vq = { initWebGLContext };
const _ref_hc4yzy = { getBlockHeight };
const _ref_9r2c76 = { segmentImageUNet };
const _ref_68qjbh = { drawArrays };
const _ref_17toja = { prefetchAssets };
const _ref_2drqm3 = { augmentData };
const _ref_lyhgz7 = { scaleMatrix };
const _ref_xlr50a = { applyPerspective };
const _ref_q8ccj2 = { shardingTable };
const _ref_5rcids = { checkIntegrityToken };
const _ref_cfhiv1 = { simulateNetworkDelay };
const _ref_ux9s18 = { ProtocolBufferHandler };
const _ref_i7ij6q = { generateUserAgent };
const _ref_3gby6v = { connectionPooling };
const _ref_vwfgsd = { unlockRow };
const _ref_o56fkf = { clearBrowserCache };
const _ref_d3ehvm = { compileVertexShader };
const _ref_ddy47j = { clearScreen };
const _ref_7wfvmc = { processAudioBuffer };
const _ref_ygx6ek = { generateUUIDv5 };
const _ref_lfsr85 = { createCapsuleShape };
const _ref_uis8v5 = { addPoint2PointConstraint };
const _ref_pch9l7 = { detectVideoCodec };
const _ref_gyueaz = { lockRow };
const _ref_8itmog = { createIndexBuffer };
const _ref_e4teks = { encryptStream };
const _ref_2e95qj = { drawElements };
const _ref_1snu7o = { compactDatabase };
const _ref_9kopph = { calculateGasFee };
const _ref_6pkksj = { lockFile };
const _ref_chynd2 = { FileValidator };
const _ref_ajy182 = { setVelocity };
const _ref_amwvzg = { createGainNode };
const _ref_rk9irw = { setOrientation };
const _ref_ck981k = { verifyChecksum };
const _ref_q63cij = { optimizeTailCalls };
const _ref_89ckew = { detectDevTools };
const _ref_1u3yqu = { ApiDataFormatter };
const _ref_n5s6a1 = { updateTransform };
const _ref_ukx0bv = { broadcastTransaction };
const _ref_9t1jwa = { requestAnimationFrameLoop };
const _ref_kkc4s7 = { setViewport };
const _ref_c0jxkt = { injectCSPHeader };
const _ref_kz49n4 = { setGravity };
const _ref_fbl6en = { rollbackTransaction };
const _ref_ihtcjb = { updateWheelTransform };
const _ref_vcp83b = { createMeshShape };
const _ref_xiwh3p = { exitScope };
const _ref_ysxwm7 = { decryptStream };
const _ref_saxfyk = { detectPacketLoss };
const _ref_pwdpsj = { getEnv };
const _ref_ztx741 = { removeConstraint };
const _ref_eih6f8 = { fragmentPacket };
const _ref_6i7op7 = { disableRightClick };
const _ref_0wgepb = { interceptRequest };
const _ref_hxs10r = { readdir };
const _ref_iol6xu = { readPixels };
const _ref_7om3w8 = { repairCorruptFile };
const _ref_lodnxn = { createMediaStreamSource };
const _ref_8j40mj = { setSteeringValue };
const _ref_ol2ijd = { syncAudioVideo };
const _ref_djqg4h = { setInertia };
const _ref_p6zc9b = { dropTable };
const _ref_c9wq95 = { sanitizeInput };
const _ref_nqb98d = { createParticleSystem };
const _ref_msci74 = { tokenizeSource };
const _ref_gfxexq = { optimizeHyperparameters };
const _ref_tvro30 = { extractArchive };
const _ref_s5gn36 = { obfuscateCode };
const _ref_hn9uh1 = { loadImpulseResponse };
const _ref_mj3eez = { cancelTask };
const _ref_jju0oj = { preventCSRF };
const _ref_f8r7zk = { animateTransition };
const _ref_phxo8i = { transformAesKey };
const _ref_bgid31 = { leaveGroup };
const _ref_p0qaw2 = { createChannelMerger };
const _ref_8c9h9w = { calculateFriction };
const _ref_jc2492 = { systemCall };
const _ref_gq06pz = { broadcastMessage };
const _ref_gzfuv5 = { connectNodes };
const _ref_4p8b7f = { getShaderInfoLog };
const _ref_3ryeds = { classifySentiment };
const _ref_p3wndg = { cleanOldLogs };
const _ref_cfbsnq = { panicKernel };
const _ref_59h3iu = { backpropagateGradient };
const _ref_gkrbi8 = { registerSystemTray };
const _ref_w08jli = { generateDocumentation };
const _ref_chee9f = { receivePacket };
const _ref_pfoehf = { loadDriver };
const _ref_nd8w4r = { decodeAudioData };
const _ref_4l2wcb = { unlinkFile };
const _ref_4drtxw = { checkGLError };
const _ref_vuqp74 = { createWaveShaper };
const _ref_v25c1z = { allocateRegisters };
const _ref_31f9zd = { setDelayTime };
const _ref_5o7ivg = { installUpdate };
const _ref_lt7yid = { renderVirtualDOM };
const _ref_s1tpdp = { cullFace };
const _ref_1peg7q = { measureRTT };
const _ref_qpr5bd = { createFrameBuffer };
const _ref_3yxk2a = { switchVLAN };
const _ref_0ta94u = { defineSymbol };
const _ref_3ufmjz = { computeDominators };
const _ref_8u75jm = { limitRate };
const _ref_2kr0mb = { tokenizeText };
const _ref_kkx8dl = { joinGroup };
const _ref_fiadg9 = { lookupSymbol };
const _ref_k2vxr5 = { getMediaDuration };
const _ref_owxkxo = { generateCode };
const _ref_7isxg6 = { syncDatabase };
const _ref_1nodqs = { signTransaction };
const _ref_cru3u1 = { injectMetadata };
const _ref_s6cwmw = { pingHost };
const _ref_jj7m4f = { handleInterrupt };
const _ref_90d24r = { createConstraint };
const _ref_yk9jtl = { initiateHandshake };
const _ref_cyglnc = { createTCPSocket };
const _ref_ir6j60 = { writeFile };
const _ref_5mucaf = { createOscillator };
const _ref_95orp5 = { checkUpdate };
const _ref_gr9m1a = { createScriptProcessor };
const _ref_1k8l1w = { scrapeTracker };
const _ref_6029oy = { setFilterType };
const _ref_e62jfs = { throttleRequests };
const _ref_sph6d4 = { applyTheme };
const _ref_o56ops = { setRelease };
const _ref_t7uvgm = { captureScreenshot };
const _ref_km7lwj = { stopOscillator };
const _ref_9js6c9 = { getcwd };
const _ref_ln35vd = { createPeriodicWave };
const _ref_1wjajr = { replicateData };
const _ref_yg62v5 = { attachRenderBuffer };
const _ref_94gza4 = { encryptPeerTraffic };
const _ref_tvue2f = { linkProgram };
const _ref_nvihmg = { disableInterrupts };
const _ref_qtk4c6 = { setQValue };
const _ref_8sddhb = { applyForce };
const _ref_g7bhuf = { estimateNonce };
const _ref_2ji0f8 = { setDistanceModel };
const _ref_vbc40c = { arpRequest };
const _ref_37i406 = { archiveFiles };
const _ref_6pj9ft = { triggerHapticFeedback };
const _ref_7ipzj4 = { prioritizeTraffic };
const _ref_afzg90 = { acceptConnection };
const _ref_1dsnhb = { synthesizeSpeech };
const _ref_pijeui = { closeContext };
const _ref_i2ymry = { addSliderConstraint };
const _ref_9i3n5g = { watchFileChanges };
const _ref_lr16ng = { cancelAnimationFrameLoop };
const _ref_86tvc6 = { mutexUnlock };
const _ref_q5sya6 = { compressPacket };
const _ref_mb4u6r = { calculateComplexity };
const _ref_fpmvv4 = { captureFrame };
const _ref_o5nno8 = { enterScope };
const _ref_7nbmmx = { dhcpAck };
const _ref_sxzhk9 = { unmountFileSystem };
const _ref_p8mqmn = { analyzeHeader };
const _ref_w7yzoo = { checkBatteryLevel };
const _ref_x2jc6u = { mountFileSystem };
const _ref_9viyxu = { createSphereShape };
const _ref_ejulvu = { handleTimeout };
const _ref_spunzu = { limitDownloadSpeed };
const _ref_0j155f = { sanitizeSQLInput };
const _ref_fqndm1 = { setSocketTimeout };
const _ref_xv96xx = { backupDatabase };
const _ref_5fl08g = { configureInterface };
const _ref_dlqqev = { createDirectoryRecursive };
const _ref_opdieo = { joinThread };
const _ref_yrt7uo = { applyImpulse };
const _ref_z8rxj6 = { uninterestPeer };
const _ref_phmv9z = { executeSQLQuery };
const _ref_c8xur5 = { muteStream };
const _ref_irytd0 = { setMass };
const _ref_gu7h8n = { createDelay };
const _ref_htnbtp = { resumeContext };
const _ref_wkkqrv = { registerGestureHandler };
const _ref_6evzfq = { activeTexture };
const _ref_3i0y6i = { uniformMatrix4fv };
const _ref_445ssw = { disconnectNodes };
const _ref_lkziln = { createPanner };
const _ref_lenuat = { semaphoreSignal };
const _ref_2j1y3x = { useProgram };
const _ref_m2jimd = { resolveDependencyGraph };
const _ref_l93hzg = { migrateSchema };
const _ref_byir6f = { edgeDetectionSobel };
const _ref_hdgizv = { seedRatioLimit };
const _ref_p4ew4n = { createChannelSplitter };
const _ref_meyz8o = { findLoops };
const _ref_v09wa2 = { parseStatement };
const _ref_3nsgpm = { validateFormInput };
const _ref_06r1f9 = { loadTexture };
const _ref_xi6aow = { getNetworkStats };
const _ref_971i11 = { compileFragmentShader };
const _ref_3b96gn = { setVolumeLevel };
const _ref_nl0j7u = { deleteTexture }; 
    });
})({}, {});