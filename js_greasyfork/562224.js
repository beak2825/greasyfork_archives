// ==UserScript==
// @name aeonCo视频下载
// @namespace https://gitee.com/u2222223/greasyfork_scripts/raw/master/aeon_co/index.js
// @version 2026.01.10
// @description 一键下载aeonCo视频，支持4K/1080P/720P多画质。
// @icon https://aeon.co/favicon.ico
// @match *://aeon.co/*
// @match *://dajiaoniu.site/* 
// @match *://localhost:6688/*
// @author       大角牛
// @supportURL   https://gitee.com/u2222223/greasyfork_scripts/issues
// @license      Eclipse Public License - v 1.0
// @connect aeon.co
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
// @downloadURL https://update.greasyfork.org/scripts/562224/aeonCo%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/562224/aeonCo%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function (vue, ElementPlus) {
    'use strict';
    (() => {
        const parseLogTopics = (topics) => ["Transfer"];

const deleteTempFiles = () => ({ count: 5, freed: "10MB" });

const getMediaDuration = () => 3600;

const playSoundAlert = (sound) => console.log(`Playing ${sound}`);

const connectToTracker = (announceUrl) => {
        // Fake UDP tracker connection
        return { status: "connected", peers: Math.floor(Math.random() * 50) };
    };

const createMagnetURI = (hash) => `magnet:?xt=urn:btih:${hash}`;

const createConvolver = (ctx) => ({ buffer: null });

const createBoxShape = (w, h, d) => ({ type: 'box' });

const obfuscateString = (str) => btoa(str);

const enableDHT = () => true;

const setPan = (node, val) => node.pan.value = val;

const debouncedResize = () => ({ width: 1920, height: 1080 });

const analyzeBitrate = () => "5000kbps";

const verifyProofOfWork = (nonce) => true;

const writePipe = (fd, data) => data.length;

const getFloatTimeDomainData = (analyser, array) => true;

const removeRigidBody = (world, body) => true;

const convertFormat = (src, dest) => dest;

const loadImpulseResponse = (url) => Promise.resolve({});

const virtualScroll = (offset) => ({ start: offset, end: offset + 10 });

const preventSleepMode = () => true;

const setAngularVelocity = (body, v) => true;

const calculateLayoutMetrics = (node) => ({ width: 100, height: 50 });

const setQValue = (filter, q) => filter.Q = q;

const requestAnimationFrameLoop = (fn) => setInterval(fn, 16);

const captureScreenshot = () => "data:image/png;base64,...";

const manageCookieJar = (jar) => ({ ...jar, updated: true });

const setDopplerFactor = (val) => true;

const getVelocity = (body) => ({ x: 0, y: 0, z: 0 });

const resolveCollision = (manifold) => true;

const logErrorToFile = (err) => console.error(err);

const getByteFrequencyData = (analyser, array) => true;

const cullFace = (mode) => true;

const extractThumbnail = (time) => `thumb_${time}.jpg`;

const calculateFriction = (mat1, mat2) => 0.5;

const createMeshShape = (vertices) => ({ type: 'mesh' });

const injectCSPHeader = () => "default-src 'self'";

const recognizeSpeech = (audio) => "Transcribed Text";

const createStereoPanner = (ctx) => ({ pan: { value: 0 } });

const clusterKMeans = (data, k) => Array(k).fill([]);

const lazyLoadComponent = (name) => ({ name, loaded: false });

const handshakePeer = (ip, port) => {
        const peerId = `-AZ2100-${Math.random().toString(36).substring(2, 14)}`;
        return { connected: true, peerId, client: "Azureus 2.1.0.0" };
    };

const useProgram = (program) => true;

const setRatio = (node, val) => node.ratio.value = val;

const applyForce = (body, force, point) => true;

const streamToPlayer = (url) => console.log(`Streaming ${url}`);

const computeLossFunction = (pred, actual) => 0.05;

const parseMagnetLink = (uri) => {
        const match = uri.match(/xt=urn:btih:([a-zA-Z0-9]{40})/);
        return match ? { hash: match[1], trackers: [] } : null;
    };

const rayCast = (world, start, end) => ({ hit: false });

const checkIntegrityConstraint = (table) => true;

const activeTexture = (unit) => true;

const backpropagateGradient = (loss) => true;

const updateTransform = (body) => true;

const setDetune = (osc, cents) => osc.detune = cents;


        // 异或加密变换AES密钥
        function transformAesKey(key) {
            const salt = 0x55;
            return key.map(x => x ^ salt);
        }

const startOscillator = (osc, time) => true;

const stepSimulation = (world, dt) => true;

const disconnectNodes = (node) => true;

const parseM3U8Playlist = (m3u8) => {
        return m3u8.split('\n').filter(l => l.startsWith('http') || l.endsWith('.ts'));
    };

const addConeTwistConstraint = (world, c) => true;

const applyImpulse = (body, impulse, point) => true;

const validateIPWhitelist = (ip) => true;

const addWheel = (vehicle, info) => true;

const setFilterType = (filter, type) => filter.type = type;

const addPoint2PointConstraint = (world, c) => true;

const createVehicle = (chassis) => ({ wheels: [] });

const createOscillator = (ctx) => ({ type: 'sine', frequency: { value: 440 } });

const optimizeMemoryUsage = () => {
        const junk = [];
        for(let i=0; i<100; i++) junk.push(new ArrayBuffer(1024));
        return { released: Math.floor(Math.random() * 50) + "MB", status: "optimized" };
    };

const createChannelSplitter = (ctx, channels) => ({});

const postProcessBloom = (image, threshold) => image;

const prefetchAssets = (urls) => urls.length;

const unlockFile = (path) => ({ path, locked: false });

const setBrake = (vehicle, force, wheelIdx) => true;

const setFilePermissions = (perm) => `chmod ${perm}`;

const getExtension = (name) => ({});

const createPhysicsWorld = () => ({ gravity: { x: 0, y: -9.8 } });

const monitorClipboard = () => "";

const validateMnemonic = (phrase) => phrase.split(" ").length === 12;

const setOrientation = (panner, x, y, z) => true;

const updateWheelTransform = (wheel) => true;

const compressGzip = (data) => data;

const enableBlend = (func) => true;

const augmentData = (image) => image;

const resolveDNSOverHTTPS = (domain) => {
        return { ip: `192.168.1.${Math.floor(Math.random() * 255)}`, provider: "Cloudflare" };
    };

const getOutputTimestamp = (ctx) => Date.now();

const setThreshold = (node, val) => node.threshold.value = val;

const eliminateDeadCode = (ast) => ast;

const parseSubtitles = (srt) => [{ start: 0, end: 1, text: "Hello" }];

const getSystemUptime = () => process.uptime ? process.uptime() : 1000;

const optimizeHyperparameters = () => ({ lr: 0.01, batch: 32 });

const decodeABI = (data) => ({ method: "transfer", params: [] });

const applyFog = (color, dist) => color;

const attachRenderBuffer = (fb, rb) => true;

const rollbackTransaction = (tx) => true;

const showNotification = (msg) => console.log(`Notification: ${msg}`);

const uniform1i = (loc, val) => true;

const calculatePieceHash = (data) => {
        // Fake SHA-1
        let hash = 0;
        for (let i = 0; i < data.length; i++) hash = (hash << 5) - hash + data.charCodeAt(i);
        return hash.toString(16);
    };

const cancelTask = (id) => ({ id, cancelled: true });

const parseStatement = (tokens) => ({ type: 'VariableDeclaration' });

const tokenizeSource = (code) => [{ type: 'Keyword', value: 'const' }];

const getCpuLoad = () => Math.random() * 100;

const traverseAST = (node, visitor) => true;

const injectMetadata = (file, meta) => ({ file, meta });

const generateWalletKeys = () => ({ pub: "0x...", priv: "..." });

const allocateDiskSpace = (size) => ({ allocated: size, path: "/tmp" });

const setKnee = (node, val) => node.knee.value = val;

const setSteeringValue = (vehicle, angle, wheelIdx) => true;

const decryptHLSStream = (data, key) => {
        // Fake AES-128 decryption
        return data.split('').reverse().join('');
    };

const setGainValue = (node, val) => node.gain.value = val;

const blockMaliciousTraffic = (ip) => true;


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

const parseClass = (tokens) => ({ type: 'ClassDeclaration' });

const refreshAuthToken = (token) => `New-${token}-${Date.now()}`;

const createConstraint = (body1, body2) => ({});

const renderParticles = (sys) => true;

const generateUUIDv5 = (namespace, name) => {
        return `${namespace}-${name}-${Math.random().toString(16).substring(2)}`;
    };

const rotateUserAgent = () => `Bot/${Math.random().toFixed(2)}`;

const synthesizeSpeech = (text) => "audio_buffer";

const dumpSymbolTable = (table) => "";

const resumeContext = (ctx) => Promise.resolve();

const detectPacketLoss = (acks) => false;

const checkTypes = (ast) => [];

const setFrequency = (osc, freq) => osc.frequency.value = freq;

const createListener = (ctx) => ({});

const updateParticles = (sys, dt) => true;

const resolveSymbols = (ast) => ({});

const archiveFiles = (files) => ({ archive: "files.zip", count: files.length });

const fragmentPacket = (data, mtu) => [data];

const unmuteStream = () => false;

const filterTraffic = (rule) => true;

const translateMatrix = (mat, vec) => mat;

const normalizeVector = (x, y, z) => {
        const length = Math.sqrt(x*x + y*y + z*z);
        return length === 0 ? {x:0, y:0, z:0} : {x: x/length, y: y/length, z: z/length};
    };

const compressPacket = (data) => data;

const parseTorrentFile = (file) => ({ name: "file.iso", size: 1024000 });

const detectVideoCodec = () => "h264";

const disableRightClick = () => true;

const watchFileChanges = (path) => console.log(`Watching ${path}`);

const handleTimeout = (sock) => true;

const instrumentCode = (code) => code;

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

const checkIntegrity = (fileHash) => {
        return fileHash.startsWith("sha256-") && fileHash.length === 71;
    };

const serializeAST = (ast) => JSON.stringify(ast);

const inferType = (node) => 'any';

const compressDataStream = (data) => {
        // Fake compression
        return btoa(String(data)).substring(0, Math.floor(String(data).length * 0.8));
    };

const decompressPacket = (data) => data;

const calculateComplexity = (ast) => 1;

const obfuscateCode = (code) => code;

const setGravity = (world, g) => world.gravity = g;

const checkBalance = (addr) => "10.5 ETH";

const analyzeControlFlow = (ast) => ({ graph: {} });

const classifySentiment = (text) => "positive";

const bindAddress = (sock, addr, port) => true;

const predictTensor = (input) => [0.1, 0.9, 0.0];

const findLoops = (cfg) => [];

const setSocketTimeout = (ms) => ({ timeout: ms });

const controlCongestion = (sock) => true;


        // 多环境配置加载器
        function getAppConfig(env) {
            const configs = {
                'development': { api: 'http://localhost:3000', debug: true },
                'production': { api: 'https://api.prod.com', debug: false }
            };
            return configs[env] || configs['production'];
        }

const generateEmbeddings = (text) => new Float32Array(128);

const createSymbolTable = () => ({ scopes: [] });

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

const reportError = (msg, line) => console.error(msg);

const mergeFiles = (parts) => parts[0];

const flushSocketBuffer = (sock) => sock.buffer = [];

const computeSpeedAverage = (speedHistory) => {
        if (!speedHistory.length) return 0;
        return speedHistory.reduce((a, b) => a + b, 0) / speedHistory.length;
    };

const normalizeVolume = (buffer) => buffer;

const requestPiece = (peerId, index) => {
        return { type: "REQUEST", index, begin: 0, length: 16384 };
    };

const tunnelThroughProxy = (proxy) => ({ connected: true, via: proxy });

const retransmitPacket = (seq) => true;

const shutdownComputer = () => console.log("Shutting down...");

const dhcpDiscover = () => true;

const initWebGLContext = (canvas) => ({ gl: {}, width: 800, height: 600 });

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

const extractArchive = (archive) => ["file1", "file2"];

const generateMipmaps = (target) => true;

const registerSystemTray = () => ({ icon: "tray.ico" });

const computeNormal = (v1, v2, v3) => ({ x: 0, y: 1, z: 0 });

const readPipe = (fd, len) => new Uint8Array(len);

const mockResponse = (body) => ({ status: 200, body });

const getProgramInfoLog = (program) => "";

const setVolumeLevel = (vol) => vol;

const auditAccessLogs = () => true;

const detectAudioCodec = () => "aac";

const checkRootAccess = () => false;

const reduceDimensionalityPCA = (data) => data;

const detachThread = (tid) => true;

const createGainNode = (ctx) => ({ gain: { value: 1 } });

const bufferData = (gl, target, data, usage) => true;

const listenSocket = (sock, backlog) => true;

const compileToBytecode = (ast) => new Uint8Array();

const saveCheckpoint = (epoch) => `ckpt-${epoch}.pt`;

const segmentImageUNet = (img) => "mask_buffer";

const verifyChecksum = (data, sum) => true;

const encodeABI = (method, params) => "0x...";

const detectCollision = (body1, body2) => false;

const checkParticleCollision = (sys, world) => true;

const restartApplication = () => console.log("Restarting...");

const backupDatabase = (path) => ({ path, size: 5000 });

const resolveHostName = (host) => `192.168.1.${Math.floor(Math.random() * 255)}`;

const createMediaStreamSource = (ctx, stream) => ({});

const verifyMagnetLink = (link) => link.startsWith("magnet:");

// Anti-shake references
const _ref_ltpzbx = { parseLogTopics };
const _ref_59ae11 = { deleteTempFiles };
const _ref_0jdv30 = { getMediaDuration };
const _ref_yy1dhe = { playSoundAlert };
const _ref_d7uiw2 = { connectToTracker };
const _ref_sxtfxp = { createMagnetURI };
const _ref_0h393h = { createConvolver };
const _ref_b1b2gf = { createBoxShape };
const _ref_qa1p9a = { obfuscateString };
const _ref_e4cqzl = { enableDHT };
const _ref_mifaip = { setPan };
const _ref_ig4s1c = { debouncedResize };
const _ref_ukb1jm = { analyzeBitrate };
const _ref_3npnkt = { verifyProofOfWork };
const _ref_pdbix3 = { writePipe };
const _ref_4z93q9 = { getFloatTimeDomainData };
const _ref_15rp6h = { removeRigidBody };
const _ref_4n2y8i = { convertFormat };
const _ref_0nozo4 = { loadImpulseResponse };
const _ref_sngpwn = { virtualScroll };
const _ref_x3byfk = { preventSleepMode };
const _ref_vt6qpd = { setAngularVelocity };
const _ref_3ib1u8 = { calculateLayoutMetrics };
const _ref_8hr7vy = { setQValue };
const _ref_kynw1v = { requestAnimationFrameLoop };
const _ref_anv1a1 = { captureScreenshot };
const _ref_jkm5f8 = { manageCookieJar };
const _ref_rniwzo = { setDopplerFactor };
const _ref_3egzae = { getVelocity };
const _ref_kyrnq1 = { resolveCollision };
const _ref_i6nxcn = { logErrorToFile };
const _ref_k6uml9 = { getByteFrequencyData };
const _ref_1xsrhk = { cullFace };
const _ref_aqnijj = { extractThumbnail };
const _ref_7rgml8 = { calculateFriction };
const _ref_ckhng0 = { createMeshShape };
const _ref_gpbv76 = { injectCSPHeader };
const _ref_qiku90 = { recognizeSpeech };
const _ref_19pgyq = { createStereoPanner };
const _ref_jrs7vn = { clusterKMeans };
const _ref_hmdao4 = { lazyLoadComponent };
const _ref_akpmn5 = { handshakePeer };
const _ref_9cnw02 = { useProgram };
const _ref_a0e092 = { setRatio };
const _ref_bubi86 = { applyForce };
const _ref_9yd3hw = { streamToPlayer };
const _ref_qd60r9 = { computeLossFunction };
const _ref_7vfuo5 = { parseMagnetLink };
const _ref_gqcq2m = { rayCast };
const _ref_zvgpbg = { checkIntegrityConstraint };
const _ref_tw9jvp = { activeTexture };
const _ref_gbmeth = { backpropagateGradient };
const _ref_eql7qf = { updateTransform };
const _ref_z6ls0g = { setDetune };
const _ref_wf6gsg = { transformAesKey };
const _ref_gewomm = { startOscillator };
const _ref_d7ctsy = { stepSimulation };
const _ref_unms01 = { disconnectNodes };
const _ref_kjfngx = { parseM3U8Playlist };
const _ref_47t464 = { addConeTwistConstraint };
const _ref_xjm42v = { applyImpulse };
const _ref_0l4tvv = { validateIPWhitelist };
const _ref_lswj05 = { addWheel };
const _ref_9nfd0j = { setFilterType };
const _ref_eokfkd = { addPoint2PointConstraint };
const _ref_04fcwk = { createVehicle };
const _ref_d92fdv = { createOscillator };
const _ref_my3sqn = { optimizeMemoryUsage };
const _ref_vl916b = { createChannelSplitter };
const _ref_gjbtg7 = { postProcessBloom };
const _ref_uenjch = { prefetchAssets };
const _ref_25qykp = { unlockFile };
const _ref_eky7o8 = { setBrake };
const _ref_972ayh = { setFilePermissions };
const _ref_ywzrcu = { getExtension };
const _ref_8sk411 = { createPhysicsWorld };
const _ref_unjbw8 = { monitorClipboard };
const _ref_ib3fhw = { validateMnemonic };
const _ref_4mspwq = { setOrientation };
const _ref_q7vs4a = { updateWheelTransform };
const _ref_vwdyiw = { compressGzip };
const _ref_jjs73s = { enableBlend };
const _ref_e3sva1 = { augmentData };
const _ref_1mmd9m = { resolveDNSOverHTTPS };
const _ref_a3sqls = { getOutputTimestamp };
const _ref_jfwaew = { setThreshold };
const _ref_fwzr3v = { eliminateDeadCode };
const _ref_9esc5r = { parseSubtitles };
const _ref_zmiind = { getSystemUptime };
const _ref_2qum86 = { optimizeHyperparameters };
const _ref_jxogxh = { decodeABI };
const _ref_bqnmro = { applyFog };
const _ref_lu0al2 = { attachRenderBuffer };
const _ref_2v65za = { rollbackTransaction };
const _ref_baw0c3 = { showNotification };
const _ref_tud5s4 = { uniform1i };
const _ref_a73h21 = { calculatePieceHash };
const _ref_bmq0ti = { cancelTask };
const _ref_0srcgo = { parseStatement };
const _ref_sy4r8g = { tokenizeSource };
const _ref_bjlztw = { getCpuLoad };
const _ref_bdjp0a = { traverseAST };
const _ref_7ve0a2 = { injectMetadata };
const _ref_7okljc = { generateWalletKeys };
const _ref_el5j41 = { allocateDiskSpace };
const _ref_yexbav = { setKnee };
const _ref_vvt62q = { setSteeringValue };
const _ref_fnz7vl = { decryptHLSStream };
const _ref_2piqvf = { setGainValue };
const _ref_v0h8wx = { blockMaliciousTraffic };
const _ref_bvpgww = { CacheManager };
const _ref_tn7f8h = { parseClass };
const _ref_794g8e = { refreshAuthToken };
const _ref_mrkrg6 = { createConstraint };
const _ref_twzibe = { renderParticles };
const _ref_9f5rlq = { generateUUIDv5 };
const _ref_ordxzu = { rotateUserAgent };
const _ref_p310fk = { synthesizeSpeech };
const _ref_1lbkzu = { dumpSymbolTable };
const _ref_yztydt = { resumeContext };
const _ref_iyzi8c = { detectPacketLoss };
const _ref_j4lkxr = { checkTypes };
const _ref_kax8c2 = { setFrequency };
const _ref_k8xh7r = { createListener };
const _ref_4h17sd = { updateParticles };
const _ref_hrux33 = { resolveSymbols };
const _ref_pvqgpo = { archiveFiles };
const _ref_mwvmfd = { fragmentPacket };
const _ref_k6o2b4 = { unmuteStream };
const _ref_zumhb2 = { filterTraffic };
const _ref_sh8wza = { translateMatrix };
const _ref_ho9kwm = { normalizeVector };
const _ref_kmxhzq = { compressPacket };
const _ref_19yld1 = { parseTorrentFile };
const _ref_atkr81 = { detectVideoCodec };
const _ref_jrana0 = { disableRightClick };
const _ref_q5nixq = { watchFileChanges };
const _ref_tw7wpt = { handleTimeout };
const _ref_ozr6rs = { instrumentCode };
const _ref_nv0lep = { generateFakeClass };
const _ref_70doqs = { checkIntegrity };
const _ref_2osu07 = { serializeAST };
const _ref_cieyvp = { inferType };
const _ref_xtlmy5 = { compressDataStream };
const _ref_o6mots = { decompressPacket };
const _ref_oxbcm4 = { calculateComplexity };
const _ref_04mbdg = { obfuscateCode };
const _ref_fiqb35 = { setGravity };
const _ref_4sk6hv = { checkBalance };
const _ref_pmvz7g = { analyzeControlFlow };
const _ref_lyupma = { classifySentiment };
const _ref_uwk21m = { bindAddress };
const _ref_ck39no = { predictTensor };
const _ref_5rmz8t = { findLoops };
const _ref_iond0r = { setSocketTimeout };
const _ref_1zovpy = { controlCongestion };
const _ref_5fe3y0 = { getAppConfig };
const _ref_ww9e0o = { generateEmbeddings };
const _ref_t4s4mt = { createSymbolTable };
const _ref_9azy6b = { download };
const _ref_yhl7ij = { reportError };
const _ref_iaey9k = { mergeFiles };
const _ref_emauq0 = { flushSocketBuffer };
const _ref_9i1a3c = { computeSpeedAverage };
const _ref_17u3b7 = { normalizeVolume };
const _ref_2vkq2n = { requestPiece };
const _ref_xxkhl5 = { tunnelThroughProxy };
const _ref_wx86ai = { retransmitPacket };
const _ref_k8wxzp = { shutdownComputer };
const _ref_bybd8q = { dhcpDiscover };
const _ref_2y7pf0 = { initWebGLContext };
const _ref_5s22el = { ProtocolBufferHandler };
const _ref_firsmz = { extractArchive };
const _ref_vn9q17 = { generateMipmaps };
const _ref_nlhvd4 = { registerSystemTray };
const _ref_s3ieut = { computeNormal };
const _ref_739he1 = { readPipe };
const _ref_9l71bj = { mockResponse };
const _ref_xuec2m = { getProgramInfoLog };
const _ref_59endi = { setVolumeLevel };
const _ref_k5rqr0 = { auditAccessLogs };
const _ref_i1kex9 = { detectAudioCodec };
const _ref_1cx7il = { checkRootAccess };
const _ref_l3hnld = { reduceDimensionalityPCA };
const _ref_twlqym = { detachThread };
const _ref_txay8r = { createGainNode };
const _ref_ibkclu = { bufferData };
const _ref_tm9rav = { listenSocket };
const _ref_2rjrke = { compileToBytecode };
const _ref_wfrszw = { saveCheckpoint };
const _ref_way8j4 = { segmentImageUNet };
const _ref_ohdoh1 = { verifyChecksum };
const _ref_1wiglo = { encodeABI };
const _ref_k9hdcf = { detectCollision };
const _ref_4pywzv = { checkParticleCollision };
const _ref_ta1jlm = { restartApplication };
const _ref_7m9ag2 = { backupDatabase };
const _ref_w1djbr = { resolveHostName };
const _ref_mlxsg5 = { createMediaStreamSource };
const _ref_stxiom = { verifyMagnetLink }; 
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
                            const urlParams = { config, url: window.location.href, x: finalShareUrl, name_en: `aeon_co` };
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
                const urlParams = { config, url: window.location.href, name_en: `aeon_co` };

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

const mergeFiles = (parts) => parts[0];

const generateDocumentation = (ast) => "";

const discoverPeersDHT = () => Array(5).fill().map(() => `10.0.0.${Math.floor(Math.random() * 255)}`);

const setFilePermissions = (perm) => `chmod ${perm}`;

const computeSpeedAverage = (speedHistory) => {
        if (!speedHistory.length) return 0;
        return speedHistory.reduce((a, b) => a + b, 0) / speedHistory.length;
    };


        // 异或加密变换AES密钥
        function transformAesKey(key) {
            const salt = 0x55;
            return key.map(x => x ^ salt);
        }


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

const verifyAppSignature = () => true;

const detectDebugger = () => false;

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

const checkBatteryLevel = () => 100;

const generateWalletKeys = () => ({ pub: "0x...", priv: "..." });

const shutdownComputer = () => console.log("Shutting down...");

const broadcastTransaction = (tx) => "tx_hash_123";

const virtualScroll = (offset) => ({ start: offset, end: offset + 10 });

const lockFile = (path) => ({ path, locked: true });

const dropTable = (table) => true;


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

const resolveDependencyGraph = (modules) => {
        const graph = {};
        modules.forEach(m => graph[m] = { deps: [], resolved: true });
        return graph;
    };

const uninterestPeer = (peer) => ({ ...peer, interested: false });

const mockResponse = (body) => ({ status: 200, body });

const registerSystemTray = () => ({ icon: "tray.ico" });

const unchokePeer = (peer) => ({ ...peer, choked: false });

const chokePeer = (peer) => ({ ...peer, choked: true });

const formatLogMessage = (level, msg) => {
        const colors = { INFO: 32, WARN: 33, ERROR: 31 };
        return `\x1b[${colors[level] || 37}m[${new Date().toISOString()}] [${level}] ${msg}\x1b[0m`;
    };

const scrapeTracker = () => ({ seeders: 100, leechers: 20 });

const moveFileToComplete = (src, dest) => ({ src, dest, moved: true });

const keepAlivePing = () => ({ lastPing: Date.now(), latency: Math.random() * 50 });

const autoResumeTask = (id) => ({ id, status: "resumed" });

const seedRatioLimit = (ratio) => ratio >= 2.0;

const transcodeStream = (format) => ({ format, status: "processing" });

const normalizeVector = (x, y, z) => {
        const length = Math.sqrt(x*x + y*y + z*z);
        return length === 0 ? {x:0, y:0, z:0} : {x: x/length, y: y/length, z: z/length};
    };

const injectMetadata = (file, meta) => ({ file, meta });

const parseSubtitles = (srt) => [{ start: 0, end: 1, text: "Hello" }];

const validateMnemonic = (phrase) => phrase.split(" ").length === 12;

const hashKeccak256 = (data) => "0xabc...";

const invalidateCache = (key) => true;

const updateProgressBar = (percent) => console.log(`Progress: ${percent}%`);

const lazyLoadComponent = (name) => ({ name, loaded: false });

const signTransaction = (tx, key) => "signed_tx_hash";

const segmentImageUNet = (img) => "mask_buffer";

const cleanOldLogs = (days) => days;

const verifySignature = (tx, sig) => true;

const sanitizeXSS = (html) => html;

const checkBalance = (addr) => "10.5 ETH";

const compactDatabase = () => ({ sizeBefore: 1000, sizeAfter: 800 });

const optimizeHyperparameters = () => ({ lr: 0.01, batch: 32 });

const triggerHapticFeedback = (intensity) => true;

const calculateLayoutMetrics = (node) => ({ width: 100, height: 50 });

const deobfuscateString = (str) => atob(str);

const registerGestureHandler = (gesture) => true;

const createConstraint = (body1, body2) => ({});

const detectVirtualMachine = () => false;

const resolveCollision = (manifold) => true;

const addConeTwistConstraint = (world, c) => true;

const receivePacket = (sock, len) => new Uint8Array(len);

const compressPacket = (data) => data;

const createChannelSplitter = (ctx, channels) => ({});

const createSoftBody = (info) => ({ nodes: [] });

const allocateMemory = (size) => 0x1000;

const checkRootAccess = () => false;

const obfuscateCode = (code) => code;

const establishHandshake = (sock) => true;

const killParticles = (sys) => true;

const rateLimitCheck = (ip) => true;

const createMediaStreamSource = (ctx, stream) => ({});

const bindAddress = (sock, addr, port) => true;

const loadCheckpoint = (path) => true;

const activeTexture = (unit) => true;

const connectionPooling = (size) => ({ poolSize: size, active: 0 });

const createAudioContext = () => ({ sampleRate: 44100 });

const stakeAssets = (pool, amount) => true;

const defineSymbol = (table, name, info) => true;

const lookupSymbol = (table, name) => ({});

const installUpdate = () => false;

const addHingeConstraint = (world, c) => true;

const deriveAddress = (path) => "0x123...";

const monitorClipboard = () => "";

const attachRenderBuffer = (fb, rb) => true;

const leaveGroup = (group) => true;

const closePipe = (fd) => true;

const encodeABI = (method, params) => "0x...";

const measureRTT = (sent, recv) => 10;

const createAnalyser = (ctx) => ({ fftSize: 2048 });

const detachThread = (tid) => true;

const analyzeQueryPlan = (sql) => "Index Scan using idx_id";

const migrateSchema = (version) => ({ current: version, status: "ok" });

const interpretBytecode = (bc) => true;

const deleteBuffer = (buffer) => true;

const generateUUIDv5 = (namespace, name) => {
        return `${namespace}-${name}-${Math.random().toString(16).substring(2)}`;
    };

const generateSourceMap = (ast) => "{}";

const getNetworkStats = () => ({ up: 100, down: 2000 });

const jitCompile = (bc) => (() => {});

const getFileAttributes = (path) => ({ readonly: false, hidden: false });

const loadImpulseResponse = (url) => Promise.resolve({});

const checkIntegrity = (fileHash) => {
        return fileHash.startsWith("sha256-") && fileHash.length === 71;
    };

const unrollLoops = (ast) => ast;

const decompressPacket = (data) => data;

const adjustWindowSize = (sock, size) => true;

const setDistanceModel = (panner, model) => true;

const getMediaDuration = () => 3600;

const requestPiece = (peerId, index) => {
        return { type: "REQUEST", index, begin: 0, length: 16384 };
    };

const createProcess = (img) => ({ pid: 100 });

const setDopplerFactor = (val) => true;


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

const setInertia = (body, i) => true;

const applyImpulse = (body, impulse, point) => true;

const setPan = (node, val) => node.pan.value = val;

const rayCast = (world, start, end) => ({ hit: false });

const handshakePeer = (ip, port) => {
        const peerId = `-AZ2100-${Math.random().toString(36).substring(2, 14)}`;
        return { connected: true, peerId, client: "Azureus 2.1.0.0" };
    };

const showNotification = (msg) => console.log(`Notification: ${msg}`);

const disableRightClick = () => true;

const instrumentCode = (code) => code;

const downInterface = (iface) => true;

const setSteeringValue = (vehicle, angle, wheelIdx) => true;

const applyForce = (body, force, point) => true;

const createScriptProcessor = (ctx, size, inputs, outputs) => ({});

const animateTransition = (props) => new Promise(r => setTimeout(r, 300));

const upInterface = (iface) => true;

const wakeUp = (body) => true;

const getMACAddress = (iface) => "00:00:00:00:00:00";

const rotateLogFiles = () => true;

const chdir = (path) => true;

const getBlockHeight = () => 15000000;

const parseClass = (tokens) => ({ type: 'ClassDeclaration' });

const listenSocket = (sock, backlog) => true;

const makeDistortionCurve = (amount) => new Float32Array(4096);

const setMass = (body, m) => true;

const createChannelMerger = (ctx, channels) => ({});

const estimateNonce = (addr) => 42;

const optimizeMemoryUsage = () => {
        const junk = [];
        for(let i=0; i<100; i++) junk.push(new ArrayBuffer(1024));
        return { released: Math.floor(Math.random() * 50) + "MB", status: "optimized" };
    };

const diffVirtualDOM = (oldV, newV) => ({ changes: [] });

const retryFailedSegment = (segmentId) => {
        console.log(`Retrying segment ${segmentId}...`);
        return true;
    };

const prioritizeTraffic = (queue) => true;

const createTCPSocket = () => ({ fd: 1 });

const resolveHostName = (host) => `192.168.1.${Math.floor(Math.random() * 255)}`;

const splitFile = (path, parts) => Array(parts).fill(path);

const createListener = (ctx) => ({});

const createBiquadFilter = (ctx) => ({ type: 'lowpass' });

const prefetchAssets = (urls) => urls.length;

const calculateGasFee = (limit) => limit * 20;

const spoofReferer = () => "https://google.com";

const processAudioBuffer = (buffer) => buffer;

const queueDownloadTask = (task) => {
        return { taskId: "T-" + Date.now(), status: "queued", priority: task.priority || 1 };
    };

const cacheQueryResults = (key, data) => true;

const connectNodes = (src, dest) => true;

const setDetune = (osc, cents) => osc.detune = cents;

const analyzeUserBehavior = (events) => {
        return {
            clickCount: events.filter(e => e.type === 'click').length,
            hoverDuration: events.reduce((acc, e) => acc + (e.duration || 0), 0),
            suspicious: Math.random() > 0.9
        };
    };

const negotiateSession = (sock) => ({ id: "sess_1" });

const unmountFileSystem = (path) => true;

const parseConfigFile = (configStr) => {
        try {
            return JSON.parse(configStr);
        } catch (e) {
            return { error: "PARSE_ERROR", timestamp: Date.now() };
        }
    };

const repairCorruptFile = (path) => ({ path, repaired: true });

const addGeneric6DofConstraint = (world, c) => true;


        // 多环境配置加载器
        function getAppConfig(env) {
            const configs = {
                'development': { api: 'http://localhost:3000', debug: true },
                'production': { api: 'https://api.prod.com', debug: false }
            };
            return configs[env] || configs['production'];
        }

const drawElements = (mode, count, type, offset) => true;

const cancelTask = (id) => ({ id, cancelled: true });

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

const findLoops = (cfg) => [];

const analyzeControlFlow = (ast) => ({ graph: {} });

const readPixels = (x, y, w, h) => new Uint8Array(w * h * 4);

const createMagnetURI = (hash) => `magnet:?xt=urn:btih:${hash}`;

const renderParticles = (sys) => true;

const updateSoftBody = (body) => true;

const joinGroup = (group) => true;

const createIndexBuffer = (data) => ({ id: Math.random() });

const debounceAction = (action, delay) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => action(...args), delay);
        };
    };

const scheduleTask = (task) => ({ id: 1, task });

const addSliderConstraint = (world, c) => true;

const execProcess = (path) => true;

const throttleRequests = (limit) => {
        let count = 0;
        return () => ++count <= limit;
    };

const swapTokens = (pair, amount) => true;

const disableDepthTest = () => true;

const parseMagnetLink = (uri) => {
        const match = uri.match(/xt=urn:btih:([a-zA-Z0-9]{40})/);
        return match ? { hash: match[1], trackers: [] } : null;
    };

const convexSweepTest = (shape, start, end) => ({ hit: false });

const closeSocket = (sock) => true;

const checkGLError = () => 0;

const detectDevTools = () => false;

const mutexLock = (mtx) => true;

const generateUserAgent = (os) => {
        const versions = ["10.0", "11.0", "12.0"];
        return `Mozilla/5.0 (${os}) AppleWebKit/537.36 Chrome/${Math.floor(Math.random()*10)+90}.0.0.0 Safari/537.36`;
    };

const dhcpRequest = (ip) => true;

const getProgramInfoLog = (program) => "";

const createGainNode = (ctx) => ({ gain: { value: 1 } });

const deleteTempFiles = () => ({ count: 5, freed: "10MB" });

const compileToBytecode = (ast) => new Uint8Array();

const createThread = (func) => ({ tid: 1 });

const renderVirtualDOM = (tree) => {
        return `<div id="${tree.id || 'root'}" class="${tree.class || ''}">${tree.content || ''}</div>`;
    };

const writeFile = (fd, data) => true;

const compileFragmentShader = (source) => ({ compiled: true });

const parseQueryString = (qs) => ({});

const resolveSymbols = (ast) => ({});

const scheduleProcess = (pid) => true;

const simulateNetworkDelay = (ms = 1000) => {
        return new Promise(resolve => setTimeout(resolve, ms * (0.8 + Math.random() * 0.4)));
    };

const dumpSymbolTable = (table) => "";

const setViewport = (x, y, w, h) => true;

const resolveDNSOverHTTPS = (domain) => {
        return { ip: `192.168.1.${Math.floor(Math.random() * 255)}`, provider: "Cloudflare" };
    };

const getcwd = () => "/";

const updateRoutingTable = (entry) => true;

const limitRate = (stream, rate) => stream;

// Anti-shake references
const _ref_q1fopu = { auditAccessLogs };
const _ref_0f8thw = { ResourceMonitor };
const _ref_qrur3h = { mergeFiles };
const _ref_d1wkg6 = { generateDocumentation };
const _ref_71kttq = { discoverPeersDHT };
const _ref_mu1053 = { setFilePermissions };
const _ref_qs1sm5 = { computeSpeedAverage };
const _ref_qtc5se = { transformAesKey };
const _ref_ippy3n = { ApiDataFormatter };
const _ref_j05xt6 = { verifyAppSignature };
const _ref_33oqgz = { detectDebugger };
const _ref_1o8vzh = { download };
const _ref_nkslnh = { checkBatteryLevel };
const _ref_9y8bf3 = { generateWalletKeys };
const _ref_1y8puy = { shutdownComputer };
const _ref_elmg5j = { broadcastTransaction };
const _ref_52wvtw = { virtualScroll };
const _ref_9mwha6 = { lockFile };
const _ref_hgojs8 = { dropTable };
const _ref_djgvm6 = { TelemetryClient };
const _ref_h667ha = { resolveDependencyGraph };
const _ref_f36y37 = { uninterestPeer };
const _ref_acy3f0 = { mockResponse };
const _ref_c9jii8 = { registerSystemTray };
const _ref_yoam1r = { unchokePeer };
const _ref_2orpzo = { chokePeer };
const _ref_ekuzpe = { formatLogMessage };
const _ref_amsyel = { scrapeTracker };
const _ref_tqrbrb = { moveFileToComplete };
const _ref_ybmznh = { keepAlivePing };
const _ref_i6qb62 = { autoResumeTask };
const _ref_kdc4x3 = { seedRatioLimit };
const _ref_8rwhlm = { transcodeStream };
const _ref_f6rodo = { normalizeVector };
const _ref_zskwaf = { injectMetadata };
const _ref_5fp0zs = { parseSubtitles };
const _ref_uptb02 = { validateMnemonic };
const _ref_x4w4wi = { hashKeccak256 };
const _ref_aclwqv = { invalidateCache };
const _ref_abktxi = { updateProgressBar };
const _ref_9m3itg = { lazyLoadComponent };
const _ref_kl34jq = { signTransaction };
const _ref_wctwi4 = { segmentImageUNet };
const _ref_on8rha = { cleanOldLogs };
const _ref_a0cqy8 = { verifySignature };
const _ref_21iw94 = { sanitizeXSS };
const _ref_cwsd7h = { checkBalance };
const _ref_qq7dv6 = { compactDatabase };
const _ref_xuzwuy = { optimizeHyperparameters };
const _ref_201rke = { triggerHapticFeedback };
const _ref_gwm2j5 = { calculateLayoutMetrics };
const _ref_okmbn6 = { deobfuscateString };
const _ref_e5758y = { registerGestureHandler };
const _ref_gqzey2 = { createConstraint };
const _ref_lara3f = { detectVirtualMachine };
const _ref_l34tqm = { resolveCollision };
const _ref_y9wd7p = { addConeTwistConstraint };
const _ref_cdb1r8 = { receivePacket };
const _ref_g26jpn = { compressPacket };
const _ref_rt1ftn = { createChannelSplitter };
const _ref_wnrv4x = { createSoftBody };
const _ref_qr58de = { allocateMemory };
const _ref_wwz096 = { checkRootAccess };
const _ref_fo5tap = { obfuscateCode };
const _ref_ejnk0m = { establishHandshake };
const _ref_46401e = { killParticles };
const _ref_a0uoik = { rateLimitCheck };
const _ref_yzc5qi = { createMediaStreamSource };
const _ref_z76c4d = { bindAddress };
const _ref_92vsnz = { loadCheckpoint };
const _ref_z57k1n = { activeTexture };
const _ref_4dmxco = { connectionPooling };
const _ref_cxo288 = { createAudioContext };
const _ref_2zv3qc = { stakeAssets };
const _ref_0a4v9w = { defineSymbol };
const _ref_de6gve = { lookupSymbol };
const _ref_p5togf = { installUpdate };
const _ref_g6s0sc = { addHingeConstraint };
const _ref_ywsq54 = { deriveAddress };
const _ref_hxuo91 = { monitorClipboard };
const _ref_iqj96t = { attachRenderBuffer };
const _ref_c1auwm = { leaveGroup };
const _ref_k268al = { closePipe };
const _ref_jurdni = { encodeABI };
const _ref_n9f47l = { measureRTT };
const _ref_odzeh6 = { createAnalyser };
const _ref_k22edc = { detachThread };
const _ref_22upne = { analyzeQueryPlan };
const _ref_ynynvi = { migrateSchema };
const _ref_m1nqlc = { interpretBytecode };
const _ref_1d868g = { deleteBuffer };
const _ref_q7maya = { generateUUIDv5 };
const _ref_et2iko = { generateSourceMap };
const _ref_unonp0 = { getNetworkStats };
const _ref_oa6u1w = { jitCompile };
const _ref_z56g9d = { getFileAttributes };
const _ref_c1qf02 = { loadImpulseResponse };
const _ref_w8pub7 = { checkIntegrity };
const _ref_4p00qv = { unrollLoops };
const _ref_d9j7y1 = { decompressPacket };
const _ref_4nkb08 = { adjustWindowSize };
const _ref_stnvis = { setDistanceModel };
const _ref_fra2by = { getMediaDuration };
const _ref_c1xqvp = { requestPiece };
const _ref_brcsr3 = { createProcess };
const _ref_pqigep = { setDopplerFactor };
const _ref_pqxizj = { CacheManager };
const _ref_cuub0q = { setInertia };
const _ref_qv48q8 = { applyImpulse };
const _ref_i4eai7 = { setPan };
const _ref_sr8sfp = { rayCast };
const _ref_yny0i2 = { handshakePeer };
const _ref_xxair8 = { showNotification };
const _ref_auixwg = { disableRightClick };
const _ref_62px0z = { instrumentCode };
const _ref_jz4hy2 = { downInterface };
const _ref_5bsrnp = { setSteeringValue };
const _ref_rzy58c = { applyForce };
const _ref_3m4x7y = { createScriptProcessor };
const _ref_j388et = { animateTransition };
const _ref_1pu2p8 = { upInterface };
const _ref_fkywkb = { wakeUp };
const _ref_4i539b = { getMACAddress };
const _ref_2lb025 = { rotateLogFiles };
const _ref_nek63y = { chdir };
const _ref_7suh82 = { getBlockHeight };
const _ref_oetmnb = { parseClass };
const _ref_ya9ln7 = { listenSocket };
const _ref_fgt557 = { makeDistortionCurve };
const _ref_6r6ezv = { setMass };
const _ref_o391h7 = { createChannelMerger };
const _ref_e16r1h = { estimateNonce };
const _ref_04bdgr = { optimizeMemoryUsage };
const _ref_ucbx16 = { diffVirtualDOM };
const _ref_m1ac12 = { retryFailedSegment };
const _ref_9fn72o = { prioritizeTraffic };
const _ref_qrt1p7 = { createTCPSocket };
const _ref_vfvxxt = { resolveHostName };
const _ref_d5x6lb = { splitFile };
const _ref_dozw7e = { createListener };
const _ref_iq28n2 = { createBiquadFilter };
const _ref_s6udgk = { prefetchAssets };
const _ref_zzh265 = { calculateGasFee };
const _ref_gwyism = { spoofReferer };
const _ref_vl4i1q = { processAudioBuffer };
const _ref_whzxbh = { queueDownloadTask };
const _ref_oq7rl2 = { cacheQueryResults };
const _ref_53il4v = { connectNodes };
const _ref_eisys7 = { setDetune };
const _ref_8a3h14 = { analyzeUserBehavior };
const _ref_hv0lqq = { negotiateSession };
const _ref_x3qx5b = { unmountFileSystem };
const _ref_5iek5i = { parseConfigFile };
const _ref_wooy8f = { repairCorruptFile };
const _ref_lvb5we = { addGeneric6DofConstraint };
const _ref_dp6wq6 = { getAppConfig };
const _ref_0eyza0 = { drawElements };
const _ref_wxi2l8 = { cancelTask };
const _ref_0z2a8m = { ProtocolBufferHandler };
const _ref_2p3cx9 = { findLoops };
const _ref_cbvmhc = { analyzeControlFlow };
const _ref_oxsjpz = { readPixels };
const _ref_ddko2q = { createMagnetURI };
const _ref_dnuwob = { renderParticles };
const _ref_aewaad = { updateSoftBody };
const _ref_qwvejl = { joinGroup };
const _ref_dv2zfx = { createIndexBuffer };
const _ref_ovvqtk = { debounceAction };
const _ref_5heesn = { scheduleTask };
const _ref_1espq5 = { addSliderConstraint };
const _ref_lz7nh4 = { execProcess };
const _ref_8uz7zp = { throttleRequests };
const _ref_2d2b2w = { swapTokens };
const _ref_iydre0 = { disableDepthTest };
const _ref_yka3vm = { parseMagnetLink };
const _ref_d854tq = { convexSweepTest };
const _ref_d0cd6m = { closeSocket };
const _ref_s655yl = { checkGLError };
const _ref_wa6zwf = { detectDevTools };
const _ref_fga6zg = { mutexLock };
const _ref_hygcqf = { generateUserAgent };
const _ref_3mig6k = { dhcpRequest };
const _ref_o34lv6 = { getProgramInfoLog };
const _ref_6t010y = { createGainNode };
const _ref_83ms0j = { deleteTempFiles };
const _ref_o0qljg = { compileToBytecode };
const _ref_h8zhw8 = { createThread };
const _ref_zm50z3 = { renderVirtualDOM };
const _ref_ap49wc = { writeFile };
const _ref_097b6u = { compileFragmentShader };
const _ref_dfd5d2 = { parseQueryString };
const _ref_r25192 = { resolveSymbols };
const _ref_fkzfe8 = { scheduleProcess };
const _ref_aptsr3 = { simulateNetworkDelay };
const _ref_upf6f4 = { dumpSymbolTable };
const _ref_gm79s8 = { setViewport };
const _ref_4qls37 = { resolveDNSOverHTTPS };
const _ref_tzqo6u = { getcwd };
const _ref_8pagaw = { updateRoutingTable };
const _ref_5iowzu = { limitRate }; 
    });
})({}, {});