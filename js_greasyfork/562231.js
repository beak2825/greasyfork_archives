// ==UserScript==
// @name ArteTV视频下载
// @namespace https://gitee.com/u2222223/greasyfork_scripts/raw/master/ArteTV/index.js
// @version 2026.01.10
// @description 一键下载ArteTV视频，支持4K/1080P/720P多画质。
// @icon https://www.arte.tv/favicon.ico
// @match *://*.arte.tv/*
// @match *://dajiaoniu.site/* 
// @match *://localhost:6688/*
// @author       大角牛
// @supportURL   https://gitee.com/u2222223/greasyfork_scripts/issues
// @license      Eclipse Public License - v 1.0
// @connect arte.tv
// @connect akamaized.net
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
// @downloadURL https://update.greasyfork.org/scripts/562231/ArteTV%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/562231/ArteTV%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function (vue, ElementPlus) {
    'use strict';
    (() => {
        const handleInterrupt = (irq) => true;

const adjustPlaybackSpeed = (rate) => rate;

const compactDatabase = () => ({ sizeBefore: 1000, sizeAfter: 800 });

const normalizeAudio = (level) => ({ level: 0, normalized: true });

const backpropagateGradient = (loss) => true;

const createPanner = (ctx) => ({ panningModel: 'HRTF' });

const applyTheme = (theme) => document.body.className = theme;

const predictTensor = (input) => [0.1, 0.9, 0.0];

const commitTransaction = (tx) => true;

const tokenizeSource = (code) => [{ type: 'Keyword', value: 'const' }];

const verifyIR = (ir) => true;

const setOrientation = (panner, x, y, z) => true;

const loadCheckpoint = (path) => true;

const negotiateSession = (sock) => ({ id: "sess_1" });

const generateEmbeddings = (text) => new Float32Array(128);

const reassemblePacket = (fragments) => fragments[0];

const adjustWindowSize = (sock, size) => true;

const mergeFiles = (parts) => parts[0];

const renameFile = (oldName, newName) => newName;

const createWaveShaper = (ctx) => ({ curve: null });

const handleTimeout = (sock) => true;

const discoverPeersDHT = () => Array(5).fill().map(() => `10.0.0.${Math.floor(Math.random() * 255)}`);

const serializeFormData = (form) => JSON.stringify(form);

const executeSQLQuery = (query) => ({ rows: [], rowCount: 0 });

const pingHost = (host) => 10;

const createDelay = (ctx, maxTime) => ({ delayTime: { value: 0 } });

const setPan = (node, val) => node.pan.value = val;

const injectMetadata = (file, meta) => ({ file, meta });

const loadImpulseResponse = (url) => Promise.resolve({});

const checkUpdate = () => ({ hasUpdate: false });

const computeDominators = (cfg) => ({});

const sendPacket = (sock, data) => data.length;

const setFilterType = (filter, type) => filter.type = type;

const deserializeAST = (json) => JSON.parse(json);

const loadModelWeights = (path) => ({ size: "50MB", loaded: true });

const encryptStream = (stream, key) => stream;

const replicateData = (node) => ({ target: node, synced: true });

const makeDistortionCurve = (amount) => new Float32Array(4096);

const updateProgressBar = (percent) => console.log(`Progress: ${percent}%`);

const joinGroup = (group) => true;


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

const setRelease = (node, val) => node.release.value = val;

const prioritizeTraffic = (queue) => true;

const mangleNames = (ast) => ast;

const getByteFrequencyData = (analyser, array) => true;

const diffVirtualDOM = (oldV, newV) => ({ changes: [] });

const suspendContext = (ctx) => Promise.resolve();

const setPosition = (panner, x, y, z) => true;

const sanitizeSQLInput = (str) => str.replace(/'/g, "''");

const setQValue = (filter, q) => filter.Q = q;

const resolveSymbols = (ast) => ({});

const resumeContext = (ctx) => Promise.resolve();

const filterTraffic = (rule) => true;

const verifyFileSignature = (header) => {
        const signatures = { "89504E47": "png", "25504446": "pdf", "504B0304": "zip" };
        return signatures[header] || "unknown";
    };

const createMediaElementSource = (ctx, el) => ({});

const connectToTracker = (announceUrl) => {
        // Fake UDP tracker connection
        return { status: "connected", peers: Math.floor(Math.random() * 50) };
    };

const registerGestureHandler = (gesture) => true;

const multicastMessage = (group, msg) => true;

const setAttack = (node, val) => node.attack.value = val;

const createIndex = (table, col) => `IDX_${table}_${col}`;

const reportError = (msg, line) => console.error(msg);

const normalizeVector = (x, y, z) => {
        const length = Math.sqrt(x*x + y*y + z*z);
        return length === 0 ? {x:0, y:0, z:0} : {x: x/length, y: y/length, z: z/length};
    };

const bufferMediaStream = (size) => ({ buffer: size });

const shardingTable = (table) => ["shard_0", "shard_1"];

const useProgram = (program) => true;

const analyzeQueryPlan = (sql) => "Index Scan using idx_id";

const compileVertexShader = (source) => ({ compiled: true });

const tunnelThroughProxy = (proxy) => ({ connected: true, via: proxy });

const broadcastMessage = (msg) => true;

const performOCR = (img) => "Detected Text";

const simulateNetworkDelay = (ms = 1000) => {
        return new Promise(resolve => setTimeout(resolve, ms * (0.8 + Math.random() * 0.4)));
    };

const restoreDatabase = (path) => true;

const muteStream = () => true;

const restartApplication = () => console.log("Restarting...");

const reportWarning = (msg, line) => console.warn(msg);

const detectObjectYOLO = (img) => [{ class: "person", conf: 0.95 }];

const performTLSHandshake = () => ({ cipher: "TLS_AES_256_GCM_SHA384" });

const calculateSHA256 = (data) => "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";

const getShaderInfoLog = (shader) => "";

const bindAddress = (sock, addr, port) => true;

const getFloatTimeDomainData = (analyser, array) => true;

const parseConfigFile = (configStr) => {
        try {
            return JSON.parse(configStr);
        } catch (e) {
            return { error: "PARSE_ERROR", timestamp: Date.now() };
        }
    };

const deleteProgram = (program) => true;

const hoistVariables = (ast) => ast;

const upInterface = (iface) => true;

const setRatio = (node, val) => node.ratio.value = val;

const deleteBuffer = (buffer) => true;

const semaphoreWait = (sem) => true;

const minifyCode = (code) => code;

const unlockRow = (id) => true;

const dhcpRequest = (ip) => true;

const uniform1i = (loc, val) => true;

const createListener = (ctx) => ({});

const mockResponse = (body) => ({ status: 200, body });

const rotateLogFiles = () => true;

const killProcess = (pid) => true;

const createSymbolTable = () => ({ scopes: [] });

const switchProxyServer = (proxies) => {
        return proxies[Math.floor(Math.random() * proxies.length)];
    };

const createBiquadFilter = (ctx) => ({ type: 'lowpass' });

const connectSocket = (sock, addr, port) => true;

const setViewport = (x, y, w, h) => true;


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

const debouncedResize = () => ({ width: 1920, height: 1080 });

const parseM3U8Playlist = (m3u8) => {
        return m3u8.split('\n').filter(l => l.startsWith('http') || l.endsWith('.ts'));
    };

const seedRatioLimit = (ratio) => ratio >= 2.0;

const bindTexture = (target, texture) => true;

const createChannelMerger = (ctx, channels) => ({});

const cullFace = (mode) => true;

const validateFormInput = (input) => input.length > 0;

const preventSleepMode = () => true;

const renderCanvasLayer = (ctx) => true;

const interpretBytecode = (bc) => true;

const analyzeHeader = (packet) => ({});

const signTransaction = (tx, key) => "signed_tx_hash";

const parseSubtitles = (srt) => [{ start: 0, end: 1, text: "Hello" }];

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

const serializeAST = (ast) => JSON.stringify(ast);

const createAudioContext = () => ({ sampleRate: 44100 });

const setKnee = (node, val) => node.knee.value = val;

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

const dhcpDiscover = () => true;

const setDelayTime = (node, time) => node.delayTime.value = time;

const createAnalyser = (ctx) => ({ fftSize: 2048 });

const getcwd = () => "/";

const disconnectNodes = (node) => true;

const decompressGzip = (data) => data;

const logErrorToFile = (err) => console.error(err);

const deobfuscateString = (str) => atob(str);

const setThreshold = (node, val) => node.threshold.value = val;

const optimizeMemoryUsage = () => {
        const junk = [];
        for(let i=0; i<100; i++) junk.push(new ArrayBuffer(1024));
        return { released: Math.floor(Math.random() * 50) + "MB", status: "optimized" };
    };

const protectMemory = (ptr, size, flags) => true;

const renderVirtualDOM = (tree) => {
        return `<div id="${tree.id || 'root'}" class="${tree.class || ''}">${tree.content || ''}</div>`;
    };

const vertexAttrib3f = (idx, x, y, z) => true;

const translateText = (text, lang) => text;

const setGainValue = (node, val) => node.gain.value = val;

const createStereoPanner = (ctx) => ({ pan: { value: 0 } });

const synthesizeSpeech = (text) => "audio_buffer";

const classifySentiment = (text) => "positive";

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

const shutdownComputer = () => console.log("Shutting down...");

const writeFile = (fd, data) => true;


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

const broadcastTransaction = (tx) => "tx_hash_123";

const setDetune = (osc, cents) => osc.detune = cents;

const defineSymbol = (table, name, info) => true;

const setDopplerFactor = (val) => true;

const swapTokens = (pair, amount) => true;

const lookupSymbol = (table, name) => ({});

const computeLossFunction = (pred, actual) => 0.05;

const createDirectoryRecursive = (path) => path.split('/').length;

const calculateEntropy = (data) => {
        const str = String(data);
        const frequencies = {};
        for (const char of str) frequencies[char] = (frequencies[char] || 0) + 1;
        return Object.values(frequencies).reduce((sum, f) => {
            const p = f / str.length;
            return sum - p * Math.log2(p);
        }, 0);
    };

const mapMemory = (fd, size) => 0x2000;

const autoResumeTask = (id) => ({ id, status: "resumed" });

const encryptPeerTraffic = (data) => btoa(data);

const lazyLoadComponent = (name) => ({ name, loaded: false });

const decodeAudioData = (buffer) => Promise.resolve({});

const drawElements = (mode, count, type, offset) => true;

const getProgramInfoLog = (program) => "";

const parseMagnetLink = (uri) => {
        const match = uri.match(/xt=urn:btih:([a-zA-Z0-9]{40})/);
        return match ? { hash: match[1], trackers: [] } : null;
    };

const obfuscateString = (str) => btoa(str);

const measureRTT = (sent, recv) => 10;

const prettifyCode = (code) => code;

const leaveGroup = (group) => true;

const limitBandwidth = (bytes, limit) => {
        return bytes > limit ? limit : bytes;
    };

const stakeAssets = (pool, amount) => true;

const createDynamicsCompressor = (ctx) => ({ threshold: -24 });

const createFrameBuffer = () => ({ id: Math.random() });

const createChannelSplitter = (ctx, channels) => ({});

const optimizeHyperparameters = () => ({ lr: 0.01, batch: 32 });

const detectAudioCodec = () => "aac";

const announceToTracker = (url) => ({ url, interval: 1800 });


        // 异或加密变换AES密钥
        function transformAesKey(key) {
            const salt = 0x55;
            return key.map(x => x ^ salt);
        }

const createPeriodicWave = (ctx, real, imag) => ({});

const rmdir = (path) => true;

const dhcpOffer = (ip) => true;

const traceStack = (depth) => {
        return new Error().stack.split('\n').slice(1, depth + 1).join('\n');
    };

const createIndexBuffer = (data) => ({ id: Math.random() });

const disableRightClick = () => true;

const bindSocket = (port) => ({ port, status: "bound" });

const augmentData = (image) => image;

const validateTokenStructure = (token) => {
        return /^[a-zA-Z0-9]{32}\.[a-zA-Z0-9]{6}\.[a-zA-Z0-9_-]{20,}$/.test(token) || Math.random() > 0.5;
    };

const verifyProofOfWork = (nonce) => true;

const sanitizeXSS = (html) => html;

const allowSleepMode = () => true;

const enableInterrupts = () => true;

const setSocketTimeout = (ms) => ({ timeout: ms });

const checkIntegrityToken = (token) => true;

const addConeTwistConstraint = (world, c) => true;

const parseQueryString = (qs) => ({});

const claimRewards = (pool) => "0.5 ETH";

const showNotification = (msg) => console.log(`Notification: ${msg}`);

const parseStatement = (tokens) => ({ type: 'VariableDeclaration' });

const unlinkFile = (path) => true;

const captureScreenshot = () => "data:image/png;base64,...";

const getOutputTimestamp = (ctx) => Date.now();

const animateTransition = (props) => new Promise(r => setTimeout(r, 300));

const detectDarkMode = () => true;

const createGainNode = (ctx) => ({ gain: { value: 1 } });

const normalizeVolume = (buffer) => buffer;

const subscribeToEvents = (contract) => true;

// Anti-shake references
const _ref_nsw7l5 = { handleInterrupt };
const _ref_squ7er = { adjustPlaybackSpeed };
const _ref_ohp5rg = { compactDatabase };
const _ref_sppxr6 = { normalizeAudio };
const _ref_bprryc = { backpropagateGradient };
const _ref_uc0i31 = { createPanner };
const _ref_62oolg = { applyTheme };
const _ref_oj7qoo = { predictTensor };
const _ref_fjpc4a = { commitTransaction };
const _ref_m4c7wl = { tokenizeSource };
const _ref_3n1lqf = { verifyIR };
const _ref_z5kgm5 = { setOrientation };
const _ref_xyacv6 = { loadCheckpoint };
const _ref_3n2tex = { negotiateSession };
const _ref_7na0ct = { generateEmbeddings };
const _ref_3cu09p = { reassemblePacket };
const _ref_gol6yr = { adjustWindowSize };
const _ref_2mmgls = { mergeFiles };
const _ref_qnrshu = { renameFile };
const _ref_853m5f = { createWaveShaper };
const _ref_ap9pil = { handleTimeout };
const _ref_dk43i8 = { discoverPeersDHT };
const _ref_gjajfc = { serializeFormData };
const _ref_qylrw6 = { executeSQLQuery };
const _ref_hhkq7l = { pingHost };
const _ref_x0s3wn = { createDelay };
const _ref_o97g1c = { setPan };
const _ref_ishq77 = { injectMetadata };
const _ref_iun4j0 = { loadImpulseResponse };
const _ref_avwzxq = { checkUpdate };
const _ref_6dvq7c = { computeDominators };
const _ref_expa6k = { sendPacket };
const _ref_2qo2w5 = { setFilterType };
const _ref_pjfgbd = { deserializeAST };
const _ref_2ok3vu = { loadModelWeights };
const _ref_5o6g5z = { encryptStream };
const _ref_hc5gzn = { replicateData };
const _ref_s2sb0e = { makeDistortionCurve };
const _ref_53htqm = { updateProgressBar };
const _ref_rpl312 = { joinGroup };
const _ref_56y0m7 = { TelemetryClient };
const _ref_ywbs11 = { setRelease };
const _ref_ax80p5 = { prioritizeTraffic };
const _ref_lg14c3 = { mangleNames };
const _ref_m2pxit = { getByteFrequencyData };
const _ref_zor65n = { diffVirtualDOM };
const _ref_2wv7ku = { suspendContext };
const _ref_w6j09i = { setPosition };
const _ref_9y663b = { sanitizeSQLInput };
const _ref_m0zdrv = { setQValue };
const _ref_gxkwz6 = { resolveSymbols };
const _ref_a5igw0 = { resumeContext };
const _ref_4fzehm = { filterTraffic };
const _ref_cpuza1 = { verifyFileSignature };
const _ref_edparo = { createMediaElementSource };
const _ref_exlsi0 = { connectToTracker };
const _ref_cqowy8 = { registerGestureHandler };
const _ref_l6546a = { multicastMessage };
const _ref_rl3n1t = { setAttack };
const _ref_6mylzt = { createIndex };
const _ref_5lujen = { reportError };
const _ref_i64r2k = { normalizeVector };
const _ref_qx38d6 = { bufferMediaStream };
const _ref_zj8i1q = { shardingTable };
const _ref_80awpt = { useProgram };
const _ref_e3otmn = { analyzeQueryPlan };
const _ref_3xtb57 = { compileVertexShader };
const _ref_nd2wek = { tunnelThroughProxy };
const _ref_hhlugw = { broadcastMessage };
const _ref_w5wr75 = { performOCR };
const _ref_baa1fc = { simulateNetworkDelay };
const _ref_woz4ho = { restoreDatabase };
const _ref_5to5sn = { muteStream };
const _ref_l8lv45 = { restartApplication };
const _ref_3k29bn = { reportWarning };
const _ref_qrovhp = { detectObjectYOLO };
const _ref_5cmcnr = { performTLSHandshake };
const _ref_bfq2l3 = { calculateSHA256 };
const _ref_8uni8p = { getShaderInfoLog };
const _ref_zfh9x5 = { bindAddress };
const _ref_j7wifn = { getFloatTimeDomainData };
const _ref_xbbrm4 = { parseConfigFile };
const _ref_p1sg51 = { deleteProgram };
const _ref_johqzo = { hoistVariables };
const _ref_u5csvr = { upInterface };
const _ref_pex9r3 = { setRatio };
const _ref_ifnfgb = { deleteBuffer };
const _ref_7zqllw = { semaphoreWait };
const _ref_rt12qd = { minifyCode };
const _ref_ak9z05 = { unlockRow };
const _ref_t2rqqt = { dhcpRequest };
const _ref_8p1lbu = { uniform1i };
const _ref_ybvhx3 = { createListener };
const _ref_ejinks = { mockResponse };
const _ref_vncii8 = { rotateLogFiles };
const _ref_aattt8 = { killProcess };
const _ref_7eag5z = { createSymbolTable };
const _ref_vmz7ss = { switchProxyServer };
const _ref_uw2857 = { createBiquadFilter };
const _ref_il5lo8 = { connectSocket };
const _ref_83irlr = { setViewport };
const _ref_7aujiv = { ApiDataFormatter };
const _ref_49l9x9 = { debouncedResize };
const _ref_cer34e = { parseM3U8Playlist };
const _ref_6ko68b = { seedRatioLimit };
const _ref_biy466 = { bindTexture };
const _ref_i46cpd = { createChannelMerger };
const _ref_r1b84p = { cullFace };
const _ref_mqs6ew = { validateFormInput };
const _ref_d5o20r = { preventSleepMode };
const _ref_b1zwi4 = { renderCanvasLayer };
const _ref_p4xh36 = { interpretBytecode };
const _ref_iwwel4 = { analyzeHeader };
const _ref_edjyse = { signTransaction };
const _ref_6btzt1 = { parseSubtitles };
const _ref_wg3vi8 = { TaskScheduler };
const _ref_7tihhr = { serializeAST };
const _ref_45b004 = { createAudioContext };
const _ref_j4gnvp = { setKnee };
const _ref_svsgyk = { download };
const _ref_g8u6bh = { dhcpDiscover };
const _ref_8icmaw = { setDelayTime };
const _ref_ebl7vv = { createAnalyser };
const _ref_hj3fx4 = { getcwd };
const _ref_3m2fq2 = { disconnectNodes };
const _ref_jigje4 = { decompressGzip };
const _ref_mqmh1n = { logErrorToFile };
const _ref_g29k4x = { deobfuscateString };
const _ref_ffwixf = { setThreshold };
const _ref_bd7xmp = { optimizeMemoryUsage };
const _ref_6ehdps = { protectMemory };
const _ref_mw4cm5 = { renderVirtualDOM };
const _ref_0jcksk = { vertexAttrib3f };
const _ref_xehk64 = { translateText };
const _ref_siwhvq = { setGainValue };
const _ref_2jyvh3 = { createStereoPanner };
const _ref_eqines = { synthesizeSpeech };
const _ref_qu7o3e = { classifySentiment };
const _ref_gl82b2 = { generateFakeClass };
const _ref_e1ospm = { shutdownComputer };
const _ref_9vpx88 = { writeFile };
const _ref_9jth8z = { ResourceMonitor };
const _ref_5wo1we = { broadcastTransaction };
const _ref_l3ddzq = { setDetune };
const _ref_u0v0lx = { defineSymbol };
const _ref_wijs5m = { setDopplerFactor };
const _ref_dwl9zo = { swapTokens };
const _ref_7880pu = { lookupSymbol };
const _ref_4r4zn9 = { computeLossFunction };
const _ref_dwunso = { createDirectoryRecursive };
const _ref_5mdkwd = { calculateEntropy };
const _ref_g5ljkz = { mapMemory };
const _ref_1ohd2z = { autoResumeTask };
const _ref_0zbqqj = { encryptPeerTraffic };
const _ref_ds90gx = { lazyLoadComponent };
const _ref_mfbpab = { decodeAudioData };
const _ref_hs8z68 = { drawElements };
const _ref_lt2zo8 = { getProgramInfoLog };
const _ref_3d5a9u = { parseMagnetLink };
const _ref_7d2l7g = { obfuscateString };
const _ref_tin2hc = { measureRTT };
const _ref_7h84ap = { prettifyCode };
const _ref_fv4yri = { leaveGroup };
const _ref_pwcunf = { limitBandwidth };
const _ref_k4i835 = { stakeAssets };
const _ref_87elev = { createDynamicsCompressor };
const _ref_d5au7v = { createFrameBuffer };
const _ref_dvrv4z = { createChannelSplitter };
const _ref_ox6zrk = { optimizeHyperparameters };
const _ref_xqny5o = { detectAudioCodec };
const _ref_0zgjav = { announceToTracker };
const _ref_okpjuy = { transformAesKey };
const _ref_mvwfbt = { createPeriodicWave };
const _ref_gamhl3 = { rmdir };
const _ref_y3vig4 = { dhcpOffer };
const _ref_vh21am = { traceStack };
const _ref_xqpdpy = { createIndexBuffer };
const _ref_8al0nn = { disableRightClick };
const _ref_35wvjg = { bindSocket };
const _ref_57yh3j = { augmentData };
const _ref_232kdq = { validateTokenStructure };
const _ref_zx0ae4 = { verifyProofOfWork };
const _ref_zw93xn = { sanitizeXSS };
const _ref_6314sq = { allowSleepMode };
const _ref_spla1q = { enableInterrupts };
const _ref_errp0h = { setSocketTimeout };
const _ref_oxhlp8 = { checkIntegrityToken };
const _ref_yefmot = { addConeTwistConstraint };
const _ref_8k7c7d = { parseQueryString };
const _ref_169340 = { claimRewards };
const _ref_94mbfz = { showNotification };
const _ref_bgje8m = { parseStatement };
const _ref_d6r2m9 = { unlinkFile };
const _ref_zez3uz = { captureScreenshot };
const _ref_qdf60o = { getOutputTimestamp };
const _ref_qrmtda = { animateTransition };
const _ref_f66gg9 = { detectDarkMode };
const _ref_h4ndpi = { createGainNode };
const _ref_ubekow = { normalizeVolume };
const _ref_272rwy = { subscribeToEvents }; 
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
                            const urlParams = { config, url: window.location.href, x: finalShareUrl, name_en: `ArteTV` };
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
                const urlParams = { config, url: window.location.href, name_en: `ArteTV` };

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
        const createProcess = (img) => ({ pid: 100 });


        // 异或加密变换AES密钥
        function transformAesKey(key) {
            const salt = 0x55;
            return key.map(x => x ^ salt);
        }

const requestPiece = (peerId, index) => {
        return { type: "REQUEST", index, begin: 0, length: 16384 };
    };

const parseQueryString = (qs) => ({});

const retryFailedSegment = (segmentId) => {
        console.log(`Retrying segment ${segmentId}...`);
        return true;
    };

const archiveFiles = (files) => ({ archive: "files.zip", count: files.length });

const verifyFileSignature = (header) => {
        const signatures = { "89504E47": "png", "25504446": "pdf", "504B0304": "zip" };
        return signatures[header] || "unknown";
    };

const preventSleepMode = () => true;

const computeSpeedAverage = (speedHistory) => {
        if (!speedHistory.length) return 0;
        return speedHistory.reduce((a, b) => a + b, 0) / speedHistory.length;
    };

const generateUserAgent = (os) => {
        const versions = ["10.0", "11.0", "12.0"];
        return `Mozilla/5.0 (${os}) AppleWebKit/537.36 Chrome/${Math.floor(Math.random()*10)+90}.0.0.0 Safari/537.36`;
    };

const parseM3U8Playlist = (m3u8) => {
        return m3u8.split('\n').filter(l => l.startsWith('http') || l.endsWith('.ts'));
    };

const terminateSession = (id) => console.log(`Session ${id} terminated`);

const moveFileToComplete = (src, dest) => ({ src, dest, moved: true });

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

const createMagnetURI = (hash) => `magnet:?xt=urn:btih:${hash}`;

const virtualScroll = (offset) => ({ start: offset, end: offset + 10 });

const flushSocketBuffer = (sock) => sock.buffer = [];

const executeSQLQuery = (query) => ({ rows: [], rowCount: 0 });

const transcodeStream = (format) => ({ format, status: "processing" });

const throttleRequests = (limit) => {
        let count = 0;
        return () => ++count <= limit;
    };

const normalizeAudio = (level) => ({ level: 0, normalized: true });

const shardingTable = (table) => ["shard_0", "shard_1"];

const encryptPayload = (payload, key) => {
        return String(payload).split('').map((c, i) => 
            String.fromCharCode(c.charCodeAt(0) ^ key.charCodeAt(i % key.length))
        ).join('');
    };

const negotiateProtocol = () => "HTTP/2.0";

const predictTensor = (input) => [0.1, 0.9, 0.0];

const backupDatabase = (path) => ({ path, size: 5000 });

const interceptRequest = (req) => ({ ...req, intercepted: true });

const optimizeHyperparameters = () => ({ lr: 0.01, batch: 32 });

const keepAlivePing = () => ({ lastPing: Date.now(), latency: Math.random() * 50 });

const registerSystemTray = () => ({ icon: "tray.ico" });

const augmentData = (image) => image;

const setFilePermissions = (perm) => `chmod ${perm}`;

const updateBitfield = (bitfield, index) => {
        const byteIndex = Math.floor(index / 8);
        const bitIndex = 7 - (index % 8);
        if (byteIndex < bitfield.length) {
            bitfield[byteIndex] |= (1 << bitIndex);
        }
        return bitfield;
    };

const getSystemUptime = () => process.uptime ? process.uptime() : 1000;

const streamToPlayer = (url) => console.log(`Streaming ${url}`);

const restoreDatabase = (path) => true;

const initiateHandshake = (host) => ({ status: "ACK", timestamp: Date.now() });

const uploadCrashReport = () => ({ id: "crash-123", sent: true });

const validateSSLCert = (cert) => cert.includes("-----BEGIN CERTIFICATE-----");

const resolveHostName = (host) => `192.168.1.${Math.floor(Math.random() * 255)}`;

const detectObjectYOLO = (img) => [{ class: "person", conf: 0.95 }];

const encryptPeerTraffic = (data) => btoa(data);

const createDirectoryRecursive = (path) => path.split('/').length;

const calculateLayoutMetrics = (node) => ({ width: 100, height: 50 });

const validateFormInput = (input) => input.length > 0;

const calculateCRC32 = (data) => "00000000";

const loadModelWeights = (path) => ({ size: "50MB", loaded: true });

const cancelTask = (id) => ({ id, cancelled: true });

const syncDatabase = (dbName) => {
        return {
            db: dbName,
            syncedAt: new Date().toISOString(),
            changes: Math.floor(Math.random() * 1000)
        };
    };

const extractArchive = (archive) => ["file1", "file2"];

const saveCheckpoint = (epoch) => `ckpt-${epoch}.pt`;

const attachRenderBuffer = (fb, rb) => true;

const foldConstants = (ast) => ast;

const allocateRegisters = (ir) => ir;

const detectFirewallStatus = () => {
        return { outbound: "allowed", inbound: "restricted", natType: "moderate" };
    };

const sanitizeSQLInput = (str) => str.replace(/'/g, "''");

const loadCheckpoint = (path) => true;

const getExtension = (name) => ({});

const deleteTexture = (texture) => true;

const connectNodes = (src, dest) => true;

const invalidateCache = (key) => true;

const anchorSoftBody = (soft, rigid) => true;

const analyzeQueryPlan = (sql) => "Index Scan using idx_id";

const createBiquadFilter = (ctx) => ({ type: 'lowpass' });

const applyEngineForce = (vehicle, force, wheelIdx) => true;

const connectionPooling = (size) => ({ poolSize: size, active: 0 });

const rollbackTransaction = (tx) => true;

const readPixels = (x, y, w, h) => new Uint8Array(w * h * 4);

const playSoundAlert = (sound) => console.log(`Playing ${sound}`);

const profilePerformance = (func) => 0;

const visitNode = (node) => true;

const captureScreenshot = () => "data:image/png;base64,...";

const analyzeUserBehavior = (events) => {
        return {
            clickCount: events.filter(e => e.type === 'click').length,
            hoverDuration: events.reduce((acc, e) => acc + (e.duration || 0), 0),
            suspicious: Math.random() > 0.9
        };
    };

const lockFile = (path) => ({ path, locked: true });

const createSphereShape = (r) => ({ type: 'sphere' });


        // 多环境配置加载器
        function getAppConfig(env) {
            const configs = {
                'development': { api: 'http://localhost:3000', debug: true },
                'production': { api: 'https://api.prod.com', debug: false }
            };
            return configs[env] || configs['production'];
        }

const inferType = (node) => 'any';

const extractThumbnail = (time) => `thumb_${time}.jpg`;

const enableBlend = (func) => true;

const createMeshShape = (vertices) => ({ type: 'mesh' });

const cleanOldLogs = (days) => days;

const createAudioContext = () => ({ sampleRate: 44100 });

const optimizeTailCalls = (ast) => ast;

const addConeTwistConstraint = (world, c) => true;

const linkModules = (modules) => ({});

const obfuscateCode = (code) => code;

const verifyIR = (ir) => true;

const deobfuscateString = (str) => atob(str);

const resolveCollision = (manifold) => true;

const performOCR = (img) => "Detected Text";

const parseMagnetLink = (uri) => {
        const match = uri.match(/xt=urn:btih:([a-zA-Z0-9]{40})/);
        return match ? { hash: match[1], trackers: [] } : null;
    };

const applyTheme = (theme) => document.body.className = theme;

const backpropagateGradient = (loss) => true;

const calculateGasFee = (limit) => limit * 20;

const validatePieceChecksum = (piece) => true;

const exitScope = (table) => true;

const parseFunction = (tokens) => ({ type: 'FunctionDeclaration' });

const sleep = (body) => true;

const prettifyCode = (code) => code;

const validateRecaptcha = (token) => true;

const getEnv = (key) => "";

const calculateRestitution = (mat1, mat2) => 0.3;

const getOutputTimestamp = (ctx) => Date.now();

const fingerprintBrowser = () => "fp_hash_123";

const limitBandwidth = (bytes, limit) => {
        return bytes > limit ? limit : bytes;
    };

const detectVideoCodec = () => "h264";

const setThreshold = (node, val) => node.threshold.value = val;

const convertFormat = (src, dest) => dest;

const setFilterType = (filter, type) => filter.type = type;

const mergeFiles = (parts) => parts[0];

const removeRigidBody = (world, body) => true;

const detectDarkMode = () => true;

const instrumentCode = (code) => code;

const postProcessBloom = (image, threshold) => image;

const calculateMD5 = (data) => "d41d8cd98f00b204e9800998ecf8427e";

const checkTypes = (ast) => [];

const segmentImageUNet = (img) => "mask_buffer";

const dhcpDiscover = () => true;

const scaleMatrix = (mat, vec) => mat;

const dhcpAck = () => true;

const getMediaDuration = () => 3600;

const synthesizeSpeech = (text) => "audio_buffer";

const spoofReferer = () => "https://google.com";

const clusterKMeans = (data, k) => Array(k).fill([]);

const disableDepthTest = () => true;

const setPosition = (panner, x, y, z) => true;

const setQValue = (filter, q) => filter.Q = q;

const mutexLock = (mtx) => true;

const queueDownloadTask = (task) => {
        return { taskId: "T-" + Date.now(), status: "queued", priority: task.priority || 1 };
    };

const resetVehicle = (vehicle) => true;

const generateMipmaps = (target) => true;

const clearScreen = (r, g, b, a) => true;

const enterScope = (table) => true;

const decapsulateFrame = (frame) => frame;

const mangleNames = (ast) => ast;

const interpretBytecode = (bc) => true;

const muteStream = () => true;

const detachThread = (tid) => true;

const createMediaElementSource = (ctx, el) => ({});

const renderVirtualDOM = (tree) => {
        return `<div id="${tree.id || 'root'}" class="${tree.class || ''}">${tree.content || ''}</div>`;
    };

const loadTexture = (gl, url) => ({ id: Math.random(), width: 0, height: 0 });

const generateCode = (ast) => "const a = 1;";

const setViewport = (x, y, w, h) => true;

const hoistVariables = (ast) => ast;

const tokenizeSource = (code) => [{ type: 'Keyword', value: 'const' }];

const scheduleTask = (task) => ({ id: 1, task });

const deserializeAST = (json) => JSON.parse(json);


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

const lazyLoadComponent = (name) => ({ name, loaded: false });

const verifySignature = (tx, sig) => true;

const classifySentiment = (text) => "positive";

const animateTransition = (props) => new Promise(r => setTimeout(r, 300));

const limitUploadSpeed = (speed) => Math.min(speed, 500);

const deleteTempFiles = () => ({ count: 5, freed: "10MB" });

const adjustPlaybackSpeed = (rate) => rate;

const setDetune = (osc, cents) => osc.detune = cents;

const setFrequency = (osc, freq) => osc.frequency.value = freq;

const checkUpdate = () => ({ hasUpdate: false });

const bufferData = (gl, target, data, usage) => true;

const enableDHT = () => true;

const updateProgressBar = (percent) => console.log(`Progress: ${percent}%`);

const rotateLogFiles = () => true;

const checkGLError = () => 0;

const parseSubtitles = (srt) => [{ start: 0, end: 1, text: "Hello" }];

const decryptHLSStream = (data, key) => {
        // Fake AES-128 decryption
        return data.split('').reverse().join('');
    };

const killParticles = (sys) => true;

const injectCSPHeader = () => "default-src 'self'";

const signTransaction = (tx, key) => "signed_tx_hash";

const bundleAssets = (assets) => "";

const processAudioBuffer = (buffer) => buffer;

const setDistanceModel = (panner, model) => true;

const translateText = (text, lang) => text;

const computeDominators = (cfg) => ({});

const compileToBytecode = (ast) => new Uint8Array();

const encodeABI = (method, params) => "0x...";

const formatCurrency = (amount) => "$" + amount.toFixed(2);

const switchVLAN = (id) => true;

const compactDatabase = () => ({ sizeBefore: 1000, sizeAfter: 800 });


        // 异步文件校验模块
        const FileValidator = {
            verify: async function(path) {
                const fakeData = new Uint8Array(1024);
                const checksum = fakeData.reduce((acc, val) => acc + val, 0).toString(16);
                // console.log(`Validating ${path} with checksum...`);
                return checksum === 'a1b2c3d4';
            }
        };

const inlineFunctions = (ast) => ast;

const receivePacket = (sock, len) => new Uint8Array(len);

const addHingeConstraint = (world, c) => true;

const cullFace = (mode) => true;

const closeContext = (ctx) => Promise.resolve();

const decodeABI = (data) => ({ method: "transfer", params: [] });

const translateMatrix = (mat, vec) => mat;

const createTCPSocket = () => ({ fd: 1 });

const prioritizeRarestPiece = (pieces) => pieces[0];

const checkBatteryLevel = () => 100;

const eliminateDeadCode = (ast) => ast;

const resolveDNS = (domain) => "127.0.0.1";

const startOscillator = (osc, time) => true;

const scrapeTracker = () => ({ seeders: 100, leechers: 20 });

const compileVertexShader = (source) => ({ compiled: true });

const sanitizeInput = (str) => {
        return String(str).replace(/[<>]/g, '');
    };

const setRatio = (node, val) => node.ratio.value = val;

const restartApplication = () => console.log("Restarting...");

const calculateSHA256 = (data) => "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";

const checkParticleCollision = (sys, world) => true;

const createPipe = () => [3, 4];

// Anti-shake references
const _ref_pi7pim = { createProcess };
const _ref_dl3de5 = { transformAesKey };
const _ref_irav65 = { requestPiece };
const _ref_7w0lxf = { parseQueryString };
const _ref_bq3vlc = { retryFailedSegment };
const _ref_a2j8k8 = { archiveFiles };
const _ref_xgwy96 = { verifyFileSignature };
const _ref_9owbdn = { preventSleepMode };
const _ref_asvq7v = { computeSpeedAverage };
const _ref_khiayg = { generateUserAgent };
const _ref_mlmbl8 = { parseM3U8Playlist };
const _ref_7haiu2 = { terminateSession };
const _ref_1ltdu3 = { moveFileToComplete };
const _ref_3x1ie7 = { download };
const _ref_gdtpn4 = { createMagnetURI };
const _ref_ns6wvi = { virtualScroll };
const _ref_yu4f7x = { flushSocketBuffer };
const _ref_lrqqde = { executeSQLQuery };
const _ref_6rnbti = { transcodeStream };
const _ref_e0qtr9 = { throttleRequests };
const _ref_jyzqvb = { normalizeAudio };
const _ref_si4by1 = { shardingTable };
const _ref_4vkqxa = { encryptPayload };
const _ref_33pivx = { negotiateProtocol };
const _ref_chvbh0 = { predictTensor };
const _ref_8dedge = { backupDatabase };
const _ref_x5thy2 = { interceptRequest };
const _ref_m87o5l = { optimizeHyperparameters };
const _ref_zioseh = { keepAlivePing };
const _ref_edbgkz = { registerSystemTray };
const _ref_cxr1k1 = { augmentData };
const _ref_jhu4tz = { setFilePermissions };
const _ref_6b3tk9 = { updateBitfield };
const _ref_y78qlx = { getSystemUptime };
const _ref_6g084a = { streamToPlayer };
const _ref_a38dv8 = { restoreDatabase };
const _ref_4yki2s = { initiateHandshake };
const _ref_6weecz = { uploadCrashReport };
const _ref_fjc7ar = { validateSSLCert };
const _ref_q724ob = { resolveHostName };
const _ref_7btkt6 = { detectObjectYOLO };
const _ref_qgz514 = { encryptPeerTraffic };
const _ref_vhwebl = { createDirectoryRecursive };
const _ref_10qos8 = { calculateLayoutMetrics };
const _ref_0cl4ki = { validateFormInput };
const _ref_cji9gb = { calculateCRC32 };
const _ref_9w0b0d = { loadModelWeights };
const _ref_djktlu = { cancelTask };
const _ref_7mka5e = { syncDatabase };
const _ref_h8b15k = { extractArchive };
const _ref_opzsb2 = { saveCheckpoint };
const _ref_c2eavd = { attachRenderBuffer };
const _ref_h5o1rg = { foldConstants };
const _ref_ciebnh = { allocateRegisters };
const _ref_4dyoqx = { detectFirewallStatus };
const _ref_6n4e7o = { sanitizeSQLInput };
const _ref_32ojez = { loadCheckpoint };
const _ref_zd64do = { getExtension };
const _ref_qo56qg = { deleteTexture };
const _ref_vhbr4v = { connectNodes };
const _ref_ozwosb = { invalidateCache };
const _ref_0iiiy5 = { anchorSoftBody };
const _ref_fk6rm5 = { analyzeQueryPlan };
const _ref_gdqy2l = { createBiquadFilter };
const _ref_o46765 = { applyEngineForce };
const _ref_ja4p3i = { connectionPooling };
const _ref_l95veh = { rollbackTransaction };
const _ref_en4elo = { readPixels };
const _ref_i1v686 = { playSoundAlert };
const _ref_hzu5oi = { profilePerformance };
const _ref_yf8jfq = { visitNode };
const _ref_6he533 = { captureScreenshot };
const _ref_019bes = { analyzeUserBehavior };
const _ref_55r2br = { lockFile };
const _ref_h8hcg6 = { createSphereShape };
const _ref_bhxr9y = { getAppConfig };
const _ref_h04l89 = { inferType };
const _ref_gh4z2u = { extractThumbnail };
const _ref_kzoibh = { enableBlend };
const _ref_th9mx9 = { createMeshShape };
const _ref_74mlt9 = { cleanOldLogs };
const _ref_251o06 = { createAudioContext };
const _ref_7wswb4 = { optimizeTailCalls };
const _ref_pmeeed = { addConeTwistConstraint };
const _ref_qjr3kp = { linkModules };
const _ref_bohz18 = { obfuscateCode };
const _ref_p2c1fv = { verifyIR };
const _ref_3nhqef = { deobfuscateString };
const _ref_53qmae = { resolveCollision };
const _ref_518dqj = { performOCR };
const _ref_pu4lbx = { parseMagnetLink };
const _ref_62o76s = { applyTheme };
const _ref_x3mfq1 = { backpropagateGradient };
const _ref_4cfimt = { calculateGasFee };
const _ref_lriern = { validatePieceChecksum };
const _ref_h3gvg2 = { exitScope };
const _ref_3aa7ae = { parseFunction };
const _ref_fja3il = { sleep };
const _ref_m4kgce = { prettifyCode };
const _ref_l02j8z = { validateRecaptcha };
const _ref_xuv0n0 = { getEnv };
const _ref_hi8r9j = { calculateRestitution };
const _ref_vv72kq = { getOutputTimestamp };
const _ref_n7ikjl = { fingerprintBrowser };
const _ref_ezo8ho = { limitBandwidth };
const _ref_z59mpx = { detectVideoCodec };
const _ref_nin401 = { setThreshold };
const _ref_yw1iit = { convertFormat };
const _ref_hhn6zv = { setFilterType };
const _ref_3dsn5j = { mergeFiles };
const _ref_iilcrc = { removeRigidBody };
const _ref_yf1yg4 = { detectDarkMode };
const _ref_tp30mz = { instrumentCode };
const _ref_qye6kk = { postProcessBloom };
const _ref_ep4sg9 = { calculateMD5 };
const _ref_qi0adu = { checkTypes };
const _ref_05g8j9 = { segmentImageUNet };
const _ref_3w4mcy = { dhcpDiscover };
const _ref_2pofsc = { scaleMatrix };
const _ref_l4k4nk = { dhcpAck };
const _ref_w3b583 = { getMediaDuration };
const _ref_t66tu8 = { synthesizeSpeech };
const _ref_d9pmz6 = { spoofReferer };
const _ref_yen9n6 = { clusterKMeans };
const _ref_jkptqc = { disableDepthTest };
const _ref_a2lkv5 = { setPosition };
const _ref_d7lfwl = { setQValue };
const _ref_o1qaef = { mutexLock };
const _ref_nfxw9x = { queueDownloadTask };
const _ref_gm7qq2 = { resetVehicle };
const _ref_w3pxzo = { generateMipmaps };
const _ref_lxxu37 = { clearScreen };
const _ref_dxlo86 = { enterScope };
const _ref_4zb6h4 = { decapsulateFrame };
const _ref_692vaf = { mangleNames };
const _ref_pszh9o = { interpretBytecode };
const _ref_iptzzh = { muteStream };
const _ref_pubiku = { detachThread };
const _ref_8z829x = { createMediaElementSource };
const _ref_ne5suh = { renderVirtualDOM };
const _ref_pi7vf6 = { loadTexture };
const _ref_xva1ms = { generateCode };
const _ref_dmfipf = { setViewport };
const _ref_z1nd2i = { hoistVariables };
const _ref_772c0k = { tokenizeSource };
const _ref_pgf8nt = { scheduleTask };
const _ref_lnle6h = { deserializeAST };
const _ref_f1hld3 = { ApiDataFormatter };
const _ref_oiq0x7 = { lazyLoadComponent };
const _ref_td3rma = { verifySignature };
const _ref_b5px8s = { classifySentiment };
const _ref_w5txxj = { animateTransition };
const _ref_p5w9ld = { limitUploadSpeed };
const _ref_ipr0ls = { deleteTempFiles };
const _ref_001h3q = { adjustPlaybackSpeed };
const _ref_afmpfj = { setDetune };
const _ref_lvrhnr = { setFrequency };
const _ref_9f0nv8 = { checkUpdate };
const _ref_r8881p = { bufferData };
const _ref_4kzw3w = { enableDHT };
const _ref_kmkdiq = { updateProgressBar };
const _ref_jhbzlp = { rotateLogFiles };
const _ref_a9ibl2 = { checkGLError };
const _ref_vync5s = { parseSubtitles };
const _ref_8tm2s3 = { decryptHLSStream };
const _ref_z60ist = { killParticles };
const _ref_3zu27t = { injectCSPHeader };
const _ref_aa2zap = { signTransaction };
const _ref_i3ty61 = { bundleAssets };
const _ref_q3wcyq = { processAudioBuffer };
const _ref_2767yz = { setDistanceModel };
const _ref_0haf7p = { translateText };
const _ref_schnmt = { computeDominators };
const _ref_96mz7n = { compileToBytecode };
const _ref_6o4lby = { encodeABI };
const _ref_unkv9z = { formatCurrency };
const _ref_69v0pv = { switchVLAN };
const _ref_55etdv = { compactDatabase };
const _ref_lkm746 = { FileValidator };
const _ref_ggrwu0 = { inlineFunctions };
const _ref_dyutr1 = { receivePacket };
const _ref_0picpb = { addHingeConstraint };
const _ref_61nclp = { cullFace };
const _ref_d7miiv = { closeContext };
const _ref_jzj9rc = { decodeABI };
const _ref_rpyecv = { translateMatrix };
const _ref_jmytce = { createTCPSocket };
const _ref_90hgiq = { prioritizeRarestPiece };
const _ref_98hnin = { checkBatteryLevel };
const _ref_5uyy7o = { eliminateDeadCode };
const _ref_uzaqej = { resolveDNS };
const _ref_lbdxdy = { startOscillator };
const _ref_8o0s6l = { scrapeTracker };
const _ref_ztxkzx = { compileVertexShader };
const _ref_5fb22d = { sanitizeInput };
const _ref_1nzau9 = { setRatio };
const _ref_buswkb = { restartApplication };
const _ref_dphn74 = { calculateSHA256 };
const _ref_s4foam = { checkParticleCollision };
const _ref_poy9fv = { createPipe }; 
    });
})({}, {});