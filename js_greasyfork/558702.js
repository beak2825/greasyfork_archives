// ==UserScript==
// @name         Pixiv 强制原图 - 网络层代理版 (最终极方案)
// @namespace    http://tampermonkey.net/
// @version      5.1
// @description  当普通替换失效时使用。利用GM_api拦截网络请求，强制代理原图。
// @author       您的名字或昵称 (例如: Qwen)
// @match        *://www.pixiv.net/*
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @connect      i.pximg.jp
// @connect      i.pixiv.re
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/558702/Pixiv%20%E5%BC%BA%E5%88%B6%E5%8E%9F%E5%9B%BE%20-%20%E7%BD%91%E7%BB%9C%E5%B1%82%E4%BB%A3%E7%90%86%E7%89%88%20%28%E6%9C%80%E7%BB%88%E6%9E%81%E6%96%B9%E6%A1%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/558702/Pixiv%20%E5%BC%BA%E5%88%B6%E5%8E%9F%E5%9B%BE%20-%20%E7%BD%91%E7%BB%9C%E5%B1%82%E4%BB%A3%E7%90%86%E7%89%88%20%28%E6%9C%80%E7%BB%88%E6%9E%81%E6%96%B9%E6%A1%88%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // --- 辅助函数：URL 转换逻辑 ---
    function toOriginalUrl(url) {
        // 1. 移除尺寸后缀
        url = url
            .replace(/_square1200/g, '')
            .replace(/_master1200/g, '')
            .replace(/_big/g, '')
            .replace(/\/c\/\d+x\d+\/?/g, '/'); // 移除 /c/250x250/ 这类路径

        // 2. 核心替换：将 img-master 替换为 img-original
        url = url.replace(/\/img-master\//g, '/img-original/');

        // 3. 确保是原图域名
        if (url.includes('/img-original/')) {
            if (url.includes('pixiv.net')) {
                const pathMatch = url.match(/\/img-original\/(.+?)\.(jpg|png|gif)/i);
                if (pathMatch) {
                    url = `https://i.pximg.jp/img-original/${pathMatch}.jpg`;
                }
            } else if (!url.startsWith('http')) {
                url = 'https://i.pximg.jp' + url;
            }
        }
        return url;
    }

    // --- 核心：利用 GM_xmlhttpRequest 代理图片 ---
    function proxyImage(src) {
        return new Promise((resolve, reject) => {
            const originalUrl = src;
            const targetUrl = toOriginalUrl(src);

            console.log(`🌐 [代理请求] 原始: ${originalUrl}`);
            console.log(`🚀 [代理请求] 目标: ${targetUrl}`);

            GM_xmlhttpRequest({
                method: 'GET',
                url: targetUrl,
                responseType: 'blob',
                headers: {
                    'Referer': 'https://www.pixiv.net/',
                    'Origin': 'https://www.pixiv.net'
                },
                onload: function (res) {
                    if (res.status === 200) {
                        const blob = res.response;
                        const objectUrl = URL.createObjectURL(blob);
                        resolve(objectUrl);
                    } else {
                        reject(src);
                    }
                },
                onerror: function (err) {
                    console.error(`❌ [代理错误]:`, err);
                    reject(src);
                },
                ontimeout: function () {
                    reject(src);
                },
                timeout: 10000
            });
        });
    }

    // --- 拦截图片加载 ---
    function interceptImage() {
        const originalImage = window.Image;
        
        window.Image = function () {
            const img = new originalImage();
            
            Object.defineProperty(img, 'src', {
                set: function (val) {
                    if (val.includes('/img-master/') || val.includes('/c/') || val.includes('i.pximg')) {
                        proxyImage(val).then(url => {
                            this._actualSrc = url;
                            if (this.onload) this.onload();
                        }).catch(() => {
                            this._actualSrc = val;
                        });
                    } else {
                        this._actualSrc = val;
                    }
                },
                get: function () {
                    return this._actualSrc || '';
                }
            });

            img.complete = false;
            return img;
        };

        // --- 兼容性处理 ---
        const observer = new MutationObserver(() => {
            document.querySelectorAll('img[src*="/img-master/"], img[src*="/c/"]').forEach(img => {
                if (!img._hooked) {
                    const originalSrc = img.src;
                    img._hooked = true;
                    img._originalSrc = originalSrc;
                    
                    proxyImage(originalSrc).then(url => {
                        img.src = url;
                    });
                }
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // --- 启动 ---
    if (window.self === window.top) {
        interceptImage();
        console.log("✅ Pixiv 原图代理脚本已注入");
    }

})();
