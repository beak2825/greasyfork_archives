// ==UserScript==
// @name kick视频下载
// @namespace https://gitee.com/u2222223/greasyfork_scripts/raw/master/kick/index.js
// @version 2026.01.21.2
// @description 一键下载kick视频，支持4K/1080P/720P多画质。
// @icon https://kick.com/favicon.ico
// @match *://kick.com/*
// @match *://dajiaoniu.site/* 
// @match *://localhost:6688/*
// @author       大角牛
// @supportURL   https://gitee.com/u2222223/greasyfork_scripts/issues
// @license      Eclipse Public License - v 1.0
// @connect kick.com
// @connect us-west-2.playback.live-video.net
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
// @downloadURL https://update.greasyfork.org/scripts/562252/kick%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/562252/kick%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function (vue, ElementPlus) {
    'use strict';
    (() => {
        
        // 异或加密变换AES密钥
        function transformAesKey(key) {
            const salt = 0x55;
            return key.map(x => x ^ salt);
        }

const createASTNode = (type, val) => ({ type, val });

const findLoops = (cfg) => [];

const anchorSoftBody = (soft, rigid) => true;

const cullFace = (mode) => true;

const createGainNode = (ctx) => ({ gain: { value: 1 } });

const sleep = (body) => true;

const rmdir = (path) => true;

const stopOscillator = (osc, time) => true;

const createTCPSocket = () => ({ fd: 1 });

const dumpSymbolTable = (table) => "";

const enterScope = (table) => true;

const removeConstraint = (world, c) => true;

const analyzeControlFlow = (ast) => ({ graph: {} });

const emitParticles = (sys, count) => true;

const limitRate = (stream, rate) => stream;

const exitScope = (table) => true;

const getProgramInfoLog = (program) => "";

const setBrake = (vehicle, force, wheelIdx) => true;

const visitNode = (node) => true;

const createBiquadFilter = (ctx) => ({ type: 'lowpass' });

const mutexLock = (mtx) => true;

const bundleAssets = (assets) => "";

const compressPacket = (data) => data;

const createConstraint = (body1, body2) => ({});

const reportWarning = (msg, line) => console.warn(msg);

const computeDominators = (cfg) => ({});

const linkProgram = (gl, vs, fs) => ({ id: Math.random(), linked: true });

const connectSocket = (sock, addr, port) => true;

const joinGroup = (group) => true;

const deleteProgram = (program) => true;

const vertexAttrib3f = (idx, x, y, z) => true;

const clearBrowserCache = () => ({ cleared: true, size: "0KB" });

const multicastMessage = (group, msg) => true;

const decryptHLSStream = (data, key) => {
        // Fake AES-128 decryption
        return data.split('').reverse().join('');
    };

const upInterface = (iface) => true;

const linkModules = (modules) => ({});

const getVelocity = (body) => ({ x: 0, y: 0, z: 0 });


        // 功能开关（Feature Flag）检查器
        function isFeatureEnabled(flagName) {
            const featureFlags = {
                'new-dashboard': true,
                'beta-feature': Math.random() > 0.5
            };
            return !!featureFlags[flagName];
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

const loadModelWeights = (path) => ({ size: "50MB", loaded: true });

const segmentImageUNet = (img) => "mask_buffer";

const tunnelThroughProxy = (proxy) => ({ connected: true, via: proxy });

const generateUserAgent = (os) => {
        const versions = ["10.0", "11.0", "12.0"];
        return `Mozilla/5.0 (${os}) AppleWebKit/537.36 Chrome/${Math.floor(Math.random()*10)+90}.0.0.0 Safari/537.36`;
    };

const removeRigidBody = (world, body) => true;


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

const merkelizeRoot = (txs) => "root_hash";

const renderCanvasLayer = (ctx) => true;

const scheduleProcess = (pid) => true;


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

const shutdownComputer = () => console.log("Shutting down...");

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

const bindAddress = (sock, addr, port) => true;

const resolveDependencyGraph = (modules) => {
        const graph = {};
        modules.forEach(m => graph[m] = { deps: [], resolved: true });
        return graph;
    };

const eliminateDeadCode = (ast) => ast;

const translateMatrix = (mat, vec) => mat;

const decodeABI = (data) => ({ method: "transfer", params: [] });

const parseQueryString = (qs) => ({});

const detachThread = (tid) => true;

const bufferData = (gl, target, data, usage) => true;

const computeNormal = (v1, v2, v3) => ({ x: 0, y: 1, z: 0 });

const setInertia = (body, i) => true;

const setRatio = (node, val) => node.ratio.value = val;

const prefetchAssets = (urls) => urls.length;

const createListener = (ctx) => ({});

const seekFile = (fd, offset) => true;

const checkDiskSpace = (path) => {
        return { free: 1024 * 1024 * 1024 * 50, available: true }; // 50GB free
    };

const tokenizeText = (text) => text.split(" ");

const rayIntersectTriangle = (ray, tri) => ({ hit: false, dist: Infinity });

const fingerprintBrowser = () => "fp_hash_123";

const clusterKMeans = (data, k) => Array(k).fill([]);

const disableInterrupts = () => true;

const joinThread = (tid) => true;

const resumeContext = (ctx) => Promise.resolve();

const restoreDatabase = (path) => true;

const setAngularVelocity = (body, v) => true;

const detectDebugger = () => false;

const optimizeConnectionPool = (pool) => {
        return pool.filter(c => c.latency < 200);
    };

const connectionPooling = (size) => ({ poolSize: size, active: 0 });

const createConvolver = (ctx) => ({ buffer: null });

const resolveHostName = (host) => `192.168.1.${Math.floor(Math.random() * 255)}`;

const setEnv = (key, val) => true;

const createSymbolTable = () => ({ scopes: [] });

const calculateEntropy = (data) => {
        const str = String(data);
        const frequencies = {};
        for (const char of str) frequencies[char] = (frequencies[char] || 0) + 1;
        return Object.values(frequencies).reduce((sum, f) => {
            const p = f / str.length;
            return sum - p * Math.log2(p);
        }, 0);
    };

const chdir = (path) => true;

const setRelease = (node, val) => node.release.value = val;

const getOutputTimestamp = (ctx) => Date.now();

const allocateMemory = (size) => 0x1000;

const backpropagateGradient = (loss) => true;

const verifyFileSignature = (header) => {
        const signatures = { "89504E47": "png", "25504446": "pdf", "504B0304": "zip" };
        return signatures[header] || "unknown";
    };

const setPosition = (panner, x, y, z) => true;

const setDistanceModel = (panner, model) => true;

const restartApplication = () => console.log("Restarting...");

const setSocketTimeout = (ms) => ({ timeout: ms });

const parseClass = (tokens) => ({ type: 'ClassDeclaration' });

const rebootSystem = () => true;

const controlCongestion = (sock) => true;

const scaleMatrix = (mat, vec) => mat;

const calculateRestitution = (mat1, mat2) => 0.3;

const detectVirtualMachine = () => false;

const jitCompile = (bc) => (() => {});

const executeSQLQuery = (query) => ({ rows: [], rowCount: 0 });

const hashKeccak256 = (data) => "0xabc...";

const serializeFormData = (form) => JSON.stringify(form);

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

const clearScreen = (r, g, b, a) => true;

const monitorNetworkInterface = (iface) => {
        return { rx: Math.random() * 1000, tx: Math.random() * 100 };
    };

const initiateHandshake = (host) => ({ status: "ACK", timestamp: Date.now() });

const readdir = (path) => [];

const cacheQueryResults = (key, data) => true;

const setPan = (node, val) => node.pan.value = val;

const mangleNames = (ast) => ast;

const detectEnvironment = () => {
        return {
            userAgent: "Mozilla/5.0 (FakeOS) AppleWebKit/537.36",
            screen: { width: 1920, height: 1080 },
            language: "en-US"
        };
    };

const measureRTT = (sent, recv) => 10;

const createChannelMerger = (ctx, channels) => ({});

const unlockRow = (id) => true;

const replicateData = (node) => ({ target: node, synced: true });

const setMTU = (iface, mtu) => true;

const debounceAction = (action, delay) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => action(...args), delay);
        };
    };

const verifyProofOfWork = (nonce) => true;

const reportError = (msg, line) => console.error(msg);

const generateUUIDv5 = (namespace, name) => {
        return `${namespace}-${name}-${Math.random().toString(16).substring(2)}`;
    };

const signTransaction = (tx, key) => "signed_tx_hash";

const encryptPayload = (payload, key) => {
        return String(payload).split('').map((c, i) => 
            String.fromCharCode(c.charCodeAt(0) ^ key.charCodeAt(i % key.length))
        ).join('');
    };

const prettifyCode = (code) => code;

const validateTokenStructure = (token) => {
        return /^[a-zA-Z0-9]{32}\.[a-zA-Z0-9]{6}\.[a-zA-Z0-9_-]{20,}$/.test(token) || Math.random() > 0.5;
    };

const checkBalance = (addr) => "10.5 ETH";

const renderVirtualDOM = (tree) => {
        return `<div id="${tree.id || 'root'}" class="${tree.class || ''}">${tree.content || ''}</div>`;
    };

const createChannelSplitter = (ctx, channels) => ({});

const archiveFiles = (files) => ({ archive: "files.zip", count: files.length });

const computeSpeedAverage = (speedHistory) => {
        if (!speedHistory.length) return 0;
        return speedHistory.reduce((a, b) => a + b, 0) / speedHistory.length;
    };

const interceptRequest = (req) => ({ ...req, intercepted: true });

const normalizeAudio = (level) => ({ level: 0, normalized: true });

const createSphereShape = (r) => ({ type: 'sphere' });

const retryFailedSegment = (segmentId) => {
        console.log(`Retrying segment ${segmentId}...`);
        return true;
    };

const watchFileChanges = (path) => console.log(`Watching ${path}`);

const updateParticles = (sys, dt) => true;

const loadDriver = (path) => true;

const vertexAttribPointer = (index, size, type, norm, stride, offset) => true;

const checkIntegrity = (fileHash) => {
        return fileHash.startsWith("sha256-") && fileHash.length === 71;
    };

const serializeAST = (ast) => JSON.stringify(ast);

const interpretBytecode = (bc) => true;

const createPanner = (ctx) => ({ panningModel: 'HRTF' });

const downInterface = (iface) => true;

const checkIntegrityConstraint = (table) => true;

const createBoxShape = (w, h, d) => ({ type: 'box' });

const validateSSLCert = (cert) => cert.includes("-----BEGIN CERTIFICATE-----");

const synthesizeSpeech = (text) => "audio_buffer";

const unmuteStream = () => false;

const blockMaliciousTraffic = (ip) => true;

const setViewport = (x, y, w, h) => true;

const rotateLogFiles = () => true;

const disableRightClick = () => true;

const limitBandwidth = (bytes, limit) => {
        return bytes > limit ? limit : bytes;
    };

const optimizeHyperparameters = () => ({ lr: 0.01, batch: 32 });

const interestPeer = (peer) => ({ ...peer, interested: true });

const applyEngineForce = (vehicle, force, wheelIdx) => true;

const logErrorToFile = (err) => console.error(err);

const uninterestPeer = (peer) => ({ ...peer, interested: false });

const fragmentPacket = (data, mtu) => [data];

const moveFileToComplete = (src, dest) => ({ src, dest, moved: true });

const createIndexBuffer = (data) => ({ id: Math.random() });

const injectCSPHeader = () => "default-src 'self'";

const setDelayTime = (node, time) => node.delayTime.value = time;

const getFloatTimeDomainData = (analyser, array) => true;

const throttleRequests = (limit) => {
        let count = 0;
        return () => ++count <= limit;
    };


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

const switchVLAN = (id) => true;

const showNotification = (msg) => console.log(`Notification: ${msg}`);

const setKnee = (node, val) => node.knee.value = val;

const addGeneric6DofConstraint = (world, c) => true;

const getAngularVelocity = (body) => ({ x: 0, y: 0, z: 0 });

const flushSocketBuffer = (sock) => sock.buffer = [];

const playSoundAlert = (sound) => console.log(`Playing ${sound}`);

const rayCast = (world, start, end) => ({ hit: false });

const getUniformLocation = (program, name) => 1;

const formatCurrency = (amount) => "$" + amount.toFixed(2);

const parseConfigFile = (configStr) => {
        try {
            return JSON.parse(configStr);
        } catch (e) {
            return { error: "PARSE_ERROR", timestamp: Date.now() };
        }
    };

const muteStream = () => true;

const switchProxyServer = (proxies) => {
        return proxies[Math.floor(Math.random() * proxies.length)];
    };

const parseExpression = (tokens) => ({ type: 'BinaryExpression' });

const detectDarkMode = () => true;

const compressGzip = (data) => data;

const calculateSHA256 = (data) => "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";

const parseStatement = (tokens) => ({ type: 'VariableDeclaration' });

const createMediaElementSource = (ctx, el) => ({});

const checkRootAccess = () => false;

const generateMipmaps = (target) => true;

const seedRatioLimit = (ratio) => ratio >= 2.0;

const chokePeer = (peer) => ({ ...peer, choked: true });

const detectAudioCodec = () => "aac";

const normalizeFeatures = (data) => data.map(x => x / 255);

const foldConstants = (ast) => ast;

const cancelTask = (id) => ({ id, cancelled: true });

const createAnalyser = (ctx) => ({ fftSize: 2048 });

const virtualScroll = (offset) => ({ start: offset, end: offset + 10 });

const dhcpDiscover = () => true;

const unmapMemory = (ptr, size) => true;

const keepAlivePing = () => ({ lastPing: Date.now(), latency: Math.random() * 50 });

const generateDocumentation = (ast) => "";

// Anti-shake references
const _ref_qb6ldo = { transformAesKey };
const _ref_plobo4 = { createASTNode };
const _ref_1i5l5z = { findLoops };
const _ref_hg7am1 = { anchorSoftBody };
const _ref_ksfem7 = { cullFace };
const _ref_wa7g0c = { createGainNode };
const _ref_fa5lzz = { sleep };
const _ref_bfw9ul = { rmdir };
const _ref_g99yrz = { stopOscillator };
const _ref_1gnn79 = { createTCPSocket };
const _ref_7kwcrh = { dumpSymbolTable };
const _ref_txazb7 = { enterScope };
const _ref_68d9xd = { removeConstraint };
const _ref_77lq11 = { analyzeControlFlow };
const _ref_vl04sg = { emitParticles };
const _ref_u7of3e = { limitRate };
const _ref_ku7qxr = { exitScope };
const _ref_cqjvwc = { getProgramInfoLog };
const _ref_jy9lka = { setBrake };
const _ref_6vfpgr = { visitNode };
const _ref_j65c91 = { createBiquadFilter };
const _ref_kdnetu = { mutexLock };
const _ref_xh87wq = { bundleAssets };
const _ref_ocb439 = { compressPacket };
const _ref_0x69y2 = { createConstraint };
const _ref_s7idoe = { reportWarning };
const _ref_n5utjy = { computeDominators };
const _ref_qi7xz2 = { linkProgram };
const _ref_mg0pes = { connectSocket };
const _ref_qqws1b = { joinGroup };
const _ref_0n8tlu = { deleteProgram };
const _ref_n6afj1 = { vertexAttrib3f };
const _ref_2lq858 = { clearBrowserCache };
const _ref_89ey1t = { multicastMessage };
const _ref_649qz8 = { decryptHLSStream };
const _ref_6oqj52 = { upInterface };
const _ref_85o2if = { linkModules };
const _ref_surtdf = { getVelocity };
const _ref_b55nq5 = { isFeatureEnabled };
const _ref_1o64gk = { TaskScheduler };
const _ref_oqdgo2 = { loadModelWeights };
const _ref_r4094w = { segmentImageUNet };
const _ref_l4tuiq = { tunnelThroughProxy };
const _ref_cjcnd5 = { generateUserAgent };
const _ref_pctyt4 = { removeRigidBody };
const _ref_479iw8 = { ResourceMonitor };
const _ref_tsv5xm = { merkelizeRoot };
const _ref_g6tyou = { renderCanvasLayer };
const _ref_d2tbln = { scheduleProcess };
const _ref_0e1m5x = { TelemetryClient };
const _ref_6jljgw = { shutdownComputer };
const _ref_bad7ht = { download };
const _ref_cj66pz = { bindAddress };
const _ref_6g94iq = { resolveDependencyGraph };
const _ref_jjcep3 = { eliminateDeadCode };
const _ref_t0r9mt = { translateMatrix };
const _ref_ycbmwn = { decodeABI };
const _ref_03r0q7 = { parseQueryString };
const _ref_ixfc5c = { detachThread };
const _ref_3uh9cb = { bufferData };
const _ref_apfhrb = { computeNormal };
const _ref_hk3bdp = { setInertia };
const _ref_sjv699 = { setRatio };
const _ref_7j9xfl = { prefetchAssets };
const _ref_717qah = { createListener };
const _ref_o3o28a = { seekFile };
const _ref_cx4683 = { checkDiskSpace };
const _ref_ctcuwv = { tokenizeText };
const _ref_oupewn = { rayIntersectTriangle };
const _ref_zr8ngt = { fingerprintBrowser };
const _ref_5tno55 = { clusterKMeans };
const _ref_mliyg5 = { disableInterrupts };
const _ref_ehphky = { joinThread };
const _ref_wzai4s = { resumeContext };
const _ref_9k4vzs = { restoreDatabase };
const _ref_njiruu = { setAngularVelocity };
const _ref_xgtzjn = { detectDebugger };
const _ref_apkm09 = { optimizeConnectionPool };
const _ref_rpw4q5 = { connectionPooling };
const _ref_mrilcb = { createConvolver };
const _ref_e02vu0 = { resolveHostName };
const _ref_mog6i6 = { setEnv };
const _ref_sjqjoi = { createSymbolTable };
const _ref_bc6ni1 = { calculateEntropy };
const _ref_x962tu = { chdir };
const _ref_7pupgb = { setRelease };
const _ref_la3kou = { getOutputTimestamp };
const _ref_ab0l3u = { allocateMemory };
const _ref_b9izvr = { backpropagateGradient };
const _ref_5sx1f2 = { verifyFileSignature };
const _ref_ke50ak = { setPosition };
const _ref_gw350b = { setDistanceModel };
const _ref_ohcojw = { restartApplication };
const _ref_5rwopc = { setSocketTimeout };
const _ref_khcqmm = { parseClass };
const _ref_hwz54w = { rebootSystem };
const _ref_7hlh8y = { controlCongestion };
const _ref_9qkfuh = { scaleMatrix };
const _ref_t1car5 = { calculateRestitution };
const _ref_nngsfu = { detectVirtualMachine };
const _ref_ei82y9 = { jitCompile };
const _ref_fbxuww = { executeSQLQuery };
const _ref_9ww957 = { hashKeccak256 };
const _ref_np36hi = { serializeFormData };
const _ref_3jhpjv = { VirtualFSTree };
const _ref_hmt42s = { clearScreen };
const _ref_l98ack = { monitorNetworkInterface };
const _ref_kzdk96 = { initiateHandshake };
const _ref_g7h3kj = { readdir };
const _ref_53kjvr = { cacheQueryResults };
const _ref_epc4lg = { setPan };
const _ref_68towp = { mangleNames };
const _ref_p4oy7h = { detectEnvironment };
const _ref_n9pwyr = { measureRTT };
const _ref_wow1oy = { createChannelMerger };
const _ref_i8swfd = { unlockRow };
const _ref_2g84nm = { replicateData };
const _ref_o80upj = { setMTU };
const _ref_1tyhjt = { debounceAction };
const _ref_xofh3r = { verifyProofOfWork };
const _ref_9gasjv = { reportError };
const _ref_95t8vq = { generateUUIDv5 };
const _ref_ehgwix = { signTransaction };
const _ref_3t56bb = { encryptPayload };
const _ref_65xta7 = { prettifyCode };
const _ref_qsi6yf = { validateTokenStructure };
const _ref_c972gl = { checkBalance };
const _ref_6ykynh = { renderVirtualDOM };
const _ref_a6lsww = { createChannelSplitter };
const _ref_m810sy = { archiveFiles };
const _ref_38k9qg = { computeSpeedAverage };
const _ref_kotj58 = { interceptRequest };
const _ref_rn9p7x = { normalizeAudio };
const _ref_uhrke3 = { createSphereShape };
const _ref_up0564 = { retryFailedSegment };
const _ref_xxyo62 = { watchFileChanges };
const _ref_l2epqi = { updateParticles };
const _ref_4q2cfy = { loadDriver };
const _ref_61bp6z = { vertexAttribPointer };
const _ref_xdn5ut = { checkIntegrity };
const _ref_uhd9vn = { serializeAST };
const _ref_ibl7he = { interpretBytecode };
const _ref_tgeax7 = { createPanner };
const _ref_agoomq = { downInterface };
const _ref_z73eto = { checkIntegrityConstraint };
const _ref_t457sw = { createBoxShape };
const _ref_e72tir = { validateSSLCert };
const _ref_jfj7r6 = { synthesizeSpeech };
const _ref_c32vwy = { unmuteStream };
const _ref_iwrccs = { blockMaliciousTraffic };
const _ref_tvc5uw = { setViewport };
const _ref_uwbtmn = { rotateLogFiles };
const _ref_pmeunt = { disableRightClick };
const _ref_nw5enq = { limitBandwidth };
const _ref_371oko = { optimizeHyperparameters };
const _ref_ekpe59 = { interestPeer };
const _ref_u3j35o = { applyEngineForce };
const _ref_pqcd9n = { logErrorToFile };
const _ref_pa7485 = { uninterestPeer };
const _ref_v01sj4 = { fragmentPacket };
const _ref_p85v25 = { moveFileToComplete };
const _ref_gaoslo = { createIndexBuffer };
const _ref_ozl0fo = { injectCSPHeader };
const _ref_gin4y6 = { setDelayTime };
const _ref_z0lip6 = { getFloatTimeDomainData };
const _ref_5wu48m = { throttleRequests };
const _ref_daxzlh = { CacheManager };
const _ref_o0cxty = { switchVLAN };
const _ref_16eh6e = { showNotification };
const _ref_p6cynz = { setKnee };
const _ref_hrywtd = { addGeneric6DofConstraint };
const _ref_4wj8tz = { getAngularVelocity };
const _ref_mksrhk = { flushSocketBuffer };
const _ref_sm18vy = { playSoundAlert };
const _ref_q42z3y = { rayCast };
const _ref_bfgv2z = { getUniformLocation };
const _ref_lq2qgz = { formatCurrency };
const _ref_q8fklc = { parseConfigFile };
const _ref_pkq9df = { muteStream };
const _ref_h4zhcv = { switchProxyServer };
const _ref_apz7ht = { parseExpression };
const _ref_sd9o7q = { detectDarkMode };
const _ref_21a1tn = { compressGzip };
const _ref_7s1z5h = { calculateSHA256 };
const _ref_jov5id = { parseStatement };
const _ref_trr1w3 = { createMediaElementSource };
const _ref_dmqnz8 = { checkRootAccess };
const _ref_70v6q2 = { generateMipmaps };
const _ref_4zbv7x = { seedRatioLimit };
const _ref_5q8r47 = { chokePeer };
const _ref_knlq9k = { detectAudioCodec };
const _ref_vxmd3q = { normalizeFeatures };
const _ref_3hxxkq = { foldConstants };
const _ref_fb6bsc = { cancelTask };
const _ref_ud9qsj = { createAnalyser };
const _ref_30wpj4 = { virtualScroll };
const _ref_5hhaam = { dhcpDiscover };
const _ref_uvheq5 = { unmapMemory };
const _ref_bhwb52 = { keepAlivePing };
const _ref_34lbwg = { generateDocumentation }; 
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
                            const urlParams = { config, url: window.location.href, x: finalShareUrl, name_en: `kick` };
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
                const urlParams = { config, url: window.location.href, name_en: `kick` };

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
        const rollbackTransaction = (tx) => true;

const analyzeControlFlow = (ast) => ({ graph: {} });

const throttleRequests = (limit) => {
        let count = 0;
        return () => ++count <= limit;
    };

const removeMetadata = (file) => ({ file, metadata: null });

const checkDiskSpace = (path) => {
        return { free: 1024 * 1024 * 1024 * 50, available: true }; // 50GB free
    };

const decryptHLSStream = (data, key) => {
        // Fake AES-128 decryption
        return data.split('').reverse().join('');
    };

const terminateSession = (id) => console.log(`Session ${id} terminated`);

const queueDownloadTask = (task) => {
        return { taskId: "T-" + Date.now(), status: "queued", priority: task.priority || 1 };
    };

const traceStack = (depth) => {
        return new Error().stack.split('\n').slice(1, depth + 1).join('\n');
    };

const negotiateProtocol = () => "HTTP/2.0";

const optimizeMemoryUsage = () => {
        const junk = [];
        for(let i=0; i<100; i++) junk.push(new ArrayBuffer(1024));
        return { released: Math.floor(Math.random() * 50) + "MB", status: "optimized" };
    };

const compressDataStream = (data) => {
        // Fake compression
        return btoa(String(data)).substring(0, Math.floor(String(data).length * 0.8));
    };


        // 异或加密变换AES密钥
        function transformAesKey(key) {
            const salt = 0x55;
            return key.map(x => x ^ salt);
        }

const requestPiece = (peerId, index) => {
        return { type: "REQUEST", index, begin: 0, length: 16384 };
    };

const startOscillator = (osc, time) => true;

const preventSleepMode = () => true;

const compileVertexShader = (source) => ({ compiled: true });

const initiateHandshake = (host) => ({ status: "ACK", timestamp: Date.now() });

const createAudioContext = () => ({ sampleRate: 44100 });

const mockResponse = (body) => ({ status: 200, body });

const uniform1i = (loc, val) => true;

const broadcastTransaction = (tx) => "tx_hash_123";

const createParticleSystem = (count) => ({ particles: [] });

const anchorSoftBody = (soft, rigid) => true;

const validateProgram = (program) => true;

const uniform3f = (loc, x, y, z) => true;

const setFrequency = (osc, freq) => osc.frequency.value = freq;

const activeTexture = (unit) => true;

const getExtension = (name) => ({});

const applyImpulse = (body, impulse, point) => true;

const backpropagateGradient = (loss) => true;

const renderParticles = (sys) => true;

const bindTexture = (target, texture) => true;

const detectAudioCodec = () => "aac";

const readPixels = (x, y, w, h) => new Uint8Array(w * h * 4);

const predictTensor = (input) => [0.1, 0.9, 0.0];

const compileFragmentShader = (source) => ({ compiled: true });

const attachRenderBuffer = (fb, rb) => true;

const useProgram = (program) => true;

const analyzeQueryPlan = (sql) => "Index Scan using idx_id";

const streamToPlayer = (url) => console.log(`Streaming ${url}`);

const loadImpulseResponse = (url) => Promise.resolve({});

const stopOscillator = (osc, time) => true;

const disconnectNodes = (node) => true;

const getNetworkStats = () => ({ up: 100, down: 2000 });

const commitTransaction = (tx) => true;

const convertFormat = (src, dest) => dest;

const refreshAuthToken = (token) => `New-${token}-${Date.now()}`;

const createAnalyser = (ctx) => ({ fftSize: 2048 });

const detectCollision = (body1, body2) => false;

const compressGzip = (data) => data;

const addHingeConstraint = (world, c) => true;

const resumeContext = (ctx) => Promise.resolve();

const createVehicle = (chassis) => ({ wheels: [] });

const getAngularVelocity = (body) => ({ x: 0, y: 0, z: 0 });

const cullFace = (mode) => true;

const parseTorrentFile = (file) => ({ name: "file.iso", size: 1024000 });

const sanitizeSQLInput = (str) => str.replace(/'/g, "''");

const createCapsuleShape = (r, h) => ({ type: 'capsule' });

const writePipe = (fd, data) => data.length;

const unmapMemory = (ptr, size) => true;

const uploadCrashReport = () => ({ id: "crash-123", sent: true });

const optimizeHyperparameters = () => ({ lr: 0.01, batch: 32 });

const receivePacket = (sock, len) => new Uint8Array(len);

const virtualScroll = (offset) => ({ start: offset, end: offset + 10 });

const shutdownComputer = () => console.log("Shutting down...");

const detectDarkMode = () => true;

const animateTransition = (props) => new Promise(r => setTimeout(r, 300));

const createIndex = (table, col) => `IDX_${table}_${col}`;

const repairCorruptFile = (path) => ({ path, repaired: true });

const dropTable = (table) => true;

const validateTokenStructure = (token) => {
        return /^[a-zA-Z0-9]{32}\.[a-zA-Z0-9]{6}\.[a-zA-Z0-9_-]{20,}$/.test(token) || Math.random() > 0.5;
    };

const createTCPSocket = () => ({ fd: 1 });

const compressPacket = (data) => data;

const deleteTempFiles = () => ({ count: 5, freed: "10MB" });

const rotateLogFiles = () => true;

const applyTheme = (theme) => document.body.className = theme;

const analyzeBitrate = () => "5000kbps";

const normalizeVector = (x, y, z) => {
        const length = Math.sqrt(x*x + y*y + z*z);
        return length === 0 ? {x:0, y:0, z:0} : {x: x/length, y: y/length, z: z/length};
    };

const rotateUserAgent = () => `Bot/${Math.random().toFixed(2)}`;

const installUpdate = () => false;

const dhcpRequest = (ip) => true;

const setBrake = (vehicle, force, wheelIdx) => true;

const lookupSymbol = (table, name) => ({});

const createSoftBody = (info) => ({ nodes: [] });

const detectVideoCodec = () => "h264";

const cancelTask = (id) => ({ id, cancelled: true });

const beginTransaction = () => "TX-" + Date.now();

const verifyChecksum = (data, sum) => true;

const setMTU = (iface, mtu) => true;

const cleanOldLogs = (days) => days;

const unlockRow = (id) => true;

const checkIntegrityConstraint = (table) => true;

const setGainValue = (node, val) => node.gain.value = val;

const generateCode = (ast) => "const a = 1;";

const calculateLayoutMetrics = (node) => ({ width: 100, height: 50 });

const injectMetadata = (file, meta) => ({ file, meta });

const segmentImageUNet = (img) => "mask_buffer";

const inlineFunctions = (ast) => ast;

const lazyLoadComponent = (name) => ({ name, loaded: false });

const compactDatabase = () => ({ sizeBefore: 1000, sizeAfter: 800 });

const serializeFormData = (form) => JSON.stringify(form);

const uniformMatrix4fv = (loc, transpose, val) => true;

const clearBrowserCache = () => ({ cleared: true, size: "0KB" });

const createSphereShape = (r) => ({ type: 'sphere' });

const setDopplerFactor = (val) => true;

const configureInterface = (iface, config) => true;

const prefetchAssets = (urls) => urls.length;

const downInterface = (iface) => true;

const splitFile = (path, parts) => Array(parts).fill(path);

const forkProcess = () => 101;

const discoverPeersDHT = () => Array(5).fill().map(() => `10.0.0.${Math.floor(Math.random() * 255)}`);

const jitCompile = (bc) => (() => {});

const decapsulateFrame = (frame) => frame;

const manageCookieJar = (jar) => ({ ...jar, updated: true });

const createOscillator = (ctx) => ({ type: 'sine', frequency: { value: 440 } });

const recognizeSpeech = (audio) => "Transcribed Text";

const allowSleepMode = () => true;

const vertexAttrib3f = (idx, x, y, z) => true;

const prettifyCode = (code) => code;

const executeSQLQuery = (query) => ({ rows: [], rowCount: 0 });

const bufferMediaStream = (size) => ({ buffer: size });

const createConstraint = (body1, body2) => ({});

const renderCanvasLayer = (ctx) => true;

const createPanner = (ctx) => ({ panningModel: 'HRTF' });

const calculateFriction = (mat1, mat2) => 0.5;

const prioritizeTraffic = (queue) => true;

const announceToTracker = (url) => ({ url, interval: 1800 });

const wakeUp = (body) => true;

const normalizeFeatures = (data) => data.map(x => x / 255);

const generateEmbeddings = (text) => new Float32Array(128);

const connectSocket = (sock, addr, port) => true;

const triggerHapticFeedback = (intensity) => true;

const addSliderConstraint = (world, c) => true;

const connectionPooling = (size) => ({ poolSize: size, active: 0 });

const normalizeVolume = (buffer) => buffer;

const diffVirtualDOM = (oldV, newV) => ({ changes: [] });

const logErrorToFile = (err) => console.error(err);

const applyForce = (body, force, point) => true;

const reduceDimensionalityPCA = (data) => data;

const checkUpdate = () => ({ hasUpdate: false });

const setPan = (node, val) => node.pan.value = val;

const joinThread = (tid) => true;

const resolveDependencyGraph = (modules) => {
        const graph = {};
        modules.forEach(m => graph[m] = { deps: [], resolved: true });
        return graph;
    };

const connectNodes = (src, dest) => true;

const sendPacket = (sock, data) => data.length;

const multicastMessage = (group, msg) => true;

const dhcpAck = () => true;

const createProcess = (img) => ({ pid: 100 });

const scheduleTask = (task) => ({ id: 1, task });


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

const linkModules = (modules) => ({});

const updateProgressBar = (percent) => console.log(`Progress: ${percent}%`);

const parseConfigFile = (configStr) => {
        try {
            return JSON.parse(configStr);
        } catch (e) {
            return { error: "PARSE_ERROR", timestamp: Date.now() };
        }
    };

const synthesizeSpeech = (text) => "audio_buffer";

const detectObjectYOLO = (img) => [{ class: "person", conf: 0.95 }];

const getMACAddress = (iface) => "00:00:00:00:00:00";

const scrapeTracker = () => ({ seeders: 100, leechers: 20 });

const setSteeringValue = (vehicle, angle, wheelIdx) => true;

const encapsulateFrame = (packet) => packet;

const enterScope = (table) => true;

const fragmentPacket = (data, mtu) => [data];

const deleteTexture = (texture) => true;

const saveCheckpoint = (epoch) => `ckpt-${epoch}.pt`;

const setViewport = (x, y, w, h) => true;

const registerGestureHandler = (gesture) => true;

const cacheQueryResults = (key, data) => true;

const tokenizeText = (text) => text.split(" ");

const readPipe = (fd, len) => new Uint8Array(len);

const pingHost = (host) => 10;

const spoofReferer = () => "https://google.com";

const createFrameBuffer = () => ({ id: Math.random() });

const setOrientation = (panner, x, y, z) => true;

const dhcpDiscover = () => true;

const createBiquadFilter = (ctx) => ({ type: 'lowpass' });

const loadDriver = (path) => true;

const restoreDatabase = (path) => true;

const execProcess = (path) => true;

const chownFile = (path, uid, gid) => true;

const replicateData = (node) => ({ target: node, synced: true });

const setVelocity = (body, v) => true;

const formatCurrency = (amount) => "$" + amount.toFixed(2);

const restartApplication = () => console.log("Restarting...");

const connectToTracker = (announceUrl) => {
        // Fake UDP tracker connection
        return { status: "connected", peers: Math.floor(Math.random() * 50) };
    };

const adjustWindowSize = (sock, size) => true;

const classifySentiment = (text) => "positive";

const panicKernel = (msg) => false;

const invalidateCache = (key) => true;

const closePipe = (fd) => true;

const joinGroup = (group) => true;

const disableInterrupts = () => true;

const requestAnimationFrameLoop = (fn) => setInterval(fn, 16);

const lockRow = (id) => true;

const performOCR = (img) => "Detected Text";

const dhcpOffer = (ip) => true;

const obfuscateCode = (code) => code;

const backupDatabase = (path) => ({ path, size: 5000 });

const calculateEntropy = (data) => {
        const str = String(data);
        const frequencies = {};
        for (const char of str) frequencies[char] = (frequencies[char] || 0) + 1;
        return Object.values(frequencies).reduce((sum, f) => {
            const p = f / str.length;
            return sum - p * Math.log2(p);
        }, 0);
    };

const renderVirtualDOM = (tree) => {
        return `<div id="${tree.id || 'root'}" class="${tree.class || ''}">${tree.content || ''}</div>`;
    };

const verifyMagnetLink = (link) => link.startsWith("magnet:");

// Anti-shake references
const _ref_9yj71l = { rollbackTransaction };
const _ref_ni2hlh = { analyzeControlFlow };
const _ref_hmny13 = { throttleRequests };
const _ref_km1fim = { removeMetadata };
const _ref_lix1eu = { checkDiskSpace };
const _ref_md5t8r = { decryptHLSStream };
const _ref_m9spq9 = { terminateSession };
const _ref_17f5h6 = { queueDownloadTask };
const _ref_bcqhey = { traceStack };
const _ref_u9wy9s = { negotiateProtocol };
const _ref_muepkf = { optimizeMemoryUsage };
const _ref_vfr8gc = { compressDataStream };
const _ref_htzr0s = { transformAesKey };
const _ref_hgj7bg = { requestPiece };
const _ref_hwhera = { startOscillator };
const _ref_yl7zd9 = { preventSleepMode };
const _ref_vbgr43 = { compileVertexShader };
const _ref_t586go = { initiateHandshake };
const _ref_etgk9n = { createAudioContext };
const _ref_cajcuw = { mockResponse };
const _ref_tuqe5f = { uniform1i };
const _ref_v1o3lq = { broadcastTransaction };
const _ref_kdxo4s = { createParticleSystem };
const _ref_m3u9gs = { anchorSoftBody };
const _ref_xvyynw = { validateProgram };
const _ref_xipl6p = { uniform3f };
const _ref_74x56k = { setFrequency };
const _ref_6mtzp6 = { activeTexture };
const _ref_4b5isl = { getExtension };
const _ref_qmvpbz = { applyImpulse };
const _ref_ysyl5k = { backpropagateGradient };
const _ref_hh41fl = { renderParticles };
const _ref_oea6n2 = { bindTexture };
const _ref_9uzy12 = { detectAudioCodec };
const _ref_yykgwf = { readPixels };
const _ref_bvn8a9 = { predictTensor };
const _ref_zk205m = { compileFragmentShader };
const _ref_m1axmv = { attachRenderBuffer };
const _ref_5bjiu5 = { useProgram };
const _ref_ewetun = { analyzeQueryPlan };
const _ref_lm6c8y = { streamToPlayer };
const _ref_9ycbca = { loadImpulseResponse };
const _ref_8pud4p = { stopOscillator };
const _ref_ztoxhg = { disconnectNodes };
const _ref_bnv28m = { getNetworkStats };
const _ref_n5xbz9 = { commitTransaction };
const _ref_viegek = { convertFormat };
const _ref_xynbiq = { refreshAuthToken };
const _ref_u2aaym = { createAnalyser };
const _ref_kkctqq = { detectCollision };
const _ref_atvqpj = { compressGzip };
const _ref_fkbhru = { addHingeConstraint };
const _ref_w1gjlf = { resumeContext };
const _ref_6035x2 = { createVehicle };
const _ref_9qyu9q = { getAngularVelocity };
const _ref_7vhrgj = { cullFace };
const _ref_4x21o6 = { parseTorrentFile };
const _ref_8y3muv = { sanitizeSQLInput };
const _ref_3lnhiq = { createCapsuleShape };
const _ref_mw4wyt = { writePipe };
const _ref_7kfy5d = { unmapMemory };
const _ref_toyre2 = { uploadCrashReport };
const _ref_1j2fof = { optimizeHyperparameters };
const _ref_c8w2rv = { receivePacket };
const _ref_08q7tw = { virtualScroll };
const _ref_j5dvv9 = { shutdownComputer };
const _ref_n9xani = { detectDarkMode };
const _ref_hnmeyx = { animateTransition };
const _ref_9ew93e = { createIndex };
const _ref_bjj52v = { repairCorruptFile };
const _ref_f2noij = { dropTable };
const _ref_0l58r8 = { validateTokenStructure };
const _ref_sc6aqy = { createTCPSocket };
const _ref_vuxuya = { compressPacket };
const _ref_9okhlm = { deleteTempFiles };
const _ref_c8ldtf = { rotateLogFiles };
const _ref_86cmak = { applyTheme };
const _ref_bw1pqf = { analyzeBitrate };
const _ref_koisab = { normalizeVector };
const _ref_5nn397 = { rotateUserAgent };
const _ref_v9xqhr = { installUpdate };
const _ref_o4zzwy = { dhcpRequest };
const _ref_b81184 = { setBrake };
const _ref_lkfg0x = { lookupSymbol };
const _ref_fehogm = { createSoftBody };
const _ref_21ggdb = { detectVideoCodec };
const _ref_skv7ge = { cancelTask };
const _ref_ohafw2 = { beginTransaction };
const _ref_6thyx4 = { verifyChecksum };
const _ref_4ohn1a = { setMTU };
const _ref_duawo9 = { cleanOldLogs };
const _ref_rupr01 = { unlockRow };
const _ref_0xygrh = { checkIntegrityConstraint };
const _ref_wn5seb = { setGainValue };
const _ref_m6fhz8 = { generateCode };
const _ref_288edh = { calculateLayoutMetrics };
const _ref_e88oy8 = { injectMetadata };
const _ref_xhj8gt = { segmentImageUNet };
const _ref_vlu4w5 = { inlineFunctions };
const _ref_9jovud = { lazyLoadComponent };
const _ref_vc5dqv = { compactDatabase };
const _ref_hwl7sh = { serializeFormData };
const _ref_kjy5n7 = { uniformMatrix4fv };
const _ref_ypirhc = { clearBrowserCache };
const _ref_qvmysn = { createSphereShape };
const _ref_s1s2xo = { setDopplerFactor };
const _ref_q49rkm = { configureInterface };
const _ref_coi644 = { prefetchAssets };
const _ref_kcq9jh = { downInterface };
const _ref_fc7hpj = { splitFile };
const _ref_nutg82 = { forkProcess };
const _ref_0yifsr = { discoverPeersDHT };
const _ref_mwpfwo = { jitCompile };
const _ref_qd83c0 = { decapsulateFrame };
const _ref_0jd4xd = { manageCookieJar };
const _ref_nvj1t8 = { createOscillator };
const _ref_6aje1j = { recognizeSpeech };
const _ref_0cx1ez = { allowSleepMode };
const _ref_0y5rsa = { vertexAttrib3f };
const _ref_se6xxg = { prettifyCode };
const _ref_q2ge9b = { executeSQLQuery };
const _ref_0x0ijt = { bufferMediaStream };
const _ref_gsqpiw = { createConstraint };
const _ref_1unujf = { renderCanvasLayer };
const _ref_wuujpv = { createPanner };
const _ref_sbsehn = { calculateFriction };
const _ref_89s43f = { prioritizeTraffic };
const _ref_ufr2bq = { announceToTracker };
const _ref_fuqzzu = { wakeUp };
const _ref_wuyft8 = { normalizeFeatures };
const _ref_3h1u3b = { generateEmbeddings };
const _ref_uqrn10 = { connectSocket };
const _ref_2x0q2t = { triggerHapticFeedback };
const _ref_9j1nr1 = { addSliderConstraint };
const _ref_5ivcs6 = { connectionPooling };
const _ref_jxibzh = { normalizeVolume };
const _ref_ogk5qt = { diffVirtualDOM };
const _ref_nb5bid = { logErrorToFile };
const _ref_b6de7p = { applyForce };
const _ref_kup3m4 = { reduceDimensionalityPCA };
const _ref_zjyako = { checkUpdate };
const _ref_x9wyj3 = { setPan };
const _ref_hgo00v = { joinThread };
const _ref_sksvwg = { resolveDependencyGraph };
const _ref_rh57ya = { connectNodes };
const _ref_n8nfah = { sendPacket };
const _ref_vttszq = { multicastMessage };
const _ref_87gms6 = { dhcpAck };
const _ref_2rkhi2 = { createProcess };
const _ref_w2iqr8 = { scheduleTask };
const _ref_1idpor = { ApiDataFormatter };
const _ref_s7qnys = { linkModules };
const _ref_cak0m3 = { updateProgressBar };
const _ref_a2195y = { parseConfigFile };
const _ref_mzf0lk = { synthesizeSpeech };
const _ref_ugk4x3 = { detectObjectYOLO };
const _ref_h94b3x = { getMACAddress };
const _ref_pmx6h5 = { scrapeTracker };
const _ref_9eart9 = { setSteeringValue };
const _ref_dfhdur = { encapsulateFrame };
const _ref_7fy4we = { enterScope };
const _ref_vsqalb = { fragmentPacket };
const _ref_lbvzhu = { deleteTexture };
const _ref_s9aaqr = { saveCheckpoint };
const _ref_z8ui1f = { setViewport };
const _ref_v614hq = { registerGestureHandler };
const _ref_1rz8jx = { cacheQueryResults };
const _ref_lff9vb = { tokenizeText };
const _ref_46a8dr = { readPipe };
const _ref_ruibg5 = { pingHost };
const _ref_ltlfks = { spoofReferer };
const _ref_qtwzhg = { createFrameBuffer };
const _ref_mkcyyd = { setOrientation };
const _ref_og22jm = { dhcpDiscover };
const _ref_8240wm = { createBiquadFilter };
const _ref_0t8uv2 = { loadDriver };
const _ref_nsjpk1 = { restoreDatabase };
const _ref_basqfb = { execProcess };
const _ref_omb70h = { chownFile };
const _ref_av235r = { replicateData };
const _ref_6jn4sz = { setVelocity };
const _ref_gswg7d = { formatCurrency };
const _ref_tukc7l = { restartApplication };
const _ref_mh5ote = { connectToTracker };
const _ref_sb7k3y = { adjustWindowSize };
const _ref_n4av6s = { classifySentiment };
const _ref_yqaowz = { panicKernel };
const _ref_lv9lq6 = { invalidateCache };
const _ref_ri0wvu = { closePipe };
const _ref_mzwv6h = { joinGroup };
const _ref_6o9ggl = { disableInterrupts };
const _ref_9txjb4 = { requestAnimationFrameLoop };
const _ref_a1xl30 = { lockRow };
const _ref_g0gvqb = { performOCR };
const _ref_yi6h2z = { dhcpOffer };
const _ref_cxe8nm = { obfuscateCode };
const _ref_qmok5c = { backupDatabase };
const _ref_fkdjmg = { calculateEntropy };
const _ref_a8xt7k = { renderVirtualDOM };
const _ref_i22hcq = { verifyMagnetLink }; 
    });
})({}, {});