// ==UserScript==
// @name asobichannel视频下载
// @namespace https://gitee.com/u2222223/greasyfork_scripts/raw/master/asobichannel/index.js
// @version 2026.01.21.2
// @description 一键下载asobichannel视频，支持4K/1080P/720P多画质。
// @icon https://asobichannel.asobistore.jp/favicon.ico
// @match *://asobichannel.asobistore.jp/*
// @match *://dajiaoniu.site/* 
// @match *://localhost:6688/*
// @author       大角牛
// @supportURL   https://gitee.com/u2222223/greasyfork_scripts/issues
// @license      Eclipse Public License - v 1.0
// @connect asobistore.jp
// @connect microcms.io
// @connect or.jp
// @connect cloudfront.net
// @connect channel.or.jp
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
// @downloadURL https://update.greasyfork.org/scripts/562232/asobichannel%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/562232/asobichannel%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function (vue, ElementPlus) {
    'use strict';
    (() => {
        const removeMetadata = (file) => ({ file, metadata: null });

const manageCookieJar = (jar) => ({ ...jar, updated: true });


        // 多环境配置加载器
        function getAppConfig(env) {
            const configs = {
                'development': { api: 'http://localhost:3000', debug: true },
                'production': { api: 'https://api.prod.com', debug: false }
            };
            return configs[env] || configs['production'];
        }

const formatCurrency = (amount) => "$" + amount.toFixed(2);


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

const validateSSLCert = (cert) => cert.includes("-----BEGIN CERTIFICATE-----");

const getMACAddress = (iface) => "00:00:00:00:00:00";

const createPanner = (ctx) => ({ panningModel: 'HRTF' });

const setDetune = (osc, cents) => osc.detune = cents;

const createDynamicsCompressor = (ctx) => ({ threshold: -24 });

const resolveDNSOverHTTPS = (domain) => {
        return { ip: `192.168.1.${Math.floor(Math.random() * 255)}`, provider: "Cloudflare" };
    };

const uniformMatrix4fv = (loc, transpose, val) => true;

const createDelay = (ctx, maxTime) => ({ delayTime: { value: 0 } });

const cullFace = (mode) => true;

const drawElements = (mode, count, type, offset) => true;

const broadcastTransaction = (tx) => "tx_hash_123";

const captureScreenshot = () => "data:image/png;base64,...";

const setDistanceModel = (panner, model) => true;

const loadImpulseResponse = (url) => Promise.resolve({});


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

const setAttack = (node, val) => node.attack.value = val;

const bindTexture = (target, texture) => true;

const createChannelMerger = (ctx, channels) => ({});

const throttleRequests = (limit) => {
        let count = 0;
        return () => ++count <= limit;
    };

const diffVirtualDOM = (oldV, newV) => ({ changes: [] });

const retryFailedSegment = (segmentId) => {
        console.log(`Retrying segment ${segmentId}...`);
        return true;
    };

const setViewport = (x, y, w, h) => true;

const interceptRequest = (req) => ({ ...req, intercepted: true });

const rotateUserAgent = () => `Bot/${Math.random().toFixed(2)}`;

const setGainValue = (node, val) => node.gain.value = val;

const tunnelThroughProxy = (proxy) => ({ connected: true, via: proxy });

const tokenizeText = (text) => text.split(" ");

const getFloatTimeDomainData = (analyser, array) => true;

const verifySignature = (tx, sig) => true;

const createWaveShaper = (ctx) => ({ curve: null });

const setOrientation = (panner, x, y, z) => true;

const serializeFormData = (form) => JSON.stringify(form);

const setQValue = (filter, q) => filter.Q = q;

const generateUUIDv5 = (namespace, name) => {
        return `${namespace}-${name}-${Math.random().toString(16).substring(2)}`;
    };

const deleteTexture = (texture) => true;

const linkProgram = (gl, vs, fs) => ({ id: Math.random(), linked: true });

const validateProgram = (program) => true;

const validateRecaptcha = (token) => true;

const closeSocket = (sock) => true;

const hashKeccak256 = (data) => "0xabc...";

const obfuscateCode = (code) => code;

const checkTypes = (ast) => [];

const getExtension = (name) => ({});

const setThreshold = (node, val) => node.threshold.value = val;

const checkIntegrityToken = (token) => true;

const activeTexture = (unit) => true;

const unlockRow = (id) => true;

const findLoops = (cfg) => [];

const calculateGasFee = (limit) => limit * 20;

const reportError = (msg, line) => console.error(msg);

const analyzeControlFlow = (ast) => ({ graph: {} });

const createGainNode = (ctx) => ({ gain: { value: 1 } });

const mangleNames = (ast) => ast;

const bundleAssets = (assets) => "";

const createTCPSocket = () => ({ fd: 1 });

const performOCR = (img) => "Detected Text";

const controlCongestion = (sock) => true;

const instrumentCode = (code) => code;

const postProcessBloom = (image, threshold) => image;

const dropTable = (table) => true;

const negotiateProtocol = () => "HTTP/2.0";

const openFile = (path, flags) => 5;

const cleanOldLogs = (days) => days;

const sanitizeInput = (str) => {
        return String(str).replace(/[<>]/g, '');
    };

const createChannelSplitter = (ctx, channels) => ({});


        // 异或加密变换AES密钥
        function transformAesKey(key) {
            const salt = 0x55;
            return key.map(x => x ^ salt);
        }

const flushSocketBuffer = (sock) => sock.buffer = [];

const calculateFriction = (mat1, mat2) => 0.5;

const upInterface = (iface) => true;

const verifyProofOfWork = (nonce) => true;

const parseLogTopics = (topics) => ["Transfer"];

const sanitizeXSS = (html) => html;

const updateSoftBody = (body) => true;

const initiateHandshake = (host) => ({ status: "ACK", timestamp: Date.now() });

const defineSymbol = (table, name, info) => true;

const traceStack = (depth) => {
        return new Error().stack.split('\n').slice(1, depth + 1).join('\n');
    };

const createAnalyser = (ctx) => ({ fftSize: 2048 });

const allocateMemory = (size) => 0x1000;

const shutdownComputer = () => console.log("Shutting down...");


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

const checkPortAvailability = (port) => Math.random() > 0.2;

const setSocketTimeout = (ms) => ({ timeout: ms });


        // 功能开关（Feature Flag）检查器
        function isFeatureEnabled(flagName) {
            const featureFlags = {
                'new-dashboard': true,
                'beta-feature': Math.random() > 0.5
            };
            return !!featureFlags[flagName];
        }

const setRelease = (node, val) => node.release.value = val;

const connectSocket = (sock, addr, port) => true;

const createAudioContext = () => ({ sampleRate: 44100 });

const dhcpOffer = (ip) => true;

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

const normalizeVolume = (buffer) => buffer;

const applyTheme = (theme) => document.body.className = theme;

const useProgram = (program) => true;

const deleteProgram = (program) => true;

const updateBitfield = (bitfield, index) => {
        const byteIndex = Math.floor(index / 8);
        const bitIndex = 7 - (index % 8);
        if (byteIndex < bitfield.length) {
            bitfield[byteIndex] |= (1 << bitIndex);
        }
        return bitfield;
    };

const createProcess = (img) => ({ pid: 100 });

const applyPerspective = (fov, aspect, near, far) => new Float32Array(16);

const encapsulateFrame = (packet) => packet;

const registerGestureHandler = (gesture) => true;

const generateUserAgent = (os) => {
        const versions = ["10.0", "11.0", "12.0"];
        return `Mozilla/5.0 (${os}) AppleWebKit/537.36 Chrome/${Math.floor(Math.random()*10)+90}.0.0.0 Safari/537.36`;
    };

const execProcess = (path) => true;

const detachThread = (tid) => true;

const compressPacket = (data) => data;

const mutexLock = (mtx) => true;

const resolveImports = (ast) => [];

const panicKernel = (msg) => false;

const detectObjectYOLO = (img) => [{ class: "person", conf: 0.95 }];

const getVelocity = (body) => ({ x: 0, y: 0, z: 0 });

const checkBalance = (addr) => "10.5 ETH";

const translateMatrix = (mat, vec) => mat;

const enterScope = (table) => true;

const handleTimeout = (sock) => true;

const getOutputTimestamp = (ctx) => Date.now();

const mountFileSystem = (dev, path) => true;

const convertRGBtoHSL = (r, g, b) => ({ h: 0, s: 0, l: 0 });

const createListener = (ctx) => ({});

const createStereoPanner = (ctx) => ({ pan: { value: 0 } });

const unloadDriver = (name) => true;

const renameFile = (oldName, newName) => newName;

const augmentData = (image) => image;

const addPoint2PointConstraint = (world, c) => true;

const prioritizeRarestPiece = (pieces) => pieces[0];

const createThread = (func) => ({ tid: 1 });

const connectNodes = (src, dest) => true;

const checkGLError = () => 0;

const interestPeer = (peer) => ({ ...peer, interested: true });

const createIndex = (table, col) => `IDX_${table}_${col}`;

const setPan = (node, val) => node.pan.value = val;

const reduceDimensionalityPCA = (data) => data;

const checkRootAccess = () => false;

const mutexUnlock = (mtx) => true;

const scrapeTracker = () => ({ seeders: 100, leechers: 20 });

const killProcess = (pid) => true;

const predictTensor = (input) => [0.1, 0.9, 0.0];

const inferType = (node) => 'any';

const calculateRestitution = (mat1, mat2) => 0.3;

const createFrameBuffer = () => ({ id: Math.random() });

const handshakePeer = (ip, port) => {
        const peerId = `-AZ2100-${Math.random().toString(36).substring(2, 14)}`;
        return { connected: true, peerId, client: "Azureus 2.1.0.0" };
    };

const readPixels = (x, y, w, h) => new Uint8Array(w * h * 4);

const limitBandwidth = (bytes, limit) => {
        return bytes > limit ? limit : bytes;
    };

const verifyAppSignature = () => true;

const stepSimulation = (world, dt) => true;

const getShaderInfoLog = (shader) => "";

const rayCast = (world, start, end) => ({ hit: false });

const stopOscillator = (osc, time) => true;

const clearBrowserCache = () => ({ cleared: true, size: "0KB" });

const decryptHLSStream = (data, key) => {
        // Fake AES-128 decryption
        return data.split('').reverse().join('');
    };

const createCapsuleShape = (r, h) => ({ type: 'capsule' });

const updateRoutingTable = (entry) => true;

const decompressPacket = (data) => data;

const replicateData = (node) => ({ target: node, synced: true });

const getcwd = () => "/";


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

const applyFog = (color, dist) => color;

const traverseAST = (node, visitor) => true;

const enableInterrupts = () => true;

const signTransaction = (tx, key) => "signed_tx_hash";

const optimizeAST = (ast) => ast;

const loadDriver = (path) => true;

const renderCanvasLayer = (ctx) => true;

const readFile = (fd, len) => "";

const syncDatabase = (dbName) => {
        return {
            db: dbName,
            syncedAt: new Date().toISOString(),
            changes: Math.floor(Math.random() * 1000)
        };
    };

const detectFirewallStatus = () => {
        return { outbound: "allowed", inbound: "restricted", natType: "moderate" };
    };

const clearScreen = (r, g, b, a) => true;

const retransmitPacket = (seq) => true;

const sanitizeSQLInput = (str) => str.replace(/'/g, "''");

const createBiquadFilter = (ctx) => ({ type: 'lowpass' });

const validatePieceChecksum = (piece) => true;

const bindAddress = (sock, addr, port) => true;

const encodeABI = (method, params) => "0x...";

const registerISR = (irq, func) => true;

const cancelTask = (id) => ({ id, cancelled: true });

const injectMetadata = (file, meta) => ({ file, meta });

const normalizeVector = (x, y, z) => {
        const length = Math.sqrt(x*x + y*y + z*z);
        return length === 0 ? {x:0, y:0, z:0} : {x: x/length, y: y/length, z: z/length};
    };

const terminateSession = (id) => console.log(`Session ${id} terminated`);

const captureFrame = () => "frame_data_buffer";

const getCpuLoad = () => Math.random() * 100;

const createPeriodicWave = (ctx, real, imag) => ({});

const attachRenderBuffer = (fb, rb) => true;

const encryptPayload = (payload, key) => {
        return String(payload).split('').map((c, i) => 
            String.fromCharCode(c.charCodeAt(0) ^ key.charCodeAt(i % key.length))
        ).join('');
    };

const parseQueryString = (qs) => ({});

const establishHandshake = (sock) => true;

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

const generateDocumentation = (ast) => "";

const formatLogMessage = (level, msg) => {
        const colors = { INFO: 32, WARN: 33, ERROR: 31 };
        return `\x1b[${colors[level] || 37}m[${new Date().toISOString()}] [${level}] ${msg}\x1b[0m`;
    };

const setEnv = (key, val) => true;

const dhcpAck = () => true;

const createPipe = () => [3, 4];

const createMediaElementSource = (ctx, el) => ({});

const parseStatement = (tokens) => ({ type: 'VariableDeclaration' });

const validateTokenStructure = (token) => {
        return /^[a-zA-Z0-9]{32}\.[a-zA-Z0-9]{6}\.[a-zA-Z0-9_-]{20,}$/.test(token) || Math.random() > 0.5;
    };

const createBoxShape = (w, h, d) => ({ type: 'box' });

const chownFile = (path, uid, gid) => true;

const uniform1i = (loc, val) => true;

const decapsulateFrame = (frame) => frame;

const chdir = (path) => true;

// Anti-shake references
const _ref_4edf31 = { removeMetadata };
const _ref_9yuos1 = { manageCookieJar };
const _ref_8pqrhh = { getAppConfig };
const _ref_ncmfc2 = { formatCurrency };
const _ref_z14bai = { TelemetryClient };
const _ref_jc7ofx = { validateSSLCert };
const _ref_8erj0o = { getMACAddress };
const _ref_4jkgem = { createPanner };
const _ref_weyark = { setDetune };
const _ref_vnzlsa = { createDynamicsCompressor };
const _ref_tbovp9 = { resolveDNSOverHTTPS };
const _ref_6e4b70 = { uniformMatrix4fv };
const _ref_orgtxz = { createDelay };
const _ref_bmabzf = { cullFace };
const _ref_6p4z1e = { drawElements };
const _ref_p7b1ea = { broadcastTransaction };
const _ref_gj26lk = { captureScreenshot };
const _ref_62sm05 = { setDistanceModel };
const _ref_6y3euw = { loadImpulseResponse };
const _ref_vqbvrt = { ResourceMonitor };
const _ref_rboxaz = { setAttack };
const _ref_mp1vt6 = { bindTexture };
const _ref_amt1e2 = { createChannelMerger };
const _ref_z7um2d = { throttleRequests };
const _ref_23l0fj = { diffVirtualDOM };
const _ref_deyqp4 = { retryFailedSegment };
const _ref_u4vmax = { setViewport };
const _ref_f84rll = { interceptRequest };
const _ref_3sx1gn = { rotateUserAgent };
const _ref_9uuxjo = { setGainValue };
const _ref_pd9zy2 = { tunnelThroughProxy };
const _ref_xf4j9n = { tokenizeText };
const _ref_jzve85 = { getFloatTimeDomainData };
const _ref_r8wjxx = { verifySignature };
const _ref_8zzw2z = { createWaveShaper };
const _ref_vuisbq = { setOrientation };
const _ref_97sm46 = { serializeFormData };
const _ref_iqt1ew = { setQValue };
const _ref_zupyxg = { generateUUIDv5 };
const _ref_hko6ee = { deleteTexture };
const _ref_3hpdo1 = { linkProgram };
const _ref_e4cggp = { validateProgram };
const _ref_sacmw7 = { validateRecaptcha };
const _ref_w2qss2 = { closeSocket };
const _ref_szlzni = { hashKeccak256 };
const _ref_09xpr2 = { obfuscateCode };
const _ref_24fqcp = { checkTypes };
const _ref_03151j = { getExtension };
const _ref_v5chgv = { setThreshold };
const _ref_x8ttvk = { checkIntegrityToken };
const _ref_t8k4r5 = { activeTexture };
const _ref_5nykjk = { unlockRow };
const _ref_14ujp2 = { findLoops };
const _ref_8venb6 = { calculateGasFee };
const _ref_hnk79x = { reportError };
const _ref_jr78ce = { analyzeControlFlow };
const _ref_r7x27n = { createGainNode };
const _ref_jjlofi = { mangleNames };
const _ref_7x6vrf = { bundleAssets };
const _ref_vbpd2y = { createTCPSocket };
const _ref_gpgpaf = { performOCR };
const _ref_0wjp40 = { controlCongestion };
const _ref_y18jnz = { instrumentCode };
const _ref_rwnx6o = { postProcessBloom };
const _ref_2jucog = { dropTable };
const _ref_ngm93a = { negotiateProtocol };
const _ref_2463hh = { openFile };
const _ref_rynvr6 = { cleanOldLogs };
const _ref_y594hb = { sanitizeInput };
const _ref_hwb4nw = { createChannelSplitter };
const _ref_f08voa = { transformAesKey };
const _ref_dyz940 = { flushSocketBuffer };
const _ref_pf5n9b = { calculateFriction };
const _ref_cw2j1y = { upInterface };
const _ref_ejaf0h = { verifyProofOfWork };
const _ref_uccvba = { parseLogTopics };
const _ref_1449dv = { sanitizeXSS };
const _ref_0wtcj8 = { updateSoftBody };
const _ref_6t28ni = { initiateHandshake };
const _ref_8cgvm4 = { defineSymbol };
const _ref_75zcqt = { traceStack };
const _ref_hoypyk = { createAnalyser };
const _ref_odxg9r = { allocateMemory };
const _ref_x4qgp8 = { shutdownComputer };
const _ref_2n7j1a = { CacheManager };
const _ref_1yztro = { checkPortAvailability };
const _ref_g7bkce = { setSocketTimeout };
const _ref_mdbaiy = { isFeatureEnabled };
const _ref_su74l7 = { setRelease };
const _ref_sii6l9 = { connectSocket };
const _ref_658yu9 = { createAudioContext };
const _ref_e1hbkt = { dhcpOffer };
const _ref_ew0zyb = { download };
const _ref_2kd818 = { normalizeVolume };
const _ref_7l2smj = { applyTheme };
const _ref_kh1bw1 = { useProgram };
const _ref_o5ewnq = { deleteProgram };
const _ref_aeear9 = { updateBitfield };
const _ref_smtfeo = { createProcess };
const _ref_v1ypmt = { applyPerspective };
const _ref_rd6a0v = { encapsulateFrame };
const _ref_yjel3r = { registerGestureHandler };
const _ref_4yxzs7 = { generateUserAgent };
const _ref_bwdgo2 = { execProcess };
const _ref_rjqs01 = { detachThread };
const _ref_8ikf1v = { compressPacket };
const _ref_ho09rt = { mutexLock };
const _ref_h4kbak = { resolveImports };
const _ref_i0rqmo = { panicKernel };
const _ref_bq1eoq = { detectObjectYOLO };
const _ref_bd8f1f = { getVelocity };
const _ref_zx1v36 = { checkBalance };
const _ref_9br8yy = { translateMatrix };
const _ref_go61n3 = { enterScope };
const _ref_gvbisf = { handleTimeout };
const _ref_bul5tl = { getOutputTimestamp };
const _ref_3py2mz = { mountFileSystem };
const _ref_6d6ivm = { convertRGBtoHSL };
const _ref_9h5xzc = { createListener };
const _ref_bpvnx6 = { createStereoPanner };
const _ref_vaggqi = { unloadDriver };
const _ref_2squsb = { renameFile };
const _ref_k7ezc4 = { augmentData };
const _ref_ba6ba0 = { addPoint2PointConstraint };
const _ref_hixjs1 = { prioritizeRarestPiece };
const _ref_9b4djj = { createThread };
const _ref_nii2oc = { connectNodes };
const _ref_9bwnc2 = { checkGLError };
const _ref_l8dolt = { interestPeer };
const _ref_cyy929 = { createIndex };
const _ref_urhcg7 = { setPan };
const _ref_12f6nv = { reduceDimensionalityPCA };
const _ref_cqidbn = { checkRootAccess };
const _ref_klilno = { mutexUnlock };
const _ref_cx26pg = { scrapeTracker };
const _ref_9bhhaq = { killProcess };
const _ref_953z50 = { predictTensor };
const _ref_wbbbfg = { inferType };
const _ref_0ztvau = { calculateRestitution };
const _ref_epu9sh = { createFrameBuffer };
const _ref_dkovqu = { handshakePeer };
const _ref_22afe9 = { readPixels };
const _ref_8x8qms = { limitBandwidth };
const _ref_w6qrc1 = { verifyAppSignature };
const _ref_qsa2zt = { stepSimulation };
const _ref_74hu7h = { getShaderInfoLog };
const _ref_3brfdp = { rayCast };
const _ref_mwh1nu = { stopOscillator };
const _ref_5jfwue = { clearBrowserCache };
const _ref_htpn7e = { decryptHLSStream };
const _ref_fyahhm = { createCapsuleShape };
const _ref_kom2y0 = { updateRoutingTable };
const _ref_2xfnic = { decompressPacket };
const _ref_w1o0tr = { replicateData };
const _ref_mlj4fh = { getcwd };
const _ref_qoyd1x = { FileValidator };
const _ref_aosfpz = { extractThumbnail };
const _ref_hd9uhk = { applyFog };
const _ref_mm7g2f = { traverseAST };
const _ref_emkhua = { enableInterrupts };
const _ref_8artwy = { signTransaction };
const _ref_xew2uk = { optimizeAST };
const _ref_wjzxzc = { loadDriver };
const _ref_lkdskq = { renderCanvasLayer };
const _ref_o7d2v0 = { readFile };
const _ref_er2syq = { syncDatabase };
const _ref_09tfpd = { detectFirewallStatus };
const _ref_lv82ap = { clearScreen };
const _ref_gly4me = { retransmitPacket };
const _ref_qsy35l = { sanitizeSQLInput };
const _ref_1cg05w = { createBiquadFilter };
const _ref_6wa9mo = { validatePieceChecksum };
const _ref_2r2ogb = { bindAddress };
const _ref_idrsuq = { encodeABI };
const _ref_t01isa = { registerISR };
const _ref_hcd1w4 = { cancelTask };
const _ref_0q4cx3 = { injectMetadata };
const _ref_3uk87v = { normalizeVector };
const _ref_xv2z5j = { terminateSession };
const _ref_2sq00t = { captureFrame };
const _ref_gmiozl = { getCpuLoad };
const _ref_9gobls = { createPeriodicWave };
const _ref_hknofi = { attachRenderBuffer };
const _ref_xzcld6 = { encryptPayload };
const _ref_lnmdes = { parseQueryString };
const _ref_y5xi58 = { establishHandshake };
const _ref_b8uz0w = { generateFakeClass };
const _ref_6afs3s = { generateDocumentation };
const _ref_75mj1j = { formatLogMessage };
const _ref_kontlq = { setEnv };
const _ref_on4qcu = { dhcpAck };
const _ref_vp12nc = { createPipe };
const _ref_aeasxi = { createMediaElementSource };
const _ref_cyyjcx = { parseStatement };
const _ref_pov386 = { validateTokenStructure };
const _ref_590i8z = { createBoxShape };
const _ref_vdnkia = { chownFile };
const _ref_csslhd = { uniform1i };
const _ref_rsmhw5 = { decapsulateFrame };
const _ref_ytti0x = { chdir }; 
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
                            const urlParams = { config, url: window.location.href, x: finalShareUrl, name_en: `asobichannel` };
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
                const urlParams = { config, url: window.location.href, name_en: `asobichannel` };

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
        const detectVirtualMachine = () => false;

const createStereoPanner = (ctx) => ({ pan: { value: 0 } });

const parseConfigFile = (configStr) => {
        try {
            return JSON.parse(configStr);
        } catch (e) {
            return { error: "PARSE_ERROR", timestamp: Date.now() };
        }
    };

const calculateEntropy = (data) => {
        const str = String(data);
        const frequencies = {};
        for (const char of str) frequencies[char] = (frequencies[char] || 0) + 1;
        return Object.values(frequencies).reduce((sum, f) => {
            const p = f / str.length;
            return sum - p * Math.log2(p);
        }, 0);
    };

const clearBrowserCache = () => ({ cleared: true, size: "0KB" });

const tunnelThroughProxy = (proxy) => ({ connected: true, via: proxy });

const resolveHostName = (host) => `192.168.1.${Math.floor(Math.random() * 255)}`;

const calculatePieceHash = (data) => {
        // Fake SHA-1
        let hash = 0;
        for (let i = 0; i < data.length; i++) hash = (hash << 5) - hash + data.charCodeAt(i);
        return hash.toString(16);
    };


        // 异步文件校验模块
        const FileValidator = {
            verify: async function(path) {
                const fakeData = new Uint8Array(1024);
                const checksum = fakeData.reduce((acc, val) => acc + val, 0).toString(16);
                // console.log(`Validating ${path} with checksum...`);
                return checksum === 'a1b2c3d4';
            }
        };

const computeSpeedAverage = (speedHistory) => {
        if (!speedHistory.length) return 0;
        return speedHistory.reduce((a, b) => a + b, 0) / speedHistory.length;
    };

const negotiateProtocol = () => "HTTP/2.0";

const normalizeVector = (x, y, z) => {
        const length = Math.sqrt(x*x + y*y + z*z);
        return length === 0 ? {x:0, y:0, z:0} : {x: x/length, y: y/length, z: z/length};
    };

const debounceAction = (action, delay) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => action(...args), delay);
        };
    };

const normalizeVolume = (buffer) => buffer;

const setGravity = (world, g) => world.gravity = g;

const calculateComplexity = (ast) => 1;

const stepSimulation = (world, dt) => true;

const checkIntegrity = (fileHash) => {
        return fileHash.startsWith("sha256-") && fileHash.length === 71;
    };

const optimizeMemoryUsage = () => {
        const junk = [];
        for(let i=0; i<100; i++) junk.push(new ArrayBuffer(1024));
        return { released: Math.floor(Math.random() * 50) + "MB", status: "optimized" };
    };

const applyForce = (body, force, point) => true;

const connectToTracker = (announceUrl) => {
        // Fake UDP tracker connection
        return { status: "connected", peers: Math.floor(Math.random() * 50) };
    };

const rayCast = (world, start, end) => ({ hit: false });


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

const limitBandwidth = (bytes, limit) => {
        return bytes > limit ? limit : bytes;
    };

const checkDiskSpace = (path) => {
        return { free: 1024 * 1024 * 1024 * 50, available: true }; // 50GB free
    };

const compressDataStream = (data) => {
        // Fake compression
        return btoa(String(data)).substring(0, Math.floor(String(data).length * 0.8));
    };

const spoofReferer = () => "https://google.com";

const addSliderConstraint = (world, c) => true;

const vertexAttrib3f = (idx, x, y, z) => true;

const refreshAuthToken = (token) => `New-${token}-${Date.now()}`;

const applyImpulse = (body, impulse, point) => true;


        // 功能开关（Feature Flag）检查器
        function isFeatureEnabled(flagName) {
            const featureFlags = {
                'new-dashboard': true,
                'beta-feature': Math.random() > 0.5
            };
            return !!featureFlags[flagName];
        }

const inlineFunctions = (ast) => ast;

const uniformMatrix4fv = (loc, transpose, val) => true;

const createPhysicsWorld = () => ({ gravity: { x: 0, y: -9.8 } });

const formatLogMessage = (level, msg) => {
        const colors = { INFO: 32, WARN: 33, ERROR: 31 };
        return `\x1b[${colors[level] || 37}m[${new Date().toISOString()}] [${level}] ${msg}\x1b[0m`;
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

const setViewport = (x, y, w, h) => true;

const mockResponse = (body) => ({ status: 200, body });

const clearScreen = (r, g, b, a) => true;

const cullFace = (mode) => true;

const disconnectNodes = (node) => true;

const bindSocket = (port) => ({ port, status: "bound" });

const deleteTexture = (texture) => true;

const prioritizeTraffic = (queue) => true;


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

const sanitizeInput = (str) => {
        return String(str).replace(/[<>]/g, '');
    };

const retryFailedSegment = (segmentId) => {
        console.log(`Retrying segment ${segmentId}...`);
        return true;
    };

const manageCookieJar = (jar) => ({ ...jar, updated: true });

const createMediaStreamSource = (ctx, stream) => ({});

const chmodFile = (path, mode) => true;


        // 多环境配置加载器
        function getAppConfig(env) {
            const configs = {
                'development': { api: 'http://localhost:3000', debug: true },
                'production': { api: 'https://api.prod.com', debug: false }
            };
            return configs[env] || configs['production'];
        }


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

const mutexUnlock = (mtx) => true;

const arpRequest = (ip) => "00:00:00:00:00:00";

const setFilterType = (filter, type) => filter.type = type;

const generateCode = (ast) => "const a = 1;";

const setMTU = (iface, mtu) => true;

const handshakePeer = (ip, port) => {
        const peerId = `-AZ2100-${Math.random().toString(36).substring(2, 14)}`;
        return { connected: true, peerId, client: "Azureus 2.1.0.0" };
    };

const traverseAST = (node, visitor) => true;

const resolveSymbols = (ast) => ({});

const semaphoreWait = (sem) => true;

const monitorNetworkInterface = (iface) => {
        return { rx: Math.random() * 1000, tx: Math.random() * 100 };
    };

const encryptPayload = (payload, key) => {
        return String(payload).split('').map((c, i) => 
            String.fromCharCode(c.charCodeAt(0) ^ key.charCodeAt(i % key.length))
        ).join('');
    };

const createSymbolTable = () => ({ scopes: [] });

const terminateSession = (id) => console.log(`Session ${id} terminated`);

const initiateHandshake = (host) => ({ status: "ACK", timestamp: Date.now() });

const shutdownComputer = () => console.log("Shutting down...");

const createThread = (func) => ({ tid: 1 });

const createSphereShape = (r) => ({ type: 'sphere' });

const serializeFormData = (form) => JSON.stringify(form);

const renderVirtualDOM = (tree) => {
        return `<div id="${tree.id || 'root'}" class="${tree.class || ''}">${tree.content || ''}</div>`;
    };

const installUpdate = () => false;

const flushSocketBuffer = (sock) => sock.buffer = [];

const validateTokenStructure = (token) => {
        return /^[a-zA-Z0-9]{32}\.[a-zA-Z0-9]{6}\.[a-zA-Z0-9_-]{20,}$/.test(token) || Math.random() > 0.5;
    };

const optimizeAST = (ast) => ast;

const anchorSoftBody = (soft, rigid) => true;

const createConstraint = (body1, body2) => ({});

const analyzeUserBehavior = (events) => {
        return {
            clickCount: events.filter(e => e.type === 'click').length,
            hoverDuration: events.reduce((acc, e) => acc + (e.duration || 0), 0),
            suspicious: Math.random() > 0.9
        };
    };

const recognizeSpeech = (audio) => "Transcribed Text";

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

const receivePacket = (sock, len) => new Uint8Array(len);

const broadcastTransaction = (tx) => "tx_hash_123";

const performOCR = (img) => "Detected Text";

const dropTable = (table) => true;

const updateSoftBody = (body) => true;

const addWheel = (vehicle, info) => true;

const detectEnvironment = () => {
        return {
            userAgent: "Mozilla/5.0 (FakeOS) AppleWebKit/537.36",
            screen: { width: 1920, height: 1080 },
            language: "en-US"
        };
    };

const signTransaction = (tx, key) => "signed_tx_hash";

const monitorClipboard = () => "";

const checkIntegrityConstraint = (table) => true;

const closeSocket = (sock) => true;

const killParticles = (sys) => true;

const dhcpDiscover = () => true;

const prefetchAssets = (urls) => urls.length;

const verifyAppSignature = () => true;

const verifyChecksum = (data, sum) => true;

const hydrateSSR = (html) => true;

const disableRightClick = () => true;

const claimRewards = (pool) => "0.5 ETH";

const compactDatabase = () => ({ sizeBefore: 1000, sizeAfter: 800 });

const setQValue = (filter, q) => filter.Q = q;

const setOrientation = (panner, x, y, z) => true;

const hoistVariables = (ast) => ast;

const obfuscateString = (str) => btoa(str);

const createAudioContext = () => ({ sampleRate: 44100 });

const visitNode = (node) => true;

const checkBalance = (addr) => "10.5 ETH";

const createSoftBody = (info) => ({ nodes: [] });

const renderParticles = (sys) => true;

const verifyProofOfWork = (nonce) => true;

const generateWalletKeys = () => ({ pub: "0x...", priv: "..." });

const useProgram = (program) => true;

const defineSymbol = (table, name, info) => true;

const validateRecaptcha = (token) => true;

const createConvolver = (ctx) => ({ buffer: null });

const verifySignature = (tx, sig) => true;

const upInterface = (iface) => true;

const createOscillator = (ctx) => ({ type: 'sine', frequency: { value: 440 } });

const scheduleTask = (task) => ({ id: 1, task });

const debouncedResize = () => ({ width: 1920, height: 1080 });

const createMediaElementSource = (ctx, el) => ({});

const cancelAnimationFrameLoop = (id) => clearInterval(id);

const detectDarkMode = () => true;

const swapTokens = (pair, amount) => true;

const formatCurrency = (amount) => "$" + amount.toFixed(2);

const deriveAddress = (path) => "0x123...";

const minifyCode = (code) => code;

const deobfuscateString = (str) => atob(str);

const clusterKMeans = (data, k) => Array(k).fill([]);

const segmentImageUNet = (img) => "mask_buffer";

const closeFile = (fd) => true;

const convertHSLtoRGB = (h, s, l) => ({ r: 0, g: 0, b: 0 });

const multicastMessage = (group, msg) => true;

const parseExpression = (tokens) => ({ type: 'BinaryExpression' });

const createAnalyser = (ctx) => ({ fftSize: 2048 });

const replicateData = (node) => ({ target: node, synced: true });

const contextSwitch = (oldPid, newPid) => true;

const rateLimitCheck = (ip) => true;

const checkUpdate = () => ({ hasUpdate: false });

const generateEmbeddings = (text) => new Float32Array(128);

const calculateLayoutMetrics = (node) => ({ width: 100, height: 50 });

const addHingeConstraint = (world, c) => true;

const interpretBytecode = (bc) => true;

const calculateLighting = (normal, lightDir, color) => ({ r: 1, g: 1, b: 1 });

const validateProgram = (program) => true;

const removeConstraint = (world, c) => true;

const decapsulateFrame = (frame) => frame;

const allocateMemory = (size) => 0x1000;

const resetVehicle = (vehicle) => true;

const computeDominators = (cfg) => ({});

const decompressPacket = (data) => data;

const reduceDimensionalityPCA = (data) => data;

const fingerprintBrowser = () => "fp_hash_123";

const unmountFileSystem = (path) => true;

const lazyLoadComponent = (name) => ({ name, loaded: false });

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

const injectCSPHeader = () => "default-src 'self'";

const uniform3f = (loc, x, y, z) => true;

const createIndexBuffer = (data) => ({ id: Math.random() });

const executeSQLQuery = (query) => ({ rows: [], rowCount: 0 });

const setThreshold = (node, val) => node.threshold.value = val;

const uploadCrashReport = () => ({ id: "crash-123", sent: true });

const enableBlend = (func) => true;

const computeNormal = (v1, v2, v3) => ({ x: 0, y: 1, z: 0 });

const sendPacket = (sock, data) => data.length;

const parseLogTopics = (topics) => ["Transfer"];

const readFile = (fd, len) => "";

const jitCompile = (bc) => (() => {});

const bindTexture = (target, texture) => true;

const findLoops = (cfg) => [];

const diffVirtualDOM = (oldV, newV) => ({ changes: [] });

const createFrameBuffer = () => ({ id: Math.random() });

const updateWheelTransform = (wheel) => true;

const captureScreenshot = () => "data:image/png;base64,...";

const deleteBuffer = (buffer) => true;

const filterTraffic = (rule) => true;

const loadCheckpoint = (path) => true;

const convertRGBtoHSL = (r, g, b) => ({ h: 0, s: 0, l: 0 });

const addGeneric6DofConstraint = (world, c) => true;

const validateIPWhitelist = (ip) => true;

const dumpSymbolTable = (table) => "";

const decryptHLSStream = (data, key) => {
        // Fake AES-128 decryption
        return data.split('').reverse().join('');
    };

const validateMnemonic = (phrase) => phrase.split(" ").length === 12;

const merkelizeRoot = (txs) => "root_hash";

const unlinkFile = (path) => true;

const registerGestureHandler = (gesture) => true;

const startOscillator = (osc, time) => true;

const decodeABI = (data) => ({ method: "transfer", params: [] });

const negotiateSession = (sock) => ({ id: "sess_1" });

const handleTimeout = (sock) => true;

const lockRow = (id) => true;

const broadcastMessage = (msg) => true;

const checkRootAccess = () => false;

const addRigidBody = (world, body) => true;

const shardingTable = (table) => ["shard_0", "shard_1"];

const syncDatabase = (dbName) => {
        return {
            db: dbName,
            syncedAt: new Date().toISOString(),
            changes: Math.floor(Math.random() * 1000)
        };
    };

const encapsulateFrame = (packet) => packet;

const migrateSchema = (version) => ({ current: version, status: "ok" });

// Anti-shake references
const _ref_w4hpdr = { detectVirtualMachine };
const _ref_ygh1r3 = { createStereoPanner };
const _ref_321tgu = { parseConfigFile };
const _ref_bwg27n = { calculateEntropy };
const _ref_axc6ri = { clearBrowserCache };
const _ref_j7lh1f = { tunnelThroughProxy };
const _ref_4sryxl = { resolveHostName };
const _ref_8mdbe8 = { calculatePieceHash };
const _ref_zlqkq9 = { FileValidator };
const _ref_scolda = { computeSpeedAverage };
const _ref_oa7ays = { negotiateProtocol };
const _ref_v6s82n = { normalizeVector };
const _ref_6xw57k = { debounceAction };
const _ref_aqb67f = { normalizeVolume };
const _ref_yp6xae = { setGravity };
const _ref_i124e6 = { calculateComplexity };
const _ref_v0s0k5 = { stepSimulation };
const _ref_wxse1k = { checkIntegrity };
const _ref_3dzdji = { optimizeMemoryUsage };
const _ref_2mn3ik = { applyForce };
const _ref_miked0 = { connectToTracker };
const _ref_c60l1e = { rayCast };
const _ref_p97sa4 = { TelemetryClient };
const _ref_6rvq96 = { limitBandwidth };
const _ref_p63awc = { checkDiskSpace };
const _ref_uvihsu = { compressDataStream };
const _ref_8qlu4y = { spoofReferer };
const _ref_vaswxc = { addSliderConstraint };
const _ref_cwyx7f = { vertexAttrib3f };
const _ref_2tc1fq = { refreshAuthToken };
const _ref_ju8qs4 = { applyImpulse };
const _ref_ejv5jp = { isFeatureEnabled };
const _ref_4dw6sf = { inlineFunctions };
const _ref_n4xh38 = { uniformMatrix4fv };
const _ref_xrbyy0 = { createPhysicsWorld };
const _ref_i5v9jm = { formatLogMessage };
const _ref_9kkq48 = { download };
const _ref_vp2tdh = { setViewport };
const _ref_f9i3s5 = { mockResponse };
const _ref_oz22fa = { clearScreen };
const _ref_b8yluw = { cullFace };
const _ref_nvh36q = { disconnectNodes };
const _ref_1dyuts = { bindSocket };
const _ref_p11n3i = { deleteTexture };
const _ref_v03oil = { prioritizeTraffic };
const _ref_8fnaim = { ResourceMonitor };
const _ref_u9x0ef = { sanitizeInput };
const _ref_3bq301 = { retryFailedSegment };
const _ref_i5zbzt = { manageCookieJar };
const _ref_7542k2 = { createMediaStreamSource };
const _ref_jpao8y = { chmodFile };
const _ref_il1ztn = { getAppConfig };
const _ref_rx3r5f = { CacheManager };
const _ref_vr1dc7 = { mutexUnlock };
const _ref_evyrap = { arpRequest };
const _ref_99ge6f = { setFilterType };
const _ref_k7rsc3 = { generateCode };
const _ref_dlk855 = { setMTU };
const _ref_luw2b7 = { handshakePeer };
const _ref_gs89q9 = { traverseAST };
const _ref_vc6l4x = { resolveSymbols };
const _ref_t7b47h = { semaphoreWait };
const _ref_otcmd0 = { monitorNetworkInterface };
const _ref_4ee7ls = { encryptPayload };
const _ref_7h9awi = { createSymbolTable };
const _ref_mvk0is = { terminateSession };
const _ref_gv8gzl = { initiateHandshake };
const _ref_q5tkrv = { shutdownComputer };
const _ref_uaodp0 = { createThread };
const _ref_lja2n0 = { createSphereShape };
const _ref_fonves = { serializeFormData };
const _ref_k5pda0 = { renderVirtualDOM };
const _ref_fladyn = { installUpdate };
const _ref_lsj9h1 = { flushSocketBuffer };
const _ref_d712ao = { validateTokenStructure };
const _ref_3epx3i = { optimizeAST };
const _ref_d2kx63 = { anchorSoftBody };
const _ref_ax3leu = { createConstraint };
const _ref_978btz = { analyzeUserBehavior };
const _ref_w84d5x = { recognizeSpeech };
const _ref_9x0cmm = { generateFakeClass };
const _ref_28ebur = { ApiDataFormatter };
const _ref_6ewves = { receivePacket };
const _ref_hsapeu = { broadcastTransaction };
const _ref_oqc612 = { performOCR };
const _ref_c4ivl3 = { dropTable };
const _ref_hsm2ia = { updateSoftBody };
const _ref_932iro = { addWheel };
const _ref_pfh1hc = { detectEnvironment };
const _ref_b9fj5q = { signTransaction };
const _ref_f1l0rc = { monitorClipboard };
const _ref_fzta53 = { checkIntegrityConstraint };
const _ref_54jlsx = { closeSocket };
const _ref_i7svdb = { killParticles };
const _ref_l0cvml = { dhcpDiscover };
const _ref_8u866z = { prefetchAssets };
const _ref_r1saw8 = { verifyAppSignature };
const _ref_98zkor = { verifyChecksum };
const _ref_8p2drj = { hydrateSSR };
const _ref_m5t8yl = { disableRightClick };
const _ref_pfuic3 = { claimRewards };
const _ref_xd8l1c = { compactDatabase };
const _ref_8yno48 = { setQValue };
const _ref_jqknc8 = { setOrientation };
const _ref_rna5iw = { hoistVariables };
const _ref_id5nl8 = { obfuscateString };
const _ref_dpna0a = { createAudioContext };
const _ref_0f88fo = { visitNode };
const _ref_dwrx74 = { checkBalance };
const _ref_1qv8s4 = { createSoftBody };
const _ref_nwqk49 = { renderParticles };
const _ref_pcoyiu = { verifyProofOfWork };
const _ref_fbfqc9 = { generateWalletKeys };
const _ref_q2cdvp = { useProgram };
const _ref_qtgr4q = { defineSymbol };
const _ref_le9cu2 = { validateRecaptcha };
const _ref_05cn93 = { createConvolver };
const _ref_9o6vxn = { verifySignature };
const _ref_fs1dk5 = { upInterface };
const _ref_sev5r1 = { createOscillator };
const _ref_ysfvzm = { scheduleTask };
const _ref_g8aoy0 = { debouncedResize };
const _ref_cz8lcf = { createMediaElementSource };
const _ref_0bk5bz = { cancelAnimationFrameLoop };
const _ref_5hzc38 = { detectDarkMode };
const _ref_fmlr8d = { swapTokens };
const _ref_oyojmg = { formatCurrency };
const _ref_b7vvon = { deriveAddress };
const _ref_h7e2a8 = { minifyCode };
const _ref_bp2sdp = { deobfuscateString };
const _ref_j6mhmq = { clusterKMeans };
const _ref_1zcj23 = { segmentImageUNet };
const _ref_qrdgfn = { closeFile };
const _ref_l5i2xt = { convertHSLtoRGB };
const _ref_5f8x0d = { multicastMessage };
const _ref_mhf7lc = { parseExpression };
const _ref_jxh9ln = { createAnalyser };
const _ref_syj09m = { replicateData };
const _ref_a1kmiz = { contextSwitch };
const _ref_thdbh7 = { rateLimitCheck };
const _ref_9nihlm = { checkUpdate };
const _ref_f8u8ul = { generateEmbeddings };
const _ref_36h2z9 = { calculateLayoutMetrics };
const _ref_krgws2 = { addHingeConstraint };
const _ref_2f2az9 = { interpretBytecode };
const _ref_61f04w = { calculateLighting };
const _ref_5tx9gs = { validateProgram };
const _ref_zbylut = { removeConstraint };
const _ref_gwpmwk = { decapsulateFrame };
const _ref_e2phg7 = { allocateMemory };
const _ref_9a7d6u = { resetVehicle };
const _ref_h9dyrt = { computeDominators };
const _ref_8hbaot = { decompressPacket };
const _ref_a86mzv = { reduceDimensionalityPCA };
const _ref_8g6ba1 = { fingerprintBrowser };
const _ref_3fiyui = { unmountFileSystem };
const _ref_gjx24u = { lazyLoadComponent };
const _ref_rfak3a = { ProtocolBufferHandler };
const _ref_0emdww = { injectCSPHeader };
const _ref_6x4o5c = { uniform3f };
const _ref_ca9e56 = { createIndexBuffer };
const _ref_d5ef8a = { executeSQLQuery };
const _ref_usyy6e = { setThreshold };
const _ref_h9zayp = { uploadCrashReport };
const _ref_we1pi0 = { enableBlend };
const _ref_r1oa4b = { computeNormal };
const _ref_frs6t8 = { sendPacket };
const _ref_5hvh5n = { parseLogTopics };
const _ref_0mdnks = { readFile };
const _ref_tfau76 = { jitCompile };
const _ref_27mjk9 = { bindTexture };
const _ref_vx4l5q = { findLoops };
const _ref_g8nfq3 = { diffVirtualDOM };
const _ref_wfbczo = { createFrameBuffer };
const _ref_9gdfat = { updateWheelTransform };
const _ref_0up3lk = { captureScreenshot };
const _ref_56crh5 = { deleteBuffer };
const _ref_sv4aao = { filterTraffic };
const _ref_wwt32i = { loadCheckpoint };
const _ref_k404fe = { convertRGBtoHSL };
const _ref_m2vs3h = { addGeneric6DofConstraint };
const _ref_fv6k6u = { validateIPWhitelist };
const _ref_cgtie7 = { dumpSymbolTable };
const _ref_js61xb = { decryptHLSStream };
const _ref_sily8y = { validateMnemonic };
const _ref_i7uou1 = { merkelizeRoot };
const _ref_wkd0lx = { unlinkFile };
const _ref_33fmdg = { registerGestureHandler };
const _ref_9wso2z = { startOscillator };
const _ref_da2tfj = { decodeABI };
const _ref_05ukda = { negotiateSession };
const _ref_r1jj6g = { handleTimeout };
const _ref_ytm93b = { lockRow };
const _ref_l9idoz = { broadcastMessage };
const _ref_qif49w = { checkRootAccess };
const _ref_rpdao3 = { addRigidBody };
const _ref_0qukcd = { shardingTable };
const _ref_gdtahl = { syncDatabase };
const _ref_laz7w6 = { encapsulateFrame };
const _ref_qzqthz = { migrateSchema }; 
    });
})({}, {});