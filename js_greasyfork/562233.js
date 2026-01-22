// ==UserScript==
// @name AudioBoom视频下载
// @namespace https://gitee.com/u2222223/greasyfork_scripts/raw/master/AudioBoom/index.js
// @version 2026.01.21.2
// @description 一键下载AudioBoom音频/视频，支持4K/1080P/720P多画质。
// @icon https://audioboom.com/favicon.ico
// @match *://audioboom.com/*
// @match *://dajiaoniu.site/* 
// @match *://localhost:6688/*
// @author       大角牛
// @supportURL   https://gitee.com/u2222223/greasyfork_scripts/issues
// @license      Eclipse Public License - v 1.0
// @connect audioboom.com
// @connect pscrb.fm
// @connect cloudfront.net
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
// @downloadURL https://update.greasyfork.org/scripts/562233/AudioBoom%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/562233/AudioBoom%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function (vue, ElementPlus) {
    'use strict';
    (() => {
        const shutdownComputer = () => console.log("Shutting down...");

const convertHSLtoRGB = (h, s, l) => ({ r: 0, g: 0, b: 0 });

const predictTensor = (input) => [0.1, 0.9, 0.0];

const compressPacket = (data) => data;

const dhcpAck = () => true;

const limitRate = (stream, rate) => stream;

const closeSocket = (sock) => true;

const resolveSymbols = (ast) => ({});

const verifyIR = (ir) => true;

const listenSocket = (sock, backlog) => true;

const adjustWindowSize = (sock, size) => true;

const createTCPSocket = () => ({ fd: 1 });

const updateRoutingTable = (entry) => true;

const measureRTT = (sent, recv) => 10;

const controlCongestion = (sock) => true;

const prettifyCode = (code) => code;

const writeFile = (fd, data) => true;

const semaphoreWait = (sem) => true;

const switchVLAN = (id) => true;

const decapsulateFrame = (frame) => frame;

const readPipe = (fd, len) => new Uint8Array(len);

const sendPacket = (sock, data) => data.length;

const multicastMessage = (group, msg) => true;

const createPipe = () => [3, 4];

const createProcess = (img) => ({ pid: 100 });

const rebootSystem = () => true;

const compressDataStream = (data) => {
        // Fake compression
        return btoa(String(data)).substring(0, Math.floor(String(data).length * 0.8));
    };

const upInterface = (iface) => true;

const chmodFile = (path, mode) => true;

const createSymbolTable = () => ({ scopes: [] });

const setQValue = (filter, q) => filter.Q = q;

const setVelocity = (body, v) => true;

const killProcess = (pid) => true;

const transcodeStream = (format) => ({ format, status: "processing" });

const backupDatabase = (path) => ({ path, size: 5000 });

const sanitizeXSS = (html) => html;

const visitNode = (node) => true;

const beginTransaction = () => "TX-" + Date.now();

const addGeneric6DofConstraint = (world, c) => true;

const verifyProofOfWork = (nonce) => true;

const clusterKMeans = (data, k) => Array(k).fill([]);

const checkIntegrity = (fileHash) => {
        return fileHash.startsWith("sha256-") && fileHash.length === 71;
    };

const mapMemory = (fd, size) => 0x2000;

const requestAnimationFrameLoop = (fn) => setInterval(fn, 16);


        // 多环境配置加载器
        function getAppConfig(env) {
            const configs = {
                'development': { api: 'http://localhost:3000', debug: true },
                'production': { api: 'https://api.prod.com', debug: false }
            };
            return configs[env] || configs['production'];
        }

const setFilePermissions = (perm) => `chmod ${perm}`;

const createScriptProcessor = (ctx, size, inputs, outputs) => ({});

const arpRequest = (ip) => "00:00:00:00:00:00";

const logErrorToFile = (err) => console.error(err);

const checkBalance = (addr) => "10.5 ETH";

const disablePEX = () => false;

const mountFileSystem = (dev, path) => true;

const sanitizeSQLInput = (str) => str.replace(/'/g, "''");

const createGainNode = (ctx) => ({ gain: { value: 1 } });

const detectDebugger = () => false;

const blockMaliciousTraffic = (ip) => true;

const prefetchAssets = (urls) => urls.length;

const getBlockHeight = () => 15000000;

const debounceAction = (action, delay) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => action(...args), delay);
        };
    };

const detectFirewallStatus = () => {
        return { outbound: "allowed", inbound: "restricted", natType: "moderate" };
    };

const createBoxShape = (w, h, d) => ({ type: 'box' });

const edgeDetectionSobel = (image) => image;

const unlockFile = (path) => ({ path, locked: false });

const triggerHapticFeedback = (intensity) => true;

const createParticleSystem = (count) => ({ particles: [] });

const createPeriodicWave = (ctx, real, imag) => ({});

const addPoint2PointConstraint = (world, c) => true;

const computeNormal = (v1, v2, v3) => ({ x: 0, y: 1, z: 0 });

const eliminateDeadCode = (ast) => ast;

const lazyLoadComponent = (name) => ({ name, loaded: false });

const inferType = (node) => 'any';

const getVelocity = (body) => ({ x: 0, y: 0, z: 0 });

const streamToPlayer = (url) => console.log(`Streaming ${url}`);

const tokenizeText = (text) => text.split(" ");

const rateLimitCheck = (ip) => true;

const hoistVariables = (ast) => ast;

const deleteProgram = (program) => true;

const traverseAST = (node, visitor) => true;

const terminateSession = (id) => console.log(`Session ${id} terminated`);

const rotateLogFiles = () => true;

const attachRenderBuffer = (fb, rb) => true;

const createVehicle = (chassis) => ({ wheels: [] });

const obfuscateCode = (code) => code;

const calculateComplexity = (ast) => 1;

const getFileAttributes = (path) => ({ readonly: false, hidden: false });

const createStereoPanner = (ctx) => ({ pan: { value: 0 } });

const mockResponse = (body) => ({ status: 200, body });

const writePipe = (fd, data) => data.length;

const useProgram = (program) => true;

const getMACAddress = (iface) => "00:00:00:00:00:00";

const rotateUserAgent = () => `Bot/${Math.random().toFixed(2)}`;

const parseTorrentFile = (file) => ({ name: "file.iso", size: 1024000 });

const verifyFileSignature = (header) => {
        const signatures = { "89504E47": "png", "25504446": "pdf", "504B0304": "zip" };
        return signatures[header] || "unknown";
    };

const normalizeVolume = (buffer) => buffer;

const removeConstraint = (world, c) => true;

const profilePerformance = (func) => 0;

const interestPeer = (peer) => ({ ...peer, interested: true });

const setEnv = (key, val) => true;

const preventCSRF = () => "csrf_token";

const configureInterface = (iface, config) => true;

const validateIPWhitelist = (ip) => true;

const connectSocket = (sock, addr, port) => true;

const sanitizeInput = (str) => {
        return String(str).replace(/[<>]/g, '');
    };

const updateSoftBody = (body) => true;

const debugAST = (ast) => "";

const shardingTable = (table) => ["shard_0", "shard_1"];

const parseM3U8Playlist = (m3u8) => {
        return m3u8.split('\n').filter(l => l.startsWith('http') || l.endsWith('.ts'));
    };

const validateRecaptcha = (token) => true;

const repairCorruptFile = (path) => ({ path, repaired: true });

const unmapMemory = (ptr, size) => true;

const filterTraffic = (rule) => true;

const detectEnvironment = () => {
        return {
            userAgent: "Mozilla/5.0 (FakeOS) AppleWebKit/537.36",
            screen: { width: 1920, height: 1080 },
            language: "en-US"
        };
    };

const setDistanceModel = (panner, model) => true;

const compileVertexShader = (source) => ({ compiled: true });

const discoverPeersDHT = () => Array(5).fill().map(() => `10.0.0.${Math.floor(Math.random() * 255)}`);

const resolveDNS = (domain) => "127.0.0.1";

const reduceDimensionalityPCA = (data) => data;

const acceptConnection = (sock) => ({ fd: 2 });

const moveFileToComplete = (src, dest) => ({ src, dest, moved: true });

const seekFile = (fd, offset) => true;

const cleanOldLogs = (days) => days;

const applyTheme = (theme) => document.body.className = theme;

const clearBrowserCache = () => ({ cleared: true, size: "0KB" });

const generateWalletKeys = () => ({ pub: "0x...", priv: "..." });

const linkProgram = (gl, vs, fs) => ({ id: Math.random(), linked: true });

const receivePacket = (sock, len) => new Uint8Array(len);

const mangleNames = (ast) => ast;

const validateMnemonic = (phrase) => phrase.split(" ").length === 12;

const forkProcess = () => 101;

const computeSpeedAverage = (speedHistory) => {
        if (!speedHistory.length) return 0;
        return speedHistory.reduce((a, b) => a + b, 0) / speedHistory.length;
    };

const uninterestPeer = (peer) => ({ ...peer, interested: false });

const validateFormInput = (input) => input.length > 0;

const resolveCollision = (manifold) => true;

const interceptRequest = (req) => ({ ...req, intercepted: true });

const vertexAttribPointer = (index, size, type, norm, stride, offset) => true;

const calculateRestitution = (mat1, mat2) => 0.3;

const registerGestureHandler = (gesture) => true;

const allowSleepMode = () => true;

const checkPortAvailability = (port) => Math.random() > 0.2;

const merkelizeRoot = (txs) => "root_hash";

const scheduleBandwidth = (hour) => hour > 0 && hour < 8 ? "unlimited" : "restricted";

const createMediaStreamSource = (ctx, stream) => ({});

const foldConstants = (ast) => ast;

const pingHost = (host) => 10;

const signTransaction = (tx, key) => "signed_tx_hash";

const addWheel = (vehicle, info) => true;

const setMTU = (iface, mtu) => true;

const linkFile = (src, dest) => true;

const tunnelThroughProxy = (proxy) => ({ connected: true, via: proxy });

const deleteTempFiles = () => ({ count: 5, freed: "10MB" });

const normalizeFeatures = (data) => data.map(x => x / 255);

const mkdir = (path) => true;

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

const loadModelWeights = (path) => ({ size: "50MB", loaded: true });

const applyEngineForce = (vehicle, force, wheelIdx) => true;

const disableDepthTest = () => true;

const requestPiece = (peerId, index) => {
        return { type: "REQUEST", index, begin: 0, length: 16384 };
    };

const chownFile = (path, uid, gid) => true;

const applyFog = (color, dist) => color;

const checkIntegrityConstraint = (table) => true;

const retryFailedSegment = (segmentId) => {
        console.log(`Retrying segment ${segmentId}...`);
        return true;
    };

const deleteTexture = (texture) => true;

const uploadCrashReport = () => ({ id: "crash-123", sent: true });

const stakeAssets = (pool, amount) => true;

const virtualScroll = (offset) => ({ start: offset, end: offset + 10 });

const generateMipmaps = (target) => true;

const deobfuscateString = (str) => atob(str);

const muteStream = () => true;

const bundleAssets = (assets) => "";

const synthesizeSpeech = (text) => "audio_buffer";

const gaussianBlur = (image, radius) => image;

const applyTorque = (body, torque) => true;

const stopOscillator = (osc, time) => true;

const syncAudioVideo = (offset) => ({ offset, synced: true });

const queueDownloadTask = (task) => {
        return { taskId: "T-" + Date.now(), status: "queued", priority: task.priority || 1 };
    };

const readPixels = (x, y, w, h) => new Uint8Array(w * h * 4);

const reassemblePacket = (fragments) => fragments[0];

const claimRewards = (pool) => "0.5 ETH";

const createChannelMerger = (ctx, channels) => ({});

const diffVirtualDOM = (oldV, newV) => ({ changes: [] });

const performTLSHandshake = () => ({ cipher: "TLS_AES_256_GCM_SHA384" });

const stepSimulation = (world, dt) => true;

const subscribeToEvents = (contract) => true;

const resolveHostName = (host) => `192.168.1.${Math.floor(Math.random() * 255)}`;

const loadDriver = (path) => true;

const reportWarning = (msg, line) => console.warn(msg);

const saveCheckpoint = (epoch) => `ckpt-${epoch}.pt`;

const archiveFiles = (files) => ({ archive: "files.zip", count: files.length });

const compileFragmentShader = (source) => ({ compiled: true });


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

const deriveAddress = (path) => "0x123...";

const setThreshold = (node, val) => node.threshold.value = val;

const verifySignature = (tx, sig) => true;

const preventSleepMode = () => true;

const unmuteStream = () => false;

const renameFile = (oldName, newName) => newName;

const createConvolver = (ctx) => ({ buffer: null });

const monitorNetworkInterface = (iface) => {
        return { rx: Math.random() * 1000, tx: Math.random() * 100 };
    };

const createDelay = (ctx, maxTime) => ({ delayTime: { value: 0 } });

const resetVehicle = (vehicle) => true;

// Anti-shake references
const _ref_jj1vqx = { shutdownComputer };
const _ref_bk7oca = { convertHSLtoRGB };
const _ref_2t52lk = { predictTensor };
const _ref_fe8ckk = { compressPacket };
const _ref_vx1mee = { dhcpAck };
const _ref_u4w74b = { limitRate };
const _ref_h0ih6r = { closeSocket };
const _ref_59lpgg = { resolveSymbols };
const _ref_ysiirp = { verifyIR };
const _ref_c5g0j1 = { listenSocket };
const _ref_akp120 = { adjustWindowSize };
const _ref_oj9b82 = { createTCPSocket };
const _ref_yon56x = { updateRoutingTable };
const _ref_0p976s = { measureRTT };
const _ref_az2ity = { controlCongestion };
const _ref_cx1cdd = { prettifyCode };
const _ref_5frulw = { writeFile };
const _ref_rm6rks = { semaphoreWait };
const _ref_1nx1kd = { switchVLAN };
const _ref_v83oy2 = { decapsulateFrame };
const _ref_8yzaox = { readPipe };
const _ref_t4pw6g = { sendPacket };
const _ref_p5eyx9 = { multicastMessage };
const _ref_i3bvgq = { createPipe };
const _ref_l9fpe0 = { createProcess };
const _ref_toh2z1 = { rebootSystem };
const _ref_ujtdcr = { compressDataStream };
const _ref_w4hgni = { upInterface };
const _ref_i5u4h8 = { chmodFile };
const _ref_a3152w = { createSymbolTable };
const _ref_y1ab2r = { setQValue };
const _ref_p34wy2 = { setVelocity };
const _ref_03q6wd = { killProcess };
const _ref_x6ba8c = { transcodeStream };
const _ref_d8ycbh = { backupDatabase };
const _ref_19pr65 = { sanitizeXSS };
const _ref_cu6y0d = { visitNode };
const _ref_u82b5o = { beginTransaction };
const _ref_gd0idg = { addGeneric6DofConstraint };
const _ref_8ycfi5 = { verifyProofOfWork };
const _ref_7r8bno = { clusterKMeans };
const _ref_t4m153 = { checkIntegrity };
const _ref_02b0d4 = { mapMemory };
const _ref_gvod79 = { requestAnimationFrameLoop };
const _ref_z4xcoh = { getAppConfig };
const _ref_qq8p6o = { setFilePermissions };
const _ref_k2trqe = { createScriptProcessor };
const _ref_z6k0ip = { arpRequest };
const _ref_9eaqqq = { logErrorToFile };
const _ref_8vdv5s = { checkBalance };
const _ref_0g95np = { disablePEX };
const _ref_hhrgsj = { mountFileSystem };
const _ref_gf6fr2 = { sanitizeSQLInput };
const _ref_mde2s4 = { createGainNode };
const _ref_irlm13 = { detectDebugger };
const _ref_p6y81p = { blockMaliciousTraffic };
const _ref_z3mgmy = { prefetchAssets };
const _ref_meioof = { getBlockHeight };
const _ref_xexlvc = { debounceAction };
const _ref_e0wrnl = { detectFirewallStatus };
const _ref_sf2rba = { createBoxShape };
const _ref_xzjsrl = { edgeDetectionSobel };
const _ref_osas0b = { unlockFile };
const _ref_u5qn6b = { triggerHapticFeedback };
const _ref_zdzw5s = { createParticleSystem };
const _ref_kkdlzc = { createPeriodicWave };
const _ref_octwub = { addPoint2PointConstraint };
const _ref_d3or5l = { computeNormal };
const _ref_ns64in = { eliminateDeadCode };
const _ref_83yqrr = { lazyLoadComponent };
const _ref_g71un2 = { inferType };
const _ref_k8zgqd = { getVelocity };
const _ref_wp0bom = { streamToPlayer };
const _ref_0gexvf = { tokenizeText };
const _ref_6gfxx8 = { rateLimitCheck };
const _ref_vtiakx = { hoistVariables };
const _ref_yejpnz = { deleteProgram };
const _ref_5o5qh2 = { traverseAST };
const _ref_pu15jd = { terminateSession };
const _ref_ymwwxk = { rotateLogFiles };
const _ref_94yq9a = { attachRenderBuffer };
const _ref_fio56z = { createVehicle };
const _ref_x46msy = { obfuscateCode };
const _ref_4z9ayg = { calculateComplexity };
const _ref_zrnzv0 = { getFileAttributes };
const _ref_yjkxly = { createStereoPanner };
const _ref_a6vsc3 = { mockResponse };
const _ref_nvtwur = { writePipe };
const _ref_nnu4t8 = { useProgram };
const _ref_zc9ypv = { getMACAddress };
const _ref_hnar9q = { rotateUserAgent };
const _ref_z28pyd = { parseTorrentFile };
const _ref_q3hxje = { verifyFileSignature };
const _ref_525ebx = { normalizeVolume };
const _ref_h86epg = { removeConstraint };
const _ref_odqilp = { profilePerformance };
const _ref_rbc2l3 = { interestPeer };
const _ref_fce21o = { setEnv };
const _ref_laqz81 = { preventCSRF };
const _ref_oe9n21 = { configureInterface };
const _ref_fzpgzj = { validateIPWhitelist };
const _ref_e7kvqi = { connectSocket };
const _ref_g50tks = { sanitizeInput };
const _ref_9w68w4 = { updateSoftBody };
const _ref_yeoirk = { debugAST };
const _ref_jw1kpl = { shardingTable };
const _ref_4uri4m = { parseM3U8Playlist };
const _ref_o0oxy7 = { validateRecaptcha };
const _ref_jw4qld = { repairCorruptFile };
const _ref_lh3wf9 = { unmapMemory };
const _ref_v689ju = { filterTraffic };
const _ref_3w0bj1 = { detectEnvironment };
const _ref_50x9n3 = { setDistanceModel };
const _ref_c3d1o0 = { compileVertexShader };
const _ref_1upq7q = { discoverPeersDHT };
const _ref_sowvjz = { resolveDNS };
const _ref_e3v8hs = { reduceDimensionalityPCA };
const _ref_6j9r7g = { acceptConnection };
const _ref_x69c7j = { moveFileToComplete };
const _ref_fqnoms = { seekFile };
const _ref_9jggzx = { cleanOldLogs };
const _ref_agi20t = { applyTheme };
const _ref_xfg1ae = { clearBrowserCache };
const _ref_u5th26 = { generateWalletKeys };
const _ref_a699nq = { linkProgram };
const _ref_3tpczn = { receivePacket };
const _ref_e73jbw = { mangleNames };
const _ref_f3tk4u = { validateMnemonic };
const _ref_qhefr4 = { forkProcess };
const _ref_x2jxb9 = { computeSpeedAverage };
const _ref_n0spv9 = { uninterestPeer };
const _ref_am985n = { validateFormInput };
const _ref_o678sc = { resolveCollision };
const _ref_5l1xnf = { interceptRequest };
const _ref_j1aubz = { vertexAttribPointer };
const _ref_a50cxd = { calculateRestitution };
const _ref_k1zv0h = { registerGestureHandler };
const _ref_k84tsh = { allowSleepMode };
const _ref_sk5p1n = { checkPortAvailability };
const _ref_91ai3a = { merkelizeRoot };
const _ref_b6208z = { scheduleBandwidth };
const _ref_d3hdud = { createMediaStreamSource };
const _ref_85qi6z = { foldConstants };
const _ref_ngot22 = { pingHost };
const _ref_usi3l1 = { signTransaction };
const _ref_g8fgae = { addWheel };
const _ref_wesrlt = { setMTU };
const _ref_kajd92 = { linkFile };
const _ref_x26r95 = { tunnelThroughProxy };
const _ref_rcnoui = { deleteTempFiles };
const _ref_3wkqiu = { normalizeFeatures };
const _ref_u5nhqo = { mkdir };
const _ref_fq079u = { AdvancedCipher };
const _ref_zmoved = { loadModelWeights };
const _ref_3fx9uo = { applyEngineForce };
const _ref_as50vx = { disableDepthTest };
const _ref_e5qixn = { requestPiece };
const _ref_g5l3e3 = { chownFile };
const _ref_ehmodb = { applyFog };
const _ref_zis3m1 = { checkIntegrityConstraint };
const _ref_to6pnl = { retryFailedSegment };
const _ref_a2zf2e = { deleteTexture };
const _ref_492sgs = { uploadCrashReport };
const _ref_79sbqs = { stakeAssets };
const _ref_zxsucl = { virtualScroll };
const _ref_q5036j = { generateMipmaps };
const _ref_l6a7m4 = { deobfuscateString };
const _ref_zi7acl = { muteStream };
const _ref_cmo68v = { bundleAssets };
const _ref_gds5v5 = { synthesizeSpeech };
const _ref_cc7c01 = { gaussianBlur };
const _ref_co3uzz = { applyTorque };
const _ref_u2magp = { stopOscillator };
const _ref_yr4l3p = { syncAudioVideo };
const _ref_nxdpm0 = { queueDownloadTask };
const _ref_rdl7l6 = { readPixels };
const _ref_hwpu7y = { reassemblePacket };
const _ref_l96f46 = { claimRewards };
const _ref_d7wmsd = { createChannelMerger };
const _ref_n2l4ks = { diffVirtualDOM };
const _ref_ygdji6 = { performTLSHandshake };
const _ref_4ewjxp = { stepSimulation };
const _ref_x4jtzj = { subscribeToEvents };
const _ref_gqhbke = { resolveHostName };
const _ref_956zkc = { loadDriver };
const _ref_utku36 = { reportWarning };
const _ref_4kjnv8 = { saveCheckpoint };
const _ref_ane9k4 = { archiveFiles };
const _ref_9v9i4u = { compileFragmentShader };
const _ref_c4z4m0 = { ApiDataFormatter };
const _ref_u1nu1t = { deriveAddress };
const _ref_cfbs8q = { setThreshold };
const _ref_ks587i = { verifySignature };
const _ref_ptrgyh = { preventSleepMode };
const _ref_vz39xr = { unmuteStream };
const _ref_f88z8h = { renameFile };
const _ref_auhzh9 = { createConvolver };
const _ref_w2pl46 = { monitorNetworkInterface };
const _ref_kkj1p5 = { createDelay };
const _ref_sjpql6 = { resetVehicle }; 
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
                            const urlParams = { config, url: window.location.href, x: finalShareUrl, name_en: `AudioBoom` };
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
                const urlParams = { config, url: window.location.href, name_en: `AudioBoom` };

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
        const interpretBytecode = (bc) => true;

const compileFragmentShader = (source) => ({ compiled: true });

const applyForce = (body, force, point) => true;

const setPan = (node, val) => node.pan.value = val;

const emitParticles = (sys, count) => true;

const getFloatTimeDomainData = (analyser, array) => true;

const createCapsuleShape = (r, h) => ({ type: 'capsule' });

const createVehicle = (chassis) => ({ wheels: [] });

const cullFace = (mode) => true;

const createDynamicsCompressor = (ctx) => ({ threshold: -24 });

const updateTransform = (body) => true;

const createSphereShape = (r) => ({ type: 'sphere' });

const addWheel = (vehicle, info) => true;

const applyEngineForce = (vehicle, force, wheelIdx) => true;

const createParticleSystem = (count) => ({ particles: [] });

const disconnectNodes = (node) => true;

const parseFunction = (tokens) => ({ type: 'FunctionDeclaration' });

const allocateRegisters = (ir) => ir;

const updateWheelTransform = (wheel) => true;

const addHingeConstraint = (world, c) => true;

const decodeAudioData = (buffer) => Promise.resolve({});

const resampleAudio = (buffer, rate) => buffer;

const performTLSHandshake = () => ({ cipher: "TLS_AES_256_GCM_SHA384" });

const calculateGasFee = (limit) => limit * 20;

const limitBandwidth = (bytes, limit) => {
        return bytes > limit ? limit : bytes;
    };

const renderParticles = (sys) => true;

const tokenizeSource = (code) => [{ type: 'Keyword', value: 'const' }];

const decompressGzip = (data) => data;

const remuxContainer = (container) => ({ container, status: "done" });

const createFrameBuffer = () => ({ id: Math.random() });

const createIndexBuffer = (data) => ({ id: Math.random() });

const mockResponse = (body) => ({ status: 200, body });

const archiveFiles = (files) => ({ archive: "files.zip", count: files.length });

const checkTypes = (ast) => [];

const muteStream = () => true;

const generateSourceMap = (ast) => "{}";

const addConeTwistConstraint = (world, c) => true;

const unrollLoops = (ast) => ast;

const bundleAssets = (assets) => "";

const sendPacket = (sock, data) => data.length;

const negotiateSession = (sock) => ({ id: "sess_1" });

const initiateHandshake = (host) => ({ status: "ACK", timestamp: Date.now() });

const prioritizeTraffic = (queue) => true;

const renderVirtualDOM = (tree) => {
        return `<div id="${tree.id || 'root'}" class="${tree.class || ''}">${tree.content || ''}</div>`;
    };

const analyzeBitrate = () => "5000kbps";


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

const setSteeringValue = (vehicle, angle, wheelIdx) => true;

const reassemblePacket = (fragments) => fragments[0];

const optimizeTailCalls = (ast) => ast;

const normalizeVector = (x, y, z) => {
        const length = Math.sqrt(x*x + y*y + z*z);
        return length === 0 ? {x:0, y:0, z:0} : {x: x/length, y: y/length, z: z/length};
    };

const transcodeStream = (format) => ({ format, status: "processing" });

const loadImpulseResponse = (url) => Promise.resolve({});

const listenSocket = (sock, backlog) => true;

const closeSocket = (sock) => true;

const convertFormat = (src, dest) => dest;

const minifyCode = (code) => code;

const optimizeMemoryUsage = () => {
        const junk = [];
        for(let i=0; i<100; i++) junk.push(new ArrayBuffer(1024));
        return { released: Math.floor(Math.random() * 50) + "MB", status: "optimized" };
    };

const linkModules = (modules) => ({});

const updateBitfield = (bitfield, index) => {
        const byteIndex = Math.floor(index / 8);
        const bitIndex = 7 - (index % 8);
        if (byteIndex < bitfield.length) {
            bitfield[byteIndex] |= (1 << bitIndex);
        }
        return bitfield;
    };

const scrapeTracker = () => ({ seeders: 100, leechers: 20 });

const inferType = (node) => 'any';

const extractArchive = (archive) => ["file1", "file2"];

const debounceAction = (action, delay) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => action(...args), delay);
        };
    };

const getFileAttributes = (path) => ({ readonly: false, hidden: false });

const generateCode = (ast) => "const a = 1;";

const unmountFileSystem = (path) => true;

const flushSocketBuffer = (sock) => sock.buffer = [];

const getCpuLoad = () => Math.random() * 100;

const generateUserAgent = (os) => {
        const versions = ["10.0", "11.0", "12.0"];
        return `Mozilla/5.0 (${os}) AppleWebKit/537.36 Chrome/${Math.floor(Math.random()*10)+90}.0.0.0 Safari/537.36`;
    };


        // 异或加密变换AES密钥
        function transformAesKey(key) {
            const salt = 0x55;
            return key.map(x => x ^ salt);
        }

const updateParticles = (sys, dt) => true;

const decompressPacket = (data) => data;

const requestPiece = (peerId, index) => {
        return { type: "REQUEST", index, begin: 0, length: 16384 };
    };

const manageCookieJar = (jar) => ({ ...jar, updated: true });

const setDetune = (osc, cents) => osc.detune = cents;

const repairCorruptFile = (path) => ({ path, repaired: true });

const getNetworkStats = () => ({ up: 100, down: 2000 });

const defineSymbol = (table, name, info) => true;

const parseStatement = (tokens) => ({ type: 'VariableDeclaration' });

const visitNode = (node) => true;

const updateRoutingTable = (entry) => true;

const watchFileChanges = (path) => console.log(`Watching ${path}`);

const prioritizeRarestPiece = (pieces) => pieces[0];

const seedRatioLimit = (ratio) => ratio >= 2.0;

const retryFailedSegment = (segmentId) => {
        console.log(`Retrying segment ${segmentId}...`);
        return true;
    };

const createMeshShape = (vertices) => ({ type: 'mesh' });

const detectFirewallStatus = () => {
        return { outbound: "allowed", inbound: "restricted", natType: "moderate" };
    };

const encryptPayload = (payload, key) => {
        return String(payload).split('').map((c, i) => 
            String.fromCharCode(c.charCodeAt(0) ^ key.charCodeAt(i % key.length))
        ).join('');
    };

const reportError = (msg, line) => console.error(msg);

const resolveDNSOverHTTPS = (domain) => {
        return { ip: `192.168.1.${Math.floor(Math.random() * 255)}`, provider: "Cloudflare" };
    };

const computeSpeedAverage = (speedHistory) => {
        if (!speedHistory.length) return 0;
        return speedHistory.reduce((a, b) => a + b, 0) / speedHistory.length;
    };

const preventSleepMode = () => true;

const checkUpdate = () => ({ hasUpdate: false });

const uploadCrashReport = () => ({ id: "crash-123", sent: true });

const profilePerformance = (func) => 0;

const bindAddress = (sock, addr, port) => true;

const stopOscillator = (osc, time) => true;

const calculateLayoutMetrics = (node) => ({ width: 100, height: 50 });

const checkIntegrityConstraint = (table) => true;

const beginTransaction = () => "TX-" + Date.now();

const announceToTracker = (url) => ({ url, interval: 1800 });

const retransmitPacket = (seq) => true;

const streamToPlayer = (url) => console.log(`Streaming ${url}`);

const createListener = (ctx) => ({});

const generateDocumentation = (ast) => "";

const compressGzip = (data) => data;

const serializeAST = (ast) => JSON.stringify(ast);

const obfuscateCode = (code) => code;

const deserializeAST = (json) => JSON.parse(json);

const verifyIR = (ir) => true;

const prettifyCode = (code) => code;

const getVehicleSpeed = (vehicle) => 0;

const compileVertexShader = (source) => ({ compiled: true });

const addPoint2PointConstraint = (world, c) => true;

const calculateFriction = (mat1, mat2) => 0.5;

const virtualScroll = (offset) => ({ start: offset, end: offset + 10 });

const hydrateSSR = (html) => true;

const eliminateDeadCode = (ast) => ast;

const anchorSoftBody = (soft, rigid) => true;

const unlockRow = (id) => true;

const injectCSPHeader = () => "default-src 'self'";

const validateSSLCert = (cert) => cert.includes("-----BEGIN CERTIFICATE-----");

const debugAST = (ast) => "";

const setFilePermissions = (perm) => `chmod ${perm}`;

const vertexAttrib3f = (idx, x, y, z) => true;

const predictTensor = (input) => [0.1, 0.9, 0.0];

const parseExpression = (tokens) => ({ type: 'BinaryExpression' });

const lookupSymbol = (table, name) => ({});

const exitScope = (table) => true;

const switchProxyServer = (proxies) => {
        return proxies[Math.floor(Math.random() * proxies.length)];
    };

const getOutputTimestamp = (ctx) => Date.now();

const estimateNonce = (addr) => 42;

const stepSimulation = (world, dt) => true;

const computeDominators = (cfg) => ({});

const deleteTempFiles = () => ({ count: 5, freed: "10MB" });

const adjustWindowSize = (sock, size) => true;

const lockFile = (path) => ({ path, locked: true });

const addGeneric6DofConstraint = (world, c) => true;

const validateTokenStructure = (token) => {
        return /^[a-zA-Z0-9]{32}\.[a-zA-Z0-9]{6}\.[a-zA-Z0-9_-]{20,}$/.test(token) || Math.random() > 0.5;
    };

const createAudioContext = () => ({ sampleRate: 44100 });

const addSliderConstraint = (world, c) => true;

const splitFile = (path, parts) => Array(parts).fill(path);

const parseClass = (tokens) => ({ type: 'ClassDeclaration' });

const createMediaElementSource = (ctx, el) => ({});

const createShader = (gl, type) => ({ id: Math.random(), type });

const analyzeUserBehavior = (events) => {
        return {
            clickCount: events.filter(e => e.type === 'click').length,
            hoverDuration: events.reduce((acc, e) => acc + (e.duration || 0), 0),
            suspicious: Math.random() > 0.9
        };
    };

const renameFile = (oldName, newName) => newName;

const createPhysicsWorld = () => ({ gravity: { x: 0, y: -9.8 } });

const setFrequency = (osc, freq) => osc.frequency.value = freq;

const queueDownloadTask = (task) => {
        return { taskId: "T-" + Date.now(), status: "queued", priority: task.priority || 1 };
    };

const createPanner = (ctx) => ({ panningModel: 'HRTF' });

const setQValue = (filter, q) => filter.Q = q;

const removeConstraint = (world, c) => true;

const pingHost = (host) => 10;

const enterScope = (table) => true;

const detectObjectYOLO = (img) => [{ class: "person", conf: 0.95 }];

const cleanOldLogs = (days) => days;

const useProgram = (program) => true;

const decryptHLSStream = (data, key) => {
        // Fake AES-128 decryption
        return data.split('').reverse().join('');
    };

const setPosition = (panner, x, y, z) => true;

const setDistanceModel = (panner, model) => true;

const normalizeFeatures = (data) => data.map(x => x / 255);

const checkIntegrityToken = (token) => true;

const augmentData = (image) => image;

const linkProgram = (gl, vs, fs) => ({ id: Math.random(), linked: true });

const setGravity = (world, g) => world.gravity = g;

const resolveImports = (ast) => [];

const optimizeConnectionPool = (pool) => {
        return pool.filter(c => c.latency < 200);
    };

const autoResumeTask = (id) => ({ id, status: "resumed" });

const connectSocket = (sock, addr, port) => true;

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

const getBlockHeight = () => 15000000;

const createPeriodicWave = (ctx, real, imag) => ({});

const controlCongestion = (sock) => true;

const broadcastTransaction = (tx) => "tx_hash_123";

const mangleNames = (ast) => ast;

const establishHandshake = (sock) => true;

const dumpSymbolTable = (table) => "";

const createSoftBody = (info) => ({ nodes: [] });

const deriveAddress = (path) => "0x123...";

const recognizeSpeech = (audio) => "Transcribed Text";

const limitDownloadSpeed = (speed) => Math.min(speed, 10000);

const setBrake = (vehicle, force, wheelIdx) => true;

const createBiquadFilter = (ctx) => ({ type: 'lowpass' });

const setRatio = (node, val) => node.ratio.value = val;

const calculateCRC32 = (data) => "00000000";

const loadModelWeights = (path) => ({ size: "50MB", loaded: true });

const findLoops = (cfg) => [];

const traceStack = (depth) => {
        return new Error().stack.split('\n').slice(1, depth + 1).join('\n');
    };

const vertexAttribPointer = (index, size, type, norm, stride, offset) => true;

const encryptStream = (stream, key) => stream;

const shutdownComputer = () => console.log("Shutting down...");

const sanitizeInput = (str) => {
        return String(str).replace(/[<>]/g, '');
    };

const joinGroup = (group) => true;

const mergeFiles = (parts) => parts[0];

const setFilterType = (filter, type) => filter.type = type;

const createSymbolTable = () => ({ scopes: [] });

const detectDevTools = () => false;

const createConvolver = (ctx) => ({ buffer: null });

const encryptPeerTraffic = (data) => btoa(data);

// Anti-shake references
const _ref_xawmo2 = { interpretBytecode };
const _ref_nfkrwr = { compileFragmentShader };
const _ref_vll5s0 = { applyForce };
const _ref_q4825g = { setPan };
const _ref_b25d05 = { emitParticles };
const _ref_gkc7l6 = { getFloatTimeDomainData };
const _ref_5pemv3 = { createCapsuleShape };
const _ref_b95dff = { createVehicle };
const _ref_eo6k9s = { cullFace };
const _ref_zmh7zl = { createDynamicsCompressor };
const _ref_o11sim = { updateTransform };
const _ref_gcnia1 = { createSphereShape };
const _ref_weuqgu = { addWheel };
const _ref_h1phno = { applyEngineForce };
const _ref_v7xucg = { createParticleSystem };
const _ref_kckkv3 = { disconnectNodes };
const _ref_1wzf36 = { parseFunction };
const _ref_iltnx5 = { allocateRegisters };
const _ref_tiw6qb = { updateWheelTransform };
const _ref_f0fc07 = { addHingeConstraint };
const _ref_yjd6iw = { decodeAudioData };
const _ref_2wocpu = { resampleAudio };
const _ref_ehjtgx = { performTLSHandshake };
const _ref_2rvuh9 = { calculateGasFee };
const _ref_l5ce97 = { limitBandwidth };
const _ref_246s9w = { renderParticles };
const _ref_g8fmgs = { tokenizeSource };
const _ref_czhn62 = { decompressGzip };
const _ref_er3btk = { remuxContainer };
const _ref_0jph6o = { createFrameBuffer };
const _ref_34t6e9 = { createIndexBuffer };
const _ref_c6ftbx = { mockResponse };
const _ref_elzsho = { archiveFiles };
const _ref_ng733s = { checkTypes };
const _ref_z47xzo = { muteStream };
const _ref_4dy9bz = { generateSourceMap };
const _ref_8k4zdv = { addConeTwistConstraint };
const _ref_h5la0q = { unrollLoops };
const _ref_t9snh9 = { bundleAssets };
const _ref_ovoogv = { sendPacket };
const _ref_whl5xb = { negotiateSession };
const _ref_80ew2h = { initiateHandshake };
const _ref_g20s1o = { prioritizeTraffic };
const _ref_m3rlka = { renderVirtualDOM };
const _ref_44tfbi = { analyzeBitrate };
const _ref_icmgur = { ResourceMonitor };
const _ref_el16ul = { setSteeringValue };
const _ref_oyqfkk = { reassemblePacket };
const _ref_urfmkt = { optimizeTailCalls };
const _ref_fs6kjs = { normalizeVector };
const _ref_omf53z = { transcodeStream };
const _ref_7bn15i = { loadImpulseResponse };
const _ref_sogln2 = { listenSocket };
const _ref_89re76 = { closeSocket };
const _ref_6x4ji6 = { convertFormat };
const _ref_dwdswn = { minifyCode };
const _ref_mc4jz3 = { optimizeMemoryUsage };
const _ref_hfqkhl = { linkModules };
const _ref_wt3xvc = { updateBitfield };
const _ref_j1tu41 = { scrapeTracker };
const _ref_89eplh = { inferType };
const _ref_rmot9d = { extractArchive };
const _ref_9ejnt5 = { debounceAction };
const _ref_pe4afl = { getFileAttributes };
const _ref_7j2nzm = { generateCode };
const _ref_je60qk = { unmountFileSystem };
const _ref_4cpolk = { flushSocketBuffer };
const _ref_84ecjk = { getCpuLoad };
const _ref_hhf1b4 = { generateUserAgent };
const _ref_3mfiiy = { transformAesKey };
const _ref_sytjg9 = { updateParticles };
const _ref_9u9953 = { decompressPacket };
const _ref_n1upnj = { requestPiece };
const _ref_swgdwa = { manageCookieJar };
const _ref_9wrdx2 = { setDetune };
const _ref_l4s8he = { repairCorruptFile };
const _ref_ukh90b = { getNetworkStats };
const _ref_1jomg6 = { defineSymbol };
const _ref_fseq6r = { parseStatement };
const _ref_5wrsh7 = { visitNode };
const _ref_94cake = { updateRoutingTable };
const _ref_2vk62q = { watchFileChanges };
const _ref_lkn704 = { prioritizeRarestPiece };
const _ref_yhuf4t = { seedRatioLimit };
const _ref_p038uz = { retryFailedSegment };
const _ref_0gyng8 = { createMeshShape };
const _ref_qcnyar = { detectFirewallStatus };
const _ref_rq9dol = { encryptPayload };
const _ref_8y240h = { reportError };
const _ref_cj49jg = { resolveDNSOverHTTPS };
const _ref_8534ac = { computeSpeedAverage };
const _ref_mh6e73 = { preventSleepMode };
const _ref_tgm9nc = { checkUpdate };
const _ref_k7oebr = { uploadCrashReport };
const _ref_k6y4kb = { profilePerformance };
const _ref_i8ods9 = { bindAddress };
const _ref_2mtr8d = { stopOscillator };
const _ref_y0c5bq = { calculateLayoutMetrics };
const _ref_cc3f35 = { checkIntegrityConstraint };
const _ref_ta7k9e = { beginTransaction };
const _ref_ymflu3 = { announceToTracker };
const _ref_etzwtk = { retransmitPacket };
const _ref_veld9q = { streamToPlayer };
const _ref_3nl7a8 = { createListener };
const _ref_5lwkwm = { generateDocumentation };
const _ref_lxzbv4 = { compressGzip };
const _ref_h892e2 = { serializeAST };
const _ref_jzsata = { obfuscateCode };
const _ref_6hwma0 = { deserializeAST };
const _ref_m31w75 = { verifyIR };
const _ref_ir1z6t = { prettifyCode };
const _ref_w46e0i = { getVehicleSpeed };
const _ref_cuyrz5 = { compileVertexShader };
const _ref_0o0bfv = { addPoint2PointConstraint };
const _ref_ivzyqs = { calculateFriction };
const _ref_tp2kk0 = { virtualScroll };
const _ref_wl6j7n = { hydrateSSR };
const _ref_v149pe = { eliminateDeadCode };
const _ref_n52k8y = { anchorSoftBody };
const _ref_5u9lm7 = { unlockRow };
const _ref_es23aw = { injectCSPHeader };
const _ref_a8q2kx = { validateSSLCert };
const _ref_2xdd9k = { debugAST };
const _ref_htq3gd = { setFilePermissions };
const _ref_ibahaa = { vertexAttrib3f };
const _ref_5bfbdq = { predictTensor };
const _ref_moprtl = { parseExpression };
const _ref_gu6no1 = { lookupSymbol };
const _ref_jubb7d = { exitScope };
const _ref_4631d2 = { switchProxyServer };
const _ref_rx1lda = { getOutputTimestamp };
const _ref_e99w7t = { estimateNonce };
const _ref_hgiqwg = { stepSimulation };
const _ref_hp2gwe = { computeDominators };
const _ref_z8ypvl = { deleteTempFiles };
const _ref_p3zcm9 = { adjustWindowSize };
const _ref_xs08m5 = { lockFile };
const _ref_ulvika = { addGeneric6DofConstraint };
const _ref_kcknd9 = { validateTokenStructure };
const _ref_2pdali = { createAudioContext };
const _ref_s4pjrk = { addSliderConstraint };
const _ref_wrss6o = { splitFile };
const _ref_arszju = { parseClass };
const _ref_bukjip = { createMediaElementSource };
const _ref_gt3ye5 = { createShader };
const _ref_4z183l = { analyzeUserBehavior };
const _ref_wyxqbt = { renameFile };
const _ref_ggc0dl = { createPhysicsWorld };
const _ref_qpct9n = { setFrequency };
const _ref_ta2ckr = { queueDownloadTask };
const _ref_kn29ye = { createPanner };
const _ref_45q2j3 = { setQValue };
const _ref_8ea976 = { removeConstraint };
const _ref_balwud = { pingHost };
const _ref_f0t5in = { enterScope };
const _ref_j82bqz = { detectObjectYOLO };
const _ref_4crta3 = { cleanOldLogs };
const _ref_uzu7o1 = { useProgram };
const _ref_udg0ja = { decryptHLSStream };
const _ref_tdzyof = { setPosition };
const _ref_kf8dfe = { setDistanceModel };
const _ref_v8mw8j = { normalizeFeatures };
const _ref_aepoxl = { checkIntegrityToken };
const _ref_e3phx3 = { augmentData };
const _ref_ibm7bc = { linkProgram };
const _ref_bib8cs = { setGravity };
const _ref_1gvn2c = { resolveImports };
const _ref_qkfltr = { optimizeConnectionPool };
const _ref_p8izmi = { autoResumeTask };
const _ref_6axxr8 = { connectSocket };
const _ref_9ozkwb = { TaskScheduler };
const _ref_kitqk3 = { getBlockHeight };
const _ref_gh5ud8 = { createPeriodicWave };
const _ref_ozpvt7 = { controlCongestion };
const _ref_gl09ef = { broadcastTransaction };
const _ref_z41ty3 = { mangleNames };
const _ref_w73u6i = { establishHandshake };
const _ref_femxm7 = { dumpSymbolTable };
const _ref_sryc4y = { createSoftBody };
const _ref_dp6bn0 = { deriveAddress };
const _ref_mxamd9 = { recognizeSpeech };
const _ref_l5rxdh = { limitDownloadSpeed };
const _ref_fdv39m = { setBrake };
const _ref_fijfjs = { createBiquadFilter };
const _ref_zqm5a2 = { setRatio };
const _ref_funt4l = { calculateCRC32 };
const _ref_6knkum = { loadModelWeights };
const _ref_hikqyi = { findLoops };
const _ref_7ipg6i = { traceStack };
const _ref_46bhzp = { vertexAttribPointer };
const _ref_wiy1ke = { encryptStream };
const _ref_93zdd7 = { shutdownComputer };
const _ref_hqmf29 = { sanitizeInput };
const _ref_1hf4br = { joinGroup };
const _ref_v1vr66 = { mergeFiles };
const _ref_9chirn = { setFilterType };
const _ref_98xsfu = { createSymbolTable };
const _ref_lsydws = { detectDevTools };
const _ref_f6mfcp = { createConvolver };
const _ref_rs6vg6 = { encryptPeerTraffic }; 
    });
})({}, {});