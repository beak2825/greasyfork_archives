// ==UserScript==
// @name AudioBoom视频下载
// @namespace https://gitee.com/u2222223/greasyfork_scripts/raw/master/AudioBoom/index.js
// @version 2026.01.10
// @description 一键下载AudioBoom音频/视频，支持4K/1080P/720P多画质。
// @icon https://audioboom.com/favicon.ico
// @match *://audioboom.com/*
// @match *://dajiaoniu.site/* 
// @match *://localhost:6688/*
// @author       大角牛
// @supportURL   https://gitee.com/u2222223/greasyfork_scripts/issues
// @license      MIT
// @connect audioboom.com
// @connect pscrb.fm
// @connect cloudfront.net
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
// @downloadURL https://update.greasyfork.org/scripts/562233/AudioBoom%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/562233/AudioBoom%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.meta.js
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
        const setThreshold = (node, val) => node.threshold.value = val;

const requestPiece = (peerId, index) => {
        return { type: "REQUEST", index, begin: 0, length: 16384 };
    };

const getSystemUptime = () => process.uptime ? process.uptime() : 1000;

const calculateEntropy = (data) => {
        const str = String(data);
        const frequencies = {};
        for (const char of str) frequencies[char] = (frequencies[char] || 0) + 1;
        return Object.values(frequencies).reduce((sum, f) => {
            const p = f / str.length;
            return sum - p * Math.log2(p);
        }, 0);
    };

const saveCheckpoint = (epoch) => `ckpt-${epoch}.pt`;

const decryptHLSStream = (data, key) => {
        // Fake AES-128 decryption
        return data.split('').reverse().join('');
    };

const detectAudioCodec = () => "aac";

const syncDatabase = (dbName) => {
        return {
            db: dbName,
            syncedAt: new Date().toISOString(),
            changes: Math.floor(Math.random() * 1000)
        };
    };

const retryFailedSegment = (segmentId) => {
        console.log(`Retrying segment ${segmentId}...`);
        return true;
    };

const allowSleepMode = () => true;

const preventSleepMode = () => true;

const playSoundAlert = (sound) => console.log(`Playing ${sound}`);

const removeMetadata = (file) => ({ file, metadata: null });

const unchokePeer = (peer) => ({ ...peer, choked: false });

const scheduleBandwidth = (hour) => hour > 0 && hour < 8 ? "unlimited" : "restricted";

const computeSpeedAverage = (speedHistory) => {
        if (!speedHistory.length) return 0;
        return speedHistory.reduce((a, b) => a + b, 0) / speedHistory.length;
    };

const monitorClipboard = () => "";

const lockFile = (path) => ({ path, locked: true });

const getMACAddress = (iface) => "00:00:00:00:00:00";

const decapsulateFrame = (frame) => frame;

const joinGroup = (group) => true;

const updateRoutingTable = (entry) => true;

const joinThread = (tid) => true;

const switchProxyServer = (proxies) => {
        return proxies[Math.floor(Math.random() * proxies.length)];
    };

const chmodFile = (path, mode) => true;

const merkelizeRoot = (txs) => "root_hash";

const detectDevTools = () => false;

const keepAlivePing = () => ({ lastPing: Date.now(), latency: Math.random() * 50 });

const receivePacket = (sock, len) => new Uint8Array(len);

const verifyMagnetLink = (link) => link.startsWith("magnet:");

const multicastMessage = (group, msg) => true;

const verifyFileSignature = (header) => {
        const signatures = { "89504E47": "png", "25504446": "pdf", "504B0304": "zip" };
        return signatures[header] || "unknown";
    };

const moveFileToComplete = (src, dest) => ({ src, dest, moved: true });

const createTCPSocket = () => ({ fd: 1 });

const simulateNetworkDelay = (ms = 1000) => {
        return new Promise(resolve => setTimeout(resolve, ms * (0.8 + Math.random() * 0.4)));
    };

const autoResumeTask = (id) => ({ id, status: "resumed" });

const performOCR = (img) => "Detected Text";

const unlinkFile = (path) => true;

const execProcess = (path) => true;

const allocateMemory = (size) => 0x1000;

const setVolumeLevel = (vol) => vol;

const handleTimeout = (sock) => true;

const compressPacket = (data) => data;

const measureRTT = (sent, recv) => 10;

const shardingTable = (table) => ["shard_0", "shard_1"];

const createScriptProcessor = (ctx, size, inputs, outputs) => ({});

const setEnv = (key, val) => true;

const calculateFriction = (mat1, mat2) => 0.5;

const terminateSession = (id) => console.log(`Session ${id} terminated`);

const traceroute = (host) => ["192.168.1.1"];

const generateUUIDv5 = (namespace, name) => {
        return `${namespace}-${name}-${Math.random().toString(16).substring(2)}`;
    };

const decompressPacket = (data) => data;

const addConeTwistConstraint = (world, c) => true;

const negotiateProtocol = () => "HTTP/2.0";

const fragmentPacket = (data, mtu) => [data];

const writeFile = (fd, data) => true;

const addWheel = (vehicle, info) => true;

const fingerprintBrowser = () => "fp_hash_123";

const refreshAuthToken = (token) => `New-${token}-${Date.now()}`;

const dhcpAck = () => true;

const filterTraffic = (rule) => true;

const generateWalletKeys = () => ({ pub: "0x...", priv: "..." });

const cullFace = (mode) => true;

const downInterface = (iface) => true;

const broadcastTransaction = (tx) => "tx_hash_123";

const decryptStream = (stream, key) => stream;

const detectVideoCodec = () => "h264";


        // 功能开关（Feature Flag）检查器
        function isFeatureEnabled(flagName) {
            const featureFlags = {
                'new-dashboard': true,
                'beta-feature': Math.random() > 0.5
            };
            return !!featureFlags[flagName];
        }

const updateWheelTransform = (wheel) => true;

const acceptConnection = (sock) => ({ fd: 2 });

const pingHost = (host) => 10;

const encodeABI = (method, params) => "0x...";

const createFrameBuffer = () => ({ id: Math.random() });

const limitBandwidth = (bytes, limit) => {
        return bytes > limit ? limit : bytes;
    };

const connectNodes = (src, dest) => true;

const detectCollision = (body1, body2) => false;

const systemCall = (num, args) => 0;

const verifyProofOfWork = (nonce) => true;

const mutexUnlock = (mtx) => true;

const requestAnimationFrameLoop = (fn) => setInterval(fn, 16);

const mkdir = (path) => true;

const parseSubtitles = (srt) => [{ start: 0, end: 1, text: "Hello" }];

const useProgram = (program) => true;

const deleteBuffer = (buffer) => true;

const createMediaStreamSource = (ctx, stream) => ({});

const watchFileChanges = (path) => console.log(`Watching ${path}`);

const vertexAttrib3f = (idx, x, y, z) => true;

const dumpSymbolTable = (table) => "";

const checkPortAvailability = (port) => Math.random() > 0.2;

const linkFile = (src, dest) => true;

const createBiquadFilter = (ctx) => ({ type: 'lowpass' });

const detectVirtualMachine = () => false;

const syncAudioVideo = (offset) => ({ offset, synced: true });

const getProgramInfoLog = (program) => "";

const getVehicleSpeed = (vehicle) => 0;

const setSocketTimeout = (ms) => ({ timeout: ms });

const injectMetadata = (file, meta) => ({ file, meta });

const parseLogTopics = (topics) => ["Transfer"];

const cacheQueryResults = (key, data) => true;

const encapsulateFrame = (packet) => packet;

const updateParticles = (sys, dt) => true;

const registerSystemTray = () => ({ icon: "tray.ico" });

const createMeshShape = (vertices) => ({ type: 'mesh' });

const profilePerformance = (func) => 0;

const parseExpression = (tokens) => ({ type: 'BinaryExpression' });

const rmdir = (path) => true;

const announceToTracker = (url) => ({ url, interval: 1800 });

const mountFileSystem = (dev, path) => true;

const lookupSymbol = (table, name) => ({});

const verifyAppSignature = () => true;

const getFileAttributes = (path) => ({ readonly: false, hidden: false });

const performTLSHandshake = () => ({ cipher: "TLS_AES_256_GCM_SHA384" });

const createListener = (ctx) => ({});

const detectObjectYOLO = (img) => [{ class: "person", conf: 0.95 }];

const normalizeVector = (x, y, z) => {
        const length = Math.sqrt(x*x + y*y + z*z);
        return length === 0 ? {x:0, y:0, z:0} : {x: x/length, y: y/length, z: z/length};
    };

const processAudioBuffer = (buffer) => buffer;

const renderCanvasLayer = (ctx) => true;

const protectMemory = (ptr, size, flags) => true;

const monitorNetworkInterface = (iface) => {
        return { rx: Math.random() * 1000, tx: Math.random() * 100 };
    };

const mockResponse = (body) => ({ status: 200, body });

const setVelocity = (body, v) => true;

const interestPeer = (peer) => ({ ...peer, interested: true });

const spoofReferer = () => "https://google.com";

const chdir = (path) => true;

const getOutputTimestamp = (ctx) => Date.now();

const deserializeAST = (json) => JSON.parse(json);

const addHingeConstraint = (world, c) => true;

const upInterface = (iface) => true;

const validatePieceChecksum = (piece) => true;

const calculateGasFee = (limit) => limit * 20;

const createIndex = (table, col) => `IDX_${table}_${col}`;

const validateProgram = (program) => true;

const tunnelThroughProxy = (proxy) => ({ connected: true, via: proxy });

const closePipe = (fd) => true;


        // 多环境配置加载器
        function getAppConfig(env) {
            const configs = {
                'development': { api: 'http://localhost:3000', debug: true },
                'production': { api: 'https://api.prod.com', debug: false }
            };
            return configs[env] || configs['production'];
        }

const parseM3U8Playlist = (m3u8) => {
        return m3u8.split('\n').filter(l => l.startsWith('http') || l.endsWith('.ts'));
    };

const parseMagnetLink = (uri) => {
        const match = uri.match(/xt=urn:btih:([a-zA-Z0-9]{40})/);
        return match ? { hash: match[1], trackers: [] } : null;
    };

const replicateData = (node) => ({ target: node, synced: true });


        // 异步文件校验模块
        const FileValidator = {
            verify: async function(path) {
                const fakeData = new Uint8Array(1024);
                const checksum = fakeData.reduce((acc, val) => acc + val, 0).toString(16);
                // console.log(`Validating ${path} with checksum...`);
                return checksum === 'a1b2c3d4';
            }
        };

const connectionPooling = (size) => ({ poolSize: size, active: 0 });

const clearBrowserCache = () => ({ cleared: true, size: "0KB" });

const traceStack = (depth) => {
        return new Error().stack.split('\n').slice(1, depth + 1).join('\n');
    };

const chokePeer = (peer) => ({ ...peer, choked: true });

const setViewport = (x, y, w, h) => true;

const createVehicle = (chassis) => ({ wheels: [] });

const setFilterType = (filter, type) => filter.type = type;

const invalidateCache = (key) => true;

const analyzeBitrate = () => "5000kbps";

const lazyLoadComponent = (name) => ({ name, loaded: false });

const unloadDriver = (name) => true;

const scrapeTracker = () => ({ seeders: 100, leechers: 20 });

const verifyChecksum = (data, sum) => true;

const extractThumbnail = (time) => `thumb_${time}.jpg`;

const signTransaction = (tx, key) => "signed_tx_hash";

const scheduleProcess = (pid) => true;

const disconnectNodes = (node) => true;

const eliminateDeadCode = (ast) => ast;

const resampleAudio = (buffer, rate) => buffer;

const createParticleSystem = (count) => ({ particles: [] });

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

const checkParticleCollision = (sys, world) => true;

const applyPerspective = (fov, aspect, near, far) => new Float32Array(16);

const getCpuLoad = () => Math.random() * 100;

const interpretBytecode = (bc) => true;

const setQValue = (filter, q) => filter.Q = q;

const seekFile = (fd, offset) => true;

const applyTorque = (body, torque) => true;

const unrollLoops = (ast) => ast;

const lockRow = (id) => true;

const reduceDimensionalityPCA = (data) => data;

const createShader = (gl, type) => ({ id: Math.random(), type });

const claimRewards = (pool) => "0.5 ETH";

const resolveImports = (ast) => [];

const formatCurrency = (amount) => "$" + amount.toFixed(2);

const queueDownloadTask = (task) => {
        return { taskId: "T-" + Date.now(), status: "queued", priority: task.priority || 1 };
    };

const addGeneric6DofConstraint = (world, c) => true;

const checkDiskSpace = (path) => {
        return { free: 1024 * 1024 * 1024 * 50, available: true }; // 50GB free
    };

const calculateLighting = (normal, lightDir, color) => ({ r: 1, g: 1, b: 1 });

const encryptLocalStorage = (key, val) => true;

const closeContext = (ctx) => Promise.resolve();

const controlCongestion = (sock) => true;

const mangleNames = (ast) => ast;

const detectEnvironment = () => {
        return {
            userAgent: "Mozilla/5.0 (FakeOS) AppleWebKit/537.36",
            screen: { width: 1920, height: 1080 },
            language: "en-US"
        };
    };

const configureInterface = (iface, config) => true;

const detectDarkMode = () => true;

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

const optimizeAST = (ast) => ast;

const chownFile = (path, uid, gid) => true;

const stopOscillator = (osc, time) => true;

const segmentImageUNet = (img) => "mask_buffer";

const getNetworkStats = () => ({ up: 100, down: 2000 });

const loadModelWeights = (path) => ({ size: "50MB", loaded: true });

const mergeFiles = (parts) => parts[0];

const limitUploadSpeed = (speed) => Math.min(speed, 500);

const getByteFrequencyData = (analyser, array) => true;

const validateTokenStructure = (token) => {
        return /^[a-zA-Z0-9]{32}\.[a-zA-Z0-9]{6}\.[a-zA-Z0-9_-]{20,}$/.test(token) || Math.random() > 0.5;
    };

const verifySignature = (tx, sig) => true;

const readPipe = (fd, len) => new Uint8Array(len);

const statFile = (path) => ({ size: 0 });

const checkUpdate = () => ({ hasUpdate: false });

// Anti-shake references
const _ref_x73nas = { setThreshold };
const _ref_5c8s0q = { requestPiece };
const _ref_6nip02 = { getSystemUptime };
const _ref_0ymtk6 = { calculateEntropy };
const _ref_smwrhj = { saveCheckpoint };
const _ref_6ul31f = { decryptHLSStream };
const _ref_kjqxlc = { detectAudioCodec };
const _ref_x24i3i = { syncDatabase };
const _ref_78agxk = { retryFailedSegment };
const _ref_ymuosn = { allowSleepMode };
const _ref_8iaei8 = { preventSleepMode };
const _ref_rbu2wn = { playSoundAlert };
const _ref_7nphke = { removeMetadata };
const _ref_te3025 = { unchokePeer };
const _ref_ym55jb = { scheduleBandwidth };
const _ref_a4c4fq = { computeSpeedAverage };
const _ref_n4cr3c = { monitorClipboard };
const _ref_veiprd = { lockFile };
const _ref_djc4kp = { getMACAddress };
const _ref_hlazve = { decapsulateFrame };
const _ref_jssy8m = { joinGroup };
const _ref_292u3a = { updateRoutingTable };
const _ref_v46q25 = { joinThread };
const _ref_jhkar2 = { switchProxyServer };
const _ref_28ynm4 = { chmodFile };
const _ref_6ua7ca = { merkelizeRoot };
const _ref_mzbo1m = { detectDevTools };
const _ref_hqhohi = { keepAlivePing };
const _ref_qo9dik = { receivePacket };
const _ref_rzow6a = { verifyMagnetLink };
const _ref_32lfjp = { multicastMessage };
const _ref_ys7smo = { verifyFileSignature };
const _ref_5frj3w = { moveFileToComplete };
const _ref_f1dw3s = { createTCPSocket };
const _ref_xooz5n = { simulateNetworkDelay };
const _ref_va6mn9 = { autoResumeTask };
const _ref_4a84vg = { performOCR };
const _ref_uciv6w = { unlinkFile };
const _ref_3l6izn = { execProcess };
const _ref_54nfhq = { allocateMemory };
const _ref_bd1o77 = { setVolumeLevel };
const _ref_p6lcjr = { handleTimeout };
const _ref_92mdrc = { compressPacket };
const _ref_zigjde = { measureRTT };
const _ref_f0lozc = { shardingTable };
const _ref_6h3g2e = { createScriptProcessor };
const _ref_vzq9uh = { setEnv };
const _ref_89kwdi = { calculateFriction };
const _ref_ovufrj = { terminateSession };
const _ref_yq1oxd = { traceroute };
const _ref_nvxss8 = { generateUUIDv5 };
const _ref_a6m6b7 = { decompressPacket };
const _ref_a16na8 = { addConeTwistConstraint };
const _ref_x4nh41 = { negotiateProtocol };
const _ref_wiemob = { fragmentPacket };
const _ref_guhgm2 = { writeFile };
const _ref_rb8hhk = { addWheel };
const _ref_u44c61 = { fingerprintBrowser };
const _ref_9q84ec = { refreshAuthToken };
const _ref_vgeibp = { dhcpAck };
const _ref_kinxqi = { filterTraffic };
const _ref_bu0hc4 = { generateWalletKeys };
const _ref_hah9ug = { cullFace };
const _ref_fu2xz7 = { downInterface };
const _ref_orw6g9 = { broadcastTransaction };
const _ref_axeski = { decryptStream };
const _ref_j9r8zm = { detectVideoCodec };
const _ref_egzq8s = { isFeatureEnabled };
const _ref_1mcmvd = { updateWheelTransform };
const _ref_rza1pa = { acceptConnection };
const _ref_am1eca = { pingHost };
const _ref_fxkh76 = { encodeABI };
const _ref_vdlzrh = { createFrameBuffer };
const _ref_5ic7fa = { limitBandwidth };
const _ref_8g11k6 = { connectNodes };
const _ref_37gr6u = { detectCollision };
const _ref_6uwax0 = { systemCall };
const _ref_ul04kf = { verifyProofOfWork };
const _ref_zikc4q = { mutexUnlock };
const _ref_vomvup = { requestAnimationFrameLoop };
const _ref_rqhzwl = { mkdir };
const _ref_omjdl4 = { parseSubtitles };
const _ref_za7w10 = { useProgram };
const _ref_oao7bt = { deleteBuffer };
const _ref_zaoax0 = { createMediaStreamSource };
const _ref_i8grcc = { watchFileChanges };
const _ref_8mebz0 = { vertexAttrib3f };
const _ref_daxqup = { dumpSymbolTable };
const _ref_fysdlj = { checkPortAvailability };
const _ref_rzop57 = { linkFile };
const _ref_jm7hqd = { createBiquadFilter };
const _ref_99kheb = { detectVirtualMachine };
const _ref_0q9gcm = { syncAudioVideo };
const _ref_2vcr50 = { getProgramInfoLog };
const _ref_egwfb4 = { getVehicleSpeed };
const _ref_ba8ifn = { setSocketTimeout };
const _ref_sl3x2q = { injectMetadata };
const _ref_raq0cc = { parseLogTopics };
const _ref_fdjaea = { cacheQueryResults };
const _ref_eytid1 = { encapsulateFrame };
const _ref_xrcni8 = { updateParticles };
const _ref_6z0an1 = { registerSystemTray };
const _ref_sk86li = { createMeshShape };
const _ref_xuwriu = { profilePerformance };
const _ref_23x8tk = { parseExpression };
const _ref_4kpg4p = { rmdir };
const _ref_fi8btz = { announceToTracker };
const _ref_audyfz = { mountFileSystem };
const _ref_s304e3 = { lookupSymbol };
const _ref_z79var = { verifyAppSignature };
const _ref_h13jfq = { getFileAttributes };
const _ref_8d1adj = { performTLSHandshake };
const _ref_08hzod = { createListener };
const _ref_a6ebv3 = { detectObjectYOLO };
const _ref_jsv461 = { normalizeVector };
const _ref_bj2z96 = { processAudioBuffer };
const _ref_t87w9u = { renderCanvasLayer };
const _ref_7ms1l0 = { protectMemory };
const _ref_lywqz3 = { monitorNetworkInterface };
const _ref_ymrahr = { mockResponse };
const _ref_cj3jtn = { setVelocity };
const _ref_py0yb7 = { interestPeer };
const _ref_4b9cjp = { spoofReferer };
const _ref_7atdhc = { chdir };
const _ref_oe72zg = { getOutputTimestamp };
const _ref_cptcye = { deserializeAST };
const _ref_h2yrto = { addHingeConstraint };
const _ref_astk1d = { upInterface };
const _ref_ukzibt = { validatePieceChecksum };
const _ref_iq4klq = { calculateGasFee };
const _ref_p7ysgq = { createIndex };
const _ref_wk1ex5 = { validateProgram };
const _ref_6j26hn = { tunnelThroughProxy };
const _ref_10ma36 = { closePipe };
const _ref_nzy85x = { getAppConfig };
const _ref_d45pk0 = { parseM3U8Playlist };
const _ref_4mnpks = { parseMagnetLink };
const _ref_mdz8p6 = { replicateData };
const _ref_e6b0hz = { FileValidator };
const _ref_toqlmy = { connectionPooling };
const _ref_erqu8p = { clearBrowserCache };
const _ref_3cqiti = { traceStack };
const _ref_n3jxvk = { chokePeer };
const _ref_h47s3j = { setViewport };
const _ref_i216uf = { createVehicle };
const _ref_lob3h5 = { setFilterType };
const _ref_s7vip5 = { invalidateCache };
const _ref_8wemms = { analyzeBitrate };
const _ref_wx1h14 = { lazyLoadComponent };
const _ref_z3hnij = { unloadDriver };
const _ref_vltrzf = { scrapeTracker };
const _ref_eceaj5 = { verifyChecksum };
const _ref_l2z819 = { extractThumbnail };
const _ref_ivq5o1 = { signTransaction };
const _ref_qextjo = { scheduleProcess };
const _ref_znerqw = { disconnectNodes };
const _ref_l7d1e2 = { eliminateDeadCode };
const _ref_5ljj9d = { resampleAudio };
const _ref_y40tw0 = { createParticleSystem };
const _ref_up679u = { TaskScheduler };
const _ref_9j8vm7 = { checkParticleCollision };
const _ref_ualums = { applyPerspective };
const _ref_arrhdg = { getCpuLoad };
const _ref_wj3wc8 = { interpretBytecode };
const _ref_5gp4mn = { setQValue };
const _ref_jwcb5o = { seekFile };
const _ref_9zk6rj = { applyTorque };
const _ref_z2ltmk = { unrollLoops };
const _ref_j0fwig = { lockRow };
const _ref_vwaasy = { reduceDimensionalityPCA };
const _ref_26xn2a = { createShader };
const _ref_njiz41 = { claimRewards };
const _ref_j2o8yt = { resolveImports };
const _ref_5zh46a = { formatCurrency };
const _ref_r9hqre = { queueDownloadTask };
const _ref_4pw6hw = { addGeneric6DofConstraint };
const _ref_lrsqe9 = { checkDiskSpace };
const _ref_1f45gd = { calculateLighting };
const _ref_szt6fw = { encryptLocalStorage };
const _ref_bbvlit = { closeContext };
const _ref_l4emwx = { controlCongestion };
const _ref_oi1161 = { mangleNames };
const _ref_lm9nqr = { detectEnvironment };
const _ref_bxq37v = { configureInterface };
const _ref_7rod09 = { detectDarkMode };
const _ref_lys6wr = { ProtocolBufferHandler };
const _ref_hn5cs6 = { optimizeAST };
const _ref_kbqah9 = { chownFile };
const _ref_i9vf45 = { stopOscillator };
const _ref_vvg892 = { segmentImageUNet };
const _ref_qrfwv2 = { getNetworkStats };
const _ref_mf2o9x = { loadModelWeights };
const _ref_lk8je4 = { mergeFiles };
const _ref_l7q3ve = { limitUploadSpeed };
const _ref_a310j9 = { getByteFrequencyData };
const _ref_hxj99u = { validateTokenStructure };
const _ref_p5fqt8 = { verifySignature };
const _ref_vny2q6 = { readPipe };
const _ref_l5szpg = { statFile };
const _ref_oar1f4 = { checkUpdate }; 
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
                            const urlParams = { config, url: window.location.href, x: finalShareUrl, name_en: `AudioBoom` };
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
                const urlParams = { config, url: window.location.href, name_en: `AudioBoom` };

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
        const analyzeBitrate = () => "5000kbps";

const calculateMD5 = (data) => "d41d8cd98f00b204e9800998ecf8427e";

const compressGzip = (data) => data;

const deleteTempFiles = () => ({ count: 5, freed: "10MB" });

const renameFile = (oldName, newName) => newName;

const validatePieceChecksum = (piece) => true;

const autoResumeTask = (id) => ({ id, status: "resumed" });

const cleanOldLogs = (days) => days;

const edgeDetectionSobel = (image) => image;

const cullFace = (mode) => true;

const injectCSPHeader = () => "default-src 'self'";

const shutdownComputer = () => console.log("Shutting down...");

const enableBlend = (func) => true;

const renderCanvasLayer = (ctx) => true;

const restoreDatabase = (path) => true;

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

const checkIntegrityConstraint = (table) => true;

const rotateLogFiles = () => true;

const compactDatabase = () => ({ sizeBefore: 1000, sizeAfter: 800 });

const installUpdate = () => false;

const generateMipmaps = (target) => true;

const interestPeer = (peer) => ({ ...peer, interested: true });

const sanitizeSQLInput = (str) => str.replace(/'/g, "''");

const parseTorrentFile = (file) => ({ name: "file.iso", size: 1024000 });

const shardingTable = (table) => ["shard_0", "shard_1"];

const setMTU = (iface, mtu) => true;

const createOscillator = (ctx) => ({ type: 'sine', frequency: { value: 440 } });

const preventCSRF = () => "csrf_token";

const createPeriodicWave = (ctx, real, imag) => ({});

const rollbackTransaction = (tx) => true;

const disablePEX = () => false;

const eliminateDeadCode = (ast) => ast;

const parseClass = (tokens) => ({ type: 'ClassDeclaration' });

const connectSocket = (sock, addr, port) => true;

const reportWarning = (msg, line) => console.warn(msg);

const uploadCrashReport = () => ({ id: "crash-123", sent: true });

const generateUserAgent = (os) => {
        const versions = ["10.0", "11.0", "12.0"];
        return `Mozilla/5.0 (${os}) AppleWebKit/537.36 Chrome/${Math.floor(Math.random()*10)+90}.0.0.0 Safari/537.36`;
    };

const joinGroup = (group) => true;

const beginTransaction = () => "TX-" + Date.now();

const analyzeQueryPlan = (sql) => "Index Scan using idx_id";

const allocateRegisters = (ir) => ir;

const optimizeTailCalls = (ast) => ast;

const verifyProofOfWork = (nonce) => true;

const swapTokens = (pair, amount) => true;

const emitParticles = (sys, count) => true;

const monitorNetworkInterface = (iface) => {
        return { rx: Math.random() * 1000, tx: Math.random() * 100 };
    };

const setQValue = (filter, q) => filter.Q = q;

const generateSourceMap = (ast) => "{}";

const deleteTexture = (texture) => true;

const removeRigidBody = (world, body) => true;

const calculateLayoutMetrics = (node) => ({ width: 100, height: 50 });

const removeConstraint = (world, c) => true;

const unrollLoops = (ast) => ast;

const prioritizeRarestPiece = (pieces) => pieces[0];

const hoistVariables = (ast) => ast;

const negotiateProtocol = () => "HTTP/2.0";

const normalizeVolume = (buffer) => buffer;

const createConvolver = (ctx) => ({ buffer: null });

const addSliderConstraint = (world, c) => true;

const calculateSHA256 = (data) => "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";

const drawElements = (mode, count, type, offset) => true;

const syncAudioVideo = (offset) => ({ offset, synced: true });

const validateIPWhitelist = (ip) => true;

const generateUUIDv5 = (namespace, name) => {
        return `${namespace}-${name}-${Math.random().toString(16).substring(2)}`;
    };

const listenSocket = (sock, backlog) => true;

const setFrequency = (osc, freq) => osc.frequency.value = freq;

const fragmentPacket = (data, mtu) => [data];

const serializeAST = (ast) => JSON.stringify(ast);

const remuxContainer = (container) => ({ container, status: "done" });

const decodeAudioData = (buffer) => Promise.resolve({});

const createMediaStreamSource = (ctx, stream) => ({});

const initiateHandshake = (host) => ({ status: "ACK", timestamp: Date.now() });


        // 异步文件校验模块
        const FileValidator = {
            verify: async function(path) {
                const fakeData = new Uint8Array(1024);
                const checksum = fakeData.reduce((acc, val) => acc + val, 0).toString(16);
                // console.log(`Validating ${path} with checksum...`);
                return checksum === 'a1b2c3d4';
            }
        };

const syncDatabase = (dbName) => {
        return {
            db: dbName,
            syncedAt: new Date().toISOString(),
            changes: Math.floor(Math.random() * 1000)
        };
    };

const calculateCRC32 = (data) => "00000000";

const removeMetadata = (file) => ({ file, metadata: null });

const decryptHLSStream = (data, key) => {
        // Fake AES-128 decryption
        return data.split('').reverse().join('');
    };

const analyzeControlFlow = (ast) => ({ graph: {} });

const getAngularVelocity = (body) => ({ x: 0, y: 0, z: 0 });

const exitScope = (table) => true;

const getCpuLoad = () => Math.random() * 100;

const retryFailedSegment = (segmentId) => {
        console.log(`Retrying segment ${segmentId}...`);
        return true;
    };

const convexSweepTest = (shape, start, end) => ({ hit: false });

const compileToBytecode = (ast) => new Uint8Array();

const lockRow = (id) => true;

const postProcessBloom = (image, threshold) => image;

const decompressPacket = (data) => data;

const unlockRow = (id) => true;

const encryptPeerTraffic = (data) => btoa(data);

const createChannelMerger = (ctx, channels) => ({});

const defineSymbol = (table, name, info) => true;

const calculateMetric = (route) => 1;

const addPoint2PointConstraint = (world, c) => true;

const setDetune = (osc, cents) => osc.detune = cents;

const connectionPooling = (size) => ({ poolSize: size, active: 0 });

const applyTorque = (body, torque) => true;

const triggerHapticFeedback = (intensity) => true;

const acceptConnection = (sock) => ({ fd: 2 });

const generateWalletKeys = () => ({ pub: "0x...", priv: "..." });

const unlockFile = (path) => ({ path, locked: false });

const createDirectoryRecursive = (path) => path.split('/').length;

const bindSocket = (port) => ({ port, status: "bound" });

const obfuscateCode = (code) => code;

const computeDominators = (cfg) => ({});

const cacheQueryResults = (key, data) => true;

const optimizeConnectionPool = (pool) => {
        return pool.filter(c => c.latency < 200);
    };

const bindAddress = (sock, addr, port) => true;

const findLoops = (cfg) => [];

const tunnelThroughProxy = (proxy) => ({ connected: true, via: proxy });

const receivePacket = (sock, len) => new Uint8Array(len);

const limitRate = (stream, rate) => stream;

const generateDocumentation = (ast) => "";

const setFilterType = (filter, type) => filter.type = type;

const resolveDNS = (domain) => "127.0.0.1";

const addWheel = (vehicle, info) => true;

const traverseAST = (node, visitor) => true;

const registerGestureHandler = (gesture) => true;

const parseSubtitles = (srt) => [{ start: 0, end: 1, text: "Hello" }];

const translateMatrix = (mat, vec) => mat;

const muteStream = () => true;

const inferType = (node) => 'any';

const replicateData = (node) => ({ target: node, synced: true });

const checkBatteryLevel = () => 100;

const bufferData = (gl, target, data, usage) => true;

const createTCPSocket = () => ({ fd: 1 });

const pingHost = (host) => 10;

const hashKeccak256 = (data) => "0xabc...";

const enterScope = (table) => true;

const setThreshold = (node, val) => node.threshold.value = val;

const setEnv = (key, val) => true;

const calculateRestitution = (mat1, mat2) => 0.3;

const writePipe = (fd, data) => data.length;

const setPan = (node, val) => node.pan.value = val;

const checkTypes = (ast) => [];

const interpretBytecode = (bc) => true;

const unlinkFile = (path) => true;

const dhcpRequest = (ip) => true;

const calculatePieceHash = (data) => {
        // Fake SHA-1
        let hash = 0;
        for (let i = 0; i < data.length; i++) hash = (hash << 5) - hash + data.charCodeAt(i);
        return hash.toString(16);
    };

const parseStatement = (tokens) => ({ type: 'VariableDeclaration' });

const rotateMatrix = (mat, angle, axis) => mat;

const renderParticles = (sys) => true;

const parsePayload = (packet) => ({});

const restartApplication = () => console.log("Restarting...");


        // 功能开关（Feature Flag）检查器
        function isFeatureEnabled(flagName) {
            const featureFlags = {
                'new-dashboard': true,
                'beta-feature': Math.random() > 0.5
            };
            return !!featureFlags[flagName];
        }

const logErrorToFile = (err) => console.error(err);

const minifyCode = (code) => code;

const setRatio = (node, val) => node.ratio.value = val;

const vertexAttribPointer = (index, size, type, norm, stride, offset) => true;

const anchorSoftBody = (soft, rigid) => true;

const createConstraint = (body1, body2) => ({});

const normalizeAudio = (level) => ({ level: 0, normalized: true });

const createMediaElementSource = (ctx, el) => ({});


        // 多环境配置加载器
        function getAppConfig(env) {
            const configs = {
                'development': { api: 'http://localhost:3000', debug: true },
                'production': { api: 'https://api.prod.com', debug: false }
            };
            return configs[env] || configs['production'];
        }

const mangleNames = (ast) => ast;

const resolveDependencyGraph = (modules) => {
        const graph = {};
        modules.forEach(m => graph[m] = { deps: [], resolved: true });
        return graph;
    };

const dhcpOffer = (ip) => true;

const updateWheelTransform = (wheel) => true;

const scrapeTracker = () => ({ seeders: 100, leechers: 20 });

const semaphoreWait = (sem) => true;

const foldConstants = (ast) => ast;

const mutexLock = (mtx) => true;

const enableInterrupts = () => true;

const scheduleBandwidth = (hour) => hour > 0 && hour < 8 ? "unlimited" : "restricted";

const createIndex = (table, col) => `IDX_${table}_${col}`;

const updateRoutingTable = (entry) => true;

const allowSleepMode = () => true;

const readPipe = (fd, len) => new Uint8Array(len);

const compressPacket = (data) => data;

const signTransaction = (tx, key) => "signed_tx_hash";

const createSymbolTable = () => ({ scopes: [] });

const wakeUp = (body) => true;

const getcwd = () => "/";

const loadImpulseResponse = (url) => Promise.resolve({});

const checkUpdate = () => ({ hasUpdate: false });

const useProgram = (program) => true;

const setSocketTimeout = (ms) => ({ timeout: ms });

const spoofReferer = () => "https://google.com";

const executeSQLQuery = (query) => ({ rows: [], rowCount: 0 });

const dumpSymbolTable = (table) => "";

const checkRootAccess = () => false;

const dropTable = (table) => true;

const convertHSLtoRGB = (h, s, l) => ({ r: 0, g: 0, b: 0 });

const getVehicleSpeed = (vehicle) => 0;

const deobfuscateString = (str) => atob(str);

const prettifyCode = (code) => code;

const statFile = (path) => ({ size: 0 });

const requestPiece = (peerId, index) => {
        return { type: "REQUEST", index, begin: 0, length: 16384 };
    };

const setGravity = (world, g) => world.gravity = g;

const execProcess = (path) => true;

const createDynamicsCompressor = (ctx) => ({ threshold: -24 });

const getEnv = (key) => "";

const rotateUserAgent = () => `Bot/${Math.random().toFixed(2)}`;

const createListener = (ctx) => ({});

const splitFile = (path, parts) => Array(parts).fill(path);

const renderVirtualDOM = (tree) => {
        return `<div id="${tree.id || 'root'}" class="${tree.class || ''}">${tree.content || ''}</div>`;
    };

const createChannelSplitter = (ctx, channels) => ({});

const deleteProgram = (program) => true;

const discoverPeersDHT = () => Array(5).fill().map(() => `10.0.0.${Math.floor(Math.random() * 255)}`);


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

const optimizeAST = (ast) => ast;

// Anti-shake references
const _ref_2kt5y5 = { analyzeBitrate };
const _ref_iy6dz1 = { calculateMD5 };
const _ref_by5e41 = { compressGzip };
const _ref_ehl7yo = { deleteTempFiles };
const _ref_9940eo = { renameFile };
const _ref_va4yp9 = { validatePieceChecksum };
const _ref_ytwwk9 = { autoResumeTask };
const _ref_rcct8t = { cleanOldLogs };
const _ref_6gk0co = { edgeDetectionSobel };
const _ref_naokdt = { cullFace };
const _ref_1fifzy = { injectCSPHeader };
const _ref_tg4oir = { shutdownComputer };
const _ref_act5nt = { enableBlend };
const _ref_b0rucc = { renderCanvasLayer };
const _ref_81qqdg = { restoreDatabase };
const _ref_kaiee0 = { VirtualFSTree };
const _ref_hqw4gd = { checkIntegrityConstraint };
const _ref_uh3pb4 = { rotateLogFiles };
const _ref_uvixg2 = { compactDatabase };
const _ref_ykki0j = { installUpdate };
const _ref_j25cw9 = { generateMipmaps };
const _ref_s57uzu = { interestPeer };
const _ref_69xxcd = { sanitizeSQLInput };
const _ref_h5i6jp = { parseTorrentFile };
const _ref_8aghjv = { shardingTable };
const _ref_5roxh0 = { setMTU };
const _ref_7e55s7 = { createOscillator };
const _ref_iyt0tw = { preventCSRF };
const _ref_2d34i1 = { createPeriodicWave };
const _ref_678vo6 = { rollbackTransaction };
const _ref_i5n5lh = { disablePEX };
const _ref_coikp1 = { eliminateDeadCode };
const _ref_u7wi11 = { parseClass };
const _ref_juzbpk = { connectSocket };
const _ref_v86cce = { reportWarning };
const _ref_pgr60x = { uploadCrashReport };
const _ref_hupow1 = { generateUserAgent };
const _ref_2ly9au = { joinGroup };
const _ref_6nco4b = { beginTransaction };
const _ref_k7ri4r = { analyzeQueryPlan };
const _ref_0e9jz8 = { allocateRegisters };
const _ref_360se2 = { optimizeTailCalls };
const _ref_jdtfcb = { verifyProofOfWork };
const _ref_brb5bn = { swapTokens };
const _ref_tp7fhv = { emitParticles };
const _ref_sovhub = { monitorNetworkInterface };
const _ref_pnifge = { setQValue };
const _ref_25ibl6 = { generateSourceMap };
const _ref_6xa7w3 = { deleteTexture };
const _ref_iny059 = { removeRigidBody };
const _ref_wamzbo = { calculateLayoutMetrics };
const _ref_b5xbxx = { removeConstraint };
const _ref_0xy9rh = { unrollLoops };
const _ref_x8mfo1 = { prioritizeRarestPiece };
const _ref_c5wnnc = { hoistVariables };
const _ref_snlneq = { negotiateProtocol };
const _ref_5un9uk = { normalizeVolume };
const _ref_qic090 = { createConvolver };
const _ref_nozcvj = { addSliderConstraint };
const _ref_sh57nn = { calculateSHA256 };
const _ref_7jheax = { drawElements };
const _ref_9xw1a6 = { syncAudioVideo };
const _ref_xy9zqm = { validateIPWhitelist };
const _ref_ebsy4o = { generateUUIDv5 };
const _ref_chpdwm = { listenSocket };
const _ref_nttj0k = { setFrequency };
const _ref_8ct096 = { fragmentPacket };
const _ref_chlnr5 = { serializeAST };
const _ref_ehjer2 = { remuxContainer };
const _ref_qhcqg3 = { decodeAudioData };
const _ref_74d8q0 = { createMediaStreamSource };
const _ref_ui5vvt = { initiateHandshake };
const _ref_eae1lz = { FileValidator };
const _ref_9yzsqy = { syncDatabase };
const _ref_6t3toz = { calculateCRC32 };
const _ref_ai4ck1 = { removeMetadata };
const _ref_gbgeb8 = { decryptHLSStream };
const _ref_p43i1y = { analyzeControlFlow };
const _ref_alfjuz = { getAngularVelocity };
const _ref_kq3rhh = { exitScope };
const _ref_ahgb8y = { getCpuLoad };
const _ref_p66oa3 = { retryFailedSegment };
const _ref_82ehu9 = { convexSweepTest };
const _ref_nxiwca = { compileToBytecode };
const _ref_qpl90q = { lockRow };
const _ref_tsy2ic = { postProcessBloom };
const _ref_b299yx = { decompressPacket };
const _ref_bspps0 = { unlockRow };
const _ref_y5db6w = { encryptPeerTraffic };
const _ref_d1ubs3 = { createChannelMerger };
const _ref_6g9h5c = { defineSymbol };
const _ref_js4n7r = { calculateMetric };
const _ref_zrh9ti = { addPoint2PointConstraint };
const _ref_ckvgeu = { setDetune };
const _ref_cxuy5m = { connectionPooling };
const _ref_3nf4it = { applyTorque };
const _ref_fklg2l = { triggerHapticFeedback };
const _ref_szu5r2 = { acceptConnection };
const _ref_6b9rx2 = { generateWalletKeys };
const _ref_5klusc = { unlockFile };
const _ref_qv9etb = { createDirectoryRecursive };
const _ref_3q8mq2 = { bindSocket };
const _ref_janw8t = { obfuscateCode };
const _ref_mormj5 = { computeDominators };
const _ref_rf6z6y = { cacheQueryResults };
const _ref_oqfpxq = { optimizeConnectionPool };
const _ref_sgv57d = { bindAddress };
const _ref_iv50am = { findLoops };
const _ref_fa8apo = { tunnelThroughProxy };
const _ref_sqsnf5 = { receivePacket };
const _ref_guenyy = { limitRate };
const _ref_umvrla = { generateDocumentation };
const _ref_malqmk = { setFilterType };
const _ref_6dr9q4 = { resolveDNS };
const _ref_4ls4fx = { addWheel };
const _ref_l84igq = { traverseAST };
const _ref_7t3je2 = { registerGestureHandler };
const _ref_9elfwu = { parseSubtitles };
const _ref_886x7q = { translateMatrix };
const _ref_skl722 = { muteStream };
const _ref_irabkr = { inferType };
const _ref_kqxv74 = { replicateData };
const _ref_qzvccc = { checkBatteryLevel };
const _ref_ugikll = { bufferData };
const _ref_ds7qxp = { createTCPSocket };
const _ref_a0xhzb = { pingHost };
const _ref_oa8ell = { hashKeccak256 };
const _ref_c11048 = { enterScope };
const _ref_nq5ilq = { setThreshold };
const _ref_50766c = { setEnv };
const _ref_w5iyvk = { calculateRestitution };
const _ref_3taw9r = { writePipe };
const _ref_2uvtde = { setPan };
const _ref_ps0415 = { checkTypes };
const _ref_vzczfd = { interpretBytecode };
const _ref_9qh3b8 = { unlinkFile };
const _ref_76lapg = { dhcpRequest };
const _ref_b2iydq = { calculatePieceHash };
const _ref_g20b3q = { parseStatement };
const _ref_57uqm0 = { rotateMatrix };
const _ref_lv6u0m = { renderParticles };
const _ref_mhrv3g = { parsePayload };
const _ref_q310co = { restartApplication };
const _ref_lbz6b8 = { isFeatureEnabled };
const _ref_rxceq0 = { logErrorToFile };
const _ref_3rubmg = { minifyCode };
const _ref_b4rxqo = { setRatio };
const _ref_9xdqer = { vertexAttribPointer };
const _ref_vn1cy2 = { anchorSoftBody };
const _ref_gsb43j = { createConstraint };
const _ref_p0c6ha = { normalizeAudio };
const _ref_edt580 = { createMediaElementSource };
const _ref_j1skb1 = { getAppConfig };
const _ref_gqaupw = { mangleNames };
const _ref_ulbk1o = { resolveDependencyGraph };
const _ref_v5oy8f = { dhcpOffer };
const _ref_13h2i4 = { updateWheelTransform };
const _ref_dbrzlv = { scrapeTracker };
const _ref_akfuii = { semaphoreWait };
const _ref_vod2w4 = { foldConstants };
const _ref_nuwlae = { mutexLock };
const _ref_csuwny = { enableInterrupts };
const _ref_9vwekj = { scheduleBandwidth };
const _ref_g6kxv1 = { createIndex };
const _ref_2uxivs = { updateRoutingTable };
const _ref_l29a5m = { allowSleepMode };
const _ref_l3mz7b = { readPipe };
const _ref_ichpym = { compressPacket };
const _ref_vg5jgl = { signTransaction };
const _ref_r0dl9w = { createSymbolTable };
const _ref_pz60ag = { wakeUp };
const _ref_rrmy5a = { getcwd };
const _ref_yo8y3x = { loadImpulseResponse };
const _ref_1jwnrk = { checkUpdate };
const _ref_x3bmep = { useProgram };
const _ref_ia7ytf = { setSocketTimeout };
const _ref_dp8xef = { spoofReferer };
const _ref_b9555d = { executeSQLQuery };
const _ref_pla9z0 = { dumpSymbolTable };
const _ref_ue5azt = { checkRootAccess };
const _ref_de9iz9 = { dropTable };
const _ref_1ya08h = { convertHSLtoRGB };
const _ref_9kjiuf = { getVehicleSpeed };
const _ref_obk1sz = { deobfuscateString };
const _ref_bhp5uy = { prettifyCode };
const _ref_gthyds = { statFile };
const _ref_5ggzzm = { requestPiece };
const _ref_c23g4t = { setGravity };
const _ref_dvqh3a = { execProcess };
const _ref_2eglm1 = { createDynamicsCompressor };
const _ref_9ahwds = { getEnv };
const _ref_68gllm = { rotateUserAgent };
const _ref_1i41ry = { createListener };
const _ref_wgo589 = { splitFile };
const _ref_mbaypa = { renderVirtualDOM };
const _ref_pfu82g = { createChannelSplitter };
const _ref_jyps3k = { deleteProgram };
const _ref_rtt6z1 = { discoverPeersDHT };
const _ref_gzs43g = { TelemetryClient };
const _ref_d9qlwh = { optimizeAST }; 
    });
})({}, {});