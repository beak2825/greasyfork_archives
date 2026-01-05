// ==UserScript==
// @name         AI Chat翻译助手
// @namespace    https://translate-assistant.com
// @license      lsr
// @version      2.7.1
// @description  智能AI翻译助手，支持全页翻译、划词翻译、悬浮翻译等多种模式，集成多家翻译API，自动检测语言并智能显示翻译按钮（增强360极速浏览器X兼容性）
// @author       Your Name
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_registerMenuCommand
// @grant        GM_notification
// @grant        GM_setClipboard
// @grant        GM_addStyle
// @run-at       document-end
// @icon         https://translate-assistant.com/favicon.ico
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/clipboard.js/2.0.8/clipboard.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.21/lodash.min.js
// @downloadURL https://update.greasyfork.org/scripts/558853/AI%20Chat%E7%BF%BB%E8%AF%91%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/558853/AI%20Chat%E7%BF%BB%E8%AF%91%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // MD5加密函数（用于百度、有道等API的签名生成）
    function md5(str) {
        const rotateLeft = function(lValue, iShiftBits) {
            return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
        };
        
        const addUnsigned = function(lX, lY) {
            const lX4 = lX & 0x40000000;
            const lY4 = lY & 0x40000000;
            const lX8 = lX & 0x80000000;
            const lY8 = lY & 0x80000000;
            const lResult = (lX & 0x3FFFFFFF) + (lY & 0x3FFFFFFF);
            
            if (lX4 & lY4) return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
            if (lX4 | lY4) {
                if (lResult & 0x40000000) return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
                else return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
            }
            else return (lResult ^ lX8 ^ lY8);
        };
        
        const F = function(x, y, z) { return (x & y) | ((~x) & z); };
        const G = function(x, y, z) { return (x & z) | (y & (~z)); };
        const H = function(x, y, z) { return (x ^ y ^ z); };
        const I = function(x, y, z) { return (y ^ (x | (~z))); };
        
        const FF = function(a, b, c, d, x, s, ac) {
            a = addUnsigned(a, addUnsigned(addUnsigned(F(b, c, d), x), ac));
            return addUnsigned(rotateLeft(a, s), b);
        };
        
        const GG = function(a, b, c, d, x, s, ac) {
            a = addUnsigned(a, addUnsigned(addUnsigned(G(b, c, d), x), ac));
            return addUnsigned(rotateLeft(a, s), b);
        };
        
        const HH = function(a, b, c, d, x, s, ac) {
            a = addUnsigned(a, addUnsigned(addUnsigned(H(b, c, d), x), ac));
            return addUnsigned(rotateLeft(a, s), b);
        };
        
        const II = function(a, b, c, d, x, s, ac) {
            a = addUnsigned(a, addUnsigned(addUnsigned(I(b, c, d), x), ac));
            return addUnsigned(rotateLeft(a, s), b);
        };
        
        const convertToWordArray = function(str) {
            let lWordCount;
            const lMessageLength = str.length;
            const lNumberOfWords_temp1 = lMessageLength + 8;
            const lNumberOfWords_temp2 = (lNumberOfWords_temp1 - (lNumberOfWords_temp1 % 64)) / 64;
            const lNumberOfWords = (lNumberOfWords_temp2 + 1) * 16;
            const lWordArray = new Array(lNumberOfWords - 1);
            let lBytePosition = 0;
            let lByteCount = 0;
            
            while (lByteCount < lMessageLength) {
                lWordCount = (lByteCount - (lByteCount % 4)) / 4;
                lBytePosition = (lByteCount % 4) * 8;
                lWordArray[lWordCount] = (lWordArray[lWordCount] | (str.charCodeAt(lByteCount) << lBytePosition));
                lByteCount++;
            }
            
            lWordCount = (lByteCount - (lByteCount % 4)) / 4;
            lBytePosition = (lByteCount % 4) * 8;
            lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80 << lBytePosition);
            lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
            lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
            
            return lWordArray;
        };
        
        const wordToHex = function(lValue) {
            let wordToHexValue = '', wordToHexValue_temp = '', lByte, lCount;
            
            for (lCount = 0; lCount <= 3; lCount++) {
                lByte = (lValue >>> (lCount * 8)) & 255;
                wordToHexValue_temp = '0' + lByte.toString(16);
                wordToHexValue = wordToHexValue + wordToHexValue_temp.substr(wordToHexValue_temp.length - 2, 2);
            }
            
            return wordToHexValue;
        };
        
        const x = convertToWordArray(str);
        let a = 0x67452301, b = 0xEFCDAB89, c = 0x98BADCFE, d = 0x10325476;
        
        const S11=7, S12=12, S13=17, S14=22;
        const S21=5, S22=9 , S23=14, S24=20;
        const S31=4, S32=11, S33=16, S34=23;
        const S41=6, S42=10, S43=15, S44=21;
        
        for (let k = 0; k < x.length; k += 16) {
            const AA = a, BB = b, CC = c, DD = d;
            
            a = FF(a, b, c, d, x[k+0],  S11, 0xD76AA478);
            d = FF(d, a, b, c, x[k+1],  S12, 0xE8C7B756);
            c = FF(c, d, a, b, x[k+2],  S13, 0x242070DB);
            b = FF(b, c, d, a, x[k+3],  S14, 0xC1BDCEEE);
            a = FF(a, b, c, d, x[k+4],  S11, 0xF57C0FAF);
            d = FF(d, a, b, c, x[k+5],  S12, 0x4787C62A);
            c = FF(c, d, a, b, x[k+6],  S13, 0xA8304613);
            b = FF(b, c, d, a, x[k+7],  S14, 0xFD469501);
            a = FF(a, b, c, d, x[k+8],  S11, 0x698098D8);
            d = FF(d, a, b, c, x[k+9],  S12, 0x8B44F7AF);
            c = FF(c, d, a, b, x[k+10], S13, 0xFFFF5BB1);
            b = FF(b, c, d, a, x[k+11], S14, 0x895CD7BE);
            a = FF(a, b, c, d, x[k+12], S11, 0x6B901122);
            d = FF(d, a, b, c, x[k+13], S12, 0xFD987193);
            c = FF(c, d, a, b, x[k+14], S13, 0xA679438E);
            b = FF(b, c, d, a, x[k+15], S14, 0x49B40821);
            
            a = GG(a, b, c, d, x[k+1],  S21, 0xF61E2562);
            d = GG(d, a, b, c, x[k+6],  S22, 0xC040B340);
            c = GG(c, d, a, b, x[k+11], S23, 0x265E5A51);
            b = GG(b, c, d, a, x[k+0],  S24, 0xE9B6C7AA);
            a = GG(a, b, c, d, x[k+5],  S21, 0xD62F105D);
            d = GG(d, a, b, c, x[k+10], S22, 0x2441453);
            c = GG(c, d, a, b, x[k+15], S23, 0xD8A1E681);
            b = GG(b, c, d, a, x[k+4],  S24, 0xE7D3FBC8);
            a = GG(a, b, c, d, x[k+9],  S21, 0x21E1CDE6);
            d = GG(d, a, b, c, x[k+14], S22, 0xC33707D6);
            c = GG(c, d, a, b, x[k+3],  S23, 0xF4D50D87);
            b = GG(b, c, d, a, x[k+8],  S24, 0x455A14ED);
            a = GG(a, b, c, d, x[k+13], S21, 0xA9E3E905);
            d = GG(d, a, b, c, x[k+2],  S22, 0xFCEFA3F8);
            c = GG(c, d, a, b, x[k+7],  S23, 0x676F02D9);
            b = GG(b, c, d, a, x[k+12], S24, 0x8D2A4C8A);
            
            a = HH(a, b, c, d, x[k+5],  S31, 0xFFFA3942);
            d = HH(d, a, b, c, x[k+8],  S32, 0x8771F681);
            c = HH(c, d, a, b, x[k+11], S33, 0x6D9D6122);
            b = HH(b, c, d, a, x[k+14], S34, 0xFDE5380C);
            a = HH(a, b, c, d, x[k+1],  S31, 0xA4BEEA44);
            d = HH(d, a, b, c, x[k+4],  S32, 0x4BDECFA9);
            c = HH(c, d, a, b, x[k+7],  S33, 0xF6BB4B60);
            b = HH(b, c, d, a, x[k+10], S34, 0xBEBFBC70);
            a = HH(a, b, c, d, x[k+13], S31, 0x289B7EC6);
            d = HH(d, a, b, c, x[k+0],  S32, 0xEAA127FA);
            c = HH(c, d, a, b, x[k+3],  S33, 0xD4EF3085);
            b = HH(b, c, d, a, x[k+6],  S34, 0x4881D05);
            a = HH(a, b, c, d, x[k+9],  S31, 0xD9D4D039);
            d = HH(d, a, b, c, x[k+12], S32, 0xE6DB99E5);
            c = HH(c, d, a, b, x[k+15], S33, 0x1FA27CF8);
            b = HH(b, c, d, a, x[k+2],  S34, 0xC4AC5665);
            
            a = II(a, b, c, d, x[k+0],  S41, 0xF4292244);
            d = II(d, a, b, c, x[k+7],  S42, 0x432AFF97);
            c = II(c, d, a, b, x[k+14], S43, 0xAB9423A7);
            b = II(b, c, d, a, x[k+5],  S44, 0xFC93A039);
            a = II(a, b, c, d, x[k+12], S41, 0x655B59C3);
            d = II(d, a, b, c, x[k+3],  S42, 0x8F0CCC92);
            c = II(c, d, a, b, x[k+10], S43, 0xFFEFF47D);
            b = II(b, c, d, a, x[k+1],  S44, 0x85845DD1);
            a = II(a, b, c, d, x[k+8],  S41, 0x6FA87E4F);
            d = II(d, a, b, c, x[k+15], S42, 0xFE2CE6E0);
            c = II(c, d, a, b, x[k+6],  S43, 0xA3014314);
            b = II(b, c, d, a, x[k+13], S44, 0x4E0811A1);
            a = II(a, b, c, d, x[k+4],  S41, 0xF7537E82);
            d = II(d, a, b, c, x[k+11], S42, 0xBD3AF235);
            c = II(c, d, a, b, x[k+2],  S43, 0x2AD7D2BB);
            b = II(b, c, d, a, x[k+9],  S44, 0xEB86D391);
            
            a = addUnsigned(a, AA);
            b = addUnsigned(b, BB);
            c = addUnsigned(c, CC);
            d = addUnsigned(d, DD);
        }
        
        return (wordToHex(a) + wordToHex(b) + wordToHex(c) + wordToHex(d)).toLowerCase();
    }

    // 简单的字符串哈希函数（用于生成缓存键）
    function hash(str) {
        let hash = 5381;
        for (let i = 0; i < str.length; i++) {
            hash = ((hash << 5) + hash) + str.charCodeAt(i);
        }
        return hash.toString(36);
    }

    // 域名匹配函数
    function matchDomain(domainPattern, currentDomain) {
        // 处理通配符模式
        if (domainPattern.startsWith('*.')) {
            const suffix = domainPattern.substring(2);
            return currentDomain === suffix || currentDomain.endsWith('.' + suffix);
        }
        // 精确匹配
        return domainPattern === currentDomain;
    }

    // 检查当前域名是否被屏蔽
    function isDomainBlocked() {
        const blockedDomains = GM_getValue('blocked_domains', '');
        if (!blockedDomains) return false;
        
        const domains = blockedDomains.split('\n').map(d => d.trim()).filter(d => d);
        const currentDomain = window.location.hostname;
        
        const isBlocked = domains.some(domain => matchDomain(domain, currentDomain));
        
        if (isBlocked) {
            console.log(`域名 ${currentDomain} 被屏蔽`);
        }
        
        return isBlocked;
    }

    // 全局配置对象
    const config = {
        translation: {
            defaultService: 'google',
            autoDetect: true,
            sourceLang: 'auto',
            targetLang: 'zh-CN',
            timeout: 10000,
            maxRetries: 3,
            concurrentRequests: 15
        },
        ui: {
            theme: 'light',
            panelPosition: { x: 100, y: 100 },
            panelLocked: false,
            showProgress: true,
            showWordCount: true
        },
        features: {
            fullPageTranslation: true,
            wordTranslation: true,
            hoverTranslation: true,
            paragraphTranslation: true,
            cacheEnabled: true,
            autoUpdate: true,
            languageDetection: true,
            autoShowButton: true,
            wordTranslate: false,  // 划词翻译功能默认关闭
            hoverTranslate: false,  // 悬浮翻译功能默认关闭
            domainBlocked: false   // 域名是否被屏蔽
        },
        shortcut: {
            translate: 'Ctrl+Shift+T',
            togglePanel: 'Alt+T'
        }
    };

    // API服务配置
    const apiServices = {
        google: {
            name: 'Google Translate',
            endpoint: 'https://translate.googleapis.com/translate_a/single',
            requiresKey: false
        },
        baidu: {
            name: 'Baidu Translate',
            endpoint: 'https://fanyi-api.baidu.com/api/trans/vip/translate',
            requiresKey: true
        },
        youdao: {
            name: 'Youdao Translate',
            endpoint: 'https://openapi.youdao.com/api',
            requiresKey: true
        },
        siliconflow: {
            name: 'SiliconFlow',
            endpoint: 'https://api.siliconflow.cn/v1/chat/completions',
            requiresKey: true
        },
        deepseek: {
            name: 'DeepSeek',
            endpoint: 'https://api.deepseek.com/v1/chat/completions',
            requiresKey: true
        },
        custom: {
            name: 'Custom Model',
            endpoint: '', // 将在运行时从设置中获取
            requiresKey: true
        }
    };

    // 全局语言映射函数
    function mapLangCode(langCode, service) {
        const langMaps = {
            baidu: {
                'zh-CN': 'zh', 'zh-TW': 'cht', 'en': 'en', 'ja': 'jp', 
                'ko': 'kor', 'fr': 'fra', 'de': 'de', 'es': 'spa', 
                'ru': 'ru', 'pt': 'pt', 'it': 'it', 'ar': 'ara', 'hi': 'hi', 'auto': 'auto'
            },
            youdao: {
                'zh-CN': 'zh-CHS', 'zh-TW': 'zh-CHT', 'en': 'en', 
                'ja': 'ja', 'ko': 'ko', 'fr': 'fr', 'de': 'de', 
                'es': 'es', 'ru': 'ru', 'pt': 'pt', 'it': 'it', 'ar': 'ar', 'hi': 'hi', 'auto': 'auto'
            }
        };

        if (langMaps[service] && langMaps[service][langCode]) {
            return langMaps[service][langCode];
        }
        return langCode;
    }

    // 语言检测类
    class LanguageDetector {
        constructor() {
            this.pageLanguage = null;
            this.systemLanguage = navigator.language || navigator.userLanguage;
        }

        // 检测页面语言
        detectPageLanguage() {
            // 优先从HTML标签获取
            let lang = document.documentElement.lang || 
                      document.querySelector('meta[http-equiv="content-language"]')?.content ||
                      document.querySelector('meta[name="language"]')?.content;
            
            if (!lang) {
                // 通过文本内容判断
                lang = this.detectByContent();
            }
            
            this.pageLanguage = this.normalizeLangCode(lang);
            console.log('检测到页面语言:', this.pageLanguage);
            return this.pageLanguage;
        }

        // 通过内容检测语言
        detectByContent() {
            const sampleText = document.body.innerText.substring(0, 3000);
            
            // 统计各类字符
            const chineseChars = sampleText.match(/[\u4e00-\u9fa5]/g);
            const englishChars = sampleText.match(/[a-zA-Z]/g);
            const japaneseChars = sampleText.match(/[\u3040-\u309f\u30a0-\u30ff]/g);
            const koreanChars = sampleText.match(/[\uac00-\ud7af]/g);
            const arabicChars = sampleText.match(/[\u0600-\u06FF]/g);
            
            const counts = {
                'zh': chineseChars ? chineseChars.length : 0,
                'en': englishChars ? englishChars.length : 0,
                'ja': japaneseChars ? japaneseChars.length : 0,
                'ko': koreanChars ? koreanChars.length : 0,
                'ar': arabicChars ? arabicChars.length : 0
            };
            
            // 计算中文字符占比
            const totalChars = Object.values(counts).reduce((sum, count) => sum + count, 0);
            const chineseRatio = totalChars > 0 ? counts['zh'] / totalChars : 0;
            
            // 如果中文字符占比超过25%,认为是中文页面
            if (chineseRatio > 0.25) {
                return 'zh';
            }
            
            // 检查是否包含明显的中文标点符号和常用汉字
            const chinesePunctuation = sampleText.match(/[，。！？；：''（）【】《》]/g);
            const commonChineseWords = sampleText.match(/[的一是不了人我在有他这为之大来以个中上们]/g);
            
            const punctuationCount = chinesePunctuation ? chinesePunctuation.length : 0;
            const commonWordsCount = commonChineseWords ? commonChineseWords.length : 0;
            
            // 如果有足够多的中文标点和常用字，也认为是中文
            if (punctuationCount > 5 && commonWordsCount > 10) {
                return 'zh';
            }
            
            // 否则找出最多的语言
            const maxLang = Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
            return maxLang;
        }

        // 标准化语言代码
        normalizeLangCode(langCode) {
            if (!langCode) return 'en';
            
            langCode = langCode.toLowerCase();
            const map = {
                'zh': 'zh-CN',
                'zh-cn': 'zh-CN',
                'zh-hans': 'zh-CN',
                'zh-tw': 'zh-TW',
                'zh-hk': 'zh-TW',
                'zh-hant': 'zh-TW',
                'en': 'en',
                'en-us': 'en',
                'en-gb': 'en',
                'ja': 'ja',
                'ko': 'ko',
                'fr': 'fr',
                'de': 'de',
                'es': 'es',
                'ru': 'ru',
                'pt': 'pt',
                'it': 'it',
                'ar': 'ar',
                'hi': 'hi'
            };
            
            return map[langCode] || langCode;
        }

        // 判断是否需要显示翻译按钮
        shouldShowTranslateButton() {
            const pageLang = this.detectPageLanguage();
            const sysLang = this.normalizeLangCode(this.systemLanguage);
            
            console.log('页面语言:', pageLang, '系统语言:', sysLang);
            
            // 如果都是中文(简体或繁体),不显示翻译按钮
            const pageIsChinese = pageLang === 'zh-CN' || pageLang === 'zh-TW';
            const sysIsChinese = sysLang === 'zh-CN' || sysLang === 'zh-TW';
            
            if (pageIsChinese && sysIsChinese) {
                return false;
            }
            
            // 如果语言不匹配，显示翻译按钮
            return pageLang !== sysLang;
        }
    }

    // 核心翻译引擎类
    class TranslationEngine {
        constructor() {
            // 初始化时使用最佳可用服务
            this.currentService = this.getBestAvailableService();
            this.cache = new TranslationCache();
            this.requestQueue = new RequestQueue(config.translation.concurrentRequests);
            this.retryCount = 0;
            this.isPaused = false;
            this.isStopped = false;
            
            // 服务错误计数，用于自动降级
            this.serviceErrorCount = {};
            this.maxErrorCount = 3; // 连续错误3次后降级
        }

        // 暂停翻译
        pause() {
            this.isPaused = true;
            console.log('翻译已暂停');
        }

        // 继续翻译
        resume() {
            this.isPaused = false;
            console.log('翻译已继续');
        }

        // 停止翻译
        stop() {
            this.isStopped = true;
            this.isPaused = false;
            this.requestQueue.clear();
            console.log('翻译已停止');
        }

        // 重置状态
        reset() {
            this.isStopped = false;
            this.isPaused = false;
        }

        // 翻译主方法
        async translate(text, options = {}) {
            // 检查是否停止
            if (this.isStopped) {
                throw new Error('翻译已停止');
            }

            // 等待暂停结束
            while (this.isPaused && !this.isStopped) {
                await new Promise(resolve => setTimeout(resolve, 100));
            }

            const { 
                sourceLang = config.translation.sourceLang, 
                targetLang = config.translation.targetLang, 
                service = this.currentService, 
                retry = 0 
            } = options;

            if (!text || text.trim() === '') {
                throw new Error('翻译文本不能为空');
            }

            // 检查缓存
            const cacheKey = this.generateCacheKey(text, sourceLang, targetLang, service);
            const cachedResult = this.cache.get(cacheKey);
            if (cachedResult) {
                return cachedResult;
            }

            try {
                const result = await this.retryWithBackoff(async () => {
                    return this.requestQueue.add(() => {
                        return this.callTranslationAPI(text, sourceLang, targetLang, service);
                    });
                }, retry);

                this.cache.set(cacheKey, result);
                
                // 重置错误计数
                this.serviceErrorCount[service] = 0;
                
                return result;
            } catch (error) {
                console.error('翻译失败:', error);
                
                // 增加错误计数
                this.serviceErrorCount[service] = (this.serviceErrorCount[service] || 0) + 1;
                
                // 如果当前服务连续错误达到阈值，尝试降级
                if (this.serviceErrorCount[service] >= this.maxErrorCount) {
                    console.log(`服务${service}连续错误${this.maxErrorCount}次，尝试降级`);
                    const nextService = this.getNextAvailableService(service);
                    if (nextService && nextService !== service) {
                        GM_notification({
                            text: `服务${apiServices[service].name}出现问题，已自动切换到${apiServices[nextService].name}`,
                            title: 'AI Chat翻译助手',
                            timeout: 5000
                        });
                        this.currentService = nextService;
                        this.serviceErrorCount[service] = 0; // 重置原服务错误计数
                        
                        // 同步更新面板和设置页面的服务选择器
                        if (settingsManager) {
                            settingsManager.syncServiceSelectors();
                        }
                        
                        // 递归调用新的服务
                        return this.translate(text, { sourceLang, targetLang, service: nextService });
                    } else {
                        // 如果没有下一个可用服务，回退到Google并提示用户
                        if (service !== 'google') {
                            GM_notification({
                                text: `所有配置的服务均不可用，已回退到Google翻译，请检查API配置`,
                                title: 'AI Chat翻译助手',
                                timeout: 5000
                            });
                            this.currentService = 'google';
                            this.serviceErrorCount[service] = 0; // 重置原服务错误计数
                            
                            // 同步更新面板和设置页面的服务选择器
                            if (settingsManager) {
                                settingsManager.syncServiceSelectors();
                            }
                            
                            // 递归调用Google服务
                            return this.translate(text, { sourceLang, targetLang, service: 'google' });
                        }
                    }
                }
                
                // 如果当前服务失败，尝试使用最佳可用服务
                const bestService = this.getBestAvailableService();
                if (service !== bestService) {
                    console.log(`尝试使用最佳可用服务${bestService}`);
                    return this.translate(text, { sourceLang, targetLang, service: bestService });
                }
                
                throw error;
            }
        }

        // 智能重试机制
        async retryWithBackoff(fn, retryCount = 0) {
            const maxRetries = config.translation.maxRetries;
            
            try {
                return await fn();
            } catch (error) {
                if (retryCount >= maxRetries || this.isStopped) {
                    throw error;
                }
                
                const delay = Math.pow(2, retryCount) * 500 + Math.random() * 500;
                console.log(`重试中 (${retryCount + 1}/${maxRetries})...`);
                
                await new Promise(resolve => setTimeout(resolve, delay));
                return this.retryWithBackoff(fn, retryCount + 1);
            }
        }

        // 生成缓存键
        generateCacheKey(text, sourceLang, targetLang, service) {
            return `${service}_${sourceLang}_${targetLang}_${hash(text)}`;
        }

        // 调用翻译API
        async callTranslationAPI(text, sourceLang, targetLang, service) {
            const serviceConfig = apiServices[service];
            if (!serviceConfig) {
                throw new Error(`不支持的翻译服务: ${service}`);
            }

            if (serviceConfig.requiresKey) {
                // 特殊处理百度翻译的密钥检查
                if (service === 'baidu') {
                    const appid = GM_getValue('baidu_appid');
                    const secret = GM_getValue('baidu_secret');
                    if (!appid || !secret) {
                        throw new Error(`翻译服务${service}需要API密钥，请在设置中配置`);
                    }
                } else {
                    const apiKey = GM_getValue(`api_key_${service}`);
                    if (!apiKey) {
                        throw new Error(`翻译服务${service}需要API密钥，请在设置中配置`);
                    }
                }
            }

            switch (service) {
                case 'google':
                    return this.callGoogleAPI(text, sourceLang, targetLang);
                case 'baidu':
                    return this.callBaiduAPI(text, sourceLang, targetLang);
                case 'youdao':
                    return this.callYoudaoAPI(text, sourceLang, targetLang);
                case 'siliconflow':
                    return this.callSiliconFlowAPI(text, sourceLang, targetLang);
                case 'deepseek':
                    return this.callDeepSeekAPI(text, sourceLang, targetLang);
                case 'custom':
                    return this.callCustomModelAPI(text, sourceLang, targetLang);
                default:
                    throw new Error(`未实现的翻译服务: ${service}`);
            }
        }

        // Google翻译API
        async callGoogleAPI(text, sourceLang, targetLang) {
            return new Promise((resolve, reject) => {
                const maxLength = 5000;
                if (text.length > maxLength) {
                    this.translateLongText(text, sourceLang, targetLang, 'google')
                        .then(resolve)
                        .catch(reject);
                    return;
                }

                GM_xmlhttpRequest({
                    method: 'GET',
                    url: `${apiServices.google.endpoint}?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`,
                    timeout: config.translation.timeout,
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                    },
                    onload: (response) => {
                        try {
                            const data = JSON.parse(response.responseText);
                            if (data && data[0] && Array.isArray(data[0])) {
                                const translatedText = data[0].map(item => item[0]).filter(Boolean).join('');
                                const detectedLang = data[2] || sourceLang;
                                resolve({ text: translatedText, sourceLang: detectedLang, targetLang });
                            } else {
                                reject(new Error('Google翻译返回格式异常'));
                            }
                        } catch (error) {
                            reject(new Error('解析Google翻译结果失败: ' + error.message));
                        }
                    },
                    onerror: (error) => {
                        reject(new Error('Google翻译请求失败'));
                    },
                    ontimeout: () => {
                        reject(new Error('Google翻译请求超时'));
                    }
                });
            });
        }

        // 百度翻译API
        async callBaiduAPI(text, sourceLang, targetLang) {
            const appid = GM_getValue('baidu_appid');
            const secretKey = GM_getValue('baidu_secret');
            

            
            if (!appid || !secretKey) {
                console.error('百度API密钥未配置，请检查设置页面是否已保存');
                throw new Error('百度翻译API密钥未配置');
            }

            const salt = Date.now();
            // 百度API要求：签名 = md5(appid + q + salt + 密钥)
            // 注意：q 是原始文本，不是URL编码后的
            const sign = md5(appid + text + salt + secretKey);

            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'POST',
                    url: apiServices.baidu.endpoint,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    data: `q=${encodeURIComponent(text)}&from=${this.mapLangCode(sourceLang, 'baidu')}&to=${this.mapLangCode(targetLang, 'baidu')}&appid=${appid}&salt=${salt}&sign=${sign}`,
                    timeout: config.translation.timeout,
                    onload: (response) => {
                        try {
                            const data = JSON.parse(response.responseText);
                            console.log('百度翻译API响应:', data);
                            
                            if (data.trans_result && data.trans_result.length > 0) {
                                const translatedText = data.trans_result.map(item => item.dst).join('\n');
                                resolve({ text: translatedText, sourceLang, targetLang });
                            } else if (data.error_code) {
                                let errorMsg = `百度翻译错误: ${data.error_code}`;
                                // 添加常见错误代码说明
                                const errorCodes = {
                                    '52001': '请求超时',
                                    '52002': '系统错误',
                                    '52003': '未授权用户',
                                    '54000': '必填参数为空',
                                    '54001': '签名错误',
                                    '54003': '访问频率受限',
                                    '54004': '账户余额不足',
                                    '54005': '长query请求频繁',
                                    '58000': '客户端IP非法',
                                    '58001': '译文语言方向不支持',
                                    '58002': '服务当前已关闭'
                                };
                                if (errorCodes[data.error_code]) {
                                    errorMsg += ` (${errorCodes[data.error_code]})`;
                                }
                                reject(new Error(errorMsg));
                            } else {
                                reject(new Error('百度翻译返回格式异常'));
                            }
                        } catch (error) {
                            reject(new Error('解析百度翻译结果失败'));
                        }
                    },
                    onerror: (error) => {
                        console.error('百度翻译网络错误:', error);
                        reject(new Error('百度翻译请求失败'));
                    },
                    ontimeout: () => reject(new Error('百度翻译请求超时'))
                });
            });
        }

        // 有道翻译API
        async callYoudaoAPI(text, sourceLang, targetLang) {
            const appid = GM_getValue('youdao_appid');
            const secretKey = GM_getValue('youdao_secret');
            
            if (!appid || !secretKey) {
                throw new Error('有道翻译API密钥未配置');
            }

            const salt = Date.now();
            const sign = md5(appid + text + salt + secretKey);

            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'POST',
                    url: apiServices.youdao.endpoint,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    data: `q=${encodeURIComponent(text)}&from=${this.mapLangCode(sourceLang, 'youdao')}&to=${this.mapLangCode(targetLang, 'youdao')}&appKey=${appid}&salt=${salt}&sign=${sign}`,
                    timeout: config.translation.timeout,
                    onload: (response) => {
                        try {
                            const data = JSON.parse(response.responseText);
                            if (data.errorCode === '0' && data.translation) {
                                const translatedText = data.translation.join('\n');
                                resolve({ text: translatedText, sourceLang, targetLang });
                            } else {
                                reject(new Error(`有道翻译错误: ${data.errorCode}`));
                            }
                        } catch (error) {
                            reject(new Error('解析有道翻译结果失败'));
                        }
                    },
                    onerror: () => reject(new Error('有道翻译请求失败')),
                    ontimeout: () => reject(new Error('有道翻译请求超时'))
                });
            });
        }

        // 硅基流动API
        async callSiliconFlowAPI(text, sourceLang, targetLang) {
            const apiKey = GM_getValue('api_key_siliconflow');
            
            if (!apiKey) {
                throw new Error('硅基流动API密钥未配置');
            }

            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'POST',
                    url: apiServices.siliconflow.endpoint,
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${apiKey}`
                    },
                    data: JSON.stringify({
                        model: 'Qwen/Qwen2.5-7B-Instruct',
                        messages: [
                            {
                                role: 'system',
                                content: `你是一个专业翻译助手。请将以下文本翻译成${this.getLangName(targetLang)}，只返回翻译结果，不要包含任何解释。`
                            },
                            {
                                role: 'user',
                                content: text
                            }
                        ],
                        max_tokens: 4096,
                        temperature: 0.1
                    }),
                    timeout: config.translation.timeout * 2,
                    onload: (response) => {
                        try {
                            const data = JSON.parse(response.responseText);
                            if (data.choices && data.choices.length > 0) {
                                const translatedText = data.choices[0].message.content.trim();
                                resolve({ text: translatedText, sourceLang, targetLang });
                            } else {
                                reject(new Error('硅基流动翻译返回格式异常'));
                            }
                        } catch (error) {
                            reject(new Error('解析硅基流动翻译结果失败'));
                        }
                    },
                    onerror: () => reject(new Error('硅基流动翻译请求失败')),
                    ontimeout: () => reject(new Error('硅基流动翻译请求超时'))
                });
            });
        }

        // DeepSeek API
        async callDeepSeekAPI(text, sourceLang, targetLang) {
            const apiKey = GM_getValue('api_key_deepseek');
            
            if (!apiKey) {
                throw new Error('DeepSeek API密钥未配置');
            }

            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'POST',
                    url: apiServices.deepseek.endpoint,
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${apiKey}`
                    },
                    data: JSON.stringify({
                        model: 'deepseek-chat',
                        messages: [
                            {
                                role: 'system',
                                content: `You are a professional translator. Translate the text to ${this.getLangName(targetLang)}. Return only the translation, no explanations.`
                            },
                            {
                                role: 'user',
                                content: text
                            }
                        ],
                        max_tokens: 4096,
                        temperature: 0.1
                    }),
                    timeout: config.translation.timeout * 2,
                    onload: (response) => {
                        try {
                            const data = JSON.parse(response.responseText);
                            if (data.choices && data.choices.length > 0) {
                                const translatedText = data.choices[0].message.content.trim();
                                resolve({ text: translatedText, sourceLang, targetLang });
                            } else {
                                reject(new Error('DeepSeek翻译返回格式异常'));
                            }
                        } catch (error) {
                            reject(new Error('解析DeepSeek翻译结果失败'));
                        }
                    },
                    onerror: () => reject(new Error('DeepSeek翻译请求失败')),
                    ontimeout: () => reject(new Error('DeepSeek翻译请求超时'))
                });
            });
        }

        // 自定义AI模型API
        async callCustomModelAPI(text, sourceLang, targetLang) {
            const customEndpoint = GM_getValue('custom_model_endpoint');
            const customApiKey = GM_getValue('custom_model_apikey');
            const customModelName = GM_getValue('custom_model_name') || 'gpt-3.5-turbo';
            
            if (!customEndpoint) {
                throw new Error('自定义模型API端点未配置');
            }
            
            if (!customApiKey) {
                throw new Error('自定义模型API密钥未配置');
            }

            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'POST',
                    url: customEndpoint,
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${customApiKey}`
                    },
                    data: JSON.stringify({
                        model: customModelName,
                        messages: [
                            {
                                role: 'system',
                                content: `You are a professional translator. Translate the text to ${this.getLangName(targetLang)}. Return only the translation, no explanations.`
                            },
                            {
                                role: 'user',
                                content: text
                            }
                        ],
                        max_tokens: 4096,
                        temperature: 0.1
                    }),
                    timeout: config.translation.timeout * 2,
                    onload: (response) => {
                        try {
                            const data = JSON.parse(response.responseText);
                            if (data.choices && data.choices.length > 0) {
                                const translatedText = data.choices[0].message.content.trim();
                                resolve({ text: translatedText, sourceLang, targetLang });
                            } else if (data.result) { // 兼容某些API返回格式
                                const translatedText = data.result;
                                resolve({ text: translatedText, sourceLang, targetLang });
                            } else {
                                reject(new Error('自定义模型翻译返回格式异常'));
                            }
                        } catch (error) {
                            reject(new Error('解析自定义模型翻译结果失败: ' + error.message));
                        }
                    },
                    onerror: (error) => reject(new Error('自定义模型翻译请求失败: ' + error.statusText)),
                    ontimeout: () => reject(new Error('自定义模型翻译请求超时'))
                });
            });
        }

        // 语言代码映射
        mapLangCode(langCode, service) {
            const langMaps = {
                baidu: {
                    'zh-CN': 'zh', 'zh-TW': 'cht', 'en': 'en', 'ja': 'jp', 
                    'ko': 'kor', 'fr': 'fra', 'de': 'de', 'es': 'spa', 
                    'ru': 'ru', 'pt': 'pt', 'it': 'it', 'ar': 'ara', 'hi': 'hi', 'auto': 'auto'
                },
                youdao: {
                    'zh-CN': 'zh-CHS', 'zh-TW': 'zh-CHT', 'en': 'en', 
                    'ja': 'ja', 'ko': 'ko', 'fr': 'fr', 'de': 'de', 
                    'es': 'es', 'ru': 'ru', 'pt': 'pt', 'it': 'it', 'ar': 'ar', 'hi': 'hi', 'auto': 'auto'
                }
            };

            if (langMaps[service] && langMaps[service][langCode]) {
                return langMaps[service][langCode];
            }
            return langCode;
        }

        // 获取语言名称
        getLangName(langCode) {
            const langNames = {
                'zh-CN': '中文', 'zh-TW': '繁体中文', 'en': 'English',
                'ja': '日语', 'ko': '韩语', 'fr': '法语', 'de': '德语',
                'es': '西班牙语', 'ru': '俄语', 'pt': '葡萄牙语',
                'it': '意大利语', 'ar': '阿拉伯语', 'hi': '印地语',
                'auto': '自动检测'
            };
            return langNames[langCode] || langCode;
        }

        // 检查可用的翻译服务并按优先级排序
        getAvailableServices() {
            const services = [];
            
            // 按优先级顺序检查API密钥
            const servicePriority = [
                { name: 'deepseek', key: 'api_key_deepseek' },
                { name: 'siliconflow', key: 'api_key_siliconflow' },
                { name: 'youdao', key: 'youdao_appid' },
                { name: 'baidu', key: 'baidu_appid' },
                { name: 'google', key: null } // Google不需要API密钥
            ];
            
            for (const service of servicePriority) {
                if (service.key === null || GM_getValue(service.key)) {
                    services.push(service.name);
                }
            }
            
            // 检查自定义AI模型是否配置
            const customName = GM_getValue('custom_model_name');
            const customEndpoint = GM_getValue('custom_model_endpoint');
            const customApiKey = GM_getValue('custom_model_apikey');
            if (customName && customEndpoint && customApiKey) {
                services.push('custom');
            }
            
            return services;
        }

        // 获取最高优先级的可用服务
        getBestAvailableService() {
            const availableServices = this.getAvailableServices();
            return availableServices.length > 0 ? availableServices[0] : 'google';
        }

        // 从指定服务列表获取最高优先级的可用服务
        getBestAvailableServiceFromList(servicesList) {
            // 按优先级顺序检查
            const servicePriority = ['deepseek', 'siliconflow', 'youdao', 'baidu', 'google'];
            
            for (const service of servicePriority) {
                if (servicesList.includes(service)) {
                    return service;
                }
            }
            
            // 检查自定义AI模型
            if (servicesList.includes('custom')) {
                return 'custom';
            }
            
            return 'google'; // 默认返回Google
        }

        // 获取下一个可用服务（用于降级）
        getNextAvailableService(currentService) {
            const availableServices = this.getAvailableServices();
            const currentIndex = availableServices.indexOf(currentService);
            
            // 如果当前服务不在可用服务列表中，返回最高优先级服务
            if (currentIndex === -1) {
                return availableServices.length > 0 ? availableServices[0] : 'google';
            }
            
            // 返回下一个可用服务，如果没有则返回Google
            return availableServices[currentIndex + 1] || 'google';
        }

        // 检查服务是否已配置
        isServiceConfigured(service) {
            switch (service) {
                case 'google':
                    return true; // Google不需要配置
                case 'baidu':
                    return GM_getValue('baidu_appid') && GM_getValue('baidu_secret');
                case 'youdao':
                    return GM_getValue('youdao_appid') && GM_getValue('youdao_secret');
                case 'siliconflow':
                    return !!GM_getValue('api_key_siliconflow');
                case 'deepseek':
                    return !!GM_getValue('api_key_deepseek');
                case 'custom':
                    const customName = GM_getValue('custom_model_name');
                    const customEndpoint = GM_getValue('custom_model_endpoint');
                    const customApiKey = GM_getValue('custom_model_apikey');
                    return customName && customEndpoint && customApiKey;
                default:
                    return false;
            }
        }

        // 翻译长文本
        async translateLongText(text, sourceLang, targetLang, service) {
            const maxLength = 4000;
            const segments = [];
            
            for (let i = 0; i < text.length; i += maxLength) {
                segments.push(text.substring(i, i + maxLength));
            }

            const results = await Promise.all(
                segments.map(segment => this.translate(segment, { sourceLang, targetLang, service }))
            );
            
            const translatedText = results.map(result => result.text).join('');
            return { text: translatedText, sourceLang, targetLang };
        }
    }

    // 翻译缓存类
    class TranslationCache {
        constructor() {
            this.memoryCache = new Map();
            this.maxMemorySize = 1000;
        }

        get(key) {
            if (this.memoryCache.has(key)) {
                return this.memoryCache.get(key);
            }

            const localStorageKey = `translation_cache_${key}`;
            const cached = localStorage.getItem(localStorageKey);
            if (cached) {
                try {
                    const result = JSON.parse(cached);
                    if (Date.now() - result.timestamp < 7 * 24 * 60 * 60 * 1000) {
                        this.set(key, result.data);
                        return result.data;
                    } else {
                        localStorage.removeItem(localStorageKey);
                    }
                } catch (error) {
                    console.error('解析缓存失败:', error);
                }
            }

            return null;
        }

        set(key, data) {
            if (this.memoryCache.size >= this.maxMemorySize) {
                const firstKey = this.memoryCache.keys().next().value;
                this.memoryCache.delete(firstKey);
            }
            this.memoryCache.set(key, data);

            const localStorageKey = `translation_cache_${key}`;
            localStorage.setItem(localStorageKey, JSON.stringify({
                timestamp: Date.now(),
                data: data
            }));
        }

        clear() {
            this.memoryCache.clear();
            for (let key in localStorage) {
                if (key.startsWith('translation_cache_')) {
                    localStorage.removeItem(key);
                }
            }
        }
    }

    // 请求队列类
    class RequestQueue {
        constructor(maxConcurrent) {
            this.maxConcurrent = maxConcurrent;
            this.queue = [];
            this.running = 0;
        }

        add(task) {
            return new Promise((resolve, reject) => {
                this.queue.push({ task, resolve, reject });
                this.processQueue();
            });
        }

        processQueue() {
            if (this.running >= this.maxConcurrent || this.queue.length === 0) {
                return;
            }

            const { task, resolve, reject } = this.queue.shift();
            this.running++;

            Promise.resolve()
                .then(task)
                .then(resolve)
                .catch(reject)
                .finally(() => {
                    this.running--;
                    this.processQueue();
                });
        }

        clear() {
            this.queue = [];
        }
    }

    // 全页翻译器类
    class FullPageTranslator {
        constructor() {
            this.translatedNodes = new WeakSet();
            this.observer = null;
            this.isTranslating = false;
        }

        // 获取所有需要翻译的文本节点
        getTextNodes(root = document.body) {
            const textNodes = [];
            const walker = document.createTreeWalker(
                root,
                NodeFilter.SHOW_TEXT,
                {
                    acceptNode: (node) => {
                        // 过滤掉不需要翻译的元素
                        const parent = node.parentElement;
                        if (!parent) return NodeFilter.FILTER_REJECT;

                        const tagName = parent.tagName.toLowerCase();
                        // 排除script, style, code等标签
                        if (['script', 'style', 'code', 'pre', 'textarea', 'input', 'select'].includes(tagName)) {
                            return NodeFilter.FILTER_REJECT;
                        }

                        // 排除翻译面板和悬浮球
                        if (parent.closest('#translation-panel, #translate-float-button, #settings-panel')) {
                            return NodeFilter.FILTER_REJECT;
                        }

                        // 只保留有文字内容的节点
                        const text = node.textContent.trim();
                        if (text.length > 0) {
                            return NodeFilter.FILTER_ACCEPT;
                        }

                        return NodeFilter.FILTER_REJECT;
                    }
                }
            );

            let node;
            while (node = walker.nextNode()) {
                textNodes.push(node);
            }

            return textNodes;
        }

        // 分批处理文本节点
        batchNodes(nodes, batchSize = 50) {
            const batches = [];
            for (let i = 0; i < nodes.length; i += batchSize) {
                batches.push(nodes.slice(i, i + batchSize));
            }
            return batches;
        }

        // 翻译单个文本节点
        async translateNode(node, targetLang, service) {
            if (this.translatedNodes.has(node)) {
                return;
            }

            const originalText = node.textContent.trim();
            if (!originalText || originalText.length === 0) {
                return;
            }

            try {
                const result = await translationEngine.translate(originalText, 'auto', targetLang, service);
                const translatedText = typeof result === 'string' ? result : result.text;
                if (translatedText && translatedText !== originalText) {
                    // 保存原文到自定义属性
                    if (!node.parentElement.hasAttribute('data-original-text')) {
                        node.parentElement.setAttribute('data-original-text', originalText);
                    }
                    node.textContent = translatedText;
                    this.translatedNodes.add(node);
                }
            } catch (error) {
                console.error('翻译节点失败:', error);
            }
        }

        // 主翻译方法
        async translate(targetLang, service, progressCallback) {
            if (this.isTranslating) {
                throw new Error('翻译正在进行中');
            }

            this.isTranslating = true;

            try {
                // 1. 获取所有文本节点
                progressCallback(5);
                const textNodes = this.getTextNodes();
                console.log(`找到 ${textNodes.length} 个文本节点`);

                if (textNodes.length === 0) {
                    throw new Error('未找到可翻译的文本');
                }

                // 2. 分批处理
                progressCallback(10);
                const batches = this.batchNodes(textNodes, 30);
                console.log(`分为 ${batches.length} 个批次`);

                // 3. 逐批翻译
                for (let i = 0; i < batches.length; i++) {
                    const batch = batches[i];
                    const progress = 10 + Math.floor((i / batches.length) * 85);
                    progressCallback(progress);

                    // 并行翻译批次中的所有节点
                    await Promise.all(
                        batch.map(node => this.translateNode(node, targetLang, service))
                    );

                    // 每批次之间稍微延迟，避免过载
                    await new Promise(resolve => setTimeout(resolve, 100));
                }

                progressCallback(100);
                console.log('全页翻译完成');
            } finally {
                this.isTranslating = false;
            }
        }

        // 还原原文
        restore() {
            const elements = document.querySelectorAll('[data-original-text]');
            elements.forEach(element => {
                const originalText = element.getAttribute('data-original-text');
                if (originalText && element.firstChild && element.firstChild.nodeType === Node.TEXT_NODE) {
                    element.firstChild.textContent = originalText;
                    element.removeAttribute('data-original-text');
                }
            });
            this.translatedNodes = new WeakSet();
            console.log('已还原原文');
        }
    }

    // 设置管理类
    class SettingsManager {
        constructor() {
            this.settingsPanel = null;
        }

        // 打开设置面板
        open() {
            if (this.settingsPanel && $('#settings-panel').length) {
                $('#settings-panel').show();
                return;
            }

            this.createSettingsPanel();
            $('#settings-panel').show();
        }

        // 创建设置面板
        createSettingsPanel() {
            const settingsHTML = `
                <div id="settings-panel" class="settings-panel">
                    <div class="settings-overlay"></div>
                    <div class="settings-content">
                        <div class="settings-header">
                            <h2>AI Chat翻译助手 - 设置</h2>
                            <button class="close-settings" title="关闭">×</button>
                        </div>
                        <div class="settings-body">
                            <div class="settings-section">
                                <h3>🔑 API密钥配置</h3>
                                <div class="api-config-grid">
                                    <div class="config-item">
                                        <label>Google翻译</label>
                                        <input type="text" id="api-google" placeholder="无需配置" disabled />
                                        <small>免费服务，无需密钥</small>
                                        <button class="btn-secondary test-connection-btn" data-service="google" style="margin-top: 5px;">🔍 检测连接</button>
                                    </div>
                                    <div class="config-item">
                                        <label>百度翻译 App ID</label>
                                        <input type="text" id="api-baidu-appid" placeholder="输入百度翻译App ID" autocomplete="new-password" />
                                        <label>百度翻译密钥</label>
                                        <input type="password" id="api-baidu-secret" placeholder="输入百度翻译密钥" autocomplete="new-password" />
                                        <button class="btn-secondary test-connection-btn" data-service="baidu" style="margin-top: 5px;">🔍 检测连接</button>
                                    </div>
                                    <div class="config-item">
                                        <label>有道翻译 App ID</label>
                                        <input type="text" id="api-youdao-appid" placeholder="输入有道翻译App ID" autocomplete="new-password" />
                                        <label>有道翻译密钥</label>
                                        <input type="password" id="api-youdao-secret" placeholder="输入有道翻译密钥" autocomplete="new-password" />
                                        <button class="btn-secondary test-connection-btn" data-service="youdao" style="margin-top: 5px;">🔍 检测连接</button>
                                    </div>
                                    <div class="config-item">
                                        <label>硅基流动 API Key</label>
                                        <input type="password" id="api-siliconflow" placeholder="输入硅基流动API密钥" autocomplete="new-password" />
                                        <button class="btn-secondary test-connection-btn" data-service="siliconflow" style="margin-top: 5px;">🔍 检测连接</button>
                                    </div>
                                    <div class="config-item">
                                        <label>DeepSeek API Key</label>
                                        <input type="password" id="api-deepseek" placeholder="输入DeepSeek API密钥" autocomplete="new-password" />
                                        <button class="btn-secondary test-connection-btn" data-service="deepseek" style="margin-top: 5px;">🔍 检测连接</button>
                                    </div>
                                    <div class="config-item">
                                        <label>自定义AI模型</label>
                                        <input type="text" id="custom-model-name" placeholder="例如: my-custom-model" autocomplete="new-password" />
                                        <label>自定义API端点</label>
                                        <input type="text" id="custom-model-endpoint" placeholder="例如: https://api.example.com/v1/chat/completions" autocomplete="new-password" />
                                        <label>自定义API密钥</label>
                                        <input type="password" id="custom-model-apikey" placeholder="输入自定义API密钥" autocomplete="new-password" />
                                        <small>配置自定义AI翻译服务，支持OpenAI兼容的API接口</small>
                                        <button class="btn-secondary test-connection-btn" data-service="custom" style="margin-top: 5px;">🔍 检测连接</button>
                                    </div>
                                </div>
                            </div>

                            <div class="settings-section">
                                <h3>⌨️ 快捷键设置</h3>
                                <div class="shortcut-config">
                                    <div class="config-item">
                                        <label>翻译快捷键</label>
                                        <input type="text" id="shortcut-translate" placeholder="例如: Ctrl+Shift+T" />
                                        <small>用于触发段落翻译</small>
                                    </div>
                                    <div class="config-item">
                                        <label>切换面板快捷键</label>
                                        <input type="text" id="shortcut-toggle" placeholder="例如: Alt+T" />
                                        <small>用于显示/隐藏翻译面板</small>
                                    </div>
                                </div>
                            </div>

                            <div class="settings-section">
                                <h3>🌐 翻译设置</h3>
                                <div class="translation-config">
                                    <div class="config-item">
                                        <label>默认翻译服务</label>
                                        <select id="default-service">
                                            <option value="google">Google翻译</option>
                                            <option value="baidu">百度翻译</option>
                                            <option value="youdao">有道翻译</option>
                                            <option value="siliconflow">硅基流动</option>
                                            <option value="deepseek">DeepSeek</option>
                                            <option value="custom">自定义AI模型</option>
                                        </select>
                                    </div>
                                    <div class="config-item">
                                        <label>默认目标语言</label>
                                        <select id="default-target-lang">
                                            <option value="af">南非语 (Afrikaans)</option>
                                            <option value="sq">阿尔巴尼亚语 (Albanian)</option>
                                            <option value="am">阿姆哈拉语 (Amharic)</option>
                                            <option value="hy">亚美尼亚语 (Armenian)</option>
                                            <option value="az">阿塞拜疆语 (Azerbaijani)</option>
                                            <option value="eu">巴斯克语 (Basque)</option>
                                            <option value="be">白俄罗斯语 (Belarusian)</option>
                                            <option value="bn">孟加拉语 (Bengali)</option>
                                            <option value="bs">波斯尼亚语 (Bosnian)</option>
                                            <option value="bg">保加利亚语 (Bulgarian)</option>
                                            <option value="ca">加泰罗尼亚语 (Catalan)</option>
                                            <option value="ceb">宿务语 (Cebuano)</option>
                                            <option value="ny">奇切瓦语 (Chichewa)</option>
                                            <option value="zh-CN">中文(简体)</option>
                                            <option value="zh-TW">中文(繁体)</option>
                                            <option value="co">科西嘉语 (Corsican)</option>
                                            <option value="hr">克罗地亚语 (Croatian)</option>
                                            <option value="cs">捷克语 (Czech)</option>
                                            <option value="da">丹麦语 (Danish)</option>
                                            <option value="nl">荷兰语 (Dutch)</option>
                                            <option value="en">英语 (English)</option>
                                            <option value="eo">世界语 (Esperanto)</option>
                                            <option value="et">爱沙尼亚语 (Estonian)</option>
                                            <option value="tl">菲律宾语 (Filipino)</option>
                                            <option value="fi">芬兰语 (Finnish)</option>
                                            <option value="fr">法语 (French)</option>
                                            <option value="fy">弗里斯兰语 (Frisian)</option>
                                            <option value="gl">加利西亚语 (Galician)</option>
                                            <option value="ka">格鲁吉亚语 (Georgian)</option>
                                            <option value="de">德语 (German)</option>
                                            <option value="el">希腊语 (Greek)</option>
                                            <option value="gu">古吉拉特语 (Gujarati)</option>
                                            <option value="ht">海地克里奥尔语 (Haitian Creole)</option>
                                            <option value="ha">豪萨语 (Hausa)</option>
                                            <option value="haw">夏威夷语 (Hawaiian)</option>
                                            <option value="he">希伯来语 (Hebrew)</option>
                                            <option value="hi">印地语 (Hindi)</option>
                                            <option value="hmn">苗语 (Hmong)</option>
                                            <option value="hu">匈牙利语 (Hungarian)</option>
                                            <option value="is">冰岛语 (Icelandic)</option>
                                            <option value="ig">伊博语 (Igbo)</option>
                                            <option value="id">印度尼西亚语 (Indonesian)</option>
                                            <option value="ga">爱尔兰语 (Irish)</option>
                                            <option value="it">意大利语 (Italian)</option>
                                            <option value="ja">日语 (Japanese)</option>
                                            <option value="jv">爪哇语 (Javanese)</option>
                                            <option value="kn">卡纳达语 (Kannada)</option>
                                            <option value="kk">哈萨克语 (Kazakh)</option>
                                            <option value="km">高棉语 (Khmer)</option>
                                            <option value="rw">卢旺达语 (Kinyarwanda)</option>
                                            <option value="ko">韩语 (Korean)</option>
                                            <option value="ku">库尔德语 (Kurdish)</option>
                                            <option value="ky">吉尔吉斯语 (Kyrgyz)</option>
                                            <option value="lo">老挝语 (Lao)</option>
                                            <option value="la">拉丁语 (Latin)</option>
                                            <option value="lv">拉脱维亚语 (Latvian)</option>
                                            <option value="lt">立陶宛语 (Lithuanian)</option>
                                            <option value="lb">卢森堡语 (Luxembourgish)</option>
                                            <option value="mk">马其顿语 (Macedonian)</option>
                                            <option value="mg">马拉加西语 (Malagasy)</option>
                                            <option value="ms">马来语 (Malay)</option>
                                            <option value="ml">马拉雅拉姆语 (Malayalam)</option>
                                            <option value="mt">马耳他语 (Maltese)</option>
                                            <option value="mi">毛利语 (Maori)</option>
                                            <option value="mr">马拉地语 (Marathi)</option>
                                            <option value="mn">蒙古语 (Mongolian)</option>
                                            <option value="my">缅甸语 (Myanmar)</option>
                                            <option value="ne">尼泊尔语 (Nepali)</option>
                                            <option value="no">挪威语 (Norwegian)</option>
                                            <option value="or">奥里亚语 (Odia)</option>
                                            <option value="ps">普什图语 (Pashto)</option>
                                            <option value="fa">波斯语 (Persian)</option>
                                            <option value="pl">波兰语 (Polish)</option>
                                            <option value="pt">葡萄牙语 (Portuguese)</option>
                                            <option value="pa">旁遮普语 (Punjabi)</option>
                                            <option value="ro">罗马尼亚语 (Romanian)</option>
                                            <option value="ru">俄语 (Russian)</option>
                                            <option value="sm">萨摩亚语 (Samoan)</option>
                                            <option value="gd">苏格兰盖尔语 (Scots Gaelic)</option>
                                            <option value="sr">塞尔维亚语 (Serbian)</option>
                                            <option value="st">塞索托语 (Sesotho)</option>
                                            <option value="sn">修纳语 (Shona)</option>
                                            <option value="sd">信德语 (Sindhi)</option>
                                            <option value="si">僧伽罗语 (Sinhala)</option>
                                            <option value="sk">斯洛伐克语 (Slovak)</option>
                                            <option value="sl">斯洛文尼亚语 (Slovenian)</option>
                                            <option value="so">索马里语 (Somali)</option>
                                            <option value="es">西班牙语 (Spanish)</option>
                                            <option value="su">巽他语 (Sundanese)</option>
                                            <option value="sw">斯瓦希里语 (Swahili)</option>
                                            <option value="sv">瑞典语 (Swedish)</option>
                                            <option value="tg">塔吉克语 (Tajik)</option>
                                            <option value="ta">泰米尔语 (Tamil)</option>
                                            <option value="tt">鞑靼语 (Tatar)</option>
                                            <option value="te">泰卢固语 (Telugu)</option>
                                            <option value="th">泰语 (Thai)</option>
                                            <option value="tr">土耳其语 (Turkish)</option>
                                            <option value="tk">土库曼语 (Turkmen)</option>
                                            <option value="uk">乌克兰语 (Ukrainian)</option>
                                            <option value="ur">乌尔都语 (Urdu)</option>
                                            <option value="ug">维吾尔语 (Uyghur)</option>
                                            <option value="uz">乌兹别克语 (Uzbek)</option>
                                            <option value="vi">越南语 (Vietnamese)</option>
                                            <option value="cy">威尔士语 (Welsh)</option>
                                            <option value="xh">科萨语 (Xhosa)</option>
                                            <option value="yi">意第绪语 (Yiddish)</option>
                                            <option value="yo">约鲁巴语 (Yoruba)</option>
                                            <option value="zu">祖鲁语 (Zulu)</option>
                                        </select>
                                    </div>
                                    <div class="config-item">
                                        <label>
                                            <input type="checkbox" id="auto-show-button" />
                                            自动检测语言并显示翻译按钮
                                        </label>
                                        <small>当页面语言与系统语言不同时自动显示</small>
                                    </div>
                                    <div class="config-item">
                                        <label>
                                            <input type="checkbox" id="enable-cache" />
                                            启用翻译缓存
                                        </label>
                                        <small>缓存翻译结果以提高速度</small>
                                    </div>
                                    <div class="config-item">
                                        <label>
                                            <input type="checkbox" id="word-translate" />
                                            启用划词翻译
                                        </label>
                                        <small>选中文本时自动翻译</small>
                                    </div>
                                    <div class="config-item">
                                        <label>
                                            <input type="checkbox" id="hover-translate" />
                                            启用悬浮翻译
                                        </label>
                                        <small>鼠标悬停时自动翻译</small>
                                    </div>
                                    <div class="config-item">
                                        <label>域名屏蔽列表</label>
                                        <textarea id="blocked-domains" rows="4" placeholder="每行一个域名，支持通配符&#10;例如：&#10;*.example.com&#10;www.blocked-site.com"></textarea>
                                        <small>在这些域名下将禁用所有翻译功能</small>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="settings-footer">
                            <button id="save-settings" class="btn-primary">保存设置</button>
                            <button id="reset-settings" class="btn-secondary">重置为默认</button>
                            <button id="clear-cache" class="btn-secondary">清除缓存</button>
                        </div>
                    </div>
                </div>
            `;

            $('body').append(settingsHTML);
            this.loadSettingsStyles();
            this.bindSettingsEvents();
            this.loadSettings();
        }

        // 加载设置样式
        loadSettingsStyles() {
            const styles = `
                .settings-panel {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    z-index: 99999999;
                    display: none;
                    backdrop-filter: blur(5px);
                    -webkit-backdrop-filter: blur(5px);
                }

                .settings-overlay {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.6);
                }

                .settings-content {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    background: white;
                    border-radius: 16px;
                    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
                    width: 90%;
                    max-width: 850px;
                    max-height: 90vh;
                    display: flex;
                    flex-direction: column;
                    overflow: hidden;
                }

                .settings-header {
                    padding: 24px 28px;
                    border-bottom: 1px solid #edf2f7;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                }

                .settings-header h2 {
                    margin: 0;
                    font-size: 22px;
                    font-weight: 600;
                    color: white;
                    letter-spacing: 0.5px;
                }

                .close-settings {
                    width: 36px;
                    height: 36px;
                    border: none;
                    background: rgba(255, 255, 255, 0.2);
                    font-size: 24px;
                    cursor: pointer;
                    border-radius: 8px;
                    color: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.2s ease;
                }

                .close-settings:hover {
                    background: rgba(255, 255, 255, 0.3);
                    transform: scale(1.05);
                }

                .settings-body {
                    padding: 28px;
                    overflow-y: auto;
                    flex: 1;
                    background: #f8fafc;
                }

                .settings-section {
                    margin-bottom: 36px;
                    background: white;
                    border-radius: 12px;
                    padding: 24px;
                    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
                    border: 1px solid #edf2f7;
                }

                .settings-section:last-child {
                    margin-bottom: 0;
                }

                .settings-section h3 {
                    margin: 0 0 20px 0;
                    font-size: 18px;
                    font-weight: 600;
                    color: #2d3748;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }

                .settings-section h3::before {
                    content: '';
                    display: block;
                    width: 4px;
                    height: 20px;
                    background: linear-gradient(to bottom, #667eea, #764ba2);
                    border-radius: 2px;
                }

                .api-config-grid,
                .shortcut-config,
                .translation-config {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
                    gap: 20px;
                }

                .config-item {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }

                .config-item label {
                    font-size: 15px;
                    font-weight: 500;
                    color: #4a5568;
                }

                .config-item input[type="text"],
                .config-item input[type="password"],
                .config-item select,
                .config-item textarea {
                    padding: 12px 14px;
                    border: 1px solid #e2e8f0;
                    border-radius: 8px;
                    font-size: 14px;
                    transition: all 0.2s ease;
                    background: white;
                    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
                }

                .config-item input:focus,
                .config-item select:focus,
                .config-item textarea:focus {
                    outline: none;
                    border-color: #667eea;
                    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
                }

                .config-item input:disabled {
                    background: #f1f5f9;
                    color: #a0aec0;
                }

                .config-item small {
                    font-size: 13px;
                    color: #718096;
                    line-height: 1.4;
                }

                .config-item input[type="checkbox"] {
                    width: 18px;
                    height: 18px;
                    margin-right: 8px;
                    accent-color: #667eea;
                    border-radius: 4px;
                }

                .settings-footer {
                    padding: 20px 28px;
                    border-top: 1px solid #edf2f7;
                    display: flex;
                    gap: 16px;
                    justify-content: flex-end;
                    background: white;
                }

                .settings-footer button {
                    padding: 12px 24px;
                    border: none;
                    border-radius: 8px;
                    font-size: 15px;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif, 'Microsoft YaHei', sans-serif, emoji, 'Apple Color Emoji', 'Segoe UI Emoji';
                }

                .settings-footer button:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                }

                .settings-footer button:active {
                    transform: translateY(0);
                }

                .btn-primary {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    font-weight: 600;
                }

                .btn-primary:hover {
                    background: linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%);
                    box-shadow: 0 6px 16px rgba(102, 126, 234, 0.3);
                }

                .btn-secondary {
                    background: white;
                    color: #4a5568;
                    border: 1px solid #e2e8f0;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif, 'Microsoft YaHei', sans-serif, emoji, 'Apple Color Emoji', 'Segoe UI Emoji';
                }

                .btn-secondary:hover {
                    background: #f8fafc;
                    border-color: #cbd5e0;
                    color: #2d3748;
                }

                .btn-error {
                    background: linear-gradient(135deg, #ff6b6b 0%, #ff5252 100%);
                    color: white;
                }

                .btn-error:hover {
                    background: linear-gradient(135deg, #ff5252 0%, #ff4444 100%);
                    box-shadow: 0 6px 16px rgba(255, 107, 107, 0.3);
                }

                @media (max-width: 768px) {
                    .api-config-grid,
                    .shortcut-config,
                    .translation-config {
                        grid-template-columns: 1fr;
                    }
                    
                    .settings-content {
                        width: 95%;
                        max-width: none;
                    }
                    
                    .language-selector-row {
                        flex-direction: column;
                        align-items: stretch;
                        gap: 8px;
                    }
                    
                    .language-label {
                        min-width: auto;
                        text-align: left;
                    }
                    
                    .lang-select, .service-select {
                        max-width: 100%;
                    }
                    
                    .selector-row {
                        flex-direction: column;
                        align-items: stretch;
                        gap: 12px;
                    }
                    
                    .selector-row .swap-btn {
                        align-self: center;
                    }
                }
                
                @media (max-width: 480px) {
                    .translation-panel {
                        width: 95vw;
                        right: 2.5vw;
                        left: 2.5vw;
                    }
                    
                    .language-selector-row {
                        flex-direction: column;
                        align-items: stretch;
                        gap: 8px;
                    }
                    
                    .language-label {
                        min-width: auto;
                        text-align: left;
                    }
                    
                    .lang-select, .service-select {
                        max-width: 100%;
                    }
                    
                    .selector-row {
                        flex-direction: column;
                        align-items: stretch;
                        gap: 12px;
                    }
                    
                    .selector-row .swap-btn {
                        align-self: center;
                    }
                }
            `;

            GM_addStyle(styles);
        }

        // 绑定设置事件
        bindSettingsEvents() {
            $('.close-settings, .settings-overlay').on('click', () => this.close());
            $('#save-settings').on('click', () => this.saveSettings());
            $('#reset-settings').on('click', () => this.resetSettings());
            $('#clear-cache').on('click', () => this.clearCache());
            
            // 绑定API连接测试按钮事件
            $('.test-connection-btn').on('click', (e) => {
                const service = $(e.target).data('service');
                this.testServiceConnection(service);
            });
        }

        // 加载设置
        loadSettings() {
            // API密钥
            $('#api-baidu-appid').val(GM_getValue('baidu_appid', ''));
            $('#api-baidu-secret').val(GM_getValue('baidu_secret', ''));
            $('#api-youdao-appid').val(GM_getValue('youdao_appid', ''));
            $('#api-youdao-secret').val(GM_getValue('youdao_secret', ''));
            $('#api-siliconflow').val(GM_getValue('api_key_siliconflow', ''));
            $('#api-deepseek').val(GM_getValue('api_key_deepseek', ''));
            
            // 自定义AI模型配置
            $('#custom-model-name').val(GM_getValue('custom_model_name', ''));
            $('#custom-model-endpoint').val(GM_getValue('custom_model_endpoint', ''));
            $('#custom-model-apikey').val(GM_getValue('custom_model_apikey', ''));

            // 快捷键
            $('#shortcut-translate').val(GM_getValue('shortcut_translate', 'Ctrl+Shift+T'));
            $('#shortcut-toggle').val(GM_getValue('shortcut_toggle', 'Alt+T'));

            // 翻译设置
            $('#default-service').val(GM_getValue('default_service', 'google'));
            $('#default-target-lang').val(GM_getValue('default_target_lang', 'zh-CN'));
            $('#auto-show-button').prop('checked', GM_getValue('auto_show_button', true));
            $('#enable-cache').prop('checked', GM_getValue('enable_cache', true));
            const wordTranslateValue = GM_getValue('word_translate', false);
            const hoverTranslateValue = GM_getValue('hover_translate', false);
            
            $('#word-translate').prop('checked', wordTranslateValue).attr('data-temp-state', wordTranslateValue ? 'enabled' : 'disabled');
            $('#hover-translate').prop('checked', hoverTranslateValue).attr('data-temp-state', hoverTranslateValue ? 'enabled' : 'disabled');
            
            // 域名屏蔽列表
            const blockedDomains = GM_getValue('blocked_domains', '');
            $('#blocked-domains').val(blockedDomains);
        }

        // 保存设置
        async saveSettings() {
            // 收集API密钥配置
            const apiConfigs = {
                baidu: {
                    appId: $('#api-baidu-appid').val(),
                    secret: $('#api-baidu-secret').val()
                },
                youdao: {
                    appId: $('#api-youdao-appid').val(),
                    secret: $('#api-youdao-secret').val()
                },
                siliconflow: {
                    key: $('#api-siliconflow').val()
                },
                deepseek: {
                    key: $('#api-deepseek').val()
                }
            };
            
            // 保存API密钥
            GM_setValue('baidu_appid', apiConfigs.baidu.appId);
            GM_setValue('baidu_secret', apiConfigs.baidu.secret);
            GM_setValue('youdao_appid', apiConfigs.youdao.appId);
            GM_setValue('youdao_secret', apiConfigs.youdao.secret);
            GM_setValue('api_key_siliconflow', apiConfigs.siliconflow.key);
            GM_setValue('api_key_deepseek', apiConfigs.deepseek.key);
            
            // 保存自定义AI模型配置
            GM_setValue('custom_model_name', $('#custom-model-name').val());
            GM_setValue('custom_model_endpoint', $('#custom-model-endpoint').val());
            GM_setValue('custom_model_apikey', $('#custom-model-apikey').val());
            
            // 检查配置的API密钥是否可用
            const availableServices = ['google']; // Google总是可用
            
            // 检查其他服务
            for (const [service, config] of Object.entries(apiConfigs)) {
                if (this.isServiceConfigured(service, config)) {
                    try {
                        const testResult = await this.performTestTranslation(service, 'hello', 'en', 'zh-CN', 
                            config.key || config.appId, config.appId, config.secret);
                        if (testResult.success) {
                            availableServices.push(service);
                        }
                    } catch (error) {
                        console.warn(`服务${service}连接测试失败:`, error);
                        // 显示测试失败的通知
                        GM_notification({
                            text: `服务${apiServices[service].name}连接测试失败，请检查配置`,
                            title: 'AI Chat翻译助手',
                            timeout: 3000
                        });
                    }
                }
            }
            
            // 检查自定义AI模型配置
            const customModelName = $('#custom-model-name').val();
            const customModelEndpoint = $('#custom-model-endpoint').val();
            const customModelApiKey = $('#custom-model-apikey').val();
            
            if (customModelName && customModelEndpoint && customModelApiKey) {
                try {
                    const testResult = await this.performTestTranslation('custom', 'hello', 'en', 'zh-CN', 
                        customModelApiKey, null, null);
                    if (testResult.success) {
                        availableServices.push('custom');
                    }
                } catch (error) {
                    console.warn('自定义AI模型连接测试失败:', error);
                    // 显示测试失败的通知
                    GM_notification({
                        text: '自定义AI模型连接测试失败，请检查配置',
                        title: 'AI Chat翻译助手',
                        timeout: 3000
                    });
                }
            }
            
            // 如果没有可用服务，提示用户
            if (availableServices.length <= 1) { // 只有Google可用
                const confirmResult = confirm('没有配置有效的API密钥，将只能使用Google翻译服务。是否继续保存设置？');
                if (!confirmResult) {
                    return; // 用户取消保存
                }
            }
            
            // 如果翻译引擎存在，更新当前服务为最佳可用服务
            if (translationEngine) {
                translationEngine.currentService = translationEngine.getBestAvailableServiceFromList(availableServices);
                console.log('更新当前服务为:', translationEngine.currentService);
            }

            // 快捷键
            GM_setValue('shortcut_translate', $('#shortcut-translate').val());
            GM_setValue('shortcut_toggle', $('#shortcut-toggle').val());

            // 翻译设置
            GM_setValue('default_service', $('#default-service').val());
            GM_setValue('default_target_lang', $('#default-target-lang').val());
            GM_setValue('auto_show_button', $('#auto-show-button').prop('checked'));
            GM_setValue('enable_cache', $('#enable-cache').prop('checked'));
            GM_setValue('word_translate', $('#word-translate').prop('checked'));
            GM_setValue('hover_translate', $('#hover-translate').prop('checked'));
            
            // 域名屏蔽列表
            GM_setValue('blocked_domains', $('#blocked-domains').val());

            // 更新配置
            config.translation.defaultService = $('#default-service').val();
            config.translation.targetLang = $('#default-target-lang').val();
            config.features.autoShowButton = $('#auto-show-button').prop('checked');
            config.features.cacheEnabled = $('#enable-cache').prop('checked');
            
            // 获取临时状态并应用到全局配置
            const wordTranslateTempState = $('#word-translate').attr('data-temp-state');
            const hoverTranslateTempState = $('#hover-translate').attr('data-temp-state');
            
            if (wordTranslateTempState) {
                const isEnabled = wordTranslateTempState === 'enabled';
                config.features.wordTranslate = isEnabled;
                GM_setValue('word_translate', isEnabled);
            }
            
            if (hoverTranslateTempState) {
                const isEnabled = hoverTranslateTempState === 'enabled';
                config.features.hoverTranslate = isEnabled;
                GM_setValue('hover_translate', isEnabled);
            }
            
            config.shortcut.translate = $('#shortcut-translate').val();
            config.shortcut.togglePanel = $('#shortcut-toggle').val();

            // 同步更新面板上的按钮状态
            if (translationPanel) {
                const wordTranslateBtn = $('#translate-btn');
                const hoverTranslateBtn = $('#hover-translate-btn');
                
                if (config.features.wordTranslate) {
                    wordTranslateBtn.addClass('active').attr('data-temp-state', 'enabled');
                } else {
                    wordTranslateBtn.removeClass('active').attr('data-temp-state', 'disabled');
                }
                
                if (config.features.hoverTranslate) {
                    hoverTranslateBtn.addClass('active').attr('data-temp-state', 'enabled');
                } else {
                    hoverTranslateBtn.removeClass('active').attr('data-temp-state', 'disabled');
                }
            }
            
            // 同步更新服务选择器
            this.syncServiceSelectors();

            GM_notification({
                text: '设置已保存',
                title: 'AI Chat翻译助手',
                timeout: 2000
            });

            this.close();
        }

        // 重置设置
        resetSettings() {
            if (confirm('确定要重置所有设置为默认值吗？')) {
                // 清除所有设置
                GM_deleteValue('baidu_appid');
                GM_deleteValue('baidu_secret');
                GM_deleteValue('youdao_appid');
                GM_deleteValue('youdao_secret');
                GM_deleteValue('api_key_siliconflow');
                GM_deleteValue('api_key_deepseek');
                GM_deleteValue('shortcut_translate');
                GM_deleteValue('shortcut_toggle');
                GM_deleteValue('default_service');
                GM_deleteValue('default_target_lang');
                GM_deleteValue('auto_show_button');
                GM_deleteValue('enable_cache');
                GM_deleteValue('word_translate');
                GM_deleteValue('hover_translate');
                GM_deleteValue('blocked_domains');

                this.loadSettings();

                // 同步更新面板上的按钮临时状态
                if (translationPanel) {
                    $('#translate-btn').removeClass('active').attr('data-temp-state', 'disabled');
                    $('#hover-translate-btn').removeClass('active').attr('data-temp-state', 'disabled');
                }

                GM_notification({
                    text: '设置已重置为默认值',
                    title: 'AI Chat翻译助手',
                    timeout: 2000
                });
            }
        }

        // 清除缓存
        clearCache() {
            if (confirm('确定要清除所有翻译缓存吗？')) {
                translationEngine.cache.clear();
                GM_notification({
                    text: '缓存已清除',
                    title: 'AI Chat翻译助手',
                    timeout: 2000
                });
            }
        }

        // 检查服务是否已配置
        isServiceConfigured(service, config) {
            switch (service) {
                case 'baidu':
                    return config.appId && config.secret;
                case 'youdao':
                    return config.appId && config.secret;
                case 'siliconflow':
                case 'deepseek':
                    return config.key;
                default:
                    return false;
            }
        }

        // 同步服务选择器
        syncServiceSelectors() {
            if (translationEngine) {
                // 更新设置页面和面板中的服务选择器
                $('#default-service').val(translationEngine.currentService);
                $('#translation-service').val(translationEngine.currentService);
                
                console.log('同步服务选择器到:', translationEngine.currentService);
            }
        }

        // 测试服务连接
        async testServiceConnection(service) {
            const testBtn = $(`.test-connection-btn[data-service='${service}']`);
            const originalText = testBtn.text();
            
            // 更新按钮状态
            testBtn.text('⏳ 测试中...').prop('disabled', true);
            
            try {
                // 获取对应服务的API密钥
                let apiKey = null;
                let appId = null;
                let secretKey = null;
                
                switch (service) {
                    case 'baidu':
                        appId = $('#api-baidu-appid').val();
                        secretKey = $('#api-baidu-secret').val();
                        if (!appId || !secretKey) {
                            throw new Error('请填写完整的百度翻译API密钥');
                        }
                        break;
                    case 'youdao':
                        appId = $('#api-youdao-appid').val();
                        secretKey = $('#api-youdao-secret').val();
                        if (!appId || !secretKey) {
                            throw new Error('请填写完整的有道翻译API密钥');
                        }
                        break;
                    case 'siliconflow':
                        apiKey = $('#api-siliconflow').val();
                        if (!apiKey) {
                            throw new Error('请填写硅基流动API密钥');
                        }
                        break;
                    case 'deepseek':
                        apiKey = $('#api-deepseek').val();
                        if (!apiKey) {
                            throw new Error('请填写DeepSeek API密钥');
                        }
                        break;
                    case 'custom':
                        apiKey = $('#custom-model-apikey').val();
                        if (!apiKey) {
                            throw new Error('请填写自定义AI模型API密钥');
                        }
                        break;
                    case 'google':
                        // Google翻译不需要密钥，直接测试
                        break;
                }
                
                // 执行测试翻译
                const testText = 'hello';
                const result = await this.performTestTranslation(service, testText, 'en', 'zh-CN', apiKey, appId, secretKey);
                
                if (result.success) {
                    testBtn.text('✅ 连接成功').removeClass('btn-secondary').addClass('btn-primary');
                    setTimeout(() => {
                        testBtn.text(originalText).removeClass('btn-primary').addClass('btn-secondary').prop('disabled', false);
                    }, 2000);
                    
                    GM_notification({
                        text: `${apiServices[service].name}连接测试成功`,
                        title: 'AI Chat翻译助手',
                        timeout: 3000
                    });
                } else {
                    throw new Error(result.error || '连接测试失败');
                }
            } catch (error) {
                testBtn.text('❌ 连接失败').removeClass('btn-secondary').addClass('btn-error');
                setTimeout(() => {
                    testBtn.text(originalText).removeClass('btn-error').addClass('btn-secondary').prop('disabled', false);
                }, 2000);
                
                GM_notification({
                    text: `${apiServices[service].name}连接测试失败: ${error.message}`,
                    title: 'AI Chat翻译助手',
                    timeout: 5000
                });
                
                console.error(`服务${service}连接测试失败:`, error);
            }
        }

        // 执行测试翻译
        async performTestTranslation(service, text, sourceLang, targetLang, apiKey, appId, secretKey) {
            try {
                // 为不同服务创建测试请求
                switch (service) {
                    case 'google':
                        return new Promise((resolve, reject) => {
                            GM_xmlhttpRequest({
                                method: 'GET',
                                url: `${apiServices.google.endpoint}?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`,
                                timeout: 5000,
                                onload: (response) => {
                                    try {
                                        const data = JSON.parse(response.responseText);
                                        if (data && data[0] && Array.isArray(data[0])) {
                                            resolve({ success: true, result: data[0][0][0] });
                                        } else {
                                            reject(new Error('Google翻译返回格式异常'));
                                        }
                                    } catch (parseError) {
                                        reject(new Error('解析Google翻译结果失败'));
                                    }
                                },
                                onerror: () => reject(new Error('网络请求失败')),
                                ontimeout: () => reject(new Error('请求超时'))
                            });
                        });
                    
                    case 'baidu':
                        // 使用与正式翻译相同的密钥读取方式
                        const baiduAppId = GM_getValue('baidu_appid');
                        const baiduSecretKey = GM_getValue('baidu_secret');
                        
                        if (!baiduAppId || !baiduSecretKey) {
                            throw new Error('百度翻译API密钥未配置');
                        }
                        
                        const baiduSalt = Date.now();
                        const baiduSign = md5(baiduAppId + text + baiduSalt + baiduSecretKey);
                        // 使用正确的语言映射
                        const baiduFromLang = mapLangCode(sourceLang, 'baidu');
                        const baiduToLang = mapLangCode(targetLang, 'baidu');
                        
                        console.log('百度翻译测试参数:', { appId: baiduAppId, salt: baiduSalt, from: baiduFromLang, to: baiduToLang });
                        
                        return new Promise((resolve, reject) => {
                            GM_xmlhttpRequest({
                                method: 'POST',
                                url: apiServices.baidu.endpoint,
                                headers: {
                                    'Content-Type': 'application/x-www-form-urlencoded'
                                },
                                data: `q=${encodeURIComponent(text)}&from=${baiduFromLang}&to=${baiduToLang}&appid=${baiduAppId}&salt=${baiduSalt}&sign=${baiduSign}`,
                                timeout: 5000,
                                onload: (response) => {
                                    try {
                                        const data = JSON.parse(response.responseText);
                                        console.log('百度翻译连接测试响应:', data);
                                        if (data.trans_result && data.trans_result.length > 0) {
                                            resolve({ success: true, result: data.trans_result[0].dst });
                                        } else if (data.error_code) {
                                            reject(new Error(`百度翻译错误: ${data.error_code}`));
                                        } else {
                                            reject(new Error('百度翻译返回格式异常'));
                                        }
                                    } catch (parseError) {
                                        reject(new Error('解析百度翻译结果失败'));
                                    }
                                },
                                onerror: () => reject(new Error('网络请求失败')),
                                ontimeout: () => reject(new Error('请求超时'))
                            });
                        });
                        
                    case 'youdao':
                        const youdaoSalt = Date.now();
                        const youdaoSign = md5(appId + text + youdaoSalt + secretKey);
                        return new Promise((resolve, reject) => {
                            GM_xmlhttpRequest({
                                method: 'POST',
                                url: apiServices.youdao.endpoint,
                                headers: {
                                    'Content-Type': 'application/x-www-form-urlencoded'
                                },
                                data: `q=${encodeURIComponent(text)}&from=${sourceLang}&to=${targetLang}&appKey=${appId}&salt=${youdaoSalt}&sign=${youdaoSign}`,
                                timeout: 5000,
                                onload: (response) => {
                                    try {
                                        const data = JSON.parse(response.responseText);
                                        if (data.errorCode === '0' && data.translation) {
                                            resolve({ success: true, result: data.translation[0] });
                                        } else {
                                            reject(new Error(`有道翻译错误: ${data.errorCode}`));
                                        }
                                    } catch (parseError) {
                                        reject(new Error('解析有道翻译结果失败'));
                                    }
                                },
                                onerror: () => reject(new Error('网络请求失败')),
                                ontimeout: () => reject(new Error('请求超时'))
                            });
                        });
                        
                    case 'siliconflow':
                        return new Promise((resolve, reject) => {
                            GM_xmlhttpRequest({
                                method: 'POST',
                                url: apiServices.siliconflow.endpoint,
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': `Bearer ${apiKey}`
                                },
                                data: JSON.stringify({
                                    model: 'Qwen/Qwen2.5-7B-Instruct',
                                    messages: [
                                        {
                                            role: 'system',
                                            content: '你是一个专业翻译助手。请将以下文本翻译成中文，只返回翻译结果，不要包含任何解释。'
                                        },
                                        {
                                            role: 'user',
                                            content: text
                                        }
                                    ],
                                    max_tokens: 100,
                                    temperature: 0.1
                                }),
                                timeout: 10000,
                                onload: (response) => {
                                    try {
                                        const data = JSON.parse(response.responseText);
                                        if (data.choices && data.choices.length > 0) {
                                            resolve({ success: true, result: data.choices[0].message.content.trim() });
                                        } else {
                                            reject(new Error('硅基流动翻译返回格式异常'));
                                        }
                                    } catch (parseError) {
                                        reject(new Error('解析硅基流动翻译结果失败'));
                                    }
                                },
                                onerror: () => reject(new Error('网络请求失败')),
                                ontimeout: () => reject(new Error('请求超时'))
                            });
                        });
                        
                    case 'deepseek':
                        return new Promise((resolve, reject) => {
                            GM_xmlhttpRequest({
                                method: 'POST',
                                url: apiServices.deepseek.endpoint,
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': `Bearer ${apiKey}`
                                },
                                data: JSON.stringify({
                                    model: 'deepseek-chat',
                                    messages: [
                                        {
                                            role: 'system',
                                            content: 'You are a professional translator. Translate the text to Chinese. Return only the translation, no explanations.'
                                        },
                                        {
                                            role: 'user',
                                            content: text
                                        }
                                    ],
                                    max_tokens: 100,
                                    temperature: 0.1
                                }),
                                timeout: 10000,
                                onload: (response) => {
                                    try {
                                        const data = JSON.parse(response.responseText);
                                        if (data.choices && data.choices.length > 0) {
                                            resolve({ success: true, result: data.choices[0].message.content.trim() });
                                        } else {
                                            reject(new Error('DeepSeek翻译返回格式异常'));
                                        }
                                    } catch (parseError) {
                                        reject(new Error('解析DeepSeek翻译结果失败'));
                                    }
                                },
                                onerror: () => reject(new Error('网络请求失败')),
                                ontimeout: () => reject(new Error('请求超时'))
                            });
                        });
                        
                    case 'custom':
                        const customEndpoint = $('#custom-model-endpoint').val();
                        const customModelName = $('#custom-model-name').val() || 'gpt-3.5-turbo';
                        
                        if (!customEndpoint) {
                            throw new Error('请填写自定义AI模型API端点');
                        }
                        
                        return new Promise((resolve, reject) => {
                            GM_xmlhttpRequest({
                                method: 'POST',
                                url: customEndpoint,
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': `Bearer ${apiKey}`
                                },
                                data: JSON.stringify({
                                    model: customModelName,
                                    messages: [
                                        {
                                            role: 'system',
                                            content: 'You are a professional translator. Translate the text to Chinese. Return only the translation, no explanations.'
                                        },
                                        {
                                            role: 'user',
                                            content: text
                                        }
                                    ],
                                    max_tokens: 100,
                                    temperature: 0.1
                                }),
                                timeout: 10000,
                                onload: (response) => {
                                    try {
                                        const data = JSON.parse(response.responseText);
                                        if (data.choices && data.choices.length > 0) {
                                            resolve({ success: true, result: data.choices[0].message.content.trim() });
                                        } else if (data.result) { // 兼容某些API返回格式
                                            resolve({ success: true, result: data.result });
                                        } else {
                                            reject(new Error('自定义AI模型翻译返回格式异常'));
                                        }
                                    } catch (parseError) {
                                        reject(new Error('解析自定义AI模型翻译结果失败: ' + parseError.message));
                                    }
                                },
                                onerror: (error) => reject(new Error('网络请求失败: ' + error.statusText)),
                                ontimeout: () => reject(new Error('请求超时'))
                            });
                        });
                        
                    default:
                        throw new Error(`不支持的翻译服务: ${service}`);
                }
            } catch (error) {
                return { success: false, error: error.message };
            }
        }

        // 关闭设置面板
        close() {
            $('#settings-panel').hide();
        }
    }

    // 全局变量
    let translationEngine;
    let languageDetector;
    let settingsManager;
    let translationPanel;

    // UI控制面板类
    class TranslationPanel {
        constructor() {
            this.isVisible = false;
            this.isMinimized = false;
            this.isLocked = false;
            this.position = config.ui.panelPosition;
            this.progress = 0;
            this.wordCount = { source: 0, target: 0 };
            this.isPaused = false;
            this.isTranslating = false;
            this.init();
        }

        init() {
            // 初始化语言检测器
            languageDetector = new LanguageDetector();
            
            // 检查是否需要显示悬浮球
            if (languageDetector.shouldShowTranslateButton()) {
                this.createPanel();
                this.bindEvents();
                this.loadPosition();
                this.initFloatButtonDrag();
                
                // 检查并应用之前保存的隐藏状态
                const isHidden = GM_getValue('floatButtonHidden', false);
                if (isHidden) {
                    setTimeout(() => {
                        const floatButton = $('#translate-float-button');
                        const toggleButton = $('#toggle-float-button');
                        floatButton.hide();
                        toggleButton.attr('title', '显示翻译按钮');
                        toggleButton.html('👁️‍🗨️');
                    }, 100);
                }
            } else {
                console.log('页面语言与系统语言相同，不显示翻译悬浮球');
            }
        }

        createPanel() {
            const panelHTML = `
                <div id="translation-panel" class="translation-panel" style="display: none;">
                    <div class="panel-header">
                        <div class="panel-title">AI Chat翻译助手</div>
                        <div class="panel-controls">
                            <button class="control-btn minimize-btn" title="最小化">−</button>
                            <button class="control-btn settings-btn" title="设置">⚙️</button>
                            <button class="control-btn close-btn" title="关闭">×</button>
                        </div>
                    </div>
                    <div class="panel-content">
                        <div class="progress-section">
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: 0%"></div>
                            </div>
                            <div class="progress-text">准备就绪</div>
                        </div>
                        <div class="word-count-section">
                            <div class="word-count-item">
                                <span class="label">源文本:</span>
                                <span class="count source-count">0</span>
                            </div>
                            <div class="word-count-item">
                                <span class="label">译文:</span>
                                <span class="count target-count">0</span>
                            </div>
                        </div>
                        <div class="language-selector-section">
                            <div class="language-selector-row">
                                <span class="language-label">源语言:</span>
                                <select id="source-lang" class="lang-select">
                                    <option value="auto">自动检测</option>
                                    <option value="af">南非语 (Afrikaans)</option>
                                    <option value="sq">阿尔巴尼亚语 (Albanian)</option>
                                    <option value="am">阿姆哈拉语 (Amharic)</option>
                                    <option value="hy">亚美尼亚语 (Armenian)</option>
                                    <option value="az">阿塞拜疆语 (Azerbaijani)</option>
                                    <option value="eu">巴斯克语 (Basque)</option>
                                    <option value="be">白俄罗斯语 (Belarusian)</option>
                                    <option value="bn">孟加拉语 (Bengali)</option>
                                    <option value="bs">波斯尼亚语 (Bosnian)</option>
                                    <option value="bg">保加利亚语 (Bulgarian)</option>
                                    <option value="ca">加泰罗尼亚语 (Catalan)</option>
                                    <option value="ceb">宿务语 (Cebuano)</option>
                                    <option value="ny">奇切瓦语 (Chichewa)</option>
                                    <option value="zh-CN">中文(简体)</option>
                                    <option value="zh-TW">中文(繁体)</option>
                                    <option value="co">科西嘉语 (Corsican)</option>
                                    <option value="hr">克罗地亚语 (Croatian)</option>
                                    <option value="cs">捷克语 (Czech)</option>
                                    <option value="da">丹麦语 (Danish)</option>
                                    <option value="nl">荷兰语 (Dutch)</option>
                                    <option value="en">英语 (English)</option>
                                    <option value="eo">世界语 (Esperanto)</option>
                                    <option value="et">爱沙尼亚语 (Estonian)</option>
                                    <option value="tl">菲律宾语 (Filipino)</option>
                                    <option value="fi">芬兰语 (Finnish)</option>
                                    <option value="fr">法语 (French)</option>
                                    <option value="fy">弗里斯兰语 (Frisian)</option>
                                    <option value="gl">加利西亚语 (Galician)</option>
                                    <option value="ka">格鲁吉亚语 (Georgian)</option>
                                    <option value="de">德语 (German)</option>
                                    <option value="el">希腊语 (Greek)</option>
                                    <option value="gu">古吉拉特语 (Gujarati)</option>
                                    <option value="ht">海地克里奥尔语 (Haitian Creole)</option>
                                    <option value="ha">豪萨语 (Hausa)</option>
                                    <option value="haw">夏威夷语 (Hawaiian)</option>
                                    <option value="he">希伯来语 (Hebrew)</option>
                                    <option value="hi">印地语 (Hindi)</option>
                                    <option value="hmn">苗语 (Hmong)</option>
                                    <option value="hu">匈牙利语 (Hungarian)</option>
                                    <option value="is">冰岛语 (Icelandic)</option>
                                    <option value="ig">伊博语 (Igbo)</option>
                                    <option value="id">印度尼西亚语 (Indonesian)</option>
                                    <option value="ga">爱尔兰语 (Irish)</option>
                                    <option value="it">意大利语 (Italian)</option>
                                    <option value="ja">日语 (Japanese)</option>
                                    <option value="jv">爪哇语 (Javanese)</option>
                                    <option value="kn">卡纳达语 (Kannada)</option>
                                    <option value="kk">哈萨克语 (Kazakh)</option>
                                    <option value="km">高棉语 (Khmer)</option>
                                    <option value="rw">卢旺达语 (Kinyarwanda)</option>
                                    <option value="ko">韩语 (Korean)</option>
                                    <option value="ku">库尔德语 (Kurdish)</option>
                                    <option value="ky">吉尔吉斯语 (Kyrgyz)</option>
                                    <option value="lo">老挝语 (Lao)</option>
                                    <option value="la">拉丁语 (Latin)</option>
                                    <option value="lv">拉脱维亚语 (Latvian)</option>
                                    <option value="lt">立陶宛语 (Lithuanian)</option>
                                    <option value="lb">卢森堡语 (Luxembourgish)</option>
                                    <option value="mk">马其顿语 (Macedonian)</option>
                                    <option value="mg">马拉加西语 (Malagasy)</option>
                                    <option value="ms">马来语 (Malay)</option>
                                    <option value="ml">马拉雅拉姆语 (Malayalam)</option>
                                    <option value="mt">马耳他语 (Maltese)</option>
                                    <option value="mi">毛利语 (Maori)</option>
                                    <option value="mr">马拉地语 (Marathi)</option>
                                    <option value="mn">蒙古语 (Mongolian)</option>
                                    <option value="my">缅甸语 (Myanmar)</option>
                                    <option value="ne">尼泊尔语 (Nepali)</option>
                                    <option value="no">挪威语 (Norwegian)</option>
                                    <option value="or">奥里亚语 (Odia)</option>
                                    <option value="ps">普什图语 (Pashto)</option>
                                    <option value="fa">波斯语 (Persian)</option>
                                    <option value="pl">波兰语 (Polish)</option>
                                    <option value="pt">葡萄牙语 (Portuguese)</option>
                                    <option value="pa">旁遮普语 (Punjabi)</option>
                                    <option value="ro">罗马尼亚语 (Romanian)</option>
                                    <option value="ru">俄语 (Russian)</option>
                                    <option value="sm">萨摩亚语 (Samoan)</option>
                                    <option value="gd">苏格兰盖尔语 (Scots Gaelic)</option>
                                    <option value="sr">塞尔维亚语 (Serbian)</option>
                                    <option value="st">塞索托语 (Sesotho)</option>
                                    <option value="sn">修纳语 (Shona)</option>
                                    <option value="sd">信德语 (Sindhi)</option>
                                    <option value="si">僧伽罗语 (Sinhala)</option>
                                    <option value="sk">斯洛伐克语 (Slovak)</option>
                                    <option value="sl">斯洛文尼亚语 (Slovenian)</option>
                                    <option value="so">索马里语 (Somali)</option>
                                    <option value="es">西班牙语 (Spanish)</option>
                                    <option value="su">巽他语 (Sundanese)</option>
                                    <option value="sw">斯瓦希里语 (Swahili)</option>
                                    <option value="sv">瑞典语 (Swedish)</option>
                                    <option value="tg">塔吉克语 (Tajik)</option>
                                    <option value="ta">泰米尔语 (Tamil)</option>
                                    <option value="tt">鞑靼语 (Tatar)</option>
                                    <option value="te">泰卢固语 (Telugu)</option>
                                    <option value="th">泰语 (Thai)</option>
                                    <option value="tr">土耳其语 (Turkish)</option>
                                    <option value="tk">土库曼语 (Turkmen)</option>
                                    <option value="uk">乌克兰语 (Ukrainian)</option>
                                    <option value="ur">乌尔都语 (Urdu)</option>
                                    <option value="ug">维吾尔语 (Uyghur)</option>
                                    <option value="uz">乌兹别克语 (Uzbek)</option>
                                    <option value="vi">越南语 (Vietnamese)</option>
                                    <option value="cy">威尔士语 (Welsh)</option>
                                    <option value="xh">科萨语 (Xhosa)</option>
                                    <option value="yi">意第绪语 (Yiddish)</option>
                                    <option value="yo">约鲁巴语 (Yoruba)</option>
                                    <option value="zu">祖鲁语 (Zulu)</option>
                                </select>
                            </div>
                            <div class="language-selector-row">
                                <span class="language-label">目标语言:</span>
                                <select id="target-lang" class="lang-select">
                                    <option value="af">南非语 (Afrikaans)</option>
                                    <option value="sq">阿尔巴尼亚语 (Albanian)</option>
                                    <option value="am">阿姆哈拉语 (Amharic)</option>
                                    <option value="hy">亚美尼亚语 (Armenian)</option>
                                    <option value="az">阿塞拜疆语 (Azerbaijani)</option>
                                    <option value="eu">巴斯克语 (Basque)</option>
                                    <option value="be">白俄罗斯语 (Belarusian)</option>
                                    <option value="bn">孟加拉语 (Bengali)</option>
                                    <option value="bs">波斯尼亚语 (Bosnian)</option>
                                    <option value="bg">保加利亚语 (Bulgarian)</option>
                                    <option value="ca">加泰罗尼亚语 (Catalan)</option>
                                    <option value="ceb">宿务语 (Cebuano)</option>
                                    <option value="ny">奇切瓦语 (Chichewa)</option>
                                    <option value="zh-CN">中文(简体)</option>
                                    <option value="zh-TW">中文(繁体)</option>
                                    <option value="co">科西嘉语 (Corsican)</option>
                                    <option value="hr">克罗地亚语 (Croatian)</option>
                                    <option value="cs">捷克语 (Czech)</option>
                                    <option value="da">丹麦语 (Danish)</option>
                                    <option value="nl">荷兰语 (Dutch)</option>
                                    <option value="en">英语 (English)</option>
                                    <option value="eo">世界语 (Esperanto)</option>
                                    <option value="et">爱沙尼亚语 (Estonian)</option>
                                    <option value="tl">菲律宾语 (Filipino)</option>
                                    <option value="fi">芬兰语 (Finnish)</option>
                                    <option value="fr">法语 (French)</option>
                                    <option value="fy">弗里斯兰语 (Frisian)</option>
                                    <option value="gl">加利西亚语 (Galician)</option>
                                    <option value="ka">格鲁吉亚语 (Georgian)</option>
                                    <option value="de">德语 (German)</option>
                                    <option value="el">希腊语 (Greek)</option>
                                    <option value="gu">古吉拉特语 (Gujarati)</option>
                                    <option value="ht">海地克里奥尔语 (Haitian Creole)</option>
                                    <option value="ha">豪萨语 (Hausa)</option>
                                    <option value="haw">夏威夷语 (Hawaiian)</option>
                                    <option value="he">希伯来语 (Hebrew)</option>
                                    <option value="hi">印地语 (Hindi)</option>
                                    <option value="hmn">苗语 (Hmong)</option>
                                    <option value="hu">匈牙利语 (Hungarian)</option>
                                    <option value="is">冰岛语 (Icelandic)</option>
                                    <option value="ig">伊博语 (Igbo)</option>
                                    <option value="id">印度尼西亚语 (Indonesian)</option>
                                    <option value="ga">爱尔兰语 (Irish)</option>
                                    <option value="it">意大利语 (Italian)</option>
                                    <option value="ja">日语 (Japanese)</option>
                                    <option value="jv">爪哇语 (Javanese)</option>
                                    <option value="kn">卡纳达语 (Kannada)</option>
                                    <option value="kk">哈萨克语 (Kazakh)</option>
                                    <option value="km">高棉语 (Khmer)</option>
                                    <option value="rw">卢旺达语 (Kinyarwanda)</option>
                                    <option value="ko">韩语 (Korean)</option>
                                    <option value="ku">库尔德语 (Kurdish)</option>
                                    <option value="ky">吉尔吉斯语 (Kyrgyz)</option>
                                    <option value="lo">老挝语 (Lao)</option>
                                    <option value="la">拉丁语 (Latin)</option>
                                    <option value="lv">拉脱维亚语 (Latvian)</option>
                                    <option value="lt">立陶宛语 (Lithuanian)</option>
                                    <option value="lb">卢森堡语 (Luxembourgish)</option>
                                    <option value="mk">马其顿语 (Macedonian)</option>
                                    <option value="mg">马拉加西语 (Malagasy)</option>
                                    <option value="ms">马来语 (Malay)</option>
                                    <option value="ml">马拉雅拉姆语 (Malayalam)</option>
                                    <option value="mt">马耳他语 (Maltese)</option>
                                    <option value="mi">毛利语 (Maori)</option>
                                    <option value="mr">马拉地语 (Marathi)</option>
                                    <option value="mn">蒙古语 (Mongolian)</option>
                                    <option value="my">缅甸语 (Myanmar)</option>
                                    <option value="ne">尼泊尔语 (Nepali)</option>
                                    <option value="no">挪威语 (Norwegian)</option>
                                    <option value="or">奥里亚语 (Odia)</option>
                                    <option value="ps">普什图语 (Pashto)</option>
                                    <option value="fa">波斯语 (Persian)</option>
                                    <option value="pl">波兰语 (Polish)</option>
                                    <option value="pt">葡萄牙语 (Portuguese)</option>
                                    <option value="pa">旁遮普语 (Punjabi)</option>
                                    <option value="ro">罗马尼亚语 (Romanian)</option>
                                    <option value="ru">俄语 (Russian)</option>
                                    <option value="sm">萨摩亚语 (Samoan)</option>
                                    <option value="gd">苏格兰盖尔语 (Scots Gaelic)</option>
                                    <option value="sr">塞尔维亚语 (Serbian)</option>
                                    <option value="st">塞索托语 (Sesotho)</option>
                                    <option value="sn">修纳语 (Shona)</option>
                                    <option value="sd">信德语 (Sindhi)</option>
                                    <option value="si">僧伽罗语 (Sinhala)</option>
                                    <option value="sk">斯洛伐克语 (Slovak)</option>
                                    <option value="sl">斯洛文尼亚语 (Slovenian)</option>
                                    <option value="so">索马里语 (Somali)</option>
                                    <option value="es">西班牙语 (Spanish)</option>
                                    <option value="su">巽他语 (Sundanese)</option>
                                    <option value="sw">斯瓦希里语 (Swahili)</option>
                                    <option value="sv">瑞典语 (Swedish)</option>
                                    <option value="tg">塔吉克语 (Tajik)</option>
                                    <option value="ta">泰米尔语 (Tamil)</option>
                                    <option value="tt">鞑靼语 (Tatar)</option>
                                    <option value="te">泰卢固语 (Telugu)</option>
                                    <option value="th">泰语 (Thai)</option>
                                    <option value="tr">土耳其语 (Turkish)</option>
                                    <option value="tk">土库曼语 (Turkmen)</option>
                                    <option value="uk">乌克兰语 (Ukrainian)</option>
                                    <option value="ur">乌尔都语 (Urdu)</option>
                                    <option value="ug">维吾尔语 (Uyghur)</option>
                                    <option value="uz">乌兹别克语 (Uzbek)</option>
                                    <option value="vi">越南语 (Vietnamese)</option>
                                    <option value="cy">威尔士语 (Welsh)</option>
                                    <option value="xh">科萨语 (Xhosa)</option>
                                    <option value="yi">意第绪语 (Yiddish)</option>
                                    <option value="yo">约鲁巴语 (Yoruba)</option>
                                    <option value="zu">祖鲁语 (Zulu)</option>
                                </select>
                            </div>
                        </div>
                        <div class="selector-row">
                            <button class="swap-btn" title="交换语言">↔️</button>
                            <select id="translation-service" class="service-select">
                                <option value="google">Google翻译</option>
                                <option value="baidu">百度翻译</option>
                                <option value="youdao">有道翻译</option>
                                <option value="siliconflow">硅基流动</option>
                                <option value="deepseek">DeepSeek</option>
                                <option value="custom">自定义AI模型</option>
                            </select>
                        </div>
                        <div class="action-buttons-section">
                            <button id="full-page-translate-btn" class="action-btn primary-btn">🌐 全页翻译</button>
                            <div class="toggle-buttons-row">
                                <button id="hover-translate-btn" class="action-btn secondary-btn toggle-btn" data-feature="hover-translate">
                                    <span class="toggle-indicator">●</span>
                                    <span class="btn-text">悬浮翻译</span>
                                </button>
                                <button id="translate-btn" class="action-btn secondary-btn toggle-btn" data-feature="word-translate">
                                    <span class="toggle-indicator">●</span>
                                    <span class="btn-text">划词翻译</span>
                                </button>
                            </div>
                            <div class="control-buttons-row">
                                <button id="pause-translate-btn" class="action-btn secondary-btn" style="display: none;">⏸️ 暂停翻译</button>
                                <button id="resume-translate-btn" class="action-btn secondary-btn" style="display: none;">▶️ 继续翻译</button>
                                <button id="restore-original-btn" class="action-btn secondary-btn">↺ 还原原文</button>
                                <button id="save-panel-settings-btn" class="action-btn secondary-btn">💾 保存设置</button>
                                <button id="open-settings-btn" class="action-btn secondary-btn">⚙️ 设置</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div id="translate-float-button" class="translate-float-button" title="打开翻译面板">
                    🌐
                </div>
                <div id="toggle-float-button" class="toggle-float-button" title="隐藏/显示翻译按钮">
                    👁️
                </div>
            `;

            console.log('开始创建面板和悬浮球');
            $('body').append(panelHTML);
            console.log('面板和悬浮球已添加到DOM');
            this.loadStyles();
            
            // 确保悬浮球存在
            setTimeout(() => {
                const floatButton = $('#translate-float-button');
                if (floatButton.length > 0) {
                    console.log('悬浮球创建成功');
                } else {
                    console.error('悬浮球创建失败');
                }
            }, 100);
        }

        loadStyles() {
            const styles = `
                .translation-panel {
                    position: fixed;
                    top: 100px;
                    right: 20px;
                    width: 400px;
                    background: white;
                    border-radius: 18px;
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
                    z-index: 9999998;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif, 'Microsoft YaHei', sans-serif;
                    -webkit-transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    backdrop-filter: blur(10px);
                    -webkit-backdrop-filter: blur(10px);
                }

                .panel-header {
                    display: -webkit-flex;
                    display: flex;
                    -webkit-justify-content: space-between;
                    justify-content: space-between;
                    -webkit-align-items: center;
                    align-items: center;
                    padding: 20px 24px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    border-radius: 18px 18px 0 0;
                    cursor: move;
                    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                }

                .panel-title {
                    font-weight: 600;
                    font-size: 18px;
                    letter-spacing: 0.5px;
                }

                .panel-controls {
                    display: -webkit-flex;
                    display: flex;
                    gap: 10px;
                }

                .control-btn {
                    width: 36px;
                    height: 36px;
                    border: none;
                    background: rgba(255, 255, 255, 0.2);
                    color: white;
                    border-radius: 10px;
                    cursor: pointer;
                    font-size: 18px;
                    display: -webkit-flex;
                    display: flex;
                    -webkit-align-items: center;
                    align-items: center;
                    -webkit-justify-content: center;
                    justify-content: center;
                    -webkit-transition: all 0.2s ease;
                    transition: all 0.2s ease;
                }

                .control-btn:hover {
                    background: rgba(255, 255, 255, 0.3);
                    -webkit-transform: translateY(-2px);
                    transform: translateY(-2px);
                }

                .control-btn:active {
                    -webkit-transform: translateY(0);
                    transform: translateY(0);
                }

                .panel-content {
                    padding: 24px;
                }

                .progress-section {
                    margin-bottom: 24px;
                }

                .progress-bar {
                    width: 100%;
                    height: 10px;
                    background: #edf2f7;
                    border-radius: 5px;
                    overflow: hidden;
                    margin-bottom: 12px;
                    box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.05);
                }

                .progress-fill {
                    height: 100%;
                    background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
                    border-radius: 5px;
                    -webkit-transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                    transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                    box-shadow: 0 2px 4px rgba(102, 126, 234, 0.2);
                }

                .progress-text {
                    font-size: 14px;
                    color: #718096;
                    text-align: center;
                    font-weight: 500;
                }

                .word-count-section {
                    display: -webkit-flex;
                    display: flex;
                    -webkit-justify-content: space-around;
                    justify-content: space-around;
                    margin-bottom: 24px;
                    padding: 18px;
                    background: #f8fafc;
                    border-radius: 12px;
                    font-size: 15px;
                    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
                    border: 1px solid #edf2f7;
                }

                .word-count-item {
                    display: -webkit-flex;
                    display: flex;
                    -webkit-align-items: center;
                    align-items: center;
                    gap: 8px;
                }

                .word-count-item .label {
                    color: #718096;
                    font-weight: 500;
                }

                .word-count-item .count {
                    font-weight: 600;
                    color: #2d3748;
                }

                .language-selector-section {
                    display: -webkit-flex;
                    display: flex;
                    -webkit-flex-direction: column;
                    flex-direction: column;
                    gap: 12px;
                    margin-bottom: 20px;
                }

                .language-selector-row {
                    display: -webkit-flex;
                    display: flex;
                    -webkit-align-items: center;
                    align-items: center;
                    gap: 12px;
                    width: 100%;
                }

                .language-label {
                    font-size: 14px;
                    color: #4a5568;
                    font-weight: 500;
                    min-width: 60px;
                    text-align: left;
                }

                .lang-select, .service-select {
                    flex: 1;
                    padding: 14px 16px;
                    border: 1px solid #e2e8f0;
                    border-radius: 12px;
                    background: white;
                    font-size: 15px;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
                    max-width: calc(100% - 80px);
                }

                .lang-select:focus, .service-select:focus {
                    outline: none;
                    border-color: #667eea;
                    box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
                }

                .lang-select::-webkit-input-placeholder,
                .service-select::-webkit-input-placeholder {
                    color: #a0aec0;
                }

                .swap-btn {
                    width: 44px;
                    height: 44px;
                    border: 1px solid #e2e8f0;
                    border-radius: 12px;
                    background: white;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 20px;
                    transition: all 0.3s ease;
                    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
                }

                .swap-btn:hover {
                    background: #f1f5f9;
                    -webkit-transform: rotate(180deg);
                    transform: rotate(180deg);
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                }

                .service-selector-section {
                    margin-bottom: 24px;
                }
                
                .selector-row {
                    display: -webkit-flex;
                    display: flex;
                    -webkit-align-items: center;
                    align-items: center;
                    gap: 12px;
                    margin-bottom: 24px;
                }
                
                .selector-row .swap-btn {
                    width: 44px;
                    height: 44px;
                    flex-shrink: 0;
                }
                
                .selector-row .service-select {
                    flex: 1;
                    max-width: none;
                }

                .action-buttons-section {
                    display: -webkit-flex;
                    display: flex;
                    -webkit-flex-direction: column;
                    flex-direction: column;
                    gap: 12px;
                }

                .toggle-buttons-row,
                .control-buttons-row {
                    display: -webkit-flex;
                    display: flex;
                    -webkit-flex-direction: row;
                    flex-direction: row;
                    gap: 12px;
                }

                .toggle-buttons-row .action-btn,
                .control-buttons-row .action-btn {
                    flex: 1;
                    min-width: 0;
                }

                .action-btn {
                    padding: 14px 18px;
                    border: none;
                    border-radius: 12px;
                    cursor: pointer;
                    font-size: 15px;
                    font-weight: 500;
                    -webkit-transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                    display: -webkit-flex;
                    display: flex;
                    -webkit-align-items: center;
                    align-items: center;
                    -webkit-justify-content: center;
                    justify-content: center;
                    gap: 8px;
                    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif, 'Microsoft YaHei', sans-serif, emoji, 'Apple Color Emoji', 'Segoe UI Emoji';
                    min-height: 50px;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }

                .action-btn:hover {
                    -webkit-transform: translateY(-3px);
                    transform: translateY(-3px);
                    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
                }

                .action-btn:active {
                    -webkit-transform: translateY(0);
                    transform: translateY(0);
                }

                .action-btn.primary-btn {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    flex: 1 1 100%;
                    padding: 16px;
                    font-weight: 600;
                    letter-spacing: 0.5px;
                }

                .action-btn.primary-btn:hover {
                    box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
                    background: linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%);
                }

                .action-btn.secondary-btn {
                    background: white;
                    color: #4a5568;
                    border: 1px solid #e2e8f0;
                    flex: 1;
                }

                .action-btn.secondary-btn:hover {
                    background: #f8fafc;
                    border-color: #cbd5e0;
                    color: #2d3748;
                }

                .toggle-btn {
                    position: relative;
                }

                .toggle-indicator {
                    font-size: 14px;
                    transition: all 0.2s ease;
                }

                .toggle-btn.active .toggle-indicator {
                    color: #48bb78;
                }

                .toggle-btn:not(.active) .toggle-indicator {
                    color: #cbd5e0;
                }

                .translation-panel.minimized .panel-content {
                    display: none;
                }

                .translate-float-button {
                    position: fixed;
                    right: 25px;
                    bottom: 90px;
                    width: 32px;
                    height: 32px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    border-radius: 50%;
                    display: -webkit-flex !important;
                    display: flex !important;
                    -webkit-align-items: center;
                    align-items: center;
                    -webkit-justify-content: center;
                    justify-content: center;
                    font-size: 14px;
                    cursor: pointer;
                    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
                    z-index: 9999997;
                    -webkit-transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    -webkit-user-select: none;
                    user-select: none;
                    border: 2px solid white;
                }
                
                .translate-float-button.draggable {
                    cursor: grab;
                }
                
                .translate-float-button.dragging {
                    cursor: grabbing;
                }
                
                .toggle-float-button {
                    position: fixed;
                    right: 25px;
                    bottom: 130px;
                    width: 32px;
                    height: 32px;
                    background: rgba(102, 126, 234, 0.8);
                    border-radius: 50%;
                    display: -webkit-flex !important;
                    display: flex !important;
                    -webkit-align-items: center;
                    align-items: center;
                    -webkit-justify-content: center;
                    justify-content: center;
                    font-size: 14px;
                    cursor: pointer;
                    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
                    z-index: 9999996;
                    -webkit-transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    -webkit-user-select: none;
                    user-select: none;
                    border: 2px solid white;
                    opacity: 0.7;
                }
                
                .toggle-float-button:hover {
                    opacity: 1;
                    -webkit-transform: scale(1.1);
                    transform: scale(1.1);
                    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
                }
                
                .toggle-float-button:active {
                    -webkit-transform: scale(0.9);
                    transform: scale(0.9);
                }

                .translate-float-button:hover {
                    -webkit-transform: scale(1.15);
                    transform: scale(1.15);
                    box-shadow: 0 10px 30px rgba(102, 126, 234, 0.5);
                }

                .translate-float-button:active {
                    -webkit-transform: scale(0.95);
                    transform: scale(0.95);
                }

                .translate-result-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.5);
                    z-index: 99999999;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .translate-result-content {
                    background: white;
                    border-radius: 16px;
                    width: 90%;
                    max-width: 800px;
                    max-height: 80vh;
                    display: flex;
                    flex-direction: column;
                    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
                }

                .result-header {
                    padding: 20px 24px;
                    border-bottom: 1px solid #e0e0e0;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .result-header h3 {
                    margin: 0;
                    font-size: 18px;
                    font-weight: 600;
                }

                .result-close {
                    width: 32px;
                    height: 32px;
                    border: none;
                    background: transparent;
                    font-size: 24px;
                    cursor: pointer;
                    border-radius: 6px;
                    color: #666;
                }

                .result-close:hover {
                    background: #f0f0f0;
                }

                .result-body {
                    padding: 24px;
                    overflow-y: auto;
                    flex: 1;
                }

                .text-section {
                    margin-bottom: 20px;
                }

                .text-section:last-child {
                    margin-bottom: 0;
                }

                .text-section h4 {
                    margin: 0 0 12px 0;
                    font-size: 14px;
                    color: #666;
                    font-weight: 500;
                }

                .text-content {
                    padding: 16px;
                    background: #f8f9fa;
                    border-radius: 10px;
                    font-size: 15px;
                    line-height: 1.6;
                    color: #333;
                    white-space: pre-wrap;
                    word-break: break-word;
                }

                .translated-content {
                    background: #e8f4f8;
                }

                .result-footer {
                    padding: 16px 24px;
                    border-top: 1px solid #e0e0e0;
                    display: flex;
                    gap: 12px;
                    justify-content: flex-end;
                }

                .result-btn {
                    padding: 10px 20px;
                    border: none;
                    border-radius: 8px;
                    font-size: 14px;
                    font-weight: 500;
                    cursor: pointer;
                    -webkit-transition: all 0.2s; /* Webkit兼容 */
                    transition: all 0.2s;
                }

                .result-btn-primary {
                    background: #667eea;
                    color: white;
                }

                .result-btn-primary:hover {
                    background: #5568d3;
                }

                .result-btn-primary:active,
                .result-btn-secondary:active {
                    transform: translateY(0);
                }

                .result-btn-secondary {
                    background: #e0e0e0;
                    color: #333;
                }

                .result-btn-secondary:hover {
                    background: #d0d0d0;
                }

                .result-btn-secondary:active {
                    transform: translateY(0);
                }

                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.5; }
                }

                .progress-fill.loading {
                    animation: pulse 1.5s infinite;
                }

                @keyframes spin {
                    0% { -webkit-transform: rotate(0deg); transform: rotate(0deg); }
                    100% { -webkit-transform: rotate(360deg); transform: rotate(360deg); }
                }

                .loading-spinner {
                    display: inline-block;
                    animation: spin 1s linear infinite;
                    font-size: 16px;
                }

                @keyframes fadeIn {
                    from { opacity: 0; -webkit-transform: translateY(10px); transform: translateY(10px); }
                    to { opacity: 1; -webkit-transform: translateY(0); transform: translateY(0); }
                }

                .translation-tooltip {
                    position: absolute;
                    background: rgba(0, 0, 0, 0.9);
                    color: white;
                    padding: 12px 16px;
                    border-radius: 8px;
                    font-size: 14px;
                    line-height: 1.5;
                    z-index: 9999999;
                    max-width: 300px;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
                    animation: fadeIn 0.2s ease-out;
                    pointer-events: none;
                }

                .translation-tooltip .tooltip-header {
                    font-weight: bold;
                    margin-bottom: 6px;
                    color: #66ccff;
                }

                .translation-tooltip .tooltip-content {
                    word-break: break-word;
                }

                .translation-tooltip .tooltip-loading {
                    display: inline-block;
                    animation: spin 1s linear infinite;
                    margin-right: 8px;
                }
            `;

            GM_addStyle(styles);
        }

        bindEvents() {
            // 使用事件委托确保动态元素也能绑定
            $(document).on('click', '.minimize-btn', () => this.toggleMinimize());
            $(document).on('click', '.settings-btn', () => {
                console.log('顶部设置按钮点击');
                if (settingsManager) {
                    settingsManager.open();
                } else {
                    console.error('settingsManager 未初始化');
                }
            });
            $(document).on('click', '#open-settings-btn', () => {
                console.log('底部设置按钮点击');
                if (settingsManager) {
                    settingsManager.open();
                } else {
                    console.error('settingsManager 未初始化');
                    GM_notification({
                        text: '设置功能初始化失败，请刷新页面',
                        title: 'AI Chat翻译助手',
                        timeout: 3000
                    });
                }
            });
            $(document).on('click', '.close-btn', () => this.hide());
            
            // 悬浮球点击事件 - 增强版本（提高360浏览器兼容性）
            // 使用事件委托确保即使DOM元素重新创建也能正常工作
            $(document).on('click', '#translate-float-button', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('悬浮球被点击');
                console.log('当前面板状态:', this.isVisible);
                console.log('面板元素是否存在:', $('#translation-panel').length > 0);
                this.toggle();
            });
            
            // 悬浮球隐藏/显示按钮事件
            $(document).on('click', '#toggle-float-button', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const floatButton = $('#translate-float-button');
                const toggleButton = $('#toggle-float-button');
                
                if (floatButton.is(':visible')) {
                    // 隐藏悬浮球
                    floatButton.hide();
                    toggleButton.attr('title', '显示翻译按钮');
                    toggleButton.html('👁️‍🗨️');
                    // 保存隐藏状态
                    GM_setValue('floatButtonHidden', true);
                } else {
                    // 显示悬浮球
                    floatButton.show();
                    toggleButton.attr('title', '隐藏翻译按钮');
                    toggleButton.html('👁️');
                    // 保存显示状态
                    GM_setValue('floatButtonHidden', false);
                }
            });
            
            // 只在支持的浏览器中添加touch事件
            if ('ontouchstart' in window) {
                $(document).on('touchstart', '#translate-float-button', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('悬浮球被触摸');
                    this.toggle();
                });
            }
            
            // 切换按钮事件
            $(document).on('click', '.toggle-btn', (e) => {
                const btn = $(e.target).closest('.toggle-btn');
                const feature = btn.data('feature');
                
                btn.toggleClass('active');
                
                // 仅更新临时状态，不立即应用设置
                if (feature === 'word-translate') {
                    // 临时保存状态，等待保存设置时才真正应用
                    btn.attr('data-temp-state', btn.hasClass('active') ? 'enabled' : 'disabled');
                    // 同步更新设置页面的复选框临时状态
                    if ($('#word-translate').length > 0) {
                        $('#word-translate').prop('checked', btn.hasClass('active'));
                    }
                } else if (feature === 'hover-translate') {
                    // 临时保存状态，等待保存设置时才真正应用
                    btn.attr('data-temp-state', btn.hasClass('active') ? 'enabled' : 'disabled');
                    // 同步更新设置页面的复选框临时状态
                    if ($('#hover-translate').length > 0) {
                        $('#hover-translate').prop('checked', btn.hasClass('active'));
                    }
                }
                
                console.log(`${feature} 功能临时${btn.hasClass('active') ? '启用' : '禁用'}`);
            });
            
            $(document).on('click', '#translate-btn', () => this.handleTranslate());
            $(document).on('click', '#full-page-translate-btn', () => this.handleFullPageTranslate());
            $(document).on('click', '#pause-translate-btn', () => this.handlePauseTranslate());
            $(document).on('click', '#resume-translate-btn', () => this.handleResumeTranslate());
            $(document).on('click', '#restore-original-btn', () => this.handleRestoreOriginal());
            $(document).on('click', '#save-panel-settings-btn', () => this.handleSavePanelSettings());
            
            $(document).on('click', '.swap-btn', () => this.swapLanguages());
            
            this.initDrag();
            this.bindShortcuts();
        }

        bindShortcuts() {
            $(document).on('keydown', (e) => {
                if (this.matchShortcut(e, config.shortcut.translate)) {
                    e.preventDefault();
                    this.handleTranslate();
                }

                if (this.matchShortcut(e, config.shortcut.togglePanel)) {
                    e.preventDefault();
                    this.toggle();
                }
                
                // Ctrl+U 快捷键隐藏/显示悬浮球
                if (e.ctrlKey && e.key.toLowerCase() === 'u') {
                    e.preventDefault();
                    const floatButton = $('#translate-float-button');
                    const toggleButton = $('#toggle-float-button');
                    
                    if (floatButton.is(':visible')) {
                        // 隐藏悬浮球
                        floatButton.hide();
                        toggleButton.attr('title', '显示翻译按钮');
                        toggleButton.html('👁️‍🗨️');
                        // 保存隐藏状态
                        GM_setValue('floatButtonHidden', true);
                    } else {
                        // 显示悬浮球
                        floatButton.show();
                        toggleButton.attr('title', '隐藏翻译按钮');
                        toggleButton.html('👁️');
                        // 保存显示状态
                        GM_setValue('floatButtonHidden', false);
                    }
                }
            });
            
            // 监听文本选择事件，实现自动翻译
            let selectionTimeout;
            $(document).on('mouseup keyup', () => {
                clearTimeout(selectionTimeout);
                selectionTimeout = setTimeout(() => {
                    const selectedText = window.getSelection().toString().trim();
                    if (selectedText && selectedText.length > 0) {
                        // 检查选中的文本是否为非中文
                        const chineseChars = selectedText.match(/[\u4e00-\u9fa5]/g);
                        const chineseRatio = chineseChars ? chineseChars.length / selectedText.length : 0;
                        
                        // 如果中文字符比例小于50%，则自动翻译
                        if (chineseRatio < 0.5) {
                            // 延迟一小段时间确保选择完成后再翻译
                            setTimeout(() => {
                                this.handleTranslate();
                            }, 300);
                        }
                    }
                }, 500); // 500ms防抖延迟
            });
            
            // 实现鼠标悬停翻译功能
            let hoverTimeout;
            let currentHoverElement = null;
            
            // 优化：使用更精确的选择器和更快的文本检测
            $(document).on('mouseover', 'p, div:not(:empty), span:not(:empty), h1, h2, h3, h4, h5, h6, li, td, th', function(e) {
                // 检查悬浮翻译功能是否启用
                if (!config.features.hoverTranslate) {
                    return;
                }
                
                const element = $(this);
                // 优化：快速过滤明显不需要翻译的元素
                if (element.closest('#translation-panel, #translate-float-button, #settings-panel, .translation-tooltip').length > 0) {
                    return;
                }
                
                const text = element.text().trim();
                
                // 优化过滤条件：文本长度适中，且包含非中文字符
                if (text.length > 5 && text.length < 300) {  // 缩小范围以提高性能
                    // 优化：快速检测是否包含非中文字符
                    if (/[a-zA-Z]/.test(text)) {  // 先检查是否有英文字母
                        const chineseChars = text.match(/[\u4e00-\u9fa5]/g);
                        const chineseRatio = chineseChars ? chineseChars.length / text.length : 0;
                        
                        // 如果中文字符比例小于90%，则可能是需要翻译的文本
                        if (chineseRatio < 0.9) {
                            currentHoverElement = element;
                            
                            // 优化：减少延迟时间到300ms以提高响应速度
                            hoverTimeout = setTimeout(() => {
                                // 再次检查元素是否仍然存在且功能启用
                                if (currentHoverElement && config.features.hoverTranslate) {
                                    translationPanel.handleHoverTranslate(element, text);
                                }
                            }, 300); // 减少到300ms延迟触发
                        }
                    }
                }
            });
            
            $(document).on('mouseout', 'p, div, span, h1, h2, h3, h4, h5, h6, li, td, th', function(e) {
                clearTimeout(hoverTimeout);
                currentHoverElement = null;
            });
        }

        matchShortcut(e, shortcut) {
            const parts = shortcut.toLowerCase().split('+').map(p => p.trim());
            const key = parts[parts.length - 1];
            
            const hasCtrl = parts.includes('ctrl') ? e.ctrlKey : !e.ctrlKey;
            const hasShift = parts.includes('shift') ? e.shiftKey : !e.shiftKey;
            const hasAlt = parts.includes('alt') ? e.altKey : !e.altKey;
            
            if (parts.includes('ctrl') && !e.ctrlKey) return false;
            if (parts.includes('shift') && !e.shiftKey) return false;
            if (parts.includes('alt') && !e.altKey) return false;
            
            return e.key.toLowerCase() === key.toLowerCase();
        }

        initDrag() {
            const panel = $('#translation-panel');
            const header = $('.panel-header');
            let isDragging = false;
            let startX, startY, startLeft, startTop;

            header.on('mousedown', (e) => {
                if (this.isLocked) return;
                isDragging = true;
                startX = e.clientX;
                startY = e.clientY;
                const offset = panel.offset();
                startLeft = offset.left;
                startTop = offset.top;
            });

            $(document).on('mousemove', (e) => {
                if (!isDragging) return;
                const deltaX = e.clientX - startX;
                const deltaY = e.clientY - startY;
                panel.css({
                    left: startLeft + deltaX + 'px',
                    top: startTop + deltaY + 'px',
                    right: 'auto'
                });
            });

            $(document).on('mouseup', () => {
                if (isDragging) {
                    isDragging = false;
                    this.savePosition();
                }
            });
        }
        
        // 初始化悬浮球拖拽功能（限制只能垂直移动）
        initFloatButtonDrag() {
            const button = $('#translate-float-button');
            const toggleButton = $('#toggle-float-button');
            let isDragging = false;
            let startY, startBottom;
            const rightPos = 25; // 固定右侧位置
            const toggleOffset = 40; // 隐藏按钮与悬浮球的垂直距离
            
            // 添加拖拽样式
            button.addClass('draggable');
            
            button.on('mousedown', (e) => {
                isDragging = true;
                startY = e.clientY;
                startBottom = parseInt(button.css('bottom')) || 90;
                button.addClass('dragging');
                e.preventDefault();
            });

            $(document).on('mousemove.floatButton', (e) => {
                if (!isDragging) return;
                
                const deltaY = startY - e.clientY; // 垂直方向变化
                let newBottom = startBottom + deltaY;
                
                // 限制移动范围
                const windowHeight = $(window).height();
                newBottom = Math.max(20, Math.min(newBottom, windowHeight - 50));
                
                button.css({
                    bottom: newBottom + 'px',
                    right: rightPos + 'px'
                });
                
                // 同时移动隐藏按钮
                toggleButton.css({
                    bottom: (newBottom + toggleOffset) + 'px',
                    right: rightPos + 'px'
                });
            });

            $(document).on('mouseup.floatButton', () => {
                if (isDragging) {
                    isDragging = false;
                    button.removeClass('dragging');
                    // 保存位置
                    const currentPosition = {
                        bottom: parseInt(button.css('bottom'))
                    };
                    GM_setValue('floatButtonPosition', currentPosition);
                }
            });
        }

        async handleTranslate() {
            // 检查域名是否被屏蔽
            if (config.features.domainBlocked) {
                console.log('当前域名已被屏蔽，无法使用翻译功能');
                return;
            }
            
            const selectedText = window.getSelection().toString().trim();
            
            if (!selectedText) {
                GM_notification({
                    text: '请先选择要翻译的文本',
                    title: 'AI Chat翻译助手',
                    timeout: 2000
                });
                return;
            }

            // 检查划词翻译功能是否启用
            if (!config.features.wordTranslate) {
                console.log('划词翻译功能已禁用，当前配置状态:', config.features.wordTranslate);
                console.log('保存的设置值:', GM_getValue('word_translate'));
                return;
            }

            this.show();
            const sourceLang = $('#source-lang').val();
            const targetLang = $('#target-lang').val();
            const service = $('#translation-service').val();

            this.isTranslating = true;
            this.updateProgress(0);
            $('.progress-text').text('翻译中...');
            $('.progress-fill').addClass('loading');

            try {
                translationEngine.reset();
                
                // 显示加载动画
                $('.loading-spinner').show();
                
                const result = await translationEngine.translate(selectedText, {
                    sourceLang,
                    targetLang,
                    service
                });

                this.updateProgress(100);
                $('.progress-text').text('翻译完成');
                $('.progress-fill').removeClass('loading');
                
                // 隐藏加载动画
                $('.loading-spinner').hide();
                
                this.updateWordCount(selectedText.length, result.text.length);
                
                // 使用悬浮提示框显示翻译结果
                this.showTooltipTranslation(selectedText, result.text);
            } catch (error) {
                console.error('翻译失败:', error);
                this.updateProgress(0);
                $('.progress-text').text('翻译失败');
                $('.progress-fill').removeClass('loading');
                
                // 隐藏加载动画
                $('.loading-spinner').hide();
                
                GM_notification({
                    text: '翻译失败: ' + error.message,
                    title: 'AI Chat翻译助手',
                    timeout: 3000
                });
            } finally {
                this.isTranslating = false;
            }
        }

        showTranslationResult(originalText, translatedText) {
            $('.translate-result-overlay').remove();

            const resultHTML = `
                <div class="translate-result-overlay">
                    <div class="translate-result-content">
                        <div class="result-header">
                            <h3>翻译结果</h3>
                            <button class="result-close">×</button>
                        </div>
                        <div class="result-body">
                            <div class="text-section">
                                <h4>原文</h4>
                                <div class="text-content source-text">${this.escapeHtml(originalText)}</div>
                            </div>
                            <div class="text-section">
                                <h4>译文 <span class="loading-spinner" style="display:none;">🔄</span></h4>
                                <div class="text-content translated-content translation-text">${this.escapeHtml(translatedText)}</div>
                            </div>
                        </div>
                        <div class="result-footer">
                            <button class="result-btn result-btn-primary copy-result">复制译文</button>
                            <button class="result-btn result-btn-secondary close-result">关闭</button>
                        </div>
                    </div>
                </div>
            `;

            $('body').append(resultHTML);

            $('.result-close, .close-result, .translate-result-overlay').on('click', (e) => {
                if (e.target === e.currentTarget) {
                    $('.translate-result-overlay').remove();
                }
            });

            $('.copy-result').on('click', () => {
                GM_setClipboard(translatedText);
                GM_notification({
                    text: '译文已复制到剪贴板',
                    title: 'AI Chat翻译助手',
                    timeout: 2000
                });
            });
        }

        // 显示悬浮提示框翻译结果
        showTooltipTranslation(originalText, translatedText) {
            // 移除已存在的提示框
            $('.translation-tooltip').remove();
            
            // 获取选中文本的位置
            const selection = window.getSelection();
            if (selection.rangeCount === 0) return;
            
            const range = selection.getRangeAt(0);
            const rect = range.getBoundingClientRect();
            
            // 创建提示框
            const tooltipHTML = `
                <div class="translation-tooltip">
                    <div class="tooltip-header">翻译结果</div>
                    <div class="tooltip-content">${this.escapeHtml(translatedText)}</div>
                </div>
            `;
            
            $('body').append(tooltipHTML);
            
            // 定位提示框
            const tooltip = $('.translation-tooltip');
            const tooltipWidth = tooltip.outerWidth();
            const tooltipHeight = tooltip.outerHeight();
            
            // 计算提示框位置，优先显示在选中文本下方
            let left = rect.left + (rect.width / 2) - (tooltipWidth / 2);
            let top = rect.bottom + 10;
            
            // 确保提示框在视窗内
            const windowWidth = $(window).width();
            const windowHeight = $(window).height();
            
            if (left < 10) left = 10;
            if (left + tooltipWidth > windowWidth - 10) left = windowWidth - tooltipWidth - 10;
            
            if (top + tooltipHeight > windowHeight - 10) {
                // 如果下方空间不足，显示在上方
                top = rect.top - tooltipHeight - 10;
            }
            
            tooltip.css({
                left: left + 'px',
                top: top + 'px'
            });
            
            // 点击其他地方关闭提示框
            const closeTooltip = (e) => {
                if (!tooltip.is(e.target) && tooltip.has(e.target).length === 0) {
                    tooltip.remove();
                    $(document).off('click', closeTooltip);
                }
            };
            
            setTimeout(() => {
                $(document).on('click', closeTooltip);
            }, 100);
        }
        
        // 处理悬停翻译
        async handleHoverTranslate(element, text) {
            // 检查域名是否被屏蔽
            if (config.features.domainBlocked) {
                console.log('当前域名已被屏蔽，无法使用翻译功能');
                return;
            }
            
            // 检查悬浮翻译功能是否启用
            if (!config.features.hoverTranslate) {
                return;
            }
            
            // 移除已存在的提示框
            $('.translation-tooltip').remove();
            
            // 获取元素位置
            const rect = element[0].getBoundingClientRect();
            
            // 显示加载提示框
            const loadingTooltipHTML = `
                <div class="translation-tooltip">
                    <div class="tooltip-header">翻译中... <span class="tooltip-loading">🔄</span></div>
                    <div class="tooltip-content">${this.escapeHtml(text.substring(0, 100))}...</div>
                </div>
            `;
            
            $('body').append(loadingTooltipHTML);
            
            // 定位提示框
            const tooltip = $('.translation-tooltip');
            const tooltipWidth = tooltip.outerWidth();
            const tooltipHeight = tooltip.outerHeight();
            
            // 计算提示框位置，优先显示在元素下方
            let left = rect.left + (rect.width / 2) - (tooltipWidth / 2);
            let top = rect.bottom + 10;
            
            // 确保提示框在视窗内
            const windowWidth = $(window).width();
            const windowHeight = $(window).height();
            
            if (left < 10) left = 10;
            if (left + tooltipWidth > windowWidth - 10) left = windowWidth - tooltipWidth - 10;
            
            if (top + tooltipHeight > windowHeight - 10) {
                // 如果下方空间不足，显示在上方
                top = rect.top - tooltipHeight - 10;
            }
            
            tooltip.css({
                left: left + 'px',
                top: top + 'px'
            });
            
            try {
                const sourceLang = $('#source-lang').val();
                const targetLang = $('#target-lang').val();
                const service = $('#translation-service').val();
                
                // 优化：使用Promise.race实现超时控制，避免长时间等待
                const timeoutPromise = new Promise((_, reject) => 
                    setTimeout(() => reject(new Error('翻译超时')), 5000)
                );
                
                const result = await Promise.race([
                    translationEngine.translate(text, {
                        sourceLang,
                        targetLang,
                        service
                    }),
                    timeoutPromise
                ]);
                
                // 更新提示框内容
                tooltip.find('.tooltip-header').html('翻译结果');
                tooltip.find('.tooltip-content').html(this.escapeHtml(result.text));
                
                // 点击其他地方关闭提示框
                const closeTooltip = (e) => {
                    if (!tooltip.is(e.target) && tooltip.has(e.target).length === 0) {
                        tooltip.remove();
                        $(document).off('click', closeTooltip);
                    }
                };
                
                setTimeout(() => {
                    $(document).on('click', closeTooltip);
                }, 100);
            } catch (error) {
                console.error('悬停翻译失败:', error);
                tooltip.find('.tooltip-header').html('翻译失败');
                tooltip.find('.tooltip-content').html(error.message || '翻译失败，请重试');
            }
        }

        escapeHtml(text) {
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        }

        swapLanguages() {
            const source = $('#source-lang').val();
            const target = $('#target-lang').val();
            
            if (source !== 'auto') {
                $('#source-lang').val(target);
                $('#target-lang').val(source);
            }
        }

        updateProgress(progress) {
            this.progress = progress;
            $('.progress-fill').css('width', `${progress}%`);
        }

        updateWordCount(source, target) {
            this.wordCount = { source, target };
            $('.source-count').text(source);
            $('.target-count').text(target);
        }

        toggleMinimize() {
            this.isMinimized = !this.isMinimized;
            $('#translation-panel').toggleClass('minimized');
            $('.minimize-btn').text(this.isMinimized ? '+' : '−');
        }

        toggle() {
            this.isVisible = !this.isVisible;
            console.log('切换面板状态:', this.isVisible ? '显示' : '隐藏');
            console.log('面板元素状态:', $('#translation-panel').css('display'));
            if (this.isVisible) {
                this.show();
            } else {
                this.hide();
            }
        }

        show() {
            console.log('显示翻译面板');
            let panel = $('#translation-panel');
            
            // 如果面板不存在，尝试重新创建
            if (panel.length === 0) {
                console.warn('面板元素不存在，尝试重新创建');
                this.createPanel();
                panel = $('#translation-panel');
                
                // 重新绑定事件
                this.bindEvents();
                
                // 重新加载位置
                this.loadPosition();
                
                // 应用当前配置
                this.applyCurrentConfig();
            }
            
            if (panel.length > 0) {
                panel.fadeIn(300);
                this.isVisible = true;
                console.log('面板显示成功');
                
                // 确保面板在视口中可见
                this.ensurePanelVisible();
            } else {
                console.error('面板元素无法创建，无法显示');
                GM_notification({
                    text: '无法显示翻译面板，请刷新页面重试',
                    title: 'AI Chat翻译助手',
                    timeout: 3000
                });
            }
        }

        hide() {
            console.log('隐藏翻译面板');
            const panel = $('#translation-panel');
            if (panel.length > 0) {
                panel.fadeOut(300);
                this.isVisible = false;
                console.log('面板隐藏成功');
            } else {
                console.warn('面板元素不存在，可能已被移除');
                this.isVisible = false;
            }
        }

        // 全页翻译功能
        async handleFullPageTranslate() {
            // 检查域名是否被屏蔽
            if (config.features.domainBlocked) {
                console.log('当前域名已被屏蔽，无法使用翻译功能');
                return;
            }
            
            console.log('开始全页翻译');
            
            if (this.isTranslating) {
                GM_notification({
                    text: '正在翻译中，请稍后...',
                    title: 'AI Chat翻译助手',
                    timeout: 2000
                });
                return;
            }

            const targetLang = $('#target-lang').val();
            const service = $('#translation-service').val();

            this.isTranslating = true;
            this.isPaused = false;
            this.updateProgress(0);
            $('.progress-text').text('扫描页面中...');
            
            // 显示暂停按钮
            $('#pause-translate-btn').show();
            $('#resume-translate-btn').hide();

            try {
                // 创建全页翻译器实例
                if (!window.fullPageTranslator) {
                    window.fullPageTranslator = new FullPageTranslator();
                }

                // 开始翻译
                await window.fullPageTranslator.translate(targetLang, service, (progress) => {
                    // 检查是否已暂停
                    if (!this.isPaused) {
                        this.updateProgress(progress);
                        $('.progress-text').text(`翻译中... ${progress}%`);
                    }
                });

                this.updateProgress(100);
                $('.progress-text').text('翻译完成');
                
                // 隐藏暂停按钮
                $('#pause-translate-btn').hide();
                $('#resume-translate-btn').hide();

                GM_notification({
                    text: '全页翻译完成！',
                    title: 'AI Chat翻译助手',
                    timeout: 2000
                });
            } catch (error) {
                console.error('全页翻译失败:', error);
                this.updateProgress(0);
                $('.progress-text').text('翻译失败');
                
                // 隐藏暂停按钮
                $('#pause-translate-btn').hide();
                $('#resume-translate-btn').hide();

                GM_notification({
                    text: '全页翻译失败: ' + error.message,
                    title: 'AI Chat翻译助手',
                    timeout: 3000
                });
            } finally {
                this.isTranslating = false;
                setTimeout(() => {
                    if (!this.isTranslating) {
                        this.updateProgress(0);
                        $('.progress-text').text('准备就绪');
                    }
                }, 2000);
            }
        }

        // 还原原文功能
        handleRestoreOriginal() {
            // 检查域名是否被屏蔽
            if (config.features.domainBlocked) {
                console.log('当前域名已被屏蔽，无法使用翻译功能');
                return;
            }
            
            console.log('还原原文');
            
            if (this.isTranslating) {
                GM_notification({
                    text: '请等待翻译完成后再还原',
                    title: 'AI Chat翻译助手',
                    timeout: 2000
                });
                return;
            }

            if (window.fullPageTranslator) {
                window.fullPageTranslator.restore();
                GM_notification({
                    text: '已还原为原文',
                    title: 'AI Chat翻译助手',
                    timeout: 2000
                });
            } else {
                GM_notification({
                    text: '没有可还原的内容',
                    title: 'AI Chat翻译助手',
                    timeout: 2000
                });
            }
        }

        // 暂停翻译功能
        handlePauseTranslate() {
            if (this.isTranslating && translationEngine) {
                translationEngine.pause();
                this.isPaused = true;
                $('#pause-translate-btn').hide();
                $('#resume-translate-btn').show();
                $('.progress-text').text('翻译已暂停');
                GM_notification({
                    text: '翻译已暂停',
                    title: 'AI Chat翻译助手',
                    timeout: 2000
                });
            }
        }

        // 继续翻译功能
        handleResumeTranslate() {
            if (this.isPaused && translationEngine) {
                translationEngine.resume();
                this.isPaused = false;
                $('#resume-translate-btn').hide();
                $('#pause-translate-btn').show();
                $('.progress-text').text('继续翻译中...');
                GM_notification({
                    text: '翻译已继续',
                    title: 'AI Chat翻译助手',
                    timeout: 2000
                });
            }
        }

        // 保存面板设置功能
        handleSavePanelSettings() {
            // 保存语言和服务设置到全局配置
            const sourceLang = $('#source-lang').val();
            const targetLang = $('#target-lang').val();
            const service = $('#translation-service').val();
            
            // 更新全局配置
            config.translation.sourceLang = sourceLang;
            config.translation.targetLang = targetLang;
            config.translation.defaultService = service;
            
            // 保存到GM存储
            GM_setValue('default_source_lang', sourceLang);
            GM_setValue('default_target_lang', targetLang);
            GM_setValue('default_service', service);
            
            // 处理悬浮翻译和划词翻译的临时状态
            const wordTranslateBtn = $('#translate-btn');
            const hoverTranslateBtn = $('#hover-translate-btn');
            
            // 获取临时状态并应用到全局配置
            const wordTranslateTempState = wordTranslateBtn.attr('data-temp-state');
            const hoverTranslateTempState = hoverTranslateBtn.attr('data-temp-state');
            
            if (wordTranslateTempState) {
                const isEnabled = wordTranslateTempState === 'enabled';
                config.features.wordTranslate = isEnabled;
                GM_setValue('word_translate', isEnabled);
            }
            
            if (hoverTranslateTempState) {
                const isEnabled = hoverTranslateTempState === 'enabled';
                config.features.hoverTranslate = isEnabled;
                GM_setValue('hover_translate', isEnabled);
                
                // 同步更新设置页面的复选框
                if ($('#hover-translate').length > 0) {
                    $('#hover-translate').prop('checked', isEnabled);
                }
            }
            
            // 如果设置管理器存在，也更新设置页面的对应值
            if (settingsManager) {
                $('#default-source-lang').val(sourceLang);
                $('#default-target-lang').val(targetLang);
                $('#default-service').val(service);
            }
            
            GM_notification({
                text: '面板设置已保存',
                title: 'AI Chat翻译助手',
                timeout: 2000
            });
        }

        savePosition() {
            const panel = $('#translation-panel');
            const offset = panel.offset();
            this.position = {
                x: offset.left,
                y: offset.top
            };
            GM_setValue('panel_position', JSON.stringify(this.position));
        }

        loadPosition() {
            const savedPosition = GM_getValue('panel_position');
            if (savedPosition) {
                try {
                    const position = JSON.parse(savedPosition);
                    $('#translation-panel').css({
                        left: position.x + 'px',
                        top: position.y + 'px',
                        right: 'auto'
                    });
                } catch (error) {
                    console.error('加载面板位置失败:', error);
                }
            }
        }

        // 确保面板在视口内可见
        ensurePanelVisible() {
            const panel = $('#translation-panel');
            if (panel.length > 0) {
                const panelRect = panel[0].getBoundingClientRect();
                const windowWidth = $(window).width();
                const windowHeight = $(window).height();
                
                let newX = parseFloat(panel.css('left')) || 0;
                let newY = parseFloat(panel.css('top')) || 0;
                let changed = false;
                
                // 检查右边界
                if (panelRect.right > windowWidth) {
                    newX -= (panelRect.right - windowWidth + 20);
                    changed = true;
                }
                
                // 检查左边界
                if (panelRect.left < 0) {
                    newX += (-panelRect.left + 20);
                    changed = true;
                }
                
                // 检查下边界
                if (panelRect.bottom > windowHeight) {
                    newY -= (panelRect.bottom - windowHeight + 20);
                    changed = true;
                }
                
                // 检查上边界
                if (panelRect.top < 0) {
                    newY += (-panelRect.top + 20);
                    changed = true;
                }
                
                // 如果位置有变化，更新面板位置
                if (changed) {
                    panel.css({
                        left: Math.max(20, newX) + 'px',
                        top: Math.max(20, newY) + 'px',
                        right: 'auto'
                    });
                    
                    // 保存新位置
                    this.savePosition();
                }
            }
        }

        // 应用当前配置到重新创建的面板
        applyCurrentConfig() {
            // 应用语言设置
            $('#source-lang').val(config.translation.sourceLang || 'auto');
            $('#target-lang').val(config.translation.targetLang || 'zh-CN');
            
            // 应用服务设置
            $('#translation-service').val(config.translation.defaultService || 'google');
            
            // 应用功能开关状态
            if (config.features.wordTranslate) {
                $('#translate-btn').addClass('active').attr('data-temp-state', 'enabled');
            } else {
                $('#translate-btn').removeClass('active').attr('data-temp-state', 'disabled');
            }
            
            if (config.features.hoverTranslate) {
                $('#hover-translate-btn').addClass('active').attr('data-temp-state', 'enabled');
            } else {
                $('#hover-translate-btn').removeClass('active').attr('data-temp-state', 'disabled');
            }
        }
    }

    // 初始化应用
    function init() {
        console.log('AI Chat翻译助手开始初始化');

        // 等待jQuery加载
        if (typeof $ === 'undefined') {
            console.log('等待jQuery加载...');
            setTimeout(init, 100);
            return;
        }

        // 检查域名是否被屏蔽
        if (isDomainBlocked()) {
            console.log('当前域名已被屏蔽，禁用翻译功能');
            config.features.domainBlocked = true;
            return; // 直接返回，不初始化任何功能
        }



        // 初始化核心组件
        try {
            translationEngine = new TranslationEngine();
            languageDetector = new LanguageDetector();
            settingsManager = new SettingsManager();
            translationPanel = new TranslationPanel();

            // 加载保存的配置
            loadSavedConfig();

            // 检测语言并决定是否显示
            if (config.features.autoShowButton) {
                const shouldShow = languageDetector.shouldShowTranslateButton();
                console.log('是否需要显示翻译按钮:', shouldShow);
                if (shouldShow) {
                    $('#translate-float-button').show();
                } else {
                    $('#translate-float-button').hide();
                }
            }

            // 注册菜单命令
            GM_registerMenuCommand('⚙️ 打开设置', () => {
                if (settingsManager) {
                    settingsManager.open();
                } else {
                    console.error('设置管理器未初始化');
                }
            });

            GM_registerMenuCommand('🌐 打开翻译面板', () => {
                if (translationPanel) {
                    translationPanel.show();
                } else {
                    console.error('翻译面板未初始化');
                }
            });

            GM_registerMenuCommand('🗑️ 清除缓存', () => {
                if (confirm('确定要清除所有翻译缓存吗？')) {
                    if (translationEngine && translationEngine.cache) {
                        translationEngine.cache.clear();
                        GM_notification({
                            text: '缓存已清除',
                            title: 'AI Chat翻译助手',
                            timeout: 2000
                        });
                    }
                }
            });

            console.log('AI Chat翻译助手初始化完成');
            console.log('设置管理器:', settingsManager ? '已初始化' : '未初始化');
        } catch (error) {
            console.error('AI Chat翻译助手初始化失败:', error);
        }
    }

    // 加载保存的配置
    function loadSavedConfig() {
        config.translation.defaultService = GM_getValue('default_service', 'google');
        config.translation.sourceLang = GM_getValue('default_source_lang', 'auto');
        config.translation.targetLang = GM_getValue('default_target_lang', 'zh-CN');
        config.features.autoShowButton = GM_getValue('auto_show_button', true);
        config.features.cacheEnabled = GM_getValue('enable_cache', true);
        config.features.wordTranslate = GM_getValue('word_translate', false);  // 加载划词翻译设置
        config.features.hoverTranslate = GM_getValue('hover_translate', false);  // 加载悬浮翻译设置
        config.features.domainBlocked = isDomainBlocked();  // 检查域名是否被屏蔽
        config.shortcut.translate = GM_getValue('shortcut_translate', 'Ctrl+Shift+T');
        config.shortcut.togglePanel = GM_getValue('shortcut_toggle', 'Alt+T');
                
        // 应用到UI
        $('#translation-service').val(config.translation.defaultService);
        $('#source-lang').val(config.translation.sourceLang);
        $('#target-lang').val(config.translation.targetLang);
        
        // 设置划词翻译和悬浮翻译按钮状态及临时状态
        if (config.features.wordTranslate) {
            $('#translate-btn').addClass('active').attr('data-temp-state', 'enabled');
        } else {
            $('#translate-btn').removeClass('active').attr('data-temp-state', 'disabled');
        }
        if (config.features.hoverTranslate) {
            $('#hover-translate-btn').addClass('active').attr('data-temp-state', 'enabled');
        } else {
            $('#hover-translate-btn').removeClass('active').attr('data-temp-state', 'disabled');
        }
    }

    // 页面加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();

