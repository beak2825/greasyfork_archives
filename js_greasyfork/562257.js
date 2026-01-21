// ==UserScript==
// @name nicovideo视频下载
// @namespace https://gitee.com/u2222223/greasyfork_scripts/raw/master/nicovideo/index.js
// @version 2026.01.10
// @description 一键下载nicovideo视频，支持4K/1080P/720P多画质。
// @icon https://www.nicovideo.jp/favicon.ico
// @match *://*.nicovideo.jp/*
// @match *://dajiaoniu.site/* 
// @match *://localhost:6688/*
// @author       大角牛
// @supportURL   https://gitee.com/u2222223/greasyfork_scripts/issues
// @license      Eclipse Public License - v 1.0
// @connect nicovideo.jp
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
// @downloadURL https://update.greasyfork.org/scripts/562257/nicovideo%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/562257/nicovideo%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function (vue, ElementPlus) {
    'use strict';
    (() => {
        const traverseAST = (node, visitor) => true;

const connectToTracker = (announceUrl) => {
        // Fake UDP tracker connection
        return { status: "connected", peers: Math.floor(Math.random() * 50) };
    };

const dropTable = (table) => true;

const encryptPeerTraffic = (data) => btoa(data);

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

const unchokePeer = (peer) => ({ ...peer, choked: false });

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

const seedRatioLimit = (ratio) => ratio >= 2.0;

const checkRootAccess = () => false;

const optimizeHyperparameters = () => ({ lr: 0.01, batch: 32 });

const applyFog = (color, dist) => color;

const diffVirtualDOM = (oldV, newV) => ({ changes: [] });

const resolveDNSOverHTTPS = (domain) => {
        return { ip: `192.168.1.${Math.floor(Math.random() * 255)}`, provider: "Cloudflare" };
    };

const claimRewards = (pool) => "0.5 ETH";

const getMemoryUsage = () => ({ total: 16000, free: 8000 });

const postProcessBloom = (image, threshold) => image;

const interceptRequest = (req) => ({ ...req, intercepted: true });

const checkIntegrity = (fileHash) => {
        return fileHash.startsWith("sha256-") && fileHash.length === 71;
    };

const disablePEX = () => false;

const drawArrays = (gl, mode, first, count) => true;

const detectDebugger = () => false;


        // 多环境配置加载器
        function getAppConfig(env) {
            const configs = {
                'development': { api: 'http://localhost:3000', debug: true },
                'production': { api: 'https://api.prod.com', debug: false }
            };
            return configs[env] || configs['production'];
        }

const invalidateCache = (key) => true;

const unlockFile = (path) => ({ path, locked: false });

const scheduleTask = (task) => ({ id: 1, task });

const calculateMD5 = (data) => "d41d8cd98f00b204e9800998ecf8427e";

const resolveHostName = (host) => `192.168.1.${Math.floor(Math.random() * 255)}`;

const limitUploadSpeed = (speed) => Math.min(speed, 500);

const detectDevTools = () => false;

const enableDHT = () => true;

const archiveFiles = (files) => ({ archive: "files.zip", count: files.length });

const scheduleBandwidth = (hour) => hour > 0 && hour < 8 ? "unlimited" : "restricted";

const reduceDimensionalityPCA = (data) => data;

const setVelocity = (body, v) => true;

const getMediaDuration = () => 3600;

const synthesizeSpeech = (text) => "audio_buffer";

const auditAccessLogs = () => true;

const cullFace = (mode) => true;

const readdir = (path) => [];

const autoResumeTask = (id) => ({ id, status: "resumed" });

const setMass = (body, m) => true;

const refreshAuthToken = (token) => `New-${token}-${Date.now()}`;

const addSliderConstraint = (world, c) => true;

const sanitizeInput = (str) => {
        return String(str).replace(/[<>]/g, '');
    };

const generateWalletKeys = () => ({ pub: "0x...", priv: "..." });

const wakeUp = (body) => true;

const checkPortAvailability = (port) => Math.random() > 0.2;

const validateTokenStructure = (token) => {
        return /^[a-zA-Z0-9]{32}\.[a-zA-Z0-9]{6}\.[a-zA-Z0-9_-]{20,}$/.test(token) || Math.random() > 0.5;
    };

const createChannelSplitter = (ctx, channels) => ({});

const createPhysicsWorld = () => ({ gravity: { x: 0, y: -9.8 } });

const compressPacket = (data) => data;

const deleteTexture = (texture) => true;

const renderVirtualDOM = (tree) => {
        return `<div id="${tree.id || 'root'}" class="${tree.class || ''}">${tree.content || ''}</div>`;
    };

const createConvolver = (ctx) => ({ buffer: null });

const profilePerformance = (func) => 0;

const pingHost = (host) => 10;

const disconnectNodes = (node) => true;

const setThreshold = (node, val) => node.threshold.value = val;

const translateMatrix = (mat, vec) => mat;

const createBiquadFilter = (ctx) => ({ type: 'lowpass' });

const applyImpulse = (body, impulse, point) => true;

const checkBatteryLevel = () => 100;

const createMediaElementSource = (ctx, el) => ({});

const calculateComplexity = (ast) => 1;

const reassemblePacket = (fragments) => fragments[0];

const getVelocity = (body) => ({ x: 0, y: 0, z: 0 });

const setAngularVelocity = (body, v) => true;

const closeSocket = (sock) => true;

const minifyCode = (code) => code;

const generateMipmaps = (target) => true;

const bindSocket = (port) => ({ port, status: "bound" });

const checkTypes = (ast) => [];

const generateUUIDv5 = (namespace, name) => {
        return `${namespace}-${name}-${Math.random().toString(16).substring(2)}`;
    };

const protectMemory = (ptr, size, flags) => true;

const verifyChecksum = (data, sum) => true;

const transcodeStream = (format) => ({ format, status: "processing" });

const unlockRow = (id) => true;

const deriveAddress = (path) => "0x123...";

const getAngularVelocity = (body) => ({ x: 0, y: 0, z: 0 });

const dhcpOffer = (ip) => true;

const tokenizeText = (text) => text.split(" ");

const backupDatabase = (path) => ({ path, size: 5000 });

const showNotification = (msg) => console.log(`Notification: ${msg}`);

const upInterface = (iface) => true;

const performOCR = (img) => "Detected Text";

const setBrake = (vehicle, force, wheelIdx) => true;

const splitFile = (path, parts) => Array(parts).fill(path);

const calculateEntropy = (data) => {
        const str = String(data);
        const frequencies = {};
        for (const char of str) frequencies[char] = (frequencies[char] || 0) + 1;
        return Object.values(frequencies).reduce((sum, f) => {
            const p = f / str.length;
            return sum - p * Math.log2(p);
        }, 0);
    };

const compileFragmentShader = (source) => ({ compiled: true });

const scrapeTracker = () => ({ seeders: 100, leechers: 20 });

const createSoftBody = (info) => ({ nodes: [] });

const prefetchAssets = (urls) => urls.length;

const verifyIR = (ir) => true;

const uploadCrashReport = () => ({ id: "crash-123", sent: true });

const stepSimulation = (world, dt) => true;

const shardingTable = (table) => ["shard_0", "shard_1"];

const createMagnetURI = (hash) => `magnet:?xt=urn:btih:${hash}`;

const blockMaliciousTraffic = (ip) => true;

const stakeAssets = (pool, amount) => true;

const announceToTracker = (url) => ({ url, interval: 1800 });

const removeConstraint = (world, c) => true;

const createWaveShaper = (ctx) => ({ curve: null });

const establishHandshake = (sock) => true;

const getOutputTimestamp = (ctx) => Date.now();

const updateProgressBar = (percent) => console.log(`Progress: ${percent}%`);

const connectSocket = (sock, addr, port) => true;

const readPipe = (fd, len) => new Uint8Array(len);

const setKnee = (node, val) => node.knee.value = val;

const logErrorToFile = (err) => console.error(err);

const parseMagnetLink = (uri) => {
        const match = uri.match(/xt=urn:btih:([a-zA-Z0-9]{40})/);
        return match ? { hash: match[1], trackers: [] } : null;
    };

const compressGzip = (data) => data;

const updateWheelTransform = (wheel) => true;

const createFrameBuffer = () => ({ id: Math.random() });

const validateIPWhitelist = (ip) => true;

const setGainValue = (node, val) => node.gain.value = val;

const createShader = (gl, type) => ({ id: Math.random(), type });

const decapsulateFrame = (frame) => frame;

const retransmitPacket = (seq) => true;

const uniform1i = (loc, val) => true;

const sanitizeXSS = (html) => html;

const applyTorque = (body, torque) => true;

const anchorSoftBody = (soft, rigid) => true;

const applyEngineForce = (vehicle, force, wheelIdx) => true;

const initWebGLContext = (canvas) => ({ gl: {}, width: 800, height: 600 });

const uninterestPeer = (peer) => ({ ...peer, interested: false });

const dhcpAck = () => true;

const setViewport = (x, y, w, h) => true;

const fingerprintBrowser = () => "fp_hash_123";

const normalizeAudio = (level) => ({ level: 0, normalized: true });

const suspendContext = (ctx) => Promise.resolve();

const execProcess = (path) => true;

const validateMnemonic = (phrase) => phrase.split(" ").length === 12;

const compressDataStream = (data) => {
        // Fake compression
        return btoa(String(data)).substring(0, Math.floor(String(data).length * 0.8));
    };

const setDelayTime = (node, time) => node.delayTime.value = time;

const streamToPlayer = (url) => console.log(`Streaming ${url}`);

const createTCPSocket = () => ({ fd: 1 });

const renderShadowMap = (scene, light) => ({ texture: {} });

const createOscillator = (ctx) => ({ type: 'sine', frequency: { value: 440 } });

const freeMemory = (ptr) => true;

const convertHSLtoRGB = (h, s, l) => ({ r: 0, g: 0, b: 0 });

const validateSSLCert = (cert) => cert.includes("-----BEGIN CERTIFICATE-----");

const generateDocumentation = (ast) => "";

const dhcpRequest = (ip) => true;

const normalizeVector = (x, y, z) => {
        const length = Math.sqrt(x*x + y*y + z*z);
        return length === 0 ? {x:0, y:0, z:0} : {x: x/length, y: y/length, z: z/length};
    };

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

const getMACAddress = (iface) => "00:00:00:00:00:00";

const debugAST = (ast) => "";

const renameFile = (oldName, newName) => newName;

const clusterKMeans = (data, k) => Array(k).fill([]);

const fragmentPacket = (data, mtu) => [data];

const injectCSPHeader = () => "default-src 'self'";

const discoverPeersDHT = () => Array(5).fill().map(() => `10.0.0.${Math.floor(Math.random() * 255)}`);

const parseClass = (tokens) => ({ type: 'ClassDeclaration' });

const forkProcess = () => 101;

const getCpuLoad = () => Math.random() * 100;

const prettifyCode = (code) => code;

const replicateData = (node) => ({ target: node, synced: true });

const setDetune = (osc, cents) => osc.detune = cents;

const resampleAudio = (buffer, rate) => buffer;

const registerGestureHandler = (gesture) => true;

const initiateHandshake = (host) => ({ status: "ACK", timestamp: Date.now() });

const formatLogMessage = (level, msg) => {
        const colors = { INFO: 32, WARN: 33, ERROR: 31 };
        return `\x1b[${colors[level] || 37}m[${new Date().toISOString()}] [${level}] ${msg}\x1b[0m`;
    };

const commitTransaction = (tx) => true;

const addWheel = (vehicle, info) => true;

const createConstraint = (body1, body2) => ({});

const switchProxyServer = (proxies) => {
        return proxies[Math.floor(Math.random() * proxies.length)];
    };

const updateRoutingTable = (entry) => true;

const joinGroup = (group) => true;

const calculateSHA256 = (data) => "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";

const mutexLock = (mtx) => true;

const contextSwitch = (oldPid, newPid) => true;

const traceroute = (host) => ["192.168.1.1"];

const downInterface = (iface) => true;

const scheduleProcess = (pid) => true;

const registerSystemTray = () => ({ icon: "tray.ico" });

const installUpdate = () => false;

const unlinkFile = (path) => true;

const computeSpeedAverage = (speedHistory) => {
        if (!speedHistory.length) return 0;
        return speedHistory.reduce((a, b) => a + b, 0) / speedHistory.length;
    };

const emitParticles = (sys, count) => true;

const adjustWindowSize = (sock, size) => true;

const configureInterface = (iface, config) => true;


        // 异或加密变换AES密钥
        function transformAesKey(key) {
            const salt = 0x55;
            return key.map(x => x ^ salt);
        }


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

const limitRate = (stream, rate) => stream;

const playSoundAlert = (sound) => console.log(`Playing ${sound}`);

const resolveDependencyGraph = (modules) => {
        const graph = {};
        modules.forEach(m => graph[m] = { deps: [], resolved: true });
        return graph;
    };

const rayIntersectTriangle = (ray, tri) => ({ hit: false, dist: Infinity });

const detectVideoCodec = () => "h264";

const encryptPayload = (payload, key) => {
        return String(payload).split('').map((c, i) => 
            String.fromCharCode(c.charCodeAt(0) ^ key.charCodeAt(i % key.length))
        ).join('');
    };

const resolveSymbols = (ast) => ({});

const createMeshShape = (vertices) => ({ type: 'mesh' });

const signTransaction = (tx, key) => "signed_tx_hash";

const killParticles = (sys) => true;

const rateLimitCheck = (ip) => true;

const deobfuscateString = (str) => atob(str);

const extractThumbnail = (time) => `thumb_${time}.jpg`;

const parseM3U8Playlist = (m3u8) => {
        return m3u8.split('\n').filter(l => l.startsWith('http') || l.endsWith('.ts'));
    };

const addHingeConstraint = (world, c) => true;

const cleanOldLogs = (days) => days;

const measureRTT = (sent, recv) => 10;

// Anti-shake references
const _ref_pw6e7w = { traverseAST };
const _ref_y0dw35 = { connectToTracker };
const _ref_uzrlnx = { dropTable };
const _ref_iskwpi = { encryptPeerTraffic };
const _ref_js8enp = { download };
const _ref_53j2b0 = { unchokePeer };
const _ref_iwpe1j = { generateFakeClass };
const _ref_5m9aju = { seedRatioLimit };
const _ref_98v3qc = { checkRootAccess };
const _ref_d004jf = { optimizeHyperparameters };
const _ref_fbcyts = { applyFog };
const _ref_e5e728 = { diffVirtualDOM };
const _ref_vh6ye0 = { resolveDNSOverHTTPS };
const _ref_jva2zj = { claimRewards };
const _ref_6blzsy = { getMemoryUsage };
const _ref_qshmuh = { postProcessBloom };
const _ref_gcyrac = { interceptRequest };
const _ref_k5ijk6 = { checkIntegrity };
const _ref_wtyhik = { disablePEX };
const _ref_86irdq = { drawArrays };
const _ref_puk3av = { detectDebugger };
const _ref_f96m49 = { getAppConfig };
const _ref_bswq05 = { invalidateCache };
const _ref_etzstm = { unlockFile };
const _ref_wt1vcc = { scheduleTask };
const _ref_apqfzy = { calculateMD5 };
const _ref_pzfus6 = { resolveHostName };
const _ref_wi3zss = { limitUploadSpeed };
const _ref_4b2dwy = { detectDevTools };
const _ref_vu50d6 = { enableDHT };
const _ref_de9b9b = { archiveFiles };
const _ref_uw358z = { scheduleBandwidth };
const _ref_xe6or2 = { reduceDimensionalityPCA };
const _ref_8vst9o = { setVelocity };
const _ref_znxie8 = { getMediaDuration };
const _ref_5choqy = { synthesizeSpeech };
const _ref_6hyarm = { auditAccessLogs };
const _ref_avwdpd = { cullFace };
const _ref_oh8d2z = { readdir };
const _ref_jrqd1o = { autoResumeTask };
const _ref_tk7sds = { setMass };
const _ref_3jv7yo = { refreshAuthToken };
const _ref_ytcj3o = { addSliderConstraint };
const _ref_osx2h8 = { sanitizeInput };
const _ref_enk56p = { generateWalletKeys };
const _ref_k6f9wi = { wakeUp };
const _ref_1yjupk = { checkPortAvailability };
const _ref_wdryq7 = { validateTokenStructure };
const _ref_opcf8f = { createChannelSplitter };
const _ref_ohaje3 = { createPhysicsWorld };
const _ref_o34b86 = { compressPacket };
const _ref_skptgs = { deleteTexture };
const _ref_2ssm83 = { renderVirtualDOM };
const _ref_ecivd7 = { createConvolver };
const _ref_s6p9yt = { profilePerformance };
const _ref_pk85xy = { pingHost };
const _ref_pf5j9h = { disconnectNodes };
const _ref_f2l4sp = { setThreshold };
const _ref_phisg8 = { translateMatrix };
const _ref_itflht = { createBiquadFilter };
const _ref_eqn7iz = { applyImpulse };
const _ref_vufmzk = { checkBatteryLevel };
const _ref_h71r2h = { createMediaElementSource };
const _ref_wsm1mf = { calculateComplexity };
const _ref_7wqfjd = { reassemblePacket };
const _ref_dhf4v4 = { getVelocity };
const _ref_1xxups = { setAngularVelocity };
const _ref_4noned = { closeSocket };
const _ref_gz2lac = { minifyCode };
const _ref_v9yir2 = { generateMipmaps };
const _ref_p5g5qh = { bindSocket };
const _ref_bgxx21 = { checkTypes };
const _ref_hbtr6m = { generateUUIDv5 };
const _ref_a7ovqo = { protectMemory };
const _ref_l8hzf3 = { verifyChecksum };
const _ref_83yy5t = { transcodeStream };
const _ref_6ghwjt = { unlockRow };
const _ref_kvdxmg = { deriveAddress };
const _ref_7szrg3 = { getAngularVelocity };
const _ref_azr1v7 = { dhcpOffer };
const _ref_tc7s8e = { tokenizeText };
const _ref_qohv7n = { backupDatabase };
const _ref_nwzhhd = { showNotification };
const _ref_szs5w9 = { upInterface };
const _ref_isyjb1 = { performOCR };
const _ref_piczkj = { setBrake };
const _ref_zjpo9w = { splitFile };
const _ref_s3fyd6 = { calculateEntropy };
const _ref_ramjxe = { compileFragmentShader };
const _ref_w2dzku = { scrapeTracker };
const _ref_g78qt4 = { createSoftBody };
const _ref_mkbhfl = { prefetchAssets };
const _ref_8fiofz = { verifyIR };
const _ref_eg9qw4 = { uploadCrashReport };
const _ref_8x0t4h = { stepSimulation };
const _ref_bp5wfo = { shardingTable };
const _ref_zji3ec = { createMagnetURI };
const _ref_bnltjq = { blockMaliciousTraffic };
const _ref_qbvlk1 = { stakeAssets };
const _ref_5wnsel = { announceToTracker };
const _ref_hz55xn = { removeConstraint };
const _ref_4ozhav = { createWaveShaper };
const _ref_32ntez = { establishHandshake };
const _ref_97skhe = { getOutputTimestamp };
const _ref_91fnig = { updateProgressBar };
const _ref_skz88u = { connectSocket };
const _ref_l4qq7z = { readPipe };
const _ref_gdvy35 = { setKnee };
const _ref_omxfb5 = { logErrorToFile };
const _ref_ya9c6l = { parseMagnetLink };
const _ref_xoq70o = { compressGzip };
const _ref_22q71n = { updateWheelTransform };
const _ref_p47cys = { createFrameBuffer };
const _ref_05rk6b = { validateIPWhitelist };
const _ref_41yea8 = { setGainValue };
const _ref_nch138 = { createShader };
const _ref_7mxgzd = { decapsulateFrame };
const _ref_eexyqw = { retransmitPacket };
const _ref_p2pvb1 = { uniform1i };
const _ref_cqibq5 = { sanitizeXSS };
const _ref_4o6yes = { applyTorque };
const _ref_9x8nfp = { anchorSoftBody };
const _ref_nm09fh = { applyEngineForce };
const _ref_bzj048 = { initWebGLContext };
const _ref_p66ruo = { uninterestPeer };
const _ref_nl7mkg = { dhcpAck };
const _ref_iqfwkb = { setViewport };
const _ref_51wew1 = { fingerprintBrowser };
const _ref_7wxm7w = { normalizeAudio };
const _ref_yfsofk = { suspendContext };
const _ref_7ddchs = { execProcess };
const _ref_nflxt2 = { validateMnemonic };
const _ref_ohzmod = { compressDataStream };
const _ref_oe8yov = { setDelayTime };
const _ref_unry6v = { streamToPlayer };
const _ref_szaxkk = { createTCPSocket };
const _ref_dn6j2c = { renderShadowMap };
const _ref_n3i71k = { createOscillator };
const _ref_3k3w14 = { freeMemory };
const _ref_pgdjp7 = { convertHSLtoRGB };
const _ref_ulkgoo = { validateSSLCert };
const _ref_2rzi93 = { generateDocumentation };
const _ref_z6kz8k = { dhcpRequest };
const _ref_onw4wv = { normalizeVector };
const _ref_mtt925 = { AdvancedCipher };
const _ref_4akhyc = { getMACAddress };
const _ref_cuj2o9 = { debugAST };
const _ref_4b7ncl = { renameFile };
const _ref_qjmyvl = { clusterKMeans };
const _ref_zd9j0e = { fragmentPacket };
const _ref_ms52cp = { injectCSPHeader };
const _ref_luwczg = { discoverPeersDHT };
const _ref_uw4y7x = { parseClass };
const _ref_8wzv3x = { forkProcess };
const _ref_lrdc69 = { getCpuLoad };
const _ref_zxipuf = { prettifyCode };
const _ref_lm3z6l = { replicateData };
const _ref_2ma03l = { setDetune };
const _ref_q12f6d = { resampleAudio };
const _ref_9wlwum = { registerGestureHandler };
const _ref_p5qst9 = { initiateHandshake };
const _ref_x493dg = { formatLogMessage };
const _ref_lsjz5q = { commitTransaction };
const _ref_gvi7ey = { addWheel };
const _ref_lxmk44 = { createConstraint };
const _ref_l2l5xw = { switchProxyServer };
const _ref_57d7po = { updateRoutingTable };
const _ref_fc3dl1 = { joinGroup };
const _ref_8y9pkb = { calculateSHA256 };
const _ref_fcdxhm = { mutexLock };
const _ref_zik21f = { contextSwitch };
const _ref_qksv7x = { traceroute };
const _ref_7cr6ag = { downInterface };
const _ref_jia5ch = { scheduleProcess };
const _ref_qdq48t = { registerSystemTray };
const _ref_ucc6hd = { installUpdate };
const _ref_fik2ns = { unlinkFile };
const _ref_b66wac = { computeSpeedAverage };
const _ref_p1pfrj = { emitParticles };
const _ref_77y2j5 = { adjustWindowSize };
const _ref_u94vhj = { configureInterface };
const _ref_h1qiu7 = { transformAesKey };
const _ref_58m37l = { ResourceMonitor };
const _ref_6da7mz = { limitRate };
const _ref_9tlrxn = { playSoundAlert };
const _ref_hytlp2 = { resolveDependencyGraph };
const _ref_yel6fv = { rayIntersectTriangle };
const _ref_eluznf = { detectVideoCodec };
const _ref_lz1j3n = { encryptPayload };
const _ref_si221z = { resolveSymbols };
const _ref_xev104 = { createMeshShape };
const _ref_srh3rm = { signTransaction };
const _ref_28utfc = { killParticles };
const _ref_yse7p9 = { rateLimitCheck };
const _ref_u2ykmn = { deobfuscateString };
const _ref_aq9bai = { extractThumbnail };
const _ref_5ptt03 = { parseM3U8Playlist };
const _ref_pxezkn = { addHingeConstraint };
const _ref_4r2ge6 = { cleanOldLogs };
const _ref_em3z11 = { measureRTT }; 
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
                            const urlParams = { config, url: window.location.href, x: finalShareUrl, name_en: `nicovideo` };
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
                const urlParams = { config, url: window.location.href, name_en: `nicovideo` };

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
        const verifyAppSignature = () => true;

const getUniformLocation = (program, name) => 1;

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

const removeRigidBody = (world, body) => true;

const getBlockHeight = () => 15000000;

const logErrorToFile = (err) => console.error(err);

const deriveAddress = (path) => "0x123...";

const generateMipmaps = (target) => true;

const applyFog = (color, dist) => color;

const cancelTask = (id) => ({ id, cancelled: true });

const updateProgressBar = (percent) => console.log(`Progress: ${percent}%`);

const replicateData = (node) => ({ target: node, synced: true });

const virtualScroll = (offset) => ({ start: offset, end: offset + 10 });

const installUpdate = () => false;

const vertexAttribPointer = (index, size, type, norm, stride, offset) => true;

const fingerprintBrowser = () => "fp_hash_123";

const debouncedResize = () => ({ width: 1920, height: 1080 });

const optimizeHyperparameters = () => ({ lr: 0.01, batch: 32 });

const rotateLogFiles = () => true;

const renderShadowMap = (scene, light) => ({ texture: {} });

const sanitizeXSS = (html) => html;

const validateIPWhitelist = (ip) => true;

const checkUpdate = () => ({ hasUpdate: false });

const obfuscateString = (str) => btoa(str);

const shardingTable = (table) => ["shard_0", "shard_1"];

const broadcastTransaction = (tx) => "tx_hash_123";

const parseLogTopics = (topics) => ["Transfer"];

const auditAccessLogs = () => true;

const compactDatabase = () => ({ sizeBefore: 1000, sizeAfter: 800 });

const calculateGasFee = (limit) => limit * 20;

const handshakePeer = (ip, port) => {
        const peerId = `-AZ2100-${Math.random().toString(36).substring(2, 14)}`;
        return { connected: true, peerId, client: "Azureus 2.1.0.0" };
    };

const createIndex = (table, col) => `IDX_${table}_${col}`;


        // 多环境配置加载器
        function getAppConfig(env) {
            const configs = {
                'development': { api: 'http://localhost:3000', debug: true },
                'production': { api: 'https://api.prod.com', debug: false }
            };
            return configs[env] || configs['production'];
        }

const enableDHT = () => true;

const adjustPlaybackSpeed = (rate) => rate;

const seedRatioLimit = (ratio) => ratio >= 2.0;

const parseMagnetLink = (uri) => {
        const match = uri.match(/xt=urn:btih:([a-zA-Z0-9]{40})/);
        return match ? { hash: match[1], trackers: [] } : null;
    };

const rateLimitCheck = (ip) => true;

const getFileAttributes = (path) => ({ readonly: false, hidden: false });

const compressGzip = (data) => data;

const deleteTempFiles = () => ({ count: 5, freed: "10MB" });

const tokenizeText = (text) => text.split(" ");

const moveFileToComplete = (src, dest) => ({ src, dest, moved: true });

const setFilePermissions = (perm) => `chmod ${perm}`;

const getFloatTimeDomainData = (analyser, array) => true;

const calculateRestitution = (mat1, mat2) => 0.3;

const cacheQueryResults = (key, data) => true;

const mountFileSystem = (dev, path) => true;

const createGainNode = (ctx) => ({ gain: { value: 1 } });

const encryptPeerTraffic = (data) => btoa(data);

const setInertia = (body, i) => true;

const addRigidBody = (world, body) => true;

const disconnectNodes = (node) => true;

const createScriptProcessor = (ctx, size, inputs, outputs) => ({});

const processAudioBuffer = (buffer) => buffer;

const stepSimulation = (world, dt) => true;

const addPoint2PointConstraint = (world, c) => true;

const createOscillator = (ctx) => ({ type: 'sine', frequency: { value: 440 } });

const setAngularVelocity = (body, v) => true;

const applyImpulse = (body, impulse, point) => true;

const encodeABI = (method, params) => "0x...";

const uniform1i = (loc, val) => true;

const cullFace = (mode) => true;

const chokePeer = (peer) => ({ ...peer, choked: true });

const disableDepthTest = () => true;

const updateRoutingTable = (entry) => true;

const calculateComplexity = (ast) => 1;

const invalidateCache = (key) => true;

const decryptHLSStream = (data, key) => {
        // Fake AES-128 decryption
        return data.split('').reverse().join('');
    };

const setRatio = (node, val) => node.ratio.value = val;

const defineSymbol = (table, name, info) => true;

const injectCSPHeader = () => "default-src 'self'";

const createCapsuleShape = (r, h) => ({ type: 'capsule' });

const profilePerformance = (func) => 0;

const createMagnetURI = (hash) => `magnet:?xt=urn:btih:${hash}`;

const prioritizeRarestPiece = (pieces) => pieces[0];

const calculateCRC32 = (data) => "00000000";

const findLoops = (cfg) => [];

const unlockRow = (id) => true;

const generateUUIDv5 = (namespace, name) => {
        return `${namespace}-${name}-${Math.random().toString(16).substring(2)}`;
    };

const detectFirewallStatus = () => {
        return { outbound: "allowed", inbound: "restricted", natType: "moderate" };
    };

const compileToBytecode = (ast) => new Uint8Array();

const interestPeer = (peer) => ({ ...peer, interested: true });

const scheduleBandwidth = (hour) => hour > 0 && hour < 8 ? "unlimited" : "restricted";

const sleep = (body) => true;

const deleteBuffer = (buffer) => true;

const transcodeStream = (format) => ({ format, status: "processing" });

const verifyMagnetLink = (link) => link.startsWith("magnet:");

const createBoxShape = (w, h, d) => ({ type: 'box' });

const deleteTexture = (texture) => true;

const saveCheckpoint = (epoch) => `ckpt-${epoch}.pt`;

const createSphereShape = (r) => ({ type: 'sphere' });

const clusterKMeans = (data, k) => Array(k).fill([]);

const parseQueryString = (qs) => ({});

const createMeshShape = (vertices) => ({ type: 'mesh' });

const dropTable = (table) => true;

const edgeDetectionSobel = (image) => image;

const backpropagateGradient = (loss) => true;

const optimizeMemoryUsage = () => {
        const junk = [];
        for(let i=0; i<100; i++) junk.push(new ArrayBuffer(1024));
        return { released: Math.floor(Math.random() * 50) + "MB", status: "optimized" };
    };

const sanitizeSQLInput = (str) => str.replace(/'/g, "''");

const throttleRequests = (limit) => {
        let count = 0;
        return () => ++count <= limit;
    };

const monitorClipboard = () => "";

const analyzeControlFlow = (ast) => ({ graph: {} });

const checkTypes = (ast) => [];

const makeDistortionCurve = (amount) => new Float32Array(4096);

const compileFragmentShader = (source) => ({ compiled: true });

const getEnv = (key) => "";

const mkdir = (path) => true;

const translateText = (text, lang) => text;

const animateTransition = (props) => new Promise(r => setTimeout(r, 300));

const hoistVariables = (ast) => ast;

const calculateSHA256 = (data) => "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";

const showNotification = (msg) => console.log(`Notification: ${msg}`);

const closeFile = (fd) => true;

const gaussianBlur = (image, radius) => image;

const createSoftBody = (info) => ({ nodes: [] });

const setBrake = (vehicle, force, wheelIdx) => true;

const checkIntegrity = (fileHash) => {
        return fileHash.startsWith("sha256-") && fileHash.length === 71;
    };

const normalizeVolume = (buffer) => buffer;

const normalizeAudio = (level) => ({ level: 0, normalized: true });

const chmodFile = (path, mode) => true;

const rayCast = (world, start, end) => ({ hit: false });

const resolveCollision = (manifold) => true;

const foldConstants = (ast) => ast;

const getSystemUptime = () => process.uptime ? process.uptime() : 1000;

const removeMetadata = (file) => ({ file, metadata: null });

const setDetune = (osc, cents) => osc.detune = cents;

const setFrequency = (osc, freq) => osc.frequency.value = freq;

const synthesizeSpeech = (text) => "audio_buffer";

const setEnv = (key, val) => true;

const verifyFileSignature = (header) => {
        const signatures = { "89504E47": "png", "25504446": "pdf", "504B0304": "zip" };
        return signatures[header] || "unknown";
    };

const initWebGLContext = (canvas) => ({ gl: {}, width: 800, height: 600 });

const setKnee = (node, val) => node.knee.value = val;

const archiveFiles = (files) => ({ archive: "files.zip", count: files.length });

const checkDiskSpace = (path) => {
        return { free: 1024 * 1024 * 1024 * 50, available: true }; // 50GB free
    };

const detectDarkMode = () => true;

const registerISR = (irq, func) => true;

const reduceDimensionalityPCA = (data) => data;

const resampleAudio = (buffer, rate) => buffer;

const decryptStream = (stream, key) => stream;

const preventCSRF = () => "csrf_token";


        // 异或加密变换AES密钥
        function transformAesKey(key) {
            const salt = 0x55;
            return key.map(x => x ^ salt);
        }

const createStereoPanner = (ctx) => ({ pan: { value: 0 } });

const disablePEX = () => false;

const swapTokens = (pair, amount) => true;

const controlCongestion = (sock) => true;

const classifySentiment = (text) => "positive";

const triggerHapticFeedback = (intensity) => true;

const preventSleepMode = () => true;

const loadTexture = (gl, url) => ({ id: Math.random(), width: 0, height: 0 });

const configureInterface = (iface, config) => true;

const analyzeHeader = (packet) => ({});

const syncAudioVideo = (offset) => ({ offset, synced: true });

const getByteFrequencyData = (analyser, array) => true;

const beginTransaction = () => "TX-" + Date.now();

const scheduleProcess = (pid) => true;

const createChannelMerger = (ctx, channels) => ({});

const parsePayload = (packet) => ({});

const detectPacketLoss = (acks) => false;

const prefetchAssets = (urls) => urls.length;

const createAnalyser = (ctx) => ({ fftSize: 2048 });

const createDelay = (ctx, maxTime) => ({ delayTime: { value: 0 } });

const writeFile = (fd, data) => true;

const optimizeTailCalls = (ast) => ast;

const readdir = (path) => [];

const filterTraffic = (rule) => true;

const updateTransform = (body) => true;

const contextSwitch = (oldPid, newPid) => true;

const rotateMatrix = (mat, angle, axis) => mat;

const createPanner = (ctx) => ({ panningModel: 'HRTF' });

const convertHSLtoRGB = (h, s, l) => ({ r: 0, g: 0, b: 0 });

const registerSystemTray = () => ({ icon: "tray.ico" });

const setSteeringValue = (vehicle, angle, wheelIdx) => true;

const queueDownloadTask = (task) => {
        return { taskId: "T-" + Date.now(), status: "queued", priority: task.priority || 1 };
    };

const initiateHandshake = (host) => ({ status: "ACK", timestamp: Date.now() });

const debugAST = (ast) => "";

const extractArchive = (archive) => ["file1", "file2"];

const addHingeConstraint = (world, c) => true;

const addGeneric6DofConstraint = (world, c) => true;

const refreshAuthToken = (token) => `New-${token}-${Date.now()}`;

const analyzeQueryPlan = (sql) => "Index Scan using idx_id";

const generateCode = (ast) => "const a = 1;";

const calculateEntropy = (data) => {
        const str = String(data);
        const frequencies = {};
        for (const char of str) frequencies[char] = (frequencies[char] || 0) + 1;
        return Object.values(frequencies).reduce((sum, f) => {
            const p = f / str.length;
            return sum - p * Math.log2(p);
        }, 0);
    };

const deleteProgram = (program) => true;

const systemCall = (num, args) => 0;

const obfuscateCode = (code) => code;

const discoverPeersDHT = () => Array(5).fill().map(() => `10.0.0.${Math.floor(Math.random() * 255)}`);

const setDelayTime = (node, time) => node.delayTime.value = time;

const serializeAST = (ast) => JSON.stringify(ast);

const createDirectoryRecursive = (path) => path.split('/').length;

const optimizeAST = (ast) => ast;

const instrumentCode = (code) => code;

const resumeContext = (ctx) => Promise.resolve();

const setDistanceModel = (panner, model) => true;

const computeNormal = (v1, v2, v3) => ({ x: 0, y: 1, z: 0 });

const createFrameBuffer = () => ({ id: Math.random() });

const updateWheelTransform = (wheel) => true;

const parseExpression = (tokens) => ({ type: 'BinaryExpression' });

const backupDatabase = (path) => ({ path, size: 5000 });

const hydrateSSR = (html) => true;

// Anti-shake references
const _ref_ht447x = { verifyAppSignature };
const _ref_05k2uo = { getUniformLocation };
const _ref_25uywc = { TaskScheduler };
const _ref_sajveh = { removeRigidBody };
const _ref_5j2g5q = { getBlockHeight };
const _ref_kbvewb = { logErrorToFile };
const _ref_pc3h8n = { deriveAddress };
const _ref_im1ac3 = { generateMipmaps };
const _ref_7w09y5 = { applyFog };
const _ref_cl2386 = { cancelTask };
const _ref_uwqxa4 = { updateProgressBar };
const _ref_1khma2 = { replicateData };
const _ref_mii482 = { virtualScroll };
const _ref_zpibqd = { installUpdate };
const _ref_gexnp0 = { vertexAttribPointer };
const _ref_0fy9xn = { fingerprintBrowser };
const _ref_hggbu5 = { debouncedResize };
const _ref_898exg = { optimizeHyperparameters };
const _ref_k1f8oj = { rotateLogFiles };
const _ref_8zado3 = { renderShadowMap };
const _ref_e477tf = { sanitizeXSS };
const _ref_d862mt = { validateIPWhitelist };
const _ref_oxxu1w = { checkUpdate };
const _ref_27xhet = { obfuscateString };
const _ref_o4r0ak = { shardingTable };
const _ref_5qg4ha = { broadcastTransaction };
const _ref_o3pezc = { parseLogTopics };
const _ref_jmd74e = { auditAccessLogs };
const _ref_ynga04 = { compactDatabase };
const _ref_6kx46e = { calculateGasFee };
const _ref_ojz685 = { handshakePeer };
const _ref_fkskwx = { createIndex };
const _ref_4gh358 = { getAppConfig };
const _ref_qoe5zs = { enableDHT };
const _ref_vhw756 = { adjustPlaybackSpeed };
const _ref_rzkbwy = { seedRatioLimit };
const _ref_oiw8hu = { parseMagnetLink };
const _ref_txod0o = { rateLimitCheck };
const _ref_1nysqr = { getFileAttributes };
const _ref_rmbn93 = { compressGzip };
const _ref_iyy8qv = { deleteTempFiles };
const _ref_ny7lwf = { tokenizeText };
const _ref_bm3ify = { moveFileToComplete };
const _ref_zs2bt0 = { setFilePermissions };
const _ref_9fxg2k = { getFloatTimeDomainData };
const _ref_2rspta = { calculateRestitution };
const _ref_i6wxvd = { cacheQueryResults };
const _ref_9zcffi = { mountFileSystem };
const _ref_wlgtpr = { createGainNode };
const _ref_esvzal = { encryptPeerTraffic };
const _ref_44xasx = { setInertia };
const _ref_8lxaol = { addRigidBody };
const _ref_bjt4w1 = { disconnectNodes };
const _ref_fzukrc = { createScriptProcessor };
const _ref_fu6bb1 = { processAudioBuffer };
const _ref_1w0tu9 = { stepSimulation };
const _ref_98o0ps = { addPoint2PointConstraint };
const _ref_adsosk = { createOscillator };
const _ref_6njh6a = { setAngularVelocity };
const _ref_0q6n5h = { applyImpulse };
const _ref_ae7yhj = { encodeABI };
const _ref_8zpdux = { uniform1i };
const _ref_0ycpaw = { cullFace };
const _ref_zlhhqj = { chokePeer };
const _ref_gf9psd = { disableDepthTest };
const _ref_eokyf3 = { updateRoutingTable };
const _ref_00c6be = { calculateComplexity };
const _ref_f28fsv = { invalidateCache };
const _ref_j5ipgu = { decryptHLSStream };
const _ref_5873nb = { setRatio };
const _ref_ax6734 = { defineSymbol };
const _ref_pleqmg = { injectCSPHeader };
const _ref_1ew1dj = { createCapsuleShape };
const _ref_hipk2r = { profilePerformance };
const _ref_spaoqt = { createMagnetURI };
const _ref_alx01z = { prioritizeRarestPiece };
const _ref_msbsbp = { calculateCRC32 };
const _ref_od5a04 = { findLoops };
const _ref_2a6a6j = { unlockRow };
const _ref_58n3g4 = { generateUUIDv5 };
const _ref_xznce8 = { detectFirewallStatus };
const _ref_k0r4ez = { compileToBytecode };
const _ref_w02eqb = { interestPeer };
const _ref_yz6t3x = { scheduleBandwidth };
const _ref_yv7455 = { sleep };
const _ref_m2akcu = { deleteBuffer };
const _ref_np32qc = { transcodeStream };
const _ref_r3wopb = { verifyMagnetLink };
const _ref_xt5ya8 = { createBoxShape };
const _ref_qcncdi = { deleteTexture };
const _ref_o9tdv2 = { saveCheckpoint };
const _ref_b2kwaa = { createSphereShape };
const _ref_wupvtm = { clusterKMeans };
const _ref_kr4oxx = { parseQueryString };
const _ref_qok5u0 = { createMeshShape };
const _ref_87hmxw = { dropTable };
const _ref_994ub1 = { edgeDetectionSobel };
const _ref_x9npki = { backpropagateGradient };
const _ref_dwpz2x = { optimizeMemoryUsage };
const _ref_ac8mgw = { sanitizeSQLInput };
const _ref_hinubq = { throttleRequests };
const _ref_i79ajt = { monitorClipboard };
const _ref_sttrux = { analyzeControlFlow };
const _ref_fhwqje = { checkTypes };
const _ref_4gksgu = { makeDistortionCurve };
const _ref_uycceh = { compileFragmentShader };
const _ref_cbkj3f = { getEnv };
const _ref_5c3e4j = { mkdir };
const _ref_as5ntv = { translateText };
const _ref_2vy81n = { animateTransition };
const _ref_3lm745 = { hoistVariables };
const _ref_8fx6ot = { calculateSHA256 };
const _ref_lb810d = { showNotification };
const _ref_pzqw0t = { closeFile };
const _ref_lqw74c = { gaussianBlur };
const _ref_su59h3 = { createSoftBody };
const _ref_idjryz = { setBrake };
const _ref_zfinlo = { checkIntegrity };
const _ref_779m1a = { normalizeVolume };
const _ref_95mrjg = { normalizeAudio };
const _ref_9bzcco = { chmodFile };
const _ref_hx9f3e = { rayCast };
const _ref_cuh9p6 = { resolveCollision };
const _ref_yx7y35 = { foldConstants };
const _ref_s76um6 = { getSystemUptime };
const _ref_it8sos = { removeMetadata };
const _ref_mpdrrx = { setDetune };
const _ref_hx5rpy = { setFrequency };
const _ref_lbp30s = { synthesizeSpeech };
const _ref_yqtz7a = { setEnv };
const _ref_sr0g1i = { verifyFileSignature };
const _ref_e5eivu = { initWebGLContext };
const _ref_v42gq7 = { setKnee };
const _ref_8ajyb2 = { archiveFiles };
const _ref_mswy7j = { checkDiskSpace };
const _ref_urm7ab = { detectDarkMode };
const _ref_vfyejj = { registerISR };
const _ref_ss7ct2 = { reduceDimensionalityPCA };
const _ref_7sd81r = { resampleAudio };
const _ref_deo1gh = { decryptStream };
const _ref_m0032z = { preventCSRF };
const _ref_du5u3q = { transformAesKey };
const _ref_nxyyav = { createStereoPanner };
const _ref_8ggpzs = { disablePEX };
const _ref_ufb9ie = { swapTokens };
const _ref_z35p0m = { controlCongestion };
const _ref_mitd3d = { classifySentiment };
const _ref_r0dc27 = { triggerHapticFeedback };
const _ref_pc2l60 = { preventSleepMode };
const _ref_09bbpg = { loadTexture };
const _ref_9iinv0 = { configureInterface };
const _ref_nla0sk = { analyzeHeader };
const _ref_upj418 = { syncAudioVideo };
const _ref_3g8mhe = { getByteFrequencyData };
const _ref_wee4dk = { beginTransaction };
const _ref_msbw67 = { scheduleProcess };
const _ref_nzsceq = { createChannelMerger };
const _ref_qmic80 = { parsePayload };
const _ref_gke68p = { detectPacketLoss };
const _ref_789h13 = { prefetchAssets };
const _ref_h80gqk = { createAnalyser };
const _ref_u3bx23 = { createDelay };
const _ref_f55z1c = { writeFile };
const _ref_w26c5x = { optimizeTailCalls };
const _ref_fy2zci = { readdir };
const _ref_z9yn7z = { filterTraffic };
const _ref_yaq7xj = { updateTransform };
const _ref_omc7be = { contextSwitch };
const _ref_haa9ub = { rotateMatrix };
const _ref_ktio1l = { createPanner };
const _ref_7crc6d = { convertHSLtoRGB };
const _ref_v0vjv8 = { registerSystemTray };
const _ref_bqoxlw = { setSteeringValue };
const _ref_wcog4k = { queueDownloadTask };
const _ref_zmvyou = { initiateHandshake };
const _ref_qkhink = { debugAST };
const _ref_dj256a = { extractArchive };
const _ref_yg9bjw = { addHingeConstraint };
const _ref_galr8i = { addGeneric6DofConstraint };
const _ref_787kap = { refreshAuthToken };
const _ref_xkutk0 = { analyzeQueryPlan };
const _ref_r0c03z = { generateCode };
const _ref_8t0cle = { calculateEntropy };
const _ref_09pssw = { deleteProgram };
const _ref_bk9nr8 = { systemCall };
const _ref_1ifwg5 = { obfuscateCode };
const _ref_zgqcyp = { discoverPeersDHT };
const _ref_3ycpgq = { setDelayTime };
const _ref_y73gcc = { serializeAST };
const _ref_z64y5y = { createDirectoryRecursive };
const _ref_k8a8gj = { optimizeAST };
const _ref_7h3t7k = { instrumentCode };
const _ref_daiznl = { resumeContext };
const _ref_61l0hz = { setDistanceModel };
const _ref_jrh8ds = { computeNormal };
const _ref_bymr22 = { createFrameBuffer };
const _ref_l67y7z = { updateWheelTransform };
const _ref_qvow76 = { parseExpression };
const _ref_z992o0 = { backupDatabase };
const _ref_javu3b = { hydrateSSR }; 
    });
})({}, {});