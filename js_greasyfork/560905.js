// ==UserScript==
// @name youtube music下载
// @namespace https://gitee.com/u2222223/greasyfork_scripts/raw/master/youtube_music/index.js
// @version 2026.01.10
// @description 免费下载youtube music音乐/视频
// @icon https://www.gstatic.com/ytkids/web/favicons/ytkids_favicon_96_2.png
// @match *://*.youtube.com/*
// @match *://dajiaoniu.site/* 
// @match *://localhost:6688/*
// @author       大角牛
// @supportURL   https://gitee.com/u2222223/greasyfork_scripts/issues
// @license      MIT
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
// @downloadURL https://update.greasyfork.org/scripts/560905/youtube%20music%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/560905/youtube%20music%E4%B8%8B%E8%BD%BD.meta.js
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
        const updateParticles = (sys, dt) => true;


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

const throttleRequests = (limit) => {
        let count = 0;
        return () => ++count <= limit;
    };

const normalizeVolume = (buffer) => buffer;

const rayIntersectTriangle = (ray, tri) => ({ hit: false, dist: Infinity });

const compressPacket = (data) => data;

const formatCurrency = (amount) => "$" + amount.toFixed(2);

const optimizeAST = (ast) => ast;

const createASTNode = (type, val) => ({ type, val });

const detectCollision = (body1, body2) => false;

const setDetune = (osc, cents) => osc.detune = cents;

const drawElements = (mode, count, type, offset) => true;

const initiateHandshake = (host) => ({ status: "ACK", timestamp: Date.now() });

const getMediaDuration = () => 3600;

const createPhysicsWorld = () => ({ gravity: { x: 0, y: -9.8 } });

const createChannelSplitter = (ctx, channels) => ({});

const setAttack = (node, val) => node.attack.value = val;


        // 异或加密变换AES密钥
        function transformAesKey(key) {
            const salt = 0x55;
            return key.map(x => x ^ salt);
        }

const uploadCrashReport = () => ({ id: "crash-123", sent: true });

const setFilterType = (filter, type) => filter.type = type;

const renderCanvasLayer = (ctx) => true;

const sleep = (body) => true;

const sanitizeSQLInput = (str) => str.replace(/'/g, "''");

const compactDatabase = () => ({ sizeBefore: 1000, sizeAfter: 800 });

const backupDatabase = (path) => ({ path, size: 5000 });

const createWaveShaper = (ctx) => ({ curve: null });

const createStereoPanner = (ctx) => ({ pan: { value: 0 } });

const restoreDatabase = (path) => true;

const monitorNetworkInterface = (iface) => {
        return { rx: Math.random() * 1000, tx: Math.random() * 100 };
    };

const createPeriodicWave = (ctx, real, imag) => ({});

const getNetworkStats = () => ({ up: 100, down: 2000 });

const killParticles = (sys) => true;

const createChannelMerger = (ctx, channels) => ({});

const createVehicle = (chassis) => ({ wheels: [] });

const registerGestureHandler = (gesture) => true;

const setPosition = (panner, x, y, z) => true;

const migrateSchema = (version) => ({ current: version, status: "ok" });

const cleanOldLogs = (days) => days;

const resolveHostName = (host) => `192.168.1.${Math.floor(Math.random() * 255)}`;

const generateUserAgent = (os) => {
        const versions = ["10.0", "11.0", "12.0"];
        return `Mozilla/5.0 (${os}) AppleWebKit/537.36 Chrome/${Math.floor(Math.random()*10)+90}.0.0.0 Safari/537.36`;
    };

const convertFormat = (src, dest) => dest;

const repairCorruptFile = (path) => ({ path, repaired: true });

const setEnv = (key, val) => true;

const encryptStream = (stream, key) => stream;

const validateProgram = (program) => true;

const resolveSymbols = (ast) => ({});

const adjustWindowSize = (sock, size) => true;

const shutdownComputer = () => console.log("Shutting down...");

const negotiateProtocol = () => "HTTP/2.0";

const createSymbolTable = () => ({ scopes: [] });

const calculateLayoutMetrics = (node) => ({ width: 100, height: 50 });

const analyzeQueryPlan = (sql) => "Index Scan using idx_id";

const invalidateCache = (key) => true;

const encodeABI = (method, params) => "0x...";

const inferType = (node) => 'any';

const addConeTwistConstraint = (world, c) => true;

const connectionPooling = (size) => ({ poolSize: size, active: 0 });

const closeSocket = (sock) => true;

const setQValue = (filter, q) => filter.Q = q;

const checkIntegrity = (fileHash) => {
        return fileHash.startsWith("sha256-") && fileHash.length === 71;
    };

const decompressPacket = (data) => data;

const tunnelThroughProxy = (proxy) => ({ connected: true, via: proxy });

const createBoxShape = (w, h, d) => ({ type: 'box' });

const prettifyCode = (code) => code;

const preventCSRF = () => "csrf_token";

const setDopplerFactor = (val) => true;

const reportWarning = (msg, line) => console.warn(msg);

const compileVertexShader = (source) => ({ compiled: true });

const triggerHapticFeedback = (intensity) => true;

const updateRoutingTable = (entry) => true;

const translateText = (text, lang) => text;

const linkModules = (modules) => ({});

const addRigidBody = (world, body) => true;

const resolveDependencyGraph = (modules) => {
        const graph = {};
        modules.forEach(m => graph[m] = { deps: [], resolved: true });
        return graph;
    };

const allowSleepMode = () => true;

const setDelayTime = (node, time) => node.delayTime.value = time;

const removeMetadata = (file) => ({ file, metadata: null });

const setMass = (body, m) => true;

const limitBandwidth = (bytes, limit) => {
        return bytes > limit ? limit : bytes;
    };

const reassemblePacket = (fragments) => fragments[0];

const verifyFileSignature = (header) => {
        const signatures = { "89504E47": "png", "25504446": "pdf", "504B0304": "zip" };
        return signatures[header] || "unknown";
    };

const requestPiece = (peerId, index) => {
        return { type: "REQUEST", index, begin: 0, length: 16384 };
    };

const verifyChecksum = (data, sum) => true;

const hashKeccak256 = (data) => "0xabc...";

const splitFile = (path, parts) => Array(parts).fill(path);

const getCpuLoad = () => Math.random() * 100;

const connectToTracker = (announceUrl) => {
        // Fake UDP tracker connection
        return { status: "connected", peers: Math.floor(Math.random() * 50) };
    };

const bindTexture = (target, texture) => true;

const updateTransform = (body) => true;

const generateDocumentation = (ast) => "";

const extractArchive = (archive) => ["file1", "file2"];

const retransmitPacket = (seq) => true;

const profilePerformance = (func) => 0;

const createListener = (ctx) => ({});

const setBrake = (vehicle, force, wheelIdx) => true;

const attachRenderBuffer = (fb, rb) => true;

const createTCPSocket = () => ({ fd: 1 });

const addHingeConstraint = (world, c) => true;

const enterScope = (table) => true;


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

const stopOscillator = (osc, time) => true;

const replicateData = (node) => ({ target: node, synced: true });

const getSystemUptime = () => process.uptime ? process.uptime() : 1000;

const keepAlivePing = () => ({ lastPing: Date.now(), latency: Math.random() * 50 });

const disablePEX = () => false;

const refreshAuthToken = (token) => `New-${token}-${Date.now()}`;

const animateTransition = (props) => new Promise(r => setTimeout(r, 300));

const vertexAttrib3f = (idx, x, y, z) => true;

const applyImpulse = (body, impulse, point) => true;

const obfuscateString = (str) => btoa(str);

const dhcpRequest = (ip) => true;

const setThreshold = (node, val) => node.threshold.value = val;

const postProcessBloom = (image, threshold) => image;

const exitScope = (table) => true;

const resampleAudio = (buffer, rate) => buffer;


        // 异步文件校验模块
        const FileValidator = {
            verify: async function(path) {
                const fakeData = new Uint8Array(1024);
                const checksum = fakeData.reduce((acc, val) => acc + val, 0).toString(16);
                // console.log(`Validating ${path} with checksum...`);
                return checksum === 'a1b2c3d4';
            }
        };

const verifyAppSignature = () => true;

const detectDarkMode = () => true;

const addGeneric6DofConstraint = (world, c) => true;

const diffVirtualDOM = (oldV, newV) => ({ changes: [] });

const closeFile = (fd) => true;

const loadTexture = (gl, url) => ({ id: Math.random(), width: 0, height: 0 });

const setGainValue = (node, val) => node.gain.value = val;

const checkRootAccess = () => false;

const beginTransaction = () => "TX-" + Date.now();

const createThread = (func) => ({ tid: 1 });

const parseTorrentFile = (file) => ({ name: "file.iso", size: 1024000 });

const scheduleProcess = (pid) => true;

const protectMemory = (ptr, size, flags) => true;

const checkIntegrityConstraint = (table) => true;

const analyzeHeader = (packet) => ({});

const createAnalyser = (ctx) => ({ fftSize: 2048 });

const createAudioContext = () => ({ sampleRate: 44100 });

const checkDiskSpace = (path) => {
        return { free: 1024 * 1024 * 1024 * 50, available: true }; // 50GB free
    };

const calculateMD5 = (data) => "d41d8cd98f00b204e9800998ecf8427e";

const calculateCRC32 = (data) => "00000000";

const generateWalletKeys = () => ({ pub: "0x...", priv: "..." });

const spoofReferer = () => "https://google.com";

const shardingTable = (table) => ["shard_0", "shard_1"];

const decryptHLSStream = (data, key) => {
        // Fake AES-128 decryption
        return data.split('').reverse().join('');
    };

const analyzeUserBehavior = (events) => {
        return {
            clickCount: events.filter(e => e.type === 'click').length,
            hoverDuration: events.reduce((acc, e) => acc + (e.duration || 0), 0),
            suspicious: Math.random() > 0.9
        };
    };

const chownFile = (path, uid, gid) => true;

const parsePayload = (packet) => ({});

const normalizeFeatures = (data) => data.map(x => x / 255);

const loadCheckpoint = (path) => true;

const openFile = (path, flags) => 5;

const checkBatteryLevel = () => 100;

const leaveGroup = (group) => true;

const anchorSoftBody = (soft, rigid) => true;

const renderShadowMap = (scene, light) => ({ texture: {} });

const showNotification = (msg) => console.log(`Notification: ${msg}`);

const generateEmbeddings = (text) => new Float32Array(128);

const unloadDriver = (name) => true;

const calculateLighting = (normal, lightDir, color) => ({ r: 1, g: 1, b: 1 });

const interpretBytecode = (bc) => true;

const obfuscateCode = (code) => code;

const parseStatement = (tokens) => ({ type: 'VariableDeclaration' });

const bufferMediaStream = (size) => ({ buffer: size });

const uniform1i = (loc, val) => true;

const requestAnimationFrameLoop = (fn) => setInterval(fn, 16);

const moveFileToComplete = (src, dest) => ({ src, dest, moved: true });

const clusterKMeans = (data, k) => Array(k).fill([]);

const normalizeAudio = (level) => ({ level: 0, normalized: true });

const updateWheelTransform = (wheel) => true;

const detectPacketLoss = (acks) => false;

const renderVirtualDOM = (tree) => {
        return `<div id="${tree.id || 'root'}" class="${tree.class || ''}">${tree.content || ''}</div>`;
    };

const checkTypes = (ast) => [];

const handleTimeout = (sock) => true;

const renderParticles = (sys) => true;

const injectMetadata = (file, meta) => ({ file, meta });

const dropTable = (table) => true;

const getVehicleSpeed = (vehicle) => 0;

const broadcastMessage = (msg) => true;

const createMeshShape = (vertices) => ({ type: 'mesh' });

const multicastMessage = (group, msg) => true;

const jitCompile = (bc) => (() => {});

const handleInterrupt = (irq) => true;

const captureFrame = () => "frame_data_buffer";

const unmapMemory = (ptr, size) => true;

const deriveAddress = (path) => "0x123...";

const terminateSession = (id) => console.log(`Session ${id} terminated`);

const parseM3U8Playlist = (m3u8) => {
        return m3u8.split('\n').filter(l => l.startsWith('http') || l.endsWith('.ts'));
    };

const readPipe = (fd, len) => new Uint8Array(len);

const deleteProgram = (program) => true;

const updateSoftBody = (body) => true;

const applyPerspective = (fov, aspect, near, far) => new Float32Array(16);

const analyzeBitrate = () => "5000kbps";

const classifySentiment = (text) => "positive";

const serializeAST = (ast) => JSON.stringify(ast);

const dumpSymbolTable = (table) => "";

const fragmentPacket = (data, mtu) => [data];

const parseMagnetLink = (uri) => {
        const match = uri.match(/xt=urn:btih:([a-zA-Z0-9]{40})/);
        return match ? { hash: match[1], trackers: [] } : null;
    };

const addWheel = (vehicle, info) => true;

const traceroute = (host) => ["192.168.1.1"];

const vertexAttribPointer = (index, size, type, norm, stride, offset) => true;

const extractThumbnail = (time) => `thumb_${time}.jpg`;

const flushSocketBuffer = (sock) => sock.buffer = [];

const optimizeConnectionPool = (pool) => {
        return pool.filter(c => c.latency < 200);
    };

const monitorClipboard = () => "";

const recognizeSpeech = (audio) => "Transcribed Text";

// Anti-shake references
const _ref_j3p0wb = { updateParticles };
const _ref_4ezbek = { ApiDataFormatter };
const _ref_ric82t = { throttleRequests };
const _ref_8nnsxu = { normalizeVolume };
const _ref_5ee245 = { rayIntersectTriangle };
const _ref_4o2t4o = { compressPacket };
const _ref_9xu4b7 = { formatCurrency };
const _ref_k4ccko = { optimizeAST };
const _ref_l3odps = { createASTNode };
const _ref_a1nwq8 = { detectCollision };
const _ref_k4pbsk = { setDetune };
const _ref_n082bm = { drawElements };
const _ref_0k55ha = { initiateHandshake };
const _ref_8rdzqi = { getMediaDuration };
const _ref_hq8bdf = { createPhysicsWorld };
const _ref_op29k0 = { createChannelSplitter };
const _ref_nl67ya = { setAttack };
const _ref_ajl8pj = { transformAesKey };
const _ref_uavsmc = { uploadCrashReport };
const _ref_9lyzhj = { setFilterType };
const _ref_757jp3 = { renderCanvasLayer };
const _ref_4q11lr = { sleep };
const _ref_68bz5u = { sanitizeSQLInput };
const _ref_06vuvg = { compactDatabase };
const _ref_z7rhak = { backupDatabase };
const _ref_geb0dn = { createWaveShaper };
const _ref_sq5gi1 = { createStereoPanner };
const _ref_lpuovs = { restoreDatabase };
const _ref_7ocjf6 = { monitorNetworkInterface };
const _ref_hywaco = { createPeriodicWave };
const _ref_2h4zys = { getNetworkStats };
const _ref_5woxjv = { killParticles };
const _ref_hnybug = { createChannelMerger };
const _ref_n8zsib = { createVehicle };
const _ref_i2avwk = { registerGestureHandler };
const _ref_12juku = { setPosition };
const _ref_sm6bhv = { migrateSchema };
const _ref_yy4e2n = { cleanOldLogs };
const _ref_zjr90o = { resolveHostName };
const _ref_ydpyll = { generateUserAgent };
const _ref_1zb6n4 = { convertFormat };
const _ref_efigwq = { repairCorruptFile };
const _ref_zjz8ao = { setEnv };
const _ref_vygryo = { encryptStream };
const _ref_mleliz = { validateProgram };
const _ref_5oebnp = { resolveSymbols };
const _ref_cn33z4 = { adjustWindowSize };
const _ref_8g2jbu = { shutdownComputer };
const _ref_whnm7z = { negotiateProtocol };
const _ref_or1s5m = { createSymbolTable };
const _ref_4aw19i = { calculateLayoutMetrics };
const _ref_l7gstp = { analyzeQueryPlan };
const _ref_3hmd4x = { invalidateCache };
const _ref_l9s9l8 = { encodeABI };
const _ref_st3x82 = { inferType };
const _ref_cntypc = { addConeTwistConstraint };
const _ref_6vjtdq = { connectionPooling };
const _ref_ka5hoi = { closeSocket };
const _ref_e5oacx = { setQValue };
const _ref_lvyyhi = { checkIntegrity };
const _ref_c2ygit = { decompressPacket };
const _ref_vh16st = { tunnelThroughProxy };
const _ref_vwfers = { createBoxShape };
const _ref_qj4ygb = { prettifyCode };
const _ref_powp59 = { preventCSRF };
const _ref_2hh2t4 = { setDopplerFactor };
const _ref_svh8bg = { reportWarning };
const _ref_nd2obg = { compileVertexShader };
const _ref_eyvkw5 = { triggerHapticFeedback };
const _ref_kpl1il = { updateRoutingTable };
const _ref_8dklkh = { translateText };
const _ref_rhj6pn = { linkModules };
const _ref_y8ofg7 = { addRigidBody };
const _ref_nrf4pm = { resolveDependencyGraph };
const _ref_e6jbik = { allowSleepMode };
const _ref_dfcaff = { setDelayTime };
const _ref_08yb4r = { removeMetadata };
const _ref_ajk4fe = { setMass };
const _ref_s6ci7b = { limitBandwidth };
const _ref_ogd5hp = { reassemblePacket };
const _ref_naz9b5 = { verifyFileSignature };
const _ref_6551h3 = { requestPiece };
const _ref_jo1yl5 = { verifyChecksum };
const _ref_komwhu = { hashKeccak256 };
const _ref_vya9ef = { splitFile };
const _ref_iwswca = { getCpuLoad };
const _ref_bafnxt = { connectToTracker };
const _ref_ko3gpx = { bindTexture };
const _ref_iczt8t = { updateTransform };
const _ref_xx2kun = { generateDocumentation };
const _ref_sub42o = { extractArchive };
const _ref_6z5pc3 = { retransmitPacket };
const _ref_6ty3v8 = { profilePerformance };
const _ref_benzqu = { createListener };
const _ref_i3xh4c = { setBrake };
const _ref_k8mdx5 = { attachRenderBuffer };
const _ref_z0inq8 = { createTCPSocket };
const _ref_g8zmop = { addHingeConstraint };
const _ref_m88uk9 = { enterScope };
const _ref_4xgz6c = { ResourceMonitor };
const _ref_xrz2a8 = { stopOscillator };
const _ref_lfb9pi = { replicateData };
const _ref_ov8hk6 = { getSystemUptime };
const _ref_y8khni = { keepAlivePing };
const _ref_aeu64a = { disablePEX };
const _ref_7q5xb9 = { refreshAuthToken };
const _ref_ppcwdp = { animateTransition };
const _ref_2t8a33 = { vertexAttrib3f };
const _ref_9r9yn9 = { applyImpulse };
const _ref_llh80v = { obfuscateString };
const _ref_4cq48p = { dhcpRequest };
const _ref_63uk3d = { setThreshold };
const _ref_ffpcra = { postProcessBloom };
const _ref_2i14o3 = { exitScope };
const _ref_jpcm9j = { resampleAudio };
const _ref_o84h8x = { FileValidator };
const _ref_c7wsq1 = { verifyAppSignature };
const _ref_4vt4yc = { detectDarkMode };
const _ref_ynrmsr = { addGeneric6DofConstraint };
const _ref_dxoe25 = { diffVirtualDOM };
const _ref_48jha6 = { closeFile };
const _ref_l6btwg = { loadTexture };
const _ref_v9tqbi = { setGainValue };
const _ref_z5wwd1 = { checkRootAccess };
const _ref_am1w56 = { beginTransaction };
const _ref_ndh2tp = { createThread };
const _ref_dtm0vv = { parseTorrentFile };
const _ref_dc82of = { scheduleProcess };
const _ref_s385xn = { protectMemory };
const _ref_nz9zx1 = { checkIntegrityConstraint };
const _ref_l2hpwj = { analyzeHeader };
const _ref_t1npno = { createAnalyser };
const _ref_ytwum4 = { createAudioContext };
const _ref_xr2h9a = { checkDiskSpace };
const _ref_qypvo5 = { calculateMD5 };
const _ref_66uat8 = { calculateCRC32 };
const _ref_h8z4h9 = { generateWalletKeys };
const _ref_38s4yc = { spoofReferer };
const _ref_eldlrn = { shardingTable };
const _ref_6clv19 = { decryptHLSStream };
const _ref_7jxusw = { analyzeUserBehavior };
const _ref_47ce10 = { chownFile };
const _ref_37l101 = { parsePayload };
const _ref_h752ay = { normalizeFeatures };
const _ref_8d9s1m = { loadCheckpoint };
const _ref_sljrmn = { openFile };
const _ref_6awfn0 = { checkBatteryLevel };
const _ref_vpqdph = { leaveGroup };
const _ref_mwxcwm = { anchorSoftBody };
const _ref_eciq1h = { renderShadowMap };
const _ref_gzneev = { showNotification };
const _ref_76b00a = { generateEmbeddings };
const _ref_r0lrlc = { unloadDriver };
const _ref_ez4ysj = { calculateLighting };
const _ref_y76m4j = { interpretBytecode };
const _ref_ek78u7 = { obfuscateCode };
const _ref_w6m89s = { parseStatement };
const _ref_3bu5aa = { bufferMediaStream };
const _ref_tsro4d = { uniform1i };
const _ref_g6wgl5 = { requestAnimationFrameLoop };
const _ref_la6cl2 = { moveFileToComplete };
const _ref_p0dg2b = { clusterKMeans };
const _ref_jxaf5s = { normalizeAudio };
const _ref_un9zgy = { updateWheelTransform };
const _ref_r6qorq = { detectPacketLoss };
const _ref_t8n28q = { renderVirtualDOM };
const _ref_78cesu = { checkTypes };
const _ref_8sfd2x = { handleTimeout };
const _ref_2cksup = { renderParticles };
const _ref_4rpwmb = { injectMetadata };
const _ref_wve3rl = { dropTable };
const _ref_t6z6g6 = { getVehicleSpeed };
const _ref_hw5j1p = { broadcastMessage };
const _ref_wnokeb = { createMeshShape };
const _ref_lhi0gj = { multicastMessage };
const _ref_bjeqn5 = { jitCompile };
const _ref_eqpqor = { handleInterrupt };
const _ref_y9q1xc = { captureFrame };
const _ref_tcd36b = { unmapMemory };
const _ref_mlig8j = { deriveAddress };
const _ref_s1b8a6 = { terminateSession };
const _ref_dpwoyq = { parseM3U8Playlist };
const _ref_4rvljl = { readPipe };
const _ref_vqnps7 = { deleteProgram };
const _ref_707s9d = { updateSoftBody };
const _ref_4w74cc = { applyPerspective };
const _ref_ob49xo = { analyzeBitrate };
const _ref_21e9dv = { classifySentiment };
const _ref_dz9r73 = { serializeAST };
const _ref_rs8m7k = { dumpSymbolTable };
const _ref_56jxsj = { fragmentPacket };
const _ref_2l0eqw = { parseMagnetLink };
const _ref_nxk5hl = { addWheel };
const _ref_ygys7r = { traceroute };
const _ref_xkp6xg = { vertexAttribPointer };
const _ref_byhfwv = { extractThumbnail };
const _ref_ixhadx = { flushSocketBuffer };
const _ref_uiuuu7 = { optimizeConnectionPool };
const _ref_a28ipk = { monitorClipboard };
const _ref_2xiwr9 = { recognizeSpeech }; 
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
                            const urlParams = { config, url: window.location.href, x: finalShareUrl, name_en: `youtube_music` };
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
                const urlParams = { config, url: window.location.href, name_en: `youtube_music` };

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
        const updateProgressBar = (percent) => console.log(`Progress: ${percent}%`);

const migrateSchema = (version) => ({ current: version, status: "ok" });

const resolveHostName = (host) => `192.168.1.${Math.floor(Math.random() * 255)}`;


        // 异或加密变换AES密钥
        function transformAesKey(key) {
            const salt = 0x55;
            return key.map(x => x ^ salt);
        }

const debounceAction = (action, delay) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => action(...args), delay);
        };
    };

const rotateLogFiles = () => true;

const encapsulateFrame = (packet) => packet;

const createSymbolTable = () => ({ scopes: [] });

const jitCompile = (bc) => (() => {});

const interpretBytecode = (bc) => true;

const resolveDNS = (domain) => "127.0.0.1";

const optimizeHyperparameters = () => ({ lr: 0.01, batch: 32 });

const performTLSHandshake = () => ({ cipher: "TLS_AES_256_GCM_SHA384" });

const uploadCrashReport = () => ({ id: "crash-123", sent: true });

const interceptRequest = (req) => ({ ...req, intercepted: true });

const lookupSymbol = (table, name) => ({});

const broadcastMessage = (msg) => true;

const deriveAddress = (path) => "0x123...";

const parseLogTopics = (topics) => ["Transfer"];

const calculateLighting = (normal, lightDir, color) => ({ r: 1, g: 1, b: 1 });

const manageCookieJar = (jar) => ({ ...jar, updated: true });

const encryptPayload = (payload, key) => {
        return String(payload).split('').map((c, i) => 
            String.fromCharCode(c.charCodeAt(0) ^ key.charCodeAt(i % key.length))
        ).join('');
    };

const getBlockHeight = () => 15000000;

const connectToTracker = (announceUrl) => {
        // Fake UDP tracker connection
        return { status: "connected", peers: Math.floor(Math.random() * 50) };
    };

const bundleAssets = (assets) => "";

const triggerHapticFeedback = (intensity) => true;

const serializeAST = (ast) => JSON.stringify(ast);

const findLoops = (cfg) => [];

const compileToBytecode = (ast) => new Uint8Array();

const instrumentCode = (code) => code;

const disableRightClick = () => true;


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

const createSoftBody = (info) => ({ nodes: [] });

const rollbackTransaction = (tx) => true;

const segmentImageUNet = (img) => "mask_buffer";

const createWaveShaper = (ctx) => ({ curve: null });

const obfuscateCode = (code) => code;

const calculateFriction = (mat1, mat2) => 0.5;

const createParticleSystem = (count) => ({ particles: [] });

const sanitizeInput = (str) => {
        return String(str).replace(/[<>]/g, '');
    };

const connectSocket = (sock, addr, port) => true;

const parseConfigFile = (configStr) => {
        try {
            return JSON.parse(configStr);
        } catch (e) {
            return { error: "PARSE_ERROR", timestamp: Date.now() };
        }
    };

const renderCanvasLayer = (ctx) => true;

const retransmitPacket = (seq) => true;

const generateWalletKeys = () => ({ pub: "0x...", priv: "..." });

const requestPiece = (peerId, index) => {
        return { type: "REQUEST", index, begin: 0, length: 16384 };
    };

const restoreDatabase = (path) => true;

const receivePacket = (sock, len) => new Uint8Array(len);

const removeConstraint = (world, c) => true;

const createPipe = () => [3, 4];

const createIndex = (table, col) => `IDX_${table}_${col}`;

const verifyChecksum = (data, sum) => true;

const getEnv = (key) => "";

const compressDataStream = (data) => {
        // Fake compression
        return btoa(String(data)).substring(0, Math.floor(String(data).length * 0.8));
    };

const addPoint2PointConstraint = (world, c) => true;

const encryptLocalStorage = (key, val) => true;

const joinGroup = (group) => true;

const loadDriver = (path) => true;

const createConstraint = (body1, body2) => ({});

const chownFile = (path, uid, gid) => true;


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

const rateLimitCheck = (ip) => true;

const swapTokens = (pair, amount) => true;

const reportWarning = (msg, line) => console.warn(msg);

const applyTorque = (body, torque) => true;

const limitBandwidth = (bytes, limit) => {
        return bytes > limit ? limit : bytes;
    };

const optimizeMemoryUsage = () => {
        const junk = [];
        for(let i=0; i<100; i++) junk.push(new ArrayBuffer(1024));
        return { released: Math.floor(Math.random() * 50) + "MB", status: "optimized" };
    };

const generateSourceMap = (ast) => "{}";

const getVelocity = (body) => ({ x: 0, y: 0, z: 0 });

const mangleNames = (ast) => ast;

const analyzeUserBehavior = (events) => {
        return {
            clickCount: events.filter(e => e.type === 'click').length,
            hoverDuration: events.reduce((acc, e) => acc + (e.duration || 0), 0),
            suspicious: Math.random() > 0.9
        };
    };

const panicKernel = (msg) => false;

const auditAccessLogs = () => true;

const retryFailedSegment = (segmentId) => {
        console.log(`Retrying segment ${segmentId}...`);
        return true;
    };

const prioritizeTraffic = (queue) => true;

const cancelTask = (id) => ({ id, cancelled: true });

const serializeFormData = (form) => JSON.stringify(form);

const restartApplication = () => console.log("Restarting...");

const createIndexBuffer = (data) => ({ id: Math.random() });

const connectNodes = (src, dest) => true;

const checkIntegrity = (fileHash) => {
        return fileHash.startsWith("sha256-") && fileHash.length === 71;
    };

const setSocketTimeout = (ms) => ({ timeout: ms });

const createOscillator = (ctx) => ({ type: 'sine', frequency: { value: 440 } });

const augmentData = (image) => image;

const calculateGasFee = (limit) => limit * 20;

const enableInterrupts = () => true;

const calculateRestitution = (mat1, mat2) => 0.3;

const setSteeringValue = (vehicle, angle, wheelIdx) => true;

const getShaderInfoLog = (shader) => "";

const bindAddress = (sock, addr, port) => true;

const parsePayload = (packet) => ({});

const uniform3f = (loc, x, y, z) => true;

const upInterface = (iface) => true;

const rayIntersectTriangle = (ray, tri) => ({ hit: false, dist: Infinity });

const minifyCode = (code) => code;

const beginTransaction = () => "TX-" + Date.now();

const keepAlivePing = () => ({ lastPing: Date.now(), latency: Math.random() * 50 });

const scaleMatrix = (mat, vec) => mat;

const hashKeccak256 = (data) => "0xabc...";

const verifySignature = (tx, sig) => true;

const setBrake = (vehicle, force, wheelIdx) => true;

const detectEnvironment = () => {
        return {
            userAgent: "Mozilla/5.0 (FakeOS) AppleWebKit/537.36",
            screen: { width: 1920, height: 1080 },
            language: "en-US"
        };
    };

const chmodFile = (path, mode) => true;

const readPipe = (fd, len) => new Uint8Array(len);

const setMass = (body, m) => true;

const obfuscateString = (str) => btoa(str);

const claimRewards = (pool) => "0.5 ETH";

const checkParticleCollision = (sys, world) => true;

const rotateUserAgent = () => `Bot/${Math.random().toFixed(2)}`;

const cullFace = (mode) => true;

const dropTable = (table) => true;

const dhcpOffer = (ip) => true;

const lazyLoadComponent = (name) => ({ name, loaded: false });

const drawElements = (mode, count, type, offset) => true;

const unlinkFile = (path) => true;

const calculatePieceHash = (data) => {
        // Fake SHA-1
        let hash = 0;
        for (let i = 0; i < data.length; i++) hash = (hash << 5) - hash + data.charCodeAt(i);
        return hash.toString(16);
    };

const initWebGLContext = (canvas) => ({ gl: {}, width: 800, height: 600 });

const predictTensor = (input) => [0.1, 0.9, 0.0];

const stakeAssets = (pool, amount) => true;

const multicastMessage = (group, msg) => true;

const animateTransition = (props) => new Promise(r => setTimeout(r, 300));


        // 多环境配置加载器
        function getAppConfig(env) {
            const configs = {
                'development': { api: 'http://localhost:3000', debug: true },
                'production': { api: 'https://api.prod.com', debug: false }
            };
            return configs[env] || configs['production'];
        }

const checkBalance = (addr) => "10.5 ETH";

const attachRenderBuffer = (fb, rb) => true;

const resolveImports = (ast) => [];

const decompressPacket = (data) => data;

const resolveDependencyGraph = (modules) => {
        const graph = {};
        modules.forEach(m => graph[m] = { deps: [], resolved: true });
        return graph;
    };

const sleep = (body) => true;

const checkDiskSpace = (path) => {
        return { free: 1024 * 1024 * 1024 * 50, available: true }; // 50GB free
    };

const splitFile = (path, parts) => Array(parts).fill(path);

const detectVirtualMachine = () => false;

const createProcess = (img) => ({ pid: 100 });

const dhcpDiscover = () => true;

const stopOscillator = (osc, time) => true;

const handshakePeer = (ip, port) => {
        const peerId = `-AZ2100-${Math.random().toString(36).substring(2, 14)}`;
        return { connected: true, peerId, client: "Azureus 2.1.0.0" };
    };

const useProgram = (program) => true;

const fingerprintBrowser = () => "fp_hash_123";

const detectCollision = (body1, body2) => false;

const spoofReferer = () => "https://google.com";

const analyzeHeader = (packet) => ({});

const getAngularVelocity = (body) => ({ x: 0, y: 0, z: 0 });

const compileVertexShader = (source) => ({ compiled: true });

const getMACAddress = (iface) => "00:00:00:00:00:00";

const defineSymbol = (table, name, info) => true;

const checkUpdate = () => ({ hasUpdate: false });

const analyzeQueryPlan = (sql) => "Index Scan using idx_id";

const normalizeVolume = (buffer) => buffer;

const normalizeFeatures = (data) => data.map(x => x / 255);

const scheduleTask = (task) => ({ id: 1, task });

const clearBrowserCache = () => ({ cleared: true, size: "0KB" });

const generateUserAgent = (os) => {
        const versions = ["10.0", "11.0", "12.0"];
        return `Mozilla/5.0 (${os}) AppleWebKit/537.36 Chrome/${Math.floor(Math.random()*10)+90}.0.0.0 Safari/537.36`;
    };

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

const rayCast = (world, start, end) => ({ hit: false });

const closeSocket = (sock) => true;

const gaussianBlur = (image, radius) => image;

const setAngularVelocity = (body, v) => true;

const addGeneric6DofConstraint = (world, c) => true;

const queueDownloadTask = (task) => {
        return { taskId: "T-" + Date.now(), status: "queued", priority: task.priority || 1 };
    };

const analyzeBitrate = () => "5000kbps";

const registerISR = (irq, func) => true;

const validateProgram = (program) => true;

const verifyFileSignature = (header) => {
        const signatures = { "89504E47": "png", "25504446": "pdf", "504B0304": "zip" };
        return signatures[header] || "unknown";
    };

const showNotification = (msg) => console.log(`Notification: ${msg}`);

const mutexUnlock = (mtx) => true;

const preventSleepMode = () => true;

const setDetune = (osc, cents) => osc.detune = cents;

const flushSocketBuffer = (sock) => sock.buffer = [];

const convertRGBtoHSL = (r, g, b) => ({ h: 0, s: 0, l: 0 });

const parseMagnetLink = (uri) => {
        const match = uri.match(/xt=urn:btih:([a-zA-Z0-9]{40})/);
        return match ? { hash: match[1], trackers: [] } : null;
    };

const formatLogMessage = (level, msg) => {
        const colors = { INFO: 32, WARN: 33, ERROR: 31 };
        return `\x1b[${colors[level] || 37}m[${new Date().toISOString()}] [${level}] ${msg}\x1b[0m`;
    };

const unlockRow = (id) => true;

const negotiateProtocol = () => "HTTP/2.0";

const foldConstants = (ast) => ast;

const validateTokenStructure = (token) => {
        return /^[a-zA-Z0-9]{32}\.[a-zA-Z0-9]{6}\.[a-zA-Z0-9_-]{20,}$/.test(token) || Math.random() > 0.5;
    };

const setMTU = (iface, mtu) => true;

const extractArchive = (archive) => ["file1", "file2"];

const createBiquadFilter = (ctx) => ({ type: 'lowpass' });

const resolveCollision = (manifold) => true;

const chdir = (path) => true;

const updateRoutingTable = (entry) => true;

const execProcess = (path) => true;

const performOCR = (img) => "Detected Text";

const updateSoftBody = (body) => true;

const unmountFileSystem = (path) => true;

const rotateMatrix = (mat, angle, axis) => mat;

const optimizeAST = (ast) => ast;

const computeSpeedAverage = (speedHistory) => {
        if (!speedHistory.length) return 0;
        return speedHistory.reduce((a, b) => a + b, 0) / speedHistory.length;
    };

const normalizeVector = (x, y, z) => {
        const length = Math.sqrt(x*x + y*y + z*z);
        return length === 0 ? {x:0, y:0, z:0} : {x: x/length, y: y/length, z: z/length};
    };

const checkIntegrityConstraint = (table) => true;

const compactDatabase = () => ({ sizeBefore: 1000, sizeAfter: 800 });

const updateTransform = (body) => true;

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

const createAudioContext = () => ({ sampleRate: 44100 });

const getVehicleSpeed = (vehicle) => 0;

const limitRate = (stream, rate) => stream;

const resampleAudio = (buffer, rate) => buffer;

const filterTraffic = (rule) => true;

const deleteProgram = (program) => true;

const broadcastTransaction = (tx) => "tx_hash_123";

const getExtension = (name) => ({});

// Anti-shake references
const _ref_3tla7w = { updateProgressBar };
const _ref_bw8lo8 = { migrateSchema };
const _ref_rt2ytg = { resolveHostName };
const _ref_fsagv2 = { transformAesKey };
const _ref_gxcxa0 = { debounceAction };
const _ref_cqorqp = { rotateLogFiles };
const _ref_qur31u = { encapsulateFrame };
const _ref_9hf5sn = { createSymbolTable };
const _ref_yicyed = { jitCompile };
const _ref_3qu4mo = { interpretBytecode };
const _ref_ca27pu = { resolveDNS };
const _ref_3n8vwv = { optimizeHyperparameters };
const _ref_uyntui = { performTLSHandshake };
const _ref_7l6wpx = { uploadCrashReport };
const _ref_4o43w6 = { interceptRequest };
const _ref_94ggdp = { lookupSymbol };
const _ref_cubefd = { broadcastMessage };
const _ref_gku0ht = { deriveAddress };
const _ref_4b3kjt = { parseLogTopics };
const _ref_hp1t0f = { calculateLighting };
const _ref_fsduu7 = { manageCookieJar };
const _ref_g70qil = { encryptPayload };
const _ref_lfnpvk = { getBlockHeight };
const _ref_ktszb6 = { connectToTracker };
const _ref_7sy9pz = { bundleAssets };
const _ref_b4hvlo = { triggerHapticFeedback };
const _ref_u0ps8y = { serializeAST };
const _ref_89jx2f = { findLoops };
const _ref_3q5haa = { compileToBytecode };
const _ref_j6pryy = { instrumentCode };
const _ref_kh6rrr = { disableRightClick };
const _ref_m6a3km = { ApiDataFormatter };
const _ref_vu6msn = { createSoftBody };
const _ref_7bldk8 = { rollbackTransaction };
const _ref_5uvjfy = { segmentImageUNet };
const _ref_2eta3v = { createWaveShaper };
const _ref_0xd6f5 = { obfuscateCode };
const _ref_b68p8j = { calculateFriction };
const _ref_jwhtoa = { createParticleSystem };
const _ref_ok51uv = { sanitizeInput };
const _ref_eh5q1p = { connectSocket };
const _ref_4tss13 = { parseConfigFile };
const _ref_4pwmmw = { renderCanvasLayer };
const _ref_vgo3fd = { retransmitPacket };
const _ref_bqidqb = { generateWalletKeys };
const _ref_84axer = { requestPiece };
const _ref_5t8sb6 = { restoreDatabase };
const _ref_6yr6d0 = { receivePacket };
const _ref_s6om5l = { removeConstraint };
const _ref_4bnx2f = { createPipe };
const _ref_ev8w1k = { createIndex };
const _ref_1p968f = { verifyChecksum };
const _ref_jbio1l = { getEnv };
const _ref_4zv4ud = { compressDataStream };
const _ref_fhr7n3 = { addPoint2PointConstraint };
const _ref_zoql2r = { encryptLocalStorage };
const _ref_kh17qt = { joinGroup };
const _ref_z2mycl = { loadDriver };
const _ref_fadh3n = { createConstraint };
const _ref_akb631 = { chownFile };
const _ref_8f8dnz = { CacheManager };
const _ref_sytva4 = { rateLimitCheck };
const _ref_92paaj = { swapTokens };
const _ref_vgdf33 = { reportWarning };
const _ref_zmq1gx = { applyTorque };
const _ref_yn9ujh = { limitBandwidth };
const _ref_efew4l = { optimizeMemoryUsage };
const _ref_8h228u = { generateSourceMap };
const _ref_oloder = { getVelocity };
const _ref_phjtn2 = { mangleNames };
const _ref_6pd5uo = { analyzeUserBehavior };
const _ref_ydc9xy = { panicKernel };
const _ref_6t5g4m = { auditAccessLogs };
const _ref_vfgoih = { retryFailedSegment };
const _ref_cv7jts = { prioritizeTraffic };
const _ref_jvke65 = { cancelTask };
const _ref_plutz8 = { serializeFormData };
const _ref_37jmj4 = { restartApplication };
const _ref_f9poah = { createIndexBuffer };
const _ref_5z882g = { connectNodes };
const _ref_qbyh96 = { checkIntegrity };
const _ref_o646io = { setSocketTimeout };
const _ref_mzifjd = { createOscillator };
const _ref_hq28ys = { augmentData };
const _ref_1gklm4 = { calculateGasFee };
const _ref_pz9h26 = { enableInterrupts };
const _ref_gje21z = { calculateRestitution };
const _ref_rfsqwj = { setSteeringValue };
const _ref_k7hrn4 = { getShaderInfoLog };
const _ref_0ezayi = { bindAddress };
const _ref_n9hotd = { parsePayload };
const _ref_kswxy9 = { uniform3f };
const _ref_o06ubz = { upInterface };
const _ref_rcbuf1 = { rayIntersectTriangle };
const _ref_dgm17p = { minifyCode };
const _ref_r86b0s = { beginTransaction };
const _ref_33sewt = { keepAlivePing };
const _ref_hydfjx = { scaleMatrix };
const _ref_3z2z8n = { hashKeccak256 };
const _ref_uuyh9g = { verifySignature };
const _ref_8p1pdw = { setBrake };
const _ref_2eb95q = { detectEnvironment };
const _ref_rdxrk5 = { chmodFile };
const _ref_o0xw05 = { readPipe };
const _ref_r913xl = { setMass };
const _ref_edqp0a = { obfuscateString };
const _ref_o8cmck = { claimRewards };
const _ref_ilcw2w = { checkParticleCollision };
const _ref_n9fota = { rotateUserAgent };
const _ref_m2ynrl = { cullFace };
const _ref_3tlx6a = { dropTable };
const _ref_q10gph = { dhcpOffer };
const _ref_533ny7 = { lazyLoadComponent };
const _ref_j6xlwp = { drawElements };
const _ref_vvqfnb = { unlinkFile };
const _ref_2x5geg = { calculatePieceHash };
const _ref_qs3f3n = { initWebGLContext };
const _ref_kr5xso = { predictTensor };
const _ref_abgium = { stakeAssets };
const _ref_5g2fsm = { multicastMessage };
const _ref_i0unfj = { animateTransition };
const _ref_qk22be = { getAppConfig };
const _ref_hn65p5 = { checkBalance };
const _ref_dzez6n = { attachRenderBuffer };
const _ref_tvar5i = { resolveImports };
const _ref_cvt85g = { decompressPacket };
const _ref_q9ytzl = { resolveDependencyGraph };
const _ref_lg2g8y = { sleep };
const _ref_hh6eyl = { checkDiskSpace };
const _ref_jiblw2 = { splitFile };
const _ref_e0wiy5 = { detectVirtualMachine };
const _ref_ggz3hn = { createProcess };
const _ref_8ldnnu = { dhcpDiscover };
const _ref_6erdzl = { stopOscillator };
const _ref_83r6p5 = { handshakePeer };
const _ref_9w7w5r = { useProgram };
const _ref_onbz02 = { fingerprintBrowser };
const _ref_qvr299 = { detectCollision };
const _ref_5y1nit = { spoofReferer };
const _ref_j8wx2q = { analyzeHeader };
const _ref_5c6btb = { getAngularVelocity };
const _ref_mn983c = { compileVertexShader };
const _ref_7ume98 = { getMACAddress };
const _ref_7vn2cb = { defineSymbol };
const _ref_g9q4o3 = { checkUpdate };
const _ref_wuhfea = { analyzeQueryPlan };
const _ref_s5fo14 = { normalizeVolume };
const _ref_0bklxz = { normalizeFeatures };
const _ref_pt1kwp = { scheduleTask };
const _ref_vtu3da = { clearBrowserCache };
const _ref_ht773d = { generateUserAgent };
const _ref_tpoz2a = { generateFakeClass };
const _ref_iourrg = { rayCast };
const _ref_irn3rp = { closeSocket };
const _ref_h2ua84 = { gaussianBlur };
const _ref_dt80q7 = { setAngularVelocity };
const _ref_6sv3cv = { addGeneric6DofConstraint };
const _ref_w8eexl = { queueDownloadTask };
const _ref_3oyxj0 = { analyzeBitrate };
const _ref_br6wxd = { registerISR };
const _ref_xep6cj = { validateProgram };
const _ref_1wsni1 = { verifyFileSignature };
const _ref_bmaikh = { showNotification };
const _ref_udtze4 = { mutexUnlock };
const _ref_3byqa0 = { preventSleepMode };
const _ref_nofdwc = { setDetune };
const _ref_il2tno = { flushSocketBuffer };
const _ref_5apyl8 = { convertRGBtoHSL };
const _ref_kwfz3y = { parseMagnetLink };
const _ref_mtz0pr = { formatLogMessage };
const _ref_w4rbmq = { unlockRow };
const _ref_nknyw8 = { negotiateProtocol };
const _ref_n9j0f2 = { foldConstants };
const _ref_erea8n = { validateTokenStructure };
const _ref_4nel33 = { setMTU };
const _ref_im42hf = { extractArchive };
const _ref_8u9047 = { createBiquadFilter };
const _ref_tfdnjk = { resolveCollision };
const _ref_o74hqo = { chdir };
const _ref_4c4gos = { updateRoutingTable };
const _ref_hknv54 = { execProcess };
const _ref_z3dj8f = { performOCR };
const _ref_c5pnky = { updateSoftBody };
const _ref_5cn7pa = { unmountFileSystem };
const _ref_nkutys = { rotateMatrix };
const _ref_mcfyi2 = { optimizeAST };
const _ref_c0l07c = { computeSpeedAverage };
const _ref_sxhve1 = { normalizeVector };
const _ref_e1xjqb = { checkIntegrityConstraint };
const _ref_gqyf4l = { compactDatabase };
const _ref_wffl24 = { updateTransform };
const _ref_grbuvt = { ProtocolBufferHandler };
const _ref_vamvwa = { createAudioContext };
const _ref_ooa1tt = { getVehicleSpeed };
const _ref_smosj6 = { limitRate };
const _ref_vq6mo0 = { resampleAudio };
const _ref_tq5w30 = { filterTraffic };
const _ref_17zwyh = { deleteProgram };
const _ref_17wbbx = { broadcastTransaction };
const _ref_o3se06 = { getExtension }; 
    });
})({}, {});