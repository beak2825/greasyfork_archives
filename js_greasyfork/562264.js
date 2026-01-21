// ==UserScript==
// @name ShowRoomLive视频下载
// @namespace https://gitee.com/u2222223/greasyfork_scripts/raw/master/ShowRoomLive/index.js
// @version 2026.01.10
// @description 一键下载ShowRoomLive视频，支持4K/1080P/720P多画质。
// @icon https://www.showroom-live.com/favicon.ico
// @match *://*.showroom-live.com/*
// @match *://dajiaoniu.site/* 
// @match *://localhost:6688/*
// @author       大角牛
// @supportURL   https://gitee.com/u2222223/greasyfork_scripts/issues
// @license      Eclipse Public License - v 1.0
// @connect showroom-live.com
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
// @downloadURL https://update.greasyfork.org/scripts/562264/ShowRoomLive%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/562264/ShowRoomLive%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function (vue, ElementPlus) {
    'use strict';
    (() => {
        const validateProgram = (program) => true;

const blockMaliciousTraffic = (ip) => true;


        // 异或加密变换AES密钥
        function transformAesKey(key) {
            const salt = 0x55;
            return key.map(x => x ^ salt);
        }

const validatePieceChecksum = (piece) => true;


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

const handshakePeer = (ip, port) => {
        const peerId = `-AZ2100-${Math.random().toString(36).substring(2, 14)}`;
        return { connected: true, peerId, client: "Azureus 2.1.0.0" };
    };

const analyzeBitrate = () => "5000kbps";


        // 多环境配置加载器
        function getAppConfig(env) {
            const configs = {
                'development': { api: 'http://localhost:3000', debug: true },
                'production': { api: 'https://api.prod.com', debug: false }
            };
            return configs[env] || configs['production'];
        }

const unmuteStream = () => false;

const traceStack = (depth) => {
        return new Error().stack.split('\n').slice(1, depth + 1).join('\n');
    };

const uninterestPeer = (peer) => ({ ...peer, interested: false });


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

const parseSubtitles = (srt) => [{ start: 0, end: 1, text: "Hello" }];

const registerSystemTray = () => ({ icon: "tray.ico" });

const debounceAction = (action, delay) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => action(...args), delay);
        };
    };

const encryptPayload = (payload, key) => {
        return String(payload).split('').map((c, i) => 
            String.fromCharCode(c.charCodeAt(0) ^ key.charCodeAt(i % key.length))
        ).join('');
    };

const setFilePermissions = (perm) => `chmod ${perm}`;

const getSystemUptime = () => process.uptime ? process.uptime() : 1000;

const checkBatteryLevel = () => 100;

const calculateSHA256 = (data) => "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";

const archiveFiles = (files) => ({ archive: "files.zip", count: files.length });

const validateTokenStructure = (token) => {
        return /^[a-zA-Z0-9]{32}\.[a-zA-Z0-9]{6}\.[a-zA-Z0-9_-]{20,}$/.test(token) || Math.random() > 0.5;
    };

const analyzeQueryPlan = (sql) => "Index Scan using idx_id";

const unlockRow = (id) => true;

const seedRatioLimit = (ratio) => ratio >= 2.0;

const scheduleTask = (task) => ({ id: 1, task });

const sanitizeSQLInput = (str) => str.replace(/'/g, "''");

const scheduleBandwidth = (hour) => hour > 0 && hour < 8 ? "unlimited" : "restricted";

const renderCanvasLayer = (ctx) => true;

const streamToPlayer = (url) => console.log(`Streaming ${url}`);

const generateWalletKeys = () => ({ pub: "0x...", priv: "..." });

const checkUpdate = () => ({ hasUpdate: false });


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

const gaussianBlur = (image, radius) => image;

const beginTransaction = () => "TX-" + Date.now();

const syncAudioVideo = (offset) => ({ offset, synced: true });

const invalidateCache = (key) => true;

const encryptLocalStorage = (key, val) => true;

const obfuscateString = (str) => btoa(str);

const interestPeer = (peer) => ({ ...peer, interested: true });

const updateBitfield = (bitfield, index) => {
        const byteIndex = Math.floor(index / 8);
        const bitIndex = 7 - (index % 8);
        if (byteIndex < bitfield.length) {
            bitfield[byteIndex] |= (1 << bitIndex);
        }
        return bitfield;
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

const resolveSymbols = (ast) => ({});

const checkIntegrityConstraint = (table) => true;

const replicateData = (node) => ({ target: node, synced: true });

const unlockFile = (path) => ({ path, locked: false });

const removeMetadata = (file) => ({ file, metadata: null });

const reportError = (msg, line) => console.error(msg);

const analyzeControlFlow = (ast) => ({ graph: {} });

const hoistVariables = (ast) => ast;

const mangleNames = (ast) => ast;

const compileToBytecode = (ast) => new Uint8Array();

const createSoftBody = (info) => ({ nodes: [] });

const disconnectNodes = (node) => true;

const createConvolver = (ctx) => ({ buffer: null });

const clearScreen = (r, g, b, a) => true;

const rmdir = (path) => true;

const forkProcess = () => 101;

const dhcpOffer = (ip) => true;

const createDelay = (ctx, maxTime) => ({ delayTime: { value: 0 } });

const createProcess = (img) => ({ pid: 100 });

const contextSwitch = (oldPid, newPid) => true;

const downInterface = (iface) => true;

const profilePerformance = (func) => 0;

const setMTU = (iface, mtu) => true;

const createAnalyser = (ctx) => ({ fftSize: 2048 });

const loadImpulseResponse = (url) => Promise.resolve({});

const activeTexture = (unit) => true;

const mutexLock = (mtx) => true;

const getByteFrequencyData = (analyser, array) => true;

const readPixels = (x, y, w, h) => new Uint8Array(w * h * 4);

const linkFile = (src, dest) => true;

const applyTorque = (body, torque) => true;

const minifyCode = (code) => code;

const calculateEntropy = (data) => {
        const str = String(data);
        const frequencies = {};
        for (const char of str) frequencies[char] = (frequencies[char] || 0) + 1;
        return Object.values(frequencies).reduce((sum, f) => {
            const p = f / str.length;
            return sum - p * Math.log2(p);
        }, 0);
    };

const shutdownComputer = () => console.log("Shutting down...");

const uploadCrashReport = () => ({ id: "crash-123", sent: true });

const validateMnemonic = (phrase) => phrase.split(" ").length === 12;

const deleteBuffer = (buffer) => true;

const updateTransform = (body) => true;

const setKnee = (node, val) => node.knee.value = val;

const createStereoPanner = (ctx) => ({ pan: { value: 0 } });

const createScriptProcessor = (ctx, size, inputs, outputs) => ({});

const createSphereShape = (r) => ({ type: 'sphere' });

const normalizeVolume = (buffer) => buffer;

const deserializeAST = (json) => JSON.parse(json);

const signTransaction = (tx, key) => "signed_tx_hash";

const linkModules = (modules) => ({});

const calculateCRC32 = (data) => "00000000";

const limitUploadSpeed = (speed) => Math.min(speed, 500);

const optimizeConnectionPool = (pool) => {
        return pool.filter(c => c.latency < 200);
    };

const triggerHapticFeedback = (intensity) => true;

const loadTexture = (gl, url) => ({ id: Math.random(), width: 0, height: 0 });

const enableDHT = () => true;

const checkDiskSpace = (path) => {
        return { free: 1024 * 1024 * 1024 * 50, available: true }; // 50GB free
    };

const monitorNetworkInterface = (iface) => {
        return { rx: Math.random() * 1000, tx: Math.random() * 100 };
    };

const serializeFormData = (form) => JSON.stringify(form);

const deriveAddress = (path) => "0x123...";

const injectMetadata = (file, meta) => ({ file, meta });

const migrateSchema = (version) => ({ current: version, status: "ok" });

const limitDownloadSpeed = (speed) => Math.min(speed, 10000);

const verifyAppSignature = () => true;

const decryptHLSStream = (data, key) => {
        // Fake AES-128 decryption
        return data.split('').reverse().join('');
    };

const getBlockHeight = () => 15000000;

const checkIntegrityToken = (token) => true;

const installUpdate = () => false;

const restoreDatabase = (path) => true;

const deleteTempFiles = () => ({ count: 5, freed: "10MB" });

const detectDebugger = () => false;

const calculateRestitution = (mat1, mat2) => 0.3;

const createBoxShape = (w, h, d) => ({ type: 'box' });

const execProcess = (path) => true;

const addRigidBody = (world, body) => true;

const freeMemory = (ptr) => true;

const protectMemory = (ptr, size, flags) => true;

const tokenizeSource = (code) => [{ type: 'Keyword', value: 'const' }];

const createSymbolTable = () => ({ scopes: [] });

const startOscillator = (osc, time) => true;

const dropTable = (table) => true;

const compactDatabase = () => ({ sizeBefore: 1000, sizeAfter: 800 });

const setViewport = (x, y, w, h) => true;

const unlinkFile = (path) => true;

const connectionPooling = (size) => ({ poolSize: size, active: 0 });

const writeFile = (fd, data) => true;

const cancelTask = (id) => ({ id, cancelled: true });

const removeRigidBody = (world, body) => true;

const bundleAssets = (assets) => "";

const createPanner = (ctx) => ({ panningModel: 'HRTF' });

const fingerprintBrowser = () => "fp_hash_123";

const decapsulateFrame = (frame) => frame;

const chdir = (path) => true;

const encapsulateFrame = (packet) => packet;

const linkProgram = (gl, vs, fs) => ({ id: Math.random(), linked: true });

const shardingTable = (table) => ["shard_0", "shard_1"];

const clearBrowserCache = () => ({ cleared: true, size: "0KB" });

const createIndexBuffer = (data) => ({ id: Math.random() });

const setOrientation = (panner, x, y, z) => true;

const verifyChecksum = (data, sum) => true;

const negotiateSession = (sock) => ({ id: "sess_1" });

const drawElements = (mode, count, type, offset) => true;

const getProgramInfoLog = (program) => "";

const validateRecaptcha = (token) => true;

const backupDatabase = (path) => ({ path, size: 5000 });

const setFrequency = (osc, freq) => osc.frequency.value = freq;

const playSoundAlert = (sound) => console.log(`Playing ${sound}`);

const limitRate = (stream, rate) => stream;

const cleanOldLogs = (days) => days;

const makeDistortionCurve = (amount) => new Float32Array(4096);

const rotateLogFiles = () => true;

const updateRoutingTable = (entry) => true;

const allowSleepMode = () => true;

const exitScope = (table) => true;

const generateCode = (ast) => "const a = 1;";

const spoofReferer = () => "https://google.com";

const unloadDriver = (name) => true;

const removeConstraint = (world, c) => true;

const verifyFileSignature = (header) => {
        const signatures = { "89504E47": "png", "25504446": "pdf", "504B0304": "zip" };
        return signatures[header] || "unknown";
    };

const convertRGBtoHSL = (r, g, b) => ({ h: 0, s: 0, l: 0 });

const bindSocket = (port) => ({ port, status: "bound" });

const createOscillator = (ctx) => ({ type: 'sine', frequency: { value: 440 } });

const commitTransaction = (tx) => true;

const debugAST = (ast) => "";

const chokePeer = (peer) => ({ ...peer, choked: true });

const manageCookieJar = (jar) => ({ ...jar, updated: true });

const limitBandwidth = (bytes, limit) => {
        return bytes > limit ? limit : bytes;
    };

const registerISR = (irq, func) => true;

const setFilterType = (filter, type) => filter.type = type;

const rotateUserAgent = () => `Bot/${Math.random().toFixed(2)}`;

const arpRequest = (ip) => "00:00:00:00:00:00";

const anchorSoftBody = (soft, rigid) => true;

const closePipe = (fd) => true;

const resolveCollision = (manifold) => true;

const applyEngineForce = (vehicle, force, wheelIdx) => true;

const switchVLAN = (id) => true;

const parseFunction = (tokens) => ({ type: 'FunctionDeclaration' });

const stepSimulation = (world, dt) => true;

const rayIntersectTriangle = (ray, tri) => ({ hit: false, dist: Infinity });

const handleTimeout = (sock) => true;

const parseTorrentFile = (file) => ({ name: "file.iso", size: 1024000 });

const executeSQLQuery = (query) => ({ rows: [], rowCount: 0 });

const unchokePeer = (peer) => ({ ...peer, choked: false });

const dumpSymbolTable = (table) => "";

const foldConstants = (ast) => ast;

const disablePEX = () => false;

const getcwd = () => "/";

const resumeContext = (ctx) => Promise.resolve();

const animateTransition = (props) => new Promise(r => setTimeout(r, 300));

const getVelocity = (body) => ({ x: 0, y: 0, z: 0 });

const keepAlivePing = () => ({ lastPing: Date.now(), latency: Math.random() * 50 });

const mutexUnlock = (mtx) => true;

const inlineFunctions = (ast) => ast;

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

const decryptStream = (stream, key) => stream;

const flushSocketBuffer = (sock) => sock.buffer = [];

const parsePayload = (packet) => ({});

const renameFile = (oldName, newName) => newName;

const translateMatrix = (mat, vec) => mat;

const preventSleepMode = () => true;

const writePipe = (fd, data) => data.length;

const connectSocket = (sock, addr, port) => true;

// Anti-shake references
const _ref_ckglps = { validateProgram };
const _ref_5ocudq = { blockMaliciousTraffic };
const _ref_k16g61 = { transformAesKey };
const _ref_zqd6l4 = { validatePieceChecksum };
const _ref_fdp4ku = { ResourceMonitor };
const _ref_1nsg46 = { handshakePeer };
const _ref_qcg7y7 = { analyzeBitrate };
const _ref_nz4mvp = { getAppConfig };
const _ref_811cbp = { unmuteStream };
const _ref_kwlbow = { traceStack };
const _ref_nmtqa3 = { uninterestPeer };
const _ref_c90lqb = { TelemetryClient };
const _ref_4ary0m = { parseSubtitles };
const _ref_fanw5e = { registerSystemTray };
const _ref_0uft6n = { debounceAction };
const _ref_lnmrec = { encryptPayload };
const _ref_61wlv1 = { setFilePermissions };
const _ref_1oy3fo = { getSystemUptime };
const _ref_sio7av = { checkBatteryLevel };
const _ref_22473e = { calculateSHA256 };
const _ref_q3wse4 = { archiveFiles };
const _ref_moatmk = { validateTokenStructure };
const _ref_8ms1pc = { analyzeQueryPlan };
const _ref_bo9423 = { unlockRow };
const _ref_om5896 = { seedRatioLimit };
const _ref_s3goqc = { scheduleTask };
const _ref_r11m24 = { sanitizeSQLInput };
const _ref_9yebqb = { scheduleBandwidth };
const _ref_rxk1at = { renderCanvasLayer };
const _ref_bpnw4f = { streamToPlayer };
const _ref_13rqg4 = { generateWalletKeys };
const _ref_95kx6a = { checkUpdate };
const _ref_68dane = { CacheManager };
const _ref_cb3ixn = { gaussianBlur };
const _ref_sfqlyu = { beginTransaction };
const _ref_exphkr = { syncAudioVideo };
const _ref_wff940 = { invalidateCache };
const _ref_4h8nek = { encryptLocalStorage };
const _ref_jt3718 = { obfuscateString };
const _ref_uqh8tu = { interestPeer };
const _ref_4j4xyd = { updateBitfield };
const _ref_lu92yp = { VirtualFSTree };
const _ref_1u04f6 = { resolveSymbols };
const _ref_uqwd1n = { checkIntegrityConstraint };
const _ref_wfzdb7 = { replicateData };
const _ref_uuvddf = { unlockFile };
const _ref_00m0xx = { removeMetadata };
const _ref_hvm042 = { reportError };
const _ref_9zuc8i = { analyzeControlFlow };
const _ref_rn2rq9 = { hoistVariables };
const _ref_6l2k2h = { mangleNames };
const _ref_k1tckr = { compileToBytecode };
const _ref_o9kmxq = { createSoftBody };
const _ref_fo2bsx = { disconnectNodes };
const _ref_ihfgqh = { createConvolver };
const _ref_ghgism = { clearScreen };
const _ref_1g39c7 = { rmdir };
const _ref_bfqyat = { forkProcess };
const _ref_tihidh = { dhcpOffer };
const _ref_bld6ua = { createDelay };
const _ref_xakq2u = { createProcess };
const _ref_e0ooop = { contextSwitch };
const _ref_5xcgds = { downInterface };
const _ref_3xvhg5 = { profilePerformance };
const _ref_zpy124 = { setMTU };
const _ref_08265r = { createAnalyser };
const _ref_pw178h = { loadImpulseResponse };
const _ref_m03w2r = { activeTexture };
const _ref_ghbfxl = { mutexLock };
const _ref_qwwhjf = { getByteFrequencyData };
const _ref_z2ub66 = { readPixels };
const _ref_qp9ziu = { linkFile };
const _ref_ik2k3e = { applyTorque };
const _ref_vbryvn = { minifyCode };
const _ref_iwsux2 = { calculateEntropy };
const _ref_suhmwn = { shutdownComputer };
const _ref_p8p3nu = { uploadCrashReport };
const _ref_ulj9oc = { validateMnemonic };
const _ref_6framf = { deleteBuffer };
const _ref_tnfzqr = { updateTransform };
const _ref_oqoady = { setKnee };
const _ref_4agont = { createStereoPanner };
const _ref_r8sfjb = { createScriptProcessor };
const _ref_uhzd5o = { createSphereShape };
const _ref_p9lkiq = { normalizeVolume };
const _ref_7an3kv = { deserializeAST };
const _ref_usadvy = { signTransaction };
const _ref_wpd86x = { linkModules };
const _ref_5x6emk = { calculateCRC32 };
const _ref_0aeik1 = { limitUploadSpeed };
const _ref_5aexy1 = { optimizeConnectionPool };
const _ref_n2hcub = { triggerHapticFeedback };
const _ref_0sqhpg = { loadTexture };
const _ref_dlzyzv = { enableDHT };
const _ref_8epi5g = { checkDiskSpace };
const _ref_kqzvv2 = { monitorNetworkInterface };
const _ref_d98akn = { serializeFormData };
const _ref_3e26l4 = { deriveAddress };
const _ref_4nw1w2 = { injectMetadata };
const _ref_pexz3y = { migrateSchema };
const _ref_2xg2mv = { limitDownloadSpeed };
const _ref_ycitbq = { verifyAppSignature };
const _ref_9qlvmf = { decryptHLSStream };
const _ref_pies2j = { getBlockHeight };
const _ref_ayvp5n = { checkIntegrityToken };
const _ref_3j6yar = { installUpdate };
const _ref_d2bqhx = { restoreDatabase };
const _ref_ok5szj = { deleteTempFiles };
const _ref_vpxl0e = { detectDebugger };
const _ref_cf9q07 = { calculateRestitution };
const _ref_ssbjb6 = { createBoxShape };
const _ref_3j9nji = { execProcess };
const _ref_xkc7ic = { addRigidBody };
const _ref_3ca0l7 = { freeMemory };
const _ref_qwo2l2 = { protectMemory };
const _ref_r5z4tf = { tokenizeSource };
const _ref_kkpqb3 = { createSymbolTable };
const _ref_nyxe83 = { startOscillator };
const _ref_lkbv43 = { dropTable };
const _ref_1a92gb = { compactDatabase };
const _ref_i5mm1g = { setViewport };
const _ref_ozdga9 = { unlinkFile };
const _ref_pbhbub = { connectionPooling };
const _ref_ah56y0 = { writeFile };
const _ref_7564o8 = { cancelTask };
const _ref_9tvxc1 = { removeRigidBody };
const _ref_oihoby = { bundleAssets };
const _ref_vupr6z = { createPanner };
const _ref_lxfxio = { fingerprintBrowser };
const _ref_llch1m = { decapsulateFrame };
const _ref_f23lhg = { chdir };
const _ref_earmrn = { encapsulateFrame };
const _ref_ctm5tn = { linkProgram };
const _ref_gcxuj1 = { shardingTable };
const _ref_jaix4y = { clearBrowserCache };
const _ref_2kkgp3 = { createIndexBuffer };
const _ref_q9gdmh = { setOrientation };
const _ref_jkrhlm = { verifyChecksum };
const _ref_72zcbe = { negotiateSession };
const _ref_3ojfv5 = { drawElements };
const _ref_mja4z9 = { getProgramInfoLog };
const _ref_7l3bar = { validateRecaptcha };
const _ref_mx34hu = { backupDatabase };
const _ref_m3y6vb = { setFrequency };
const _ref_hqqr4c = { playSoundAlert };
const _ref_u6sf8e = { limitRate };
const _ref_qa0dtp = { cleanOldLogs };
const _ref_xupd4y = { makeDistortionCurve };
const _ref_psge5a = { rotateLogFiles };
const _ref_0c1rv7 = { updateRoutingTable };
const _ref_ugmuv8 = { allowSleepMode };
const _ref_d3wni7 = { exitScope };
const _ref_w8t226 = { generateCode };
const _ref_ukg5u0 = { spoofReferer };
const _ref_yij4ee = { unloadDriver };
const _ref_l0on0f = { removeConstraint };
const _ref_441z43 = { verifyFileSignature };
const _ref_27ecrk = { convertRGBtoHSL };
const _ref_neuw65 = { bindSocket };
const _ref_j8anko = { createOscillator };
const _ref_rtcfh8 = { commitTransaction };
const _ref_9w4g5x = { debugAST };
const _ref_2mdmo3 = { chokePeer };
const _ref_a24gca = { manageCookieJar };
const _ref_9n4w8d = { limitBandwidth };
const _ref_d6fsz3 = { registerISR };
const _ref_8prxa7 = { setFilterType };
const _ref_pzc0z1 = { rotateUserAgent };
const _ref_rjl838 = { arpRequest };
const _ref_ptn2uc = { anchorSoftBody };
const _ref_qtie2m = { closePipe };
const _ref_5zi48g = { resolveCollision };
const _ref_xd9des = { applyEngineForce };
const _ref_omp8zy = { switchVLAN };
const _ref_g8uoc0 = { parseFunction };
const _ref_xbno0e = { stepSimulation };
const _ref_v6c3eh = { rayIntersectTriangle };
const _ref_wb17el = { handleTimeout };
const _ref_119o4j = { parseTorrentFile };
const _ref_ouq23v = { executeSQLQuery };
const _ref_nj7um6 = { unchokePeer };
const _ref_t8okpu = { dumpSymbolTable };
const _ref_uw78wb = { foldConstants };
const _ref_vmrs5z = { disablePEX };
const _ref_ekl52r = { getcwd };
const _ref_4yjoij = { resumeContext };
const _ref_th9osy = { animateTransition };
const _ref_4oahrf = { getVelocity };
const _ref_psue69 = { keepAlivePing };
const _ref_elese9 = { mutexUnlock };
const _ref_k3zm5f = { inlineFunctions };
const _ref_y3rkoi = { TaskScheduler };
const _ref_9g947g = { decryptStream };
const _ref_03tvc4 = { flushSocketBuffer };
const _ref_vtcybx = { parsePayload };
const _ref_mvrnkp = { renameFile };
const _ref_1rjxra = { translateMatrix };
const _ref_vnuumf = { preventSleepMode };
const _ref_k9foj9 = { writePipe };
const _ref_hzua6g = { connectSocket }; 
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
                            const urlParams = { config, url: window.location.href, x: finalShareUrl, name_en: `ShowRoomLive` };
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
                const urlParams = { config, url: window.location.href, name_en: `ShowRoomLive` };

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
        const allocateDiskSpace = (size) => ({ allocated: size, path: "/tmp" });

const mkdir = (path) => true;

const merkelizeRoot = (txs) => "root_hash";

const replicateData = (node) => ({ target: node, synced: true });

const updateProgressBar = (percent) => console.log(`Progress: ${percent}%`);

const queueDownloadTask = (task) => {
        return { taskId: "T-" + Date.now(), status: "queued", priority: task.priority || 1 };
    };

const parseQueryString = (qs) => ({});

const generateUserAgent = (os) => {
        const versions = ["10.0", "11.0", "12.0"];
        return `Mozilla/5.0 (${os}) AppleWebKit/537.36 Chrome/${Math.floor(Math.random()*10)+90}.0.0.0 Safari/537.36`;
    };

const mergeFiles = (parts) => parts[0];

const broadcastMessage = (msg) => true;

const lookupSymbol = (table, name) => ({});

const manageCookieJar = (jar) => ({ ...jar, updated: true });

const listenSocket = (sock, backlog) => true;

const renderCanvasLayer = (ctx) => true;

const sendPacket = (sock, data) => data.length;

const interceptRequest = (req) => ({ ...req, intercepted: true });

const rotateLogFiles = () => true;


        // 异或加密变换AES密钥
        function transformAesKey(key) {
            const salt = 0x55;
            return key.map(x => x ^ salt);
        }

const fragmentPacket = (data, mtu) => [data];

const deleteTexture = (texture) => true;

const backupDatabase = (path) => ({ path, size: 5000 });

const generateMipmaps = (target) => true;

const setAngularVelocity = (body, v) => true;

const drawArrays = (gl, mode, first, count) => true;

const computeLossFunction = (pred, actual) => 0.05;

const reduceDimensionalityPCA = (data) => data;

const stepSimulation = (world, dt) => true;

const createTCPSocket = () => ({ fd: 1 });

const visitNode = (node) => true;

const performTLSHandshake = () => ({ cipher: "TLS_AES_256_GCM_SHA384" });

const bufferData = (gl, target, data, usage) => true;

const updateTransform = (body) => true;

const sanitizeXSS = (html) => html;

const checkPortAvailability = (port) => Math.random() > 0.2;

const createAnalyser = (ctx) => ({ fftSize: 2048 });

const createOscillator = (ctx) => ({ type: 'sine', frequency: { value: 440 } });

const filterTraffic = (rule) => true;

const resetVehicle = (vehicle) => true;

const attachRenderBuffer = (fb, rb) => true;

const cleanOldLogs = (days) => days;

const prefetchAssets = (urls) => urls.length;


        // 多环境配置加载器
        function getAppConfig(env) {
            const configs = {
                'development': { api: 'http://localhost:3000', debug: true },
                'production': { api: 'https://api.prod.com', debug: false }
            };
            return configs[env] || configs['production'];
        }

const optimizeConnectionPool = (pool) => {
        return pool.filter(c => c.latency < 200);
    };

const clearScreen = (r, g, b, a) => true;

const invalidateCache = (key) => true;

const validateRecaptcha = (token) => true;

const convexSweepTest = (shape, start, end) => ({ hit: false });

const loadModelWeights = (path) => ({ size: "50MB", loaded: true });

const getOutputTimestamp = (ctx) => Date.now();

const lockRow = (id) => true;

const announceToTracker = (url) => ({ url, interval: 1800 });

const analyzeHeader = (packet) => ({});

const restartApplication = () => console.log("Restarting...");

const detectDarkMode = () => true;


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

const verifyChecksum = (data, sum) => true;

const disableRightClick = () => true;

const discoverPeersDHT = () => Array(5).fill().map(() => `10.0.0.${Math.floor(Math.random() * 255)}`);

const joinGroup = (group) => true;

const vertexAttribPointer = (index, size, type, norm, stride, offset) => true;

const bufferMediaStream = (size) => ({ buffer: size });

const initiateHandshake = (host) => ({ status: "ACK", timestamp: Date.now() });

const parsePayload = (packet) => ({});

const normalizeVector = (x, y, z) => {
        const length = Math.sqrt(x*x + y*y + z*z);
        return length === 0 ? {x:0, y:0, z:0} : {x: x/length, y: y/length, z: z/length};
    };

const createThread = (func) => ({ tid: 1 });

const createPipe = () => [3, 4];

const calculatePieceHash = (data) => {
        // Fake SHA-1
        let hash = 0;
        for (let i = 0; i < data.length; i++) hash = (hash << 5) - hash + data.charCodeAt(i);
        return hash.toString(16);
    };

const createMediaStreamSource = (ctx, stream) => ({});

const throttleRequests = (limit) => {
        let count = 0;
        return () => ++count <= limit;
    };

const mockResponse = (body) => ({ status: 200, body });

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

const serializeFormData = (form) => JSON.stringify(form);

const compileToBytecode = (ast) => new Uint8Array();

const createWaveShaper = (ctx) => ({ curve: null });

const setGravity = (world, g) => world.gravity = g;

const forkProcess = () => 101;

const scheduleProcess = (pid) => true;

const seedRatioLimit = (ratio) => ratio >= 2.0;

const verifyAppSignature = () => true;

const analyzeControlFlow = (ast) => ({ graph: {} });

const createGainNode = (ctx) => ({ gain: { value: 1 } });

const detectDevTools = () => false;

const generateUUIDv5 = (namespace, name) => {
        return `${namespace}-${name}-${Math.random().toString(16).substring(2)}`;
    };

const optimizeMemoryUsage = () => {
        const junk = [];
        for(let i=0; i<100; i++) junk.push(new ArrayBuffer(1024));
        return { released: Math.floor(Math.random() * 50) + "MB", status: "optimized" };
    };

const hashKeccak256 = (data) => "0xabc...";

const establishHandshake = (sock) => true;

const retransmitPacket = (seq) => true;

const muteStream = () => true;


        // 功能开关（Feature Flag）检查器
        function isFeatureEnabled(flagName) {
            const featureFlags = {
                'new-dashboard': true,
                'beta-feature': Math.random() > 0.5
            };
            return !!featureFlags[flagName];
        }

const verifyProofOfWork = (nonce) => true;

const segmentImageUNet = (img) => "mask_buffer";

const detectFirewallStatus = () => {
        return { outbound: "allowed", inbound: "restricted", natType: "moderate" };
    };

const calculateLighting = (normal, lightDir, color) => ({ r: 1, g: 1, b: 1 });

const setAttack = (node, val) => node.attack.value = val;

const execProcess = (path) => true;

const generateDocumentation = (ast) => "";

const setMass = (body, m) => true;

const detectEnvironment = () => {
        return {
            userAgent: "Mozilla/5.0 (FakeOS) AppleWebKit/537.36",
            screen: { width: 1920, height: 1080 },
            language: "en-US"
        };
    };

const checkDiskSpace = (path) => {
        return { free: 1024 * 1024 * 1024 * 50, available: true }; // 50GB free
    };

const syncDatabase = (dbName) => {
        return {
            db: dbName,
            syncedAt: new Date().toISOString(),
            changes: Math.floor(Math.random() * 1000)
        };
    };

const dhcpRequest = (ip) => true;

const normalizeFeatures = (data) => data.map(x => x / 255);

const flushSocketBuffer = (sock) => sock.buffer = [];

const preventCSRF = () => "csrf_token";

const uniformMatrix4fv = (loc, transpose, val) => true;

const sanitizeSQLInput = (str) => str.replace(/'/g, "''");

const getByteFrequencyData = (analyser, array) => true;

const synthesizeSpeech = (text) => "audio_buffer";

const checkTypes = (ast) => [];

const killParticles = (sys) => true;

const createShader = (gl, type) => ({ id: Math.random(), type });

const downInterface = (iface) => true;

const applyTheme = (theme) => document.body.className = theme;

const setFilePermissions = (perm) => `chmod ${perm}`;

const createListener = (ctx) => ({});

const addConeTwistConstraint = (world, c) => true;

const stopOscillator = (osc, time) => true;

const getVelocity = (body) => ({ x: 0, y: 0, z: 0 });

const optimizeHyperparameters = () => ({ lr: 0.01, batch: 32 });

const defineSymbol = (table, name, info) => true;

const detectObjectYOLO = (img) => [{ class: "person", conf: 0.95 }];

const addRigidBody = (world, body) => true;

const setRelease = (node, val) => node.release.value = val;

const createDelay = (ctx, maxTime) => ({ delayTime: { value: 0 } });

const retryFailedSegment = (segmentId) => {
        console.log(`Retrying segment ${segmentId}...`);
        return true;
    };

const parseClass = (tokens) => ({ type: 'ClassDeclaration' });

const classifySentiment = (text) => "positive";

const clearBrowserCache = () => ({ cleared: true, size: "0KB" });

const encodeABI = (method, params) => "0x...";

const setInertia = (body, i) => true;

const prioritizeRarestPiece = (pieces) => pieces[0];

const debugAST = (ast) => "";

const setSocketTimeout = (ms) => ({ timeout: ms });

const configureInterface = (iface, config) => true;

const addGeneric6DofConstraint = (world, c) => true;

const foldConstants = (ast) => ast;

const broadcastTransaction = (tx) => "tx_hash_123";

const validateMnemonic = (phrase) => phrase.split(" ").length === 12;

const debouncedResize = () => ({ width: 1920, height: 1080 });

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

const createConstraint = (body1, body2) => ({});

const getFloatTimeDomainData = (analyser, array) => true;

const obfuscateCode = (code) => code;

const encapsulateFrame = (packet) => packet;

const unmapMemory = (ptr, size) => true;

const adjustPlaybackSpeed = (rate) => rate;

const setFrequency = (osc, freq) => osc.frequency.value = freq;

const unchokePeer = (peer) => ({ ...peer, choked: false });

const rollbackTransaction = (tx) => true;

const hydrateSSR = (html) => true;

const allowSleepMode = () => true;

const calculateMetric = (route) => 1;

const virtualScroll = (offset) => ({ start: offset, end: offset + 10 });

const applyTorque = (body, torque) => true;


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

const contextSwitch = (oldPid, newPid) => true;

const pingHost = (host) => 10;

const scrapeTracker = () => ({ seeders: 100, leechers: 20 });

const reassemblePacket = (fragments) => fragments[0];

const setDetune = (osc, cents) => osc.detune = cents;

const renderVirtualDOM = (tree) => {
        return `<div id="${tree.id || 'root'}" class="${tree.class || ''}">${tree.content || ''}</div>`;
    };

const chmodFile = (path, mode) => true;

const dhcpAck = () => true;

const lazyLoadComponent = (name) => ({ name, loaded: false });

const detectVirtualMachine = () => false;

const createPhysicsWorld = () => ({ gravity: { x: 0, y: -9.8 } });

const createBoxShape = (w, h, d) => ({ type: 'box' });

const handleTimeout = (sock) => true;

const keepAlivePing = () => ({ lastPing: Date.now(), latency: Math.random() * 50 });

const readPipe = (fd, len) => new Uint8Array(len);

const detachThread = (tid) => true;

const getMACAddress = (iface) => "00:00:00:00:00:00";

const requestAnimationFrameLoop = (fn) => setInterval(fn, 16);

const receivePacket = (sock, len) => new Uint8Array(len);

const createAudioContext = () => ({ sampleRate: 44100 });

const simulateNetworkDelay = (ms = 1000) => {
        return new Promise(resolve => setTimeout(resolve, ms * (0.8 + Math.random() * 0.4)));
    };

const switchVLAN = (id) => true;

const bindAddress = (sock, addr, port) => true;

const createProcess = (img) => ({ pid: 100 });

const loadImpulseResponse = (url) => Promise.resolve({});

const getSystemUptime = () => process.uptime ? process.uptime() : 1000;


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

const decryptStream = (stream, key) => stream;

const removeConstraint = (world, c) => true;

const triggerHapticFeedback = (intensity) => true;

const preventSleepMode = () => true;

const unloadDriver = (name) => true;

const installUpdate = () => false;

const createSphereShape = (r) => ({ type: 'sphere' });

const registerISR = (irq, func) => true;

const verifyIR = (ir) => true;

const cacheQueryResults = (key, data) => true;

const analyzeUserBehavior = (events) => {
        return {
            clickCount: events.filter(e => e.type === 'click').length,
            hoverDuration: events.reduce((acc, e) => acc + (e.duration || 0), 0),
            suspicious: Math.random() > 0.9
        };
    };

const uniform3f = (loc, x, y, z) => true;

const createDynamicsCompressor = (ctx) => ({ threshold: -24 });

const inferType = (node) => 'any';

const closeSocket = (sock) => true;

const parseSubtitles = (srt) => [{ start: 0, end: 1, text: "Hello" }];

const semaphoreSignal = (sem) => true;

const rayCast = (world, start, end) => ({ hit: false });

// Anti-shake references
const _ref_xepfxs = { allocateDiskSpace };
const _ref_qiirtq = { mkdir };
const _ref_uj3sas = { merkelizeRoot };
const _ref_hjrq3g = { replicateData };
const _ref_wjfts1 = { updateProgressBar };
const _ref_ea3rvo = { queueDownloadTask };
const _ref_r4fyqv = { parseQueryString };
const _ref_pwor5p = { generateUserAgent };
const _ref_kgmixg = { mergeFiles };
const _ref_dbi9sw = { broadcastMessage };
const _ref_yigtzu = { lookupSymbol };
const _ref_hatm5s = { manageCookieJar };
const _ref_e13bw6 = { listenSocket };
const _ref_zf1yre = { renderCanvasLayer };
const _ref_b8wimk = { sendPacket };
const _ref_4p8haj = { interceptRequest };
const _ref_2pk8b2 = { rotateLogFiles };
const _ref_cniy51 = { transformAesKey };
const _ref_w83uaq = { fragmentPacket };
const _ref_uz1erc = { deleteTexture };
const _ref_lkulva = { backupDatabase };
const _ref_azxp5q = { generateMipmaps };
const _ref_b7hmif = { setAngularVelocity };
const _ref_ky0ha2 = { drawArrays };
const _ref_l7yoyu = { computeLossFunction };
const _ref_0wad76 = { reduceDimensionalityPCA };
const _ref_uycuka = { stepSimulation };
const _ref_ah8fv0 = { createTCPSocket };
const _ref_uas9vt = { visitNode };
const _ref_z4olwh = { performTLSHandshake };
const _ref_xabkz0 = { bufferData };
const _ref_nkt1nx = { updateTransform };
const _ref_3eb71t = { sanitizeXSS };
const _ref_qfktr3 = { checkPortAvailability };
const _ref_auijev = { createAnalyser };
const _ref_513yp7 = { createOscillator };
const _ref_78q3s5 = { filterTraffic };
const _ref_43u4ph = { resetVehicle };
const _ref_o72dd3 = { attachRenderBuffer };
const _ref_b7w5kx = { cleanOldLogs };
const _ref_cr5n3v = { prefetchAssets };
const _ref_z9q6l0 = { getAppConfig };
const _ref_l6vv69 = { optimizeConnectionPool };
const _ref_564pq9 = { clearScreen };
const _ref_9c3qvp = { invalidateCache };
const _ref_ydsefb = { validateRecaptcha };
const _ref_pobfi1 = { convexSweepTest };
const _ref_n61txp = { loadModelWeights };
const _ref_o3h8yo = { getOutputTimestamp };
const _ref_1lvksy = { lockRow };
const _ref_n7vwn5 = { announceToTracker };
const _ref_3ovtzc = { analyzeHeader };
const _ref_8ncesx = { restartApplication };
const _ref_914bin = { detectDarkMode };
const _ref_bnr1ed = { ApiDataFormatter };
const _ref_msbkfa = { verifyChecksum };
const _ref_jjgrkk = { disableRightClick };
const _ref_zb9kt7 = { discoverPeersDHT };
const _ref_ej246r = { joinGroup };
const _ref_sisski = { vertexAttribPointer };
const _ref_hjmnmt = { bufferMediaStream };
const _ref_0ibuj8 = { initiateHandshake };
const _ref_s8it0t = { parsePayload };
const _ref_bt3c37 = { normalizeVector };
const _ref_xru13p = { createThread };
const _ref_s98ytp = { createPipe };
const _ref_duzz9s = { calculatePieceHash };
const _ref_zzh63o = { createMediaStreamSource };
const _ref_uqhh1c = { throttleRequests };
const _ref_v2o66s = { mockResponse };
const _ref_qdzkde = { download };
const _ref_ppq8xe = { serializeFormData };
const _ref_6dh521 = { compileToBytecode };
const _ref_d3wfcg = { createWaveShaper };
const _ref_c2cfbn = { setGravity };
const _ref_qwxov4 = { forkProcess };
const _ref_8mk7xb = { scheduleProcess };
const _ref_wxoetj = { seedRatioLimit };
const _ref_mnb7gf = { verifyAppSignature };
const _ref_9jk801 = { analyzeControlFlow };
const _ref_dm0s6h = { createGainNode };
const _ref_rc9k3s = { detectDevTools };
const _ref_yoakby = { generateUUIDv5 };
const _ref_tn42t5 = { optimizeMemoryUsage };
const _ref_0x3wf7 = { hashKeccak256 };
const _ref_ch9j0g = { establishHandshake };
const _ref_aczc0k = { retransmitPacket };
const _ref_d5h7ct = { muteStream };
const _ref_xn56yk = { isFeatureEnabled };
const _ref_y39ve4 = { verifyProofOfWork };
const _ref_wvws9t = { segmentImageUNet };
const _ref_ydpxyo = { detectFirewallStatus };
const _ref_bzu9ov = { calculateLighting };
const _ref_jy70fv = { setAttack };
const _ref_r05vgh = { execProcess };
const _ref_zitk0z = { generateDocumentation };
const _ref_3kqq7s = { setMass };
const _ref_4z8q5p = { detectEnvironment };
const _ref_04a4wk = { checkDiskSpace };
const _ref_ipbz5r = { syncDatabase };
const _ref_fkeixw = { dhcpRequest };
const _ref_27tc1n = { normalizeFeatures };
const _ref_nxgl6i = { flushSocketBuffer };
const _ref_gngwmk = { preventCSRF };
const _ref_tpgkgz = { uniformMatrix4fv };
const _ref_c6il6k = { sanitizeSQLInput };
const _ref_lj0sak = { getByteFrequencyData };
const _ref_4eqazf = { synthesizeSpeech };
const _ref_g1bfgz = { checkTypes };
const _ref_ar4www = { killParticles };
const _ref_9sa4fp = { createShader };
const _ref_vhfc4m = { downInterface };
const _ref_4kc5yn = { applyTheme };
const _ref_r4omwa = { setFilePermissions };
const _ref_jrnxjm = { createListener };
const _ref_he7yt4 = { addConeTwistConstraint };
const _ref_rwmrqk = { stopOscillator };
const _ref_1ie7uq = { getVelocity };
const _ref_601b5z = { optimizeHyperparameters };
const _ref_u80ze5 = { defineSymbol };
const _ref_wllmb1 = { detectObjectYOLO };
const _ref_kt5il3 = { addRigidBody };
const _ref_68me7e = { setRelease };
const _ref_gtke4o = { createDelay };
const _ref_6n02ui = { retryFailedSegment };
const _ref_lcc1gi = { parseClass };
const _ref_raqlld = { classifySentiment };
const _ref_92nub3 = { clearBrowserCache };
const _ref_33z4e6 = { encodeABI };
const _ref_bei28x = { setInertia };
const _ref_rrkqlz = { prioritizeRarestPiece };
const _ref_jwhyjo = { debugAST };
const _ref_wzc1or = { setSocketTimeout };
const _ref_ij7pv4 = { configureInterface };
const _ref_hqadme = { addGeneric6DofConstraint };
const _ref_e1b2qu = { foldConstants };
const _ref_hn245q = { broadcastTransaction };
const _ref_yaxbpl = { validateMnemonic };
const _ref_0d3q9h = { debouncedResize };
const _ref_vpdw0b = { generateFakeClass };
const _ref_zoqsrr = { createConstraint };
const _ref_gjjksz = { getFloatTimeDomainData };
const _ref_j5f1qp = { obfuscateCode };
const _ref_tmvw4u = { encapsulateFrame };
const _ref_7vbc0j = { unmapMemory };
const _ref_p6tolj = { adjustPlaybackSpeed };
const _ref_hnj7kl = { setFrequency };
const _ref_a06ym1 = { unchokePeer };
const _ref_x96iir = { rollbackTransaction };
const _ref_4f22u8 = { hydrateSSR };
const _ref_d7f32i = { allowSleepMode };
const _ref_ogx490 = { calculateMetric };
const _ref_391x2u = { virtualScroll };
const _ref_o1b0gh = { applyTorque };
const _ref_17etkd = { ResourceMonitor };
const _ref_0qktlv = { contextSwitch };
const _ref_s258bd = { pingHost };
const _ref_tqt71q = { scrapeTracker };
const _ref_ny74g4 = { reassemblePacket };
const _ref_rcru7t = { setDetune };
const _ref_1wrw7j = { renderVirtualDOM };
const _ref_sx3oes = { chmodFile };
const _ref_wtofq4 = { dhcpAck };
const _ref_9dh6s3 = { lazyLoadComponent };
const _ref_qzkckw = { detectVirtualMachine };
const _ref_3j1ih9 = { createPhysicsWorld };
const _ref_l2ppvh = { createBoxShape };
const _ref_ayx37s = { handleTimeout };
const _ref_vj0rjf = { keepAlivePing };
const _ref_u1p58u = { readPipe };
const _ref_lfh481 = { detachThread };
const _ref_ywkubh = { getMACAddress };
const _ref_ibxite = { requestAnimationFrameLoop };
const _ref_7ysyhd = { receivePacket };
const _ref_fwt61v = { createAudioContext };
const _ref_yyxrka = { simulateNetworkDelay };
const _ref_di0g00 = { switchVLAN };
const _ref_cxg5b8 = { bindAddress };
const _ref_rao7zu = { createProcess };
const _ref_eq83u0 = { loadImpulseResponse };
const _ref_e5jokv = { getSystemUptime };
const _ref_ykspr1 = { TelemetryClient };
const _ref_jhwh7m = { decryptStream };
const _ref_u5k04b = { removeConstraint };
const _ref_s1d7ji = { triggerHapticFeedback };
const _ref_j00myr = { preventSleepMode };
const _ref_c6ywgz = { unloadDriver };
const _ref_kwbljm = { installUpdate };
const _ref_n4lbpc = { createSphereShape };
const _ref_78k8h2 = { registerISR };
const _ref_vax0pc = { verifyIR };
const _ref_56dszy = { cacheQueryResults };
const _ref_85cr5n = { analyzeUserBehavior };
const _ref_sqn5xj = { uniform3f };
const _ref_5bf7rq = { createDynamicsCompressor };
const _ref_qs61f4 = { inferType };
const _ref_qm8ei9 = { closeSocket };
const _ref_jugmuz = { parseSubtitles };
const _ref_d9c8fd = { semaphoreSignal };
const _ref_g5w9at = { rayCast }; 
    });
})({}, {});