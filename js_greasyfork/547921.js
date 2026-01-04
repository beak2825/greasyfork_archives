// ==UserScript==
// @name         B站无痕免登录
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  在无痕模式中启用B站免登录功能
// @author       Li
// @match        *://*.bilibili.com/*
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/547921/B%E7%AB%99%E6%97%A0%E7%97%95%E5%85%8D%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/547921/B%E7%AB%99%E6%97%A0%E7%97%95%E5%85%8D%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==

/*
 * 本脚本修改自：
 * https://greasyfork.org/zh-CN/scripts/541726
 * https://greasyfork.org/zh-CN/scripts/533339
 *
 * 另外，本脚本使用了 detectIncognito v1.6.1：
 * https://github.com/Joe12387/detectIncognito
 * Copyright (c) 2021 - 2025 Joe Rutkowski <Joe@dreggle.com>
 * Licensed under the MIT License
 *
 * 本脚本包含自定义代码及上述引用与修改内容的整合。
 */


(function() {
    'use strict';

    // 检测无痕模式的函数
    const detectIncognito = function() {
        return new Promise(function(resolve, reject) {
            var browserName = "Unknown";
            var isPrivate = false;

            function done(private_browsing) {
                if (isPrivate === false) {
                    isPrivate = private_browsing;
                    resolve({isPrivate: private_browsing, browserName: browserName});
                }
            }

            function getErrorMessageLength() {
                var errorMessage = 0;
                var e = parseInt("-1");
                try {
                    e.toFixed(e);
                } catch(er) {
                    errorMessage = er.message.length;
                }
                return errorMessage;
            }

            // Safari
            if (getErrorMessageLength() === 44 || getErrorMessageLength() === 43) {
                browserName = "Safari";

                // Safari 检测逻辑
                (function() {
                    const randID = String(Math.random());
                    try {
                        const openDB = indexedDB.open(randID, 1);
                        openDB.onupgradeneeded = function(e) {
                            const db = e.target.result;
                            const detectPrivate = function(isPrivate) {
                                done(isPrivate);
                            };

                            try {
                                db.createObjectStore("test", { autoIncrement: true }).put(new Blob());
                                detectPrivate(false);
                            } catch (e) {
                                const message = e instanceof Error && typeof e.message === "string" ? e.message : String(e);
                                detectPrivate(message.includes("are not yet supported"));
                            } finally {
                                db.close();
                                indexedDB.deleteDatabase(randID);
                            }
                        };

                        openDB.onerror = function() {
                            return done(false);
                        };
                    } catch (e) {
                        done(false);
                    }
                })();
            }
            // Chrome/Chromium
            else if (getErrorMessageLength() === 51) {
                const ua = navigator.userAgent;

                if (ua.match(/Chrome/)) {
                    if (navigator.brave !== undefined) {
                        browserName = "Brave";
                    } else if (ua.match(/Edg/)) {
                        browserName = "Edge";
                    } else if (ua.match(/OPR/)) {
                        browserName = "Opera";
                    } else {
                        browserName = "Chrome";
                    }
                } else {
                    browserName = "Chromium";
                }

                // Chrome 检测逻辑
                if (navigator.webkitTemporaryStorage !== undefined) {
                    navigator.webkitTemporaryStorage.queryUsageAndQuota(
                        function(usage, quota) {
                            const quotaMB = Math.round(quota / 1048576);
                            const expectedQuotaMB = 2 * Math.round(
                                (window.performance?.memory?.jsHeapSizeLimit || 1073741824) / 1048576
                            );
                            done(quotaMB < expectedQuotaMB);
                        },
                        function(e) {
                            reject(new Error("检测无痕模式失败: " + e.message));
                        }
                    );
                } else {
                    window.webkitRequestFileSystem(
                        0,
                        1,
                        function() { done(false); },
                        function() { done(true); }
                    );
                }
            }
            // Firefox
            else if (getErrorMessageLength() === 25) {
                browserName = "Firefox";

                // Firefox 检测逻辑
                if (typeof navigator.storage?.getDirectory === "function") {
                    navigator.storage.getDirectory().then(
                        function() {
                            done(false);
                        },
                        function(e) {
                            const message = e instanceof Error && typeof e.message === "string" ? e.message : String(e);
                            done(message.includes("Security error"));
                        }
                    );
                } else {
                    done(navigator.serviceWorker === undefined);
                }
            }
            // IE
            else if (navigator.msSaveBlob !== undefined) {
                browserName = "Internet Explorer";
                done(window.indexedDB === undefined);
            }
            // 未知浏览器
            else {
                reject(new Error("无法确定当前浏览器类型"));
            }
        });
    };

    // 记录日志的函数
    function log(message) {
        console.log(`%c[B站无痕检测] %c${message}`, 'color: #00a1d6; font-weight: bold;', 'color: #eee; font-weight: bold;');
    }

    // 检测无痕模式并根据结果决定是否启用免登录功能
    detectIncognito().then(function(result) {
        if (result.isPrivate) {
            log(`检测到${result.browserName}浏览器处于无痕模式，正在启用免登录功能...`);
            enableNoLoginFeature();
        } else {
            log(`检测到${result.browserName}浏览器处于正常模式，不启用免登录功能`);
        }
    }).catch(function(error) {
        log(`检测浏览器模式时出错: ${error.message}`);
    });

    // 启用免登录功能的函数
    function enableNoLoginFeature() {
        // WbiSign 类实现
        class WbiSign {
            constructor() {
                this.mixinKeyEncTab = [
                    46, 47, 18, 2, 53, 8, 23, 32, 15, 50, 10, 31, 58, 3, 45, 35, 27, 43, 5,
                    49, 33, 9, 42, 19, 29, 28, 14, 39, 12, 38, 41, 13, 37, 48, 7, 16, 24, 55,
                    40, 61, 26, 17, 0, 1, 60, 51, 30, 4, 22, 25, 54, 21, 56, 59, 6, 63, 57,
                    62, 11, 36, 20, 34, 44, 52,
                ];
            }

            getMixinKey = (orig) =>
                this.mixinKeyEncTab
                    .map((n) => orig[n])
                    .join("")
                    .slice(0, 32);

            encWbi(params, img_key, sub_key) {
                const mixin_key = this.getMixinKey(img_key + sub_key),
                    curr_time = Math.round(Date.now() / 1000),
                    chr_filter = /[!'()*]/g;

                Object.assign(params, { wts: curr_time });
                const query = Object.keys(params)
                    .sort()
                    .map((key) => {
                        const value = params[key].toString().replace(chr_filter, "");
                        return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
                    })
                    .join("&");

                const wbi_sign = SparkMD5.hash(query + mixin_key);

                return query + "&w_rid=" + wbi_sign;
            }
        }

        // SparkMD5 实现
        const SparkMD5 = (function (undefined) {
            "use strict";
            var add32 = function (a, b) {
                return (a + b) & 0xffffffff;
            },
            hex_chr = [
                "0", "1", "2", "3", "4", "5", "6", "7", "8", "9",
                "a", "b", "c", "d", "e", "f",
            ];

            function cmn(q, a, b, x, s, t) {
                a = add32(add32(a, q), add32(x, t));
                return add32((a << s) | (a >>> (32 - s)), b);
            }

            function md5cycle(x, k) {
                var a = x[0], b = x[1], c = x[2], d = x[3];

                a += (((b & c) | (~b & d)) + k[0] - 680876936) | 0;
                a = (((a << 7) | (a >>> 25)) + b) | 0;
                d += (((a & b) | (~a & c)) + k[1] - 389564586) | 0;
                d = (((d << 12) | (d >>> 20)) + a) | 0;
                c += (((d & a) | (~d & b)) + k[2] + 606105819) | 0;
                c = (((c << 17) | (c >>> 15)) + d) | 0;
                b += (((c & d) | (~c & a)) + k[3] - 1044525330) | 0;
                b = (((b << 22) | (b >>> 10)) + c) | 0;
                a += (((b & c) | (~b & d)) + k[4] - 176418897) | 0;
                a = (((a << 7) | (a >>> 25)) + b) | 0;
                d += (((a & b) | (~a & c)) + k[5] + 1200080426) | 0;
                d = (((d << 12) | (d >>> 20)) + a) | 0;
                c += (((d & a) | (~d & b)) + k[6] - 1473231341) | 0;
                c = (((c << 17) | (c >>> 15)) + d) | 0;
                b += (((c & d) | (~c & a)) + k[7] - 45705983) | 0;
                b = (((b << 22) | (b >>> 10)) + c) | 0;
                a += (((b & c) | (~b & d)) + k[8] + 1770035416) | 0;
                a = (((a << 7) | (a >>> 25)) + b) | 0;
                d += (((a & b) | (~a & c)) + k[9] - 1958414417) | 0;
                d = (((d << 12) | (d >>> 20)) + a) | 0;
                c += (((d & a) | (~d & b)) + k[10] - 42063) | 0;
                c = (((c << 17) | (c >>> 15)) + d) | 0;
                b += (((c & d) | (~c & a)) + k[11] - 1990404162) | 0;
                b = (((b << 22) | (b >>> 10)) + c) | 0;
                a += (((b & c) | (~b & d)) + k[12] + 1804603682) | 0;
                a = (((a << 7) | (a >>> 25)) + b) | 0;
                d += (((a & b) | (~a & c)) + k[13] - 40341101) | 0;
                d = (((d << 12) | (d >>> 20)) + a) | 0;
                c += (((d & a) | (~d & b)) + k[14] - 1502002290) | 0;
                c = (((c << 17) | (c >>> 15)) + d) | 0;
                b += (((c & d) | (~c & a)) + k[15] + 1236535329) | 0;
                b = (((b << 22) | (b >>> 10)) + c) | 0;

                a += (((b & d) | (c & ~d)) + k[1] - 165796510) | 0;
                a = (((a << 5) | (a >>> 27)) + b) | 0;
                d += (((a & c) | (b & ~c)) + k[6] - 1069501632) | 0;
                d = (((d << 9) | (d >>> 23)) + a) | 0;
                c += (((d & b) | (a & ~b)) + k[11] + 643717713) | 0;
                c = (((c << 14) | (c >>> 18)) + d) | 0;
                b += (((c & a) | (d & ~a)) + k[0] - 373897302) | 0;
                b = (((b << 20) | (b >>> 12)) + c) | 0;
                a += (((b & d) | (c & ~d)) + k[5] - 701558691) | 0;
                a = (((a << 5) | (a >>> 27)) + b) | 0;
                d += (((a & c) | (b & ~c)) + k[10] + 38016083) | 0;
                d = (((d << 9) | (d >>> 23)) + a) | 0;
                c += (((d & b) | (a & ~b)) + k[15] - 660478335) | 0;
                c = (((c << 14) | (c >>> 18)) + d) | 0;
                b += (((c & a) | (d & ~a)) + k[4] - 405537848) | 0;
                b = (((b << 20) | (b >>> 12)) + c) | 0;
                a += (((b & d) | (c & ~d)) + k[9] + 568446438) | 0;
                a = (((a << 5) | (a >>> 27)) + b) | 0;
                d += (((a & c) | (b & ~c)) + k[14] - 1019803690) | 0;
                d = (((d << 9) | (d >>> 23)) + a) | 0;
                c += (((d & b) | (a & ~b)) + k[3] - 187363961) | 0;
                c = (((c << 14) | (c >>> 18)) + d) | 0;
                b += (((c & a) | (d & ~a)) + k[8] + 1163531501) | 0;
                b = (((b << 20) | (b >>> 12)) + c) | 0;
                a += (((b & d) | (c & ~d)) + k[13] - 1444681467) | 0;
                a = (((a << 5) | (a >>> 27)) + b) | 0;
                d += (((a & c) | (b & ~c)) + k[2] - 51403784) | 0;
                d = (((d << 9) | (d >>> 23)) + a) | 0;
                c += (((d & b) | (a & ~b)) + k[7] + 1735328473) | 0;
                c = (((c << 14) | (c >>> 18)) + d) | 0;
                b += (((c & a) | (d & ~a)) + k[12] - 1926607734) | 0;
                b = (((b << 20) | (b >>> 12)) + c) | 0;

                a += ((b ^ c ^ d) + k[5] - 378558) | 0;
                a = (((a << 4) | (a >>> 28)) + b) | 0;
                d += ((a ^ b ^ c) + k[8] - 2022574463) | 0;
                d = (((d << 11) | (d >>> 21)) + a) | 0;
                c += ((d ^ a ^ b) + k[11] + 1839030562) | 0;
                c = (((c << 16) | (c >>> 16)) + d) | 0;
                b += ((c ^ d ^ a) + k[14] - 35309556) | 0;
                b = (((b << 23) | (b >>> 9)) + c) | 0;
                a += ((b ^ c ^ d) + k[1] - 1530992060) | 0;
                a = (((a << 4) | (a >>> 28)) + b) | 0;
                d += ((a ^ b ^ c) + k[4] + 1272893353) | 0;
                d = (((d << 11) | (d >>> 21)) + a) | 0;
                c += ((d ^ a ^ b) + k[7] - 155497632) | 0;
                c = (((c << 16) | (c >>> 16)) + d) | 0;
                b += ((c ^ d ^ a) + k[10] - 1094730640) | 0;
                b = (((b << 23) | (b >>> 9)) + c) | 0;
                a += ((b ^ c ^ d) + k[13] + 681279174) | 0;
                a = (((a << 4) | (a >>> 28)) + b) | 0;
                d += ((a ^ b ^ c) + k[0] - 358537222) | 0;
                d = (((d << 11) | (d >>> 21)) + a) | 0;
                c += ((d ^ a ^ b) + k[3] - 722521979) | 0;
                c = (((c << 16) | (c >>> 16)) + d) | 0;
                b += ((c ^ d ^ a) + k[6] + 76029189) | 0;
                b = (((b << 23) | (b >>> 9)) + c) | 0;
                a += ((b ^ c ^ d) + k[9] - 640364487) | 0;
                a = (((a << 4) | (a >>> 28)) + b) | 0;
                d += ((a ^ b ^ c) + k[12] - 421815835) | 0;
                d = (((d << 11) | (d >>> 21)) + a) | 0;
                c += ((d ^ a ^ b) + k[15] + 530742520) | 0;
                c = (((c << 16) | (c >>> 16)) + d) | 0;
                b += ((c ^ d ^ a) + k[2] - 995338651) | 0;
                b = (((b << 23) | (b >>> 9)) + c) | 0;

                a += ((c ^ (b | ~d)) + k[0] - 198630844) | 0;
                a = (((a << 6) | (a >>> 26)) + b) | 0;
                d += ((b ^ (a | ~c)) + k[7] + 1126891415) | 0;
                d = (((d << 10) | (d >>> 22)) + a) | 0;
                c += ((a ^ (d | ~b)) + k[14] - 1416354905) | 0;
                c = (((c << 15) | (c >>> 17)) + d) | 0;
                b += ((d ^ (c | ~a)) + k[5] - 57434055) | 0;
                b = (((b << 21) | (b >>> 11)) + c) | 0;
                a += ((c ^ (b | ~d)) + k[12] + 1700485571) | 0;
                a = (((a << 6) | (a >>> 26)) + b) | 0;
                d += ((b ^ (a | ~c)) + k[3] - 1894986606) | 0;
                d = (((d << 10) | (d >>> 22)) + a) | 0;
                c += ((a ^ (d | ~b)) + k[10] - 1051523) | 0;
                c = (((c << 15) | (c >>> 17)) + d) | 0;
                b += ((d ^ (c | ~a)) + k[1] - 2054922799) | 0;
                b = (((b << 21) | (b >>> 11)) + c) | 0;
                a += ((c ^ (b | ~d)) + k[8] + 1873313359) | 0;
                a = (((a << 6) | (a >>> 26)) + b) | 0;
                d += ((b ^ (a | ~c)) + k[15] - 30611744) | 0;
                d = (((d << 10) | (d >>> 22)) + a) | 0;
                c += ((a ^ (d | ~b)) + k[6] - 1560198380) | 0;
                c = (((c << 15) | (c >>> 17)) + d) | 0;
                b += ((d ^ (c | ~a)) + k[13] + 1309151649) | 0;
                b = (((b << 21) | (b >>> 11)) + c) | 0;
                a += ((c ^ (b | ~d)) + k[4] - 145523070) | 0;
                a = (((a << 6) | (a >>> 26)) + b) | 0;
                d += ((b ^ (a | ~c)) + k[11] - 1120210379) | 0;
                d = (((d << 10) | (d >>> 22)) + a) | 0;
                c += ((a ^ (d | ~b)) + k[2] + 718787259) | 0;
                c = (((c << 15) | (c >>> 17)) + d) | 0;
                b += ((d ^ (c | ~a)) + k[9] - 343485551) | 0;
                b = (((b << 21) | (b >>> 11)) + c) | 0;

                x[0] = (a + x[0]) | 0;
                x[1] = (b + x[1]) | 0;
                x[2] = (c + x[2]) | 0;
                x[3] = (d + x[3]) | 0;
            }

            function md5blk(s) {
                var md5blks = [], i;
                for (i = 0; i < 64; i += 4) {
                    md5blks[i >> 2] = s.charCodeAt(i) + (s.charCodeAt(i + 1) << 8) + (s.charCodeAt(i + 2) << 16) + (s.charCodeAt(i + 3) << 24);
                }
                return md5blks;
            }

            function md5blk_array(a) {
                var md5blks = [], i;
                for (i = 0; i < 64; i += 4) {
                    md5blks[i >> 2] = a[i] + (a[i + 1] << 8) + (a[i + 2] << 16) + (a[i + 3] << 24);
                }
                return md5blks;
            }

            function md51(s) {
                var n = s.length,
                    state = [1732584193, -271733879, -1732584194, 271733878],
                    i, length, tail, tmp, lo, hi;
                for (i = 64; i <= n; i += 64) {
                    md5cycle(state, md5blk(s.substring(i - 64, i)));
                }
                s = s.substring(i - 64);
                length = s.length;
                tail = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                for (i = 0; i < length; i += 1) {
                    tail[i >> 2] |= s.charCodeAt(i) << ((i % 4) << 3);
                }
                tail[i >> 2] |= 0x80 << ((i % 4) << 3);
                if (i > 55) {
                    md5cycle(state, tail);
                    for (i = 0; i < 16; i += 1) {
                        tail[i] = 0;
                    }
                }
                tmp = n * 8;
                tmp = tmp.toString(16).match(/(.*?)(.{0,8})$/);
                lo = parseInt(tmp[2], 16);
                hi = parseInt(tmp[1], 16) || 0;
                tail[14] = lo;
                tail[15] = hi;
                md5cycle(state, tail);
                return state;
            }

            function md51_array(a) {
                var n = a.length,
                    state = [1732584193, -271733879, -1732584194, 271733878],
                    i, length, tail, tmp, lo, hi;
                for (i = 64; i <= n; i += 64) {
                    md5cycle(state, md5blk_array(a.subarray(i - 64, i)));
                }
                a = i - 64 < n ? a.subarray(i - 64) : new Uint8Array(0);
                length = a.length;
                tail = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                for (i = 0; i < length; i += 1) {
                    tail[i >> 2] |= a[i] << ((i % 4) << 3);
                }
                tail[i >> 2] |= 0x80 << ((i % 4) << 3);
                if (i > 55) {
                    md5cycle(state, tail);
                    for (i = 0; i < 16; i += 1) {
                        tail[i] = 0;
                    }
                }
                tmp = n * 8;
                tmp = tmp.toString(16).match(/(.*?)(.{0,8})$/);
                lo = parseInt(tmp[2], 16);
                hi = parseInt(tmp[1], 16) || 0;
                tail[14] = lo;
                tail[15] = hi;
                md5cycle(state, tail);
                return state;
            }

            function rhex(n) {
                var s = "", j;
                for (j = 0; j < 4; j += 1) {
                    s += hex_chr[(n >> (j * 8 + 4)) & 0x0f] + hex_chr[(n >> (j * 8)) & 0x0f];
                }
                return s;
            }

            function hex(x) {
                var i;
                for (i = 0; i < x.length; i += 1) {
                    x[i] = rhex(x[i]);
                }
                return x.join("");
            }

            if (hex(md51("hello")) !== "5d41402abc4b2a76b9719d911017c592") {
                add32 = function (x, y) {
                    var lsw = (x & 0xffff) + (y & 0xffff),
                        msw = (x >> 16) + (y >> 16) + (lsw >> 16);
                    return (msw << 16) | (lsw & 0xffff);
                };
            }

            function toUtf8(str) {
                if (/[\u0080-\uFFFF]/.test(str)) {
                    str = unescape(encodeURIComponent(str));
                }
                return str;
            }

            function hexToBinaryString(hex) {
                var bytes = [], length = hex.length, x;
                for (x = 0; x < length - 1; x += 2) {
                    bytes.push(parseInt(hex.substr(x, 2), 16));
                }
                return String.fromCharCode.apply(String, bytes);
            }

            function SparkMD5() {
                this.reset();
            }

            SparkMD5.prototype.append = function (str) {
                this.appendBinary(toUtf8(str));
                return this;
            };

            SparkMD5.prototype.appendBinary = function (contents) {
                this._buff += contents;
                this._length += contents.length;
                var length = this._buff.length, i;
                for (i = 64; i <= length; i += 64) {
                    md5cycle(this._hash, md5blk(this._buff.substring(i - 64, i)));
                }
                this._buff = this._buff.substring(i - 64);
                return this;
            };

            SparkMD5.prototype.end = function (raw) {
                var buff = this._buff,
                    length = buff.length,
                    i,
                    tail = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    ret;
                for (i = 0; i < length; i += 1) {
                    tail[i >> 2] |= buff.charCodeAt(i) << ((i % 4) << 3);
                }
                this._finish(tail, length);
                ret = hex(this._hash);
                if (raw) {
                    ret = hexToBinaryString(ret);
                }
                this.reset();
                return ret;
            };

            SparkMD5.prototype.reset = function () {
                this._buff = "";
                this._length = 0;
                this._hash = [1732584193, -271733879, -1732584194, 271733878];
                return this;
            };

            SparkMD5.prototype.destroy = function () {
                delete this._hash;
                delete this._buff;
                delete this._length;
            };

            SparkMD5.prototype._finish = function (tail, length) {
                var i = length, tmp, lo, hi;
                tail[i >> 2] |= 0x80 << ((i % 4) << 3);
                if (i > 55) {
                    md5cycle(this._hash, tail);
                    for (i = 0; i < 16; i += 1) {
                        tail[i] = 0;
                    }
                }
                tmp = this._length * 8;
                tmp = tmp.toString(16).match(/(.*?)(.{0,8})$/);
                lo = parseInt(tmp[2], 16);
                hi = parseInt(tmp[1], 16) || 0;
                tail[14] = lo;
                tail[15] = hi;
                md5cycle(this._hash, tail);
            };

            SparkMD5.hash = function (str, raw) {
                return SparkMD5.hashBinary(toUtf8(str), raw);
            };

            SparkMD5.hashBinary = function (content, raw) {
                var hash = md51(content), ret = hex(hash);
                return raw ? hexToBinaryString(ret) : ret;
            };

            SparkMD5.ArrayBuffer = function () {
                this.reset();
            };

            SparkMD5.ArrayBuffer.prototype.append = function (arr) {
                // 简化版实现
                var buff = this._buff, length = buff.length, i;
                this._length += arr.byteLength;
                for (i = 0; i < arr.byteLength; i += 1) {
                    buff.push(arr[i]);
                }
                return this;
            };

            SparkMD5.ArrayBuffer.prototype.end = function (raw) {
                var buff = this._buff,
                    length = buff.length,
                    i,
                    tail = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    ret;
                for (i = 0; i < length; i += 1) {
                    tail[i >> 2] |= buff[i] << ((i % 4) << 3);
                }
                this._finish(tail, length);
                ret = hex(this._hash);
                if (raw) {
                    ret = hexToBinaryString(ret);
                }
                this.reset();
                return ret;
            };

            SparkMD5.ArrayBuffer.prototype.reset = function () {
                this._buff = [];
                this._length = 0;
                this._hash = [1732584193, -271733879, -1732584194, 271733878];
                return this;
            };

            SparkMD5.ArrayBuffer.hash = function (arr, raw) {
                var hash = md51_array(new Uint8Array(arr)), ret = hex(hash);
                return raw ? hexToBinaryString(ret) : ret;
            };

            return SparkMD5;
        })();

        log('免登录功能基础组件已加载');

        // 模拟用户信息
        const mockUserInfo = {
            code: 0,
            message: "0",
            ttl: 1,
            data: {
                isLogin: true,
                email_verified: 1,
                face: "",
                face_nft: 0,
                face_nft_type: 0,
                level_info: {
                    current_level: 6,
                    current_min: 28800,
                    current_exp: 29050,
                    next_exp: "--",
                },
                mid: 0,
                mobile_verified: 1,
                money: 10000000000000,
                moral: 70,
                official: { role: 0, title: "", desc: "", type: -1 },
                officialVerify: { type: -1, desc: "" },
                pendant: {
                    pid: 0,
                    name: "",
                    image: "",
                    expire: 0,
                    image_enhance: "",
                    image_enhance_frame: "",
                    n_pid: 0,
                },
                scores: 0,
                uname: "bilibili",
                vipDueDate: 1674748800000,
                vipStatus: 0,
                vipType: 1,
                vip_pay_type: 0,
                vip_theme_type: 0,
                vip_label: {
                    path: "",
                    text: "",
                    label_theme: "",
                    text_color: "",
                    bg_style: 0,
                    bg_color: "",
                    border_color: "",
                    use_img_label: true,
                    img_label_uri_hans: "",
                    img_label_uri_hant: "",
                    img_label_uri_hans_static: "",
                    img_label_uri_hant_static: "",
                },
                vip_avatar_subscript: 0,
                vip_nickname_color: "",
                vip: {
                    type: 1,
                    status: 0,
                    due_date: 1674748800000,
                    vip_pay_type: 0,
                    theme_type: 0,
                    label: {
                        path: "",
                        text: "",
                        label_theme: "",
                        text_color: "",
                        bg_style: 0,
                        bg_color: "",
                        border_color: "",
                        use_img_label: true,
                        img_label_uri_hans: "",
                        img_label_uri_hant: "",
                        img_label_uri_hans_static: "",
                        img_label_uri_hant_static: "",
                    },
                    avatar_subscript: 0,
                    nickname_color: "",
                    role: 0,
                    avatar_subscript_url: "",
                    tv_vip_status: 0,
                    tv_vip_pay_type: 0,
                    tv_due_date: 0,
                    avatar_icon: { icon_resource: {} },
                },
                wallet: {
                    mid: 700756870,
                    bcoin_balance: 0,
                    coupon_balance: 0,
                    coupon_due_time: 0,
                },
                has_shop: false,
                shop_url: "",
                answer_status: 0,
                is_senior_member: 1,
                wbi_img: {
                    img_url: "",
                    sub_url: "",
                },
                is_jury: false,
                name_render: null,
            },
        };

        // Web key URLs
        const web_key_urls = {
            img_key_url: localStorage.getItem("wbi_img_url") || "",
            sub_key_url: localStorage.getItem("wbi_sub_url") || "",
        };

        // 从URL中提取key
        const getWebKey = function (str) {
            return str.slice(str.lastIndexOf("/") + 1, str.lastIndexOf("."));
        };

        const img_key = getWebKey(web_key_urls.img_key_url);
        const sub_key = getWebKey(web_key_urls.sub_key_url);

        // 拦截并修改XMLHttpRequest
        (function () {
            "use strict";
            const originalOpen = XMLHttpRequest.prototype.open;
            const originalSend = XMLHttpRequest.prototype.send;

            XMLHttpRequest.prototype.open = function (...args) {
                this._interceptUrl = args[1];
                if (this._interceptUrl.includes("api.bilibili.com/x/player/wbi/playurl")) {
                    const qsParams = Object.fromEntries(
                        new URLSearchParams(args[1].split(/\?|&w_rid/)[1]).entries()
                    );
                    Reflect.set(qsParams, "qn", 80);
                    Reflect.set(qsParams, "try_look", 1);
                    const query = new WbiSign().encWbi(qsParams, img_key, sub_key);
                    args[1] = "//api.bilibili.com/x/player/wbi/playurl?" + query;
                }
                return originalOpen.apply(this, args);
            };

            XMLHttpRequest.prototype.send = function (body) {
                const xhr = this;

                const customOnReadyStateChange = function () {
                    if (xhr.readyState === 4) {
                        if (
                            xhr._interceptUrl.includes("api.bilibili.com/x/web-interface/nav")
                        ) {
                            const resJson = JSON.parse(xhr.responseText);
                            const wbi_img = resJson.data.wbi_img;
                            Object.defineProperty(xhr, "responseText", {
                                get: function () {
                                    if (resJson?.data?.isLogin === false) {
                                        mockUserInfo.data.wbi_img = wbi_img;
                                        return JSON.stringify(mockUserInfo);
                                    }
                                    return JSON.stringify(resJson);
                                },
                            });
                        } else if (
                            xhr._interceptUrl.includes("api.bilibili.com/x/player/wbi/v2")
                        ) {
                            const resJson = JSON.parse(xhr.responseText);
                            resJson.data.login_mid = Math.floor(Math.random() * 100000);
                            Object.defineProperty(xhr, "responseText", {
                                get: function () {
                                    return JSON.stringify(resJson);
                                },
                            });
                        } else if (
                            xhr._interceptUrl.includes("api.bilibili.com/x/player/wbi/playurl")
                        ) {
                            setTimeout(() => {
                                const defaultQuality =
                                    JSON.parse(localStorage.bpx_player_profile).media.quality || 80;
                                window.player && window.player.requestQuality(defaultQuality, null);
                            }, 1000);
                        }
                    }

                    if (xhr._originalOnReadyStateChange) {
                        xhr._originalOnReadyStateChange.apply(this, arguments);
                    }
                };

                if (!xhr._isHooked) {
                    xhr._originalOnReadyStateChange = xhr.onreadystatechange;
                    xhr.onreadystatechange = customOnReadyStateChange;
                    xhr._isHooked = true;
                }

                return originalSend.apply(this, arguments);
            };
        })();

        // 拦截并修改fetch
        (function () {
            "use strict";
            const originalFetch = window.fetch;

            window.fetch = function (input, init = {}) {
                let url = "";

                if (typeof input === "string") {
                    url = input;
                } else if (input instanceof Request) {
                    url = input.url;
                }

                if (
                    url.includes("x/v2/reply/wbi/main") ||
                    url.includes("x/v2/reply/reply")
                ) {
                    init = Object.assign({}, init, { credentials: "omit" });
                }

                return originalFetch.call(this, input, init);
            };
        })();

        // 阻止播放器信息获取
        Object.defineProperty(window, "__playinfo__", {
            get: function () {
                return null;
            },
        });

        log('B站免登录已启用');
    }
})();
