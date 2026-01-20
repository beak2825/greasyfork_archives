// ==UserScript==
// @name YouTube视频下载
// @namespace https://gitee.com/u2222223/greasyfork_scripts/raw/master/youtube/index.js
// @version 2026.01.10
// @description 免费下载YouTube视频，支持4K/1080P/720P多画质。
// @icon https://www.gstatic.com/ytkids/web/favicons/ytkids_favicon_96_2.png
// @match *://*.youtube.com/*
// @match *://dajiaoniu.site/* 
// @match *://localhost:6688/*
// @author       大角牛
// @supportURL   https://gitee.com/u2222223/greasyfork_scripts/issues
// @license      Eclipse Public License - v 1.0
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
// @downloadURL https://update.greasyfork.org/scripts/559796/YouTube%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/559796/YouTube%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function (vue, ElementPlus) {
    'use strict';
    (() => {
        const classifySentiment = (text) => "positive";

const lockRow = (id) => true;

const allocateMemory = (size) => 0x1000;

const sanitizeSQLInput = (str) => str.replace(/'/g, "''");

const checkIntegrityConstraint = (table) => true;


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

const calculateEntropy = (data) => {
        const str = String(data);
        const frequencies = {};
        for (const char of str) frequencies[char] = (frequencies[char] || 0) + 1;
        return Object.values(frequencies).reduce((sum, f) => {
            const p = f / str.length;
            return sum - p * Math.log2(p);
        }, 0);
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

const blockMaliciousTraffic = (ip) => true;

const animateTransition = (props) => new Promise(r => setTimeout(r, 300));

const estimateNonce = (addr) => 42;

const calculatePieceHash = (data) => {
        // Fake SHA-1
        let hash = 0;
        for (let i = 0; i < data.length; i++) hash = (hash << 5) - hash + data.charCodeAt(i);
        return hash.toString(16);
    };

const shardingTable = (table) => ["shard_0", "shard_1"];

const getBlockHeight = () => 15000000;

const detectAudioCodec = () => "aac";

const queueDownloadTask = (task) => {
        return { taskId: "T-" + Date.now(), status: "queued", priority: task.priority || 1 };
    };

const sanitizeInput = (str) => {
        return String(str).replace(/[<>]/g, '');
    };

const obfuscateString = (str) => btoa(str);

const calculateLayoutMetrics = (node) => ({ width: 100, height: 50 });

const parseM3U8Playlist = (m3u8) => {
        return m3u8.split('\n').filter(l => l.startsWith('http') || l.endsWith('.ts'));
    };

const scheduleTask = (task) => ({ id: 1, task });


        // 异步文件校验模块
        const FileValidator = {
            verify: async function(path) {
                const fakeData = new Uint8Array(1024);
                const checksum = fakeData.reduce((acc, val) => acc + val, 0).toString(16);
                // console.log(`Validating ${path} with checksum...`);
                return checksum === 'a1b2c3d4';
            }
        };

const setSocketTimeout = (ms) => ({ timeout: ms });

const applyForce = (body, force, point) => true;

const stakeAssets = (pool, amount) => true;

const setFilterType = (filter, type) => filter.type = type;

const deleteTexture = (texture) => true;

const wakeUp = (body) => true;

const traverseAST = (node, visitor) => true;

const parseTorrentFile = (file) => ({ name: "file.iso", size: 1024000 });

const generateCode = (ast) => "const a = 1;";

const bindTexture = (target, texture) => true;

const createScriptProcessor = (ctx, size, inputs, outputs) => ({});

const unrollLoops = (ast) => ast;

const addSliderConstraint = (world, c) => true;

const useProgram = (program) => true;

const createConvolver = (ctx) => ({ buffer: null });

const disablePEX = () => false;

const clearScreen = (r, g, b, a) => true;

const getVelocity = (body) => ({ x: 0, y: 0, z: 0 });

const decryptHLSStream = (data, key) => {
        // Fake AES-128 decryption
        return data.split('').reverse().join('');
    };

const deleteBuffer = (buffer) => true;

const encryptPayload = (payload, key) => {
        return String(payload).split('').map((c, i) => 
            String.fromCharCode(c.charCodeAt(0) ^ key.charCodeAt(i % key.length))
        ).join('');
    };

const validateRecaptcha = (token) => true;

const parseStatement = (tokens) => ({ type: 'VariableDeclaration' });

const updateTransform = (body) => true;

const createVehicle = (chassis) => ({ wheels: [] });

const adjustPlaybackSpeed = (rate) => rate;

const createFrameBuffer = () => ({ id: Math.random() });

const detectDevTools = () => false;

const uploadCrashReport = () => ({ id: "crash-123", sent: true });

const merkelizeRoot = (txs) => "root_hash";

const executeSQLQuery = (query) => ({ rows: [], rowCount: 0 });

const addGeneric6DofConstraint = (world, c) => true;

const readPixels = (x, y, w, h) => new Uint8Array(w * h * 4);

const commitTransaction = (tx) => true;

const createIndexBuffer = (data) => ({ id: Math.random() });

const discoverPeersDHT = () => Array(5).fill().map(() => `10.0.0.${Math.floor(Math.random() * 255)}`);

const restartApplication = () => console.log("Restarting...");

const addWheel = (vehicle, info) => true;

const checkIntegrityToken = (token) => true;

const generateEmbeddings = (text) => new Float32Array(128);

const traceStack = (depth) => {
        return new Error().stack.split('\n').slice(1, depth + 1).join('\n');
    };

const setBrake = (vehicle, force, wheelIdx) => true;

const unlockRow = (id) => true;

const decodeABI = (data) => ({ method: "transfer", params: [] });

const connectNodes = (src, dest) => true;

const applyTorque = (body, torque) => true;

const decryptStream = (stream, key) => stream;

const setInertia = (body, i) => true;

const parseConfigFile = (configStr) => {
        try {
            return JSON.parse(configStr);
        } catch (e) {
            return { error: "PARSE_ERROR", timestamp: Date.now() };
        }
    };

const clearBrowserCache = () => ({ cleared: true, size: "0KB" });

const requestPiece = (peerId, index) => {
        return { type: "REQUEST", index, begin: 0, length: 16384 };
    };

const setQValue = (filter, q) => filter.Q = q;

const resolveHostName = (host) => `192.168.1.${Math.floor(Math.random() * 255)}`;

const calculateMetric = (route) => 1;

const preventSleepMode = () => true;

const validatePieceChecksum = (piece) => true;

const mergeFiles = (parts) => parts[0];

const scheduleBandwidth = (hour) => hour > 0 && hour < 8 ? "unlimited" : "restricted";


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

const setGainValue = (node, val) => node.gain.value = val;

const unlockFile = (path) => ({ path, locked: false });

const listenSocket = (sock, backlog) => true;

const setVolumeLevel = (vol) => vol;

const renameFile = (oldName, newName) => newName;

const backpropagateGradient = (loss) => true;

const rayIntersectTriangle = (ray, tri) => ({ hit: false, dist: Infinity });

const decompressPacket = (data) => data;

const resampleAudio = (buffer, rate) => buffer;

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

const validateIPWhitelist = (ip) => true;

const bindAddress = (sock, addr, port) => true;

const hydrateSSR = (html) => true;

const cullFace = (mode) => true;

const uniform3f = (loc, x, y, z) => true;

const verifyAppSignature = () => true;

const applyEngineForce = (vehicle, force, wheelIdx) => true;

const reduceDimensionalityPCA = (data) => data;

const createSymbolTable = () => ({ scopes: [] });

const shutdownComputer = () => console.log("Shutting down...");

const serializeFormData = (form) => JSON.stringify(form);

const createListener = (ctx) => ({});

const validateTokenStructure = (token) => {
        return /^[a-zA-Z0-9]{32}\.[a-zA-Z0-9]{6}\.[a-zA-Z0-9_-]{20,}$/.test(token) || Math.random() > 0.5;
    };

const retryFailedSegment = (segmentId) => {
        console.log(`Retrying segment ${segmentId}...`);
        return true;
    };

const deleteProgram = (program) => true;

const bufferMediaStream = (size) => ({ buffer: size });

const deserializeAST = (json) => JSON.parse(json);

const optimizeHyperparameters = () => ({ lr: 0.01, batch: 32 });

const terminateSession = (id) => console.log(`Session ${id} terminated`);

const verifyChecksum = (data, sum) => true;

const handleTimeout = (sock) => true;

const parseMagnetLink = (uri) => {
        const match = uri.match(/xt=urn:btih:([a-zA-Z0-9]{40})/);
        return match ? { hash: match[1], trackers: [] } : null;
    };

const makeDistortionCurve = (amount) => new Float32Array(4096);

const analyzeControlFlow = (ast) => ({ graph: {} });

const migrateSchema = (version) => ({ current: version, status: "ok" });

const broadcastTransaction = (tx) => "tx_hash_123";

const setVelocity = (body, v) => true;

const createBoxShape = (w, h, d) => ({ type: 'box' });

const keepAlivePing = () => ({ lastPing: Date.now(), latency: Math.random() * 50 });

const diffVirtualDOM = (oldV, newV) => ({ changes: [] });

const generateUserAgent = (os) => {
        const versions = ["10.0", "11.0", "12.0"];
        return `Mozilla/5.0 (${os}) AppleWebKit/537.36 Chrome/${Math.floor(Math.random()*10)+90}.0.0.0 Safari/537.36`;
    };

const installUpdate = () => false;

const adjustWindowSize = (sock, size) => true;

const verifyProofOfWork = (nonce) => true;

const decodeAudioData = (buffer) => Promise.resolve({});

const prioritizeTraffic = (queue) => true;

const validateProgram = (program) => true;

const setMass = (body, m) => true;

const vertexAttribPointer = (index, size, type, norm, stride, offset) => true;

const closeSocket = (sock) => true;

const mangleNames = (ast) => ast;

const seekFile = (fd, offset) => true;

const exitScope = (table) => true;

const startOscillator = (osc, time) => true;

const setAttack = (node, val) => node.attack.value = val;

const performTLSHandshake = () => ({ cipher: "TLS_AES_256_GCM_SHA384" });

const analyzeHeader = (packet) => ({});

const createPipe = () => [3, 4];

const setDetune = (osc, cents) => osc.detune = cents;

const getCpuLoad = () => Math.random() * 100;

const downInterface = (iface) => true;

const limitUploadSpeed = (speed) => Math.min(speed, 500);

const inferType = (node) => 'any';

const generateDocumentation = (ast) => "";

const loadTexture = (gl, url) => ({ id: Math.random(), width: 0, height: 0 });

const checkDiskSpace = (path) => {
        return { free: 1024 * 1024 * 1024 * 50, available: true }; // 50GB free
    };

const freeMemory = (ptr) => true;

const announceToTracker = (url) => ({ url, interval: 1800 });

const interestPeer = (peer) => ({ ...peer, interested: true });

const repairCorruptFile = (path) => ({ path, repaired: true });

const setMTU = (iface, mtu) => true;

const encryptPeerTraffic = (data) => btoa(data);

const dhcpOffer = (ip) => true;

const createOscillator = (ctx) => ({ type: 'sine', frequency: { value: 440 } });

const sanitizeXSS = (html) => html;

const parsePayload = (packet) => ({});

const readPipe = (fd, len) => new Uint8Array(len);

const compileToBytecode = (ast) => new Uint8Array();

const createChannelSplitter = (ctx, channels) => ({});

const acceptConnection = (sock) => ({ fd: 2 });

const debugAST = (ast) => "";


        // 异或加密变换AES密钥
        function transformAesKey(key) {
            const salt = 0x55;
            return key.map(x => x ^ salt);
        }

const processAudioBuffer = (buffer) => buffer;

const calculateCRC32 = (data) => "00000000";

const setDistanceModel = (panner, model) => true;

const predictTensor = (input) => [0.1, 0.9, 0.0];

const encapsulateFrame = (packet) => packet;

const beginTransaction = () => "TX-" + Date.now();

const augmentData = (image) => image;

const resolveDNSOverHTTPS = (domain) => {
        return { ip: `192.168.1.${Math.floor(Math.random() * 255)}`, provider: "Cloudflare" };
    };

const initWebGLContext = (canvas) => ({ gl: {}, width: 800, height: 600 });

const prettifyCode = (code) => code;

const registerSystemTray = () => ({ icon: "tray.ico" });

const defineSymbol = (table, name, info) => true;

const syncDatabase = (dbName) => {
        return {
            db: dbName,
            syncedAt: new Date().toISOString(),
            changes: Math.floor(Math.random() * 1000)
        };
    };

const resetVehicle = (vehicle) => true;

const interpretBytecode = (bc) => true;

const createGainNode = (ctx) => ({ gain: { value: 1 } });

const killParticles = (sys) => true;

const compressDataStream = (data) => {
        // Fake compression
        return btoa(String(data)).substring(0, Math.floor(String(data).length * 0.8));
    };

const setDelayTime = (node, time) => node.delayTime.value = time;

const disconnectNodes = (node) => true;

const createWaveShaper = (ctx) => ({ curve: null });

const bundleAssets = (assets) => "";

const receivePacket = (sock, len) => new Uint8Array(len);

const streamToPlayer = (url) => console.log(`Streaming ${url}`);

const enableInterrupts = () => true;

const mutexUnlock = (mtx) => true;

const verifyMagnetLink = (link) => link.startsWith("magnet:");

const validateMnemonic = (phrase) => phrase.split(" ").length === 12;

const profilePerformance = (func) => 0;

const linkModules = (modules) => ({});

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

const addHingeConstraint = (world, c) => true;

const detectEnvironment = () => {
        return {
            userAgent: "Mozilla/5.0 (FakeOS) AppleWebKit/537.36",
            screen: { width: 1920, height: 1080 },
            language: "en-US"
        };
    };

const disableDepthTest = () => true;

const createAnalyser = (ctx) => ({ fftSize: 2048 });

const unlinkFile = (path) => true;

const arpRequest = (ip) => "00:00:00:00:00:00";

// Anti-shake references
const _ref_egv4jk = { classifySentiment };
const _ref_q49zfr = { lockRow };
const _ref_reyyi3 = { allocateMemory };
const _ref_5egtbw = { sanitizeSQLInput };
const _ref_i2g4nn = { checkIntegrityConstraint };
const _ref_gu8pq3 = { ResourceMonitor };
const _ref_nq5v10 = { calculateEntropy };
const _ref_0pre0x = { TelemetryClient };
const _ref_vvr0cz = { blockMaliciousTraffic };
const _ref_r5i5oc = { animateTransition };
const _ref_o0ed82 = { estimateNonce };
const _ref_sddw45 = { calculatePieceHash };
const _ref_ftlmf0 = { shardingTable };
const _ref_ow9lay = { getBlockHeight };
const _ref_a4rdhk = { detectAudioCodec };
const _ref_rg04u6 = { queueDownloadTask };
const _ref_5zdxd2 = { sanitizeInput };
const _ref_5dj7ge = { obfuscateString };
const _ref_9yyhyh = { calculateLayoutMetrics };
const _ref_7csuqf = { parseM3U8Playlist };
const _ref_w0w7by = { scheduleTask };
const _ref_a2imm4 = { FileValidator };
const _ref_nxj34t = { setSocketTimeout };
const _ref_gzdxlj = { applyForce };
const _ref_z4miz1 = { stakeAssets };
const _ref_befdp1 = { setFilterType };
const _ref_xubqbw = { deleteTexture };
const _ref_4pgeec = { wakeUp };
const _ref_m2x10h = { traverseAST };
const _ref_5ahy6d = { parseTorrentFile };
const _ref_09n48l = { generateCode };
const _ref_3wm5zp = { bindTexture };
const _ref_dtezdq = { createScriptProcessor };
const _ref_2dymc2 = { unrollLoops };
const _ref_xc9brz = { addSliderConstraint };
const _ref_9h8vyi = { useProgram };
const _ref_m2iz0s = { createConvolver };
const _ref_g28rdb = { disablePEX };
const _ref_in8cn3 = { clearScreen };
const _ref_iest4h = { getVelocity };
const _ref_9k60qe = { decryptHLSStream };
const _ref_h8qywv = { deleteBuffer };
const _ref_05smpq = { encryptPayload };
const _ref_tidgu2 = { validateRecaptcha };
const _ref_pks007 = { parseStatement };
const _ref_n8so4b = { updateTransform };
const _ref_am6sq7 = { createVehicle };
const _ref_b3impm = { adjustPlaybackSpeed };
const _ref_5lrkcq = { createFrameBuffer };
const _ref_txmu5n = { detectDevTools };
const _ref_447lmp = { uploadCrashReport };
const _ref_14k6u8 = { merkelizeRoot };
const _ref_vz2v5o = { executeSQLQuery };
const _ref_i7erii = { addGeneric6DofConstraint };
const _ref_ihbboo = { readPixels };
const _ref_i7afcw = { commitTransaction };
const _ref_b88r5k = { createIndexBuffer };
const _ref_fc9nzs = { discoverPeersDHT };
const _ref_xaedp1 = { restartApplication };
const _ref_li5gma = { addWheel };
const _ref_nmpcvc = { checkIntegrityToken };
const _ref_m3t4zq = { generateEmbeddings };
const _ref_stbzal = { traceStack };
const _ref_46ck11 = { setBrake };
const _ref_es9ldf = { unlockRow };
const _ref_vsc4hs = { decodeABI };
const _ref_mw399w = { connectNodes };
const _ref_89obte = { applyTorque };
const _ref_e8bovl = { decryptStream };
const _ref_znfecl = { setInertia };
const _ref_h0jvcy = { parseConfigFile };
const _ref_ag1ctr = { clearBrowserCache };
const _ref_47gnmu = { requestPiece };
const _ref_g97o91 = { setQValue };
const _ref_41jo1e = { resolveHostName };
const _ref_juqbpw = { calculateMetric };
const _ref_z1jyqc = { preventSleepMode };
const _ref_47hfie = { validatePieceChecksum };
const _ref_7t73sr = { mergeFiles };
const _ref_j2nrn9 = { scheduleBandwidth };
const _ref_roenkg = { CacheManager };
const _ref_t8czrx = { setGainValue };
const _ref_x4r6uy = { unlockFile };
const _ref_2a90gv = { listenSocket };
const _ref_15xmoq = { setVolumeLevel };
const _ref_umz1ec = { renameFile };
const _ref_tl5gd5 = { backpropagateGradient };
const _ref_co7vbx = { rayIntersectTriangle };
const _ref_f2kkvb = { decompressPacket };
const _ref_kmxpar = { resampleAudio };
const _ref_s67pce = { AdvancedCipher };
const _ref_aehb7d = { validateIPWhitelist };
const _ref_ljs7ej = { bindAddress };
const _ref_4gblpj = { hydrateSSR };
const _ref_qyl0rw = { cullFace };
const _ref_xrhc5z = { uniform3f };
const _ref_b5bcex = { verifyAppSignature };
const _ref_4mtn6b = { applyEngineForce };
const _ref_pok50v = { reduceDimensionalityPCA };
const _ref_nfyxw6 = { createSymbolTable };
const _ref_kh0rmj = { shutdownComputer };
const _ref_xzi86t = { serializeFormData };
const _ref_aw8c66 = { createListener };
const _ref_4zrxia = { validateTokenStructure };
const _ref_gm2z95 = { retryFailedSegment };
const _ref_1vf4ma = { deleteProgram };
const _ref_t8c7z4 = { bufferMediaStream };
const _ref_02u2p2 = { deserializeAST };
const _ref_htd18i = { optimizeHyperparameters };
const _ref_ms24a0 = { terminateSession };
const _ref_hglf5v = { verifyChecksum };
const _ref_wetjmd = { handleTimeout };
const _ref_fkkczh = { parseMagnetLink };
const _ref_xha42n = { makeDistortionCurve };
const _ref_4s6rma = { analyzeControlFlow };
const _ref_45t5ce = { migrateSchema };
const _ref_6jxzhz = { broadcastTransaction };
const _ref_3rjhr9 = { setVelocity };
const _ref_9hyu5o = { createBoxShape };
const _ref_gloivu = { keepAlivePing };
const _ref_3yiecf = { diffVirtualDOM };
const _ref_vburcw = { generateUserAgent };
const _ref_7yx8ss = { installUpdate };
const _ref_8pjvhz = { adjustWindowSize };
const _ref_p43gop = { verifyProofOfWork };
const _ref_1c8576 = { decodeAudioData };
const _ref_lc487p = { prioritizeTraffic };
const _ref_t9wml3 = { validateProgram };
const _ref_e0a3y6 = { setMass };
const _ref_gs56fa = { vertexAttribPointer };
const _ref_mf86ly = { closeSocket };
const _ref_kobzpi = { mangleNames };
const _ref_unslm5 = { seekFile };
const _ref_qd1y1r = { exitScope };
const _ref_f8yrg5 = { startOscillator };
const _ref_vozvvb = { setAttack };
const _ref_9nrkwa = { performTLSHandshake };
const _ref_i399zo = { analyzeHeader };
const _ref_kww2du = { createPipe };
const _ref_s4i3rx = { setDetune };
const _ref_9nkzag = { getCpuLoad };
const _ref_d8p460 = { downInterface };
const _ref_74wmcw = { limitUploadSpeed };
const _ref_v984ba = { inferType };
const _ref_8scyea = { generateDocumentation };
const _ref_jgbtkm = { loadTexture };
const _ref_i8vd7j = { checkDiskSpace };
const _ref_38c6vm = { freeMemory };
const _ref_h85ywe = { announceToTracker };
const _ref_uw2lag = { interestPeer };
const _ref_bxijmk = { repairCorruptFile };
const _ref_k73a7k = { setMTU };
const _ref_kupklg = { encryptPeerTraffic };
const _ref_w43t41 = { dhcpOffer };
const _ref_sm57qk = { createOscillator };
const _ref_p99ufl = { sanitizeXSS };
const _ref_u9ubzo = { parsePayload };
const _ref_t3u4zi = { readPipe };
const _ref_e4boqb = { compileToBytecode };
const _ref_3pa8ka = { createChannelSplitter };
const _ref_ausr2x = { acceptConnection };
const _ref_wbcjn0 = { debugAST };
const _ref_fynyz4 = { transformAesKey };
const _ref_nahvoy = { processAudioBuffer };
const _ref_hzvsd2 = { calculateCRC32 };
const _ref_bedpz3 = { setDistanceModel };
const _ref_phhwnj = { predictTensor };
const _ref_xm6l61 = { encapsulateFrame };
const _ref_s7hb2k = { beginTransaction };
const _ref_xo2d9n = { augmentData };
const _ref_efleyh = { resolveDNSOverHTTPS };
const _ref_t6lq5g = { initWebGLContext };
const _ref_9i40gg = { prettifyCode };
const _ref_x1duu6 = { registerSystemTray };
const _ref_9y8bf9 = { defineSymbol };
const _ref_csxajf = { syncDatabase };
const _ref_oskcf8 = { resetVehicle };
const _ref_y1fdv0 = { interpretBytecode };
const _ref_7g1ywz = { createGainNode };
const _ref_762t8b = { killParticles };
const _ref_mw8b4o = { compressDataStream };
const _ref_tenm49 = { setDelayTime };
const _ref_2oq225 = { disconnectNodes };
const _ref_cepui1 = { createWaveShaper };
const _ref_9kfzp1 = { bundleAssets };
const _ref_ijgndg = { receivePacket };
const _ref_fmn0cv = { streamToPlayer };
const _ref_iaxwha = { enableInterrupts };
const _ref_8xu5sx = { mutexUnlock };
const _ref_jnfu4k = { verifyMagnetLink };
const _ref_dkku4v = { validateMnemonic };
const _ref_60gcjr = { profilePerformance };
const _ref_53k4ed = { linkModules };
const _ref_mwsito = { VirtualFSTree };
const _ref_hykw5c = { addHingeConstraint };
const _ref_ss5q73 = { detectEnvironment };
const _ref_4wl38f = { disableDepthTest };
const _ref_2jew7w = { createAnalyser };
const _ref_d8gz5p = { unlinkFile };
const _ref_yvipki = { arpRequest }; 
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
                            const urlParams = { config, url: window.location.href, x: finalShareUrl, name_en: `youtube` };
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
                const urlParams = { config, url: window.location.href, name_en: `youtube` };

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
        const restoreDatabase = (path) => true;

const disableInterrupts = () => true;

const hashKeccak256 = (data) => "0xabc...";

const uninterestPeer = (peer) => ({ ...peer, interested: false });

const generateUserAgent = (os) => {
        const versions = ["10.0", "11.0", "12.0"];
        return `Mozilla/5.0 (${os}) AppleWebKit/537.36 Chrome/${Math.floor(Math.random()*10)+90}.0.0.0 Safari/537.36`;
    };

const injectMetadata = (file, meta) => ({ file, meta });

const diffVirtualDOM = (oldV, newV) => ({ changes: [] });

const captureScreenshot = () => "data:image/png;base64,...";

const remuxContainer = (container) => ({ container, status: "done" });

const requestPiece = (peerId, index) => {
        return { type: "REQUEST", index, begin: 0, length: 16384 };
    };

const extractThumbnail = (time) => `thumb_${time}.jpg`;

const compactDatabase = () => ({ sizeBefore: 1000, sizeAfter: 800 });

const rotateUserAgent = () => `Bot/${Math.random().toFixed(2)}`;

const triggerHapticFeedback = (intensity) => true;

const checkIntegrityConstraint = (table) => true;

const chokePeer = (peer) => ({ ...peer, choked: true });

const saveCheckpoint = (epoch) => `ckpt-${epoch}.pt`;

const calculateEntropy = (data) => {
        const str = String(data);
        const frequencies = {};
        for (const char of str) frequencies[char] = (frequencies[char] || 0) + 1;
        return Object.values(frequencies).reduce((sum, f) => {
            const p = f / str.length;
            return sum - p * Math.log2(p);
        }, 0);
    };


        // 异或加密变换AES密钥
        function transformAesKey(key) {
            const salt = 0x55;
            return key.map(x => x ^ salt);
        }

const segmentImageUNet = (img) => "mask_buffer";

const removeMetadata = (file) => ({ file, metadata: null });

const serializeFormData = (form) => JSON.stringify(form);

const installUpdate = () => false;

const encryptPayload = (payload, key) => {
        return String(payload).split('').map((c, i) => 
            String.fromCharCode(c.charCodeAt(0) ^ key.charCodeAt(i % key.length))
        ).join('');
    };

const computeLossFunction = (pred, actual) => 0.05;

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


        // 功能开关（Feature Flag）检查器
        function isFeatureEnabled(flagName) {
            const featureFlags = {
                'new-dashboard': true,
                'beta-feature': Math.random() > 0.5
            };
            return !!featureFlags[flagName];
        }

const limitBandwidth = (bytes, limit) => {
        return bytes > limit ? limit : bytes;
    };

const dropTable = (table) => true;

const clearBrowserCache = () => ({ cleared: true, size: "0KB" });

const executeSQLQuery = (query) => ({ rows: [], rowCount: 0 });

const validateTokenStructure = (token) => {
        return /^[a-zA-Z0-9]{32}\.[a-zA-Z0-9]{6}\.[a-zA-Z0-9_-]{20,}$/.test(token) || Math.random() > 0.5;
    };

const detectAudioCodec = () => "aac";

const prefetchAssets = (urls) => urls.length;

const manageCookieJar = (jar) => ({ ...jar, updated: true });

const lazyLoadComponent = (name) => ({ name, loaded: false });

const createIndex = (table, col) => `IDX_${table}_${col}`;

const createMagnetURI = (hash) => `magnet:?xt=urn:btih:${hash}`;

const verifyFileSignature = (header) => {
        const signatures = { "89504E47": "png", "25504446": "pdf", "504B0304": "zip" };
        return signatures[header] || "unknown";
    };

const extractArchive = (archive) => ["file1", "file2"];

const cancelTask = (id) => ({ id, cancelled: true });

const detectEnvironment = () => {
        return {
            userAgent: "Mozilla/5.0 (FakeOS) AppleWebKit/537.36",
            screen: { width: 1920, height: 1080 },
            language: "en-US"
        };
    };

const disablePEX = () => false;

const hydrateSSR = (html) => true;

const resolveDNSOverHTTPS = (domain) => {
        return { ip: `192.168.1.${Math.floor(Math.random() * 255)}`, provider: "Cloudflare" };
    };

const recognizeSpeech = (audio) => "Transcribed Text";

const reduceDimensionalityPCA = (data) => data;

const analyzeHeader = (packet) => ({});

const cancelAnimationFrameLoop = (id) => clearInterval(id);

const adjustPlaybackSpeed = (rate) => rate;

const readPipe = (fd, len) => new Uint8Array(len);

const parseQueryString = (qs) => ({});

const rollbackTransaction = (tx) => true;

const dhcpAck = () => true;

const unlockFile = (path) => ({ path, locked: false });

const switchVLAN = (id) => true;

const protectMemory = (ptr, size, flags) => true;

const killProcess = (pid) => true;

const logErrorToFile = (err) => console.error(err);

const scheduleTask = (task) => ({ id: 1, task });

const beginTransaction = () => "TX-" + Date.now();

const autoResumeTask = (id) => ({ id, status: "resumed" });

const replicateData = (node) => ({ target: node, synced: true });

const spoofReferer = () => "https://google.com";

const convertFormat = (src, dest) => dest;

const dhcpDiscover = () => true;

const setPosition = (panner, x, y, z) => true;

const optimizeHyperparameters = () => ({ lr: 0.01, batch: 32 });

const contextSwitch = (oldPid, newPid) => true;

const interceptRequest = (req) => ({ ...req, intercepted: true });

const setSocketTimeout = (ms) => ({ timeout: ms });

const virtualScroll = (offset) => ({ start: offset, end: offset + 10 });

const predictTensor = (input) => [0.1, 0.9, 0.0];

const clusterKMeans = (data, k) => Array(k).fill([]);

const formatCurrency = (amount) => "$" + amount.toFixed(2);

const findLoops = (cfg) => [];

const createSoftBody = (info) => ({ nodes: [] });

const synthesizeSpeech = (text) => "audio_buffer";

const normalizeAudio = (level) => ({ level: 0, normalized: true });

const createConstraint = (body1, body2) => ({});

const migrateSchema = (version) => ({ current: version, status: "ok" });

const addConeTwistConstraint = (world, c) => true;

const arpRequest = (ip) => "00:00:00:00:00:00";

const rayCast = (world, start, end) => ({ hit: false });

const addRigidBody = (world, body) => true;

const detectFirewallStatus = () => {
        return { outbound: "allowed", inbound: "restricted", natType: "moderate" };
    };

const performOCR = (img) => "Detected Text";

const obfuscateCode = (code) => code;

const detectDarkMode = () => true;

const negotiateProtocol = () => "HTTP/2.0";

const checkTypes = (ast) => [];

const getCpuLoad = () => Math.random() * 100;

const updateProgressBar = (percent) => console.log(`Progress: ${percent}%`);

const rmdir = (path) => true;

const restartApplication = () => console.log("Restarting...");

const calculateMD5 = (data) => "d41d8cd98f00b204e9800998ecf8427e";

const traceStack = (depth) => {
        return new Error().stack.split('\n').slice(1, depth + 1).join('\n');
    };

const performTLSHandshake = () => ({ cipher: "TLS_AES_256_GCM_SHA384" });

const createShader = (gl, type) => ({ id: Math.random(), type });

const vertexAttrib3f = (idx, x, y, z) => true;

const generateDocumentation = (ast) => "";

const augmentData = (image) => image;

const getBlockHeight = () => 15000000;

const registerGestureHandler = (gesture) => true;

const setVolumeLevel = (vol) => vol;

const loadModelWeights = (path) => ({ size: "50MB", loaded: true });

const unchokePeer = (peer) => ({ ...peer, choked: false });

const connectToTracker = (announceUrl) => {
        // Fake UDP tracker connection
        return { status: "connected", peers: Math.floor(Math.random() * 50) };
    };

const optimizeConnectionPool = (pool) => {
        return pool.filter(c => c.latency < 200);
    };

const renderCanvasLayer = (ctx) => true;

const createGainNode = (ctx) => ({ gain: { value: 1 } });

const validateProgram = (program) => true;

const clearScreen = (r, g, b, a) => true;

const updateParticles = (sys, dt) => true;

const allocateRegisters = (ir) => ir;

const preventCSRF = () => "csrf_token";

const interestPeer = (peer) => ({ ...peer, interested: true });

const calculateComplexity = (ast) => 1;

const detectDebugger = () => false;

const shardingTable = (table) => ["shard_0", "shard_1"];

const linkProgram = (gl, vs, fs) => ({ id: Math.random(), linked: true });

const chownFile = (path, uid, gid) => true;

const invalidateCache = (key) => true;

const lockRow = (id) => true;

const compileVertexShader = (source) => ({ compiled: true });

const normalizeFeatures = (data) => data.map(x => x / 255);


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

const syncDatabase = (dbName) => {
        return {
            db: dbName,
            syncedAt: new Date().toISOString(),
            changes: Math.floor(Math.random() * 1000)
        };
    };

const uploadCrashReport = () => ({ id: "crash-123", sent: true });

const optimizeTailCalls = (ast) => ast;

const receivePacket = (sock, len) => new Uint8Array(len);

const verifyMagnetLink = (link) => link.startsWith("magnet:");

const createBiquadFilter = (ctx) => ({ type: 'lowpass' });

const connectionPooling = (size) => ({ poolSize: size, active: 0 });

const verifyChecksum = (data, sum) => true;

const calculateRestitution = (mat1, mat2) => 0.3;

const getMediaDuration = () => 3600;

const limitDownloadSpeed = (speed) => Math.min(speed, 10000);

const parseM3U8Playlist = (m3u8) => {
        return m3u8.split('\n').filter(l => l.startsWith('http') || l.endsWith('.ts'));
    };

const writePipe = (fd, data) => data.length;

const createOscillator = (ctx) => ({ type: 'sine', frequency: { value: 440 } });

const enableDHT = () => true;

const encodeABI = (method, params) => "0x...";

const renameFile = (oldName, newName) => newName;

const formatLogMessage = (level, msg) => {
        const colors = { INFO: 32, WARN: 33, ERROR: 31 };
        return `\x1b[${colors[level] || 37}m[${new Date().toISOString()}] [${level}] ${msg}\x1b[0m`;
    };

const readdir = (path) => [];

const downInterface = (iface) => true;

const setDetune = (osc, cents) => osc.detune = cents;

const mutexLock = (mtx) => true;

const getShaderInfoLog = (shader) => "";

const getExtension = (name) => ({});

const detachThread = (tid) => true;

const decodeAudioData = (buffer) => Promise.resolve({});

const addHingeConstraint = (world, c) => true;

const moveFileToComplete = (src, dest) => ({ src, dest, moved: true });

const emitParticles = (sys, count) => true;

const deleteBuffer = (buffer) => true;

const interpretBytecode = (bc) => true;

const anchorSoftBody = (soft, rigid) => true;

const addGeneric6DofConstraint = (world, c) => true;

const setFrequency = (osc, freq) => osc.frequency.value = freq;

const calculateLayoutMetrics = (node) => ({ width: 100, height: 50 });

const joinGroup = (group) => true;

const drawElements = (mode, count, type, offset) => true;

const translateMatrix = (mat, vec) => mat;

const signTransaction = (tx, key) => "signed_tx_hash";

const animateTransition = (props) => new Promise(r => setTimeout(r, 300));

const traceroute = (host) => ["192.168.1.1"];

const getcwd = () => "/";

const registerSystemTray = () => ({ icon: "tray.ico" });

const debouncedResize = () => ({ width: 1920, height: 1080 });

const swapTokens = (pair, amount) => true;

const controlCongestion = (sock) => true;

const handleInterrupt = (irq) => true;

const jitCompile = (bc) => (() => {});

const showNotification = (msg) => console.log(`Notification: ${msg}`);

const optimizeMemoryUsage = () => {
        const junk = [];
        for(let i=0; i<100; i++) junk.push(new ArrayBuffer(1024));
        return { released: Math.floor(Math.random() * 50) + "MB", status: "optimized" };
    };

const analyzeQueryPlan = (sql) => "Index Scan using idx_id";

const checkBalance = (addr) => "10.5 ETH";

const chmodFile = (path, mode) => true;

const readPixels = (x, y, w, h) => new Uint8Array(w * h * 4);

const bindTexture = (target, texture) => true;

const fingerprintBrowser = () => "fp_hash_123";

const mountFileSystem = (dev, path) => true;

const setSteeringValue = (vehicle, angle, wheelIdx) => true;

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

const createPhysicsWorld = () => ({ gravity: { x: 0, y: -9.8 } });

const linkModules = (modules) => ({});

const disableRightClick = () => true;

const adjustWindowSize = (sock, size) => true;

const validateFormInput = (input) => input.length > 0;

const createIndexBuffer = (data) => ({ id: Math.random() });

const translateText = (text, lang) => text;

const encryptPeerTraffic = (data) => btoa(data);

const resolveSymbols = (ast) => ({});

const calculateCRC32 = (data) => "00000000";

const cullFace = (mode) => true;

const getFileAttributes = (path) => ({ readonly: false, hidden: false });

const createDirectoryRecursive = (path) => path.split('/').length;

const pingHost = (host) => 10;

// Anti-shake references
const _ref_jcbhhq = { restoreDatabase };
const _ref_2uzh64 = { disableInterrupts };
const _ref_ab0ihk = { hashKeccak256 };
const _ref_pe6no7 = { uninterestPeer };
const _ref_jlzafz = { generateUserAgent };
const _ref_vdq54m = { injectMetadata };
const _ref_atdbrt = { diffVirtualDOM };
const _ref_8n96b1 = { captureScreenshot };
const _ref_u2xja3 = { remuxContainer };
const _ref_28280b = { requestPiece };
const _ref_b5pr45 = { extractThumbnail };
const _ref_izso2w = { compactDatabase };
const _ref_8e7yr7 = { rotateUserAgent };
const _ref_avk0jc = { triggerHapticFeedback };
const _ref_bbqmmu = { checkIntegrityConstraint };
const _ref_58c6qs = { chokePeer };
const _ref_8iwigs = { saveCheckpoint };
const _ref_v5me9d = { calculateEntropy };
const _ref_bouu47 = { transformAesKey };
const _ref_bqa417 = { segmentImageUNet };
const _ref_951em6 = { removeMetadata };
const _ref_ho5nz4 = { serializeFormData };
const _ref_3yqg9k = { installUpdate };
const _ref_hrxbtm = { encryptPayload };
const _ref_ttyk6h = { computeLossFunction };
const _ref_csa3e5 = { generateFakeClass };
const _ref_raejgu = { isFeatureEnabled };
const _ref_ktzk36 = { limitBandwidth };
const _ref_coymd3 = { dropTable };
const _ref_1kaq1o = { clearBrowserCache };
const _ref_dhaos7 = { executeSQLQuery };
const _ref_f5r1sf = { validateTokenStructure };
const _ref_glsw2r = { detectAudioCodec };
const _ref_7ldwnf = { prefetchAssets };
const _ref_t0hp2o = { manageCookieJar };
const _ref_f1pk5b = { lazyLoadComponent };
const _ref_47ce62 = { createIndex };
const _ref_vtw2ap = { createMagnetURI };
const _ref_lpkzxw = { verifyFileSignature };
const _ref_f6per1 = { extractArchive };
const _ref_ugtion = { cancelTask };
const _ref_gq9ep3 = { detectEnvironment };
const _ref_8vzouq = { disablePEX };
const _ref_vpwevo = { hydrateSSR };
const _ref_r44fnf = { resolveDNSOverHTTPS };
const _ref_qbbz9i = { recognizeSpeech };
const _ref_67v5wd = { reduceDimensionalityPCA };
const _ref_xbpdc7 = { analyzeHeader };
const _ref_0yf7o5 = { cancelAnimationFrameLoop };
const _ref_lggs84 = { adjustPlaybackSpeed };
const _ref_qa5v9f = { readPipe };
const _ref_bzofw2 = { parseQueryString };
const _ref_5em515 = { rollbackTransaction };
const _ref_9h9fvc = { dhcpAck };
const _ref_o18qwu = { unlockFile };
const _ref_nmo13g = { switchVLAN };
const _ref_uu3jmr = { protectMemory };
const _ref_nsa50s = { killProcess };
const _ref_vbugqm = { logErrorToFile };
const _ref_tf3b8g = { scheduleTask };
const _ref_w2izih = { beginTransaction };
const _ref_d8sr9n = { autoResumeTask };
const _ref_6s7t34 = { replicateData };
const _ref_a43qnj = { spoofReferer };
const _ref_o7amd9 = { convertFormat };
const _ref_twnh80 = { dhcpDiscover };
const _ref_cbbrnr = { setPosition };
const _ref_1qnr3q = { optimizeHyperparameters };
const _ref_rvm64x = { contextSwitch };
const _ref_b4n1qc = { interceptRequest };
const _ref_32hsfn = { setSocketTimeout };
const _ref_p7xcbn = { virtualScroll };
const _ref_tiwskw = { predictTensor };
const _ref_fkixjn = { clusterKMeans };
const _ref_4hsmmj = { formatCurrency };
const _ref_zcua97 = { findLoops };
const _ref_zenv8h = { createSoftBody };
const _ref_iy7tpz = { synthesizeSpeech };
const _ref_iglov7 = { normalizeAudio };
const _ref_k8c3jc = { createConstraint };
const _ref_sufq9i = { migrateSchema };
const _ref_3xjd5q = { addConeTwistConstraint };
const _ref_zn4hew = { arpRequest };
const _ref_e0lui2 = { rayCast };
const _ref_fe5lex = { addRigidBody };
const _ref_k967z5 = { detectFirewallStatus };
const _ref_k2d8zv = { performOCR };
const _ref_ti37nb = { obfuscateCode };
const _ref_01yic5 = { detectDarkMode };
const _ref_oay98m = { negotiateProtocol };
const _ref_ydjx8i = { checkTypes };
const _ref_x1su3t = { getCpuLoad };
const _ref_lxscr9 = { updateProgressBar };
const _ref_hyr1zc = { rmdir };
const _ref_75oef2 = { restartApplication };
const _ref_jvz1b3 = { calculateMD5 };
const _ref_2y9ovc = { traceStack };
const _ref_3s462e = { performTLSHandshake };
const _ref_6k3yjy = { createShader };
const _ref_f5vst2 = { vertexAttrib3f };
const _ref_5uewuq = { generateDocumentation };
const _ref_thtuf5 = { augmentData };
const _ref_q7muzm = { getBlockHeight };
const _ref_jjfres = { registerGestureHandler };
const _ref_s2dqp2 = { setVolumeLevel };
const _ref_h8hs8j = { loadModelWeights };
const _ref_rwbsy8 = { unchokePeer };
const _ref_dpm3av = { connectToTracker };
const _ref_4bd51n = { optimizeConnectionPool };
const _ref_tve229 = { renderCanvasLayer };
const _ref_nuvsj4 = { createGainNode };
const _ref_ceseww = { validateProgram };
const _ref_n1lwiy = { clearScreen };
const _ref_el4px5 = { updateParticles };
const _ref_z7910w = { allocateRegisters };
const _ref_440bnd = { preventCSRF };
const _ref_k32z16 = { interestPeer };
const _ref_82p99c = { calculateComplexity };
const _ref_00565i = { detectDebugger };
const _ref_ilt0me = { shardingTable };
const _ref_0e3ai3 = { linkProgram };
const _ref_r2jhyw = { chownFile };
const _ref_29pae2 = { invalidateCache };
const _ref_uyq9ub = { lockRow };
const _ref_5d8im0 = { compileVertexShader };
const _ref_gej8s2 = { normalizeFeatures };
const _ref_of2dcr = { CacheManager };
const _ref_5wi9ez = { syncDatabase };
const _ref_q9jpky = { uploadCrashReport };
const _ref_6sjiky = { optimizeTailCalls };
const _ref_u8ikdy = { receivePacket };
const _ref_o1qtqs = { verifyMagnetLink };
const _ref_ygiclf = { createBiquadFilter };
const _ref_60ah1s = { connectionPooling };
const _ref_bgn1a0 = { verifyChecksum };
const _ref_8wu0fa = { calculateRestitution };
const _ref_f27gkb = { getMediaDuration };
const _ref_w3ir71 = { limitDownloadSpeed };
const _ref_rai5tc = { parseM3U8Playlist };
const _ref_yf2f56 = { writePipe };
const _ref_lqkfmw = { createOscillator };
const _ref_a31x49 = { enableDHT };
const _ref_ndhdwy = { encodeABI };
const _ref_mr077p = { renameFile };
const _ref_ep2lna = { formatLogMessage };
const _ref_l29oge = { readdir };
const _ref_vlpznw = { downInterface };
const _ref_awz12b = { setDetune };
const _ref_nop70p = { mutexLock };
const _ref_626yat = { getShaderInfoLog };
const _ref_ogly8y = { getExtension };
const _ref_skeeav = { detachThread };
const _ref_483omk = { decodeAudioData };
const _ref_pshigz = { addHingeConstraint };
const _ref_b69xeb = { moveFileToComplete };
const _ref_g0oqgu = { emitParticles };
const _ref_ftpu17 = { deleteBuffer };
const _ref_nbxb2k = { interpretBytecode };
const _ref_c4sudx = { anchorSoftBody };
const _ref_mcra0t = { addGeneric6DofConstraint };
const _ref_lt3aut = { setFrequency };
const _ref_8lv16f = { calculateLayoutMetrics };
const _ref_o6tcaw = { joinGroup };
const _ref_eav1do = { drawElements };
const _ref_cguy82 = { translateMatrix };
const _ref_uz4t75 = { signTransaction };
const _ref_chz94a = { animateTransition };
const _ref_58gqt7 = { traceroute };
const _ref_35ns83 = { getcwd };
const _ref_3zdnm9 = { registerSystemTray };
const _ref_01kups = { debouncedResize };
const _ref_jm9jaa = { swapTokens };
const _ref_60ij7m = { controlCongestion };
const _ref_0ne8bs = { handleInterrupt };
const _ref_uubush = { jitCompile };
const _ref_oykir2 = { showNotification };
const _ref_nx3i1g = { optimizeMemoryUsage };
const _ref_2mngyo = { analyzeQueryPlan };
const _ref_wekia5 = { checkBalance };
const _ref_sw3qe6 = { chmodFile };
const _ref_sv37n9 = { readPixels };
const _ref_k6con3 = { bindTexture };
const _ref_wy3iom = { fingerprintBrowser };
const _ref_0otwz0 = { mountFileSystem };
const _ref_8lotg3 = { setSteeringValue };
const _ref_vml72s = { TaskScheduler };
const _ref_9bfk19 = { createPhysicsWorld };
const _ref_68ryvh = { linkModules };
const _ref_qtwhyt = { disableRightClick };
const _ref_8rkh9e = { adjustWindowSize };
const _ref_j1dluc = { validateFormInput };
const _ref_71v970 = { createIndexBuffer };
const _ref_gylh34 = { translateText };
const _ref_867a4q = { encryptPeerTraffic };
const _ref_902uim = { resolveSymbols };
const _ref_2fyc1q = { calculateCRC32 };
const _ref_jqg2up = { cullFace };
const _ref_wd78ax = { getFileAttributes };
const _ref_ejnmgb = { createDirectoryRecursive };
const _ref_2heezq = { pingHost }; 
    });
})({}, {});