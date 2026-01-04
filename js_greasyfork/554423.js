// ==UserScript==
// @name         MTSlash 域名替换
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  将所有 mtslash 旧域名替换为 www.mtslash.life，并修复论坛自动更正导致的双重域名路径问题（虽然可能性很低）。
// @author       GEMINI&CM
// @match        *://www.mtslash.*/*
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/554423/MTSlash%20%E5%9F%9F%E5%90%8D%E6%9B%BF%E6%8D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/554423/MTSlash%20%E5%9F%9F%E5%90%8D%E6%9B%BF%E6%8D%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 目标新域名
    const NEW_DOMAIN = 'https://www.mtslash.life';
    const CLEAN_DOMAIN_PREFIX = 'https://www.mtslash.life/'; // 确保末尾有斜杠

    // 所有旧域名，用于链接开头的匹配 (保持 V1.4 的精确匹配列表)
    const OLD_DOMAINS = [
        'http://www.movietvslash.com', 'http://movietvslash.com', 'https://www.movietvslash.com', 'https://movietvslash.com', 'www.movietvslash.com', 'movietvslash.com',
        'http://www.mtslash.com', 'http://mtslash.com', 'https://www.mtslash.com', 'https://mtslash.com', 'www.mtslash.com', 'mtslash.com',
        'http://www.mtslash.net', 'http://mtslash.net', 'https://www.mtslash.net', 'https://mtslash.net', 'www.mtslash.net', 'mtslash.net',
        'http://www.mtslash.me', 'http://mtslash.me', 'https://www.mtslash.me', 'https://mtslash.me', 'www.mtslash.me', 'mtslash.me',
        'http://www.mtslash.xyz', 'http://mtslash.xyz', 'https://www.mtslash.xyz', 'https://mtslash.xyz', 'www.mtslash.xyz', 'mtslash.xyz'
    ];

    // 【新增/修改】清理双重域名的正则表达式。
    // 它匹配：[新域名]/[旧域名或www.旧域名]/
    // 注意：我们将只匹配mtslash.com/thread111这种情况，所以不需要协议前缀。
    const DOUBLE_DOMAIN_REGEX = new RegExp(
        `^${CLEAN_DOMAIN_PREFIX.replace(/\./g, '\\.')}(www\\.)?(movietvslash\\.com|mtslash\\.com|mtslash\\.net|mtslash\\.me|mtslash\\.xyz)/`, 'gi'
    );

    // -----------------------------------------------------------------
    // 1. 替换所有超链接 (<a> 标签的 href 属性)
    // -----------------------------------------------------------------
    document.querySelectorAll('a[href]').forEach(link => {
        let originalHrefAttr = link.getAttribute('href');

        if (!originalHrefAttr) return;

        let modified = false;

        // 【步骤 A: 链接开头替换】 (保持 V1.4 的精确逻辑)
        for (const oldDomain of OLD_DOMAINS) {
            if (originalHrefAttr.toLowerCase().startsWith(oldDomain.toLowerCase())) {
                // 确保它后面是 / 或字符串结束
                if (originalHrefAttr.length === oldDomain.length || originalHrefAttr[oldDomain.length] === '/' || originalHrefAttr[oldDomain.length] === '#') {

                    originalHrefAttr = NEW_DOMAIN + originalHrefAttr.substring(oldDomain.length);
                    modified = true;
                    break;
                }
            }
        }

        // 【步骤 B: 清理双重域名】 (新增的逻辑)
        // 检查经过 A 步骤处理后的 URL 是否含有双重域名结构
        if (modified || originalHrefAttr.startsWith(CLEAN_DOMAIN_PREFIX)) {
            DOUBLE_DOMAIN_REGEX.lastIndex = 0; // 重置

            // 检查 URL 是否匹配双重域名模式 (例如: https://...life/mtslash.com/...)
            if (DOUBLE_DOMAIN_REGEX.test(originalHrefAttr)) {

                DOUBLE_DOMAIN_REGEX.lastIndex = 0; // 再次重置

                // 替换：把双重域名部分 (mtslash.com/) 替换成空字符串
                originalHrefAttr = originalHrefAttr.replace(DOUBLE_DOMAIN_REGEX, CLEAN_DOMAIN_PREFIX);
                modified = true;
            }
        }

        if (modified) {
            link.setAttribute('href', originalHrefAttr);
        }
    });

    // -----------------------------------------------------------------
    // 2. 替换页面上所有可见的纯文本 (逻辑不变)
    // -----------------------------------------------------------------
    const simpleRegex = /(http:\/\/|https:\/\/|\/\/)?(www\.)?(movietvslash\.com|mtslash\.com|mtslash\.net|mtslash\.me|mtslash\.xyz)/gi;

    const walker = document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_TEXT,
        null,
        false
    );

    let node;
    const nodesToReplace = [];

    while ((node = walker.nextNode())) {
        const parentTag = node.parentElement.tagName.toUpperCase();
        if (parentTag === 'SCRIPT' || parentTag === 'STYLE') {
            continue;
        }

        simpleRegex.lastIndex = 0;
        if (simpleRegex.test(node.nodeValue)) {
            nodesToReplace.push(node);
        }
    }

    nodesToReplace.forEach(node => {
        simpleRegex.lastIndex = 0;
        node.nodeValue = node.nodeValue.replace(simpleRegex, NEW_DOMAIN);
    });

})();