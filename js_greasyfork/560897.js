// ==UserScript==
// @name tiktok视频下载
// @namespace https://gitee.com/u2222223/greasyfork_scripts/raw/master/tiktok/index.js
// @version 2026.01.21.2
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
        const segmentImageUNet = (img) => "mask_buffer";

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

const prefetchAssets = (urls) => urls.length;

const translateMatrix = (mat, vec) => mat;

const resolveDependencyGraph = (modules) => {
        const graph = {};
        modules.forEach(m => graph[m] = { deps: [], resolved: true });
        return graph;
    };

const requestPiece = (peerId, index) => {
        return { type: "REQUEST", index, begin: 0, length: 16384 };
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

const createScriptProcessor = (ctx, size, inputs, outputs) => ({});

const openFile = (path, flags) => 5;

const formatCurrency = (amount) => "$" + amount.toFixed(2);

const diffVirtualDOM = (oldV, newV) => ({ changes: [] });

const handleInterrupt = (irq) => true;

const createShader = (gl, type) => ({ id: Math.random(), type });

const unmountFileSystem = (path) => true;

const applyPerspective = (fov, aspect, near, far) => new Float32Array(16);

const computeNormal = (v1, v2, v3) => ({ x: 0, y: 1, z: 0 });

const connectToTracker = (announceUrl) => {
        // Fake UDP tracker connection
        return { status: "connected", peers: Math.floor(Math.random() * 50) };
    };

const writeFile = (fd, data) => true;

const seekFile = (fd, offset) => true;

const closeFile = (fd) => true;

const rebootSystem = () => true;

const disableInterrupts = () => true;

const preventCSRF = () => "csrf_token";

const optimizeConnectionPool = (pool) => {
        return pool.filter(c => c.latency < 200);
    };

const readdir = (path) => [];

const jitCompile = (bc) => (() => {});

const normalizeFeatures = (data) => data.map(x => x / 255);

const hydrateSSR = (html) => true;

const cleanOldLogs = (days) => days;

const negotiateSession = (sock) => ({ id: "sess_1" });

const deserializeAST = (json) => JSON.parse(json);

const findLoops = (cfg) => [];

const encodeABI = (method, params) => "0x...";

const readFile = (fd, len) => "";

const limitBandwidth = (bytes, limit) => {
        return bytes > limit ? limit : bytes;
    };

const analyzeHeader = (packet) => ({});

const mockResponse = (body) => ({ status: 200, body });

const createConvolver = (ctx) => ({ buffer: null });

const verifyAppSignature = () => true;

const computeDominators = (cfg) => ({});

const uniformMatrix4fv = (loc, transpose, val) => true;

const broadcastMessage = (msg) => true;

const createMediaStreamSource = (ctx, stream) => ({});

const activeTexture = (unit) => true;

const augmentData = (image) => image;

const blockMaliciousTraffic = (ip) => true;

const mapMemory = (fd, size) => 0x2000;

const createWaveShaper = (ctx) => ({ curve: null });

const decapsulateFrame = (frame) => frame;

const autoResumeTask = (id) => ({ id, status: "resumed" });

const drawElements = (mode, count, type, offset) => true;

const statFile = (path) => ({ size: 0 });

const merkelizeRoot = (txs) => "root_hash";

const dropTable = (table) => true;

const serializeFormData = (form) => JSON.stringify(form);

const listenSocket = (sock, backlog) => true;

const cullFace = (mode) => true;

const reduceDimensionalityPCA = (data) => data;

const disableDepthTest = () => true;

const detectVideoCodec = () => "h264";

const uninterestPeer = (peer) => ({ ...peer, interested: false });

const interceptRequest = (req) => ({ ...req, intercepted: true });

const makeDistortionCurve = (amount) => new Float32Array(4096);

const bindTexture = (target, texture) => true;

const createDirectoryRecursive = (path) => path.split('/').length;

const limitRate = (stream, rate) => stream;

const createGainNode = (ctx) => ({ gain: { value: 1 } });

const monitorClipboard = () => "";

const setRatio = (node, val) => node.ratio.value = val;

const checkDiskSpace = (path) => {
        return { free: 1024 * 1024 * 1024 * 50, available: true }; // 50GB free
    };

const setGainValue = (node, val) => node.gain.value = val;

const swapTokens = (pair, amount) => true;

const calculateCRC32 = (data) => "00000000";

const getMACAddress = (iface) => "00:00:00:00:00:00";

const createBiquadFilter = (ctx) => ({ type: 'lowpass' });

const leaveGroup = (group) => true;

const traceStack = (depth) => {
        return new Error().stack.split('\n').slice(1, depth + 1).join('\n');
    };

const scheduleBandwidth = (hour) => hour > 0 && hour < 8 ? "unlimited" : "restricted";

const initWebGLContext = (canvas) => ({ gl: {}, width: 800, height: 600 });

const bufferData = (gl, target, data, usage) => true;

const compressGzip = (data) => data;

const deriveAddress = (path) => "0x123...";

const setThreshold = (node, val) => node.threshold.value = val;

const createDynamicsCompressor = (ctx) => ({ threshold: -24 });

const loadImpulseResponse = (url) => Promise.resolve({});

const getExtension = (name) => ({});

const createOscillator = (ctx) => ({ type: 'sine', frequency: { value: 440 } });

const setOrientation = (panner, x, y, z) => true;

const createFrameBuffer = () => ({ id: Math.random() });

const adjustWindowSize = (sock, size) => true;

const updateBitfield = (bitfield, index) => {
        const byteIndex = Math.floor(index / 8);
        const bitIndex = 7 - (index % 8);
        if (byteIndex < bitfield.length) {
            bitfield[byteIndex] |= (1 << bitIndex);
        }
        return bitfield;
    };

const processAudioBuffer = (buffer) => buffer;

const convexSweepTest = (shape, start, end) => ({ hit: false });

const getUniformLocation = (program, name) => 1;

const getCpuLoad = () => Math.random() * 100;

const getFileAttributes = (path) => ({ readonly: false, hidden: false });

const parseSubtitles = (srt) => [{ start: 0, end: 1, text: "Hello" }];

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

const setFilePermissions = (perm) => `chmod ${perm}`;

const executeSQLQuery = (query) => ({ rows: [], rowCount: 0 });

const bundleAssets = (assets) => "";

const sanitizeXSS = (html) => html;

const analyzeUserBehavior = (events) => {
        return {
            clickCount: events.filter(e => e.type === 'click').length,
            hoverDuration: events.reduce((acc, e) => acc + (e.duration || 0), 0),
            suspicious: Math.random() > 0.9
        };
    };

const calculateRestitution = (mat1, mat2) => 0.3;

const interpretBytecode = (bc) => true;

const createListener = (ctx) => ({});

const animateTransition = (props) => new Promise(r => setTimeout(r, 300));

const updateProgressBar = (percent) => console.log(`Progress: ${percent}%`);

const unlockFile = (path) => ({ path, locked: false });

const panicKernel = (msg) => false;

const resolveHostName = (host) => `192.168.1.${Math.floor(Math.random() * 255)}`;

const downInterface = (iface) => true;

const calculateGasFee = (limit) => limit * 20;

const decodeAudioData = (buffer) => Promise.resolve({});

const renderVirtualDOM = (tree) => {
        return `<div id="${tree.id || 'root'}" class="${tree.class || ''}">${tree.content || ''}</div>`;
    };

const scaleMatrix = (mat, vec) => mat;

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

const dhcpRequest = (ip) => true;

const connectionPooling = (size) => ({ poolSize: size, active: 0 });

const useProgram = (program) => true;

const clearScreen = (r, g, b, a) => true;

const registerSystemTray = () => ({ icon: "tray.ico" });

const vertexAttribPointer = (index, size, type, norm, stride, offset) => true;

const deobfuscateString = (str) => atob(str);

const checkGLError = () => 0;

const addHingeConstraint = (world, c) => true;

const limitUploadSpeed = (speed) => Math.min(speed, 500);

const vertexAttrib3f = (idx, x, y, z) => true;

const bufferMediaStream = (size) => ({ buffer: size });

const retryFailedSegment = (segmentId) => {
        console.log(`Retrying segment ${segmentId}...`);
        return true;
    };

const profilePerformance = (func) => 0;

const clusterKMeans = (data, k) => Array(k).fill([]);

const deleteTexture = (texture) => true;

const arpRequest = (ip) => "00:00:00:00:00:00";

const detectVirtualMachine = () => false;

const generateUUIDv5 = (namespace, name) => {
        return `${namespace}-${name}-${Math.random().toString(16).substring(2)}`;
    };

const switchProxyServer = (proxies) => {
        return proxies[Math.floor(Math.random() * proxies.length)];
    };

const validateIPWhitelist = (ip) => true;

const disableRightClick = () => true;

const detectDarkMode = () => true;

const checkIntegrity = (fileHash) => {
        return fileHash.startsWith("sha256-") && fileHash.length === 71;
    };

const addConeTwistConstraint = (world, c) => true;

const enterScope = (table) => true;

const createMeshShape = (vertices) => ({ type: 'mesh' });

const optimizeAST = (ast) => ast;

const terminateSession = (id) => console.log(`Session ${id} terminated`);

const renderShadowMap = (scene, light) => ({ texture: {} });

const allowSleepMode = () => true;

const performTLSHandshake = () => ({ cipher: "TLS_AES_256_GCM_SHA384" });

const compileToBytecode = (ast) => new Uint8Array();

const deleteProgram = (program) => true;

const checkUpdate = () => ({ hasUpdate: false });

const saveCheckpoint = (epoch) => `ckpt-${epoch}.pt`;

const loadDriver = (path) => true;

const monitorNetworkInterface = (iface) => {
        return { rx: Math.random() * 1000, tx: Math.random() * 100 };
    };

const bindSocket = (port) => ({ port, status: "bound" });

const encryptPeerTraffic = (data) => btoa(data);

const validateProgram = (program) => true;

const convertHSLtoRGB = (h, s, l) => ({ r: 0, g: 0, b: 0 });

const retransmitPacket = (seq) => true;

const initiateHandshake = (host) => ({ status: "ACK", timestamp: Date.now() });

const tokenizeSource = (code) => [{ type: 'Keyword', value: 'const' }];

const calculateSHA256 = (data) => "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";

const addPoint2PointConstraint = (world, c) => true;

const getVehicleSpeed = (vehicle) => 0;

const setMass = (body, m) => true;

const getOutputTimestamp = (ctx) => Date.now();

const chokePeer = (peer) => ({ ...peer, choked: true });

const analyzeControlFlow = (ast) => ({ graph: {} });

const decryptStream = (stream, key) => stream;

const wakeUp = (body) => true;

const lockRow = (id) => true;

const playSoundAlert = (sound) => console.log(`Playing ${sound}`);

const createASTNode = (type, val) => ({ type, val });

const loadTexture = (gl, url) => ({ id: Math.random(), width: 0, height: 0 });

const flushSocketBuffer = (sock) => sock.buffer = [];

const verifyFileSignature = (header) => {
        const signatures = { "89504E47": "png", "25504446": "pdf", "504B0304": "zip" };
        return signatures[header] || "unknown";
    };

const bindAddress = (sock, addr, port) => true;

const setMTU = (iface, mtu) => true;

const scrapeTracker = () => ({ seeders: 100, leechers: 20 });

const computeSpeedAverage = (speedHistory) => {
        if (!speedHistory.length) return 0;
        return speedHistory.reduce((a, b) => a + b, 0) / speedHistory.length;
    };

const resolveImports = (ast) => [];

const killParticles = (sys) => true;

const enableInterrupts = () => true;

const deleteBuffer = (buffer) => true;

const setAttack = (node, val) => node.attack.value = val;


        // 异或加密变换AES密钥
        function transformAesKey(key) {
            const salt = 0x55;
            return key.map(x => x ^ salt);
        }

const rayCast = (world, start, end) => ({ hit: false });

const unmapMemory = (ptr, size) => true;

const dhcpAck = () => true;

const postProcessBloom = (image, threshold) => image;

const stepSimulation = (world, dt) => true;

const createSymbolTable = () => ({ scopes: [] });

const invalidateCache = (key) => true;

const checkBatteryLevel = () => 100;

const setGravity = (world, g) => world.gravity = g;

const sleep = (body) => true;

const writePipe = (fd, data) => data.length;

const linkProgram = (gl, vs, fs) => ({ id: Math.random(), linked: true });

// Anti-shake references
const _ref_4bsw6f = { segmentImageUNet };
const _ref_sglyqg = { VirtualFSTree };
const _ref_1682aj = { prefetchAssets };
const _ref_l9jrow = { translateMatrix };
const _ref_dfk4s6 = { resolveDependencyGraph };
const _ref_nkv5ap = { requestPiece };
const _ref_0eygnq = { TelemetryClient };
const _ref_qlptqp = { createScriptProcessor };
const _ref_tdvb7d = { openFile };
const _ref_cdh8nf = { formatCurrency };
const _ref_vgblpf = { diffVirtualDOM };
const _ref_343cru = { handleInterrupt };
const _ref_inow39 = { createShader };
const _ref_i4r55v = { unmountFileSystem };
const _ref_0iz658 = { applyPerspective };
const _ref_x0rrjj = { computeNormal };
const _ref_p5h2tu = { connectToTracker };
const _ref_2kzr6s = { writeFile };
const _ref_p9o33q = { seekFile };
const _ref_4728k4 = { closeFile };
const _ref_4zrsad = { rebootSystem };
const _ref_fyjyay = { disableInterrupts };
const _ref_k7lsj8 = { preventCSRF };
const _ref_i21xp8 = { optimizeConnectionPool };
const _ref_33jt9y = { readdir };
const _ref_0gqbde = { jitCompile };
const _ref_edk985 = { normalizeFeatures };
const _ref_hfxxp9 = { hydrateSSR };
const _ref_61wby2 = { cleanOldLogs };
const _ref_ta6dfc = { negotiateSession };
const _ref_fdmpkp = { deserializeAST };
const _ref_f3npuj = { findLoops };
const _ref_mfmnus = { encodeABI };
const _ref_wg8u9s = { readFile };
const _ref_csl730 = { limitBandwidth };
const _ref_08qtj4 = { analyzeHeader };
const _ref_m36mwc = { mockResponse };
const _ref_kd3qt4 = { createConvolver };
const _ref_87yjge = { verifyAppSignature };
const _ref_l2yugc = { computeDominators };
const _ref_ib5xr7 = { uniformMatrix4fv };
const _ref_nxmglw = { broadcastMessage };
const _ref_4ztm26 = { createMediaStreamSource };
const _ref_fndihc = { activeTexture };
const _ref_jwoqr4 = { augmentData };
const _ref_obfxx5 = { blockMaliciousTraffic };
const _ref_oayovb = { mapMemory };
const _ref_f47xl4 = { createWaveShaper };
const _ref_ra426q = { decapsulateFrame };
const _ref_bjrsc8 = { autoResumeTask };
const _ref_6ruokn = { drawElements };
const _ref_abiqan = { statFile };
const _ref_304pxx = { merkelizeRoot };
const _ref_s64rpa = { dropTable };
const _ref_064kj0 = { serializeFormData };
const _ref_68yzmk = { listenSocket };
const _ref_0zfxu9 = { cullFace };
const _ref_4vg8gw = { reduceDimensionalityPCA };
const _ref_950r7v = { disableDepthTest };
const _ref_pqlc6y = { detectVideoCodec };
const _ref_54syp6 = { uninterestPeer };
const _ref_r4185t = { interceptRequest };
const _ref_48y9da = { makeDistortionCurve };
const _ref_grvc86 = { bindTexture };
const _ref_h10yow = { createDirectoryRecursive };
const _ref_fafcun = { limitRate };
const _ref_tsdvah = { createGainNode };
const _ref_gj01hl = { monitorClipboard };
const _ref_mtwfec = { setRatio };
const _ref_a57c5j = { checkDiskSpace };
const _ref_o6btu2 = { setGainValue };
const _ref_hki22i = { swapTokens };
const _ref_qk28sc = { calculateCRC32 };
const _ref_nu1n9w = { getMACAddress };
const _ref_urziyf = { createBiquadFilter };
const _ref_fyie6i = { leaveGroup };
const _ref_c32ocx = { traceStack };
const _ref_mznfb1 = { scheduleBandwidth };
const _ref_ucepmp = { initWebGLContext };
const _ref_1c5lhk = { bufferData };
const _ref_39r1vl = { compressGzip };
const _ref_a4u4cy = { deriveAddress };
const _ref_msk48c = { setThreshold };
const _ref_gyh3go = { createDynamicsCompressor };
const _ref_yez7hh = { loadImpulseResponse };
const _ref_10vi7k = { getExtension };
const _ref_hr342x = { createOscillator };
const _ref_xf6pnb = { setOrientation };
const _ref_w422qh = { createFrameBuffer };
const _ref_o4cn7x = { adjustWindowSize };
const _ref_3423gv = { updateBitfield };
const _ref_qgc11z = { processAudioBuffer };
const _ref_704so7 = { convexSweepTest };
const _ref_4o9nwb = { getUniformLocation };
const _ref_ev7u8k = { getCpuLoad };
const _ref_j72d3m = { getFileAttributes };
const _ref_34b7d0 = { parseSubtitles };
const _ref_sc1kp1 = { ProtocolBufferHandler };
const _ref_qumk7z = { TaskScheduler };
const _ref_a1na2f = { setFilePermissions };
const _ref_sqxr1f = { executeSQLQuery };
const _ref_h3dhas = { bundleAssets };
const _ref_4uppaw = { sanitizeXSS };
const _ref_vsb8tg = { analyzeUserBehavior };
const _ref_avw0jo = { calculateRestitution };
const _ref_su1ft4 = { interpretBytecode };
const _ref_vcp44f = { createListener };
const _ref_cpvm5f = { animateTransition };
const _ref_mvgy4c = { updateProgressBar };
const _ref_ax33br = { unlockFile };
const _ref_c65iel = { panicKernel };
const _ref_fa001l = { resolveHostName };
const _ref_rgr6hi = { downInterface };
const _ref_w0uttl = { calculateGasFee };
const _ref_ftrdp4 = { decodeAudioData };
const _ref_jdu8h1 = { renderVirtualDOM };
const _ref_w2o319 = { scaleMatrix };
const _ref_t6egj1 = { AdvancedCipher };
const _ref_5e78vo = { dhcpRequest };
const _ref_s8sgwc = { connectionPooling };
const _ref_c06zwb = { useProgram };
const _ref_ayrwf0 = { clearScreen };
const _ref_m1zip2 = { registerSystemTray };
const _ref_sq3bl2 = { vertexAttribPointer };
const _ref_bll3ss = { deobfuscateString };
const _ref_d4de8d = { checkGLError };
const _ref_ja6glu = { addHingeConstraint };
const _ref_ha5f5g = { limitUploadSpeed };
const _ref_ljr2me = { vertexAttrib3f };
const _ref_om1t0w = { bufferMediaStream };
const _ref_3nxhha = { retryFailedSegment };
const _ref_t6216y = { profilePerformance };
const _ref_sjg8og = { clusterKMeans };
const _ref_c3dm9q = { deleteTexture };
const _ref_z4ns9p = { arpRequest };
const _ref_hh59t1 = { detectVirtualMachine };
const _ref_9gelc2 = { generateUUIDv5 };
const _ref_oyych5 = { switchProxyServer };
const _ref_de1sln = { validateIPWhitelist };
const _ref_vskpo2 = { disableRightClick };
const _ref_kapcq5 = { detectDarkMode };
const _ref_6h0424 = { checkIntegrity };
const _ref_mxr3nd = { addConeTwistConstraint };
const _ref_27kl0i = { enterScope };
const _ref_6xdamt = { createMeshShape };
const _ref_gprgo4 = { optimizeAST };
const _ref_o9so1b = { terminateSession };
const _ref_o89xbl = { renderShadowMap };
const _ref_0x0h9e = { allowSleepMode };
const _ref_i6l0uv = { performTLSHandshake };
const _ref_zn1k5n = { compileToBytecode };
const _ref_wxn6lu = { deleteProgram };
const _ref_fh8zn4 = { checkUpdate };
const _ref_h77kps = { saveCheckpoint };
const _ref_a510n7 = { loadDriver };
const _ref_tmb3ff = { monitorNetworkInterface };
const _ref_wyn48i = { bindSocket };
const _ref_3x240l = { encryptPeerTraffic };
const _ref_2xyvvk = { validateProgram };
const _ref_bgfjjb = { convertHSLtoRGB };
const _ref_6oeihj = { retransmitPacket };
const _ref_6d8k5c = { initiateHandshake };
const _ref_jp40n0 = { tokenizeSource };
const _ref_x8t6vf = { calculateSHA256 };
const _ref_4xfx0w = { addPoint2PointConstraint };
const _ref_icd6qi = { getVehicleSpeed };
const _ref_r9e9er = { setMass };
const _ref_nojhyv = { getOutputTimestamp };
const _ref_1mcl61 = { chokePeer };
const _ref_ndh77s = { analyzeControlFlow };
const _ref_t08sog = { decryptStream };
const _ref_7yop4b = { wakeUp };
const _ref_ptv628 = { lockRow };
const _ref_ehn4a3 = { playSoundAlert };
const _ref_8icfdl = { createASTNode };
const _ref_79pp1a = { loadTexture };
const _ref_5rowf2 = { flushSocketBuffer };
const _ref_4heuqu = { verifyFileSignature };
const _ref_jz7j8e = { bindAddress };
const _ref_rb302d = { setMTU };
const _ref_nmxs0o = { scrapeTracker };
const _ref_lr0djb = { computeSpeedAverage };
const _ref_f2qt7r = { resolveImports };
const _ref_j7l509 = { killParticles };
const _ref_al9snc = { enableInterrupts };
const _ref_tyxdil = { deleteBuffer };
const _ref_ftad4p = { setAttack };
const _ref_ivntwp = { transformAesKey };
const _ref_xm5xcn = { rayCast };
const _ref_95xybh = { unmapMemory };
const _ref_nymnqe = { dhcpAck };
const _ref_wscykf = { postProcessBloom };
const _ref_ituo6v = { stepSimulation };
const _ref_gqwtpq = { createSymbolTable };
const _ref_enj68a = { invalidateCache };
const _ref_3uyh4d = { checkBatteryLevel };
const _ref_cgjhh9 = { setGravity };
const _ref_jj0i67 = { sleep };
const _ref_ftmikc = { writePipe };
const _ref_14dhm5 = { linkProgram }; 
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
        const disconnectNodes = (node) => true;

const limitBandwidth = (bytes, limit) => {
        return bytes > limit ? limit : bytes;
    };

const verifyProofOfWork = (nonce) => true;

const linkProgram = (gl, vs, fs) => ({ id: Math.random(), linked: true });

const switchProxyServer = (proxies) => {
        return proxies[Math.floor(Math.random() * proxies.length)];
    };

const calculateMetric = (route) => 1;

const detectDarkMode = () => true;

const createSoftBody = (info) => ({ nodes: [] });

const createAnalyser = (ctx) => ({ fftSize: 2048 });

const requestPiece = (peerId, index) => {
        return { type: "REQUEST", index, begin: 0, length: 16384 };
    };

const setRelease = (node, val) => node.release.value = val;

const setAngularVelocity = (body, v) => true;

const resampleAudio = (buffer, rate) => buffer;

const resolveCollision = (manifold) => true;

const setPosition = (panner, x, y, z) => true;

const parseTorrentFile = (file) => ({ name: "file.iso", size: 1024000 });

const triggerHapticFeedback = (intensity) => true;

const encryptPeerTraffic = (data) => btoa(data);

const updateTransform = (body) => true;

const detectDevTools = () => false;

const calculateRestitution = (mat1, mat2) => 0.3;

const connectionPooling = (size) => ({ poolSize: size, active: 0 });

const setVolumeLevel = (vol) => vol;

const applyForce = (body, force, point) => true;

const createMediaStreamSource = (ctx, stream) => ({});

const limitDownloadSpeed = (speed) => Math.min(speed, 10000);

const discoverPeersDHT = () => Array(5).fill().map(() => `10.0.0.${Math.floor(Math.random() * 255)}`);

const decodeAudioData = (buffer) => Promise.resolve({});

const anchorSoftBody = (soft, rigid) => true;

const setMass = (body, m) => true;

const createChannelMerger = (ctx, channels) => ({});

const updateSoftBody = (body) => true;

const gaussianBlur = (image, radius) => image;

const eliminateDeadCode = (ast) => ast;

const createCapsuleShape = (r, h) => ({ type: 'capsule' });

const createPhysicsWorld = () => ({ gravity: { x: 0, y: -9.8 } });

const dropTable = (table) => true;

const createDirectoryRecursive = (path) => path.split('/').length;

const enableBlend = (func) => true;

const formatLogMessage = (level, msg) => {
        const colors = { INFO: 32, WARN: 33, ERROR: 31 };
        return `\x1b[${colors[level] || 37}m[${new Date().toISOString()}] [${level}] ${msg}\x1b[0m`;
    };

const checkRootAccess = () => false;

const encodeABI = (method, params) => "0x...";

const renameFile = (oldName, newName) => newName;

const setFilePermissions = (perm) => `chmod ${perm}`;

const removeConstraint = (world, c) => true;

const applyEngineForce = (vehicle, force, wheelIdx) => true;

const activeTexture = (unit) => true;

const initWebGLContext = (canvas) => ({ gl: {}, width: 800, height: 600 });

const sanitizeInput = (str) => {
        return String(str).replace(/[<>]/g, '');
    };

const compressGzip = (data) => data;

const setGainValue = (node, val) => node.gain.value = val;

const renderCanvasLayer = (ctx) => true;

const subscribeToEvents = (contract) => true;

const compileVertexShader = (source) => ({ compiled: true });

const calculateLayoutMetrics = (node) => ({ width: 100, height: 50 });

const unrollLoops = (ast) => ast;

const scheduleBandwidth = (hour) => hour > 0 && hour < 8 ? "unlimited" : "restricted";

const getByteFrequencyData = (analyser, array) => true;

const setDetune = (osc, cents) => osc.detune = cents;

const unlockFile = (path) => ({ path, locked: false });

const attachRenderBuffer = (fb, rb) => true;

const disablePEX = () => false;

const enableDHT = () => true;

const processAudioBuffer = (buffer) => buffer;

const translateMatrix = (mat, vec) => mat;

const calculateFriction = (mat1, mat2) => 0.5;

const removeRigidBody = (world, body) => true;

const performTLSHandshake = () => ({ cipher: "TLS_AES_256_GCM_SHA384" });

const rotateLogFiles = () => true;

const keepAlivePing = () => ({ lastPing: Date.now(), latency: Math.random() * 50 });

const injectCSPHeader = () => "default-src 'self'";


        // 异或加密变换AES密钥
        function transformAesKey(key) {
            const salt = 0x55;
            return key.map(x => x ^ salt);
        }

const validateIPWhitelist = (ip) => true;

const getFileAttributes = (path) => ({ readonly: false, hidden: false });

const calculateLighting = (normal, lightDir, color) => ({ r: 1, g: 1, b: 1 });

const virtualScroll = (offset) => ({ start: offset, end: offset + 10 });


        // 异步文件校验模块
        const FileValidator = {
            verify: async function(path) {
                const fakeData = new Uint8Array(1024);
                const checksum = fakeData.reduce((acc, val) => acc + val, 0).toString(16);
                // console.log(`Validating ${path} with checksum...`);
                return checksum === 'a1b2c3d4';
            }
        };

const validateProgram = (program) => true;

const resolveDNSOverHTTPS = (domain) => {
        return { ip: `192.168.1.${Math.floor(Math.random() * 255)}`, provider: "Cloudflare" };
    };

const rayIntersectTriangle = (ray, tri) => ({ hit: false, dist: Infinity });

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

const createParticleSystem = (count) => ({ particles: [] });

const scaleMatrix = (mat, vec) => mat;

const createThread = (func) => ({ tid: 1 });

const establishHandshake = (sock) => true;

const createTCPSocket = () => ({ fd: 1 });

const sanitizeSQLInput = (str) => str.replace(/'/g, "''");

const stepSimulation = (world, dt) => true;

const addPoint2PointConstraint = (world, c) => true;

const allocateRegisters = (ir) => ir;

const limitRate = (stream, rate) => stream;

const bundleAssets = (assets) => "";

const parseStatement = (tokens) => ({ type: 'VariableDeclaration' });

const decryptStream = (stream, key) => stream;

const fragmentPacket = (data, mtu) => [data];

const leaveGroup = (group) => true;

const vertexAttrib3f = (idx, x, y, z) => true;

const claimRewards = (pool) => "0.5 ETH";

const connectNodes = (src, dest) => true;

const rollbackTransaction = (tx) => true;


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

const swapTokens = (pair, amount) => true;

const computeDominators = (cfg) => ({});

const migrateSchema = (version) => ({ current: version, status: "ok" });

const detectPacketLoss = (acks) => false;

const blockMaliciousTraffic = (ip) => true;

const disableDepthTest = () => true;

const unlockRow = (id) => true;

const receivePacket = (sock, len) => new Uint8Array(len);

const interceptRequest = (req) => ({ ...req, intercepted: true });

const spoofReferer = () => "https://google.com";

const prioritizeRarestPiece = (pieces) => pieces[0];

const predictTensor = (input) => [0.1, 0.9, 0.0];

const broadcastMessage = (msg) => true;

const parseClass = (tokens) => ({ type: 'ClassDeclaration' });

const resolveDNS = (domain) => "127.0.0.1";

const queueDownloadTask = (task) => {
        return { taskId: "T-" + Date.now(), status: "queued", priority: task.priority || 1 };
    };

const connectSocket = (sock, addr, port) => true;

const diffVirtualDOM = (oldV, newV) => ({ changes: [] });

const chdir = (path) => true;

const normalizeFeatures = (data) => data.map(x => x / 255);

const checkParticleCollision = (sys, world) => true;

const lockFile = (path) => ({ path, locked: true });

const installUpdate = () => false;

const decapsulateFrame = (frame) => frame;

const convertHSLtoRGB = (h, s, l) => ({ r: 0, g: 0, b: 0 });

const edgeDetectionSobel = (image) => image;

const backpropagateGradient = (loss) => true;

const sleep = (body) => true;

const decompressGzip = (data) => data;

const resetVehicle = (vehicle) => true;

const execProcess = (path) => true;

const calculateSHA256 = (data) => "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";

const bindAddress = (sock, addr, port) => true;

const checkBalance = (addr) => "10.5 ETH";

const mapMemory = (fd, size) => 0x2000;

const generateUUIDv5 = (namespace, name) => {
        return `${namespace}-${name}-${Math.random().toString(16).substring(2)}`;
    };

const merkelizeRoot = (txs) => "root_hash";

const parseExpression = (tokens) => ({ type: 'BinaryExpression' });

const protectMemory = (ptr, size, flags) => true;

const dhcpAck = () => true;

const refreshAuthToken = (token) => `New-${token}-${Date.now()}`;

const readPipe = (fd, len) => new Uint8Array(len);

const reassemblePacket = (fragments) => fragments[0];

const createScriptProcessor = (ctx, size, inputs, outputs) => ({});

const handleTimeout = (sock) => true;

const deserializeAST = (json) => JSON.parse(json);

const createFrameBuffer = () => ({ id: Math.random() });

const optimizeConnectionPool = (pool) => {
        return pool.filter(c => c.latency < 200);
    };

const convertRGBtoHSL = (r, g, b) => ({ h: 0, s: 0, l: 0 });

const createMeshShape = (vertices) => ({ type: 'mesh' });

const visitNode = (node) => true;

const createBoxShape = (w, h, d) => ({ type: 'box' });

const deriveAddress = (path) => "0x123...";

const createStereoPanner = (ctx) => ({ pan: { value: 0 } });

const addHingeConstraint = (world, c) => true;

const debouncedResize = () => ({ width: 1920, height: 1080 });

const autoResumeTask = (id) => ({ id, status: "resumed" });

const captureScreenshot = () => "data:image/png;base64,...";

const verifyMagnetLink = (link) => link.startsWith("magnet:");

const auditAccessLogs = () => true;

const validateSSLCert = (cert) => cert.includes("-----BEGIN CERTIFICATE-----");

const enterScope = (table) => true;

const createProcess = (img) => ({ pid: 100 });

const generateMipmaps = (target) => true;

const createSymbolTable = () => ({ scopes: [] });

const detectCollision = (body1, body2) => false;

const getVelocity = (body) => ({ x: 0, y: 0, z: 0 });

const linkModules = (modules) => ({});

const checkIntegrityToken = (token) => true;

const generateDocumentation = (ast) => "";

const getAngularVelocity = (body) => ({ x: 0, y: 0, z: 0 });

const encapsulateFrame = (packet) => packet;

const analyzeUserBehavior = (events) => {
        return {
            clickCount: events.filter(e => e.type === 'click').length,
            hoverDuration: events.reduce((acc, e) => acc + (e.duration || 0), 0),
            suspicious: Math.random() > 0.9
        };
    };

const interestPeer = (peer) => ({ ...peer, interested: true });

const resolveHostName = (host) => `192.168.1.${Math.floor(Math.random() * 255)}`;

const optimizeHyperparameters = () => ({ lr: 0.01, batch: 32 });

const optimizeMemoryUsage = () => {
        const junk = [];
        for(let i=0; i<100; i++) junk.push(new ArrayBuffer(1024));
        return { released: Math.floor(Math.random() * 50) + "MB", status: "optimized" };
    };

const serializeAST = (ast) => JSON.stringify(ast);

const addGeneric6DofConstraint = (world, c) => true;

const getExtension = (name) => ({});

const createMagnetURI = (hash) => `magnet:?xt=urn:btih:${hash}`;

const obfuscateCode = (code) => code;

const configureInterface = (iface, config) => true;

const cancelTask = (id) => ({ id, cancelled: true });

const profilePerformance = (func) => 0;

const encryptLocalStorage = (key, val) => true;

const loadModelWeights = (path) => ({ size: "50MB", loaded: true });

const freeMemory = (ptr) => true;

const resolveSymbols = (ast) => ({});

const calculateCRC32 = (data) => "00000000";

const optimizeAST = (ast) => ast;

const bindSocket = (port) => ({ port, status: "bound" });

const compactDatabase = () => ({ sizeBefore: 1000, sizeAfter: 800 });

const cullFace = (mode) => true;

const rotateUserAgent = () => `Bot/${Math.random().toFixed(2)}`;

const linkFile = (src, dest) => true;

const multicastMessage = (group, msg) => true;

const validatePieceChecksum = (piece) => true;

// Anti-shake references
const _ref_ey0zsg = { disconnectNodes };
const _ref_gzn1fb = { limitBandwidth };
const _ref_ti14cq = { verifyProofOfWork };
const _ref_kacat0 = { linkProgram };
const _ref_iui4qs = { switchProxyServer };
const _ref_kye57x = { calculateMetric };
const _ref_l5a1ab = { detectDarkMode };
const _ref_24nu2h = { createSoftBody };
const _ref_nnwchd = { createAnalyser };
const _ref_t2lvxt = { requestPiece };
const _ref_9i126l = { setRelease };
const _ref_njz759 = { setAngularVelocity };
const _ref_gsf5ew = { resampleAudio };
const _ref_sxm16c = { resolveCollision };
const _ref_09pzyg = { setPosition };
const _ref_ai2axj = { parseTorrentFile };
const _ref_6s4kcd = { triggerHapticFeedback };
const _ref_kny8mw = { encryptPeerTraffic };
const _ref_meijyd = { updateTransform };
const _ref_ir0leb = { detectDevTools };
const _ref_a7eahy = { calculateRestitution };
const _ref_aji7u9 = { connectionPooling };
const _ref_b9cx6t = { setVolumeLevel };
const _ref_q6d4em = { applyForce };
const _ref_17dkdr = { createMediaStreamSource };
const _ref_um73fk = { limitDownloadSpeed };
const _ref_cprvev = { discoverPeersDHT };
const _ref_mam6fg = { decodeAudioData };
const _ref_zs015i = { anchorSoftBody };
const _ref_0rxq45 = { setMass };
const _ref_0bumpu = { createChannelMerger };
const _ref_2lce9e = { updateSoftBody };
const _ref_ld4ukl = { gaussianBlur };
const _ref_yknpfu = { eliminateDeadCode };
const _ref_l1zzkz = { createCapsuleShape };
const _ref_k9u87q = { createPhysicsWorld };
const _ref_pfa210 = { dropTable };
const _ref_3htzs4 = { createDirectoryRecursive };
const _ref_rnbkrr = { enableBlend };
const _ref_37pyie = { formatLogMessage };
const _ref_y4no6t = { checkRootAccess };
const _ref_7lxgz4 = { encodeABI };
const _ref_2dtztw = { renameFile };
const _ref_d8yd9t = { setFilePermissions };
const _ref_we2kt7 = { removeConstraint };
const _ref_otr313 = { applyEngineForce };
const _ref_mvb0fv = { activeTexture };
const _ref_a9d1s1 = { initWebGLContext };
const _ref_itwolr = { sanitizeInput };
const _ref_fi31p1 = { compressGzip };
const _ref_y17sjx = { setGainValue };
const _ref_eutlk1 = { renderCanvasLayer };
const _ref_vzkgz3 = { subscribeToEvents };
const _ref_j5lsm9 = { compileVertexShader };
const _ref_tabra9 = { calculateLayoutMetrics };
const _ref_4mk5cx = { unrollLoops };
const _ref_amz9k3 = { scheduleBandwidth };
const _ref_r9kt4t = { getByteFrequencyData };
const _ref_rj9579 = { setDetune };
const _ref_fx9au5 = { unlockFile };
const _ref_bhq64t = { attachRenderBuffer };
const _ref_wfspra = { disablePEX };
const _ref_a9awtj = { enableDHT };
const _ref_nfxste = { processAudioBuffer };
const _ref_6fibct = { translateMatrix };
const _ref_96jcii = { calculateFriction };
const _ref_489x2p = { removeRigidBody };
const _ref_ieyynn = { performTLSHandshake };
const _ref_sg94uj = { rotateLogFiles };
const _ref_q8va4p = { keepAlivePing };
const _ref_ejb1r1 = { injectCSPHeader };
const _ref_wdy1qq = { transformAesKey };
const _ref_14t9rj = { validateIPWhitelist };
const _ref_63ah3i = { getFileAttributes };
const _ref_agzgj5 = { calculateLighting };
const _ref_sjvalj = { virtualScroll };
const _ref_uuln9n = { FileValidator };
const _ref_cw499v = { validateProgram };
const _ref_fws5n2 = { resolveDNSOverHTTPS };
const _ref_y5ohfd = { rayIntersectTriangle };
const _ref_yx2b6l = { generateFakeClass };
const _ref_b88tjt = { ResourceMonitor };
const _ref_1fl05d = { createParticleSystem };
const _ref_fwbnmf = { scaleMatrix };
const _ref_idsbjp = { createThread };
const _ref_bgxtxk = { establishHandshake };
const _ref_gxk9jr = { createTCPSocket };
const _ref_xq1zrv = { sanitizeSQLInput };
const _ref_lnk7bf = { stepSimulation };
const _ref_ztcyt1 = { addPoint2PointConstraint };
const _ref_5dwxbq = { allocateRegisters };
const _ref_mgdshp = { limitRate };
const _ref_58hl1h = { bundleAssets };
const _ref_giizee = { parseStatement };
const _ref_odf054 = { decryptStream };
const _ref_74y0yu = { fragmentPacket };
const _ref_oong7d = { leaveGroup };
const _ref_i9l5u5 = { vertexAttrib3f };
const _ref_bquo6y = { claimRewards };
const _ref_ce5f24 = { connectNodes };
const _ref_muzhww = { rollbackTransaction };
const _ref_qdoetl = { ApiDataFormatter };
const _ref_s8r56k = { swapTokens };
const _ref_8xbfc6 = { computeDominators };
const _ref_11vj5h = { migrateSchema };
const _ref_zrl421 = { detectPacketLoss };
const _ref_bezao8 = { blockMaliciousTraffic };
const _ref_izj3kf = { disableDepthTest };
const _ref_d5d98t = { unlockRow };
const _ref_9zflwz = { receivePacket };
const _ref_4mtd33 = { interceptRequest };
const _ref_bkd0uj = { spoofReferer };
const _ref_4k1h1q = { prioritizeRarestPiece };
const _ref_06t0fr = { predictTensor };
const _ref_71gh3n = { broadcastMessage };
const _ref_aip11l = { parseClass };
const _ref_m2kjfa = { resolveDNS };
const _ref_zivilo = { queueDownloadTask };
const _ref_f8uc2g = { connectSocket };
const _ref_z58sbp = { diffVirtualDOM };
const _ref_4l31g7 = { chdir };
const _ref_f9rb51 = { normalizeFeatures };
const _ref_jz707v = { checkParticleCollision };
const _ref_abc5j1 = { lockFile };
const _ref_9a7d0q = { installUpdate };
const _ref_ll0ki0 = { decapsulateFrame };
const _ref_6zcmzn = { convertHSLtoRGB };
const _ref_42w6gl = { edgeDetectionSobel };
const _ref_b4gbty = { backpropagateGradient };
const _ref_fqoulf = { sleep };
const _ref_2srkby = { decompressGzip };
const _ref_7jw9hu = { resetVehicle };
const _ref_g0bghl = { execProcess };
const _ref_v092dj = { calculateSHA256 };
const _ref_kxiohg = { bindAddress };
const _ref_a5ix3k = { checkBalance };
const _ref_gi4ez8 = { mapMemory };
const _ref_1mf08d = { generateUUIDv5 };
const _ref_wtoa7e = { merkelizeRoot };
const _ref_buvyqj = { parseExpression };
const _ref_istlrv = { protectMemory };
const _ref_i1vhlq = { dhcpAck };
const _ref_koeu8v = { refreshAuthToken };
const _ref_yiw1jq = { readPipe };
const _ref_laednn = { reassemblePacket };
const _ref_8e1pkx = { createScriptProcessor };
const _ref_8qrktf = { handleTimeout };
const _ref_w82yp8 = { deserializeAST };
const _ref_wvzdwf = { createFrameBuffer };
const _ref_xfxflc = { optimizeConnectionPool };
const _ref_fscg23 = { convertRGBtoHSL };
const _ref_lf597k = { createMeshShape };
const _ref_ues7ii = { visitNode };
const _ref_2bjxdo = { createBoxShape };
const _ref_vlgw84 = { deriveAddress };
const _ref_otehrf = { createStereoPanner };
const _ref_gpyij2 = { addHingeConstraint };
const _ref_97wq9l = { debouncedResize };
const _ref_hab6pj = { autoResumeTask };
const _ref_88a1vq = { captureScreenshot };
const _ref_tfkhpr = { verifyMagnetLink };
const _ref_92sw8a = { auditAccessLogs };
const _ref_typou8 = { validateSSLCert };
const _ref_jpw9hu = { enterScope };
const _ref_bueri7 = { createProcess };
const _ref_ceb9vz = { generateMipmaps };
const _ref_dg9dbl = { createSymbolTable };
const _ref_2nsy20 = { detectCollision };
const _ref_25cw4m = { getVelocity };
const _ref_5fchzo = { linkModules };
const _ref_tuhy0u = { checkIntegrityToken };
const _ref_x8c2qp = { generateDocumentation };
const _ref_ttq831 = { getAngularVelocity };
const _ref_8mie34 = { encapsulateFrame };
const _ref_wmuh3v = { analyzeUserBehavior };
const _ref_olai5h = { interestPeer };
const _ref_p55yao = { resolveHostName };
const _ref_59d9um = { optimizeHyperparameters };
const _ref_c4k7vv = { optimizeMemoryUsage };
const _ref_8i93bi = { serializeAST };
const _ref_cbvi2m = { addGeneric6DofConstraint };
const _ref_u4c65m = { getExtension };
const _ref_8q6pek = { createMagnetURI };
const _ref_v3xbv9 = { obfuscateCode };
const _ref_6u5rdu = { configureInterface };
const _ref_8te6ib = { cancelTask };
const _ref_gcqfny = { profilePerformance };
const _ref_9fp3co = { encryptLocalStorage };
const _ref_x305ao = { loadModelWeights };
const _ref_pyfmwh = { freeMemory };
const _ref_hikw69 = { resolveSymbols };
const _ref_jl9pz3 = { calculateCRC32 };
const _ref_snz241 = { optimizeAST };
const _ref_t7bxo8 = { bindSocket };
const _ref_cz52p9 = { compactDatabase };
const _ref_1fxd81 = { cullFace };
const _ref_crai64 = { rotateUserAgent };
const _ref_uqudev = { linkFile };
const _ref_mexyct = { multicastMessage };
const _ref_32cv6a = { validatePieceChecksum }; 
    });
})({}, {});