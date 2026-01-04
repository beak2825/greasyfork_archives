// ==UserScript==
// @name         WebMultitool
// @namespace    http://tampermonkey.net/
// @version      6.3.2
// @description  Adaptive compact panel with buttons and widgets
// @author       allu_b 
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/553945/WebMultitool.user.js
// @updateURL https://update.greasyfork.org/scripts/553945/WebMultitool.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ========== CONFIGURATION ========== //
    const favoritesConfig = [
        { text: '4pda', url: 'https://examle.com', icon: 'https://www.google.com/s2/favicons?domain=examle.com&sz=64' },
        { text: 'Speed', url: 'https://fast.com', icon: 'https://www.google.com/s2/favicons?domain=fast.com&sz=64' },
        
    ];

    const aiConfig = [
        { text: 'Mistral', url: 'https://chat.mistral.ai/chat', icon: 'https://www.google.com/s2/favicons?domain=mistral.ai&sz=64' },
        { text: 'DeepSeek', url: 'https://chat.deepseek.com', icon: 'https://www.google.com/s2/favicons?domain=deepseek.com&sz=64' },
        { text: 'Perplexity', url: 'https://www.perplexity.ai/', icon: 'https://www.google.com/s2/favicons?domain=perplexity.com&sz=64' },
        { text: 'ChatGPT', url: 'https://chatgpt.com/', icon: 'https://www.google.com/s2/favicons?domain=openai.com&sz=64' },
        { text: 'Gemini', url: 'https://gemini.google.com/app', icon: 'https://www.google.com/s2/favicons?domain=google.com&sz=64' },
        { text: 'Claude', url: 'https://claude.ai', icon: 'https://www.google.com/s2/favicons?domain=claude.ai&sz=64' },
        { text: 'Grok', url: 'https://grok.com/', icon: 'https://www.google.com/s2/favicons?domain=x.ai&sz=64' },
        { text: 'Polybuzz', url: 'https://www.polybuzz.ai/ru/virtual-assistant', icon: 'https://www.google.com/s2/favicons?domain=polybuzz.ai&sz=64' }
    ];

    const proxyConfig = [
        { text: 'CroxyProxy', url: 'https://www.croxyproxy.com/', icon: 'https://www.google.com/s2/favicons?domain=croxyproxy.com&sz=64' },
        { text: 'Lablancer', url: 'https://www.lablancer.com/?C=D;O=A', icon: 'https://www.google.com/s2/favicons?domain=lablancer.com&sz=64' },
        { text: 'Proxyium', url: 'https://proxyium.com/', icon: 'https://www.google.com/s2/favicons?domain=proxyium.com&sz=64' },
        { text: 'ProxyPal', url: 'https://proxypal.net/', icon: 'https://www.google.com/s2/favicons?domain=proxypal.net&sz=64' },
        { text: 'ProxyOrb', url: 'https://proxyorb.com/ru', icon: 'https://www.google.com/s2/favicons?domain=proxyorb.com&sz=64' },
        { text: 'VPNBook', url: 'https://www.vpnbook.com/webproxy', icon: 'https://www.google.com/s2/favicons?domain=vpnbook.com&sz=64' }
    ];

    const networkTools = [
        { text: 'Ping', url: 'https://ping.eu/ping/', icon: 'https://www.google.com/s2/favicons?domain=ping.eu&sz=64' },
        { text: 'Whois', url: 'https://whois.com/', icon: 'https://www.google.com/s2/favicons?domain=whois.com&sz=64' },
        { text: 'DNS Lookup', url: 'https://www.nslookup.io/', icon: 'https://www.google.com/s2/favicons?domain=nslookup.io&sz=64' },
        { text: 'SSL Check', url: 'https://www.sslshopper.com/ssl-checker.html', icon: 'https://www.google.com/s2/favicons?domain=sslshopper.com&sz=64' },
        { text: 'IP Info', url: 'https://ipinfo.io/', icon: 'https://www.google.com/s2/favicons?domain=ipinfo.io&sz=64' },
        { text: 'BrowserLeaks', url: 'https://browserleaks.com/', icon: 'https://www.google.com/s2/favicons?domain=browserleaks.com&sz=64' },
        { text: 'IP Leak', url: 'https://ipleak.net/', icon: 'https://www.google.com/s2/favicons?domain=ipleak.net&sz=64' },
        { text: 'SpeedTest', url: 'https://speedsmart.net/', icon: 'https://www.google.com/s2/favicons?domain=speedsmart.net&sz=64' },
        { text: 'CheckAdBlock', url: 'https://checkadblock.ru/', icon: 'https://www.google.com/s2/favicons?domain=checkadblock.ru&sz=64' }
    ];

    const utilities = [
        { text: 'QR Generator', url: 'https://qr-code-generator.com/', icon: 'https://www.google.com/s2/favicons?domain=qr-code-generator.com&sz=64' },
        { text: 'URL Shortener', url: 'https://tinyurl.com/app', icon: 'https://www.google.com/s2/favicons?domain=tinyurl.com&sz=64' },
        { text: 'Base64 Encode', url: 'https://www.base64encode.org/ru/', icon: 'https://www.google.com/s2/favicons?domain=base64encode.org&sz=64' },
        { text: 'RegEx Tester', url: 'https://regex101.com/', icon: 'https://www.google.com/s2/favicons?domain=regex101.com&sz=64' }
    ];

    const webrtcChats = [
        { text: 'Jitsi Meet', url: 'https://meet.jit.si/', icon: 'https://www.google.com/s2/favicons?domain=meet.jit.si&sz=64' },
        { text: 'PeerCalls', url: 'https://peercalls.com/', icon: 'https://www.google.com/s2/favicons?domain=peercalls.com&sz=64' },
        { text: 'Talky', url: 'https://talky.io/', icon: 'https://www.google.com/s2/favicons?domain=talky.io&sz=64' }
    ];

    const devToolsConfig = [
        { text: 'Viewport Info', action: 'viewportInfo' },
        { text: 'Outline All', action: 'outlineAll' },
        { text: 'Flexbox Debug', action: 'flexboxDebug' },
        { text: 'Grid Debug', action: 'gridDebug' },
        { text: 'Performance', action: 'performanceMonitor' },
        { text: 'LocalStorage', action: 'localStorageManager' },
        { text: 'Color Picker', action: 'colorPicker' },
        { text: 'Page Analyzer', action: 'pageAnalyzer' },
        { text: 'IcoGrabber', action: 'icoGrabber' },
        { text: 'Encoding', action: 'encoding' }
    ];

    const amoledConfig = [
        { text: 'Grayscale', action: 'grayscale' },
        { text: 'MobFriendly', action: 'mobFriendly' }
    ];
    
    const translateEngines = [
        { text: 'Google Translate', url: 'https://translate.google.com/translate?hl=ru&sl=auto&tl=ru&u=', icon: 'https://www.google.com/s2/favicons?domain=google.com&sz=64' },
        { text: 'Yandex Translate', url: 'https://translate.yandex.com/translate?url=', icon: 'https://www.google.com/s2/favicons?domain=yandex.ru&sz=64' }
     ];

    // ========== SETTINGS ========== //
    const panelWidth = '18vw';
    const buttonHeight = '4vmax';
    const buttonWidth = '15vw';
    const gapSize = '1.7vh';
    const topMargin = '1.5vh';
    const bottomMargin = '1.5vh';
    let searchWidget = null;
    let searchWidgetVisible = false;
    let currentWidget = null;
    let isNetMonitorActive = false;
    let netMonitorWidget = null;
    let originalPageContent = null;
    let ftpWidget = null;
    let isGrayscaleActive = false;
    let grayscaleObserver = null;
    let isMobFriendlyActive = false;
    const SWIPE_THRESHOLD = 20;
    const HIGHLIGHT_DURATION = 500;
    let isAdBlockActive = false;
    let adBlockStartX = 0, adBlockStartY = 0;

    // ========== COLORS ========== //
    const panelBackground = '#2c3e50';
    const buttonBackground = '#34495e';
    const buttonHoverBackground = '#3d566e';
    const textColor = '#ffffff';

    // ========== PAGE ANALYZER FUNCTION ========== //
    function showPageAnalyzer() {
        const analyzer = document.createElement('div');
        analyzer.id = 'page-analyzer';
        analyzer.style.cssText = `
            position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); 
            background: white; padding: 20px; border-radius: 10px; z-index: 10000; 
            box-shadow: 0 0 25px rgba(0,0,0,0.3); font-family: Arial, sans-serif;
            max-width: 90vw; max-height: 80vh; overflow-y: auto; text-align: center;
        `;
        
        // Collect page information
        const pageInfo = {
            title: document.title || 'No title',
            url: window.location.href,
            description: document.querySelector('meta[name="description"]')?.content || 'No description',
            viewport: document.querySelector('meta[name="viewport"]')?.content || 'Not specified',
            images: document.images.length,
            links: document.links.length,
            scripts: document.scripts.length,
            pageSize: new Blob([document.documentElement.outerHTML]).size,
            doctype: document.doctype ? document.doctype.name : 'Not specified',
            language: document.documentElement.lang || 'Not specified',
            encoding: document.characterSet || 'Not specified'
        };

        analyzer.innerHTML = `
            <div style="position: relative;">
                <button onclick="this.parentElement.parentElement.remove()" 
                        style="position: absolute; top: -10px; right: -10px; background: #e74c3c; color: white; border: none; border-radius: 50%; width: 30px; height: 30px; font-size: 18px; cursor: pointer; display: flex; align-items: center; justify-content: center;">
                    ×
                </button>
                
                <div style="margin-bottom: 20px; font-weight: bold; color: #2c3e50; font-size: 18px;">🔍 Page Analysis</div>
            </div>
            
            <div style="text-align: left; margin-bottom: 15px;">
                <div style="margin-bottom: 8px;"><strong>📄 Title:</strong> ${pageInfo.title}</div>
                <div style="margin-bottom: 8px;"><strong>🌐 URL:</strong> <span style="font-size: 12px; word-break: break-all;">${pageInfo.url}</span></div>
                <div style="margin-bottom: 8px;"><strong>📝 Description:</strong> ${pageInfo.description}</div>
                <div style="margin-bottom: 8px;"><strong>🔤 Language:</strong> ${pageInfo.language}</div>
                <div style="margin-bottom: 8px;"><strong>💾 Encoding:</strong> ${pageInfo.encoding}</div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 20px;">
                <div style="background: #e8f4fd; padding: 10px; border-radius: 5px;">
                    <div style="font-size: 24px; color: #3498db;">${pageInfo.images}</div>
                    <div style="font-size: 12px;">Images</div>
                </div>
                <div style="background: #e8f6f3; padding: 10px; border-radius: 5px;">
                    <div style="font-size: 24px; color: #27ae60;">${pageInfo.links}</div>
                    <div style="font-size: 12px;">Links</div>
                </div>
                <div style="background: #fef9e7; padding: 10px; border-radius: 5px;">
                    <div style="font-size: 24px; color: #f39c12;">${pageInfo.scripts}</div>
                    <div style="font-size: 12px;">Scripts</div>
                </div>
                <div style="background: #fbeeee; padding: 10px; border-radius: 5px;">
                    <div style="font-size: 24px; color: #e74c3c;">${Math.round(pageInfo.pageSize / 1024)} KB</div>
                    <div style="font-size: 12px;">Page Size</div>
                </div>
            </div>

            <div style="margin-bottom: 15px;">
                <button onclick="showSEOAnalysis()" style="padding: 10px 15px; background: #9b59b6; color: white; border: none; border-radius: 5px; cursor: pointer; margin: 5px; font-size: 12px;">SEO Analysis</button>
                <button onclick="showPerformanceInfo()" style="padding: 10px 15px; background: #e67e22; color: white; border: none; border-radius: 5px; cursor: pointer; margin: 5px; font-size: 12px;">Performance</button>
            </div>
        `;

        // SEO analysis function
        window.showSEOAnalysis = function() {
            const seoIssues = [];
            
            // Check title
            if (!document.title || document.title.length < 10) {
                seoIssues.push('❌ Page title is too short');
            }
            if (document.title.length > 60) {
                seoIssues.push('⚠️ Page title is too long');
            }
            
            // Check description
            const metaDesc = document.querySelector('meta[name="description"]');
            if (!metaDesc) {
                seoIssues.push('❌ Missing meta description');
            } else if (metaDesc.content.length < 50) {
                seoIssues.push('❌ Meta description is too short');
            }
            
            // Check h1 headers
            const h1s = document.querySelectorAll('h1');
            if (h1s.length === 0) {
                seoIssues.push('❌ Missing H1 header');
            } else if (h1s.length > 1) {
                seoIssues.push('⚠️ Too many H1 headers');
            }
            
            // Check images without alt
            const imagesWithoutAlt = Array.from(document.images).filter(img => !img.alt).length;
            if (imagesWithoutAlt > 0) {
                seoIssues.push(`⚠️ ${imagesWithoutAlt} images without alt text`);
            }
            
            alert('SEO Analysis:\n\n' + (seoIssues.length > 0 ? seoIssues.join('\n') : '✅ All basic SEO parameters are good!'));
        };

        // Performance info function
        window.showPerformanceInfo = function() {
            const perfInfo = [
                `🕒 Load time: ${Math.round(performance.timing.loadEventEnd - performance.timing.navigationStart)} ms`,
                `📊 Memory usage: ${performance.memory ? Math.round(performance.memory.usedJSHeapSize / 1048576) + ' MB' : 'N/A'}`,
                `🖼️ Images: ${document.images.length}`,
                `📜 Scripts: ${document.scripts.length}`,
                `🎨 Styles: ${document.styleSheets.length}`
            ];
            
            alert('Performance Information:\n\n' + perfInfo.join('\n'));
        };

        document.body.appendChild(analyzer);
        closeCurrentWidget();
    }

    // ========== MOBFRIENDLY FUNCTION ========== //
    function toggleMobFriendly() {
        isMobFriendlyActive = !isMobFriendlyActive;
        if (isMobFriendlyActive) activateMobFriendly();
        else deactivateMobFriendly();
        closeCurrentWidget();
    }

    function activateMobFriendly() {
        const style = document.createElement('style');
        style.id = 'mobfriendly-styles';
        style.textContent = `
            body {
                font-size: 18px !important;
                line-height: 1.6 !important;
                width: 100% !important;
                margin: 0 !important;
                padding: 5px !important;
                background: white !important;
            }

            * {
                background-image: none !important;
                background-color: white !important;
            }

            table {
                width: 100% !important;
                max-width: 100% !important;
                border-collapse: collapse !important;
                font-size: 18px !important;
            }

            td, th {
                padding: 12px !important;
                word-break: break-word !important;
                white-space: normal !important;
                border: 1px solid #ddd !important;
            }

            td *, th * {
                word-break: break-word !important;
                white-space: normal !important;
                font-size: inherit !important;
            }

            button, input[type="button"] {
                min-height: 44px !important;
                padding: 10px !important;
                font-size: 18px !important;
            }
        `;
        document.head.appendChild(style);
        
        // Additional fix for nested tables
        document.querySelectorAll('table table').forEach(table => {
            table.style.width = '100% !important';
        });
    }

    function deactivateMobFriendly() {
        const style = document.getElementById('mobfriendly-styles');
        if (style) style.remove();
    }

    // ========== ICOGRABBER FUNCTION ========== //
    function showIcoGrabber() {
        const faviconUrl = findFavicon();
        if (faviconUrl) {
            createFaviconBox(faviconUrl);
        }
        closeCurrentWidget();
    }

    function findFavicon() {
        const domain = window.location.origin;
        let faviconUrl = null;

        const links = document.querySelectorAll('link[rel*="icon"]');
        if (links.length > 0) {
            faviconUrl = links[0].href;
            if (!faviconUrl.startsWith('http')) {
                faviconUrl = domain + (faviconUrl.startsWith('/') ? faviconUrl : '/' + faviconUrl);
            }
        } else {
            faviconUrl = domain + '/favicon.ico';
        }

        return faviconUrl;
    }

    function createFaviconBox(faviconUrl) {
        const box = document.createElement('div');
        box.id = 'favicon-box';
        box.style.cssText = `
            position: fixed !important; top: 50% !important; left: 50% !important;
            transform: translate(-50%, -50%) !important; background: rgba(255,255,255,0.95) !important;
            padding: 20px !important; border-radius: 10px !important; z-index: 10002 !important;
            box-shadow: 0 0 20px rgba(0,0,0,0.3) !important; font-family: Arial, sans-serif !important;
            text-align: center !important; backdrop-filter: blur(10px) !important;
            border: 1px solid #ddd !important; min-width: 200px !important;
        `;

        const closeBtn = document.createElement('button');
        closeBtn.textContent = '×';
        closeBtn.style.cssText = `
            position: absolute !important; top: 5px !important; right: 5px !important;
            background: #e74c3c !important; color: white !important; border: none !important;
            border-radius: 50% !important; width: 30px !important; height: 30px !important;
            font-size: 18px !important; cursor: pointer !important;
            display: flex !important; align-items: center !important; justify-content: center !important;
        `;
        closeBtn.onclick = () => box.remove();

        box.innerHTML = `
            <h3 style="margin-top: 0; margin-bottom: 15px; font-size: 16px; color: #333;">Website Favicon</h3>
            <img id="faviconImg" src="${faviconUrl}" style="max-width: 64px; max-height: 64px; display: block; margin: 0 auto 15px; cursor: pointer;">
            <div style="font-size: 12px; color: #666;">To save:<br>long tap or right click</div>
        `;

        box.appendChild(closeBtn);
        document.body.appendChild(box);

        const img = box.querySelector('#faviconImg');
        img.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1)';
            this.style.transition = 'transform 0.2s';
        });
        img.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    }

    // ========== ENCODING FUNCTION ========== //
    function showEncoding() {
        createEncodingSelector();
        closeCurrentWidget();
    }

    function createEncodingSelector() {
        const container = document.createElement('div');
        container.id = 'encoding-selector';
        container.style.cssText = `
            position: fixed !important; top: 0 !important; left: 0 !important;
            right: 0 !important; background: white !important; z-index: 10002 !important;
            padding: 10px !important; box-shadow: 0 2px 10px rgba(0,0,0,0.1) !important;
            display: flex !important; align-items: center !important; justify-content: center !important;
        `;

        const select = document.createElement('select');
        select.style.cssText = `
            margin-right: 10px !important; padding: 8px 12px !important;
            border: 1px solid #ccc !important; border-radius: 4px !important;
            font-size: 14px !important;
        `;
        
        const encodings = ['UTF-8', 'windows-1251', 'KOI8-R', 'ISO-8859-5', 'macintosh'];
        encodings.forEach(encoding => {
            const option = document.createElement('option');
            option.value = encoding;
            option.textContent = encoding;
            select.appendChild(option);
        });

        const okButton = document.createElement('button');
        okButton.textContent = 'OK';
        okButton.style.cssText = `
            padding: 8px 16px !important; background: #4285f4 !important;
            color: white !important; border: none !important; border-radius: 4px !important;
            cursor: pointer !important; font-size: 14px !important; margin-right: 5px !important;
        `;
        okButton.addEventListener('click', () => {
            const selectedEncoding = select.value;
            if (selectedEncoding) {
                applyEncoding(selectedEncoding);
            }
        });

        const hideButton = document.createElement('button');
        hideButton.textContent = 'Cancel';
        hideButton.style.cssText = `
            padding: 8px 16px !important; background: #95a5a6 !important;
            color: white !important; border: none !important; border-radius: 4px !important;
            cursor: pointer !important; font-size: 14px !important;
        `;
        hideButton.addEventListener('click', () => {
            container.remove();
        });

        container.appendChild(select);
        container.appendChild(okButton);
        container.appendChild(hideButton);
        document.body.appendChild(container);
    }

    async function applyEncoding(encoding) {
        try {
            const response = await fetch(window.location.href);
            const reader = response.body.getReader();
            const decoder = new TextDecoder(encoding);
            let { value: chunk, done: readerDone } = await reader.read();
            chunk = chunk ? decoder.decode(chunk, { stream: true }) : '';

            while (!readerDone) {
                const { value, done } = await reader.read();
                chunk += value ? decoder.decode(value, { stream: true }) : '';
                readerDone = done;
            }

            document.body.innerHTML = `<pre>${chunk}</pre>`;
        } catch (error) {
            console.error('Error applying encoding:', error);
            alert('Error applying encoding');
        }
    }

    // ========== APK DOWNLOADER FUNCTIONALITY ========== //
    function initApkDownloader() {
        if (!window.location.href.includes('play.google.com/store/apps/details')) return;
        
        function createDropdown() {
            if (document.getElementById('redirect-dropdown')) return;

            const container = document.createElement('div');
            container.id = 'redirect-dropdown-container';
            container.style.cssText = `
                position: fixed !important; top: 10px !important; left: 50% !important;
                transform: translateX(-50%) !important; z-index: 10000 !important;
                background: rgba(255, 255, 255, 0.9) !important; padding: 10px !important;
                border-radius: 5px !important; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2) !important;
            `;

            const dropdown = document.createElement('select');
            dropdown.id = 'redirect-dropdown';
            dropdown.style.cssText = `
                padding: 6px 12px !important; border-radius: 4px !important;
                border: 1px solid #ccc !important; font-size: 12px !important;
            `;

            const headerOption = document.createElement('option');
            headerOption.textContent = 'Download APK';
            headerOption.disabled = true;
            headerOption.selected = true;
            dropdown.appendChild(headerOption);

            const options = [
                { value: 'apkmirror', text: 'APKMirror' },
                { value: 'apkpure', text: 'APKPure' },
                { value: 'aptoide', text: 'Aptoide' },
                { value: 'fdroid', text: 'F-Droid' },
                { value: 'apkdownloader', text: 'APK Downloader' }
            ];

            options.forEach(option => {
                const optionElement = document.createElement('option');
                optionElement.value = option.value;
                optionElement.textContent = option.text;
                dropdown.appendChild(optionElement);
            });

            dropdown.addEventListener('change', async () => {
                const url = new URL(window.location.href);
                const idValue = url.searchParams.get('id');
                if (!idValue) return;

                const selectedOption = dropdown.value;
                let redirectUrl;

                switch (selectedOption) {
                    case 'apkdownloader':
                        try {
                            await navigator.clipboard.writeText(idValue);
                            showModalBeforeRedirect();
                        } catch (err) {
                            console.error('Error copying ID:', err);
                        }
                        return;
                    case 'apkpure':
                        redirectUrl = `https://apkpure.com/apk/${idValue}`;
                        break;
                    case 'apkmirror':
                        redirectUrl = `https://www.apkmirror.com/?s=${idValue}`;
                        break;
                    case 'aptoide':
                        redirectUrl = `https://en.aptoide.com/search?query=${idValue}&type=apps`;
                        break;
                    case 'fdroid':
                        redirectUrl = `https://f-droid.org/packages/${idValue}/`;
                        break;
                }

                window.open(redirectUrl, '_blank');
            });

            container.appendChild(dropdown);
            document.body.appendChild(container);
        }

        function showModalBeforeRedirect() {
            const modal = document.createElement('div');
            modal.style.cssText = `
                position: fixed !important; top: 50% !important; left: 50% !important;
                transform: translate(-50%, -50%) !important; z-index: 10001 !important;
                background: #fff !important; padding: 20px !important; border-radius: 8px !important;
                box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2) !important; text-align: center !important;
                max-width: 300px !important;
            `;

            modal.innerHTML = `
                <p style="margin-bottom: 15px; font-weight: bold;">Package name copied!</p>
                <p style="margin-bottom: 20px;">Click "Got it" to go to APK Downloader.</p>
                <button id="confirm-btn" style="
                    padding: 8px 16px;
                    background: #4285f4;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 14px;
                ">Got it</button>
            `;

            document.body.appendChild(modal);

            const confirmBtn = modal.querySelector('#confirm-btn');
            confirmBtn.addEventListener('click', () => {
                modal.remove();
                window.open('https://apkgk.com/APK-Downloader', '_blank');
            });
        }

        createDropdown();
        const observer = new MutationObserver(createDropdown);
        observer.observe(document.body, { childList: true, subtree: true });
    }

    // ========== ANTI COPY BLOCK FUNCTIONALITY ========== //
    function initAntiCopyBlock() {
        const blockedEvents = ["contextmenu", "selectstart", "mousedown"];

        function isAllowedElement(el) {
            return (el instanceof HTMLInputElement ||
                    el instanceof HTMLTextAreaElement ||
                    el instanceof HTMLSelectElement ||
                    el.isContentEditable);
        }

        const originalAddEventListener = EventTarget.prototype.addEventListener;
        EventTarget.prototype.addEventListener = function(type, listener, options) {
            if (blockedEvents.includes(type) && !isAllowedElement(this)) {
                return;
            }
            return originalAddEventListener.call(this, type, listener, options);
        };

        function injectCSS() {
            const style = document.createElement('style');
            style.innerHTML = `
                * {
                    -webkit-user-select: text !important;
                    -moz-user-select: text !important;
                    -ms-user-select: text !important;
                    user-select: text !important;
                    touch-action: auto !important;
                }
            `;
            document.documentElement.appendChild(style);
        }

        function removeInlineHandlers() {
            document.querySelectorAll('*').forEach(el => {
                if (isAllowedElement(el)) return;
                el.oncontextmenu = null;
                el.onselectstart = null;
                el.onmousedown = null;
            });
        }

        function observeMutations() {
            const observer = new MutationObserver(removeInlineHandlers);
            observer.observe(document.documentElement, { childList: true, subtree: true });
        }

        function init() {
            injectCSS();
            removeInlineHandlers();
            observeMutations();
        }

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
        } else {
            init();
        }
    }

    // ========== GRAYSCALE TURBO ========== //
    function toggleGrayscale() {
        isGrayscaleActive = !isGrayscaleActive;
        if (isGrayscaleActive) activateGrayscale();
        else deactivateGrayscale();
        closeCurrentWidget();
    }

    function activateGrayscale() {
        const style = document.createElement('style');
        style.id = 'grayscale-styles';
        style.textContent = `
            html { filter: grayscale(100%) !important; -webkit-filter: grayscale(100%) !important; }
            img, video, iframe, canvas, svg { filter: grayscale(100%) !important; -webkit-filter: grayscale(100%) !important; }
        `;
        document.head.appendChild(style);
        grayscaleObserver = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.addedNodes.length) {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === 1) {
                            if (node.matches('img, video, iframe, canvas, svg')) {
                                node.style.filter = 'grayscale(100%)';
                                node.style.webkitFilter = 'grayscale(100%)';
                            }
                            if (node.hasAttribute('style')) {
                                const style = node.getAttribute('style');
                                if (style && /color|background|border/.test(style)) {
                                    node.style.filter = 'grayscale(100%)';
                                }
                            }
                        }
                    });
                }
            });
        });
        setTimeout(() => {
            document.querySelectorAll('img, video, iframe, canvas, svg').forEach(el => {
                el.style.filter = 'grayscale(100%)';
                el.style.webkitFilter = 'grayscale(100%)';
            });
            grayscaleObserver.observe(document.documentElement, {
                childList: true,
                subtree: true,
                attributes: false,
                characterData: false
            });
        }, 50);
    }

    function deactivateGrayscale() {
        const style = document.getElementById('grayscale-styles');
        if (style) style.remove();
        if (grayscaleObserver) {
            grayscaleObserver.disconnect();
            grayscaleObserver = null;
        }
        document.querySelectorAll('img, video, iframe, canvas, svg').forEach(el => {
            el.style.filter = '';
            el.style.webkitFilter = '';
        });
        document.documentElement.style.filter = '';
        document.documentElement.style.webkitFilter = '';
    }

    // ========== AMOLED WIDGET ========== //
    function toggleAmoledWidget() {
        createWidget(amoledConfig, 2, 'Amoled Tools');
    }

    function executeAmoledTool(action) {
        switch(action) {
            case 'grayscale': toggleGrayscale(); break;
            case 'mobFriendly': toggleMobFriendly(); break;
        }
    }

    // ========== TRANSLATE FUNCTION ========== //
    function showTranslateWidget() {
        createWidget(translateEngines, 2, 'Select Translator');
    }

    function translatePage(engineUrl) {
        const currentUrl = window.location.href;
        let translateUrl;
        
        if (engineUrl.includes('yandex.com')) {
            // Fixed URL for Yandex Translate according to UniTranslator
            translateUrl = `https://translate.yandex.com/translate?url=${encodeURIComponent(currentUrl)}&lang=auto-ru`;
        } else {
            // Google Translate
            translateUrl = engineUrl + encodeURIComponent(currentUrl);
        }
        
        window.open(translateUrl, '_blank');
        closeCurrentWidget();
    }

    // ========== DEV TOOLS FUNCTIONS ========== //
    function toggleDevTools() {
        createWidget(devToolsConfig, 2, 'Dev Tools');
    }

    function executeDevTool(action) {
        switch(action) {
            case 'viewportInfo': showViewportInfo(); break;
            case 'outlineAll': outlineAllElements(); break;
            case 'flexboxDebug': debugFlexbox(); break;
            case 'gridDebug': debugGrid(); break;
            case 'performanceMonitor': showPerformanceMonitor(); break;
            case 'localStorageManager': showLocalStorageManager(); break;
            case 'colorPicker': showColorPicker(); break;
            case 'pageAnalyzer': showPageAnalyzer(); break;
            case 'icoGrabber': showIcoGrabber(); break;
            case 'encoding': showEncoding(); break;
        }
    }

    function showViewportInfo() {
        const info = document.createElement('div');
        info.id = 'viewport-info';
        info.style.cssText = `
            position: fixed; top: 10px; right: 10px; background: rgba(0,0,0,0.9); color: white; padding: 15px;
            border-radius: 8px; font-family: monospace; font-size: 12px; z-index: 10000;
            backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.2);
        `;
        function updateInfo() {
            info.innerHTML = `
                <div style="margin-bottom: 5px; font-weight: bold; color: #3498db;">📐 Viewport Info</div>
                <div>Window: ${window.innerWidth} × ${window.innerHeight}</div>
                <div>Screen: ${window.screen.width} × ${window.screen.height}</div>
                <div>Pixel Ratio: ${window.devicePixelRatio}</div>
                <div>Orientation: ${window.screen.orientation?.type || 'unknown'}</div>
                <button onclick="this.parentElement.remove()" style="margin-top: 8px; padding: 4px 8px; background: #e74c3c; color: white; border: none; border-radius: 4px; cursor: pointer;">Close</button>
            `;
        }
        window.addEventListener('resize', updateInfo);
        updateInfo();
        document.body.appendChild(info);
        closeCurrentWidget();
    }

    function outlineAllElements() {
        document.querySelectorAll('*').forEach(el => {
            const currentOutline = el.style.outline;
            if (!currentOutline || currentOutline === 'none') el.style.outline = '1px solid #ff0000';
            else el.style.outline = '';
        });
        closeCurrentWidget();
    }

    function debugFlexbox() {
        document.querySelectorAll('*').forEach(el => {
            const display = getComputedStyle(el).display;
            if (display === 'flex') el.style.outline = '2px dashed #3498db';
        });
        closeCurrentWidget();
    }

    function debugGrid() {
        document.querySelectorAll('*').forEach(el => {
            const display = getComputedStyle(el).display;
            if (display === 'grid') el.style.outline = '2px dotted #2ecc71';
        });
        closeCurrentWidget();
    }

    function showPerformanceMonitor() {
        const perf = document.createElement('div');
        perf.id = 'performance-monitor';
        perf.style.cssText = `
            position: fixed; bottom: 10px; right: 10px; background: rgba(0,0,0,0.9); color: #2ecc71; padding: 15px;
            border-radius: 8px; font-family: monospace; font-size: 12px; z-index: 10000;
            backdrop-filter: blur(10px); border: 1px solid rgba(46, 204, 113, 0.3);
        `;
        let frameCount = 0;
        let lastTime = performance.now();
        function updatePerf() {
            frameCount++;
            const currentTime = performance.now();
            if (currentTime - lastTime >= 1000) {
                const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
                const memory = performance.memory ? `Memory: ${Math.round(performance.memory.usedJSHeapSize / 1048576)}MB` : 'Memory: N/A';
                perf.innerHTML = `
                    <div style="margin-bottom: 5px; font-weight: bold; color: #3498db;">📊 Performance</div>
                    <div>FPS: ${fps}</div>
                    <div>${memory}</div>
                    <button onclick="this.parentElement.remove()" style="margin-top: 8px; padding: 4px 8px; background: #e74c3c; color: white; border: none; border-radius: 4px; cursor: pointer;">Close</button>
                `;
                frameCount = 0;
                lastTime = currentTime;
            }
            requestAnimationFrame(updatePerf);
        }
        updatePerf();
        document.body.appendChild(perf);
        closeCurrentWidget();
    }

    function showLocalStorageManager() {
        const manager = document.createElement('div');
        manager.id = 'localstorage-manager';
        manager.style.cssText = `
            position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: white; padding: 20px;
            border-radius: 10px; z-index: 10000; max-width: 500px; max-height: 400px; overflow-y: auto;
            box-shadow: 0 0 20px rgba(0,0,0,0.3); font-family: Arial, sans-serif;
        `;
        function refreshItems() {
            let html = `
                <div style="margin-bottom: 15px; font-weight: bold; font-size: 16px; color: #2c3e50;">💾 LocalStorage Manager</div>
                <div style="margin-bottom: 10px;">
                    <input type="text" id="newKey" placeholder="Key" style="margin-right: 5px; padding: 5px;">
                    <input type="text" id="newValue" placeholder="Value" style="margin-right: 5px; padding: 5px;">
                    <button onclick="addNewItem()" style="padding: 5px 10px; background: #27ae60; color: white; border: none; border-radius: 4px; cursor: pointer;">Add</button>
                </div>
                <div id="lsItems" style="margin-bottom: 15px;"></div>
                <button onclick="clearAllItems()" style="padding: 8px 15px; background: #e74c3c; color: white; border: none; border-radius: 4px; cursor: pointer;">Clear All</button>
                <button onclick="this.parentElement.remove()" style="padding: 8px 15px; background: #95a5a6; color: white; border: none; border-radius: 4px; cursor: pointer; margin-left: 10px;">Close</button>
            `;
            manager.innerHTML = html;
            const itemsDiv = manager.querySelector('#lsItems');
            itemsDiv.innerHTML = '';
            if (localStorage.length === 0) {
                itemsDiv.innerHTML = '<div style="color: #7f8c8d; text-align: center;">No items in localStorage</div>';
                return;
            }
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                const value = localStorage.getItem(key);
                const item = document.createElement('div');
                item.style.cssText = 'margin: 5px 0; padding: 8px; background: #f8f9fa; border-radius: 4px;';
                item.innerHTML = `
                    <strong>${key}:</strong>
                    <input value="${value}" style="width: 200px; margin: 0 5px; padding: 3px;">
                    <button onclick="updateItem('${key}')" style="padding: 3px 8px; background: #3498db; color: white; border: none; border-radius: 3px; cursor: pointer;">Update</button>
                    <button onclick="deleteItem('${key}')" style="padding: 3px 8px; background: #e74c3c; color: white; border: none; border-radius: 3px; cursor: pointer;">Delete</button>
                `;
                itemsDiv.appendChild(item);
            }
        }
        window.addNewItem = function() {
            const key = document.getElementById('newKey').value;
            const value = document.getElementById('newValue').value;
            if (key && value) {
                localStorage.setItem(key, value);
                refreshItems();
            }
        };
        window.updateItem = function(key) {
            const newValue = document.querySelector(`input[value="${localStorage.getItem(key)}"]`).value;
            localStorage.setItem(key, newValue);
            refreshItems();
        };
        window.deleteItem = function(key) {
            localStorage.removeItem(key);
            refreshItems();
        };
        window.clearAllItems = function() {
            if (confirm('Clear all localStorage items?')) {
                localStorage.clear();
                refreshItems();
            }
        };
        refreshItems();
        document.body.appendChild(manager);
        closeCurrentWidget();
    }

    function showColorPicker() {
        const picker = document.createElement('div');
        picker.id = 'color-picker';
        picker.style.cssText = `
            position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: white; padding: 20px;
            border-radius: 10px; z-index: 10000; box-shadow: 0 0 20px rgba(0,0,0,0.3); font-family: Arial, sans-serif;
        `;
        picker.innerHTML = `
            <div style="margin-bottom: 15px; font-weight: bold; font-size: 16px; color: #2c3e50;">🎨 Color Picker</div>
            <input type="color" id="colorInput" style="width: 100px; height: 100px; margin-bottom: 10px;">
            <div id="colorInfo" style="margin: 10px 0; padding: 10px; background: #f8f9fa; border-radius: 5px; font-family: monospace;"></div>
            <button onclick="this.parentElement.remove()" style="padding: 8px 15px; background: #95a5a6; color: white; border: none; border-radius: 4px; cursor: pointer;">Close</button>
        `;
        const colorInput = picker.querySelector('#colorInput');
        const colorInfo = picker.querySelector('#colorInfo');
        colorInput.addEventListener('input', function() {
            const color = this.value;
            colorInfo.innerHTML = `
                HEX: ${color}<br>
                RGB: ${hexToRgb(color)}<br>
                HSL: ${hexToHsl(color)}
            `;
        });
        colorInput.value = '#3498db';
        colorInput.dispatchEvent(new Event('input'));
        document.body.appendChild(picker);
        closeCurrentWidget();
    }

    function hexToRgb(hex) {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgb(${r}, ${g}, ${b})`;
    }

    function hexToHsl(hex) {
        const r = parseInt(hex.slice(1, 3), 16) / 255;
        const g = parseInt(hex.slice(3, 5), 16) / 255;
        const b = parseInt(hex.slice(5, 7), 16) / 255;
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;
        if (max === min) {
            h = s = 0;
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }
        return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
    }

    // ========== RESPONSIVE TESTER (SIMPLIFIED VERSION) ========== //
    function showResponsiveTester() {
        const devices = [
            { name: 'Phone', width: 375, height: 667 },
            { name: 'Tablet', width: 768, height: 1024 },
            { name: 'Laptop', width: 1024, height: 768 },
            { name: 'Desktop', width: 1440, height: 900 }
        ];

        const tester = document.createElement('div');
        tester.id = 'responsive-tester';
        tester.style.cssText = `
            position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); 
            background: white; padding: 15px; border-radius: 8px; z-index: 10000; 
            box-shadow: 0 0 20px rgba(0,0,0,0.3); font-family: Arial, sans-serif;
            text-align: center; max-width: 90vw;
        `;
        
        tester.innerHTML = `
            <div style="margin-bottom: 15px; font-weight: bold; color: #2c3e50;">📱 Size Test</div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 15px;">
                ${devices.map(device =>
                    `<button onclick="setViewportSize(${device.width}, ${device.height})" 
                      style="padding: 10px 5px; background: #3498db; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 12px;">
                      ${device.name}<br><small>${device.width}×${device.height}</small>
                    </button>`
                ).join('')}
            </div>
            <div style="font-size: 11px; color: #666; margin-bottom: 10px;">
                Current: ${window.innerWidth} × ${window.innerHeight}
            </div>
            <button onclick="resetViewport()" style="padding: 8px 15px; background: #27ae60; color: white; border: none; border-radius: 4px; cursor: pointer; margin-right: 5px;">Reset</button>
            <button onclick="this.parentElement.remove()" style="padding: 8px 15px; background: #95a5a6; color: white; border: none; border-radius: 4px; cursor: pointer;">Close</button>
        `;

        window.setViewportSize = function(width, height) {
            // Simply resize window
            window.resizeTo(width, height);
            // Update current size display
            const sizeInfo = tester.querySelector('div:last-child');
            if (sizeInfo) {
                sizeInfo.textContent = `Current: ${width} × ${height}`;
            }
        };

        window.resetViewport = function() {
            window.resizeTo(1200, 800);
            const sizeInfo = tester.querySelector('div:last-child');
            if (sizeInfo) {
                sizeInfo.textContent = `Current: 1200 × 800`;
            }
        };

        document.body.appendChild(tester);
        closeCurrentWidget();
    }

    // ========== FTP/WEBDAV WIDGET ========== //
    function initFTPWidget() {
        if (ftpWidget) {
            ftpWidget.style.display = 'block';
            return;
        }
        const defaultConfig = {
            protocols: {
                'ftp': { port: 21, prefix: 'ftp://' },
                'sftp': { port: 22, prefix: 'sftp://' },
                'ftps': { port: 21, prefix: 'ftps://' },
                'webdav': { port: 80, prefix: 'http://' },
                'webdavs': { port: 443, prefix: 'https://' }
            }
        };
        let selectedConnection = null;
        ftpWidget = document.createElement('div');
        ftpWidget.id = 'ftp-connection-widget';
        ftpWidget.innerHTML = `
            <div class="ftp-widget-container">
                <div class="ftp-widget-header">
                    <h3>📁 FTP/WebDAV Connector</h3>
                    <button class="ftp-widget-close">×</button>
                </div>
                <div class="ftp-widget-tabs">
                    <button class="tab-btn active" data-tab="quick-connect">Quick Connect</button>
                    <button class="tab-btn" data-tab="saved-connections">Saved</button>
                </div>
                <div class="ftp-widget-body">
                    <div id="quick-connect" class="tab-content active">
                        <div class="form-group">
                            <label for="ftp-protocol">Server Type:</label>
                            <select id="ftp-protocol">
                                <option value="ftp">FTP</option>
                                <option value="sftp">SFTP</option>
                                <option value="ftps">FTPS</option>
                                <option value="webdav">WebDAV</option>
                                <option value="webdavs">WebDAV Secure</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="ftp-server">Server/IP:</label>
                            <input type="text" id="ftp-server" placeholder="example.com or 192.168.1.1">
                        </div>
                        <div class="form-group">
                            <label for="ftp-port">Port:</label>
                            <input type="number" id="ftp-port" placeholder="Auto">
                        </div>
                        <div class="form-group">
                            <label for="ftp-username">Username:</label>
                            <input type="text" id="ftp-username" placeholder="username">
                        </div>
                        <div class="form-group">
                            <label for="ftp-password">Password:</label>
                            <input type="password" id="ftp-password" placeholder="password">
                        </div>
                        <div class="form-group">
                            <label for="ftp-path">Path:</label>
                            <input type="text" id="ftp-path" placeholder="/optional/path">
                        </div>
                        <div class="form-group">
                            <label for="connection-name">Name (for saving):</label>
                            <input type="text" id="connection-name" placeholder="My Server">
                        </div>
                        <div class="form-group">
                            <label>
                                <input type="checkbox" id="ftp-passive" checked>
                                Passive Mode (FTP)
                            </label>
                        </div>
                        <div class="form-buttons">
                            <button id="ftp-connect" class="connect-btn">Connect</button>
                            <button id="ftp-save" class="save-btn">Save</button>
                            <button id="ftp-reset" class="reset-btn">Reset</button>
                        </div>
                    </div>
                    <div id="saved-connections" class="tab-content">
                        <div class="saved-list" id="saved-connections-list">
                            <div style="text-align: center; color: #666;">No saved connections</div>
                        </div>
                        <div class="selected-connection-info" id="selected-connection-info" style="display: none;">
                            <div class="connection-details">
                                <strong>Selected:</strong> <span id="selected-connection-name"></span>
                                <div class="connection-params" id="selected-connection-params"></div>
                            </div>
                        </div>
                        <div class="form-buttons">
                            <button id="saved-connect" class="connect-btn" disabled>Connect to Selected</button>
                            <button id="saved-load" class="save-btn" disabled>Load to Form</button>
                            <button id="clear-saved" class="reset-btn">Clear All</button>
                        </div>
                    </div>
                    <div class="connection-url">
                        <label>Connection URL:</label>
                        <div id="generated-url" class="url-display">Fill fields to generate URL</div>
                    </div>
                </div>
            </div>
        `;
        const styles = `
            <style>
                #ftp-connection-widget {
                    position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: #34495e;
                    border-radius: 1vh; z-index: 10001; max-width: 90vw; max-height: 90vh; overflow-y: auto; box-shadow: 0 0 20px rgba(0,0,0,0.5);
                    font-family: Arial, sans-serif;
                }
                .ftp-widget-container { width: 350px; background: #f5f5f5; border: 2px solid #333; border-radius: 8px; max-height: 80vh; overflow-y: auto; }
                .ftp-widget-header { background: #333; color: white; padding: 10px; display: flex; justify-content: space-between; align-items: center; border-radius: 6px 6px 0 0; }
                .ftp-widget-tabs { display: flex; background: #ddd; }
                .tab-btn { flex: 1; padding: 8px; border: none; background: #ccc; cursor: pointer; font-size: 11px; }
                .tab-btn.active { background: #f5f5f5; font-weight: bold; }
                .tab-content { display: none; padding: 15px; }
                .tab-content.active { display: block; }
                .saved-list { max-height: 200px; overflow-y: auto; margin-bottom: 10px; }
                .saved-item { padding: 8px; margin: 5px 0; background: white; border: 1px solid #ddd; border-radius: 4px; cursor: pointer; display: flex; justify-content: space-between; align-items: center; }
                .saved-item:hover { background: #e9e9e9; }
                .saved-item.selected { background: #d4edda; border-color: #c3e6cb; }
                .saved-item .delete-btn { color: #dc3545; cursor: pointer; padding: 2px 6px; font-weight: bold; }
                .selected-connection-info { background: #e9f7ef; border: 1px solid #c3e6cb; border-radius: 4px; padding: 10px; margin: 10px 0; }
                .connection-details { font-size: 12px; }
                .connection-params { margin-top: 5px; color: #666; }
                .form-group { margin-bottom: 10px; }
                .form-group label { display: block; margin-bottom: 3px; font-weight: bold; font-size: 12px; }
                .form-group input, .form-group select { width: 100%; padding: 6px; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box; }
                .form-buttons { display: flex; gap: 8px; margin: 15px 0; }
                .connect-btn { flex: 2; background: #4CAF50; color: white; border: none; padding: 8px; border-radius: 4px; cursor: pointer; }
                .connect-btn:disabled { background: #cccccc; cursor: not-allowed; }
                .save-btn { flex: 1; background: #2196F3; color: white; border: none; padding: 8px; border-radius: 4px; cursor: pointer; }
                .save-btn:disabled { background: #cccccc; cursor: not-allowed; }
                .reset-btn { flex: 1; background: #ff9800; color: white; border: none; padding: 8px; border-radius: 4px; cursor: pointer; }
                .connection-url { margin-top: 10px; padding: 10px; background: #e9e9e9; border-radius: 4px; }
                .url-display { word-break: break-all; font-family: monospace; font-size: 11px; background: white; padding: 5px; border: 1px solid #ddd; margin-top: 5px; }
            </style>
        `;
        document.head.insertAdjacentHTML('beforeend', styles);
        document.body.appendChild(ftpWidget);
        setupFTPWidgetEvents(defaultConfig, selectedConnection);
    }

    function setupFTPWidgetEvents(defaultConfig, selectedConnection) {
        function getSavedConnections() {
            try { return JSON.parse(localStorage.getItem('ftpSavedConnections') || '[]'); }
            catch { return []; }
        }
        function saveConnection(connection) {
            try {
                let saved = getSavedConnections();
                saved = saved.filter(c => c.name !== connection.name);
                saved.unshift(connection);
                saved = saved.slice(0, 20);
                localStorage.setItem('ftpSavedConnections', JSON.stringify(saved));
                return true;
            } catch { return false; }
        }
        function deleteConnection(name) {
            try {
                let saved = getSavedConnections();
                saved = saved.filter(c => c.name !== name);
                localStorage.setItem('ftpSavedConnections', JSON.stringify(saved));
                return true;
            } catch { return false; }
        }
        function generateURL() {
            const protocol = document.getElementById('ftp-protocol').value;
            const server = document.getElementById('ftp-server').value;
            const port = document.getElementById('ftp-port').value;
            const username = document.getElementById('ftp-username').value;
            const password = document.getElementById('ftp-password').value;
            const path = document.getElementById('ftp-path').value;
            if (!server) return '';
            const config = defaultConfig.protocols[protocol];
            let url = config.prefix;
            if (username) {
                url += encodeURIComponent(username);
                if (password) url += ':' + encodeURIComponent(password);
                url += '@';
            }
            url += server;
            if (port && port != config.port) url += ':' + port;
            if (path) url += path.startsWith('/') ? path : '/' + path;
            return url;
        }
        function updateGeneratedURL() {
            const urlDisplay = document.getElementById('generated-url');
            const url = generateURL();
            urlDisplay.textContent = url || 'Fill fields to generate URL';
        }
        function connect() {
            const url = generateURL();
            if (url) {
                window.open(url, '_blank');
                closeFTPWidget();
            } else alert('Please specify at least server for connection');
        }
        function saveConnectionToStorage() {
            const name = document.getElementById('connection-name').value.trim();
            if (!name) { alert('Enter name for saving connection'); return; }
            const connection = {
                name: name,
                protocol: document.getElementById('ftp-protocol').value,
                server: document.getElementById('ftp-server').value,
                port: document.getElementById('ftp-port').value || '',
                username: document.getElementById('ftp-username').value,
                password: document.getElementById('ftp-password').value,
                path: document.getElementById('ftp-path').value
            };
            if (saveConnection(connection)) {
                alert(`Connection "${name}" saved!`);
                loadSavedConnections();
            } else alert('Error saving connection');
        }
        function loadSavedConnections() {
            const saved = getSavedConnections();
            const container = document.getElementById('saved-connections-list');
            if (saved.length === 0) {
                container.innerHTML = '<div style="text-align: center; color: #666;">No saved connections</div>';
                document.getElementById('selected-connection-info').style.display = 'none';
                updateSavedButtonsState(false);
                return;
            }
            container.innerHTML = saved.map(conn => `
                <div class="saved-item" data-config='${JSON.stringify(conn)}'>
                    <div>
                        <strong>${conn.name}</strong><br>
                        <small>${conn.protocol}://${conn.server}${conn.port ? ':' + conn.port : ''}</small>
                    </div>
                    <div class="delete-btn" data-name="${conn.name}">×</div>
                </div>
            `).join('');
            container.querySelectorAll('.saved-item').forEach(item => {
                item.addEventListener('click', function(e) {
                    if (!e.target.classList.contains('delete-btn')) {
                        container.querySelectorAll('.saved-item').forEach(i => i.classList.remove('selected'));
                        this.classList.add('selected');
                        selectedConnection = JSON.parse(this.getAttribute('data-config'));
                        showSelectedConnectionInfo(selectedConnection);
                        updateSavedButtonsState(true);
                    }
                });
            });
            container.querySelectorAll('.delete-btn').forEach(btn => {
                btn.addEventListener('click', function(e) {
                    e.stopPropagation();
                    const name = this.getAttribute('data-name');
                    if (confirm(`Delete connection "${name}"?`)) {
                        deleteConnection(name);
                        loadSavedConnections();
                        selectedConnection = null;
                        updateSavedButtonsState(false);
                    }
                });
            });
            selectedConnection = null;
            updateSavedButtonsState(false);
        }
        function showSelectedConnectionInfo(connection) {
            const infoDiv = document.getElementById('selected-connection-info');
            const nameSpan = document.getElementById('selected-connection-name');
            const paramsDiv = document.getElementById('selected-connection-params');
            nameSpan.textContent = connection.name;
            const params = [];
            if (connection.username) params.push(`Username: ${connection.username}`);
            if (connection.port) params.push(`Port: ${connection.port}`);
            if (connection.path) params.push(`Path: ${connection.path}`);
            paramsDiv.innerHTML = params.join(' | ') || 'No additional parameters';
            infoDiv.style.display = 'block';
        }
        function updateSavedButtonsState(enabled) {
            document.getElementById('saved-connect').disabled = !enabled;
            document.getElementById('saved-load').disabled = !enabled;
        }
        function connectToSelected() {
            if (selectedConnection) {
                const url = generateURLFromConfig(selectedConnection);
                if (url) {
                    window.open(url, '_blank');
                    closeFTPWidget();
                }
            }
        }
        function generateURLFromConfig(config) {
            if (!config.server) return '';
            const protocolConfig = defaultConfig.protocols[config.protocol];
            let url = protocolConfig.prefix;
            if (config.username) {
                url += encodeURIComponent(config.username);
                if (config.password) url += ':' + encodeURIComponent(config.password);
                url += '@';
            }
            url += config.server;
            if (config.port && config.port != protocolConfig.port) url += ':' + config.port;
            if (config.path) url += config.path.startsWith('/') ? config.path : '/' + config.path;
            return url;
        }
        function loadSelectedToForm() {
            if (selectedConnection) {
                loadConnection(selectedConnection);
                switchTab('quick-connect');
            }
        }
        function loadConnection(config) {
            document.getElementById('ftp-protocol').value = config.protocol;
            document.getElementById('ftp-server').value = config.server;
            document.getElementById('ftp-port').value = config.port || '';
            document.getElementById('ftp-username').value = config.username || '';
            document.getElementById('ftp-password').value = config.password || '';
            document.getElementById('ftp-path').value = config.path || '';
            document.getElementById('connection-name').value = config.name || '';
            updateGeneratedURL();
        }
        function switchTab(tabName) {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
            document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
            document.getElementById(tabName).classList.add('active');
            if (tabName === 'saved-connections') loadSavedConnections();
        }
        function resetForm() {
            document.getElementById('ftp-protocol').value = 'ftp';
            document.getElementById('ftp-server').value = '';
            document.getElementById('ftp-port').value = '';
            document.getElementById('ftp-username').value = '';
            document.getElementById('ftp-password').value = '';
            document.getElementById('ftp-path').value = '';
            document.getElementById('connection-name').value = '';
            updateGeneratedURL();
        }
        function setupProtocolChange() {
            const protocolSelect = document.getElementById('ftp-protocol');
            const portInput = document.getElementById('ftp-port');
            protocolSelect.addEventListener('change', function() {
                const protocol = this.value;
                const defaultPort = defaultConfig.protocols[protocol].port;
                if (!portInput.value) portInput.placeholder = `Auto (${defaultPort})`;
                updateGeneratedURL();
            });
        }
        document.getElementById('ftp-connect').addEventListener('click', connect);
        document.getElementById('ftp-save').addEventListener('click', saveConnectionToStorage);
        document.getElementById('ftp-reset').addEventListener('click', resetForm);
        document.getElementById('saved-connect').addEventListener('click', connectToSelected);
        document.getElementById('saved-load').addEventListener('click', loadSelectedToForm);
        document.getElementById('clear-saved').addEventListener('click', function() {
            if (confirm('Clear all saved connections?')) {
                localStorage.setItem('ftpSavedConnections', '[]');
                loadSavedConnections();
            }
        });
        document.querySelector('.ftp-widget-close').addEventListener('click', closeFTPWidget);
        const inputs = ['ftp-protocol', 'ftp-server', 'ftp-port', 'ftp-username', 'ftp-password', 'ftp-path'];
        inputs.forEach(id => document.getElementById(id).addEventListener('input', updateGeneratedURL));
        setupTabs();
        setupProtocolChange();
        updateGeneratedURL();
        loadSavedConnections();
    }

    function closeFTPWidget() {
        if (ftpWidget) ftpWidget.style.display = 'none';
        closePanel();
    }

    function toggleFTPWidget() {
        initFTPWidget();
        closePanel();
    }

    // ========== NETWORK MONITOR ========== //
    function toggleNetMonitor() {
        isNetMonitorActive = !isNetMonitorActive;
        if (isNetMonitorActive) initNetMonitor();
        else deactivateNetMonitor();
        updateNetMonitorButton();
        closePanel();
    }

    function initNetMonitor() {
        if (!isNetMonitorActive) {
            deactivateNetMonitor();
            return;
        }
        if (netMonitorWidget) {
            netMonitorWidget.style.display = 'block';
            return;
        }
        let totalDownload = 0;
        let totalUpload = 0;
        let downloadSpeed = 0;
        let uploadSpeed = 0;
        let lastDownload = 0;
        let lastUpload = 0;
        let lastTime = Date.now();
        let trackerRequests = 0;
        const trackerDomains = [
            'google-analytics', 'googlesyndication', 'doubleclick', 'facebook.com/tr',
            'connect.facebook.net', 'analytics', 'metrics', 'tracking', 'telemetry',
            'beacon', 'tagmanager', 'gtm', 'amplitude', 'mixpanel', 'hotjar',
            'piwik', 'matomo', 'yandex.metrika', 'mc.yandex.ru', 'vk.com/rtrg',
            'ads', 'adservice', 'trc.taboola.com'
        ];
        const trackerPaths = [
            '/collect', '/tr', '/track', '/log', '/beacon', '/analytics',
            '/metrics', '/telemetry'
        ];
        netMonitorWidget = document.createElement('div');
        netMonitorWidget.id = 'network-monitor';
        netMonitorWidget.innerHTML = `
            <div style="
                position: fixed; top: 0; left: 0; background: rgba(0, 0, 0, 0.9); color: white; padding: 6px;
                font-family: Arial, sans-serif; font-size: 10px; border-radius: 0 0 6px 0; z-index: 9998;
                backdrop-filter: blur(5px); border-right: 1px solid rgba(255, 255, 255, 0.3);
                border-bottom: 1px solid rgba(255, 255, 255, 0.3); min-width: 130px; user-select: none; line-height: 1.2;
            ">
                <div style="margin-bottom: 3px; font-weight: bold; font-size: 9px; color: #3498db;">NETWORK MONITOR</div>
                <div style="margin-bottom: 2px;">↓: <span id="dl-speed">0 Kb/s</span></div>
                <div style="margin-bottom: 2px;">↑: <span id="ul-speed">0 Kb/s</span></div>
                <div style="margin-bottom: 2px;">Dw: <span id="dl-total">0 Kb</span></div>
                <div style="margin-bottom: 2px;">Up: <span id="ul-total">0 Kb</span></div>
                <div style="color: #ff6b6b; font-weight: bold;">🎯 Trackers: <span id="tracker-count">0</span></div>
            </div>
        `;
        document.body.appendChild(netMonitorWidget);
        function isTrackerRequest(url) {
            if (!url) return false;
            const urlStr = url.toString().toLowerCase();
            for (const domain of trackerDomains) if (urlStr.includes(domain)) return true;
            for (const path of trackerPaths) if (urlStr.includes(path)) return true;
            if (urlStr.includes('google') && (urlStr.includes('/gtm/') || urlStr.includes('/ga/'))) return true;
            return false;
        }
        function getDataSize(data) {
            if (!data) return 0;
            if (typeof data === 'string') return new Blob([data]).size;
            if (data instanceof FormData) return 1024;
            if (data instanceof Blob) return data.size;
            if (data instanceof ArrayBuffer) return data.byteLength;
            return 0;
        }
        const originalFetch = window.fetch;
        window.fetch = function(...args) {
            if (!isNetMonitorActive) return originalFetch.apply(this, args);
            const url = args[0];
            const request = args[1] || {};
            if (isTrackerRequest(url)) {
                trackerRequests++;
                updateTrackerDisplay();
            }
            if (request.body) {
                const size = getDataSize(request.body);
                if (size > 0) totalUpload += size;
            }
            return originalFetch.apply(this, args).then(response => {
                if (isNetMonitorActive) {
                    const contentLength = response.headers.get('content-length');
                    if (contentLength && response.ok) totalDownload += parseInt(contentLength);
                }
                return response;
            });
        };
        const originalOpen = XMLHttpRequest.prototype.open;
        const originalSend = XMLHttpRequest.prototype.send;
        XMLHttpRequest.prototype.open = function(method, url, ...rest) {
            this._url = url;
            return originalOpen.apply(this, [method, url, ...rest]);
        };
        XMLHttpRequest.prototype.send = function(data) {
            if (!isNetMonitorActive) return originalSend.call(this, data);
            if (this._url && isTrackerRequest(this._url)) {
                trackerRequests++;
                updateTrackerDisplay();
            }
            if (data) {
                const size = getDataSize(data);
                if (size > 0) totalUpload += size;
            }
            const originalOnLoad = this.onload;
            this.addEventListener('load', function() {
                if (isNetMonitorActive && this.status >= 200 && this.status < 300) {
                    const contentLength = this.getResponseHeader('content-length');
                    if (contentLength) totalDownload += parseInt(contentLength);
                }
                if (originalOnLoad) originalOnLoad.call(this);
            });
            return originalSend.call(this, data);
        };
        function updateStats() {
            if (!isNetMonitorActive) return;
            const currentTime = Date.now();
            const timeDiff = (currentTime - lastTime) / 1000;
            if (timeDiff > 0) {
                downloadSpeed = Math.round(((totalDownload - lastDownload) / timeDiff) / 1024 * 8);
                uploadSpeed = Math.round(((totalUpload - lastUpload) / timeDiff) / 1024 * 8);
                lastDownload = totalDownload;
                lastUpload = totalUpload;
                lastTime = currentTime;
                updateDisplay();
            }
        }
        function updateDisplay() {
            const dlSpeedElem = document.getElementById('dl-speed');
            const ulSpeedElem = document.getElementById('ul-speed');
            const dlTotalElem = document.getElementById('dl-total');
            const ulTotalElem = document.getElementById('ul-total');
            if (dlSpeedElem && isNetMonitorActive) {
                dlSpeedElem.textContent = `${downloadSpeed} Kb/s`;
                ulSpeedElem.textContent = `${uploadSpeed} Kb/s`;
                dlTotalElem.textContent = `${Math.round(totalDownload / 1024)} Kb`;
                ulTotalElem.textContent = `${Math.round(totalUpload / 1024)} Kb`;
            }
        }
        function updateTrackerDisplay() {
            const trackerElem = document.getElementById('tracker-count');
            if (trackerElem && isNetMonitorActive) trackerElem.textContent = trackerRequests;
        }
        const statsInterval = setInterval(() => {
            if (isNetMonitorActive) updateStats();
            else clearInterval(statsInterval);
        }, 1000);
    }

    function deactivateNetMonitor() {
        if (netMonitorWidget) netMonitorWidget.style.display = 'none';
        isNetMonitorActive = false;
        updateNetMonitorButton();
    }

    function updateNetMonitorButton() {
        const netmonitorBtn = document.querySelector('[data-button="netmonitor"]');
        if (netmonitorBtn) netmonitorBtn.style.background = isNetMonitorActive ? '#27ae60' : buttonBackground;
    }

    // ========== ADBLOCKER FUNCTIONS ========== //
    function toggleAdBlockMode() {
        isAdBlockActive = !isAdBlockActive;
        const adblockIndicator = document.getElementById('adblock-indicator');
        if (adblockIndicator) {
            adblockIndicator.style.background = isAdBlockActive ? '#f44336' : 'transparent';
            adblockIndicator.style.opacity = isAdBlockActive ? '1' : '0';
        }
        if (!isAdBlockActive) removeHighlight();
        closePanel();
    }

    function handleAdBlockSelection(e) {
        const element = document.elementFromPoint(e.touches[0].clientX, e.touches[0].clientY);
        if (!element) return;
        highlightElement(element);
        copyToClipboard(`##${getCssSelector(element)}`);
        
        // FIXED LOGIC: auto disable after selection (like in Ninja AdBlocker)
        setTimeout(() => {
            removeHighlight();
            toggleAdBlockMode(); // Auto reset mode
        }, HIGHLIGHT_DURATION);
    }

    function highlightElement(el) {
        const rect = el.getBoundingClientRect();
        const highlight = document.createElement('div');
        highlight.style.cssText = `
            position: absolute !important; left: ${rect.left + window.scrollX}px !important;
            top: ${rect.top + window.scrollY}px !important; width: ${rect.width}px !important;
            height: ${rect.height}px !important; background: rgba(255,0,0,0.2) !important;
            border: 1px dashed red !important; z-index: 2147483646 !important; pointer-events: none !important;
        `;
        highlight.dataset.adblockHighlight = 'true';
        document.body.appendChild(highlight);
    }

    function getCssSelector(el) {
        const path = [];
        while (el && el !== document.body) {
            let selector = el.tagName.toLowerCase();
            if (el.id) {
                selector += `#${el.id}`;
                path.unshift(selector);
                break;
            } else {
                if (el.className) selector += `.${el.className.toString().trim().replace(/\s+/g, '.')}`;
                path.unshift(selector);
                el = el.parentNode;
            }
        }
        return path.join(' > ');
    }

    function copyToClipboard(text) {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
    }

    function removeHighlight() {
        document.querySelectorAll('[data-adblock-highlight="true"]').forEach(el => el.remove());
    }

    // ========== ADBLOCKER HANDLERS ========== //
    document.addEventListener('touchstart', (e) => {
        if (isAdBlockActive) {
            adBlockStartX = e.touches[0].clientX;
            adBlockStartY = e.touches[0].clientY;
        }
    }, {passive: true});

    document.addEventListener('touchmove', (e) => {
        if (!isAdBlockActive || !adBlockStartX) return;
        const diffX = Math.abs(e.touches[0].clientX - adBlockStartX);
        if (diffX > SWIPE_THRESHOLD) handleAdBlockSelection(e);
    }, {passive: true});

    // ========== WIDGET FUNCTIONS ========== //
    function createWidget(config, columns, title) {
        closeCurrentWidget();
        const rows = Math.ceil(config.length / columns);
        const widget = document.createElement('div');
        widget.className = 'custom-widget';
        widget.style.cssText = `
            position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
            background: ${panelBackground}; padding: 2vh; border-radius: 1vh; z-index: 10001;
            display: grid; grid-template-columns: repeat(${columns}, 1fr); grid-template-rows: repeat(${rows}, auto);
            gap: 1vh; max-width: 90vw; max-height: 90vh; overflow-y: auto; box-shadow: 0 0 20px rgba(0,0,0,0.5);
        `;
        config.forEach(item => {
            const btn = document.createElement('button');
            btn.style.cssText = `
                display: flex; flex-direction: column; align-items: center; justify-content: center;
                padding: 1.5vh 0.5vw; background: ${buttonBackground}; color: ${textColor}; text-decoration: none;
                border-radius: 0.5vh; font-size: 1.6vmax; text-align: center; cursor: pointer;
                border: none; min-height: 8vh; gap: 0.5vh;
                transition: background 0.3s;
            `;
            
            btn.addEventListener('mouseenter', () => {
                btn.style.background = buttonHoverBackground;
            });
            btn.addEventListener('mouseleave', () => {
                btn.style.background = buttonBackground;
            });

            if (item.icon) {
                const icon = document.createElement('img');
                icon.src = item.icon;
                icon.style.cssText = `width: 3vmax; height: 3vmax; min-width: 3vmax; min-height: 3vmax;`;
                icon.onerror = () => { icon.style.display = 'none'; };
                btn.appendChild(icon);
            }
            const text = document.createElement('span');
            text.textContent = item.text;
            text.style.cssText = `
                font-size: 1.4vmax; white-space: nowrap; overflow: hidden;
                text-overflow: ellipsis; max-width: 100%; color: ${textColor};
            `;
            btn.appendChild(text);
            if (item.url) {
                btn.onclick = () => {
                    if (title === 'Select Translator') translatePage(item.url);
                    else window.open(item.url, '_blank');
                    closeCurrentWidget();
                };
            } else if (item.action) {
                if (title === 'Amoled Tools') btn.onclick = () => executeAmoledTool(item.action);
                else btn.onclick = () => executeDevTool(item.action);
            }
            widget.appendChild(btn);
        });
        const closeBtn = document.createElement('button');
        closeBtn.textContent = '×';
        closeBtn.style.cssText = `
            position: absolute; top: 1vh; right: 1vh; background: #e74c3c; color: white;
            border: none; border-radius: 50%; width: 4vh; height: 4vh; font-size: 2.5vmax;
            cursor: pointer; display: flex; align-items: center; justify-content: center;
        `;
        closeBtn.onclick = closeCurrentWidget;
        widget.appendChild(closeBtn);
        document.body.appendChild(widget);
        currentWidget = widget;
    }

    function closeCurrentWidget() {
        if (currentWidget) {
            currentWidget.remove();
            currentWidget = null;
        }
    }

    // ========== MAIN BUTTONS ========== //
    function createMainButton(config) {
        const btn = document.createElement('div');
        btn.style.cssText = `
            display: flex; flex-direction: column; align-items: center; text-decoration: none;
            color: ${textColor}; width: ${buttonWidth}; height: ${buttonHeight}; min-height: ${buttonHeight};
            border-radius: 12px; background: ${config.background || buttonBackground}; justify-content: center;
            transition: transform 0.2s, background 0.3s; cursor: pointer; flex-shrink: 0; padding: 0 1vw;
        `;
        
        btn.addEventListener('mouseenter', () => { 
            btn.style.transform = 'scale(1.05)'; 
            btn.style.background = buttonHoverBackground;
        });
        btn.addEventListener('mouseout', () => { 
            btn.style.transform = 'scale(1)'; 
            btn.style.background = config.background || buttonBackground;
        });

        const text = document.createElement('span');
        text.textContent = config.text;
        text.style.cssText = `
            font-size: 1.4vmax; white-space: nowrap; overflow: hidden;
            text-overflow: ellipsis; max-width: 100%; text-align: center; color: ${textColor};
        `;
        btn.appendChild(text);

        // Assign handlers for all buttons
        if (config.text === 'Search') {
            btn.onclick = toggleSearchWidget;
        } else if (config.text === 'Translate') {
            btn.onclick = showTranslateWidget;
        } else if (config.text === 'AdBlock+') {
            btn.onclick = toggleAdBlockMode;
        } else if (config.text === 'Netmonitor') {
            btn.onclick = toggleNetMonitor;
        } else if (config.text === 'Amoled') {
            btn.onclick = toggleAmoledWidget;
        } else if (config.text === 'Favorites') {
            btn.onclick = () => createWidget(favoritesConfig, 3, 'Favorites');
        } else if (config.text === 'AI') {
            btn.onclick = () => createWidget(aiConfig, 2, 'AI');
        } else if (config.text === 'Proxy') {
            btn.onclick = () => createWidget(proxyConfig, 2, 'Proxy');
        } else if (config.text === 'Network') {
            btn.onclick = () => createWidget(networkTools, 3, 'Network Tools');
        } else if (config.text === 'Utilities') {
            btn.onclick = () => createWidget(utilities, 2, 'Utilities');
        } else if (config.text === 'WebRTC p2p Chats') {
            btn.onclick = () => createWidget(webrtcChats, 2, 'WebRTC p2p Chats');
        } else if (config.text === 'FTP/Webdav') {
            btn.onclick = toggleFTPWidget;
        } else if (config.text === 'Files') {
            btn.onclick = openFileDialog;
        } else if (config.text === 'Dev Tools') {
            btn.onclick = toggleDevTools;
        }
        return btn;
    }

    // ========== SEARCH WIDGET ========== //
    function toggleSearchWidget() {
        if (!searchWidget) createSearchWidget();
        if (searchWidgetVisible) {
            searchWidget.style.transform = 'translateY(100%)';
            searchWidgetVisible = false;
        } else {
            searchWidget.style.transform = 'translateY(0)';
            searchWidgetVisible = true;
            // Focus input after opening
            setTimeout(() => {
                const iframe = searchWidget.querySelector('iframe');
                if (iframe && iframe.contentWindow) {
                    try {
                        iframe.contentWindow.document.getElementById('searchInput')?.focus();
                    } catch (e) {
                        console.log('Cannot focus search input:', e);
                    }
                }
            }, 300);
        }
        closePanel();
    }

    function createSearchWidget() {
        if (searchWidget) return;
        
        const widgetHTML = `
<!DOCTYPE html>
<html>
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body, html { margin: 0; padding: 0; height: 100%; overflow: hidden; background: transparent; font-family: Arial, sans-serif; }
        .widget-container { padding: 15px; background: white; border-top: 1px solid #ccc; box-shadow: 0 -2px 10px rgba(0,0,0,0.1); width: 100%; box-sizing: border-box; height: 100%; overflow-y: auto; }
        .engine-selector { display: flex; margin-bottom: 15px; flex-wrap: wrap; gap: 12px; justify-content: center; }
        .engine-option { display: flex; flex-direction: column; align-items: center; cursor: pointer; padding: 8px; border-radius: 8px; transition: background 0.2s; min-width: 60px; }
        .engine-option:hover { background: #f0f0f0; }
        .engine-option input { display: none; }
        .engine-icon { width: 40px; height: 40px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 20px; font-weight: bold; color: white; margin-bottom: 6px; }
        .engine-name { font-size: 11px; color: #666; text-align: center; }
        .engine-option input:checked + .engine-content .engine-icon { box-shadow: 0 0 0 2px #007BFF; }
        
        .search-row { display: flex; flex-direction: column; gap: 10px; width: 100%; }
        #searchInput { padding: 12px; border: 1px solid #ccc; border-radius: 8px; font-size: 16px; width: 100%; box-sizing: border-box; }
        .buttons-row { display: flex; gap: 8px; width: 100%; }
        #searchButton { padding: 12px; background: #007BFF; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 16px; flex: 2; }
        #queryGeneratorButton { padding: 12px; background: #28a745; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 16px; flex: 1; }
        .close-button { position: absolute; top: 10px; right: 10px; background: #e74c3c; color: white; border: none; border-radius: 50%; width: 30px; height: 30px; font-size: 18px; cursor: pointer; display: flex; align-items: center; justify-content: center; }
        
        .query-generator { margin-top: 15px; padding: 15px; background: #f8f9fa; border-radius: 8px; border: 1px solid #dee2e6; display: none; }
        .query-generator.active { display: block; }
        .generator-row { display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 10px; }
        .form-group { flex: 1; min-width: 200px; }
        .form-group label { display: block; margin-bottom: 5px; font-weight: bold; font-size: 14px; color: #333; }
        .form-group select, .form-group input { width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px; font-size: 14px; box-sizing: border-box; }
        .checkbox-group { display: flex; align-items: center; gap: 5px; margin-bottom: 5px; }
        .checkbox-group input { width: auto; }
        .checkbox-group label { margin: 0; font-size: 14px; }
        .generator-result { margin-top: 15px; padding: 10px; background: #e9ecef; border-radius: 4px; border: 1px dashed #6c757d; }
        .generator-buttons { display: flex; gap: 8px; margin-top: 10px; }
        #generateQueryButton { padding: 8px 12px; background: #17a2b8; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 14px; flex: 1; }
        #copyQueryButton { padding: 8px 12px; background: #6f42c1; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 14px; flex: 1; display: none; }
        #applyQueryButton { padding: 8px 12px; background: #28a745; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 14px; flex: 1; display: none; }
    </style>
</head>
<body>
    <div class="widget-container">
        <button class="close-button" id="closeButton" title="Close">×</button>
        <div class="engine-selector">
            <label class="engine-option" title="Google">
                <input type="radio" name="engine" value="google" checked>
                <div class="engine-content">
                    <div class="engine-icon" style="background: #4285F4;">G</div>
                    <div class="engine-name">Google</div>
                </div>
            </label>
            <label class="engine-option" title="Yandex">
                <input type="radio" name="engine" value="yandex">
                <div class="engine-content">
                    <div class="engine-icon" style="background: #FF0000;">Y</div>
                    <div class="engine-name">Yandex</div>
                </div>
            </label>
            <label class="engine-option" title="DuckDuckGo">
                <input type="radio" name="engine" value="duckduckgo">
                <div class="engine-content">
                    <div class="engine-icon" style="background: #DE5833;">D</div>
                    <div class="engine-name">DDG</div>
                </div>
            </label>
            <label class="engine-option" title="Perplexity">
                <input type="radio" name="engine" value="perplexity">
                <div class="engine-content">
                    <div class="engine-icon" style="background: #6B7280;">P</div>
                    <div class="engine-name">Perplexity</div>
                </div>
            </label>
        </div>
        <div class="search-row">
            <input type="text" id="searchInput" placeholder="Enter query or URL">
            <div class="buttons-row">
                <button id="searchButton">Search</button>
                <button id="queryGeneratorButton">⚙️</button>
            </div>
        </div>
        
        <div class="query-generator" id="queryGenerator">
            <h3 style="margin: 0 0 10px 0; font-size: 16px; color: #333;">Search Query Generator</h3>
            
            <div class="generator-row">
                <div class="form-group">
                    <label for="generatorEngine">Search Engine:</label>
                    <select id="generatorEngine">
                        <option value="google">Google</option>
                        <option value="yandex">Yandex</option>
                        <option value="duckduckgo">DuckDuckGo</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="searchRegion">Search Region:</label>
                    <select id="searchRegion">
                        <option value="">Any region</option>
                        <option value="ru">Russia</option>
                        <option value="ua">Ukraine</option>
                        <option value="by">Belarus</option>
                        <option value="kz">Kazakhstan</option>
                        <option value="us">USA</option>
                        <option value="de">Germany</option>
                        <option value="fr">France</option>
                        <option value="gb">UK</option>
                    </select>
                </div>
            </div>
            
            <div class="form-group">
                <label>Result Language:</label>
                <div class="checkbox-group">
                    <input type="checkbox" id="langRu" value="ru" checked>
                    <label for="langRu">Russian</label>
                </div>
                <div class="checkbox-group">
                    <input type="checkbox" id="langEn" value="en">
                    <label for="langEn">English</label>
                </div>
                <div class="checkbox-group">
                    <input type="checkbox" id="langUa" value="uk">
                    <label for="langUa">Ukrainian</label>
                </div>
            </div>
            
            <div class="form-group">
                <label for="whiteList">Whitelist sites:</label>
                <input type="text" id="whiteList" placeholder="example.com, example.org">
                <small style="font-size: 12px; color: #666;">Comma separated, without http://</small>
            </div>
            
            <div class="generator-row">
                <div class="checkbox-group">
                    <input type="checkbox" id="exactMatch">
                    <label for="exactMatch">Exact match (add "")</label>
                </div>
                <div class="checkbox-group">
                    <input type="checkbox" id="excludeDuplicates">
                    <label for="excludeDuplicates">Exclude duplicates</label>
                </div>
            </div>
            
            <div class="generator-result" id="generatorResult" style="display: none;">
                <strong>Generated URL:</strong>
                <div id="generatedUrl" style="word-break: break-all; font-size: 12px; margin-top: 5px; font-family: monospace;"></div>
            </div>
            
            <div class="generator-buttons">
                <button id="generateQueryButton">Generate</button>
                <button id="copyQueryButton">Copy URL</button>
                <button id="applyQueryButton">Apply to Search</button>
            </div>
        </div>
    </div>
    <script>
        const searchInput = document.getElementById('searchInput');
        const searchButton = document.getElementById('searchButton');
        const closeButton = document.getElementById('closeButton');
        const queryGeneratorButton = document.getElementById('queryGeneratorButton');
        const queryGenerator = document.getElementById('queryGenerator');
        
        const generatorEngine = document.getElementById('generatorEngine');
        const searchRegion = document.getElementById('searchRegion');
        const whiteList = document.getElementById('whiteList');
        const exactMatch = document.getElementById('exactMatch');
        const excludeDuplicates = document.getElementById('excludeDuplicates');
        const generateQueryButton = document.getElementById('generateQueryButton');
        const copyQueryButton = document.getElementById('copyQueryButton');
        const applyQueryButton = document.getElementById('applyQueryButton');
        const generatorResult = document.getElementById('generatorResult');
        const generatedUrl = document.getElementById('generatedUrl');
        
        let currentGeneratedUrl = '';
        
        function isDomain(input) { 
            return /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(input); 
        }
        
        function performSearch() {
            const query = searchInput.value.trim();
            if (!query) return;
            
            const engine = document.querySelector('input[name="engine"]:checked').value;
            if (isDomain(query)) {
                window.parent.location.href = query.startsWith('http') ? query : 'https://' + query;
            } else {
                const urls = {
                    google: 'https://www.google.com/search?q=' + encodeURIComponent(query),
                    yandex: 'https://yandex.ru/search/?text=' + encodeURIComponent(query),
                    duckduckgo: 'https://duckduckgo.com/?q=' + encodeURIComponent(query),
                    perplexity: 'https://www.perplexity.ai/search?q=' + encodeURIComponent(query)
                };
                window.parent.location.href = urls[engine];
            }
        }
        
        function toggleQueryGenerator() {
            const selectedEngine = document.querySelector('input[name="engine"]:checked').value;
            
            if (selectedEngine === 'perplexity') {
                alert('Query generator not supported for Perplexity');
                return;
            }
            
            queryGenerator.classList.toggle('active');
            generatorEngine.value = selectedEngine;
        }
        
        function generateSearchQuery() {
            const baseQuery = searchInput.value.trim();
            if (!baseQuery) {
                alert('Enter search query');
                return;
            }
            
            let finalQuery = baseQuery;
            
            if (exactMatch.checked) {
                finalQuery = '"' + finalQuery + '"';
            }
            
            if (whiteList.value.trim()) {
                const sites = whiteList.value.split(',').map(site => site.trim()).filter(site => site);
                if (sites.length > 0) {
                    const siteQuery = sites.map(site => 'site:' + site).join(' OR ');
                    finalQuery = finalQuery + ' (' + siteQuery + ')';
                }
            }
            
            if (excludeDuplicates.checked && generatorEngine.value === 'google') {
                finalQuery += ' -inurl:(dup|duplicate)';
            }
            
            let searchUrl = '';
            const encodedQuery = encodeURIComponent(finalQuery);
            
            switch(generatorEngine.value) {
                case 'google':
                    searchUrl = 'https://www.google.com/search?q=' + encodedQuery;
                    if (searchRegion.value) {
                        searchUrl += '&gl=' + searchRegion.value;
                    }
                    const languages = [];
                    if (document.getElementById('langRu').checked) languages.push('lang_ru');
                    if (document.getElementById('langEn').checked) languages.push('lang_en');
                    if (document.getElementById('langUa').checked) languages.push('lang_uk');
                    if (languages.length > 0) {
                        searchUrl += '&lr=' + languages.join(',');
                    }
                    break;
                    
                case 'yandex':
                    searchUrl = 'https://yandex.ru/search/?text=' + encodedQuery;
                    if (searchRegion.value) {
                        const regions = { ru: 225, ua: 187, by: 149, kz: 159 };
                        if (regions[searchRegion.value]) {
                            searchUrl += '&lr=' + regions[searchRegion.value];
                        }
                    }
                    break;
                    
                case 'duckduckgo':
                    searchUrl = 'https://duckduckgo.com/?q=' + encodedQuery;
                    break;
            }
            
            currentGeneratedUrl = searchUrl;
            generatedUrl.textContent = searchUrl;
            generatorResult.style.display = 'block';
            copyQueryButton.style.display = 'block';
            applyQueryButton.style.display = 'block';
        }
        
        function copyGeneratedUrl() {
            if (!currentGeneratedUrl) return;
            
            navigator.clipboard.writeText(currentGeneratedUrl).then(() => {
                alert('URL copied to clipboard!');
            }).catch(() => {
                const textarea = document.createElement('textarea');
                textarea.value = currentGeneratedUrl;
                document.body.appendChild(textarea);
                textarea.select();
                document.execCommand('copy');
                document.body.removeChild(textarea);
                alert('URL copied to clipboard!');
            });
        }
        
        function applyGeneratedUrl() {
            if (!currentGeneratedUrl) return;
            window.parent.location.href = currentGeneratedUrl;
        }
        
        searchButton.addEventListener('click', performSearch);
        searchInput.addEventListener('keypress', (e) => { 
            if (e.key === 'Enter') performSearch(); 
        });
        
        queryGeneratorButton.addEventListener('click', toggleQueryGenerator);
        generateQueryButton.addEventListener('click', generateSearchQuery);
        copyQueryButton.addEventListener('click', copyGeneratedUrl);
        applyQueryButton.addEventListener('click', applyGeneratedUrl);
        
        document.querySelectorAll('input[name="engine"]').forEach(radio => {
            radio.addEventListener('change', function() {
                generatorEngine.value = this.value;
                if (this.value === 'perplexity' && queryGenerator.classList.contains('active')) {
                    queryGenerator.classList.remove('active');
                }
            });
        });
        
        generatorEngine.addEventListener('change', function() {
            document.querySelector('input[name="engine"][value="' + this.value + '"]').checked = true;
        });
        
        closeButton.addEventListener('click', () => { 
            window.parent.postMessage({type: 'CLOSE_SEARCH_WIDGET'}, '*'); 
        });
        
        document.addEventListener('DOMContentLoaded', () => { 
            searchInput.focus(); 
        });
        
        document.addEventListener('keydown', (e) => { 
            if (e.key === 'Escape') window.parent.postMessage({type: 'CLOSE_SEARCH_WIDGET'}, '*'); 
        });
    </script>
</body>
</html>`;
        
        searchWidget = document.createElement('div');
        searchWidget.id = 'search-widget-panel';
        searchWidget.style.cssText = `
            position: fixed; 
            bottom: 0; 
            left: 0; 
            width: 100%; 
            background: white;
            border-top: 1px solid #ccc; 
            z-index: 10000; 
            transform: translateY(100%);
            transition: transform 0.3s ease; 
            box-shadow: 0 -4px 20px rgba(0,0,0,0.15);
            max-height: 70vh; 
            overflow: hidden;
        `;
        
        const iframe = document.createElement('iframe');
        iframe.style.cssText = `
            border: none; 
            background: transparent; 
            width: 100%; 
            height: 70vh; 
            min-height: 400px;
        `;
        iframe.srcdoc = widgetHTML;
        
        searchWidget.appendChild(iframe);
        document.body.appendChild(searchWidget);
        
        window.addEventListener('message', (e) => {
            if (e.data.type === 'CLOSE_SEARCH_WIDGET') {
                toggleSearchWidget();
            }
        });
    }

    // ========== FILE DIALOG ========== //
    function openFileDialog() {
        isNetMonitorActive = false;
        deactivateNetMonitor();
        updateNetMonitorButton();
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.onchange = async (e) => {
            const file = e.target.files[0];
            if (!file) return;
            try {
                originalPageContent = document.documentElement.outerHTML;
                const ext = file.name.toLowerCase().split('.').pop();
                if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext)) {
                    const url = await readFileAsDataURL(file);
                    showImage(url);
                }
                else if (['mp3', 'wav', 'ogg'].includes(ext)) {
                    const url = await readFileAsDataURL(file);
                    showAudio(url, file.name);
                }
                else if (['mp4', 'webm'].includes(ext)) {
                    const url = await readFileAsDataURL(file);
                    showVideo(url);
                }
                else if (ext === 'pdf') {
                    const url = await readFileAsDataURL(file);
                    showPDF(url);
                }
                else if (['html', 'htm'].includes(ext)) {
                    const content = await readFileAsText(file);
                    showHTML(content);
                }
                else if (['url', 'webloc'].includes(ext)) {
                    const content = await readFileAsText(file);
                    handleShortcut(content, ext);
                }
                else {
                    const content = await readFileAsText(file);
                    showText(content);
                }
            } catch {}
        };
        fileInput.click();
        closePanel();
    }

    function readFileAsText(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = e => resolve(e.target.result);
            reader.onerror = reject;
            reader.readAsText(file);
        });
    }

    function readFileAsDataURL(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = e => resolve(e.target.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    function createBackButton() {
        const backBtn = document.createElement('button');
        backBtn.textContent = '×';
        backBtn.title = 'Go back';
        backBtn.style.cssText = `
            position: fixed; top: 10px; right: 10px; background: #e74c3c; color: white;
            border: none; border-radius: 50%; width: 40px; height: 40px; font-size: 20px;
            cursor: pointer; z-index: 10000; display: flex; align-items: center; justify-content: center;
            box-shadow: 0 2px 5px rgba(0,0,0,0.3);
        `;
        backBtn.addEventListener('click', restoreOriginalPage);
        return backBtn;
    }

    function restoreOriginalPage() {
        if (originalPageContent) {
            document.documentElement.innerHTML = originalPageContent;
            setTimeout(init, 100);
        } else window.location.reload();
    }

    function showImage(url) {
        document.body.innerHTML = '';
        document.body.style.cssText = 'margin:0; padding:2vh; background:#f0f0f0; display:flex; justify-content:center; align-items:center; min-height:100vh;';
        const img = document.createElement('img');
        img.src = url;
        img.style.cssText = 'max-width:100%; max-height:100vh;';
        document.body.appendChild(img);
        document.body.appendChild(createBackButton());
    }

    function showAudio(url, name) {
        document.body.innerHTML = '';
        document.body.style.cssText = 'margin:0; background:#2c3e50; min-height:100vh; display:flex; flex-direction:column; justify-content:center; align-items:center;';
        const container = document.createElement('div');
        container.style.cssText = 'text-align:center; color:white; padding:4vh 2vh;';
        const title = document.createElement('h2');
        title.textContent = name;
        title.style.cssText = 'font-size:2.5vmax; margin-bottom:2vh;';
        const audio = document.createElement('audio');
        audio.src = url;
        audio.controls = true;
        audio.autoplay = true;
        audio.style.cssText = 'width:100%; max-width:80vw; margin:2vh 0;';
        container.appendChild(title);
        container.appendChild(audio);
        document.body.appendChild(container);
        document.body.appendChild(createBackButton());
    }

    function showVideo(url) {
        document.body.innerHTML = '';
        document.body.style.cssText = 'margin:0; padding:2vh; background:black; display:flex; justify-content:center; align-items:center; min-height:100vh;';
        const video = document.createElement('video');
        video.src = url;
        video.controls = true;
        video.autoplay = true;
        video.style.cssText = 'max-width:100%; max-height:100vh;';
        document.body.appendChild(video);
        document.body.appendChild(createBackButton());
    }

    function showPDF(url) {
        document.body.innerHTML = '';
        document.body.style.cssText = 'margin:0; background:#f0f0f0;';
        const embed = document.createElement('embed');
        embed.src = url;
        embed.type = 'application/pdf';
        embed.style.cssText = 'width:100%; height:100vh; border:none;';
        document.body.appendChild(embed);
        document.body.appendChild(createBackButton());
    }

    function showHTML(content) {
        document.open();
        document.write(content);
        document.close();
        setTimeout(() => {
            const backBtn = createBackButton();
            document.body.appendChild(backBtn);
        }, 100);
    }

    function showText(content) {
        document.body.innerHTML = '';
        document.body.style.cssText = 'margin:0; background:white; min-height:100vh;';
        const pre = document.createElement('pre');
        pre.textContent = content;
        pre.style.cssText = 'font-size:2vmax; line-height:1.4; white-space:pre-wrap; padding:2vh; margin:0; color:black;';
        document.body.appendChild(pre);
        document.body.appendChild(createBackButton());
    }

    function handleShortcut(content, ext) {
        let url = '';
        if (ext === 'url') {
            const match = content.match(/URL=(.+)/i);
            url = match ? match[1] : '';
        }
        else if (ext === 'webloc') {
            const match = content.match(/<string>(.+?)<\/string>/i);
            url = match ? match[1] : '';
        }
        if (url) window.location.href = url;
    }

    // ========== PANEL MANAGEMENT ========== //
    function togglePanel() {
        const panel = document.getElementById('custom-side-panel');
        if (panel) {
            if (panel.style.left === '0px') closePanel();
            else openPanel();
        }
    }

    function openPanel() {
        const panel = document.getElementById('custom-side-panel');
        if (panel) panel.style.left = '0';
    }

    function closePanel() {
        const panel = document.getElementById('custom-side-panel');
        if (panel) panel.style.left = `-${panelWidth}`;
        closeCurrentWidget();
    }

    document.addEventListener('click', function(e) {
        const panel = document.getElementById('custom-side-panel');
        const toggleButton = document.getElementById('panel-toggle-button');
        if (panel && toggleButton) {
            if (!panel.contains(e.target) && e.target !== toggleButton && !toggleButton.contains(e.target)) closePanel();
        }
    });

    // ========== MAIN INITIALIZATION ========== //
    function init() {
        const oldToggle = document.getElementById('panel-toggle-button');
        if (oldToggle) oldToggle.remove();
        const oldPanel = document.getElementById('custom-side-panel');
        if (oldPanel) oldPanel.remove();
        const oldAdblockIndicator = document.getElementById('adblock-indicator');
        if (oldAdblockIndicator) oldAdblockIndicator.remove();
        const adblockIndicator = document.createElement('div');
        adblockIndicator.id = 'adblock-indicator';
        adblockIndicator.style.cssText = `
            position: fixed !important; bottom: 12px !important; left: 12px !important;
            width: 12px !important; height: 12px !important; border-radius: 50% !important;
            background: transparent !important; z-index: 2147483647 !important;
            border: 1px solid rgba(255,255,255,0.9) !important; pointer-events: none !important;
            opacity: 0 !important; transition: opacity 0.3s !important;
        `;
        document.body.appendChild(adblockIndicator);
        const toggleButton = document.createElement('div');
        toggleButton.id = 'panel-toggle-button';
        toggleButton.style.cssText = `
            position: fixed !important; bottom: 0 !important; left: 0 !important;
            width: 65px !important; height: 65px !important; background: transparent !important;
            border: 2px solid rgba(0,0,0,0.9) !important; z-index: 10000 !important;
            cursor: pointer !important; min-width: 65px !important; min-height: 65px !important;
        `;
        toggleButton.addEventListener('click', togglePanel);
        document.body.appendChild(toggleButton);
        const panel = document.createElement('div');
        panel.id = 'custom-side-panel';
        panel.style.cssText = `
            position: fixed !important; left: -${panelWidth} !important; top: 0 !important;
            width: ${panelWidth} !important; height: 100vh !important; background: ${panelBackground} !important;
            transition: left 0.3s ease !important; z-index: 9999 !important; overflow-y: auto !important;
            box-shadow: 2px 0 10px rgba(0,0,0,0.2) !important;
        `;
        const buttonsContainer = document.createElement('div');
        buttonsContainer.style.cssText = `
            display: flex; flex-direction: column; align-items: center; gap: ${gapSize};
            position: absolute; top: ${topMargin}; bottom: ${bottomMargin}; left: 0.5vw; right: 0.5vw;
            padding: 1vh 0; overflow-y: auto; justify-content: flex-start;
        `;
        const mainButtonsConfig = [
            { text: 'Search' },
            { text: 'Translate' },
            { text: 'AdBlock+' },
            { text: 'Netmonitor' },
            { text: 'Amoled' },
            { type: 'separator' },
            { text: 'Favorites' },
            { text: 'AI' },
            { text: 'Proxy' },
            { text: 'Network' },
            { text: 'Utilities' },
            { text: 'WebRTC p2p Chats' },
            { type: 'separator' },
            { text: 'FTP/Webdav' },
            { text: 'Files' },
            { text: 'Dev Tools' }
        ];
        mainButtonsConfig.forEach(button => {
            if (button.type === 'separator') {
                const separator = document.createElement('div');
                separator.style.cssText = `
                    width: 80%; height: 1px; background: rgba(255,255,255,0.3);
                    margin: 0.5vh 0;
                `;
                buttonsContainer.appendChild(separator);
            } else {
                const btn = createMainButton(button);
                if (button.text === 'Netmonitor') btn.setAttribute('data-button', 'netmonitor');
                buttonsContainer.appendChild(btn);
            }
        });
        panel.appendChild(buttonsContainer);
        document.body.appendChild(panel);

        // Launch background scripts
        initApkDownloader();
        initAntiCopyBlock();
    }

    // ========== SCRIPT LAUNCH ========== //
    init();
})();