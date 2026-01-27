// ==UserScript==
// @name         气象继续教育（本地开发版_带音频提示）
// @license      MIT
// @namespace    http://tampermonkey.net/
// @version      3.65
// @description  气象学习综合工具：课程列表显示 + 视频播放控制 + 自动下一节 + 进度追踪 + 自动登录 + 登录配置用户名校验 + 详细日志记录 + 入职时间显示 + 登录重试机制 + 加密库加载超时处理 + 登录流程完整错误处理 + 登录日志优化 + 登录检测间隔修复 + 密码输入框加密显示 + 课程结束音频提示 + 语音播放配置选项
// @author       You
// @match        http://www.cmatc.cn/lms/app/lms/student/Userselectlesson/show.do*
// @match        http://www.cmatc.cn/lms/app/lms/student/Learn/enter.do*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/563110/%E6%B0%94%E8%B1%A1%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%EF%BC%88%E6%9C%AC%E5%9C%B0%E5%BC%80%E5%8F%91%E7%89%88_%E5%B8%A6%E9%9F%B3%E9%A2%91%E6%8F%90%E7%A4%BA%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/563110/%E6%B0%94%E8%B1%A1%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%EF%BC%88%E6%9C%AC%E5%9C%B0%E5%BC%80%E5%8F%91%E7%89%88_%E5%B8%A6%E9%9F%B3%E9%A2%91%E6%8F%90%E7%A4%BA%EF%BC%89.meta.js
// ==/UserScript==
(function() {
    'use strict';
    console.log("111111111111")
    // 配置参数 - 从本地存储读取或使用默认值
    let CONFIG = {
        // 视频控制配置
        CHECK_INTERVAL: 1000, // 检查视频状态的间隔时间（毫秒）
        DEFAULT_DELAY: GM_getValue('defaultDelay', 8), // 默认延时（分钟），从本地存储读取
        UPDATE_INTERVAL: 1000, // 倒计时更新间隔（毫秒）

        // 登录检测间隔（分钟）
        SESSION_KEEPALIVE_MIN: GM_getValue('sessionKeepaliveMin', 5), // 最小间隔（分钟），从本地存储读取
        SESSION_KEEPALIVE_MAX: GM_getValue('sessionKeepaliveMax', 8), // 最大间隔（分钟），从本地存储读取

        // 保持会话的请求URL列表，随机切换
        SESSION_KEEPALIVE_URLS: [
            'http://www.cmatc.cn/lms/app/lms/student/Userdashboardinfo/show.do', // 学院首页
            'http://www.cmatc.cn/lms/app/lms/lesson/Lesson/lookupLessonlist.do', // 资源中心
            'http://www.cmatc.cn/lms/app/tms/sfi/StudyContent/year.do', // 个人中心
            'http://www.cmatc.cn/lms/app/appsecurity/user/Student/self.do' // 个人信息
        ],

        // 日志显示配置
        LOG_LEVEL: GM_getValue('logLevel', 'simple'), // 日志级别，从本地存储读取
        SHOW_LEARN_TIME_LOGS: true, // 是否显示视频学习播放提交日志
        LOG_RECORD_HOURS: 12, // 登录日志记录时长（小时），只保留最近N小时的记录

        // 自动播放配置
        AUTO_PLAY_NEXT: GM_getValue('autoPlayNext', true), // 是否自动播放下一节
        AUTO_PLAY_DELAY: GM_getValue('autoPlayDelay', 10), // 自动播放下一节的延迟时间（秒），从本地存储读取
        SKIP_COMPLETED: GM_getValue('skipCompleted', true), // 是否跳过已完成的视频

        // 语音播放配置
        VOICE_ALERT_ENABLED: GM_getValue('voiceAlertEnabled', true), // 是否启用语音提醒
        VOICE_ALERT_COUNT: GM_getValue('voiceAlertCount', 5), // 语音提醒播放次数

        // 调试配置
        DEBUG_MODE: GM_getValue('debugMode', false), // 是否开启调试模式

        // 登录相关配置
        CAS_LOGIN_URL: 'http://www.cmatc.cn/sso/login?service=http%3A%2F%2Fwww.cmatc.cn%2Flms%2Fj_spring_cas_security_check',
        DEFAULT_TARGET_URL: 'http://www.cmatc.cn/lms/app/lms/student/Userdashboardinfo/show.do',
        TARGET_URL: 'http://www.cmatc.cn/lms/app/lms/student/Userdashboardinfo/show.do',

        // 加密配置
        ENCRYPTION: {
            AES_KEY: 'AESCODER20200917', // AES加密密钥
            RSA_PUBLIC_KEY: '-----BEGIN PUBLIC KEY-----' +
                            'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAqCvtrtBBeP/LIO6VtFAUItx9Dwi9lXRX' +
                            'sSHT8C9p/yQ9FaUjB8YQTI7FL/HxggTU+P61A3a17GK23Whm4VNkriIDJZVd7opqnGzGC0XAdeml' +
                            'LCxmutZIypbUEhQmd68pZ+74e6QH2lu/lcukFFSdeI6p5IaWAUgvOjzPGUCZLKuABfhw8LoOmcFW' +
                            'LgPMQy6BZheKBqiLvFTx5eX9VbzaPCfZsSCxPRXb4snL5QyIbtBppamPW5TkUcGPECMNdbpfbIoX' +
                            'LBGhcxqrYEGNtXEwu47eOUBLbPPrE0o5KZ7sw3b1LepoxH3MXKpDHcBg1n3jUreE5ZfcNLX1GWKs' +
                            'eyNQiQIDAQAB' +
                            '-----END PUBLIC KEY-----'
        },

        // 默认登录参数
        DEFAULT_LOGIN_PARAMS: {
            lt: 'LT-13658691-nZXkDa1POWQLAxmEBreqde6DHjWYg1',
            execution: 'e1s1',
            _eventId: 'submit'
        },

        // 登录信息（明文，将在登录时进行加密）
        LOGIN_INFO: {
            username: GM_getValue('username', ''), // 用户ID（明文）
            password: GM_getValue('password', '')  // 密码（明文）
        }
    };

    // 全局变量
    let currentPageType = ''; // 当前页面类型：'courseList' 或 'videoPlay'
    let videoElement = null;
    let videoDuration = 0; // 视频总时长（秒）
    let remainingTime = 0; // 剩余倒计时时间（秒）
    let countdownInterval = null;
    let isCountdownRunning = false;
    let initialPlaybackTime = 0; // 记录倒计时开始时的播放时间
    let delayMinutes = GM_getValue('delayMinutes', CONFIG.DEFAULT_DELAY); // 存储当前设置的延时（分钟），从本地存储读取
    let isVideoEnded = false; // 标记视频是否已结束
    let countdownStartTime = 0; // 倒计时开始时间戳
    let totalLearntime = 0; // 累计学习时长（秒）
    let broadcastChannel = null; // 用于页面间通信
    let lastSentProgress = -1; // 上一次发送的进度，用于限制发送频率
    let isCourseCompleted = false; // 标记课程是否已完成（进度达到100%）
    let courseAlertAudio = null; // 课程结束提示音频对象
    let audioPlayCount = 0; // 音频播放次数计数器
    const MAX_AUDIO_PLAYS = 5; // 最大播放次数（默认5次）
    
    // 播放课程结束提示音频
    function playCourseAlert() {
        try {
            // 检查是否启用了语音提醒
            if (!CONFIG.VOICE_ALERT_ENABLED) {
                console.log('语音提醒已禁用，跳过播放');
                return;
            }
            
            // 检查播放次数是否已达到最大值
            if (audioPlayCount >= CONFIG.VOICE_ALERT_COUNT) {
                console.log(`课程结束提示音频已播放${audioPlayCount}次，已达到最大播放次数${CONFIG.VOICE_ALERT_COUNT}`);
                return;
            }
            
            // 如果音频对象不存在，创建一个新的Audio对象
            if (!courseAlertAudio) {
                // 使用base64编码的音频数据，适合线上版使用
                // 课程提示音频base64编码（用于嵌入到JS代码中）
                const COURSE_ALERT_MP3 = 'data:audio/mp3;base64,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qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq//NkxHwAAANIAAAAAKqqqqqqqqpMQU1FMy4xMDCqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq//NkxHwAAANIAAAAAKqqqqqqqqpMQU1FMy4xMDCqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq//NkxHwAAANIAAAAAKqqqqqqqqpMQU1FMy4xMDCqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq//NkxHwAAANIAAAAAKqqqqqqqqpMQU1FMy4xMDCqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq//NkxHwAAANIAAAAAKqqqqqqqqpMQU1FMy4xMDCqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq//NkxHwAAANIAAAAAKqqqqqqqqpMQU1FMy4xMDCqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq//NkxHwAAANIAAAAAKqqqqqqqqpMQU1FMy4xMDCqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq//NkxHwAAANIAAAAAKqqqqqqqqpMQU1FMy4xMDCqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq//NkxHwAAANIAAAAAKqqqqqqqqpMQU1FMy4xMDCqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq//NkxHwAAANIAAAAAKqqqqqqqqpMQU1FMy4xMDCqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq//NkxHwAAANIAAAAAKqqqqqqqqpMQU1FMy4xMDCqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq//NkxHwAAANIAAAAAKqqqqqqqqpMQU1FMy4xMDCqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq//NkxHwAAANIAAAAAKqqqqqqqqpMQU1FMy4xMDCqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq//NkxHwAAANIAAAAAKqqqqqqqqpMQU1FMy4xMDCqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq//NkxHwAAANIAAAAAKqqqqqqqqpMQU1FMy4xMDCqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq//NkxHwAAANIAAAAAKqqqqqqqqpMQU1FMy4xMDCqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq//NkxHwAAANIAAAAAKqqqqqqqqpMQU1FMy4xMDCqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq//NkxHwAAANIAAAAAKqqqqqqqqpMQU1FMy4xMDCqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq//NkxHwAAANIAAAAAKqqqqqqqqpMQU1FMy4xMDCqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq//NkxHwAAANIAAAAAKqqqqqqqqpMQU1FMy4xMDCqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq//NkxHwAAANIAAAAAKqqqqqqqqpMQU1FMy4xMDCqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq//NkxHwAAANIAAAAAKqqqqqqqqpMQU1FMy4xMDCqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq//NkxHwAAANIAAAAAKqqqqqqqqpMQU1FMy4xMDCqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq//NkxHwAAANIAAAAAKqqqqqqqqpMQU1FMy4xMDCqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq//NkxHwAAANIAAAAAKqqqqqqqqpMQU1FMy4xMDCqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq//NkxHwAAANIAAAAAKqqqqqqqqpMQU1FMy4xMDCqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq//NkxHwAAANIAAAAAKqqqqqqqqpMQU1FMy4xMDCqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq//NkxHwAAANIAAAAAKqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq';

                courseAlertAudio = new Audio(COURSE_ALERT_MP3);
                console.log('已创建课程提示音频对象（使用base64音频）');
            }
            
            // 播放音频
            courseAlertAudio.play().then(() => {
                audioPlayCount++;
                console.log(`课程结束提示音频已播放${audioPlayCount}/${CONFIG.VOICE_ALERT_COUNT}次`);
            }).catch(error => {
                console.error('播放课程提示音频失败:', error);
                // 如果播放失败，尝试重新创建Audio对象
                courseAlertAudio = null;
            });
        } catch (error) {
            console.error('处理课程提示音频时发生错误:', error);
        }
    }

    // 课程相关变量
    let currentCourseIndex = -1; // 当前课程索引
    let courseList = []; // 课程列表

    // 日志去重和时间管理
    let lastLogTime = 0;
    let lastLogContent = '';

    // 会话管理变量
    let sessionStartTime = Date.now(); // 会话开始时间
    let isSessionExpired = false; // 会话是否已过期

    // 学习进度管理变量
    let isProgressReached100 = false; // 进度是否已达到100%

    // 自动登录相关变量
    let loginAttempted = false; // 是否已尝试登录
    let isPanelCollapsed = false; // 面板是否折叠

    // 检测当前页面类型
    function detectPageType() {
        const currentUrl = window.location.href;

        // 明确的课程列表页面
        if (currentUrl.includes('Userselectlesson/show.do')) {
            return 'courseList';
        }

        // 明确的Learn/enter.do页面，直接标记为videoPlay
        if (currentUrl.includes('Learn/enter.do')) {
            return 'videoPlay';
        }

        return 'unknown';
    }

    // 加密功能实现
    // AES加密相关函数
    function hexToBytes(hex) {
        const bytes = [];
        for (let i = 0; i < hex.length; i += 2) {
            bytes.push(parseInt(hex.substr(i, 2), 16));
        }
        return bytes;
    }

    function bytesToHex(bytes) {
        const hex = [];
        for (let i = 0; i < bytes.length; i++) {
            const current = bytes[i] < 0 ? bytes[i] + 256 : bytes[i];
            hex.push((current >>> 4).toString(16));
            hex.push((current & 0xF).toString(16));
        }
        return hex.join('');
    }

    function pkcs7Pad(data, blockSize) {
        const padLength = blockSize - (data.length % blockSize);
        const pad = new Uint8Array(padLength).fill(padLength);
        const result = new Uint8Array(data.length + padLength);
        result.set(data);
        result.set(pad, data.length);
        return result;
    }

    // 简化的AES-ECB加密实现（使用CryptoJS的API风格）
    function AesEcbEncrypt(text, key) {
        // 这里使用window.CryptoJS，如果页面中没有加载，我们需要实现简单的AES加密
        // 检查页面中是否有CryptoJS可用
        if (typeof CryptoJS !== 'undefined') {
            const keyBytes = CryptoJS.enc.Utf8.parse(key);
            const textBytes = CryptoJS.enc.Utf8.parse(text);
            const encrypted = CryptoJS.AES.encrypt(textBytes, keyBytes, {
                mode: CryptoJS.mode.ECB,
                padding: CryptoJS.pad.Pkcs7
            });
            return encrypted.toString();
        } else {
            log('页面中未找到CryptoJS，无法进行AES加密', 'error');
            // 这里可以添加简单的AES实现，但考虑到复杂性，我们暂时返回原始文本
            return text;
        }
    }

    // RSA加密相关函数
    function b64ToUint6(nChr) {
        return nChr > 64 && nChr < 91 ? nChr - 65 : nChr > 96 && nChr < 123 ? nChr - 71 : nChr > 47 && nChr < 58 ? nChr + 4 : nChr === 43 ? 62 : nChr === 47 ? 63 : 0;
    }

    function base64DecToArr(sBase64, nBlocksSize) {
        const sB64Enc = sBase64.replace(/[^A-Za-z0-9+/]/g, '');
        const nInLen = sB64Enc.length;
        const nOutLen = nBlocksSize ? Math.ceil((nInLen * 3 + 1 >> 2) / nBlocksSize) * nBlocksSize : nInLen * 3 + 1 >> 2;
        const taBytes = new Uint8Array(nOutLen);
        let nMod3, nMod4, nUint24 = 0, nOutIdx = 0, nInIdx = 0;
        while (nInIdx < nInLen) {
            nMod4 = nInIdx & 3;
            nUint24 |= b64ToUint6(sB64Enc.charCodeAt(nInIdx++)) << 18 - 6 * nMod4;
            if (nMod4 === 3 || nInLen - nInIdx === 0) {
                nMod3 = 3 & nUint24;
                nOutIdx += nMod3 + 1;
                taBytes[nOutIdx - 3] = nUint24 >>> 16;
                taBytes[nOutIdx - 2] = nUint24 >>> 8 & 0xFF;
                taBytes[nOutIdx - 1] = nUint24 & 0xFF;
                nUint24 = 0;
            }
        }
        return taBytes;
    }

    // 简化的RSA加密实现
    function RsaEncrypt(text, publicKey) {
        // 检查页面中是否有JSEncrypt可用
        if (typeof JSEncrypt !== 'undefined') {
            const rsa = new JSEncrypt();
            rsa.setPublicKey(publicKey);
            return rsa.encrypt(text);
        } else if (typeof RSAClient !== 'undefined') {
            // 检查页面中是否有RSAClient可用
            const rsaClient = new RSAClient();
            return rsaClient.encrypt(text);
        } else {
            log('页面中未找到JSEncrypt或RSAClient，无法进行RSA加密', 'error');
            // 这里可以添加简单的RSA实现，但考虑到复杂性，我们暂时返回原始文本
            return text;
        }
    }

    // 完整的登录参数加密流程
    function encryptLoginParams(username, password) {
        log('开始加密登录参数', 'info');

        // 1. 使用AES加密用户名和密码
        const encryptedUsername = AesEcbEncrypt(username, CONFIG.ENCRYPTION.AES_KEY);
        const encryptedPassword = AesEcbEncrypt(password, CONFIG.ENCRYPTION.AES_KEY);

        log('AES加密完成', 'info');

        // 2. 使用RSA加密AES加密后的结果
        const finalUsername = RsaEncrypt(encryptedUsername, CONFIG.ENCRYPTION.RSA_PUBLIC_KEY);
        const finalPassword = RsaEncrypt(encryptedPassword, CONFIG.ENCRYPTION.RSA_PUBLIC_KEY);

        log('RSA加密完成', 'info');

        return { username: finalUsername, password: finalPassword };
    }

    // 日志函数
    function log(message, type = 'info', showInPanel = false) {
        const now = Date.now();
        const timestamp = new Date().toLocaleTimeString('zh-CN');
        const prefix = {
            'info': 'ℹ️',
            'success': '✅',
            'error': '❌',
            'warn': '⚠️'
        }[type] || 'ℹ️';

        // 1. 深度清理消息内容，移除所有可能包含的时间戳、前缀和特殊字符
        let cleanMessage = message;
        
        // 移除各种可能的前缀格式
        const prefixPatterns = [
            // 完整格式：19:14:40 - ✅ 19:14:40 - 消息
            /^\d{2}:\d{2}:\d{2}\s*-\s*[✅ℹ️❌⚠️]\s*\d{2}:\d{2}:\d{2}\s*-\s*/,
            // 普通格式：19:14:40 - ✅ 消息
            /^\d{2}:\d{2}:\d{2}\s*-\s*[✅ℹ️❌⚠️]\s*(-\s*)?/,
            // 只有前缀：✅ 消息
            /^[✅ℹ️❌⚠️]\s*(-\s*)?/,
            // 调试格式：📊  消息
            /^[📊⏯️⏭️⚠️❌✅ℹ️]\s*/
        ];
        
        prefixPatterns.forEach(pattern => {
            cleanMessage = cleanMessage.replace(pattern, '').trim();
        });

        // 2. 检查是否是重复日志：相同消息+相同类型+相同showInPanel，1秒内只允许出现一次
        const logKey = `${cleanMessage}_${type}_${showInPanel}`;
        const isDuplicate = (now - lastLogTime < 1000) && (lastLogContent === logKey);
        
        if (isDuplicate) {
            console.log(`跳过重复日志: ${cleanMessage}`);
            return; // 跳过重复日志
        }

        // 3. 更新最后日志时间和内容
        lastLogTime = now;
        lastLogContent = logKey;

        // 4. 生成最终日志消息
        const finalLogMessage = `${prefix} ${timestamp} - ${cleanMessage}`;
        console.log(finalLogMessage);

        // 5. 只在关键步骤将日志显示到右侧面板日志
        if (showInPanel) {
            const logArea = document.getElementById('learn-time-log');
            if (logArea) {
                // 检查面板中是否已经有完全相同的日志（包括时间戳）
                const existingLogs = Array.from(logArea.querySelectorAll('div'));
                const panelLogMessage = `${timestamp} - ${prefix} ${cleanMessage}`;
                
                // 检查是否已有完全相同的日志（包括时间戳）
                const hasExactSameLog = existingLogs.some(logEl => {
                    return logEl.textContent === panelLogMessage;
                });
                
                if (hasExactSameLog) {
                    console.log(`面板中已存在完全相同的日志，跳过添加: ${panelLogMessage}`);
                    return;
                }

                const logEntry = document.createElement('div');
                logEntry.style.cssText = `
                    margin: 2px 0;
                    padding: 3px 6px;
                    border-radius: 4px;
                    background: rgba(255, 255, 255, 0.85);
                    color: #333333;
                    font-size: 9px;
                    text-align: left;
                    line-height: 1.4;
                    box-shadow: 0 1px 1px rgba(0, 0, 0, 0.05);
                    transition: all 0.2s ease;
                    max-width: 100%;
                    overflow: hidden;
                    word-wrap: break-word;
                    white-space: normal;
                `;
                logEntry.textContent = panelLogMessage;

                logArea.appendChild(logEntry);
                logArea.scrollTop = logArea.scrollHeight;

                // 限制日志数量，最多保留20条，保持面板简洁
                const logEntries = logArea.querySelectorAll('div');
                if (logEntries.length > 20) {
                    logArea.removeChild(logEntries[0]);
                }
            }
        }
    }

    // 检测登录状态
    function checkLoginStatus() {
        log('开始检测登录状态', 'info', true);

        // 随机选择一个检测页面
        const checkUrl = CONFIG.SESSION_KEEPALIVE_URLS[Math.floor(Math.random() * CONFIG.SESSION_KEEPALIVE_URLS.length)];
        log(`检测登录状态，使用URL：${checkUrl}`, 'info', true);

        GM_xmlhttpRequest({
            method: 'GET',
            url: checkUrl,
            credentials: 'include',
            onload: function(response) {
                log(`检测响应状态码：${response.status}`, 'info', true);

                // 检测会话是否过期
                let sessionExpired = false;
                let reason = '';

                // 条件1: 响应状态为0
                if (response.status === 0) {
                    sessionExpired = true;
                    reason = '响应状态码为0';
                }

                // 条件2: 检查响应内容
                if (!sessionExpired && response.responseText) {
                    const text = response.responseText;

                    // 子条件1: title包含"登录入口"
                    const titleMatch = text.match(/<title>(.*?)<\/title>/i);
                    if (titleMatch && titleMatch[1].includes('登录入口')) {
                        sessionExpired = true;
                        reason = 'title包含"登录入口"';
                    }

                    // 子条件2: 包含登录字样
                    const loginPatterns = ['用户ID登录', '身份证登录', '手机号登录'];
                    for (const pattern of loginPatterns) {
                        if (text.includes(pattern)) {
                            sessionExpired = true;
                            reason = `包含"${pattern}"字样`;
                            break;
                        }
                    }

                    // 子条件3: 匹配登录相关HTML结构
                    const loginStructures = [
                        /<li[^>]*>用户ID登录<\/li>/i,
                        /<li[^>]*>身份证登录<\/li>/i,
                        /<li[^>]*>手机号登录<\/li>/i
                    ];

                    for (const pattern of loginStructures) {
                        if (pattern.test(text)) {
                            sessionExpired = true;
                            reason = '匹配登录相关HTML结构';
                            break;
                        }
                    }
                }

                if (sessionExpired) {
                    log(`登录已失效，原因：${reason}`, 'warn', true);
                    isSessionExpired = true;
                    handleLoginExpired();
                } else {
                    log('登录状态正常', 'success', true);
                    isSessionExpired = false;
                    loginAttempted = false;
                }
            },
            onerror: function(error) {
                log(`检测登录状态失败：${error.message}`, 'error', true);
            }
        });
    }

    // 保存当前进度到本地存储
    function saveCurrentProgress() {
        if (!videoElement) return;

        // 获取当前视频的播放位置
        const currentTime = videoElement.currentTime;

        // 获取当前的学习时长
        const courseIdentifier = parseCourseIdentifierFromUrl();
        const uniqueKey = `courseProgress_${courseIdentifier.lessonId}_${courseIdentifier.coursewareId}_${courseIdentifier.lessonGkey}`;
        const currentProgress = GM_getValue(uniqueKey, 0);

        // 保存登录前的进度信息
        const loginProgressKey = `loginBeforeProgress_${courseIdentifier.lessonId}_${courseIdentifier.coursewareId}_${courseIdentifier.lessonGkey}`;
        const progressInfo = {
            progress: currentProgress,
            currentTime: currentTime,
            totalLearntime: totalLearntime,
            timestamp: Date.now()
        };

        GM_setValue(loginProgressKey, JSON.stringify(progressInfo));
        log(`已保存登录前进度：${currentProgress}%，播放位置：${formatTime(currentTime)}`, 'info');
    }

    // 处理登录失效
    function handleLoginExpired() {
        // 保存当前进度
        saveCurrentProgress();

        log('登录已失效', 'warn', true);
        // 自动尝试登录
        attemptAutoLogin();
    }

    // 显示登录成功后10秒刷新页面的弹窗
    function showLoginSuccessRefreshDialog() {
        // 移除现有的任何弹窗
        const existingDialog = document.getElementById('login-success-refresh-dialog');
        if (existingDialog) {
            existingDialog.remove();
        }

        // 创建弹框容器
        const dialog = document.createElement('div');
        dialog.id = 'login-success-refresh-dialog';
        dialog.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(255, 255, 255, 0.95);
            color: #333333;
            padding: 25px 30px;
            border-radius: 15px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            z-index: 9999999;
            box-shadow: 0 12px 40px rgba(0, 0, 0, 0.2);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(200, 200, 200, 0.3);
            text-align: center;
            min-width: 350px;
            animation: entrance 0.5s ease-out;
        `;

        // 创建标题
        const title = document.createElement('div');
        title.style.cssText = `
            font-size: 18px;
            font-weight: 600;
            color: #10b981;
            margin-bottom: 15px;
        `;
        title.textContent = '✅ 登录成功';
        dialog.appendChild(title);

        // 创建刷新信息
        const message = document.createElement('div');
        message.style.cssText = `
            font-size: 14px;
            color: #4a5568;
            margin-bottom: 25px;
            line-height: 1.5;
        `;
        dialog.appendChild(message);

        // 创建倒计时显示
        const countdown = document.createElement('div');
        countdown.style.cssText = `
            font-size: 24px;
            font-weight: 700;
            color: #3b82f6;
            margin-bottom: 20px;
        `;
        dialog.appendChild(countdown);

        // 创建刷新按钮
        const refreshButton = document.createElement('button');
        refreshButton.style.cssText = `
            background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
            color: white;
            border: none;
            padding: 10px 25px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 600;
            transition: all 0.2s ease;
            box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
            margin-right: 10px;
        `;
        refreshButton.textContent = '立即刷新';
        refreshButton.addEventListener('click', () => {
            dialog.remove();
            window.location.reload();
        });
        dialog.appendChild(refreshButton);

        // 创建关闭按钮
        const closeButton = document.createElement('button');
        closeButton.style.cssText = `
            background: linear-gradient(135deg, #e2e8f0 0%, #cbd5e0 100%);
            color: #4a5568;
            border: none;
            padding: 10px 25px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 600;
            transition: all 0.2s ease;
            box-shadow: 0 4px 15px rgba(100, 100, 100, 0.1);
        `;
        closeButton.textContent = '稍后刷新';
        closeButton.addEventListener('click', () => {
            dialog.remove();
        });
        dialog.appendChild(closeButton);

        // 添加到页面
        document.body.appendChild(dialog);

        // 开始倒计时
        let seconds = 10;
        message.textContent = `登录成功！页面将在 ${seconds} 秒后自动刷新。`;
        countdown.textContent = `${seconds}`;

        // 将定时器声明提升到函数作用域，确保按钮事件监听器可以访问到
        let timer = setInterval(() => {
            seconds--;
            message.textContent = `登录成功！页面将在 ${seconds} 秒后自动刷新。`;
            countdown.textContent = `${seconds}`;

            if (seconds <= 0) {
                clearInterval(timer);
                dialog.remove();
                window.location.reload();
            }
        }, 1000);

        // 重新添加关闭按钮事件监听器，确保清除定时器
        closeButton.removeEventListener('click', closeButton.onclick);
        closeButton.addEventListener('click', () => {
            clearInterval(timer);
            dialog.remove();
        });
    }

    // 获取当前登录用户信息
    function getCurrentUserInfo(callback) {
        // 记录开始请求用户信息
        log('开始请求用户信息页获取当前登录用户信息', 'info', true);

        GM_xmlhttpRequest({
            method: 'GET',
            url: 'http://www.cmatc.cn/lms/app/appsecurity/user/Student/self.do',
            credentials: 'include',
            onload: function(response) {
                if (response.status !== 200) {
                    const errorMsg = '获取个人信息失败，状态码：' + response.status;
                    log(errorMsg, 'error', true);
                    callback(null, errorMsg);
                    return;
                }

                const html = response.responseText;

                // 检查是否登录状态
                if (html.includes('用户ID登录') || html.includes('身份证登录') || html.includes('手机号登录')) {
                    const errorMsg = '当前未登录或登录已失效';
                    log(errorMsg, 'warn', true);
                    callback(null, errorMsg);
                    return;
                }

                // 解析用户名
                const usernameMatch = html.match(/<li><span>用户名<\/span>([^&]+)&nbsp;<\/li>/i);
                if (!usernameMatch) {
                    const errorMsg = '无法解析用户名';
                    log(errorMsg, 'error', true);
                    callback(null, errorMsg);
                    return;
                }

                const username = usernameMatch[1].trim();

                // 解析员工姓名
                const employeeNameMatch = html.match(/<li><span>员工姓名<\/span>([^&]+)&nbsp;<\/li>/i);
                const employeeName = employeeNameMatch ? employeeNameMatch[1].trim() : '';

                // 解析入职时间
                const hireDateMatch = html.match(/<li><span>入职时间<\/span>([^&]+)&nbsp;<\/li>/i);
                const hireDate = hireDateMatch ? hireDateMatch[1].trim() : '';

                // 记录解析结果到面板 - 这是关键日志，确保用户能看到
                log(`✅ 获取到当前登录用户信息：员工姓名=${employeeName}，用户名=${username}，入职时间=${hireDate}`, 'success', true);

                callback({ username: username, employeeName: employeeName }, null);
            },
            onerror: function(error) {
                const errorMsg = '获取个人信息失败：' + error.message;
                log(errorMsg, 'error', true);
                callback(null, errorMsg);
            }
        });
    }

    // 尝试自动登录
    function attemptAutoLogin() {
        log('开始尝试自动登录', 'info', true);

        // 从本地存储获取登录信息，如果本地存储没有则使用配置中的默认值
        let username = GM_getValue('username', CONFIG.LOGIN_INFO.username);
        let password = GM_getValue('password', CONFIG.LOGIN_INFO.password);

        // 显示用户名和部分密码到日志面板
        const maskedPassword = password.length > 4 ? password.substring(0, 2) + '*'.repeat(password.length - 4) + password.substring(password.length - 2) : password;
        log(`使用用户名: ${username}，密码: ${maskedPassword} 进行登录`, 'info', true);

        if (!username || !password) {
            log('登录信息不完整，请先在配置中设置用户名和密码', 'error', true);
            // 记录登录失败日志
            recordLoginLog(false);
            return;
        }

        // 检查当前页面是否是登录页面
        const isLoginPage = window.location.href.includes('sso/login');

        if (isLoginPage) {
            // 已经在登录页面，直接执行登录操作
            log('当前已是登录页面，开始执行登录操作', 'info');
            performLoginOnLoginPage(username, password);
        } else {
            // 不是登录页面，动态加载加密库然后执行登录
            log('当前不是登录页面，正在处理登录请求', 'info');

            // 保存当前页面URL，登录成功后返回
            CONFIG.TARGET_URL = window.location.href;
            log(`已保存当前页面URL`, 'info');

            // 动态加载加密库
            loadEncryptionLibraries(function() {
                log('加密库加载完成，开始执行登录操作', 'info');

                // 1. 首先获取登录页面的HTML内容，提取必要的参数
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: CONFIG.CAS_LOGIN_URL,
                    credentials: 'include',
                    onload: function(response) {
                        log('获取登录页面成功，开始处理登录请求', 'info');

                        // 从登录页面HTML中提取必要的参数
                        const html = response.responseText;

                        // 提取lt参数
                        const ltMatch = html.match(/name="lt"\s+value="([^"]+)"/i);
                        let lt = ltMatch ? ltMatch[1] : '';

                        // 提取execution参数
                        const executionMatch = html.match(/name="execution"\s+value="([^"]+)"/i);
                        let execution = executionMatch ? executionMatch[1] : 'e1s1';

                        // 提取_eventId参数（通常固定为submit）
                        const eventIdMatch = html.match(/name="_eventId"\s+value="([^"]+)"/i);
                        const _eventId = eventIdMatch ? eventIdMatch[1] : 'submit';

                        // 使用默认参数，如果提取失败
                        if (!lt) {
                            // 使用配置中的默认登录参数
                            lt = CONFIG.DEFAULT_LOGIN_PARAMS.lt;
                            execution = CONFIG.DEFAULT_LOGIN_PARAMS.execution;
                            log(`未找到lt参数，使用默认值`, 'warn');
                        }

                        // 2. 动态加密登录参数
                        const encryptedParams = encryptLoginParams(username, password);

                        // 3. 构建登录请求参数
                        const loginParams = new URLSearchParams();
                        loginParams.append('username', encryptedParams.username);
                        loginParams.append('password', encryptedParams.password);
                        loginParams.append('lt', lt);
                        loginParams.append('execution', execution);
                        loginParams.append('_eventId', _eventId);

                        // 4. 发送登录POST请求
                        GM_xmlhttpRequest({
                            method: 'POST',
                            url: CONFIG.CAS_LOGIN_URL,
                            headers: {
                                'Content-Type': 'application/x-www-form-urlencoded',
                                'Referer': CONFIG.CAS_LOGIN_URL
                            },
                            data: loginParams.toString(),
                            credentials: 'include',
                            onload: function(loginResponse) {
                                log(`登录请求响应状态：${loginResponse.status}`);
                                log(`登录请求响应内容长度：${loginResponse.responseText.length}`, 'info');

                                // 检查登录请求响应是否包含登录成功的指示
                                const loginResponseText = loginResponse.responseText;
                                let isLoginRequestSuccessful = false;

                                // 检查响应状态码
                                if (loginResponse.status === 302 || loginResponse.status === 301) {
                                    // 重定向通常表示登录成功
                                    isLoginRequestSuccessful = true;
                                    log(`登录请求重定向，可能登录成功`, 'info');
                                } else if (loginResponse.status === 200) {
                                    // 检查响应内容是否包含登录成功的特征
                                    const loginSuccessPatterns = ['登录成功', 'success', 'redirecting'];
                                    for (const pattern of loginSuccessPatterns) {
                                        if (loginResponseText.toLowerCase().includes(pattern)) {
                                            isLoginRequestSuccessful = true;
                                            log(`登录请求响应包含成功特征，可能登录成功`, 'info');
                                            break;
                                        }
                                    }

                                    // 检查响应内容是否不包含登录表单
                                    if (!isLoginRequestSuccessful && !loginResponseText.includes('用户ID登录') && !loginResponseText.includes('密码')) {
                                        isLoginRequestSuccessful = true;
                                        log(`登录请求响应不包含登录表单，可能登录成功`, 'info');
                                    }
                                }

                                log(`登录请求已发送，正在验证登录是否成功`, 'info');
                                verifyLoginSuccess();
                            },
                            onerror: function(error) {
                                log(`登录请求发生错误：${error.message}`, 'error');
                                // 记录登录失败日志
                                recordLoginLog(false);
                                verifyLoginSuccess();
                            }
                        });
                    },
                    onerror: function(error) {
                        log(`获取登录页面失败：${error.message}`, 'error');
                        // 记录登录失败日志
                        recordLoginLog(false);
                    }
                });
            });
        }
    }

    // 在登录页面执行登录
    function performLoginOnLoginPage(username, password) {
        // 等待页面加载完成，确保加密库已经加载
        setTimeout(function() {
            log('开始在登录页面上执行登录操作', 'info', true);

            // 提取登录参数
            const ltElement = document.querySelector('input[name="lt"]');
            const executionElement = document.querySelector('input[name="execution"]');

            if (!ltElement || !executionElement) {
                log('未找到登录参数，可能页面未完全加载', 'error', true);
                // 记录登录失败日志
                recordLoginLog(false);
                return;
            }

            // 填充用户名和密码
            const usernameInput = document.querySelector('input[name="username"]');
            const passwordInput = document.querySelector('input[name="password"]');

            if (!usernameInput || !passwordInput) {
                log('未找到用户名或密码输入框', 'error', true);
                // 记录登录失败日志
                recordLoginLog(false);
                return;
            }

            usernameInput.value = username;
            passwordInput.value = password;

            log('已填充用户名和密码，准备触发登录', 'info', true);

            // 触发登录
            if (typeof dologin === 'function') {
                log('找到dologin函数，正在调用', 'info');
                dologin();
            } else {
                // 方法2：尝试点击登录按钮
                const loginBtn = document.querySelector('.btn-submit');
                if (loginBtn) {
                    log('找到登录按钮，正在点击', 'info');
                    loginBtn.click();
                } else {
                    // 方法3：尝试提交表单作为备选方案
                    const loginForm = document.querySelector('form');
                    if (loginForm) {
                        log('找到登录表单，正在提交', 'info');
                        loginForm.submit();
                    } else {
                        log('未找到登录按钮或表单，登录失败', 'error', true);
                        // 记录登录失败日志
                        recordLoginLog(false);
                    }
                }
            }
        }, 1000); // 等待1秒，确保页面完全加载
    }

    // 动态加载加密库
    function loadEncryptionLibraries(callback) {
        log('开始动态加载加密库');

        // 加密库文件URL列表
        const encryptionLibs = [
            'http://www.cmatc.cn/sso/js/aes.js',
            'http://www.cmatc.cn/sso/js/guard/rsa/jsencrypt.js',
            'http://www.cmatc.cn/sso/js/guard/rsa/rsaClient.js',
            'http://www.cmatc.cn/sso/js/cas.js'
        ];

        let loadedLibs = 0;
        const totalLibs = encryptionLibs.length;

        // 检查加密库是否已加载
        function checkLibs() {
            loadedLibs++;
            log(`已加载${loadedLibs}/${totalLibs}个加密库`);

            if (loadedLibs === totalLibs) {
                log('所有加密库加载完成');
                callback();
            }
        }

        // 加载每个加密库
        encryptionLibs.forEach(function(libUrl) {
            log(`正在加载加密库：${libUrl}`);

            const script = document.createElement('script');
            script.src = libUrl;
            script.onload = checkLibs;
            script.onerror = function() {
                log(`加载加密库失败：${libUrl}`, 'error');
                checkLibs();
            };

            document.head.appendChild(script);
        });
    }

    // 工具函数：获取当前日期（用于登录日志）
    function getCurrentDate() {
        // 使用toLocaleDateString获取本地日期，确保日期的准确性
        const now = new Date();
        return now.toLocaleDateString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        }).replace(/\//g, '-');
    }

    // 记录登录日志，只保留最近12小时的记录
    function recordLoginLog(success) {
        const now = new Date();
        const timestamp = now.toLocaleTimeString('zh-CN');
        const logMessage = `${timestamp} - 自动登录：${success ? '成功' : '失败'}`;

        // 使用固定key存储登录日志
        const loginLogKey = 'loginLogs';

        // 从本地存储获取登录日志数组，如果不存在则使用空数组
        const loginLogs = GM_getValue(loginLogKey, []);

        // 确保loginLogs是数组格式
        let logsArray = Array.isArray(loginLogs) ? loginLogs : [];

        // 为每条日志添加时间戳，用于过滤
        const logEntry = {
            message: logMessage,
            timestamp: now.getTime() // 使用时间戳便于比较
        };

        // 追加新的登录日志
        logsArray.push(logEntry);

        // 过滤掉超过LOG_RECORD_HOURS小时的日志
        const logRecordHours = CONFIG.LOG_RECORD_HOURS;
        const cutoffTime = now.getTime() - (logRecordHours * 60 * 60 * 1000);
        logsArray = logsArray.filter(log => log.timestamp >= cutoffTime);

        // 保存更新后的登录日志到GM_getValue
        GM_setValue(loginLogKey, logsArray);
        log(`已记录登录日志：${logMessage}`, 'info', true);
        console.log(`登录日志已保存到GM_getValue，key: ${loginLogKey}，共${logsArray.length}条记录`);
    }

    // 加载登录日志到面板
    function loadLoginLogToPanel() {
        console.log('开始加载登录日志');

        // 使用固定key获取登录日志
        const loginLogKey = 'loginLogs';

        // 从GM_getValue读取登录日志数组
        const loginLogs = GM_getValue(loginLogKey, []);

        console.log(`从GM_getValue读取登录日志，key: ${loginLogKey}，value: ${JSON.stringify(loginLogs)}`);

        // 确保loginLogs是数组格式
        let logsArray = Array.isArray(loginLogs) ? loginLogs : [];

        // 过滤掉超过LOG_RECORD_HOURS小时的日志，确保配置修改后能立即生效
        const now = new Date();
        const logRecordHours = CONFIG.LOG_RECORD_HOURS;
        const cutoffTime = now.getTime() - (logRecordHours * 60 * 60 * 1000);

        const filteredLogs = logsArray.filter(log => log.timestamp >= cutoffTime);

        // 如果过滤后的日志数量少于原数量，说明有日志被删除，需要保存回GM_getValue
        if (filteredLogs.length < logsArray.length) {
            console.log(`过滤掉了${logsArray.length - filteredLogs.length}条过期日志，当前配置保留${logRecordHours}小时`);
            GM_setValue(loginLogKey, filteredLogs);
            logsArray = filteredLogs;
        }

        if (logsArray.length > 0) {
            // 显示所有登录日志到面板，按时间顺序排列
            logsArray
                .sort((a, b) => a.timestamp - b.timestamp) // 按时间戳升序排列
                .forEach(logEntry => {
                    if (logEntry && logEntry.message) {
                        log(logEntry.message, 'info', true);
                    }
                });
            console.log(`登录日志已显示到面板，共${logsArray.length}条记录`);
        } else {
            console.log('未找到登录日志');
        }
    }

    // 验证登录是否成功
    function verifyLoginSuccess() {
        log('验证登录是否成功', 'info');

        // 发送请求到目标页面，验证登录是否成功
        GM_xmlhttpRequest({
            method: 'GET',
            url: CONFIG.TARGET_URL,
            credentials: 'include',
            onload: function(response) {
                log(`目标页面响应状态：${response.status}`);

                // 检测是否登录成功
                const text = response.responseText;
                let loginSuccess = false;

                // 条件1: 响应状态为200
                if (response.status === 200) {
                    // 条件2: 不包含登录页面特征
                    const loginPatterns = ['用户ID登录', '身份证登录', '手机号登录', '登录入口'];
                    let containsLoginPattern = false;

                    for (const pattern of loginPatterns) {
                        if (text.includes(pattern)) {
                            containsLoginPattern = true;
                            break;
                        }
                    }

                    // 条件3: 包含目标页面特征
                    const targetPatterns = ['个人中心', '学员首页', '学习记录'];
                    let containsTargetPattern = false;

                    for (const pattern of targetPatterns) {
                        if (text.includes(pattern)) {
                            containsTargetPattern = true;
                            break;
                        }
                    }

                    // 登录成功条件：不包含登录页面特征，或者包含目标页面特征
                    loginSuccess = !containsLoginPattern || containsTargetPattern;
                }

                if (loginSuccess) {
                    log('登录成功！', 'success', true);
                    isSessionExpired = false;
                    loginAttempted = false;

                    // 记录登录成功日志
                    recordLoginLog(true);

                    // 登录成功后，跳转到保存的URL或默认目标URL
                    const redirectUrl = CONFIG.TARGET_URL;
                    if (window.location.href !== redirectUrl) {
                        log(`登录成功，正在返回之前的页面`, 'success');
                        window.location.href = redirectUrl;
                    } else {
                        // 如果已经在目标页面，显示登录成功后10秒刷新页面的弹窗
                        showLoginSuccessRefreshDialog();
                    }
                } else {
                    log('登录失败，请手动登录', 'error', true);
                    isSessionExpired = true;

                    // 记录登录失败日志
                    recordLoginLog(false);
                }
            },
            onerror: function(error) {
                log(`验证登录失败：${error.message}`, 'error', true);
                isSessionExpired = true;
            }
        });
    }

    // 初始化广播频道
    function initBroadcastChannel() {
        broadcastChannel = new BroadcastChannel('cmc-video-learning');

        broadcastChannel.addEventListener('message', function(e) {
            const data = e.data;

            // 课程列表页面接收消息
            if (currentPageType === 'courseList') {
                if (data.type === 'videoCompleted') {
                    // 处理视频完成消息
                    console.log('收到视频完成消息:', data);
                    handleVideoCompleted(data);
                } else if (data.type === 'progressUpdate') {
                    // 处理进度更新消息
                    console.log('收到进度更新消息:', data);
                    updateCourseProgress(data);
                } else if (data.type === 'requestCourseList') {
                    // 收到请求课程列表消息，重新发送课程列表就绪消息
                    console.log('收到请求课程列表消息，重新发送课程列表就绪消息');
                    sendCourseListReadyMessage();
                }
            }

            // 视频播放页面接收消息
            if (currentPageType === 'videoPlay') {
                if (data.type === 'courseListReady') {
                    // 处理课程列表就绪消息
                    console.log('收到课程列表就绪消息:', data);

                    // 获取当前视频播放页的lessonId
                    const currentUrl = window.location.href;
                    const currentLessonId = currentUrl.match(/lessonId=(\d+)/)?.[1] || 'unknown';

                    // 只有当消息中的currentLessonId与当前视频播放页的lessonId一致时，才处理该消息
                    // 这样可以避免收到其他课程列表的消息
                    if (data.currentLessonId && currentLessonId && data.currentLessonId !== currentLessonId) {
                        console.log('收到的课程列表lessonId（', data.currentLessonId, '）与当前视频播放页lessonId（', currentLessonId, '）不一致，忽略该消息');
                        return;
                    }

                    // 只有当收到的课程列表数量大于当前课程列表数量，或者当前课程列表为空时，才更新课程列表
                    // 避免课程列表被覆盖为更小的列表
                    if (data.courseList.length > courseList.length || courseList.length === 0) {
                        courseList = data.courseList;
                        updateCurrentCourseIndex();
                        console.log('已更新课程列表，共', courseList.length, '个课程');
                        // 打印课程列表信息到控制台
                        console.log('课程列表详情:', courseList);

                        // 存储课程列表到本地存储，使用当前课程的lessonId作为前缀
                        const storageKey = `courseList_${currentLessonId}`;
                        GM_setValue(storageKey, JSON.stringify(courseList));
                        console.log('已将课程列表存储到本地存储，存储key:', storageKey);

                        // 更新课程列表显示
                        updateCourseListDisplay();
                    } else {
                        console.log('收到的课程列表数量（', data.courseList.length, '）不大于当前课程列表数量（', courseList.length, '），忽略该消息');
                    }
                }
            }
        });

        console.log('广播频道已初始化');
    }

    // 更新当前课程索引
    function updateCurrentCourseIndex() {
        if (courseList.length === 0) return;

        const currentUrl = window.location.href;
        for (let i = 0; i < courseList.length; i++) {
            if (currentUrl.includes(courseList[i].lessonId) &&
                currentUrl.includes(courseList[i].coursewareId)) {
                currentCourseIndex = i;
                console.log(`当前课程索引：${currentCourseIndex}，课程：${courseList[i].title}`);
                break;
            }
        }
    }

    // 处理视频完成消息，支持没有currentIndex但有lessonId的情况
    function handleVideoCompleted(data) {
        console.log('收到视频完成消息，准备处理：', data);

        // 只在课程列表页面显示课程完成提示，不再显示倒计时弹框和打开新窗口
        // 新视频的播放由视频播放页面自己处理
        console.log('视频播放页面会自行处理下一个视频播放，列表页面不做处理');

        // 如果没有找到下一个课程，显示课程完成提示
        if (currentPageType === 'courseList') {
            console.log('在列表页面收到视频完成消息，不执行自动播放操作');
        }
    }

    // 更新课程进度，只使用URL中的唯一标识符匹配，不使用标题匹配
    function updateCourseProgress(data) {
        const courseIdentifier = data.uniqueCourseTitle || data.courseTitle;
        console.log(`课程 ${courseIdentifier} 进度更新：${data.progress}%`);

        // 查找对应的课程项
        const courseItems = document.querySelectorAll('#course-list-content div[data-lesson-id]');
        let foundItem = null;

        // 只使用URL中的唯一标识符组合匹配课程：lessonId、coursewareId、lessonGkey
        // 不使用标题匹配，因为播放页标题可能相同
        if (data.lessonId && data.coursewareId) {
            console.log(`尝试使用唯一标识符匹配课程：lessonId=${data.lessonId}, coursewareId=${data.coursewareId}`);
            courseItems.forEach(item => {
                // 获取课程项的唯一标识符
                const itemLessonId = item.getAttribute('data-lesson-id');
                const itemCoursewareId = item.getAttribute('data-courseware-id');
                const itemLessonGkey = item.getAttribute('data-lesson-gkey');

                // 使用完整的唯一标识符组合匹配
                if (itemLessonId === data.lessonId && itemCoursewareId === data.coursewareId) {
                    // 如果有lessonGkey，也需要匹配
                    if (!data.lessonGkey || itemLessonGkey === data.lessonGkey) {
                        foundItem = item;
                        console.log(`找到匹配的课程项：lessonId=${itemLessonId}, coursewareId=${itemCoursewareId}`);
                    }
                }
            });
        }

        // 移除标题匹配作为备选方案，因为播放页标题可能相同
        /*
        // 2. 如果没有找到，使用课程标题匹配作为备选方案
        if (!foundItem) {
            console.log(`未找到匹配的唯一标识符，尝试使用标题匹配：${courseIdentifier}`);
            courseItems.forEach(item => {
                const itemText = item.textContent;
                // 使用更精确的匹配方式：包含完整标题或唯一标题
                if (itemText.includes(courseIdentifier) ||
                    (data.uniqueCourseTitle && itemText.includes(data.uniqueCourseTitle))) {
                    foundItem = item;
                    console.log(`找到匹配的课程项：${itemText}`);
                }
            });
        }
        */

        // 更新找到的课程项的进度
        if (foundItem) {
            // 更新进度条
            const progressBar = foundItem.querySelector('.progress-bar');
            const progressPercentage = foundItem.querySelector('.progress-percentage');

            if (progressBar && progressPercentage) {
                progressBar.style.width = `${data.progress}%`;
                progressPercentage.textContent = `${data.progress}%`;
                console.log(`已更新课程进度为 ${data.progress}%`);
            }
        } else {
            console.log(`未找到对应课程项，无法更新进度。课程信息：`, data);
            console.log(`当前页面课程项数量：${courseItems.length}`);
            // 显示所有课程项的唯一标识符，便于调试
            courseItems.forEach((item, index) => {
                const itemLessonId = item.getAttribute('data-lesson-id');
                const itemCoursewareId = item.getAttribute('data-courseware-id');
                const itemLessonGkey = item.getAttribute('data-lesson-gkey');
                console.log(`课程项 ${index + 1}：lessonId=${itemLessonId}, coursewareId=${itemCoursewareId}, lessonGkey=${itemLessonGkey}`);
            });
        }
    }

    // 发送视频完成消息，支持没有currentCourseIndex的情况
    function sendVideoCompletedMessage() {
        if (broadcastChannel) {
            // 准备消息数据
            const messageData = {
                type: 'videoCompleted',
                currentTime: Date.now()
            };

            // 如果有currentCourseIndex，添加到消息中
            if (currentCourseIndex !== -1) {
                messageData.currentIndex = currentCourseIndex;
            }

            // 添加课程唯一标识符，确保列表页能识别是哪个课程完成了
            const courseIdentifier = parseCourseIdentifierFromUrl();
            messageData.lessonId = courseIdentifier.lessonId;
            messageData.coursewareId = courseIdentifier.coursewareId;
            messageData.lessonGkey = courseIdentifier.lessonGkey;

            broadcastChannel.postMessage(messageData);
            console.log(`已发送视频完成消息，lessonId：${courseIdentifier.lessonId}`);
        }
    }

    // 添加窗口关闭事件监听，只有当课程真正完成时才发送视频完成消息
    function addWindowCloseListener() {
        window.addEventListener('beforeunload', function() {
            console.log('窗口即将关闭，检查课程是否已完成');
            if (isCourseCompleted) {
                console.log('课程已完成，发送视频完成消息');
                sendVideoCompletedMessage();
            } else {
                console.log('课程未完成，不发送视频完成消息');
            }
        });
    }

    // 从URL解析课程唯一标识符
    function parseCourseIdentifierFromUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        return {
            lessonId: urlParams.get('lessonId') || '',
            coursewareId: urlParams.get('coursewareId') || '',
            lessonGkey: urlParams.get('lessonGkey') || ''
        };
    }

    // 保存进度到本地存储，不发送广播消息
    function sendProgressUpdateMessage(progress) {
        // 本地保存课程进度
        const courseIdentifier = parseCourseIdentifierFromUrl();
        const uniqueKey = `courseProgress_${courseIdentifier.lessonId}_${courseIdentifier.coursewareId}_${courseIdentifier.lessonGkey}`;
        GM_setValue(uniqueKey, progress);
        console.log(`已保存课程进度：${progress}%，存储key：${uniqueKey}`);

        // 当进度达到100%时，标记课程已完成
        if (progress >= 100) {
            isCourseCompleted = true;
            console.log('课程已完成，进度达到100%');
        }

        // 更新本地课程列表中的进度
        if (currentCourseIndex !== -1 && courseList[currentCourseIndex]) {
            courseList[currentCourseIndex].progress = progress;
            console.log(`已更新本地课程列表中当前课程的进度为 ${progress}%`);
            // 更新课程列表显示
            updateCourseListDisplay();
        }
    }

    // 发送课程列表就绪消息
    function sendCourseListReadyMessage() {
        if (broadcastChannel && courseList.length > 0) {
            // 获取课程列表中第一个课程的lessonId作为当前lessonId
            // 避免从课程列表页面URL中获取，因为课程列表页面URL中没有lessonId参数
            const currentLessonId = courseList[0].lessonId || 'unknown';

            broadcastChannel.postMessage({
                type: 'courseListReady',
                courseList: courseList,
                currentLessonId: currentLessonId,
                currentTime: Date.now()
            });
            console.log('已发送课程列表就绪消息，使用第一个课程的lessonId:', currentLessonId);

            // 存储课程列表到本地存储，使用第一个课程的lessonId作为前缀，避免不同课程之间的冲突
            GM_setValue(`courseList_${currentLessonId}`, JSON.stringify(courseList));
            console.log('已将课程列表存储到本地存储，存储key:', `courseList_${currentLessonId}`);
        }
    }

    // 显示自动播放倒计时弹框
    function showAutoPlayCountdown(nextCourse, delaySeconds) {
        // 检查是否已存在弹框，如果存在则移除
        let countdownDialog = document.getElementById('auto-play-countdown');
        if (countdownDialog) {
            countdownDialog.remove();
        }

        // 创建弹框容器
        countdownDialog = document.createElement('div');
        countdownDialog.id = 'auto-play-countdown';
        countdownDialog.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(255, 255, 255, 0.95);
            color: #333333;
            padding: 25px 30px;
            border-radius: 15px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            z-index: 9999999;
            box-shadow: 0 12px 40px rgba(0, 0, 0, 0.2);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(200, 200, 200, 0.3);
            text-align: center;
            min-width: 350px;
            animation: entrance 0.5s ease-out;
        `;

        // 创建标题
        const title = document.createElement('div');
        title.style.cssText = `
            font-size: 18px;
            font-weight: 600;
            color: #2d3748;
            margin-bottom: 15px;
        `;
        title.textContent = '自动播放下一节';
        countdownDialog.appendChild(title);

        // 创建课程信息
        const courseInfo = document.createElement('div');
        courseInfo.style.cssText = `
            font-size: 14px;
            color: #4a5568;
            margin-bottom: 20px;
            line-height: 1.5;
        `;
        courseInfo.innerHTML = `将播放：<br><strong style="color: #667eea;">${nextCourse.title}</strong>`;
        countdownDialog.appendChild(courseInfo);

        // 创建倒计时显示
        const countdownDisplay = document.createElement('div');
        countdownDisplay.id = 'countdown-timer';
        countdownDisplay.style.cssText = `
            font-size: 48px;
            font-weight: 700;
            color: #667eea;
            margin-bottom: 25px;
            text-shadow: 0 2px 10px rgba(102, 126, 234, 0.3);
        `;
        countdownDisplay.textContent = delaySeconds;
        countdownDialog.appendChild(countdownDisplay);

        // 创建提示信息
        const message = document.createElement('div');
        message.style.cssText = `
            font-size: 13px;
            color: #718096;
            margin-bottom: 20px;
        `;
        message.textContent = '倒计时结束后将自动打开下一节视频';
        countdownDialog.appendChild(message);

        // 创建立即播放按钮
        const playNowButton = document.createElement('button');
        playNowButton.style.cssText = `
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            padding: 10px 25px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 600;
            transition: all 0.2s ease;
            box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
            margin-right: 10px;
        `;
        playNowButton.textContent = '立即播放';
        playNowButton.addEventListener('click', () => {
            clearInterval(countdownInterval);
            countdownDialog.remove();
            // 用户主动点击，在本标签打开新视频
            window.location.href = nextCourse.playUrl;
        });
        countdownDialog.appendChild(playNowButton);

        // 创建取消按钮
        const cancelButton = document.createElement('button');
        cancelButton.style.cssText = `
            background: linear-gradient(135deg, #e2e8f0 0%, #cbd5e0 100%);
            color: #4a5568;
            border: none;
            padding: 10px 25px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 600;
            transition: all 0.2s ease;
            box-shadow: 0 4px 15px rgba(100, 100, 100, 0.1);
        `;
        cancelButton.textContent = '取消';
        cancelButton.addEventListener('click', () => {
            clearInterval(countdownInterval);
            countdownDialog.remove();
        });
        countdownDialog.appendChild(cancelButton);

        // 开始倒计时
        let remainingSeconds = delaySeconds;
        const countdownInterval = setInterval(() => {
            remainingSeconds--;
            countdownDisplay.textContent = remainingSeconds;

            if (remainingSeconds <= 0) {
                clearInterval(countdownInterval);
                countdownDialog.remove();
                // 倒计时结束，尝试打开下一个视频
                // 使用setTimeout延迟，确保DOM操作完成
                setTimeout(() => {
                    try {
                        // 在本标签打开新视频
                        window.location.href = nextCourse.playUrl;
                    } catch (error) {
                        console.error('打开新标签页失败:', error);
                        alert('打开新标签页失败，请手动点击\'立即播放\'按钮');
                    }
                }, 100);
            }
        }, 1000);

        // 添加到页面
        document.body.appendChild(countdownDialog);
    }

    // 显示课程完成提示
    function showCourseCompletedMessage() {
        // 检查是否已存在弹框，如果存在则移除
        let completedDialog = document.getElementById('course-completed-dialog');
        if (completedDialog) {
            completedDialog.remove();
        }

        // 创建弹框容器
        completedDialog = document.createElement('div');
        completedDialog.id = 'course-completed-dialog';
        completedDialog.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(255, 255, 255, 0.95);
            color: #333333;
            padding: 30px 40px;
            border-radius: 15px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            z-index: 9999999;
            box-shadow: 0 12px 40px rgba(0, 0, 0, 0.2);
            backdrop-filter: blur(10px);
            border: 2px solid #667eea;
            text-align: center;
            min-width: 400px;
            animation: entrance 0.5s ease-out;
        `;
        
        // 播放课程结束提示音频，并设置循环播放
        playCourseAlert();
        // 设置音频循环播放，每隔5秒播放一次
        const audioInterval = setInterval(() => {
            // 检查弹框是否还存在，存在则继续播放音频
            const dialog = document.getElementById('course-completed-dialog');
            if (dialog) {
                playCourseAlert();
            } else {
                // 弹框已关闭，清除定时器
                clearInterval(audioInterval);
                console.log('已清除课程提示音频循环播放定时器');
            }
        }, 5000); // 5秒间隔

        // 创建标题
        const title = document.createElement('div');
        title.style.cssText = `
            font-size: 20px;
            font-weight: 700;
            color: #2d3748;
            margin-bottom: 20px;
        `;
        title.textContent = '🎉 课程学习完成';
        completedDialog.appendChild(title);

        // 创建完成信息
        const message = document.createElement('div');
        message.style.cssText = `
            font-size: 16px;
            color: #4a5568;
            margin-bottom: 25px;
            line-height: 1.6;
        `;
        message.textContent = '恭喜您已完成本课程的所有视频学习！';
        completedDialog.appendChild(message);

        // 创建关闭按钮（虽然不消失，但还是提供关闭选项）
        const closeButton = document.createElement('button');
        closeButton.style.cssText = `
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            padding: 10px 25px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 600;
            transition: all 0.2s ease;
            box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
        `;
        closeButton.textContent = '知道了';
        closeButton.addEventListener('click', () => {
            completedDialog.remove();
            // 关闭当前标签页
            window.close();
        });
        completedDialog.appendChild(closeButton);

        // 添加到页面
        document.body.appendChild(completedDialog);
    }

    // 显示会话过期提醒
    function showSessionExpiredMessage() {
        // 检查是否已存在弹框，如果存在则移除
        let expiredDialog = document.getElementById('session-expired-dialog');
        if (expiredDialog) {
            expiredDialog.remove();
        }

        // 创建弹框容器
        expiredDialog = document.createElement('div');
        expiredDialog.id = 'session-expired-dialog';
        expiredDialog.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(255, 255, 255, 0.95);
            color: #333333;
            padding: 25px 30px;
            border-radius: 15px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            z-index: 9999999;
            box-shadow: 0 12px 40px rgba(0, 0, 0, 0.2);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(200, 200, 200, 0.3);
            text-align: center;
            min-width: 350px;
            animation: entrance 0.5s ease-out;
        `;

        // 创建标题
        const title = document.createElement('div');
        title.style.cssText = `
            font-size: 18px;
            font-weight: 600;
            color: #dc2626;
            margin-bottom: 15px;
        `;
        title.textContent = '⚠️  登录已失效';
        expiredDialog.appendChild(title);

        // 创建过期信息
        const message = document.createElement('div');
        message.style.cssText = `
            font-size: 14px;
            color: #4a5568;
            margin-bottom: 25px;
            line-height: 1.5;
        `;
        message.textContent = '您的登录已失效，请重新登录后学习！';
        expiredDialog.appendChild(message);

        // 创建刷新按钮
        const refreshButton = document.createElement('button');
        refreshButton.style.cssText = `
            background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
            color: white;
            border: none;
            padding: 10px 25px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 600;
            transition: all 0.2s ease;
            box-shadow: 0 4px 15px rgba(239, 68, 68, 0.3);
            margin-right: 10px;
        `;
        refreshButton.textContent = '刷新页面';
        refreshButton.addEventListener('click', () => {
            expiredDialog.remove();
            // 刷新当前页面
            window.location.reload();
        });
        expiredDialog.appendChild(refreshButton);

        // 创建关闭按钮
        const closeButton = document.createElement('button');
        closeButton.style.cssText = `
            background: linear-gradient(135deg, #e2e8f0 0%, #cbd5e0 100%);
            color: #4a5568;
            border: none;
            padding: 10px 25px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 600;
            transition: all 0.2s ease;
            box-shadow: 0 4px 15px rgba(100, 100, 100, 0.1);
        `;
        closeButton.textContent = '稍后刷新';
        closeButton.addEventListener('click', () => {
            expiredDialog.remove();
        });
        expiredDialog.appendChild(closeButton);

        // 添加到页面
        document.body.appendChild(expiredDialog);
    }

    // 视频播放页面相关函数

    // 创建UI元素（视频播放页面）
    // 更新下一个待播放视频显示
    function updateCourseListDisplay() {
        const nextCourseContent = document.getElementById('next-course-content');
        if (!nextCourseContent) return;

        if (courseList.length === 0) {
            nextCourseContent.innerHTML = '<div style="color: #666; font-style: italic;">暂无下一个视频</div>';
            return;
        }

        // 查找下一个待播放视频
        let nextCourseIndex = -1;

        // 如果当前有课程在播放，查找下一个课程
        if (currentCourseIndex !== -1) {
            nextCourseIndex = currentCourseIndex + 1;

            // 如果启用了跳过已完成视频，寻找下一个未完成的视频
            if (CONFIG.SKIP_COMPLETED) {
                for (let i = nextCourseIndex; i < courseList.length; i++) {
                    const courseProgress = GM_getValue(`courseProgress_${courseList[i].lessonId}_${courseList[i].coursewareId}_${courseList[i].lessonGkey}`, 0);
                    if (courseProgress < 100) {
                        nextCourseIndex = i;
                        break;
                    }
                }
            }
        } else {
            // 如果没有当前课程，默认显示第一个课程
            nextCourseIndex = 0;
        }

        // 更新显示内容 - 使用翻页按钮代替待播放文字

        // 构建翻页按钮HTML
        let prevBtnHtml = '';
        let nextBtnHtml = '';

        // 构建完整的HTML
        let displayHtml = '';

        // 只有当有当前课程时，才显示正在播放信息和翻页按钮
        if (currentCourseIndex !== -1 && currentCourseIndex < courseList.length) {
            const currentCourse = courseList[currentCourseIndex];

            // 如果有上一个视频，显示上一页按钮
            if (currentCourseIndex > 0) {
                const prevCourse = courseList[currentCourseIndex - 1];
                // 获取上一个视频的进度
                const prevCourseProgress = GM_getValue(`courseProgress_${prevCourse.lessonId}_${prevCourse.coursewareId}_${prevCourse.lessonGkey}`, 0);
                prevBtnHtml = `<button onclick="javascript:window.location.href='${prevCourse.playUrl}';" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; padding: 3px 8px; border-radius: 4px; cursor: pointer; font-size: 9px; margin-right: 8px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2); transition: all 0.2s ease;">上一个 (${prevCourseProgress}%)</button>`;
            }

            // 如果有下一个视频，显示下一页按钮
            if (currentCourseIndex < courseList.length - 1) {
                // 如果启用了跳过已完成视频，寻找下一个未完成的视频
                let actualNextIndex = currentCourseIndex + 1;
                if (CONFIG.SKIP_COMPLETED) {
                    for (let i = actualNextIndex; i < courseList.length; i++) {
                        const courseProgress = GM_getValue(`courseProgress_${courseList[i].lessonId}_${courseList[i].coursewareId}_${courseList[i].lessonGkey}`, 0);
                        if (courseProgress < 100) {
                            actualNextIndex = i;
                            break;
                        }
                    }
                }

                // 检查实际下一个索引是否有效
                if (actualNextIndex < courseList.length) {
                    const nextCourseToShow = courseList[actualNextIndex];
                    // 获取下一个视频的进度
                    const nextCourseProgress = GM_getValue(`courseProgress_${nextCourseToShow.lessonId}_${nextCourseToShow.coursewareId}_${nextCourseToShow.lessonGkey}`, 0);
                    nextBtnHtml = `<button onclick="javascript:window.location.href='${nextCourseToShow.playUrl}';" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; padding: 3px 8px; border-radius: 4px; cursor: pointer; font-size: 9px; margin-left: 8px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2); transition: all 0.2s ease;">下一个 (${nextCourseProgress}%) </button>`;
                }
            }

            // 构建完整的HTML - 始终显示正在播放信息和可用的翻页按钮
            displayHtml = `
                <div style="display: flex; align-items: center; justify-content: center; margin: 5px 0; font-size: 10px;">
                    ${prevBtnHtml}
                    <div style="font-weight: 600; color: #48bb78; text-align: center;">正在播放：${currentCourse.title}(${currentCourseIndex + 1}/${courseList.length})</div>
                    ${nextBtnHtml}
                </div>
            `;
        } else {
            // 如果没有当前课程信息，显示默认提示
            displayHtml = '<div style="color: #666; font-style: italic;">暂无下一个视频</div>';
        }

        nextCourseContent.innerHTML = displayHtml;
    }

    function createVideoUI() {
        // 检查页面中是否存在id为"introdiv"的元素（章节目录容器），如果有则不展示面板
        const introdiv = document.getElementById('introdiv');

        // 使用纯JavaScript检查页面内容是否包含"章节目录"文字
        const hasChapterCatalog = document.body.textContent.includes('章节目录') || document.body.innerText.includes('章节目录');

        if (introdiv || hasChapterCatalog) {
            console.log('页面包含章节目录容器，不展示右侧面板');
            return;
        }

        // 检查是否存在视频元素，没有则不展示面板
        if (!videoElement) {
            console.log('未找到视频元素，不展示右侧面板');
            return;
        }

        // 创建左侧综合面板
        const combinedPanel = document.createElement('div');
        combinedPanel.id = 'combined-panel';
        combinedPanel.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            bottom: 10px;
            left: auto;
            background: white;
            color: #333333;
            padding: 10px 15px;
            border-radius: 12px;
            font-size: 10px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            z-index: 999998;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
            backdrop-filter: blur(12px);
            border: 1px solid rgba(200, 200, 200, 0.4);
            width: 280px;
            max-width: 280px;
            height: auto;
            max-height: calc(100vh - 20px);
            box-sizing: border-box;
            overflow-y: auto;
            overflow-x: hidden;
            transform-origin: bottom right;
            transition: all 0.3s ease;
            margin: 0;
            outline: none;
        `;

        // 添加日志滚动条样式
        combinedPanel.innerHTML += `
            <style>
                /* 日志区域滚动条 */
                #learn-time-log::-webkit-scrollbar {
                    width: 6px;
                }
                #learn-time-log::-webkit-scrollbar-track {
                    background: rgba(200, 200, 200, 0.2);
                    border-radius: 3px;
                }
                #learn-time-log::-webkit-scrollbar-thumb {
                    background: rgba(102, 126, 234, 0.5);
                    border-radius: 3px;
                }
                #learn-time-log::-webkit-scrollbar-thumb:hover {
                    background: rgba(102, 126, 234, 0.7);
                }
            </style>
        `;

        // 创建面板控制按钮，固定在右下角
        const panelControl = document.createElement('button');
        panelControl.id = 'panel-control-btn';
        panelControl.textContent = '−';
        panelControl.style.cssText = `
            position: fixed;
            bottom: 10px;
            right: 10px;
            width: 40px;
            height: 40px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: 2px solid white;
            border-radius: 50%;
            font-size: 28px;
            line-height: 1;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
            transition: all 0.3s ease;
            z-index: 1000000; /* 确保按钮在最前面 */
            transform-origin: center center;
            text-align: center;
            padding: 0;
            margin: 0;
            font-weight: bold;
        `;

        // 添加悬停效果
        panelControl.onmouseenter = function() {
            this.style.background = 'linear-gradient(135deg, rgba(102, 126, 234, 1), rgba(118, 75, 162, 1))';
            this.style.transform = 'scale(1.1)';
            this.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.5)';
        };

        panelControl.onmouseleave = function() {
            this.style.background = 'linear-gradient(135deg, rgba(102, 126, 234, 0.8), rgba(118, 75, 162, 0.8))';
            this.style.transform = 'scale(1)';
            this.style.boxShadow = '0 2px 8px rgba(102, 126, 234, 0.3)';
        };

        // 面板折叠状态变量 - 从本地存储读取初始状态
        let isPanelCollapsed = GM_getValue('isPanelCollapsed', false);

        // 面板折叠/展开函数
        function togglePanelCollapse() {
            const panel = document.getElementById('combined-panel');

            if (isPanelCollapsed) {
                // 展开面板
                panel.style.width = '300px';
                panel.style.maxWidth = '300px';
                panel.style.height = 'auto';
                panel.style.maxHeight = 'calc(100vh - 50px)';
                panel.style.padding = '15px 20px';
                panel.style.borderRadius = '15px';
                panel.style.overflow = 'hidden';
                panel.style.overflowY = 'auto';
                panel.style.overflowX = 'hidden';
                panel.style.transform = 'none';
                panel.style.opacity = '1';
                panel.style.visibility = 'visible';
                panel.style.pointerEvents = 'auto';
                panel.style.top = 'auto';
                panel.style.right = '10px';
                panel.style.bottom = '10px';
                panel.style.left = 'auto';

                // 显示面板内容
                const children = panel.children;
                for (let i = 0; i < children.length; i++) {
                    const child = children[i];
                    if (child.id !== 'panel-control-btn') {
                        child.style.display = '';
                        child.style.transform = 'none';
                    }
                }

                panelControl.textContent = '−';
                isPanelCollapsed = false;
                // 保存状态到本地存储
                GM_setValue('isPanelCollapsed', isPanelCollapsed);
            } else {
                // 收起面板，隐藏面板内容，只显示按钮
                // 隐藏面板
                panel.style.opacity = '0';
                panel.style.visibility = 'hidden';
                panel.style.pointerEvents = 'none';

                panelControl.textContent = '+';
                isPanelCollapsed = true;
                // 保存状态到本地存储
                GM_setValue('isPanelCollapsed', isPanelCollapsed);
            }
        }

        // 添加按钮点击事件，触发折叠/展开
        panelControl.addEventListener('click', togglePanelCollapse);

        // 添加面板双击事件，双击空白位置触发折叠/展开
        combinedPanel.addEventListener('dblclick', function(e) {
            // 只有当点击的是面板本身（不是按钮或其他子元素）时才触发折叠
            if (e.target === combinedPanel) {
                togglePanelCollapse();
            }
        });

        // 面板控制按钮应该直接添加到document.body，而不是combinedPanel内部
        document.body.appendChild(panelControl);

        // 视频时长显示
        const videoInfo = document.createElement('div');
        videoInfo.id = 'video-info';
        videoInfo.innerHTML = `视频时长：--:-- / --:--`;
        videoInfo.style.marginBottom = '6px';
        videoInfo.style.fontWeight = '500';
        videoInfo.style.fontSize = '12px';
        combinedPanel.appendChild(videoInfo);

        // 倒计时设置
        const countdownSettings = document.createElement('div');

        // 构建基础HTML内容 - 只包含视频时长、延时设置、延时倒计时
        let countdownHtml = `
            <div style="margin-bottom: 6px; display: flex; align-items: center; gap: 10px; flex-wrap: wrap;">
                <div style="display: flex; align-items: center; gap: 6px;">
                    <span style="font-weight: 500; font-size: 10px;">延时设置：</span>
                    <input type="number" id="delay-input" value="${delayMinutes}"
                           min="0" max="120" style="width: 80px; background: rgba(255, 255, 255, 0.9); border: 1px solid rgba(150, 150, 150, 0.3); color: #333333; border-radius: 4px; padding: 3px 5px; font-size: 10px; outline: none; transition: all 0.2s ease;">
                    <span style="font-size: 10px;">分钟</span>
                </div>
                <div id="countdown-display" style="font-weight: 600; font-size: 10px; color: #2d3748;">延时倒计时：--:--:--</div>
            </div>
        `;

        countdownSettings.innerHTML = countdownHtml;
        combinedPanel.appendChild(countdownSettings);

        // 下一个待播放视频标题和内容合并区域 - 放到延时倒计时下面
        const nextCourseContent = document.createElement('div');
        nextCourseContent.id = 'next-course-content';
        nextCourseContent.style.cssText = `
            margin-bottom: 10px;
            padding: 8px;
            background: rgba(250, 250, 250, 0.75);
            border-radius: 6px;
            font-size: 10px;
            line-height: 1.4;
            box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
            text-align: center;
        `;
        // 初始显示空内容
        nextCourseContent.innerHTML = '<div style="color: #666; font-style: italic;">暂无下一个视频</div>';
        combinedPanel.appendChild(nextCourseContent);

        // 添加学习时长提交日志区域 - 放到待播放下面
        const learnTimeLog = document.createElement('div');
        learnTimeLog.id = 'learn-time-log';
        learnTimeLog.style.cssText = `
            max-height: 300px;
            min-height: 300px;
            overflow-y: auto;
            margin-top: 12px;
            margin-bottom: 15px;
            padding: 12px;
            border-top: 1px solid rgba(200, 200, 200, 0.3);
            background: rgba(250, 250, 250, 0.75);
            border-radius: 10px;
            font-size: 9px;
            line-height: 1.6;
            box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.08);
        `;
        learnTimeLog.innerHTML = '';
        combinedPanel.appendChild(learnTimeLog);

        // 日志显示设置和其他配置 - 放到日志后面
        const otherSettings = document.createElement('div');
        let otherSettingsHtml = `
            <div style="margin-bottom: 6px; display: flex; align-items: center; gap: 6px;">
                <span style="font-weight: 500; font-size: 10px;">日志显示设置：</span>
                <select id="log-level-select" style="background: rgba(255, 255, 255, 0.9); border: 1px solid rgba(150, 150, 150, 0.3); color: #333333; border-radius: 4px; padding: 3px 5px; font-size: 10px; outline: none; transition: all 0.2s ease; cursor: pointer;">
                    <option value="simple" ${CONFIG.LOG_LEVEL === 'simple' ? 'selected' : ''}>简单日志</option>
                    <option value="full" ${CONFIG.LOG_LEVEL === 'full' ? 'selected' : ''}>完整日志</option>
                </select>
                <button id="clear-log-btn" style="background: rgba(255, 255, 255, 0.9); border: 1px solid rgba(150, 150, 150, 0.3); color: #333333; border-radius: 4px; padding: 3px 5px; font-size: 10px; outline: none; transition: all 0.2s ease; cursor: pointer;">清空日志</button>
            </div>

            <!-- 语音播放配置 -->
            <div style="margin: 8px 0 6px 0; padding: 8px; background: rgba(240, 240, 240, 0.7); border-radius: 6px; font-size: 10px;">
                <div style="margin-bottom: 6px; font-weight: 600; color: #4a5568; font-size: 10px;">语音播放配置</div>
                <div style="display: flex; flex-direction: column; gap: 8px;">
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <input type="checkbox" id="voice-alert-enabled" ${CONFIG.VOICE_ALERT_ENABLED ? 'checked' : ''} style="width: 14px; height: 14px; cursor: pointer;">
                        <span style="font-size: 9px; color: #4a5568;">语音播放课程结束提醒</span>
                    </div>
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <span style="font-size: 9px; color: #4a5568; width: 100px;">播放次数：</span>
                        <input type="number" id="voice-alert-count" value="${CONFIG.VOICE_ALERT_COUNT}" min="1" max="20"
                               style="width: 60px; background: rgba(255, 255, 255, 0.9); border: 1px solid rgba(150, 150, 150, 0.3); color: #333333; border-radius: 4px; padding: 3px 5px; font-size: 10px; outline: none; transition: all 0.2s ease;">
                        <span style="font-size: 9px; color: #4a5568;">次</span>
                    </div>
                </div>
            </div>

            <!-- 调试和登录操作按钮 -->
            <div style="margin: 8px 0 10px 0; display: flex; justify-content: center; gap: 8px; flex-wrap: wrap;">
                <button id="simulate-login-btn" style="background: linear-gradient(135deg, #48bb78 0%, #38a169 100%); color: white; border: none; padding: 5px 10px; border-radius: 6px; cursor: pointer; font-size: 10px; font-weight: 500; box-shadow: 0 2px 6px rgba(72, 187, 120, 0.3); transition: all 0.2s ease;">登录</button>
                <button id="check-login-btn" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; padding: 5px 10px; border-radius: 6px; cursor: pointer; font-size: 10px; font-weight: 500; box-shadow: 0 2px 6px rgba(102, 126, 234, 0.3); transition: all 0.2s ease;">检测登录状态</button>
                <button id="end-countdown" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; padding: 5px 10px; border-radius: 6px; cursor: pointer; font-size: 10px; font-weight: 500; box-shadow: 0 2px 6px rgba(102, 126, 234, 0.3); transition: all 0.2s ease;">模拟结束</button>
                <button id="debug-submit" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; border: none; padding: 5px 10px; border-radius: 6px; cursor: pointer; font-size: 10px; font-weight: 500; box-shadow: 0 2px 6px rgba(245, 87, 108, 0.3); transition: all 0.2s ease;">模拟时长</button>
                <button id="simulate-session-expired" style="background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); color: white; border: none; padding: 5px 10px; border-radius: 6px; cursor: pointer; font-size: 10px; font-weight: 500; box-shadow: 0 2px 6px rgba(239, 68, 68, 0.3); transition: all 0.2s ease;">模拟登录过期</button>
            </div>

            <!-- 登录检测间隔配置 -->
            <div style="margin: 8px 0 6px 0; padding: 8px; background: rgba(240, 240, 240, 0.7); border-radius: 6px; font-size: 10px;">
                <div style="margin-bottom: 6px; font-weight: 600; color: #4a5568; font-size: 10px;">登录检测间隔（分钟）</div>
                <div style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap;">
                    <div style="display: flex; align-items: center; gap: 5px;">
                        <span style="font-size: 10px;">最小间隔：</span>
                        <input type="number" id="session-min-input" value="${CONFIG.SESSION_KEEPALIVE_MIN}"
                               min="1" max="30" style="width: 80px; background: rgba(255, 255, 255, 0.9); border: 1px solid rgba(150, 150, 150, 0.3); color: #333333; border-radius: 4px; padding: 3px 5px; font-size: 10px; outline: none; transition: all 0.2s ease;">
                        <span style="font-size: 10px;">分钟</span>
                    </div>
                    <div style="display: flex; align-items: center; gap: 5px;">
                        <span style="font-size: 10px;">最大间隔：</span>
                        <input type="number" id="session-max-input" value="${CONFIG.SESSION_KEEPALIVE_MAX}"
                               min="1" max="60" style="width: 80px; background: rgba(255, 255, 255, 0.9); border: 1px solid rgba(150, 150, 150, 0.3); color: #333333; border-radius: 4px; padding: 3px 5px; font-size: 10px; outline: none; transition: all 0.2s ease;">
                        <span style="font-size: 10px;">分钟</span>
                    </div>
                </div>
            </div>

            <!-- 自动播放配置 -->
            <div style="margin: 8px 0 6px 0; padding: 8px; background: rgba(240, 240, 240, 0.7); border-radius: 6px; font-size: 10px;">
                <div style="margin-bottom: 6px; font-weight: 600; color: #4a5568; font-size: 10px;">自动播放配置</div>
                <div style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap;">
                    <div style="display: flex; align-items: center; gap: 6px;">
                        <input type="checkbox" id="auto-play-next" ${CONFIG.AUTO_PLAY_NEXT ? 'checked' : ''} style="width: 13px; height: 13px; cursor: pointer;">
                        <label for="auto-play-next" style="cursor: pointer; font-size: 10px;">自动播放下一节</label>
                    </div>
                    <div style="display: flex; align-items: center; gap: 6px;">
                        <input type="checkbox" id="skip-completed" ${CONFIG.SKIP_COMPLETED ? 'checked' : ''} style="width: 13px; height: 13px; cursor: pointer;">
                        <label for="skip-completed" style="cursor: pointer; font-size: 10px;">跳过已完成视频</label>
                    </div>
                    <div style="display: flex; align-items: center; gap: 6px; margin-top: 6px;">
                        <span style="font-size: 10px;">播放下个视频延迟：</span>
                        <input type="number" id="auto-play-delay" value="${CONFIG.AUTO_PLAY_DELAY}"
                               min="1" max="60" style="width: 80px; background: rgba(255, 255, 255, 0.9); border: 1px solid rgba(150, 150, 150, 0.3); color: #333333; border-radius: 4px; padding: 3px 5px; font-size: 10px; outline: none; transition: all 0.2s ease;">
                        <span style="font-size: 10px;">秒</span>
                    </div>
                </div>
            </div>

            <!-- 登录配置 -->
            <div style="margin: 8px 0 6px 0; padding: 8px; background: rgba(240, 240, 240, 0.7); border-radius: 6px; font-size: 10px;">
                <div style="margin-bottom: 6px; font-weight: 600; color: #4a5568; font-size: 10px;">自动登录配置</div>
                <div style="display: flex; flex-direction: column; gap: 8px;">
                    <div>
                        <div style="margin-bottom: 3px; font-size: 9px; color: #4a5568;">用户名</div>
                        <input type="text" id="username-input" value="${GM_getValue('username', CONFIG.LOGIN_INFO.username)}"
                               placeholder="请输入用户名" style="width: 100%; background: rgba(255, 255, 255, 0.9); border: 1px solid rgba(150, 150, 150, 0.3); color: #333333; border-radius: 4px; padding: 5px 7px; font-size: 10px; outline: none; transition: all 0.2s ease;">
                    </div>
                    <div>
                        <div style="margin-bottom: 3px; font-size: 9px; color: #4a5568;">密码</div>
                        <input type="password" id="password-input" value="${GM_getValue('password', CONFIG.LOGIN_INFO.password)}"
                               placeholder="请输入密码" style="width: 100%; background: rgba(255, 255, 255, 0.9); border: 1px solid rgba(150, 150, 150, 0.3); color: #333333; border-radius: 4px; padding: 5px 7px; font-size: 10px; outline: none; transition: all 0.2s ease;">
                    </div>
                    <button id="save-login-btn" style="background: linear-gradient(135deg, #ed8936 0%, #dd6b20 100%); color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-size: 9px; font-weight: 500; box-shadow: 0 2px 4px rgba(237, 137, 54, 0.3); transition: all 0.2s ease;">保存配置</button>
                </div>
            </div>

        `;

        // 如果DEBUG_MODE为false，不显示调试按钮
        if (!CONFIG.DEBUG_MODE) {
            // 移除调试按钮部分
            otherSettingsHtml = otherSettingsHtml.replace(/<!-- 调试和登录操作按钮 -->[\s\S]*?<\/div>/, '');
        }

        otherSettings.innerHTML = otherSettingsHtml;
        combinedPanel.appendChild(otherSettings);

        // 创建全屏提醒
        const fullscreenDiv = document.createElement('div');
        fullscreenDiv.id = 'fullscreen-notification';
        fullscreenDiv.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(45deg, rgba(255, 0, 0, 0.4), rgba(255, 255, 0, 0.4));
            color: white;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            font-size: 80px;
            font-weight: bold;
            z-index: 9999999;
            display: none;
            animation: pulse 1s infinite alternate;
        `;

        // 添加动画样式
        const style = document.createElement('style');
        style.textContent = `
            @keyframes pulse {
                0% {
                    box-shadow: 0 0 100px rgba(255, 0, 0, 1), 0 0 50px rgba(255, 255, 0, 1);
                    transform: scale(1);
                }
                100% {
                    box-shadow: 0 0 150px rgba(255, 0, 0, 1), 0 0 100px rgba(255, 255, 0, 1);
                    transform: scale(1.05);
                }
            }

            @keyframes blink {
                0%, 100% {
                    opacity: 1;
                    text-shadow: 0 0 10px #ffff00, 0 0 20px #ffff00, 0 0 30px #ff0000, 0 0 40px #ff0000, 0 0 50px #ff0000;
                }
                50% {
                    opacity: 0.8;
                    text-shadow: 0 0 5px #ffff00, 0 0 10px #ffff00, 0 0 15px #ff0000;
                }
            }

            @keyframes entrance {
                0% {
                    opacity: 0;
                    transform: scale(0.5) rotate(-10deg);
                }
                100% {
                    opacity: 1;
                    transform: scale(1) rotate(0deg);
                }
            }

            @keyframes float {
                0% {
                    transform: translateY(0px);
                }
                50% {
                    transform: translateY(-10px);
                }
                100% {
                    transform: translateY(0px);
                }
            }

            /* 扫描线效果 */
            @keyframes scanline {
                0% {
                    background-position: 0 0;
                }
                100% {
                    background-position: 0 100vh;
                }
            }

            /* 跳舞效果 */
            @keyframes dance {
                0% {
                    transform: translate(0, 0) rotate(0deg) scale(1);
                }
                10% {
                    transform: translate(10px, -10px) rotate(5deg) scale(1.05);
                }
                20% {
                    transform: translate(-10px, -5px) rotate(-3deg) scale(0.95);
                }
                30% {
                    transform: translate(15px, 5px) rotate(2deg) scale(1.1);
                }
                40% {
                    transform: translate(-5px, 10px) rotate(-5deg) scale(0.9);
                }
                50% {
                    transform: translate(20px, -15px) rotate(7deg) scale(1.15);
                }
                60% {
                    transform: translate(-15px, -10px) rotate(-2deg) scale(0.95);
                }
                70% {
                    transform: translate(10px, 10px) rotate(3deg) scale(1.05);
                }
                80% {
                    transform: translate(-10px, 5px) rotate(-4deg) scale(0.98);
                }
                90% {
                    transform: translate(15px, -5px) rotate(5deg) scale(1.02);
                }
                100% {
                    transform: translate(0, 0) rotate(0deg) scale(1);
                }
            }

            /* 轻微跳舞效果（适合副标题） */
            @keyframes gentleDance {
                0% {
                    transform: translate(0, 0) rotate(0deg) scale(1);
                }
                25% {
                    transform: translate(5px, -5px) rotate(2deg) scale(1.02);
                }
                50% {
                    transform: translate(-3px, 3px) rotate(-1deg) scale(0.98);
                }
                75% {
                    transform: translate(3px, 2px) rotate(1deg) scale(1.01);
                }
                100% {
                    transform: translate(0, 0) rotate(0deg) scale(1);
                }
            }
        `;
        document.head.appendChild(style);

        fullscreenDiv.innerHTML = `
            <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: linear-gradient(0deg, rgba(0, 0, 0, 0.1) 0%, transparent 100%); background-size: 100% 4px; animation: scanline 3s linear infinite; pointer-events: none;"></div>
            <div style="padding: 30px 60px; border-radius: 15px; border: 4px solid #ffff00; box-shadow: 0 0 50px rgba(255, 255, 0, 0.8); color: #ffffff; text-shadow: 0 0 10px #ffff00, 0 0 20px #ffff00, 0 0 30px #ff0000, 0 0 40px #ff0000, 0 0 50px #ff0000; animation: blink 1s infinite, entrance 1s ease-out, dance 3s ease-in-out infinite;">视频已播放完毕</div>
            <div style="font-size: 40px; margin-top: 30px; opacity: 1; padding: 15px 30px; border-radius: 10px; border: 2px solid #ffff00; box-shadow: 0 0 30px rgba(255, 255, 0, 0.6); color: #ffffff; text-shadow: 0 0 8px #ffff00, 0 0 15px #ffff00, 0 0 25px #ff0000; animation: blink 1.5s infinite, entrance 1s ease-out 0.3s both, gentleDance 4s ease-in-out infinite;">点击任意位置关闭</div>
        `;

        document.body.appendChild(combinedPanel);
        document.body.appendChild(fullscreenDiv);

        // 根据初始状态设置面板样式
        if (isPanelCollapsed) {
            // 初始状态为折叠
            combinedPanel.style.opacity = '0';
            combinedPanel.style.visibility = 'hidden';
            combinedPanel.style.pointerEvents = 'none';
            panelControl.textContent = '+';
        } else {
            // 初始状态为展开
            combinedPanel.style.opacity = '1';
            combinedPanel.style.visibility = 'visible';
            combinedPanel.style.pointerEvents = 'auto';
            panelControl.textContent = '−';
        }

        // 初始更新课程列表显示
        updateCourseListDisplay();

        // 加载当天登录日志到面板
        loadLoginLogToPanel();

        // 添加事件监听

        // 基础事件监听（始终添加）
        document.getElementById('delay-input').addEventListener('input', handleDelayChange);
        document.getElementById('log-level-select').addEventListener('change', function() {
            // 更新日志级别配置
            CONFIG.LOG_LEVEL = this.value;
            // 保存到本地存储
            GM_setValue('logLevel', CONFIG.LOG_LEVEL);
        });

        // 登录相关事件监听
        // 保存登录配置
        document.getElementById('save-login-btn').addEventListener('click', function() {
            const username = document.getElementById('username-input').value.trim();
            const password = document.getElementById('password-input').value.trim();

            if (!username || !password) {
                // 获取当前登录用户信息，用于显示更准确的错误提示
                getCurrentUserInfo(function(userInfo, error) {
                    if (userInfo) {
                        // 如果获取到了用户信息，显示包含当前登录用户姓名和用户名的提示
                        log(`用户名和密码不能为空 请输入当前已登录-${userInfo.employeeName}的（用户名${userInfo.username}）和密码`, 'error', true);
                    } else {
                        // 如果获取失败，显示通用提示
                        log('用户名和密码不能为空，请输入正确的登录信息', 'error', true);
                    }
                });
                return;
            }

            // 获取当前登录用户信息进行校验
            getCurrentUserInfo(function(userInfo, error) {
                if (error) {
                    log(`保存配置失败：${error}，请先登录后再保存配置`, 'error', true);
                    return;
                }

                if (!userInfo) {
                    log('保存配置失败：无法获取当前用户信息', 'error', true);
                    return;
                }

                // 校验输入的用户名是否与当前登录的用户名一致
                if (username !== userInfo.username) {
                    log(`保存配置失败：用户名不一致，请输入当前登录的员工姓名的${userInfo.employeeName}（用户名${userInfo.username}）和密码`, 'error', true);
                    return;
                }

                // 显示用户名和部分密码到日志面板
                const maskedPassword = password.length > 4 ? password.substring(0, 2) + '*'.repeat(password.length - 4) + password.substring(password.length - 2) : password;
                log(`保存登录配置: 用户名=${username}，密码=${maskedPassword}`, 'info', true);

                GM_setValue('username', username);
                GM_setValue('password', password);
                log('登录配置已保存', 'success', true);
            });
        });

        // 模拟登录按钮事件监听，只有当按钮存在时才添加
        const simulateLoginBtn = document.getElementById('simulate-login-btn');
        if (simulateLoginBtn) {
            simulateLoginBtn.addEventListener('click', function() {
                log('用户点击了模拟登录按钮', 'info', true);
                attemptAutoLogin();
            });
        }

        // 检测登录状态按钮事件监听，只有当按钮存在时才添加
        const checkLoginBtn = document.getElementById('check-login-btn');
        if (checkLoginBtn) {
            checkLoginBtn.addEventListener('click', function() {
                log('用户点击了检测登录状态按钮', 'info', true);
                checkLoginStatus();
            });
        }

        // 登录检测最小间隔输入事件
        document.getElementById('session-min-input').addEventListener('input', function() {
            // 获取输入值
            let value = parseInt(this.value) || CONFIG.SESSION_KEEPALIVE_MIN;
            // 确保值在有效范围内
            value = Math.max(1, Math.min(30, value));
            // 更新配置
            CONFIG.SESSION_KEEPALIVE_MIN = value;
            // 保存到本地存储
            GM_setValue('sessionKeepaliveMin', CONFIG.SESSION_KEEPALIVE_MIN);
            // 更新输入框显示（如果输入值超出范围）
            this.value = value;
            console.log(`登录检测最小间隔已更新为：${CONFIG.SESSION_KEEPALIVE_MIN}分钟`);
        });

        // 登录检测最大间隔输入事件
        document.getElementById('session-max-input').addEventListener('input', function() {
            // 获取输入值
            let value = parseInt(this.value) || CONFIG.SESSION_KEEPALIVE_MAX;
            // 确保值在有效范围内
            value = Math.max(1, Math.min(60, value));
            // 确保最大值不小于最小值
            if (value < CONFIG.SESSION_KEEPALIVE_MIN) {
                value = CONFIG.SESSION_KEEPALIVE_MIN;
            }
            // 更新配置
            CONFIG.SESSION_KEEPALIVE_MAX = value;
            // 保存到本地存储
            GM_setValue('sessionKeepaliveMax', CONFIG.SESSION_KEEPALIVE_MAX);
            // 更新输入框显示（如果输入值超出范围）
            this.value = value;
            console.log(`登录检测最大间隔已更新为：${CONFIG.SESSION_KEEPALIVE_MAX}分钟`);
        });

        // 语音播放配置事件监听
        const voiceAlertEnabled = document.getElementById('voice-alert-enabled');
        if (voiceAlertEnabled) {
            voiceAlertEnabled.addEventListener('change', function() {
                CONFIG.VOICE_ALERT_ENABLED = this.checked;
                GM_setValue('voiceAlertEnabled', CONFIG.VOICE_ALERT_ENABLED);
                log(`语音播放课程结束提醒已${CONFIG.VOICE_ALERT_ENABLED ? '开启' : '关闭'}`, 'success', true);
            });
        }

        const voiceAlertCount = document.getElementById('voice-alert-count');
        if (voiceAlertCount) {
            // 直接监听input事件，不使用防抖函数
            voiceAlertCount.addEventListener('input', function() {
                let value = parseInt(this.value) || CONFIG.VOICE_ALERT_COUNT;
                value = Math.max(1, Math.min(20, value));
                CONFIG.VOICE_ALERT_COUNT = value;
                GM_setValue('voiceAlertCount', value);
                this.value = value;
                log(`语音播放次数已更新为：${CONFIG.VOICE_ALERT_COUNT}次`, 'success', true);
            });
        }

        // 自动播放下一节选项
        document.getElementById('auto-play-next').addEventListener('change', function() {
            CONFIG.AUTO_PLAY_NEXT = this.checked;
            GM_setValue('autoPlayNext', CONFIG.AUTO_PLAY_NEXT);
            console.log(`自动播放下一节已${CONFIG.AUTO_PLAY_NEXT ? '开启' : '关闭'}`);
        });

        // 跳过已完成视频选项
        document.getElementById('skip-completed').addEventListener('change', function() {
            CONFIG.SKIP_COMPLETED = this.checked;
            GM_setValue('skipCompleted', CONFIG.SKIP_COMPLETED);
            console.log(`跳过已完成视频已${CONFIG.SKIP_COMPLETED ? '开启' : '关闭'}`);
        });

        // 自动播放延迟时间输入事件
        document.getElementById('auto-play-delay').addEventListener('input', function() {
            // 获取输入值
            let value = parseInt(this.value) || CONFIG.AUTO_PLAY_DELAY;
            // 确保值在有效范围内
            value = Math.max(1, Math.min(60, value));
            // 更新配置
            CONFIG.AUTO_PLAY_DELAY = value;
            // 保存到本地存储
            GM_setValue('autoPlayDelay', CONFIG.AUTO_PLAY_DELAY);
            // 更新输入框显示（如果输入值超出范围）
            this.value = value;
            console.log(`自动播放延迟时间已更新为：${CONFIG.AUTO_PLAY_DELAY}秒`);
        });

        // 清空日志按钮事件
        const clearLogBtn = document.getElementById('clear-log-btn');
        if (clearLogBtn) {
            clearLogBtn.addEventListener('click', function() {
                const logArea = document.getElementById('learn-time-log');
                if (logArea) {
                    logArea.innerHTML = '';
                    console.log('日志已清空');
                }
            });
        }

        // 根据DEBUG_MODE条件添加模拟按钮事件监听
        if (CONFIG.DEBUG_MODE) {
            // 模拟结束按钮事件
            const endCountdownBtn = document.getElementById('end-countdown');
            if (endCountdownBtn) {
                endCountdownBtn.addEventListener('click', function() {
                    console.log('模拟结束按钮被点击，显示10秒倒数计时弹窗');

                    // 查找下一个课程
                    const nextCourse = findNextCourse();
                    if (nextCourse) {
                        // 显示10秒自动播放弹窗
                        showAutoPlayCountdown(nextCourse, CONFIG.AUTO_PLAY_DELAY);
                    } else {
                        console.log('已播放完所有课程或没有找到下一个未完成的课程');
                        // 显示课程完成提示
                        showCourseCompletedMessage();
                    }
                });
            }

            // 调试提交按钮事件 - 模拟本地提交功能（恢复到原始状态）
            const debugSubmitBtn = document.getElementById('debug-submit');
            if (debugSubmitBtn) {
                debugSubmitBtn.addEventListener('click', function() {
                    // 如果登录已失效，不允许模拟提交
                    if (isSessionExpired) {
                        console.log('调试提交：登录已失效，无法模拟提交学习记录');
                        displayDebugLog('❌ 登录已失效，无法模拟提交学习记录');
                        return;
                    }

                    console.log('调试提交：开始模拟本地提交学习记录');


                    try {
                        // 计算模拟时长
                    let simulatedLearnTime;
                    if (videoDuration > 0 && videoDuration < 3600) { // 确保获取到有效时长且不是异常值
                        // 如果获取到时长，每次添加大概三分之一的时长
                        simulatedLearnTime = Math.floor(videoDuration / 3);
                        // 添加一些随机波动，使时长更自然（±10%）
                        const variation = Math.floor(simulatedLearnTime * 0.1);
                        simulatedLearnTime += Math.floor(Math.random() * (variation * 2 + 1)) - variation;
                    } else {
                        // 如果没有视频时长或时长异常，使用5-20分钟的随机时长
                        const minSeconds = 300; // 5分钟
                        const maxSeconds = 1200; // 20分钟
                        simulatedLearnTime = Math.floor(Math.random() * (maxSeconds - minSeconds + 1)) + minSeconds;
                    }

                        // 更新累计学习时长
                        const newTotalTime = totalLearntime + simulatedLearnTime;

                        // 尝试获取当前视频时长，确保videoDuration不为0
                        if (videoDuration <= 0) {
                            // 立即尝试查找并更新视频元素和时长
                            const currentVideo = findVideoElement();
                            if (currentVideo && currentVideo.duration > 0) {
                                videoElement = currentVideo;
                                videoDuration = currentVideo.duration;
                                console.log('调试提交：已获取视频时长', videoDuration);
                            }
                        }

                        // 计算进度百分比
                        let progress = 0;
                        if (videoDuration > 0) {
                            progress = Math.min(100, parseFloat(((newTotalTime / videoDuration) * 100).toFixed(2)));
                        }

                        // 检查进度是否已达到100%，如果是则不显示日志
                        if (isProgressReached100) {
                            console.log('进度已达到100%，不再显示学习时长日志');
                            return;
                        }

                        // 构造日志内容，添加进度百分比（不显示文本后缀，改为按钮）
                        const logContent = `本次学习 ${formatSeconds(simulatedLearnTime)}，累计 ${formatSeconds(newTotalTime)}，当前进度 ${progress}%`;

                        // 更新累计时长
                        totalLearntime += simulatedLearnTime;

                        // 更新进度状态
                        if (progress >= 100) {
                            isProgressReached100 = true;
                        }

                        // 直接显示学习时长提交日志
                        displayDebugLog(logContent);

                        console.log('模拟提交完成，仅更新本地日志，未发送真实请求');
                        console.log('模拟提交的学习时长：', simulatedLearnTime, '秒');
                        console.log('累计学习时长：', totalLearntime, '秒');
                        console.log('当前进度：', progress, '%');
                    } catch (error) {
                        console.error('模拟提交发生错误：', error);
                        displayDebugLog(`❌ 模拟提交发生错误：${error.message}`);
                    }
                });
            }

            // 模拟登录过期按钮事件
            const simulateSessionExpiredBtn = document.getElementById('simulate-session-expired');
            if (simulateSessionExpiredBtn) {
                simulateSessionExpiredBtn.addEventListener('click', function() {
                    // 模拟会话过期检测
                    console.log('调试提交：模拟登录过期');

                    // 设置会话过期状态
                    isSessionExpired = true;
                    const sessionEndTime = Date.now();
                    const sessionDuration = Math.round((sessionEndTime - sessionStartTime) / (1000 * 60)); // 分钟

                    // 显示到界面日志 - 只显示一条简化的会话过期日志
                    displayDebugLog(`⚠️  登录已失效，请重新登录后学习！`);

                    // 同时显示到控制台
                    console.log(`⚠️  登录已失效，请重新登录后学习！`);

                    // 显示会话过期弹窗
                    showSessionExpiredMessage();

                    // 暂停视频播放
                    if (videoElement && !videoElement.paused) {
                        videoElement.pause();
                        console.log('视频已暂停，因为登录已失效');
                    }

                    console.log('模拟登录过期完成');
                });
            }
        }
    }

    // 显示调试日志
    function displayDebugLog(logContent) {
        const now = new Date();
        const timeDisplay = now.toLocaleTimeString('zh-CN', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });

        const logArea = document.getElementById('learn-time-log');
        if (logArea) {
            const logEntry = document.createElement('div');
            logEntry.style.cssText = `
                margin: 2px 0;
                padding: 3px 6px;
                border-radius: 4px;
                background: rgba(255, 255, 255, 0.85);
                color: #333333;
                font-size: 9px;
                text-align: left;
                line-height: 1.4;
                box-shadow: 0 1px 1px rgba(0, 0, 0, 0.05);
                transition: all 0.2s ease;
                max-width: 100%;
                overflow: hidden;
                word-wrap: break-word;
                white-space: normal;
            `;
            logEntry.onmouseenter = function() {
                this.style.background = 'rgba(245, 245, 245, 0.9)';
            };

            logEntry.onmouseleave = function() {
                this.style.background = 'rgba(255, 255, 255, 0.85)';
            };

            // 检查是否为100%进度的学习时长日志，如果是则添加立即结束按钮
            let is100Progress = false;
            const progressMatch = logContent.match(/当前进度\s*(\d+(?:\.\d+)?)%/);
            if (progressMatch && parseFloat(progressMatch[1]) >= 100) {
                is100Progress = true;
            }

            if (is100Progress) {
                // 100%进度的学习时长日志，添加立即结束按钮
                logEntry.innerHTML = `${timeDisplay} - ${logContent.replace(/\s*[（(]立即结束[）)]/, '')} <button onclick="javascript:try {
                    // 创建一个自定义事件来触发结束操作
                    const endEvent = new CustomEvent('endCountdownEvent');
                    window.dispatchEvent(endEvent);
                } catch (e) { console.error('立即结束失败:', e); }" style="margin-left: 8px; padding: 1px 6px; font-size: 8px; background: linear-gradient(135deg, #667eea, #764ba2); color: white; border: none; border-radius: 3px; cursor: pointer; box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1); transition: all 0.2s ease;">立即结束</button>`;
            } else {
                // 普通日志，使用textContent
                logEntry.textContent = `${timeDisplay} - ${logContent}`;
            }
            logArea.appendChild(logEntry);
            logArea.scrollTop = logArea.scrollHeight;

            // 限制日志数量，最多保留50条
            const logEntries = logArea.querySelectorAll('div');
            if (logEntries.length > 51) { // 50条日志 + 1条标题
                // 只移除最旧的1条日志
                logEntries[1].remove();
            }
        }
    }

    // 查找视频元素
    function findVideoElement() {
        // 1. 首先尝试直接在页面中查找视频元素
        let video = document.querySelector('video');
        if (video) {
            return video;
        }

        // 2. 尝试查找常见播放器结构
        const commonVideoSelectors = [
            '#videoplayer video',
            '.video-player video',
            '.player video',
            '#video-player video',
            '.video-container video',
            '.video-wrapper video',
            '#main-video video',
            '.main-video video',
            '#content video',
            '.content video',
            '#player-container video',
            '.player-container video'
        ];

        for (const selector of commonVideoSelectors) {
            video = document.querySelector(selector);
            if (video) {
                return video;
            }
        }

        // 3. 尝试使用更通用的选择器
        const genericSelectors = [
            'div[id*="video"] video',
            'div[class*="video"] video',
            'div[id*="player"] video',
            'div[class*="player"] video',
            'section video',
            'article video',
            'main video',
            '#video video',
            '#player video'
        ];

        for (const selector of genericSelectors) {
            video = document.querySelector(selector);
            if (video) {
                return video;
            }
        }

        // 4. 尝试在iframe中查找视频元素
        const iframes = document.querySelectorAll('iframe');
        for (const iframe of iframes) {
            try {
                const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;

                // 直接查找iframe中的视频元素
                video = iframeDoc.querySelector('video');
                if (video) {
                    return video;
                }

                // 尝试在iframe中查找常见播放器结构
                for (const selector of commonVideoSelectors) {
                    video = iframeDoc.querySelector(selector);
                    if (video) {
                        return video;
                    }
                }
            } catch (e) {
                // 跨域iframe无法访问，忽略
            }
        }

        // 5. 最终检查，再次尝试直接查找video元素
        video = document.querySelector('video');
        if (video) {
            return video;
        }

        return null;
    }

    // 添加MutationObserver监听视频元素的动态添加
    function addVideoMutationObserver() {

        const observer = new MutationObserver((mutationsList, observer) => {
            // 如果视频元素已经存在，跳过查找
            if (videoElement) {
                observer.disconnect();
                return;
            }

            const video = findVideoElement();
            if (video) {
                // 停止监听
                observer.disconnect();

                // 初始化视频元素
                initVideoElement();
            }
        });

        // 配置观察选项
        const config = {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['src', 'class', 'id']
        };

        // 如果视频元素已经存在，直接返回，不启动监听
        if (videoElement) {
            return;
        }

        // 启动观察，确保document.body是有效的Node对象
        if (document.body && document.body instanceof Node) {
            observer.observe(document.body, config);
        } else {
            console.error('document.body不是有效的Node对象，无法启动MutationObserver');
        }

        // 10秒后停止观察，避免长时间监听
        setTimeout(() => {
            observer.disconnect();
        }, 10000);
    }

    // 格式化时间显示
    function formatTime(seconds) {
        if (isNaN(seconds) || seconds < 0) seconds = 0;
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = Math.floor(seconds % 60);

        if (hrs > 0) {
            return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        } else {
            return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }
    }

    // 更新视频信息显示
    function updateVideoInfo() {
        const videoInfoElement = document.getElementById('video-info');
        if (!videoInfoElement) {
            console.log('视频信息元素未找到，无法更新视频时长');
            return;
        }

        if (!videoElement) {
            videoInfoElement.textContent = '视频时长：--:-- / --:--';
            return;
        }

        const currentTime = videoElement.currentTime;
        const duration = videoElement.duration;

        // 更新视频总时长
        if (duration > 0) {
            videoDuration = duration;

            // 如果视频时长已可用且倒计时未运行，且课程未完成且视频未结束，则自动启动倒计时
            if (!isCountdownRunning && !isCourseCompleted && !isVideoEnded) {
                startCountdown();
            }
        }

        // 计算当前进度百分比，始终显示两位小数
        let progress = "0.00";
        let progressWidth = "0%";
        if (duration > 0) {
            progress = ((currentTime / duration) * 100).toFixed(2);
            progressWidth = `${Math.min(100, parseFloat(progress))}%`;
        }

        // 使用进度条显示视频进度
        videoInfoElement.innerHTML = `
            <div style="margin-bottom: 5px;">视频时长：${formatTime(currentTime)} / ${formatTime(duration)}</div>
            <div style="width: 100%; background-color: #e2e8f0; border-radius: 4px; height: 10px; overflow: hidden;">
                <div style="width: ${progressWidth}; background: linear-gradient(90deg, #48bb78, #4299e1); height: 100%; border-radius: 4px; transition: width 0.3s ease;"></div>
            </div>
            <div style="text-align: right; font-size: 10px; color: #718096; margin-top: 2px;">${progress}%</div>
        `;

        // 更新倒计时显示
        updateCountdown();
    }

    // 注释掉实时进度更新，只在课程时长提交时发送更新
    // 进度条更新应该只有在课程时长提交时才触发，而不是实时触发
    /*
    if (duration > 0) {
        const progress = Math.floor((currentTime / duration) * 100);
        // 只在进度变化时发送更新，避免频繁发送
        if (lastSentProgress !== progress) {
            sendProgressUpdateMessage(progress);
            lastSentProgress = progress;
        }
    }
    */

    // 更新倒计时显示
    function updateCountdown() {
        const countdownElement = document.getElementById('countdown-display');
        if (!countdownElement) {
            console.log('倒计时元素未找到，无法更新倒计时');
            return;
        }

        if (!isCountdownRunning || !videoElement) {
            countdownElement.textContent = `延时倒计时：--:--:--`;
            return;
        }

        let totalRemainingSeconds;
        let countdownText = `延时倒计时：--:--:--`;

        if (isVideoEnded) {
            // 视频已结束，显示延时倒计时
            const elapsedSeconds = Math.floor((Date.now() - countdownStartTime) / 1000);
            totalRemainingSeconds = (delayMinutes * 60) - elapsedSeconds;
            remainingTime = Math.max(0, Math.floor(totalRemainingSeconds));
            countdownText = `延时倒计时：${formatTime(remainingTime)}`;
        }

        countdownElement.textContent = countdownText;

        // 检查倒计时是否结束
        if (remainingTime <= 0 && isCountdownRunning) {
            endCountdown();
        }
    }

    // 开始倒计时
    function startCountdown() {
        // 停止之前的倒计时
        if (countdownInterval) {
            clearInterval(countdownInterval);
        }

        isCountdownRunning = true;

        // 初始化remainingTime为一个较大的值，避免页面刷新时立即触发endCountdown
        // 只有在视频结束后，isVideoEnded为true时，才会开始真正的倒计时
        remainingTime = 3600; // 1小时，足够大的初始值

        // 更新显示
        updateCountdown();

        // 启动定时器，更新显示包括视频时长和倒计时
        countdownInterval = setInterval(() => {
            updateCountdown();
            updateVideoInfo();
        }, CONFIG.UPDATE_INTERVAL);

        console.log(`倒计时定时器已启动`);
    }

    // 处理延时设置变化
    function handleDelayChange() {
        const inputValue = document.getElementById('delay-input').value;
        // 正确处理0值：只有当值为null、undefined或空字符串时，才使用默认值
        delayMinutes = inputValue === '' ? CONFIG.DEFAULT_DELAY : parseInt(inputValue, 10);
        // 保存到本地存储
        GM_setValue('delayMinutes', delayMinutes);
        // 更新显示
        updateCountdown();
        console.log(`延时设置已更新为：${delayMinutes}分钟`);
    }

    // 处理视频播放进度变化
    function handlePlaybackProgressChange() {
        if (!isCountdownRunning || !videoElement) return;

        // 更新显示
        updateCountdown();
    }

    // 取消倒计时
    function cancelCountdown() {
        if (countdownInterval) {
            clearInterval(countdownInterval);
            countdownInterval = null;
        }

        isCountdownRunning = false;
        remainingTime = 0;
        updateCountdown();

        console.log('倒计时已取消');
    }

    // 查找下一个要播放的视频
    function findNextCourse() {
        if (courseList.length === 0) return null;

        let nextIndex = -1;
        let currentIndex = -1;

        // 1. 如果有currentCourseIndex，直接使用它
        if (currentCourseIndex !== -1) {
            currentIndex = currentCourseIndex;
            nextIndex = currentCourseIndex + 1;
        }
        // 2. 如果没有currentCourseIndex但有当前URL，查找当前课程在列表中的位置
        else {
            const currentUrl = window.location.href;
            for (let i = 0; i < courseList.length; i++) {
                if (currentUrl.includes(courseList[i].lessonId) &&
                    currentUrl.includes(courseList[i].coursewareId)) {
                    currentIndex = i;
                    nextIndex = i + 1;
                    break;
                }
            }
        }

        console.log('当前课程索引：', currentIndex, '，下一个开始索引：', nextIndex, '，课程总数：', courseList.length);

        // 如果找到了当前课程的位置
        if (currentIndex !== -1) {
            let foundNext = false;
            let finalNextIndex = -1;

            // 如果启用了跳过已完成视频，寻找下一个未完成的视频
            if (CONFIG.SKIP_COMPLETED) {
                console.log('启用了跳过已完成视频，寻找下一个未完成的视频');
                // 从当前课程的下一个开始查找
                for (let i = nextIndex; i < courseList.length; i++) {
                    const nextCourse = courseList[i];
                    // 这里假设进度小于100%视为未完成
                    const uniqueKey = `courseProgress_${nextCourse.lessonId}_${nextCourse.coursewareId}_${nextCourse.lessonGkey}`;
                    const courseProgress = GM_getValue(uniqueKey, 0);
                    console.log(`检查课程 ${i}：${nextCourse.title}，进度：${courseProgress}%`);
                    if (courseProgress < 100) {
                        foundNext = true;
                        finalNextIndex = i;
                        console.log('找到未完成的课程：', nextCourse.title);
                        break;
                    }
                }
            } else {
                // 不跳过已完成视频，直接播放下一个
                console.log('未启用跳过已完成视频，直接播放下一个');
                if (nextIndex < courseList.length) {
                    foundNext = true;
                    finalNextIndex = nextIndex;
                    console.log('直接播放下一个课程，索引：', finalNextIndex);
                }
            }

            if (foundNext && finalNextIndex !== -1) {
                console.log('返回下一个课程：', courseList[finalNextIndex].title);
                return courseList[finalNextIndex];
            } else {
                console.log('没有找到下一个视频，所有视频都已完成或已播放完所有视频');
            }
        } else {
            console.log('无法确定当前课程位置，无法自动播放下一个课程');
        }

        return null;
    }

    // 显示视频播放页面的结束倒计时弹框
    function showVideoEndCountdown(nextCourse) {
        // 检查是否已存在弹框，如果存在则移除
        let countdownDialog = document.getElementById('video-end-countdown');
        if (countdownDialog) {
            countdownDialog.remove();
        }

        // 创建弹框容器
        countdownDialog = document.createElement('div');
        countdownDialog.id = 'video-end-countdown';
        countdownDialog.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(255, 255, 255, 0.95);
            color: #333333;
            padding: 25px 30px;
            border-radius: 15px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            z-index: 9999999;
            box-shadow: 0 12px 40px rgba(0, 0, 0, 0.2);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(200, 200, 200, 0.3);
            text-align: center;
            min-width: 350px;
            animation: entrance 0.5s ease-out;
        `;

        // 创建标题
        const title = document.createElement('div');
        title.style.cssText = `
            font-size: 18px;
            font-weight: 600;
            color: #2d3748;
            margin-bottom: 15px;
        `;
        title.textContent = '本视频播放完毕';
        countdownDialog.appendChild(title);

        // 创建课程信息
        const courseInfo = document.createElement('div');
        courseInfo.style.cssText = `
            font-size: 14px;
            color: #4a5568;
            margin-bottom: 20px;
            line-height: 1.5;
        `;
        courseInfo.innerHTML = `即将播放：<br><strong style="color: #667eea;">${nextCourse.title}</strong>`;
        countdownDialog.appendChild(courseInfo);

        // 创建倒计时显示
        const countdownDisplay = document.createElement('div');
        countdownDisplay.id = 'countdown-timer';
        countdownDisplay.style.cssText = `
            font-size: 48px;
            font-weight: 700;
            color: #667eea;
            margin-bottom: 25px;
            text-shadow: 0 2px 10px rgba(102, 126, 234, 0.3);
        `;
        countdownDisplay.textContent = CONFIG.AUTO_PLAY_DELAY;
        countdownDialog.appendChild(countdownDisplay);

        // 创建提示信息
        const message = document.createElement('div');
        message.style.cssText = `
            font-size: 13px;
            color: #718096;
            margin-bottom: 20px;
        `;
        message.textContent = '倒计时结束后将自动播放下一节视频';
        countdownDialog.appendChild(message);

        // 创建立即播放按钮
        const playNowButton = document.createElement('button');
        playNowButton.style.cssText = `
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            padding: 10px 25px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 600;
            transition: all 0.2s ease;
            box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
            margin-right: 10px;
        `;
        playNowButton.textContent = '立即播放';
        playNowButton.addEventListener('click', () => {
            clearInterval(countdownInterval);
            countdownDialog.remove();
            // 用户主动点击，在本标签打开新视频
            window.location.href = nextCourse.playUrl;
            // 关闭当前视频页
            // window.close();
        });
        countdownDialog.appendChild(playNowButton);

        // 创建取消按钮
        const cancelButton = document.createElement('button');
        cancelButton.style.cssText = `
            background: linear-gradient(135deg, #e2e8f0 0%, #cbd5e0 100%);
            color: #4a5568;
            border: none;
            padding: 10px 25px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 600;
            transition: all 0.2s ease;
            box-shadow: 0 4px 15px rgba(100, 100, 100, 0.1);
        `;
        cancelButton.textContent = '取消';
        cancelButton.addEventListener('click', () => {
            clearInterval(countdownInterval);
            countdownDialog.remove();
        });
        countdownDialog.appendChild(cancelButton);

        // 添加到页面
        document.body.appendChild(countdownDialog);

        // 开始倒计时
        let remainingSeconds = CONFIG.AUTO_PLAY_DELAY;
        const countdownInterval = setInterval(() => {
            remainingSeconds--;
            countdownDisplay.textContent = remainingSeconds;

            if (remainingSeconds <= 0) {
                clearInterval(countdownInterval);
                countdownDialog.remove();
                // 倒计时结束，尝试打开下一个视频
                setTimeout(() => {
                    try {
                        // 在本标签打开新视频
                        window.location.href = nextCourse.playUrl;
                        // 关闭当前视频页
                        // window.close();
                    } catch (error) {
                        console.error('打开新标签页失败:', error);
                        alert('打开新标签页失败，请手动点击\'立即播放\'按钮');
                    }
                }, 100);
            }
        }, 1000);
    }

    // 结束倒计时
    function endCountdown() {
        cancelCountdown();
        console.log('立即结束，跳过倒计时，准备处理视频完成');

        // 标记课程已完成
        isCourseCompleted = true;

        // 直接将当前课程进度设置为100%并保存到本地存储
        sendProgressUpdateMessage(100);

        // 发送视频完成消息
        sendVideoCompletedMessage();

        // 在视频播放页面显示下一节播放提示，跳过倒计时直接跳转
        if (currentPageType === 'videoPlay') {
            const nextCourse = findNextCourse();
            if (nextCourse) {
                console.log('立即跳转到下一个课程：', nextCourse.title);
                // 跳过倒计时，直接跳转到下一个视频
                window.location.href = nextCourse.playUrl;
            } else {
                console.log('已播放完所有课程或没有找到下一个未完成的课程');
                // 显示课程完成提示
                showCourseCompletedMessage();
            }
        }

        console.log('视频完成消息已发送，调试阶段不自动关闭标签页');

        // 重置视频结束标志，防止无限循环调用
        isVideoEnded = false;
    }

    // 添加自定义事件监听器，用于处理立即结束按钮的点击
    window.addEventListener('endCountdownEvent', endCountdown);

    // 格式化秒数为分钟和秒的格式
    function formatSeconds(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}分${secs}秒`;
    }

    // 生成指定范围内的随机数（毫秒）
    function getRandomMs(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // 从URL列表中随机选择一个URL
    function getRandomUrl() {
        const urls = CONFIG.SESSION_KEEPALIVE_URLS;
        const randomIndex = Math.floor(Math.random() * urls.length);
        return urls[randomIndex];
    }

    // 发送会话保持请求
    function sendSessionKeepaliveRequest(url, urlDesc) {
        // 如果登录已失效，不再发送请求
        if (isSessionExpired) {
            return;
        }

        // 获取当前页面的referer
        const referer = window.location.href;

        // url和urlDesc由调用方传入，确保日志显示与实际请求一致

        // 构建请求头
        const headers = {
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
            'Referer': referer,
            'User-Agent': navigator.userAgent
        };

        // 根据配置决定是否显示详细日志
        if (CONFIG.LOG_LEVEL === 'full') {
            // 显示详细请求信息
            console.log('=== 会话保持请求详情 ===');
            console.log(`请求URL：${url}（${urlDesc}）`);
            console.log(`请求方法：GET`);
            console.log(`请求凭据模式：include`);
            console.log(`当前页面Referer：${referer}`);
            console.log(`请求头：`, JSON.stringify(headers, null, 2));
        }

        // 发送GET请求到选定的页面，保持会话活跃
        fetch(url, {
            method: 'GET',
            credentials: 'include', // 包含当前域名的所有cookie
            headers: headers
        }).then(response => {
            // 根据配置决定是否显示详细日志
            if (CONFIG.LOG_LEVEL === 'full') {
                console.log('=== 会话保持响应详情 ===');
                console.log(`请求URL：${url}（${urlDesc}）`);
                console.log(`响应状态码：${response.status}`);
                console.log(`响应状态文本：${response.statusText}`);
                console.log(`响应头：`, JSON.stringify(Object.fromEntries(response.headers.entries()), null, 2));
            }

            // 检测会话是否过期
            if (response.status === 0) {
                // 响应状态为0，判定会话过期
                log(`登录已失效，原因：响应状态码为0`, 'warn', true);
                handleLoginExpired();
                return;
            }

            // 读取响应内容
            return response.text().then(text => {
                // 打印响应内容（前200字符）
                const truncatedText = text.length > 200 ? text.substring(0, 200) + '...' : text;
                console.log(`📝  响应内容：${truncatedText}`);

                // 移除了保存响应内容到HTML文件的逻辑
                // 直接在控制台打印响应内容的前500个字符，用于调试
                if (CONFIG.DEBUG_MODE) {
                    const truncatedText = text.length > 500 ? text.substring(0, 500) + '...' : text;
                    console.log(`📝  响应内容（前500字符）：${truncatedText}`);
                }

                // 检查响应内容是否包含登录页特征
                let isLoginPage = false;
                let matchedCondition = null;

                // 条件1: title包含"登录入口"
                const titleMatch = text.match(/<title>(.*?)<\/title>/i);
                if (titleMatch && titleMatch[1].includes('登录入口')) {
                    isLoginPage = true;
                    matchedCondition = `title包含"登录入口"`;
                }

                // 条件2-4: 包含三种登录字样
                const loginPatterns = [
                    '用户ID登录',
                    '身份证登录',
                    '手机号登录'
                ];

                for (const pattern of loginPatterns) {
                    if (text.includes(pattern)) {
                        isLoginPage = true;
                        matchedCondition = `包含"${pattern}"字样`;
                        break;
                    }
                }

                // 额外条件：检查是否包含登录相关的HTML结构
                const loginStructures = [
                    /<li[^>]*>用户ID登录<\/li>/i,
                    /<li[^>]*>身份证登录<\/li>/i,
                    /<li[^>]*>手机号登录<\/li>/i
                ];

                for (const pattern of loginStructures) {
                    if (pattern.test(text)) {
                        isLoginPage = true;
                        matchedCondition = `匹配登录相关HTML结构`;
                        break;
                    }
                }

                if (isLoginPage) {
                    // 响应是登录页，判定会话过期
                    log(`登录已失效，原因：${matchedCondition}`, 'warn', true);
                    handleLoginExpired();
                    return;
                }

                // 只在会话未过期时显示成功/失败日志
                if (!isSessionExpired) {
                    if (response.ok) {
                        log(`登录检测，【${urlDesc}】请求成功，登录未失效！`, 'success', true);
                    } else {
                        log(`登录检测，【${urlDesc}】请求失败`, 'error', true);
                    }

                    // 只有会话未过期时才启动下一次会话保持定时器
                    startSessionKeepalive();
                }
            });
        }).catch(error => {
            // 根据配置决定是否显示详细日志
            if (CONFIG.LOG_LEVEL === 'full') {
                console.log('=== 会话保持请求错误 ===');
                console.log(`请求URL：${url}（${urlDesc}）`);
                console.log(`错误信息：`, error);
            }

            // 总是显示重要的错误日志
            log(`请求【${urlDesc}】发生错误`, 'error', true);

            // 只有会话未过期时才启动下一次会话保持定时器
            if (!isSessionExpired) {
                startSessionKeepalive();
            }
        });
    }

    // 启动会话保持定时器
    function startSessionKeepalive() {
        // 将配置的分钟转换为毫秒
        const minMs = CONFIG.SESSION_KEEPALIVE_MIN * 60 * 1000;
        const maxMs = CONFIG.SESSION_KEEPALIVE_MAX * 60 * 1000;

        // 生成随机间隔时间（毫秒）
        const intervalMs = getRandomMs(minMs, maxMs);
        const intervalSeconds = Math.round(intervalMs / 1000);

        // 计算下次执行的具体时间
        const nextExecutionTime = new Date();
        nextExecutionTime.setTime(nextExecutionTime.getTime() + intervalMs);

        // 格式化时间显示
        const timeStr = nextExecutionTime.toLocaleTimeString('zh-CN', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });

        // 提前选择下一次要请求的URL
        const randomIndex = Math.floor(Math.random() * CONFIG.SESSION_KEEPALIVE_URLS.length);
        const url = CONFIG.SESSION_KEEPALIVE_URLS[randomIndex];

        // 获取URL的描述信息
        const urlDesc = {
            'http://www.cmatc.cn/lms/app/lms/student/Userdashboardinfo/show.do': '学院首页页面',
            'http://www.cmatc.cn/lms/app/lms/lesson/Lesson/lookupLessonlist.do': '资源中心页面',
            'http://www.cmatc.cn/lms/app/tms/sfi/StudyContent/year.do': '个人中心页面',
            'http://www.cmatc.cn/lms/app/appsecurity/user/Student/self.do': '个人信息页面'
        }[url] || '未知页面';

        // 使用新的日志格式
        console.log(`将在 ${intervalSeconds} 秒后${timeStr} 请求【${urlDesc}】`);

        // 设置定时器
        setTimeout(() => {
            // 发送会话保持请求，传递选定的URL
            sendSessionKeepaliveRequest(url, urlDesc);
        }, intervalMs);
    }

    // 初始化视频元素
    function initVideoElement() {
        // 如果视频元素不存在，尝试查找
        if (!videoElement) {
            videoElement = findVideoElement();
        }

        if (videoElement) {
            // 设置静音
            if (!videoElement.muted) {
                videoElement.muted = true;
            }

            // 尝试自动播放
            try {
                if (videoElement.paused) {
                    videoElement.play().catch(error => {
                        // 忽略播放失败的错误
                    });
                }
            } catch (error) {
                // 忽略播放错误
            }

            // 确保不重复添加事件监听器
            if (!videoElement.hasEventListenersAdded) {
                // 标记事件监听器已添加
                videoElement.hasEventListenersAdded = true;

                // 监听视频元数据加载完成事件，获取准确时长
                videoElement.addEventListener('loadedmetadata', () => {
                    // 只更新视频时长和学习时长，不进行跳转
                    if (!videoElement.hasLoadedMetadata) {
                        videoElement.hasLoadedMetadata = true;
                        videoDuration = videoElement.duration;

                        // 计算初始学习时长
                        const courseIdentifier = parseCourseIdentifierFromUrl();
                        const uniqueKey = `courseProgress_${courseIdentifier.lessonId}_${courseIdentifier.coursewareId}_${courseIdentifier.lessonGkey}`;
                        const initialProgress = GM_getValue(uniqueKey, 0);
                        if (initialProgress > 0 && videoDuration > 0) {
                            totalLearntime = Math.floor((initialProgress / 100) * videoDuration);
                        } else {
                            totalLearntime = 0;
                        }
                    }
                });

                // 监听视频数据加载完成事件，此时可以安全地设置currentTime
                videoElement.addEventListener('loadeddata', () => {
                    handleVideoLoaded();
                });

                // 监听视频播放进度变化事件，同时更新视频信息
                videoElement.addEventListener('timeupdate', () => {
                    handlePlaybackProgressChange();
                    updateVideoInfo();
                });

                // 监听视频播放事件，确保倒计时启动和静音
                videoElement.addEventListener('play', () => {
                    // 确保视频静音
                    if (!videoElement.muted) {
                        videoElement.muted = true;
                    }

                    if (videoElement.duration > 0 && !isCountdownRunning) {
                        startCountdown();
                    }
                    // 更新视频信息显示
                    updateVideoInfo();
                });

                // 播放课程结束提示音频
                function playCourseAlert() {
                    try {
                        // 如果音频对象不存在，创建一个新的Audio对象
                        if (!courseAlertAudio) {
                            // 使用相对路径，假设课程提示.mp3文件位于脚本所在目录
                            // 如果需要使用绝对路径，可以修改为完整的URL
                            courseAlertAudio = new Audio('http://localhost:8000/课程提示.mp3');
                            console.log('已创建课程提示音频对象');
                        }
                        
                        // 播放音频
                        courseAlertAudio.play().then(() => {
                            console.log('课程结束提示音频已播放');
                        }).catch(error => {
                            console.error('播放课程提示音频失败:', error);
                            // 如果播放失败，尝试重新创建Audio对象
                            courseAlertAudio = null;
                        });
                    } catch (error) {
                        console.error('处理课程提示音频时发生错误:', error);
                    }
                }
                
                // 监听视频结束事件
                videoElement.addEventListener('ended', () => {
                    // 检查视频是否真的播放结束，避免页面刷新时误触发
                    // 视频刚加载时currentTime和duration可能都为0或相近，需要排除这种情况
                    if (videoElement.duration > 10 && videoElement.currentTime >= videoElement.duration - 0.1) {
                        isVideoEnded = true;
                        countdownStartTime = Date.now();
                        console.log('视频已结束，开始延时倒计时');
                    } else {
                        console.log(`视频ended事件被触发，但视频可能刚加载，currentTime: ${videoElement.currentTime.toFixed(2)}s, duration: ${videoElement.duration.toFixed(2)}s`);
                    }
                });
            }

            // 立即检查视频是否已加载完成，如果是则直接处理
            if (videoElement.duration > 0) {
                handleVideoLoaded();
            }

            // 立即更新视频信息和倒计时显示
            updateVideoInfo();
            updateCountdown();
        }
    }

    // 处理视频加载完成逻辑，无论何时调用都能正确设置播放位置
    function handleVideoLoaded() {
        if (!videoElement) return;

        videoDuration = videoElement.duration;

        // 确保视频静音
        if (!videoElement.muted) {
            videoElement.muted = true;
        }

        // 视频加载完成后，根据初始进度和实际视频时长计算准确的学习时长
        const courseIdentifier = parseCourseIdentifierFromUrl();
        const uniqueKey = `courseProgress_${courseIdentifier.lessonId}_${courseIdentifier.coursewareId}_${courseIdentifier.lessonGkey}`;
        const loginProgressKey = `loginBeforeProgress_${courseIdentifier.lessonId}_${courseIdentifier.coursewareId}_${courseIdentifier.lessonGkey}`;

        // 先获取列表页传过来的初始进度
        let initialProgress = GM_getValue(uniqueKey, 0);
        let loginBeforeProgress = null;

        // 检查是否有登录前保存的进度
        const loginBeforeProgressStr = GM_getValue(loginProgressKey, null);
        if (loginBeforeProgressStr) {
            try {
                loginBeforeProgress = JSON.parse(loginBeforeProgressStr);
                log(`发现登录前进度：${loginBeforeProgress.progress}%，优先使用`, 'info', true);

                // 优先使用登录前的进度
                initialProgress = loginBeforeProgress.progress;

                // 使用登录前的学习时长
                if (loginBeforeProgress.totalLearntime > 0) {
                    totalLearntime = loginBeforeProgress.totalLearntime;
                }

                // 删除登录前进度，避免重复使用
                try {
                    if (typeof GM_deleteValue !== 'undefined') {
                        GM_deleteValue(loginProgressKey);
                    } else {
                        // 如果 GM_deleteValue 不可用，使用 GM_setValue 设置为 null
                        GM_setValue(loginProgressKey, null);
                    }
                } catch (error) {
                    // 忽略删除值时的错误
                    log(`删除登录前进度失败：${error.message}`, 'error', true);
                }
            } catch (error) {
                log(`解析登录前进度失败：${error.message}`, 'error', true);
            }
        }

        // 先更新视频信息和进度条，确保进度条显示正确
        updateVideoInfo();

        if (initialProgress > 0 && videoDuration > 0) {
            // 根据实际视频时长和初始进度计算准确的学习时长
            totalLearntime = Math.floor((initialProgress / 100) * videoDuration);

            // 如果初始进度为100%，直接设置视频结束，开始延时倒计时
            if (initialProgress === 100) {
                isVideoEnded = true;
                countdownStartTime = Date.now();
                isCourseCompleted = true;

                // 先强制更新视频进度到100%，确保进度条显示正确
                videoElement.currentTime = videoElement.duration;
                updateVideoInfo();

                // 添加延迟，让进度条先渲染完成
                setTimeout(() => {
                    // 显示初始进度为100%的信息到日志面板
                    const logContent = `📊  初始进度：100%，对应学习时长：${formatSeconds(totalLearntime)}（视频时长：${formatTime(videoDuration)}）`;
                    displayDebugLog(logContent);

                    // 如果设置了自动播放下一节并且跳过已完成视频，则直接显示10秒自动播放弹窗，不需要等待8分钟延时
                        if (CONFIG.AUTO_PLAY_NEXT && CONFIG.SKIP_COMPLETED) {
                            console.log('视频初始进度为100%，且设置了自动播放和跳过已完成视频，将在渲染完日志和进度条后显示10秒自动播放弹窗');
                            // 这条日志只显示到控制台，不显示到界面日志面板

                        // 添加延迟，让程序先渲染完日志和进度条，再显示自动播放弹窗
                        setTimeout(() => {
                            // 查找下一个课程
                            const nextCourse = findNextCourse();
                            if (nextCourse) {
                                // 显示10秒自动播放弹窗
                                showAutoPlayCountdown(nextCourse, CONFIG.AUTO_PLAY_DELAY);
                            } else {
                                console.log('已播放完所有课程或没有找到下一个未完成的课程');
                                // 显示课程完成提示
                                showCourseCompletedMessage();
                            }
                        }, 1500); // 延迟1.5秒，确保日志和进度条渲染完成
                    } else {
                        console.log('视频初始进度为100%，直接开始延时倒计时');
                        displayDebugLog(`⏭️  视频已完成，开始延时倒计时`);
                    }
                }, 500); // 延迟500毫秒，确保进度条先渲染完成
            } else {
                // 确定播放位置
                let playPosition;

                // 如果有登录前的播放位置，优先使用
                if (loginBeforeProgress && loginBeforeProgress.currentTime > 0) {
                    playPosition = loginBeforeProgress.currentTime;
                    log(`使用登录前的播放位置：${formatTime(playPosition)}`, 'info', true);
                } else {
                    // 否则根据初始进度计算对应的播放时间
                    playPosition = (initialProgress / 100) * videoDuration;
                }

                // 检查当前播放位置是否与预期位置相差较大，如果是则跳转
                if (Math.abs(videoElement.currentTime - playPosition) > 1) {
                    videoElement.currentTime = playPosition;
                    console.log(`视频已加载，根据初始进度 ${initialProgress}% 跳转到 ${formatTime(playPosition)} 位置播放`);

                    // 显示修正后的初始进度信息到日志面板
                    const logContent = `📊  初始进度：${initialProgress}%，对应学习时长：${formatSeconds(totalLearntime)}（视频时长：${formatTime(videoDuration)}）`;
                    displayDebugLog(logContent);
                    displayDebugLog(`⏯️  已自动跳转到视频 ${formatTime(playPosition)} 位置继续播放`);
                }
            }
        } else {
            // 如果初始进度为0，重置学习时长
            totalLearntime = 0;
            if (initialProgress === 0) {
                // 显示初始进度为0的信息到日志面板
                const logContent = `📊  初始进度：0%，开始新的学习`;
                displayDebugLog(logContent);
            }
        }

        // 视频加载完成后自动开始倒计时
        if (!isCountdownRunning) {
            startCountdown();
        }

        // 只显示关键信息：视频查找成功、时长、静音状态
        console.log(`视频查找成功，时长：${formatTime(videoDuration)}，已设置静音`);
    }

    // 完成课程处理
    function completeCourse() {
        // 标记课程已完成
        isCourseCompleted = true;

        // 直接将当前课程进度设置为100%并保存到本地存储
        sendProgressUpdateMessage(100);

        // 发送视频完成消息
        sendVideoCompletedMessage();
    }

    // 显示日志到右侧日志框
    function displayConsoleLog(...args) {
        // 如果登录已失效，不处理学习时长相关的日志
        if (isSessionExpired) {
            const logString = args.join(' ');
            // 只处理登录相关的错误日志，跳过学习时长日志
            if (logString.includes('_submitLearnTime') || logString.includes('completed')) {
                return;
            }
        }

        // 获取当前时间
        const now = new Date();
        const timeDisplay = now.toLocaleTimeString('zh-CN', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });

        // 格式化日志内容
        let logString = args.join(' ');

        // 移除日志末尾可能的行号信息（如：recordLearnTime.do:16:10）
        logString = logString.replace(/\s+\S+:\d+:\d+$/g, '');

        // 检查是否为学习时长相关日志
        let isLearnTimeLog = logString.includes('_submitLearnTime') || logString.includes('completed');

        // 如果进度已达到100%，不再显示学习时长相关日志
        if (isProgressReached100 && isLearnTimeLog) {
            return;
        }

        let finalLog = null;
        let seconds = 0;

        // 处理_submitLearnTime日志
        if (logString.includes('=========_submitLearnTime')) {
            if (CONFIG.SHOW_LEARN_TIME_LOGS) {
                const timeMatch = logString.match(/learntime====([^\s]+)/);
                if (timeMatch && timeMatch[1]) {
                    seconds = parseInt(timeMatch[1]);
                    const newTotalTime = totalLearntime + seconds;

                    // 计算进度百分比
                    const progress = Math.min(100, parseFloat(((newTotalTime / videoDuration) * 100).toFixed(2)));

                    // 构造基础日志内容
                    finalLog = `本次学习 ${formatSeconds(seconds)}，累计 ${formatSeconds(newTotalTime)}，当前进度 ${progress}%`;
                    isLearnTimeLog = true;
                }
            }
        }

        // 处理completed日志（学习时长相关）
        else if (logString.includes('completed')) {
            if (CONFIG.SHOW_LEARN_TIME_LOGS) {
                const timeMatch = logString.match(/time====([^\s]+)/);
                if (timeMatch && timeMatch[1]) {
                    seconds = parseInt(timeMatch[1]);
                    const newTotalTime = totalLearntime + seconds;

                    // 计算进度百分比
                    const progress = Math.min(100, parseFloat(((newTotalTime / videoDuration) * 100).toFixed(2)));

                    // 检查累计时长是否超过视频时长
                    if (videoDuration > 0 && newTotalTime >= videoDuration) {
                        // 移除自动发送视频完成消息的逻辑，只显示提示
                        console.log('学习时长已超过视频总时长，但不会自动结束，等待倒计时或手动操作');
                    }
                    finalLog = `完成学习时长计算，总计 ${formatSeconds(seconds)}，累计 ${formatSeconds(newTotalTime)}，进度 ${progress}%`;
                    isLearnTimeLog = true;
                }
            }
        }

        // 处理其他所有日志（控制台日志）
        else {
            // 检查是否为会话保持相关的日志
            // 1. 定时器启动日志：将在 X秒后XX:XX:XX 请求【XXX】
            // 2. 请求结果日志：✅  请求【XXX】成功/失败
            const isTimerLog = logString.includes('将在') && logString.includes('请求【');
            const isResultLog = logString.startsWith('✅  请求【') || logString.startsWith('❌  请求【');
            const isSessionKeepaliveLog = isTimerLog || isResultLog;

            // 检查是否为配置变更日志（这些日志已经由log函数直接添加到面板，不需要在这里重复处理）
            const isConfigLog = logString.includes('已切换为') ||
                               logString.includes('已更新为');

            if (isSessionKeepaliveLog) {
                // 请求结果日志在所有模式下都显示，定时器日志只在完整日志模式下显示
                if (CONFIG.LOG_LEVEL === 'full' || isResultLog) {
                    finalLog = logString;
                    isLearnTimeLog = false;
                }
            } else if (CONFIG.LOG_LEVEL === 'full' && !isConfigLog) {
                // 非会话保持、非配置变更日志只在完整日志模式下显示
                finalLog = logString;
                isLearnTimeLog = false;
            }
            // 配置变更日志不在这里处理，避免与log函数重复
        }

        // 如果最终没有要显示的日志，直接返回
        if (!finalLog) {
            return;
        }

        // 日志去重：只对完全相同的日志进行去重，不同时间戳的日志都应显示
        const nowTime = Date.now();

        // 检查是否为重复日志（完全相同的内容且时间间隔极短）
        if (logString === lastLogContent && nowTime - lastLogTime < 1000) {
            return; // 1秒内完全相同的日志不重复记录
        }

        // 更新累计时长（仅对学习时长日志）
        if (isLearnTimeLog) {
            totalLearntime += seconds;

            // 计算进度百分比
            const progress = Math.min(100, parseFloat(((totalLearntime / videoDuration) * 100).toFixed(2)));

            // 检查进度是否已达到100%
            if (progress >= 100) {
                isProgressReached100 = true;
            }

            // 每次进度更新时都保存进度到本地存储
            sendProgressUpdateMessage(progress);

            // 移除自动结束逻辑，即使学习时长超过视频总时长，也不自动发送视频完成消息
            // 只有倒计时结束或手动点击才会触发下一个视频播放
            if (videoDuration > 0 && totalLearntime >= videoDuration) {
                console.log('学习时长已超过视频总时长，但不会自动结束，等待倒计时或手动操作');
            }
        }

        // 更新最后日志信息
        lastLogTime = nowTime;
        lastLogContent = logString;

        // 获取日志区域
        const logArea = document.getElementById('learn-time-log');
        if (!logArea) return; // 日志区域不存在，跳过

        // 创建日志条目
        const logEntry = document.createElement('div');

        // 设置统一的日志样式，去掉不同颜色和晃动效果
        logEntry.style.cssText = `
            margin: 2px 0;
            padding: 3px 6px;
            border-radius: 4px;
            background: rgba(255, 255, 255, 0.85);
            color: #333333;
            font-size: 9px;
            text-align: left;
            line-height: 1.4;
            box-shadow: 0 1px 1px rgba(0, 0, 0, 0.05);
            transition: all 0.2s ease;
            max-width: 100%;
            overflow: hidden;
            word-wrap: break-word;
            white-space: normal;
        `;

        // 移除悬停效果，避免晃动
        logEntry.onmouseenter = function() {
            this.style.background = 'rgba(245, 245, 245, 0.9)';
        };

        logEntry.onmouseleave = function() {
            this.style.background = 'rgba(255, 255, 255, 0.85)';
        };

        // 检查是否为100%进度的学习时长日志，如果是则添加立即结束按钮
        let is100Progress = false;
        if (isLearnTimeLog) {
            const progressMatch = finalLog.match(/当前进度\s*(\d+(?:\.\d+)?)%/);
            if (progressMatch && parseFloat(progressMatch[1]) >= 100) {
                is100Progress = true;
            }
        }

        if (is100Progress) {
                // 100%进度的学习时长日志，添加立即结束按钮
                logEntry.innerHTML = `${timeDisplay} - ${finalLog.replace(/\s*[（(]立即结束[）)]/, '')} <button onclick="javascript:try {
                    // 创建一个自定义事件来触发结束操作
                    const endEvent = new CustomEvent('endCountdownEvent');
                    window.dispatchEvent(endEvent);
                } catch (e) { console.error('立即结束失败:', e); }" style="margin-left: 8px; padding: 1px 6px; font-size: 8px; background: linear-gradient(135deg, #667eea, #764ba2); color: white; border: none; border-radius: 3px; cursor: pointer; box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1); transition: all 0.2s ease;">立即结束</button>`;
            } else {
                // 普通日志，使用textContent
                logEntry.textContent = `${timeDisplay} - ${finalLog}`;
            }

        // 添加到日志区域
        logArea.appendChild(logEntry);

        // 滚动到底部，显示最新日志
        logArea.scrollTop = logArea.scrollHeight;

        // 限制日志数量，最多保留50条
        const logEntries = logArea.querySelectorAll('div');
        if (logEntries.length > 51) { // 50条日志 + 1条标题
            // 只移除最旧的1条日志，避免清空大量日志
            logEntries[1].remove();
        }
    }

    // 重写指定window对象的console方法
    function overrideConsoleMethods(windowObj) {
        // 保存原始console方法
        const originalLog = windowObj.console.log;
        const originalWarn = windowObj.console.warn;
        const originalError = windowObj.console.error;
        const originalInfo = windowObj.console.info;

        // 使用Object.defineProperty安全地重写console方法，处理只读属性的情况
        try {
            // 重写console.log
            Object.defineProperty(windowObj.console, 'log', {
                value: function() {
                    originalLog.apply(windowObj.console, arguments);
                    displayConsoleLog.apply(this, arguments);
                },
                writable: true,
                configurable: true
            });

            // 重写console.warn
            Object.defineProperty(windowObj.console, 'warn', {
                value: function() {
                    originalWarn.apply(windowObj.console, arguments);
                    displayConsoleLog.apply(this, arguments);
                },
                writable: true,
                configurable: true
            });

            // 重写console.error
            Object.defineProperty(windowObj.console, 'error', {
                value: function() {
                    originalError.apply(windowObj.console, arguments);
                    displayConsoleLog.apply(this, arguments);
                },
                writable: true,
                configurable: true
            });

            // 重写console.info
            Object.defineProperty(windowObj.console, 'info', {
                value: function() {
                    originalInfo.apply(windowObj.console, arguments);
                    displayConsoleLog.apply(this, arguments);
                },
                writable: true,
                configurable: true
            });
        } catch (e) {
            // 忽略可能的错误，如跨域iframe无法访问或console方法不可重写
            console.log('无法重写console方法:', e.message);
        }
    }

    // 拦截AJAX请求，捕获学习时长提交
    function interceptAjaxRequests() {
        // 保存原始XMLHttpRequest
        const originalXHR = XMLHttpRequest;

        // 重写XMLHttpRequest
        XMLHttpRequest = function() {
            const xhr = new originalXHR();
            const originalOpen = xhr.open;
            const originalSend = xhr.send;

            // 重写open方法，记录请求URL
            xhr.open = function() {
                this._url = arguments[1];
                return originalOpen.apply(this, arguments);
            };

            // 重写send方法，检查请求参数
            xhr.send = function(data) {
                // 检查是否是学习时长提交请求
                if (this._url && this._url.includes('recordLearnTimePro.do')) {
                    // 尝试解析请求数据
                    if (typeof data === 'string') {
                        const learnTimeMatch = data.match(/learntime=(\d+)/);
                        if (learnTimeMatch && learnTimeMatch[1]) {
                            const seconds = parseInt(learnTimeMatch[1]);
                            // 去重检查：只对完全相同的请求进行去重，不同时间的请求都应显示
                            const nowTime = Date.now();
                            // 使用原始请求数据作为去重依据，不包含累计时间
                            const originalRequestKey = data;

                            // 只有完全相同的内容且时间间隔极短才视为重复
                                if (!(originalRequestKey === lastLogContent && nowTime - lastLogTime < 1000)) {
                                    // 更新累计时长
                                    totalLearntime += seconds;

                                    // 计算进度百分比
                                    const progress = Math.min(100, Math.floor((totalLearntime / videoDuration) * 100));

                                    // 检查进度是否已达到100%，如果是则不显示日志
                                    if (isProgressReached100) {
                                        console.log('进度已达到100%，不再显示学习时长日志');
                                        return;
                                    }

                                    // 更新进度状态
                                    if (progress >= 100) {
                                        isProgressReached100 = true;
                                    }

                                    // 构造日志内容（不添加文本后缀，改为按钮）
                                    const baseLogContent = `本次学习 ${formatSeconds(seconds)}，累计 ${formatSeconds(totalLearntime)}，当前进度 ${progress}%`;

                                    // 直接显示学习时长提交日志
                                    const now = new Date();
                                    const timeDisplay = now.toLocaleTimeString('zh-CN', {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        second: '2-digit'
                                    });

                                    const logArea = document.getElementById('learn-time-log');
                                    if (logArea) {
                                        const logEntry = document.createElement('div');
                                        logEntry.style.cssText = `
                                            margin: 4px 0;
                                            padding: 5px 8px;
                                            border-radius: 6px;
                                            background: linear-gradient(135deg, rgba(220, 218, 212, 0.8), rgba(200, 198, 192, 0.6));
                                            color: #000000;
                                            font-size: 12px;
                                            text-align: left;
                                            line-height: 1.5;
                                            box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
                                            transition: all 0.2s ease;
                                        `;
                                        logEntry.onmouseenter = function() {
                                            this.style.background = 'linear-gradient(135deg, rgba(200, 198, 192, 0.9), rgba(180, 178, 172, 0.7));';
                                            this.style.transform = 'translateX(2px)';
                                        };

                                        logEntry.onmouseleave = function() {
                                            this.style.background = 'linear-gradient(135deg, rgba(220, 218, 212, 0.8), rgba(200, 198, 192, 0.6))';
                                            this.style.transform = 'translateX(0)';
                                        };

                                        // 如果进度达到100%，添加立即结束按钮
                if (progress >= 100) {
                    // 直接在onclick中实现结束逻辑，不依赖全局函数
                    logEntry.innerHTML = `${timeDisplay} - ${baseLogContent} <button onclick="javascript:try {
                        // 创建一个自定义事件来触发结束操作
                        const endEvent = new CustomEvent('endCountdownEvent');
                        window.dispatchEvent(endEvent);
                    } catch (e) { console.error('立即结束失败:', e); }" style="margin-left: 8px; padding: 2px 8px; font-size: 9px; background: linear-gradient(135deg, #667eea, #764ba2); color: white; border: none; border-radius: 4px; cursor: pointer; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1); transition: all 0.2s ease;">立即结束</button>`;
                } else {
                    logEntry.textContent = `${timeDisplay} - ${baseLogContent}`;
                }

                                        logArea.appendChild(logEntry);
                                        logArea.scrollTop = logArea.scrollHeight;

                                        // 更新最后日志信息，使用原始请求数据作为去重依据
                                        lastLogTime = nowTime;
                                        lastLogContent = originalRequestKey;

                                        // 限制日志数量，最多保留50条
                                        const logEntries = logArea.querySelectorAll('div');
                                        if (logEntries.length > 51) { // 50条日志 + 1条标题
                                            // 只移除最旧的1条日志
                                            logEntries[1].remove();
                                        }
                                    }

                                    // 当进度达到100%时，不自动触发播放下一节视频逻辑
                                    // 只有倒计时结束或手动点击才会触发下一个视频播放
                                    if (videoDuration > 0 && totalLearntime >= videoDuration) {
                                        console.log('真实学习时长已超过视频总时长，但不会自动结束，等待倒计时或手动操作');
                                    }
                                }
                        }
                    }
                }
                return originalSend.apply(this, arguments);
            };

            return xhr;
        };

        XMLHttpRequest.prototype = originalXHR.prototype;
        XMLHttpRequest.DONE = originalXHR.DONE;
    }

    // 监听控制台日志，显示所有日志
    function initConsoleListener() {
        // 重写主窗口的console方法
        overrideConsoleMethods(window);

        // 定期检查并重写iframe的console方法
        setInterval(() => {
            try {
                // 检查主窗口的contentFrame
                if (window.parent && window.parent.contentFrame) {
                    overrideConsoleMethods(window.parent.contentFrame);
                }

                // 检查所有iframe
                const iframes = document.querySelectorAll('iframe');
                iframes.forEach(iframe => {
                    try {
                        if (iframe.contentWindow) {
                            overrideConsoleMethods(iframe.contentWindow);
                        }
                    } catch (e) {
                        // 跨域iframe无法访问，忽略
                    }
                });
            } catch (e) {
                // 忽略可能的跨域错误
            }
        }, 3000);

        // 拦截AJAX请求，捕获学习时长提交
        interceptAjaxRequests();
    }

    // 课程列表页面相关函数

    // 创建右侧课程列表面板
    function createCoursePanel() {
        // 检查面板是否已存在
        let panel = document.getElementById('course-list-panel');
        if (panel) {
            // 清空现有内容
            panel.innerHTML = '';
            return panel;
        }

        // 创建面板容器
        panel = document.createElement('div');
        panel.id = 'course-list-panel';
        panel.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            width: 320px;
            max-height: 90vh;
            background: rgba(255, 255, 255, 0.95);
            border-radius: 12px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(200, 200, 200, 0.3);
            z-index: 999999;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            overflow: hidden;
        `;

        // 创建面板标题
        const title = document.createElement('div');
        title.style.cssText = `
            padding: 15px 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            font-size: 16px;
            font-weight: 600;
            text-align: center;
        `;
        title.textContent = '课程列表';
        panel.appendChild(title);

        // 创建课程列表容器
        const courseListContent = document.createElement('div');
        courseListContent.id = 'course-list-content';
        courseListContent.style.cssText = `
            padding: 15px;
            max-height: calc(90vh - 60px);
            overflow-y: auto;
        `;
        panel.appendChild(courseListContent);

        // 添加到页面
        document.body.appendChild(panel);

        return panel;
    }

    // 添加课程项到右侧面板，使用唯一标识符
    function addCourseToPanel(courseInfo) {
        const courseListContent = document.getElementById('course-list-content');
        if (!courseListContent) return;

        // 创建课程项容器
        const courseItem = document.createElement('div');
        courseItem.style.cssText = `
            margin-bottom: 12px;
            padding: 12px;
            background: rgba(245, 245, 245, 0.8);
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.2s ease;
            border: 1px solid rgba(200, 200, 200, 0.2);
        `;
        // 设置唯一标识符：lessonId、coursewareId、lessonGkey
        courseItem.setAttribute('data-lesson-id', courseInfo.lessonId);
        courseItem.setAttribute('data-courseware-id', courseInfo.coursewareId);
        courseItem.setAttribute('data-lesson-gkey', courseInfo.lessonGkey);
        // 保留原有的data-course-id以便兼容
        courseItem.setAttribute('data-course-id', courseInfo.lessonId);

        // 添加悬停效果
        courseItem.addEventListener('mouseenter', function() {
            this.style.background = 'rgba(230, 230, 230, 0.9)';
            this.style.transform = 'translateX(-5px)';
            this.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
        });

        courseItem.addEventListener('mouseleave', function() {
            this.style.background = 'rgba(245, 245, 245, 0.8)';
            this.style.transform = 'translateX(0)';
            this.style.boxShadow = 'none';
        });

        // 添加点击事件：在新标签打开视频播放页
        courseItem.addEventListener('click', function() {
            // 保存当前课程索引，用于自动播放
            GM_setValue('currentCourseIndex', courseInfo.index);
            window.open(courseInfo.playUrl, '_blank');
            console.log(`已在新标签打开课程：${courseInfo.title}`);
        });

        // 创建课程标题
        const courseTitle = document.createElement('div');
        courseTitle.style.cssText = `
            font-size: 14px;
            font-weight: 500;
            color: #333333;
            margin-bottom: 6px;
            line-height: 1.4;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        `;
        courseTitle.textContent = courseInfo.title;
        courseItem.appendChild(courseTitle);

        // 创建学习时长和进度条容器
        const progressContainer = document.createElement('div');
        progressContainer.style.cssText = `
            margin: 8px 0;
            font-size: 11px;
        `;

        // 创建学习时长显示
        const learnTimeDisplay = document.createElement('div');
        learnTimeDisplay.className = 'learn-time-display';
        learnTimeDisplay.style.cssText = `
            color: #666666;
            margin-bottom: 4px;
        `;
        learnTimeDisplay.textContent = '学习时长：--:-- / --:--';
        progressContainer.appendChild(learnTimeDisplay);

        // 创建进度条容器
        const progressBarContainer = document.createElement('div');
        progressBarContainer.style.cssText = `
            height: 6px;
            background: rgba(200, 200, 200, 0.5);
            border-radius: 3px;
            overflow: hidden;
        `;

        // 创建进度条
        const progressBar = document.createElement('div');
        progressBar.className = 'progress-bar';
        progressBar.style.cssText = `
            height: 100%;
            background: linear-gradient(90deg, rgba(102, 126, 234, 0.8), rgba(118, 75, 162, 0.8));
            width: ${courseInfo.progress || 0}%;
            transition: width 0.3s ease;
            border-radius: 3px;
        `;
        progressBarContainer.appendChild(progressBar);
        progressContainer.appendChild(progressBarContainer);

        // 创建进度百分比显示
        const progressPercentage = document.createElement('div');
        progressPercentage.className = 'progress-percentage';
        progressPercentage.style.cssText = `
            color: #667eea;
            font-weight: 500;
            margin-top: 2px;
            text-align: right;
            font-size: 10px;
        `;
        progressPercentage.textContent = `${courseInfo.progress || 0}%`;
        progressContainer.appendChild(progressPercentage);

        courseItem.appendChild(progressContainer);

        // 创建课程信息行
        const courseInfoRow = document.createElement('div');
        courseInfoRow.style.cssText = `
            font-size: 11px;
            color: #666666;
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: 8px;
        `;

        // 创建序号
        const courseNumber = document.createElement('span');
        courseNumber.textContent = `第 ${courseInfo.index + 1} 节`;
        courseNumber.style.cssText = `
            padding: 2px 6px;
            background: rgba(102, 126, 234, 0.2);
            color: #667eea;
            border-radius: 4px;
            font-weight: 500;
        `;
        courseInfoRow.appendChild(courseNumber);

        // 创建播放图标
        const playIcon = document.createElement('span');
        playIcon.innerHTML = '▶';
        playIcon.style.cssText = `
            color: #667eea;
            font-size: 12px;
            margin-left: 8px;
        `;
        courseInfoRow.appendChild(playIcon);

        courseItem.appendChild(courseInfoRow);

        // 添加到课程列表
        courseListContent.appendChild(courseItem);
    }

    // 主函数：获取课程列表并构建播放URL
    function getCourseList() {
        console.log('=== 开始获取课程列表 ===');

        // 清空全局课程列表，避免重复添加
        courseList = [];

        // 尝试多种选择器匹配课程列表，只保留包含学习按钮的有效课程项
        let courseItems = [];

        // 1. 查找所有学习按钮
        const allLearnButtons = document.querySelectorAll('.learn');
        console.log(`找到 ${allLearnButtons.length} 个学习按钮`);

        if (allLearnButtons.length > 0) {
            // 遍历每个学习按钮，找到其对应的课程行
            courseItems = Array.from(allLearnButtons).map(button => {
                // 找到按钮所在的课程行（tr元素）
                let courseRow = button.parentElement;

                // 向上查找，直到找到tr元素或达到根元素
                while (courseRow && courseRow.tagName.toLowerCase() !== 'tr') {
                    courseRow = courseRow.parentElement;
                    // 防止无限循环
                    if (!courseRow) break;
                }

                return courseRow;
            }).filter(Boolean); // 过滤掉null值

            console.log(`通过学习按钮关联找到 ${courseItems.length} 个课程行`);
        }

        // 2. 如果没有找到课程行，尝试直接从学习按钮构建课程项
        if (courseItems.length === 0 && allLearnButtons.length > 0) {
            courseItems = Array.from(allLearnButtons).map(button => {
                // 获取按钮所在的单元格（td）
                const td = button.parentElement;
                if (td && td.tagName.toLowerCase() === 'td') {
                    // 查找同一行的标题单元格
                    const tr = td.parentElement;
                    if (tr && tr.tagName.toLowerCase() === 'tr') {
                        // 获取第一个td（标题单元格）
                        const titleTd = tr.querySelector('td:first-child');
                        if (titleTd) {
                            const title = titleTd.textContent.trim();
                            return { title: title, button: button };
                        }
                    }
                }
                return null;
            }).filter(Boolean); // 过滤掉null值

            console.log(`通过直接构建找到 ${courseItems.length} 个课程项`);
        }

        // 去重处理：确保每个课程项唯一
        const uniqueCourseItems = [];
        const processedButtons = new Set();

        courseItems.forEach(item => {
            // 获取学习按钮
            let button;
            if (item.button) {
                // 自定义对象类型
                button = item.button;
            } else if (item.querySelector) {
                // DOM元素类型
                button = item.querySelector('.learn');
            }

            // 确保按钮存在且未被处理过
            if (button && !processedButtons.has(button)) {
                processedButtons.add(button);
                uniqueCourseItems.push(item);
            }
        });

        courseItems = uniqueCourseItems;
        console.log(`去重后剩余 ${courseItems.length} 个有效课程项`);

        if (courseItems.length === 0) {
            console.error('未找到课程列表');
            console.log('页面HTML结构预览：', document.body.innerHTML.substring(0, 1000) + '...');
            return;
        }

        console.log(`共找到 ${courseItems.length} 个课程项`);

        // 遍历课程项，获取课程信息
        courseItems.forEach((item, index) => {
            let courseTitle = '未知课程';
            let learnButton = null;

            // 处理不同类型的课程项
            if (item.title && item.button) {
                // 自定义对象类型
                courseTitle = item.title;
                learnButton = item.button;
            } else if (item.querySelector) {
                // DOM元素类型
                // 获取学习按钮
                learnButton = item.querySelector('.learn');

                // 直接从学习按钮所在行的td:first-child中的a标签获取课程标题
                const titleCell = item.querySelector('td:first-child');
                if (titleCell) {
                    const courseLink = titleCell.querySelector('a');
                    if (courseLink) {
                        courseTitle = courseLink.textContent.trim();
                    }
                }
            }

            if (!learnButton) {
                console.log(`课程 ${index + 1}：${courseTitle} - 未找到学习按钮`);
                return;
            }

            // 获取onclick事件中的startLesson函数调用
            const onclickAttr = learnButton.getAttribute('onclick');
            if (!onclickAttr) {
                console.log(`课程 ${index + 1}：${courseTitle} - 学习按钮无onclick事件`);
                return;
            }

            // 解析startLesson函数的参数
            // 匹配模式：startLesson(lessonId,coursewareId,'lessonGkey')
            const paramMatch = onclickAttr.match(/startLesson\((\d+),([^,]+),['"]([^'"]+)['"]\)/);
            if (!paramMatch) {
                console.log(`课程 ${index + 1}：${courseTitle} - 无法解析startLesson参数，onclick: ${onclickAttr}`);
                return;
            }

            const lessonId = paramMatch[1];
            const coursewareId = paramMatch[2].trim();
            const lessonGkey = paramMatch[3];

            // 构建视频播放页面URL
            const playUrl = `http://www.cmatc.cn/lms/app/lms/student/Learn/enter.do?lessonId=${lessonId}&coursewareId=${coursewareId}&lessonGkey=${lessonGkey}&tclessonId=0&lessonOrigin=selflearn`;

            // 每次刷新页面都从页面获取原有进度
            let actualProgress = 0;

            // 查找页面上的课件章节列表，跳过表头行
            const lessonRows = document.querySelectorAll('.table-list tr');

            // 遍历所有行，从第二行开始（跳过表头）
            for (let i = 1; i < lessonRows.length; i++) {
                const row = lessonRows[i];

                // 获取当前行的所有单元格
                const cells = row.querySelectorAll('td');
                if (cells.length < 3) continue; // 确保至少有3个单元格

                // 第一列：课程标题
                const titleCell = cells[0];
                const titleText = titleCell.textContent.trim();

                // 精确匹配课程标题，只匹配完全一致的标题
                // 或者匹配标题的前几个字符，确保能准确匹配
                if (titleText === courseTitle || titleText.startsWith(courseTitle.split(' ')[0])) {
                    // 第二列：进度信息
                    const progressCell = cells[1];

                    // 从进度单元格的title属性获取进度
                    if (progressCell.title && progressCell.title.includes('%')) {
                        const titleMatch = progressCell.title.match(/([\d.]+)%/);
                        if (titleMatch && titleMatch[1]) {
                            actualProgress = parseFloat(titleMatch[1]);
                            console.log(`从单元格title属性获取到课程 ${courseTitle} 进度：${actualProgress}%`);
                            break;
                        }
                    }

                    // 从进度单元格的文本内容获取进度
                    const progressText = progressCell.textContent.trim();
                    if (progressText.includes('%')) {
                        const textMatch = progressText.match(/([\d.]+)%/);
                        if (textMatch && textMatch[1]) {
                            actualProgress = parseFloat(textMatch[1]);
                            console.log(`从单元格文本获取到课程 ${courseTitle} 进度：${actualProgress}%`);
                            break;
                        }
                    }

                    // 从进度条元素获取进度
                    const jinduBG = progressCell.querySelector('.jinduBG');
                    if (jinduBG) {
                        const jinduGreen = jinduBG.querySelector('.jindu_green');
                        if (jinduGreen) {
                            const widthStyle = jinduGreen.style.width;
                            if (widthStyle) {
                                const styleMatch = widthStyle.match(/([\d.]+)%/);
                                if (styleMatch && styleMatch[1]) {
                                    actualProgress = parseFloat(styleMatch[1]);
                                    console.log(`从进度条样式获取到课程 ${courseTitle} 进度：${actualProgress}%`);
                                    break;
                                }
                            }
                        }
                    }

                    console.log(`无法从页面获取课程 ${courseTitle} 进度，使用默认值 0%`);
                    break;
                }
            }

            // 从本地存储获取已保存的进度，使用唯一key：lessonId_coursewareId_lessonGkey
            const uniqueKey = `courseProgress_${lessonId}_${coursewareId}_${lessonGkey}`;
            const savedProgress = GM_getValue(uniqueKey, -1);

            // 刷新页面时，优先使用页面上的最新进度
            // 始终以页面进度为准，更新本地存储
            // 确保本地存储的进度与页面保持一致
            const finalProgress = actualProgress;

            console.log(`课程 ${courseTitle} 页面进度：${actualProgress}%，本地存储进度：${savedProgress === -1 ? '无' : savedProgress}%，最终使用页面进度：${finalProgress}%，存储key：${uniqueKey}`);

            // 保存页面进度到本地存储，确保本地存储始终是最新的
            GM_setValue(uniqueKey, finalProgress);
            console.log(`已将课程 ${courseTitle} 页面进度 ${finalProgress}% 更新到本地存储，存储key：${uniqueKey}`);

            // 保存课程信息到全局列表
            const courseInfo = {
                index: index,
                title: courseTitle,
                lessonId: lessonId,
                coursewareId: coursewareId,
                lessonGkey: lessonGkey,
                playUrl: playUrl,
                progress: finalProgress
            };
            courseList.push(courseInfo);

            // 打印课程信息和播放URL
            console.log(`\n=====================================`);
            console.log(`课程 ${index + 1}：`);
            console.log(`  标题：${courseTitle}`);
            console.log(`  lessonId：${lessonId}`);
            console.log(`  coursewareId：${coursewareId}`);
            console.log(`  lessonGkey：${lessonGkey}`);
            console.log(`  播放URL：${playUrl}`);
            console.log(`  页面原有进度：${actualProgress}%`);
            console.log(`  本地保存进度：${savedProgress}%`);
            console.log(`  最终显示进度：${finalProgress}%`);

            // 在原有学习按钮后添加自动学习按钮
            if (learnButton) {
                // 隐藏原有学习按钮
                learnButton.style.display = 'none';

                // 创建自动学习按钮
                const autoLearnButton = document.createElement('a');
                autoLearnButton.className = 'auto-learn';
                autoLearnButton.textContent = '自动学习';
                autoLearnButton.style.cssText = `
                    margin-left: 8px;
                    padding: 4px 8px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    border-radius: 4px;
                    text-decoration: none;
                    font-size: 12px;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
                `;

                // 添加悬停效果
                autoLearnButton.addEventListener('mouseenter', function() {
                    this.style.transform = 'translateY(-1px)';
                    this.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.4)';
                });

                autoLearnButton.addEventListener('mouseleave', function() {
                    this.style.transform = 'translateY(0)';
                    this.style.boxShadow = '0 2px 8px rgba(102, 126, 234, 0.3)';
                });

                // 添加点击事件，新标签打开视频播放页面
                autoLearnButton.addEventListener('click', function(e) {
                    e.preventDefault();
                    // 保存当前课程索引，用于自动播放
                    GM_setValue('currentCourseIndex', index);
                    // 在新标签打开视频播放页面
                    window.open(courseInfo.playUrl, '_blank');
                    console.log(`已在新标签打开自动学习课程：${courseTitle}`);
                });

                // 检查是否已经存在自动学习按钮，如果存在则跳过
                const existingAutoLearnButtons = learnButton.parentNode.querySelectorAll('.auto-learn');
                let buttonExists = false;
                existingAutoLearnButtons.forEach(btn => {
                    // 检查按钮是否已经添加到当前学习按钮之后
                    if (btn === learnButton.nextSibling) {
                        buttonExists = true;
                    }
                });

                if (!buttonExists) {
                    // 将自动学习按钮添加到原有学习按钮的父元素中
                    learnButton.parentNode.insertBefore(autoLearnButton, learnButton.nextSibling);
                }
            }
        });

        // 发送课程列表就绪消息
        sendCourseListReadyMessage();

        console.log('\n=== 课程列表获取完成22222 ===');
    }

    // 等待课程内容加载
    function waitForCourseContent() {
        console.log('=== 等待课程内容加载 ===');

        // 检查是否有课程列表
        const hasCourseList = document.querySelector('.table-list') ||
                             document.querySelectorAll('.learn').length > 0;

        if (hasCourseList) {
            getCourseList();
        } else {
            // 等待2秒后重试，最多重试5次
            let retryCount = 0;
            const maxRetries = 5;

            const retryInterval = setInterval(() => {
                retryCount++;
                console.log(`重试获取课程列表 (${retryCount}/${maxRetries})`);

                const hasCourseListNow = document.querySelector('.table-list') ||
                                      document.querySelectorAll('.learn').length > 0;

                if (hasCourseListNow || retryCount >= maxRetries) {
                    clearInterval(retryInterval);
                    if (hasCourseListNow) {
                        getCourseList();
                    } else {
                        console.error('超时未找到课程列表，尝试直接获取学习按钮');
                        // 直接尝试获取所有学习按钮
                        const learnButtons = document.querySelectorAll('.learn');
                        if (learnButtons.length > 0) {
                            console.log(`找到 ${learnButtons.length} 个学习按钮，尝试解析`);
                            getCourseList();
                        } else {
                            console.error('未找到任何学习按钮');
                        }
                    }
                }
            }, 2000);
        }
    }

    // 视频播放页面初始化
    function initVideoPlayPage() {
        console.log('视频播放页面初始化');

        // 初始化广播频道
        initBroadcastChannel();

        // 立即重写console方法，确保能捕获所有日志
        initConsoleListener();

        // 从本地存储获取当前视频的初始进度
        const courseIdentifier = parseCourseIdentifierFromUrl();
        const uniqueKey = `courseProgress_${courseIdentifier.lessonId}_${courseIdentifier.coursewareId}_${courseIdentifier.lessonGkey}`;
        const initialProgress = GM_getValue(uniqueKey, 0);
        console.log(`从本地存储获取到当前视频的初始进度为 ${initialProgress}%，存储key: ${uniqueKey}`);

        // 根据初始进度计算对应的学习时长，作为totalLearntime的初始值
        // 注意：此时videoDuration可能还未获取，需要在视频加载完成后重新计算
        if (initialProgress > 0) {
            // 只在控制台显示估算信息，不在日志面板显示，避免用户看到不准确的估算值
            console.log(`根据初始进度 ${initialProgress}% 估算初始学习时长，将在视频加载完成后显示准确值`);
        }

        // 添加窗口关闭事件监听
        addWindowCloseListener();

        // 从本地存储读取课程列表，使用当前课程的lessonId作为前缀
        const currentUrl = window.location.href;
        const currentLessonId = currentUrl.match(/lessonId=(\d+)/)?.[1] || 'unknown';

        // 尝试使用当前lessonId读取课程列表
        const savedCourseList = GM_getValue(`courseList_${currentLessonId}`, null);
        if (savedCourseList) {
            try {
                courseList = JSON.parse(savedCourseList);

                updateCurrentCourseIndex();

                // 只恢复当前课程的进度，不恢复所有课程
                if (currentCourseIndex !== -1 && courseList[currentCourseIndex]) {
                    const currentCourse = courseList[currentCourseIndex];
                    const uniqueKey = `courseProgress_${currentCourse.lessonId}_${currentCourse.coursewareId}_${currentCourse.lessonGkey}`;
                    const savedProgress = GM_getValue(uniqueKey, -1);
                    if (savedProgress !== -1) {
                        currentCourse.progress = savedProgress;
                        console.log(`已从本地存储恢复当前课程 "${currentCourse.title}" 的进度为 ${savedProgress}%，存储key: ${uniqueKey}`);
                    }
                }

                console.log('从本地存储读取课程列表，共', courseList.length, '个课程，存储key:', `courseList_${currentLessonId}`);

                // 只打印当前课程的详情，不打印完整课程列表
                if (currentCourseIndex !== -1 && courseList[currentCourseIndex]) {
                    const currentCourse = courseList[currentCourseIndex];
                    console.log('当前课程信息:', {
                        title: currentCourse.title,
                        lessonId: currentCourse.lessonId,
                        coursewareId: currentCourse.coursewareId,
                        progress: currentCourse.progress
                    });
                }
                // 更新课程列表显示
                updateCourseListDisplay();
            } catch (error) {
                console.error('从本地存储读取课程列表失败:', error);
                courseList = [];
            }
        } else {
            console.log('本地存储中没有找到匹配当前课程的课程列表，将尝试请求课程列表');
        }

        // 等待DOM加载完成后再执行DOM相关操作
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                // 初始化视频元素
                initVideoElement();

                // 如果找到视频元素，创建UI
                if (videoElement) {
                    createVideoUI();
                } else {
                    // 如果没有找到视频元素，尝试定期查找
                    let searchAttempts = 0;
                    const maxAttempts = 20; // 最多尝试20次，每次间隔1秒
                    const videoCheckInterval = setInterval(() => {
                        searchAttempts++;

                        console.log(`正在尝试查找视频元素 (${searchAttempts}/${maxAttempts})...`);

                        // 检查视频元素是否已经存在
                        if (videoElement) {
                            clearInterval(videoCheckInterval);
                            console.log('视频元素已存在，停止定期查找');
                            return;
                        }

                        // 检查是否已经尝试了足够次数
                        if (searchAttempts >= maxAttempts) {
                            clearInterval(videoCheckInterval);
                            console.log('已尝试多次查找视频元素，仍未找到');
                            return;
                        }

                        videoElement = findVideoElement();
                        if (videoElement) {
                            clearInterval(videoCheckInterval);
                            console.log('找到视频元素，开始初始化');

                            // 直接调用initVideoElement函数，避免重复代码
                            initVideoElement();

                            // 创建UI
                            createVideoUI();
                        }
                    }, CONFIG.CHECK_INTERVAL);
                }

                // 启动会话保持
                startSessionKeepalive();

                // 启动视频元素变化监听
                addVideoMutationObserver();

                // 如果本地存储中没有课程列表，主动请求课程列表
                if (courseList.length === 0) {
                    console.log('本地存储中没有课程列表，主动请求课程列表');
                    if (broadcastChannel) {
                        broadcastChannel.postMessage({
                            type: 'requestCourseList',
                            currentTime: Date.now()
                        });
                    }
                }
            });
        } else {
            // DOM已加载完成，直接执行
            // 初始化视频元素
            initVideoElement();

            // 启动视频元素变化监听
            addVideoMutationObserver();

            // 如果找到视频元素，创建UI
            if (videoElement) {
                createVideoUI();
            } else {
                // 如果没有找到视频元素，尝试定期查找
                let searchAttempts = 0;
                const maxAttempts = 20; // 最多尝试20次，每次间隔1秒
                const videoCheckInterval = setInterval(() => {
                    searchAttempts++;

                    console.log(`正在尝试查找视频元素 (${searchAttempts}/${maxAttempts})...`);

                    // 检查视频元素是否已经存在
                    if (videoElement) {
                        clearInterval(videoCheckInterval);
                        console.log('视频元素已存在，停止定期查找');
                        return;
                    }

                    // 检查是否已经尝试了足够次数
                    if (searchAttempts >= maxAttempts) {
                        clearInterval(videoCheckInterval);
                        console.log('已尝试多次查找视频元素，仍未找到');
                        return;
                    }

                    videoElement = findVideoElement();
                    if (videoElement) {
                        clearInterval(videoCheckInterval);
                        console.log('找到视频元素，开始初始化');

                        // 直接调用initVideoElement函数，避免重复代码
                        initVideoElement();

                        // 创建UI
                        createVideoUI();
                    }
                }, CONFIG.CHECK_INTERVAL);
            }

            // 启动会话保持
            startSessionKeepalive();

            // 如果本地存储中没有课程列表，主动请求课程列表
            if (courseList.length === 0) {
                console.log('本地存储中没有课程列表，主动请求课程列表');
                if (broadcastChannel) {
                    broadcastChannel.postMessage({
                        type: 'requestCourseList',
                        currentTime: Date.now()
                    });
                }
            }
        }
    }

    // 课程列表页面初始化
    function initCourseListPage() {
        console.log('课程列表页面初始化');

        // 初始化广播频道
        initBroadcastChannel();

        // 加载当天登录日志到面板
        loadLoginLogToPanel();

        // 等待DOM加载完成后再执行DOM相关操作
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                waitForCourseContent();
            });
        } else {
            // DOM已加载完成，直接执行
            waitForCourseContent();
        }

        // 添加DOM变化监听，确保动态加载内容也能被捕获
        const observer = new MutationObserver(() => {
            // 当DOM发生变化时，检查是否有新的学习按钮添加
            const learnButtons = document.querySelectorAll('.learn');
            if (learnButtons.length > 0) {
                console.log('检测到DOM变化，可能有新的课程内容加载');
                observer.disconnect(); // 停止监听
                getCourseList();
            }
        });

        // 监听课程内容区域的变化
        let contentContainer = document.querySelector('.contbox');

        // 确保contentContainer是有效的Node对象
        if (!contentContainer || !(contentContainer instanceof Node)) {
            contentContainer = document.body;
        }

        // 再次检查contentContainer是否有效
        if (contentContainer && contentContainer instanceof Node) {
            observer.observe(contentContainer, {
                childList: true,
                subtree: true,
                attributes: false
            });
        } else {
            console.error('无法获取有效的contentContainer，MutationObserver未启动');
        }

        console.log('气象课程列表获取器已启动，正在等待课程内容加载...');
    }

    // 主初始化函数
    function init() {
        // 获取当前页面URL
        const currentUrl = window.location.href;

        // 检查是否已经创建了面板
        if (document.getElementById('combined-panel')) {
            console.log('气象学习综合工具：已经创建了面板，不再重复创建');
            return;
        }

        // 检查是否在iframe中执行，只在顶层窗口执行
        if (window.self !== window.top) {
            console.log('气象学习综合工具：在iframe中执行，已自动退出');
            return;
        }

        console.log('气象学习综合工具已启动111111111');

        // 检测当前页面类型
        currentPageType = detectPageType();
        console.log(`当前页面类型：${currentPageType}`);

        // 根据页面类型执行不同的初始化操作
        if (currentPageType === 'videoPlay') {
            // 视频播放页面
            initVideoPlayPage();
        } else if (currentPageType === 'courseList') {
            // 课程列表页面
            initCourseListPage();
        } else {
            console.log('当前页面不是目标页面，脚本将不执行任何操作');
        }
    }

    // 启动脚本
    init();
})();