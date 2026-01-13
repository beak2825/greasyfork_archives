// ==UserScript==
// @name         软件No1 最终完美版 (v8.4 标签布局修复)
// @namespace    http://tampermonkey.net/
// @version      8.4
// @description  1. 修复标签区域宽度限制 2. 自动提取并美化下载链接 3. 拦截内容清空 4. 锁死CSS防白屏 5. 彻底清理广告
// @author       Gemini
// @match        https://www.rjno1.com/*
// @run-at       document-start
// @grant        GM_addStyle
// @connect      self
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/562329/%E8%BD%AF%E4%BB%B6No1%20%E6%9C%80%E7%BB%88%E5%AE%8C%E7%BE%8E%E7%89%88%20%28v84%20%E6%A0%87%E7%AD%BE%E5%B8%83%E5%B1%80%E4%BF%AE%E5%A4%8D%29.user.js
// @updateURL https://update.greasyfork.org/scripts/562329/%E8%BD%AF%E4%BB%B6No1%20%E6%9C%80%E7%BB%88%E5%AE%8C%E7%BE%8E%E7%89%88%20%28v84%20%E6%A0%87%E7%AD%BE%E5%B8%83%E5%B1%80%E4%BF%AE%E5%A4%8D%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('%c [净化] v8.4 标签修复版启动...', 'color: #00bcd4; font-weight: bold;');

    // ==========================================
    // 1. CSS 保护盾 + 深度界面净化
    // ==========================================
    const css = `
        /* 确保主内容可见 */
        #main-full, .content-area, .site-main, main, #hio08, .hio07c, #hio3f, .hio7fc {
            display: block !important;
            visibility: visible !important;
            opacity: 1 !important;
        }
        /* 隐藏残留的检测提示框 */
        [id^="xc"], [id^="xcd"], [id^="ch"] {
             display: none !important;
        }
        /* 确保滚动条可用 */
        body, html {
            overflow: auto !important;
        }
        /* 搜索框样式修正 */
        #mokuai-search-id form {
            display: block !important;
            visibility: visible !important;
        }

        /* === 【新增】修复标签区域宽度限制 === */
        /* 原本限制了350px导致右侧留白，现在让它铺满 */
        .single-tags, .single-tags ul {
            max-width: 100% !important;
            width: auto !important;
            float: none !important; /* 取消浮动，防止排版错乱 */
        }

        /* === 移除所有指定的空白广告位 === */
        .juanzeng, .hioe4, .hio43, .hio09, .hio8d, .hiod8,
        .hio22, .hio05, .hio51, .hioe2, .hio14, .hio4d,
        .rjno1-app, .hio73, .hioaa, .hio46, .hioc2
        {
            display: none !important;
            height: 0 !important;
            margin: 0 !important;
            padding: 0 !important;
            visibility: hidden !important;
        }
    `;

    if (typeof GM_addStyle !== 'undefined') {
        GM_addStyle(css);
    } else {
        const style = document.createElement('style');
        style.innerText = css;
        (document.head || document.documentElement).appendChild(style);
    }

    // ==========================================
    // 2. 自动提取下载链接 (高度与布局完美版)
    // ==========================================
    const fetchRealDownloadLinks = () => {
        const btnContainer = document.getElementById('dl-buttom-id-for-js');
        if (!btnContainer || btnContainer.querySelector('.attachment-download-link-wrap')) return;

        const linkBtn = btnContainer.querySelector('a');
        if (linkBtn && linkBtn.href && linkBtn.href.includes('/download-')) {
            const targetUrl = linkBtn.href;
            const originalText = linkBtn.innerText;

            linkBtn.innerText = '⏳ 正在获取下载地址...';
            linkBtn.style.opacity = '0.7';

            fetch(targetUrl)
                .then(response => response.text())
                .then(html => {
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(html, 'text/html');
                    const realLinks = doc.querySelector('.attachment-download-link-wrap');

                    if (realLinks) {
                        // === 外层容器重置 ===
                        btnContainer.style.cssText = `
                            float: none !important;
                            clear: both !important;
                            width: 100% !important;
                            display: block !important;
                            height: auto !important;
                            border: none !important;
                            background: none !important;
                            box-shadow: none !important;
                            margin-top: 10px !important;
                            padding: 0 !important;
                        `;

                        // === 内层容器重置 ===
                        realLinks.style.cssText = `
                            background: transparent !important;
                            padding: 0 !important;
                            border: none !important;
                            text-align: left !important;
                            margin-top: 5px !important;
                            min-height: 0 !important;
                            height: auto !important;
                            width: 100% !important;
                            float: none !important;
                        `;

                        // 修正列表样式
                        const listItems = realLinks.querySelectorAll('li');
                        listItems.forEach(li => {
                            li.style.listStyle = 'none';
                            li.style.margin = '2px 0';
                            li.style.fontSize = '15px';
                            li.style.lineHeight = '1.8';
                        });

                        // 修正标题样式
                        const title = realLinks.querySelector('h4');
                        if(title) {
                            title.style.fontSize = '16px';
                            title.style.fontWeight = 'bold';
                            title.style.marginBottom = '5px';
                            title.style.color = '#d32f2f';
                            title.style.borderBottom = '1px solid #eee';
                            title.style.paddingBottom = '5px';
                            title.style.display = 'inline-block';
                        }

                        // 渲染内容
                        btnContainer.innerHTML = '';
                        btnContainer.appendChild(realLinks);
                    } else {
                        linkBtn.innerText = '获取失败，请手动下载';
                    }
                })
                .catch(err => {
                    linkBtn.innerText = originalText;
                });
        }
    };

    document.addEventListener('DOMContentLoaded', fetchRealDownloadLinks);
    window.addEventListener('load', fetchRealDownloadLinks);

    // ==========================================
    // 3. 强行恢复搜索框 HTML
    // ==========================================
    const restoreSearchBox = () => {
        const searchDiv = document.getElementById('mokuai-search-id') || document.querySelector('.search-form-wrap');
        if (searchDiv && (searchDiv.innerText.includes('检测中') || searchDiv.innerText.includes('广告'))) {
            searchDiv.innerHTML = `
                <form role="search" method="get" class="search-form" action="https://www.rjno1.com/" itemprop="potentialAction" itemscope itemtype="http://schema.org/SearchAction">
                    <meta itemprop="target" content="https://www.rjno1.com/?s=search%20"/>
                    <span class="screen-reader-text">搜索：</span>
                    <i class="fa fa-search"></i>
                    <input type="search" class="search-field" placeholder="搜索 …" value="" name="s" title="Search" required itemprop="query-input">
                    <button type="submit" class="search-submit"> <span>搜索</span> </button>
                </form>
                <div class="clear"></div>
            `;
        }
    };
    document.addEventListener('DOMContentLoaded', restoreSearchBox);
    setInterval(restoreSearchBox, 1500);

    // ==========================================
    // 4. 拦截 innerHTML 篡改
    // ==========================================
    try {
        const originalInnerHtmlDescriptor = Object.getOwnPropertyDescriptor(Element.prototype, 'innerHTML');
        const originalSet = originalInnerHtmlDescriptor.set;
        Object.defineProperty(Element.prototype, 'innerHTML', {
            set: function (htmlContent) {
                if (typeof htmlContent === 'string') {
                    const cleanContent = htmlContent.replace(/[`]/g, '');
                    if (cleanContent.includes('banana detect') ||
                        cleanContent.includes('禁用广告屏蔽') ||
                        cleanContent.includes('Please disable your ad blocker')) {
                        if (this.id && (this.id.startsWith('xc') || this.id.startsWith('ch'))) {
                             this.style.display = 'none';
                        }
                        return;
                    }
                }
                originalSet.call(this, htmlContent);
            },
            get: originalInnerHtmlDescriptor.get
        });
    } catch (e) {}

    // ==========================================
    // 5. 防御性措施 (CSS锁 & 伪造环境)
    // ==========================================
    try {
        const styleSheetProto = CSSStyleSheet.prototype;
        const originalDisabled = Object.getOwnPropertyDescriptor(styleSheetProto, 'disabled');
        Object.defineProperty(styleSheetProto, 'disabled', {
            get: function() { return originalDisabled ? originalDisabled.get.call(this) : false; },
            set: function(val) { if (val === true) return; if (originalDisabled) originalDisabled.set.call(this, val); },
            configurable: false
        });
    } catch(e) {}

    window.google_global_correlator = true;
    window.google_image_requests = [];
    document.addEventListener('DOMContentLoaded', () => {
        if (!document.getElementById('aswift_1_host')) {
            const fakeAd = document.createElement('div');
            fakeAd.id = 'aswift_1_host';
            fakeAd.style.cssText = 'width: 300px !important; height: 250px !important; position: absolute; top: -9999px;';
            document.body.appendChild(fakeAd);
        }
    });

})();