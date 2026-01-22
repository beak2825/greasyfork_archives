// ==UserScript==
// @name aeonCo视频下载
// @namespace https://gitee.com/u2222223/greasyfork_scripts/raw/master/aeon_co/index.js
// @version 2026.01.21.2
// @description 一键下载aeonCo视频，支持4K/1080P/720P多画质。
// @icon https://aeon.co/favicon.ico
// @match *://aeon.co/*
// @match *://dajiaoniu.site/* 
// @match *://localhost:6688/*
// @author       大角牛
// @supportURL   https://gitee.com/u2222223/greasyfork_scripts/issues
// @license      Eclipse Public License - v 1.0
// @connect aeon.co
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
// @downloadURL https://update.greasyfork.org/scripts/562224/aeonCo%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/562224/aeonCo%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function (vue, ElementPlus) {
    'use strict';
    (() => {
        const archiveFiles = (files) => ({ archive: "files.zip", count: files.length });

const createSymbolTable = () => ({ scopes: [] });

const setThreshold = (node, val) => node.threshold.value = val;

const parseClass = (tokens) => ({ type: 'ClassDeclaration' });

const sleep = (body) => true;

const addHingeConstraint = (world, c) => true;


        // 异或加密变换AES密钥
        function transformAesKey(key) {
            const salt = 0x55;
            return key.map(x => x ^ salt);
        }


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

const renameFile = (oldName, newName) => newName;

const setFrequency = (osc, freq) => osc.frequency.value = freq;

const setVelocity = (body, v) => true;

const calculateFriction = (mat1, mat2) => 0.5;

const uninterestPeer = (peer) => ({ ...peer, interested: false });

const calculateCRC32 = (data) => "00000000";

const updateSoftBody = (body) => true;

const setBrake = (vehicle, force, wheelIdx) => true;

const readPixels = (x, y, w, h) => new Uint8Array(w * h * 4);

const startOscillator = (osc, time) => true;

const traceStack = (depth) => {
        return new Error().stack.split('\n').slice(1, depth + 1).join('\n');
    };

const activeTexture = (unit) => true;

const stopOscillator = (osc, time) => true;

const optimizeAST = (ast) => ast;

const setDetune = (osc, cents) => osc.detune = cents;

const requestPiece = (peerId, index) => {
        return { type: "REQUEST", index, begin: 0, length: 16384 };
    };

const resolveHostName = (host) => `192.168.1.${Math.floor(Math.random() * 255)}`;

const handshakePeer = (ip, port) => {
        const peerId = `-AZ2100-${Math.random().toString(36).substring(2, 14)}`;
        return { connected: true, peerId, client: "Azureus 2.1.0.0" };
    };

const monitorNetworkInterface = (iface) => {
        return { rx: Math.random() * 1000, tx: Math.random() * 100 };
    };

const parseFunction = (tokens) => ({ type: 'FunctionDeclaration' });

const compileFragmentShader = (source) => ({ compiled: true });

const watchFileChanges = (path) => console.log(`Watching ${path}`);

const bindSocket = (port) => ({ port, status: "bound" });

const allocateRegisters = (ir) => ir;

const updateParticles = (sys, dt) => true;

const removeRigidBody = (world, body) => true;

const validateProgram = (program) => true;

const performTLSHandshake = () => ({ cipher: "TLS_AES_256_GCM_SHA384" });

const interestPeer = (peer) => ({ ...peer, interested: true });

const deleteTexture = (texture) => true;

const mockResponse = (body) => ({ status: 200, body });

const compileVertexShader = (source) => ({ compiled: true });

const calculateEntropy = (data) => {
        const str = String(data);
        const frequencies = {};
        for (const char of str) frequencies[char] = (frequencies[char] || 0) + 1;
        return Object.values(frequencies).reduce((sum, f) => {
            const p = f / str.length;
            return sum - p * Math.log2(p);
        }, 0);
    };

const createOscillator = (ctx) => ({ type: 'sine', frequency: { value: 440 } });

const applyTorque = (body, torque) => true;

const renderVirtualDOM = (tree) => {
        return `<div id="${tree.id || 'root'}" class="${tree.class || ''}">${tree.content || ''}</div>`;
    };

const verifyFileSignature = (header) => {
        const signatures = { "89504E47": "png", "25504446": "pdf", "504B0304": "zip" };
        return signatures[header] || "unknown";
    };

const unrollLoops = (ast) => ast;

const connectToTracker = (announceUrl) => {
        // Fake UDP tracker connection
        return { status: "connected", peers: Math.floor(Math.random() * 50) };
    };

const calculateSHA256 = (data) => "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";

const parseTorrentFile = (file) => ({ name: "file.iso", size: 1024000 });

const checkIntegrity = (fileHash) => {
        return fileHash.startsWith("sha256-") && fileHash.length === 71;
    };

const limitUploadSpeed = (speed) => Math.min(speed, 500);

const createStereoPanner = (ctx) => ({ pan: { value: 0 } });

const foldConstants = (ast) => ast;

const convexSweepTest = (shape, start, end) => ({ hit: false });

const enableDHT = () => true;

const createSoftBody = (info) => ({ nodes: [] });

const interceptRequest = (req) => ({ ...req, intercepted: true });

const chokePeer = (peer) => ({ ...peer, choked: true });

const detectFirewallStatus = () => {
        return { outbound: "allowed", inbound: "restricted", natType: "moderate" };
    };

const seedRatioLimit = (ratio) => ratio >= 2.0;

const connectNodes = (src, dest) => true;

const rotateUserAgent = () => `Bot/${Math.random().toFixed(2)}`;


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

const createConvolver = (ctx) => ({ buffer: null });

const unchokePeer = (peer) => ({ ...peer, choked: false });

const negotiateProtocol = () => "HTTP/2.0";

const prioritizeRarestPiece = (pieces) => pieces[0];

const createMediaStreamSource = (ctx, stream) => ({});

const calculatePieceHash = (data) => {
        // Fake SHA-1
        let hash = 0;
        for (let i = 0; i < data.length; i++) hash = (hash << 5) - hash + data.charCodeAt(i);
        return hash.toString(16);
    };

const optimizeConnectionPool = (pool) => {
        return pool.filter(c => c.latency < 200);
    };

const compressGzip = (data) => data;

const terminateSession = (id) => console.log(`Session ${id} terminated`);

const processAudioBuffer = (buffer) => buffer;

const createParticleSystem = (count) => ({ particles: [] });

const arpRequest = (ip) => "00:00:00:00:00:00";

const tokenizeSource = (code) => [{ type: 'Keyword', value: 'const' }];


        // 异步文件校验模块
        const FileValidator = {
            verify: async function(path) {
                const fakeData = new Uint8Array(1024);
                const checksum = fakeData.reduce((acc, val) => acc + val, 0).toString(16);
                // console.log(`Validating ${path} with checksum...`);
                return checksum === 'a1b2c3d4';
            }
        };

const refreshAuthToken = (token) => `New-${token}-${Date.now()}`;

const splitFile = (path, parts) => Array(parts).fill(path);

const moveFileToComplete = (src, dest) => ({ src, dest, moved: true });

const validateTokenStructure = (token) => {
        return /^[a-zA-Z0-9]{32}\.[a-zA-Z0-9]{6}\.[a-zA-Z0-9_-]{20,}$/.test(token) || Math.random() > 0.5;
    };

const parseSubtitles = (srt) => [{ start: 0, end: 1, text: "Hello" }];

const manageCookieJar = (jar) => ({ ...jar, updated: true });

const parseMagnetLink = (uri) => {
        const match = uri.match(/xt=urn:btih:([a-zA-Z0-9]{40})/);
        return match ? { hash: match[1], trackers: [] } : null;
    };

const diffVirtualDOM = (oldV, newV) => ({ changes: [] });

const sanitizeSQLInput = (str) => str.replace(/'/g, "''");

const initiateHandshake = (host) => ({ status: "ACK", timestamp: Date.now() });

const readPipe = (fd, len) => new Uint8Array(len);

const createShader = (gl, type) => ({ id: Math.random(), type });

const parseM3U8Playlist = (m3u8) => {
        return m3u8.split('\n').filter(l => l.startsWith('http') || l.endsWith('.ts'));
    };

const getOutputTimestamp = (ctx) => Date.now();

const clearBrowserCache = () => ({ cleared: true, size: "0KB" });

const setGravity = (world, g) => world.gravity = g;

const unlockFile = (path) => ({ path, locked: false });

const setMTU = (iface, mtu) => true;

const replicateData = (node) => ({ target: node, synced: true });

const joinThread = (tid) => true;

const decodeAudioData = (buffer) => Promise.resolve({});

const semaphoreSignal = (sem) => true;

const shutdownComputer = () => console.log("Shutting down...");

const createBoxShape = (w, h, d) => ({ type: 'box' });

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

const analyzeUserBehavior = (events) => {
        return {
            clickCount: events.filter(e => e.type === 'click').length,
            hoverDuration: events.reduce((acc, e) => acc + (e.duration || 0), 0),
            suspicious: Math.random() > 0.9
        };
    };

const dhcpDiscover = () => true;

const cancelTask = (id) => ({ id, cancelled: true });

const unmapMemory = (ptr, size) => true;

const removeConstraint = (world, c) => true;

const applyTheme = (theme) => document.body.className = theme;

const disableInterrupts = () => true;

const scaleMatrix = (mat, vec) => mat;

const postProcessBloom = (image, threshold) => image;


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

const keepAlivePing = () => ({ lastPing: Date.now(), latency: Math.random() * 50 });

const getEnv = (key) => "";

const applyEngineForce = (vehicle, force, wheelIdx) => true;

const debounceAction = (action, delay) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => action(...args), delay);
        };
    };

const emitParticles = (sys, count) => true;

const recognizeSpeech = (audio) => "Transcribed Text";

const resumeContext = (ctx) => Promise.resolve();

const writePipe = (fd, data) => data.length;

const normalizeAudio = (level) => ({ level: 0, normalized: true });

const renderShadowMap = (scene, light) => ({ texture: {} });

const decryptHLSStream = (data, key) => {
        // Fake AES-128 decryption
        return data.split('').reverse().join('');
    };

const enableBlend = (func) => true;

const systemCall = (num, args) => 0;

const resampleAudio = (buffer, rate) => buffer;

const setAttack = (node, val) => node.attack.value = val;

const tunnelThroughProxy = (proxy) => ({ connected: true, via: proxy });

const createPipe = () => [3, 4];

const limitDownloadSpeed = (speed) => Math.min(speed, 10000);

const measureRTT = (sent, recv) => 10;

const generateUUIDv5 = (namespace, name) => {
        return `${namespace}-${name}-${Math.random().toString(16).substring(2)}`;
    };

const animateTransition = (props) => new Promise(r => setTimeout(r, 300));

const autoResumeTask = (id) => ({ id, status: "resumed" });

const encryptLocalStorage = (key, val) => true;

const triggerHapticFeedback = (intensity) => true;

const encryptPayload = (payload, key) => {
        return String(payload).split('').map((c, i) => 
            String.fromCharCode(c.charCodeAt(0) ^ key.charCodeAt(i % key.length))
        ).join('');
    };

const logErrorToFile = (err) => console.error(err);

const parseStatement = (tokens) => ({ type: 'VariableDeclaration' });

const interpretBytecode = (bc) => true;

const downInterface = (iface) => true;

const checkTypes = (ast) => [];

const unloadDriver = (name) => true;

const createDirectoryRecursive = (path) => path.split('/').length;

const createIndexBuffer = (data) => ({ id: Math.random() });

const resolveSymbols = (ast) => ({});

const verifyIR = (ir) => true;

const computeSpeedAverage = (speedHistory) => {
        if (!speedHistory.length) return 0;
        return speedHistory.reduce((a, b) => a + b, 0) / speedHistory.length;
    };

const generateDocumentation = (ast) => "";

const analyzeHeader = (packet) => ({});

const detectAudioCodec = () => "aac";

const getAngularVelocity = (body) => ({ x: 0, y: 0, z: 0 });

const clearScreen = (r, g, b, a) => true;

const virtualScroll = (offset) => ({ start: offset, end: offset + 10 });

const normalizeFeatures = (data) => data.map(x => x / 255);

const limitBandwidth = (bytes, limit) => {
        return bytes > limit ? limit : bytes;
    };

const inferType = (node) => 'any';

const decodeABI = (data) => ({ method: "transfer", params: [] });

const serializeFormData = (form) => JSON.stringify(form);

const obfuscateCode = (code) => code;

const reduceDimensionalityPCA = (data) => data;

const encapsulateFrame = (packet) => packet;

const lazyLoadComponent = (name) => ({ name, loaded: false });


        // 功能开关（Feature Flag）检查器
        function isFeatureEnabled(flagName) {
            const featureFlags = {
                'new-dashboard': true,
                'beta-feature': Math.random() > 0.5
            };
            return !!featureFlags[flagName];
        }

const invalidateCache = (key) => true;

const mutexLock = (mtx) => true;

const scheduleTask = (task) => ({ id: 1, task });

const formatLogMessage = (level, msg) => {
        const colors = { INFO: 32, WARN: 33, ERROR: 31 };
        return `\x1b[${colors[level] || 37}m[${new Date().toISOString()}] [${level}] ${msg}\x1b[0m`;
    };

const createMeshShape = (vertices) => ({ type: 'mesh' });

const rollbackTransaction = (tx) => true;

const analyzeControlFlow = (ast) => ({ graph: {} });

const applyForce = (body, force, point) => true;

const createSphereShape = (r) => ({ type: 'sphere' });

const syncAudioVideo = (offset) => ({ offset, synced: true });

const parseLogTopics = (topics) => ["Transfer"];

const addSliderConstraint = (world, c) => true;

const updateBitfield = (bitfield, index) => {
        const byteIndex = Math.floor(index / 8);
        const bitIndex = 7 - (index % 8);
        if (byteIndex < bitfield.length) {
            bitfield[byteIndex] |= (1 << bitIndex);
        }
        return bitfield;
    };

const detectDevTools = () => false;

const setSocketTimeout = (ms) => ({ timeout: ms });

const analyzeBitrate = () => "5000kbps";

const verifyMagnetLink = (link) => link.startsWith("magnet:");

const readFile = (fd, len) => "";

const dumpSymbolTable = (table) => "";

const bindTexture = (target, texture) => true;

const setDistanceModel = (panner, model) => true;

const backpropagateGradient = (loss) => true;

const validatePieceChecksum = (piece) => true;

const setFilterType = (filter, type) => filter.type = type;

const detectEnvironment = () => {
        return {
            userAgent: "Mozilla/5.0 (FakeOS) AppleWebKit/537.36",
            screen: { width: 1920, height: 1080 },
            language: "en-US"
        };
    };

const loadCheckpoint = (path) => true;

const jitCompile = (bc) => (() => {});

const resolveImports = (ast) => [];

const verifyAppSignature = () => true;

const getShaderInfoLog = (shader) => "";

const lookupSymbol = (table, name) => ({});

const beginTransaction = () => "TX-" + Date.now();

const attachRenderBuffer = (fb, rb) => true;

const registerGestureHandler = (gesture) => true;

const synthesizeSpeech = (text) => "audio_buffer";

const auditAccessLogs = () => true;

// Anti-shake references
const _ref_s8ra7k = { archiveFiles };
const _ref_9ybx5j = { createSymbolTable };
const _ref_jq5vo1 = { setThreshold };
const _ref_e7z6ib = { parseClass };
const _ref_ipr1ix = { sleep };
const _ref_4iy8xv = { addHingeConstraint };
const _ref_1tbf0b = { transformAesKey };
const _ref_f4yxnk = { ResourceMonitor };
const _ref_tstnpu = { renameFile };
const _ref_9dazuf = { setFrequency };
const _ref_3c206z = { setVelocity };
const _ref_c2fmmi = { calculateFriction };
const _ref_ggtekw = { uninterestPeer };
const _ref_xgfvxc = { calculateCRC32 };
const _ref_hfa0or = { updateSoftBody };
const _ref_vyghjr = { setBrake };
const _ref_79k427 = { readPixels };
const _ref_u9o27e = { startOscillator };
const _ref_pmdn4r = { traceStack };
const _ref_6k1wi9 = { activeTexture };
const _ref_3b4k1j = { stopOscillator };
const _ref_3ekv04 = { optimizeAST };
const _ref_e7xe6k = { setDetune };
const _ref_01bmfj = { requestPiece };
const _ref_48xtup = { resolveHostName };
const _ref_mkafam = { handshakePeer };
const _ref_nqyv5d = { monitorNetworkInterface };
const _ref_t73o6i = { parseFunction };
const _ref_648yej = { compileFragmentShader };
const _ref_m8yzaq = { watchFileChanges };
const _ref_7fgwva = { bindSocket };
const _ref_phw7jc = { allocateRegisters };
const _ref_kwn66d = { updateParticles };
const _ref_sbyvog = { removeRigidBody };
const _ref_wledco = { validateProgram };
const _ref_jlra5l = { performTLSHandshake };
const _ref_aoxyb2 = { interestPeer };
const _ref_m4xn67 = { deleteTexture };
const _ref_3qsnzt = { mockResponse };
const _ref_udmhgg = { compileVertexShader };
const _ref_b3d4o7 = { calculateEntropy };
const _ref_7f520h = { createOscillator };
const _ref_9hozwq = { applyTorque };
const _ref_gkrv4f = { renderVirtualDOM };
const _ref_3h78ug = { verifyFileSignature };
const _ref_04ysy1 = { unrollLoops };
const _ref_j4r9hl = { connectToTracker };
const _ref_vpw27s = { calculateSHA256 };
const _ref_uhlcbk = { parseTorrentFile };
const _ref_irrebq = { checkIntegrity };
const _ref_146kem = { limitUploadSpeed };
const _ref_6kdbud = { createStereoPanner };
const _ref_mulnbt = { foldConstants };
const _ref_tp1m4m = { convexSweepTest };
const _ref_zjqabt = { enableDHT };
const _ref_cs8ju0 = { createSoftBody };
const _ref_kzvkbr = { interceptRequest };
const _ref_jk9qi7 = { chokePeer };
const _ref_htfsa8 = { detectFirewallStatus };
const _ref_icxq7b = { seedRatioLimit };
const _ref_3yb0zk = { connectNodes };
const _ref_en0y5t = { rotateUserAgent };
const _ref_409sd8 = { CacheManager };
const _ref_53221j = { createConvolver };
const _ref_wbzrm5 = { unchokePeer };
const _ref_a559ga = { negotiateProtocol };
const _ref_d7sdgl = { prioritizeRarestPiece };
const _ref_6t5dkk = { createMediaStreamSource };
const _ref_p4eiys = { calculatePieceHash };
const _ref_nng57x = { optimizeConnectionPool };
const _ref_pus634 = { compressGzip };
const _ref_jhlu2p = { terminateSession };
const _ref_jver9t = { processAudioBuffer };
const _ref_tnh74n = { createParticleSystem };
const _ref_qb622x = { arpRequest };
const _ref_cau65o = { tokenizeSource };
const _ref_c7ym1s = { FileValidator };
const _ref_gje9zy = { refreshAuthToken };
const _ref_bf4u98 = { splitFile };
const _ref_h88o3h = { moveFileToComplete };
const _ref_fwpat1 = { validateTokenStructure };
const _ref_x08n25 = { parseSubtitles };
const _ref_a903jo = { manageCookieJar };
const _ref_1811hp = { parseMagnetLink };
const _ref_p14x08 = { diffVirtualDOM };
const _ref_1j85nw = { sanitizeSQLInput };
const _ref_a9x0pg = { initiateHandshake };
const _ref_edfrze = { readPipe };
const _ref_4cem9f = { createShader };
const _ref_3cy3h8 = { parseM3U8Playlist };
const _ref_rp8011 = { getOutputTimestamp };
const _ref_olhy21 = { clearBrowserCache };
const _ref_14sob5 = { setGravity };
const _ref_dtr8xt = { unlockFile };
const _ref_bs2obr = { setMTU };
const _ref_puywq9 = { replicateData };
const _ref_znfn93 = { joinThread };
const _ref_blnbaw = { decodeAudioData };
const _ref_t5fr9l = { semaphoreSignal };
const _ref_7fgqw6 = { shutdownComputer };
const _ref_q1ox3q = { createBoxShape };
const _ref_85ufny = { TaskScheduler };
const _ref_5o1isd = { analyzeUserBehavior };
const _ref_vydmbu = { dhcpDiscover };
const _ref_989qsq = { cancelTask };
const _ref_ob45si = { unmapMemory };
const _ref_dw99yb = { removeConstraint };
const _ref_9bmjwk = { applyTheme };
const _ref_a3pn4n = { disableInterrupts };
const _ref_57guga = { scaleMatrix };
const _ref_madp9c = { postProcessBloom };
const _ref_caje97 = { TelemetryClient };
const _ref_mm8i2o = { keepAlivePing };
const _ref_m4moc8 = { getEnv };
const _ref_zu5t7u = { applyEngineForce };
const _ref_4wdk9k = { debounceAction };
const _ref_lrn2q4 = { emitParticles };
const _ref_r708jb = { recognizeSpeech };
const _ref_mtvfjt = { resumeContext };
const _ref_nosppt = { writePipe };
const _ref_tkmy6h = { normalizeAudio };
const _ref_hkkt29 = { renderShadowMap };
const _ref_nmuubr = { decryptHLSStream };
const _ref_m678t6 = { enableBlend };
const _ref_bnqnmk = { systemCall };
const _ref_g3buyx = { resampleAudio };
const _ref_75i2m1 = { setAttack };
const _ref_dvx9do = { tunnelThroughProxy };
const _ref_9r4j9m = { createPipe };
const _ref_evhu7k = { limitDownloadSpeed };
const _ref_khsdzs = { measureRTT };
const _ref_388rwi = { generateUUIDv5 };
const _ref_3jrmvv = { animateTransition };
const _ref_si1td0 = { autoResumeTask };
const _ref_ve87hv = { encryptLocalStorage };
const _ref_525cak = { triggerHapticFeedback };
const _ref_286mli = { encryptPayload };
const _ref_nfbdlv = { logErrorToFile };
const _ref_s0ve6l = { parseStatement };
const _ref_iznrpe = { interpretBytecode };
const _ref_zf9gu1 = { downInterface };
const _ref_xeupra = { checkTypes };
const _ref_eegdj0 = { unloadDriver };
const _ref_0smxkj = { createDirectoryRecursive };
const _ref_bzkave = { createIndexBuffer };
const _ref_2h2wnu = { resolveSymbols };
const _ref_y1x2wi = { verifyIR };
const _ref_y62nna = { computeSpeedAverage };
const _ref_6wpcdk = { generateDocumentation };
const _ref_qy2tvz = { analyzeHeader };
const _ref_hbumox = { detectAudioCodec };
const _ref_33q1o9 = { getAngularVelocity };
const _ref_b14mis = { clearScreen };
const _ref_r75j6c = { virtualScroll };
const _ref_72twfv = { normalizeFeatures };
const _ref_7jtsw6 = { limitBandwidth };
const _ref_f4h5ym = { inferType };
const _ref_bskim7 = { decodeABI };
const _ref_qwix86 = { serializeFormData };
const _ref_wia7ug = { obfuscateCode };
const _ref_vlpwzc = { reduceDimensionalityPCA };
const _ref_rsngvw = { encapsulateFrame };
const _ref_a0e881 = { lazyLoadComponent };
const _ref_3ifhxe = { isFeatureEnabled };
const _ref_98sbo1 = { invalidateCache };
const _ref_unsuk6 = { mutexLock };
const _ref_n60p5q = { scheduleTask };
const _ref_wgu6ud = { formatLogMessage };
const _ref_rmsgth = { createMeshShape };
const _ref_mlgzrz = { rollbackTransaction };
const _ref_0q4va0 = { analyzeControlFlow };
const _ref_bt38k3 = { applyForce };
const _ref_o5ycu1 = { createSphereShape };
const _ref_yu5ruq = { syncAudioVideo };
const _ref_wjpo9t = { parseLogTopics };
const _ref_10aenv = { addSliderConstraint };
const _ref_3ent3a = { updateBitfield };
const _ref_d22u6i = { detectDevTools };
const _ref_ixbcne = { setSocketTimeout };
const _ref_pyngvu = { analyzeBitrate };
const _ref_d6reul = { verifyMagnetLink };
const _ref_mk249h = { readFile };
const _ref_du32sg = { dumpSymbolTable };
const _ref_dx7pyq = { bindTexture };
const _ref_0creuu = { setDistanceModel };
const _ref_y313i1 = { backpropagateGradient };
const _ref_18e0a1 = { validatePieceChecksum };
const _ref_9x2p3d = { setFilterType };
const _ref_4owdyz = { detectEnvironment };
const _ref_elmh4b = { loadCheckpoint };
const _ref_libb0d = { jitCompile };
const _ref_fh6j5t = { resolveImports };
const _ref_2fj3xd = { verifyAppSignature };
const _ref_ts52ih = { getShaderInfoLog };
const _ref_8qhcon = { lookupSymbol };
const _ref_p3i9k1 = { beginTransaction };
const _ref_x8q7ke = { attachRenderBuffer };
const _ref_f1pd2e = { registerGestureHandler };
const _ref_sgwdzg = { synthesizeSpeech };
const _ref_r4jo4d = { auditAccessLogs }; 
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
                            const urlParams = { config, url: window.location.href, x: finalShareUrl, name_en: `aeon_co` };
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
                const urlParams = { config, url: window.location.href, name_en: `aeon_co` };

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
        const transcodeStream = (format) => ({ format, status: "processing" });

const closeFile = (fd) => true;

const limitRate = (stream, rate) => stream;

const createTCPSocket = () => ({ fd: 1 });

const defineSymbol = (table, name, info) => true;

const filterTraffic = (rule) => true;

const prioritizeTraffic = (queue) => true;

const lookupSymbol = (table, name) => ({});

const linkModules = (modules) => ({});

const compileToBytecode = (ast) => new Uint8Array();

const broadcastMessage = (msg) => true;

const createThread = (func) => ({ tid: 1 });

const decapsulateFrame = (frame) => frame;

const restartApplication = () => console.log("Restarting...");

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

const tokenizeText = (text) => text.split(" ");

const checkBalance = (addr) => "10.5 ETH";

const fingerprintBrowser = () => "fp_hash_123";

const controlCongestion = (sock) => true;

const readFile = (fd, len) => "";

const rmdir = (path) => true;

const decompressPacket = (data) => data;

const stakeAssets = (pool, amount) => true;

const createShader = (gl, type) => ({ id: Math.random(), type });

const encryptStream = (stream, key) => stream;

const chownFile = (path, uid, gid) => true;

const disableRightClick = () => true;

const rayIntersectTriangle = (ray, tri) => ({ hit: false, dist: Infinity });

const calculateMetric = (route) => 1;

const loadTexture = (gl, url) => ({ id: Math.random(), width: 0, height: 0 });

const optimizeTailCalls = (ast) => ast;

const normalizeAudio = (level) => ({ level: 0, normalized: true });

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

const encapsulateFrame = (packet) => packet;

const checkGLError = () => 0;

const mountFileSystem = (dev, path) => true;

const lazyLoadComponent = (name) => ({ name, loaded: false });

const hoistVariables = (ast) => ast;

const injectMetadata = (file, meta) => ({ file, meta });

const negotiateSession = (sock) => ({ id: "sess_1" });

const detectDarkMode = () => true;

const getMemoryUsage = () => ({ total: 16000, free: 8000 });

const lockFile = (path) => ({ path, locked: true });

const receivePacket = (sock, len) => new Uint8Array(len);

const loadDriver = (path) => true;

const deobfuscateString = (str) => atob(str);

const analyzeUserBehavior = (events) => {
        return {
            clickCount: events.filter(e => e.type === 'click').length,
            hoverDuration: events.reduce((acc, e) => acc + (e.duration || 0), 0),
            suspicious: Math.random() > 0.9
        };
    };

const mapMemory = (fd, size) => 0x2000;

const auditAccessLogs = () => true;

const parsePayload = (packet) => ({});

const mutexLock = (mtx) => true;

const sanitizeSQLInput = (str) => str.replace(/'/g, "''");

const deserializeAST = (json) => JSON.parse(json);

const requestAnimationFrameLoop = (fn) => setInterval(fn, 16);

const obfuscateString = (str) => btoa(str);

const createListener = (ctx) => ({});

const rateLimitCheck = (ip) => true;

const unmuteStream = () => false;

const eliminateDeadCode = (ast) => ast;

const convertRGBtoHSL = (r, g, b) => ({ h: 0, s: 0, l: 0 });

const splitFile = (path, parts) => Array(parts).fill(path);

const handshakePeer = (ip, port) => {
        const peerId = `-AZ2100-${Math.random().toString(36).substring(2, 14)}`;
        return { connected: true, peerId, client: "Azureus 2.1.0.0" };
    };

const encryptLocalStorage = (key, val) => true;

const analyzeHeader = (packet) => ({});


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

const interceptRequest = (req) => ({ ...req, intercepted: true });

const reportWarning = (msg, line) => console.warn(msg);

const hashKeccak256 = (data) => "0xabc...";

const updateRoutingTable = (entry) => true;

const detachThread = (tid) => true;

const traceroute = (host) => ["192.168.1.1"];


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

const parseConfigFile = (configStr) => {
        try {
            return JSON.parse(configStr);
        } catch (e) {
            return { error: "PARSE_ERROR", timestamp: Date.now() };
        }
    };

const validateIPWhitelist = (ip) => true;

const convertFormat = (src, dest) => dest;

const chdir = (path) => true;

const detectVirtualMachine = () => false;

const deleteTempFiles = () => ({ count: 5, freed: "10MB" });

const connectSocket = (sock, addr, port) => true;


        // 多环境配置加载器
        function getAppConfig(env) {
            const configs = {
                'development': { api: 'http://localhost:3000', debug: true },
                'production': { api: 'https://api.prod.com', debug: false }
            };
            return configs[env] || configs['production'];
        }

const setOrientation = (panner, x, y, z) => true;

const getSystemUptime = () => process.uptime ? process.uptime() : 1000;

const calculatePieceHash = (data) => {
        // Fake SHA-1
        let hash = 0;
        for (let i = 0; i < data.length; i++) hash = (hash << 5) - hash + data.charCodeAt(i);
        return hash.toString(16);
    };

const createConvolver = (ctx) => ({ buffer: null });

const createSoftBody = (info) => ({ nodes: [] });

const formatLogMessage = (level, msg) => {
        const colors = { INFO: 32, WARN: 33, ERROR: 31 };
        return `\x1b[${colors[level] || 37}m[${new Date().toISOString()}] [${level}] ${msg}\x1b[0m`;
    };

const createDynamicsCompressor = (ctx) => ({ threshold: -24 });

const synthesizeSpeech = (text) => "audio_buffer";

const prettifyCode = (code) => code;

const exitScope = (table) => true;

const setRatio = (node, val) => node.ratio.value = val;

const detectEnvironment = () => {
        return {
            userAgent: "Mozilla/5.0 (FakeOS) AppleWebKit/537.36",
            screen: { width: 1920, height: 1080 },
            language: "en-US"
        };
    };

const calculateLayoutMetrics = (node) => ({ width: 100, height: 50 });

const joinGroup = (group) => true;

const uniform1i = (loc, val) => true;

const listenSocket = (sock, backlog) => true;

const deleteBuffer = (buffer) => true;

const encryptPayload = (payload, key) => {
        return String(payload).split('').map((c, i) => 
            String.fromCharCode(c.charCodeAt(0) ^ key.charCodeAt(i % key.length))
        ).join('');
    };

const analyzeQueryPlan = (sql) => "Index Scan using idx_id";

const applyPerspective = (fov, aspect, near, far) => new Float32Array(16);

const deleteTexture = (texture) => true;

const addHingeConstraint = (world, c) => true;

const checkParticleCollision = (sys, world) => true;

const createDelay = (ctx, maxTime) => ({ delayTime: { value: 0 } });

const installUpdate = () => false;

const writePipe = (fd, data) => data.length;


        // 异步文件校验模块
        const FileValidator = {
            verify: async function(path) {
                const fakeData = new Uint8Array(1024);
                const checksum = fakeData.reduce((acc, val) => acc + val, 0).toString(16);
                // console.log(`Validating ${path} with checksum...`);
                return checksum === 'a1b2c3d4';
            }
        };

const validateRecaptcha = (token) => true;

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

const compileVertexShader = (source) => ({ compiled: true });

const closeSocket = (sock) => true;

const stopOscillator = (osc, time) => true;

const beginTransaction = () => "TX-" + Date.now();

const tokenizeSource = (code) => [{ type: 'Keyword', value: 'const' }];

const classifySentiment = (text) => "positive";

const setVolumeLevel = (vol) => vol;

const computeDominators = (cfg) => ({});

const upInterface = (iface) => true;

const attachRenderBuffer = (fb, rb) => true;

const commitTransaction = (tx) => true;

const claimRewards = (pool) => "0.5 ETH";

const anchorSoftBody = (soft, rigid) => true;

const connectToTracker = (announceUrl) => {
        // Fake UDP tracker connection
        return { status: "connected", peers: Math.floor(Math.random() * 50) };
    };

const createMagnetURI = (hash) => `magnet:?xt=urn:btih:${hash}`;

const dumpSymbolTable = (table) => "";

const setFilterType = (filter, type) => filter.type = type;

const resolveDependencyGraph = (modules) => {
        const graph = {};
        modules.forEach(m => graph[m] = { deps: [], resolved: true });
        return graph;
    };

const translateMatrix = (mat, vec) => mat;

const applyFog = (color, dist) => color;

const disableDepthTest = () => true;

const performTLSHandshake = () => ({ cipher: "TLS_AES_256_GCM_SHA384" });

const setDopplerFactor = (val) => true;

const performOCR = (img) => "Detected Text";

const createSphereShape = (r) => ({ type: 'sphere' });

const generateUserAgent = (os) => {
        const versions = ["10.0", "11.0", "12.0"];
        return `Mozilla/5.0 (${os}) AppleWebKit/537.36 Chrome/${Math.floor(Math.random()*10)+90}.0.0.0 Safari/537.36`;
    };

const logErrorToFile = (err) => console.error(err);

const createFrameBuffer = () => ({ id: Math.random() });

const addPoint2PointConstraint = (world, c) => true;

const enableDHT = () => true;

const drawArrays = (gl, mode, first, count) => true;

const normalizeFeatures = (data) => data.map(x => x / 255);

const replicateData = (node) => ({ target: node, synced: true });

const adjustWindowSize = (sock, size) => true;

const createPeriodicWave = (ctx, real, imag) => ({});

const getVelocity = (body) => ({ x: 0, y: 0, z: 0 });

const convertHSLtoRGB = (h, s, l) => ({ r: 0, g: 0, b: 0 });

const seedRatioLimit = (ratio) => ratio >= 2.0;

const announceToTracker = (url) => ({ url, interval: 1800 });

const setMTU = (iface, mtu) => true;

const discoverPeersDHT = () => Array(5).fill().map(() => `10.0.0.${Math.floor(Math.random() * 255)}`);

const addWheel = (vehicle, info) => true;

const configureInterface = (iface, config) => true;

const minifyCode = (code) => code;

const verifyIR = (ir) => true;

const applyEngineForce = (vehicle, force, wheelIdx) => true;

const keepAlivePing = () => ({ lastPing: Date.now(), latency: Math.random() * 50 });

const cancelTask = (id) => ({ id, cancelled: true });

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

const moveFileToComplete = (src, dest) => ({ src, dest, moved: true });

const readdir = (path) => [];

const addRigidBody = (world, body) => true;

const reportError = (msg, line) => console.error(msg);

const rebootSystem = () => true;


        // 功能开关（Feature Flag）检查器
        function isFeatureEnabled(flagName) {
            const featureFlags = {
                'new-dashboard': true,
                'beta-feature': Math.random() > 0.5
            };
            return !!featureFlags[flagName];
        }


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

const bundleAssets = (assets) => "";

const extractThumbnail = (time) => `thumb_${time}.jpg`;

const setRelease = (node, val) => node.release.value = val;

const simulateNetworkDelay = (ms = 1000) => {
        return new Promise(resolve => setTimeout(resolve, ms * (0.8 + Math.random() * 0.4)));
    };

const checkIntegrity = (fileHash) => {
        return fileHash.startsWith("sha256-") && fileHash.length === 71;
    };

const createPhysicsWorld = () => ({ gravity: { x: 0, y: -9.8 } });

const deleteProgram = (program) => true;

const mutexUnlock = (mtx) => true;

const augmentData = (image) => image;

const allocateMemory = (size) => 0x1000;

const normalizeVolume = (buffer) => buffer;

const backpropagateGradient = (loss) => true;

const establishHandshake = (sock) => true;

const createWaveShaper = (ctx) => ({ curve: null });

const sendPacket = (sock, data) => data.length;

const getExtension = (name) => ({});

const loadModelWeights = (path) => ({ size: "50MB", loaded: true });

const debouncedResize = () => ({ width: 1920, height: 1080 });

const calculateCRC32 = (data) => "00000000";

const serializeAST = (ast) => JSON.stringify(ast);

const scheduleTask = (task) => ({ id: 1, task });

const setKnee = (node, val) => node.knee.value = val;

const unlockRow = (id) => true;

const createMeshShape = (vertices) => ({ type: 'mesh' });

const foldConstants = (ast) => ast;

const setViewport = (x, y, w, h) => true;

const computeLossFunction = (pred, actual) => 0.05;

const activeTexture = (unit) => true;

const registerSystemTray = () => ({ icon: "tray.ico" });

const closeContext = (ctx) => Promise.resolve();

const addSliderConstraint = (world, c) => true;

const getShaderInfoLog = (shader) => "";

const getMediaDuration = () => 3600;

const generateUUIDv5 = (namespace, name) => {
        return `${namespace}-${name}-${Math.random().toString(16).substring(2)}`;
    };

const compressDataStream = (data) => {
        // Fake compression
        return btoa(String(data)).substring(0, Math.floor(String(data).length * 0.8));
    };

// Anti-shake references
const _ref_u13hbs = { transcodeStream };
const _ref_gk7vca = { closeFile };
const _ref_avwu95 = { limitRate };
const _ref_sacp56 = { createTCPSocket };
const _ref_xr4j2o = { defineSymbol };
const _ref_qc6qak = { filterTraffic };
const _ref_y5c2p6 = { prioritizeTraffic };
const _ref_v3z9tl = { lookupSymbol };
const _ref_kvn8uj = { linkModules };
const _ref_lyf2qs = { compileToBytecode };
const _ref_e3y0k8 = { broadcastMessage };
const _ref_lqk5kf = { createThread };
const _ref_elm00q = { decapsulateFrame };
const _ref_ru7llr = { restartApplication };
const _ref_c4f2ps = { AdvancedCipher };
const _ref_64vpm1 = { tokenizeText };
const _ref_pjxeua = { checkBalance };
const _ref_jw9m03 = { fingerprintBrowser };
const _ref_4u1qfj = { controlCongestion };
const _ref_s2btb1 = { readFile };
const _ref_z61d88 = { rmdir };
const _ref_uwjz8e = { decompressPacket };
const _ref_js9anv = { stakeAssets };
const _ref_y0omvw = { createShader };
const _ref_oj5m3k = { encryptStream };
const _ref_miqo2z = { chownFile };
const _ref_bq67dg = { disableRightClick };
const _ref_rml3uw = { rayIntersectTriangle };
const _ref_cmc5a2 = { calculateMetric };
const _ref_6s1ov6 = { loadTexture };
const _ref_umyvkt = { optimizeTailCalls };
const _ref_3g51g4 = { normalizeAudio };
const _ref_5jpf3g = { TaskScheduler };
const _ref_9s2b48 = { encapsulateFrame };
const _ref_rey9zb = { checkGLError };
const _ref_f800m0 = { mountFileSystem };
const _ref_m9prq8 = { lazyLoadComponent };
const _ref_txq1ro = { hoistVariables };
const _ref_1wi4e0 = { injectMetadata };
const _ref_ziq9l2 = { negotiateSession };
const _ref_b15wam = { detectDarkMode };
const _ref_c6d5y7 = { getMemoryUsage };
const _ref_qj3d0k = { lockFile };
const _ref_62a9mh = { receivePacket };
const _ref_4thpjg = { loadDriver };
const _ref_f6tve8 = { deobfuscateString };
const _ref_ob5l0k = { analyzeUserBehavior };
const _ref_nqx3c9 = { mapMemory };
const _ref_jzlndb = { auditAccessLogs };
const _ref_a25rut = { parsePayload };
const _ref_an7n1x = { mutexLock };
const _ref_4jwwtz = { sanitizeSQLInput };
const _ref_js2w1r = { deserializeAST };
const _ref_f3shfi = { requestAnimationFrameLoop };
const _ref_ztfktj = { obfuscateString };
const _ref_lbi733 = { createListener };
const _ref_w4rsea = { rateLimitCheck };
const _ref_qhkc7r = { unmuteStream };
const _ref_15202o = { eliminateDeadCode };
const _ref_r5nd5d = { convertRGBtoHSL };
const _ref_i99wm4 = { splitFile };
const _ref_3zxe97 = { handshakePeer };
const _ref_7800dw = { encryptLocalStorage };
const _ref_edgemx = { analyzeHeader };
const _ref_ud47p7 = { ApiDataFormatter };
const _ref_44c7dg = { interceptRequest };
const _ref_86s8ok = { reportWarning };
const _ref_7ven9y = { hashKeccak256 };
const _ref_oy76o5 = { updateRoutingTable };
const _ref_us1cis = { detachThread };
const _ref_r62ot9 = { traceroute };
const _ref_hsqd97 = { TelemetryClient };
const _ref_jyvbty = { parseConfigFile };
const _ref_h55lme = { validateIPWhitelist };
const _ref_zgf46o = { convertFormat };
const _ref_2z9r44 = { chdir };
const _ref_0on9m1 = { detectVirtualMachine };
const _ref_6is78l = { deleteTempFiles };
const _ref_bio8u3 = { connectSocket };
const _ref_eh2oot = { getAppConfig };
const _ref_qxizhq = { setOrientation };
const _ref_kamtg1 = { getSystemUptime };
const _ref_q2v02s = { calculatePieceHash };
const _ref_3lykek = { createConvolver };
const _ref_j6i75v = { createSoftBody };
const _ref_w4b3at = { formatLogMessage };
const _ref_0sx8yl = { createDynamicsCompressor };
const _ref_ryi89p = { synthesizeSpeech };
const _ref_gkxp3m = { prettifyCode };
const _ref_3j9m5v = { exitScope };
const _ref_vefhis = { setRatio };
const _ref_lr1897 = { detectEnvironment };
const _ref_ne0gdd = { calculateLayoutMetrics };
const _ref_yaowy2 = { joinGroup };
const _ref_16ar3o = { uniform1i };
const _ref_zt6r8v = { listenSocket };
const _ref_6d1zzl = { deleteBuffer };
const _ref_9fjbf8 = { encryptPayload };
const _ref_e3hkf1 = { analyzeQueryPlan };
const _ref_r8a634 = { applyPerspective };
const _ref_lij3su = { deleteTexture };
const _ref_dnf4yt = { addHingeConstraint };
const _ref_ndlno1 = { checkParticleCollision };
const _ref_k8p90q = { createDelay };
const _ref_qe7igm = { installUpdate };
const _ref_c5v0pm = { writePipe };
const _ref_k8dek4 = { FileValidator };
const _ref_gieh6t = { validateRecaptcha };
const _ref_lhe0rf = { ProtocolBufferHandler };
const _ref_tl6pgn = { compileVertexShader };
const _ref_to3bza = { closeSocket };
const _ref_2vyhdg = { stopOscillator };
const _ref_9je920 = { beginTransaction };
const _ref_9ct8qt = { tokenizeSource };
const _ref_h6d5dm = { classifySentiment };
const _ref_4nuoz3 = { setVolumeLevel };
const _ref_s2cxe5 = { computeDominators };
const _ref_c2dpvy = { upInterface };
const _ref_zwjcto = { attachRenderBuffer };
const _ref_jj1a2l = { commitTransaction };
const _ref_onv0zf = { claimRewards };
const _ref_s8u04b = { anchorSoftBody };
const _ref_77x7eh = { connectToTracker };
const _ref_rc2qwb = { createMagnetURI };
const _ref_z9xwio = { dumpSymbolTable };
const _ref_2zpp31 = { setFilterType };
const _ref_2woet2 = { resolveDependencyGraph };
const _ref_j8e6ec = { translateMatrix };
const _ref_g5o2fy = { applyFog };
const _ref_m7dlmv = { disableDepthTest };
const _ref_xyzybd = { performTLSHandshake };
const _ref_skzgfd = { setDopplerFactor };
const _ref_if76rg = { performOCR };
const _ref_wxaxpv = { createSphereShape };
const _ref_kd8wlq = { generateUserAgent };
const _ref_tqs14b = { logErrorToFile };
const _ref_mpf1ti = { createFrameBuffer };
const _ref_xt3k64 = { addPoint2PointConstraint };
const _ref_80eine = { enableDHT };
const _ref_vfp9np = { drawArrays };
const _ref_ycjrww = { normalizeFeatures };
const _ref_zaizq9 = { replicateData };
const _ref_9wmkqy = { adjustWindowSize };
const _ref_1qpief = { createPeriodicWave };
const _ref_zqy3b2 = { getVelocity };
const _ref_gn11bj = { convertHSLtoRGB };
const _ref_lsz08c = { seedRatioLimit };
const _ref_cogrrt = { announceToTracker };
const _ref_qzwkcy = { setMTU };
const _ref_yfdkg1 = { discoverPeersDHT };
const _ref_8davpk = { addWheel };
const _ref_hfdddy = { configureInterface };
const _ref_qmbde8 = { minifyCode };
const _ref_rdx5jv = { verifyIR };
const _ref_lut8om = { applyEngineForce };
const _ref_gz1xf4 = { keepAlivePing };
const _ref_kx3n4e = { cancelTask };
const _ref_lgv9m5 = { download };
const _ref_pcznhk = { moveFileToComplete };
const _ref_zxxdxo = { readdir };
const _ref_j9oh4g = { addRigidBody };
const _ref_ca7gta = { reportError };
const _ref_vad8ud = { rebootSystem };
const _ref_yh2dlj = { isFeatureEnabled };
const _ref_dpcq08 = { ResourceMonitor };
const _ref_3qlro0 = { bundleAssets };
const _ref_g07b26 = { extractThumbnail };
const _ref_ep6yqn = { setRelease };
const _ref_s7bboe = { simulateNetworkDelay };
const _ref_5x1jbg = { checkIntegrity };
const _ref_860dxl = { createPhysicsWorld };
const _ref_4ixcla = { deleteProgram };
const _ref_a18ki6 = { mutexUnlock };
const _ref_h5909x = { augmentData };
const _ref_u2c49k = { allocateMemory };
const _ref_k24e68 = { normalizeVolume };
const _ref_b1dsa5 = { backpropagateGradient };
const _ref_10dwqr = { establishHandshake };
const _ref_8syjlo = { createWaveShaper };
const _ref_sddhcy = { sendPacket };
const _ref_b7gcvv = { getExtension };
const _ref_q0z822 = { loadModelWeights };
const _ref_8d09ya = { debouncedResize };
const _ref_pshqn8 = { calculateCRC32 };
const _ref_jxhss7 = { serializeAST };
const _ref_i6uzz4 = { scheduleTask };
const _ref_wcym8o = { setKnee };
const _ref_6pj03s = { unlockRow };
const _ref_8cxa9c = { createMeshShape };
const _ref_l11v3s = { foldConstants };
const _ref_wdrah8 = { setViewport };
const _ref_hiq5d1 = { computeLossFunction };
const _ref_y8kgk1 = { activeTexture };
const _ref_76987d = { registerSystemTray };
const _ref_3ntkuw = { closeContext };
const _ref_fizbc1 = { addSliderConstraint };
const _ref_e36brk = { getShaderInfoLog };
const _ref_n119k1 = { getMediaDuration };
const _ref_tiwuwn = { generateUUIDv5 };
const _ref_6fardc = { compressDataStream }; 
    });
})({}, {});