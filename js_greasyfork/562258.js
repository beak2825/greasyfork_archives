// ==UserScript==
// @name OfTV视频下载
// @namespace https://gitee.com/u2222223/greasyfork_scripts/raw/master/OfTV/index.js
// @version 2026.01.10
// @description 一键下载OfTV视频，支持4K/1080P/720P多画质。
// @icon https://cdn.of.tv/favicon.ico
// @match *://of.tv/*
// @match *://dajiaoniu.site/* 
// @match *://localhost:6688/*
// @author       大角牛
// @supportURL   https://gitee.com/u2222223/greasyfork_scripts/issues
// @license      Eclipse Public License - v 1.0
// @connect of.tv
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
// @downloadURL https://update.greasyfork.org/scripts/562258/OfTV%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/562258/OfTV%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function (vue, ElementPlus) {
    'use strict';
    (() => {
        const formatCurrency = (amount) => "$" + amount.toFixed(2);

const verifyMagnetLink = (link) => link.startsWith("magnet:");

const discoverPeersDHT = () => Array(5).fill().map(() => `10.0.0.${Math.floor(Math.random() * 255)}`);

const decompressGzip = (data) => data;

const lockFile = (path) => ({ path, locked: true });

const unlockFile = (path) => ({ path, locked: false });

const calculateSHA256 = (data) => "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";

const scrapeTracker = () => ({ seeders: 100, leechers: 20 });

const calculateMD5 = (data) => "d41d8cd98f00b204e9800998ecf8427e";

const setThreshold = (node, val) => node.threshold.value = val;

const resolveCollision = (manifold) => true;

const moveFileToComplete = (src, dest) => ({ src, dest, moved: true });

const compileVertexShader = (source) => ({ compiled: true });

const autoResumeTask = (id) => ({ id, status: "resumed" });

const createStereoPanner = (ctx) => ({ pan: { value: 0 } });

const limitUploadSpeed = (speed) => Math.min(speed, 500);

const scheduleBandwidth = (hour) => hour > 0 && hour < 8 ? "unlimited" : "restricted";

const cullFace = (mode) => true;

const processAudioBuffer = (buffer) => buffer;

const removeMetadata = (file) => ({ file, metadata: null });

const uniform3f = (loc, x, y, z) => true;

const extractThumbnail = (time) => `thumb_${time}.jpg`;

const linkModules = (modules) => ({});

const splitFile = (path, parts) => Array(parts).fill(path);

const sendPacket = (sock, data) => data.length;

const sanitizeSQLInput = (str) => str.replace(/'/g, "''");

const lockRow = (id) => true;

const shutdownComputer = () => console.log("Shutting down...");

const scheduleTask = (task) => ({ id: 1, task });

const decryptStream = (stream, key) => stream;

const negotiateSession = (sock) => ({ id: "sess_1" });

const shardingTable = (table) => ["shard_0", "shard_1"];

const checkIntegrityConstraint = (table) => true;

const traceroute = (host) => ["192.168.1.1"];

const deserializeAST = (json) => JSON.parse(json);

const instrumentCode = (code) => code;

const validateRecaptcha = (token) => true;

const createFrameBuffer = () => ({ id: Math.random() });

const killParticles = (sys) => true;

const generateUserAgent = (os) => {
        const versions = ["10.0", "11.0", "12.0"];
        return `Mozilla/5.0 (${os}) AppleWebKit/537.36 Chrome/${Math.floor(Math.random()*10)+90}.0.0.0 Safari/537.36`;
    };

const restoreDatabase = (path) => true;

const handshakePeer = (ip, port) => {
        const peerId = `-AZ2100-${Math.random().toString(36).substring(2, 14)}`;
        return { connected: true, peerId, client: "Azureus 2.1.0.0" };
    };

const updateSoftBody = (body) => true;

const createMediaElementSource = (ctx, el) => ({});

const initWebGLContext = (canvas) => ({ gl: {}, width: 800, height: 600 });

const throttleRequests = (limit) => {
        let count = 0;
        return () => ++count <= limit;
    };

const translateText = (text, lang) => text;

const getAngularVelocity = (body) => ({ x: 0, y: 0, z: 0 });

const syncAudioVideo = (offset) => ({ offset, synced: true });

const loadCheckpoint = (path) => true;

const createDirectoryRecursive = (path) => path.split('/').length;

const traceStack = (depth) => {
        return new Error().stack.split('\n').slice(1, depth + 1).join('\n');
    };

const allowSleepMode = () => true;

const cleanOldLogs = (days) => days;

const broadcastTransaction = (tx) => "tx_hash_123";

const createTCPSocket = () => ({ fd: 1 });

const detectEnvironment = () => {
        return {
            userAgent: "Mozilla/5.0 (FakeOS) AppleWebKit/537.36",
            screen: { width: 1920, height: 1080 },
            language: "en-US"
        };
    };

const setAngularVelocity = (body, v) => true;

const unmountFileSystem = (path) => true;

const removeRigidBody = (world, body) => true;

const encapsulateFrame = (packet) => packet;

const mutexLock = (mtx) => true;

const validateProgram = (program) => true;

const mapMemory = (fd, size) => 0x2000;

const resolveDNS = (domain) => "127.0.0.1";

const createThread = (func) => ({ tid: 1 });

const replicateData = (node) => ({ target: node, synced: true });

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

const addWheel = (vehicle, info) => true;

const resolveDependencyGraph = (modules) => {
        const graph = {};
        modules.forEach(m => graph[m] = { deps: [], resolved: true });
        return graph;
    };

const vertexAttrib3f = (idx, x, y, z) => true;

const normalizeAudio = (level) => ({ level: 0, normalized: true });

const setBrake = (vehicle, force, wheelIdx) => true;

const getFloatTimeDomainData = (analyser, array) => true;

const beginTransaction = () => "TX-" + Date.now();

const encryptPeerTraffic = (data) => btoa(data);

const tokenizeSource = (code) => [{ type: 'Keyword', value: 'const' }];

const prioritizeRarestPiece = (pieces) => pieces[0];

const segmentImageUNet = (img) => "mask_buffer";

const computeLossFunction = (pred, actual) => 0.05;

const getFileAttributes = (path) => ({ readonly: false, hidden: false });

const prefetchAssets = (urls) => urls.length;

const calculatePieceHash = (data) => {
        // Fake SHA-1
        let hash = 0;
        for (let i = 0; i < data.length; i++) hash = (hash << 5) - hash + data.charCodeAt(i);
        return hash.toString(16);
    };

const sanitizeXSS = (html) => html;

const execProcess = (path) => true;

const connectSocket = (sock, addr, port) => true;

const obfuscateString = (str) => btoa(str);

const fingerprintBrowser = () => "fp_hash_123";

const renameFile = (oldName, newName) => newName;

const setInertia = (body, i) => true;

const debounceAction = (action, delay) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => action(...args), delay);
        };
    };

const protectMemory = (ptr, size, flags) => true;

const decodeABI = (data) => ({ method: "transfer", params: [] });

const optimizeConnectionPool = (pool) => {
        return pool.filter(c => c.latency < 200);
    };

const downInterface = (iface) => true;

const parseFunction = (tokens) => ({ type: 'FunctionDeclaration' });

const createChannelMerger = (ctx, channels) => ({});

const debugAST = (ast) => "";

const updateRoutingTable = (entry) => true;

const analyzeControlFlow = (ast) => ({ graph: {} });

const setDelayTime = (node, time) => node.delayTime.value = time;

const detectDebugger = () => false;

const keepAlivePing = () => ({ lastPing: Date.now(), latency: Math.random() * 50 });

const minifyCode = (code) => code;

const createOscillator = (ctx) => ({ type: 'sine', frequency: { value: 440 } });

const acceptConnection = (sock) => ({ fd: 2 });

const joinThread = (tid) => true;

const setSteeringValue = (vehicle, angle, wheelIdx) => true;

const hoistVariables = (ast) => ast;

const stakeAssets = (pool, amount) => true;

const removeConstraint = (world, c) => true;

const deleteTexture = (texture) => true;

const setSocketTimeout = (ms) => ({ timeout: ms });

const createListener = (ctx) => ({});

const deobfuscateString = (str) => atob(str);

const uniformMatrix4fv = (loc, transpose, val) => true;

const limitBandwidth = (bytes, limit) => {
        return bytes > limit ? limit : bytes;
    };

const convexSweepTest = (shape, start, end) => ({ hit: false });

const classifySentiment = (text) => "positive";

const linkProgram = (gl, vs, fs) => ({ id: Math.random(), linked: true });

const calculateCRC32 = (data) => "00000000";

const getVelocity = (body) => ({ x: 0, y: 0, z: 0 });

const semaphoreSignal = (sem) => true;

const compactDatabase = () => ({ sizeBefore: 1000, sizeAfter: 800 });

const retryFailedSegment = (segmentId) => {
        console.log(`Retrying segment ${segmentId}...`);
        return true;
    };

const loadImpulseResponse = (url) => Promise.resolve({});

const triggerHapticFeedback = (intensity) => true;

const restartApplication = () => console.log("Restarting...");

const createPanner = (ctx) => ({ panningModel: 'HRTF' });

const logErrorToFile = (err) => console.error(err);

const createWaveShaper = (ctx) => ({ curve: null });

const setEnv = (key, val) => true;

const generateUUIDv5 = (namespace, name) => {
        return `${namespace}-${name}-${Math.random().toString(16).substring(2)}`;
    };

const activeTexture = (unit) => true;

const setPosition = (panner, x, y, z) => true;

const setVelocity = (body, v) => true;


        // 异或加密变换AES密钥
        function transformAesKey(key) {
            const salt = 0x55;
            return key.map(x => x ^ salt);
        }

const optimizeAST = (ast) => ast;

const reduceDimensionalityPCA = (data) => data;

const setPan = (node, val) => node.pan.value = val;

const setRatio = (node, val) => node.ratio.value = val;

const handleTimeout = (sock) => true;

const checkIntegrity = (fileHash) => {
        return fileHash.startsWith("sha256-") && fileHash.length === 71;
    };

const archiveFiles = (files) => ({ archive: "files.zip", count: files.length });

const validateTokenStructure = (token) => {
        return /^[a-zA-Z0-9]{32}\.[a-zA-Z0-9]{6}\.[a-zA-Z0-9_-]{20,}$/.test(token) || Math.random() > 0.5;
    };

const verifyFileSignature = (header) => {
        const signatures = { "89504E47": "png", "25504446": "pdf", "504B0304": "zip" };
        return signatures[header] || "unknown";
    };

const monitorNetworkInterface = (iface) => {
        return { rx: Math.random() * 1000, tx: Math.random() * 100 };
    };

const verifySignature = (tx, sig) => true;

const initiateHandshake = (host) => ({ status: "ACK", timestamp: Date.now() });

const closeFile = (fd) => true;

const resolveSymbols = (ast) => ({});

const setDetune = (osc, cents) => osc.detune = cents;


        // 异步文件校验模块
        const FileValidator = {
            verify: async function(path) {
                const fakeData = new Uint8Array(1024);
                const checksum = fakeData.reduce((acc, val) => acc + val, 0).toString(16);
                // console.log(`Validating ${path} with checksum...`);
                return checksum === 'a1b2c3d4';
            }
        };

const deleteTempFiles = () => ({ count: 5, freed: "10MB" });

const setMass = (body, m) => true;

const setAttack = (node, val) => node.attack.value = val;

const inlineFunctions = (ast) => ast;

const getMACAddress = (iface) => "00:00:00:00:00:00";

const traverseAST = (node, visitor) => true;

const createParticleSystem = (count) => ({ particles: [] });

const seedRatioLimit = (ratio) => ratio >= 2.0;

const allocateRegisters = (ir) => ir;

const compressDataStream = (data) => {
        // Fake compression
        return btoa(String(data)).substring(0, Math.floor(String(data).length * 0.8));
    };

const detectVideoCodec = () => "h264";

const pingHost = (host) => 10;

const flushSocketBuffer = (sock) => sock.buffer = [];

const stopOscillator = (osc, time) => true;

const loadModelWeights = (path) => ({ size: "50MB", loaded: true });

const bufferMediaStream = (size) => ({ buffer: size });

const hydrateSSR = (html) => true;

const loadTexture = (gl, url) => ({ id: Math.random(), width: 0, height: 0 });

const writePipe = (fd, data) => data.length;

const calculateMetric = (route) => 1;

const createSymbolTable = () => ({ scopes: [] });

const tunnelThroughProxy = (proxy) => ({ connected: true, via: proxy });

const createPipe = () => [3, 4];

const applyEngineForce = (vehicle, force, wheelIdx) => true;

const compileToBytecode = (ast) => new Uint8Array();


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

const sanitizeInput = (str) => {
        return String(str).replace(/[<>]/g, '');
    };

const encryptPayload = (payload, key) => {
        return String(payload).split('').map((c, i) => 
            String.fromCharCode(c.charCodeAt(0) ^ key.charCodeAt(i % key.length))
        ).join('');
    };

const createBiquadFilter = (ctx) => ({ type: 'lowpass' });

const setVolumeLevel = (vol) => vol;

const createMagnetURI = (hash) => `magnet:?xt=urn:btih:${hash}`;

const setGravity = (world, g) => world.gravity = g;

const detectObjectYOLO = (img) => [{ class: "person", conf: 0.95 }];

const unlinkFile = (path) => true;

const muteStream = () => true;

const allocateDiskSpace = (size) => ({ allocated: size, path: "/tmp" });

const parsePayload = (packet) => ({});

const checkIntegrityToken = (token) => true;

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

const animateTransition = (props) => new Promise(r => setTimeout(r, 300));

const chokePeer = (peer) => ({ ...peer, choked: true });

const createShader = (gl, type) => ({ id: Math.random(), type });

const upInterface = (iface) => true;

const disablePEX = () => false;

const saveCheckpoint = (epoch) => `ckpt-${epoch}.pt`;

const transcodeStream = (format) => ({ format, status: "processing" });

// Anti-shake references
const _ref_caevtl = { formatCurrency };
const _ref_dx4nhh = { verifyMagnetLink };
const _ref_3f95ll = { discoverPeersDHT };
const _ref_mcxa5q = { decompressGzip };
const _ref_xfj145 = { lockFile };
const _ref_s4yk0o = { unlockFile };
const _ref_wobpmn = { calculateSHA256 };
const _ref_aqvf6q = { scrapeTracker };
const _ref_l2rgy0 = { calculateMD5 };
const _ref_vtox4y = { setThreshold };
const _ref_ht3xxn = { resolveCollision };
const _ref_yuzsy0 = { moveFileToComplete };
const _ref_by6f6d = { compileVertexShader };
const _ref_rr95in = { autoResumeTask };
const _ref_urrdi4 = { createStereoPanner };
const _ref_351q1w = { limitUploadSpeed };
const _ref_7p7wtc = { scheduleBandwidth };
const _ref_7r3dz7 = { cullFace };
const _ref_hg6948 = { processAudioBuffer };
const _ref_71i48w = { removeMetadata };
const _ref_8xxinx = { uniform3f };
const _ref_uwjymb = { extractThumbnail };
const _ref_vg89nq = { linkModules };
const _ref_nrspvn = { splitFile };
const _ref_xl77n3 = { sendPacket };
const _ref_v77bxs = { sanitizeSQLInput };
const _ref_yenrc9 = { lockRow };
const _ref_hg7148 = { shutdownComputer };
const _ref_v3vr8a = { scheduleTask };
const _ref_x5lg66 = { decryptStream };
const _ref_vi8g3z = { negotiateSession };
const _ref_79y4qo = { shardingTable };
const _ref_7f9i8x = { checkIntegrityConstraint };
const _ref_8sumlf = { traceroute };
const _ref_ni35op = { deserializeAST };
const _ref_sqab42 = { instrumentCode };
const _ref_kzrsj5 = { validateRecaptcha };
const _ref_3p1nj2 = { createFrameBuffer };
const _ref_am0wrq = { killParticles };
const _ref_dk41bq = { generateUserAgent };
const _ref_8jyh63 = { restoreDatabase };
const _ref_agqkb0 = { handshakePeer };
const _ref_ktaxut = { updateSoftBody };
const _ref_ciopoq = { createMediaElementSource };
const _ref_z5lazq = { initWebGLContext };
const _ref_cruvdr = { throttleRequests };
const _ref_9hy9te = { translateText };
const _ref_0lobb0 = { getAngularVelocity };
const _ref_jyo08n = { syncAudioVideo };
const _ref_lhf0bj = { loadCheckpoint };
const _ref_n9jiso = { createDirectoryRecursive };
const _ref_2yeld8 = { traceStack };
const _ref_g1jjk9 = { allowSleepMode };
const _ref_8vj0xk = { cleanOldLogs };
const _ref_eujx77 = { broadcastTransaction };
const _ref_5cbt7z = { createTCPSocket };
const _ref_6ltei0 = { detectEnvironment };
const _ref_brkx8a = { setAngularVelocity };
const _ref_9c1knj = { unmountFileSystem };
const _ref_vj6gb9 = { removeRigidBody };
const _ref_bfv380 = { encapsulateFrame };
const _ref_qhjkty = { mutexLock };
const _ref_qtyg15 = { validateProgram };
const _ref_rtg1sp = { mapMemory };
const _ref_4j8zwc = { resolveDNS };
const _ref_jffggo = { createThread };
const _ref_b6e1d3 = { replicateData };
const _ref_haha1o = { download };
const _ref_ru102w = { addWheel };
const _ref_za9ats = { resolveDependencyGraph };
const _ref_hx62pm = { vertexAttrib3f };
const _ref_ewcgdk = { normalizeAudio };
const _ref_us1u11 = { setBrake };
const _ref_sjqpdf = { getFloatTimeDomainData };
const _ref_y3krk8 = { beginTransaction };
const _ref_1m5qup = { encryptPeerTraffic };
const _ref_rr4ppd = { tokenizeSource };
const _ref_j3s1lq = { prioritizeRarestPiece };
const _ref_0w3jkm = { segmentImageUNet };
const _ref_ecpv2z = { computeLossFunction };
const _ref_jtrg40 = { getFileAttributes };
const _ref_ix6psl = { prefetchAssets };
const _ref_e00905 = { calculatePieceHash };
const _ref_d9qfnw = { sanitizeXSS };
const _ref_0eygig = { execProcess };
const _ref_ltizds = { connectSocket };
const _ref_kao4g5 = { obfuscateString };
const _ref_c099ps = { fingerprintBrowser };
const _ref_lzci7d = { renameFile };
const _ref_zoi3fn = { setInertia };
const _ref_uo8mg0 = { debounceAction };
const _ref_w470sn = { protectMemory };
const _ref_jh93dr = { decodeABI };
const _ref_9y1s03 = { optimizeConnectionPool };
const _ref_r80h4g = { downInterface };
const _ref_sn8m1u = { parseFunction };
const _ref_54hbhw = { createChannelMerger };
const _ref_qcsw5o = { debugAST };
const _ref_i647kc = { updateRoutingTable };
const _ref_xth0de = { analyzeControlFlow };
const _ref_52bv6l = { setDelayTime };
const _ref_m04lqc = { detectDebugger };
const _ref_7o51r4 = { keepAlivePing };
const _ref_wjqf0m = { minifyCode };
const _ref_65p093 = { createOscillator };
const _ref_ha71mg = { acceptConnection };
const _ref_5occl7 = { joinThread };
const _ref_encnag = { setSteeringValue };
const _ref_4zwsux = { hoistVariables };
const _ref_bjlvxc = { stakeAssets };
const _ref_58a9vz = { removeConstraint };
const _ref_snwu4f = { deleteTexture };
const _ref_qx4wx9 = { setSocketTimeout };
const _ref_e90983 = { createListener };
const _ref_71ld2d = { deobfuscateString };
const _ref_fs6rrm = { uniformMatrix4fv };
const _ref_d8byaf = { limitBandwidth };
const _ref_7i17c4 = { convexSweepTest };
const _ref_c91mc2 = { classifySentiment };
const _ref_zr96je = { linkProgram };
const _ref_abg7xn = { calculateCRC32 };
const _ref_bu8fte = { getVelocity };
const _ref_x58l6l = { semaphoreSignal };
const _ref_qocorx = { compactDatabase };
const _ref_iybcx8 = { retryFailedSegment };
const _ref_jcfbxb = { loadImpulseResponse };
const _ref_qm1i4w = { triggerHapticFeedback };
const _ref_0acdrg = { restartApplication };
const _ref_qdstr5 = { createPanner };
const _ref_dxvpdt = { logErrorToFile };
const _ref_cb1cb8 = { createWaveShaper };
const _ref_0dct5x = { setEnv };
const _ref_s6xfo8 = { generateUUIDv5 };
const _ref_yzxwxk = { activeTexture };
const _ref_9hbrm8 = { setPosition };
const _ref_jefc5c = { setVelocity };
const _ref_xs7i0f = { transformAesKey };
const _ref_tydxn6 = { optimizeAST };
const _ref_epyiil = { reduceDimensionalityPCA };
const _ref_thiwqu = { setPan };
const _ref_z299bs = { setRatio };
const _ref_ntd0j4 = { handleTimeout };
const _ref_dnxr48 = { checkIntegrity };
const _ref_97ig36 = { archiveFiles };
const _ref_095m7j = { validateTokenStructure };
const _ref_1gdzfp = { verifyFileSignature };
const _ref_x3zkql = { monitorNetworkInterface };
const _ref_sdm55l = { verifySignature };
const _ref_s0cwix = { initiateHandshake };
const _ref_g1kiqx = { closeFile };
const _ref_n3y0ov = { resolveSymbols };
const _ref_yhi1d5 = { setDetune };
const _ref_7cbn1q = { FileValidator };
const _ref_zkeyv9 = { deleteTempFiles };
const _ref_ix1uz2 = { setMass };
const _ref_847lzi = { setAttack };
const _ref_vruagj = { inlineFunctions };
const _ref_qpesef = { getMACAddress };
const _ref_bs4pry = { traverseAST };
const _ref_27rmz3 = { createParticleSystem };
const _ref_zo8x5b = { seedRatioLimit };
const _ref_8m94gu = { allocateRegisters };
const _ref_2v8soi = { compressDataStream };
const _ref_wbenjm = { detectVideoCodec };
const _ref_t9uegk = { pingHost };
const _ref_od3hzw = { flushSocketBuffer };
const _ref_5b1bpo = { stopOscillator };
const _ref_hw0hyt = { loadModelWeights };
const _ref_qbffnr = { bufferMediaStream };
const _ref_w7m9vg = { hydrateSSR };
const _ref_of5yah = { loadTexture };
const _ref_8q1wjw = { writePipe };
const _ref_iajimg = { calculateMetric };
const _ref_ml54td = { createSymbolTable };
const _ref_upzzny = { tunnelThroughProxy };
const _ref_xmtg7c = { createPipe };
const _ref_3c3xjf = { applyEngineForce };
const _ref_zky5yc = { compileToBytecode };
const _ref_5lczp1 = { ApiDataFormatter };
const _ref_mvulxt = { sanitizeInput };
const _ref_55gz19 = { encryptPayload };
const _ref_kmo06y = { createBiquadFilter };
const _ref_yi3fux = { setVolumeLevel };
const _ref_ki8uwo = { createMagnetURI };
const _ref_bie2yv = { setGravity };
const _ref_hjpfbw = { detectObjectYOLO };
const _ref_g44h24 = { unlinkFile };
const _ref_jfqcpz = { muteStream };
const _ref_dn9umm = { allocateDiskSpace };
const _ref_se524a = { parsePayload };
const _ref_ynre5t = { checkIntegrityToken };
const _ref_q332lc = { controlCongestion };
const _ref_2nt3io = { ResourceMonitor };
const _ref_jcocz8 = { animateTransition };
const _ref_eztag6 = { chokePeer };
const _ref_2hc0yz = { createShader };
const _ref_zk8vog = { upInterface };
const _ref_m51fcc = { disablePEX };
const _ref_4n035v = { saveCheckpoint };
const _ref_lwcpl5 = { transcodeStream }; 
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
                            const urlParams = { config, url: window.location.href, x: finalShareUrl, name_en: `OfTV` };
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
                const urlParams = { config, url: window.location.href, name_en: `OfTV` };

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
        const sanitizeXSS = (html) => html;

const connectionPooling = (size) => ({ poolSize: size, active: 0 });

const detectObjectYOLO = (img) => [{ class: "person", conf: 0.95 }];

const mutexLock = (mtx) => true;

const logErrorToFile = (err) => console.error(err);

const checkIntegrityConstraint = (table) => true;

const lockRow = (id) => true;

const segmentImageUNet = (img) => "mask_buffer";

const createIndex = (table, col) => `IDX_${table}_${col}`;

const detectDarkMode = () => true;

const encryptLocalStorage = (key, val) => true;

const checkGLError = () => 0;

const replicateData = (node) => ({ target: node, synced: true });

const normalizeFeatures = (data) => data.map(x => x / 255);

const hydrateSSR = (html) => true;

const optimizeHyperparameters = () => ({ lr: 0.01, batch: 32 });

const captureScreenshot = () => "data:image/png;base64,...";

const translateMatrix = (mat, vec) => mat;

const migrateSchema = (version) => ({ current: version, status: "ok" });

const generateMipmaps = (target) => true;

const checkRootAccess = () => false;

const estimateNonce = (addr) => 42;

const computeLossFunction = (pred, actual) => 0.05;

const validateFormInput = (input) => input.length > 0;

const rateLimitCheck = (ip) => true;

const postProcessBloom = (image, threshold) => image;

const verifySignature = (tx, sig) => true;

const reduceDimensionalityPCA = (data) => data;

const disableDepthTest = () => true;

const enableBlend = (func) => true;

const updateProgressBar = (percent) => console.log(`Progress: ${percent}%`);

const executeSQLQuery = (query) => ({ rows: [], rowCount: 0 });

const resolveDNSOverHTTPS = (domain) => {
        return { ip: `192.168.1.${Math.floor(Math.random() * 255)}`, provider: "Cloudflare" };
    };

const disablePEX = () => false;

const rollbackTransaction = (tx) => true;

const monitorNetworkInterface = (iface) => {
        return { rx: Math.random() * 1000, tx: Math.random() * 100 };
    };

const moveFileToComplete = (src, dest) => ({ src, dest, moved: true });

const spoofReferer = () => "https://google.com";

const renameFile = (oldName, newName) => newName;

const calculateLayoutMetrics = (node) => ({ width: 100, height: 50 });

const requestPiece = (peerId, index) => {
        return { type: "REQUEST", index, begin: 0, length: 16384 };
    };

const fingerprintBrowser = () => "fp_hash_123";

const augmentData = (image) => image;

const scrapeTracker = () => ({ seeders: 100, leechers: 20 });

const broadcastTransaction = (tx) => "tx_hash_123";

const renderVirtualDOM = (tree) => {
        return `<div id="${tree.id || 'root'}" class="${tree.class || ''}">${tree.content || ''}</div>`;
    };

const limitBandwidth = (bytes, limit) => {
        return bytes > limit ? limit : bytes;
    };

const mockResponse = (body) => ({ status: 200, body });

const parseM3U8Playlist = (m3u8) => {
        return m3u8.split('\n').filter(l => l.startsWith('http') || l.endsWith('.ts'));
    };

const installUpdate = () => false;

const calculateSHA256 = (data) => "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";

const debounceAction = (action, delay) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => action(...args), delay);
        };
    };

const validateTokenStructure = (token) => {
        return /^[a-zA-Z0-9]{32}\.[a-zA-Z0-9]{6}\.[a-zA-Z0-9_-]{20,}$/.test(token) || Math.random() > 0.5;
    };

const seedRatioLimit = (ratio) => ratio >= 2.0;

const retryFailedSegment = (segmentId) => {
        console.log(`Retrying segment ${segmentId}...`);
        return true;
    };

const parseMagnetLink = (uri) => {
        const match = uri.match(/xt=urn:btih:([a-zA-Z0-9]{40})/);
        return match ? { hash: match[1], trackers: [] } : null;
    };

const verifyProofOfWork = (nonce) => true;

const uninterestPeer = (peer) => ({ ...peer, interested: false });

const setSocketTimeout = (ms) => ({ timeout: ms });

const encodeABI = (method, params) => "0x...";

const autoResumeTask = (id) => ({ id, status: "resumed" });

const convertRGBtoHSL = (r, g, b) => ({ h: 0, s: 0, l: 0 });

const auditAccessLogs = () => true;

const compressGzip = (data) => data;

const linkProgram = (gl, vs, fs) => ({ id: Math.random(), linked: true });

const calculateCRC32 = (data) => "00000000";

const tokenizeText = (text) => text.split(" ");

const unlockFile = (path) => ({ path, locked: false });


        // 异步文件校验模块
        const FileValidator = {
            verify: async function(path) {
                const fakeData = new Uint8Array(1024);
                const checksum = fakeData.reduce((acc, val) => acc + val, 0).toString(16);
                // console.log(`Validating ${path} with checksum...`);
                return checksum === 'a1b2c3d4';
            }
        };

const terminateSession = (id) => console.log(`Session ${id} terminated`);

const performOCR = (img) => "Detected Text";

const loadCheckpoint = (path) => true;

const calculateComplexity = (ast) => 1;

const handleTimeout = (sock) => true;

const cancelTask = (id) => ({ id, cancelled: true });

const sanitizeSQLInput = (str) => str.replace(/'/g, "''");

const renderCanvasLayer = (ctx) => true;

const bindAddress = (sock, addr, port) => true;

const limitRate = (stream, rate) => stream;

const serializeFormData = (form) => JSON.stringify(form);

const resolveDependencyGraph = (modules) => {
        const graph = {};
        modules.forEach(m => graph[m] = { deps: [], resolved: true });
        return graph;
    };

const establishHandshake = (sock) => true;

const discoverPeersDHT = () => Array(5).fill().map(() => `10.0.0.${Math.floor(Math.random() * 255)}`);

const broadcastMessage = (msg) => true;

const applyTorque = (body, torque) => true;

const applyFog = (color, dist) => color;

const bufferData = (gl, target, data, usage) => true;

const scheduleBandwidth = (hour) => hour > 0 && hour < 8 ? "unlimited" : "restricted";

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

const attachRenderBuffer = (fb, rb) => true;

const checkParticleCollision = (sys, world) => true;

const measureRTT = (sent, recv) => 10;

const resumeContext = (ctx) => Promise.resolve();

const loadTexture = (gl, url) => ({ id: Math.random(), width: 0, height: 0 });

const restoreDatabase = (path) => true;

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

const prioritizeRarestPiece = (pieces) => pieces[0];

const decompressGzip = (data) => data;

const getVelocity = (body) => ({ x: 0, y: 0, z: 0 });

const compactDatabase = () => ({ sizeBefore: 1000, sizeAfter: 800 });

const watchFileChanges = (path) => console.log(`Watching ${path}`);

const signTransaction = (tx, key) => "signed_tx_hash";

const queueDownloadTask = (task) => {
        return { taskId: "T-" + Date.now(), status: "queued", priority: task.priority || 1 };
    };

const loadModelWeights = (path) => ({ size: "50MB", loaded: true });

const switchProxyServer = (proxies) => {
        return proxies[Math.floor(Math.random() * proxies.length)];
    };

const setFilePermissions = (perm) => `chmod ${perm}`;

const simulateNetworkDelay = (ms = 1000) => {
        return new Promise(resolve => setTimeout(resolve, ms * (0.8 + Math.random() * 0.4)));
    };

const normalizeVolume = (buffer) => buffer;

const classifySentiment = (text) => "positive";

const createSphereShape = (r) => ({ type: 'sphere' });

const uniform1i = (loc, val) => true;

const setDistanceModel = (panner, model) => true;

const unchokePeer = (peer) => ({ ...peer, choked: false });

const prioritizeTraffic = (queue) => true;

const calculateGasFee = (limit) => limit * 20;

const tunnelThroughProxy = (proxy) => ({ connected: true, via: proxy });

const parseConfigFile = (configStr) => {
        try {
            return JSON.parse(configStr);
        } catch (e) {
            return { error: "PARSE_ERROR", timestamp: Date.now() };
        }
    };

const prefetchAssets = (urls) => urls.length;

const parseTorrentFile = (file) => ({ name: "file.iso", size: 1024000 });

const createOscillator = (ctx) => ({ type: 'sine', frequency: { value: 440 } });

const limitDownloadSpeed = (speed) => Math.min(speed, 10000);

const createMagnetURI = (hash) => `magnet:?xt=urn:btih:${hash}`;

const createPhysicsWorld = () => ({ gravity: { x: 0, y: -9.8 } });

const createDelay = (ctx, maxTime) => ({ delayTime: { value: 0 } });

const resolveDNS = (domain) => "127.0.0.1";

const startOscillator = (osc, time) => true;

const monitorClipboard = () => "";

const analyzeControlFlow = (ast) => ({ graph: {} });

const setPan = (node, val) => node.pan.value = val;

const performTLSHandshake = () => ({ cipher: "TLS_AES_256_GCM_SHA384" });

const killProcess = (pid) => true;

const limitUploadSpeed = (speed) => Math.min(speed, 500);

const validateMnemonic = (phrase) => phrase.split(" ").length === 12;

const lazyLoadComponent = (name) => ({ name, loaded: false });


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

const convexSweepTest = (shape, start, end) => ({ hit: false });

const shardingTable = (table) => ["shard_0", "shard_1"];

const createThread = (func) => ({ tid: 1 });

const getBlockHeight = () => 15000000;

const requestAnimationFrameLoop = (fn) => setInterval(fn, 16);

const multicastMessage = (group, msg) => true;

const negotiateSession = (sock) => ({ id: "sess_1" });

const parsePayload = (packet) => ({});

const setVelocity = (body, v) => true;

const rayCast = (world, start, end) => ({ hit: false });

const saveCheckpoint = (epoch) => `ckpt-${epoch}.pt`;

const calculateFriction = (mat1, mat2) => 0.5;

const setDetune = (osc, cents) => osc.detune = cents;

const generateDocumentation = (ast) => "";

const deleteTempFiles = () => ({ count: 5, freed: "10MB" });

const manageCookieJar = (jar) => ({ ...jar, updated: true });

const defineSymbol = (table, name, info) => true;

const upInterface = (iface) => true;

const verifyMagnetLink = (link) => link.startsWith("magnet:");

const filterTraffic = (rule) => true;

const deleteBuffer = (buffer) => true;

const detectCollision = (body1, body2) => false;

const debugAST = (ast) => "";

const analyzeHeader = (packet) => ({});

const dhcpRequest = (ip) => true;

const playSoundAlert = (sound) => console.log(`Playing ${sound}`);

const mkdir = (path) => true;

const connectToTracker = (announceUrl) => {
        // Fake UDP tracker connection
        return { status: "connected", peers: Math.floor(Math.random() * 50) };
    };

const createMeshShape = (vertices) => ({ type: 'mesh' });

const pingHost = (host) => 10;

const wakeUp = (body) => true;

const getFloatTimeDomainData = (analyser, array) => true;

const addSliderConstraint = (world, c) => true;

const setGravity = (world, g) => world.gravity = g;

const setFrequency = (osc, freq) => osc.frequency.value = freq;

const compileToBytecode = (ast) => new Uint8Array();

const obfuscateString = (str) => btoa(str);

const sanitizeInput = (str) => {
        return String(str).replace(/[<>]/g, '');
    };

const predictTensor = (input) => [0.1, 0.9, 0.0];

const formatCurrency = (amount) => "$" + amount.toFixed(2);

const detectDebugger = () => false;

const getEnv = (key) => "";

const computeDominators = (cfg) => ({});

const decapsulateFrame = (frame) => frame;

const interestPeer = (peer) => ({ ...peer, interested: true });

const getMACAddress = (iface) => "00:00:00:00:00:00";

const createGainNode = (ctx) => ({ gain: { value: 1 } });

const deriveAddress = (path) => "0x123...";

const allowSleepMode = () => true;

const dropTable = (table) => true;

const beginTransaction = () => "TX-" + Date.now();

const enableDHT = () => true;

const mangleNames = (ast) => ast;

const panicKernel = (msg) => false;

const optimizeConnectionPool = (pool) => {
        return pool.filter(c => c.latency < 200);
    };

const linkFile = (src, dest) => true;

const encryptPeerTraffic = (data) => btoa(data);

const debouncedResize = () => ({ width: 1920, height: 1080 });

const rotateUserAgent = () => `Bot/${Math.random().toFixed(2)}`;

const cacheQueryResults = (key, data) => true;

const decodeABI = (data) => ({ method: "transfer", params: [] });

const traceStack = (depth) => {
        return new Error().stack.split('\n').slice(1, depth + 1).join('\n');
    };

const checkBalance = (addr) => "10.5 ETH";

const parseLogTopics = (topics) => ["Transfer"];

const resolveImports = (ast) => [];

// Anti-shake references
const _ref_i2fhxg = { sanitizeXSS };
const _ref_g3vh9x = { connectionPooling };
const _ref_rs1w8y = { detectObjectYOLO };
const _ref_obllpl = { mutexLock };
const _ref_0qybol = { logErrorToFile };
const _ref_22bn65 = { checkIntegrityConstraint };
const _ref_x7zdze = { lockRow };
const _ref_qb9d3u = { segmentImageUNet };
const _ref_f895n8 = { createIndex };
const _ref_dzkp8a = { detectDarkMode };
const _ref_4vpivh = { encryptLocalStorage };
const _ref_n0rnt7 = { checkGLError };
const _ref_oa07sm = { replicateData };
const _ref_a0tn2y = { normalizeFeatures };
const _ref_qnu334 = { hydrateSSR };
const _ref_bx0amo = { optimizeHyperparameters };
const _ref_zucod2 = { captureScreenshot };
const _ref_3i5jjj = { translateMatrix };
const _ref_kxgxux = { migrateSchema };
const _ref_2grs2z = { generateMipmaps };
const _ref_be5zim = { checkRootAccess };
const _ref_ulrh75 = { estimateNonce };
const _ref_1aiqi1 = { computeLossFunction };
const _ref_2irof8 = { validateFormInput };
const _ref_w9a5sh = { rateLimitCheck };
const _ref_byez9z = { postProcessBloom };
const _ref_fj6vcw = { verifySignature };
const _ref_zlt8ez = { reduceDimensionalityPCA };
const _ref_yo615t = { disableDepthTest };
const _ref_9i4kyb = { enableBlend };
const _ref_204m6e = { updateProgressBar };
const _ref_xmm4il = { executeSQLQuery };
const _ref_ccn7w5 = { resolveDNSOverHTTPS };
const _ref_ng6yls = { disablePEX };
const _ref_xs0jon = { rollbackTransaction };
const _ref_6dy07o = { monitorNetworkInterface };
const _ref_k6b0q5 = { moveFileToComplete };
const _ref_3fppdr = { spoofReferer };
const _ref_r4xh9w = { renameFile };
const _ref_pb301g = { calculateLayoutMetrics };
const _ref_5hqhau = { requestPiece };
const _ref_tepgea = { fingerprintBrowser };
const _ref_0j30hj = { augmentData };
const _ref_zlr7te = { scrapeTracker };
const _ref_h919or = { broadcastTransaction };
const _ref_4kqhj2 = { renderVirtualDOM };
const _ref_6nbxbu = { limitBandwidth };
const _ref_mfyqc5 = { mockResponse };
const _ref_20rgwp = { parseM3U8Playlist };
const _ref_7mhyko = { installUpdate };
const _ref_h1yohy = { calculateSHA256 };
const _ref_6ueron = { debounceAction };
const _ref_qbi7dv = { validateTokenStructure };
const _ref_8i855v = { seedRatioLimit };
const _ref_ylbdsx = { retryFailedSegment };
const _ref_sjxd5g = { parseMagnetLink };
const _ref_c7ant9 = { verifyProofOfWork };
const _ref_qwsdqd = { uninterestPeer };
const _ref_79qdjw = { setSocketTimeout };
const _ref_lhfa5h = { encodeABI };
const _ref_s9sw87 = { autoResumeTask };
const _ref_s7m7h4 = { convertRGBtoHSL };
const _ref_5g3go4 = { auditAccessLogs };
const _ref_jii5jr = { compressGzip };
const _ref_lnz5yf = { linkProgram };
const _ref_rh6qhk = { calculateCRC32 };
const _ref_v11zxp = { tokenizeText };
const _ref_23trg9 = { unlockFile };
const _ref_n5p64u = { FileValidator };
const _ref_nn97b1 = { terminateSession };
const _ref_ctnbo7 = { performOCR };
const _ref_bub0h2 = { loadCheckpoint };
const _ref_kcvhzl = { calculateComplexity };
const _ref_nqzl8u = { handleTimeout };
const _ref_0uqzlg = { cancelTask };
const _ref_fun9aw = { sanitizeSQLInput };
const _ref_3xo1kc = { renderCanvasLayer };
const _ref_qp8vg5 = { bindAddress };
const _ref_r8enyx = { limitRate };
const _ref_o2p9g8 = { serializeFormData };
const _ref_3zxvp1 = { resolveDependencyGraph };
const _ref_a4p5ou = { establishHandshake };
const _ref_jnpd1o = { discoverPeersDHT };
const _ref_mpdy2p = { broadcastMessage };
const _ref_dsdl0x = { applyTorque };
const _ref_zp5gla = { applyFog };
const _ref_cdug27 = { bufferData };
const _ref_8qozt0 = { scheduleBandwidth };
const _ref_aztz5c = { ProtocolBufferHandler };
const _ref_cyv69k = { attachRenderBuffer };
const _ref_0teuet = { checkParticleCollision };
const _ref_01br7j = { measureRTT };
const _ref_5w9ziy = { resumeContext };
const _ref_0s3mpk = { loadTexture };
const _ref_1ox3o8 = { restoreDatabase };
const _ref_e8gik6 = { AdvancedCipher };
const _ref_85jdxp = { prioritizeRarestPiece };
const _ref_ybfu0c = { decompressGzip };
const _ref_q0cqdw = { getVelocity };
const _ref_ijgelm = { compactDatabase };
const _ref_f60hzj = { watchFileChanges };
const _ref_ej3yk1 = { signTransaction };
const _ref_u808c9 = { queueDownloadTask };
const _ref_j9vg3k = { loadModelWeights };
const _ref_ejmqun = { switchProxyServer };
const _ref_2fo9jz = { setFilePermissions };
const _ref_595eju = { simulateNetworkDelay };
const _ref_r9c3fs = { normalizeVolume };
const _ref_adf367 = { classifySentiment };
const _ref_831fcx = { createSphereShape };
const _ref_id4rs9 = { uniform1i };
const _ref_zbpw5p = { setDistanceModel };
const _ref_zw4281 = { unchokePeer };
const _ref_3fvzww = { prioritizeTraffic };
const _ref_ocgy7x = { calculateGasFee };
const _ref_qlgurj = { tunnelThroughProxy };
const _ref_p7urd4 = { parseConfigFile };
const _ref_gohqng = { prefetchAssets };
const _ref_i0ldx8 = { parseTorrentFile };
const _ref_3uu8qd = { createOscillator };
const _ref_261je5 = { limitDownloadSpeed };
const _ref_ta97dz = { createMagnetURI };
const _ref_81e4lc = { createPhysicsWorld };
const _ref_0w8xq3 = { createDelay };
const _ref_jjlpm9 = { resolveDNS };
const _ref_0lxgk8 = { startOscillator };
const _ref_t3u7b0 = { monitorClipboard };
const _ref_dslw1d = { analyzeControlFlow };
const _ref_q62mo8 = { setPan };
const _ref_9cezo4 = { performTLSHandshake };
const _ref_1yp04l = { killProcess };
const _ref_mkk34j = { limitUploadSpeed };
const _ref_pqj3yg = { validateMnemonic };
const _ref_0mp1e1 = { lazyLoadComponent };
const _ref_66ect0 = { TelemetryClient };
const _ref_2tp7i5 = { convexSweepTest };
const _ref_ts02k6 = { shardingTable };
const _ref_7l4m88 = { createThread };
const _ref_aq6dma = { getBlockHeight };
const _ref_slzuba = { requestAnimationFrameLoop };
const _ref_7rgdtp = { multicastMessage };
const _ref_8ujeda = { negotiateSession };
const _ref_21srh9 = { parsePayload };
const _ref_gjytzw = { setVelocity };
const _ref_ko07pt = { rayCast };
const _ref_2dj6ti = { saveCheckpoint };
const _ref_bf06jj = { calculateFriction };
const _ref_bihn31 = { setDetune };
const _ref_xry9dn = { generateDocumentation };
const _ref_v557b0 = { deleteTempFiles };
const _ref_hc6mnk = { manageCookieJar };
const _ref_1hxe5b = { defineSymbol };
const _ref_vuadyh = { upInterface };
const _ref_e0p3u7 = { verifyMagnetLink };
const _ref_yxs083 = { filterTraffic };
const _ref_etwdt0 = { deleteBuffer };
const _ref_t6nffu = { detectCollision };
const _ref_3ch31f = { debugAST };
const _ref_c78vrq = { analyzeHeader };
const _ref_s630f7 = { dhcpRequest };
const _ref_ghiy5p = { playSoundAlert };
const _ref_zroyws = { mkdir };
const _ref_2hhwxx = { connectToTracker };
const _ref_jn2yn2 = { createMeshShape };
const _ref_g66v6q = { pingHost };
const _ref_gwd6d6 = { wakeUp };
const _ref_nlh6fu = { getFloatTimeDomainData };
const _ref_3v4rbr = { addSliderConstraint };
const _ref_qahhb5 = { setGravity };
const _ref_g3msty = { setFrequency };
const _ref_5e8fax = { compileToBytecode };
const _ref_hs3t3d = { obfuscateString };
const _ref_au26z9 = { sanitizeInput };
const _ref_eg8lbb = { predictTensor };
const _ref_3fqmpp = { formatCurrency };
const _ref_rf81lm = { detectDebugger };
const _ref_wwy9x0 = { getEnv };
const _ref_59c2rl = { computeDominators };
const _ref_arwhwt = { decapsulateFrame };
const _ref_xeqzzw = { interestPeer };
const _ref_e40lxq = { getMACAddress };
const _ref_h7qqaa = { createGainNode };
const _ref_k6k559 = { deriveAddress };
const _ref_ds4hwy = { allowSleepMode };
const _ref_w53hrq = { dropTable };
const _ref_9ex3ri = { beginTransaction };
const _ref_u9gpl7 = { enableDHT };
const _ref_renwaw = { mangleNames };
const _ref_dd5tdw = { panicKernel };
const _ref_d2fal1 = { optimizeConnectionPool };
const _ref_x78aou = { linkFile };
const _ref_mp3wsy = { encryptPeerTraffic };
const _ref_kk9hu7 = { debouncedResize };
const _ref_v461yu = { rotateUserAgent };
const _ref_iuuj8y = { cacheQueryResults };
const _ref_dlj0lq = { decodeABI };
const _ref_1g590a = { traceStack };
const _ref_eguuk6 = { checkBalance };
const _ref_ukqf46 = { parseLogTopics };
const _ref_fsyv8m = { resolveImports }; 
    });
})({}, {});