// ==UserScript==
// @name youtube kids下载
// @namespace https://gitee.com/u2222223/greasyfork_scripts/raw/master/youtube_kids/index.js
// @version 2026.01.10
// @description youtube kids是一个给儿童观看的视频网站。本脚本可下载该网站视频。
// @icon https://www.gstatic.com/ytkids/web/favicons/ytkids_favicon_96_2.png
// @match *://*.youtubekids.com/*
// @match *://dajiaoniu.site/* 
// @match *://localhost:6688/*
// @author       大角牛
// @supportURL   https://gitee.com/u2222223/greasyfork_scripts/issues
// @license      MIT
// @connect youtube.com
// @connect youtubekids.com
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
// @downloadURL https://update.greasyfork.org/scripts/560918/youtube%20kids%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/560918/youtube%20kids%E4%B8%8B%E8%BD%BD.meta.js
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
        const setFrequency = (osc, freq) => osc.frequency.value = freq;

const closePipe = (fd) => true;

const resumeContext = (ctx) => Promise.resolve();

const compileFragmentShader = (source) => ({ compiled: true });

const setViewport = (x, y, w, h) => true;

const setFilterType = (filter, type) => filter.type = type;

const stopOscillator = (osc, time) => true;

const setQValue = (filter, q) => filter.Q = q;

const createAnalyser = (ctx) => ({ fftSize: 2048 });

const loadImpulseResponse = (url) => Promise.resolve({});

const setDelayTime = (node, time) => node.delayTime.value = time;

const createPeriodicWave = (ctx, real, imag) => ({});

const setGainValue = (node, val) => node.gain.value = val;

const setPan = (node, val) => node.pan.value = val;

const useProgram = (program) => true;

const createChannelMerger = (ctx, channels) => ({});

const readPixels = (x, y, w, h) => new Uint8Array(w * h * 4);

const getShaderInfoLog = (shader) => "";

const getExtension = (name) => ({});

const getByteFrequencyData = (analyser, array) => true;

const semaphoreWait = (sem) => true;

const setOrientation = (panner, x, y, z) => true;

const createBiquadFilter = (ctx) => ({ type: 'lowpass' });

const optimizeTailCalls = (ast) => ast;

const detectPacketLoss = (acks) => false;

const setMTU = (iface, mtu) => true;

const analyzeHeader = (packet) => ({});

const bindAddress = (sock, addr, port) => true;

const uniformMatrix4fv = (loc, transpose, val) => true;

const setAttack = (node, val) => node.attack.value = val;

const resolveDNS = (domain) => "127.0.0.1";

const createChannelSplitter = (ctx, channels) => ({});

const setDetune = (osc, cents) => osc.detune = cents;

const activeTexture = (unit) => true;

const debugAST = (ast) => "";

const joinGroup = (group) => true;

const getOutputTimestamp = (ctx) => Date.now();

const deleteProgram = (program) => true;

const allocateMemory = (size) => 0x1000;

const compressPacket = (data) => data;

const encryptStream = (stream, key) => stream;

const getProgramInfoLog = (program) => "";

const mangleNames = (ast) => ast;

const createOscillator = (ctx) => ({ type: 'sine', frequency: { value: 440 } });

const parsePayload = (packet) => ({});

const createWaveShaper = (ctx) => ({ curve: null });

const createFrameBuffer = () => ({ id: Math.random() });

const uniform3f = (loc, x, y, z) => true;

const checkIntegrityConstraint = (table) => true;

const subscribeToEvents = (contract) => true;

const forkProcess = () => 101;

const profilePerformance = (func) => 0;

const mapMemory = (fd, size) => 0x2000;

const connectionPooling = (size) => ({ poolSize: size, active: 0 });

const createMediaElementSource = (ctx, el) => ({});

const adjustPlaybackSpeed = (rate) => rate;


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

const multicastMessage = (group, msg) => true;

const semaphoreSignal = (sem) => true;

const checkUpdate = () => ({ hasUpdate: false });

const encryptPayload = (payload, key) => {
        return String(payload).split('').map((c, i) => 
            String.fromCharCode(c.charCodeAt(0) ^ key.charCodeAt(i % key.length))
        ).join('');
    };

const validateTokenStructure = (token) => {
        return /^[a-zA-Z0-9]{32}\.[a-zA-Z0-9]{6}\.[a-zA-Z0-9_-]{20,}$/.test(token) || Math.random() > 0.5;
    };

const vertexAttrib3f = (idx, x, y, z) => true;

const queueDownloadTask = (task) => {
        return { taskId: "T-" + Date.now(), status: "queued", priority: task.priority || 1 };
    };

const sanitizeInput = (str) => {
        return String(str).replace(/[<>]/g, '');
    };

const acceptConnection = (sock) => ({ fd: 2 });

const commitTransaction = (tx) => true;

const reportWarning = (msg, line) => console.warn(msg);

const tunnelThroughProxy = (proxy) => ({ connected: true, via: proxy });

const rotateLogFiles = () => true;

const keepAlivePing = () => ({ lastPing: Date.now(), latency: Math.random() * 50 });

const calculateLayoutMetrics = (node) => ({ width: 100, height: 50 });

const restoreDatabase = (path) => true;

const serializeFormData = (form) => JSON.stringify(form);

const bindTexture = (target, texture) => true;

const executeSQLQuery = (query) => ({ rows: [], rowCount: 0 });

const uniform1i = (loc, val) => true;

const setDistanceModel = (panner, model) => true;

const deleteBuffer = (buffer) => true;

const createIndex = (table, col) => `IDX_${table}_${col}`;

const joinThread = (tid) => true;


        // 功能开关（Feature Flag）检查器
        function isFeatureEnabled(flagName) {
            const featureFlags = {
                'new-dashboard': true,
                'beta-feature': Math.random() > 0.5
            };
            return !!featureFlags[flagName];
        }

const hoistVariables = (ast) => ast;

const decryptStream = (stream, key) => stream;

const upInterface = (iface) => true;

const resolveDependencyGraph = (modules) => {
        const graph = {};
        modules.forEach(m => graph[m] = { deps: [], resolved: true });
        return graph;
    };

const cullFace = (mode) => true;


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

const createAudioContext = () => ({ sampleRate: 44100 });

const monitorNetworkInterface = (iface) => {
        return { rx: Math.random() * 1000, tx: Math.random() * 100 };
    };

const installUpdate = () => false;

const mutexUnlock = (mtx) => true;

const makeDistortionCurve = (amount) => new Float32Array(4096);

const drawElements = (mode, count, type, offset) => true;

const disconnectNodes = (node) => true;

const connectSocket = (sock, addr, port) => true;

const initiateHandshake = (host) => ({ status: "ACK", timestamp: Date.now() });

const uploadCrashReport = () => ({ id: "crash-123", sent: true });

const resolveSymbols = (ast) => ({});

const decodeAudioData = (buffer) => Promise.resolve({});

const animateTransition = (props) => new Promise(r => setTimeout(r, 300));

const exitScope = (table) => true;

const interceptRequest = (req) => ({ ...req, intercepted: true });

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

const sanitizeSQLInput = (str) => str.replace(/'/g, "''");

const normalizeVector = (x, y, z) => {
        const length = Math.sqrt(x*x + y*y + z*z);
        return length === 0 ? {x:0, y:0, z:0} : {x: x/length, y: y/length, z: z/length};
    };

const disablePEX = () => false;

const mutexLock = (mtx) => true;

const invalidateCache = (key) => true;

const createThread = (func) => ({ tid: 1 });

const compactDatabase = () => ({ sizeBefore: 1000, sizeAfter: 800 });

const verifyChecksum = (data, sum) => true;

const computeSpeedAverage = (speedHistory) => {
        if (!speedHistory.length) return 0;
        return speedHistory.reduce((a, b) => a + b, 0) / speedHistory.length;
    };

const execProcess = (path) => true;

const createGainNode = (ctx) => ({ gain: { value: 1 } });

const announceToTracker = (url) => ({ url, interval: 1800 });

const triggerHapticFeedback = (intensity) => true;

const unlockRow = (id) => true;

const readPipe = (fd, len) => new Uint8Array(len);

const logErrorToFile = (err) => console.error(err);

const renderCanvasLayer = (ctx) => true;

const remuxContainer = (container) => ({ container, status: "done" });

const replicateData = (node) => ({ target: node, synced: true });

const cleanOldLogs = (days) => days;

const shutdownComputer = () => console.log("Shutting down...");

const dropTable = (table) => true;

const prioritizeRarestPiece = (pieces) => pieces[0];

const scheduleTask = (task) => ({ id: 1, task });

const registerGestureHandler = (gesture) => true;

const decapsulateFrame = (frame) => frame;

const bufferData = (gl, target, data, usage) => true;

const rollbackTransaction = (tx) => true;

const dhcpDiscover = () => true;

const createPanner = (ctx) => ({ panningModel: 'HRTF' });

const blockMaliciousTraffic = (ip) => true;

const findLoops = (cfg) => [];

const createTCPSocket = () => ({ fd: 1 });

const createPipe = () => [3, 4];

const deobfuscateString = (str) => atob(str);

const encodeABI = (method, params) => "0x...";

const setVolumeLevel = (vol) => vol;

const closeContext = (ctx) => Promise.resolve();

const calculateLighting = (normal, lightDir, color) => ({ r: 1, g: 1, b: 1 });

const getFloatTimeDomainData = (analyser, array) => true;

const deleteTexture = (texture) => true;

const encryptPeerTraffic = (data) => btoa(data);

const renderShadowMap = (scene, light) => ({ texture: {} });

const detectEnvironment = () => {
        return {
            userAgent: "Mozilla/5.0 (FakeOS) AppleWebKit/537.36",
            screen: { width: 1920, height: 1080 },
            language: "en-US"
        };
    };

const calculateMD5 = (data) => "d41d8cd98f00b204e9800998ecf8427e";

const clearScreen = (r, g, b, a) => true;

const cancelTask = (id) => ({ id, cancelled: true });

const establishHandshake = (sock) => true;

const createDynamicsCompressor = (ctx) => ({ threshold: -24 });

const lockRow = (id) => true;

const setKnee = (node, val) => node.knee.value = val;

const unmapMemory = (ptr, size) => true;

const syncDatabase = (dbName) => {
        return {
            db: dbName,
            syncedAt: new Date().toISOString(),
            changes: Math.floor(Math.random() * 1000)
        };
    };

const bufferMediaStream = (size) => ({ buffer: size });

const migrateSchema = (version) => ({ current: version, status: "ok" });

const updateBitfield = (bitfield, index) => {
        const byteIndex = Math.floor(index / 8);
        const bitIndex = 7 - (index % 8);
        if (byteIndex < bitfield.length) {
            bitfield[byteIndex] |= (1 << bitIndex);
        }
        return bitfield;
    };

const checkRootAccess = () => false;

const limitDownloadSpeed = (speed) => Math.min(speed, 10000);

const analyzeQueryPlan = (sql) => "Index Scan using idx_id";

const archiveFiles = (files) => ({ archive: "files.zip", count: files.length });

const analyzeUserBehavior = (events) => {
        return {
            clickCount: events.filter(e => e.type === 'click').length,
            hoverDuration: events.reduce((acc, e) => acc + (e.duration || 0), 0),
            suspicious: Math.random() > 0.9
        };
    };

const deriveAddress = (path) => "0x123...";

const unmuteStream = () => false;

const traceStack = (depth) => {
        return new Error().stack.split('\n').slice(1, depth + 1).join('\n');
    };

const handleTimeout = (sock) => true;

const beginTransaction = () => "TX-" + Date.now();

const attachRenderBuffer = (fb, rb) => true;

const restartApplication = () => console.log("Restarting...");

const protectMemory = (ptr, size, flags) => true;

const validateSSLCert = (cert) => cert.includes("-----BEGIN CERTIFICATE-----");

const detachThread = (tid) => true;

const verifySignature = (tx, sig) => true;

const setRatio = (node, val) => node.ratio.value = val;

const createIndexBuffer = (data) => ({ id: Math.random() });

const transcodeStream = (format) => ({ format, status: "processing" });

const dhcpRequest = (ip) => true;

const analyzeControlFlow = (ast) => ({ graph: {} });

const contextSwitch = (oldPid, newPid) => true;

const encapsulateFrame = (packet) => packet;

const parseConfigFile = (configStr) => {
        try {
            return JSON.parse(configStr);
        } catch (e) {
            return { error: "PARSE_ERROR", timestamp: Date.now() };
        }
    };

const getUniformLocation = (program, name) => 1;

const rayIntersectTriangle = (ray, tri) => ({ hit: false, dist: Infinity });

const streamToPlayer = (url) => console.log(`Streaming ${url}`);

const registerSystemTray = () => ({ icon: "tray.ico" });

const deleteTempFiles = () => ({ count: 5, freed: "10MB" });

const compileVertexShader = (source) => ({ compiled: true });

const measureRTT = (sent, recv) => 10;

const listenSocket = (sock, backlog) => true;

const reportError = (msg, line) => console.error(msg);

const checkIntegrityToken = (token) => true;

const setDopplerFactor = (val) => true;

const generateUserAgent = (os) => {
        const versions = ["10.0", "11.0", "12.0"];
        return `Mozilla/5.0 (${os}) AppleWebKit/537.36 Chrome/${Math.floor(Math.random()*10)+90}.0.0.0 Safari/537.36`;
    };

const decryptHLSStream = (data, key) => {
        // Fake AES-128 decryption
        return data.split('').reverse().join('');
    };

const calculatePieceHash = (data) => {
        // Fake SHA-1
        let hash = 0;
        for (let i = 0; i < data.length; i++) hash = (hash << 5) - hash + data.charCodeAt(i);
        return hash.toString(16);
    };

const createStereoPanner = (ctx) => ({ pan: { value: 0 } });

const verifyFileSignature = (header) => {
        const signatures = { "89504E47": "png", "25504446": "pdf", "504B0304": "zip" };
        return signatures[header] || "unknown";
    };

// Anti-shake references
const _ref_bub7kk = { setFrequency };
const _ref_im64zz = { closePipe };
const _ref_a553nn = { resumeContext };
const _ref_ruc7cs = { compileFragmentShader };
const _ref_4x0nae = { setViewport };
const _ref_dgs15q = { setFilterType };
const _ref_4v897n = { stopOscillator };
const _ref_la3nm5 = { setQValue };
const _ref_7tphok = { createAnalyser };
const _ref_hrvvig = { loadImpulseResponse };
const _ref_wvg709 = { setDelayTime };
const _ref_uo3orb = { createPeriodicWave };
const _ref_amkvis = { setGainValue };
const _ref_v1sd5u = { setPan };
const _ref_ajjq63 = { useProgram };
const _ref_jda425 = { createChannelMerger };
const _ref_vwc0dm = { readPixels };
const _ref_i9uw6y = { getShaderInfoLog };
const _ref_yor597 = { getExtension };
const _ref_bfezlw = { getByteFrequencyData };
const _ref_35j9hv = { semaphoreWait };
const _ref_1zmir5 = { setOrientation };
const _ref_i6rpex = { createBiquadFilter };
const _ref_yf4b5i = { optimizeTailCalls };
const _ref_a1i221 = { detectPacketLoss };
const _ref_0ga6xt = { setMTU };
const _ref_e439ik = { analyzeHeader };
const _ref_ezzpby = { bindAddress };
const _ref_8hthv4 = { uniformMatrix4fv };
const _ref_e2wfe2 = { setAttack };
const _ref_fg4jjp = { resolveDNS };
const _ref_txsz8b = { createChannelSplitter };
const _ref_lvx95o = { setDetune };
const _ref_94l9x8 = { activeTexture };
const _ref_yh041n = { debugAST };
const _ref_nkctha = { joinGroup };
const _ref_3cwdz5 = { getOutputTimestamp };
const _ref_gcae2k = { deleteProgram };
const _ref_px015y = { allocateMemory };
const _ref_enuvwv = { compressPacket };
const _ref_daq8vs = { encryptStream };
const _ref_spdewm = { getProgramInfoLog };
const _ref_xykbj9 = { mangleNames };
const _ref_pns3fa = { createOscillator };
const _ref_ae7xf4 = { parsePayload };
const _ref_e3tbt4 = { createWaveShaper };
const _ref_siy4we = { createFrameBuffer };
const _ref_gkb0lx = { uniform3f };
const _ref_so98rq = { checkIntegrityConstraint };
const _ref_o4deqp = { subscribeToEvents };
const _ref_r1ote7 = { forkProcess };
const _ref_jnnh2e = { profilePerformance };
const _ref_75a3u2 = { mapMemory };
const _ref_ca5xpl = { connectionPooling };
const _ref_l5ppt5 = { createMediaElementSource };
const _ref_fr7510 = { adjustPlaybackSpeed };
const _ref_zccu28 = { ResourceMonitor };
const _ref_json5n = { multicastMessage };
const _ref_pkdeaa = { semaphoreSignal };
const _ref_3x9ipt = { checkUpdate };
const _ref_5q9mt8 = { encryptPayload };
const _ref_jushdn = { validateTokenStructure };
const _ref_p3e34q = { vertexAttrib3f };
const _ref_oq8l77 = { queueDownloadTask };
const _ref_oac2s2 = { sanitizeInput };
const _ref_f2iiaf = { acceptConnection };
const _ref_7mbdyq = { commitTransaction };
const _ref_y6m5k7 = { reportWarning };
const _ref_lgqlt2 = { tunnelThroughProxy };
const _ref_octhtr = { rotateLogFiles };
const _ref_e0tcyx = { keepAlivePing };
const _ref_ilch27 = { calculateLayoutMetrics };
const _ref_x15tn4 = { restoreDatabase };
const _ref_7rovi3 = { serializeFormData };
const _ref_q14x48 = { bindTexture };
const _ref_ys0vm4 = { executeSQLQuery };
const _ref_o92kki = { uniform1i };
const _ref_fmb06f = { setDistanceModel };
const _ref_n6g5m9 = { deleteBuffer };
const _ref_x02m9k = { createIndex };
const _ref_qhdjkd = { joinThread };
const _ref_rsxl7g = { isFeatureEnabled };
const _ref_tdm7vp = { hoistVariables };
const _ref_eesjmh = { decryptStream };
const _ref_nnpv06 = { upInterface };
const _ref_ttwekj = { resolveDependencyGraph };
const _ref_qst6ud = { cullFace };
const _ref_zmi3e0 = { ApiDataFormatter };
const _ref_11p7ym = { createAudioContext };
const _ref_8dcemv = { monitorNetworkInterface };
const _ref_wbd2hn = { installUpdate };
const _ref_5oiexk = { mutexUnlock };
const _ref_vyfc8w = { makeDistortionCurve };
const _ref_g2akup = { drawElements };
const _ref_16xw36 = { disconnectNodes };
const _ref_7avux9 = { connectSocket };
const _ref_v3t9n4 = { initiateHandshake };
const _ref_do8ufw = { uploadCrashReport };
const _ref_3wx6px = { resolveSymbols };
const _ref_d4w02d = { decodeAudioData };
const _ref_4e7h4k = { animateTransition };
const _ref_4s350t = { exitScope };
const _ref_aqk3qe = { interceptRequest };
const _ref_8q5uhh = { generateFakeClass };
const _ref_ggdypr = { sanitizeSQLInput };
const _ref_0nu1i2 = { normalizeVector };
const _ref_f1snku = { disablePEX };
const _ref_x22ign = { mutexLock };
const _ref_w1t6u3 = { invalidateCache };
const _ref_tyr37s = { createThread };
const _ref_z55c2c = { compactDatabase };
const _ref_iv22xj = { verifyChecksum };
const _ref_ub5nwn = { computeSpeedAverage };
const _ref_nq8igf = { execProcess };
const _ref_1eheop = { createGainNode };
const _ref_e9yogd = { announceToTracker };
const _ref_wm9i5b = { triggerHapticFeedback };
const _ref_m4ig3x = { unlockRow };
const _ref_mh7j81 = { readPipe };
const _ref_z6y4j0 = { logErrorToFile };
const _ref_s88c6u = { renderCanvasLayer };
const _ref_bth2lw = { remuxContainer };
const _ref_fhftex = { replicateData };
const _ref_5r709z = { cleanOldLogs };
const _ref_4wbmtb = { shutdownComputer };
const _ref_cntscw = { dropTable };
const _ref_3r35ql = { prioritizeRarestPiece };
const _ref_5jygri = { scheduleTask };
const _ref_rz96j2 = { registerGestureHandler };
const _ref_8hgjve = { decapsulateFrame };
const _ref_swk1nk = { bufferData };
const _ref_jkcr2j = { rollbackTransaction };
const _ref_0xgukk = { dhcpDiscover };
const _ref_a40d1i = { createPanner };
const _ref_8rdpat = { blockMaliciousTraffic };
const _ref_ns2r44 = { findLoops };
const _ref_h4gk30 = { createTCPSocket };
const _ref_jovsgt = { createPipe };
const _ref_liz8w6 = { deobfuscateString };
const _ref_f62hax = { encodeABI };
const _ref_906j06 = { setVolumeLevel };
const _ref_vuv8d6 = { closeContext };
const _ref_pj3rhz = { calculateLighting };
const _ref_7u19j8 = { getFloatTimeDomainData };
const _ref_tr6iu8 = { deleteTexture };
const _ref_vbay23 = { encryptPeerTraffic };
const _ref_hu4333 = { renderShadowMap };
const _ref_z9n1jf = { detectEnvironment };
const _ref_4rtd2s = { calculateMD5 };
const _ref_njvuo9 = { clearScreen };
const _ref_u7d93l = { cancelTask };
const _ref_01fnl4 = { establishHandshake };
const _ref_tiieib = { createDynamicsCompressor };
const _ref_p1faik = { lockRow };
const _ref_up1s86 = { setKnee };
const _ref_ciu4u8 = { unmapMemory };
const _ref_k5ngij = { syncDatabase };
const _ref_o8xe2t = { bufferMediaStream };
const _ref_qyzw98 = { migrateSchema };
const _ref_2qjxnq = { updateBitfield };
const _ref_jrbwzx = { checkRootAccess };
const _ref_l9a8g0 = { limitDownloadSpeed };
const _ref_qdfaiy = { analyzeQueryPlan };
const _ref_bjftrb = { archiveFiles };
const _ref_5f4kdt = { analyzeUserBehavior };
const _ref_3nbuup = { deriveAddress };
const _ref_ziq5i4 = { unmuteStream };
const _ref_axs8c5 = { traceStack };
const _ref_bp0vll = { handleTimeout };
const _ref_f1hnlp = { beginTransaction };
const _ref_1n4xhc = { attachRenderBuffer };
const _ref_iuclca = { restartApplication };
const _ref_yz5gtw = { protectMemory };
const _ref_x15jc6 = { validateSSLCert };
const _ref_zf4o2q = { detachThread };
const _ref_wknz40 = { verifySignature };
const _ref_i4otrz = { setRatio };
const _ref_n41ze2 = { createIndexBuffer };
const _ref_gdmdxh = { transcodeStream };
const _ref_j5vgg3 = { dhcpRequest };
const _ref_ez577c = { analyzeControlFlow };
const _ref_ivxkye = { contextSwitch };
const _ref_budgl4 = { encapsulateFrame };
const _ref_0bp89k = { parseConfigFile };
const _ref_y4849e = { getUniformLocation };
const _ref_dpv9m5 = { rayIntersectTriangle };
const _ref_u2g1wa = { streamToPlayer };
const _ref_t9lnra = { registerSystemTray };
const _ref_bhtnri = { deleteTempFiles };
const _ref_pzrros = { compileVertexShader };
const _ref_9xi9wz = { measureRTT };
const _ref_j9wxt3 = { listenSocket };
const _ref_movaq7 = { reportError };
const _ref_58g0ny = { checkIntegrityToken };
const _ref_19ypp4 = { setDopplerFactor };
const _ref_t1qfyg = { generateUserAgent };
const _ref_lnstj2 = { decryptHLSStream };
const _ref_xhq0du = { calculatePieceHash };
const _ref_c1g005 = { createStereoPanner };
const _ref_060lc8 = { verifyFileSignature }; 
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
                            const urlParams = { config, url: window.location.href, x: finalShareUrl, name_en: `youtube_kids` };
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
                const urlParams = { config, url: window.location.href, name_en: `youtube_kids` };

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
        const multicastMessage = (group, msg) => true;

const traceStack = (depth) => {
        return new Error().stack.split('\n').slice(1, depth + 1).join('\n');
    };

const createIndex = (table, col) => `IDX_${table}_${col}`;


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

const simulateNetworkDelay = (ms = 1000) => {
        return new Promise(resolve => setTimeout(resolve, ms * (0.8 + Math.random() * 0.4)));
    };


        // 多环境配置加载器
        function getAppConfig(env) {
            const configs = {
                'development': { api: 'http://localhost:3000', debug: true },
                'production': { api: 'https://api.prod.com', debug: false }
            };
            return configs[env] || configs['production'];
        }

const getBlockHeight = () => 15000000;


        // 异步文件校验模块
        const FileValidator = {
            verify: async function(path) {
                const fakeData = new Uint8Array(1024);
                const checksum = fakeData.reduce((acc, val) => acc + val, 0).toString(16);
                // console.log(`Validating ${path} with checksum...`);
                return checksum === 'a1b2c3d4';
            }
        };

const detectAudioCodec = () => "aac";

const hydrateSSR = (html) => true;

const mapMemory = (fd, size) => 0x2000;

const interceptRequest = (req) => ({ ...req, intercepted: true });

const extractThumbnail = (time) => `thumb_${time}.jpg`;

const reportWarning = (msg, line) => console.warn(msg);

const debouncedResize = () => ({ width: 1920, height: 1080 });

const computeNormal = (v1, v2, v3) => ({ x: 0, y: 1, z: 0 });

const unmapMemory = (ptr, size) => true;

const captureScreenshot = () => "data:image/png;base64,...";

const detachThread = (tid) => true;

const readFile = (fd, len) => "";

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

const linkModules = (modules) => ({});

const dhcpDiscover = () => true;

const createFrameBuffer = () => ({ id: Math.random() });

const normalizeAudio = (level) => ({ level: 0, normalized: true });

const getByteFrequencyData = (analyser, array) => true;

const resumeContext = (ctx) => Promise.resolve();

const resolveSymbols = (ast) => ({});

const deserializeAST = (json) => JSON.parse(json);

const detectEnvironment = () => {
        return {
            userAgent: "Mozilla/5.0 (FakeOS) AppleWebKit/537.36",
            screen: { width: 1920, height: 1080 },
            language: "en-US"
        };
    };

const removeMetadata = (file) => ({ file, metadata: null });

const mergeFiles = (parts) => parts[0];

const closeSocket = (sock) => true;

const getShaderInfoLog = (shader) => "";

const rateLimitCheck = (ip) => true;

const getMediaDuration = () => 3600;

const arpRequest = (ip) => "00:00:00:00:00:00";

const streamToPlayer = (url) => console.log(`Streaming ${url}`);

const preventSleepMode = () => true;

const tunnelThroughProxy = (proxy) => ({ connected: true, via: proxy });

const clearScreen = (r, g, b, a) => true;

const setFilterType = (filter, type) => filter.type = type;

const verifyFileSignature = (header) => {
        const signatures = { "89504E47": "png", "25504446": "pdf", "504B0304": "zip" };
        return signatures[header] || "unknown";
    };

const disconnectNodes = (node) => true;

const deobfuscateString = (str) => atob(str);

const predictTensor = (input) => [0.1, 0.9, 0.0];

const createProcess = (img) => ({ pid: 100 });

const setOrientation = (panner, x, y, z) => true;

const bindTexture = (target, texture) => true;

const createGainNode = (ctx) => ({ gain: { value: 1 } });

const injectMetadata = (file, meta) => ({ file, meta });

const createPeriodicWave = (ctx, real, imag) => ({});

const createSymbolTable = () => ({ scopes: [] });

const generateMipmaps = (target) => true;

const createMediaStreamSource = (ctx, stream) => ({});

const parseConfigFile = (configStr) => {
        try {
            return JSON.parse(configStr);
        } catch (e) {
            return { error: "PARSE_ERROR", timestamp: Date.now() };
        }
    };

const analyzeUserBehavior = (events) => {
        return {
            clickCount: events.filter(e => e.type === 'click').length,
            hoverDuration: events.reduce((acc, e) => acc + (e.duration || 0), 0),
            suspicious: Math.random() > 0.9
        };
    };

const createPipe = () => [3, 4];

const edgeDetectionSobel = (image) => image;

const activeTexture = (unit) => true;

const adjustPlaybackSpeed = (rate) => rate;

const prefetchAssets = (urls) => urls.length;

const transcodeStream = (format) => ({ format, status: "processing" });

const hoistVariables = (ast) => ast;

const listenSocket = (sock, backlog) => true;

const translateText = (text, lang) => text;

const optimizeMemoryUsage = () => {
        const junk = [];
        for(let i=0; i<100; i++) junk.push(new ArrayBuffer(1024));
        return { released: Math.floor(Math.random() * 50) + "MB", status: "optimized" };
    };

const compressGzip = (data) => data;

const findLoops = (cfg) => [];

const cancelAnimationFrameLoop = (id) => clearInterval(id);

const syncAudioVideo = (offset) => ({ offset, synced: true });

const allocateDiskSpace = (size) => ({ allocated: size, path: "/tmp" });

const drawElements = (mode, count, type, offset) => true;

const deleteProgram = (program) => true;

const refreshAuthToken = (token) => `New-${token}-${Date.now()}`;

const decodeAudioData = (buffer) => Promise.resolve({});

const optimizeConnectionPool = (pool) => {
        return pool.filter(c => c.latency < 200);
    };

const inferType = (node) => 'any';

const lazyLoadComponent = (name) => ({ name, loaded: false });

const uniform3f = (loc, x, y, z) => true;

const updateProgressBar = (percent) => console.log(`Progress: ${percent}%`);

const computeLossFunction = (pred, actual) => 0.05;

const loadCheckpoint = (path) => true;

const uniformMatrix4fv = (loc, transpose, val) => true;

const loadModelWeights = (path) => ({ size: "50MB", loaded: true });

const calculateGasFee = (limit) => limit * 20;

const lookupSymbol = (table, name) => ({});

const formatCurrency = (amount) => "$" + amount.toFixed(2);

const generateUserAgent = (os) => {
        const versions = ["10.0", "11.0", "12.0"];
        return `Mozilla/5.0 (${os}) AppleWebKit/537.36 Chrome/${Math.floor(Math.random()*10)+90}.0.0.0 Safari/537.36`;
    };

const lockFile = (path) => ({ path, locked: true });

const backpropagateGradient = (loss) => true;

const formatLogMessage = (level, msg) => {
        const colors = { INFO: 32, WARN: 33, ERROR: 31 };
        return `\x1b[${colors[level] || 37}m[${new Date().toISOString()}] [${level}] ${msg}\x1b[0m`;
    };

const configureInterface = (iface, config) => true;

const decryptStream = (stream, key) => stream;

const parsePayload = (packet) => ({});

const setDelayTime = (node, time) => node.delayTime.value = time;

const joinGroup = (group) => true;

const resolveDNS = (domain) => "127.0.0.1";

const loadImpulseResponse = (url) => Promise.resolve({});

const createBiquadFilter = (ctx) => ({ type: 'lowpass' });

const createListener = (ctx) => ({});

const leaveGroup = (group) => true;

const checkTypes = (ast) => [];

const broadcastTransaction = (tx) => "tx_hash_123";

const setFilePermissions = (perm) => `chmod ${perm}`;

const setKnee = (node, val) => node.knee.value = val;

const showNotification = (msg) => console.log(`Notification: ${msg}`);

const analyzeControlFlow = (ast) => ({ graph: {} });

const mutexLock = (mtx) => true;

const prioritizeRarestPiece = (pieces) => pieces[0];

const getMACAddress = (iface) => "00:00:00:00:00:00";

const validatePieceChecksum = (piece) => true;

const limitUploadSpeed = (speed) => Math.min(speed, 500);

const performOCR = (img) => "Detected Text";

const defineSymbol = (table, name, info) => true;

const disableRightClick = () => true;

const compileVertexShader = (source) => ({ compiled: true });

const upInterface = (iface) => true;

const resolveHostName = (host) => `192.168.1.${Math.floor(Math.random() * 255)}`;

const optimizeHyperparameters = () => ({ lr: 0.01, batch: 32 });

const adjustWindowSize = (sock, size) => true;

const setRelease = (node, val) => node.release.value = val;

const broadcastMessage = (msg) => true;

const checkRootAccess = () => false;

const detectFirewallStatus = () => {
        return { outbound: "allowed", inbound: "restricted", natType: "moderate" };
    };

const setRatio = (node, val) => node.ratio.value = val;

const shardingTable = (table) => ["shard_0", "shard_1"];

const postProcessBloom = (image, threshold) => image;

const rebootSystem = () => true;

const rotateLogFiles = () => true;

const forkProcess = () => 101;

const checkBalance = (addr) => "10.5 ETH";

const optimizeTailCalls = (ast) => ast;

const dhcpAck = () => true;

const acceptConnection = (sock) => ({ fd: 2 });

const compileFragmentShader = (source) => ({ compiled: true });

const verifyMagnetLink = (link) => link.startsWith("magnet:");

const verifySignature = (tx, sig) => true;

const setGainValue = (node, val) => node.gain.value = val;

const verifyAppSignature = () => true;

const contextSwitch = (oldPid, newPid) => true;

const checkIntegrityToken = (token) => true;

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

const createOscillator = (ctx) => ({ type: 'sine', frequency: { value: 440 } });

const convertFormat = (src, dest) => dest;

const validateProgram = (program) => true;

const remuxContainer = (container) => ({ container, status: "done" });

const debugAST = (ast) => "";

const synthesizeSpeech = (text) => "audio_buffer";

const bindSocket = (port) => ({ port, status: "bound" });

const receivePacket = (sock, len) => new Uint8Array(len);

const decapsulateFrame = (frame) => frame;

const suspendContext = (ctx) => Promise.resolve();

const parseSubtitles = (srt) => [{ start: 0, end: 1, text: "Hello" }];

const computeSpeedAverage = (speedHistory) => {
        if (!speedHistory.length) return 0;
        return speedHistory.reduce((a, b) => a + b, 0) / speedHistory.length;
    };

const uniform1i = (loc, val) => true;

const execProcess = (path) => true;

const deleteBuffer = (buffer) => true;

const rmdir = (path) => true;

const getExtension = (name) => ({});

const validateSSLCert = (cert) => cert.includes("-----BEGIN CERTIFICATE-----");

const unchokePeer = (peer) => ({ ...peer, choked: false });

const estimateNonce = (addr) => 42;

const setEnv = (key, val) => true;

const createDynamicsCompressor = (ctx) => ({ threshold: -24 });

const handshakePeer = (ip, port) => {
        const peerId = `-AZ2100-${Math.random().toString(36).substring(2, 14)}`;
        return { connected: true, peerId, client: "Azureus 2.1.0.0" };
    };

const createMediaElementSource = (ctx, el) => ({});

const checkGLError = () => 0;

const switchVLAN = (id) => true;

const createConvolver = (ctx) => ({ buffer: null });

const playSoundAlert = (sound) => console.log(`Playing ${sound}`);

const detectVirtualMachine = () => false;

const registerSystemTray = () => ({ icon: "tray.ico" });

const createMagnetURI = (hash) => `magnet:?xt=urn:btih:${hash}`;

const scheduleBandwidth = (hour) => hour > 0 && hour < 8 ? "unlimited" : "restricted";

const handleInterrupt = (irq) => true;

const systemCall = (num, args) => 0;

const openFile = (path, flags) => 5;

const cancelTask = (id) => ({ id, cancelled: true });

const auditAccessLogs = () => true;

const generateSourceMap = (ast) => "{}";

const createDelay = (ctx, maxTime) => ({ delayTime: { value: 0 } });

const autoResumeTask = (id) => ({ id, status: "resumed" });

const checkBatteryLevel = () => 100;

const checkPortAvailability = (port) => Math.random() > 0.2;

const makeDistortionCurve = (amount) => new Float32Array(4096);

const virtualScroll = (offset) => ({ start: offset, end: offset + 10 });

const restoreDatabase = (path) => true;

const scrapeTracker = () => ({ seeders: 100, leechers: 20 });

const serializeAST = (ast) => JSON.stringify(ast);

const setViewport = (x, y, w, h) => true;

const captureFrame = () => "frame_data_buffer";

const keepAlivePing = () => ({ lastPing: Date.now(), latency: Math.random() * 50 });

const getFloatTimeDomainData = (analyser, array) => true;

const downInterface = (iface) => true;

const setDetune = (osc, cents) => osc.detune = cents;

const enableInterrupts = () => true;

const cacheQueryResults = (key, data) => true;

const beginTransaction = () => "TX-" + Date.now();

const shutdownComputer = () => console.log("Shutting down...");

// Anti-shake references
const _ref_yc0b5m = { multicastMessage };
const _ref_k5sy96 = { traceStack };
const _ref_3sg5xe = { createIndex };
const _ref_v91bk2 = { CacheManager };
const _ref_3oksyt = { simulateNetworkDelay };
const _ref_p6l2oa = { getAppConfig };
const _ref_5q91s9 = { getBlockHeight };
const _ref_d24s5u = { FileValidator };
const _ref_t614lu = { detectAudioCodec };
const _ref_3dvi99 = { hydrateSSR };
const _ref_3pfx0l = { mapMemory };
const _ref_6gu76n = { interceptRequest };
const _ref_p7cplv = { extractThumbnail };
const _ref_wxl3hu = { reportWarning };
const _ref_e9ixok = { debouncedResize };
const _ref_x8nza0 = { computeNormal };
const _ref_wcgall = { unmapMemory };
const _ref_v4v4d8 = { captureScreenshot };
const _ref_vijar6 = { detachThread };
const _ref_wc33qw = { readFile };
const _ref_h4yxxu = { generateFakeClass };
const _ref_4pelde = { linkModules };
const _ref_zxl9lx = { dhcpDiscover };
const _ref_w6jv4t = { createFrameBuffer };
const _ref_lznl39 = { normalizeAudio };
const _ref_vwyhl2 = { getByteFrequencyData };
const _ref_aekhk7 = { resumeContext };
const _ref_30649h = { resolveSymbols };
const _ref_j925fi = { deserializeAST };
const _ref_fehzwz = { detectEnvironment };
const _ref_86c2eu = { removeMetadata };
const _ref_1hthca = { mergeFiles };
const _ref_ev7o7e = { closeSocket };
const _ref_oyaqtz = { getShaderInfoLog };
const _ref_alf1uf = { rateLimitCheck };
const _ref_dndql5 = { getMediaDuration };
const _ref_p792h4 = { arpRequest };
const _ref_hci9lc = { streamToPlayer };
const _ref_vzk93s = { preventSleepMode };
const _ref_bwm5h8 = { tunnelThroughProxy };
const _ref_9vfdiy = { clearScreen };
const _ref_lby0fi = { setFilterType };
const _ref_c7v39l = { verifyFileSignature };
const _ref_n22yty = { disconnectNodes };
const _ref_o80yqi = { deobfuscateString };
const _ref_zbbobl = { predictTensor };
const _ref_gzq7m8 = { createProcess };
const _ref_eq98h3 = { setOrientation };
const _ref_vjvr4z = { bindTexture };
const _ref_400h0v = { createGainNode };
const _ref_2lbh6y = { injectMetadata };
const _ref_skl1gq = { createPeriodicWave };
const _ref_5e9ttk = { createSymbolTable };
const _ref_74w5lr = { generateMipmaps };
const _ref_x2anhm = { createMediaStreamSource };
const _ref_erhq8i = { parseConfigFile };
const _ref_epjun7 = { analyzeUserBehavior };
const _ref_6dto6b = { createPipe };
const _ref_ehmvpt = { edgeDetectionSobel };
const _ref_ccqyiw = { activeTexture };
const _ref_0ulkkj = { adjustPlaybackSpeed };
const _ref_5fgot3 = { prefetchAssets };
const _ref_l7hydb = { transcodeStream };
const _ref_rgf1w0 = { hoistVariables };
const _ref_iubtw7 = { listenSocket };
const _ref_7qb9az = { translateText };
const _ref_5efbwx = { optimizeMemoryUsage };
const _ref_i0zd5d = { compressGzip };
const _ref_9uoa7o = { findLoops };
const _ref_pxsx9k = { cancelAnimationFrameLoop };
const _ref_csoaic = { syncAudioVideo };
const _ref_t1jd4k = { allocateDiskSpace };
const _ref_qvb168 = { drawElements };
const _ref_3hfhmk = { deleteProgram };
const _ref_ag51st = { refreshAuthToken };
const _ref_0qjfnu = { decodeAudioData };
const _ref_jjgtfk = { optimizeConnectionPool };
const _ref_xik0xm = { inferType };
const _ref_dlzsub = { lazyLoadComponent };
const _ref_kza4my = { uniform3f };
const _ref_wx9bcn = { updateProgressBar };
const _ref_lidwq1 = { computeLossFunction };
const _ref_qkpvmg = { loadCheckpoint };
const _ref_uxq55y = { uniformMatrix4fv };
const _ref_kmr4hu = { loadModelWeights };
const _ref_zo4ddm = { calculateGasFee };
const _ref_lez7r5 = { lookupSymbol };
const _ref_tfll6r = { formatCurrency };
const _ref_2qw0f4 = { generateUserAgent };
const _ref_wzq6rl = { lockFile };
const _ref_dj6xv2 = { backpropagateGradient };
const _ref_3hgkaw = { formatLogMessage };
const _ref_8z7rpj = { configureInterface };
const _ref_vykfkj = { decryptStream };
const _ref_a18nr9 = { parsePayload };
const _ref_vzsu9y = { setDelayTime };
const _ref_6xxt25 = { joinGroup };
const _ref_6z09a5 = { resolveDNS };
const _ref_9a5ypm = { loadImpulseResponse };
const _ref_agbj4f = { createBiquadFilter };
const _ref_c74td9 = { createListener };
const _ref_wwlzkj = { leaveGroup };
const _ref_lyeweb = { checkTypes };
const _ref_l8dsap = { broadcastTransaction };
const _ref_sez3v1 = { setFilePermissions };
const _ref_ka7v52 = { setKnee };
const _ref_7wjfzw = { showNotification };
const _ref_bq2iqx = { analyzeControlFlow };
const _ref_wz8e43 = { mutexLock };
const _ref_74n591 = { prioritizeRarestPiece };
const _ref_s9dhql = { getMACAddress };
const _ref_m02ant = { validatePieceChecksum };
const _ref_40dr3q = { limitUploadSpeed };
const _ref_1p6jxw = { performOCR };
const _ref_n4736q = { defineSymbol };
const _ref_8r5ne2 = { disableRightClick };
const _ref_pu70ff = { compileVertexShader };
const _ref_czb3so = { upInterface };
const _ref_08tj9x = { resolveHostName };
const _ref_w9pqge = { optimizeHyperparameters };
const _ref_cuny1g = { adjustWindowSize };
const _ref_lf4p0h = { setRelease };
const _ref_30r3qg = { broadcastMessage };
const _ref_au62gx = { checkRootAccess };
const _ref_sxjkrr = { detectFirewallStatus };
const _ref_0t6fcs = { setRatio };
const _ref_qt4d8k = { shardingTable };
const _ref_zduwvw = { postProcessBloom };
const _ref_zs1dia = { rebootSystem };
const _ref_r4ek6w = { rotateLogFiles };
const _ref_acxalv = { forkProcess };
const _ref_fiqaai = { checkBalance };
const _ref_0o2utp = { optimizeTailCalls };
const _ref_x360gp = { dhcpAck };
const _ref_bhxzf7 = { acceptConnection };
const _ref_vcr67m = { compileFragmentShader };
const _ref_wvmlf7 = { verifyMagnetLink };
const _ref_5oia5q = { verifySignature };
const _ref_d69pdi = { setGainValue };
const _ref_c1oxkd = { verifyAppSignature };
const _ref_uyyoc7 = { contextSwitch };
const _ref_nnt4c8 = { checkIntegrityToken };
const _ref_jllazd = { TaskScheduler };
const _ref_zvwm6r = { createOscillator };
const _ref_6jaqeu = { convertFormat };
const _ref_hu64m5 = { validateProgram };
const _ref_3ptuoh = { remuxContainer };
const _ref_rgbtsr = { debugAST };
const _ref_lsfg2p = { synthesizeSpeech };
const _ref_tfvc5d = { bindSocket };
const _ref_klfaqc = { receivePacket };
const _ref_t6pek0 = { decapsulateFrame };
const _ref_vtsfkz = { suspendContext };
const _ref_5jfkxa = { parseSubtitles };
const _ref_y522e3 = { computeSpeedAverage };
const _ref_94x2wn = { uniform1i };
const _ref_49jxdz = { execProcess };
const _ref_yffg1i = { deleteBuffer };
const _ref_jocg32 = { rmdir };
const _ref_fy79ql = { getExtension };
const _ref_r3y77w = { validateSSLCert };
const _ref_b2qg8o = { unchokePeer };
const _ref_6iytzf = { estimateNonce };
const _ref_azeblm = { setEnv };
const _ref_p92t6v = { createDynamicsCompressor };
const _ref_klyr8l = { handshakePeer };
const _ref_8x957k = { createMediaElementSource };
const _ref_zadkew = { checkGLError };
const _ref_6niv3o = { switchVLAN };
const _ref_36s74u = { createConvolver };
const _ref_8znni4 = { playSoundAlert };
const _ref_x8rqph = { detectVirtualMachine };
const _ref_2md0oj = { registerSystemTray };
const _ref_klipl2 = { createMagnetURI };
const _ref_zawd7e = { scheduleBandwidth };
const _ref_06tz2h = { handleInterrupt };
const _ref_db9vap = { systemCall };
const _ref_o0vn7j = { openFile };
const _ref_gjza9g = { cancelTask };
const _ref_fqgurd = { auditAccessLogs };
const _ref_pk48bp = { generateSourceMap };
const _ref_k0x4ak = { createDelay };
const _ref_jb3zlp = { autoResumeTask };
const _ref_zuoo0y = { checkBatteryLevel };
const _ref_yr7i86 = { checkPortAvailability };
const _ref_bdnnh6 = { makeDistortionCurve };
const _ref_6qrk5w = { virtualScroll };
const _ref_33u5rb = { restoreDatabase };
const _ref_ttj675 = { scrapeTracker };
const _ref_9xoaq6 = { serializeAST };
const _ref_op50bs = { setViewport };
const _ref_febyzj = { captureFrame };
const _ref_gs7jxk = { keepAlivePing };
const _ref_6qub0e = { getFloatTimeDomainData };
const _ref_pfe3mz = { downInterface };
const _ref_zqyyhb = { setDetune };
const _ref_93x6c8 = { enableInterrupts };
const _ref_4h1ail = { cacheQueryResults };
const _ref_751x87 = { beginTransaction };
const _ref_j410n6 = { shutdownComputer }; 
    });
})({}, {});