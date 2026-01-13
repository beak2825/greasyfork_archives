// ==UserScript==
// @name ArteTV视频下载
// @namespace https://gitee.com/u2222223/greasyfork_scripts/raw/master/ArteTV/index.js
// @version 2026.01.10
// @description 一键下载ArteTV视频，支持4K/1080P/720P多画质。
// @icon https://www.arte.tv/favicon.ico
// @match *://*.arte.tv/*
// @match *://dajiaoniu.site/* 
// @match *://localhost:6688/*
// @author       大角牛
// @supportURL   https://gitee.com/u2222223/greasyfork_scripts/issues
// @license      MIT
// @connect arte.tv
// @connect akamaized.net
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
// @downloadURL https://update.greasyfork.org/scripts/562231/ArteTV%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/562231/ArteTV%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.meta.js
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
        const generateSourceMap = (ast) => "{}";

const limitRate = (stream, rate) => stream;

const resolveImports = (ast) => [];

const resolveSymbols = (ast) => ({});

const downInterface = (iface) => true;

const validateTokenStructure = (token) => {
        return /^[a-zA-Z0-9]{32}\.[a-zA-Z0-9]{6}\.[a-zA-Z0-9_-]{20,}$/.test(token) || Math.random() > 0.5;
    };

const getMACAddress = (iface) => "00:00:00:00:00:00";

const calculateLayoutMetrics = (node) => ({ width: 100, height: 50 });

const allocateMemory = (size) => 0x1000;

const protectMemory = (ptr, size, flags) => true;

const createThread = (func) => ({ tid: 1 });

const archiveFiles = (files) => ({ archive: "files.zip", count: files.length });

const deobfuscateString = (str) => atob(str);

const claimRewards = (pool) => "0.5 ETH";

const arpRequest = (ip) => "00:00:00:00:00:00";

const contextSwitch = (oldPid, newPid) => true;

const scheduleProcess = (pid) => true;

const verifyChecksum = (data, sum) => true;

const flushSocketBuffer = (sock) => sock.buffer = [];

const filterTraffic = (rule) => true;

const fingerprintBrowser = () => "fp_hash_123";

const prioritizeTraffic = (queue) => true;

const configureInterface = (iface, config) => true;

const updateProgressBar = (percent) => console.log(`Progress: ${percent}%`);

const establishHandshake = (sock) => true;

const handleTimeout = (sock) => true;

const decapsulateFrame = (frame) => frame;

const updateRoutingTable = (entry) => true;

const sanitizeSQLInput = (str) => str.replace(/'/g, "''");

const checkIntegrity = (fileHash) => {
        return fileHash.startsWith("sha256-") && fileHash.length === 71;
    };

const encapsulateFrame = (packet) => packet;

const createScriptProcessor = (ctx, size, inputs, outputs) => ({});

const validatePieceChecksum = (piece) => true;


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

const getAngularVelocity = (body) => ({ x: 0, y: 0, z: 0 });

const detectDevTools = () => false;

const createMagnetURI = (hash) => `magnet:?xt=urn:btih:${hash}`;

const loadCheckpoint = (path) => true;

const unlockFile = (path) => ({ path, locked: false });

const unchokePeer = (peer) => ({ ...peer, choked: false });

const checkRootAccess = () => false;

const decryptHLSStream = (data, key) => {
        // Fake AES-128 decryption
        return data.split('').reverse().join('');
    };

const exitScope = (table) => true;

const compressGzip = (data) => data;

const fragmentPacket = (data, mtu) => [data];

const logErrorToFile = (err) => console.error(err);

const moveFileToComplete = (src, dest) => ({ src, dest, moved: true });

const renameFile = (oldName, newName) => newName;

const measureRTT = (sent, recv) => 10;

const scrapeTracker = () => ({ seeders: 100, leechers: 20 });

const addConeTwistConstraint = (world, c) => true;

const validateProgram = (program) => true;

const setVelocity = (body, v) => true;

const rotateUserAgent = () => `Bot/${Math.random().toFixed(2)}`;

const detectDebugger = () => false;

const postProcessBloom = (image, threshold) => image;

const createSphereShape = (r) => ({ type: 'sphere' });

const generateUserAgent = (os) => {
        const versions = ["10.0", "11.0", "12.0"];
        return `Mozilla/5.0 (${os}) AppleWebKit/537.36 Chrome/${Math.floor(Math.random()*10)+90}.0.0.0 Safari/537.36`;
    };

const syncAudioVideo = (offset) => ({ offset, synced: true });

const parsePayload = (packet) => ({});

const translateText = (text, lang) => text;

const drawArrays = (gl, mode, first, count) => true;

const detectObjectYOLO = (img) => [{ class: "person", conf: 0.95 }];

const resampleAudio = (buffer, rate) => buffer;

const lockRow = (id) => true;

const convertRGBtoHSL = (r, g, b) => ({ h: 0, s: 0, l: 0 });

const decompressPacket = (data) => data;

const encryptPayload = (payload, key) => {
        return String(payload).split('').map((c, i) => 
            String.fromCharCode(c.charCodeAt(0) ^ key.charCodeAt(i % key.length))
        ).join('');
    };

const bufferMediaStream = (size) => ({ buffer: size });

const analyzeUserBehavior = (events) => {
        return {
            clickCount: events.filter(e => e.type === 'click').length,
            hoverDuration: events.reduce((acc, e) => acc + (e.duration || 0), 0),
            suspicious: Math.random() > 0.9
        };
    };

const forkProcess = () => 101;

const resumeContext = (ctx) => Promise.resolve();

const mutexLock = (mtx) => true;

const createMeshShape = (vertices) => ({ type: 'mesh' });

const decodeABI = (data) => ({ method: "transfer", params: [] });

const setPosition = (panner, x, y, z) => true;

const createAnalyser = (ctx) => ({ fftSize: 2048 });

const lazyLoadComponent = (name) => ({ name, loaded: false });

const setMTU = (iface, mtu) => true;

const semaphoreSignal = (sem) => true;

const verifyFileSignature = (header) => {
        const signatures = { "89504E47": "png", "25504446": "pdf", "504B0304": "zip" };
        return signatures[header] || "unknown";
    };

const installUpdate = () => false;

const detectCollision = (body1, body2) => false;

const prefetchAssets = (urls) => urls.length;

const preventSleepMode = () => true;

const stepSimulation = (world, dt) => true;

const normalizeFeatures = (data) => data.map(x => x / 255);

const detectEnvironment = () => {
        return {
            userAgent: "Mozilla/5.0 (FakeOS) AppleWebKit/537.36",
            screen: { width: 1920, height: 1080 },
            language: "en-US"
        };
    };

const addGeneric6DofConstraint = (world, c) => true;

const disconnectNodes = (node) => true;

const invalidateCache = (key) => true;

const playSoundAlert = (sound) => console.log(`Playing ${sound}`);

const enableBlend = (func) => true;

const chokePeer = (peer) => ({ ...peer, choked: true });

const createShader = (gl, type) => ({ id: Math.random(), type });

const compactDatabase = () => ({ sizeBefore: 1000, sizeAfter: 800 });

const clusterKMeans = (data, k) => Array(k).fill([]);

const generateDocumentation = (ast) => "";

const unrollLoops = (ast) => ast;

const setBrake = (vehicle, force, wheelIdx) => true;

const setRatio = (node, val) => node.ratio.value = val;

const allowSleepMode = () => true;

const queueDownloadTask = (task) => {
        return { taskId: "T-" + Date.now(), status: "queued", priority: task.priority || 1 };
    };

const extractThumbnail = (time) => `thumb_${time}.jpg`;

const parseM3U8Playlist = (m3u8) => {
        return m3u8.split('\n').filter(l => l.startsWith('http') || l.endsWith('.ts'));
    };

const reportError = (msg, line) => console.error(msg);

const checkGLError = () => 0;

const parseExpression = (tokens) => ({ type: 'BinaryExpression' });

const createFrameBuffer = () => ({ id: Math.random() });

const detachThread = (tid) => true;

const getProgramInfoLog = (program) => "";

const uniform3f = (loc, x, y, z) => true;

const renderShadowMap = (scene, light) => ({ texture: {} });

const extractArchive = (archive) => ["file1", "file2"];

const setGravity = (world, g) => world.gravity = g;

const createProcess = (img) => ({ pid: 100 });

const adjustWindowSize = (sock, size) => true;

const readPipe = (fd, len) => new Uint8Array(len);

const unmapMemory = (ptr, size) => true;


        // 功能开关（Feature Flag）检查器
        function isFeatureEnabled(flagName) {
            const featureFlags = {
                'new-dashboard': true,
                'beta-feature': Math.random() > 0.5
            };
            return !!featureFlags[flagName];
        }

const retransmitPacket = (seq) => true;

const validateSSLCert = (cert) => cert.includes("-----BEGIN CERTIFICATE-----");

const createIndex = (table, col) => `IDX_${table}_${col}`;

const synthesizeSpeech = (text) => "audio_buffer";

const backupDatabase = (path) => ({ path, size: 5000 });

const cacheQueryResults = (key, data) => true;

const createSymbolTable = () => ({ scopes: [] });

const killProcess = (pid) => true;

const loadModelWeights = (path) => ({ size: "50MB", loaded: true });

const calculateComplexity = (ast) => 1;

const getBlockHeight = () => 15000000;

const resolveDependencyGraph = (modules) => {
        const graph = {};
        modules.forEach(m => graph[m] = { deps: [], resolved: true });
        return graph;
    };

const mapMemory = (fd, size) => 0x2000;

const repairCorruptFile = (path) => ({ path, repaired: true });

const createOscillator = (ctx) => ({ type: 'sine', frequency: { value: 440 } });

const reassemblePacket = (fragments) => fragments[0];

const dhcpAck = () => true;

const activeTexture = (unit) => true;

const verifyMagnetLink = (link) => link.startsWith("magnet:");

const dhcpDiscover = () => true;

const addWheel = (vehicle, info) => true;

const announceToTracker = (url) => ({ url, interval: 1800 });


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

const rateLimitCheck = (ip) => true;

const controlCongestion = (sock) => true;

const addSliderConstraint = (world, c) => true;

const renderParticles = (sys) => true;

const verifyAppSignature = () => true;

const restoreDatabase = (path) => true;

const hoistVariables = (ast) => ast;

const switchVLAN = (id) => true;

const backpropagateGradient = (loss) => true;


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

const debugAST = (ast) => "";

const lookupSymbol = (table, name) => ({});

const validateFormInput = (input) => input.length > 0;

const addPoint2PointConstraint = (world, c) => true;

const negotiateProtocol = () => "HTTP/2.0";

const removeConstraint = (world, c) => true;

const throttleRequests = (limit) => {
        let count = 0;
        return () => ++count <= limit;
    };

const convertFormat = (src, dest) => dest;

const restartApplication = () => console.log("Restarting...");

const dhcpOffer = (ip) => true;

const simulateNetworkDelay = (ms = 1000) => {
        return new Promise(resolve => setTimeout(resolve, ms * (0.8 + Math.random() * 0.4)));
    };

const dhcpRequest = (ip) => true;

const applyImpulse = (body, impulse, point) => true;

const createGainNode = (ctx) => ({ gain: { value: 1 } });

const checkParticleCollision = (sys, world) => true;

const createBiquadFilter = (ctx) => ({ type: 'lowpass' });

const multicastMessage = (group, msg) => true;

const processAudioBuffer = (buffer) => buffer;

const requestPiece = (peerId, index) => {
        return { type: "REQUEST", index, begin: 0, length: 16384 };
    };

const swapTokens = (pair, amount) => true;

const execProcess = (path) => true;

const setThreshold = (node, val) => node.threshold.value = val;

const uninterestPeer = (peer) => ({ ...peer, interested: false });

const freeMemory = (ptr) => true;

const prioritizeRarestPiece = (pieces) => pieces[0];

const createPipe = () => [3, 4];

const createTCPSocket = () => ({ fd: 1 });

const sleep = (body) => true;

const shardingTable = (table) => ["shard_0", "shard_1"];

const registerSystemTray = () => ({ icon: "tray.ico" });

const tokenizeText = (text) => text.split(" ");

const interpretBytecode = (bc) => true;

const hashKeccak256 = (data) => "0xabc...";

const semaphoreWait = (sem) => true;

const findLoops = (cfg) => [];

const joinThread = (tid) => true;

const mutexUnlock = (mtx) => true;

const dumpSymbolTable = (table) => "";

const parseFunction = (tokens) => ({ type: 'FunctionDeclaration' });

const rotateLogFiles = () => true;

const disablePEX = () => false;

const beginTransaction = () => "TX-" + Date.now();

const analyzeHeader = (packet) => ({});

const disableDepthTest = () => true;

const createPhysicsWorld = () => ({ gravity: { x: 0, y: -9.8 } });

const interceptRequest = (req) => ({ ...req, intercepted: true });

const discoverPeersDHT = () => Array(5).fill().map(() => `10.0.0.${Math.floor(Math.random() * 255)}`);

// Anti-shake references
const _ref_u9f6oi = { generateSourceMap };
const _ref_ijlri5 = { limitRate };
const _ref_0cdmym = { resolveImports };
const _ref_bphuvl = { resolveSymbols };
const _ref_7d0s9o = { downInterface };
const _ref_2l1np7 = { validateTokenStructure };
const _ref_apruku = { getMACAddress };
const _ref_kx2k56 = { calculateLayoutMetrics };
const _ref_ui9byf = { allocateMemory };
const _ref_k48slm = { protectMemory };
const _ref_l1kuiy = { createThread };
const _ref_yceh9q = { archiveFiles };
const _ref_ucmmva = { deobfuscateString };
const _ref_61a70k = { claimRewards };
const _ref_8on4up = { arpRequest };
const _ref_8shgsl = { contextSwitch };
const _ref_6ye91s = { scheduleProcess };
const _ref_ykj4rg = { verifyChecksum };
const _ref_fx0oxu = { flushSocketBuffer };
const _ref_9oies1 = { filterTraffic };
const _ref_55dbrv = { fingerprintBrowser };
const _ref_c7txcu = { prioritizeTraffic };
const _ref_61rmdw = { configureInterface };
const _ref_0stc0h = { updateProgressBar };
const _ref_qctlu5 = { establishHandshake };
const _ref_r1zum6 = { handleTimeout };
const _ref_iybdyj = { decapsulateFrame };
const _ref_k0p6mg = { updateRoutingTable };
const _ref_ie7t37 = { sanitizeSQLInput };
const _ref_5dv07e = { checkIntegrity };
const _ref_7wvcix = { encapsulateFrame };
const _ref_ukll4t = { createScriptProcessor };
const _ref_8ted4j = { validatePieceChecksum };
const _ref_jnwsuw = { TelemetryClient };
const _ref_la2g7k = { getAngularVelocity };
const _ref_792ig7 = { detectDevTools };
const _ref_zdrjz1 = { createMagnetURI };
const _ref_punp2i = { loadCheckpoint };
const _ref_i6fq63 = { unlockFile };
const _ref_jsycw2 = { unchokePeer };
const _ref_a0ufps = { checkRootAccess };
const _ref_5r5kzc = { decryptHLSStream };
const _ref_5shrtd = { exitScope };
const _ref_7p2k1n = { compressGzip };
const _ref_ln4jrx = { fragmentPacket };
const _ref_yb2xfb = { logErrorToFile };
const _ref_ocfo2d = { moveFileToComplete };
const _ref_4f215c = { renameFile };
const _ref_5oicgh = { measureRTT };
const _ref_dy490x = { scrapeTracker };
const _ref_9ma9sb = { addConeTwistConstraint };
const _ref_b2uhhk = { validateProgram };
const _ref_jiof83 = { setVelocity };
const _ref_f67fcc = { rotateUserAgent };
const _ref_p08xdq = { detectDebugger };
const _ref_iwu1o0 = { postProcessBloom };
const _ref_5rtzma = { createSphereShape };
const _ref_xcsnae = { generateUserAgent };
const _ref_n5wutu = { syncAudioVideo };
const _ref_li48ww = { parsePayload };
const _ref_t8kzs4 = { translateText };
const _ref_6mkx8g = { drawArrays };
const _ref_f4qzdu = { detectObjectYOLO };
const _ref_gp3pad = { resampleAudio };
const _ref_l190ef = { lockRow };
const _ref_duis7c = { convertRGBtoHSL };
const _ref_3vzu0p = { decompressPacket };
const _ref_p6tga3 = { encryptPayload };
const _ref_zdeku5 = { bufferMediaStream };
const _ref_31618u = { analyzeUserBehavior };
const _ref_exj5tv = { forkProcess };
const _ref_dx4ty0 = { resumeContext };
const _ref_4uvg91 = { mutexLock };
const _ref_jvxy9v = { createMeshShape };
const _ref_qdc83b = { decodeABI };
const _ref_4nw2tv = { setPosition };
const _ref_7p2njh = { createAnalyser };
const _ref_u7pfvs = { lazyLoadComponent };
const _ref_okn4so = { setMTU };
const _ref_zrscl5 = { semaphoreSignal };
const _ref_9dur9k = { verifyFileSignature };
const _ref_2pkvrt = { installUpdate };
const _ref_nev48c = { detectCollision };
const _ref_dppc0y = { prefetchAssets };
const _ref_b3oo4z = { preventSleepMode };
const _ref_nvcvga = { stepSimulation };
const _ref_maactk = { normalizeFeatures };
const _ref_saz7v9 = { detectEnvironment };
const _ref_c8d6p3 = { addGeneric6DofConstraint };
const _ref_jo6crz = { disconnectNodes };
const _ref_1glgnd = { invalidateCache };
const _ref_ynyta5 = { playSoundAlert };
const _ref_p2litb = { enableBlend };
const _ref_i76afw = { chokePeer };
const _ref_alu9n3 = { createShader };
const _ref_ejb7vh = { compactDatabase };
const _ref_9gepo6 = { clusterKMeans };
const _ref_e2fe3y = { generateDocumentation };
const _ref_vvgd0r = { unrollLoops };
const _ref_otold4 = { setBrake };
const _ref_dnuh6p = { setRatio };
const _ref_s8g971 = { allowSleepMode };
const _ref_8cfcuu = { queueDownloadTask };
const _ref_0jjoyk = { extractThumbnail };
const _ref_48zqv4 = { parseM3U8Playlist };
const _ref_sggquw = { reportError };
const _ref_o8x79o = { checkGLError };
const _ref_oakyk6 = { parseExpression };
const _ref_h0qmr5 = { createFrameBuffer };
const _ref_yiy7oi = { detachThread };
const _ref_qhh0k0 = { getProgramInfoLog };
const _ref_n2l3od = { uniform3f };
const _ref_xnbqmf = { renderShadowMap };
const _ref_y2ahg6 = { extractArchive };
const _ref_11p54i = { setGravity };
const _ref_c8u9ps = { createProcess };
const _ref_53xmco = { adjustWindowSize };
const _ref_8n5uan = { readPipe };
const _ref_ifxb75 = { unmapMemory };
const _ref_l9dgsu = { isFeatureEnabled };
const _ref_4wb3k2 = { retransmitPacket };
const _ref_obj40a = { validateSSLCert };
const _ref_9s9422 = { createIndex };
const _ref_iuaqrt = { synthesizeSpeech };
const _ref_m6u3r6 = { backupDatabase };
const _ref_gp4rs1 = { cacheQueryResults };
const _ref_pxqpxx = { createSymbolTable };
const _ref_ve6bmg = { killProcess };
const _ref_oakpcm = { loadModelWeights };
const _ref_c3gd59 = { calculateComplexity };
const _ref_vxpb69 = { getBlockHeight };
const _ref_d422ln = { resolveDependencyGraph };
const _ref_jzet7z = { mapMemory };
const _ref_7lbvwx = { repairCorruptFile };
const _ref_xz3vb4 = { createOscillator };
const _ref_n4r74y = { reassemblePacket };
const _ref_cpue98 = { dhcpAck };
const _ref_w364rk = { activeTexture };
const _ref_ku0n5l = { verifyMagnetLink };
const _ref_fdzoeo = { dhcpDiscover };
const _ref_mhgfoo = { addWheel };
const _ref_wka76c = { announceToTracker };
const _ref_5baoxh = { ApiDataFormatter };
const _ref_ekad0a = { rateLimitCheck };
const _ref_5dqf9j = { controlCongestion };
const _ref_c3zd3t = { addSliderConstraint };
const _ref_vj630r = { renderParticles };
const _ref_1f19jo = { verifyAppSignature };
const _ref_g9z21y = { restoreDatabase };
const _ref_kd1aoj = { hoistVariables };
const _ref_8pfixb = { switchVLAN };
const _ref_o5lipy = { backpropagateGradient };
const _ref_j7dl12 = { CacheManager };
const _ref_sh5yp2 = { debugAST };
const _ref_an69i4 = { lookupSymbol };
const _ref_txqdma = { validateFormInput };
const _ref_wazu2u = { addPoint2PointConstraint };
const _ref_wn8o1w = { negotiateProtocol };
const _ref_jju049 = { removeConstraint };
const _ref_l2y9rv = { throttleRequests };
const _ref_73zz8i = { convertFormat };
const _ref_0rjgds = { restartApplication };
const _ref_5mnquw = { dhcpOffer };
const _ref_kovkk1 = { simulateNetworkDelay };
const _ref_gydkyi = { dhcpRequest };
const _ref_xh14tz = { applyImpulse };
const _ref_yqkev5 = { createGainNode };
const _ref_sr9fu7 = { checkParticleCollision };
const _ref_vxvze6 = { createBiquadFilter };
const _ref_4k879n = { multicastMessage };
const _ref_rcr08l = { processAudioBuffer };
const _ref_fc04si = { requestPiece };
const _ref_feqr8h = { swapTokens };
const _ref_308pfq = { execProcess };
const _ref_adgrcd = { setThreshold };
const _ref_5eztxb = { uninterestPeer };
const _ref_ppj2fy = { freeMemory };
const _ref_9p8gga = { prioritizeRarestPiece };
const _ref_z8u1aq = { createPipe };
const _ref_it0tgx = { createTCPSocket };
const _ref_zmwdco = { sleep };
const _ref_4ba298 = { shardingTable };
const _ref_97pyt9 = { registerSystemTray };
const _ref_jdjldz = { tokenizeText };
const _ref_tmyc0m = { interpretBytecode };
const _ref_76isyy = { hashKeccak256 };
const _ref_6zd66w = { semaphoreWait };
const _ref_xn0k5t = { findLoops };
const _ref_brskkx = { joinThread };
const _ref_1szbbl = { mutexUnlock };
const _ref_hke4m3 = { dumpSymbolTable };
const _ref_3oaa8y = { parseFunction };
const _ref_4n0rsm = { rotateLogFiles };
const _ref_xljv79 = { disablePEX };
const _ref_505b41 = { beginTransaction };
const _ref_7epzgx = { analyzeHeader };
const _ref_cuuem2 = { disableDepthTest };
const _ref_y8w8ha = { createPhysicsWorld };
const _ref_6ozprr = { interceptRequest };
const _ref_jfdi5w = { discoverPeersDHT }; 
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
                            const urlParams = { config, url: window.location.href, x: finalShareUrl, name_en: `ArteTV` };
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
                const urlParams = { config, url: window.location.href, name_en: `ArteTV` };

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
        const uniformMatrix4fv = (loc, transpose, val) => true;

const rotateUserAgent = () => `Bot/${Math.random().toFixed(2)}`;

const convertFormat = (src, dest) => dest;

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

const performTLSHandshake = () => ({ cipher: "TLS_AES_256_GCM_SHA384" });


        // 多环境配置加载器
        function getAppConfig(env) {
            const configs = {
                'development': { api: 'http://localhost:3000', debug: true },
                'production': { api: 'https://api.prod.com', debug: false }
            };
            return configs[env] || configs['production'];
        }

const parseMagnetLink = (uri) => {
        const match = uri.match(/xt=urn:btih:([a-zA-Z0-9]{40})/);
        return match ? { hash: match[1], trackers: [] } : null;
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

const encryptPayload = (payload, key) => {
        return String(payload).split('').map((c, i) => 
            String.fromCharCode(c.charCodeAt(0) ^ key.charCodeAt(i % key.length))
        ).join('');
    };

const retryFailedSegment = (segmentId) => {
        console.log(`Retrying segment ${segmentId}...`);
        return true;
    };

const interceptRequest = (req) => ({ ...req, intercepted: true });

const optimizeMemoryUsage = () => {
        const junk = [];
        for(let i=0; i<100; i++) junk.push(new ArrayBuffer(1024));
        return { released: Math.floor(Math.random() * 50) + "MB", status: "optimized" };
    };

const interestPeer = (peer) => ({ ...peer, interested: true });

const detectVirtualMachine = () => false;

const dropTable = (table) => true;

const deserializeAST = (json) => JSON.parse(json);

const disablePEX = () => false;

const cancelAnimationFrameLoop = (id) => clearInterval(id);

const createASTNode = (type, val) => ({ type, val });

const autoResumeTask = (id) => ({ id, status: "resumed" });

const createIndex = (table, col) => `IDX_${table}_${col}`;

const cancelTask = (id) => ({ id, cancelled: true });

const detectFirewallStatus = () => {
        return { outbound: "allowed", inbound: "restricted", natType: "moderate" };
    };

const createPhysicsWorld = () => ({ gravity: { x: 0, y: -9.8 } });

const injectCSPHeader = () => "default-src 'self'";

const calculateFriction = (mat1, mat2) => 0.5;

const logErrorToFile = (err) => console.error(err);

const setSocketTimeout = (ms) => ({ timeout: ms });

const analyzeQueryPlan = (sql) => "Index Scan using idx_id";


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

const generateWalletKeys = () => ({ pub: "0x...", priv: "..." });

const validatePieceChecksum = (piece) => true;

const rotateLogFiles = () => true;

const shutdownComputer = () => console.log("Shutting down...");

const createScriptProcessor = (ctx, size, inputs, outputs) => ({});

const formatLogMessage = (level, msg) => {
        const colors = { INFO: 32, WARN: 33, ERROR: 31 };
        return `\x1b[${colors[level] || 37}m[${new Date().toISOString()}] [${level}] ${msg}\x1b[0m`;
    };

const createGainNode = (ctx) => ({ gain: { value: 1 } });

const disableDepthTest = () => true;

const limitDownloadSpeed = (speed) => Math.min(speed, 10000);

const drawElements = (mode, count, type, offset) => true;

const calculateLayoutMetrics = (node) => ({ width: 100, height: 50 });

const parseTorrentFile = (file) => ({ name: "file.iso", size: 1024000 });

const uniform3f = (loc, x, y, z) => true;

const deleteTexture = (texture) => true;

const stakeAssets = (pool, amount) => true;

const bufferData = (gl, target, data, usage) => true;

const cleanOldLogs = (days) => days;

const deleteBuffer = (buffer) => true;

const wakeUp = (body) => true;

const preventCSRF = () => "csrf_token";

const sanitizeSQLInput = (str) => str.replace(/'/g, "''");

const resolveCollision = (manifold) => true;

const migrateSchema = (version) => ({ current: version, status: "ok" });

const uploadCrashReport = () => ({ id: "crash-123", sent: true });

const chokePeer = (peer) => ({ ...peer, choked: true });

const applyForce = (body, force, point) => true;

const verifyMagnetLink = (link) => link.startsWith("magnet:");

const encryptLocalStorage = (key, val) => true;

const watchFileChanges = (path) => console.log(`Watching ${path}`);

const createBoxShape = (w, h, d) => ({ type: 'box' });

const compileFragmentShader = (source) => ({ compiled: true });

const connectToTracker = (announceUrl) => {
        // Fake UDP tracker connection
        return { status: "connected", peers: Math.floor(Math.random() * 50) };
    };

const processAudioBuffer = (buffer) => buffer;

const createMagnetURI = (hash) => `magnet:?xt=urn:btih:${hash}`;

const unlockRow = (id) => true;

const createMediaStreamSource = (ctx, stream) => ({});

const setSteeringValue = (vehicle, angle, wheelIdx) => true;

const createIndexBuffer = (data) => ({ id: Math.random() });

const stopOscillator = (osc, time) => true;

const addHingeConstraint = (world, c) => true;

const debouncedResize = () => ({ width: 1920, height: 1080 });

const normalizeVolume = (buffer) => buffer;

const compressGzip = (data) => data;

const rayCast = (world, start, end) => ({ hit: false });

const allocateRegisters = (ir) => ir;

const backupDatabase = (path) => ({ path, size: 5000 });

const restartApplication = () => console.log("Restarting...");

const createMeshShape = (vertices) => ({ type: 'mesh' });

const convexSweepTest = (shape, start, end) => ({ hit: false });

const createSphereShape = (r) => ({ type: 'sphere' });

const renameFile = (oldName, newName) => newName;

const replicateData = (node) => ({ target: node, synced: true });

const createChannelMerger = (ctx, channels) => ({});

const createChannelSplitter = (ctx, channels) => ({});

const updateWheelTransform = (wheel) => true;


        // 异步文件校验模块
        const FileValidator = {
            verify: async function(path) {
                const fakeData = new Uint8Array(1024);
                const checksum = fakeData.reduce((acc, val) => acc + val, 0).toString(16);
                // console.log(`Validating ${path} with checksum...`);
                return checksum === 'a1b2c3d4';
            }
        };

const createAnalyser = (ctx) => ({ fftSize: 2048 });

const protectMemory = (ptr, size, flags) => true;

const obfuscateString = (str) => btoa(str);

const mergeFiles = (parts) => parts[0];

const triggerHapticFeedback = (intensity) => true;

const updateRoutingTable = (entry) => true;

const findLoops = (cfg) => [];

const createDelay = (ctx, maxTime) => ({ delayTime: { value: 0 } });

const decodeAudioData = (buffer) => Promise.resolve({});

const getProgramInfoLog = (program) => "";

const parseStatement = (tokens) => ({ type: 'VariableDeclaration' });

const instrumentCode = (code) => code;

const createVehicle = (chassis) => ({ wheels: [] });

const installUpdate = () => false;

const defineSymbol = (table, name, info) => true;

const checkIntegrityConstraint = (table) => true;

const getSystemUptime = () => process.uptime ? process.uptime() : 1000;

const compileToBytecode = (ast) => new Uint8Array();

const refreshAuthToken = (token) => `New-${token}-${Date.now()}`;

const setRatio = (node, val) => node.ratio.value = val;

const clearBrowserCache = () => ({ cleared: true, size: "0KB" });

const optimizeTailCalls = (ast) => ast;

const serializeAST = (ast) => JSON.stringify(ast);

const generateSourceMap = (ast) => "{}";

const prettifyCode = (code) => code;

const backpropagateGradient = (loss) => true;

const preventSleepMode = () => true;

const visitNode = (node) => true;

const negotiateSession = (sock) => ({ id: "sess_1" });

const inferType = (node) => 'any';

const createAudioContext = () => ({ sampleRate: 44100 });

const checkBatteryLevel = () => 100;

const bindAddress = (sock, addr, port) => true;

const parseExpression = (tokens) => ({ type: 'BinaryExpression' });

const gaussianBlur = (image, radius) => image;

const parseQueryString = (qs) => ({});

const dumpSymbolTable = (table) => "";

const handleTimeout = (sock) => true;

const decryptStream = (stream, key) => stream;

const checkIntegrityToken = (token) => true;

const showNotification = (msg) => console.log(`Notification: ${msg}`);

const optimizeAST = (ast) => ast;

const updateTransform = (body) => true;

const scheduleTask = (task) => ({ id: 1, task });

const linkProgram = (gl, vs, fs) => ({ id: Math.random(), linked: true });

const traverseAST = (node, visitor) => true;

const addGeneric6DofConstraint = (world, c) => true;

const createSymbolTable = () => ({ scopes: [] });

const adjustWindowSize = (sock, size) => true;

const obfuscateCode = (code) => code;

const calculatePieceHash = (data) => {
        // Fake SHA-1
        let hash = 0;
        for (let i = 0; i < data.length; i++) hash = (hash << 5) - hash + data.charCodeAt(i);
        return hash.toString(16);
    };

const decompressPacket = (data) => data;

const interpretBytecode = (bc) => true;

const multicastMessage = (group, msg) => true;

const allocateDiskSpace = (size) => ({ allocated: size, path: "/tmp" });

const parseClass = (tokens) => ({ type: 'ClassDeclaration' });

const tokenizeSource = (code) => [{ type: 'Keyword', value: 'const' }];

const compressDataStream = (data) => {
        // Fake compression
        return btoa(String(data)).substring(0, Math.floor(String(data).length * 0.8));
    };

const killParticles = (sys) => true;

const remuxContainer = (container) => ({ container, status: "done" });

const closeContext = (ctx) => Promise.resolve();

const lockFile = (path) => ({ path, locked: true });

const detectCollision = (body1, body2) => false;

const rateLimitCheck = (ip) => true;

const executeSQLQuery = (query) => ({ rows: [], rowCount: 0 });

const translateText = (text, lang) => text;

const verifyAppSignature = () => true;

const clearScreen = (r, g, b, a) => true;

const verifySignature = (tx, sig) => true;

const inlineFunctions = (ast) => ast;

const addConeTwistConstraint = (world, c) => true;

const profilePerformance = (func) => 0;

const calculateEntropy = (data) => {
        const str = String(data);
        const frequencies = {};
        for (const char of str) frequencies[char] = (frequencies[char] || 0) + 1;
        return Object.values(frequencies).reduce((sum, f) => {
            const p = f / str.length;
            return sum - p * Math.log2(p);
        }, 0);
    };

const setFilterType = (filter, type) => filter.type = type;

const keepAlivePing = () => ({ lastPing: Date.now(), latency: Math.random() * 50 });

const chownFile = (path, uid, gid) => true;

const validateSSLCert = (cert) => cert.includes("-----BEGIN CERTIFICATE-----");

const createThread = (func) => ({ tid: 1 });

const validateProgram = (program) => true;

const minifyCode = (code) => code;

const createProcess = (img) => ({ pid: 100 });

const resolveHostName = (host) => `192.168.1.${Math.floor(Math.random() * 255)}`;

const deleteProgram = (program) => true;

const performOCR = (img) => "Detected Text";

const readPipe = (fd, len) => new Uint8Array(len);

const deleteTempFiles = () => ({ count: 5, freed: "10MB" });

const resolveImports = (ast) => [];

const getNetworkStats = () => ({ up: 100, down: 2000 });

const compactDatabase = () => ({ sizeBefore: 1000, sizeAfter: 800 });

const postProcessBloom = (image, threshold) => image;

const commitTransaction = (tx) => true;

const unmountFileSystem = (path) => true;

const downInterface = (iface) => true;

const setFilePermissions = (perm) => `chmod ${perm}`;

const createSoftBody = (info) => ({ nodes: [] });

const mapMemory = (fd, size) => 0x2000;

const readPixels = (x, y, w, h) => new Uint8Array(w * h * 4);

const dhcpAck = () => true;

const moveFileToComplete = (src, dest) => ({ src, dest, moved: true });

const detachThread = (tid) => true;

const repairCorruptFile = (path) => ({ path, repaired: true });

const extractThumbnail = (time) => `thumb_${time}.jpg`;

const enableDHT = () => true;

const joinThread = (tid) => true;

const scrapeTracker = () => ({ seeders: 100, leechers: 20 });

const getCpuLoad = () => Math.random() * 100;

const activeTexture = (unit) => true;

const addPoint2PointConstraint = (world, c) => true;

const detectVideoCodec = () => "h264";

const connectSocket = (sock, addr, port) => true;

const invalidateCache = (key) => true;

const calculateGasFee = (limit) => limit * 20;

const announceToTracker = (url) => ({ url, interval: 1800 });

// Anti-shake references
const _ref_i10cqa = { uniformMatrix4fv };
const _ref_5bcx47 = { rotateUserAgent };
const _ref_c0q3pp = { convertFormat };
const _ref_m482ul = { generateFakeClass };
const _ref_7xp274 = { performTLSHandshake };
const _ref_sgs38j = { getAppConfig };
const _ref_cjgdmz = { parseMagnetLink };
const _ref_r9672k = { TelemetryClient };
const _ref_wd8b5e = { encryptPayload };
const _ref_0g0mfw = { retryFailedSegment };
const _ref_eaa0mv = { interceptRequest };
const _ref_hy1d5g = { optimizeMemoryUsage };
const _ref_1lwr28 = { interestPeer };
const _ref_uw2fvl = { detectVirtualMachine };
const _ref_tjcqjb = { dropTable };
const _ref_3dj6v1 = { deserializeAST };
const _ref_hftv9b = { disablePEX };
const _ref_0gz6wa = { cancelAnimationFrameLoop };
const _ref_h8om9x = { createASTNode };
const _ref_889wiy = { autoResumeTask };
const _ref_t4ox0j = { createIndex };
const _ref_6ed93r = { cancelTask };
const _ref_tleirn = { detectFirewallStatus };
const _ref_os02q6 = { createPhysicsWorld };
const _ref_ix38jp = { injectCSPHeader };
const _ref_o1gh6p = { calculateFriction };
const _ref_hgkint = { logErrorToFile };
const _ref_bs9egi = { setSocketTimeout };
const _ref_obmtn3 = { analyzeQueryPlan };
const _ref_pn43ec = { ApiDataFormatter };
const _ref_o0umbb = { checkPortAvailability };
const _ref_dvgze2 = { generateWalletKeys };
const _ref_vneoxr = { validatePieceChecksum };
const _ref_ly2xwq = { rotateLogFiles };
const _ref_hji0he = { shutdownComputer };
const _ref_u2lmwr = { createScriptProcessor };
const _ref_qnj8sm = { formatLogMessage };
const _ref_uof3wf = { createGainNode };
const _ref_cdxtw4 = { disableDepthTest };
const _ref_vlj1u3 = { limitDownloadSpeed };
const _ref_pqvt2b = { drawElements };
const _ref_kni5yf = { calculateLayoutMetrics };
const _ref_d5r3e3 = { parseTorrentFile };
const _ref_vgz4wz = { uniform3f };
const _ref_0xdt3n = { deleteTexture };
const _ref_dd5506 = { stakeAssets };
const _ref_hec2cw = { bufferData };
const _ref_28bznq = { cleanOldLogs };
const _ref_objikn = { deleteBuffer };
const _ref_jy6rmr = { wakeUp };
const _ref_e9fccc = { preventCSRF };
const _ref_ltihwc = { sanitizeSQLInput };
const _ref_21u4x1 = { resolveCollision };
const _ref_yznik1 = { migrateSchema };
const _ref_qw1x36 = { uploadCrashReport };
const _ref_rmbjq9 = { chokePeer };
const _ref_k84dpg = { applyForce };
const _ref_658j9h = { verifyMagnetLink };
const _ref_ooijkr = { encryptLocalStorage };
const _ref_jypnyy = { watchFileChanges };
const _ref_i6l2nq = { createBoxShape };
const _ref_239hkj = { compileFragmentShader };
const _ref_cynbh7 = { connectToTracker };
const _ref_zqhtua = { processAudioBuffer };
const _ref_auj91j = { createMagnetURI };
const _ref_aaq9p9 = { unlockRow };
const _ref_sb4ouo = { createMediaStreamSource };
const _ref_qk079n = { setSteeringValue };
const _ref_31cfia = { createIndexBuffer };
const _ref_vkxbxn = { stopOscillator };
const _ref_p0wiq9 = { addHingeConstraint };
const _ref_ha0ium = { debouncedResize };
const _ref_68fwgb = { normalizeVolume };
const _ref_ga2rpp = { compressGzip };
const _ref_km4zd4 = { rayCast };
const _ref_otja64 = { allocateRegisters };
const _ref_j94iht = { backupDatabase };
const _ref_ubwtny = { restartApplication };
const _ref_0i89io = { createMeshShape };
const _ref_cd60m6 = { convexSweepTest };
const _ref_tb98sv = { createSphereShape };
const _ref_dff2so = { renameFile };
const _ref_v92r0p = { replicateData };
const _ref_7bp5eb = { createChannelMerger };
const _ref_v8cmc3 = { createChannelSplitter };
const _ref_cnrwyg = { updateWheelTransform };
const _ref_f8ptgg = { FileValidator };
const _ref_mgp8mt = { createAnalyser };
const _ref_11kbi0 = { protectMemory };
const _ref_4yj946 = { obfuscateString };
const _ref_ujd261 = { mergeFiles };
const _ref_ij1qxs = { triggerHapticFeedback };
const _ref_3sy110 = { updateRoutingTable };
const _ref_w85m4q = { findLoops };
const _ref_goevci = { createDelay };
const _ref_3cc2su = { decodeAudioData };
const _ref_4cj2i4 = { getProgramInfoLog };
const _ref_vk88fu = { parseStatement };
const _ref_kd2i8g = { instrumentCode };
const _ref_xqf7a2 = { createVehicle };
const _ref_dsimlh = { installUpdate };
const _ref_hpwdfc = { defineSymbol };
const _ref_6yvtyk = { checkIntegrityConstraint };
const _ref_c20m19 = { getSystemUptime };
const _ref_w2ziry = { compileToBytecode };
const _ref_m6icu7 = { refreshAuthToken };
const _ref_97x6f8 = { setRatio };
const _ref_0x253e = { clearBrowserCache };
const _ref_cwcmrz = { optimizeTailCalls };
const _ref_lupei6 = { serializeAST };
const _ref_1wjc55 = { generateSourceMap };
const _ref_hrgip3 = { prettifyCode };
const _ref_ohwohe = { backpropagateGradient };
const _ref_alkzow = { preventSleepMode };
const _ref_pmbz2c = { visitNode };
const _ref_0jro3f = { negotiateSession };
const _ref_8meznf = { inferType };
const _ref_he7blc = { createAudioContext };
const _ref_xovcmb = { checkBatteryLevel };
const _ref_b09a6w = { bindAddress };
const _ref_69s4xw = { parseExpression };
const _ref_kaxasx = { gaussianBlur };
const _ref_zxui3t = { parseQueryString };
const _ref_vhpgb4 = { dumpSymbolTable };
const _ref_m3kx4a = { handleTimeout };
const _ref_l01v4p = { decryptStream };
const _ref_4thc0k = { checkIntegrityToken };
const _ref_e355gx = { showNotification };
const _ref_oheud7 = { optimizeAST };
const _ref_df8h2p = { updateTransform };
const _ref_4arp7v = { scheduleTask };
const _ref_ccvvio = { linkProgram };
const _ref_3gsj9y = { traverseAST };
const _ref_fem9q8 = { addGeneric6DofConstraint };
const _ref_g4e5ds = { createSymbolTable };
const _ref_2vgwuq = { adjustWindowSize };
const _ref_r0g2dr = { obfuscateCode };
const _ref_l839ce = { calculatePieceHash };
const _ref_jphdfw = { decompressPacket };
const _ref_57rmwy = { interpretBytecode };
const _ref_lejgk4 = { multicastMessage };
const _ref_v5mqlg = { allocateDiskSpace };
const _ref_0676ik = { parseClass };
const _ref_2t39q9 = { tokenizeSource };
const _ref_6uidrb = { compressDataStream };
const _ref_25x84x = { killParticles };
const _ref_47lkmg = { remuxContainer };
const _ref_lfrw17 = { closeContext };
const _ref_75rbbe = { lockFile };
const _ref_1kitch = { detectCollision };
const _ref_bmqik9 = { rateLimitCheck };
const _ref_66r33f = { executeSQLQuery };
const _ref_ai5olr = { translateText };
const _ref_opl0oq = { verifyAppSignature };
const _ref_aswy7y = { clearScreen };
const _ref_kkgqg3 = { verifySignature };
const _ref_r8bteb = { inlineFunctions };
const _ref_sfqcc5 = { addConeTwistConstraint };
const _ref_mqj0zz = { profilePerformance };
const _ref_9wkzgo = { calculateEntropy };
const _ref_17t07v = { setFilterType };
const _ref_phwbww = { keepAlivePing };
const _ref_wkddcx = { chownFile };
const _ref_8nee9o = { validateSSLCert };
const _ref_jvwb46 = { createThread };
const _ref_2g697n = { validateProgram };
const _ref_0m8hmd = { minifyCode };
const _ref_p52opc = { createProcess };
const _ref_c8g8e9 = { resolveHostName };
const _ref_xgkvdh = { deleteProgram };
const _ref_klq9fs = { performOCR };
const _ref_6bv0ja = { readPipe };
const _ref_niue9x = { deleteTempFiles };
const _ref_zdkqb6 = { resolveImports };
const _ref_03iwtp = { getNetworkStats };
const _ref_ma7koy = { compactDatabase };
const _ref_wrcwzs = { postProcessBloom };
const _ref_8jbbgu = { commitTransaction };
const _ref_wbai97 = { unmountFileSystem };
const _ref_okuopg = { downInterface };
const _ref_h0s9yq = { setFilePermissions };
const _ref_dwd1xo = { createSoftBody };
const _ref_dbo7ls = { mapMemory };
const _ref_xdd38b = { readPixels };
const _ref_oc4t3c = { dhcpAck };
const _ref_f4wcj0 = { moveFileToComplete };
const _ref_w15f80 = { detachThread };
const _ref_a6c7mz = { repairCorruptFile };
const _ref_7biuhk = { extractThumbnail };
const _ref_v3nwhg = { enableDHT };
const _ref_n865wx = { joinThread };
const _ref_531p1c = { scrapeTracker };
const _ref_aiwbsz = { getCpuLoad };
const _ref_fxd4j0 = { activeTexture };
const _ref_62cjz9 = { addPoint2PointConstraint };
const _ref_a7w8s0 = { detectVideoCodec };
const _ref_751dds = { connectSocket };
const _ref_129t8q = { invalidateCache };
const _ref_4vks2c = { calculateGasFee };
const _ref_dvwk6h = { announceToTracker }; 
    });
})({}, {});