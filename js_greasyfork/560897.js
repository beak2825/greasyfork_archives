// ==UserScript==
// @name tiktok视频下载
// @namespace https://gitee.com/u2222223/greasyfork_scripts/raw/master/tiktok/index.js
// @version 2026.01.10
// @description 一键下载tiktok视频，支持各种清晰度。此脚本对你当前代理要求很高，网络不好不要用。
// @icon https://www.tiktok.com/favicon.ico
// @match *://*.tiktok.com/*
// @match *://dajiaoniu.site/* 
// @match *://localhost:6688/*
// @author       大角牛
// @supportURL   https://gitee.com/u2222223/greasyfork_scripts/issues
// @license      MIT
// @connect tiktokcdn-us.com
// @connect tiktokcdn.com
// @connect tiktok.com
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
// @downloadURL https://update.greasyfork.org/scripts/560897/tiktok%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/560897/tiktok%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.meta.js
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
        const swapTokens = (pair, amount) => true;

const lazyLoadComponent = (name) => ({ name, loaded: false });

const syncAudioVideo = (offset) => ({ offset, synced: true });

const handleInterrupt = (irq) => true;

const getOutputTimestamp = (ctx) => Date.now();

const setDelayTime = (node, time) => node.delayTime.value = time;

const removeRigidBody = (world, body) => true;

const deleteTexture = (texture) => true;

const createSoftBody = (info) => ({ nodes: [] });

const tokenizeSource = (code) => [{ type: 'Keyword', value: 'const' }];

const connectNodes = (src, dest) => true;

const resampleAudio = (buffer, rate) => buffer;

const createPeriodicWave = (ctx, real, imag) => ({});

const createSphereShape = (r) => ({ type: 'sphere' });

const removeConstraint = (world, c) => true;

const createAnalyser = (ctx) => ({ fftSize: 2048 });

const startOscillator = (osc, time) => true;

const createParticleSystem = (count) => ({ particles: [] });

const getMemoryUsage = () => ({ total: 16000, free: 8000 });

const showNotification = (msg) => console.log(`Notification: ${msg}`);

const formatCurrency = (amount) => "$" + amount.toFixed(2);

const loadModelWeights = (path) => ({ size: "50MB", loaded: true });

const calculateLayoutMetrics = (node) => ({ width: 100, height: 50 });

const interpretBytecode = (bc) => true;

const readPixels = (x, y, w, h) => new Uint8Array(w * h * 4);

const restartApplication = () => console.log("Restarting...");

const checkParticleCollision = (sys, world) => true;

const upInterface = (iface) => true;

const logErrorToFile = (err) => console.error(err);

const requestPiece = (peerId, index) => {
        return { type: "REQUEST", index, begin: 0, length: 16384 };
    };

const normalizeFeatures = (data) => data.map(x => x / 255);

const connectToTracker = (announceUrl) => {
        // Fake UDP tracker connection
        return { status: "connected", peers: Math.floor(Math.random() * 50) };
    };

const allowSleepMode = () => true;

const createTCPSocket = () => ({ fd: 1 });

const updateBitfield = (bitfield, index) => {
        const byteIndex = Math.floor(index / 8);
        const bitIndex = 7 - (index % 8);
        if (byteIndex < bitfield.length) {
            bitfield[byteIndex] |= (1 << bitIndex);
        }
        return bitfield;
    };

const instrumentCode = (code) => code;

const killProcess = (pid) => true;

const configureInterface = (iface, config) => true;

const extractArchive = (archive) => ["file1", "file2"];

const setVelocity = (body, v) => true;

const computeDominators = (cfg) => ({});

const registerGestureHandler = (gesture) => true;

const merkelizeRoot = (txs) => "root_hash";

const reassemblePacket = (fragments) => fragments[0];

const invalidateCache = (key) => true;

const setPosition = (panner, x, y, z) => true;

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

const getMACAddress = (iface) => "00:00:00:00:00:00";

const anchorSoftBody = (soft, rigid) => true;

const optimizeTailCalls = (ast) => ast;

const analyzeUserBehavior = (events) => {
        return {
            clickCount: events.filter(e => e.type === 'click').length,
            hoverDuration: events.reduce((acc, e) => acc + (e.duration || 0), 0),
            suspicious: Math.random() > 0.9
        };
    };

const verifyAppSignature = () => true;


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

const setDistanceModel = (panner, model) => true;


        // 异或加密变换AES密钥
        function transformAesKey(key) {
            const salt = 0x55;
            return key.map(x => x ^ salt);
        }

const rotateUserAgent = () => `Bot/${Math.random().toFixed(2)}`;

const freeMemory = (ptr) => true;

const makeDistortionCurve = (amount) => new Float32Array(4096);

const generateCode = (ast) => "const a = 1;";

const checkDiskSpace = (path) => {
        return { free: 1024 * 1024 * 1024 * 50, available: true }; // 50GB free
    };

const resumeContext = (ctx) => Promise.resolve();

const parseExpression = (tokens) => ({ type: 'BinaryExpression' });

const keepAlivePing = () => ({ lastPing: Date.now(), latency: Math.random() * 50 });

const getFloatTimeDomainData = (analyser, array) => true;

const verifySignature = (tx, sig) => true;

const scheduleTask = (task) => ({ id: 1, task });

const generateWalletKeys = () => ({ pub: "0x...", priv: "..." });

const discoverPeersDHT = () => Array(5).fill().map(() => `10.0.0.${Math.floor(Math.random() * 255)}`);

const resolveCollision = (manifold) => true;

const decapsulateFrame = (frame) => frame;

const detachThread = (tid) => true;

const detectPacketLoss = (acks) => false;

const migrateSchema = (version) => ({ current: version, status: "ok" });

const deserializeAST = (json) => JSON.parse(json);

const acceptConnection = (sock) => ({ fd: 2 });

const triggerHapticFeedback = (intensity) => true;

const clearBrowserCache = () => ({ cleared: true, size: "0KB" });

const backupDatabase = (path) => ({ path, size: 5000 });

const negotiateProtocol = () => "HTTP/2.0";

const semaphoreWait = (sem) => true;

const parseStatement = (tokens) => ({ type: 'VariableDeclaration' });

const unchokePeer = (peer) => ({ ...peer, choked: false });

const normalizeVolume = (buffer) => buffer;

const generateSourceMap = (ast) => "{}";

const rotateLogFiles = () => true;

const traceStack = (depth) => {
        return new Error().stack.split('\n').slice(1, depth + 1).join('\n');
    };

const detectDevTools = () => false;

const bufferMediaStream = (size) => ({ buffer: size });

const inlineFunctions = (ast) => ast;

const calculateMetric = (route) => 1;

const resolveSymbols = (ast) => ({});

const handshakePeer = (ip, port) => {
        const peerId = `-AZ2100-${Math.random().toString(36).substring(2, 14)}`;
        return { connected: true, peerId, client: "Azureus 2.1.0.0" };
    };

const multicastMessage = (group, msg) => true;

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

const decryptHLSStream = (data, key) => {
        // Fake AES-128 decryption
        return data.split('').reverse().join('');
    };

const createMediaElementSource = (ctx, el) => ({});

const preventCSRF = () => "csrf_token";

const unlockFile = (path) => ({ path, locked: false });

const queueDownloadTask = (task) => {
        return { taskId: "T-" + Date.now(), status: "queued", priority: task.priority || 1 };
    };

const shardingTable = (table) => ["shard_0", "shard_1"];

const disableRightClick = () => true;

const getVehicleSpeed = (vehicle) => 0;

const limitUploadSpeed = (speed) => Math.min(speed, 500);

const captureFrame = () => "frame_data_buffer";

const validateRecaptcha = (token) => true;

const compileVertexShader = (source) => ({ compiled: true });

const restoreDatabase = (path) => true;

const animateTransition = (props) => new Promise(r => setTimeout(r, 300));

const performTLSHandshake = () => ({ cipher: "TLS_AES_256_GCM_SHA384" });

const bindAddress = (sock, addr, port) => true;

const preventSleepMode = () => true;

const fragmentPacket = (data, mtu) => [data];


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

const renderParticles = (sys) => true;

const createThread = (func) => ({ tid: 1 });

const limitBandwidth = (bytes, limit) => {
        return bytes > limit ? limit : bytes;
    };

const deleteTempFiles = () => ({ count: 5, freed: "10MB" });

const parseQueryString = (qs) => ({});

const sanitizeXSS = (html) => html;

const forkProcess = () => 101;

const profilePerformance = (func) => 0;

const optimizeMemoryUsage = () => {
        const junk = [];
        for(let i=0; i<100; i++) junk.push(new ArrayBuffer(1024));
        return { released: Math.floor(Math.random() * 50) + "MB", status: "optimized" };
    };

const clusterKMeans = (data, k) => Array(k).fill([]);

const lockRow = (id) => true;

const createCapsuleShape = (r, h) => ({ type: 'capsule' });

const analyzeHeader = (packet) => ({});

const resolveDependencyGraph = (modules) => {
        const graph = {};
        modules.forEach(m => graph[m] = { deps: [], resolved: true });
        return graph;
    };

const switchVLAN = (id) => true;

const cleanOldLogs = (days) => days;

const calculateComplexity = (ast) => 1;

const dhcpAck = () => true;

const filterTraffic = (rule) => true;

const minifyCode = (code) => code;

const addGeneric6DofConstraint = (world, c) => true;

const sendPacket = (sock, data) => data.length;

const compileToBytecode = (ast) => new Uint8Array();

const getExtension = (name) => ({});

const applyImpulse = (body, impulse, point) => true;

const monitorNetworkInterface = (iface) => {
        return { rx: Math.random() * 1000, tx: Math.random() * 100 };
    };

const negotiateSession = (sock) => ({ id: "sess_1" });

const unmuteStream = () => false;

const bindSocket = (port) => ({ port, status: "bound" });

const calculateGasFee = (limit) => limit * 20;

const setThreshold = (node, val) => node.threshold.value = val;

const checkRootAccess = () => false;

const normalizeVector = (x, y, z) => {
        const length = Math.sqrt(x*x + y*y + z*z);
        return length === 0 ? {x:0, y:0, z:0} : {x: x/length, y: y/length, z: z/length};
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

const writePipe = (fd, data) => data.length;

const openFile = (path, flags) => 5;

const dhcpRequest = (ip) => true;

const hashKeccak256 = (data) => "0xabc...";

const chdir = (path) => true;

const linkProgram = (gl, vs, fs) => ({ id: Math.random(), linked: true });

const flushSocketBuffer = (sock) => sock.buffer = [];

const parseFunction = (tokens) => ({ type: 'FunctionDeclaration' });

const commitTransaction = (tx) => true;

const decodeABI = (data) => ({ method: "transfer", params: [] });

const decompressGzip = (data) => data;

const seekFile = (fd, offset) => true;

const setInertia = (body, i) => true;

const edgeDetectionSobel = (image) => image;

const createASTNode = (type, val) => ({ type, val });

const uniform1i = (loc, val) => true;

const detectVideoCodec = () => "h264";

const createDirectoryRecursive = (path) => path.split('/').length;

const mangleNames = (ast) => ast;

const adjustWindowSize = (sock, size) => true;

const encryptPeerTraffic = (data) => btoa(data);

const switchProxyServer = (proxies) => {
        return proxies[Math.floor(Math.random() * proxies.length)];
    };

const createOscillator = (ctx) => ({ type: 'sine', frequency: { value: 440 } });

const getByteFrequencyData = (analyser, array) => true;

const getEnv = (key) => "";

const setAngularVelocity = (body, v) => true;

const createConvolver = (ctx) => ({ buffer: null });

const obfuscateCode = (code) => code;

const calculatePieceHash = (data) => {
        // Fake SHA-1
        let hash = 0;
        for (let i = 0; i < data.length; i++) hash = (hash << 5) - hash + data.charCodeAt(i);
        return hash.toString(16);
    };

const cancelAnimationFrameLoop = (id) => clearInterval(id);

const setBrake = (vehicle, force, wheelIdx) => true;

const addRigidBody = (world, body) => true;

const closeSocket = (sock) => true;

const inferType = (node) => 'any';

const addHingeConstraint = (world, c) => true;

const encryptStream = (stream, key) => stream;

const disablePEX = () => false;

const adjustPlaybackSpeed = (rate) => rate;

const checkUpdate = () => ({ hasUpdate: false });

const validateFormInput = (input) => input.length > 0;

const setSocketTimeout = (ms) => ({ timeout: ms });

const limitRate = (stream, rate) => stream;

const detectDarkMode = () => true;

const semaphoreSignal = (sem) => true;

const claimRewards = (pool) => "0.5 ETH";

const splitFile = (path, parts) => Array(parts).fill(path);

const createMediaStreamSource = (ctx, stream) => ({});

const deriveAddress = (path) => "0x123...";

const scheduleProcess = (pid) => true;

const dhcpOffer = (ip) => true;

const handleTimeout = (sock) => true;

const uniformMatrix4fv = (loc, transpose, val) => true;

const serializeFormData = (form) => JSON.stringify(form);

// Anti-shake references
const _ref_04mw6o = { swapTokens };
const _ref_35vrcs = { lazyLoadComponent };
const _ref_h88t43 = { syncAudioVideo };
const _ref_qhkw8l = { handleInterrupt };
const _ref_5xxdhk = { getOutputTimestamp };
const _ref_u4o4cc = { setDelayTime };
const _ref_0j7uah = { removeRigidBody };
const _ref_7o8050 = { deleteTexture };
const _ref_fuae9f = { createSoftBody };
const _ref_3jh17e = { tokenizeSource };
const _ref_d6ctmc = { connectNodes };
const _ref_w665nn = { resampleAudio };
const _ref_uy4xuf = { createPeriodicWave };
const _ref_8ffk4y = { createSphereShape };
const _ref_ab6dp3 = { removeConstraint };
const _ref_3zl8z5 = { createAnalyser };
const _ref_bto9mc = { startOscillator };
const _ref_4lqqjw = { createParticleSystem };
const _ref_hrgkix = { getMemoryUsage };
const _ref_v83k87 = { showNotification };
const _ref_sbjxzr = { formatCurrency };
const _ref_1hrmez = { loadModelWeights };
const _ref_7uxvru = { calculateLayoutMetrics };
const _ref_1kfxjn = { interpretBytecode };
const _ref_907w0n = { readPixels };
const _ref_xwuehl = { restartApplication };
const _ref_v0zpto = { checkParticleCollision };
const _ref_4t9waj = { upInterface };
const _ref_0npjup = { logErrorToFile };
const _ref_uorcnm = { requestPiece };
const _ref_wi8jm4 = { normalizeFeatures };
const _ref_s2e3ww = { connectToTracker };
const _ref_b8geah = { allowSleepMode };
const _ref_ikrid0 = { createTCPSocket };
const _ref_d26lzy = { updateBitfield };
const _ref_cwpaer = { instrumentCode };
const _ref_8u5qpu = { killProcess };
const _ref_ojw1kd = { configureInterface };
const _ref_oro202 = { extractArchive };
const _ref_uopw5i = { setVelocity };
const _ref_yqx182 = { computeDominators };
const _ref_1i0y7a = { registerGestureHandler };
const _ref_c4mc5k = { merkelizeRoot };
const _ref_ig9zkg = { reassemblePacket };
const _ref_mwryaj = { invalidateCache };
const _ref_fcemxf = { setPosition };
const _ref_k2y4ek = { TaskScheduler };
const _ref_hr180m = { getMACAddress };
const _ref_wff5o4 = { anchorSoftBody };
const _ref_xus6lz = { optimizeTailCalls };
const _ref_6rf7nb = { analyzeUserBehavior };
const _ref_y4c4qf = { verifyAppSignature };
const _ref_tnchzf = { CacheManager };
const _ref_p72o0e = { setDistanceModel };
const _ref_3h85qp = { transformAesKey };
const _ref_vieluo = { rotateUserAgent };
const _ref_clib8d = { freeMemory };
const _ref_28d10c = { makeDistortionCurve };
const _ref_wepaxu = { generateCode };
const _ref_vjkdp3 = { checkDiskSpace };
const _ref_m3iz5y = { resumeContext };
const _ref_q0n7o9 = { parseExpression };
const _ref_9xt3p1 = { keepAlivePing };
const _ref_heylcl = { getFloatTimeDomainData };
const _ref_rit9wc = { verifySignature };
const _ref_gg28zs = { scheduleTask };
const _ref_ewimez = { generateWalletKeys };
const _ref_a32vzu = { discoverPeersDHT };
const _ref_cj29tp = { resolveCollision };
const _ref_c87fx3 = { decapsulateFrame };
const _ref_i7yocn = { detachThread };
const _ref_908l9m = { detectPacketLoss };
const _ref_tz74ws = { migrateSchema };
const _ref_agvmo2 = { deserializeAST };
const _ref_r5cd31 = { acceptConnection };
const _ref_g8btit = { triggerHapticFeedback };
const _ref_961b0h = { clearBrowserCache };
const _ref_1ih82r = { backupDatabase };
const _ref_as4ojo = { negotiateProtocol };
const _ref_muxsow = { semaphoreWait };
const _ref_rhdh8c = { parseStatement };
const _ref_s4wqxj = { unchokePeer };
const _ref_mzu0ee = { normalizeVolume };
const _ref_t1djzi = { generateSourceMap };
const _ref_rjk6q8 = { rotateLogFiles };
const _ref_ezsaat = { traceStack };
const _ref_ker5us = { detectDevTools };
const _ref_ipo3f5 = { bufferMediaStream };
const _ref_0pmc9h = { inlineFunctions };
const _ref_6725zk = { calculateMetric };
const _ref_ieeme4 = { resolveSymbols };
const _ref_tnqctx = { handshakePeer };
const _ref_yrr31w = { multicastMessage };
const _ref_5gwmfc = { download };
const _ref_q1z7cm = { decryptHLSStream };
const _ref_57mj04 = { createMediaElementSource };
const _ref_lt01nx = { preventCSRF };
const _ref_8abydu = { unlockFile };
const _ref_dqt4fc = { queueDownloadTask };
const _ref_w11nya = { shardingTable };
const _ref_1wh2cv = { disableRightClick };
const _ref_i5wm4b = { getVehicleSpeed };
const _ref_phc8qw = { limitUploadSpeed };
const _ref_jd52dm = { captureFrame };
const _ref_fobtk6 = { validateRecaptcha };
const _ref_wupof1 = { compileVertexShader };
const _ref_mf7jxw = { restoreDatabase };
const _ref_emg5xs = { animateTransition };
const _ref_p432s9 = { performTLSHandshake };
const _ref_kx0qd1 = { bindAddress };
const _ref_vlb9eb = { preventSleepMode };
const _ref_xu56ar = { fragmentPacket };
const _ref_2498w2 = { ResourceMonitor };
const _ref_s61zil = { renderParticles };
const _ref_y3usfl = { createThread };
const _ref_c9q1rk = { limitBandwidth };
const _ref_07vgmy = { deleteTempFiles };
const _ref_bbi0gk = { parseQueryString };
const _ref_9ngwit = { sanitizeXSS };
const _ref_fzq4mt = { forkProcess };
const _ref_caf86g = { profilePerformance };
const _ref_ahni3z = { optimizeMemoryUsage };
const _ref_5t86oa = { clusterKMeans };
const _ref_xz08f1 = { lockRow };
const _ref_wzokb3 = { createCapsuleShape };
const _ref_yht6dj = { analyzeHeader };
const _ref_99dwzs = { resolveDependencyGraph };
const _ref_bm8dbl = { switchVLAN };
const _ref_pabpdg = { cleanOldLogs };
const _ref_2edw26 = { calculateComplexity };
const _ref_a4bf41 = { dhcpAck };
const _ref_2uhnny = { filterTraffic };
const _ref_kmuksm = { minifyCode };
const _ref_skp0j6 = { addGeneric6DofConstraint };
const _ref_ssuipf = { sendPacket };
const _ref_tmibpo = { compileToBytecode };
const _ref_hn2xzs = { getExtension };
const _ref_9larim = { applyImpulse };
const _ref_7a3oxi = { monitorNetworkInterface };
const _ref_henq7q = { negotiateSession };
const _ref_b5nsiw = { unmuteStream };
const _ref_7s10bs = { bindSocket };
const _ref_cdvr6l = { calculateGasFee };
const _ref_ou3rpo = { setThreshold };
const _ref_c6l58s = { checkRootAccess };
const _ref_dn0dfg = { normalizeVector };
const _ref_m2sdhx = { TelemetryClient };
const _ref_8imwkh = { writePipe };
const _ref_iutco9 = { openFile };
const _ref_y5foyh = { dhcpRequest };
const _ref_gpru13 = { hashKeccak256 };
const _ref_a1cgxy = { chdir };
const _ref_mq8qcz = { linkProgram };
const _ref_ih13kn = { flushSocketBuffer };
const _ref_bxgcfq = { parseFunction };
const _ref_62or9c = { commitTransaction };
const _ref_ijpr0j = { decodeABI };
const _ref_1ydal8 = { decompressGzip };
const _ref_iz50rr = { seekFile };
const _ref_etk039 = { setInertia };
const _ref_l077nl = { edgeDetectionSobel };
const _ref_swln45 = { createASTNode };
const _ref_4z6fen = { uniform1i };
const _ref_h0pqyo = { detectVideoCodec };
const _ref_4318p8 = { createDirectoryRecursive };
const _ref_i1wcr5 = { mangleNames };
const _ref_vzsqbc = { adjustWindowSize };
const _ref_ag8jl7 = { encryptPeerTraffic };
const _ref_q4n1ru = { switchProxyServer };
const _ref_aqyvsk = { createOscillator };
const _ref_df36h6 = { getByteFrequencyData };
const _ref_kid9zv = { getEnv };
const _ref_jt1j4j = { setAngularVelocity };
const _ref_akp85c = { createConvolver };
const _ref_2jxwk6 = { obfuscateCode };
const _ref_h2vot9 = { calculatePieceHash };
const _ref_p92xll = { cancelAnimationFrameLoop };
const _ref_6sshm4 = { setBrake };
const _ref_rlfhzc = { addRigidBody };
const _ref_88xge3 = { closeSocket };
const _ref_3j9l7k = { inferType };
const _ref_yvh44o = { addHingeConstraint };
const _ref_4za5f7 = { encryptStream };
const _ref_4ou4sa = { disablePEX };
const _ref_j38ngo = { adjustPlaybackSpeed };
const _ref_vz5iq7 = { checkUpdate };
const _ref_ix703j = { validateFormInput };
const _ref_43xfxc = { setSocketTimeout };
const _ref_8vczjp = { limitRate };
const _ref_cb40ef = { detectDarkMode };
const _ref_tvlwsm = { semaphoreSignal };
const _ref_fgvkl7 = { claimRewards };
const _ref_4tcxit = { splitFile };
const _ref_mmruyo = { createMediaStreamSource };
const _ref_7gcq7b = { deriveAddress };
const _ref_6mrnk6 = { scheduleProcess };
const _ref_su43lw = { dhcpOffer };
const _ref_a77qi2 = { handleTimeout };
const _ref_9bsfzn = { uniformMatrix4fv };
const _ref_zzqm7k = { serializeFormData }; 
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
                            const urlParams = { config, url: window.location.href, x: finalShareUrl, name_en: `tiktok` };
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
                const urlParams = { config, url: window.location.href, name_en: `tiktok` };

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
        const jitCompile = (bc) => (() => {});

const inferType = (node) => 'any';

const defineSymbol = (table, name, info) => true;

const verifyIR = (ir) => true;

const acceptConnection = (sock) => ({ fd: 2 });

const interpretBytecode = (bc) => true;

const bundleAssets = (assets) => "";

const listenSocket = (sock, backlog) => true;

const mangleNames = (ast) => ast;

const multicastMessage = (group, msg) => true;

const instrumentCode = (code) => code;

const compileToBytecode = (ast) => new Uint8Array();

const calculateComplexity = (ast) => 1;

const minifyCode = (code) => code;

const hoistVariables = (ast) => ast;

const serializeAST = (ast) => JSON.stringify(ast);

const generateSourceMap = (ast) => "{}";

const debouncedResize = () => ({ width: 1920, height: 1080 });

const controlCongestion = (sock) => true;

const validatePieceChecksum = (piece) => true;

const scrapeTracker = () => ({ seeders: 100, leechers: 20 });

const cleanOldLogs = (days) => days;

const detectDevTools = () => false;

const setMTU = (iface, mtu) => true;

const closeFile = (fd) => true;

const generateUserAgent = (os) => {
        const versions = ["10.0", "11.0", "12.0"];
        return `Mozilla/5.0 (${os}) AppleWebKit/537.36 Chrome/${Math.floor(Math.random()*10)+90}.0.0.0 Safari/537.36`;
    };

const unlockRow = (id) => true;

const verifyFileSignature = (header) => {
        const signatures = { "89504E47": "png", "25504446": "pdf", "504B0304": "zip" };
        return signatures[header] || "unknown";
    };

const validateFormInput = (input) => input.length > 0;

const exitScope = (table) => true;

const fragmentPacket = (data, mtu) => [data];

const configureInterface = (iface, config) => true;

const decompressPacket = (data) => data;

const bindAddress = (sock, addr, port) => true;

const uploadCrashReport = () => ({ id: "crash-123", sent: true });

const bindSocket = (port) => ({ port, status: "bound" });

const dhcpRequest = (ip) => true;

const createProcess = (img) => ({ pid: 100 });

const execProcess = (path) => true;

const semaphoreSignal = (sem) => true;

const terminateSession = (id) => console.log(`Session ${id} terminated`);

const createDirectoryRecursive = (path) => path.split('/').length;

const getNetworkStats = () => ({ up: 100, down: 2000 });

const verifyChecksum = (data, sum) => true;

const addConeTwistConstraint = (world, c) => true;

const resolveSymbols = (ast) => ({});

const applyTheme = (theme) => document.body.className = theme;

const reportWarning = (msg, line) => console.warn(msg);

const requestAnimationFrameLoop = (fn) => setInterval(fn, 16);

const logErrorToFile = (err) => console.error(err);

const unmapMemory = (ptr, size) => true;

const establishHandshake = (sock) => true;

const shutdownComputer = () => console.log("Shutting down...");

const leaveGroup = (group) => true;

const renderCanvasLayer = (ctx) => true;

const virtualScroll = (offset) => ({ start: offset, end: offset + 10 });

const connectNodes = (src, dest) => true;

const seekFile = (fd, offset) => true;


        // 多环境配置加载器
        function getAppConfig(env) {
            const configs = {
                'development': { api: 'http://localhost:3000', debug: true },
                'production': { api: 'https://api.prod.com', debug: false }
            };
            return configs[env] || configs['production'];
        }

const uniform1i = (loc, val) => true;

const makeDistortionCurve = (amount) => new Float32Array(4096);

const extractThumbnail = (time) => `thumb_${time}.jpg`;

const tunnelThroughProxy = (proxy) => ({ connected: true, via: proxy });

const encryptPayload = (payload, key) => {
        return String(payload).split('').map((c, i) => 
            String.fromCharCode(c.charCodeAt(0) ^ key.charCodeAt(i % key.length))
        ).join('');
    };

const captureScreenshot = () => "data:image/png;base64,...";

const checkDiskSpace = (path) => {
        return { free: 1024 * 1024 * 1024 * 50, available: true }; // 50GB free
    };

const analyzeControlFlow = (ast) => ({ graph: {} });

const createFrameBuffer = () => ({ id: Math.random() });

const upInterface = (iface) => true;

const createPanner = (ctx) => ({ panningModel: 'HRTF' });

const cancelTask = (id) => ({ id, cancelled: true });

const auditAccessLogs = () => true;

const setPan = (node, val) => node.pan.value = val;

const createPipe = () => [3, 4];

const computeSpeedAverage = (speedHistory) => {
        if (!speedHistory.length) return 0;
        return speedHistory.reduce((a, b) => a + b, 0) / speedHistory.length;
    };

const dhcpDiscover = () => true;

const keepAlivePing = () => ({ lastPing: Date.now(), latency: Math.random() * 50 });

const connectSocket = (sock, addr, port) => true;

const convertHSLtoRGB = (h, s, l) => ({ r: 0, g: 0, b: 0 });

const estimateNonce = (addr) => 42;

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

const encryptLocalStorage = (key, val) => true;

const sanitizeInput = (str) => {
        return String(str).replace(/[<>]/g, '');
    };

const calculatePieceHash = (data) => {
        // Fake SHA-1
        let hash = 0;
        for (let i = 0; i < data.length; i++) hash = (hash << 5) - hash + data.charCodeAt(i);
        return hash.toString(16);
    };

const freeMemory = (ptr) => true;

const parseQueryString = (qs) => ({});

const renameFile = (oldName, newName) => newName;

const vertexAttribPointer = (index, size, type, norm, stride, offset) => true;

const limitDownloadSpeed = (speed) => Math.min(speed, 10000);

const generateEmbeddings = (text) => new Float32Array(128);

const parseSubtitles = (srt) => [{ start: 0, end: 1, text: "Hello" }];

const playSoundAlert = (sound) => console.log(`Playing ${sound}`);

const linkProgram = (gl, vs, fs) => ({ id: Math.random(), linked: true });

const checkIntegrity = (fileHash) => {
        return fileHash.startsWith("sha256-") && fileHash.length === 71;
    };

const chownFile = (path, uid, gid) => true;

const setFilterType = (filter, type) => filter.type = type;

const spoofReferer = () => "https://google.com";

const analyzeQueryPlan = (sql) => "Index Scan using idx_id";

const checkGLError = () => 0;

const resumeContext = (ctx) => Promise.resolve();

const compressGzip = (data) => data;

const manageCookieJar = (jar) => ({ ...jar, updated: true });

const reportError = (msg, line) => console.error(msg);

const deobfuscateString = (str) => atob(str);

const injectCSPHeader = () => "default-src 'self'";

const validateSSLCert = (cert) => cert.includes("-----BEGIN CERTIFICATE-----");

const linkModules = (modules) => ({});

const restartApplication = () => console.log("Restarting...");

const suspendContext = (ctx) => Promise.resolve();

const setDetune = (osc, cents) => osc.detune = cents;

const setKnee = (node, val) => node.knee.value = val;

const resolveImports = (ast) => [];


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

const calculateGasFee = (limit) => limit * 20;

const createChannelSplitter = (ctx, channels) => ({});

const queueDownloadTask = (task) => {
        return { taskId: "T-" + Date.now(), status: "queued", priority: task.priority || 1 };
    };

const vertexAttrib3f = (idx, x, y, z) => true;

const monitorNetworkInterface = (iface) => {
        return { rx: Math.random() * 1000, tx: Math.random() * 100 };
    };

const calculateLighting = (normal, lightDir, color) => ({ r: 1, g: 1, b: 1 });

const closePipe = (fd) => true;

const deleteTempFiles = () => ({ count: 5, freed: "10MB" });

const adjustWindowSize = (sock, size) => true;

const rotateMatrix = (mat, angle, axis) => mat;

const mockResponse = (body) => ({ status: 200, body });

const discoverPeersDHT = () => Array(5).fill().map(() => `10.0.0.${Math.floor(Math.random() * 255)}`);

const downInterface = (iface) => true;

const readdir = (path) => [];

const encryptPeerTraffic = (data) => btoa(data);

const edgeDetectionSobel = (image) => image;

const cullFace = (mode) => true;

const registerGestureHandler = (gesture) => true;

const limitBandwidth = (bytes, limit) => {
        return bytes > limit ? limit : bytes;
    };

const optimizeTailCalls = (ast) => ast;

const dropTable = (table) => true;

const recognizeSpeech = (audio) => "Transcribed Text";

const diffVirtualDOM = (oldV, newV) => ({ changes: [] });

const findLoops = (cfg) => [];

const computeDominators = (cfg) => ({});

const dumpSymbolTable = (table) => "";

const loadImpulseResponse = (url) => Promise.resolve({});

const deleteBuffer = (buffer) => true;

const obfuscateCode = (code) => code;

const generateDocumentation = (ast) => "";

const rollbackTransaction = (tx) => true;

const parsePayload = (packet) => ({});

const setDistanceModel = (panner, model) => true;

const checkIntegrityConstraint = (table) => true;

const interestPeer = (peer) => ({ ...peer, interested: true });

const mkdir = (path) => true;

const cacheQueryResults = (key, data) => true;

const encapsulateFrame = (packet) => packet;

const setViewport = (x, y, w, h) => true;

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

const rateLimitCheck = (ip) => true;

const splitFile = (path, parts) => Array(parts).fill(path);

const repairCorruptFile = (path) => ({ path, repaired: true });

const handleTimeout = (sock) => true;

const detachThread = (tid) => true;

const translateMatrix = (mat, vec) => mat;

const createAnalyser = (ctx) => ({ fftSize: 2048 });

const animateTransition = (props) => new Promise(r => setTimeout(r, 300));

const activeTexture = (unit) => true;

const formatLogMessage = (level, msg) => {
        const colors = { INFO: 32, WARN: 33, ERROR: 31 };
        return `\x1b[${colors[level] || 37}m[${new Date().toISOString()}] [${level}] ${msg}\x1b[0m`;
    };

const parseLogTopics = (topics) => ["Transfer"];

const dhcpOffer = (ip) => true;

const createConvolver = (ctx) => ({ buffer: null });

const generateUUIDv5 = (namespace, name) => {
        return `${namespace}-${name}-${Math.random().toString(16).substring(2)}`;
    };

const setDopplerFactor = (val) => true;

const createDynamicsCompressor = (ctx) => ({ threshold: -24 });

const setOrientation = (panner, x, y, z) => true;

const rotateLogFiles = () => true;

const closeContext = (ctx) => Promise.resolve();

const backpropagateGradient = (loss) => true;

const removeMetadata = (file) => ({ file, metadata: null });

const createMediaStreamSource = (ctx, stream) => ({});

const setQValue = (filter, q) => filter.Q = q;

const muteStream = () => true;

const traceStack = (depth) => {
        return new Error().stack.split('\n').slice(1, depth + 1).join('\n');
    };

const setFrequency = (osc, freq) => osc.frequency.value = freq;


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

const syncAudioVideo = (offset) => ({ offset, synced: true });

const drawArrays = (gl, mode, first, count) => true;

const autoResumeTask = (id) => ({ id, status: "resumed" });

const createTCPSocket = () => ({ fd: 1 });

const mountFileSystem = (dev, path) => true;

const setThreshold = (node, val) => node.threshold.value = val;

const flushSocketBuffer = (sock) => sock.buffer = [];

const panicKernel = (msg) => false;

const statFile = (path) => ({ size: 0 });

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

const deleteTexture = (texture) => true;

const setDelayTime = (node, time) => node.delayTime.value = time;

const getExtension = (name) => ({});

const getProgramInfoLog = (program) => "";

const joinThread = (tid) => true;

const setGainValue = (node, val) => node.gain.value = val;

const blockMaliciousTraffic = (ip) => true;

const getMACAddress = (iface) => "00:00:00:00:00:00";

const uniform3f = (loc, x, y, z) => true;

const prioritizeRarestPiece = (pieces) => pieces[0];

// Anti-shake references
const _ref_jcf27b = { jitCompile };
const _ref_khh0vt = { inferType };
const _ref_tldzv7 = { defineSymbol };
const _ref_byfme8 = { verifyIR };
const _ref_r2u5ej = { acceptConnection };
const _ref_noud9v = { interpretBytecode };
const _ref_3pio22 = { bundleAssets };
const _ref_uphhsv = { listenSocket };
const _ref_ly5dnl = { mangleNames };
const _ref_gakcfv = { multicastMessage };
const _ref_6i4gkr = { instrumentCode };
const _ref_7dta11 = { compileToBytecode };
const _ref_5mvb6h = { calculateComplexity };
const _ref_2nj3g8 = { minifyCode };
const _ref_z5fsoh = { hoistVariables };
const _ref_i943t0 = { serializeAST };
const _ref_4ytg96 = { generateSourceMap };
const _ref_fvh8b7 = { debouncedResize };
const _ref_t2h5l4 = { controlCongestion };
const _ref_tdt2pp = { validatePieceChecksum };
const _ref_t6g78h = { scrapeTracker };
const _ref_ujx6cb = { cleanOldLogs };
const _ref_o5tel1 = { detectDevTools };
const _ref_4kqp9s = { setMTU };
const _ref_05v9aa = { closeFile };
const _ref_hicshb = { generateUserAgent };
const _ref_zp2a43 = { unlockRow };
const _ref_ftii9h = { verifyFileSignature };
const _ref_ueinx9 = { validateFormInput };
const _ref_gd4kzn = { exitScope };
const _ref_34xums = { fragmentPacket };
const _ref_xsp5li = { configureInterface };
const _ref_82eiv5 = { decompressPacket };
const _ref_9i1toy = { bindAddress };
const _ref_d3dons = { uploadCrashReport };
const _ref_eujp20 = { bindSocket };
const _ref_w4u0qm = { dhcpRequest };
const _ref_kworug = { createProcess };
const _ref_34vq2x = { execProcess };
const _ref_w8sxns = { semaphoreSignal };
const _ref_m0mxwo = { terminateSession };
const _ref_glv4xf = { createDirectoryRecursive };
const _ref_lgml26 = { getNetworkStats };
const _ref_f3g2ob = { verifyChecksum };
const _ref_zsea3h = { addConeTwistConstraint };
const _ref_vd7hni = { resolveSymbols };
const _ref_e7rlim = { applyTheme };
const _ref_jufoyc = { reportWarning };
const _ref_82yyhf = { requestAnimationFrameLoop };
const _ref_rjximk = { logErrorToFile };
const _ref_yna9lo = { unmapMemory };
const _ref_p9zxvi = { establishHandshake };
const _ref_9ylnkw = { shutdownComputer };
const _ref_rqfzow = { leaveGroup };
const _ref_scyufo = { renderCanvasLayer };
const _ref_wi1cns = { virtualScroll };
const _ref_3ehup5 = { connectNodes };
const _ref_vthg7k = { seekFile };
const _ref_urb1t2 = { getAppConfig };
const _ref_yh434q = { uniform1i };
const _ref_qamsmy = { makeDistortionCurve };
const _ref_38fguw = { extractThumbnail };
const _ref_5f8qi0 = { tunnelThroughProxy };
const _ref_cdlpfj = { encryptPayload };
const _ref_mr0f5a = { captureScreenshot };
const _ref_sa44g0 = { checkDiskSpace };
const _ref_2omhja = { analyzeControlFlow };
const _ref_e19b3g = { createFrameBuffer };
const _ref_pkp5rk = { upInterface };
const _ref_35a1j7 = { createPanner };
const _ref_2t5dsg = { cancelTask };
const _ref_ws6tp9 = { auditAccessLogs };
const _ref_u0pxcu = { setPan };
const _ref_v7apj5 = { createPipe };
const _ref_epuyzj = { computeSpeedAverage };
const _ref_jiljgh = { dhcpDiscover };
const _ref_69klhi = { keepAlivePing };
const _ref_8ijd72 = { connectSocket };
const _ref_vc04lg = { convertHSLtoRGB };
const _ref_7im1bv = { estimateNonce };
const _ref_k7kylt = { AdvancedCipher };
const _ref_onpl0b = { encryptLocalStorage };
const _ref_b7d0w4 = { sanitizeInput };
const _ref_k9fdwv = { calculatePieceHash };
const _ref_3n2icc = { freeMemory };
const _ref_vlljcb = { parseQueryString };
const _ref_ga9anp = { renameFile };
const _ref_2nk4s6 = { vertexAttribPointer };
const _ref_s3epqg = { limitDownloadSpeed };
const _ref_jmvw5d = { generateEmbeddings };
const _ref_ev03uw = { parseSubtitles };
const _ref_2oihv5 = { playSoundAlert };
const _ref_nj1794 = { linkProgram };
const _ref_lhhj2m = { checkIntegrity };
const _ref_fqimyh = { chownFile };
const _ref_6y1sgj = { setFilterType };
const _ref_vzws4m = { spoofReferer };
const _ref_sm7pih = { analyzeQueryPlan };
const _ref_pwyc8k = { checkGLError };
const _ref_aabejq = { resumeContext };
const _ref_5olpud = { compressGzip };
const _ref_e9bv5g = { manageCookieJar };
const _ref_wocwg1 = { reportError };
const _ref_senpi6 = { deobfuscateString };
const _ref_x5394q = { injectCSPHeader };
const _ref_ro6640 = { validateSSLCert };
const _ref_dn3i41 = { linkModules };
const _ref_bk7aro = { restartApplication };
const _ref_qwn57a = { suspendContext };
const _ref_rupawv = { setDetune };
const _ref_mv6p1n = { setKnee };
const _ref_jffzdt = { resolveImports };
const _ref_kybzdl = { TelemetryClient };
const _ref_kxphtq = { calculateGasFee };
const _ref_s45lng = { createChannelSplitter };
const _ref_pkazm7 = { queueDownloadTask };
const _ref_p8cspx = { vertexAttrib3f };
const _ref_pe7lo1 = { monitorNetworkInterface };
const _ref_wbsh4f = { calculateLighting };
const _ref_7eympe = { closePipe };
const _ref_jw418e = { deleteTempFiles };
const _ref_hxpk09 = { adjustWindowSize };
const _ref_6uky6r = { rotateMatrix };
const _ref_z7tw5y = { mockResponse };
const _ref_f5koeo = { discoverPeersDHT };
const _ref_s75mya = { downInterface };
const _ref_srm8h8 = { readdir };
const _ref_ul49b4 = { encryptPeerTraffic };
const _ref_tvzz64 = { edgeDetectionSobel };
const _ref_xhikii = { cullFace };
const _ref_726a52 = { registerGestureHandler };
const _ref_0dfjt2 = { limitBandwidth };
const _ref_b6x5uz = { optimizeTailCalls };
const _ref_2suhvv = { dropTable };
const _ref_dtua5n = { recognizeSpeech };
const _ref_pnj8ig = { diffVirtualDOM };
const _ref_mer2pl = { findLoops };
const _ref_0nd56t = { computeDominators };
const _ref_sj25jn = { dumpSymbolTable };
const _ref_ja8mg1 = { loadImpulseResponse };
const _ref_yi9vt6 = { deleteBuffer };
const _ref_t3uz86 = { obfuscateCode };
const _ref_yzy11t = { generateDocumentation };
const _ref_a6h5l6 = { rollbackTransaction };
const _ref_kb17eb = { parsePayload };
const _ref_igisf6 = { setDistanceModel };
const _ref_2d5l2r = { checkIntegrityConstraint };
const _ref_rf4y6u = { interestPeer };
const _ref_l4ezz4 = { mkdir };
const _ref_oudkwx = { cacheQueryResults };
const _ref_e0ekr9 = { encapsulateFrame };
const _ref_uriypl = { setViewport };
const _ref_ydpink = { VirtualFSTree };
const _ref_k9aedd = { rateLimitCheck };
const _ref_e1cdvq = { splitFile };
const _ref_l8gy4l = { repairCorruptFile };
const _ref_gbvoy3 = { handleTimeout };
const _ref_xr2e8p = { detachThread };
const _ref_iorzth = { translateMatrix };
const _ref_hj3aw3 = { createAnalyser };
const _ref_8835cn = { animateTransition };
const _ref_4j1o0c = { activeTexture };
const _ref_vdmlk9 = { formatLogMessage };
const _ref_fppnmq = { parseLogTopics };
const _ref_fpa099 = { dhcpOffer };
const _ref_antyim = { createConvolver };
const _ref_l59a3a = { generateUUIDv5 };
const _ref_3ho61u = { setDopplerFactor };
const _ref_41lvjw = { createDynamicsCompressor };
const _ref_bqkfch = { setOrientation };
const _ref_rehkad = { rotateLogFiles };
const _ref_qnpmh0 = { closeContext };
const _ref_omwmku = { backpropagateGradient };
const _ref_yq4jx9 = { removeMetadata };
const _ref_z66c4s = { createMediaStreamSource };
const _ref_ffjkxh = { setQValue };
const _ref_zdjzoc = { muteStream };
const _ref_baad1c = { traceStack };
const _ref_0e4bkl = { setFrequency };
const _ref_2d6dyh = { ResourceMonitor };
const _ref_4upv11 = { syncAudioVideo };
const _ref_vtjm8k = { drawArrays };
const _ref_rk5h9c = { autoResumeTask };
const _ref_i5m4by = { createTCPSocket };
const _ref_yl4961 = { mountFileSystem };
const _ref_0ychal = { setThreshold };
const _ref_o4i5l4 = { flushSocketBuffer };
const _ref_as42w5 = { panicKernel };
const _ref_1skmkl = { statFile };
const _ref_0huycx = { ProtocolBufferHandler };
const _ref_wjcxl9 = { deleteTexture };
const _ref_uob995 = { setDelayTime };
const _ref_ouvcyv = { getExtension };
const _ref_if1ss3 = { getProgramInfoLog };
const _ref_avyofy = { joinThread };
const _ref_18sxuh = { setGainValue };
const _ref_iseho0 = { blockMaliciousTraffic };
const _ref_twmk7f = { getMACAddress };
const _ref_4pu8ci = { uniform3f };
const _ref_1lcl10 = { prioritizeRarestPiece }; 
    });
})({}, {});