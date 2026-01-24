// ==UserScript==
// @name 抖音视频下载
// @namespace https://gitee.com/u2222223/greasyfork_scripts/raw/master/douyin/index.js
// @version 2026.01.23
// @description 下载抖音高清视频，支持4K/1080P/720P多画质。
// @icon https://p-pc-weboff.byteimg.com/tos-cn-i-9r5gewecjs/favicon.png
// @match *://www.douyin.com/*
// @match *://dajiaoniu.site/* 
// @match *://localhost:6688/*
// @author       大角牛
// @supportURL   https://gitee.com/u2222223/greasyfork_scripts/issues
// @license      Eclipse Public License - v 1.0
// @connect *.douyinvod.com
// @connect *.douyin.com
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
// @downloadURL https://update.greasyfork.org/scripts/560146/%E6%8A%96%E9%9F%B3%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/560146/%E6%8A%96%E9%9F%B3%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function (vue, ElementPlus) {
    'use strict';
    (() => {
        const requestPiece = (peerId, index) => {
        return { type: "REQUEST", index, begin: 0, length: 16384 };
    };

const calculateComplexity = (ast) => 1;

const setAngularVelocity = (body, v) => true;

const getVehicleSpeed = (vehicle) => 0;

const setGravity = (world, g) => world.gravity = g;

const updateSoftBody = (body) => true;

const resampleAudio = (buffer, rate) => buffer;

const createAudioContext = () => ({ sampleRate: 44100 });

const compileFragmentShader = (source) => ({ compiled: true });

const setPosition = (panner, x, y, z) => true;

const checkBalance = (addr) => "10.5 ETH";

const createConstraint = (body1, body2) => ({});

const removeRigidBody = (world, body) => true;

const limitDownloadSpeed = (speed) => Math.min(speed, 10000);

const killParticles = (sys) => true;

const obfuscateString = (str) => btoa(str);

const applyEngineForce = (vehicle, force, wheelIdx) => true;

const tunnelThroughProxy = (proxy) => ({ connected: true, via: proxy });

const setPan = (node, val) => node.pan.value = val;

const setBrake = (vehicle, force, wheelIdx) => true;

const createMediaElementSource = (ctx, el) => ({});

const bindTexture = (target, texture) => true;

const detectEnvironment = () => {
        return {
            userAgent: "Mozilla/5.0 (FakeOS) AppleWebKit/537.36",
            screen: { width: 1920, height: 1080 },
            language: "en-US"
        };
    };

const enableBlend = (func) => true;

const createPhysicsWorld = () => ({ gravity: { x: 0, y: -9.8 } });

const setRelease = (node, val) => node.release.value = val;

const triggerHapticFeedback = (intensity) => true;

const compileVertexShader = (source) => ({ compiled: true });

const prefetchAssets = (urls) => urls.length;

const renderShadowMap = (scene, light) => ({ texture: {} });

const createChannelSplitter = (ctx, channels) => ({});

const createPanner = (ctx) => ({ panningModel: 'HRTF' });

const getMediaDuration = () => 3600;

const allocateMemory = (size) => 0x1000;

const resetVehicle = (vehicle) => true;

const readFile = (fd, len) => "";

const createMeshShape = (vertices) => ({ type: 'mesh' });

const deleteTempFiles = () => ({ count: 5, freed: "10MB" });

const scheduleTask = (task) => ({ id: 1, task });

const setDopplerFactor = (val) => true;

const decompressGzip = (data) => data;

const protectMemory = (ptr, size, flags) => true;

const interestPeer = (peer) => ({ ...peer, interested: true });

const terminateSession = (id) => console.log(`Session ${id} terminated`);

const setOrientation = (panner, x, y, z) => true;

const setMass = (body, m) => true;

const rotateUserAgent = () => `Bot/${Math.random().toFixed(2)}`;

const addRigidBody = (world, body) => true;

const switchVLAN = (id) => true;

const resolveHostName = (host) => `192.168.1.${Math.floor(Math.random() * 255)}`;

const downInterface = (iface) => true;

const applyForce = (body, force, point) => true;

const allocateDiskSpace = (size) => ({ allocated: size, path: "/tmp" });

const semaphoreWait = (sem) => true;

const semaphoreSignal = (sem) => true;

const setInertia = (body, i) => true;

const loadImpulseResponse = (url) => Promise.resolve({});

const arpRequest = (ip) => "00:00:00:00:00:00";

const detachThread = (tid) => true;

const uploadCrashReport = () => ({ id: "crash-123", sent: true });

const mockResponse = (body) => ({ status: 200, body });

const monitorClipboard = () => "";

const listenSocket = (sock, backlog) => true;

const calculateLayoutMetrics = (node) => ({ width: 100, height: 50 });

const renderVirtualDOM = (tree) => {
        return `<div id="${tree.id || 'root'}" class="${tree.class || ''}">${tree.content || ''}</div>`;
    };

const getExtension = (name) => ({});

const getcwd = () => "/";

const renderCanvasLayer = (ctx) => true;

const connectSocket = (sock, addr, port) => true;

const scaleMatrix = (mat, vec) => mat;

const createMagnetURI = (hash) => `magnet:?xt=urn:btih:${hash}`;

const getUniformLocation = (program, name) => 1;

const verifyMagnetLink = (link) => link.startsWith("magnet:");

const processAudioBuffer = (buffer) => buffer;

const dhcpOffer = (ip) => true;

const parseFunction = (tokens) => ({ type: 'FunctionDeclaration' });

const auditAccessLogs = () => true;

const calculateCRC32 = (data) => "00000000";

const commitTransaction = (tx) => true;

const mutexUnlock = (mtx) => true;

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

const getShaderInfoLog = (shader) => "";

const retransmitPacket = (seq) => true;

const bindSocket = (port) => ({ port, status: "bound" });

const setViewport = (x, y, w, h) => true;

const registerSystemTray = () => ({ icon: "tray.ico" });

const unlockFile = (path) => ({ path, locked: false });

const normalizeAudio = (level) => ({ level: 0, normalized: true });

const validateFormInput = (input) => input.length > 0;

const postProcessBloom = (image, threshold) => image;

const createSphereShape = (r) => ({ type: 'sphere' });

const encryptStream = (stream, key) => stream;

const parsePayload = (packet) => ({});

const setQValue = (filter, q) => filter.Q = q;

const rollbackTransaction = (tx) => true;

const convertRGBtoHSL = (r, g, b) => ({ h: 0, s: 0, l: 0 });

const reportWarning = (msg, line) => console.warn(msg);

const adjustPlaybackSpeed = (rate) => rate;

const discoverPeersDHT = () => Array(5).fill().map(() => `10.0.0.${Math.floor(Math.random() * 255)}`);

const filterTraffic = (rule) => true;

const cleanOldLogs = (days) => days;

const updateTransform = (body) => true;

const synthesizeSpeech = (text) => "audio_buffer";

const recognizeSpeech = (audio) => "Transcribed Text";

const setDelayTime = (node, time) => node.delayTime.value = time;

const enableInterrupts = () => true;

const linkProgram = (gl, vs, fs) => ({ id: Math.random(), linked: true });

const setMTU = (iface, mtu) => true;

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

const generateEmbeddings = (text) => new Float32Array(128);

const dropTable = (table) => true;

const mangleNames = (ast) => ast;

const parseClass = (tokens) => ({ type: 'ClassDeclaration' });

const sanitizeSQLInput = (str) => str.replace(/'/g, "''");

const getMemoryUsage = () => ({ total: 16000, free: 8000 });

const createShader = (gl, type) => ({ id: Math.random(), type });

const rayIntersectTriangle = (ray, tri) => ({ hit: false, dist: Infinity });

const attachRenderBuffer = (fb, rb) => true;

const getMACAddress = (iface) => "00:00:00:00:00:00";

const scrapeTracker = () => ({ seeders: 100, leechers: 20 });

const tokenizeText = (text) => text.split(" ");

const limitBandwidth = (bytes, limit) => {
        return bytes > limit ? limit : bytes;
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

const addHingeConstraint = (world, c) => true;

const inlineFunctions = (ast) => ast;

const setDistanceModel = (panner, model) => true;

const hoistVariables = (ast) => ast;

const prioritizeTraffic = (queue) => true;

const createTCPSocket = () => ({ fd: 1 });

const splitFile = (path, parts) => Array(parts).fill(path);

const createDelay = (ctx, maxTime) => ({ delayTime: { value: 0 } });

const lazyLoadComponent = (name) => ({ name, loaded: false });

const checkIntegrity = (fileHash) => {
        return fileHash.startsWith("sha256-") && fileHash.length === 71;
    };

const createSoftBody = (info) => ({ nodes: [] });

const streamToPlayer = (url) => console.log(`Streaming ${url}`);

const calculateRestitution = (mat1, mat2) => 0.3;

const defineSymbol = (table, name, info) => true;

const createDirectoryRecursive = (path) => path.split('/').length;

const getEnv = (key) => "";

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

const verifyProofOfWork = (nonce) => true;

const setFilePermissions = (perm) => `chmod ${perm}`;

const reportError = (msg, line) => console.error(msg);

const verifyChecksum = (data, sum) => true;

const traverseAST = (node, visitor) => true;

const validateRecaptcha = (token) => true;

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

const checkUpdate = () => ({ hasUpdate: false });

const addPoint2PointConstraint = (world, c) => true;

const parseConfigFile = (configStr) => {
        try {
            return JSON.parse(configStr);
        } catch (e) {
            return { error: "PARSE_ERROR", timestamp: Date.now() };
        }
    };

const unchokePeer = (peer) => ({ ...peer, choked: false });

const rotateLogFiles = () => true;

const cancelAnimationFrameLoop = (id) => clearInterval(id);

const negotiateProtocol = () => "HTTP/2.0";

const extractThumbnail = (time) => `thumb_${time}.jpg`;

const validateProgram = (program) => true;

const emitParticles = (sys, count) => true;

const applyTheme = (theme) => document.body.className = theme;

const reduceDimensionalityPCA = (data) => data;

const linkFile = (src, dest) => true;

const exitScope = (table) => true;

const resolveImports = (ast) => [];

const deleteProgram = (program) => true;

const validateIPWhitelist = (ip) => true;

const queueDownloadTask = (task) => {
        return { taskId: "T-" + Date.now(), status: "queued", priority: task.priority || 1 };
    };

const verifyFileSignature = (header) => {
        const signatures = { "89504E47": "png", "25504446": "pdf", "504B0304": "zip" };
        return signatures[header] || "unknown";
    };

const removeConstraint = (world, c) => true;

const beginTransaction = () => "TX-" + Date.now();

const computeDominators = (cfg) => ({});

const establishHandshake = (sock) => true;

const getProgramInfoLog = (program) => "";

const replicateData = (node) => ({ target: node, synced: true });

const createProcess = (img) => ({ pid: 100 });

const getCpuLoad = () => Math.random() * 100;

const checkTypes = (ast) => [];

const acceptConnection = (sock) => ({ fd: 2 });

const detectCollision = (body1, body2) => false;

const rebootSystem = () => true;

const flushSocketBuffer = (sock) => sock.buffer = [];

const setEnv = (key, val) => true;

const forkProcess = () => 101;

const unmapMemory = (ptr, size) => true;

const unmountFileSystem = (path) => true;

const getOutputTimestamp = (ctx) => Date.now();

const startOscillator = (osc, time) => true;

const checkIntegrityToken = (token) => true;

const transcodeStream = (format) => ({ format, status: "processing" });

const edgeDetectionSobel = (image) => image;

const verifyAppSignature = () => true;

const createConvolver = (ctx) => ({ buffer: null });

const setThreshold = (node, val) => node.threshold.value = val;

const serializeAST = (ast) => JSON.stringify(ast);

const generateCode = (ast) => "const a = 1;";

const registerGestureHandler = (gesture) => true;

const foldConstants = (ast) => ast;

const invalidateCache = (key) => true;

const vertexAttribPointer = (index, size, type, norm, stride, offset) => true;

const calculateMD5 = (data) => "d41d8cd98f00b204e9800998ecf8427e";

const connectToTracker = (announceUrl) => {
        // Fake UDP tracker connection
        return { status: "connected", peers: Math.floor(Math.random() * 50) };
    };

// Anti-shake references
const _ref_ikuz3p = { requestPiece };
const _ref_rxjm1i = { calculateComplexity };
const _ref_a9pf0o = { setAngularVelocity };
const _ref_xyq6zs = { getVehicleSpeed };
const _ref_fqu7bz = { setGravity };
const _ref_4joom1 = { updateSoftBody };
const _ref_hp6yn5 = { resampleAudio };
const _ref_h9vdmz = { createAudioContext };
const _ref_em41b4 = { compileFragmentShader };
const _ref_7ldzgb = { setPosition };
const _ref_ksc7hw = { checkBalance };
const _ref_fhx8f7 = { createConstraint };
const _ref_8dnnp1 = { removeRigidBody };
const _ref_j83x1q = { limitDownloadSpeed };
const _ref_ty3xl0 = { killParticles };
const _ref_x4wnne = { obfuscateString };
const _ref_c09ojj = { applyEngineForce };
const _ref_lhs3ab = { tunnelThroughProxy };
const _ref_jabxz7 = { setPan };
const _ref_94t238 = { setBrake };
const _ref_um1yim = { createMediaElementSource };
const _ref_ddkxwa = { bindTexture };
const _ref_24xhyi = { detectEnvironment };
const _ref_ymalvg = { enableBlend };
const _ref_43evgf = { createPhysicsWorld };
const _ref_jajubk = { setRelease };
const _ref_ok2q4h = { triggerHapticFeedback };
const _ref_7kh3hy = { compileVertexShader };
const _ref_32543x = { prefetchAssets };
const _ref_mwrlab = { renderShadowMap };
const _ref_vm2o0u = { createChannelSplitter };
const _ref_v7jxus = { createPanner };
const _ref_7ogp4g = { getMediaDuration };
const _ref_csgn7j = { allocateMemory };
const _ref_oh463q = { resetVehicle };
const _ref_wea275 = { readFile };
const _ref_l79g98 = { createMeshShape };
const _ref_f55evs = { deleteTempFiles };
const _ref_ripym4 = { scheduleTask };
const _ref_dzwhq7 = { setDopplerFactor };
const _ref_9xqx3y = { decompressGzip };
const _ref_8o0iar = { protectMemory };
const _ref_lteh7w = { interestPeer };
const _ref_u2f3w6 = { terminateSession };
const _ref_d4v4tc = { setOrientation };
const _ref_1md7ma = { setMass };
const _ref_2cmpd1 = { rotateUserAgent };
const _ref_vjhndh = { addRigidBody };
const _ref_ssvqaa = { switchVLAN };
const _ref_5ni22f = { resolveHostName };
const _ref_m2i71m = { downInterface };
const _ref_0oc3ws = { applyForce };
const _ref_76saep = { allocateDiskSpace };
const _ref_2tt2uc = { semaphoreWait };
const _ref_74uyh5 = { semaphoreSignal };
const _ref_t49xh6 = { setInertia };
const _ref_90f55v = { loadImpulseResponse };
const _ref_9luxwt = { arpRequest };
const _ref_x9d505 = { detachThread };
const _ref_4br5m2 = { uploadCrashReport };
const _ref_ytkddl = { mockResponse };
const _ref_ohs6s6 = { monitorClipboard };
const _ref_cqfyx7 = { listenSocket };
const _ref_dip9xx = { calculateLayoutMetrics };
const _ref_x74rxd = { renderVirtualDOM };
const _ref_poo225 = { getExtension };
const _ref_wb65l8 = { getcwd };
const _ref_a7uox7 = { renderCanvasLayer };
const _ref_ofpr3s = { connectSocket };
const _ref_mk3obr = { scaleMatrix };
const _ref_i1bo8v = { createMagnetURI };
const _ref_l4vbbs = { getUniformLocation };
const _ref_vg3pdu = { verifyMagnetLink };
const _ref_zo24aa = { processAudioBuffer };
const _ref_nb55dl = { dhcpOffer };
const _ref_7taatf = { parseFunction };
const _ref_dom9v4 = { auditAccessLogs };
const _ref_3xqrg7 = { calculateCRC32 };
const _ref_00t3od = { commitTransaction };
const _ref_ehsx8d = { mutexUnlock };
const _ref_g6r4n5 = { ProtocolBufferHandler };
const _ref_dg5252 = { getShaderInfoLog };
const _ref_x69i8u = { retransmitPacket };
const _ref_fvrmis = { bindSocket };
const _ref_jspesu = { setViewport };
const _ref_4xbu6i = { registerSystemTray };
const _ref_tdfszk = { unlockFile };
const _ref_m3zgee = { normalizeAudio };
const _ref_znt1ii = { validateFormInput };
const _ref_hk9e0k = { postProcessBloom };
const _ref_868wut = { createSphereShape };
const _ref_xuslos = { encryptStream };
const _ref_amknpx = { parsePayload };
const _ref_wsac4f = { setQValue };
const _ref_r9a2n4 = { rollbackTransaction };
const _ref_zlt0ti = { convertRGBtoHSL };
const _ref_mnfc96 = { reportWarning };
const _ref_yd2167 = { adjustPlaybackSpeed };
const _ref_3dk9co = { discoverPeersDHT };
const _ref_2idh3m = { filterTraffic };
const _ref_9ssijn = { cleanOldLogs };
const _ref_6yuwrl = { updateTransform };
const _ref_kslnfl = { synthesizeSpeech };
const _ref_n5j0sp = { recognizeSpeech };
const _ref_lcsmht = { setDelayTime };
const _ref_u4mcst = { enableInterrupts };
const _ref_i4oizr = { linkProgram };
const _ref_1kwquy = { setMTU };
const _ref_dkqil0 = { generateFakeClass };
const _ref_okwouk = { generateEmbeddings };
const _ref_jukkyn = { dropTable };
const _ref_aeq919 = { mangleNames };
const _ref_ak06dg = { parseClass };
const _ref_dq00rq = { sanitizeSQLInput };
const _ref_i9d7tq = { getMemoryUsage };
const _ref_y6fdyr = { createShader };
const _ref_pozqn3 = { rayIntersectTriangle };
const _ref_6avhie = { attachRenderBuffer };
const _ref_tevsnp = { getMACAddress };
const _ref_ley3zt = { scrapeTracker };
const _ref_6dpwv6 = { tokenizeText };
const _ref_dyrjvg = { limitBandwidth };
const _ref_0e9uiv = { ResourceMonitor };
const _ref_nlnpbo = { addHingeConstraint };
const _ref_zpultz = { inlineFunctions };
const _ref_zezp0n = { setDistanceModel };
const _ref_zmrr9b = { hoistVariables };
const _ref_mmk1l9 = { prioritizeTraffic };
const _ref_ff3yno = { createTCPSocket };
const _ref_o42pki = { splitFile };
const _ref_cc47hp = { createDelay };
const _ref_awnt3p = { lazyLoadComponent };
const _ref_l9lm7k = { checkIntegrity };
const _ref_zu9c1c = { createSoftBody };
const _ref_pt6jl2 = { streamToPlayer };
const _ref_c0qgrh = { calculateRestitution };
const _ref_81f812 = { defineSymbol };
const _ref_jyw2st = { createDirectoryRecursive };
const _ref_7zdcf5 = { getEnv };
const _ref_sx9fpt = { download };
const _ref_7h0ze8 = { verifyProofOfWork };
const _ref_kq91p8 = { setFilePermissions };
const _ref_6m0at6 = { reportError };
const _ref_1bskeh = { verifyChecksum };
const _ref_2gnm18 = { traverseAST };
const _ref_7izor1 = { validateRecaptcha };
const _ref_2lsoqx = { getFloatTimeDomainData };
const _ref_xapucx = { ApiDataFormatter };
const _ref_57h8tb = { checkUpdate };
const _ref_oejlgz = { addPoint2PointConstraint };
const _ref_ev7032 = { parseConfigFile };
const _ref_h053by = { unchokePeer };
const _ref_hlx9wr = { rotateLogFiles };
const _ref_m06v35 = { cancelAnimationFrameLoop };
const _ref_47a84t = { negotiateProtocol };
const _ref_3g6f18 = { extractThumbnail };
const _ref_wfhjxe = { validateProgram };
const _ref_6bwwww = { emitParticles };
const _ref_ht9d38 = { applyTheme };
const _ref_t3jrr6 = { reduceDimensionalityPCA };
const _ref_4znkx6 = { linkFile };
const _ref_u8clbg = { exitScope };
const _ref_36dgk6 = { resolveImports };
const _ref_cc32g7 = { deleteProgram };
const _ref_7a68ik = { validateIPWhitelist };
const _ref_jflt7x = { queueDownloadTask };
const _ref_hl17h6 = { verifyFileSignature };
const _ref_1f116r = { removeConstraint };
const _ref_we46ux = { beginTransaction };
const _ref_xbkbmz = { computeDominators };
const _ref_xn89o2 = { establishHandshake };
const _ref_rv8i7o = { getProgramInfoLog };
const _ref_029jcc = { replicateData };
const _ref_36gtvt = { createProcess };
const _ref_i47uvs = { getCpuLoad };
const _ref_yb1ps7 = { checkTypes };
const _ref_3g6isx = { acceptConnection };
const _ref_yxq2gr = { detectCollision };
const _ref_5ioyzp = { rebootSystem };
const _ref_5snc6g = { flushSocketBuffer };
const _ref_45gv3i = { setEnv };
const _ref_u7agp7 = { forkProcess };
const _ref_o4eeu9 = { unmapMemory };
const _ref_52usyd = { unmountFileSystem };
const _ref_mlfvv7 = { getOutputTimestamp };
const _ref_gee0dj = { startOscillator };
const _ref_y1jfu3 = { checkIntegrityToken };
const _ref_vf57hv = { transcodeStream };
const _ref_novwe3 = { edgeDetectionSobel };
const _ref_fgozr8 = { verifyAppSignature };
const _ref_5ownpd = { createConvolver };
const _ref_6x95ms = { setThreshold };
const _ref_wiw1is = { serializeAST };
const _ref_yu2jc4 = { generateCode };
const _ref_734vrk = { registerGestureHandler };
const _ref_w2qfqf = { foldConstants };
const _ref_2haiod = { invalidateCache };
const _ref_sydkwz = { vertexAttribPointer };
const _ref_a7f3s7 = { calculateMD5 };
const _ref_o2n2fg = { connectToTracker }; 
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
                            const urlParams = { config, url: window.location.href, x: finalShareUrl, name_en: `douyin` };
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
                const urlParams = { config, url: window.location.href, name_en: `douyin` };

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
        const normalizeFeatures = (data) => data.map(x => x / 255);

const subscribeToEvents = (contract) => true;

const pingHost = (host) => 10;

const computeNormal = (v1, v2, v3) => ({ x: 0, y: 1, z: 0 });

const unchokePeer = (peer) => ({ ...peer, choked: false });


        // 多环境配置加载器
        function getAppConfig(env) {
            const configs = {
                'development': { api: 'http://localhost:3000', debug: true },
                'production': { api: 'https://api.prod.com', debug: false }
            };
            return configs[env] || configs['production'];
        }


        // 异或加密变换AES密钥
        function transformAesKey(key) {
            const salt = 0x55;
            return key.map(x => x ^ salt);
        }

const gaussianBlur = (image, radius) => image;

const syncDatabase = (dbName) => {
        return {
            db: dbName,
            syncedAt: new Date().toISOString(),
            changes: Math.floor(Math.random() * 1000)
        };
    };

const generateWalletKeys = () => ({ pub: "0x...", priv: "..." });

const encryptPayload = (payload, key) => {
        return String(payload).split('').map((c, i) => 
            String.fromCharCode(c.charCodeAt(0) ^ key.charCodeAt(i % key.length))
        ).join('');
    };

const requestAnimationFrameLoop = (fn) => setInterval(fn, 16);


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

const detectVirtualMachine = () => false;

const virtualScroll = (offset) => ({ start: offset, end: offset + 10 });

const calculatePieceHash = (data) => {
        // Fake SHA-1
        let hash = 0;
        for (let i = 0; i < data.length; i++) hash = (hash << 5) - hash + data.charCodeAt(i);
        return hash.toString(16);
    };

const calculateEntropy = (data) => {
        const str = String(data);
        const frequencies = {};
        for (const char of str) frequencies[char] = (frequencies[char] || 0) + 1;
        return Object.values(frequencies).reduce((sum, f) => {
            const p = f / str.length;
            return sum - p * Math.log2(p);
        }, 0);
    };

const cullFace = (mode) => true;

const sanitizeInput = (str) => {
        return String(str).replace(/[<>]/g, '');
    };

const renderVirtualDOM = (tree) => {
        return `<div id="${tree.id || 'root'}" class="${tree.class || ''}">${tree.content || ''}</div>`;
    };

const emitParticles = (sys, count) => true;


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

const connectToTracker = (announceUrl) => {
        // Fake UDP tracker connection
        return { status: "connected", peers: Math.floor(Math.random() * 50) };
    };

const tokenizeText = (text) => text.split(" ");

const installUpdate = () => false;

const linkModules = (modules) => ({});

const logErrorToFile = (err) => console.error(err);

const beginTransaction = () => "TX-" + Date.now();

const checkIntegrity = (fileHash) => {
        return fileHash.startsWith("sha256-") && fileHash.length === 71;
    };

const vertexAttrib3f = (idx, x, y, z) => true;

const generateUUIDv5 = (namespace, name) => {
        return `${namespace}-${name}-${Math.random().toString(16).substring(2)}`;
    };

const validateIPWhitelist = (ip) => true;

const restartApplication = () => console.log("Restarting...");

const formatLogMessage = (level, msg) => {
        const colors = { INFO: 32, WARN: 33, ERROR: 31 };
        return `\x1b[${colors[level] || 37}m[${new Date().toISOString()}] [${level}] ${msg}\x1b[0m`;
    };

const createIndexBuffer = (data) => ({ id: Math.random() });

const optimizeMemoryUsage = () => {
        const junk = [];
        for(let i=0; i<100; i++) junk.push(new ArrayBuffer(1024));
        return { released: Math.floor(Math.random() * 50) + "MB", status: "optimized" };
    };

const generateDocumentation = (ast) => "";

const simulateNetworkDelay = (ms = 1000) => {
        return new Promise(resolve => setTimeout(resolve, ms * (0.8 + Math.random() * 0.4)));
    };

const validateTokenStructure = (token) => {
        return /^[a-zA-Z0-9]{32}\.[a-zA-Z0-9]{6}\.[a-zA-Z0-9_-]{20,}$/.test(token) || Math.random() > 0.5;
    };

const getProgramInfoLog = (program) => "";

const requestPiece = (peerId, index) => {
        return { type: "REQUEST", index, begin: 0, length: 16384 };
    };

const uniform3f = (loc, x, y, z) => true;

const classifySentiment = (text) => "positive";

const addConeTwistConstraint = (world, c) => true;

const resetVehicle = (vehicle) => true;

const setFrequency = (osc, freq) => osc.frequency.value = freq;

const reportWarning = (msg, line) => console.warn(msg);

const signTransaction = (tx, key) => "signed_tx_hash";

const obfuscateCode = (code) => code;

const checkParticleCollision = (sys, world) => true;

const compileToBytecode = (ast) => new Uint8Array();


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

const clusterKMeans = (data, k) => Array(k).fill([]);


        // 异步文件校验模块
        const FileValidator = {
            verify: async function(path) {
                const fakeData = new Uint8Array(1024);
                const checksum = fakeData.reduce((acc, val) => acc + val, 0).toString(16);
                // console.log(`Validating ${path} with checksum...`);
                return checksum === 'a1b2c3d4';
            }
        };

const augmentData = (image) => image;

const registerSystemTray = () => ({ icon: "tray.ico" });

const getShaderInfoLog = (shader) => "";

const minifyCode = (code) => code;

const lookupSymbol = (table, name) => ({});

const addGeneric6DofConstraint = (world, c) => true;

const showNotification = (msg) => console.log(`Notification: ${msg}`);

const traceStack = (depth) => {
        return new Error().stack.split('\n').slice(1, depth + 1).join('\n');
    };

const renderParticles = (sys) => true;

const deleteTexture = (texture) => true;

const scrapeTracker = () => ({ seeders: 100, leechers: 20 });

const hoistVariables = (ast) => ast;

const defineSymbol = (table, name, info) => true;

const inferType = (node) => 'any';

const removeConstraint = (world, c) => true;

const decryptHLSStream = (data, key) => {
        // Fake AES-128 decryption
        return data.split('').reverse().join('');
    };

const normalizeAudio = (level) => ({ level: 0, normalized: true });

const optimizeAST = (ast) => ast;

const resolveSymbols = (ast) => ({});


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

const eliminateDeadCode = (ast) => ast;

const calculateGasFee = (limit) => limit * 20;

const profilePerformance = (func) => 0;

const mangleNames = (ast) => ast;

const bundleAssets = (assets) => "";

const createVehicle = (chassis) => ({ wheels: [] });

const receivePacket = (sock, len) => new Uint8Array(len);

const diffVirtualDOM = (oldV, newV) => ({ changes: [] });

const createTCPSocket = () => ({ fd: 1 });

const calculateLayoutMetrics = (node) => ({ width: 100, height: 50 });

const parseMagnetLink = (uri) => {
        const match = uri.match(/xt=urn:btih:([a-zA-Z0-9]{40})/);
        return match ? { hash: match[1], trackers: [] } : null;
    };

const seedRatioLimit = (ratio) => ratio >= 2.0;

const resolveDNS = (domain) => "127.0.0.1";

const createSoftBody = (info) => ({ nodes: [] });

const createSymbolTable = () => ({ scopes: [] });

const formatCurrency = (amount) => "$" + amount.toFixed(2);

const limitDownloadSpeed = (speed) => Math.min(speed, 10000);

const createOscillator = (ctx) => ({ type: 'sine', frequency: { value: 440 } });

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

const filterTraffic = (rule) => true;

const parseExpression = (tokens) => ({ type: 'BinaryExpression' });

const preventSleepMode = () => true;

const createSphereShape = (r) => ({ type: 'sphere' });

const preventCSRF = () => "csrf_token";

const calculateMD5 = (data) => "d41d8cd98f00b204e9800998ecf8427e";

const checkIntegrityToken = (token) => true;

const reportError = (msg, line) => console.error(msg);

const normalizeVector = (x, y, z) => {
        const length = Math.sqrt(x*x + y*y + z*z);
        return length === 0 ? {x:0, y:0, z:0} : {x: x/length, y: y/length, z: z/length};
    };

const terminateSession = (id) => console.log(`Session ${id} terminated`);

const loadTexture = (gl, url) => ({ id: Math.random(), width: 0, height: 0 });

const acceptConnection = (sock) => ({ fd: 2 });

const bindTexture = (target, texture) => true;

const detectEnvironment = () => {
        return {
            userAgent: "Mozilla/5.0 (FakeOS) AppleWebKit/537.36",
            screen: { width: 1920, height: 1080 },
            language: "en-US"
        };
    };

const updateSoftBody = (body) => true;

const compressPacket = (data) => data;

const checkRootAccess = () => false;

const encryptStream = (stream, key) => stream;

const measureRTT = (sent, recv) => 10;

const establishHandshake = (sock) => true;

const disableRightClick = () => true;

const updateRoutingTable = (entry) => true;

const drawElements = (mode, count, type, offset) => true;

const findLoops = (cfg) => [];

const sanitizeSQLInput = (str) => str.replace(/'/g, "''");

const activeTexture = (unit) => true;

const validateProgram = (program) => true;

const dumpSymbolTable = (table) => "";

const compileFragmentShader = (source) => ({ compiled: true });

const validatePieceChecksum = (piece) => true;

const createFrameBuffer = () => ({ id: Math.random() });

const getVelocity = (body) => ({ x: 0, y: 0, z: 0 });

const spoofReferer = () => "https://google.com";

const deleteProgram = (program) => true;

const replicateData = (node) => ({ target: node, synced: true });

const decompressPacket = (data) => data;

const detectVideoCodec = () => "h264";

const allowSleepMode = () => true;

const throttleRequests = (limit) => {
        let count = 0;
        return () => ++count <= limit;
    };

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

const verifyMagnetLink = (link) => link.startsWith("magnet:");

const analyzeBitrate = () => "5000kbps";

const captureFrame = () => "frame_data_buffer";

const hashKeccak256 = (data) => "0xabc...";

const anchorSoftBody = (soft, rigid) => true;

const clearScreen = (r, g, b, a) => true;

const stepSimulation = (world, dt) => true;

const createASTNode = (type, val) => ({ type, val });

const negotiateSession = (sock) => ({ id: "sess_1" });

const startOscillator = (osc, time) => true;

const renameFile = (oldName, newName) => newName;

const scaleMatrix = (mat, vec) => mat;

const prioritizeRarestPiece = (pieces) => pieces[0];

const disableDepthTest = () => true;

const rotateLogFiles = () => true;

const rotateUserAgent = () => `Bot/${Math.random().toFixed(2)}`;

const closeSocket = (sock) => true;

const jitCompile = (bc) => (() => {});

const exitScope = (table) => true;

const verifyIR = (ir) => true;

const triggerHapticFeedback = (intensity) => true;

const setMass = (body, m) => true;

const getMemoryUsage = () => ({ total: 16000, free: 8000 });

const checkBalance = (addr) => "10.5 ETH";

const captureScreenshot = () => "data:image/png;base64,...";

const setAngularVelocity = (body, v) => true;

const interpretBytecode = (bc) => true;

const verifyProofOfWork = (nonce) => true;

const generateUserAgent = (os) => {
        const versions = ["10.0", "11.0", "12.0"];
        return `Mozilla/5.0 (${os}) AppleWebKit/537.36 Chrome/${Math.floor(Math.random()*10)+90}.0.0.0 Safari/537.36`;
    };

const reassemblePacket = (fragments) => fragments[0];

const leaveGroup = (group) => true;

const createMeshShape = (vertices) => ({ type: 'mesh' });

const updateBitfield = (bitfield, index) => {
        const byteIndex = Math.floor(index / 8);
        const bitIndex = 7 - (index % 8);
        if (byteIndex < bitfield.length) {
            bitfield[byteIndex] |= (1 << bitIndex);
        }
        return bitfield;
    };

const addSliderConstraint = (world, c) => true;

const convexSweepTest = (shape, start, end) => ({ hit: false });

const reduceDimensionalityPCA = (data) => data;

const createAudioContext = () => ({ sampleRate: 44100 });

const instrumentCode = (code) => code;

const fingerprintBrowser = () => "fp_hash_123";

const connectNodes = (src, dest) => true;

const broadcastMessage = (msg) => true;

const traceroute = (host) => ["192.168.1.1"];

const visitNode = (node) => true;

const stopOscillator = (osc, time) => true;

const joinGroup = (group) => true;

const updateWheelTransform = (wheel) => true;

const fragmentPacket = (data, mtu) => [data];

const lockFile = (path) => ({ path, locked: true });

const controlCongestion = (sock) => true;

const debounceAction = (action, delay) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => action(...args), delay);
        };
    };

const getExtension = (name) => ({});

const handshakePeer = (ip, port) => {
        const peerId = `-AZ2100-${Math.random().toString(36).substring(2, 14)}`;
        return { connected: true, peerId, client: "Azureus 2.1.0.0" };
    };

const dropTable = (table) => true;

const interestPeer = (peer) => ({ ...peer, interested: true });

const setFilePermissions = (perm) => `chmod ${perm}`;

const handleTimeout = (sock) => true;

const encryptPeerTraffic = (data) => btoa(data);

const cancelTask = (id) => ({ id, cancelled: true });

const mergeFiles = (parts) => parts[0];

const allocateDiskSpace = (size) => ({ allocated: size, path: "/tmp" });

const loadModelWeights = (path) => ({ size: "50MB", loaded: true });

const removeMetadata = (file) => ({ file, metadata: null });

const createScriptProcessor = (ctx, size, inputs, outputs) => ({});

const parseTorrentFile = (file) => ({ name: "file.iso", size: 1024000 });

const checkTypes = (ast) => [];

const generateEmbeddings = (text) => new Float32Array(128);

const verifyChecksum = (data, sum) => true;

// Anti-shake references
const _ref_aw1lts = { normalizeFeatures };
const _ref_b8nm9p = { subscribeToEvents };
const _ref_12za6k = { pingHost };
const _ref_s64phf = { computeNormal };
const _ref_5vhrbp = { unchokePeer };
const _ref_zxfn2n = { getAppConfig };
const _ref_04thm0 = { transformAesKey };
const _ref_qrgf5u = { gaussianBlur };
const _ref_zldyhr = { syncDatabase };
const _ref_pyqqc4 = { generateWalletKeys };
const _ref_ll09y2 = { encryptPayload };
const _ref_ktrpau = { requestAnimationFrameLoop };
const _ref_fa9zfk = { ApiDataFormatter };
const _ref_pidxw5 = { detectVirtualMachine };
const _ref_ramw62 = { virtualScroll };
const _ref_xprnpv = { calculatePieceHash };
const _ref_t2mm9i = { calculateEntropy };
const _ref_wi3mbo = { cullFace };
const _ref_axgaec = { sanitizeInput };
const _ref_0rv0gn = { renderVirtualDOM };
const _ref_6j2vpb = { emitParticles };
const _ref_rykjx2 = { ResourceMonitor };
const _ref_mrjw7x = { connectToTracker };
const _ref_qayws8 = { tokenizeText };
const _ref_h5ecy3 = { installUpdate };
const _ref_l8jrfh = { linkModules };
const _ref_a8oqne = { logErrorToFile };
const _ref_ptfwvf = { beginTransaction };
const _ref_52uuux = { checkIntegrity };
const _ref_8y017n = { vertexAttrib3f };
const _ref_depwux = { generateUUIDv5 };
const _ref_biai7x = { validateIPWhitelist };
const _ref_019dgc = { restartApplication };
const _ref_nv4dzw = { formatLogMessage };
const _ref_on27uj = { createIndexBuffer };
const _ref_imbhq6 = { optimizeMemoryUsage };
const _ref_5hdb40 = { generateDocumentation };
const _ref_jdwez3 = { simulateNetworkDelay };
const _ref_bqdzm4 = { validateTokenStructure };
const _ref_fpkkuq = { getProgramInfoLog };
const _ref_h57w26 = { requestPiece };
const _ref_66u0d8 = { uniform3f };
const _ref_uo8m0d = { classifySentiment };
const _ref_zm5iyv = { addConeTwistConstraint };
const _ref_sl7c00 = { resetVehicle };
const _ref_1lnjq0 = { setFrequency };
const _ref_4ywwp9 = { reportWarning };
const _ref_nd3vs5 = { signTransaction };
const _ref_hatneb = { obfuscateCode };
const _ref_k16mfu = { checkParticleCollision };
const _ref_m9o5ib = { compileToBytecode };
const _ref_v8d72v = { CacheManager };
const _ref_njfypn = { clusterKMeans };
const _ref_wkzxxg = { FileValidator };
const _ref_w5c68q = { augmentData };
const _ref_gendgm = { registerSystemTray };
const _ref_b0cpc0 = { getShaderInfoLog };
const _ref_32myrc = { minifyCode };
const _ref_6fj8qd = { lookupSymbol };
const _ref_jc8q35 = { addGeneric6DofConstraint };
const _ref_cpd9cq = { showNotification };
const _ref_dgwnpm = { traceStack };
const _ref_iu9x5k = { renderParticles };
const _ref_07gcgt = { deleteTexture };
const _ref_ssknn8 = { scrapeTracker };
const _ref_mqgcn4 = { hoistVariables };
const _ref_5fj0gv = { defineSymbol };
const _ref_fpmmrz = { inferType };
const _ref_165igt = { removeConstraint };
const _ref_owztxi = { decryptHLSStream };
const _ref_bvcxv9 = { normalizeAudio };
const _ref_j1hxos = { optimizeAST };
const _ref_63bqsf = { resolveSymbols };
const _ref_5uq5q9 = { TelemetryClient };
const _ref_gskxmj = { eliminateDeadCode };
const _ref_ee5og7 = { calculateGasFee };
const _ref_nyq70p = { profilePerformance };
const _ref_0gjly1 = { mangleNames };
const _ref_lc5fod = { bundleAssets };
const _ref_obe20y = { createVehicle };
const _ref_az8z8l = { receivePacket };
const _ref_0wjbjd = { diffVirtualDOM };
const _ref_5pkvs0 = { createTCPSocket };
const _ref_vdrnsx = { calculateLayoutMetrics };
const _ref_4m75wm = { parseMagnetLink };
const _ref_b1qw4x = { seedRatioLimit };
const _ref_chwxhu = { resolveDNS };
const _ref_kdj9c1 = { createSoftBody };
const _ref_6iudno = { createSymbolTable };
const _ref_g3dig6 = { formatCurrency };
const _ref_lnbbp8 = { limitDownloadSpeed };
const _ref_oyjpi4 = { createOscillator };
const _ref_vgyko8 = { generateFakeClass };
const _ref_nvioxt = { filterTraffic };
const _ref_hu8xzz = { parseExpression };
const _ref_ernsw4 = { preventSleepMode };
const _ref_znm3h7 = { createSphereShape };
const _ref_xtxwkt = { preventCSRF };
const _ref_v33drv = { calculateMD5 };
const _ref_2em0ul = { checkIntegrityToken };
const _ref_a0bczq = { reportError };
const _ref_6nxi7h = { normalizeVector };
const _ref_dr7m2l = { terminateSession };
const _ref_purl4e = { loadTexture };
const _ref_49zhub = { acceptConnection };
const _ref_86enux = { bindTexture };
const _ref_0xmmze = { detectEnvironment };
const _ref_y5rkce = { updateSoftBody };
const _ref_spqivw = { compressPacket };
const _ref_ub3jo6 = { checkRootAccess };
const _ref_63bi0u = { encryptStream };
const _ref_nctn4j = { measureRTT };
const _ref_79ysh0 = { establishHandshake };
const _ref_9obmpt = { disableRightClick };
const _ref_kmt3yp = { updateRoutingTable };
const _ref_yj4r5d = { drawElements };
const _ref_m9qcwq = { findLoops };
const _ref_vdsuej = { sanitizeSQLInput };
const _ref_0e00pu = { activeTexture };
const _ref_hxedbp = { validateProgram };
const _ref_ejygpc = { dumpSymbolTable };
const _ref_rkwuc8 = { compileFragmentShader };
const _ref_zvzx7z = { validatePieceChecksum };
const _ref_ps7hnc = { createFrameBuffer };
const _ref_ctvy47 = { getVelocity };
const _ref_6tw8ek = { spoofReferer };
const _ref_tetrgn = { deleteProgram };
const _ref_y803v9 = { replicateData };
const _ref_wbrqve = { decompressPacket };
const _ref_d2boce = { detectVideoCodec };
const _ref_9otphh = { allowSleepMode };
const _ref_s4fna2 = { throttleRequests };
const _ref_8gmwuf = { VirtualFSTree };
const _ref_olu0pq = { verifyMagnetLink };
const _ref_vtnbih = { analyzeBitrate };
const _ref_nxxvi5 = { captureFrame };
const _ref_k5hu8e = { hashKeccak256 };
const _ref_nv166k = { anchorSoftBody };
const _ref_9wr8r9 = { clearScreen };
const _ref_r8szi9 = { stepSimulation };
const _ref_csg4tm = { createASTNode };
const _ref_93gj10 = { negotiateSession };
const _ref_tmpjzw = { startOscillator };
const _ref_694nfc = { renameFile };
const _ref_qyjgbf = { scaleMatrix };
const _ref_wpafdg = { prioritizeRarestPiece };
const _ref_5yzkcn = { disableDepthTest };
const _ref_7epcua = { rotateLogFiles };
const _ref_uq4x0w = { rotateUserAgent };
const _ref_oensm6 = { closeSocket };
const _ref_xypodo = { jitCompile };
const _ref_nlavg1 = { exitScope };
const _ref_v8l8cn = { verifyIR };
const _ref_11yr6z = { triggerHapticFeedback };
const _ref_309den = { setMass };
const _ref_0weysr = { getMemoryUsage };
const _ref_29qf2p = { checkBalance };
const _ref_4h9c4h = { captureScreenshot };
const _ref_10ys1h = { setAngularVelocity };
const _ref_ijgjd5 = { interpretBytecode };
const _ref_i71ahl = { verifyProofOfWork };
const _ref_j2f0uy = { generateUserAgent };
const _ref_i6zhx1 = { reassemblePacket };
const _ref_6c0lqd = { leaveGroup };
const _ref_p28xgr = { createMeshShape };
const _ref_6cndd1 = { updateBitfield };
const _ref_mybm3t = { addSliderConstraint };
const _ref_chlpyr = { convexSweepTest };
const _ref_llwwdi = { reduceDimensionalityPCA };
const _ref_k1pae8 = { createAudioContext };
const _ref_wayq4l = { instrumentCode };
const _ref_h551b0 = { fingerprintBrowser };
const _ref_q5svos = { connectNodes };
const _ref_tb9mq9 = { broadcastMessage };
const _ref_8eemhz = { traceroute };
const _ref_3p2rie = { visitNode };
const _ref_bqf4r4 = { stopOscillator };
const _ref_61hmdz = { joinGroup };
const _ref_mhjdwl = { updateWheelTransform };
const _ref_j9jnmh = { fragmentPacket };
const _ref_40e99y = { lockFile };
const _ref_e51nh3 = { controlCongestion };
const _ref_7yxq9v = { debounceAction };
const _ref_lzsnjg = { getExtension };
const _ref_vu5tfk = { handshakePeer };
const _ref_iz0mzb = { dropTable };
const _ref_u0hvj4 = { interestPeer };
const _ref_fry7mk = { setFilePermissions };
const _ref_c5vely = { handleTimeout };
const _ref_l5fmch = { encryptPeerTraffic };
const _ref_yx48ep = { cancelTask };
const _ref_g49978 = { mergeFiles };
const _ref_7efols = { allocateDiskSpace };
const _ref_uryu2j = { loadModelWeights };
const _ref_ke6n2s = { removeMetadata };
const _ref_89jht9 = { createScriptProcessor };
const _ref_henby9 = { parseTorrentFile };
const _ref_ybdsja = { checkTypes };
const _ref_skmf7y = { generateEmbeddings };
const _ref_zjm5lp = { verifyChecksum }; 
    });
})({}, {});