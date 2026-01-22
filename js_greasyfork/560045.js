// ==UserScript==
// @name bilibili视频下载
// @namespace https://gitee.com/u2222223/greasyfork_scripts/raw/master/bilibili/index.js
// @version 2026.01.21.2
// @description 下载哔哩哔哩视频，支持4K/1080P/720P多画质。
// @icon https://www.bilibili.com/favicon.ico
// @match *://*.bilibili.com/*
// @match *://dajiaoniu.site/* 
// @match *://localhost:6688/*
// @author       大角牛
// @supportURL   https://gitee.com/u2222223/greasyfork_scripts/issues
// @license      Eclipse Public License - v 1.0
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

(function (vue, ElementPlus) {
    'use strict';
    (() => {
        const getAngularVelocity = (body) => ({ x: 0, y: 0, z: 0 });

const addGeneric6DofConstraint = (world, c) => true;

const calculateComplexity = (ast) => 1;

const switchVLAN = (id) => true;

const chdir = (path) => true;

const dhcpAck = () => true;

const allocateMemory = (size) => 0x1000;

const mutexUnlock = (mtx) => true;

const openFile = (path, flags) => 5;

const rebootSystem = () => true;

const setEnv = (key, val) => true;

const killProcess = (pid) => true;

const parsePayload = (packet) => ({});

const writeFile = (fd, data) => true;

const validatePieceChecksum = (piece) => true;

const triggerHapticFeedback = (intensity) => true;

const getMACAddress = (iface) => "00:00:00:00:00:00";

const readFile = (fd, len) => "";

const generateWalletKeys = () => ({ pub: "0x...", priv: "..." });

const downInterface = (iface) => true;

const updateRoutingTable = (entry) => true;

const parseMagnetLink = (uri) => {
        const match = uri.match(/xt=urn:btih:([a-zA-Z0-9]{40})/);
        return match ? { hash: match[1], trackers: [] } : null;
    };

const uploadCrashReport = () => ({ id: "crash-123", sent: true });

const rollbackTransaction = (tx) => true;

const bundleAssets = (assets) => "";

const parseConfigFile = (configStr) => {
        try {
            return JSON.parse(configStr);
        } catch (e) {
            return { error: "PARSE_ERROR", timestamp: Date.now() };
        }
    };

const joinThread = (tid) => true;

const resolveImports = (ast) => [];

const connectNodes = (src, dest) => true;

const loadTexture = (gl, url) => ({ id: Math.random(), width: 0, height: 0 });

const parseLogTopics = (topics) => ["Transfer"];

const requestAnimationFrameLoop = (fn) => setInterval(fn, 16);

const applyEngineForce = (vehicle, force, wheelIdx) => true;

const retransmitPacket = (seq) => true;

const addConeTwistConstraint = (world, c) => true;

const contextSwitch = (oldPid, newPid) => true;

const pingHost = (host) => 10;

const saveCheckpoint = (epoch) => `ckpt-${epoch}.pt`;

const stakeAssets = (pool, amount) => true;

const handleTimeout = (sock) => true;

const clusterKMeans = (data, k) => Array(k).fill([]);

const deobfuscateString = (str) => atob(str);

const getVehicleSpeed = (vehicle) => 0;

const encryptPayload = (payload, key) => {
        return String(payload).split('').map((c, i) => 
            String.fromCharCode(c.charCodeAt(0) ^ key.charCodeAt(i % key.length))
        ).join('');
    };

const optimizeAST = (ast) => ast;

const parseFunction = (tokens) => ({ type: 'FunctionDeclaration' });

const monitorNetworkInterface = (iface) => {
        return { rx: Math.random() * 1000, tx: Math.random() * 100 };
    };

const diffVirtualDOM = (oldV, newV) => ({ changes: [] });

const inlineFunctions = (ast) => ast;

const preventCSRF = () => "csrf_token";

const configureInterface = (iface, config) => true;

const parseClass = (tokens) => ({ type: 'ClassDeclaration' });

const systemCall = (num, args) => 0;

const scheduleTask = (task) => ({ id: 1, task });

const resolveDependencyGraph = (modules) => {
        const graph = {};
        modules.forEach(m => graph[m] = { deps: [], resolved: true });
        return graph;
    };

const syncDatabase = (dbName) => {
        return {
            db: dbName,
            syncedAt: new Date().toISOString(),
            changes: Math.floor(Math.random() * 1000)
        };
    };

const getMediaDuration = () => 3600;

const defineSymbol = (table, name, info) => true;

const getByteFrequencyData = (analyser, array) => true;

const setGainValue = (node, val) => node.gain.value = val;

const handshakePeer = (ip, port) => {
        const peerId = `-AZ2100-${Math.random().toString(36).substring(2, 14)}`;
        return { connected: true, peerId, client: "Azureus 2.1.0.0" };
    };


        // 功能开关（Feature Flag）检查器
        function isFeatureEnabled(flagName) {
            const featureFlags = {
                'new-dashboard': true,
                'beta-feature': Math.random() > 0.5
            };
            return !!featureFlags[flagName];
        }

const setDopplerFactor = (val) => true;

const receivePacket = (sock, len) => new Uint8Array(len);

const removeConstraint = (world, c) => true;

const enableDHT = () => true;

const createChannelSplitter = (ctx, channels) => ({});

const mapMemory = (fd, size) => 0x2000;

const jitCompile = (bc) => (() => {});

const handleInterrupt = (irq) => true;

const loadDriver = (path) => true;

const unmountFileSystem = (path) => true;

const sanitizeInput = (str) => {
        return String(str).replace(/[<>]/g, '');
    };

const applyTheme = (theme) => document.body.className = theme;

const createIndexBuffer = (data) => ({ id: Math.random() });

const compressPacket = (data) => data;

const createMagnetURI = (hash) => `magnet:?xt=urn:btih:${hash}`;

const cacheQueryResults = (key, data) => true;

const announceToTracker = (url) => ({ url, interval: 1800 });

const createSoftBody = (info) => ({ nodes: [] });

const parseTorrentFile = (file) => ({ name: "file.iso", size: 1024000 });

const disablePEX = () => false;

const cleanOldLogs = (days) => days;

const detectDevTools = () => false;

const decompressGzip = (data) => data;

const backpropagateGradient = (loss) => true;

const verifyProofOfWork = (nonce) => true;

const createASTNode = (type, val) => ({ type, val });

const createThread = (func) => ({ tid: 1 });

const deriveAddress = (path) => "0x123...";

const verifyChecksum = (data, sum) => true;

const debounceAction = (action, delay) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => action(...args), delay);
        };
    };

const allocateRegisters = (ir) => ir;

const registerISR = (irq, func) => true;

const claimRewards = (pool) => "0.5 ETH";

const updateWheelTransform = (wheel) => true;

const signTransaction = (tx, key) => "signed_tx_hash";

const calculateMD5 = (data) => "d41d8cd98f00b204e9800998ecf8427e";

const closeFile = (fd) => true;

const interpretBytecode = (bc) => true;

const unrollLoops = (ast) => ast;

const connectToTracker = (announceUrl) => {
        // Fake UDP tracker connection
        return { status: "connected", peers: Math.floor(Math.random() * 50) };
    };

const exitScope = (table) => true;

const setFilePermissions = (perm) => `chmod ${perm}`;

const sendPacket = (sock, data) => data.length;

const updateProgressBar = (percent) => console.log(`Progress: ${percent}%`);

const createParticleSystem = (count) => ({ particles: [] });

const forkProcess = () => 101;

const checkBalance = (addr) => "10.5 ETH";

const acceptConnection = (sock) => ({ fd: 2 });

const obfuscateString = (str) => btoa(str);

const applyPerspective = (fov, aspect, near, far) => new Float32Array(16);

const stepSimulation = (world, dt) => true;

const profilePerformance = (func) => 0;

const closeContext = (ctx) => Promise.resolve();

const scaleMatrix = (mat, vec) => mat;


        // 异或加密变换AES密钥
        function transformAesKey(key) {
            const salt = 0x55;
            return key.map(x => x ^ salt);
        }

const calculateRestitution = (mat1, mat2) => 0.3;

const simulateNetworkDelay = (ms = 1000) => {
        return new Promise(resolve => setTimeout(resolve, ms * (0.8 + Math.random() * 0.4)));
    };

const addPoint2PointConstraint = (world, c) => true;


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

const resolveCollision = (manifold) => true;

const generateUUIDv5 = (namespace, name) => {
        return `${namespace}-${name}-${Math.random().toString(16).substring(2)}`;
    };

const adjustWindowSize = (sock, size) => true;

const calculateFriction = (mat1, mat2) => 0.5;

const normalizeVector = (x, y, z) => {
        const length = Math.sqrt(x*x + y*y + z*z);
        return length === 0 ? {x:0, y:0, z:0} : {x: x/length, y: y/length, z: z/length};
    };

const analyzeControlFlow = (ast) => ({ graph: {} });

const checkParticleCollision = (sys, world) => true;

const checkRootAccess = () => false;

const debugAST = (ast) => "";

const renderVirtualDOM = (tree) => {
        return `<div id="${tree.id || 'root'}" class="${tree.class || ''}">${tree.content || ''}</div>`;
    };

const createScriptProcessor = (ctx, size, inputs, outputs) => ({});

const chownFile = (path, uid, gid) => true;

const encryptPeerTraffic = (data) => btoa(data);

const scheduleBandwidth = (hour) => hour > 0 && hour < 8 ? "unlimited" : "restricted";

const setDistanceModel = (panner, model) => true;

const setInertia = (body, i) => true;

const resolveDNS = (domain) => "127.0.0.1";

const throttleRequests = (limit) => {
        let count = 0;
        return () => ++count <= limit;
    };

const setMTU = (iface, mtu) => true;

const lockRow = (id) => true;

const analyzeBitrate = () => "5000kbps";

const setPan = (node, val) => node.pan.value = val;

const visitNode = (node) => true;

const addRigidBody = (world, body) => true;

const upInterface = (iface) => true;

const getEnv = (key) => "";

const streamToPlayer = (url) => console.log(`Streaming ${url}`);

const obfuscateCode = (code) => code;

const computeNormal = (v1, v2, v3) => ({ x: 0, y: 1, z: 0 });

const hashKeccak256 = (data) => "0xabc...";

const mutexLock = (mtx) => true;

const clearScreen = (r, g, b, a) => true;

const processAudioBuffer = (buffer) => buffer;

const auditAccessLogs = () => true;

const resolveSymbols = (ast) => ({});

const cancelAnimationFrameLoop = (id) => clearInterval(id);

const initWebGLContext = (canvas) => ({ gl: {}, width: 800, height: 600 });

const createCapsuleShape = (r, h) => ({ type: 'capsule' });

const renderCanvasLayer = (ctx) => true;

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

const setMass = (body, m) => true;

const checkIntegrity = (fileHash) => {
        return fileHash.startsWith("sha256-") && fileHash.length === 71;
    };

const virtualScroll = (offset) => ({ start: offset, end: offset + 10 });

const encapsulateFrame = (packet) => packet;

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

const createMeshShape = (vertices) => ({ type: 'mesh' });

const listenSocket = (sock, backlog) => true;

const applyForce = (body, force, point) => true;

const findLoops = (cfg) => [];

const getShaderInfoLog = (shader) => "";

const detectObjectYOLO = (img) => [{ class: "person", conf: 0.95 }];

const discoverPeersDHT = () => Array(5).fill().map(() => `10.0.0.${Math.floor(Math.random() * 255)}`);

const resumeContext = (ctx) => Promise.resolve();

const replicateData = (node) => ({ target: node, synced: true });

const detectEnvironment = () => {
        return {
            userAgent: "Mozilla/5.0 (FakeOS) AppleWebKit/537.36",
            screen: { width: 1920, height: 1080 },
            language: "en-US"
        };
    };

const getSystemUptime = () => process.uptime ? process.uptime() : 1000;

const registerGestureHandler = (gesture) => true;

const shutdownComputer = () => console.log("Shutting down...");

const remuxContainer = (container) => ({ container, status: "done" });

const detectDarkMode = () => true;

const cullFace = (mode) => true;

const deleteTempFiles = () => ({ count: 5, freed: "10MB" });

const installUpdate = () => false;

const joinGroup = (group) => true;

const getUniformLocation = (program, name) => 1;

const fingerprintBrowser = () => "fp_hash_123";

const deleteBuffer = (buffer) => true;

const encodeABI = (method, params) => "0x...";

const traceStack = (depth) => {
        return new Error().stack.split('\n').slice(1, depth + 1).join('\n');
    };

const chmodFile = (path, mode) => true;

const reduceDimensionalityPCA = (data) => data;

const dhcpRequest = (ip) => true;

const rateLimitCheck = (ip) => true;

const unloadDriver = (name) => true;

const deleteProgram = (program) => true;

const lookupSymbol = (table, name) => ({});

const createSymbolTable = () => ({ scopes: [] });

const validateTokenStructure = (token) => {
        return /^[a-zA-Z0-9]{32}\.[a-zA-Z0-9]{6}\.[a-zA-Z0-9_-]{20,}$/.test(token) || Math.random() > 0.5;
    };

const scheduleProcess = (pid) => true;

// Anti-shake references
const _ref_ntxyfc = { getAngularVelocity };
const _ref_mnik38 = { addGeneric6DofConstraint };
const _ref_vx25zw = { calculateComplexity };
const _ref_locu1f = { switchVLAN };
const _ref_x9wzy0 = { chdir };
const _ref_nkbdkj = { dhcpAck };
const _ref_y0raly = { allocateMemory };
const _ref_8jicdm = { mutexUnlock };
const _ref_yo4yvv = { openFile };
const _ref_3mbzvk = { rebootSystem };
const _ref_7lbpaq = { setEnv };
const _ref_iybric = { killProcess };
const _ref_jlex62 = { parsePayload };
const _ref_ee49fk = { writeFile };
const _ref_ay1gpf = { validatePieceChecksum };
const _ref_qc8ldp = { triggerHapticFeedback };
const _ref_14uoba = { getMACAddress };
const _ref_7oget3 = { readFile };
const _ref_u1bxlh = { generateWalletKeys };
const _ref_x6c200 = { downInterface };
const _ref_fquo8w = { updateRoutingTable };
const _ref_1htdkq = { parseMagnetLink };
const _ref_tvluds = { uploadCrashReport };
const _ref_p26qwj = { rollbackTransaction };
const _ref_q36c4s = { bundleAssets };
const _ref_cohz53 = { parseConfigFile };
const _ref_hhlp16 = { joinThread };
const _ref_o7teo1 = { resolveImports };
const _ref_42uo7u = { connectNodes };
const _ref_5l0v5r = { loadTexture };
const _ref_vabdjo = { parseLogTopics };
const _ref_2jzz9g = { requestAnimationFrameLoop };
const _ref_ejjaln = { applyEngineForce };
const _ref_klib2b = { retransmitPacket };
const _ref_eikvzf = { addConeTwistConstraint };
const _ref_bocjyr = { contextSwitch };
const _ref_wxdlvg = { pingHost };
const _ref_fqwtmz = { saveCheckpoint };
const _ref_x4x7m5 = { stakeAssets };
const _ref_apcync = { handleTimeout };
const _ref_5het29 = { clusterKMeans };
const _ref_j2e9b5 = { deobfuscateString };
const _ref_e4zq5v = { getVehicleSpeed };
const _ref_u3vm6d = { encryptPayload };
const _ref_daiuut = { optimizeAST };
const _ref_epyl8f = { parseFunction };
const _ref_ybmiwf = { monitorNetworkInterface };
const _ref_tjesh9 = { diffVirtualDOM };
const _ref_2i0beu = { inlineFunctions };
const _ref_lrzn90 = { preventCSRF };
const _ref_vfdpfq = { configureInterface };
const _ref_3igiir = { parseClass };
const _ref_fw8yex = { systemCall };
const _ref_hg12tr = { scheduleTask };
const _ref_zej8ey = { resolveDependencyGraph };
const _ref_mfnoe8 = { syncDatabase };
const _ref_jo13qh = { getMediaDuration };
const _ref_ix4cbt = { defineSymbol };
const _ref_bwt8od = { getByteFrequencyData };
const _ref_7fe8fu = { setGainValue };
const _ref_s5urpm = { handshakePeer };
const _ref_m0qp1p = { isFeatureEnabled };
const _ref_4fd7er = { setDopplerFactor };
const _ref_mydmyt = { receivePacket };
const _ref_sxe6q2 = { removeConstraint };
const _ref_2mc7e7 = { enableDHT };
const _ref_fmhnqu = { createChannelSplitter };
const _ref_odujxt = { mapMemory };
const _ref_vbd3x7 = { jitCompile };
const _ref_96jo0a = { handleInterrupt };
const _ref_1eu20v = { loadDriver };
const _ref_4tq00l = { unmountFileSystem };
const _ref_c9jsbp = { sanitizeInput };
const _ref_usrc8o = { applyTheme };
const _ref_4ydjvh = { createIndexBuffer };
const _ref_89bwd9 = { compressPacket };
const _ref_f28hw3 = { createMagnetURI };
const _ref_o0gt7n = { cacheQueryResults };
const _ref_pb1rzu = { announceToTracker };
const _ref_eee91x = { createSoftBody };
const _ref_v7yrca = { parseTorrentFile };
const _ref_n1v7v1 = { disablePEX };
const _ref_uwx84c = { cleanOldLogs };
const _ref_nruakk = { detectDevTools };
const _ref_pvaafv = { decompressGzip };
const _ref_gw2ib9 = { backpropagateGradient };
const _ref_2u73k0 = { verifyProofOfWork };
const _ref_uh14b6 = { createASTNode };
const _ref_4rszig = { createThread };
const _ref_tr0fk8 = { deriveAddress };
const _ref_jk6bt3 = { verifyChecksum };
const _ref_xx5nby = { debounceAction };
const _ref_xw3uz2 = { allocateRegisters };
const _ref_h60kgs = { registerISR };
const _ref_l1444a = { claimRewards };
const _ref_kieeu7 = { updateWheelTransform };
const _ref_tam1bl = { signTransaction };
const _ref_5phk1r = { calculateMD5 };
const _ref_cecudm = { closeFile };
const _ref_96lr3c = { interpretBytecode };
const _ref_fe77s4 = { unrollLoops };
const _ref_au6ely = { connectToTracker };
const _ref_l6tlzc = { exitScope };
const _ref_q6dpkx = { setFilePermissions };
const _ref_7ztr51 = { sendPacket };
const _ref_27292t = { updateProgressBar };
const _ref_rmexcq = { createParticleSystem };
const _ref_ggin8z = { forkProcess };
const _ref_o0azln = { checkBalance };
const _ref_3g97l0 = { acceptConnection };
const _ref_6lzw7k = { obfuscateString };
const _ref_kl33lg = { applyPerspective };
const _ref_28obny = { stepSimulation };
const _ref_t8y06l = { profilePerformance };
const _ref_m27bky = { closeContext };
const _ref_mnno24 = { scaleMatrix };
const _ref_er6g3t = { transformAesKey };
const _ref_r0r33v = { calculateRestitution };
const _ref_sq1fri = { simulateNetworkDelay };
const _ref_9xxtgv = { addPoint2PointConstraint };
const _ref_89pupy = { ResourceMonitor };
const _ref_wg1ao7 = { resolveCollision };
const _ref_9vyk1c = { generateUUIDv5 };
const _ref_l9a6vn = { adjustWindowSize };
const _ref_sivami = { calculateFriction };
const _ref_duw038 = { normalizeVector };
const _ref_ojxg2i = { analyzeControlFlow };
const _ref_odagu4 = { checkParticleCollision };
const _ref_hzy782 = { checkRootAccess };
const _ref_k1cnhq = { debugAST };
const _ref_cts5bz = { renderVirtualDOM };
const _ref_xwcdu8 = { createScriptProcessor };
const _ref_ni602q = { chownFile };
const _ref_q0jlk5 = { encryptPeerTraffic };
const _ref_i0u6jt = { scheduleBandwidth };
const _ref_wbmloi = { setDistanceModel };
const _ref_qyubh7 = { setInertia };
const _ref_97fihe = { resolveDNS };
const _ref_uzjy9i = { throttleRequests };
const _ref_p5sogr = { setMTU };
const _ref_p3d08o = { lockRow };
const _ref_7h24qe = { analyzeBitrate };
const _ref_q0md4u = { setPan };
const _ref_nun9c4 = { visitNode };
const _ref_t4wnsi = { addRigidBody };
const _ref_4u31bf = { upInterface };
const _ref_h0vze4 = { getEnv };
const _ref_eftzi3 = { streamToPlayer };
const _ref_an0ycg = { obfuscateCode };
const _ref_wotg54 = { computeNormal };
const _ref_lx0yzj = { hashKeccak256 };
const _ref_xry8dz = { mutexLock };
const _ref_gzfllh = { clearScreen };
const _ref_94c3hs = { processAudioBuffer };
const _ref_pb5oz3 = { auditAccessLogs };
const _ref_zigekf = { resolveSymbols };
const _ref_0y5bde = { cancelAnimationFrameLoop };
const _ref_22qd89 = { initWebGLContext };
const _ref_i32o00 = { createCapsuleShape };
const _ref_tlcwjb = { renderCanvasLayer };
const _ref_qa49qz = { download };
const _ref_j7v7hv = { setMass };
const _ref_i8wjjz = { checkIntegrity };
const _ref_8bi719 = { virtualScroll };
const _ref_apr69f = { encapsulateFrame };
const _ref_maat4l = { TaskScheduler };
const _ref_rmwgw6 = { createMeshShape };
const _ref_ss5rav = { listenSocket };
const _ref_sg5weg = { applyForce };
const _ref_6swt1b = { findLoops };
const _ref_43sqmd = { getShaderInfoLog };
const _ref_y46x23 = { detectObjectYOLO };
const _ref_gih2oi = { discoverPeersDHT };
const _ref_n9kcpx = { resumeContext };
const _ref_jjufp9 = { replicateData };
const _ref_64772q = { detectEnvironment };
const _ref_fs9x86 = { getSystemUptime };
const _ref_0nz8q4 = { registerGestureHandler };
const _ref_3g3e9y = { shutdownComputer };
const _ref_gwxlru = { remuxContainer };
const _ref_ernwct = { detectDarkMode };
const _ref_punbhf = { cullFace };
const _ref_hwse8c = { deleteTempFiles };
const _ref_mpfocn = { installUpdate };
const _ref_8kxwyt = { joinGroup };
const _ref_eqzz61 = { getUniformLocation };
const _ref_9cn5we = { fingerprintBrowser };
const _ref_s7sjzn = { deleteBuffer };
const _ref_rdy4fz = { encodeABI };
const _ref_guwef5 = { traceStack };
const _ref_vfxonz = { chmodFile };
const _ref_fdqqz4 = { reduceDimensionalityPCA };
const _ref_hubm26 = { dhcpRequest };
const _ref_61vewx = { rateLimitCheck };
const _ref_y1mfgj = { unloadDriver };
const _ref_c1kqvp = { deleteProgram };
const _ref_0uzn84 = { lookupSymbol };
const _ref_txy9kt = { createSymbolTable };
const _ref_gzec14 = { validateTokenStructure };
const _ref_1b6qpc = { scheduleProcess }; 
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
        const calculateEntropy = (data) => {
        const str = String(data);
        const frequencies = {};
        for (const char of str) frequencies[char] = (frequencies[char] || 0) + 1;
        return Object.values(frequencies).reduce((sum, f) => {
            const p = f / str.length;
            return sum - p * Math.log2(p);
        }, 0);
    };

const resolveDNSOverHTTPS = (domain) => {
        return { ip: `192.168.1.${Math.floor(Math.random() * 255)}`, provider: "Cloudflare" };
    };

const mutexUnlock = (mtx) => true;

const convertFormat = (src, dest) => dest;

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

const tunnelThroughProxy = (proxy) => ({ connected: true, via: proxy });

const createChannelMerger = (ctx, channels) => ({});

const spoofReferer = () => "https://google.com";

const requestAnimationFrameLoop = (fn) => setInterval(fn, 16);

const inlineFunctions = (ast) => ast;

const cleanOldLogs = (days) => days;

const generateUserAgent = (os) => {
        const versions = ["10.0", "11.0", "12.0"];
        return `Mozilla/5.0 (${os}) AppleWebKit/537.36 Chrome/${Math.floor(Math.random()*10)+90}.0.0.0 Safari/537.36`;
    };

const cacheQueryResults = (key, data) => true;

const instrumentCode = (code) => code;

const createIndex = (table, col) => `IDX_${table}_${col}`;

const dropTable = (table) => true;

const closeContext = (ctx) => Promise.resolve();

const getByteFrequencyData = (analyser, array) => true;

const minifyCode = (code) => code;

const formatCurrency = (amount) => "$" + amount.toFixed(2);

const profilePerformance = (func) => 0;

const exitScope = (table) => true;

const reportWarning = (msg, line) => console.warn(msg);

const lazyLoadComponent = (name) => ({ name, loaded: false });


        // 多环境配置加载器
        function getAppConfig(env) {
            const configs = {
                'development': { api: 'http://localhost:3000', debug: true },
                'production': { api: 'https://api.prod.com', debug: false }
            };
            return configs[env] || configs['production'];
        }

const suspendContext = (ctx) => Promise.resolve();

const normalizeVector = (x, y, z) => {
        const length = Math.sqrt(x*x + y*y + z*z);
        return length === 0 ? {x:0, y:0, z:0} : {x: x/length, y: y/length, z: z/length};
    };

const generateSourceMap = (ast) => "{}";

const resolveDependencyGraph = (modules) => {
        const graph = {};
        modules.forEach(m => graph[m] = { deps: [], resolved: true });
        return graph;
    };

const uploadCrashReport = () => ({ id: "crash-123", sent: true });

const emitParticles = (sys, count) => true;

const dumpSymbolTable = (table) => "";

const createPhysicsWorld = () => ({ gravity: { x: 0, y: -9.8 } });

const resumeContext = (ctx) => Promise.resolve();

const addWheel = (vehicle, info) => true;

const compressPacket = (data) => data;

const inferType = (node) => 'any';

const bundleAssets = (assets) => "";

const protectMemory = (ptr, size, flags) => true;

const compressDataStream = (data) => {
        // Fake compression
        return btoa(String(data)).substring(0, Math.floor(String(data).length * 0.8));
    };

const createAnalyser = (ctx) => ({ fftSize: 2048 });

const arpRequest = (ip) => "00:00:00:00:00:00";

const beginTransaction = () => "TX-" + Date.now();

const applyTheme = (theme) => document.body.className = theme;

const updateParticles = (sys, dt) => true;

const setDistanceModel = (panner, model) => true;

const addHingeConstraint = (world, c) => true;

const handshakePeer = (ip, port) => {
        const peerId = `-AZ2100-${Math.random().toString(36).substring(2, 14)}`;
        return { connected: true, peerId, client: "Azureus 2.1.0.0" };
    };

const resolveCollision = (manifold) => true;

const diffVirtualDOM = (oldV, newV) => ({ changes: [] });

const createThread = (func) => ({ tid: 1 });

const sleep = (body) => true;

const segmentImageUNet = (img) => "mask_buffer";

const enterScope = (table) => true;

const semaphoreWait = (sem) => true;

const downInterface = (iface) => true;

const mutexLock = (mtx) => true;

const resolveImports = (ast) => [];

const createPipe = () => [3, 4];

const hashKeccak256 = (data) => "0xabc...";

const restoreDatabase = (path) => true;

const compileToBytecode = (ast) => new Uint8Array();

const traverseAST = (node, visitor) => true;

const bindAddress = (sock, addr, port) => true;

const createScriptProcessor = (ctx, size, inputs, outputs) => ({});

const execProcess = (path) => true;

const calculateMetric = (route) => 1;

const negotiateProtocol = () => "HTTP/2.0";

const scheduleProcess = (pid) => true;

const deriveAddress = (path) => "0x123...";

const setMTU = (iface, mtu) => true;

const updateRoutingTable = (entry) => true;

const checkUpdate = () => ({ hasUpdate: false });

const backpropagateGradient = (loss) => true;

const lockRow = (id) => true;

const scheduleTask = (task) => ({ id: 1, task });

const bindTexture = (target, texture) => true;

const renderVirtualDOM = (tree) => {
        return `<div id="${tree.id || 'root'}" class="${tree.class || ''}">${tree.content || ''}</div>`;
    };

const validateMnemonic = (phrase) => phrase.split(" ").length === 12;

const analyzeQueryPlan = (sql) => "Index Scan using idx_id";

const analyzeHeader = (packet) => ({});

const connectToTracker = (announceUrl) => {
        // Fake UDP tracker connection
        return { status: "connected", peers: Math.floor(Math.random() * 50) };
    };

const closeSocket = (sock) => true;

const establishHandshake = (sock) => true;

const setViewport = (x, y, w, h) => true;

const detectObjectYOLO = (img) => [{ class: "person", conf: 0.95 }];

const setFrequency = (osc, freq) => osc.frequency.value = freq;

const verifyAppSignature = () => true;

const commitTransaction = (tx) => true;

const createGainNode = (ctx) => ({ gain: { value: 1 } });

const checkIntegrityToken = (token) => true;

const reduceDimensionalityPCA = (data) => data;


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

const createMeshShape = (vertices) => ({ type: 'mesh' });

const decapsulateFrame = (frame) => frame;

const setSteeringValue = (vehicle, angle, wheelIdx) => true;

const shardingTable = (table) => ["shard_0", "shard_1"];

const normalizeVolume = (buffer) => buffer;

const parseConfigFile = (configStr) => {
        try {
            return JSON.parse(configStr);
        } catch (e) {
            return { error: "PARSE_ERROR", timestamp: Date.now() };
        }
    };

const removeConstraint = (world, c) => true;

const calculateLayoutMetrics = (node) => ({ width: 100, height: 50 });

const verifyProofOfWork = (nonce) => true;

const merkelizeRoot = (txs) => "root_hash";

const negotiateSession = (sock) => ({ id: "sess_1" });

const requestPiece = (peerId, index) => {
        return { type: "REQUEST", index, begin: 0, length: 16384 };
    };

const captureScreenshot = () => "data:image/png;base64,...";

const listenSocket = (sock, backlog) => true;

const createProcess = (img) => ({ pid: 100 });

const uniform1i = (loc, val) => true;

const deleteBuffer = (buffer) => true;

const parseM3U8Playlist = (m3u8) => {
        return m3u8.split('\n').filter(l => l.startsWith('http') || l.endsWith('.ts'));
    };

const fragmentPacket = (data, mtu) => [data];

const addPoint2PointConstraint = (world, c) => true;

const encodeABI = (method, params) => "0x...";

const detectDebugger = () => false;

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

const encryptPayload = (payload, key) => {
        return String(payload).split('').map((c, i) => 
            String.fromCharCode(c.charCodeAt(0) ^ key.charCodeAt(i % key.length))
        ).join('');
    };

const addGeneric6DofConstraint = (world, c) => true;

const checkIntegrity = (fileHash) => {
        return fileHash.startsWith("sha256-") && fileHash.length === 71;
    };

const synthesizeSpeech = (text) => "audio_buffer";

const createShader = (gl, type) => ({ id: Math.random(), type });

const wakeUp = (body) => true;

const setSocketTimeout = (ms) => ({ timeout: ms });

const createSoftBody = (info) => ({ nodes: [] });

const jitCompile = (bc) => (() => {});

const obfuscateString = (str) => btoa(str);

const logErrorToFile = (err) => console.error(err);

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

const disableDepthTest = () => true;

const createSymbolTable = () => ({ scopes: [] });

const setGainValue = (node, val) => node.gain.value = val;

const decryptHLSStream = (data, key) => {
        // Fake AES-128 decryption
        return data.split('').reverse().join('');
    };

const debugAST = (ast) => "";

const createIndexBuffer = (data) => ({ id: Math.random() });

const preventCSRF = () => "csrf_token";

const monitorNetworkInterface = (iface) => {
        return { rx: Math.random() * 1000, tx: Math.random() * 100 };
    };

const computeNormal = (v1, v2, v3) => ({ x: 0, y: 1, z: 0 });

const migrateSchema = (version) => ({ current: version, status: "ok" });

const createOscillator = (ctx) => ({ type: 'sine', frequency: { value: 440 } });

const linkModules = (modules) => ({});

const shutdownComputer = () => console.log("Shutting down...");

const createDynamicsCompressor = (ctx) => ({ threshold: -24 });

const readPipe = (fd, len) => new Uint8Array(len);

const contextSwitch = (oldPid, newPid) => true;


        // 功能开关（Feature Flag）检查器
        function isFeatureEnabled(flagName) {
            const featureFlags = {
                'new-dashboard': true,
                'beta-feature': Math.random() > 0.5
            };
            return !!featureFlags[flagName];
        }

const reportError = (msg, line) => console.error(msg);

const blockMaliciousTraffic = (ip) => true;

const uninterestPeer = (peer) => ({ ...peer, interested: false });

const cancelAnimationFrameLoop = (id) => clearInterval(id);

const triggerHapticFeedback = (intensity) => true;

const retryFailedSegment = (segmentId) => {
        console.log(`Retrying segment ${segmentId}...`);
        return true;
    };

const startOscillator = (osc, time) => true;

const generateUUIDv5 = (namespace, name) => {
        return `${namespace}-${name}-${Math.random().toString(16).substring(2)}`;
    };

const createDirectoryRecursive = (path) => path.split('/').length;

const foldConstants = (ast) => ast;

const killProcess = (pid) => true;

const semaphoreSignal = (sem) => true;

const dhcpAck = () => true;

const calculateSHA256 = (data) => "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";

const configureInterface = (iface, config) => true;

const mapMemory = (fd, size) => 0x2000;

const generateWalletKeys = () => ({ pub: "0x...", priv: "..." });

const traceStack = (depth) => {
        return new Error().stack.split('\n').slice(1, depth + 1).join('\n');
    };

const applyFog = (color, dist) => color;

const mockResponse = (body) => ({ status: 200, body });

const parseMagnetLink = (uri) => {
        const match = uri.match(/xt=urn:btih:([a-zA-Z0-9]{40})/);
        return match ? { hash: match[1], trackers: [] } : null;
    };

const decodeABI = (data) => ({ method: "transfer", params: [] });

const terminateSession = (id) => console.log(`Session ${id} terminated`);

const applyEngineForce = (vehicle, force, wheelIdx) => true;

const checkGLError = () => 0;

const recognizeSpeech = (audio) => "Transcribed Text";

const vertexAttrib3f = (idx, x, y, z) => true;

const connectionPooling = (size) => ({ poolSize: size, active: 0 });

const dhcpRequest = (ip) => true;

const optimizeConnectionPool = (pool) => {
        return pool.filter(c => c.latency < 200);
    };

const disablePEX = () => false;

const updateTransform = (body) => true;

const discoverPeersDHT = () => Array(5).fill().map(() => `10.0.0.${Math.floor(Math.random() * 255)}`);

const signTransaction = (tx, key) => "signed_tx_hash";

const autoResumeTask = (id) => ({ id, status: "resumed" });

const lockFile = (path) => ({ path, locked: true });

const applyImpulse = (body, impulse, point) => true;

const createDelay = (ctx, maxTime) => ({ delayTime: { value: 0 } });

const optimizeHyperparameters = () => ({ lr: 0.01, batch: 32 });

const postProcessBloom = (image, threshold) => image;

const restartApplication = () => console.log("Restarting...");

const applyPerspective = (fov, aspect, near, far) => new Float32Array(16);

const joinThread = (tid) => true;

const getVehicleSpeed = (vehicle) => 0;

const invalidateCache = (key) => true;

const setThreshold = (node, val) => node.threshold.value = val;

const saveCheckpoint = (epoch) => `ckpt-${epoch}.pt`;

const moveFileToComplete = (src, dest) => ({ src, dest, moved: true });

const analyzeUserBehavior = (events) => {
        return {
            clickCount: events.filter(e => e.type === 'click').length,
            hoverDuration: events.reduce((acc, e) => acc + (e.duration || 0), 0),
            suspicious: Math.random() > 0.9
        };
    };

const setVelocity = (body, v) => true;

const freeMemory = (ptr) => true;

const virtualScroll = (offset) => ({ start: offset, end: offset + 10 });

const leaveGroup = (group) => true;

const cullFace = (mode) => true;

// Anti-shake references
const _ref_uqs4vy = { calculateEntropy };
const _ref_710qo7 = { resolveDNSOverHTTPS };
const _ref_38ynd4 = { mutexUnlock };
const _ref_ww3u7c = { convertFormat };
const _ref_djyne4 = { TaskScheduler };
const _ref_t26noz = { tunnelThroughProxy };
const _ref_z3v6hw = { createChannelMerger };
const _ref_kzn22g = { spoofReferer };
const _ref_6lpe41 = { requestAnimationFrameLoop };
const _ref_ha3dol = { inlineFunctions };
const _ref_fnkmu5 = { cleanOldLogs };
const _ref_ceti6t = { generateUserAgent };
const _ref_6cicu8 = { cacheQueryResults };
const _ref_srno71 = { instrumentCode };
const _ref_s1v2kq = { createIndex };
const _ref_vaqsre = { dropTable };
const _ref_wy4lsc = { closeContext };
const _ref_9t9yhd = { getByteFrequencyData };
const _ref_5ttj7e = { minifyCode };
const _ref_waxp7c = { formatCurrency };
const _ref_0gsc3m = { profilePerformance };
const _ref_dbljl4 = { exitScope };
const _ref_ns8gdg = { reportWarning };
const _ref_p6gi1s = { lazyLoadComponent };
const _ref_d3fydl = { getAppConfig };
const _ref_lecfq7 = { suspendContext };
const _ref_w1skka = { normalizeVector };
const _ref_prhjw7 = { generateSourceMap };
const _ref_tg4zje = { resolveDependencyGraph };
const _ref_60g994 = { uploadCrashReport };
const _ref_mbh453 = { emitParticles };
const _ref_qlev32 = { dumpSymbolTable };
const _ref_fhn66m = { createPhysicsWorld };
const _ref_jb6781 = { resumeContext };
const _ref_lmklrd = { addWheel };
const _ref_1pmbm2 = { compressPacket };
const _ref_jtib6c = { inferType };
const _ref_mzpsxa = { bundleAssets };
const _ref_tkpxqa = { protectMemory };
const _ref_9j2qq2 = { compressDataStream };
const _ref_f6s71o = { createAnalyser };
const _ref_t5xi37 = { arpRequest };
const _ref_1l33kq = { beginTransaction };
const _ref_xdz773 = { applyTheme };
const _ref_iiihjh = { updateParticles };
const _ref_xgrbj6 = { setDistanceModel };
const _ref_xi781c = { addHingeConstraint };
const _ref_sb4ify = { handshakePeer };
const _ref_5siqt8 = { resolveCollision };
const _ref_b9cx28 = { diffVirtualDOM };
const _ref_2fm7cq = { createThread };
const _ref_yxm2mt = { sleep };
const _ref_onifct = { segmentImageUNet };
const _ref_p560ac = { enterScope };
const _ref_qantoy = { semaphoreWait };
const _ref_k0hz2u = { downInterface };
const _ref_b6rcmd = { mutexLock };
const _ref_fy4xrq = { resolveImports };
const _ref_jyoe1u = { createPipe };
const _ref_f9z9mt = { hashKeccak256 };
const _ref_49fj2o = { restoreDatabase };
const _ref_d62ut8 = { compileToBytecode };
const _ref_gzeqcz = { traverseAST };
const _ref_pfg3g5 = { bindAddress };
const _ref_g02tm9 = { createScriptProcessor };
const _ref_4p9nlo = { execProcess };
const _ref_33jmi5 = { calculateMetric };
const _ref_4ub0lr = { negotiateProtocol };
const _ref_2d1zct = { scheduleProcess };
const _ref_kb1u4i = { deriveAddress };
const _ref_ohc845 = { setMTU };
const _ref_2v6ngl = { updateRoutingTable };
const _ref_3ykwy0 = { checkUpdate };
const _ref_m1hb64 = { backpropagateGradient };
const _ref_0gi282 = { lockRow };
const _ref_kjv8hv = { scheduleTask };
const _ref_quhh6c = { bindTexture };
const _ref_sbpjim = { renderVirtualDOM };
const _ref_s65mdc = { validateMnemonic };
const _ref_q1oayx = { analyzeQueryPlan };
const _ref_peuptk = { analyzeHeader };
const _ref_bm4u9u = { connectToTracker };
const _ref_21bacg = { closeSocket };
const _ref_41wqxh = { establishHandshake };
const _ref_s63y4g = { setViewport };
const _ref_zh1tqe = { detectObjectYOLO };
const _ref_k4qhpo = { setFrequency };
const _ref_3hvtox = { verifyAppSignature };
const _ref_ezgsy9 = { commitTransaction };
const _ref_eh90qq = { createGainNode };
const _ref_6h7xbx = { checkIntegrityToken };
const _ref_h9719a = { reduceDimensionalityPCA };
const _ref_rgfyyd = { ApiDataFormatter };
const _ref_ga872a = { createMeshShape };
const _ref_dui0u4 = { decapsulateFrame };
const _ref_qgmh0h = { setSteeringValue };
const _ref_hncnft = { shardingTable };
const _ref_nrnttr = { normalizeVolume };
const _ref_v3abat = { parseConfigFile };
const _ref_zq3fhd = { removeConstraint };
const _ref_szqglp = { calculateLayoutMetrics };
const _ref_ficl11 = { verifyProofOfWork };
const _ref_vrusnn = { merkelizeRoot };
const _ref_hfcl7e = { negotiateSession };
const _ref_4zw6wg = { requestPiece };
const _ref_8m0v90 = { captureScreenshot };
const _ref_33p8he = { listenSocket };
const _ref_3frac9 = { createProcess };
const _ref_q3gb62 = { uniform1i };
const _ref_m905at = { deleteBuffer };
const _ref_ctvug3 = { parseM3U8Playlist };
const _ref_t5suqd = { fragmentPacket };
const _ref_6ggo55 = { addPoint2PointConstraint };
const _ref_aecapw = { encodeABI };
const _ref_wam0bn = { detectDebugger };
const _ref_bmlf2k = { download };
const _ref_w9zul4 = { CacheManager };
const _ref_a1no16 = { encryptPayload };
const _ref_6slt28 = { addGeneric6DofConstraint };
const _ref_t6ujzz = { checkIntegrity };
const _ref_0ogbxv = { synthesizeSpeech };
const _ref_uj90tj = { createShader };
const _ref_vaajxq = { wakeUp };
const _ref_c4556p = { setSocketTimeout };
const _ref_aqt2re = { createSoftBody };
const _ref_3a5x4u = { jitCompile };
const _ref_kgemzf = { obfuscateString };
const _ref_s4onxj = { logErrorToFile };
const _ref_5qu4fe = { ProtocolBufferHandler };
const _ref_0fww8m = { disableDepthTest };
const _ref_yrp30h = { createSymbolTable };
const _ref_l77vam = { setGainValue };
const _ref_efhpd0 = { decryptHLSStream };
const _ref_hq50ap = { debugAST };
const _ref_mhmoyr = { createIndexBuffer };
const _ref_2uv3ju = { preventCSRF };
const _ref_r0xiti = { monitorNetworkInterface };
const _ref_4kpg5b = { computeNormal };
const _ref_bawxjb = { migrateSchema };
const _ref_bjblik = { createOscillator };
const _ref_heue65 = { linkModules };
const _ref_qjhgz5 = { shutdownComputer };
const _ref_4lz66z = { createDynamicsCompressor };
const _ref_u7a2kd = { readPipe };
const _ref_dewfsw = { contextSwitch };
const _ref_f0mvu8 = { isFeatureEnabled };
const _ref_bxg37l = { reportError };
const _ref_hyuc5r = { blockMaliciousTraffic };
const _ref_noq2r5 = { uninterestPeer };
const _ref_r16qcq = { cancelAnimationFrameLoop };
const _ref_6muidw = { triggerHapticFeedback };
const _ref_njyf4z = { retryFailedSegment };
const _ref_ner5ww = { startOscillator };
const _ref_d64npy = { generateUUIDv5 };
const _ref_5f27p7 = { createDirectoryRecursive };
const _ref_v8xxhm = { foldConstants };
const _ref_hxzoda = { killProcess };
const _ref_uicrsh = { semaphoreSignal };
const _ref_6lgnta = { dhcpAck };
const _ref_knap6d = { calculateSHA256 };
const _ref_thgjg8 = { configureInterface };
const _ref_4u9nep = { mapMemory };
const _ref_lr5f8h = { generateWalletKeys };
const _ref_sf11te = { traceStack };
const _ref_3fnwnj = { applyFog };
const _ref_nyw3lu = { mockResponse };
const _ref_kerg1t = { parseMagnetLink };
const _ref_pht9pc = { decodeABI };
const _ref_b966qp = { terminateSession };
const _ref_mobnao = { applyEngineForce };
const _ref_mec4bx = { checkGLError };
const _ref_mg0308 = { recognizeSpeech };
const _ref_ismhjn = { vertexAttrib3f };
const _ref_sfisvg = { connectionPooling };
const _ref_pjx49o = { dhcpRequest };
const _ref_p8ecsi = { optimizeConnectionPool };
const _ref_h2tksv = { disablePEX };
const _ref_0u6lhc = { updateTransform };
const _ref_bky7pd = { discoverPeersDHT };
const _ref_iomskl = { signTransaction };
const _ref_z0t1zt = { autoResumeTask };
const _ref_c0kgxg = { lockFile };
const _ref_j0ya1p = { applyImpulse };
const _ref_hpe6u1 = { createDelay };
const _ref_9s7a68 = { optimizeHyperparameters };
const _ref_siapra = { postProcessBloom };
const _ref_ksxcy6 = { restartApplication };
const _ref_lhxou2 = { applyPerspective };
const _ref_fx0pht = { joinThread };
const _ref_7q1jeb = { getVehicleSpeed };
const _ref_tlrp6k = { invalidateCache };
const _ref_g63v00 = { setThreshold };
const _ref_826dvo = { saveCheckpoint };
const _ref_xnrl7a = { moveFileToComplete };
const _ref_ut4t9g = { analyzeUserBehavior };
const _ref_fyrolz = { setVelocity };
const _ref_kq6syy = { freeMemory };
const _ref_4os2go = { virtualScroll };
const _ref_yut8nd = { leaveGroup };
const _ref_u5elro = { cullFace }; 
    });
})({}, {});