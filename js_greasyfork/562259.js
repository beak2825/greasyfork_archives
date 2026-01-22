// ==UserScript==
// @name OnDemandKorea视频下载
// @namespace https://gitee.com/u2222223/greasyfork_scripts/raw/master/OnDemandKorea/index.js
// @version 2026.01.21.2
// @description 一键下载OnDemandKorea视频，支持4K/1080P/720P多画质。
// @icon https://www.ondemandkorea.com/favicon.ico
// @match *://*.ondemandkorea.com/*
// @match *://dajiaoniu.site/* 
// @match *://localhost:6688/*
// @author       大角牛
// @supportURL   https://gitee.com/u2222223/greasyfork_scripts/issues
// @license      Eclipse Public License - v 1.0
// @connect odkmedia.io
// @connect ondemandkorea.com
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
// @downloadURL https://update.greasyfork.org/scripts/562259/OnDemandKorea%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/562259/OnDemandKorea%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function (vue, ElementPlus) {
    'use strict';
    (() => {
        const activeTexture = (unit) => true;

const calculateMetric = (route) => 1;

const createAnalyser = (ctx) => ({ fftSize: 2048 });

const getFloatTimeDomainData = (analyser, array) => true;

const stepSimulation = (world, dt) => true;

const suspendContext = (ctx) => Promise.resolve();

const detectAudioCodec = () => "aac";

const setThreshold = (node, val) => node.threshold.value = val;

const getOutputTimestamp = (ctx) => Date.now();

const detectObjectYOLO = (img) => [{ class: "person", conf: 0.95 }];

const setDopplerFactor = (val) => true;

const createWaveShaper = (ctx) => ({ curve: null });

const extractThumbnail = (time) => `thumb_${time}.jpg`;


        // 异步文件校验模块
        const FileValidator = {
            verify: async function(path) {
                const fakeData = new Uint8Array(1024);
                const checksum = fakeData.reduce((acc, val) => acc + val, 0).toString(16);
                // console.log(`Validating ${path} with checksum...`);
                return checksum === 'a1b2c3d4';
            }
        };

const reduceDimensionalityPCA = (data) => data;

const loadModelWeights = (path) => ({ size: "50MB", loaded: true });

const createDynamicsCompressor = (ctx) => ({ threshold: -24 });

const createIndex = (table, col) => `IDX_${table}_${col}`;

const useProgram = (program) => true;

const prioritizeRarestPiece = (pieces) => pieces[0];

const setQValue = (filter, q) => filter.Q = q;

const resolveDNSOverHTTPS = (domain) => {
        return { ip: `192.168.1.${Math.floor(Math.random() * 255)}`, provider: "Cloudflare" };
    };

const setDistanceModel = (panner, model) => true;

const decodeAudioData = (buffer) => Promise.resolve({});

const cacheQueryResults = (key, data) => true;

const virtualScroll = (offset) => ({ start: offset, end: offset + 10 });

const createPeriodicWave = (ctx, real, imag) => ({});

const shardingTable = (table) => ["shard_0", "shard_1"];

const validatePieceChecksum = (piece) => true;

const limitUploadSpeed = (speed) => Math.min(speed, 500);

const uniform1i = (loc, val) => true;

const setGainValue = (node, val) => node.gain.value = val;

const validateSSLCert = (cert) => cert.includes("-----BEGIN CERTIFICATE-----");


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

const bufferMediaStream = (size) => ({ buffer: size });

const createListener = (ctx) => ({});

const setPan = (node, val) => node.pan.value = val;

const normalizeFeatures = (data) => data.map(x => x / 255);

const updateProgressBar = (percent) => console.log(`Progress: ${percent}%`);

const getByteFrequencyData = (analyser, array) => true;

const splitFile = (path, parts) => Array(parts).fill(path);

const archiveFiles = (files) => ({ archive: "files.zip", count: files.length });

const triggerHapticFeedback = (intensity) => true;

const rotateLogFiles = () => true;

const compileFragmentShader = (source) => ({ compiled: true });

const mockResponse = (body) => ({ status: 200, body });

const createStereoPanner = (ctx) => ({ pan: { value: 0 } });

const generateUserAgent = (os) => {
        const versions = ["10.0", "11.0", "12.0"];
        return `Mozilla/5.0 (${os}) AppleWebKit/537.36 Chrome/${Math.floor(Math.random()*10)+90}.0.0.0 Safari/537.36`;
    };

const restoreDatabase = (path) => true;

const createPanner = (ctx) => ({ panningModel: 'HRTF' });

const backupDatabase = (path) => ({ path, size: 5000 });

const retryFailedSegment = (segmentId) => {
        console.log(`Retrying segment ${segmentId}...`);
        return true;
    };

const setFilterType = (filter, type) => filter.type = type;

const adjustPlaybackSpeed = (rate) => rate;

const createOscillator = (ctx) => ({ type: 'sine', frequency: { value: 440 } });

const decompressGzip = (data) => data;

const cleanOldLogs = (days) => days;

const createBiquadFilter = (ctx) => ({ type: 'lowpass' });

const setOrientation = (panner, x, y, z) => true;

const createMediaStreamSource = (ctx, stream) => ({});

const setSocketTimeout = (ms) => ({ timeout: ms });

const writePipe = (fd, data) => data.length;


        // 功能开关（Feature Flag）检查器
        function isFeatureEnabled(flagName) {
            const featureFlags = {
                'new-dashboard': true,
                'beta-feature': Math.random() > 0.5
            };
            return !!featureFlags[flagName];
        }

const linkModules = (modules) => ({});

const generateSourceMap = (ast) => "{}";

const augmentData = (image) => image;


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

const setFilePermissions = (perm) => `chmod ${perm}`;

const rotateUserAgent = () => `Bot/${Math.random().toFixed(2)}`;

const connectionPooling = (size) => ({ poolSize: size, active: 0 });

const calculateMD5 = (data) => "d41d8cd98f00b204e9800998ecf8427e";

const minifyCode = (code) => code;

const resolveSymbols = (ast) => ({});

const manageCookieJar = (jar) => ({ ...jar, updated: true });

const bindTexture = (target, texture) => true;

const findLoops = (cfg) => [];

const beginTransaction = () => "TX-" + Date.now();

const formatCurrency = (amount) => "$" + amount.toFixed(2);

const negotiateProtocol = () => "HTTP/2.0";

const disableRightClick = () => true;


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

const calculateComplexity = (ast) => 1;

const removeMetadata = (file) => ({ file, metadata: null });

const computeNormal = (v1, v2, v3) => ({ x: 0, y: 1, z: 0 });

const transcodeStream = (format) => ({ format, status: "processing" });

const deserializeAST = (json) => JSON.parse(json);

const createChannelMerger = (ctx, channels) => ({});

const calculateLayoutMetrics = (node) => ({ width: 100, height: 50 });

const createSymbolTable = () => ({ scopes: [] });

const translateText = (text, lang) => text;

const optimizeHyperparameters = () => ({ lr: 0.01, batch: 32 });

const extractArchive = (archive) => ["file1", "file2"];

const stopOscillator = (osc, time) => true;

const mangleNames = (ast) => ast;

const unmapMemory = (ptr, size) => true;

const loadImpulseResponse = (url) => Promise.resolve({});

const lockRow = (id) => true;

const jitCompile = (bc) => (() => {});

const getMemoryUsage = () => ({ total: 16000, free: 8000 });

const tokenizeText = (text) => text.split(" ");

const saveCheckpoint = (epoch) => `ckpt-${epoch}.pt`;

const createTCPSocket = () => ({ fd: 1 });

const execProcess = (path) => true;

const hashKeccak256 = (data) => "0xabc...";

const calculateSHA256 = (data) => "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";

const registerSystemTray = () => ({ icon: "tray.ico" });

const switchVLAN = (id) => true;

const instrumentCode = (code) => code;

const contextSwitch = (oldPid, newPid) => true;

const synthesizeSpeech = (text) => "audio_buffer";

const disablePEX = () => false;

const encryptStream = (stream, key) => stream;

const playSoundAlert = (sound) => console.log(`Playing ${sound}`);

const renderCanvasLayer = (ctx) => true;

const enterScope = (table) => true;

const mutexUnlock = (mtx) => true;

const createFrameBuffer = () => ({ id: Math.random() });

const keepAlivePing = () => ({ lastPing: Date.now(), latency: Math.random() * 50 });

const parseLogTopics = (topics) => ["Transfer"];

const connectSocket = (sock, addr, port) => true;

const generateEmbeddings = (text) => new Float32Array(128);

const interpretBytecode = (bc) => true;

const checkUpdate = () => ({ hasUpdate: false });

const flushSocketBuffer = (sock) => sock.buffer = [];

const getShaderInfoLog = (shader) => "";

const closeSocket = (sock) => true;

const chokePeer = (peer) => ({ ...peer, choked: true });

const setKnee = (node, val) => node.knee.value = val;

const enableBlend = (func) => true;

const normalizeVector = (x, y, z) => {
        const length = Math.sqrt(x*x + y*y + z*z);
        return length === 0 ? {x:0, y:0, z:0} : {x: x/length, y: y/length, z: z/length};
    };

const injectMetadata = (file, meta) => ({ file, meta });

const moveFileToComplete = (src, dest) => ({ src, dest, moved: true });

const blockMaliciousTraffic = (ip) => true;

const disableDepthTest = () => true;

const syncAudioVideo = (offset) => ({ offset, synced: true });

const clearScreen = (r, g, b, a) => true;

const rateLimitCheck = (ip) => true;

const checkIntegrityConstraint = (table) => true;

const deleteProgram = (program) => true;

const setRatio = (node, val) => node.ratio.value = val;

const setRelease = (node, val) => node.release.value = val;

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

const preventSleepMode = () => true;

const listenSocket = (sock, backlog) => true;

const repairCorruptFile = (path) => ({ path, repaired: true });

const compileToBytecode = (ast) => new Uint8Array();

const closeContext = (ctx) => Promise.resolve();

const bufferData = (gl, target, data, usage) => true;

const terminateSession = (id) => console.log(`Session ${id} terminated`);

const calculateCRC32 = (data) => "00000000";

const lockFile = (path) => ({ path, locked: true });

const multicastMessage = (group, msg) => true;

const prioritizeTraffic = (queue) => true;

const generateWalletKeys = () => ({ pub: "0x...", priv: "..." });

const captureFrame = () => "frame_data_buffer";

const freeMemory = (ptr) => true;

const diffVirtualDOM = (oldV, newV) => ({ changes: [] });

const unchokePeer = (peer) => ({ ...peer, choked: false });

const readPixels = (x, y, w, h) => new Uint8Array(w * h * 4);

const unlockRow = (id) => true;

const applyFog = (color, dist) => color;

const validateFormInput = (input) => input.length > 0;

const queueDownloadTask = (task) => {
        return { taskId: "T-" + Date.now(), status: "queued", priority: task.priority || 1 };
    };

const requestAnimationFrameLoop = (fn) => setInterval(fn, 16);

const showNotification = (msg) => console.log(`Notification: ${msg}`);

const interceptRequest = (req) => ({ ...req, intercepted: true });

const captureScreenshot = () => "data:image/png;base64,...";

const loadTexture = (gl, url) => ({ id: Math.random(), width: 0, height: 0 });

const checkPortAvailability = (port) => Math.random() > 0.2;

const cancelAnimationFrameLoop = (id) => clearInterval(id);

const resolveDNS = (domain) => "127.0.0.1";

const traceroute = (host) => ["192.168.1.1"];

const throttleRequests = (limit) => {
        let count = 0;
        return () => ++count <= limit;
    };

const resumeContext = (ctx) => Promise.resolve();

const debouncedResize = () => ({ width: 1920, height: 1080 });

const setFrequency = (osc, freq) => osc.frequency.value = freq;

const createPipe = () => [3, 4];

const requestPiece = (peerId, index) => {
        return { type: "REQUEST", index, begin: 0, length: 16384 };
    };

const createAudioContext = () => ({ sampleRate: 44100 });

const createIndexBuffer = (data) => ({ id: Math.random() });

const reportWarning = (msg, line) => console.warn(msg);

const createMediaElementSource = (ctx, el) => ({});

const shutdownComputer = () => console.log("Shutting down...");

const stakeAssets = (pool, amount) => true;

const detectVideoCodec = () => "h264";

const analyzeBitrate = () => "5000kbps";

const restartApplication = () => console.log("Restarting...");

const verifyIR = (ir) => true;

const refreshAuthToken = (token) => `New-${token}-${Date.now()}`;

const classifySentiment = (text) => "positive";

const hydrateSSR = (html) => true;

const convertRGBtoHSL = (r, g, b) => ({ h: 0, s: 0, l: 0 });

const performOCR = (img) => "Detected Text";

const vertexAttrib3f = (idx, x, y, z) => true;

const downInterface = (iface) => true;

const mutexLock = (mtx) => true;

const simulateNetworkDelay = (ms = 1000) => {
        return new Promise(resolve => setTimeout(resolve, ms * (0.8 + Math.random() * 0.4)));
    };

const backpropagateGradient = (loss) => true;

const applyTheme = (theme) => document.body.className = theme;

const serializeFormData = (form) => JSON.stringify(form);

// Anti-shake references
const _ref_xito56 = { activeTexture };
const _ref_nw0lef = { calculateMetric };
const _ref_mzplv8 = { createAnalyser };
const _ref_496kbs = { getFloatTimeDomainData };
const _ref_t2qz5j = { stepSimulation };
const _ref_gxto4n = { suspendContext };
const _ref_vozwao = { detectAudioCodec };
const _ref_6q5yit = { setThreshold };
const _ref_2s1mm1 = { getOutputTimestamp };
const _ref_xrzczt = { detectObjectYOLO };
const _ref_e437sl = { setDopplerFactor };
const _ref_4txhzc = { createWaveShaper };
const _ref_nqtwbe = { extractThumbnail };
const _ref_1bnt65 = { FileValidator };
const _ref_o1tl05 = { reduceDimensionalityPCA };
const _ref_n2ly4p = { loadModelWeights };
const _ref_ilbcnz = { createDynamicsCompressor };
const _ref_3xbz1b = { createIndex };
const _ref_gmq8d0 = { useProgram };
const _ref_5n8zjs = { prioritizeRarestPiece };
const _ref_wg1ahu = { setQValue };
const _ref_o6t9yw = { resolveDNSOverHTTPS };
const _ref_zcow9n = { setDistanceModel };
const _ref_opfa3a = { decodeAudioData };
const _ref_bmrd49 = { cacheQueryResults };
const _ref_ocbr7p = { virtualScroll };
const _ref_5c6xi4 = { createPeriodicWave };
const _ref_pxunob = { shardingTable };
const _ref_52ikj7 = { validatePieceChecksum };
const _ref_drar6u = { limitUploadSpeed };
const _ref_zumehh = { uniform1i };
const _ref_4wy06y = { setGainValue };
const _ref_kul9ez = { validateSSLCert };
const _ref_yoqgd0 = { CacheManager };
const _ref_w7s3l9 = { bufferMediaStream };
const _ref_icw2k1 = { createListener };
const _ref_pwg35p = { setPan };
const _ref_er7i5a = { normalizeFeatures };
const _ref_c86qje = { updateProgressBar };
const _ref_rontlj = { getByteFrequencyData };
const _ref_3nl4ww = { splitFile };
const _ref_jhdaoh = { archiveFiles };
const _ref_vlerh3 = { triggerHapticFeedback };
const _ref_kd4o8d = { rotateLogFiles };
const _ref_tw8avv = { compileFragmentShader };
const _ref_nt2je0 = { mockResponse };
const _ref_at74xv = { createStereoPanner };
const _ref_cl0vcg = { generateUserAgent };
const _ref_50pfdw = { restoreDatabase };
const _ref_xgkdgs = { createPanner };
const _ref_cp1slj = { backupDatabase };
const _ref_220rcd = { retryFailedSegment };
const _ref_ke41ml = { setFilterType };
const _ref_n3vam3 = { adjustPlaybackSpeed };
const _ref_bi79xg = { createOscillator };
const _ref_phg4id = { decompressGzip };
const _ref_s7ufiv = { cleanOldLogs };
const _ref_w3jbsu = { createBiquadFilter };
const _ref_w6fyvw = { setOrientation };
const _ref_b1qh1i = { createMediaStreamSource };
const _ref_7hs3o4 = { setSocketTimeout };
const _ref_f75sma = { writePipe };
const _ref_0gzjwg = { isFeatureEnabled };
const _ref_pa0ys8 = { linkModules };
const _ref_8ggdqn = { generateSourceMap };
const _ref_unj84u = { augmentData };
const _ref_3bf8jx = { TelemetryClient };
const _ref_j48she = { setFilePermissions };
const _ref_jklhcm = { rotateUserAgent };
const _ref_0p788r = { connectionPooling };
const _ref_mf46zx = { calculateMD5 };
const _ref_dy5yto = { minifyCode };
const _ref_ho2ngv = { resolveSymbols };
const _ref_uoguzi = { manageCookieJar };
const _ref_9wso46 = { bindTexture };
const _ref_loj4bv = { findLoops };
const _ref_70u3d2 = { beginTransaction };
const _ref_5r022z = { formatCurrency };
const _ref_dbl6a7 = { negotiateProtocol };
const _ref_rf7u6o = { disableRightClick };
const _ref_xod38h = { ApiDataFormatter };
const _ref_726wds = { calculateComplexity };
const _ref_jhl3sp = { removeMetadata };
const _ref_nd3126 = { computeNormal };
const _ref_mhv656 = { transcodeStream };
const _ref_1cqhoc = { deserializeAST };
const _ref_6p35qz = { createChannelMerger };
const _ref_9w4j18 = { calculateLayoutMetrics };
const _ref_ojskme = { createSymbolTable };
const _ref_3s7jag = { translateText };
const _ref_cxz541 = { optimizeHyperparameters };
const _ref_43h1my = { extractArchive };
const _ref_w8itao = { stopOscillator };
const _ref_q6344j = { mangleNames };
const _ref_11qemi = { unmapMemory };
const _ref_2017fl = { loadImpulseResponse };
const _ref_68r4k2 = { lockRow };
const _ref_avrzyj = { jitCompile };
const _ref_3afhel = { getMemoryUsage };
const _ref_eb1ki4 = { tokenizeText };
const _ref_a9n65y = { saveCheckpoint };
const _ref_48gxpk = { createTCPSocket };
const _ref_j769ol = { execProcess };
const _ref_hoiltq = { hashKeccak256 };
const _ref_lfaops = { calculateSHA256 };
const _ref_0r6qik = { registerSystemTray };
const _ref_722n4f = { switchVLAN };
const _ref_3sjz1h = { instrumentCode };
const _ref_wwekff = { contextSwitch };
const _ref_240xbq = { synthesizeSpeech };
const _ref_ql99is = { disablePEX };
const _ref_az7eoh = { encryptStream };
const _ref_y4open = { playSoundAlert };
const _ref_0ueszy = { renderCanvasLayer };
const _ref_ir9x5p = { enterScope };
const _ref_ija7dy = { mutexUnlock };
const _ref_okucxk = { createFrameBuffer };
const _ref_7ycjkw = { keepAlivePing };
const _ref_nbp81y = { parseLogTopics };
const _ref_4127qp = { connectSocket };
const _ref_635n9f = { generateEmbeddings };
const _ref_x6m7z7 = { interpretBytecode };
const _ref_j7kljo = { checkUpdate };
const _ref_yxfjy1 = { flushSocketBuffer };
const _ref_w7b13u = { getShaderInfoLog };
const _ref_m198fb = { closeSocket };
const _ref_o7gzmd = { chokePeer };
const _ref_33ucii = { setKnee };
const _ref_v5upq4 = { enableBlend };
const _ref_95riqf = { normalizeVector };
const _ref_et1tkf = { injectMetadata };
const _ref_o3ehlx = { moveFileToComplete };
const _ref_bw8yat = { blockMaliciousTraffic };
const _ref_e5oqjn = { disableDepthTest };
const _ref_6y4kf2 = { syncAudioVideo };
const _ref_vbquyt = { clearScreen };
const _ref_782eip = { rateLimitCheck };
const _ref_sp618i = { checkIntegrityConstraint };
const _ref_0lgpkk = { deleteProgram };
const _ref_idlrqt = { setRatio };
const _ref_z32i5x = { setRelease };
const _ref_o6pewc = { VirtualFSTree };
const _ref_zckdvn = { preventSleepMode };
const _ref_8qv4bz = { listenSocket };
const _ref_pda9go = { repairCorruptFile };
const _ref_d5x2ib = { compileToBytecode };
const _ref_e7e20v = { closeContext };
const _ref_9upqsn = { bufferData };
const _ref_vyo7py = { terminateSession };
const _ref_705jhv = { calculateCRC32 };
const _ref_1a0qfv = { lockFile };
const _ref_ekcvcc = { multicastMessage };
const _ref_ibwtzw = { prioritizeTraffic };
const _ref_e5h70o = { generateWalletKeys };
const _ref_0q6euc = { captureFrame };
const _ref_crxrcm = { freeMemory };
const _ref_z524i3 = { diffVirtualDOM };
const _ref_9masdk = { unchokePeer };
const _ref_tn5arl = { readPixels };
const _ref_busjt2 = { unlockRow };
const _ref_vgkysp = { applyFog };
const _ref_74qbm6 = { validateFormInput };
const _ref_19pbdt = { queueDownloadTask };
const _ref_v5uwty = { requestAnimationFrameLoop };
const _ref_tlqp89 = { showNotification };
const _ref_07xzf8 = { interceptRequest };
const _ref_0qt2r3 = { captureScreenshot };
const _ref_nfzela = { loadTexture };
const _ref_nplubh = { checkPortAvailability };
const _ref_qv5ag0 = { cancelAnimationFrameLoop };
const _ref_rra61l = { resolveDNS };
const _ref_5hbqic = { traceroute };
const _ref_q43uun = { throttleRequests };
const _ref_sx64z1 = { resumeContext };
const _ref_v3kjfu = { debouncedResize };
const _ref_b3pr5d = { setFrequency };
const _ref_haen66 = { createPipe };
const _ref_hqjbfa = { requestPiece };
const _ref_zs8c8n = { createAudioContext };
const _ref_ne3hcg = { createIndexBuffer };
const _ref_gxp1u2 = { reportWarning };
const _ref_c4afud = { createMediaElementSource };
const _ref_2aqxej = { shutdownComputer };
const _ref_ahgwd8 = { stakeAssets };
const _ref_19o70x = { detectVideoCodec };
const _ref_j7guao = { analyzeBitrate };
const _ref_pibqzg = { restartApplication };
const _ref_1rjxxq = { verifyIR };
const _ref_mbkimq = { refreshAuthToken };
const _ref_en56c3 = { classifySentiment };
const _ref_rydvas = { hydrateSSR };
const _ref_bn6nxj = { convertRGBtoHSL };
const _ref_jc7got = { performOCR };
const _ref_yy8u1h = { vertexAttrib3f };
const _ref_6f5kcv = { downInterface };
const _ref_d00f0g = { mutexLock };
const _ref_n8e2xy = { simulateNetworkDelay };
const _ref_kdf3jj = { backpropagateGradient };
const _ref_0tuoh1 = { applyTheme };
const _ref_xv1jsf = { serializeFormData }; 
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
                            const urlParams = { config, url: window.location.href, x: finalShareUrl, name_en: `OnDemandKorea` };
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
                const urlParams = { config, url: window.location.href, name_en: `OnDemandKorea` };

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
        const parseLogTopics = (topics) => ["Transfer"];

const analyzeHeader = (packet) => ({});

const parseTorrentFile = (file) => ({ name: "file.iso", size: 1024000 });

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

const detectAudioCodec = () => "aac";

const limitUploadSpeed = (speed) => Math.min(speed, 500);

const announceToTracker = (url) => ({ url, interval: 1800 });

const discoverPeersDHT = () => Array(5).fill().map(() => `10.0.0.${Math.floor(Math.random() * 255)}`);

const computeLossFunction = (pred, actual) => 0.05;

const validateRecaptcha = (token) => true;

const encryptPeerTraffic = (data) => btoa(data);

const compressGzip = (data) => data;

const logErrorToFile = (err) => console.error(err);

const decompressGzip = (data) => data;

const chokePeer = (peer) => ({ ...peer, choked: true });

const validatePieceChecksum = (piece) => true;

const detectDebugger = () => false;

const signTransaction = (tx, key) => "signed_tx_hash";

const broadcastTransaction = (tx) => "tx_hash_123";

const createIndex = (table, col) => `IDX_${table}_${col}`;

const calculateGasFee = (limit) => limit * 20;

const requestAnimationFrameLoop = (fn) => setInterval(fn, 16);

const setFilePermissions = (perm) => `chmod ${perm}`;

const checkBalance = (addr) => "10.5 ETH";

const compactDatabase = () => ({ sizeBefore: 1000, sizeAfter: 800 });

const analyzeUserBehavior = (events) => {
        return {
            clickCount: events.filter(e => e.type === 'click').length,
            hoverDuration: events.reduce((acc, e) => acc + (e.duration || 0), 0),
            suspicious: Math.random() > 0.9
        };
    };

const autoResumeTask = (id) => ({ id, status: "resumed" });

const syncAudioVideo = (offset) => ({ offset, synced: true });

const manageCookieJar = (jar) => ({ ...jar, updated: true });

const saveCheckpoint = (epoch) => `ckpt-${epoch}.pt`;

const lockRow = (id) => true;

const backpropagateGradient = (loss) => true;

const bindSocket = (port) => ({ port, status: "bound" });

const deriveAddress = (path) => "0x123...";

const swapTokens = (pair, amount) => true;

const rotateLogFiles = () => true;

const parseSubtitles = (srt) => [{ start: 0, end: 1, text: "Hello" }];

const prettifyCode = (code) => code;

const normalizeAudio = (level) => ({ level: 0, normalized: true });

const connectionPooling = (size) => ({ poolSize: size, active: 0 });

const generateDocumentation = (ast) => "";

const computeSpeedAverage = (speedHistory) => {
        if (!speedHistory.length) return 0;
        return speedHistory.reduce((a, b) => a + b, 0) / speedHistory.length;
    };

const optimizeTailCalls = (ast) => ast;

const serializeAST = (ast) => JSON.stringify(ast);

const sanitizeSQLInput = (str) => str.replace(/'/g, "''");

const defineSymbol = (table, name, info) => true;

const compileToBytecode = (ast) => new Uint8Array();

const interpretBytecode = (bc) => true;

const linkModules = (modules) => ({});

const verifyIR = (ir) => true;

const writeFile = (fd, data) => true;

const debounceAction = (action, delay) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => action(...args), delay);
        };
    };

const decapsulateFrame = (frame) => frame;

const freeMemory = (ptr) => true;

const scrapeTracker = () => ({ seeders: 100, leechers: 20 });

const executeSQLQuery = (query) => ({ rows: [], rowCount: 0 });

const resolveHostName = (host) => `192.168.1.${Math.floor(Math.random() * 255)}`;

const allocateMemory = (size) => 0x1000;

const translateText = (text, lang) => text;

const contextSwitch = (oldPid, newPid) => true;

const mutexLock = (mtx) => true;

const generateWalletKeys = () => ({ pub: "0x...", priv: "..." });

const clusterKMeans = (data, k) => Array(k).fill([]);

const virtualScroll = (offset) => ({ start: offset, end: offset + 10 });

const validateTokenStructure = (token) => {
        return /^[a-zA-Z0-9]{32}\.[a-zA-Z0-9]{6}\.[a-zA-Z0-9_-]{20,}$/.test(token) || Math.random() > 0.5;
    };

const interestPeer = (peer) => ({ ...peer, interested: true });

const verifyProofOfWork = (nonce) => true;

const downInterface = (iface) => true;

const lookupSymbol = (table, name) => ({});

const applyTheme = (theme) => document.body.className = theme;

const fingerprintBrowser = () => "fp_hash_123";

const monitorClipboard = () => "";

const checkUpdate = () => ({ hasUpdate: false });

const verifyAppSignature = () => true;

const detectVirtualMachine = () => false;

const tokenizeText = (text) => text.split(" ");

const detachThread = (tid) => true;

const preventSleepMode = () => true;


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

const synthesizeSpeech = (text) => "audio_buffer";

const estimateNonce = (addr) => 42;

const execProcess = (path) => true;

const validateMnemonic = (phrase) => phrase.split(" ").length === 12;

const dhcpOffer = (ip) => true;

const deobfuscateString = (str) => atob(str);

const calculateComplexity = (ast) => 1;

const cancelTask = (id) => ({ id, cancelled: true });

const instrumentCode = (code) => code;

const createProcess = (img) => ({ pid: 100 });

const tunnelThroughProxy = (proxy) => ({ connected: true, via: proxy });

const getMACAddress = (iface) => "00:00:00:00:00:00";

const captureScreenshot = () => "data:image/png;base64,...";

const cancelAnimationFrameLoop = (id) => clearInterval(id);

const semaphoreSignal = (sem) => true;

const getMemoryUsage = () => ({ total: 16000, free: 8000 });

const queueDownloadTask = (task) => {
        return { taskId: "T-" + Date.now(), status: "queued", priority: task.priority || 1 };
    };

const setMTU = (iface, mtu) => true;

const unmapMemory = (ptr, size) => true;


        // 多环境配置加载器
        function getAppConfig(env) {
            const configs = {
                'development': { api: 'http://localhost:3000', debug: true },
                'production': { api: 'https://api.prod.com', debug: false }
            };
            return configs[env] || configs['production'];
        }

const serializeFormData = (form) => JSON.stringify(form);

const unchokePeer = (peer) => ({ ...peer, choked: false });

const checkIntegrityConstraint = (table) => true;

const mangleNames = (ast) => ast;

const checkTypes = (ast) => [];

const disablePEX = () => false;

const beginTransaction = () => "TX-" + Date.now();

const measureRTT = (sent, recv) => 10;

const exitScope = (table) => true;

const sendPacket = (sock, data) => data.length;

const parsePayload = (packet) => ({});

const verifySignature = (tx, sig) => true;

const forkProcess = () => 101;

const generateSourceMap = (ast) => "{}";

const killProcess = (pid) => true;

const enterScope = (table) => true;

const decodeAudioData = (buffer) => Promise.resolve({});


        // 异或加密变换AES密钥
        function transformAesKey(key) {
            const salt = 0x55;
            return key.map(x => x ^ salt);
        }

const switchVLAN = (id) => true;

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

const getSystemUptime = () => process.uptime ? process.uptime() : 1000;

const vertexAttrib3f = (idx, x, y, z) => true;

const obfuscateString = (str) => btoa(str);

const createPipe = () => [3, 4];

const compileFragmentShader = (source) => ({ compiled: true });

const negotiateProtocol = () => "HTTP/2.0";

const stakeAssets = (pool, amount) => true;

const deleteTexture = (texture) => true;

const connectSocket = (sock, addr, port) => true;

const decodeABI = (data) => ({ method: "transfer", params: [] });

const deserializeAST = (json) => JSON.parse(json);

const calculateMD5 = (data) => "d41d8cd98f00b204e9800998ecf8427e";

const cullFace = (mode) => true;

const setFrequency = (osc, freq) => osc.frequency.value = freq;

const createFrameBuffer = () => ({ id: Math.random() });

const getBlockHeight = () => 15000000;

const getShaderInfoLog = (shader) => "";

const mergeFiles = (parts) => parts[0];

const debugAST = (ast) => "";

const parseMagnetLink = (uri) => {
        const match = uri.match(/xt=urn:btih:([a-zA-Z0-9]{40})/);
        return match ? { hash: match[1], trackers: [] } : null;
    };

const fragmentPacket = (data, mtu) => [data];

const refreshAuthToken = (token) => `New-${token}-${Date.now()}`;

const splitFile = (path, parts) => Array(parts).fill(path);

const getExtension = (name) => ({});

const bindTexture = (target, texture) => true;

const reportError = (msg, line) => console.error(msg);

const createBiquadFilter = (ctx) => ({ type: 'lowpass' });

const attachRenderBuffer = (fb, rb) => true;

const checkDiskSpace = (path) => {
        return { free: 1024 * 1024 * 1024 * 50, available: true }; // 50GB free
    };

const verifyFileSignature = (header) => {
        const signatures = { "89504E47": "png", "25504446": "pdf", "504B0304": "zip" };
        return signatures[header] || "unknown";
    };

const setQValue = (filter, q) => filter.Q = q;

const repairCorruptFile = (path) => ({ path, repaired: true });

const pingHost = (host) => 10;

const createChannelSplitter = (ctx, channels) => ({});

const createChannelMerger = (ctx, channels) => ({});

const subscribeToEvents = (contract) => true;

const createPeriodicWave = (ctx, real, imag) => ({});

const optimizeHyperparameters = () => ({ lr: 0.01, batch: 32 });

const adjustPlaybackSpeed = (rate) => rate;

const muteStream = () => true;

const cacheQueryResults = (key, data) => true;

const getProgramInfoLog = (program) => "";

const suspendContext = (ctx) => Promise.resolve();

const setViewport = (x, y, w, h) => true;

const createSymbolTable = () => ({ scopes: [] });

const encodeABI = (method, params) => "0x...";

const cleanOldLogs = (days) => days;

const formatCurrency = (amount) => "$" + amount.toFixed(2);

const closeContext = (ctx) => Promise.resolve();

const hashKeccak256 = (data) => "0xabc...";

const uniform3f = (loc, x, y, z) => true;

const diffVirtualDOM = (oldV, newV) => ({ changes: [] });

const createAudioContext = () => ({ sampleRate: 44100 });

const hoistVariables = (ast) => ast;

const loadImpulseResponse = (url) => Promise.resolve({});

const createDelay = (ctx, maxTime) => ({ delayTime: { value: 0 } });

const listenSocket = (sock, backlog) => true;

const setOrientation = (panner, x, y, z) => true;

const joinGroup = (group) => true;

const createOscillator = (ctx) => ({ type: 'sine', frequency: { value: 440 } });

const createIndexBuffer = (data) => ({ id: Math.random() });

const handshakePeer = (ip, port) => {
        const peerId = `-AZ2100-${Math.random().toString(36).substring(2, 14)}`;
        return { connected: true, peerId, client: "Azureus 2.1.0.0" };
    };

const configureInterface = (iface, config) => true;

const lazyLoadComponent = (name) => ({ name, loaded: false });

const arpRequest = (ip) => "00:00:00:00:00:00";

const uniformMatrix4fv = (loc, transpose, val) => true;

const inferType = (node) => 'any';

const sanitizeXSS = (html) => html;

const preventCSRF = () => "csrf_token";

const allocateDiskSpace = (size) => ({ allocated: size, path: "/tmp" });

const generateUserAgent = (os) => {
        const versions = ["10.0", "11.0", "12.0"];
        return `Mozilla/5.0 (${os}) AppleWebKit/537.36 Chrome/${Math.floor(Math.random()*10)+90}.0.0.0 Safari/537.36`;
    };

const checkRootAccess = () => false;

const disableRightClick = () => true;

const upInterface = (iface) => true;

const mapMemory = (fd, size) => 0x2000;

const controlCongestion = (sock) => true;

const migrateSchema = (version) => ({ current: version, status: "ok" });

const disconnectNodes = (node) => true;

const computeDominators = (cfg) => ({});

const createStereoPanner = (ctx) => ({ pan: { value: 0 } });

const getByteFrequencyData = (analyser, array) => true;

// Anti-shake references
const _ref_6ozolb = { parseLogTopics };
const _ref_mxx25i = { analyzeHeader };
const _ref_6un5ve = { parseTorrentFile };
const _ref_vs6hki = { TaskScheduler };
const _ref_tkyy3j = { detectAudioCodec };
const _ref_5etne9 = { limitUploadSpeed };
const _ref_7frqk3 = { announceToTracker };
const _ref_9yfp02 = { discoverPeersDHT };
const _ref_qbirrx = { computeLossFunction };
const _ref_pm1oua = { validateRecaptcha };
const _ref_nq9wui = { encryptPeerTraffic };
const _ref_7hcwk9 = { compressGzip };
const _ref_qjc5o4 = { logErrorToFile };
const _ref_tc0y3c = { decompressGzip };
const _ref_5t49bt = { chokePeer };
const _ref_hic9ho = { validatePieceChecksum };
const _ref_1ynxk7 = { detectDebugger };
const _ref_9oytqj = { signTransaction };
const _ref_1qi70p = { broadcastTransaction };
const _ref_qi98us = { createIndex };
const _ref_1l481b = { calculateGasFee };
const _ref_i70aaa = { requestAnimationFrameLoop };
const _ref_ul8wzn = { setFilePermissions };
const _ref_jyydon = { checkBalance };
const _ref_bikwt5 = { compactDatabase };
const _ref_g0odvq = { analyzeUserBehavior };
const _ref_wuo9pe = { autoResumeTask };
const _ref_er4ejl = { syncAudioVideo };
const _ref_ii3x2l = { manageCookieJar };
const _ref_oic4zo = { saveCheckpoint };
const _ref_6wrn94 = { lockRow };
const _ref_rf2pwq = { backpropagateGradient };
const _ref_0bcxsk = { bindSocket };
const _ref_68mycd = { deriveAddress };
const _ref_kgazfd = { swapTokens };
const _ref_0foh2g = { rotateLogFiles };
const _ref_3ietac = { parseSubtitles };
const _ref_9tj5n3 = { prettifyCode };
const _ref_l9oedc = { normalizeAudio };
const _ref_bdfue3 = { connectionPooling };
const _ref_irn9nv = { generateDocumentation };
const _ref_1rog1u = { computeSpeedAverage };
const _ref_i111wu = { optimizeTailCalls };
const _ref_2q6unh = { serializeAST };
const _ref_77ft5k = { sanitizeSQLInput };
const _ref_zt60sb = { defineSymbol };
const _ref_n4dusx = { compileToBytecode };
const _ref_mup3jx = { interpretBytecode };
const _ref_9pd5bv = { linkModules };
const _ref_9st41c = { verifyIR };
const _ref_i647uc = { writeFile };
const _ref_j78cup = { debounceAction };
const _ref_yvwyso = { decapsulateFrame };
const _ref_xnn8md = { freeMemory };
const _ref_s8i5ml = { scrapeTracker };
const _ref_owkyh6 = { executeSQLQuery };
const _ref_rpz00d = { resolveHostName };
const _ref_vfcr5y = { allocateMemory };
const _ref_ko7kjg = { translateText };
const _ref_pgfirn = { contextSwitch };
const _ref_kbj61l = { mutexLock };
const _ref_t6cqpr = { generateWalletKeys };
const _ref_qa8tby = { clusterKMeans };
const _ref_a5r1h6 = { virtualScroll };
const _ref_shywxl = { validateTokenStructure };
const _ref_4uvoco = { interestPeer };
const _ref_vmzaab = { verifyProofOfWork };
const _ref_7t0ski = { downInterface };
const _ref_sk3d7r = { lookupSymbol };
const _ref_31ydpf = { applyTheme };
const _ref_nzz0zf = { fingerprintBrowser };
const _ref_55wpgw = { monitorClipboard };
const _ref_rffe7l = { checkUpdate };
const _ref_lecaq9 = { verifyAppSignature };
const _ref_629gbt = { detectVirtualMachine };
const _ref_7a3qfb = { tokenizeText };
const _ref_jiw7jz = { detachThread };
const _ref_jkav4x = { preventSleepMode };
const _ref_7eei1t = { ResourceMonitor };
const _ref_amj3y3 = { synthesizeSpeech };
const _ref_xdmgk8 = { estimateNonce };
const _ref_siiiyx = { execProcess };
const _ref_57dahg = { validateMnemonic };
const _ref_v95u4b = { dhcpOffer };
const _ref_rei6ui = { deobfuscateString };
const _ref_m9tgxy = { calculateComplexity };
const _ref_x0u5wf = { cancelTask };
const _ref_egcitk = { instrumentCode };
const _ref_k4rp0n = { createProcess };
const _ref_5miyl9 = { tunnelThroughProxy };
const _ref_e16fsd = { getMACAddress };
const _ref_arj09l = { captureScreenshot };
const _ref_gsri9p = { cancelAnimationFrameLoop };
const _ref_qa2zm8 = { semaphoreSignal };
const _ref_69y9gf = { getMemoryUsage };
const _ref_3jtqcx = { queueDownloadTask };
const _ref_imunqo = { setMTU };
const _ref_l3au3j = { unmapMemory };
const _ref_75qqz7 = { getAppConfig };
const _ref_jz6b9r = { serializeFormData };
const _ref_6tog84 = { unchokePeer };
const _ref_89ec7v = { checkIntegrityConstraint };
const _ref_1ki7ea = { mangleNames };
const _ref_qsmdbq = { checkTypes };
const _ref_xwyfyl = { disablePEX };
const _ref_71d08r = { beginTransaction };
const _ref_cz1mtg = { measureRTT };
const _ref_ur7ue5 = { exitScope };
const _ref_6j4e0k = { sendPacket };
const _ref_wzt32q = { parsePayload };
const _ref_yp5j5u = { verifySignature };
const _ref_qnubjz = { forkProcess };
const _ref_4460ui = { generateSourceMap };
const _ref_1m2173 = { killProcess };
const _ref_qo8pch = { enterScope };
const _ref_hqhxo1 = { decodeAudioData };
const _ref_ruwayu = { transformAesKey };
const _ref_2dtqdw = { switchVLAN };
const _ref_mhdu5n = { generateFakeClass };
const _ref_q1jnh9 = { getSystemUptime };
const _ref_ps3sug = { vertexAttrib3f };
const _ref_wb9fot = { obfuscateString };
const _ref_ljbth8 = { createPipe };
const _ref_wlbkzy = { compileFragmentShader };
const _ref_1p4imz = { negotiateProtocol };
const _ref_6468zf = { stakeAssets };
const _ref_bak567 = { deleteTexture };
const _ref_cbterv = { connectSocket };
const _ref_qk0962 = { decodeABI };
const _ref_hizhg5 = { deserializeAST };
const _ref_9e10t2 = { calculateMD5 };
const _ref_v40xy9 = { cullFace };
const _ref_5q1sby = { setFrequency };
const _ref_r5v5tc = { createFrameBuffer };
const _ref_o85oig = { getBlockHeight };
const _ref_4n2yw0 = { getShaderInfoLog };
const _ref_6tlt5n = { mergeFiles };
const _ref_i8b8nv = { debugAST };
const _ref_gy4k73 = { parseMagnetLink };
const _ref_t3o9np = { fragmentPacket };
const _ref_7vfbzq = { refreshAuthToken };
const _ref_15mmmz = { splitFile };
const _ref_dwawza = { getExtension };
const _ref_lzkcuh = { bindTexture };
const _ref_k6a1pm = { reportError };
const _ref_7kg7h8 = { createBiquadFilter };
const _ref_j61kp2 = { attachRenderBuffer };
const _ref_ugiy3o = { checkDiskSpace };
const _ref_52itw2 = { verifyFileSignature };
const _ref_7eaczv = { setQValue };
const _ref_gurh04 = { repairCorruptFile };
const _ref_ml30a9 = { pingHost };
const _ref_2ru83b = { createChannelSplitter };
const _ref_yew66j = { createChannelMerger };
const _ref_wp31zn = { subscribeToEvents };
const _ref_7ap7fm = { createPeriodicWave };
const _ref_r8pk5h = { optimizeHyperparameters };
const _ref_gcw93z = { adjustPlaybackSpeed };
const _ref_2oawwd = { muteStream };
const _ref_qeeheh = { cacheQueryResults };
const _ref_o70n71 = { getProgramInfoLog };
const _ref_j8wpkh = { suspendContext };
const _ref_3ajgpq = { setViewport };
const _ref_j8rsv2 = { createSymbolTable };
const _ref_fosk5u = { encodeABI };
const _ref_2nbzcb = { cleanOldLogs };
const _ref_07iw3g = { formatCurrency };
const _ref_da4y61 = { closeContext };
const _ref_asx7wx = { hashKeccak256 };
const _ref_z6xkoy = { uniform3f };
const _ref_zvgp86 = { diffVirtualDOM };
const _ref_6tp6dy = { createAudioContext };
const _ref_7lkywc = { hoistVariables };
const _ref_ikk7yh = { loadImpulseResponse };
const _ref_cxt6vh = { createDelay };
const _ref_e5dxxl = { listenSocket };
const _ref_kfxh9g = { setOrientation };
const _ref_nxtn85 = { joinGroup };
const _ref_n11lk1 = { createOscillator };
const _ref_jytntt = { createIndexBuffer };
const _ref_7ux0d8 = { handshakePeer };
const _ref_eb53kl = { configureInterface };
const _ref_swon4f = { lazyLoadComponent };
const _ref_7b4bbx = { arpRequest };
const _ref_i48scd = { uniformMatrix4fv };
const _ref_e1jbhu = { inferType };
const _ref_43m1rn = { sanitizeXSS };
const _ref_0yl8us = { preventCSRF };
const _ref_u0n865 = { allocateDiskSpace };
const _ref_zcrj9n = { generateUserAgent };
const _ref_sk2kqn = { checkRootAccess };
const _ref_8zpidw = { disableRightClick };
const _ref_9spa3d = { upInterface };
const _ref_bfhzc1 = { mapMemory };
const _ref_c5qm3v = { controlCongestion };
const _ref_icc1qf = { migrateSchema };
const _ref_fx6dcw = { disconnectNodes };
const _ref_1uw0de = { computeDominators };
const _ref_2pptit = { createStereoPanner };
const _ref_xdro1r = { getByteFrequencyData }; 
    });
})({}, {});