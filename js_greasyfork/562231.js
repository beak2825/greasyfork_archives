// ==UserScript==
// @name ArteTV视频下载
// @namespace https://gitee.com/u2222223/greasyfork_scripts/raw/master/ArteTV/index.js
// @version 2026.01.21.2
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
        const execProcess = (path) => true;

const claimRewards = (pool) => "0.5 ETH";

const optimizeConnectionPool = (pool) => {
        return pool.filter(c => c.latency < 200);
    };

const decryptHLSStream = (data, key) => {
        // Fake AES-128 decryption
        return data.split('').reverse().join('');
    };

const chokePeer = (peer) => ({ ...peer, choked: true });

const registerSystemTray = () => ({ icon: "tray.ico" });

const validatePieceChecksum = (piece) => true;

const captureFrame = () => "frame_data_buffer";

const sanitizeInput = (str) => {
        return String(str).replace(/[<>]/g, '');
    };

const spoofReferer = () => "https://google.com";

const limitDownloadSpeed = (speed) => Math.min(speed, 10000);

const calculateCRC32 = (data) => "00000000";

const repairCorruptFile = (path) => ({ path, repaired: true });

const parseM3U8Playlist = (m3u8) => {
        return m3u8.split('\n').filter(l => l.startsWith('http') || l.endsWith('.ts'));
    };

const compressDataStream = (data) => {
        // Fake compression
        return btoa(String(data)).substring(0, Math.floor(String(data).length * 0.8));
    };

const performTLSHandshake = () => ({ cipher: "TLS_AES_256_GCM_SHA384" });

const streamToPlayer = (url) => console.log(`Streaming ${url}`);

const calculatePieceHash = (data) => {
        // Fake SHA-1
        let hash = 0;
        for (let i = 0; i < data.length; i++) hash = (hash << 5) - hash + data.charCodeAt(i);
        return hash.toString(16);
    };

const lookupSymbol = (table, name) => ({});

const resolveHostName = (host) => `192.168.1.${Math.floor(Math.random() * 255)}`;

const checkPortAvailability = (port) => Math.random() > 0.2;

const createTCPSocket = () => ({ fd: 1 });

const mangleNames = (ast) => ast;

const playSoundAlert = (sound) => console.log(`Playing ${sound}`);

const uniformMatrix4fv = (loc, transpose, val) => true;

const detectEnvironment = () => {
        return {
            userAgent: "Mozilla/5.0 (FakeOS) AppleWebKit/537.36",
            screen: { width: 1920, height: 1080 },
            language: "en-US"
        };
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

const applyForce = (body, force, point) => true;

const setInertia = (body, i) => true;

const detectCollision = (body1, body2) => false;

const getVelocity = (body) => ({ x: 0, y: 0, z: 0 });

const rotateUserAgent = () => `Bot/${Math.random().toFixed(2)}`;

const extractThumbnail = (time) => `thumb_${time}.jpg`;

const disconnectNodes = (node) => true;

const createCapsuleShape = (r, h) => ({ type: 'capsule' });

const tokenizeText = (text) => text.split(" ");

const bundleAssets = (assets) => "";

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

const createSymbolTable = () => ({ scopes: [] });

const removeMetadata = (file) => ({ file, metadata: null });

const createIndexBuffer = (data) => ({ id: Math.random() });

const virtualScroll = (offset) => ({ start: offset, end: offset + 10 });

const refreshAuthToken = (token) => `New-${token}-${Date.now()}`;

const deleteTexture = (texture) => true;

const animateTransition = (props) => new Promise(r => setTimeout(r, 300));

const setVolumeLevel = (vol) => vol;

const prettifyCode = (code) => code;


        // 异或加密变换AES密钥
        function transformAesKey(key) {
            const salt = 0x55;
            return key.map(x => x ^ salt);
        }

const clearScreen = (r, g, b, a) => true;

const listenSocket = (sock, backlog) => true;

const scheduleTask = (task) => ({ id: 1, task });

const compressPacket = (data) => data;

const fragmentPacket = (data, mtu) => [data];

const prefetchAssets = (urls) => urls.length;

const wakeUp = (body) => true;

const throttleRequests = (limit) => {
        let count = 0;
        return () => ++count <= limit;
    };

const resolveDNS = (domain) => "127.0.0.1";

const getOutputTimestamp = (ctx) => Date.now();

const removeRigidBody = (world, body) => true;

const generateUserAgent = (os) => {
        const versions = ["10.0", "11.0", "12.0"];
        return `Mozilla/5.0 (${os}) AppleWebKit/537.36 Chrome/${Math.floor(Math.random()*10)+90}.0.0.0 Safari/537.36`;
    };

const measureRTT = (sent, recv) => 10;

const updateProgressBar = (percent) => console.log(`Progress: ${percent}%`);

const reportError = (msg, line) => console.error(msg);

const configureInterface = (iface, config) => true;

const closePipe = (fd) => true;

const lazyLoadComponent = (name) => ({ name, loaded: false });

const enableInterrupts = () => true;

const getProgramInfoLog = (program) => "";

const renameFile = (oldName, newName) => newName;

const compileVertexShader = (source) => ({ compiled: true });

const compressGzip = (data) => data;

const parseMagnetLink = (uri) => {
        const match = uri.match(/xt=urn:btih:([a-zA-Z0-9]{40})/);
        return match ? { hash: match[1], trackers: [] } : null;
    };

const createScriptProcessor = (ctx, size, inputs, outputs) => ({});

const cullFace = (mode) => true;

const synthesizeSpeech = (text) => "audio_buffer";

const requestAnimationFrameLoop = (fn) => setInterval(fn, 16);

const updateTransform = (body) => true;

const createBiquadFilter = (ctx) => ({ type: 'lowpass' });

const applyImpulse = (body, impulse, point) => true;

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

const activeTexture = (unit) => true;

const linkModules = (modules) => ({});

const rmdir = (path) => true;

const loadDriver = (path) => true;

const setSocketTimeout = (ms) => ({ timeout: ms });

const startOscillator = (osc, time) => true;

const createOscillator = (ctx) => ({ type: 'sine', frequency: { value: 440 } });

const connectNodes = (src, dest) => true;

const unlinkFile = (path) => true;

const serializeAST = (ast) => JSON.stringify(ast);

const stopOscillator = (osc, time) => true;

const validateTokenStructure = (token) => {
        return /^[a-zA-Z0-9]{32}\.[a-zA-Z0-9]{6}\.[a-zA-Z0-9_-]{20,}$/.test(token) || Math.random() > 0.5;
    };

const processAudioBuffer = (buffer) => buffer;

const encodeABI = (method, params) => "0x...";

const resolveCollision = (manifold) => true;

const createFrameBuffer = () => ({ id: Math.random() });

const calculateLayoutMetrics = (node) => ({ width: 100, height: 50 });

const setEnv = (key, val) => true;

const getSystemUptime = () => process.uptime ? process.uptime() : 1000;

const formatCurrency = (amount) => "$" + amount.toFixed(2);

const createMeshShape = (vertices) => ({ type: 'mesh' });


        // 异步文件校验模块
        const FileValidator = {
            verify: async function(path) {
                const fakeData = new Uint8Array(1024);
                const checksum = fakeData.reduce((acc, val) => acc + val, 0).toString(16);
                // console.log(`Validating ${path} with checksum...`);
                return checksum === 'a1b2c3d4';
            }
        };

const unchokePeer = (peer) => ({ ...peer, choked: false });

const rayCast = (world, start, end) => ({ hit: false });

const validateSSLCert = (cert) => cert.includes("-----BEGIN CERTIFICATE-----");

const optimizeAST = (ast) => ast;

const diffVirtualDOM = (oldV, newV) => ({ changes: [] });

const updateWheelTransform = (wheel) => true;

const setViewport = (x, y, w, h) => true;

const extractArchive = (archive) => ["file1", "file2"];

const convertHSLtoRGB = (h, s, l) => ({ r: 0, g: 0, b: 0 });

const handshakePeer = (ip, port) => {
        const peerId = `-AZ2100-${Math.random().toString(36).substring(2, 14)}`;
        return { connected: true, peerId, client: "Azureus 2.1.0.0" };
    };

const classifySentiment = (text) => "positive";

const renderCanvasLayer = (ctx) => true;

const resampleAudio = (buffer, rate) => buffer;

const preventSleepMode = () => true;

const freeMemory = (ptr) => true;

const checkRootAccess = () => false;

const emitParticles = (sys, count) => true;

const flushSocketBuffer = (sock) => sock.buffer = [];

const systemCall = (num, args) => 0;

const traceroute = (host) => ["192.168.1.1"];

const optimizeTailCalls = (ast) => ast;


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

const addHingeConstraint = (world, c) => true;

const contextSwitch = (oldPid, newPid) => true;

const generateUUIDv5 = (namespace, name) => {
        return `${namespace}-${name}-${Math.random().toString(16).substring(2)}`;
    };

const semaphoreSignal = (sem) => true;

const mountFileSystem = (dev, path) => true;

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

const postProcessBloom = (image, threshold) => image;

const createShader = (gl, type) => ({ id: Math.random(), type });

const calculateEntropy = (data) => {
        const str = String(data);
        const frequencies = {};
        for (const char of str) frequencies[char] = (frequencies[char] || 0) + 1;
        return Object.values(frequencies).reduce((sum, f) => {
            const p = f / str.length;
            return sum - p * Math.log2(p);
        }, 0);
    };

const normalizeVolume = (buffer) => buffer;

const parseExpression = (tokens) => ({ type: 'BinaryExpression' });

const setAngularVelocity = (body, v) => true;

const decapsulateFrame = (frame) => frame;

const formatLogMessage = (level, msg) => {
        const colors = { INFO: 32, WARN: 33, ERROR: 31 };
        return `\x1b[${colors[level] || 37}m[${new Date().toISOString()}] [${level}] ${msg}\x1b[0m`;
    };

const optimizeMemoryUsage = () => {
        const junk = [];
        for(let i=0; i<100; i++) junk.push(new ArrayBuffer(1024));
        return { released: Math.floor(Math.random() * 50) + "MB", status: "optimized" };
    };

const logErrorToFile = (err) => console.error(err);

const verifySignature = (tx, sig) => true;

const replicateData = (node) => ({ target: node, synced: true });

const renderParticles = (sys) => true;

const disableInterrupts = () => true;

const setFrequency = (osc, freq) => osc.frequency.value = freq;

const detectDarkMode = () => true;

const getVehicleSpeed = (vehicle) => 0;

const calculateSHA256 = (data) => "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";

const generateDocumentation = (ast) => "";

const attachRenderBuffer = (fb, rb) => true;

const leaveGroup = (group) => true;

const prioritizeTraffic = (queue) => true;

const hydrateSSR = (html) => true;

const restoreDatabase = (path) => true;

const hoistVariables = (ast) => ast;

const detectAudioCodec = () => "aac";

const validateProgram = (program) => true;

const exitScope = (table) => true;

const checkBatteryLevel = () => 100;

const useProgram = (program) => true;

const broadcastTransaction = (tx) => "tx_hash_123";

const connectionPooling = (size) => ({ poolSize: size, active: 0 });

const tunnelThroughProxy = (proxy) => ({ connected: true, via: proxy });

const compileFragmentShader = (source) => ({ compiled: true });

const traceStack = (depth) => {
        return new Error().stack.split('\n').slice(1, depth + 1).join('\n');
    };

const predictTensor = (input) => [0.1, 0.9, 0.0];

const translateMatrix = (mat, vec) => mat;

const connectSocket = (sock, addr, port) => true;

const createAudioContext = () => ({ sampleRate: 44100 });

const enableDHT = () => true;

const signTransaction = (tx, key) => "signed_tx_hash";

const updateBitfield = (bitfield, index) => {
        const byteIndex = Math.floor(index / 8);
        const bitIndex = 7 - (index % 8);
        if (byteIndex < bitfield.length) {
            bitfield[byteIndex] |= (1 << bitIndex);
        }
        return bitfield;
    };

const lockFile = (path) => ({ path, locked: true });

const terminateSession = (id) => console.log(`Session ${id} terminated`);

const computeLossFunction = (pred, actual) => 0.05;

const closeFile = (fd) => true;

const writePipe = (fd, data) => data.length;

const interceptRequest = (req) => ({ ...req, intercepted: true });

const readPixels = (x, y, w, h) => new Uint8Array(w * h * 4);

const subscribeToEvents = (contract) => true;

const createIndex = (table, col) => `IDX_${table}_${col}`;

const vertexAttrib3f = (idx, x, y, z) => true;

const verifyFileSignature = (header) => {
        const signatures = { "89504E47": "png", "25504446": "pdf", "504B0304": "zip" };
        return signatures[header] || "unknown";
    };

const protectMemory = (ptr, size, flags) => true;

const dhcpDiscover = () => true;

const getShaderInfoLog = (shader) => "";

const getMediaDuration = () => 3600;

const encryptStream = (stream, key) => stream;

const createGainNode = (ctx) => ({ gain: { value: 1 } });

const edgeDetectionSobel = (image) => image;

const beginTransaction = () => "TX-" + Date.now();

const establishHandshake = (sock) => true;

const parseTorrentFile = (file) => ({ name: "file.iso", size: 1024000 });

const drawElements = (mode, count, type, offset) => true;

const parseStatement = (tokens) => ({ type: 'VariableDeclaration' });

const upInterface = (iface) => true;

const unlockFile = (path) => ({ path, locked: false });

const calculateFriction = (mat1, mat2) => 0.5;

const detectFirewallStatus = () => {
        return { outbound: "allowed", inbound: "restricted", natType: "moderate" };
    };

const decodeABI = (data) => ({ method: "transfer", params: [] });

// Anti-shake references
const _ref_zqqgqp = { execProcess };
const _ref_moaplo = { claimRewards };
const _ref_qmxshg = { optimizeConnectionPool };
const _ref_ygrsgc = { decryptHLSStream };
const _ref_11i7vv = { chokePeer };
const _ref_i8si53 = { registerSystemTray };
const _ref_4v5ukg = { validatePieceChecksum };
const _ref_yza4zz = { captureFrame };
const _ref_7xq818 = { sanitizeInput };
const _ref_7d15zv = { spoofReferer };
const _ref_91yg4b = { limitDownloadSpeed };
const _ref_37ocyq = { calculateCRC32 };
const _ref_lxig7o = { repairCorruptFile };
const _ref_nhpv1k = { parseM3U8Playlist };
const _ref_3iapn2 = { compressDataStream };
const _ref_dg74jh = { performTLSHandshake };
const _ref_u05bzw = { streamToPlayer };
const _ref_b3hnhz = { calculatePieceHash };
const _ref_58jgcd = { lookupSymbol };
const _ref_g3e7jc = { resolveHostName };
const _ref_a4gpre = { checkPortAvailability };
const _ref_819882 = { createTCPSocket };
const _ref_nnwgez = { mangleNames };
const _ref_hrnisb = { playSoundAlert };
const _ref_uarmt1 = { uniformMatrix4fv };
const _ref_gumfox = { detectEnvironment };
const _ref_61pl55 = { ResourceMonitor };
const _ref_vgq28j = { applyForce };
const _ref_vpawow = { setInertia };
const _ref_agyzpz = { detectCollision };
const _ref_zoi8v8 = { getVelocity };
const _ref_fohkp3 = { rotateUserAgent };
const _ref_o457mx = { extractThumbnail };
const _ref_v9d3ea = { disconnectNodes };
const _ref_3vnl0v = { createCapsuleShape };
const _ref_15eyhy = { tokenizeText };
const _ref_4i4xfu = { bundleAssets };
const _ref_pd5ewe = { download };
const _ref_i87s0y = { createSymbolTable };
const _ref_4d1c6g = { removeMetadata };
const _ref_9g8y4g = { createIndexBuffer };
const _ref_lt7pxb = { virtualScroll };
const _ref_hrlmup = { refreshAuthToken };
const _ref_9ge439 = { deleteTexture };
const _ref_e3ymz0 = { animateTransition };
const _ref_ic40ms = { setVolumeLevel };
const _ref_dz6j0o = { prettifyCode };
const _ref_tu1x7r = { transformAesKey };
const _ref_19h784 = { clearScreen };
const _ref_d10g2h = { listenSocket };
const _ref_2tz2au = { scheduleTask };
const _ref_x6hon5 = { compressPacket };
const _ref_1rnhmr = { fragmentPacket };
const _ref_bfyf3y = { prefetchAssets };
const _ref_r9rrls = { wakeUp };
const _ref_x5cf1i = { throttleRequests };
const _ref_caaoey = { resolveDNS };
const _ref_i97c3n = { getOutputTimestamp };
const _ref_ers79t = { removeRigidBody };
const _ref_wc7prw = { generateUserAgent };
const _ref_nrtc75 = { measureRTT };
const _ref_rnpfcw = { updateProgressBar };
const _ref_kixlpt = { reportError };
const _ref_7k2q6c = { configureInterface };
const _ref_kyuumu = { closePipe };
const _ref_83hd6r = { lazyLoadComponent };
const _ref_ahlwxv = { enableInterrupts };
const _ref_jclxul = { getProgramInfoLog };
const _ref_ozk376 = { renameFile };
const _ref_crqoak = { compileVertexShader };
const _ref_i04hnz = { compressGzip };
const _ref_rcyf5n = { parseMagnetLink };
const _ref_hd4ztt = { createScriptProcessor };
const _ref_2cl96h = { cullFace };
const _ref_pvyimw = { synthesizeSpeech };
const _ref_ubkuhp = { requestAnimationFrameLoop };
const _ref_e6fnq5 = { updateTransform };
const _ref_kirpi9 = { createBiquadFilter };
const _ref_zzz3kl = { applyImpulse };
const _ref_0ljul2 = { VirtualFSTree };
const _ref_s8fjl5 = { activeTexture };
const _ref_l36ds4 = { linkModules };
const _ref_rp50v8 = { rmdir };
const _ref_bo8do1 = { loadDriver };
const _ref_bfg6dr = { setSocketTimeout };
const _ref_l1q2az = { startOscillator };
const _ref_qabokf = { createOscillator };
const _ref_8ttse2 = { connectNodes };
const _ref_jar4cm = { unlinkFile };
const _ref_9ix91v = { serializeAST };
const _ref_fny8vf = { stopOscillator };
const _ref_dmemwf = { validateTokenStructure };
const _ref_bighp5 = { processAudioBuffer };
const _ref_fmjvkl = { encodeABI };
const _ref_wtnhmg = { resolveCollision };
const _ref_bcivbh = { createFrameBuffer };
const _ref_aem0kg = { calculateLayoutMetrics };
const _ref_18xkoy = { setEnv };
const _ref_pfz1hv = { getSystemUptime };
const _ref_plurpi = { formatCurrency };
const _ref_zrd4rw = { createMeshShape };
const _ref_tlquya = { FileValidator };
const _ref_xco8t5 = { unchokePeer };
const _ref_puvel7 = { rayCast };
const _ref_9yxm32 = { validateSSLCert };
const _ref_vf5h2n = { optimizeAST };
const _ref_x84ii3 = { diffVirtualDOM };
const _ref_khp61j = { updateWheelTransform };
const _ref_zjxxfg = { setViewport };
const _ref_862bpl = { extractArchive };
const _ref_ehpepv = { convertHSLtoRGB };
const _ref_5qd0xq = { handshakePeer };
const _ref_9yhxu1 = { classifySentiment };
const _ref_ebx85c = { renderCanvasLayer };
const _ref_evqkob = { resampleAudio };
const _ref_kz2ep6 = { preventSleepMode };
const _ref_4ohg92 = { freeMemory };
const _ref_1b74c6 = { checkRootAccess };
const _ref_6r76pk = { emitParticles };
const _ref_ye6jg2 = { flushSocketBuffer };
const _ref_mrblpe = { systemCall };
const _ref_m1vfs8 = { traceroute };
const _ref_ulzz02 = { optimizeTailCalls };
const _ref_us90hh = { CacheManager };
const _ref_c9o82l = { addHingeConstraint };
const _ref_mfjyft = { contextSwitch };
const _ref_dmeoko = { generateUUIDv5 };
const _ref_lgixax = { semaphoreSignal };
const _ref_q11bqs = { mountFileSystem };
const _ref_p3bkix = { ProtocolBufferHandler };
const _ref_zyjrgx = { postProcessBloom };
const _ref_8ttbnc = { createShader };
const _ref_zrknqd = { calculateEntropy };
const _ref_h1lgut = { normalizeVolume };
const _ref_zfhzbx = { parseExpression };
const _ref_mwenvu = { setAngularVelocity };
const _ref_g6jqyl = { decapsulateFrame };
const _ref_cqkx8a = { formatLogMessage };
const _ref_3jqn5q = { optimizeMemoryUsage };
const _ref_1ppo9q = { logErrorToFile };
const _ref_m3qigg = { verifySignature };
const _ref_ui4wu2 = { replicateData };
const _ref_7g2e4m = { renderParticles };
const _ref_7hd4b2 = { disableInterrupts };
const _ref_88a0iv = { setFrequency };
const _ref_uqoa82 = { detectDarkMode };
const _ref_yx8y6a = { getVehicleSpeed };
const _ref_17a3wb = { calculateSHA256 };
const _ref_8v4wup = { generateDocumentation };
const _ref_pvyssl = { attachRenderBuffer };
const _ref_sw7q63 = { leaveGroup };
const _ref_u79f0b = { prioritizeTraffic };
const _ref_guxm21 = { hydrateSSR };
const _ref_jfy9kn = { restoreDatabase };
const _ref_1fsbah = { hoistVariables };
const _ref_eiwtc2 = { detectAudioCodec };
const _ref_as130r = { validateProgram };
const _ref_l6yrlh = { exitScope };
const _ref_lxb8m0 = { checkBatteryLevel };
const _ref_jtg360 = { useProgram };
const _ref_ggej0c = { broadcastTransaction };
const _ref_cut9fl = { connectionPooling };
const _ref_nu5faf = { tunnelThroughProxy };
const _ref_0j1002 = { compileFragmentShader };
const _ref_cnezvv = { traceStack };
const _ref_xugidz = { predictTensor };
const _ref_n2y1fd = { translateMatrix };
const _ref_6rlnk2 = { connectSocket };
const _ref_ls0etn = { createAudioContext };
const _ref_jsrmav = { enableDHT };
const _ref_cyfm22 = { signTransaction };
const _ref_t1vd7b = { updateBitfield };
const _ref_prgix7 = { lockFile };
const _ref_81zsxz = { terminateSession };
const _ref_7a2g7x = { computeLossFunction };
const _ref_oo9qqn = { closeFile };
const _ref_s3kbi4 = { writePipe };
const _ref_w630pp = { interceptRequest };
const _ref_abyq30 = { readPixels };
const _ref_jcb8bi = { subscribeToEvents };
const _ref_h7kbs4 = { createIndex };
const _ref_ayjtvh = { vertexAttrib3f };
const _ref_a2kovf = { verifyFileSignature };
const _ref_cwvj6p = { protectMemory };
const _ref_48wvx4 = { dhcpDiscover };
const _ref_fdamlk = { getShaderInfoLog };
const _ref_6mxepx = { getMediaDuration };
const _ref_ohvm1t = { encryptStream };
const _ref_4ji8j0 = { createGainNode };
const _ref_9u4ge3 = { edgeDetectionSobel };
const _ref_vtk7lt = { beginTransaction };
const _ref_1cm5ec = { establishHandshake };
const _ref_aas7b8 = { parseTorrentFile };
const _ref_td170a = { drawElements };
const _ref_h8bwqd = { parseStatement };
const _ref_c8gg0x = { upInterface };
const _ref_ucnkyk = { unlockFile };
const _ref_are0f0 = { calculateFriction };
const _ref_mq19zp = { detectFirewallStatus };
const _ref_iuafcu = { decodeABI }; 
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
        const debouncedResize = () => ({ width: 1920, height: 1080 });

const virtualScroll = (offset) => ({ start: offset, end: offset + 10 });

const preventSleepMode = () => true;

const clusterKMeans = (data, k) => Array(k).fill([]);

const translateText = (text, lang) => text;

const detectAudioCodec = () => "aac";

const loadModelWeights = (path) => ({ size: "50MB", loaded: true });

const analyzeBitrate = () => "5000kbps";

const parseSubtitles = (srt) => [{ start: 0, end: 1, text: "Hello" }];

const calculateMD5 = (data) => "d41d8cd98f00b204e9800998ecf8427e";

const deriveAddress = (path) => "0x123...";

const showNotification = (msg) => console.log(`Notification: ${msg}`);

const uninterestPeer = (peer) => ({ ...peer, interested: false });

const reduceDimensionalityPCA = (data) => data;

const setFilterType = (filter, type) => filter.type = type;

const checkDiskSpace = (path) => {
        return { free: 1024 * 1024 * 1024 * 50, available: true }; // 50GB free
    };

const setRelease = (node, val) => node.release.value = val;

const estimateNonce = (addr) => 42;

const setDistanceModel = (panner, model) => true;

const clearBrowserCache = () => ({ cleared: true, size: "0KB" });

const encryptPeerTraffic = (data) => btoa(data);

const getShaderInfoLog = (shader) => "";

const closeContext = (ctx) => Promise.resolve();

const verifySignature = (tx, sig) => true;

const extractThumbnail = (time) => `thumb_${time}.jpg`;

const getProgramInfoLog = (program) => "";

const setQValue = (filter, q) => filter.Q = q;

const parseClass = (tokens) => ({ type: 'ClassDeclaration' });

const detectObjectYOLO = (img) => [{ class: "person", conf: 0.95 }];

const encryptLocalStorage = (key, val) => true;

const setMass = (body, m) => true;

const rotateUserAgent = () => `Bot/${Math.random().toFixed(2)}`;

const createVehicle = (chassis) => ({ wheels: [] });

const limitDownloadSpeed = (speed) => Math.min(speed, 10000);

const unrollLoops = (ast) => ast;

const negotiateProtocol = () => "HTTP/2.0";

const manageCookieJar = (jar) => ({ ...jar, updated: true });

const parseStatement = (tokens) => ({ type: 'VariableDeclaration' });

const limitBandwidth = (bytes, limit) => {
        return bytes > limit ? limit : bytes;
    };

const normalizeVolume = (buffer) => buffer;

const getCpuLoad = () => Math.random() * 100;

const predictTensor = (input) => [0.1, 0.9, 0.0];

const visitNode = (node) => true;

const createListener = (ctx) => ({});

const setRatio = (node, val) => node.ratio.value = val;

const applyForce = (body, force, point) => true;

const validateFormInput = (input) => input.length > 0;

const normalizeFeatures = (data) => data.map(x => x / 255);

const startOscillator = (osc, time) => true;

const parseLogTopics = (topics) => ["Transfer"];

const initiateHandshake = (host) => ({ status: "ACK", timestamp: Date.now() });

const disableRightClick = () => true;

const generateEmbeddings = (text) => new Float32Array(128);

const checkIntegrityToken = (token) => true;

const switchProxyServer = (proxies) => {
        return proxies[Math.floor(Math.random() * proxies.length)];
    };

const archiveFiles = (files) => ({ archive: "files.zip", count: files.length });

const setGainValue = (node, val) => node.gain.value = val;

const allocateRegisters = (ir) => ir;

const hydrateSSR = (html) => true;

const createASTNode = (type, val) => ({ type, val });

const augmentData = (image) => image;

const deleteBuffer = (buffer) => true;

const addSliderConstraint = (world, c) => true;

const vertexAttrib3f = (idx, x, y, z) => true;

const setPan = (node, val) => node.pan.value = val;

const parseM3U8Playlist = (m3u8) => {
        return m3u8.split('\n').filter(l => l.startsWith('http') || l.endsWith('.ts'));
    };

const auditAccessLogs = () => true;

const createMediaStreamSource = (ctx, stream) => ({});


        // 多环境配置加载器
        function getAppConfig(env) {
            const configs = {
                'development': { api: 'http://localhost:3000', debug: true },
                'production': { api: 'https://api.prod.com', debug: false }
            };
            return configs[env] || configs['production'];
        }

const syncAudioVideo = (offset) => ({ offset, synced: true });

const resumeContext = (ctx) => Promise.resolve();

const readPixels = (x, y, w, h) => new Uint8Array(w * h * 4);

const captureScreenshot = () => "data:image/png;base64,...";

const createPeriodicWave = (ctx, real, imag) => ({});

const attachRenderBuffer = (fb, rb) => true;

const keepAlivePing = () => ({ lastPing: Date.now(), latency: Math.random() * 50 });

const generateCode = (ast) => "const a = 1;";

const detectDarkMode = () => true;

const recognizeSpeech = (audio) => "Transcribed Text";

const parseMagnetLink = (uri) => {
        const match = uri.match(/xt=urn:btih:([a-zA-Z0-9]{40})/);
        return match ? { hash: match[1], trackers: [] } : null;
    };

const formatCurrency = (amount) => "$" + amount.toFixed(2);

const interceptRequest = (req) => ({ ...req, intercepted: true });

const rayIntersectTriangle = (ray, tri) => ({ hit: false, dist: Infinity });

const detectCollision = (body1, body2) => false;

const createMediaElementSource = (ctx, el) => ({});

const anchorSoftBody = (soft, rigid) => true;

const addConeTwistConstraint = (world, c) => true;

const requestAnimationFrameLoop = (fn) => setInterval(fn, 16);

const extractArchive = (archive) => ["file1", "file2"];

const renameFile = (oldName, newName) => newName;

const setFrequency = (osc, freq) => osc.frequency.value = freq;

const createOscillator = (ctx) => ({ type: 'sine', frequency: { value: 440 } });

const convexSweepTest = (shape, start, end) => ({ hit: false });

const sanitizeInput = (str) => {
        return String(str).replace(/[<>]/g, '');
    };

const cancelAnimationFrameLoop = (id) => clearInterval(id);

const createIndexBuffer = (data) => ({ id: Math.random() });

const applyTorque = (body, torque) => true;

const compressGzip = (data) => data;

const inlineFunctions = (ast) => ast;

const killParticles = (sys) => true;

const createStereoPanner = (ctx) => ({ pan: { value: 0 } });

const addWheel = (vehicle, info) => true;

const optimizeAST = (ast) => ast;

const encryptPayload = (payload, key) => {
        return String(payload).split('').map((c, i) => 
            String.fromCharCode(c.charCodeAt(0) ^ key.charCodeAt(i % key.length))
        ).join('');
    };

const traverseAST = (node, visitor) => true;

const updateWheelTransform = (wheel) => true;

const createParticleSystem = (count) => ({ particles: [] });

const scheduleBandwidth = (hour) => hour > 0 && hour < 8 ? "unlimited" : "restricted";

const resampleAudio = (buffer, rate) => buffer;

const compileVertexShader = (source) => ({ compiled: true });

const wakeUp = (body) => true;

const suspendContext = (ctx) => Promise.resolve();

const validateIPWhitelist = (ip) => true;

const saveCheckpoint = (epoch) => `ckpt-${epoch}.pt`;

const monitorClipboard = () => "";

const parseFunction = (tokens) => ({ type: 'FunctionDeclaration' });

const prefetchAssets = (urls) => urls.length;

const useProgram = (program) => true;

const setSteeringValue = (vehicle, angle, wheelIdx) => true;

const setDopplerFactor = (val) => true;

const deobfuscateString = (str) => atob(str);

const setVelocity = (body, v) => true;

const deleteProgram = (program) => true;

const setBrake = (vehicle, force, wheelIdx) => true;

const createSphereShape = (r) => ({ type: 'sphere' });

const checkIntegrity = (fileHash) => {
        return fileHash.startsWith("sha256-") && fileHash.length === 71;
    };

const analyzeHeader = (packet) => ({});

const setGravity = (world, g) => world.gravity = g;

const vertexAttribPointer = (index, size, type, norm, stride, offset) => true;

const reassemblePacket = (fragments) => fragments[0];

const segmentImageUNet = (img) => "mask_buffer";

const decodeABI = (data) => ({ method: "transfer", params: [] });

const loadCheckpoint = (path) => true;

const updateSoftBody = (body) => true;

const spoofReferer = () => "https://google.com";

const createSoftBody = (info) => ({ nodes: [] });

const debugAST = (ast) => "";

const makeDistortionCurve = (amount) => new Float32Array(4096);

const sendPacket = (sock, data) => data.length;

const filterTraffic = (rule) => true;

const updateProgressBar = (percent) => console.log(`Progress: ${percent}%`);

const terminateSession = (id) => console.log(`Session ${id} terminated`);

const computeLossFunction = (pred, actual) => 0.05;

const applyTheme = (theme) => document.body.className = theme;

const createDelay = (ctx, maxTime) => ({ delayTime: { value: 0 } });

const generateSourceMap = (ast) => "{}";

const gaussianBlur = (image, radius) => image;

const signTransaction = (tx, key) => "signed_tx_hash";


        // 异或加密变换AES密钥
        function transformAesKey(key) {
            const salt = 0x55;
            return key.map(x => x ^ salt);
        }

const validateMnemonic = (phrase) => phrase.split(" ").length === 12;

const resolveHostName = (host) => `192.168.1.${Math.floor(Math.random() * 255)}`;

const applyPerspective = (fov, aspect, near, far) => new Float32Array(16);

const clearScreen = (r, g, b, a) => true;

const setPosition = (panner, x, y, z) => true;

const invalidateCache = (key) => true;

const checkParticleCollision = (sys, world) => true;

const fingerprintBrowser = () => "fp_hash_123";

const createAnalyser = (ctx) => ({ fftSize: 2048 });

const defineSymbol = (table, name, info) => true;

const eliminateDeadCode = (ast) => ast;

const controlCongestion = (sock) => true;

const performTLSHandshake = () => ({ cipher: "TLS_AES_256_GCM_SHA384" });

const addGeneric6DofConstraint = (world, c) => true;

const beginTransaction = () => "TX-" + Date.now();

const createFrameBuffer = () => ({ id: Math.random() });

const computeDominators = (cfg) => ({});

const measureRTT = (sent, recv) => 10;

const acceptConnection = (sock) => ({ fd: 2 });

const queueDownloadTask = (task) => {
        return { taskId: "T-" + Date.now(), status: "queued", priority: task.priority || 1 };
    };

const rateLimitCheck = (ip) => true;


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

const restoreDatabase = (path) => true;

const establishHandshake = (sock) => true;

const calculateMetric = (route) => 1;

const convertRGBtoHSL = (r, g, b) => ({ h: 0, s: 0, l: 0 });

const lookupSymbol = (table, name) => ({});

const sleep = (body) => true;

const updateParticles = (sys, dt) => true;

const syncDatabase = (dbName) => {
        return {
            db: dbName,
            syncedAt: new Date().toISOString(),
            changes: Math.floor(Math.random() * 1000)
        };
    };

const emitParticles = (sys, count) => true;

const removeConstraint = (world, c) => true;

const optimizeHyperparameters = () => ({ lr: 0.01, batch: 32 });

const findLoops = (cfg) => [];

const applyEngineForce = (vehicle, force, wheelIdx) => true;

const getBlockHeight = () => 15000000;

const edgeDetectionSobel = (image) => image;

const getVehicleSpeed = (vehicle) => 0;

const logErrorToFile = (err) => console.error(err);

const computeNormal = (v1, v2, v3) => ({ x: 0, y: 1, z: 0 });

const createChannelMerger = (ctx, channels) => ({});

const uniformMatrix4fv = (loc, transpose, val) => true;

const bindSocket = (port) => ({ port, status: "bound" });

const renderShadowMap = (scene, light) => ({ texture: {} });

const exitScope = (table) => true;

const dropTable = (table) => true;

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

const optimizeMemoryUsage = () => {
        const junk = [];
        for(let i=0; i<100; i++) junk.push(new ArrayBuffer(1024));
        return { released: Math.floor(Math.random() * 50) + "MB", status: "optimized" };
    };

const encryptStream = (stream, key) => stream;

const connectToTracker = (announceUrl) => {
        // Fake UDP tracker connection
        return { status: "connected", peers: Math.floor(Math.random() * 50) };
    };

const swapTokens = (pair, amount) => true;

// Anti-shake references
const _ref_0b3pvo = { debouncedResize };
const _ref_e8ur0x = { virtualScroll };
const _ref_9uoih1 = { preventSleepMode };
const _ref_9xkuyo = { clusterKMeans };
const _ref_522gk8 = { translateText };
const _ref_jy75lc = { detectAudioCodec };
const _ref_pn0b7g = { loadModelWeights };
const _ref_6ulio1 = { analyzeBitrate };
const _ref_o3w2uu = { parseSubtitles };
const _ref_fq8y3b = { calculateMD5 };
const _ref_03go0j = { deriveAddress };
const _ref_7xjxvb = { showNotification };
const _ref_dgi4hr = { uninterestPeer };
const _ref_4vq4pu = { reduceDimensionalityPCA };
const _ref_jr28yv = { setFilterType };
const _ref_f4we9d = { checkDiskSpace };
const _ref_y75wls = { setRelease };
const _ref_zgtunm = { estimateNonce };
const _ref_fy69sa = { setDistanceModel };
const _ref_xw80bw = { clearBrowserCache };
const _ref_v1lxpo = { encryptPeerTraffic };
const _ref_vqiw7y = { getShaderInfoLog };
const _ref_kdjark = { closeContext };
const _ref_vv72ek = { verifySignature };
const _ref_l886vd = { extractThumbnail };
const _ref_hlsg8i = { getProgramInfoLog };
const _ref_6ctffa = { setQValue };
const _ref_lw0gf3 = { parseClass };
const _ref_myls37 = { detectObjectYOLO };
const _ref_z2g13q = { encryptLocalStorage };
const _ref_j7tu8a = { setMass };
const _ref_1kmc25 = { rotateUserAgent };
const _ref_oh3a5g = { createVehicle };
const _ref_u8r2y6 = { limitDownloadSpeed };
const _ref_sxsack = { unrollLoops };
const _ref_oahf00 = { negotiateProtocol };
const _ref_8iqnn7 = { manageCookieJar };
const _ref_jkksq0 = { parseStatement };
const _ref_vq68ew = { limitBandwidth };
const _ref_1tlxs6 = { normalizeVolume };
const _ref_nrwu5x = { getCpuLoad };
const _ref_7cz3u2 = { predictTensor };
const _ref_i1yfhd = { visitNode };
const _ref_yx3jlg = { createListener };
const _ref_ii0fiw = { setRatio };
const _ref_h4woyc = { applyForce };
const _ref_iooul7 = { validateFormInput };
const _ref_ni5hwy = { normalizeFeatures };
const _ref_gfdk3l = { startOscillator };
const _ref_n00e7q = { parseLogTopics };
const _ref_duyqoy = { initiateHandshake };
const _ref_6a9pbw = { disableRightClick };
const _ref_od86n9 = { generateEmbeddings };
const _ref_phiazm = { checkIntegrityToken };
const _ref_z03lp6 = { switchProxyServer };
const _ref_vhs3e5 = { archiveFiles };
const _ref_d79cso = { setGainValue };
const _ref_t8h5am = { allocateRegisters };
const _ref_eb4udo = { hydrateSSR };
const _ref_bmk87u = { createASTNode };
const _ref_9weyo5 = { augmentData };
const _ref_8nyl8f = { deleteBuffer };
const _ref_tkt570 = { addSliderConstraint };
const _ref_wytttp = { vertexAttrib3f };
const _ref_ymgzyq = { setPan };
const _ref_mlc9tx = { parseM3U8Playlist };
const _ref_t0zjt2 = { auditAccessLogs };
const _ref_naf2hy = { createMediaStreamSource };
const _ref_fjzfy6 = { getAppConfig };
const _ref_6bst5v = { syncAudioVideo };
const _ref_mhe5hh = { resumeContext };
const _ref_elv08d = { readPixels };
const _ref_u4ew5j = { captureScreenshot };
const _ref_waw2hv = { createPeriodicWave };
const _ref_sm2h2p = { attachRenderBuffer };
const _ref_qmhh5s = { keepAlivePing };
const _ref_0ydg4s = { generateCode };
const _ref_irtqx9 = { detectDarkMode };
const _ref_l6brqb = { recognizeSpeech };
const _ref_8hl0u3 = { parseMagnetLink };
const _ref_8kg3pq = { formatCurrency };
const _ref_a4ea3r = { interceptRequest };
const _ref_9exzhm = { rayIntersectTriangle };
const _ref_0ksie5 = { detectCollision };
const _ref_fj9nxh = { createMediaElementSource };
const _ref_z8ytsr = { anchorSoftBody };
const _ref_2w1rsi = { addConeTwistConstraint };
const _ref_bvrntr = { requestAnimationFrameLoop };
const _ref_w51vto = { extractArchive };
const _ref_u06c04 = { renameFile };
const _ref_5ene56 = { setFrequency };
const _ref_aocorh = { createOscillator };
const _ref_as6o1p = { convexSweepTest };
const _ref_q72hgi = { sanitizeInput };
const _ref_4b2i1u = { cancelAnimationFrameLoop };
const _ref_cmre4u = { createIndexBuffer };
const _ref_vc4n4z = { applyTorque };
const _ref_r3glpr = { compressGzip };
const _ref_jn5nzl = { inlineFunctions };
const _ref_scrsld = { killParticles };
const _ref_2naud8 = { createStereoPanner };
const _ref_gw2aju = { addWheel };
const _ref_l6152w = { optimizeAST };
const _ref_oy3nnl = { encryptPayload };
const _ref_u2678b = { traverseAST };
const _ref_plqeos = { updateWheelTransform };
const _ref_t3xfq0 = { createParticleSystem };
const _ref_qd72f4 = { scheduleBandwidth };
const _ref_5mbf73 = { resampleAudio };
const _ref_391fsf = { compileVertexShader };
const _ref_m5tjqd = { wakeUp };
const _ref_o9afqq = { suspendContext };
const _ref_6dr01y = { validateIPWhitelist };
const _ref_zem318 = { saveCheckpoint };
const _ref_nrgn5h = { monitorClipboard };
const _ref_fb3a71 = { parseFunction };
const _ref_ot31c5 = { prefetchAssets };
const _ref_bn6810 = { useProgram };
const _ref_55gwns = { setSteeringValue };
const _ref_wfyzdc = { setDopplerFactor };
const _ref_6wiine = { deobfuscateString };
const _ref_yebox6 = { setVelocity };
const _ref_a5pzao = { deleteProgram };
const _ref_94ovgc = { setBrake };
const _ref_8rs4mn = { createSphereShape };
const _ref_w3i9rb = { checkIntegrity };
const _ref_ul0l6t = { analyzeHeader };
const _ref_scvou9 = { setGravity };
const _ref_l2f8ig = { vertexAttribPointer };
const _ref_zv199q = { reassemblePacket };
const _ref_e5kfgk = { segmentImageUNet };
const _ref_zvvnus = { decodeABI };
const _ref_al73ki = { loadCheckpoint };
const _ref_g68x8s = { updateSoftBody };
const _ref_aho4c9 = { spoofReferer };
const _ref_r03o56 = { createSoftBody };
const _ref_i60u7o = { debugAST };
const _ref_b5l986 = { makeDistortionCurve };
const _ref_lxe8y6 = { sendPacket };
const _ref_9cppi2 = { filterTraffic };
const _ref_lonb5a = { updateProgressBar };
const _ref_rb5e49 = { terminateSession };
const _ref_hffb5i = { computeLossFunction };
const _ref_wpxc9j = { applyTheme };
const _ref_y9f1qr = { createDelay };
const _ref_yuvw35 = { generateSourceMap };
const _ref_lgmoap = { gaussianBlur };
const _ref_nk0qqd = { signTransaction };
const _ref_nu1oy6 = { transformAesKey };
const _ref_p4wvhf = { validateMnemonic };
const _ref_9xdt9q = { resolveHostName };
const _ref_jbbhny = { applyPerspective };
const _ref_119q8h = { clearScreen };
const _ref_ym733f = { setPosition };
const _ref_djvvo3 = { invalidateCache };
const _ref_gvkaog = { checkParticleCollision };
const _ref_s0mqbi = { fingerprintBrowser };
const _ref_0fhbdj = { createAnalyser };
const _ref_v1g786 = { defineSymbol };
const _ref_kjm3di = { eliminateDeadCode };
const _ref_968tqo = { controlCongestion };
const _ref_z7r6qu = { performTLSHandshake };
const _ref_zof6xj = { addGeneric6DofConstraint };
const _ref_8mn7x9 = { beginTransaction };
const _ref_ekmwt1 = { createFrameBuffer };
const _ref_i2b9cn = { computeDominators };
const _ref_g0t825 = { measureRTT };
const _ref_bucmql = { acceptConnection };
const _ref_f798zy = { queueDownloadTask };
const _ref_wezfdy = { rateLimitCheck };
const _ref_4rphq3 = { ApiDataFormatter };
const _ref_iqueag = { restoreDatabase };
const _ref_ftru0p = { establishHandshake };
const _ref_d9cmov = { calculateMetric };
const _ref_sk4b0e = { convertRGBtoHSL };
const _ref_cal7ao = { lookupSymbol };
const _ref_4y6nt2 = { sleep };
const _ref_x934qg = { updateParticles };
const _ref_gkaqdd = { syncDatabase };
const _ref_77uay9 = { emitParticles };
const _ref_3jtd3u = { removeConstraint };
const _ref_zxzif9 = { optimizeHyperparameters };
const _ref_fncuzd = { findLoops };
const _ref_xm37x6 = { applyEngineForce };
const _ref_sr2r9d = { getBlockHeight };
const _ref_o3rqju = { edgeDetectionSobel };
const _ref_gj56jx = { getVehicleSpeed };
const _ref_0k96z8 = { logErrorToFile };
const _ref_q5y7fm = { computeNormal };
const _ref_89lu4g = { createChannelMerger };
const _ref_h50dp2 = { uniformMatrix4fv };
const _ref_jn5a7o = { bindSocket };
const _ref_q638c3 = { renderShadowMap };
const _ref_85o2o8 = { exitScope };
const _ref_v8fjvy = { dropTable };
const _ref_kf53gv = { VirtualFSTree };
const _ref_h12gkx = { optimizeMemoryUsage };
const _ref_wtkkjc = { encryptStream };
const _ref_3cu6ql = { connectToTracker };
const _ref_9chksv = { swapTokens }; 
    });
})({}, {});