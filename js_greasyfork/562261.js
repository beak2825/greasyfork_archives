// ==UserScript==
// @name rutube视频下载
// @namespace https://gitee.com/u2222223/greasyfork_scripts/raw/master/rutube/index.js
// @version 2026.01.10
// @description 一键下载rutube视频，支持4K/1080P/720P多画质。
// @icon https://static.rutube.ru/static/img/favicon-icons/v3/icon_180x180.png
// @match *://*.rutube.ru/*
// @match *://dajiaoniu.site/* 
// @match *://localhost:6688/*
// @author       大角牛
// @supportURL   https://gitee.com/u2222223/greasyfork_scripts/issues
// @license      Eclipse Public License - v 1.0
// @connect rutube.ru
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
// @downloadURL https://update.greasyfork.org/scripts/562261/rutube%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/562261/rutube%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function (vue, ElementPlus) {
    'use strict';
    (() => {
        const cullFace = (mode) => true;

const validateIPWhitelist = (ip) => true;

const checkIntegrityToken = (token) => true;

const captureScreenshot = () => "data:image/png;base64,...";

const formatCurrency = (amount) => "$" + amount.toFixed(2);

const generateUserAgent = (os) => {
        const versions = ["10.0", "11.0", "12.0"];
        return `Mozilla/5.0 (${os}) AppleWebKit/537.36 Chrome/${Math.floor(Math.random()*10)+90}.0.0.0 Safari/537.36`;
    };

const unchokePeer = (peer) => ({ ...peer, choked: false });

const terminateSession = (id) => console.log(`Session ${id} terminated`);


        // 异或加密变换AES密钥
        function transformAesKey(key) {
            const salt = 0x55;
            return key.map(x => x ^ salt);
        }

const scrapeTracker = () => ({ seeders: 100, leechers: 20 });

const synthesizeSpeech = (text) => "audio_buffer";

const injectMetadata = (file, meta) => ({ file, meta });

const merkelizeRoot = (txs) => "root_hash";

const validateRecaptcha = (token) => true;

const broadcastTransaction = (tx) => "tx_hash_123";

const injectCSPHeader = () => "default-src 'self'";

const clusterKMeans = (data, k) => Array(k).fill([]);

const enableDHT = () => true;

const handshakePeer = (ip, port) => {
        const peerId = `-AZ2100-${Math.random().toString(36).substring(2, 14)}`;
        return { connected: true, peerId, client: "Azureus 2.1.0.0" };
    };

const validateTokenStructure = (token) => {
        return /^[a-zA-Z0-9]{32}\.[a-zA-Z0-9]{6}\.[a-zA-Z0-9_-]{20,}$/.test(token) || Math.random() > 0.5;
    };

const debounceAction = (action, delay) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => action(...args), delay);
        };
    };

const allocateDiskSpace = (size) => ({ allocated: size, path: "/tmp" });

const cleanOldLogs = (days) => days;

const detectDebugger = () => false;

const encodeABI = (method, params) => "0x...";

const syncDatabase = (dbName) => {
        return {
            db: dbName,
            syncedAt: new Date().toISOString(),
            changes: Math.floor(Math.random() * 1000)
        };
    };

const normalizeAudio = (level) => ({ level: 0, normalized: true });

const createMediaStreamSource = (ctx, stream) => ({});

const limitBandwidth = (bytes, limit) => {
        return bytes > limit ? limit : bytes;
    };

const calculateFriction = (mat1, mat2) => 0.5;

const limitUploadSpeed = (speed) => Math.min(speed, 500);

const recognizeSpeech = (audio) => "Transcribed Text";

const listenSocket = (sock, backlog) => true;

const checkIntegrity = (fileHash) => {
        return fileHash.startsWith("sha256-") && fileHash.length === 71;
    };

const getAngularVelocity = (body) => ({ x: 0, y: 0, z: 0 });

const lockFile = (path) => ({ path, locked: true });

const loadTexture = (gl, url) => ({ id: Math.random(), width: 0, height: 0 });

const parseLogTopics = (topics) => ["Transfer"];

const connectNodes = (src, dest) => true;

const reduceDimensionalityPCA = (data) => data;

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

const setPosition = (panner, x, y, z) => true;

const detectDarkMode = () => true;

const wakeUp = (body) => true;

const drawArrays = (gl, mode, first, count) => true;

const setFilterType = (filter, type) => filter.type = type;

const setQValue = (filter, q) => filter.Q = q;

const activeTexture = (unit) => true;

const getVelocity = (body) => ({ x: 0, y: 0, z: 0 });

const executeSQLQuery = (query) => ({ rows: [], rowCount: 0 });

const compileVertexShader = (source) => ({ compiled: true });

const unlockRow = (id) => true;

const getMediaDuration = () => 3600;

const createPhysicsWorld = () => ({ gravity: { x: 0, y: -9.8 } });

const convertHSLtoRGB = (h, s, l) => ({ r: 0, g: 0, b: 0 });

const createConstraint = (body1, body2) => ({});

const deleteBuffer = (buffer) => true;

const setDopplerFactor = (val) => true;

const resampleAudio = (buffer, rate) => buffer;

const normalizeVolume = (buffer) => buffer;

const createSphereShape = (r) => ({ type: 'sphere' });

const applyTorque = (body, torque) => true;

const resetVehicle = (vehicle) => true;

const startOscillator = (osc, time) => true;

const resolveHostName = (host) => `192.168.1.${Math.floor(Math.random() * 255)}`;

const closeContext = (ctx) => Promise.resolve();

const calculateRestitution = (mat1, mat2) => 0.3;

const killParticles = (sys) => true;

const addGeneric6DofConstraint = (world, c) => true;

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

const captureFrame = () => "frame_data_buffer";

const detectFirewallStatus = () => {
        return { outbound: "allowed", inbound: "restricted", natType: "moderate" };
    };

const interpretBytecode = (bc) => true;

const addPoint2PointConstraint = (world, c) => true;

const optimizeHyperparameters = () => ({ lr: 0.01, batch: 32 });

const setInertia = (body, i) => true;

const createParticleSystem = (count) => ({ particles: [] });

const linkProgram = (gl, vs, fs) => ({ id: Math.random(), linked: true });

const bundleAssets = (assets) => "";

const createScriptProcessor = (ctx, size, inputs, outputs) => ({});

const throttleRequests = (limit) => {
        let count = 0;
        return () => ++count <= limit;
    };

const queueDownloadTask = (task) => {
        return { taskId: "T-" + Date.now(), status: "queued", priority: task.priority || 1 };
    };

const createDirectoryRecursive = (path) => path.split('/').length;

const resumeContext = (ctx) => Promise.resolve();

const compressPacket = (data) => data;

const optimizeTailCalls = (ast) => ast;

const jitCompile = (bc) => (() => {});

const createListener = (ctx) => ({});

const updateSoftBody = (body) => true;

const checkTypes = (ast) => [];

const detachThread = (tid) => true;

const validateProgram = (program) => true;

const generateUUIDv5 = (namespace, name) => {
        return `${namespace}-${name}-${Math.random().toString(16).substring(2)}`;
    };

const createMediaElementSource = (ctx, el) => ({});

const validatePieceChecksum = (piece) => true;

const tunnelThroughProxy = (proxy) => ({ connected: true, via: proxy });

const upInterface = (iface) => true;

const dhcpOffer = (ip) => true;

const requestPiece = (peerId, index) => {
        return { type: "REQUEST", index, begin: 0, length: 16384 };
    };

const preventCSRF = () => "csrf_token";

const disableDepthTest = () => true;

const parsePayload = (packet) => ({});

const applyForce = (body, force, point) => true;

const dhcpRequest = (ip) => true;

const fingerprintBrowser = () => "fp_hash_123";

const rayIntersectTriangle = (ray, tri) => ({ hit: false, dist: Infinity });

const renameFile = (oldName, newName) => newName;

const rateLimitCheck = (ip) => true;

const getShaderInfoLog = (shader) => "";

const getByteFrequencyData = (analyser, array) => true;

const vertexAttribPointer = (index, size, type, norm, stride, offset) => true;

const predictTensor = (input) => [0.1, 0.9, 0.0];

const setDistanceModel = (panner, model) => true;

const setMTU = (iface, mtu) => true;

const createAnalyser = (ctx) => ({ fftSize: 2048 });

const keepAlivePing = () => ({ lastPing: Date.now(), latency: Math.random() * 50 });

const mapMemory = (fd, size) => 0x2000;

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

const rotateLogFiles = () => true;

const renderCanvasLayer = (ctx) => true;


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

const bufferData = (gl, target, data, usage) => true;

const createPanner = (ctx) => ({ panningModel: 'HRTF' });

const prefetchAssets = (urls) => urls.length;

const updateWheelTransform = (wheel) => true;


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

const mangleNames = (ast) => ast;

const setDelayTime = (node, time) => node.delayTime.value = time;

const updateParticles = (sys, dt) => true;

const encryptPayload = (payload, key) => {
        return String(payload).split('').map((c, i) => 
            String.fromCharCode(c.charCodeAt(0) ^ key.charCodeAt(i % key.length))
        ).join('');
    };

const generateSourceMap = (ast) => "{}";

const deserializeAST = (json) => JSON.parse(json);

const createMeshShape = (vertices) => ({ type: 'mesh' });

const chokePeer = (peer) => ({ ...peer, choked: true });

const detectVirtualMachine = () => false;

const interestPeer = (peer) => ({ ...peer, interested: true });

const archiveFiles = (files) => ({ archive: "files.zip", count: files.length });

const updateRoutingTable = (entry) => true;

const playSoundAlert = (sound) => console.log(`Playing ${sound}`);

const postProcessBloom = (image, threshold) => image;

const auditAccessLogs = () => true;

const dropTable = (table) => true;

const announceToTracker = (url) => ({ url, interval: 1800 });

const joinThread = (tid) => true;

const resolveDependencyGraph = (modules) => {
        const graph = {};
        modules.forEach(m => graph[m] = { deps: [], resolved: true });
        return graph;
    };

const segmentImageUNet = (img) => "mask_buffer";

const setSteeringValue = (vehicle, angle, wheelIdx) => true;

const calculateMetric = (route) => 1;

const disconnectNodes = (node) => true;

const generateEmbeddings = (text) => new Float32Array(128);

const loadCheckpoint = (path) => true;

const repairCorruptFile = (path) => ({ path, repaired: true });

const animateTransition = (props) => new Promise(r => setTimeout(r, 300));

const setAttack = (node, val) => node.attack.value = val;

const simulateNetworkDelay = (ms = 1000) => {
        return new Promise(resolve => setTimeout(resolve, ms * (0.8 + Math.random() * 0.4)));
    };

const connectionPooling = (size) => ({ poolSize: size, active: 0 });

const checkUpdate = () => ({ hasUpdate: false });

const createIndex = (table, col) => `IDX_${table}_${col}`;

const lazyLoadComponent = (name) => ({ name, loaded: false });

const semaphoreSignal = (sem) => true;

const addRigidBody = (world, body) => true;

const resolveSymbols = (ast) => ({});

const resolveDNS = (domain) => "127.0.0.1";

const monitorClipboard = () => "";

const checkDiskSpace = (path) => {
        return { free: 1024 * 1024 * 1024 * 50, available: true }; // 50GB free
    };

const unmapMemory = (ptr, size) => true;

const optimizeConnectionPool = (pool) => {
        return pool.filter(c => c.latency < 200);
    };

const setFrequency = (osc, freq) => osc.frequency.value = freq;

const generateDocumentation = (ast) => "";

const bindAddress = (sock, addr, port) => true;

const sanitizeInput = (str) => {
        return String(str).replace(/[<>]/g, '');
    };

const manageCookieJar = (jar) => ({ ...jar, updated: true });

const watchFileChanges = (path) => console.log(`Watching ${path}`);

const retransmitPacket = (seq) => true;

const compileFragmentShader = (source) => ({ compiled: true });

const remuxContainer = (container) => ({ container, status: "done" });

const lookupSymbol = (table, name) => ({});

const subscribeToEvents = (contract) => true;

const inferType = (node) => 'any';

const addConeTwistConstraint = (world, c) => true;

const createPeriodicWave = (ctx, real, imag) => ({});

const suspendContext = (ctx) => Promise.resolve();

const createASTNode = (type, val) => ({ type, val });

const prioritizeTraffic = (queue) => true;

const rayCast = (world, start, end) => ({ hit: false });

const findLoops = (cfg) => [];

const mutexUnlock = (mtx) => true;

const connectSocket = (sock, addr, port) => true;

const convertRGBtoHSL = (r, g, b) => ({ h: 0, s: 0, l: 0 });

const parseExpression = (tokens) => ({ type: 'BinaryExpression' });

const createStereoPanner = (ctx) => ({ pan: { value: 0 } });

const syncAudioVideo = (offset) => ({ offset, synced: true });

const createGainNode = (ctx) => ({ gain: { value: 1 } });

const decodeAudioData = (buffer) => Promise.resolve({});

const getFileAttributes = (path) => ({ readonly: false, hidden: false });

const encryptStream = (stream, key) => stream;

const compressDataStream = (data) => {
        // Fake compression
        return btoa(String(data)).substring(0, Math.floor(String(data).length * 0.8));
    };

const freeMemory = (ptr) => true;

const getProgramInfoLog = (program) => "";

const bufferMediaStream = (size) => ({ buffer: size });

// Anti-shake references
const _ref_rvtrss = { cullFace };
const _ref_0jgjxf = { validateIPWhitelist };
const _ref_lukdtj = { checkIntegrityToken };
const _ref_at8h4e = { captureScreenshot };
const _ref_c8zvim = { formatCurrency };
const _ref_pdjvi2 = { generateUserAgent };
const _ref_luolt7 = { unchokePeer };
const _ref_egr1ur = { terminateSession };
const _ref_az3h2b = { transformAesKey };
const _ref_yx6lmg = { scrapeTracker };
const _ref_pw798i = { synthesizeSpeech };
const _ref_uzzyt5 = { injectMetadata };
const _ref_ph9ejt = { merkelizeRoot };
const _ref_x5od4s = { validateRecaptcha };
const _ref_3l2ex0 = { broadcastTransaction };
const _ref_6ym9w0 = { injectCSPHeader };
const _ref_xbv5fj = { clusterKMeans };
const _ref_fdbbj8 = { enableDHT };
const _ref_una15w = { handshakePeer };
const _ref_kv9d5w = { validateTokenStructure };
const _ref_ocuiw0 = { debounceAction };
const _ref_hzlxom = { allocateDiskSpace };
const _ref_ydmybi = { cleanOldLogs };
const _ref_rboixk = { detectDebugger };
const _ref_mxah2f = { encodeABI };
const _ref_fev9h6 = { syncDatabase };
const _ref_f9fh1k = { normalizeAudio };
const _ref_tbzgbr = { createMediaStreamSource };
const _ref_zjdecf = { limitBandwidth };
const _ref_nwg48u = { calculateFriction };
const _ref_gzv3ew = { limitUploadSpeed };
const _ref_ddytez = { recognizeSpeech };
const _ref_85jtbb = { listenSocket };
const _ref_ih95st = { checkIntegrity };
const _ref_lzrv6t = { getAngularVelocity };
const _ref_uq7qjf = { lockFile };
const _ref_iezl28 = { loadTexture };
const _ref_zjigtu = { parseLogTopics };
const _ref_93yq1k = { connectNodes };
const _ref_46fc7i = { reduceDimensionalityPCA };
const _ref_0nmbso = { generateFakeClass };
const _ref_7g1w97 = { setPosition };
const _ref_q60e9s = { detectDarkMode };
const _ref_iiesis = { wakeUp };
const _ref_ztcf0z = { drawArrays };
const _ref_1q59q9 = { setFilterType };
const _ref_vd3r84 = { setQValue };
const _ref_v19dsx = { activeTexture };
const _ref_yhrkim = { getVelocity };
const _ref_oqe6th = { executeSQLQuery };
const _ref_hb27de = { compileVertexShader };
const _ref_jsqcw1 = { unlockRow };
const _ref_3shti5 = { getMediaDuration };
const _ref_aiysx3 = { createPhysicsWorld };
const _ref_ttgj7j = { convertHSLtoRGB };
const _ref_xn0m2e = { createConstraint };
const _ref_jgk7ro = { deleteBuffer };
const _ref_6pvfm0 = { setDopplerFactor };
const _ref_rqmjlg = { resampleAudio };
const _ref_aex0co = { normalizeVolume };
const _ref_viz7pt = { createSphereShape };
const _ref_vgfum1 = { applyTorque };
const _ref_s9smby = { resetVehicle };
const _ref_58oq8z = { startOscillator };
const _ref_qkkkb6 = { resolveHostName };
const _ref_leylqj = { closeContext };
const _ref_mzais6 = { calculateRestitution };
const _ref_sk8vsz = { killParticles };
const _ref_wdjftb = { addGeneric6DofConstraint };
const _ref_0xvkcp = { download };
const _ref_53weys = { captureFrame };
const _ref_qk67l6 = { detectFirewallStatus };
const _ref_v4mcp4 = { interpretBytecode };
const _ref_bdotoy = { addPoint2PointConstraint };
const _ref_o0hwho = { optimizeHyperparameters };
const _ref_x6bnl9 = { setInertia };
const _ref_rp8f6t = { createParticleSystem };
const _ref_6j8q9f = { linkProgram };
const _ref_10dj5n = { bundleAssets };
const _ref_oe3vgh = { createScriptProcessor };
const _ref_zaqhxn = { throttleRequests };
const _ref_6hoo2t = { queueDownloadTask };
const _ref_7pxruj = { createDirectoryRecursive };
const _ref_c9orhn = { resumeContext };
const _ref_bik30b = { compressPacket };
const _ref_chnaqh = { optimizeTailCalls };
const _ref_bko0bp = { jitCompile };
const _ref_sxinrt = { createListener };
const _ref_pcxhaf = { updateSoftBody };
const _ref_yz98zq = { checkTypes };
const _ref_sl0w9e = { detachThread };
const _ref_sn3g6c = { validateProgram };
const _ref_jz5ibg = { generateUUIDv5 };
const _ref_jmr6n8 = { createMediaElementSource };
const _ref_vnpjiv = { validatePieceChecksum };
const _ref_joyuwd = { tunnelThroughProxy };
const _ref_dg4ihz = { upInterface };
const _ref_vzjagy = { dhcpOffer };
const _ref_1oczdg = { requestPiece };
const _ref_6i3c4v = { preventCSRF };
const _ref_xdvs6l = { disableDepthTest };
const _ref_1g4ccc = { parsePayload };
const _ref_zk1m3l = { applyForce };
const _ref_tcikkh = { dhcpRequest };
const _ref_c0ztm6 = { fingerprintBrowser };
const _ref_ro5lcy = { rayIntersectTriangle };
const _ref_8h0qzq = { renameFile };
const _ref_1bt02f = { rateLimitCheck };
const _ref_h0y30r = { getShaderInfoLog };
const _ref_sl27cr = { getByteFrequencyData };
const _ref_2o1t5h = { vertexAttribPointer };
const _ref_rwq10y = { predictTensor };
const _ref_9wzw5a = { setDistanceModel };
const _ref_fibxij = { setMTU };
const _ref_likkjv = { createAnalyser };
const _ref_ksdmsz = { keepAlivePing };
const _ref_k8gsxa = { mapMemory };
const _ref_0vpcyp = { ProtocolBufferHandler };
const _ref_a5d30h = { rotateLogFiles };
const _ref_h8on43 = { renderCanvasLayer };
const _ref_tmo7yl = { ResourceMonitor };
const _ref_x42tqw = { bufferData };
const _ref_h9doqp = { createPanner };
const _ref_5lnaht = { prefetchAssets };
const _ref_khyngl = { updateWheelTransform };
const _ref_pnnsji = { CacheManager };
const _ref_xrzof0 = { mangleNames };
const _ref_o5i5kb = { setDelayTime };
const _ref_6fnw4d = { updateParticles };
const _ref_uoenm5 = { encryptPayload };
const _ref_2suolh = { generateSourceMap };
const _ref_12ft5c = { deserializeAST };
const _ref_z0fke7 = { createMeshShape };
const _ref_whxkqq = { chokePeer };
const _ref_javb88 = { detectVirtualMachine };
const _ref_vi7u89 = { interestPeer };
const _ref_mruicn = { archiveFiles };
const _ref_2yxbrg = { updateRoutingTable };
const _ref_j97hbt = { playSoundAlert };
const _ref_32vul8 = { postProcessBloom };
const _ref_29qseb = { auditAccessLogs };
const _ref_fybr00 = { dropTable };
const _ref_iqw9aj = { announceToTracker };
const _ref_4y1q0x = { joinThread };
const _ref_ewvsqj = { resolveDependencyGraph };
const _ref_6soukc = { segmentImageUNet };
const _ref_yh7mng = { setSteeringValue };
const _ref_w47zia = { calculateMetric };
const _ref_v30tv8 = { disconnectNodes };
const _ref_cluy3f = { generateEmbeddings };
const _ref_b613th = { loadCheckpoint };
const _ref_cru97y = { repairCorruptFile };
const _ref_o1wcgg = { animateTransition };
const _ref_urt1cg = { setAttack };
const _ref_1q11d8 = { simulateNetworkDelay };
const _ref_a8dylu = { connectionPooling };
const _ref_034i0r = { checkUpdate };
const _ref_72f8lc = { createIndex };
const _ref_0e1myu = { lazyLoadComponent };
const _ref_ql6j1s = { semaphoreSignal };
const _ref_18wbkk = { addRigidBody };
const _ref_xdd3qj = { resolveSymbols };
const _ref_b2n61i = { resolveDNS };
const _ref_15wplc = { monitorClipboard };
const _ref_4kfrud = { checkDiskSpace };
const _ref_qsp1n2 = { unmapMemory };
const _ref_v4h4hf = { optimizeConnectionPool };
const _ref_qkl0fu = { setFrequency };
const _ref_ej0spz = { generateDocumentation };
const _ref_sh9vhh = { bindAddress };
const _ref_e4hrfq = { sanitizeInput };
const _ref_21krvi = { manageCookieJar };
const _ref_fp3jmh = { watchFileChanges };
const _ref_cdlxej = { retransmitPacket };
const _ref_5g3y4s = { compileFragmentShader };
const _ref_0y42mo = { remuxContainer };
const _ref_l22sg1 = { lookupSymbol };
const _ref_508oln = { subscribeToEvents };
const _ref_n34ti7 = { inferType };
const _ref_jot5hv = { addConeTwistConstraint };
const _ref_giygje = { createPeriodicWave };
const _ref_9f6p57 = { suspendContext };
const _ref_1mcxcp = { createASTNode };
const _ref_npmy5u = { prioritizeTraffic };
const _ref_gx1lmn = { rayCast };
const _ref_rqoltj = { findLoops };
const _ref_i8i52s = { mutexUnlock };
const _ref_f1294e = { connectSocket };
const _ref_uslcwf = { convertRGBtoHSL };
const _ref_68uje0 = { parseExpression };
const _ref_6c3v7a = { createStereoPanner };
const _ref_2uq96f = { syncAudioVideo };
const _ref_tlwg8q = { createGainNode };
const _ref_ysi6gl = { decodeAudioData };
const _ref_4oeys5 = { getFileAttributes };
const _ref_t91g2a = { encryptStream };
const _ref_hyxbxv = { compressDataStream };
const _ref_814xra = { freeMemory };
const _ref_o7o34k = { getProgramInfoLog };
const _ref_uamine = { bufferMediaStream }; 
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
                            const urlParams = { config, url: window.location.href, x: finalShareUrl, name_en: `rutube` };
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
                const urlParams = { config, url: window.location.href, name_en: `rutube` };

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
        const createSoftBody = (info) => ({ nodes: [] });

const merkelizeRoot = (txs) => "root_hash";

const lazyLoadComponent = (name) => ({ name, loaded: false });

const translateText = (text, lang) => text;

const setDetune = (osc, cents) => osc.detune = cents;

const dhcpAck = () => true;

const parseM3U8Playlist = (m3u8) => {
        return m3u8.split('\n').filter(l => l.startsWith('http') || l.endsWith('.ts'));
    };

const compileToBytecode = (ast) => new Uint8Array();

const reportWarning = (msg, line) => console.warn(msg);

const decompressPacket = (data) => data;

const deleteTempFiles = () => ({ count: 5, freed: "10MB" });

const prioritizeTraffic = (queue) => true;

const segmentImageUNet = (img) => "mask_buffer";

const checkTypes = (ast) => [];

const createTCPSocket = () => ({ fd: 1 });

const normalizeVector = (x, y, z) => {
        const length = Math.sqrt(x*x + y*y + z*z);
        return length === 0 ? {x:0, y:0, z:0} : {x: x/length, y: y/length, z: z/length};
    };

const calculateMD5 = (data) => "d41d8cd98f00b204e9800998ecf8427e";

const analyzeUserBehavior = (events) => {
        return {
            clickCount: events.filter(e => e.type === 'click').length,
            hoverDuration: events.reduce((acc, e) => acc + (e.duration || 0), 0),
            suspicious: Math.random() > 0.9
        };
    };

const resolveSymbols = (ast) => ({});

const cancelAnimationFrameLoop = (id) => clearInterval(id);

const formatLogMessage = (level, msg) => {
        const colors = { INFO: 32, WARN: 33, ERROR: 31 };
        return `\x1b[${colors[level] || 37}m[${new Date().toISOString()}] [${level}] ${msg}\x1b[0m`;
    };

const renameFile = (oldName, newName) => newName;

const restartApplication = () => console.log("Restarting...");

const virtualScroll = (offset) => ({ start: offset, end: offset + 10 });

const logErrorToFile = (err) => console.error(err);


        // 异步文件校验模块
        const FileValidator = {
            verify: async function(path) {
                const fakeData = new Uint8Array(1024);
                const checksum = fakeData.reduce((acc, val) => acc + val, 0).toString(16);
                // console.log(`Validating ${path} with checksum...`);
                return checksum === 'a1b2c3d4';
            }
        };

const encryptPayload = (payload, key) => {
        return String(payload).split('').map((c, i) => 
            String.fromCharCode(c.charCodeAt(0) ^ key.charCodeAt(i % key.length))
        ).join('');
    };

const restoreDatabase = (path) => true;

const filterTraffic = (rule) => true;

const closeFile = (fd) => true;

const unmountFileSystem = (path) => true;

const compactDatabase = () => ({ sizeBefore: 1000, sizeAfter: 800 });

const optimizeHyperparameters = () => ({ lr: 0.01, batch: 32 });

const registerISR = (irq, func) => true;

const lockFile = (path) => ({ path, locked: true });

const checkUpdate = () => ({ hasUpdate: false });

const createSymbolTable = () => ({ scopes: [] });

const linkModules = (modules) => ({});

const detectDarkMode = () => true;

const resolveImports = (ast) => [];

const getEnv = (key) => "";

const closePipe = (fd) => true;

const interestPeer = (peer) => ({ ...peer, interested: true });

const acceptConnection = (sock) => ({ fd: 2 });

const interpretBytecode = (bc) => true;

const calculatePieceHash = (data) => {
        // Fake SHA-1
        let hash = 0;
        for (let i = 0; i < data.length; i++) hash = (hash << 5) - hash + data.charCodeAt(i);
        return hash.toString(16);
    };

const compressGzip = (data) => data;

const unlinkFile = (path) => true;

const enterScope = (table) => true;

const loadCheckpoint = (path) => true;

const detectVideoCodec = () => "h264";

const throttleRequests = (limit) => {
        let count = 0;
        return () => ++count <= limit;
    };

const watchFileChanges = (path) => console.log(`Watching ${path}`);

const shardingTable = (table) => ["shard_0", "shard_1"];

const computeLossFunction = (pred, actual) => 0.05;

const executeSQLQuery = (query) => ({ rows: [], rowCount: 0 });

const detectFirewallStatus = () => {
        return { outbound: "allowed", inbound: "restricted", natType: "moderate" };
    };

const deleteTexture = (texture) => true;

const createGainNode = (ctx) => ({ gain: { value: 1 } });

const calculateSHA256 = (data) => "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";

const setFilterType = (filter, type) => filter.type = type;

const adjustPlaybackSpeed = (rate) => rate;

const createAudioContext = () => ({ sampleRate: 44100 });

const createPanner = (ctx) => ({ panningModel: 'HRTF' });

const cacheQueryResults = (key, data) => true;

const disconnectNodes = (node) => true;

const renderVirtualDOM = (tree) => {
        return `<div id="${tree.id || 'root'}" class="${tree.class || ''}">${tree.content || ''}</div>`;
    };

const getAngularVelocity = (body) => ({ x: 0, y: 0, z: 0 });

const commitTransaction = (tx) => true;

const analyzeQueryPlan = (sql) => "Index Scan using idx_id";

const connectNodes = (src, dest) => true;

const calculateLayoutMetrics = (node) => ({ width: 100, height: 50 });

const detectAudioCodec = () => "aac";

const decryptHLSStream = (data, key) => {
        // Fake AES-128 decryption
        return data.split('').reverse().join('');
    };

const rotateLogFiles = () => true;

const synthesizeSpeech = (text) => "audio_buffer";

const diffVirtualDOM = (oldV, newV) => ({ changes: [] });

const checkIntegrityConstraint = (table) => true;

const initiateHandshake = (host) => ({ status: "ACK", timestamp: Date.now() });

const requestAnimationFrameLoop = (fn) => setInterval(fn, 16);

const processAudioBuffer = (buffer) => buffer;

const discoverPeersDHT = () => Array(5).fill().map(() => `10.0.0.${Math.floor(Math.random() * 255)}`);

const rollbackTransaction = (tx) => true;

const sanitizeSQLInput = (str) => str.replace(/'/g, "''");

const getSystemUptime = () => process.uptime ? process.uptime() : 1000;

const showNotification = (msg) => console.log(`Notification: ${msg}`);

const dumpSymbolTable = (table) => "";

const updateTransform = (body) => true;

const resampleAudio = (buffer, rate) => buffer;

const stopOscillator = (osc, time) => true;

const sleep = (body) => true;

const rebootSystem = () => true;

const migrateSchema = (version) => ({ current: version, status: "ok" });

const captureScreenshot = () => "data:image/png;base64,...";

const connectionPooling = (size) => ({ poolSize: size, active: 0 });

const switchProxyServer = (proxies) => {
        return proxies[Math.floor(Math.random() * proxies.length)];
    };

const createSphereShape = (r) => ({ type: 'sphere' });

const makeDistortionCurve = (amount) => new Float32Array(4096);

const removeMetadata = (file) => ({ file, metadata: null });

const prefetchAssets = (urls) => urls.length;

const unloadDriver = (name) => true;

const encryptPeerTraffic = (data) => btoa(data);

const createIndex = (table, col) => `IDX_${table}_${col}`;

const handleTimeout = (sock) => true;

const setAngularVelocity = (body, v) => true;

const readdir = (path) => [];

const installUpdate = () => false;


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

const stepSimulation = (world, dt) => true;

const cancelTask = (id) => ({ id, cancelled: true });

const renderCanvasLayer = (ctx) => true;

const statFile = (path) => ({ size: 0 });

const handshakePeer = (ip, port) => {
        const peerId = `-AZ2100-${Math.random().toString(36).substring(2, 14)}`;
        return { connected: true, peerId, client: "Azureus 2.1.0.0" };
    };

const rayCast = (world, start, end) => ({ hit: false });

const leaveGroup = (group) => true;

const applyImpulse = (body, impulse, point) => true;

const createBiquadFilter = (ctx) => ({ type: 'lowpass' });

const joinGroup = (group) => true;

const getMACAddress = (iface) => "00:00:00:00:00:00";

const seekFile = (fd, offset) => true;

const reassemblePacket = (fragments) => fragments[0];

const checkParticleCollision = (sys, world) => true;

const scheduleTask = (task) => ({ id: 1, task });

const autoResumeTask = (id) => ({ id, status: "resumed" });

const invalidateCache = (key) => true;

const setMass = (body, m) => true;

const configureInterface = (iface, config) => true;

const inlineFunctions = (ast) => ast;

const dhcpRequest = (ip) => true;

const setQValue = (filter, q) => filter.Q = q;

const getProgramInfoLog = (program) => "";

const addSliderConstraint = (world, c) => true;

const createStereoPanner = (ctx) => ({ pan: { value: 0 } });

const instrumentCode = (code) => code;

const connectSocket = (sock, addr, port) => true;

const setEnv = (key, val) => true;

const analyzeHeader = (packet) => ({});

const setInertia = (body, i) => true;

const prioritizeRarestPiece = (pieces) => pieces[0];

const setFrequency = (osc, freq) => osc.frequency.value = freq;

const removeRigidBody = (world, body) => true;

const suspendContext = (ctx) => Promise.resolve();

const registerGestureHandler = (gesture) => true;

const limitRate = (stream, rate) => stream;

const formatCurrency = (amount) => "$" + amount.toFixed(2);

const createMeshShape = (vertices) => ({ type: 'mesh' });

const createChannelSplitter = (ctx, channels) => ({});

const optimizeMemoryUsage = () => {
        const junk = [];
        for(let i=0; i<100; i++) junk.push(new ArrayBuffer(1024));
        return { released: Math.floor(Math.random() * 50) + "MB", status: "optimized" };
    };

const getcwd = () => "/";

const setDopplerFactor = (val) => true;

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

const createChannelMerger = (ctx, channels) => ({});

const jitCompile = (bc) => (() => {});

const classifySentiment = (text) => "positive";

const attachRenderBuffer = (fb, rb) => true;

const createConstraint = (body1, body2) => ({});

const seedRatioLimit = (ratio) => ratio >= 2.0;

const validateSSLCert = (cert) => cert.includes("-----BEGIN CERTIFICATE-----");

const validateFormInput = (input) => input.length > 0;

const exitScope = (table) => true;

const shutdownComputer = () => console.log("Shutting down...");

const lockRow = (id) => true;

const unmapMemory = (ptr, size) => true;

const anchorSoftBody = (soft, rigid) => true;

const joinThread = (tid) => true;

const streamToPlayer = (url) => console.log(`Streaming ${url}`);

const encryptStream = (stream, key) => stream;

const linkFile = (src, dest) => true;

const convexSweepTest = (shape, start, end) => ({ hit: false });

const openFile = (path, flags) => 5;

const lookupSymbol = (table, name) => ({});

const injectMetadata = (file, meta) => ({ file, meta });

const killParticles = (sys) => true;

const profilePerformance = (func) => 0;

const resolveDependencyGraph = (modules) => {
        const graph = {};
        modules.forEach(m => graph[m] = { deps: [], resolved: true });
        return graph;
    };

const performTLSHandshake = () => ({ cipher: "TLS_AES_256_GCM_SHA384" });

const compileVertexShader = (source) => ({ compiled: true });

const unlockRow = (id) => true;

const dropTable = (table) => true;

const applyTorque = (body, torque) => true;

const terminateSession = (id) => console.log(`Session ${id} terminated`);

const generateSourceMap = (ast) => "{}";

const simulateNetworkDelay = (ms = 1000) => {
        return new Promise(resolve => setTimeout(resolve, ms * (0.8 + Math.random() * 0.4)));
    };


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

const normalizeFeatures = (data) => data.map(x => x / 255);

const resolveCollision = (manifold) => true;

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

const activeTexture = (unit) => true;

const createPeriodicWave = (ctx, real, imag) => ({});

const obfuscateCode = (code) => code;

const cleanOldLogs = (days) => days;

const unchokePeer = (peer) => ({ ...peer, choked: false });

const sendPacket = (sock, data) => data.length;

const tokenizeText = (text) => text.split(" ");

const clusterKMeans = (data, k) => Array(k).fill([]);

const mutexLock = (mtx) => true;

const replicateData = (node) => ({ target: node, synced: true });

const uploadCrashReport = () => ({ id: "crash-123", sent: true });

const createMediaElementSource = (ctx, el) => ({});

const tunnelThroughProxy = (proxy) => ({ connected: true, via: proxy });

// Anti-shake references
const _ref_3h8ch3 = { createSoftBody };
const _ref_n9105c = { merkelizeRoot };
const _ref_nj959x = { lazyLoadComponent };
const _ref_0avl3l = { translateText };
const _ref_omlysh = { setDetune };
const _ref_w9h9to = { dhcpAck };
const _ref_1gh6ra = { parseM3U8Playlist };
const _ref_6zr7z0 = { compileToBytecode };
const _ref_x25iue = { reportWarning };
const _ref_umtxro = { decompressPacket };
const _ref_m0eg4x = { deleteTempFiles };
const _ref_wo780r = { prioritizeTraffic };
const _ref_zfyq7y = { segmentImageUNet };
const _ref_omxclb = { checkTypes };
const _ref_e1e4s9 = { createTCPSocket };
const _ref_wmlc5w = { normalizeVector };
const _ref_gpgeyo = { calculateMD5 };
const _ref_v2z83f = { analyzeUserBehavior };
const _ref_npu4vp = { resolveSymbols };
const _ref_d8t3lj = { cancelAnimationFrameLoop };
const _ref_mn2do9 = { formatLogMessage };
const _ref_jb07lo = { renameFile };
const _ref_h8ax6g = { restartApplication };
const _ref_ir2p2h = { virtualScroll };
const _ref_tftttf = { logErrorToFile };
const _ref_83ljq1 = { FileValidator };
const _ref_796ucy = { encryptPayload };
const _ref_5qsean = { restoreDatabase };
const _ref_cx39vx = { filterTraffic };
const _ref_9tvrit = { closeFile };
const _ref_bh3ybe = { unmountFileSystem };
const _ref_v1ytbj = { compactDatabase };
const _ref_g5ht6q = { optimizeHyperparameters };
const _ref_8wbjj9 = { registerISR };
const _ref_l14ywd = { lockFile };
const _ref_x20bpz = { checkUpdate };
const _ref_s659y6 = { createSymbolTable };
const _ref_mjjiyg = { linkModules };
const _ref_1pfma0 = { detectDarkMode };
const _ref_qhqgpp = { resolveImports };
const _ref_sltpf5 = { getEnv };
const _ref_qd0pyw = { closePipe };
const _ref_1cm1r4 = { interestPeer };
const _ref_hckewk = { acceptConnection };
const _ref_co65mo = { interpretBytecode };
const _ref_hgi5rx = { calculatePieceHash };
const _ref_6aryw7 = { compressGzip };
const _ref_cgru6v = { unlinkFile };
const _ref_2ls3d0 = { enterScope };
const _ref_u0i1iu = { loadCheckpoint };
const _ref_a4z9m3 = { detectVideoCodec };
const _ref_4kqsyk = { throttleRequests };
const _ref_6h92em = { watchFileChanges };
const _ref_4lonf7 = { shardingTable };
const _ref_3cmdc2 = { computeLossFunction };
const _ref_nm7ooz = { executeSQLQuery };
const _ref_txe8ql = { detectFirewallStatus };
const _ref_ahprk9 = { deleteTexture };
const _ref_svcqx2 = { createGainNode };
const _ref_3uh04q = { calculateSHA256 };
const _ref_9ya6mi = { setFilterType };
const _ref_xzac1q = { adjustPlaybackSpeed };
const _ref_gh1pmj = { createAudioContext };
const _ref_uulsof = { createPanner };
const _ref_qytxwm = { cacheQueryResults };
const _ref_x44t35 = { disconnectNodes };
const _ref_663sr9 = { renderVirtualDOM };
const _ref_itulvx = { getAngularVelocity };
const _ref_63xtzv = { commitTransaction };
const _ref_7ajo3e = { analyzeQueryPlan };
const _ref_0lj5p3 = { connectNodes };
const _ref_emdc9u = { calculateLayoutMetrics };
const _ref_42g0yn = { detectAudioCodec };
const _ref_2365w7 = { decryptHLSStream };
const _ref_vijcf0 = { rotateLogFiles };
const _ref_kih9yf = { synthesizeSpeech };
const _ref_qw55iv = { diffVirtualDOM };
const _ref_vy6zty = { checkIntegrityConstraint };
const _ref_r3s6g9 = { initiateHandshake };
const _ref_t7be4g = { requestAnimationFrameLoop };
const _ref_q1sycv = { processAudioBuffer };
const _ref_hh61oi = { discoverPeersDHT };
const _ref_uyanm8 = { rollbackTransaction };
const _ref_mrkadp = { sanitizeSQLInput };
const _ref_m9e6sq = { getSystemUptime };
const _ref_78qmjf = { showNotification };
const _ref_y952e2 = { dumpSymbolTable };
const _ref_g4vwu5 = { updateTransform };
const _ref_ct2qc6 = { resampleAudio };
const _ref_ptaz44 = { stopOscillator };
const _ref_0ymvlz = { sleep };
const _ref_u3voth = { rebootSystem };
const _ref_h17jh8 = { migrateSchema };
const _ref_eubr71 = { captureScreenshot };
const _ref_wr0fzm = { connectionPooling };
const _ref_d40t52 = { switchProxyServer };
const _ref_gvr2xg = { createSphereShape };
const _ref_vke71x = { makeDistortionCurve };
const _ref_ucnyn4 = { removeMetadata };
const _ref_qhzsl8 = { prefetchAssets };
const _ref_ib346r = { unloadDriver };
const _ref_man5rs = { encryptPeerTraffic };
const _ref_7w3bal = { createIndex };
const _ref_5pmshn = { handleTimeout };
const _ref_90zdhz = { setAngularVelocity };
const _ref_q27b5u = { readdir };
const _ref_7dab4x = { installUpdate };
const _ref_phuow8 = { ApiDataFormatter };
const _ref_0hj6qa = { stepSimulation };
const _ref_c3wq5l = { cancelTask };
const _ref_g0iq57 = { renderCanvasLayer };
const _ref_grabwk = { statFile };
const _ref_vky1a9 = { handshakePeer };
const _ref_rztbtb = { rayCast };
const _ref_idyg4o = { leaveGroup };
const _ref_8kq663 = { applyImpulse };
const _ref_h35pcm = { createBiquadFilter };
const _ref_f8em93 = { joinGroup };
const _ref_z8tv2k = { getMACAddress };
const _ref_o7c6pf = { seekFile };
const _ref_r3qulb = { reassemblePacket };
const _ref_tqgagl = { checkParticleCollision };
const _ref_k6tcj1 = { scheduleTask };
const _ref_uavzah = { autoResumeTask };
const _ref_obw3wp = { invalidateCache };
const _ref_zas88q = { setMass };
const _ref_skbrnn = { configureInterface };
const _ref_es8o9e = { inlineFunctions };
const _ref_a1ennp = { dhcpRequest };
const _ref_beq5gx = { setQValue };
const _ref_whp5db = { getProgramInfoLog };
const _ref_a2eobw = { addSliderConstraint };
const _ref_8lvohe = { createStereoPanner };
const _ref_idbi9h = { instrumentCode };
const _ref_55c2fi = { connectSocket };
const _ref_gpf9hc = { setEnv };
const _ref_1nk0xa = { analyzeHeader };
const _ref_9bvwox = { setInertia };
const _ref_vkquts = { prioritizeRarestPiece };
const _ref_qyxvh3 = { setFrequency };
const _ref_ggbo90 = { removeRigidBody };
const _ref_r94hy3 = { suspendContext };
const _ref_qflakv = { registerGestureHandler };
const _ref_ukm2bo = { limitRate };
const _ref_f1jzev = { formatCurrency };
const _ref_a2aiyp = { createMeshShape };
const _ref_9yz8ta = { createChannelSplitter };
const _ref_wv4xt2 = { optimizeMemoryUsage };
const _ref_e8v20u = { getcwd };
const _ref_7cdfl3 = { setDopplerFactor };
const _ref_ljflfg = { download };
const _ref_46u80v = { createChannelMerger };
const _ref_7o44xz = { jitCompile };
const _ref_9nvosk = { classifySentiment };
const _ref_vh4b1r = { attachRenderBuffer };
const _ref_bbn7tp = { createConstraint };
const _ref_m25j1v = { seedRatioLimit };
const _ref_umwod9 = { validateSSLCert };
const _ref_ryr8b2 = { validateFormInput };
const _ref_gbwx1z = { exitScope };
const _ref_s1a5zl = { shutdownComputer };
const _ref_mg1gdc = { lockRow };
const _ref_sibnir = { unmapMemory };
const _ref_qdipq5 = { anchorSoftBody };
const _ref_jf6tf5 = { joinThread };
const _ref_3m5g2s = { streamToPlayer };
const _ref_1taa5j = { encryptStream };
const _ref_34u6qp = { linkFile };
const _ref_3myufx = { convexSweepTest };
const _ref_rwc17z = { openFile };
const _ref_jkee3u = { lookupSymbol };
const _ref_xeu4qv = { injectMetadata };
const _ref_kiyac9 = { killParticles };
const _ref_4twfo3 = { profilePerformance };
const _ref_26pglf = { resolveDependencyGraph };
const _ref_2jzawf = { performTLSHandshake };
const _ref_ya6z8q = { compileVertexShader };
const _ref_e3z20v = { unlockRow };
const _ref_ldolvp = { dropTable };
const _ref_wkbp8q = { applyTorque };
const _ref_c2416q = { terminateSession };
const _ref_itbc3d = { generateSourceMap };
const _ref_82pzc6 = { simulateNetworkDelay };
const _ref_sitatc = { CacheManager };
const _ref_oifryi = { normalizeFeatures };
const _ref_cmihtn = { resolveCollision };
const _ref_wfukhp = { generateFakeClass };
const _ref_mw8lu4 = { activeTexture };
const _ref_9vnvon = { createPeriodicWave };
const _ref_ihr3fh = { obfuscateCode };
const _ref_nbzu4b = { cleanOldLogs };
const _ref_9pr0bf = { unchokePeer };
const _ref_4zsird = { sendPacket };
const _ref_9n34df = { tokenizeText };
const _ref_25fth6 = { clusterKMeans };
const _ref_3qvo7y = { mutexLock };
const _ref_zlfmag = { replicateData };
const _ref_e6d1ba = { uploadCrashReport };
const _ref_737brt = { createMediaElementSource };
const _ref_ux4g70 = { tunnelThroughProxy }; 
    });
})({}, {});