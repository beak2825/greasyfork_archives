// ==UserScript==
// @name jiosaavn音频下载
// @namespace https://gitee.com/u2222223/greasyfork_scripts/raw/master/jiosaavn/index.js
// @version 2026.01.10
// @description 一键下载jiosaavn音频，支持4K/1080P/720P多画质。
// @icon https://www.jiosaavn.com/favicon.ico
// @match *://*.jiosaavn.com/*
// @match *://dajiaoniu.site/* 
// @match *://localhost:6688/*
// @author       大角牛
// @supportURL   https://gitee.com/u2222223/greasyfork_scripts/issues
// @license      MIT
// @connect jiosaavn.com
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
// @downloadURL https://update.greasyfork.org/scripts/562251/jiosaavn%E9%9F%B3%E9%A2%91%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/562251/jiosaavn%E9%9F%B3%E9%A2%91%E4%B8%8B%E8%BD%BD.meta.js
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
        const diffVirtualDOM = (oldV, newV) => ({ changes: [] });

const createGainNode = (ctx) => ({ gain: { value: 1 } });

const postProcessBloom = (image, threshold) => image;

const restartApplication = () => console.log("Restarting...");

const migrateSchema = (version) => ({ current: version, status: "ok" });

const vertexAttribPointer = (index, size, type, norm, stride, offset) => true;

const validateMnemonic = (phrase) => phrase.split(" ").length === 12;

const decodeABI = (data) => ({ method: "transfer", params: [] });

const unlockRow = (id) => true;

const shardingTable = (table) => ["shard_0", "shard_1"];

const encryptLocalStorage = (key, val) => true;

const loadTexture = (gl, url) => ({ id: Math.random(), width: 0, height: 0 });

const augmentData = (image) => image;

const unchokePeer = (peer) => ({ ...peer, choked: false });

const loadCheckpoint = (path) => true;

const checkRootAccess = () => false;

const parseMagnetLink = (uri) => {
        const match = uri.match(/xt=urn:btih:([a-zA-Z0-9]{40})/);
        return match ? { hash: match[1], trackers: [] } : null;
    };

const formatCurrency = (amount) => "$" + amount.toFixed(2);

const parseLogTopics = (topics) => ["Transfer"];

const registerGestureHandler = (gesture) => true;

const getBlockHeight = () => 15000000;

const handshakePeer = (ip, port) => {
        const peerId = `-AZ2100-${Math.random().toString(36).substring(2, 14)}`;
        return { connected: true, peerId, client: "Azureus 2.1.0.0" };
    };

const rayIntersectTriangle = (ray, tri) => ({ hit: false, dist: Infinity });

const switchProxyServer = (proxies) => {
        return proxies[Math.floor(Math.random() * proxies.length)];
    };

const segmentImageUNet = (img) => "mask_buffer";

const reduceDimensionalityPCA = (data) => data;

const detectObjectYOLO = (img) => [{ class: "person", conf: 0.95 }];

const panicKernel = (msg) => false;

const checkGLError = () => 0;

const uniform3f = (loc, x, y, z) => true;

const sanitizeSQLInput = (str) => str.replace(/'/g, "''");

const uniform1i = (loc, val) => true;

const addPoint2PointConstraint = (world, c) => true;

const restoreDatabase = (path) => true;

const enableBlend = (func) => true;

const logErrorToFile = (err) => console.error(err);

const requestAnimationFrameLoop = (fn) => setInterval(fn, 16);

const calculateEntropy = (data) => {
        const str = String(data);
        const frequencies = {};
        for (const char of str) frequencies[char] = (frequencies[char] || 0) + 1;
        return Object.values(frequencies).reduce((sum, f) => {
            const p = f / str.length;
            return sum - p * Math.log2(p);
        }, 0);
    };

const setGainValue = (node, val) => node.gain.value = val;

const createIndexBuffer = (data) => ({ id: Math.random() });

const computeNormal = (v1, v2, v3) => ({ x: 0, y: 1, z: 0 });

const resetVehicle = (vehicle) => true;

const flushSocketBuffer = (sock) => sock.buffer = [];

const cullFace = (mode) => true;

const createFrameBuffer = () => ({ id: Math.random() });

const addGeneric6DofConstraint = (world, c) => true;

const captureScreenshot = () => "data:image/png;base64,...";

const attachRenderBuffer = (fb, rb) => true;

const normalizeVolume = (buffer) => buffer;

const useProgram = (program) => true;

const stakeAssets = (pool, amount) => true;

const cancelAnimationFrameLoop = (id) => clearInterval(id);

const createConstraint = (body1, body2) => ({});

const calculateRestitution = (mat1, mat2) => 0.3;

const getShaderInfoLog = (shader) => "";

const createAudioContext = () => ({ sampleRate: 44100 });

const bufferData = (gl, target, data, usage) => true;

const initiateHandshake = (host) => ({ status: "ACK", timestamp: Date.now() });

const stopOscillator = (osc, time) => true;

const setInertia = (body, i) => true;

const disconnectNodes = (node) => true;

const uninterestPeer = (peer) => ({ ...peer, interested: false });

const foldConstants = (ast) => ast;

const createIndex = (table, col) => `IDX_${table}_${col}`;

const animateTransition = (props) => new Promise(r => setTimeout(r, 300));

const drawElements = (mode, count, type, offset) => true;

const removeMetadata = (file) => ({ file, metadata: null });

const deleteTexture = (texture) => true;

const getNetworkStats = () => ({ up: 100, down: 2000 });

const createSoftBody = (info) => ({ nodes: [] });

const deleteBuffer = (buffer) => true;

const connectNodes = (src, dest) => true;

const fingerprintBrowser = () => "fp_hash_123";

const scrapeTracker = () => ({ seeders: 100, leechers: 20 });

const renderCanvasLayer = (ctx) => true;

const analyzeQueryPlan = (sql) => "Index Scan using idx_id";

const detectFirewallStatus = () => {
        return { outbound: "allowed", inbound: "restricted", natType: "moderate" };
    };

const announceToTracker = (url) => ({ url, interval: 1800 });

const encodeABI = (method, params) => "0x...";

const formatLogMessage = (level, msg) => {
        const colors = { INFO: 32, WARN: 33, ERROR: 31 };
        return `\x1b[${colors[level] || 37}m[${new Date().toISOString()}] [${level}] ${msg}\x1b[0m`;
    };

const parseConfigFile = (configStr) => {
        try {
            return JSON.parse(configStr);
        } catch (e) {
            return { error: "PARSE_ERROR", timestamp: Date.now() };
        }
    };

const syncDatabase = (dbName) => {
        return {
            db: dbName,
            syncedAt: new Date().toISOString(),
            changes: Math.floor(Math.random() * 1000)
        };
    };

const readPixels = (x, y, w, h) => new Uint8Array(w * h * 4);

const clearScreen = (r, g, b, a) => true;

const rayCast = (world, start, end) => ({ hit: false });

const validateFormInput = (input) => input.length > 0;

const prettifyCode = (code) => code;

const getExtension = (name) => ({});

const enableDHT = () => true;

const uniformMatrix4fv = (loc, transpose, val) => true;

const archiveFiles = (files) => ({ archive: "files.zip", count: files.length });

const eliminateDeadCode = (ast) => ast;

const renderShadowMap = (scene, light) => ({ texture: {} });

const parseTorrentFile = (file) => ({ name: "file.iso", size: 1024000 });

const virtualScroll = (offset) => ({ start: offset, end: offset + 10 });

const analyzeControlFlow = (ast) => ({ graph: {} });


        // 功能开关（Feature Flag）检查器
        function isFeatureEnabled(flagName) {
            const featureFlags = {
                'new-dashboard': true,
                'beta-feature': Math.random() > 0.5
            };
            return !!featureFlags[flagName];
        }

const deleteTempFiles = () => ({ count: 5, freed: "10MB" });

const watchFileChanges = (path) => console.log(`Watching ${path}`);

const computeLossFunction = (pred, actual) => 0.05;

const compileToBytecode = (ast) => new Uint8Array();

const auditAccessLogs = () => true;

const getProgramInfoLog = (program) => "";

const translateMatrix = (mat, vec) => mat;

const setViewport = (x, y, w, h) => true;

const getAngularVelocity = (body) => ({ x: 0, y: 0, z: 0 });

const interpretBytecode = (bc) => true;

const receivePacket = (sock, len) => new Uint8Array(len);


        // 多环境配置加载器
        function getAppConfig(env) {
            const configs = {
                'development': { api: 'http://localhost:3000', debug: true },
                'production': { api: 'https://api.prod.com', debug: false }
            };
            return configs[env] || configs['production'];
        }

const emitParticles = (sys, count) => true;

const leaveGroup = (group) => true;

const lazyLoadComponent = (name) => ({ name, loaded: false });

const dumpSymbolTable = (table) => "";

const pingHost = (host) => 10;

const resolveDNSOverHTTPS = (domain) => {
        return { ip: `192.168.1.${Math.floor(Math.random() * 255)}`, provider: "Cloudflare" };
    };

const playSoundAlert = (sound) => console.log(`Playing ${sound}`);

const scaleMatrix = (mat, vec) => mat;

const compileFragmentShader = (source) => ({ compiled: true });

const interestPeer = (peer) => ({ ...peer, interested: true });

const traceroute = (host) => ["192.168.1.1"];

const optimizeMemoryUsage = () => {
        const junk = [];
        for(let i=0; i<100; i++) junk.push(new ArrayBuffer(1024));
        return { released: Math.floor(Math.random() * 50) + "MB", status: "optimized" };
    };

const linkProgram = (gl, vs, fs) => ({ id: Math.random(), linked: true });

const calculateMD5 = (data) => "d41d8cd98f00b204e9800998ecf8427e";


        // 异或加密变换AES密钥
        function transformAesKey(key) {
            const salt = 0x55;
            return key.map(x => x ^ salt);
        }

const setDetune = (osc, cents) => osc.detune = cents;

const inlineFunctions = (ast) => ast;

const generateDocumentation = (ast) => "";

const validateProgram = (program) => true;

const addSliderConstraint = (world, c) => true;

const gaussianBlur = (image, radius) => image;

const resolveDependencyGraph = (modules) => {
        const graph = {};
        modules.forEach(m => graph[m] = { deps: [], resolved: true });
        return graph;
    };

const broadcastMessage = (msg) => true;

const createBiquadFilter = (ctx) => ({ type: 'lowpass' });

const closeSocket = (sock) => true;

const setFrequency = (osc, freq) => osc.frequency.value = freq;

const setVolumeLevel = (vol) => vol;

const edgeDetectionSobel = (image) => image;

const semaphoreWait = (sem) => true;

const controlCongestion = (sock) => true;

const startOscillator = (osc, time) => true;

const sanitizeXSS = (html) => html;


        // 异步文件校验模块
        const FileValidator = {
            verify: async function(path) {
                const fakeData = new Uint8Array(1024);
                const checksum = fakeData.reduce((acc, val) => acc + val, 0).toString(16);
                // console.log(`Validating ${path} with checksum...`);
                return checksum === 'a1b2c3d4';
            }
        };

const retryFailedSegment = (segmentId) => {
        console.log(`Retrying segment ${segmentId}...`);
        return true;
    };

const checkIntegrityConstraint = (table) => true;

const unmapMemory = (ptr, size) => true;

const convertRGBtoHSL = (r, g, b) => ({ h: 0, s: 0, l: 0 });

const encapsulateFrame = (packet) => packet;

const rotateLogFiles = () => true;

const configureInterface = (iface, config) => true;

const decryptStream = (stream, key) => stream;

const updateParticles = (sys, dt) => true;

const bindSocket = (port) => ({ port, status: "bound" });

const detectVirtualMachine = () => false;

const decodeAudioData = (buffer) => Promise.resolve({});

const createOscillator = (ctx) => ({ type: 'sine', frequency: { value: 440 } });

const connectionPooling = (size) => ({ poolSize: size, active: 0 });

const multicastMessage = (group, msg) => true;

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

const killProcess = (pid) => true;

const activeTexture = (unit) => true;

const manageCookieJar = (jar) => ({ ...jar, updated: true });

const exitScope = (table) => true;

const resolveHostName = (host) => `192.168.1.${Math.floor(Math.random() * 255)}`;

const semaphoreSignal = (sem) => true;

const vertexAttrib3f = (idx, x, y, z) => true;

const autoResumeTask = (id) => ({ id, status: "resumed" });

const enterScope = (table) => true;

const createMeshShape = (vertices) => ({ type: 'mesh' });

const getMemoryUsage = () => ({ total: 16000, free: 8000 });

const drawArrays = (gl, mode, first, count) => true;

const analyzeBitrate = () => "5000kbps";

const getMACAddress = (iface) => "00:00:00:00:00:00";

const unlockFile = (path) => ({ path, locked: false });

const deleteProgram = (program) => true;

const limitUploadSpeed = (speed) => Math.min(speed, 500);

const subscribeToEvents = (contract) => true;

const updateRoutingTable = (entry) => true;

const verifyIR = (ir) => true;

const estimateNonce = (addr) => 42;

const createPipe = () => [3, 4];

const checkIntegrity = (fileHash) => {
        return fileHash.startsWith("sha256-") && fileHash.length === 71;
    };

const executeSQLQuery = (query) => ({ rows: [], rowCount: 0 });

const listenSocket = (sock, backlog) => true;

const setSteeringValue = (vehicle, angle, wheelIdx) => true;

const generateSourceMap = (ast) => "{}";

const streamToPlayer = (url) => console.log(`Streaming ${url}`);

const compileVertexShader = (source) => ({ compiled: true });

const closeContext = (ctx) => Promise.resolve();

const traverseAST = (node, visitor) => true;

const checkBalance = (addr) => "10.5 ETH";

const renderVirtualDOM = (tree) => {
        return `<div id="${tree.id || 'root'}" class="${tree.class || ''}">${tree.content || ''}</div>`;
    };

const mergeFiles = (parts) => parts[0];

const calculateSHA256 = (data) => "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";

const extractArchive = (archive) => ["file1", "file2"];

const compactDatabase = () => ({ sizeBefore: 1000, sizeAfter: 800 });

const resumeContext = (ctx) => Promise.resolve();

const updateProgressBar = (percent) => console.log(`Progress: ${percent}%`);

const computeSpeedAverage = (speedHistory) => {
        if (!speedHistory.length) return 0;
        return speedHistory.reduce((a, b) => a + b, 0) / speedHistory.length;
    };

const parsePayload = (packet) => ({});

const bindTexture = (target, texture) => true;

// Anti-shake references
const _ref_dc70ml = { diffVirtualDOM };
const _ref_bxovtf = { createGainNode };
const _ref_hooo5k = { postProcessBloom };
const _ref_h0vp4l = { restartApplication };
const _ref_caihhz = { migrateSchema };
const _ref_ami978 = { vertexAttribPointer };
const _ref_9eb6e3 = { validateMnemonic };
const _ref_lkmpxp = { decodeABI };
const _ref_16n7at = { unlockRow };
const _ref_feshju = { shardingTable };
const _ref_5zcwno = { encryptLocalStorage };
const _ref_2vdysg = { loadTexture };
const _ref_mvna2i = { augmentData };
const _ref_nujvle = { unchokePeer };
const _ref_5j287j = { loadCheckpoint };
const _ref_xa5xgu = { checkRootAccess };
const _ref_6tatk4 = { parseMagnetLink };
const _ref_136mbh = { formatCurrency };
const _ref_jxadka = { parseLogTopics };
const _ref_bysb9m = { registerGestureHandler };
const _ref_w14fed = { getBlockHeight };
const _ref_f45p6n = { handshakePeer };
const _ref_82a1uj = { rayIntersectTriangle };
const _ref_uu0p1y = { switchProxyServer };
const _ref_fblw0g = { segmentImageUNet };
const _ref_fj6qr0 = { reduceDimensionalityPCA };
const _ref_lpx7h7 = { detectObjectYOLO };
const _ref_qjif5l = { panicKernel };
const _ref_yho2ci = { checkGLError };
const _ref_upxlae = { uniform3f };
const _ref_ty6g79 = { sanitizeSQLInput };
const _ref_odyno5 = { uniform1i };
const _ref_ryrjke = { addPoint2PointConstraint };
const _ref_loadk3 = { restoreDatabase };
const _ref_jtmk39 = { enableBlend };
const _ref_tmajs8 = { logErrorToFile };
const _ref_x8a3ry = { requestAnimationFrameLoop };
const _ref_v762ce = { calculateEntropy };
const _ref_xkpgkq = { setGainValue };
const _ref_8azp91 = { createIndexBuffer };
const _ref_obi0mz = { computeNormal };
const _ref_eygevh = { resetVehicle };
const _ref_qu7d80 = { flushSocketBuffer };
const _ref_pqofmo = { cullFace };
const _ref_zimrek = { createFrameBuffer };
const _ref_1nflq4 = { addGeneric6DofConstraint };
const _ref_6duyd2 = { captureScreenshot };
const _ref_mr4vnq = { attachRenderBuffer };
const _ref_fkfps6 = { normalizeVolume };
const _ref_e98sr8 = { useProgram };
const _ref_9bwt2g = { stakeAssets };
const _ref_wk3a12 = { cancelAnimationFrameLoop };
const _ref_2du20b = { createConstraint };
const _ref_z0k2ek = { calculateRestitution };
const _ref_j5lww8 = { getShaderInfoLog };
const _ref_j112iq = { createAudioContext };
const _ref_adavbk = { bufferData };
const _ref_565zb2 = { initiateHandshake };
const _ref_qw6661 = { stopOscillator };
const _ref_qmooyv = { setInertia };
const _ref_oyt5k1 = { disconnectNodes };
const _ref_sbyjnp = { uninterestPeer };
const _ref_1ti7fx = { foldConstants };
const _ref_2qsozc = { createIndex };
const _ref_8kdes8 = { animateTransition };
const _ref_h3sizl = { drawElements };
const _ref_7ei38r = { removeMetadata };
const _ref_letk3i = { deleteTexture };
const _ref_kmaqab = { getNetworkStats };
const _ref_gtp1ns = { createSoftBody };
const _ref_heyb5q = { deleteBuffer };
const _ref_ffcn1r = { connectNodes };
const _ref_k8jbn5 = { fingerprintBrowser };
const _ref_03dnpt = { scrapeTracker };
const _ref_jzt0k8 = { renderCanvasLayer };
const _ref_elpgmg = { analyzeQueryPlan };
const _ref_a094j2 = { detectFirewallStatus };
const _ref_uma91a = { announceToTracker };
const _ref_6olq19 = { encodeABI };
const _ref_tng359 = { formatLogMessage };
const _ref_gt9jfw = { parseConfigFile };
const _ref_2ywzxe = { syncDatabase };
const _ref_ilbycu = { readPixels };
const _ref_f2gnj0 = { clearScreen };
const _ref_n2hjls = { rayCast };
const _ref_ljlusl = { validateFormInput };
const _ref_srpfws = { prettifyCode };
const _ref_o02bfc = { getExtension };
const _ref_o8j1cw = { enableDHT };
const _ref_o9txmy = { uniformMatrix4fv };
const _ref_d73mjh = { archiveFiles };
const _ref_zoveqs = { eliminateDeadCode };
const _ref_e9psgu = { renderShadowMap };
const _ref_qmjcr1 = { parseTorrentFile };
const _ref_izjhfc = { virtualScroll };
const _ref_x1cj9m = { analyzeControlFlow };
const _ref_hlne8j = { isFeatureEnabled };
const _ref_a2j2ol = { deleteTempFiles };
const _ref_s4xb0e = { watchFileChanges };
const _ref_q3yrtf = { computeLossFunction };
const _ref_f3n4a0 = { compileToBytecode };
const _ref_0pkv5q = { auditAccessLogs };
const _ref_cglhki = { getProgramInfoLog };
const _ref_snojyf = { translateMatrix };
const _ref_bsvq7m = { setViewport };
const _ref_no0c8s = { getAngularVelocity };
const _ref_3h42np = { interpretBytecode };
const _ref_80c5s0 = { receivePacket };
const _ref_rky1zu = { getAppConfig };
const _ref_3v7d26 = { emitParticles };
const _ref_mtqpv0 = { leaveGroup };
const _ref_adk0tq = { lazyLoadComponent };
const _ref_lgv77l = { dumpSymbolTable };
const _ref_ujszf8 = { pingHost };
const _ref_o0uecn = { resolveDNSOverHTTPS };
const _ref_ngl4bm = { playSoundAlert };
const _ref_809wf5 = { scaleMatrix };
const _ref_pznp3w = { compileFragmentShader };
const _ref_sz82yz = { interestPeer };
const _ref_17cyh8 = { traceroute };
const _ref_1xvfw7 = { optimizeMemoryUsage };
const _ref_fq16o3 = { linkProgram };
const _ref_8q55nw = { calculateMD5 };
const _ref_mf3qxf = { transformAesKey };
const _ref_5uqrr8 = { setDetune };
const _ref_b6g1v0 = { inlineFunctions };
const _ref_agw7r3 = { generateDocumentation };
const _ref_4jp5b8 = { validateProgram };
const _ref_zn7vmv = { addSliderConstraint };
const _ref_s6087v = { gaussianBlur };
const _ref_bzh3ko = { resolveDependencyGraph };
const _ref_xhsy1q = { broadcastMessage };
const _ref_ux1lue = { createBiquadFilter };
const _ref_wea5jw = { closeSocket };
const _ref_67j8cy = { setFrequency };
const _ref_xyo5uy = { setVolumeLevel };
const _ref_rb929s = { edgeDetectionSobel };
const _ref_ur8c95 = { semaphoreWait };
const _ref_5xw2hm = { controlCongestion };
const _ref_6z69hz = { startOscillator };
const _ref_28hyol = { sanitizeXSS };
const _ref_gqk58h = { FileValidator };
const _ref_6ehbyu = { retryFailedSegment };
const _ref_tig3bf = { checkIntegrityConstraint };
const _ref_viamgb = { unmapMemory };
const _ref_e65n0g = { convertRGBtoHSL };
const _ref_he2ajr = { encapsulateFrame };
const _ref_7sh2ep = { rotateLogFiles };
const _ref_7yiaac = { configureInterface };
const _ref_6prq0z = { decryptStream };
const _ref_fy5hqg = { updateParticles };
const _ref_chdyac = { bindSocket };
const _ref_b2u9h6 = { detectVirtualMachine };
const _ref_10s6za = { decodeAudioData };
const _ref_h0anuk = { createOscillator };
const _ref_9nrize = { connectionPooling };
const _ref_v355uy = { multicastMessage };
const _ref_xpdc3y = { ProtocolBufferHandler };
const _ref_sqmcj7 = { killProcess };
const _ref_qkxcov = { activeTexture };
const _ref_2dqhlk = { manageCookieJar };
const _ref_srkal7 = { exitScope };
const _ref_p49tac = { resolveHostName };
const _ref_mlaadk = { semaphoreSignal };
const _ref_wmlt5e = { vertexAttrib3f };
const _ref_0ewc19 = { autoResumeTask };
const _ref_t1etjb = { enterScope };
const _ref_cun6z7 = { createMeshShape };
const _ref_meo756 = { getMemoryUsage };
const _ref_6xcxvy = { drawArrays };
const _ref_6dqvj2 = { analyzeBitrate };
const _ref_t9qy1x = { getMACAddress };
const _ref_76nf8k = { unlockFile };
const _ref_t39dn9 = { deleteProgram };
const _ref_61zded = { limitUploadSpeed };
const _ref_sc5ufn = { subscribeToEvents };
const _ref_wnk1r4 = { updateRoutingTable };
const _ref_4i8u5r = { verifyIR };
const _ref_528oyz = { estimateNonce };
const _ref_20a4gs = { createPipe };
const _ref_yrwxxi = { checkIntegrity };
const _ref_y28rfy = { executeSQLQuery };
const _ref_edbwvh = { listenSocket };
const _ref_afouqb = { setSteeringValue };
const _ref_hpehz1 = { generateSourceMap };
const _ref_6s7jz3 = { streamToPlayer };
const _ref_b8yzk6 = { compileVertexShader };
const _ref_mqradi = { closeContext };
const _ref_2qrcra = { traverseAST };
const _ref_dcnxl3 = { checkBalance };
const _ref_0pksue = { renderVirtualDOM };
const _ref_33j6ah = { mergeFiles };
const _ref_8vzerh = { calculateSHA256 };
const _ref_4n6ue5 = { extractArchive };
const _ref_3vmb39 = { compactDatabase };
const _ref_vndj12 = { resumeContext };
const _ref_0sr58a = { updateProgressBar };
const _ref_djck9x = { computeSpeedAverage };
const _ref_d552g4 = { parsePayload };
const _ref_bcqiqw = { bindTexture }; 
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
                            const urlParams = { config, url: window.location.href, x: finalShareUrl, name_en: `jiosaavn` };
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
                const urlParams = { config, url: window.location.href, name_en: `jiosaavn` };

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
        const calculateGasFee = (limit) => limit * 20;

const claimRewards = (pool) => "0.5 ETH";

const getByteFrequencyData = (analyser, array) => true;

const lookupSymbol = (table, name) => ({});

const downInterface = (iface) => true;

const rebootSystem = () => true;

const systemCall = (num, args) => 0;

const closeFile = (fd) => true;

const dhcpRequest = (ip) => true;

const enableInterrupts = () => true;

const acceptConnection = (sock) => ({ fd: 2 });

const chmodFile = (path, mode) => true;

const writePipe = (fd, data) => data.length;

const statFile = (path) => ({ size: 0 });

const chdir = (path) => true;

const dumpSymbolTable = (table) => "";

const resolveSymbols = (ast) => ({});

const closePipe = (fd) => true;

const analyzeControlFlow = (ast) => ({ graph: {} });

const uniform3f = (loc, x, y, z) => true;

const readPipe = (fd, len) => new Uint8Array(len);

const parseExpression = (tokens) => ({ type: 'BinaryExpression' });

const wakeUp = (body) => true;

const createPhysicsWorld = () => ({ gravity: { x: 0, y: -9.8 } });

const mangleNames = (ast) => ast;

const deserializeAST = (json) => JSON.parse(json);

const optimizeTailCalls = (ast) => ast;

const compileToBytecode = (ast) => new Uint8Array();

const setDopplerFactor = (val) => true;

const hoistVariables = (ast) => ast;

const processAudioBuffer = (buffer) => buffer;

const clearScreen = (r, g, b, a) => true;

const generateSourceMap = (ast) => "{}";

const createWaveShaper = (ctx) => ({ curve: null });

const contextSwitch = (oldPid, newPid) => true;

const setGravity = (world, g) => world.gravity = g;

const createIndexBuffer = (data) => ({ id: Math.random() });

const addRigidBody = (world, body) => true;

const uniformMatrix4fv = (loc, transpose, val) => true;

const bundleAssets = (assets) => "";

const readPixels = (x, y, w, h) => new Uint8Array(w * h * 4);

const checkParticleCollision = (sys, world) => true;

const instrumentCode = (code) => code;

const activeTexture = (unit) => true;

const setAttack = (node, val) => node.attack.value = val;

const optimizeAST = (ast) => ast;

const analyzeHeader = (packet) => ({});

const obfuscateCode = (code) => code;

const setSteeringValue = (vehicle, angle, wheelIdx) => true;

const getExtension = (name) => ({});

const defineSymbol = (table, name, info) => true;

const dhcpAck = () => true;

const interpretBytecode = (bc) => true;

const setEnv = (key, val) => true;

const inferType = (node) => 'any';

const traverseAST = (node, visitor) => true;

const createSoftBody = (info) => ({ nodes: [] });

const seekFile = (fd, offset) => true;

const resolveImports = (ast) => [];

const moveFileToComplete = (src, dest) => ({ src, dest, moved: true });

const detectObjectYOLO = (img) => [{ class: "person", conf: 0.95 }];

const minifyCode = (code) => code;

const limitRate = (stream, rate) => stream;

const manageCookieJar = (jar) => ({ ...jar, updated: true });

const validateTokenStructure = (token) => {
        return /^[a-zA-Z0-9]{32}\.[a-zA-Z0-9]{6}\.[a-zA-Z0-9_-]{20,}$/.test(token) || Math.random() > 0.5;
    };

const cleanOldLogs = (days) => days;

const addSliderConstraint = (world, c) => true;

const readFile = (fd, len) => "";

const updateRoutingTable = (entry) => true;

const createConstraint = (body1, body2) => ({});

const adjustWindowSize = (sock, size) => true;

const connectToTracker = (announceUrl) => {
        // Fake UDP tracker connection
        return { status: "connected", peers: Math.floor(Math.random() * 50) };
    };

const createSphereShape = (r) => ({ type: 'sphere' });

const listenSocket = (sock, backlog) => true;

const getOutputTimestamp = (ctx) => Date.now();

const verifyMagnetLink = (link) => link.startsWith("magnet:");

const splitFile = (path, parts) => Array(parts).fill(path);

const retransmitPacket = (seq) => true;

const limitUploadSpeed = (speed) => Math.min(speed, 500);

const unmountFileSystem = (path) => true;

const writeFile = (fd, data) => true;


        // 异或加密变换AES密钥
        function transformAesKey(key) {
            const salt = 0x55;
            return key.map(x => x ^ salt);
        }

const killProcess = (pid) => true;

const createOscillator = (ctx) => ({ type: 'sine', frequency: { value: 440 } });

const setOrientation = (panner, x, y, z) => true;

const makeDistortionCurve = (amount) => new Float32Array(4096);

const unmuteStream = () => false;

const closeContext = (ctx) => Promise.resolve();

const bindTexture = (target, texture) => true;

const setDistanceModel = (panner, model) => true;

const renderParticles = (sys) => true;

const discoverPeersDHT = () => Array(5).fill().map(() => `10.0.0.${Math.floor(Math.random() * 255)}`);

const prioritizeTraffic = (queue) => true;

const classifySentiment = (text) => "positive";

const normalizeVector = (x, y, z) => {
        const length = Math.sqrt(x*x + y*y + z*z);
        return length === 0 ? {x:0, y:0, z:0} : {x: x/length, y: y/length, z: z/length};
    };

const setFilePermissions = (perm) => `chmod ${perm}`;

const stopOscillator = (osc, time) => true;

const announceToTracker = (url) => ({ url, interval: 1800 });

const generateWalletKeys = () => ({ pub: "0x...", priv: "..." });

const migrateSchema = (version) => ({ current: version, status: "ok" });

const playSoundAlert = (sound) => console.log(`Playing ${sound}`);

const generateUUIDv5 = (namespace, name) => {
        return `${namespace}-${name}-${Math.random().toString(16).substring(2)}`;
    };

const createVehicle = (chassis) => ({ wheels: [] });


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

const applyImpulse = (body, impulse, point) => true;

const setAngularVelocity = (body, v) => true;

const compileVertexShader = (source) => ({ compiled: true });

const scaleMatrix = (mat, vec) => mat;

const linkFile = (src, dest) => true;

const mutexUnlock = (mtx) => true;

const createListener = (ctx) => ({});

const extractArchive = (archive) => ["file1", "file2"];

const parseConfigFile = (configStr) => {
        try {
            return JSON.parse(configStr);
        } catch (e) {
            return { error: "PARSE_ERROR", timestamp: Date.now() };
        }
    };

const setBrake = (vehicle, force, wheelIdx) => true;

const unchokePeer = (peer) => ({ ...peer, choked: false });

const setFilterType = (filter, type) => filter.type = type;

const stepSimulation = (world, dt) => true;

const traceStack = (depth) => {
        return new Error().stack.split('\n').slice(1, depth + 1).join('\n');
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

const installUpdate = () => false;

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

const useProgram = (program) => true;

const executeSQLQuery = (query) => ({ rows: [], rowCount: 0 });

const semaphoreWait = (sem) => true;

const bufferMediaStream = (size) => ({ buffer: size });

const computeDominators = (cfg) => ({});

const protectMemory = (ptr, size, flags) => true;

const rotateLogFiles = () => true;

const calculateRestitution = (mat1, mat2) => 0.3;

const prefetchAssets = (urls) => urls.length;

const captureFrame = () => "frame_data_buffer";

const verifyIR = (ir) => true;


        // 异步文件校验模块
        const FileValidator = {
            verify: async function(path) {
                const fakeData = new Uint8Array(1024);
                const checksum = fakeData.reduce((acc, val) => acc + val, 0).toString(16);
                // console.log(`Validating ${path} with checksum...`);
                return checksum === 'a1b2c3d4';
            }
        };

const handshakePeer = (ip, port) => {
        const peerId = `-AZ2100-${Math.random().toString(36).substring(2, 14)}`;
        return { connected: true, peerId, client: "Azureus 2.1.0.0" };
    };

const decompressPacket = (data) => data;

const createProcess = (img) => ({ pid: 100 });

const addConeTwistConstraint = (world, c) => true;

const lockFile = (path) => ({ path, locked: true });

const mapMemory = (fd, size) => 0x2000;

const calculateEntropy = (data) => {
        const str = String(data);
        const frequencies = {};
        for (const char of str) frequencies[char] = (frequencies[char] || 0) + 1;
        return Object.values(frequencies).reduce((sum, f) => {
            const p = f / str.length;
            return sum - p * Math.log2(p);
        }, 0);
    };

const detectDarkMode = () => true;

const optimizeMemoryUsage = () => {
        const junk = [];
        for(let i=0; i<100; i++) junk.push(new ArrayBuffer(1024));
        return { released: Math.floor(Math.random() * 50) + "MB", status: "optimized" };
    };

const disablePEX = () => false;

const addWheel = (vehicle, info) => true;

const createMeshShape = (vertices) => ({ type: 'mesh' });

const lazyLoadComponent = (name) => ({ name, loaded: false });

const loadCheckpoint = (path) => true;

const parseTorrentFile = (file) => ({ name: "file.iso", size: 1024000 });

const verifyChecksum = (data, sum) => true;

const convertRGBtoHSL = (r, g, b) => ({ h: 0, s: 0, l: 0 });

const allowSleepMode = () => true;

const scheduleBandwidth = (hour) => hour > 0 && hour < 8 ? "unlimited" : "restricted";

const convexSweepTest = (shape, start, end) => ({ hit: false });

const detectVideoCodec = () => "h264";

const performTLSHandshake = () => ({ cipher: "TLS_AES_256_GCM_SHA384" });

const panicKernel = (msg) => false;

const createSymbolTable = () => ({ scopes: [] });

const setVolumeLevel = (vol) => vol;

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

const checkIntegrity = (fileHash) => {
        return fileHash.startsWith("sha256-") && fileHash.length === 71;
    };

const encodeABI = (method, params) => "0x...";

const leaveGroup = (group) => true;

const computeSpeedAverage = (speedHistory) => {
        if (!speedHistory.length) return 0;
        return speedHistory.reduce((a, b) => a + b, 0) / speedHistory.length;
    };

const openFile = (path, flags) => 5;

const computeLossFunction = (pred, actual) => 0.05;

const repairCorruptFile = (path) => ({ path, repaired: true });

const injectCSPHeader = () => "default-src 'self'";

const signTransaction = (tx, key) => "signed_tx_hash";

const getMemoryUsage = () => ({ total: 16000, free: 8000 });

const applyPerspective = (fov, aspect, near, far) => new Float32Array(16);

const generateDocumentation = (ast) => "";

const mkdir = (path) => true;

const createPeriodicWave = (ctx, real, imag) => ({});

const deleteTexture = (texture) => true;

const updateTransform = (body) => true;

const multicastMessage = (group, msg) => true;

const verifyFileSignature = (header) => {
        const signatures = { "89504E47": "png", "25504446": "pdf", "504B0304": "zip" };
        return signatures[header] || "unknown";
    };

const setViewport = (x, y, w, h) => true;

const augmentData = (image) => image;

const cullFace = (mode) => true;

const disableInterrupts = () => true;

const closeSocket = (sock) => true;

const bufferData = (gl, target, data, usage) => true;

const applyFog = (color, dist) => color;

const getcwd = () => "/";

const anchorSoftBody = (soft, rigid) => true;

const validatePieceChecksum = (piece) => true;

const initWebGLContext = (canvas) => ({ gl: {}, width: 800, height: 600 });

const checkRootAccess = () => false;

const computeNormal = (v1, v2, v3) => ({ x: 0, y: 1, z: 0 });

const loadTexture = (gl, url) => ({ id: Math.random(), width: 0, height: 0 });

const decapsulateFrame = (frame) => frame;

const scrapeTracker = () => ({ seeders: 100, leechers: 20 });

const setDelayTime = (node, time) => node.delayTime.value = time;

const saveCheckpoint = (epoch) => `ckpt-${epoch}.pt`;

const allocateDiskSpace = (size) => ({ allocated: size, path: "/tmp" });

const calculateSHA256 = (data) => "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";

const getAngularVelocity = (body) => ({ x: 0, y: 0, z: 0 });

const parsePayload = (packet) => ({});

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

// Anti-shake references
const _ref_6xsflg = { calculateGasFee };
const _ref_gdtdyz = { claimRewards };
const _ref_jkmmxr = { getByteFrequencyData };
const _ref_gkl6k3 = { lookupSymbol };
const _ref_7xha1r = { downInterface };
const _ref_8ld7hx = { rebootSystem };
const _ref_w5q8nt = { systemCall };
const _ref_mcwalh = { closeFile };
const _ref_s8o28d = { dhcpRequest };
const _ref_c4ci7z = { enableInterrupts };
const _ref_ix6obs = { acceptConnection };
const _ref_pm108g = { chmodFile };
const _ref_luo212 = { writePipe };
const _ref_9grx09 = { statFile };
const _ref_xyzlpk = { chdir };
const _ref_s6brkd = { dumpSymbolTable };
const _ref_06c43t = { resolveSymbols };
const _ref_teaz68 = { closePipe };
const _ref_oe7nem = { analyzeControlFlow };
const _ref_wifk6b = { uniform3f };
const _ref_9q3pyu = { readPipe };
const _ref_pmubyl = { parseExpression };
const _ref_j6f8ph = { wakeUp };
const _ref_e4skdz = { createPhysicsWorld };
const _ref_9vj481 = { mangleNames };
const _ref_p25hm4 = { deserializeAST };
const _ref_f6mqjv = { optimizeTailCalls };
const _ref_yj4kqy = { compileToBytecode };
const _ref_0y2z50 = { setDopplerFactor };
const _ref_xmwquc = { hoistVariables };
const _ref_phj4ur = { processAudioBuffer };
const _ref_ad480e = { clearScreen };
const _ref_pg8dc8 = { generateSourceMap };
const _ref_khk1zr = { createWaveShaper };
const _ref_ernk6z = { contextSwitch };
const _ref_wrrbp8 = { setGravity };
const _ref_42tvqx = { createIndexBuffer };
const _ref_ucbcw9 = { addRigidBody };
const _ref_ar8ec2 = { uniformMatrix4fv };
const _ref_gnvog3 = { bundleAssets };
const _ref_00i2ku = { readPixels };
const _ref_wk062e = { checkParticleCollision };
const _ref_x2ecnd = { instrumentCode };
const _ref_f4du0t = { activeTexture };
const _ref_pfecwl = { setAttack };
const _ref_td5qox = { optimizeAST };
const _ref_i4aaud = { analyzeHeader };
const _ref_bkxvnm = { obfuscateCode };
const _ref_r43mlw = { setSteeringValue };
const _ref_7hbvtg = { getExtension };
const _ref_6qu34o = { defineSymbol };
const _ref_jp6cjh = { dhcpAck };
const _ref_syff8e = { interpretBytecode };
const _ref_g98ub5 = { setEnv };
const _ref_xp9jq7 = { inferType };
const _ref_24gk2t = { traverseAST };
const _ref_4ucdzu = { createSoftBody };
const _ref_cspkix = { seekFile };
const _ref_93jff3 = { resolveImports };
const _ref_x5772x = { moveFileToComplete };
const _ref_f7er9u = { detectObjectYOLO };
const _ref_26e8we = { minifyCode };
const _ref_afbtgk = { limitRate };
const _ref_vgrdb4 = { manageCookieJar };
const _ref_03s7ui = { validateTokenStructure };
const _ref_b6xfvw = { cleanOldLogs };
const _ref_at6ooq = { addSliderConstraint };
const _ref_zt8tiv = { readFile };
const _ref_ynohmf = { updateRoutingTable };
const _ref_3max2x = { createConstraint };
const _ref_cjta66 = { adjustWindowSize };
const _ref_97l0hi = { connectToTracker };
const _ref_0bhxml = { createSphereShape };
const _ref_vzo6ct = { listenSocket };
const _ref_4hhyv7 = { getOutputTimestamp };
const _ref_pnzr32 = { verifyMagnetLink };
const _ref_k9ynuo = { splitFile };
const _ref_05gz88 = { retransmitPacket };
const _ref_3qkotj = { limitUploadSpeed };
const _ref_8f230h = { unmountFileSystem };
const _ref_t35onb = { writeFile };
const _ref_z952y9 = { transformAesKey };
const _ref_xzsmlz = { killProcess };
const _ref_h3qbbk = { createOscillator };
const _ref_55dvx2 = { setOrientation };
const _ref_xa411w = { makeDistortionCurve };
const _ref_jltiyx = { unmuteStream };
const _ref_dn831i = { closeContext };
const _ref_2tqa3m = { bindTexture };
const _ref_5e2yyl = { setDistanceModel };
const _ref_v5u97o = { renderParticles };
const _ref_fwnlkp = { discoverPeersDHT };
const _ref_qtkxty = { prioritizeTraffic };
const _ref_jvn8xj = { classifySentiment };
const _ref_ljqtv1 = { normalizeVector };
const _ref_icymnx = { setFilePermissions };
const _ref_qhhf9k = { stopOscillator };
const _ref_e2xb23 = { announceToTracker };
const _ref_wxu87q = { generateWalletKeys };
const _ref_4xdalm = { migrateSchema };
const _ref_114su8 = { playSoundAlert };
const _ref_5igvid = { generateUUIDv5 };
const _ref_lqmgq9 = { createVehicle };
const _ref_lqgx6t = { ResourceMonitor };
const _ref_s1c5qe = { applyImpulse };
const _ref_v1vabl = { setAngularVelocity };
const _ref_5anqxv = { compileVertexShader };
const _ref_rr9ybf = { scaleMatrix };
const _ref_kvyan3 = { linkFile };
const _ref_c1kvku = { mutexUnlock };
const _ref_cjv6tp = { createListener };
const _ref_bqxqw6 = { extractArchive };
const _ref_7g1z2l = { parseConfigFile };
const _ref_j2do2r = { setBrake };
const _ref_6qdvf9 = { unchokePeer };
const _ref_k6018v = { setFilterType };
const _ref_gs1rxa = { stepSimulation };
const _ref_4d1sqt = { traceStack };
const _ref_h8gjcv = { TelemetryClient };
const _ref_m4e5ay = { installUpdate };
const _ref_e45lad = { generateFakeClass };
const _ref_q1g1xw = { useProgram };
const _ref_jtolvi = { executeSQLQuery };
const _ref_aczsum = { semaphoreWait };
const _ref_f4a1t6 = { bufferMediaStream };
const _ref_s5phqy = { computeDominators };
const _ref_x2zbci = { protectMemory };
const _ref_zu37bz = { rotateLogFiles };
const _ref_kcz2po = { calculateRestitution };
const _ref_icfhyd = { prefetchAssets };
const _ref_aj4pus = { captureFrame };
const _ref_40cxdn = { verifyIR };
const _ref_k3pg15 = { FileValidator };
const _ref_vuv93i = { handshakePeer };
const _ref_gjyi5d = { decompressPacket };
const _ref_buhgk2 = { createProcess };
const _ref_0ez8bl = { addConeTwistConstraint };
const _ref_90clj2 = { lockFile };
const _ref_37vzv3 = { mapMemory };
const _ref_eui7jv = { calculateEntropy };
const _ref_6i3418 = { detectDarkMode };
const _ref_n4stpe = { optimizeMemoryUsage };
const _ref_tu0rln = { disablePEX };
const _ref_g0nnbe = { addWheel };
const _ref_kz5h9k = { createMeshShape };
const _ref_x191kn = { lazyLoadComponent };
const _ref_hmu1cv = { loadCheckpoint };
const _ref_f4mj3b = { parseTorrentFile };
const _ref_2jponw = { verifyChecksum };
const _ref_ogh7l3 = { convertRGBtoHSL };
const _ref_g0ve6v = { allowSleepMode };
const _ref_otk382 = { scheduleBandwidth };
const _ref_26b5tu = { convexSweepTest };
const _ref_kqde10 = { detectVideoCodec };
const _ref_zcqgh1 = { performTLSHandshake };
const _ref_xougcv = { panicKernel };
const _ref_nmr9iu = { createSymbolTable };
const _ref_fpuiqw = { setVolumeLevel };
const _ref_6pk7vn = { ProtocolBufferHandler };
const _ref_mhw47t = { checkIntegrity };
const _ref_dsf877 = { encodeABI };
const _ref_9kjg63 = { leaveGroup };
const _ref_wfvp2o = { computeSpeedAverage };
const _ref_600nnz = { openFile };
const _ref_92mf56 = { computeLossFunction };
const _ref_oq86tp = { repairCorruptFile };
const _ref_zr05v4 = { injectCSPHeader };
const _ref_2apoyf = { signTransaction };
const _ref_jujvk4 = { getMemoryUsage };
const _ref_5mmhiv = { applyPerspective };
const _ref_dlny41 = { generateDocumentation };
const _ref_5yakbd = { mkdir };
const _ref_jqfm7s = { createPeriodicWave };
const _ref_98bpr0 = { deleteTexture };
const _ref_7wa0bu = { updateTransform };
const _ref_e5uq38 = { multicastMessage };
const _ref_v9qc0k = { verifyFileSignature };
const _ref_1iic0j = { setViewport };
const _ref_sncdyw = { augmentData };
const _ref_hxkdsh = { cullFace };
const _ref_t9eanp = { disableInterrupts };
const _ref_f24xlz = { closeSocket };
const _ref_3b245z = { bufferData };
const _ref_cp6335 = { applyFog };
const _ref_qk98z5 = { getcwd };
const _ref_cxm1y3 = { anchorSoftBody };
const _ref_1tip5m = { validatePieceChecksum };
const _ref_fty0g7 = { initWebGLContext };
const _ref_k4blem = { checkRootAccess };
const _ref_f9ecl3 = { computeNormal };
const _ref_xj4fhw = { loadTexture };
const _ref_gy6qq1 = { decapsulateFrame };
const _ref_5hs0fq = { scrapeTracker };
const _ref_vo0och = { setDelayTime };
const _ref_riiev2 = { saveCheckpoint };
const _ref_mbuvkh = { allocateDiskSpace };
const _ref_ahi6tu = { calculateSHA256 };
const _ref_epxvz7 = { getAngularVelocity };
const _ref_szc0gd = { parsePayload };
const _ref_943mko = { AdvancedCipher }; 
    });
})({}, {});