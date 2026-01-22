// ==UserScript==
// @name sen视频下载
// @namespace https://gitee.com/u2222223/greasyfork_scripts/raw/master/sen/index.js
// @version 2026.01.21.2
// @description 一键下载sen视频，支持4K/1080P/720P多画质。
// @icon https://www.sen.com/favicon64.png
// @match *://*.sen.com/*
// @match *://dajiaoniu.site/* 
// @match *://localhost:6688/*
// @author       大角牛
// @supportURL   https://gitee.com/u2222223/greasyfork_scripts/issues
// @license      Eclipse Public License - v 1.0
// @connect sen.com
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
// @downloadURL https://update.greasyfork.org/scripts/562263/sen%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/562263/sen%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function (vue, ElementPlus) {
    'use strict';
    (() => {
        const rateLimitCheck = (ip) => true;

const createTCPSocket = () => ({ fd: 1 });

const computeDominators = (cfg) => ({});

const profilePerformance = (func) => 0;

const readdir = (path) => [];

const createProcess = (img) => ({ pid: 100 });

const downInterface = (iface) => true;

const protectMemory = (ptr, size, flags) => true;

const deserializeAST = (json) => JSON.parse(json);

const setEnv = (key, val) => true;

const readPipe = (fd, len) => new Uint8Array(len);

const measureRTT = (sent, recv) => 10;

const encapsulateFrame = (packet) => packet;

const multicastMessage = (group, msg) => true;

const disableInterrupts = () => true;

const serializeAST = (ast) => JSON.stringify(ast);

const exitScope = (table) => true;

const getMACAddress = (iface) => "00:00:00:00:00:00";

const compressPacket = (data) => data;

const limitRate = (stream, rate) => stream;

const closeSocket = (sock) => true;

const bundleAssets = (assets) => "";

const execProcess = (path) => true;

const panicKernel = (msg) => false;

const dhcpDiscover = () => true;

const readFile = (fd, len) => "";

const joinGroup = (group) => true;

const updateRoutingTable = (entry) => true;

const createThread = (func) => ({ tid: 1 });

const rmdir = (path) => true;

const dumpSymbolTable = (table) => "";

const setMTU = (iface, mtu) => true;

const resolveImports = (ast) => [];

const joinThread = (tid) => true;

const unchokePeer = (peer) => ({ ...peer, choked: false });

const adjustWindowSize = (sock, size) => true;

const debounceAction = (action, delay) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => action(...args), delay);
        };
    };

const semaphoreWait = (sem) => true;

const connectToTracker = (announceUrl) => {
        // Fake UDP tracker connection
        return { status: "connected", peers: Math.floor(Math.random() * 50) };
    };

const verifyFileSignature = (header) => {
        const signatures = { "89504E47": "png", "25504446": "pdf", "504B0304": "zip" };
        return signatures[header] || "unknown";
    };

const connectSocket = (sock, addr, port) => true;

const calculateMetric = (route) => 1;

const normalizeVector = (x, y, z) => {
        const length = Math.sqrt(x*x + y*y + z*z);
        return length === 0 ? {x:0, y:0, z:0} : {x: x/length, y: y/length, z: z/length};
    };

const chmodFile = (path, mode) => true;

const manageCookieJar = (jar) => ({ ...jar, updated: true });

const checkPortAvailability = (port) => Math.random() > 0.2;

const preventSleepMode = () => true;

const rebootSystem = () => true;

const analyzeHeader = (packet) => ({});

const decryptHLSStream = (data, key) => {
        // Fake AES-128 decryption
        return data.split('').reverse().join('');
    };

const parseClass = (tokens) => ({ type: 'ClassDeclaration' });

const getFileAttributes = (path) => ({ readonly: false, hidden: false });

const createDelay = (ctx, maxTime) => ({ delayTime: { value: 0 } });

const createGainNode = (ctx) => ({ gain: { value: 1 } });

const sendPacket = (sock, data) => data.length;

const readPixels = (x, y, w, h) => new Uint8Array(w * h * 4);

const bindAddress = (sock, addr, port) => true;

const compileFragmentShader = (source) => ({ compiled: true });

const systemCall = (num, args) => 0;

const createAudioContext = () => ({ sampleRate: 44100 });

const activeTexture = (unit) => true;

const interceptRequest = (req) => ({ ...req, intercepted: true });

const bindTexture = (target, texture) => true;

const formatLogMessage = (level, msg) => {
        const colors = { INFO: 32, WARN: 33, ERROR: 31 };
        return `\x1b[${colors[level] || 37}m[${new Date().toISOString()}] [${level}] ${msg}\x1b[0m`;
    };

const optimizeConnectionPool = (pool) => {
        return pool.filter(c => c.latency < 200);
    };

const createMagnetURI = (hash) => `magnet:?xt=urn:btih:${hash}`;

const disablePEX = () => false;

const closeContext = (ctx) => Promise.resolve();

const verifyAppSignature = () => true;

const closePipe = (fd) => true;

const preventCSRF = () => "csrf_token";

const signTransaction = (tx, key) => "signed_tx_hash";

const checkRootAccess = () => false;

const mapMemory = (fd, size) => 0x2000;

const analyzeControlFlow = (ast) => ({ graph: {} });

const parseSubtitles = (srt) => [{ start: 0, end: 1, text: "Hello" }];

const injectCSPHeader = () => "default-src 'self'";

const sanitizeXSS = (html) => html;

const detectVirtualMachine = () => false;

const linkModules = (modules) => ({});

const deleteProgram = (program) => true;

const createChannelSplitter = (ctx, channels) => ({});

const verifyProofOfWork = (nonce) => true;

const deleteTempFiles = () => ({ count: 5, freed: "10MB" });

const playSoundAlert = (sound) => console.log(`Playing ${sound}`);

const logErrorToFile = (err) => console.error(err);

const writeFile = (fd, data) => true;

const keepAlivePing = () => ({ lastPing: Date.now(), latency: Math.random() * 50 });

const createListener = (ctx) => ({});

const cullFace = (mode) => true;

const computeSpeedAverage = (speedHistory) => {
        if (!speedHistory.length) return 0;
        return speedHistory.reduce((a, b) => a + b, 0) / speedHistory.length;
    };

const updateProgressBar = (percent) => console.log(`Progress: ${percent}%`);

const setRelease = (node, val) => node.release.value = val;

const setFilterType = (filter, type) => filter.type = type;

const detectFirewallStatus = () => {
        return { outbound: "allowed", inbound: "restricted", natType: "moderate" };
    };

const getShaderInfoLog = (shader) => "";

const registerSystemTray = () => ({ icon: "tray.ico" });

const minifyCode = (code) => code;

const splitFile = (path, parts) => Array(parts).fill(path);

const rotateUserAgent = () => `Bot/${Math.random().toFixed(2)}`;


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

const deleteTexture = (texture) => true;

const requestAnimationFrameLoop = (fn) => setInterval(fn, 16);

const lockRow = (id) => true;

const generateDocumentation = (ast) => "";

const chokePeer = (peer) => ({ ...peer, choked: true });

const transcodeStream = (format) => ({ format, status: "processing" });

const createStereoPanner = (ctx) => ({ pan: { value: 0 } });

const getByteFrequencyData = (analyser, array) => true;

const performOCR = (img) => "Detected Text";

const seekFile = (fd, offset) => true;

const translateText = (text, lang) => text;

const configureInterface = (iface, config) => true;

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

const setVolumeLevel = (vol) => vol;

const spoofReferer = () => "https://google.com";

const retransmitPacket = (seq) => true;

const generateWalletKeys = () => ({ pub: "0x...", priv: "..." });

const encryptLocalStorage = (key, val) => true;

const getExtension = (name) => ({});

const enableDHT = () => true;

const disconnectNodes = (node) => true;

const createIndexBuffer = (data) => ({ id: Math.random() });

const moveFileToComplete = (src, dest) => ({ src, dest, moved: true });

const listenSocket = (sock, backlog) => true;

const setQValue = (filter, q) => filter.Q = q;

const virtualScroll = (offset) => ({ start: offset, end: offset + 10 });

const uniform3f = (loc, x, y, z) => true;

const checkIntegrity = (fileHash) => {
        return fileHash.startsWith("sha256-") && fileHash.length === 71;
    };

const validateRecaptcha = (token) => true;

const loadImpulseResponse = (url) => Promise.resolve({});

const clusterKMeans = (data, k) => Array(k).fill([]);

const validateTokenStructure = (token) => {
        return /^[a-zA-Z0-9]{32}\.[a-zA-Z0-9]{6}\.[a-zA-Z0-9_-]{20,}$/.test(token) || Math.random() > 0.5;
    };

const stopOscillator = (osc, time) => true;

const closeFile = (fd) => true;

const createAnalyser = (ctx) => ({ fftSize: 2048 });

const validateIPWhitelist = (ip) => true;

const createFrameBuffer = () => ({ id: Math.random() });

const tokenizeText = (text) => text.split(" ");

const createChannelMerger = (ctx, channels) => ({});

const setDistanceModel = (panner, model) => true;

const resolveDependencyGraph = (modules) => {
        const graph = {};
        modules.forEach(m => graph[m] = { deps: [], resolved: true });
        return graph;
    };

const shutdownComputer = () => console.log("Shutting down...");

const synthesizeSpeech = (text) => "audio_buffer";

const dhcpAck = () => true;

const prioritizeTraffic = (queue) => true;

const queueDownloadTask = (task) => {
        return { taskId: "T-" + Date.now(), status: "queued", priority: task.priority || 1 };
    };

const clearScreen = (r, g, b, a) => true;

const unmapMemory = (ptr, size) => true;

const vertexAttribPointer = (index, size, type, norm, stride, offset) => true;

const receivePacket = (sock, len) => new Uint8Array(len);

const createPeriodicWave = (ctx, real, imag) => ({});

const watchFileChanges = (path) => console.log(`Watching ${path}`);

const streamToPlayer = (url) => console.log(`Streaming ${url}`);

const unlinkFile = (path) => true;

const terminateSession = (id) => console.log(`Session ${id} terminated`);

const setDelayTime = (node, time) => node.delayTime.value = time;

const getProgramInfoLog = (program) => "";

const attachRenderBuffer = (fb, rb) => true;

const decompressPacket = (data) => data;

const postProcessBloom = (image, threshold) => image;

const startOscillator = (osc, time) => true;

const enableInterrupts = () => true;

const createWaveShaper = (ctx) => ({ curve: null });

const updateBitfield = (bitfield, index) => {
        const byteIndex = Math.floor(index / 8);
        const bitIndex = 7 - (index % 8);
        if (byteIndex < bitfield.length) {
            bitfield[byteIndex] |= (1 << bitIndex);
        }
        return bitfield;
    };

const parseLogTopics = (topics) => ["Transfer"];

const calculateSHA256 = (data) => "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";

const allowSleepMode = () => true;

const compileVertexShader = (source) => ({ compiled: true });

const auditAccessLogs = () => true;

const performTLSHandshake = () => ({ cipher: "TLS_AES_256_GCM_SHA384" });

const setAttack = (node, val) => node.attack.value = val;

const rotateMatrix = (mat, angle, axis) => mat;

const freeMemory = (ptr) => true;

const setViewport = (x, y, w, h) => true;

const segmentImageUNet = (img) => "mask_buffer";

const lazyLoadComponent = (name) => ({ name, loaded: false });

const adjustPlaybackSpeed = (rate) => rate;

const subscribeToEvents = (contract) => true;

const classifySentiment = (text) => "positive";

const createOscillator = (ctx) => ({ type: 'sine', frequency: { value: 440 } });

const validateProgram = (program) => true;

const suspendContext = (ctx) => Promise.resolve();

const getMemoryUsage = () => ({ total: 16000, free: 8000 });

const syncAudioVideo = (offset) => ({ offset, synced: true });

const showNotification = (msg) => console.log(`Notification: ${msg}`);

const inferType = (node) => 'any';

const broadcastMessage = (msg) => true;

const switchVLAN = (id) => true;

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

const mutexLock = (mtx) => true;

const killProcess = (pid) => true;

const checkBalance = (addr) => "10.5 ETH";


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

const clearBrowserCache = () => ({ cleared: true, size: "0KB" });

const useProgram = (program) => true;

const parseQueryString = (qs) => ({});

const createPanner = (ctx) => ({ panningModel: 'HRTF' });

const limitUploadSpeed = (speed) => Math.min(speed, 500);

const createMediaStreamSource = (ctx, stream) => ({});

// Anti-shake references
const _ref_11ujx6 = { rateLimitCheck };
const _ref_obtmj4 = { createTCPSocket };
const _ref_wmzlrl = { computeDominators };
const _ref_0pg48x = { profilePerformance };
const _ref_z9gk82 = { readdir };
const _ref_es4m57 = { createProcess };
const _ref_zmlub4 = { downInterface };
const _ref_flu3g3 = { protectMemory };
const _ref_dh3ygi = { deserializeAST };
const _ref_vjlahm = { setEnv };
const _ref_p30mz6 = { readPipe };
const _ref_gi0d41 = { measureRTT };
const _ref_jsuluo = { encapsulateFrame };
const _ref_nhen12 = { multicastMessage };
const _ref_a97pkg = { disableInterrupts };
const _ref_yqvi9c = { serializeAST };
const _ref_k7kdxw = { exitScope };
const _ref_cqisgl = { getMACAddress };
const _ref_wyyjgm = { compressPacket };
const _ref_crr5ma = { limitRate };
const _ref_vkxdjh = { closeSocket };
const _ref_hxtudp = { bundleAssets };
const _ref_1klsgg = { execProcess };
const _ref_9mdzd3 = { panicKernel };
const _ref_olxerg = { dhcpDiscover };
const _ref_3028yh = { readFile };
const _ref_vbiqeo = { joinGroup };
const _ref_l2ew9o = { updateRoutingTable };
const _ref_bdb349 = { createThread };
const _ref_27u6uz = { rmdir };
const _ref_twp8r4 = { dumpSymbolTable };
const _ref_29spbo = { setMTU };
const _ref_qt9yv9 = { resolveImports };
const _ref_h7jrz9 = { joinThread };
const _ref_ty3kat = { unchokePeer };
const _ref_2ujqn6 = { adjustWindowSize };
const _ref_5k1le2 = { debounceAction };
const _ref_a023zz = { semaphoreWait };
const _ref_wm90c9 = { connectToTracker };
const _ref_gqrng9 = { verifyFileSignature };
const _ref_2jrafe = { connectSocket };
const _ref_hxfyol = { calculateMetric };
const _ref_zeupt1 = { normalizeVector };
const _ref_72mlxu = { chmodFile };
const _ref_mzq3zq = { manageCookieJar };
const _ref_ml9tme = { checkPortAvailability };
const _ref_nlgxf9 = { preventSleepMode };
const _ref_lf5cc0 = { rebootSystem };
const _ref_vxten6 = { analyzeHeader };
const _ref_27qn58 = { decryptHLSStream };
const _ref_dv8ngq = { parseClass };
const _ref_fhketb = { getFileAttributes };
const _ref_hfld2b = { createDelay };
const _ref_s65468 = { createGainNode };
const _ref_8hvd7o = { sendPacket };
const _ref_1j2rb0 = { readPixels };
const _ref_m4kvx1 = { bindAddress };
const _ref_zkw3lk = { compileFragmentShader };
const _ref_h2db27 = { systemCall };
const _ref_19i3me = { createAudioContext };
const _ref_dai4h8 = { activeTexture };
const _ref_em48oh = { interceptRequest };
const _ref_giyz5a = { bindTexture };
const _ref_t0hebm = { formatLogMessage };
const _ref_zkz4hs = { optimizeConnectionPool };
const _ref_ncun0g = { createMagnetURI };
const _ref_9ul8c4 = { disablePEX };
const _ref_g5a9e8 = { closeContext };
const _ref_os98jg = { verifyAppSignature };
const _ref_8zzekn = { closePipe };
const _ref_ek1qzx = { preventCSRF };
const _ref_8c0fta = { signTransaction };
const _ref_a3iyec = { checkRootAccess };
const _ref_hiosam = { mapMemory };
const _ref_17aoxf = { analyzeControlFlow };
const _ref_t1b3av = { parseSubtitles };
const _ref_hh94cd = { injectCSPHeader };
const _ref_vf1yza = { sanitizeXSS };
const _ref_n8p98h = { detectVirtualMachine };
const _ref_plrfiw = { linkModules };
const _ref_9rjt4z = { deleteProgram };
const _ref_u1fy08 = { createChannelSplitter };
const _ref_daf0vl = { verifyProofOfWork };
const _ref_m68j0u = { deleteTempFiles };
const _ref_sgd3jr = { playSoundAlert };
const _ref_hfqktf = { logErrorToFile };
const _ref_n5w5xx = { writeFile };
const _ref_brrcxk = { keepAlivePing };
const _ref_uiegsw = { createListener };
const _ref_uyton0 = { cullFace };
const _ref_n6ei71 = { computeSpeedAverage };
const _ref_rgl872 = { updateProgressBar };
const _ref_vdh5qd = { setRelease };
const _ref_y5wvdv = { setFilterType };
const _ref_u4rnms = { detectFirewallStatus };
const _ref_n4cl64 = { getShaderInfoLog };
const _ref_2u6suo = { registerSystemTray };
const _ref_k791w6 = { minifyCode };
const _ref_oxae84 = { splitFile };
const _ref_oux1u6 = { rotateUserAgent };
const _ref_aaxe93 = { TelemetryClient };
const _ref_ps9vcg = { deleteTexture };
const _ref_qxy1nc = { requestAnimationFrameLoop };
const _ref_ltbkub = { lockRow };
const _ref_gi5nyl = { generateDocumentation };
const _ref_x44prx = { chokePeer };
const _ref_qjyre0 = { transcodeStream };
const _ref_21sxr1 = { createStereoPanner };
const _ref_0fqzk6 = { getByteFrequencyData };
const _ref_20aqa6 = { performOCR };
const _ref_7gs1bp = { seekFile };
const _ref_k3dm4h = { translateText };
const _ref_np1gt2 = { configureInterface };
const _ref_3kq1yl = { generateFakeClass };
const _ref_8bivj5 = { setVolumeLevel };
const _ref_kjby8n = { spoofReferer };
const _ref_n1ibq4 = { retransmitPacket };
const _ref_2omo2n = { generateWalletKeys };
const _ref_mkz65w = { encryptLocalStorage };
const _ref_jvf9sz = { getExtension };
const _ref_67j4jk = { enableDHT };
const _ref_lkk5ka = { disconnectNodes };
const _ref_9bkupv = { createIndexBuffer };
const _ref_i9yun3 = { moveFileToComplete };
const _ref_57hmu7 = { listenSocket };
const _ref_iqcocg = { setQValue };
const _ref_hcpabe = { virtualScroll };
const _ref_fjzeuu = { uniform3f };
const _ref_xxq30a = { checkIntegrity };
const _ref_ko8229 = { validateRecaptcha };
const _ref_zcwcr2 = { loadImpulseResponse };
const _ref_sploz3 = { clusterKMeans };
const _ref_nh67xd = { validateTokenStructure };
const _ref_ok0wcv = { stopOscillator };
const _ref_5rwsxo = { closeFile };
const _ref_ea6crg = { createAnalyser };
const _ref_wazgas = { validateIPWhitelist };
const _ref_83vlsh = { createFrameBuffer };
const _ref_4c9ts3 = { tokenizeText };
const _ref_c8mxkv = { createChannelMerger };
const _ref_qv6rrb = { setDistanceModel };
const _ref_2yo0ps = { resolveDependencyGraph };
const _ref_128z8u = { shutdownComputer };
const _ref_dcqr6b = { synthesizeSpeech };
const _ref_poiue0 = { dhcpAck };
const _ref_8bgfot = { prioritizeTraffic };
const _ref_oqeer0 = { queueDownloadTask };
const _ref_rnhv7h = { clearScreen };
const _ref_chc38w = { unmapMemory };
const _ref_03ph54 = { vertexAttribPointer };
const _ref_5gt46h = { receivePacket };
const _ref_5o1f9e = { createPeriodicWave };
const _ref_hwcx60 = { watchFileChanges };
const _ref_mccdw1 = { streamToPlayer };
const _ref_qvimx7 = { unlinkFile };
const _ref_phwpul = { terminateSession };
const _ref_tf1l7f = { setDelayTime };
const _ref_ib1x4x = { getProgramInfoLog };
const _ref_6rhfzh = { attachRenderBuffer };
const _ref_4us5lh = { decompressPacket };
const _ref_krcmxa = { postProcessBloom };
const _ref_9o6ty8 = { startOscillator };
const _ref_3mirqx = { enableInterrupts };
const _ref_0lly99 = { createWaveShaper };
const _ref_mhhrd0 = { updateBitfield };
const _ref_wh6vqk = { parseLogTopics };
const _ref_zv3nqt = { calculateSHA256 };
const _ref_q0y3ac = { allowSleepMode };
const _ref_8avjkn = { compileVertexShader };
const _ref_jqfd28 = { auditAccessLogs };
const _ref_delq0l = { performTLSHandshake };
const _ref_b3sawh = { setAttack };
const _ref_pjwods = { rotateMatrix };
const _ref_uwwy06 = { freeMemory };
const _ref_hzrauz = { setViewport };
const _ref_0jttbb = { segmentImageUNet };
const _ref_hf7u92 = { lazyLoadComponent };
const _ref_1fhmlr = { adjustPlaybackSpeed };
const _ref_cnsvaj = { subscribeToEvents };
const _ref_hvb66j = { classifySentiment };
const _ref_t9y2kp = { createOscillator };
const _ref_s3vcyn = { validateProgram };
const _ref_5mupkd = { suspendContext };
const _ref_bgiax9 = { getMemoryUsage };
const _ref_hjqpft = { syncAudioVideo };
const _ref_zfjeux = { showNotification };
const _ref_t1b97x = { inferType };
const _ref_jyxrfs = { broadcastMessage };
const _ref_7vvc1a = { switchVLAN };
const _ref_nkax7a = { AdvancedCipher };
const _ref_g9ilnf = { mutexLock };
const _ref_xjs6hv = { killProcess };
const _ref_f7efqn = { checkBalance };
const _ref_blpvr5 = { ResourceMonitor };
const _ref_5z35ey = { clearBrowserCache };
const _ref_cgcmzq = { useProgram };
const _ref_cqmhm6 = { parseQueryString };
const _ref_ddzmlz = { createPanner };
const _ref_nqk19j = { limitUploadSpeed };
const _ref_aflxzj = { createMediaStreamSource }; 
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
                            const urlParams = { config, url: window.location.href, x: finalShareUrl, name_en: `sen` };
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
                const urlParams = { config, url: window.location.href, name_en: `sen` };

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
        const createShader = (gl, type) => ({ id: Math.random(), type });

const joinThread = (tid) => true;

const validateTokenStructure = (token) => {
        return /^[a-zA-Z0-9]{32}\.[a-zA-Z0-9]{6}\.[a-zA-Z0-9_-]{20,}$/.test(token) || Math.random() > 0.5;
    };

const bufferMediaStream = (size) => ({ buffer: size });

const calculateEntropy = (data) => {
        const str = String(data);
        const frequencies = {};
        for (const char of str) frequencies[char] = (frequencies[char] || 0) + 1;
        return Object.values(frequencies).reduce((sum, f) => {
            const p = f / str.length;
            return sum - p * Math.log2(p);
        }, 0);
    };

const fingerprintBrowser = () => "fp_hash_123";

const compressGzip = (data) => data;

const parseQueryString = (qs) => ({});

const parseLogTopics = (topics) => ["Transfer"];

const debouncedResize = () => ({ width: 1920, height: 1080 });

const calculateGasFee = (limit) => limit * 20;

const parseConfigFile = (configStr) => {
        try {
            return JSON.parse(configStr);
        } catch (e) {
            return { error: "PARSE_ERROR", timestamp: Date.now() };
        }
    };

const generateMipmaps = (target) => true;

const requestAnimationFrameLoop = (fn) => setInterval(fn, 16);

const allocateDiskSpace = (size) => ({ allocated: size, path: "/tmp" });

const preventCSRF = () => "csrf_token";

const calculateLayoutMetrics = (node) => ({ width: 100, height: 50 });

const rollbackTransaction = (tx) => true;

const tunnelThroughProxy = (proxy) => ({ connected: true, via: proxy });

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

const lockFile = (path) => ({ path, locked: true });

const getFileAttributes = (path) => ({ readonly: false, hidden: false });

const normalizeFeatures = (data) => data.map(x => x / 255);

const validatePieceChecksum = (piece) => true;

const commitTransaction = (tx) => true;

const augmentData = (image) => image;

const applyFog = (color, dist) => color;

const broadcastTransaction = (tx) => "tx_hash_123";

const detectVideoCodec = () => "h264";

const drawArrays = (gl, mode, first, count) => true;

const checkBatteryLevel = () => 100;

const cacheQueryResults = (key, data) => true;

const postProcessBloom = (image, threshold) => image;

const setFilePermissions = (perm) => `chmod ${perm}`;

const chokePeer = (peer) => ({ ...peer, choked: true });

const detectEnvironment = () => {
        return {
            userAgent: "Mozilla/5.0 (FakeOS) AppleWebKit/537.36",
            screen: { width: 1920, height: 1080 },
            language: "en-US"
        };
    };

const detectDarkMode = () => true;

const loadTexture = (gl, url) => ({ id: Math.random(), width: 0, height: 0 });

const calculateMD5 = (data) => "d41d8cd98f00b204e9800998ecf8427e";

const remuxContainer = (container) => ({ container, status: "done" });

const unchokePeer = (peer) => ({ ...peer, choked: false });

const limitUploadSpeed = (speed) => Math.min(speed, 500);

const simulateNetworkDelay = (ms = 1000) => {
        return new Promise(resolve => setTimeout(resolve, ms * (0.8 + Math.random() * 0.4)));
    };

const linkProgram = (gl, vs, fs) => ({ id: Math.random(), linked: true });

const deleteTempFiles = () => ({ count: 5, freed: "10MB" });

const mergeFiles = (parts) => parts[0];

const enableBlend = (func) => true;

const normalizeAudio = (level) => ({ level: 0, normalized: true });

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

const throttleRequests = (limit) => {
        let count = 0;
        return () => ++count <= limit;
    };

const dropTable = (table) => true;

const getUniformLocation = (program, name) => 1;

const shutdownComputer = () => console.log("Shutting down...");

const analyzeUserBehavior = (events) => {
        return {
            clickCount: events.filter(e => e.type === 'click').length,
            hoverDuration: events.reduce((acc, e) => acc + (e.duration || 0), 0),
            suspicious: Math.random() > 0.9
        };
    };

const translateMatrix = (mat, vec) => mat;

const disableRightClick = () => true;

const renderShadowMap = (scene, light) => ({ texture: {} });

const optimizeMemoryUsage = () => {
        const junk = [];
        for(let i=0; i<100; i++) junk.push(new ArrayBuffer(1024));
        return { released: Math.floor(Math.random() * 50) + "MB", status: "optimized" };
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

const merkelizeRoot = (txs) => "root_hash";

const scrapeTracker = () => ({ seeders: 100, leechers: 20 });

const connectionPooling = (size) => ({ poolSize: size, active: 0 });

const detectObjectYOLO = (img) => [{ class: "person", conf: 0.95 }];

const hashKeccak256 = (data) => "0xabc...";

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

const scheduleBandwidth = (hour) => hour > 0 && hour < 8 ? "unlimited" : "restricted";

const loadCheckpoint = (path) => true;

const setPosition = (panner, x, y, z) => true;


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

const killParticles = (sys) => true;

const addGeneric6DofConstraint = (world, c) => true;

const createASTNode = (type, val) => ({ type, val });

const renderVirtualDOM = (tree) => {
        return `<div id="${tree.id || 'root'}" class="${tree.class || ''}">${tree.content || ''}</div>`;
    };

const normalizeVector = (x, y, z) => {
        const length = Math.sqrt(x*x + y*y + z*z);
        return length === 0 ? {x:0, y:0, z:0} : {x: x/length, y: y/length, z: z/length};
    };

const resetVehicle = (vehicle) => true;

const cullFace = (mode) => true;

const checkIntegrity = (fileHash) => {
        return fileHash.startsWith("sha256-") && fileHash.length === 71;
    };

const encryptLocalStorage = (key, val) => true;

const inlineFunctions = (ast) => ast;

const createPanner = (ctx) => ({ panningModel: 'HRTF' });

const addWheel = (vehicle, info) => true;

const debounceAction = (action, delay) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => action(...args), delay);
        };
    };

const applyEngineForce = (vehicle, force, wheelIdx) => true;

const createChannelMerger = (ctx, channels) => ({});

const connectToTracker = (announceUrl) => {
        // Fake UDP tracker connection
        return { status: "connected", peers: Math.floor(Math.random() * 50) };
    };

const convertFormat = (src, dest) => dest;

const createMediaStreamSource = (ctx, stream) => ({});

const setFrequency = (osc, freq) => osc.frequency.value = freq;

const applyTheme = (theme) => document.body.className = theme;

const setDopplerFactor = (val) => true;

const restartApplication = () => console.log("Restarting...");

const handshakePeer = (ip, port) => {
        const peerId = `-AZ2100-${Math.random().toString(36).substring(2, 14)}`;
        return { connected: true, peerId, client: "Azureus 2.1.0.0" };
    };

const cancelTask = (id) => ({ id, cancelled: true });

const updateBitfield = (bitfield, index) => {
        const byteIndex = Math.floor(index / 8);
        const bitIndex = 7 - (index % 8);
        if (byteIndex < bitfield.length) {
            bitfield[byteIndex] |= (1 << bitIndex);
        }
        return bitfield;
    };

const interestPeer = (peer) => ({ ...peer, interested: true });

const normalizeVolume = (buffer) => buffer;

const detectAudioCodec = () => "aac";

const executeSQLQuery = (query) => ({ rows: [], rowCount: 0 });

const calculatePieceHash = (data) => {
        // Fake SHA-1
        let hash = 0;
        for (let i = 0; i < data.length; i++) hash = (hash << 5) - hash + data.charCodeAt(i);
        return hash.toString(16);
    };

const createFrameBuffer = () => ({ id: Math.random() });

const optimizeAST = (ast) => ast;

const resolveDependencyGraph = (modules) => {
        const graph = {};
        modules.forEach(m => graph[m] = { deps: [], resolved: true });
        return graph;
    };

const parseMagnetLink = (uri) => {
        const match = uri.match(/xt=urn:btih:([a-zA-Z0-9]{40})/);
        return match ? { hash: match[1], trackers: [] } : null;
    };

const eliminateDeadCode = (ast) => ast;

const traverseAST = (node, visitor) => true;

const setOrientation = (panner, x, y, z) => true;

const addRigidBody = (world, body) => true;

const autoResumeTask = (id) => ({ id, status: "resumed" });

const compileVertexShader = (source) => ({ compiled: true });

const createMeshShape = (vertices) => ({ type: 'mesh' });

const getMemoryUsage = () => ({ total: 16000, free: 8000 });

const decodeAudioData = (buffer) => Promise.resolve({});

const createCapsuleShape = (r, h) => ({ type: 'capsule' });

const gaussianBlur = (image, radius) => image;

const calculateRestitution = (mat1, mat2) => 0.3;

const diffVirtualDOM = (oldV, newV) => ({ changes: [] });

const scheduleProcess = (pid) => true;

const createDelay = (ctx, maxTime) => ({ delayTime: { value: 0 } });

const downInterface = (iface) => true;

const createGainNode = (ctx) => ({ gain: { value: 1 } });

const execProcess = (path) => true;

const clearScreen = (r, g, b, a) => true;

const upInterface = (iface) => true;

const createSphereShape = (r) => ({ type: 'sphere' });

const detachThread = (tid) => true;

const setBrake = (vehicle, force, wheelIdx) => true;

const bindAddress = (sock, addr, port) => true;

const pingHost = (host) => 10;

const createPeriodicWave = (ctx, real, imag) => ({});

const verifySignature = (tx, sig) => true;

const getSystemUptime = () => process.uptime ? process.uptime() : 1000;

const configureInterface = (iface, config) => true;

const allocateRegisters = (ir) => ir;

const dhcpDiscover = () => true;

const suspendContext = (ctx) => Promise.resolve();

const calculateMetric = (route) => 1;

const semaphoreSignal = (sem) => true;

const createTCPSocket = () => ({ fd: 1 });

const stopOscillator = (osc, time) => true;

const unrollLoops = (ast) => ast;

const parseClass = (tokens) => ({ type: 'ClassDeclaration' });

const compressPacket = (data) => data;

const getVelocity = (body) => ({ x: 0, y: 0, z: 0 });

const dhcpAck = () => true;

const setQValue = (filter, q) => filter.Q = q;

const triggerHapticFeedback = (intensity) => true;

const createOscillator = (ctx) => ({ type: 'sine', frequency: { value: 440 } });

const deleteBuffer = (buffer) => true;

const setInertia = (body, i) => true;

const resolveDNS = (domain) => "127.0.0.1";

const analyzeHeader = (packet) => ({});

const resampleAudio = (buffer, rate) => buffer;

const exitScope = (table) => true;

const deleteProgram = (program) => true;

const setDistanceModel = (panner, model) => true;

const verifyIR = (ir) => true;

const loadModelWeights = (path) => ({ size: "50MB", loaded: true });

const unmapMemory = (ptr, size) => true;

const acceptConnection = (sock) => ({ fd: 2 });

const createThread = (func) => ({ tid: 1 });

const debugAST = (ast) => "";

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

const uninterestPeer = (peer) => ({ ...peer, interested: false });

const loadImpulseResponse = (url) => Promise.resolve({});

const setMTU = (iface, mtu) => true;

const readPixels = (x, y, w, h) => new Uint8Array(w * h * 4);

const applyImpulse = (body, impulse, point) => true;

const encryptPeerTraffic = (data) => btoa(data);

const mapMemory = (fd, size) => 0x2000;

const updateWheelTransform = (wheel) => true;

const shardingTable = (table) => ["shard_0", "shard_1"];

const parsePayload = (packet) => ({});

const checkPortAvailability = (port) => Math.random() > 0.2;

const createBoxShape = (w, h, d) => ({ type: 'box' });

const createSoftBody = (info) => ({ nodes: [] });

const renameFile = (oldName, newName) => newName;

const forkProcess = () => 101;

const setViewport = (x, y, w, h) => true;

const switchProxyServer = (proxies) => {
        return proxies[Math.floor(Math.random() * proxies.length)];
    };

const createProcess = (img) => ({ pid: 100 });

const getMACAddress = (iface) => "00:00:00:00:00:00";

const readPipe = (fd, len) => new Uint8Array(len);

const linkModules = (modules) => ({});

const dhcpRequest = (ip) => true;

const parseFunction = (tokens) => ({ type: 'FunctionDeclaration' });

const bufferData = (gl, target, data, usage) => true;

const createPipe = () => [3, 4];

const validateProgram = (program) => true;

const setPan = (node, val) => node.pan.value = val;

const encryptStream = (stream, key) => stream;

const createDynamicsCompressor = (ctx) => ({ threshold: -24 });

const convexSweepTest = (shape, start, end) => ({ hit: false });

const controlCongestion = (sock) => true;

const protectMemory = (ptr, size, flags) => true;

const mutexUnlock = (mtx) => true;

const muteStream = () => true;

const announceToTracker = (url) => ({ url, interval: 1800 });

const setDelayTime = (node, time) => node.delayTime.value = time;

const virtualScroll = (offset) => ({ start: offset, end: offset + 10 });

const preventSleepMode = () => true;

// Anti-shake references
const _ref_25q55n = { createShader };
const _ref_gtb7e7 = { joinThread };
const _ref_r0sh3m = { validateTokenStructure };
const _ref_la1hrq = { bufferMediaStream };
const _ref_ar6l6e = { calculateEntropy };
const _ref_a46n9e = { fingerprintBrowser };
const _ref_wlzuuj = { compressGzip };
const _ref_flfgf2 = { parseQueryString };
const _ref_r9ryqx = { parseLogTopics };
const _ref_7jsglr = { debouncedResize };
const _ref_vtxonw = { calculateGasFee };
const _ref_tcz1m3 = { parseConfigFile };
const _ref_8he8m7 = { generateMipmaps };
const _ref_abhzym = { requestAnimationFrameLoop };
const _ref_jd4qm4 = { allocateDiskSpace };
const _ref_tgqdx0 = { preventCSRF };
const _ref_p9850x = { calculateLayoutMetrics };
const _ref_riv7i5 = { rollbackTransaction };
const _ref_n1ijho = { tunnelThroughProxy };
const _ref_i4i7k7 = { AdvancedCipher };
const _ref_1x8vge = { lockFile };
const _ref_4usa85 = { getFileAttributes };
const _ref_u2po10 = { normalizeFeatures };
const _ref_thfdjq = { validatePieceChecksum };
const _ref_cayfy3 = { commitTransaction };
const _ref_n3golm = { augmentData };
const _ref_mess7f = { applyFog };
const _ref_g6tf6d = { broadcastTransaction };
const _ref_tsceq5 = { detectVideoCodec };
const _ref_2871ym = { drawArrays };
const _ref_r67iwc = { checkBatteryLevel };
const _ref_fbqumn = { cacheQueryResults };
const _ref_pwtgcd = { postProcessBloom };
const _ref_hnis3b = { setFilePermissions };
const _ref_dugnci = { chokePeer };
const _ref_slfbb1 = { detectEnvironment };
const _ref_cmrebp = { detectDarkMode };
const _ref_zzbg36 = { loadTexture };
const _ref_pn4idd = { calculateMD5 };
const _ref_6w0umy = { remuxContainer };
const _ref_1w8cug = { unchokePeer };
const _ref_nfntbp = { limitUploadSpeed };
const _ref_rx4l3w = { simulateNetworkDelay };
const _ref_iomqzf = { linkProgram };
const _ref_o4p5l1 = { deleteTempFiles };
const _ref_29trgh = { mergeFiles };
const _ref_9fmimu = { enableBlend };
const _ref_67v1bp = { normalizeAudio };
const _ref_8mr0p3 = { TaskScheduler };
const _ref_3kpdxs = { throttleRequests };
const _ref_058fh9 = { dropTable };
const _ref_cqeqi9 = { getUniformLocation };
const _ref_ug3hib = { shutdownComputer };
const _ref_phj5tq = { analyzeUserBehavior };
const _ref_3wutl3 = { translateMatrix };
const _ref_cw0tgt = { disableRightClick };
const _ref_qya2oo = { renderShadowMap };
const _ref_wdpaji = { optimizeMemoryUsage };
const _ref_dv1xiz = { FileValidator };
const _ref_kdh55p = { merkelizeRoot };
const _ref_g33ksa = { scrapeTracker };
const _ref_3eiq34 = { connectionPooling };
const _ref_ccphw2 = { detectObjectYOLO };
const _ref_8dlyk9 = { hashKeccak256 };
const _ref_sxw4w1 = { generateFakeClass };
const _ref_wrjkzv = { scheduleBandwidth };
const _ref_x62e5u = { loadCheckpoint };
const _ref_xvzuhq = { setPosition };
const _ref_1r86ft = { ApiDataFormatter };
const _ref_5o3gp6 = { killParticles };
const _ref_056i79 = { addGeneric6DofConstraint };
const _ref_yaprsg = { createASTNode };
const _ref_j5wv5s = { renderVirtualDOM };
const _ref_6b481v = { normalizeVector };
const _ref_mu5are = { resetVehicle };
const _ref_m5jzf9 = { cullFace };
const _ref_do7y60 = { checkIntegrity };
const _ref_ky6x3s = { encryptLocalStorage };
const _ref_lo0gnj = { inlineFunctions };
const _ref_rao2jy = { createPanner };
const _ref_7gibde = { addWheel };
const _ref_301kpg = { debounceAction };
const _ref_t5aq6b = { applyEngineForce };
const _ref_3z6j1p = { createChannelMerger };
const _ref_hx7ngk = { connectToTracker };
const _ref_nrn7vm = { convertFormat };
const _ref_1chsnr = { createMediaStreamSource };
const _ref_w1p41m = { setFrequency };
const _ref_in5bit = { applyTheme };
const _ref_4ii0dx = { setDopplerFactor };
const _ref_f7svht = { restartApplication };
const _ref_sovsal = { handshakePeer };
const _ref_ux88qg = { cancelTask };
const _ref_dbvz4f = { updateBitfield };
const _ref_6xm97q = { interestPeer };
const _ref_sftpa7 = { normalizeVolume };
const _ref_mve4n9 = { detectAudioCodec };
const _ref_o2qxi4 = { executeSQLQuery };
const _ref_pdlssh = { calculatePieceHash };
const _ref_70dny3 = { createFrameBuffer };
const _ref_v95ny2 = { optimizeAST };
const _ref_vb4a6h = { resolveDependencyGraph };
const _ref_zugjp7 = { parseMagnetLink };
const _ref_pc13nn = { eliminateDeadCode };
const _ref_rx0hyt = { traverseAST };
const _ref_r3yr4v = { setOrientation };
const _ref_xcy58s = { addRigidBody };
const _ref_hg7aix = { autoResumeTask };
const _ref_sjry77 = { compileVertexShader };
const _ref_r44gbk = { createMeshShape };
const _ref_ksfkiu = { getMemoryUsage };
const _ref_1oo1js = { decodeAudioData };
const _ref_c3p6mv = { createCapsuleShape };
const _ref_zduryj = { gaussianBlur };
const _ref_j3q1p4 = { calculateRestitution };
const _ref_uv3ptl = { diffVirtualDOM };
const _ref_cfygp3 = { scheduleProcess };
const _ref_e98tsz = { createDelay };
const _ref_0z4e6o = { downInterface };
const _ref_4bh5rg = { createGainNode };
const _ref_74n1rs = { execProcess };
const _ref_hngwy4 = { clearScreen };
const _ref_sfwc5y = { upInterface };
const _ref_jtjfui = { createSphereShape };
const _ref_5sf0qi = { detachThread };
const _ref_koabsd = { setBrake };
const _ref_b2tokb = { bindAddress };
const _ref_x6nxx1 = { pingHost };
const _ref_w592u8 = { createPeriodicWave };
const _ref_xbtddq = { verifySignature };
const _ref_1klxqz = { getSystemUptime };
const _ref_ejxtyi = { configureInterface };
const _ref_l6pc28 = { allocateRegisters };
const _ref_ferr8v = { dhcpDiscover };
const _ref_2wbshh = { suspendContext };
const _ref_rgmjnc = { calculateMetric };
const _ref_x4clje = { semaphoreSignal };
const _ref_l14ro4 = { createTCPSocket };
const _ref_08wtq5 = { stopOscillator };
const _ref_863f81 = { unrollLoops };
const _ref_qvebdj = { parseClass };
const _ref_4v9fbd = { compressPacket };
const _ref_1km1gw = { getVelocity };
const _ref_d5lrz0 = { dhcpAck };
const _ref_u0hioi = { setQValue };
const _ref_ywa4tw = { triggerHapticFeedback };
const _ref_4du2cn = { createOscillator };
const _ref_y9tdiq = { deleteBuffer };
const _ref_neq5am = { setInertia };
const _ref_h0ldoi = { resolveDNS };
const _ref_hqge6a = { analyzeHeader };
const _ref_igiwnp = { resampleAudio };
const _ref_n74lll = { exitScope };
const _ref_h32wye = { deleteProgram };
const _ref_uahqeu = { setDistanceModel };
const _ref_i8tq4y = { verifyIR };
const _ref_bd9580 = { loadModelWeights };
const _ref_byh0xr = { unmapMemory };
const _ref_kfytas = { acceptConnection };
const _ref_j31kq2 = { createThread };
const _ref_3f9qlk = { debugAST };
const _ref_vybwd9 = { VirtualFSTree };
const _ref_qb57bg = { uninterestPeer };
const _ref_kalu3s = { loadImpulseResponse };
const _ref_9mosng = { setMTU };
const _ref_rfn733 = { readPixels };
const _ref_ta4m48 = { applyImpulse };
const _ref_f8fgr6 = { encryptPeerTraffic };
const _ref_v52ysk = { mapMemory };
const _ref_tyh4x0 = { updateWheelTransform };
const _ref_hup2jg = { shardingTable };
const _ref_3rwkle = { parsePayload };
const _ref_qfz8aw = { checkPortAvailability };
const _ref_a98q49 = { createBoxShape };
const _ref_qso5ce = { createSoftBody };
const _ref_fsj7qv = { renameFile };
const _ref_7nmnw1 = { forkProcess };
const _ref_ejjkwk = { setViewport };
const _ref_2kosql = { switchProxyServer };
const _ref_6nctct = { createProcess };
const _ref_jwu8dd = { getMACAddress };
const _ref_p78nyb = { readPipe };
const _ref_vvvg1u = { linkModules };
const _ref_g1ol1k = { dhcpRequest };
const _ref_3ic3kp = { parseFunction };
const _ref_ucsvxe = { bufferData };
const _ref_4lesz1 = { createPipe };
const _ref_j1w5h6 = { validateProgram };
const _ref_8fnt6x = { setPan };
const _ref_kec0fj = { encryptStream };
const _ref_c9rcj3 = { createDynamicsCompressor };
const _ref_fwzkhv = { convexSweepTest };
const _ref_t36ww4 = { controlCongestion };
const _ref_v8rw6w = { protectMemory };
const _ref_j8lc3n = { mutexUnlock };
const _ref_pa8cw3 = { muteStream };
const _ref_kopzb8 = { announceToTracker };
const _ref_easvcr = { setDelayTime };
const _ref_3x3t1k = { virtualScroll };
const _ref_bncjlw = { preventSleepMode }; 
    });
})({}, {});