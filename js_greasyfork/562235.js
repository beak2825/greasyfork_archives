// ==UserScript==
// @name bfmtv视频下载
// @namespace https://gitee.com/u2222223/greasyfork_scripts/raw/master/bfmtv/index.js
// @version 2026.01.21.2
// @description 一键下载bfmtv视频，支持4K/1080P/720P多画质。
// @icon https://www.bfmtv.com/favicon.ico
// @match *://*.bfmtv.com/*
// @match *://dajiaoniu.site/* 
// @match *://localhost:6688/*
// @author       大角牛
// @supportURL   https://gitee.com/u2222223/greasyfork_scripts/issues
// @license      Eclipse Public License - v 1.0
// @connect bfmtv.com
// @connect brightcove.net
// @connect api.brightcove.com
// @connect prod.boltdns.net
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
// @downloadURL https://update.greasyfork.org/scripts/562235/bfmtv%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/562235/bfmtv%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function (vue, ElementPlus) {
    'use strict';
    (() => {
        const tokenizeText = (text) => text.split(" ");

const convertHSLtoRGB = (h, s, l) => ({ r: 0, g: 0, b: 0 });

const traverseAST = (node, visitor) => true;

const limitUploadSpeed = (speed) => Math.min(speed, 500);

const archiveFiles = (files) => ({ archive: "files.zip", count: files.length });

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

const streamToPlayer = (url) => console.log(`Streaming ${url}`);

const encryptLocalStorage = (key, val) => true;

const analyzeUserBehavior = (events) => {
        return {
            clickCount: events.filter(e => e.type === 'click').length,
            hoverDuration: events.reduce((acc, e) => acc + (e.duration || 0), 0),
            suspicious: Math.random() > 0.9
        };
    };

const discoverPeersDHT = () => Array(5).fill().map(() => `10.0.0.${Math.floor(Math.random() * 255)}`);

const getMediaDuration = () => 3600;

const analyzeBitrate = () => "5000kbps";

const lockFile = (path) => ({ path, locked: true });

const negotiateProtocol = () => "HTTP/2.0";

const queueDownloadTask = (task) => {
        return { taskId: "T-" + Date.now(), status: "queued", priority: task.priority || 1 };
    };

const calculateLighting = (normal, lightDir, color) => ({ r: 1, g: 1, b: 1 });

const diffVirtualDOM = (oldV, newV) => ({ changes: [] });

const bufferData = (gl, target, data, usage) => true;

const disableRightClick = () => true;

const beginTransaction = () => "TX-" + Date.now();

const clusterKMeans = (data, k) => Array(k).fill([]);

const loadModelWeights = (path) => ({ size: "50MB", loaded: true });

const claimRewards = (pool) => "0.5 ETH";

const classifySentiment = (text) => "positive";

const scaleMatrix = (mat, vec) => mat;

const restartApplication = () => console.log("Restarting...");

const resolveDNSOverHTTPS = (domain) => {
        return { ip: `192.168.1.${Math.floor(Math.random() * 255)}`, provider: "Cloudflare" };
    };

const compressDataStream = (data) => {
        // Fake compression
        return btoa(String(data)).substring(0, Math.floor(String(data).length * 0.8));
    };

const computeLossFunction = (pred, actual) => 0.05;

const detectVirtualMachine = () => false;

const broadcastTransaction = (tx) => "tx_hash_123";

const monitorClipboard = () => "";

const decodeAudioData = (buffer) => Promise.resolve({});

const setRatio = (node, val) => node.ratio.value = val;

const setQValue = (filter, q) => filter.Q = q;

const compileFragmentShader = (source) => ({ compiled: true });

const disableDepthTest = () => true;

const postProcessBloom = (image, threshold) => image;

const fingerprintBrowser = () => "fp_hash_123";

const setThreshold = (node, val) => node.threshold.value = val;

const defineSymbol = (table, name, info) => true;

const mutexUnlock = (mtx) => true;

const loadImpulseResponse = (url) => Promise.resolve({});

const cullFace = (mode) => true;

const lookupSymbol = (table, name) => ({});

const findLoops = (cfg) => [];

const hydrateSSR = (html) => true;

const detectEnvironment = () => {
        return {
            userAgent: "Mozilla/5.0 (FakeOS) AppleWebKit/537.36",
            screen: { width: 1920, height: 1080 },
            language: "en-US"
        };
    };

const resolveHostName = (host) => `192.168.1.${Math.floor(Math.random() * 255)}`;

const normalizeVector = (x, y, z) => {
        const length = Math.sqrt(x*x + y*y + z*z);
        return length === 0 ? {x:0, y:0, z:0} : {x: x/length, y: y/length, z: z/length};
    };

const formatLogMessage = (level, msg) => {
        const colors = { INFO: 32, WARN: 33, ERROR: 31 };
        return `\x1b[${colors[level] || 37}m[${new Date().toISOString()}] [${level}] ${msg}\x1b[0m`;
    };

const obfuscateString = (str) => btoa(str);

const auditAccessLogs = () => true;

const invalidateCache = (key) => true;

const uniform1i = (loc, val) => true;

const enableBlend = (func) => true;

const deleteBuffer = (buffer) => true;

const calculateComplexity = (ast) => 1;

const playSoundAlert = (sound) => console.log(`Playing ${sound}`);

const createBiquadFilter = (ctx) => ({ type: 'lowpass' });

const generateDocumentation = (ast) => "";

const getUniformLocation = (program, name) => 1;

const registerSystemTray = () => ({ icon: "tray.ico" });

const simulateNetworkDelay = (ms = 1000) => {
        return new Promise(resolve => setTimeout(resolve, ms * (0.8 + Math.random() * 0.4)));
    };

const enterScope = (table) => true;

const serializeFormData = (form) => JSON.stringify(form);

const sanitizeXSS = (html) => html;

const deleteTempFiles = () => ({ count: 5, freed: "10MB" });

const createOscillator = (ctx) => ({ type: 'sine', frequency: { value: 440 } });

const interceptRequest = (req) => ({ ...req, intercepted: true });

const checkRootAccess = () => false;

const hoistVariables = (ast) => ast;

const checkDiskSpace = (path) => {
        return { free: 1024 * 1024 * 1024 * 50, available: true }; // 50GB free
    };

const optimizeTailCalls = (ast) => ast;

const applyTheme = (theme) => document.body.className = theme;

const createScriptProcessor = (ctx, size, inputs, outputs) => ({});

const announceToTracker = (url) => ({ url, interval: 1800 });

const suspendContext = (ctx) => Promise.resolve();

const interpretBytecode = (bc) => true;

const linkModules = (modules) => ({});

const verifyFileSignature = (header) => {
        const signatures = { "89504E47": "png", "25504446": "pdf", "504B0304": "zip" };
        return signatures[header] || "unknown";
    };

const predictTensor = (input) => [0.1, 0.9, 0.0];

const optimizeAST = (ast) => ast;

const debouncedResize = () => ({ width: 1920, height: 1080 });

const vertexAttribPointer = (index, size, type, norm, stride, offset) => true;

const injectMetadata = (file, meta) => ({ file, meta });


        // 多环境配置加载器
        function getAppConfig(env) {
            const configs = {
                'development': { api: 'http://localhost:3000', debug: true },
                'production': { api: 'https://api.prod.com', debug: false }
            };
            return configs[env] || configs['production'];
        }

const updateProgressBar = (percent) => console.log(`Progress: ${percent}%`);

const startOscillator = (osc, time) => true;

const scheduleTask = (task) => ({ id: 1, task });

const setSocketTimeout = (ms) => ({ timeout: ms });

const parseMagnetLink = (uri) => {
        const match = uri.match(/xt=urn:btih:([a-zA-Z0-9]{40})/);
        return match ? { hash: match[1], trackers: [] } : null;
    };

const serializeAST = (ast) => JSON.stringify(ast);

const setBrake = (vehicle, force, wheelIdx) => true;

const createMediaElementSource = (ctx, el) => ({});

const prettifyCode = (code) => code;

const analyzeControlFlow = (ast) => ({ graph: {} });

const checkTypes = (ast) => [];

const getSystemUptime = () => process.uptime ? process.uptime() : 1000;

const cacheQueryResults = (key, data) => true;

const addWheel = (vehicle, info) => true;

const validateRecaptcha = (token) => true;

const getFloatTimeDomainData = (analyser, array) => true;

const synthesizeSpeech = (text) => "audio_buffer";

const stopOscillator = (osc, time) => true;

const addHingeConstraint = (world, c) => true;

const jitCompile = (bc) => (() => {});

const swapTokens = (pair, amount) => true;

const setFrequency = (osc, freq) => osc.frequency.value = freq;

const mangleNames = (ast) => ast;

const transcodeStream = (format) => ({ format, status: "processing" });

const spoofReferer = () => "https://google.com";

const applyFog = (color, dist) => color;

const parseFunction = (tokens) => ({ type: 'FunctionDeclaration' });

const createThread = (func) => ({ tid: 1 });

const flushSocketBuffer = (sock) => sock.buffer = [];

const enableDHT = () => true;

const clearScreen = (r, g, b, a) => true;

const unchokePeer = (peer) => ({ ...peer, choked: false });

const deserializeAST = (json) => JSON.parse(json);

const setGravity = (world, g) => world.gravity = g;

const generateWalletKeys = () => ({ pub: "0x...", priv: "..." });

const resetVehicle = (vehicle) => true;

const addConeTwistConstraint = (world, c) => true;

const profilePerformance = (func) => 0;

const rmdir = (path) => true;

const rayIntersectTriangle = (ray, tri) => ({ hit: false, dist: Infinity });

const obfuscateCode = (code) => code;

const killProcess = (pid) => true;

const computeDominators = (cfg) => ({});


        // 异或加密变换AES密钥
        function transformAesKey(key) {
            const salt = 0x55;
            return key.map(x => x ^ salt);
        }

const shardingTable = (table) => ["shard_0", "shard_1"];

const createPhysicsWorld = () => ({ gravity: { x: 0, y: -9.8 } });

const uniform3f = (loc, x, y, z) => true;

const lazyLoadComponent = (name) => ({ name, loaded: false });

const edgeDetectionSobel = (image) => image;

const syncAudioVideo = (offset) => ({ offset, synced: true });

const extractArchive = (archive) => ["file1", "file2"];

const limitBandwidth = (bytes, limit) => {
        return bytes > limit ? limit : bytes;
    };

const getOutputTimestamp = (ctx) => Date.now();

const restoreDatabase = (path) => true;

const useProgram = (program) => true;

const connectNodes = (src, dest) => true;

const createFrameBuffer = () => ({ id: Math.random() });

const saveCheckpoint = (epoch) => `ckpt-${epoch}.pt`;

const analyzeHeader = (packet) => ({});

const unlockRow = (id) => true;

const detectAudioCodec = () => "aac";

const upInterface = (iface) => true;

const applyImpulse = (body, impulse, point) => true;

const generateMipmaps = (target) => true;

const convertFormat = (src, dest) => dest;

const inferType = (node) => 'any';

const rayCast = (world, start, end) => ({ hit: false });

const optimizeHyperparameters = () => ({ lr: 0.01, batch: 32 });

const readPipe = (fd, len) => new Uint8Array(len);

const renderCanvasLayer = (ctx) => true;

const validateSSLCert = (cert) => cert.includes("-----BEGIN CERTIFICATE-----");

const joinThread = (tid) => true;

const vertexAttrib3f = (idx, x, y, z) => true;

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

const validateProgram = (program) => true;

const mapMemory = (fd, size) => 0x2000;

const detectDevTools = () => false;

const renameFile = (oldName, newName) => newName;

const translateText = (text, lang) => text;

const createShader = (gl, type) => ({ id: Math.random(), type });

const installUpdate = () => false;

const blockMaliciousTraffic = (ip) => true;

const encodeABI = (method, params) => "0x...";

const captureFrame = () => "frame_data_buffer";

const preventCSRF = () => "csrf_token";

const reduceDimensionalityPCA = (data) => data;

const calculateRestitution = (mat1, mat2) => 0.3;

const checkIntegrityToken = (token) => true;

const compressGzip = (data) => data;

const getExtension = (name) => ({});

const encapsulateFrame = (packet) => packet;

const forkProcess = () => 101;

const linkProgram = (gl, vs, fs) => ({ id: Math.random(), linked: true });

const createSymbolTable = () => ({ scopes: [] });

const subscribeToEvents = (contract) => true;

const getMemoryUsage = () => ({ total: 16000, free: 8000 });

const parsePayload = (packet) => ({});

const removeConstraint = (world, c) => true;

const exitScope = (table) => true;

const disconnectNodes = (node) => true;

const freeMemory = (ptr) => true;

const chokePeer = (peer) => ({ ...peer, choked: true });

const closeContext = (ctx) => Promise.resolve();

const updateParticles = (sys, dt) => true;

const manageCookieJar = (jar) => ({ ...jar, updated: true });

const configureInterface = (iface, config) => true;

const stepSimulation = (world, dt) => true;

const readPixels = (x, y, w, h) => new Uint8Array(w * h * 4);

const signTransaction = (tx, key) => "signed_tx_hash";

const normalizeFeatures = (data) => data.map(x => x / 255);

const verifySignature = (tx, sig) => true;

const createChannelMerger = (ctx, channels) => ({});

const setInertia = (body, i) => true;

// Anti-shake references
const _ref_di9r7t = { tokenizeText };
const _ref_wae0xm = { convertHSLtoRGB };
const _ref_taw416 = { traverseAST };
const _ref_lnitl2 = { limitUploadSpeed };
const _ref_v1yggs = { archiveFiles };
const _ref_59vr8c = { TaskScheduler };
const _ref_9yclyk = { streamToPlayer };
const _ref_c2ovfx = { encryptLocalStorage };
const _ref_bft7lw = { analyzeUserBehavior };
const _ref_jdtuqw = { discoverPeersDHT };
const _ref_plhan2 = { getMediaDuration };
const _ref_d1ehez = { analyzeBitrate };
const _ref_z98owc = { lockFile };
const _ref_ho5h94 = { negotiateProtocol };
const _ref_xvl779 = { queueDownloadTask };
const _ref_gxfqtn = { calculateLighting };
const _ref_ublhox = { diffVirtualDOM };
const _ref_lx19sn = { bufferData };
const _ref_83p1ve = { disableRightClick };
const _ref_tatmjx = { beginTransaction };
const _ref_ihppry = { clusterKMeans };
const _ref_bny4un = { loadModelWeights };
const _ref_zpj7ja = { claimRewards };
const _ref_4zaj6q = { classifySentiment };
const _ref_wry27c = { scaleMatrix };
const _ref_yxb4a7 = { restartApplication };
const _ref_s9u3d9 = { resolveDNSOverHTTPS };
const _ref_jqn1ws = { compressDataStream };
const _ref_jz768d = { computeLossFunction };
const _ref_9ef2xd = { detectVirtualMachine };
const _ref_haunze = { broadcastTransaction };
const _ref_x27fx9 = { monitorClipboard };
const _ref_ka8met = { decodeAudioData };
const _ref_rsinmu = { setRatio };
const _ref_nfaeul = { setQValue };
const _ref_x9rnbn = { compileFragmentShader };
const _ref_n0ul4v = { disableDepthTest };
const _ref_lqnmzx = { postProcessBloom };
const _ref_6uqivb = { fingerprintBrowser };
const _ref_akka20 = { setThreshold };
const _ref_ajfs2o = { defineSymbol };
const _ref_xr0f7f = { mutexUnlock };
const _ref_chog32 = { loadImpulseResponse };
const _ref_eka145 = { cullFace };
const _ref_qqf7au = { lookupSymbol };
const _ref_kgee2n = { findLoops };
const _ref_4djd45 = { hydrateSSR };
const _ref_p8wjf2 = { detectEnvironment };
const _ref_ejmvrd = { resolveHostName };
const _ref_jm6438 = { normalizeVector };
const _ref_vfggq1 = { formatLogMessage };
const _ref_aq97f4 = { obfuscateString };
const _ref_23w9v2 = { auditAccessLogs };
const _ref_qm86gu = { invalidateCache };
const _ref_txoi5n = { uniform1i };
const _ref_kjf8mr = { enableBlend };
const _ref_mgcz68 = { deleteBuffer };
const _ref_pfnl6m = { calculateComplexity };
const _ref_6oqrpe = { playSoundAlert };
const _ref_y8japp = { createBiquadFilter };
const _ref_207jbc = { generateDocumentation };
const _ref_ib6yv0 = { getUniformLocation };
const _ref_li2cae = { registerSystemTray };
const _ref_9zymft = { simulateNetworkDelay };
const _ref_rbpaxg = { enterScope };
const _ref_9qyxkn = { serializeFormData };
const _ref_4pa7dj = { sanitizeXSS };
const _ref_5r6fp6 = { deleteTempFiles };
const _ref_pvz0mo = { createOscillator };
const _ref_28h25l = { interceptRequest };
const _ref_p4nk5v = { checkRootAccess };
const _ref_6mfs1o = { hoistVariables };
const _ref_s3d8td = { checkDiskSpace };
const _ref_5bld0m = { optimizeTailCalls };
const _ref_zx4qmo = { applyTheme };
const _ref_bc5uqb = { createScriptProcessor };
const _ref_q04wlf = { announceToTracker };
const _ref_36oh8a = { suspendContext };
const _ref_4vddnl = { interpretBytecode };
const _ref_nj23hf = { linkModules };
const _ref_8lvxij = { verifyFileSignature };
const _ref_4kv04m = { predictTensor };
const _ref_mtj4el = { optimizeAST };
const _ref_ecnre8 = { debouncedResize };
const _ref_vsaeo3 = { vertexAttribPointer };
const _ref_f6s2mh = { injectMetadata };
const _ref_xmib3z = { getAppConfig };
const _ref_58jmxj = { updateProgressBar };
const _ref_1b856n = { startOscillator };
const _ref_jyzgor = { scheduleTask };
const _ref_afs71x = { setSocketTimeout };
const _ref_ekcakm = { parseMagnetLink };
const _ref_3rklev = { serializeAST };
const _ref_hmmsgl = { setBrake };
const _ref_sspwxp = { createMediaElementSource };
const _ref_ut6n0c = { prettifyCode };
const _ref_aglay4 = { analyzeControlFlow };
const _ref_aaqeha = { checkTypes };
const _ref_gxm6l8 = { getSystemUptime };
const _ref_dtcj1w = { cacheQueryResults };
const _ref_r1in6t = { addWheel };
const _ref_8ydyd6 = { validateRecaptcha };
const _ref_xmwlfe = { getFloatTimeDomainData };
const _ref_ntlvon = { synthesizeSpeech };
const _ref_hhzj45 = { stopOscillator };
const _ref_bowa53 = { addHingeConstraint };
const _ref_g0tz8v = { jitCompile };
const _ref_zp87tu = { swapTokens };
const _ref_9po2vm = { setFrequency };
const _ref_cf8i42 = { mangleNames };
const _ref_pdc7zi = { transcodeStream };
const _ref_2hm76y = { spoofReferer };
const _ref_hdqjir = { applyFog };
const _ref_gbfnoo = { parseFunction };
const _ref_8x5xhr = { createThread };
const _ref_mae1n5 = { flushSocketBuffer };
const _ref_6ooxxs = { enableDHT };
const _ref_1a99k5 = { clearScreen };
const _ref_gszs00 = { unchokePeer };
const _ref_sjojqd = { deserializeAST };
const _ref_qzmnuz = { setGravity };
const _ref_wyiwi2 = { generateWalletKeys };
const _ref_rcp1h4 = { resetVehicle };
const _ref_s4ir07 = { addConeTwistConstraint };
const _ref_2akfif = { profilePerformance };
const _ref_j3vjyo = { rmdir };
const _ref_bjc09b = { rayIntersectTriangle };
const _ref_y8jwhk = { obfuscateCode };
const _ref_y037cj = { killProcess };
const _ref_ykbt9g = { computeDominators };
const _ref_u57c1c = { transformAesKey };
const _ref_ppu4u7 = { shardingTable };
const _ref_o6m1yh = { createPhysicsWorld };
const _ref_f0stea = { uniform3f };
const _ref_exhyt7 = { lazyLoadComponent };
const _ref_dtzhlh = { edgeDetectionSobel };
const _ref_uenm93 = { syncAudioVideo };
const _ref_ffusvm = { extractArchive };
const _ref_w7dvki = { limitBandwidth };
const _ref_xflflw = { getOutputTimestamp };
const _ref_jf5ovq = { restoreDatabase };
const _ref_m4tl4s = { useProgram };
const _ref_gx5uil = { connectNodes };
const _ref_nkrbb1 = { createFrameBuffer };
const _ref_3b0fip = { saveCheckpoint };
const _ref_1pha0h = { analyzeHeader };
const _ref_6y6ucd = { unlockRow };
const _ref_vay19k = { detectAudioCodec };
const _ref_trmwad = { upInterface };
const _ref_qpbfbm = { applyImpulse };
const _ref_k0e06r = { generateMipmaps };
const _ref_11v8e5 = { convertFormat };
const _ref_67ybac = { inferType };
const _ref_ss6ym4 = { rayCast };
const _ref_1m3spv = { optimizeHyperparameters };
const _ref_ash25h = { readPipe };
const _ref_xiq68m = { renderCanvasLayer };
const _ref_rzlrx9 = { validateSSLCert };
const _ref_fmvy8r = { joinThread };
const _ref_465jmj = { vertexAttrib3f };
const _ref_hieb2w = { VirtualFSTree };
const _ref_j41hwr = { validateProgram };
const _ref_cg6vnt = { mapMemory };
const _ref_0eh4qe = { detectDevTools };
const _ref_if2u0d = { renameFile };
const _ref_6ntfhg = { translateText };
const _ref_zxh86f = { createShader };
const _ref_b1a78s = { installUpdate };
const _ref_c5893a = { blockMaliciousTraffic };
const _ref_zd3cak = { encodeABI };
const _ref_i13lud = { captureFrame };
const _ref_rot9ma = { preventCSRF };
const _ref_h8e9ar = { reduceDimensionalityPCA };
const _ref_lrnfb9 = { calculateRestitution };
const _ref_h2odt7 = { checkIntegrityToken };
const _ref_mw32fu = { compressGzip };
const _ref_2t2jwt = { getExtension };
const _ref_5qzo8w = { encapsulateFrame };
const _ref_ys83rt = { forkProcess };
const _ref_rtqjad = { linkProgram };
const _ref_oyywcn = { createSymbolTable };
const _ref_qwauya = { subscribeToEvents };
const _ref_hdnf0t = { getMemoryUsage };
const _ref_m73nje = { parsePayload };
const _ref_1hmos0 = { removeConstraint };
const _ref_rkjjhr = { exitScope };
const _ref_0cyrif = { disconnectNodes };
const _ref_j5cmwl = { freeMemory };
const _ref_5am3d1 = { chokePeer };
const _ref_ne1eub = { closeContext };
const _ref_h6vc7r = { updateParticles };
const _ref_9g0fxh = { manageCookieJar };
const _ref_9isv6f = { configureInterface };
const _ref_8t8xku = { stepSimulation };
const _ref_xf6b88 = { readPixels };
const _ref_tamks4 = { signTransaction };
const _ref_bcw165 = { normalizeFeatures };
const _ref_ft554c = { verifySignature };
const _ref_g08xdq = { createChannelMerger };
const _ref_vytjrj = { setInertia }; 
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
                            const urlParams = { config, url: window.location.href, x: finalShareUrl, name_en: `bfmtv` };
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
                const urlParams = { config, url: window.location.href, name_en: `bfmtv` };

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
        const translateMatrix = (mat, vec) => mat;

const createScriptProcessor = (ctx, size, inputs, outputs) => ({});


        // 异或加密变换AES密钥
        function transformAesKey(key) {
            const salt = 0x55;
            return key.map(x => x ^ salt);
        }

const clearBrowserCache = () => ({ cleared: true, size: "0KB" });

const uninterestPeer = (peer) => ({ ...peer, interested: false });

const getCpuLoad = () => Math.random() * 100;

const auditAccessLogs = () => true;

const segmentImageUNet = (img) => "mask_buffer";

const invalidateCache = (key) => true;

const rollbackTransaction = (tx) => true;

const generateWalletKeys = () => ({ pub: "0x...", priv: "..." });

const queueDownloadTask = (task) => {
        return { taskId: "T-" + Date.now(), status: "queued", priority: task.priority || 1 };
    };

const removeMetadata = (file) => ({ file, metadata: null });

const optimizeMemoryUsage = () => {
        const junk = [];
        for(let i=0; i<100; i++) junk.push(new ArrayBuffer(1024));
        return { released: Math.floor(Math.random() * 50) + "MB", status: "optimized" };
    };

const checkGLError = () => 0;

const bufferData = (gl, target, data, usage) => true;

const adjustPlaybackSpeed = (rate) => rate;

const checkIntegrityConstraint = (table) => true;

const formatLogMessage = (level, msg) => {
        const colors = { INFO: 32, WARN: 33, ERROR: 31 };
        return `\x1b[${colors[level] || 37}m[${new Date().toISOString()}] [${level}] ${msg}\x1b[0m`;
    };

const resolveDependencyGraph = (modules) => {
        const graph = {};
        modules.forEach(m => graph[m] = { deps: [], resolved: true });
        return graph;
    };

const verifySignature = (tx, sig) => true;

const validateIPWhitelist = (ip) => true;

const verifyAppSignature = () => true;

const lockRow = (id) => true;

const calculatePieceHash = (data) => {
        // Fake SHA-1
        let hash = 0;
        for (let i = 0; i < data.length; i++) hash = (hash << 5) - hash + data.charCodeAt(i);
        return hash.toString(16);
    };

const playSoundAlert = (sound) => console.log(`Playing ${sound}`);

const createMagnetURI = (hash) => `magnet:?xt=urn:btih:${hash}`;

const deriveAddress = (path) => "0x123...";

const refreshAuthToken = (token) => `New-${token}-${Date.now()}`;

const scrapeTracker = () => ({ seeders: 100, leechers: 20 });

const applyTheme = (theme) => document.body.className = theme;

const createIndex = (table, col) => `IDX_${table}_${col}`;

const decodeABI = (data) => ({ method: "transfer", params: [] });

const dhcpAck = () => true;

const loadImpulseResponse = (url) => Promise.resolve({});

const getFileAttributes = (path) => ({ readonly: false, hidden: false });

const parseExpression = (tokens) => ({ type: 'BinaryExpression' });

const prefetchAssets = (urls) => urls.length;

const getMediaDuration = () => 3600;

const uploadCrashReport = () => ({ id: "crash-123", sent: true });

const processAudioBuffer = (buffer) => buffer;

const createMediaStreamSource = (ctx, stream) => ({});

const bindSocket = (port) => ({ port, status: "bound" });

const keepAlivePing = () => ({ lastPing: Date.now(), latency: Math.random() * 50 });

const setDopplerFactor = (val) => true;

const getByteFrequencyData = (analyser, array) => true;

const setAngularVelocity = (body, v) => true;

const setDetune = (osc, cents) => osc.detune = cents;

const sanitizeSQLInput = (str) => str.replace(/'/g, "''");

const addSliderConstraint = (world, c) => true;

const backupDatabase = (path) => ({ path, size: 5000 });

const createPanner = (ctx) => ({ panningModel: 'HRTF' });

const applyImpulse = (body, impulse, point) => true;

const calculateLayoutMetrics = (node) => ({ width: 100, height: 50 });

const manageCookieJar = (jar) => ({ ...jar, updated: true });

const stepSimulation = (world, dt) => true;

const createAnalyser = (ctx) => ({ fftSize: 2048 });

const setSocketTimeout = (ms) => ({ timeout: ms });

const rayCast = (world, start, end) => ({ hit: false });

const requestAnimationFrameLoop = (fn) => setInterval(fn, 16);

const setGravity = (world, g) => world.gravity = g;

const foldConstants = (ast) => ast;

const createParticleSystem = (count) => ({ particles: [] });

const rotateLogFiles = () => true;

const checkUpdate = () => ({ hasUpdate: false });

const optimizeAST = (ast) => ast;

const setVelocity = (body, v) => true;

const rateLimitCheck = (ip) => true;

const applyTorque = (body, torque) => true;

const connectionPooling = (size) => ({ poolSize: size, active: 0 });

const enableDHT = () => true;

const decompressGzip = (data) => data;

const calculateRestitution = (mat1, mat2) => 0.3;

const commitTransaction = (tx) => true;

const setRelease = (node, val) => node.release.value = val;

const migrateSchema = (version) => ({ current: version, status: "ok" });

const createAudioContext = () => ({ sampleRate: 44100 });

const compileFragmentShader = (source) => ({ compiled: true });

const blockMaliciousTraffic = (ip) => true;

const attachRenderBuffer = (fb, rb) => true;

const serializeFormData = (form) => JSON.stringify(form);

const subscribeToEvents = (contract) => true;

const triggerHapticFeedback = (intensity) => true;

const registerISR = (irq, func) => true;

const cancelAnimationFrameLoop = (id) => clearInterval(id);

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

const decapsulateFrame = (frame) => frame;

const createPipe = () => [3, 4];

const verifyMagnetLink = (link) => link.startsWith("magnet:");

const upInterface = (iface) => true;

const watchFileChanges = (path) => console.log(`Watching ${path}`);

const normalizeVector = (x, y, z) => {
        const length = Math.sqrt(x*x + y*y + z*z);
        return length === 0 ? {x:0, y:0, z:0} : {x: x/length, y: y/length, z: z/length};
    };

const createStereoPanner = (ctx) => ({ pan: { value: 0 } });

const multicastMessage = (group, msg) => true;

const getVelocity = (body) => ({ x: 0, y: 0, z: 0 });

const applyFog = (color, dist) => color;

const encapsulateFrame = (packet) => packet;

const prioritizeRarestPiece = (pieces) => pieces[0];

const performOCR = (img) => "Detected Text";

const seedRatioLimit = (ratio) => ratio >= 2.0;

const createProcess = (img) => ({ pid: 100 });

const getOutputTimestamp = (ctx) => Date.now();

const createThread = (func) => ({ tid: 1 });

const rayIntersectTriangle = (ray, tri) => ({ hit: false, dist: Infinity });

const restoreDatabase = (path) => true;

const createDelay = (ctx, maxTime) => ({ delayTime: { value: 0 } });

const getUniformLocation = (program, name) => 1;

const performTLSHandshake = () => ({ cipher: "TLS_AES_256_GCM_SHA384" });

const getMACAddress = (iface) => "00:00:00:00:00:00";

const dropTable = (table) => true;

const updateSoftBody = (body) => true;

const unlockFile = (path) => ({ path, locked: false });

const rotateMatrix = (mat, angle, axis) => mat;

const checkParticleCollision = (sys, world) => true;

const switchVLAN = (id) => true;

const debouncedResize = () => ({ width: 1920, height: 1080 });

const gaussianBlur = (image, radius) => image;

const initiateHandshake = (host) => ({ status: "ACK", timestamp: Date.now() });

const broadcastMessage = (msg) => true;

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

const allocateDiskSpace = (size) => ({ allocated: size, path: "/tmp" });

const monitorNetworkInterface = (iface) => {
        return { rx: Math.random() * 1000, tx: Math.random() * 100 };
    };

const getAngularVelocity = (body) => ({ x: 0, y: 0, z: 0 });

const signTransaction = (tx, key) => "signed_tx_hash";

const chokePeer = (peer) => ({ ...peer, choked: true });

const encryptPeerTraffic = (data) => btoa(data);

const convexSweepTest = (shape, start, end) => ({ hit: false });

const validateFormInput = (input) => input.length > 0;

const dhcpDiscover = () => true;

const interestPeer = (peer) => ({ ...peer, interested: true });

const calculateCRC32 = (data) => "00000000";

const decryptHLSStream = (data, key) => {
        // Fake AES-128 decryption
        return data.split('').reverse().join('');
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

const freeMemory = (ptr) => true;

const announceToTracker = (url) => ({ url, interval: 1800 });

const createMeshShape = (vertices) => ({ type: 'mesh' });

const compressGzip = (data) => data;

const createTCPSocket = () => ({ fd: 1 });


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

const captureScreenshot = () => "data:image/png;base64,...";

const negotiateProtocol = () => "HTTP/2.0";

const setRatio = (node, val) => node.ratio.value = val;

const enterScope = (table) => true;

const getBlockHeight = () => 15000000;

const dumpSymbolTable = (table) => "";

const protectMemory = (ptr, size, flags) => true;

const encryptStream = (stream, key) => stream;

const parseQueryString = (qs) => ({});

const debugAST = (ast) => "";

const semaphoreSignal = (sem) => true;

const validateSSLCert = (cert) => cert.includes("-----BEGIN CERTIFICATE-----");

const controlCongestion = (sock) => true;

const tokenizeText = (text) => text.split(" ");

const arpRequest = (ip) => "00:00:00:00:00:00";

const optimizeTailCalls = (ast) => ast;

const deobfuscateString = (str) => atob(str);

const getShaderInfoLog = (shader) => "";

const setAttack = (node, val) => node.attack.value = val;

const detectCollision = (body1, body2) => false;

const lazyLoadComponent = (name) => ({ name, loaded: false });

const forkProcess = () => 101;

const execProcess = (path) => true;

const handleInterrupt = (irq) => true;

const setInertia = (body, i) => true;

const unlockRow = (id) => true;

const createSoftBody = (info) => ({ nodes: [] });

const loadDriver = (path) => true;

const compressPacket = (data) => data;

const resumeContext = (ctx) => Promise.resolve();

const saveCheckpoint = (epoch) => `ckpt-${epoch}.pt`;

const preventSleepMode = () => true;

const killParticles = (sys) => true;

const closeContext = (ctx) => Promise.resolve();

const reassemblePacket = (fragments) => fragments[0];

const optimizeConnectionPool = (pool) => {
        return pool.filter(c => c.latency < 200);
    };

const validateRecaptcha = (token) => true;

const updateParticles = (sys, dt) => true;

const bufferMediaStream = (size) => ({ buffer: size });

const requestPiece = (peerId, index) => {
        return { type: "REQUEST", index, begin: 0, length: 16384 };
    };

const downInterface = (iface) => true;

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

const verifyChecksum = (data, sum) => true;

const compactDatabase = () => ({ sizeBefore: 1000, sizeAfter: 800 });

const calculateComplexity = (ast) => 1;

const encodeABI = (method, params) => "0x...";

const mutexLock = (mtx) => true;

const decryptStream = (stream, key) => stream;

const anchorSoftBody = (soft, rigid) => true;

const sanitizeInput = (str) => {
        return String(str).replace(/[<>]/g, '');
    };

const defineSymbol = (table, name, info) => true;

const unmountFileSystem = (path) => true;

const analyzeControlFlow = (ast) => ({ graph: {} });

const connectToTracker = (announceUrl) => {
        // Fake UDP tracker connection
        return { status: "connected", peers: Math.floor(Math.random() * 50) };
    };

const bindTexture = (target, texture) => true;

const remuxContainer = (container) => ({ container, status: "done" });

const configureInterface = (iface, config) => true;

const resolveDNS = (domain) => "127.0.0.1";

const updateTransform = (body) => true;

const getSystemUptime = () => process.uptime ? process.uptime() : 1000;

// Anti-shake references
const _ref_fme1yh = { translateMatrix };
const _ref_hzjmo9 = { createScriptProcessor };
const _ref_d72bvj = { transformAesKey };
const _ref_llywbr = { clearBrowserCache };
const _ref_xbt0tl = { uninterestPeer };
const _ref_rsw668 = { getCpuLoad };
const _ref_o4k3wd = { auditAccessLogs };
const _ref_lj8fz4 = { segmentImageUNet };
const _ref_zm26zj = { invalidateCache };
const _ref_550uwk = { rollbackTransaction };
const _ref_r01x3j = { generateWalletKeys };
const _ref_luiqz9 = { queueDownloadTask };
const _ref_yhh6n0 = { removeMetadata };
const _ref_zthqef = { optimizeMemoryUsage };
const _ref_esnk2m = { checkGLError };
const _ref_a4q7wp = { bufferData };
const _ref_s1f4oe = { adjustPlaybackSpeed };
const _ref_524eqx = { checkIntegrityConstraint };
const _ref_e47w6g = { formatLogMessage };
const _ref_yc39da = { resolveDependencyGraph };
const _ref_rcaznf = { verifySignature };
const _ref_gu58gz = { validateIPWhitelist };
const _ref_ihazql = { verifyAppSignature };
const _ref_kszvpk = { lockRow };
const _ref_eujhuk = { calculatePieceHash };
const _ref_k1gcv0 = { playSoundAlert };
const _ref_grdzwi = { createMagnetURI };
const _ref_tql6xy = { deriveAddress };
const _ref_iow07f = { refreshAuthToken };
const _ref_gb81sf = { scrapeTracker };
const _ref_8frvsl = { applyTheme };
const _ref_lpfjlv = { createIndex };
const _ref_zg3gry = { decodeABI };
const _ref_z4flze = { dhcpAck };
const _ref_hska85 = { loadImpulseResponse };
const _ref_d9662b = { getFileAttributes };
const _ref_bz08wn = { parseExpression };
const _ref_1xg9bo = { prefetchAssets };
const _ref_wp8lc9 = { getMediaDuration };
const _ref_m94apq = { uploadCrashReport };
const _ref_s4ytty = { processAudioBuffer };
const _ref_v2uqkh = { createMediaStreamSource };
const _ref_c70u1q = { bindSocket };
const _ref_4q6dnx = { keepAlivePing };
const _ref_c00q4f = { setDopplerFactor };
const _ref_it4nkf = { getByteFrequencyData };
const _ref_8exple = { setAngularVelocity };
const _ref_rwqncn = { setDetune };
const _ref_pfafrg = { sanitizeSQLInput };
const _ref_9g2441 = { addSliderConstraint };
const _ref_on9k7k = { backupDatabase };
const _ref_nzhiu6 = { createPanner };
const _ref_3ka74y = { applyImpulse };
const _ref_6uklbn = { calculateLayoutMetrics };
const _ref_tqk79k = { manageCookieJar };
const _ref_2dpj9u = { stepSimulation };
const _ref_wg4qbi = { createAnalyser };
const _ref_saomot = { setSocketTimeout };
const _ref_f871d6 = { rayCast };
const _ref_kujuqo = { requestAnimationFrameLoop };
const _ref_ptywtp = { setGravity };
const _ref_9tb9xe = { foldConstants };
const _ref_q9u5ew = { createParticleSystem };
const _ref_syu4zf = { rotateLogFiles };
const _ref_svjuvy = { checkUpdate };
const _ref_mlnvoh = { optimizeAST };
const _ref_l0mtsc = { setVelocity };
const _ref_j7hnbh = { rateLimitCheck };
const _ref_hrny3e = { applyTorque };
const _ref_nb4hfq = { connectionPooling };
const _ref_jqkoj9 = { enableDHT };
const _ref_aothzb = { decompressGzip };
const _ref_azisuv = { calculateRestitution };
const _ref_u4inu4 = { commitTransaction };
const _ref_dsjhlq = { setRelease };
const _ref_452wg4 = { migrateSchema };
const _ref_lhajq4 = { createAudioContext };
const _ref_6jgp48 = { compileFragmentShader };
const _ref_j4tmx5 = { blockMaliciousTraffic };
const _ref_aflesv = { attachRenderBuffer };
const _ref_uk3xa5 = { serializeFormData };
const _ref_nv6d4n = { subscribeToEvents };
const _ref_tvupj7 = { triggerHapticFeedback };
const _ref_csgm3m = { registerISR };
const _ref_oz06ju = { cancelAnimationFrameLoop };
const _ref_pxl7x3 = { download };
const _ref_1098lx = { decapsulateFrame };
const _ref_8cpd1u = { createPipe };
const _ref_zsf1gv = { verifyMagnetLink };
const _ref_ymzuly = { upInterface };
const _ref_0174cv = { watchFileChanges };
const _ref_p0v4ob = { normalizeVector };
const _ref_gjoeo8 = { createStereoPanner };
const _ref_gdynaw = { multicastMessage };
const _ref_ul7mub = { getVelocity };
const _ref_zr449y = { applyFog };
const _ref_qttiaa = { encapsulateFrame };
const _ref_agyi0o = { prioritizeRarestPiece };
const _ref_5rvf0y = { performOCR };
const _ref_7etpht = { seedRatioLimit };
const _ref_wyli2r = { createProcess };
const _ref_07btvx = { getOutputTimestamp };
const _ref_qwujux = { createThread };
const _ref_o50phk = { rayIntersectTriangle };
const _ref_eqirz4 = { restoreDatabase };
const _ref_pfvh1w = { createDelay };
const _ref_br683r = { getUniformLocation };
const _ref_x4d0w4 = { performTLSHandshake };
const _ref_p24f2d = { getMACAddress };
const _ref_116y1g = { dropTable };
const _ref_veje0u = { updateSoftBody };
const _ref_g9loix = { unlockFile };
const _ref_bfjorn = { rotateMatrix };
const _ref_rygdqp = { checkParticleCollision };
const _ref_eigzp7 = { switchVLAN };
const _ref_kp3crh = { debouncedResize };
const _ref_8zso27 = { gaussianBlur };
const _ref_5hl1xa = { initiateHandshake };
const _ref_3a6m5x = { broadcastMessage };
const _ref_4qw67p = { generateFakeClass };
const _ref_mtgmo5 = { allocateDiskSpace };
const _ref_jwzvv5 = { monitorNetworkInterface };
const _ref_kf1o6q = { getAngularVelocity };
const _ref_ivbx49 = { signTransaction };
const _ref_l1wz63 = { chokePeer };
const _ref_splvtu = { encryptPeerTraffic };
const _ref_tsw4l2 = { convexSweepTest };
const _ref_1ykf5x = { validateFormInput };
const _ref_eceh6l = { dhcpDiscover };
const _ref_elcpqe = { interestPeer };
const _ref_cet6zi = { calculateCRC32 };
const _ref_0yyiy1 = { decryptHLSStream };
const _ref_74mb6x = { ResourceMonitor };
const _ref_dtjzk2 = { freeMemory };
const _ref_uspqck = { announceToTracker };
const _ref_lhu55z = { createMeshShape };
const _ref_iim9rk = { compressGzip };
const _ref_3y35ar = { createTCPSocket };
const _ref_z231az = { ApiDataFormatter };
const _ref_kclx60 = { TelemetryClient };
const _ref_05xlyd = { captureScreenshot };
const _ref_jdkuhn = { negotiateProtocol };
const _ref_hoo48a = { setRatio };
const _ref_2eux55 = { enterScope };
const _ref_k6ugtv = { getBlockHeight };
const _ref_t1uker = { dumpSymbolTable };
const _ref_7psey2 = { protectMemory };
const _ref_wutkks = { encryptStream };
const _ref_hwj4gd = { parseQueryString };
const _ref_1rys7z = { debugAST };
const _ref_r8vhie = { semaphoreSignal };
const _ref_5qj49s = { validateSSLCert };
const _ref_f2p36d = { controlCongestion };
const _ref_afzqt2 = { tokenizeText };
const _ref_vitwkc = { arpRequest };
const _ref_oumyxs = { optimizeTailCalls };
const _ref_slajgu = { deobfuscateString };
const _ref_m0gw5l = { getShaderInfoLog };
const _ref_dpjq2q = { setAttack };
const _ref_ok5ag4 = { detectCollision };
const _ref_uzep8m = { lazyLoadComponent };
const _ref_jv63kz = { forkProcess };
const _ref_np1ox1 = { execProcess };
const _ref_5tnjgt = { handleInterrupt };
const _ref_kuevbe = { setInertia };
const _ref_uu2owo = { unlockRow };
const _ref_ttpd6o = { createSoftBody };
const _ref_17igt6 = { loadDriver };
const _ref_864zj3 = { compressPacket };
const _ref_yz8smp = { resumeContext };
const _ref_augsps = { saveCheckpoint };
const _ref_09vzoh = { preventSleepMode };
const _ref_f2r46s = { killParticles };
const _ref_358w17 = { closeContext };
const _ref_2la51e = { reassemblePacket };
const _ref_2e7f0y = { optimizeConnectionPool };
const _ref_a1e6ig = { validateRecaptcha };
const _ref_qj59qx = { updateParticles };
const _ref_a0xyjq = { bufferMediaStream };
const _ref_00gqh5 = { requestPiece };
const _ref_0zrpxp = { downInterface };
const _ref_cvja19 = { VirtualFSTree };
const _ref_785urv = { verifyChecksum };
const _ref_eu8zq9 = { compactDatabase };
const _ref_8f6lg3 = { calculateComplexity };
const _ref_z1d9wu = { encodeABI };
const _ref_z7gv4z = { mutexLock };
const _ref_n4ff44 = { decryptStream };
const _ref_gupzht = { anchorSoftBody };
const _ref_fphk4w = { sanitizeInput };
const _ref_ne4yq4 = { defineSymbol };
const _ref_1q7nai = { unmountFileSystem };
const _ref_gtudjv = { analyzeControlFlow };
const _ref_00yqb1 = { connectToTracker };
const _ref_ck7amt = { bindTexture };
const _ref_1splgg = { remuxContainer };
const _ref_nvfeg3 = { configureInterface };
const _ref_7a2tls = { resolveDNS };
const _ref_nsoqhf = { updateTransform };
const _ref_7ihe3y = { getSystemUptime }; 
    });
})({}, {});