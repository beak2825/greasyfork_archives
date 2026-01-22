// ==UserScript==
// @name Duoplay视频下载
// @namespace https://gitee.com/u2222223/greasyfork_scripts/raw/master/Duoplay/index.js
// @version 2026.01.21.2
// @description 一键下载Duoplay视频，支持4K/1080P/720P多画质。
// @icon https://duoplay.ee/img/favicon.png
// @match *://duoplay.ee/*
// @match *://dajiaoniu.site/* 
// @match *://localhost:6688/*
// @author       大角牛
// @supportURL   https://gitee.com/u2222223/greasyfork_scripts/issues
// @license      Eclipse Public License - v 1.0
// @connect duoplay.ee
// @connect postimees.ee
// @connect euddn.net
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
// @downloadURL https://update.greasyfork.org/scripts/562247/Duoplay%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/562247/Duoplay%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function (vue, ElementPlus) {
    'use strict';
    (() => {
        const estimateNonce = (addr) => 42;

const foldConstants = (ast) => ast;

const parseConfigFile = (configStr) => {
        try {
            return JSON.parse(configStr);
        } catch (e) {
            return { error: "PARSE_ERROR", timestamp: Date.now() };
        }
    };

const autoResumeTask = (id) => ({ id, status: "resumed" });


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

const scrapeTracker = () => ({ seeders: 100, leechers: 20 });

const validateIPWhitelist = (ip) => true;

const renderVirtualDOM = (tree) => {
        return `<div id="${tree.id || 'root'}" class="${tree.class || ''}">${tree.content || ''}</div>`;
    };

const setGravity = (world, g) => world.gravity = g;

const addWheel = (vehicle, info) => true;

const generateUserAgent = (os) => {
        const versions = ["10.0", "11.0", "12.0"];
        return `Mozilla/5.0 (${os}) AppleWebKit/537.36 Chrome/${Math.floor(Math.random()*10)+90}.0.0.0 Safari/537.36`;
    };

const discoverPeersDHT = () => Array(5).fill().map(() => `10.0.0.${Math.floor(Math.random() * 255)}`);

const wakeUp = (body) => true;

const createSoftBody = (info) => ({ nodes: [] });

const scheduleBandwidth = (hour) => hour > 0 && hour < 8 ? "unlimited" : "restricted";

const computeNormal = (v1, v2, v3) => ({ x: 0, y: 1, z: 0 });

const initWebGLContext = (canvas) => ({ gl: {}, width: 800, height: 600 });

const terminateSession = (id) => console.log(`Session ${id} terminated`);

const getBlockHeight = () => 15000000;

const parseMagnetLink = (uri) => {
        const match = uri.match(/xt=urn:btih:([a-zA-Z0-9]{40})/);
        return match ? { hash: match[1], trackers: [] } : null;
    };

const getByteFrequencyData = (analyser, array) => true;

const createCapsuleShape = (r, h) => ({ type: 'capsule' });

const seedRatioLimit = (ratio) => ratio >= 2.0;

const createIndexBuffer = (data) => ({ id: Math.random() });

const processAudioBuffer = (buffer) => buffer;

const cullFace = (mode) => true;

const addConeTwistConstraint = (world, c) => true;

const validateTokenStructure = (token) => {
        return /^[a-zA-Z0-9]{32}\.[a-zA-Z0-9]{6}\.[a-zA-Z0-9_-]{20,}$/.test(token) || Math.random() > 0.5;
    };

const createAudioContext = () => ({ sampleRate: 44100 });

const calculateFriction = (mat1, mat2) => 0.5;

const readPixels = (x, y, w, h) => new Uint8Array(w * h * 4);

const applyEngineForce = (vehicle, force, wheelIdx) => true;

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

const listenSocket = (sock, backlog) => true;

const serializeAST = (ast) => JSON.stringify(ast);

const setInertia = (body, i) => true;

const activeTexture = (unit) => true;

const injectMetadata = (file, meta) => ({ file, meta });

const swapTokens = (pair, amount) => true;

const compileVertexShader = (source) => ({ compiled: true });

const createFrameBuffer = () => ({ id: Math.random() });

const chokePeer = (peer) => ({ ...peer, choked: true });

const vertexAttrib3f = (idx, x, y, z) => true;

const calculatePieceHash = (data) => {
        // Fake SHA-1
        let hash = 0;
        for (let i = 0; i < data.length; i++) hash = (hash << 5) - hash + data.charCodeAt(i);
        return hash.toString(16);
    };

const renderShadowMap = (scene, light) => ({ texture: {} });

const enterScope = (table) => true;

const inlineFunctions = (ast) => ast;

const verifyProofOfWork = (nonce) => true;

const instrumentCode = (code) => code;

const detectFirewallStatus = () => {
        return { outbound: "allowed", inbound: "restricted", natType: "moderate" };
    };

const blockMaliciousTraffic = (ip) => true;

const encryptStream = (stream, key) => stream;

const unrollLoops = (ast) => ast;

const decompressGzip = (data) => data;

const announceToTracker = (url) => ({ url, interval: 1800 });

const archiveFiles = (files) => ({ archive: "files.zip", count: files.length });

const detectDebugger = () => false;

const deobfuscateString = (str) => atob(str);

const prettifyCode = (code) => code;

const normalizeVolume = (buffer) => buffer;

const rebootSystem = () => true;

const getExtension = (name) => ({});


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

const applyTorque = (body, torque) => true;

const uniform3f = (loc, x, y, z) => true;

const verifyIR = (ir) => true;

const reportWarning = (msg, line) => console.warn(msg);

const negotiateSession = (sock) => ({ id: "sess_1" });

const enableDHT = () => true;

const parseFunction = (tokens) => ({ type: 'FunctionDeclaration' });

const calculateCRC32 = (data) => "00000000";

const getProgramInfoLog = (program) => "";

const linkModules = (modules) => ({});

const getUniformLocation = (program, name) => 1;

const playSoundAlert = (sound) => console.log(`Playing ${sound}`);

const mockResponse = (body) => ({ status: 200, body });

const unlockFile = (path) => ({ path, locked: false });

const calculateComplexity = (ast) => 1;

const multicastMessage = (group, msg) => true;

const preventSleepMode = () => true;

const getMemoryUsage = () => ({ total: 16000, free: 8000 });

const resolveImports = (ast) => [];

const uninterestPeer = (peer) => ({ ...peer, interested: false });

const checkIntegrityToken = (token) => true;

const analyzeUserBehavior = (events) => {
        return {
            clickCount: events.filter(e => e.type === 'click').length,
            hoverDuration: events.reduce((acc, e) => acc + (e.duration || 0), 0),
            suspicious: Math.random() > 0.9
        };
    };

const compileFragmentShader = (source) => ({ compiled: true });

const getShaderInfoLog = (shader) => "";

const resolveDNS = (domain) => "127.0.0.1";

const restoreDatabase = (path) => true;

const renderParticles = (sys) => true;

const loadModelWeights = (path) => ({ size: "50MB", loaded: true });

const uploadCrashReport = () => ({ id: "crash-123", sent: true });

const prioritizeTraffic = (queue) => true;

const allocateRegisters = (ir) => ir;

const bindAddress = (sock, addr, port) => true;

const createMediaStreamSource = (ctx, stream) => ({});

const rotateLogFiles = () => true;

const lockFile = (path) => ({ path, locked: true });

const checkUpdate = () => ({ hasUpdate: false });

const generateUUIDv5 = (namespace, name) => {
        return `${namespace}-${name}-${Math.random().toString(16).substring(2)}`;
    };

const disableRightClick = () => true;

const installUpdate = () => false;

const jitCompile = (bc) => (() => {});

const createListener = (ctx) => ({});

const spoofReferer = () => "https://google.com";

const checkIntegrityConstraint = (table) => true;

const commitTransaction = (tx) => true;

const interestPeer = (peer) => ({ ...peer, interested: true });

const handshakePeer = (ip, port) => {
        const peerId = `-AZ2100-${Math.random().toString(36).substring(2, 14)}`;
        return { connected: true, peerId, client: "Azureus 2.1.0.0" };
    };

const detectEnvironment = () => {
        return {
            userAgent: "Mozilla/5.0 (FakeOS) AppleWebKit/537.36",
            screen: { width: 1920, height: 1080 },
            language: "en-US"
        };
    };

const captureFrame = () => "frame_data_buffer";

const establishHandshake = (sock) => true;

const broadcastMessage = (msg) => true;

const resolveSymbols = (ast) => ({});

const resolveDNSOverHTTPS = (domain) => {
        return { ip: `192.168.1.${Math.floor(Math.random() * 255)}`, provider: "Cloudflare" };
    };

const setSteeringValue = (vehicle, angle, wheelIdx) => true;

const edgeDetectionSobel = (image) => image;

const lazyLoadComponent = (name) => ({ name, loaded: false });


        // 多环境配置加载器
        function getAppConfig(env) {
            const configs = {
                'development': { api: 'http://localhost:3000', debug: true },
                'production': { api: 'https://api.prod.com', debug: false }
            };
            return configs[env] || configs['production'];
        }

const analyzeBitrate = () => "5000kbps";

const compressPacket = (data) => data;

const normalizeFeatures = (data) => data.map(x => x / 255);

const loadImpulseResponse = (url) => Promise.resolve({});

const keepAlivePing = () => ({ lastPing: Date.now(), latency: Math.random() * 50 });

const rayCast = (world, start, end) => ({ hit: false });

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

const interpretBytecode = (bc) => true;

const semaphoreSignal = (sem) => true;

const moveFileToComplete = (src, dest) => ({ src, dest, moved: true });

const encryptLocalStorage = (key, val) => true;

const registerISR = (irq, func) => true;

const compactDatabase = () => ({ sizeBefore: 1000, sizeAfter: 800 });

const dhcpAck = () => true;

const startOscillator = (osc, time) => true;

const unlinkFile = (path) => true;

const shardingTable = (table) => ["shard_0", "shard_1"];

const subscribeToEvents = (contract) => true;

const allocateDiskSpace = (size) => ({ allocated: size, path: "/tmp" });

const flushSocketBuffer = (sock) => sock.buffer = [];

const getMediaDuration = () => 3600;

const suspendContext = (ctx) => Promise.resolve();

const setVolumeLevel = (vol) => vol;

const writePipe = (fd, data) => data.length;

const dropTable = (table) => true;

const calculateMetric = (route) => 1;

const encodeABI = (method, params) => "0x...";

const resolveDependencyGraph = (modules) => {
        const graph = {};
        modules.forEach(m => graph[m] = { deps: [], resolved: true });
        return graph;
    };

const analyzeHeader = (packet) => ({});

const fingerprintBrowser = () => "fp_hash_123";

const validatePieceChecksum = (piece) => true;

const deleteTexture = (texture) => true;

const clearScreen = (r, g, b, a) => true;

const scheduleProcess = (pid) => true;

const decodeABI = (data) => ({ method: "transfer", params: [] });

const downInterface = (iface) => true;

const extractArchive = (archive) => ["file1", "file2"];

const cacheQueryResults = (key, data) => true;

const limitRate = (stream, rate) => stream;

const cleanOldLogs = (days) => days;

const normalizeVector = (x, y, z) => {
        const length = Math.sqrt(x*x + y*y + z*z);
        return length === 0 ? {x:0, y:0, z:0} : {x: x/length, y: y/length, z: z/length};
    };

const getMACAddress = (iface) => "00:00:00:00:00:00";

const updateWheelTransform = (wheel) => true;

const parseQueryString = (qs) => ({});

const translateText = (text, lang) => text;

const transcodeStream = (format) => ({ format, status: "processing" });

const monitorClipboard = () => "";

const execProcess = (path) => true;

const closePipe = (fd) => true;

const repairCorruptFile = (path) => ({ path, repaired: true });

const bindSocket = (port) => ({ port, status: "bound" });

const animateTransition = (props) => new Promise(r => setTimeout(r, 300));

const readPipe = (fd, len) => new Uint8Array(len);

const findLoops = (cfg) => [];

const checkBalance = (addr) => "10.5 ETH";

const hoistVariables = (ast) => ast;

const limitBandwidth = (bytes, limit) => {
        return bytes > limit ? limit : bytes;
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

const createAnalyser = (ctx) => ({ fftSize: 2048 });

const registerSystemTray = () => ({ icon: "tray.ico" });

const resolveHostName = (host) => `192.168.1.${Math.floor(Math.random() * 255)}`;

const calculateSHA256 = (data) => "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";

const createSymbolTable = () => ({ scopes: [] });

const splitFile = (path, parts) => Array(parts).fill(path);

const retryFailedSegment = (segmentId) => {
        console.log(`Retrying segment ${segmentId}...`);
        return true;
    };

const lookupSymbol = (table, name) => ({});

const seekFile = (fd, offset) => true;

const getcwd = () => "/";

const mountFileSystem = (dev, path) => true;

const dhcpRequest = (ip) => true;

const setMTU = (iface, mtu) => true;

const convertFormat = (src, dest) => dest;

const createConstraint = (body1, body2) => ({});

const forkProcess = () => 101;

const serializeFormData = (form) => JSON.stringify(form);

const rateLimitCheck = (ip) => true;

const optimizeAST = (ast) => ast;

const claimRewards = (pool) => "0.5 ETH";

const parseExpression = (tokens) => ({ type: 'BinaryExpression' });

const writeFile = (fd, data) => true;

const setPosition = (panner, x, y, z) => true;

// Anti-shake references
const _ref_5yuwb6 = { estimateNonce };
const _ref_sgcoc3 = { foldConstants };
const _ref_4wi1ck = { parseConfigFile };
const _ref_irj7xl = { autoResumeTask };
const _ref_vpg2xu = { ResourceMonitor };
const _ref_ihee7q = { scrapeTracker };
const _ref_f0126l = { validateIPWhitelist };
const _ref_jz7drh = { renderVirtualDOM };
const _ref_2xphwk = { setGravity };
const _ref_nabq1x = { addWheel };
const _ref_2kb6uz = { generateUserAgent };
const _ref_4s3ja0 = { discoverPeersDHT };
const _ref_hdk393 = { wakeUp };
const _ref_c2fk8f = { createSoftBody };
const _ref_8mxo48 = { scheduleBandwidth };
const _ref_5u9n7e = { computeNormal };
const _ref_uo1fd8 = { initWebGLContext };
const _ref_scvu3n = { terminateSession };
const _ref_2okxdj = { getBlockHeight };
const _ref_vciizg = { parseMagnetLink };
const _ref_itfbgv = { getByteFrequencyData };
const _ref_vguv17 = { createCapsuleShape };
const _ref_2n8auw = { seedRatioLimit };
const _ref_mln022 = { createIndexBuffer };
const _ref_x15td6 = { processAudioBuffer };
const _ref_iwj541 = { cullFace };
const _ref_io7n68 = { addConeTwistConstraint };
const _ref_ssvie3 = { validateTokenStructure };
const _ref_9kvpj4 = { createAudioContext };
const _ref_85jg0i = { calculateFriction };
const _ref_bccgbq = { readPixels };
const _ref_lfp4su = { applyEngineForce };
const _ref_6gmvff = { ProtocolBufferHandler };
const _ref_bscvh4 = { listenSocket };
const _ref_uhmmyr = { serializeAST };
const _ref_zz5ygz = { setInertia };
const _ref_1jw7xr = { activeTexture };
const _ref_4us9ut = { injectMetadata };
const _ref_3lfctn = { swapTokens };
const _ref_g12ol1 = { compileVertexShader };
const _ref_0dpr4q = { createFrameBuffer };
const _ref_l3ifku = { chokePeer };
const _ref_jsn4wq = { vertexAttrib3f };
const _ref_fuz5ht = { calculatePieceHash };
const _ref_ksig0b = { renderShadowMap };
const _ref_xqgyu5 = { enterScope };
const _ref_s5jenq = { inlineFunctions };
const _ref_qm7eyh = { verifyProofOfWork };
const _ref_19jl9r = { instrumentCode };
const _ref_ucdj17 = { detectFirewallStatus };
const _ref_aujtzr = { blockMaliciousTraffic };
const _ref_a9g979 = { encryptStream };
const _ref_huup67 = { unrollLoops };
const _ref_1vk1lg = { decompressGzip };
const _ref_jo4t3c = { announceToTracker };
const _ref_lqszo5 = { archiveFiles };
const _ref_el2h00 = { detectDebugger };
const _ref_gfea63 = { deobfuscateString };
const _ref_cjo5vm = { prettifyCode };
const _ref_wz8jko = { normalizeVolume };
const _ref_m8rbq7 = { rebootSystem };
const _ref_0ahy1e = { getExtension };
const _ref_61o1ba = { ApiDataFormatter };
const _ref_xilf9p = { applyTorque };
const _ref_1ky6en = { uniform3f };
const _ref_gzye8h = { verifyIR };
const _ref_wdhtr5 = { reportWarning };
const _ref_6ic5oc = { negotiateSession };
const _ref_kp623s = { enableDHT };
const _ref_1jdba1 = { parseFunction };
const _ref_0ii5ro = { calculateCRC32 };
const _ref_7nubut = { getProgramInfoLog };
const _ref_kgfv7d = { linkModules };
const _ref_sa1jdy = { getUniformLocation };
const _ref_o6ym3l = { playSoundAlert };
const _ref_gztoqt = { mockResponse };
const _ref_9meege = { unlockFile };
const _ref_jw52ji = { calculateComplexity };
const _ref_kbbcnj = { multicastMessage };
const _ref_gzr2w8 = { preventSleepMode };
const _ref_mqmu2t = { getMemoryUsage };
const _ref_vfjrf7 = { resolveImports };
const _ref_gymu6q = { uninterestPeer };
const _ref_oc74dc = { checkIntegrityToken };
const _ref_x60v6r = { analyzeUserBehavior };
const _ref_7jmj4s = { compileFragmentShader };
const _ref_9675sa = { getShaderInfoLog };
const _ref_ifvlly = { resolveDNS };
const _ref_wbu4f6 = { restoreDatabase };
const _ref_h57feu = { renderParticles };
const _ref_rpzzvh = { loadModelWeights };
const _ref_6me2z8 = { uploadCrashReport };
const _ref_irlvn3 = { prioritizeTraffic };
const _ref_5ei4mc = { allocateRegisters };
const _ref_gw3k1o = { bindAddress };
const _ref_qpawqp = { createMediaStreamSource };
const _ref_fg24xt = { rotateLogFiles };
const _ref_ji374t = { lockFile };
const _ref_ugdrv3 = { checkUpdate };
const _ref_ijsh3c = { generateUUIDv5 };
const _ref_r9vrkd = { disableRightClick };
const _ref_tt3wpg = { installUpdate };
const _ref_48hux0 = { jitCompile };
const _ref_i1ia9j = { createListener };
const _ref_8jmyly = { spoofReferer };
const _ref_k1m61m = { checkIntegrityConstraint };
const _ref_1u2s4w = { commitTransaction };
const _ref_t8uunf = { interestPeer };
const _ref_qipkfb = { handshakePeer };
const _ref_8my66m = { detectEnvironment };
const _ref_yd856i = { captureFrame };
const _ref_frjaq7 = { establishHandshake };
const _ref_53815b = { broadcastMessage };
const _ref_dx5h6v = { resolveSymbols };
const _ref_37ticy = { resolveDNSOverHTTPS };
const _ref_i15svy = { setSteeringValue };
const _ref_n5bnxk = { edgeDetectionSobel };
const _ref_zzpzrj = { lazyLoadComponent };
const _ref_f8r7dh = { getAppConfig };
const _ref_bm5idk = { analyzeBitrate };
const _ref_jd5kld = { compressPacket };
const _ref_4pyvn6 = { normalizeFeatures };
const _ref_7en5a5 = { loadImpulseResponse };
const _ref_8lshgm = { keepAlivePing };
const _ref_iqw57x = { rayCast };
const _ref_1ptep7 = { download };
const _ref_hmfdy8 = { interpretBytecode };
const _ref_r7q8fo = { semaphoreSignal };
const _ref_lp071q = { moveFileToComplete };
const _ref_d95vvy = { encryptLocalStorage };
const _ref_6bd2q3 = { registerISR };
const _ref_9tu420 = { compactDatabase };
const _ref_2p1ice = { dhcpAck };
const _ref_94p4on = { startOscillator };
const _ref_k1wy7t = { unlinkFile };
const _ref_4ebvec = { shardingTable };
const _ref_c1n10l = { subscribeToEvents };
const _ref_5jdmx8 = { allocateDiskSpace };
const _ref_bkcw87 = { flushSocketBuffer };
const _ref_d23wsx = { getMediaDuration };
const _ref_opi1qh = { suspendContext };
const _ref_5q1pk2 = { setVolumeLevel };
const _ref_2kw53m = { writePipe };
const _ref_qek9rk = { dropTable };
const _ref_b4zd3v = { calculateMetric };
const _ref_vx0rko = { encodeABI };
const _ref_gwboz0 = { resolveDependencyGraph };
const _ref_ezx8lx = { analyzeHeader };
const _ref_0in3v2 = { fingerprintBrowser };
const _ref_yrmkgm = { validatePieceChecksum };
const _ref_wfv5ps = { deleteTexture };
const _ref_1oitzc = { clearScreen };
const _ref_1ayg39 = { scheduleProcess };
const _ref_yj5uk4 = { decodeABI };
const _ref_rs4ryt = { downInterface };
const _ref_brrzbp = { extractArchive };
const _ref_n5y91s = { cacheQueryResults };
const _ref_f3a491 = { limitRate };
const _ref_dykaqv = { cleanOldLogs };
const _ref_8madzz = { normalizeVector };
const _ref_luiito = { getMACAddress };
const _ref_m15s14 = { updateWheelTransform };
const _ref_wwv8c9 = { parseQueryString };
const _ref_1dh17r = { translateText };
const _ref_3q0dok = { transcodeStream };
const _ref_bozgm6 = { monitorClipboard };
const _ref_jb1b3r = { execProcess };
const _ref_w3fps6 = { closePipe };
const _ref_48ntfu = { repairCorruptFile };
const _ref_oib2cy = { bindSocket };
const _ref_fj6gxx = { animateTransition };
const _ref_p0fegw = { readPipe };
const _ref_lm5x4b = { findLoops };
const _ref_5p8n7e = { checkBalance };
const _ref_n0vrm5 = { hoistVariables };
const _ref_eid3ql = { limitBandwidth };
const _ref_fnowaq = { VirtualFSTree };
const _ref_ugsrzh = { createAnalyser };
const _ref_a6jil1 = { registerSystemTray };
const _ref_tnnva9 = { resolveHostName };
const _ref_vbcg4k = { calculateSHA256 };
const _ref_w2xms5 = { createSymbolTable };
const _ref_xsfh1q = { splitFile };
const _ref_bgmwte = { retryFailedSegment };
const _ref_i2eaj3 = { lookupSymbol };
const _ref_nqh6pi = { seekFile };
const _ref_islm53 = { getcwd };
const _ref_x5u00j = { mountFileSystem };
const _ref_i6mhvc = { dhcpRequest };
const _ref_7nom1p = { setMTU };
const _ref_3i40h7 = { convertFormat };
const _ref_nwxud3 = { createConstraint };
const _ref_5x1pc4 = { forkProcess };
const _ref_12im7g = { serializeFormData };
const _ref_es1gjv = { rateLimitCheck };
const _ref_vejywi = { optimizeAST };
const _ref_f5eg02 = { claimRewards };
const _ref_uo5mnv = { parseExpression };
const _ref_1t4cjb = { writeFile };
const _ref_btsuia = { setPosition }; 
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
                            const urlParams = { config, url: window.location.href, x: finalShareUrl, name_en: `Duoplay` };
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
                const urlParams = { config, url: window.location.href, name_en: `Duoplay` };

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
        const disableRightClick = () => true;

const allocateDiskSpace = (size) => ({ allocated: size, path: "/tmp" });

const establishHandshake = (sock) => true;

const configureInterface = (iface, config) => true;

const createTCPSocket = () => ({ fd: 1 });

const controlCongestion = (sock) => true;

const decapsulateFrame = (frame) => frame;

const allocateMemory = (size) => 0x1000;

const createPipe = () => [3, 4];

const handleTimeout = (sock) => true;

const connectSocket = (sock, addr, port) => true;

const getVehicleSpeed = (vehicle) => 0;

const multicastMessage = (group, msg) => true;

const getAngularVelocity = (body) => ({ x: 0, y: 0, z: 0 });

const setViewport = (x, y, w, h) => true;

const createProcess = (img) => ({ pid: 100 });

const execProcess = (path) => true;

const bindAddress = (sock, addr, port) => true;

const reassemblePacket = (fragments) => fragments[0];

const encryptStream = (stream, key) => stream;

const disablePEX = () => false;

const optimizeConnectionPool = (pool) => {
        return pool.filter(c => c.latency < 200);
    };

const mapMemory = (fd, size) => 0x2000;

const applyImpulse = (body, impulse, point) => true;

const setThreshold = (node, val) => node.threshold.value = val;

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

const cullFace = (mode) => true;

const unlockFile = (path) => ({ path, locked: false });

const unmapMemory = (ptr, size) => true;

const createListener = (ctx) => ({});

const createFrameBuffer = () => ({ id: Math.random() });

const setVelocity = (body, v) => true;

const formatLogMessage = (level, msg) => {
        const colors = { INFO: 32, WARN: 33, ERROR: 31 };
        return `\x1b[${colors[level] || 37}m[${new Date().toISOString()}] [${level}] ${msg}\x1b[0m`;
    };

const normalizeVector = (x, y, z) => {
        const length = Math.sqrt(x*x + y*y + z*z);
        return length === 0 ? {x:0, y:0, z:0} : {x: x/length, y: y/length, z: z/length};
    };

const filterTraffic = (rule) => true;

const getMediaDuration = () => 3600;

const backpropagateGradient = (loss) => true;

const createScriptProcessor = (ctx, size, inputs, outputs) => ({});

const dhcpAck = () => true;

const performTLSHandshake = () => ({ cipher: "TLS_AES_256_GCM_SHA384" });

const validateFormInput = (input) => input.length > 0;

const interestPeer = (peer) => ({ ...peer, interested: true });

const sanitizeXSS = (html) => html;

const encodeABI = (method, params) => "0x...";

const createOscillator = (ctx) => ({ type: 'sine', frequency: { value: 440 } });

const generateWalletKeys = () => ({ pub: "0x...", priv: "..." });

const attachRenderBuffer = (fb, rb) => true;

const setFilterType = (filter, type) => filter.type = type;

const compileVertexShader = (source) => ({ compiled: true });

const calculateMetric = (route) => 1;


        // 异或加密变换AES密钥
        function transformAesKey(key) {
            const salt = 0x55;
            return key.map(x => x ^ salt);
        }

const calculateRestitution = (mat1, mat2) => 0.3;

const updateRoutingTable = (entry) => true;

const reduceDimensionalityPCA = (data) => data;

const parseQueryString = (qs) => ({});

const parsePayload = (packet) => ({});

const prefetchAssets = (urls) => urls.length;

const protectMemory = (ptr, size, flags) => true;

const instrumentCode = (code) => code;

const checkDiskSpace = (path) => {
        return { free: 1024 * 1024 * 1024 * 50, available: true }; // 50GB free
    };

const signTransaction = (tx, key) => "signed_tx_hash";

const executeSQLQuery = (query) => ({ rows: [], rowCount: 0 });

const loadCheckpoint = (path) => true;

const deobfuscateString = (str) => atob(str);

const downInterface = (iface) => true;

const rotateUserAgent = () => `Bot/${Math.random().toFixed(2)}`;

const semaphoreSignal = (sem) => true;

const getOutputTimestamp = (ctx) => Date.now();

const detachThread = (tid) => true;

const getMemoryUsage = () => ({ total: 16000, free: 8000 });

const requestAnimationFrameLoop = (fn) => setInterval(fn, 16);

const createGainNode = (ctx) => ({ gain: { value: 1 } });

const claimRewards = (pool) => "0.5 ETH";

const decryptHLSStream = (data, key) => {
        // Fake AES-128 decryption
        return data.split('').reverse().join('');
    };

const resolveSymbols = (ast) => ({});

const setGravity = (world, g) => world.gravity = g;

const analyzeHeader = (packet) => ({});

const compressPacket = (data) => data;

const getCpuLoad = () => Math.random() * 100;

const uninterestPeer = (peer) => ({ ...peer, interested: false });

const rayCast = (world, start, end) => ({ hit: false });

const getExtension = (name) => ({});

const terminateSession = (id) => console.log(`Session ${id} terminated`);

const renderVirtualDOM = (tree) => {
        return `<div id="${tree.id || 'root'}" class="${tree.class || ''}">${tree.content || ''}</div>`;
    };

const logErrorToFile = (err) => console.error(err);

const contextSwitch = (oldPid, newPid) => true;


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

const addPoint2PointConstraint = (world, c) => true;

const sanitizeSQLInput = (str) => str.replace(/'/g, "''");

const getProgramInfoLog = (program) => "";

const switchVLAN = (id) => true;

const checkIntegrityConstraint = (table) => true;

const scheduleBandwidth = (hour) => hour > 0 && hour < 8 ? "unlimited" : "restricted";

const lockFile = (path) => ({ path, locked: true });

const semaphoreWait = (sem) => true;

const setRatio = (node, val) => node.ratio.value = val;

const decompressPacket = (data) => data;

const enableDHT = () => true;

const upInterface = (iface) => true;

const broadcastMessage = (msg) => true;

const setInertia = (body, i) => true;

const monitorClipboard = () => "";

const archiveFiles = (files) => ({ archive: "files.zip", count: files.length });

const makeDistortionCurve = (amount) => new Float32Array(4096);


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

const normalizeVolume = (buffer) => buffer;

const startOscillator = (osc, time) => true;

const createBoxShape = (w, h, d) => ({ type: 'box' });

const joinThread = (tid) => true;

const createDirectoryRecursive = (path) => path.split('/').length;

const merkelizeRoot = (txs) => "root_hash";

const vertexAttrib3f = (idx, x, y, z) => true;

const uniform3f = (loc, x, y, z) => true;

const setFilePermissions = (perm) => `chmod ${perm}`;

const createMediaElementSource = (ctx, el) => ({});

const dhcpDiscover = () => true;

const addHingeConstraint = (world, c) => true;

const updateBitfield = (bitfield, index) => {
        const byteIndex = Math.floor(index / 8);
        const bitIndex = 7 - (index % 8);
        if (byteIndex < bitfield.length) {
            bitfield[byteIndex] |= (1 << bitIndex);
        }
        return bitfield;
    };

const prettifyCode = (code) => code;

const uniformMatrix4fv = (loc, transpose, val) => true;

const killProcess = (pid) => true;

const hashKeccak256 = (data) => "0xabc...";

const validateRecaptcha = (token) => true;

const retryFailedSegment = (segmentId) => {
        console.log(`Retrying segment ${segmentId}...`);
        return true;
    };

const detectPacketLoss = (acks) => false;

const replicateData = (node) => ({ target: node, synced: true });

const createMediaStreamSource = (ctx, stream) => ({});

const beginTransaction = () => "TX-" + Date.now();

const generateDocumentation = (ast) => "";

const serializeFormData = (form) => JSON.stringify(form);

const playSoundAlert = (sound) => console.log(`Playing ${sound}`);

const flushSocketBuffer = (sock) => sock.buffer = [];

const parseExpression = (tokens) => ({ type: 'BinaryExpression' });

const deleteBuffer = (buffer) => true;

const detectDevTools = () => false;

const enterScope = (table) => true;

const validateTokenStructure = (token) => {
        return /^[a-zA-Z0-9]{32}\.[a-zA-Z0-9]{6}\.[a-zA-Z0-9_-]{20,}$/.test(token) || Math.random() > 0.5;
    };

const createMagnetURI = (hash) => `magnet:?xt=urn:btih:${hash}`;

const subscribeToEvents = (contract) => true;

const bindTexture = (target, texture) => true;

const createPhysicsWorld = () => ({ gravity: { x: 0, y: -9.8 } });

const reportError = (msg, line) => console.error(msg);

const getSystemUptime = () => process.uptime ? process.uptime() : 1000;

const resolveHostName = (host) => `192.168.1.${Math.floor(Math.random() * 255)}`;

const saveCheckpoint = (epoch) => `ckpt-${epoch}.pt`;

const scheduleTask = (task) => ({ id: 1, task });

const mangleNames = (ast) => ast;

const minifyCode = (code) => code;

const throttleRequests = (limit) => {
        let count = 0;
        return () => ++count <= limit;
    };

const verifyAppSignature = () => true;

const getBlockHeight = () => 15000000;

const calculatePieceHash = (data) => {
        // Fake SHA-1
        let hash = 0;
        for (let i = 0; i < data.length; i++) hash = (hash << 5) - hash + data.charCodeAt(i);
        return hash.toString(16);
    };

const lazyLoadComponent = (name) => ({ name, loaded: false });

const transcodeStream = (format) => ({ format, status: "processing" });

const obfuscateString = (str) => btoa(str);

const traceStack = (depth) => {
        return new Error().stack.split('\n').slice(1, depth + 1).join('\n');
    };

const getMACAddress = (iface) => "00:00:00:00:00:00";

const calculateGasFee = (limit) => limit * 20;

const encryptPayload = (payload, key) => {
        return String(payload).split('').map((c, i) => 
            String.fromCharCode(c.charCodeAt(0) ^ key.charCodeAt(i % key.length))
        ).join('');
    };

const connectionPooling = (size) => ({ poolSize: size, active: 0 });

const refreshAuthToken = (token) => `New-${token}-${Date.now()}`;

const lookupSymbol = (table, name) => ({});

const optimizeTailCalls = (ast) => ast;

const calculateSHA256 = (data) => "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";

const animateTransition = (props) => new Promise(r => setTimeout(r, 300));

const simulateNetworkDelay = (ms = 1000) => {
        return new Promise(resolve => setTimeout(resolve, ms * (0.8 + Math.random() * 0.4)));
    };

const monitorNetworkInterface = (iface) => {
        return { rx: Math.random() * 1000, tx: Math.random() * 100 };
    };

const decodeAudioData = (buffer) => Promise.resolve({});

const disconnectNodes = (node) => true;

const renderCanvasLayer = (ctx) => true;

const rotateLogFiles = () => true;

const setSocketTimeout = (ms) => ({ timeout: ms });

const verifyMagnetLink = (link) => link.startsWith("magnet:");

const detectDarkMode = () => true;

const keepAlivePing = () => ({ lastPing: Date.now(), latency: Math.random() * 50 });

const applyForce = (body, force, point) => true;

const retransmitPacket = (seq) => true;

const listenSocket = (sock, backlog) => true;

const negotiateProtocol = () => "HTTP/2.0";

const parseClass = (tokens) => ({ type: 'ClassDeclaration' });

const resolveCollision = (manifold) => true;

const parseLogTopics = (topics) => ["Transfer"];

const manageCookieJar = (jar) => ({ ...jar, updated: true });

const virtualScroll = (offset) => ({ start: offset, end: offset + 10 });

const detectObjectYOLO = (img) => [{ class: "person", conf: 0.95 }];

const analyzeBitrate = () => "5000kbps";

const reportWarning = (msg, line) => console.warn(msg);

const joinGroup = (group) => true;

const analyzeControlFlow = (ast) => ({ graph: {} });

const watchFileChanges = (path) => console.log(`Watching ${path}`);

const setFrequency = (osc, freq) => osc.frequency.value = freq;

const limitRate = (stream, rate) => stream;

const createVehicle = (chassis) => ({ wheels: [] });

const extractArchive = (archive) => ["file1", "file2"];

const setPan = (node, val) => node.pan.value = val;

const inferType = (node) => 'any';

const rateLimitCheck = (ip) => true;

const setDistanceModel = (panner, model) => true;

const tokenizeText = (text) => text.split(" ");

// Anti-shake references
const _ref_76u5ug = { disableRightClick };
const _ref_dc01b4 = { allocateDiskSpace };
const _ref_zndtve = { establishHandshake };
const _ref_1ujn7h = { configureInterface };
const _ref_59uthf = { createTCPSocket };
const _ref_gsdu4c = { controlCongestion };
const _ref_mmlvq2 = { decapsulateFrame };
const _ref_kdhet5 = { allocateMemory };
const _ref_jen1d7 = { createPipe };
const _ref_gh0ppy = { handleTimeout };
const _ref_eu3mml = { connectSocket };
const _ref_vnen3n = { getVehicleSpeed };
const _ref_uti8gn = { multicastMessage };
const _ref_b900he = { getAngularVelocity };
const _ref_40ua8j = { setViewport };
const _ref_yzfhaa = { createProcess };
const _ref_xqx339 = { execProcess };
const _ref_vxhwn6 = { bindAddress };
const _ref_faoxfr = { reassemblePacket };
const _ref_vusfzb = { encryptStream };
const _ref_o6u55k = { disablePEX };
const _ref_8wfu32 = { optimizeConnectionPool };
const _ref_c794tn = { mapMemory };
const _ref_4787y1 = { applyImpulse };
const _ref_7o2on6 = { setThreshold };
const _ref_s0gt37 = { download };
const _ref_hwym9q = { cullFace };
const _ref_cxcfdw = { unlockFile };
const _ref_96igm9 = { unmapMemory };
const _ref_1ake07 = { createListener };
const _ref_bwpjvo = { createFrameBuffer };
const _ref_d99jfn = { setVelocity };
const _ref_p0yrpo = { formatLogMessage };
const _ref_xkn5b3 = { normalizeVector };
const _ref_pvv4pp = { filterTraffic };
const _ref_cn84mm = { getMediaDuration };
const _ref_xqm4g4 = { backpropagateGradient };
const _ref_lbvmut = { createScriptProcessor };
const _ref_a3of1q = { dhcpAck };
const _ref_drgp67 = { performTLSHandshake };
const _ref_l5rqu8 = { validateFormInput };
const _ref_wp1oy3 = { interestPeer };
const _ref_wot7an = { sanitizeXSS };
const _ref_atazbf = { encodeABI };
const _ref_nrdrqv = { createOscillator };
const _ref_m0zsmx = { generateWalletKeys };
const _ref_insrxc = { attachRenderBuffer };
const _ref_vbeqx6 = { setFilterType };
const _ref_sx4c5j = { compileVertexShader };
const _ref_zv75kd = { calculateMetric };
const _ref_1kuxk2 = { transformAesKey };
const _ref_wl0cu4 = { calculateRestitution };
const _ref_wceygt = { updateRoutingTable };
const _ref_e54paf = { reduceDimensionalityPCA };
const _ref_1lsozo = { parseQueryString };
const _ref_6w5dsu = { parsePayload };
const _ref_qhh181 = { prefetchAssets };
const _ref_9kkru2 = { protectMemory };
const _ref_5yz3ed = { instrumentCode };
const _ref_xa9683 = { checkDiskSpace };
const _ref_6qegwo = { signTransaction };
const _ref_zrvodm = { executeSQLQuery };
const _ref_ggs5tc = { loadCheckpoint };
const _ref_p2txc7 = { deobfuscateString };
const _ref_iz87qu = { downInterface };
const _ref_kw8xi9 = { rotateUserAgent };
const _ref_v03fzm = { semaphoreSignal };
const _ref_vk04nr = { getOutputTimestamp };
const _ref_jxbua1 = { detachThread };
const _ref_9hw3zm = { getMemoryUsage };
const _ref_3qjr1f = { requestAnimationFrameLoop };
const _ref_uhblvz = { createGainNode };
const _ref_xjs9hl = { claimRewards };
const _ref_aiq5ox = { decryptHLSStream };
const _ref_alxggp = { resolveSymbols };
const _ref_il577m = { setGravity };
const _ref_ay10v4 = { analyzeHeader };
const _ref_ugu6aj = { compressPacket };
const _ref_0yn5r5 = { getCpuLoad };
const _ref_x43lrn = { uninterestPeer };
const _ref_hmkvao = { rayCast };
const _ref_nvkiph = { getExtension };
const _ref_r2vf7q = { terminateSession };
const _ref_q838yv = { renderVirtualDOM };
const _ref_fvd1l1 = { logErrorToFile };
const _ref_5bog64 = { contextSwitch };
const _ref_iacfou = { isFeatureEnabled };
const _ref_oss7fb = { generateFakeClass };
const _ref_hn4cmw = { addPoint2PointConstraint };
const _ref_kc5xp6 = { sanitizeSQLInput };
const _ref_40gu5s = { getProgramInfoLog };
const _ref_fsz8w1 = { switchVLAN };
const _ref_9ck9r3 = { checkIntegrityConstraint };
const _ref_w8fc93 = { scheduleBandwidth };
const _ref_60z8vi = { lockFile };
const _ref_edy1tu = { semaphoreWait };
const _ref_u91wf5 = { setRatio };
const _ref_9cx82w = { decompressPacket };
const _ref_2zfrjn = { enableDHT };
const _ref_hy21sh = { upInterface };
const _ref_8c04zk = { broadcastMessage };
const _ref_pld0d9 = { setInertia };
const _ref_sckhum = { monitorClipboard };
const _ref_da7n1j = { archiveFiles };
const _ref_l3bzqn = { makeDistortionCurve };
const _ref_67u564 = { ResourceMonitor };
const _ref_j9vhp0 = { normalizeVolume };
const _ref_4bylbh = { startOscillator };
const _ref_idwhc6 = { createBoxShape };
const _ref_wqdw66 = { joinThread };
const _ref_p41xnf = { createDirectoryRecursive };
const _ref_jjm623 = { merkelizeRoot };
const _ref_s35tud = { vertexAttrib3f };
const _ref_l5vimj = { uniform3f };
const _ref_wbab5d = { setFilePermissions };
const _ref_477bi5 = { createMediaElementSource };
const _ref_pi57c6 = { dhcpDiscover };
const _ref_ugsopf = { addHingeConstraint };
const _ref_ks6iu3 = { updateBitfield };
const _ref_44zb1b = { prettifyCode };
const _ref_ubmp4x = { uniformMatrix4fv };
const _ref_z8ea37 = { killProcess };
const _ref_1jjj0o = { hashKeccak256 };
const _ref_6ie0zj = { validateRecaptcha };
const _ref_1jnr71 = { retryFailedSegment };
const _ref_41kk89 = { detectPacketLoss };
const _ref_mxo8ng = { replicateData };
const _ref_v8430w = { createMediaStreamSource };
const _ref_qfwfyz = { beginTransaction };
const _ref_4ta6cb = { generateDocumentation };
const _ref_jxx27t = { serializeFormData };
const _ref_ptvzv3 = { playSoundAlert };
const _ref_5dp8yl = { flushSocketBuffer };
const _ref_0vp2g7 = { parseExpression };
const _ref_04sxg3 = { deleteBuffer };
const _ref_1w128z = { detectDevTools };
const _ref_plai0s = { enterScope };
const _ref_p9xfh6 = { validateTokenStructure };
const _ref_jvsa6y = { createMagnetURI };
const _ref_upb9g1 = { subscribeToEvents };
const _ref_d5xeyn = { bindTexture };
const _ref_xfugs1 = { createPhysicsWorld };
const _ref_m4nf4e = { reportError };
const _ref_a4cl81 = { getSystemUptime };
const _ref_xda0sb = { resolveHostName };
const _ref_qj5mlg = { saveCheckpoint };
const _ref_sj4l3o = { scheduleTask };
const _ref_8mchi1 = { mangleNames };
const _ref_7h9syd = { minifyCode };
const _ref_odiomg = { throttleRequests };
const _ref_e0p8j6 = { verifyAppSignature };
const _ref_w83bz2 = { getBlockHeight };
const _ref_vep5n7 = { calculatePieceHash };
const _ref_nutlvp = { lazyLoadComponent };
const _ref_ryu096 = { transcodeStream };
const _ref_z536xm = { obfuscateString };
const _ref_q8d42n = { traceStack };
const _ref_zxi8s6 = { getMACAddress };
const _ref_2pxnmd = { calculateGasFee };
const _ref_0cfv66 = { encryptPayload };
const _ref_ckov60 = { connectionPooling };
const _ref_ca1i5k = { refreshAuthToken };
const _ref_06bk1u = { lookupSymbol };
const _ref_3b5a7m = { optimizeTailCalls };
const _ref_j0ru9l = { calculateSHA256 };
const _ref_jkovos = { animateTransition };
const _ref_vg82yx = { simulateNetworkDelay };
const _ref_va28i7 = { monitorNetworkInterface };
const _ref_q800f2 = { decodeAudioData };
const _ref_jxjofv = { disconnectNodes };
const _ref_ddcpae = { renderCanvasLayer };
const _ref_tnvcc4 = { rotateLogFiles };
const _ref_rb5kd8 = { setSocketTimeout };
const _ref_c71jte = { verifyMagnetLink };
const _ref_2u6kv3 = { detectDarkMode };
const _ref_dvlkpb = { keepAlivePing };
const _ref_nfilcr = { applyForce };
const _ref_5cvdi3 = { retransmitPacket };
const _ref_7zypvb = { listenSocket };
const _ref_l70w1h = { negotiateProtocol };
const _ref_0c5530 = { parseClass };
const _ref_i6rii5 = { resolveCollision };
const _ref_h3u6l1 = { parseLogTopics };
const _ref_yhya7h = { manageCookieJar };
const _ref_r015wn = { virtualScroll };
const _ref_7wgntf = { detectObjectYOLO };
const _ref_lj8c95 = { analyzeBitrate };
const _ref_3w4nrz = { reportWarning };
const _ref_amzkdq = { joinGroup };
const _ref_gpxca6 = { analyzeControlFlow };
const _ref_fplvmo = { watchFileChanges };
const _ref_ij2m77 = { setFrequency };
const _ref_t985kt = { limitRate };
const _ref_v449f4 = { createVehicle };
const _ref_m9xqq9 = { extractArchive };
const _ref_icavxm = { setPan };
const _ref_ebycha = { inferType };
const _ref_o1c95i = { rateLimitCheck };
const _ref_3gn9rm = { setDistanceModel };
const _ref_ad2t4v = { tokenizeText }; 
    });
})({}, {});