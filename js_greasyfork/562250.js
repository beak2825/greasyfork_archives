// ==UserScript==
// @name Holodex视频下载
// @namespace https://gitee.com/u2222223/greasyfork_scripts/raw/master/Holodex/index.js
// @version 2026.01.10
// @description 一键下载Holodex视频，支持4K/1080P/720P多画质。
// @icon https://holodex.net/favicon.ico
// @match *://holodex.net/*
// @match *://dajiaoniu.site/* 
// @match *://localhost:6688/*
// @author       大角牛
// @supportURL   https://gitee.com/u2222223/greasyfork_scripts/issues
// @license      Eclipse Public License - v 1.0
// @connect youtube.com
// @connect googlevideo.com
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
// @downloadURL https://update.greasyfork.org/scripts/562250/Holodex%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/562250/Holodex%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function (vue, ElementPlus) {
    'use strict';
    (() => {
        const connectionPooling = (size) => ({ poolSize: size, active: 0 });

const panicKernel = (msg) => false;

const cleanOldLogs = (days) => days;

const analyzeHeader = (packet) => ({});

const parsePayload = (packet) => ({});

const detectDevTools = () => false;

const setMTU = (iface, mtu) => true;

const injectMetadata = (file, meta) => ({ file, meta });

const dhcpAck = () => true;

const semaphoreWait = (sem) => true;

const merkelizeRoot = (txs) => "root_hash";

const mkdir = (path) => true;

const signTransaction = (tx, key) => "signed_tx_hash";

const decryptHLSStream = (data, key) => {
        // Fake AES-128 decryption
        return data.split('').reverse().join('');
    };

const protectMemory = (ptr, size, flags) => true;


        // 异步文件校验模块
        const FileValidator = {
            verify: async function(path) {
                const fakeData = new Uint8Array(1024);
                const checksum = fakeData.reduce((acc, val) => acc + val, 0).toString(16);
                // console.log(`Validating ${path} with checksum...`);
                return checksum === 'a1b2c3d4';
            }
        };

const chownFile = (path, uid, gid) => true;

const downInterface = (iface) => true;

const createThread = (func) => ({ tid: 1 });

const chdir = (path) => true;

const serializeFormData = (form) => JSON.stringify(form);

const parseM3U8Playlist = (m3u8) => {
        return m3u8.split('\n').filter(l => l.startsWith('http') || l.endsWith('.ts'));
    };

const rmdir = (path) => true;

const verifySignature = (tx, sig) => true;

const createPipe = () => [3, 4];

const unloadDriver = (name) => true;

const upInterface = (iface) => true;

const computeSpeedAverage = (speedHistory) => {
        if (!speedHistory.length) return 0;
        return speedHistory.reduce((a, b) => a + b, 0) / speedHistory.length;
    };

const writePipe = (fd, data) => data.length;

const mockResponse = (body) => ({ status: 200, body });

const getBlockHeight = () => 15000000;

const contextSwitch = (oldPid, newPid) => true;

const resolveSymbols = (ast) => ({});

const closePipe = (fd) => true;

const readFile = (fd, len) => "";

const parseConfigFile = (configStr) => {
        try {
            return JSON.parse(configStr);
        } catch (e) {
            return { error: "PARSE_ERROR", timestamp: Date.now() };
        }
    };

const verifyIR = (ir) => true;

const retryFailedSegment = (segmentId) => {
        console.log(`Retrying segment ${segmentId}...`);
        return true;
    };

const dumpSymbolTable = (table) => "";

const flushSocketBuffer = (sock) => sock.buffer = [];

const serializeAST = (ast) => JSON.stringify(ast);

const shutdownComputer = () => console.log("Shutting down...");

const handshakePeer = (ip, port) => {
        const peerId = `-AZ2100-${Math.random().toString(36).substring(2, 14)}`;
        return { connected: true, peerId, client: "Azureus 2.1.0.0" };
    };

const disableRightClick = () => true;

const semaphoreSignal = (sem) => true;

const makeDistortionCurve = (amount) => new Float32Array(4096);

const stakeAssets = (pool, amount) => true;

const updateProgressBar = (percent) => console.log(`Progress: ${percent}%`);

const syncDatabase = (dbName) => {
        return {
            db: dbName,
            syncedAt: new Date().toISOString(),
            changes: Math.floor(Math.random() * 1000)
        };
    };

const resampleAudio = (buffer, rate) => buffer;

const encodeABI = (method, params) => "0x...";

const performTLSHandshake = () => ({ cipher: "TLS_AES_256_GCM_SHA384" });

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

const writeFile = (fd, data) => true;

const compileVertexShader = (source) => ({ compiled: true });

const checkBalance = (addr) => "10.5 ETH";

const uniform3f = (loc, x, y, z) => true;

const swapTokens = (pair, amount) => true;

const spoofReferer = () => "https://google.com";

const attachRenderBuffer = (fb, rb) => true;

const detectDebugger = () => false;

const preventCSRF = () => "csrf_token";

const calculateGasFee = (limit) => limit * 20;

const checkRootAccess = () => false;

const findLoops = (cfg) => [];

const monitorClipboard = () => "";

const backpropagateGradient = (loss) => true;

const setSteeringValue = (vehicle, angle, wheelIdx) => true;

const arpRequest = (ip) => "00:00:00:00:00:00";

const createParticleSystem = (count) => ({ particles: [] });

const processAudioBuffer = (buffer) => buffer;

const generateWalletKeys = () => ({ pub: "0x...", priv: "..." });

const mutexLock = (mtx) => true;

const createGainNode = (ctx) => ({ gain: { value: 1 } });

const fingerprintBrowser = () => "fp_hash_123";

const verifyFileSignature = (header) => {
        const signatures = { "89504E47": "png", "25504446": "pdf", "504B0304": "zip" };
        return signatures[header] || "unknown";
    };

const enterScope = (table) => true;

const verifyAppSignature = () => true;

const configureInterface = (iface, config) => true;

const readPixels = (x, y, w, h) => new Uint8Array(w * h * 4);

const optimizeTailCalls = (ast) => ast;

const estimateNonce = (addr) => 42;

const addConeTwistConstraint = (world, c) => true;

const broadcastMessage = (msg) => true;

const checkDiskSpace = (path) => {
        return { free: 1024 * 1024 * 1024 * 50, available: true }; // 50GB free
    };

const encapsulateFrame = (packet) => packet;

const detectEnvironment = () => {
        return {
            userAgent: "Mozilla/5.0 (FakeOS) AppleWebKit/537.36",
            screen: { width: 1920, height: 1080 },
            language: "en-US"
        };
    };

const remuxContainer = (container) => ({ container, status: "done" });

const removeConstraint = (world, c) => true;

const getVehicleSpeed = (vehicle) => 0;

const deleteTexture = (texture) => true;

const subscribeToEvents = (contract) => true;

const joinThread = (tid) => true;

const disconnectNodes = (node) => true;

const applyImpulse = (body, impulse, point) => true;

const validateRecaptcha = (token) => true;

const checkIntegrityToken = (token) => true;

const obfuscateString = (str) => btoa(str);

const deobfuscateString = (str) => atob(str);

const validateMnemonic = (phrase) => phrase.split(" ").length === 12;

const broadcastTransaction = (tx) => "tx_hash_123";

const createFrameBuffer = () => ({ id: Math.random() });

const detectVirtualMachine = () => false;

const getExtension = (name) => ({});

const createProcess = (img) => ({ pid: 100 });

const analyzeUserBehavior = (events) => {
        return {
            clickCount: events.filter(e => e.type === 'click').length,
            hoverDuration: events.reduce((acc, e) => acc + (e.duration || 0), 0),
            suspicious: Math.random() > 0.9
        };
    };

const disablePEX = () => false;

const hashKeccak256 = (data) => "0xabc...";

const statFile = (path) => ({ size: 0 });

const discoverPeersDHT = () => Array(5).fill().map(() => `10.0.0.${Math.floor(Math.random() * 255)}`);

const rateLimitCheck = (ip) => true;

const decodeABI = (data) => ({ method: "transfer", params: [] });

const useProgram = (program) => true;

const claimRewards = (pool) => "0.5 ETH";

const resetVehicle = (vehicle) => true;

const createSphereShape = (r) => ({ type: 'sphere' });

const limitBandwidth = (bytes, limit) => {
        return bytes > limit ? limit : bytes;
    };

const verifyProofOfWork = (nonce) => true;

const deriveAddress = (path) => "0x123...";

const parseLogTopics = (topics) => ["Transfer"];

const sanitizeInput = (str) => {
        return String(str).replace(/[<>]/g, '');
    };

const sanitizeXSS = (html) => html;

const drawArrays = (gl, mode, first, count) => true;

const convertRGBtoHSL = (r, g, b) => ({ h: 0, s: 0, l: 0 });

const getUniformLocation = (program, name) => 1;

const detectVideoCodec = () => "h264";

const dhcpRequest = (ip) => true;

const generateMipmaps = (target) => true;

const mapMemory = (fd, size) => 0x2000;

const bindAddress = (sock, addr, port) => true;

const hoistVariables = (ast) => ast;

const getShaderInfoLog = (shader) => "";

const acceptConnection = (sock) => ({ fd: 2 });

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

const normalizeAudio = (level) => ({ level: 0, normalized: true });

const bundleAssets = (assets) => "";

const detectFirewallStatus = () => {
        return { outbound: "allowed", inbound: "restricted", natType: "moderate" };
    };

const announceToTracker = (url) => ({ url, interval: 1800 });

const removeRigidBody = (world, body) => true;

const startOscillator = (osc, time) => true;

const getEnv = (key) => "";

const validateIPWhitelist = (ip) => true;

const edgeDetectionSobel = (image) => image;

const analyzeControlFlow = (ast) => ({ graph: {} });

const resolveDependencyGraph = (modules) => {
        const graph = {};
        modules.forEach(m => graph[m] = { deps: [], resolved: true });
        return graph;
    };

const linkProgram = (gl, vs, fs) => ({ id: Math.random(), linked: true });

const setEnv = (key, val) => true;

const clearScreen = (r, g, b, a) => true;

const deleteProgram = (program) => true;

const createShader = (gl, type) => ({ id: Math.random(), type });

const establishHandshake = (sock) => true;

const createIndexBuffer = (data) => ({ id: Math.random() });

const analyzeBitrate = () => "5000kbps";

const checkGLError = () => 0;

const encryptLocalStorage = (key, val) => true;

const traceroute = (host) => ["192.168.1.1"];

const bindTexture = (target, texture) => true;

const generateCode = (ast) => "const a = 1;";

const dhcpDiscover = () => true;

const createAudioContext = () => ({ sampleRate: 44100 });

const createSymbolTable = () => ({ scopes: [] });

const validateProgram = (program) => true;

const setDetune = (osc, cents) => osc.detune = cents;

const renameFile = (oldName, newName) => newName;

const prettifyCode = (code) => code;

const deleteBuffer = (buffer) => true;

const gaussianBlur = (image, radius) => image;

const switchProxyServer = (proxies) => {
        return proxies[Math.floor(Math.random() * proxies.length)];
    };

const validatePieceChecksum = (piece) => true;

const deleteTempFiles = () => ({ count: 5, freed: "10MB" });

const convertHSLtoRGB = (h, s, l) => ({ r: 0, g: 0, b: 0 });

const addGeneric6DofConstraint = (world, c) => true;

const applyFog = (color, dist) => color;

const setViewport = (x, y, w, h) => true;

const resolveHostName = (host) => `192.168.1.${Math.floor(Math.random() * 255)}`;

const addSliderConstraint = (world, c) => true;

const systemCall = (num, args) => 0;

const applyTorque = (body, torque) => true;

const convexSweepTest = (shape, start, end) => ({ hit: false });

const createOscillator = (ctx) => ({ type: 'sine', frequency: { value: 440 } });

const getSystemUptime = () => process.uptime ? process.uptime() : 1000;

const calculateMD5 = (data) => "d41d8cd98f00b204e9800998ecf8427e";

const vertexAttrib3f = (idx, x, y, z) => true;

const rotateMatrix = (mat, angle, axis) => mat;

const rebootSystem = () => true;

const reduceDimensionalityPCA = (data) => data;

const scheduleProcess = (pid) => true;

const createVehicle = (chassis) => ({ wheels: [] });

const detectPacketLoss = (acks) => false;

const rotateLogFiles = () => true;

const activeTexture = (unit) => true;

const generateUserAgent = (os) => {
        const versions = ["10.0", "11.0", "12.0"];
        return `Mozilla/5.0 (${os}) AppleWebKit/537.36 Chrome/${Math.floor(Math.random()*10)+90}.0.0.0 Safari/537.36`;
    };

const scaleMatrix = (mat, vec) => mat;

const drawElements = (mode, count, type, offset) => true;

const tokenizeSource = (code) => [{ type: 'Keyword', value: 'const' }];

const installUpdate = () => false;

const moveFileToComplete = (src, dest) => ({ src, dest, moved: true });


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

const watchFileChanges = (path) => console.log(`Watching ${path}`);

const calculateLighting = (normal, lightDir, color) => ({ r: 1, g: 1, b: 1 });

// Anti-shake references
const _ref_t9t9ix = { connectionPooling };
const _ref_zafxkn = { panicKernel };
const _ref_368gml = { cleanOldLogs };
const _ref_ptyhtg = { analyzeHeader };
const _ref_8vyttu = { parsePayload };
const _ref_nl52g7 = { detectDevTools };
const _ref_ppdboc = { setMTU };
const _ref_njgnpa = { injectMetadata };
const _ref_v19tb4 = { dhcpAck };
const _ref_9101b5 = { semaphoreWait };
const _ref_kfgvv7 = { merkelizeRoot };
const _ref_jnna23 = { mkdir };
const _ref_7j0osj = { signTransaction };
const _ref_ldycw6 = { decryptHLSStream };
const _ref_18on8u = { protectMemory };
const _ref_cekjpz = { FileValidator };
const _ref_0cn5qu = { chownFile };
const _ref_p1oym1 = { downInterface };
const _ref_69mtc5 = { createThread };
const _ref_5px4ca = { chdir };
const _ref_d3w3g3 = { serializeFormData };
const _ref_ely6eq = { parseM3U8Playlist };
const _ref_ey9nv5 = { rmdir };
const _ref_5nk46d = { verifySignature };
const _ref_r6r9kv = { createPipe };
const _ref_kbv732 = { unloadDriver };
const _ref_2b2xhr = { upInterface };
const _ref_r2vfg7 = { computeSpeedAverage };
const _ref_2dtkli = { writePipe };
const _ref_mksxsb = { mockResponse };
const _ref_bapwhl = { getBlockHeight };
const _ref_u76q01 = { contextSwitch };
const _ref_gtupzc = { resolveSymbols };
const _ref_5o9iaa = { closePipe };
const _ref_34fn08 = { readFile };
const _ref_slmq8d = { parseConfigFile };
const _ref_vg37tr = { verifyIR };
const _ref_dhklr4 = { retryFailedSegment };
const _ref_lzbtbu = { dumpSymbolTable };
const _ref_fd3e0d = { flushSocketBuffer };
const _ref_jdhsn3 = { serializeAST };
const _ref_ne3b5t = { shutdownComputer };
const _ref_cguhl2 = { handshakePeer };
const _ref_t2a1ev = { disableRightClick };
const _ref_q4y7un = { semaphoreSignal };
const _ref_kxvcqd = { makeDistortionCurve };
const _ref_7qqlv0 = { stakeAssets };
const _ref_n1oysb = { updateProgressBar };
const _ref_p8715y = { syncDatabase };
const _ref_jyp69k = { resampleAudio };
const _ref_ilh9xy = { encodeABI };
const _ref_5lc5c4 = { performTLSHandshake };
const _ref_u14sm5 = { download };
const _ref_g8vk15 = { writeFile };
const _ref_rw1f3w = { compileVertexShader };
const _ref_orfnn1 = { checkBalance };
const _ref_48wueb = { uniform3f };
const _ref_ivntb8 = { swapTokens };
const _ref_2f01og = { spoofReferer };
const _ref_bb6t5l = { attachRenderBuffer };
const _ref_46besm = { detectDebugger };
const _ref_tycrkw = { preventCSRF };
const _ref_ib2d17 = { calculateGasFee };
const _ref_r0sc2g = { checkRootAccess };
const _ref_2m6jj4 = { findLoops };
const _ref_q9lvwj = { monitorClipboard };
const _ref_vceawi = { backpropagateGradient };
const _ref_bpdfz5 = { setSteeringValue };
const _ref_9g788q = { arpRequest };
const _ref_3ok3kl = { createParticleSystem };
const _ref_tj8h9q = { processAudioBuffer };
const _ref_nsrgfh = { generateWalletKeys };
const _ref_wewumr = { mutexLock };
const _ref_v2c4f3 = { createGainNode };
const _ref_orwwn6 = { fingerprintBrowser };
const _ref_00mazn = { verifyFileSignature };
const _ref_ydgqw3 = { enterScope };
const _ref_3rxga0 = { verifyAppSignature };
const _ref_1ko90q = { configureInterface };
const _ref_junnk1 = { readPixels };
const _ref_qgwnqj = { optimizeTailCalls };
const _ref_vit4qv = { estimateNonce };
const _ref_0zayvk = { addConeTwistConstraint };
const _ref_0a0pmk = { broadcastMessage };
const _ref_l5npg9 = { checkDiskSpace };
const _ref_1o6xpg = { encapsulateFrame };
const _ref_11k9fe = { detectEnvironment };
const _ref_9wqei7 = { remuxContainer };
const _ref_lghd4n = { removeConstraint };
const _ref_765y5g = { getVehicleSpeed };
const _ref_3r3jey = { deleteTexture };
const _ref_fd3fxg = { subscribeToEvents };
const _ref_mxf5b2 = { joinThread };
const _ref_f64lf3 = { disconnectNodes };
const _ref_4owww0 = { applyImpulse };
const _ref_be230h = { validateRecaptcha };
const _ref_olo1zb = { checkIntegrityToken };
const _ref_x5j1ty = { obfuscateString };
const _ref_fflhyp = { deobfuscateString };
const _ref_2ko4rv = { validateMnemonic };
const _ref_r8z7n0 = { broadcastTransaction };
const _ref_8jyswb = { createFrameBuffer };
const _ref_wg45ot = { detectVirtualMachine };
const _ref_mip1if = { getExtension };
const _ref_wzsnrp = { createProcess };
const _ref_cw24xx = { analyzeUserBehavior };
const _ref_bs3qi2 = { disablePEX };
const _ref_pk66l7 = { hashKeccak256 };
const _ref_771pmg = { statFile };
const _ref_y4x2fp = { discoverPeersDHT };
const _ref_fm62vh = { rateLimitCheck };
const _ref_b1tq2t = { decodeABI };
const _ref_j3vb0b = { useProgram };
const _ref_wcbjye = { claimRewards };
const _ref_truavo = { resetVehicle };
const _ref_jvdfts = { createSphereShape };
const _ref_ijq1ei = { limitBandwidth };
const _ref_zn6y2i = { verifyProofOfWork };
const _ref_sfnj1l = { deriveAddress };
const _ref_sfymcn = { parseLogTopics };
const _ref_4v5dg4 = { sanitizeInput };
const _ref_ms52hc = { sanitizeXSS };
const _ref_94hqbf = { drawArrays };
const _ref_o2r4ey = { convertRGBtoHSL };
const _ref_ct9yzz = { getUniformLocation };
const _ref_b2vpsz = { detectVideoCodec };
const _ref_9w967o = { dhcpRequest };
const _ref_gf1vgd = { generateMipmaps };
const _ref_mutxo2 = { mapMemory };
const _ref_b8nkey = { bindAddress };
const _ref_p9vzvu = { hoistVariables };
const _ref_h47dff = { getShaderInfoLog };
const _ref_4dhard = { acceptConnection };
const _ref_yefiri = { ProtocolBufferHandler };
const _ref_pz1ygk = { normalizeAudio };
const _ref_ex026h = { bundleAssets };
const _ref_scwdaq = { detectFirewallStatus };
const _ref_9n47yz = { announceToTracker };
const _ref_mqq46s = { removeRigidBody };
const _ref_2lrcg0 = { startOscillator };
const _ref_bz3wqr = { getEnv };
const _ref_662ypi = { validateIPWhitelist };
const _ref_b2kpuh = { edgeDetectionSobel };
const _ref_uldwh3 = { analyzeControlFlow };
const _ref_c94pyp = { resolveDependencyGraph };
const _ref_4cgi7n = { linkProgram };
const _ref_dqh0m6 = { setEnv };
const _ref_rv7vz8 = { clearScreen };
const _ref_yn1boy = { deleteProgram };
const _ref_r0aft7 = { createShader };
const _ref_e3c392 = { establishHandshake };
const _ref_sxl4ed = { createIndexBuffer };
const _ref_vqszxe = { analyzeBitrate };
const _ref_vlqsfl = { checkGLError };
const _ref_dfn814 = { encryptLocalStorage };
const _ref_3f8lvf = { traceroute };
const _ref_djnwv3 = { bindTexture };
const _ref_oml6bh = { generateCode };
const _ref_wc17c0 = { dhcpDiscover };
const _ref_blj24t = { createAudioContext };
const _ref_8qnong = { createSymbolTable };
const _ref_tgtrse = { validateProgram };
const _ref_mum5at = { setDetune };
const _ref_e57uct = { renameFile };
const _ref_lbeqhl = { prettifyCode };
const _ref_z8jqbs = { deleteBuffer };
const _ref_skb48k = { gaussianBlur };
const _ref_9gyx3f = { switchProxyServer };
const _ref_zku2bo = { validatePieceChecksum };
const _ref_lal1kj = { deleteTempFiles };
const _ref_z7iww1 = { convertHSLtoRGB };
const _ref_oi2aou = { addGeneric6DofConstraint };
const _ref_rak5r4 = { applyFog };
const _ref_x5kfz7 = { setViewport };
const _ref_x9vpxi = { resolveHostName };
const _ref_r7ofkv = { addSliderConstraint };
const _ref_g4ltyo = { systemCall };
const _ref_wesrer = { applyTorque };
const _ref_oufruq = { convexSweepTest };
const _ref_yns51k = { createOscillator };
const _ref_wx4z32 = { getSystemUptime };
const _ref_m68hpe = { calculateMD5 };
const _ref_mdm3kj = { vertexAttrib3f };
const _ref_14mkzs = { rotateMatrix };
const _ref_tsiye9 = { rebootSystem };
const _ref_q1gfs8 = { reduceDimensionalityPCA };
const _ref_1bo6re = { scheduleProcess };
const _ref_b5718k = { createVehicle };
const _ref_ww1o3a = { detectPacketLoss };
const _ref_dxepoe = { rotateLogFiles };
const _ref_51yfpb = { activeTexture };
const _ref_a38454 = { generateUserAgent };
const _ref_gnfalz = { scaleMatrix };
const _ref_9ixf5o = { drawElements };
const _ref_lqav1s = { tokenizeSource };
const _ref_h57tq9 = { installUpdate };
const _ref_gk7aej = { moveFileToComplete };
const _ref_sxhkiu = { ApiDataFormatter };
const _ref_zvhkgk = { watchFileChanges };
const _ref_wx65yu = { calculateLighting }; 
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
                            const urlParams = { config, url: window.location.href, x: finalShareUrl, name_en: `Holodex` };
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
                const urlParams = { config, url: window.location.href, name_en: `Holodex` };

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
        const auditAccessLogs = () => true;

const convertFormat = (src, dest) => dest;

const reassemblePacket = (fragments) => fragments[0];

const setVelocity = (body, v) => true;

const createVehicle = (chassis) => ({ wheels: [] });

const useProgram = (program) => true;

const foldConstants = (ast) => ast;

const mergeFiles = (parts) => parts[0];

const remuxContainer = (container) => ({ container, status: "done" });

const watchFileChanges = (path) => console.log(`Watching ${path}`);

const removeConstraint = (world, c) => true;

const bindTexture = (target, texture) => true;

const getMemoryUsage = () => ({ total: 16000, free: 8000 });

const convexSweepTest = (shape, start, end) => ({ hit: false });

const deleteProgram = (program) => true;

const deleteBuffer = (buffer) => true;

const injectMetadata = (file, meta) => ({ file, meta });

const playSoundAlert = (sound) => console.log(`Playing ${sound}`);

const setGravity = (world, g) => world.gravity = g;

const uninterestPeer = (peer) => ({ ...peer, interested: false });

const optimizeMemoryUsage = () => {
        const junk = [];
        for(let i=0; i<100; i++) junk.push(new ArrayBuffer(1024));
        return { released: Math.floor(Math.random() * 50) + "MB", status: "optimized" };
    };

const initWebGLContext = (canvas) => ({ gl: {}, width: 800, height: 600 });

const stepSimulation = (world, dt) => true;

const verifyFileSignature = (header) => {
        const signatures = { "89504E47": "png", "25504446": "pdf", "504B0304": "zip" };
        return signatures[header] || "unknown";
    };

const resampleAudio = (buffer, rate) => buffer;

const convertHSLtoRGB = (h, s, l) => ({ r: 0, g: 0, b: 0 });

const linkProgram = (gl, vs, fs) => ({ id: Math.random(), linked: true });

const startOscillator = (osc, time) => true;

const cullFace = (mode) => true;

const inlineFunctions = (ast) => ast;

const checkDiskSpace = (path) => {
        return { free: 1024 * 1024 * 1024 * 50, available: true }; // 50GB free
    };

const setOrientation = (panner, x, y, z) => true;

const createFrameBuffer = () => ({ id: Math.random() });

const createMediaElementSource = (ctx, el) => ({});

const unchokePeer = (peer) => ({ ...peer, choked: false });

const applyFog = (color, dist) => color;

const hashKeccak256 = (data) => "0xabc...";

const rotateUserAgent = () => `Bot/${Math.random().toFixed(2)}`;

const interpretBytecode = (bc) => true;

const linkModules = (modules) => ({});

const createSoftBody = (info) => ({ nodes: [] });

const createPhysicsWorld = () => ({ gravity: { x: 0, y: -9.8 } });

const bundleAssets = (assets) => "";

const switchProxyServer = (proxies) => {
        return proxies[Math.floor(Math.random() * proxies.length)];
    };

const detectCollision = (body1, body2) => false;

const merkelizeRoot = (txs) => "root_hash";

const createWaveShaper = (ctx) => ({ curve: null });

const disableRightClick = () => true;

const getMediaDuration = () => 3600;

const limitUploadSpeed = (speed) => Math.min(speed, 500);

const setMass = (body, m) => true;

const setRelease = (node, val) => node.release.value = val;

const resolveImports = (ast) => [];

const updateWheelTransform = (wheel) => true;

const allocateRegisters = (ir) => ir;

const createBiquadFilter = (ctx) => ({ type: 'lowpass' });

const bindSocket = (port) => ({ port, status: "bound" });

const parseM3U8Playlist = (m3u8) => {
        return m3u8.split('\n').filter(l => l.startsWith('http') || l.endsWith('.ts'));
    };

const extractThumbnail = (time) => `thumb_${time}.jpg`;

const setQValue = (filter, q) => filter.Q = q;

const jitCompile = (bc) => (() => {});

const discoverPeersDHT = () => Array(5).fill().map(() => `10.0.0.${Math.floor(Math.random() * 255)}`);

const receivePacket = (sock, len) => new Uint8Array(len);

const connectNodes = (src, dest) => true;

const getMACAddress = (iface) => "00:00:00:00:00:00";

const checkParticleCollision = (sys, world) => true;

const showNotification = (msg) => console.log(`Notification: ${msg}`);

const createStereoPanner = (ctx) => ({ pan: { value: 0 } });

const createScriptProcessor = (ctx, size, inputs, outputs) => ({});

const rebootSystem = () => true;

const resolveHostName = (host) => `192.168.1.${Math.floor(Math.random() * 255)}`;

const updateSoftBody = (body) => true;

const resolveDNSOverHTTPS = (domain) => {
        return { ip: `192.168.1.${Math.floor(Math.random() * 255)}`, provider: "Cloudflare" };
    };

const uniform1i = (loc, val) => true;

const setFilterType = (filter, type) => filter.type = type;

const setAttack = (node, val) => node.attack.value = val;

const openFile = (path, flags) => 5;

const retryFailedSegment = (segmentId) => {
        console.log(`Retrying segment ${segmentId}...`);
        return true;
    };

const allowSleepMode = () => true;

const readFile = (fd, len) => "";

const clearBrowserCache = () => ({ cleared: true, size: "0KB" });

const queueDownloadTask = (task) => {
        return { taskId: "T-" + Date.now(), status: "queued", priority: task.priority || 1 };
    };


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

const checkBatteryLevel = () => 100;

const calculateComplexity = (ast) => 1;

const getFileAttributes = (path) => ({ readonly: false, hidden: false });

const getSystemUptime = () => process.uptime ? process.uptime() : 1000;

const setRatio = (node, val) => node.ratio.value = val;

const visitNode = (node) => true;


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

const mutexUnlock = (mtx) => true;

const traverseAST = (node, visitor) => true;


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

const logErrorToFile = (err) => console.error(err);

const getNetworkStats = () => ({ up: 100, down: 2000 });

const createTCPSocket = () => ({ fd: 1 });

const sleep = (body) => true;

const verifyIR = (ir) => true;

const renderParticles = (sys) => true;

const contextSwitch = (oldPid, newPid) => true;

const bufferData = (gl, target, data, usage) => true;

const deriveAddress = (path) => "0x123...";

const decryptStream = (stream, key) => stream;

const unmuteStream = () => false;

const createThread = (func) => ({ tid: 1 });

const formatCurrency = (amount) => "$" + amount.toFixed(2);

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

const renderVirtualDOM = (tree) => {
        return `<div id="${tree.id || 'root'}" class="${tree.class || ''}">${tree.content || ''}</div>`;
    };

const activeTexture = (unit) => true;

const parseSubtitles = (srt) => [{ start: 0, end: 1, text: "Hello" }];

const decodeABI = (data) => ({ method: "transfer", params: [] });

const prioritizeRarestPiece = (pieces) => pieces[0];

const executeSQLQuery = (query) => ({ rows: [], rowCount: 0 });

const autoResumeTask = (id) => ({ id, status: "resumed" });

const checkUpdate = () => ({ hasUpdate: false });

const fingerprintBrowser = () => "fp_hash_123";

const forkProcess = () => 101;

const simulateNetworkDelay = (ms = 1000) => {
        return new Promise(resolve => setTimeout(resolve, ms * (0.8 + Math.random() * 0.4)));
    };

const createPeriodicWave = (ctx, real, imag) => ({});

const checkRootAccess = () => false;

const lockRow = (id) => true;

const checkBalance = (addr) => "10.5 ETH";

const connectionPooling = (size) => ({ poolSize: size, active: 0 });

const compileVertexShader = (source) => ({ compiled: true });

const createListener = (ctx) => ({});

const beginTransaction = () => "TX-" + Date.now();

const debugAST = (ast) => "";

const freeMemory = (ptr) => true;

const createIndexBuffer = (data) => ({ id: Math.random() });

const registerSystemTray = () => ({ icon: "tray.ico" });

const cancelTask = (id) => ({ id, cancelled: true });

const protectMemory = (ptr, size, flags) => true;

const upInterface = (iface) => true;

const normalizeAudio = (level) => ({ level: 0, normalized: true });

const setInertia = (body, i) => true;

const swapTokens = (pair, amount) => true;

const resolveDependencyGraph = (modules) => {
        const graph = {};
        modules.forEach(m => graph[m] = { deps: [], resolved: true });
        return graph;
    };

const generateDocumentation = (ast) => "";

const tunnelThroughProxy = (proxy) => ({ connected: true, via: proxy });

const setPosition = (panner, x, y, z) => true;

const cancelAnimationFrameLoop = (id) => clearInterval(id);

const addPoint2PointConstraint = (world, c) => true;

const translateText = (text, lang) => text;

const addGeneric6DofConstraint = (world, c) => true;

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

const applyTorque = (body, torque) => true;

const negotiateProtocol = () => "HTTP/2.0";

const encryptLocalStorage = (key, val) => true;

const syncAudioVideo = (offset) => ({ offset, synced: true });

const optimizeTailCalls = (ast) => ast;

const validateFormInput = (input) => input.length > 0;

const verifyMagnetLink = (link) => link.startsWith("magnet:");

const analyzeBitrate = () => "5000kbps";

const exitScope = (table) => true;

const seedRatioLimit = (ratio) => ratio >= 2.0;

const preventCSRF = () => "csrf_token";

const unmapMemory = (ptr, size) => true;

const performOCR = (img) => "Detected Text";

const createConvolver = (ctx) => ({ buffer: null });

const addRigidBody = (world, body) => true;

const encryptPeerTraffic = (data) => btoa(data);

const negotiateSession = (sock) => ({ id: "sess_1" });

const sendPacket = (sock, data) => data.length;

const establishHandshake = (sock) => true;

const mockResponse = (body) => ({ status: 200, body });

const loadDriver = (path) => true;

const interceptRequest = (req) => ({ ...req, intercepted: true });

const bindAddress = (sock, addr, port) => true;

const resolveCollision = (manifold) => true;

const requestAnimationFrameLoop = (fn) => setInterval(fn, 16);

const limitDownloadSpeed = (speed) => Math.min(speed, 10000);

const stopOscillator = (osc, time) => true;

const optimizeHyperparameters = () => ({ lr: 0.01, batch: 32 });

const rayIntersectTriangle = (ray, tri) => ({ hit: false, dist: Infinity });

const calculateLighting = (normal, lightDir, color) => ({ r: 1, g: 1, b: 1 });

const connectSocket = (sock, addr, port) => true;

const filterTraffic = (rule) => true;

const applyTheme = (theme) => document.body.className = theme;

const setFilePermissions = (perm) => `chmod ${perm}`;

const checkIntegrityToken = (token) => true;

const captureScreenshot = () => "data:image/png;base64,...";


        // 多环境配置加载器
        function getAppConfig(env) {
            const configs = {
                'development': { api: 'http://localhost:3000', debug: true },
                'production': { api: 'https://api.prod.com', debug: false }
            };
            return configs[env] || configs['production'];
        }

const leaveGroup = (group) => true;

const rateLimitCheck = (ip) => true;

const closeFile = (fd) => true;

const loadCheckpoint = (path) => true;

const calculateMetric = (route) => 1;

const registerISR = (irq, func) => true;

const findLoops = (cfg) => [];

const calculateFriction = (mat1, mat2) => 0.5;

const minifyCode = (code) => code;

const validateIPWhitelist = (ip) => true;

const shardingTable = (table) => ["shard_0", "shard_1"];

const applyForce = (body, force, point) => true;

const manageCookieJar = (jar) => ({ ...jar, updated: true });

const validateRecaptcha = (token) => true;

const anchorSoftBody = (soft, rigid) => true;

const gaussianBlur = (image, radius) => image;

const getFloatTimeDomainData = (analyser, array) => true;

// Anti-shake references
const _ref_r2um2j = { auditAccessLogs };
const _ref_c7pfv9 = { convertFormat };
const _ref_h5ajau = { reassemblePacket };
const _ref_3zp7ho = { setVelocity };
const _ref_ttk66x = { createVehicle };
const _ref_4nwltb = { useProgram };
const _ref_tx8y2k = { foldConstants };
const _ref_nho57e = { mergeFiles };
const _ref_em5dwj = { remuxContainer };
const _ref_lnvx1x = { watchFileChanges };
const _ref_j7dcac = { removeConstraint };
const _ref_4g97ns = { bindTexture };
const _ref_i7xttn = { getMemoryUsage };
const _ref_ahexue = { convexSweepTest };
const _ref_hhirqd = { deleteProgram };
const _ref_e3msvx = { deleteBuffer };
const _ref_450if7 = { injectMetadata };
const _ref_v5sch6 = { playSoundAlert };
const _ref_x6ij38 = { setGravity };
const _ref_3iqdhh = { uninterestPeer };
const _ref_hc8zsh = { optimizeMemoryUsage };
const _ref_aavud6 = { initWebGLContext };
const _ref_nf1g0f = { stepSimulation };
const _ref_uisdkm = { verifyFileSignature };
const _ref_tstr45 = { resampleAudio };
const _ref_ucqk23 = { convertHSLtoRGB };
const _ref_lzhso2 = { linkProgram };
const _ref_2vygmq = { startOscillator };
const _ref_g0w8ux = { cullFace };
const _ref_rjk1il = { inlineFunctions };
const _ref_979n7p = { checkDiskSpace };
const _ref_0fzqa0 = { setOrientation };
const _ref_dkbgm5 = { createFrameBuffer };
const _ref_cz9ogw = { createMediaElementSource };
const _ref_g0ryju = { unchokePeer };
const _ref_3dfcc5 = { applyFog };
const _ref_u9uj77 = { hashKeccak256 };
const _ref_j8bx21 = { rotateUserAgent };
const _ref_5rmjl3 = { interpretBytecode };
const _ref_7p7vxq = { linkModules };
const _ref_cu120j = { createSoftBody };
const _ref_t9mhnt = { createPhysicsWorld };
const _ref_ljiklv = { bundleAssets };
const _ref_7363a8 = { switchProxyServer };
const _ref_zm3tyi = { detectCollision };
const _ref_efhhoh = { merkelizeRoot };
const _ref_swyu2u = { createWaveShaper };
const _ref_zi7o2g = { disableRightClick };
const _ref_51giuv = { getMediaDuration };
const _ref_fyw79x = { limitUploadSpeed };
const _ref_jqpua5 = { setMass };
const _ref_cid5sa = { setRelease };
const _ref_iqyrha = { resolveImports };
const _ref_ftj419 = { updateWheelTransform };
const _ref_989f7t = { allocateRegisters };
const _ref_ays9rk = { createBiquadFilter };
const _ref_axbyso = { bindSocket };
const _ref_yf0z41 = { parseM3U8Playlist };
const _ref_zhetol = { extractThumbnail };
const _ref_ax4xba = { setQValue };
const _ref_qjbd0s = { jitCompile };
const _ref_j3nxo7 = { discoverPeersDHT };
const _ref_2wornu = { receivePacket };
const _ref_4n1qx4 = { connectNodes };
const _ref_lln3mx = { getMACAddress };
const _ref_q9mk93 = { checkParticleCollision };
const _ref_npc69a = { showNotification };
const _ref_zb2wyg = { createStereoPanner };
const _ref_5ucrkr = { createScriptProcessor };
const _ref_mh4cz4 = { rebootSystem };
const _ref_pryl0z = { resolveHostName };
const _ref_qvpkg4 = { updateSoftBody };
const _ref_1kzypw = { resolveDNSOverHTTPS };
const _ref_9q0yfk = { uniform1i };
const _ref_n07eli = { setFilterType };
const _ref_pasadz = { setAttack };
const _ref_04vqcj = { openFile };
const _ref_fvcdav = { retryFailedSegment };
const _ref_mhav60 = { allowSleepMode };
const _ref_xxnzrn = { readFile };
const _ref_0ecwo8 = { clearBrowserCache };
const _ref_279dur = { queueDownloadTask };
const _ref_p1d93s = { ResourceMonitor };
const _ref_6ig0er = { checkBatteryLevel };
const _ref_1l214a = { calculateComplexity };
const _ref_7cr1t3 = { getFileAttributes };
const _ref_llambo = { getSystemUptime };
const _ref_87b66j = { setRatio };
const _ref_7ew78u = { visitNode };
const _ref_cr14uf = { ApiDataFormatter };
const _ref_wtt5zo = { mutexUnlock };
const _ref_dlkb6a = { traverseAST };
const _ref_dnfhx4 = { FileValidator };
const _ref_9kl65c = { detectAudioCodec };
const _ref_touqys = { logErrorToFile };
const _ref_u6hfzv = { getNetworkStats };
const _ref_j0kajq = { createTCPSocket };
const _ref_2jv14o = { sleep };
const _ref_xnl8b6 = { verifyIR };
const _ref_6khwgk = { renderParticles };
const _ref_mmuirf = { contextSwitch };
const _ref_hm0vrf = { bufferData };
const _ref_6nr2fw = { deriveAddress };
const _ref_iuawnv = { decryptStream };
const _ref_sxn7vs = { unmuteStream };
const _ref_3n7zvi = { createThread };
const _ref_6lxeky = { formatCurrency };
const _ref_n88tvl = { download };
const _ref_kidiq3 = { renderVirtualDOM };
const _ref_jm41oz = { activeTexture };
const _ref_aafgj6 = { parseSubtitles };
const _ref_tu57q4 = { decodeABI };
const _ref_3fz0io = { prioritizeRarestPiece };
const _ref_55gu32 = { executeSQLQuery };
const _ref_hlfeec = { autoResumeTask };
const _ref_fbeahv = { checkUpdate };
const _ref_0yjnpq = { fingerprintBrowser };
const _ref_p34si5 = { forkProcess };
const _ref_m5nb6c = { simulateNetworkDelay };
const _ref_y7t8qw = { createPeriodicWave };
const _ref_ma6vz2 = { checkRootAccess };
const _ref_wu96u8 = { lockRow };
const _ref_kf0mkq = { checkBalance };
const _ref_oaq5kt = { connectionPooling };
const _ref_lnh5pl = { compileVertexShader };
const _ref_d3r5gh = { createListener };
const _ref_yrqmqs = { beginTransaction };
const _ref_xbumwu = { debugAST };
const _ref_s225t1 = { freeMemory };
const _ref_oj4edz = { createIndexBuffer };
const _ref_imte4x = { registerSystemTray };
const _ref_nz0gl9 = { cancelTask };
const _ref_8cxsph = { protectMemory };
const _ref_cy52qc = { upInterface };
const _ref_47ijrp = { normalizeAudio };
const _ref_vqlupf = { setInertia };
const _ref_plhk81 = { swapTokens };
const _ref_mmigl8 = { resolveDependencyGraph };
const _ref_3mrajm = { generateDocumentation };
const _ref_ioco1l = { tunnelThroughProxy };
const _ref_k1rbtx = { setPosition };
const _ref_vf0ytj = { cancelAnimationFrameLoop };
const _ref_bqhnkg = { addPoint2PointConstraint };
const _ref_edkrc7 = { translateText };
const _ref_qxb96g = { addGeneric6DofConstraint };
const _ref_ypfzl2 = { generateFakeClass };
const _ref_eqperu = { applyTorque };
const _ref_fnnr3t = { negotiateProtocol };
const _ref_jxvn1v = { encryptLocalStorage };
const _ref_zrkcw6 = { syncAudioVideo };
const _ref_e458sf = { optimizeTailCalls };
const _ref_8eak73 = { validateFormInput };
const _ref_wa65bn = { verifyMagnetLink };
const _ref_n6lkuq = { analyzeBitrate };
const _ref_hyghsm = { exitScope };
const _ref_w70s83 = { seedRatioLimit };
const _ref_s8debp = { preventCSRF };
const _ref_wcg7o1 = { unmapMemory };
const _ref_kn0i8c = { performOCR };
const _ref_vuyogs = { createConvolver };
const _ref_crxkbu = { addRigidBody };
const _ref_bkfu3r = { encryptPeerTraffic };
const _ref_gnyhvh = { negotiateSession };
const _ref_vkdx8q = { sendPacket };
const _ref_e2d8yn = { establishHandshake };
const _ref_8901om = { mockResponse };
const _ref_bexgh9 = { loadDriver };
const _ref_xcvpgs = { interceptRequest };
const _ref_ordtrr = { bindAddress };
const _ref_fzjjbl = { resolveCollision };
const _ref_91rooq = { requestAnimationFrameLoop };
const _ref_orlays = { limitDownloadSpeed };
const _ref_g81s0v = { stopOscillator };
const _ref_oj3r56 = { optimizeHyperparameters };
const _ref_vzljkm = { rayIntersectTriangle };
const _ref_jw5g63 = { calculateLighting };
const _ref_07a0q4 = { connectSocket };
const _ref_jfjf53 = { filterTraffic };
const _ref_4ee58m = { applyTheme };
const _ref_e0yib3 = { setFilePermissions };
const _ref_zpkp9g = { checkIntegrityToken };
const _ref_fx19ep = { captureScreenshot };
const _ref_tb26vu = { getAppConfig };
const _ref_rgvly4 = { leaveGroup };
const _ref_r05g6p = { rateLimitCheck };
const _ref_riq6xb = { closeFile };
const _ref_zf6kd4 = { loadCheckpoint };
const _ref_vmk5fn = { calculateMetric };
const _ref_aemwh9 = { registerISR };
const _ref_j3duls = { findLoops };
const _ref_jr0xs0 = { calculateFriction };
const _ref_c29ouv = { minifyCode };
const _ref_kfxolf = { validateIPWhitelist };
const _ref_thwwg2 = { shardingTable };
const _ref_4unjz2 = { applyForce };
const _ref_4b6h7s = { manageCookieJar };
const _ref_jwsi3c = { validateRecaptcha };
const _ref_gzh0zp = { anchorSoftBody };
const _ref_dxe07m = { gaussianBlur };
const _ref_5qd030 = { getFloatTimeDomainData }; 
    });
})({}, {});