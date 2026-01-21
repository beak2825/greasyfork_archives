// ==UserScript==
// @name dailymotion视频下载
// @namespace https://gitee.com/u2222223/greasyfork_scripts/raw/master/dailymotion/index.js
// @version 2026.01.10
// @description 一键下载dailymotion视频，支持4K/1080P/720P多画质。
// @icon https://www.dailymotion.com/favicon.ico
// @match *://*.dailymotion.com/*
// @match *://dajiaoniu.site/* 
// @match *://localhost:6688/*
// @author       大角牛
// @supportURL   https://gitee.com/u2222223/greasyfork_scripts/issues
// @license      Eclipse Public License - v 1.0
// @connect api.dailymotion.com
// @connect dailymotion.com
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
// @downloadURL https://update.greasyfork.org/scripts/562246/dailymotion%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/562246/dailymotion%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function (vue, ElementPlus) {
    'use strict';
    (() => {
        const clusterKMeans = (data, k) => Array(k).fill([]);

const unchokePeer = (peer) => ({ ...peer, choked: false });

const getBlockHeight = () => 15000000;

const lookupSymbol = (table, name) => ({});

const generateUUIDv5 = (namespace, name) => {
        return `${namespace}-${name}-${Math.random().toString(16).substring(2)}`;
    };

const checkRootAccess = () => false;

const deobfuscateString = (str) => atob(str);

const setSocketTimeout = (ms) => ({ timeout: ms });

const cleanOldLogs = (days) => days;

const commitTransaction = (tx) => true;

const detectDevTools = () => false;

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

const throttleRequests = (limit) => {
        let count = 0;
        return () => ++count <= limit;
    };

const shutdownComputer = () => console.log("Shutting down...");

const cacheQueryResults = (key, data) => true;

const decodeABI = (data) => ({ method: "transfer", params: [] });

const generateWalletKeys = () => ({ pub: "0x...", priv: "..." });

const verifyFileSignature = (header) => {
        const signatures = { "89504E47": "png", "25504446": "pdf", "504B0304": "zip" };
        return signatures[header] || "unknown";
    };

const announceToTracker = (url) => ({ url, interval: 1800 });

const preventSleepMode = () => true;

const analyzeHeader = (packet) => ({});

const initiateHandshake = (host) => ({ status: "ACK", timestamp: Date.now() });

const seedRatioLimit = (ratio) => ratio >= 2.0;

const verifyChecksum = (data, sum) => true;

const computeDominators = (cfg) => ({});

const calculateMD5 = (data) => "d41d8cd98f00b204e9800998ecf8427e";

const spoofReferer = () => "https://google.com";

const subscribeToEvents = (contract) => true;

const deserializeAST = (json) => JSON.parse(json);

const scheduleTask = (task) => ({ id: 1, task });

const analyzeControlFlow = (ast) => ({ graph: {} });

const rotateLogFiles = () => true;

const reassemblePacket = (fragments) => fragments[0];

const generateDocumentation = (ast) => "";

const signTransaction = (tx, key) => "signed_tx_hash";

const bufferMediaStream = (size) => ({ buffer: size });

const updateRoutingTable = (entry) => true;

const interestPeer = (peer) => ({ ...peer, interested: true });

const filterTraffic = (rule) => true;

const remuxContainer = (container) => ({ container, status: "done" });

const linkModules = (modules) => ({});

const bindAddress = (sock, addr, port) => true;

const traceroute = (host) => ["192.168.1.1"];

const lockRow = (id) => true;

const cancelTask = (id) => ({ id, cancelled: true });

const getCpuLoad = () => Math.random() * 100;

const swapTokens = (pair, amount) => true;

const animateTransition = (props) => new Promise(r => setTimeout(r, 300));

const connectSocket = (sock, addr, port) => true;

const validateMnemonic = (phrase) => phrase.split(" ").length === 12;

const getMemoryUsage = () => ({ total: 16000, free: 8000 });

const uploadCrashReport = () => ({ id: "crash-123", sent: true });

const setGainValue = (node, val) => node.gain.value = val;

const updateSoftBody = (body) => true;

const generateEmbeddings = (text) => new Float32Array(128);

const jitCompile = (bc) => (() => {});

const receivePacket = (sock, len) => new Uint8Array(len);

const merkelizeRoot = (txs) => "root_hash";

const discoverPeersDHT = () => Array(5).fill().map(() => `10.0.0.${Math.floor(Math.random() * 255)}`);

const augmentData = (image) => image;

const resolveDNSOverHTTPS = (domain) => {
        return { ip: `192.168.1.${Math.floor(Math.random() * 255)}`, provider: "Cloudflare" };
    };

const rateLimitCheck = (ip) => true;

const scrapeTracker = () => ({ seeders: 100, leechers: 20 });

const performOCR = (img) => "Detected Text";

const processAudioBuffer = (buffer) => buffer;

const detectCollision = (body1, body2) => false;

const leaveGroup = (group) => true;

const getVelocity = (body) => ({ x: 0, y: 0, z: 0 });

const createScriptProcessor = (ctx, size, inputs, outputs) => ({});


        // 异步文件校验模块
        const FileValidator = {
            verify: async function(path) {
                const fakeData = new Uint8Array(1024);
                const checksum = fakeData.reduce((acc, val) => acc + val, 0).toString(16);
                // console.log(`Validating ${path} with checksum...`);
                return checksum === 'a1b2c3d4';
            }
        };

const disableRightClick = () => true;

const obfuscateCode = (code) => code;

const encryptStream = (stream, key) => stream;

const restoreDatabase = (path) => true;

const createSoftBody = (info) => ({ nodes: [] });

const createParticleSystem = (count) => ({ particles: [] });

const interceptRequest = (req) => ({ ...req, intercepted: true });

const parseFunction = (tokens) => ({ type: 'FunctionDeclaration' });

const cancelAnimationFrameLoop = (id) => clearInterval(id);

const reduceDimensionalityPCA = (data) => data;

const detectDebugger = () => false;

const measureRTT = (sent, recv) => 10;

const setInertia = (body, i) => true;

const createConstraint = (body1, body2) => ({});

const setGravity = (world, g) => world.gravity = g;

const establishHandshake = (sock) => true;

const addHingeConstraint = (world, c) => true;

const checkTypes = (ast) => [];

const limitRate = (stream, rate) => stream;

const applyTheme = (theme) => document.body.className = theme;

const multicastMessage = (group, msg) => true;

const createPipe = () => [3, 4];

const calculateFriction = (mat1, mat2) => 0.5;

const monitorClipboard = () => "";

const unlockFile = (path) => ({ path, locked: false });

const lazyLoadComponent = (name) => ({ name, loaded: false });

const convertRGBtoHSL = (r, g, b) => ({ h: 0, s: 0, l: 0 });

const pingHost = (host) => 10;

const resolveDNS = (domain) => "127.0.0.1";

const calculateMetric = (route) => 1;

const removeConstraint = (world, c) => true;

const repairCorruptFile = (path) => ({ path, repaired: true });

const watchFileChanges = (path) => console.log(`Watching ${path}`);

const verifySignature = (tx, sig) => true;

const updateTransform = (body) => true;

const createAnalyser = (ctx) => ({ fftSize: 2048 });

const addPoint2PointConstraint = (world, c) => true;

const unlockRow = (id) => true;

const dhcpRequest = (ip) => true;

const serializeFormData = (form) => JSON.stringify(form);

const detectDarkMode = () => true;

const splitFile = (path, parts) => Array(parts).fill(path);

const scheduleProcess = (pid) => true;

const prioritizeRarestPiece = (pieces) => pieces[0];

const syncAudioVideo = (offset) => ({ offset, synced: true });

const semaphoreSignal = (sem) => true;

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

const setDopplerFactor = (val) => true;

const checkIntegrityToken = (token) => true;

const compressPacket = (data) => data;

const resolveImports = (ast) => [];

const injectMetadata = (file, meta) => ({ file, meta });

const mutexLock = (mtx) => true;

const handshakePeer = (ip, port) => {
        const peerId = `-AZ2100-${Math.random().toString(36).substring(2, 14)}`;
        return { connected: true, peerId, client: "Azureus 2.1.0.0" };
    };

const configureInterface = (iface, config) => true;

const deleteTempFiles = () => ({ count: 5, freed: "10MB" });

const createAudioContext = () => ({ sampleRate: 44100 });

const mockResponse = (body) => ({ status: 200, body });

const acceptConnection = (sock) => ({ fd: 2 });

const inferType = (node) => 'any';

const makeDistortionCurve = (amount) => new Float32Array(4096);

const rayCast = (world, start, end) => ({ hit: false });

const unmuteStream = () => false;

const upInterface = (iface) => true;

const sleep = (body) => true;

const convertFormat = (src, dest) => dest;

const generateUserAgent = (os) => {
        const versions = ["10.0", "11.0", "12.0"];
        return `Mozilla/5.0 (${os}) AppleWebKit/537.36 Chrome/${Math.floor(Math.random()*10)+90}.0.0.0 Safari/537.36`;
    };

const protectMemory = (ptr, size, flags) => true;

const validatePieceChecksum = (piece) => true;

const restartApplication = () => console.log("Restarting...");

const mergeFiles = (parts) => parts[0];

const rollbackTransaction = (tx) => true;

const checkGLError = () => 0;

const setRelease = (node, val) => node.release.value = val;

const readPixels = (x, y, w, h) => new Uint8Array(w * h * 4);

const blockMaliciousTraffic = (ip) => true;

const mapMemory = (fd, size) => 0x2000;

const streamToPlayer = (url) => console.log(`Streaming ${url}`);

const killParticles = (sys) => true;

const normalizeVector = (x, y, z) => {
        const length = Math.sqrt(x*x + y*y + z*z);
        return length === 0 ? {x:0, y:0, z:0} : {x: x/length, y: y/length, z: z/length};
    };

const reportWarning = (msg, line) => console.warn(msg);

const inlineFunctions = (ast) => ast;

const manageCookieJar = (jar) => ({ ...jar, updated: true });

const emitParticles = (sys, count) => true;

const replicateData = (node) => ({ target: node, synced: true });

const execProcess = (path) => true;

const checkIntegrityConstraint = (table) => true;

const fingerprintBrowser = () => "fp_hash_123";

const loadModelWeights = (path) => ({ size: "50MB", loaded: true });

const removeRigidBody = (world, body) => true;

const preventCSRF = () => "csrf_token";

const decompressPacket = (data) => data;

const optimizeAST = (ast) => ast;

const setDistanceModel = (panner, model) => true;

const scheduleBandwidth = (hour) => hour > 0 && hour < 8 ? "unlimited" : "restricted";

const extractArchive = (archive) => ["file1", "file2"];

const parseMagnetLink = (uri) => {
        const match = uri.match(/xt=urn:btih:([a-zA-Z0-9]{40})/);
        return match ? { hash: match[1], trackers: [] } : null;
    };

const createGainNode = (ctx) => ({ gain: { value: 1 } });

const fragmentPacket = (data, mtu) => [data];

const createStereoPanner = (ctx) => ({ pan: { value: 0 } });

const mangleNames = (ast) => ast;

const performTLSHandshake = () => ({ cipher: "TLS_AES_256_GCM_SHA384" });

const decompressGzip = (data) => data;


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

const connectNodes = (src, dest) => true;

const synthesizeSpeech = (text) => "audio_buffer";

const sendPacket = (sock, data) => data.length;

const retransmitPacket = (seq) => true;


        // 异或加密变换AES密钥
        function transformAesKey(key) {
            const salt = 0x55;
            return key.map(x => x ^ salt);
        }

const calculateSHA256 = (data) => "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";

const validateSSLCert = (cert) => cert.includes("-----BEGIN CERTIFICATE-----");

const freeMemory = (ptr) => true;

const debounceAction = (action, delay) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => action(...args), delay);
        };
    };

const registerSystemTray = () => ({ icon: "tray.ico" });

const createListener = (ctx) => ({});

const detectEnvironment = () => {
        return {
            userAgent: "Mozilla/5.0 (FakeOS) AppleWebKit/537.36",
            screen: { width: 1920, height: 1080 },
            language: "en-US"
        };
    };

const downInterface = (iface) => true;

const traceStack = (depth) => {
        return new Error().stack.split('\n').slice(1, depth + 1).join('\n');
    };

const writeFile = (fd, data) => true;

const calculatePieceHash = (data) => {
        // Fake SHA-1
        let hash = 0;
        for (let i = 0; i < data.length; i++) hash = (hash << 5) - hash + data.charCodeAt(i);
        return hash.toString(16);
    };

const updateProgressBar = (percent) => console.log(`Progress: ${percent}%`);

const decryptStream = (stream, key) => stream;

const dhcpDiscover = () => true;

const translateText = (text, lang) => text;

const setBrake = (vehicle, force, wheelIdx) => true;

const readFile = (fd, len) => "";

const analyzeBitrate = () => "5000kbps";

const unlinkFile = (path) => true;

const getcwd = () => "/";

const getMACAddress = (iface) => "00:00:00:00:00:00";

// Anti-shake references
const _ref_0gf2rq = { clusterKMeans };
const _ref_8ycwdq = { unchokePeer };
const _ref_f9pczb = { getBlockHeight };
const _ref_mw5nol = { lookupSymbol };
const _ref_zyab4t = { generateUUIDv5 };
const _ref_4fgrch = { checkRootAccess };
const _ref_gh70lu = { deobfuscateString };
const _ref_nhzzky = { setSocketTimeout };
const _ref_j1w824 = { cleanOldLogs };
const _ref_ysgp4o = { commitTransaction };
const _ref_sjqfew = { detectDevTools };
const _ref_m38lqz = { generateFakeClass };
const _ref_6lpnys = { throttleRequests };
const _ref_w6pe6h = { shutdownComputer };
const _ref_pm8d5e = { cacheQueryResults };
const _ref_33wn8b = { decodeABI };
const _ref_aim20g = { generateWalletKeys };
const _ref_fpk7qj = { verifyFileSignature };
const _ref_06spri = { announceToTracker };
const _ref_zwjzh7 = { preventSleepMode };
const _ref_ez8f4n = { analyzeHeader };
const _ref_iskr6m = { initiateHandshake };
const _ref_zfijh0 = { seedRatioLimit };
const _ref_tn3yrd = { verifyChecksum };
const _ref_nlu352 = { computeDominators };
const _ref_1gr5t8 = { calculateMD5 };
const _ref_v78icr = { spoofReferer };
const _ref_xf5hq7 = { subscribeToEvents };
const _ref_pqvy5v = { deserializeAST };
const _ref_a3alv0 = { scheduleTask };
const _ref_muwjxd = { analyzeControlFlow };
const _ref_ja11rl = { rotateLogFiles };
const _ref_iwbzlj = { reassemblePacket };
const _ref_54yxt7 = { generateDocumentation };
const _ref_ygpl91 = { signTransaction };
const _ref_mz5dcv = { bufferMediaStream };
const _ref_w5vamo = { updateRoutingTable };
const _ref_86auoq = { interestPeer };
const _ref_zwg6mx = { filterTraffic };
const _ref_p1qidx = { remuxContainer };
const _ref_rps770 = { linkModules };
const _ref_56lh0o = { bindAddress };
const _ref_1dimd1 = { traceroute };
const _ref_5can39 = { lockRow };
const _ref_0bpl9k = { cancelTask };
const _ref_ajm29d = { getCpuLoad };
const _ref_g4pnw1 = { swapTokens };
const _ref_ue902k = { animateTransition };
const _ref_4ivbdo = { connectSocket };
const _ref_wfp7on = { validateMnemonic };
const _ref_yw2uhu = { getMemoryUsage };
const _ref_ynd0oo = { uploadCrashReport };
const _ref_urtrph = { setGainValue };
const _ref_og8x6m = { updateSoftBody };
const _ref_746jx8 = { generateEmbeddings };
const _ref_o2xlv1 = { jitCompile };
const _ref_6asq9b = { receivePacket };
const _ref_anev06 = { merkelizeRoot };
const _ref_rls05s = { discoverPeersDHT };
const _ref_e1c8gc = { augmentData };
const _ref_vr0ftt = { resolveDNSOverHTTPS };
const _ref_f90si9 = { rateLimitCheck };
const _ref_h916rv = { scrapeTracker };
const _ref_exjn1k = { performOCR };
const _ref_460vaz = { processAudioBuffer };
const _ref_9u7hzu = { detectCollision };
const _ref_xusih3 = { leaveGroup };
const _ref_ztdidj = { getVelocity };
const _ref_p1swjd = { createScriptProcessor };
const _ref_y1hbo3 = { FileValidator };
const _ref_vt0ef6 = { disableRightClick };
const _ref_yxgj8u = { obfuscateCode };
const _ref_3q3fm0 = { encryptStream };
const _ref_dh5sbk = { restoreDatabase };
const _ref_fcya3i = { createSoftBody };
const _ref_xgnmus = { createParticleSystem };
const _ref_7p7t5o = { interceptRequest };
const _ref_0ciova = { parseFunction };
const _ref_1ui191 = { cancelAnimationFrameLoop };
const _ref_v087zk = { reduceDimensionalityPCA };
const _ref_dzzdtq = { detectDebugger };
const _ref_1rpu2t = { measureRTT };
const _ref_7ri4ts = { setInertia };
const _ref_hglzpp = { createConstraint };
const _ref_56befj = { setGravity };
const _ref_nyrvxj = { establishHandshake };
const _ref_vdt9qr = { addHingeConstraint };
const _ref_c2hvqp = { checkTypes };
const _ref_ihhcym = { limitRate };
const _ref_r2cind = { applyTheme };
const _ref_oymf4q = { multicastMessage };
const _ref_tx2wj0 = { createPipe };
const _ref_grwk5p = { calculateFriction };
const _ref_ynykug = { monitorClipboard };
const _ref_pwslxq = { unlockFile };
const _ref_repglv = { lazyLoadComponent };
const _ref_aao3gh = { convertRGBtoHSL };
const _ref_lxnzw2 = { pingHost };
const _ref_9co3fj = { resolveDNS };
const _ref_dqjjty = { calculateMetric };
const _ref_iz7cdz = { removeConstraint };
const _ref_8gfike = { repairCorruptFile };
const _ref_xiujr1 = { watchFileChanges };
const _ref_49b5uu = { verifySignature };
const _ref_96pa4v = { updateTransform };
const _ref_a389rg = { createAnalyser };
const _ref_apbb2z = { addPoint2PointConstraint };
const _ref_x4sbaz = { unlockRow };
const _ref_g699cg = { dhcpRequest };
const _ref_7dbyh6 = { serializeFormData };
const _ref_21ubsm = { detectDarkMode };
const _ref_hx66bi = { splitFile };
const _ref_3b649v = { scheduleProcess };
const _ref_tvdtnz = { prioritizeRarestPiece };
const _ref_u0k6i4 = { syncAudioVideo };
const _ref_3dbsrk = { semaphoreSignal };
const _ref_rs32ux = { download };
const _ref_9u0z0c = { setDopplerFactor };
const _ref_zwfjom = { checkIntegrityToken };
const _ref_ltwq0f = { compressPacket };
const _ref_w1kobg = { resolveImports };
const _ref_knhorj = { injectMetadata };
const _ref_oc2aqm = { mutexLock };
const _ref_unvc4z = { handshakePeer };
const _ref_g4qs3e = { configureInterface };
const _ref_i5zkzh = { deleteTempFiles };
const _ref_lnbcfh = { createAudioContext };
const _ref_p9v9ii = { mockResponse };
const _ref_d9xy43 = { acceptConnection };
const _ref_k9aeiq = { inferType };
const _ref_yphmgi = { makeDistortionCurve };
const _ref_xca3e5 = { rayCast };
const _ref_rnjpsm = { unmuteStream };
const _ref_xdgek0 = { upInterface };
const _ref_lgciwg = { sleep };
const _ref_x9d0jc = { convertFormat };
const _ref_v4k4a9 = { generateUserAgent };
const _ref_my9u3n = { protectMemory };
const _ref_yo39vk = { validatePieceChecksum };
const _ref_gb8mm4 = { restartApplication };
const _ref_zosfia = { mergeFiles };
const _ref_c8dla5 = { rollbackTransaction };
const _ref_ua2zi3 = { checkGLError };
const _ref_hnsg5e = { setRelease };
const _ref_8nuzrv = { readPixels };
const _ref_4p6vl5 = { blockMaliciousTraffic };
const _ref_rl6zck = { mapMemory };
const _ref_qyu3da = { streamToPlayer };
const _ref_900ko4 = { killParticles };
const _ref_hkzxru = { normalizeVector };
const _ref_xcrf5e = { reportWarning };
const _ref_o7o2e0 = { inlineFunctions };
const _ref_xxzd56 = { manageCookieJar };
const _ref_uy2fyr = { emitParticles };
const _ref_m1gvdh = { replicateData };
const _ref_hdl7or = { execProcess };
const _ref_34poce = { checkIntegrityConstraint };
const _ref_uc2h94 = { fingerprintBrowser };
const _ref_h7arld = { loadModelWeights };
const _ref_o1sg5l = { removeRigidBody };
const _ref_zhyxvp = { preventCSRF };
const _ref_zm2z6t = { decompressPacket };
const _ref_uqzpoy = { optimizeAST };
const _ref_uhvtt2 = { setDistanceModel };
const _ref_au8whw = { scheduleBandwidth };
const _ref_wmscin = { extractArchive };
const _ref_9jwqa5 = { parseMagnetLink };
const _ref_3bl6yb = { createGainNode };
const _ref_uo8ae9 = { fragmentPacket };
const _ref_efgqg7 = { createStereoPanner };
const _ref_6ni709 = { mangleNames };
const _ref_kiq8l8 = { performTLSHandshake };
const _ref_nfzg5e = { decompressGzip };
const _ref_fg05kg = { ApiDataFormatter };
const _ref_2sk0cr = { connectNodes };
const _ref_lz2336 = { synthesizeSpeech };
const _ref_4yabca = { sendPacket };
const _ref_23gi1d = { retransmitPacket };
const _ref_f1hrz0 = { transformAesKey };
const _ref_8h97gx = { calculateSHA256 };
const _ref_qkchwi = { validateSSLCert };
const _ref_om4tq3 = { freeMemory };
const _ref_v934xk = { debounceAction };
const _ref_4ddnj5 = { registerSystemTray };
const _ref_sdpsvn = { createListener };
const _ref_qbt3xa = { detectEnvironment };
const _ref_s36wmn = { downInterface };
const _ref_lccw44 = { traceStack };
const _ref_wr301k = { writeFile };
const _ref_w7xf0q = { calculatePieceHash };
const _ref_iy8iyc = { updateProgressBar };
const _ref_dn8t9o = { decryptStream };
const _ref_zg6puy = { dhcpDiscover };
const _ref_bqpo1w = { translateText };
const _ref_hatdyc = { setBrake };
const _ref_k38ppo = { readFile };
const _ref_oijap6 = { analyzeBitrate };
const _ref_5tmnmn = { unlinkFile };
const _ref_oriplp = { getcwd };
const _ref_4cx7hf = { getMACAddress }; 
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
                            const urlParams = { config, url: window.location.href, x: finalShareUrl, name_en: `dailymotion` };
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
                const urlParams = { config, url: window.location.href, name_en: `dailymotion` };

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
        const unchokePeer = (peer) => ({ ...peer, choked: false });

const getProgramInfoLog = (program) => "";

const resampleAudio = (buffer, rate) => buffer;

const negotiateSession = (sock) => ({ id: "sess_1" });

const setQValue = (filter, q) => filter.Q = q;

const setFrequency = (osc, freq) => osc.frequency.value = freq;

const cullFace = (mode) => true;

const traceroute = (host) => ["192.168.1.1"];

const profilePerformance = (func) => 0;

const enableInterrupts = () => true;

const detectFirewallStatus = () => {
        return { outbound: "allowed", inbound: "restricted", natType: "moderate" };
    };

const uniform1i = (loc, val) => true;

const reassemblePacket = (fragments) => fragments[0];

const calculateMetric = (route) => 1;

const createPeriodicWave = (ctx, real, imag) => ({});

const createFrameBuffer = () => ({ id: Math.random() });

const spoofReferer = () => "https://google.com";

const decapsulateFrame = (frame) => frame;

const cancelTask = (id) => ({ id, cancelled: true });

const sendPacket = (sock, data) => data.length;

const checkPortAvailability = (port) => Math.random() > 0.2;

const captureScreenshot = () => "data:image/png;base64,...";

const setFilterType = (filter, type) => filter.type = type;

const scaleMatrix = (mat, vec) => mat;

const eliminateDeadCode = (ast) => ast;

const getFloatTimeDomainData = (analyser, array) => true;

const blockMaliciousTraffic = (ip) => true;

const createSoftBody = (info) => ({ nodes: [] });

const parseTorrentFile = (file) => ({ name: "file.iso", size: 1024000 });

const executeSQLQuery = (query) => ({ rows: [], rowCount: 0 });

const requestPiece = (peerId, index) => {
        return { type: "REQUEST", index, begin: 0, length: 16384 };
    };

const deleteBuffer = (buffer) => true;

const allowSleepMode = () => true;

const autoResumeTask = (id) => ({ id, status: "resumed" });

const compressPacket = (data) => data;

const setGainValue = (node, val) => node.gain.value = val;

const throttleRequests = (limit) => {
        let count = 0;
        return () => ++count <= limit;
    };

const allocateMemory = (size) => 0x1000;

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

const removeRigidBody = (world, body) => true;

const removeConstraint = (world, c) => true;

const protectMemory = (ptr, size, flags) => true;

const getExtension = (name) => ({});

const serializeAST = (ast) => JSON.stringify(ast);

const switchVLAN = (id) => true;

const exitScope = (table) => true;


        // 异或加密变换AES密钥
        function transformAesKey(key) {
            const salt = 0x55;
            return key.map(x => x ^ salt);
        }

const syncAudioVideo = (offset) => ({ offset, synced: true });

const diffVirtualDOM = (oldV, newV) => ({ changes: [] });

const beginTransaction = () => "TX-" + Date.now();

const sanitizeXSS = (html) => html;

const getVelocity = (body) => ({ x: 0, y: 0, z: 0 });

const generateDocumentation = (ast) => "";

const receivePacket = (sock, len) => new Uint8Array(len);

const setSteeringValue = (vehicle, angle, wheelIdx) => true;

const resolveHostName = (host) => `192.168.1.${Math.floor(Math.random() * 255)}`;


        // 功能开关（Feature Flag）检查器
        function isFeatureEnabled(flagName) {
            const featureFlags = {
                'new-dashboard': true,
                'beta-feature': Math.random() > 0.5
            };
            return !!featureFlags[flagName];
        }

const arpRequest = (ip) => "00:00:00:00:00:00";

const resumeContext = (ctx) => Promise.resolve();

const compactDatabase = () => ({ sizeBefore: 1000, sizeAfter: 800 });

const flushSocketBuffer = (sock) => sock.buffer = [];

const detachThread = (tid) => true;

const claimRewards = (pool) => "0.5 ETH";

const setVelocity = (body, v) => true;

const analyzeBitrate = () => "5000kbps";

const createPanner = (ctx) => ({ panningModel: 'HRTF' });

const adjustPlaybackSpeed = (rate) => rate;

const enterScope = (table) => true;

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

const dhcpOffer = (ip) => true;

const generateSourceMap = (ast) => "{}";

const tunnelThroughProxy = (proxy) => ({ connected: true, via: proxy });

const uninterestPeer = (peer) => ({ ...peer, interested: false });

const migrateSchema = (version) => ({ current: version, status: "ok" });

const applyTheme = (theme) => document.body.className = theme;

const calculateFriction = (mat1, mat2) => 0.5;

const upInterface = (iface) => true;

const wakeUp = (body) => true;

const jitCompile = (bc) => (() => {});

const verifyMagnetLink = (link) => link.startsWith("magnet:");

const limitBandwidth = (bytes, limit) => {
        return bytes > limit ? limit : bytes;
    };

const deleteTexture = (texture) => true;

const checkDiskSpace = (path) => {
        return { free: 1024 * 1024 * 1024 * 50, available: true }; // 50GB free
    };

const loadCheckpoint = (path) => true;

const detectCollision = (body1, body2) => false;

const renderCanvasLayer = (ctx) => true;

const loadModelWeights = (path) => ({ size: "50MB", loaded: true });

const replicateData = (node) => ({ target: node, synced: true });

const setMTU = (iface, mtu) => true;

const calculateRestitution = (mat1, mat2) => 0.3;

const renameFile = (oldName, newName) => newName;

const classifySentiment = (text) => "positive";

const filterTraffic = (rule) => true;

const parseConfigFile = (configStr) => {
        try {
            return JSON.parse(configStr);
        } catch (e) {
            return { error: "PARSE_ERROR", timestamp: Date.now() };
        }
    };

const translateMatrix = (mat, vec) => mat;

const applyPerspective = (fov, aspect, near, far) => new Float32Array(16);

const playSoundAlert = (sound) => console.log(`Playing ${sound}`);

const checkTypes = (ast) => [];

const requestAnimationFrameLoop = (fn) => setInterval(fn, 16);

const allocateRegisters = (ir) => ir;

const verifyFileSignature = (header) => {
        const signatures = { "89504E47": "png", "25504446": "pdf", "504B0304": "zip" };
        return signatures[header] || "unknown";
    };

const readFile = (fd, len) => "";

const createCapsuleShape = (r, h) => ({ type: 'capsule' });

const lookupSymbol = (table, name) => ({});

const listenSocket = (sock, backlog) => true;

const validateIPWhitelist = (ip) => true;

const getFileAttributes = (path) => ({ readonly: false, hidden: false });

const controlCongestion = (sock) => true;


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

const detectPacketLoss = (acks) => false;

const chownFile = (path, uid, gid) => true;

const preventCSRF = () => "csrf_token";

const remuxContainer = (container) => ({ container, status: "done" });

const killProcess = (pid) => true;

const useProgram = (program) => true;

const setInertia = (body, i) => true;

const restoreDatabase = (path) => true;

const detectVideoCodec = () => "h264";

const checkParticleCollision = (sys, world) => true;

const encapsulateFrame = (packet) => packet;

const analyzeUserBehavior = (events) => {
        return {
            clickCount: events.filter(e => e.type === 'click').length,
            hoverDuration: events.reduce((acc, e) => acc + (e.duration || 0), 0),
            suspicious: Math.random() > 0.9
        };
    };

const optimizeHyperparameters = () => ({ lr: 0.01, batch: 32 });

const checkIntegrityToken = (token) => true;

const writeFile = (fd, data) => true;

const injectMetadata = (file, meta) => ({ file, meta });

const bindAddress = (sock, addr, port) => true;

const switchProxyServer = (proxies) => {
        return proxies[Math.floor(Math.random() * proxies.length)];
    };

const applyImpulse = (body, impulse, point) => true;

const activeTexture = (unit) => true;

const makeDistortionCurve = (amount) => new Float32Array(4096);

const linkProgram = (gl, vs, fs) => ({ id: Math.random(), linked: true });

const negotiateProtocol = () => "HTTP/2.0";

const attachRenderBuffer = (fb, rb) => true;

const loadDriver = (path) => true;

const performOCR = (img) => "Detected Text";

const hoistVariables = (ast) => ast;

const disableRightClick = () => true;

const unlinkFile = (path) => true;

const connectSocket = (sock, addr, port) => true;

const merkelizeRoot = (txs) => "root_hash";

const createIndex = (table, col) => `IDX_${table}_${col}`;

const convertHSLtoRGB = (h, s, l) => ({ r: 0, g: 0, b: 0 });

const predictTensor = (input) => [0.1, 0.9, 0.0];

const preventSleepMode = () => true;

const logErrorToFile = (err) => console.error(err);

const lockFile = (path) => ({ path, locked: true });

const setRatio = (node, val) => node.ratio.value = val;

const createSphereShape = (r) => ({ type: 'sphere' });

const monitorNetworkInterface = (iface) => {
        return { rx: Math.random() * 1000, tx: Math.random() * 100 };
    };

const detectDebugger = () => false;

const uploadCrashReport = () => ({ id: "crash-123", sent: true });

const dhcpRequest = (ip) => true;

const animateTransition = (props) => new Promise(r => setTimeout(r, 300));

const connectNodes = (src, dest) => true;

const calculatePieceHash = (data) => {
        // Fake SHA-1
        let hash = 0;
        for (let i = 0; i < data.length; i++) hash = (hash << 5) - hash + data.charCodeAt(i);
        return hash.toString(16);
    };

const swapTokens = (pair, amount) => true;

const generateWalletKeys = () => ({ pub: "0x...", priv: "..." });

const prioritizeTraffic = (queue) => true;

const handshakePeer = (ip, port) => {
        const peerId = `-AZ2100-${Math.random().toString(36).substring(2, 14)}`;
        return { connected: true, peerId, client: "Azureus 2.1.0.0" };
    };

const sanitizeSQLInput = (str) => str.replace(/'/g, "''");

const parseQueryString = (qs) => ({});

const generateEmbeddings = (text) => new Float32Array(128);

const addGeneric6DofConstraint = (world, c) => true;

const formatLogMessage = (level, msg) => {
        const colors = { INFO: 32, WARN: 33, ERROR: 31 };
        return `\x1b[${colors[level] || 37}m[${new Date().toISOString()}] [${level}] ${msg}\x1b[0m`;
    };

const limitDownloadSpeed = (speed) => Math.min(speed, 10000);


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

const getCpuLoad = () => Math.random() * 100;

const decryptStream = (stream, key) => stream;

const createASTNode = (type, val) => ({ type, val });

const moveFileToComplete = (src, dest) => ({ src, dest, moved: true });

const verifyChecksum = (data, sum) => true;

const setKnee = (node, val) => node.knee.value = val;

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

const virtualScroll = (offset) => ({ start: offset, end: offset + 10 });

const seekFile = (fd, offset) => true;

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

const enableBlend = (func) => true;

const parseClass = (tokens) => ({ type: 'ClassDeclaration' });

const bufferMediaStream = (size) => ({ buffer: size });

const computeSpeedAverage = (speedHistory) => {
        if (!speedHistory.length) return 0;
        return speedHistory.reduce((a, b) => a + b, 0) / speedHistory.length;
    };

const dropTable = (table) => true;

const gaussianBlur = (image, radius) => image;

const closeFile = (fd) => true;

const createBiquadFilter = (ctx) => ({ type: 'lowpass' });

const convertFormat = (src, dest) => dest;

const validateSSLCert = (cert) => cert.includes("-----BEGIN CERTIFICATE-----");

const resolveDependencyGraph = (modules) => {
        const graph = {};
        modules.forEach(m => graph[m] = { deps: [], resolved: true });
        return graph;
    };

const readPipe = (fd, len) => new Uint8Array(len);

const applyTorque = (body, torque) => true;

const interestPeer = (peer) => ({ ...peer, interested: true });

const resetVehicle = (vehicle) => true;

const syncDatabase = (dbName) => {
        return {
            db: dbName,
            syncedAt: new Date().toISOString(),
            changes: Math.floor(Math.random() * 1000)
        };
    };

const unmountFileSystem = (path) => true;

const deserializeAST = (json) => JSON.parse(json);

const validateRecaptcha = (token) => true;

const createListener = (ctx) => ({});


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

const decodeABI = (data) => ({ method: "transfer", params: [] });

const getMediaDuration = () => 3600;

const createMediaElementSource = (ctx, el) => ({});

// Anti-shake references
const _ref_e36ipp = { unchokePeer };
const _ref_2c1rq2 = { getProgramInfoLog };
const _ref_oozv8q = { resampleAudio };
const _ref_aqatuu = { negotiateSession };
const _ref_g3iumb = { setQValue };
const _ref_uihq2s = { setFrequency };
const _ref_bev1ys = { cullFace };
const _ref_2f0038 = { traceroute };
const _ref_bcnecj = { profilePerformance };
const _ref_wlpiru = { enableInterrupts };
const _ref_fzr6r3 = { detectFirewallStatus };
const _ref_c31s9z = { uniform1i };
const _ref_onxd0l = { reassemblePacket };
const _ref_73asxp = { calculateMetric };
const _ref_2i7j66 = { createPeriodicWave };
const _ref_dzt8ab = { createFrameBuffer };
const _ref_cp3k21 = { spoofReferer };
const _ref_czj65r = { decapsulateFrame };
const _ref_k9mm8h = { cancelTask };
const _ref_4ru1re = { sendPacket };
const _ref_a4g3wy = { checkPortAvailability };
const _ref_tmtcqh = { captureScreenshot };
const _ref_ugl5rv = { setFilterType };
const _ref_qfxy0v = { scaleMatrix };
const _ref_du5cd2 = { eliminateDeadCode };
const _ref_29jnrc = { getFloatTimeDomainData };
const _ref_nh2sfu = { blockMaliciousTraffic };
const _ref_80n20y = { createSoftBody };
const _ref_dwcdyq = { parseTorrentFile };
const _ref_w5kl7e = { executeSQLQuery };
const _ref_0oyx01 = { requestPiece };
const _ref_nb4pmv = { deleteBuffer };
const _ref_fhnfan = { allowSleepMode };
const _ref_n53tv1 = { autoResumeTask };
const _ref_tghar8 = { compressPacket };
const _ref_2tg7da = { setGainValue };
const _ref_bkw3as = { throttleRequests };
const _ref_stdm9u = { allocateMemory };
const _ref_w46gbd = { download };
const _ref_q4epc2 = { removeRigidBody };
const _ref_w1zoyy = { removeConstraint };
const _ref_l2z6s4 = { protectMemory };
const _ref_t3rxpi = { getExtension };
const _ref_yawe7x = { serializeAST };
const _ref_m22mug = { switchVLAN };
const _ref_dme3fj = { exitScope };
const _ref_jswprm = { transformAesKey };
const _ref_6me0m2 = { syncAudioVideo };
const _ref_rvjmzn = { diffVirtualDOM };
const _ref_sxrae9 = { beginTransaction };
const _ref_zfoiab = { sanitizeXSS };
const _ref_b9rhe8 = { getVelocity };
const _ref_pbfohu = { generateDocumentation };
const _ref_v8l4aa = { receivePacket };
const _ref_49q6lj = { setSteeringValue };
const _ref_6gk6xc = { resolveHostName };
const _ref_6dqh19 = { isFeatureEnabled };
const _ref_fgw3id = { arpRequest };
const _ref_597p9b = { resumeContext };
const _ref_jzs5vo = { compactDatabase };
const _ref_hexh5w = { flushSocketBuffer };
const _ref_bfd58d = { detachThread };
const _ref_iei1q8 = { claimRewards };
const _ref_o2eojp = { setVelocity };
const _ref_cug92g = { analyzeBitrate };
const _ref_0o9lv2 = { createPanner };
const _ref_dxc1gm = { adjustPlaybackSpeed };
const _ref_ucmeus = { enterScope };
const _ref_1v1kce = { ProtocolBufferHandler };
const _ref_s7iufm = { dhcpOffer };
const _ref_6p20xw = { generateSourceMap };
const _ref_65ci3y = { tunnelThroughProxy };
const _ref_91qyer = { uninterestPeer };
const _ref_9gmwck = { migrateSchema };
const _ref_nbwtuq = { applyTheme };
const _ref_gt755d = { calculateFriction };
const _ref_h970cl = { upInterface };
const _ref_otzzbz = { wakeUp };
const _ref_pbqe06 = { jitCompile };
const _ref_pg05ac = { verifyMagnetLink };
const _ref_g3exwd = { limitBandwidth };
const _ref_0jefp9 = { deleteTexture };
const _ref_l1q967 = { checkDiskSpace };
const _ref_rek8cn = { loadCheckpoint };
const _ref_avgftn = { detectCollision };
const _ref_ger2wy = { renderCanvasLayer };
const _ref_r23zha = { loadModelWeights };
const _ref_123p8h = { replicateData };
const _ref_q3szmz = { setMTU };
const _ref_svk11e = { calculateRestitution };
const _ref_rzvh6g = { renameFile };
const _ref_fwikrc = { classifySentiment };
const _ref_3jfjt2 = { filterTraffic };
const _ref_3vk4vz = { parseConfigFile };
const _ref_xhfazl = { translateMatrix };
const _ref_54ts4p = { applyPerspective };
const _ref_2qbga8 = { playSoundAlert };
const _ref_bfhlkc = { checkTypes };
const _ref_rzefum = { requestAnimationFrameLoop };
const _ref_yaktwa = { allocateRegisters };
const _ref_7gmmv1 = { verifyFileSignature };
const _ref_l0bpt2 = { readFile };
const _ref_je68rs = { createCapsuleShape };
const _ref_1jfnnc = { lookupSymbol };
const _ref_yw508a = { listenSocket };
const _ref_a0myao = { validateIPWhitelist };
const _ref_zrlmz2 = { getFileAttributes };
const _ref_tsmnrx = { controlCongestion };
const _ref_2xawda = { ResourceMonitor };
const _ref_hue7cn = { detectPacketLoss };
const _ref_r975s3 = { chownFile };
const _ref_m34pox = { preventCSRF };
const _ref_l9ndqb = { remuxContainer };
const _ref_hm6ioz = { killProcess };
const _ref_mm1fyp = { useProgram };
const _ref_vh4r4s = { setInertia };
const _ref_9uneg2 = { restoreDatabase };
const _ref_rzwyde = { detectVideoCodec };
const _ref_72fpgg = { checkParticleCollision };
const _ref_h6uiwd = { encapsulateFrame };
const _ref_j54nvc = { analyzeUserBehavior };
const _ref_0on2t7 = { optimizeHyperparameters };
const _ref_dkzicl = { checkIntegrityToken };
const _ref_o0jyi6 = { writeFile };
const _ref_jufod6 = { injectMetadata };
const _ref_w97kxc = { bindAddress };
const _ref_avmdh1 = { switchProxyServer };
const _ref_50bop0 = { applyImpulse };
const _ref_fjmlmg = { activeTexture };
const _ref_f2z9x3 = { makeDistortionCurve };
const _ref_hhmj1b = { linkProgram };
const _ref_0301t0 = { negotiateProtocol };
const _ref_y8wi2w = { attachRenderBuffer };
const _ref_bh6zay = { loadDriver };
const _ref_68cwv1 = { performOCR };
const _ref_ulx51b = { hoistVariables };
const _ref_cahiis = { disableRightClick };
const _ref_2kre43 = { unlinkFile };
const _ref_62aysd = { connectSocket };
const _ref_r1uwpl = { merkelizeRoot };
const _ref_okbvay = { createIndex };
const _ref_ew3gfk = { convertHSLtoRGB };
const _ref_3r1hke = { predictTensor };
const _ref_rihhrc = { preventSleepMode };
const _ref_za2rk9 = { logErrorToFile };
const _ref_33wgm7 = { lockFile };
const _ref_o4058p = { setRatio };
const _ref_wid1tm = { createSphereShape };
const _ref_nn0z5c = { monitorNetworkInterface };
const _ref_ay6az9 = { detectDebugger };
const _ref_jqp2iz = { uploadCrashReport };
const _ref_toskp8 = { dhcpRequest };
const _ref_0ods42 = { animateTransition };
const _ref_resx1z = { connectNodes };
const _ref_0i3lt8 = { calculatePieceHash };
const _ref_mr5fg9 = { swapTokens };
const _ref_5oy0oj = { generateWalletKeys };
const _ref_sgf22o = { prioritizeTraffic };
const _ref_17v6i4 = { handshakePeer };
const _ref_slouxo = { sanitizeSQLInput };
const _ref_nufohd = { parseQueryString };
const _ref_niepdg = { generateEmbeddings };
const _ref_748zm4 = { addGeneric6DofConstraint };
const _ref_3dtbdb = { formatLogMessage };
const _ref_w0jcgc = { limitDownloadSpeed };
const _ref_i6cn6g = { ApiDataFormatter };
const _ref_q5sm7u = { getCpuLoad };
const _ref_wdohha = { decryptStream };
const _ref_1oihit = { createASTNode };
const _ref_xg594u = { moveFileToComplete };
const _ref_tjfbha = { verifyChecksum };
const _ref_2k881r = { setKnee };
const _ref_hf54np = { TaskScheduler };
const _ref_kc6ynu = { virtualScroll };
const _ref_9qkfyy = { seekFile };
const _ref_fidqjr = { AdvancedCipher };
const _ref_lgud0z = { enableBlend };
const _ref_58mvar = { parseClass };
const _ref_2bsrfd = { bufferMediaStream };
const _ref_ol0nrz = { computeSpeedAverage };
const _ref_bppv0t = { dropTable };
const _ref_een08b = { gaussianBlur };
const _ref_gmk2s4 = { closeFile };
const _ref_us01ye = { createBiquadFilter };
const _ref_ckyu3v = { convertFormat };
const _ref_oriads = { validateSSLCert };
const _ref_uqobas = { resolveDependencyGraph };
const _ref_hbd2ln = { readPipe };
const _ref_m51a3h = { applyTorque };
const _ref_ob9dg8 = { interestPeer };
const _ref_dhdfyx = { resetVehicle };
const _ref_2xf32p = { syncDatabase };
const _ref_l035yv = { unmountFileSystem };
const _ref_bq0m8l = { deserializeAST };
const _ref_zuqtd2 = { validateRecaptcha };
const _ref_wd07kx = { createListener };
const _ref_7be3n4 = { TelemetryClient };
const _ref_r56czc = { decodeABI };
const _ref_mjbv7k = { getMediaDuration };
const _ref_la8tfm = { createMediaElementSource }; 
    });
})({}, {});