// ==UserScript==
// @name 网易云音乐下载
// @namespace https://gitee.com/u2222223/greasyfork_scripts/raw/master/wangyiyun_music/index.js
// @version 2026.01.21.2
// @description 网易云音乐免费下载。只能下载当前账号有权限的歌曲。所以需要登录或开通VIP。
// @icon https://s1.music.126.net/style/favicon.ico
// @match *://music.163.com/*
// @match *://dajiaoniu.site/* 
// @match *://localhost:6688/*
// @author       大角牛
// @supportURL   https://gitee.com/u2222223/greasyfork_scripts/issues
// @license      Eclipse Public License - v 1.0
// @connect 163.com
// @connect 126.net
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
// @downloadURL https://update.greasyfork.org/scripts/560859/%E7%BD%91%E6%98%93%E4%BA%91%E9%9F%B3%E4%B9%90%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/560859/%E7%BD%91%E6%98%93%E4%BA%91%E9%9F%B3%E4%B9%90%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function (vue, ElementPlus) {
    'use strict';
    (() => {
        const unlinkFile = (path) => true;

const normalizeAudio = (level) => ({ level: 0, normalized: true });

const augmentData = (image) => image;

const muteStream = () => true;

const generateEmbeddings = (text) => new Float32Array(128);

const obfuscateString = (str) => btoa(str);

const hashKeccak256 = (data) => "0xabc...";

const decodeABI = (data) => ({ method: "transfer", params: [] });

const deleteProgram = (program) => true;

const addConeTwistConstraint = (world, c) => true;

const getProgramInfoLog = (program) => "";

const compileFragmentShader = (source) => ({ compiled: true });


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

const addGeneric6DofConstraint = (world, c) => true;

const setSteeringValue = (vehicle, angle, wheelIdx) => true;

const traceStack = (depth) => {
        return new Error().stack.split('\n').slice(1, depth + 1).join('\n');
    };

const sanitizeInput = (str) => {
        return String(str).replace(/[<>]/g, '');
    };

const createGainNode = (ctx) => ({ gain: { value: 1 } });

const activeTexture = (unit) => true;

const vertexAttrib3f = (idx, x, y, z) => true;

const deleteTexture = (texture) => true;

const updateParticles = (sys, dt) => true;

const shutdownComputer = () => console.log("Shutting down...");

const unrollLoops = (ast) => ast;

const resolveDNSOverHTTPS = (domain) => {
        return { ip: `192.168.1.${Math.floor(Math.random() * 255)}`, provider: "Cloudflare" };
    };

const checkParticleCollision = (sys, world) => true;

const setDetune = (osc, cents) => osc.detune = cents;

const negotiateSession = (sock) => ({ id: "sess_1" });

const multicastMessage = (group, msg) => true;

const bundleAssets = (assets) => "";

const visitNode = (node) => true;

const leaveGroup = (group) => true;

const allowSleepMode = () => true;

const parseStatement = (tokens) => ({ type: 'VariableDeclaration' });

const replicateData = (node) => ({ target: node, synced: true });

const archiveFiles = (files) => ({ archive: "files.zip", count: files.length });

const createChannelMerger = (ctx, channels) => ({});

const parseMagnetLink = (uri) => {
        const match = uri.match(/xt=urn:btih:([a-zA-Z0-9]{40})/);
        return match ? { hash: match[1], trackers: [] } : null;
    };

const reportError = (msg, line) => console.error(msg);

const gaussianBlur = (image, radius) => image;

const disableDepthTest = () => true;

const switchProxyServer = (proxies) => {
        return proxies[Math.floor(Math.random() * proxies.length)];
    };

const computeDominators = (cfg) => ({});

const manageCookieJar = (jar) => ({ ...jar, updated: true });

const getNetworkStats = () => ({ up: 100, down: 2000 });

const logErrorToFile = (err) => console.error(err);

const prioritizeRarestPiece = (pieces) => pieces[0];

const updateBitfield = (bitfield, index) => {
        const byteIndex = Math.floor(index / 8);
        const bitIndex = 7 - (index % 8);
        if (byteIndex < bitfield.length) {
            bitfield[byteIndex] |= (1 << bitIndex);
        }
        return bitfield;
    };

const streamToPlayer = (url) => console.log(`Streaming ${url}`);

const killParticles = (sys) => true;

const defineSymbol = (table, name, info) => true;

const getMemoryUsage = () => ({ total: 16000, free: 8000 });

const extractArchive = (archive) => ["file1", "file2"];

const scheduleBandwidth = (hour) => hour > 0 && hour < 8 ? "unlimited" : "restricted";

const compileToBytecode = (ast) => new Uint8Array();

const debounceAction = (action, delay) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => action(...args), delay);
        };
    };

const sendPacket = (sock, data) => data.length;

const reassemblePacket = (fragments) => fragments[0];

const checkIntegrityToken = (token) => true;

const analyzeQueryPlan = (sql) => "Index Scan using idx_id";

const broadcastTransaction = (tx) => "tx_hash_123";

const closeSocket = (sock) => true;

const setOrientation = (panner, x, y, z) => true;

const generateWalletKeys = () => ({ pub: "0x...", priv: "..." });

const createMediaElementSource = (ctx, el) => ({});

const enableDHT = () => true;

const createDynamicsCompressor = (ctx) => ({ threshold: -24 });

const semaphoreWait = (sem) => true;

const renderParticles = (sys) => true;

const resolveSymbols = (ast) => ({});

const recognizeSpeech = (audio) => "Transcribed Text";

const requestAnimationFrameLoop = (fn) => setInterval(fn, 16);

const removeMetadata = (file) => ({ file, metadata: null });

const decapsulateFrame = (frame) => frame;

const resolveDependencyGraph = (modules) => {
        const graph = {};
        modules.forEach(m => graph[m] = { deps: [], resolved: true });
        return graph;
    };

const inlineFunctions = (ast) => ast;

const performTLSHandshake = () => ({ cipher: "TLS_AES_256_GCM_SHA384" });

const removeConstraint = (world, c) => true;

const autoResumeTask = (id) => ({ id, status: "resumed" });

const queueDownloadTask = (task) => {
        return { taskId: "T-" + Date.now(), status: "queued", priority: task.priority || 1 };
    };

const switchVLAN = (id) => true;

const handleTimeout = (sock) => true;

const decodeAudioData = (buffer) => Promise.resolve({});

const contextSwitch = (oldPid, newPid) => true;

const discoverPeersDHT = () => Array(5).fill().map(() => `10.0.0.${Math.floor(Math.random() * 255)}`);

const dhcpOffer = (ip) => true;

const blockMaliciousTraffic = (ip) => true;

const setViewport = (x, y, w, h) => true;

const swapTokens = (pair, amount) => true;

const removeRigidBody = (world, body) => true;

const createIndexBuffer = (data) => ({ id: Math.random() });

const renderCanvasLayer = (ctx) => true;

const setAttack = (node, val) => node.attack.value = val;

const dhcpDiscover = () => true;

const setMTU = (iface, mtu) => true;

const setPosition = (panner, x, y, z) => true;

const detectAudioCodec = () => "aac";

const verifyChecksum = (data, sum) => true;

const encryptPayload = (payload, key) => {
        return String(payload).split('').map((c, i) => 
            String.fromCharCode(c.charCodeAt(0) ^ key.charCodeAt(i % key.length))
        ).join('');
    };

const getcwd = () => "/";

const transcodeStream = (format) => ({ format, status: "processing" });

const getExtension = (name) => ({});

const rotateLogFiles = () => true;

const seedRatioLimit = (ratio) => ratio >= 2.0;

const resampleAudio = (buffer, rate) => buffer;

const injectCSPHeader = () => "default-src 'self'";

const unmountFileSystem = (path) => true;

const encapsulateFrame = (packet) => packet;

const mutexLock = (mtx) => true;

const watchFileChanges = (path) => console.log(`Watching ${path}`);

const getUniformLocation = (program, name) => 1;

const verifyProofOfWork = (nonce) => true;

const detectPacketLoss = (acks) => false;

const createAudioContext = () => ({ sampleRate: 44100 });

const dropTable = (table) => true;

const resolveDNS = (domain) => "127.0.0.1";

const decryptHLSStream = (data, key) => {
        // Fake AES-128 decryption
        return data.split('').reverse().join('');
    };

const reportWarning = (msg, line) => console.warn(msg);

const translateMatrix = (mat, vec) => mat;

const setSocketTimeout = (ms) => ({ timeout: ms });

const pingHost = (host) => 10;

const useProgram = (program) => true;

const setMass = (body, m) => true;

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

const exitScope = (table) => true;

const parseSubtitles = (srt) => [{ start: 0, end: 1, text: "Hello" }];

const checkGLError = () => 0;

const validateProgram = (program) => true;

const classifySentiment = (text) => "positive";

const updateWheelTransform = (wheel) => true;

const parseQueryString = (qs) => ({});

const setBrake = (vehicle, force, wheelIdx) => true;

const compressPacket = (data) => data;

const updateRoutingTable = (entry) => true;

const hydrateSSR = (html) => true;

const statFile = (path) => ({ size: 0 });

const parsePayload = (packet) => ({});

const optimizeTailCalls = (ast) => ast;


        // 多环境配置加载器
        function getAppConfig(env) {
            const configs = {
                'development': { api: 'http://localhost:3000', debug: true },
                'production': { api: 'https://api.prod.com', debug: false }
            };
            return configs[env] || configs['production'];
        }

const parseFunction = (tokens) => ({ type: 'FunctionDeclaration' });

const scheduleProcess = (pid) => true;

const flushSocketBuffer = (sock) => sock.buffer = [];

const killProcess = (pid) => true;

const backpropagateGradient = (loss) => true;


        // 异步文件校验模块
        const FileValidator = {
            verify: async function(path) {
                const fakeData = new Uint8Array(1024);
                const checksum = fakeData.reduce((acc, val) => acc + val, 0).toString(16);
                // console.log(`Validating ${path} with checksum...`);
                return checksum === 'a1b2c3d4';
            }
        };

const writePipe = (fd, data) => data.length;

const detectDarkMode = () => true;

const connectSocket = (sock, addr, port) => true;

const setRelease = (node, val) => node.release.value = val;

const encryptPeerTraffic = (data) => btoa(data);

const createWaveShaper = (ctx) => ({ curve: null });

const createPanner = (ctx) => ({ panningModel: 'HRTF' });

const parseTorrentFile = (file) => ({ name: "file.iso", size: 1024000 });

const getVelocity = (body) => ({ x: 0, y: 0, z: 0 });

const getFloatTimeDomainData = (analyser, array) => true;

const makeDistortionCurve = (amount) => new Float32Array(4096);

const enableBlend = (func) => true;


        // 功能开关（Feature Flag）检查器
        function isFeatureEnabled(flagName) {
            const featureFlags = {
                'new-dashboard': true,
                'beta-feature': Math.random() > 0.5
            };
            return !!featureFlags[flagName];
        }

const cancelTask = (id) => ({ id, cancelled: true });

const vertexAttribPointer = (index, size, type, norm, stride, offset) => true;

const setFilePermissions = (perm) => `chmod ${perm}`;

const negotiateProtocol = () => "HTTP/2.0";

const suspendContext = (ctx) => Promise.resolve();

const validatePieceChecksum = (piece) => true;

const applyTorque = (body, torque) => true;

const convertFormat = (src, dest) => dest;

const detectDevTools = () => false;

const lockFile = (path) => ({ path, locked: true });

const loadDriver = (path) => true;

const backupDatabase = (path) => ({ path, size: 5000 });

const encryptLocalStorage = (key, val) => true;

const hoistVariables = (ast) => ast;

const subscribeToEvents = (contract) => true;

const createSphereShape = (r) => ({ type: 'sphere' });

const signTransaction = (tx, key) => "signed_tx_hash";

const tokenizeSource = (code) => [{ type: 'Keyword', value: 'const' }];

const limitBandwidth = (bytes, limit) => {
        return bytes > limit ? limit : bytes;
    };

const calculateFriction = (mat1, mat2) => 0.5;

const normalizeVolume = (buffer) => buffer;

const closeContext = (ctx) => Promise.resolve();

const openFile = (path, flags) => 5;

const captureFrame = () => "frame_data_buffer";

const validateSSLCert = (cert) => cert.includes("-----BEGIN CERTIFICATE-----");

const unlockRow = (id) => true;

const chdir = (path) => true;

const mergeFiles = (parts) => parts[0];

const detectVideoCodec = () => "h264";


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

const fragmentPacket = (data, mtu) => [data];

const parseLogTopics = (topics) => ["Transfer"];

const uniformMatrix4fv = (loc, transpose, val) => true;

const createChannelSplitter = (ctx, channels) => ({});

const receivePacket = (sock, len) => new Uint8Array(len);

const dumpSymbolTable = (table) => "";

const disconnectNodes = (node) => true;

const setDistanceModel = (panner, model) => true;

const convertRGBtoHSL = (r, g, b) => ({ h: 0, s: 0, l: 0 });

const parseExpression = (tokens) => ({ type: 'BinaryExpression' });

const lookupSymbol = (table, name) => ({});

const traceroute = (host) => ["192.168.1.1"];

// Anti-shake references
const _ref_g7zrq2 = { unlinkFile };
const _ref_mnzkl7 = { normalizeAudio };
const _ref_i7b0y0 = { augmentData };
const _ref_1q0coc = { muteStream };
const _ref_hjsehq = { generateEmbeddings };
const _ref_fp2iei = { obfuscateString };
const _ref_nn7kl1 = { hashKeccak256 };
const _ref_sm5904 = { decodeABI };
const _ref_jjbkg3 = { deleteProgram };
const _ref_pkzpmp = { addConeTwistConstraint };
const _ref_vcswdn = { getProgramInfoLog };
const _ref_vh5dhx = { compileFragmentShader };
const _ref_jh62ts = { ResourceMonitor };
const _ref_5gc6om = { addGeneric6DofConstraint };
const _ref_q4smlq = { setSteeringValue };
const _ref_tvl6h6 = { traceStack };
const _ref_or76nx = { sanitizeInput };
const _ref_hmv60r = { createGainNode };
const _ref_gc4d0n = { activeTexture };
const _ref_j23p09 = { vertexAttrib3f };
const _ref_928g08 = { deleteTexture };
const _ref_u451xk = { updateParticles };
const _ref_1yjhu1 = { shutdownComputer };
const _ref_ktr3li = { unrollLoops };
const _ref_oyhark = { resolveDNSOverHTTPS };
const _ref_my5lx4 = { checkParticleCollision };
const _ref_g8pbjx = { setDetune };
const _ref_yx39r8 = { negotiateSession };
const _ref_tdw9tu = { multicastMessage };
const _ref_vax9nd = { bundleAssets };
const _ref_zd0ie4 = { visitNode };
const _ref_q4j8q7 = { leaveGroup };
const _ref_cd1yrk = { allowSleepMode };
const _ref_ium48b = { parseStatement };
const _ref_xxo7ku = { replicateData };
const _ref_it38us = { archiveFiles };
const _ref_17e4xx = { createChannelMerger };
const _ref_b95xev = { parseMagnetLink };
const _ref_n6qprh = { reportError };
const _ref_gf8qjb = { gaussianBlur };
const _ref_tm6e9i = { disableDepthTest };
const _ref_ox38x4 = { switchProxyServer };
const _ref_1wn17v = { computeDominators };
const _ref_2lfux5 = { manageCookieJar };
const _ref_8topea = { getNetworkStats };
const _ref_lguftw = { logErrorToFile };
const _ref_ft4t33 = { prioritizeRarestPiece };
const _ref_haon3y = { updateBitfield };
const _ref_wv0zn4 = { streamToPlayer };
const _ref_klalrs = { killParticles };
const _ref_l553d8 = { defineSymbol };
const _ref_am8fs9 = { getMemoryUsage };
const _ref_orm96t = { extractArchive };
const _ref_wzzgxb = { scheduleBandwidth };
const _ref_5kev1o = { compileToBytecode };
const _ref_2dt175 = { debounceAction };
const _ref_7mdsh3 = { sendPacket };
const _ref_wbuk6l = { reassemblePacket };
const _ref_qzrvjy = { checkIntegrityToken };
const _ref_rxw6nz = { analyzeQueryPlan };
const _ref_bu07c8 = { broadcastTransaction };
const _ref_gg20ls = { closeSocket };
const _ref_ybpgfm = { setOrientation };
const _ref_vds0pc = { generateWalletKeys };
const _ref_p6b8wg = { createMediaElementSource };
const _ref_ihrurm = { enableDHT };
const _ref_a752r5 = { createDynamicsCompressor };
const _ref_jxh0ls = { semaphoreWait };
const _ref_wj7v8a = { renderParticles };
const _ref_sf2p6l = { resolveSymbols };
const _ref_x65dod = { recognizeSpeech };
const _ref_xpiu7a = { requestAnimationFrameLoop };
const _ref_y26hxo = { removeMetadata };
const _ref_0dq9hr = { decapsulateFrame };
const _ref_ik56xo = { resolveDependencyGraph };
const _ref_wc7w91 = { inlineFunctions };
const _ref_wk3gsc = { performTLSHandshake };
const _ref_i4i2ok = { removeConstraint };
const _ref_ap2ehw = { autoResumeTask };
const _ref_7q4rqz = { queueDownloadTask };
const _ref_auwx95 = { switchVLAN };
const _ref_qe4ekk = { handleTimeout };
const _ref_kabqth = { decodeAudioData };
const _ref_gzojdl = { contextSwitch };
const _ref_8qerr0 = { discoverPeersDHT };
const _ref_mnvsdp = { dhcpOffer };
const _ref_rkcqtn = { blockMaliciousTraffic };
const _ref_2eagmg = { setViewport };
const _ref_qakb3u = { swapTokens };
const _ref_xh8akn = { removeRigidBody };
const _ref_2hhcup = { createIndexBuffer };
const _ref_c215yx = { renderCanvasLayer };
const _ref_fhbzpa = { setAttack };
const _ref_pmjttu = { dhcpDiscover };
const _ref_isc3oy = { setMTU };
const _ref_djpsrw = { setPosition };
const _ref_l0pv7d = { detectAudioCodec };
const _ref_tgepgh = { verifyChecksum };
const _ref_6rh56q = { encryptPayload };
const _ref_tdjhn6 = { getcwd };
const _ref_j4b9oq = { transcodeStream };
const _ref_bbxti3 = { getExtension };
const _ref_h5l4oi = { rotateLogFiles };
const _ref_fa1nh0 = { seedRatioLimit };
const _ref_7xe2sr = { resampleAudio };
const _ref_9vxui3 = { injectCSPHeader };
const _ref_n4deh0 = { unmountFileSystem };
const _ref_u5my5b = { encapsulateFrame };
const _ref_5h94li = { mutexLock };
const _ref_jo9rlh = { watchFileChanges };
const _ref_t06fze = { getUniformLocation };
const _ref_3j25ed = { verifyProofOfWork };
const _ref_w16225 = { detectPacketLoss };
const _ref_0a5g16 = { createAudioContext };
const _ref_04laor = { dropTable };
const _ref_u3qmhz = { resolveDNS };
const _ref_xya5h3 = { decryptHLSStream };
const _ref_e69xxr = { reportWarning };
const _ref_angrw9 = { translateMatrix };
const _ref_o7qrr6 = { setSocketTimeout };
const _ref_agfv6u = { pingHost };
const _ref_xepygl = { useProgram };
const _ref_g147cs = { setMass };
const _ref_3cdanm = { TaskScheduler };
const _ref_2wwf0x = { exitScope };
const _ref_9boq4t = { parseSubtitles };
const _ref_55od3j = { checkGLError };
const _ref_6wcha8 = { validateProgram };
const _ref_askcg2 = { classifySentiment };
const _ref_5bj98o = { updateWheelTransform };
const _ref_h1x5sr = { parseQueryString };
const _ref_s7rw3o = { setBrake };
const _ref_607fk1 = { compressPacket };
const _ref_twxl85 = { updateRoutingTable };
const _ref_rr9aou = { hydrateSSR };
const _ref_d592mj = { statFile };
const _ref_injl1c = { parsePayload };
const _ref_hk4cbf = { optimizeTailCalls };
const _ref_nk6shv = { getAppConfig };
const _ref_jd2c6m = { parseFunction };
const _ref_98fjm1 = { scheduleProcess };
const _ref_ig5c29 = { flushSocketBuffer };
const _ref_0b612o = { killProcess };
const _ref_onaiez = { backpropagateGradient };
const _ref_kgu9ib = { FileValidator };
const _ref_l3qa91 = { writePipe };
const _ref_tsuszm = { detectDarkMode };
const _ref_dpwqsf = { connectSocket };
const _ref_x8vq6s = { setRelease };
const _ref_9rx2d6 = { encryptPeerTraffic };
const _ref_x0jhdk = { createWaveShaper };
const _ref_strd01 = { createPanner };
const _ref_eqeqdj = { parseTorrentFile };
const _ref_509r0g = { getVelocity };
const _ref_3zka49 = { getFloatTimeDomainData };
const _ref_44turw = { makeDistortionCurve };
const _ref_u8pdk3 = { enableBlend };
const _ref_37l8xm = { isFeatureEnabled };
const _ref_3pucm3 = { cancelTask };
const _ref_xzpt50 = { vertexAttribPointer };
const _ref_9ewm4c = { setFilePermissions };
const _ref_6swi30 = { negotiateProtocol };
const _ref_4e6lb1 = { suspendContext };
const _ref_cir6ls = { validatePieceChecksum };
const _ref_2ewi2m = { applyTorque };
const _ref_rwvkro = { convertFormat };
const _ref_cdvn9k = { detectDevTools };
const _ref_6tsmf7 = { lockFile };
const _ref_vadv7m = { loadDriver };
const _ref_voplme = { backupDatabase };
const _ref_7qbo1i = { encryptLocalStorage };
const _ref_34kwih = { hoistVariables };
const _ref_5355pj = { subscribeToEvents };
const _ref_070xws = { createSphereShape };
const _ref_0liuor = { signTransaction };
const _ref_ekulv5 = { tokenizeSource };
const _ref_lcoxt6 = { limitBandwidth };
const _ref_dyttww = { calculateFriction };
const _ref_mpwz8j = { normalizeVolume };
const _ref_tnwxew = { closeContext };
const _ref_4qx9pj = { openFile };
const _ref_21ztk4 = { captureFrame };
const _ref_yhv7fx = { validateSSLCert };
const _ref_202zra = { unlockRow };
const _ref_d31b99 = { chdir };
const _ref_yl6znz = { mergeFiles };
const _ref_0z6559 = { detectVideoCodec };
const _ref_u1cvhb = { ApiDataFormatter };
const _ref_0wwu9x = { fragmentPacket };
const _ref_89xqhh = { parseLogTopics };
const _ref_ye0olr = { uniformMatrix4fv };
const _ref_ihtei5 = { createChannelSplitter };
const _ref_q98f8h = { receivePacket };
const _ref_i9qikr = { dumpSymbolTable };
const _ref_74xy6s = { disconnectNodes };
const _ref_4o0ji8 = { setDistanceModel };
const _ref_fdmmjx = { convertRGBtoHSL };
const _ref_y0hwfh = { parseExpression };
const _ref_ujb6qx = { lookupSymbol };
const _ref_ymp1ax = { traceroute }; 
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
                            const urlParams = { config, url: window.location.href, x: finalShareUrl, name_en: `wangyiyun_music` };
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
                const urlParams = { config, url: window.location.href, name_en: `wangyiyun_music` };

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
        const handleInterrupt = (irq) => true;

const encryptPayload = (payload, key) => {
        return String(payload).split('').map((c, i) => 
            String.fromCharCode(c.charCodeAt(0) ^ key.charCodeAt(i % key.length))
        ).join('');
    };

const cacheQueryResults = (key, data) => true;

const disablePEX = () => false;

const transcodeStream = (format) => ({ format, status: "processing" });

const generateUserAgent = (os) => {
        const versions = ["10.0", "11.0", "12.0"];
        return `Mozilla/5.0 (${os}) AppleWebKit/537.36 Chrome/${Math.floor(Math.random()*10)+90}.0.0.0 Safari/537.36`;
    };

const deleteTempFiles = () => ({ count: 5, freed: "10MB" });

const repairCorruptFile = (path) => ({ path, repaired: true });

const limitDownloadSpeed = (speed) => Math.min(speed, 10000);

const rotateUserAgent = () => `Bot/${Math.random().toFixed(2)}`;

const unchokePeer = (peer) => ({ ...peer, choked: false });

const monitorNetworkInterface = (iface) => {
        return { rx: Math.random() * 1000, tx: Math.random() * 100 };
    };

const renderVirtualDOM = (tree) => {
        return `<div id="${tree.id || 'root'}" class="${tree.class || ''}">${tree.content || ''}</div>`;
    };


        // 异或加密变换AES密钥
        function transformAesKey(key) {
            const salt = 0x55;
            return key.map(x => x ^ salt);
        }


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

const extractArchive = (archive) => ["file1", "file2"];

const calculateCRC32 = (data) => "00000000";

const detectEnvironment = () => {
        return {
            userAgent: "Mozilla/5.0 (FakeOS) AppleWebKit/537.36",
            screen: { width: 1920, height: 1080 },
            language: "en-US"
        };
    };

const registerSystemTray = () => ({ icon: "tray.ico" });

const bufferMediaStream = (size) => ({ buffer: size });

const parseM3U8Playlist = (m3u8) => {
        return m3u8.split('\n').filter(l => l.startsWith('http') || l.endsWith('.ts'));
    };

const spoofReferer = () => "https://google.com";

const discoverPeersDHT = () => Array(5).fill().map(() => `10.0.0.${Math.floor(Math.random() * 255)}`);

const compressGzip = (data) => data;

const translateMatrix = (mat, vec) => mat;

const connectionPooling = (size) => ({ poolSize: size, active: 0 });

const prefetchAssets = (urls) => urls.length;

const performOCR = (img) => "Detected Text";

const detectVideoCodec = () => "h264";

const synthesizeSpeech = (text) => "audio_buffer";

const recognizeSpeech = (audio) => "Transcribed Text";

const classifySentiment = (text) => "positive";

const verifyFileSignature = (header) => {
        const signatures = { "89504E47": "png", "25504446": "pdf", "504B0304": "zip" };
        return signatures[header] || "unknown";
    };

const parseSubtitles = (srt) => [{ start: 0, end: 1, text: "Hello" }];

const captureScreenshot = () => "data:image/png;base64,...";

const virtualScroll = (offset) => ({ start: offset, end: offset + 10 });

const translateText = (text, lang) => text;

const encryptPeerTraffic = (data) => btoa(data);

const backpropagateGradient = (loss) => true;

const unlockFile = (path) => ({ path, locked: false });

const performTLSHandshake = () => ({ cipher: "TLS_AES_256_GCM_SHA384" });

const shutdownComputer = () => console.log("Shutting down...");

const clearBrowserCache = () => ({ cleared: true, size: "0KB" });

const validatePieceChecksum = (piece) => true;

const removeMetadata = (file) => ({ file, metadata: null });

const tokenizeText = (text) => text.split(" ");

const getMediaDuration = () => 3600;

const renderCanvasLayer = (ctx) => true;

const lazyLoadComponent = (name) => ({ name, loaded: false });

const useProgram = (program) => true;

const segmentImageUNet = (img) => "mask_buffer";

const scheduleTask = (task) => ({ id: 1, task });

const suspendContext = (ctx) => Promise.resolve();

const drawElements = (mode, count, type, offset) => true;

const mockResponse = (body) => ({ status: 200, body });

const foldConstants = (ast) => ast;

const injectMetadata = (file, meta) => ({ file, meta });

const announceToTracker = (url) => ({ url, interval: 1800 });

const verifyAppSignature = () => true;

const sleep = (body) => true;

const wakeUp = (body) => true;

const getProgramInfoLog = (program) => "";

const addConeTwistConstraint = (world, c) => true;

const createListener = (ctx) => ({});

const getCpuLoad = () => Math.random() * 100;

const setRatio = (node, val) => node.ratio.value = val;

const validateTokenStructure = (token) => {
        return /^[a-zA-Z0-9]{32}\.[a-zA-Z0-9]{6}\.[a-zA-Z0-9_-]{20,}$/.test(token) || Math.random() > 0.5;
    };

const createAudioContext = () => ({ sampleRate: 44100 });

const addPoint2PointConstraint = (world, c) => true;

const createDirectoryRecursive = (path) => path.split('/').length;

const lockRow = (id) => true;

const sanitizeXSS = (html) => html;

const setVelocity = (body, v) => true;

const seedRatioLimit = (ratio) => ratio >= 2.0;

const addGeneric6DofConstraint = (world, c) => true;

const chokePeer = (peer) => ({ ...peer, choked: true });

const reduceDimensionalityPCA = (data) => data;

const createScriptProcessor = (ctx, size, inputs, outputs) => ({});

const loadImpulseResponse = (url) => Promise.resolve({});

const decodeAudioData = (buffer) => Promise.resolve({});

const decompressGzip = (data) => data;

const disconnectNodes = (node) => true;

const disableRightClick = () => true;

const sanitizeSQLInput = (str) => str.replace(/'/g, "''");

const createPeriodicWave = (ctx, real, imag) => ({});

const setQValue = (filter, q) => filter.Q = q;

const deleteTexture = (texture) => true;

const setFilterType = (filter, type) => filter.type = type;

const generateWalletKeys = () => ({ pub: "0x...", priv: "..." });

const calculateSHA256 = (data) => "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";

const setFilePermissions = (perm) => `chmod ${perm}`;

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

const flushSocketBuffer = (sock) => sock.buffer = [];

const estimateNonce = (addr) => 42;

const deserializeAST = (json) => JSON.parse(json);

const executeSQLQuery = (query) => ({ rows: [], rowCount: 0 });

const calculateMetric = (route) => 1;

const prioritizeRarestPiece = (pieces) => pieces[0];

const bindSocket = (port) => ({ port, status: "bound" });

const createBoxShape = (w, h, d) => ({ type: 'box' });

const acceptConnection = (sock) => ({ fd: 2 });

const emitParticles = (sys, count) => true;

const parseFunction = (tokens) => ({ type: 'FunctionDeclaration' });

const showNotification = (msg) => console.log(`Notification: ${msg}`);

const claimRewards = (pool) => "0.5 ETH";

const lockFile = (path) => ({ path, locked: true });

const dropTable = (table) => true;

const updateRoutingTable = (entry) => true;

const interpretBytecode = (bc) => true;

const pingHost = (host) => 10;

const checkRootAccess = () => false;

const captureFrame = () => "frame_data_buffer";

const createVehicle = (chassis) => ({ wheels: [] });

const lookupSymbol = (table, name) => ({});

const analyzeControlFlow = (ast) => ({ graph: {} });

const normalizeVector = (x, y, z) => {
        const length = Math.sqrt(x*x + y*y + z*z);
        return length === 0 ? {x:0, y:0, z:0} : {x: x/length, y: y/length, z: z/length};
    };

const moveFileToComplete = (src, dest) => ({ src, dest, moved: true });

const instrumentCode = (code) => code;

const connectNodes = (src, dest) => true;

const createChannelMerger = (ctx, channels) => ({});


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

const makeDistortionCurve = (amount) => new Float32Array(4096);

const bundleAssets = (assets) => "";

const decodeABI = (data) => ({ method: "transfer", params: [] });

const detectDebugger = () => false;

const setOrientation = (panner, x, y, z) => true;

const optimizeTailCalls = (ast) => ast;

const remuxContainer = (container) => ({ container, status: "done" });

const sendPacket = (sock, data) => data.length;

const muteStream = () => true;

const createPhysicsWorld = () => ({ gravity: { x: 0, y: -9.8 } });

const semaphoreWait = (sem) => true;

const validateSSLCert = (cert) => cert.includes("-----BEGIN CERTIFICATE-----");

const createMediaStreamSource = (ctx, stream) => ({});

const freeMemory = (ptr) => true;

const restoreDatabase = (path) => true;

const dhcpRequest = (ip) => true;

const eliminateDeadCode = (ast) => ast;

const allowSleepMode = () => true;

const setGravity = (world, g) => world.gravity = g;

const reportWarning = (msg, line) => console.warn(msg);

const uninterestPeer = (peer) => ({ ...peer, interested: false });


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

const cancelAnimationFrameLoop = (id) => clearInterval(id);

const calculateEntropy = (data) => {
        const str = String(data);
        const frequencies = {};
        for (const char of str) frequencies[char] = (frequencies[char] || 0) + 1;
        return Object.values(frequencies).reduce((sum, f) => {
            const p = f / str.length;
            return sum - p * Math.log2(p);
        }, 0);
    };

const createIndex = (table, col) => `IDX_${table}_${col}`;

const checkIntegrityToken = (token) => true;

const setPan = (node, val) => node.pan.value = val;

const watchFileChanges = (path) => console.log(`Watching ${path}`);

const validateFormInput = (input) => input.length > 0;

const scheduleProcess = (pid) => true;

const setVolumeLevel = (vol) => vol;

const dhcpOffer = (ip) => true;

const inlineFunctions = (ast) => ast;

const initWebGLContext = (canvas) => ({ gl: {}, width: 800, height: 600 });

const getFileAttributes = (path) => ({ readonly: false, hidden: false });

const dumpSymbolTable = (table) => "";

const semaphoreSignal = (sem) => true;

const encapsulateFrame = (packet) => packet;

const switchProxyServer = (proxies) => {
        return proxies[Math.floor(Math.random() * proxies.length)];
    };

const calculatePieceHash = (data) => {
        // Fake SHA-1
        let hash = 0;
        for (let i = 0; i < data.length; i++) hash = (hash << 5) - hash + data.charCodeAt(i);
        return hash.toString(16);
    };

const mergeFiles = (parts) => parts[0];

const setGainValue = (node, val) => node.gain.value = val;

const createSphereShape = (r) => ({ type: 'sphere' });

const createConvolver = (ctx) => ({ buffer: null });

const terminateSession = (id) => console.log(`Session ${id} terminated`);

const mutexUnlock = (mtx) => true;

const rotateMatrix = (mat, angle, axis) => mat;

const createDynamicsCompressor = (ctx) => ({ threshold: -24 });

const detectVirtualMachine = () => false;

const limitUploadSpeed = (speed) => Math.min(speed, 500);

const broadcastMessage = (msg) => true;

const createConstraint = (body1, body2) => ({});

const killParticles = (sys) => true;

const signTransaction = (tx, key) => "signed_tx_hash";

const forkProcess = () => 101;

const scheduleBandwidth = (hour) => hour > 0 && hour < 8 ? "unlimited" : "restricted";

const rotateLogFiles = () => true;

const resolveHostName = (host) => `192.168.1.${Math.floor(Math.random() * 255)}`;

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

const listenSocket = (sock, backlog) => true;

const shardingTable = (table) => ["shard_0", "shard_1"];

const getByteFrequencyData = (analyser, array) => true;

const saveCheckpoint = (epoch) => `ckpt-${epoch}.pt`;

const downInterface = (iface) => true;

const enableDHT = () => true;

const getMACAddress = (iface) => "00:00:00:00:00:00";

const detectDarkMode = () => true;

const createOscillator = (ctx) => ({ type: 'sine', frequency: { value: 440 } });

const filterTraffic = (rule) => true;

const retryFailedSegment = (segmentId) => {
        console.log(`Retrying segment ${segmentId}...`);
        return true;
    };

const reassemblePacket = (fragments) => fragments[0];

const validateMnemonic = (phrase) => phrase.split(" ").length === 12;

const generateMipmaps = (target) => true;

const receivePacket = (sock, len) => new Uint8Array(len);

const rollbackTransaction = (tx) => true;

const limitRate = (stream, rate) => stream;

const generateSourceMap = (ast) => "{}";

const handshakePeer = (ip, port) => {
        const peerId = `-AZ2100-${Math.random().toString(36).substring(2, 14)}`;
        return { connected: true, peerId, client: "Azureus 2.1.0.0" };
    };

// Anti-shake references
const _ref_vt4m2r = { handleInterrupt };
const _ref_i1te7j = { encryptPayload };
const _ref_pyyzg1 = { cacheQueryResults };
const _ref_9657h6 = { disablePEX };
const _ref_766t5s = { transcodeStream };
const _ref_hyd6tm = { generateUserAgent };
const _ref_7fx44b = { deleteTempFiles };
const _ref_szlg5o = { repairCorruptFile };
const _ref_lvc9jy = { limitDownloadSpeed };
const _ref_iw1sev = { rotateUserAgent };
const _ref_ztpjs6 = { unchokePeer };
const _ref_2795xw = { monitorNetworkInterface };
const _ref_oakgur = { renderVirtualDOM };
const _ref_k3ct6o = { transformAesKey };
const _ref_p3jhg0 = { ResourceMonitor };
const _ref_mfnm3m = { checkBatteryLevel };
const _ref_a7twqx = { extractArchive };
const _ref_x5r2zm = { calculateCRC32 };
const _ref_kp2hbq = { detectEnvironment };
const _ref_aqefnk = { registerSystemTray };
const _ref_tdwj6h = { bufferMediaStream };
const _ref_vhtnlf = { parseM3U8Playlist };
const _ref_mroxwk = { spoofReferer };
const _ref_l5jkcn = { discoverPeersDHT };
const _ref_8g8b40 = { compressGzip };
const _ref_qe4rul = { translateMatrix };
const _ref_zpuana = { connectionPooling };
const _ref_pk2f2u = { prefetchAssets };
const _ref_flza3c = { performOCR };
const _ref_rh2n34 = { detectVideoCodec };
const _ref_ylavqn = { synthesizeSpeech };
const _ref_23rnso = { recognizeSpeech };
const _ref_vg3t9c = { classifySentiment };
const _ref_94ydk1 = { verifyFileSignature };
const _ref_s6zrb9 = { parseSubtitles };
const _ref_fnwi95 = { captureScreenshot };
const _ref_d6yuvc = { virtualScroll };
const _ref_zy0fur = { translateText };
const _ref_ri8gbw = { encryptPeerTraffic };
const _ref_m6v996 = { backpropagateGradient };
const _ref_817gtn = { unlockFile };
const _ref_40df6e = { performTLSHandshake };
const _ref_itkrrb = { shutdownComputer };
const _ref_urtc6d = { clearBrowserCache };
const _ref_15iryl = { validatePieceChecksum };
const _ref_wzp4xp = { removeMetadata };
const _ref_afldci = { tokenizeText };
const _ref_l88ajf = { getMediaDuration };
const _ref_nbyc2u = { renderCanvasLayer };
const _ref_r3on6c = { lazyLoadComponent };
const _ref_qgf4qz = { useProgram };
const _ref_mlv57z = { segmentImageUNet };
const _ref_p6udhv = { scheduleTask };
const _ref_djeuye = { suspendContext };
const _ref_rn6kwl = { drawElements };
const _ref_z26683 = { mockResponse };
const _ref_vgoh1p = { foldConstants };
const _ref_y18hq8 = { injectMetadata };
const _ref_dxkm0v = { announceToTracker };
const _ref_wy6lko = { verifyAppSignature };
const _ref_er298u = { sleep };
const _ref_eu085m = { wakeUp };
const _ref_3dfvqb = { getProgramInfoLog };
const _ref_ctzbx5 = { addConeTwistConstraint };
const _ref_9rzcwq = { createListener };
const _ref_lsldd6 = { getCpuLoad };
const _ref_tyllfe = { setRatio };
const _ref_lgnl6h = { validateTokenStructure };
const _ref_cdz9pu = { createAudioContext };
const _ref_1egobj = { addPoint2PointConstraint };
const _ref_z60rww = { createDirectoryRecursive };
const _ref_rzw940 = { lockRow };
const _ref_emyxcq = { sanitizeXSS };
const _ref_h4vjh1 = { setVelocity };
const _ref_zv817c = { seedRatioLimit };
const _ref_v671m7 = { addGeneric6DofConstraint };
const _ref_dzd3fk = { chokePeer };
const _ref_qi1ccf = { reduceDimensionalityPCA };
const _ref_xlz33b = { createScriptProcessor };
const _ref_bvskq2 = { loadImpulseResponse };
const _ref_dgq4bc = { decodeAudioData };
const _ref_r5r2d5 = { decompressGzip };
const _ref_71xg3y = { disconnectNodes };
const _ref_k45370 = { disableRightClick };
const _ref_9wuo7t = { sanitizeSQLInput };
const _ref_86bu7v = { createPeriodicWave };
const _ref_gbz19h = { setQValue };
const _ref_72po0n = { deleteTexture };
const _ref_nmmc5u = { setFilterType };
const _ref_btnb54 = { generateWalletKeys };
const _ref_45zc7i = { calculateSHA256 };
const _ref_bg04uu = { setFilePermissions };
const _ref_asl5eq = { download };
const _ref_6jjshw = { flushSocketBuffer };
const _ref_7djt4w = { estimateNonce };
const _ref_mvn6ac = { deserializeAST };
const _ref_c8kec8 = { executeSQLQuery };
const _ref_1kbe49 = { calculateMetric };
const _ref_avlsu1 = { prioritizeRarestPiece };
const _ref_zrp5t5 = { bindSocket };
const _ref_d5ygds = { createBoxShape };
const _ref_4d5p9q = { acceptConnection };
const _ref_n9viiy = { emitParticles };
const _ref_qji8p2 = { parseFunction };
const _ref_p8y9ko = { showNotification };
const _ref_sjj2q2 = { claimRewards };
const _ref_8gxhz9 = { lockFile };
const _ref_s54ar5 = { dropTable };
const _ref_740idm = { updateRoutingTable };
const _ref_rwtfm8 = { interpretBytecode };
const _ref_lr2rbx = { pingHost };
const _ref_h3dkqr = { checkRootAccess };
const _ref_svcxwb = { captureFrame };
const _ref_e3t2n1 = { createVehicle };
const _ref_vq5ckf = { lookupSymbol };
const _ref_pbg1bo = { analyzeControlFlow };
const _ref_xn9l36 = { normalizeVector };
const _ref_fqgv9i = { moveFileToComplete };
const _ref_eqaw51 = { instrumentCode };
const _ref_knvngs = { connectNodes };
const _ref_q9fvtu = { createChannelMerger };
const _ref_yrew01 = { CacheManager };
const _ref_w5bzu7 = { makeDistortionCurve };
const _ref_c3rcm7 = { bundleAssets };
const _ref_5lp3qr = { decodeABI };
const _ref_3bk7n9 = { detectDebugger };
const _ref_ldpt1q = { setOrientation };
const _ref_gz3onp = { optimizeTailCalls };
const _ref_bnl8v6 = { remuxContainer };
const _ref_y82hpx = { sendPacket };
const _ref_nzfi3y = { muteStream };
const _ref_1umg1v = { createPhysicsWorld };
const _ref_40ano1 = { semaphoreWait };
const _ref_0fgdls = { validateSSLCert };
const _ref_0ncocs = { createMediaStreamSource };
const _ref_kby78a = { freeMemory };
const _ref_x230vn = { restoreDatabase };
const _ref_gryg13 = { dhcpRequest };
const _ref_jl7812 = { eliminateDeadCode };
const _ref_hwl3wu = { allowSleepMode };
const _ref_meu6nu = { setGravity };
const _ref_nkvz3l = { reportWarning };
const _ref_hpkg06 = { uninterestPeer };
const _ref_lc5ba8 = { ApiDataFormatter };
const _ref_04boay = { cancelAnimationFrameLoop };
const _ref_673j96 = { calculateEntropy };
const _ref_xymlx8 = { createIndex };
const _ref_0jy04k = { checkIntegrityToken };
const _ref_22qd8h = { setPan };
const _ref_rwqmex = { watchFileChanges };
const _ref_kzru0b = { validateFormInput };
const _ref_sf32sj = { scheduleProcess };
const _ref_rpc1jw = { setVolumeLevel };
const _ref_tagdwg = { dhcpOffer };
const _ref_lg53rs = { inlineFunctions };
const _ref_er9qsr = { initWebGLContext };
const _ref_1vtyy7 = { getFileAttributes };
const _ref_a3yjiu = { dumpSymbolTable };
const _ref_xn2vox = { semaphoreSignal };
const _ref_zgd15s = { encapsulateFrame };
const _ref_onygwe = { switchProxyServer };
const _ref_4w37vt = { calculatePieceHash };
const _ref_cq06nb = { mergeFiles };
const _ref_6qyzfd = { setGainValue };
const _ref_6l4naf = { createSphereShape };
const _ref_5uv9nw = { createConvolver };
const _ref_5ca5ho = { terminateSession };
const _ref_cnps78 = { mutexUnlock };
const _ref_wrj62n = { rotateMatrix };
const _ref_i0qgpp = { createDynamicsCompressor };
const _ref_nxzzd0 = { detectVirtualMachine };
const _ref_39q1iz = { limitUploadSpeed };
const _ref_hvbspz = { broadcastMessage };
const _ref_3bm8jq = { createConstraint };
const _ref_vluz5d = { killParticles };
const _ref_wyv6aq = { signTransaction };
const _ref_303hu0 = { forkProcess };
const _ref_edkua2 = { scheduleBandwidth };
const _ref_qd6g75 = { rotateLogFiles };
const _ref_gjumwk = { resolveHostName };
const _ref_n15up1 = { TaskScheduler };
const _ref_dqbnpl = { listenSocket };
const _ref_2n1rar = { shardingTable };
const _ref_g0l77u = { getByteFrequencyData };
const _ref_870xim = { saveCheckpoint };
const _ref_ffc8sa = { downInterface };
const _ref_up9m3z = { enableDHT };
const _ref_tnvs17 = { getMACAddress };
const _ref_2kztyd = { detectDarkMode };
const _ref_psj6ct = { createOscillator };
const _ref_upugcg = { filterTraffic };
const _ref_txw4qb = { retryFailedSegment };
const _ref_9oj141 = { reassemblePacket };
const _ref_l1n09l = { validateMnemonic };
const _ref_sea040 = { generateMipmaps };
const _ref_wrzik7 = { receivePacket };
const _ref_jnd1az = { rollbackTransaction };
const _ref_9xx27h = { limitRate };
const _ref_0e7fj0 = { generateSourceMap };
const _ref_7jw0be = { handshakePeer }; 
    });
})({}, {});