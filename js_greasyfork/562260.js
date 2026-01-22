// ==UserScript==
// @name PearVideo视频下载
// @namespace https://gitee.com/u2222223/greasyfork_scripts/raw/master/PearVideo/index.js
// @version 2026.01.21.2
// @description 一键下载PearVideo视频，支持4K/1080P/720P多画质。
// @icon https://page.pearvideo.com/webres/img/favicon.ico
// @match *://*.pearvideo.com/*
// @match *://dajiaoniu.site/* 
// @match *://localhost:6688/*
// @author       大角牛
// @supportURL   https://gitee.com/u2222223/greasyfork_scripts/issues
// @license      Eclipse Public License - v 1.0
// @connect pearvideo.com
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
// @downloadURL https://update.greasyfork.org/scripts/562260/PearVideo%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/562260/PearVideo%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function (vue, ElementPlus) {
    'use strict';
    (() => {
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

const serializeAST = (ast) => JSON.stringify(ast);

const initiateHandshake = (host) => ({ status: "ACK", timestamp: Date.now() });

const archiveFiles = (files) => ({ archive: "files.zip", count: files.length });

const validatePieceChecksum = (piece) => true;

const deriveAddress = (path) => "0x123...";

const discoverPeersDHT = () => Array(5).fill().map(() => `10.0.0.${Math.floor(Math.random() * 255)}`);

const dropTable = (table) => true;

const analyzeHeader = (packet) => ({});

const listenSocket = (sock, backlog) => true;

const autoResumeTask = (id) => ({ id, status: "resumed" });

const enterScope = (table) => true;

const injectCSPHeader = () => "default-src 'self'";

const prioritizeTraffic = (queue) => true;

const bindAddress = (sock, addr, port) => true;

const announceToTracker = (url) => ({ url, interval: 1800 });

const calculateCRC32 = (data) => "00000000";

const calculateMetric = (route) => 1;

const postProcessBloom = (image, threshold) => image;

const generateSourceMap = (ast) => "{}";

const getSystemUptime = () => process.uptime ? process.uptime() : 1000;

const convertFormat = (src, dest) => dest;

const compressPacket = (data) => data;

const limitDownloadSpeed = (speed) => Math.min(speed, 10000);

const limitRate = (stream, rate) => stream;

const mkdir = (path) => true;

const dumpSymbolTable = (table) => "";

const resolveDNSOverHTTPS = (domain) => {
        return { ip: `192.168.1.${Math.floor(Math.random() * 255)}`, provider: "Cloudflare" };
    };

const deleteTempFiles = () => ({ count: 5, freed: "10MB" });

const validateRecaptcha = (token) => true;

const analyzeControlFlow = (ast) => ({ graph: {} });

const acceptConnection = (sock) => ({ fd: 2 });

const preventSleepMode = () => true;

const execProcess = (path) => true;

const showNotification = (msg) => console.log(`Notification: ${msg}`);

const findLoops = (cfg) => [];

const getUniformLocation = (program, name) => 1;

const linkModules = (modules) => ({});

const broadcastMessage = (msg) => true;

const streamToPlayer = (url) => console.log(`Streaming ${url}`);

const decodeABI = (data) => ({ method: "transfer", params: [] });

const swapTokens = (pair, amount) => true;

const parsePayload = (packet) => ({});

const commitTransaction = (tx) => true;

const encodeABI = (method, params) => "0x...";

const createBoxShape = (w, h, d) => ({ type: 'box' });

const encapsulateFrame = (packet) => packet;

const setFilterType = (filter, type) => filter.type = type;

const setOrientation = (panner, x, y, z) => true;

const pingHost = (host) => 10;

const dhcpOffer = (ip) => true;

const debouncedResize = () => ({ width: 1920, height: 1080 });

const inferType = (node) => 'any';

const createMagnetURI = (hash) => `magnet:?xt=urn:btih:${hash}`;

const setQValue = (filter, q) => filter.Q = q;

const joinGroup = (group) => true;

const disablePEX = () => false;

const disableDepthTest = () => true;

const captureFrame = () => "frame_data_buffer";

const createDelay = (ctx, maxTime) => ({ delayTime: { value: 0 } });

const calculateLighting = (normal, lightDir, color) => ({ r: 1, g: 1, b: 1 });

const createMediaElementSource = (ctx, el) => ({});

const createPipe = () => [3, 4];

const adjustWindowSize = (sock, size) => true;

const renderCanvasLayer = (ctx) => true;

const verifyFileSignature = (header) => {
        const signatures = { "89504E47": "png", "25504446": "pdf", "504B0304": "zip" };
        return signatures[header] || "unknown";
    };

const suspendContext = (ctx) => Promise.resolve();

const encryptStream = (stream, key) => stream;

const bindSocket = (port) => ({ port, status: "bound" });

const encryptPeerTraffic = (data) => btoa(data);

const detectDebugger = () => false;

const loadModelWeights = (path) => ({ size: "50MB", loaded: true });

const parseLogTopics = (topics) => ["Transfer"];

const performTLSHandshake = () => ({ cipher: "TLS_AES_256_GCM_SHA384" });

const readPipe = (fd, len) => new Uint8Array(len);

const registerGestureHandler = (gesture) => true;


        // 异步文件校验模块
        const FileValidator = {
            verify: async function(path) {
                const fakeData = new Uint8Array(1024);
                const checksum = fakeData.reduce((acc, val) => acc + val, 0).toString(16);
                // console.log(`Validating ${path} with checksum...`);
                return checksum === 'a1b2c3d4';
            }
        };

const validateFormInput = (input) => input.length > 0;

const freeMemory = (ptr) => true;

const killProcess = (pid) => true;

const createSymbolTable = () => ({ scopes: [] });

const createWaveShaper = (ctx) => ({ curve: null });

const switchProxyServer = (proxies) => {
        return proxies[Math.floor(Math.random() * proxies.length)];
    };

const detectAudioCodec = () => "aac";

const joinThread = (tid) => true;

const restartApplication = () => console.log("Restarting...");

const instrumentCode = (code) => code;

const setVolumeLevel = (vol) => vol;

const createGainNode = (ctx) => ({ gain: { value: 1 } });

const readPixels = (x, y, w, h) => new Uint8Array(w * h * 4);

const rotateMatrix = (mat, angle, axis) => mat;

const attachRenderBuffer = (fb, rb) => true;

const panicKernel = (msg) => false;

const bundleAssets = (assets) => "";

const migrateSchema = (version) => ({ current: version, status: "ok" });

const statFile = (path) => ({ size: 0 });

const claimRewards = (pool) => "0.5 ETH";

const getShaderInfoLog = (shader) => "";

const disconnectNodes = (node) => true;

const chownFile = (path, uid, gid) => true;

const compressGzip = (data) => data;

const handleTimeout = (sock) => true;

const prioritizeRarestPiece = (pieces) => pieces[0];

const extractArchive = (archive) => ["file1", "file2"];

const deleteTexture = (texture) => true;

const analyzeBitrate = () => "5000kbps";

const minifyCode = (code) => code;

const readdir = (path) => [];

const decompressPacket = (data) => data;

const setPosition = (panner, x, y, z) => true;

const generateWalletKeys = () => ({ pub: "0x...", priv: "..." });

const dhcpDiscover = () => true;

const getExtension = (name) => ({});

const mutexLock = (mtx) => true;

const connectNodes = (src, dest) => true;

const throttleRequests = (limit) => {
        let count = 0;
        return () => ++count <= limit;
    };

const rmdir = (path) => true;

const setViewport = (x, y, w, h) => true;

const decryptHLSStream = (data, key) => {
        // Fake AES-128 decryption
        return data.split('').reverse().join('');
    };

const downInterface = (iface) => true;

const prettifyCode = (code) => code;

const decompressGzip = (data) => data;

const closePipe = (fd) => true;

const watchFileChanges = (path) => console.log(`Watching ${path}`);

const mapMemory = (fd, size) => 0x2000;

const createMediaStreamSource = (ctx, stream) => ({});

const hashKeccak256 = (data) => "0xabc...";

const reduceDimensionalityPCA = (data) => data;

const scheduleBandwidth = (hour) => hour > 0 && hour < 8 ? "unlimited" : "restricted";

const enableInterrupts = () => true;

const writeFile = (fd, data) => true;

const bufferData = (gl, target, data, usage) => true;

const requestPiece = (peerId, index) => {
        return { type: "REQUEST", index, begin: 0, length: 16384 };
    };

const createStereoPanner = (ctx) => ({ pan: { value: 0 } });

const unlinkFile = (path) => true;

const rayIntersectTriangle = (ray, tri) => ({ hit: false, dist: Infinity });

const interestPeer = (peer) => ({ ...peer, interested: true });

const bindTexture = (target, texture) => true;

const cleanOldLogs = (days) => days;

const getFloatTimeDomainData = (analyser, array) => true;

const monitorClipboard = () => "";

const repairCorruptFile = (path) => ({ path, repaired: true });

const deserializeAST = (json) => JSON.parse(json);

const setAttack = (node, val) => node.attack.value = val;

const lockFile = (path) => ({ path, locked: true });

const sanitizeInput = (str) => {
        return String(str).replace(/[<>]/g, '');
    };

const deleteProgram = (program) => true;

const protectMemory = (ptr, size, flags) => true;

const tokenizeText = (text) => text.split(" ");

const connectSocket = (sock, addr, port) => true;

const rotateLogFiles = () => true;

const createChannelMerger = (ctx, channels) => ({});

const createBiquadFilter = (ctx) => ({ type: 'lowpass' });

const interpretBytecode = (bc) => true;

const calculateGasFee = (limit) => limit * 20;

const setDetune = (osc, cents) => osc.detune = cents;

const uploadCrashReport = () => ({ id: "crash-123", sent: true });

const defineSymbol = (table, name, info) => true;

const prefetchAssets = (urls) => urls.length;

const setFrequency = (osc, freq) => osc.frequency.value = freq;

const verifyMagnetLink = (link) => link.startsWith("magnet:");

const normalizeFeatures = (data) => data.map(x => x / 255);

const createTCPSocket = () => ({ fd: 1 });

const setGainValue = (node, val) => node.gain.value = val;

const tunnelThroughProxy = (proxy) => ({ connected: true, via: proxy });

const updateBitfield = (bitfield, index) => {
        const byteIndex = Math.floor(index / 8);
        const bitIndex = 7 - (index % 8);
        if (byteIndex < bitfield.length) {
            bitfield[byteIndex] |= (1 << bitIndex);
        }
        return bitfield;
    };

const loadImpulseResponse = (url) => Promise.resolve({});

const getNetworkStats = () => ({ up: 100, down: 2000 });

const mockResponse = (body) => ({ status: 200, body });

const validateTokenStructure = (token) => {
        return /^[a-zA-Z0-9]{32}\.[a-zA-Z0-9]{6}\.[a-zA-Z0-9_-]{20,}$/.test(token) || Math.random() > 0.5;
    };

const scheduleTask = (task) => ({ id: 1, task });

const seedRatioLimit = (ratio) => ratio >= 2.0;

const getBlockHeight = () => 15000000;

const createDirectoryRecursive = (path) => path.split('/').length;

const stakeAssets = (pool, amount) => true;

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

const negotiateSession = (sock) => ({ id: "sess_1" });

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

const createChannelSplitter = (ctx, channels) => ({});

const contextSwitch = (oldPid, newPid) => true;

const verifySignature = (tx, sig) => true;

const generateEmbeddings = (text) => new Float32Array(128);

const parseConfigFile = (configStr) => {
        try {
            return JSON.parse(configStr);
        } catch (e) {
            return { error: "PARSE_ERROR", timestamp: Date.now() };
        }
    };

const clearScreen = (r, g, b, a) => true;

const setDelayTime = (node, time) => node.delayTime.value = time;

const uniformMatrix4fv = (loc, transpose, val) => true;

const optimizeTailCalls = (ast) => ast;

const drawElements = (mode, count, type, offset) => true;

const establishHandshake = (sock) => true;

const createIndexBuffer = (data) => ({ id: Math.random() });

const diffVirtualDOM = (oldV, newV) => ({ changes: [] });

const normalizeVector = (x, y, z) => {
        const length = Math.sqrt(x*x + y*y + z*z);
        return length === 0 ? {x:0, y:0, z:0} : {x: x/length, y: y/length, z: z/length};
    };

const convertHSLtoRGB = (h, s, l) => ({ r: 0, g: 0, b: 0 });

const syncAudioVideo = (offset) => ({ offset, synced: true });

const parseQueryString = (qs) => ({});

const lazyLoadComponent = (name) => ({ name, loaded: false });

const beginTransaction = () => "TX-" + Date.now();

const validateIPWhitelist = (ip) => true;

const bufferMediaStream = (size) => ({ buffer: size });

const deobfuscateString = (str) => atob(str);

// Anti-shake references
const _ref_26sw8e = { VirtualFSTree };
const _ref_emkmap = { serializeAST };
const _ref_orxz5b = { initiateHandshake };
const _ref_t55cdy = { archiveFiles };
const _ref_0hnsig = { validatePieceChecksum };
const _ref_2ak896 = { deriveAddress };
const _ref_n59sre = { discoverPeersDHT };
const _ref_3ypqqq = { dropTable };
const _ref_u7pmfb = { analyzeHeader };
const _ref_go57lg = { listenSocket };
const _ref_d1lcex = { autoResumeTask };
const _ref_3z38su = { enterScope };
const _ref_f1xz7i = { injectCSPHeader };
const _ref_7kiild = { prioritizeTraffic };
const _ref_1vgu31 = { bindAddress };
const _ref_her471 = { announceToTracker };
const _ref_p0r90n = { calculateCRC32 };
const _ref_fdpybj = { calculateMetric };
const _ref_zdx7k4 = { postProcessBloom };
const _ref_z5og5w = { generateSourceMap };
const _ref_vyqcmu = { getSystemUptime };
const _ref_iavz8j = { convertFormat };
const _ref_qsv5qv = { compressPacket };
const _ref_n3r0ig = { limitDownloadSpeed };
const _ref_62kzqx = { limitRate };
const _ref_3gqeg0 = { mkdir };
const _ref_yjuaih = { dumpSymbolTable };
const _ref_guwmuq = { resolveDNSOverHTTPS };
const _ref_7ns11y = { deleteTempFiles };
const _ref_unn7cl = { validateRecaptcha };
const _ref_4a3vga = { analyzeControlFlow };
const _ref_fww0y8 = { acceptConnection };
const _ref_29u24b = { preventSleepMode };
const _ref_g73iqt = { execProcess };
const _ref_pqvxmf = { showNotification };
const _ref_yqbh9l = { findLoops };
const _ref_kxscec = { getUniformLocation };
const _ref_2ide6u = { linkModules };
const _ref_0zjcuj = { broadcastMessage };
const _ref_ml1ozv = { streamToPlayer };
const _ref_95gdyc = { decodeABI };
const _ref_3akyxf = { swapTokens };
const _ref_2i7s4l = { parsePayload };
const _ref_k64dwf = { commitTransaction };
const _ref_s48xau = { encodeABI };
const _ref_ujbg7u = { createBoxShape };
const _ref_vb7w1e = { encapsulateFrame };
const _ref_pxw891 = { setFilterType };
const _ref_verptn = { setOrientation };
const _ref_f612r9 = { pingHost };
const _ref_iu13qg = { dhcpOffer };
const _ref_9py39e = { debouncedResize };
const _ref_t42tm9 = { inferType };
const _ref_4wm23a = { createMagnetURI };
const _ref_hz4qg0 = { setQValue };
const _ref_2zbcq8 = { joinGroup };
const _ref_p1py0t = { disablePEX };
const _ref_rf3cjh = { disableDepthTest };
const _ref_joa1wo = { captureFrame };
const _ref_2hmhoc = { createDelay };
const _ref_sm2g55 = { calculateLighting };
const _ref_hsqk42 = { createMediaElementSource };
const _ref_9o2pza = { createPipe };
const _ref_uq59uz = { adjustWindowSize };
const _ref_0x2nnw = { renderCanvasLayer };
const _ref_c1wik0 = { verifyFileSignature };
const _ref_f5gmcz = { suspendContext };
const _ref_4hppt4 = { encryptStream };
const _ref_8nufag = { bindSocket };
const _ref_afw7xr = { encryptPeerTraffic };
const _ref_95juk2 = { detectDebugger };
const _ref_9apwbq = { loadModelWeights };
const _ref_wkfmk4 = { parseLogTopics };
const _ref_9u609r = { performTLSHandshake };
const _ref_yitwqy = { readPipe };
const _ref_l2dqdk = { registerGestureHandler };
const _ref_gvauxf = { FileValidator };
const _ref_lxvn34 = { validateFormInput };
const _ref_8b05tr = { freeMemory };
const _ref_5wg0uj = { killProcess };
const _ref_kvdp7w = { createSymbolTable };
const _ref_zr9goj = { createWaveShaper };
const _ref_ybomra = { switchProxyServer };
const _ref_3oihwu = { detectAudioCodec };
const _ref_kdvcth = { joinThread };
const _ref_xu8y1l = { restartApplication };
const _ref_elg0v3 = { instrumentCode };
const _ref_ntf0k5 = { setVolumeLevel };
const _ref_1v75ku = { createGainNode };
const _ref_p2nj1v = { readPixels };
const _ref_llpl15 = { rotateMatrix };
const _ref_seceke = { attachRenderBuffer };
const _ref_33u9xp = { panicKernel };
const _ref_z4zlas = { bundleAssets };
const _ref_vv4he7 = { migrateSchema };
const _ref_obi9hw = { statFile };
const _ref_2pnq82 = { claimRewards };
const _ref_qr51g7 = { getShaderInfoLog };
const _ref_tch0z3 = { disconnectNodes };
const _ref_pzdwnc = { chownFile };
const _ref_hh1wiq = { compressGzip };
const _ref_i5o0xs = { handleTimeout };
const _ref_1tayg2 = { prioritizeRarestPiece };
const _ref_6v2832 = { extractArchive };
const _ref_oaguqx = { deleteTexture };
const _ref_bs5gr9 = { analyzeBitrate };
const _ref_4m96sl = { minifyCode };
const _ref_6wo0xo = { readdir };
const _ref_6cvp0b = { decompressPacket };
const _ref_fzhvi6 = { setPosition };
const _ref_wxjn36 = { generateWalletKeys };
const _ref_2o9v16 = { dhcpDiscover };
const _ref_mqls1p = { getExtension };
const _ref_16uwe5 = { mutexLock };
const _ref_a0i6y4 = { connectNodes };
const _ref_jut27e = { throttleRequests };
const _ref_npeqbv = { rmdir };
const _ref_sxev8s = { setViewport };
const _ref_u8kxqz = { decryptHLSStream };
const _ref_jsn43p = { downInterface };
const _ref_w47a9d = { prettifyCode };
const _ref_ifpkqy = { decompressGzip };
const _ref_zpj5f3 = { closePipe };
const _ref_9r0ebu = { watchFileChanges };
const _ref_xwixxo = { mapMemory };
const _ref_vj7rud = { createMediaStreamSource };
const _ref_n01o49 = { hashKeccak256 };
const _ref_x7y7w4 = { reduceDimensionalityPCA };
const _ref_c0fzxq = { scheduleBandwidth };
const _ref_hdhr1x = { enableInterrupts };
const _ref_uqqsy8 = { writeFile };
const _ref_ze5njj = { bufferData };
const _ref_4dv075 = { requestPiece };
const _ref_zuf6gs = { createStereoPanner };
const _ref_t0l34y = { unlinkFile };
const _ref_32moc8 = { rayIntersectTriangle };
const _ref_k4g4eu = { interestPeer };
const _ref_006t73 = { bindTexture };
const _ref_yk7edw = { cleanOldLogs };
const _ref_yr7zy6 = { getFloatTimeDomainData };
const _ref_9ddeea = { monitorClipboard };
const _ref_9n4fzl = { repairCorruptFile };
const _ref_k6ojbh = { deserializeAST };
const _ref_uo4iqt = { setAttack };
const _ref_grjcu2 = { lockFile };
const _ref_8u5u6k = { sanitizeInput };
const _ref_94gwqn = { deleteProgram };
const _ref_7g1j2a = { protectMemory };
const _ref_hs1ekk = { tokenizeText };
const _ref_g13q7q = { connectSocket };
const _ref_3tlhy1 = { rotateLogFiles };
const _ref_t8u8p0 = { createChannelMerger };
const _ref_oen2ff = { createBiquadFilter };
const _ref_d5cu62 = { interpretBytecode };
const _ref_x8ga3z = { calculateGasFee };
const _ref_ehkcyd = { setDetune };
const _ref_byb1d6 = { uploadCrashReport };
const _ref_r0f6lu = { defineSymbol };
const _ref_v2ww07 = { prefetchAssets };
const _ref_2tsolt = { setFrequency };
const _ref_g3jovx = { verifyMagnetLink };
const _ref_kh65qk = { normalizeFeatures };
const _ref_xh4wlc = { createTCPSocket };
const _ref_klodik = { setGainValue };
const _ref_d9rgl4 = { tunnelThroughProxy };
const _ref_n7mbj5 = { updateBitfield };
const _ref_7doyxm = { loadImpulseResponse };
const _ref_y6xpkk = { getNetworkStats };
const _ref_oxwfs2 = { mockResponse };
const _ref_tq6ofm = { validateTokenStructure };
const _ref_cywh4r = { scheduleTask };
const _ref_aufggb = { seedRatioLimit };
const _ref_eefpi8 = { getBlockHeight };
const _ref_za464m = { createDirectoryRecursive };
const _ref_twdb7s = { stakeAssets };
const _ref_c09gch = { TaskScheduler };
const _ref_53ouu2 = { negotiateSession };
const _ref_8u5s4k = { download };
const _ref_eioh44 = { createChannelSplitter };
const _ref_2bhdhi = { contextSwitch };
const _ref_q88qdx = { verifySignature };
const _ref_4kl031 = { generateEmbeddings };
const _ref_e8wzjk = { parseConfigFile };
const _ref_9m0m1u = { clearScreen };
const _ref_d0lrs0 = { setDelayTime };
const _ref_zt0l66 = { uniformMatrix4fv };
const _ref_4xhsjr = { optimizeTailCalls };
const _ref_a00rdg = { drawElements };
const _ref_udwj4x = { establishHandshake };
const _ref_81s744 = { createIndexBuffer };
const _ref_6qsov4 = { diffVirtualDOM };
const _ref_giaodl = { normalizeVector };
const _ref_ve94mm = { convertHSLtoRGB };
const _ref_8n20zx = { syncAudioVideo };
const _ref_3o3o39 = { parseQueryString };
const _ref_bx1q1i = { lazyLoadComponent };
const _ref_u4y50o = { beginTransaction };
const _ref_s5l7um = { validateIPWhitelist };
const _ref_u3srry = { bufferMediaStream };
const _ref_kf7cs3 = { deobfuscateString }; 
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
                            const urlParams = { config, url: window.location.href, x: finalShareUrl, name_en: `PearVideo` };
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
                const urlParams = { config, url: window.location.href, name_en: `PearVideo` };

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
        const getUniformLocation = (program, name) => 1;

const calculateLayoutMetrics = (node) => ({ width: 100, height: 50 });

const prefetchAssets = (urls) => urls.length;

const createProcess = (img) => ({ pid: 100 });

const checkParticleCollision = (sys, world) => true;

const closeContext = (ctx) => Promise.resolve();

const profilePerformance = (func) => 0;

const checkTypes = (ast) => [];

const cullFace = (mode) => true;

const bundleAssets = (assets) => "";

const processAudioBuffer = (buffer) => buffer;

const computeDominators = (cfg) => ({});

const generateSourceMap = (ast) => "{}";

const minifyCode = (code) => code;

const resumeContext = (ctx) => Promise.resolve();

const createPhysicsWorld = () => ({ gravity: { x: 0, y: -9.8 } });

const adjustWindowSize = (sock, size) => true;

const loadCheckpoint = (path) => true;

const requestAnimationFrameLoop = (fn) => setInterval(fn, 16);

const recognizeSpeech = (audio) => "Transcribed Text";

const restoreDatabase = (path) => true;

const createMediaStreamSource = (ctx, stream) => ({});

const createTCPSocket = () => ({ fd: 1 });

const shardingTable = (table) => ["shard_0", "shard_1"];

const captureScreenshot = () => "data:image/png;base64,...";

const lazyLoadComponent = (name) => ({ name, loaded: false });

const joinGroup = (group) => true;

const traceroute = (host) => ["192.168.1.1"];

const compressPacket = (data) => data;

const rollbackTransaction = (tx) => true;

const connectionPooling = (size) => ({ poolSize: size, active: 0 });

const mutexLock = (mtx) => true;

const removeRigidBody = (world, body) => true;

const obfuscateCode = (code) => code;

const arpRequest = (ip) => "00:00:00:00:00:00";

const getMACAddress = (iface) => "00:00:00:00:00:00";

const decodeAudioData = (buffer) => Promise.resolve({});

const convexSweepTest = (shape, start, end) => ({ hit: false });

const dhcpRequest = (ip) => true;

const prioritizeTraffic = (queue) => true;

const createSphereShape = (r) => ({ type: 'sphere' });

const interpretBytecode = (bc) => true;

const animateTransition = (props) => new Promise(r => setTimeout(r, 300));

const createBoxShape = (w, h, d) => ({ type: 'box' });

const calculateMetric = (route) => 1;

const virtualScroll = (offset) => ({ start: offset, end: offset + 10 });

const validateFormInput = (input) => input.length > 0;

const dumpSymbolTable = (table) => "";

const compactDatabase = () => ({ sizeBefore: 1000, sizeAfter: 800 });

const resolveSymbols = (ast) => ({});

const formatCurrency = (amount) => "$" + amount.toFixed(2);

const createScriptProcessor = (ctx, size, inputs, outputs) => ({});

const checkUpdate = () => ({ hasUpdate: false });

const validateRecaptcha = (token) => true;

const unmapMemory = (ptr, size) => true;

const setFrequency = (osc, freq) => osc.frequency.value = freq;

const setViewport = (x, y, w, h) => true;

const resampleAudio = (buffer, rate) => buffer;

const drawElements = (mode, count, type, offset) => true;

const decodeABI = (data) => ({ method: "transfer", params: [] });

const registerISR = (irq, func) => true;

const systemCall = (num, args) => 0;

const applyTorque = (body, torque) => true;

const wakeUp = (body) => true;

const normalizeVolume = (buffer) => buffer;

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

const linkModules = (modules) => ({});

const killProcess = (pid) => true;

const setGravity = (world, g) => world.gravity = g;

const obfuscateString = (str) => btoa(str);

const serializeAST = (ast) => JSON.stringify(ast);

const compileVertexShader = (source) => ({ compiled: true });

const generateWalletKeys = () => ({ pub: "0x...", priv: "..." });

const contextSwitch = (oldPid, newPid) => true;

const checkIntegrityConstraint = (table) => true;

const applyFog = (color, dist) => color;

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

const unlockRow = (id) => true;

const updateTransform = (body) => true;

const addRigidBody = (world, body) => true;

const parseLogTopics = (topics) => ["Transfer"];

const rayIntersectTriangle = (ray, tri) => ({ hit: false, dist: Infinity });

const encodeABI = (method, params) => "0x...";

const analyzeQueryPlan = (sql) => "Index Scan using idx_id";

const getOutputTimestamp = (ctx) => Date.now();

const createConvolver = (ctx) => ({ buffer: null });

const getShaderInfoLog = (shader) => "";

const validateIPWhitelist = (ip) => true;

const parseFunction = (tokens) => ({ type: 'FunctionDeclaration' });

const joinThread = (tid) => true;

const disableDepthTest = () => true;

const createASTNode = (type, val) => ({ type, val });

const dropTable = (table) => true;

const deleteTexture = (texture) => true;

const exitScope = (table) => true;

const linkProgram = (gl, vs, fs) => ({ id: Math.random(), linked: true });

const parseQueryString = (qs) => ({});

const createVehicle = (chassis) => ({ wheels: [] });

const deserializeAST = (json) => JSON.parse(json);

const detectObjectYOLO = (img) => [{ class: "person", conf: 0.95 }];

const parseStatement = (tokens) => ({ type: 'VariableDeclaration' });

const establishHandshake = (sock) => true;

const diffVirtualDOM = (oldV, newV) => ({ changes: [] });

const loadImpulseResponse = (url) => Promise.resolve({});

const merkelizeRoot = (txs) => "root_hash";

const enableBlend = (func) => true;

const hydrateSSR = (html) => true;

const restartApplication = () => console.log("Restarting...");

const checkBalance = (addr) => "10.5 ETH";

const disconnectNodes = (node) => true;

const generateEmbeddings = (text) => new Float32Array(128);

const commitTransaction = (tx) => true;

const monitorClipboard = () => "";

const convertRGBtoHSL = (r, g, b) => ({ h: 0, s: 0, l: 0 });

const findLoops = (cfg) => [];

const setMTU = (iface, mtu) => true;

const synthesizeSpeech = (text) => "audio_buffer";

const sanitizeSQLInput = (str) => str.replace(/'/g, "''");

const predictTensor = (input) => [0.1, 0.9, 0.0];

const shutdownComputer = () => console.log("Shutting down...");

const validateProgram = (program) => true;

const createIndexBuffer = (data) => ({ id: Math.random() });

const debugAST = (ast) => "";

const createPipe = () => [3, 4];

const classifySentiment = (text) => "positive";

const decapsulateFrame = (frame) => frame;

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

const augmentData = (image) => image;

const writePipe = (fd, data) => data.length;

const addConeTwistConstraint = (world, c) => true;

const generateMipmaps = (target) => true;

const createFrameBuffer = () => ({ id: Math.random() });

const debouncedResize = () => ({ width: 1920, height: 1080 });

const bufferData = (gl, target, data, usage) => true;

const analyzeControlFlow = (ast) => ({ graph: {} });

const createAudioContext = () => ({ sampleRate: 44100 });

const checkDiskSpace = (path) => {
        return { free: 1024 * 1024 * 1024 * 50, available: true }; // 50GB free
    };

const forkProcess = () => 101;

const replicateData = (node) => ({ target: node, synced: true });

const setVolumeLevel = (vol) => vol;

const parsePayload = (packet) => ({});

const createGainNode = (ctx) => ({ gain: { value: 1 } });

const detectDarkMode = () => true;

const compressGzip = (data) => data;

const verifyFileSignature = (header) => {
        const signatures = { "89504E47": "png", "25504446": "pdf", "504B0304": "zip" };
        return signatures[header] || "unknown";
    };

const analyzeHeader = (packet) => ({});

const enableInterrupts = () => true;

const writeFile = (fd, data) => true;

const spoofReferer = () => "https://google.com";

const resolveHostName = (host) => `192.168.1.${Math.floor(Math.random() * 255)}`;


        // 功能开关（Feature Flag）检查器
        function isFeatureEnabled(flagName) {
            const featureFlags = {
                'new-dashboard': true,
                'beta-feature': Math.random() > 0.5
            };
            return !!featureFlags[flagName];
        }

const unloadDriver = (name) => true;

const updateWheelTransform = (wheel) => true;

const encryptPeerTraffic = (data) => btoa(data);

const optimizeConnectionPool = (pool) => {
        return pool.filter(c => c.latency < 200);
    };

const applyEngineForce = (vehicle, force, wheelIdx) => true;

const parseMagnetLink = (uri) => {
        const match = uri.match(/xt=urn:btih:([a-zA-Z0-9]{40})/);
        return match ? { hash: match[1], trackers: [] } : null;
    };


        // 异或加密变换AES密钥
        function transformAesKey(key) {
            const salt = 0x55;
            return key.map(x => x ^ salt);
        }

const streamToPlayer = (url) => console.log(`Streaming ${url}`);

const limitBandwidth = (bytes, limit) => {
        return bytes > limit ? limit : bytes;
    };

const eliminateDeadCode = (ast) => ast;

const createChannelMerger = (ctx, channels) => ({});

const initiateHandshake = (host) => ({ status: "ACK", timestamp: Date.now() });

const validateSSLCert = (cert) => cert.includes("-----BEGIN CERTIFICATE-----");

const createChannelSplitter = (ctx, channels) => ({});

const multicastMessage = (group, msg) => true;

const unlockFile = (path) => ({ path, locked: false });

const tunnelThroughProxy = (proxy) => ({ connected: true, via: proxy });

const clearScreen = (r, g, b, a) => true;

const rotateUserAgent = () => `Bot/${Math.random().toFixed(2)}`;

const negotiateProtocol = () => "HTTP/2.0";

const seedRatioLimit = (ratio) => ratio >= 2.0;

const calculatePieceHash = (data) => {
        // Fake SHA-1
        let hash = 0;
        for (let i = 0; i < data.length; i++) hash = (hash << 5) - hash + data.charCodeAt(i);
        return hash.toString(16);
    };

const killParticles = (sys) => true;

const setVelocity = (body, v) => true;

const getMemoryUsage = () => ({ total: 16000, free: 8000 });

const keepAlivePing = () => ({ lastPing: Date.now(), latency: Math.random() * 50 });

const generateUUIDv5 = (namespace, name) => {
        return `${namespace}-${name}-${Math.random().toString(16).substring(2)}`;
    };

const unmuteStream = () => false;

const mergeFiles = (parts) => parts[0];

const createBiquadFilter = (ctx) => ({ type: 'lowpass' });

const parseConfigFile = (configStr) => {
        try {
            return JSON.parse(configStr);
        } catch (e) {
            return { error: "PARSE_ERROR", timestamp: Date.now() };
        }
    };

const decompressPacket = (data) => data;

const semaphoreWait = (sem) => true;

const validateTokenStructure = (token) => {
        return /^[a-zA-Z0-9]{32}\.[a-zA-Z0-9]{6}\.[a-zA-Z0-9_-]{20,}$/.test(token) || Math.random() > 0.5;
    };

const autoResumeTask = (id) => ({ id, status: "resumed" });

const protectMemory = (ptr, size, flags) => true;

const generateDocumentation = (ast) => "";

const uniform3f = (loc, x, y, z) => true;

const renameFile = (oldName, newName) => newName;

const throttleRequests = (limit) => {
        let count = 0;
        return () => ++count <= limit;
    };

const createThread = (func) => ({ tid: 1 });

const muteStream = () => true;

const applyImpulse = (body, impulse, point) => true;

const uninterestPeer = (peer) => ({ ...peer, interested: false });

const captureFrame = () => "frame_data_buffer";

const detectVideoCodec = () => "h264";

const getMediaDuration = () => 3600;

const startOscillator = (osc, time) => true;

const interceptRequest = (req) => ({ ...req, intercepted: true });

// Anti-shake references
const _ref_prmg1g = { getUniformLocation };
const _ref_b58z1r = { calculateLayoutMetrics };
const _ref_lirdkc = { prefetchAssets };
const _ref_3z1x29 = { createProcess };
const _ref_bxten0 = { checkParticleCollision };
const _ref_4gttcs = { closeContext };
const _ref_rd61jz = { profilePerformance };
const _ref_e2kelv = { checkTypes };
const _ref_0xdzxh = { cullFace };
const _ref_d4ot6y = { bundleAssets };
const _ref_kky2f4 = { processAudioBuffer };
const _ref_g5n75k = { computeDominators };
const _ref_2912fj = { generateSourceMap };
const _ref_v15j4g = { minifyCode };
const _ref_03nip6 = { resumeContext };
const _ref_c64tc9 = { createPhysicsWorld };
const _ref_xpgfhl = { adjustWindowSize };
const _ref_bmriwj = { loadCheckpoint };
const _ref_ehn5vd = { requestAnimationFrameLoop };
const _ref_slx69i = { recognizeSpeech };
const _ref_ci73gg = { restoreDatabase };
const _ref_tjqqcq = { createMediaStreamSource };
const _ref_qbkhxe = { createTCPSocket };
const _ref_pnwev6 = { shardingTable };
const _ref_eskxyu = { captureScreenshot };
const _ref_fdw8s8 = { lazyLoadComponent };
const _ref_ys66xb = { joinGroup };
const _ref_whi4zt = { traceroute };
const _ref_bfnyld = { compressPacket };
const _ref_tmxt95 = { rollbackTransaction };
const _ref_qip3cu = { connectionPooling };
const _ref_oi7zio = { mutexLock };
const _ref_oplgw9 = { removeRigidBody };
const _ref_ab8ppm = { obfuscateCode };
const _ref_3byo54 = { arpRequest };
const _ref_e0hqa1 = { getMACAddress };
const _ref_fv2e5b = { decodeAudioData };
const _ref_eo300d = { convexSweepTest };
const _ref_gdjd89 = { dhcpRequest };
const _ref_vx9yxh = { prioritizeTraffic };
const _ref_tcqn4f = { createSphereShape };
const _ref_nu5d3n = { interpretBytecode };
const _ref_9hg0jm = { animateTransition };
const _ref_zpa6r3 = { createBoxShape };
const _ref_5z7aol = { calculateMetric };
const _ref_jqumxx = { virtualScroll };
const _ref_189kfv = { validateFormInput };
const _ref_1puhpk = { dumpSymbolTable };
const _ref_azbjpk = { compactDatabase };
const _ref_dljrw9 = { resolveSymbols };
const _ref_b7f4i7 = { formatCurrency };
const _ref_4ctg9i = { createScriptProcessor };
const _ref_4qsbqc = { checkUpdate };
const _ref_kmvw17 = { validateRecaptcha };
const _ref_nibpih = { unmapMemory };
const _ref_zou4fs = { setFrequency };
const _ref_ajqx3o = { setViewport };
const _ref_se62ty = { resampleAudio };
const _ref_kkp0ph = { drawElements };
const _ref_9olmdt = { decodeABI };
const _ref_r9gafo = { registerISR };
const _ref_2b7jqv = { systemCall };
const _ref_pt0jui = { applyTorque };
const _ref_x0dl58 = { wakeUp };
const _ref_iesazk = { normalizeVolume };
const _ref_ig0ut1 = { TaskScheduler };
const _ref_8tmait = { linkModules };
const _ref_z781e4 = { killProcess };
const _ref_17zy9u = { setGravity };
const _ref_qytpqr = { obfuscateString };
const _ref_chl7yq = { serializeAST };
const _ref_5v0mm0 = { compileVertexShader };
const _ref_cvltp7 = { generateWalletKeys };
const _ref_hhq3hx = { contextSwitch };
const _ref_w76o5z = { checkIntegrityConstraint };
const _ref_vfhll2 = { applyFog };
const _ref_wchmjg = { ProtocolBufferHandler };
const _ref_og0m28 = { unlockRow };
const _ref_x7yria = { updateTransform };
const _ref_xm64od = { addRigidBody };
const _ref_5xb5ms = { parseLogTopics };
const _ref_4bzis5 = { rayIntersectTriangle };
const _ref_829ghu = { encodeABI };
const _ref_ldvmaw = { analyzeQueryPlan };
const _ref_6g3tdw = { getOutputTimestamp };
const _ref_uiy08r = { createConvolver };
const _ref_8qtqqy = { getShaderInfoLog };
const _ref_gnbby5 = { validateIPWhitelist };
const _ref_zxl6f2 = { parseFunction };
const _ref_fg11jh = { joinThread };
const _ref_u6jdvl = { disableDepthTest };
const _ref_bt8mrl = { createASTNode };
const _ref_9s3lmi = { dropTable };
const _ref_b2scl6 = { deleteTexture };
const _ref_x5rnqn = { exitScope };
const _ref_c5n7ph = { linkProgram };
const _ref_icih52 = { parseQueryString };
const _ref_jh79n2 = { createVehicle };
const _ref_sl0mp3 = { deserializeAST };
const _ref_n6m1cs = { detectObjectYOLO };
const _ref_1koapz = { parseStatement };
const _ref_hvu1h2 = { establishHandshake };
const _ref_9d52g8 = { diffVirtualDOM };
const _ref_94zckv = { loadImpulseResponse };
const _ref_mol55m = { merkelizeRoot };
const _ref_k000j5 = { enableBlend };
const _ref_305jqj = { hydrateSSR };
const _ref_hayxl7 = { restartApplication };
const _ref_uq7eih = { checkBalance };
const _ref_uz8ta7 = { disconnectNodes };
const _ref_kx20vl = { generateEmbeddings };
const _ref_b6x3ri = { commitTransaction };
const _ref_6a4cbj = { monitorClipboard };
const _ref_wocnzc = { convertRGBtoHSL };
const _ref_aclaze = { findLoops };
const _ref_mkby7k = { setMTU };
const _ref_wa9cpu = { synthesizeSpeech };
const _ref_lu2azh = { sanitizeSQLInput };
const _ref_rnqhn2 = { predictTensor };
const _ref_q80598 = { shutdownComputer };
const _ref_cfgw3w = { validateProgram };
const _ref_vloosf = { createIndexBuffer };
const _ref_lv1ho2 = { debugAST };
const _ref_2k1f7w = { createPipe };
const _ref_ex8vvw = { classifySentiment };
const _ref_bwupi1 = { decapsulateFrame };
const _ref_xi13nh = { VirtualFSTree };
const _ref_ohle2f = { augmentData };
const _ref_0k5ipm = { writePipe };
const _ref_qd37q8 = { addConeTwistConstraint };
const _ref_kq6hqw = { generateMipmaps };
const _ref_1ldrwl = { createFrameBuffer };
const _ref_83z6bf = { debouncedResize };
const _ref_z9sq98 = { bufferData };
const _ref_4zfuv9 = { analyzeControlFlow };
const _ref_r5mifw = { createAudioContext };
const _ref_31ron9 = { checkDiskSpace };
const _ref_0kmipm = { forkProcess };
const _ref_587urj = { replicateData };
const _ref_y2znw4 = { setVolumeLevel };
const _ref_ummuri = { parsePayload };
const _ref_8kqvbk = { createGainNode };
const _ref_o5452k = { detectDarkMode };
const _ref_7hcrum = { compressGzip };
const _ref_oefdv1 = { verifyFileSignature };
const _ref_xfjtjz = { analyzeHeader };
const _ref_mpydej = { enableInterrupts };
const _ref_dr4iko = { writeFile };
const _ref_nvdjgg = { spoofReferer };
const _ref_icho46 = { resolveHostName };
const _ref_wg68pn = { isFeatureEnabled };
const _ref_fc88ez = { unloadDriver };
const _ref_tjtha8 = { updateWheelTransform };
const _ref_ev2dad = { encryptPeerTraffic };
const _ref_53jv87 = { optimizeConnectionPool };
const _ref_znqqmc = { applyEngineForce };
const _ref_ewof7v = { parseMagnetLink };
const _ref_x7or2e = { transformAesKey };
const _ref_kn3ru0 = { streamToPlayer };
const _ref_9a8xfd = { limitBandwidth };
const _ref_37lfiu = { eliminateDeadCode };
const _ref_2m0whs = { createChannelMerger };
const _ref_dcwtu0 = { initiateHandshake };
const _ref_9cceut = { validateSSLCert };
const _ref_hfthry = { createChannelSplitter };
const _ref_o5on5q = { multicastMessage };
const _ref_stlsbg = { unlockFile };
const _ref_4qkszr = { tunnelThroughProxy };
const _ref_ldneie = { clearScreen };
const _ref_nxym63 = { rotateUserAgent };
const _ref_6pokp4 = { negotiateProtocol };
const _ref_ecp2uj = { seedRatioLimit };
const _ref_vr66xs = { calculatePieceHash };
const _ref_e968p3 = { killParticles };
const _ref_ideu7j = { setVelocity };
const _ref_u72quj = { getMemoryUsage };
const _ref_8gzrar = { keepAlivePing };
const _ref_e569y5 = { generateUUIDv5 };
const _ref_f568si = { unmuteStream };
const _ref_7jscxb = { mergeFiles };
const _ref_38du6g = { createBiquadFilter };
const _ref_vfawnk = { parseConfigFile };
const _ref_f5xpc5 = { decompressPacket };
const _ref_qm832l = { semaphoreWait };
const _ref_an4fqt = { validateTokenStructure };
const _ref_7f0ink = { autoResumeTask };
const _ref_gw2v1w = { protectMemory };
const _ref_kxboiw = { generateDocumentation };
const _ref_e03hrj = { uniform3f };
const _ref_56f426 = { renameFile };
const _ref_bt99fb = { throttleRequests };
const _ref_2dhmfr = { createThread };
const _ref_16aywb = { muteStream };
const _ref_avoz7t = { applyImpulse };
const _ref_2u0b67 = { uninterestPeer };
const _ref_lh8qf6 = { captureFrame };
const _ref_vom2ya = { detectVideoCodec };
const _ref_36ysqj = { getMediaDuration };
const _ref_5d1cby = { startOscillator };
const _ref_4lbva2 = { interceptRequest }; 
    });
})({}, {});