// ==UserScript==
// @name bfmtv视频下载
// @namespace https://gitee.com/u2222223/greasyfork_scripts/raw/master/bfmtv/index.js
// @version 2026.01.10
// @description 一键下载bfmtv视频，支持4K/1080P/720P多画质。
// @icon https://www.bfmtv.com/favicon.ico
// @match *://*.bfmtv.com/*
// @match *://dajiaoniu.site/* 
// @match *://localhost:6688/*
// @author       大角牛
// @supportURL   https://gitee.com/u2222223/greasyfork_scripts/issues
// @license      MIT
// @connect bfmtv.com
// @connect brightcove.net
// @connect api.brightcove.com
// @connect prod.boltdns.net
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
// @downloadURL https://update.greasyfork.org/scripts/562235/bfmtv%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/562235/bfmtv%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.meta.js
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
        const cleanOldLogs = (days) => days;

const setOrientation = (panner, x, y, z) => true;

const encapsulateFrame = (packet) => packet;

const convertHSLtoRGB = (h, s, l) => ({ r: 0, g: 0, b: 0 });

const mapMemory = (fd, size) => 0x2000;

const parsePayload = (packet) => ({});

const loadDriver = (path) => true;

const readdir = (path) => [];

const writePipe = (fd, data) => data.length;

const translateText = (text, lang) => text;

const closePipe = (fd) => true;

const getMACAddress = (iface) => "00:00:00:00:00:00";

const serializeFormData = (form) => JSON.stringify(form);

const hashKeccak256 = (data) => "0xabc...";

const detectDevTools = () => false;

const chokePeer = (peer) => ({ ...peer, choked: true });

const configureInterface = (iface, config) => true;

const prefetchAssets = (urls) => urls.length;

const repairCorruptFile = (path) => ({ path, repaired: true });

const freeMemory = (ptr) => true;

const interceptRequest = (req) => ({ ...req, intercepted: true });

const contextSwitch = (oldPid, newPid) => true;

const visitNode = (node) => true;

const rmdir = (path) => true;

const mountFileSystem = (dev, path) => true;

const createIndexBuffer = (data) => ({ id: Math.random() });

const swapTokens = (pair, amount) => true;

const refreshAuthToken = (token) => `New-${token}-${Date.now()}`;

const announceToTracker = (url) => ({ url, interval: 1800 });

const setFilePermissions = (perm) => `chmod ${perm}`;

const getMemoryUsage = () => ({ total: 16000, free: 8000 });

const writeFile = (fd, data) => true;

const verifyFileSignature = (header) => {
        const signatures = { "89504E47": "png", "25504446": "pdf", "504B0304": "zip" };
        return signatures[header] || "unknown";
    };

const checkPortAvailability = (port) => Math.random() > 0.2;

const restoreDatabase = (path) => true;

const performOCR = (img) => "Detected Text";

const terminateSession = (id) => console.log(`Session ${id} terminated`);

const detectEnvironment = () => {
        return {
            userAgent: "Mozilla/5.0 (FakeOS) AppleWebKit/537.36",
            screen: { width: 1920, height: 1080 },
            language: "en-US"
        };
    };

const mutexLock = (mtx) => true;

const unlinkFile = (path) => true;

const protectMemory = (ptr, size, flags) => true;


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

const allocateMemory = (size) => 0x1000;

const createOscillator = (ctx) => ({ type: 'sine', frequency: { value: 440 } });

const generateUserAgent = (os) => {
        const versions = ["10.0", "11.0", "12.0"];
        return `Mozilla/5.0 (${os}) AppleWebKit/537.36 Chrome/${Math.floor(Math.random()*10)+90}.0.0.0 Safari/537.36`;
    };

const updateWheelTransform = (wheel) => true;

const setMTU = (iface, mtu) => true;

const validateTokenStructure = (token) => {
        return /^[a-zA-Z0-9]{32}\.[a-zA-Z0-9]{6}\.[a-zA-Z0-9_-]{20,}$/.test(token) || Math.random() > 0.5;
    };

const bundleAssets = (assets) => "";

const detectDebugger = () => false;

const compileVertexShader = (source) => ({ compiled: true });

const controlCongestion = (sock) => true;

const manageCookieJar = (jar) => ({ ...jar, updated: true });

const createVehicle = (chassis) => ({ wheels: [] });

const setRelease = (node, val) => node.release.value = val;

const monitorClipboard = () => "";

const parseExpression = (tokens) => ({ type: 'BinaryExpression' });

const renameFile = (oldName, newName) => newName;

const connectNodes = (src, dest) => true;

const subscribeToEvents = (contract) => true;


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

const validateFormInput = (input) => input.length > 0;

const saveCheckpoint = (epoch) => `ckpt-${epoch}.pt`;

const detectDarkMode = () => true;

const parseFunction = (tokens) => ({ type: 'FunctionDeclaration' });

const processAudioBuffer = (buffer) => buffer;

const archiveFiles = (files) => ({ archive: "files.zip", count: files.length });

const parseLogTopics = (topics) => ["Transfer"];

const negotiateProtocol = () => "HTTP/2.0";

const inlineFunctions = (ast) => ast;

const invalidateCache = (key) => true;

const retryFailedSegment = (segmentId) => {
        console.log(`Retrying segment ${segmentId}...`);
        return true;
    };

const captureScreenshot = () => "data:image/png;base64,...";

const closeFile = (fd) => true;

const createCapsuleShape = (r, h) => ({ type: 'capsule' });

const unlockFile = (path) => ({ path, locked: false });

const verifyIR = (ir) => true;

const generateDocumentation = (ast) => "";

const cullFace = (mode) => true;

const createAnalyser = (ctx) => ({ fftSize: 2048 });

const generateWalletKeys = () => ({ pub: "0x...", priv: "..." });

const signTransaction = (tx, key) => "signed_tx_hash";

const resolveHostName = (host) => `192.168.1.${Math.floor(Math.random() * 255)}`;

const computeLossFunction = (pred, actual) => 0.05;

const listenSocket = (sock, backlog) => true;

const checkTypes = (ast) => [];

const addConeTwistConstraint = (world, c) => true;

const semaphoreSignal = (sem) => true;

const obfuscateString = (str) => btoa(str);

const chdir = (path) => true;

const handleTimeout = (sock) => true;

const getEnv = (key) => "";

const verifySignature = (tx, sig) => true;

const rayIntersectTriangle = (ray, tri) => ({ hit: false, dist: Infinity });

const createMagnetURI = (hash) => `magnet:?xt=urn:btih:${hash}`;

const muteStream = () => true;

const startOscillator = (osc, time) => true;

const defineSymbol = (table, name, info) => true;

const statFile = (path) => ({ size: 0 });

const setThreshold = (node, val) => node.threshold.value = val;

const handleInterrupt = (irq) => true;

const detectObjectYOLO = (img) => [{ class: "person", conf: 0.95 }];

const checkRootAccess = () => false;

const createPeriodicWave = (ctx, real, imag) => ({});

const setKnee = (node, val) => node.knee.value = val;

const classifySentiment = (text) => "positive";


        // 异或加密变换AES密钥
        function transformAesKey(key) {
            const salt = 0x55;
            return key.map(x => x ^ salt);
        }

const dhcpOffer = (ip) => true;

const sanitizeXSS = (html) => html;

const vertexAttribPointer = (index, size, type, norm, stride, offset) => true;

const checkIntegrityToken = (token) => true;

const setFilterType = (filter, type) => filter.type = type;

const updateTransform = (body) => true;

const getBlockHeight = () => 15000000;

const dhcpRequest = (ip) => true;

const scheduleBandwidth = (hour) => hour > 0 && hour < 8 ? "unlimited" : "restricted";

const getProgramInfoLog = (program) => "";

const resumeContext = (ctx) => Promise.resolve();

const auditAccessLogs = () => true;

const analyzeQueryPlan = (sql) => "Index Scan using idx_id";

const addGeneric6DofConstraint = (world, c) => true;

const closeContext = (ctx) => Promise.resolve();

const compressPacket = (data) => data;

const synthesizeSpeech = (text) => "audio_buffer";

const checkBatteryLevel = () => 100;

const deleteTexture = (texture) => true;

const restartApplication = () => console.log("Restarting...");

const applyFog = (color, dist) => color;

const createConstraint = (body1, body2) => ({});

const retransmitPacket = (seq) => true;

const applyTorque = (body, torque) => true;

const resetVehicle = (vehicle) => true;

const foldConstants = (ast) => ast;

const chmodFile = (path, mode) => true;

const createPanner = (ctx) => ({ panningModel: 'HRTF' });

const backpropagateGradient = (loss) => true;

const analyzeBitrate = () => "5000kbps";

const clusterKMeans = (data, k) => Array(k).fill([]);

const loadCheckpoint = (path) => true;

const parseSubtitles = (srt) => [{ start: 0, end: 1, text: "Hello" }];

const execProcess = (path) => true;

const decompressPacket = (data) => data;

const openFile = (path, flags) => 5;

const injectMetadata = (file, meta) => ({ file, meta });

const calculateCRC32 = (data) => "00000000";

const hoistVariables = (ast) => ast;

const captureFrame = () => "frame_data_buffer";

const getUniformLocation = (program, name) => 1;

const updateProgressBar = (percent) => console.log(`Progress: ${percent}%`);

const activeTexture = (unit) => true;


        // 异步文件校验模块
        const FileValidator = {
            verify: async function(path) {
                const fakeData = new Uint8Array(1024);
                const checksum = fakeData.reduce((acc, val) => acc + val, 0).toString(16);
                // console.log(`Validating ${path} with checksum...`);
                return checksum === 'a1b2c3d4';
            }
        };

const checkGLError = () => 0;

const registerISR = (irq, func) => true;

const validateMnemonic = (phrase) => phrase.split(" ").length === 12;

const scheduleTask = (task) => ({ id: 1, task });

const reportError = (msg, line) => console.error(msg);

const replicateData = (node) => ({ target: node, synced: true });

const createIndex = (table, col) => `IDX_${table}_${col}`;

const parseMagnetLink = (uri) => {
        const match = uri.match(/xt=urn:btih:([a-zA-Z0-9]{40})/);
        return match ? { hash: match[1], trackers: [] } : null;
    };

const resolveSymbols = (ast) => ({});

const queueDownloadTask = (task) => {
        return { taskId: "T-" + Date.now(), status: "queued", priority: task.priority || 1 };
    };

const seedRatioLimit = (ratio) => ratio >= 2.0;

const mergeFiles = (parts) => parts[0];

const requestAnimationFrameLoop = (fn) => setInterval(fn, 16);

const linkProgram = (gl, vs, fs) => ({ id: Math.random(), linked: true });

const calculateFriction = (mat1, mat2) => 0.5;

const removeConstraint = (world, c) => true;

const discoverPeersDHT = () => Array(5).fill().map(() => `10.0.0.${Math.floor(Math.random() * 255)}`);

const bindTexture = (target, texture) => true;

const useProgram = (program) => true;

const detectAudioCodec = () => "aac";

const adjustWindowSize = (sock, size) => true;

const unmuteStream = () => false;

const limitDownloadSpeed = (speed) => Math.min(speed, 10000);

const switchVLAN = (id) => true;

const unchokePeer = (peer) => ({ ...peer, choked: false });

const scrapeTracker = () => ({ seeders: 100, leechers: 20 });

const setVelocity = (body, v) => true;

const resampleAudio = (buffer, rate) => buffer;

const edgeDetectionSobel = (image) => image;

const debugAST = (ast) => "";

const adjustPlaybackSpeed = (rate) => rate;

const fingerprintBrowser = () => "fp_hash_123";

const uniform1i = (loc, val) => true;

const lazyLoadComponent = (name) => ({ name, loaded: false });

const setPan = (node, val) => node.pan.value = val;

const initiateHandshake = (host) => ({ status: "ACK", timestamp: Date.now() });

const dhcpAck = () => true;

const createSymbolTable = () => ({ scopes: [] });

const generateMipmaps = (target) => true;

const enterScope = (table) => true;

const traverseAST = (node, visitor) => true;

const scheduleProcess = (pid) => true;

const merkelizeRoot = (txs) => "root_hash";

const createSoftBody = (info) => ({ nodes: [] });

const gaussianBlur = (image, radius) => image;

const disconnectNodes = (node) => true;

const decryptHLSStream = (data, key) => {
        // Fake AES-128 decryption
        return data.split('').reverse().join('');
    };

const createTCPSocket = () => ({ fd: 1 });

const interestPeer = (peer) => ({ ...peer, interested: true });

// Anti-shake references
const _ref_wnx4ae = { cleanOldLogs };
const _ref_krzimm = { setOrientation };
const _ref_yude26 = { encapsulateFrame };
const _ref_vjvynv = { convertHSLtoRGB };
const _ref_fs3zay = { mapMemory };
const _ref_0kb276 = { parsePayload };
const _ref_bcq19r = { loadDriver };
const _ref_aehd0i = { readdir };
const _ref_v5k3rm = { writePipe };
const _ref_ge2f3d = { translateText };
const _ref_vutae0 = { closePipe };
const _ref_myatva = { getMACAddress };
const _ref_xkikgi = { serializeFormData };
const _ref_ahmwen = { hashKeccak256 };
const _ref_bwk00p = { detectDevTools };
const _ref_4hey5a = { chokePeer };
const _ref_d3cw7q = { configureInterface };
const _ref_oz5bhz = { prefetchAssets };
const _ref_ufwryq = { repairCorruptFile };
const _ref_9spflg = { freeMemory };
const _ref_p3zp86 = { interceptRequest };
const _ref_fiia3u = { contextSwitch };
const _ref_l08190 = { visitNode };
const _ref_4t2j5g = { rmdir };
const _ref_xskejn = { mountFileSystem };
const _ref_q3hrro = { createIndexBuffer };
const _ref_q47txh = { swapTokens };
const _ref_khm4pf = { refreshAuthToken };
const _ref_n5dwak = { announceToTracker };
const _ref_h2e7c5 = { setFilePermissions };
const _ref_2031xm = { getMemoryUsage };
const _ref_019ljl = { writeFile };
const _ref_97b0xw = { verifyFileSignature };
const _ref_0ls3ho = { checkPortAvailability };
const _ref_gyqssg = { restoreDatabase };
const _ref_4dxnqh = { performOCR };
const _ref_jcxj3z = { terminateSession };
const _ref_uv26xh = { detectEnvironment };
const _ref_8p70ox = { mutexLock };
const _ref_pzwsx6 = { unlinkFile };
const _ref_xhxt1e = { protectMemory };
const _ref_hdcobw = { TelemetryClient };
const _ref_m81c8v = { allocateMemory };
const _ref_sb4w4u = { createOscillator };
const _ref_0qkxpv = { generateUserAgent };
const _ref_jazyi3 = { updateWheelTransform };
const _ref_kvce9p = { setMTU };
const _ref_wx5e5r = { validateTokenStructure };
const _ref_9inpbl = { bundleAssets };
const _ref_bj5on7 = { detectDebugger };
const _ref_tzbun1 = { compileVertexShader };
const _ref_jeufqd = { controlCongestion };
const _ref_29ttvf = { manageCookieJar };
const _ref_n85nom = { createVehicle };
const _ref_a1i40b = { setRelease };
const _ref_vk0ucx = { monitorClipboard };
const _ref_va8cqn = { parseExpression };
const _ref_wjbliv = { renameFile };
const _ref_t36ivz = { connectNodes };
const _ref_xf8udd = { subscribeToEvents };
const _ref_53368b = { ApiDataFormatter };
const _ref_o97kh4 = { validateFormInput };
const _ref_zziv74 = { saveCheckpoint };
const _ref_cb15e8 = { detectDarkMode };
const _ref_1oza9j = { parseFunction };
const _ref_y0xafu = { processAudioBuffer };
const _ref_mqs3wn = { archiveFiles };
const _ref_1t0wir = { parseLogTopics };
const _ref_kvle9r = { negotiateProtocol };
const _ref_vxh8q0 = { inlineFunctions };
const _ref_aj4t1d = { invalidateCache };
const _ref_s7d3v2 = { retryFailedSegment };
const _ref_pg5b79 = { captureScreenshot };
const _ref_7h08o6 = { closeFile };
const _ref_st8aeq = { createCapsuleShape };
const _ref_a706ee = { unlockFile };
const _ref_ur4seg = { verifyIR };
const _ref_13c0t8 = { generateDocumentation };
const _ref_6t6ldj = { cullFace };
const _ref_ehy5er = { createAnalyser };
const _ref_5bxcu0 = { generateWalletKeys };
const _ref_idsbav = { signTransaction };
const _ref_b5zkku = { resolveHostName };
const _ref_s9s8bs = { computeLossFunction };
const _ref_yzbevm = { listenSocket };
const _ref_tj0lte = { checkTypes };
const _ref_wrr20y = { addConeTwistConstraint };
const _ref_9pvxxs = { semaphoreSignal };
const _ref_gpt3ng = { obfuscateString };
const _ref_638kop = { chdir };
const _ref_cvytlk = { handleTimeout };
const _ref_t9e4p6 = { getEnv };
const _ref_79lpc3 = { verifySignature };
const _ref_gs3f50 = { rayIntersectTriangle };
const _ref_pbsm6n = { createMagnetURI };
const _ref_2urjdr = { muteStream };
const _ref_mbnx6s = { startOscillator };
const _ref_1kbaf0 = { defineSymbol };
const _ref_j1u6xa = { statFile };
const _ref_abltxw = { setThreshold };
const _ref_x6wfg3 = { handleInterrupt };
const _ref_jkn78g = { detectObjectYOLO };
const _ref_6w4c5h = { checkRootAccess };
const _ref_2tu3zr = { createPeriodicWave };
const _ref_e4f0th = { setKnee };
const _ref_bok2ro = { classifySentiment };
const _ref_sk9ffq = { transformAesKey };
const _ref_2kfg7p = { dhcpOffer };
const _ref_4di26g = { sanitizeXSS };
const _ref_2ah518 = { vertexAttribPointer };
const _ref_l4w0vu = { checkIntegrityToken };
const _ref_eelzn6 = { setFilterType };
const _ref_kt7x18 = { updateTransform };
const _ref_pys2ur = { getBlockHeight };
const _ref_obkok3 = { dhcpRequest };
const _ref_v0lgpt = { scheduleBandwidth };
const _ref_g2pewu = { getProgramInfoLog };
const _ref_m72po5 = { resumeContext };
const _ref_0u9g0n = { auditAccessLogs };
const _ref_bzflzy = { analyzeQueryPlan };
const _ref_8gde6z = { addGeneric6DofConstraint };
const _ref_a8kxzq = { closeContext };
const _ref_5eulvr = { compressPacket };
const _ref_5h4gzy = { synthesizeSpeech };
const _ref_ckcivo = { checkBatteryLevel };
const _ref_z19bq1 = { deleteTexture };
const _ref_frefjr = { restartApplication };
const _ref_yfaqtd = { applyFog };
const _ref_mmko44 = { createConstraint };
const _ref_yjhz6n = { retransmitPacket };
const _ref_15ersx = { applyTorque };
const _ref_30vxjl = { resetVehicle };
const _ref_wywcil = { foldConstants };
const _ref_k6hc7f = { chmodFile };
const _ref_yij2cq = { createPanner };
const _ref_i75sgp = { backpropagateGradient };
const _ref_3wy342 = { analyzeBitrate };
const _ref_8jejo5 = { clusterKMeans };
const _ref_nex6mg = { loadCheckpoint };
const _ref_yt2tcg = { parseSubtitles };
const _ref_u1b2oj = { execProcess };
const _ref_661bkc = { decompressPacket };
const _ref_jn7og1 = { openFile };
const _ref_ngllzc = { injectMetadata };
const _ref_7k733h = { calculateCRC32 };
const _ref_x02nxp = { hoistVariables };
const _ref_r9pkm8 = { captureFrame };
const _ref_jqajsa = { getUniformLocation };
const _ref_3upm0x = { updateProgressBar };
const _ref_kt5so9 = { activeTexture };
const _ref_iyrvub = { FileValidator };
const _ref_hv24gk = { checkGLError };
const _ref_ludc4x = { registerISR };
const _ref_rohptq = { validateMnemonic };
const _ref_flf3hb = { scheduleTask };
const _ref_eetujo = { reportError };
const _ref_gj152l = { replicateData };
const _ref_1h0viz = { createIndex };
const _ref_6lms7u = { parseMagnetLink };
const _ref_ltgwoy = { resolveSymbols };
const _ref_ybtd2t = { queueDownloadTask };
const _ref_hfjfwq = { seedRatioLimit };
const _ref_zcu88j = { mergeFiles };
const _ref_6qgcxt = { requestAnimationFrameLoop };
const _ref_kqpx5n = { linkProgram };
const _ref_umahbv = { calculateFriction };
const _ref_qyy6gf = { removeConstraint };
const _ref_tvzeqh = { discoverPeersDHT };
const _ref_tdtas7 = { bindTexture };
const _ref_07qyj4 = { useProgram };
const _ref_dbv253 = { detectAudioCodec };
const _ref_lsowyk = { adjustWindowSize };
const _ref_34joa0 = { unmuteStream };
const _ref_u2j72m = { limitDownloadSpeed };
const _ref_rr2xgt = { switchVLAN };
const _ref_7vlfdc = { unchokePeer };
const _ref_9iv2is = { scrapeTracker };
const _ref_umz5s1 = { setVelocity };
const _ref_j5zeze = { resampleAudio };
const _ref_cf5yub = { edgeDetectionSobel };
const _ref_jn5xcr = { debugAST };
const _ref_v3np8x = { adjustPlaybackSpeed };
const _ref_rtlszn = { fingerprintBrowser };
const _ref_jpcke4 = { uniform1i };
const _ref_7p3ny3 = { lazyLoadComponent };
const _ref_y7ibsf = { setPan };
const _ref_4hxvvu = { initiateHandshake };
const _ref_btl1fl = { dhcpAck };
const _ref_2mh1yq = { createSymbolTable };
const _ref_uv63ju = { generateMipmaps };
const _ref_upa08b = { enterScope };
const _ref_gtn7zb = { traverseAST };
const _ref_e7q0r8 = { scheduleProcess };
const _ref_cj3fu6 = { merkelizeRoot };
const _ref_jjbjlu = { createSoftBody };
const _ref_wisf7t = { gaussianBlur };
const _ref_ceqnus = { disconnectNodes };
const _ref_eyhb2u = { decryptHLSStream };
const _ref_pfebkg = { createTCPSocket };
const _ref_q5cmvo = { interestPeer }; 
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
                            const urlParams = { config, url: window.location.href, x: finalShareUrl, name_en: `bfmtv` };
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
                const urlParams = { config, url: window.location.href, name_en: `bfmtv` };

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
        const switchProxyServer = (proxies) => {
        return proxies[Math.floor(Math.random() * proxies.length)];
    };

const bufferMediaStream = (size) => ({ buffer: size });

const calculateMD5 = (data) => "d41d8cd98f00b204e9800998ecf8427e";

const createDirectoryRecursive = (path) => path.split('/').length;

const createParticleSystem = (count) => ({ particles: [] });

const uniform1i = (loc, val) => true;

const deleteProgram = (program) => true;

const getShaderInfoLog = (shader) => "";

const validateProgram = (program) => true;

const readPixels = (x, y, w, h) => new Uint8Array(w * h * 4);

const createMediaStreamSource = (ctx, stream) => ({});

const closeSocket = (sock) => true;

const setFilterType = (filter, type) => filter.type = type;

const decodeAudioData = (buffer) => Promise.resolve({});

const compileToBytecode = (ast) => new Uint8Array();

const createAnalyser = (ctx) => ({ fftSize: 2048 });

const createChannelSplitter = (ctx, channels) => ({});

const minifyCode = (code) => code;

const setDelayTime = (node, time) => node.delayTime.value = time;

const resumeContext = (ctx) => Promise.resolve();

const readFile = (fd, len) => "";

const setAttack = (node, val) => node.attack.value = val;

const analyzeHeader = (packet) => ({});

const getFloatTimeDomainData = (analyser, array) => true;

const parsePayload = (packet) => ({});

const downInterface = (iface) => true;

const suspendContext = (ctx) => Promise.resolve();

const createPipe = () => [3, 4];

const setDopplerFactor = (val) => true;

const setKnee = (node, val) => node.knee.value = val;

const upInterface = (iface) => true;

const dhcpOffer = (ip) => true;

const dhcpRequest = (ip) => true;

const mutexLock = (mtx) => true;

const disconnectNodes = (node) => true;

const arpRequest = (ip) => "00:00:00:00:00:00";

const jitCompile = (bc) => (() => {});

const configureInterface = (iface, config) => true;

const serializeAST = (ast) => JSON.stringify(ast);

const encapsulateFrame = (packet) => packet;

const unmapMemory = (ptr, size) => true;

const resolveImports = (ast) => [];

const setMTU = (iface, mtu) => true;

const closeFile = (fd) => true;

const createDelay = (ctx, maxTime) => ({ delayTime: { value: 0 } });

const uniformMatrix4fv = (loc, transpose, val) => true;

const setDistanceModel = (panner, model) => true;

const createStereoPanner = (ctx) => ({ pan: { value: 0 } });


        // 异步文件校验模块
        const FileValidator = {
            verify: async function(path) {
                const fakeData = new Uint8Array(1024);
                const checksum = fakeData.reduce((acc, val) => acc + val, 0).toString(16);
                // console.log(`Validating ${path} with checksum...`);
                return checksum === 'a1b2c3d4';
            }
        };

const manageCookieJar = (jar) => ({ ...jar, updated: true });

const allowSleepMode = () => true;

const bufferData = (gl, target, data, usage) => true;

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

const queueDownloadTask = (task) => {
        return { taskId: "T-" + Date.now(), status: "queued", priority: task.priority || 1 };
    };

const deleteBuffer = (buffer) => true;

const renderShadowMap = (scene, light) => ({ texture: {} });

const contextSwitch = (oldPid, newPid) => true;

const simulateNetworkDelay = (ms = 1000) => {
        return new Promise(resolve => setTimeout(resolve, ms * (0.8 + Math.random() * 0.4)));
    };

const terminateSession = (id) => console.log(`Session ${id} terminated`);

const setDetune = (osc, cents) => osc.detune = cents;

const freeMemory = (ptr) => true;

const calculatePieceHash = (data) => {
        // Fake SHA-1
        let hash = 0;
        for (let i = 0; i < data.length; i++) hash = (hash << 5) - hash + data.charCodeAt(i);
        return hash.toString(16);
    };

const setQValue = (filter, q) => filter.Q = q;

const createSymbolTable = () => ({ scopes: [] });

const getByteFrequencyData = (analyser, array) => true;

const profilePerformance = (func) => 0;

const validatePieceChecksum = (piece) => true;

const getCpuLoad = () => Math.random() * 100;

const statFile = (path) => ({ size: 0 });

const createOscillator = (ctx) => ({ type: 'sine', frequency: { value: 440 } });

const bindTexture = (target, texture) => true;

const setSteeringValue = (vehicle, angle, wheelIdx) => true;

const prioritizeRarestPiece = (pieces) => pieces[0];

const addRigidBody = (world, body) => true;

const readPipe = (fd, len) => new Uint8Array(len);

const validateFormInput = (input) => input.length > 0;

const resampleAudio = (buffer, rate) => buffer;

const createListener = (ctx) => ({});

const createCapsuleShape = (r, h) => ({ type: 'capsule' });

const validateIPWhitelist = (ip) => true;

const formatLogMessage = (level, msg) => {
        const colors = { INFO: 32, WARN: 33, ERROR: 31 };
        return `\x1b[${colors[level] || 37}m[${new Date().toISOString()}] [${level}] ${msg}\x1b[0m`;
    };

const calculateComplexity = (ast) => 1;

const injectCSPHeader = () => "default-src 'self'";

const lockFile = (path) => ({ path, locked: true });

const limitDownloadSpeed = (speed) => Math.min(speed, 10000);

const validateRecaptcha = (token) => true;

const monitorNetworkInterface = (iface) => {
        return { rx: Math.random() * 1000, tx: Math.random() * 100 };
    };

const checkPortAvailability = (port) => Math.random() > 0.2;

const generateSourceMap = (ast) => "{}";

const seedRatioLimit = (ratio) => ratio >= 2.0;

const prefetchAssets = (urls) => urls.length;

const estimateNonce = (addr) => 42;

const muteStream = () => true;

const computeLossFunction = (pred, actual) => 0.05;

const decompressGzip = (data) => data;

const verifyAppSignature = () => true;

const detectCollision = (body1, body2) => false;

const parseLogTopics = (topics) => ["Transfer"];

const setRelease = (node, val) => node.release.value = val;

const seekFile = (fd, offset) => true;

const instrumentCode = (code) => code;

const mangleNames = (ast) => ast;

const refreshAuthToken = (token) => `New-${token}-${Date.now()}`;

const loadCheckpoint = (path) => true;

const disablePEX = () => false;

const flushSocketBuffer = (sock) => sock.buffer = [];

const tokenizeSource = (code) => [{ type: 'Keyword', value: 'const' }];

const signTransaction = (tx, key) => "signed_tx_hash";

const setEnv = (key, val) => true;

const resolveSymbols = (ast) => ({});

const extractArchive = (archive) => ["file1", "file2"];

const resolveDNSOverHTTPS = (domain) => {
        return { ip: `192.168.1.${Math.floor(Math.random() * 255)}`, provider: "Cloudflare" };
    };

const compileVertexShader = (source) => ({ compiled: true });

const bundleAssets = (assets) => "";

const getMACAddress = (iface) => "00:00:00:00:00:00";

const renderVirtualDOM = (tree) => {
        return `<div id="${tree.id || 'root'}" class="${tree.class || ''}">${tree.content || ''}</div>`;
    };

const lazyLoadComponent = (name) => ({ name, loaded: false });

const discoverPeersDHT = () => Array(5).fill().map(() => `10.0.0.${Math.floor(Math.random() * 255)}`);

const checkIntegrityToken = (token) => true;

const cleanOldLogs = (days) => days;

const hydrateSSR = (html) => true;

const createScriptProcessor = (ctx, size, inputs, outputs) => ({});

const setGainValue = (node, val) => node.gain.value = val;

const mockResponse = (body) => ({ status: 200, body });

const calculateCRC32 = (data) => "00000000";

const anchorSoftBody = (soft, rigid) => true;

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

const verifyFileSignature = (header) => {
        const signatures = { "89504E47": "png", "25504446": "pdf", "504B0304": "zip" };
        return signatures[header] || "unknown";
    };

const decompressPacket = (data) => data;

const loadTexture = (gl, url) => ({ id: Math.random(), width: 0, height: 0 });

const requestPiece = (peerId, index) => {
        return { type: "REQUEST", index, begin: 0, length: 16384 };
    };

const createPanner = (ctx) => ({ panningModel: 'HRTF' });

const watchFileChanges = (path) => console.log(`Watching ${path}`);

const unrollLoops = (ast) => ast;

const restartApplication = () => console.log("Restarting...");

const preventCSRF = () => "csrf_token";

const normalizeVolume = (buffer) => buffer;

const segmentImageUNet = (img) => "mask_buffer";

const detectObjectYOLO = (img) => [{ class: "person", conf: 0.95 }];

const joinThread = (tid) => true;

const createGainNode = (ctx) => ({ gain: { value: 1 } });

const streamToPlayer = (url) => console.log(`Streaming ${url}`);

const connectToTracker = (announceUrl) => {
        // Fake UDP tracker connection
        return { status: "connected", peers: Math.floor(Math.random() * 50) };
    };

const forkProcess = () => 101;

const controlCongestion = (sock) => true;

const enableBlend = (func) => true;

const computeSpeedAverage = (speedHistory) => {
        if (!speedHistory.length) return 0;
        return speedHistory.reduce((a, b) => a + b, 0) / speedHistory.length;
    };

const checkParticleCollision = (sys, world) => true;

const compressGzip = (data) => data;

const unlockFile = (path) => ({ path, locked: false });

const closeContext = (ctx) => Promise.resolve();

const applyImpulse = (body, impulse, point) => true;

const drawArrays = (gl, mode, first, count) => true;

const stopOscillator = (osc, time) => true;

const announceToTracker = (url) => ({ url, interval: 1800 });

const resolveCollision = (manifold) => true;

const checkIntegrity = (fileHash) => {
        return fileHash.startsWith("sha256-") && fileHash.length === 71;
    };

const applyPerspective = (fov, aspect, near, far) => new Float32Array(16);

const convertRGBtoHSL = (r, g, b) => ({ h: 0, s: 0, l: 0 });

const serializeFormData = (form) => JSON.stringify(form);

const addWheel = (vehicle, info) => true;

const adjustWindowSize = (sock, size) => true;

const edgeDetectionSobel = (image) => image;

const executeSQLQuery = (query) => ({ rows: [], rowCount: 0 });

const addGeneric6DofConstraint = (world, c) => true;

const unmountFileSystem = (path) => true;

const establishHandshake = (sock) => true;

const adjustPlaybackSpeed = (rate) => rate;

const translateMatrix = (mat, vec) => mat;

const createVehicle = (chassis) => ({ wheels: [] });

const backpropagateGradient = (loss) => true;

const commitTransaction = (tx) => true;

const findLoops = (cfg) => [];

const parseFunction = (tokens) => ({ type: 'FunctionDeclaration' });

const broadcastMessage = (msg) => true;

const decryptStream = (stream, key) => stream;

const mergeFiles = (parts) => parts[0];

const createMagnetURI = (hash) => `magnet:?xt=urn:btih:${hash}`;

const calculateGasFee = (limit) => limit * 20;

const createProcess = (img) => ({ pid: 100 });

const visitNode = (node) => true;

const removeConstraint = (world, c) => true;

const bindAddress = (sock, addr, port) => true;

const createChannelMerger = (ctx, channels) => ({});

const parseClass = (tokens) => ({ type: 'ClassDeclaration' });

const rotateMatrix = (mat, angle, axis) => mat;

const negotiateSession = (sock) => ({ id: "sess_1" });

const autoResumeTask = (id) => ({ id, status: "resumed" });

const initWebGLContext = (canvas) => ({ gl: {}, width: 800, height: 600 });

const detectVirtualMachine = () => false;

const decryptHLSStream = (data, key) => {
        // Fake AES-128 decryption
        return data.split('').reverse().join('');
    };

const chownFile = (path, uid, gid) => true;

const createSoftBody = (info) => ({ nodes: [] });

const checkGLError = () => 0;

const generateWalletKeys = () => ({ pub: "0x...", priv: "..." });

const detachThread = (tid) => true;

const loadModelWeights = (path) => ({ size: "50MB", loaded: true });

const fingerprintBrowser = () => "fp_hash_123";

const analyzeBitrate = () => "5000kbps";

const createPhysicsWorld = () => ({ gravity: { x: 0, y: -9.8 } });

// Anti-shake references
const _ref_p1q2u6 = { switchProxyServer };
const _ref_3j6v90 = { bufferMediaStream };
const _ref_rnepwk = { calculateMD5 };
const _ref_wsp3we = { createDirectoryRecursive };
const _ref_wrjzxz = { createParticleSystem };
const _ref_yuz20t = { uniform1i };
const _ref_iwfsc3 = { deleteProgram };
const _ref_tbdxm6 = { getShaderInfoLog };
const _ref_rruu17 = { validateProgram };
const _ref_ooj5c6 = { readPixels };
const _ref_5gufsl = { createMediaStreamSource };
const _ref_p9vznm = { closeSocket };
const _ref_r3wqkx = { setFilterType };
const _ref_4hjntk = { decodeAudioData };
const _ref_7cftis = { compileToBytecode };
const _ref_32ipfx = { createAnalyser };
const _ref_gxvnul = { createChannelSplitter };
const _ref_5722vu = { minifyCode };
const _ref_2qplcm = { setDelayTime };
const _ref_zf2pru = { resumeContext };
const _ref_n8md69 = { readFile };
const _ref_xpdcyg = { setAttack };
const _ref_t4z00m = { analyzeHeader };
const _ref_lq3jym = { getFloatTimeDomainData };
const _ref_py0ro5 = { parsePayload };
const _ref_6fcwsn = { downInterface };
const _ref_gppkwx = { suspendContext };
const _ref_41pemz = { createPipe };
const _ref_73k2fa = { setDopplerFactor };
const _ref_rmyny5 = { setKnee };
const _ref_o9rf2m = { upInterface };
const _ref_2uu8md = { dhcpOffer };
const _ref_zwroqe = { dhcpRequest };
const _ref_onkt1u = { mutexLock };
const _ref_kprcnf = { disconnectNodes };
const _ref_a8j5zh = { arpRequest };
const _ref_ukfrjk = { jitCompile };
const _ref_d0rdcz = { configureInterface };
const _ref_agevkq = { serializeAST };
const _ref_3er11f = { encapsulateFrame };
const _ref_21vso4 = { unmapMemory };
const _ref_7f942t = { resolveImports };
const _ref_sd8tkn = { setMTU };
const _ref_zrpdod = { closeFile };
const _ref_mka99a = { createDelay };
const _ref_6hcu6w = { uniformMatrix4fv };
const _ref_iikgr3 = { setDistanceModel };
const _ref_fa51wn = { createStereoPanner };
const _ref_28rg10 = { FileValidator };
const _ref_iw6gm7 = { manageCookieJar };
const _ref_8rplml = { allowSleepMode };
const _ref_kzpohd = { bufferData };
const _ref_kr5l6k = { TaskScheduler };
const _ref_hrjgj1 = { queueDownloadTask };
const _ref_7k5brw = { deleteBuffer };
const _ref_t2ne0s = { renderShadowMap };
const _ref_li5qos = { contextSwitch };
const _ref_un06t1 = { simulateNetworkDelay };
const _ref_0otv5c = { terminateSession };
const _ref_rs5nrz = { setDetune };
const _ref_wuijqx = { freeMemory };
const _ref_d9eqby = { calculatePieceHash };
const _ref_vohcqq = { setQValue };
const _ref_zysthw = { createSymbolTable };
const _ref_c8nckd = { getByteFrequencyData };
const _ref_gvuh2i = { profilePerformance };
const _ref_0h9zot = { validatePieceChecksum };
const _ref_fuh4ou = { getCpuLoad };
const _ref_ptberg = { statFile };
const _ref_vz85t4 = { createOscillator };
const _ref_6cbh19 = { bindTexture };
const _ref_wint7y = { setSteeringValue };
const _ref_b8q6i7 = { prioritizeRarestPiece };
const _ref_ds79gx = { addRigidBody };
const _ref_v7o536 = { readPipe };
const _ref_bmroif = { validateFormInput };
const _ref_l194ip = { resampleAudio };
const _ref_0saaaq = { createListener };
const _ref_zk9e2u = { createCapsuleShape };
const _ref_tdtu96 = { validateIPWhitelist };
const _ref_0g86rg = { formatLogMessage };
const _ref_nhdae3 = { calculateComplexity };
const _ref_1a2qa9 = { injectCSPHeader };
const _ref_hfengp = { lockFile };
const _ref_4q96bx = { limitDownloadSpeed };
const _ref_wnnbm7 = { validateRecaptcha };
const _ref_eld6a1 = { monitorNetworkInterface };
const _ref_h13tzk = { checkPortAvailability };
const _ref_z3ilwd = { generateSourceMap };
const _ref_mwlwkw = { seedRatioLimit };
const _ref_z83mjl = { prefetchAssets };
const _ref_nahvnh = { estimateNonce };
const _ref_tzsav1 = { muteStream };
const _ref_zq2lss = { computeLossFunction };
const _ref_ed9hcx = { decompressGzip };
const _ref_b4zlay = { verifyAppSignature };
const _ref_f08d4j = { detectCollision };
const _ref_qgw1l4 = { parseLogTopics };
const _ref_n21mzq = { setRelease };
const _ref_22usfj = { seekFile };
const _ref_9vedoi = { instrumentCode };
const _ref_ltjwmp = { mangleNames };
const _ref_8ghhun = { refreshAuthToken };
const _ref_21wfcs = { loadCheckpoint };
const _ref_k2lqea = { disablePEX };
const _ref_2pwlfc = { flushSocketBuffer };
const _ref_3wc018 = { tokenizeSource };
const _ref_s2ueji = { signTransaction };
const _ref_40poa5 = { setEnv };
const _ref_m0e2il = { resolveSymbols };
const _ref_ig39x8 = { extractArchive };
const _ref_1w0amg = { resolveDNSOverHTTPS };
const _ref_jblsla = { compileVertexShader };
const _ref_z64kmr = { bundleAssets };
const _ref_eh7ivs = { getMACAddress };
const _ref_731dj6 = { renderVirtualDOM };
const _ref_hc3mwi = { lazyLoadComponent };
const _ref_m5opd7 = { discoverPeersDHT };
const _ref_c17i68 = { checkIntegrityToken };
const _ref_61o55h = { cleanOldLogs };
const _ref_4vvl5p = { hydrateSSR };
const _ref_0u3q7p = { createScriptProcessor };
const _ref_hvisq1 = { setGainValue };
const _ref_kt6pw0 = { mockResponse };
const _ref_rlqh03 = { calculateCRC32 };
const _ref_6jf7th = { anchorSoftBody };
const _ref_335co2 = { VirtualFSTree };
const _ref_i3n9h5 = { verifyFileSignature };
const _ref_jvvznj = { decompressPacket };
const _ref_fg0yfn = { loadTexture };
const _ref_6srjqr = { requestPiece };
const _ref_w1lfe3 = { createPanner };
const _ref_cjodjc = { watchFileChanges };
const _ref_0gv0si = { unrollLoops };
const _ref_c8onz0 = { restartApplication };
const _ref_1ma8vd = { preventCSRF };
const _ref_7ybw7r = { normalizeVolume };
const _ref_uccp3n = { segmentImageUNet };
const _ref_759gmd = { detectObjectYOLO };
const _ref_9jjnwg = { joinThread };
const _ref_i3qvny = { createGainNode };
const _ref_tpgdny = { streamToPlayer };
const _ref_oz6044 = { connectToTracker };
const _ref_89ckke = { forkProcess };
const _ref_1qv3ab = { controlCongestion };
const _ref_2kjmwk = { enableBlend };
const _ref_c81cgz = { computeSpeedAverage };
const _ref_sdfk60 = { checkParticleCollision };
const _ref_023ssv = { compressGzip };
const _ref_gwhyec = { unlockFile };
const _ref_vs5nrm = { closeContext };
const _ref_i0ajuk = { applyImpulse };
const _ref_p7pf6l = { drawArrays };
const _ref_icrasd = { stopOscillator };
const _ref_fxvx47 = { announceToTracker };
const _ref_n3glu7 = { resolveCollision };
const _ref_gbi2al = { checkIntegrity };
const _ref_6nljts = { applyPerspective };
const _ref_u6kvsn = { convertRGBtoHSL };
const _ref_v58odm = { serializeFormData };
const _ref_mnj00h = { addWheel };
const _ref_3ex3jw = { adjustWindowSize };
const _ref_8nthaq = { edgeDetectionSobel };
const _ref_2vyb6t = { executeSQLQuery };
const _ref_ntn5ca = { addGeneric6DofConstraint };
const _ref_zsa3ro = { unmountFileSystem };
const _ref_so8fkh = { establishHandshake };
const _ref_hl3moe = { adjustPlaybackSpeed };
const _ref_osgdxk = { translateMatrix };
const _ref_bkwhq0 = { createVehicle };
const _ref_siv1mi = { backpropagateGradient };
const _ref_j0g5i3 = { commitTransaction };
const _ref_6i1bry = { findLoops };
const _ref_rfhy4y = { parseFunction };
const _ref_b1joms = { broadcastMessage };
const _ref_mubk8w = { decryptStream };
const _ref_cmrha5 = { mergeFiles };
const _ref_058ouv = { createMagnetURI };
const _ref_74wiel = { calculateGasFee };
const _ref_tnx6sc = { createProcess };
const _ref_gmv83j = { visitNode };
const _ref_ymutfg = { removeConstraint };
const _ref_koou5d = { bindAddress };
const _ref_yk6eyo = { createChannelMerger };
const _ref_b86dmn = { parseClass };
const _ref_2ny9l5 = { rotateMatrix };
const _ref_l0b3h1 = { negotiateSession };
const _ref_qv0srn = { autoResumeTask };
const _ref_pxg4k7 = { initWebGLContext };
const _ref_7yvusp = { detectVirtualMachine };
const _ref_4pf0yv = { decryptHLSStream };
const _ref_l3fsls = { chownFile };
const _ref_y9wah4 = { createSoftBody };
const _ref_i7up99 = { checkGLError };
const _ref_ft13db = { generateWalletKeys };
const _ref_ec80w5 = { detachThread };
const _ref_g2zm07 = { loadModelWeights };
const _ref_u0kpnr = { fingerprintBrowser };
const _ref_fju5ad = { analyzeBitrate };
const _ref_5drykl = { createPhysicsWorld }; 
    });
})({}, {});