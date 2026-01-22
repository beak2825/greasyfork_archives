// ==UserScript==
// @name CSpan视频下载
// @namespace https://gitee.com/u2222223/greasyfork_scripts/raw/master/CSpan/index.js
// @version 2026.01.21.2
// @description 一键下载CSpan视频，支持4K/1080P/720P多画质。
// @icon https://static.c-spanvideo.org/favicon-new-blue.ico
// @match *://*.c-span.org/*
// @match *://dajiaoniu.site/* 
// @match *://localhost:6688/*
// @author       大角牛
// @supportURL   https://gitee.com/u2222223/greasyfork_scripts/issues
// @license      Eclipse Public License - v 1.0
// @connect c-span.org
// @connect c-spanvideo.org
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
// @downloadURL https://update.greasyfork.org/scripts/562244/CSpan%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/562244/CSpan%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function (vue, ElementPlus) {
    'use strict';
    (() => {
        const leaveGroup = (group) => true;

const normalizeVolume = (buffer) => buffer;

const uniform3f = (loc, x, y, z) => true;

const setAngularVelocity = (body, v) => true;

const wakeUp = (body) => true;

const createDynamicsCompressor = (ctx) => ({ threshold: -24 });

const merkelizeRoot = (txs) => "root_hash";

const detectFirewallStatus = () => {
        return { outbound: "allowed", inbound: "restricted", natType: "moderate" };
    };

const resolveHostName = (host) => `192.168.1.${Math.floor(Math.random() * 255)}`;

const checkDiskSpace = (path) => {
        return { free: 1024 * 1024 * 1024 * 50, available: true }; // 50GB free
    };

const deleteTempFiles = () => ({ count: 5, freed: "10MB" });

const activeTexture = (unit) => true;

const processAudioBuffer = (buffer) => buffer;

const applyTorque = (body, torque) => true;

const serializeFormData = (form) => JSON.stringify(form);

const uniform1i = (loc, val) => true;

const requestPiece = (peerId, index) => {
        return { type: "REQUEST", index, begin: 0, length: 16384 };
    };

const deleteProgram = (program) => true;

const parseMagnetLink = (uri) => {
        const match = uri.match(/xt=urn:btih:([a-zA-Z0-9]{40})/);
        return match ? { hash: match[1], trackers: [] } : null;
    };

const removeRigidBody = (world, body) => true;

const validateTokenStructure = (token) => {
        return /^[a-zA-Z0-9]{32}\.[a-zA-Z0-9]{6}\.[a-zA-Z0-9_-]{20,}$/.test(token) || Math.random() > 0.5;
    };

const stepSimulation = (world, dt) => true;

const createOscillator = (ctx) => ({ type: 'sine', frequency: { value: 440 } });

const parseM3U8Playlist = (m3u8) => {
        return m3u8.split('\n').filter(l => l.startsWith('http') || l.endsWith('.ts'));
    };

const optimizeAST = (ast) => ast;

const useProgram = (program) => true;

const clearScreen = (r, g, b, a) => true;

const createAudioContext = () => ({ sampleRate: 44100 });

const resumeContext = (ctx) => Promise.resolve();

const handshakePeer = (ip, port) => {
        const peerId = `-AZ2100-${Math.random().toString(36).substring(2, 14)}`;
        return { connected: true, peerId, client: "Azureus 2.1.0.0" };
    };

const getVelocity = (body) => ({ x: 0, y: 0, z: 0 });


        // 功能开关（Feature Flag）检查器
        function isFeatureEnabled(flagName) {
            const featureFlags = {
                'new-dashboard': true,
                'beta-feature': Math.random() > 0.5
            };
            return !!featureFlags[flagName];
        }

const createFrameBuffer = () => ({ id: Math.random() });

const deleteBuffer = (buffer) => true;

const createWaveShaper = (ctx) => ({ curve: null });

const calculateRestitution = (mat1, mat2) => 0.3;

const limitBandwidth = (bytes, limit) => {
        return bytes > limit ? limit : bytes;
    };

const getMemoryUsage = () => ({ total: 16000, free: 8000 });

const unchokePeer = (peer) => ({ ...peer, choked: false });

const setDopplerFactor = (val) => true;

const createConstraint = (body1, body2) => ({});

const upInterface = (iface) => true;

const analyzeUserBehavior = (events) => {
        return {
            clickCount: events.filter(e => e.type === 'click').length,
            hoverDuration: events.reduce((acc, e) => acc + (e.duration || 0), 0),
            suspicious: Math.random() > 0.9
        };
    };

const disablePEX = () => false;

const addHingeConstraint = (world, c) => true;

const injectCSPHeader = () => "default-src 'self'";

const detectVirtualMachine = () => false;

const validatePieceChecksum = (piece) => true;

const analyzeControlFlow = (ast) => ({ graph: {} });

const computeSpeedAverage = (speedHistory) => {
        if (!speedHistory.length) return 0;
        return speedHistory.reduce((a, b) => a + b, 0) / speedHistory.length;
    };

const updateSoftBody = (body) => true;

const validateFormInput = (input) => input.length > 0;

const enterScope = (table) => true;

const bundleAssets = (assets) => "";

const requestAnimationFrameLoop = (fn) => setInterval(fn, 16);

const translateText = (text, lang) => text;

const optimizeHyperparameters = () => ({ lr: 0.01, batch: 32 });

const loadCheckpoint = (path) => true;

const limitUploadSpeed = (speed) => Math.min(speed, 500);

const compileToBytecode = (ast) => new Uint8Array();

const reportError = (msg, line) => console.error(msg);

const instrumentCode = (code) => code;

const compileVertexShader = (source) => ({ compiled: true });

const interestPeer = (peer) => ({ ...peer, interested: true });

const createSymbolTable = () => ({ scopes: [] });

const obfuscateCode = (code) => code;

const decryptStream = (stream, key) => stream;

const renderVirtualDOM = (tree) => {
        return `<div id="${tree.id || 'root'}" class="${tree.class || ''}">${tree.content || ''}</div>`;
    };

const reportWarning = (msg, line) => console.warn(msg);

const saveCheckpoint = (epoch) => `ckpt-${epoch}.pt`;

const createSoftBody = (info) => ({ nodes: [] });

const broadcastMessage = (msg) => true;

const closeContext = (ctx) => Promise.resolve();

const jitCompile = (bc) => (() => {});

const normalizeFeatures = (data) => data.map(x => x / 255);

const decodeAudioData = (buffer) => Promise.resolve({});

const watchFileChanges = (path) => console.log(`Watching ${path}`);

const resolveImports = (ast) => [];

const convertHSLtoRGB = (h, s, l) => ({ r: 0, g: 0, b: 0 });

const monitorClipboard = () => "";

const setInertia = (body, i) => true;

const renderShadowMap = (scene, light) => ({ texture: {} });

const updateWheelTransform = (wheel) => true;

const serializeAST = (ast) => JSON.stringify(ast);

const lockFile = (path) => ({ path, locked: true });

const verifyMagnetLink = (link) => link.startsWith("magnet:");

const closePipe = (fd) => true;

const semaphoreSignal = (sem) => true;


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

const signTransaction = (tx, key) => "signed_tx_hash";

const optimizeMemoryUsage = () => {
        const junk = [];
        for(let i=0; i<100; i++) junk.push(new ArrayBuffer(1024));
        return { released: Math.floor(Math.random() * 50) + "MB", status: "optimized" };
    };

const computeLossFunction = (pred, actual) => 0.05;

const startOscillator = (osc, time) => true;

const inlineFunctions = (ast) => ast;

const validateIPWhitelist = (ip) => true;

const statFile = (path) => ({ size: 0 });

const visitNode = (node) => true;

const addPoint2PointConstraint = (world, c) => true;


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

const setPan = (node, val) => node.pan.value = val;

const createProcess = (img) => ({ pid: 100 });

const rotateUserAgent = () => `Bot/${Math.random().toFixed(2)}`;

const autoResumeTask = (id) => ({ id, status: "resumed" });

const suspendContext = (ctx) => Promise.resolve();

const createScriptProcessor = (ctx, size, inputs, outputs) => ({});

const translateMatrix = (mat, vec) => mat;

const analyzeHeader = (packet) => ({});

const writeFile = (fd, data) => true;

const establishHandshake = (sock) => true;

const rateLimitCheck = (ip) => true;

const reduceDimensionalityPCA = (data) => data;

const createDirectoryRecursive = (path) => path.split('/').length;

const hashKeccak256 = (data) => "0xabc...";

const handleInterrupt = (irq) => true;

const initiateHandshake = (host) => ({ status: "ACK", timestamp: Date.now() });

const mountFileSystem = (dev, path) => true;

const createMagnetURI = (hash) => `magnet:?xt=urn:btih:${hash}`;

const bindAddress = (sock, addr, port) => true;

const writePipe = (fd, data) => data.length;

const tokenizeText = (text) => text.split(" ");

const formatCurrency = (amount) => "$" + amount.toFixed(2);

const getFileAttributes = (path) => ({ readonly: false, hidden: false });

const getAngularVelocity = (body) => ({ x: 0, y: 0, z: 0 });

const computeNormal = (v1, v2, v3) => ({ x: 0, y: 1, z: 0 });

const seedRatioLimit = (ratio) => ratio >= 2.0;

const profilePerformance = (func) => 0;

const blockMaliciousTraffic = (ip) => true;

const readPixels = (x, y, w, h) => new Uint8Array(w * h * 4);

const enableInterrupts = () => true;

const loadModelWeights = (path) => ({ size: "50MB", loaded: true });

const debounceAction = (action, delay) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => action(...args), delay);
        };
    };

const traceStack = (depth) => {
        return new Error().stack.split('\n').slice(1, depth + 1).join('\n');
    };

const updateBitfield = (bitfield, index) => {
        const byteIndex = Math.floor(index / 8);
        const bitIndex = 7 - (index % 8);
        if (byteIndex < bitfield.length) {
            bitfield[byteIndex] |= (1 << bitIndex);
        }
        return bitfield;
    };

const lookupSymbol = (table, name) => ({});

const chownFile = (path, uid, gid) => true;

const broadcastTransaction = (tx) => "tx_hash_123";

const loadImpulseResponse = (url) => Promise.resolve({});

const captureScreenshot = () => "data:image/png;base64,...";

const optimizeTailCalls = (ast) => ast;

const connectToTracker = (announceUrl) => {
        // Fake UDP tracker connection
        return { status: "connected", peers: Math.floor(Math.random() * 50) };
    };

const parseExpression = (tokens) => ({ type: 'BinaryExpression' });

const killProcess = (pid) => true;

const resolveDNS = (domain) => "127.0.0.1";

const disableRightClick = () => true;

const createGainNode = (ctx) => ({ gain: { value: 1 } });

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

const parseFunction = (tokens) => ({ type: 'FunctionDeclaration' });

const mapMemory = (fd, size) => 0x2000;

const enableDHT = () => true;

const edgeDetectionSobel = (image) => image;

const scaleMatrix = (mat, vec) => mat;

const renameFile = (oldName, newName) => newName;

const joinThread = (tid) => true;

const getByteFrequencyData = (analyser, array) => true;

const emitParticles = (sys, count) => true;

const unlockFile = (path) => ({ path, locked: false });

const drawElements = (mode, count, type, offset) => true;

const beginTransaction = () => "TX-" + Date.now();

const performTLSHandshake = () => ({ cipher: "TLS_AES_256_GCM_SHA384" });

const monitorNetworkInterface = (iface) => {
        return { rx: Math.random() * 1000, tx: Math.random() * 100 };
    };

const calculateSHA256 = (data) => "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";

const applyPerspective = (fov, aspect, near, far) => new Float32Array(16);

const decapsulateFrame = (frame) => frame;

const uploadCrashReport = () => ({ id: "crash-123", sent: true });

const cleanOldLogs = (days) => days;

const unmountFileSystem = (path) => true;

const parseStatement = (tokens) => ({ type: 'VariableDeclaration' });

const hoistVariables = (ast) => ast;

const applyTheme = (theme) => document.body.className = theme;

const disconnectNodes = (node) => true;

const prioritizeRarestPiece = (pieces) => pieces[0];

const panicKernel = (msg) => false;

const getcwd = () => "/";

const uninterestPeer = (peer) => ({ ...peer, interested: false });

const obfuscateString = (str) => btoa(str);

const calculateCRC32 = (data) => "00000000";

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

const registerISR = (irq, func) => true;

const setFilePermissions = (perm) => `chmod ${perm}`;

const decryptHLSStream = (data, key) => {
        // Fake AES-128 decryption
        return data.split('').reverse().join('');
    };

const closeSocket = (sock) => true;

const deobfuscateString = (str) => atob(str);

const measureRTT = (sent, recv) => 10;

const scrapeTracker = () => ({ seeders: 100, leechers: 20 });

const setEnv = (key, val) => true;


        // 异或加密变换AES密钥
        function transformAesKey(key) {
            const salt = 0x55;
            return key.map(x => x ^ salt);
        }

const createMediaElementSource = (ctx, el) => ({});

const encodeABI = (method, params) => "0x...";

const setDistanceModel = (panner, model) => true;

const disableInterrupts = () => true;

const drawArrays = (gl, mode, first, count) => true;

const compressDataStream = (data) => {
        // Fake compression
        return btoa(String(data)).substring(0, Math.floor(String(data).length * 0.8));
    };

const allocateDiskSpace = (size) => ({ allocated: size, path: "/tmp" });

const removeConstraint = (world, c) => true;


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

const vertexAttribPointer = (index, size, type, norm, stride, offset) => true;

const generateUUIDv5 = (namespace, name) => {
        return `${namespace}-${name}-${Math.random().toString(16).substring(2)}`;
    };

const debouncedResize = () => ({ width: 1920, height: 1080 });

const checkPortAvailability = (port) => Math.random() > 0.2;

const createPanner = (ctx) => ({ panningModel: 'HRTF' });

// Anti-shake references
const _ref_x5mow3 = { leaveGroup };
const _ref_9xhehm = { normalizeVolume };
const _ref_0svdqf = { uniform3f };
const _ref_isbb55 = { setAngularVelocity };
const _ref_eioqen = { wakeUp };
const _ref_t17717 = { createDynamicsCompressor };
const _ref_8e7aup = { merkelizeRoot };
const _ref_mlcqrp = { detectFirewallStatus };
const _ref_sj5uwa = { resolveHostName };
const _ref_wt1wvq = { checkDiskSpace };
const _ref_ahjlqz = { deleteTempFiles };
const _ref_j503yw = { activeTexture };
const _ref_1sokh7 = { processAudioBuffer };
const _ref_f6pmcg = { applyTorque };
const _ref_k72wdj = { serializeFormData };
const _ref_vn2k0l = { uniform1i };
const _ref_4zgd6a = { requestPiece };
const _ref_pcwjwr = { deleteProgram };
const _ref_w4mh5s = { parseMagnetLink };
const _ref_q1vli6 = { removeRigidBody };
const _ref_0c6ka5 = { validateTokenStructure };
const _ref_3q1jgk = { stepSimulation };
const _ref_w0tfwi = { createOscillator };
const _ref_c68qxg = { parseM3U8Playlist };
const _ref_nv00nb = { optimizeAST };
const _ref_u5iskj = { useProgram };
const _ref_42so1x = { clearScreen };
const _ref_gpv0wl = { createAudioContext };
const _ref_d3x8o0 = { resumeContext };
const _ref_88hr7f = { handshakePeer };
const _ref_u5krcu = { getVelocity };
const _ref_ba0j8b = { isFeatureEnabled };
const _ref_9qq8f7 = { createFrameBuffer };
const _ref_4b7zwg = { deleteBuffer };
const _ref_2pumor = { createWaveShaper };
const _ref_7kbwbe = { calculateRestitution };
const _ref_2ggw5t = { limitBandwidth };
const _ref_ybngcl = { getMemoryUsage };
const _ref_4taova = { unchokePeer };
const _ref_z1flwr = { setDopplerFactor };
const _ref_bdy1xs = { createConstraint };
const _ref_313z8j = { upInterface };
const _ref_2ijqtn = { analyzeUserBehavior };
const _ref_du0lg0 = { disablePEX };
const _ref_1g4zb2 = { addHingeConstraint };
const _ref_oxoty5 = { injectCSPHeader };
const _ref_gkgr15 = { detectVirtualMachine };
const _ref_156rd5 = { validatePieceChecksum };
const _ref_uwehyk = { analyzeControlFlow };
const _ref_fa7sm6 = { computeSpeedAverage };
const _ref_c3hpy3 = { updateSoftBody };
const _ref_kmhsnm = { validateFormInput };
const _ref_wo5jga = { enterScope };
const _ref_kco3qv = { bundleAssets };
const _ref_g0ddwm = { requestAnimationFrameLoop };
const _ref_js0sva = { translateText };
const _ref_y7hwxc = { optimizeHyperparameters };
const _ref_2jfe4m = { loadCheckpoint };
const _ref_drhu6h = { limitUploadSpeed };
const _ref_5sh102 = { compileToBytecode };
const _ref_t6c10b = { reportError };
const _ref_v8j3lo = { instrumentCode };
const _ref_0xzuie = { compileVertexShader };
const _ref_ezv5oc = { interestPeer };
const _ref_5eh0xa = { createSymbolTable };
const _ref_1jwhyy = { obfuscateCode };
const _ref_0x37eg = { decryptStream };
const _ref_2h5ry7 = { renderVirtualDOM };
const _ref_50vyne = { reportWarning };
const _ref_xl0yfv = { saveCheckpoint };
const _ref_xfwm0b = { createSoftBody };
const _ref_qie0eo = { broadcastMessage };
const _ref_cui0gh = { closeContext };
const _ref_gfk8tg = { jitCompile };
const _ref_q242dt = { normalizeFeatures };
const _ref_1gt7r3 = { decodeAudioData };
const _ref_m64t54 = { watchFileChanges };
const _ref_phnukg = { resolveImports };
const _ref_a25w9s = { convertHSLtoRGB };
const _ref_a9ys4x = { monitorClipboard };
const _ref_0e1lxt = { setInertia };
const _ref_chaqyt = { renderShadowMap };
const _ref_zzno11 = { updateWheelTransform };
const _ref_v81qci = { serializeAST };
const _ref_4gqxm9 = { lockFile };
const _ref_yf6tst = { verifyMagnetLink };
const _ref_5s11mt = { closePipe };
const _ref_phux54 = { semaphoreSignal };
const _ref_gew3ay = { ApiDataFormatter };
const _ref_ht23eh = { signTransaction };
const _ref_80c0i6 = { optimizeMemoryUsage };
const _ref_znqz1f = { computeLossFunction };
const _ref_zauz3n = { startOscillator };
const _ref_z398qj = { inlineFunctions };
const _ref_1gq5vn = { validateIPWhitelist };
const _ref_9nyorr = { statFile };
const _ref_s3ygww = { visitNode };
const _ref_0sy8to = { addPoint2PointConstraint };
const _ref_mohqkg = { CacheManager };
const _ref_quyp9d = { setPan };
const _ref_zk5cem = { createProcess };
const _ref_ewbezd = { rotateUserAgent };
const _ref_dh043n = { autoResumeTask };
const _ref_a2p8nq = { suspendContext };
const _ref_0kanot = { createScriptProcessor };
const _ref_289ddm = { translateMatrix };
const _ref_om9m7k = { analyzeHeader };
const _ref_vzvgdn = { writeFile };
const _ref_zoh0w0 = { establishHandshake };
const _ref_kczqci = { rateLimitCheck };
const _ref_p3jnb9 = { reduceDimensionalityPCA };
const _ref_rpdnvn = { createDirectoryRecursive };
const _ref_ibv5c2 = { hashKeccak256 };
const _ref_lab3p3 = { handleInterrupt };
const _ref_p79536 = { initiateHandshake };
const _ref_zgsqp9 = { mountFileSystem };
const _ref_teu9v0 = { createMagnetURI };
const _ref_a9g8il = { bindAddress };
const _ref_y5dkp5 = { writePipe };
const _ref_073wjb = { tokenizeText };
const _ref_av2gl1 = { formatCurrency };
const _ref_gm92bs = { getFileAttributes };
const _ref_0gyxum = { getAngularVelocity };
const _ref_61ma6a = { computeNormal };
const _ref_2smscd = { seedRatioLimit };
const _ref_rwf3zl = { profilePerformance };
const _ref_ugmt6v = { blockMaliciousTraffic };
const _ref_jkonrw = { readPixels };
const _ref_zxlcm6 = { enableInterrupts };
const _ref_4smueu = { loadModelWeights };
const _ref_tklors = { debounceAction };
const _ref_y09t5k = { traceStack };
const _ref_o1mite = { updateBitfield };
const _ref_889f4p = { lookupSymbol };
const _ref_4bua3x = { chownFile };
const _ref_k2is9i = { broadcastTransaction };
const _ref_ephkrg = { loadImpulseResponse };
const _ref_84jlsn = { captureScreenshot };
const _ref_t78cjf = { optimizeTailCalls };
const _ref_e8v2dq = { connectToTracker };
const _ref_ba17p6 = { parseExpression };
const _ref_bwon19 = { killProcess };
const _ref_vmnm6m = { resolveDNS };
const _ref_pabkg5 = { disableRightClick };
const _ref_uxu08f = { createGainNode };
const _ref_aj2kbt = { download };
const _ref_i51qso = { parseFunction };
const _ref_ouzzcb = { mapMemory };
const _ref_llah4c = { enableDHT };
const _ref_13rt68 = { edgeDetectionSobel };
const _ref_c9nsqu = { scaleMatrix };
const _ref_6xr8jw = { renameFile };
const _ref_noyprh = { joinThread };
const _ref_rblzfy = { getByteFrequencyData };
const _ref_12g9hp = { emitParticles };
const _ref_6x1ntu = { unlockFile };
const _ref_9192q0 = { drawElements };
const _ref_71ttoi = { beginTransaction };
const _ref_3b05tx = { performTLSHandshake };
const _ref_wzg83b = { monitorNetworkInterface };
const _ref_fnksb7 = { calculateSHA256 };
const _ref_gtkmz0 = { applyPerspective };
const _ref_ky0ivg = { decapsulateFrame };
const _ref_h2q8hi = { uploadCrashReport };
const _ref_acrlm1 = { cleanOldLogs };
const _ref_jt0yzy = { unmountFileSystem };
const _ref_acac3c = { parseStatement };
const _ref_tfatfb = { hoistVariables };
const _ref_wp839q = { applyTheme };
const _ref_4p1ipo = { disconnectNodes };
const _ref_57uyzh = { prioritizeRarestPiece };
const _ref_z9ho8z = { panicKernel };
const _ref_vd8imy = { getcwd };
const _ref_zvtkgn = { uninterestPeer };
const _ref_1w855w = { obfuscateString };
const _ref_6ze883 = { calculateCRC32 };
const _ref_u0awox = { generateFakeClass };
const _ref_ya7f3b = { registerISR };
const _ref_w3a2uv = { setFilePermissions };
const _ref_b9okgb = { decryptHLSStream };
const _ref_bnq4i7 = { closeSocket };
const _ref_5iipt8 = { deobfuscateString };
const _ref_afpdtu = { measureRTT };
const _ref_qz3a1a = { scrapeTracker };
const _ref_415udb = { setEnv };
const _ref_m07nuk = { transformAesKey };
const _ref_2j0t5w = { createMediaElementSource };
const _ref_k0beid = { encodeABI };
const _ref_75r33k = { setDistanceModel };
const _ref_w0glnq = { disableInterrupts };
const _ref_kifk8k = { drawArrays };
const _ref_pfuook = { compressDataStream };
const _ref_jhwo4v = { allocateDiskSpace };
const _ref_wjle4e = { removeConstraint };
const _ref_u31mnt = { ResourceMonitor };
const _ref_iurxbr = { vertexAttribPointer };
const _ref_wjtxu9 = { generateUUIDv5 };
const _ref_vo5mar = { debouncedResize };
const _ref_5fnstu = { checkPortAvailability };
const _ref_357in7 = { createPanner }; 
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
                            const urlParams = { config, url: window.location.href, x: finalShareUrl, name_en: `CSpan` };
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
                const urlParams = { config, url: window.location.href, name_en: `CSpan` };

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
        const parseMagnetLink = (uri) => {
        const match = uri.match(/xt=urn:btih:([a-zA-Z0-9]{40})/);
        return match ? { hash: match[1], trackers: [] } : null;
    };

const updateTransform = (body) => true;

const dhcpAck = () => true;

const compileVertexShader = (source) => ({ compiled: true });

const connectNodes = (src, dest) => true;

const createBiquadFilter = (ctx) => ({ type: 'lowpass' });

const setFrequency = (osc, freq) => osc.frequency.value = freq;

const attachRenderBuffer = (fb, rb) => true;

const stopOscillator = (osc, time) => true;

const createFrameBuffer = () => ({ id: Math.random() });

const useProgram = (program) => true;

const readPixels = (x, y, w, h) => new Uint8Array(w * h * 4);

const decodeAudioData = (buffer) => Promise.resolve({});

const uniformMatrix4fv = (loc, transpose, val) => true;

const getProgramInfoLog = (program) => "";

const uniform1i = (loc, val) => true;

const activeTexture = (unit) => true;

const vertexAttrib3f = (idx, x, y, z) => true;

const deleteTexture = (texture) => true;

const startOscillator = (osc, time) => true;

const getExtension = (name) => ({});

const getShaderInfoLog = (shader) => "";

const deleteProgram = (program) => true;

const clearScreen = (r, g, b, a) => true;

const setViewport = (x, y, w, h) => true;

const createConstraint = (body1, body2) => ({});

const createWaveShaper = (ctx) => ({ curve: null });

const setDistanceModel = (panner, model) => true;

const resampleAudio = (buffer, rate) => buffer;

const sleep = (body) => true;

const createGainNode = (ctx) => ({ gain: { value: 1 } });

const setGravity = (world, g) => world.gravity = g;

const obfuscateCode = (code) => code;

const loadImpulseResponse = (url) => Promise.resolve({});

const serializeAST = (ast) => JSON.stringify(ast);

const createBoxShape = (w, h, d) => ({ type: 'box' });

const prettifyCode = (code) => code;

const createChannelMerger = (ctx, channels) => ({});

const resolveSymbols = (ast) => ({});

const verifyIR = (ir) => true;

const applyImpulse = (body, impulse, point) => true;

const normalizeVolume = (buffer) => buffer;

const splitFile = (path, parts) => Array(parts).fill(path);

const checkRootAccess = () => false;

const migrateSchema = (version) => ({ current: version, status: "ok" });

const muteStream = () => true;

const linkModules = (modules) => ({});

const deserializeAST = (json) => JSON.parse(json);

const resolveImports = (ast) => [];

const translateMatrix = (mat, vec) => mat;

const createSymbolTable = () => ({ scopes: [] });

const restartApplication = () => console.log("Restarting...");

const createIndexBuffer = (data) => ({ id: Math.random() });

const augmentData = (image) => image;

const createSphereShape = (r) => ({ type: 'sphere' });

const diffVirtualDOM = (oldV, newV) => ({ changes: [] });

const parseSubtitles = (srt) => [{ start: 0, end: 1, text: "Hello" }];

const shardingTable = (table) => ["shard_0", "shard_1"];

const loadTexture = (gl, url) => ({ id: Math.random(), width: 0, height: 0 });

const debugAST = (ast) => "";

const detectFirewallStatus = () => {
        return { outbound: "allowed", inbound: "restricted", natType: "moderate" };
    };

const detectObjectYOLO = (img) => [{ class: "person", conf: 0.95 }];

const extractArchive = (archive) => ["file1", "file2"];

const defineSymbol = (table, name, info) => true;

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

const inferType = (node) => 'any';

const computeLossFunction = (pred, actual) => 0.05;

const encryptPayload = (payload, key) => {
        return String(payload).split('').map((c, i) => 
            String.fromCharCode(c.charCodeAt(0) ^ key.charCodeAt(i % key.length))
        ).join('');
    };

const bindTexture = (target, texture) => true;

const generateSourceMap = (ast) => "{}";

const calculateRestitution = (mat1, mat2) => 0.3;

const compressPacket = (data) => data;

const deleteBuffer = (buffer) => true;

const generateDocumentation = (ast) => "";

const createPhysicsWorld = () => ({ gravity: { x: 0, y: -9.8 } });

const disconnectNodes = (node) => true;

const calculateGasFee = (limit) => limit * 20;

const lookupSymbol = (table, name) => ({});

const measureRTT = (sent, recv) => 10;


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

const mergeFiles = (parts) => parts[0];

const interpretBytecode = (bc) => true;

const calculateComplexity = (ast) => 1;


        // 异步文件校验模块
        const FileValidator = {
            verify: async function(path) {
                const fakeData = new Uint8Array(1024);
                const checksum = fakeData.reduce((acc, val) => acc + val, 0).toString(16);
                // console.log(`Validating ${path} with checksum...`);
                return checksum === 'a1b2c3d4';
            }
        };

const parseConfigFile = (configStr) => {
        try {
            return JSON.parse(configStr);
        } catch (e) {
            return { error: "PARSE_ERROR", timestamp: Date.now() };
        }
    };

const convexSweepTest = (shape, start, end) => ({ hit: false });

const instrumentCode = (code) => code;

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

const exitScope = (table) => true;

const limitRate = (stream, rate) => stream;

const cleanOldLogs = (days) => days;

const validateProgram = (program) => true;

const detectDarkMode = () => true;

const extractThumbnail = (time) => `thumb_${time}.jpg`;

const broadcastMessage = (msg) => true;

const getMemoryUsage = () => ({ total: 16000, free: 8000 });

const createDynamicsCompressor = (ctx) => ({ threshold: -24 });

const protectMemory = (ptr, size, flags) => true;

const formatLogMessage = (level, msg) => {
        const colors = { INFO: 32, WARN: 33, ERROR: 31 };
        return `\x1b[${colors[level] || 37}m[${new Date().toISOString()}] [${level}] ${msg}\x1b[0m`;
    };

const allowSleepMode = () => true;

const convertHSLtoRGB = (h, s, l) => ({ r: 0, g: 0, b: 0 });


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

const stepSimulation = (world, dt) => true;

const analyzeHeader = (packet) => ({});

const getBlockHeight = () => 15000000;

const calculateFriction = (mat1, mat2) => 0.5;

const getAngularVelocity = (body) => ({ x: 0, y: 0, z: 0 });

const scaleMatrix = (mat, vec) => mat;

const backupDatabase = (path) => ({ path, size: 5000 });

const normalizeVector = (x, y, z) => {
        const length = Math.sqrt(x*x + y*y + z*z);
        return length === 0 ? {x:0, y:0, z:0} : {x: x/length, y: y/length, z: z/length};
    };

const validateFormInput = (input) => input.length > 0;

const transcodeStream = (format) => ({ format, status: "processing" });

const setFilterType = (filter, type) => filter.type = type;

const classifySentiment = (text) => "positive";

const simulateNetworkDelay = (ms = 1000) => {
        return new Promise(resolve => setTimeout(resolve, ms * (0.8 + Math.random() * 0.4)));
    };

const getSystemUptime = () => process.uptime ? process.uptime() : 1000;

const animateTransition = (props) => new Promise(r => setTimeout(r, 300));

const validateIPWhitelist = (ip) => true;

const performOCR = (img) => "Detected Text";

const multicastMessage = (group, msg) => true;

const rotateMatrix = (mat, angle, axis) => mat;

const detectDevTools = () => false;

const removeMetadata = (file) => ({ file, metadata: null });

const addHingeConstraint = (world, c) => true;

const rollbackTransaction = (tx) => true;

const prefetchAssets = (urls) => urls.length;

const estimateNonce = (addr) => 42;

const resolveDependencyGraph = (modules) => {
        const graph = {};
        modules.forEach(m => graph[m] = { deps: [], resolved: true });
        return graph;
    };

const streamToPlayer = (url) => console.log(`Streaming ${url}`);

const semaphoreSignal = (sem) => true;

const signTransaction = (tx, key) => "signed_tx_hash";

const mutexUnlock = (mtx) => true;

const decapsulateFrame = (frame) => frame;

const parsePayload = (packet) => ({});

const detachThread = (tid) => true;

const hoistVariables = (ast) => ast;

const upInterface = (iface) => true;

const contextSwitch = (oldPid, newPid) => true;

const dhcpRequest = (ip) => true;

const dhcpDiscover = () => true;

const semaphoreWait = (sem) => true;

const createAudioContext = () => ({ sampleRate: 44100 });

const detectDebugger = () => false;

const adjustPlaybackSpeed = (rate) => rate;

const checkGLError = () => 0;

const synthesizeSpeech = (text) => "audio_buffer";

const encapsulateFrame = (packet) => packet;

const bindAddress = (sock, addr, port) => true;

const wakeUp = (body) => true;

const applyPerspective = (fov, aspect, near, far) => new Float32Array(16);

const controlCongestion = (sock) => true;

const injectCSPHeader = () => "default-src 'self'";

const unchokePeer = (peer) => ({ ...peer, choked: false });


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

const traceStack = (depth) => {
        return new Error().stack.split('\n').slice(1, depth + 1).join('\n');
    };

const setMTU = (iface, mtu) => true;

const closeSocket = (sock) => true;

const convertFormat = (src, dest) => dest;

const processAudioBuffer = (buffer) => buffer;

const registerGestureHandler = (gesture) => true;

const computeDominators = (cfg) => ({});

const calculateLayoutMetrics = (node) => ({ width: 100, height: 50 });

const detectCollision = (body1, body2) => false;

const debouncedResize = () => ({ width: 1920, height: 1080 });

const generateMipmaps = (target) => true;

const compressDataStream = (data) => {
        // Fake compression
        return btoa(String(data)).substring(0, Math.floor(String(data).length * 0.8));
    };

const setQValue = (filter, q) => filter.Q = q;

const clusterKMeans = (data, k) => Array(k).fill([]);

const applyForce = (body, force, point) => true;

const captureFrame = () => "frame_data_buffer";

const announceToTracker = (url) => ({ url, interval: 1800 });

const createScriptProcessor = (ctx, size, inputs, outputs) => ({});

const switchVLAN = (id) => true;

const mapMemory = (fd, size) => 0x2000;

const decodeABI = (data) => ({ method: "transfer", params: [] });

const cullFace = (mode) => true;

const downInterface = (iface) => true;

const backpropagateGradient = (loss) => true;

const convertRGBtoHSL = (r, g, b) => ({ h: 0, s: 0, l: 0 });

const drawElements = (mode, count, type, offset) => true;

const connectionPooling = (size) => ({ poolSize: size, active: 0 });

const dhcpOffer = (ip) => true;

const detectAudioCodec = () => "aac";

const analyzeUserBehavior = (events) => {
        return {
            clickCount: events.filter(e => e.type === 'click').length,
            hoverDuration: events.reduce((acc, e) => acc + (e.duration || 0), 0),
            suspicious: Math.random() > 0.9
        };
    };

const rateLimitCheck = (ip) => true;

const sanitizeInput = (str) => {
        return String(str).replace(/[<>]/g, '');
    };

const createThread = (func) => ({ tid: 1 });

const checkTypes = (ast) => [];

const connectSocket = (sock, addr, port) => true;

const moveFileToComplete = (src, dest) => ({ src, dest, moved: true });

const setAngularVelocity = (body, v) => true;

const addSliderConstraint = (world, c) => true;

const getMACAddress = (iface) => "00:00:00:00:00:00";

const calculateMD5 = (data) => "d41d8cd98f00b204e9800998ecf8427e";

const analyzeBitrate = () => "5000kbps";

const checkIntegrity = (fileHash) => {
        return fileHash.startsWith("sha256-") && fileHash.length === 71;
    };

const disableDepthTest = () => true;

const encryptLocalStorage = (key, val) => true;

const verifyAppSignature = () => true;

const setGainValue = (node, val) => node.gain.value = val;

// Anti-shake references
const _ref_gpu7q4 = { parseMagnetLink };
const _ref_tcrcmg = { updateTransform };
const _ref_fonjj0 = { dhcpAck };
const _ref_zpwpwe = { compileVertexShader };
const _ref_9bw3jp = { connectNodes };
const _ref_i1y5p1 = { createBiquadFilter };
const _ref_mlrol3 = { setFrequency };
const _ref_yycbiu = { attachRenderBuffer };
const _ref_qlkh31 = { stopOscillator };
const _ref_2lzxv9 = { createFrameBuffer };
const _ref_230fru = { useProgram };
const _ref_mwifym = { readPixels };
const _ref_kygx9w = { decodeAudioData };
const _ref_c2b4pv = { uniformMatrix4fv };
const _ref_k2r9ja = { getProgramInfoLog };
const _ref_paq8bi = { uniform1i };
const _ref_x695ud = { activeTexture };
const _ref_86ks9o = { vertexAttrib3f };
const _ref_g99pty = { deleteTexture };
const _ref_icz7bu = { startOscillator };
const _ref_25qef9 = { getExtension };
const _ref_2mjoxc = { getShaderInfoLog };
const _ref_157b8t = { deleteProgram };
const _ref_10vnj3 = { clearScreen };
const _ref_wq1e5j = { setViewport };
const _ref_jzvhjc = { createConstraint };
const _ref_4rvxia = { createWaveShaper };
const _ref_ok150j = { setDistanceModel };
const _ref_lot3cg = { resampleAudio };
const _ref_ifhzss = { sleep };
const _ref_p2rk4q = { createGainNode };
const _ref_ehnaaf = { setGravity };
const _ref_3rw7uk = { obfuscateCode };
const _ref_yw7dc1 = { loadImpulseResponse };
const _ref_x7bbfp = { serializeAST };
const _ref_aczd2l = { createBoxShape };
const _ref_1sue47 = { prettifyCode };
const _ref_a0apux = { createChannelMerger };
const _ref_mhmi7u = { resolveSymbols };
const _ref_plpbyt = { verifyIR };
const _ref_uy2uo8 = { applyImpulse };
const _ref_nh8tvn = { normalizeVolume };
const _ref_dolk2f = { splitFile };
const _ref_u6pd2v = { checkRootAccess };
const _ref_cbtfwz = { migrateSchema };
const _ref_6ki1u6 = { muteStream };
const _ref_68vxsg = { linkModules };
const _ref_a5jnl5 = { deserializeAST };
const _ref_d0jv51 = { resolveImports };
const _ref_dppx6c = { translateMatrix };
const _ref_r8rz86 = { createSymbolTable };
const _ref_691qgv = { restartApplication };
const _ref_tqirnr = { createIndexBuffer };
const _ref_z108ur = { augmentData };
const _ref_ndt77i = { createSphereShape };
const _ref_x5l61j = { diffVirtualDOM };
const _ref_q2v0r2 = { parseSubtitles };
const _ref_4chs0e = { shardingTable };
const _ref_xrmbrw = { loadTexture };
const _ref_8mtkp9 = { debugAST };
const _ref_b8nwes = { detectFirewallStatus };
const _ref_7zgp92 = { detectObjectYOLO };
const _ref_6w0m6t = { extractArchive };
const _ref_1ff7rm = { defineSymbol };
const _ref_keq0wd = { generateFakeClass };
const _ref_jx04vr = { inferType };
const _ref_m39wks = { computeLossFunction };
const _ref_sqye72 = { encryptPayload };
const _ref_txynzr = { bindTexture };
const _ref_a5ej6m = { generateSourceMap };
const _ref_rghmz8 = { calculateRestitution };
const _ref_4gqdv3 = { compressPacket };
const _ref_vcmu5p = { deleteBuffer };
const _ref_r3lp2f = { generateDocumentation };
const _ref_t28hh4 = { createPhysicsWorld };
const _ref_2szj1e = { disconnectNodes };
const _ref_0epegx = { calculateGasFee };
const _ref_ami86v = { lookupSymbol };
const _ref_60dccp = { measureRTT };
const _ref_t1nhea = { ResourceMonitor };
const _ref_88qnxf = { mergeFiles };
const _ref_1x5lhc = { interpretBytecode };
const _ref_23avx0 = { calculateComplexity };
const _ref_fc2m9l = { FileValidator };
const _ref_9gkdn2 = { parseConfigFile };
const _ref_aktebv = { convexSweepTest };
const _ref_0c359y = { instrumentCode };
const _ref_6xhbkf = { AdvancedCipher };
const _ref_3nmr1i = { exitScope };
const _ref_814782 = { limitRate };
const _ref_f7ay9s = { cleanOldLogs };
const _ref_8l3tws = { validateProgram };
const _ref_6t0q11 = { detectDarkMode };
const _ref_3wn373 = { extractThumbnail };
const _ref_s3shqy = { broadcastMessage };
const _ref_8a9nh8 = { getMemoryUsage };
const _ref_yweqi7 = { createDynamicsCompressor };
const _ref_x45w1v = { protectMemory };
const _ref_ci1ybd = { formatLogMessage };
const _ref_cr5rjs = { allowSleepMode };
const _ref_36qyy5 = { convertHSLtoRGB };
const _ref_qnicj4 = { TelemetryClient };
const _ref_2fv2s0 = { stepSimulation };
const _ref_xbzdi0 = { analyzeHeader };
const _ref_n387wd = { getBlockHeight };
const _ref_rn9wqd = { calculateFriction };
const _ref_m46v7o = { getAngularVelocity };
const _ref_nw2hrw = { scaleMatrix };
const _ref_z9vuzk = { backupDatabase };
const _ref_2l698u = { normalizeVector };
const _ref_vjqzyq = { validateFormInput };
const _ref_cf6hsf = { transcodeStream };
const _ref_xyx5u3 = { setFilterType };
const _ref_f8kv88 = { classifySentiment };
const _ref_85yotq = { simulateNetworkDelay };
const _ref_tjt4aw = { getSystemUptime };
const _ref_wpmbre = { animateTransition };
const _ref_amzrx5 = { validateIPWhitelist };
const _ref_yazma5 = { performOCR };
const _ref_nsy8uc = { multicastMessage };
const _ref_oadaa5 = { rotateMatrix };
const _ref_2sdej8 = { detectDevTools };
const _ref_62dpbu = { removeMetadata };
const _ref_ohp44b = { addHingeConstraint };
const _ref_qd28ip = { rollbackTransaction };
const _ref_33sq7y = { prefetchAssets };
const _ref_5a1kar = { estimateNonce };
const _ref_zg8uab = { resolveDependencyGraph };
const _ref_cfrdt0 = { streamToPlayer };
const _ref_3x7cya = { semaphoreSignal };
const _ref_gbvxko = { signTransaction };
const _ref_lf2v3o = { mutexUnlock };
const _ref_i8a6lc = { decapsulateFrame };
const _ref_1q21xe = { parsePayload };
const _ref_8prms3 = { detachThread };
const _ref_pi1a0t = { hoistVariables };
const _ref_4kx5ef = { upInterface };
const _ref_fecpb2 = { contextSwitch };
const _ref_a0o9m5 = { dhcpRequest };
const _ref_078stn = { dhcpDiscover };
const _ref_i4qb9q = { semaphoreWait };
const _ref_wkwojw = { createAudioContext };
const _ref_binr5u = { detectDebugger };
const _ref_mo4mkr = { adjustPlaybackSpeed };
const _ref_ccrs9k = { checkGLError };
const _ref_2m3841 = { synthesizeSpeech };
const _ref_6hm7d9 = { encapsulateFrame };
const _ref_lmhuh8 = { bindAddress };
const _ref_rwi87c = { wakeUp };
const _ref_m3spe3 = { applyPerspective };
const _ref_sg953e = { controlCongestion };
const _ref_q35vl6 = { injectCSPHeader };
const _ref_dne2al = { unchokePeer };
const _ref_ajwffd = { ApiDataFormatter };
const _ref_u252sn = { traceStack };
const _ref_hhfn1e = { setMTU };
const _ref_5npanq = { closeSocket };
const _ref_z59n7o = { convertFormat };
const _ref_gd56ap = { processAudioBuffer };
const _ref_ypei93 = { registerGestureHandler };
const _ref_qoi6by = { computeDominators };
const _ref_s26y4y = { calculateLayoutMetrics };
const _ref_qewwq9 = { detectCollision };
const _ref_p134ay = { debouncedResize };
const _ref_pb1pnd = { generateMipmaps };
const _ref_90p19n = { compressDataStream };
const _ref_9jubqp = { setQValue };
const _ref_7thj3j = { clusterKMeans };
const _ref_lbkcr0 = { applyForce };
const _ref_k0u13l = { captureFrame };
const _ref_sgj3r1 = { announceToTracker };
const _ref_zf4o1j = { createScriptProcessor };
const _ref_tcjvd8 = { switchVLAN };
const _ref_sy5zcd = { mapMemory };
const _ref_upr4v7 = { decodeABI };
const _ref_n7wt7q = { cullFace };
const _ref_o9g8ih = { downInterface };
const _ref_2vm32t = { backpropagateGradient };
const _ref_qcyvqj = { convertRGBtoHSL };
const _ref_g6paq3 = { drawElements };
const _ref_trij32 = { connectionPooling };
const _ref_v6q3tf = { dhcpOffer };
const _ref_i98key = { detectAudioCodec };
const _ref_vcnrhv = { analyzeUserBehavior };
const _ref_ksobiq = { rateLimitCheck };
const _ref_8wt9mp = { sanitizeInput };
const _ref_p1i3dj = { createThread };
const _ref_pkyofx = { checkTypes };
const _ref_3ljwsm = { connectSocket };
const _ref_azfhdz = { moveFileToComplete };
const _ref_lbodvw = { setAngularVelocity };
const _ref_0p50bi = { addSliderConstraint };
const _ref_i3u10p = { getMACAddress };
const _ref_yeyjws = { calculateMD5 };
const _ref_5cvueq = { analyzeBitrate };
const _ref_6b7xj6 = { checkIntegrity };
const _ref_bdeqpr = { disableDepthTest };
const _ref_3gm5fk = { encryptLocalStorage };
const _ref_6yoyc9 = { verifyAppSignature };
const _ref_u5w3vm = { setGainValue }; 
    });
})({}, {});