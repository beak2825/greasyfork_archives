// ==UserScript==
// @name         网盘分享链接自动复制与自动关闭分享链接弹窗 支持百度网盘 夸克网盘 迅雷网盘 UC网盘 123网盘
// @namespace    https://www.souyuanzhan.com
// @version      2.6
// @description  自动清理网盘分享链接中的多余字符，自动复制纯净链接，并自动关闭分享弹窗。修复百度网盘自动提取失效问题，修复迅雷灰屏问题，针对UC网盘“链接已生成”弹窗无法关闭的问题进行专项修复。
// @author       搜源站 & Www.SouYuanZhan.Com
// @match        https://pan.xunlei.com/*
// @match        https://drive.uc.cn/*
// @match        https://pan.quark.cn/*
// @match        https://pan.baidu.com/*
// @match        https://yun.baidu.com/*
// @match        https://www.123pan.com/*
// @grant        GM_setClipboard
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/558125/%E7%BD%91%E7%9B%98%E5%88%86%E4%BA%AB%E9%93%BE%E6%8E%A5%E8%87%AA%E5%8A%A8%E5%A4%8D%E5%88%B6%E4%B8%8E%E8%87%AA%E5%8A%A8%E5%85%B3%E9%97%AD%E5%88%86%E4%BA%AB%E9%93%BE%E6%8E%A5%E5%BC%B9%E7%AA%97%20%E6%94%AF%E6%8C%81%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%20%E5%A4%B8%E5%85%8B%E7%BD%91%E7%9B%98%20%E8%BF%85%E9%9B%B7%E7%BD%91%E7%9B%98%20UC%E7%BD%91%E7%9B%98%20123%E7%BD%91%E7%9B%98.user.js
// @updateURL https://update.greasyfork.org/scripts/558125/%E7%BD%91%E7%9B%98%E5%88%86%E4%BA%AB%E9%93%BE%E6%8E%A5%E8%87%AA%E5%8A%A8%E5%A4%8D%E5%88%B6%E4%B8%8E%E8%87%AA%E5%8A%A8%E5%85%B3%E9%97%AD%E5%88%86%E4%BA%AB%E9%93%BE%E6%8E%A5%E5%BC%B9%E7%AA%97%20%E6%94%AF%E6%8C%81%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%20%E5%A4%B8%E5%85%8B%E7%BD%91%E7%9B%98%20%E8%BF%85%E9%9B%B7%E7%BD%91%E7%9B%98%20UC%E7%BD%91%E7%9B%98%20123%E7%BD%91%E7%9B%98.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let lastCopiedText = '';
    const CLOSE_RETRY_TIMES = 5;
    const CLOSE_INTERVAL = 300;

    // 辅助函数：判断元素是否可见
    function isVisible(el) {
        if (!el) return false;
        const style = window.getComputedStyle(el);
        if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') return false;
        const rect = el.getBoundingClientRect();
        return rect.width > 0 && rect.height > 0;
    }

    // 网站配置
    const sitePatterns = [
        {
            name: '迅雷网盘',
            domain: 'pan.xunlei.com',
            regex: /(https:\/\/pan\.xunlei\.com\/s\/[^?\s]+\?pwd=[^#\s]+)/,
            closeSelector: `.xl-dialog-close, .kui-dialog-close, .title-box .close, [class*="dialog"] [class*="close"], button[title="关闭"], svg[class*="close"]`
        },
        {
            name: '百度网盘',
            domain: 'baidu.com',
            regex: /(https:\/\/pan\.baidu\.com\/s\/[^\s]+)/,
            closeSelector: `.dialog-header .close, .b-dialog-close, .dialog-close, a[title="关闭"], div[title="关闭"], .close-btn, [class*="dialog"] .icon-close, .icon-close-small`
        },
        {
            name: 'UC网盘',
            domain: 'drive.uc.cn',
            regex: /(https:\/\/drive\.uc\.cn\/s\/[^?\s]+)/,
            // 修复：添加 .bind-real-name-close-btn 以及更多通用关闭类名
            closeSelector: `.bind-real-name-close-btn, .dialog-close, .icon-close, .ant-modal-close, .zeus-dialog-close, .uc-share-dialog-close, .zeus-icon-close, [class*="close-icon"], .ant-modal-close-x, button[aria-label="关闭"], .close-btn, [class*="dialog"] [class*="close"]`
        },
        {
            name: '夸克网盘',
            domain: 'pan.quark.cn',
            regex: /(https:\/\/pan\.quark\.cn\/s\/[^\s]+)/,
            closeSelector: `.ant-modal-close, .ant-modal-close-x, .share-dialog-close, [aria-label="Close"], .icon-close`
        },
        {
            name: '123网盘',
            domain: '123pan.com',
            regex: /(https:\/\/www\.123pan\.com\/s\/[^\s]+)/,
            closeSelector: `.ant-modal-close, button[aria-label="Close"], .el-dialog__headerbtn`
        }
    ];

    // 执行复制并启动关闭流程
    function doCopy(cleanLink, type, isAuto = false, siteConfig = null) {
        if (!cleanLink || cleanLink === lastCopiedText) return;

        GM_setClipboard(cleanLink, 'text');
        lastCopiedText = cleanLink;

        console.log(`[${type}] 链接已复制:`, cleanLink);
        showNotification(`${type} 链接已自动复制`, cleanLink);

        if (isAuto && siteConfig) {
            attemptToCloseDialog(type, siteConfig);
        }
    }

    // 通用关闭尝试逻辑
    function attemptToCloseDialog(type, siteConfig) {
        let count = 0;
        const maxRetries = type === '迅雷网盘' ? 12 : 10;

        const timer = setInterval(() => {
            count++;
            let closed = false;

            // 1. 尝试 CSS 选择器点击
            closed = closeDialogBySelector(siteConfig.closeSelector);

            // 2. 模拟 ESC (百度常用)
            if (!closed && type !== '迅雷网盘') {
                closed = pressEscapeKey();
            }

            // 3. 迅雷特殊遮罩清理
            if (type === '迅雷网盘') {
                if(!closed) forceCloseXunleiWithRetry();
                removeMaskLayer();
            }

            // 4. 文本按钮兜底
            if (!closed) {
                let keywords = ['关闭', 'Close', '取消'];
                if (type === 'UC网盘') {
                    // UC 可能出现 "完成" 或 "我知道了"
                    keywords.push('完成', '我知道了', '确定', '好');
                }
                if (count > 2 || type === 'UC网盘') {
                    closed = findAndClickTextButton(keywords);
                }
            }

            // 5. UC网盘特殊深度兜底 (针对复杂嵌套结构)
            if (!closed && type === 'UC网盘' && count > 3) {
                // 查找弹窗容器内的所有可能关闭元素
                const buttons = document.querySelectorAll('div[class*="dialog"] div, div[class*="modal"] div, span');
                for (let btn of buttons) {
                    if (!isVisible(btn)) continue;
                    // 检查 class 是否包含 close 且不包含 text
                    const cls = (btn.className || '').toString();
                    if (cls.includes('close') && !btn.innerText.trim()) {
                         simulateClick(btn);
                         closed = true;
                         break;
                    }
                }
            }

            // 结束条件
            if (closed || count >= maxRetries) {
                clearInterval(timer);

                if(type === '迅雷网盘') {
                    removeMaskLayer();
                    setTimeout(() => {
                        console.log('迅雷网盘自动刷新页面...');
                        window.location.reload();
                    }, 500);
                }
            }
        }, CLOSE_INTERVAL);
    }

    /**
     * 百度特化逻辑
     */
    function checkBaiduSpecial() {
        if (!window.location.host.includes('baidu.com')) return false;

        const inputs = document.querySelectorAll('input[type="text"], input[readonly], textarea');
        let linkUrl = '';
        let pwd = '';

        for (let input of inputs) {
            if (!isVisible(input)) continue;
            const val = input.value.trim();

            if (val.includes('pan.baidu.com/s/')) {
                linkUrl = val;
            }
            else if (val.length === 4 && /^[a-zA-Z0-9]+$/.test(val) && !val.includes('http')) {
                pwd = val;
            }
        }

        if (linkUrl) {
            let cleanLink = linkUrl;
            if (!cleanLink.includes('pwd=') && pwd) {
                cleanLink += '?pwd=' + pwd;
            }
            const siteConfig = sitePatterns.find(s => s.name === '百度网盘');

            if (cleanLink !== lastCopiedText) {
                doCopy(cleanLink, '百度网盘', true, siteConfig);
                return true;
            }
        }
        return false;
    }

    // 通用DOM扫描
    function checkDialogAndCopy() {
        if (checkBaiduSpecial()) return;

        // 扩大扫描范围，包括 span 和 p，防止部分网站链接不是 input
        const linkContainers = document.querySelectorAll(`
            input[value*="http"], textarea,
            div[class*="url"], div[class*="link"], .share-url,
            .ant-input, .el-input__inner,
            p, span
        `);

        for (let el of linkContainers) {
            if (!isVisible(el)) continue;
            // 获取文本，如果是 input 取 value，否则取 innerText
            let text = el.value || el.innerText || '';
            if (!text || text.length < 10) continue;

            // 简单校验是否包含目标域名
            const isTarget = sitePatterns.some(site => text.includes(site.domain));
            if (!isTarget) continue;

            const result = getCleanLinkInfo(text);
            if (result && result.cleanLink !== lastCopiedText) {
                doCopy(result.cleanLink, result.type, true, result.config);
                break;
            }
        }
    }

    function getCleanLinkInfo(text) {
        if (!text) return null;
        for (let site of sitePatterns) {
            if (site.name === '百度网盘' && window.location.host.includes('baidu.com')) continue;

            if (window.location.href.includes(site.domain) || text.includes(site.domain)) {
                let cleanLink = '';
                if (site.regex) {
                    const match = text.match(site.regex);
                    if (match) cleanLink = match[1];
                }
                if (cleanLink) return { cleanLink, type: site.name, config: site };
            }
        }
        return null;
    }

    function closeDialogBySelector(selector) {
        if (!selector) return false;
        const selectors = selector.split(',');
        for (let sel of selectors) {
            const btns = document.querySelectorAll(sel.trim());
            for (let btn of btns) {
                if (isVisible(btn)) {
                    if (simulateClick(btn)) return true;
                }
            }
        }
        return false;
    }

    function simulateClick(element) {
        if (!element) return false;
        try {
            // 如果元素被 SVG 或 span 包裹，尝试点击父级
            if (['svg', 'path', 'i', 'span', 'img'].includes(element.tagName.toLowerCase())) {
                const parent = element.closest('button, a, div[role="button"], [class*="btn"], [class*="close"]');
                if (parent) element = parent;
            }
            element.click();
            return true;
        } catch (e) { return false; }
    }

    function pressEscapeKey() {
        const event = new KeyboardEvent('keydown', { key: 'Escape', keyCode: 27, which: 27, bubbles: true });
        document.body.dispatchEvent(event);
        return true;
    }

    function removeMaskLayer() {
        const masks = document.querySelectorAll('.kui-mask, .xl-mask, .ant-modal-mask, [class*="mask"]');
        masks.forEach(mask => isVisible(mask) && mask.remove());
        if (document.body.style.overflow === 'hidden') document.body.style.overflow = '';
    }

    function findAndClickTextButton(keywords) {
        const candidates = document.querySelectorAll('button, div[role="button"], span, a, div[class*="btn"], div[class*="button"]');
        for (let el of candidates) {
            if (!isVisible(el)) continue;
            const text = (el.innerText || el.textContent || '').trim();
            if (text.length > 0 && text.length < 8 && keywords.some(k => text === k)) {
                if (simulateClick(el)) return true;
            }
        }
        return false;
    }

    function forceCloseXunleiWithRetry() {
        const buttons = document.querySelectorAll('.dialog-footer .btn, .kui-button, div[class*="cancel"]');
        for (let btn of buttons) { if (isVisible(btn) && (btn.innerText||'').includes('取消')) simulateClick(btn); }
    }

    function showNotification(message, subtext) {
        const old = document.getElementById('clean-link-notify');
        if (old) old.remove();
        const div = document.createElement('div');
        div.id = 'clean-link-notify';
        div.innerHTML = `<div style="font-weight:bold;">✅ ${message}</div><div style="font-size:12px;opacity:0.8;word-break:break-all;">${subtext}</div>`;
        div.style.cssText = `position:fixed;top:12%;right:20px;background:#06a7ff;color:#fff;padding:12px 20px;border-radius:4px;z-index:2147483647;box-shadow:0 4px 12px rgba(0,0,0,0.15);font-family:sans-serif;pointer-events:none;max-width:300px;`;
        document.body.appendChild(div);
        setTimeout(() => div.remove(), 2500);
    }

    // 监听复制事件
    document.addEventListener('copy', function(e) {
        let text = window.getSelection ? window.getSelection().toString() : '';
        const result = getCleanLinkInfo(text);

        if (result) {
            doCopy(result.cleanLink, result.type, true, result.config);
        } else if (window.location.host.includes('baidu.com')) {
            if (text.includes('pan.baidu.com') && (text.includes('提取码') || text.match(/[a-zA-Z0-9]{4}/))) {
                const urlMatch = text.match(/(https:\/\/pan\.baidu\.com\/s\/[^\s]+)/);
                const pwdMatch = text.match(/提取码[:：]?\s*([a-zA-Z0-9]{4})/);
                if (urlMatch) {
                   let link = urlMatch[1];
                   if (pwdMatch) link += '?pwd=' + pwdMatch[1];
                   doCopy(link, '百度网盘', true, sitePatterns.find(s=>s.name==='百度网盘'));
                }
            }
        }
    }, true);

    const observer = new MutationObserver((mutations) => {
        checkDialogAndCopy();
    });

    setTimeout(() => {
        observer.observe(document.body, { childList: true, subtree: true });
        checkDialogAndCopy();
    }, 1500);

})();