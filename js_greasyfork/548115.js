// ==UserScript==
// @name         一键复制当前页磁力链
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  在网页右上角添加一键复制当前页磁力链的功能，支持Base32和十六进制编码的智能去重
// @author       deepseek
// @match        https://*.nyaa.si/*
// @match        https://share.dmhy.org/*
// @match        https://www.hacg.me/*
// @match        https://www.hacg.icu/wp/*
// @icon         https://img.icons8.com/color/48/000000/magnet.png
// @grant        GM_setClipboard
// @grant        GM_notification
// @downloadURL https://update.greasyfork.org/scripts/548115/%E4%B8%80%E9%94%AE%E5%A4%8D%E5%88%B6%E5%BD%93%E5%89%8D%E9%A1%B5%E7%A3%81%E5%8A%9B%E9%93%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/548115/%E4%B8%80%E9%94%AE%E5%A4%8D%E5%88%B6%E5%BD%93%E5%89%8D%E9%A1%B5%E7%A3%81%E5%8A%9B%E9%93%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 只在顶级body中插入按钮
    if (window.self !== window.top) {
        return;
    }

    // 创建固定在右上角的复制磁力链按钮
    const copyButton = document.createElement('button');
    copyButton.innerHTML = '复制';
    copyButton.className = 'fixed-copy-button';
    document.body.appendChild(copyButton);

    // 按钮样式
    const style = document.createElement('style');
    style.textContent = `
        .fixed-copy-button {
            position: fixed;
            top: 40px;
            right: 20px;
            padding: 10px 20px;
            background: #ff6b6b;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 14px;
            font-weight: bold;
            z-index: 10000;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
            transition: all 0.3s ease;
        }
        .fixed-copy-button:hover {
            background: #ff5252;
            transform: translateY(-2px);
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
        }
        .fixed-copy-button:active {
            transform: translateY(0);
        }
        .fixed-copy-button.copied {
            background: #4caf50;
        }
        .message {
            position: fixed;
            top: 90px;
            right: 20px;
            padding: 12px 20px;
            background: rgba(76, 175, 80, 0.9);
            color: white;
            border-radius: 5px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
            transform: translateX(150%);
            transition: transform 0.4s ease-out;
            z-index: 10000;
            font-size: 14px;
            backdrop-filter: blur(8px);
            -webkit-backdrop-filter: blur(8px);
            border: 1px solid rgba(255, 255, 255, 0.2);
        }
        .message.show {
            transform: translateX(0);
        }
        .message.error {
            background: rgba(244, 67, 54, 0.9);
        }
    `;

    if (!document.querySelector('style[data-magnet-copy-style]')) {
        style.setAttribute('data-magnet-copy-style', 'true');
        document.head.appendChild(style);
    }

    // 显示消息通知
    function showMessage(text, isError = false) {
        let message = document.querySelector('.magnet-copy-message');
        if (!message) {
            message = document.createElement('div');
            message.className = 'magnet-copy-message message';
            document.body.appendChild(message);
        }

        message.textContent = text;
        message.classList.remove('error');
        if (isError) {
            message.classList.add('error');
        }
        message.classList.add('show');

        setTimeout(() => {
            message.classList.remove('show');
        }, 3000);
    }

    // Base32 字母表 (RFC 4648)
    const base32Alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
    const base32AlphabetLower = base32Alphabet.toLowerCase();

    // 检测字符串是否为有效的Base32编码
    function isBase32(str) {
        const cleanStr = str.replace(/=/g, '').toUpperCase(); // 移除填充字符并转为大写
        if (cleanStr.length !== 32) return false;

        for (let i = 0; i < cleanStr.length; i++) {
            const char = cleanStr[i];
            if (!base32Alphabet.includes(char)) {
                return false;
            }
        }
        return true;
    }

    // 检测字符串是否为有效的十六进制编码（40字符的BTIH哈希）
    function isHex(str) {
        return /^[0-9a-fA-F]{40}$/.test(str);
    }

    // 十六进制转换为Base32
    function hexToBase32(hex) {
        hex = hex.toLowerCase().replace(/^0x/, '');

        if (!isHex(hex)) {
            throw new Error('无效的十六进制字符串');
        }

        // Base32编码实现
        const chars = base32Alphabet;
        let bits = 0;
        let value = 0;
        let output = '';

        for (let i = 0; i < hex.length; i += 2) {
            value = (value << 8) | parseInt(hex.substr(i, 2), 16);
            bits += 8;

            while (bits >= 5) {
                output += chars[(value >>> (bits - 5)) & 0x1F];
                bits -= 5;
            }
        }

        if (bits > 0) {
            output += chars[(value << (5 - bits)) & 0x1F];
        }

        // 确保输出为32字符（BTIH标准）
        return output.substring(0, 32);
    }

    // Base32转换为十六进制（备用功能）
    function base32ToHex(base32) {
        base32 = base32.toUpperCase().replace(/=/g, '');
        if (!isBase32(base32)) {
            throw new Error('无效的Base32字符串');
        }

        let bits = 0;
        let value = 0;
        let output = '';

        for (let i = 0; i < base32.length; i++) {
            value = (value << 5) | base32Alphabet.indexOf(base32[i]);
            bits += 5;

            if (bits >= 8) {
                output += ((value >>> (bits - 8)) & 0xFF).toString(16).padStart(2, '0');
                bits -= 8;
            }
        }

        return output;
    }

    // 从磁力链接中提取信息哈希
    function extractInfoHash(magnetLink) {
        // 处理完整磁力链接
        const magnetMatch = magnetLink.match(/magnet:\?.*xt=urn:btih:([^&]+)/i);
        if (magnetMatch && magnetMatch[1]) {
            return magnetMatch[1].toUpperCase();
        }

        // 处理纯哈希值（可能是base32或hex）
        if (isBase32(magnetLink) || isHex(magnetLink)) {
            return magnetLink.toUpperCase();
        }

        return null;
    }

    // 检测文本是否为纯哈希值并转换为完整磁力链接
    function normalizeToMagnetLink(text) {
        text = text.trim();

        // 如果已经是完整磁力链接，直接返回
        if (text.startsWith('magnet:')) {
            return text;
        }

        // 检测是否为有效的哈希值
        if (isBase32(text)) {
            return `magnet:?xt=urn:btih:${text.toUpperCase()}`;
        }

        if (isHex(text)) {
            return `magnet:?xt=urn:btih:${text.toLowerCase()}`;
        }

        return null;
    }

    // 在文本内容中查找可能的哈希值
    function findHashInText(text) {
        const hashes = [];

        // 匹配40字符的十六进制（可能被空格或其他字符分隔）
        const hexMatches = text.match(/[0-9a-fA-F]{40}/g);
        if (hexMatches) {
            hexMatches.forEach(match => {
                if (isHex(match)) {
                    hashes.push(match);
                }
            });
        }

        // 匹配32字符的Base32（可能被空格或其他字符分隔）
        const base32Matches = text.match(/[A-Z2-7]{32}/g);
        if (base32Matches) {
            base32Matches.forEach(match => {
                if (isBase32(match)) {
                    hashes.push(match);
                }
            });
        }

        return hashes;
    }

    // 智能去重处理
    function deduplicateMagnetLinks(magnetLinks) {
        const hashMap = new Map(); // 存储Base32哈希 -> 磁力链接
        const result = [];

        for (const link of magnetLinks) {
            const infoHash = extractInfoHash(link);
            if (!infoHash) {
                // 无法提取哈希的链接直接保留
                result.push(link);
                continue;
            }

            let base32Hash;
            if (isHex(infoHash)) {
                try {
                    base32Hash = hexToBase32(infoHash);
                } catch (e) {
                    // 转换失败，保留原链接
                    result.push(link);
                    continue;
                }
            } else if (isBase32(infoHash)) {
                base32Hash = infoHash.toUpperCase();
            } else {
                // 无效哈希格式，保留原链接
                result.push(link);
                continue;
            }

            // 检查是否已存在相同哈希的链接
            if (hashMap.has(base32Hash)) {
                const existingLink = hashMap.get(base32Hash);
                const existingHash = extractInfoHash(existingLink);

                // 优先保留Base32编码的链接
                if (isHex(infoHash) && isBase32(existingHash)) {
                    // 当前是hex，已存在的是base32，跳过当前
                    continue;
                } else if (isBase32(infoHash) && isHex(existingHash)) {
                    // 当前是base32，已存在的是hex，替换为base32
                    hashMap.set(base32Hash, link);
                    // 从结果中移除旧的hex链接，添加新的base32链接
                    const index = result.indexOf(existingLink);
                    if (index > -1) {
                        result.splice(index, 1);
                    }
                    result.push(link);
                } else {
                    // 相同编码格式，去重
                    continue;
                }
            } else {
                // 新哈希，添加到映射和结果中
                hashMap.set(base32Hash, link);
                result.push(link);
            }
        }

        return result;
    }

    // 复制磁力链函数
    function copyMagnetLinks() {
        const magnetLinks = [];

        // 改进的选择器，兼容更多磁力链接格式
        const magnetSelectors = [
            'a[href^="magnet:?"]',
            'a[href^="magnet:?xt="]',
            'a[href*="magnet:"]',
            '.magnet-link',
            '[href*="magnet:?xt="]',
            'a[href*="btih:"]'
        ];

        // 1. 首先收集所有完整的磁力链接
        magnetSelectors.forEach(selector => {
            const foundLinks = document.querySelectorAll(selector);
            foundLinks.forEach(link => {
                if (link.href && link.href.startsWith('magnet:')) {
                    magnetLinks.push(link.href);
                }
            });
        });

        // 2. 查找页面中的纯文本哈希值
        const textElements = document.querySelectorAll('code, pre, .hash, .magnet, .torrent-hash, [class*="hash"], [class*="magnet"]');
        const textHashes = new Set();

        textElements.forEach(element => {
            const text = element.textContent.trim();

            // 尝试直接转换文本为磁力链接
            const magnetLink = normalizeToMagnetLink(text);
            if (magnetLink) {
                textHashes.add(magnetLink);
            } else {
                // 在文本内容中查找可能的哈希值
                const foundHashes = findHashInText(text);
                foundHashes.forEach(hash => {
                    const magnetLink = normalizeToMagnetLink(hash);
                    if (magnetLink) {
                        textHashes.add(magnetLink);
                    }
                });
            }
        });

        // 3. 如果没有找到任何链接，尝试在整个页面正文中搜索
        if (magnetLinks.length === 0 && textHashes.size === 0) {
            const bodyText = document.body.textContent;
            const foundHashes = findHashInText(bodyText);
            foundHashes.forEach(hash => {
                const magnetLink = normalizeToMagnetLink(hash);
                if (magnetLink) {
                    textHashes.add(magnetLink);
                }
            });
        }

        // 合并所有链接
        const allLinks = [...magnetLinks, ...textHashes];

        if (allLinks.length === 0) {
            showMessage('未找到磁力链接！', true);
            return;
        }

        // 基础去重（完全相同的链接）
        const uniqueLinks = [...new Set(allLinks)];

        // 智能去重处理
        const deduplicatedLinks = deduplicateMagnetLinks(uniqueLinks);

        // 统计信息
        const hexCount = uniqueLinks.filter(link => {
            const hash = extractInfoHash(link);
            return hash && isHex(hash);
        }).length;

        const base32Count = uniqueLinks.filter(link => {
            const hash = extractInfoHash(link);
            return hash && isBase32(hash);
        }).length;

        const textHashCount = textHashes.size;

        // 复制到剪贴板
        const textToCopy = deduplicatedLinks.join('\n');
        GM_setClipboard(textToCopy);

        // 更新按钮状态
        copyButton.classList.add('copied');
        const originalText = copyButton.textContent;

        let message = `已复制 ${deduplicatedLinks.length} 个磁力链接`;

        showMessage(message);

        // 恢复按钮状态
        setTimeout(() => {
            copyButton.classList.remove('copied');
            copyButton.textContent = originalText;
        }, 3000);

        // 在控制台输出详细信息（用于调试）
        console.log('原始链接数量:', uniqueLinks.length);
        console.log('去重后链接数量:', deduplicatedLinks.length);
        console.log('十六进制编码链接:', hexCount);
        console.log('Base32编码链接:', base32Count);
        console.log('从文本中提取的哈希:', textHashCount);
    }

    // 绑定点击事件（带防抖）
    let isProcessing = false;
    copyButton.addEventListener('click', function() {
        if (isProcessing) return;
        isProcessing = true;

        copyMagnetLinks();

        setTimeout(() => {
            isProcessing = false;
        }, 1000);
    });
})();
