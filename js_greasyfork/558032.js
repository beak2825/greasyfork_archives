// ==UserScript==
// @name         网盘分享链接自动清理与自动复制
// @namespace    https://www.souyuanzhan.com 丨Www.SouYuanZhan.Com
// @version      1.0
// @description  网盘分享链接自动清理与自动复制 百度、迅雷、123、UC、夸克网盘分享链接中的多余推广文字，并实现弹窗自动复制纯净链接。
// @author       搜源站 & www.souyuanzhan.com
// @match        https://pan.xunlei.com/*
// @match        https://drive.uc.cn/*
// @match        https://pan.quark.cn/*
// @match        https://pan.baidu.com/*
// @match        https://yun.baidu.com/*
// @match        https://www.123pan.com/*
// @grant        GM_setClipboard
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/558032/%E7%BD%91%E7%9B%98%E5%88%86%E4%BA%AB%E9%93%BE%E6%8E%A5%E8%87%AA%E5%8A%A8%E6%B8%85%E7%90%86%E4%B8%8E%E8%87%AA%E5%8A%A8%E5%A4%8D%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/558032/%E7%BD%91%E7%9B%98%E5%88%86%E4%BA%AB%E9%93%BE%E6%8E%A5%E8%87%AA%E5%8A%A8%E6%B8%85%E7%90%86%E4%B8%8E%E8%87%AA%E5%8A%A8%E5%A4%8D%E5%88%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 防止重复复制的标记
    let lastCopiedText = '';

    // 正则表达式配置
    const sitePatterns = [
        {
            name: '迅雷网盘',
            domain: 'pan.xunlei.com',
            // 匹配链接 + 提取码 (pwd)
            regex: /(https:\/\/pan\.xunlei\.com\/s\/[^?\s]+\?pwd=[^#\s]+)/
        },
        {
            name: 'UC网盘',
            domain: 'drive.uc.cn',
            regex: /(https:\/\/drive\.uc\.cn\/s\/[^?\s]+)/
        },
        {
            name: '夸克网盘',
            domain: 'pan.quark.cn',
            regex: /(https:\/\/pan\.quark\.cn\/s\/[^\s]+)/
        },
        {
            name: '百度网盘',
            domain: 'baidu.com',
            // 百度通常格式：链接: https://... 提取码: xxxx
            // 我们需要提取 URL 和 提取码，组合成纯净版
            handler: (text) => {
                const urlMatch = text.match(/(https:\/\/pan\.baidu\.com\/s\/[^\s]+)/);
                const pwdMatch = text.match(/提取码[:：]\s*([a-zA-Z0-9]{4})/);
                if (urlMatch) {
                    let clean = urlMatch[1];
                    if (pwdMatch) {
                        clean += '?pwd=' + pwdMatch[1];
                    }
                    return clean;
                }
                return null;
            }
        },
        {
            name: '123网盘',
            domain: '123pan.com',
            regex: /(https:\/\/www\.123pan\.com\/s\/[^\s]+)/
        }
    ];

    /**
     * 核心清理函数
     * @param {string} text 原始文本
     * @returns {object|null} 返回 { cleanLink, type } 或 null
     */
    function getCleanLinkInfo(text) {
        if (!text) return null;

        for (let site of sitePatterns) {
            if (text.includes(site.domain)) {
                let cleanLink = '';

                if (site.handler) {
                    // 自定义处理逻辑 (主要用于百度这种复杂的)
                    cleanLink = site.handler(text);
                } else if (site.regex) {
                    // 通用正则提取
                    const match = text.match(site.regex);
                    if (match) {
                        cleanLink = match[1];
                    }
                }

                if (cleanLink) {
                    return { cleanLink, type: site.name };
                }
            }
        }
        return null;
    }

    /**
     * 执行复制并提示
     */
    function doCopy(cleanLink, type, isAuto = false) {
        if (cleanLink === lastCopiedText) return; // 防止重复提示

        // 使用油猴API写入剪贴板 (支持无用户交互写入)
        GM_setClipboard(cleanLink, 'text');
        lastCopiedText = cleanLink;

        console.log(`[${type}] 链接已清理并复制:`, cleanLink);
        showNotification(`${type} 纯净链接已${isAuto ? '自动' : ''}复制`, cleanLink);
    }

    // ===========================
    // 1. 监听手动复制事件 (保底逻辑)
    // ===========================
    document.addEventListener('copy', function(e) {
        let clipboardText = '';
        if (window.getSelection) {
            clipboardText = window.getSelection().toString();
        }

        // 如果没有选中文本，尝试从事件获取（针对点击网页按钮的情况）
        if (!clipboardText && e.clipboardData) {
            // 注意：无法直接读取 e.clipboardData 里的现有数据来修改，
            // 只能拦截写入。所以这里主要依赖上面的 Selection 或者假设当前操作意图。
            // 但很多网盘点击“复制”按钮时，是脚本触发的 select() 或 setData
        }

        // 这里的逻辑稍微调整：如果用户选中了包含链接的乱七八糟的文字进行复制，我们进行清洗
        const result = getCleanLinkInfo(clipboardText);
        if (result) {
            e.preventDefault();
            if (e.clipboardData) {
                e.clipboardData.setData('text/plain', result.cleanLink);
            }
            doCopy(result.cleanLink, result.type, false);
        }
    });

    // ===========================
    // 2. 自动监听 DOM (实现分享完自动复制)
    // ===========================
    const observer = new MutationObserver((mutations) => {
        // 性能优化：简单的防抖或直接检测
        checkDialogAndCopy();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true, // 监听属性变化，因为input value变化可能不触发childList
        characterData: true
    });

    /**
     * 检测页面中是否存在分享成功的链接
     */
    function checkDialogAndCopy() {
        // 策略：扫描页面上所有可见的 input/textarea 和特定的文本容器
        // 不需要精确匹配每个网站的弹窗class，只要发现符合网盘特征的链接文本即可

        const inputs = document.querySelectorAll('input[type="text"], textarea, div[class*="url"], div[class*="link"]');

        for (let el of inputs) {
            // 获取元素的值或文本
            let text = el.value || el.textContent || el.innerText;

            if (!text || text.length < 10) continue;

            // 检查是否包含支持的网盘域名
            const isTarget = sitePatterns.some(site => text.includes(site.domain));
            if (!isTarget) continue;

            // 如果是百度网盘，需要特殊处理，因为它的链接和提取码通常在不同的元素里
            // 或者在一个大的文本块里。
            if (text.includes('pan.baidu.com') && !text.includes('pwd=')) {
                // 尝试寻找附近的提取码
                const parent = el.closest('div, form, .dialog-body') || document.body;
                const parentText = parent.innerText; // 获取整个弹窗的文本
                // 使用整个弹窗文本去解析
                text = parentText;
            }

            const result = getCleanLinkInfo(text);
            if (result && result.cleanLink !== lastCopiedText) {
                // 只有当链接看起来像是一个刚刚生成的分享链接时才自动复制
                // 避免复制页面上本来就有的静态链接列表
                // 通常分享弹窗里的层级比较高 (z-index)，或者是在 modal 里面
                const isVisible = !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length);
                if (isVisible) {
                    doCopy(result.cleanLink, result.type, true);
                    break; // 找到一个就停止，避免重复
                }
            }
        }
    }


    // ===========================
    // UI 提示组件
    // ===========================
    function showNotification(message, subtext) {
        // 移除旧的
        const old = document.getElementById('clean-link-notify');
        if (old) old.remove();

        const notification = document.createElement('div');
        notification.id = 'clean-link-notify';
        notification.innerHTML = `
            <div style="font-weight:bold; margin-bottom:4px;">✅ ${message}</div>
            <div style="font-size:12px; opacity:0.9; word-break:break-all;">${subtext || ''}</div>
        `;
        notification.style.cssText = `
            position: fixed;
            top: 40px;
            right: 20px;
            background: linear-gradient(135deg, #4CAF50, #45a049);
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            z-index: 2147483647; /* 保证最顶层 */
            font-size: 14px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            font-family: system-ui, -apple-system, sans-serif;
            transition: all 0.3s ease;
            transform: translateY(0);
            pointer-events: none; /* 鼠标穿透 */
        `;

        document.body.appendChild(notification);

        // 3秒后移除
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateY(-20px)';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

})();