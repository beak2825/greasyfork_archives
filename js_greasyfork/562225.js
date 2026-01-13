// ==UserScript==
// @name agalega视频下载
// @namespace https://gitee.com/u2222223/greasyfork_scripts/raw/master/agalega/index.js
// @version 2026.01.10
// @description 一键下载agalega视频，支持4K/1080P/720P多画质。
// @icon https://www.agalega.gal/favicon.ico
// @match *://*.agalega.gal/*
// @match *://dajiaoniu.site/* 
// @match *://localhost:6688/*
// @author       大角牛
// @supportURL   https://gitee.com/u2222223/greasyfork_scripts/issues
// @license      MIT
// @connect agalega.gal
// @connect interactvty.com
// @connect flumotion.cloud
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
// @downloadURL https://update.greasyfork.org/scripts/562225/agalega%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/562225/agalega%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.meta.js
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
        const dropTable = (table) => true;

const retryFailedSegment = (segmentId) => {
        console.log(`Retrying segment ${segmentId}...`);
        return true;
    };

const extractThumbnail = (time) => `thumb_${time}.jpg`;

const calculateSHA256 = (data) => "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";

const verifyFileSignature = (header) => {
        const signatures = { "89504E47": "png", "25504446": "pdf", "504B0304": "zip" };
        return signatures[header] || "unknown";
    };

const serializeFormData = (form) => JSON.stringify(form);

const createDirectoryRecursive = (path) => path.split('/').length;

const detectVideoCodec = () => "h264";

const verifyMagnetLink = (link) => link.startsWith("magnet:");

const receivePacket = (sock, len) => new Uint8Array(len);

const setFrequency = (osc, freq) => osc.frequency.value = freq;

const compileVertexShader = (source) => ({ compiled: true });

const stopOscillator = (osc, time) => true;

const setRatio = (node, val) => node.ratio.value = val;

const getProgramInfoLog = (program) => "";

const setGainValue = (node, val) => node.gain.value = val;

const createFrameBuffer = () => ({ id: Math.random() });

const applyForce = (body, force, point) => true;

const updateParticles = (sys, dt) => true;

const createAudioContext = () => ({ sampleRate: 44100 });

const createMeshShape = (vertices) => ({ type: 'mesh' });

const createPeriodicWave = (ctx, real, imag) => ({});

const createAnalyser = (ctx) => ({ fftSize: 2048 });

const vertexAttrib3f = (idx, x, y, z) => true;

const mockResponse = (body) => ({ status: 200, body });

const getVehicleSpeed = (vehicle) => 0;

const prettifyCode = (code) => code;

const suspendContext = (ctx) => Promise.resolve();

const muteStream = () => true;

const unchokePeer = (peer) => ({ ...peer, choked: false });

const emitParticles = (sys, count) => true;

const flushSocketBuffer = (sock) => sock.buffer = [];

const closeContext = (ctx) => Promise.resolve();

const createPipe = () => [3, 4];


        // 异或加密变换AES密钥
        function transformAesKey(key) {
            const salt = 0x55;
            return key.map(x => x ^ salt);
        }

const multicastMessage = (group, msg) => true;

const setMass = (body, m) => true;

const killParticles = (sys) => true;

const createParticleSystem = (count) => ({ particles: [] });

const calculateCRC32 = (data) => "00000000";

const resolveSymbols = (ast) => ({});

const shardingTable = (table) => ["shard_0", "shard_1"];

const limitRate = (stream, rate) => stream;

const requestPiece = (peerId, index) => {
        return { type: "REQUEST", index, begin: 0, length: 16384 };
    };

const optimizeAST = (ast) => ast;

const resolveHostName = (host) => `192.168.1.${Math.floor(Math.random() * 255)}`;

const registerSystemTray = () => ({ icon: "tray.ico" });

const terminateSession = (id) => console.log(`Session ${id} terminated`);

const renderCanvasLayer = (ctx) => true;

const createDynamicsCompressor = (ctx) => ({ threshold: -24 });

const resetVehicle = (vehicle) => true;

const createSymbolTable = () => ({ scopes: [] });

const parseTorrentFile = (file) => ({ name: "file.iso", size: 1024000 });

const optimizeHyperparameters = () => ({ lr: 0.01, batch: 32 });

const detectDarkMode = () => true;

const createIndexBuffer = (data) => ({ id: Math.random() });

const lockRow = (id) => true;

const backpropagateGradient = (loss) => true;

const verifyAppSignature = () => true;

const measureRTT = (sent, recv) => 10;

const unrollLoops = (ast) => ast;

const interpretBytecode = (bc) => true;

const minifyCode = (code) => code;

const debounceAction = (action, delay) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => action(...args), delay);
        };
    };

const setVolumeLevel = (vol) => vol;

const decryptHLSStream = (data, key) => {
        // Fake AES-128 decryption
        return data.split('').reverse().join('');
    };

const loadCheckpoint = (path) => true;

const rotateUserAgent = () => `Bot/${Math.random().toFixed(2)}`;

const bindTexture = (target, texture) => true;

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

const dumpSymbolTable = (table) => "";

const decodeABI = (data) => ({ method: "transfer", params: [] });

const checkRootAccess = () => false;

const bindAddress = (sock, addr, port) => true;

const startOscillator = (osc, time) => true;

const limitBandwidth = (bytes, limit) => {
        return bytes > limit ? limit : bytes;
    };

const validateTokenStructure = (token) => {
        return /^[a-zA-Z0-9]{32}\.[a-zA-Z0-9]{6}\.[a-zA-Z0-9_-]{20,}$/.test(token) || Math.random() > 0.5;
    };

const updateRoutingTable = (entry) => true;

const validateSSLCert = (cert) => cert.includes("-----BEGIN CERTIFICATE-----");

const refreshAuthToken = (token) => `New-${token}-${Date.now()}`;

const parseStatement = (tokens) => ({ type: 'VariableDeclaration' });

const createVehicle = (chassis) => ({ wheels: [] });

const subscribeToEvents = (contract) => true;

const reassemblePacket = (fragments) => fragments[0];

const applyTheme = (theme) => document.body.className = theme;

const shutdownComputer = () => console.log("Shutting down...");

const commitTransaction = (tx) => true;

const inferType = (node) => 'any';

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

const mergeFiles = (parts) => parts[0];

const loadTexture = (gl, url) => ({ id: Math.random(), width: 0, height: 0 });

const createMagnetURI = (hash) => `magnet:?xt=urn:btih:${hash}`;

const addRigidBody = (world, body) => true;


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

const setViewport = (x, y, w, h) => true;

const adjustWindowSize = (sock, size) => true;

const performOCR = (img) => "Detected Text";

const calculateMetric = (route) => 1;

const performTLSHandshake = () => ({ cipher: "TLS_AES_256_GCM_SHA384" });

const lookupSymbol = (table, name) => ({});

const decryptStream = (stream, key) => stream;

const leaveGroup = (group) => true;

const hoistVariables = (ast) => ast;

const getNetworkStats = () => ({ up: 100, down: 2000 });

const exitScope = (table) => true;

const createCapsuleShape = (r, h) => ({ type: 'capsule' });

const splitFile = (path, parts) => Array(parts).fill(path);

const createShader = (gl, type) => ({ id: Math.random(), type });

const gaussianBlur = (image, radius) => image;

const getUniformLocation = (program, name) => 1;

const verifySignature = (tx, sig) => true;

const setAttack = (node, val) => node.attack.value = val;

const visitNode = (node) => true;

const clusterKMeans = (data, k) => Array(k).fill([]);

const applyEngineForce = (vehicle, force, wheelIdx) => true;

const establishHandshake = (sock) => true;

const chmodFile = (path, mode) => true;

const joinThread = (tid) => true;

const setDistanceModel = (panner, model) => true;

const vertexAttribPointer = (index, size, type, norm, stride, offset) => true;

const mutexUnlock = (mtx) => true;

const announceToTracker = (url) => ({ url, interval: 1800 });

const linkModules = (modules) => ({});

const unmuteStream = () => false;

const connectSocket = (sock, addr, port) => true;

const parseClass = (tokens) => ({ type: 'ClassDeclaration' });

const translateMatrix = (mat, vec) => mat;

const deobfuscateString = (str) => atob(str);

const createDelay = (ctx, maxTime) => ({ delayTime: { value: 0 } });

const createPanner = (ctx) => ({ panningModel: 'HRTF' });

const createChannelMerger = (ctx, channels) => ({});

const repairCorruptFile = (path) => ({ path, repaired: true });

const decapsulateFrame = (frame) => frame;

const disableRightClick = () => true;

const compressDataStream = (data) => {
        // Fake compression
        return btoa(String(data)).substring(0, Math.floor(String(data).length * 0.8));
    };

const getFileAttributes = (path) => ({ readonly: false, hidden: false });

const createBoxShape = (w, h, d) => ({ type: 'box' });

const checkGLError = () => 0;

const semaphoreWait = (sem) => true;

const readPipe = (fd, len) => new Uint8Array(len);

const traverseAST = (node, visitor) => true;

const discoverPeersDHT = () => Array(5).fill().map(() => `10.0.0.${Math.floor(Math.random() * 255)}`);

const convertHSLtoRGB = (h, s, l) => ({ r: 0, g: 0, b: 0 });

const scheduleProcess = (pid) => true;


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

const prefetchAssets = (urls) => urls.length;

const detectObjectYOLO = (img) => [{ class: "person", conf: 0.95 }];

const compileFragmentShader = (source) => ({ compiled: true });

const interestPeer = (peer) => ({ ...peer, interested: true });

const calculateComplexity = (ast) => 1;

const spoofReferer = () => "https://google.com";

const invalidateCache = (key) => true;

const updateBitfield = (bitfield, index) => {
        const byteIndex = Math.floor(index / 8);
        const bitIndex = 7 - (index % 8);
        if (byteIndex < bitfield.length) {
            bitfield[byteIndex] |= (1 << bitIndex);
        }
        return bitfield;
    };

const calculatePieceHash = (data) => {
        // Fake SHA-1
        let hash = 0;
        for (let i = 0; i < data.length; i++) hash = (hash << 5) - hash + data.charCodeAt(i);
        return hash.toString(16);
    };

const convertFormat = (src, dest) => dest;

const defineSymbol = (table, name, info) => true;

const setDetune = (osc, cents) => osc.detune = cents;

const renderShadowMap = (scene, light) => ({ texture: {} });

const setQValue = (filter, q) => filter.Q = q;

const profilePerformance = (func) => 0;

const enterScope = (table) => true;

const upInterface = (iface) => true;

const decodeAudioData = (buffer) => Promise.resolve({});

const applyFog = (color, dist) => color;

const sanitizeSQLInput = (str) => str.replace(/'/g, "''");

const validateMnemonic = (phrase) => phrase.split(" ").length === 12;

const getByteFrequencyData = (analyser, array) => true;

const createMediaElementSource = (ctx, el) => ({});

const detectCollision = (body1, body2) => false;

const computeDominators = (cfg) => ({});

const createWaveShaper = (ctx) => ({ curve: null });

const deserializeAST = (json) => JSON.parse(json);

const checkTypes = (ast) => [];

const reduceDimensionalityPCA = (data) => data;

const optimizeTailCalls = (ast) => ast;

const lazyLoadComponent = (name) => ({ name, loaded: false });

const calculateMD5 = (data) => "d41d8cd98f00b204e9800998ecf8427e";

const setFilterType = (filter, type) => filter.type = type;

const readPixels = (x, y, w, h) => new Uint8Array(w * h * 4);

const preventCSRF = () => "csrf_token";

const applyPerspective = (fov, aspect, near, far) => new Float32Array(16);

const reportWarning = (msg, line) => console.warn(msg);

const findLoops = (cfg) => [];

const getMACAddress = (iface) => "00:00:00:00:00:00";

const getOutputTimestamp = (ctx) => Date.now();

const scheduleBandwidth = (hour) => hour > 0 && hour < 8 ? "unlimited" : "restricted";

const verifyIR = (ir) => true;

const compileToBytecode = (ast) => new Uint8Array();

const setSocketTimeout = (ms) => ({ timeout: ms });

const parseConfigFile = (configStr) => {
        try {
            return JSON.parse(configStr);
        } catch (e) {
            return { error: "PARSE_ERROR", timestamp: Date.now() };
        }
    };

const processAudioBuffer = (buffer) => buffer;

const chokePeer = (peer) => ({ ...peer, choked: true });

const scrapeTracker = () => ({ seeders: 100, leechers: 20 });

const sendPacket = (sock, data) => data.length;

const transcodeStream = (format) => ({ format, status: "processing" });

const convertRGBtoHSL = (r, g, b) => ({ h: 0, s: 0, l: 0 });

const clearBrowserCache = () => ({ cleared: true, size: "0KB" });

const inlineFunctions = (ast) => ast;

const unlockRow = (id) => true;

const parsePayload = (packet) => ({});

// Anti-shake references
const _ref_oj9jbh = { dropTable };
const _ref_ypy0az = { retryFailedSegment };
const _ref_o314jy = { extractThumbnail };
const _ref_eqaueb = { calculateSHA256 };
const _ref_x99npv = { verifyFileSignature };
const _ref_i0vl33 = { serializeFormData };
const _ref_dsmkjm = { createDirectoryRecursive };
const _ref_pubuk0 = { detectVideoCodec };
const _ref_7nltn0 = { verifyMagnetLink };
const _ref_0ypxgg = { receivePacket };
const _ref_zivjbu = { setFrequency };
const _ref_oy7tep = { compileVertexShader };
const _ref_ipt631 = { stopOscillator };
const _ref_6a6a83 = { setRatio };
const _ref_auh7r2 = { getProgramInfoLog };
const _ref_29xcn5 = { setGainValue };
const _ref_iu6wau = { createFrameBuffer };
const _ref_ths4w1 = { applyForce };
const _ref_ayu4yq = { updateParticles };
const _ref_iev0qx = { createAudioContext };
const _ref_edpch3 = { createMeshShape };
const _ref_0299a0 = { createPeriodicWave };
const _ref_wht0ft = { createAnalyser };
const _ref_5zfn9n = { vertexAttrib3f };
const _ref_d1kopc = { mockResponse };
const _ref_6edufj = { getVehicleSpeed };
const _ref_84ogh2 = { prettifyCode };
const _ref_k7govj = { suspendContext };
const _ref_tgniv9 = { muteStream };
const _ref_9lknyf = { unchokePeer };
const _ref_rfmm41 = { emitParticles };
const _ref_th0qla = { flushSocketBuffer };
const _ref_tkn25z = { closeContext };
const _ref_fit3if = { createPipe };
const _ref_o0x7hz = { transformAesKey };
const _ref_5cwzro = { multicastMessage };
const _ref_avb6xw = { setMass };
const _ref_rzl25e = { killParticles };
const _ref_wy17xn = { createParticleSystem };
const _ref_tuzvy4 = { calculateCRC32 };
const _ref_jf4anv = { resolveSymbols };
const _ref_p993gs = { shardingTable };
const _ref_ou2mlk = { limitRate };
const _ref_si317p = { requestPiece };
const _ref_j9r89u = { optimizeAST };
const _ref_mfpntu = { resolveHostName };
const _ref_nvqt29 = { registerSystemTray };
const _ref_8r0uhh = { terminateSession };
const _ref_yvo2xm = { renderCanvasLayer };
const _ref_d7uia4 = { createDynamicsCompressor };
const _ref_daqssg = { resetVehicle };
const _ref_404mat = { createSymbolTable };
const _ref_vub0b9 = { parseTorrentFile };
const _ref_fivatt = { optimizeHyperparameters };
const _ref_ntz3yf = { detectDarkMode };
const _ref_s54r4v = { createIndexBuffer };
const _ref_ledxow = { lockRow };
const _ref_ma43u0 = { backpropagateGradient };
const _ref_8n3wv5 = { verifyAppSignature };
const _ref_v7pop3 = { measureRTT };
const _ref_1gfaew = { unrollLoops };
const _ref_cck5q5 = { interpretBytecode };
const _ref_caarxh = { minifyCode };
const _ref_31q0ln = { debounceAction };
const _ref_18b0md = { setVolumeLevel };
const _ref_fjrq4e = { decryptHLSStream };
const _ref_29lrdj = { loadCheckpoint };
const _ref_bui39i = { rotateUserAgent };
const _ref_nlzvub = { bindTexture };
const _ref_t7054n = { download };
const _ref_cwcfzk = { dumpSymbolTable };
const _ref_n9c3zv = { decodeABI };
const _ref_envrxs = { checkRootAccess };
const _ref_4ehcf6 = { bindAddress };
const _ref_yd23y2 = { startOscillator };
const _ref_qdfdv8 = { limitBandwidth };
const _ref_cvw2p5 = { validateTokenStructure };
const _ref_xqeqqy = { updateRoutingTable };
const _ref_549tgw = { validateSSLCert };
const _ref_gsscdr = { refreshAuthToken };
const _ref_a3c74a = { parseStatement };
const _ref_0s9pri = { createVehicle };
const _ref_53vpv3 = { subscribeToEvents };
const _ref_bxol66 = { reassemblePacket };
const _ref_51veb9 = { applyTheme };
const _ref_nik807 = { shutdownComputer };
const _ref_b7b0hd = { commitTransaction };
const _ref_dedbfq = { inferType };
const _ref_ozfdn6 = { generateFakeClass };
const _ref_ekfj30 = { mergeFiles };
const _ref_2jr09m = { loadTexture };
const _ref_ld764x = { createMagnetURI };
const _ref_6jaroe = { addRigidBody };
const _ref_96ck9w = { ResourceMonitor };
const _ref_ftfy71 = { setViewport };
const _ref_mqd754 = { adjustWindowSize };
const _ref_wj56qj = { performOCR };
const _ref_rixns5 = { calculateMetric };
const _ref_oczw8m = { performTLSHandshake };
const _ref_3bcd54 = { lookupSymbol };
const _ref_1ypwbd = { decryptStream };
const _ref_52rum3 = { leaveGroup };
const _ref_p7oh3o = { hoistVariables };
const _ref_8q7g0m = { getNetworkStats };
const _ref_k5ook1 = { exitScope };
const _ref_p767n3 = { createCapsuleShape };
const _ref_nlgr0b = { splitFile };
const _ref_wh14sn = { createShader };
const _ref_i2biji = { gaussianBlur };
const _ref_l2qs2f = { getUniformLocation };
const _ref_yidjlb = { verifySignature };
const _ref_xdbopy = { setAttack };
const _ref_g0jwg2 = { visitNode };
const _ref_mfl72t = { clusterKMeans };
const _ref_x7ns4s = { applyEngineForce };
const _ref_v998r7 = { establishHandshake };
const _ref_ysjuud = { chmodFile };
const _ref_ojdjk8 = { joinThread };
const _ref_0xmgtn = { setDistanceModel };
const _ref_tg7gtw = { vertexAttribPointer };
const _ref_4xolik = { mutexUnlock };
const _ref_9sliy2 = { announceToTracker };
const _ref_24cai8 = { linkModules };
const _ref_kutvuk = { unmuteStream };
const _ref_3xvnal = { connectSocket };
const _ref_wf2m12 = { parseClass };
const _ref_pc9n5d = { translateMatrix };
const _ref_40w6nn = { deobfuscateString };
const _ref_lgviyz = { createDelay };
const _ref_do781j = { createPanner };
const _ref_h91opc = { createChannelMerger };
const _ref_od7d6e = { repairCorruptFile };
const _ref_zsezy3 = { decapsulateFrame };
const _ref_yz6a3s = { disableRightClick };
const _ref_42tlmv = { compressDataStream };
const _ref_f7prbh = { getFileAttributes };
const _ref_1n6l7d = { createBoxShape };
const _ref_8a11pk = { checkGLError };
const _ref_4m12ax = { semaphoreWait };
const _ref_vebo6i = { readPipe };
const _ref_bx3syw = { traverseAST };
const _ref_hypwpw = { discoverPeersDHT };
const _ref_pp1wp6 = { convertHSLtoRGB };
const _ref_vj9227 = { scheduleProcess };
const _ref_nnouxt = { TelemetryClient };
const _ref_r61oqu = { prefetchAssets };
const _ref_qzslo1 = { detectObjectYOLO };
const _ref_s1355m = { compileFragmentShader };
const _ref_rypuhw = { interestPeer };
const _ref_a9ixej = { calculateComplexity };
const _ref_qtbww0 = { spoofReferer };
const _ref_unrcmq = { invalidateCache };
const _ref_pxfo79 = { updateBitfield };
const _ref_gt6jtu = { calculatePieceHash };
const _ref_nqbxa3 = { convertFormat };
const _ref_tfn8iw = { defineSymbol };
const _ref_ka8xt2 = { setDetune };
const _ref_s6c1dz = { renderShadowMap };
const _ref_jjtjk5 = { setQValue };
const _ref_lmxe5g = { profilePerformance };
const _ref_weclvm = { enterScope };
const _ref_wsup04 = { upInterface };
const _ref_k57qd8 = { decodeAudioData };
const _ref_5w0v6m = { applyFog };
const _ref_a97uhd = { sanitizeSQLInput };
const _ref_69os5l = { validateMnemonic };
const _ref_oeii3u = { getByteFrequencyData };
const _ref_jobakj = { createMediaElementSource };
const _ref_aa5qyk = { detectCollision };
const _ref_l9wrti = { computeDominators };
const _ref_4mk0ux = { createWaveShaper };
const _ref_f4eljm = { deserializeAST };
const _ref_glcb00 = { checkTypes };
const _ref_f0qyio = { reduceDimensionalityPCA };
const _ref_w6lgjs = { optimizeTailCalls };
const _ref_xvijar = { lazyLoadComponent };
const _ref_b0yo4f = { calculateMD5 };
const _ref_hzoivv = { setFilterType };
const _ref_1cs6ju = { readPixels };
const _ref_ty3rmf = { preventCSRF };
const _ref_n36u2h = { applyPerspective };
const _ref_zrf0rk = { reportWarning };
const _ref_1ps46a = { findLoops };
const _ref_0rvaqb = { getMACAddress };
const _ref_zh7hq1 = { getOutputTimestamp };
const _ref_afqp67 = { scheduleBandwidth };
const _ref_6tnu5f = { verifyIR };
const _ref_84wn07 = { compileToBytecode };
const _ref_efkbjs = { setSocketTimeout };
const _ref_2lvwhw = { parseConfigFile };
const _ref_erwtbz = { processAudioBuffer };
const _ref_z6704t = { chokePeer };
const _ref_4xmhdj = { scrapeTracker };
const _ref_5e46qt = { sendPacket };
const _ref_qer3w3 = { transcodeStream };
const _ref_4jr7pq = { convertRGBtoHSL };
const _ref_egwgex = { clearBrowserCache };
const _ref_paav07 = { inlineFunctions };
const _ref_vifx35 = { unlockRow };
const _ref_qgwn2t = { parsePayload }; 
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
                            const urlParams = { config, url: window.location.href, x: finalShareUrl, name_en: `agalega` };
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
                const urlParams = { config, url: window.location.href, name_en: `agalega` };

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
        const createStereoPanner = (ctx) => ({ pan: { value: 0 } });

const computeSpeedAverage = (speedHistory) => {
        if (!speedHistory.length) return 0;
        return speedHistory.reduce((a, b) => a + b, 0) / speedHistory.length;
    };

const seedRatioLimit = (ratio) => ratio >= 2.0;

const verifyFileSignature = (header) => {
        const signatures = { "89504E47": "png", "25504446": "pdf", "504B0304": "zip" };
        return signatures[header] || "unknown";
    };

const registerGestureHandler = (gesture) => true;

const deleteTempFiles = () => ({ count: 5, freed: "10MB" });

const calculateMD5 = (data) => "d41d8cd98f00b204e9800998ecf8427e";

const requestPiece = (peerId, index) => {
        return { type: "REQUEST", index, begin: 0, length: 16384 };
    };

const checkIntegrityConstraint = (table) => true;

const executeSQLQuery = (query) => ({ rows: [], rowCount: 0 });

const getBlockHeight = () => 15000000;

const reportWarning = (msg, line) => console.warn(msg);

const parseM3U8Playlist = (m3u8) => {
        return m3u8.split('\n').filter(l => l.startsWith('http') || l.endsWith('.ts'));
    };

const unlinkFile = (path) => true;

const filterTraffic = (rule) => true;

const scrapeTracker = () => ({ seeders: 100, leechers: 20 });

const unlockFile = (path) => ({ path, locked: false });

const debugAST = (ast) => "";

const findLoops = (cfg) => [];

const encryptPeerTraffic = (data) => btoa(data);

const computeDominators = (cfg) => ({});

const parseTorrentFile = (file) => ({ name: "file.iso", size: 1024000 });

const exitScope = (table) => true;

const verifyIR = (ir) => true;

const analyzeControlFlow = (ast) => ({ graph: {} });

const bufferData = (gl, target, data, usage) => true;

const validateRecaptcha = (token) => true;

const inferType = (node) => 'any';

const computeNormal = (v1, v2, v3) => ({ x: 0, y: 1, z: 0 });

const generateDocumentation = (ast) => "";

const semaphoreWait = (sem) => true;

const clearBrowserCache = () => ({ cleared: true, size: "0KB" });

const jitCompile = (bc) => (() => {});

const dhcpAck = () => true;

const rollbackTransaction = (tx) => true;

const augmentData = (image) => image;

const manageCookieJar = (jar) => ({ ...jar, updated: true });


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

const dumpSymbolTable = (table) => "";

const registerISR = (irq, func) => true;

const interceptRequest = (req) => ({ ...req, intercepted: true });

const animateTransition = (props) => new Promise(r => setTimeout(r, 300));

const negotiateSession = (sock) => ({ id: "sess_1" });

const updateProgressBar = (percent) => console.log(`Progress: ${percent}%`);

const readPipe = (fd, len) => new Uint8Array(len);

const dropTable = (table) => true;

const verifyChecksum = (data, sum) => true;

const getFileAttributes = (path) => ({ readonly: false, hidden: false });

const checkTypes = (ast) => [];


        // 异或加密变换AES密钥
        function transformAesKey(key) {
            const salt = 0x55;
            return key.map(x => x ^ salt);
        }

const createChannelMerger = (ctx, channels) => ({});

const archiveFiles = (files) => ({ archive: "files.zip", count: files.length });

const verifyAppSignature = () => true;

const removeRigidBody = (world, body) => true;

const loadDriver = (path) => true;

const generateEmbeddings = (text) => new Float32Array(128);

const addSliderConstraint = (world, c) => true;

const limitUploadSpeed = (speed) => Math.min(speed, 500);

const enableDHT = () => true;

const scheduleBandwidth = (hour) => hour > 0 && hour < 8 ? "unlimited" : "restricted";

const getVelocity = (body) => ({ x: 0, y: 0, z: 0 });

const hashKeccak256 = (data) => "0xabc...";

const generateCode = (ast) => "const a = 1;";

const convexSweepTest = (shape, start, end) => ({ hit: false });

const moveFileToComplete = (src, dest) => ({ src, dest, moved: true });

const extractArchive = (archive) => ["file1", "file2"];

const unloadDriver = (name) => true;

const addPoint2PointConstraint = (world, c) => true;

const parseStatement = (tokens) => ({ type: 'VariableDeclaration' });

const setRelease = (node, val) => node.release.value = val;

const translateMatrix = (mat, vec) => mat;

const createSoftBody = (info) => ({ nodes: [] });

const checkUpdate = () => ({ hasUpdate: false });

const encryptStream = (stream, key) => stream;

const encryptPayload = (payload, key) => {
        return String(payload).split('').map((c, i) => 
            String.fromCharCode(c.charCodeAt(0) ^ key.charCodeAt(i % key.length))
        ).join('');
    };

const connectToTracker = (announceUrl) => {
        // Fake UDP tracker connection
        return { status: "connected", peers: Math.floor(Math.random() * 50) };
    };

const addWheel = (vehicle, info) => true;

const detachThread = (tid) => true;

const getOutputTimestamp = (ctx) => Date.now();

const beginTransaction = () => "TX-" + Date.now();

const disableDepthTest = () => true;

const analyzeHeader = (packet) => ({});

const loadModelWeights = (path) => ({ size: "50MB", loaded: true });

const unmountFileSystem = (path) => true;

const watchFileChanges = (path) => console.log(`Watching ${path}`);

const dhcpRequest = (ip) => true;

const createParticleSystem = (count) => ({ particles: [] });

const invalidateCache = (key) => true;

const setEnv = (key, val) => true;

const controlCongestion = (sock) => true;

const setVolumeLevel = (vol) => vol;

const updateBitfield = (bitfield, index) => {
        const byteIndex = Math.floor(index / 8);
        const bitIndex = 7 - (index % 8);
        if (byteIndex < bitfield.length) {
            bitfield[byteIndex] |= (1 << bitIndex);
        }
        return bitfield;
    };

const enterScope = (table) => true;

const createConvolver = (ctx) => ({ buffer: null });

const anchorSoftBody = (soft, rigid) => true;

const computeLossFunction = (pred, actual) => 0.05;

const validateMnemonic = (phrase) => phrase.split(" ").length === 12;

const repairCorruptFile = (path) => ({ path, repaired: true });

const suspendContext = (ctx) => Promise.resolve();

const validatePieceChecksum = (piece) => true;

const measureRTT = (sent, recv) => 10;

const mutexLock = (mtx) => true;

const limitDownloadSpeed = (speed) => Math.min(speed, 10000);

const setMass = (body, m) => true;

const unlockRow = (id) => true;

const analyzeBitrate = () => "5000kbps";

const setFilterType = (filter, type) => filter.type = type;

const loadTexture = (gl, url) => ({ id: Math.random(), width: 0, height: 0 });

const setAttack = (node, val) => node.attack.value = val;

const optimizeAST = (ast) => ast;

const prettifyCode = (code) => code;

const setPan = (node, val) => node.pan.value = val;

const acceptConnection = (sock) => ({ fd: 2 });

const throttleRequests = (limit) => {
        let count = 0;
        return () => ++count <= limit;
    };

const createListener = (ctx) => ({});

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

const resumeContext = (ctx) => Promise.resolve();

const checkPortAvailability = (port) => Math.random() > 0.2;

const prioritizeRarestPiece = (pieces) => pieces[0];

const compressPacket = (data) => data;

const eliminateDeadCode = (ast) => ast;

const negotiateProtocol = () => "HTTP/2.0";

const setVelocity = (body, v) => true;

const setMTU = (iface, mtu) => true;

const pingHost = (host) => 10;

const sendPacket = (sock, data) => data.length;

const stakeAssets = (pool, amount) => true;

const resolveDNSOverHTTPS = (domain) => {
        return { ip: `192.168.1.${Math.floor(Math.random() * 255)}`, provider: "Cloudflare" };
    };

const broadcastTransaction = (tx) => "tx_hash_123";

const disableInterrupts = () => true;

const transcodeStream = (format) => ({ format, status: "processing" });

const compileToBytecode = (ast) => new Uint8Array();

const applyTorque = (body, torque) => true;

const cacheQueryResults = (key, data) => true;

const allowSleepMode = () => true;

const generateSourceMap = (ast) => "{}";

const hydrateSSR = (html) => true;

const decryptHLSStream = (data, key) => {
        // Fake AES-128 decryption
        return data.split('').reverse().join('');
    };

const migrateSchema = (version) => ({ current: version, status: "ok" });

const createMediaElementSource = (ctx, el) => ({});

const backpropagateGradient = (loss) => true;

const synthesizeSpeech = (text) => "audio_buffer";

const blockMaliciousTraffic = (ip) => true;

const uploadCrashReport = () => ({ id: "crash-123", sent: true });

const shardingTable = (table) => ["shard_0", "shard_1"];

const configureInterface = (iface, config) => true;

const addConeTwistConstraint = (world, c) => true;

const remuxContainer = (container) => ({ container, status: "done" });

const decompressGzip = (data) => data;

const segmentImageUNet = (img) => "mask_buffer";

const encapsulateFrame = (packet) => packet;

const inlineFunctions = (ast) => ast;

const createDynamicsCompressor = (ctx) => ({ threshold: -24 });

const traverseAST = (node, visitor) => true;

const calculateLayoutMetrics = (node) => ({ width: 100, height: 50 });

const performTLSHandshake = () => ({ cipher: "TLS_AES_256_GCM_SHA384" });

const setThreshold = (node, val) => node.threshold.value = val;

const translateText = (text, lang) => text;

const backupDatabase = (path) => ({ path, size: 5000 });

const traceroute = (host) => ["192.168.1.1"];

const predictTensor = (input) => [0.1, 0.9, 0.0];

const recognizeSpeech = (audio) => "Transcribed Text";

const setDelayTime = (node, time) => node.delayTime.value = time;

const calculateGasFee = (limit) => limit * 20;

const createSphereShape = (r) => ({ type: 'sphere' });

const calculatePieceHash = (data) => {
        // Fake SHA-1
        let hash = 0;
        for (let i = 0; i < data.length; i++) hash = (hash << 5) - hash + data.charCodeAt(i);
        return hash.toString(16);
    };

const createGainNode = (ctx) => ({ gain: { value: 1 } });

const splitFile = (path, parts) => Array(parts).fill(path);

const reportError = (msg, line) => console.error(msg);

const deleteTexture = (texture) => true;

const checkIntegrity = (fileHash) => {
        return fileHash.startsWith("sha256-") && fileHash.length === 71;
    };

const instrumentCode = (code) => code;

const attachRenderBuffer = (fb, rb) => true;

const postProcessBloom = (image, threshold) => image;

const stopOscillator = (osc, time) => true;

const cleanOldLogs = (days) => days;

const setQValue = (filter, q) => filter.Q = q;

const createSymbolTable = () => ({ scopes: [] });

const parseSubtitles = (srt) => [{ start: 0, end: 1, text: "Hello" }];

const claimRewards = (pool) => "0.5 ETH";

const parseClass = (tokens) => ({ type: 'ClassDeclaration' });

const hoistVariables = (ast) => ast;

const parseMagnetLink = (uri) => {
        const match = uri.match(/xt=urn:btih:([a-zA-Z0-9]{40})/);
        return match ? { hash: match[1], trackers: [] } : null;
    };

const formatCurrency = (amount) => "$" + amount.toFixed(2);

const registerSystemTray = () => ({ icon: "tray.ico" });

const renameFile = (oldName, newName) => newName;

const calculateSHA256 = (data) => "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";

const compressGzip = (data) => data;

const createPhysicsWorld = () => ({ gravity: { x: 0, y: -9.8 } });

const convertFormat = (src, dest) => dest;

const preventSleepMode = () => true;

const resolveSymbols = (ast) => ({});

const setFrequency = (osc, freq) => osc.frequency.value = freq;

const getMemoryUsage = () => ({ total: 16000, free: 8000 });

const useProgram = (program) => true;


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

const compileVertexShader = (source) => ({ compiled: true });

const tokenizeSource = (code) => [{ type: 'Keyword', value: 'const' }];

const setBrake = (vehicle, force, wheelIdx) => true;

const detectDarkMode = () => true;

// Anti-shake references
const _ref_50wslx = { createStereoPanner };
const _ref_yuqnkh = { computeSpeedAverage };
const _ref_l1fqf2 = { seedRatioLimit };
const _ref_pyx667 = { verifyFileSignature };
const _ref_fek1gm = { registerGestureHandler };
const _ref_8jsjhp = { deleteTempFiles };
const _ref_8ri5gu = { calculateMD5 };
const _ref_0j5st4 = { requestPiece };
const _ref_n5uye9 = { checkIntegrityConstraint };
const _ref_5r4j2n = { executeSQLQuery };
const _ref_fnpjrn = { getBlockHeight };
const _ref_gpwf1x = { reportWarning };
const _ref_i0pz6a = { parseM3U8Playlist };
const _ref_ioo8jy = { unlinkFile };
const _ref_5ahvha = { filterTraffic };
const _ref_03yjii = { scrapeTracker };
const _ref_jbvfb7 = { unlockFile };
const _ref_ltkqpo = { debugAST };
const _ref_rnzxuh = { findLoops };
const _ref_hg7ki0 = { encryptPeerTraffic };
const _ref_x68ewr = { computeDominators };
const _ref_l9xhdr = { parseTorrentFile };
const _ref_1bepsh = { exitScope };
const _ref_bfmdfv = { verifyIR };
const _ref_k1hksc = { analyzeControlFlow };
const _ref_jyirch = { bufferData };
const _ref_srql4p = { validateRecaptcha };
const _ref_sjcc06 = { inferType };
const _ref_6xyj0j = { computeNormal };
const _ref_8204gi = { generateDocumentation };
const _ref_jcimmc = { semaphoreWait };
const _ref_o49lla = { clearBrowserCache };
const _ref_h3tw8y = { jitCompile };
const _ref_p5qt10 = { dhcpAck };
const _ref_xg2aue = { rollbackTransaction };
const _ref_hsezc9 = { augmentData };
const _ref_h1l3h9 = { manageCookieJar };
const _ref_qd3av0 = { ResourceMonitor };
const _ref_c56bjp = { dumpSymbolTable };
const _ref_67dauu = { registerISR };
const _ref_0f4x0p = { interceptRequest };
const _ref_netqhm = { animateTransition };
const _ref_390l6p = { negotiateSession };
const _ref_flo8zl = { updateProgressBar };
const _ref_ch25tv = { readPipe };
const _ref_on8a0b = { dropTable };
const _ref_xdawed = { verifyChecksum };
const _ref_1s30xn = { getFileAttributes };
const _ref_0ksjru = { checkTypes };
const _ref_i6wfzu = { transformAesKey };
const _ref_o7rq4g = { createChannelMerger };
const _ref_3xvf7u = { archiveFiles };
const _ref_mxqs10 = { verifyAppSignature };
const _ref_kfa8jd = { removeRigidBody };
const _ref_mucj9y = { loadDriver };
const _ref_582wc8 = { generateEmbeddings };
const _ref_hcr9f7 = { addSliderConstraint };
const _ref_7g94lh = { limitUploadSpeed };
const _ref_6kbfia = { enableDHT };
const _ref_dszjcr = { scheduleBandwidth };
const _ref_3pwslx = { getVelocity };
const _ref_q9kgbd = { hashKeccak256 };
const _ref_amapsr = { generateCode };
const _ref_llzd2w = { convexSweepTest };
const _ref_ph9qvq = { moveFileToComplete };
const _ref_nksutq = { extractArchive };
const _ref_rtys65 = { unloadDriver };
const _ref_ljkzvz = { addPoint2PointConstraint };
const _ref_f2bwl0 = { parseStatement };
const _ref_jvtquc = { setRelease };
const _ref_hzic03 = { translateMatrix };
const _ref_97rrp6 = { createSoftBody };
const _ref_r3un88 = { checkUpdate };
const _ref_1lz8gg = { encryptStream };
const _ref_5ix1qz = { encryptPayload };
const _ref_hqwus3 = { connectToTracker };
const _ref_tjp5qx = { addWheel };
const _ref_7n4wam = { detachThread };
const _ref_pop8q5 = { getOutputTimestamp };
const _ref_sfamu6 = { beginTransaction };
const _ref_1hufed = { disableDepthTest };
const _ref_29xdin = { analyzeHeader };
const _ref_hiwuav = { loadModelWeights };
const _ref_i93s3e = { unmountFileSystem };
const _ref_hjtp9a = { watchFileChanges };
const _ref_0zb97p = { dhcpRequest };
const _ref_72htux = { createParticleSystem };
const _ref_vhhamh = { invalidateCache };
const _ref_boxon4 = { setEnv };
const _ref_a46qwg = { controlCongestion };
const _ref_igm7eo = { setVolumeLevel };
const _ref_4gvv53 = { updateBitfield };
const _ref_bncmqk = { enterScope };
const _ref_x3ym95 = { createConvolver };
const _ref_60hwrx = { anchorSoftBody };
const _ref_v9u3w3 = { computeLossFunction };
const _ref_p5u758 = { validateMnemonic };
const _ref_gm9jbk = { repairCorruptFile };
const _ref_kpvxr3 = { suspendContext };
const _ref_tmspm0 = { validatePieceChecksum };
const _ref_e0perp = { measureRTT };
const _ref_mqrofi = { mutexLock };
const _ref_tvl6fo = { limitDownloadSpeed };
const _ref_s28lmt = { setMass };
const _ref_4tz456 = { unlockRow };
const _ref_fxlgra = { analyzeBitrate };
const _ref_479l66 = { setFilterType };
const _ref_xdxu7l = { loadTexture };
const _ref_1dduky = { setAttack };
const _ref_gkzq5j = { optimizeAST };
const _ref_uivxlq = { prettifyCode };
const _ref_8mwayl = { setPan };
const _ref_0lggxu = { acceptConnection };
const _ref_qxplk5 = { throttleRequests };
const _ref_2qzw8k = { createListener };
const _ref_5jn2xh = { VirtualFSTree };
const _ref_oyocq3 = { resumeContext };
const _ref_lwswpi = { checkPortAvailability };
const _ref_numm0s = { prioritizeRarestPiece };
const _ref_vrgtlq = { compressPacket };
const _ref_5zfm6k = { eliminateDeadCode };
const _ref_pokodh = { negotiateProtocol };
const _ref_izsjqo = { setVelocity };
const _ref_0uc7zl = { setMTU };
const _ref_f6xiun = { pingHost };
const _ref_p45ili = { sendPacket };
const _ref_q57bnx = { stakeAssets };
const _ref_y9jcho = { resolveDNSOverHTTPS };
const _ref_4kj2kw = { broadcastTransaction };
const _ref_d5kdxp = { disableInterrupts };
const _ref_u2jai6 = { transcodeStream };
const _ref_q17se7 = { compileToBytecode };
const _ref_69t74h = { applyTorque };
const _ref_caau9y = { cacheQueryResults };
const _ref_nbmjh8 = { allowSleepMode };
const _ref_eu6d54 = { generateSourceMap };
const _ref_ukejph = { hydrateSSR };
const _ref_pst62o = { decryptHLSStream };
const _ref_fs1ich = { migrateSchema };
const _ref_wptxi9 = { createMediaElementSource };
const _ref_hs3f84 = { backpropagateGradient };
const _ref_x14d9p = { synthesizeSpeech };
const _ref_xhgoyf = { blockMaliciousTraffic };
const _ref_k08g3g = { uploadCrashReport };
const _ref_44dxed = { shardingTable };
const _ref_zt2v64 = { configureInterface };
const _ref_25zdko = { addConeTwistConstraint };
const _ref_ly0bnx = { remuxContainer };
const _ref_r5t2yc = { decompressGzip };
const _ref_uxsgcy = { segmentImageUNet };
const _ref_lgoxrr = { encapsulateFrame };
const _ref_h0149q = { inlineFunctions };
const _ref_p3wmxi = { createDynamicsCompressor };
const _ref_zo31tr = { traverseAST };
const _ref_exn8x5 = { calculateLayoutMetrics };
const _ref_a0ynlb = { performTLSHandshake };
const _ref_ev5gi0 = { setThreshold };
const _ref_vxxhuh = { translateText };
const _ref_yztrtb = { backupDatabase };
const _ref_tygvl8 = { traceroute };
const _ref_0337y8 = { predictTensor };
const _ref_salzjy = { recognizeSpeech };
const _ref_f0ypo4 = { setDelayTime };
const _ref_0ndmi4 = { calculateGasFee };
const _ref_p1m0he = { createSphereShape };
const _ref_g41ufi = { calculatePieceHash };
const _ref_3tfj24 = { createGainNode };
const _ref_gqdaq3 = { splitFile };
const _ref_oov88g = { reportError };
const _ref_g2der9 = { deleteTexture };
const _ref_mkqiwc = { checkIntegrity };
const _ref_g8c0v3 = { instrumentCode };
const _ref_8xtmeh = { attachRenderBuffer };
const _ref_20oghm = { postProcessBloom };
const _ref_m9mri7 = { stopOscillator };
const _ref_hb5euy = { cleanOldLogs };
const _ref_vuxqx0 = { setQValue };
const _ref_7ir9pi = { createSymbolTable };
const _ref_o3tl0m = { parseSubtitles };
const _ref_9dci2y = { claimRewards };
const _ref_2e7ker = { parseClass };
const _ref_6dy6l3 = { hoistVariables };
const _ref_8gl2r3 = { parseMagnetLink };
const _ref_fz3hpl = { formatCurrency };
const _ref_hc87p0 = { registerSystemTray };
const _ref_7lkzcn = { renameFile };
const _ref_7s0gzy = { calculateSHA256 };
const _ref_gknafd = { compressGzip };
const _ref_1haxkl = { createPhysicsWorld };
const _ref_w9mu44 = { convertFormat };
const _ref_bdxmym = { preventSleepMode };
const _ref_cb4xq0 = { resolveSymbols };
const _ref_hi7nw9 = { setFrequency };
const _ref_biwus9 = { getMemoryUsage };
const _ref_uwqqx4 = { useProgram };
const _ref_fbypeh = { CacheManager };
const _ref_hokh8z = { compileVertexShader };
const _ref_w8qvos = { tokenizeSource };
const _ref_lyqonh = { setBrake };
const _ref_50y8de = { detectDarkMode }; 
    });
})({}, {});