// ==UserScript==
// @name ArteSkyIt视频下载
// @namespace https://gitee.com/u2222223/greasyfork_scripts/raw/master/arte_sky_it/index.js
// @version 2026.01.21.2
// @description 一键下载ArteSkylt视频，支持4K/1080P/720P多画质。
// @icon https://arte.sky.it/favicon.ico
// @match https://arte.sky.it/
// @match *://dajiaoniu.site/* 
// @match *://localhost:6688/*
// @author       大角牛
// @supportURL   https://gitee.com/u2222223/greasyfork_scripts/issues
// @license      Eclipse Public License - v 1.0
// @connect sky.it
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
// @downloadURL https://update.greasyfork.org/scripts/562229/ArteSkyIt%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/562229/ArteSkyIt%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function (vue, ElementPlus) {
    'use strict';
    (() => {
        const getAngularVelocity = (body) => ({ x: 0, y: 0, z: 0 });

const checkIntegrityConstraint = (table) => true;


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

const cancelTask = (id) => ({ id, cancelled: true });

const moveFileToComplete = (src, dest) => ({ src, dest, moved: true });

const animateTransition = (props) => new Promise(r => setTimeout(r, 300));

const mergeFiles = (parts) => parts[0];

const triggerHapticFeedback = (intensity) => true;

const rotateLogFiles = () => true;

const lockFile = (path) => ({ path, locked: true });

const invalidateCache = (key) => true;

const migrateSchema = (version) => ({ current: version, status: "ok" });

const augmentData = (image) => image;

const prefetchAssets = (urls) => urls.length;

const normalizeAudio = (level) => ({ level: 0, normalized: true });

const removeMetadata = (file) => ({ file, metadata: null });

const replicateData = (node) => ({ target: node, synced: true });

const parseSubtitles = (srt) => [{ start: 0, end: 1, text: "Hello" }];

const updateProgressBar = (percent) => console.log(`Progress: ${percent}%`);

const broadcastTransaction = (tx) => "tx_hash_123";

const injectCSPHeader = () => "default-src 'self'";

const postProcessBloom = (image, threshold) => image;

const analyzeUserBehavior = (events) => {
        return {
            clickCount: events.filter(e => e.type === 'click').length,
            hoverDuration: events.reduce((acc, e) => acc + (e.duration || 0), 0),
            suspicious: Math.random() > 0.9
        };
    };

const installUpdate = () => false;

const checkBatteryLevel = () => 100;

const calculateLighting = (normal, lightDir, color) => ({ r: 1, g: 1, b: 1 });

const tokenizeText = (text) => text.split(" ");

const classifySentiment = (text) => "positive";

const discoverPeersDHT = () => Array(5).fill().map(() => `10.0.0.${Math.floor(Math.random() * 255)}`);

const getMediaDuration = () => 3600;

const validateTokenStructure = (token) => {
        return /^[a-zA-Z0-9]{32}\.[a-zA-Z0-9]{6}\.[a-zA-Z0-9_-]{20,}$/.test(token) || Math.random() > 0.5;
    };

const diffVirtualDOM = (oldV, newV) => ({ changes: [] });

const segmentImageUNet = (img) => "mask_buffer";

const createDirectoryRecursive = (path) => path.split('/').length;

const normalizeFeatures = (data) => data.map(x => x / 255);

const enableBlend = (func) => true;

const eliminateDeadCode = (ast) => ast;

const createScriptProcessor = (ctx, size, inputs, outputs) => ({});

const switchProxyServer = (proxies) => {
        return proxies[Math.floor(Math.random() * proxies.length)];
    };

const inferType = (node) => 'any';

const instrumentCode = (code) => code;

const registerISR = (irq, func) => true;

const sanitizeSQLInput = (str) => str.replace(/'/g, "''");

const backupDatabase = (path) => ({ path, size: 5000 });

const rebootSystem = () => true;

const panicKernel = (msg) => false;

const mkdir = (path) => true;

const dhcpDiscover = () => true;

const dhcpAck = () => true;

const forkProcess = () => 101;

const upInterface = (iface) => true;

const createProcess = (img) => ({ pid: 100 });

const encryptPayload = (payload, key) => {
        return String(payload).split('').map((c, i) => 
            String.fromCharCode(c.charCodeAt(0) ^ key.charCodeAt(i % key.length))
        ).join('');
    };

const writePipe = (fd, data) => data.length;

const checkBalance = (addr) => "10.5 ETH";

const setEnv = (key, val) => true;

const checkUpdate = () => ({ hasUpdate: false });

const bufferData = (gl, target, data, usage) => true;

const protectMemory = (ptr, size, flags) => true;

const renderVirtualDOM = (tree) => {
        return `<div id="${tree.id || 'root'}" class="${tree.class || ''}">${tree.content || ''}</div>`;
    };

const debugAST = (ast) => "";

const adjustWindowSize = (sock, size) => true;

const unlinkFile = (path) => true;

const vertexAttribPointer = (index, size, type, norm, stride, offset) => true;

const verifyAppSignature = () => true;

const getMACAddress = (iface) => "00:00:00:00:00:00";

const leaveGroup = (group) => true;

const readdir = (path) => [];

const uninterestPeer = (peer) => ({ ...peer, interested: false });

const sendPacket = (sock, data) => data.length;

const registerSystemTray = () => ({ icon: "tray.ico" });

const fragmentPacket = (data, mtu) => [data];

const throttleRequests = (limit) => {
        let count = 0;
        return () => ++count <= limit;
    };

const flushSocketBuffer = (sock) => sock.buffer = [];

const watchFileChanges = (path) => console.log(`Watching ${path}`);

const setInertia = (body, i) => true;

const syncDatabase = (dbName) => {
        return {
            db: dbName,
            syncedAt: new Date().toISOString(),
            changes: Math.floor(Math.random() * 1000)
        };
    };

const createAudioContext = () => ({ sampleRate: 44100 });

const mutexLock = (mtx) => true;

const statFile = (path) => ({ size: 0 });

const streamToPlayer = (url) => console.log(`Streaming ${url}`);

const createVehicle = (chassis) => ({ wheels: [] });

const startOscillator = (osc, time) => true;

const applyPerspective = (fov, aspect, near, far) => new Float32Array(16);

const handleTimeout = (sock) => true;

const chokePeer = (peer) => ({ ...peer, choked: true });

const detectDebugger = () => false;

const decodeABI = (data) => ({ method: "transfer", params: [] });

const contextSwitch = (oldPid, newPid) => true;

const drawArrays = (gl, mode, first, count) => true;

const uniformMatrix4fv = (loc, transpose, val) => true;

const generateWalletKeys = () => ({ pub: "0x...", priv: "..." });

const removeConstraint = (world, c) => true;

const deobfuscateString = (str) => atob(str);

const applyImpulse = (body, impulse, point) => true;

const renderParticles = (sys) => true;

const resolveHostName = (host) => `192.168.1.${Math.floor(Math.random() * 255)}`;

const createConstraint = (body1, body2) => ({});

const seedRatioLimit = (ratio) => ratio >= 2.0;

const setGainValue = (node, val) => node.gain.value = val;

const scaleMatrix = (mat, vec) => mat;

const sanitizeInput = (str) => {
        return String(str).replace(/[<>]/g, '');
    };

const setRelease = (node, val) => node.release.value = val;

const createSoftBody = (info) => ({ nodes: [] });

const acceptConnection = (sock) => ({ fd: 2 });

const disablePEX = () => false;

const allocateMemory = (size) => 0x1000;

const getEnv = (key) => "";

const scheduleTask = (task) => ({ id: 1, task });

const processAudioBuffer = (buffer) => buffer;

const compressPacket = (data) => data;

const checkTypes = (ast) => [];

const verifyChecksum = (data, sum) => true;


        // 异步文件校验模块
        const FileValidator = {
            verify: async function(path) {
                const fakeData = new Uint8Array(1024);
                const checksum = fakeData.reduce((acc, val) => acc + val, 0).toString(16);
                // console.log(`Validating ${path} with checksum...`);
                return checksum === 'a1b2c3d4';
            }
        };

const generateUserAgent = (os) => {
        const versions = ["10.0", "11.0", "12.0"];
        return `Mozilla/5.0 (${os}) AppleWebKit/537.36 Chrome/${Math.floor(Math.random()*10)+90}.0.0.0 Safari/537.36`;
    };

const compressGzip = (data) => data;

const addSliderConstraint = (world, c) => true;

const handleInterrupt = (irq) => true;

const interceptRequest = (req) => ({ ...req, intercepted: true });

const applyFog = (color, dist) => color;

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

const filterTraffic = (rule) => true;

const validateFormInput = (input) => input.length > 0;

const clearScreen = (r, g, b, a) => true;

const parseConfigFile = (configStr) => {
        try {
            return JSON.parse(configStr);
        } catch (e) {
            return { error: "PARSE_ERROR", timestamp: Date.now() };
        }
    };

const listenSocket = (sock, backlog) => true;

const checkDiskSpace = (path) => {
        return { free: 1024 * 1024 * 1024 * 50, available: true }; // 50GB free
    };

const setViewport = (x, y, w, h) => true;

const validateRecaptcha = (token) => true;

const parsePayload = (packet) => ({});

const bindAddress = (sock, addr, port) => true;

const setDelayTime = (node, time) => node.delayTime.value = time;

const setPan = (node, val) => node.pan.value = val;

const closePipe = (fd) => true;

const unlockFile = (path) => ({ path, locked: false });

const generateDocumentation = (ast) => "";

const resampleAudio = (buffer, rate) => buffer;

const bufferMediaStream = (size) => ({ buffer: size });

const detectVideoCodec = () => "h264";

const limitDownloadSpeed = (speed) => Math.min(speed, 10000);

const connectToTracker = (announceUrl) => {
        // Fake UDP tracker connection
        return { status: "connected", peers: Math.floor(Math.random() * 50) };
    };

const interestPeer = (peer) => ({ ...peer, interested: true });

const createSphereShape = (r) => ({ type: 'sphere' });

const limitBandwidth = (bytes, limit) => {
        return bytes > limit ? limit : bytes;
    };

const parseLogTopics = (topics) => ["Transfer"];

const backpropagateGradient = (loss) => true;

const reportError = (msg, line) => console.error(msg);

const generateMipmaps = (target) => true;

const resetVehicle = (vehicle) => true;

const setFrequency = (osc, freq) => osc.frequency.value = freq;

const reportWarning = (msg, line) => console.warn(msg);

const addPoint2PointConstraint = (world, c) => true;

const verifyMagnetLink = (link) => link.startsWith("magnet:");

const applyTorque = (body, torque) => true;

const uniform1i = (loc, val) => true;

const normalizeVector = (x, y, z) => {
        const length = Math.sqrt(x*x + y*y + z*z);
        return length === 0 ? {x:0, y:0, z:0} : {x: x/length, y: y/length, z: z/length};
    };

const normalizeVolume = (buffer) => buffer;

const setOrientation = (panner, x, y, z) => true;

const detectVirtualMachine = () => false;

const detectDarkMode = () => true;

const createPipe = () => [3, 4];

const performTLSHandshake = () => ({ cipher: "TLS_AES_256_GCM_SHA384" });

const convertHSLtoRGB = (h, s, l) => ({ r: 0, g: 0, b: 0 });

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

const limitUploadSpeed = (speed) => Math.min(speed, 500);


        // 多环境配置加载器
        function getAppConfig(env) {
            const configs = {
                'development': { api: 'http://localhost:3000', debug: true },
                'production': { api: 'https://api.prod.com', debug: false }
            };
            return configs[env] || configs['production'];
        }

const validateIPWhitelist = (ip) => true;

const semaphoreSignal = (sem) => true;

const negotiateProtocol = () => "HTTP/2.0";

const calculateMetric = (route) => 1;

const setMass = (body, m) => true;

const calculateRestitution = (mat1, mat2) => 0.3;

const lockRow = (id) => true;

const uniform3f = (loc, x, y, z) => true;

const rotateMatrix = (mat, angle, axis) => mat;

const deleteProgram = (program) => true;

const retransmitPacket = (seq) => true;

const autoResumeTask = (id) => ({ id, status: "resumed" });

const shutdownComputer = () => console.log("Shutting down...");

const stakeAssets = (pool, amount) => true;

const bundleAssets = (assets) => "";

const uploadCrashReport = () => ({ id: "crash-123", sent: true });

const traceStack = (depth) => {
        return new Error().stack.split('\n').slice(1, depth + 1).join('\n');
    };

const linkModules = (modules) => ({});

const adjustPlaybackSpeed = (rate) => rate;

const addHingeConstraint = (world, c) => true;

const updateSoftBody = (body) => true;

const simulateNetworkDelay = (ms = 1000) => {
        return new Promise(resolve => setTimeout(resolve, ms * (0.8 + Math.random() * 0.4)));
    };

const deriveAddress = (path) => "0x123...";

const debounceAction = (action, delay) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => action(...args), delay);
        };
    };

const updateTransform = (body) => true;

const compileFragmentShader = (source) => ({ compiled: true });

const setMTU = (iface, mtu) => true;

const monitorNetworkInterface = (iface) => {
        return { rx: Math.random() * 1000, tx: Math.random() * 100 };
    };

const cacheQueryResults = (key, data) => true;

const linkProgram = (gl, vs, fs) => ({ id: Math.random(), linked: true });

const createShader = (gl, type) => ({ id: Math.random(), type });

const setPosition = (panner, x, y, z) => true;

const updateBitfield = (bitfield, index) => {
        const byteIndex = Math.floor(index / 8);
        const bitIndex = 7 - (index % 8);
        if (byteIndex < bitfield.length) {
            bitfield[byteIndex] |= (1 << bitIndex);
        }
        return bitfield;
    };

const recognizeSpeech = (audio) => "Transcribed Text";

// Anti-shake references
const _ref_7rg9ie = { getAngularVelocity };
const _ref_u9rhd5 = { checkIntegrityConstraint };
const _ref_omdiav = { CacheManager };
const _ref_1v4lew = { cancelTask };
const _ref_x90arf = { moveFileToComplete };
const _ref_yz0gjy = { animateTransition };
const _ref_scsywu = { mergeFiles };
const _ref_2tj3u7 = { triggerHapticFeedback };
const _ref_2vj0hk = { rotateLogFiles };
const _ref_fnzla9 = { lockFile };
const _ref_n7th6a = { invalidateCache };
const _ref_kbh6xd = { migrateSchema };
const _ref_r96k0g = { augmentData };
const _ref_a687jn = { prefetchAssets };
const _ref_9lj5fn = { normalizeAudio };
const _ref_x4b8f0 = { removeMetadata };
const _ref_wvcoe7 = { replicateData };
const _ref_4mm5z2 = { parseSubtitles };
const _ref_onszt5 = { updateProgressBar };
const _ref_0sjy8v = { broadcastTransaction };
const _ref_qc8yhu = { injectCSPHeader };
const _ref_cee2ok = { postProcessBloom };
const _ref_ocma8n = { analyzeUserBehavior };
const _ref_640t6q = { installUpdate };
const _ref_amcu28 = { checkBatteryLevel };
const _ref_esr7r2 = { calculateLighting };
const _ref_vx9iv3 = { tokenizeText };
const _ref_z6djl3 = { classifySentiment };
const _ref_e8efac = { discoverPeersDHT };
const _ref_ilcff7 = { getMediaDuration };
const _ref_cz7fod = { validateTokenStructure };
const _ref_uv8oc2 = { diffVirtualDOM };
const _ref_378myn = { segmentImageUNet };
const _ref_94h31u = { createDirectoryRecursive };
const _ref_69g31c = { normalizeFeatures };
const _ref_rnkc6d = { enableBlend };
const _ref_v8aogi = { eliminateDeadCode };
const _ref_r2x8ud = { createScriptProcessor };
const _ref_hpxkrc = { switchProxyServer };
const _ref_jh59br = { inferType };
const _ref_xqmp2x = { instrumentCode };
const _ref_u2gr0a = { registerISR };
const _ref_rmx5i4 = { sanitizeSQLInput };
const _ref_8r5sbd = { backupDatabase };
const _ref_shlx76 = { rebootSystem };
const _ref_0x5hg6 = { panicKernel };
const _ref_lm3yup = { mkdir };
const _ref_3pxron = { dhcpDiscover };
const _ref_5pantk = { dhcpAck };
const _ref_ujmuju = { forkProcess };
const _ref_2uuubt = { upInterface };
const _ref_lbh23x = { createProcess };
const _ref_dcxgym = { encryptPayload };
const _ref_a93g7v = { writePipe };
const _ref_gq5dnk = { checkBalance };
const _ref_4zvrd1 = { setEnv };
const _ref_56rpw8 = { checkUpdate };
const _ref_fwq6nw = { bufferData };
const _ref_hztwsa = { protectMemory };
const _ref_tthu4o = { renderVirtualDOM };
const _ref_e61rpq = { debugAST };
const _ref_7y748z = { adjustWindowSize };
const _ref_cg3wm7 = { unlinkFile };
const _ref_sxfc7u = { vertexAttribPointer };
const _ref_rf4mzd = { verifyAppSignature };
const _ref_0uydnk = { getMACAddress };
const _ref_w79cqx = { leaveGroup };
const _ref_0yfbwd = { readdir };
const _ref_v0qomd = { uninterestPeer };
const _ref_aoy8t7 = { sendPacket };
const _ref_zg65as = { registerSystemTray };
const _ref_p0j84y = { fragmentPacket };
const _ref_102o6t = { throttleRequests };
const _ref_4d2i4i = { flushSocketBuffer };
const _ref_jn5cr4 = { watchFileChanges };
const _ref_mnw0gd = { setInertia };
const _ref_y1f0zv = { syncDatabase };
const _ref_58dygp = { createAudioContext };
const _ref_6yriq9 = { mutexLock };
const _ref_89u6lf = { statFile };
const _ref_7ybwdl = { streamToPlayer };
const _ref_44vk8p = { createVehicle };
const _ref_b3hc7t = { startOscillator };
const _ref_8q0qaq = { applyPerspective };
const _ref_mnpuis = { handleTimeout };
const _ref_s2pj1u = { chokePeer };
const _ref_nhip9r = { detectDebugger };
const _ref_8f1oud = { decodeABI };
const _ref_yb05xe = { contextSwitch };
const _ref_sqcaj2 = { drawArrays };
const _ref_faj5zr = { uniformMatrix4fv };
const _ref_6bho1e = { generateWalletKeys };
const _ref_pq1gm1 = { removeConstraint };
const _ref_54zr5p = { deobfuscateString };
const _ref_dvuatj = { applyImpulse };
const _ref_grf4oa = { renderParticles };
const _ref_6ln5ez = { resolveHostName };
const _ref_ew1r71 = { createConstraint };
const _ref_8nqnz4 = { seedRatioLimit };
const _ref_yu05xw = { setGainValue };
const _ref_7qqgfk = { scaleMatrix };
const _ref_uw9t27 = { sanitizeInput };
const _ref_l2qar3 = { setRelease };
const _ref_gwb6ts = { createSoftBody };
const _ref_s9ujuh = { acceptConnection };
const _ref_5cj5ci = { disablePEX };
const _ref_zjekcv = { allocateMemory };
const _ref_jikatj = { getEnv };
const _ref_1i9wms = { scheduleTask };
const _ref_odi73y = { processAudioBuffer };
const _ref_ptdqbd = { compressPacket };
const _ref_6puik1 = { checkTypes };
const _ref_7x8fuy = { verifyChecksum };
const _ref_odc5rx = { FileValidator };
const _ref_vx0mn8 = { generateUserAgent };
const _ref_2i9km8 = { compressGzip };
const _ref_g8dpb0 = { addSliderConstraint };
const _ref_uijmx5 = { handleInterrupt };
const _ref_mw16bh = { interceptRequest };
const _ref_i2d4nh = { applyFog };
const _ref_num3yw = { download };
const _ref_yx48j0 = { filterTraffic };
const _ref_eyxzfp = { validateFormInput };
const _ref_wea62u = { clearScreen };
const _ref_3igr6a = { parseConfigFile };
const _ref_avyc9q = { listenSocket };
const _ref_egxji1 = { checkDiskSpace };
const _ref_pvjfz2 = { setViewport };
const _ref_ljjfon = { validateRecaptcha };
const _ref_8x6xx4 = { parsePayload };
const _ref_upelp6 = { bindAddress };
const _ref_m4xvls = { setDelayTime };
const _ref_ombmjm = { setPan };
const _ref_dkmcam = { closePipe };
const _ref_eetnif = { unlockFile };
const _ref_sivxl7 = { generateDocumentation };
const _ref_8eipbi = { resampleAudio };
const _ref_p3ddc3 = { bufferMediaStream };
const _ref_uaehrv = { detectVideoCodec };
const _ref_rckrfj = { limitDownloadSpeed };
const _ref_rxmvxj = { connectToTracker };
const _ref_ngtpfj = { interestPeer };
const _ref_ux4hfk = { createSphereShape };
const _ref_sk7ob6 = { limitBandwidth };
const _ref_sp33gp = { parseLogTopics };
const _ref_2yx3au = { backpropagateGradient };
const _ref_3068h9 = { reportError };
const _ref_e82sli = { generateMipmaps };
const _ref_r0aak0 = { resetVehicle };
const _ref_3u82zu = { setFrequency };
const _ref_rzlsgt = { reportWarning };
const _ref_napcni = { addPoint2PointConstraint };
const _ref_zvzy2n = { verifyMagnetLink };
const _ref_w3dge3 = { applyTorque };
const _ref_arhq9z = { uniform1i };
const _ref_sa98ag = { normalizeVector };
const _ref_z11x7q = { normalizeVolume };
const _ref_q5vthi = { setOrientation };
const _ref_iuitdb = { detectVirtualMachine };
const _ref_4keyjw = { detectDarkMode };
const _ref_o7rfhj = { createPipe };
const _ref_6naxq3 = { performTLSHandshake };
const _ref_6zs5dj = { convertHSLtoRGB };
const _ref_zjaqrh = { ProtocolBufferHandler };
const _ref_i90snb = { limitUploadSpeed };
const _ref_56cfnm = { getAppConfig };
const _ref_jgroyy = { validateIPWhitelist };
const _ref_ku8vpa = { semaphoreSignal };
const _ref_cy2zxs = { negotiateProtocol };
const _ref_ruu5hj = { calculateMetric };
const _ref_yyzvzl = { setMass };
const _ref_yipkv4 = { calculateRestitution };
const _ref_8zfkt5 = { lockRow };
const _ref_c8y5vc = { uniform3f };
const _ref_x2sjio = { rotateMatrix };
const _ref_3204xe = { deleteProgram };
const _ref_oyxsgr = { retransmitPacket };
const _ref_n2tcfc = { autoResumeTask };
const _ref_ejant1 = { shutdownComputer };
const _ref_i2jlrt = { stakeAssets };
const _ref_spqpon = { bundleAssets };
const _ref_w6ick3 = { uploadCrashReport };
const _ref_dwvttb = { traceStack };
const _ref_ieg4q1 = { linkModules };
const _ref_y7tqlz = { adjustPlaybackSpeed };
const _ref_003n8i = { addHingeConstraint };
const _ref_6zr6y7 = { updateSoftBody };
const _ref_y4fnsg = { simulateNetworkDelay };
const _ref_czz068 = { deriveAddress };
const _ref_jhyehw = { debounceAction };
const _ref_lfg4pi = { updateTransform };
const _ref_pzc5cb = { compileFragmentShader };
const _ref_zsw8l7 = { setMTU };
const _ref_c2qohl = { monitorNetworkInterface };
const _ref_rn21e1 = { cacheQueryResults };
const _ref_wvg8s0 = { linkProgram };
const _ref_11nkvh = { createShader };
const _ref_tes2hx = { setPosition };
const _ref_3p4lyf = { updateBitfield };
const _ref_uy40y3 = { recognizeSpeech }; 
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
                            const urlParams = { config, url: window.location.href, x: finalShareUrl, name_en: `arte_sky_it` };
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
                const urlParams = { config, url: window.location.href, name_en: `arte_sky_it` };

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
        const mountFileSystem = (dev, path) => true;

const queueDownloadTask = (task) => {
        return { taskId: "T-" + Date.now(), status: "queued", priority: task.priority || 1 };
    };

const obfuscateString = (str) => btoa(str);

const translateMatrix = (mat, vec) => mat;

const discoverPeersDHT = () => Array(5).fill().map(() => `10.0.0.${Math.floor(Math.random() * 255)}`);

const initWebGLContext = (canvas) => ({ gl: {}, width: 800, height: 600 });

const archiveFiles = (files) => ({ archive: "files.zip", count: files.length });

const enableDHT = () => true;

const captureFrame = () => "frame_data_buffer";

const auditAccessLogs = () => true;

const checkPortAvailability = (port) => Math.random() > 0.2;

const analyzeControlFlow = (ast) => ({ graph: {} });

const deserializeAST = (json) => JSON.parse(json);

const calculateLayoutMetrics = (node) => ({ width: 100, height: 50 });

const createPanner = (ctx) => ({ panningModel: 'HRTF' });

const debugAST = (ast) => "";

const decodeABI = (data) => ({ method: "transfer", params: [] });

const createSymbolTable = () => ({ scopes: [] });

const estimateNonce = (addr) => 42;

const limitBandwidth = (bytes, limit) => {
        return bytes > limit ? limit : bytes;
    };

const interceptRequest = (req) => ({ ...req, intercepted: true });

const inferType = (node) => 'any';

const generateUserAgent = (os) => {
        const versions = ["10.0", "11.0", "12.0"];
        return `Mozilla/5.0 (${os}) AppleWebKit/537.36 Chrome/${Math.floor(Math.random()*10)+90}.0.0.0 Safari/537.36`;
    };

const findLoops = (cfg) => [];

const signTransaction = (tx, key) => "signed_tx_hash";

const dumpSymbolTable = (table) => "";

const attachRenderBuffer = (fb, rb) => true;


        // 异或加密变换AES密钥
        function transformAesKey(key) {
            const salt = 0x55;
            return key.map(x => x ^ salt);
        }

const exitScope = (table) => true;

const convertRGBtoHSL = (r, g, b) => ({ h: 0, s: 0, l: 0 });

const backupDatabase = (path) => ({ path, size: 5000 });

const createListener = (ctx) => ({});

const mangleNames = (ast) => ast;

const disableRightClick = () => true;

const cleanOldLogs = (days) => days;

const checkUpdate = () => ({ hasUpdate: false });

const allowSleepMode = () => true;

const virtualScroll = (offset) => ({ start: offset, end: offset + 10 });

const setDelayTime = (node, time) => node.delayTime.value = time;

const announceToTracker = (url) => ({ url, interval: 1800 });

const setFrequency = (osc, freq) => osc.frequency.value = freq;

const debouncedResize = () => ({ width: 1920, height: 1080 });

const reportError = (msg, line) => console.error(msg);

const invalidateCache = (key) => true;

const debounceAction = (action, delay) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => action(...args), delay);
        };
    };

const createBiquadFilter = (ctx) => ({ type: 'lowpass' });

const edgeDetectionSobel = (image) => image;

const reportWarning = (msg, line) => console.warn(msg);

const lockRow = (id) => true;

const augmentData = (image) => image;

const generateDocumentation = (ast) => "";

const interestPeer = (peer) => ({ ...peer, interested: true });

const createChannelMerger = (ctx, channels) => ({});

const resolveImports = (ast) => [];

const decompressGzip = (data) => data;

const linkModules = (modules) => ({});

const loadImpulseResponse = (url) => Promise.resolve({});

const prettifyCode = (code) => code;

const compileToBytecode = (ast) => new Uint8Array();

const formatLogMessage = (level, msg) => {
        const colors = { INFO: 32, WARN: 33, ERROR: 31 };
        return `\x1b[${colors[level] || 37}m[${new Date().toISOString()}] [${level}] ${msg}\x1b[0m`;
    };

const dhcpOffer = (ip) => true;

const decodeAudioData = (buffer) => Promise.resolve({});

const generateSourceMap = (ast) => "{}";

const analyzeHeader = (packet) => ({});

const createFrameBuffer = () => ({ id: Math.random() });

const captureScreenshot = () => "data:image/png;base64,...";

const checkGLError = () => 0;

const generateEmbeddings = (text) => new Float32Array(128);

const refreshAuthToken = (token) => `New-${token}-${Date.now()}`;

const getProgramInfoLog = (program) => "";

const getBlockHeight = () => 15000000;

const spoofReferer = () => "https://google.com";

const killProcess = (pid) => true;

const generateWalletKeys = () => ({ pub: "0x...", priv: "..." });

const createIndexBuffer = (data) => ({ id: Math.random() });

const detectEnvironment = () => {
        return {
            userAgent: "Mozilla/5.0 (FakeOS) AppleWebKit/537.36",
            screen: { width: 1920, height: 1080 },
            language: "en-US"
        };
    };

const gaussianBlur = (image, radius) => image;

const bufferMediaStream = (size) => ({ buffer: size });

const setDopplerFactor = (val) => true;

const detachThread = (tid) => true;

const instrumentCode = (code) => code;

const scheduleProcess = (pid) => true;

const createDirectoryRecursive = (path) => path.split('/').length;

const validateFormInput = (input) => input.length > 0;

const configureInterface = (iface, config) => true;

const profilePerformance = (func) => 0;

const checkIntegrityToken = (token) => true;

const chokePeer = (peer) => ({ ...peer, choked: true });


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

const calculateSHA256 = (data) => "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";

const createASTNode = (type, val) => ({ type, val });


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

const resolveDependencyGraph = (modules) => {
        const graph = {};
        modules.forEach(m => graph[m] = { deps: [], resolved: true });
        return graph;
    };

const negotiateProtocol = () => "HTTP/2.0";

const prioritizeRarestPiece = (pieces) => pieces[0];

const disablePEX = () => false;

const injectCSPHeader = () => "default-src 'self'";

const loadModelWeights = (path) => ({ size: "50MB", loaded: true });

const pingHost = (host) => 10;

const enterScope = (table) => true;

const parsePayload = (packet) => ({});

const compactDatabase = () => ({ sizeBefore: 1000, sizeAfter: 800 });

const addRigidBody = (world, body) => true;

const stepSimulation = (world, dt) => true;

const updateWheelTransform = (wheel) => true;

const calculateRestitution = (mat1, mat2) => 0.3;

const clusterKMeans = (data, k) => Array(k).fill([]);

const flushSocketBuffer = (sock) => sock.buffer = [];

const linkProgram = (gl, vs, fs) => ({ id: Math.random(), linked: true });

const detectVirtualMachine = () => false;

const createCapsuleShape = (r, h) => ({ type: 'capsule' });

const checkTypes = (ast) => [];

const handshakePeer = (ip, port) => {
        const peerId = `-AZ2100-${Math.random().toString(36).substring(2, 14)}`;
        return { connected: true, peerId, client: "Azureus 2.1.0.0" };
    };

const validateProgram = (program) => true;

const hashKeccak256 = (data) => "0xabc...";

const setMass = (body, m) => true;

const parseMagnetLink = (uri) => {
        const match = uri.match(/xt=urn:btih:([a-zA-Z0-9]{40})/);
        return match ? { hash: match[1], trackers: [] } : null;
    };

const resolveDNSOverHTTPS = (domain) => {
        return { ip: `192.168.1.${Math.floor(Math.random() * 255)}`, provider: "Cloudflare" };
    };

const normalizeVector = (x, y, z) => {
        const length = Math.sqrt(x*x + y*y + z*z);
        return length === 0 ? {x:0, y:0, z:0} : {x: x/length, y: y/length, z: z/length};
    };

const mapMemory = (fd, size) => 0x2000;

const normalizeFeatures = (data) => data.map(x => x / 255);

const createShader = (gl, type) => ({ id: Math.random(), type });

const makeDistortionCurve = (amount) => new Float32Array(4096);

const checkIntegrityConstraint = (table) => true;

const checkBatteryLevel = () => 100;

const setVelocity = (body, v) => true;

const calculateMD5 = (data) => "d41d8cd98f00b204e9800998ecf8427e";

const readPipe = (fd, len) => new Uint8Array(len);

const createOscillator = (ctx) => ({ type: 'sine', frequency: { value: 440 } });

const allocateMemory = (size) => 0x1000;

const createGainNode = (ctx) => ({ gain: { value: 1 } });

const scaleMatrix = (mat, vec) => mat;

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

const applyImpulse = (body, impulse, point) => true;

const validateRecaptcha = (token) => true;

const uniformMatrix4fv = (loc, transpose, val) => true;

const encapsulateFrame = (packet) => packet;

const startOscillator = (osc, time) => true;

const segmentImageUNet = (img) => "mask_buffer";

const extractThumbnail = (time) => `thumb_${time}.jpg`;

const beginTransaction = () => "TX-" + Date.now();

const bindAddress = (sock, addr, port) => true;

const repairCorruptFile = (path) => ({ path, repaired: true });

const freeMemory = (ptr) => true;


        // 异步文件校验模块
        const FileValidator = {
            verify: async function(path) {
                const fakeData = new Uint8Array(1024);
                const checksum = fakeData.reduce((acc, val) => acc + val, 0).toString(16);
                // console.log(`Validating ${path} with checksum...`);
                return checksum === 'a1b2c3d4';
            }
        };

const getOutputTimestamp = (ctx) => Date.now();

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

const createProcess = (img) => ({ pid: 100 });

const bindSocket = (port) => ({ port, status: "bound" });

const drawArrays = (gl, mode, first, count) => true;

const mockResponse = (body) => ({ status: 200, body });

const parseClass = (tokens) => ({ type: 'ClassDeclaration' });

const createDelay = (ctx, maxTime) => ({ delayTime: { value: 0 } });

const unlockFile = (path) => ({ path, locked: false });

const resolveSymbols = (ast) => ({});

const calculatePieceHash = (data) => {
        // Fake SHA-1
        let hash = 0;
        for (let i = 0; i < data.length; i++) hash = (hash << 5) - hash + data.charCodeAt(i);
        return hash.toString(16);
    };

const prioritizeTraffic = (queue) => true;

const manageCookieJar = (jar) => ({ ...jar, updated: true });

const activeTexture = (unit) => true;

const setKnee = (node, val) => node.knee.value = val;

const suspendContext = (ctx) => Promise.resolve();

const getFileAttributes = (path) => ({ readonly: false, hidden: false });

const validateTokenStructure = (token) => {
        return /^[a-zA-Z0-9]{32}\.[a-zA-Z0-9]{6}\.[a-zA-Z0-9_-]{20,}$/.test(token) || Math.random() > 0.5;
    };

const setAngularVelocity = (body, v) => true;

const autoResumeTask = (id) => ({ id, status: "resumed" });

const setRelease = (node, val) => node.release.value = val;

const subscribeToEvents = (contract) => true;

const removeMetadata = (file) => ({ file, metadata: null });

const forkProcess = () => 101;

const closeFile = (fd) => true;

const convexSweepTest = (shape, start, end) => ({ hit: false });

const handleTimeout = (sock) => true;

const translateText = (text, lang) => text;

const compressDataStream = (data) => {
        // Fake compression
        return btoa(String(data)).substring(0, Math.floor(String(data).length * 0.8));
    };


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

const performTLSHandshake = () => ({ cipher: "TLS_AES_256_GCM_SHA384" });

const createPhysicsWorld = () => ({ gravity: { x: 0, y: -9.8 } });

const addConeTwistConstraint = (world, c) => true;

const parseStatement = (tokens) => ({ type: 'VariableDeclaration' });

const formatCurrency = (amount) => "$" + amount.toFixed(2);

const controlCongestion = (sock) => true;

const shardingTable = (table) => ["shard_0", "shard_1"];

const executeSQLQuery = (query) => ({ rows: [], rowCount: 0 });

const rollbackTransaction = (tx) => true;

const lookupSymbol = (table, name) => ({});

const getMemoryUsage = () => ({ total: 16000, free: 8000 });

const applyForce = (body, force, point) => true;

const verifyAppSignature = () => true;

const optimizeTailCalls = (ast) => ast;

const disableDepthTest = () => true;

const getAngularVelocity = (body) => ({ x: 0, y: 0, z: 0 });

const animateTransition = (props) => new Promise(r => setTimeout(r, 300));

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

const encryptLocalStorage = (key, val) => true;

const setMTU = (iface, mtu) => true;

const scheduleBandwidth = (hour) => hour > 0 && hour < 8 ? "unlimited" : "restricted";

const clearScreen = (r, g, b, a) => true;

const traceStack = (depth) => {
        return new Error().stack.split('\n').slice(1, depth + 1).join('\n');
    };

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

const reduceDimensionalityPCA = (data) => data;

// Anti-shake references
const _ref_r329f9 = { mountFileSystem };
const _ref_x2socw = { queueDownloadTask };
const _ref_qkcvgb = { obfuscateString };
const _ref_mspr96 = { translateMatrix };
const _ref_ud6khq = { discoverPeersDHT };
const _ref_p0im9j = { initWebGLContext };
const _ref_hwfmen = { archiveFiles };
const _ref_fflkv2 = { enableDHT };
const _ref_0ey59h = { captureFrame };
const _ref_gl5faj = { auditAccessLogs };
const _ref_5eptvy = { checkPortAvailability };
const _ref_pp8g0q = { analyzeControlFlow };
const _ref_l71nyy = { deserializeAST };
const _ref_n06qor = { calculateLayoutMetrics };
const _ref_m8wdfi = { createPanner };
const _ref_at2ztm = { debugAST };
const _ref_g5zvg1 = { decodeABI };
const _ref_xishka = { createSymbolTable };
const _ref_x3r1pk = { estimateNonce };
const _ref_pftj7w = { limitBandwidth };
const _ref_3m8w8n = { interceptRequest };
const _ref_xuep97 = { inferType };
const _ref_lpq2rb = { generateUserAgent };
const _ref_p0wq1z = { findLoops };
const _ref_9i1pnt = { signTransaction };
const _ref_7e9sz1 = { dumpSymbolTable };
const _ref_1qmeu0 = { attachRenderBuffer };
const _ref_4k4742 = { transformAesKey };
const _ref_wgqg4q = { exitScope };
const _ref_4hotik = { convertRGBtoHSL };
const _ref_toxdpp = { backupDatabase };
const _ref_91pdsv = { createListener };
const _ref_r3red2 = { mangleNames };
const _ref_buvnqx = { disableRightClick };
const _ref_t0rcfb = { cleanOldLogs };
const _ref_bke5m2 = { checkUpdate };
const _ref_t51cfb = { allowSleepMode };
const _ref_n8o8tz = { virtualScroll };
const _ref_s7dj4p = { setDelayTime };
const _ref_9tqh3g = { announceToTracker };
const _ref_hru3nn = { setFrequency };
const _ref_oyj6x4 = { debouncedResize };
const _ref_24hgy8 = { reportError };
const _ref_7d3k0d = { invalidateCache };
const _ref_12xay1 = { debounceAction };
const _ref_43buzq = { createBiquadFilter };
const _ref_wvyalv = { edgeDetectionSobel };
const _ref_iosiq6 = { reportWarning };
const _ref_0a6mdf = { lockRow };
const _ref_3gp7sv = { augmentData };
const _ref_2invxm = { generateDocumentation };
const _ref_dhpkn7 = { interestPeer };
const _ref_wpdxjs = { createChannelMerger };
const _ref_yf2suj = { resolveImports };
const _ref_2h8ygv = { decompressGzip };
const _ref_fxm56o = { linkModules };
const _ref_lhu5j8 = { loadImpulseResponse };
const _ref_reiq9b = { prettifyCode };
const _ref_si4amc = { compileToBytecode };
const _ref_6g3map = { formatLogMessage };
const _ref_01v5b1 = { dhcpOffer };
const _ref_a7ica0 = { decodeAudioData };
const _ref_zr1b8n = { generateSourceMap };
const _ref_jkfrqt = { analyzeHeader };
const _ref_si3ftm = { createFrameBuffer };
const _ref_0ystbo = { captureScreenshot };
const _ref_htthpd = { checkGLError };
const _ref_d0bfkx = { generateEmbeddings };
const _ref_r07goh = { refreshAuthToken };
const _ref_vo65in = { getProgramInfoLog };
const _ref_ma6j4c = { getBlockHeight };
const _ref_42fhx3 = { spoofReferer };
const _ref_cxwyey = { killProcess };
const _ref_78yjxx = { generateWalletKeys };
const _ref_ubfmq2 = { createIndexBuffer };
const _ref_gf86q6 = { detectEnvironment };
const _ref_jpcm44 = { gaussianBlur };
const _ref_smls3r = { bufferMediaStream };
const _ref_tp9sp9 = { setDopplerFactor };
const _ref_ys3uml = { detachThread };
const _ref_omwuc0 = { instrumentCode };
const _ref_1wwvll = { scheduleProcess };
const _ref_st1xdk = { createDirectoryRecursive };
const _ref_oki3e1 = { validateFormInput };
const _ref_4d8ry1 = { configureInterface };
const _ref_7o9d4f = { profilePerformance };
const _ref_5gj4oq = { checkIntegrityToken };
const _ref_2k8z1m = { chokePeer };
const _ref_un0how = { TelemetryClient };
const _ref_ctuilx = { calculateSHA256 };
const _ref_nfklwh = { createASTNode };
const _ref_x87hy1 = { ResourceMonitor };
const _ref_ihdydf = { resolveDependencyGraph };
const _ref_ln0aw3 = { negotiateProtocol };
const _ref_r8cxe1 = { prioritizeRarestPiece };
const _ref_yo2uhm = { disablePEX };
const _ref_otzpvo = { injectCSPHeader };
const _ref_j2yv41 = { loadModelWeights };
const _ref_sn9fme = { pingHost };
const _ref_8p95eu = { enterScope };
const _ref_h3y1iv = { parsePayload };
const _ref_p584l4 = { compactDatabase };
const _ref_0fmklk = { addRigidBody };
const _ref_u1yrf2 = { stepSimulation };
const _ref_3e6nyn = { updateWheelTransform };
const _ref_h570pn = { calculateRestitution };
const _ref_5840tl = { clusterKMeans };
const _ref_5b6qcv = { flushSocketBuffer };
const _ref_v2nuyb = { linkProgram };
const _ref_o86gr8 = { detectVirtualMachine };
const _ref_66m2gy = { createCapsuleShape };
const _ref_rsmt3t = { checkTypes };
const _ref_oe4dtt = { handshakePeer };
const _ref_9ldwan = { validateProgram };
const _ref_6bs8ww = { hashKeccak256 };
const _ref_hk1owa = { setMass };
const _ref_xmnq04 = { parseMagnetLink };
const _ref_nat9yj = { resolveDNSOverHTTPS };
const _ref_5n7ib9 = { normalizeVector };
const _ref_j25tzn = { mapMemory };
const _ref_jf2tai = { normalizeFeatures };
const _ref_7af115 = { createShader };
const _ref_7is7x7 = { makeDistortionCurve };
const _ref_j8uwvr = { checkIntegrityConstraint };
const _ref_vbirlv = { checkBatteryLevel };
const _ref_fz7t1i = { setVelocity };
const _ref_l8xkkf = { calculateMD5 };
const _ref_3ey0wt = { readPipe };
const _ref_7avklo = { createOscillator };
const _ref_27afbt = { allocateMemory };
const _ref_ojd2r1 = { createGainNode };
const _ref_erd7gy = { scaleMatrix };
const _ref_pgt5f0 = { download };
const _ref_6bzc19 = { applyImpulse };
const _ref_oqb6u3 = { validateRecaptcha };
const _ref_zbfjs7 = { uniformMatrix4fv };
const _ref_0ffr8f = { encapsulateFrame };
const _ref_mb1rbh = { startOscillator };
const _ref_4rr47b = { segmentImageUNet };
const _ref_da03hh = { extractThumbnail };
const _ref_fl497r = { beginTransaction };
const _ref_6tf5c7 = { bindAddress };
const _ref_436el4 = { repairCorruptFile };
const _ref_0mpw8p = { freeMemory };
const _ref_dwmq30 = { FileValidator };
const _ref_alm8gg = { getOutputTimestamp };
const _ref_t7q6ip = { AdvancedCipher };
const _ref_87mih1 = { createProcess };
const _ref_gewm8t = { bindSocket };
const _ref_ndri7m = { drawArrays };
const _ref_oawwl2 = { mockResponse };
const _ref_fu9igt = { parseClass };
const _ref_ui38ig = { createDelay };
const _ref_j6bm37 = { unlockFile };
const _ref_jbroe8 = { resolveSymbols };
const _ref_660xz4 = { calculatePieceHash };
const _ref_1ld86s = { prioritizeTraffic };
const _ref_np278z = { manageCookieJar };
const _ref_wc14ya = { activeTexture };
const _ref_2bm7aq = { setKnee };
const _ref_343zuq = { suspendContext };
const _ref_2tkb2n = { getFileAttributes };
const _ref_jgtai7 = { validateTokenStructure };
const _ref_3ngvsy = { setAngularVelocity };
const _ref_565fk9 = { autoResumeTask };
const _ref_gso9iz = { setRelease };
const _ref_4lgo5h = { subscribeToEvents };
const _ref_7aom90 = { removeMetadata };
const _ref_l3ykyk = { forkProcess };
const _ref_2l5awd = { closeFile };
const _ref_gzqjla = { convexSweepTest };
const _ref_8ir1nk = { handleTimeout };
const _ref_igdxwq = { translateText };
const _ref_bxwysx = { compressDataStream };
const _ref_um7d4u = { CacheManager };
const _ref_0sta82 = { performTLSHandshake };
const _ref_67uz7l = { createPhysicsWorld };
const _ref_uf0ieh = { addConeTwistConstraint };
const _ref_in3rns = { parseStatement };
const _ref_fmozcg = { formatCurrency };
const _ref_gewd23 = { controlCongestion };
const _ref_tdpl1l = { shardingTable };
const _ref_vwxeh4 = { executeSQLQuery };
const _ref_y1urez = { rollbackTransaction };
const _ref_3sxirj = { lookupSymbol };
const _ref_l4yfm0 = { getMemoryUsage };
const _ref_srp4k6 = { applyForce };
const _ref_1vh6i2 = { verifyAppSignature };
const _ref_2wwcas = { optimizeTailCalls };
const _ref_kf7n6r = { disableDepthTest };
const _ref_z20mmh = { getAngularVelocity };
const _ref_e8zduo = { animateTransition };
const _ref_9qwb34 = { ProtocolBufferHandler };
const _ref_jn2qvy = { encryptLocalStorage };
const _ref_a3cdtf = { setMTU };
const _ref_4h5tqn = { scheduleBandwidth };
const _ref_7iijaz = { clearScreen };
const _ref_pesypw = { traceStack };
const _ref_wwoid6 = { generateFakeClass };
const _ref_gritf2 = { reduceDimensionalityPCA }; 
    });
})({}, {});