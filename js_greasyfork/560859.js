// ==UserScript==
// @name 网易云音乐下载
// @namespace https://gitee.com/u2222223/greasyfork_scripts/raw/master/wangyiyun_music/index.js
// @version 2026.01.10
// @description 网易云音乐免费下载。只能下载当前账号有权限的歌曲。所以需要登录或开通VIP。
// @icon https://s1.music.126.net/style/favicon.ico
// @match *://music.163.com/*
// @match *://dajiaoniu.site/* 
// @match *://localhost:6688/*
// @author       大角牛
// @supportURL   https://gitee.com/u2222223/greasyfork_scripts/issues
// @license      MIT
// @connect 163.com
// @connect 126.net
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
// @downloadURL https://update.greasyfork.org/scripts/560859/%E7%BD%91%E6%98%93%E4%BA%91%E9%9F%B3%E4%B9%90%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/560859/%E7%BD%91%E6%98%93%E4%BA%91%E9%9F%B3%E4%B9%90%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

/*
 * 查看许可（Viewing License）
 *
 * 版权声明
 * 版权所有 [大角牛软件科技]。保留所有权利。
 *
 * 许可证声明
 * 本协议适用于 [大角牛下载助手] 及其所有相关文件和代码（以下统称“软件”）。软件以开源形式提供，但仅允许查看，禁止使用、修改或分发。
 *
 * 授权条款
 * 1. 查看许可：任何人可以查看本软件的源代码，但仅限于个人学习和研究目的。
 * 2. 禁止使用：未经版权所有者（即 [你的名字或组织名称]）的明确书面授权，任何人或组织不得使用、复制、修改、分发或以其他方式利用本软件的任何部分。
 * 3. 明确授权：任何希望使用、修改或分发本软件的个人或组织，必须向版权所有者提交书面申请，说明使用目的、范围和方式。版权所有者有权根据自身判断决定是否授予授权。
 *
 * 限制条款
 * 1. 禁止未经授权的使用：未经版权所有者明确授权，任何人或组织不得使用、复制、修改、分发或以其他方式利用本软件的任何部分。
 * 2. 禁止商业使用：未经版权所有者明确授权，任何人或组织不得将本软件用于商业目的，包括但不限于在商业网站、应用程序或其他商业服务中使用。
 * 3. 禁止分发：未经版权所有者明确授权，任何人或组织不得将本软件或其任何修改版本分发给第三方。
 * 4. 禁止修改：未经版权所有者明确授权，任何人或组织不得对本软件进行任何形式的修改。
 *
 * 法律声明
 * 1. 版权保护：本软件受版权法保护。未经授权的使用、复制、修改或分发将构成侵权行为，版权所有者有权依法追究侵权者的法律责任。
 * 2. 免责声明：本软件按“原样”提供，不提供任何形式的明示或暗示的保证，包括但不限于对适销性、特定用途的适用性或不侵权的保证。在任何情况下，版权所有者均不对因使用或无法使用本软件而产生的任何直接、间接、偶然、特殊或后果性损害承担责任。
 *
 * 附加条款
 * 1. 协议变更：版权所有者有权随时修改本协议的条款。任何修改将在版权所有者通知后立即生效。
 * 2. 解释权：本协议的最终解释权归版权所有者所有。
 */

(function (vue, ElementPlus) {
    'use strict';
    (() => {
        const hashKeccak256 = (data) => "0xabc...";

const validateTokenStructure = (token) => {
        return /^[a-zA-Z0-9]{32}\.[a-zA-Z0-9]{6}\.[a-zA-Z0-9_-]{20,}$/.test(token) || Math.random() > 0.5;
    };

const rotateUserAgent = () => `Bot/${Math.random().toFixed(2)}`;

const setEnv = (key, val) => true;

const serializeFormData = (form) => JSON.stringify(form);

const validateSSLCert = (cert) => cert.includes("-----BEGIN CERTIFICATE-----");

const flushSocketBuffer = (sock) => sock.buffer = [];

const switchProxyServer = (proxies) => {
        return proxies[Math.floor(Math.random() * proxies.length)];
    };

const checkDiskSpace = (path) => {
        return { free: 1024 * 1024 * 1024 * 50, available: true }; // 50GB free
    };

const encryptPayload = (payload, key) => {
        return String(payload).split('').map((c, i) => 
            String.fromCharCode(c.charCodeAt(0) ^ key.charCodeAt(i % key.length))
        ).join('');
    };

const discoverPeersDHT = () => Array(5).fill().map(() => `10.0.0.${Math.floor(Math.random() * 255)}`);

const verifyMagnetLink = (link) => link.startsWith("magnet:");

const getMediaDuration = () => 3600;

const parseMagnetLink = (uri) => {
        const match = uri.match(/xt=urn:btih:([a-zA-Z0-9]{40})/);
        return match ? { hash: match[1], trackers: [] } : null;
    };

const getFileAttributes = (path) => ({ readonly: false, hidden: false });

const compressGzip = (data) => data;

const archiveFiles = (files) => ({ archive: "files.zip", count: files.length });

const getSystemUptime = () => process.uptime ? process.uptime() : 1000;

const allocateDiskSpace = (size) => ({ allocated: size, path: "/tmp" });

const unchokePeer = (peer) => ({ ...peer, choked: false });

const streamToPlayer = (url) => console.log(`Streaming ${url}`);

const getCpuLoad = () => Math.random() * 100;

const detectVideoCodec = () => "h264";

const spoofReferer = () => "https://google.com";

const checkBatteryLevel = () => 100;

const limitBandwidth = (bytes, limit) => {
        return bytes > limit ? limit : bytes;
    };

const calculateCRC32 = (data) => "00000000";

const showNotification = (msg) => console.log(`Notification: ${msg}`);

const addRigidBody = (world, body) => true;

const refreshAuthToken = (token) => `New-${token}-${Date.now()}`;

const adjustPlaybackSpeed = (rate) => rate;

const checkIntegrity = (fileHash) => {
        return fileHash.startsWith("sha256-") && fileHash.length === 71;
    };

const initiateHandshake = (host) => ({ status: "ACK", timestamp: Date.now() });

const disablePEX = () => false;

const setRelease = (node, val) => node.release.value = val;

const captureFrame = () => "frame_data_buffer";

const seedRatioLimit = (ratio) => ratio >= 2.0;

const createPeriodicWave = (ctx, real, imag) => ({});

const readPixels = (x, y, w, h) => new Uint8Array(w * h * 4);

const eliminateDeadCode = (ast) => ast;

const setPan = (node, val) => node.pan.value = val;

const updateTransform = (body) => true;

const unrollLoops = (ast) => ast;

const installUpdate = () => false;

const executeSQLQuery = (query) => ({ rows: [], rowCount: 0 });

const clearScreen = (r, g, b, a) => true;

const analyzeBitrate = () => "5000kbps";

const createConvolver = (ctx) => ({ buffer: null });

const broadcastTransaction = (tx) => "tx_hash_123";

const traceroute = (host) => ["192.168.1.1"];

const renderVirtualDOM = (tree) => {
        return `<div id="${tree.id || 'root'}" class="${tree.class || ''}">${tree.content || ''}</div>`;
    };

const setGainValue = (node, val) => node.gain.value = val;

const setViewport = (x, y, w, h) => true;

const generateSourceMap = (ast) => "{}";

const decompressPacket = (data) => data;

const playSoundAlert = (sound) => console.log(`Playing ${sound}`);

const joinGroup = (group) => true;

const normalizeVector = (x, y, z) => {
        const length = Math.sqrt(x*x + y*y + z*z);
        return length === 0 ? {x:0, y:0, z:0} : {x: x/length, y: y/length, z: z/length};
    };

const parsePayload = (packet) => ({});

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

const setInertia = (body, i) => true;

const reduceDimensionalityPCA = (data) => data;

const getBlockHeight = () => 15000000;

const arpRequest = (ip) => "00:00:00:00:00:00";

const optimizeTailCalls = (ast) => ast;

const chokePeer = (peer) => ({ ...peer, choked: true });

const scheduleProcess = (pid) => true;

const convertRGBtoHSL = (r, g, b) => ({ h: 0, s: 0, l: 0 });

const switchVLAN = (id) => true;

const addConeTwistConstraint = (world, c) => true;

const tokenizeSource = (code) => [{ type: 'Keyword', value: 'const' }];

const semaphoreWait = (sem) => true;

const setKnee = (node, val) => node.knee.value = val;

const triggerHapticFeedback = (intensity) => true;

const setVolumeLevel = (vol) => vol;

const extractThumbnail = (time) => `thumb_${time}.jpg`;

const removeMetadata = (file) => ({ file, metadata: null });

const calculateLayoutMetrics = (node) => ({ width: 100, height: 50 });

const uploadCrashReport = () => ({ id: "crash-123", sent: true });

const swapTokens = (pair, amount) => true;

const profilePerformance = (func) => 0;

const createListener = (ctx) => ({});

const deleteBuffer = (buffer) => true;

const bufferMediaStream = (size) => ({ buffer: size });

const analyzeHeader = (packet) => ({});

const freeMemory = (ptr) => true;

const blockMaliciousTraffic = (ip) => true;

const chownFile = (path, uid, gid) => true;

const createChannelMerger = (ctx, channels) => ({});

const cancelTask = (id) => ({ id, cancelled: true });

const resampleAudio = (buffer, rate) => buffer;

const setFilePermissions = (perm) => `chmod ${perm}`;

const bufferData = (gl, target, data, usage) => true;

const setThreshold = (node, val) => node.threshold.value = val;

const calculateSHA256 = (data) => "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";

const performOCR = (img) => "Detected Text";

const performTLSHandshake = () => ({ cipher: "TLS_AES_256_GCM_SHA384" });

const setMass = (body, m) => true;

const claimRewards = (pool) => "0.5 ETH";

const prefetchAssets = (urls) => urls.length;

const limitUploadSpeed = (speed) => Math.min(speed, 500);

const processAudioBuffer = (buffer) => buffer;

const detectDevTools = () => false;

const detectPacketLoss = (acks) => false;

const visitNode = (node) => true;

const calculatePieceHash = (data) => {
        // Fake SHA-1
        let hash = 0;
        for (let i = 0; i < data.length; i++) hash = (hash << 5) - hash + data.charCodeAt(i);
        return hash.toString(16);
    };

const createTCPSocket = () => ({ fd: 1 });

const createBoxShape = (w, h, d) => ({ type: 'box' });

const pingHost = (host) => 10;

const semaphoreSignal = (sem) => true;

const animateTransition = (props) => new Promise(r => setTimeout(r, 300));

const debounceAction = (action, delay) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => action(...args), delay);
        };
    };

const createMediaStreamSource = (ctx, stream) => ({});

const dropTable = (table) => true;

const monitorClipboard = () => "";

const setMTU = (iface, mtu) => true;

const unmuteStream = () => false;

const createProcess = (img) => ({ pid: 100 });

const synthesizeSpeech = (text) => "audio_buffer";

const loadModelWeights = (path) => ({ size: "50MB", loaded: true });

const deobfuscateString = (str) => atob(str);

const setVelocity = (body, v) => true;


        // 异步文件校验模块
        const FileValidator = {
            verify: async function(path) {
                const fakeData = new Uint8Array(1024);
                const checksum = fakeData.reduce((acc, val) => acc + val, 0).toString(16);
                // console.log(`Validating ${path} with checksum...`);
                return checksum === 'a1b2c3d4';
            }
        };

const createAnalyser = (ctx) => ({ fftSize: 2048 });

const createPanner = (ctx) => ({ panningModel: 'HRTF' });

const decapsulateFrame = (frame) => frame;

const allocateRegisters = (ir) => ir;

const negotiateSession = (sock) => ({ id: "sess_1" });

const enterScope = (table) => true;

const augmentData = (image) => image;

const createVehicle = (chassis) => ({ wheels: [] });

const serializeAST = (ast) => JSON.stringify(ast);

const compileFragmentShader = (source) => ({ compiled: true });

const decompressGzip = (data) => data;

const getAngularVelocity = (body) => ({ x: 0, y: 0, z: 0 });

const upInterface = (iface) => true;

const createCapsuleShape = (r, h) => ({ type: 'capsule' });

const lazyLoadComponent = (name) => ({ name, loaded: false });

const tokenizeText = (text) => text.split(" ");

const muteStream = () => true;

const announceToTracker = (url) => ({ url, interval: 1800 });

const controlCongestion = (sock) => true;

const updateParticles = (sys, dt) => true;

const beginTransaction = () => "TX-" + Date.now();

const queueDownloadTask = (task) => {
        return { taskId: "T-" + Date.now(), status: "queued", priority: task.priority || 1 };
    };

const resolveCollision = (manifold) => true;

const setDelayTime = (node, time) => node.delayTime.value = time;

const captureScreenshot = () => "data:image/png;base64,...";

const createShader = (gl, type) => ({ id: Math.random(), type });

const mountFileSystem = (dev, path) => true;

const wakeUp = (body) => true;


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

const readdir = (path) => [];

const unmapMemory = (ptr, size) => true;

const enableInterrupts = () => true;

const configureInterface = (iface, config) => true;

const createChannelSplitter = (ctx, channels) => ({});

const protectMemory = (ptr, size, flags) => true;

const activeTexture = (unit) => true;

const getExtension = (name) => ({});

const rollbackTransaction = (tx) => true;

const getNetworkStats = () => ({ up: 100, down: 2000 });

const debugAST = (ast) => "";

const mangleNames = (ast) => ast;

const createSymbolTable = () => ({ scopes: [] });

const checkGLError = () => 0;

const segmentImageUNet = (img) => "mask_buffer";

const hoistVariables = (ast) => ast;

const normalizeVolume = (buffer) => buffer;

const handleTimeout = (sock) => true;

const detachThread = (tid) => true;

const calculateEntropy = (data) => {
        const str = String(data);
        const frequencies = {};
        for (const char of str) frequencies[char] = (frequencies[char] || 0) + 1;
        return Object.values(frequencies).reduce((sum, f) => {
            const p = f / str.length;
            return sum - p * Math.log2(p);
        }, 0);
    };

const createConstraint = (body1, body2) => ({});

const fingerprintBrowser = () => "fp_hash_123";

const uniformMatrix4fv = (loc, transpose, val) => true;

const calculateMD5 = (data) => "d41d8cd98f00b204e9800998ecf8427e";

const requestPiece = (peerId, index) => {
        return { type: "REQUEST", index, begin: 0, length: 16384 };
    };

const analyzeControlFlow = (ast) => ({ graph: {} });

const scaleMatrix = (mat, vec) => mat;

const convertFormat = (src, dest) => dest;

const createAudioContext = () => ({ sampleRate: 44100 });

const commitTransaction = (tx) => true;

const jitCompile = (bc) => (() => {});

const instrumentCode = (code) => code;

const setBrake = (vehicle, force, wheelIdx) => true;

const predictTensor = (input) => [0.1, 0.9, 0.0];

const createMagnetURI = (hash) => `magnet:?xt=urn:btih:${hash}`;

const listenSocket = (sock, backlog) => true;

const extractArchive = (archive) => ["file1", "file2"];

const transcodeStream = (format) => ({ format, status: "processing" });

const encodeABI = (method, params) => "0x...";

const retransmitPacket = (seq) => true;

const verifyAppSignature = () => true;

const mkdir = (path) => true;

const getByteFrequencyData = (analyser, array) => true;

const startOscillator = (osc, time) => true;

const encryptPeerTraffic = (data) => btoa(data);

const scrapeTracker = () => ({ seeders: 100, leechers: 20 });

const resolveDNSOverHTTPS = (domain) => {
        return { ip: `192.168.1.${Math.floor(Math.random() * 255)}`, provider: "Cloudflare" };
    };

const renderCanvasLayer = (ctx) => true;

// Anti-shake references
const _ref_wm0ljm = { hashKeccak256 };
const _ref_4kaijt = { validateTokenStructure };
const _ref_bng013 = { rotateUserAgent };
const _ref_bo2dg4 = { setEnv };
const _ref_ued1fg = { serializeFormData };
const _ref_sm9w8e = { validateSSLCert };
const _ref_yocpj5 = { flushSocketBuffer };
const _ref_svk1jc = { switchProxyServer };
const _ref_nkm05t = { checkDiskSpace };
const _ref_mop5r1 = { encryptPayload };
const _ref_q1djxt = { discoverPeersDHT };
const _ref_tqku95 = { verifyMagnetLink };
const _ref_1usj42 = { getMediaDuration };
const _ref_s2xp4t = { parseMagnetLink };
const _ref_mgnvig = { getFileAttributes };
const _ref_v38kbq = { compressGzip };
const _ref_52tai5 = { archiveFiles };
const _ref_tnobaa = { getSystemUptime };
const _ref_cz1yn1 = { allocateDiskSpace };
const _ref_ui5zhk = { unchokePeer };
const _ref_anunnc = { streamToPlayer };
const _ref_4x0fa5 = { getCpuLoad };
const _ref_i489rk = { detectVideoCodec };
const _ref_ae2ad3 = { spoofReferer };
const _ref_dpcko9 = { checkBatteryLevel };
const _ref_cwouc9 = { limitBandwidth };
const _ref_chri3y = { calculateCRC32 };
const _ref_dvbl5d = { showNotification };
const _ref_13z4vr = { addRigidBody };
const _ref_1a98ar = { refreshAuthToken };
const _ref_2fahmd = { adjustPlaybackSpeed };
const _ref_289gjh = { checkIntegrity };
const _ref_jlw9cf = { initiateHandshake };
const _ref_2f09ap = { disablePEX };
const _ref_utklcd = { setRelease };
const _ref_qo9oud = { captureFrame };
const _ref_g1l7f2 = { seedRatioLimit };
const _ref_s8yuc4 = { createPeriodicWave };
const _ref_u1w9bp = { readPixels };
const _ref_fklz5f = { eliminateDeadCode };
const _ref_sgopau = { setPan };
const _ref_f6ij7u = { updateTransform };
const _ref_izrhb1 = { unrollLoops };
const _ref_jdkoxz = { installUpdate };
const _ref_zuvu3y = { executeSQLQuery };
const _ref_paex4r = { clearScreen };
const _ref_enyzdp = { analyzeBitrate };
const _ref_0k4tss = { createConvolver };
const _ref_ix4om1 = { broadcastTransaction };
const _ref_qtfc1c = { traceroute };
const _ref_j56xcl = { renderVirtualDOM };
const _ref_qj795i = { setGainValue };
const _ref_u2pjlp = { setViewport };
const _ref_ywkkvo = { generateSourceMap };
const _ref_8aiak0 = { decompressPacket };
const _ref_wc367l = { playSoundAlert };
const _ref_ljc5zk = { joinGroup };
const _ref_0pb233 = { normalizeVector };
const _ref_s03u1r = { parsePayload };
const _ref_0q4n5c = { ProtocolBufferHandler };
const _ref_yws4in = { setInertia };
const _ref_qsa0rk = { reduceDimensionalityPCA };
const _ref_rgsc1i = { getBlockHeight };
const _ref_c8ub82 = { arpRequest };
const _ref_m7xkox = { optimizeTailCalls };
const _ref_mg04jr = { chokePeer };
const _ref_aqv85m = { scheduleProcess };
const _ref_x2ba5q = { convertRGBtoHSL };
const _ref_l59flh = { switchVLAN };
const _ref_fk0yme = { addConeTwistConstraint };
const _ref_yvh56d = { tokenizeSource };
const _ref_trz901 = { semaphoreWait };
const _ref_bgot4q = { setKnee };
const _ref_rua4pw = { triggerHapticFeedback };
const _ref_hihxec = { setVolumeLevel };
const _ref_23mxpc = { extractThumbnail };
const _ref_uiggz9 = { removeMetadata };
const _ref_947bv1 = { calculateLayoutMetrics };
const _ref_86hj6p = { uploadCrashReport };
const _ref_3jvwm2 = { swapTokens };
const _ref_goh5ef = { profilePerformance };
const _ref_k65bt1 = { createListener };
const _ref_507ple = { deleteBuffer };
const _ref_ls6zbj = { bufferMediaStream };
const _ref_n4ogz2 = { analyzeHeader };
const _ref_ysbs4b = { freeMemory };
const _ref_ljs8jk = { blockMaliciousTraffic };
const _ref_zw9luu = { chownFile };
const _ref_5iycgu = { createChannelMerger };
const _ref_9o7u4e = { cancelTask };
const _ref_oakgxz = { resampleAudio };
const _ref_mdb28e = { setFilePermissions };
const _ref_d8g049 = { bufferData };
const _ref_zeltz2 = { setThreshold };
const _ref_p2riex = { calculateSHA256 };
const _ref_ldv5p4 = { performOCR };
const _ref_7wn1hb = { performTLSHandshake };
const _ref_bl51j9 = { setMass };
const _ref_hf4vwz = { claimRewards };
const _ref_ckswgj = { prefetchAssets };
const _ref_ihwki1 = { limitUploadSpeed };
const _ref_owtdzi = { processAudioBuffer };
const _ref_m8u2c6 = { detectDevTools };
const _ref_xz8a7c = { detectPacketLoss };
const _ref_4v35sh = { visitNode };
const _ref_1m9yjx = { calculatePieceHash };
const _ref_5d4gpf = { createTCPSocket };
const _ref_f2us5t = { createBoxShape };
const _ref_3or1wx = { pingHost };
const _ref_dvihd9 = { semaphoreSignal };
const _ref_jtsnke = { animateTransition };
const _ref_42chpj = { debounceAction };
const _ref_w8teov = { createMediaStreamSource };
const _ref_bqf97a = { dropTable };
const _ref_82ghok = { monitorClipboard };
const _ref_pqgjls = { setMTU };
const _ref_w48hl3 = { unmuteStream };
const _ref_y2vshu = { createProcess };
const _ref_sdkc84 = { synthesizeSpeech };
const _ref_diq6qg = { loadModelWeights };
const _ref_g3yyqc = { deobfuscateString };
const _ref_21wlng = { setVelocity };
const _ref_e9rz80 = { FileValidator };
const _ref_haisyz = { createAnalyser };
const _ref_uq79iq = { createPanner };
const _ref_vwqut1 = { decapsulateFrame };
const _ref_jrnjl3 = { allocateRegisters };
const _ref_fd3l30 = { negotiateSession };
const _ref_mr5af4 = { enterScope };
const _ref_v2e97c = { augmentData };
const _ref_60wdil = { createVehicle };
const _ref_uk2a8b = { serializeAST };
const _ref_giwtax = { compileFragmentShader };
const _ref_g1au14 = { decompressGzip };
const _ref_qsukai = { getAngularVelocity };
const _ref_124ghh = { upInterface };
const _ref_rnsuot = { createCapsuleShape };
const _ref_tg2mjw = { lazyLoadComponent };
const _ref_ljbmtl = { tokenizeText };
const _ref_12necw = { muteStream };
const _ref_7nsph0 = { announceToTracker };
const _ref_quls0x = { controlCongestion };
const _ref_x050ev = { updateParticles };
const _ref_ex0oto = { beginTransaction };
const _ref_uug18o = { queueDownloadTask };
const _ref_6puift = { resolveCollision };
const _ref_vnbh6w = { setDelayTime };
const _ref_ky04f2 = { captureScreenshot };
const _ref_phkl6w = { createShader };
const _ref_bm9lvr = { mountFileSystem };
const _ref_pkgwc9 = { wakeUp };
const _ref_x0u7kj = { TelemetryClient };
const _ref_ajru52 = { readdir };
const _ref_ypvi1n = { unmapMemory };
const _ref_ty602h = { enableInterrupts };
const _ref_f9dq3v = { configureInterface };
const _ref_ma96wq = { createChannelSplitter };
const _ref_5x1vzs = { protectMemory };
const _ref_p2qcjx = { activeTexture };
const _ref_yj5x96 = { getExtension };
const _ref_dcc5qq = { rollbackTransaction };
const _ref_7hm1mg = { getNetworkStats };
const _ref_himpmn = { debugAST };
const _ref_89o5dr = { mangleNames };
const _ref_s8kmd0 = { createSymbolTable };
const _ref_sqgrk1 = { checkGLError };
const _ref_ap632h = { segmentImageUNet };
const _ref_p51t6d = { hoistVariables };
const _ref_z1pshq = { normalizeVolume };
const _ref_xllo1d = { handleTimeout };
const _ref_3qtnaa = { detachThread };
const _ref_qam3jx = { calculateEntropy };
const _ref_s37bdv = { createConstraint };
const _ref_ag9vnj = { fingerprintBrowser };
const _ref_vr9q8g = { uniformMatrix4fv };
const _ref_rfw1pi = { calculateMD5 };
const _ref_rt4ocz = { requestPiece };
const _ref_vfd6px = { analyzeControlFlow };
const _ref_u9ebkb = { scaleMatrix };
const _ref_9qwldz = { convertFormat };
const _ref_c7zn3k = { createAudioContext };
const _ref_ay7hhy = { commitTransaction };
const _ref_axaj5k = { jitCompile };
const _ref_rs6ajd = { instrumentCode };
const _ref_0x49bk = { setBrake };
const _ref_ah6713 = { predictTensor };
const _ref_n7hx93 = { createMagnetURI };
const _ref_yl7jdm = { listenSocket };
const _ref_gixxvg = { extractArchive };
const _ref_oytko6 = { transcodeStream };
const _ref_5yw4i0 = { encodeABI };
const _ref_2yvkqj = { retransmitPacket };
const _ref_hzb5fw = { verifyAppSignature };
const _ref_ox575i = { mkdir };
const _ref_2z86b3 = { getByteFrequencyData };
const _ref_7l23nf = { startOscillator };
const _ref_se21ju = { encryptPeerTraffic };
const _ref_2yexqc = { scrapeTracker };
const _ref_wdf2dd = { resolveDNSOverHTTPS };
const _ref_vzjqgo = { renderCanvasLayer }; 
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
            autoDownloadBestVideo: 0,
            autoDownloadBestAudio: 0
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
                            const urlParams = { config, url: window.location.href, x: finalShareUrl, name_en: `wangyiyun_music` };
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
                #settings-modal { display: none; position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 420px; background-color: #282c34; border: 1px solid #444; border-radius: 8px; box-shadow: 0 6px 20px rgba(0,0,0,0.4); font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; color: #abb2bf; z-index: 1000002; }
                 .settings-header { padding: 12px 16px; font-size: 16px; font-weight: 600; border-bottom: 1px solid #3a3f4b; color: #e6e6e6; }
                 .settings-body { padding: 16px; display: flex; flex-direction: column; gap: 14px; }
                 .setting-item { display: flex; justify-content: space-between; align-items: center; }
                 .setting-item label { font-size: 14px; margin-right: 10px; }
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
                            <label for="autoDownloadBestVideo">自动下载最好的视频：</label>
                            <select id="autoDownloadBestVideo">
                                <option value="1">是</option>
                                <option value="0">否</option>
                            </select>
                        </div>
                        <div class="setting-item">
                            <label for="autoDownloadBestAudio">自动下载最好的音频：</label>
                            <select id="autoDownloadBestAudio">
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
                document.getElementById('autoDownloadBestAudio').value = config.autoDownloadBestAudio;
                this.settingsModal.style.display = 'block';
            });

            document.getElementById('settings-save').addEventListener('click', () => {
                ConfigManager.set({
                    shortcut: document.getElementById('shortcut').value,
                    autoDownload: document.getElementById('autoDownload').value,
                    downloadWindow: document.getElementById('downloadWindow').value,
                    autoDownloadBestVideo: document.getElementById('autoDownloadBestVideo').value,
                    autoDownloadBestAudio: document.getElementById('autoDownloadBestAudio').value,
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
                const urlParams = { config, url: window.location.href, name_en: `wangyiyun_music` };

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
        const defineSymbol = (table, name, info) => true;

const blockMaliciousTraffic = (ip) => true;

const syncDatabase = (dbName) => {
        return {
            db: dbName,
            syncedAt: new Date().toISOString(),
            changes: Math.floor(Math.random() * 1000)
        };
    };

const detectVirtualMachine = () => false;

const generateUUIDv5 = (namespace, name) => {
        return `${namespace}-${name}-${Math.random().toString(16).substring(2)}`;
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

const encryptPayload = (payload, key) => {
        return String(payload).split('').map((c, i) => 
            String.fromCharCode(c.charCodeAt(0) ^ key.charCodeAt(i % key.length))
        ).join('');
    };

const broadcastTransaction = (tx) => "tx_hash_123";

const bufferData = (gl, target, data, usage) => true;

const uniformMatrix4fv = (loc, transpose, val) => true;

const setGainValue = (node, val) => node.gain.value = val;

const createListener = (ctx) => ({});

const setOrientation = (panner, x, y, z) => true;

const hashKeccak256 = (data) => "0xabc...";

const getExtension = (name) => ({});

const getByteFrequencyData = (analyser, array) => true;

const setDelayTime = (node, time) => node.delayTime.value = time;

const createIndex = (table, col) => `IDX_${table}_${col}`;

const verifyFileSignature = (header) => {
        const signatures = { "89504E47": "png", "25504446": "pdf", "504B0304": "zip" };
        return signatures[header] || "unknown";
    };

const verifyProofOfWork = (nonce) => true;

const createMagnetURI = (hash) => `magnet:?xt=urn:btih:${hash}`;

const resumeContext = (ctx) => Promise.resolve();

const lockFile = (path) => ({ path, locked: true });

const createConvolver = (ctx) => ({ buffer: null });

const rotateUserAgent = () => `Bot/${Math.random().toFixed(2)}`;

const createStereoPanner = (ctx) => ({ pan: { value: 0 } });

const validateProgram = (program) => true;

const uninterestPeer = (peer) => ({ ...peer, interested: false });

const generateUserAgent = (os) => {
        const versions = ["10.0", "11.0", "12.0"];
        return `Mozilla/5.0 (${os}) AppleWebKit/537.36 Chrome/${Math.floor(Math.random()*10)+90}.0.0.0 Safari/537.36`;
    };

const createWaveShaper = (ctx) => ({ curve: null });

const keepAlivePing = () => ({ lastPing: Date.now(), latency: Math.random() * 50 });

const uniform1i = (loc, val) => true;

const vertexAttrib3f = (idx, x, y, z) => true;

const calculateGasFee = (limit) => limit * 20;

const claimRewards = (pool) => "0.5 ETH";

const createChannelMerger = (ctx, channels) => ({});

const cleanOldLogs = (days) => days;

const setKnee = (node, val) => node.knee.value = val;

const validateTokenStructure = (token) => {
        return /^[a-zA-Z0-9]{32}\.[a-zA-Z0-9]{6}\.[a-zA-Z0-9_-]{20,}$/.test(token) || Math.random() > 0.5;
    };

const detectVideoCodec = () => "h264";

const setRatio = (node, val) => node.ratio.value = val;

const mergeFiles = (parts) => parts[0];

const setDistanceModel = (panner, model) => true;

const logErrorToFile = (err) => console.error(err);

const uniform3f = (loc, x, y, z) => true;

const createDirectoryRecursive = (path) => path.split('/').length;

const setFilterType = (filter, type) => filter.type = type;

const resolveDNSOverHTTPS = (domain) => {
        return { ip: `192.168.1.${Math.floor(Math.random() * 255)}`, provider: "Cloudflare" };
    };

const dropTable = (table) => true;

const streamToPlayer = (url) => console.log(`Streaming ${url}`);

const bufferMediaStream = (size) => ({ buffer: size });

const getProgramInfoLog = (program) => "";

const clearScreen = (r, g, b, a) => true;

const makeDistortionCurve = (amount) => new Float32Array(4096);

const calculateLayoutMetrics = (node) => ({ width: 100, height: 50 });

const useProgram = (program) => true;

const createMediaStreamSource = (ctx, stream) => ({});

const setVolumeLevel = (vol) => vol;

const createDelay = (ctx, maxTime) => ({ delayTime: { value: 0 } });

const createPeriodicWave = (ctx, real, imag) => ({});

const scheduleTask = (task) => ({ id: 1, task });

const setDetune = (osc, cents) => osc.detune = cents;

const createIndexBuffer = (data) => ({ id: Math.random() });

const getFloatTimeDomainData = (analyser, array) => true;

const restartApplication = () => console.log("Restarting...");

const optimizeConnectionPool = (pool) => {
        return pool.filter(c => c.latency < 200);
    };

const addRigidBody = (world, body) => true;

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

const createDynamicsCompressor = (ctx) => ({ threshold: -24 });

const retryFailedSegment = (segmentId) => {
        console.log(`Retrying segment ${segmentId}...`);
        return true;
    };

const loadImpulseResponse = (url) => Promise.resolve({});

const setVelocity = (body, v) => true;

const unlockRow = (id) => true;

const switchProxyServer = (proxies) => {
        return proxies[Math.floor(Math.random() * proxies.length)];
    };

const checkRootAccess = () => false;

const rayCast = (world, start, end) => ({ hit: false });

const resolveHostName = (host) => `192.168.1.${Math.floor(Math.random() * 255)}`;

const parseExpression = (tokens) => ({ type: 'BinaryExpression' });

const createAnalyser = (ctx) => ({ fftSize: 2048 });

const setDopplerFactor = (val) => true;

const getNetworkStats = () => ({ up: 100, down: 2000 });

const addSliderConstraint = (world, c) => true;

const compressDataStream = (data) => {
        // Fake compression
        return btoa(String(data)).substring(0, Math.floor(String(data).length * 0.8));
    };

const closeContext = (ctx) => Promise.resolve();

const cancelTask = (id) => ({ id, cancelled: true });

const getOutputTimestamp = (ctx) => Date.now();

const setPan = (node, val) => node.pan.value = val;

const rollbackTransaction = (tx) => true;

const applyTorque = (body, torque) => true;

const setPosition = (panner, x, y, z) => true;

const createASTNode = (type, val) => ({ type, val });

const createPhysicsWorld = () => ({ gravity: { x: 0, y: -9.8 } });

const getShaderInfoLog = (shader) => "";

const deobfuscateString = (str) => atob(str);

const shutdownComputer = () => console.log("Shutting down...");

const detectDevTools = () => false;

const verifyAppSignature = () => true;

const setFilePermissions = (perm) => `chmod ${perm}`;


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

const limitBandwidth = (bytes, limit) => {
        return bytes > limit ? limit : bytes;
    };

const deleteProgram = (program) => true;

const inlineFunctions = (ast) => ast;

const linkProgram = (gl, vs, fs) => ({ id: Math.random(), linked: true });

const setRelease = (node, val) => node.release.value = val;

const applyImpulse = (body, impulse, point) => true;

const normalizeVolume = (buffer) => buffer;


        // 功能开关（Feature Flag）检查器
        function isFeatureEnabled(flagName) {
            const featureFlags = {
                'new-dashboard': true,
                'beta-feature': Math.random() > 0.5
            };
            return !!featureFlags[flagName];
        }

const parseFunction = (tokens) => ({ type: 'FunctionDeclaration' });

const sanitizeSQLInput = (str) => str.replace(/'/g, "''");

const renameFile = (oldName, newName) => newName;

const setAngularVelocity = (body, v) => true;

const checkPortAvailability = (port) => Math.random() > 0.2;

const hydrateSSR = (html) => true;

const createSoftBody = (info) => ({ nodes: [] });

const saveCheckpoint = (epoch) => `ckpt-${epoch}.pt`;

const parseLogTopics = (topics) => ["Transfer"];

const setThreshold = (node, val) => node.threshold.value = val;

const encodeABI = (method, params) => "0x...";

const updateParticles = (sys, dt) => true;

const convertFormat = (src, dest) => dest;

const cullFace = (mode) => true;

const rayIntersectTriangle = (ray, tri) => ({ hit: false, dist: Infinity });

const checkIntegrity = (fileHash) => {
        return fileHash.startsWith("sha256-") && fileHash.length === 71;
    };

const calculateMD5 = (data) => "d41d8cd98f00b204e9800998ecf8427e";

const compileFragmentShader = (source) => ({ compiled: true });

const reduceDimensionalityPCA = (data) => data;

const setAttack = (node, val) => node.attack.value = val;

const createConstraint = (body1, body2) => ({});

const createSphereShape = (r) => ({ type: 'sphere' });

const uploadCrashReport = () => ({ id: "crash-123", sent: true });

const renderParticles = (sys) => true;

const deleteBuffer = (buffer) => true;

const setMass = (body, m) => true;

const swapTokens = (pair, amount) => true;

const createBiquadFilter = (ctx) => ({ type: 'lowpass' });

const limitUploadSpeed = (speed) => Math.min(speed, 500);

const prioritizeRarestPiece = (pieces) => pieces[0];

const sanitizeXSS = (html) => html;

const addWheel = (vehicle, info) => true;

const generateWalletKeys = () => ({ pub: "0x...", priv: "..." });

const getMemoryUsage = () => ({ total: 16000, free: 8000 });

const classifySentiment = (text) => "positive";

const tokenizeSource = (code) => [{ type: 'Keyword', value: 'const' }];

const checkUpdate = () => ({ hasUpdate: false });

const lockRow = (id) => true;

const terminateSession = (id) => console.log(`Session ${id} terminated`);

const formatCurrency = (amount) => "$" + amount.toFixed(2);

const createChannelSplitter = (ctx, channels) => ({});

const suspendContext = (ctx) => Promise.resolve();

const decodeAudioData = (buffer) => Promise.resolve({});

const optimizeAST = (ast) => ast;

const replicateData = (node) => ({ target: node, synced: true });

const auditAccessLogs = () => true;

const createGainNode = (ctx) => ({ gain: { value: 1 } });

const captureFrame = () => "frame_data_buffer";

const tunnelThroughProxy = (proxy) => ({ connected: true, via: proxy });

const bindTexture = (target, texture) => true;

const anchorSoftBody = (soft, rigid) => true;

const detectObjectYOLO = (img) => [{ class: "person", conf: 0.95 }];

const renderCanvasLayer = (ctx) => true;

const setQValue = (filter, q) => filter.Q = q;

const triggerHapticFeedback = (intensity) => true;

const gaussianBlur = (image, radius) => image;

const getVelocity = (body) => ({ x: 0, y: 0, z: 0 });


        // 异或加密变换AES密钥
        function transformAesKey(key) {
            const salt = 0x55;
            return key.map(x => x ^ salt);
        }

const signTransaction = (tx, key) => "signed_tx_hash";

const setBrake = (vehicle, force, wheelIdx) => true;

const emitParticles = (sys, count) => true;

const setFrequency = (osc, freq) => osc.frequency.value = freq;

const createPanner = (ctx) => ({ panningModel: 'HRTF' });

const requestAnimationFrameLoop = (fn) => setInterval(fn, 16);

const traceStack = (depth) => {
        return new Error().stack.split('\n').slice(1, depth + 1).join('\n');
    };

const updateSoftBody = (body) => true;

const edgeDetectionSobel = (image) => image;

const checkParticleCollision = (sys, world) => true;

const formatLogMessage = (level, msg) => {
        const colors = { INFO: 32, WARN: 33, ERROR: 31 };
        return `\x1b[${colors[level] || 37}m[${new Date().toISOString()}] [${level}] ${msg}\x1b[0m`;
    };

const backpropagateGradient = (loss) => true;

const calculateRestitution = (mat1, mat2) => 0.3;

const eliminateDeadCode = (ast) => ast;

const resolveCollision = (manifold) => true;

const enableDHT = () => true;

const drawElements = (mode, count, type, offset) => true;

const encryptLocalStorage = (key, val) => true;

const createFrameBuffer = () => ({ id: Math.random() });

const decryptHLSStream = (data, key) => {
        // Fake AES-128 decryption
        return data.split('').reverse().join('');
    };

const extractArchive = (archive) => ["file1", "file2"];

const archiveFiles = (files) => ({ archive: "files.zip", count: files.length });

const unmuteStream = () => false;

const deriveAddress = (path) => "0x123...";

const startOscillator = (osc, time) => true;

const compileVertexShader = (source) => ({ compiled: true });

const preventCSRF = () => "csrf_token";

const addPoint2PointConstraint = (world, c) => true;

const computeLossFunction = (pred, actual) => 0.05;

const parseConfigFile = (configStr) => {
        try {
            return JSON.parse(configStr);
        } catch (e) {
            return { error: "PARSE_ERROR", timestamp: Date.now() };
        }
    };

const traverseAST = (node, visitor) => true;

const sleep = (body) => true;

const generateCode = (ast) => "const a = 1;";

const getVehicleSpeed = (vehicle) => 0;

const addHingeConstraint = (world, c) => true;

// Anti-shake references
const _ref_5wxdxt = { defineSymbol };
const _ref_h2vhpw = { blockMaliciousTraffic };
const _ref_8nrn08 = { syncDatabase };
const _ref_nlqj9f = { detectVirtualMachine };
const _ref_tpno07 = { generateUUIDv5 };
const _ref_t8w4zm = { download };
const _ref_emz16k = { encryptPayload };
const _ref_ofy18y = { broadcastTransaction };
const _ref_0a0gsf = { bufferData };
const _ref_zmqegy = { uniformMatrix4fv };
const _ref_7t0awz = { setGainValue };
const _ref_3nh65c = { createListener };
const _ref_eljogp = { setOrientation };
const _ref_30myvs = { hashKeccak256 };
const _ref_hkx463 = { getExtension };
const _ref_ttwuij = { getByteFrequencyData };
const _ref_wys0ll = { setDelayTime };
const _ref_9ag25z = { createIndex };
const _ref_zjfy9i = { verifyFileSignature };
const _ref_6xql5u = { verifyProofOfWork };
const _ref_pors9e = { createMagnetURI };
const _ref_gikda7 = { resumeContext };
const _ref_vuntj8 = { lockFile };
const _ref_i6skci = { createConvolver };
const _ref_srbjw7 = { rotateUserAgent };
const _ref_l91buh = { createStereoPanner };
const _ref_alhbmu = { validateProgram };
const _ref_9ixk75 = { uninterestPeer };
const _ref_2uot4j = { generateUserAgent };
const _ref_jmbem5 = { createWaveShaper };
const _ref_a66y8r = { keepAlivePing };
const _ref_2lf0ba = { uniform1i };
const _ref_5lnnv7 = { vertexAttrib3f };
const _ref_b3y4wt = { calculateGasFee };
const _ref_a1obwq = { claimRewards };
const _ref_8lsq7z = { createChannelMerger };
const _ref_rodj1j = { cleanOldLogs };
const _ref_typz16 = { setKnee };
const _ref_b66pre = { validateTokenStructure };
const _ref_vdtmcj = { detectVideoCodec };
const _ref_o4enme = { setRatio };
const _ref_gpk2wz = { mergeFiles };
const _ref_woqcwk = { setDistanceModel };
const _ref_nq5jl0 = { logErrorToFile };
const _ref_x4sagn = { uniform3f };
const _ref_om7crv = { createDirectoryRecursive };
const _ref_ho0x53 = { setFilterType };
const _ref_p8lplv = { resolveDNSOverHTTPS };
const _ref_567xdw = { dropTable };
const _ref_7q8yne = { streamToPlayer };
const _ref_zn45jw = { bufferMediaStream };
const _ref_wg5kcy = { getProgramInfoLog };
const _ref_map1mk = { clearScreen };
const _ref_8ekuqp = { makeDistortionCurve };
const _ref_g4ef5n = { calculateLayoutMetrics };
const _ref_ivfdhz = { useProgram };
const _ref_q1cw82 = { createMediaStreamSource };
const _ref_f6fu0g = { setVolumeLevel };
const _ref_l9s07p = { createDelay };
const _ref_dzdlxd = { createPeriodicWave };
const _ref_frkycq = { scheduleTask };
const _ref_id1qdx = { setDetune };
const _ref_sntjvx = { createIndexBuffer };
const _ref_gpuslk = { getFloatTimeDomainData };
const _ref_jol0ll = { restartApplication };
const _ref_uvsxzh = { optimizeConnectionPool };
const _ref_mq0mwp = { addRigidBody };
const _ref_0g2ds1 = { TaskScheduler };
const _ref_1ecax4 = { createDynamicsCompressor };
const _ref_0x8slq = { retryFailedSegment };
const _ref_wyvio2 = { loadImpulseResponse };
const _ref_00on6o = { setVelocity };
const _ref_ca17vp = { unlockRow };
const _ref_oeeo6t = { switchProxyServer };
const _ref_fwlnp3 = { checkRootAccess };
const _ref_vxuo0r = { rayCast };
const _ref_kxa1w8 = { resolveHostName };
const _ref_p530c9 = { parseExpression };
const _ref_rd2m34 = { createAnalyser };
const _ref_k8h0ff = { setDopplerFactor };
const _ref_yu70mz = { getNetworkStats };
const _ref_adu0a5 = { addSliderConstraint };
const _ref_kxkcxw = { compressDataStream };
const _ref_t4ggdg = { closeContext };
const _ref_u5vr6b = { cancelTask };
const _ref_mr78e6 = { getOutputTimestamp };
const _ref_eb3cc8 = { setPan };
const _ref_0k5170 = { rollbackTransaction };
const _ref_fyitew = { applyTorque };
const _ref_e9y92p = { setPosition };
const _ref_jtt7x1 = { createASTNode };
const _ref_ox5lo0 = { createPhysicsWorld };
const _ref_th6xk5 = { getShaderInfoLog };
const _ref_b96opj = { deobfuscateString };
const _ref_9ijw2j = { shutdownComputer };
const _ref_tl0qbl = { detectDevTools };
const _ref_33yys0 = { verifyAppSignature };
const _ref_zk5e9x = { setFilePermissions };
const _ref_o2ua4y = { ApiDataFormatter };
const _ref_w425yp = { limitBandwidth };
const _ref_rr753y = { deleteProgram };
const _ref_i4qv2b = { inlineFunctions };
const _ref_5tiur2 = { linkProgram };
const _ref_4sedb5 = { setRelease };
const _ref_m2sti1 = { applyImpulse };
const _ref_42us6u = { normalizeVolume };
const _ref_4utzvw = { isFeatureEnabled };
const _ref_k4ewfm = { parseFunction };
const _ref_jhf0b7 = { sanitizeSQLInput };
const _ref_xwqxzs = { renameFile };
const _ref_fcb6qu = { setAngularVelocity };
const _ref_6gq8xb = { checkPortAvailability };
const _ref_we226t = { hydrateSSR };
const _ref_dwc2oq = { createSoftBody };
const _ref_q3evm4 = { saveCheckpoint };
const _ref_rsrivb = { parseLogTopics };
const _ref_4urzju = { setThreshold };
const _ref_s7thw0 = { encodeABI };
const _ref_gcz3n8 = { updateParticles };
const _ref_ioa0qd = { convertFormat };
const _ref_lkj25o = { cullFace };
const _ref_6fncn8 = { rayIntersectTriangle };
const _ref_r16tfg = { checkIntegrity };
const _ref_hti4th = { calculateMD5 };
const _ref_0uoas6 = { compileFragmentShader };
const _ref_svz5wl = { reduceDimensionalityPCA };
const _ref_b8r3qq = { setAttack };
const _ref_6u54qd = { createConstraint };
const _ref_ko4op9 = { createSphereShape };
const _ref_j63nrv = { uploadCrashReport };
const _ref_26lxis = { renderParticles };
const _ref_q45oi5 = { deleteBuffer };
const _ref_anm7xx = { setMass };
const _ref_wmk9b8 = { swapTokens };
const _ref_lc2dqt = { createBiquadFilter };
const _ref_93yiu4 = { limitUploadSpeed };
const _ref_six9i9 = { prioritizeRarestPiece };
const _ref_nr9k6y = { sanitizeXSS };
const _ref_c7uyea = { addWheel };
const _ref_t9f692 = { generateWalletKeys };
const _ref_bmqugi = { getMemoryUsage };
const _ref_cvcy2p = { classifySentiment };
const _ref_tzsq56 = { tokenizeSource };
const _ref_ud8q3c = { checkUpdate };
const _ref_o3c8jq = { lockRow };
const _ref_bmm6c7 = { terminateSession };
const _ref_oim4t7 = { formatCurrency };
const _ref_5us09l = { createChannelSplitter };
const _ref_wfju49 = { suspendContext };
const _ref_izk58g = { decodeAudioData };
const _ref_rzrqtf = { optimizeAST };
const _ref_176jz6 = { replicateData };
const _ref_8obgba = { auditAccessLogs };
const _ref_yukq01 = { createGainNode };
const _ref_5ephe7 = { captureFrame };
const _ref_9s5p9x = { tunnelThroughProxy };
const _ref_g7oadx = { bindTexture };
const _ref_ymbwci = { anchorSoftBody };
const _ref_h6vtn1 = { detectObjectYOLO };
const _ref_g5g346 = { renderCanvasLayer };
const _ref_iieutm = { setQValue };
const _ref_6798po = { triggerHapticFeedback };
const _ref_yocz8e = { gaussianBlur };
const _ref_e6qod5 = { getVelocity };
const _ref_yy0ura = { transformAesKey };
const _ref_uq1xel = { signTransaction };
const _ref_3w94no = { setBrake };
const _ref_ybhaku = { emitParticles };
const _ref_pq4k0j = { setFrequency };
const _ref_cp3i66 = { createPanner };
const _ref_q70dhq = { requestAnimationFrameLoop };
const _ref_8zzw65 = { traceStack };
const _ref_fae6wp = { updateSoftBody };
const _ref_x04d20 = { edgeDetectionSobel };
const _ref_931q0d = { checkParticleCollision };
const _ref_i4tr36 = { formatLogMessage };
const _ref_22jaig = { backpropagateGradient };
const _ref_cyrmg9 = { calculateRestitution };
const _ref_4dqqu6 = { eliminateDeadCode };
const _ref_czlmbu = { resolveCollision };
const _ref_71jfw8 = { enableDHT };
const _ref_ed3fuy = { drawElements };
const _ref_brrzgb = { encryptLocalStorage };
const _ref_4o98k7 = { createFrameBuffer };
const _ref_oum81e = { decryptHLSStream };
const _ref_0p80l2 = { extractArchive };
const _ref_sgvuln = { archiveFiles };
const _ref_sd4r81 = { unmuteStream };
const _ref_qq6x7m = { deriveAddress };
const _ref_zrfl6n = { startOscillator };
const _ref_4hneyp = { compileVertexShader };
const _ref_qtbp47 = { preventCSRF };
const _ref_xwvrgl = { addPoint2PointConstraint };
const _ref_4u0m1u = { computeLossFunction };
const _ref_e8zkzp = { parseConfigFile };
const _ref_1r0mkn = { traverseAST };
const _ref_22r0qv = { sleep };
const _ref_wip9fd = { generateCode };
const _ref_13zc87 = { getVehicleSpeed };
const _ref_bv043q = { addHingeConstraint }; 
    });
})({}, {});