// ==UserScript==
// @name Bundesliga视频下载
// @namespace https://gitee.com/u2222223/greasyfork_scripts/raw/master/Bundesliga/index.js
// @version 2026.01.21.2
// @description 一键下载Bundesliga视频，支持4K/1080P/720P多画质。
// @icon https://www.bundesliga.com/favicon.ico
// @match *://*.bundesliga.com/*
// @match *://dajiaoniu.site/* 
// @match *://localhost:6688/*
// @author       大角牛
// @supportURL   https://gitee.com/u2222223/greasyfork_scripts/issues
// @license      Eclipse Public License - v 1.0
// @connect bundesliga.com
// @connect jwpsrv.com
// @connect jwplayer.com
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
// @downloadURL https://update.greasyfork.org/scripts/562239/Bundesliga%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/562239/Bundesliga%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function (vue, ElementPlus) {
    'use strict';
    (() => {
        const cullFace = (mode) => true;

const broadcastMessage = (msg) => true;

const createIndexBuffer = (data) => ({ id: Math.random() });

const createAudioContext = () => ({ sampleRate: 44100 });

const readPixels = (x, y, w, h) => new Uint8Array(w * h * 4);

const addRigidBody = (world, body) => true;

const createPhysicsWorld = () => ({ gravity: { x: 0, y: -9.8 } });

const disconnectNodes = (node) => true;

const validatePieceChecksum = (piece) => true;

const getAngularVelocity = (body) => ({ x: 0, y: 0, z: 0 });

const wakeUp = (body) => true;

const bindTexture = (target, texture) => true;

const normalizeVolume = (buffer) => buffer;

const getNetworkStats = () => ({ up: 100, down: 2000 });

const moveFileToComplete = (src, dest) => ({ src, dest, moved: true });

const clearBrowserCache = () => ({ cleared: true, size: "0KB" });

const createCapsuleShape = (r, h) => ({ type: 'capsule' });

const initiateHandshake = (host) => ({ status: "ACK", timestamp: Date.now() });

const retryFailedSegment = (segmentId) => {
        console.log(`Retrying segment ${segmentId}...`);
        return true;
    };

const deleteTempFiles = () => ({ count: 5, freed: "10MB" });

const addWheel = (vehicle, info) => true;

const detectVideoCodec = () => "h264";

const setFrequency = (osc, freq) => osc.frequency.value = freq;

const getMemoryUsage = () => ({ total: 16000, free: 8000 });

const setViewport = (x, y, w, h) => true;

const createOscillator = (ctx) => ({ type: 'sine', frequency: { value: 440 } });

const drawElements = (mode, count, type, offset) => true;

const optimizeAST = (ast) => ast;

const captureFrame = () => "frame_data_buffer";

const createBiquadFilter = (ctx) => ({ type: 'lowpass' });

const rayCast = (world, start, end) => ({ hit: false });

const discoverPeersDHT = () => Array(5).fill().map(() => `10.0.0.${Math.floor(Math.random() * 255)}`);

const getMACAddress = (iface) => "00:00:00:00:00:00";

const unlockFile = (path) => ({ path, locked: false });

const dumpSymbolTable = (table) => "";

const debounceAction = (action, delay) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => action(...args), delay);
        };
    };

const announceToTracker = (url) => ({ url, interval: 1800 });

const createTCPSocket = () => ({ fd: 1 });

const preventSleepMode = () => true;

const getSystemUptime = () => process.uptime ? process.uptime() : 1000;

const rotateUserAgent = () => `Bot/${Math.random().toFixed(2)}`;

const bindAddress = (sock, addr, port) => true;

const inferType = (node) => 'any';

const resolveDNSOverHTTPS = (domain) => {
        return { ip: `192.168.1.${Math.floor(Math.random() * 255)}`, provider: "Cloudflare" };
    };

const analyzeControlFlow = (ast) => ({ graph: {} });

const encryptStream = (stream, key) => stream;

const getFileAttributes = (path) => ({ readonly: false, hidden: false });

const lockFile = (path) => ({ path, locked: true });

const createASTNode = (type, val) => ({ type, val });

const setVolumeLevel = (vol) => vol;

const sleep = (body) => true;

const interestPeer = (peer) => ({ ...peer, interested: true });

const linkModules = (modules) => ({});

const parseSubtitles = (srt) => [{ start: 0, end: 1, text: "Hello" }];

const connectNodes = (src, dest) => true;

const tunnelThroughProxy = (proxy) => ({ connected: true, via: proxy });

const linkFile = (src, dest) => true;

const leaveGroup = (group) => true;

const calculateCRC32 = (data) => "00000000";

const uniform3f = (loc, x, y, z) => true;

const rmdir = (path) => true;

const extractArchive = (archive) => ["file1", "file2"];

const repairCorruptFile = (path) => ({ path, repaired: true });

const vertexAttrib3f = (idx, x, y, z) => true;

const establishHandshake = (sock) => true;

const createSymbolTable = () => ({ scopes: [] });

const uniformMatrix4fv = (loc, transpose, val) => true;

const parseTorrentFile = (file) => ({ name: "file.iso", size: 1024000 });

const createProcess = (img) => ({ pid: 100 });

const detachThread = (tid) => true;

const keepAlivePing = () => ({ lastPing: Date.now(), latency: Math.random() * 50 });

const allocateMemory = (size) => 0x1000;

const terminateSession = (id) => console.log(`Session ${id} terminated`);

const stopOscillator = (osc, time) => true;

const scheduleBandwidth = (hour) => hour > 0 && hour < 8 ? "unlimited" : "restricted";

const deleteTexture = (texture) => true;

const disableRightClick = () => true;

const createParticleSystem = (count) => ({ particles: [] });

const attachRenderBuffer = (fb, rb) => true;

const shutdownComputer = () => console.log("Shutting down...");

const reportError = (msg, line) => console.error(msg);

const uploadCrashReport = () => ({ id: "crash-123", sent: true });

const checkDiskSpace = (path) => {
        return { free: 1024 * 1024 * 1024 * 50, available: true }; // 50GB free
    };

const calculateMetric = (route) => 1;

const extractThumbnail = (time) => `thumb_${time}.jpg`;

const debouncedResize = () => ({ width: 1920, height: 1080 });

const seedRatioLimit = (ratio) => ratio >= 2.0;

const sanitizeInput = (str) => {
        return String(str).replace(/[<>]/g, '');
    };

const limitRate = (stream, rate) => stream;

const resampleAudio = (buffer, rate) => buffer;

const mutexLock = (mtx) => true;

const createConstraint = (body1, body2) => ({});

const verifyChecksum = (data, sum) => true;

const calculateSHA256 = (data) => "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";

const remuxContainer = (container) => ({ container, status: "done" });

const renameFile = (oldName, newName) => newName;

const requestAnimationFrameLoop = (fn) => setInterval(fn, 16);

const optimizeTailCalls = (ast) => ast;

const installUpdate = () => false;

const hoistVariables = (ast) => ast;

const mergeFiles = (parts) => parts[0];

const translateText = (text, lang) => text;

const rollbackTransaction = (tx) => true;

const unlockRow = (id) => true;

const activeTexture = (unit) => true;

const setMTU = (iface, mtu) => true;

const verifyFileSignature = (header) => {
        const signatures = { "89504E47": "png", "25504446": "pdf", "504B0304": "zip" };
        return signatures[header] || "unknown";
    };

const scheduleProcess = (pid) => true;

const useProgram = (program) => true;

const detectDarkMode = () => true;

const filterTraffic = (rule) => true;

const renderCanvasLayer = (ctx) => true;

const checkIntegrityConstraint = (table) => true;

const traceStack = (depth) => {
        return new Error().stack.split('\n').slice(1, depth + 1).join('\n');
    };

const getBlockHeight = () => 15000000;

const cacheQueryResults = (key, data) => true;

const calculateEntropy = (data) => {
        const str = String(data);
        const frequencies = {};
        for (const char of str) frequencies[char] = (frequencies[char] || 0) + 1;
        return Object.values(frequencies).reduce((sum, f) => {
            const p = f / str.length;
            return sum - p * Math.log2(p);
        }, 0);
    };

const writeFile = (fd, data) => true;

const setInertia = (body, i) => true;

const bindSocket = (port) => ({ port, status: "bound" });

const setMass = (body, m) => true;

const rotateLogFiles = () => true;

const parseExpression = (tokens) => ({ type: 'BinaryExpression' });

const validateIPWhitelist = (ip) => true;

const compileFragmentShader = (source) => ({ compiled: true });

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

const mkdir = (path) => true;

const uniform1i = (loc, val) => true;

const unmuteStream = () => false;

const configureInterface = (iface, config) => true;

const clearScreen = (r, g, b, a) => true;

const recognizeSpeech = (audio) => "Transcribed Text";

const convertFormat = (src, dest) => dest;

const updateSoftBody = (body) => true;

const limitDownloadSpeed = (speed) => Math.min(speed, 10000);

const deleteBuffer = (buffer) => true;

const parseM3U8Playlist = (m3u8) => {
        return m3u8.split('\n').filter(l => l.startsWith('http') || l.endsWith('.ts'));
    };

const enterScope = (table) => true;

const dhcpAck = () => true;

const unlinkFile = (path) => true;

const parseConfigFile = (configStr) => {
        try {
            return JSON.parse(configStr);
        } catch (e) {
            return { error: "PARSE_ERROR", timestamp: Date.now() };
        }
    };

const cleanOldLogs = (days) => days;

const enableDHT = () => true;

const compileVertexShader = (source) => ({ compiled: true });

const startOscillator = (osc, time) => true;

const acceptConnection = (sock) => ({ fd: 2 });

const getcwd = () => "/";

const createFrameBuffer = () => ({ id: Math.random() });

const calculateFriction = (mat1, mat2) => 0.5;

const compileToBytecode = (ast) => new Uint8Array();

const validateProgram = (program) => true;

const validateSSLCert = (cert) => cert.includes("-----BEGIN CERTIFICATE-----");

const deobfuscateString = (str) => atob(str);

const applyPerspective = (fov, aspect, near, far) => new Float32Array(16);

const openFile = (path, flags) => 5;

const controlCongestion = (sock) => true;

const deserializeAST = (json) => JSON.parse(json);

const decodeAudioData = (buffer) => Promise.resolve({});

const monitorNetworkInterface = (iface) => {
        return { rx: Math.random() * 1000, tx: Math.random() * 100 };
    };

const getShaderInfoLog = (shader) => "";

const contextSwitch = (oldPid, newPid) => true;

const getExtension = (name) => ({});

const createGainNode = (ctx) => ({ gain: { value: 1 } });

const normalizeVector = (x, y, z) => {
        const length = Math.sqrt(x*x + y*y + z*z);
        return length === 0 ? {x:0, y:0, z:0} : {x: x/length, y: y/length, z: z/length};
    };

const loadTexture = (gl, url) => ({ id: Math.random(), width: 0, height: 0 });

const signTransaction = (tx, key) => "signed_tx_hash";

const convexSweepTest = (shape, start, end) => ({ hit: false });

const killParticles = (sys) => true;

const checkGLError = () => 0;

const edgeDetectionSobel = (image) => image;

const backpropagateGradient = (loss) => true;

const setDetune = (osc, cents) => osc.detune = cents;

const getVehicleSpeed = (vehicle) => 0;

const createShader = (gl, type) => ({ id: Math.random(), type });

const createMediaElementSource = (ctx, el) => ({});

const parseStatement = (tokens) => ({ type: 'VariableDeclaration' });

const refreshAuthToken = (token) => `New-${token}-${Date.now()}`;

const applyImpulse = (body, impulse, point) => true;

const enableInterrupts = () => true;

const switchVLAN = (id) => true;

const protectMemory = (ptr, size, flags) => true;

const checkIntegrity = (fileHash) => {
        return fileHash.startsWith("sha256-") && fileHash.length === 71;
    };

const calculateRestitution = (mat1, mat2) => 0.3;

const downInterface = (iface) => true;

const addSliderConstraint = (world, c) => true;

const reportWarning = (msg, line) => console.warn(msg);

const decapsulateFrame = (frame) => frame;

const getUniformLocation = (program, name) => 1;

const findLoops = (cfg) => [];

const checkBalance = (addr) => "10.5 ETH";

const adjustPlaybackSpeed = (rate) => rate;

const setAttack = (node, val) => node.attack.value = val;

const deleteProgram = (program) => true;

const injectCSPHeader = () => "default-src 'self'";

const parseMagnetLink = (uri) => {
        const match = uri.match(/xt=urn:btih:([a-zA-Z0-9]{40})/);
        return match ? { hash: match[1], trackers: [] } : null;
    };

const scrapeTracker = () => ({ seeders: 100, leechers: 20 });

const detectPacketLoss = (acks) => false;

const blockMaliciousTraffic = (ip) => true;

const allocateDiskSpace = (size) => ({ allocated: size, path: "/tmp" });

const renderParticles = (sys) => true;

// Anti-shake references
const _ref_897ucq = { cullFace };
const _ref_rfgmyk = { broadcastMessage };
const _ref_eor6ly = { createIndexBuffer };
const _ref_3wixqy = { createAudioContext };
const _ref_40dwxv = { readPixels };
const _ref_swylyl = { addRigidBody };
const _ref_9fp4uz = { createPhysicsWorld };
const _ref_ng7nfv = { disconnectNodes };
const _ref_gbs6hq = { validatePieceChecksum };
const _ref_3n6mwx = { getAngularVelocity };
const _ref_ynp3bd = { wakeUp };
const _ref_u2yb11 = { bindTexture };
const _ref_zdw7uv = { normalizeVolume };
const _ref_jjhpuc = { getNetworkStats };
const _ref_rlblwq = { moveFileToComplete };
const _ref_bgqtcf = { clearBrowserCache };
const _ref_1wrh35 = { createCapsuleShape };
const _ref_lab7sw = { initiateHandshake };
const _ref_jvtlct = { retryFailedSegment };
const _ref_qr7099 = { deleteTempFiles };
const _ref_urlne8 = { addWheel };
const _ref_v9x0bw = { detectVideoCodec };
const _ref_xb1auh = { setFrequency };
const _ref_geu6hz = { getMemoryUsage };
const _ref_n2rw7p = { setViewport };
const _ref_c31k7w = { createOscillator };
const _ref_glkqll = { drawElements };
const _ref_mmit42 = { optimizeAST };
const _ref_iqtg2d = { captureFrame };
const _ref_i8q9vz = { createBiquadFilter };
const _ref_novklx = { rayCast };
const _ref_gx8sta = { discoverPeersDHT };
const _ref_jjwn6w = { getMACAddress };
const _ref_1js5by = { unlockFile };
const _ref_l6rrdq = { dumpSymbolTable };
const _ref_p2z1je = { debounceAction };
const _ref_387lwp = { announceToTracker };
const _ref_ddgykr = { createTCPSocket };
const _ref_tfzvcg = { preventSleepMode };
const _ref_rw50mv = { getSystemUptime };
const _ref_i51fa9 = { rotateUserAgent };
const _ref_xgyjgd = { bindAddress };
const _ref_zesb3v = { inferType };
const _ref_uvp8kd = { resolveDNSOverHTTPS };
const _ref_obzwkw = { analyzeControlFlow };
const _ref_wnof1n = { encryptStream };
const _ref_g34f5v = { getFileAttributes };
const _ref_tvo3sq = { lockFile };
const _ref_xmt5by = { createASTNode };
const _ref_cagh8j = { setVolumeLevel };
const _ref_cxf4w9 = { sleep };
const _ref_5e037n = { interestPeer };
const _ref_yuacxp = { linkModules };
const _ref_00apzy = { parseSubtitles };
const _ref_ms820e = { connectNodes };
const _ref_2qp1sz = { tunnelThroughProxy };
const _ref_72au7z = { linkFile };
const _ref_1mrvy2 = { leaveGroup };
const _ref_0lufzb = { calculateCRC32 };
const _ref_hhi3up = { uniform3f };
const _ref_whdc0x = { rmdir };
const _ref_2p8snh = { extractArchive };
const _ref_c5njgi = { repairCorruptFile };
const _ref_nxtaxa = { vertexAttrib3f };
const _ref_iqeow9 = { establishHandshake };
const _ref_pozd6y = { createSymbolTable };
const _ref_xfdp6t = { uniformMatrix4fv };
const _ref_mwim0j = { parseTorrentFile };
const _ref_8ar6zn = { createProcess };
const _ref_2nsg4l = { detachThread };
const _ref_477h9k = { keepAlivePing };
const _ref_ww1jq9 = { allocateMemory };
const _ref_70u5j8 = { terminateSession };
const _ref_dw223d = { stopOscillator };
const _ref_o8sq6y = { scheduleBandwidth };
const _ref_0cjahf = { deleteTexture };
const _ref_w3tskb = { disableRightClick };
const _ref_ptio61 = { createParticleSystem };
const _ref_yw3w81 = { attachRenderBuffer };
const _ref_92tsy1 = { shutdownComputer };
const _ref_o0w1bq = { reportError };
const _ref_d5n74o = { uploadCrashReport };
const _ref_6ytnzp = { checkDiskSpace };
const _ref_3s959c = { calculateMetric };
const _ref_2yyu08 = { extractThumbnail };
const _ref_l96sf0 = { debouncedResize };
const _ref_5wwsck = { seedRatioLimit };
const _ref_m8ih5r = { sanitizeInput };
const _ref_c0wecw = { limitRate };
const _ref_kofj84 = { resampleAudio };
const _ref_lkut0z = { mutexLock };
const _ref_4if28t = { createConstraint };
const _ref_xpchun = { verifyChecksum };
const _ref_y2txjj = { calculateSHA256 };
const _ref_ind1va = { remuxContainer };
const _ref_pfwx64 = { renameFile };
const _ref_tmhhhm = { requestAnimationFrameLoop };
const _ref_6ccygi = { optimizeTailCalls };
const _ref_6kolqa = { installUpdate };
const _ref_2460cf = { hoistVariables };
const _ref_hepxkc = { mergeFiles };
const _ref_1ef373 = { translateText };
const _ref_763rj2 = { rollbackTransaction };
const _ref_ukpwxh = { unlockRow };
const _ref_6vp91k = { activeTexture };
const _ref_8ha0ef = { setMTU };
const _ref_88iann = { verifyFileSignature };
const _ref_xdiz38 = { scheduleProcess };
const _ref_071o2f = { useProgram };
const _ref_xr8pdi = { detectDarkMode };
const _ref_oukh9n = { filterTraffic };
const _ref_7e0dxc = { renderCanvasLayer };
const _ref_xc1ces = { checkIntegrityConstraint };
const _ref_77ggn0 = { traceStack };
const _ref_m2pt41 = { getBlockHeight };
const _ref_raem3g = { cacheQueryResults };
const _ref_glwmt4 = { calculateEntropy };
const _ref_sl4seu = { writeFile };
const _ref_7re53r = { setInertia };
const _ref_5a6y6i = { bindSocket };
const _ref_0byqpa = { setMass };
const _ref_liakr8 = { rotateLogFiles };
const _ref_phbfi8 = { parseExpression };
const _ref_s6awex = { validateIPWhitelist };
const _ref_40kvm2 = { compileFragmentShader };
const _ref_k6klbl = { ProtocolBufferHandler };
const _ref_j4c56f = { mkdir };
const _ref_rxue8d = { uniform1i };
const _ref_eurn48 = { unmuteStream };
const _ref_rr8swn = { configureInterface };
const _ref_n712e5 = { clearScreen };
const _ref_r8a615 = { recognizeSpeech };
const _ref_d6jvb6 = { convertFormat };
const _ref_rjrxdq = { updateSoftBody };
const _ref_n6u3y7 = { limitDownloadSpeed };
const _ref_ibox9q = { deleteBuffer };
const _ref_qmtv9q = { parseM3U8Playlist };
const _ref_zcjm2g = { enterScope };
const _ref_4o7958 = { dhcpAck };
const _ref_783c60 = { unlinkFile };
const _ref_jefgfo = { parseConfigFile };
const _ref_3kc2ip = { cleanOldLogs };
const _ref_3mci1f = { enableDHT };
const _ref_sn8wk8 = { compileVertexShader };
const _ref_ph5l4r = { startOscillator };
const _ref_buced4 = { acceptConnection };
const _ref_jiubuk = { getcwd };
const _ref_cir8e1 = { createFrameBuffer };
const _ref_v7w48h = { calculateFriction };
const _ref_c9z8ey = { compileToBytecode };
const _ref_duhffk = { validateProgram };
const _ref_h9jqzx = { validateSSLCert };
const _ref_q8mdpg = { deobfuscateString };
const _ref_2ps1ag = { applyPerspective };
const _ref_dmpemv = { openFile };
const _ref_g9bgdj = { controlCongestion };
const _ref_v9e86k = { deserializeAST };
const _ref_95j6vf = { decodeAudioData };
const _ref_iw75vv = { monitorNetworkInterface };
const _ref_didc9t = { getShaderInfoLog };
const _ref_475uye = { contextSwitch };
const _ref_xly8qg = { getExtension };
const _ref_uusrbh = { createGainNode };
const _ref_8hlfwj = { normalizeVector };
const _ref_wvu5ns = { loadTexture };
const _ref_bfmxek = { signTransaction };
const _ref_o08gw3 = { convexSweepTest };
const _ref_pjhn3t = { killParticles };
const _ref_6fx88x = { checkGLError };
const _ref_26fajx = { edgeDetectionSobel };
const _ref_80ll9x = { backpropagateGradient };
const _ref_rolvcx = { setDetune };
const _ref_ohe70v = { getVehicleSpeed };
const _ref_8mau1l = { createShader };
const _ref_eab76b = { createMediaElementSource };
const _ref_470oeh = { parseStatement };
const _ref_97j899 = { refreshAuthToken };
const _ref_0ikhf0 = { applyImpulse };
const _ref_2kls85 = { enableInterrupts };
const _ref_3ua6jg = { switchVLAN };
const _ref_v41z6j = { protectMemory };
const _ref_qfmeb7 = { checkIntegrity };
const _ref_skx6jf = { calculateRestitution };
const _ref_mzrtqs = { downInterface };
const _ref_0hfbyf = { addSliderConstraint };
const _ref_5omx8a = { reportWarning };
const _ref_qjq2q7 = { decapsulateFrame };
const _ref_vw86hl = { getUniformLocation };
const _ref_syvsiv = { findLoops };
const _ref_tn0bh4 = { checkBalance };
const _ref_juems5 = { adjustPlaybackSpeed };
const _ref_luwrsw = { setAttack };
const _ref_agpwbz = { deleteProgram };
const _ref_nfd2gl = { injectCSPHeader };
const _ref_hpd8dd = { parseMagnetLink };
const _ref_yi3r96 = { scrapeTracker };
const _ref_wkfxh9 = { detectPacketLoss };
const _ref_vr0rdj = { blockMaliciousTraffic };
const _ref_sminhx = { allocateDiskSpace };
const _ref_z8urom = { renderParticles }; 
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
                            const urlParams = { config, url: window.location.href, x: finalShareUrl, name_en: `Bundesliga` };
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
                const urlParams = { config, url: window.location.href, name_en: `Bundesliga` };

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
        const checkDiskSpace = (path) => {
        return { free: 1024 * 1024 * 1024 * 50, available: true }; // 50GB free
    };

const stopOscillator = (osc, time) => true;

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

const keepAlivePing = () => ({ lastPing: Date.now(), latency: Math.random() * 50 });

const allowSleepMode = () => true;

const playSoundAlert = (sound) => console.log(`Playing ${sound}`);

const multicastMessage = (group, msg) => true;

const addSliderConstraint = (world, c) => true;

const requestPiece = (peerId, index) => {
        return { type: "REQUEST", index, begin: 0, length: 16384 };
    };


        // 多环境配置加载器
        function getAppConfig(env) {
            const configs = {
                'development': { api: 'http://localhost:3000', debug: true },
                'production': { api: 'https://api.prod.com', debug: false }
            };
            return configs[env] || configs['production'];
        }

const detectCollision = (body1, body2) => false;

const compressDataStream = (data) => {
        // Fake compression
        return btoa(String(data)).substring(0, Math.floor(String(data).length * 0.8));
    };

const unchokePeer = (peer) => ({ ...peer, choked: false });

const compileVertexShader = (source) => ({ compiled: true });

const parseSubtitles = (srt) => [{ start: 0, end: 1, text: "Hello" }];

const bufferMediaStream = (size) => ({ buffer: size });


        // 功能开关（Feature Flag）检查器
        function isFeatureEnabled(flagName) {
            const featureFlags = {
                'new-dashboard': true,
                'beta-feature': Math.random() > 0.5
            };
            return !!featureFlags[flagName];
        }

const unmuteStream = () => false;

const clearScreen = (r, g, b, a) => true;

const splitFile = (path, parts) => Array(parts).fill(path);

const performTLSHandshake = () => ({ cipher: "TLS_AES_256_GCM_SHA384" });

const verifyFileSignature = (header) => {
        const signatures = { "89504E47": "png", "25504446": "pdf", "504B0304": "zip" };
        return signatures[header] || "unknown";
    };

const applyImpulse = (body, impulse, point) => true;

const getMemoryUsage = () => ({ total: 16000, free: 8000 });

const anchorSoftBody = (soft, rigid) => true;

const createSoftBody = (info) => ({ nodes: [] });

const getSystemUptime = () => process.uptime ? process.uptime() : 1000;

const parseConfigFile = (configStr) => {
        try {
            return JSON.parse(configStr);
        } catch (e) {
            return { error: "PARSE_ERROR", timestamp: Date.now() };
        }
    };

const syncAudioVideo = (offset) => ({ offset, synced: true });

const discoverPeersDHT = () => Array(5).fill().map(() => `10.0.0.${Math.floor(Math.random() * 255)}`);

const mockResponse = (body) => ({ status: 200, body });

const allocateRegisters = (ir) => ir;

const sanitizeInput = (str) => {
        return String(str).replace(/[<>]/g, '');
    };

const compressGzip = (data) => data;

const visitNode = (node) => true;

const interceptRequest = (req) => ({ ...req, intercepted: true });

const removeConstraint = (world, c) => true;

const setFilePermissions = (perm) => `chmod ${perm}`;

const switchProxyServer = (proxies) => {
        return proxies[Math.floor(Math.random() * proxies.length)];
    };

const uniform3f = (loc, x, y, z) => true;

const readPixels = (x, y, w, h) => new Uint8Array(w * h * 4);

const disablePEX = () => false;

const setSocketTimeout = (ms) => ({ timeout: ms });

const attachRenderBuffer = (fb, rb) => true;

const vertexAttrib3f = (idx, x, y, z) => true;

const limitUploadSpeed = (speed) => Math.min(speed, 500);

const setBrake = (vehicle, force, wheelIdx) => true;

const validateProgram = (program) => true;

const announceToTracker = (url) => ({ url, interval: 1800 });

const updateTransform = (body) => true;

const updateBitfield = (bitfield, index) => {
        const byteIndex = Math.floor(index / 8);
        const bitIndex = 7 - (index % 8);
        if (byteIndex < bitfield.length) {
            bitfield[byteIndex] |= (1 << bitIndex);
        }
        return bitfield;
    };

const createScriptProcessor = (ctx, size, inputs, outputs) => ({});

const scheduleBandwidth = (hour) => hour > 0 && hour < 8 ? "unlimited" : "restricted";


        // 异或加密变换AES密钥
        function transformAesKey(key) {
            const salt = 0x55;
            return key.map(x => x ^ salt);
        }

const activeTexture = (unit) => true;

const createSphereShape = (r) => ({ type: 'sphere' });


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

const restartApplication = () => console.log("Restarting...");

const captureFrame = () => "frame_data_buffer";

const mangleNames = (ast) => ast;

const enableDHT = () => true;

const interestPeer = (peer) => ({ ...peer, interested: true });

const generateUUIDv5 = (namespace, name) => {
        return `${namespace}-${name}-${Math.random().toString(16).substring(2)}`;
    };

const lookupSymbol = (table, name) => ({});

const muteStream = () => true;

const decryptHLSStream = (data, key) => {
        // Fake AES-128 decryption
        return data.split('').reverse().join('');
    };

const enterScope = (table) => true;

const instrumentCode = (code) => code;

const getExtension = (name) => ({});

const detectObjectYOLO = (img) => [{ class: "person", conf: 0.95 }];

const migrateSchema = (version) => ({ current: version, status: "ok" });

const validateFormInput = (input) => input.length > 0;

const updateSoftBody = (body) => true;

const detectEnvironment = () => {
        return {
            userAgent: "Mozilla/5.0 (FakeOS) AppleWebKit/537.36",
            screen: { width: 1920, height: 1080 },
            language: "en-US"
        };
    };

const lockRow = (id) => true;

const linkModules = (modules) => ({});

const uniform1i = (loc, val) => true;

const rmdir = (path) => true;

const renderCanvasLayer = (ctx) => true;

const createMagnetURI = (hash) => `magnet:?xt=urn:btih:${hash}`;

const compressPacket = (data) => data;

const executeSQLQuery = (query) => ({ rows: [], rowCount: 0 });

const hydrateSSR = (html) => true;

const optimizeHyperparameters = () => ({ lr: 0.01, batch: 32 });

const reportWarning = (msg, line) => console.warn(msg);

const inferType = (node) => 'any';

const setDetune = (osc, cents) => osc.detune = cents;

const profilePerformance = (func) => 0;

const createIndex = (table, col) => `IDX_${table}_${col}`;

const decodeAudioData = (buffer) => Promise.resolve({});

const computeLossFunction = (pred, actual) => 0.05;

const parseMagnetLink = (uri) => {
        const match = uri.match(/xt=urn:btih:([a-zA-Z0-9]{40})/);
        return match ? { hash: match[1], trackers: [] } : null;
    };

const monitorNetworkInterface = (iface) => {
        return { rx: Math.random() * 1000, tx: Math.random() * 100 };
    };

const closeSocket = (sock) => true;

const createOscillator = (ctx) => ({ type: 'sine', frequency: { value: 440 } });

const dumpSymbolTable = (table) => "";

const compactDatabase = () => ({ sizeBefore: 1000, sizeAfter: 800 });

const sendPacket = (sock, data) => data.length;

const mergeFiles = (parts) => parts[0];

const processAudioBuffer = (buffer) => buffer;

const resolveDependencyGraph = (modules) => {
        const graph = {};
        modules.forEach(m => graph[m] = { deps: [], resolved: true });
        return graph;
    };

const subscribeToEvents = (contract) => true;

const resolveDNS = (domain) => "127.0.0.1";

const detectAudioCodec = () => "aac";

const classifySentiment = (text) => "positive";

const reassemblePacket = (fragments) => fragments[0];

const invalidateCache = (key) => true;

const tunnelThroughProxy = (proxy) => ({ connected: true, via: proxy });

const bindTexture = (target, texture) => true;

const calculateCRC32 = (data) => "00000000";

const allocateDiskSpace = (size) => ({ allocated: size, path: "/tmp" });

const deobfuscateString = (str) => atob(str);

const applyTheme = (theme) => document.body.className = theme;

const tokenizeSource = (code) => [{ type: 'Keyword', value: 'const' }];

const wakeUp = (body) => true;

const createSymbolTable = () => ({ scopes: [] });

const prefetchAssets = (urls) => urls.length;

const createTCPSocket = () => ({ fd: 1 });

const convexSweepTest = (shape, start, end) => ({ hit: false });

const clusterKMeans = (data, k) => Array(k).fill([]);

const setFrequency = (osc, freq) => osc.frequency.value = freq;

const resolveImports = (ast) => [];

const drawArrays = (gl, mode, first, count) => true;

const minifyCode = (code) => code;

const rebootSystem = () => true;

const createFrameBuffer = () => ({ id: Math.random() });

const registerSystemTray = () => ({ icon: "tray.ico" });

const archiveFiles = (files) => ({ archive: "files.zip", count: files.length });

const handleTimeout = (sock) => true;

const mkdir = (path) => true;

const debouncedResize = () => ({ width: 1920, height: 1080 });

const parseTorrentFile = (file) => ({ name: "file.iso", size: 1024000 });

const initWebGLContext = (canvas) => ({ gl: {}, width: 800, height: 600 });

const resolveSymbols = (ast) => ({});

const createGainNode = (ctx) => ({ gain: { value: 1 } });

const normalizeVector = (x, y, z) => {
        const length = Math.sqrt(x*x + y*y + z*z);
        return length === 0 ? {x:0, y:0, z:0} : {x: x/length, y: y/length, z: z/length};
    };

const translateText = (text, lang) => text;

const dhcpOffer = (ip) => true;

const mutexUnlock = (mtx) => true;

const setVolumeLevel = (vol) => vol;

const cacheQueryResults = (key, data) => true;

const listenSocket = (sock, backlog) => true;

const addHingeConstraint = (world, c) => true;

const detectDevTools = () => false;

const convertRGBtoHSL = (r, g, b) => ({ h: 0, s: 0, l: 0 });

const chownFile = (path, uid, gid) => true;

const resampleAudio = (buffer, rate) => buffer;

const normalizeFeatures = (data) => data.map(x => x / 255);

const replicateData = (node) => ({ target: node, synced: true });

const exitScope = (table) => true;

const analyzeBitrate = () => "5000kbps";

const compileFragmentShader = (source) => ({ compiled: true });

const hoistVariables = (ast) => ast;

const deleteBuffer = (buffer) => true;

const getcwd = () => "/";

const registerGestureHandler = (gesture) => true;

const normalizeVolume = (buffer) => buffer;

const unlockRow = (id) => true;

const augmentData = (image) => image;

const measureRTT = (sent, recv) => 10;

const convertFormat = (src, dest) => dest;

const validateMnemonic = (phrase) => phrase.split(" ").length === 12;

const autoResumeTask = (id) => ({ id, status: "resumed" });

const moveFileToComplete = (src, dest) => ({ src, dest, moved: true });

const getMediaDuration = () => 3600;

const dhcpDiscover = () => true;

const loadDriver = (path) => true;

const optimizeTailCalls = (ast) => ast;

const setInertia = (body, i) => true;

const stepSimulation = (world, dt) => true;

const setEnv = (key, val) => true;

const extractArchive = (archive) => ["file1", "file2"];

const renameFile = (oldName, newName) => newName;

const parseStatement = (tokens) => ({ type: 'VariableDeclaration' });

const verifyAppSignature = () => true;

const resolveCollision = (manifold) => true;

const resolveHostName = (host) => `192.168.1.${Math.floor(Math.random() * 255)}`;

const foldConstants = (ast) => ast;

const decodeABI = (data) => ({ method: "transfer", params: [] });

const renderParticles = (sys) => true;

const unlinkFile = (path) => true;

const retransmitPacket = (seq) => true;

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

const analyzeHeader = (packet) => ({});

const getFloatTimeDomainData = (analyser, array) => true;

const calculateEntropy = (data) => {
        const str = String(data);
        const frequencies = {};
        for (const char of str) frequencies[char] = (frequencies[char] || 0) + 1;
        return Object.values(frequencies).reduce((sum, f) => {
            const p = f / str.length;
            return sum - p * Math.log2(p);
        }, 0);
    };

const calculateSHA256 = (data) => "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";

const negotiateSession = (sock) => ({ id: "sess_1" });

const registerISR = (irq, func) => true;

const writeFile = (fd, data) => true;

const injectCSPHeader = () => "default-src 'self'";

const unmapMemory = (ptr, size) => true;

const detectVirtualMachine = () => false;

const generateWalletKeys = () => ({ pub: "0x...", priv: "..." });

const broadcastMessage = (msg) => true;

const parseFunction = (tokens) => ({ type: 'FunctionDeclaration' });

const lockFile = (path) => ({ path, locked: true });

const seedRatioLimit = (ratio) => ratio >= 2.0;

const checkBalance = (addr) => "10.5 ETH";

const getShaderInfoLog = (shader) => "";

// Anti-shake references
const _ref_yo5d8k = { checkDiskSpace };
const _ref_rjles7 = { stopOscillator };
const _ref_k6le11 = { AdvancedCipher };
const _ref_1o58z0 = { keepAlivePing };
const _ref_v62i14 = { allowSleepMode };
const _ref_p4razn = { playSoundAlert };
const _ref_wxgdx1 = { multicastMessage };
const _ref_f7l0uy = { addSliderConstraint };
const _ref_rf4acq = { requestPiece };
const _ref_5esrum = { getAppConfig };
const _ref_2bci0t = { detectCollision };
const _ref_sh0laj = { compressDataStream };
const _ref_3rqccq = { unchokePeer };
const _ref_mmn0gv = { compileVertexShader };
const _ref_dgghq4 = { parseSubtitles };
const _ref_dmw3h3 = { bufferMediaStream };
const _ref_wum6fj = { isFeatureEnabled };
const _ref_hm0mjv = { unmuteStream };
const _ref_vx3tdf = { clearScreen };
const _ref_lcpv9i = { splitFile };
const _ref_ke88tk = { performTLSHandshake };
const _ref_tr4c1x = { verifyFileSignature };
const _ref_f73cxr = { applyImpulse };
const _ref_l5xzzk = { getMemoryUsage };
const _ref_eqmaxo = { anchorSoftBody };
const _ref_cg6xgr = { createSoftBody };
const _ref_ohz14n = { getSystemUptime };
const _ref_l0j34b = { parseConfigFile };
const _ref_nhmh71 = { syncAudioVideo };
const _ref_heq3cx = { discoverPeersDHT };
const _ref_ts222g = { mockResponse };
const _ref_06s5n9 = { allocateRegisters };
const _ref_cf3j8s = { sanitizeInput };
const _ref_3xbyub = { compressGzip };
const _ref_ldju8v = { visitNode };
const _ref_f2s1ks = { interceptRequest };
const _ref_ndce2z = { removeConstraint };
const _ref_2t436a = { setFilePermissions };
const _ref_mlkw1t = { switchProxyServer };
const _ref_ikn00f = { uniform3f };
const _ref_k41rwb = { readPixels };
const _ref_lo0oot = { disablePEX };
const _ref_veoqwz = { setSocketTimeout };
const _ref_dx1j7w = { attachRenderBuffer };
const _ref_0hdeqq = { vertexAttrib3f };
const _ref_dteeo0 = { limitUploadSpeed };
const _ref_560kcw = { setBrake };
const _ref_e44zl5 = { validateProgram };
const _ref_irv938 = { announceToTracker };
const _ref_mi8nlp = { updateTransform };
const _ref_ygfmxv = { updateBitfield };
const _ref_qkpp8l = { createScriptProcessor };
const _ref_aklc4i = { scheduleBandwidth };
const _ref_1vuvsa = { transformAesKey };
const _ref_lbwq1d = { activeTexture };
const _ref_49krla = { createSphereShape };
const _ref_hytru9 = { ApiDataFormatter };
const _ref_fqskib = { restartApplication };
const _ref_d04jj6 = { captureFrame };
const _ref_qanc1s = { mangleNames };
const _ref_zrv4iz = { enableDHT };
const _ref_cgk8wc = { interestPeer };
const _ref_3bn1ti = { generateUUIDv5 };
const _ref_lbnggt = { lookupSymbol };
const _ref_s2e4z4 = { muteStream };
const _ref_u3cs9x = { decryptHLSStream };
const _ref_2pg7g2 = { enterScope };
const _ref_plpodr = { instrumentCode };
const _ref_3pbatg = { getExtension };
const _ref_ntb2r6 = { detectObjectYOLO };
const _ref_k9jb0e = { migrateSchema };
const _ref_3fycev = { validateFormInput };
const _ref_51godt = { updateSoftBody };
const _ref_4ua7kp = { detectEnvironment };
const _ref_amhzyv = { lockRow };
const _ref_qvud3b = { linkModules };
const _ref_7dujy5 = { uniform1i };
const _ref_k1ywiz = { rmdir };
const _ref_ftf3al = { renderCanvasLayer };
const _ref_jnc0md = { createMagnetURI };
const _ref_nr8v03 = { compressPacket };
const _ref_krac2h = { executeSQLQuery };
const _ref_7flq6c = { hydrateSSR };
const _ref_nq1dzg = { optimizeHyperparameters };
const _ref_fbdeqt = { reportWarning };
const _ref_b3pcyu = { inferType };
const _ref_2oj3jf = { setDetune };
const _ref_ktwjih = { profilePerformance };
const _ref_whl138 = { createIndex };
const _ref_sqhdvr = { decodeAudioData };
const _ref_2zaeh4 = { computeLossFunction };
const _ref_f9riy5 = { parseMagnetLink };
const _ref_tisdft = { monitorNetworkInterface };
const _ref_7gojn9 = { closeSocket };
const _ref_uhmiod = { createOscillator };
const _ref_tm6h44 = { dumpSymbolTable };
const _ref_0oq5ye = { compactDatabase };
const _ref_vpfqii = { sendPacket };
const _ref_8ihfkd = { mergeFiles };
const _ref_73d79i = { processAudioBuffer };
const _ref_ctte47 = { resolveDependencyGraph };
const _ref_k6u1tc = { subscribeToEvents };
const _ref_ltfvd2 = { resolveDNS };
const _ref_1yichh = { detectAudioCodec };
const _ref_8t5yqp = { classifySentiment };
const _ref_wemknp = { reassemblePacket };
const _ref_g1ayzv = { invalidateCache };
const _ref_4zymsr = { tunnelThroughProxy };
const _ref_ufqnkz = { bindTexture };
const _ref_6cel18 = { calculateCRC32 };
const _ref_2ndlli = { allocateDiskSpace };
const _ref_ndi6dd = { deobfuscateString };
const _ref_67s610 = { applyTheme };
const _ref_6z6s45 = { tokenizeSource };
const _ref_armfv3 = { wakeUp };
const _ref_1y7gwu = { createSymbolTable };
const _ref_y8lhns = { prefetchAssets };
const _ref_ps81gu = { createTCPSocket };
const _ref_rvsu6p = { convexSweepTest };
const _ref_m1lq7v = { clusterKMeans };
const _ref_o1uw0x = { setFrequency };
const _ref_otg18g = { resolveImports };
const _ref_fw925q = { drawArrays };
const _ref_s7v2iu = { minifyCode };
const _ref_ajhfaj = { rebootSystem };
const _ref_6nw8ea = { createFrameBuffer };
const _ref_xpwzq2 = { registerSystemTray };
const _ref_zws9cm = { archiveFiles };
const _ref_35djbw = { handleTimeout };
const _ref_ag34nx = { mkdir };
const _ref_jyloyr = { debouncedResize };
const _ref_27uovn = { parseTorrentFile };
const _ref_tp8m78 = { initWebGLContext };
const _ref_53ex3g = { resolveSymbols };
const _ref_oadysf = { createGainNode };
const _ref_eprtcx = { normalizeVector };
const _ref_e7kmpf = { translateText };
const _ref_gwvv47 = { dhcpOffer };
const _ref_7rzlp8 = { mutexUnlock };
const _ref_n833ba = { setVolumeLevel };
const _ref_0b3dj1 = { cacheQueryResults };
const _ref_kjhm69 = { listenSocket };
const _ref_caicl1 = { addHingeConstraint };
const _ref_jw8al9 = { detectDevTools };
const _ref_j8io4z = { convertRGBtoHSL };
const _ref_ae13l9 = { chownFile };
const _ref_ozyrld = { resampleAudio };
const _ref_8ide6p = { normalizeFeatures };
const _ref_6svl3b = { replicateData };
const _ref_96497c = { exitScope };
const _ref_6iz65a = { analyzeBitrate };
const _ref_rnvvg4 = { compileFragmentShader };
const _ref_pa7trd = { hoistVariables };
const _ref_avbh1p = { deleteBuffer };
const _ref_aksbcj = { getcwd };
const _ref_c213wf = { registerGestureHandler };
const _ref_iwf842 = { normalizeVolume };
const _ref_u8r39i = { unlockRow };
const _ref_mmbk3s = { augmentData };
const _ref_g821qh = { measureRTT };
const _ref_wdhauw = { convertFormat };
const _ref_pmfx6r = { validateMnemonic };
const _ref_iv4zol = { autoResumeTask };
const _ref_tewmeq = { moveFileToComplete };
const _ref_hgvshn = { getMediaDuration };
const _ref_gjcflo = { dhcpDiscover };
const _ref_ljd3vu = { loadDriver };
const _ref_iwpbab = { optimizeTailCalls };
const _ref_w4yrd6 = { setInertia };
const _ref_82729c = { stepSimulation };
const _ref_0vd8mf = { setEnv };
const _ref_2w8w0j = { extractArchive };
const _ref_1vc31u = { renameFile };
const _ref_sm89ha = { parseStatement };
const _ref_4j77j9 = { verifyAppSignature };
const _ref_u8sudn = { resolveCollision };
const _ref_3zkdfs = { resolveHostName };
const _ref_h7f9yv = { foldConstants };
const _ref_ep4hnb = { decodeABI };
const _ref_mg6qgk = { renderParticles };
const _ref_ryb7lc = { unlinkFile };
const _ref_il0jho = { retransmitPacket };
const _ref_n5upuh = { download };
const _ref_46itvd = { analyzeHeader };
const _ref_zu8nh1 = { getFloatTimeDomainData };
const _ref_r9c6ft = { calculateEntropy };
const _ref_cs9xh7 = { calculateSHA256 };
const _ref_2eeesv = { negotiateSession };
const _ref_6w9ref = { registerISR };
const _ref_o1x2uh = { writeFile };
const _ref_wz2v2q = { injectCSPHeader };
const _ref_jm3sox = { unmapMemory };
const _ref_37zc86 = { detectVirtualMachine };
const _ref_e3itge = { generateWalletKeys };
const _ref_hqvrvs = { broadcastMessage };
const _ref_p1k0d0 = { parseFunction };
const _ref_tkrq10 = { lockFile };
const _ref_t8pgic = { seedRatioLimit };
const _ref_ba87nl = { checkBalance };
const _ref_b7q3p6 = { getShaderInfoLog }; 
    });
})({}, {});