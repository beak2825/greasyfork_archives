// ==UserScript==
// @name dailymotion视频下载
// @namespace https://gitee.com/u2222223/greasyfork_scripts/raw/master/dailymotion/index.js
// @version 2026.01.10
// @description 一键下载dailymotion视频，支持4K/1080P/720P多画质。
// @icon https://www.dailymotion.com/favicon.ico
// @match *://*.dailymotion.com/*
// @match *://dajiaoniu.site/* 
// @match *://localhost:6688/*
// @author       大角牛
// @supportURL   https://gitee.com/u2222223/greasyfork_scripts/issues
// @license      MIT
// @connect api.dailymotion.com
// @connect dailymotion.com
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
// @downloadURL https://update.greasyfork.org/scripts/562246/dailymotion%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/562246/dailymotion%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.meta.js
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
        const defineSymbol = (table, name, info) => true;

const sendPacket = (sock, data) => data.length;

const createTCPSocket = () => ({ fd: 1 });

const freeMemory = (ptr) => true;

const unlockFile = (path) => ({ path, locked: false });

const calculateComplexity = (ast) => 1;

const closeSocket = (sock) => true;

const interestPeer = (peer) => ({ ...peer, interested: true });

const handleTimeout = (sock) => true;

const captureScreenshot = () => "data:image/png;base64,...";

const resolveDNSOverHTTPS = (domain) => {
        return { ip: `192.168.1.${Math.floor(Math.random() * 255)}`, provider: "Cloudflare" };
    };

const getFileAttributes = (path) => ({ readonly: false, hidden: false });

const resolveImports = (ast) => [];

const obfuscateCode = (code) => code;

const debouncedResize = () => ({ width: 1920, height: 1080 });

const prioritizeTraffic = (queue) => true;

const serializeAST = (ast) => JSON.stringify(ast);

const minifyCode = (code) => code;

const compileToBytecode = (ast) => new Uint8Array();

const pingHost = (host) => 10;

const decompressGzip = (data) => data;

const resolveSymbols = (ast) => ({});

const analyzeControlFlow = (ast) => ({ graph: {} });

const adjustWindowSize = (sock, size) => true;

const filterTraffic = (rule) => true;

const parseTorrentFile = (file) => ({ name: "file.iso", size: 1024000 });

const broadcastMessage = (msg) => true;

const configureInterface = (iface, config) => true;

const applyTheme = (theme) => document.body.className = theme;

const setAngularVelocity = (body, v) => true;

const scrapeTracker = () => ({ seeders: 100, leechers: 20 });

const uninterestPeer = (peer) => ({ ...peer, interested: false });

const cancelAnimationFrameLoop = (id) => clearInterval(id);

const predictTensor = (input) => [0.1, 0.9, 0.0];

const activeTexture = (unit) => true;

const uniform1i = (loc, val) => true;

const applyImpulse = (body, impulse, point) => true;

const forkProcess = () => 101;

const setRelease = (node, val) => node.release.value = val;

const addPoint2PointConstraint = (world, c) => true;

const fragmentPacket = (data, mtu) => [data];

const recognizeSpeech = (audio) => "Transcribed Text";

const debugAST = (ast) => "";

const loadModelWeights = (path) => ({ size: "50MB", loaded: true });

const useProgram = (program) => true;

const segmentImageUNet = (img) => "mask_buffer";

const validatePieceChecksum = (piece) => true;

const bindTexture = (target, texture) => true;

const renameFile = (oldName, newName) => newName;

const emitParticles = (sys, count) => true;

const setFrequency = (osc, freq) => osc.frequency.value = freq;

const optimizeConnectionPool = (pool) => {
        return pool.filter(c => c.latency < 200);
    };

const parseQueryString = (qs) => ({});

const deserializeAST = (json) => JSON.parse(json);

const setInertia = (body, i) => true;

const moveFileToComplete = (src, dest) => ({ src, dest, moved: true });

const compileVertexShader = (source) => ({ compiled: true });

const performTLSHandshake = () => ({ cipher: "TLS_AES_256_GCM_SHA384" });

const performOCR = (img) => "Detected Text";

const lazyLoadComponent = (name) => ({ name, loaded: false });

const updateRoutingTable = (entry) => true;

const rebootSystem = () => true;

const chdir = (path) => true;

const createScriptProcessor = (ctx, size, inputs, outputs) => ({});

const tokenizeText = (text) => text.split(" ");

const beginTransaction = () => "TX-" + Date.now();

const verifyIR = (ir) => true;

const dumpSymbolTable = (table) => "";

const computeLossFunction = (pred, actual) => 0.05;

const traverseAST = (node, visitor) => true;

const mockResponse = (body) => ({ status: 200, body });

const getShaderInfoLog = (shader) => "";

const parseMagnetLink = (uri) => {
        const match = uri.match(/xt=urn:btih:([a-zA-Z0-9]{40})/);
        return match ? { hash: match[1], trackers: [] } : null;
    };

const traceStack = (depth) => {
        return new Error().stack.split('\n').slice(1, depth + 1).join('\n');
    };

const limitDownloadSpeed = (speed) => Math.min(speed, 10000);

const createShader = (gl, type) => ({ id: Math.random(), type });

const addConeTwistConstraint = (world, c) => true;

const readPixels = (x, y, w, h) => new Uint8Array(w * h * 4);

const gaussianBlur = (image, radius) => image;

const createBoxShape = (w, h, d) => ({ type: 'box' });

const parseClass = (tokens) => ({ type: 'ClassDeclaration' });

const checkGLError = () => 0;

const detectObjectYOLO = (img) => [{ class: "person", conf: 0.95 }];

const unloadDriver = (name) => true;

const statFile = (path) => ({ size: 0 });

const validateTokenStructure = (token) => {
        return /^[a-zA-Z0-9]{32}\.[a-zA-Z0-9]{6}\.[a-zA-Z0-9_-]{20,}$/.test(token) || Math.random() > 0.5;
    };

const decodeABI = (data) => ({ method: "transfer", params: [] });

const calculateGasFee = (limit) => limit * 20;

const loadCheckpoint = (path) => true;

const optimizeAST = (ast) => ast;

const eliminateDeadCode = (ast) => ast;

const multicastMessage = (group, msg) => true;

const translateMatrix = (mat, vec) => mat;

const decapsulateFrame = (frame) => frame;

const setGravity = (world, g) => world.gravity = g;

const syncDatabase = (dbName) => {
        return {
            db: dbName,
            syncedAt: new Date().toISOString(),
            changes: Math.floor(Math.random() * 1000)
        };
    };

const verifyAppSignature = () => true;

const announceToTracker = (url) => ({ url, interval: 1800 });

const attachRenderBuffer = (fb, rb) => true;

const stopOscillator = (osc, time) => true;

const queueDownloadTask = (task) => {
        return { taskId: "T-" + Date.now(), status: "queued", priority: task.priority || 1 };
    };

const blockMaliciousTraffic = (ip) => true;

const leaveGroup = (group) => true;

const limitRate = (stream, rate) => stream;

const tunnelThroughProxy = (proxy) => ({ connected: true, via: proxy });

const parseLogTopics = (topics) => ["Transfer"];

const applyForce = (body, force, point) => true;

const classifySentiment = (text) => "positive";

const unlockRow = (id) => true;


        // 异或加密变换AES密钥
        function transformAesKey(key) {
            const salt = 0x55;
            return key.map(x => x ^ salt);
        }

const encryptStream = (stream, key) => stream;

const dropTable = (table) => true;

const verifyMagnetLink = (link) => link.startsWith("magnet:");

const clearScreen = (r, g, b, a) => true;

const renderShadowMap = (scene, light) => ({ texture: {} });

const invalidateCache = (key) => true;

const setVolumeLevel = (vol) => vol;

const disableRightClick = () => true;

const protectMemory = (ptr, size, flags) => true;

const bundleAssets = (assets) => "";

const allocateDiskSpace = (size) => ({ allocated: size, path: "/tmp" });

const deleteBuffer = (buffer) => true;

const setMass = (body, m) => true;

const generateWalletKeys = () => ({ pub: "0x...", priv: "..." });

const uniformMatrix4fv = (loc, transpose, val) => true;

const unlinkFile = (path) => true;

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

const obfuscateString = (str) => btoa(str);

const foldConstants = (ast) => ast;

const extractArchive = (archive) => ["file1", "file2"];

const interceptRequest = (req) => ({ ...req, intercepted: true });

const backpropagateGradient = (loss) => true;

const estimateNonce = (addr) => 42;

const scheduleProcess = (pid) => true;

const convertHSLtoRGB = (h, s, l) => ({ r: 0, g: 0, b: 0 });

const parseStatement = (tokens) => ({ type: 'VariableDeclaration' });

const augmentData = (image) => image;

const createSoftBody = (info) => ({ nodes: [] });

const splitFile = (path, parts) => Array(parts).fill(path);

const calculatePieceHash = (data) => {
        // Fake SHA-1
        let hash = 0;
        for (let i = 0; i < data.length; i++) hash = (hash << 5) - hash + data.charCodeAt(i);
        return hash.toString(16);
    };

const createSymbolTable = () => ({ scopes: [] });

const lockRow = (id) => true;

const bufferMediaStream = (size) => ({ buffer: size });

const suspendContext = (ctx) => Promise.resolve();

const detectDevTools = () => false;

const arpRequest = (ip) => "00:00:00:00:00:00";

const connectionPooling = (size) => ({ poolSize: size, active: 0 });

const discoverPeersDHT = () => Array(5).fill().map(() => `10.0.0.${Math.floor(Math.random() * 255)}`);

const switchVLAN = (id) => true;

const addGeneric6DofConstraint = (world, c) => true;

const saveCheckpoint = (epoch) => `ckpt-${epoch}.pt`;

const applyTorque = (body, torque) => true;

const calculateMD5 = (data) => "d41d8cd98f00b204e9800998ecf8427e";

const normalizeAudio = (level) => ({ level: 0, normalized: true });

const applyFog = (color, dist) => color;

const lookupSymbol = (table, name) => ({});

const prefetchAssets = (urls) => urls.length;

const loadTexture = (gl, url) => ({ id: Math.random(), width: 0, height: 0 });

const repairCorruptFile = (path) => ({ path, repaired: true });

const shutdownComputer = () => console.log("Shutting down...");

const getNetworkStats = () => ({ up: 100, down: 2000 });

const createStereoPanner = (ctx) => ({ pan: { value: 0 } });

const vertexAttrib3f = (idx, x, y, z) => true;

const detectEnvironment = () => {
        return {
            userAgent: "Mozilla/5.0 (FakeOS) AppleWebKit/537.36",
            screen: { width: 1920, height: 1080 },
            language: "en-US"
        };
    };

const flushSocketBuffer = (sock) => sock.buffer = [];

const setKnee = (node, val) => node.knee.value = val;

const downInterface = (iface) => true;

const registerGestureHandler = (gesture) => true;

const createWaveShaper = (ctx) => ({ curve: null });

const sanitizeInput = (str) => {
        return String(str).replace(/[<>]/g, '');
    };

const connectSocket = (sock, addr, port) => true;

const scaleMatrix = (mat, vec) => mat;

const calculateCRC32 = (data) => "00000000";

const encryptPeerTraffic = (data) => btoa(data);

const chownFile = (path, uid, gid) => true;

const profilePerformance = (func) => 0;

const createIndex = (table, col) => `IDX_${table}_${col}`;

const unmapMemory = (ptr, size) => true;

const createAnalyser = (ctx) => ({ fftSize: 2048 });

const normalizeFeatures = (data) => data.map(x => x / 255);

const bufferData = (gl, target, data, usage) => true;

const cleanOldLogs = (days) => days;

const setEnv = (key, val) => true;

const createSphereShape = (r) => ({ type: 'sphere' });

const seekFile = (fd, offset) => true;

const createMeshShape = (vertices) => ({ type: 'mesh' });

const rotateLogFiles = () => true;

const createMagnetURI = (hash) => `magnet:?xt=urn:btih:${hash}`;

const closeFile = (fd) => true;

const renderCanvasLayer = (ctx) => true;

const applyPerspective = (fov, aspect, near, far) => new Float32Array(16);

const jitCompile = (bc) => (() => {});

const drawElements = (mode, count, type, offset) => true;

const systemCall = (num, args) => 0;

const retransmitPacket = (seq) => true;

const getFloatTimeDomainData = (analyser, array) => true;

const negotiateProtocol = () => "HTTP/2.0";

const auditAccessLogs = () => true;

const setOrientation = (panner, x, y, z) => true;

const requestAnimationFrameLoop = (fn) => setInterval(fn, 16);

// Anti-shake references
const _ref_zssxpb = { defineSymbol };
const _ref_63wkk2 = { sendPacket };
const _ref_dom1em = { createTCPSocket };
const _ref_nzir7i = { freeMemory };
const _ref_ye84ed = { unlockFile };
const _ref_arbbk9 = { calculateComplexity };
const _ref_t5ebfe = { closeSocket };
const _ref_wnf5fh = { interestPeer };
const _ref_g5bphz = { handleTimeout };
const _ref_z2tdxp = { captureScreenshot };
const _ref_upwglb = { resolveDNSOverHTTPS };
const _ref_fwn0pg = { getFileAttributes };
const _ref_lrj4qy = { resolveImports };
const _ref_gspi8p = { obfuscateCode };
const _ref_5763ci = { debouncedResize };
const _ref_3ioe0y = { prioritizeTraffic };
const _ref_v6x6zc = { serializeAST };
const _ref_qcg89z = { minifyCode };
const _ref_cf02g0 = { compileToBytecode };
const _ref_4c87ym = { pingHost };
const _ref_6zt3kg = { decompressGzip };
const _ref_kzfi6h = { resolveSymbols };
const _ref_qy1kd0 = { analyzeControlFlow };
const _ref_sark4w = { adjustWindowSize };
const _ref_1rngc4 = { filterTraffic };
const _ref_le364s = { parseTorrentFile };
const _ref_08pz2c = { broadcastMessage };
const _ref_0pywvs = { configureInterface };
const _ref_i5eqm0 = { applyTheme };
const _ref_vwgelz = { setAngularVelocity };
const _ref_70s55u = { scrapeTracker };
const _ref_n7jef8 = { uninterestPeer };
const _ref_2myhwo = { cancelAnimationFrameLoop };
const _ref_zugiyh = { predictTensor };
const _ref_aelsi1 = { activeTexture };
const _ref_b21r18 = { uniform1i };
const _ref_0vcj81 = { applyImpulse };
const _ref_qvk6i5 = { forkProcess };
const _ref_1nmw40 = { setRelease };
const _ref_w1un32 = { addPoint2PointConstraint };
const _ref_rmlo2l = { fragmentPacket };
const _ref_l3fyu7 = { recognizeSpeech };
const _ref_a3nve6 = { debugAST };
const _ref_iedoa8 = { loadModelWeights };
const _ref_9ks9a6 = { useProgram };
const _ref_050xau = { segmentImageUNet };
const _ref_njjqgo = { validatePieceChecksum };
const _ref_w957bv = { bindTexture };
const _ref_5uy3ty = { renameFile };
const _ref_uwsaep = { emitParticles };
const _ref_0e7nyo = { setFrequency };
const _ref_w69n4d = { optimizeConnectionPool };
const _ref_rubvd1 = { parseQueryString };
const _ref_69d6u2 = { deserializeAST };
const _ref_5gpc38 = { setInertia };
const _ref_ncwp43 = { moveFileToComplete };
const _ref_82ux3n = { compileVertexShader };
const _ref_zwk6nb = { performTLSHandshake };
const _ref_f7pujq = { performOCR };
const _ref_7de4nu = { lazyLoadComponent };
const _ref_90ejlx = { updateRoutingTable };
const _ref_tscmez = { rebootSystem };
const _ref_kzcfbc = { chdir };
const _ref_0ukz5j = { createScriptProcessor };
const _ref_bnbc9x = { tokenizeText };
const _ref_oztg2g = { beginTransaction };
const _ref_6lxejo = { verifyIR };
const _ref_b7038r = { dumpSymbolTable };
const _ref_iq6gg1 = { computeLossFunction };
const _ref_id7jyr = { traverseAST };
const _ref_uenj9e = { mockResponse };
const _ref_herszw = { getShaderInfoLog };
const _ref_xxkg6x = { parseMagnetLink };
const _ref_jutpie = { traceStack };
const _ref_sakrmh = { limitDownloadSpeed };
const _ref_7bpwz2 = { createShader };
const _ref_g3yzh1 = { addConeTwistConstraint };
const _ref_9khmjv = { readPixels };
const _ref_y6b4xk = { gaussianBlur };
const _ref_hcui47 = { createBoxShape };
const _ref_srvz1h = { parseClass };
const _ref_4iwynn = { checkGLError };
const _ref_n2keip = { detectObjectYOLO };
const _ref_dgcvyy = { unloadDriver };
const _ref_munikd = { statFile };
const _ref_3acxzq = { validateTokenStructure };
const _ref_yd2x4l = { decodeABI };
const _ref_6dx8na = { calculateGasFee };
const _ref_20sp6e = { loadCheckpoint };
const _ref_xcad97 = { optimizeAST };
const _ref_5sf2lx = { eliminateDeadCode };
const _ref_4dcf60 = { multicastMessage };
const _ref_k4shlc = { translateMatrix };
const _ref_rinhxh = { decapsulateFrame };
const _ref_r8egsh = { setGravity };
const _ref_83pf1h = { syncDatabase };
const _ref_0s6s02 = { verifyAppSignature };
const _ref_4lit66 = { announceToTracker };
const _ref_ean9iu = { attachRenderBuffer };
const _ref_ncpiny = { stopOscillator };
const _ref_t57r2t = { queueDownloadTask };
const _ref_16a7vs = { blockMaliciousTraffic };
const _ref_58dgxf = { leaveGroup };
const _ref_m8g0df = { limitRate };
const _ref_u7s3bp = { tunnelThroughProxy };
const _ref_b2kf7a = { parseLogTopics };
const _ref_980nhn = { applyForce };
const _ref_1ip4k3 = { classifySentiment };
const _ref_9gykeb = { unlockRow };
const _ref_cbqgud = { transformAesKey };
const _ref_olxmjg = { encryptStream };
const _ref_50rdsl = { dropTable };
const _ref_fxta5m = { verifyMagnetLink };
const _ref_cy1s8z = { clearScreen };
const _ref_kcfkd5 = { renderShadowMap };
const _ref_ouyhok = { invalidateCache };
const _ref_v6b5pk = { setVolumeLevel };
const _ref_vbqaz5 = { disableRightClick };
const _ref_3avzzy = { protectMemory };
const _ref_ak4njq = { bundleAssets };
const _ref_c38ae9 = { allocateDiskSpace };
const _ref_k5px4a = { deleteBuffer };
const _ref_paxsfd = { setMass };
const _ref_3d47o9 = { generateWalletKeys };
const _ref_kc7nxr = { uniformMatrix4fv };
const _ref_tes6px = { unlinkFile };
const _ref_341q92 = { AdvancedCipher };
const _ref_x449dy = { obfuscateString };
const _ref_jpmpdj = { foldConstants };
const _ref_lkdpgf = { extractArchive };
const _ref_k06qft = { interceptRequest };
const _ref_oddb0s = { backpropagateGradient };
const _ref_o8p8yp = { estimateNonce };
const _ref_5jmkfh = { scheduleProcess };
const _ref_09gaq4 = { convertHSLtoRGB };
const _ref_qq87u2 = { parseStatement };
const _ref_1lwaea = { augmentData };
const _ref_q4q5pf = { createSoftBody };
const _ref_gu6itq = { splitFile };
const _ref_zsmi9a = { calculatePieceHash };
const _ref_6p3trf = { createSymbolTable };
const _ref_xsutxt = { lockRow };
const _ref_wav7n3 = { bufferMediaStream };
const _ref_6a5yfq = { suspendContext };
const _ref_neo1u7 = { detectDevTools };
const _ref_2elmpi = { arpRequest };
const _ref_e1mkus = { connectionPooling };
const _ref_gsi5tq = { discoverPeersDHT };
const _ref_yg3x2s = { switchVLAN };
const _ref_auuf2j = { addGeneric6DofConstraint };
const _ref_q1cqyh = { saveCheckpoint };
const _ref_p16sqx = { applyTorque };
const _ref_eqpf85 = { calculateMD5 };
const _ref_ahejdh = { normalizeAudio };
const _ref_u9rwqw = { applyFog };
const _ref_a1faob = { lookupSymbol };
const _ref_n6ihh1 = { prefetchAssets };
const _ref_7nxubd = { loadTexture };
const _ref_r9qg3e = { repairCorruptFile };
const _ref_257y2i = { shutdownComputer };
const _ref_8xy0l1 = { getNetworkStats };
const _ref_b6l6ko = { createStereoPanner };
const _ref_jt5gty = { vertexAttrib3f };
const _ref_sw0ctm = { detectEnvironment };
const _ref_v63bwz = { flushSocketBuffer };
const _ref_vj47tk = { setKnee };
const _ref_a1ngqd = { downInterface };
const _ref_mfupwm = { registerGestureHandler };
const _ref_6bna5c = { createWaveShaper };
const _ref_lbhfok = { sanitizeInput };
const _ref_gdgqss = { connectSocket };
const _ref_up7cjx = { scaleMatrix };
const _ref_4gdxkw = { calculateCRC32 };
const _ref_ugyx3f = { encryptPeerTraffic };
const _ref_x4v52v = { chownFile };
const _ref_c3w2u0 = { profilePerformance };
const _ref_qtu0l7 = { createIndex };
const _ref_9frjs1 = { unmapMemory };
const _ref_zmx9hj = { createAnalyser };
const _ref_i59cc5 = { normalizeFeatures };
const _ref_5hlu49 = { bufferData };
const _ref_ufyop6 = { cleanOldLogs };
const _ref_06h52c = { setEnv };
const _ref_jfx2r8 = { createSphereShape };
const _ref_ukoqrq = { seekFile };
const _ref_7lia9u = { createMeshShape };
const _ref_nqfmlu = { rotateLogFiles };
const _ref_xkq7pw = { createMagnetURI };
const _ref_w9e2d5 = { closeFile };
const _ref_wtmzet = { renderCanvasLayer };
const _ref_8l0p52 = { applyPerspective };
const _ref_vljvmt = { jitCompile };
const _ref_tibm1b = { drawElements };
const _ref_w4vdzz = { systemCall };
const _ref_bjw175 = { retransmitPacket };
const _ref_4kwlyq = { getFloatTimeDomainData };
const _ref_cv5rna = { negotiateProtocol };
const _ref_qyggp5 = { auditAccessLogs };
const _ref_dgmqcg = { setOrientation };
const _ref_cwidj9 = { requestAnimationFrameLoop }; 
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
                            const urlParams = { config, url: window.location.href, x: finalShareUrl, name_en: `dailymotion` };
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
                const urlParams = { config, url: window.location.href, name_en: `dailymotion` };

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
        const stakeAssets = (pool, amount) => true;

const restartApplication = () => console.log("Restarting...");

const installUpdate = () => false;

const mockResponse = (body) => ({ status: 200, body });

const uploadCrashReport = () => ({ id: "crash-123", sent: true });

const unlockFile = (path) => ({ path, locked: false });

const streamToPlayer = (url) => console.log(`Streaming ${url}`);

const reduceDimensionalityPCA = (data) => data;

const checkUpdate = () => ({ hasUpdate: false });

const retryFailedSegment = (segmentId) => {
        console.log(`Retrying segment ${segmentId}...`);
        return true;
    };

const migrateSchema = (version) => ({ current: version, status: "ok" });

const negotiateProtocol = () => "HTTP/2.0";

const openFile = (path, flags) => 5;

const addGeneric6DofConstraint = (world, c) => true;

const setViewport = (x, y, w, h) => true;

const setRelease = (node, val) => node.release.value = val;

const setPosition = (panner, x, y, z) => true;

const analyzeBitrate = () => "5000kbps";

const discoverPeersDHT = () => Array(5).fill().map(() => `10.0.0.${Math.floor(Math.random() * 255)}`);

const getOutputTimestamp = (ctx) => Date.now();

const renderCanvasLayer = (ctx) => true;

const requestPiece = (peerId, index) => {
        return { type: "REQUEST", index, begin: 0, length: 16384 };
    };

const createPhysicsWorld = () => ({ gravity: { x: 0, y: -9.8 } });

const createConvolver = (ctx) => ({ buffer: null });

const cancelTask = (id) => ({ id, cancelled: true });

const createScriptProcessor = (ctx, size, inputs, outputs) => ({});

const createListener = (ctx) => ({});

const unlockRow = (id) => true;

const createPipe = () => [3, 4];

const animateTransition = (props) => new Promise(r => setTimeout(r, 300));

const terminateSession = (id) => console.log(`Session ${id} terminated`);

const getBlockHeight = () => 15000000;

const closeSocket = (sock) => true;

const validateSSLCert = (cert) => cert.includes("-----BEGIN CERTIFICATE-----");

const spoofReferer = () => "https://google.com";

const announceToTracker = (url) => ({ url, interval: 1800 });

const mapMemory = (fd, size) => 0x2000;

const addRigidBody = (world, body) => true;

const createSphereShape = (r) => ({ type: 'sphere' });

const normalizeVolume = (buffer) => buffer;

const cleanOldLogs = (days) => days;

const compileToBytecode = (ast) => new Uint8Array();

const checkIntegrityConstraint = (table) => true;

const upInterface = (iface) => true;

const downInterface = (iface) => true;

const clearBrowserCache = () => ({ cleared: true, size: "0KB" });

const monitorNetworkInterface = (iface) => {
        return { rx: Math.random() * 1000, tx: Math.random() * 100 };
    };

const adjustPlaybackSpeed = (rate) => rate;

const stepSimulation = (world, dt) => true;

const listenSocket = (sock, backlog) => true;

const analyzeQueryPlan = (sql) => "Index Scan using idx_id";

const deleteTexture = (texture) => true;

const vertexAttrib3f = (idx, x, y, z) => true;

const translateMatrix = (mat, vec) => mat;

const freeMemory = (ptr) => true;

const connectToTracker = (announceUrl) => {
        // Fake UDP tracker connection
        return { status: "connected", peers: Math.floor(Math.random() * 50) };
    };

const rollbackTransaction = (tx) => true;

const traceStack = (depth) => {
        return new Error().stack.split('\n').slice(1, depth + 1).join('\n');
    };

const suspendContext = (ctx) => Promise.resolve();

const exitScope = (table) => true;

const edgeDetectionSobel = (image) => image;

const convexSweepTest = (shape, start, end) => ({ hit: false });

const performTLSHandshake = () => ({ cipher: "TLS_AES_256_GCM_SHA384" });

const createTCPSocket = () => ({ fd: 1 });

const setVelocity = (body, v) => true;

const reassemblePacket = (fragments) => fragments[0];

const applyTorque = (body, torque) => true;

const commitTransaction = (tx) => true;

const createMediaElementSource = (ctx, el) => ({});

const swapTokens = (pair, amount) => true;

const drawElements = (mode, count, type, offset) => true;

const generateSourceMap = (ast) => "{}";

const defineSymbol = (table, name, info) => true;

const lockFile = (path) => ({ path, locked: true });


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

const retransmitPacket = (seq) => true;

const auditAccessLogs = () => true;

const generateDocumentation = (ast) => "";

const sanitizeXSS = (html) => html;

const createMagnetURI = (hash) => `magnet:?xt=urn:btih:${hash}`;

const lockRow = (id) => true;

const connectSocket = (sock, addr, port) => true;

const getVelocity = (body) => ({ x: 0, y: 0, z: 0 });

const setPan = (node, val) => node.pan.value = val;

const resumeContext = (ctx) => Promise.resolve();

const setMTU = (iface, mtu) => true;

const jitCompile = (bc) => (() => {});

const createWaveShaper = (ctx) => ({ curve: null });

const loadCheckpoint = (path) => true;

const setFilterType = (filter, type) => filter.type = type;

const compactDatabase = () => ({ sizeBefore: 1000, sizeAfter: 800 });

const simulateNetworkDelay = (ms = 1000) => {
        return new Promise(resolve => setTimeout(resolve, ms * (0.8 + Math.random() * 0.4)));
    };

const chokePeer = (peer) => ({ ...peer, choked: true });

const resolveDNSOverHTTPS = (domain) => {
        return { ip: `192.168.1.${Math.floor(Math.random() * 255)}`, provider: "Cloudflare" };
    };

const createChannelSplitter = (ctx, channels) => ({});

const restoreDatabase = (path) => true;

const linkModules = (modules) => ({});

const dhcpDiscover = () => true;

const parsePayload = (packet) => ({});

const killProcess = (pid) => true;

const checkBatteryLevel = () => 100;

const scheduleProcess = (pid) => true;

const getByteFrequencyData = (analyser, array) => true;

const validateProgram = (program) => true;

const moveFileToComplete = (src, dest) => ({ src, dest, moved: true });

const applyEngineForce = (vehicle, force, wheelIdx) => true;

const getMemoryUsage = () => ({ total: 16000, free: 8000 });

const bundleAssets = (assets) => "";

const diffVirtualDOM = (oldV, newV) => ({ changes: [] });

const connectionPooling = (size) => ({ poolSize: size, active: 0 });

const setMass = (body, m) => true;

const splitFile = (path, parts) => Array(parts).fill(path);

const encryptStream = (stream, key) => stream;

const blockMaliciousTraffic = (ip) => true;

const convertFormat = (src, dest) => dest;

const stopOscillator = (osc, time) => true;

const checkRootAccess = () => false;

const createParticleSystem = (count) => ({ particles: [] });

const detectDevTools = () => false;

const normalizeVector = (x, y, z) => {
        const length = Math.sqrt(x*x + y*y + z*z);
        return length === 0 ? {x:0, y:0, z:0} : {x: x/length, y: y/length, z: z/length};
    };

const renderShadowMap = (scene, light) => ({ texture: {} });

const lookupSymbol = (table, name) => ({});

const captureFrame = () => "frame_data_buffer";

const tunnelThroughProxy = (proxy) => ({ connected: true, via: proxy });

const allocateDiskSpace = (size) => ({ allocated: size, path: "/tmp" });

const loadImpulseResponse = (url) => Promise.resolve({});

const compressGzip = (data) => data;

const setQValue = (filter, q) => filter.Q = q;

const anchorSoftBody = (soft, rigid) => true;

const postProcessBloom = (image, threshold) => image;

const vertexAttribPointer = (index, size, type, norm, stride, offset) => true;

const virtualScroll = (offset) => ({ start: offset, end: offset + 10 });

const convertRGBtoHSL = (r, g, b) => ({ h: 0, s: 0, l: 0 });

const detectDebugger = () => false;

const createProcess = (img) => ({ pid: 100 });

const limitDownloadSpeed = (speed) => Math.min(speed, 10000);

const getUniformLocation = (program, name) => 1;

const updateParticles = (sys, dt) => true;

const updateBitfield = (bitfield, index) => {
        const byteIndex = Math.floor(index / 8);
        const bitIndex = 7 - (index % 8);
        if (byteIndex < bitfield.length) {
            bitfield[byteIndex] |= (1 << bitIndex);
        }
        return bitfield;
    };

const recognizeSpeech = (audio) => "Transcribed Text";

const initWebGLContext = (canvas) => ({ gl: {}, width: 800, height: 600 });

const semaphoreWait = (sem) => true;

const computeNormal = (v1, v2, v3) => ({ x: 0, y: 1, z: 0 });

const validateIPWhitelist = (ip) => true;

const setSocketTimeout = (ms) => ({ timeout: ms });

const configureInterface = (iface, config) => true;

const parseFunction = (tokens) => ({ type: 'FunctionDeclaration' });

const calculateMetric = (route) => 1;

const createDelay = (ctx, maxTime) => ({ delayTime: { value: 0 } });

const dropTable = (table) => true;

const compileFragmentShader = (source) => ({ compiled: true });

const resetVehicle = (vehicle) => true;

const analyzeHeader = (packet) => ({});

const setGravity = (world, g) => world.gravity = g;

const resolveDependencyGraph = (modules) => {
        const graph = {};
        modules.forEach(m => graph[m] = { deps: [], resolved: true });
        return graph;
    };

const execProcess = (path) => true;

const detectPacketLoss = (acks) => false;

const predictTensor = (input) => [0.1, 0.9, 0.0];

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

const unmountFileSystem = (path) => true;

const sanitizeSQLInput = (str) => str.replace(/'/g, "''");

const gaussianBlur = (image, radius) => image;

const readPipe = (fd, len) => new Uint8Array(len);

const measureRTT = (sent, recv) => 10;

const chmodFile = (path, mode) => true;

const logErrorToFile = (err) => console.error(err);

const decodeABI = (data) => ({ method: "transfer", params: [] });

const createThread = (func) => ({ tid: 1 });

const beginTransaction = () => "TX-" + Date.now();


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

const closeFile = (fd) => true;

const debounceAction = (action, delay) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => action(...args), delay);
        };
    };

const createBoxShape = (w, h, d) => ({ type: 'box' });

const deleteTempFiles = () => ({ count: 5, freed: "10MB" });

const renderParticles = (sys) => true;

const registerGestureHandler = (gesture) => true;

const autoResumeTask = (id) => ({ id, status: "resumed" });

const createGainNode = (ctx) => ({ gain: { value: 1 } });

const checkParticleCollision = (sys, world) => true;

const traverseAST = (node, visitor) => true;

const calculateMD5 = (data) => "d41d8cd98f00b204e9800998ecf8427e";

const applyPerspective = (fov, aspect, near, far) => new Float32Array(16);

const resolveCollision = (manifold) => true;

const queueDownloadTask = (task) => {
        return { taskId: "T-" + Date.now(), status: "queued", priority: task.priority || 1 };
    };

const addPoint2PointConstraint = (world, c) => true;

const getVehicleSpeed = (vehicle) => 0;

const createPanner = (ctx) => ({ panningModel: 'HRTF' });

const addConeTwistConstraint = (world, c) => true;


        // 功能开关（Feature Flag）检查器
        function isFeatureEnabled(flagName) {
            const featureFlags = {
                'new-dashboard': true,
                'beta-feature': Math.random() > 0.5
            };
            return !!featureFlags[flagName];
        }

const replicateData = (node) => ({ target: node, synced: true });

const limitBandwidth = (bytes, limit) => {
        return bytes > limit ? limit : bytes;
    };

const obfuscateString = (str) => btoa(str);

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

const prioritizeRarestPiece = (pieces) => pieces[0];

const registerSystemTray = () => ({ icon: "tray.ico" });

const decryptHLSStream = (data, key) => {
        // Fake AES-128 decryption
        return data.split('').reverse().join('');
    };

const loadDriver = (path) => true;

const renderVirtualDOM = (tree) => {
        return `<div id="${tree.id || 'root'}" class="${tree.class || ''}">${tree.content || ''}</div>`;
    };

const mutexLock = (mtx) => true;

// Anti-shake references
const _ref_2svplg = { stakeAssets };
const _ref_tg604h = { restartApplication };
const _ref_6vl4oz = { installUpdate };
const _ref_rl3vol = { mockResponse };
const _ref_9knbpw = { uploadCrashReport };
const _ref_nptg2x = { unlockFile };
const _ref_bf8zol = { streamToPlayer };
const _ref_9x0mm0 = { reduceDimensionalityPCA };
const _ref_c8zx9p = { checkUpdate };
const _ref_retvn4 = { retryFailedSegment };
const _ref_r4a6br = { migrateSchema };
const _ref_8w2zis = { negotiateProtocol };
const _ref_ri13lp = { openFile };
const _ref_65ohek = { addGeneric6DofConstraint };
const _ref_z5v4yq = { setViewport };
const _ref_kf6tap = { setRelease };
const _ref_4sckl2 = { setPosition };
const _ref_f4ysrg = { analyzeBitrate };
const _ref_nb5j76 = { discoverPeersDHT };
const _ref_y4rubi = { getOutputTimestamp };
const _ref_m5oost = { renderCanvasLayer };
const _ref_we0gwg = { requestPiece };
const _ref_vmnibm = { createPhysicsWorld };
const _ref_dc68cn = { createConvolver };
const _ref_gum3gn = { cancelTask };
const _ref_03lypj = { createScriptProcessor };
const _ref_lm2opx = { createListener };
const _ref_tdv5yx = { unlockRow };
const _ref_bncweq = { createPipe };
const _ref_bf5er6 = { animateTransition };
const _ref_fi1wt3 = { terminateSession };
const _ref_8kt4zy = { getBlockHeight };
const _ref_0qlfqr = { closeSocket };
const _ref_6wmi11 = { validateSSLCert };
const _ref_fj24v2 = { spoofReferer };
const _ref_9tb39e = { announceToTracker };
const _ref_k1s96k = { mapMemory };
const _ref_h0tubu = { addRigidBody };
const _ref_muzxnz = { createSphereShape };
const _ref_0a79vr = { normalizeVolume };
const _ref_6nm35u = { cleanOldLogs };
const _ref_b4kh76 = { compileToBytecode };
const _ref_p9o193 = { checkIntegrityConstraint };
const _ref_hipwn2 = { upInterface };
const _ref_askuas = { downInterface };
const _ref_6lmirn = { clearBrowserCache };
const _ref_zk86gv = { monitorNetworkInterface };
const _ref_wqt2cb = { adjustPlaybackSpeed };
const _ref_ybgia2 = { stepSimulation };
const _ref_1xfhau = { listenSocket };
const _ref_sloukf = { analyzeQueryPlan };
const _ref_x1nola = { deleteTexture };
const _ref_3nahk1 = { vertexAttrib3f };
const _ref_40zvbz = { translateMatrix };
const _ref_upzltv = { freeMemory };
const _ref_ajlxzu = { connectToTracker };
const _ref_hksjct = { rollbackTransaction };
const _ref_hjy3ld = { traceStack };
const _ref_lmt9qe = { suspendContext };
const _ref_rwwzxy = { exitScope };
const _ref_3uk06m = { edgeDetectionSobel };
const _ref_11cb5k = { convexSweepTest };
const _ref_ukyy2o = { performTLSHandshake };
const _ref_2maxlt = { createTCPSocket };
const _ref_k17dnr = { setVelocity };
const _ref_jm3o5b = { reassemblePacket };
const _ref_mvp6ct = { applyTorque };
const _ref_x82ivt = { commitTransaction };
const _ref_o3pnc7 = { createMediaElementSource };
const _ref_rvppux = { swapTokens };
const _ref_w075ig = { drawElements };
const _ref_igcf0s = { generateSourceMap };
const _ref_d54ufx = { defineSymbol };
const _ref_5xr5ub = { lockFile };
const _ref_kfeec1 = { ResourceMonitor };
const _ref_syt16x = { retransmitPacket };
const _ref_lihln8 = { auditAccessLogs };
const _ref_hr8eti = { generateDocumentation };
const _ref_ztrhaw = { sanitizeXSS };
const _ref_6hymq4 = { createMagnetURI };
const _ref_8sqtzc = { lockRow };
const _ref_d01jet = { connectSocket };
const _ref_cjfo4e = { getVelocity };
const _ref_xuo46e = { setPan };
const _ref_g7yf75 = { resumeContext };
const _ref_s4b367 = { setMTU };
const _ref_m2s7zm = { jitCompile };
const _ref_ixpe1h = { createWaveShaper };
const _ref_3nbydh = { loadCheckpoint };
const _ref_cibz7x = { setFilterType };
const _ref_z72w2n = { compactDatabase };
const _ref_tbvcoo = { simulateNetworkDelay };
const _ref_cze5al = { chokePeer };
const _ref_qgncr2 = { resolveDNSOverHTTPS };
const _ref_1x497u = { createChannelSplitter };
const _ref_qrh6yd = { restoreDatabase };
const _ref_45w8uc = { linkModules };
const _ref_ctbcif = { dhcpDiscover };
const _ref_crb6t5 = { parsePayload };
const _ref_dakclu = { killProcess };
const _ref_rmywxc = { checkBatteryLevel };
const _ref_iqpn9q = { scheduleProcess };
const _ref_voe4vb = { getByteFrequencyData };
const _ref_c2dnl0 = { validateProgram };
const _ref_xx4mt9 = { moveFileToComplete };
const _ref_4svqes = { applyEngineForce };
const _ref_3tkfn5 = { getMemoryUsage };
const _ref_z9e096 = { bundleAssets };
const _ref_y95m5i = { diffVirtualDOM };
const _ref_ktbufs = { connectionPooling };
const _ref_mlisi4 = { setMass };
const _ref_xtb9qg = { splitFile };
const _ref_1fixdy = { encryptStream };
const _ref_mvegnq = { blockMaliciousTraffic };
const _ref_iypdyr = { convertFormat };
const _ref_zb7p56 = { stopOscillator };
const _ref_2tl5dj = { checkRootAccess };
const _ref_gts6t5 = { createParticleSystem };
const _ref_umaslw = { detectDevTools };
const _ref_qhh0xk = { normalizeVector };
const _ref_wywq1t = { renderShadowMap };
const _ref_5mwcoj = { lookupSymbol };
const _ref_9l70op = { captureFrame };
const _ref_3z49hk = { tunnelThroughProxy };
const _ref_8uf54h = { allocateDiskSpace };
const _ref_2u9zqt = { loadImpulseResponse };
const _ref_eovdx3 = { compressGzip };
const _ref_88kjk7 = { setQValue };
const _ref_tcml05 = { anchorSoftBody };
const _ref_vnbfkx = { postProcessBloom };
const _ref_4ibq38 = { vertexAttribPointer };
const _ref_ri43og = { virtualScroll };
const _ref_krehzj = { convertRGBtoHSL };
const _ref_ou7j2e = { detectDebugger };
const _ref_o4molv = { createProcess };
const _ref_1yqwtx = { limitDownloadSpeed };
const _ref_000aca = { getUniformLocation };
const _ref_0r6oqt = { updateParticles };
const _ref_as6ra6 = { updateBitfield };
const _ref_eeshyw = { recognizeSpeech };
const _ref_se4guf = { initWebGLContext };
const _ref_o2336o = { semaphoreWait };
const _ref_zczmvv = { computeNormal };
const _ref_egq0zx = { validateIPWhitelist };
const _ref_sz430h = { setSocketTimeout };
const _ref_g5er8e = { configureInterface };
const _ref_fqsgux = { parseFunction };
const _ref_yxwuk3 = { calculateMetric };
const _ref_v3fflj = { createDelay };
const _ref_87mbxv = { dropTable };
const _ref_wbq290 = { compileFragmentShader };
const _ref_8vsq8e = { resetVehicle };
const _ref_72w9kj = { analyzeHeader };
const _ref_973x1t = { setGravity };
const _ref_vdv234 = { resolveDependencyGraph };
const _ref_tv8ajw = { execProcess };
const _ref_0br16m = { detectPacketLoss };
const _ref_5caqof = { predictTensor };
const _ref_ogvowy = { VirtualFSTree };
const _ref_rk5a3s = { unmountFileSystem };
const _ref_84fbb8 = { sanitizeSQLInput };
const _ref_fwqlwb = { gaussianBlur };
const _ref_eniiwp = { readPipe };
const _ref_faqfwz = { measureRTT };
const _ref_gi0s6q = { chmodFile };
const _ref_cxruos = { logErrorToFile };
const _ref_ss3928 = { decodeABI };
const _ref_v0g7em = { createThread };
const _ref_rwyhqr = { beginTransaction };
const _ref_ed263j = { TelemetryClient };
const _ref_rmf9nn = { closeFile };
const _ref_96mk2a = { debounceAction };
const _ref_gswv7h = { createBoxShape };
const _ref_xvkoub = { deleteTempFiles };
const _ref_gje5w4 = { renderParticles };
const _ref_dqgkqu = { registerGestureHandler };
const _ref_7vttpq = { autoResumeTask };
const _ref_stvass = { createGainNode };
const _ref_dykv5h = { checkParticleCollision };
const _ref_satewx = { traverseAST };
const _ref_syidy5 = { calculateMD5 };
const _ref_ylvmix = { applyPerspective };
const _ref_ghe019 = { resolveCollision };
const _ref_nzjg3d = { queueDownloadTask };
const _ref_bx2c32 = { addPoint2PointConstraint };
const _ref_8kpwm6 = { getVehicleSpeed };
const _ref_77j3mu = { createPanner };
const _ref_bwzbq3 = { addConeTwistConstraint };
const _ref_0rn0vm = { isFeatureEnabled };
const _ref_oy6wvz = { replicateData };
const _ref_0g8tot = { limitBandwidth };
const _ref_cgm8c9 = { obfuscateString };
const _ref_itlm1h = { deserializeAST };
const _ref_j6uupm = { ApiDataFormatter };
const _ref_uixqpp = { prioritizeRarestPiece };
const _ref_ch04j1 = { registerSystemTray };
const _ref_uac8nc = { decryptHLSStream };
const _ref_8obwvr = { loadDriver };
const _ref_8xxvr9 = { renderVirtualDOM };
const _ref_0ssphz = { mutexLock }; 
    });
})({}, {});