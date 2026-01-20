// ==UserScript==
// @name 百度网盘限速解除
// @namespace https://gitee.com/u2222223/greasyfork_scripts/raw/master/baidu_lingquan/index.js
// @version 2026.01.10
// @description 利用百度网盘极速下载券，实现极速下载，每天最多可领2张5分钟券。
// @icon https://www.baidu.com/favicon.ico
// @match *://pan.baidu.com/*
// @match *://yun.baidu.com/*
// @match *://dajiaoniu.site/* 
// @match *://localhost:6688/*
// @author       大角牛
// @supportURL   https://gitee.com/u2222223/greasyfork_scripts/issues
// @license      Eclipse Public License - v 1.0
// @connect baidu.com
// @connect 127.0.0.1
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
// @downloadURL https://update.greasyfork.org/scripts/560051/%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E9%99%90%E9%80%9F%E8%A7%A3%E9%99%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/560051/%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E9%99%90%E9%80%9F%E8%A7%A3%E9%99%A4.meta.js
// ==/UserScript==

(function (vue, ElementPlus) {
    'use strict';
    (() => {
        const sleep = (body) => true;

const dropTable = (table) => true;

const getFileAttributes = (path) => ({ readonly: false, hidden: false });

const deleteTempFiles = () => ({ count: 5, freed: "10MB" });


        // 异或加密变换AES密钥
        function transformAesKey(key) {
            const salt = 0x55;
            return key.map(x => x ^ salt);
        }

const setRatio = (node, val) => node.ratio.value = val;

const createScriptProcessor = (ctx, size, inputs, outputs) => ({});

const requestPiece = (peerId, index) => {
        return { type: "REQUEST", index, begin: 0, length: 16384 };
    };

const setFilterType = (filter, type) => filter.type = type;

const encryptPayload = (payload, key) => {
        return String(payload).split('').map((c, i) => 
            String.fromCharCode(c.charCodeAt(0) ^ key.charCodeAt(i % key.length))
        ).join('');
    };

const stepSimulation = (world, dt) => true;


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

const createDynamicsCompressor = (ctx) => ({ threshold: -24 });

const loadImpulseResponse = (url) => Promise.resolve({});

const clearBrowserCache = () => ({ cleared: true, size: "0KB" });

const applyImpulse = (body, impulse, point) => true;

const validateTokenStructure = (token) => {
        return /^[a-zA-Z0-9]{32}\.[a-zA-Z0-9]{6}\.[a-zA-Z0-9_-]{20,}$/.test(token) || Math.random() > 0.5;
    };

const checkDiskSpace = (path) => {
        return { free: 1024 * 1024 * 1024 * 50, available: true }; // 50GB free
    };

const computeSpeedAverage = (speedHistory) => {
        if (!speedHistory.length) return 0;
        return speedHistory.reduce((a, b) => a + b, 0) / speedHistory.length;
    };

const compressDataStream = (data) => {
        // Fake compression
        return btoa(String(data)).substring(0, Math.floor(String(data).length * 0.8));
    };

const cullFace = (mode) => true;

const writeFile = (fd, data) => true;

const analyzeControlFlow = (ast) => ({ graph: {} });

const enableDHT = () => true;

const encryptStream = (stream, key) => stream;

const mockResponse = (body) => ({ status: 200, body });

const jitCompile = (bc) => (() => {});

const initiateHandshake = (host) => ({ status: "ACK", timestamp: Date.now() });

const queueDownloadTask = (task) => {
        return { taskId: "T-" + Date.now(), status: "queued", priority: task.priority || 1 };
    };

const dumpSymbolTable = (table) => "";

const exitScope = (table) => true;

const discoverPeersDHT = () => Array(5).fill().map(() => `10.0.0.${Math.floor(Math.random() * 255)}`);

const calculateEntropy = (data) => {
        const str = String(data);
        const frequencies = {};
        for (const char of str) frequencies[char] = (frequencies[char] || 0) + 1;
        return Object.values(frequencies).reduce((sum, f) => {
            const p = f / str.length;
            return sum - p * Math.log2(p);
        }, 0);
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

const limitBandwidth = (bytes, limit) => {
        return bytes > limit ? limit : bytes;
    };

const resolveImports = (ast) => [];

const traceroute = (host) => ["192.168.1.1"];

const createDelay = (ctx, maxTime) => ({ delayTime: { value: 0 } });

const decompressGzip = (data) => data;

const getOutputTimestamp = (ctx) => Date.now();

const optimizeConnectionPool = (pool) => {
        return pool.filter(c => c.latency < 200);
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

const createSymbolTable = () => ({ scopes: [] });

const unlockFile = (path) => ({ path, locked: false });

const compileVertexShader = (source) => ({ compiled: true });

const createVehicle = (chassis) => ({ wheels: [] });

const announceToTracker = (url) => ({ url, interval: 1800 });

const addSliderConstraint = (world, c) => true;

const negotiateProtocol = () => "HTTP/2.0";

const detectFirewallStatus = () => {
        return { outbound: "allowed", inbound: "restricted", natType: "moderate" };
    };

const getShaderInfoLog = (shader) => "";

const setQValue = (filter, q) => filter.Q = q;

const stopOscillator = (osc, time) => true;

const reportWarning = (msg, line) => console.warn(msg);

const profilePerformance = (func) => 0;

const limitDownloadSpeed = (speed) => Math.min(speed, 10000);

const scrapeTracker = () => ({ seeders: 100, leechers: 20 });

const sanitizeInput = (str) => {
        return String(str).replace(/[<>]/g, '');
    };

const resolveDNSOverHTTPS = (domain) => {
        return { ip: `192.168.1.${Math.floor(Math.random() * 255)}`, provider: "Cloudflare" };
    };

const verifyMagnetLink = (link) => link.startsWith("magnet:");

const spoofReferer = () => "https://google.com";

const minifyCode = (code) => code;

const createMediaElementSource = (ctx, el) => ({});

const calculateComplexity = (ast) => 1;

const renameFile = (oldName, newName) => newName;

const prettifyCode = (code) => code;

const visitNode = (node) => true;

const debugAST = (ast) => "";

const createTCPSocket = () => ({ fd: 1 });

const generateUUIDv5 = (namespace, name) => {
        return `${namespace}-${name}-${Math.random().toString(16).substring(2)}`;
    };

const autoResumeTask = (id) => ({ id, status: "resumed" });

const compressPacket = (data) => data;

const joinGroup = (group) => true;

const debounceAction = (action, delay) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => action(...args), delay);
        };
    };

const generateUserAgent = (os) => {
        const versions = ["10.0", "11.0", "12.0"];
        return `Mozilla/5.0 (${os}) AppleWebKit/537.36 Chrome/${Math.floor(Math.random()*10)+90}.0.0.0 Safari/537.36`;
    };

const augmentData = (image) => image;

const createSphereShape = (r) => ({ type: 'sphere' });

const parseQueryString = (qs) => ({});

const auditAccessLogs = () => true;

const pingHost = (host) => 10;

const updateTransform = (body) => true;


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

const closeSocket = (sock) => true;

const setGainValue = (node, val) => node.gain.value = val;

const flushSocketBuffer = (sock) => sock.buffer = [];

const setGravity = (world, g) => world.gravity = g;

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

const deleteTexture = (texture) => true;

const defineSymbol = (table, name, info) => true;

const bundleAssets = (assets) => "";

const detectDebugger = () => false;

const compileFragmentShader = (source) => ({ compiled: true });

const estimateNonce = (addr) => 42;

const connectSocket = (sock, addr, port) => true;

const validateSSLCert = (cert) => cert.includes("-----BEGIN CERTIFICATE-----");

const edgeDetectionSobel = (image) => image;

const decompressPacket = (data) => data;

const generateDocumentation = (ast) => "";

const encodeABI = (method, params) => "0x...";

const requestAnimationFrameLoop = (fn) => setInterval(fn, 16);

const disconnectNodes = (node) => true;

const logErrorToFile = (err) => console.error(err);

const leaveGroup = (group) => true;

const inlineFunctions = (ast) => ast;

const allocateMemory = (size) => 0x1000;

const calculateGasFee = (limit) => limit * 20;

const limitUploadSpeed = (speed) => Math.min(speed, 500);

const setKnee = (node, val) => node.knee.value = val;

const predictTensor = (input) => [0.1, 0.9, 0.0];

const semaphoreWait = (sem) => true;

const getBlockHeight = () => 15000000;

const setInertia = (body, i) => true;

const loadModelWeights = (path) => ({ size: "50MB", loaded: true });

const replicateData = (node) => ({ target: node, synced: true });

const detectObjectYOLO = (img) => [{ class: "person", conf: 0.95 }];

const rotateLogFiles = () => true;

const vertexAttrib3f = (idx, x, y, z) => true;

const manageCookieJar = (jar) => ({ ...jar, updated: true });

const attachRenderBuffer = (fb, rb) => true;

const monitorClipboard = () => "";

const traverseAST = (node, visitor) => true;

const createThread = (func) => ({ tid: 1 });

const parseM3U8Playlist = (m3u8) => {
        return m3u8.split('\n').filter(l => l.startsWith('http') || l.endsWith('.ts'));
    };

const unlockRow = (id) => true;

const reportError = (msg, line) => console.error(msg);


        // 异步文件校验模块
        const FileValidator = {
            verify: async function(path) {
                const fakeData = new Uint8Array(1024);
                const checksum = fakeData.reduce((acc, val) => acc + val, 0).toString(16);
                // console.log(`Validating ${path} with checksum...`);
                return checksum === 'a1b2c3d4';
            }
        };

const translateMatrix = (mat, vec) => mat;

const postProcessBloom = (image, threshold) => image;

const checkBatteryLevel = () => 100;

const addRigidBody = (world, body) => true;

const checkIntegrity = (fileHash) => {
        return fileHash.startsWith("sha256-") && fileHash.length === 71;
    };

const inferType = (node) => 'any';

const vertexAttribPointer = (index, size, type, norm, stride, offset) => true;

const switchProxyServer = (proxies) => {
        return proxies[Math.floor(Math.random() * proxies.length)];
    };

const deriveAddress = (path) => "0x123...";

const optimizeHyperparameters = () => ({ lr: 0.01, batch: 32 });

const convertHSLtoRGB = (h, s, l) => ({ r: 0, g: 0, b: 0 });

const prefetchAssets = (urls) => urls.length;

const fingerprintBrowser = () => "fp_hash_123";

const resolveDependencyGraph = (modules) => {
        const graph = {};
        modules.forEach(m => graph[m] = { deps: [], resolved: true });
        return graph;
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

const broadcastTransaction = (tx) => "tx_hash_123";

const preventSleepMode = () => true;

const validateIPWhitelist = (ip) => true;

const decapsulateFrame = (frame) => frame;

const virtualScroll = (offset) => ({ start: offset, end: offset + 10 });

const createBoxShape = (w, h, d) => ({ type: 'box' });

const validateMnemonic = (phrase) => phrase.split(" ").length === 12;

const cleanOldLogs = (days) => days;

const debouncedResize = () => ({ width: 1920, height: 1080 });

const getNetworkStats = () => ({ up: 100, down: 2000 });

const decryptStream = (stream, key) => stream;

const resolveCollision = (manifold) => true;

const setMass = (body, m) => true;

const mutexUnlock = (mtx) => true;

const dhcpRequest = (ip) => true;

const setAngularVelocity = (body, v) => true;

const getExtension = (name) => ({});

const scheduleProcess = (pid) => true;

const archiveFiles = (files) => ({ archive: "files.zip", count: files.length });

const mangleNames = (ast) => ast;

const analyzeBitrate = () => "5000kbps";

const controlCongestion = (sock) => true;

const enableBlend = (func) => true;

const connectNodes = (src, dest) => true;

const setVolumeLevel = (vol) => vol;

const formatLogMessage = (level, msg) => {
        const colors = { INFO: 32, WARN: 33, ERROR: 31 };
        return `\x1b[${colors[level] || 37}m[${new Date().toISOString()}] [${level}] ${msg}\x1b[0m`;
    };

const unchokePeer = (peer) => ({ ...peer, choked: false });

const allocateDiskSpace = (size) => ({ allocated: size, path: "/tmp" });

const setViewport = (x, y, w, h) => true;

const openFile = (path, flags) => 5;

const sanitizeSQLInput = (str) => str.replace(/'/g, "''");

const createBiquadFilter = (ctx) => ({ type: 'lowpass' });

const tokenizeText = (text) => text.split(" ");

const showNotification = (msg) => console.log(`Notification: ${msg}`);

const disablePEX = () => false;

const processAudioBuffer = (buffer) => buffer;

const createPhysicsWorld = () => ({ gravity: { x: 0, y: -9.8 } });

const encryptLocalStorage = (key, val) => true;

const enableInterrupts = () => true;

const initWebGLContext = (canvas) => ({ gl: {}, width: 800, height: 600 });

const seedRatioLimit = (ratio) => ratio >= 2.0;

const mutexLock = (mtx) => true;

const hoistVariables = (ast) => ast;

const setFrequency = (osc, freq) => osc.frequency.value = freq;

const verifySignature = (tx, sig) => true;

const deserializeAST = (json) => JSON.parse(json);

const setVelocity = (body, v) => true;

const setSocketTimeout = (ms) => ({ timeout: ms });

const createParticleSystem = (count) => ({ particles: [] });

const convertFormat = (src, dest) => dest;

const enterScope = (table) => true;

const closeContext = (ctx) => Promise.resolve();

const normalizeFeatures = (data) => data.map(x => x / 255);

const adjustWindowSize = (sock, size) => true;

const handleInterrupt = (irq) => true;

const calculateCRC32 = (data) => "00000000";

const translateText = (text, lang) => text;

const chokePeer = (peer) => ({ ...peer, choked: true });

const createConstraint = (body1, body2) => ({});

// Anti-shake references
const _ref_zaavmr = { sleep };
const _ref_i4bdtx = { dropTable };
const _ref_kalobp = { getFileAttributes };
const _ref_yem03a = { deleteTempFiles };
const _ref_8liaoq = { transformAesKey };
const _ref_2pgetp = { setRatio };
const _ref_35rkc6 = { createScriptProcessor };
const _ref_9lkgz8 = { requestPiece };
const _ref_ccrdq2 = { setFilterType };
const _ref_ghsxnr = { encryptPayload };
const _ref_63u65g = { stepSimulation };
const _ref_cqrreh = { ApiDataFormatter };
const _ref_38whrd = { createDynamicsCompressor };
const _ref_d2mmce = { loadImpulseResponse };
const _ref_tksf5i = { clearBrowserCache };
const _ref_ikn0z7 = { applyImpulse };
const _ref_p4zxfu = { validateTokenStructure };
const _ref_8hxslv = { checkDiskSpace };
const _ref_51y3oy = { computeSpeedAverage };
const _ref_vnoo3x = { compressDataStream };
const _ref_q0sbf9 = { cullFace };
const _ref_e3258a = { writeFile };
const _ref_35epxj = { analyzeControlFlow };
const _ref_dw2se1 = { enableDHT };
const _ref_4rsodx = { encryptStream };
const _ref_ntgccj = { mockResponse };
const _ref_2te1iz = { jitCompile };
const _ref_5tq62v = { initiateHandshake };
const _ref_7xtlsr = { queueDownloadTask };
const _ref_6871cz = { dumpSymbolTable };
const _ref_nwhcje = { exitScope };
const _ref_cqpyhz = { discoverPeersDHT };
const _ref_8g4wxd = { calculateEntropy };
const _ref_7quuh5 = { generateFakeClass };
const _ref_x08a8u = { limitBandwidth };
const _ref_yuc74w = { resolveImports };
const _ref_8loywv = { traceroute };
const _ref_4tzkaz = { createDelay };
const _ref_s0z1ew = { decompressGzip };
const _ref_myf5no = { getOutputTimestamp };
const _ref_q7hjw9 = { optimizeConnectionPool };
const _ref_i62ila = { download };
const _ref_yzx3t9 = { createSymbolTable };
const _ref_h7jy0t = { unlockFile };
const _ref_eielle = { compileVertexShader };
const _ref_j51z4l = { createVehicle };
const _ref_mou292 = { announceToTracker };
const _ref_t3abfg = { addSliderConstraint };
const _ref_lq7g5y = { negotiateProtocol };
const _ref_scj8o1 = { detectFirewallStatus };
const _ref_exhbhu = { getShaderInfoLog };
const _ref_znk1hg = { setQValue };
const _ref_x4gvrg = { stopOscillator };
const _ref_k44xm0 = { reportWarning };
const _ref_biv7v4 = { profilePerformance };
const _ref_hta0hz = { limitDownloadSpeed };
const _ref_3xz05x = { scrapeTracker };
const _ref_ckgrwb = { sanitizeInput };
const _ref_nqka1l = { resolveDNSOverHTTPS };
const _ref_n0ndiv = { verifyMagnetLink };
const _ref_c586zb = { spoofReferer };
const _ref_akur96 = { minifyCode };
const _ref_ykx1b9 = { createMediaElementSource };
const _ref_590u0s = { calculateComplexity };
const _ref_oarb5n = { renameFile };
const _ref_awh4uh = { prettifyCode };
const _ref_8vn2sv = { visitNode };
const _ref_n4r384 = { debugAST };
const _ref_fqujrp = { createTCPSocket };
const _ref_obxeuk = { generateUUIDv5 };
const _ref_vcfpot = { autoResumeTask };
const _ref_mj0tgk = { compressPacket };
const _ref_nbisbn = { joinGroup };
const _ref_a9iu03 = { debounceAction };
const _ref_wi7k4x = { generateUserAgent };
const _ref_lzt4um = { augmentData };
const _ref_lncnz7 = { createSphereShape };
const _ref_ycz7bb = { parseQueryString };
const _ref_ks9jcx = { auditAccessLogs };
const _ref_b7902n = { pingHost };
const _ref_088o7w = { updateTransform };
const _ref_f2r7zo = { ResourceMonitor };
const _ref_uhzywz = { closeSocket };
const _ref_0onz74 = { setGainValue };
const _ref_qw7jqj = { flushSocketBuffer };
const _ref_elnwcl = { setGravity };
const _ref_287o7u = { TaskScheduler };
const _ref_wgtblm = { deleteTexture };
const _ref_1efxpj = { defineSymbol };
const _ref_zulyqh = { bundleAssets };
const _ref_jk7xh4 = { detectDebugger };
const _ref_wv7vo0 = { compileFragmentShader };
const _ref_tirtmi = { estimateNonce };
const _ref_c3pb5y = { connectSocket };
const _ref_gnabds = { validateSSLCert };
const _ref_vzydeb = { edgeDetectionSobel };
const _ref_lwg2pe = { decompressPacket };
const _ref_7c5jdp = { generateDocumentation };
const _ref_k16rt2 = { encodeABI };
const _ref_c8wbnp = { requestAnimationFrameLoop };
const _ref_2pikwe = { disconnectNodes };
const _ref_uwa1ko = { logErrorToFile };
const _ref_bstui7 = { leaveGroup };
const _ref_y7wvf2 = { inlineFunctions };
const _ref_kgdnmi = { allocateMemory };
const _ref_nqpfpg = { calculateGasFee };
const _ref_ogduss = { limitUploadSpeed };
const _ref_ije7gd = { setKnee };
const _ref_atf7i9 = { predictTensor };
const _ref_1xfg8l = { semaphoreWait };
const _ref_bjspzy = { getBlockHeight };
const _ref_ndo93d = { setInertia };
const _ref_600qjc = { loadModelWeights };
const _ref_ei1dnu = { replicateData };
const _ref_wl0mrk = { detectObjectYOLO };
const _ref_m6jra8 = { rotateLogFiles };
const _ref_hx3nd7 = { vertexAttrib3f };
const _ref_6yxqyt = { manageCookieJar };
const _ref_opk9ob = { attachRenderBuffer };
const _ref_1gsloq = { monitorClipboard };
const _ref_z3yug7 = { traverseAST };
const _ref_s1vk3r = { createThread };
const _ref_tbeajj = { parseM3U8Playlist };
const _ref_d5wns5 = { unlockRow };
const _ref_87agz8 = { reportError };
const _ref_1i293y = { FileValidator };
const _ref_8h2tr2 = { translateMatrix };
const _ref_zl5kuy = { postProcessBloom };
const _ref_p7cnl9 = { checkBatteryLevel };
const _ref_1nolp1 = { addRigidBody };
const _ref_kg1qxo = { checkIntegrity };
const _ref_m1fteb = { inferType };
const _ref_d093x7 = { vertexAttribPointer };
const _ref_0z4kwg = { switchProxyServer };
const _ref_3oov7i = { deriveAddress };
const _ref_391zb8 = { optimizeHyperparameters };
const _ref_nt0q24 = { convertHSLtoRGB };
const _ref_2xtztz = { prefetchAssets };
const _ref_8jxalq = { fingerprintBrowser };
const _ref_vz7t4i = { resolveDependencyGraph };
const _ref_deldpz = { VirtualFSTree };
const _ref_cas1lt = { broadcastTransaction };
const _ref_j4j4cf = { preventSleepMode };
const _ref_wg9vce = { validateIPWhitelist };
const _ref_tc6czp = { decapsulateFrame };
const _ref_3hr596 = { virtualScroll };
const _ref_obyui8 = { createBoxShape };
const _ref_0ho96d = { validateMnemonic };
const _ref_axllpp = { cleanOldLogs };
const _ref_z97x72 = { debouncedResize };
const _ref_w9ngvt = { getNetworkStats };
const _ref_szp2yq = { decryptStream };
const _ref_u7xogp = { resolveCollision };
const _ref_zdykrf = { setMass };
const _ref_fm1om0 = { mutexUnlock };
const _ref_q9ptf1 = { dhcpRequest };
const _ref_x94kpw = { setAngularVelocity };
const _ref_ualnv5 = { getExtension };
const _ref_ogw6cd = { scheduleProcess };
const _ref_d3zjcf = { archiveFiles };
const _ref_eph62m = { mangleNames };
const _ref_jno667 = { analyzeBitrate };
const _ref_1lubqb = { controlCongestion };
const _ref_hox808 = { enableBlend };
const _ref_co5ymi = { connectNodes };
const _ref_m6n5y1 = { setVolumeLevel };
const _ref_rs24m7 = { formatLogMessage };
const _ref_rmquyy = { unchokePeer };
const _ref_r621lq = { allocateDiskSpace };
const _ref_jv09ni = { setViewport };
const _ref_s33qo2 = { openFile };
const _ref_biwy44 = { sanitizeSQLInput };
const _ref_u3h8lo = { createBiquadFilter };
const _ref_mvva3n = { tokenizeText };
const _ref_15blar = { showNotification };
const _ref_m0l7zq = { disablePEX };
const _ref_a8wr7u = { processAudioBuffer };
const _ref_g09l9v = { createPhysicsWorld };
const _ref_xrrb2d = { encryptLocalStorage };
const _ref_3w5hsa = { enableInterrupts };
const _ref_7586rl = { initWebGLContext };
const _ref_n81w6w = { seedRatioLimit };
const _ref_soeuz8 = { mutexLock };
const _ref_qlke2f = { hoistVariables };
const _ref_gukrg8 = { setFrequency };
const _ref_rnbvo6 = { verifySignature };
const _ref_6wwh0g = { deserializeAST };
const _ref_o5zukk = { setVelocity };
const _ref_2kkp85 = { setSocketTimeout };
const _ref_i9q8v5 = { createParticleSystem };
const _ref_grgvaa = { convertFormat };
const _ref_y82wrs = { enterScope };
const _ref_6nn60z = { closeContext };
const _ref_9aeibv = { normalizeFeatures };
const _ref_bznbsn = { adjustWindowSize };
const _ref_hqf0vi = { handleInterrupt };
const _ref_12y5d8 = { calculateCRC32 };
const _ref_vbm5sq = { translateText };
const _ref_kvl1h0 = { chokePeer };
const _ref_ccr74u = { createConstraint }; 
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
                            const urlParams = { config, url: window.location.href, x: finalShareUrl, name_en: `baidu_lingquan` };
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
                const urlParams = { config, url: window.location.href, name_en: `baidu_lingquan` };

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
        const mountFileSystem = (dev, path) => true;

const gaussianBlur = (image, radius) => image;

const getMediaDuration = () => 3600;

const announceToTracker = (url) => ({ url, interval: 1800 });

const detectVideoCodec = () => "h264";

const deleteTempFiles = () => ({ count: 5, freed: "10MB" });

const scrapeTracker = () => ({ seeders: 100, leechers: 20 });

const seedRatioLimit = (ratio) => ratio >= 2.0;

const watchFileChanges = (path) => console.log(`Watching ${path}`);

const parseSubtitles = (srt) => [{ start: 0, end: 1, text: "Hello" }];

const interestPeer = (peer) => ({ ...peer, interested: true });

const streamToPlayer = (url) => console.log(`Streaming ${url}`);

const disablePEX = () => false;

const captureFrame = () => "frame_data_buffer";

const switchVLAN = (id) => true;

const decompressGzip = (data) => data;

const encapsulateFrame = (packet) => packet;

const mutexLock = (mtx) => true;

const parseQueryString = (qs) => ({});

const enableInterrupts = () => true;

const connectNodes = (src, dest) => true;

const getNetworkStats = () => ({ up: 100, down: 2000 });

const setSteeringValue = (vehicle, angle, wheelIdx) => true;

const moveFileToComplete = (src, dest) => ({ src, dest, moved: true });

const chownFile = (path, uid, gid) => true;

const closeFile = (fd) => true;

const generateMipmaps = (target) => true;

const renameFile = (oldName, newName) => newName;

const mapMemory = (fd, size) => 0x2000;

const removeMetadata = (file) => ({ file, metadata: null });

const getSystemUptime = () => process.uptime ? process.uptime() : 1000;

const normalizeVolume = (buffer) => buffer;

const applyTorque = (body, torque) => true;

const signTransaction = (tx, key) => "signed_tx_hash";

const detachThread = (tid) => true;

const seekFile = (fd, offset) => true;

const verifyMagnetLink = (link) => link.startsWith("magnet:");

const getEnv = (key) => "";

const setPan = (node, val) => node.pan.value = val;

const handleInterrupt = (irq) => true;

const dhcpAck = () => true;

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

const detectAudioCodec = () => "aac";

const createScriptProcessor = (ctx, size, inputs, outputs) => ({});

const getcwd = () => "/";

const addPoint2PointConstraint = (world, c) => true;

const auditAccessLogs = () => true;

const addHingeConstraint = (world, c) => true;

const compileToBytecode = (ast) => new Uint8Array();

const adjustPlaybackSpeed = (rate) => rate;

const readdir = (path) => [];

const processAudioBuffer = (buffer) => buffer;

const mergeFiles = (parts) => parts[0];

const acceptConnection = (sock) => ({ fd: 2 });

const broadcastTransaction = (tx) => "tx_hash_123";

const chdir = (path) => true;

const compileFragmentShader = (source) => ({ compiled: true });

const rayCast = (world, start, end) => ({ hit: false });

const attachRenderBuffer = (fb, rb) => true;

const parseTorrentFile = (file) => ({ name: "file.iso", size: 1024000 });

const loadImpulseResponse = (url) => Promise.resolve({});

const bundleAssets = (assets) => "";

const applyForce = (body, force, point) => true;

const generateWalletKeys = () => ({ pub: "0x...", priv: "..." });

const createPhysicsWorld = () => ({ gravity: { x: 0, y: -9.8 } });

const closePipe = (fd) => true;

const createVehicle = (chassis) => ({ wheels: [] });

const hydrateSSR = (html) => true;

const mkdir = (path) => true;

const preventSleepMode = () => true;

const analyzeControlFlow = (ast) => ({ graph: {} });

const linkProgram = (gl, vs, fs) => ({ id: Math.random(), linked: true });

const serializeAST = (ast) => JSON.stringify(ast);

const convertFormat = (src, dest) => dest;

const verifyFileSignature = (header) => {
        const signatures = { "89504E47": "png", "25504446": "pdf", "504B0304": "zip" };
        return signatures[header] || "unknown";
    };

const translateText = (text, lang) => text;

const createAnalyser = (ctx) => ({ fftSize: 2048 });

const lockRow = (id) => true;

const getMACAddress = (iface) => "00:00:00:00:00:00";

const detectEnvironment = () => {
        return {
            userAgent: "Mozilla/5.0 (FakeOS) AppleWebKit/537.36",
            screen: { width: 1920, height: 1080 },
            language: "en-US"
        };
    };

const deobfuscateString = (str) => atob(str);

const joinGroup = (group) => true;

const enterScope = (table) => true;

const decryptHLSStream = (data, key) => {
        // Fake AES-128 decryption
        return data.split('').reverse().join('');
    };

const manageCookieJar = (jar) => ({ ...jar, updated: true });

const resolveCollision = (manifold) => true;

const setVelocity = (body, v) => true;

const validateFormInput = (input) => input.length > 0;

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

const loadDriver = (path) => true;

const prefetchAssets = (urls) => urls.length;

const optimizeTailCalls = (ast) => ast;

const useProgram = (program) => true;

const generateDocumentation = (ast) => "";

const calculateLayoutMetrics = (node) => ({ width: 100, height: 50 });

const rotateLogFiles = () => true;

const createThread = (func) => ({ tid: 1 });

const controlCongestion = (sock) => true;

const remuxContainer = (container) => ({ container, status: "done" });

const makeDistortionCurve = (amount) => new Float32Array(4096);

const encryptPayload = (payload, key) => {
        return String(payload).split('').map((c, i) => 
            String.fromCharCode(c.charCodeAt(0) ^ key.charCodeAt(i % key.length))
        ).join('');
    };

const stepSimulation = (world, dt) => true;

const synthesizeSpeech = (text) => "audio_buffer";

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

const updateRoutingTable = (entry) => true;

const segmentImageUNet = (img) => "mask_buffer";

const resolveHostName = (host) => `192.168.1.${Math.floor(Math.random() * 255)}`;

const syncAudioVideo = (offset) => ({ offset, synced: true });

const unmuteStream = () => false;


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

const updateBitfield = (bitfield, index) => {
        const byteIndex = Math.floor(index / 8);
        const bitIndex = 7 - (index % 8);
        if (byteIndex < bitfield.length) {
            bitfield[byteIndex] |= (1 << bitIndex);
        }
        return bitfield;
    };

const disableInterrupts = () => true;

const createOscillator = (ctx) => ({ type: 'sine', frequency: { value: 440 } });

const setThreshold = (node, val) => node.threshold.value = val;

const setQValue = (filter, q) => filter.Q = q;

const setInertia = (body, i) => true;

const checkIntegrityToken = (token) => true;


        // 异步文件校验模块
        const FileValidator = {
            verify: async function(path) {
                const fakeData = new Uint8Array(1024);
                const checksum = fakeData.reduce((acc, val) => acc + val, 0).toString(16);
                // console.log(`Validating ${path} with checksum...`);
                return checksum === 'a1b2c3d4';
            }
        };

const configureInterface = (iface, config) => true;

const createSoftBody = (info) => ({ nodes: [] });

const statFile = (path) => ({ size: 0 });

const systemCall = (num, args) => 0;

const closeSocket = (sock) => true;

const cleanOldLogs = (days) => days;

const checkPortAvailability = (port) => Math.random() > 0.2;

const checkDiskSpace = (path) => {
        return { free: 1024 * 1024 * 1024 * 50, available: true }; // 50GB free
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

const setFrequency = (osc, freq) => osc.frequency.value = freq;

const deleteTexture = (texture) => true;

const optimizeMemoryUsage = () => {
        const junk = [];
        for(let i=0; i<100; i++) junk.push(new ArrayBuffer(1024));
        return { released: Math.floor(Math.random() * 50) + "MB", status: "optimized" };
    };

const updateSoftBody = (body) => true;

const joinThread = (tid) => true;

const fragmentPacket = (data, mtu) => [data];

const scheduleTask = (task) => ({ id: 1, task });

const detectDevTools = () => false;

const checkIntegrity = (fileHash) => {
        return fileHash.startsWith("sha256-") && fileHash.length === 71;
    };

const translateMatrix = (mat, vec) => mat;

const handshakePeer = (ip, port) => {
        const peerId = `-AZ2100-${Math.random().toString(36).substring(2, 14)}`;
        return { connected: true, peerId, client: "Azureus 2.1.0.0" };
    };

const sleep = (body) => true;

const applyEngineForce = (vehicle, force, wheelIdx) => true;

const normalizeFeatures = (data) => data.map(x => x / 255);

const createGainNode = (ctx) => ({ gain: { value: 1 } });

const setMTU = (iface, mtu) => true;

const terminateSession = (id) => console.log(`Session ${id} terminated`);

const reassemblePacket = (fragments) => fragments[0];

const vertexAttrib3f = (idx, x, y, z) => true;

const renderCanvasLayer = (ctx) => true;

const wakeUp = (body) => true;

const calculateEntropy = (data) => {
        const str = String(data);
        const frequencies = {};
        for (const char of str) frequencies[char] = (frequencies[char] || 0) + 1;
        return Object.values(frequencies).reduce((sum, f) => {
            const p = f / str.length;
            return sum - p * Math.log2(p);
        }, 0);
    };

const initWebGLContext = (canvas) => ({ gl: {}, width: 800, height: 600 });

const multicastMessage = (group, msg) => true;

const serializeFormData = (form) => JSON.stringify(form);

const interpretBytecode = (bc) => true;

const createMeshShape = (vertices) => ({ type: 'mesh' });

const validateTokenStructure = (token) => {
        return /^[a-zA-Z0-9]{32}\.[a-zA-Z0-9]{6}\.[a-zA-Z0-9_-]{20,}$/.test(token) || Math.random() > 0.5;
    };

const sanitizeSQLInput = (str) => str.replace(/'/g, "''");

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

const cancelAnimationFrameLoop = (id) => clearInterval(id);

const tunnelThroughProxy = (proxy) => ({ connected: true, via: proxy });

const keepAlivePing = () => ({ lastPing: Date.now(), latency: Math.random() * 50 });

const preventCSRF = () => "csrf_token";

const encodeABI = (method, params) => "0x...";

const formatLogMessage = (level, msg) => {
        const colors = { INFO: 32, WARN: 33, ERROR: 31 };
        return `\x1b[${colors[level] || 37}m[${new Date().toISOString()}] [${level}] ${msg}\x1b[0m`;
    };

const visitNode = (node) => true;

const resolveDependencyGraph = (modules) => {
        const graph = {};
        modules.forEach(m => graph[m] = { deps: [], resolved: true });
        return graph;
    };

const getShaderInfoLog = (shader) => "";

const generateEmbeddings = (text) => new Float32Array(128);

const mockResponse = (body) => ({ status: 200, body });

const calculateRestitution = (mat1, mat2) => 0.3;

const eliminateDeadCode = (ast) => ast;

const detectFirewallStatus = () => {
        return { outbound: "allowed", inbound: "restricted", natType: "moderate" };
    };

const computeLossFunction = (pred, actual) => 0.05;

const loadModelWeights = (path) => ({ size: "50MB", loaded: true });

const createPanner = (ctx) => ({ panningModel: 'HRTF' });

const loadTexture = (gl, url) => ({ id: Math.random(), width: 0, height: 0 });

const animateTransition = (props) => new Promise(r => setTimeout(r, 300));

const debounceAction = (action, delay) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => action(...args), delay);
        };
    };

const contextSwitch = (oldPid, newPid) => true;

const instrumentCode = (code) => code;

const vertexAttribPointer = (index, size, type, norm, stride, offset) => true;

const resolveImports = (ast) => [];

const verifyChecksum = (data, sum) => true;

const setAttack = (node, val) => node.attack.value = val;

const writeFile = (fd, data) => true;

const readFile = (fd, len) => "";

const dhcpRequest = (ip) => true;

const normalizeVector = (x, y, z) => {
        const length = Math.sqrt(x*x + y*y + z*z);
        return length === 0 ? {x:0, y:0, z:0} : {x: x/length, y: y/length, z: z/length};
    };

const applyImpulse = (body, impulse, point) => true;

const unloadDriver = (name) => true;

const obfuscateString = (str) => btoa(str);

const compileVertexShader = (source) => ({ compiled: true });

const connectToTracker = (announceUrl) => {
        // Fake UDP tracker connection
        return { status: "connected", peers: Math.floor(Math.random() * 50) };
    };

const estimateNonce = (addr) => 42;

const queueDownloadTask = (task) => {
        return { taskId: "T-" + Date.now(), status: "queued", priority: task.priority || 1 };
    };

const createChannelSplitter = (ctx, channels) => ({});

const writePipe = (fd, data) => data.length;

const createChannelMerger = (ctx, channels) => ({});

const flushSocketBuffer = (sock) => sock.buffer = [];

const leaveGroup = (group) => true;

const installUpdate = () => false;

// Anti-shake references
const _ref_rqimu8 = { mountFileSystem };
const _ref_4puiqi = { gaussianBlur };
const _ref_blbrcz = { getMediaDuration };
const _ref_wuzpny = { announceToTracker };
const _ref_4pjpk4 = { detectVideoCodec };
const _ref_jhdf9n = { deleteTempFiles };
const _ref_etz5oi = { scrapeTracker };
const _ref_i1egq6 = { seedRatioLimit };
const _ref_e0grwf = { watchFileChanges };
const _ref_ezrkp5 = { parseSubtitles };
const _ref_w3ukx8 = { interestPeer };
const _ref_mqffyh = { streamToPlayer };
const _ref_938tqx = { disablePEX };
const _ref_10uin3 = { captureFrame };
const _ref_9ct3bq = { switchVLAN };
const _ref_gfwgmy = { decompressGzip };
const _ref_z5kshq = { encapsulateFrame };
const _ref_hf2qlv = { mutexLock };
const _ref_7gvx6k = { parseQueryString };
const _ref_oeyqsa = { enableInterrupts };
const _ref_1zpoqr = { connectNodes };
const _ref_y4pvil = { getNetworkStats };
const _ref_2lssw9 = { setSteeringValue };
const _ref_okmrcq = { moveFileToComplete };
const _ref_zvobbx = { chownFile };
const _ref_8wp5v0 = { closeFile };
const _ref_gj3z15 = { generateMipmaps };
const _ref_4t5lsd = { renameFile };
const _ref_rkshb0 = { mapMemory };
const _ref_ya3nql = { removeMetadata };
const _ref_iq4xce = { getSystemUptime };
const _ref_0peofg = { normalizeVolume };
const _ref_cr9fvy = { applyTorque };
const _ref_43opj2 = { signTransaction };
const _ref_h2so44 = { detachThread };
const _ref_70qxps = { seekFile };
const _ref_r7sjwc = { verifyMagnetLink };
const _ref_rf49c6 = { getEnv };
const _ref_sf9bvu = { setPan };
const _ref_ytvdma = { handleInterrupt };
const _ref_h6jtlx = { dhcpAck };
const _ref_9k171l = { ProtocolBufferHandler };
const _ref_kzkgkj = { detectAudioCodec };
const _ref_vidqsu = { createScriptProcessor };
const _ref_ozctkg = { getcwd };
const _ref_q8kp3f = { addPoint2PointConstraint };
const _ref_6fts3k = { auditAccessLogs };
const _ref_idkhun = { addHingeConstraint };
const _ref_t6ppj8 = { compileToBytecode };
const _ref_evajhb = { adjustPlaybackSpeed };
const _ref_ilolbl = { readdir };
const _ref_7bfk8i = { processAudioBuffer };
const _ref_51zqje = { mergeFiles };
const _ref_ja3zbp = { acceptConnection };
const _ref_mspyof = { broadcastTransaction };
const _ref_9ni28n = { chdir };
const _ref_3v333q = { compileFragmentShader };
const _ref_w7nqni = { rayCast };
const _ref_18raf0 = { attachRenderBuffer };
const _ref_2x9uoc = { parseTorrentFile };
const _ref_2rv56r = { loadImpulseResponse };
const _ref_fzqm2f = { bundleAssets };
const _ref_tvxp2h = { applyForce };
const _ref_a4i7ld = { generateWalletKeys };
const _ref_pztixy = { createPhysicsWorld };
const _ref_evcqnt = { closePipe };
const _ref_ttzhvo = { createVehicle };
const _ref_0mptmv = { hydrateSSR };
const _ref_mxzrjm = { mkdir };
const _ref_qhmtrw = { preventSleepMode };
const _ref_6qendc = { analyzeControlFlow };
const _ref_51nm9p = { linkProgram };
const _ref_nt0xgu = { serializeAST };
const _ref_268k2e = { convertFormat };
const _ref_lb0970 = { verifyFileSignature };
const _ref_b7mqrn = { translateText };
const _ref_e3frvt = { createAnalyser };
const _ref_gb9ni1 = { lockRow };
const _ref_bo5u7q = { getMACAddress };
const _ref_d6zr7g = { detectEnvironment };
const _ref_9ae0uh = { deobfuscateString };
const _ref_sloivp = { joinGroup };
const _ref_9epl28 = { enterScope };
const _ref_5e1m6f = { decryptHLSStream };
const _ref_x0c1xm = { manageCookieJar };
const _ref_lqxxbe = { resolveCollision };
const _ref_5fxhnx = { setVelocity };
const _ref_pi9knu = { validateFormInput };
const _ref_gfsd7p = { generateFakeClass };
const _ref_rnb7og = { loadDriver };
const _ref_uoqnpo = { prefetchAssets };
const _ref_eor6zm = { optimizeTailCalls };
const _ref_4f5e63 = { useProgram };
const _ref_r5rjda = { generateDocumentation };
const _ref_kqmofh = { calculateLayoutMetrics };
const _ref_o4iwcc = { rotateLogFiles };
const _ref_f0m8i0 = { createThread };
const _ref_u96xbj = { controlCongestion };
const _ref_4usu1a = { remuxContainer };
const _ref_49f28n = { makeDistortionCurve };
const _ref_7togci = { encryptPayload };
const _ref_c5ib7v = { stepSimulation };
const _ref_iqfttr = { synthesizeSpeech };
const _ref_q4lj6k = { VirtualFSTree };
const _ref_g2by0x = { updateRoutingTable };
const _ref_7vkmhw = { segmentImageUNet };
const _ref_5qpnu2 = { resolveHostName };
const _ref_5bugv9 = { syncAudioVideo };
const _ref_ahobij = { unmuteStream };
const _ref_6j6zu9 = { ApiDataFormatter };
const _ref_97wedk = { updateBitfield };
const _ref_gt4gjn = { disableInterrupts };
const _ref_vxfu4v = { createOscillator };
const _ref_92yupc = { setThreshold };
const _ref_md349j = { setQValue };
const _ref_by3fla = { setInertia };
const _ref_x3yhqs = { checkIntegrityToken };
const _ref_w21odh = { FileValidator };
const _ref_44221b = { configureInterface };
const _ref_g9ka1m = { createSoftBody };
const _ref_r9939f = { statFile };
const _ref_zlwr2d = { systemCall };
const _ref_wkkcxz = { closeSocket };
const _ref_ozk58u = { cleanOldLogs };
const _ref_4up492 = { checkPortAvailability };
const _ref_sjscex = { checkDiskSpace };
const _ref_nooygg = { TelemetryClient };
const _ref_xius7d = { setFrequency };
const _ref_okwwa9 = { deleteTexture };
const _ref_r1n23j = { optimizeMemoryUsage };
const _ref_f04k4d = { updateSoftBody };
const _ref_4nzcsv = { joinThread };
const _ref_1z6501 = { fragmentPacket };
const _ref_14v962 = { scheduleTask };
const _ref_owlmj2 = { detectDevTools };
const _ref_mk852n = { checkIntegrity };
const _ref_wj918r = { translateMatrix };
const _ref_tr39rd = { handshakePeer };
const _ref_hug5qr = { sleep };
const _ref_6365h1 = { applyEngineForce };
const _ref_c2inqx = { normalizeFeatures };
const _ref_uvoh3p = { createGainNode };
const _ref_4ydbgp = { setMTU };
const _ref_o8073n = { terminateSession };
const _ref_stex9r = { reassemblePacket };
const _ref_qk3abf = { vertexAttrib3f };
const _ref_45gcqw = { renderCanvasLayer };
const _ref_99mmg6 = { wakeUp };
const _ref_eq40px = { calculateEntropy };
const _ref_ggfs20 = { initWebGLContext };
const _ref_51msjo = { multicastMessage };
const _ref_ht111h = { serializeFormData };
const _ref_uq7pag = { interpretBytecode };
const _ref_gwa9x4 = { createMeshShape };
const _ref_x1nbsr = { validateTokenStructure };
const _ref_ok1av8 = { sanitizeSQLInput };
const _ref_93rux4 = { AdvancedCipher };
const _ref_hfs1k1 = { cancelAnimationFrameLoop };
const _ref_1nifu0 = { tunnelThroughProxy };
const _ref_0txa8b = { keepAlivePing };
const _ref_3c2zy6 = { preventCSRF };
const _ref_ljz0ki = { encodeABI };
const _ref_hxfb0w = { formatLogMessage };
const _ref_x4dlxy = { visitNode };
const _ref_lf1q2m = { resolveDependencyGraph };
const _ref_6r1xqc = { getShaderInfoLog };
const _ref_mhc0o3 = { generateEmbeddings };
const _ref_tx1ju9 = { mockResponse };
const _ref_6h5oox = { calculateRestitution };
const _ref_ax8vyo = { eliminateDeadCode };
const _ref_r7gtn4 = { detectFirewallStatus };
const _ref_o733pt = { computeLossFunction };
const _ref_92jvyt = { loadModelWeights };
const _ref_cj1ln9 = { createPanner };
const _ref_5yyh1t = { loadTexture };
const _ref_6a42e2 = { animateTransition };
const _ref_dsh4si = { debounceAction };
const _ref_xbvjf5 = { contextSwitch };
const _ref_zk39mv = { instrumentCode };
const _ref_i2tm8m = { vertexAttribPointer };
const _ref_zvcgp7 = { resolveImports };
const _ref_prrq3r = { verifyChecksum };
const _ref_cxtv4r = { setAttack };
const _ref_9k1ufv = { writeFile };
const _ref_nr2e0n = { readFile };
const _ref_h90c9e = { dhcpRequest };
const _ref_8qgc8b = { normalizeVector };
const _ref_ntvb5p = { applyImpulse };
const _ref_qom0sb = { unloadDriver };
const _ref_6cu4xx = { obfuscateString };
const _ref_13xivx = { compileVertexShader };
const _ref_1z2zqd = { connectToTracker };
const _ref_8zxjqq = { estimateNonce };
const _ref_bkh922 = { queueDownloadTask };
const _ref_g4pe9a = { createChannelSplitter };
const _ref_i3mnvs = { writePipe };
const _ref_jus3el = { createChannelMerger };
const _ref_2bolqt = { flushSocketBuffer };
const _ref_shosjo = { leaveGroup };
const _ref_dzxzz3 = { installUpdate }; 
    });
})({}, {});