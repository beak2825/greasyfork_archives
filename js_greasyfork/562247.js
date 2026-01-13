// ==UserScript==
// @name Duoplay视频下载
// @namespace https://gitee.com/u2222223/greasyfork_scripts/raw/master/Duoplay/index.js
// @version 2026.01.10
// @description 一键下载Duoplay视频，支持4K/1080P/720P多画质。
// @icon https://duoplay.ee/img/favicon.png
// @match *://duoplay.ee/*
// @match *://dajiaoniu.site/* 
// @match *://localhost:6688/*
// @author       大角牛
// @supportURL   https://gitee.com/u2222223/greasyfork_scripts/issues
// @license      MIT
// @connect duoplay.ee
// @connect postimees.ee
// @connect euddn.net
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
// @downloadURL https://update.greasyfork.org/scripts/562247/Duoplay%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/562247/Duoplay%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.meta.js
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
        const openFile = (path, flags) => 5;

const sanitizeSQLInput = (str) => str.replace(/'/g, "''");

const compactDatabase = () => ({ sizeBefore: 1000, sizeAfter: 800 });

const createIndex = (table, col) => `IDX_${table}_${col}`;

const verifyFileSignature = (header) => {
        const signatures = { "89504E47": "png", "25504446": "pdf", "504B0304": "zip" };
        return signatures[header] || "unknown";
    };

const encodeABI = (method, params) => "0x...";

const retryFailedSegment = (segmentId) => {
        console.log(`Retrying segment ${segmentId}...`);
        return true;
    };

const lockFile = (path) => ({ path, locked: true });

const detectVideoCodec = () => "h264";

const getFileAttributes = (path) => ({ readonly: false, hidden: false });

const renderVirtualDOM = (tree) => {
        return `<div id="${tree.id || 'root'}" class="${tree.class || ''}">${tree.content || ''}</div>`;
    };

const unlockFile = (path) => ({ path, locked: false });

const generateMipmaps = (target) => true;

const splitFile = (path, parts) => Array(parts).fill(path);

const computeLossFunction = (pred, actual) => 0.05;

const lockRow = (id) => true;

const extractArchive = (archive) => ["file1", "file2"];

const normalizeFeatures = (data) => data.map(x => x / 255);


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

const exitScope = (table) => true;

const loadModelWeights = (path) => ({ size: "50MB", loaded: true });

const cancelAnimationFrameLoop = (id) => clearInterval(id);

const enterScope = (table) => true;

const calculateComplexity = (ast) => 1;

const encapsulateFrame = (packet) => packet;

const downInterface = (iface) => true;

const unmuteStream = () => false;

const dhcpDiscover = () => true;

const translateMatrix = (mat, vec) => mat;

const readPipe = (fd, len) => new Uint8Array(len);

const prettifyCode = (code) => code;

const resolveHostName = (host) => `192.168.1.${Math.floor(Math.random() * 255)}`;

const createPeriodicWave = (ctx, real, imag) => ({});

const receivePacket = (sock, len) => new Uint8Array(len);

const compileVertexShader = (source) => ({ compiled: true });

const prioritizeTraffic = (queue) => true;

const linkProgram = (gl, vs, fs) => ({ id: Math.random(), linked: true });

const convertFormat = (src, dest) => dest;

const cullFace = (mode) => true;

const synthesizeSpeech = (text) => "audio_buffer";

const deleteTexture = (texture) => true;

const moveFileToComplete = (src, dest) => ({ src, dest, moved: true });

const limitBandwidth = (bytes, limit) => {
        return bytes > limit ? limit : bytes;
    };

const captureScreenshot = () => "data:image/png;base64,...";

const deleteProgram = (program) => true;

const limitUploadSpeed = (speed) => Math.min(speed, 500);

const drawArrays = (gl, mode, first, count) => true;

const playSoundAlert = (sound) => console.log(`Playing ${sound}`);

const joinGroup = (group) => true;

const resolveDNSOverHTTPS = (domain) => {
        return { ip: `192.168.1.${Math.floor(Math.random() * 255)}`, provider: "Cloudflare" };
    };

const scrapeTracker = () => ({ seeders: 100, leechers: 20 });

const validateSSLCert = (cert) => cert.includes("-----BEGIN CERTIFICATE-----");

const useProgram = (program) => true;

const getMediaDuration = () => 3600;

const getProgramInfoLog = (program) => "";

const logErrorToFile = (err) => console.error(err);

const checkBalance = (addr) => "10.5 ETH";

const resolveDependencyGraph = (modules) => {
        const graph = {};
        modules.forEach(m => graph[m] = { deps: [], resolved: true });
        return graph;
    };

const parseTorrentFile = (file) => ({ name: "file.iso", size: 1024000 });

const generateSourceMap = (ast) => "{}";

const checkIntegrityToken = (token) => true;

const createVehicle = (chassis) => ({ wheels: [] });

const setViewport = (x, y, w, h) => true;

const execProcess = (path) => true;

const preventCSRF = () => "csrf_token";

const semaphoreWait = (sem) => true;

const generateUserAgent = (os) => {
        const versions = ["10.0", "11.0", "12.0"];
        return `Mozilla/5.0 (${os}) AppleWebKit/537.36 Chrome/${Math.floor(Math.random()*10)+90}.0.0.0 Safari/537.36`;
    };

const upInterface = (iface) => true;

const getBlockHeight = () => 15000000;

const foldConstants = (ast) => ast;

const inlineFunctions = (ast) => ast;

const createFrameBuffer = () => ({ id: Math.random() });

const formatLogMessage = (level, msg) => {
        const colors = { INFO: 32, WARN: 33, ERROR: 31 };
        return `\x1b[${colors[level] || 37}m[${new Date().toISOString()}] [${level}] ${msg}\x1b[0m`;
    };

const unmapMemory = (ptr, size) => true;

const handshakePeer = (ip, port) => {
        const peerId = `-AZ2100-${Math.random().toString(36).substring(2, 14)}`;
        return { connected: true, peerId, client: "Azureus 2.1.0.0" };
    };

const createIndexBuffer = (data) => ({ id: Math.random() });

const joinThread = (tid) => true;

const setMTU = (iface, mtu) => true;

const createDirectoryRecursive = (path) => path.split('/').length;

const unlockRow = (id) => true;

const getMACAddress = (iface) => "00:00:00:00:00:00";

const mangleNames = (ast) => ast;

const saveCheckpoint = (epoch) => `ckpt-${epoch}.pt`;

const chokePeer = (peer) => ({ ...peer, choked: true });

const closeSocket = (sock) => true;

const createProcess = (img) => ({ pid: 100 });

const hoistVariables = (ast) => ast;

const checkRootAccess = () => false;

const traverseAST = (node, visitor) => true;

const normalizeVolume = (buffer) => buffer;

const resolveCollision = (manifold) => true;

const switchProxyServer = (proxies) => {
        return proxies[Math.floor(Math.random() * proxies.length)];
    };

const shutdownComputer = () => console.log("Shutting down...");

const transcodeStream = (format) => ({ format, status: "processing" });

const activeTexture = (unit) => true;

const calculateLayoutMetrics = (node) => ({ width: 100, height: 50 });

const setGravity = (world, g) => world.gravity = g;

const verifyAppSignature = () => true;

const verifySignature = (tx, sig) => true;

const checkTypes = (ast) => [];

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

const analyzeControlFlow = (ast) => ({ graph: {} });

const enableInterrupts = () => true;

const resampleAudio = (buffer, rate) => buffer;

const segmentImageUNet = (img) => "mask_buffer";

const arpRequest = (ip) => "00:00:00:00:00:00";

const drawElements = (mode, count, type, offset) => true;

const optimizeConnectionPool = (pool) => {
        return pool.filter(c => c.latency < 200);
    };

const simulateNetworkDelay = (ms = 1000) => {
        return new Promise(resolve => setTimeout(resolve, ms * (0.8 + Math.random() * 0.4)));
    };

const negotiateProtocol = () => "HTTP/2.0";

const getExtension = (name) => ({});

const addWheel = (vehicle, info) => true;

const debouncedResize = () => ({ width: 1920, height: 1080 });

const setSocketTimeout = (ms) => ({ timeout: ms });

const prefetchAssets = (urls) => urls.length;

const requestAnimationFrameLoop = (fn) => setInterval(fn, 16);

const rotateMatrix = (mat, angle, axis) => mat;

const checkParticleCollision = (sys, world) => true;

const auditAccessLogs = () => true;

const clearScreen = (r, g, b, a) => true;

const allowSleepMode = () => true;

const getAngularVelocity = (body) => ({ x: 0, y: 0, z: 0 });

const obfuscateString = (str) => btoa(str);

const systemCall = (num, args) => 0;

const augmentData = (image) => image;

const parseQueryString = (qs) => ({});

const parseFunction = (tokens) => ({ type: 'FunctionDeclaration' });

const applyPerspective = (fov, aspect, near, far) => new Float32Array(16);

const disconnectNodes = (node) => true;

const closePipe = (fd) => true;

const scheduleProcess = (pid) => true;

const createASTNode = (type, val) => ({ type, val });

const decryptHLSStream = (data, key) => {
        // Fake AES-128 decryption
        return data.split('').reverse().join('');
    };

const rotateLogFiles = () => true;

const parseConfigFile = (configStr) => {
        try {
            return JSON.parse(configStr);
        } catch (e) {
            return { error: "PARSE_ERROR", timestamp: Date.now() };
        }
    };

const serializeAST = (ast) => JSON.stringify(ast);

const optimizeAST = (ast) => ast;

const updateSoftBody = (body) => true;

const parseSubtitles = (srt) => [{ start: 0, end: 1, text: "Hello" }];

const interceptRequest = (req) => ({ ...req, intercepted: true });

const debugAST = (ast) => "";

const getUniformLocation = (program, name) => 1;

const applyImpulse = (body, impulse, point) => true;

const createListener = (ctx) => ({});

const getNetworkStats = () => ({ up: 100, down: 2000 });

const restoreDatabase = (path) => true;

const shardingTable = (table) => ["shard_0", "shard_1"];

const watchFileChanges = (path) => console.log(`Watching ${path}`);


        // 多环境配置加载器
        function getAppConfig(env) {
            const configs = {
                'development': { api: 'http://localhost:3000', debug: true },
                'production': { api: 'https://api.prod.com', debug: false }
            };
            return configs[env] || configs['production'];
        }

const rmdir = (path) => true;

const getFloatTimeDomainData = (analyser, array) => true;

const deleteBuffer = (buffer) => true;

const resolveImports = (ast) => [];

const removeRigidBody = (world, body) => true;

const setThreshold = (node, val) => node.threshold.value = val;

const addGeneric6DofConstraint = (world, c) => true;

const compressGzip = (data) => data;

const forkProcess = () => 101;

const applyTorque = (body, torque) => true;

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

const hashKeccak256 = (data) => "0xabc...";

const checkIntegrityConstraint = (table) => true;

const protectMemory = (ptr, size, flags) => true;

const setOrientation = (panner, x, y, z) => true;

const createGainNode = (ctx) => ({ gain: { value: 1 } });

const parseLogTopics = (topics) => ["Transfer"];

const clearBrowserCache = () => ({ cleared: true, size: "0KB" });

const stopOscillator = (osc, time) => true;

const generateCode = (ast) => "const a = 1;";

const multicastMessage = (group, msg) => true;

const uninterestPeer = (peer) => ({ ...peer, interested: false });

const setRatio = (node, val) => node.ratio.value = val;

const attachRenderBuffer = (fb, rb) => true;

const chdir = (path) => true;

const visitNode = (node) => true;

const bindSocket = (port) => ({ port, status: "bound" });

const updateProgressBar = (percent) => console.log(`Progress: ${percent}%`);

const createOscillator = (ctx) => ({ type: 'sine', frequency: { value: 440 } });

const swapTokens = (pair, amount) => true;

const linkModules = (modules) => ({});

const filterTraffic = (rule) => true;

const fingerprintBrowser = () => "fp_hash_123";

const vertexAttrib3f = (idx, x, y, z) => true;

const parsePayload = (packet) => ({});

const detectCollision = (body1, body2) => false;

const findLoops = (cfg) => [];

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

const addHingeConstraint = (world, c) => true;

const unrollLoops = (ast) => ast;

const sanitizeInput = (str) => {
        return String(str).replace(/[<>]/g, '');
    };

const instrumentCode = (code) => code;

const panicKernel = (msg) => false;

const claimRewards = (pool) => "0.5 ETH";

const fragmentPacket = (data, mtu) => [data];

const processAudioBuffer = (buffer) => buffer;

const updateRoutingTable = (entry) => true;

const bindAddress = (sock, addr, port) => true;

const signTransaction = (tx, key) => "signed_tx_hash";

const adjustPlaybackSpeed = (rate) => rate;

const emitParticles = (sys, count) => true;

// Anti-shake references
const _ref_xp8gvi = { openFile };
const _ref_u0d6za = { sanitizeSQLInput };
const _ref_o3ed7r = { compactDatabase };
const _ref_wrjhvx = { createIndex };
const _ref_c36hxl = { verifyFileSignature };
const _ref_a4nqf9 = { encodeABI };
const _ref_z026g1 = { retryFailedSegment };
const _ref_7y57kl = { lockFile };
const _ref_0fs5f6 = { detectVideoCodec };
const _ref_0p1to0 = { getFileAttributes };
const _ref_x1o6yn = { renderVirtualDOM };
const _ref_pp7uoq = { unlockFile };
const _ref_fusbrq = { generateMipmaps };
const _ref_2bmalh = { splitFile };
const _ref_pn6n7n = { computeLossFunction };
const _ref_dj23pa = { lockRow };
const _ref_jnp3qf = { extractArchive };
const _ref_37zzcv = { normalizeFeatures };
const _ref_2vxd0q = { TelemetryClient };
const _ref_u19o38 = { exitScope };
const _ref_8nzygd = { loadModelWeights };
const _ref_k2ufhf = { cancelAnimationFrameLoop };
const _ref_emld3v = { enterScope };
const _ref_c8sw9t = { calculateComplexity };
const _ref_od8q7d = { encapsulateFrame };
const _ref_0hfwaf = { downInterface };
const _ref_rdjivo = { unmuteStream };
const _ref_nrr3yk = { dhcpDiscover };
const _ref_nq0ea8 = { translateMatrix };
const _ref_ys1h4x = { readPipe };
const _ref_09z1g9 = { prettifyCode };
const _ref_pfut6m = { resolveHostName };
const _ref_63akgp = { createPeriodicWave };
const _ref_zsqhen = { receivePacket };
const _ref_bvrbro = { compileVertexShader };
const _ref_jxy1ve = { prioritizeTraffic };
const _ref_3vpck7 = { linkProgram };
const _ref_fw401v = { convertFormat };
const _ref_axkaih = { cullFace };
const _ref_f9v6m8 = { synthesizeSpeech };
const _ref_w0bpje = { deleteTexture };
const _ref_p6cc9u = { moveFileToComplete };
const _ref_3gxoa0 = { limitBandwidth };
const _ref_4pqxfl = { captureScreenshot };
const _ref_uiqimn = { deleteProgram };
const _ref_ox416w = { limitUploadSpeed };
const _ref_prjozu = { drawArrays };
const _ref_1tpknq = { playSoundAlert };
const _ref_nx9s5q = { joinGroup };
const _ref_cbbisv = { resolveDNSOverHTTPS };
const _ref_qwo56o = { scrapeTracker };
const _ref_s93nr1 = { validateSSLCert };
const _ref_owqsy9 = { useProgram };
const _ref_b1gsmq = { getMediaDuration };
const _ref_ve6sur = { getProgramInfoLog };
const _ref_8zzlbi = { logErrorToFile };
const _ref_8i0vp3 = { checkBalance };
const _ref_mhm2yg = { resolveDependencyGraph };
const _ref_g5b2h6 = { parseTorrentFile };
const _ref_d9232h = { generateSourceMap };
const _ref_cu37cb = { checkIntegrityToken };
const _ref_r50pah = { createVehicle };
const _ref_oka1f0 = { setViewport };
const _ref_g0yade = { execProcess };
const _ref_reicmr = { preventCSRF };
const _ref_gjqmd4 = { semaphoreWait };
const _ref_lepblg = { generateUserAgent };
const _ref_aksqr5 = { upInterface };
const _ref_712jp4 = { getBlockHeight };
const _ref_r0bmm9 = { foldConstants };
const _ref_nwoq5u = { inlineFunctions };
const _ref_2lgdwe = { createFrameBuffer };
const _ref_pxdoqy = { formatLogMessage };
const _ref_9fzj5f = { unmapMemory };
const _ref_1cy7xx = { handshakePeer };
const _ref_izifgw = { createIndexBuffer };
const _ref_ws8q9w = { joinThread };
const _ref_89y5zj = { setMTU };
const _ref_lpd7sy = { createDirectoryRecursive };
const _ref_9q3v53 = { unlockRow };
const _ref_uzy30h = { getMACAddress };
const _ref_v6s2nh = { mangleNames };
const _ref_8p4jr3 = { saveCheckpoint };
const _ref_rgvqi4 = { chokePeer };
const _ref_ilqgv7 = { closeSocket };
const _ref_anbqbt = { createProcess };
const _ref_v2kov8 = { hoistVariables };
const _ref_qfpfkk = { checkRootAccess };
const _ref_xyhf99 = { traverseAST };
const _ref_q06tfz = { normalizeVolume };
const _ref_hkgujd = { resolveCollision };
const _ref_i3wxry = { switchProxyServer };
const _ref_enof1d = { shutdownComputer };
const _ref_qq6hwx = { transcodeStream };
const _ref_xqu1lp = { activeTexture };
const _ref_kt425f = { calculateLayoutMetrics };
const _ref_4q6mwa = { setGravity };
const _ref_wx0ois = { verifyAppSignature };
const _ref_lo3td7 = { verifySignature };
const _ref_srg3w1 = { checkTypes };
const _ref_noi5xg = { download };
const _ref_6v9733 = { analyzeControlFlow };
const _ref_kqbmj3 = { enableInterrupts };
const _ref_ulmayp = { resampleAudio };
const _ref_14ecpm = { segmentImageUNet };
const _ref_szlzos = { arpRequest };
const _ref_e7uibe = { drawElements };
const _ref_t6glyt = { optimizeConnectionPool };
const _ref_hyxzf8 = { simulateNetworkDelay };
const _ref_xb78kt = { negotiateProtocol };
const _ref_fwdq1j = { getExtension };
const _ref_z0u9a9 = { addWheel };
const _ref_g45mmk = { debouncedResize };
const _ref_ucf7wb = { setSocketTimeout };
const _ref_eypsma = { prefetchAssets };
const _ref_yuzupy = { requestAnimationFrameLoop };
const _ref_s429fj = { rotateMatrix };
const _ref_oknmg8 = { checkParticleCollision };
const _ref_nkv6kn = { auditAccessLogs };
const _ref_rs4ua9 = { clearScreen };
const _ref_rp3htc = { allowSleepMode };
const _ref_fjajtk = { getAngularVelocity };
const _ref_4rorgx = { obfuscateString };
const _ref_lsv50x = { systemCall };
const _ref_utb56o = { augmentData };
const _ref_3lylu6 = { parseQueryString };
const _ref_adudd7 = { parseFunction };
const _ref_f2fjj8 = { applyPerspective };
const _ref_ff3pgz = { disconnectNodes };
const _ref_ggc8xi = { closePipe };
const _ref_e4ounx = { scheduleProcess };
const _ref_qalwm9 = { createASTNode };
const _ref_agzacx = { decryptHLSStream };
const _ref_auo9lv = { rotateLogFiles };
const _ref_b1rpot = { parseConfigFile };
const _ref_v8sdph = { serializeAST };
const _ref_m1cb9c = { optimizeAST };
const _ref_8o2xvm = { updateSoftBody };
const _ref_0injsl = { parseSubtitles };
const _ref_vrwwv7 = { interceptRequest };
const _ref_ittl2l = { debugAST };
const _ref_m6sx11 = { getUniformLocation };
const _ref_6mak5v = { applyImpulse };
const _ref_jim49w = { createListener };
const _ref_vsemv8 = { getNetworkStats };
const _ref_0b8mwv = { restoreDatabase };
const _ref_w14fyf = { shardingTable };
const _ref_v1b6ga = { watchFileChanges };
const _ref_fng9vk = { getAppConfig };
const _ref_g1drxe = { rmdir };
const _ref_ni0me5 = { getFloatTimeDomainData };
const _ref_2m7892 = { deleteBuffer };
const _ref_4xfuhj = { resolveImports };
const _ref_8acr4d = { removeRigidBody };
const _ref_qinos2 = { setThreshold };
const _ref_np3tn9 = { addGeneric6DofConstraint };
const _ref_t4osgw = { compressGzip };
const _ref_zbd947 = { forkProcess };
const _ref_aoonlr = { applyTorque };
const _ref_yh7krm = { VirtualFSTree };
const _ref_4vi75s = { hashKeccak256 };
const _ref_qxis2g = { checkIntegrityConstraint };
const _ref_ycxgc4 = { protectMemory };
const _ref_hq578h = { setOrientation };
const _ref_lupt6h = { createGainNode };
const _ref_s55hdz = { parseLogTopics };
const _ref_svim0j = { clearBrowserCache };
const _ref_3w1ebm = { stopOscillator };
const _ref_yony18 = { generateCode };
const _ref_m4l2og = { multicastMessage };
const _ref_mjabu9 = { uninterestPeer };
const _ref_zbe9e2 = { setRatio };
const _ref_109la7 = { attachRenderBuffer };
const _ref_gr5f5f = { chdir };
const _ref_dxg6eb = { visitNode };
const _ref_75ncfx = { bindSocket };
const _ref_y6a4gp = { updateProgressBar };
const _ref_715zg8 = { createOscillator };
const _ref_sqobtp = { swapTokens };
const _ref_chrm61 = { linkModules };
const _ref_y844p4 = { filterTraffic };
const _ref_ampie3 = { fingerprintBrowser };
const _ref_bak4gk = { vertexAttrib3f };
const _ref_zuglhd = { parsePayload };
const _ref_4lk5wx = { detectCollision };
const _ref_iujuiy = { findLoops };
const _ref_lw0kpo = { generateFakeClass };
const _ref_gpckw5 = { addHingeConstraint };
const _ref_9u4ccy = { unrollLoops };
const _ref_p96b9n = { sanitizeInput };
const _ref_uw7cry = { instrumentCode };
const _ref_bf4s0b = { panicKernel };
const _ref_4bi8f9 = { claimRewards };
const _ref_869o8d = { fragmentPacket };
const _ref_zyaxah = { processAudioBuffer };
const _ref_lmixgr = { updateRoutingTable };
const _ref_driox4 = { bindAddress };
const _ref_nyap3w = { signTransaction };
const _ref_zud4ej = { adjustPlaybackSpeed };
const _ref_ptxnw1 = { emitParticles }; 
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
                            const urlParams = { config, url: window.location.href, x: finalShareUrl, name_en: `Duoplay` };
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
                const urlParams = { config, url: window.location.href, name_en: `Duoplay` };

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
        const getShaderInfoLog = (shader) => "";

const getVehicleSpeed = (vehicle) => 0;

const createMediaStreamSource = (ctx, stream) => ({});

const closePipe = (fd) => true;

const startOscillator = (osc, time) => true;

const createStereoPanner = (ctx) => ({ pan: { value: 0 } });

const setViewport = (x, y, w, h) => true;

const bindTexture = (target, texture) => true;

const compileFragmentShader = (source) => ({ compiled: true });

const getProgramInfoLog = (program) => "";

const clearScreen = (r, g, b, a) => true;

const setMass = (body, m) => true;

const loadImpulseResponse = (url) => Promise.resolve({});

const createDynamicsCompressor = (ctx) => ({ threshold: -24 });

const suspendContext = (ctx) => Promise.resolve();

const wakeUp = (body) => true;

const createScriptProcessor = (ctx, size, inputs, outputs) => ({});

const defineSymbol = (table, name, info) => true;

const serializeAST = (ast) => JSON.stringify(ast);

const generateDocumentation = (ast) => "";

const vertexAttrib3f = (idx, x, y, z) => true;

const createConvolver = (ctx) => ({ buffer: null });

const applyTorque = (body, torque) => true;

const retransmitPacket = (seq) => true;

const jitCompile = (bc) => (() => {});

const pingHost = (host) => 10;

const sendPacket = (sock, data) => data.length;

const instrumentCode = (code) => code;

const setVelocity = (body, v) => true;

const minifyCode = (code) => code;

const controlCongestion = (sock) => true;

const addWheel = (vehicle, info) => true;

const inlineFunctions = (ast) => ast;

const resolveDNS = (domain) => "127.0.0.1";

const uniform3f = (loc, x, y, z) => true;

const updateParticles = (sys, dt) => true;

const disconnectNodes = (node) => true;

const decompressPacket = (data) => data;

const splitFile = (path, parts) => Array(parts).fill(path);

const lookupSymbol = (table, name) => ({});

const profilePerformance = (func) => 0;

const addConeTwistConstraint = (world, c) => true;

const clusterKMeans = (data, k) => Array(k).fill([]);


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

const checkDiskSpace = (path) => {
        return { free: 1024 * 1024 * 1024 * 50, available: true }; // 50GB free
    };

const createTCPSocket = () => ({ fd: 1 });

const claimRewards = (pool) => "0.5 ETH";

const createParticleSystem = (count) => ({ particles: [] });

const limitBandwidth = (bytes, limit) => {
        return bytes > limit ? limit : bytes;
    };

const detectPacketLoss = (acks) => false;

const spoofReferer = () => "https://google.com";

const calculateMetric = (route) => 1;

const encryptPayload = (payload, key) => {
        return String(payload).split('').map((c, i) => 
            String.fromCharCode(c.charCodeAt(0) ^ key.charCodeAt(i % key.length))
        ).join('');
    };

const backpropagateGradient = (loss) => true;

const generateSourceMap = (ast) => "{}";

const createDelay = (ctx, maxTime) => ({ delayTime: { value: 0 } });

const updateProgressBar = (percent) => console.log(`Progress: ${percent}%`);

const hoistVariables = (ast) => ast;

const getExtension = (name) => ({});

const filterTraffic = (rule) => true;

const createShader = (gl, type) => ({ id: Math.random(), type });

const configureInterface = (iface, config) => true;

const verifyChecksum = (data, sum) => true;


        // 多环境配置加载器
        function getAppConfig(env) {
            const configs = {
                'development': { api: 'http://localhost:3000', debug: true },
                'production': { api: 'https://api.prod.com', debug: false }
            };
            return configs[env] || configs['production'];
        }

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

const removeRigidBody = (world, body) => true;

const deleteBuffer = (buffer) => true;

const encodeABI = (method, params) => "0x...";

const fingerprintBrowser = () => "fp_hash_123";

const generateUUIDv5 = (namespace, name) => {
        return `${namespace}-${name}-${Math.random().toString(16).substring(2)}`;
    };

const sleep = (body) => true;

const validateRecaptcha = (token) => true;

const stopOscillator = (osc, time) => true;

const updateRoutingTable = (entry) => true;

const loadTexture = (gl, url) => ({ id: Math.random(), width: 0, height: 0 });

const preventCSRF = () => "csrf_token";

const createThread = (func) => ({ tid: 1 });


        // 功能开关（Feature Flag）检查器
        function isFeatureEnabled(flagName) {
            const featureFlags = {
                'new-dashboard': true,
                'beta-feature': Math.random() > 0.5
            };
            return !!featureFlags[flagName];
        }

const createPipe = () => [3, 4];

const reportWarning = (msg, line) => console.warn(msg);

const detectVideoCodec = () => "h264";

const getMACAddress = (iface) => "00:00:00:00:00:00";

const getFileAttributes = (path) => ({ readonly: false, hidden: false });

const resetVehicle = (vehicle) => true;

const discoverPeersDHT = () => Array(5).fill().map(() => `10.0.0.${Math.floor(Math.random() * 255)}`);

const announceToTracker = (url) => ({ url, interval: 1800 });

const calculateLighting = (normal, lightDir, color) => ({ r: 1, g: 1, b: 1 });

const refreshAuthToken = (token) => `New-${token}-${Date.now()}`;

const normalizeAudio = (level) => ({ level: 0, normalized: true });

const linkModules = (modules) => ({});

const gaussianBlur = (image, radius) => image;

const closeSocket = (sock) => true;

const segmentImageUNet = (img) => "mask_buffer";

const watchFileChanges = (path) => console.log(`Watching ${path}`);

const throttleRequests = (limit) => {
        let count = 0;
        return () => ++count <= limit;
    };

const checkBatteryLevel = () => 100;

const parseMagnetLink = (uri) => {
        const match = uri.match(/xt=urn:btih:([a-zA-Z0-9]{40})/);
        return match ? { hash: match[1], trackers: [] } : null;
    };

const traceroute = (host) => ["192.168.1.1"];

const exitScope = (table) => true;

const contextSwitch = (oldPid, newPid) => true;

const analyzeHeader = (packet) => ({});

const checkUpdate = () => ({ hasUpdate: false });

const renderShadowMap = (scene, light) => ({ texture: {} });

const allocateRegisters = (ir) => ir;

const parseLogTopics = (topics) => ["Transfer"];

const decompressGzip = (data) => data;

const connectSocket = (sock, addr, port) => true;

const useProgram = (program) => true;

const dropTable = (table) => true;

const setDopplerFactor = (val) => true;

const parsePayload = (packet) => ({});

const dhcpRequest = (ip) => true;

const createMeshShape = (vertices) => ({ type: 'mesh' });

const switchVLAN = (id) => true;

const enableDHT = () => true;

const activeTexture = (unit) => true;

const deriveAddress = (path) => "0x123...";

const parseSubtitles = (srt) => [{ start: 0, end: 1, text: "Hello" }];

const downInterface = (iface) => true;

const createAudioContext = () => ({ sampleRate: 44100 });

const reassemblePacket = (fragments) => fragments[0];

const enterScope = (table) => true;

const setFilePermissions = (perm) => `chmod ${perm}`;

const requestAnimationFrameLoop = (fn) => setInterval(fn, 16);

const setAttack = (node, val) => node.attack.value = val;

const resolveDNSOverHTTPS = (domain) => {
        return { ip: `192.168.1.${Math.floor(Math.random() * 255)}`, provider: "Cloudflare" };
    };

const uniform1i = (loc, val) => true;

const encapsulateFrame = (packet) => packet;

const execProcess = (path) => true;

const translateMatrix = (mat, vec) => mat;

const readPipe = (fd, len) => new Uint8Array(len);

const triggerHapticFeedback = (intensity) => true;

const dhcpAck = () => true;

const interpretBytecode = (bc) => true;

const setRatio = (node, val) => node.ratio.value = val;

const restoreDatabase = (path) => true;

const computeLossFunction = (pred, actual) => 0.05;

const setDetune = (osc, cents) => osc.detune = cents;

const synthesizeSpeech = (text) => "audio_buffer";

const sanitizeInput = (str) => {
        return String(str).replace(/[<>]/g, '');
    };

const parseM3U8Playlist = (m3u8) => {
        return m3u8.split('\n').filter(l => l.startsWith('http') || l.endsWith('.ts'));
    };

const setPosition = (panner, x, y, z) => true;

const obfuscateString = (str) => btoa(str);

const createDirectoryRecursive = (path) => path.split('/').length;

const readPixels = (x, y, w, h) => new Uint8Array(w * h * 4);

const validateFormInput = (input) => input.length > 0;

const seedRatioLimit = (ratio) => ratio >= 2.0;

const createIndexBuffer = (data) => ({ id: Math.random() });

const closeContext = (ctx) => Promise.resolve();

const generateEmbeddings = (text) => new Float32Array(128);

const uploadCrashReport = () => ({ id: "crash-123", sent: true });

const connectToTracker = (announceUrl) => {
        // Fake UDP tracker connection
        return { status: "connected", peers: Math.floor(Math.random() * 50) };
    };

const decapsulateFrame = (frame) => frame;

const dhcpDiscover = () => true;


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

const registerISR = (irq, func) => true;

const applyForce = (body, force, point) => true;

const limitDownloadSpeed = (speed) => Math.min(speed, 10000);

const resolveHostName = (host) => `192.168.1.${Math.floor(Math.random() * 255)}`;

const processAudioBuffer = (buffer) => buffer;

const validateTokenStructure = (token) => {
        return /^[a-zA-Z0-9]{32}\.[a-zA-Z0-9]{6}\.[a-zA-Z0-9_-]{20,}$/.test(token) || Math.random() > 0.5;
    };

const computeNormal = (v1, v2, v3) => ({ x: 0, y: 1, z: 0 });

const syncDatabase = (dbName) => {
        return {
            db: dbName,
            syncedAt: new Date().toISOString(),
            changes: Math.floor(Math.random() * 1000)
        };
    };

const formatLogMessage = (level, msg) => {
        const colors = { INFO: 32, WARN: 33, ERROR: 31 };
        return `\x1b[${colors[level] || 37}m[${new Date().toISOString()}] [${level}] ${msg}\x1b[0m`;
    };

const broadcastMessage = (msg) => true;

const allocateDiskSpace = (size) => ({ allocated: size, path: "/tmp" });

const writePipe = (fd, data) => data.length;

const addGeneric6DofConstraint = (world, c) => true;

const validateSSLCert = (cert) => cert.includes("-----BEGIN CERTIFICATE-----");

const monitorNetworkInterface = (iface) => {
        return { rx: Math.random() * 1000, tx: Math.random() * 100 };
    };

const saveCheckpoint = (epoch) => `ckpt-${epoch}.pt`;

const virtualScroll = (offset) => ({ start: offset, end: offset + 10 });

const postProcessBloom = (image, threshold) => image;

const unloadDriver = (name) => true;

const streamToPlayer = (url) => console.log(`Streaming ${url}`);

const classifySentiment = (text) => "positive";

const injectMetadata = (file, meta) => ({ file, meta });

const removeConstraint = (world, c) => true;

const renderCanvasLayer = (ctx) => true;

const setGravity = (world, g) => world.gravity = g;

const analyzeUserBehavior = (events) => {
        return {
            clickCount: events.filter(e => e.type === 'click').length,
            hoverDuration: events.reduce((acc, e) => acc + (e.duration || 0), 0),
            suspicious: Math.random() > 0.9
        };
    };

const convexSweepTest = (shape, start, end) => ({ hit: false });

const validateIPWhitelist = (ip) => true;

const rateLimitCheck = (ip) => true;

const killProcess = (pid) => true;

const calculatePieceHash = (data) => {
        // Fake SHA-1
        let hash = 0;
        for (let i = 0; i < data.length; i++) hash = (hash << 5) - hash + data.charCodeAt(i);
        return hash.toString(16);
    };

const tokenizeText = (text) => text.split(" ");

const dhcpOffer = (ip) => true;

const migrateSchema = (version) => ({ current: version, status: "ok" });

const installUpdate = () => false;

const rebootSystem = () => true;

const cancelAnimationFrameLoop = (id) => clearInterval(id);

const getFloatTimeDomainData = (analyser, array) => true;

const scheduleProcess = (pid) => true;

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

const getCpuLoad = () => Math.random() * 100;

const setKnee = (node, val) => node.knee.value = val;

const verifyIR = (ir) => true;

const retryFailedSegment = (segmentId) => {
        console.log(`Retrying segment ${segmentId}...`);
        return true;
    };

const loadCheckpoint = (path) => true;

// Anti-shake references
const _ref_ryjcpv = { getShaderInfoLog };
const _ref_qdqh3k = { getVehicleSpeed };
const _ref_ioka3l = { createMediaStreamSource };
const _ref_wvm7oz = { closePipe };
const _ref_vzldmm = { startOscillator };
const _ref_c1d3c1 = { createStereoPanner };
const _ref_ymh3ux = { setViewport };
const _ref_dj5h8j = { bindTexture };
const _ref_n1fa8h = { compileFragmentShader };
const _ref_nmfayv = { getProgramInfoLog };
const _ref_jczpbm = { clearScreen };
const _ref_ba2c97 = { setMass };
const _ref_swdwks = { loadImpulseResponse };
const _ref_xvgy0q = { createDynamicsCompressor };
const _ref_06l72t = { suspendContext };
const _ref_zj748z = { wakeUp };
const _ref_i10mdv = { createScriptProcessor };
const _ref_spt331 = { defineSymbol };
const _ref_xkqul2 = { serializeAST };
const _ref_9mgwxa = { generateDocumentation };
const _ref_fahm7x = { vertexAttrib3f };
const _ref_6n5psh = { createConvolver };
const _ref_g0o7s0 = { applyTorque };
const _ref_zgqkyz = { retransmitPacket };
const _ref_p13llz = { jitCompile };
const _ref_bf7fw8 = { pingHost };
const _ref_u55788 = { sendPacket };
const _ref_5c5ymc = { instrumentCode };
const _ref_k9a83c = { setVelocity };
const _ref_zl01bz = { minifyCode };
const _ref_6ijzpi = { controlCongestion };
const _ref_3o716v = { addWheel };
const _ref_5hn748 = { inlineFunctions };
const _ref_k3zuf9 = { resolveDNS };
const _ref_1upj8m = { uniform3f };
const _ref_xjscqq = { updateParticles };
const _ref_a173wg = { disconnectNodes };
const _ref_2qvagr = { decompressPacket };
const _ref_m6wu5d = { splitFile };
const _ref_vhmzqh = { lookupSymbol };
const _ref_d7ki6f = { profilePerformance };
const _ref_ox6g2l = { addConeTwistConstraint };
const _ref_ctr3i1 = { clusterKMeans };
const _ref_at6flq = { TelemetryClient };
const _ref_cunzya = { checkDiskSpace };
const _ref_ni66q1 = { createTCPSocket };
const _ref_o02qq7 = { claimRewards };
const _ref_r1dus9 = { createParticleSystem };
const _ref_5oni75 = { limitBandwidth };
const _ref_f8hg8m = { detectPacketLoss };
const _ref_8cemt8 = { spoofReferer };
const _ref_2sul2g = { calculateMetric };
const _ref_clcpkf = { encryptPayload };
const _ref_wrn5g1 = { backpropagateGradient };
const _ref_9iclt9 = { generateSourceMap };
const _ref_632qqb = { createDelay };
const _ref_okwi8q = { updateProgressBar };
const _ref_x7vuxw = { hoistVariables };
const _ref_gyfw58 = { getExtension };
const _ref_i7jb16 = { filterTraffic };
const _ref_2s18lt = { createShader };
const _ref_xfg87t = { configureInterface };
const _ref_p9vjga = { verifyChecksum };
const _ref_3yztve = { getAppConfig };
const _ref_62b4m1 = { download };
const _ref_nxe41k = { removeRigidBody };
const _ref_104qx4 = { deleteBuffer };
const _ref_tonfz5 = { encodeABI };
const _ref_6ibppr = { fingerprintBrowser };
const _ref_wut5rh = { generateUUIDv5 };
const _ref_nen6sj = { sleep };
const _ref_m18s2l = { validateRecaptcha };
const _ref_n3j800 = { stopOscillator };
const _ref_3goioa = { updateRoutingTable };
const _ref_90kj14 = { loadTexture };
const _ref_5sogbk = { preventCSRF };
const _ref_jjxcbp = { createThread };
const _ref_wmxlho = { isFeatureEnabled };
const _ref_4ri4qs = { createPipe };
const _ref_xalzvf = { reportWarning };
const _ref_u9gsiv = { detectVideoCodec };
const _ref_4hxsc6 = { getMACAddress };
const _ref_nj7pom = { getFileAttributes };
const _ref_bzw0w2 = { resetVehicle };
const _ref_o749et = { discoverPeersDHT };
const _ref_iuji55 = { announceToTracker };
const _ref_eewmcx = { calculateLighting };
const _ref_vdvo86 = { refreshAuthToken };
const _ref_71ogx3 = { normalizeAudio };
const _ref_r0kev3 = { linkModules };
const _ref_yx6mo4 = { gaussianBlur };
const _ref_tf4gc0 = { closeSocket };
const _ref_nprlvk = { segmentImageUNet };
const _ref_tls5f0 = { watchFileChanges };
const _ref_xvawzy = { throttleRequests };
const _ref_qfaa8o = { checkBatteryLevel };
const _ref_stp1c2 = { parseMagnetLink };
const _ref_a8ps0g = { traceroute };
const _ref_3nbrac = { exitScope };
const _ref_wlyzyy = { contextSwitch };
const _ref_efl97w = { analyzeHeader };
const _ref_rl2wgv = { checkUpdate };
const _ref_1ffgi9 = { renderShadowMap };
const _ref_i1vj04 = { allocateRegisters };
const _ref_he34yi = { parseLogTopics };
const _ref_z2q3yo = { decompressGzip };
const _ref_mgb3y8 = { connectSocket };
const _ref_5clrdw = { useProgram };
const _ref_vbm3y2 = { dropTable };
const _ref_gl7a3s = { setDopplerFactor };
const _ref_r5qrz6 = { parsePayload };
const _ref_coy3pw = { dhcpRequest };
const _ref_lgtxo7 = { createMeshShape };
const _ref_24rb5s = { switchVLAN };
const _ref_bhaohd = { enableDHT };
const _ref_y5i04o = { activeTexture };
const _ref_v8fxq7 = { deriveAddress };
const _ref_w3q7be = { parseSubtitles };
const _ref_du3a55 = { downInterface };
const _ref_nq8hhw = { createAudioContext };
const _ref_tve4cs = { reassemblePacket };
const _ref_fylewt = { enterScope };
const _ref_b8qkst = { setFilePermissions };
const _ref_fm3y45 = { requestAnimationFrameLoop };
const _ref_ago92s = { setAttack };
const _ref_clf7of = { resolveDNSOverHTTPS };
const _ref_6bhgyy = { uniform1i };
const _ref_i777bc = { encapsulateFrame };
const _ref_miq82p = { execProcess };
const _ref_9s71w6 = { translateMatrix };
const _ref_auyasq = { readPipe };
const _ref_ytcknl = { triggerHapticFeedback };
const _ref_t6ueqo = { dhcpAck };
const _ref_zmdkua = { interpretBytecode };
const _ref_58zhgp = { setRatio };
const _ref_pm7ppn = { restoreDatabase };
const _ref_o0wf3e = { computeLossFunction };
const _ref_itrlmp = { setDetune };
const _ref_hzs2xw = { synthesizeSpeech };
const _ref_np6cdj = { sanitizeInput };
const _ref_j39kux = { parseM3U8Playlist };
const _ref_3a54xp = { setPosition };
const _ref_yf3f3j = { obfuscateString };
const _ref_jvcoqj = { createDirectoryRecursive };
const _ref_8yv7sr = { readPixels };
const _ref_sbs958 = { validateFormInput };
const _ref_ykvk9v = { seedRatioLimit };
const _ref_1wm5c2 = { createIndexBuffer };
const _ref_r7papd = { closeContext };
const _ref_6n78to = { generateEmbeddings };
const _ref_faphhj = { uploadCrashReport };
const _ref_scq8xq = { connectToTracker };
const _ref_u62btl = { decapsulateFrame };
const _ref_dm352o = { dhcpDiscover };
const _ref_t2rwzu = { ResourceMonitor };
const _ref_bi9zre = { registerISR };
const _ref_dg3ts6 = { applyForce };
const _ref_vvrowt = { limitDownloadSpeed };
const _ref_y4mfkp = { resolveHostName };
const _ref_cykuvd = { processAudioBuffer };
const _ref_bxyr36 = { validateTokenStructure };
const _ref_gqlwjs = { computeNormal };
const _ref_0b73sk = { syncDatabase };
const _ref_43pseh = { formatLogMessage };
const _ref_u26im2 = { broadcastMessage };
const _ref_gk9liz = { allocateDiskSpace };
const _ref_iyyx5a = { writePipe };
const _ref_67f4cq = { addGeneric6DofConstraint };
const _ref_q2qnsr = { validateSSLCert };
const _ref_ip7h9d = { monitorNetworkInterface };
const _ref_5lxy08 = { saveCheckpoint };
const _ref_i8ktys = { virtualScroll };
const _ref_ef7vb2 = { postProcessBloom };
const _ref_yrkv5c = { unloadDriver };
const _ref_vz7sqk = { streamToPlayer };
const _ref_7fgfdg = { classifySentiment };
const _ref_nk1oau = { injectMetadata };
const _ref_hdj7cb = { removeConstraint };
const _ref_xcr3t9 = { renderCanvasLayer };
const _ref_tzwcrs = { setGravity };
const _ref_acu69z = { analyzeUserBehavior };
const _ref_ei4zf6 = { convexSweepTest };
const _ref_8c2a10 = { validateIPWhitelist };
const _ref_g4sjlj = { rateLimitCheck };
const _ref_txyj07 = { killProcess };
const _ref_n5z1g0 = { calculatePieceHash };
const _ref_gxym7d = { tokenizeText };
const _ref_l7dkwo = { dhcpOffer };
const _ref_jkvb7g = { migrateSchema };
const _ref_l60grj = { installUpdate };
const _ref_fh13x1 = { rebootSystem };
const _ref_edrtd7 = { cancelAnimationFrameLoop };
const _ref_yzxfnt = { getFloatTimeDomainData };
const _ref_zk5viz = { scheduleProcess };
const _ref_sqycz8 = { ProtocolBufferHandler };
const _ref_66oaie = { getCpuLoad };
const _ref_kooptj = { setKnee };
const _ref_sp93fc = { verifyIR };
const _ref_560gea = { retryFailedSegment };
const _ref_la9fyt = { loadCheckpoint }; 
    });
})({}, {});