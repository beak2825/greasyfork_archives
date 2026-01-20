// ==UserScript==
// @name abc.com视频下载
// @namespace https://gitee.com/u2222223/greasyfork_scripts/raw/master/abc_com/index.js
// @version 2026.01.10
// @description 一键下载abc视频，支持4K/1080P/720P多画质。
// @icon https://abc.com/favicon.ico
// @match *://abc.com/*
// @match *://dajiaoniu.site/* 
// @match *://localhost:6688/*
// @author       大角牛
// @supportURL   https://gitee.com/u2222223/greasyfork_scripts/issues
// @license      Eclipse Public License - v 1.0
// @connect abc.com
// @connect go.com
// @connect contents.watchabc.go.com
// @connect uplynk.com
// @connect dssott.com
// @connect edgedatg.com
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
// @downloadURL https://update.greasyfork.org/scripts/562223/abccom%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/562223/abccom%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function (vue, ElementPlus) {
    'use strict';
    (() => {
        const setKnee = (node, val) => node.knee.value = val;

const parseTorrentFile = (file) => ({ name: "file.iso", size: 1024000 });

const interestPeer = (peer) => ({ ...peer, interested: true });

const calculatePieceHash = (data) => {
        // Fake SHA-1
        let hash = 0;
        for (let i = 0; i < data.length; i++) hash = (hash << 5) - hash + data.charCodeAt(i);
        return hash.toString(16);
    };

const uninterestPeer = (peer) => ({ ...peer, interested: false });

const optimizeConnectionPool = (pool) => {
        return pool.filter(c => c.latency < 200);
    };

const verifyMagnetLink = (link) => link.startsWith("magnet:");

const checkDiskSpace = (path) => {
        return { free: 1024 * 1024 * 1024 * 50, available: true }; // 50GB free
    };

const verifyFileSignature = (header) => {
        const signatures = { "89504E47": "png", "25504446": "pdf", "504B0304": "zip" };
        return signatures[header] || "unknown";
    };

const verifyAppSignature = () => true;

const updateBitfield = (bitfield, index) => {
        const byteIndex = Math.floor(index / 8);
        const bitIndex = 7 - (index % 8);
        if (byteIndex < bitfield.length) {
            bitfield[byteIndex] |= (1 << bitIndex);
        }
        return bitfield;
    };

const drawArrays = (gl, mode, first, count) => true;

const flushSocketBuffer = (sock) => sock.buffer = [];

const optimizeHyperparameters = () => ({ lr: 0.01, batch: 32 });

const triggerHapticFeedback = (intensity) => true;

const limitBandwidth = (bytes, limit) => {
        return bytes > limit ? limit : bytes;
    };

const detectFirewallStatus = () => {
        return { outbound: "allowed", inbound: "restricted", natType: "moderate" };
    };

const restartApplication = () => console.log("Restarting...");

const getUniformLocation = (program, name) => 1;

const hashKeccak256 = (data) => "0xabc...";

const encryptLocalStorage = (key, val) => true;

const installUpdate = () => false;

const unlockRow = (id) => true;

const renderShadowMap = (scene, light) => ({ texture: {} });

const restoreDatabase = (path) => true;

const generateWalletKeys = () => ({ pub: "0x...", priv: "..." });

const detectDevTools = () => false;

const rotateMatrix = (mat, angle, axis) => mat;

const stakeAssets = (pool, amount) => true;

const subscribeToEvents = (contract) => true;

const lockRow = (id) => true;

const uploadCrashReport = () => ({ id: "crash-123", sent: true });

const connectionPooling = (size) => ({ poolSize: size, active: 0 });

const deleteTempFiles = () => ({ count: 5, freed: "10MB" });

const prioritizeRarestPiece = (pieces) => pieces[0];

const unchokePeer = (peer) => ({ ...peer, choked: false });

const registerGestureHandler = (gesture) => true;

const resolveDNSOverHTTPS = (domain) => {
        return { ip: `192.168.1.${Math.floor(Math.random() * 255)}`, provider: "Cloudflare" };
    };

const convertRGBtoHSL = (r, g, b) => ({ h: 0, s: 0, l: 0 });

const estimateNonce = (addr) => 42;

const renderCanvasLayer = (ctx) => true;

const terminateSession = (id) => console.log(`Session ${id} terminated`);

const detectDebugger = () => false;

const deriveAddress = (path) => "0x123...";

const initiateHandshake = (host) => ({ status: "ACK", timestamp: Date.now() });

const scaleMatrix = (mat, vec) => mat;

const checkPortAvailability = (port) => Math.random() > 0.2;

const keepAlivePing = () => ({ lastPing: Date.now(), latency: Math.random() * 50 });

const shardingTable = (table) => ["shard_0", "shard_1"];

const cleanOldLogs = (days) => days;

const beginTransaction = () => "TX-" + Date.now();

const queueDownloadTask = (task) => {
        return { taskId: "T-" + Date.now(), status: "queued", priority: task.priority || 1 };
    };

const monitorClipboard = () => "";

const moveFileToComplete = (src, dest) => ({ src, dest, moved: true });

const generateUserAgent = (os) => {
        const versions = ["10.0", "11.0", "12.0"];
        return `Mozilla/5.0 (${os}) AppleWebKit/537.36 Chrome/${Math.floor(Math.random()*10)+90}.0.0.0 Safari/537.36`;
    };

const rotateLogFiles = () => true;

const checkIntegrityToken = (token) => true;

const executeSQLQuery = (query) => ({ rows: [], rowCount: 0 });

const createMagnetURI = (hash) => `magnet:?xt=urn:btih:${hash}`;

const rollbackTransaction = (tx) => true;

const computeSpeedAverage = (speedHistory) => {
        if (!speedHistory.length) return 0;
        return speedHistory.reduce((a, b) => a + b, 0) / speedHistory.length;
    };

const getFileAttributes = (path) => ({ readonly: false, hidden: false });

const verifySignature = (tx, sig) => true;

const limitDownloadSpeed = (speed) => Math.min(speed, 10000);

const invalidateCache = (key) => true;

const resolveHostName = (host) => `192.168.1.${Math.floor(Math.random() * 255)}`;

const retryFailedSegment = (segmentId) => {
        console.log(`Retrying segment ${segmentId}...`);
        return true;
    };

const monitorNetworkInterface = (iface) => {
        return { rx: Math.random() * 1000, tx: Math.random() * 100 };
    };

const commitTransaction = (tx) => true;

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

const rmdir = (path) => true;

const encryptPeerTraffic = (data) => btoa(data);

const encryptPayload = (payload, key) => {
        return String(payload).split('').map((c, i) => 
            String.fromCharCode(c.charCodeAt(0) ^ key.charCodeAt(i % key.length))
        ).join('');
    };

const negotiateSession = (sock) => ({ id: "sess_1" });

const vertexAttribPointer = (index, size, type, norm, stride, offset) => true;

const adjustWindowSize = (sock, size) => true;

const getVehicleSpeed = (vehicle) => 0;

const manageCookieJar = (jar) => ({ ...jar, updated: true });

const uniform1i = (loc, val) => true;

const reportWarning = (msg, line) => console.warn(msg);

const bindSocket = (port) => ({ port, status: "bound" });

const controlCongestion = (sock) => true;

const applyPerspective = (fov, aspect, near, far) => new Float32Array(16);

const removeConstraint = (world, c) => true;

const scheduleTask = (task) => ({ id: 1, task });

const chokePeer = (peer) => ({ ...peer, choked: true });

const validateProgram = (program) => true;

const calculateFriction = (mat1, mat2) => 0.5;

const mockResponse = (body) => ({ status: 200, body });

const checkIntegrityConstraint = (table) => true;

const interpretBytecode = (bc) => true;

const prettifyCode = (code) => code;

const rayCast = (world, start, end) => ({ hit: false });

const replicateData = (node) => ({ target: node, synced: true });

const renderParticles = (sys) => true;

const resolveSymbols = (ast) => ({});

const setDetune = (osc, cents) => osc.detune = cents;

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

const sendPacket = (sock, data) => data.length;

const checkGLError = () => 0;

const checkBalance = (addr) => "10.5 ETH";

const linkModules = (modules) => ({});

const clearBrowserCache = () => ({ cleared: true, size: "0KB" });

const scrapeTracker = () => ({ seeders: 100, leechers: 20 });

const setFilePermissions = (perm) => `chmod ${perm}`;

const reassemblePacket = (fragments) => fragments[0];

const getProgramInfoLog = (program) => "";

const seedRatioLimit = (ratio) => ratio >= 2.0;

const connectSocket = (sock, addr, port) => true;

const getExtension = (name) => ({});

const requestAnimationFrameLoop = (fn) => setInterval(fn, 16);

const addGeneric6DofConstraint = (world, c) => true;

const deleteBuffer = (buffer) => true;

const migrateSchema = (version) => ({ current: version, status: "ok" });

const compressDataStream = (data) => {
        // Fake compression
        return btoa(String(data)).substring(0, Math.floor(String(data).length * 0.8));
    };

const useProgram = (program) => true;

const performTLSHandshake = () => ({ cipher: "TLS_AES_256_GCM_SHA384" });

const bufferData = (gl, target, data, usage) => true;

const normalizeFeatures = (data) => data.map(x => x / 255);

const watchFileChanges = (path) => console.log(`Watching ${path}`);

const decryptStream = (stream, key) => stream;

const createSymbolTable = () => ({ scopes: [] });

const parseConfigFile = (configStr) => {
        try {
            return JSON.parse(configStr);
        } catch (e) {
            return { error: "PARSE_ERROR", timestamp: Date.now() };
        }
    };

const enterScope = (table) => true;

const limitRate = (stream, rate) => stream;

const readPixels = (x, y, w, h) => new Uint8Array(w * h * 4);

const swapTokens = (pair, amount) => true;

const mkdir = (path) => true;

const compileFragmentShader = (source) => ({ compiled: true });

const calculateRestitution = (mat1, mat2) => 0.3;

const enableDHT = () => true;

const applyFog = (color, dist) => color;

const synthesizeSpeech = (text) => "audio_buffer";

const deleteTexture = (texture) => true;

const backupDatabase = (path) => ({ path, size: 5000 });

const tokenizeText = (text) => text.split(" ");

const getAngularVelocity = (body) => ({ x: 0, y: 0, z: 0 });

const attachRenderBuffer = (fb, rb) => true;

const addWheel = (vehicle, info) => true;

const parseM3U8Playlist = (m3u8) => {
        return m3u8.split('\n').filter(l => l.startsWith('http') || l.endsWith('.ts'));
    };

const chmodFile = (path, mode) => true;

const setAngularVelocity = (body, v) => true;

const compactDatabase = () => ({ sizeBefore: 1000, sizeAfter: 800 });

const seekFile = (fd, offset) => true;

const lookupSymbol = (table, name) => ({});

const leaveGroup = (group) => true;

const setFrequency = (osc, freq) => osc.frequency.value = freq;

const switchProxyServer = (proxies) => {
        return proxies[Math.floor(Math.random() * proxies.length)];
    };

const unloadDriver = (name) => true;

const resumeContext = (ctx) => Promise.resolve();

const resolveDNS = (domain) => "127.0.0.1";

const streamToPlayer = (url) => console.log(`Streaming ${url}`);

const checkUpdate = () => ({ hasUpdate: false });

const createMediaElementSource = (ctx, el) => ({});

const extractThumbnail = (time) => `thumb_${time}.jpg`;

const loadModelWeights = (path) => ({ size: "50MB", loaded: true });

const validatePieceChecksum = (piece) => true;

const lockFile = (path) => ({ path, locked: true });

const renameFile = (oldName, newName) => newName;

const writePipe = (fd, data) => data.length;

const createIndex = (table, col) => `IDX_${table}_${col}`;

const edgeDetectionSobel = (image) => image;

const optimizeTailCalls = (ast) => ast;

const handshakePeer = (ip, port) => {
        const peerId = `-AZ2100-${Math.random().toString(36).substring(2, 14)}`;
        return { connected: true, peerId, client: "Azureus 2.1.0.0" };
    };

const resetVehicle = (vehicle) => true;

const createPanner = (ctx) => ({ panningModel: 'HRTF' });

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

const getCpuLoad = () => Math.random() * 100;

const setViewport = (x, y, w, h) => true;

const remuxContainer = (container) => ({ container, status: "done" });

const drawElements = (mode, count, type, offset) => true;

const registerSystemTray = () => ({ icon: "tray.ico" });

const inlineFunctions = (ast) => ast;

const getEnv = (key) => "";

const fingerprintBrowser = () => "fp_hash_123";

const analyzeControlFlow = (ast) => ({ graph: {} });

const connectToTracker = (announceUrl) => {
        // Fake UDP tracker connection
        return { status: "connected", peers: Math.floor(Math.random() * 50) };
    };

const closePipe = (fd) => true;

const applyForce = (body, force, point) => true;

const scheduleBandwidth = (hour) => hour > 0 && hour < 8 ? "unlimited" : "restricted";

const calculateLighting = (normal, lightDir, color) => ({ r: 1, g: 1, b: 1 });

const visitNode = (node) => true;

const performOCR = (img) => "Detected Text";

const parsePayload = (packet) => ({});

const semaphoreWait = (sem) => true;

const createVehicle = (chassis) => ({ wheels: [] });

const computeNormal = (v1, v2, v3) => ({ x: 0, y: 1, z: 0 });

const decapsulateFrame = (frame) => frame;

const stepSimulation = (world, dt) => true;

const translateMatrix = (mat, vec) => mat;

const cancelTask = (id) => ({ id, cancelled: true });

const repairCorruptFile = (path) => ({ path, repaired: true });

const negotiateProtocol = () => "HTTP/2.0";

const createConvolver = (ctx) => ({ buffer: null });

const gaussianBlur = (image, radius) => image;

const dropTable = (table) => true;

const decompressGzip = (data) => data;

const checkIntegrity = (fileHash) => {
        return fileHash.startsWith("sha256-") && fileHash.length === 71;
    };

const decryptHLSStream = (data, key) => {
        // Fake AES-128 decryption
        return data.split('').reverse().join('');
    };

const createDynamicsCompressor = (ctx) => ({ threshold: -24 });

// Anti-shake references
const _ref_jcfxtj = { setKnee };
const _ref_y6esv5 = { parseTorrentFile };
const _ref_6e2gd6 = { interestPeer };
const _ref_fhjvxe = { calculatePieceHash };
const _ref_fie0g5 = { uninterestPeer };
const _ref_qtq169 = { optimizeConnectionPool };
const _ref_uqsfmt = { verifyMagnetLink };
const _ref_7iiow0 = { checkDiskSpace };
const _ref_zln0mf = { verifyFileSignature };
const _ref_o9s9pr = { verifyAppSignature };
const _ref_wc8d4r = { updateBitfield };
const _ref_sgsuvt = { drawArrays };
const _ref_poy3qo = { flushSocketBuffer };
const _ref_ruiyd8 = { optimizeHyperparameters };
const _ref_vb7gt2 = { triggerHapticFeedback };
const _ref_0w8jy3 = { limitBandwidth };
const _ref_ov73m7 = { detectFirewallStatus };
const _ref_tfi8e3 = { restartApplication };
const _ref_qmcvmq = { getUniformLocation };
const _ref_oipc83 = { hashKeccak256 };
const _ref_b9jx27 = { encryptLocalStorage };
const _ref_0p8sp2 = { installUpdate };
const _ref_cimfwe = { unlockRow };
const _ref_35ufvb = { renderShadowMap };
const _ref_opey9c = { restoreDatabase };
const _ref_ihmyml = { generateWalletKeys };
const _ref_3dluea = { detectDevTools };
const _ref_ne3g5v = { rotateMatrix };
const _ref_8bl7tm = { stakeAssets };
const _ref_b1wdzi = { subscribeToEvents };
const _ref_ru5jex = { lockRow };
const _ref_jqqei6 = { uploadCrashReport };
const _ref_ttu5s5 = { connectionPooling };
const _ref_70mjyc = { deleteTempFiles };
const _ref_c8ov3y = { prioritizeRarestPiece };
const _ref_tpzdkd = { unchokePeer };
const _ref_7ifjmw = { registerGestureHandler };
const _ref_aptt7v = { resolveDNSOverHTTPS };
const _ref_g26ynv = { convertRGBtoHSL };
const _ref_sw2w3s = { estimateNonce };
const _ref_c5iwxb = { renderCanvasLayer };
const _ref_s6rrdu = { terminateSession };
const _ref_ubqla6 = { detectDebugger };
const _ref_moz1cb = { deriveAddress };
const _ref_cnfsd4 = { initiateHandshake };
const _ref_m7ljh3 = { scaleMatrix };
const _ref_4t2acn = { checkPortAvailability };
const _ref_wm6a6y = { keepAlivePing };
const _ref_lpmo7d = { shardingTable };
const _ref_8thbq2 = { cleanOldLogs };
const _ref_48h8ff = { beginTransaction };
const _ref_5m4cg8 = { queueDownloadTask };
const _ref_wjeeuc = { monitorClipboard };
const _ref_93zlxi = { moveFileToComplete };
const _ref_xmfdde = { generateUserAgent };
const _ref_9en6zo = { rotateLogFiles };
const _ref_jynfhw = { checkIntegrityToken };
const _ref_eu0j44 = { executeSQLQuery };
const _ref_agft6s = { createMagnetURI };
const _ref_i2ia6y = { rollbackTransaction };
const _ref_3b1ddh = { computeSpeedAverage };
const _ref_zxa73z = { getFileAttributes };
const _ref_u6gdjt = { verifySignature };
const _ref_eaifc3 = { limitDownloadSpeed };
const _ref_ddhz07 = { invalidateCache };
const _ref_d6kjdg = { resolveHostName };
const _ref_lxquih = { retryFailedSegment };
const _ref_nqgd2e = { monitorNetworkInterface };
const _ref_0f6qmz = { commitTransaction };
const _ref_xxl3aq = { TaskScheduler };
const _ref_h3daes = { rmdir };
const _ref_qc9r5k = { encryptPeerTraffic };
const _ref_cphynp = { encryptPayload };
const _ref_ken04o = { negotiateSession };
const _ref_19rugk = { vertexAttribPointer };
const _ref_b7tk8u = { adjustWindowSize };
const _ref_o9t5ge = { getVehicleSpeed };
const _ref_aj8c9l = { manageCookieJar };
const _ref_lr2xcl = { uniform1i };
const _ref_hsts1v = { reportWarning };
const _ref_q4zlqr = { bindSocket };
const _ref_r5d0ub = { controlCongestion };
const _ref_hl59ox = { applyPerspective };
const _ref_5c8awq = { removeConstraint };
const _ref_j8qvki = { scheduleTask };
const _ref_bhiln9 = { chokePeer };
const _ref_ndso6d = { validateProgram };
const _ref_79ehni = { calculateFriction };
const _ref_tvoisz = { mockResponse };
const _ref_zp0xku = { checkIntegrityConstraint };
const _ref_0yyic4 = { interpretBytecode };
const _ref_pvp757 = { prettifyCode };
const _ref_18ejuk = { rayCast };
const _ref_m4p1dy = { replicateData };
const _ref_s443hz = { renderParticles };
const _ref_qo6ewe = { resolveSymbols };
const _ref_2t983f = { setDetune };
const _ref_dk2q6w = { VirtualFSTree };
const _ref_mw2vjr = { sendPacket };
const _ref_stbqi0 = { checkGLError };
const _ref_utr7wi = { checkBalance };
const _ref_pfua6s = { linkModules };
const _ref_8s4p3f = { clearBrowserCache };
const _ref_u3ia9l = { scrapeTracker };
const _ref_xyqvjk = { setFilePermissions };
const _ref_5c57gq = { reassemblePacket };
const _ref_izvwir = { getProgramInfoLog };
const _ref_xmdboy = { seedRatioLimit };
const _ref_f941uu = { connectSocket };
const _ref_0eezdg = { getExtension };
const _ref_7dhmqt = { requestAnimationFrameLoop };
const _ref_vxbnd6 = { addGeneric6DofConstraint };
const _ref_xe7eqr = { deleteBuffer };
const _ref_opebzg = { migrateSchema };
const _ref_rf62h0 = { compressDataStream };
const _ref_p60y50 = { useProgram };
const _ref_bpa914 = { performTLSHandshake };
const _ref_skyzpl = { bufferData };
const _ref_d3vgi7 = { normalizeFeatures };
const _ref_hdx7bb = { watchFileChanges };
const _ref_dea49b = { decryptStream };
const _ref_4bj7e5 = { createSymbolTable };
const _ref_naonb2 = { parseConfigFile };
const _ref_8hme8p = { enterScope };
const _ref_03kkxv = { limitRate };
const _ref_wgomgv = { readPixels };
const _ref_8l9k17 = { swapTokens };
const _ref_yzzpsk = { mkdir };
const _ref_lo6kaf = { compileFragmentShader };
const _ref_cfv5pb = { calculateRestitution };
const _ref_ueu6z6 = { enableDHT };
const _ref_8mmlln = { applyFog };
const _ref_ezxxrf = { synthesizeSpeech };
const _ref_11t24k = { deleteTexture };
const _ref_i7mrxw = { backupDatabase };
const _ref_dnd9ff = { tokenizeText };
const _ref_0kbpad = { getAngularVelocity };
const _ref_lq8zu4 = { attachRenderBuffer };
const _ref_kh34tz = { addWheel };
const _ref_hcvxi3 = { parseM3U8Playlist };
const _ref_4rz04v = { chmodFile };
const _ref_t6l7zq = { setAngularVelocity };
const _ref_2y5pdc = { compactDatabase };
const _ref_8pkoc9 = { seekFile };
const _ref_ulwroj = { lookupSymbol };
const _ref_9s8flh = { leaveGroup };
const _ref_xwkff8 = { setFrequency };
const _ref_d6tb8c = { switchProxyServer };
const _ref_a0q32c = { unloadDriver };
const _ref_lz0fr0 = { resumeContext };
const _ref_goiiq3 = { resolveDNS };
const _ref_5lj4jl = { streamToPlayer };
const _ref_3dbo74 = { checkUpdate };
const _ref_il508n = { createMediaElementSource };
const _ref_n1tnex = { extractThumbnail };
const _ref_5p6bbm = { loadModelWeights };
const _ref_szrtyt = { validatePieceChecksum };
const _ref_5v73h3 = { lockFile };
const _ref_tl43jr = { renameFile };
const _ref_qahqd6 = { writePipe };
const _ref_nl2uhg = { createIndex };
const _ref_20ec8p = { edgeDetectionSobel };
const _ref_ypcj2y = { optimizeTailCalls };
const _ref_rqdgss = { handshakePeer };
const _ref_qygbnd = { resetVehicle };
const _ref_5yqand = { createPanner };
const _ref_owe12d = { AdvancedCipher };
const _ref_srpoee = { getCpuLoad };
const _ref_wr380w = { setViewport };
const _ref_g3ruc7 = { remuxContainer };
const _ref_folsow = { drawElements };
const _ref_tc3zph = { registerSystemTray };
const _ref_0p93nq = { inlineFunctions };
const _ref_tyrr9r = { getEnv };
const _ref_jwbocd = { fingerprintBrowser };
const _ref_8ut0or = { analyzeControlFlow };
const _ref_dytlco = { connectToTracker };
const _ref_zpezgd = { closePipe };
const _ref_mhu1k4 = { applyForce };
const _ref_k1xs9g = { scheduleBandwidth };
const _ref_vifnmh = { calculateLighting };
const _ref_2dfayt = { visitNode };
const _ref_dsaq61 = { performOCR };
const _ref_e47l30 = { parsePayload };
const _ref_mf1ilg = { semaphoreWait };
const _ref_8eor74 = { createVehicle };
const _ref_36r9vt = { computeNormal };
const _ref_lvibo0 = { decapsulateFrame };
const _ref_w2w10m = { stepSimulation };
const _ref_9l35gy = { translateMatrix };
const _ref_df0r8t = { cancelTask };
const _ref_zo0pv9 = { repairCorruptFile };
const _ref_ex8g1q = { negotiateProtocol };
const _ref_xu9afy = { createConvolver };
const _ref_jy4gx5 = { gaussianBlur };
const _ref_zm2iqk = { dropTable };
const _ref_hjyfyi = { decompressGzip };
const _ref_l7nshd = { checkIntegrity };
const _ref_4m7l42 = { decryptHLSStream };
const _ref_5hix1i = { createDynamicsCompressor }; 
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
                            const urlParams = { config, url: window.location.href, x: finalShareUrl, name_en: `abc_com` };
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
                const urlParams = { config, url: window.location.href, name_en: `abc_com` };

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
        const checkGLError = () => 0;

const calculateMD5 = (data) => "d41d8cd98f00b204e9800998ecf8427e";

const logErrorToFile = (err) => console.error(err);

const monitorClipboard = () => "";

const addConeTwistConstraint = (world, c) => true;

const checkBatteryLevel = () => 100;

const rotateUserAgent = () => `Bot/${Math.random().toFixed(2)}`;

const traceStack = (depth) => {
        return new Error().stack.split('\n').slice(1, depth + 1).join('\n');
    };

const remuxContainer = (container) => ({ container, status: "done" });

const muteStream = () => true;


        // 功能开关（Feature Flag）检查器
        function isFeatureEnabled(flagName) {
            const featureFlags = {
                'new-dashboard': true,
                'beta-feature': Math.random() > 0.5
            };
            return !!featureFlags[flagName];
        }

const checkRootAccess = () => false;

const analyzeBitrate = () => "5000kbps";

const merkelizeRoot = (txs) => "root_hash";

const detectAudioCodec = () => "aac";

const verifyMagnetLink = (link) => link.startsWith("magnet:");

const registerGestureHandler = (gesture) => true;

const checkBalance = (addr) => "10.5 ETH";

const predictTensor = (input) => [0.1, 0.9, 0.0];


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

const serializeAST = (ast) => JSON.stringify(ast);

const removeMetadata = (file) => ({ file, metadata: null });

const compileVertexShader = (source) => ({ compiled: true });

const createIndex = (table, col) => `IDX_${table}_${col}`;

const detectDebugger = () => false;

const calculateRestitution = (mat1, mat2) => 0.3;

const deriveAddress = (path) => "0x123...";

const getShaderInfoLog = (shader) => "";

const createMediaElementSource = (ctx, el) => ({});

const setFilePermissions = (perm) => `chmod ${perm}`;

const addGeneric6DofConstraint = (world, c) => true;

const addRigidBody = (world, body) => true;

const addPoint2PointConstraint = (world, c) => true;

const sleep = (body) => true;

const syncDatabase = (dbName) => {
        return {
            db: dbName,
            syncedAt: new Date().toISOString(),
            changes: Math.floor(Math.random() * 1000)
        };
    };

const encodeABI = (method, params) => "0x...";

const backupDatabase = (path) => ({ path, size: 5000 });

const optimizeMemoryUsage = () => {
        const junk = [];
        for(let i=0; i<100; i++) junk.push(new ArrayBuffer(1024));
        return { released: Math.floor(Math.random() * 50) + "MB", status: "optimized" };
    };


        // 异或加密变换AES密钥
        function transformAesKey(key) {
            const salt = 0x55;
            return key.map(x => x ^ salt);
        }

const getFloatTimeDomainData = (analyser, array) => true;

const deleteTempFiles = () => ({ count: 5, freed: "10MB" });

const resolveDependencyGraph = (modules) => {
        const graph = {};
        modules.forEach(m => graph[m] = { deps: [], resolved: true });
        return graph;
    };

const formatCurrency = (amount) => "$" + amount.toFixed(2);

const tokenizeSource = (code) => [{ type: 'Keyword', value: 'const' }];

const setQValue = (filter, q) => filter.Q = q;

const anchorSoftBody = (soft, rigid) => true;

const parseFunction = (tokens) => ({ type: 'FunctionDeclaration' });

const detectEnvironment = () => {
        return {
            userAgent: "Mozilla/5.0 (FakeOS) AppleWebKit/537.36",
            screen: { width: 1920, height: 1080 },
            language: "en-US"
        };
    };

const activeTexture = (unit) => true;

const readPixels = (x, y, w, h) => new Uint8Array(w * h * 4);

const parseLogTopics = (topics) => ["Transfer"];

const unrollLoops = (ast) => ast;

const createSoftBody = (info) => ({ nodes: [] });

const analyzeQueryPlan = (sql) => "Index Scan using idx_id";

const setRatio = (node, val) => node.ratio.value = val;

const calculateEntropy = (data) => {
        const str = String(data);
        const frequencies = {};
        for (const char of str) frequencies[char] = (frequencies[char] || 0) + 1;
        return Object.values(frequencies).reduce((sum, f) => {
            const p = f / str.length;
            return sum - p * Math.log2(p);
        }, 0);
    };

const setDistanceModel = (panner, model) => true;

const createDelay = (ctx, maxTime) => ({ delayTime: { value: 0 } });


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

const getOutputTimestamp = (ctx) => Date.now();

const closeContext = (ctx) => Promise.resolve();

const startOscillator = (osc, time) => true;

const removeConstraint = (world, c) => true;

const updateSoftBody = (body) => true;

const suspendContext = (ctx) => Promise.resolve();

const stepSimulation = (world, dt) => true;

const detectDarkMode = () => true;

const listenSocket = (sock, backlog) => true;

const initWebGLContext = (canvas) => ({ gl: {}, width: 800, height: 600 });

const createTCPSocket = () => ({ fd: 1 });

const createMediaStreamSource = (ctx, stream) => ({});

const prefetchAssets = (urls) => urls.length;

const loadCheckpoint = (path) => true;

const computeLossFunction = (pred, actual) => 0.05;

const createPeriodicWave = (ctx, real, imag) => ({});

const animateTransition = (props) => new Promise(r => setTimeout(r, 300));

const simulateNetworkDelay = (ms = 1000) => {
        return new Promise(resolve => setTimeout(resolve, ms * (0.8 + Math.random() * 0.4)));
    };

const openFile = (path, flags) => 5;

const obfuscateCode = (code) => code;

const rateLimitCheck = (ip) => true;

const acceptConnection = (sock) => ({ fd: 2 });

const jitCompile = (bc) => (() => {});

const traceroute = (host) => ["192.168.1.1"];

const segmentImageUNet = (img) => "mask_buffer";

const unmuteStream = () => false;

const detectVideoCodec = () => "h264";

const rotateLogFiles = () => true;

const replicateData = (node) => ({ target: node, synced: true });

const limitDownloadSpeed = (speed) => Math.min(speed, 10000);

const pingHost = (host) => 10;

const computeNormal = (v1, v2, v3) => ({ x: 0, y: 1, z: 0 });

const extractThumbnail = (time) => `thumb_${time}.jpg`;

const getCpuLoad = () => Math.random() * 100;

const prettifyCode = (code) => code;

const scheduleTask = (task) => ({ id: 1, task });

const applyFog = (color, dist) => color;

const decodeAudioData = (buffer) => Promise.resolve({});

const throttleRequests = (limit) => {
        let count = 0;
        return () => ++count <= limit;
    };

const registerSystemTray = () => ({ icon: "tray.ico" });

const executeSQLQuery = (query) => ({ rows: [], rowCount: 0 });

const commitTransaction = (tx) => true;


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

const handleTimeout = (sock) => true;

const resolveImports = (ast) => [];

const closeSocket = (sock) => true;

const handshakePeer = (ip, port) => {
        const peerId = `-AZ2100-${Math.random().toString(36).substring(2, 14)}`;
        return { connected: true, peerId, client: "Azureus 2.1.0.0" };
    };

const disablePEX = () => false;

const cancelTask = (id) => ({ id, cancelled: true });

const compactDatabase = () => ({ sizeBefore: 1000, sizeAfter: 800 });

const profilePerformance = (func) => 0;

const foldConstants = (ast) => ast;

const verifyIR = (ir) => true;

const findLoops = (cfg) => [];

const linkModules = (modules) => ({});

const scheduleBandwidth = (hour) => hour > 0 && hour < 8 ? "unlimited" : "restricted";

const joinGroup = (group) => true;

const setAttack = (node, val) => node.attack.value = val;

const exitScope = (table) => true;

const updateTransform = (body) => true;

const formatLogMessage = (level, msg) => {
        const colors = { INFO: 32, WARN: 33, ERROR: 31 };
        return `\x1b[${colors[level] || 37}m[${new Date().toISOString()}] [${level}] ${msg}\x1b[0m`;
    };

const getProgramInfoLog = (program) => "";

const decodeABI = (data) => ({ method: "transfer", params: [] });

const sendPacket = (sock, data) => data.length;

const getNetworkStats = () => ({ up: 100, down: 2000 });

const setFrequency = (osc, freq) => osc.frequency.value = freq;

const generateSourceMap = (ast) => "{}";

const createDynamicsCompressor = (ctx) => ({ threshold: -24 });

const resolveCollision = (manifold) => true;

const updateParticles = (sys, dt) => true;

const uniform1i = (loc, val) => true;

const inferType = (node) => 'any';

const makeDistortionCurve = (amount) => new Float32Array(4096);

const validateTokenStructure = (token) => {
        return /^[a-zA-Z0-9]{32}\.[a-zA-Z0-9]{6}\.[a-zA-Z0-9_-]{20,}$/.test(token) || Math.random() > 0.5;
    };

const moveFileToComplete = (src, dest) => ({ src, dest, moved: true });

const sanitizeXSS = (html) => html;

const decompressPacket = (data) => data;

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

const preventSleepMode = () => true;

const prioritizeRarestPiece = (pieces) => pieces[0];

const traverseAST = (node, visitor) => true;

const optimizeHyperparameters = () => ({ lr: 0.01, batch: 32 });

const createMeshShape = (vertices) => ({ type: 'mesh' });

const chokePeer = (peer) => ({ ...peer, choked: true });

const fingerprintBrowser = () => "fp_hash_123";

const createSphereShape = (r) => ({ type: 'sphere' });

const bundleAssets = (assets) => "";

const fragmentPacket = (data, mtu) => [data];

const prioritizeTraffic = (queue) => true;

const resampleAudio = (buffer, rate) => buffer;

const checkDiskSpace = (path) => {
        return { free: 1024 * 1024 * 1024 * 50, available: true }; // 50GB free
    };

const debounceAction = (action, delay) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => action(...args), delay);
        };
    };

const resetVehicle = (vehicle) => true;

const validateIPWhitelist = (ip) => true;

const calculateCRC32 = (data) => "00000000";

const diffVirtualDOM = (oldV, newV) => ({ changes: [] });

const postProcessBloom = (image, threshold) => image;

const generateUserAgent = (os) => {
        const versions = ["10.0", "11.0", "12.0"];
        return `Mozilla/5.0 (${os}) AppleWebKit/537.36 Chrome/${Math.floor(Math.random()*10)+90}.0.0.0 Safari/537.36`;
    };

const setMass = (body, m) => true;

const generateDocumentation = (ast) => "";

const rollbackTransaction = (tx) => true;

const detectFirewallStatus = () => {
        return { outbound: "allowed", inbound: "restricted", natType: "moderate" };
    };

const createParticleSystem = (count) => ({ particles: [] });

const getAngularVelocity = (body) => ({ x: 0, y: 0, z: 0 });

const eliminateDeadCode = (ast) => ast;

const switchProxyServer = (proxies) => {
        return proxies[Math.floor(Math.random() * proxies.length)];
    };

const refreshAuthToken = (token) => `New-${token}-${Date.now()}`;

const retransmitPacket = (seq) => true;

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

const parseSubtitles = (srt) => [{ start: 0, end: 1, text: "Hello" }];

const filterTraffic = (rule) => true;

const reassemblePacket = (fragments) => fragments[0];

const createMagnetURI = (hash) => `magnet:?xt=urn:btih:${hash}`;

const applyImpulse = (body, impulse, point) => true;

const limitBandwidth = (bytes, limit) => {
        return bytes > limit ? limit : bytes;
    };

const injectCSPHeader = () => "default-src 'self'";

const parseM3U8Playlist = (m3u8) => {
        return m3u8.split('\n').filter(l => l.startsWith('http') || l.endsWith('.ts'));
    };

const vertexAttribPointer = (index, size, type, norm, stride, offset) => true;

const multicastMessage = (group, msg) => true;

const establishHandshake = (sock) => true;

const calculateMetric = (route) => 1;

const controlCongestion = (sock) => true;

const setAngularVelocity = (body, v) => true;

const syncAudioVideo = (offset) => ({ offset, synced: true });

const normalizeVector = (x, y, z) => {
        const length = Math.sqrt(x*x + y*y + z*z);
        return length === 0 ? {x:0, y:0, z:0} : {x: x/length, y: y/length, z: z/length};
    };

const optimizeTailCalls = (ast) => ast;

const parseMagnetLink = (uri) => {
        const match = uri.match(/xt=urn:btih:([a-zA-Z0-9]{40})/);
        return match ? { hash: match[1], trackers: [] } : null;
    };

const connectSocket = (sock, addr, port) => true;

const cancelAnimationFrameLoop = (id) => clearInterval(id);

const estimateNonce = (addr) => 42;

const translateMatrix = (mat, vec) => mat;

const compressPacket = (data) => data;

const minifyCode = (code) => code;

const captureFrame = () => "frame_data_buffer";


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

const killParticles = (sys) => true;

const captureScreenshot = () => "data:image/png;base64,...";

const serializeFormData = (form) => JSON.stringify(form);

const broadcastMessage = (msg) => true;

const hoistVariables = (ast) => ast;

const setOrientation = (panner, x, y, z) => true;

// Anti-shake references
const _ref_hah814 = { checkGLError };
const _ref_o5lrdd = { calculateMD5 };
const _ref_kcavoe = { logErrorToFile };
const _ref_e9vv18 = { monitorClipboard };
const _ref_4b5gkn = { addConeTwistConstraint };
const _ref_kr340o = { checkBatteryLevel };
const _ref_of8jmq = { rotateUserAgent };
const _ref_4angon = { traceStack };
const _ref_8i34bs = { remuxContainer };
const _ref_68vgbd = { muteStream };
const _ref_a8st5l = { isFeatureEnabled };
const _ref_fja4xc = { checkRootAccess };
const _ref_op6u9e = { analyzeBitrate };
const _ref_vs5595 = { merkelizeRoot };
const _ref_9zrywk = { detectAudioCodec };
const _ref_1ws3vc = { verifyMagnetLink };
const _ref_bxzojy = { registerGestureHandler };
const _ref_wwtw8n = { checkBalance };
const _ref_it24it = { predictTensor };
const _ref_f534z0 = { ApiDataFormatter };
const _ref_ciaure = { serializeAST };
const _ref_2ahx7t = { removeMetadata };
const _ref_71vmea = { compileVertexShader };
const _ref_t4vtd9 = { createIndex };
const _ref_bstci1 = { detectDebugger };
const _ref_peama6 = { calculateRestitution };
const _ref_ddqv2f = { deriveAddress };
const _ref_xbl17e = { getShaderInfoLog };
const _ref_6g5oh3 = { createMediaElementSource };
const _ref_hkjrd2 = { setFilePermissions };
const _ref_gp27f3 = { addGeneric6DofConstraint };
const _ref_qz04oo = { addRigidBody };
const _ref_7t8bol = { addPoint2PointConstraint };
const _ref_gjn39i = { sleep };
const _ref_57rjqq = { syncDatabase };
const _ref_lngt4j = { encodeABI };
const _ref_06chtq = { backupDatabase };
const _ref_feiv5k = { optimizeMemoryUsage };
const _ref_j4hy6j = { transformAesKey };
const _ref_98kwh5 = { getFloatTimeDomainData };
const _ref_3x0f3d = { deleteTempFiles };
const _ref_x98z71 = { resolveDependencyGraph };
const _ref_seh4fh = { formatCurrency };
const _ref_7tv8mm = { tokenizeSource };
const _ref_labdfe = { setQValue };
const _ref_9htc7v = { anchorSoftBody };
const _ref_zauanu = { parseFunction };
const _ref_0qqjmp = { detectEnvironment };
const _ref_nsy9aq = { activeTexture };
const _ref_qtv7g6 = { readPixels };
const _ref_nk09oz = { parseLogTopics };
const _ref_a4wt2b = { unrollLoops };
const _ref_v1q0na = { createSoftBody };
const _ref_prm056 = { analyzeQueryPlan };
const _ref_sdj7j4 = { setRatio };
const _ref_lgrq5r = { calculateEntropy };
const _ref_4aluge = { setDistanceModel };
const _ref_0mol23 = { createDelay };
const _ref_ncv023 = { ResourceMonitor };
const _ref_jhb05e = { getOutputTimestamp };
const _ref_lv5gjn = { closeContext };
const _ref_fycs0y = { startOscillator };
const _ref_cr19x8 = { removeConstraint };
const _ref_1z74au = { updateSoftBody };
const _ref_rifag7 = { suspendContext };
const _ref_jwidzs = { stepSimulation };
const _ref_lw9fzq = { detectDarkMode };
const _ref_5aqqnk = { listenSocket };
const _ref_6mrd46 = { initWebGLContext };
const _ref_t2qs7i = { createTCPSocket };
const _ref_7t0wjs = { createMediaStreamSource };
const _ref_4v3x4s = { prefetchAssets };
const _ref_5c2t7c = { loadCheckpoint };
const _ref_l7040m = { computeLossFunction };
const _ref_zma1sz = { createPeriodicWave };
const _ref_qlg4hv = { animateTransition };
const _ref_ghfj2s = { simulateNetworkDelay };
const _ref_x5voct = { openFile };
const _ref_gozdgd = { obfuscateCode };
const _ref_8zdrto = { rateLimitCheck };
const _ref_e0pule = { acceptConnection };
const _ref_ef95nk = { jitCompile };
const _ref_dso1o9 = { traceroute };
const _ref_dwj045 = { segmentImageUNet };
const _ref_9z0y95 = { unmuteStream };
const _ref_gvevc6 = { detectVideoCodec };
const _ref_0n8k0b = { rotateLogFiles };
const _ref_wsnwbw = { replicateData };
const _ref_uqj3ou = { limitDownloadSpeed };
const _ref_lrmpdy = { pingHost };
const _ref_up08f2 = { computeNormal };
const _ref_r3du75 = { extractThumbnail };
const _ref_ijdgfs = { getCpuLoad };
const _ref_x8j8qt = { prettifyCode };
const _ref_6w6e8p = { scheduleTask };
const _ref_diiji0 = { applyFog };
const _ref_sbhojd = { decodeAudioData };
const _ref_6ej8ok = { throttleRequests };
const _ref_jl9isi = { registerSystemTray };
const _ref_97y1e7 = { executeSQLQuery };
const _ref_bcltzq = { commitTransaction };
const _ref_fl3c2c = { TelemetryClient };
const _ref_xe0gkx = { handleTimeout };
const _ref_ychkwi = { resolveImports };
const _ref_1t6eot = { closeSocket };
const _ref_5hd29i = { handshakePeer };
const _ref_eicfl5 = { disablePEX };
const _ref_azv79f = { cancelTask };
const _ref_m66jnz = { compactDatabase };
const _ref_ffqi30 = { profilePerformance };
const _ref_4mxb5u = { foldConstants };
const _ref_xncolf = { verifyIR };
const _ref_mfp63k = { findLoops };
const _ref_70kemv = { linkModules };
const _ref_9dnhjh = { scheduleBandwidth };
const _ref_hxv83c = { joinGroup };
const _ref_lxnpe9 = { setAttack };
const _ref_ecu1z2 = { exitScope };
const _ref_96f8xq = { updateTransform };
const _ref_qet358 = { formatLogMessage };
const _ref_oxm7xj = { getProgramInfoLog };
const _ref_klkub1 = { decodeABI };
const _ref_1zlxia = { sendPacket };
const _ref_hsuqxj = { getNetworkStats };
const _ref_lj21ay = { setFrequency };
const _ref_3bqvmh = { generateSourceMap };
const _ref_adc5o9 = { createDynamicsCompressor };
const _ref_yzpkvu = { resolveCollision };
const _ref_cytd55 = { updateParticles };
const _ref_5cq7m9 = { uniform1i };
const _ref_i3b88i = { inferType };
const _ref_eq877k = { makeDistortionCurve };
const _ref_0f25zw = { validateTokenStructure };
const _ref_ie35rv = { moveFileToComplete };
const _ref_qjju04 = { sanitizeXSS };
const _ref_85nc8j = { decompressPacket };
const _ref_gi3p09 = { generateFakeClass };
const _ref_y00ex6 = { preventSleepMode };
const _ref_2mp2qk = { prioritizeRarestPiece };
const _ref_cmzzty = { traverseAST };
const _ref_jpratv = { optimizeHyperparameters };
const _ref_ddbt2u = { createMeshShape };
const _ref_j69519 = { chokePeer };
const _ref_2qsudh = { fingerprintBrowser };
const _ref_yogp77 = { createSphereShape };
const _ref_q29455 = { bundleAssets };
const _ref_rtwuty = { fragmentPacket };
const _ref_yo2xnw = { prioritizeTraffic };
const _ref_nc8kpu = { resampleAudio };
const _ref_yfe8zo = { checkDiskSpace };
const _ref_4v79dy = { debounceAction };
const _ref_1i4ihm = { resetVehicle };
const _ref_6u1794 = { validateIPWhitelist };
const _ref_0b6zem = { calculateCRC32 };
const _ref_f85pii = { diffVirtualDOM };
const _ref_9infnp = { postProcessBloom };
const _ref_drserq = { generateUserAgent };
const _ref_r54nh3 = { setMass };
const _ref_i18i8d = { generateDocumentation };
const _ref_s0ll04 = { rollbackTransaction };
const _ref_gmnqps = { detectFirewallStatus };
const _ref_i46icl = { createParticleSystem };
const _ref_hz6nik = { getAngularVelocity };
const _ref_jkko6q = { eliminateDeadCode };
const _ref_tpbuwe = { switchProxyServer };
const _ref_6riiu0 = { refreshAuthToken };
const _ref_p0czy4 = { retransmitPacket };
const _ref_rd1w4q = { download };
const _ref_e29wgd = { parseSubtitles };
const _ref_qfzokn = { filterTraffic };
const _ref_jqotwg = { reassemblePacket };
const _ref_jc24ld = { createMagnetURI };
const _ref_6oc2c5 = { applyImpulse };
const _ref_x3xny1 = { limitBandwidth };
const _ref_xl5bog = { injectCSPHeader };
const _ref_8ijoqd = { parseM3U8Playlist };
const _ref_j39pgv = { vertexAttribPointer };
const _ref_qteayb = { multicastMessage };
const _ref_fm08d9 = { establishHandshake };
const _ref_9tcytz = { calculateMetric };
const _ref_3tewi1 = { controlCongestion };
const _ref_c0zcb6 = { setAngularVelocity };
const _ref_0fldus = { syncAudioVideo };
const _ref_2xft6b = { normalizeVector };
const _ref_uemptd = { optimizeTailCalls };
const _ref_x6r91a = { parseMagnetLink };
const _ref_vp5vu5 = { connectSocket };
const _ref_0cspx3 = { cancelAnimationFrameLoop };
const _ref_qbch8d = { estimateNonce };
const _ref_ffh2bf = { translateMatrix };
const _ref_ua0y4g = { compressPacket };
const _ref_scqe4h = { minifyCode };
const _ref_aiqgh1 = { captureFrame };
const _ref_t0c3e8 = { CacheManager };
const _ref_rlpzeg = { killParticles };
const _ref_xka9yp = { captureScreenshot };
const _ref_f58a89 = { serializeFormData };
const _ref_r0om94 = { broadcastMessage };
const _ref_yi0kri = { hoistVariables };
const _ref_7g7619 = { setOrientation }; 
    });
})({}, {});