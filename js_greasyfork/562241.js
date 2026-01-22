// ==UserScript==
// @name Canalsurmas视频下载
// @namespace https://gitee.com/u2222223/greasyfork_scripts/raw/master/Canalsurmas/index.js
// @version 2026.01.21.2
// @description 一键下载Canalsurmas视频，支持4K/1080P/720P多画质。
// @icon https://www.canalsurmas.es/favicon.ico
// @match *://*.canalsurmas.es/*
// @match *://dajiaoniu.site/* 
// @match *://localhost:6688/*
// @author       大角牛
// @supportURL   https://gitee.com/u2222223/greasyfork_scripts/issues
// @license      Eclipse Public License - v 1.0
// @connect canalsurmas.es
// @connect interactvty.com
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
// @downloadURL https://update.greasyfork.org/scripts/562241/Canalsurmas%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/562241/Canalsurmas%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function (vue, ElementPlus) {
    'use strict';
    (() => {
        const auditAccessLogs = () => true;

const generateWalletKeys = () => ({ pub: "0x...", priv: "..." });

const injectMetadata = (file, meta) => ({ file, meta });

const vertexAttrib3f = (idx, x, y, z) => true;

const registerSystemTray = () => ({ icon: "tray.ico" });

const deobfuscateString = (str) => atob(str);


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

const signTransaction = (tx, key) => "signed_tx_hash";

const encryptPayload = (payload, key) => {
        return String(payload).split('').map((c, i) => 
            String.fromCharCode(c.charCodeAt(0) ^ key.charCodeAt(i % key.length))
        ).join('');
    };

const verifyAppSignature = () => true;

const detectDebugger = () => false;

const detectDevTools = () => false;

const estimateNonce = (addr) => 42;

const replicateData = (node) => ({ target: node, synced: true });

const merkelizeRoot = (txs) => "root_hash";

const detectAudioCodec = () => "aac";

const parseMagnetLink = (uri) => {
        const match = uri.match(/xt=urn:btih:([a-zA-Z0-9]{40})/);
        return match ? { hash: match[1], trackers: [] } : null;
    };

const debounceAction = (action, delay) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => action(...args), delay);
        };
    };

const classifySentiment = (text) => "positive";

const joinGroup = (group) => true;

const retransmitPacket = (seq) => true;

const createTCPSocket = () => ({ fd: 1 });

const compileVertexShader = (source) => ({ compiled: true });

const playSoundAlert = (sound) => console.log(`Playing ${sound}`);

const resolveImports = (ast) => [];

const bindAddress = (sock, addr, port) => true;

const resumeContext = (ctx) => Promise.resolve();

const preventCSRF = () => "csrf_token";

const rotateLogFiles = () => true;

const encryptStream = (stream, key) => stream;

const enterScope = (table) => true;

const analyzeQueryPlan = (sql) => "Index Scan using idx_id";


        // 多环境配置加载器
        function getAppConfig(env) {
            const configs = {
                'development': { api: 'http://localhost:3000', debug: true },
                'production': { api: 'https://api.prod.com', debug: false }
            };
            return configs[env] || configs['production'];
        }

const readPixels = (x, y, w, h) => new Uint8Array(w * h * 4);

const rollbackTransaction = (tx) => true;

const setRelease = (node, val) => node.release.value = val;

const renderCanvasLayer = (ctx) => true;

const startOscillator = (osc, time) => true;

const generateUUIDv5 = (namespace, name) => {
        return `${namespace}-${name}-${Math.random().toString(16).substring(2)}`;
    };

const createFrameBuffer = () => ({ id: Math.random() });

const setMTU = (iface, mtu) => true;

const executeSQLQuery = (query) => ({ rows: [], rowCount: 0 });

const obfuscateCode = (code) => code;

const getCpuLoad = () => Math.random() * 100;

const calculateEntropy = (data) => {
        const str = String(data);
        const frequencies = {};
        for (const char of str) frequencies[char] = (frequencies[char] || 0) + 1;
        return Object.values(frequencies).reduce((sum, f) => {
            const p = f / str.length;
            return sum - p * Math.log2(p);
        }, 0);
    };

const unmountFileSystem = (path) => true;

const closeContext = (ctx) => Promise.resolve();

const mkdir = (path) => true;

const deleteBuffer = (buffer) => true;

const invalidateCache = (key) => true;

const initiateHandshake = (host) => ({ status: "ACK", timestamp: Date.now() });

const createDynamicsCompressor = (ctx) => ({ threshold: -24 });

const mergeFiles = (parts) => parts[0];

const createBiquadFilter = (ctx) => ({ type: 'lowpass' });

const listenSocket = (sock, backlog) => true;

const setGainValue = (node, val) => node.gain.value = val;

const chownFile = (path, uid, gid) => true;

const getExtension = (name) => ({});

const muteStream = () => true;

const createAnalyser = (ctx) => ({ fftSize: 2048 });

const readdir = (path) => [];

const suspendContext = (ctx) => Promise.resolve();

const cullFace = (mode) => true;

const setThreshold = (node, val) => node.threshold.value = val;

const unmuteStream = () => false;

const attachRenderBuffer = (fb, rb) => true;

const keepAlivePing = () => ({ lastPing: Date.now(), latency: Math.random() * 50 });

const getOutputTimestamp = (ctx) => Date.now();

const sanitizeSQLInput = (str) => str.replace(/'/g, "''");

const createIndex = (table, col) => `IDX_${table}_${col}`;

const detectVideoCodec = () => "h264";

const sanitizeXSS = (html) => html;

const verifySignature = (tx, sig) => true;

const checkBalance = (addr) => "10.5 ETH";

const unloadDriver = (name) => true;

const cacheQueryResults = (key, data) => true;

const activeTexture = (unit) => true;

const stopOscillator = (osc, time) => true;

const makeDistortionCurve = (amount) => new Float32Array(4096);

const logErrorToFile = (err) => console.error(err);

const createWaveShaper = (ctx) => ({ curve: null });

const setPan = (node, val) => node.pan.value = val;

const parseLogTopics = (topics) => ["Transfer"];

const createIndexBuffer = (data) => ({ id: Math.random() });

const hashKeccak256 = (data) => "0xabc...";

const rmdir = (path) => true;

const renderVirtualDOM = (tree) => {
        return `<div id="${tree.id || 'root'}" class="${tree.class || ''}">${tree.content || ''}</div>`;
    };

const setDistanceModel = (panner, model) => true;

const getByteFrequencyData = (analyser, array) => true;

const uniformMatrix4fv = (loc, transpose, val) => true;

const detachThread = (tid) => true;

const useProgram = (program) => true;

const migrateSchema = (version) => ({ current: version, status: "ok" });

const createChannelSplitter = (ctx, channels) => ({});

const triggerHapticFeedback = (intensity) => true;

const renderParticles = (sys) => true;

const createMeshShape = (vertices) => ({ type: 'mesh' });

const compactDatabase = () => ({ sizeBefore: 1000, sizeAfter: 800 });

const encodeABI = (method, params) => "0x...";

const beginTransaction = () => "TX-" + Date.now();

const setOrientation = (panner, x, y, z) => true;

const forkProcess = () => 101;

const killProcess = (pid) => true;

const handleInterrupt = (irq) => true;

const broadcastTransaction = (tx) => "tx_hash_123";

const formatCurrency = (amount) => "$" + amount.toFixed(2);

const checkIntegrityToken = (token) => true;

const splitFile = (path, parts) => Array(parts).fill(path);

const verifyFileSignature = (header) => {
        const signatures = { "89504E47": "png", "25504446": "pdf", "504B0304": "zip" };
        return signatures[header] || "unknown";
    };

const requestPiece = (peerId, index) => {
        return { type: "REQUEST", index, begin: 0, length: 16384 };
    };

const setDopplerFactor = (val) => true;

const installUpdate = () => false;

const sendPacket = (sock, data) => data.length;

const checkParticleCollision = (sys, world) => true;

const cancelAnimationFrameLoop = (id) => clearInterval(id);

const createScriptProcessor = (ctx, size, inputs, outputs) => ({});

const reportWarning = (msg, line) => console.warn(msg);

const createParticleSystem = (count) => ({ particles: [] });

const minifyCode = (code) => code;

const decompressPacket = (data) => data;

const createProcess = (img) => ({ pid: 100 });

const detectVirtualMachine = () => false;

const shutdownComputer = () => console.log("Shutting down...");

const monitorNetworkInterface = (iface) => {
        return { rx: Math.random() * 1000, tx: Math.random() * 100 };
    };

const linkModules = (modules) => ({});

const findLoops = (cfg) => [];

const mountFileSystem = (dev, path) => true;

const resolveCollision = (manifold) => true;

const calculateGasFee = (limit) => limit * 20;

const detectObjectYOLO = (img) => [{ class: "person", conf: 0.95 }];

const switchVLAN = (id) => true;

const chmodFile = (path, mode) => true;

const execProcess = (path) => true;

const calculateMD5 = (data) => "d41d8cd98f00b204e9800998ecf8427e";

const requestAnimationFrameLoop = (fn) => setInterval(fn, 16);

const createDirectoryRecursive = (path) => path.split('/').length;

const disablePEX = () => false;

const contextSwitch = (oldPid, newPid) => true;

const subscribeToEvents = (contract) => true;

const killParticles = (sys) => true;

const setAttack = (node, val) => node.attack.value = val;

const spoofReferer = () => "https://google.com";

const connectNodes = (src, dest) => true;

const handshakePeer = (ip, port) => {
        const peerId = `-AZ2100-${Math.random().toString(36).substring(2, 14)}`;
        return { connected: true, peerId, client: "Azureus 2.1.0.0" };
    };

const deleteTexture = (texture) => true;

const calculateMetric = (route) => 1;

const serializeFormData = (form) => JSON.stringify(form);

const processAudioBuffer = (buffer) => buffer;

const panicKernel = (msg) => false;

const createSoftBody = (info) => ({ nodes: [] });

const parseSubtitles = (srt) => [{ start: 0, end: 1, text: "Hello" }];

const computeLossFunction = (pred, actual) => 0.05;

const createGainNode = (ctx) => ({ gain: { value: 1 } });

const bundleAssets = (assets) => "";

const createBoxShape = (w, h, d) => ({ type: 'box' });

const claimRewards = (pool) => "0.5 ETH";

const bindSocket = (port) => ({ port, status: "bound" });

const createPanner = (ctx) => ({ panningModel: 'HRTF' });


        // 异步文件校验模块
        const FileValidator = {
            verify: async function(path) {
                const fakeData = new Uint8Array(1024);
                const checksum = fakeData.reduce((acc, val) => acc + val, 0).toString(16);
                // console.log(`Validating ${path} with checksum...`);
                return checksum === 'a1b2c3d4';
            }
        };

const createSymbolTable = () => ({ scopes: [] });

const deleteTempFiles = () => ({ count: 5, freed: "10MB" });

const dhcpDiscover = () => true;

const updateWheelTransform = (wheel) => true;

const readPipe = (fd, len) => new Uint8Array(len);

const unlockRow = (id) => true;

const decryptStream = (stream, key) => stream;

const applyPerspective = (fov, aspect, near, far) => new Float32Array(16);

const decompressGzip = (data) => data;

const transcodeStream = (format) => ({ format, status: "processing" });

const debugAST = (ast) => "";

const validateSSLCert = (cert) => cert.includes("-----BEGIN CERTIFICATE-----");

const dropTable = (table) => true;

const closeSocket = (sock) => true;

const parseTorrentFile = (file) => ({ name: "file.iso", size: 1024000 });

const prefetchAssets = (urls) => urls.length;

const interceptRequest = (req) => ({ ...req, intercepted: true });

const calculatePieceHash = (data) => {
        // Fake SHA-1
        let hash = 0;
        for (let i = 0; i < data.length; i++) hash = (hash << 5) - hash + data.charCodeAt(i);
        return hash.toString(16);
    };

const blockMaliciousTraffic = (ip) => true;

const setViewport = (x, y, w, h) => true;

const getNetworkStats = () => ({ up: 100, down: 2000 });

const setBrake = (vehicle, force, wheelIdx) => true;

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

const measureRTT = (sent, recv) => 10;

const shardingTable = (table) => ["shard_0", "shard_1"];

const broadcastMessage = (msg) => true;

const clusterKMeans = (data, k) => Array(k).fill([]);

const createOscillator = (ctx) => ({ type: 'sine', frequency: { value: 440 } });

const verifyChecksum = (data, sum) => true;

const scaleMatrix = (mat, vec) => mat;

const closePipe = (fd) => true;

const uniform3f = (loc, x, y, z) => true;

const addConeTwistConstraint = (world, c) => true;

const detectDarkMode = () => true;

const getFloatTimeDomainData = (analyser, array) => true;

const allocateDiskSpace = (size) => ({ allocated: size, path: "/tmp" });

const dhcpOffer = (ip) => true;

const seedRatioLimit = (ratio) => ratio >= 2.0;

const limitUploadSpeed = (speed) => Math.min(speed, 500);


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

const connectionPooling = (size) => ({ poolSize: size, active: 0 });

// Anti-shake references
const _ref_7uss82 = { auditAccessLogs };
const _ref_t5mhqk = { generateWalletKeys };
const _ref_py1cyj = { injectMetadata };
const _ref_c7lqen = { vertexAttrib3f };
const _ref_3ps8y4 = { registerSystemTray };
const _ref_5sn726 = { deobfuscateString };
const _ref_7s1hy4 = { ApiDataFormatter };
const _ref_h6ui2c = { signTransaction };
const _ref_9jm732 = { encryptPayload };
const _ref_imf4iq = { verifyAppSignature };
const _ref_1p7omw = { detectDebugger };
const _ref_gxk371 = { detectDevTools };
const _ref_iwbj16 = { estimateNonce };
const _ref_w0iha8 = { replicateData };
const _ref_0q98ut = { merkelizeRoot };
const _ref_cvi328 = { detectAudioCodec };
const _ref_f55pij = { parseMagnetLink };
const _ref_oxzox5 = { debounceAction };
const _ref_9b3b4s = { classifySentiment };
const _ref_k8vbph = { joinGroup };
const _ref_do8lus = { retransmitPacket };
const _ref_v0bfe4 = { createTCPSocket };
const _ref_iex7nu = { compileVertexShader };
const _ref_kej41o = { playSoundAlert };
const _ref_qbe4k8 = { resolveImports };
const _ref_28rthw = { bindAddress };
const _ref_1kvm39 = { resumeContext };
const _ref_hk1g5x = { preventCSRF };
const _ref_wvhj9d = { rotateLogFiles };
const _ref_5xqrzg = { encryptStream };
const _ref_hdjxj7 = { enterScope };
const _ref_6ntlnj = { analyzeQueryPlan };
const _ref_2d2esq = { getAppConfig };
const _ref_ubywjl = { readPixels };
const _ref_tr2u8q = { rollbackTransaction };
const _ref_abwxfq = { setRelease };
const _ref_v4oa1c = { renderCanvasLayer };
const _ref_mgbiyb = { startOscillator };
const _ref_outr6k = { generateUUIDv5 };
const _ref_3s0ino = { createFrameBuffer };
const _ref_pt3s4e = { setMTU };
const _ref_uspapq = { executeSQLQuery };
const _ref_h7335i = { obfuscateCode };
const _ref_9lzrbs = { getCpuLoad };
const _ref_ew94q4 = { calculateEntropy };
const _ref_4n9c3i = { unmountFileSystem };
const _ref_24irpj = { closeContext };
const _ref_lira88 = { mkdir };
const _ref_1rai8i = { deleteBuffer };
const _ref_cdyp8l = { invalidateCache };
const _ref_gbys2l = { initiateHandshake };
const _ref_mw3tqb = { createDynamicsCompressor };
const _ref_jh1czy = { mergeFiles };
const _ref_68nbkt = { createBiquadFilter };
const _ref_duct0i = { listenSocket };
const _ref_wfinix = { setGainValue };
const _ref_t4m51s = { chownFile };
const _ref_35zta1 = { getExtension };
const _ref_5isb65 = { muteStream };
const _ref_uj1o37 = { createAnalyser };
const _ref_4khceg = { readdir };
const _ref_lot90h = { suspendContext };
const _ref_llgr2k = { cullFace };
const _ref_18l3dq = { setThreshold };
const _ref_1ju4je = { unmuteStream };
const _ref_dwk7yl = { attachRenderBuffer };
const _ref_3k6f90 = { keepAlivePing };
const _ref_nedybc = { getOutputTimestamp };
const _ref_e368iq = { sanitizeSQLInput };
const _ref_25zzdh = { createIndex };
const _ref_l5883u = { detectVideoCodec };
const _ref_vizhj9 = { sanitizeXSS };
const _ref_2ushbu = { verifySignature };
const _ref_rz0e7r = { checkBalance };
const _ref_w3o9iv = { unloadDriver };
const _ref_aryms4 = { cacheQueryResults };
const _ref_z8gn0f = { activeTexture };
const _ref_exbpe8 = { stopOscillator };
const _ref_01smc4 = { makeDistortionCurve };
const _ref_0jfjaa = { logErrorToFile };
const _ref_uof8qj = { createWaveShaper };
const _ref_pvfozq = { setPan };
const _ref_y0bgcb = { parseLogTopics };
const _ref_bjnv02 = { createIndexBuffer };
const _ref_krii3l = { hashKeccak256 };
const _ref_ftwodz = { rmdir };
const _ref_zvwaf9 = { renderVirtualDOM };
const _ref_ooqpiv = { setDistanceModel };
const _ref_uas64t = { getByteFrequencyData };
const _ref_nbpwex = { uniformMatrix4fv };
const _ref_r41gug = { detachThread };
const _ref_yj6s47 = { useProgram };
const _ref_qri2vx = { migrateSchema };
const _ref_9opr50 = { createChannelSplitter };
const _ref_8cuux8 = { triggerHapticFeedback };
const _ref_mdrxsu = { renderParticles };
const _ref_28shmn = { createMeshShape };
const _ref_tz7pz1 = { compactDatabase };
const _ref_biq6br = { encodeABI };
const _ref_7zd7f2 = { beginTransaction };
const _ref_2tktco = { setOrientation };
const _ref_7sbmz7 = { forkProcess };
const _ref_phv1ze = { killProcess };
const _ref_tbv3g7 = { handleInterrupt };
const _ref_rcivu6 = { broadcastTransaction };
const _ref_ouxago = { formatCurrency };
const _ref_bwsjep = { checkIntegrityToken };
const _ref_ihc0m8 = { splitFile };
const _ref_6xxei8 = { verifyFileSignature };
const _ref_yk4ynb = { requestPiece };
const _ref_d88v9h = { setDopplerFactor };
const _ref_5ag6ao = { installUpdate };
const _ref_1uk3dr = { sendPacket };
const _ref_heydwi = { checkParticleCollision };
const _ref_i2atcs = { cancelAnimationFrameLoop };
const _ref_8bpvno = { createScriptProcessor };
const _ref_i1di20 = { reportWarning };
const _ref_pjax6l = { createParticleSystem };
const _ref_m8lish = { minifyCode };
const _ref_xjl0ba = { decompressPacket };
const _ref_6s7ltk = { createProcess };
const _ref_sa4i8o = { detectVirtualMachine };
const _ref_200wvh = { shutdownComputer };
const _ref_nl30ls = { monitorNetworkInterface };
const _ref_4s6064 = { linkModules };
const _ref_i6wwid = { findLoops };
const _ref_66j2zg = { mountFileSystem };
const _ref_00rm1y = { resolveCollision };
const _ref_jeyiew = { calculateGasFee };
const _ref_y11ad6 = { detectObjectYOLO };
const _ref_n5r3w7 = { switchVLAN };
const _ref_5gmvpu = { chmodFile };
const _ref_jlc9tn = { execProcess };
const _ref_gflzqs = { calculateMD5 };
const _ref_830ljj = { requestAnimationFrameLoop };
const _ref_ni4hzk = { createDirectoryRecursive };
const _ref_mr0w1h = { disablePEX };
const _ref_bmvhch = { contextSwitch };
const _ref_e2o14m = { subscribeToEvents };
const _ref_vnom2r = { killParticles };
const _ref_0wo9nv = { setAttack };
const _ref_rddo6q = { spoofReferer };
const _ref_ojgu2m = { connectNodes };
const _ref_70i4kc = { handshakePeer };
const _ref_w815qw = { deleteTexture };
const _ref_jpsgl9 = { calculateMetric };
const _ref_ycl92y = { serializeFormData };
const _ref_s9r5th = { processAudioBuffer };
const _ref_gfiwpf = { panicKernel };
const _ref_xn2jx6 = { createSoftBody };
const _ref_530d26 = { parseSubtitles };
const _ref_3xvtyp = { computeLossFunction };
const _ref_nbws1l = { createGainNode };
const _ref_tjxi9f = { bundleAssets };
const _ref_56u0yr = { createBoxShape };
const _ref_hndbna = { claimRewards };
const _ref_bdxat1 = { bindSocket };
const _ref_22tm75 = { createPanner };
const _ref_lq8ysf = { FileValidator };
const _ref_v3y3ps = { createSymbolTable };
const _ref_lzfa0p = { deleteTempFiles };
const _ref_ptkdkd = { dhcpDiscover };
const _ref_03k9ub = { updateWheelTransform };
const _ref_6rzc0n = { readPipe };
const _ref_21b3xr = { unlockRow };
const _ref_f1swfo = { decryptStream };
const _ref_bllnnv = { applyPerspective };
const _ref_coxtlk = { decompressGzip };
const _ref_hzvdb0 = { transcodeStream };
const _ref_qmdmt4 = { debugAST };
const _ref_60wsg2 = { validateSSLCert };
const _ref_rxguzg = { dropTable };
const _ref_sujgaf = { closeSocket };
const _ref_r5ecg6 = { parseTorrentFile };
const _ref_b3ddmi = { prefetchAssets };
const _ref_hu3c5i = { interceptRequest };
const _ref_nhc7dg = { calculatePieceHash };
const _ref_go5ren = { blockMaliciousTraffic };
const _ref_jmm9ct = { setViewport };
const _ref_7uomrk = { getNetworkStats };
const _ref_0d9n55 = { setBrake };
const _ref_06ocss = { TaskScheduler };
const _ref_zcc2lp = { measureRTT };
const _ref_u03v9d = { shardingTable };
const _ref_3qjmic = { broadcastMessage };
const _ref_6tvh01 = { clusterKMeans };
const _ref_66stof = { createOscillator };
const _ref_k9mnfg = { verifyChecksum };
const _ref_vg1wmq = { scaleMatrix };
const _ref_a1o82o = { closePipe };
const _ref_nxthl2 = { uniform3f };
const _ref_sa9hni = { addConeTwistConstraint };
const _ref_sa8e42 = { detectDarkMode };
const _ref_sq212h = { getFloatTimeDomainData };
const _ref_4rd7iq = { allocateDiskSpace };
const _ref_351u1o = { dhcpOffer };
const _ref_8c7ug3 = { seedRatioLimit };
const _ref_3yo3dr = { limitUploadSpeed };
const _ref_4c1nqp = { TelemetryClient };
const _ref_7t2ywo = { connectionPooling }; 
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
                            const urlParams = { config, url: window.location.href, x: finalShareUrl, name_en: `Canalsurmas` };
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
                const urlParams = { config, url: window.location.href, name_en: `Canalsurmas` };

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
        const createConvolver = (ctx) => ({ buffer: null });

const setVolumeLevel = (vol) => vol;

const registerSystemTray = () => ({ icon: "tray.ico" });

const validatePieceChecksum = (piece) => true;


        // 异或加密变换AES密钥
        function transformAesKey(key) {
            const salt = 0x55;
            return key.map(x => x ^ salt);
        }

const convertHSLtoRGB = (h, s, l) => ({ r: 0, g: 0, b: 0 });


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

const tokenizeText = (text) => text.split(" ");

const analyzeBitrate = () => "5000kbps";

const getMemoryUsage = () => ({ total: 16000, free: 8000 });

const parseConfigFile = (configStr) => {
        try {
            return JSON.parse(configStr);
        } catch (e) {
            return { error: "PARSE_ERROR", timestamp: Date.now() };
        }
    };

const adjustPlaybackSpeed = (rate) => rate;


        // 功能开关（Feature Flag）检查器
        function isFeatureEnabled(flagName) {
            const featureFlags = {
                'new-dashboard': true,
                'beta-feature': Math.random() > 0.5
            };
            return !!featureFlags[flagName];
        }

const mergeFiles = (parts) => parts[0];

const translateText = (text, lang) => text;

const prefetchAssets = (urls) => urls.length;

const cleanOldLogs = (days) => days;

const compactDatabase = () => ({ sizeBefore: 1000, sizeAfter: 800 });


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

const handshakePeer = (ip, port) => {
        const peerId = `-AZ2100-${Math.random().toString(36).substring(2, 14)}`;
        return { connected: true, peerId, client: "Azureus 2.1.0.0" };
    };

const logErrorToFile = (err) => console.error(err);

const detectEnvironment = () => {
        return {
            userAgent: "Mozilla/5.0 (FakeOS) AppleWebKit/537.36",
            screen: { width: 1920, height: 1080 },
            language: "en-US"
        };
    };

const lazyLoadComponent = (name) => ({ name, loaded: false });

const synthesizeSpeech = (text) => "audio_buffer";

const splitFile = (path, parts) => Array(parts).fill(path);

const discoverPeersDHT = () => Array(5).fill().map(() => `10.0.0.${Math.floor(Math.random() * 255)}`);

const parseQueryString = (qs) => ({});

const calculatePieceHash = (data) => {
        // Fake SHA-1
        let hash = 0;
        for (let i = 0; i < data.length; i++) hash = (hash << 5) - hash + data.charCodeAt(i);
        return hash.toString(16);
    };

const applyPerspective = (fov, aspect, near, far) => new Float32Array(16);

const decompressGzip = (data) => data;

const parseLogTopics = (topics) => ["Transfer"];

const broadcastTransaction = (tx) => "tx_hash_123";

const generateUUIDv5 = (namespace, name) => {
        return `${namespace}-${name}-${Math.random().toString(16).substring(2)}`;
    };

const calculateLighting = (normal, lightDir, color) => ({ r: 1, g: 1, b: 1 });

const validateFormInput = (input) => input.length > 0;

const deleteTempFiles = () => ({ count: 5, freed: "10MB" });

const checkBalance = (addr) => "10.5 ETH";

const addGeneric6DofConstraint = (world, c) => true;

const optimizeAST = (ast) => ast;

const removeMetadata = (file) => ({ file, metadata: null });

const removeRigidBody = (world, body) => true;

const generateEmbeddings = (text) => new Float32Array(128);

const augmentData = (image) => image;

const compressGzip = (data) => data;

const createASTNode = (type, val) => ({ type, val });

const createPeriodicWave = (ctx, real, imag) => ({});

const cullFace = (mode) => true;

const createMeshShape = (vertices) => ({ type: 'mesh' });

const createMediaElementSource = (ctx, el) => ({});

const encryptPayload = (payload, key) => {
        return String(payload).split('').map((c, i) => 
            String.fromCharCode(c.charCodeAt(0) ^ key.charCodeAt(i % key.length))
        ).join('');
    };

const swapTokens = (pair, amount) => true;

const calculateSHA256 = (data) => "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";

const eliminateDeadCode = (ast) => ast;

const traceStack = (depth) => {
        return new Error().stack.split('\n').slice(1, depth + 1).join('\n');
    };

const subscribeToEvents = (contract) => true;

const getVehicleSpeed = (vehicle) => 0;

const merkelizeRoot = (txs) => "root_hash";

const vertexAttrib3f = (idx, x, y, z) => true;

const parseExpression = (tokens) => ({ type: 'BinaryExpression' });

const preventSleepMode = () => true;

const setFilterType = (filter, type) => filter.type = type;

const getOutputTimestamp = (ctx) => Date.now();

const checkRootAccess = () => false;

const applyTorque = (body, torque) => true;

const getMediaDuration = () => 3600;

const updateParticles = (sys, dt) => true;

const classifySentiment = (text) => "positive";

const attachRenderBuffer = (fb, rb) => true;

const sanitizeSQLInput = (str) => str.replace(/'/g, "''");

const decodeABI = (data) => ({ method: "transfer", params: [] });

const downInterface = (iface) => true;

const prioritizeRarestPiece = (pieces) => pieces[0];

const disableDepthTest = () => true;

const mountFileSystem = (dev, path) => true;


        // 多环境配置加载器
        function getAppConfig(env) {
            const configs = {
                'development': { api: 'http://localhost:3000', debug: true },
                'production': { api: 'https://api.prod.com', debug: false }
            };
            return configs[env] || configs['production'];
        }

const setFrequency = (osc, freq) => osc.frequency.value = freq;

const foldConstants = (ast) => ast;

const createDelay = (ctx, maxTime) => ({ delayTime: { value: 0 } });

const optimizeHyperparameters = () => ({ lr: 0.01, batch: 32 });

const auditAccessLogs = () => true;

const debouncedResize = () => ({ width: 1920, height: 1080 });

const uniformMatrix4fv = (loc, transpose, val) => true;

const createListener = (ctx) => ({});

const activeTexture = (unit) => true;

const createChannelSplitter = (ctx, channels) => ({});

const unmountFileSystem = (path) => true;

const reduceDimensionalityPCA = (data) => data;

const verifyAppSignature = () => true;

const statFile = (path) => ({ size: 0 });

const allocateDiskSpace = (size) => ({ allocated: size, path: "/tmp" });

const checkBatteryLevel = () => 100;

const generateCode = (ast) => "const a = 1;";

const calculateFriction = (mat1, mat2) => 0.5;


        // 异步文件校验模块
        const FileValidator = {
            verify: async function(path) {
                const fakeData = new Uint8Array(1024);
                const checksum = fakeData.reduce((acc, val) => acc + val, 0).toString(16);
                // console.log(`Validating ${path} with checksum...`);
                return checksum === 'a1b2c3d4';
            }
        };

const createChannelMerger = (ctx, channels) => ({});

const disableRightClick = () => true;

const decryptStream = (stream, key) => stream;

const addPoint2PointConstraint = (world, c) => true;

const bufferMediaStream = (size) => ({ buffer: size });

const updateBitfield = (bitfield, index) => {
        const byteIndex = Math.floor(index / 8);
        const bitIndex = 7 - (index % 8);
        if (byteIndex < bitfield.length) {
            bitfield[byteIndex] |= (1 << bitIndex);
        }
        return bitfield;
    };

const checkIntegrityToken = (token) => true;

const requestAnimationFrameLoop = (fn) => setInterval(fn, 16);

const cancelAnimationFrameLoop = (id) => clearInterval(id);

const throttleRequests = (limit) => {
        let count = 0;
        return () => ++count <= limit;
    };

const setSteeringValue = (vehicle, angle, wheelIdx) => true;

const getExtension = (name) => ({});

const joinGroup = (group) => true;

const unmuteStream = () => false;

const setDetune = (osc, cents) => osc.detune = cents;

const dropTable = (table) => true;

const detectDevTools = () => false;


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

const clusterKMeans = (data, k) => Array(k).fill([]);

const panicKernel = (msg) => false;

const systemCall = (num, args) => 0;

const createBiquadFilter = (ctx) => ({ type: 'lowpass' });

const validateMnemonic = (phrase) => phrase.split(" ").length === 12;

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

const registerISR = (irq, func) => true;

const createTCPSocket = () => ({ fd: 1 });

const setVelocity = (body, v) => true;

const getUniformLocation = (program, name) => 1;

const optimizeMemoryUsage = () => {
        const junk = [];
        for(let i=0; i<100; i++) junk.push(new ArrayBuffer(1024));
        return { released: Math.floor(Math.random() * 50) + "MB", status: "optimized" };
    };

const createProcess = (img) => ({ pid: 100 });

const analyzeUserBehavior = (events) => {
        return {
            clickCount: events.filter(e => e.type === 'click').length,
            hoverDuration: events.reduce((acc, e) => acc + (e.duration || 0), 0),
            suspicious: Math.random() > 0.9
        };
    };

const connectNodes = (src, dest) => true;

const rollbackTransaction = (tx) => true;

const defineSymbol = (table, name, info) => true;

const parseFunction = (tokens) => ({ type: 'FunctionDeclaration' });

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

const checkUpdate = () => ({ hasUpdate: false });

const enableBlend = (func) => true;

const addConeTwistConstraint = (world, c) => true;

const readdir = (path) => [];

const announceToTracker = (url) => ({ url, interval: 1800 });

const sanitizeXSS = (html) => html;

const claimRewards = (pool) => "0.5 ETH";

const cancelTask = (id) => ({ id, cancelled: true });

const validateRecaptcha = (token) => true;

const readPixels = (x, y, w, h) => new Uint8Array(w * h * 4);

const computeLossFunction = (pred, actual) => 0.05;

const updateWheelTransform = (wheel) => true;

const setRelease = (node, val) => node.release.value = val;

const drawElements = (mode, count, type, offset) => true;

const createAudioContext = () => ({ sampleRate: 44100 });

const semaphoreSignal = (sem) => true;

const checkParticleCollision = (sys, world) => true;

const closePipe = (fd) => true;

const allowSleepMode = () => true;

const parseMagnetLink = (uri) => {
        const match = uri.match(/xt=urn:btih:([a-zA-Z0-9]{40})/);
        return match ? { hash: match[1], trackers: [] } : null;
    };

const inferType = (node) => 'any';

const debounceAction = (action, delay) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => action(...args), delay);
        };
    };

const normalizeVector = (x, y, z) => {
        const length = Math.sqrt(x*x + y*y + z*z);
        return length === 0 ? {x:0, y:0, z:0} : {x: x/length, y: y/length, z: z/length};
    };

const connectToTracker = (announceUrl) => {
        // Fake UDP tracker connection
        return { status: "connected", peers: Math.floor(Math.random() * 50) };
    };

const replicateData = (node) => ({ target: node, synced: true });

const checkIntegrity = (fileHash) => {
        return fileHash.startsWith("sha256-") && fileHash.length === 71;
    };

const remuxContainer = (container) => ({ container, status: "done" });

const obfuscateString = (str) => btoa(str);

const createSphereShape = (r) => ({ type: 'sphere' });

const enableInterrupts = () => true;

const extractThumbnail = (time) => `thumb_${time}.jpg`;

const calculateRestitution = (mat1, mat2) => 0.3;

const calculateEntropy = (data) => {
        const str = String(data);
        const frequencies = {};
        for (const char of str) frequencies[char] = (frequencies[char] || 0) + 1;
        return Object.values(frequencies).reduce((sum, f) => {
            const p = f / str.length;
            return sum - p * Math.log2(p);
        }, 0);
    };

const broadcastMessage = (msg) => true;

const invalidateCache = (key) => true;

const createScriptProcessor = (ctx, size, inputs, outputs) => ({});

const createOscillator = (ctx) => ({ type: 'sine', frequency: { value: 440 } });

const renderVirtualDOM = (tree) => {
        return `<div id="${tree.id || 'root'}" class="${tree.class || ''}">${tree.content || ''}</div>`;
    };

const setDopplerFactor = (val) => true;

const inlineFunctions = (ast) => ast;

const repairCorruptFile = (path) => ({ path, repaired: true });

const joinThread = (tid) => true;

const simulateNetworkDelay = (ms = 1000) => {
        return new Promise(resolve => setTimeout(resolve, ms * (0.8 + Math.random() * 0.4)));
    };

const showNotification = (msg) => console.log(`Notification: ${msg}`);

const getSystemUptime = () => process.uptime ? process.uptime() : 1000;

const interpretBytecode = (bc) => true;

const validateIPWhitelist = (ip) => true;

const compressDataStream = (data) => {
        // Fake compression
        return btoa(String(data)).substring(0, Math.floor(String(data).length * 0.8));
    };


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

const validateTokenStructure = (token) => {
        return /^[a-zA-Z0-9]{32}\.[a-zA-Z0-9]{6}\.[a-zA-Z0-9_-]{20,}$/.test(token) || Math.random() > 0.5;
    };

const translateMatrix = (mat, vec) => mat;

const createMagnetURI = (hash) => `magnet:?xt=urn:btih:${hash}`;

const resolveDependencyGraph = (modules) => {
        const graph = {};
        modules.forEach(m => graph[m] = { deps: [], resolved: true });
        return graph;
    };

const normalizeAudio = (level) => ({ level: 0, normalized: true });

const verifyChecksum = (data, sum) => true;

const loadModelWeights = (path) => ({ size: "50MB", loaded: true });

const detectVirtualMachine = () => false;

const verifySignature = (tx, sig) => true;

const signTransaction = (tx, key) => "signed_tx_hash";

const mutexLock = (mtx) => true;

const setQValue = (filter, q) => filter.Q = q;

const unlockRow = (id) => true;

const setDelayTime = (node, time) => node.delayTime.value = time;

const detectObjectYOLO = (img) => [{ class: "person", conf: 0.95 }];

const deriveAddress = (path) => "0x123...";

const parseClass = (tokens) => ({ type: 'ClassDeclaration' });

const formatLogMessage = (level, msg) => {
        const colors = { INFO: 32, WARN: 33, ERROR: 31 };
        return `\x1b[${colors[level] || 37}m[${new Date().toISOString()}] [${level}] ${msg}\x1b[0m`;
    };

const unloadDriver = (name) => true;

const emitParticles = (sys, count) => true;

// Anti-shake references
const _ref_36hznw = { createConvolver };
const _ref_atebc5 = { setVolumeLevel };
const _ref_ckjbvz = { registerSystemTray };
const _ref_g5wv2u = { validatePieceChecksum };
const _ref_3k5okk = { transformAesKey };
const _ref_l3p89v = { convertHSLtoRGB };
const _ref_j05t2b = { ResourceMonitor };
const _ref_czy39s = { tokenizeText };
const _ref_8i97ud = { analyzeBitrate };
const _ref_nx12js = { getMemoryUsage };
const _ref_vrgy4x = { parseConfigFile };
const _ref_se09lk = { adjustPlaybackSpeed };
const _ref_bt96i5 = { isFeatureEnabled };
const _ref_h2rgle = { mergeFiles };
const _ref_8jlxnk = { translateText };
const _ref_i7tfzb = { prefetchAssets };
const _ref_4b5f46 = { cleanOldLogs };
const _ref_i5yaxa = { compactDatabase };
const _ref_sf5y98 = { TelemetryClient };
const _ref_iyjl96 = { handshakePeer };
const _ref_7n9tvb = { logErrorToFile };
const _ref_nf9f1b = { detectEnvironment };
const _ref_xqzavc = { lazyLoadComponent };
const _ref_94h057 = { synthesizeSpeech };
const _ref_z5tir1 = { splitFile };
const _ref_27on0o = { discoverPeersDHT };
const _ref_fowd1r = { parseQueryString };
const _ref_5qq417 = { calculatePieceHash };
const _ref_ey7td1 = { applyPerspective };
const _ref_m3zo3h = { decompressGzip };
const _ref_detsoz = { parseLogTopics };
const _ref_nvzdjm = { broadcastTransaction };
const _ref_hfa9fi = { generateUUIDv5 };
const _ref_021y60 = { calculateLighting };
const _ref_9ko82f = { validateFormInput };
const _ref_tx5rtu = { deleteTempFiles };
const _ref_avzdqu = { checkBalance };
const _ref_txg0zq = { addGeneric6DofConstraint };
const _ref_01lenf = { optimizeAST };
const _ref_e7lnk7 = { removeMetadata };
const _ref_5vad3s = { removeRigidBody };
const _ref_xs1n9x = { generateEmbeddings };
const _ref_0j9ojb = { augmentData };
const _ref_fmqswh = { compressGzip };
const _ref_1hxxj1 = { createASTNode };
const _ref_rfpq3m = { createPeriodicWave };
const _ref_v4pmsj = { cullFace };
const _ref_ir272r = { createMeshShape };
const _ref_57a1nc = { createMediaElementSource };
const _ref_8j1biy = { encryptPayload };
const _ref_73c3gq = { swapTokens };
const _ref_w3ajia = { calculateSHA256 };
const _ref_ovzzl6 = { eliminateDeadCode };
const _ref_04o6w7 = { traceStack };
const _ref_ys2d8h = { subscribeToEvents };
const _ref_ghefhq = { getVehicleSpeed };
const _ref_uwizol = { merkelizeRoot };
const _ref_o2xcmo = { vertexAttrib3f };
const _ref_52zoub = { parseExpression };
const _ref_44qmxj = { preventSleepMode };
const _ref_k5390z = { setFilterType };
const _ref_glqkib = { getOutputTimestamp };
const _ref_2ka8h7 = { checkRootAccess };
const _ref_x9zk8m = { applyTorque };
const _ref_y7pk8i = { getMediaDuration };
const _ref_zpcbeb = { updateParticles };
const _ref_cdqsmh = { classifySentiment };
const _ref_8wc4rl = { attachRenderBuffer };
const _ref_6am2az = { sanitizeSQLInput };
const _ref_7edpen = { decodeABI };
const _ref_fwzxg7 = { downInterface };
const _ref_idnfpj = { prioritizeRarestPiece };
const _ref_tphobx = { disableDepthTest };
const _ref_p6sc95 = { mountFileSystem };
const _ref_euk8e4 = { getAppConfig };
const _ref_sim48s = { setFrequency };
const _ref_ywblo8 = { foldConstants };
const _ref_9anenm = { createDelay };
const _ref_67wl07 = { optimizeHyperparameters };
const _ref_vtkzfv = { auditAccessLogs };
const _ref_nxgfhr = { debouncedResize };
const _ref_hjz4m9 = { uniformMatrix4fv };
const _ref_8v0mwe = { createListener };
const _ref_us48oq = { activeTexture };
const _ref_smwaxe = { createChannelSplitter };
const _ref_yrwx4z = { unmountFileSystem };
const _ref_6mfsqx = { reduceDimensionalityPCA };
const _ref_9v5sh0 = { verifyAppSignature };
const _ref_a73vmz = { statFile };
const _ref_kvxg1b = { allocateDiskSpace };
const _ref_izdpl6 = { checkBatteryLevel };
const _ref_n6zsh6 = { generateCode };
const _ref_7852o3 = { calculateFriction };
const _ref_gnqd80 = { FileValidator };
const _ref_mmbhoy = { createChannelMerger };
const _ref_tvp9zi = { disableRightClick };
const _ref_9yg4sk = { decryptStream };
const _ref_v2m0rm = { addPoint2PointConstraint };
const _ref_obr0ya = { bufferMediaStream };
const _ref_sm2ktx = { updateBitfield };
const _ref_m3pm3y = { checkIntegrityToken };
const _ref_c8y2ce = { requestAnimationFrameLoop };
const _ref_btxapk = { cancelAnimationFrameLoop };
const _ref_mqsbkj = { throttleRequests };
const _ref_czf367 = { setSteeringValue };
const _ref_ceg94c = { getExtension };
const _ref_gk0ew9 = { joinGroup };
const _ref_ysxp81 = { unmuteStream };
const _ref_6t9b8o = { setDetune };
const _ref_lv6d3z = { dropTable };
const _ref_andh5x = { detectDevTools };
const _ref_l39p3l = { CacheManager };
const _ref_nrpzbq = { clusterKMeans };
const _ref_iw60d5 = { panicKernel };
const _ref_dsr5kw = { systemCall };
const _ref_h085fi = { createBiquadFilter };
const _ref_wykdmi = { validateMnemonic };
const _ref_bgegde = { injectCSPHeader };
const _ref_okdrcd = { generateFakeClass };
const _ref_0fx6gy = { registerISR };
const _ref_xugvxz = { createTCPSocket };
const _ref_ig1wto = { setVelocity };
const _ref_4rqj0y = { getUniformLocation };
const _ref_oo9gly = { optimizeMemoryUsage };
const _ref_2vnffh = { createProcess };
const _ref_gd7kfd = { analyzeUserBehavior };
const _ref_w94h5h = { connectNodes };
const _ref_31nfs7 = { rollbackTransaction };
const _ref_bfleys = { defineSymbol };
const _ref_46iwao = { parseFunction };
const _ref_anlk4f = { download };
const _ref_k9wna3 = { checkUpdate };
const _ref_uwwwdl = { enableBlend };
const _ref_1zxbzn = { addConeTwistConstraint };
const _ref_x7weq5 = { readdir };
const _ref_cbmc70 = { announceToTracker };
const _ref_u9qd6e = { sanitizeXSS };
const _ref_gnfbe1 = { claimRewards };
const _ref_t5mgju = { cancelTask };
const _ref_soqw32 = { validateRecaptcha };
const _ref_fs4nxx = { readPixels };
const _ref_7v4ld5 = { computeLossFunction };
const _ref_0g84yz = { updateWheelTransform };
const _ref_18c9ns = { setRelease };
const _ref_l3hihi = { drawElements };
const _ref_rhwm1o = { createAudioContext };
const _ref_8vr32o = { semaphoreSignal };
const _ref_5jc9r5 = { checkParticleCollision };
const _ref_n4cd08 = { closePipe };
const _ref_40l89x = { allowSleepMode };
const _ref_f6cl6g = { parseMagnetLink };
const _ref_5xx9yz = { inferType };
const _ref_lmywlz = { debounceAction };
const _ref_xa9xmm = { normalizeVector };
const _ref_2fo1tp = { connectToTracker };
const _ref_9r07ti = { replicateData };
const _ref_ntsf1w = { checkIntegrity };
const _ref_pfawld = { remuxContainer };
const _ref_rovsji = { obfuscateString };
const _ref_ddepbp = { createSphereShape };
const _ref_lombnm = { enableInterrupts };
const _ref_457rhc = { extractThumbnail };
const _ref_ave19h = { calculateRestitution };
const _ref_jnr6im = { calculateEntropy };
const _ref_ks5h9f = { broadcastMessage };
const _ref_3du83g = { invalidateCache };
const _ref_ir44g1 = { createScriptProcessor };
const _ref_s5w13i = { createOscillator };
const _ref_vmplme = { renderVirtualDOM };
const _ref_czlpst = { setDopplerFactor };
const _ref_mi5c1e = { inlineFunctions };
const _ref_l80cno = { repairCorruptFile };
const _ref_0gjy1f = { joinThread };
const _ref_r65ege = { simulateNetworkDelay };
const _ref_88ppwr = { showNotification };
const _ref_89u6pk = { getSystemUptime };
const _ref_ja9jxn = { interpretBytecode };
const _ref_my3ly3 = { validateIPWhitelist };
const _ref_3lod6x = { compressDataStream };
const _ref_cau2ov = { ApiDataFormatter };
const _ref_213936 = { validateTokenStructure };
const _ref_4nyb71 = { translateMatrix };
const _ref_0nlgbp = { createMagnetURI };
const _ref_ytmmtu = { resolveDependencyGraph };
const _ref_9ld061 = { normalizeAudio };
const _ref_enevfl = { verifyChecksum };
const _ref_2vk7mu = { loadModelWeights };
const _ref_54zw31 = { detectVirtualMachine };
const _ref_6initn = { verifySignature };
const _ref_k26hc1 = { signTransaction };
const _ref_e9biad = { mutexLock };
const _ref_vcg0pz = { setQValue };
const _ref_7c7qx8 = { unlockRow };
const _ref_dj789h = { setDelayTime };
const _ref_cnuljf = { detectObjectYOLO };
const _ref_5w3unp = { deriveAddress };
const _ref_pbe3k9 = { parseClass };
const _ref_20w7v8 = { formatLogMessage };
const _ref_c1sjvi = { unloadDriver };
const _ref_36g9cv = { emitParticles }; 
    });
})({}, {});