// ==UserScript==
// @name        网站信息助手
// @namespace   https://viayoo.com/
// @version     1.3.0
// @license     MIT
// @description 显示网站标题、完整网址、主域名、安全协议和用户代理信息
// @author      DeepSeek
// @match       *://*/*
// @grant       GM_registerMenuCommand
// @run-at      document-idle
// @downloadURL https://update.greasyfork.org/scripts/556289/%E7%BD%91%E7%AB%99%E4%BF%A1%E6%81%AF%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/556289/%E7%BD%91%E7%AB%99%E4%BF%A1%E6%81%AF%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 精简版 Punycode toUnicode 功能（仅保留核心解码逻辑）
    const punycode = {
        toUnicode: function(input) {
            if (typeof input !== 'string') {
                return input;
            }
            
            return input.replace(/xn--([a-zA-Z0-9-]+)/gi, (match, encoded) => {
                try {
                    return this.decode(encoded);
                } catch (e) {
                    return match;
                }
            });
        },

        decode: function(input) {
            const base = 36;
            const tMin = 1;
            const tMax = 26;
            const initialBias = 72;
            const initialN = 0x80;
            const delimiter = '-';
            const regexNonASCII = /[^\0-\x7E]/;
            const regexPunycode = /^xn--/;

            let output = [];
            let inputLength = input.length;
            let i = 0;
            let n = initialN;
            let bias = initialBias;
            let basic = input.lastIndexOf(delimiter);
            
            if (basic < 0) {
                basic = 0;
            }

            for (let j = 0; j < basic; ++j) {
                if (input.charCodeAt(j) >= 0x80) {
                    return input;
                }
                output.push(input.charCodeAt(j));
            }

            for (let index = basic > 0 ? basic + 1 : 0; index < inputLength;) {
                let oldi = i;
                let w = 1;
                let k = base;

                for (; ; k += base) {
                    if (index >= inputLength) {
                        return input;
                    }

                    let digit = this._basicToDigit(input.charCodeAt(index++));
                    if (digit >= base || digit > Math.floor((2147483647 - i) / w)) {
                        return input;
                    }

                    i += digit * w;
                    let t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);

                    if (digit < t) {
                        break;
                    }

                    let baseMinusT = base - t;
                    if (w > Math.floor(2147483647 / baseMinusT)) {
                        return input;
                    }

                    w *= baseMinusT;
                }

                let out = output.length + 1;
                bias = this._adapt(i - oldi, out, oldi === 0);

                if (Math.floor(i / out) > 2147483647 - n) {
                    return input;
                }

                n += Math.floor(i / out);
                i %= out;

                output.splice(i++, 0, n);
            }

            return this._ucs2encode(output);
        },

        _basicToDigit: function(codePoint) {
            if (codePoint - 0x30 < 0x0A) {
                return codePoint - 0x16;
            }
            if (codePoint - 0x41 < 0x1A) {
                return codePoint - 0x41;
            }
            if (codePoint - 0x61 < 0x1A) {
                return codePoint - 0x61;
            }
            return 36;
        },

        _adapt: function(delta, numPoints, firstTime) {
            const base = 36;
            const tMin = 1;
            const tMax = 26;
            const skew = 38;
            const damp = firstTime ? 700 : 2;
            const baseMinusTMin = base - tMin;

            delta = Math.floor(firstTime ? delta / damp : delta / 2);
            delta += Math.floor(delta / numPoints);

            let k = 0;
            while (delta > Math.floor(baseMinusTMin * tMax / 2)) {
                delta = Math.floor(delta / baseMinusTMin);
                k += base;
            }

            return Math.floor(k + (baseMinusTMin + 1) * delta / (delta + skew));
        },

        _ucs2encode: function(array) {
            return array.map(codePoint => {
                let output = '';
                if (codePoint > 0xFFFF) {
                    codePoint -= 0x10000;
                    output += String.fromCharCode(codePoint >>> 10 & 0x3FF | 0xD800);
                    codePoint = 0xDC00 | codePoint & 0x3FF;
                }
                output += String.fromCharCode(codePoint);
                return output;
            }).join('');
        }
    };

    // 检测是否为IP地址
    function isIPAddress(hostname) {
        return /^(\d+\.){3}\d+$|^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/.test(hostname);
    }

    // 增强型域名解析器
    function parseDomainInfo() {
        const hostname = window.location.hostname;
        
        // 如果是IP地址，直接返回
        if (isIPAddress(hostname)) {
            return { 
                fullDomain: hostname,
                mainDomain: hostname,
                isIP: true
            };
        }
        
        let displayDomain = hostname;
        let mainDomain = hostname;

        // 处理国际化域名编码
        try {
            if (hostname.includes('xn--')) {
                displayDomain = punycode.toUnicode(hostname);
            }
        } catch(e) {
            console.warn('域名转换失败:', e.message);
        }

        // 清理端口和特殊符号
        const cleanHost = hostname.replace(/:\d+$/, '').replace(/[[\]]/g, '');
        const parts = cleanHost.split('.');

        // 扩展的特殊TLD列表
        const specialTLDs = ['com', 'net', 'org', 'gov', 'edu', 'co', 'ac', 'uk', 'jp', 'cn', 'de', 'fr', 'it', 'au', 'ca', 'br', 'in', 'ru', 'kr', 'tw', 'hk', 'mo', 'sg', 'my', 'id', 'th', 'vn', 'ph'];
        
        // 智能识别主域名
        if (parts.length === 1) {
            // 单节域名（如 localhost）
            mainDomain = cleanHost;
        } else if (parts.length > 2) {
            // 处理特殊顶级域名
            const secondLevel = parts[parts.length - 2];
            const topLevel = parts[parts.length - 1];
            
            const isSpecialTLD = specialTLDs.includes(secondLevel) && 
                                (topLevel.length === 2 || specialTLDs.includes(topLevel));
            
            if (isSpecialTLD && parts.length >= 3) {
                mainDomain = parts.slice(-3).join('.');
            } else {
                mainDomain = parts.slice(-2).join('.');
            }
            
            // 对主域名进行中文域名转换
            try {
                if (mainDomain.includes('xn--')) {
                    mainDomain = punycode.toUnicode(mainDomain);
                }
            } catch(e) {
                // 保持原样
            }
        }

        return { 
            fullDomain: displayDomain,
            mainDomain: mainDomain,
            isIP: false
        };
    }

    // 信息展示模块
    function showProfessionalInfo() {
        const { fullDomain, mainDomain, isIP } = parseDomainInfo();
        const securityInfo = window.location.protocol === 'https:' ? 'HTTPS' : 'HTTP';
        
        const infoData = {
            '页面标题': document.title || '(无标题)',
            '完整网址': window.location.href,
            '完整域名': fullDomain + (isIP ? ' (IP地址)' : ''),
            '主域名': isIP ? 'IP地址无主域名' : mainDomain,
            '安全协议': securityInfo,
            '用户代理': navigator.userAgent
        };

        const infoText = Object.entries(infoData)
            .map(([key, val]) => `${key}:\n${val}`)
            .join('\n\n');

        alert(`【网站核心信息】\n\n${infoText}`);
    }

    // 注册菜单命令
    GM_registerMenuCommand('网站核心分析', showProfessionalInfo);

    // 页面加载完成提示
    window.addEventListener('load', () => {
        console.debug('[网站分析器] 页面加载完成，域名解析器已就绪');
    });
})();