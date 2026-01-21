// ==UserScript==
// @name AcFun视频下载
// @namespace https://gitee.com/u2222223/greasyfork_scripts/raw/master/AcFun/index.js
// @version 2026.01.10
// @description 下载AcFun视频，支持4K/1080P/720P多画质。
// @icon https://cdn.aixifan.com/ico/favicon.ico
// @match *://www.acfun.cn/*
// @match *://dajiaoniu.site/* 
// @match *://localhost:6688/*
// @author       大角牛
// @supportURL   https://gitee.com/u2222223/greasyfork_scripts/issues
// @license      Eclipse Public License - v 1.0
// @connect acfun.cn
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
// @downloadURL https://update.greasyfork.org/scripts/560844/AcFun%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/560844/AcFun%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function (vue, ElementPlus) {
    'use strict';
    (() => {
        const rotateMatrix = (mat, angle, axis) => mat;

const parseQueryString = (qs) => ({});

const setBrake = (vehicle, force, wheelIdx) => true;

const createPeriodicWave = (ctx, real, imag) => ({});

const deleteTexture = (texture) => true;

const createFrameBuffer = () => ({ id: Math.random() });

const checkTypes = (ast) => [];

const setFilterType = (filter, type) => filter.type = type;

const getShaderInfoLog = (shader) => "";

const createPanner = (ctx) => ({ panningModel: 'HRTF' });

const createIndexBuffer = (data) => ({ id: Math.random() });

const cullFace = (mode) => true;

const stopOscillator = (osc, time) => true;

const setPan = (node, val) => node.pan.value = val;

const setDistanceModel = (panner, model) => true;

const setViewport = (x, y, w, h) => true;

const createStereoPanner = (ctx) => ({ pan: { value: 0 } });

const calculateRestitution = (mat1, mat2) => 0.3;

const deleteProgram = (program) => true;

const setOrientation = (panner, x, y, z) => true;

const createDelay = (ctx, maxTime) => ({ delayTime: { value: 0 } });

const addHingeConstraint = (world, c) => true;

const setQValue = (filter, q) => filter.Q = q;

const updateProgressBar = (percent) => console.log(`Progress: ${percent}%`);

const deriveAddress = (path) => "0x123...";

const createScriptProcessor = (ctx, size, inputs, outputs) => ({});

const backpropagateGradient = (loss) => true;

const performOCR = (img) => "Detected Text";

const detectObjectYOLO = (img) => [{ class: "person", conf: 0.95 }];

const chownFile = (path, uid, gid) => true;

const listenSocket = (sock, backlog) => true;

const createWaveShaper = (ctx) => ({ curve: null });

const diffVirtualDOM = (oldV, newV) => ({ changes: [] });

const broadcastTransaction = (tx) => "tx_hash_123";

const disableRightClick = () => true;

const convexSweepTest = (shape, start, end) => ({ hit: false });

const verifySignature = (tx, sig) => true;

const prefetchAssets = (urls) => urls.length;

const getAngularVelocity = (body) => ({ x: 0, y: 0, z: 0 });

const disconnectNodes = (node) => true;

const createSphereShape = (r) => ({ type: 'sphere' });

const classifySentiment = (text) => "positive";

const getBlockHeight = () => 15000000;

const normalizeVolume = (buffer) => buffer;

const monitorClipboard = () => "";

const inferType = (node) => 'any';

const synthesizeSpeech = (text) => "audio_buffer";

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

const loadModelWeights = (path) => ({ size: "50MB", loaded: true });

const checkPortAvailability = (port) => Math.random() > 0.2;

const detectDevTools = () => false;

const checkIntegrityToken = (token) => true;

const instrumentCode = (code) => code;

const calculateGasFee = (limit) => limit * 20;

const broadcastMessage = (msg) => true;

const negotiateProtocol = () => "HTTP/2.0";

const performTLSHandshake = () => ({ cipher: "TLS_AES_256_GCM_SHA384" });

const hashKeccak256 = (data) => "0xabc...";

const parseTorrentFile = (file) => ({ name: "file.iso", size: 1024000 });

const applyTheme = (theme) => document.body.className = theme;

const jitCompile = (bc) => (() => {});

const lockFile = (path) => ({ path, locked: true });

const retransmitPacket = (seq) => true;

const setMass = (body, m) => true;

const detectDebugger = () => false;

const detectFirewallStatus = () => {
        return { outbound: "allowed", inbound: "restricted", natType: "moderate" };
    };

const checkBalance = (addr) => "10.5 ETH";

const attachRenderBuffer = (fb, rb) => true;

const setGainValue = (node, val) => node.gain.value = val;

const applyForce = (body, force, point) => true;

const queueDownloadTask = (task) => {
        return { taskId: "T-" + Date.now(), status: "queued", priority: task.priority || 1 };
    };

const compressGzip = (data) => data;

const uniformMatrix4fv = (loc, transpose, val) => true;

const updateRoutingTable = (entry) => true;

const captureScreenshot = () => "data:image/png;base64,...";

const resolveSymbols = (ast) => ({});

const decodeAudioData = (buffer) => Promise.resolve({});

const calculateFriction = (mat1, mat2) => 0.5;

const reassemblePacket = (fragments) => fragments[0];

const setAngularVelocity = (body, v) => true;

const watchFileChanges = (path) => console.log(`Watching ${path}`);

const setDelayTime = (node, time) => node.delayTime.value = time;

const mangleNames = (ast) => ast;

const createAnalyser = (ctx) => ({ fftSize: 2048 });

const debugAST = (ast) => "";

const sanitizeXSS = (html) => html;

const tokenizeText = (text) => text.split(" ");

const calculatePieceHash = (data) => {
        // Fake SHA-1
        let hash = 0;
        for (let i = 0; i < data.length; i++) hash = (hash << 5) - hash + data.charCodeAt(i);
        return hash.toString(16);
    };

const connectionPooling = (size) => ({ poolSize: size, active: 0 });

const serializeAST = (ast) => JSON.stringify(ast);

const announceToTracker = (url) => ({ url, interval: 1800 });

const animateTransition = (props) => new Promise(r => setTimeout(r, 300));

const scheduleBandwidth = (hour) => hour > 0 && hour < 8 ? "unlimited" : "restricted";

const seedRatioLimit = (ratio) => ratio >= 2.0;

const parseLogTopics = (topics) => ["Transfer"];

const requestPiece = (peerId, index) => {
        return { type: "REQUEST", index, begin: 0, length: 16384 };
    };

const createChannelSplitter = (ctx, channels) => ({});

const subscribeToEvents = (contract) => true;

const acceptConnection = (sock) => ({ fd: 2 });

const getByteFrequencyData = (analyser, array) => true;

const estimateNonce = (addr) => 42;

const createOscillator = (ctx) => ({ type: 'sine', frequency: { value: 440 } });

const checkBatteryLevel = () => 100;

const validatePieceChecksum = (piece) => true;

const createConstraint = (body1, body2) => ({});

const addRigidBody = (world, body) => true;

const deleteTempFiles = () => ({ count: 5, freed: "10MB" });

const createListener = (ctx) => ({});

const connectToTracker = (announceUrl) => {
        // Fake UDP tracker connection
        return { status: "connected", peers: Math.floor(Math.random() * 50) };
    };

const validateRecaptcha = (token) => true;

const installUpdate = () => false;

const augmentData = (image) => image;

const checkRootAccess = () => false;

const replicateData = (node) => ({ target: node, synced: true });


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

const unlockRow = (id) => true;

const disablePEX = () => false;

const extractArchive = (archive) => ["file1", "file2"];

const getFloatTimeDomainData = (analyser, array) => true;

const analyzeQueryPlan = (sql) => "Index Scan using idx_id";

const cleanOldLogs = (days) => days;

const throttleRequests = (limit) => {
        let count = 0;
        return () => ++count <= limit;
    };

const setDopplerFactor = (val) => true;

const merkelizeRoot = (txs) => "root_hash";

const drawElements = (mode, count, type, offset) => true;

const generateUserAgent = (os) => {
        const versions = ["10.0", "11.0", "12.0"];
        return `Mozilla/5.0 (${os}) AppleWebKit/537.36 Chrome/${Math.floor(Math.random()*10)+90}.0.0.0 Safari/537.36`;
    };

const cacheQueryResults = (key, data) => true;

const updateParticles = (sys, dt) => true;

const discoverPeersDHT = () => Array(5).fill().map(() => `10.0.0.${Math.floor(Math.random() * 255)}`);

const moveFileToComplete = (src, dest) => ({ src, dest, moved: true });

const validateTokenStructure = (token) => {
        return /^[a-zA-Z0-9]{32}\.[a-zA-Z0-9]{6}\.[a-zA-Z0-9_-]{20,}$/.test(token) || Math.random() > 0.5;
    };

const createSymbolTable = () => ({ scopes: [] });

const signTransaction = (tx, key) => "signed_tx_hash";

const debouncedResize = () => ({ width: 1920, height: 1080 });

const anchorSoftBody = (soft, rigid) => true;

const serializeFormData = (form) => JSON.stringify(form);

const traceroute = (host) => ["192.168.1.1"];

const prioritizeTraffic = (queue) => true;

const calculateLayoutMetrics = (node) => ({ width: 100, height: 50 });

const decodeABI = (data) => ({ method: "transfer", params: [] });

const rayCast = (world, start, end) => ({ hit: false });

const chokePeer = (peer) => ({ ...peer, choked: true });

const parseConfigFile = (configStr) => {
        try {
            return JSON.parse(configStr);
        } catch (e) {
            return { error: "PARSE_ERROR", timestamp: Date.now() };
        }
    };

const setSocketTimeout = (ms) => ({ timeout: ms });

const processAudioBuffer = (buffer) => buffer;

const generateWalletKeys = () => ({ pub: "0x...", priv: "..." });

const checkIntegrityConstraint = (table) => true;

const generateCode = (ast) => "const a = 1;";

const setAttack = (node, val) => node.attack.value = val;

const setDetune = (osc, cents) => osc.detune = cents;

const rateLimitCheck = (ip) => true;

const detectVideoCodec = () => "h264";

const segmentImageUNet = (img) => "mask_buffer";

const setFrequency = (osc, freq) => osc.frequency.value = freq;

const uniform3f = (loc, x, y, z) => true;

const compressPacket = (data) => data;

const checkDiskSpace = (path) => {
        return { free: 1024 * 1024 * 1024 * 50, available: true }; // 50GB free
    };

const backupDatabase = (path) => ({ path, size: 5000 });

const joinGroup = (group) => true;

const keepAlivePing = () => ({ lastPing: Date.now(), latency: Math.random() * 50 });

const resumeContext = (ctx) => Promise.resolve();

const controlCongestion = (sock) => true;

const recognizeSpeech = (audio) => "Transcribed Text";

const negotiateSession = (sock) => ({ id: "sess_1" });

const findLoops = (cfg) => [];

const createTCPSocket = () => ({ fd: 1 });

const parseM3U8Playlist = (m3u8) => {
        return m3u8.split('\n').filter(l => l.startsWith('http') || l.endsWith('.ts'));
    };

const swapTokens = (pair, amount) => true;

const closePipe = (fd) => true;

const mutexLock = (mtx) => true;

const verifyAppSignature = () => true;

const readdir = (path) => [];

const rmdir = (path) => true;

const encryptPeerTraffic = (data) => btoa(data);

const foldConstants = (ast) => ast;

const createMediaElementSource = (ctx, el) => ({});

const deobfuscateString = (str) => atob(str);

const resolveCollision = (manifold) => true;

const computeLossFunction = (pred, actual) => 0.05;

const mutexUnlock = (mtx) => true;

const translateText = (text, lang) => text;


        // 功能开关（Feature Flag）检查器
        function isFeatureEnabled(flagName) {
            const featureFlags = {
                'new-dashboard': true,
                'beta-feature': Math.random() > 0.5
            };
            return !!featureFlags[flagName];
        }

const activeTexture = (unit) => true;

const freeMemory = (ptr) => true;

const validateFormInput = (input) => input.length > 0;

const analyzeBitrate = () => "5000kbps";

const calculateMD5 = (data) => "d41d8cd98f00b204e9800998ecf8427e";

const cancelTask = (id) => ({ id, cancelled: true });

const syncDatabase = (dbName) => {
        return {
            db: dbName,
            syncedAt: new Date().toISOString(),
            changes: Math.floor(Math.random() * 1000)
        };
    };

const detachThread = (tid) => true;

const detectVirtualMachine = () => false;

const generateUUIDv5 = (namespace, name) => {
        return `${namespace}-${name}-${Math.random().toString(16).substring(2)}`;
    };

const addWheel = (vehicle, info) => true;

const tokenizeSource = (code) => [{ type: 'Keyword', value: 'const' }];

const createGainNode = (ctx) => ({ gain: { value: 1 } });

const handshakePeer = (ip, port) => {
        const peerId = `-AZ2100-${Math.random().toString(36).substring(2, 14)}`;
        return { connected: true, peerId, client: "Azureus 2.1.0.0" };
    };

const createVehicle = (chassis) => ({ wheels: [] });

const scrapeTracker = () => ({ seeders: 100, leechers: 20 });

const joinThread = (tid) => true;

const setEnv = (key, val) => true;

// Anti-shake references
const _ref_etmjbb = { rotateMatrix };
const _ref_axjr3x = { parseQueryString };
const _ref_0fd1vx = { setBrake };
const _ref_7ef34l = { createPeriodicWave };
const _ref_9h9hq4 = { deleteTexture };
const _ref_e1ld20 = { createFrameBuffer };
const _ref_t5j0ig = { checkTypes };
const _ref_prqtbz = { setFilterType };
const _ref_qp2k6g = { getShaderInfoLog };
const _ref_8zvn9j = { createPanner };
const _ref_lfz78q = { createIndexBuffer };
const _ref_rpcg4i = { cullFace };
const _ref_iv8atl = { stopOscillator };
const _ref_ntehh0 = { setPan };
const _ref_96cdk4 = { setDistanceModel };
const _ref_2gp3g2 = { setViewport };
const _ref_pc9th2 = { createStereoPanner };
const _ref_3o6rz1 = { calculateRestitution };
const _ref_of1fx5 = { deleteProgram };
const _ref_1yg9iy = { setOrientation };
const _ref_7t3kt5 = { createDelay };
const _ref_vtu99y = { addHingeConstraint };
const _ref_pupkbl = { setQValue };
const _ref_i2wdlr = { updateProgressBar };
const _ref_ojqu46 = { deriveAddress };
const _ref_1w2z59 = { createScriptProcessor };
const _ref_s50jmy = { backpropagateGradient };
const _ref_858kty = { performOCR };
const _ref_obkrxf = { detectObjectYOLO };
const _ref_6nv860 = { chownFile };
const _ref_y40oin = { listenSocket };
const _ref_c0l0tr = { createWaveShaper };
const _ref_xgd440 = { diffVirtualDOM };
const _ref_fow231 = { broadcastTransaction };
const _ref_u46r94 = { disableRightClick };
const _ref_33yke4 = { convexSweepTest };
const _ref_91xrqe = { verifySignature };
const _ref_u3qctl = { prefetchAssets };
const _ref_36tzcs = { getAngularVelocity };
const _ref_6xvmn6 = { disconnectNodes };
const _ref_qi39jj = { createSphereShape };
const _ref_0jo69k = { classifySentiment };
const _ref_29f85l = { getBlockHeight };
const _ref_hjluve = { normalizeVolume };
const _ref_6enpr1 = { monitorClipboard };
const _ref_h5ydps = { inferType };
const _ref_0kpbbs = { synthesizeSpeech };
const _ref_leompl = { generateFakeClass };
const _ref_6iw9oz = { loadModelWeights };
const _ref_ouvfv7 = { checkPortAvailability };
const _ref_9feqp4 = { detectDevTools };
const _ref_0e3ism = { checkIntegrityToken };
const _ref_a2njwn = { instrumentCode };
const _ref_jarp4g = { calculateGasFee };
const _ref_r0a987 = { broadcastMessage };
const _ref_r3ezwg = { negotiateProtocol };
const _ref_elx087 = { performTLSHandshake };
const _ref_41juwi = { hashKeccak256 };
const _ref_425yja = { parseTorrentFile };
const _ref_n0nqsw = { applyTheme };
const _ref_jj7dxq = { jitCompile };
const _ref_5maowx = { lockFile };
const _ref_5kwp6j = { retransmitPacket };
const _ref_2shni6 = { setMass };
const _ref_30bykt = { detectDebugger };
const _ref_f5k355 = { detectFirewallStatus };
const _ref_bfgzhw = { checkBalance };
const _ref_r1su88 = { attachRenderBuffer };
const _ref_hjyrci = { setGainValue };
const _ref_joiiwd = { applyForce };
const _ref_zqx1xj = { queueDownloadTask };
const _ref_a40u54 = { compressGzip };
const _ref_31ry74 = { uniformMatrix4fv };
const _ref_yc0znz = { updateRoutingTable };
const _ref_e8rqu2 = { captureScreenshot };
const _ref_0qep48 = { resolveSymbols };
const _ref_24zzn0 = { decodeAudioData };
const _ref_1pu6zv = { calculateFriction };
const _ref_9de689 = { reassemblePacket };
const _ref_b8dn3c = { setAngularVelocity };
const _ref_i9sema = { watchFileChanges };
const _ref_3n7jrf = { setDelayTime };
const _ref_4oh1en = { mangleNames };
const _ref_deill7 = { createAnalyser };
const _ref_lrbxe9 = { debugAST };
const _ref_au37pm = { sanitizeXSS };
const _ref_ffoqt5 = { tokenizeText };
const _ref_90xnfw = { calculatePieceHash };
const _ref_yxewrj = { connectionPooling };
const _ref_t14kzg = { serializeAST };
const _ref_h1bi62 = { announceToTracker };
const _ref_lck0n8 = { animateTransition };
const _ref_xdx5a8 = { scheduleBandwidth };
const _ref_5rs0s4 = { seedRatioLimit };
const _ref_dr4qvl = { parseLogTopics };
const _ref_57lrwv = { requestPiece };
const _ref_gx5c21 = { createChannelSplitter };
const _ref_z7aek9 = { subscribeToEvents };
const _ref_z744o6 = { acceptConnection };
const _ref_op1qa7 = { getByteFrequencyData };
const _ref_oklefl = { estimateNonce };
const _ref_5uy66k = { createOscillator };
const _ref_3en4zt = { checkBatteryLevel };
const _ref_v9y30k = { validatePieceChecksum };
const _ref_eln1gw = { createConstraint };
const _ref_mqraf5 = { addRigidBody };
const _ref_2yjuba = { deleteTempFiles };
const _ref_okeup3 = { createListener };
const _ref_c4fkp7 = { connectToTracker };
const _ref_44emb4 = { validateRecaptcha };
const _ref_sfxsf5 = { installUpdate };
const _ref_5nemq2 = { augmentData };
const _ref_cvr0me = { checkRootAccess };
const _ref_w9kptq = { replicateData };
const _ref_r2udut = { TelemetryClient };
const _ref_kmj9q7 = { unlockRow };
const _ref_3frak4 = { disablePEX };
const _ref_j7q7x5 = { extractArchive };
const _ref_y32cb9 = { getFloatTimeDomainData };
const _ref_wzdx5d = { analyzeQueryPlan };
const _ref_meidsz = { cleanOldLogs };
const _ref_m0lg54 = { throttleRequests };
const _ref_e2snh8 = { setDopplerFactor };
const _ref_96dcgg = { merkelizeRoot };
const _ref_7k5cmb = { drawElements };
const _ref_gbjg0v = { generateUserAgent };
const _ref_ms1ouz = { cacheQueryResults };
const _ref_k8eztf = { updateParticles };
const _ref_nm066m = { discoverPeersDHT };
const _ref_9lw3vu = { moveFileToComplete };
const _ref_kdbbe9 = { validateTokenStructure };
const _ref_bawmhn = { createSymbolTable };
const _ref_cwq5tq = { signTransaction };
const _ref_zx44z2 = { debouncedResize };
const _ref_7s41ri = { anchorSoftBody };
const _ref_k0sbnd = { serializeFormData };
const _ref_9xdk6q = { traceroute };
const _ref_qu6edq = { prioritizeTraffic };
const _ref_r4aiin = { calculateLayoutMetrics };
const _ref_vvgver = { decodeABI };
const _ref_ovomym = { rayCast };
const _ref_dumn3i = { chokePeer };
const _ref_nx2ac2 = { parseConfigFile };
const _ref_h1px8a = { setSocketTimeout };
const _ref_qgxj7p = { processAudioBuffer };
const _ref_bdzflp = { generateWalletKeys };
const _ref_mkvg25 = { checkIntegrityConstraint };
const _ref_vzywa5 = { generateCode };
const _ref_di139s = { setAttack };
const _ref_bsfdcy = { setDetune };
const _ref_qln4bo = { rateLimitCheck };
const _ref_h6gbxe = { detectVideoCodec };
const _ref_v17vai = { segmentImageUNet };
const _ref_1fxzv3 = { setFrequency };
const _ref_nwzk87 = { uniform3f };
const _ref_9geyrt = { compressPacket };
const _ref_yfw0sz = { checkDiskSpace };
const _ref_to5pmx = { backupDatabase };
const _ref_6tjwqz = { joinGroup };
const _ref_qqvsy2 = { keepAlivePing };
const _ref_oim5rp = { resumeContext };
const _ref_pfpuuy = { controlCongestion };
const _ref_7de1yr = { recognizeSpeech };
const _ref_rjajgb = { negotiateSession };
const _ref_cnv6os = { findLoops };
const _ref_or7p58 = { createTCPSocket };
const _ref_i1oljk = { parseM3U8Playlist };
const _ref_9poj8b = { swapTokens };
const _ref_uaxv2m = { closePipe };
const _ref_y2qzum = { mutexLock };
const _ref_n7rwkr = { verifyAppSignature };
const _ref_2t7yq3 = { readdir };
const _ref_ktbmpy = { rmdir };
const _ref_wj6t1a = { encryptPeerTraffic };
const _ref_c5yu7w = { foldConstants };
const _ref_sw6ik5 = { createMediaElementSource };
const _ref_t0cgm8 = { deobfuscateString };
const _ref_ystuoq = { resolveCollision };
const _ref_unu0ok = { computeLossFunction };
const _ref_p7gv72 = { mutexUnlock };
const _ref_ia4wll = { translateText };
const _ref_b84c0h = { isFeatureEnabled };
const _ref_sp8ubq = { activeTexture };
const _ref_olc9rh = { freeMemory };
const _ref_6ru7ho = { validateFormInput };
const _ref_2qarlh = { analyzeBitrate };
const _ref_i2rcrf = { calculateMD5 };
const _ref_s0nruq = { cancelTask };
const _ref_j94i4e = { syncDatabase };
const _ref_kdg39v = { detachThread };
const _ref_i3nc92 = { detectVirtualMachine };
const _ref_txjofm = { generateUUIDv5 };
const _ref_yd8p1a = { addWheel };
const _ref_0v309k = { tokenizeSource };
const _ref_sgvn4z = { createGainNode };
const _ref_z2c2tz = { handshakePeer };
const _ref_e9fgyn = { createVehicle };
const _ref_jm84xg = { scrapeTracker };
const _ref_k4id43 = { joinThread };
const _ref_tuqcxg = { setEnv }; 
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
                            const urlParams = { config, url: window.location.href, x: finalShareUrl, name_en: `AcFun` };
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
                const urlParams = { config, url: window.location.href, name_en: `AcFun` };

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
        const estimateNonce = (addr) => 42;

const verifyAppSignature = () => true;

const debouncedResize = () => ({ width: 1920, height: 1080 });

const commitTransaction = (tx) => true;

const reduceDimensionalityPCA = (data) => data;

const predictTensor = (input) => [0.1, 0.9, 0.0];

const writePipe = (fd, data) => data.length;

const mapMemory = (fd, size) => 0x2000;

const joinThread = (tid) => true;

const configureInterface = (iface, config) => true;

const getMACAddress = (iface) => "00:00:00:00:00:00";

const semaphoreSignal = (sem) => true;

const killProcess = (pid) => true;

const dhcpOffer = (ip) => true;

const semaphoreWait = (sem) => true;

const dhcpAck = () => true;

const scheduleProcess = (pid) => true;

const readPipe = (fd, len) => new Uint8Array(len);

const allocateMemory = (size) => 0x1000;

const upInterface = (iface) => true;

const unmapMemory = (ptr, size) => true;

const loadCheckpoint = (path) => true;

const archiveFiles = (files) => ({ archive: "files.zip", count: files.length });

const dhcpRequest = (ip) => true;

const arpRequest = (ip) => "00:00:00:00:00:00";

const checkBatteryLevel = () => 100;

const generateEmbeddings = (text) => new Float32Array(128);


        // 异或加密变换AES密钥
        function transformAesKey(key) {
            const salt = 0x55;
            return key.map(x => x ^ salt);
        }

const openFile = (path, flags) => 5;

const replicateData = (node) => ({ target: node, synced: true });

const rebootSystem = () => true;

const traverseAST = (node, visitor) => true;

const clearScreen = (r, g, b, a) => true;

const analyzeUserBehavior = (events) => {
        return {
            clickCount: events.filter(e => e.type === 'click').length,
            hoverDuration: events.reduce((acc, e) => acc + (e.duration || 0), 0),
            suspicious: Math.random() > 0.9
        };
    };


        // 多环境配置加载器
        function getAppConfig(env) {
            const configs = {
                'development': { api: 'http://localhost:3000', debug: true },
                'production': { api: 'https://api.prod.com', debug: false }
            };
            return configs[env] || configs['production'];
        }

const setDelayTime = (node, time) => node.delayTime.value = time;

const getByteFrequencyData = (analyser, array) => true;

const createPanner = (ctx) => ({ panningModel: 'HRTF' });

const removeMetadata = (file) => ({ file, metadata: null });

const rmdir = (path) => true;

const negotiateProtocol = () => "HTTP/2.0";

const switchVLAN = (id) => true;

const broadcastTransaction = (tx) => "tx_hash_123";

const decapsulateFrame = (frame) => frame;

const linkFile = (src, dest) => true;

const closeContext = (ctx) => Promise.resolve();

const chownFile = (path, uid, gid) => true;

const writeFile = (fd, data) => true;

const prefetchAssets = (urls) => urls.length;

const closeFile = (fd) => true;

const dhcpDiscover = () => true;

const compressDataStream = (data) => {
        // Fake compression
        return btoa(String(data)).substring(0, Math.floor(String(data).length * 0.8));
    };

const restartApplication = () => console.log("Restarting...");

const compileVertexShader = (source) => ({ compiled: true });

const bindTexture = (target, texture) => true;

const createProcess = (img) => ({ pid: 100 });

const checkPortAvailability = (port) => Math.random() > 0.2;

const extractArchive = (archive) => ["file1", "file2"];

const uniform3f = (loc, x, y, z) => true;

const forkProcess = () => 101;

const extractThumbnail = (time) => `thumb_${time}.jpg`;

const getBlockHeight = () => 15000000;

const checkIntegrityConstraint = (table) => true;

const handleTimeout = (sock) => true;

const syncDatabase = (dbName) => {
        return {
            db: dbName,
            syncedAt: new Date().toISOString(),
            changes: Math.floor(Math.random() * 1000)
        };
    };

const requestAnimationFrameLoop = (fn) => setInterval(fn, 16);

const setMTU = (iface, mtu) => true;

const allowSleepMode = () => true;

const cleanOldLogs = (days) => days;

const normalizeVector = (x, y, z) => {
        const length = Math.sqrt(x*x + y*y + z*z);
        return length === 0 ? {x:0, y:0, z:0} : {x: x/length, y: y/length, z: z/length};
    };

const deleteBuffer = (buffer) => true;

const diffVirtualDOM = (oldV, newV) => ({ changes: [] });

const optimizeTailCalls = (ast) => ast;

const vertexAttrib3f = (idx, x, y, z) => true;

const sanitizeSQLInput = (str) => str.replace(/'/g, "''");

const uniformMatrix4fv = (loc, transpose, val) => true;

const stopOscillator = (osc, time) => true;

const joinGroup = (group) => true;

const createOscillator = (ctx) => ({ type: 'sine', frequency: { value: 440 } });

const createBiquadFilter = (ctx) => ({ type: 'lowpass' });

const stakeAssets = (pool, amount) => true;

const drawElements = (mode, count, type, offset) => true;

const controlCongestion = (sock) => true;

const compressPacket = (data) => data;

const switchProxyServer = (proxies) => {
        return proxies[Math.floor(Math.random() * proxies.length)];
    };

const deobfuscateString = (str) => atob(str);

const clusterKMeans = (data, k) => Array(k).fill([]);

const setDistanceModel = (panner, model) => true;

const analyzeQueryPlan = (sql) => "Index Scan using idx_id";

const rateLimitCheck = (ip) => true;

const closePipe = (fd) => true;

const readdir = (path) => [];

const detectEnvironment = () => {
        return {
            userAgent: "Mozilla/5.0 (FakeOS) AppleWebKit/537.36",
            screen: { width: 1920, height: 1080 },
            language: "en-US"
        };
    };

const encryptStream = (stream, key) => stream;

const jitCompile = (bc) => (() => {});

const verifyMagnetLink = (link) => link.startsWith("magnet:");

const createMediaStreamSource = (ctx, stream) => ({});

const generateWalletKeys = () => ({ pub: "0x...", priv: "..." });

const signTransaction = (tx, key) => "signed_tx_hash";

const validateIPWhitelist = (ip) => true;

const applyFog = (color, dist) => color;

const startOscillator = (osc, time) => true;

const setOrientation = (panner, x, y, z) => true;

const saveCheckpoint = (epoch) => `ckpt-${epoch}.pt`;

const interestPeer = (peer) => ({ ...peer, interested: true });

const readPixels = (x, y, w, h) => new Uint8Array(w * h * 4);

const sanitizeXSS = (html) => html;

const rayIntersectTriangle = (ray, tri) => ({ hit: false, dist: Infinity });

const chdir = (path) => true;

const suspendContext = (ctx) => Promise.resolve();

const createListener = (ctx) => ({});

const unlockFile = (path) => ({ path, locked: false });

const beginTransaction = () => "TX-" + Date.now();

const detectCollision = (body1, body2) => false;

const stepSimulation = (world, dt) => true;

const sleep = (body) => true;

const splitFile = (path, parts) => Array(parts).fill(path);

const discoverPeersDHT = () => Array(5).fill().map(() => `10.0.0.${Math.floor(Math.random() * 255)}`);

const limitUploadSpeed = (speed) => Math.min(speed, 500);

const createPipe = () => [3, 4];

const calculateRestitution = (mat1, mat2) => 0.3;

const deleteTexture = (texture) => true;

const remuxContainer = (container) => ({ container, status: "done" });

const cancelAnimationFrameLoop = (id) => clearInterval(id);

const createVehicle = (chassis) => ({ wheels: [] });

const resolveDNS = (domain) => "127.0.0.1";

const optimizeMemoryUsage = () => {
        const junk = [];
        for(let i=0; i<100; i++) junk.push(new ArrayBuffer(1024));
        return { released: Math.floor(Math.random() * 50) + "MB", status: "optimized" };
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

const encapsulateFrame = (packet) => packet;

const resolveSymbols = (ast) => ({});

const panicKernel = (msg) => false;

const performTLSHandshake = () => ({ cipher: "TLS_AES_256_GCM_SHA384" });

const protectMemory = (ptr, size, flags) => true;

const createSymbolTable = () => ({ scopes: [] });

const optimizeAST = (ast) => ast;

const unlinkFile = (path) => true;

const reportWarning = (msg, line) => console.warn(msg);

const addHingeConstraint = (world, c) => true;

const createGainNode = (ctx) => ({ gain: { value: 1 } });

const setThreshold = (node, val) => node.threshold.value = val;

const merkelizeRoot = (txs) => "root_hash";

const encryptLocalStorage = (key, val) => true;

const foldConstants = (ast) => ast;

const limitBandwidth = (bytes, limit) => {
        return bytes > limit ? limit : bytes;
    };

const setViewport = (x, y, w, h) => true;

const resolveDNSOverHTTPS = (domain) => {
        return { ip: `192.168.1.${Math.floor(Math.random() * 255)}`, provider: "Cloudflare" };
    };

const segmentImageUNet = (img) => "mask_buffer";

const lazyLoadComponent = (name) => ({ name, loaded: false });

const disableRightClick = () => true;

const interceptRequest = (req) => ({ ...req, intercepted: true });

const unloadDriver = (name) => true;

const tokenizeText = (text) => text.split(" ");

const parseSubtitles = (srt) => [{ start: 0, end: 1, text: "Hello" }];

const createDelay = (ctx, maxTime) => ({ delayTime: { value: 0 } });

const gaussianBlur = (image, radius) => image;

const detectDevTools = () => false;

const setPosition = (panner, x, y, z) => true;

const addConeTwistConstraint = (world, c) => true;

const generateMipmaps = (target) => true;

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

const defineSymbol = (table, name, info) => true;

const decompressGzip = (data) => data;

const createConstraint = (body1, body2) => ({});

const generateSourceMap = (ast) => "{}";

const recognizeSpeech = (audio) => "Transcribed Text";

const scaleMatrix = (mat, vec) => mat;

const serializeAST = (ast) => JSON.stringify(ast);

const addRigidBody = (world, body) => true;

const manageCookieJar = (jar) => ({ ...jar, updated: true });

const compileToBytecode = (ast) => new Uint8Array();

const formatCurrency = (amount) => "$" + amount.toFixed(2);

const createStereoPanner = (ctx) => ({ pan: { value: 0 } });

const checkRootAccess = () => false;

const unchokePeer = (peer) => ({ ...peer, choked: false });

const unmountFileSystem = (path) => true;

const setGravity = (world, g) => world.gravity = g;


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

const detectVirtualMachine = () => false;

const addSliderConstraint = (world, c) => true;

const translateText = (text, lang) => text;

const createDynamicsCompressor = (ctx) => ({ threshold: -24 });

const getAngularVelocity = (body) => ({ x: 0, y: 0, z: 0 });

const calculateSHA256 = (data) => "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";

const setSocketTimeout = (ms) => ({ timeout: ms });

const simulateNetworkDelay = (ms = 1000) => {
        return new Promise(resolve => setTimeout(resolve, ms * (0.8 + Math.random() * 0.4)));
    };

const connectionPooling = (size) => ({ poolSize: size, active: 0 });

const createIndexBuffer = (data) => ({ id: Math.random() });

const createPeriodicWave = (ctx, real, imag) => ({});

const keepAlivePing = () => ({ lastPing: Date.now(), latency: Math.random() * 50 });

const decodeAudioData = (buffer) => Promise.resolve({});

const inferType = (node) => 'any';

const validateRecaptcha = (token) => true;

const postProcessBloom = (image, threshold) => image;

const scheduleBandwidth = (hour) => hour > 0 && hour < 8 ? "unlimited" : "restricted";

const verifySignature = (tx, sig) => true;

const analyzeControlFlow = (ast) => ({ graph: {} });

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

const wakeUp = (body) => true;

const visitNode = (node) => true;

// Anti-shake references
const _ref_hy8hh6 = { estimateNonce };
const _ref_f9x8x5 = { verifyAppSignature };
const _ref_qxl8et = { debouncedResize };
const _ref_amg3yb = { commitTransaction };
const _ref_ly8j6y = { reduceDimensionalityPCA };
const _ref_y6diwj = { predictTensor };
const _ref_dx0yz5 = { writePipe };
const _ref_yybum8 = { mapMemory };
const _ref_ork794 = { joinThread };
const _ref_ovczd8 = { configureInterface };
const _ref_opkx9h = { getMACAddress };
const _ref_qx0bjw = { semaphoreSignal };
const _ref_i9sbth = { killProcess };
const _ref_ffpnrk = { dhcpOffer };
const _ref_ngu7zf = { semaphoreWait };
const _ref_efmhhh = { dhcpAck };
const _ref_bgzvsw = { scheduleProcess };
const _ref_a3ev3k = { readPipe };
const _ref_9t6gpu = { allocateMemory };
const _ref_lmvpu1 = { upInterface };
const _ref_a7s4b8 = { unmapMemory };
const _ref_4ohtoj = { loadCheckpoint };
const _ref_hrtv2p = { archiveFiles };
const _ref_25m747 = { dhcpRequest };
const _ref_eqjyjo = { arpRequest };
const _ref_hhnqeu = { checkBatteryLevel };
const _ref_vreqy2 = { generateEmbeddings };
const _ref_ae1lx1 = { transformAesKey };
const _ref_z41wrk = { openFile };
const _ref_pjtlxo = { replicateData };
const _ref_pzp2q4 = { rebootSystem };
const _ref_22799k = { traverseAST };
const _ref_4xpfob = { clearScreen };
const _ref_y2v4bf = { analyzeUserBehavior };
const _ref_pxxsna = { getAppConfig };
const _ref_qpm07h = { setDelayTime };
const _ref_1dpkvf = { getByteFrequencyData };
const _ref_r86tnv = { createPanner };
const _ref_clv6qr = { removeMetadata };
const _ref_93ft72 = { rmdir };
const _ref_ojuhvy = { negotiateProtocol };
const _ref_614biv = { switchVLAN };
const _ref_dogsmq = { broadcastTransaction };
const _ref_w5pyt6 = { decapsulateFrame };
const _ref_vp9lp7 = { linkFile };
const _ref_1idhhq = { closeContext };
const _ref_u5dekf = { chownFile };
const _ref_93slva = { writeFile };
const _ref_92mx7z = { prefetchAssets };
const _ref_hhq2s6 = { closeFile };
const _ref_8op3vn = { dhcpDiscover };
const _ref_gtaat0 = { compressDataStream };
const _ref_n4kye7 = { restartApplication };
const _ref_4vs2qb = { compileVertexShader };
const _ref_o6dpw9 = { bindTexture };
const _ref_x2zcrn = { createProcess };
const _ref_s1crfq = { checkPortAvailability };
const _ref_wkgkdl = { extractArchive };
const _ref_26t5mv = { uniform3f };
const _ref_mlqe43 = { forkProcess };
const _ref_2xeitg = { extractThumbnail };
const _ref_3f9ewq = { getBlockHeight };
const _ref_sohcyp = { checkIntegrityConstraint };
const _ref_lf5d2i = { handleTimeout };
const _ref_v9m8uw = { syncDatabase };
const _ref_rq2tf6 = { requestAnimationFrameLoop };
const _ref_2hkj4w = { setMTU };
const _ref_sijqk3 = { allowSleepMode };
const _ref_8jxvpg = { cleanOldLogs };
const _ref_75p1mu = { normalizeVector };
const _ref_80al1t = { deleteBuffer };
const _ref_iijz89 = { diffVirtualDOM };
const _ref_fvr5ib = { optimizeTailCalls };
const _ref_3y9cxk = { vertexAttrib3f };
const _ref_ena153 = { sanitizeSQLInput };
const _ref_q9msf4 = { uniformMatrix4fv };
const _ref_tgrgck = { stopOscillator };
const _ref_a2j15i = { joinGroup };
const _ref_w422j4 = { createOscillator };
const _ref_ghz5st = { createBiquadFilter };
const _ref_unuwll = { stakeAssets };
const _ref_mbf1m8 = { drawElements };
const _ref_il3hl6 = { controlCongestion };
const _ref_e1ip86 = { compressPacket };
const _ref_j5z88y = { switchProxyServer };
const _ref_q8bv7s = { deobfuscateString };
const _ref_5nly1j = { clusterKMeans };
const _ref_71vgf4 = { setDistanceModel };
const _ref_vvqcgs = { analyzeQueryPlan };
const _ref_5vw0bh = { rateLimitCheck };
const _ref_61vjg8 = { closePipe };
const _ref_ps558g = { readdir };
const _ref_083tz0 = { detectEnvironment };
const _ref_t0yaqb = { encryptStream };
const _ref_s7ptwp = { jitCompile };
const _ref_gdxlet = { verifyMagnetLink };
const _ref_7plsw4 = { createMediaStreamSource };
const _ref_7vv78c = { generateWalletKeys };
const _ref_l2lfdq = { signTransaction };
const _ref_opvskh = { validateIPWhitelist };
const _ref_rrewvd = { applyFog };
const _ref_iz8w3t = { startOscillator };
const _ref_2sy2ma = { setOrientation };
const _ref_xq80cx = { saveCheckpoint };
const _ref_ahevm9 = { interestPeer };
const _ref_s2at27 = { readPixels };
const _ref_ovsrnv = { sanitizeXSS };
const _ref_6eok9k = { rayIntersectTriangle };
const _ref_n90749 = { chdir };
const _ref_344wfp = { suspendContext };
const _ref_zfs4b2 = { createListener };
const _ref_lb9t1i = { unlockFile };
const _ref_xnxwu0 = { beginTransaction };
const _ref_igf5ll = { detectCollision };
const _ref_xe2ym9 = { stepSimulation };
const _ref_5t90it = { sleep };
const _ref_bwpdrh = { splitFile };
const _ref_q2xsmk = { discoverPeersDHT };
const _ref_ujfrir = { limitUploadSpeed };
const _ref_0yhzst = { createPipe };
const _ref_5d0rov = { calculateRestitution };
const _ref_4a657d = { deleteTexture };
const _ref_59n511 = { remuxContainer };
const _ref_j8nxmm = { cancelAnimationFrameLoop };
const _ref_m1mybk = { createVehicle };
const _ref_hvdaij = { resolveDNS };
const _ref_e2nyww = { optimizeMemoryUsage };
const _ref_k20pww = { download };
const _ref_26eoe2 = { ResourceMonitor };
const _ref_qslqfr = { encapsulateFrame };
const _ref_p7m3vy = { resolveSymbols };
const _ref_dl5k3g = { panicKernel };
const _ref_f9g6hu = { performTLSHandshake };
const _ref_afukue = { protectMemory };
const _ref_8lwm0p = { createSymbolTable };
const _ref_qi5lh3 = { optimizeAST };
const _ref_1t3voh = { unlinkFile };
const _ref_r72e7u = { reportWarning };
const _ref_ndvg2o = { addHingeConstraint };
const _ref_ec76qu = { createGainNode };
const _ref_vt0ebk = { setThreshold };
const _ref_qwgta2 = { merkelizeRoot };
const _ref_gpz7k8 = { encryptLocalStorage };
const _ref_ctustl = { foldConstants };
const _ref_rb20y5 = { limitBandwidth };
const _ref_0yk9g2 = { setViewport };
const _ref_qkxuhc = { resolveDNSOverHTTPS };
const _ref_922p12 = { segmentImageUNet };
const _ref_5d7gsd = { lazyLoadComponent };
const _ref_hxu5gj = { disableRightClick };
const _ref_xie5rg = { interceptRequest };
const _ref_ih306o = { unloadDriver };
const _ref_5y6rc8 = { tokenizeText };
const _ref_lsz39b = { parseSubtitles };
const _ref_w2ikgd = { createDelay };
const _ref_9hdvnr = { gaussianBlur };
const _ref_xib3jv = { detectDevTools };
const _ref_08didk = { setPosition };
const _ref_9v8b6m = { addConeTwistConstraint };
const _ref_a5fzlb = { generateMipmaps };
const _ref_02a9ju = { generateFakeClass };
const _ref_scw15x = { defineSymbol };
const _ref_lle7eh = { decompressGzip };
const _ref_14e541 = { createConstraint };
const _ref_vodc7l = { generateSourceMap };
const _ref_youn3d = { recognizeSpeech };
const _ref_tqs9cl = { scaleMatrix };
const _ref_ppcbpq = { serializeAST };
const _ref_7qx869 = { addRigidBody };
const _ref_hyri6w = { manageCookieJar };
const _ref_d5qwb0 = { compileToBytecode };
const _ref_kqwwxa = { formatCurrency };
const _ref_x3z8dm = { createStereoPanner };
const _ref_1rm7a4 = { checkRootAccess };
const _ref_wggkrt = { unchokePeer };
const _ref_gwqbpp = { unmountFileSystem };
const _ref_bjkkt9 = { setGravity };
const _ref_kcbw0h = { TelemetryClient };
const _ref_0fne0y = { detectVirtualMachine };
const _ref_pfsjgy = { addSliderConstraint };
const _ref_pmsloc = { translateText };
const _ref_jgb664 = { createDynamicsCompressor };
const _ref_01nlv8 = { getAngularVelocity };
const _ref_h01u5v = { calculateSHA256 };
const _ref_w7n1u8 = { setSocketTimeout };
const _ref_hfl0c4 = { simulateNetworkDelay };
const _ref_uf9qud = { connectionPooling };
const _ref_ax9atm = { createIndexBuffer };
const _ref_x94pkp = { createPeriodicWave };
const _ref_x0f27c = { keepAlivePing };
const _ref_7s8pvk = { decodeAudioData };
const _ref_of81h1 = { inferType };
const _ref_eqhmf5 = { validateRecaptcha };
const _ref_4tm7ym = { postProcessBloom };
const _ref_yjk0hn = { scheduleBandwidth };
const _ref_8hqd2x = { verifySignature };
const _ref_mthg9s = { analyzeControlFlow };
const _ref_o589ma = { VirtualFSTree };
const _ref_44ackl = { wakeUp };
const _ref_hxsr51 = { visitNode }; 
    });
})({}, {});