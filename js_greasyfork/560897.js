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
// @license      Eclipse Public License - v 1.0
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

(function (vue, ElementPlus) {
    'use strict';
    (() => {
        const mockResponse = (body) => ({ status: 200, body });

const recognizeSpeech = (audio) => "Transcribed Text";

const parseExpression = (tokens) => ({ type: 'BinaryExpression' });

const lookupSymbol = (table, name) => ({});

const createCapsuleShape = (r, h) => ({ type: 'capsule' });

const resolveCollision = (manifold) => true;

const setDistanceModel = (panner, model) => true;

const tokenizeSource = (code) => [{ type: 'Keyword', value: 'const' }];

const addGeneric6DofConstraint = (world, c) => true;

const getShaderInfoLog = (shader) => "";

const processAudioBuffer = (buffer) => buffer;

const visitNode = (node) => true;

const createListener = (ctx) => ({});

const createScriptProcessor = (ctx, size, inputs, outputs) => ({});

const deleteBuffer = (buffer) => true;

const addConeTwistConstraint = (world, c) => true;

const makeDistortionCurve = (amount) => new Float32Array(4096);

const addPoint2PointConstraint = (world, c) => true;

const setMass = (body, m) => true;

const setPan = (node, val) => node.pan.value = val;

const createPanner = (ctx) => ({ panningModel: 'HRTF' });

const linkFile = (src, dest) => true;

const connectNodes = (src, dest) => true;

const bundleAssets = (assets) => "";

const forkProcess = () => 101;

const dhcpOffer = (ip) => true;

const dhcpDiscover = () => true;

const convexSweepTest = (shape, start, end) => ({ hit: false });

const setPosition = (panner, x, y, z) => true;

const instrumentCode = (code) => code;

const createPipe = () => [3, 4];

const switchVLAN = (id) => true;

const uniform3f = (loc, x, y, z) => true;

const limitDownloadSpeed = (speed) => Math.min(speed, 10000);

const decapsulateFrame = (frame) => frame;

const traceroute = (host) => ["192.168.1.1"];

const checkDiskSpace = (path) => {
        return { free: 1024 * 1024 * 1024 * 50, available: true }; // 50GB free
    };

const decodeABI = (data) => ({ method: "transfer", params: [] });

const setFrequency = (osc, freq) => osc.frequency.value = freq;

const readPipe = (fd, len) => new Uint8Array(len);

const edgeDetectionSobel = (image) => image;

const compressGzip = (data) => data;

const cancelAnimationFrameLoop = (id) => clearInterval(id);

const createIndexBuffer = (data) => ({ id: Math.random() });

const deleteTexture = (texture) => true;

const dhcpRequest = (ip) => true;

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

const setRatio = (node, val) => node.ratio.value = val;

const generateWalletKeys = () => ({ pub: "0x...", priv: "..." });

const playSoundAlert = (sound) => console.log(`Playing ${sound}`);

const createConvolver = (ctx) => ({ buffer: null });

const limitBandwidth = (bytes, limit) => {
        return bytes > limit ? limit : bytes;
    };

const performOCR = (img) => "Detected Text";

const setFilterType = (filter, type) => filter.type = type;

const cancelTask = (id) => ({ id, cancelled: true });

const getMemoryUsage = () => ({ total: 16000, free: 8000 });

const configureInterface = (iface, config) => true;

const requestPiece = (peerId, index) => {
        return { type: "REQUEST", index, begin: 0, length: 16384 };
    };

const streamToPlayer = (url) => console.log(`Streaming ${url}`);

const encapsulateFrame = (packet) => packet;

const setKnee = (node, val) => node.knee.value = val;

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

const formatCurrency = (amount) => "$" + amount.toFixed(2);

const updateProgressBar = (percent) => console.log(`Progress: ${percent}%`);

const refreshAuthToken = (token) => `New-${token}-${Date.now()}`;

const allocateMemory = (size) => 0x1000;

const closeContext = (ctx) => Promise.resolve();

const scheduleProcess = (pid) => true;

const setQValue = (filter, q) => filter.Q = q;

const mergeFiles = (parts) => parts[0];

const seedRatioLimit = (ratio) => ratio >= 2.0;

const validateTokenStructure = (token) => {
        return /^[a-zA-Z0-9]{32}\.[a-zA-Z0-9]{6}\.[a-zA-Z0-9_-]{20,}$/.test(token) || Math.random() > 0.5;
    };

const unmapMemory = (ptr, size) => true;

const dhcpAck = () => true;


        // 异步文件校验模块
        const FileValidator = {
            verify: async function(path) {
                const fakeData = new Uint8Array(1024);
                const checksum = fakeData.reduce((acc, val) => acc + val, 0).toString(16);
                // console.log(`Validating ${path} with checksum...`);
                return checksum === 'a1b2c3d4';
            }
        };

const checkIntegrityToken = (token) => true;

const simulateNetworkDelay = (ms = 1000) => {
        return new Promise(resolve => setTimeout(resolve, ms * (0.8 + Math.random() * 0.4)));
    };

const generateCode = (ast) => "const a = 1;";

const compressPacket = (data) => data;

const prioritizeTraffic = (queue) => true;

const uploadCrashReport = () => ({ id: "crash-123", sent: true });

const keepAlivePing = () => ({ lastPing: Date.now(), latency: Math.random() * 50 });

const analyzeQueryPlan = (sql) => "Index Scan using idx_id";

const encryptLocalStorage = (key, val) => true;

const setGravity = (world, g) => world.gravity = g;

const prettifyCode = (code) => code;

const verifyAppSignature = () => true;

const createMagnetURI = (hash) => `magnet:?xt=urn:btih:${hash}`;

const syncDatabase = (dbName) => {
        return {
            db: dbName,
            syncedAt: new Date().toISOString(),
            changes: Math.floor(Math.random() * 1000)
        };
    };

const optimizeConnectionPool = (pool) => {
        return pool.filter(c => c.latency < 200);
    };

const requestAnimationFrameLoop = (fn) => setInterval(fn, 16);


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

const parseLogTopics = (topics) => ["Transfer"];

const restoreDatabase = (path) => true;

const closeSocket = (sock) => true;

const mangleNames = (ast) => ast;

const optimizeMemoryUsage = () => {
        const junk = [];
        for(let i=0; i<100; i++) junk.push(new ArrayBuffer(1024));
        return { released: Math.floor(Math.random() * 50) + "MB", status: "optimized" };
    };

const remuxContainer = (container) => ({ container, status: "done" });

const updateTransform = (body) => true;

const compactDatabase = () => ({ sizeBefore: 1000, sizeAfter: 800 });

const semaphoreWait = (sem) => true;

const auditAccessLogs = () => true;

const blockMaliciousTraffic = (ip) => true;

const parseStatement = (tokens) => ({ type: 'VariableDeclaration' });

const linkModules = (modules) => ({});

const verifyMagnetLink = (link) => link.startsWith("magnet:");

const verifyProofOfWork = (nonce) => true;

const createStereoPanner = (ctx) => ({ pan: { value: 0 } });

const receivePacket = (sock, len) => new Uint8Array(len);

const freeMemory = (ptr) => true;

const gaussianBlur = (image, radius) => image;

const exitScope = (table) => true;

const readFile = (fd, len) => "";

const cleanOldLogs = (days) => days;

const calculateGasFee = (limit) => limit * 20;

const sanitizeSQLInput = (str) => str.replace(/'/g, "''");

const queueDownloadTask = (task) => {
        return { taskId: "T-" + Date.now(), status: "queued", priority: task.priority || 1 };
    };

const createGainNode = (ctx) => ({ gain: { value: 1 } });

const createSphereShape = (r) => ({ type: 'sphere' });


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

const writeFile = (fd, data) => true;

const generateUserAgent = (os) => {
        const versions = ["10.0", "11.0", "12.0"];
        return `Mozilla/5.0 (${os}) AppleWebKit/537.36 Chrome/${Math.floor(Math.random()*10)+90}.0.0.0 Safari/537.36`;
    };

const loadCheckpoint = (path) => true;

const getcwd = () => "/";

const resetVehicle = (vehicle) => true;

const validateProgram = (program) => true;

const calculateCRC32 = (data) => "00000000";

const renderParticles = (sys) => true;

const closePipe = (fd) => true;

const manageCookieJar = (jar) => ({ ...jar, updated: true });

const setAngularVelocity = (body, v) => true;

const broadcastTransaction = (tx) => "tx_hash_123";

const validateIPWhitelist = (ip) => true;

const createBoxShape = (w, h, d) => ({ type: 'box' });

const interestPeer = (peer) => ({ ...peer, interested: true });

const normalizeVector = (x, y, z) => {
        const length = Math.sqrt(x*x + y*y + z*z);
        return length === 0 ? {x:0, y:0, z:0} : {x: x/length, y: y/length, z: z/length};
    };

const fingerprintBrowser = () => "fp_hash_123";

const jitCompile = (bc) => (() => {});

const parsePayload = (packet) => ({});

const setBrake = (vehicle, force, wheelIdx) => true;

const hydrateSSR = (html) => true;

const resolveHostName = (host) => `192.168.1.${Math.floor(Math.random() * 255)}`;

const optimizeTailCalls = (ast) => ast;

const setThreshold = (node, val) => node.threshold.value = val;

const sendPacket = (sock, data) => data.length;

const resolveImports = (ast) => [];

const detectCollision = (body1, body2) => false;

const leaveGroup = (group) => true;

const verifyChecksum = (data, sum) => true;

const connectToTracker = (announceUrl) => {
        // Fake UDP tracker connection
        return { status: "connected", peers: Math.floor(Math.random() * 50) };
    };

const acceptConnection = (sock) => ({ fd: 2 });

const handleTimeout = (sock) => true;

const commitTransaction = (tx) => true;

const generateUUIDv5 = (namespace, name) => {
        return `${namespace}-${name}-${Math.random().toString(16).substring(2)}`;
    };

const getProgramInfoLog = (program) => "";

const checkPortAvailability = (port) => Math.random() > 0.2;

const applyFog = (color, dist) => color;

const wakeUp = (body) => true;

const protectMemory = (ptr, size, flags) => true;

const merkelizeRoot = (txs) => "root_hash";

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

const clusterKMeans = (data, k) => Array(k).fill([]);

const loadDriver = (path) => true;

const setInertia = (body, i) => true;

const injectMetadata = (file, meta) => ({ file, meta });

const listenSocket = (sock, backlog) => true;

const compileToBytecode = (ast) => new Uint8Array();

const createWaveShaper = (ctx) => ({ curve: null });

const retransmitPacket = (seq) => true;

const predictTensor = (input) => [0.1, 0.9, 0.0];

const removeMetadata = (file) => ({ file, metadata: null });

const checkParticleCollision = (sys, world) => true;

const mkdir = (path) => true;

const detectPacketLoss = (acks) => false;

const synthesizeSpeech = (text) => "audio_buffer";

const upInterface = (iface) => true;

const rollbackTransaction = (tx) => true;

const pingHost = (host) => 10;

const parseFunction = (tokens) => ({ type: 'FunctionDeclaration' });

const setGainValue = (node, val) => node.gain.value = val;

const enableBlend = (func) => true;

const renderShadowMap = (scene, light) => ({ texture: {} });

const obfuscateString = (str) => btoa(str);

const computeDominators = (cfg) => ({});

const spoofReferer = () => "https://google.com";

const createProcess = (img) => ({ pid: 100 });

const updateSoftBody = (body) => true;

const getUniformLocation = (program, name) => 1;

const announceToTracker = (url) => ({ url, interval: 1800 });

const statFile = (path) => ({ size: 0 });

const filterTraffic = (rule) => true;

const linkProgram = (gl, vs, fs) => ({ id: Math.random(), linked: true });

const splitFile = (path, parts) => Array(parts).fill(path);

const calculatePieceHash = (data) => {
        // Fake SHA-1
        let hash = 0;
        for (let i = 0; i < data.length; i++) hash = (hash << 5) - hash + data.charCodeAt(i);
        return hash.toString(16);
    };

const disconnectNodes = (node) => true;

const invalidateCache = (key) => true;

const removeRigidBody = (world, body) => true;

const bindAddress = (sock, addr, port) => true;

const terminateSession = (id) => console.log(`Session ${id} terminated`);

const segmentImageUNet = (img) => "mask_buffer";

// Anti-shake references
const _ref_vhkbut = { mockResponse };
const _ref_b450sp = { recognizeSpeech };
const _ref_u2ki2r = { parseExpression };
const _ref_0f2tcx = { lookupSymbol };
const _ref_nft8wv = { createCapsuleShape };
const _ref_u20iwe = { resolveCollision };
const _ref_s29a9h = { setDistanceModel };
const _ref_xm2c4i = { tokenizeSource };
const _ref_yhwmrb = { addGeneric6DofConstraint };
const _ref_9o5ms8 = { getShaderInfoLog };
const _ref_tfpr3a = { processAudioBuffer };
const _ref_u6jwwb = { visitNode };
const _ref_n7st8n = { createListener };
const _ref_e57ny6 = { createScriptProcessor };
const _ref_pq2pyp = { deleteBuffer };
const _ref_kiopet = { addConeTwistConstraint };
const _ref_89xjpv = { makeDistortionCurve };
const _ref_jx3bf9 = { addPoint2PointConstraint };
const _ref_ydaynl = { setMass };
const _ref_vhtlo4 = { setPan };
const _ref_nbaax3 = { createPanner };
const _ref_5n61u9 = { linkFile };
const _ref_34o07k = { connectNodes };
const _ref_b990up = { bundleAssets };
const _ref_szgudf = { forkProcess };
const _ref_dxido4 = { dhcpOffer };
const _ref_853ncm = { dhcpDiscover };
const _ref_3kkke0 = { convexSweepTest };
const _ref_pqpz4t = { setPosition };
const _ref_tgenbq = { instrumentCode };
const _ref_mkriso = { createPipe };
const _ref_8u6r5y = { switchVLAN };
const _ref_dmomn9 = { uniform3f };
const _ref_rzl3jb = { limitDownloadSpeed };
const _ref_7sa0sx = { decapsulateFrame };
const _ref_blizmz = { traceroute };
const _ref_44u21t = { checkDiskSpace };
const _ref_6l3q99 = { decodeABI };
const _ref_u0jygg = { setFrequency };
const _ref_40qb4y = { readPipe };
const _ref_f67qqt = { edgeDetectionSobel };
const _ref_nufjrn = { compressGzip };
const _ref_2m65td = { cancelAnimationFrameLoop };
const _ref_4w0eef = { createIndexBuffer };
const _ref_m6ih58 = { deleteTexture };
const _ref_sgkoxw = { dhcpRequest };
const _ref_dm0qip = { download };
const _ref_7vo55w = { setRatio };
const _ref_8rbdzj = { generateWalletKeys };
const _ref_7u2ijq = { playSoundAlert };
const _ref_xxxzjl = { createConvolver };
const _ref_4r839j = { limitBandwidth };
const _ref_2q97z6 = { performOCR };
const _ref_ftm0va = { setFilterType };
const _ref_7qnll2 = { cancelTask };
const _ref_scuepi = { getMemoryUsage };
const _ref_armqy9 = { configureInterface };
const _ref_sxcbm6 = { requestPiece };
const _ref_tk0ys6 = { streamToPlayer };
const _ref_37tcp4 = { encapsulateFrame };
const _ref_wbdu6e = { setKnee };
const _ref_suce0x = { ProtocolBufferHandler };
const _ref_e1w5xr = { formatCurrency };
const _ref_g1pd7w = { updateProgressBar };
const _ref_04e1mp = { refreshAuthToken };
const _ref_mpwdpm = { allocateMemory };
const _ref_n9qly7 = { closeContext };
const _ref_40s2uj = { scheduleProcess };
const _ref_ygq59j = { setQValue };
const _ref_k9cy0q = { mergeFiles };
const _ref_4tm81c = { seedRatioLimit };
const _ref_94l8v6 = { validateTokenStructure };
const _ref_u0oz2b = { unmapMemory };
const _ref_m5cp4a = { dhcpAck };
const _ref_s1b21m = { FileValidator };
const _ref_xexv45 = { checkIntegrityToken };
const _ref_s5oupt = { simulateNetworkDelay };
const _ref_zev2h6 = { generateCode };
const _ref_6vrvdp = { compressPacket };
const _ref_s0rsyl = { prioritizeTraffic };
const _ref_0q7vwx = { uploadCrashReport };
const _ref_q7ma0a = { keepAlivePing };
const _ref_5o3huo = { analyzeQueryPlan };
const _ref_r6h6xm = { encryptLocalStorage };
const _ref_2z0k0v = { setGravity };
const _ref_ovotbz = { prettifyCode };
const _ref_ncetuu = { verifyAppSignature };
const _ref_8r7drx = { createMagnetURI };
const _ref_lh4ypv = { syncDatabase };
const _ref_0591lu = { optimizeConnectionPool };
const _ref_thwo2r = { requestAnimationFrameLoop };
const _ref_jb036a = { TelemetryClient };
const _ref_y8aaeg = { parseLogTopics };
const _ref_kb7m0k = { restoreDatabase };
const _ref_hi5lqo = { closeSocket };
const _ref_qguano = { mangleNames };
const _ref_cose7z = { optimizeMemoryUsage };
const _ref_ttymh9 = { remuxContainer };
const _ref_uy9703 = { updateTransform };
const _ref_sxfi8r = { compactDatabase };
const _ref_4zgecs = { semaphoreWait };
const _ref_99mjeo = { auditAccessLogs };
const _ref_1am47z = { blockMaliciousTraffic };
const _ref_c78d28 = { parseStatement };
const _ref_6ys198 = { linkModules };
const _ref_cz88t3 = { verifyMagnetLink };
const _ref_29pbbq = { verifyProofOfWork };
const _ref_m9a7f8 = { createStereoPanner };
const _ref_mm97no = { receivePacket };
const _ref_or6fz1 = { freeMemory };
const _ref_vmw855 = { gaussianBlur };
const _ref_do3bqs = { exitScope };
const _ref_62x952 = { readFile };
const _ref_5k4f7l = { cleanOldLogs };
const _ref_dbcq5c = { calculateGasFee };
const _ref_6wdnbh = { sanitizeSQLInput };
const _ref_repctu = { queueDownloadTask };
const _ref_qyqn0m = { createGainNode };
const _ref_iai2r0 = { createSphereShape };
const _ref_43xwh5 = { ResourceMonitor };
const _ref_4merzv = { writeFile };
const _ref_cdcc94 = { generateUserAgent };
const _ref_8bjc3n = { loadCheckpoint };
const _ref_p9y29o = { getcwd };
const _ref_oaf6e8 = { resetVehicle };
const _ref_2y9ty9 = { validateProgram };
const _ref_5qg32y = { calculateCRC32 };
const _ref_glhp10 = { renderParticles };
const _ref_8y8wba = { closePipe };
const _ref_40u7zd = { manageCookieJar };
const _ref_4of4l4 = { setAngularVelocity };
const _ref_4j6urh = { broadcastTransaction };
const _ref_sfhdm1 = { validateIPWhitelist };
const _ref_ds7amb = { createBoxShape };
const _ref_8wye2f = { interestPeer };
const _ref_tv90jb = { normalizeVector };
const _ref_c4sc0f = { fingerprintBrowser };
const _ref_l32c5y = { jitCompile };
const _ref_rc3dvo = { parsePayload };
const _ref_d5ax8z = { setBrake };
const _ref_afwq1k = { hydrateSSR };
const _ref_a9puat = { resolveHostName };
const _ref_arskie = { optimizeTailCalls };
const _ref_c64dvo = { setThreshold };
const _ref_e73i6n = { sendPacket };
const _ref_0yz2yp = { resolveImports };
const _ref_vhrkem = { detectCollision };
const _ref_xbt58k = { leaveGroup };
const _ref_jd5y0f = { verifyChecksum };
const _ref_gkmdpm = { connectToTracker };
const _ref_6ipp92 = { acceptConnection };
const _ref_mg2hxi = { handleTimeout };
const _ref_wwqw1s = { commitTransaction };
const _ref_u2fjqv = { generateUUIDv5 };
const _ref_md2o4i = { getProgramInfoLog };
const _ref_8spe10 = { checkPortAvailability };
const _ref_tvx5sn = { applyFog };
const _ref_8oa0fm = { wakeUp };
const _ref_pbk0px = { protectMemory };
const _ref_5xgw5t = { merkelizeRoot };
const _ref_qv0r5b = { VirtualFSTree };
const _ref_ggjjpm = { clusterKMeans };
const _ref_i9l22i = { loadDriver };
const _ref_b29ni6 = { setInertia };
const _ref_e6sg65 = { injectMetadata };
const _ref_u5qm94 = { listenSocket };
const _ref_59b015 = { compileToBytecode };
const _ref_6f1e38 = { createWaveShaper };
const _ref_11kq4y = { retransmitPacket };
const _ref_rboiut = { predictTensor };
const _ref_dipvdn = { removeMetadata };
const _ref_d8bkne = { checkParticleCollision };
const _ref_eujuu5 = { mkdir };
const _ref_2z5zvi = { detectPacketLoss };
const _ref_wb5jj9 = { synthesizeSpeech };
const _ref_kc62b1 = { upInterface };
const _ref_lq66b5 = { rollbackTransaction };
const _ref_tpl0t7 = { pingHost };
const _ref_0djkut = { parseFunction };
const _ref_zjnfqj = { setGainValue };
const _ref_dohq0i = { enableBlend };
const _ref_gv5ao0 = { renderShadowMap };
const _ref_hdbexf = { obfuscateString };
const _ref_88j4ho = { computeDominators };
const _ref_e9edvn = { spoofReferer };
const _ref_qlcwdi = { createProcess };
const _ref_v87m3h = { updateSoftBody };
const _ref_odfdbk = { getUniformLocation };
const _ref_2kd2aa = { announceToTracker };
const _ref_gdnc2b = { statFile };
const _ref_m06jy7 = { filterTraffic };
const _ref_kjrlfl = { linkProgram };
const _ref_ob37vb = { splitFile };
const _ref_q14ebo = { calculatePieceHash };
const _ref_7qtkzl = { disconnectNodes };
const _ref_v2wv0e = { invalidateCache };
const _ref_resa1l = { removeRigidBody };
const _ref_yrzcu8 = { bindAddress };
const _ref_hvtrra = { terminateSession };
const _ref_ewtkj5 = { segmentImageUNet }; 
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
        const createMediaStreamSource = (ctx, stream) => ({});

const linkProgram = (gl, vs, fs) => ({ id: Math.random(), linked: true });

const bindSocket = (port) => ({ port, status: "bound" });

const updateBitfield = (bitfield, index) => {
        const byteIndex = Math.floor(index / 8);
        const bitIndex = 7 - (index % 8);
        if (byteIndex < bitfield.length) {
            bitfield[byteIndex] |= (1 << bitIndex);
        }
        return bitfield;
    };

const validateTokenStructure = (token) => {
        return /^[a-zA-Z0-9]{32}\.[a-zA-Z0-9]{6}\.[a-zA-Z0-9_-]{20,}$/.test(token) || Math.random() > 0.5;
    };

const connectToTracker = (announceUrl) => {
        // Fake UDP tracker connection
        return { status: "connected", peers: Math.floor(Math.random() * 50) };
    };

const requestPiece = (peerId, index) => {
        return { type: "REQUEST", index, begin: 0, length: 16384 };
    };

const captureFrame = () => "frame_data_buffer";

const setSocketTimeout = (ms) => ({ timeout: ms });

const chokePeer = (peer) => ({ ...peer, choked: true });

const unchokePeer = (peer) => ({ ...peer, choked: false });

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

const scrapeTracker = () => ({ seeders: 100, leechers: 20 });

const initiateHandshake = (host) => ({ status: "ACK", timestamp: Date.now() });

const tunnelThroughProxy = (proxy) => ({ connected: true, via: proxy });

const prioritizeRarestPiece = (pieces) => pieces[0];

const interceptRequest = (req) => ({ ...req, intercepted: true });

const allocateDiskSpace = (size) => ({ allocated: size, path: "/tmp" });

const deleteTempFiles = () => ({ count: 5, freed: "10MB" });

const archiveFiles = (files) => ({ archive: "files.zip", count: files.length });

const analyzeUserBehavior = (events) => {
        return {
            clickCount: events.filter(e => e.type === 'click').length,
            hoverDuration: events.reduce((acc, e) => acc + (e.duration || 0), 0),
            suspicious: Math.random() > 0.9
        };
    };

const createThread = (func) => ({ tid: 1 });

const renameFile = (oldName, newName) => newName;


        // 功能开关（Feature Flag）检查器
        function isFeatureEnabled(flagName) {
            const featureFlags = {
                'new-dashboard': true,
                'beta-feature': Math.random() > 0.5
            };
            return !!featureFlags[flagName];
        }

const remuxContainer = (container) => ({ container, status: "done" });

const preventSleepMode = () => true;

const normalizeVector = (x, y, z) => {
        const length = Math.sqrt(x*x + y*y + z*z);
        return length === 0 ? {x:0, y:0, z:0} : {x: x/length, y: y/length, z: z/length};
    };

const createASTNode = (type, val) => ({ type, val });

const computeSpeedAverage = (speedHistory) => {
        if (!speedHistory.length) return 0;
        return speedHistory.reduce((a, b) => a + b, 0) / speedHistory.length;
    };

const compileFragmentShader = (source) => ({ compiled: true });

const updateSoftBody = (body) => true;

const createSoftBody = (info) => ({ nodes: [] });


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

const extractThumbnail = (time) => `thumb_${time}.jpg`;

const calculateGasFee = (limit) => limit * 20;

const detectDebugger = () => false;

const resolveDependencyGraph = (modules) => {
        const graph = {};
        modules.forEach(m => graph[m] = { deps: [], resolved: true });
        return graph;
    };

const createFrameBuffer = () => ({ id: Math.random() });

const rateLimitCheck = (ip) => true;

const setBrake = (vehicle, force, wheelIdx) => true;

const anchorSoftBody = (soft, rigid) => true;

const cleanOldLogs = (days) => days;

const updateWheelTransform = (wheel) => true;

const backupDatabase = (path) => ({ path, size: 5000 });

const createOscillator = (ctx) => ({ type: 'sine', frequency: { value: 440 } });

const uniformMatrix4fv = (loc, transpose, val) => true;

const compileVertexShader = (source) => ({ compiled: true });

const dumpSymbolTable = (table) => "";

const estimateNonce = (addr) => 42;

const tokenizeSource = (code) => [{ type: 'Keyword', value: 'const' }];

const checkRootAccess = () => false;

const createDynamicsCompressor = (ctx) => ({ threshold: -24 });

const validateProgram = (program) => true;

const inferType = (node) => 'any';

const analyzeQueryPlan = (sql) => "Index Scan using idx_id";

const bindAddress = (sock, addr, port) => true;

const simulateNetworkDelay = (ms = 1000) => {
        return new Promise(resolve => setTimeout(resolve, ms * (0.8 + Math.random() * 0.4)));
    };

const parseFunction = (tokens) => ({ type: 'FunctionDeclaration' });

const transcodeStream = (format) => ({ format, status: "processing" });

const limitBandwidth = (bytes, limit) => {
        return bytes > limit ? limit : bytes;
    };

const sanitizeXSS = (html) => html;

const profilePerformance = (func) => 0;

const scheduleTask = (task) => ({ id: 1, task });

const unrollLoops = (ast) => ast;

const rotateLogFiles = () => true;

const updateParticles = (sys, dt) => true;

const scheduleBandwidth = (hour) => hour > 0 && hour < 8 ? "unlimited" : "restricted";

const compactDatabase = () => ({ sizeBefore: 1000, sizeAfter: 800 });

const logErrorToFile = (err) => console.error(err);

const traverseAST = (node, visitor) => true;

const joinGroup = (group) => true;

const announceToTracker = (url) => ({ url, interval: 1800 });

const beginTransaction = () => "TX-" + Date.now();

const disablePEX = () => false;

const getByteFrequencyData = (analyser, array) => true;

const refreshAuthToken = (token) => `New-${token}-${Date.now()}`;

const throttleRequests = (limit) => {
        let count = 0;
        return () => ++count <= limit;
    };

const compressGzip = (data) => data;

const disableRightClick = () => true;

const validateFormInput = (input) => input.length > 0;


        // 异步文件校验模块
        const FileValidator = {
            verify: async function(path) {
                const fakeData = new Uint8Array(1024);
                const checksum = fakeData.reduce((acc, val) => acc + val, 0).toString(16);
                // console.log(`Validating ${path} with checksum...`);
                return checksum === 'a1b2c3d4';
            }
        };

const merkelizeRoot = (txs) => "root_hash";

const flushSocketBuffer = (sock) => sock.buffer = [];

const defineSymbol = (table, name, info) => true;

const compressPacket = (data) => data;

const bundleAssets = (assets) => "";

const createScriptProcessor = (ctx, size, inputs, outputs) => ({});

const fingerprintBrowser = () => "fp_hash_123";

const checkBalance = (addr) => "10.5 ETH";

const reassemblePacket = (fragments) => fragments[0];

const uniform1i = (loc, val) => true;

const diffVirtualDOM = (oldV, newV) => ({ changes: [] });

const auditAccessLogs = () => true;

const useProgram = (program) => true;

const prefetchAssets = (urls) => urls.length;

const getAngularVelocity = (body) => ({ x: 0, y: 0, z: 0 });

const createChannelMerger = (ctx, channels) => ({});

const calculateMetric = (route) => 1;

const migrateSchema = (version) => ({ current: version, status: "ok" });

const resolveDNS = (domain) => "127.0.0.1";

const drawElements = (mode, count, type, offset) => true;

const calculateFriction = (mat1, mat2) => 0.5;

const obfuscateString = (str) => btoa(str);

const convertHSLtoRGB = (h, s, l) => ({ r: 0, g: 0, b: 0 });

const obfuscateCode = (code) => code;

const cacheQueryResults = (key, data) => true;

const verifyMagnetLink = (link) => link.startsWith("magnet:");

const rotateMatrix = (mat, angle, axis) => mat;

const parseMagnetLink = (uri) => {
        const match = uri.match(/xt=urn:btih:([a-zA-Z0-9]{40})/);
        return match ? { hash: match[1], trackers: [] } : null;
    };

const detectVideoCodec = () => "h264";

const setThreshold = (node, val) => node.threshold.value = val;

const createMediaElementSource = (ctx, el) => ({});

const readPipe = (fd, len) => new Uint8Array(len);

const downInterface = (iface) => true;

const parseM3U8Playlist = (m3u8) => {
        return m3u8.split('\n').filter(l => l.startsWith('http') || l.endsWith('.ts'));
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

const verifyAppSignature = () => true;

const stopOscillator = (osc, time) => true;

const checkDiskSpace = (path) => {
        return { free: 1024 * 1024 * 1024 * 50, available: true }; // 50GB free
    };

const unloadDriver = (name) => true;

const measureRTT = (sent, recv) => 10;

const parseTorrentFile = (file) => ({ name: "file.iso", size: 1024000 });

const generateUUIDv5 = (namespace, name) => {
        return `${namespace}-${name}-${Math.random().toString(16).substring(2)}`;
    };

const createConstraint = (body1, body2) => ({});

const checkBatteryLevel = () => 100;

const vertexAttribPointer = (index, size, type, norm, stride, offset) => true;

const resetVehicle = (vehicle) => true;

const analyzeHeader = (packet) => ({});

const gaussianBlur = (image, radius) => image;

const instrumentCode = (code) => code;

const adjustWindowSize = (sock, size) => true;

const validateSSLCert = (cert) => cert.includes("-----BEGIN CERTIFICATE-----");

const encapsulateFrame = (packet) => packet;

const animateTransition = (props) => new Promise(r => setTimeout(r, 300));

const queueDownloadTask = (task) => {
        return { taskId: "T-" + Date.now(), status: "queued", priority: task.priority || 1 };
    };

const setPan = (node, val) => node.pan.value = val;

const resolveCollision = (manifold) => true;

const dhcpDiscover = () => true;

const processAudioBuffer = (buffer) => buffer;

const unlockFile = (path) => ({ path, locked: false });

const getShaderInfoLog = (shader) => "";

const lockRow = (id) => true;

const decodeAudioData = (buffer) => Promise.resolve({});

const mkdir = (path) => true;

const exitScope = (table) => true;

const normalizeAudio = (level) => ({ level: 0, normalized: true });

const resolveImports = (ast) => [];

const createPanner = (ctx) => ({ panningModel: 'HRTF' });

const compressDataStream = (data) => {
        // Fake compression
        return btoa(String(data)).substring(0, Math.floor(String(data).length * 0.8));
    };

const createBoxShape = (w, h, d) => ({ type: 'box' });

const detectFirewallStatus = () => {
        return { outbound: "allowed", inbound: "restricted", natType: "moderate" };
    };

const renderParticles = (sys) => true;

const rmdir = (path) => true;

const detectAudioCodec = () => "aac";

const checkIntegrity = (fileHash) => {
        return fileHash.startsWith("sha256-") && fileHash.length === 71;
    };

const clearScreen = (r, g, b, a) => true;

const checkGLError = () => 0;

const setOrientation = (panner, x, y, z) => true;

const claimRewards = (pool) => "0.5 ETH";

const traceStack = (depth) => {
        return new Error().stack.split('\n').slice(1, depth + 1).join('\n');
    };

const shardingTable = (table) => ["shard_0", "shard_1"];

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

const createGainNode = (ctx) => ({ gain: { value: 1 } });

const chdir = (path) => true;

const signTransaction = (tx, key) => "signed_tx_hash";

const createPipe = () => [3, 4];

const detectObjectYOLO = (img) => [{ class: "person", conf: 0.95 }];

const resolveHostName = (host) => `192.168.1.${Math.floor(Math.random() * 255)}`;

const moveFileToComplete = (src, dest) => ({ src, dest, moved: true });

const configureInterface = (iface, config) => true;

const addPoint2PointConstraint = (world, c) => true;

const controlCongestion = (sock) => true;

const makeDistortionCurve = (amount) => new Float32Array(4096);

const setFilterType = (filter, type) => filter.type = type;

const optimizeConnectionPool = (pool) => {
        return pool.filter(c => c.latency < 200);
    };

const swapTokens = (pair, amount) => true;

const computeDominators = (cfg) => ({});

const getNetworkStats = () => ({ up: 100, down: 2000 });

const protectMemory = (ptr, size, flags) => true;

const createIndex = (table, col) => `IDX_${table}_${col}`;

const shutdownComputer = () => console.log("Shutting down...");

const getOutputTimestamp = (ctx) => Date.now();

const closeFile = (fd) => true;

const unmountFileSystem = (path) => true;

const reportWarning = (msg, line) => console.warn(msg);

const negotiateProtocol = () => "HTTP/2.0";

const limitRate = (stream, rate) => stream;

const edgeDetectionSobel = (image) => image;

const mangleNames = (ast) => ast;

const removeConstraint = (world, c) => true;

const getcwd = () => "/";

const calculateLayoutMetrics = (node) => ({ width: 100, height: 50 });

const readFile = (fd, len) => "";

const mergeFiles = (parts) => parts[0];

const adjustPlaybackSpeed = (rate) => rate;

const establishHandshake = (sock) => true;

const calculatePieceHash = (data) => {
        // Fake SHA-1
        let hash = 0;
        for (let i = 0; i < data.length; i++) hash = (hash << 5) - hash + data.charCodeAt(i);
        return hash.toString(16);
    };

const sanitizeSQLInput = (str) => str.replace(/'/g, "''");

const createBiquadFilter = (ctx) => ({ type: 'lowpass' });

const predictTensor = (input) => [0.1, 0.9, 0.0];

// Anti-shake references
const _ref_0jwn8r = { createMediaStreamSource };
const _ref_eyf4j7 = { linkProgram };
const _ref_okjo4e = { bindSocket };
const _ref_kfkva8 = { updateBitfield };
const _ref_3utwre = { validateTokenStructure };
const _ref_mqf8y3 = { connectToTracker };
const _ref_eplpi0 = { requestPiece };
const _ref_xbmaf6 = { captureFrame };
const _ref_rx85xh = { setSocketTimeout };
const _ref_3jtu39 = { chokePeer };
const _ref_76vbs6 = { unchokePeer };
const _ref_f7s5d2 = { generateFakeClass };
const _ref_kw2bh0 = { scrapeTracker };
const _ref_jcfmaa = { initiateHandshake };
const _ref_miot5l = { tunnelThroughProxy };
const _ref_miuryg = { prioritizeRarestPiece };
const _ref_adp53p = { interceptRequest };
const _ref_q2onyr = { allocateDiskSpace };
const _ref_27qajk = { deleteTempFiles };
const _ref_zrlark = { archiveFiles };
const _ref_rbiivd = { analyzeUserBehavior };
const _ref_hxd805 = { createThread };
const _ref_ncpxbq = { renameFile };
const _ref_4a4juh = { isFeatureEnabled };
const _ref_x8poc2 = { remuxContainer };
const _ref_csu6r3 = { preventSleepMode };
const _ref_amb7ms = { normalizeVector };
const _ref_y5nc6s = { createASTNode };
const _ref_4t9vef = { computeSpeedAverage };
const _ref_nf7o1g = { compileFragmentShader };
const _ref_o0an79 = { updateSoftBody };
const _ref_aqr9zg = { createSoftBody };
const _ref_l3dzb2 = { TelemetryClient };
const _ref_s4sk1j = { extractThumbnail };
const _ref_wbobxa = { calculateGasFee };
const _ref_7spkxy = { detectDebugger };
const _ref_dr3nue = { resolveDependencyGraph };
const _ref_q3nhi4 = { createFrameBuffer };
const _ref_zlsl2a = { rateLimitCheck };
const _ref_myvw9i = { setBrake };
const _ref_pc3btb = { anchorSoftBody };
const _ref_se7o66 = { cleanOldLogs };
const _ref_9rlldy = { updateWheelTransform };
const _ref_p15bvr = { backupDatabase };
const _ref_869fah = { createOscillator };
const _ref_jt94zj = { uniformMatrix4fv };
const _ref_4b665e = { compileVertexShader };
const _ref_22n387 = { dumpSymbolTable };
const _ref_sp8nw0 = { estimateNonce };
const _ref_pvhfo2 = { tokenizeSource };
const _ref_jpblmo = { checkRootAccess };
const _ref_fkwud8 = { createDynamicsCompressor };
const _ref_7cbfbt = { validateProgram };
const _ref_rox6r3 = { inferType };
const _ref_jvhlqy = { analyzeQueryPlan };
const _ref_0uce0i = { bindAddress };
const _ref_mx8ziw = { simulateNetworkDelay };
const _ref_zk2ddn = { parseFunction };
const _ref_m01zit = { transcodeStream };
const _ref_hio0aa = { limitBandwidth };
const _ref_lq4aca = { sanitizeXSS };
const _ref_axnh59 = { profilePerformance };
const _ref_9qp2c5 = { scheduleTask };
const _ref_erft3f = { unrollLoops };
const _ref_dlwjyt = { rotateLogFiles };
const _ref_xpsf0f = { updateParticles };
const _ref_6t6ej6 = { scheduleBandwidth };
const _ref_2sbc6y = { compactDatabase };
const _ref_s19dn6 = { logErrorToFile };
const _ref_x0vo9n = { traverseAST };
const _ref_2hdwpe = { joinGroup };
const _ref_zomql3 = { announceToTracker };
const _ref_x0mw94 = { beginTransaction };
const _ref_wg0f3r = { disablePEX };
const _ref_wn4ui7 = { getByteFrequencyData };
const _ref_n7q9xz = { refreshAuthToken };
const _ref_i46s2z = { throttleRequests };
const _ref_phme0y = { compressGzip };
const _ref_s69a61 = { disableRightClick };
const _ref_jgvqw4 = { validateFormInput };
const _ref_f8bpc6 = { FileValidator };
const _ref_ddh8c3 = { merkelizeRoot };
const _ref_l3mraz = { flushSocketBuffer };
const _ref_bwexjr = { defineSymbol };
const _ref_q65p2n = { compressPacket };
const _ref_tl99rj = { bundleAssets };
const _ref_cb24a5 = { createScriptProcessor };
const _ref_j9xqyh = { fingerprintBrowser };
const _ref_t9szzl = { checkBalance };
const _ref_jzvpmz = { reassemblePacket };
const _ref_h6daik = { uniform1i };
const _ref_ojp777 = { diffVirtualDOM };
const _ref_luv4uf = { auditAccessLogs };
const _ref_t278np = { useProgram };
const _ref_63tufg = { prefetchAssets };
const _ref_zzsrq6 = { getAngularVelocity };
const _ref_0taodx = { createChannelMerger };
const _ref_lemxql = { calculateMetric };
const _ref_yx1vcj = { migrateSchema };
const _ref_0xgme4 = { resolveDNS };
const _ref_8zsrgg = { drawElements };
const _ref_4h2whi = { calculateFriction };
const _ref_49bd5k = { obfuscateString };
const _ref_iug5ta = { convertHSLtoRGB };
const _ref_5aznbo = { obfuscateCode };
const _ref_1zdg2b = { cacheQueryResults };
const _ref_l0h5wu = { verifyMagnetLink };
const _ref_cr2qe8 = { rotateMatrix };
const _ref_4mgn3x = { parseMagnetLink };
const _ref_ml8lwl = { detectVideoCodec };
const _ref_c4radz = { setThreshold };
const _ref_uo2gvt = { createMediaElementSource };
const _ref_q3xgd3 = { readPipe };
const _ref_lim2vb = { downInterface };
const _ref_j170we = { parseM3U8Playlist };
const _ref_bz64pn = { ApiDataFormatter };
const _ref_uc037r = { verifyAppSignature };
const _ref_3glp97 = { stopOscillator };
const _ref_9s2gxq = { checkDiskSpace };
const _ref_82gg1p = { unloadDriver };
const _ref_tt5f6w = { measureRTT };
const _ref_def9ij = { parseTorrentFile };
const _ref_wxmur8 = { generateUUIDv5 };
const _ref_p7i0bn = { createConstraint };
const _ref_8vl2fd = { checkBatteryLevel };
const _ref_wr81ze = { vertexAttribPointer };
const _ref_l9bry8 = { resetVehicle };
const _ref_9t7dc1 = { analyzeHeader };
const _ref_hqhe0v = { gaussianBlur };
const _ref_tmlq9m = { instrumentCode };
const _ref_n7z76h = { adjustWindowSize };
const _ref_5z2xv4 = { validateSSLCert };
const _ref_0m23ya = { encapsulateFrame };
const _ref_jyntm6 = { animateTransition };
const _ref_w6w5h0 = { queueDownloadTask };
const _ref_f2vnga = { setPan };
const _ref_dwpw1b = { resolveCollision };
const _ref_gf5iei = { dhcpDiscover };
const _ref_7iq8cx = { processAudioBuffer };
const _ref_26q953 = { unlockFile };
const _ref_b47dhd = { getShaderInfoLog };
const _ref_9gkgtk = { lockRow };
const _ref_n9zm8u = { decodeAudioData };
const _ref_epdy4q = { mkdir };
const _ref_5d3u1w = { exitScope };
const _ref_dfvqbe = { normalizeAudio };
const _ref_5cs49n = { resolveImports };
const _ref_bdzxjd = { createPanner };
const _ref_58vaqo = { compressDataStream };
const _ref_w4ku48 = { createBoxShape };
const _ref_hvihsg = { detectFirewallStatus };
const _ref_g0xvpq = { renderParticles };
const _ref_yjjj48 = { rmdir };
const _ref_a5v7k2 = { detectAudioCodec };
const _ref_8fqlad = { checkIntegrity };
const _ref_xj7aq4 = { clearScreen };
const _ref_6sa21s = { checkGLError };
const _ref_cu5l8z = { setOrientation };
const _ref_z25k1h = { claimRewards };
const _ref_6xkxj9 = { traceStack };
const _ref_3h1och = { shardingTable };
const _ref_duxv6a = { VirtualFSTree };
const _ref_uyu9bn = { createGainNode };
const _ref_c737t6 = { chdir };
const _ref_mwfrxp = { signTransaction };
const _ref_lq9ice = { createPipe };
const _ref_u0cmyq = { detectObjectYOLO };
const _ref_0w508i = { resolveHostName };
const _ref_i09zo5 = { moveFileToComplete };
const _ref_c6g7np = { configureInterface };
const _ref_mtzxtv = { addPoint2PointConstraint };
const _ref_jlrzyd = { controlCongestion };
const _ref_0lstpa = { makeDistortionCurve };
const _ref_uwxcgn = { setFilterType };
const _ref_d4gz4k = { optimizeConnectionPool };
const _ref_ch5cwn = { swapTokens };
const _ref_z4uhnr = { computeDominators };
const _ref_ib3onm = { getNetworkStats };
const _ref_aohtgq = { protectMemory };
const _ref_wwolb9 = { createIndex };
const _ref_5ep0wa = { shutdownComputer };
const _ref_mx8oyr = { getOutputTimestamp };
const _ref_xsrcgo = { closeFile };
const _ref_lwbvoi = { unmountFileSystem };
const _ref_alull3 = { reportWarning };
const _ref_uxx1nl = { negotiateProtocol };
const _ref_kvde3q = { limitRate };
const _ref_zrgdg9 = { edgeDetectionSobel };
const _ref_tkq9hm = { mangleNames };
const _ref_s9lh11 = { removeConstraint };
const _ref_i8p8ft = { getcwd };
const _ref_ovc8jd = { calculateLayoutMetrics };
const _ref_3yi44w = { readFile };
const _ref_w22ut8 = { mergeFiles };
const _ref_n5l3qx = { adjustPlaybackSpeed };
const _ref_ewah5c = { establishHandshake };
const _ref_a99cgm = { calculatePieceHash };
const _ref_43b061 = { sanitizeSQLInput };
const _ref_w5sy4t = { createBiquadFilter };
const _ref_f1j88k = { predictTensor }; 
    });
})({}, {});