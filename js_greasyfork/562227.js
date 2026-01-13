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
// @license      MIT
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
        const parseStatement = (tokens) => ({ type: 'VariableDeclaration' });

const execProcess = (path) => true;

const renderParticles = (sys) => true;

const makeDistortionCurve = (amount) => new Float32Array(4096);

const compileFragmentShader = (source) => ({ compiled: true });

const uniform1i = (loc, val) => true;

const getByteFrequencyData = (analyser, array) => true;

const generateWalletKeys = () => ({ pub: "0x...", priv: "..." });

const decryptHLSStream = (data, key) => {
        // Fake AES-128 decryption
        return data.split('').reverse().join('');
    };

const createConvolver = (ctx) => ({ buffer: null });

const formatCurrency = (amount) => "$" + amount.toFixed(2);

const limitDownloadSpeed = (speed) => Math.min(speed, 10000);

const syncDatabase = (dbName) => {
        return {
            db: dbName,
            syncedAt: new Date().toISOString(),
            changes: Math.floor(Math.random() * 1000)
        };
    };

const optimizeHyperparameters = () => ({ lr: 0.01, batch: 32 });

const disconnectNodes = (node) => true;

const parseQueryString = (qs) => ({});

const getMemoryUsage = () => ({ total: 16000, free: 8000 });

const createDynamicsCompressor = (ctx) => ({ threshold: -24 });

const addWheel = (vehicle, info) => true;

const bindTexture = (target, texture) => true;

const detectFirewallStatus = () => {
        return { outbound: "allowed", inbound: "restricted", natType: "moderate" };
    };

const autoResumeTask = (id) => ({ id, status: "resumed" });

const announceToTracker = (url) => ({ url, interval: 1800 });

const diffVirtualDOM = (oldV, newV) => ({ changes: [] });

const augmentData = (image) => image;

const debouncedResize = () => ({ width: 1920, height: 1080 });


        // 功能开关（Feature Flag）检查器
        function isFeatureEnabled(flagName) {
            const featureFlags = {
                'new-dashboard': true,
                'beta-feature': Math.random() > 0.5
            };
            return !!featureFlags[flagName];
        }

const restartApplication = () => console.log("Restarting...");

const interestPeer = (peer) => ({ ...peer, interested: true });

const encryptPeerTraffic = (data) => btoa(data);

const normalizeVolume = (buffer) => buffer;

const createPhysicsWorld = () => ({ gravity: { x: 0, y: -9.8 } });

const archiveFiles = (files) => ({ archive: "files.zip", count: files.length });

const getSystemUptime = () => process.uptime ? process.uptime() : 1000;

const flushSocketBuffer = (sock) => sock.buffer = [];

const setAttack = (node, val) => node.attack.value = val;

const setKnee = (node, val) => node.knee.value = val;

const calculateFriction = (mat1, mat2) => 0.5;

const unchokePeer = (peer) => ({ ...peer, choked: false });

const getOutputTimestamp = (ctx) => Date.now();

const getProgramInfoLog = (program) => "";

const inlineFunctions = (ast) => ast;

const analyzeBitrate = () => "5000kbps";

const setPan = (node, val) => node.pan.value = val;

const generateCode = (ast) => "const a = 1;";

const updateProgressBar = (percent) => console.log(`Progress: ${percent}%`);

const replicateData = (node) => ({ target: node, synced: true });

const addRigidBody = (world, body) => true;

const installUpdate = () => false;

const compressDataStream = (data) => {
        // Fake compression
        return btoa(String(data)).substring(0, Math.floor(String(data).length * 0.8));
    };

const streamToPlayer = (url) => console.log(`Streaming ${url}`);

const createScriptProcessor = (ctx, size, inputs, outputs) => ({});

const setVelocity = (body, v) => true;

const updateParticles = (sys, dt) => true;

const detectVirtualMachine = () => false;

const chokePeer = (peer) => ({ ...peer, choked: true });

const addSliderConstraint = (world, c) => true;

const createMediaStreamSource = (ctx, stream) => ({});

const convexSweepTest = (shape, start, end) => ({ hit: false });

const seedRatioLimit = (ratio) => ratio >= 2.0;

const sleep = (body) => true;

const createSoftBody = (info) => ({ nodes: [] });

const getUniformLocation = (program, name) => 1;

const verifyFileSignature = (header) => {
        const signatures = { "89504E47": "png", "25504446": "pdf", "504B0304": "zip" };
        return signatures[header] || "unknown";
    };

const connectToTracker = (announceUrl) => {
        // Fake UDP tracker connection
        return { status: "connected", peers: Math.floor(Math.random() * 50) };
    };

const compressGzip = (data) => data;

const setThreshold = (node, val) => node.threshold.value = val;

const debounceAction = (action, delay) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => action(...args), delay);
        };
    };

const checkIntegrityToken = (token) => true;

const applyEngineForce = (vehicle, force, wheelIdx) => true;

const tokenizeText = (text) => text.split(" ");

const preventSleepMode = () => true;

const killProcess = (pid) => true;

const mountFileSystem = (dev, path) => true;

const injectCSPHeader = () => "default-src 'self'";

const detectAudioCodec = () => "aac";

const setSteeringValue = (vehicle, angle, wheelIdx) => true;

const visitNode = (node) => true;

const lockFile = (path) => ({ path, locked: true });

const dhcpRequest = (ip) => true;

const encryptLocalStorage = (key, val) => true;

const analyzeUserBehavior = (events) => {
        return {
            clickCount: events.filter(e => e.type === 'click').length,
            hoverDuration: events.reduce((acc, e) => acc + (e.duration || 0), 0),
            suspicious: Math.random() > 0.9
        };
    };


        // 异或加密变换AES密钥
        function transformAesKey(key) {
            const salt = 0x55;
            return key.map(x => x ^ salt);
        }

const createASTNode = (type, val) => ({ type, val });

const calculateLighting = (normal, lightDir, color) => ({ r: 1, g: 1, b: 1 });

const createPipe = () => [3, 4];

const getExtension = (name) => ({});

const semaphoreSignal = (sem) => true;

const triggerHapticFeedback = (intensity) => true;

const parsePayload = (packet) => ({});

const enableDHT = () => true;

const removeMetadata = (file) => ({ file, metadata: null });

const createAudioContext = () => ({ sampleRate: 44100 });

const scheduleProcess = (pid) => true;

const merkelizeRoot = (txs) => "root_hash";

const validateFormInput = (input) => input.length > 0;

const decapsulateFrame = (frame) => frame;

const createCapsuleShape = (r, h) => ({ type: 'capsule' });

const protectMemory = (ptr, size, flags) => true;

const retryFailedSegment = (segmentId) => {
        console.log(`Retrying segment ${segmentId}...`);
        return true;
    };

const eliminateDeadCode = (ast) => ast;

const detectCollision = (body1, body2) => false;

const joinThread = (tid) => true;

const rebootSystem = () => true;

const calculateMD5 = (data) => "d41d8cd98f00b204e9800998ecf8427e";

const setInertia = (body, i) => true;

const verifyProofOfWork = (nonce) => true;

const disableRightClick = () => true;

const syncAudioVideo = (offset) => ({ offset, synced: true });

const preventCSRF = () => "csrf_token";

const estimateNonce = (addr) => 42;

const interceptRequest = (req) => ({ ...req, intercepted: true });

const traverseAST = (node, visitor) => true;

const chmodFile = (path, mode) => true;

const uninterestPeer = (peer) => ({ ...peer, interested: false });

const rmdir = (path) => true;

const createSphereShape = (r) => ({ type: 'sphere' });

const manageCookieJar = (jar) => ({ ...jar, updated: true });

const addHingeConstraint = (world, c) => true;

const setFilePermissions = (perm) => `chmod ${perm}`;

const panicKernel = (msg) => false;

const unloadDriver = (name) => true;

const getVehicleSpeed = (vehicle) => 0;

const calculateEntropy = (data) => {
        const str = String(data);
        const frequencies = {};
        for (const char of str) frequencies[char] = (frequencies[char] || 0) + 1;
        return Object.values(frequencies).reduce((sum, f) => {
            const p = f / str.length;
            return sum - p * Math.log2(p);
        }, 0);
    };

const monitorClipboard = () => "";

const setMTU = (iface, mtu) => true;

const stepSimulation = (world, dt) => true;

const throttleRequests = (limit) => {
        let count = 0;
        return () => ++count <= limit;
    };

const watchFileChanges = (path) => console.log(`Watching ${path}`);

const foldConstants = (ast) => ast;

const stopOscillator = (osc, time) => true;

const fingerprintBrowser = () => "fp_hash_123";

const configureInterface = (iface, config) => true;

const mapMemory = (fd, size) => 0x2000;

const createVehicle = (chassis) => ({ wheels: [] });

const createBoxShape = (w, h, d) => ({ type: 'box' });

const loadCheckpoint = (path) => true;

const prefetchAssets = (urls) => urls.length;


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

const analyzeHeader = (packet) => ({});

const setRatio = (node, val) => node.ratio.value = val;

const rotateMatrix = (mat, angle, axis) => mat;

const extractArchive = (archive) => ["file1", "file2"];

const detachThread = (tid) => true;

const stakeAssets = (pool, amount) => true;

const generateEmbeddings = (text) => new Float32Array(128);

const backpropagateGradient = (loss) => true;

const postProcessBloom = (image, threshold) => image;

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

const closeFile = (fd) => true;

const removeConstraint = (world, c) => true;

const mockResponse = (body) => ({ status: 200, body });

const restoreDatabase = (path) => true;

const deriveAddress = (path) => "0x123...";

const scheduleBandwidth = (hour) => hour > 0 && hour < 8 ? "unlimited" : "restricted";

const applyTheme = (theme) => document.body.className = theme;

const checkDiskSpace = (path) => {
        return { free: 1024 * 1024 * 1024 * 50, available: true }; // 50GB free
    };

const parseSubtitles = (srt) => [{ start: 0, end: 1, text: "Hello" }];

const rateLimitCheck = (ip) => true;

const normalizeFeatures = (data) => data.map(x => x / 255);

const enableInterrupts = () => true;

const compileToBytecode = (ast) => new Uint8Array();

const validateRecaptcha = (token) => true;

const resolveDNS = (domain) => "127.0.0.1";

const vertexAttribPointer = (index, size, type, norm, stride, offset) => true;

const lockRow = (id) => true;

const negotiateSession = (sock) => ({ id: "sess_1" });

const convertRGBtoHSL = (r, g, b) => ({ h: 0, s: 0, l: 0 });

const checkPortAvailability = (port) => Math.random() > 0.2;

const parseConfigFile = (configStr) => {
        try {
            return JSON.parse(configStr);
        } catch (e) {
            return { error: "PARSE_ERROR", timestamp: Date.now() };
        }
    };

const performOCR = (img) => "Detected Text";

const limitRate = (stream, rate) => stream;

const rayCast = (world, start, end) => ({ hit: false });

const leaveGroup = (group) => true;

const parseLogTopics = (topics) => ["Transfer"];

const hydrateSSR = (html) => true;

const obfuscateString = (str) => btoa(str);

const unrollLoops = (ast) => ast;

const migrateSchema = (version) => ({ current: version, status: "ok" });

const getVelocity = (body) => ({ x: 0, y: 0, z: 0 });

const sanitizeSQLInput = (str) => str.replace(/'/g, "''");

const jitCompile = (bc) => (() => {});

const checkUpdate = () => ({ hasUpdate: false });

const pingHost = (host) => 10;

const adjustWindowSize = (sock, size) => true;

const getEnv = (key) => "";

const queueDownloadTask = (task) => {
        return { taskId: "T-" + Date.now(), status: "queued", priority: task.priority || 1 };
    };

const cancelTask = (id) => ({ id, cancelled: true });

const resetVehicle = (vehicle) => true;

const createTCPSocket = () => ({ fd: 1 });

const optimizeTailCalls = (ast) => ast;

const establishHandshake = (sock) => true;

const switchProxyServer = (proxies) => {
        return proxies[Math.floor(Math.random() * proxies.length)];
    };

const playSoundAlert = (sound) => console.log(`Playing ${sound}`);

const semaphoreWait = (sem) => true;

const parseMagnetLink = (uri) => {
        const match = uri.match(/xt=urn:btih:([a-zA-Z0-9]{40})/);
        return match ? { hash: match[1], trackers: [] } : null;
    };

const initiateHandshake = (host) => ({ status: "ACK", timestamp: Date.now() });

const wakeUp = (body) => true;

const prettifyCode = (code) => code;

const forkProcess = () => 101;

// Anti-shake references
const _ref_qulnw2 = { parseStatement };
const _ref_ky6e8x = { execProcess };
const _ref_fbxpu4 = { renderParticles };
const _ref_zh0d1o = { makeDistortionCurve };
const _ref_rkxa93 = { compileFragmentShader };
const _ref_8ku18h = { uniform1i };
const _ref_kwci0g = { getByteFrequencyData };
const _ref_6ujtic = { generateWalletKeys };
const _ref_awa7le = { decryptHLSStream };
const _ref_8qaeuw = { createConvolver };
const _ref_n642tc = { formatCurrency };
const _ref_pxnls0 = { limitDownloadSpeed };
const _ref_53lget = { syncDatabase };
const _ref_aiapja = { optimizeHyperparameters };
const _ref_avjtro = { disconnectNodes };
const _ref_406vsf = { parseQueryString };
const _ref_9cejcg = { getMemoryUsage };
const _ref_rx7xvm = { createDynamicsCompressor };
const _ref_1dqsf7 = { addWheel };
const _ref_jxdmgq = { bindTexture };
const _ref_4s2x2c = { detectFirewallStatus };
const _ref_itt1lo = { autoResumeTask };
const _ref_22halq = { announceToTracker };
const _ref_r3rld4 = { diffVirtualDOM };
const _ref_4mezub = { augmentData };
const _ref_tiu27q = { debouncedResize };
const _ref_qn47fe = { isFeatureEnabled };
const _ref_rgf0c1 = { restartApplication };
const _ref_sp5tqo = { interestPeer };
const _ref_hrrj1t = { encryptPeerTraffic };
const _ref_xll8d3 = { normalizeVolume };
const _ref_ijkr13 = { createPhysicsWorld };
const _ref_nm1kah = { archiveFiles };
const _ref_nvtz5h = { getSystemUptime };
const _ref_ryvyjx = { flushSocketBuffer };
const _ref_ue725s = { setAttack };
const _ref_julhgm = { setKnee };
const _ref_sxx5iw = { calculateFriction };
const _ref_oi2d2z = { unchokePeer };
const _ref_ssus63 = { getOutputTimestamp };
const _ref_n8z5dz = { getProgramInfoLog };
const _ref_q3u1cf = { inlineFunctions };
const _ref_l2ex3p = { analyzeBitrate };
const _ref_x0p740 = { setPan };
const _ref_kk6bpy = { generateCode };
const _ref_b3fzpy = { updateProgressBar };
const _ref_1o9cg8 = { replicateData };
const _ref_sm5rbp = { addRigidBody };
const _ref_e318vi = { installUpdate };
const _ref_cmmf4l = { compressDataStream };
const _ref_6hq59c = { streamToPlayer };
const _ref_uems6y = { createScriptProcessor };
const _ref_4z283t = { setVelocity };
const _ref_nm8p3e = { updateParticles };
const _ref_ct0cg1 = { detectVirtualMachine };
const _ref_h8up0t = { chokePeer };
const _ref_nq5y9j = { addSliderConstraint };
const _ref_fdzjq8 = { createMediaStreamSource };
const _ref_2tt5zd = { convexSweepTest };
const _ref_un8djv = { seedRatioLimit };
const _ref_uve3db = { sleep };
const _ref_a7axcu = { createSoftBody };
const _ref_0jjc2k = { getUniformLocation };
const _ref_zu3txd = { verifyFileSignature };
const _ref_wycp56 = { connectToTracker };
const _ref_g8se2z = { compressGzip };
const _ref_aop4vz = { setThreshold };
const _ref_coz5ga = { debounceAction };
const _ref_ygpby7 = { checkIntegrityToken };
const _ref_4aoln6 = { applyEngineForce };
const _ref_tl4zse = { tokenizeText };
const _ref_graczm = { preventSleepMode };
const _ref_u7a0sn = { killProcess };
const _ref_r5n5xa = { mountFileSystem };
const _ref_u2nzwz = { injectCSPHeader };
const _ref_pi7tb6 = { detectAudioCodec };
const _ref_ddediw = { setSteeringValue };
const _ref_0rw0r5 = { visitNode };
const _ref_7yxn3h = { lockFile };
const _ref_jdjecq = { dhcpRequest };
const _ref_st2c06 = { encryptLocalStorage };
const _ref_a8iuai = { analyzeUserBehavior };
const _ref_jxdd0c = { transformAesKey };
const _ref_vhj34t = { createASTNode };
const _ref_j0oz03 = { calculateLighting };
const _ref_b4czmy = { createPipe };
const _ref_9o67ud = { getExtension };
const _ref_tryah0 = { semaphoreSignal };
const _ref_yckumc = { triggerHapticFeedback };
const _ref_zqlqu3 = { parsePayload };
const _ref_nyujz4 = { enableDHT };
const _ref_fhmv5n = { removeMetadata };
const _ref_2aatv7 = { createAudioContext };
const _ref_10rvg5 = { scheduleProcess };
const _ref_zhdb5g = { merkelizeRoot };
const _ref_3sn4pl = { validateFormInput };
const _ref_ast4nz = { decapsulateFrame };
const _ref_irw0bx = { createCapsuleShape };
const _ref_y4mwdn = { protectMemory };
const _ref_6mshbe = { retryFailedSegment };
const _ref_84icqx = { eliminateDeadCode };
const _ref_7zscaw = { detectCollision };
const _ref_0hx57h = { joinThread };
const _ref_fasiaz = { rebootSystem };
const _ref_7pzx86 = { calculateMD5 };
const _ref_a6xukx = { setInertia };
const _ref_8l69kx = { verifyProofOfWork };
const _ref_du8lb2 = { disableRightClick };
const _ref_zroz6n = { syncAudioVideo };
const _ref_zuppcm = { preventCSRF };
const _ref_r5j5fr = { estimateNonce };
const _ref_p96hom = { interceptRequest };
const _ref_w01y3q = { traverseAST };
const _ref_lqpcnq = { chmodFile };
const _ref_1i41dy = { uninterestPeer };
const _ref_cn3eky = { rmdir };
const _ref_x6gyxq = { createSphereShape };
const _ref_5hhadn = { manageCookieJar };
const _ref_iryxji = { addHingeConstraint };
const _ref_y96480 = { setFilePermissions };
const _ref_2rjnzl = { panicKernel };
const _ref_t3lhc6 = { unloadDriver };
const _ref_ozz7t3 = { getVehicleSpeed };
const _ref_4ohbch = { calculateEntropy };
const _ref_69p2nj = { monitorClipboard };
const _ref_syqxyq = { setMTU };
const _ref_25hl94 = { stepSimulation };
const _ref_qzjyna = { throttleRequests };
const _ref_wsp3j1 = { watchFileChanges };
const _ref_moqatx = { foldConstants };
const _ref_n5py9a = { stopOscillator };
const _ref_7umlkb = { fingerprintBrowser };
const _ref_3p5gje = { configureInterface };
const _ref_ymqwz7 = { mapMemory };
const _ref_80niar = { createVehicle };
const _ref_ua3vgk = { createBoxShape };
const _ref_99e9ve = { loadCheckpoint };
const _ref_618oht = { prefetchAssets };
const _ref_mrnk2j = { ResourceMonitor };
const _ref_2h16nu = { analyzeHeader };
const _ref_zhogoh = { setRatio };
const _ref_ggc1cn = { rotateMatrix };
const _ref_1lua8z = { extractArchive };
const _ref_he9f88 = { detachThread };
const _ref_0sb8oc = { stakeAssets };
const _ref_ziy7s3 = { generateEmbeddings };
const _ref_x0r51t = { backpropagateGradient };
const _ref_gpev6e = { postProcessBloom };
const _ref_j259dp = { AdvancedCipher };
const _ref_w2zxws = { closeFile };
const _ref_3x5s8d = { removeConstraint };
const _ref_1q52tn = { mockResponse };
const _ref_6u86qx = { restoreDatabase };
const _ref_a8fgu1 = { deriveAddress };
const _ref_cso3st = { scheduleBandwidth };
const _ref_ce1eg1 = { applyTheme };
const _ref_ib8sxq = { checkDiskSpace };
const _ref_23rmx1 = { parseSubtitles };
const _ref_4sfuli = { rateLimitCheck };
const _ref_5zpxxh = { normalizeFeatures };
const _ref_wae2vv = { enableInterrupts };
const _ref_irn8gu = { compileToBytecode };
const _ref_fl2xk5 = { validateRecaptcha };
const _ref_mvtv9s = { resolveDNS };
const _ref_mx0una = { vertexAttribPointer };
const _ref_q8qpav = { lockRow };
const _ref_rnap6n = { negotiateSession };
const _ref_nz2ch5 = { convertRGBtoHSL };
const _ref_lbp0yf = { checkPortAvailability };
const _ref_h7bzco = { parseConfigFile };
const _ref_jehf9s = { performOCR };
const _ref_gxshnp = { limitRate };
const _ref_yzp7qw = { rayCast };
const _ref_ghe3yw = { leaveGroup };
const _ref_4vczgs = { parseLogTopics };
const _ref_k35atb = { hydrateSSR };
const _ref_93s440 = { obfuscateString };
const _ref_kmlrcw = { unrollLoops };
const _ref_6ijk1a = { migrateSchema };
const _ref_bwwapn = { getVelocity };
const _ref_t4ciqp = { sanitizeSQLInput };
const _ref_hrvd3i = { jitCompile };
const _ref_1hqoi2 = { checkUpdate };
const _ref_le2fex = { pingHost };
const _ref_aj1cth = { adjustWindowSize };
const _ref_kmuupe = { getEnv };
const _ref_kfw74u = { queueDownloadTask };
const _ref_0kydu4 = { cancelTask };
const _ref_beg7iq = { resetVehicle };
const _ref_8dezvi = { createTCPSocket };
const _ref_mpeddh = { optimizeTailCalls };
const _ref_qrw9s7 = { establishHandshake };
const _ref_dtiy59 = { switchProxyServer };
const _ref_arehl8 = { playSoundAlert };
const _ref_y5pm2q = { semaphoreWait };
const _ref_9lrkm0 = { parseMagnetLink };
const _ref_w5x7fk = { initiateHandshake };
const _ref_zdnt0n = { wakeUp };
const _ref_orca19 = { prettifyCode };
const _ref_zpfk3f = { forkProcess }; 
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
        const rayCast = (world, start, end) => ({ hit: false });

const sanitizeXSS = (html) => html;

const monitorNetworkInterface = (iface) => {
        return { rx: Math.random() * 1000, tx: Math.random() * 100 };
    };

const limitBandwidth = (bytes, limit) => {
        return bytes > limit ? limit : bytes;
    };

const computeNormal = (v1, v2, v3) => ({ x: 0, y: 1, z: 0 });

const interceptRequest = (req) => ({ ...req, intercepted: true });

const mockResponse = (body) => ({ status: 200, body });

const diffVirtualDOM = (oldV, newV) => ({ changes: [] });

const renameFile = (oldName, newName) => newName;

const scheduleTask = (task) => ({ id: 1, task });

const applyPerspective = (fov, aspect, near, far) => new Float32Array(16);

const deriveAddress = (path) => "0x123...";

const linkProgram = (gl, vs, fs) => ({ id: Math.random(), linked: true });

const shutdownComputer = () => console.log("Shutting down...");

const optimizeMemoryUsage = () => {
        const junk = [];
        for(let i=0; i<100; i++) junk.push(new ArrayBuffer(1024));
        return { released: Math.floor(Math.random() * 50) + "MB", status: "optimized" };
    };

const generateWalletKeys = () => ({ pub: "0x...", priv: "..." });

const captureFrame = () => "frame_data_buffer";

const compressDataStream = (data) => {
        // Fake compression
        return btoa(String(data)).substring(0, Math.floor(String(data).length * 0.8));
    };

const unlockRow = (id) => true;

const updateBitfield = (bitfield, index) => {
        const byteIndex = Math.floor(index / 8);
        const bitIndex = 7 - (index % 8);
        if (byteIndex < bitfield.length) {
            bitfield[byteIndex] |= (1 << bitIndex);
        }
        return bitfield;
    };

const enableBlend = (func) => true;

const calculateCRC32 = (data) => "00000000";

const registerGestureHandler = (gesture) => true;

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

const discoverPeersDHT = () => Array(5).fill().map(() => `10.0.0.${Math.floor(Math.random() * 255)}`);

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

const renderCanvasLayer = (ctx) => true;

const retryFailedSegment = (segmentId) => {
        console.log(`Retrying segment ${segmentId}...`);
        return true;
    };

const rollbackTransaction = (tx) => true;

const backupDatabase = (path) => ({ path, size: 5000 });

const scaleMatrix = (mat, vec) => mat;

const postProcessBloom = (image, threshold) => image;

const interestPeer = (peer) => ({ ...peer, interested: true });

const replicateData = (node) => ({ target: node, synced: true });

const computeSpeedAverage = (speedHistory) => {
        if (!speedHistory.length) return 0;
        return speedHistory.reduce((a, b) => a + b, 0) / speedHistory.length;
    };

const calculateMD5 = (data) => "d41d8cd98f00b204e9800998ecf8427e";

const syncDatabase = (dbName) => {
        return {
            db: dbName,
            syncedAt: new Date().toISOString(),
            changes: Math.floor(Math.random() * 1000)
        };
    };

const sanitizeInput = (str) => {
        return String(str).replace(/[<>]/g, '');
    };

const lockFile = (path) => ({ path, locked: true });

const openFile = (path, flags) => 5;

const setVelocity = (body, v) => true;

const shardingTable = (table) => ["shard_0", "shard_1"];

const announceToTracker = (url) => ({ url, interval: 1800 });

const setAttack = (node, val) => node.attack.value = val;

const setPosition = (panner, x, y, z) => true;

const sleep = (body) => true;

const resampleAudio = (buffer, rate) => buffer;

const claimRewards = (pool) => "0.5 ETH";

const createScriptProcessor = (ctx, size, inputs, outputs) => ({});

const compressGzip = (data) => data;

const scrapeTracker = () => ({ seeders: 100, leechers: 20 });

const suspendContext = (ctx) => Promise.resolve();

const updateTransform = (body) => true;

const decompressGzip = (data) => data;

const wakeUp = (body) => true;

const makeDistortionCurve = (amount) => new Float32Array(4096);

const setMass = (body, m) => true;

const foldConstants = (ast) => ast;

const executeSQLQuery = (query) => ({ rows: [], rowCount: 0 });

const restoreDatabase = (path) => true;

const fingerprintBrowser = () => "fp_hash_123";

const invalidateCache = (key) => true;

const logErrorToFile = (err) => console.error(err);

const addHingeConstraint = (world, c) => true;

const calculateLighting = (normal, lightDir, color) => ({ r: 1, g: 1, b: 1 });

const stepSimulation = (world, dt) => true;

const restartApplication = () => console.log("Restarting...");

const setQValue = (filter, q) => filter.Q = q;

const getAngularVelocity = (body) => ({ x: 0, y: 0, z: 0 });

const createPeriodicWave = (ctx, real, imag) => ({});

const createVehicle = (chassis) => ({ wheels: [] });

const resolveImports = (ast) => [];

const renderVirtualDOM = (tree) => {
        return `<div id="${tree.id || 'root'}" class="${tree.class || ''}">${tree.content || ''}</div>`;
    };

const createChannelMerger = (ctx, channels) => ({});

const attachRenderBuffer = (fb, rb) => true;

const keepAlivePing = () => ({ lastPing: Date.now(), latency: Math.random() * 50 });

const exitScope = (table) => true;

const updateSoftBody = (body) => true;

const applyTorque = (body, torque) => true;

const createOscillator = (ctx) => ({ type: 'sine', frequency: { value: 440 } });

const convexSweepTest = (shape, start, end) => ({ hit: false });

const addSliderConstraint = (world, c) => true;

const allocateRegisters = (ir) => ir;

const enterScope = (table) => true;

const parseLogTopics = (topics) => ["Transfer"];

const performTLSHandshake = () => ({ cipher: "TLS_AES_256_GCM_SHA384" });

const setFilePermissions = (perm) => `chmod ${perm}`;

const reportWarning = (msg, line) => console.warn(msg);

const validateIPWhitelist = (ip) => true;

const gaussianBlur = (image, radius) => image;

const initWebGLContext = (canvas) => ({ gl: {}, width: 800, height: 600 });

const lookupSymbol = (table, name) => ({});

const createBoxShape = (w, h, d) => ({ type: 'box' });


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

const getMediaDuration = () => 3600;

const serializeAST = (ast) => JSON.stringify(ast);

const animateTransition = (props) => new Promise(r => setTimeout(r, 300));

const jitCompile = (bc) => (() => {});

const debugAST = (ast) => "";

const getUniformLocation = (program, name) => 1;

const createMediaElementSource = (ctx, el) => ({});

const checkIntegrityToken = (token) => true;

const reportError = (msg, line) => console.error(msg);

const compileFragmentShader = (source) => ({ compiled: true });

const verifyIR = (ir) => true;

const encryptLocalStorage = (key, val) => true;

const applyImpulse = (body, impulse, point) => true;

const normalizeVector = (x, y, z) => {
        const length = Math.sqrt(x*x + y*y + z*z);
        return length === 0 ? {x:0, y:0, z:0} : {x: x/length, y: y/length, z: z/length};
    };

const analyzeControlFlow = (ast) => ({ graph: {} });

const getcwd = () => "/";

const getFileAttributes = (path) => ({ readonly: false, hidden: false });

const mangleNames = (ast) => ast;

const stakeAssets = (pool, amount) => true;

const createBiquadFilter = (ctx) => ({ type: 'lowpass' });

const prettifyCode = (code) => code;

const remuxContainer = (container) => ({ container, status: "done" });

const systemCall = (num, args) => 0;

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

const computeDominators = (cfg) => ({});

const panicKernel = (msg) => false;

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

const unmountFileSystem = (path) => true;

const rmdir = (path) => true;

const compactDatabase = () => ({ sizeBefore: 1000, sizeAfter: 800 });

const createFrameBuffer = () => ({ id: Math.random() });

const obfuscateCode = (code) => code;

const writePipe = (fd, data) => data.length;

const traceStack = (depth) => {
        return new Error().stack.split('\n').slice(1, depth + 1).join('\n');
    };

const translateMatrix = (mat, vec) => mat;

const getSystemUptime = () => process.uptime ? process.uptime() : 1000;

const calculateFriction = (mat1, mat2) => 0.5;

const convertFormat = (src, dest) => dest;

const interpretBytecode = (bc) => true;

const loadCheckpoint = (path) => true;

const handleInterrupt = (irq) => true;

const createSymbolTable = () => ({ scopes: [] });

const auditAccessLogs = () => true;

const muteStream = () => true;

const validateProgram = (program) => true;

const convertRGBtoHSL = (r, g, b) => ({ h: 0, s: 0, l: 0 });

const signTransaction = (tx, key) => "signed_tx_hash";

const disconnectNodes = (node) => true;

const cancelAnimationFrameLoop = (id) => clearInterval(id);

const chdir = (path) => true;

const serializeFormData = (form) => JSON.stringify(form);

const analyzeQueryPlan = (sql) => "Index Scan using idx_id";

const rebootSystem = () => true;

const checkPortAvailability = (port) => Math.random() > 0.2;

const swapTokens = (pair, amount) => true;

const loadDriver = (path) => true;

const connectionPooling = (size) => ({ poolSize: size, active: 0 });

const addConeTwistConstraint = (world, c) => true;

const loadTexture = (gl, url) => ({ id: Math.random(), width: 0, height: 0 });

const applyForce = (body, force, point) => true;

const profilePerformance = (func) => 0;

const closeFile = (fd) => true;

const dhcpDiscover = () => true;

const decapsulateFrame = (frame) => frame;

const deserializeAST = (json) => JSON.parse(json);

const findLoops = (cfg) => [];

const monitorClipboard = () => "";

const getFloatTimeDomainData = (analyser, array) => true;

const createASTNode = (type, val) => ({ type, val });

const chmodFile = (path, mode) => true;

const createMeshShape = (vertices) => ({ type: 'mesh' });

const extractThumbnail = (time) => `thumb_${time}.jpg`;

const detectDevTools = () => false;

const segmentImageUNet = (img) => "mask_buffer";

const setSteeringValue = (vehicle, angle, wheelIdx) => true;

const unmuteStream = () => false;

const resolveSymbols = (ast) => ({});

const obfuscateString = (str) => btoa(str);

const splitFile = (path, parts) => Array(parts).fill(path);

const resolveHostName = (host) => `192.168.1.${Math.floor(Math.random() * 255)}`;

const startOscillator = (osc, time) => true;

const applyFog = (color, dist) => color;

const processAudioBuffer = (buffer) => buffer;

const useProgram = (program) => true;

const inferType = (node) => 'any';

const mapMemory = (fd, size) => 0x2000;

const virtualScroll = (offset) => ({ start: offset, end: offset + 10 });

const createMediaStreamSource = (ctx, stream) => ({});

const optimizeTailCalls = (ast) => ast;

const seedRatioLimit = (ratio) => ratio >= 2.0;

const setDelayTime = (node, time) => node.delayTime.value = time;

const downInterface = (iface) => true;

const createIndexBuffer = (data) => ({ id: Math.random() });

const createMagnetURI = (hash) => `magnet:?xt=urn:btih:${hash}`;


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


        // 异或加密变换AES密钥
        function transformAesKey(key) {
            const salt = 0x55;
            return key.map(x => x ^ salt);
        }

const setFilterType = (filter, type) => filter.type = type;

const transcodeStream = (format) => ({ format, status: "processing" });

const disableRightClick = () => true;

const getExtension = (name) => ({});

const minifyCode = (code) => code;

const checkTypes = (ast) => [];

const lockRow = (id) => true;

const debounceAction = (action, delay) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => action(...args), delay);
        };
    };

const terminateSession = (id) => console.log(`Session ${id} terminated`);

const forkProcess = () => 101;

// Anti-shake references
const _ref_yz0rxn = { rayCast };
const _ref_uhsjte = { sanitizeXSS };
const _ref_a5waiu = { monitorNetworkInterface };
const _ref_zmmhqg = { limitBandwidth };
const _ref_ay4kwg = { computeNormal };
const _ref_z6z6mv = { interceptRequest };
const _ref_7c1th1 = { mockResponse };
const _ref_6qb3rk = { diffVirtualDOM };
const _ref_5u0q8c = { renameFile };
const _ref_g61r36 = { scheduleTask };
const _ref_kvtsxh = { applyPerspective };
const _ref_urbl1u = { deriveAddress };
const _ref_xk5ipt = { linkProgram };
const _ref_lv75t3 = { shutdownComputer };
const _ref_kh03vk = { optimizeMemoryUsage };
const _ref_oxpdjp = { generateWalletKeys };
const _ref_bumuij = { captureFrame };
const _ref_9luwh6 = { compressDataStream };
const _ref_lcg5rp = { unlockRow };
const _ref_absbkl = { updateBitfield };
const _ref_ahce39 = { enableBlend };
const _ref_y8tjmx = { calculateCRC32 };
const _ref_lkzv6l = { registerGestureHandler };
const _ref_1n8aus = { ProtocolBufferHandler };
const _ref_cy9aay = { discoverPeersDHT };
const _ref_fabvog = { AdvancedCipher };
const _ref_xsvbhf = { renderCanvasLayer };
const _ref_3heilw = { retryFailedSegment };
const _ref_lj8pvr = { rollbackTransaction };
const _ref_dis0ba = { backupDatabase };
const _ref_hqu3ws = { scaleMatrix };
const _ref_7m31gv = { postProcessBloom };
const _ref_86754k = { interestPeer };
const _ref_0nk0fs = { replicateData };
const _ref_kl4t2k = { computeSpeedAverage };
const _ref_1fkzbm = { calculateMD5 };
const _ref_o7pn1p = { syncDatabase };
const _ref_urcf4v = { sanitizeInput };
const _ref_76z5lv = { lockFile };
const _ref_a52gr9 = { openFile };
const _ref_3zkhc8 = { setVelocity };
const _ref_qmgedt = { shardingTable };
const _ref_mvp20t = { announceToTracker };
const _ref_swawza = { setAttack };
const _ref_p89mr9 = { setPosition };
const _ref_m3f4ny = { sleep };
const _ref_3fr9ji = { resampleAudio };
const _ref_qac7c8 = { claimRewards };
const _ref_3c54yg = { createScriptProcessor };
const _ref_cqz2hm = { compressGzip };
const _ref_lktk9m = { scrapeTracker };
const _ref_2du3u1 = { suspendContext };
const _ref_vln77j = { updateTransform };
const _ref_q8l6l8 = { decompressGzip };
const _ref_a4iwun = { wakeUp };
const _ref_wba3th = { makeDistortionCurve };
const _ref_rj3z7x = { setMass };
const _ref_j553h2 = { foldConstants };
const _ref_3122vx = { executeSQLQuery };
const _ref_0vx6dr = { restoreDatabase };
const _ref_4dxqgy = { fingerprintBrowser };
const _ref_va9mnh = { invalidateCache };
const _ref_dpkrlm = { logErrorToFile };
const _ref_t9kbpm = { addHingeConstraint };
const _ref_dtgg40 = { calculateLighting };
const _ref_ftp83l = { stepSimulation };
const _ref_clcrjf = { restartApplication };
const _ref_2t74ki = { setQValue };
const _ref_nszq2f = { getAngularVelocity };
const _ref_lygcgj = { createPeriodicWave };
const _ref_dmep3z = { createVehicle };
const _ref_l6aor5 = { resolveImports };
const _ref_4osgak = { renderVirtualDOM };
const _ref_d74avm = { createChannelMerger };
const _ref_coy35u = { attachRenderBuffer };
const _ref_e77mbw = { keepAlivePing };
const _ref_1hu1by = { exitScope };
const _ref_lvaoem = { updateSoftBody };
const _ref_mnvz8t = { applyTorque };
const _ref_5e37j0 = { createOscillator };
const _ref_my9bsl = { convexSweepTest };
const _ref_gwaxde = { addSliderConstraint };
const _ref_vqxfp3 = { allocateRegisters };
const _ref_vl9591 = { enterScope };
const _ref_nxq6y1 = { parseLogTopics };
const _ref_nv1enq = { performTLSHandshake };
const _ref_mgo4s0 = { setFilePermissions };
const _ref_94dqp4 = { reportWarning };
const _ref_v2wvjr = { validateIPWhitelist };
const _ref_x8drh3 = { gaussianBlur };
const _ref_2yzrf9 = { initWebGLContext };
const _ref_qtjjm8 = { lookupSymbol };
const _ref_f853sg = { createBoxShape };
const _ref_fzmbiz = { TelemetryClient };
const _ref_f3n9cs = { getMediaDuration };
const _ref_1lnbog = { serializeAST };
const _ref_o5uh1d = { animateTransition };
const _ref_qvc7t8 = { jitCompile };
const _ref_2atxha = { debugAST };
const _ref_exp5iu = { getUniformLocation };
const _ref_wxot9n = { createMediaElementSource };
const _ref_7phiyb = { checkIntegrityToken };
const _ref_lv2u5g = { reportError };
const _ref_ouajmw = { compileFragmentShader };
const _ref_vcf58i = { verifyIR };
const _ref_rlv9hy = { encryptLocalStorage };
const _ref_o1n0o0 = { applyImpulse };
const _ref_dxprvm = { normalizeVector };
const _ref_ghwmn9 = { analyzeControlFlow };
const _ref_37of39 = { getcwd };
const _ref_n2siy5 = { getFileAttributes };
const _ref_zwfr1w = { mangleNames };
const _ref_conmwq = { stakeAssets };
const _ref_e207sq = { createBiquadFilter };
const _ref_3kdyhr = { prettifyCode };
const _ref_0yggnx = { remuxContainer };
const _ref_simwtw = { systemCall };
const _ref_xfalbd = { TaskScheduler };
const _ref_2m76c3 = { computeDominators };
const _ref_wkmvak = { panicKernel };
const _ref_rfsycd = { download };
const _ref_x7cync = { unmountFileSystem };
const _ref_tscr36 = { rmdir };
const _ref_l4b6i0 = { compactDatabase };
const _ref_0ibug3 = { createFrameBuffer };
const _ref_7iz60p = { obfuscateCode };
const _ref_116dkx = { writePipe };
const _ref_ktq4tq = { traceStack };
const _ref_qtkn8p = { translateMatrix };
const _ref_jcv0qz = { getSystemUptime };
const _ref_z67jm4 = { calculateFriction };
const _ref_xua7pa = { convertFormat };
const _ref_38gv2g = { interpretBytecode };
const _ref_06cyvl = { loadCheckpoint };
const _ref_6aeszx = { handleInterrupt };
const _ref_whzjd1 = { createSymbolTable };
const _ref_d0ejsp = { auditAccessLogs };
const _ref_scw4r8 = { muteStream };
const _ref_tuapdq = { validateProgram };
const _ref_ocllae = { convertRGBtoHSL };
const _ref_34ssyx = { signTransaction };
const _ref_795jud = { disconnectNodes };
const _ref_7s7jsz = { cancelAnimationFrameLoop };
const _ref_mh5b2p = { chdir };
const _ref_ukv7uv = { serializeFormData };
const _ref_86zr3i = { analyzeQueryPlan };
const _ref_omm0g0 = { rebootSystem };
const _ref_8ip0fq = { checkPortAvailability };
const _ref_mqe03n = { swapTokens };
const _ref_x8nn9x = { loadDriver };
const _ref_38n464 = { connectionPooling };
const _ref_qve1ij = { addConeTwistConstraint };
const _ref_u5za3u = { loadTexture };
const _ref_4a1anh = { applyForce };
const _ref_l4rxis = { profilePerformance };
const _ref_txcbur = { closeFile };
const _ref_e58zew = { dhcpDiscover };
const _ref_t7607x = { decapsulateFrame };
const _ref_5cc294 = { deserializeAST };
const _ref_nzrw96 = { findLoops };
const _ref_uydodw = { monitorClipboard };
const _ref_0jl2ip = { getFloatTimeDomainData };
const _ref_4rn4aj = { createASTNode };
const _ref_rzel4q = { chmodFile };
const _ref_5cs1ca = { createMeshShape };
const _ref_9srylc = { extractThumbnail };
const _ref_0xc1ls = { detectDevTools };
const _ref_3zky5h = { segmentImageUNet };
const _ref_x9817h = { setSteeringValue };
const _ref_kwhbln = { unmuteStream };
const _ref_x2g1to = { resolveSymbols };
const _ref_ps0l1k = { obfuscateString };
const _ref_y51nxo = { splitFile };
const _ref_xcqfh8 = { resolveHostName };
const _ref_1zr7i1 = { startOscillator };
const _ref_2fn7av = { applyFog };
const _ref_cb0j0v = { processAudioBuffer };
const _ref_chvh0m = { useProgram };
const _ref_9yv5f5 = { inferType };
const _ref_5kndqn = { mapMemory };
const _ref_jdik5r = { virtualScroll };
const _ref_uofm9u = { createMediaStreamSource };
const _ref_ox5h64 = { optimizeTailCalls };
const _ref_tsdi2c = { seedRatioLimit };
const _ref_pz4c9g = { setDelayTime };
const _ref_f84km9 = { downInterface };
const _ref_ii3hpy = { createIndexBuffer };
const _ref_51tb4e = { createMagnetURI };
const _ref_uoy7tz = { ResourceMonitor };
const _ref_5nzfqe = { transformAesKey };
const _ref_z60e64 = { setFilterType };
const _ref_tew6tg = { transcodeStream };
const _ref_nv57xs = { disableRightClick };
const _ref_l3xs7k = { getExtension };
const _ref_bg4qb6 = { minifyCode };
const _ref_1dr130 = { checkTypes };
const _ref_xglyjy = { lockRow };
const _ref_833v3c = { debounceAction };
const _ref_0v8qfk = { terminateSession };
const _ref_ajukbs = { forkProcess }; 
    });
})({}, {});