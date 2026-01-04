// ==UserScript==
// @name         GGBases一键复制和下载磁力链接
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Modify B and M links to download/copy without redirecting
// @author       Grok
// @match        *://*.dlgal.com/*
// @match        *://*.ggbases.com/*
// @grant        GM_xmlhttpRequest
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/560706/GGBases%E4%B8%80%E9%94%AE%E5%A4%8D%E5%88%B6%E5%92%8C%E4%B8%8B%E8%BD%BD%E7%A3%81%E5%8A%9B%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/560706/GGBases%E4%B8%80%E9%94%AE%E5%A4%8D%E5%88%B6%E5%92%8C%E4%B8%8B%E8%BD%BD%E7%A3%81%E5%8A%9B%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // GM_xmlhttpRequest 包装函数，模拟 fetch API，支持获取响应头、文本、JSON 和 blob
    function gmFetch(url, options = {}) {
        return new Promise((resolve, reject) => {
            const reqOptions = {
                method: options.method || 'GET',
                url: url,
                headers: options.headers || {},
                onload: function(response) {
                    const res = {
                        ok: response.status >= 200 && response.status < 300,
                        status: response.status,
                        finalUrl: response.finalUrl,  // 获取重定向后的最终 URL
                        headers: {
                            get: function(name) {
                                const headers = {};
                                response.responseHeaders.trim().split(/[\r\n]+/).forEach(line => {
                                    const parts = line.split(/:(.+)/);
                                    if (parts.length > 1) {
                                        const key = parts[0].trim().toLowerCase();
                                        const value = parts[1].trim();
                                        headers[key] = value;
                                    }
                                });
                                return headers[name.toLowerCase()];
                            }
                        },
                        text: () => Promise.resolve(response.responseText),
                        json: () => Promise.resolve(JSON.parse(response.responseText)),
                        blob: () => Promise.resolve(new Blob([response.response], { type: response.responseHeaders.match(/content-type: (.+)/i)?.[1] || 'application/octet-stream' }))
                    };

                    if (res.ok) {
                        resolve(res);
                    } else {
                        reject(new Error(`HTTP status: ${response.status}`));
                    }
                },
                onerror: reject,
                ontimeout: reject
            };

            if (options.method === 'POST') {
                reqOptions.data = options.body || '';  // POST 时设置空 body
            }

            GM_xmlhttpRequest(reqOptions);
        });
    }

    // 从 fetched HTML 中的 JS 脚本提取 downid
    function extractDownid(html) {
        const downidRegex = /downid=([a-f0-9\-]+)/;
        const match = html.match(downidRegex);
        if (match && match[1]) {
            return match[1];
        }
        return null;
    }

    // 将文本复制到剪贴板
    function copyToClipboard(text) {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = 0;
        document.body.appendChild(textarea);
        textarea.select();
        try {
            document.execCommand('copy');
            return true;
        } catch (err) {
            console.error('Clipboard copy failed:', err);
            return false;
        } finally {
            document.body.removeChild(textarea);
        }
    }

    // 3 秒后恢复按钮文本
    function restoreText(element, originalText) {
        setTimeout(() => {
            element.innerHTML = originalText;
        }, 3000);
    }

    // 获取通用请求头（不包括 Content-Type，以避免 POST 问题）
    function getCommonHeaders(referer) {
        return {
            'Accept': 'application/json, text/plain, */*',
            'X-Requested-With': 'XMLHttpRequest',
            'User-Agent': navigator.userAgent,
            'Referer': referer || window.location.href
        };
    }

    // 处理 M 链接（磁力复制）：阻止跳转，提取 downid，发送 POST 获取 hash 并复制
    function handleMagnetLink(e, link, span) {
        e.preventDefault();
        const originalText = span.innerHTML;
        span.innerHTML = '复制中';
        const id = new URL(link.href).searchParams.get('id');

        gmFetch(link.href, { headers: getCommonHeaders(window.location.href) })
            .then(res => {
                const base = new URL(res.finalUrl).origin;  // 使用重定向后的 base 域名
                return res.text().then(html => ({ html, base }));
            })
            .then(({ html, base }) => {
                console.log('Fetched HTML for magnet:', html.substring(0, 200));  // 调试日志：输出 fetched HTML 前 200 字符
                const downid = extractDownid(html);
                if (!downid) {
                    throw new Error('Failed to extract downid from HTML');
                }
                const postUrl = `${base}/magnet.so?downid=${downid}&json=1&id=${id}`;
                return gmFetch(postUrl, {
                    method: 'POST',
                    headers: getCommonHeaders(link.href)
                }).then(res => res.text().then(text => ({ text, res })));  // 先获取文本用于调试
            })
            .then(({ text, res }) => {
                console.log('POST response text:', text);  // 调试日志：输出 POST 响应文本
                const data = JSON.parse(text);
                return data;
            })
            .then(data => {
                if (data && data.hash) {
                    const magnet = `magnet:?xt=urn:btih:${data.hash}`;
                    if (copyToClipboard(magnet)) {
                        span.innerHTML = '复制成功';
                        restoreText(span, originalText);
                    } else {
                        throw new Error('Copy to clipboard failed');
                    }
                } else {
                    throw new Error('Invalid data response');
                }
            })
            .catch(err => {
                console.error('Error handling magnet link:', err);
                span.innerHTML = '错误';
                restoreText(span, originalText);
            });
    }

    // 处理 B 链接（BT 下载）：阻止跳转，提取 downid，获取下载 blob 并模拟下载
    function handleBTLink(e, link, span) {
        e.preventDefault();
        const originalText = span.innerHTML;
        span.innerHTML = '下载中';
        const id = new URL(link.href).searchParams.get('id');

        gmFetch(link.href, { headers: getCommonHeaders(window.location.href) })
            .then(res => {
                const base = new URL(res.finalUrl).origin;  // 使用重定向后的 base 域名
                return res.text().then(html => ({ html, base }));
            })
            .then(({ html, base }) => {
                console.log('Fetched HTML for BT:', html.substring(0, 200));  // 调试日志：输出 fetched HTML 前 200 字符
                const downid = extractDownid(html);
                if (!downid) {
                    throw new Error('Failed to extract downid from HTML');
                }
                const downloadUrl = `${base}/down.so?downid=${downid}&id=${id}`;
                return gmFetch(downloadUrl, {
                    headers: getCommonHeaders(link.href)
                });
            })
            .then(res => {
                if (!res.ok) {
                    throw new Error('Download request failed');
                }
                return Promise.all([res.blob(), Promise.resolve(res.headers)]);
            })
            .then(([blob, headers]) => {
                const contentDisposition = headers.get('Content-Disposition');
                let filename = 'download.torrent';
                if (contentDisposition) {
                    const match = contentDisposition.match(/filename="?([^"]+)"?/);
                    if (match) filename = match[1];
                }
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.style.display = 'none';
                a.href = url;
                a.download = filename;
                document.body.appendChild(a);
                a.click();
                URL.revokeObjectURL(url);
                document.body.removeChild(a);
                span.innerHTML = '成功获取';
                restoreText(span, originalText);
            })
            .catch(err => {
                console.error('Error handling BT link:', err);
                span.innerHTML = '错误';
                restoreText(span, originalText);
            });
    }

    // 查找所有相关链接并附加点击事件监听器
    const btPathElements = document.querySelectorAll('.bt_path1');
    btPathElements.forEach(el => {
        const magnetLink = el.querySelector('a[title="磁力鏈結"]');
        const btLink = el.querySelector('a[title="BT 文件"]');

        if (magnetLink) {
            const span = magnetLink.querySelector('span');
            magnetLink.addEventListener('click', (e) => handleMagnetLink(e, magnetLink, span));
        }

        if (btLink) {
            const span = btLink.querySelector('span');
            btLink.addEventListener('click', (e) => handleBTLink(e, btLink, span));
        }
    });
})();