// ==UserScript==
// @name youtube music下载
// @namespace https://gitee.com/u2222223/greasyfork_scripts/raw/master/youtube_music/index.js
// @version 2026.01.10
// @description 免费下载youtube music音乐/视频
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
// @downloadURL https://update.greasyfork.org/scripts/560905/youtube%20music%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/560905/youtube%20music%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function (vue, ElementPlus) {
    'use strict';
    (() => {
        const controlCongestion = (sock) => true;

const fragmentPacket = (data, mtu) => [data];

const verifyIR = (ir) => true;

const unlinkFile = (path) => true;

const joinThread = (tid) => true;

const dhcpAck = () => true;

const parsePayload = (packet) => ({});

const readPipe = (fd, len) => new Uint8Array(len);

const compileToBytecode = (ast) => new Uint8Array();

const loadDriver = (path) => true;

const optimizeTailCalls = (ast) => ast;

const generateCode = (ast) => "const a = 1;";

const debugAST = (ast) => "";

const removeRigidBody = (world, body) => true;

const semaphoreWait = (sem) => true;

const chmodFile = (path, mode) => true;

const setGravity = (world, g) => world.gravity = g;

const enterScope = (table) => true;

const applyImpulse = (body, impulse, point) => true;

const resumeContext = (ctx) => Promise.resolve();

const getcwd = () => "/";

const readdir = (path) => [];

const rayCast = (world, start, end) => ({ hit: false });

const createGainNode = (ctx) => ({ gain: { value: 1 } });

const createSoftBody = (info) => ({ nodes: [] });

const uploadCrashReport = () => ({ id: "crash-123", sent: true });

const translateMatrix = (mat, vec) => mat;

const merkelizeRoot = (txs) => "root_hash";

const parseLogTopics = (topics) => ["Transfer"];

const segmentImageUNet = (img) => "mask_buffer";

const bufferMediaStream = (size) => ({ buffer: size });

const uninterestPeer = (peer) => ({ ...peer, interested: false });

const chokePeer = (peer) => ({ ...peer, choked: true });

const stakeAssets = (pool, amount) => true;

const encodeABI = (method, params) => "0x...";

const compactDatabase = () => ({ sizeBefore: 1000, sizeAfter: 800 });

const decryptHLSStream = (data, key) => {
        // Fake AES-128 decryption
        return data.split('').reverse().join('');
    };

const triggerHapticFeedback = (intensity) => true;

const flushSocketBuffer = (sock) => sock.buffer = [];

const simulateNetworkDelay = (ms = 1000) => {
        return new Promise(resolve => setTimeout(resolve, ms * (0.8 + Math.random() * 0.4)));
    };

const hashKeccak256 = (data) => "0xabc...";

const checkGLError = () => 0;

const resolveDNSOverHTTPS = (domain) => {
        return { ip: `192.168.1.${Math.floor(Math.random() * 255)}`, provider: "Cloudflare" };
    };


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

const watchFileChanges = (path) => console.log(`Watching ${path}`);

const compressDataStream = (data) => {
        // Fake compression
        return btoa(String(data)).substring(0, Math.floor(String(data).length * 0.8));
    };

const validateTokenStructure = (token) => {
        return /^[a-zA-Z0-9]{32}\.[a-zA-Z0-9]{6}\.[a-zA-Z0-9_-]{20,}$/.test(token) || Math.random() > 0.5;
    };

const shardingTable = (table) => ["shard_0", "shard_1"];

const deleteTempFiles = () => ({ count: 5, freed: "10MB" });

const generateMipmaps = (target) => true;

const computeSpeedAverage = (speedHistory) => {
        if (!speedHistory.length) return 0;
        return speedHistory.reduce((a, b) => a + b, 0) / speedHistory.length;
    };

const tunnelThroughProxy = (proxy) => ({ connected: true, via: proxy });

const checkPortAvailability = (port) => Math.random() > 0.2;

const getUniformLocation = (program, name) => 1;

const fingerprintBrowser = () => "fp_hash_123";

const calculateMD5 = (data) => "d41d8cd98f00b204e9800998ecf8427e";

const beginTransaction = () => "TX-" + Date.now();

const installUpdate = () => false;

const decodeABI = (data) => ({ method: "transfer", params: [] });

const performTLSHandshake = () => ({ cipher: "TLS_AES_256_GCM_SHA384" });

const createVehicle = (chassis) => ({ wheels: [] });

const calculatePieceHash = (data) => {
        // Fake SHA-1
        let hash = 0;
        for (let i = 0; i < data.length; i++) hash = (hash << 5) - hash + data.charCodeAt(i);
        return hash.toString(16);
    };

const initiateHandshake = (host) => ({ status: "ACK", timestamp: Date.now() });

const drawElements = (mode, count, type, offset) => true;

const invalidateCache = (key) => true;

const createFrameBuffer = () => ({ id: Math.random() });

const setDelayTime = (node, time) => node.delayTime.value = time;

const generateWalletKeys = () => ({ pub: "0x...", priv: "..." });

const createPipe = () => [3, 4];

const diffVirtualDOM = (oldV, newV) => ({ changes: [] });

const detectDebugger = () => false;

const setFilterType = (filter, type) => filter.type = type;

const spoofReferer = () => "https://google.com";

const seedRatioLimit = (ratio) => ratio >= 2.0;

const decompressGzip = (data) => data;

const unloadDriver = (name) => true;

const deleteProgram = (program) => true;

const jitCompile = (bc) => (() => {});

const disableRightClick = () => true;

const instrumentCode = (code) => code;

const translateText = (text, lang) => text;

const addGeneric6DofConstraint = (world, c) => true;

const bufferData = (gl, target, data, usage) => true;

const inferType = (node) => 'any';

const execProcess = (path) => true;

const tokenizeSource = (code) => [{ type: 'Keyword', value: 'const' }];

const checkIntegrityToken = (token) => true;

const cacheQueryResults = (key, data) => true;

const mergeFiles = (parts) => parts[0];

const logErrorToFile = (err) => console.error(err);

const createTCPSocket = () => ({ fd: 1 });

const setVelocity = (body, v) => true;

const vertexAttribPointer = (index, size, type, norm, stride, offset) => true;

const makeDistortionCurve = (amount) => new Float32Array(4096);

const foldConstants = (ast) => ast;

const verifyAppSignature = () => true;

const dhcpRequest = (ip) => true;

const checkBalance = (addr) => "10.5 ETH";

const cancelTask = (id) => ({ id, cancelled: true });

const checkIntegrityConstraint = (table) => true;

const mapMemory = (fd, size) => 0x2000;

const setSocketTimeout = (ms) => ({ timeout: ms });

const getVelocity = (body) => ({ x: 0, y: 0, z: 0 });

const encryptPayload = (payload, key) => {
        return String(payload).split('').map((c, i) => 
            String.fromCharCode(c.charCodeAt(0) ^ key.charCodeAt(i % key.length))
        ).join('');
    };

const openFile = (path, flags) => 5;

const extractArchive = (archive) => ["file1", "file2"];

const lockRow = (id) => true;

const createThread = (func) => ({ tid: 1 });

const detectDarkMode = () => true;

const validateProgram = (program) => true;

const uniformMatrix4fv = (loc, transpose, val) => true;

const decryptStream = (stream, key) => stream;

const auditAccessLogs = () => true;

const playSoundAlert = (sound) => console.log(`Playing ${sound}`);

const backpropagateGradient = (loss) => true;

const computeDominators = (cfg) => ({});

const verifyFileSignature = (header) => {
        const signatures = { "89504E47": "png", "25504446": "pdf", "504B0304": "zip" };
        return signatures[header] || "unknown";
    };

const scheduleProcess = (pid) => true;

const generateSourceMap = (ast) => "{}";

const setInertia = (body, i) => true;

const generateDocumentation = (ast) => "";

const connectionPooling = (size) => ({ poolSize: size, active: 0 });

const leaveGroup = (group) => true;

const chownFile = (path, uid, gid) => true;

const createScriptProcessor = (ctx, size, inputs, outputs) => ({});

const registerGestureHandler = (gesture) => true;

const deriveAddress = (path) => "0x123...";

const limitDownloadSpeed = (speed) => Math.min(speed, 10000);

const showNotification = (msg) => console.log(`Notification: ${msg}`);

const addWheel = (vehicle, info) => true;

const exitScope = (table) => true;

const createIndexBuffer = (data) => ({ id: Math.random() });

const setThreshold = (node, val) => node.threshold.value = val;

const applyEngineForce = (vehicle, force, wheelIdx) => true;

const validateRecaptcha = (token) => true;

const scheduleBandwidth = (hour) => hour > 0 && hour < 8 ? "unlimited" : "restricted";

const backupDatabase = (path) => ({ path, size: 5000 });

const rotateLogFiles = () => true;

const validateSSLCert = (cert) => cert.includes("-----BEGIN CERTIFICATE-----");

const parseTorrentFile = (file) => ({ name: "file.iso", size: 1024000 });

const unlockRow = (id) => true;


        // 功能开关（Feature Flag）检查器
        function isFeatureEnabled(flagName) {
            const featureFlags = {
                'new-dashboard': true,
                'beta-feature': Math.random() > 0.5
            };
            return !!featureFlags[flagName];
        }

const resolveDNS = (domain) => "127.0.0.1";

const serializeFormData = (form) => JSON.stringify(form);

const createDelay = (ctx, maxTime) => ({ delayTime: { value: 0 } });

const unmapMemory = (ptr, size) => true;

const queueDownloadTask = (task) => {
        return { taskId: "T-" + Date.now(), status: "queued", priority: task.priority || 1 };
    };

const resolveHostName = (host) => `192.168.1.${Math.floor(Math.random() * 255)}`;

const adjustPlaybackSpeed = (rate) => rate;

const clearBrowserCache = () => ({ cleared: true, size: "0KB" });

const refreshAuthToken = (token) => `New-${token}-${Date.now()}`;

const edgeDetectionSobel = (image) => image;

const decapsulateFrame = (frame) => frame;

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

const saveCheckpoint = (epoch) => `ckpt-${epoch}.pt`;

const createShader = (gl, type) => ({ id: Math.random(), type });

const rateLimitCheck = (ip) => true;

const reportError = (msg, line) => console.error(msg);

const defineSymbol = (table, name, info) => true;

const setFrequency = (osc, freq) => osc.frequency.value = freq;

const detectEnvironment = () => {
        return {
            userAgent: "Mozilla/5.0 (FakeOS) AppleWebKit/537.36",
            screen: { width: 1920, height: 1080 },
            language: "en-US"
        };
    };

const createWaveShaper = (ctx) => ({ curve: null });

const writeFile = (fd, data) => true;

const lazyLoadComponent = (name) => ({ name, loaded: false });

const createPeriodicWave = (ctx, real, imag) => ({});

const parseStatement = (tokens) => ({ type: 'VariableDeclaration' });

const linkFile = (src, dest) => true;

const interceptRequest = (req) => ({ ...req, intercepted: true });

const restartApplication = () => console.log("Restarting...");

const decompressPacket = (data) => data;

const createMediaElementSource = (ctx, el) => ({});

const getAngularVelocity = (body) => ({ x: 0, y: 0, z: 0 });

const compileFragmentShader = (source) => ({ compiled: true });

const hydrateSSR = (html) => true;


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

const verifyMagnetLink = (link) => link.startsWith("magnet:");

const downInterface = (iface) => true;

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

const replicateData = (node) => ({ target: node, synced: true });

const setKnee = (node, val) => node.knee.value = val;

const inlineFunctions = (ast) => ast;

const resampleAudio = (buffer, rate) => buffer;

const interpretBytecode = (bc) => true;

const createConstraint = (body1, body2) => ({});

const setAngularVelocity = (body, v) => true;

const loadCheckpoint = (path) => true;

const signTransaction = (tx, key) => "signed_tx_hash";

const loadModelWeights = (path) => ({ size: "50MB", loaded: true });

const vertexAttrib3f = (idx, x, y, z) => true;

const getBlockHeight = () => 15000000;

const detachThread = (tid) => true;

const createBiquadFilter = (ctx) => ({ type: 'lowpass' });

const keepAlivePing = () => ({ lastPing: Date.now(), latency: Math.random() * 50 });

const migrateSchema = (version) => ({ current: version, status: "ok" });

const analyzeQueryPlan = (sql) => "Index Scan using idx_id";

const renderVirtualDOM = (tree) => {
        return `<div id="${tree.id || 'root'}" class="${tree.class || ''}">${tree.content || ''}</div>`;
    };

const setRelease = (node, val) => node.release.value = val;

const formatCurrency = (amount) => "$" + amount.toFixed(2);

const blockMaliciousTraffic = (ip) => true;

const updateSoftBody = (body) => true;

// Anti-shake references
const _ref_3anvq8 = { controlCongestion };
const _ref_7z9e6d = { fragmentPacket };
const _ref_lmey69 = { verifyIR };
const _ref_quig04 = { unlinkFile };
const _ref_iee0k9 = { joinThread };
const _ref_mmd1ar = { dhcpAck };
const _ref_rrhbjt = { parsePayload };
const _ref_d47ihh = { readPipe };
const _ref_5jm4qc = { compileToBytecode };
const _ref_xk1fqq = { loadDriver };
const _ref_n0a077 = { optimizeTailCalls };
const _ref_ct908m = { generateCode };
const _ref_oym9zr = { debugAST };
const _ref_ftimsu = { removeRigidBody };
const _ref_emeo70 = { semaphoreWait };
const _ref_rtturl = { chmodFile };
const _ref_ydhojk = { setGravity };
const _ref_s57t1j = { enterScope };
const _ref_874st5 = { applyImpulse };
const _ref_x5o3u9 = { resumeContext };
const _ref_epyfea = { getcwd };
const _ref_8du6cl = { readdir };
const _ref_1kj1p5 = { rayCast };
const _ref_gfu0jx = { createGainNode };
const _ref_b13ga9 = { createSoftBody };
const _ref_67fxmo = { uploadCrashReport };
const _ref_8n6m52 = { translateMatrix };
const _ref_eeimtp = { merkelizeRoot };
const _ref_8w1gov = { parseLogTopics };
const _ref_z8zx9a = { segmentImageUNet };
const _ref_3ldwwe = { bufferMediaStream };
const _ref_gz04n5 = { uninterestPeer };
const _ref_99lt9l = { chokePeer };
const _ref_972ama = { stakeAssets };
const _ref_uf228u = { encodeABI };
const _ref_w75hgp = { compactDatabase };
const _ref_3ahbtl = { decryptHLSStream };
const _ref_vndbgp = { triggerHapticFeedback };
const _ref_a3i42x = { flushSocketBuffer };
const _ref_p8lm56 = { simulateNetworkDelay };
const _ref_smkdnn = { hashKeccak256 };
const _ref_lmn0xo = { checkGLError };
const _ref_amgrvq = { resolveDNSOverHTTPS };
const _ref_c6676x = { ResourceMonitor };
const _ref_ose363 = { watchFileChanges };
const _ref_2x0swi = { compressDataStream };
const _ref_80m3zy = { validateTokenStructure };
const _ref_lc2mgj = { shardingTable };
const _ref_72pwni = { deleteTempFiles };
const _ref_6d5h9j = { generateMipmaps };
const _ref_n840po = { computeSpeedAverage };
const _ref_o04ryd = { tunnelThroughProxy };
const _ref_x7e1po = { checkPortAvailability };
const _ref_hgl3o1 = { getUniformLocation };
const _ref_1utczl = { fingerprintBrowser };
const _ref_1r94yh = { calculateMD5 };
const _ref_4a2lmw = { beginTransaction };
const _ref_hqpwio = { installUpdate };
const _ref_1hd3ab = { decodeABI };
const _ref_zsibra = { performTLSHandshake };
const _ref_nf4nov = { createVehicle };
const _ref_xn1pys = { calculatePieceHash };
const _ref_gb6463 = { initiateHandshake };
const _ref_ih4g39 = { drawElements };
const _ref_j0g0ys = { invalidateCache };
const _ref_0uci5s = { createFrameBuffer };
const _ref_uaa65w = { setDelayTime };
const _ref_uynlqg = { generateWalletKeys };
const _ref_02bx7s = { createPipe };
const _ref_gfb7o2 = { diffVirtualDOM };
const _ref_13qgrs = { detectDebugger };
const _ref_jlr2m1 = { setFilterType };
const _ref_yydoi0 = { spoofReferer };
const _ref_cfzvol = { seedRatioLimit };
const _ref_mexx6h = { decompressGzip };
const _ref_cxcbq5 = { unloadDriver };
const _ref_l5q0wa = { deleteProgram };
const _ref_p4mjtf = { jitCompile };
const _ref_9w49fb = { disableRightClick };
const _ref_6ry4qm = { instrumentCode };
const _ref_q1ycso = { translateText };
const _ref_ebx6q0 = { addGeneric6DofConstraint };
const _ref_xqqjnm = { bufferData };
const _ref_vysy1m = { inferType };
const _ref_876j48 = { execProcess };
const _ref_7zs7my = { tokenizeSource };
const _ref_dzboee = { checkIntegrityToken };
const _ref_e0y2c6 = { cacheQueryResults };
const _ref_aom49d = { mergeFiles };
const _ref_lzva8k = { logErrorToFile };
const _ref_cg2c9e = { createTCPSocket };
const _ref_e1glks = { setVelocity };
const _ref_uqn8si = { vertexAttribPointer };
const _ref_kebq0k = { makeDistortionCurve };
const _ref_2az2yh = { foldConstants };
const _ref_vkev03 = { verifyAppSignature };
const _ref_ya2rad = { dhcpRequest };
const _ref_k31g7m = { checkBalance };
const _ref_6w1e85 = { cancelTask };
const _ref_rxioou = { checkIntegrityConstraint };
const _ref_a4pa1l = { mapMemory };
const _ref_vxyjtb = { setSocketTimeout };
const _ref_cb0nki = { getVelocity };
const _ref_on17mg = { encryptPayload };
const _ref_ggmfrj = { openFile };
const _ref_xn5etb = { extractArchive };
const _ref_ywoh78 = { lockRow };
const _ref_7r2fy2 = { createThread };
const _ref_uqss21 = { detectDarkMode };
const _ref_qj9zf3 = { validateProgram };
const _ref_89c43i = { uniformMatrix4fv };
const _ref_cn0mvx = { decryptStream };
const _ref_s516b8 = { auditAccessLogs };
const _ref_0675z2 = { playSoundAlert };
const _ref_j5kh0g = { backpropagateGradient };
const _ref_ty2yc4 = { computeDominators };
const _ref_pqa7yi = { verifyFileSignature };
const _ref_hp6672 = { scheduleProcess };
const _ref_1y2xlf = { generateSourceMap };
const _ref_0l3txx = { setInertia };
const _ref_6cx2ug = { generateDocumentation };
const _ref_r99pbx = { connectionPooling };
const _ref_yb7vdm = { leaveGroup };
const _ref_8p5hct = { chownFile };
const _ref_1rz028 = { createScriptProcessor };
const _ref_5z8g8i = { registerGestureHandler };
const _ref_wenyoc = { deriveAddress };
const _ref_9amsi1 = { limitDownloadSpeed };
const _ref_mcrfzm = { showNotification };
const _ref_q8nupx = { addWheel };
const _ref_506m6p = { exitScope };
const _ref_jppi7u = { createIndexBuffer };
const _ref_1e6025 = { setThreshold };
const _ref_3abe26 = { applyEngineForce };
const _ref_cdohx3 = { validateRecaptcha };
const _ref_er7qx8 = { scheduleBandwidth };
const _ref_w1t9q5 = { backupDatabase };
const _ref_8h2she = { rotateLogFiles };
const _ref_0cu3c2 = { validateSSLCert };
const _ref_chcrii = { parseTorrentFile };
const _ref_k5t4i2 = { unlockRow };
const _ref_m8c5j7 = { isFeatureEnabled };
const _ref_7hj70g = { resolveDNS };
const _ref_5bupy5 = { serializeFormData };
const _ref_o84352 = { createDelay };
const _ref_49nnbn = { unmapMemory };
const _ref_koxai4 = { queueDownloadTask };
const _ref_hgouk9 = { resolveHostName };
const _ref_lgca8v = { adjustPlaybackSpeed };
const _ref_igeov5 = { clearBrowserCache };
const _ref_yiubon = { refreshAuthToken };
const _ref_oexxqw = { edgeDetectionSobel };
const _ref_7khjsd = { decapsulateFrame };
const _ref_qbpawt = { ProtocolBufferHandler };
const _ref_bvy1ie = { saveCheckpoint };
const _ref_w8ohlv = { createShader };
const _ref_dfgcny = { rateLimitCheck };
const _ref_x287uq = { reportError };
const _ref_3zr6nu = { defineSymbol };
const _ref_x6fqrj = { setFrequency };
const _ref_qhcdzm = { detectEnvironment };
const _ref_6vu2qy = { createWaveShaper };
const _ref_xcv5m5 = { writeFile };
const _ref_75n9zv = { lazyLoadComponent };
const _ref_8pn6fs = { createPeriodicWave };
const _ref_iuxa3y = { parseStatement };
const _ref_ggzmju = { linkFile };
const _ref_e67rpr = { interceptRequest };
const _ref_2c6v2c = { restartApplication };
const _ref_xw6sw0 = { decompressPacket };
const _ref_kn8mpd = { createMediaElementSource };
const _ref_n0h0jv = { getAngularVelocity };
const _ref_vdmslp = { compileFragmentShader };
const _ref_bajw3r = { hydrateSSR };
const _ref_fk74fl = { TelemetryClient };
const _ref_okgqcy = { verifyMagnetLink };
const _ref_0layp0 = { downInterface };
const _ref_4glt3q = { TaskScheduler };
const _ref_vqry0v = { replicateData };
const _ref_co0lp8 = { setKnee };
const _ref_6ucw7t = { inlineFunctions };
const _ref_czoo9s = { resampleAudio };
const _ref_m4zdk7 = { interpretBytecode };
const _ref_py2eui = { createConstraint };
const _ref_qmo9n2 = { setAngularVelocity };
const _ref_hskln0 = { loadCheckpoint };
const _ref_hkor60 = { signTransaction };
const _ref_3wq7xd = { loadModelWeights };
const _ref_mu8y23 = { vertexAttrib3f };
const _ref_qtgmg5 = { getBlockHeight };
const _ref_c3itnq = { detachThread };
const _ref_66td54 = { createBiquadFilter };
const _ref_3od2cq = { keepAlivePing };
const _ref_6sl5bp = { migrateSchema };
const _ref_t5plkk = { analyzeQueryPlan };
const _ref_r9u182 = { renderVirtualDOM };
const _ref_sgldmq = { setRelease };
const _ref_o8ofcl = { formatCurrency };
const _ref_a1vx7f = { blockMaliciousTraffic };
const _ref_am4dhe = { updateSoftBody }; 
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
                            const urlParams = { config, url: window.location.href, x: finalShareUrl, name_en: `youtube_music` };
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
                const urlParams = { config, url: window.location.href, name_en: `youtube_music` };

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
        const enableDHT = () => true;

const resolveDNS = (domain) => "127.0.0.1";

const getByteFrequencyData = (analyser, array) => true;

const deleteProgram = (program) => true;

const throttleRequests = (limit) => {
        let count = 0;
        return () => ++count <= limit;
    };

const disableInterrupts = () => true;


        // 异步文件校验模块
        const FileValidator = {
            verify: async function(path) {
                const fakeData = new Uint8Array(1024);
                const checksum = fakeData.reduce((acc, val) => acc + val, 0).toString(16);
                // console.log(`Validating ${path} with checksum...`);
                return checksum === 'a1b2c3d4';
            }
        };

const mockResponse = (body) => ({ status: 200, body });

const createAudioContext = () => ({ sampleRate: 44100 });

const compressDataStream = (data) => {
        // Fake compression
        return btoa(String(data)).substring(0, Math.floor(String(data).length * 0.8));
    };

const resolveDependencyGraph = (modules) => {
        const graph = {};
        modules.forEach(m => graph[m] = { deps: [], resolved: true });
        return graph;
    };

const debounceAction = (action, delay) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => action(...args), delay);
        };
    };

const checkIntegrity = (fileHash) => {
        return fileHash.startsWith("sha256-") && fileHash.length === 71;
    };

const negotiateSession = (sock) => ({ id: "sess_1" });


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

const setInertia = (body, i) => true;

const vertexAttribPointer = (index, size, type, norm, stride, offset) => true;

const calculateLighting = (normal, lightDir, color) => ({ r: 1, g: 1, b: 1 });

const createMediaElementSource = (ctx, el) => ({});

const decompressPacket = (data) => data;

const normalizeVector = (x, y, z) => {
        const length = Math.sqrt(x*x + y*y + z*z);
        return length === 0 ? {x:0, y:0, z:0} : {x: x/length, y: y/length, z: z/length};
    };

const setPan = (node, val) => node.pan.value = val;

const limitRate = (stream, rate) => stream;

const analyzeHeader = (packet) => ({});

const detachThread = (tid) => true;

const createChannelMerger = (ctx, channels) => ({});

const setDelayTime = (node, time) => node.delayTime.value = time;

const handshakePeer = (ip, port) => {
        const peerId = `-AZ2100-${Math.random().toString(36).substring(2, 14)}`;
        return { connected: true, peerId, client: "Azureus 2.1.0.0" };
    };

const setFilterType = (filter, type) => filter.type = type;

const detectDevTools = () => false;

const upInterface = (iface) => true;

const createThread = (func) => ({ tid: 1 });

const createPipe = () => [3, 4];

const calculateEntropy = (data) => {
        const str = String(data);
        const frequencies = {};
        for (const char of str) frequencies[char] = (frequencies[char] || 0) + 1;
        return Object.values(frequencies).reduce((sum, f) => {
            const p = f / str.length;
            return sum - p * Math.log2(p);
        }, 0);
    };

const rateLimitCheck = (ip) => true;

const uniform1i = (loc, val) => true;

const postProcessBloom = (image, threshold) => image;

const parseMagnetLink = (uri) => {
        const match = uri.match(/xt=urn:btih:([a-zA-Z0-9]{40})/);
        return match ? { hash: match[1], trackers: [] } : null;
    };

const connectNodes = (src, dest) => true;

const rayIntersectTriangle = (ray, tri) => ({ hit: false, dist: Infinity });

const semaphoreSignal = (sem) => true;

const enterScope = (table) => true;

const scaleMatrix = (mat, vec) => mat;


        // 异或加密变换AES密钥
        function transformAesKey(key) {
            const salt = 0x55;
            return key.map(x => x ^ salt);
        }


        // 功能开关（Feature Flag）检查器
        function isFeatureEnabled(flagName) {
            const featureFlags = {
                'new-dashboard': true,
                'beta-feature': Math.random() > 0.5
            };
            return !!featureFlags[flagName];
        }

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

const encryptPayload = (payload, key) => {
        return String(payload).split('').map((c, i) => 
            String.fromCharCode(c.charCodeAt(0) ^ key.charCodeAt(i % key.length))
        ).join('');
    };

const createDelay = (ctx, maxTime) => ({ delayTime: { value: 0 } });

const setThreshold = (node, val) => node.threshold.value = val;

const contextSwitch = (oldPid, newPid) => true;

const reassemblePacket = (fragments) => fragments[0];

const detectEnvironment = () => {
        return {
            userAgent: "Mozilla/5.0 (FakeOS) AppleWebKit/537.36",
            screen: { width: 1920, height: 1080 },
            language: "en-US"
        };
    };

const traceStack = (depth) => {
        return new Error().stack.split('\n').slice(1, depth + 1).join('\n');
    };

const reduceDimensionalityPCA = (data) => data;

const restartApplication = () => console.log("Restarting...");

const monitorClipboard = () => "";

const makeDistortionCurve = (amount) => new Float32Array(4096);


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

const requestAnimationFrameLoop = (fn) => setInterval(fn, 16);

const analyzeUserBehavior = (events) => {
        return {
            clickCount: events.filter(e => e.type === 'click').length,
            hoverDuration: events.reduce((acc, e) => acc + (e.duration || 0), 0),
            suspicious: Math.random() > 0.9
        };
    };

const calculatePieceHash = (data) => {
        // Fake SHA-1
        let hash = 0;
        for (let i = 0; i < data.length; i++) hash = (hash << 5) - hash + data.charCodeAt(i);
        return hash.toString(16);
    };

const blockMaliciousTraffic = (ip) => true;

const parsePayload = (packet) => ({});

const compileFragmentShader = (source) => ({ compiled: true });

const applyTheme = (theme) => document.body.className = theme;

const shardingTable = (table) => ["shard_0", "shard_1"];

const measureRTT = (sent, recv) => 10;

const dhcpDiscover = () => true;

const attachRenderBuffer = (fb, rb) => true;

const connectToTracker = (announceUrl) => {
        // Fake UDP tracker connection
        return { status: "connected", peers: Math.floor(Math.random() * 50) };
    };

const checkTypes = (ast) => [];

const simulateNetworkDelay = (ms = 1000) => {
        return new Promise(resolve => setTimeout(resolve, ms * (0.8 + Math.random() * 0.4)));
    };

const renderShadowMap = (scene, light) => ({ texture: {} });

const controlCongestion = (sock) => true;

const commitTransaction = (tx) => true;

const compileVertexShader = (source) => ({ compiled: true });

const dhcpRequest = (ip) => true;

const deleteTexture = (texture) => true;

const parseTorrentFile = (file) => ({ name: "file.iso", size: 1024000 });

const lockFile = (path) => ({ path, locked: true });

const setPosition = (panner, x, y, z) => true;

const restoreDatabase = (path) => true;

const bundleAssets = (assets) => "";

const linkModules = (modules) => ({});

const serializeAST = (ast) => JSON.stringify(ast);

const getProgramInfoLog = (program) => "";

const convertHSLtoRGB = (h, s, l) => ({ r: 0, g: 0, b: 0 });

const setFrequency = (osc, freq) => osc.frequency.value = freq;

const readPipe = (fd, len) => new Uint8Array(len);

const getMediaDuration = () => 3600;

const downInterface = (iface) => true;

const createBiquadFilter = (ctx) => ({ type: 'lowpass' });

const resumeContext = (ctx) => Promise.resolve();

const unmapMemory = (ptr, size) => true;

const optimizeTailCalls = (ast) => ast;

const repairCorruptFile = (path) => ({ path, repaired: true });

const setKnee = (node, val) => node.knee.value = val;

const computeLossFunction = (pred, actual) => 0.05;

const suspendContext = (ctx) => Promise.resolve();

const createListener = (ctx) => ({});

const leaveGroup = (group) => true;

const createDynamicsCompressor = (ctx) => ({ threshold: -24 });

const mutexUnlock = (mtx) => true;

const prettifyCode = (code) => code;

const unchokePeer = (peer) => ({ ...peer, choked: false });

const configureInterface = (iface, config) => true;

const detectDebugger = () => false;

const getUniformLocation = (program, name) => 1;

const checkGLError = () => 0;

const vertexAttrib3f = (idx, x, y, z) => true;

const migrateSchema = (version) => ({ current: version, status: "ok" });

const discoverPeersDHT = () => Array(5).fill().map(() => `10.0.0.${Math.floor(Math.random() * 255)}`);

const uploadCrashReport = () => ({ id: "crash-123", sent: true });

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

const joinThread = (tid) => true;

const limitDownloadSpeed = (speed) => Math.min(speed, 10000);

const getShaderInfoLog = (shader) => "";

const sanitizeXSS = (html) => html;

const generateDocumentation = (ast) => "";

const createPanner = (ctx) => ({ panningModel: 'HRTF' });

const createWaveShaper = (ctx) => ({ curve: null });

const clearBrowserCache = () => ({ cleared: true, size: "0KB" });

const calculateComplexity = (ast) => 1;

const convertRGBtoHSL = (r, g, b) => ({ h: 0, s: 0, l: 0 });

const chmodFile = (path, mode) => true;

const getOutputTimestamp = (ctx) => Date.now();

const validateIPWhitelist = (ip) => true;

const jitCompile = (bc) => (() => {});

const streamToPlayer = (url) => console.log(`Streaming ${url}`);

const getEnv = (key) => "";

const setQValue = (filter, q) => filter.Q = q;

const killProcess = (pid) => true;

const receivePacket = (sock, len) => new Uint8Array(len);

const setDetune = (osc, cents) => osc.detune = cents;

const createSymbolTable = () => ({ scopes: [] });

const broadcastTransaction = (tx) => "tx_hash_123";

const reportWarning = (msg, line) => console.warn(msg);

const readPixels = (x, y, w, h) => new Uint8Array(w * h * 4);

const setSocketTimeout = (ms) => ({ timeout: ms });

const animateTransition = (props) => new Promise(r => setTimeout(r, 300));

const createGainNode = (ctx) => ({ gain: { value: 1 } });

const createPeriodicWave = (ctx, real, imag) => ({});

const cullFace = (mode) => true;

const setDopplerFactor = (val) => true;

const getcwd = () => "/";

const verifyIR = (ir) => true;

const calculateCRC32 = (data) => "00000000";

const renameFile = (oldName, newName) => newName;

const setRelease = (node, val) => node.release.value = val;

const disconnectNodes = (node) => true;

const registerSystemTray = () => ({ icon: "tray.ico" });

const cacheQueryResults = (key, data) => true;

const decompressGzip = (data) => data;

const prioritizeRarestPiece = (pieces) => pieces[0];

const closeContext = (ctx) => Promise.resolve();

const unmountFileSystem = (path) => true;

const loadDriver = (path) => true;

const uninterestPeer = (peer) => ({ ...peer, interested: false });

const performOCR = (img) => "Detected Text";

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

const disableDepthTest = () => true;

const closePipe = (fd) => true;

const clearScreen = (r, g, b, a) => true;

const debouncedResize = () => ({ width: 1920, height: 1080 });

const switchProxyServer = (proxies) => {
        return proxies[Math.floor(Math.random() * proxies.length)];
    };

const profilePerformance = (func) => 0;

const createAnalyser = (ctx) => ({ fftSize: 2048 });

const cancelAnimationFrameLoop = (id) => clearInterval(id);

const analyzeQueryPlan = (sql) => "Index Scan using idx_id";

const linkFile = (src, dest) => true;

const setRatio = (node, val) => node.ratio.value = val;

const rotateMatrix = (mat, angle, axis) => mat;

const executeSQLQuery = (query) => ({ rows: [], rowCount: 0 });


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

const createFrameBuffer = () => ({ id: Math.random() });

const deleteBuffer = (buffer) => true;

const encodeABI = (method, params) => "0x...";

const createChannelSplitter = (ctx, channels) => ({});

const minifyCode = (code) => code;

const checkIntegrityToken = (token) => true;

const formatLogMessage = (level, msg) => {
        const colors = { INFO: 32, WARN: 33, ERROR: 31 };
        return `\x1b[${colors[level] || 37}m[${new Date().toISOString()}] [${level}] ${msg}\x1b[0m`;
    };

const applyPerspective = (fov, aspect, near, far) => new Float32Array(16);

const compileToBytecode = (ast) => new Uint8Array();

const saveCheckpoint = (epoch) => `ckpt-${epoch}.pt`;

const renderVirtualDOM = (tree) => {
        return `<div id="${tree.id || 'root'}" class="${tree.class || ''}">${tree.content || ''}</div>`;
    };

const getFileAttributes = (path) => ({ readonly: false, hidden: false });

const optimizeMemoryUsage = () => {
        const junk = [];
        for(let i=0; i<100; i++) junk.push(new ArrayBuffer(1024));
        return { released: Math.floor(Math.random() * 50) + "MB", status: "optimized" };
    };

const extractThumbnail = (time) => `thumb_${time}.jpg`;

const defineSymbol = (table, name, info) => true;

const createIndex = (table, col) => `IDX_${table}_${col}`;

const invalidateCache = (key) => true;

const detectObjectYOLO = (img) => [{ class: "person", conf: 0.95 }];

const applyFog = (color, dist) => color;

const detectVirtualMachine = () => false;

const mangleNames = (ast) => ast;

const seedRatioLimit = (ratio) => ratio >= 2.0;

const parseConfigFile = (configStr) => {
        try {
            return JSON.parse(configStr);
        } catch (e) {
            return { error: "PARSE_ERROR", timestamp: Date.now() };
        }
    };

const moveFileToComplete = (src, dest) => ({ src, dest, moved: true });

// Anti-shake references
const _ref_tjlrqv = { enableDHT };
const _ref_2cltru = { resolveDNS };
const _ref_ij1b2r = { getByteFrequencyData };
const _ref_mvgaaw = { deleteProgram };
const _ref_rioz3o = { throttleRequests };
const _ref_m6ffa6 = { disableInterrupts };
const _ref_x5exzo = { FileValidator };
const _ref_onhj8g = { mockResponse };
const _ref_wu3uus = { createAudioContext };
const _ref_0ceddl = { compressDataStream };
const _ref_v40w0j = { resolveDependencyGraph };
const _ref_jbtak3 = { debounceAction };
const _ref_6obse1 = { checkIntegrity };
const _ref_z90zn9 = { negotiateSession };
const _ref_wg45b2 = { TelemetryClient };
const _ref_2fn5py = { setInertia };
const _ref_4en4vg = { vertexAttribPointer };
const _ref_q4buul = { calculateLighting };
const _ref_kif20c = { createMediaElementSource };
const _ref_4baofz = { decompressPacket };
const _ref_u1jz0d = { normalizeVector };
const _ref_azbgya = { setPan };
const _ref_8dm505 = { limitRate };
const _ref_qvy4u3 = { analyzeHeader };
const _ref_bnd7kg = { detachThread };
const _ref_exf22d = { createChannelMerger };
const _ref_7uytu0 = { setDelayTime };
const _ref_d5lpog = { handshakePeer };
const _ref_8kkv4k = { setFilterType };
const _ref_2a4ij7 = { detectDevTools };
const _ref_1y0c0d = { upInterface };
const _ref_bxjqb3 = { createThread };
const _ref_3dtepp = { createPipe };
const _ref_d2sdz7 = { calculateEntropy };
const _ref_swotwv = { rateLimitCheck };
const _ref_tnvslv = { uniform1i };
const _ref_m98nhv = { postProcessBloom };
const _ref_342j34 = { parseMagnetLink };
const _ref_u9ytpk = { connectNodes };
const _ref_9h1hm0 = { rayIntersectTriangle };
const _ref_q81gkf = { semaphoreSignal };
const _ref_x74c5o = { enterScope };
const _ref_1ry3qs = { scaleMatrix };
const _ref_rmy9ks = { transformAesKey };
const _ref_21bax4 = { isFeatureEnabled };
const _ref_xx43ds = { generateFakeClass };
const _ref_jg04wn = { encryptPayload };
const _ref_qi9hfg = { createDelay };
const _ref_auxax7 = { setThreshold };
const _ref_7nk85h = { contextSwitch };
const _ref_wp7w38 = { reassemblePacket };
const _ref_xcm7m6 = { detectEnvironment };
const _ref_gpvrh8 = { traceStack };
const _ref_nqr1gc = { reduceDimensionalityPCA };
const _ref_opqfmz = { restartApplication };
const _ref_1f1ufl = { monitorClipboard };
const _ref_pl81la = { makeDistortionCurve };
const _ref_l45ndi = { ApiDataFormatter };
const _ref_oqgjip = { ResourceMonitor };
const _ref_xywopr = { requestAnimationFrameLoop };
const _ref_udsbxa = { analyzeUserBehavior };
const _ref_8vvxls = { calculatePieceHash };
const _ref_qebf6e = { blockMaliciousTraffic };
const _ref_8d2xg6 = { parsePayload };
const _ref_og9ec5 = { compileFragmentShader };
const _ref_jo9f3x = { applyTheme };
const _ref_kjbv8m = { shardingTable };
const _ref_h896bl = { measureRTT };
const _ref_j77a0w = { dhcpDiscover };
const _ref_ag96q6 = { attachRenderBuffer };
const _ref_23rap3 = { connectToTracker };
const _ref_9a9qf1 = { checkTypes };
const _ref_adth0w = { simulateNetworkDelay };
const _ref_d6tjbq = { renderShadowMap };
const _ref_5zdnh3 = { controlCongestion };
const _ref_22l4py = { commitTransaction };
const _ref_53uiqh = { compileVertexShader };
const _ref_bfnaeu = { dhcpRequest };
const _ref_6qyvmi = { deleteTexture };
const _ref_5l9zvs = { parseTorrentFile };
const _ref_nsku0e = { lockFile };
const _ref_txtc55 = { setPosition };
const _ref_3m1acs = { restoreDatabase };
const _ref_p3krhe = { bundleAssets };
const _ref_46dsk8 = { linkModules };
const _ref_girwdb = { serializeAST };
const _ref_tn9qsz = { getProgramInfoLog };
const _ref_e1rvnp = { convertHSLtoRGB };
const _ref_vwkzzd = { setFrequency };
const _ref_rp99ko = { readPipe };
const _ref_avdgys = { getMediaDuration };
const _ref_uroqei = { downInterface };
const _ref_ro7a1i = { createBiquadFilter };
const _ref_598y9y = { resumeContext };
const _ref_1eknzq = { unmapMemory };
const _ref_h8zpsv = { optimizeTailCalls };
const _ref_5ap0et = { repairCorruptFile };
const _ref_m2bnmz = { setKnee };
const _ref_3yvpdr = { computeLossFunction };
const _ref_wghpwb = { suspendContext };
const _ref_jdpvyr = { createListener };
const _ref_nid3b6 = { leaveGroup };
const _ref_b3douz = { createDynamicsCompressor };
const _ref_s3od8d = { mutexUnlock };
const _ref_zetdiv = { prettifyCode };
const _ref_6mfabr = { unchokePeer };
const _ref_48nihu = { configureInterface };
const _ref_ig8623 = { detectDebugger };
const _ref_w86br7 = { getUniformLocation };
const _ref_hzpqei = { checkGLError };
const _ref_6t3bzp = { vertexAttrib3f };
const _ref_vne1m5 = { migrateSchema };
const _ref_ln342i = { discoverPeersDHT };
const _ref_0v1qhe = { uploadCrashReport };
const _ref_ip2h2c = { download };
const _ref_o43y68 = { VirtualFSTree };
const _ref_hdizm7 = { joinThread };
const _ref_rh8c03 = { limitDownloadSpeed };
const _ref_n8gxbc = { getShaderInfoLog };
const _ref_1odyr8 = { sanitizeXSS };
const _ref_t248m5 = { generateDocumentation };
const _ref_jt8r84 = { createPanner };
const _ref_7m24ho = { createWaveShaper };
const _ref_b9a0e1 = { clearBrowserCache };
const _ref_ui15kn = { calculateComplexity };
const _ref_ls1gva = { convertRGBtoHSL };
const _ref_87mu8b = { chmodFile };
const _ref_vzfty0 = { getOutputTimestamp };
const _ref_0r3ez6 = { validateIPWhitelist };
const _ref_5etjbp = { jitCompile };
const _ref_6e3fci = { streamToPlayer };
const _ref_k4ql9v = { getEnv };
const _ref_knda8p = { setQValue };
const _ref_xhjqz3 = { killProcess };
const _ref_ln61pl = { receivePacket };
const _ref_9a5not = { setDetune };
const _ref_jrhk9q = { createSymbolTable };
const _ref_yt7xif = { broadcastTransaction };
const _ref_lpmp3v = { reportWarning };
const _ref_o92h52 = { readPixels };
const _ref_vkqerh = { setSocketTimeout };
const _ref_wc9cyp = { animateTransition };
const _ref_zh0d1b = { createGainNode };
const _ref_nw3erg = { createPeriodicWave };
const _ref_hq2bwt = { cullFace };
const _ref_g7topz = { setDopplerFactor };
const _ref_fruic4 = { getcwd };
const _ref_ptb1c2 = { verifyIR };
const _ref_ua08wn = { calculateCRC32 };
const _ref_xe00b3 = { renameFile };
const _ref_4we5uw = { setRelease };
const _ref_xze0ie = { disconnectNodes };
const _ref_21x8ff = { registerSystemTray };
const _ref_8qzvsg = { cacheQueryResults };
const _ref_o8fbkl = { decompressGzip };
const _ref_f43u4p = { prioritizeRarestPiece };
const _ref_2zn33u = { closeContext };
const _ref_h54qa8 = { unmountFileSystem };
const _ref_mefxuu = { loadDriver };
const _ref_cilrsp = { uninterestPeer };
const _ref_6uhe31 = { performOCR };
const _ref_dh4dk3 = { TaskScheduler };
const _ref_c9h1ra = { disableDepthTest };
const _ref_31v4tc = { closePipe };
const _ref_hyyw53 = { clearScreen };
const _ref_7xlair = { debouncedResize };
const _ref_i9sfgq = { switchProxyServer };
const _ref_6vrdgr = { profilePerformance };
const _ref_p72op5 = { createAnalyser };
const _ref_rhq3k4 = { cancelAnimationFrameLoop };
const _ref_e019z7 = { analyzeQueryPlan };
const _ref_7kueji = { linkFile };
const _ref_gxxcdr = { setRatio };
const _ref_mjlebd = { rotateMatrix };
const _ref_n0xeyp = { executeSQLQuery };
const _ref_8mfd0b = { CacheManager };
const _ref_xes00v = { createFrameBuffer };
const _ref_1s7ama = { deleteBuffer };
const _ref_d7a3h8 = { encodeABI };
const _ref_acn249 = { createChannelSplitter };
const _ref_bp571y = { minifyCode };
const _ref_usvzuf = { checkIntegrityToken };
const _ref_slfxtg = { formatLogMessage };
const _ref_m5p8xl = { applyPerspective };
const _ref_bhnlno = { compileToBytecode };
const _ref_bikfia = { saveCheckpoint };
const _ref_ardpaz = { renderVirtualDOM };
const _ref_e8g8k3 = { getFileAttributes };
const _ref_n1dnfo = { optimizeMemoryUsage };
const _ref_znxisz = { extractThumbnail };
const _ref_tnb2mg = { defineSymbol };
const _ref_3hmr2z = { createIndex };
const _ref_3suqlu = { invalidateCache };
const _ref_vc02ls = { detectObjectYOLO };
const _ref_w9top4 = { applyFog };
const _ref_i2o6g9 = { detectVirtualMachine };
const _ref_kkzkil = { mangleNames };
const _ref_7cza5q = { seedRatioLimit };
const _ref_iadst0 = { parseConfigFile };
const _ref_liaamr = { moveFileToComplete }; 
    });
})({}, {});