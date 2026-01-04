// ==UserScript==
// @name         一键复制当前页磁力链 (纯净版)
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  在网页右上角添加一键复制当前页磁力链的功能，强制只复制Hash地址（去除文件名等文本），支持Base32和十六进制编码的智能去重
// @author       gemini
// @match        https://*.nyaa.si/*
// @license      MIT
// @match        https://share.dmhy.org/*
// @match        https://btdig.com/*
// @match        https://www.hacg.me/*
// @match        https://www.hacg.icu/wp/*
// @match        http://fnos.740110.xyz:11180/*
// @icon         https://img.icons8.com/color/48/000000/magnet.png
// @grant        GM_setClipboard
// @grant        GM_notification
// @downloadURL https://update.greasyfork.org/scripts/557069/%E4%B8%80%E9%94%AE%E5%A4%8D%E5%88%B6%E5%BD%93%E5%89%8D%E9%A1%B5%E7%A3%81%E5%8A%9B%E9%93%BE%20%28%E7%BA%AF%E5%87%80%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/557069/%E4%B8%80%E9%94%AE%E5%A4%8D%E5%88%B6%E5%BD%93%E5%89%8D%E9%A1%B5%E7%A3%81%E5%8A%9B%E9%93%BE%20%28%E7%BA%AF%E5%87%80%E7%89%88%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (window.self !== window.top) return;

    // UI部分保持不变
    const copyButton = document.createElement('button');
    copyButton.innerHTML = '复制';
    copyButton.className = 'fixed-copy-button';
    document.body.appendChild(copyButton);

    const style = document.createElement('style');
    style.textContent = `
        .fixed-copy-button {
            position: fixed; top: 40px; right: 20px; padding: 10px 20px;
            background: #ff6b6b; color: white; border: none; border-radius: 5px;
            cursor: pointer; font-size: 14px; font-weight: bold; z-index: 10000;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2); transition: all 0.3s ease;
        }
        .fixed-copy-button:hover { background: #ff5252; transform: translateY(-2px); box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3); }
        .fixed-copy-button:active { transform: translateY(0); }
        .fixed-copy-button.copied { background: #4caf50; }
        .message {
            position: fixed; top: 90px; right: 20px; padding: 12px 20px;
            background: rgba(76, 175, 80, 0.9); color: white; border-radius: 5px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2); transform: translateX(150%);
            transition: transform 0.4s ease-out; z-index: 10000; font-size: 14px;
            backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
            border: 1px solid rgba(255, 255, 255, 0.2);
        }
        .message.show { transform: translateX(0); }
        .message.error { background: rgba(244, 67, 54, 0.9); }
    `;
    if (!document.querySelector('style[data-magnet-copy-style]')) {
        style.setAttribute('data-magnet-copy-style', 'true');
        document.head.appendChild(style);
    }

    function showMessage(text, isError = false) {
        let message = document.querySelector('.magnet-copy-message');
        if (!message) {
            message = document.createElement('div');
            message.className = 'magnet-copy-message message';
            document.body.appendChild(message);
        }
        message.textContent = text;
        message.classList.remove('error');
        if (isError) message.classList.add('error');
        message.classList.add('show');
        setTimeout(() => message.classList.remove('show'), 3000);
    }

    const base32Alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

    function isBase32(str) {
        const cleanStr = str.replace(/=/g, '').toUpperCase();
        if (cleanStr.length !== 32) return false;
        for (let i = 0; i < cleanStr.length; i++) {
            if (!base32Alphabet.includes(cleanStr[i])) return false;
        }
        return true;
    }

    function isHex(str) { return /^[0-9a-fA-F]{40}$/.test(str); }

    function hexToBase32(hex) {
        hex = hex.toLowerCase().replace(/^0x/, '');
        if (!isHex(hex)) throw new Error('无效的十六进制字符串');
        const chars = base32Alphabet;
        let bits = 0, value = 0, output = '';
        for (let i = 0; i < hex.length; i += 2) {
            value = (value << 8) | parseInt(hex.substr(i, 2), 16);
            bits += 8;
            while (bits >= 5) {
                output += chars[(value >>> (bits - 5)) & 0x1F];
                bits -= 5;
            }
        }
        if (bits > 0) output += chars[(value << (5 - bits)) & 0x1F];
        return output.substring(0, 32);
    }

    // 增强的哈希提取：支持 magnet 协议以及包含 btih 的 HTTP 链接
    function extractInfoHash(linkStr) {
        // 1. 标准 magnet 协议
        const magnetMatch = linkStr.match(/magnet:\?.*xt=urn:btih:([^&]+)/i);
        if (magnetMatch && magnetMatch[1]) return magnetMatch[1];

        // 2. 尝试从任意字符串中提取 btih 后的哈希（针对非 magnet 协议的下载链）
        const btihMatch = linkStr.match(/btih:([a-zA-Z0-9]+)/i);
        if (btihMatch && btihMatch[1]) {
            const potentialHash = btihMatch[1];
            if (isBase32(potentialHash) || isHex(potentialHash)) {
                return potentialHash;
            }
        }

        // 3. 如果字符串本身就是纯哈希
        if (isBase32(linkStr) || isHex(linkStr)) return linkStr;

        return null;
    }

    // 生成标准纯净链接（无文件名参数）
    function generateCleanMagnetLink(hash) {
        return `magnet:?xt=urn:btih:${hash}`;
    }

    function deduplicateMagnetLinks(magnetLinks) {
        const hashMap = new Map();
        const result = [];

        for (const link of magnetLinks) {
            const infoHash = extractInfoHash(link);
            if (!infoHash) continue;

            let base32Hash;
            let finalHashStr; // 用于生成最终链接的哈希字符串

            if (isHex(infoHash)) {
                try {
                    base32Hash = hexToBase32(infoHash);
                    finalHashStr = base32Hash; // 优先转为 Base32 输出，更加短小规范
                } catch (e) {
                    base32Hash = infoHash.toUpperCase(); // 仅用于去重键值
                    finalHashStr = infoHash.toLowerCase();
                }
            } else if (isBase32(infoHash)) {
                base32Hash = infoHash.toUpperCase();
                finalHashStr = base32Hash;
            } else {
                continue;
            }

            // 核心修改：这里不再 push 原链接 link，而是 push 重新生成的纯净链接
            const cleanLink = generateCleanMagnetLink(finalHashStr);

            if (!hashMap.has(base32Hash)) {
                hashMap.set(base32Hash, cleanLink);
                result.push(cleanLink);
            }
        }
        return result;
    }

    function copyMagnetLinks() {
        const magnetLinks = [];

        // 扩大搜索范围，只要 href 里有 btih 信息的都抓取
        const magnetSelectors = [
            'a[href^="magnet:?"]',
            'a[href^="magnet:?xt="]',
            'a[href*="magnet:"]',
            '.magnet-link',
            '[href*="btih:"]'
        ];

        magnetSelectors.forEach(selector => {
            const foundLinks = document.querySelectorAll(selector);
            foundLinks.forEach(link => {
                if (link.href) {
                    magnetLinks.push(link.href);
                }
            });
        });

        const textElements = document.querySelectorAll('code, pre, .hash, .magnet, .torrent-hash, [class*="hash"], [class*="magnet"]');
        const textHashes = new Set();

        // 辅助函数：添加哈希到集合
        const addHash = (h) => textHashes.add(generateCleanMagnetLink(h));

        textElements.forEach(element => {
            const text = element.textContent.trim();
            const hash = extractInfoHash(text);
            if (hash) {
                addHash(hash);
            } else {
                const hexMatches = text.match(/[0-9a-fA-F]{40}/g);
                if (hexMatches) hexMatches.forEach(h => isHex(h) && addHash(h));

                const base32Matches = text.match(/[A-Z2-7]{32}/g);
                if (base32Matches) base32Matches.forEach(h => isBase32(h) && addHash(h));
            }
        });

        if (magnetLinks.length === 0 && textHashes.size === 0) {
            const bodyText = document.body.textContent;
            const hexMatches = bodyText.match(/[0-9a-fA-F]{40}/g);
            if (hexMatches) hexMatches.forEach(h => isHex(h) && addHash(h));
            const base32Matches = bodyText.match(/[A-Z2-7]{32}/g);
            if (base32Matches) base32Matches.forEach(h => isBase32(h) && addHash(h));
        }

        const allLinks = [...magnetLinks, ...textHashes];
        if (allLinks.length === 0) {
            showMessage('未找到磁力链接！', true);
            return;
        }

        // 去重并生成纯净链接
        const deduplicatedLinks = deduplicateMagnetLinks(allLinks);

        const textToCopy = deduplicatedLinks.join('\n');
        GM_setClipboard(textToCopy);

        copyButton.classList.add('copied');
        const originalText = copyButton.textContent;
        showMessage(`已复制 ${deduplicatedLinks.length} 个纯净磁力链接`);

        setTimeout(() => {
            copyButton.classList.remove('copied');
            copyButton.textContent = originalText;
        }, 3000);
    }

    let isProcessing = false;
    copyButton.addEventListener('click', function() {
        if (isProcessing) return;
        isProcessing = true;
        copyMagnetLinks();
        setTimeout(() => { isProcessing = false; }, 1000);
    });
})();
