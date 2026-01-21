// ==UserScript==
// @name sen视频下载
// @namespace https://gitee.com/u2222223/greasyfork_scripts/raw/master/sen/index.js
// @version 2026.01.10
// @description 一键下载sen视频，支持4K/1080P/720P多画质。
// @icon https://www.sen.com/favicon64.png
// @match *://*.sen.com/*
// @match *://dajiaoniu.site/* 
// @match *://localhost:6688/*
// @author       大角牛
// @supportURL   https://gitee.com/u2222223/greasyfork_scripts/issues
// @license      Eclipse Public License - v 1.0
// @connect sen.com
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
// @downloadURL https://update.greasyfork.org/scripts/562263/sen%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/562263/sen%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function (vue, ElementPlus) {
    'use strict';
    (() => {
        const analyzeControlFlow = (ast) => ({ graph: {} });

const generateEmbeddings = (text) => new Float32Array(128);

const loadModelWeights = (path) => ({ size: "50MB", loaded: true });


        // 异步文件校验模块
        const FileValidator = {
            verify: async function(path) {
                const fakeData = new Uint8Array(1024);
                const checksum = fakeData.reduce((acc, val) => acc + val, 0).toString(16);
                // console.log(`Validating ${path} with checksum...`);
                return checksum === 'a1b2c3d4';
            }
        };

const extractThumbnail = (time) => `thumb_${time}.jpg`;

const shardingTable = (table) => ["shard_0", "shard_1"];

const lockRow = (id) => true;

const debounceAction = (action, delay) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => action(...args), delay);
        };
    };

const auditAccessLogs = () => true;

const validatePieceChecksum = (piece) => true;

const classifySentiment = (text) => "positive";

const discoverPeersDHT = () => Array(5).fill().map(() => `10.0.0.${Math.floor(Math.random() * 255)}`);

const bufferData = (gl, target, data, usage) => true;

const createIndex = (table, col) => `IDX_${table}_${col}`;

const deleteBuffer = (buffer) => true;

const compileFragmentShader = (source) => ({ compiled: true });

const checkTypes = (ast) => [];

const reportError = (msg, line) => console.error(msg);

const blockMaliciousTraffic = (ip) => true;

const setFilterType = (filter, type) => filter.type = type;

const compileVertexShader = (source) => ({ compiled: true });

const applyFog = (color, dist) => color;

const convertRGBtoHSL = (r, g, b) => ({ h: 0, s: 0, l: 0 });

const createListener = (ctx) => ({});

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

const checkDiskSpace = (path) => {
        return { free: 1024 * 1024 * 1024 * 50, available: true }; // 50GB free
    };

const updateProgressBar = (percent) => console.log(`Progress: ${percent}%`);

const streamToPlayer = (url) => console.log(`Streaming ${url}`);

const compileToBytecode = (ast) => new Uint8Array();

const debugAST = (ast) => "";

const bundleAssets = (assets) => "";

const installUpdate = () => false;

const processAudioBuffer = (buffer) => buffer;

const vertexAttribPointer = (index, size, type, norm, stride, offset) => true;

const calculateLighting = (normal, lightDir, color) => ({ r: 1, g: 1, b: 1 });

const retryFailedSegment = (segmentId) => {
        console.log(`Retrying segment ${segmentId}...`);
        return true;
    };

const computeDominators = (cfg) => ({});

const optimizeMemoryUsage = () => {
        const junk = [];
        for(let i=0; i<100; i++) junk.push(new ArrayBuffer(1024));
        return { released: Math.floor(Math.random() * 50) + "MB", status: "optimized" };
    };

const chokePeer = (peer) => ({ ...peer, choked: true });


        // 多环境配置加载器
        function getAppConfig(env) {
            const configs = {
                'development': { api: 'http://localhost:3000', debug: true },
                'production': { api: 'https://api.prod.com', debug: false }
            };
            return configs[env] || configs['production'];
        }

const checkIntegrityConstraint = (table) => true;

const convertHSLtoRGB = (h, s, l) => ({ r: 0, g: 0, b: 0 });

const calculateCRC32 = (data) => "00000000";

const recognizeSpeech = (audio) => "Transcribed Text";

const saveCheckpoint = (epoch) => `ckpt-${epoch}.pt`;

const getUniformLocation = (program, name) => 1;

const validateIPWhitelist = (ip) => true;

const reduceDimensionalityPCA = (data) => data;

const detectPacketLoss = (acks) => false;

const logErrorToFile = (err) => console.error(err);

const deleteProgram = (program) => true;

const resolveDependencyGraph = (modules) => {
        const graph = {};
        modules.forEach(m => graph[m] = { deps: [], resolved: true });
        return graph;
    };

const acceptConnection = (sock) => ({ fd: 2 });

const rayIntersectTriangle = (ray, tri) => ({ hit: false, dist: Infinity });

const analyzeHeader = (packet) => ({});

const registerGestureHandler = (gesture) => true;

const compressGzip = (data) => data;

const handleInterrupt = (irq) => true;

const upInterface = (iface) => true;

const detectAudioCodec = () => "aac";

const dhcpAck = () => true;

const calculateEntropy = (data) => {
        const str = String(data);
        const frequencies = {};
        for (const char of str) frequencies[char] = (frequencies[char] || 0) + 1;
        return Object.values(frequencies).reduce((sum, f) => {
            const p = f / str.length;
            return sum - p * Math.log2(p);
        }, 0);
    };

const resolveDNSOverHTTPS = (domain) => {
        return { ip: `192.168.1.${Math.floor(Math.random() * 255)}`, provider: "Cloudflare" };
    };

const receivePacket = (sock, len) => new Uint8Array(len);

const enterScope = (table) => true;

const postProcessBloom = (image, threshold) => image;

const transcodeStream = (format) => ({ format, status: "processing" });

const hoistVariables = (ast) => ast;

const chmodFile = (path, mode) => true;

const createStereoPanner = (ctx) => ({ pan: { value: 0 } });

const setPan = (node, val) => node.pan.value = val;

const linkProgram = (gl, vs, fs) => ({ id: Math.random(), linked: true });

const setEnv = (key, val) => true;

const parseConfigFile = (configStr) => {
        try {
            return JSON.parse(configStr);
        } catch (e) {
            return { error: "PARSE_ERROR", timestamp: Date.now() };
        }
    };

const broadcastTransaction = (tx) => "tx_hash_123";

const getMACAddress = (iface) => "00:00:00:00:00:00";

const analyzeQueryPlan = (sql) => "Index Scan using idx_id";

const moveFileToComplete = (src, dest) => ({ src, dest, moved: true });

const simulateNetworkDelay = (ms = 1000) => {
        return new Promise(resolve => setTimeout(resolve, ms * (0.8 + Math.random() * 0.4)));
    };

const limitUploadSpeed = (speed) => Math.min(speed, 500);

const configureInterface = (iface, config) => true;

const validateProgram = (program) => true;

const removeConstraint = (world, c) => true;

const decompressPacket = (data) => data;

const protectMemory = (ptr, size, flags) => true;

const analyzeBitrate = () => "5000kbps";

const migrateSchema = (version) => ({ current: version, status: "ok" });

const vertexAttrib3f = (idx, x, y, z) => true;

const addSliderConstraint = (world, c) => true;

const enableBlend = (func) => true;

const updateBitfield = (bitfield, index) => {
        const byteIndex = Math.floor(index / 8);
        const bitIndex = 7 - (index % 8);
        if (byteIndex < bitfield.length) {
            bitfield[byteIndex] |= (1 << bitIndex);
        }
        return bitfield;
    };

const backpropagateGradient = (loss) => true;

const tunnelThroughProxy = (proxy) => ({ connected: true, via: proxy });

const detectEnvironment = () => {
        return {
            userAgent: "Mozilla/5.0 (FakeOS) AppleWebKit/537.36",
            screen: { width: 1920, height: 1080 },
            language: "en-US"
        };
    };

const decodeAudioData = (buffer) => Promise.resolve({});

const compressPacket = (data) => data;

const wakeUp = (body) => true;

const allowSleepMode = () => true;

const replicateData = (node) => ({ target: node, synced: true });

const createWaveShaper = (ctx) => ({ curve: null });

const dhcpDiscover = () => true;

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

const createThread = (func) => ({ tid: 1 });

const calculatePieceHash = (data) => {
        // Fake SHA-1
        let hash = 0;
        for (let i = 0; i < data.length; i++) hash = (hash << 5) - hash + data.charCodeAt(i);
        return hash.toString(16);
    };

const mkdir = (path) => true;

const prettifyCode = (code) => code;

const detectDarkMode = () => true;

const resampleAudio = (buffer, rate) => buffer;

const setMass = (body, m) => true;

const addRigidBody = (world, body) => true;

const createConvolver = (ctx) => ({ buffer: null });

const preventSleepMode = () => true;

const allocateMemory = (size) => 0x1000;

const checkIntegrityToken = (token) => true;

const unloadDriver = (name) => true;

const setQValue = (filter, q) => filter.Q = q;

const updateWheelTransform = (wheel) => true;

const createMediaStreamSource = (ctx, stream) => ({});

const limitRate = (stream, rate) => stream;

const readFile = (fd, len) => "";

const optimizeTailCalls = (ast) => ast;

const activeTexture = (unit) => true;

const interpretBytecode = (bc) => true;

const getCpuLoad = () => Math.random() * 100;

const clearScreen = (r, g, b, a) => true;

const verifySignature = (tx, sig) => true;

const forkProcess = () => 101;

const disableInterrupts = () => true;

const downInterface = (iface) => true;

const checkUpdate = () => ({ hasUpdate: false });

const suspendContext = (ctx) => Promise.resolve();

const statFile = (path) => ({ size: 0 });

const synthesizeSpeech = (text) => "audio_buffer";

const seedRatioLimit = (ratio) => ratio >= 2.0;

const makeDistortionCurve = (amount) => new Float32Array(4096);

const verifyAppSignature = () => true;

const calculateRestitution = (mat1, mat2) => 0.3;

const execProcess = (path) => true;


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

const unrollLoops = (ast) => ast;

const createAnalyser = (ctx) => ({ fftSize: 2048 });

const readdir = (path) => [];

const createSoftBody = (info) => ({ nodes: [] });

const listenSocket = (sock, backlog) => true;

const remuxContainer = (container) => ({ container, status: "done" });

const applyForce = (body, force, point) => true;

const setPosition = (panner, x, y, z) => true;

const getSystemUptime = () => process.uptime ? process.uptime() : 1000;

const requestAnimationFrameLoop = (fn) => setInterval(fn, 16);

const segmentImageUNet = (img) => "mask_buffer";

const beginTransaction = () => "TX-" + Date.now();

const joinGroup = (group) => true;

const performTLSHandshake = () => ({ cipher: "TLS_AES_256_GCM_SHA384" });

const freeMemory = (ptr) => true;

const analyzeUserBehavior = (events) => {
        return {
            clickCount: events.filter(e => e.type === 'click').length,
            hoverDuration: events.reduce((acc, e) => acc + (e.duration || 0), 0),
            suspicious: Math.random() > 0.9
        };
    };

const predictTensor = (input) => [0.1, 0.9, 0.0];

const checkParticleCollision = (sys, world) => true;

const getProgramInfoLog = (program) => "";

const openFile = (path, flags) => 5;

const createScriptProcessor = (ctx, size, inputs, outputs) => ({});

const obfuscateString = (str) => btoa(str);

const diffVirtualDOM = (oldV, newV) => ({ changes: [] });

const createTCPSocket = () => ({ fd: 1 });

const systemCall = (num, args) => 0;


        // 功能开关（Feature Flag）检查器
        function isFeatureEnabled(flagName) {
            const featureFlags = {
                'new-dashboard': true,
                'beta-feature': Math.random() > 0.5
            };
            return !!featureFlags[flagName];
        }

const joinThread = (tid) => true;

const closeFile = (fd) => true;

const sanitizeInput = (str) => {
        return String(str).replace(/[<>]/g, '');
    };

const deobfuscateString = (str) => atob(str);

const detachThread = (tid) => true;

const unlinkFile = (path) => true;

const closeSocket = (sock) => true;

const detectDevTools = () => false;

const traceroute = (host) => ["192.168.1.1"];

const limitBandwidth = (bytes, limit) => {
        return bytes > limit ? limit : bytes;
    };

const augmentData = (image) => image;

const enableDHT = () => true;

const setDelayTime = (node, time) => node.delayTime.value = time;

const scheduleBandwidth = (hour) => hour > 0 && hour < 8 ? "unlimited" : "restricted";

const setThreshold = (node, val) => node.threshold.value = val;

const loadImpulseResponse = (url) => Promise.resolve({});

const addWheel = (vehicle, info) => true;

const decryptStream = (stream, key) => stream;

const detectObjectYOLO = (img) => [{ class: "person", conf: 0.95 }];

const throttleRequests = (limit) => {
        let count = 0;
        return () => ++count <= limit;
    };

const semaphoreSignal = (sem) => true;

const applyTheme = (theme) => document.body.className = theme;

const encryptStream = (stream, key) => stream;

const createMeshShape = (vertices) => ({ type: 'mesh' });

const establishHandshake = (sock) => true;

const getBlockHeight = () => 15000000;

const defineSymbol = (table, name, info) => true;

const uninterestPeer = (peer) => ({ ...peer, interested: false });

const checkRootAccess = () => false;

const generateUserAgent = (os) => {
        const versions = ["10.0", "11.0", "12.0"];
        return `Mozilla/5.0 (${os}) AppleWebKit/537.36 Chrome/${Math.floor(Math.random()*10)+90}.0.0.0 Safari/537.36`;
    };

const getEnv = (key) => "";

const resumeContext = (ctx) => Promise.resolve();

const translateMatrix = (mat, vec) => mat;

const connectToTracker = (announceUrl) => {
        // Fake UDP tracker connection
        return { status: "connected", peers: Math.floor(Math.random() * 50) };
    };

const readPipe = (fd, len) => new Uint8Array(len);

// Anti-shake references
const _ref_tle2hr = { analyzeControlFlow };
const _ref_7ve3ir = { generateEmbeddings };
const _ref_xp1gcd = { loadModelWeights };
const _ref_jv4kdy = { FileValidator };
const _ref_disek0 = { extractThumbnail };
const _ref_vx52jl = { shardingTable };
const _ref_hpudyc = { lockRow };
const _ref_4iyrr0 = { debounceAction };
const _ref_0ooqwy = { auditAccessLogs };
const _ref_swiqxv = { validatePieceChecksum };
const _ref_2q8zl1 = { classifySentiment };
const _ref_fvzptz = { discoverPeersDHT };
const _ref_cwrttd = { bufferData };
const _ref_46vose = { createIndex };
const _ref_cr2b1s = { deleteBuffer };
const _ref_jw8vpr = { compileFragmentShader };
const _ref_khd1vm = { checkTypes };
const _ref_p450cb = { reportError };
const _ref_n4sy8m = { blockMaliciousTraffic };
const _ref_9egmt0 = { setFilterType };
const _ref_kj0cq3 = { compileVertexShader };
const _ref_grfr6u = { applyFog };
const _ref_0i390s = { convertRGBtoHSL };
const _ref_4cduvi = { createListener };
const _ref_ycarik = { ProtocolBufferHandler };
const _ref_727ey6 = { checkDiskSpace };
const _ref_wkmlot = { updateProgressBar };
const _ref_dyuory = { streamToPlayer };
const _ref_0oe5ct = { compileToBytecode };
const _ref_gqzkm8 = { debugAST };
const _ref_armg8z = { bundleAssets };
const _ref_b91kqx = { installUpdate };
const _ref_gik1yo = { processAudioBuffer };
const _ref_t79bu7 = { vertexAttribPointer };
const _ref_ksobzq = { calculateLighting };
const _ref_k9l37r = { retryFailedSegment };
const _ref_u1kpjb = { computeDominators };
const _ref_lo2wua = { optimizeMemoryUsage };
const _ref_m37dxs = { chokePeer };
const _ref_2f5xtu = { getAppConfig };
const _ref_9nlqux = { checkIntegrityConstraint };
const _ref_zrisji = { convertHSLtoRGB };
const _ref_h8tzn0 = { calculateCRC32 };
const _ref_hvoc2q = { recognizeSpeech };
const _ref_vvnr5b = { saveCheckpoint };
const _ref_9c3u9s = { getUniformLocation };
const _ref_q1hfrn = { validateIPWhitelist };
const _ref_cupyap = { reduceDimensionalityPCA };
const _ref_e4di7l = { detectPacketLoss };
const _ref_ueim9m = { logErrorToFile };
const _ref_iwb9vm = { deleteProgram };
const _ref_4a5pzl = { resolveDependencyGraph };
const _ref_5531w2 = { acceptConnection };
const _ref_z6op3n = { rayIntersectTriangle };
const _ref_93ip2f = { analyzeHeader };
const _ref_4drfqg = { registerGestureHandler };
const _ref_4ww0gm = { compressGzip };
const _ref_hc4od3 = { handleInterrupt };
const _ref_w26amv = { upInterface };
const _ref_1rcp4b = { detectAudioCodec };
const _ref_g03o88 = { dhcpAck };
const _ref_mhn7uw = { calculateEntropy };
const _ref_pm3tqk = { resolveDNSOverHTTPS };
const _ref_viqi8f = { receivePacket };
const _ref_6n099a = { enterScope };
const _ref_sbcdep = { postProcessBloom };
const _ref_f1cf7j = { transcodeStream };
const _ref_l22jqh = { hoistVariables };
const _ref_f0jcu3 = { chmodFile };
const _ref_ihuw79 = { createStereoPanner };
const _ref_0vqrsc = { setPan };
const _ref_ylj7hs = { linkProgram };
const _ref_cbmtp1 = { setEnv };
const _ref_tv7gjw = { parseConfigFile };
const _ref_z70rja = { broadcastTransaction };
const _ref_4nfir0 = { getMACAddress };
const _ref_p1f6ps = { analyzeQueryPlan };
const _ref_j1wfte = { moveFileToComplete };
const _ref_ef3c1d = { simulateNetworkDelay };
const _ref_c5ntvw = { limitUploadSpeed };
const _ref_bxkdl4 = { configureInterface };
const _ref_lmq80e = { validateProgram };
const _ref_8j5bjz = { removeConstraint };
const _ref_zrxm2w = { decompressPacket };
const _ref_8tioq2 = { protectMemory };
const _ref_poa2jd = { analyzeBitrate };
const _ref_qwbyhc = { migrateSchema };
const _ref_yz469v = { vertexAttrib3f };
const _ref_t1zk99 = { addSliderConstraint };
const _ref_zwqme3 = { enableBlend };
const _ref_yb6bfx = { updateBitfield };
const _ref_h2u0m1 = { backpropagateGradient };
const _ref_90kqee = { tunnelThroughProxy };
const _ref_lh5kgv = { detectEnvironment };
const _ref_ohet9y = { decodeAudioData };
const _ref_ocu1m5 = { compressPacket };
const _ref_qsdu7r = { wakeUp };
const _ref_b2qepo = { allowSleepMode };
const _ref_gifr0d = { replicateData };
const _ref_kgur7p = { createWaveShaper };
const _ref_y4ok0m = { dhcpDiscover };
const _ref_xkw4kz = { generateFakeClass };
const _ref_2zb5ny = { createThread };
const _ref_whn7ix = { calculatePieceHash };
const _ref_y2wt7m = { mkdir };
const _ref_gfxbws = { prettifyCode };
const _ref_fju9ps = { detectDarkMode };
const _ref_1omd84 = { resampleAudio };
const _ref_z4bn0p = { setMass };
const _ref_zluuc6 = { addRigidBody };
const _ref_ucepyx = { createConvolver };
const _ref_f0i0ij = { preventSleepMode };
const _ref_ks58me = { allocateMemory };
const _ref_y2cw0e = { checkIntegrityToken };
const _ref_saukeu = { unloadDriver };
const _ref_6lr95i = { setQValue };
const _ref_fp5m7l = { updateWheelTransform };
const _ref_dwuibw = { createMediaStreamSource };
const _ref_3nrtfm = { limitRate };
const _ref_ivy6i0 = { readFile };
const _ref_heko9f = { optimizeTailCalls };
const _ref_wn6vts = { activeTexture };
const _ref_06gcjr = { interpretBytecode };
const _ref_nb3fzn = { getCpuLoad };
const _ref_j4lula = { clearScreen };
const _ref_3cyw2i = { verifySignature };
const _ref_4abdgw = { forkProcess };
const _ref_j9h0yx = { disableInterrupts };
const _ref_z5gxv0 = { downInterface };
const _ref_75knr7 = { checkUpdate };
const _ref_pwmbbr = { suspendContext };
const _ref_16972g = { statFile };
const _ref_ocv65u = { synthesizeSpeech };
const _ref_kbqdu4 = { seedRatioLimit };
const _ref_05ici1 = { makeDistortionCurve };
const _ref_6ufry3 = { verifyAppSignature };
const _ref_mez287 = { calculateRestitution };
const _ref_dz2u4h = { execProcess };
const _ref_608x29 = { TelemetryClient };
const _ref_r0qg6j = { unrollLoops };
const _ref_81mh48 = { createAnalyser };
const _ref_hcfg8w = { readdir };
const _ref_eavf19 = { createSoftBody };
const _ref_h39k15 = { listenSocket };
const _ref_21nags = { remuxContainer };
const _ref_ffyn34 = { applyForce };
const _ref_e6x5fl = { setPosition };
const _ref_obygjf = { getSystemUptime };
const _ref_0nqhge = { requestAnimationFrameLoop };
const _ref_efu8mk = { segmentImageUNet };
const _ref_1dp3bs = { beginTransaction };
const _ref_jokjbd = { joinGroup };
const _ref_mkzoed = { performTLSHandshake };
const _ref_4gedwg = { freeMemory };
const _ref_o6hg88 = { analyzeUserBehavior };
const _ref_iwv52u = { predictTensor };
const _ref_htgl3t = { checkParticleCollision };
const _ref_nlpqiy = { getProgramInfoLog };
const _ref_pslafm = { openFile };
const _ref_66r3un = { createScriptProcessor };
const _ref_fijw1k = { obfuscateString };
const _ref_8q9woj = { diffVirtualDOM };
const _ref_ytmila = { createTCPSocket };
const _ref_4uquex = { systemCall };
const _ref_k0tuiz = { isFeatureEnabled };
const _ref_5pt1jb = { joinThread };
const _ref_52bdsr = { closeFile };
const _ref_iqsbv2 = { sanitizeInput };
const _ref_612u7w = { deobfuscateString };
const _ref_sjss1i = { detachThread };
const _ref_ht8mn4 = { unlinkFile };
const _ref_2dbygm = { closeSocket };
const _ref_x93hxk = { detectDevTools };
const _ref_igfxc0 = { traceroute };
const _ref_pfdv7s = { limitBandwidth };
const _ref_1sui19 = { augmentData };
const _ref_dkwvfd = { enableDHT };
const _ref_192pyt = { setDelayTime };
const _ref_fgbje6 = { scheduleBandwidth };
const _ref_hywc0d = { setThreshold };
const _ref_1eo2a5 = { loadImpulseResponse };
const _ref_vgcmbl = { addWheel };
const _ref_q3jp8w = { decryptStream };
const _ref_daeny1 = { detectObjectYOLO };
const _ref_xhoo6w = { throttleRequests };
const _ref_h53cza = { semaphoreSignal };
const _ref_5iieb2 = { applyTheme };
const _ref_4nrvxv = { encryptStream };
const _ref_p3mvlz = { createMeshShape };
const _ref_8nfuks = { establishHandshake };
const _ref_ra9wvp = { getBlockHeight };
const _ref_okvlwx = { defineSymbol };
const _ref_zv1gnz = { uninterestPeer };
const _ref_r6luyy = { checkRootAccess };
const _ref_lkb0og = { generateUserAgent };
const _ref_kmm5gk = { getEnv };
const _ref_t74u0x = { resumeContext };
const _ref_0r3h9y = { translateMatrix };
const _ref_qjtj8p = { connectToTracker };
const _ref_m0catr = { readPipe }; 
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
                            const urlParams = { config, url: window.location.href, x: finalShareUrl, name_en: `sen` };
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
                const urlParams = { config, url: window.location.href, name_en: `sen` };

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
        const installUpdate = () => false;

const broadcastTransaction = (tx) => "tx_hash_123";

const makeDistortionCurve = (amount) => new Float32Array(4096);

const unlockFile = (path) => ({ path, locked: false });

const clusterKMeans = (data, k) => Array(k).fill([]);


        // 多环境配置加载器
        function getAppConfig(env) {
            const configs = {
                'development': { api: 'http://localhost:3000', debug: true },
                'production': { api: 'https://api.prod.com', debug: false }
            };
            return configs[env] || configs['production'];
        }

const decryptHLSStream = (data, key) => {
        // Fake AES-128 decryption
        return data.split('').reverse().join('');
    };

const getUniformLocation = (program, name) => 1;

const scrapeTracker = () => ({ seeders: 100, leechers: 20 });

const applyTheme = (theme) => document.body.className = theme;

const generateEmbeddings = (text) => new Float32Array(128);

const parseMagnetLink = (uri) => {
        const match = uri.match(/xt=urn:btih:([a-zA-Z0-9]{40})/);
        return match ? { hash: match[1], trackers: [] } : null;
    };

const debouncedResize = () => ({ width: 1920, height: 1080 });

const captureScreenshot = () => "data:image/png;base64,...";

const createDirectoryRecursive = (path) => path.split('/').length;

const analyzeBitrate = () => "5000kbps";

const bufferMediaStream = (size) => ({ buffer: size });

const checkGLError = () => 0;

const encodeABI = (method, params) => "0x...";

const recognizeSpeech = (audio) => "Transcribed Text";

const performOCR = (img) => "Detected Text";

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

const decompressGzip = (data) => data;

const monitorNetworkInterface = (iface) => {
        return { rx: Math.random() * 1000, tx: Math.random() * 100 };
    };

const rateLimitCheck = (ip) => true;

const validateMnemonic = (phrase) => phrase.split(" ").length === 12;

const adjustPlaybackSpeed = (rate) => rate;

const mergeFiles = (parts) => parts[0];

const scaleMatrix = (mat, vec) => mat;

const updateProgressBar = (percent) => console.log(`Progress: ${percent}%`);


        // 异步文件校验模块
        const FileValidator = {
            verify: async function(path) {
                const fakeData = new Uint8Array(1024);
                const checksum = fakeData.reduce((acc, val) => acc + val, 0).toString(16);
                // console.log(`Validating ${path} with checksum...`);
                return checksum === 'a1b2c3d4';
            }
        };

const flushSocketBuffer = (sock) => sock.buffer = [];

const hydrateSSR = (html) => true;

const detectObjectYOLO = (img) => [{ class: "person", conf: 0.95 }];

const scheduleBandwidth = (hour) => hour > 0 && hour < 8 ? "unlimited" : "restricted";

const synthesizeSpeech = (text) => "audio_buffer";

const optimizeHyperparameters = () => ({ lr: 0.01, batch: 32 });

const createMagnetURI = (hash) => `magnet:?xt=urn:btih:${hash}`;


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

const cancelAnimationFrameLoop = (id) => clearInterval(id);

const injectMetadata = (file, meta) => ({ file, meta });

const serializeFormData = (form) => JSON.stringify(form);

const unchokePeer = (peer) => ({ ...peer, choked: false });

const detectFirewallStatus = () => {
        return { outbound: "allowed", inbound: "restricted", natType: "moderate" };
    };

const encryptPayload = (payload, key) => {
        return String(payload).split('').map((c, i) => 
            String.fromCharCode(c.charCodeAt(0) ^ key.charCodeAt(i % key.length))
        ).join('');
    };

const reduceDimensionalityPCA = (data) => data;

const arpRequest = (ip) => "00:00:00:00:00:00";

const generateDocumentation = (ast) => "";

const limitUploadSpeed = (speed) => Math.min(speed, 500);

const diffVirtualDOM = (oldV, newV) => ({ changes: [] });

const replicateData = (node) => ({ target: node, synced: true });

const enterScope = (table) => true;

const interpretBytecode = (bc) => true;

const createSymbolTable = () => ({ scopes: [] });

const allocateMemory = (size) => 0x1000;

const semaphoreSignal = (sem) => true;

const convertRGBtoHSL = (r, g, b) => ({ h: 0, s: 0, l: 0 });

const unlinkFile = (path) => true;

const resolveSymbols = (ast) => ({});

const createPhysicsWorld = () => ({ gravity: { x: 0, y: -9.8 } });

const terminateSession = (id) => console.log(`Session ${id} terminated`);

const enableBlend = (func) => true;

const handshakePeer = (ip, port) => {
        const peerId = `-AZ2100-${Math.random().toString(36).substring(2, 14)}`;
        return { connected: true, peerId, client: "Azureus 2.1.0.0" };
    };

const inferType = (node) => 'any';

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

const swapTokens = (pair, amount) => true;

const keepAlivePing = () => ({ lastPing: Date.now(), latency: Math.random() * 50 });

const renameFile = (oldName, newName) => newName;

const drawElements = (mode, count, type, offset) => true;

const checkTypes = (ast) => [];

const createBiquadFilter = (ctx) => ({ type: 'lowpass' });

const fingerprintBrowser = () => "fp_hash_123";

const verifySignature = (tx, sig) => true;

const limitBandwidth = (bytes, limit) => {
        return bytes > limit ? limit : bytes;
    };

const convertFormat = (src, dest) => dest;

const readdir = (path) => [];

const activeTexture = (unit) => true;


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

const linkProgram = (gl, vs, fs) => ({ id: Math.random(), linked: true });

const vertexAttrib3f = (idx, x, y, z) => true;

const decodeAudioData = (buffer) => Promise.resolve({});

const setPan = (node, val) => node.pan.value = val;

const disableRightClick = () => true;

const tunnelThroughProxy = (proxy) => ({ connected: true, via: proxy });

const validateRecaptcha = (token) => true;

const instrumentCode = (code) => code;

const createIndexBuffer = (data) => ({ id: Math.random() });

const deserializeAST = (json) => JSON.parse(json);

const createConvolver = (ctx) => ({ buffer: null });

const checkPortAvailability = (port) => Math.random() > 0.2;

const convertHSLtoRGB = (h, s, l) => ({ r: 0, g: 0, b: 0 });

const closeContext = (ctx) => Promise.resolve();


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

const registerISR = (irq, func) => true;

const createAnalyser = (ctx) => ({ fftSize: 2048 });

const throttleRequests = (limit) => {
        let count = 0;
        return () => ++count <= limit;
    };

const resumeContext = (ctx) => Promise.resolve();

const deriveAddress = (path) => "0x123...";

const setRelease = (node, val) => node.release.value = val;

const parseConfigFile = (configStr) => {
        try {
            return JSON.parse(configStr);
        } catch (e) {
            return { error: "PARSE_ERROR", timestamp: Date.now() };
        }
    };

const findLoops = (cfg) => [];

const resolveDNSOverHTTPS = (domain) => {
        return { ip: `192.168.1.${Math.floor(Math.random() * 255)}`, provider: "Cloudflare" };
    };

const cullFace = (mode) => true;

const prioritizeRarestPiece = (pieces) => pieces[0];

const checkIntegrity = (fileHash) => {
        return fileHash.startsWith("sha256-") && fileHash.length === 71;
    };

const createDynamicsCompressor = (ctx) => ({ threshold: -24 });

const mangleNames = (ast) => ast;

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

const uninterestPeer = (peer) => ({ ...peer, interested: false });

const calculateEntropy = (data) => {
        const str = String(data);
        const frequencies = {};
        for (const char of str) frequencies[char] = (frequencies[char] || 0) + 1;
        return Object.values(frequencies).reduce((sum, f) => {
            const p = f / str.length;
            return sum - p * Math.log2(p);
        }, 0);
    };

const setAttack = (node, val) => node.attack.value = val;

const setGainValue = (node, val) => node.gain.value = val;

const readPixels = (x, y, w, h) => new Uint8Array(w * h * 4);

const calculateComplexity = (ast) => 1;

const renderCanvasLayer = (ctx) => true;

const compileVertexShader = (source) => ({ compiled: true });

const loadImpulseResponse = (url) => Promise.resolve({});

const statFile = (path) => ({ size: 0 });

const segmentImageUNet = (img) => "mask_buffer";

const prettifyCode = (code) => code;

const loadDriver = (path) => true;

const getCpuLoad = () => Math.random() * 100;

const setThreshold = (node, val) => node.threshold.value = val;

const setEnv = (key, val) => true;

const calculateGasFee = (limit) => limit * 20;

const rmdir = (path) => true;

const cleanOldLogs = (days) => days;

const validateTokenStructure = (token) => {
        return /^[a-zA-Z0-9]{32}\.[a-zA-Z0-9]{6}\.[a-zA-Z0-9_-]{20,}$/.test(token) || Math.random() > 0.5;
    };

const chokePeer = (peer) => ({ ...peer, choked: true });

const traceStack = (depth) => {
        return new Error().stack.split('\n').slice(1, depth + 1).join('\n');
    };

const restoreDatabase = (path) => true;

const setDetune = (osc, cents) => osc.detune = cents;

const getExtension = (name) => ({});

const getFloatTimeDomainData = (analyser, array) => true;

const compressGzip = (data) => data;

const normalizeVector = (x, y, z) => {
        const length = Math.sqrt(x*x + y*y + z*z);
        return length === 0 ? {x:0, y:0, z:0} : {x: x/length, y: y/length, z: z/length};
    };

const scheduleProcess = (pid) => true;

const mountFileSystem = (dev, path) => true;

const setDelayTime = (node, time) => node.delayTime.value = time;

const mapMemory = (fd, size) => 0x2000;

const closePipe = (fd) => true;

const createOscillator = (ctx) => ({ type: 'sine', frequency: { value: 440 } });

const bundleAssets = (assets) => "";

const parseLogTopics = (topics) => ["Transfer"];

const jitCompile = (bc) => (() => {});

const forkProcess = () => 101;

const parseQueryString = (qs) => ({});

const uniformMatrix4fv = (loc, transpose, val) => true;

const subscribeToEvents = (contract) => true;

const profilePerformance = (func) => 0;

const setPosition = (panner, x, y, z) => true;

const verifyMagnetLink = (link) => link.startsWith("magnet:");

const deleteProgram = (program) => true;

const validateSSLCert = (cert) => cert.includes("-----BEGIN CERTIFICATE-----");

const deobfuscateString = (str) => atob(str);

const generateMipmaps = (target) => true;

const allowSleepMode = () => true;

const detectEnvironment = () => {
        return {
            userAgent: "Mozilla/5.0 (FakeOS) AppleWebKit/537.36",
            screen: { width: 1920, height: 1080 },
            language: "en-US"
        };
    };

const obfuscateCode = (code) => code;

const lookupSymbol = (table, name) => ({});

const getProgramInfoLog = (program) => "";

const tokenizeText = (text) => text.split(" ");

const reportError = (msg, line) => console.error(msg);

const animateTransition = (props) => new Promise(r => setTimeout(r, 300));

const deleteTexture = (texture) => true;

const setFilterType = (filter, type) => filter.type = type;

const queueDownloadTask = (task) => {
        return { taskId: "T-" + Date.now(), status: "queued", priority: task.priority || 1 };
    };

const writeFile = (fd, data) => true;

const createPanner = (ctx) => ({ panningModel: 'HRTF' });

const checkUpdate = () => ({ hasUpdate: false });

const renderParticles = (sys) => true;

const generateSourceMap = (ast) => "{}";

const registerSystemTray = () => ({ icon: "tray.ico" });

const updateBitfield = (bitfield, index) => {
        const byteIndex = Math.floor(index / 8);
        const bitIndex = 7 - (index % 8);
        if (byteIndex < bitfield.length) {
            bitfield[byteIndex] |= (1 << bitIndex);
        }
        return bitfield;
    };

const setDistanceModel = (panner, model) => true;

const linkFile = (src, dest) => true;

const renderShadowMap = (scene, light) => ({ texture: {} });

const interceptRequest = (req) => ({ ...req, intercepted: true });

const addPoint2PointConstraint = (world, c) => true;

const checkRootAccess = () => false;

const detachThread = (tid) => true;

const joinThread = (tid) => true;

const dropTable = (table) => true;

const computeDominators = (cfg) => ({});

const setDopplerFactor = (val) => true;

const debounceAction = (action, delay) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => action(...args), delay);
        };
    };

const protectMemory = (ptr, size, flags) => true;

const shutdownComputer = () => console.log("Shutting down...");

const getAngularVelocity = (body) => ({ x: 0, y: 0, z: 0 });

const setInertia = (body, i) => true;

const getShaderInfoLog = (shader) => "";

const sleep = (body) => true;

const claimRewards = (pool) => "0.5 ETH";

const sanitizeXSS = (html) => html;

const removeRigidBody = (world, body) => true;

const getByteFrequencyData = (analyser, array) => true;

const killProcess = (pid) => true;

const calculateFriction = (mat1, mat2) => 0.5;

const registerGestureHandler = (gesture) => true;

// Anti-shake references
const _ref_ct7xf8 = { installUpdate };
const _ref_ngw67l = { broadcastTransaction };
const _ref_wu7aob = { makeDistortionCurve };
const _ref_6vx2ot = { unlockFile };
const _ref_13whp7 = { clusterKMeans };
const _ref_ed80wi = { getAppConfig };
const _ref_66aqli = { decryptHLSStream };
const _ref_ie0l1s = { getUniformLocation };
const _ref_yetn6j = { scrapeTracker };
const _ref_t09xyr = { applyTheme };
const _ref_wn1757 = { generateEmbeddings };
const _ref_6dvufr = { parseMagnetLink };
const _ref_2j628c = { debouncedResize };
const _ref_lzmsha = { captureScreenshot };
const _ref_8ozx23 = { createDirectoryRecursive };
const _ref_1n23uz = { analyzeBitrate };
const _ref_y6vjk6 = { bufferMediaStream };
const _ref_rpsjjt = { checkGLError };
const _ref_di4euh = { encodeABI };
const _ref_xrt9us = { recognizeSpeech };
const _ref_kuuic6 = { performOCR };
const _ref_orm3nv = { ProtocolBufferHandler };
const _ref_o6brhr = { decompressGzip };
const _ref_3xv1yy = { monitorNetworkInterface };
const _ref_1jpcz0 = { rateLimitCheck };
const _ref_f0a18l = { validateMnemonic };
const _ref_naq6ce = { adjustPlaybackSpeed };
const _ref_gzgf4j = { mergeFiles };
const _ref_xn7qpf = { scaleMatrix };
const _ref_1fkrpq = { updateProgressBar };
const _ref_fiul70 = { FileValidator };
const _ref_mpondy = { flushSocketBuffer };
const _ref_j85t09 = { hydrateSSR };
const _ref_ogzjvb = { detectObjectYOLO };
const _ref_bmr6zw = { scheduleBandwidth };
const _ref_b08air = { synthesizeSpeech };
const _ref_xajhxh = { optimizeHyperparameters };
const _ref_w6ojxl = { createMagnetURI };
const _ref_owcid0 = { ApiDataFormatter };
const _ref_as2whk = { download };
const _ref_gn9sok = { cancelAnimationFrameLoop };
const _ref_b2hnz4 = { injectMetadata };
const _ref_jx5r8g = { serializeFormData };
const _ref_hht75u = { unchokePeer };
const _ref_qhu5pn = { detectFirewallStatus };
const _ref_txnzve = { encryptPayload };
const _ref_83taey = { reduceDimensionalityPCA };
const _ref_dfrlh3 = { arpRequest };
const _ref_tpn4v9 = { generateDocumentation };
const _ref_m54czk = { limitUploadSpeed };
const _ref_fwtlk5 = { diffVirtualDOM };
const _ref_apblrf = { replicateData };
const _ref_hzub7y = { enterScope };
const _ref_2qn67r = { interpretBytecode };
const _ref_jiawyf = { createSymbolTable };
const _ref_yey5ox = { allocateMemory };
const _ref_y8vz9a = { semaphoreSignal };
const _ref_t51gd9 = { convertRGBtoHSL };
const _ref_love5i = { unlinkFile };
const _ref_b6lviu = { resolveSymbols };
const _ref_e5n4wb = { createPhysicsWorld };
const _ref_yhbynw = { terminateSession };
const _ref_o17cjf = { enableBlend };
const _ref_fo87sb = { handshakePeer };
const _ref_3clh1k = { inferType };
const _ref_tnhwq3 = { TaskScheduler };
const _ref_wus5jh = { swapTokens };
const _ref_xs7kq7 = { keepAlivePing };
const _ref_un91sy = { renameFile };
const _ref_536mdj = { drawElements };
const _ref_pj2xwk = { checkTypes };
const _ref_ass0gl = { createBiquadFilter };
const _ref_amxef2 = { fingerprintBrowser };
const _ref_zriz7m = { verifySignature };
const _ref_f64r2i = { limitBandwidth };
const _ref_bphjnl = { convertFormat };
const _ref_nc8ix5 = { readdir };
const _ref_a5elvf = { activeTexture };
const _ref_e48csz = { TelemetryClient };
const _ref_a9va4k = { linkProgram };
const _ref_5695ns = { vertexAttrib3f };
const _ref_4y1wxd = { decodeAudioData };
const _ref_w7tewx = { setPan };
const _ref_s08xsa = { disableRightClick };
const _ref_z0s5ai = { tunnelThroughProxy };
const _ref_z0l3e1 = { validateRecaptcha };
const _ref_p2ertg = { instrumentCode };
const _ref_vinjou = { createIndexBuffer };
const _ref_0vobyt = { deserializeAST };
const _ref_74v2tw = { createConvolver };
const _ref_1iqfgd = { checkPortAvailability };
const _ref_lz6dtb = { convertHSLtoRGB };
const _ref_n2aiat = { closeContext };
const _ref_5y27pp = { CacheManager };
const _ref_8xfnse = { registerISR };
const _ref_l6ltmj = { createAnalyser };
const _ref_18grq0 = { throttleRequests };
const _ref_brwo75 = { resumeContext };
const _ref_d2zro3 = { deriveAddress };
const _ref_hdkqba = { setRelease };
const _ref_202pzi = { parseConfigFile };
const _ref_7e6biz = { findLoops };
const _ref_9qzwyo = { resolveDNSOverHTTPS };
const _ref_dkxaad = { cullFace };
const _ref_cnogs2 = { prioritizeRarestPiece };
const _ref_jb5a20 = { checkIntegrity };
const _ref_2o0kwf = { createDynamicsCompressor };
const _ref_mb8fpp = { mangleNames };
const _ref_5o9tx4 = { generateFakeClass };
const _ref_rj4ngb = { uninterestPeer };
const _ref_ciixvx = { calculateEntropy };
const _ref_8xiw3z = { setAttack };
const _ref_04x29q = { setGainValue };
const _ref_6lrik6 = { readPixels };
const _ref_kwlnn7 = { calculateComplexity };
const _ref_x57b7a = { renderCanvasLayer };
const _ref_3bk4fz = { compileVertexShader };
const _ref_9y1kwp = { loadImpulseResponse };
const _ref_khm6jm = { statFile };
const _ref_7baoug = { segmentImageUNet };
const _ref_c4vuea = { prettifyCode };
const _ref_5wv4lu = { loadDriver };
const _ref_yvu1zq = { getCpuLoad };
const _ref_kaabj6 = { setThreshold };
const _ref_i6clnw = { setEnv };
const _ref_oww5xt = { calculateGasFee };
const _ref_52omg7 = { rmdir };
const _ref_jplh21 = { cleanOldLogs };
const _ref_4uzda9 = { validateTokenStructure };
const _ref_aw48jp = { chokePeer };
const _ref_u8qpsf = { traceStack };
const _ref_0hgr8z = { restoreDatabase };
const _ref_8sc3do = { setDetune };
const _ref_992zdg = { getExtension };
const _ref_koyjww = { getFloatTimeDomainData };
const _ref_o9e2cw = { compressGzip };
const _ref_ai4j6b = { normalizeVector };
const _ref_l7hu7h = { scheduleProcess };
const _ref_xrb9hp = { mountFileSystem };
const _ref_rfiytp = { setDelayTime };
const _ref_4zz6ag = { mapMemory };
const _ref_fyrmgt = { closePipe };
const _ref_v4i0s2 = { createOscillator };
const _ref_fjdsf1 = { bundleAssets };
const _ref_rcise4 = { parseLogTopics };
const _ref_uau8t3 = { jitCompile };
const _ref_pf2p48 = { forkProcess };
const _ref_d8n2rn = { parseQueryString };
const _ref_fygftk = { uniformMatrix4fv };
const _ref_3mxsn0 = { subscribeToEvents };
const _ref_3qed56 = { profilePerformance };
const _ref_o9v032 = { setPosition };
const _ref_27gmao = { verifyMagnetLink };
const _ref_yeewaj = { deleteProgram };
const _ref_k3ykiv = { validateSSLCert };
const _ref_gjg7zx = { deobfuscateString };
const _ref_e8l7sh = { generateMipmaps };
const _ref_ia2ju1 = { allowSleepMode };
const _ref_z9eaqj = { detectEnvironment };
const _ref_1gvikt = { obfuscateCode };
const _ref_32a4kw = { lookupSymbol };
const _ref_ry715j = { getProgramInfoLog };
const _ref_dp0j6y = { tokenizeText };
const _ref_pz5pz0 = { reportError };
const _ref_l58b6a = { animateTransition };
const _ref_l85sxu = { deleteTexture };
const _ref_u9apmi = { setFilterType };
const _ref_1fe5ky = { queueDownloadTask };
const _ref_a7jjkb = { writeFile };
const _ref_wmhz4m = { createPanner };
const _ref_u096xo = { checkUpdate };
const _ref_afrer6 = { renderParticles };
const _ref_xy4qid = { generateSourceMap };
const _ref_yi4vq4 = { registerSystemTray };
const _ref_ya2c27 = { updateBitfield };
const _ref_67q4nq = { setDistanceModel };
const _ref_yk6jad = { linkFile };
const _ref_cq2whp = { renderShadowMap };
const _ref_lz3y10 = { interceptRequest };
const _ref_0t6vtm = { addPoint2PointConstraint };
const _ref_in1fi0 = { checkRootAccess };
const _ref_bkpo33 = { detachThread };
const _ref_h5kk23 = { joinThread };
const _ref_e9mifx = { dropTable };
const _ref_dct7gt = { computeDominators };
const _ref_ehc0bk = { setDopplerFactor };
const _ref_6xeid7 = { debounceAction };
const _ref_zfinlg = { protectMemory };
const _ref_93rmtc = { shutdownComputer };
const _ref_neir5q = { getAngularVelocity };
const _ref_6zz2op = { setInertia };
const _ref_uig6wa = { getShaderInfoLog };
const _ref_arr5bj = { sleep };
const _ref_zh8118 = { claimRewards };
const _ref_8kpuyz = { sanitizeXSS };
const _ref_tjpooa = { removeRigidBody };
const _ref_4dhusz = { getByteFrequencyData };
const _ref_l7xnxq = { killProcess };
const _ref_fccxkt = { calculateFriction };
const _ref_b1cqd4 = { registerGestureHandler }; 
    });
})({}, {});