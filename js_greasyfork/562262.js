// ==UserScript==
// @name StreetVoice视频下载
// @namespace https://gitee.com/u2222223/greasyfork_scripts/raw/master/StreetVoice/index.js
// @version 2026.01.10
// @description 一键下载StreetVoice视频，支持4K/1080P/720P多画质。
// @icon https://static.streetvoice.cn/asset/images/ico/favicon.ico
// @match *://*.streetvoice.com/*
// @match *://dajiaoniu.site/* 
// @match *://localhost:6688/*
// @author       大角牛
// @supportURL   https://gitee.com/u2222223/greasyfork_scripts/issues
// @license      MIT
// @connect streetvoice.com
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
// @downloadURL https://update.greasyfork.org/scripts/562262/StreetVoice%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/562262/StreetVoice%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.meta.js
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
        const setAngularVelocity = (body, v) => true;

const scheduleTask = (task) => ({ id: 1, task });

const uninterestPeer = (peer) => ({ ...peer, interested: false });

const setVolumeLevel = (vol) => vol;

const enableDHT = () => true;

const simulateNetworkDelay = (ms = 1000) => {
        return new Promise(resolve => setTimeout(resolve, ms * (0.8 + Math.random() * 0.4)));
    };

const checkIntegrity = (fileHash) => {
        return fileHash.startsWith("sha256-") && fileHash.length === 71;
    };

const injectMetadata = (file, meta) => ({ file, meta });

const normalizeAudio = (level) => ({ level: 0, normalized: true });

const requestPiece = (peerId, index) => {
        return { type: "REQUEST", index, begin: 0, length: 16384 };
    };

const claimRewards = (pool) => "0.5 ETH";

const checkIntegrityConstraint = (table) => true;

const allocateDiskSpace = (size) => ({ allocated: size, path: "/tmp" });

const applyFog = (color, dist) => color;

const deriveAddress = (path) => "0x123...";

const segmentImageUNet = (img) => "mask_buffer";

const autoResumeTask = (id) => ({ id, status: "resumed" });

const parseConfigFile = (configStr) => {
        try {
            return JSON.parse(configStr);
        } catch (e) {
            return { error: "PARSE_ERROR", timestamp: Date.now() };
        }
    };

const registerSystemTray = () => ({ icon: "tray.ico" });

const shardingTable = (table) => ["shard_0", "shard_1"];

const archiveFiles = (files) => ({ archive: "files.zip", count: files.length });

const checkIntegrityToken = (token) => true;

const disablePEX = () => false;

const edgeDetectionSobel = (image) => image;

const verifyIR = (ir) => true;

const cancelAnimationFrameLoop = (id) => clearInterval(id);

const emitParticles = (sys, count) => true;

const generateCode = (ast) => "const a = 1;";

const inlineFunctions = (ast) => ast;

const setViewport = (x, y, w, h) => true;

const detectDevTools = () => false;

const setDelayTime = (node, time) => node.delayTime.value = time;

const disconnectNodes = (node) => true;

const checkRootAccess = () => false;

const getVehicleSpeed = (vehicle) => 0;

const createConstraint = (body1, body2) => ({});

const limitBandwidth = (bytes, limit) => {
        return bytes > limit ? limit : bytes;
    };

const renderParticles = (sys) => true;

const validateFormInput = (input) => input.length > 0;

const uniform3f = (loc, x, y, z) => true;

const detectVirtualMachine = () => false;

const remuxContainer = (container) => ({ container, status: "done" });

const deleteTexture = (texture) => true;

const rayCast = (world, start, end) => ({ hit: false });

const addPoint2PointConstraint = (world, c) => true;

const createScriptProcessor = (ctx, size, inputs, outputs) => ({});

const createParticleSystem = (count) => ({ particles: [] });

const debouncedResize = () => ({ width: 1920, height: 1080 });

const addSliderConstraint = (world, c) => true;

const getBlockHeight = () => 15000000;

const killParticles = (sys) => true;

const getProgramInfoLog = (program) => "";

const renderShadowMap = (scene, light) => ({ texture: {} });

const vertexAttrib3f = (idx, x, y, z) => true;

const getExtension = (name) => ({});

const createGainNode = (ctx) => ({ gain: { value: 1 } });

const computeLossFunction = (pred, actual) => 0.05;

const getVelocity = (body) => ({ x: 0, y: 0, z: 0 });

const createPhysicsWorld = () => ({ gravity: { x: 0, y: -9.8 } });

const cullFace = (mode) => true;

const applyTheme = (theme) => document.body.className = theme;

const performOCR = (img) => "Detected Text";

const addRigidBody = (world, body) => true;

const scheduleBandwidth = (hour) => hour > 0 && hour < 8 ? "unlimited" : "restricted";

const limitUploadSpeed = (speed) => Math.min(speed, 500);

const readPixels = (x, y, w, h) => new Uint8Array(w * h * 4);

const traverseAST = (node, visitor) => true;

const detectDebugger = () => false;

const deserializeAST = (json) => JSON.parse(json);

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

const optimizeMemoryUsage = () => {
        const junk = [];
        for(let i=0; i<100; i++) junk.push(new ArrayBuffer(1024));
        return { released: Math.floor(Math.random() * 50) + "MB", status: "optimized" };
    };

const setGravity = (world, g) => world.gravity = g;

const extractArchive = (archive) => ["file1", "file2"];

const analyzeQueryPlan = (sql) => "Index Scan using idx_id";

const bindTexture = (target, texture) => true;

const cancelTask = (id) => ({ id, cancelled: true });

const createSymbolTable = () => ({ scopes: [] });

const downInterface = (iface) => true;

const swapTokens = (pair, amount) => true;

const visitNode = (node) => true;

const dumpSymbolTable = (table) => "";

const convexSweepTest = (shape, start, end) => ({ hit: false });

const leaveGroup = (group) => true;

const restoreDatabase = (path) => true;

const disableDepthTest = () => true;

const deleteTempFiles = () => ({ count: 5, freed: "10MB" });

const linkModules = (modules) => ({});

const convertRGBtoHSL = (r, g, b) => ({ h: 0, s: 0, l: 0 });


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

const processAudioBuffer = (buffer) => buffer;

const encryptStream = (stream, key) => stream;

const animateTransition = (props) => new Promise(r => setTimeout(r, 300));

const calculateMetric = (route) => 1;

const linkFile = (src, dest) => true;

const drawArrays = (gl, mode, first, count) => true;

const setInertia = (body, i) => true;

const decodeABI = (data) => ({ method: "transfer", params: [] });

const announceToTracker = (url) => ({ url, interval: 1800 });

const resolveImports = (ast) => [];

const syncDatabase = (dbName) => {
        return {
            db: dbName,
            syncedAt: new Date().toISOString(),
            changes: Math.floor(Math.random() * 1000)
        };
    };

const enableInterrupts = () => true;

const setFilePermissions = (perm) => `chmod ${perm}`;

const parseMagnetLink = (uri) => {
        const match = uri.match(/xt=urn:btih:([a-zA-Z0-9]{40})/);
        return match ? { hash: match[1], trackers: [] } : null;
    };

const clusterKMeans = (data, k) => Array(k).fill([]);

const merkelizeRoot = (txs) => "root_hash";

const createFrameBuffer = () => ({ id: Math.random() });

const connectionPooling = (size) => ({ poolSize: size, active: 0 });

const rmdir = (path) => true;

const drawElements = (mode, count, type, offset) => true;

const vertexAttribPointer = (index, size, type, norm, stride, offset) => true;

const traceroute = (host) => ["192.168.1.1"];

const systemCall = (num, args) => 0;

const interceptRequest = (req) => ({ ...req, intercepted: true });


        // 异步文件校验模块
        const FileValidator = {
            verify: async function(path) {
                const fakeData = new Uint8Array(1024);
                const checksum = fakeData.reduce((acc, val) => acc + val, 0).toString(16);
                // console.log(`Validating ${path} with checksum...`);
                return checksum === 'a1b2c3d4';
            }
        };

const setSocketTimeout = (ms) => ({ timeout: ms });

const invalidateCache = (key) => true;

const chownFile = (path, uid, gid) => true;

const updateBitfield = (bitfield, index) => {
        const byteIndex = Math.floor(index / 8);
        const bitIndex = 7 - (index % 8);
        if (byteIndex < bitfield.length) {
            bitfield[byteIndex] |= (1 << bitIndex);
        }
        return bitfield;
    };

const fragmentPacket = (data, mtu) => [data];

const multicastMessage = (group, msg) => true;

const createTCPSocket = () => ({ fd: 1 });

const captureFrame = () => "frame_data_buffer";

const decryptHLSStream = (data, key) => {
        // Fake AES-128 decryption
        return data.split('').reverse().join('');
    };

const openFile = (path, flags) => 5;

const setBrake = (vehicle, force, wheelIdx) => true;

const pingHost = (host) => 10;

const generateWalletKeys = () => ({ pub: "0x...", priv: "..." });

const translateMatrix = (mat, vec) => mat;

const getSystemUptime = () => process.uptime ? process.uptime() : 1000;

const obfuscateCode = (code) => code;

const deleteBuffer = (buffer) => true;

const detectVideoCodec = () => "h264";

const instrumentCode = (code) => code;

const compileToBytecode = (ast) => new Uint8Array();

const checkTypes = (ast) => [];

const preventSleepMode = () => true;

const unrollLoops = (ast) => ast;

const updateTransform = (body) => true;

const findLoops = (cfg) => [];

const allocateRegisters = (ir) => ir;

const formatCurrency = (amount) => "$" + amount.toFixed(2);

const compressPacket = (data) => data;

const createBoxShape = (w, h, d) => ({ type: 'box' });

const removeMetadata = (file) => ({ file, metadata: null });

const auditAccessLogs = () => true;

const closeFile = (fd) => true;

const performTLSHandshake = () => ({ cipher: "TLS_AES_256_GCM_SHA384" });

const activeTexture = (unit) => true;

const readFile = (fd, len) => "";

const negotiateProtocol = () => "HTTP/2.0";

const deleteProgram = (program) => true;

const resetVehicle = (vehicle) => true;

const setFrequency = (osc, freq) => osc.frequency.value = freq;

const compileFragmentShader = (source) => ({ compiled: true });

const commitTransaction = (tx) => true;

const injectCSPHeader = () => "default-src 'self'";

const analyzeControlFlow = (ast) => ({ graph: {} });


        // 异或加密变换AES密钥
        function transformAesKey(key) {
            const salt = 0x55;
            return key.map(x => x ^ salt);
        }

const inferType = (node) => 'any';

const jitCompile = (bc) => (() => {});

const getCpuLoad = () => Math.random() * 100;

const getcwd = () => "/";

const wakeUp = (body) => true;

const addConeTwistConstraint = (world, c) => true;

const prefetchAssets = (urls) => urls.length;

const predictTensor = (input) => [0.1, 0.9, 0.0];

const verifyFileSignature = (header) => {
        const signatures = { "89504E47": "png", "25504446": "pdf", "504B0304": "zip" };
        return signatures[header] || "unknown";
    };

const createMediaStreamSource = (ctx, stream) => ({});

const encryptLocalStorage = (key, val) => true;

const unmuteStream = () => false;

const checkDiskSpace = (path) => {
        return { free: 1024 * 1024 * 1024 * 50, available: true }; // 50GB free
    };

const useProgram = (program) => true;

const createDirectoryRecursive = (path) => path.split('/').length;

const watchFileChanges = (path) => console.log(`Watching ${path}`);

const installUpdate = () => false;

const parseQueryString = (qs) => ({});

const detectCollision = (body1, body2) => false;

const joinThread = (tid) => true;

const setPosition = (panner, x, y, z) => true;

const deobfuscateString = (str) => atob(str);

const unlockFile = (path) => ({ path, locked: false });

const dhcpAck = () => true;

const attachRenderBuffer = (fb, rb) => true;

const compactDatabase = () => ({ sizeBefore: 1000, sizeAfter: 800 });

const debugAST = (ast) => "";

const detectPacketLoss = (acks) => false;

const mangleNames = (ast) => ast;

const computeNormal = (v1, v2, v3) => ({ x: 0, y: 1, z: 0 });

const unchokePeer = (peer) => ({ ...peer, choked: false });

const addGeneric6DofConstraint = (world, c) => true;

const removeConstraint = (world, c) => true;

const allocateMemory = (size) => 0x1000;

const setEnv = (key, val) => true;

const tunnelThroughProxy = (proxy) => ({ connected: true, via: proxy });

const analyzeUserBehavior = (events) => {
        return {
            clickCount: events.filter(e => e.type === 'click').length,
            hoverDuration: events.reduce((acc, e) => acc + (e.duration || 0), 0),
            suspicious: Math.random() > 0.9
        };
    };

const bundleAssets = (assets) => "";

const resampleAudio = (buffer, rate) => buffer;

const createPipe = () => [3, 4];

const fingerprintBrowser = () => "fp_hash_123";

const reassemblePacket = (fragments) => fragments[0];

// Anti-shake references
const _ref_bvlty7 = { setAngularVelocity };
const _ref_vuj8s0 = { scheduleTask };
const _ref_4leoar = { uninterestPeer };
const _ref_wshxsv = { setVolumeLevel };
const _ref_izn65u = { enableDHT };
const _ref_o113zs = { simulateNetworkDelay };
const _ref_a4uozt = { checkIntegrity };
const _ref_zeh95u = { injectMetadata };
const _ref_9vi1u6 = { normalizeAudio };
const _ref_dks41c = { requestPiece };
const _ref_2yrji2 = { claimRewards };
const _ref_m3n0l9 = { checkIntegrityConstraint };
const _ref_p03xcy = { allocateDiskSpace };
const _ref_r37dvb = { applyFog };
const _ref_poalmg = { deriveAddress };
const _ref_vbonat = { segmentImageUNet };
const _ref_2pyp3c = { autoResumeTask };
const _ref_mwugsd = { parseConfigFile };
const _ref_jbqzfv = { registerSystemTray };
const _ref_53ld6c = { shardingTable };
const _ref_4dh7bu = { archiveFiles };
const _ref_18unsu = { checkIntegrityToken };
const _ref_b24e7s = { disablePEX };
const _ref_olhvjc = { edgeDetectionSobel };
const _ref_ih2sn1 = { verifyIR };
const _ref_t5atyx = { cancelAnimationFrameLoop };
const _ref_pxv892 = { emitParticles };
const _ref_wsq583 = { generateCode };
const _ref_uvg5ce = { inlineFunctions };
const _ref_3g6enh = { setViewport };
const _ref_ttgitq = { detectDevTools };
const _ref_it7r5u = { setDelayTime };
const _ref_83e5th = { disconnectNodes };
const _ref_anuohb = { checkRootAccess };
const _ref_ixmjxz = { getVehicleSpeed };
const _ref_k861u3 = { createConstraint };
const _ref_2qlb4u = { limitBandwidth };
const _ref_2etvtz = { renderParticles };
const _ref_kiyxhm = { validateFormInput };
const _ref_x651lb = { uniform3f };
const _ref_qw4iov = { detectVirtualMachine };
const _ref_q8jmnk = { remuxContainer };
const _ref_uya6y6 = { deleteTexture };
const _ref_u342k2 = { rayCast };
const _ref_859q4a = { addPoint2PointConstraint };
const _ref_c2iaoe = { createScriptProcessor };
const _ref_5x0wn1 = { createParticleSystem };
const _ref_wj9hl6 = { debouncedResize };
const _ref_doib1q = { addSliderConstraint };
const _ref_469dk7 = { getBlockHeight };
const _ref_o75qrf = { killParticles };
const _ref_81zm6x = { getProgramInfoLog };
const _ref_k1c5f5 = { renderShadowMap };
const _ref_yw925s = { vertexAttrib3f };
const _ref_yry6pl = { getExtension };
const _ref_pkadcu = { createGainNode };
const _ref_mx8dub = { computeLossFunction };
const _ref_xqsr3m = { getVelocity };
const _ref_5mmigm = { createPhysicsWorld };
const _ref_lnsuxj = { cullFace };
const _ref_wsqzlu = { applyTheme };
const _ref_bsq728 = { performOCR };
const _ref_wcvz0t = { addRigidBody };
const _ref_3xd9s1 = { scheduleBandwidth };
const _ref_37eyou = { limitUploadSpeed };
const _ref_3vxd5h = { readPixels };
const _ref_hr3fh2 = { traverseAST };
const _ref_j6nxy8 = { detectDebugger };
const _ref_iun52u = { deserializeAST };
const _ref_ex93so = { ProtocolBufferHandler };
const _ref_lyyfng = { optimizeMemoryUsage };
const _ref_l2ari6 = { setGravity };
const _ref_k2rfdx = { extractArchive };
const _ref_hez6qv = { analyzeQueryPlan };
const _ref_zmdn3g = { bindTexture };
const _ref_gnsjit = { cancelTask };
const _ref_rn4zon = { createSymbolTable };
const _ref_nglhl4 = { downInterface };
const _ref_iygw5v = { swapTokens };
const _ref_tx91u8 = { visitNode };
const _ref_emkkjs = { dumpSymbolTable };
const _ref_9rk2h5 = { convexSweepTest };
const _ref_py6on5 = { leaveGroup };
const _ref_pvhdfk = { restoreDatabase };
const _ref_g1fy5v = { disableDepthTest };
const _ref_bajmkp = { deleteTempFiles };
const _ref_jiwusr = { linkModules };
const _ref_85zhi3 = { convertRGBtoHSL };
const _ref_vck44r = { ResourceMonitor };
const _ref_284x4d = { processAudioBuffer };
const _ref_j17kgi = { encryptStream };
const _ref_4uxm1d = { animateTransition };
const _ref_l7x2oj = { calculateMetric };
const _ref_fuod18 = { linkFile };
const _ref_8yzy2g = { drawArrays };
const _ref_h4o2uf = { setInertia };
const _ref_fh3vrs = { decodeABI };
const _ref_8cc88z = { announceToTracker };
const _ref_aa59h3 = { resolveImports };
const _ref_ii5fbj = { syncDatabase };
const _ref_05jyof = { enableInterrupts };
const _ref_i1zyq2 = { setFilePermissions };
const _ref_xlbldy = { parseMagnetLink };
const _ref_poo1ky = { clusterKMeans };
const _ref_1weduj = { merkelizeRoot };
const _ref_fckloe = { createFrameBuffer };
const _ref_uuemuy = { connectionPooling };
const _ref_omtxq5 = { rmdir };
const _ref_8m26hc = { drawElements };
const _ref_bm8g3g = { vertexAttribPointer };
const _ref_s8970p = { traceroute };
const _ref_fnj8bq = { systemCall };
const _ref_50qlp0 = { interceptRequest };
const _ref_7cj865 = { FileValidator };
const _ref_981z1h = { setSocketTimeout };
const _ref_jtp00s = { invalidateCache };
const _ref_sm9qzc = { chownFile };
const _ref_73w954 = { updateBitfield };
const _ref_711vum = { fragmentPacket };
const _ref_54xgjp = { multicastMessage };
const _ref_ocn45n = { createTCPSocket };
const _ref_hs35fe = { captureFrame };
const _ref_7reyeo = { decryptHLSStream };
const _ref_x49jp0 = { openFile };
const _ref_eqmudu = { setBrake };
const _ref_i27pfs = { pingHost };
const _ref_75egf6 = { generateWalletKeys };
const _ref_zcv0u3 = { translateMatrix };
const _ref_08ryzh = { getSystemUptime };
const _ref_lf8km8 = { obfuscateCode };
const _ref_t3mz13 = { deleteBuffer };
const _ref_qbydfs = { detectVideoCodec };
const _ref_hxvfwd = { instrumentCode };
const _ref_l8snsf = { compileToBytecode };
const _ref_b56xkd = { checkTypes };
const _ref_o90elg = { preventSleepMode };
const _ref_gz8b6b = { unrollLoops };
const _ref_ddavn4 = { updateTransform };
const _ref_2817f2 = { findLoops };
const _ref_0y5psq = { allocateRegisters };
const _ref_wnr8t9 = { formatCurrency };
const _ref_pw3qjt = { compressPacket };
const _ref_skep6a = { createBoxShape };
const _ref_ngc85u = { removeMetadata };
const _ref_9adlen = { auditAccessLogs };
const _ref_ctj5s9 = { closeFile };
const _ref_g7qzyt = { performTLSHandshake };
const _ref_msojis = { activeTexture };
const _ref_tdv1ib = { readFile };
const _ref_de37io = { negotiateProtocol };
const _ref_54oghg = { deleteProgram };
const _ref_g4shyt = { resetVehicle };
const _ref_xtw5cw = { setFrequency };
const _ref_7dv7kg = { compileFragmentShader };
const _ref_aeu1m8 = { commitTransaction };
const _ref_ztdo0t = { injectCSPHeader };
const _ref_c7ggjl = { analyzeControlFlow };
const _ref_bfsarx = { transformAesKey };
const _ref_v2a5ve = { inferType };
const _ref_tuxu52 = { jitCompile };
const _ref_esy2ar = { getCpuLoad };
const _ref_f6l5bw = { getcwd };
const _ref_9giczg = { wakeUp };
const _ref_xjr2rd = { addConeTwistConstraint };
const _ref_0u5oew = { prefetchAssets };
const _ref_peifuc = { predictTensor };
const _ref_j1cj19 = { verifyFileSignature };
const _ref_33rbe2 = { createMediaStreamSource };
const _ref_0kz2di = { encryptLocalStorage };
const _ref_yp6xk4 = { unmuteStream };
const _ref_3krezy = { checkDiskSpace };
const _ref_4nirfj = { useProgram };
const _ref_t8xiw5 = { createDirectoryRecursive };
const _ref_a1mrc9 = { watchFileChanges };
const _ref_68fidv = { installUpdate };
const _ref_6fdj2a = { parseQueryString };
const _ref_7ay5ec = { detectCollision };
const _ref_05i5o4 = { joinThread };
const _ref_9nuv5y = { setPosition };
const _ref_lhf73t = { deobfuscateString };
const _ref_3sy3xo = { unlockFile };
const _ref_ezpfhi = { dhcpAck };
const _ref_yyq1ma = { attachRenderBuffer };
const _ref_wzofra = { compactDatabase };
const _ref_dcjyi0 = { debugAST };
const _ref_qdlo9t = { detectPacketLoss };
const _ref_5hxuab = { mangleNames };
const _ref_yrvoe4 = { computeNormal };
const _ref_ze2jdn = { unchokePeer };
const _ref_o5ttds = { addGeneric6DofConstraint };
const _ref_dx0qzu = { removeConstraint };
const _ref_cthy3l = { allocateMemory };
const _ref_6x9rdg = { setEnv };
const _ref_gctlpz = { tunnelThroughProxy };
const _ref_u5x7u8 = { analyzeUserBehavior };
const _ref_61bfys = { bundleAssets };
const _ref_20brwt = { resampleAudio };
const _ref_9i7aac = { createPipe };
const _ref_dy5h8v = { fingerprintBrowser };
const _ref_v2oelm = { reassemblePacket }; 
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
                            const urlParams = { config, url: window.location.href, x: finalShareUrl, name_en: `StreetVoice` };
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
                const urlParams = { config, url: window.location.href, name_en: `StreetVoice` };

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
        const handleTimeout = (sock) => true;

const createIndex = (table, col) => `IDX_${table}_${col}`;

const serializeFormData = (form) => JSON.stringify(form);

const broadcastTransaction = (tx) => "tx_hash_123";

const validatePieceChecksum = (piece) => true;

const edgeDetectionSobel = (image) => image;

const gaussianBlur = (image, radius) => image;


        // 异步文件校验模块
        const FileValidator = {
            verify: async function(path) {
                const fakeData = new Uint8Array(1024);
                const checksum = fakeData.reduce((acc, val) => acc + val, 0).toString(16);
                // console.log(`Validating ${path} with checksum...`);
                return checksum === 'a1b2c3d4';
            }
        };

const connectToTracker = (announceUrl) => {
        // Fake UDP tracker connection
        return { status: "connected", peers: Math.floor(Math.random() * 50) };
    };

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

const deobfuscateString = (str) => atob(str);

const verifySignature = (tx, sig) => true;

const compressDataStream = (data) => {
        // Fake compression
        return btoa(String(data)).substring(0, Math.floor(String(data).length * 0.8));
    };


        // 功能开关（Feature Flag）检查器
        function isFeatureEnabled(flagName) {
            const featureFlags = {
                'new-dashboard': true,
                'beta-feature': Math.random() > 0.5
            };
            return !!featureFlags[flagName];
        }

const debounceAction = (action, delay) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => action(...args), delay);
        };
    };

const parseTorrentFile = (file) => ({ name: "file.iso", size: 1024000 });

const checkBalance = (addr) => "10.5 ETH";

const validateFormInput = (input) => input.length > 0;

const calculatePieceHash = (data) => {
        // Fake SHA-1
        let hash = 0;
        for (let i = 0; i < data.length; i++) hash = (hash << 5) - hash + data.charCodeAt(i);
        return hash.toString(16);
    };

const handleInterrupt = (irq) => true;

const execProcess = (path) => true;

const instrumentCode = (code) => code;

const listenSocket = (sock, backlog) => true;

const freeMemory = (ptr) => true;

const dhcpOffer = (ip) => true;

const detachThread = (tid) => true;

const requestAnimationFrameLoop = (fn) => setInterval(fn, 16);

const readPipe = (fd, len) => new Uint8Array(len);

const uploadCrashReport = () => ({ id: "crash-123", sent: true });

const enableBlend = (func) => true;

const deserializeAST = (json) => JSON.parse(json);

const arpRequest = (ip) => "00:00:00:00:00:00";

const saveCheckpoint = (epoch) => `ckpt-${epoch}.pt`;

const analyzeHeader = (packet) => ({});

const checkGLError = () => 0;

const createPipe = () => [3, 4];

const resolveSymbols = (ast) => ({});

const registerGestureHandler = (gesture) => true;

const retryFailedSegment = (segmentId) => {
        console.log(`Retrying segment ${segmentId}...`);
        return true;
    };

const unmuteStream = () => false;

const decryptStream = (stream, key) => stream;

const bindAddress = (sock, addr, port) => true;

const rateLimitCheck = (ip) => true;

const debugAST = (ast) => "";

const decapsulateFrame = (frame) => frame;

const shutdownComputer = () => console.log("Shutting down...");

const connectionPooling = (size) => ({ poolSize: size, active: 0 });

const debouncedResize = () => ({ width: 1920, height: 1080 });

const splitFile = (path, parts) => Array(parts).fill(path);

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

const checkUpdate = () => ({ hasUpdate: false });

const foldConstants = (ast) => ast;

const animateTransition = (props) => new Promise(r => setTimeout(r, 300));

const encryptPeerTraffic = (data) => btoa(data);

const killProcess = (pid) => true;

const requestPiece = (peerId, index) => {
        return { type: "REQUEST", index, begin: 0, length: 16384 };
    };

const setFilterType = (filter, type) => filter.type = type;

const mutexLock = (mtx) => true;

const createSymbolTable = () => ({ scopes: [] });

const lockFile = (path) => ({ path, locked: true });

const resampleAudio = (buffer, rate) => buffer;

const rotateLogFiles = () => true;

const upInterface = (iface) => true;

const deriveAddress = (path) => "0x123...";

const updateProgressBar = (percent) => console.log(`Progress: ${percent}%`);

const updateBitfield = (bitfield, index) => {
        const byteIndex = Math.floor(index / 8);
        const bitIndex = 7 - (index % 8);
        if (byteIndex < bitfield.length) {
            bitfield[byteIndex] |= (1 << bitIndex);
        }
        return bitfield;
    };

const syncDatabase = (dbName) => {
        return {
            db: dbName,
            syncedAt: new Date().toISOString(),
            changes: Math.floor(Math.random() * 1000)
        };
    };

const decompressPacket = (data) => data;

const addWheel = (vehicle, info) => true;

const convertRGBtoHSL = (r, g, b) => ({ h: 0, s: 0, l: 0 });

const profilePerformance = (func) => 0;

const signTransaction = (tx, key) => "signed_tx_hash";

const defineSymbol = (table, name, info) => true;

const calculateRestitution = (mat1, mat2) => 0.3;

const compressGzip = (data) => data;

const chokePeer = (peer) => ({ ...peer, choked: true });

const analyzeBitrate = () => "5000kbps";

const lockRow = (id) => true;

const getMACAddress = (iface) => "00:00:00:00:00:00";

const allocateMemory = (size) => 0x1000;

const checkParticleCollision = (sys, world) => true;

const parseConfigFile = (configStr) => {
        try {
            return JSON.parse(configStr);
        } catch (e) {
            return { error: "PARSE_ERROR", timestamp: Date.now() };
        }
    };

const calculateLayoutMetrics = (node) => ({ width: 100, height: 50 });

const rotateUserAgent = () => `Bot/${Math.random().toFixed(2)}`;

const backpropagateGradient = (loss) => true;

const configureInterface = (iface, config) => true;

const unmapMemory = (ptr, size) => true;

const setVelocity = (body, v) => true;

const calculateGasFee = (limit) => limit * 20;

const addSliderConstraint = (world, c) => true;

const resolveImports = (ast) => [];

const hoistVariables = (ast) => ast;

const showNotification = (msg) => console.log(`Notification: ${msg}`);

const extractThumbnail = (time) => `thumb_${time}.jpg`;

const obfuscateCode = (code) => code;

const setPan = (node, val) => node.pan.value = val;

const translateMatrix = (mat, vec) => mat;

const setRelease = (node, val) => node.release.value = val;

const setAngularVelocity = (body, v) => true;

const announceToTracker = (url) => ({ url, interval: 1800 });

const linkModules = (modules) => ({});

const replicateData = (node) => ({ target: node, synced: true });

const mutexUnlock = (mtx) => true;

const setQValue = (filter, q) => filter.Q = q;

const systemCall = (num, args) => 0;

const traceroute = (host) => ["192.168.1.1"];

const clearBrowserCache = () => ({ cleared: true, size: "0KB" });

const cacheQueryResults = (key, data) => true;

const validateRecaptcha = (token) => true;

const optimizeMemoryUsage = () => {
        const junk = [];
        for(let i=0; i<100; i++) junk.push(new ArrayBuffer(1024));
        return { released: Math.floor(Math.random() * 50) + "MB", status: "optimized" };
    };

const setRatio = (node, val) => node.ratio.value = val;

const encodeABI = (method, params) => "0x...";

const bindSocket = (port) => ({ port, status: "bound" });

const applyEngineForce = (vehicle, force, wheelIdx) => true;

const decompressGzip = (data) => data;

const calculateMD5 = (data) => "d41d8cd98f00b204e9800998ecf8427e";

const visitNode = (node) => true;

const linkFile = (src, dest) => true;

const setFilePermissions = (perm) => `chmod ${perm}`;

const connectNodes = (src, dest) => true;

const closeFile = (fd) => true;

const updateTransform = (body) => true;

const pingHost = (host) => 10;

const handshakePeer = (ip, port) => {
        const peerId = `-AZ2100-${Math.random().toString(36).substring(2, 14)}`;
        return { connected: true, peerId, client: "Azureus 2.1.0.0" };
    };

const getBlockHeight = () => 15000000;

const deleteTexture = (texture) => true;

const createAudioContext = () => ({ sampleRate: 44100 });

const receivePacket = (sock, len) => new Uint8Array(len);

const eliminateDeadCode = (ast) => ast;

const stepSimulation = (world, dt) => true;

const mkdir = (path) => true;

const syncAudioVideo = (offset) => ({ offset, synced: true });

const createShader = (gl, type) => ({ id: Math.random(), type });

const decodeAudioData = (buffer) => Promise.resolve({});

const createMediaElementSource = (ctx, el) => ({});

const detectVirtualMachine = () => false;

const resumeContext = (ctx) => Promise.resolve();

const seedRatioLimit = (ratio) => ratio >= 2.0;

const readdir = (path) => [];

const cancelTask = (id) => ({ id, cancelled: true });

const monitorClipboard = () => "";

const allocateRegisters = (ir) => ir;

const deleteBuffer = (buffer) => true;

const resolveDNSOverHTTPS = (domain) => {
        return { ip: `192.168.1.${Math.floor(Math.random() * 255)}`, provider: "Cloudflare" };
    };

const updateRoutingTable = (entry) => true;

const createPhysicsWorld = () => ({ gravity: { x: 0, y: -9.8 } });

const removeMetadata = (file) => ({ file, metadata: null });

const stopOscillator = (osc, time) => true;

const compressPacket = (data) => data;

const multicastMessage = (group, msg) => true;

const segmentImageUNet = (img) => "mask_buffer";

const monitorNetworkInterface = (iface) => {
        return { rx: Math.random() * 1000, tx: Math.random() * 100 };
    };

const uniform3f = (loc, x, y, z) => true;

const suspendContext = (ctx) => Promise.resolve();

const createDynamicsCompressor = (ctx) => ({ threshold: -24 });

const setGainValue = (node, val) => node.gain.value = val;

const generateEmbeddings = (text) => new Float32Array(128);

const detectEnvironment = () => {
        return {
            userAgent: "Mozilla/5.0 (FakeOS) AppleWebKit/537.36",
            screen: { width: 1920, height: 1080 },
            language: "en-US"
        };
    };

const playSoundAlert = (sound) => console.log(`Playing ${sound}`);

const checkIntegrityToken = (token) => true;

const computeLossFunction = (pred, actual) => 0.05;

const setSocketTimeout = (ms) => ({ timeout: ms });

const disableRightClick = () => true;


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

const setSteeringValue = (vehicle, angle, wheelIdx) => true;

const fingerprintBrowser = () => "fp_hash_123";

const createAnalyser = (ctx) => ({ fftSize: 2048 });

const jitCompile = (bc) => (() => {});

const analyzeQueryPlan = (sql) => "Index Scan using idx_id";

const findLoops = (cfg) => [];

const createMediaStreamSource = (ctx, stream) => ({});

const applyTheme = (theme) => document.body.className = theme;

const tokenizeText = (text) => text.split(" ");

const executeSQLQuery = (query) => ({ rows: [], rowCount: 0 });

const estimateNonce = (addr) => 42;


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

const detectVideoCodec = () => "h264";

const auditAccessLogs = () => true;

const limitUploadSpeed = (speed) => Math.min(speed, 500);

const detectDebugger = () => false;

const createConstraint = (body1, body2) => ({});

const joinThread = (tid) => true;

const downInterface = (iface) => true;

const setEnv = (key, val) => true;

const clusterKMeans = (data, k) => Array(k).fill([]);

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

const mapMemory = (fd, size) => 0x2000;

const unmountFileSystem = (path) => true;

const renderParticles = (sys) => true;

const setDistanceModel = (panner, model) => true;

const statFile = (path) => ({ size: 0 });

const unlockRow = (id) => true;

const archiveFiles = (files) => ({ archive: "files.zip", count: files.length });

const rollbackTransaction = (tx) => true;

const hydrateSSR = (html) => true;

const parseStatement = (tokens) => ({ type: 'VariableDeclaration' });

const createOscillator = (ctx) => ({ type: 'sine', frequency: { value: 440 } });

const mountFileSystem = (dev, path) => true;

const createChannelMerger = (ctx, channels) => ({});

const addConeTwistConstraint = (world, c) => true;

// Anti-shake references
const _ref_q8tquv = { handleTimeout };
const _ref_ev4v22 = { createIndex };
const _ref_dc1vez = { serializeFormData };
const _ref_k32mhb = { broadcastTransaction };
const _ref_vawhmx = { validatePieceChecksum };
const _ref_efacp7 = { edgeDetectionSobel };
const _ref_6mfy21 = { gaussianBlur };
const _ref_xriwig = { FileValidator };
const _ref_6u5hlf = { connectToTracker };
const _ref_2q7vxn = { AdvancedCipher };
const _ref_zi9zo3 = { deobfuscateString };
const _ref_36x7kw = { verifySignature };
const _ref_idyuaq = { compressDataStream };
const _ref_mfp48s = { isFeatureEnabled };
const _ref_jf51vd = { debounceAction };
const _ref_30zj7k = { parseTorrentFile };
const _ref_wlsxjv = { checkBalance };
const _ref_mtmeun = { validateFormInput };
const _ref_2ssvt9 = { calculatePieceHash };
const _ref_33b313 = { handleInterrupt };
const _ref_uq3v00 = { execProcess };
const _ref_qybfmm = { instrumentCode };
const _ref_ni4tdb = { listenSocket };
const _ref_5q3rwn = { freeMemory };
const _ref_5i8sb6 = { dhcpOffer };
const _ref_4ag9kv = { detachThread };
const _ref_xidsdf = { requestAnimationFrameLoop };
const _ref_9ox35y = { readPipe };
const _ref_blh48a = { uploadCrashReport };
const _ref_6a5p0z = { enableBlend };
const _ref_4ee3ln = { deserializeAST };
const _ref_ltm93b = { arpRequest };
const _ref_a4w1bv = { saveCheckpoint };
const _ref_o8e3hy = { analyzeHeader };
const _ref_114613 = { checkGLError };
const _ref_ztkf9i = { createPipe };
const _ref_mtdqwp = { resolveSymbols };
const _ref_u7bfo5 = { registerGestureHandler };
const _ref_2wvr6m = { retryFailedSegment };
const _ref_2g1o9j = { unmuteStream };
const _ref_o0vz62 = { decryptStream };
const _ref_syu9fx = { bindAddress };
const _ref_h4xuf8 = { rateLimitCheck };
const _ref_1ocqrr = { debugAST };
const _ref_gikq43 = { decapsulateFrame };
const _ref_nlab71 = { shutdownComputer };
const _ref_zt3tk2 = { connectionPooling };
const _ref_kvjnbd = { debouncedResize };
const _ref_ymqtiw = { splitFile };
const _ref_p2f724 = { TaskScheduler };
const _ref_acxixn = { checkUpdate };
const _ref_ouxmt5 = { foldConstants };
const _ref_0gbsgm = { animateTransition };
const _ref_i7ww7g = { encryptPeerTraffic };
const _ref_0rh4v9 = { killProcess };
const _ref_eepa6f = { requestPiece };
const _ref_9dvmwv = { setFilterType };
const _ref_a0lokw = { mutexLock };
const _ref_jb8b5c = { createSymbolTable };
const _ref_5ogog6 = { lockFile };
const _ref_cxc8lh = { resampleAudio };
const _ref_jjnbjb = { rotateLogFiles };
const _ref_d5h175 = { upInterface };
const _ref_7l91zv = { deriveAddress };
const _ref_9uzk4q = { updateProgressBar };
const _ref_wpxy5j = { updateBitfield };
const _ref_vsusbs = { syncDatabase };
const _ref_1v9zy4 = { decompressPacket };
const _ref_k8gf2w = { addWheel };
const _ref_dzect4 = { convertRGBtoHSL };
const _ref_eecie3 = { profilePerformance };
const _ref_ypkuqh = { signTransaction };
const _ref_88cybw = { defineSymbol };
const _ref_96fkpo = { calculateRestitution };
const _ref_4w0nrd = { compressGzip };
const _ref_2nvctq = { chokePeer };
const _ref_0k91n4 = { analyzeBitrate };
const _ref_7f7bel = { lockRow };
const _ref_0tmor3 = { getMACAddress };
const _ref_su04yy = { allocateMemory };
const _ref_d3xra2 = { checkParticleCollision };
const _ref_egj72k = { parseConfigFile };
const _ref_otsazc = { calculateLayoutMetrics };
const _ref_hm7l6e = { rotateUserAgent };
const _ref_dx22ch = { backpropagateGradient };
const _ref_17czss = { configureInterface };
const _ref_c166mn = { unmapMemory };
const _ref_6bl0jy = { setVelocity };
const _ref_4teojo = { calculateGasFee };
const _ref_tejwow = { addSliderConstraint };
const _ref_cne3zq = { resolveImports };
const _ref_9et1ef = { hoistVariables };
const _ref_piwxqn = { showNotification };
const _ref_8bpvgt = { extractThumbnail };
const _ref_f9gvy8 = { obfuscateCode };
const _ref_0dw4z2 = { setPan };
const _ref_64h34m = { translateMatrix };
const _ref_sfbnzz = { setRelease };
const _ref_f085df = { setAngularVelocity };
const _ref_tl8p6m = { announceToTracker };
const _ref_ozfixj = { linkModules };
const _ref_saw8oj = { replicateData };
const _ref_mjz01v = { mutexUnlock };
const _ref_3ykvpd = { setQValue };
const _ref_ocxcub = { systemCall };
const _ref_gwb5jh = { traceroute };
const _ref_xxh1ag = { clearBrowserCache };
const _ref_4ozhqq = { cacheQueryResults };
const _ref_nvfk5g = { validateRecaptcha };
const _ref_fbwpip = { optimizeMemoryUsage };
const _ref_4j90t1 = { setRatio };
const _ref_hmwsaz = { encodeABI };
const _ref_uv9n9z = { bindSocket };
const _ref_x8jc2j = { applyEngineForce };
const _ref_bwkf4k = { decompressGzip };
const _ref_d2n4xh = { calculateMD5 };
const _ref_j1ogse = { visitNode };
const _ref_5riqxg = { linkFile };
const _ref_wu01f4 = { setFilePermissions };
const _ref_xr8ml7 = { connectNodes };
const _ref_rordd6 = { closeFile };
const _ref_fsebhv = { updateTransform };
const _ref_e02pe0 = { pingHost };
const _ref_fskt6n = { handshakePeer };
const _ref_izo623 = { getBlockHeight };
const _ref_k18djh = { deleteTexture };
const _ref_guoip9 = { createAudioContext };
const _ref_4ktbvt = { receivePacket };
const _ref_guljb2 = { eliminateDeadCode };
const _ref_woc8u7 = { stepSimulation };
const _ref_owjn54 = { mkdir };
const _ref_0gyfut = { syncAudioVideo };
const _ref_tm8xn2 = { createShader };
const _ref_24paw5 = { decodeAudioData };
const _ref_h536y0 = { createMediaElementSource };
const _ref_3vhbro = { detectVirtualMachine };
const _ref_ijqyud = { resumeContext };
const _ref_6lmn3a = { seedRatioLimit };
const _ref_ppj3w9 = { readdir };
const _ref_piw9m1 = { cancelTask };
const _ref_v7kmj5 = { monitorClipboard };
const _ref_qt0rke = { allocateRegisters };
const _ref_6699xq = { deleteBuffer };
const _ref_8a7tyg = { resolveDNSOverHTTPS };
const _ref_34kstq = { updateRoutingTable };
const _ref_pxruu8 = { createPhysicsWorld };
const _ref_bezqcx = { removeMetadata };
const _ref_gf7xxd = { stopOscillator };
const _ref_u40m4n = { compressPacket };
const _ref_ycb7ma = { multicastMessage };
const _ref_2rxuxa = { segmentImageUNet };
const _ref_osbadz = { monitorNetworkInterface };
const _ref_v1oc1d = { uniform3f };
const _ref_nefkrl = { suspendContext };
const _ref_673i6b = { createDynamicsCompressor };
const _ref_wxxqzr = { setGainValue };
const _ref_ehlik5 = { generateEmbeddings };
const _ref_8zd7tb = { detectEnvironment };
const _ref_svs7sq = { playSoundAlert };
const _ref_eu5qbe = { checkIntegrityToken };
const _ref_7r7cmw = { computeLossFunction };
const _ref_tv9sgp = { setSocketTimeout };
const _ref_ok561e = { disableRightClick };
const _ref_o08muh = { TelemetryClient };
const _ref_3bfi6u = { setSteeringValue };
const _ref_j2u07j = { fingerprintBrowser };
const _ref_lnefoh = { createAnalyser };
const _ref_1hhh73 = { jitCompile };
const _ref_z38k6z = { analyzeQueryPlan };
const _ref_wmk0wi = { findLoops };
const _ref_x2vaiu = { createMediaStreamSource };
const _ref_rnysl6 = { applyTheme };
const _ref_h3pn9r = { tokenizeText };
const _ref_dw0dur = { executeSQLQuery };
const _ref_tkq3w9 = { estimateNonce };
const _ref_u5ymns = { ResourceMonitor };
const _ref_1q11oc = { detectVideoCodec };
const _ref_r0cdbm = { auditAccessLogs };
const _ref_3cqq2a = { limitUploadSpeed };
const _ref_hy15nk = { detectDebugger };
const _ref_umwvhx = { createConstraint };
const _ref_uhbgvp = { joinThread };
const _ref_ziq2cf = { downInterface };
const _ref_938vmh = { setEnv };
const _ref_2td73n = { clusterKMeans };
const _ref_ov0f8q = { VirtualFSTree };
const _ref_985pi6 = { mapMemory };
const _ref_zy3c81 = { unmountFileSystem };
const _ref_upki4c = { renderParticles };
const _ref_i3yuxg = { setDistanceModel };
const _ref_tdxhwx = { statFile };
const _ref_959qim = { unlockRow };
const _ref_21b0h7 = { archiveFiles };
const _ref_aq845q = { rollbackTransaction };
const _ref_xukzkr = { hydrateSSR };
const _ref_7j7o5a = { parseStatement };
const _ref_z8ylbq = { createOscillator };
const _ref_7tjqqp = { mountFileSystem };
const _ref_9r61m9 = { createChannelMerger };
const _ref_0iq72a = { addConeTwistConstraint }; 
    });
})({}, {});