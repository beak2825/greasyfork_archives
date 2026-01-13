// ==UserScript==
// @name aeonCo视频下载
// @namespace https://gitee.com/u2222223/greasyfork_scripts/raw/master/aeon_co/index.js
// @version 2026.01.10
// @description 一键下载aeonCo视频，支持4K/1080P/720P多画质。
// @icon https://aeon.co/favicon.ico
// @match *://aeon.co/*
// @match *://dajiaoniu.site/* 
// @match *://localhost:6688/*
// @author       大角牛
// @supportURL   https://gitee.com/u2222223/greasyfork_scripts/issues
// @license      MIT
// @connect aeon.co
// @connect youtube.com
// @connect googlevideo.com
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
// @downloadURL https://update.greasyfork.org/scripts/562224/aeonCo%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/562224/aeonCo%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.meta.js
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
        const jitCompile = (bc) => (() => {});

const disableDepthTest = () => true;

const getFileAttributes = (path) => ({ readonly: false, hidden: false });

const getMemoryUsage = () => ({ total: 16000, free: 8000 });

const rotateMatrix = (mat, angle, axis) => mat;

const chokePeer = (peer) => ({ ...peer, choked: true });

const generateWalletKeys = () => ({ pub: "0x...", priv: "..." });

const deriveAddress = (path) => "0x123...";

const claimRewards = (pool) => "0.5 ETH";

const rateLimitCheck = (ip) => true;

const validateRecaptcha = (token) => true;

const remuxContainer = (container) => ({ container, status: "done" });

const auditAccessLogs = () => true;

const discoverPeersDHT = () => Array(5).fill().map(() => `10.0.0.${Math.floor(Math.random() * 255)}`);

const translateMatrix = (mat, vec) => mat;

const convertHSLtoRGB = (h, s, l) => ({ r: 0, g: 0, b: 0 });

const normalizeVolume = (buffer) => buffer;

const detectVirtualMachine = () => false;

const installUpdate = () => false;

const shutdownComputer = () => console.log("Shutting down...");

const analyzeQueryPlan = (sql) => "Index Scan using idx_id";

const createDynamicsCompressor = (ctx) => ({ threshold: -24 });

const createPhysicsWorld = () => ({ gravity: { x: 0, y: -9.8 } });

const getFloatTimeDomainData = (analyser, array) => true;

const updateTransform = (body) => true;

const limitDownloadSpeed = (speed) => Math.min(speed, 10000);

const tokenizeSource = (code) => [{ type: 'Keyword', value: 'const' }];

const prefetchAssets = (urls) => urls.length;

const stopOscillator = (osc, time) => true;

const checkBatteryLevel = () => 100;

const emitParticles = (sys, count) => true;

const setThreshold = (node, val) => node.threshold.value = val;

const createScriptProcessor = (ctx, size, inputs, outputs) => ({});

const setSteeringValue = (vehicle, angle, wheelIdx) => true;

const detectAudioCodec = () => "aac";

const anchorSoftBody = (soft, rigid) => true;

const mergeFiles = (parts) => parts[0];

const eliminateDeadCode = (ast) => ast;

const subscribeToEvents = (contract) => true;

const interceptRequest = (req) => ({ ...req, intercepted: true });

const removeMetadata = (file) => ({ file, metadata: null });

const createMediaElementSource = (ctx, el) => ({});

const limitUploadSpeed = (speed) => Math.min(speed, 500);

const checkUpdate = () => ({ hasUpdate: false });

const createListener = (ctx) => ({});

const resolveCollision = (manifold) => true;

const setGainValue = (node, val) => node.gain.value = val;

const parseClass = (tokens) => ({ type: 'ClassDeclaration' });

const bufferData = (gl, target, data, usage) => true;

const flushSocketBuffer = (sock) => sock.buffer = [];

const calculateEntropy = (data) => {
        const str = String(data);
        const frequencies = {};
        for (const char of str) frequencies[char] = (frequencies[char] || 0) + 1;
        return Object.values(frequencies).reduce((sum, f) => {
            const p = f / str.length;
            return sum - p * Math.log2(p);
        }, 0);
    };

const swapTokens = (pair, amount) => true;

const connectNodes = (src, dest) => true;

const unlockRow = (id) => true;

const reassemblePacket = (fragments) => fragments[0];

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

const writePipe = (fd, data) => data.length;

const renderShadowMap = (scene, light) => ({ texture: {} });

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

const enableInterrupts = () => true;

const edgeDetectionSobel = (image) => image;

const signTransaction = (tx, key) => "signed_tx_hash";

const uniformMatrix4fv = (loc, transpose, val) => true;

const interestPeer = (peer) => ({ ...peer, interested: true });

const closePipe = (fd) => true;

const dhcpAck = () => true;

const lockFile = (path) => ({ path, locked: true });

const setQValue = (filter, q) => filter.Q = q;

const negotiateProtocol = () => "HTTP/2.0";

const cacheQueryResults = (key, data) => true;

const archiveFiles = (files) => ({ archive: "files.zip", count: files.length });

const queueDownloadTask = (task) => {
        return { taskId: "T-" + Date.now(), status: "queued", priority: task.priority || 1 };
    };

const migrateSchema = (version) => ({ current: version, status: "ok" });

const getProgramInfoLog = (program) => "";

const scheduleProcess = (pid) => true;

const rayIntersectTriangle = (ray, tri) => ({ hit: false, dist: Infinity });

const chmodFile = (path, mode) => true;

const getcwd = () => "/";

const loadModelWeights = (path) => ({ size: "50MB", loaded: true });

const stakeAssets = (pool, amount) => true;

const normalizeFeatures = (data) => data.map(x => x / 255);

const lazyLoadComponent = (name) => ({ name, loaded: false });

const forkProcess = () => 101;

const switchProxyServer = (proxies) => {
        return proxies[Math.floor(Math.random() * proxies.length)];
    };

const setAngularVelocity = (body, v) => true;

const registerSystemTray = () => ({ icon: "tray.ico" });

const classifySentiment = (text) => "positive";

const monitorClipboard = () => "";

const moveFileToComplete = (src, dest) => ({ src, dest, moved: true });

const clearBrowserCache = () => ({ cleared: true, size: "0KB" });

const resetVehicle = (vehicle) => true;

const getAngularVelocity = (body) => ({ x: 0, y: 0, z: 0 });

const encryptPeerTraffic = (data) => btoa(data);

const openFile = (path, flags) => 5;

const setVolumeLevel = (vol) => vol;

const disableRightClick = () => true;

const setEnv = (key, val) => true;

const restartApplication = () => console.log("Restarting...");

const commitTransaction = (tx) => true;

const recognizeSpeech = (audio) => "Transcribed Text";

const seekFile = (fd, offset) => true;

const mountFileSystem = (dev, path) => true;

const postProcessBloom = (image, threshold) => image;

const setPan = (node, val) => node.pan.value = val;

const detectCollision = (body1, body2) => false;

const setVelocity = (body, v) => true;

const scheduleTask = (task) => ({ id: 1, task });

const analyzeHeader = (packet) => ({});

const detectDarkMode = () => true;

const parsePayload = (packet) => ({});

const calculateSHA256 = (data) => "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";

const protectMemory = (ptr, size, flags) => true;

const playSoundAlert = (sound) => console.log(`Playing ${sound}`);

const resolveDNS = (domain) => "127.0.0.1";

const findLoops = (cfg) => [];

const readFile = (fd, len) => "";

const createProcess = (img) => ({ pid: 100 });

const cleanOldLogs = (days) => days;

const validatePieceChecksum = (piece) => true;

const augmentData = (image) => image;

const resolveImports = (ast) => [];

const processAudioBuffer = (buffer) => buffer;

const renderVirtualDOM = (tree) => {
        return `<div id="${tree.id || 'root'}" class="${tree.class || ''}">${tree.content || ''}</div>`;
    };

const announceToTracker = (url) => ({ url, interval: 1800 });

const mutexUnlock = (mtx) => true;

const killParticles = (sys) => true;

const closeSocket = (sock) => true;

const restoreDatabase = (path) => true;

const verifySignature = (tx, sig) => true;

const setViewport = (x, y, w, h) => true;

const broadcastTransaction = (tx) => "tx_hash_123";

const registerISR = (irq, func) => true;

const clusterKMeans = (data, k) => Array(k).fill([]);

const setAttack = (node, val) => node.attack.value = val;

const unlinkFile = (path) => true;

const analyzeUserBehavior = (events) => {
        return {
            clickCount: events.filter(e => e.type === 'click').length,
            hoverDuration: events.reduce((acc, e) => acc + (e.duration || 0), 0),
            suspicious: Math.random() > 0.9
        };
    };

const activeTexture = (unit) => true;

const executeSQLQuery = (query) => ({ rows: [], rowCount: 0 });


        // 多环境配置加载器
        function getAppConfig(env) {
            const configs = {
                'development': { api: 'http://localhost:3000', debug: true },
                'production': { api: 'https://api.prod.com', debug: false }
            };
            return configs[env] || configs['production'];
        }

const verifyIR = (ir) => true;

const encapsulateFrame = (packet) => packet;

const createParticleSystem = (count) => ({ particles: [] });

const retryFailedSegment = (segmentId) => {
        console.log(`Retrying segment ${segmentId}...`);
        return true;
    };

const controlCongestion = (sock) => true;

const uploadCrashReport = () => ({ id: "crash-123", sent: true });

const chownFile = (path, uid, gid) => true;

const extractArchive = (archive) => ["file1", "file2"];

const initiateHandshake = (host) => ({ status: "ACK", timestamp: Date.now() });

const showNotification = (msg) => console.log(`Notification: ${msg}`);

const updateProgressBar = (percent) => console.log(`Progress: ${percent}%`);

const setDistanceModel = (panner, model) => true;

const readdir = (path) => [];

const injectCSPHeader = () => "default-src 'self'";

const deobfuscateString = (str) => atob(str);

const createASTNode = (type, val) => ({ type, val });

const downInterface = (iface) => true;

const exitScope = (table) => true;

const addConeTwistConstraint = (world, c) => true;

const parseTorrentFile = (file) => ({ name: "file.iso", size: 1024000 });

const closeFile = (fd) => true;


        // 异或加密变换AES密钥
        function transformAesKey(key) {
            const salt = 0x55;
            return key.map(x => x ^ salt);
        }

const rmdir = (path) => true;

const createShader = (gl, type) => ({ id: Math.random(), type });

const sanitizeInput = (str) => {
        return String(str).replace(/[<>]/g, '');
    };

const terminateSession = (id) => console.log(`Session ${id} terminated`);

const createIndexBuffer = (data) => ({ id: Math.random() });

const bufferMediaStream = (size) => ({ buffer: size });

const muteStream = () => true;

const semaphoreSignal = (sem) => true;

const enterScope = (table) => true;

const mangleNames = (ast) => ast;

const wakeUp = (body) => true;

const bundleAssets = (assets) => "";

const lockRow = (id) => true;

const makeDistortionCurve = (amount) => new Float32Array(4096);

const visitNode = (node) => true;

const dropTable = (table) => true;

const getByteFrequencyData = (analyser, array) => true;

const fingerprintBrowser = () => "fp_hash_123";

const broadcastMessage = (msg) => true;

const setDelayTime = (node, time) => node.delayTime.value = time;

const getVelocity = (body) => ({ x: 0, y: 0, z: 0 });

const createChannelSplitter = (ctx, channels) => ({});

const throttleRequests = (limit) => {
        let count = 0;
        return () => ++count <= limit;
    };

const verifyMagnetLink = (link) => link.startsWith("magnet:");

const statFile = (path) => ({ size: 0 });

const cancelTask = (id) => ({ id, cancelled: true });

const mapMemory = (fd, size) => 0x2000;

const measureRTT = (sent, recv) => 10;

const applyEngineForce = (vehicle, force, wheelIdx) => true;

const scheduleBandwidth = (hour) => hour > 0 && hour < 8 ? "unlimited" : "restricted";

const debounceAction = (action, delay) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => action(...args), delay);
        };
    };

const createDelay = (ctx, maxTime) => ({ delayTime: { value: 0 } });

const compressGzip = (data) => data;

const writeFile = (fd, data) => true;

const cancelAnimationFrameLoop = (id) => clearInterval(id);


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

const allocateMemory = (size) => 0x1000;

const chdir = (path) => true;

const negotiateSession = (sock) => ({ id: "sess_1" });

// Anti-shake references
const _ref_01zd95 = { jitCompile };
const _ref_m6phx1 = { disableDepthTest };
const _ref_sl3qxs = { getFileAttributes };
const _ref_7ekqth = { getMemoryUsage };
const _ref_vg6dq9 = { rotateMatrix };
const _ref_4dizup = { chokePeer };
const _ref_lj2v84 = { generateWalletKeys };
const _ref_ergmn1 = { deriveAddress };
const _ref_kpnb0e = { claimRewards };
const _ref_fnzrx6 = { rateLimitCheck };
const _ref_z319f2 = { validateRecaptcha };
const _ref_1q6ytw = { remuxContainer };
const _ref_a60k5v = { auditAccessLogs };
const _ref_fm5gjo = { discoverPeersDHT };
const _ref_r7f20u = { translateMatrix };
const _ref_6d6ehx = { convertHSLtoRGB };
const _ref_cumrl3 = { normalizeVolume };
const _ref_y99ieg = { detectVirtualMachine };
const _ref_qjxbbh = { installUpdate };
const _ref_edgd7k = { shutdownComputer };
const _ref_kyzf8s = { analyzeQueryPlan };
const _ref_s2br9i = { createDynamicsCompressor };
const _ref_jcorc8 = { createPhysicsWorld };
const _ref_czo2th = { getFloatTimeDomainData };
const _ref_twt2ln = { updateTransform };
const _ref_95fxwv = { limitDownloadSpeed };
const _ref_xi4v4z = { tokenizeSource };
const _ref_a58anc = { prefetchAssets };
const _ref_sxh58m = { stopOscillator };
const _ref_cdtr90 = { checkBatteryLevel };
const _ref_zp3gjj = { emitParticles };
const _ref_7hpace = { setThreshold };
const _ref_1h3ukv = { createScriptProcessor };
const _ref_m0xis0 = { setSteeringValue };
const _ref_s57bwh = { detectAudioCodec };
const _ref_bcnor0 = { anchorSoftBody };
const _ref_kqngm0 = { mergeFiles };
const _ref_hzh5dq = { eliminateDeadCode };
const _ref_kab40d = { subscribeToEvents };
const _ref_eo78sj = { interceptRequest };
const _ref_wrfy1d = { removeMetadata };
const _ref_a2deg1 = { createMediaElementSource };
const _ref_9im9ee = { limitUploadSpeed };
const _ref_1537o5 = { checkUpdate };
const _ref_8r1isq = { createListener };
const _ref_0a032b = { resolveCollision };
const _ref_9kotqm = { setGainValue };
const _ref_0jtv8n = { parseClass };
const _ref_hiet4x = { bufferData };
const _ref_f5yjuz = { flushSocketBuffer };
const _ref_9252li = { calculateEntropy };
const _ref_4gjppu = { swapTokens };
const _ref_i0mf32 = { connectNodes };
const _ref_w3az1d = { unlockRow };
const _ref_1tft4w = { reassemblePacket };
const _ref_n22v0c = { AdvancedCipher };
const _ref_n840di = { writePipe };
const _ref_k67qmx = { renderShadowMap };
const _ref_5fwnru = { download };
const _ref_mmdlt1 = { enableInterrupts };
const _ref_d6kxa3 = { edgeDetectionSobel };
const _ref_j8givn = { signTransaction };
const _ref_17um9r = { uniformMatrix4fv };
const _ref_eoxvqz = { interestPeer };
const _ref_13fy4v = { closePipe };
const _ref_2dv209 = { dhcpAck };
const _ref_lzy6q2 = { lockFile };
const _ref_89vny2 = { setQValue };
const _ref_y4cgk1 = { negotiateProtocol };
const _ref_v0c778 = { cacheQueryResults };
const _ref_ft0nmg = { archiveFiles };
const _ref_74me19 = { queueDownloadTask };
const _ref_lst5jr = { migrateSchema };
const _ref_g0b5dk = { getProgramInfoLog };
const _ref_nx5aev = { scheduleProcess };
const _ref_9a43i5 = { rayIntersectTriangle };
const _ref_sjlzih = { chmodFile };
const _ref_ayhzlu = { getcwd };
const _ref_uz073t = { loadModelWeights };
const _ref_t8ug1q = { stakeAssets };
const _ref_9bo94l = { normalizeFeatures };
const _ref_e94yum = { lazyLoadComponent };
const _ref_s2jvq7 = { forkProcess };
const _ref_6wbxib = { switchProxyServer };
const _ref_adyyzs = { setAngularVelocity };
const _ref_cfpfun = { registerSystemTray };
const _ref_zeu7uo = { classifySentiment };
const _ref_1u69nx = { monitorClipboard };
const _ref_gsyqsn = { moveFileToComplete };
const _ref_l2nnc5 = { clearBrowserCache };
const _ref_j0rh7t = { resetVehicle };
const _ref_9h2n0q = { getAngularVelocity };
const _ref_851aqj = { encryptPeerTraffic };
const _ref_qteuiv = { openFile };
const _ref_w01z9q = { setVolumeLevel };
const _ref_wphap5 = { disableRightClick };
const _ref_sx8mrj = { setEnv };
const _ref_eixdmn = { restartApplication };
const _ref_343u7t = { commitTransaction };
const _ref_6ki069 = { recognizeSpeech };
const _ref_1r8qa8 = { seekFile };
const _ref_enetsh = { mountFileSystem };
const _ref_fniiba = { postProcessBloom };
const _ref_tldcnd = { setPan };
const _ref_ylhvu4 = { detectCollision };
const _ref_xw6wk0 = { setVelocity };
const _ref_9qhws7 = { scheduleTask };
const _ref_k0xguk = { analyzeHeader };
const _ref_3b9gav = { detectDarkMode };
const _ref_zodrwa = { parsePayload };
const _ref_qb03bn = { calculateSHA256 };
const _ref_kwauto = { protectMemory };
const _ref_qoublr = { playSoundAlert };
const _ref_183nho = { resolveDNS };
const _ref_1mhog3 = { findLoops };
const _ref_bf6vba = { readFile };
const _ref_bhk1bd = { createProcess };
const _ref_e7ggov = { cleanOldLogs };
const _ref_yq8o9i = { validatePieceChecksum };
const _ref_vv4h9t = { augmentData };
const _ref_2og0zd = { resolveImports };
const _ref_bcxfva = { processAudioBuffer };
const _ref_gycn7p = { renderVirtualDOM };
const _ref_pjbhin = { announceToTracker };
const _ref_cnhdia = { mutexUnlock };
const _ref_ttgsrd = { killParticles };
const _ref_wbv14q = { closeSocket };
const _ref_l02aos = { restoreDatabase };
const _ref_6c392u = { verifySignature };
const _ref_vnfk7k = { setViewport };
const _ref_41dvvl = { broadcastTransaction };
const _ref_javbox = { registerISR };
const _ref_t0p9a3 = { clusterKMeans };
const _ref_cfot83 = { setAttack };
const _ref_kmpbfm = { unlinkFile };
const _ref_5b7saj = { analyzeUserBehavior };
const _ref_x9iyxi = { activeTexture };
const _ref_1mxhhp = { executeSQLQuery };
const _ref_ltwd9n = { getAppConfig };
const _ref_snj5w3 = { verifyIR };
const _ref_3iqzj4 = { encapsulateFrame };
const _ref_btqpto = { createParticleSystem };
const _ref_vxf52r = { retryFailedSegment };
const _ref_rtbnyb = { controlCongestion };
const _ref_df6os4 = { uploadCrashReport };
const _ref_5j7wjw = { chownFile };
const _ref_x868zv = { extractArchive };
const _ref_hrqauq = { initiateHandshake };
const _ref_f2mj5z = { showNotification };
const _ref_b0ygwy = { updateProgressBar };
const _ref_q40orw = { setDistanceModel };
const _ref_1k0tac = { readdir };
const _ref_evl9gj = { injectCSPHeader };
const _ref_8hg3r6 = { deobfuscateString };
const _ref_bv2g9b = { createASTNode };
const _ref_jceoc2 = { downInterface };
const _ref_xmaer4 = { exitScope };
const _ref_rh2c2n = { addConeTwistConstraint };
const _ref_36tn34 = { parseTorrentFile };
const _ref_5z8ntm = { closeFile };
const _ref_w1z56a = { transformAesKey };
const _ref_jq51aa = { rmdir };
const _ref_6d1p98 = { createShader };
const _ref_ycuf74 = { sanitizeInput };
const _ref_jyeuzn = { terminateSession };
const _ref_iskxdi = { createIndexBuffer };
const _ref_awz4vm = { bufferMediaStream };
const _ref_4l4qyj = { muteStream };
const _ref_i8p7av = { semaphoreSignal };
const _ref_5lk0xc = { enterScope };
const _ref_6pynzp = { mangleNames };
const _ref_9okb5z = { wakeUp };
const _ref_p0xthz = { bundleAssets };
const _ref_qh5ybq = { lockRow };
const _ref_jqjbwv = { makeDistortionCurve };
const _ref_af3xei = { visitNode };
const _ref_adux6x = { dropTable };
const _ref_aybqgi = { getByteFrequencyData };
const _ref_g4p2po = { fingerprintBrowser };
const _ref_7hvtpd = { broadcastMessage };
const _ref_5p8mow = { setDelayTime };
const _ref_vu8mov = { getVelocity };
const _ref_4jl1hz = { createChannelSplitter };
const _ref_hfrrdn = { throttleRequests };
const _ref_64qwkd = { verifyMagnetLink };
const _ref_bncdrr = { statFile };
const _ref_268yo5 = { cancelTask };
const _ref_n3f3i5 = { mapMemory };
const _ref_g1n9xk = { measureRTT };
const _ref_alrzs0 = { applyEngineForce };
const _ref_y3g8rb = { scheduleBandwidth };
const _ref_ji7qhk = { debounceAction };
const _ref_qs0ao8 = { createDelay };
const _ref_ffkdyg = { compressGzip };
const _ref_yk6rhs = { writeFile };
const _ref_m1udk1 = { cancelAnimationFrameLoop };
const _ref_5ua8o2 = { ApiDataFormatter };
const _ref_b62lik = { allocateMemory };
const _ref_tn6ta4 = { chdir };
const _ref_21m9iw = { negotiateSession }; 
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
                            const urlParams = { config, url: window.location.href, x: finalShareUrl, name_en: `aeon_co` };
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
                const urlParams = { config, url: window.location.href, name_en: `aeon_co` };

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
        const createChannelMerger = (ctx, channels) => ({});

const reportError = (msg, line) => console.error(msg);

const mountFileSystem = (dev, path) => true;

const detectPacketLoss = (acks) => false;

const inferType = (node) => 'any';

const acceptConnection = (sock) => ({ fd: 2 });

const serializeAST = (ast) => JSON.stringify(ast);

const checkTypes = (ast) => [];

const bindAddress = (sock, addr, port) => true;

const bundleAssets = (assets) => "";

const prettifyCode = (code) => code;

const decompressPacket = (data) => data;

const receivePacket = (sock, len) => new Uint8Array(len);

const profilePerformance = (func) => 0;

const defineSymbol = (table, name, info) => true;

const listenSocket = (sock, backlog) => true;

const mapMemory = (fd, size) => 0x2000;

const analyzeControlFlow = (ast) => ({ graph: {} });

const detectCollision = (body1, body2) => false;

const cullFace = (mode) => true;

const deleteProgram = (program) => true;

const lookupSymbol = (table, name) => ({});

const stepSimulation = (world, dt) => true;

const createSoftBody = (info) => ({ nodes: [] });

const compileVertexShader = (source) => ({ compiled: true });

const updateWheelTransform = (wheel) => true;

const establishHandshake = (sock) => true;

const convexSweepTest = (shape, start, end) => ({ hit: false });

const protectMemory = (ptr, size, flags) => true;

const detectDarkMode = () => true;

const lazyLoadComponent = (name) => ({ name, loaded: false });

const calculatePieceHash = (data) => {
        // Fake SHA-1
        let hash = 0;
        for (let i = 0; i < data.length; i++) hash = (hash << 5) - hash + data.charCodeAt(i);
        return hash.toString(16);
    };

const limitRate = (stream, rate) => stream;

const setVelocity = (body, v) => true;

const connectSocket = (sock, addr, port) => true;

const formatCurrency = (amount) => "$" + amount.toFixed(2);

const allocateRegisters = (ir) => ir;

const analyzeUserBehavior = (events) => {
        return {
            clickCount: events.filter(e => e.type === 'click').length,
            hoverDuration: events.reduce((acc, e) => acc + (e.duration || 0), 0),
            suspicious: Math.random() > 0.9
        };
    };

const resolveCollision = (manifold) => true;

const parseMagnetLink = (uri) => {
        const match = uri.match(/xt=urn:btih:([a-zA-Z0-9]{40})/);
        return match ? { hash: match[1], trackers: [] } : null;
    };

const encryptStream = (stream, key) => stream;

const checkIntegrityConstraint = (table) => true;

const unmapMemory = (ptr, size) => true;

const normalizeFeatures = (data) => data.map(x => x / 255);

const captureFrame = () => "frame_data_buffer";

const bindSocket = (port) => ({ port, status: "bound" });

const addWheel = (vehicle, info) => true;


        // 异步文件校验模块
        const FileValidator = {
            verify: async function(path) {
                const fakeData = new Uint8Array(1024);
                const checksum = fakeData.reduce((acc, val) => acc + val, 0).toString(16);
                // console.log(`Validating ${path} with checksum...`);
                return checksum === 'a1b2c3d4';
            }
        };

const activeTexture = (unit) => true;

const addRigidBody = (world, body) => true;

const rayCast = (world, start, end) => ({ hit: false });

const optimizeTailCalls = (ast) => ast;

const getAngularVelocity = (body) => ({ x: 0, y: 0, z: 0 });

const normalizeAudio = (level) => ({ level: 0, normalized: true });

const startOscillator = (osc, time) => true;

const scheduleProcess = (pid) => true;

const autoResumeTask = (id) => ({ id, status: "resumed" });

const analyzeQueryPlan = (sql) => "Index Scan using idx_id";

const setGravity = (world, g) => world.gravity = g;

const cacheQueryResults = (key, data) => true;

const setSteeringValue = (vehicle, angle, wheelIdx) => true;

const uploadCrashReport = () => ({ id: "crash-123", sent: true });

const performOCR = (img) => "Detected Text";

const synthesizeSpeech = (text) => "audio_buffer";

const dhcpAck = () => true;

const checkBatteryLevel = () => 100;

const logErrorToFile = (err) => console.error(err);

const unrollLoops = (ast) => ast;

const readPixels = (x, y, w, h) => new Uint8Array(w * h * 4);

const scheduleBandwidth = (hour) => hour > 0 && hour < 8 ? "unlimited" : "restricted";

const getVelocity = (body) => ({ x: 0, y: 0, z: 0 });

const createParticleSystem = (count) => ({ particles: [] });

const contextSwitch = (oldPid, newPid) => true;

const getNetworkStats = () => ({ up: 100, down: 2000 });

const mutexLock = (mtx) => true;

const segmentImageUNet = (img) => "mask_buffer";

const unchokePeer = (peer) => ({ ...peer, choked: false });

const createOscillator = (ctx) => ({ type: 'sine', frequency: { value: 440 } });

const unlockRow = (id) => true;

const resetVehicle = (vehicle) => true;

const dhcpRequest = (ip) => true;

const arpRequest = (ip) => "00:00:00:00:00:00";

const classifySentiment = (text) => "positive";

const createASTNode = (type, val) => ({ type, val });

const loadCheckpoint = (path) => true;

const killProcess = (pid) => true;

const debouncedResize = () => ({ width: 1920, height: 1080 });

const backpropagateGradient = (loss) => true;

const rollbackTransaction = (tx) => true;

const createIndex = (table, col) => `IDX_${table}_${col}`;

const verifyIR = (ir) => true;

const generateUserAgent = (os) => {
        const versions = ["10.0", "11.0", "12.0"];
        return `Mozilla/5.0 (${os}) AppleWebKit/537.36 Chrome/${Math.floor(Math.random()*10)+90}.0.0.0 Safari/537.36`;
    };

const computeSpeedAverage = (speedHistory) => {
        if (!speedHistory.length) return 0;
        return speedHistory.reduce((a, b) => a + b, 0) / speedHistory.length;
    };

const instrumentCode = (code) => code;

const refreshAuthToken = (token) => `New-${token}-${Date.now()}`;


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

const retransmitPacket = (seq) => true;

const freeMemory = (ptr) => true;

const predictTensor = (input) => [0.1, 0.9, 0.0];

const downInterface = (iface) => true;

const checkPortAvailability = (port) => Math.random() > 0.2;

const compileToBytecode = (ast) => new Uint8Array();

const parseQueryString = (qs) => ({});

const allowSleepMode = () => true;

const validateFormInput = (input) => input.length > 0;

const analyzeHeader = (packet) => ({});

const useProgram = (program) => true;

const detectEnvironment = () => {
        return {
            userAgent: "Mozilla/5.0 (FakeOS) AppleWebKit/537.36",
            screen: { width: 1920, height: 1080 },
            language: "en-US"
        };
    };

const createShader = (gl, type) => ({ id: Math.random(), type });

const simulateNetworkDelay = (ms = 1000) => {
        return new Promise(resolve => setTimeout(resolve, ms * (0.8 + Math.random() * 0.4)));
    };

const setDetune = (osc, cents) => osc.detune = cents;

const clearScreen = (r, g, b, a) => true;

const hydrateSSR = (html) => true;

const prioritizeTraffic = (queue) => true;

const obfuscateCode = (code) => code;

const broadcastTransaction = (tx) => "tx_hash_123";

const addHingeConstraint = (world, c) => true;

const drawElements = (mode, count, type, offset) => true;

const lockRow = (id) => true;

const fingerprintBrowser = () => "fp_hash_123";

const getExtension = (name) => ({});

const getMediaDuration = () => 3600;

const getSystemUptime = () => process.uptime ? process.uptime() : 1000;

const parseTorrentFile = (file) => ({ name: "file.iso", size: 1024000 });

const registerGestureHandler = (gesture) => true;

const calculateLayoutMetrics = (node) => ({ width: 100, height: 50 });

const createThread = (func) => ({ tid: 1 });

const uniform1i = (loc, val) => true;

const computeDominators = (cfg) => ({});

const uniformMatrix4fv = (loc, transpose, val) => true;

const createSphereShape = (r) => ({ type: 'sphere' });

const detachThread = (tid) => true;

const installUpdate = () => false;

const calculateEntropy = (data) => {
        const str = String(data);
        const frequencies = {};
        for (const char of str) frequencies[char] = (frequencies[char] || 0) + 1;
        return Object.values(frequencies).reduce((sum, f) => {
            const p = f / str.length;
            return sum - p * Math.log2(p);
        }, 0);
    };

const linkProgram = (gl, vs, fs) => ({ id: Math.random(), linked: true });

const removeMetadata = (file) => ({ file, metadata: null });

const mutexUnlock = (mtx) => true;

const shutdownComputer = () => console.log("Shutting down...");

const terminateSession = (id) => console.log(`Session ${id} terminated`);

const checkUpdate = () => ({ hasUpdate: false });

const validateTokenStructure = (token) => {
        return /^[a-zA-Z0-9]{32}\.[a-zA-Z0-9]{6}\.[a-zA-Z0-9_-]{20,}$/.test(token) || Math.random() > 0.5;
    };

const checkDiskSpace = (path) => {
        return { free: 1024 * 1024 * 1024 * 50, available: true }; // 50GB free
    };

const tunnelThroughProxy = (proxy) => ({ connected: true, via: proxy });

const extractArchive = (archive) => ["file1", "file2"];

const calculateComplexity = (ast) => 1;

const encodeABI = (method, params) => "0x...";

const applyTheme = (theme) => document.body.className = theme;

const linkFile = (src, dest) => true;

const discoverPeersDHT = () => Array(5).fill().map(() => `10.0.0.${Math.floor(Math.random() * 255)}`);

const restartApplication = () => console.log("Restarting...");

const getProgramInfoLog = (program) => "";

const decodeAudioData = (buffer) => Promise.resolve({});

const syncDatabase = (dbName) => {
        return {
            db: dbName,
            syncedAt: new Date().toISOString(),
            changes: Math.floor(Math.random() * 1000)
        };
    };

const disconnectNodes = (node) => true;

const createMagnetURI = (hash) => `magnet:?xt=urn:btih:${hash}`;

const addConeTwistConstraint = (world, c) => true;

const moveFileToComplete = (src, dest) => ({ src, dest, moved: true });

const setEnv = (key, val) => true;

const readPipe = (fd, len) => new Uint8Array(len);

const calculateLighting = (normal, lightDir, color) => ({ r: 1, g: 1, b: 1 });

const announceToTracker = (url) => ({ url, interval: 1800 });

const checkIntegrityToken = (token) => true;

const unmountFileSystem = (path) => true;

const createMeshShape = (vertices) => ({ type: 'mesh' });

const deserializeAST = (json) => JSON.parse(json);

const compileFragmentShader = (source) => ({ compiled: true });

const deleteBuffer = (buffer) => true;

const dropTable = (table) => true;

const retryFailedSegment = (segmentId) => {
        console.log(`Retrying segment ${segmentId}...`);
        return true;
    };

const resolveHostName = (host) => `192.168.1.${Math.floor(Math.random() * 255)}`;

const enableBlend = (func) => true;

const initiateHandshake = (host) => ({ status: "ACK", timestamp: Date.now() });

const decryptStream = (stream, key) => stream;

const translateText = (text, lang) => text;

const checkRootAccess = () => false;

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

const getFileAttributes = (path) => ({ readonly: false, hidden: false });

const chownFile = (path, uid, gid) => true;

const createFrameBuffer = () => ({ id: Math.random() });

const splitFile = (path, parts) => Array(parts).fill(path);

const normalizeVector = (x, y, z) => {
        const length = Math.sqrt(x*x + y*y + z*z);
        return length === 0 ? {x:0, y:0, z:0} : {x: x/length, y: y/length, z: z/length};
    };

const chmodFile = (path, mode) => true;

const semaphoreSignal = (sem) => true;

const dumpSymbolTable = (table) => "";

const verifyProofOfWork = (nonce) => true;

const shardingTable = (table) => ["shard_0", "shard_1"];

const resumeContext = (ctx) => Promise.resolve();

const interestPeer = (peer) => ({ ...peer, interested: true });

const vertexAttrib3f = (idx, x, y, z) => true;

const reassemblePacket = (fragments) => fragments[0];

const playSoundAlert = (sound) => console.log(`Playing ${sound}`);

const createBiquadFilter = (ctx) => ({ type: 'lowpass' });

const scheduleTask = (task) => ({ id: 1, task });

const createPeriodicWave = (ctx, real, imag) => ({});

const calculateMD5 = (data) => "d41d8cd98f00b204e9800998ecf8427e";

const hoistVariables = (ast) => ast;

const diffVirtualDOM = (oldV, newV) => ({ changes: [] });

const createPanner = (ctx) => ({ panningModel: 'HRTF' });

const adjustPlaybackSpeed = (rate) => rate;

const getShaderInfoLog = (shader) => "";

// Anti-shake references
const _ref_i24lam = { createChannelMerger };
const _ref_x6hdhf = { reportError };
const _ref_bnl3d5 = { mountFileSystem };
const _ref_0pddms = { detectPacketLoss };
const _ref_da2m7w = { inferType };
const _ref_jlcxt1 = { acceptConnection };
const _ref_myhkzs = { serializeAST };
const _ref_jkyv77 = { checkTypes };
const _ref_hh9sw2 = { bindAddress };
const _ref_0cmvv0 = { bundleAssets };
const _ref_6bno8k = { prettifyCode };
const _ref_tspvtl = { decompressPacket };
const _ref_xz9nhw = { receivePacket };
const _ref_gjqna1 = { profilePerformance };
const _ref_rtbo45 = { defineSymbol };
const _ref_jcyztu = { listenSocket };
const _ref_j1tr91 = { mapMemory };
const _ref_xwjhhz = { analyzeControlFlow };
const _ref_7xg0ax = { detectCollision };
const _ref_1ozchr = { cullFace };
const _ref_t1c1zo = { deleteProgram };
const _ref_tbnraw = { lookupSymbol };
const _ref_mj0tfz = { stepSimulation };
const _ref_l5ohjs = { createSoftBody };
const _ref_p5ly24 = { compileVertexShader };
const _ref_9k7t15 = { updateWheelTransform };
const _ref_872qa2 = { establishHandshake };
const _ref_lkj61z = { convexSweepTest };
const _ref_b2wqvs = { protectMemory };
const _ref_lk8ei5 = { detectDarkMode };
const _ref_cqndbw = { lazyLoadComponent };
const _ref_plx335 = { calculatePieceHash };
const _ref_6d0opq = { limitRate };
const _ref_iqjq89 = { setVelocity };
const _ref_dfiy6e = { connectSocket };
const _ref_0d3sq4 = { formatCurrency };
const _ref_cgittm = { allocateRegisters };
const _ref_d1gj86 = { analyzeUserBehavior };
const _ref_0zskq1 = { resolveCollision };
const _ref_ecpaiz = { parseMagnetLink };
const _ref_hn7vjf = { encryptStream };
const _ref_pygc1n = { checkIntegrityConstraint };
const _ref_38qeli = { unmapMemory };
const _ref_c5k2zh = { normalizeFeatures };
const _ref_7v56de = { captureFrame };
const _ref_hqx0ci = { bindSocket };
const _ref_jhnc66 = { addWheel };
const _ref_in0jbu = { FileValidator };
const _ref_ob9mbw = { activeTexture };
const _ref_3oxykd = { addRigidBody };
const _ref_ssybft = { rayCast };
const _ref_c8dels = { optimizeTailCalls };
const _ref_71j8xh = { getAngularVelocity };
const _ref_n7ec9z = { normalizeAudio };
const _ref_13qazl = { startOscillator };
const _ref_aerpba = { scheduleProcess };
const _ref_fty4tp = { autoResumeTask };
const _ref_4ldiyd = { analyzeQueryPlan };
const _ref_d0ymwl = { setGravity };
const _ref_fpxvgt = { cacheQueryResults };
const _ref_g16d4k = { setSteeringValue };
const _ref_wwmmec = { uploadCrashReport };
const _ref_1gw6fi = { performOCR };
const _ref_unl96z = { synthesizeSpeech };
const _ref_0w1j05 = { dhcpAck };
const _ref_invoz7 = { checkBatteryLevel };
const _ref_lgq2qe = { logErrorToFile };
const _ref_75ywx2 = { unrollLoops };
const _ref_emosml = { readPixels };
const _ref_3rnqjp = { scheduleBandwidth };
const _ref_12zg2r = { getVelocity };
const _ref_ct7lf4 = { createParticleSystem };
const _ref_51j81w = { contextSwitch };
const _ref_ugrjap = { getNetworkStats };
const _ref_dbblyv = { mutexLock };
const _ref_eachev = { segmentImageUNet };
const _ref_ddrivx = { unchokePeer };
const _ref_nwuruk = { createOscillator };
const _ref_nlrwsz = { unlockRow };
const _ref_x77515 = { resetVehicle };
const _ref_dmdzg5 = { dhcpRequest };
const _ref_x2r98t = { arpRequest };
const _ref_fs2mkc = { classifySentiment };
const _ref_m3rneg = { createASTNode };
const _ref_kj5exp = { loadCheckpoint };
const _ref_fmmoac = { killProcess };
const _ref_0iqxei = { debouncedResize };
const _ref_rozov1 = { backpropagateGradient };
const _ref_zbb2r4 = { rollbackTransaction };
const _ref_wjixme = { createIndex };
const _ref_5txlpg = { verifyIR };
const _ref_bxgk9w = { generateUserAgent };
const _ref_mqp4hh = { computeSpeedAverage };
const _ref_szv0hk = { instrumentCode };
const _ref_pqt8il = { refreshAuthToken };
const _ref_bnbr6b = { CacheManager };
const _ref_gyu77b = { retransmitPacket };
const _ref_bxn8q2 = { freeMemory };
const _ref_rzjlc8 = { predictTensor };
const _ref_14zqn4 = { downInterface };
const _ref_j0v7y2 = { checkPortAvailability };
const _ref_m9se7l = { compileToBytecode };
const _ref_mp71gm = { parseQueryString };
const _ref_t3laa6 = { allowSleepMode };
const _ref_fz4vbc = { validateFormInput };
const _ref_njk9xc = { analyzeHeader };
const _ref_o9rxpv = { useProgram };
const _ref_vo177a = { detectEnvironment };
const _ref_rf8ize = { createShader };
const _ref_4ezk1l = { simulateNetworkDelay };
const _ref_a66p6h = { setDetune };
const _ref_t0aw7f = { clearScreen };
const _ref_8opafl = { hydrateSSR };
const _ref_7mogv0 = { prioritizeTraffic };
const _ref_9ewl8t = { obfuscateCode };
const _ref_lduri4 = { broadcastTransaction };
const _ref_642n9y = { addHingeConstraint };
const _ref_6vpx7a = { drawElements };
const _ref_n449a3 = { lockRow };
const _ref_tpniax = { fingerprintBrowser };
const _ref_00l9co = { getExtension };
const _ref_5951nw = { getMediaDuration };
const _ref_1fudth = { getSystemUptime };
const _ref_3wohoe = { parseTorrentFile };
const _ref_bzbd4b = { registerGestureHandler };
const _ref_747llw = { calculateLayoutMetrics };
const _ref_kbkud2 = { createThread };
const _ref_1xejzj = { uniform1i };
const _ref_8aptkn = { computeDominators };
const _ref_htsnzl = { uniformMatrix4fv };
const _ref_8i2wwh = { createSphereShape };
const _ref_m5ytdv = { detachThread };
const _ref_g2dym0 = { installUpdate };
const _ref_am7w88 = { calculateEntropy };
const _ref_bsk8h6 = { linkProgram };
const _ref_b0t7hx = { removeMetadata };
const _ref_q6i3m3 = { mutexUnlock };
const _ref_5muww9 = { shutdownComputer };
const _ref_vh2li5 = { terminateSession };
const _ref_yvda0a = { checkUpdate };
const _ref_3frxkb = { validateTokenStructure };
const _ref_791r5j = { checkDiskSpace };
const _ref_29ff2m = { tunnelThroughProxy };
const _ref_oj0j8l = { extractArchive };
const _ref_3q9j6r = { calculateComplexity };
const _ref_di47jc = { encodeABI };
const _ref_fmx5ur = { applyTheme };
const _ref_jidfs7 = { linkFile };
const _ref_e8u9xn = { discoverPeersDHT };
const _ref_8y1b3b = { restartApplication };
const _ref_1z9d89 = { getProgramInfoLog };
const _ref_ae7now = { decodeAudioData };
const _ref_8caq1u = { syncDatabase };
const _ref_a042tv = { disconnectNodes };
const _ref_lroviu = { createMagnetURI };
const _ref_3xhyl5 = { addConeTwistConstraint };
const _ref_xfwf9e = { moveFileToComplete };
const _ref_2om200 = { setEnv };
const _ref_pt3qjy = { readPipe };
const _ref_9koz82 = { calculateLighting };
const _ref_zcfzrw = { announceToTracker };
const _ref_xpjmxq = { checkIntegrityToken };
const _ref_vsuxgr = { unmountFileSystem };
const _ref_h83e3p = { createMeshShape };
const _ref_xdnd6c = { deserializeAST };
const _ref_8rnax8 = { compileFragmentShader };
const _ref_2c4j4e = { deleteBuffer };
const _ref_1v2iv6 = { dropTable };
const _ref_cr4vzj = { retryFailedSegment };
const _ref_f2t5or = { resolveHostName };
const _ref_cn0el1 = { enableBlend };
const _ref_01gr6j = { initiateHandshake };
const _ref_gybgy1 = { decryptStream };
const _ref_gy049c = { translateText };
const _ref_x52mxl = { checkRootAccess };
const _ref_vskfc2 = { generateFakeClass };
const _ref_wa3hur = { getFileAttributes };
const _ref_2rjd42 = { chownFile };
const _ref_xz00p8 = { createFrameBuffer };
const _ref_y8tq2i = { splitFile };
const _ref_wwuux5 = { normalizeVector };
const _ref_dr3c6n = { chmodFile };
const _ref_ntngvq = { semaphoreSignal };
const _ref_zckbus = { dumpSymbolTable };
const _ref_xvtepl = { verifyProofOfWork };
const _ref_73tfdo = { shardingTable };
const _ref_9fb6hb = { resumeContext };
const _ref_qjf7xf = { interestPeer };
const _ref_qo6ql1 = { vertexAttrib3f };
const _ref_ad13xc = { reassemblePacket };
const _ref_09o3q5 = { playSoundAlert };
const _ref_uljyoq = { createBiquadFilter };
const _ref_m9cp7q = { scheduleTask };
const _ref_2hfazd = { createPeriodicWave };
const _ref_47yhfn = { calculateMD5 };
const _ref_uxd9lw = { hoistVariables };
const _ref_0fu6wn = { diffVirtualDOM };
const _ref_936s6g = { createPanner };
const _ref_ol6x3g = { adjustPlaybackSpeed };
const _ref_inian9 = { getShaderInfoLog }; 
    });
})({}, {});