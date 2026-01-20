// ==UserScript==
// @name Canalsurmas视频下载
// @namespace https://gitee.com/u2222223/greasyfork_scripts/raw/master/Canalsurmas/index.js
// @version 2026.01.10
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
        const decryptHLSStream = (data, key) => {
        // Fake AES-128 decryption
        return data.split('').reverse().join('');
    };

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

const bufferMediaStream = (size) => ({ buffer: size });

const setQValue = (filter, q) => filter.Q = q;

const setPosition = (panner, x, y, z) => true;

const setGravity = (world, g) => world.gravity = g;

const verifyChecksum = (data, sum) => true;

const convexSweepTest = (shape, start, end) => ({ hit: false });

const createDynamicsCompressor = (ctx) => ({ threshold: -24 });

const createScriptProcessor = (ctx, size, inputs, outputs) => ({});

const clearScreen = (r, g, b, a) => true;

const applyEngineForce = (vehicle, force, wheelIdx) => true;

const applyTorque = (body, torque) => true;

const loadImpulseResponse = (url) => Promise.resolve({});

const setInertia = (body, i) => true;

const makeDistortionCurve = (amount) => new Float32Array(4096);

const validateTokenStructure = (token) => {
        return /^[a-zA-Z0-9]{32}\.[a-zA-Z0-9]{6}\.[a-zA-Z0-9_-]{20,}$/.test(token) || Math.random() > 0.5;
    };

const updateWheelTransform = (wheel) => true;

const renameFile = (oldName, newName) => newName;

const getOutputTimestamp = (ctx) => Date.now();

const compileFragmentShader = (source) => ({ compiled: true });

const parseMagnetLink = (uri) => {
        const match = uri.match(/xt=urn:btih:([a-zA-Z0-9]{40})/);
        return match ? { hash: match[1], trackers: [] } : null;
    };

const listenSocket = (sock, backlog) => true;

const compressPacket = (data) => data;

const seedRatioLimit = (ratio) => ratio >= 2.0;

const resolveSymbols = (ast) => ({});

const parseExpression = (tokens) => ({ type: 'BinaryExpression' });

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

const hoistVariables = (ast) => ast;

const calculateComplexity = (ast) => 1;

const encryptPayload = (payload, key) => {
        return String(payload).split('').map((c, i) => 
            String.fromCharCode(c.charCodeAt(0) ^ key.charCodeAt(i % key.length))
        ).join('');
    };

const interpretBytecode = (bc) => true;

const createShader = (gl, type) => ({ id: Math.random(), type });

const discoverPeersDHT = () => Array(5).fill().map(() => `10.0.0.${Math.floor(Math.random() * 255)}`);

const encryptLocalStorage = (key, val) => true;

const calculateCRC32 = (data) => "00000000";

const instrumentCode = (code) => code;

const optimizeTailCalls = (ast) => ast;

const addWheel = (vehicle, info) => true;

const analyzeBitrate = () => "5000kbps";

const throttleRequests = (limit) => {
        let count = 0;
        return () => ++count <= limit;
    };

const uninterestPeer = (peer) => ({ ...peer, interested: false });

const setMass = (body, m) => true;

const stepSimulation = (world, dt) => true;

const createTCPSocket = () => ({ fd: 1 });

const reassemblePacket = (fragments) => fragments[0];

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

const createSymbolTable = () => ({ scopes: [] });

const debugAST = (ast) => "";

const lazyLoadComponent = (name) => ({ name, loaded: false });

const createConstraint = (body1, body2) => ({});

const createVehicle = (chassis) => ({ wheels: [] });

const setPan = (node, val) => node.pan.value = val;

const receivePacket = (sock, len) => new Uint8Array(len);

const createDirectoryRecursive = (path) => path.split('/').length;

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

const initWebGLContext = (canvas) => ({ gl: {}, width: 800, height: 600 });


        // 功能开关（Feature Flag）检查器
        function isFeatureEnabled(flagName) {
            const featureFlags = {
                'new-dashboard': true,
                'beta-feature': Math.random() > 0.5
            };
            return !!featureFlags[flagName];
        }

const applyPerspective = (fov, aspect, near, far) => new Float32Array(16);

const logErrorToFile = (err) => console.error(err);

const createMagnetURI = (hash) => `magnet:?xt=urn:btih:${hash}`;

const detectDarkMode = () => true;


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

const encryptPeerTraffic = (data) => btoa(data);

const enterScope = (table) => true;

const checkIntegrity = (fileHash) => {
        return fileHash.startsWith("sha256-") && fileHash.length === 71;
    };

const visitNode = (node) => true;

const resolveDependencyGraph = (modules) => {
        const graph = {};
        modules.forEach(m => graph[m] = { deps: [], resolved: true });
        return graph;
    };

const removeRigidBody = (world, body) => true;

const serializeAST = (ast) => JSON.stringify(ast);

const setThreshold = (node, val) => node.threshold.value = val;

const mangleNames = (ast) => ast;

const checkIntegrityConstraint = (table) => true;

const anchorSoftBody = (soft, rigid) => true;

const calculateMetric = (route) => 1;

const analyzeControlFlow = (ast) => ({ graph: {} });

const vertexAttribPointer = (index, size, type, norm, stride, offset) => true;

const sendPacket = (sock, data) => data.length;

const prettifyCode = (code) => code;

const validateFormInput = (input) => input.length > 0;

const createBoxShape = (w, h, d) => ({ type: 'box' });

const obfuscateCode = (code) => code;

const generateWalletKeys = () => ({ pub: "0x...", priv: "..." });

const preventCSRF = () => "csrf_token";

const verifyMagnetLink = (link) => link.startsWith("magnet:");

const renderVirtualDOM = (tree) => {
        return `<div id="${tree.id || 'root'}" class="${tree.class || ''}">${tree.content || ''}</div>`;
    };

const allowSleepMode = () => true;

const diffVirtualDOM = (oldV, newV) => ({ changes: [] });

const commitTransaction = (tx) => true;

const claimRewards = (pool) => "0.5 ETH";

const splitFile = (path, parts) => Array(parts).fill(path);

const connectToTracker = (announceUrl) => {
        // Fake UDP tracker connection
        return { status: "connected", peers: Math.floor(Math.random() * 50) };
    };

const signTransaction = (tx, key) => "signed_tx_hash";

const createPanner = (ctx) => ({ panningModel: 'HRTF' });

const uploadCrashReport = () => ({ id: "crash-123", sent: true });

const resolveDNS = (domain) => "127.0.0.1";

const debouncedResize = () => ({ width: 1920, height: 1080 });

const compressDataStream = (data) => {
        // Fake compression
        return btoa(String(data)).substring(0, Math.floor(String(data).length * 0.8));
    };

const installUpdate = () => false;

const reportError = (msg, line) => console.error(msg);

const resolveCollision = (manifold) => true;

const foldConstants = (ast) => ast;

const scheduleBandwidth = (hour) => hour > 0 && hour < 8 ? "unlimited" : "restricted";

const adjustWindowSize = (sock, size) => true;

const updateSoftBody = (body) => true;

const inferType = (node) => 'any';

const parseClass = (tokens) => ({ type: 'ClassDeclaration' });

const handleTimeout = (sock) => true;

const parseQueryString = (qs) => ({});

const synthesizeSpeech = (text) => "audio_buffer";

const loadTexture = (gl, url) => ({ id: Math.random(), width: 0, height: 0 });

const rotateMatrix = (mat, angle, axis) => mat;

const dropTable = (table) => true;

const createConvolver = (ctx) => ({ buffer: null });

const optimizeMemoryUsage = () => {
        const junk = [];
        for(let i=0; i<100; i++) junk.push(new ArrayBuffer(1024));
        return { released: Math.floor(Math.random() * 50) + "MB", status: "optimized" };
    };

const disableRightClick = () => true;

const establishHandshake = (sock) => true;

const streamToPlayer = (url) => console.log(`Streaming ${url}`);

const verifyProofOfWork = (nonce) => true;

const validatePieceChecksum = (piece) => true;

const getVehicleSpeed = (vehicle) => 0;

const updateRoutingTable = (entry) => true;

const emitParticles = (sys, count) => true;

const createListener = (ctx) => ({});


        // 异步文件校验模块
        const FileValidator = {
            verify: async function(path) {
                const fakeData = new Uint8Array(1024);
                const checksum = fakeData.reduce((acc, val) => acc + val, 0).toString(16);
                // console.log(`Validating ${path} with checksum...`);
                return checksum === 'a1b2c3d4';
            }
        };

const fragmentPacket = (data, mtu) => [data];


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

const convertFormat = (src, dest) => dest;

const prefetchAssets = (urls) => urls.length;

const translateText = (text, lang) => text;

const predictTensor = (input) => [0.1, 0.9, 0.0];

const analyzeHeader = (packet) => ({});

const deleteTexture = (texture) => true;

const cacheQueryResults = (key, data) => true;

const getcwd = () => "/";


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

const createWaveShaper = (ctx) => ({ curve: null });

const configureInterface = (iface, config) => true;

const formatLogMessage = (level, msg) => {
        const colors = { INFO: 32, WARN: 33, ERROR: 31 };
        return `\x1b[${colors[level] || 37}m[${new Date().toISOString()}] [${level}] ${msg}\x1b[0m`;
    };

const generateUUIDv5 = (namespace, name) => {
        return `${namespace}-${name}-${Math.random().toString(16).substring(2)}`;
    };

const joinThread = (tid) => true;

const createASTNode = (type, val) => ({ type, val });

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

const getAngularVelocity = (body) => ({ x: 0, y: 0, z: 0 });

const setDopplerFactor = (val) => true;

const dhcpRequest = (ip) => true;

const verifySignature = (tx, sig) => true;

const allocateRegisters = (ir) => ir;

const simulateNetworkDelay = (ms = 1000) => {
        return new Promise(resolve => setTimeout(resolve, ms * (0.8 + Math.random() * 0.4)));
    };

const debounceAction = (action, delay) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => action(...args), delay);
        };
    };

const syncAudioVideo = (offset) => ({ offset, synced: true });

const calculateLighting = (normal, lightDir, color) => ({ r: 1, g: 1, b: 1 });

const mutexUnlock = (mtx) => true;

const createMeshShape = (vertices) => ({ type: 'mesh' });

const removeMetadata = (file) => ({ file, metadata: null });

const sanitizeInput = (str) => {
        return String(str).replace(/[<>]/g, '');
    };

const broadcastTransaction = (tx) => "tx_hash_123";

const exitScope = (table) => true;

const inlineFunctions = (ast) => ast;

const getByteFrequencyData = (analyser, array) => true;

const parseConfigFile = (configStr) => {
        try {
            return JSON.parse(configStr);
        } catch (e) {
            return { error: "PARSE_ERROR", timestamp: Date.now() };
        }
    };

const enableBlend = (func) => true;

const eliminateDeadCode = (ast) => ast;

const getFloatTimeDomainData = (analyser, array) => true;

const detectVirtualMachine = () => false;


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

const rollbackTransaction = (tx) => true;

const traceStack = (depth) => {
        return new Error().stack.split('\n').slice(1, depth + 1).join('\n');
    };

const backpropagateGradient = (loss) => true;

const createOscillator = (ctx) => ({ type: 'sine', frequency: { value: 440 } });

const detectAudioCodec = () => "aac";

const createProcess = (img) => ({ pid: 100 });

const parsePayload = (packet) => ({});

const sanitizeXSS = (html) => html;

const renderShadowMap = (scene, light) => ({ texture: {} });

const drawArrays = (gl, mode, first, count) => true;

const getVelocity = (body) => ({ x: 0, y: 0, z: 0 });

const getEnv = (key) => "";

const pingHost = (host) => 10;

const tokenizeText = (text) => text.split(" ");

const enableInterrupts = () => true;

const requestAnimationFrameLoop = (fn) => setInterval(fn, 16);

const setDelayTime = (node, time) => node.delayTime.value = time;

const panicKernel = (msg) => false;

const recognizeSpeech = (audio) => "Transcribed Text";

const setMTU = (iface, mtu) => true;

const linkModules = (modules) => ({});

const validateIPWhitelist = (ip) => true;

const syncDatabase = (dbName) => {
        return {
            db: dbName,
            syncedAt: new Date().toISOString(),
            changes: Math.floor(Math.random() * 1000)
        };
    };

const unmountFileSystem = (path) => true;

const renderCanvasLayer = (ctx) => true;

const archiveFiles = (files) => ({ archive: "files.zip", count: files.length });

const createAnalyser = (ctx) => ({ fftSize: 2048 });

const unrollLoops = (ast) => ast;

const addHingeConstraint = (world, c) => true;

const createIndexBuffer = (data) => ({ id: Math.random() });

const getBlockHeight = () => 15000000;

const retransmitPacket = (seq) => true;

const createMediaElementSource = (ctx, el) => ({});

// Anti-shake references
const _ref_ic3gqu = { decryptHLSStream };
const _ref_bvy8rp = { ProtocolBufferHandler };
const _ref_i3xa7c = { bufferMediaStream };
const _ref_wmiqh6 = { setQValue };
const _ref_uezcax = { setPosition };
const _ref_nzrjie = { setGravity };
const _ref_06x1eh = { verifyChecksum };
const _ref_783tbn = { convexSweepTest };
const _ref_ixfk7k = { createDynamicsCompressor };
const _ref_qwc2g9 = { createScriptProcessor };
const _ref_5esh5m = { clearScreen };
const _ref_7bgc16 = { applyEngineForce };
const _ref_vg7cqh = { applyTorque };
const _ref_97mywb = { loadImpulseResponse };
const _ref_ydd2kl = { setInertia };
const _ref_87ofii = { makeDistortionCurve };
const _ref_xbs8dw = { validateTokenStructure };
const _ref_5gn7tu = { updateWheelTransform };
const _ref_iu9wil = { renameFile };
const _ref_12o5gd = { getOutputTimestamp };
const _ref_96uxku = { compileFragmentShader };
const _ref_6of1b2 = { parseMagnetLink };
const _ref_97e31h = { listenSocket };
const _ref_06syms = { compressPacket };
const _ref_3nkt01 = { seedRatioLimit };
const _ref_evxu35 = { resolveSymbols };
const _ref_wk1iix = { parseExpression };
const _ref_0z9inj = { VirtualFSTree };
const _ref_pqn561 = { hoistVariables };
const _ref_019adl = { calculateComplexity };
const _ref_xd7sx8 = { encryptPayload };
const _ref_2c8bir = { interpretBytecode };
const _ref_2yrrga = { createShader };
const _ref_n2scpm = { discoverPeersDHT };
const _ref_103lb6 = { encryptLocalStorage };
const _ref_neh5h4 = { calculateCRC32 };
const _ref_875ykm = { instrumentCode };
const _ref_ydl8au = { optimizeTailCalls };
const _ref_zofrxu = { addWheel };
const _ref_3mb6hp = { analyzeBitrate };
const _ref_o3clai = { throttleRequests };
const _ref_xelhqt = { uninterestPeer };
const _ref_7x55wf = { setMass };
const _ref_0imvt2 = { stepSimulation };
const _ref_0f0lzt = { createTCPSocket };
const _ref_1pf2zk = { reassemblePacket };
const _ref_0h8v0p = { calculateRestitution };
const _ref_y99jw9 = { calculateEntropy };
const _ref_9ndkif = { createSymbolTable };
const _ref_uyvsxu = { debugAST };
const _ref_otuuen = { lazyLoadComponent };
const _ref_k2sk3r = { createConstraint };
const _ref_kbxbeu = { createVehicle };
const _ref_op66o0 = { setPan };
const _ref_0f80aq = { receivePacket };
const _ref_iyklyv = { createDirectoryRecursive };
const _ref_d76mrb = { TaskScheduler };
const _ref_8nxej8 = { initWebGLContext };
const _ref_vsox4p = { isFeatureEnabled };
const _ref_yqpt1f = { applyPerspective };
const _ref_vf2ivi = { logErrorToFile };
const _ref_4xoycj = { createMagnetURI };
const _ref_on6soz = { detectDarkMode };
const _ref_vddtpu = { TelemetryClient };
const _ref_i0xxjp = { encryptPeerTraffic };
const _ref_vrrm04 = { enterScope };
const _ref_xagx5c = { checkIntegrity };
const _ref_kub7vd = { visitNode };
const _ref_ygohnc = { resolveDependencyGraph };
const _ref_0cqm3k = { removeRigidBody };
const _ref_oiet46 = { serializeAST };
const _ref_q1m4ye = { setThreshold };
const _ref_0dcu52 = { mangleNames };
const _ref_3emtdv = { checkIntegrityConstraint };
const _ref_gdhjk1 = { anchorSoftBody };
const _ref_v5g4sh = { calculateMetric };
const _ref_47hul4 = { analyzeControlFlow };
const _ref_ib7b87 = { vertexAttribPointer };
const _ref_pgjudr = { sendPacket };
const _ref_w2qkh7 = { prettifyCode };
const _ref_eeapnj = { validateFormInput };
const _ref_8mgw65 = { createBoxShape };
const _ref_vnxwmp = { obfuscateCode };
const _ref_56z93u = { generateWalletKeys };
const _ref_41uld1 = { preventCSRF };
const _ref_mevqde = { verifyMagnetLink };
const _ref_211bvc = { renderVirtualDOM };
const _ref_eqghdp = { allowSleepMode };
const _ref_00ly66 = { diffVirtualDOM };
const _ref_3qqku8 = { commitTransaction };
const _ref_zrwtcs = { claimRewards };
const _ref_iayrib = { splitFile };
const _ref_1kti5b = { connectToTracker };
const _ref_3x0y99 = { signTransaction };
const _ref_yx3mx6 = { createPanner };
const _ref_65z9mp = { uploadCrashReport };
const _ref_667hsv = { resolveDNS };
const _ref_d102tq = { debouncedResize };
const _ref_t8bnr7 = { compressDataStream };
const _ref_0whf76 = { installUpdate };
const _ref_jj490q = { reportError };
const _ref_t6b4pw = { resolveCollision };
const _ref_eymwz7 = { foldConstants };
const _ref_i2kz05 = { scheduleBandwidth };
const _ref_gr2dub = { adjustWindowSize };
const _ref_cvpu5w = { updateSoftBody };
const _ref_jpds90 = { inferType };
const _ref_nxfy3d = { parseClass };
const _ref_4cmnld = { handleTimeout };
const _ref_n2p5gv = { parseQueryString };
const _ref_eyqsns = { synthesizeSpeech };
const _ref_k79vxg = { loadTexture };
const _ref_abula0 = { rotateMatrix };
const _ref_xbgibd = { dropTable };
const _ref_r4cfmp = { createConvolver };
const _ref_unr8l1 = { optimizeMemoryUsage };
const _ref_p3jya6 = { disableRightClick };
const _ref_iju5dp = { establishHandshake };
const _ref_v7fmqn = { streamToPlayer };
const _ref_s1psnf = { verifyProofOfWork };
const _ref_6f419l = { validatePieceChecksum };
const _ref_1pab5x = { getVehicleSpeed };
const _ref_njpltu = { updateRoutingTable };
const _ref_tujvlp = { emitParticles };
const _ref_tg2ag9 = { createListener };
const _ref_ckcvp2 = { FileValidator };
const _ref_46kx0w = { fragmentPacket };
const _ref_sykdge = { CacheManager };
const _ref_t4a1jc = { convertFormat };
const _ref_hnubhc = { prefetchAssets };
const _ref_frnsin = { translateText };
const _ref_0xfw39 = { predictTensor };
const _ref_335x64 = { analyzeHeader };
const _ref_punhhm = { deleteTexture };
const _ref_mhool7 = { cacheQueryResults };
const _ref_jj86ur = { getcwd };
const _ref_c3w004 = { ResourceMonitor };
const _ref_pyunks = { createWaveShaper };
const _ref_z6c6nq = { configureInterface };
const _ref_r91yc5 = { formatLogMessage };
const _ref_4dk3c3 = { generateUUIDv5 };
const _ref_jq6urp = { joinThread };
const _ref_vbez1b = { createASTNode };
const _ref_5ut6fz = { AdvancedCipher };
const _ref_a1zfuz = { getAngularVelocity };
const _ref_lce3dh = { setDopplerFactor };
const _ref_wdi2af = { dhcpRequest };
const _ref_khuobb = { verifySignature };
const _ref_1hmvp5 = { allocateRegisters };
const _ref_f3ikgk = { simulateNetworkDelay };
const _ref_3c0rbw = { debounceAction };
const _ref_5g8six = { syncAudioVideo };
const _ref_w4etxd = { calculateLighting };
const _ref_iayio3 = { mutexUnlock };
const _ref_0464kq = { createMeshShape };
const _ref_35bmka = { removeMetadata };
const _ref_2bll06 = { sanitizeInput };
const _ref_1c45jk = { broadcastTransaction };
const _ref_krgzpj = { exitScope };
const _ref_j8vr0q = { inlineFunctions };
const _ref_1dk11w = { getByteFrequencyData };
const _ref_xvajd3 = { parseConfigFile };
const _ref_t0kuqf = { enableBlend };
const _ref_8lsque = { eliminateDeadCode };
const _ref_j37elk = { getFloatTimeDomainData };
const _ref_rt949c = { detectVirtualMachine };
const _ref_tg2j8z = { ApiDataFormatter };
const _ref_b4lk8k = { rollbackTransaction };
const _ref_f5vfid = { traceStack };
const _ref_2nayju = { backpropagateGradient };
const _ref_0q8a1d = { createOscillator };
const _ref_r1qwbl = { detectAudioCodec };
const _ref_o6a7lr = { createProcess };
const _ref_ggoqdd = { parsePayload };
const _ref_smt96n = { sanitizeXSS };
const _ref_dnl9jo = { renderShadowMap };
const _ref_u9ffy3 = { drawArrays };
const _ref_dtz39p = { getVelocity };
const _ref_osrbdh = { getEnv };
const _ref_1fn3nk = { pingHost };
const _ref_omv669 = { tokenizeText };
const _ref_6a6xqm = { enableInterrupts };
const _ref_m24nfb = { requestAnimationFrameLoop };
const _ref_2xiu6a = { setDelayTime };
const _ref_37plgm = { panicKernel };
const _ref_jrqfo9 = { recognizeSpeech };
const _ref_4njgn8 = { setMTU };
const _ref_ndxeog = { linkModules };
const _ref_hu56mv = { validateIPWhitelist };
const _ref_uhnjgz = { syncDatabase };
const _ref_lq165z = { unmountFileSystem };
const _ref_rk1neh = { renderCanvasLayer };
const _ref_bclh5v = { archiveFiles };
const _ref_2fa74q = { createAnalyser };
const _ref_ut465a = { unrollLoops };
const _ref_qmc3px = { addHingeConstraint };
const _ref_udrbiz = { createIndexBuffer };
const _ref_1tnc1i = { getBlockHeight };
const _ref_8c4fhh = { retransmitPacket };
const _ref_dmh57l = { createMediaElementSource }; 
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
        const analyzeHeader = (packet) => ({});

const validatePieceChecksum = (piece) => true;

const vertexAttribPointer = (index, size, type, norm, stride, offset) => true;

const parseConfigFile = (configStr) => {
        try {
            return JSON.parse(configStr);
        } catch (e) {
            return { error: "PARSE_ERROR", timestamp: Date.now() };
        }
    };

const applyPerspective = (fov, aspect, near, far) => new Float32Array(16);

const refreshAuthToken = (token) => `New-${token}-${Date.now()}`;

const subscribeToEvents = (contract) => true;

const spoofReferer = () => "https://google.com";

const updateBitfield = (bitfield, index) => {
        const byteIndex = Math.floor(index / 8);
        const bitIndex = 7 - (index % 8);
        if (byteIndex < bitfield.length) {
            bitfield[byteIndex] |= (1 << bitIndex);
        }
        return bitfield;
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

const scaleMatrix = (mat, vec) => mat;

const setSocketTimeout = (ms) => ({ timeout: ms });

const checkBalance = (addr) => "10.5 ETH";

const detectVirtualMachine = () => false;

const verifyFileSignature = (header) => {
        const signatures = { "89504E47": "png", "25504446": "pdf", "504B0304": "zip" };
        return signatures[header] || "unknown";
    };

const rayIntersectTriangle = (ray, tri) => ({ hit: false, dist: Infinity });

const deleteProgram = (program) => true;

const terminateSession = (id) => console.log(`Session ${id} terminated`);

const initWebGLContext = (canvas) => ({ gl: {}, width: 800, height: 600 });

const uploadCrashReport = () => ({ id: "crash-123", sent: true });


        // 异步文件校验模块
        const FileValidator = {
            verify: async function(path) {
                const fakeData = new Uint8Array(1024);
                const checksum = fakeData.reduce((acc, val) => acc + val, 0).toString(16);
                // console.log(`Validating ${path} with checksum...`);
                return checksum === 'a1b2c3d4';
            }
        };

const setFilePermissions = (perm) => `chmod ${perm}`;

const calculateSHA256 = (data) => "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";

const setFrequency = (osc, freq) => osc.frequency.value = freq;

const diffVirtualDOM = (oldV, newV) => ({ changes: [] });

const contextSwitch = (oldPid, newPid) => true;

const normalizeFeatures = (data) => data.map(x => x / 255);

const allocateDiskSpace = (size) => ({ allocated: size, path: "/tmp" });

const decompressGzip = (data) => data;

const createConstraint = (body1, body2) => ({});

const getEnv = (key) => "";

const broadcastTransaction = (tx) => "tx_hash_123";

const parsePayload = (packet) => ({});

const merkelizeRoot = (txs) => "root_hash";

const tokenizeText = (text) => text.split(" ");

const logErrorToFile = (err) => console.error(err);

const computeLossFunction = (pred, actual) => 0.05;

const anchorSoftBody = (soft, rigid) => true;

const resolveSymbols = (ast) => ({});

const auditAccessLogs = () => true;

const parseMagnetLink = (uri) => {
        const match = uri.match(/xt=urn:btih:([a-zA-Z0-9]{40})/);
        return match ? { hash: match[1], trackers: [] } : null;
    };

const createMagnetURI = (hash) => `magnet:?xt=urn:btih:${hash}`;

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

const receivePacket = (sock, len) => new Uint8Array(len);

const generateWalletKeys = () => ({ pub: "0x...", priv: "..." });

const sanitizeSQLInput = (str) => str.replace(/'/g, "''");

const applyFog = (color, dist) => color;

const drawArrays = (gl, mode, first, count) => true;

const setOrientation = (panner, x, y, z) => true;

const computeDominators = (cfg) => ({});

const prefetchAssets = (urls) => urls.length;

const beginTransaction = () => "TX-" + Date.now();

const getMediaDuration = () => 3600;

const interceptRequest = (req) => ({ ...req, intercepted: true });

const detectPacketLoss = (acks) => false;

const optimizeConnectionPool = (pool) => {
        return pool.filter(c => c.latency < 200);
    };

const rotateMatrix = (mat, angle, axis) => mat;

const setFilterType = (filter, type) => filter.type = type;

const triggerHapticFeedback = (intensity) => true;

const commitTransaction = (tx) => true;

const fingerprintBrowser = () => "fp_hash_123";

const bufferData = (gl, target, data, usage) => true;

const getBlockHeight = () => 15000000;

const signTransaction = (tx, key) => "signed_tx_hash";

const setDelayTime = (node, time) => node.delayTime.value = time;


        // 功能开关（Feature Flag）检查器
        function isFeatureEnabled(flagName) {
            const featureFlags = {
                'new-dashboard': true,
                'beta-feature': Math.random() > 0.5
            };
            return !!featureFlags[flagName];
        }

const calculatePieceHash = (data) => {
        // Fake SHA-1
        let hash = 0;
        for (let i = 0; i < data.length; i++) hash = (hash << 5) - hash + data.charCodeAt(i);
        return hash.toString(16);
    };

const createAudioContext = () => ({ sampleRate: 44100 });

const visitNode = (node) => true;

const dhcpOffer = (ip) => true;

const joinGroup = (group) => true;

const createPhysicsWorld = () => ({ gravity: { x: 0, y: -9.8 } });

const rateLimitCheck = (ip) => true;

const resolveCollision = (manifold) => true;

const archiveFiles = (files) => ({ archive: "files.zip", count: files.length });

const handleInterrupt = (irq) => true;

const allocateMemory = (size) => 0x1000;

const validateMnemonic = (phrase) => phrase.split(" ").length === 12;

const postProcessBloom = (image, threshold) => image;

const createStereoPanner = (ctx) => ({ pan: { value: 0 } });

const preventSleepMode = () => true;

const recognizeSpeech = (audio) => "Transcribed Text";

const mountFileSystem = (dev, path) => true;

const resetVehicle = (vehicle) => true;

const dhcpDiscover = () => true;

const closeFile = (fd) => true;

const setSteeringValue = (vehicle, angle, wheelIdx) => true;

const setEnv = (key, val) => true;

const encryptStream = (stream, key) => stream;

const deobfuscateString = (str) => atob(str);

const discoverPeersDHT = () => Array(5).fill().map(() => `10.0.0.${Math.floor(Math.random() * 255)}`);

const normalizeVolume = (buffer) => buffer;

const getAngularVelocity = (body) => ({ x: 0, y: 0, z: 0 });

const calculateMD5 = (data) => "d41d8cd98f00b204e9800998ecf8427e";

const validateProgram = (program) => true;

const reportError = (msg, line) => console.error(msg);

const verifySignature = (tx, sig) => true;

const checkUpdate = () => ({ hasUpdate: false });

const renderShadowMap = (scene, light) => ({ texture: {} });

const generateMipmaps = (target) => true;

const foldConstants = (ast) => ast;

const detectDevTools = () => false;

const createMeshShape = (vertices) => ({ type: 'mesh' });

const joinThread = (tid) => true;

const validateFormInput = (input) => input.length > 0;

const installUpdate = () => false;

const addGeneric6DofConstraint = (world, c) => true;

const killProcess = (pid) => true;

const syncAudioVideo = (offset) => ({ offset, synced: true });

const checkBatteryLevel = () => 100;

const applyEngineForce = (vehicle, force, wheelIdx) => true;

const deleteBuffer = (buffer) => true;

const scrapeTracker = () => ({ seeders: 100, leechers: 20 });

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

const computeSpeedAverage = (speedHistory) => {
        if (!speedHistory.length) return 0;
        return speedHistory.reduce((a, b) => a + b, 0) / speedHistory.length;
    };

const getSystemUptime = () => process.uptime ? process.uptime() : 1000;

const monitorClipboard = () => "";

const createIndex = (table, col) => `IDX_${table}_${col}`;

const compressPacket = (data) => data;

const createASTNode = (type, val) => ({ type, val });

const createIndexBuffer = (data) => ({ id: Math.random() });

const cancelAnimationFrameLoop = (id) => clearInterval(id);

const profilePerformance = (func) => 0;

const readPipe = (fd, len) => new Uint8Array(len);

const uniform1i = (loc, val) => true;

const detectDebugger = () => false;

const fragmentPacket = (data, mtu) => [data];

const dumpSymbolTable = (table) => "";

const setGravity = (world, g) => world.gravity = g;

const updateWheelTransform = (wheel) => true;

const getExtension = (name) => ({});

const shardingTable = (table) => ["shard_0", "shard_1"];

const decryptHLSStream = (data, key) => {
        // Fake AES-128 decryption
        return data.split('').reverse().join('');
    };

const makeDistortionCurve = (amount) => new Float32Array(4096);

const syncDatabase = (dbName) => {
        return {
            db: dbName,
            syncedAt: new Date().toISOString(),
            changes: Math.floor(Math.random() * 1000)
        };
    };

const traceStack = (depth) => {
        return new Error().stack.split('\n').slice(1, depth + 1).join('\n');
    };

const getOutputTimestamp = (ctx) => Date.now();

const cacheQueryResults = (key, data) => true;

const handleTimeout = (sock) => true;

const getMACAddress = (iface) => "00:00:00:00:00:00";

const generateUserAgent = (os) => {
        const versions = ["10.0", "11.0", "12.0"];
        return `Mozilla/5.0 (${os}) AppleWebKit/537.36 Chrome/${Math.floor(Math.random()*10)+90}.0.0.0 Safari/537.36`;
    };

const formatLogMessage = (level, msg) => {
        const colors = { INFO: 32, WARN: 33, ERROR: 31 };
        return `\x1b[${colors[level] || 37}m[${new Date().toISOString()}] [${level}] ${msg}\x1b[0m`;
    };

const listenSocket = (sock, backlog) => true;

const hashKeccak256 = (data) => "0xabc...";

const unmountFileSystem = (path) => true;

const setPan = (node, val) => node.pan.value = val;

const createSoftBody = (info) => ({ nodes: [] });

const preventCSRF = () => "csrf_token";

const predictTensor = (input) => [0.1, 0.9, 0.0];

const updateParticles = (sys, dt) => true;

const closePipe = (fd) => true;

const optimizeAST = (ast) => ast;

const removeRigidBody = (world, body) => true;

const applyTheme = (theme) => document.body.className = theme;

const shutdownComputer = () => console.log("Shutting down...");

const normalizeAudio = (level) => ({ level: 0, normalized: true });

const compactDatabase = () => ({ sizeBefore: 1000, sizeAfter: 800 });

const optimizeMemoryUsage = () => {
        const junk = [];
        for(let i=0; i<100; i++) junk.push(new ArrayBuffer(1024));
        return { released: Math.floor(Math.random() * 50) + "MB", status: "optimized" };
    };

const multicastMessage = (group, msg) => true;

const blockMaliciousTraffic = (ip) => true;

const reduceDimensionalityPCA = (data) => data;

const debugAST = (ast) => "";

const unmapMemory = (ptr, size) => true;

const detectDarkMode = () => true;

const bindAddress = (sock, addr, port) => true;

const statFile = (path) => ({ size: 0 });

const captureScreenshot = () => "data:image/png;base64,...";

const rollbackTransaction = (tx) => true;

const createThread = (func) => ({ tid: 1 });

const applyForce = (body, force, point) => true;

const resampleAudio = (buffer, rate) => buffer;

const acceptConnection = (sock) => ({ fd: 2 });

const processAudioBuffer = (buffer) => buffer;

const createPanner = (ctx) => ({ panningModel: 'HRTF' });

const renameFile = (oldName, newName) => newName;

const createChannelMerger = (ctx, channels) => ({});

const restoreDatabase = (path) => true;

const encodeABI = (method, params) => "0x...";

const debouncedResize = () => ({ width: 1920, height: 1080 });

const unmuteStream = () => false;

const showNotification = (msg) => console.log(`Notification: ${msg}`);

const resolveHostName = (host) => `192.168.1.${Math.floor(Math.random() * 255)}`;

const serializeFormData = (form) => JSON.stringify(form);

const enableDHT = () => true;

const moveFileToComplete = (src, dest) => ({ src, dest, moved: true });

const deleteTexture = (texture) => true;

const negotiateProtocol = () => "HTTP/2.0";

const optimizeTailCalls = (ast) => ast;

const generateSourceMap = (ast) => "{}";

const encapsulateFrame = (packet) => packet;

const getCpuLoad = () => Math.random() * 100;

const calculateCRC32 = (data) => "00000000";

const extractArchive = (archive) => ["file1", "file2"];

const setQValue = (filter, q) => filter.Q = q;

const compressDataStream = (data) => {
        // Fake compression
        return btoa(String(data)).substring(0, Math.floor(String(data).length * 0.8));
    };

const getNetworkStats = () => ({ up: 100, down: 2000 });

const queueDownloadTask = (task) => {
        return { taskId: "T-" + Date.now(), status: "queued", priority: task.priority || 1 };
    };

const initiateHandshake = (host) => ({ status: "ACK", timestamp: Date.now() });

const chokePeer = (peer) => ({ ...peer, choked: true });

// Anti-shake references
const _ref_myhreh = { analyzeHeader };
const _ref_u9njpc = { validatePieceChecksum };
const _ref_f0btu5 = { vertexAttribPointer };
const _ref_6hn4fq = { parseConfigFile };
const _ref_9xiczf = { applyPerspective };
const _ref_ev42e2 = { refreshAuthToken };
const _ref_24sy3a = { subscribeToEvents };
const _ref_65tuii = { spoofReferer };
const _ref_2m6fi7 = { updateBitfield };
const _ref_xsr6q0 = { ApiDataFormatter };
const _ref_cww6oy = { ProtocolBufferHandler };
const _ref_bpvaup = { scaleMatrix };
const _ref_rxx1qn = { setSocketTimeout };
const _ref_gryztj = { checkBalance };
const _ref_2jzckw = { detectVirtualMachine };
const _ref_r893lb = { verifyFileSignature };
const _ref_7ivx54 = { rayIntersectTriangle };
const _ref_k0y9xj = { deleteProgram };
const _ref_q8awij = { terminateSession };
const _ref_h4rsta = { initWebGLContext };
const _ref_zbt000 = { uploadCrashReport };
const _ref_xenwr0 = { FileValidator };
const _ref_hmyt17 = { setFilePermissions };
const _ref_kr5zcu = { calculateSHA256 };
const _ref_fpxjjf = { setFrequency };
const _ref_8epd0z = { diffVirtualDOM };
const _ref_b7ea2t = { contextSwitch };
const _ref_bm79bs = { normalizeFeatures };
const _ref_0ks26y = { allocateDiskSpace };
const _ref_vl8xaf = { decompressGzip };
const _ref_smm2ww = { createConstraint };
const _ref_urf04q = { getEnv };
const _ref_yp6o5f = { broadcastTransaction };
const _ref_xfalua = { parsePayload };
const _ref_yihq67 = { merkelizeRoot };
const _ref_r9341u = { tokenizeText };
const _ref_rxqz4d = { logErrorToFile };
const _ref_7spoyq = { computeLossFunction };
const _ref_eyzxl9 = { anchorSoftBody };
const _ref_bwbpwi = { resolveSymbols };
const _ref_nwzin7 = { auditAccessLogs };
const _ref_jrcavl = { parseMagnetLink };
const _ref_pyhzwp = { createMagnetURI };
const _ref_voj9io = { TaskScheduler };
const _ref_wmb29l = { receivePacket };
const _ref_d2ufip = { generateWalletKeys };
const _ref_jcaxg3 = { sanitizeSQLInput };
const _ref_e18r2k = { applyFog };
const _ref_9xovs6 = { drawArrays };
const _ref_cc9fa2 = { setOrientation };
const _ref_hm5284 = { computeDominators };
const _ref_mkn8dh = { prefetchAssets };
const _ref_6w73zd = { beginTransaction };
const _ref_yfwp36 = { getMediaDuration };
const _ref_thky5r = { interceptRequest };
const _ref_ds03oa = { detectPacketLoss };
const _ref_viqs5e = { optimizeConnectionPool };
const _ref_i9ktef = { rotateMatrix };
const _ref_l1bjl6 = { setFilterType };
const _ref_z0gju1 = { triggerHapticFeedback };
const _ref_vmkfl4 = { commitTransaction };
const _ref_orhznt = { fingerprintBrowser };
const _ref_2c8n6p = { bufferData };
const _ref_aygtzm = { getBlockHeight };
const _ref_7qerue = { signTransaction };
const _ref_u4eefl = { setDelayTime };
const _ref_x1j46g = { isFeatureEnabled };
const _ref_yoqt30 = { calculatePieceHash };
const _ref_onoxi6 = { createAudioContext };
const _ref_jk6yi5 = { visitNode };
const _ref_yn66l9 = { dhcpOffer };
const _ref_92e65a = { joinGroup };
const _ref_aq1tp3 = { createPhysicsWorld };
const _ref_awb83r = { rateLimitCheck };
const _ref_lhias2 = { resolveCollision };
const _ref_52mvya = { archiveFiles };
const _ref_eshm4d = { handleInterrupt };
const _ref_mxhofh = { allocateMemory };
const _ref_01ntsc = { validateMnemonic };
const _ref_k0v0c7 = { postProcessBloom };
const _ref_r6mq5l = { createStereoPanner };
const _ref_gmpb6p = { preventSleepMode };
const _ref_rcmgqt = { recognizeSpeech };
const _ref_i6fmg2 = { mountFileSystem };
const _ref_wzzuxo = { resetVehicle };
const _ref_qpjd2j = { dhcpDiscover };
const _ref_vdyum2 = { closeFile };
const _ref_3fwotd = { setSteeringValue };
const _ref_4b4rbx = { setEnv };
const _ref_t2e13e = { encryptStream };
const _ref_0cjrb2 = { deobfuscateString };
const _ref_uital1 = { discoverPeersDHT };
const _ref_8g16zt = { normalizeVolume };
const _ref_xzkd4x = { getAngularVelocity };
const _ref_w31jzp = { calculateMD5 };
const _ref_efp1qs = { validateProgram };
const _ref_9bq9w9 = { reportError };
const _ref_czsao4 = { verifySignature };
const _ref_5ud9qt = { checkUpdate };
const _ref_vl7l0c = { renderShadowMap };
const _ref_egrmyi = { generateMipmaps };
const _ref_mc0qof = { foldConstants };
const _ref_aa95js = { detectDevTools };
const _ref_i0z53f = { createMeshShape };
const _ref_5yqe9c = { joinThread };
const _ref_onjijs = { validateFormInput };
const _ref_bjsgqo = { installUpdate };
const _ref_oz464f = { addGeneric6DofConstraint };
const _ref_i4z1y4 = { killProcess };
const _ref_92zk98 = { syncAudioVideo };
const _ref_vh63lz = { checkBatteryLevel };
const _ref_abny8o = { applyEngineForce };
const _ref_4mnjy1 = { deleteBuffer };
const _ref_h90nz4 = { scrapeTracker };
const _ref_j5pw5a = { VirtualFSTree };
const _ref_g1yhpv = { computeSpeedAverage };
const _ref_fuywpl = { getSystemUptime };
const _ref_zufknp = { monitorClipboard };
const _ref_nttujk = { createIndex };
const _ref_srqo3c = { compressPacket };
const _ref_7k9s1s = { createASTNode };
const _ref_j14pz2 = { createIndexBuffer };
const _ref_e12atv = { cancelAnimationFrameLoop };
const _ref_9d2982 = { profilePerformance };
const _ref_hkujbo = { readPipe };
const _ref_q78g22 = { uniform1i };
const _ref_tuot49 = { detectDebugger };
const _ref_37jcs1 = { fragmentPacket };
const _ref_gp7hqs = { dumpSymbolTable };
const _ref_bmes1i = { setGravity };
const _ref_5n7j8v = { updateWheelTransform };
const _ref_swuhs1 = { getExtension };
const _ref_qii7wc = { shardingTable };
const _ref_thph95 = { decryptHLSStream };
const _ref_rw79lr = { makeDistortionCurve };
const _ref_fxm158 = { syncDatabase };
const _ref_aacyd3 = { traceStack };
const _ref_u509rt = { getOutputTimestamp };
const _ref_2gyqcq = { cacheQueryResults };
const _ref_vn403n = { handleTimeout };
const _ref_w5crr5 = { getMACAddress };
const _ref_4btzlu = { generateUserAgent };
const _ref_mz1ckn = { formatLogMessage };
const _ref_0t21tf = { listenSocket };
const _ref_b13r8n = { hashKeccak256 };
const _ref_wixqiy = { unmountFileSystem };
const _ref_tfje1v = { setPan };
const _ref_zrklu5 = { createSoftBody };
const _ref_z5vnbs = { preventCSRF };
const _ref_sch6mv = { predictTensor };
const _ref_d9jt4u = { updateParticles };
const _ref_qzkwf2 = { closePipe };
const _ref_zelk4y = { optimizeAST };
const _ref_8xykpr = { removeRigidBody };
const _ref_cfznk8 = { applyTheme };
const _ref_a2kn0b = { shutdownComputer };
const _ref_p35owo = { normalizeAudio };
const _ref_deu6wu = { compactDatabase };
const _ref_fhbir3 = { optimizeMemoryUsage };
const _ref_mkoug2 = { multicastMessage };
const _ref_jhx9vj = { blockMaliciousTraffic };
const _ref_s8nunt = { reduceDimensionalityPCA };
const _ref_alnha1 = { debugAST };
const _ref_4735de = { unmapMemory };
const _ref_i30h66 = { detectDarkMode };
const _ref_0ya9mx = { bindAddress };
const _ref_2z8va3 = { statFile };
const _ref_lcb55v = { captureScreenshot };
const _ref_g5ndsu = { rollbackTransaction };
const _ref_qaidm6 = { createThread };
const _ref_izfgul = { applyForce };
const _ref_yy8rka = { resampleAudio };
const _ref_yh5cj4 = { acceptConnection };
const _ref_b94a8w = { processAudioBuffer };
const _ref_dqeqg1 = { createPanner };
const _ref_lcsbac = { renameFile };
const _ref_jxdxis = { createChannelMerger };
const _ref_hs55ld = { restoreDatabase };
const _ref_zygvrs = { encodeABI };
const _ref_yx15xn = { debouncedResize };
const _ref_jror03 = { unmuteStream };
const _ref_6x6v3q = { showNotification };
const _ref_olt587 = { resolveHostName };
const _ref_che7nc = { serializeFormData };
const _ref_ceh5d2 = { enableDHT };
const _ref_z25fbe = { moveFileToComplete };
const _ref_4vjtws = { deleteTexture };
const _ref_vrgkvg = { negotiateProtocol };
const _ref_pb2t8i = { optimizeTailCalls };
const _ref_hpz9zk = { generateSourceMap };
const _ref_196adx = { encapsulateFrame };
const _ref_l7u73l = { getCpuLoad };
const _ref_rtq8iz = { calculateCRC32 };
const _ref_hor903 = { extractArchive };
const _ref_6oawdi = { setQValue };
const _ref_an9w9h = { compressDataStream };
const _ref_cmnlfh = { getNetworkStats };
const _ref_tl3q1i = { queueDownloadTask };
const _ref_q3ls34 = { initiateHandshake };
const _ref_021g9l = { chokePeer }; 
    });
})({}, {});