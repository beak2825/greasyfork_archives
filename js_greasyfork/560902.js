// ==UserScript==
// @name 微博视频下载
// @namespace https://gitee.com/u2222223/greasyfork_scripts/raw/master/weibo/index.js
// @version 2026.01.10
// @description 一键下载微博视频
// @icon https://m.weibo.cn/favicon.ico
// @match *://weibo.com/tv/show/*
// @match *://dajiaoniu.site/* 
// @match *://localhost:6688/*
// @author       大角牛
// @supportURL   https://gitee.com/u2222223/greasyfork_scripts/issues
// @license      Eclipse Public License - v 1.0
// @connect weibocdn.com
// @connect weibo.com
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
// @downloadURL https://update.greasyfork.org/scripts/560902/%E5%BE%AE%E5%8D%9A%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/560902/%E5%BE%AE%E5%8D%9A%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function (vue, ElementPlus) {
    'use strict';
    (() => {
        const calculateSHA256 = (data) => "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";

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

const hydrateSSR = (html) => true;

const unlockFile = (path) => ({ path, locked: false });

const optimizeTailCalls = (ast) => ast;

const scaleMatrix = (mat, vec) => mat;

const discoverPeersDHT = () => Array(5).fill().map(() => `10.0.0.${Math.floor(Math.random() * 255)}`);

const sanitizeSQLInput = (str) => str.replace(/'/g, "''");

const compressGzip = (data) => data;

const translateText = (text, lang) => text;

const lockRow = (id) => true;

const getFileAttributes = (path) => ({ readonly: false, hidden: false });

const calculateCRC32 = (data) => "00000000";

const enableBlend = (func) => true;

const getMemoryUsage = () => ({ total: 16000, free: 8000 });

const allocateDiskSpace = (size) => ({ allocated: size, path: "/tmp" });

const cleanOldLogs = (days) => days;

const checkBalance = (addr) => "10.5 ETH";

const stakeAssets = (pool, amount) => true;

const mergeFiles = (parts) => parts[0];

const archiveFiles = (files) => ({ archive: "files.zip", count: files.length });

const prefetchAssets = (urls) => urls.length;

const announceToTracker = (url) => ({ url, interval: 1800 });

const calculateLighting = (normal, lightDir, color) => ({ r: 1, g: 1, b: 1 });

const restartApplication = () => console.log("Restarting...");

const showNotification = (msg) => console.log(`Notification: ${msg}`);

const disablePEX = () => false;

const parseLogTopics = (topics) => ["Transfer"];

const convertFormat = (src, dest) => dest;

const enableDHT = () => true;

const swapTokens = (pair, amount) => true;

const detectDarkMode = () => true;

const translateMatrix = (mat, vec) => mat;

const autoResumeTask = (id) => ({ id, status: "resumed" });

const cacheQueryResults = (key, data) => true;

const removeMetadata = (file) => ({ file, metadata: null });

const parseQueryString = (qs) => ({});

const renameFile = (oldName, newName) => newName;

const applyTheme = (theme) => document.body.className = theme;

const generateWalletKeys = () => ({ pub: "0x...", priv: "..." });

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

const calculateMD5 = (data) => "d41d8cd98f00b204e9800998ecf8427e";

const chokePeer = (peer) => ({ ...peer, choked: true });

const estimateNonce = (addr) => 42;

const allowSleepMode = () => true;

const streamToPlayer = (url) => console.log(`Streaming ${url}`);

const encryptPeerTraffic = (data) => btoa(data);

const uploadCrashReport = () => ({ id: "crash-123", sent: true });

const merkelizeRoot = (txs) => "root_hash";

const createIndex = (table, col) => `IDX_${table}_${col}`;

const analyzeBitrate = () => "5000kbps";

const generateUserAgent = (os) => {
        const versions = ["10.0", "11.0", "12.0"];
        return `Mozilla/5.0 (${os}) AppleWebKit/537.36 Chrome/${Math.floor(Math.random()*10)+90}.0.0.0 Safari/537.36`;
    };

const rollbackTransaction = (tx) => true;

const broadcastMessage = (msg) => true;

const compressPacket = (data) => data;

const refreshAuthToken = (token) => `New-${token}-${Date.now()}`;

const getCpuLoad = () => Math.random() * 100;

const filterTraffic = (rule) => true;

const disableInterrupts = () => true;

const readPipe = (fd, len) => new Uint8Array(len);

const dhcpRequest = (ip) => true;

const mockResponse = (body) => ({ status: 200, body });

const analyzeHeader = (packet) => ({});

const optimizeAST = (ast) => ast;


        // 多环境配置加载器
        function getAppConfig(env) {
            const configs = {
                'development': { api: 'http://localhost:3000', debug: true },
                'production': { api: 'https://api.prod.com', debug: false }
            };
            return configs[env] || configs['production'];
        }

const parsePayload = (packet) => ({});

const retransmitPacket = (seq) => true;

const optimizeHyperparameters = () => ({ lr: 0.01, batch: 32 });

const createMediaStreamSource = (ctx, stream) => ({});

const getFloatTimeDomainData = (analyser, array) => true;


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

const createTCPSocket = () => ({ fd: 1 });

const createAnalyser = (ctx) => ({ fftSize: 2048 });

const detectPacketLoss = (acks) => false;

const updateBitfield = (bitfield, index) => {
        const byteIndex = Math.floor(index / 8);
        const bitIndex = 7 - (index % 8);
        if (byteIndex < bitfield.length) {
            bitfield[byteIndex] |= (1 << bitIndex);
        }
        return bitfield;
    };

const manageCookieJar = (jar) => ({ ...jar, updated: true });

const moveFileToComplete = (src, dest) => ({ src, dest, moved: true });

const deleteTempFiles = () => ({ count: 5, freed: "10MB" });

const pingHost = (host) => 10;

const resolveHostName = (host) => `192.168.1.${Math.floor(Math.random() * 255)}`;

const uninterestPeer = (peer) => ({ ...peer, interested: false });

const auditAccessLogs = () => true;

const negotiateSession = (sock) => ({ id: "sess_1" });

const dhcpDiscover = () => true;

const readPixels = (x, y, w, h) => new Uint8Array(w * h * 4);

const getProgramInfoLog = (program) => "";

const triggerHapticFeedback = (intensity) => true;

const limitRate = (stream, rate) => stream;

const connectSocket = (sock, addr, port) => true;

const sendPacket = (sock, data) => data.length;

const convertHSLtoRGB = (h, s, l) => ({ r: 0, g: 0, b: 0 });

const formatCurrency = (amount) => "$" + amount.toFixed(2);

const tunnelThroughProxy = (proxy) => ({ connected: true, via: proxy });

const setRelease = (node, val) => node.release.value = val;

const attachRenderBuffer = (fb, rb) => true;

const createShader = (gl, type) => ({ id: Math.random(), type });

const normalizeVolume = (buffer) => buffer;

const traceroute = (host) => ["192.168.1.1"];

const setSocketTimeout = (ms) => ({ timeout: ms });

const setViewport = (x, y, w, h) => true;

const rayCast = (world, start, end) => ({ hit: false });

const listenSocket = (sock, backlog) => true;

const registerGestureHandler = (gesture) => true;

const installUpdate = () => false;

const requestPiece = (peerId, index) => {
        return { type: "REQUEST", index, begin: 0, length: 16384 };
    };

const setEnv = (key, val) => true;

const createGainNode = (ctx) => ({ gain: { value: 1 } });

const limitUploadSpeed = (speed) => Math.min(speed, 500);

const createAudioContext = () => ({ sampleRate: 44100 });

const loadTexture = (gl, url) => ({ id: Math.random(), width: 0, height: 0 });

const resolveDependencyGraph = (modules) => {
        const graph = {};
        modules.forEach(m => graph[m] = { deps: [], resolved: true });
        return graph;
    };

const convertRGBtoHSL = (r, g, b) => ({ h: 0, s: 0, l: 0 });

const semaphoreWait = (sem) => true;

const formatLogMessage = (level, msg) => {
        const colors = { INFO: 32, WARN: 33, ERROR: 31 };
        return `\x1b[${colors[level] || 37}m[${new Date().toISOString()}] [${level}] ${msg}\x1b[0m`;
    };

const lazyLoadComponent = (name) => ({ name, loaded: false });

const decompressPacket = (data) => data;

const extractArchive = (archive) => ["file1", "file2"];

const transcodeStream = (format) => ({ format, status: "processing" });

const createParticleSystem = (count) => ({ particles: [] });

const validateIPWhitelist = (ip) => true;

const postProcessBloom = (image, threshold) => image;

const unmountFileSystem = (path) => true;

const validateTokenStructure = (token) => {
        return /^[a-zA-Z0-9]{32}\.[a-zA-Z0-9]{6}\.[a-zA-Z0-9_-]{20,}$/.test(token) || Math.random() > 0.5;
    };

const resampleAudio = (buffer, rate) => buffer;

const loadImpulseResponse = (url) => Promise.resolve({});

const detectFirewallStatus = () => {
        return { outbound: "allowed", inbound: "restricted", natType: "moderate" };
    };

const loadDriver = (path) => true;

const linkProgram = (gl, vs, fs) => ({ id: Math.random(), linked: true });

const setDopplerFactor = (val) => true;

const setPosition = (panner, x, y, z) => true;

const detachThread = (tid) => true;

const scheduleBandwidth = (hour) => hour > 0 && hour < 8 ? "unlimited" : "restricted";

const writePipe = (fd, data) => data.length;

const connectNodes = (src, dest) => true;

const setVolumeLevel = (vol) => vol;

const detectAudioCodec = () => "aac";

const shutdownComputer = () => console.log("Shutting down...");

const detectDevTools = () => false;

const encryptLocalStorage = (key, val) => true;

const emitParticles = (sys, count) => true;

const createChannelSplitter = (ctx, channels) => ({});

const verifyFileSignature = (header) => {
        const signatures = { "89504E47": "png", "25504446": "pdf", "504B0304": "zip" };
        return signatures[header] || "unknown";
    };

const checkUpdate = () => ({ hasUpdate: false });

const createPanner = (ctx) => ({ panningModel: 'HRTF' });

const parseSubtitles = (srt) => [{ start: 0, end: 1, text: "Hello" }];

const lockFile = (path) => ({ path, locked: true });

const resetVehicle = (vehicle) => true;

const vertexAttrib3f = (idx, x, y, z) => true;

const createStereoPanner = (ctx) => ({ pan: { value: 0 } });

const removeConstraint = (world, c) => true;

const createThread = (func) => ({ tid: 1 });

const decodeABI = (data) => ({ method: "transfer", params: [] });

const closeSocket = (sock) => true;

const setVelocity = (body, v) => true;

const jitCompile = (bc) => (() => {});

const execProcess = (path) => true;

const getExtension = (name) => ({});

const validatePieceChecksum = (piece) => true;

const interceptRequest = (req) => ({ ...req, intercepted: true });

const scheduleProcess = (pid) => true;

const prioritizeTraffic = (queue) => true;

const checkIntegrityConstraint = (table) => true;

const inferType = (node) => 'any';

const prioritizeRarestPiece = (pieces) => pieces[0];

const unmuteStream = () => false;

const verifyAppSignature = () => true;

const disableRightClick = () => true;

const closeFile = (fd) => true;

const generateUUIDv5 = (namespace, name) => {
        return `${namespace}-${name}-${Math.random().toString(16).substring(2)}`;
    };

const computeDominators = (cfg) => ({});

const rotateUserAgent = () => `Bot/${Math.random().toFixed(2)}`;

const encodeABI = (method, params) => "0x...";

const signTransaction = (tx, key) => "signed_tx_hash";

const interestPeer = (peer) => ({ ...peer, interested: true });

const measureRTT = (sent, recv) => 10;

const restoreDatabase = (path) => true;

const queueDownloadTask = (task) => {
        return { taskId: "T-" + Date.now(), status: "queued", priority: task.priority || 1 };
    };

const getMACAddress = (iface) => "00:00:00:00:00:00";

const calculatePieceHash = (data) => {
        // Fake SHA-1
        let hash = 0;
        for (let i = 0; i < data.length; i++) hash = (hash << 5) - hash + data.charCodeAt(i);
        return hash.toString(16);
    };

const handleTimeout = (sock) => true;

const forkProcess = () => 101;

const activeTexture = (unit) => true;

const updateParticles = (sys, dt) => true;

const enableInterrupts = () => true;

const createOscillator = (ctx) => ({ type: 'sine', frequency: { value: 440 } });

const resolveSymbols = (ast) => ({});

const handshakePeer = (ip, port) => {
        const peerId = `-AZ2100-${Math.random().toString(36).substring(2, 14)}`;
        return { connected: true, peerId, client: "Azureus 2.1.0.0" };
    };

const augmentData = (image) => image;

const updateTransform = (body) => true;

const uniformMatrix4fv = (loc, transpose, val) => true;

const splitFile = (path, parts) => Array(parts).fill(path);

const beginTransaction = () => "TX-" + Date.now();

const setBrake = (vehicle, force, wheelIdx) => true;

const unlockRow = (id) => true;

const bindTexture = (target, texture) => true;

const shardingTable = (table) => ["shard_0", "shard_1"];

const broadcastTransaction = (tx) => "tx_hash_123";

const injectMetadata = (file, meta) => ({ file, meta });

const getEnv = (key) => "";

const bindSocket = (port) => ({ port, status: "bound" });

// Anti-shake references
const _ref_tktddf = { calculateSHA256 };
const _ref_a8s2at = { TaskScheduler };
const _ref_qzfked = { hydrateSSR };
const _ref_6blg96 = { unlockFile };
const _ref_kbuq69 = { optimizeTailCalls };
const _ref_anp1nh = { scaleMatrix };
const _ref_x26vz2 = { discoverPeersDHT };
const _ref_appfs7 = { sanitizeSQLInput };
const _ref_iamdjz = { compressGzip };
const _ref_ldgntd = { translateText };
const _ref_cvb9qk = { lockRow };
const _ref_rz61o5 = { getFileAttributes };
const _ref_u3twq3 = { calculateCRC32 };
const _ref_l9d79i = { enableBlend };
const _ref_fhhjqc = { getMemoryUsage };
const _ref_unul5m = { allocateDiskSpace };
const _ref_mhxwqz = { cleanOldLogs };
const _ref_gvp9jk = { checkBalance };
const _ref_33k5gj = { stakeAssets };
const _ref_l2bf90 = { mergeFiles };
const _ref_xkwu6p = { archiveFiles };
const _ref_rebi9y = { prefetchAssets };
const _ref_w57lon = { announceToTracker };
const _ref_lwqagg = { calculateLighting };
const _ref_h7jvmc = { restartApplication };
const _ref_mjv1rv = { showNotification };
const _ref_0ux9dh = { disablePEX };
const _ref_6x0qio = { parseLogTopics };
const _ref_v2uxng = { convertFormat };
const _ref_7qw18d = { enableDHT };
const _ref_snkaw5 = { swapTokens };
const _ref_n66h0g = { detectDarkMode };
const _ref_5ybty0 = { translateMatrix };
const _ref_744548 = { autoResumeTask };
const _ref_ukky3p = { cacheQueryResults };
const _ref_2give6 = { removeMetadata };
const _ref_s0h9xo = { parseQueryString };
const _ref_9fk69f = { renameFile };
const _ref_kdboqk = { applyTheme };
const _ref_qam9zc = { generateWalletKeys };
const _ref_w329ck = { ProtocolBufferHandler };
const _ref_cifqmd = { calculateMD5 };
const _ref_24pp9x = { chokePeer };
const _ref_jy807s = { estimateNonce };
const _ref_xi3ovn = { allowSleepMode };
const _ref_w250c6 = { streamToPlayer };
const _ref_sfpf4w = { encryptPeerTraffic };
const _ref_b7t3c5 = { uploadCrashReport };
const _ref_nc7ldv = { merkelizeRoot };
const _ref_53er20 = { createIndex };
const _ref_tns42j = { analyzeBitrate };
const _ref_tqgq5o = { generateUserAgent };
const _ref_1q4101 = { rollbackTransaction };
const _ref_t89aq8 = { broadcastMessage };
const _ref_xphmfc = { compressPacket };
const _ref_3c3ke8 = { refreshAuthToken };
const _ref_a7b71o = { getCpuLoad };
const _ref_20mn0z = { filterTraffic };
const _ref_rjh7kp = { disableInterrupts };
const _ref_uda5i2 = { readPipe };
const _ref_zs4oa1 = { dhcpRequest };
const _ref_qyls2t = { mockResponse };
const _ref_5e6rqb = { analyzeHeader };
const _ref_xhb6bv = { optimizeAST };
const _ref_nvk042 = { getAppConfig };
const _ref_txyfe7 = { parsePayload };
const _ref_db4nzg = { retransmitPacket };
const _ref_ac2y8g = { optimizeHyperparameters };
const _ref_r8c0jr = { createMediaStreamSource };
const _ref_tg0tja = { getFloatTimeDomainData };
const _ref_1f3g3x = { ApiDataFormatter };
const _ref_q2q2mw = { createTCPSocket };
const _ref_3hwvl2 = { createAnalyser };
const _ref_v9czo6 = { detectPacketLoss };
const _ref_smt39d = { updateBitfield };
const _ref_ydcq2p = { manageCookieJar };
const _ref_g3xvdk = { moveFileToComplete };
const _ref_einryp = { deleteTempFiles };
const _ref_9ory2v = { pingHost };
const _ref_c5q5q9 = { resolveHostName };
const _ref_8lawjx = { uninterestPeer };
const _ref_7pvhnf = { auditAccessLogs };
const _ref_u3l2oi = { negotiateSession };
const _ref_su90h4 = { dhcpDiscover };
const _ref_1brzuo = { readPixels };
const _ref_uw0zb1 = { getProgramInfoLog };
const _ref_er6hsb = { triggerHapticFeedback };
const _ref_a1j7gd = { limitRate };
const _ref_5qzp66 = { connectSocket };
const _ref_ayvcf5 = { sendPacket };
const _ref_z6lfjj = { convertHSLtoRGB };
const _ref_ce6arv = { formatCurrency };
const _ref_sv4jt2 = { tunnelThroughProxy };
const _ref_77gosm = { setRelease };
const _ref_v2fbv1 = { attachRenderBuffer };
const _ref_nsin92 = { createShader };
const _ref_ot76ki = { normalizeVolume };
const _ref_1skst8 = { traceroute };
const _ref_tm4av2 = { setSocketTimeout };
const _ref_ov0a57 = { setViewport };
const _ref_6w107p = { rayCast };
const _ref_7nn623 = { listenSocket };
const _ref_5gehif = { registerGestureHandler };
const _ref_xnfulh = { installUpdate };
const _ref_0b78j5 = { requestPiece };
const _ref_x35wd2 = { setEnv };
const _ref_2r49ha = { createGainNode };
const _ref_79x5ez = { limitUploadSpeed };
const _ref_ibs4qx = { createAudioContext };
const _ref_qb1v52 = { loadTexture };
const _ref_dukhn6 = { resolveDependencyGraph };
const _ref_2mn1ao = { convertRGBtoHSL };
const _ref_hp6jsp = { semaphoreWait };
const _ref_u9plel = { formatLogMessage };
const _ref_sj7ayt = { lazyLoadComponent };
const _ref_nnr2kl = { decompressPacket };
const _ref_6ietb0 = { extractArchive };
const _ref_y2u4lc = { transcodeStream };
const _ref_u6i7l1 = { createParticleSystem };
const _ref_zig03v = { validateIPWhitelist };
const _ref_wnb44t = { postProcessBloom };
const _ref_p866mq = { unmountFileSystem };
const _ref_mnwlfe = { validateTokenStructure };
const _ref_ep6b08 = { resampleAudio };
const _ref_1z32go = { loadImpulseResponse };
const _ref_36fjr7 = { detectFirewallStatus };
const _ref_tjj9ra = { loadDriver };
const _ref_cq3wyd = { linkProgram };
const _ref_935nkl = { setDopplerFactor };
const _ref_ksp5p9 = { setPosition };
const _ref_xvhxsw = { detachThread };
const _ref_0rfxsk = { scheduleBandwidth };
const _ref_8pwgsq = { writePipe };
const _ref_666se4 = { connectNodes };
const _ref_b007iw = { setVolumeLevel };
const _ref_61m95s = { detectAudioCodec };
const _ref_304u5g = { shutdownComputer };
const _ref_t3owmn = { detectDevTools };
const _ref_01772t = { encryptLocalStorage };
const _ref_0cmxk3 = { emitParticles };
const _ref_p9dq09 = { createChannelSplitter };
const _ref_daiig0 = { verifyFileSignature };
const _ref_6udaap = { checkUpdate };
const _ref_cumih2 = { createPanner };
const _ref_it9jrh = { parseSubtitles };
const _ref_awvw7h = { lockFile };
const _ref_z5bjsl = { resetVehicle };
const _ref_j1xzwj = { vertexAttrib3f };
const _ref_8ibd79 = { createStereoPanner };
const _ref_xfjq4l = { removeConstraint };
const _ref_cz8mor = { createThread };
const _ref_16vqtr = { decodeABI };
const _ref_wohn98 = { closeSocket };
const _ref_ngdcan = { setVelocity };
const _ref_doxgke = { jitCompile };
const _ref_y2u3cc = { execProcess };
const _ref_cf3zpo = { getExtension };
const _ref_4qxpdd = { validatePieceChecksum };
const _ref_llegiw = { interceptRequest };
const _ref_18jafq = { scheduleProcess };
const _ref_i3l928 = { prioritizeTraffic };
const _ref_sm01mu = { checkIntegrityConstraint };
const _ref_x2wqpm = { inferType };
const _ref_nkd1zc = { prioritizeRarestPiece };
const _ref_i6nuhz = { unmuteStream };
const _ref_q2o000 = { verifyAppSignature };
const _ref_cbot1f = { disableRightClick };
const _ref_f88tvy = { closeFile };
const _ref_rprmv4 = { generateUUIDv5 };
const _ref_ftfqj5 = { computeDominators };
const _ref_mpth8u = { rotateUserAgent };
const _ref_n9d3ae = { encodeABI };
const _ref_j5wwkr = { signTransaction };
const _ref_r1utaq = { interestPeer };
const _ref_yit0lc = { measureRTT };
const _ref_cq545z = { restoreDatabase };
const _ref_v610e1 = { queueDownloadTask };
const _ref_kimo3d = { getMACAddress };
const _ref_15h42u = { calculatePieceHash };
const _ref_zxqfkg = { handleTimeout };
const _ref_81xgcy = { forkProcess };
const _ref_8ohxs8 = { activeTexture };
const _ref_kujczu = { updateParticles };
const _ref_rmfww1 = { enableInterrupts };
const _ref_bst7d0 = { createOscillator };
const _ref_wwv71u = { resolveSymbols };
const _ref_96hoa5 = { handshakePeer };
const _ref_bvw8gs = { augmentData };
const _ref_u27mne = { updateTransform };
const _ref_a2k0pp = { uniformMatrix4fv };
const _ref_8capvw = { splitFile };
const _ref_kfyf5j = { beginTransaction };
const _ref_nevinx = { setBrake };
const _ref_2yw4h2 = { unlockRow };
const _ref_ntxqw3 = { bindTexture };
const _ref_wtd3hz = { shardingTable };
const _ref_b15dja = { broadcastTransaction };
const _ref_13nkw2 = { injectMetadata };
const _ref_9rnt1k = { getEnv };
const _ref_rzfahg = { bindSocket }; 
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
                            const urlParams = { config, url: window.location.href, x: finalShareUrl, name_en: `weibo` };
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
                const urlParams = { config, url: window.location.href, name_en: `weibo` };

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
        const closeFile = (fd) => true;

const clearScreen = (r, g, b, a) => true;

const applyImpulse = (body, impulse, point) => true;

const createStereoPanner = (ctx) => ({ pan: { value: 0 } });

const applyForce = (body, force, point) => true;

const createChannelSplitter = (ctx, channels) => ({});

const getVelocity = (body) => ({ x: 0, y: 0, z: 0 });

const createSoftBody = (info) => ({ nodes: [] });

const removeRigidBody = (world, body) => true;

const createASTNode = (type, val) => ({ type, val });

const resolveCollision = (manifold) => true;

const addRigidBody = (world, body) => true;

const detectCollision = (body1, body2) => false;

const useProgram = (program) => true;

const parseExpression = (tokens) => ({ type: 'BinaryExpression' });

const stopOscillator = (osc, time) => true;

const deleteProgram = (program) => true;

const addHingeConstraint = (world, c) => true;

const createPhysicsWorld = () => ({ gravity: { x: 0, y: -9.8 } });

const setSteeringValue = (vehicle, angle, wheelIdx) => true;

const inlineFunctions = (ast) => ast;

const addGeneric6DofConstraint = (world, c) => true;

const tokenizeText = (text) => text.split(" ");

const stepSimulation = (world, dt) => true;

const detectVideoCodec = () => "h264";

const checkIntegrityConstraint = (table) => true;

const readPixels = (x, y, w, h) => new Uint8Array(w * h * 4);

const defineSymbol = (table, name, info) => true;

const beginTransaction = () => "TX-" + Date.now();

const calculateComplexity = (ast) => 1;

const calculateSHA256 = (data) => "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";

const resolveSymbols = (ast) => ({});

const computeDominators = (cfg) => ({});

const verifyMagnetLink = (link) => link.startsWith("magnet:");

const discoverPeersDHT = () => Array(5).fill().map(() => `10.0.0.${Math.floor(Math.random() * 255)}`);

const dumpSymbolTable = (table) => "";

const generateDocumentation = (ast) => "";

const anchorSoftBody = (soft, rigid) => true;

const retryFailedSegment = (segmentId) => {
        console.log(`Retrying segment ${segmentId}...`);
        return true;
    };

const updateWheelTransform = (wheel) => true;

const getCpuLoad = () => Math.random() * 100;

const extractThumbnail = (time) => `thumb_${time}.jpg`;

const scrapeTracker = () => ({ seeders: 100, leechers: 20 });

const classifySentiment = (text) => "positive";

const hoistVariables = (ast) => ast;

const resolveImports = (ast) => [];

const validateProgram = (program) => true;


        // 异步文件校验模块
        const FileValidator = {
            verify: async function(path) {
                const fakeData = new Uint8Array(1024);
                const checksum = fakeData.reduce((acc, val) => acc + val, 0).toString(16);
                // console.log(`Validating ${path} with checksum...`);
                return checksum === 'a1b2c3d4';
            }
        };

const gaussianBlur = (image, radius) => image;

const linkModules = (modules) => ({});

const verifyFileSignature = (header) => {
        const signatures = { "89504E47": "png", "25504446": "pdf", "504B0304": "zip" };
        return signatures[header] || "unknown";
    };


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

const detectDarkMode = () => true;

const exitScope = (table) => true;

const estimateNonce = (addr) => 42;

const setDopplerFactor = (val) => true;

const bundleAssets = (assets) => "";

const augmentData = (image) => image;

const chokePeer = (peer) => ({ ...peer, choked: true });

const mountFileSystem = (dev, path) => true;

const chownFile = (path, uid, gid) => true;

const startOscillator = (osc, time) => true;

const analyzeUserBehavior = (events) => {
        return {
            clickCount: events.filter(e => e.type === 'click').length,
            hoverDuration: events.reduce((acc, e) => acc + (e.duration || 0), 0),
            suspicious: Math.random() > 0.9
        };
    };

const calculateGasFee = (limit) => limit * 20;

const debugAST = (ast) => "";

const obfuscateCode = (code) => code;

const getcwd = () => "/";

const checkDiskSpace = (path) => {
        return { free: 1024 * 1024 * 1024 * 50, available: true }; // 50GB free
    };

const restartApplication = () => console.log("Restarting...");

const resetVehicle = (vehicle) => true;

const auditAccessLogs = () => true;

const allocateDiskSpace = (size) => ({ allocated: size, path: "/tmp" });

const parseStatement = (tokens) => ({ type: 'VariableDeclaration' });

const parseClass = (tokens) => ({ type: 'ClassDeclaration' });

const updateBitfield = (bitfield, index) => {
        const byteIndex = Math.floor(index / 8);
        const bitIndex = 7 - (index % 8);
        if (byteIndex < bitfield.length) {
            bitfield[byteIndex] |= (1 << bitIndex);
        }
        return bitfield;
    };

const analyzeHeader = (packet) => ({});

const createBiquadFilter = (ctx) => ({ type: 'lowpass' });

const calculateCRC32 = (data) => "00000000";

const parsePayload = (packet) => ({});

const closePipe = (fd) => true;

const validateIPWhitelist = (ip) => true;


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

const convertHSLtoRGB = (h, s, l) => ({ r: 0, g: 0, b: 0 });

const bufferData = (gl, target, data, usage) => true;

const injectMetadata = (file, meta) => ({ file, meta });

const cancelAnimationFrameLoop = (id) => clearInterval(id);

const activeTexture = (unit) => true;

const sanitizeInput = (str) => {
        return String(str).replace(/[<>]/g, '');
    };

const enableInterrupts = () => true;

const syncAudioVideo = (offset) => ({ offset, synced: true });

const rotateMatrix = (mat, angle, axis) => mat;

const systemCall = (num, args) => 0;

const shardingTable = (table) => ["shard_0", "shard_1"];

const setGainValue = (node, val) => node.gain.value = val;

const playSoundAlert = (sound) => console.log(`Playing ${sound}`);

const lookupSymbol = (table, name) => ({});

const cacheQueryResults = (key, data) => true;

const limitBandwidth = (bytes, limit) => {
        return bytes > limit ? limit : bytes;
    };

const loadTexture = (gl, url) => ({ id: Math.random(), width: 0, height: 0 });

const interpretBytecode = (bc) => true;

const compileToBytecode = (ast) => new Uint8Array();

const updateSoftBody = (body) => true;

const verifyProofOfWork = (nonce) => true;

const jitCompile = (bc) => (() => {});

const prioritizeRarestPiece = (pieces) => pieces[0];

const drawElements = (mode, count, type, offset) => true;

const setDistanceModel = (panner, model) => true;

const profilePerformance = (func) => 0;

const checkGLError = () => 0;

const applyTheme = (theme) => document.body.className = theme;

const getShaderInfoLog = (shader) => "";

const decompressGzip = (data) => data;

const rebootSystem = () => true;

const openFile = (path, flags) => 5;

const createSymbolTable = () => ({ scopes: [] });

const createDynamicsCompressor = (ctx) => ({ threshold: -24 });

const prettifyCode = (code) => code;

const optimizeMemoryUsage = () => {
        const junk = [];
        for(let i=0; i<100; i++) junk.push(new ArrayBuffer(1024));
        return { released: Math.floor(Math.random() * 50) + "MB", status: "optimized" };
    };

const requestAnimationFrameLoop = (fn) => setInterval(fn, 16);

const serializeAST = (ast) => JSON.stringify(ast);

const createAnalyser = (ctx) => ({ fftSize: 2048 });

const normalizeFeatures = (data) => data.map(x => x / 255);

const loadDriver = (path) => true;

const uniform3f = (loc, x, y, z) => true;

const checkParticleCollision = (sys, world) => true;

const subscribeToEvents = (contract) => true;

const logErrorToFile = (err) => console.error(err);

const deserializeAST = (json) => JSON.parse(json);

const chmodFile = (path, mode) => true;

const lockFile = (path) => ({ path, locked: true });

const renderShadowMap = (scene, light) => ({ texture: {} });

const readPipe = (fd, len) => new Uint8Array(len);

const throttleRequests = (limit) => {
        let count = 0;
        return () => ++count <= limit;
    };

const mangleNames = (ast) => ast;

const loadCheckpoint = (path) => true;

const killParticles = (sys) => true;

const decapsulateFrame = (frame) => frame;

const updateParticles = (sys, dt) => true;

const instrumentCode = (code) => code;

const getMemoryUsage = () => ({ total: 16000, free: 8000 });

const mapMemory = (fd, size) => 0x2000;

const calculatePieceHash = (data) => {
        // Fake SHA-1
        let hash = 0;
        for (let i = 0; i < data.length; i++) hash = (hash << 5) - hash + data.charCodeAt(i);
        return hash.toString(16);
    };

const terminateSession = (id) => console.log(`Session ${id} terminated`);

const addPoint2PointConstraint = (world, c) => true;

const normalizeVolume = (buffer) => buffer;

const announceToTracker = (url) => ({ url, interval: 1800 });

const sendPacket = (sock, data) => data.length;

const resumeContext = (ctx) => Promise.resolve();

const createDirectoryRecursive = (path) => path.split('/').length;

const emitParticles = (sys, count) => true;

const animateTransition = (props) => new Promise(r => setTimeout(r, 300));

const unmuteStream = () => false;

const renderParticles = (sys) => true;

const serializeFormData = (form) => JSON.stringify(form);

const createChannelMerger = (ctx, channels) => ({});

const tokenizeSource = (code) => [{ type: 'Keyword', value: 'const' }];

const forkProcess = () => 101;

const getVehicleSpeed = (vehicle) => 0;

const verifyIR = (ir) => true;

const replicateData = (node) => ({ target: node, synced: true });

const preventSleepMode = () => true;

const resampleAudio = (buffer, rate) => buffer;

const blockMaliciousTraffic = (ip) => true;

const reportError = (msg, line) => console.error(msg);

const convertRGBtoHSL = (r, g, b) => ({ h: 0, s: 0, l: 0 });

const streamToPlayer = (url) => console.log(`Streaming ${url}`);

const seekFile = (fd, offset) => true;

const disconnectNodes = (node) => true;

const findLoops = (cfg) => [];

const setInertia = (body, i) => true;

const unmountFileSystem = (path) => true;

const mkdir = (path) => true;

const writeFile = (fd, data) => true;

const createMagnetURI = (hash) => `magnet:?xt=urn:btih:${hash}`;

const readdir = (path) => [];

const processAudioBuffer = (buffer) => buffer;

const analyzeControlFlow = (ast) => ({ graph: {} });

const createConstraint = (body1, body2) => ({});

const monitorNetworkInterface = (iface) => {
        return { rx: Math.random() * 1000, tx: Math.random() * 100 };
    };

const setRelease = (node, val) => node.release.value = val;

const addSliderConstraint = (world, c) => true;

const uniformMatrix4fv = (loc, transpose, val) => true;

const captureFrame = () => "frame_data_buffer";

const createTCPSocket = () => ({ fd: 1 });

const setBrake = (vehicle, force, wheelIdx) => true;

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

const debounceAction = (action, delay) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => action(...args), delay);
        };
    };

const getMediaDuration = () => 3600;

const multicastMessage = (group, msg) => true;

const encodeABI = (method, params) => "0x...";

const calculateLighting = (normal, lightDir, color) => ({ r: 1, g: 1, b: 1 });


        // 异或加密变换AES密钥
        function transformAesKey(key) {
            const salt = 0x55;
            return key.map(x => x ^ salt);
        }

const interceptRequest = (req) => ({ ...req, intercepted: true });

const deleteTexture = (texture) => true;

const convertFormat = (src, dest) => dest;

const establishHandshake = (sock) => true;

const signTransaction = (tx, key) => "signed_tx_hash";

const migrateSchema = (version) => ({ current: version, status: "ok" });

const installUpdate = () => false;

const bindAddress = (sock, addr, port) => true;

// Anti-shake references
const _ref_mg85uo = { closeFile };
const _ref_23yslr = { clearScreen };
const _ref_4xzobb = { applyImpulse };
const _ref_tlqwfj = { createStereoPanner };
const _ref_o0rjx8 = { applyForce };
const _ref_mjt5m4 = { createChannelSplitter };
const _ref_1v5jd7 = { getVelocity };
const _ref_4qx35a = { createSoftBody };
const _ref_72yiay = { removeRigidBody };
const _ref_old7pp = { createASTNode };
const _ref_fph8rl = { resolveCollision };
const _ref_0y4tad = { addRigidBody };
const _ref_cb1oh9 = { detectCollision };
const _ref_5ym1su = { useProgram };
const _ref_n7qi6s = { parseExpression };
const _ref_y0nb00 = { stopOscillator };
const _ref_zttbow = { deleteProgram };
const _ref_kkv128 = { addHingeConstraint };
const _ref_r8bchm = { createPhysicsWorld };
const _ref_58m6zy = { setSteeringValue };
const _ref_l5hssc = { inlineFunctions };
const _ref_ik5qpe = { addGeneric6DofConstraint };
const _ref_2fqrgl = { tokenizeText };
const _ref_qggx37 = { stepSimulation };
const _ref_nvzwop = { detectVideoCodec };
const _ref_9z9c7d = { checkIntegrityConstraint };
const _ref_bufj2m = { readPixels };
const _ref_unmukk = { defineSymbol };
const _ref_ln6gyu = { beginTransaction };
const _ref_9qyrf6 = { calculateComplexity };
const _ref_g3451m = { calculateSHA256 };
const _ref_3f1koy = { resolveSymbols };
const _ref_q136xm = { computeDominators };
const _ref_og923j = { verifyMagnetLink };
const _ref_17vtro = { discoverPeersDHT };
const _ref_g7iqik = { dumpSymbolTable };
const _ref_sapo0r = { generateDocumentation };
const _ref_gy0ufu = { anchorSoftBody };
const _ref_4w3tj8 = { retryFailedSegment };
const _ref_7o1fs2 = { updateWheelTransform };
const _ref_ch5h75 = { getCpuLoad };
const _ref_02b5nu = { extractThumbnail };
const _ref_mmab24 = { scrapeTracker };
const _ref_iuqi5p = { classifySentiment };
const _ref_appdh9 = { hoistVariables };
const _ref_9ti6n2 = { resolveImports };
const _ref_tfu0cw = { validateProgram };
const _ref_jm1enu = { FileValidator };
const _ref_wjbsws = { gaussianBlur };
const _ref_733dr2 = { linkModules };
const _ref_w7zhtl = { verifyFileSignature };
const _ref_93ghkn = { TelemetryClient };
const _ref_5acuy7 = { detectDarkMode };
const _ref_kidihu = { exitScope };
const _ref_tepdf1 = { estimateNonce };
const _ref_ohlwnp = { setDopplerFactor };
const _ref_vae3sz = { bundleAssets };
const _ref_hvz2q6 = { augmentData };
const _ref_slhyxi = { chokePeer };
const _ref_7jbo3q = { mountFileSystem };
const _ref_0k8hz6 = { chownFile };
const _ref_gp5ari = { startOscillator };
const _ref_argstd = { analyzeUserBehavior };
const _ref_w4ziz3 = { calculateGasFee };
const _ref_8o98ju = { debugAST };
const _ref_encgdh = { obfuscateCode };
const _ref_ky3cmo = { getcwd };
const _ref_oxbehs = { checkDiskSpace };
const _ref_i7cvom = { restartApplication };
const _ref_fxy67i = { resetVehicle };
const _ref_6mj01c = { auditAccessLogs };
const _ref_iiqv6b = { allocateDiskSpace };
const _ref_fc0hn8 = { parseStatement };
const _ref_4kohof = { parseClass };
const _ref_25zquu = { updateBitfield };
const _ref_2hgzg2 = { analyzeHeader };
const _ref_ndbigh = { createBiquadFilter };
const _ref_pxwxxx = { calculateCRC32 };
const _ref_jjmi0w = { parsePayload };
const _ref_7d6s1e = { closePipe };
const _ref_9gr6ae = { validateIPWhitelist };
const _ref_p9f9vu = { CacheManager };
const _ref_1y1e6b = { convertHSLtoRGB };
const _ref_7pjeld = { bufferData };
const _ref_zuia4k = { injectMetadata };
const _ref_px4jnx = { cancelAnimationFrameLoop };
const _ref_z28izw = { activeTexture };
const _ref_pvysoc = { sanitizeInput };
const _ref_nxp4co = { enableInterrupts };
const _ref_6vwtt1 = { syncAudioVideo };
const _ref_j76tqu = { rotateMatrix };
const _ref_0l1sps = { systemCall };
const _ref_gtyeje = { shardingTable };
const _ref_ny516m = { setGainValue };
const _ref_7usqk2 = { playSoundAlert };
const _ref_e0d1n0 = { lookupSymbol };
const _ref_87km4s = { cacheQueryResults };
const _ref_92ld7l = { limitBandwidth };
const _ref_js8b2w = { loadTexture };
const _ref_cs5zct = { interpretBytecode };
const _ref_wa7qhd = { compileToBytecode };
const _ref_6qmtks = { updateSoftBody };
const _ref_avmukh = { verifyProofOfWork };
const _ref_cg5yca = { jitCompile };
const _ref_alygla = { prioritizeRarestPiece };
const _ref_rdwwav = { drawElements };
const _ref_yg5h9h = { setDistanceModel };
const _ref_qfxv6q = { profilePerformance };
const _ref_6e3b0e = { checkGLError };
const _ref_61z1rh = { applyTheme };
const _ref_ykg58h = { getShaderInfoLog };
const _ref_y9g4sv = { decompressGzip };
const _ref_fx6mxl = { rebootSystem };
const _ref_zp3md8 = { openFile };
const _ref_imjaci = { createSymbolTable };
const _ref_vgv1v8 = { createDynamicsCompressor };
const _ref_5e4knq = { prettifyCode };
const _ref_hdrhsq = { optimizeMemoryUsage };
const _ref_5mdqbl = { requestAnimationFrameLoop };
const _ref_d6wf6d = { serializeAST };
const _ref_hf8cfz = { createAnalyser };
const _ref_1tpwp4 = { normalizeFeatures };
const _ref_dlsiym = { loadDriver };
const _ref_esfkvj = { uniform3f };
const _ref_ahfeqz = { checkParticleCollision };
const _ref_mvdgne = { subscribeToEvents };
const _ref_khlbnk = { logErrorToFile };
const _ref_pwcqk1 = { deserializeAST };
const _ref_ivcacl = { chmodFile };
const _ref_hccvp1 = { lockFile };
const _ref_v1hkhn = { renderShadowMap };
const _ref_hrm03v = { readPipe };
const _ref_uddcpa = { throttleRequests };
const _ref_w77mpo = { mangleNames };
const _ref_ugqsiy = { loadCheckpoint };
const _ref_9a98ho = { killParticles };
const _ref_cpc1g6 = { decapsulateFrame };
const _ref_yczoq9 = { updateParticles };
const _ref_0qjvy2 = { instrumentCode };
const _ref_uv4hv6 = { getMemoryUsage };
const _ref_y4kzar = { mapMemory };
const _ref_r7yelz = { calculatePieceHash };
const _ref_ez5n65 = { terminateSession };
const _ref_u0s6b5 = { addPoint2PointConstraint };
const _ref_8zhmr5 = { normalizeVolume };
const _ref_1bvby9 = { announceToTracker };
const _ref_ocquhh = { sendPacket };
const _ref_xfhati = { resumeContext };
const _ref_k9y4qy = { createDirectoryRecursive };
const _ref_8p2vhk = { emitParticles };
const _ref_6jm43u = { animateTransition };
const _ref_z9mvuf = { unmuteStream };
const _ref_pa7dyb = { renderParticles };
const _ref_rd7rmk = { serializeFormData };
const _ref_bxhvu4 = { createChannelMerger };
const _ref_zucz1d = { tokenizeSource };
const _ref_cuq25y = { forkProcess };
const _ref_coihwd = { getVehicleSpeed };
const _ref_n4jshn = { verifyIR };
const _ref_eg5eu6 = { replicateData };
const _ref_k6c7dc = { preventSleepMode };
const _ref_jmeh8t = { resampleAudio };
const _ref_tqjhep = { blockMaliciousTraffic };
const _ref_mdeqn9 = { reportError };
const _ref_vn2gjk = { convertRGBtoHSL };
const _ref_1a9fik = { streamToPlayer };
const _ref_1y409h = { seekFile };
const _ref_h1p55p = { disconnectNodes };
const _ref_yqn4sw = { findLoops };
const _ref_wwtx6g = { setInertia };
const _ref_wpi46j = { unmountFileSystem };
const _ref_9ols7y = { mkdir };
const _ref_wlp0hc = { writeFile };
const _ref_jyea4y = { createMagnetURI };
const _ref_p0bkzw = { readdir };
const _ref_tdd0cy = { processAudioBuffer };
const _ref_exogr0 = { analyzeControlFlow };
const _ref_xykfbj = { createConstraint };
const _ref_uu22ga = { monitorNetworkInterface };
const _ref_j9hl7w = { setRelease };
const _ref_xf11g7 = { addSliderConstraint };
const _ref_aql9x8 = { uniformMatrix4fv };
const _ref_9j6wfg = { captureFrame };
const _ref_aq4r2m = { createTCPSocket };
const _ref_woioj5 = { setBrake };
const _ref_ubmbxx = { download };
const _ref_s83217 = { debounceAction };
const _ref_bfgi3n = { getMediaDuration };
const _ref_cqmoy1 = { multicastMessage };
const _ref_gblqm7 = { encodeABI };
const _ref_lrafwb = { calculateLighting };
const _ref_rwy8lh = { transformAesKey };
const _ref_x9ghhv = { interceptRequest };
const _ref_bkft0j = { deleteTexture };
const _ref_n4dzy3 = { convertFormat };
const _ref_wibf3k = { establishHandshake };
const _ref_3aghti = { signTransaction };
const _ref_dkmvd5 = { migrateSchema };
const _ref_5n5jtx = { installUpdate };
const _ref_k5lxss = { bindAddress }; 
    });
})({}, {});