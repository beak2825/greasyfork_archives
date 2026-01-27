// ==UserScript==
// @name         Scribd Downloader
// @namespace    https://github.com/ThanhNguyxn/scribd-downloader
// @version      2.3.2
// @description  📚 Download documents from Scribd for free as PDF - Fully automated!
// @author       ThanhNguyxn
// @match        https://www.scribd.com/*
// @icon         https://www.scribd.com/favicon.ico
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @grant        GM_openInTab
// @run-at       document-idle
// @license      MIT
// @homepageURL  https://github.com/ThanhNguyxn/scribd-downloader
// @supportURL   https://github.com/ThanhNguyxn/scribd-downloader/issues
// @downloadURL https://update.greasyfork.org/scripts/557768/Scribd%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/557768/Scribd%20Downloader.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const BUTTON_DELAY = 1500;
    const GITHUB_URL = 'https://github.com/ThanhNguyxn/scribd-downloader';
    const SPONSOR_URL = 'https://github.com/sponsors/ThanhNguyxn';
    const DONATE_URL = 'https://buymeacoffee.com/thanhnguyxn';

    const styles = `
        #sd-floating-btn {
            position: fixed !important;
            top: 80px !important;
            right: 20px !important;
            z-index: 2147483647 !important;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
            color: white !important;
            border: none !important;
            padding: 12px 20px !important;
            border-radius: 12px !important;
            font-size: 14px !important;
            font-weight: 700 !important;
            cursor: pointer !important;
            box-shadow: 0 4px 15px rgba(102, 126, 234, 0.5) !important;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
            display: flex !important;
            align-items: center !important;
            gap: 8px !important;
            transition: all 0.3s ease !important;
            text-decoration: none !important;
        }

        #sd-floating-btn:hover {
            transform: scale(1.05) !important;
            box-shadow: 0 6px 25px rgba(102, 126, 234, 0.6) !important;
        }

        #sd-floating-btn:active {
            transform: scale(0.98) !important;
        }

        #sd-floating-btn.loading {
            background: linear-gradient(135deg, #ffa726 0%, #fb8c00 100%) !important;
            pointer-events: none !important;
        }

        #sd-popup {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            width: 100% !important;
            height: 100% !important;
            background: rgba(0,0,0,0.85) !important;
            z-index: 2147483647 !important;
            display: flex !important;
            justify-content: center !important;
            align-items: center !important;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease !important;
        }

        #sd-popup.show {
            opacity: 1 !important;
            visibility: visible !important;
        }

        #sd-popup-content {
            background: white !important;
            padding: 30px !important;
            border-radius: 20px !important;
            max-width: 420px !important;
            width: 90% !important;
            text-align: center !important;
            box-shadow: 0 25px 80px rgba(0,0,0,0.4) !important;
            transform: scale(0.9);
            transition: transform 0.3s ease !important;
        }

        #sd-popup.show #sd-popup-content {
            transform: scale(1) !important;
        }

        #sd-popup h2 {
            margin: 0 0 20px 0 !important;
            color: #333 !important;
            font-size: 22px !important;
            font-weight: 700 !important;
        }

        #sd-url-display {
            background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%) !important;
            color: #00d9ff !important;
            padding: 15px !important;
            border-radius: 10px !important;
            font-family: 'Monaco', 'Consolas', monospace !important;
            font-size: 12px !important;
            word-break: break-all !important;
            margin: 15px 0 !important;
            text-align: left !important;
            border: 2px solid #667eea !important;
            user-select: all !important;
            cursor: text !important;
        }

        .sd-btn {
            padding: 12px 24px !important;
            border: none !important;
            border-radius: 10px !important;
            font-size: 14px !important;
            font-weight: 600 !important;
            cursor: pointer !important;
            transition: all 0.2s ease !important;
            margin: 5px !important;
            text-decoration: none !important;
            display: inline-flex !important;
            align-items: center !important;
            gap: 6px !important;
        }

        .sd-btn-primary {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
            color: white !important;
        }

        .sd-btn-success {
            background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%) !important;
            color: white !important;
        }

        .sd-btn-warning {
            background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%) !important;
            color: white !important;
        }

        .sd-btn-close {
            background: #e0e0e0 !important;
            color: #333 !important;
        }

        .sd-btn:hover {
            transform: scale(1.05) !important;
            box-shadow: 0 5px 20px rgba(0,0,0,0.2) !important;
        }

        .sd-info {
            background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%) !important;
            border-left: 4px solid #4caf50 !important;
            padding: 12px 15px !important;
            margin: 15px 0 !important;
            border-radius: 0 10px 10px 0 !important;
            text-align: left !important;
            font-size: 13px !important;
            color: #2e7d32 !important;
        }

        .sd-btn-group {
            display: flex !important;
            gap: 8px !important;
            justify-content: center !important;
            flex-wrap: wrap !important;
            margin-top: 15px !important;
        }

        .sd-links {
            margin-top: 20px !important;
            padding-top: 15px !important;
            border-top: 1px solid #eee !important;
            display: flex !important;
            justify-content: center !important;
            gap: 15px !important;
        }

        .sd-link {
            color: #666 !important;
            text-decoration: none !important;
            font-size: 12px !important;
            display: flex !important;
            align-items: center !important;
            gap: 5px !important;
            transition: color 0.2s !important;
        }

        .sd-link:hover {
            color: #667eea !important;
        }

        #sd-download-btn {
            position: fixed !important;
            top: 20px !important;
            right: 20px !important;
            z-index: 2147483647 !important;
            background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%) !important;
            color: white !important;
            border: none !important;
            padding: 14px 24px !important;
            border-radius: 12px !important;
            font-size: 15px !important;
            font-weight: 700 !important;
            cursor: pointer !important;
            box-shadow: 0 4px 15px rgba(17, 153, 142, 0.5) !important;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
            display: flex !important;
            align-items: center !important;
            gap: 8px !important;
            transition: all 0.3s ease !important;
        }

        #sd-download-btn:hover {
            transform: scale(1.05) !important;
            box-shadow: 0 6px 25px rgba(17, 153, 142, 0.6) !important;
        }

        #sd-download-btn.loading {
            background: linear-gradient(135deg, #ffa726 0%, #fb8c00 100%) !important;
        }

        #sd-progress-popup {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            width: 100% !important;
            height: 100% !important;
            background: rgba(0,0,0,0.9) !important;
            z-index: 2147483647 !important;
            display: flex !important;
            justify-content: center !important;
            align-items: center !important;
        }

        #sd-progress-content {
            background: white !important;
            padding: 35px !important;
            border-radius: 20px !important;
            text-align: center !important;
            min-width: 320px !important;
        }

        #sd-progress-bar {
            width: 100% !important;
            height: 10px !important;
            background: #e0e0e0 !important;
            border-radius: 10px !important;
            overflow: hidden !important;
            margin: 20px 0 !important;
        }

        #sd-progress-fill {
            height: 100% !important;
            background: linear-gradient(90deg, #667eea, #764ba2) !important;
            width: 0% !important;
            transition: width 0.3s ease !important;
            border-radius: 10px !important;
        }

        #sd-progress-text {
            color: #666 !important;
            font-size: 15px !important;
            margin-bottom: 10px !important;
        }
    `;

    const styleEl = document.createElement('style');
    styleEl.textContent = styles;
    document.head.appendChild(styleEl);

    function getDocId() {
        const url = window.location.href;
        const match = url.match(/(?:document|doc|embeds|read|presentation)\/(\d+)/);
        return match ? match[1] : null;
    }

    function isEmbed() {
        return window.location.href.includes('/embeds/');
    }

    function getEmbedUrl(id) {
        return `https://www.scribd.com/embeds/${id}/content`;
    }

    function copyText(text) {
        try {
            if (typeof GM_setClipboard === 'function') {
                GM_setClipboard(text, 'text');
                return true;
            }
        } catch (e) { }

        try {
            navigator.clipboard.writeText(text);
            return true;
        } catch (e) { }

        try {
            const ta = document.createElement('textarea');
            ta.value = text;
            ta.style.cssText = 'position:fixed;top:-9999px;left:-9999px';
            document.body.appendChild(ta);
            ta.select();
            document.execCommand('copy');
            ta.remove();
            return true;
        } catch (e) { }

        return false;
    }

    function sleep(ms) {
        return new Promise(r => setTimeout(r, ms));
    }

    function showMainButton() {
        if (document.getElementById('sd-floating-btn')) return;

        const docId = getDocId();
        if (!docId) return;

        const btn = document.createElement('button');
        btn.id = 'sd-floating-btn';
        btn.innerHTML = '📥 Download PDF';
        btn.onclick = startAutoDownload;
        document.body.appendChild(btn);
    }

    async function startAutoDownload() {
        const btn = document.getElementById('sd-floating-btn');
        const docId = getDocId();

        if (!docId) {
            alert('Cannot find document ID!');
            return;
        }

        const embedUrl = getEmbedUrl(docId);

        btn.classList.add('loading');
        btn.innerHTML = '⏳ Opening...';

        showAutoPopup(embedUrl);
    }

    function showAutoPopup(embedUrl) {
        const existing = document.getElementById('sd-popup');
        if (existing) existing.remove();

        const popup = document.createElement('div');
        popup.id = 'sd-popup';
        popup.innerHTML = `
            <div id="sd-popup-content">
                <h2>📚 Scribd Downloader</h2>
                
                <div class="sd-info">
                    ✨ <strong>Auto mode:</strong> Opening embed page in new tab...
                </div>

                <div id="sd-url-display">${embedUrl}</div>

                <p style="color: #666; font-size: 13px; margin: 15px 0;">
                    A new tab will open automatically.<br>
                    Click the <strong style="color: #11998e;">green button</strong> there to download!
                </p>

                <div class="sd-btn-group">
                    <button class="sd-btn sd-btn-success" id="sd-open-now">🚀 Open Now</button>
                    <button class="sd-btn sd-btn-warning" id="sd-open-incognito">🕵️ Manual (Incognito)</button>
                    <button class="sd-btn sd-btn-close" id="sd-close-btn">Close</button>
                </div>

                <div class="sd-links">
                    <a href="${GITHUB_URL}" target="_blank" class="sd-link">⭐ GitHub</a>
                    <a href="${SPONSOR_URL}" target="_blank" class="sd-link">💖 Sponsor</a>
                    <a href="${DONATE_URL}" target="_blank" class="sd-link">☕ Buy me a coffee</a>
                </div>
            </div>
        `;

        document.body.appendChild(popup);

        requestAnimationFrame(() => {
            popup.classList.add('show');
        });

        const autoTimer = setTimeout(() => {
            openEmbedPage(embedUrl);
        }, 1500);

        document.getElementById('sd-open-now').onclick = function () {
            clearTimeout(autoTimer);
            openEmbedPage(embedUrl);
        };

        document.getElementById('sd-open-incognito').onclick = function () {
            clearTimeout(autoTimer);
            copyText(embedUrl);
            this.innerHTML = '✅ URL Copied!';
            showManualInstructions();
        };

        document.getElementById('sd-close-btn').onclick = function () {
            clearTimeout(autoTimer);
            closePopup();
        };

        popup.onclick = function (e) {
            if (e.target === popup) {
                clearTimeout(autoTimer);
                closePopup();
            }
        };
    }

    function openEmbedPage(url) {
        if (typeof GM_openInTab === 'function') {
            GM_openInTab(url, { active: false, insert: true, setParent: true });
        } else {
            const newTab = window.open(url, '_blank');
            if (newTab) {
                window.focus();
            }
        }

        const btn = document.getElementById('sd-floating-btn');
        if (btn) {
            btn.classList.remove('loading');
            btn.innerHTML = '✅ Opened!';
            setTimeout(() => {
                btn.innerHTML = '📥 Download PDF';
            }, 3000);
        }

        const popupContent = document.getElementById('sd-popup-content');
        if (popupContent) {
            popupContent.innerHTML = `
                <h2>✅ Tab Opened!</h2>
                
                <div class="sd-info" style="background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%) !important;">
                    🎉 <strong>Success!</strong> A new tab has been opened in the background.
                </div>

                <p style="color: #666; font-size: 13px; margin: 15px 0;">
                    📌 <strong>Next steps:</strong><br>
                    1. Switch to the new tab<br>
                    2. Click the <strong style="color: #11998e;">green Download button</strong><br>
                    3. Wait for all pages to load<br>
                    4. Save as PDF
                </p>

                <div class="sd-btn-group">
                    <button class="sd-btn sd-btn-close" id="sd-close-btn2">Got it!</button>
                </div>

                <div class="sd-links">
                    <a href="${GITHUB_URL}" target="_blank" class="sd-link">⭐ GitHub</a>
                    <a href="${SPONSOR_URL}" target="_blank" class="sd-link">💖 Sponsor</a>
                    <a href="${DONATE_URL}" target="_blank" class="sd-link">☕ Buy me a coffee</a>
                </div>

                <p style="color: #999; font-size: 11px; margin-top: 15px;">
                    Made with ❤️ by <a href="${GITHUB_URL}" target="_blank" style="color: #667eea;">ThanhNguyxn</a>
                </p>
            `;

            const closeBtn2 = document.getElementById('sd-close-btn2');
            if (closeBtn2) {
                closeBtn2.onclick = closePopup;
            }
        }
    }

    function showManualInstructions() {
        const content = document.getElementById('sd-popup-content');
        if (!content) return;

        content.innerHTML = `
            <h2>🕵️ Manual Mode</h2>
            
            <div class="sd-info">
                ✅ <strong>URL copied!</strong> Follow these steps:
            </div>

            <ol style="text-align: left; color: #444; line-height: 1.8; padding-left: 20px; margin: 20px 0;">
                <li>Press <strong>Ctrl+Shift+N</strong> (Incognito window)</li>
                <li>Paste the URL (<strong>Ctrl+V</strong>)</li>
                <li>Press <strong>Enter</strong></li>
                <li>Click the <strong style="color: #11998e;">green Download button</strong></li>
            </ol>

            <div class="sd-btn-group">
                <button class="sd-btn sd-btn-close" id="sd-close-btn2">Got it!</button>
            </div>

            <div class="sd-links">
                <a href="${GITHUB_URL}" target="_blank" class="sd-link">⭐ GitHub</a>
                <a href="${SPONSOR_URL}" target="_blank" class="sd-link">💖 Sponsor</a>
                <a href="${DONATE_URL}" target="_blank" class="sd-link">☕ Buy me a coffee</a>
            </div>
        `;

        document.getElementById('sd-close-btn2').onclick = closePopup;
    }

    function closePopup() {
        const popup = document.getElementById('sd-popup');
        const btn = document.getElementById('sd-floating-btn');

        if (popup) {
            popup.classList.remove('show');
            setTimeout(() => popup.remove(), 300);
        }

        if (btn) {
            btn.classList.remove('loading');
            btn.innerHTML = '📥 Download PDF';
        }
    }

    function showEmbedButton() {
        if (document.getElementById('sd-download-btn')) return;

        const btn = document.createElement('button');
        btn.id = 'sd-download-btn';
        btn.innerHTML = '⬇️ Download PDF';
        btn.onclick = startDownload;
        document.body.appendChild(btn);

        if (document.referrer.includes('scribd.com')) {
            setTimeout(() => {
                const autoBtn = document.getElementById('sd-download-btn');
                if (autoBtn && !autoBtn.classList.contains('loading')) {
                    autoBtn.innerHTML = '🚀 Starting...';
                    setTimeout(startDownload, 500);
                }
            }, 2000);
        }
    }

    async function startDownload() {
        const btn = document.getElementById('sd-download-btn');
        btn.classList.add('loading');
        btn.innerHTML = '⏳ Processing...';

        const progress = document.createElement('div');
        progress.id = 'sd-progress-popup';
        progress.innerHTML = `
            <div id="sd-progress-content">
                <h2>📚 Preparing PDF...</h2>
                <div id="sd-progress-text">Loading pages...</div>
                <div id="sd-progress-bar">
                    <div id="sd-progress-fill"></div>
                </div>
                <p style="color: #888; font-size: 12px; margin-top: 15px;">
                    Please wait, this may take a moment...
                </p>
            </div>
        `;
        document.body.appendChild(progress);

        const fill = document.getElementById('sd-progress-fill');
        const text = document.getElementById('sd-progress-text');

        try {
            text.textContent = '📄 Loading all pages...';

            const scrollContainer = document.querySelector('.document_scroller');
            
            const pageContainer = document.querySelector('.outer_page_container') || 
                                  document.querySelector('.autogen_class_views_EmbedDocument') ||
                                  document.body;
            
            const pages = pageContainer.querySelectorAll('.outer_page, .page');
            console.log(`[Scribd Downloader] Found ${pages.length} pages`);

            if (pages.length > 0) {
                for (let i = 0; i < pages.length; i++) {
                    pages[i].scrollIntoView({ behavior: 'instant', block: 'start' });

                    if (scrollContainer) {
                        scrollContainer.scrollTop = pages[i].offsetTop;
                    }

                    await sleep(500);

                    const pct = Math.round(((i + 1) / pages.length) * 50);
                    fill.style.width = pct + '%';
                    text.textContent = `📄 Loading page ${i + 1}/${pages.length}...`;
                }
            } else {
                console.log('[Scribd Downloader] No pages found, using fallback scroll');
                const container = scrollContainer || document.documentElement;
                const totalHeight = container.scrollHeight;
                const viewportHeight = window.innerHeight;
                const steps = Math.ceil(totalHeight / viewportHeight);
                
                for (let i = 0; i <= steps; i++) {
                    const scrollPos = viewportHeight * i;
                    if (scrollContainer) {
                        scrollContainer.scrollTop = scrollPos;
                    }
                    window.scrollTo(0, scrollPos);
                    await sleep(300);
                    fill.style.width = Math.round((i / steps) * 50) + '%';
                }
            }

            console.log('[Scribd Downloader] Finished scrolling');

            fill.style.width = '60%';
            text.textContent = '🧹 Removing UI elements...';
            await sleep(200);

            const cleanupSelectors = [
                '.toolbar_drop',
                '.mobile_overlay',
                '.promo_banner',
                '.auto_scribd_download_banner',
                '.inter_pages_container',
                '.missing_page_buy_link',
                '#global_header',
                '.page_missing_explanation',
                '.toolbar_top',
                '.toolbar_bottom',
                '.promo_div',
                '.ReactModalPortal',
                '.between_page_module',
                '.auto_doc_domain_name',
                '.global_wrapper_header'
            ];

            cleanupSelectors.forEach(selector => {
                try {
                    document.querySelectorAll(selector).forEach(el => el.remove());
                } catch (e) { }
            });

            fill.style.width = '70%';
            text.textContent = '🧹 Fixing layout...';
            await sleep(200);

            const scrollers = document.querySelectorAll('.document_scroller');
            scrollers.forEach(el => {
                el.classList.remove('document_scroller');
                el.style.overflow = 'visible';
                el.style.height = 'auto';
                el.style.maxHeight = 'none';
                el.style.position = 'relative';
            });

            document.body.style.overflow = 'visible';
            document.body.style.height = 'auto';
            document.documentElement.style.overflow = 'visible';

            fill.style.width = '90%';
            text.textContent = '✨ Preparing for print...';
            await sleep(200);

            const printStyles = document.createElement('style');
            printStyles.id = 'sd-print-styles';
            printStyles.textContent = `
                @media print {
                    .toolbar_top, .toolbar_bottom, .toolbar_drop,
                    #sd-download-btn, #sd-progress-popup, #sd-floating-btn {
                        display: none !important;
                    }
                    
                    @page {
                        margin: 0;
                    }
                    
                    .outer_page, .page {
                        page-break-after: always;
                        page-break-inside: avoid;
                    }
                    .outer_page:last-child, .page:last-child {
                        page-break-after: auto;
                    }
                }
            `;
            document.head.appendChild(printStyles);

            window.scrollTo(0, 0);
            if (scrollContainer) {
                scrollContainer.scrollTop = 0;
            }

            fill.style.width = '100%';
            text.textContent = '✅ Ready! Opening print dialog...';
            await sleep(500);

            progress.remove();

            if (btn) {
                btn.remove();
            }

            window.print();

            const newBtn = document.createElement('button');
            newBtn.id = 'sd-download-btn';
            newBtn.innerHTML = '✅ Done! Print again?';
            newBtn.onclick = startDownload;
            document.body.appendChild(newBtn);

            setTimeout(() => {
                const b = document.getElementById('sd-download-btn');
                if (b) b.innerHTML = '⬇️ Download PDF';
            }, 5000);

        } catch (err) {
            console.error('[Scribd Downloader] Download error:', err);
            progress.remove();
            btn.classList.remove('loading');
            btn.innerHTML = '❌ Error - Try again';

            setTimeout(() => {
                btn.innerHTML = '⬇️ Download PDF';
            }, 3000);
        }
    }

    function init() {
        if (!window.location.hostname.includes('scribd.com')) return;

        setTimeout(() => {
            if (isEmbed()) {
                showEmbedButton();
            } else if (getDocId()) {
                showMainButton();
            }
        }, BUTTON_DELAY);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
