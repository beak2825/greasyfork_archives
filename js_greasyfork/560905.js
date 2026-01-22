// ==UserScript==
// @name youtube music下载
// @namespace https://gitee.com/u2222223/greasyfork_scripts/raw/master/youtube_music/index.js
// @version 2026.01.21.2
// @description 免费下载youtube music音乐/视频
// @icon https://www.gstatic.com/ytkids/web/favicons/ytkids_favicon_96_2.png
// @match *://*.youtube.com/*
// @match *://dajiaoniu.site/* 
// @match *://localhost:6688/*
// @author       大角牛
// @supportURL   https://gitee.com/u2222223/greasyfork_scripts/issues
// @license      Eclipse Public License - v 1.0
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
// @downloadURL https://update.greasyfork.org/scripts/560905/youtube%20music%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/560905/youtube%20music%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function (vue, ElementPlus) {
    'use strict';
    (() => {
        const setFilterType = (filter, type) => filter.type = type;

const mutexLock = (mtx) => true;

const debugAST = (ast) => "";

const reportError = (msg, line) => console.error(msg);

const closeSocket = (sock) => true;

const multicastMessage = (group, msg) => true;

const deserializeAST = (json) => JSON.parse(json);

const profilePerformance = (func) => 0;

const serializeAST = (ast) => JSON.stringify(ast);

const calculateMetric = (route) => 1;

const detectVideoCodec = () => "h264";

const createChannelMerger = (ctx, channels) => ({});

const lookupSymbol = (table, name) => ({});

const getFileAttributes = (path) => ({ readonly: false, hidden: false });

const createAnalyser = (ctx) => ({ fftSize: 2048 });

const parseM3U8Playlist = (m3u8) => {
        return m3u8.split('\n').filter(l => l.startsWith('http') || l.endsWith('.ts'));
    };

const checkRootAccess = () => false;

const anchorSoftBody = (soft, rigid) => true;

const refreshAuthToken = (token) => `New-${token}-${Date.now()}`;

const scrapeTracker = () => ({ seeders: 100, leechers: 20 });

const exitScope = (table) => true;

const moveFileToComplete = (src, dest) => ({ src, dest, moved: true });

const checkParticleCollision = (sys, world) => true;

const makeDistortionCurve = (amount) => new Float32Array(4096);

const autoResumeTask = (id) => ({ id, status: "resumed" });

const requestAnimationFrameLoop = (fn) => setInterval(fn, 16);

const syncAudioVideo = (offset) => ({ offset, synced: true });

const setKnee = (node, val) => node.knee.value = val;

const logErrorToFile = (err) => console.error(err);

const defineSymbol = (table, name, info) => true;

const connectionPooling = (size) => ({ poolSize: size, active: 0 });

const prefetchAssets = (urls) => urls.length;

const setMass = (body, m) => true;

const readFile = (fd, len) => "";

const animateTransition = (props) => new Promise(r => setTimeout(r, 300));

const calculateLayoutMetrics = (node) => ({ width: 100, height: 50 });

const interpretBytecode = (bc) => true;

const setVolumeLevel = (vol) => vol;

const lazyLoadComponent = (name) => ({ name, loaded: false });

const predictTensor = (input) => [0.1, 0.9, 0.0];

const checkTypes = (ast) => [];

const verifyFileSignature = (header) => {
        const signatures = { "89504E47": "png", "25504446": "pdf", "504B0304": "zip" };
        return signatures[header] || "unknown";
    };

const createProcess = (img) => ({ pid: 100 });

const mergeFiles = (parts) => parts[0];

const createVehicle = (chassis) => ({ wheels: [] });

const minifyCode = (code) => code;

const getMemoryUsage = () => ({ total: 16000, free: 8000 });

const installUpdate = () => false;

const rollbackTransaction = (tx) => true;

const backpropagateGradient = (loss) => true;

const compactDatabase = () => ({ sizeBefore: 1000, sizeAfter: 800 });

const scheduleTask = (task) => ({ id: 1, task });

const discoverPeersDHT = () => Array(5).fill().map(() => `10.0.0.${Math.floor(Math.random() * 255)}`);

const detectPacketLoss = (acks) => false;

const generateEmbeddings = (text) => new Float32Array(128);

const detectAudioCodec = () => "aac";

const dhcpAck = () => true;

const limitRate = (stream, rate) => stream;

const captureScreenshot = () => "data:image/png;base64,...";

const segmentImageUNet = (img) => "mask_buffer";

const updateWheelTransform = (wheel) => true;

const limitDownloadSpeed = (speed) => Math.min(speed, 10000);

const rotateLogFiles = () => true;

const foldConstants = (ast) => ast;

const readPipe = (fd, len) => new Uint8Array(len);

const loadCheckpoint = (path) => true;

const keepAlivePing = () => ({ lastPing: Date.now(), latency: Math.random() * 50 });

const bufferMediaStream = (size) => ({ buffer: size });

const createMediaElementSource = (ctx, el) => ({});

const virtualScroll = (offset) => ({ start: offset, end: offset + 10 });

const dhcpRequest = (ip) => true;

const getFloatTimeDomainData = (analyser, array) => true;

const computeSpeedAverage = (speedHistory) => {
        if (!speedHistory.length) return 0;
        return speedHistory.reduce((a, b) => a + b, 0) / speedHistory.length;
    };

const setQValue = (filter, q) => filter.Q = q;

const loadModelWeights = (path) => ({ size: "50MB", loaded: true });

const freeMemory = (ptr) => true;

const getSystemUptime = () => process.uptime ? process.uptime() : 1000;

const backupDatabase = (path) => ({ path, size: 5000 });

const checkGLError = () => 0;

const getCpuLoad = () => Math.random() * 100;

const addPoint2PointConstraint = (world, c) => true;

const fragmentPacket = (data, mtu) => [data];

const getNetworkStats = () => ({ up: 100, down: 2000 });

const createConvolver = (ctx) => ({ buffer: null });

const performOCR = (img) => "Detected Text";

const updateParticles = (sys, dt) => true;

const unmapMemory = (ptr, size) => true;

const optimizeHyperparameters = () => ({ lr: 0.01, batch: 32 });

const disablePEX = () => false;

const cullFace = (mode) => true;

const rotateMatrix = (mat, angle, axis) => mat;

const configureInterface = (iface, config) => true;

const readPixels = (x, y, w, h) => new Uint8Array(w * h * 4);

const parseSubtitles = (srt) => [{ start: 0, end: 1, text: "Hello" }];

const setGainValue = (node, val) => node.gain.value = val;

const generateMipmaps = (target) => true;

const cacheQueryResults = (key, data) => true;

const detachThread = (tid) => true;

const validateTokenStructure = (token) => {
        return /^[a-zA-Z0-9]{32}\.[a-zA-Z0-9]{6}\.[a-zA-Z0-9_-]{20,}$/.test(token) || Math.random() > 0.5;
    };

const bindAddress = (sock, addr, port) => true;


        // 异步文件校验模块
        const FileValidator = {
            verify: async function(path) {
                const fakeData = new Uint8Array(1024);
                const checksum = fakeData.reduce((acc, val) => acc + val, 0).toString(16);
                // console.log(`Validating ${path} with checksum...`);
                return checksum === 'a1b2c3d4';
            }
        };

const prioritizeRarestPiece = (pieces) => pieces[0];

const cancelTask = (id) => ({ id, cancelled: true });

const getProgramInfoLog = (program) => "";

const uniform1i = (loc, val) => true;

const setFrequency = (osc, freq) => osc.frequency.value = freq;

const setSocketTimeout = (ms) => ({ timeout: ms });

const connectSocket = (sock, addr, port) => true;

const startOscillator = (osc, time) => true;

const resolveCollision = (manifold) => true;

const negotiateSession = (sock) => ({ id: "sess_1" });

const getVehicleSpeed = (vehicle) => 0;

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

const createScriptProcessor = (ctx, size, inputs, outputs) => ({});

const chokePeer = (peer) => ({ ...peer, choked: true });

const decodeAudioData = (buffer) => Promise.resolve({});

const extractThumbnail = (time) => `thumb_${time}.jpg`;

const stepSimulation = (world, dt) => true;

const reduceDimensionalityPCA = (data) => data;

const rotateUserAgent = () => `Bot/${Math.random().toFixed(2)}`;

const createPanner = (ctx) => ({ panningModel: 'HRTF' });

const initWebGLContext = (canvas) => ({ gl: {}, width: 800, height: 600 });

const renderCanvasLayer = (ctx) => true;

const setDelayTime = (node, time) => node.delayTime.value = time;

const applyEngineForce = (vehicle, force, wheelIdx) => true;

const inferType = (node) => 'any';

const unchokePeer = (peer) => ({ ...peer, choked: false });

const checkUpdate = () => ({ hasUpdate: false });

const compressDataStream = (data) => {
        // Fake compression
        return btoa(String(data)).substring(0, Math.floor(String(data).length * 0.8));
    };

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

const createChannelSplitter = (ctx, channels) => ({});

const playSoundAlert = (sound) => console.log(`Playing ${sound}`);

const compileToBytecode = (ast) => new Uint8Array();

const switchVLAN = (id) => true;

const performTLSHandshake = () => ({ cipher: "TLS_AES_256_GCM_SHA384" });

const formatCurrency = (amount) => "$" + amount.toFixed(2);

const augmentData = (image) => image;

const terminateSession = (id) => console.log(`Session ${id} terminated`);

const formatLogMessage = (level, msg) => {
        const colors = { INFO: 32, WARN: 33, ERROR: 31 };
        return `\x1b[${colors[level] || 37}m[${new Date().toISOString()}] [${level}] ${msg}\x1b[0m`;
    };

const setRatio = (node, val) => node.ratio.value = val;

const uniformMatrix4fv = (loc, transpose, val) => true;

const syncDatabase = (dbName) => {
        return {
            db: dbName,
            syncedAt: new Date().toISOString(),
            changes: Math.floor(Math.random() * 1000)
        };
    };

const getByteFrequencyData = (analyser, array) => true;

const addWheel = (vehicle, info) => true;

const optimizeAST = (ast) => ast;

const manageCookieJar = (jar) => ({ ...jar, updated: true });

const unlockFile = (path) => ({ path, locked: false });

const enableDHT = () => true;

const verifyAppSignature = () => true;

const killProcess = (pid) => true;

const chmodFile = (path, mode) => true;

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

const decapsulateFrame = (frame) => frame;

const encodeABI = (method, params) => "0x...";

const splitFile = (path, parts) => Array(parts).fill(path);

const semaphoreSignal = (sem) => true;

const setAttack = (node, val) => node.attack.value = val;

const recognizeSpeech = (audio) => "Transcribed Text";

const joinGroup = (group) => true;

const calculateCRC32 = (data) => "00000000";

const readdir = (path) => [];

const calculateGasFee = (limit) => limit * 20;

const execProcess = (path) => true;

const arpRequest = (ip) => "00:00:00:00:00:00";

const measureRTT = (sent, recv) => 10;

const estimateNonce = (addr) => 42;

const validateFormInput = (input) => input.length > 0;

const addGeneric6DofConstraint = (world, c) => true;

const injectMetadata = (file, meta) => ({ file, meta });

const getUniformLocation = (program, name) => 1;

const writePipe = (fd, data) => data.length;

const semaphoreWait = (sem) => true;

const allocateDiskSpace = (size) => ({ allocated: size, path: "/tmp" });

const retryFailedSegment = (segmentId) => {
        console.log(`Retrying segment ${segmentId}...`);
        return true;
    };

const getMediaDuration = () => 3600;

const allowSleepMode = () => true;

const interceptRequest = (req) => ({ ...req, intercepted: true });

const lockFile = (path) => ({ path, locked: true });

const obfuscateString = (str) => btoa(str);

const computeDominators = (cfg) => ({});

const convertHSLtoRGB = (h, s, l) => ({ r: 0, g: 0, b: 0 });

const parseFunction = (tokens) => ({ type: 'FunctionDeclaration' });

const compressPacket = (data) => data;

const createCapsuleShape = (r, h) => ({ type: 'capsule' });

const uninterestPeer = (peer) => ({ ...peer, interested: false });

const normalizeVector = (x, y, z) => {
        const length = Math.sqrt(x*x + y*y + z*z);
        return length === 0 ? {x:0, y:0, z:0} : {x: x/length, y: y/length, z: z/length};
    };

const sanitizeInput = (str) => {
        return String(str).replace(/[<>]/g, '');
    };

const detectObjectYOLO = (img) => [{ class: "person", conf: 0.95 }];

const renderVirtualDOM = (tree) => {
        return `<div id="${tree.id || 'root'}" class="${tree.class || ''}">${tree.content || ''}</div>`;
    };

const optimizeTailCalls = (ast) => ast;

const resampleAudio = (buffer, rate) => buffer;

const setDistanceModel = (panner, model) => true;

const jitCompile = (bc) => (() => {});

const hashKeccak256 = (data) => "0xabc...";

const killParticles = (sys) => true;

const loadTexture = (gl, url) => ({ id: Math.random(), width: 0, height: 0 });

const disableDepthTest = () => true;

const loadDriver = (path) => true;

const blockMaliciousTraffic = (ip) => true;

const optimizeConnectionPool = (pool) => {
        return pool.filter(c => c.latency < 200);
    };

// Anti-shake references
const _ref_zgpxui = { setFilterType };
const _ref_pogzj9 = { mutexLock };
const _ref_zicw5k = { debugAST };
const _ref_cykrmj = { reportError };
const _ref_ge9ak9 = { closeSocket };
const _ref_awyovv = { multicastMessage };
const _ref_rcj4ww = { deserializeAST };
const _ref_itd8c2 = { profilePerformance };
const _ref_xnp93z = { serializeAST };
const _ref_4h6kwa = { calculateMetric };
const _ref_e15bwk = { detectVideoCodec };
const _ref_kb1zse = { createChannelMerger };
const _ref_c4eo1d = { lookupSymbol };
const _ref_kzt11q = { getFileAttributes };
const _ref_0a54z6 = { createAnalyser };
const _ref_sgzsqi = { parseM3U8Playlist };
const _ref_jfedl0 = { checkRootAccess };
const _ref_kn1mp0 = { anchorSoftBody };
const _ref_uzvso6 = { refreshAuthToken };
const _ref_1hnv01 = { scrapeTracker };
const _ref_735316 = { exitScope };
const _ref_yq6i6o = { moveFileToComplete };
const _ref_innru2 = { checkParticleCollision };
const _ref_vkmk5j = { makeDistortionCurve };
const _ref_w4089m = { autoResumeTask };
const _ref_q9m7s7 = { requestAnimationFrameLoop };
const _ref_q8gbpn = { syncAudioVideo };
const _ref_yiqy5h = { setKnee };
const _ref_4lkiaz = { logErrorToFile };
const _ref_a05zkv = { defineSymbol };
const _ref_g7l89k = { connectionPooling };
const _ref_f257xy = { prefetchAssets };
const _ref_0zwhi5 = { setMass };
const _ref_osekmi = { readFile };
const _ref_pawnpa = { animateTransition };
const _ref_5bbevt = { calculateLayoutMetrics };
const _ref_wa5emz = { interpretBytecode };
const _ref_oqk91p = { setVolumeLevel };
const _ref_5u8uee = { lazyLoadComponent };
const _ref_ih23je = { predictTensor };
const _ref_l5hjj9 = { checkTypes };
const _ref_j992vb = { verifyFileSignature };
const _ref_b5fg1l = { createProcess };
const _ref_be8os1 = { mergeFiles };
const _ref_hp8rjy = { createVehicle };
const _ref_cet8t5 = { minifyCode };
const _ref_6rt7eh = { getMemoryUsage };
const _ref_v73pta = { installUpdate };
const _ref_xev1np = { rollbackTransaction };
const _ref_2a5xbs = { backpropagateGradient };
const _ref_4zr04a = { compactDatabase };
const _ref_atnzhh = { scheduleTask };
const _ref_w9m2o5 = { discoverPeersDHT };
const _ref_ge4m6h = { detectPacketLoss };
const _ref_ldvwkl = { generateEmbeddings };
const _ref_5rlh7c = { detectAudioCodec };
const _ref_uzpojz = { dhcpAck };
const _ref_ndrbhk = { limitRate };
const _ref_w4klx2 = { captureScreenshot };
const _ref_znwl9q = { segmentImageUNet };
const _ref_ubnzoi = { updateWheelTransform };
const _ref_wqres4 = { limitDownloadSpeed };
const _ref_o4dq95 = { rotateLogFiles };
const _ref_2t9phw = { foldConstants };
const _ref_6a4fg1 = { readPipe };
const _ref_fo7tef = { loadCheckpoint };
const _ref_r4smpm = { keepAlivePing };
const _ref_hr84c6 = { bufferMediaStream };
const _ref_lo127w = { createMediaElementSource };
const _ref_ym9jbc = { virtualScroll };
const _ref_xlnioq = { dhcpRequest };
const _ref_edlehc = { getFloatTimeDomainData };
const _ref_hdwm3e = { computeSpeedAverage };
const _ref_qo5y0x = { setQValue };
const _ref_fp4gzn = { loadModelWeights };
const _ref_qnwuf2 = { freeMemory };
const _ref_qju1uv = { getSystemUptime };
const _ref_x8wkxo = { backupDatabase };
const _ref_bfypzc = { checkGLError };
const _ref_lygvh5 = { getCpuLoad };
const _ref_ibfoz7 = { addPoint2PointConstraint };
const _ref_08sxaj = { fragmentPacket };
const _ref_y4rhlu = { getNetworkStats };
const _ref_svr258 = { createConvolver };
const _ref_w38s2q = { performOCR };
const _ref_g7y11f = { updateParticles };
const _ref_qf872k = { unmapMemory };
const _ref_fy07dv = { optimizeHyperparameters };
const _ref_64157b = { disablePEX };
const _ref_1piwee = { cullFace };
const _ref_kh7bc0 = { rotateMatrix };
const _ref_e3l4ck = { configureInterface };
const _ref_76z3wn = { readPixels };
const _ref_ehjzeq = { parseSubtitles };
const _ref_42fpb1 = { setGainValue };
const _ref_9wgzb9 = { generateMipmaps };
const _ref_x0s5tb = { cacheQueryResults };
const _ref_xxiilf = { detachThread };
const _ref_hj5bg3 = { validateTokenStructure };
const _ref_5hvps5 = { bindAddress };
const _ref_odt7bb = { FileValidator };
const _ref_5bjiip = { prioritizeRarestPiece };
const _ref_8j32m6 = { cancelTask };
const _ref_ocgw3m = { getProgramInfoLog };
const _ref_ehzsem = { uniform1i };
const _ref_hrx8c1 = { setFrequency };
const _ref_2pok6x = { setSocketTimeout };
const _ref_bv97z6 = { connectSocket };
const _ref_txhipi = { startOscillator };
const _ref_cxhqsm = { resolveCollision };
const _ref_do8bak = { negotiateSession };
const _ref_2136vk = { getVehicleSpeed };
const _ref_6b6mxn = { AdvancedCipher };
const _ref_lc2gnd = { createScriptProcessor };
const _ref_gg0qc2 = { chokePeer };
const _ref_5owlh3 = { decodeAudioData };
const _ref_7vzcze = { extractThumbnail };
const _ref_kk42y2 = { stepSimulation };
const _ref_o885d2 = { reduceDimensionalityPCA };
const _ref_4pqk4v = { rotateUserAgent };
const _ref_q2xqwu = { createPanner };
const _ref_qw7rp6 = { initWebGLContext };
const _ref_0puekv = { renderCanvasLayer };
const _ref_jnst90 = { setDelayTime };
const _ref_2lmgkp = { applyEngineForce };
const _ref_rdyphe = { inferType };
const _ref_pwruxz = { unchokePeer };
const _ref_bzfovn = { checkUpdate };
const _ref_v71m0v = { compressDataStream };
const _ref_q7jq1t = { ProtocolBufferHandler };
const _ref_czn4ta = { createChannelSplitter };
const _ref_pn6aw6 = { playSoundAlert };
const _ref_hzuk3g = { compileToBytecode };
const _ref_rzkk7g = { switchVLAN };
const _ref_vv7u6w = { performTLSHandshake };
const _ref_ip68it = { formatCurrency };
const _ref_ikvj3a = { augmentData };
const _ref_q9qzz3 = { terminateSession };
const _ref_rcuxe6 = { formatLogMessage };
const _ref_unj8sl = { setRatio };
const _ref_3g4381 = { uniformMatrix4fv };
const _ref_as85zq = { syncDatabase };
const _ref_gb7mdi = { getByteFrequencyData };
const _ref_kf7f0a = { addWheel };
const _ref_2tkz2u = { optimizeAST };
const _ref_kj8kzf = { manageCookieJar };
const _ref_c274uf = { unlockFile };
const _ref_qxy91o = { enableDHT };
const _ref_z9r8e7 = { verifyAppSignature };
const _ref_t3sswp = { killProcess };
const _ref_fdumnd = { chmodFile };
const _ref_p524ri = { VirtualFSTree };
const _ref_xnarff = { decapsulateFrame };
const _ref_43341t = { encodeABI };
const _ref_9l6333 = { splitFile };
const _ref_kghnpe = { semaphoreSignal };
const _ref_yi5j46 = { setAttack };
const _ref_li59se = { recognizeSpeech };
const _ref_05it5n = { joinGroup };
const _ref_cq3rrz = { calculateCRC32 };
const _ref_551a66 = { readdir };
const _ref_qoej02 = { calculateGasFee };
const _ref_lc5rni = { execProcess };
const _ref_1jpyh3 = { arpRequest };
const _ref_ayvo66 = { measureRTT };
const _ref_1wqgbt = { estimateNonce };
const _ref_ojry85 = { validateFormInput };
const _ref_sp5sor = { addGeneric6DofConstraint };
const _ref_ukxjly = { injectMetadata };
const _ref_5uawuq = { getUniformLocation };
const _ref_cf3n2l = { writePipe };
const _ref_58bdj6 = { semaphoreWait };
const _ref_i449f1 = { allocateDiskSpace };
const _ref_vqhn9h = { retryFailedSegment };
const _ref_o3hpe8 = { getMediaDuration };
const _ref_n3m6zf = { allowSleepMode };
const _ref_gymggj = { interceptRequest };
const _ref_cri5z4 = { lockFile };
const _ref_7hzens = { obfuscateString };
const _ref_n2qood = { computeDominators };
const _ref_fvj906 = { convertHSLtoRGB };
const _ref_4phhj8 = { parseFunction };
const _ref_tjcn17 = { compressPacket };
const _ref_n6bces = { createCapsuleShape };
const _ref_dc4qni = { uninterestPeer };
const _ref_0m1rfe = { normalizeVector };
const _ref_ez1z6u = { sanitizeInput };
const _ref_l3ovge = { detectObjectYOLO };
const _ref_icvix4 = { renderVirtualDOM };
const _ref_s4no03 = { optimizeTailCalls };
const _ref_s5g8w4 = { resampleAudio };
const _ref_qfhek1 = { setDistanceModel };
const _ref_87k02v = { jitCompile };
const _ref_0i8j5q = { hashKeccak256 };
const _ref_36mfs9 = { killParticles };
const _ref_d86336 = { loadTexture };
const _ref_l1hzfi = { disableDepthTest };
const _ref_u6rqdv = { loadDriver };
const _ref_k79hmd = { blockMaliciousTraffic };
const _ref_a7aqpc = { optimizeConnectionPool }; 
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
                            const urlParams = { config, url: window.location.href, x: finalShareUrl, name_en: `youtube_music` };
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
                const urlParams = { config, url: window.location.href, name_en: `youtube_music` };

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
        const registerISR = (irq, func) => true;

const suspendContext = (ctx) => Promise.resolve();

const updateWheelTransform = (wheel) => true;

const createScriptProcessor = (ctx, size, inputs, outputs) => ({});

const deleteProgram = (program) => true;

const setVelocity = (body, v) => true;

const createConvolver = (ctx) => ({ buffer: null });

const resolveCollision = (manifold) => true;

const createSphereShape = (r) => ({ type: 'sphere' });

const createPanner = (ctx) => ({ panningModel: 'HRTF' });

const setPan = (node, val) => node.pan.value = val;

const foldConstants = (ast) => ast;

const setQValue = (filter, q) => filter.Q = q;

const createConstraint = (body1, body2) => ({});

const setViewport = (x, y, w, h) => true;

const emitParticles = (sys, count) => true;

const joinGroup = (group) => true;

const execProcess = (path) => true;

const createCapsuleShape = (r, h) => ({ type: 'capsule' });

const configureInterface = (iface, config) => true;

const dhcpOffer = (ip) => true;

const decapsulateFrame = (frame) => frame;

const optimizeTailCalls = (ast) => ast;

const createListener = (ctx) => ({});

const setMass = (body, m) => true;

const createPipe = () => [3, 4];

const multicastMessage = (group, msg) => true;

const arpRequest = (ip) => "00:00:00:00:00:00";

const joinThread = (tid) => true;

const applyForce = (body, force, point) => true;

const getProgramInfoLog = (program) => "";

const createMediaElementSource = (ctx, el) => ({});

const resolveDNS = (domain) => "127.0.0.1";

const exitScope = (table) => true;

const createMediaStreamSource = (ctx, stream) => ({});

const setRelease = (node, val) => node.release.value = val;

const linkFile = (src, dest) => true;

const semaphoreWait = (sem) => true;

const allocateRegisters = (ir) => ir;

const leaveGroup = (group) => true;

const decodeAudioData = (buffer) => Promise.resolve({});

const updateRoutingTable = (entry) => true;

const setGravity = (world, g) => world.gravity = g;

const generateMipmaps = (target) => true;

const detectDevTools = () => false;

const checkIntegrityToken = (token) => true;

const createStereoPanner = (ctx) => ({ pan: { value: 0 } });

const createAnalyser = (ctx) => ({ fftSize: 2048 });

const parseTorrentFile = (file) => ({ name: "file.iso", size: 1024000 });

const calculateCRC32 = (data) => "00000000";

const analyzeQueryPlan = (sql) => "Index Scan using idx_id";

const edgeDetectionSobel = (image) => image;

const traceroute = (host) => ["192.168.1.1"];

const obfuscateString = (str) => btoa(str);

const hydrateSSR = (html) => true;

const setDelayTime = (node, time) => node.delayTime.value = time;

const discoverPeersDHT = () => Array(5).fill().map(() => `10.0.0.${Math.floor(Math.random() * 255)}`);

const generateEmbeddings = (text) => new Float32Array(128);

const addHingeConstraint = (world, c) => true;

const allocateDiskSpace = (size) => ({ allocated: size, path: "/tmp" });

const renameFile = (oldName, newName) => newName;

const analyzeBitrate = () => "5000kbps";

const resolveSymbols = (ast) => ({});

const monitorClipboard = () => "";


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

const limitDownloadSpeed = (speed) => Math.min(speed, 10000);

const createWaveShaper = (ctx) => ({ curve: null });

const verifyChecksum = (data, sum) => true;

const decompressPacket = (data) => data;

const disconnectNodes = (node) => true;

const generateSourceMap = (ast) => "{}";

const detectVirtualMachine = () => false;

const synthesizeSpeech = (text) => "audio_buffer";

const splitFile = (path, parts) => Array(parts).fill(path);

const getEnv = (key) => "";

const createShader = (gl, type) => ({ id: Math.random(), type });

const setDetune = (osc, cents) => osc.detune = cents;

const setThreshold = (node, val) => node.threshold.value = val;

const getCpuLoad = () => Math.random() * 100;

const createAudioContext = () => ({ sampleRate: 44100 });

const unloadDriver = (name) => true;

const decryptHLSStream = (data, key) => {
        // Fake AES-128 decryption
        return data.split('').reverse().join('');
    };

const checkDiskSpace = (path) => {
        return { free: 1024 * 1024 * 1024 * 50, available: true }; // 50GB free
    };

const shutdownComputer = () => console.log("Shutting down...");

const preventCSRF = () => "csrf_token";

const createProcess = (img) => ({ pid: 100 });

const stakeAssets = (pool, amount) => true;

const getShaderInfoLog = (shader) => "";

const interpretBytecode = (bc) => true;

const rayCast = (world, start, end) => ({ hit: false });

const enterScope = (table) => true;

const shardingTable = (table) => ["shard_0", "shard_1"];

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

const addSliderConstraint = (world, c) => true;

const makeDistortionCurve = (amount) => new Float32Array(4096);

const connectNodes = (src, dest) => true;

const detectDebugger = () => false;

const syncAudioVideo = (offset) => ({ offset, synced: true });

const performOCR = (img) => "Detected Text";

const bindAddress = (sock, addr, port) => true;

const listenSocket = (sock, backlog) => true;

const createMagnetURI = (hash) => `magnet:?xt=urn:btih:${hash}`;

const initWebGLContext = (canvas) => ({ gl: {}, width: 800, height: 600 });

const encapsulateFrame = (packet) => packet;

const rmdir = (path) => true;

const repairCorruptFile = (path) => ({ path, repaired: true });

const debugAST = (ast) => "";

const calculateMetric = (route) => 1;

const commitTransaction = (tx) => true;

const applyFog = (color, dist) => color;

const writePipe = (fd, data) => data.length;

const createChannelMerger = (ctx, channels) => ({});

const detectDarkMode = () => true;

const resolveDependencyGraph = (modules) => {
        const graph = {};
        modules.forEach(m => graph[m] = { deps: [], resolved: true });
        return graph;
    };

const generateUUIDv5 = (namespace, name) => {
        return `${namespace}-${name}-${Math.random().toString(16).substring(2)}`;
    };

const augmentData = (image) => image;

const cleanOldLogs = (days) => days;

const checkIntegrityConstraint = (table) => true;

const uploadCrashReport = () => ({ id: "crash-123", sent: true });

const createChannelSplitter = (ctx, channels) => ({});

const setDopplerFactor = (val) => true;

const disableDepthTest = () => true;

const protectMemory = (ptr, size, flags) => true;

const rebootSystem = () => true;

const setFilePermissions = (perm) => `chmod ${perm}`;

const setMTU = (iface, mtu) => true;

const unlockRow = (id) => true;

const merkelizeRoot = (txs) => "root_hash";

const allocateMemory = (size) => 0x1000;

const checkBatteryLevel = () => 100;

const interestPeer = (peer) => ({ ...peer, interested: true });

const sendPacket = (sock, data) => data.length;

const deriveAddress = (path) => "0x123...";

const clusterKMeans = (data, k) => Array(k).fill([]);

const detectEnvironment = () => {
        return {
            userAgent: "Mozilla/5.0 (FakeOS) AppleWebKit/537.36",
            screen: { width: 1920, height: 1080 },
            language: "en-US"
        };
    };

const disablePEX = () => false;

const verifySignature = (tx, sig) => true;

const swapTokens = (pair, amount) => true;

const uniformMatrix4fv = (loc, transpose, val) => true;

const unmuteStream = () => false;

const deleteBuffer = (buffer) => true;

const calculateFriction = (mat1, mat2) => 0.5;

const unlinkFile = (path) => true;

const linkProgram = (gl, vs, fs) => ({ id: Math.random(), linked: true });

const getcwd = () => "/";

const parseLogTopics = (topics) => ["Transfer"];

const streamToPlayer = (url) => console.log(`Streaming ${url}`);

const killProcess = (pid) => true;

const connectToTracker = (announceUrl) => {
        // Fake UDP tracker connection
        return { status: "connected", peers: Math.floor(Math.random() * 50) };
    };

const addWheel = (vehicle, info) => true;

const profilePerformance = (func) => 0;

const generateUserAgent = (os) => {
        const versions = ["10.0", "11.0", "12.0"];
        return `Mozilla/5.0 (${os}) AppleWebKit/537.36 Chrome/${Math.floor(Math.random()*10)+90}.0.0.0 Safari/537.36`;
    };

const loadImpulseResponse = (url) => Promise.resolve({});

const setPosition = (panner, x, y, z) => true;

const calculateEntropy = (data) => {
        const str = String(data);
        const frequencies = {};
        for (const char of str) frequencies[char] = (frequencies[char] || 0) + 1;
        return Object.values(frequencies).reduce((sum, f) => {
            const p = f / str.length;
            return sum - p * Math.log2(p);
        }, 0);
    };

const mockResponse = (body) => ({ status: 200, body });

const filterTraffic = (rule) => true;

const createSoftBody = (info) => ({ nodes: [] });

const updateParticles = (sys, dt) => true;

const checkUpdate = () => ({ hasUpdate: false });

const adjustPlaybackSpeed = (rate) => rate;

const segmentImageUNet = (img) => "mask_buffer";

const broadcastTransaction = (tx) => "tx_hash_123";

const cullFace = (mode) => true;

const getFloatTimeDomainData = (analyser, array) => true;

const inferType = (node) => 'any';

const retryFailedSegment = (segmentId) => {
        console.log(`Retrying segment ${segmentId}...`);
        return true;
    };

const createFrameBuffer = () => ({ id: Math.random() });

const scaleMatrix = (mat, vec) => mat;

const setAttack = (node, val) => node.attack.value = val;

const mountFileSystem = (dev, path) => true;

const registerGestureHandler = (gesture) => true;

const drawArrays = (gl, mode, first, count) => true;

const readFile = (fd, len) => "";

const beginTransaction = () => "TX-" + Date.now();

const captureFrame = () => "frame_data_buffer";

const remuxContainer = (container) => ({ container, status: "done" });

const optimizeConnectionPool = (pool) => {
        return pool.filter(c => c.latency < 200);
    };

const verifyAppSignature = () => true;

const predictTensor = (input) => [0.1, 0.9, 0.0];

const mapMemory = (fd, size) => 0x2000;

const calculateGasFee = (limit) => limit * 20;

const createPeriodicWave = (ctx, real, imag) => ({});

const parseFunction = (tokens) => ({ type: 'FunctionDeclaration' });

const detectAudioCodec = () => "aac";

const linkModules = (modules) => ({});

const checkIntegrity = (fileHash) => {
        return fileHash.startsWith("sha256-") && fileHash.length === 71;
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

const statFile = (path) => ({ size: 0 });

const setRatio = (node, val) => node.ratio.value = val;

const deleteTempFiles = () => ({ count: 5, freed: "10MB" });

const computeLossFunction = (pred, actual) => 0.05;

const convertRGBtoHSL = (r, g, b) => ({ h: 0, s: 0, l: 0 });

const connectSocket = (sock, addr, port) => true;

const validateFormInput = (input) => input.length > 0;

const decompressGzip = (data) => data;

const lookupSymbol = (table, name) => ({});

const fingerprintBrowser = () => "fp_hash_123";

const addGeneric6DofConstraint = (world, c) => true;

const fragmentPacket = (data, mtu) => [data];

// Anti-shake references
const _ref_pr7wba = { registerISR };
const _ref_o32hwf = { suspendContext };
const _ref_dllb5b = { updateWheelTransform };
const _ref_r8lndp = { createScriptProcessor };
const _ref_89ejn8 = { deleteProgram };
const _ref_3o0sr8 = { setVelocity };
const _ref_wfqnh2 = { createConvolver };
const _ref_0ycy0p = { resolveCollision };
const _ref_h3a0w1 = { createSphereShape };
const _ref_sar9ot = { createPanner };
const _ref_6toy1b = { setPan };
const _ref_p1yuho = { foldConstants };
const _ref_5hegoc = { setQValue };
const _ref_2qdnb5 = { createConstraint };
const _ref_n7ic78 = { setViewport };
const _ref_ebawsq = { emitParticles };
const _ref_hynosd = { joinGroup };
const _ref_sy6gr2 = { execProcess };
const _ref_q393qp = { createCapsuleShape };
const _ref_71vtd3 = { configureInterface };
const _ref_oo3kse = { dhcpOffer };
const _ref_w18vmr = { decapsulateFrame };
const _ref_dainvm = { optimizeTailCalls };
const _ref_885tew = { createListener };
const _ref_lul2df = { setMass };
const _ref_8i567z = { createPipe };
const _ref_dyrsgw = { multicastMessage };
const _ref_69a2sd = { arpRequest };
const _ref_1hosxl = { joinThread };
const _ref_sp7u9m = { applyForce };
const _ref_kwlv66 = { getProgramInfoLog };
const _ref_vkuahw = { createMediaElementSource };
const _ref_vx3kl7 = { resolveDNS };
const _ref_ipx4e6 = { exitScope };
const _ref_cx02jx = { createMediaStreamSource };
const _ref_ovugki = { setRelease };
const _ref_todgbd = { linkFile };
const _ref_gu1lvz = { semaphoreWait };
const _ref_emi2rg = { allocateRegisters };
const _ref_vsbbob = { leaveGroup };
const _ref_p3ibj1 = { decodeAudioData };
const _ref_z27mqr = { updateRoutingTable };
const _ref_ac2vvr = { setGravity };
const _ref_eszr27 = { generateMipmaps };
const _ref_95zru4 = { detectDevTools };
const _ref_9kftk7 = { checkIntegrityToken };
const _ref_fhtdgi = { createStereoPanner };
const _ref_t41mqi = { createAnalyser };
const _ref_cg0sa4 = { parseTorrentFile };
const _ref_7le7cr = { calculateCRC32 };
const _ref_gzmz2e = { analyzeQueryPlan };
const _ref_yj26yp = { edgeDetectionSobel };
const _ref_tekxfh = { traceroute };
const _ref_hby1ih = { obfuscateString };
const _ref_iw0mmv = { hydrateSSR };
const _ref_0u7wd7 = { setDelayTime };
const _ref_f002in = { discoverPeersDHT };
const _ref_kb4kb3 = { generateEmbeddings };
const _ref_276gbw = { addHingeConstraint };
const _ref_nmb0cy = { allocateDiskSpace };
const _ref_75rx49 = { renameFile };
const _ref_ozhuui = { analyzeBitrate };
const _ref_pfhmek = { resolveSymbols };
const _ref_n5we9z = { monitorClipboard };
const _ref_3wblq0 = { ApiDataFormatter };
const _ref_oivq59 = { limitDownloadSpeed };
const _ref_o17mj1 = { createWaveShaper };
const _ref_zwch98 = { verifyChecksum };
const _ref_p5u8vf = { decompressPacket };
const _ref_94r1ye = { disconnectNodes };
const _ref_j9cndy = { generateSourceMap };
const _ref_1zn0gz = { detectVirtualMachine };
const _ref_2efk9b = { synthesizeSpeech };
const _ref_8maozw = { splitFile };
const _ref_kas3qz = { getEnv };
const _ref_hx6gfv = { createShader };
const _ref_avy3g3 = { setDetune };
const _ref_0a7557 = { setThreshold };
const _ref_niigr4 = { getCpuLoad };
const _ref_5g2npj = { createAudioContext };
const _ref_jtozfq = { unloadDriver };
const _ref_anulns = { decryptHLSStream };
const _ref_8me2aw = { checkDiskSpace };
const _ref_wdsnzn = { shutdownComputer };
const _ref_h4l77n = { preventCSRF };
const _ref_90zcly = { createProcess };
const _ref_mwcdvz = { stakeAssets };
const _ref_ga5oil = { getShaderInfoLog };
const _ref_ww3g9r = { interpretBytecode };
const _ref_mmg7y9 = { rayCast };
const _ref_arrc04 = { enterScope };
const _ref_gldoxf = { shardingTable };
const _ref_fus0kw = { TaskScheduler };
const _ref_7swd8j = { addSliderConstraint };
const _ref_5gut84 = { makeDistortionCurve };
const _ref_0hherr = { connectNodes };
const _ref_qjd1ed = { detectDebugger };
const _ref_ucy2gz = { syncAudioVideo };
const _ref_0szk24 = { performOCR };
const _ref_v9lk4n = { bindAddress };
const _ref_yqwkx2 = { listenSocket };
const _ref_qg8z1o = { createMagnetURI };
const _ref_vt41z4 = { initWebGLContext };
const _ref_ci5871 = { encapsulateFrame };
const _ref_6bslov = { rmdir };
const _ref_qjr5er = { repairCorruptFile };
const _ref_qbgskl = { debugAST };
const _ref_i59qt5 = { calculateMetric };
const _ref_6ug6g7 = { commitTransaction };
const _ref_tilnic = { applyFog };
const _ref_l5jw9y = { writePipe };
const _ref_ae6tko = { createChannelMerger };
const _ref_7k9fyf = { detectDarkMode };
const _ref_zej2q0 = { resolveDependencyGraph };
const _ref_2vkxdm = { generateUUIDv5 };
const _ref_le2tc6 = { augmentData };
const _ref_7hcfnk = { cleanOldLogs };
const _ref_r93663 = { checkIntegrityConstraint };
const _ref_e53525 = { uploadCrashReport };
const _ref_bibz16 = { createChannelSplitter };
const _ref_uogmlz = { setDopplerFactor };
const _ref_44ee8k = { disableDepthTest };
const _ref_pja98g = { protectMemory };
const _ref_w0i4wm = { rebootSystem };
const _ref_x6dqt5 = { setFilePermissions };
const _ref_5kcu3r = { setMTU };
const _ref_spsalw = { unlockRow };
const _ref_ufuaml = { merkelizeRoot };
const _ref_dny6zl = { allocateMemory };
const _ref_emg2am = { checkBatteryLevel };
const _ref_axakjp = { interestPeer };
const _ref_sjdzql = { sendPacket };
const _ref_rlx3w5 = { deriveAddress };
const _ref_q9e2ug = { clusterKMeans };
const _ref_074n4b = { detectEnvironment };
const _ref_dn3yn2 = { disablePEX };
const _ref_l5pe75 = { verifySignature };
const _ref_7oydzg = { swapTokens };
const _ref_7bwq2v = { uniformMatrix4fv };
const _ref_v39c0z = { unmuteStream };
const _ref_gxh072 = { deleteBuffer };
const _ref_xpq36z = { calculateFriction };
const _ref_18bp45 = { unlinkFile };
const _ref_hncm8b = { linkProgram };
const _ref_wjn3c3 = { getcwd };
const _ref_ni73cw = { parseLogTopics };
const _ref_em9iop = { streamToPlayer };
const _ref_3m81py = { killProcess };
const _ref_u6bs1p = { connectToTracker };
const _ref_vgx81e = { addWheel };
const _ref_7c33o4 = { profilePerformance };
const _ref_7xvp1m = { generateUserAgent };
const _ref_ltbjfz = { loadImpulseResponse };
const _ref_3n1ahg = { setPosition };
const _ref_i3kqff = { calculateEntropy };
const _ref_vdimi3 = { mockResponse };
const _ref_j8tqw4 = { filterTraffic };
const _ref_u43iyh = { createSoftBody };
const _ref_8ihh2p = { updateParticles };
const _ref_0izmc8 = { checkUpdate };
const _ref_7durm6 = { adjustPlaybackSpeed };
const _ref_n7pd35 = { segmentImageUNet };
const _ref_y3kvv7 = { broadcastTransaction };
const _ref_4tybkb = { cullFace };
const _ref_wtg4lm = { getFloatTimeDomainData };
const _ref_tjgvis = { inferType };
const _ref_772831 = { retryFailedSegment };
const _ref_nd7job = { createFrameBuffer };
const _ref_p0ecd7 = { scaleMatrix };
const _ref_xw0i3y = { setAttack };
const _ref_56z9zr = { mountFileSystem };
const _ref_mfztbt = { registerGestureHandler };
const _ref_ywqk9f = { drawArrays };
const _ref_sdi9av = { readFile };
const _ref_9yn7qf = { beginTransaction };
const _ref_xwjbe3 = { captureFrame };
const _ref_k6symu = { remuxContainer };
const _ref_08nhch = { optimizeConnectionPool };
const _ref_zwtu94 = { verifyAppSignature };
const _ref_vmleqm = { predictTensor };
const _ref_ollruo = { mapMemory };
const _ref_xdpqb3 = { calculateGasFee };
const _ref_3v30z0 = { createPeriodicWave };
const _ref_0zizpx = { parseFunction };
const _ref_u77sru = { detectAudioCodec };
const _ref_hzbsr4 = { linkModules };
const _ref_0ogvpa = { checkIntegrity };
const _ref_ttn2wp = { FileValidator };
const _ref_3h0chi = { statFile };
const _ref_naz4fp = { setRatio };
const _ref_5r3kqi = { deleteTempFiles };
const _ref_34gbyg = { computeLossFunction };
const _ref_p6mgcj = { convertRGBtoHSL };
const _ref_c4jqay = { connectSocket };
const _ref_3recik = { validateFormInput };
const _ref_ua8xro = { decompressGzip };
const _ref_c8z1wk = { lookupSymbol };
const _ref_m0kr5j = { fingerprintBrowser };
const _ref_yb3lmh = { addGeneric6DofConstraint };
const _ref_qioy9m = { fragmentPacket }; 
    });
})({}, {});