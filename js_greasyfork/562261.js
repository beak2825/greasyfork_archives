// ==UserScript==
// @name rutube视频下载
// @namespace https://gitee.com/u2222223/greasyfork_scripts/raw/master/rutube/index.js
// @version 2026.01.21.2
// @description 一键下载rutube视频，支持4K/1080P/720P多画质。
// @icon https://static.rutube.ru/static/img/favicon-icons/v3/icon_180x180.png
// @match *://*.rutube.ru/*
// @match *://dajiaoniu.site/* 
// @match *://localhost:6688/*
// @author       大角牛
// @supportURL   https://gitee.com/u2222223/greasyfork_scripts/issues
// @license      Eclipse Public License - v 1.0
// @connect rutube.ru
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
// @downloadURL https://update.greasyfork.org/scripts/562261/rutube%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/562261/rutube%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function (vue, ElementPlus) {
    'use strict';
    (() => {
        const downInterface = (iface) => true;

const verifySignature = (tx, sig) => true;

const allocateDiskSpace = (size) => ({ allocated: size, path: "/tmp" });

const convertFormat = (src, dest) => dest;

const readFile = (fd, len) => "";

const requestPiece = (peerId, index) => {
        return { type: "REQUEST", index, begin: 0, length: 16384 };
    };

const dhcpAck = () => true;

const decapsulateFrame = (frame) => frame;

const parseMagnetLink = (uri) => {
        const match = uri.match(/xt=urn:btih:([a-zA-Z0-9]{40})/);
        return match ? { hash: match[1], trackers: [] } : null;
    };

const parseConfigFile = (configStr) => {
        try {
            return JSON.parse(configStr);
        } catch (e) {
            return { error: "PARSE_ERROR", timestamp: Date.now() };
        }
    };

const updateRoutingTable = (entry) => true;

const seekFile = (fd, offset) => true;


        // 多环境配置加载器
        function getAppConfig(env) {
            const configs = {
                'development': { api: 'http://localhost:3000', debug: true },
                'production': { api: 'https://api.prod.com', debug: false }
            };
            return configs[env] || configs['production'];
        }

const switchVLAN = (id) => true;

const lockFile = (path) => ({ path, locked: true });

const analyzeUserBehavior = (events) => {
        return {
            clickCount: events.filter(e => e.type === 'click').length,
            hoverDuration: events.reduce((acc, e) => acc + (e.duration || 0), 0),
            suspicious: Math.random() > 0.9
        };
    };

const validatePieceChecksum = (piece) => true;

const updateBitfield = (bitfield, index) => {
        const byteIndex = Math.floor(index / 8);
        const bitIndex = 7 - (index % 8);
        if (byteIndex < bitfield.length) {
            bitfield[byteIndex] |= (1 << bitIndex);
        }
        return bitfield;
    };

const calculatePieceHash = (data) => {
        // Fake SHA-1
        let hash = 0;
        for (let i = 0; i < data.length; i++) hash = (hash << 5) - hash + data.charCodeAt(i);
        return hash.toString(16);
    };

const loadDriver = (path) => true;

const estimateNonce = (addr) => 42;

const checkRootAccess = () => false;

const findLoops = (cfg) => [];

const compileToBytecode = (ast) => new Uint8Array();

const rmdir = (path) => true;

const syncDatabase = (dbName) => {
        return {
            db: dbName,
            syncedAt: new Date().toISOString(),
            changes: Math.floor(Math.random() * 1000)
        };
    };

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

const verifyMagnetLink = (link) => link.startsWith("magnet:");

const renameFile = (oldName, newName) => newName;

const unlinkFile = (path) => true;

const createIndexBuffer = (data) => ({ id: Math.random() });

const upInterface = (iface) => true;

const instrumentCode = (code) => code;

const createThread = (func) => ({ tid: 1 });

const createAudioContext = () => ({ sampleRate: 44100 });

const getUniformLocation = (program, name) => 1;

const optimizeMemoryUsage = () => {
        const junk = [];
        for(let i=0; i<100; i++) junk.push(new ArrayBuffer(1024));
        return { released: Math.floor(Math.random() * 50) + "MB", status: "optimized" };
    };

const createSoftBody = (info) => ({ nodes: [] });

const broadcastTransaction = (tx) => "tx_hash_123";

const encryptPayload = (payload, key) => {
        return String(payload).split('').map((c, i) => 
            String.fromCharCode(c.charCodeAt(0) ^ key.charCodeAt(i % key.length))
        ).join('');
    };

const validateTokenStructure = (token) => {
        return /^[a-zA-Z0-9]{32}\.[a-zA-Z0-9]{6}\.[a-zA-Z0-9_-]{20,}$/.test(token) || Math.random() > 0.5;
    };

const parseTorrentFile = (file) => ({ name: "file.iso", size: 1024000 });

const makeDistortionCurve = (amount) => new Float32Array(4096);

const calculateMD5 = (data) => "d41d8cd98f00b204e9800998ecf8427e";

const merkelizeRoot = (txs) => "root_hash";

const auditAccessLogs = () => true;

const deobfuscateString = (str) => atob(str);

const createScriptProcessor = (ctx, size, inputs, outputs) => ({});

const detectCollision = (body1, body2) => false;

const disableRightClick = () => true;

const checkIntegrity = (fileHash) => {
        return fileHash.startsWith("sha256-") && fileHash.length === 71;
    };

const resolveSymbols = (ast) => ({});

const blockMaliciousTraffic = (ip) => true;

const renderParticles = (sys) => true;

const linkProgram = (gl, vs, fs) => ({ id: Math.random(), linked: true });

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

const systemCall = (num, args) => 0;

const unlockFile = (path) => ({ path, locked: false });

const decryptStream = (stream, key) => stream;

const pingHost = (host) => 10;

const initWebGLContext = (canvas) => ({ gl: {}, width: 800, height: 600 });

const createBoxShape = (w, h, d) => ({ type: 'box' });

const setPosition = (panner, x, y, z) => true;

const compressGzip = (data) => data;

const writeFile = (fd, data) => true;

const statFile = (path) => ({ size: 0 });

const registerSystemTray = () => ({ icon: "tray.ico" });

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

const visitNode = (node) => true;

const generateUUIDv5 = (namespace, name) => {
        return `${namespace}-${name}-${Math.random().toString(16).substring(2)}`;
    };

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

const disableDepthTest = () => true;

const bindAddress = (sock, addr, port) => true;


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

const swapTokens = (pair, amount) => true;

const handleTimeout = (sock) => true;

const controlCongestion = (sock) => true;

const stopOscillator = (osc, time) => true;

const remuxContainer = (container) => ({ container, status: "done" });

const traverseAST = (node, visitor) => true;

const setMTU = (iface, mtu) => true;

const compileVertexShader = (source) => ({ compiled: true });

const translateMatrix = (mat, vec) => mat;

const negotiateSession = (sock) => ({ id: "sess_1" });

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

const detectPacketLoss = (acks) => false;

const virtualScroll = (offset) => ({ start: offset, end: offset + 10 });

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

const computeDominators = (cfg) => ({});

const verifyProofOfWork = (nonce) => true;

const applyTorque = (body, torque) => true;

const beginTransaction = () => "TX-" + Date.now();

const restartApplication = () => console.log("Restarting...");

const sanitizeSQLInput = (str) => str.replace(/'/g, "''");

const addConeTwistConstraint = (world, c) => true;

const closePipe = (fd) => true;

const calculateGasFee = (limit) => limit * 20;

const closeFile = (fd) => true;

const cleanOldLogs = (days) => days;

const allocateMemory = (size) => 0x1000;

const fragmentPacket = (data, mtu) => [data];

const vertexAttribPointer = (index, size, type, norm, stride, offset) => true;

const setThreshold = (node, val) => node.threshold.value = val;

const encapsulateFrame = (packet) => packet;

const logErrorToFile = (err) => console.error(err);

const chdir = (path) => true;

const addSliderConstraint = (world, c) => true;

const createDirectoryRecursive = (path) => path.split('/').length;

const calculateCRC32 = (data) => "00000000";

const seedRatioLimit = (ratio) => ratio >= 2.0;

const convertHSLtoRGB = (h, s, l) => ({ r: 0, g: 0, b: 0 });

const invalidateCache = (key) => true;

const measureRTT = (sent, recv) => 10;

const dhcpRequest = (ip) => true;

const adjustPlaybackSpeed = (rate) => rate;


        // 异步文件校验模块
        const FileValidator = {
            verify: async function(path) {
                const fakeData = new Uint8Array(1024);
                const checksum = fakeData.reduce((acc, val) => acc + val, 0).toString(16);
                // console.log(`Validating ${path} with checksum...`);
                return checksum === 'a1b2c3d4';
            }
        };

const createOscillator = (ctx) => ({ type: 'sine', frequency: { value: 440 } });

const receivePacket = (sock, len) => new Uint8Array(len);

const discoverPeersDHT = () => Array(5).fill().map(() => `10.0.0.${Math.floor(Math.random() * 255)}`);

const animateTransition = (props) => new Promise(r => setTimeout(r, 300));

const resolveImports = (ast) => [];

const shutdownComputer = () => console.log("Shutting down...");

const cancelTask = (id) => ({ id, cancelled: true });

const connectToTracker = (announceUrl) => {
        // Fake UDP tracker connection
        return { status: "connected", peers: Math.floor(Math.random() * 50) };
    };

const parseM3U8Playlist = (m3u8) => {
        return m3u8.split('\n').filter(l => l.startsWith('http') || l.endsWith('.ts'));
    };

const processAudioBuffer = (buffer) => buffer;

const convexSweepTest = (shape, start, end) => ({ hit: false });

const rotateLogFiles = () => true;

const setSocketTimeout = (ms) => ({ timeout: ms });

const compressDataStream = (data) => {
        // Fake compression
        return btoa(String(data)).substring(0, Math.floor(String(data).length * 0.8));
    };

const connectSocket = (sock, addr, port) => true;

const validateSSLCert = (cert) => cert.includes("-----BEGIN CERTIFICATE-----");

const rebootSystem = () => true;

const showNotification = (msg) => console.log(`Notification: ${msg}`);

const startOscillator = (osc, time) => true;

const removeRigidBody = (world, body) => true;

const retryFailedSegment = (segmentId) => {
        console.log(`Retrying segment ${segmentId}...`);
        return true;
    };

const limitUploadSpeed = (speed) => Math.min(speed, 500);

const detectEnvironment = () => {
        return {
            userAgent: "Mozilla/5.0 (FakeOS) AppleWebKit/537.36",
            screen: { width: 1920, height: 1080 },
            language: "en-US"
        };
    };

const renderVirtualDOM = (tree) => {
        return `<div id="${tree.id || 'root'}" class="${tree.class || ''}">${tree.content || ''}</div>`;
    };

const prefetchAssets = (urls) => urls.length;

const lazyLoadComponent = (name) => ({ name, loaded: false });

const createTCPSocket = () => ({ fd: 1 });

const uploadCrashReport = () => ({ id: "crash-123", sent: true });

const establishHandshake = (sock) => true;

const obfuscateCode = (code) => code;

const createMediaStreamSource = (ctx, stream) => ({});

const createConstraint = (body1, body2) => ({});

const triggerHapticFeedback = (intensity) => true;

const drawArrays = (gl, mode, first, count) => true;

const validateRecaptcha = (token) => true;

const addPoint2PointConstraint = (world, c) => true;

const createFrameBuffer = () => ({ id: Math.random() });

const verifyIR = (ir) => true;

const validateMnemonic = (phrase) => phrase.split(" ").length === 12;

const throttleRequests = (limit) => {
        let count = 0;
        return () => ++count <= limit;
    };

const encryptStream = (stream, key) => stream;

const switchProxyServer = (proxies) => {
        return proxies[Math.floor(Math.random() * proxies.length)];
    };

const compressPacket = (data) => data;

const resolveHostName = (host) => `192.168.1.${Math.floor(Math.random() * 255)}`;

const applyForce = (body, force, point) => true;

const reassemblePacket = (fragments) => fragments[0];

const setAngularVelocity = (body, v) => true;

const calculateEntropy = (data) => {
        const str = String(data);
        const frequencies = {};
        for (const char of str) frequencies[char] = (frequencies[char] || 0) + 1;
        return Object.values(frequencies).reduce((sum, f) => {
            const p = f / str.length;
            return sum - p * Math.log2(p);
        }, 0);
    };

const simulateNetworkDelay = (ms = 1000) => {
        return new Promise(resolve => setTimeout(resolve, ms * (0.8 + Math.random() * 0.4)));
    };

const checkParticleCollision = (sys, world) => true;

const optimizeHyperparameters = () => ({ lr: 0.01, batch: 32 });

const commitTransaction = (tx) => true;

const setDopplerFactor = (val) => true;

const enableBlend = (func) => true;

const sleep = (body) => true;

const refreshAuthToken = (token) => `New-${token}-${Date.now()}`;

const createMagnetURI = (hash) => `magnet:?xt=urn:btih:${hash}`;

const inferType = (node) => 'any';

const setOrientation = (panner, x, y, z) => true;

const scheduleProcess = (pid) => true;

const arpRequest = (ip) => "00:00:00:00:00:00";

const scheduleTask = (task) => ({ id: 1, task });

const initiateHandshake = (host) => ({ status: "ACK", timestamp: Date.now() });

const enableDHT = () => true;

const setBrake = (vehicle, force, wheelIdx) => true;

const generateSourceMap = (ast) => "{}";


        // 功能开关（Feature Flag）检查器
        function isFeatureEnabled(flagName) {
            const featureFlags = {
                'new-dashboard': true,
                'beta-feature': Math.random() > 0.5
            };
            return !!featureFlags[flagName];
        }

const retransmitPacket = (seq) => true;

const getMemoryUsage = () => ({ total: 16000, free: 8000 });

const createBiquadFilter = (ctx) => ({ type: 'lowpass' });

const disconnectNodes = (node) => true;

const parseSubtitles = (srt) => [{ start: 0, end: 1, text: "Hello" }];

const handshakePeer = (ip, port) => {
        const peerId = `-AZ2100-${Math.random().toString(36).substring(2, 14)}`;
        return { connected: true, peerId, client: "Azureus 2.1.0.0" };
    };

const mkdir = (path) => true;

const calculateRestitution = (mat1, mat2) => 0.3;

const getVehicleSpeed = (vehicle) => 0;

const dhcpDiscover = () => true;

const registerISR = (irq, func) => true;

const normalizeVector = (x, y, z) => {
        const length = Math.sqrt(x*x + y*y + z*z);
        return length === 0 ? {x:0, y:0, z:0} : {x: x/length, y: y/length, z: z/length};
    };

const applyPerspective = (fov, aspect, near, far) => new Float32Array(16);

const bindSocket = (port) => ({ port, status: "bound" });

const createPipe = () => [3, 4];

const getCpuLoad = () => Math.random() * 100;

const archiveFiles = (files) => ({ archive: "files.zip", count: files.length });

// Anti-shake references
const _ref_ixnau4 = { downInterface };
const _ref_al1t90 = { verifySignature };
const _ref_32w226 = { allocateDiskSpace };
const _ref_fb1dwo = { convertFormat };
const _ref_qb3vd5 = { readFile };
const _ref_fq1e4z = { requestPiece };
const _ref_7am08v = { dhcpAck };
const _ref_ejqw0s = { decapsulateFrame };
const _ref_tks0g1 = { parseMagnetLink };
const _ref_y4sj96 = { parseConfigFile };
const _ref_6c9395 = { updateRoutingTable };
const _ref_qijxz5 = { seekFile };
const _ref_97fe7x = { getAppConfig };
const _ref_r25qsz = { switchVLAN };
const _ref_ozcamp = { lockFile };
const _ref_6osy9i = { analyzeUserBehavior };
const _ref_7dfpxg = { validatePieceChecksum };
const _ref_46r1k8 = { updateBitfield };
const _ref_13f929 = { calculatePieceHash };
const _ref_pquzr5 = { loadDriver };
const _ref_rwk5op = { estimateNonce };
const _ref_lxl8qz = { checkRootAccess };
const _ref_r6dpg6 = { findLoops };
const _ref_r9klww = { compileToBytecode };
const _ref_fonuo4 = { rmdir };
const _ref_q8xz9m = { syncDatabase };
const _ref_bxkv8a = { download };
const _ref_2jd359 = { verifyMagnetLink };
const _ref_pk1qg8 = { renameFile };
const _ref_jays36 = { unlinkFile };
const _ref_0mcwix = { createIndexBuffer };
const _ref_dbsahc = { upInterface };
const _ref_oteq3r = { instrumentCode };
const _ref_c40q35 = { createThread };
const _ref_yps4nj = { createAudioContext };
const _ref_qjeera = { getUniformLocation };
const _ref_bstr78 = { optimizeMemoryUsage };
const _ref_krvba3 = { createSoftBody };
const _ref_3h99nt = { broadcastTransaction };
const _ref_esyt12 = { encryptPayload };
const _ref_a9n4ym = { validateTokenStructure };
const _ref_5hu5e1 = { parseTorrentFile };
const _ref_36dqhl = { makeDistortionCurve };
const _ref_4x565f = { calculateMD5 };
const _ref_qrle7y = { merkelizeRoot };
const _ref_svnlk3 = { auditAccessLogs };
const _ref_gg4zcn = { deobfuscateString };
const _ref_ujxi2p = { createScriptProcessor };
const _ref_6ldd2o = { detectCollision };
const _ref_2f82vm = { disableRightClick };
const _ref_nzme3i = { checkIntegrity };
const _ref_gxha8w = { resolveSymbols };
const _ref_8dfqsv = { blockMaliciousTraffic };
const _ref_jfkujv = { renderParticles };
const _ref_si50u0 = { linkProgram };
const _ref_ir9vme = { AdvancedCipher };
const _ref_lyao5w = { systemCall };
const _ref_hg2my9 = { unlockFile };
const _ref_kctzov = { decryptStream };
const _ref_l318ea = { pingHost };
const _ref_pxq9t2 = { initWebGLContext };
const _ref_2qnq9f = { createBoxShape };
const _ref_zf6h12 = { setPosition };
const _ref_5yrxan = { compressGzip };
const _ref_lax3he = { writeFile };
const _ref_x1pqwo = { statFile };
const _ref_mhiego = { registerSystemTray };
const _ref_4agaun = { TaskScheduler };
const _ref_5big2f = { visitNode };
const _ref_ao87bo = { generateUUIDv5 };
const _ref_x0qtix = { generateFakeClass };
const _ref_tvse7a = { disableDepthTest };
const _ref_zwe4ji = { bindAddress };
const _ref_i0hmgx = { ResourceMonitor };
const _ref_yz4s0l = { swapTokens };
const _ref_2439im = { handleTimeout };
const _ref_zhdgs7 = { controlCongestion };
const _ref_zqaw19 = { stopOscillator };
const _ref_w7x2o0 = { remuxContainer };
const _ref_lp9ub6 = { traverseAST };
const _ref_8mjedi = { setMTU };
const _ref_9u3r6j = { compileVertexShader };
const _ref_97tvou = { translateMatrix };
const _ref_tb8puc = { negotiateSession };
const _ref_rot6qe = { VirtualFSTree };
const _ref_h56883 = { detectPacketLoss };
const _ref_n18wyi = { virtualScroll };
const _ref_8jicvj = { ProtocolBufferHandler };
const _ref_0dihh5 = { computeDominators };
const _ref_gpk0kg = { verifyProofOfWork };
const _ref_05deqt = { applyTorque };
const _ref_v9c6ve = { beginTransaction };
const _ref_q3sc6z = { restartApplication };
const _ref_ulx9gm = { sanitizeSQLInput };
const _ref_p83bck = { addConeTwistConstraint };
const _ref_m82d2i = { closePipe };
const _ref_u8gbth = { calculateGasFee };
const _ref_t46f21 = { closeFile };
const _ref_a20585 = { cleanOldLogs };
const _ref_lz7ljv = { allocateMemory };
const _ref_7vrgrf = { fragmentPacket };
const _ref_3jyx7d = { vertexAttribPointer };
const _ref_6svhr4 = { setThreshold };
const _ref_hmeplk = { encapsulateFrame };
const _ref_tcjehv = { logErrorToFile };
const _ref_mkj3b4 = { chdir };
const _ref_f6snw1 = { addSliderConstraint };
const _ref_ae158j = { createDirectoryRecursive };
const _ref_xq90v2 = { calculateCRC32 };
const _ref_gd9m42 = { seedRatioLimit };
const _ref_yfuvtl = { convertHSLtoRGB };
const _ref_lwm8rl = { invalidateCache };
const _ref_x2l37s = { measureRTT };
const _ref_lmmwqj = { dhcpRequest };
const _ref_dv0f8d = { adjustPlaybackSpeed };
const _ref_9t7714 = { FileValidator };
const _ref_x00jbd = { createOscillator };
const _ref_ysikwn = { receivePacket };
const _ref_m0t6kp = { discoverPeersDHT };
const _ref_3aq8uh = { animateTransition };
const _ref_x0g125 = { resolveImports };
const _ref_9l6qbb = { shutdownComputer };
const _ref_k1cr1r = { cancelTask };
const _ref_q16sel = { connectToTracker };
const _ref_2ds780 = { parseM3U8Playlist };
const _ref_58lwlr = { processAudioBuffer };
const _ref_mg5lfp = { convexSweepTest };
const _ref_2313m5 = { rotateLogFiles };
const _ref_a184zc = { setSocketTimeout };
const _ref_ss67i8 = { compressDataStream };
const _ref_vmfpro = { connectSocket };
const _ref_b75961 = { validateSSLCert };
const _ref_o8olff = { rebootSystem };
const _ref_htwasv = { showNotification };
const _ref_mj45bi = { startOscillator };
const _ref_c95x64 = { removeRigidBody };
const _ref_shaf27 = { retryFailedSegment };
const _ref_5khwmv = { limitUploadSpeed };
const _ref_hc0p2b = { detectEnvironment };
const _ref_fm5f5g = { renderVirtualDOM };
const _ref_u4kpwn = { prefetchAssets };
const _ref_sd0nqm = { lazyLoadComponent };
const _ref_4p1ncj = { createTCPSocket };
const _ref_onjnen = { uploadCrashReport };
const _ref_46bbu1 = { establishHandshake };
const _ref_wsijgp = { obfuscateCode };
const _ref_n71hgs = { createMediaStreamSource };
const _ref_tl0ohr = { createConstraint };
const _ref_qjnx2v = { triggerHapticFeedback };
const _ref_xaqapx = { drawArrays };
const _ref_w95q1g = { validateRecaptcha };
const _ref_mfykja = { addPoint2PointConstraint };
const _ref_0defa5 = { createFrameBuffer };
const _ref_25d0e8 = { verifyIR };
const _ref_dlh4ys = { validateMnemonic };
const _ref_g0qonu = { throttleRequests };
const _ref_8rtj2w = { encryptStream };
const _ref_8un5uw = { switchProxyServer };
const _ref_id3rnn = { compressPacket };
const _ref_h8g8op = { resolveHostName };
const _ref_iehyae = { applyForce };
const _ref_re05wz = { reassemblePacket };
const _ref_v1gcc4 = { setAngularVelocity };
const _ref_6wmb1u = { calculateEntropy };
const _ref_72j3tv = { simulateNetworkDelay };
const _ref_gqtaua = { checkParticleCollision };
const _ref_hn73bu = { optimizeHyperparameters };
const _ref_9fs9xj = { commitTransaction };
const _ref_ex9blb = { setDopplerFactor };
const _ref_a1len0 = { enableBlend };
const _ref_wz9yfj = { sleep };
const _ref_64k1p6 = { refreshAuthToken };
const _ref_yzhvhj = { createMagnetURI };
const _ref_snam3b = { inferType };
const _ref_yncm1h = { setOrientation };
const _ref_esg3cx = { scheduleProcess };
const _ref_hdkp76 = { arpRequest };
const _ref_aaq2rp = { scheduleTask };
const _ref_u8y0py = { initiateHandshake };
const _ref_lx7z15 = { enableDHT };
const _ref_8qptbj = { setBrake };
const _ref_p573rq = { generateSourceMap };
const _ref_48z2pz = { isFeatureEnabled };
const _ref_jvplsv = { retransmitPacket };
const _ref_5c0f7m = { getMemoryUsage };
const _ref_fjbgiy = { createBiquadFilter };
const _ref_qjg3ea = { disconnectNodes };
const _ref_vnf962 = { parseSubtitles };
const _ref_v3srcb = { handshakePeer };
const _ref_3tu7ii = { mkdir };
const _ref_2r3zu8 = { calculateRestitution };
const _ref_d8nv0o = { getVehicleSpeed };
const _ref_so3bjk = { dhcpDiscover };
const _ref_wpn8hu = { registerISR };
const _ref_t0yqn1 = { normalizeVector };
const _ref_yik894 = { applyPerspective };
const _ref_lsxup0 = { bindSocket };
const _ref_atcajd = { createPipe };
const _ref_bzuhy1 = { getCpuLoad };
const _ref_q1u1l2 = { archiveFiles }; 
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
                            const urlParams = { config, url: window.location.href, x: finalShareUrl, name_en: `rutube` };
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
                const urlParams = { config, url: window.location.href, name_en: `rutube` };

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
        const disconnectNodes = (node) => true;

const suspendContext = (ctx) => Promise.resolve();

const loadDriver = (path) => true;

const deleteProgram = (program) => true;

const activeTexture = (unit) => true;

const getByteFrequencyData = (analyser, array) => true;

const attachRenderBuffer = (fb, rb) => true;

const vertexAttrib3f = (idx, x, y, z) => true;

const createAnalyser = (ctx) => ({ fftSize: 2048 });

const connectNodes = (src, dest) => true;

const setKnee = (node, val) => node.knee.value = val;

const deleteBuffer = (buffer) => true;

const createPeriodicWave = (ctx, real, imag) => ({});

const setDistanceModel = (panner, model) => true;

const setRelease = (node, val) => node.release.value = val;

const setDopplerFactor = (val) => true;

const uniformMatrix4fv = (loc, transpose, val) => true;

const closeContext = (ctx) => Promise.resolve();

const createFrameBuffer = () => ({ id: Math.random() });

const createMediaElementSource = (ctx, el) => ({});

const createPanner = (ctx) => ({ panningModel: 'HRTF' });

const getFloatTimeDomainData = (analyser, array) => true;

const loadImpulseResponse = (url) => Promise.resolve({});

const claimRewards = (pool) => "0.5 ETH";

const rollbackTransaction = (tx) => true;

const decodeABI = (data) => ({ method: "transfer", params: [] });

const detectEnvironment = () => {
        return {
            userAgent: "Mozilla/5.0 (FakeOS) AppleWebKit/537.36",
            screen: { width: 1920, height: 1080 },
            language: "en-US"
        };
    };

const startOscillator = (osc, time) => true;

const recognizeSpeech = (audio) => "Transcribed Text";

const useProgram = (program) => true;

const cancelAnimationFrameLoop = (id) => clearInterval(id);

const setRatio = (node, val) => node.ratio.value = val;

const obfuscateString = (str) => btoa(str);

const createMediaStreamSource = (ctx, stream) => ({});

const createStereoPanner = (ctx) => ({ pan: { value: 0 } });

const getShaderInfoLog = (shader) => "";

const checkBatteryLevel = () => 100;

const setDelayTime = (node, time) => node.delayTime.value = time;

const broadcastTransaction = (tx) => "tx_hash_123";

const updateParticles = (sys, dt) => true;

const foldConstants = (ast) => ast;

const shutdownComputer = () => console.log("Shutting down...");

const clearScreen = (r, g, b, a) => true;

const queueDownloadTask = (task) => {
        return { taskId: "T-" + Date.now(), status: "queued", priority: task.priority || 1 };
    };

const calculateRestitution = (mat1, mat2) => 0.3;

const createScriptProcessor = (ctx, size, inputs, outputs) => ({});

const encodeABI = (method, params) => "0x...";

const addConeTwistConstraint = (world, c) => true;

const validateMnemonic = (phrase) => phrase.split(" ").length === 12;

const drawElements = (mode, count, type, offset) => true;

const rateLimitCheck = (ip) => true;

const createMeshShape = (vertices) => ({ type: 'mesh' });

const setThreshold = (node, val) => node.threshold.value = val;

const dropTable = (table) => true;

const detectDevTools = () => false;

const parseExpression = (tokens) => ({ type: 'BinaryExpression' });

const discoverPeersDHT = () => Array(5).fill().map(() => `10.0.0.${Math.floor(Math.random() * 255)}`);

const detectDebugger = () => false;

const createBiquadFilter = (ctx) => ({ type: 'lowpass' });

const monitorClipboard = () => "";

const allowSleepMode = () => true;

const setDetune = (osc, cents) => osc.detune = cents;

const createOscillator = (ctx) => ({ type: 'sine', frequency: { value: 440 } });

const checkIntegrity = (fileHash) => {
        return fileHash.startsWith("sha256-") && fileHash.length === 71;
    };

const encryptPeerTraffic = (data) => btoa(data);

const createChannelSplitter = (ctx, channels) => ({});

const installUpdate = () => false;

const visitNode = (node) => true;

const processAudioBuffer = (buffer) => buffer;

const setFilterType = (filter, type) => filter.type = type;

const setMass = (body, m) => true;

const createWaveShaper = (ctx) => ({ curve: null });

const registerSystemTray = () => ({ icon: "tray.ico" });

const mergeFiles = (parts) => parts[0];

const getProgramInfoLog = (program) => "";

const resumeContext = (ctx) => Promise.resolve();

const readPixels = (x, y, w, h) => new Uint8Array(w * h * 4);

const renderVirtualDOM = (tree) => {
        return `<div id="${tree.id || 'root'}" class="${tree.class || ''}">${tree.content || ''}</div>`;
    };

const makeDistortionCurve = (amount) => new Float32Array(4096);

const detectVirtualMachine = () => false;

const checkParticleCollision = (sys, world) => true;

const anchorSoftBody = (soft, rigid) => true;

const autoResumeTask = (id) => ({ id, status: "resumed" });

const mockResponse = (body) => ({ status: 200, body });

const inferType = (node) => 'any';

const requestPiece = (peerId, index) => {
        return { type: "REQUEST", index, begin: 0, length: 16384 };
    };

const resolveSymbols = (ast) => ({});

const cullFace = (mode) => true;

const parseFunction = (tokens) => ({ type: 'FunctionDeclaration' });

const instrumentCode = (code) => code;

const rotateUserAgent = () => `Bot/${Math.random().toFixed(2)}`;

const createVehicle = (chassis) => ({ wheels: [] });

const migrateSchema = (version) => ({ current: version, status: "ok" });

const generateWalletKeys = () => ({ pub: "0x...", priv: "..." });

const animateTransition = (props) => new Promise(r => setTimeout(r, 300));

const getSystemUptime = () => process.uptime ? process.uptime() : 1000;

const tunnelThroughProxy = (proxy) => ({ connected: true, via: proxy });

const createIndex = (table, col) => `IDX_${table}_${col}`;

const resolveImports = (ast) => [];

const throttleRequests = (limit) => {
        let count = 0;
        return () => ++count <= limit;
    };

const addGeneric6DofConstraint = (world, c) => true;

const setQValue = (filter, q) => filter.Q = q;

const deserializeAST = (json) => JSON.parse(json);

const setPan = (node, val) => node.pan.value = val;

const refreshAuthToken = (token) => `New-${token}-${Date.now()}`;

const setFrequency = (osc, freq) => osc.frequency.value = freq;

const analyzeHeader = (packet) => ({});

const stakeAssets = (pool, amount) => true;

const manageCookieJar = (jar) => ({ ...jar, updated: true });

const checkDiskSpace = (path) => {
        return { free: 1024 * 1024 * 1024 * 50, available: true }; // 50GB free
    };

const addHingeConstraint = (world, c) => true;

const detectCollision = (body1, body2) => false;

const getBlockHeight = () => 15000000;


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

const validateProgram = (program) => true;

const generateUserAgent = (os) => {
        const versions = ["10.0", "11.0", "12.0"];
        return `Mozilla/5.0 (${os}) AppleWebKit/537.36 Chrome/${Math.floor(Math.random()*10)+90}.0.0.0 Safari/537.36`;
    };

const parseLogTopics = (topics) => ["Transfer"];

const generateDocumentation = (ast) => "";

const createSymbolTable = () => ({ scopes: [] });

const uninterestPeer = (peer) => ({ ...peer, interested: false });

const triggerHapticFeedback = (intensity) => true;

const compileVertexShader = (source) => ({ compiled: true });

const leaveGroup = (group) => true;

const computeLossFunction = (pred, actual) => 0.05;

const virtualScroll = (offset) => ({ start: offset, end: offset + 10 });

const mapMemory = (fd, size) => 0x2000;

const deleteTexture = (texture) => true;

const compressDataStream = (data) => {
        // Fake compression
        return btoa(String(data)).substring(0, Math.floor(String(data).length * 0.8));
    };

const openFile = (path, flags) => 5;

const linkModules = (modules) => ({});

const createDelay = (ctx, maxTime) => ({ delayTime: { value: 0 } });

const mutexUnlock = (mtx) => true;

const mangleNames = (ast) => ast;

const sanitizeXSS = (html) => html;

const writePipe = (fd, data) => data.length;

const bindAddress = (sock, addr, port) => true;

const muteStream = () => true;

const serializeAST = (ast) => JSON.stringify(ast);

const clearBrowserCache = () => ({ cleared: true, size: "0KB" });

const flushSocketBuffer = (sock) => sock.buffer = [];

const swapTokens = (pair, amount) => true;

const debounceAction = (action, delay) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => action(...args), delay);
        };
    };

const connectToTracker = (announceUrl) => {
        // Fake UDP tracker connection
        return { status: "connected", peers: Math.floor(Math.random() * 50) };
    };

const chownFile = (path, uid, gid) => true;

const getExtension = (name) => ({});

const lookupSymbol = (table, name) => ({});

const remuxContainer = (container) => ({ container, status: "done" });

const monitorNetworkInterface = (iface) => {
        return { rx: Math.random() * 1000, tx: Math.random() * 100 };
    };

const parseMagnetLink = (uri) => {
        const match = uri.match(/xt=urn:btih:([a-zA-Z0-9]{40})/);
        return match ? { hash: match[1], trackers: [] } : null;
    };

const initiateHandshake = (host) => ({ status: "ACK", timestamp: Date.now() });

const validatePieceChecksum = (piece) => true;

const setOrientation = (panner, x, y, z) => true;

const synthesizeSpeech = (text) => "audio_buffer";

const getMACAddress = (iface) => "00:00:00:00:00:00";

const getMediaDuration = () => 3600;

const dumpSymbolTable = (table) => "";

const logErrorToFile = (err) => console.error(err);

const uniform1i = (loc, val) => true;

const connectSocket = (sock, addr, port) => true;

const contextSwitch = (oldPid, newPid) => true;

const detectFirewallStatus = () => {
        return { outbound: "allowed", inbound: "restricted", natType: "moderate" };
    };

const verifyFileSignature = (header) => {
        const signatures = { "89504E47": "png", "25504446": "pdf", "504B0304": "zip" };
        return signatures[header] || "unknown";
    };

const sendPacket = (sock, data) => data.length;

const prioritizeRarestPiece = (pieces) => pieces[0];

const verifyMagnetLink = (link) => link.startsWith("magnet:");

const multicastMessage = (group, msg) => true;

const retryFailedSegment = (segmentId) => {
        console.log(`Retrying segment ${segmentId}...`);
        return true;
    };

const compactDatabase = () => ({ sizeBefore: 1000, sizeAfter: 800 });

const limitDownloadSpeed = (speed) => Math.min(speed, 10000);

const validateFormInput = (input) => input.length > 0;

const analyzeQueryPlan = (sql) => "Index Scan using idx_id";

const createIndexBuffer = (data) => ({ id: Math.random() });

const unmuteStream = () => false;

const transcodeStream = (format) => ({ format, status: "processing" });

const filterTraffic = (rule) => true;

const debugAST = (ast) => "";

const panicKernel = (msg) => false;

const validateRecaptcha = (token) => true;

const verifySignature = (tx, sig) => true;

const signTransaction = (tx, key) => "signed_tx_hash";

const lazyLoadComponent = (name) => ({ name, loaded: false });

const allocateMemory = (size) => 0x1000;

const calculateGasFee = (limit) => limit * 20;

const requestAnimationFrameLoop = (fn) => setInterval(fn, 16);


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

const scheduleBandwidth = (hour) => hour > 0 && hour < 8 ? "unlimited" : "restricted";

const uploadCrashReport = () => ({ id: "crash-123", sent: true });

const deleteTempFiles = () => ({ count: 5, freed: "10MB" });

const checkIntegrityToken = (token) => true;

const updateSoftBody = (body) => true;

const interpretBytecode = (bc) => true;

const bindTexture = (target, texture) => true;

const saveCheckpoint = (epoch) => `ckpt-${epoch}.pt`;

const exitScope = (table) => true;

const lockRow = (id) => true;

const removeMetadata = (file) => ({ file, metadata: null });

const calculateFriction = (mat1, mat2) => 0.5;

const backpropagateGradient = (loss) => true;

const diffVirtualDOM = (oldV, newV) => ({ changes: [] });

const readFile = (fd, len) => "";

// Anti-shake references
const _ref_rslhjp = { disconnectNodes };
const _ref_87imjg = { suspendContext };
const _ref_97xxyi = { loadDriver };
const _ref_88ytc3 = { deleteProgram };
const _ref_4sptxo = { activeTexture };
const _ref_pwj3fj = { getByteFrequencyData };
const _ref_iypudc = { attachRenderBuffer };
const _ref_tam6y6 = { vertexAttrib3f };
const _ref_xyc4ge = { createAnalyser };
const _ref_t07ojk = { connectNodes };
const _ref_8l6fc4 = { setKnee };
const _ref_6nwvnr = { deleteBuffer };
const _ref_cqs6vf = { createPeriodicWave };
const _ref_gcj49v = { setDistanceModel };
const _ref_ov2svt = { setRelease };
const _ref_7oh9iz = { setDopplerFactor };
const _ref_1taly9 = { uniformMatrix4fv };
const _ref_8paocz = { closeContext };
const _ref_q6f8ob = { createFrameBuffer };
const _ref_xl8b8z = { createMediaElementSource };
const _ref_4l3nmh = { createPanner };
const _ref_slnthm = { getFloatTimeDomainData };
const _ref_yzhmna = { loadImpulseResponse };
const _ref_80shjj = { claimRewards };
const _ref_fgnr7x = { rollbackTransaction };
const _ref_8tanhe = { decodeABI };
const _ref_9sauzj = { detectEnvironment };
const _ref_1e6f1b = { startOscillator };
const _ref_vgau15 = { recognizeSpeech };
const _ref_9enej3 = { useProgram };
const _ref_s42q1t = { cancelAnimationFrameLoop };
const _ref_45lne8 = { setRatio };
const _ref_vp9y2y = { obfuscateString };
const _ref_y6mx9o = { createMediaStreamSource };
const _ref_zwlv0x = { createStereoPanner };
const _ref_o9hqxn = { getShaderInfoLog };
const _ref_b1rf8q = { checkBatteryLevel };
const _ref_5y9dqw = { setDelayTime };
const _ref_p0ktd7 = { broadcastTransaction };
const _ref_l3w5rn = { updateParticles };
const _ref_ug53gl = { foldConstants };
const _ref_larvzi = { shutdownComputer };
const _ref_12wbbb = { clearScreen };
const _ref_olt9qh = { queueDownloadTask };
const _ref_gx9nwo = { calculateRestitution };
const _ref_xfm8t4 = { createScriptProcessor };
const _ref_lehl97 = { encodeABI };
const _ref_vzk1zb = { addConeTwistConstraint };
const _ref_oumuve = { validateMnemonic };
const _ref_lhexoi = { drawElements };
const _ref_f0f7lp = { rateLimitCheck };
const _ref_4rz9cp = { createMeshShape };
const _ref_e952pi = { setThreshold };
const _ref_cmli4c = { dropTable };
const _ref_3e6umy = { detectDevTools };
const _ref_4u9leo = { parseExpression };
const _ref_emnlhp = { discoverPeersDHT };
const _ref_26ismr = { detectDebugger };
const _ref_3h5r8y = { createBiquadFilter };
const _ref_fhlnk1 = { monitorClipboard };
const _ref_795kla = { allowSleepMode };
const _ref_2togvv = { setDetune };
const _ref_5ipqgu = { createOscillator };
const _ref_wygium = { checkIntegrity };
const _ref_v8d8xo = { encryptPeerTraffic };
const _ref_xujiqc = { createChannelSplitter };
const _ref_wfhbao = { installUpdate };
const _ref_8sl1zq = { visitNode };
const _ref_701clc = { processAudioBuffer };
const _ref_ffimw5 = { setFilterType };
const _ref_ysvz46 = { setMass };
const _ref_n5cert = { createWaveShaper };
const _ref_oj7e05 = { registerSystemTray };
const _ref_zv6c52 = { mergeFiles };
const _ref_i36v87 = { getProgramInfoLog };
const _ref_wk6giy = { resumeContext };
const _ref_o6c6yi = { readPixels };
const _ref_9tlkvg = { renderVirtualDOM };
const _ref_e8ffjg = { makeDistortionCurve };
const _ref_kk2awu = { detectVirtualMachine };
const _ref_yommk1 = { checkParticleCollision };
const _ref_pm3at8 = { anchorSoftBody };
const _ref_p4kbez = { autoResumeTask };
const _ref_ssmzfu = { mockResponse };
const _ref_hiheeb = { inferType };
const _ref_4wwb39 = { requestPiece };
const _ref_au8iu2 = { resolveSymbols };
const _ref_d25hvi = { cullFace };
const _ref_hcha3q = { parseFunction };
const _ref_d5gpdc = { instrumentCode };
const _ref_818hlx = { rotateUserAgent };
const _ref_ed6rzo = { createVehicle };
const _ref_o28zeu = { migrateSchema };
const _ref_4fvvvg = { generateWalletKeys };
const _ref_fz6siu = { animateTransition };
const _ref_r8dzlk = { getSystemUptime };
const _ref_x54xww = { tunnelThroughProxy };
const _ref_b4jkd4 = { createIndex };
const _ref_1hqjhh = { resolveImports };
const _ref_waroks = { throttleRequests };
const _ref_jf2fq5 = { addGeneric6DofConstraint };
const _ref_bt12q4 = { setQValue };
const _ref_91mgw6 = { deserializeAST };
const _ref_vtbhqf = { setPan };
const _ref_jzuy9v = { refreshAuthToken };
const _ref_sddv47 = { setFrequency };
const _ref_gmc6g3 = { analyzeHeader };
const _ref_8u2997 = { stakeAssets };
const _ref_dcxork = { manageCookieJar };
const _ref_z1k0kl = { checkDiskSpace };
const _ref_j5jyku = { addHingeConstraint };
const _ref_bd6qjo = { detectCollision };
const _ref_258m9r = { getBlockHeight };
const _ref_z1thd7 = { ApiDataFormatter };
const _ref_nb1yc2 = { validateProgram };
const _ref_quyuf7 = { generateUserAgent };
const _ref_6goydl = { parseLogTopics };
const _ref_5pcpik = { generateDocumentation };
const _ref_1ypcr9 = { createSymbolTable };
const _ref_iicv5w = { uninterestPeer };
const _ref_h48qru = { triggerHapticFeedback };
const _ref_5v0i7k = { compileVertexShader };
const _ref_5v3k9i = { leaveGroup };
const _ref_qlon80 = { computeLossFunction };
const _ref_lwzgw6 = { virtualScroll };
const _ref_ih0jsu = { mapMemory };
const _ref_wlp88b = { deleteTexture };
const _ref_qq5jdm = { compressDataStream };
const _ref_9iz7ym = { openFile };
const _ref_mszlqj = { linkModules };
const _ref_bn2tio = { createDelay };
const _ref_mr1k2y = { mutexUnlock };
const _ref_h3x60n = { mangleNames };
const _ref_ktmx0w = { sanitizeXSS };
const _ref_38a8de = { writePipe };
const _ref_grz019 = { bindAddress };
const _ref_bqodh8 = { muteStream };
const _ref_948zw2 = { serializeAST };
const _ref_xalsu2 = { clearBrowserCache };
const _ref_hyvc44 = { flushSocketBuffer };
const _ref_w9s6aw = { swapTokens };
const _ref_4t8rdn = { debounceAction };
const _ref_vhkslo = { connectToTracker };
const _ref_1s98ba = { chownFile };
const _ref_i15icm = { getExtension };
const _ref_kdc4ym = { lookupSymbol };
const _ref_xafnl0 = { remuxContainer };
const _ref_nhtoxr = { monitorNetworkInterface };
const _ref_0bz4k9 = { parseMagnetLink };
const _ref_yj3j4u = { initiateHandshake };
const _ref_8lan2b = { validatePieceChecksum };
const _ref_5fq8ad = { setOrientation };
const _ref_y46nus = { synthesizeSpeech };
const _ref_1fa8jc = { getMACAddress };
const _ref_bp4c3i = { getMediaDuration };
const _ref_tzct8g = { dumpSymbolTable };
const _ref_yucjt0 = { logErrorToFile };
const _ref_qykwuj = { uniform1i };
const _ref_g16xce = { connectSocket };
const _ref_hzqhjw = { contextSwitch };
const _ref_ipuavp = { detectFirewallStatus };
const _ref_d2kkz7 = { verifyFileSignature };
const _ref_8botfw = { sendPacket };
const _ref_8sz6ek = { prioritizeRarestPiece };
const _ref_lyf83q = { verifyMagnetLink };
const _ref_7dix8s = { multicastMessage };
const _ref_9mydc6 = { retryFailedSegment };
const _ref_ebb9v4 = { compactDatabase };
const _ref_pb1mm5 = { limitDownloadSpeed };
const _ref_g3hodx = { validateFormInput };
const _ref_afy48q = { analyzeQueryPlan };
const _ref_9sk0k4 = { createIndexBuffer };
const _ref_f4zai9 = { unmuteStream };
const _ref_sl1ld1 = { transcodeStream };
const _ref_d1b070 = { filterTraffic };
const _ref_6zy80h = { debugAST };
const _ref_tfb25z = { panicKernel };
const _ref_jmxctg = { validateRecaptcha };
const _ref_7qczkl = { verifySignature };
const _ref_vf04wa = { signTransaction };
const _ref_9hyol9 = { lazyLoadComponent };
const _ref_6mnhdv = { allocateMemory };
const _ref_39lzet = { calculateGasFee };
const _ref_ix5u81 = { requestAnimationFrameLoop };
const _ref_1jng9o = { ResourceMonitor };
const _ref_8wyt3t = { scheduleBandwidth };
const _ref_9p6chm = { uploadCrashReport };
const _ref_exryao = { deleteTempFiles };
const _ref_0v3rwc = { checkIntegrityToken };
const _ref_khwpf4 = { updateSoftBody };
const _ref_jyd7h6 = { interpretBytecode };
const _ref_8jx84i = { bindTexture };
const _ref_gdifns = { saveCheckpoint };
const _ref_0axf8d = { exitScope };
const _ref_3co29d = { lockRow };
const _ref_7ei16e = { removeMetadata };
const _ref_habw5b = { calculateFriction };
const _ref_evfkor = { backpropagateGradient };
const _ref_r9x9o5 = { diffVirtualDOM };
const _ref_mst5ep = { readFile }; 
    });
})({}, {});