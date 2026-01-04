// ==UserScript==
// @name            Universal Auto-Clicker & Bypass | AdFly + Shorteners | Time Warp
// @name:pt         Universal Auto-Clicker & Bypass | AdFly + Encurtadores | Acelerar Tempo
// @name:es         Universal Auto-Clicker & Bypass | AdFly + Acortadores | Acelerar Tiempo
// @name:fr         Universal Auto-Clicker & Bypass | AdFly + Raccourcisseurs | Accélérer Temps
// @name:de         Universal Auto-Clicker & Bypass | AdFly + Verkürzer | Zeitbeschleunigung
// @name:it         Universal Auto-Clicker & Bypass | AdFly + Accorciatori | Accelerare Tempo
// @name:ru         Universal Auto-Clicker & Bypass | AdFly + Сокращатели | Ускорение Времени
// @name:ja         Universal Auto-Clicker & Bypass | AdFly + 短縮リンク | タイムワープ
// @name:ko         Universal Auto-Clicker & Bypass | AdFly + 단축 링크 | 타임 워프
// @name:zh         Universal Auto-Clicker & Bypass | AdFly + 短链接 | 时间扭曲
// @namespace       https://tampermonkey.net/
// @version         1.5.2
// @description     Intelligent Auto-Clicker tool that navigates through shorteners and accelerates countdown timers automatically. It is not a link resolver: it clicks and navigates for you!
// @description:pt  Ferramenta de Auto-Clique Inteligente que navega por encurtadores e acelera contagens regressivas automaticamente. Não é um resolvedor de links: ele clica e navega por você!
// @description:es  Herramienta de Auto-Click Inteligente que navega por acortadores y acelera temporizadores automáticamente. No es un solucionador de enlaces: ¡hace clic y navega por ti!
// @description:fr  Outil intelligent d'auto-clic qui navigue à travers les raccourcisseurs et accélère les comptes à rebours automatiquement. Ce n'est pas un résolveur de liens : il clique et navigue pour vous !
// @description:de  Intelligentes Auto-Klicker-Tool, das durch Verkürzer navigiert und Countdown-Timer automatisch beschleunigt. Kein Link-Resolver: Es klickt und navigiert für Sie!
// @description:it  Strumento intelligente di Auto-Click che naviga attraverso accorciatori e accelera automaticamente i timer del conto alla rovescia. Non è un risolutore di link: clicca e naviga per te!
// @description:ru  Умный инструмент авто-клика, который проходит через сокращатели и автоматически ускоряет таймеры обратного отсчета. Это не решатель ссылок: он кликает и перемещается за вас!
// @description:ja  短縮リンクをナビゲートし、カウントダウンタイマーを自動的に加速するインテリジェントなオートクリッカーツール。リンクレゾルバではありません：あなたのためにクリックしてナビゲートします！
// @description:ko  단축 링크를 탐색하고 카운트다운 타이머를 자동으로 가속하는 지능형 자동 클릭 도구입니다. 링크 리졸버가 아닙니다: 당신을 위해 클릭하고 탐색합니다!
// @description:zh  智能自动点击工具，自动导航短链接并加速倒计时计时器。它不是链接解析器：它为您点击和导航！
// @author          Tauã B. Kloch Leite
// @icon            https://www.iconsdb.com/icons/preview/barbie-pink/login-xxl.png
// @match           *://*/*
// @grant           GM_setValue
// @grant           GM_getValue
// @grant           GM_registerMenuCommand
// @grant           GM_addStyle
// @grant           unsafeWindow
// @run-at          document-start
// @downloadURL https://update.greasyfork.org/scripts/558694/Universal%20Auto-Clicker%20%20Bypass%20%7C%20AdFly%20%2B%20Shorteners%20%7C%20Time%20Warp.user.js
// @updateURL https://update.greasyfork.org/scripts/558694/Universal%20Auto-Clicker%20%20Bypass%20%7C%20AdFly%20%2B%20Shorteners%20%7C%20Time%20Warp.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (window.self !== window.top) {
        return;
    }

    const win = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window;
    const host = win.location.hostname;

    const safeSites = [
        'openai.com', 'chatgpt.com', 'gemini.google.com', 'deepseek.com', 'deepseek.ai',
        'perplexity.ai', 'claude.ai', 'anthropic.com', 'bing.com', 'copilot.microsoft.com',
        'poe.com', 'quora.com', 'jasper.ai', 'copy.ai', 'character.ai', 'huggingface.co',
        'midjourney.com', 'leonardo.ai', 'runwayml.com', 'civitai.com', 'tensor.art',
        'binance.com', 'coinbase.com', 'bybit.com', 'kucoin.com', 'okx.com', 'gate.io', 'gate.com',
        'mexc.com', 'bitget.com', 'kraken.com', 'huobi.com', 'htx.com', 'crypto.com',
        'bitfinex.com', 'gemini.com', 'pancakeswap.finance', 'uniswap.org', 'metamask.io',
        'phantom.app', 'ledger.com', 'trezor.io', 'coinmarketcap.com', 'coingecko.com',
        'tradingview.com', 'investing.com', 'dextools.io', 'dexscreener.com',
        'paypal.com', 'stripe.com', 'wise.com', 'revolut.com', 'payoneer.com', 'skrill.com',
        'chase.com', 'bankofamerica.com', 'wellsfargo.com', 'citi.com', 'americanexpress.com',
        'capitalone.com', 'gs.com', 'jpmorgan.com', 'westernunion.com', 'venmo.com', 'cash.app',
        'santander', 'hsbc', 'barclays', 'deutche-bank', 'bnp-paribas', 'ubs.com',
        'bbva', 'itau', 'bradesco', 'nubank', 'inter.co', 'hdfcbank.com', 'icicibank.com',
        'bank', 'banking', 'banque', 'banca', 'banco', 'login', 'signin', 'account',
        'github.com', 'gitlab.com', 'bitbucket.org', 'stackoverflow.com', 'npm',
        'aws.amazon.com', 'azure.microsoft.com', 'cloud.google.com', 'digitalocean.com',
        'vercel.com', 'netlify.com', 'heroku.com', 'cloudflare.com', 'cpanel', 'whm',
        'gmail.com', 'outlook.com', 'yahoo.com', 'proton.me', 'zoho.com', 'slack.com',
        'trello.com', 'notion.so', 'asana.com', 'jira', 'atlassian.net', 'figma.com', 'canva.com',
        'google.', 'youtube.com', 'facebook.com', 'instagram.com', 'twitter.com', 'x.com',
        'tiktok.com', 'linkedin.com', 'reddit.com', 'pinterest.com', 'tumblr.com', 'snapchat.com',
        'whatsapp.com', 'telegram.org', 'discord.com', 'twitch.tv', 'steamcommunity.com',
        'amazon.', 'ebay.', 'aliexpress.', 'temu.com', 'shopee.', 'walmart.', 'target.com',
        'netflix.com', 'primevideo.com', 'disneyplus.com', 'hulu.com', 'max.com', 'spotify.com',
        '.gov', '.edu', '.mil', '.org',
        'europa.eu', 'un.org', 'who.int', 'nasa.gov', 'wikipedia.org'
    ];

    let isSafeSite = false;
    for (const site of safeSites) {
        if (host.includes(site)) {
            isSafeSite = true;
            break;
        }
    }

    if (isSafeSite) {
        return;
    }

    const originalSetTimeout = win.setTimeout;
    const originalSetInterval = win.setInterval;

    let timeWarpSpeed = GM_getValue('uad_timewarp_speed', 3);
    let activeTimeWarpSpeed = timeWarpSpeed;
    let currentMode = GM_getValue('uad_mode', 0);
    let isMinimized = GM_getValue('uad_minimized', false);
    let isHidden = GM_getValue('uad_hidden', false);
    let hudSize = GM_getValue('uad_hud_size', 0.8);
    let currentStep = 0;
    let stepStartTime = 0;
    let clickHistory = new Map();
    let priorityScanStartTime = 0;
    let lastClickTime = 0;

    const stepRequiredTime = 25000;
    let currentWaitTime = stepRequiredTime;
    let maxWaitTime = 60000;

    let emptyScanCycles = 0;
    let maxEmptyScanCycles = 3;
    let currentScanInterval = 500;
    let minScanInterval = 100;
    let maxScanInterval = 1500;
    let scanIncrement = 250;
    let scanTimeout = null;
    let burstModeActive = false;

    let totalScanTime = 0;
    let maxTotalScanTime = 180000;
    let lastButtonFoundTime = 0;

    let cloudflareCheckInterval = null;
    let isCloudflareVerification = false;
    let cloudflareDetectionCount = 0;
    let initialLoadTime = Date.now();
    let cloudflareBypassAttempted = false;

    let lastPageUrl = win.location.href;
    let cloudflareCheckCount = 0;
    let maxCloudflareChecks = 5;
    let cloudflareMonitoringActive = true;
    let isInitialPageCheckComplete = false;

    const CLOUDFLARE_WAIT_TIME = 6000;

    function isInitialPage() {
        const path = win.location.pathname;
        const search = win.location.search;
        const hash = win.location.hash;

        const initialPagePatterns = [
            '/', '/index', '/home', '/main',
            'redirect', 'link', 'short', 'url', 'goto',
            'adf.ly', 'shorte.st', 'ouo.io', 'bc.vc', 'linkbucks',
            'adfoc.us', 'linkshrink', 'shorte', 'bit.ly', 'tinyurl',
            'goo.gl', 'ow.ly', 'is.gd', 'buff.ly', 'adfly', 'sh.st',
            'click', 'visit', 'access', 'continue'
        ];

        const currentUrl = win.location.href.toLowerCase();

        for (const pattern of initialPagePatterns) {
            if (currentUrl.includes(pattern)) {
                return true;
            }
        }

        const queryParams = search.split('&').length;
        if (path === '/' && queryParams <= 2 && hash === '') {
            return true;
        }

        return false;
    }

    function checkForCloudflare() {
        if (cloudflareCheckCount > maxCloudflareChecks) {
            return false;
        }

        cloudflareCheckCount++;

        if (win.location.href !== lastPageUrl) {
            lastPageUrl = win.location.href;
            cloudflareCheckCount = 0;
            isCloudflareVerification = false;
            cloudflareBypassAttempted = false;
            isInitialPageCheckComplete = false;

            if (!isInitialPage()) {
                cloudflareMonitoringActive = false;
                if (cloudflareCheckInterval) {
                    clearInterval(cloudflareCheckInterval);
                    cloudflareCheckInterval = null;
                }
                return false;
            }
        }

        const bodyText = document.body ? document.body.innerText || '' : '';
        const htmlContent = document.documentElement ? document.documentElement.innerHTML || '' : '';

        const cloudflareIndicators = [
            'Checking if the site connection is secure',
            'Checking your browser before accessing',
            'DDoS protection by Cloudflare',
            'Please wait while we check your browser',
            'Please turn JavaScript on and reload the page',
            'jschl_vc',
            'jschl_answer',
            'ray-id',
            'cf_chl_opt',
            'challenge-form',
            'cf-cookie-error',
            'cf-browser-verification',
            'cf-please-wait'
        ];

        const cloudflareElements = [
            'form#challenge-form',
            'div[class*="cf-browser-verification"]',
            'div[class*="cloudflare"]',
            'script[src*="challenges.cloudflare.com"]',
            'iframe[src*="cloudflare"]',
            'div#cf-wrapper',
            'div.cf-error-title',
            'div#challenge-running'
        ];

        for (const selector of cloudflareElements) {
            try {
                if (document.querySelector(selector)) {
                    return true;
                }
            } catch (e) {}
        }

        let indicatorCount = 0;
        for (const indicator of cloudflareIndicators) {
            if (bodyText.includes(indicator) || htmlContent.includes(indicator)) {
                indicatorCount++;
                if (indicatorCount >= 2) return true;
            }
        }

        return false;
    }

    function monitorCloudflareStatus() {
        if (cloudflareCheckInterval) {
            clearInterval(cloudflareCheckInterval);
        }

        if (!isInitialPage() || isInitialPageCheckComplete) {
            cloudflareMonitoringActive = false;
            return;
        }

        cloudflareCheckInterval = setInterval(() => {
            const timeSinceLoad = Date.now() - initialLoadTime;
            if (timeSinceLoad > 30000) {
                clearInterval(cloudflareCheckInterval);
                cloudflareMonitoringActive = false;
                isInitialPageCheckComplete = true;
                return;
            }

            const wasCloudflare = isCloudflareVerification;
            isCloudflareVerification = checkForCloudflare();

            if (isCloudflareVerification && !wasCloudflare) {
                cloudflareDetectionCount++;
                updateStatus(`Cloudflare detected! Waiting ${CLOUDFLARE_WAIT_TIME/1000}s...`);

                if (scanTimeout) {
                    clearTimeout(scanTimeout);
                    scanTimeout = null;
                }

                setTimeout(() => {
                    if (checkForCloudflare()) {
                        updateStatus('Cloudflare still active...');
                        attemptCloudflareBypass();
                    } else {
                        updateStatus('Cloudflare verification complete!');
                        isCloudflareVerification = false;
                        cloudflareBypassAttempted = false;
                        isInitialPageCheckComplete = true;

                        if (currentMode > 0) {
                            scheduleNextScan();
                        }
                    }
                }, CLOUDFLARE_WAIT_TIME);
            } else if (!isCloudflareVerification && wasCloudflare) {
                updateStatus('Cloudflare passed!');
                isInitialPageCheckComplete = true;
                if (currentMode > 0) {
                    scheduleNextScan();
                }
            }
        }, 2000);
    }

    function attemptCloudflareBypass() {
        if (cloudflareBypassAttempted) return;

        cloudflareBypassAttempted = true;
        updateStatus('Attempting to bypass Cloudflare verification...');

        const cloudflareButtons = [
            'input[type="submit"][value*="Verify"]',
            'button:contains("Verify")',
            'a:contains("Verify")',
            'input[value*="verif"]',
            'button:contains("I am human")',
            'input[value*="human"]',
            '#success_button',
            '.btn-success',
            'button#challenge-submit'
        ];

        let foundButton = null;
        for (const selector of cloudflareButtons) {
            try {
                const elements = document.querySelectorAll(selector);
                if (elements.length > 0) {
                    foundButton = elements[0];
                    break;
                }
            } catch (e) {}
        }

        if (!foundButton) {
            const allButtons = document.querySelectorAll('button, input[type="button"], input[type="submit"], a');
            for (const btn of allButtons) {
                const btnText = (btn.textContent || btn.value || '').toLowerCase();
                if (btnText.includes('verify') || btnText.includes('verif') ||
                    btnText.includes('human') || btnText.includes('continue') ||
                    btnText.includes('proceed') || btnText.includes('i\'m not a robot')) {
                    foundButton = btn;
                    break;
                }
            }
        }

        if (foundButton && isElementClickable(foundButton)) {
            updateStatus('Clicking Cloudflare verification button...');
            foundButton.click();
            setTimeout(() => {
                isCloudflareVerification = checkForCloudflare();
                if (!isCloudflareVerification) {
                    updateStatus('Cloudflare bypass successful!');
                    isInitialPageCheckComplete = true;
                }
            }, 3000);
        } else {
            updateStatus('Waiting for Cloudflare auto-verification...');
        }
    }

    async function safeAutoTabSwitch() {
        updateStatus('Starting safe tab switch...');
        if (isInitialPage() && cloudflareMonitoringActive && checkForCloudflare()) {
            updateStatus('Cloudflare detected - Quick check, will continue...');
            await new Promise(resolve => setTimeout(resolve, 500));
        }
        updateStatus('Performing tab switch simulation...');
        try {
            await humanSimulator.simulateTabSwitch();
            await new Promise(resolve => setTimeout(resolve, 500));
            window.scrollBy(0, 150);
            await new Promise(resolve => setTimeout(resolve, 300));
            updateStatus('Tab switch complete - Ready to scan!');
            return true;
        } catch (error) {
            updateStatus('Tab switch error, continuing anyway...');
            return true;
        }
    }

    class VisualHighlighter {
        constructor() {
            this.highlightedElements = new Set();
            this.highlightStyles = null;
            this.currentHighlightId = null;
            this.countdownInterval = null;
        }

        applyHighlightStyles() {
            if (this.highlightStyles) return;
            const style = document.createElement('style');
            style.textContent = `
                .uad-highlight-target { position: relative !important; z-index: 2147483646 !important; animation: uad-pulse-highlight 1s infinite !important; outline: 3px solid #f59e0b !important; outline-offset: 3px !important; box-shadow: 0 0 20px #f59e0b, 0 0 40px rgba(245, 158, 11, 0.5), inset 0 0 20px rgba(245, 158, 11, 0.3) !important; transition: all 0.3s ease !important; border-radius: 6px !important; }
                .uad-highlight-target::before { content: '🚀' !important; position: absolute !important; top: -30px !important; left: 50% !important; transform: translateX(-50%) !important; font-size: 20px !important; z-index: 2147483647 !important; background: linear-gradient(135deg, #0f172a, #1e293b) !important; padding: 5px 10px !important; border-radius: 20px !important; border: 2px solid #f59e0b !important; color: white !important; white-space: nowrap !important; box-shadow: 0 5px 15px rgba(0,0,0,0.5) !important; }
                .uad-highlight-text { position: absolute !important; top: -60px !important; left: 50% !important; transform: translateX(-50%) !important; background: linear-gradient(135deg, #f59e0b, #d97706) !important; color: white !important; padding: 8px 15px !important; border-radius: 10px !important; font-size: 12px !important; font-weight: bold !important; z-index: 2147483647 !important; white-space: nowrap !important; box-shadow: 0 5px 15px rgba(245, 158, 11, 0.5) !important; text-align: center !important; animation: uad-blink-text 2s infinite !important; }
                @keyframes uad-pulse-highlight { 0% { outline-color: #f59e0b; box-shadow: 0 0 20px #f59e0b; } 50% { outline-color: #fbbf24; box-shadow: 0 0 30px #fbbf24; } 100% { outline-color: #f59e0b; box-shadow: 0 0 20px #f59e0b; } }
                @keyframes uad-blink-text { 0%, 100% { opacity: 1; } 50% { opacity: 0.8; } }
                .uad-highlight-countdown { position: absolute !important; bottom: -40px !important; left: 50% !important; transform: translateX(-50%) !important; background: rgba(0, 0,0, 0.9) !important; color: white !important; padding: 5px 10px !important; border-radius: 15px !important; font-size: 11px !important; font-weight: bold !important; border: 2px solid #10b981 !important; z-index: 2147483647 !important; white-space: nowrap !important; }
                /* Modal Styles */
                .uad-modal-overlay { position: fixed !important; top: 0 !important; left: 0 !important; width: 100% !important; height: 100% !important; background: rgba(0, 0, 0, 0.7) !important; z-index: 2147483647 !important; display: flex !important; align-items: center !important; justify-content: center !important; backdrop-filter: blur(5px) !important; }
                .uad-modal-content { background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%) !important; width: 500px !important; max-width: 90% !important; border-radius: 12px !important; border: 2px solid #334155 !important; box-shadow: 0 20px 60px rgba(0, 0, 0, 0.7) !important; overflow: hidden !important; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important; animation: uad-modal-in 0.3s ease !important; }
                .uad-modal-header { padding: 15px 20px !important; background: rgba(30, 41, 59, 0.8) !important; border-bottom: 1px solid #334155 !important; display: flex !important; justify-content: space-between !important; align-items: center !important; }
                .uad-modal-header h3 { margin: 0 !important; font-size: 18px !important; color: #f1f5f9 !important; font-weight: 700 !important; }
                .uad-modal-close { background: none !important; border: none !important; color: #94a3b8 !important; font-size: 24px !important; cursor: pointer !important; line-height: 1 !important; padding: 0 !important; }
                .uad-modal-close:hover { color: white !important; }
                .uad-modal-tabs { display: flex !important; border-bottom: 1px solid #334155 !important; background: rgba(15, 23, 42, 0.5) !important; }
                .uad-tab-btn { flex: 1 !important; padding: 12px !important; background: none !important; border: none !important; color: #94a3b8 !important; font-size: 12px !important; font-weight: 600 !important; cursor: pointer !important; transition: all 0.2s !important; border-bottom: 2px solid transparent !important; }
                .uad-tab-btn:hover { color: #f1f5f9 !important; background: rgba(255, 255, 255, 0.05) !important; }
                .uad-tab-btn.active { color: #f59e0b !important; border-bottom-color: #f59e0b !important; background: rgba(245, 158, 11, 0.1) !important; }
                .uad-modal-body { padding: 20px !important; min-height: 300px !important; max-height: 70vh !important; overflow-y: auto !important; color: #cbd5e1 !important; font-size: 13px !important; line-height: 1.6 !important; }
                .uad-tab-content { display: none !important; }
                .uad-tab-content.active { display: block !important; }
                .uad-help-section h4 { color: #f59e0b !important; margin: 0 0 10px 0 !important; font-size: 14px !important; text-transform: uppercase !important; border-bottom: 1px solid #334155 !important; padding-bottom: 5px !important; }
                .uad-help-section p { margin-bottom: 15px !important; }
                .uad-shortcuts-grid { display: grid !important; grid-template-columns: 1fr 1fr !important; gap: 10px !important; }
                .uad-shortcut-item-modal { display: flex !important; justify-content: space-between !important; align-items: center !important; padding: 8px !important; background: rgba(51, 65, 85, 0.3) !important; border-radius: 6px !important; }
                .uad-shortcut-item-modal kbd { background: #1e293b !important; padding: 2px 6px !important; border-radius: 4px !important; border: 1px solid #475569 !important; font-family: monospace !important; color: #f59e0b !important; font-weight: bold !important; font-size: 11px !important; }
                .uad-modal-footer { padding: 10px 20px !important; background: rgba(15, 23, 42, 0.9) !important; border-top: 1px solid #334155 !important; text-align: center !important; font-size: 11px !important; color: #64748b !important; }
                /* Support Tab CSS */
                .sup-row { display: flex !important; align-items: center !important; gap: 8px !important; margin-bottom: 10px !important; background: rgba(51, 65, 85, 0.3) !important; padding: 8px !important; border-radius: 8px !important; }
                .sup-icon { width: 20px !important; height: 20px !important; }
                .sup-val { flex: 1 !important; background: transparent !important; border: none !important; color: #f1f5f9 !important; font-family: monospace !important; font-size: 11px !important; outline: none !important; }
                .sup-copy { background: #3b82f6 !important; border: none !important; color: white !important; padding: 4px 10px !important; border-radius: 4px !important; cursor: pointer !important; font-size: 10px !important; font-weight: bold !important; }
                .sup-copy:hover { background: #2563eb !important; }
                @keyframes uad-modal-in { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
            `;

            if (document.head) {
                 document.head.appendChild(style);
            }
        }

        highlightButton(element, actionType = 'click', countdownSeconds = 3) {
            this.applyHighlightStyles();
            this.clearHighlight();

            if (!element || !element.parentNode) return null;

            this.currentHighlightId = Date.now();
            const highlightId = this.currentHighlightId;
            this.highlightedElements.add(element);

            element.classList.add('uad-highlight-target');

            if (countdownSeconds <= 0) return highlightId;

            let actionText = countdownSeconds === 0 ? 'DETECTED' : 'CLICK HERE';
            let subText = countdownSeconds === 0 ? 'Waiting click...' : `Auto-click in ${countdownSeconds}s`;

            setTimeout(() => {
                if (this.currentHighlightId === highlightId && element.parentNode) {
                    const afterElement = document.createElement('div');
                    afterElement.className = 'uad-highlight-text';
                    afterElement.textContent = actionText;
                    element.appendChild(afterElement);

                    const countdownElement = document.createElement('div');
                    countdownElement.className = 'uad-highlight-countdown';
                    countdownElement.textContent = subText;
                    element.appendChild(countdownElement);

                    if (countdownSeconds > 0) {
                        let secondsLeft = countdownSeconds;
                        this.countdownInterval = setInterval(() => {
                            if (this.currentHighlightId !== highlightId || !element.parentNode) {
                                clearInterval(this.countdownInterval);
                                return;
                            }
                            secondsLeft--;
                            if (secondsLeft > 0) {
                                countdownElement.textContent = `Auto-click in ${secondsLeft}s`;
                            } else {
                                countdownElement.textContent = 'Clicking now...';
                                clearInterval(this.countdownInterval);
                            }
                        }, 1000);
                    }
                }
            }, 50);

            return highlightId;
        }

        clearHighlight() {
            if (this.countdownInterval) {
                clearInterval(this.countdownInterval);
                this.countdownInterval = null;
            }
            this.highlightedElements.forEach(element => {
                if (element.parentNode) {
                    element.classList.remove('uad-highlight-target');
                    const textElement = element.querySelector('.uad-highlight-text');
                    const countdownElement = element.querySelector('.uad-highlight-countdown');
                    if (textElement) textElement.remove();
                    if (countdownElement) countdownElement.remove();
                }
            });
            this.highlightedElements.clear();
            this.currentHighlightId = null;
        }
    }

    const visualHighlighter = new VisualHighlighter();

    function shouldAccelerate() {
        if (GM_getValue('uad_mode', 0) === 0) return false;
        return true;
    }

    win.setTimeout = function(func, delay, ...args) {
        if (shouldAccelerate() && delay > 100) {
            let speedFactor = activeTimeWarpSpeed;
            if (speedFactor > 10) speedFactor = 10;
            if (speedFactor < 1) speedFactor = 1;
            delay = Math.max(10, Math.floor(delay / speedFactor));
        }
        return originalSetTimeout(func, delay, ...args);
    };

    win.setInterval = function(func, delay, ...args) {
        if (shouldAccelerate() && delay > 100) {
            let speedFactor = activeTimeWarpSpeed;
            if (speedFactor > 10) speedFactor = 10;
            if (speedFactor < 1) speedFactor = 1;
            delay = Math.max(10, Math.floor(delay / speedFactor));
        }
        return originalSetInterval(func, delay, ...args);
    };

    function setLastClick() {
        GM_setValue('uad_last_click_time', Date.now());
        burstModeActive = true;
        setTimeout(() => { burstModeActive = false; }, 3000);
    }

    class HumanInteractionSimulator {
        constructor() {
            this.isInteracting = false;
        }
        simulateMouseMovement(targetX, targetY, duration = 2000) {
            return new Promise((resolve) => {
                if (duration === 0) { resolve(); return; }
                resolve();
            });
        }
        async simulateTabSwitch() {
            return new Promise((resolve) => {
                updateStatus('Tab switch simulation...');
                setTimeout(() => {
                    updateStatus('Tab switch complete');
                    resolve();
                }, 1000);
            });
        }
    }

    const humanSimulator = new HumanInteractionSimulator();

    const shortcuts = {
        toggleHUD: 'Alt+Shift+Y',
        showHelp: 'Alt+Shift+H',
        toggleMode: 'Alt+Shift+M',
        autoTabSwitch: 'Alt+Shift+A',
        increaseSpeed: 'Alt+Shift+Plus',
        decreaseSpeed: 'Alt+Shift+Minus',
        simulateTabSwitch: 'Alt+Shift+T',
        simulateHuman: 'Alt+Shift+I'
    };

    const translations = {
        'EN': {
            title: 'Universal Bypass',
            subtitle: 'v1.5.2',
            paused: 'PAUSED',
            detect: 'DETECT',
            bypass: 'BYPASS',
            turbo: 'TURBO',
            status: 'STATUS',
            cooldown: 'COOLDOWN',
            step_timer: 'STEP TIMER',
            time_warp: 'TIME WARP',
            tip: `
                <div class="uad-tip-line"><span class="uad-tip-icon">🐢</span> <b>Errors?</b> Set speed to <b>1x</b> if the final counter needs to tick naturally!</div>
                <div class="uad-tip-line"><span class="uad-tip-icon">↘️</span> <b>New:</b> Use the bottom-right corner to resize!</div>
            `,
            tab_switch: 'Tab Switch',
            help: 'Help',
            minimize: 'Minimize',
            hide: 'Hide',
            cooling: 'Cooling down...',
            not_started: 'Not started',
            arsenal_title: 'USER ARSENAL (PRIORITY)',
            arsenal_desc: 'Add Custom IDs, Classes, or Text (one per line).<br>These will be clicked INSTANTLY.',
            save: 'SAVE ARSENAL',
            back: '← BACK',
            saved: 'Saved!',
            support_title: 'SUPPORT DEVELOPMENT',
            support_desc: 'If this script helps you save time, consider a donation to keep updates coming!',
            lbl_pix: 'PIX (Brazil)',
            wallet_title: 'CRYPTO WALLETS',
            btn_copy: 'COPY'
        }
    };

    let currentLang = GM_getValue('uad_language', 'EN');
    const T = translations[currentLang];

    const BUTTON_BLACKLIST = [
        'SUBTITLE', 'TORRENT', 'MAGNET', 'STREAM', 'ONLINE', 'WATCH',
        'PREVIEW', 'TRAILER', 'CLIP', 'SCREENSHOT', 'POSTER', 'IMAGE',
        'PICTURE', 'PHOTO', 'COVER', 'ICON', 'AVATAR', 'LOGIN', 'SIGNUP',
        'REGISTER', 'SUBSCRIBE', 'FOLLOW', 'LIKE', 'SHARE', 'COMMENT',
        'REPORT', 'FEEDBACK', 'HELP', 'SUPPORT', 'FAQ', 'CONTACT', 'ABOUT',
        'ADVERTISE', 'SPONSOR', 'DONATE', 'PREMIUM', 'PRO', 'UPGRADE',
        'BUY', 'PURCHASE', 'ORDER', 'SHOP', 'CART', 'CHECKOUT', 'PAYMENT',
        'ACCOUNT', 'PROFILE', 'SETTINGS', 'LOGOUT', 'ADMIN', 'DASHBOARD',
        'HOME', 'BACK', 'TOP', 'BOTTOM', 'NEXT PAGE', 'PREVIOUS PAGE',
        'FIRST', 'LAST', 'MORE', 'LESS', 'EXPAND', 'COLLAPSE', 'MENU',
        'NAVIGATION', 'SEARCH', 'FILTER', 'SORT', 'GRID', 'LIST', 'VIEW',
        'ZOOM', 'FULLSCREEN', 'PRINT', 'DOWNLOAD ALL', 'UPLOAD', 'SEND',
        'RECEIVE', 'SYNC', 'BACKUP', 'RESTORE', 'IMPORT', 'EXPORT',
        'INSTALL', 'UPDATE', 'UPGRADE', 'REMOVE', 'DELETE', 'EDIT',
        'MODIFY', 'ADD NEW', 'CREATE', 'DUPLICATE', 'CLONE', 'MOVE',
        'RENAME', 'SAVE', 'APPLY', 'RESET', 'CANCEL', 'CLOSE', 'EXIT',
        'COMMENT', 'POST', 'REPLY', 'COMMENTS', 'DISCUSS', 'DISCUSSION',
        'FORUM', 'THREAD', 'CHAT', 'MESSAGE', 'FEED', 'NEWSFEED', 'TIMELINE',
        'HOSTARMADA', 'SPEED-SECURITY-STABILITY', 'SHAREAWEBS',
        'SHARED HOSTING', 'FREE HOSTING', 'CONTACT US',
        'GET STARTED', 'MONEY BACK', 'FREE DOMAIN'
    ];

    const BUTTON_WHITELIST = [
        'DOWNLOAD', 'BAIXAR', 'DESCARGAR', 'TÉLÉCHARGER',
        'FREE DOWNLOAD', 'SLOW DOWNLOAD', 'DIRECT DOWNLOAD',
        'DOWNLOAD NOW', 'START DOWNLOAD', 'DESCARGA',
        'BAIXAR AGORA', 'DESCARGAR AHORA', 'GO TO DOWNLOAD',
        'GO DOWNLOAD', 'DOWNLOAD FILE', 'GET FILE',
        'CONTINUE', 'CONTINUAR', 'PROCEED', 'PROSSEGUIR',
        'CONTINUER', 'FORTFAHREN', 'SEGUIR', 'AVANZAR',
        'AVANÇAR', 'PROCEEDER', 'GO', 'GO TO', 'GO LINK',
        'GO TO LINK', 'IR', 'IR PARA', 'VAI', 'ALLER',
        'GEHE', '前往', '进', '继续',
        'GET LINK', 'GET DOWNLOAD', 'OBTER LINK', 'OBTER DOWNLOAD',
        'OBTENER ENLACE', 'OBTENER DESCARGAR', 'GENERATE LINK',
        'CREATE LINK', 'GERAR LINK', 'GENERAR ENLACE', 'GENERATE',
        'CREATE', 'GERAR', 'GENERAR', 'GET', 'OBTER', 'OBTENER',
        'SKIP', 'PULAR', 'SALTAR', 'IGNORAR', 'SAUTER',
        'ÜBERSPRINGEN', 'SALTO', 'PASSER', 'SKIP AD',
        'SKIP THIS', 'PULAR PROPAGANDA', 'SALTAR PUBLICIDAD',
        'NEXT', 'PRÓXIMA', 'PRÓXIMO', 'SEGUINTE', 'SIGUIENTE',
        'WEITER', 'SUIVANT', '次へ', 'التالي', 'ДАЛЕЕ',
        'СЛЕДУЮЩИЙ', 'PROXIMA', 'PROXIMO', 'AVANCAR',
        'VERIFY', 'I AM HUMAN', 'VERIFICAR', 'VERIFICATION',
        'HUMAN', 'CLICK HERE', 'CLICK TO VERIFY', 'VERIFIQUE',
        'VERIFICACIÓN', 'VERIFIZIEREN', 'I AM NOT A ROBOT',
        'EU SOU HUMANO', 'EU NÃO SOU ROBO', 'NOT A ROBOT',
        'NO ROBOT', 'HUMAN VERIFICATION', 'VERIFY HUMAN',
        'VERIFY YOU ARE HUMAN', 'CLICK TO VERIFY YOU ARE HUMAN',
        'CLICK TO PROCEED', 'CLICK TO CONTINUE', 'CHECK',
        'CONFIRM', 'VALIDATE', 'VALIDATION', 'AUTHENTICATE',
        'CREATE DOWNLOAD LINK', 'CREATE LINK', 'CREATE DOWNLOAD',
        'GERAR LINK DE DOWNLOAD', 'CREATE FILE LINK',
        'SHOW DOWNLOAD LINK', 'VIEW DOWNLOAD LINK'
    ];

    const PRIORITY_IDS = [
        'continue', 'Continue', 'CONTINUE',
        'proceed', 'Proceed', 'PROCEED',
        'next', 'Next', 'NEXT',
        'skip', 'Skip', 'SKIP',
        'verify', 'Verify', 'VERIFY',
        'success', 'Success', 'SUCCESS',
        'cloudflare', 'CloudFlare', 'CLOUDFLARE',
        'getlink', 'get-link', 'generatelink', 'generate-link',
        'getmylink', 'getnewlink',
        'btn-continue', 'btn-proceed', 'btn-next', 'btn-skip',
        'submit', 'Submit', 'SUBMIT',
        'start_download', 'startdownload', 'download', 'btn-download',
        'direct_download', 'free_download', 'slow_download',
        'continue-button', 'proceed-button', 'next-button',
        'skip-button', 'verify-button', 'submit-button',
        'get-file', 'get-file-now', 'file-download', 'download-now',
        'start-file', 'start-file-download', 'download-now-btn', 'download-link',
        'btn-getfile', 'btn-startdownload', 'btn-start-file',
        'get-started', 'start-now', 'get-access', 'access-link',
        'go', 'go-now', 'begin-download', 'begin-download-btn',
        'quick-download', 'fast-download', 'instant-download',
        'instant-link', 'btn-getlink', 'start-verify', 'start-btn',
        'free-link', 'free-access', 'get-access-link', 'btn-verify', 'get-link-now',
        'accept', 'confirm', 'agree', 'click-here', 'button-accept',
        'proceed-now', 'continue-now', 'finish', 'done', 'done-button',
        'next-timer-btn', 'mdtimer', 'mid-nextbutton', 'final-nextbutton'
    ];

    function getRandomDelay(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

    function smoothScrollToElement(element, duration = 1000) {
        return new Promise((resolve) => {
            if (duration === 0) {
                element.scrollIntoView({ block: 'center', inline: 'center' });
                resolve();
                return;
            }
            const elementRect = element.getBoundingClientRect();
            const absoluteElementTop = elementRect.top + window.pageYOffset;
            const start = window.pageYOffset;
            const change = absoluteElementTop - start - 100;
            let currentTime = 0;
            const increment = 20;
            function easeInOutQuad(t, b, c, d) {
                t /= d/2;
                if (t < 1) return c/2*t*t + b;
                t--;
                return -c/2 * (t*(t-2) - 1) + b;
            }
            function animateScroll() {
                currentTime += increment;
                const val = easeInOutQuad(currentTime, start, change, duration);
                window.scrollTo(0, val);
                if (currentTime < duration) { setTimeout(animateScroll, increment); } else { resolve(); }
            }
            animateScroll();
        });
    }

    function manipulateTimers() {
        document.querySelectorAll('[data-uad-timer-processed]').forEach(timer => { timer.removeAttribute('data-uad-timer-processed'); });
        document.querySelectorAll('#timer, .timer, .countdown, [id*="timer"], [class*="timer"], [id*="count"], [class*="count"], [data-timer], [data-countdown]').forEach(timer => {
            if (timer.getAttribute('data-uad-timer-processed')) return;
            if (timer.innerText && timer.innerText.match(/\d+/)) {
                const numbers = timer.innerText.match(/\d+/g);
                if (numbers) {
                    let modified = false;
                    numbers.forEach(num => {
                        const originalNum = parseInt(num);
                        if (originalNum > 1) {
                            let reduction = 0;
                            if (activeTimeWarpSpeed === 1) reduction = 0.1 + Math.random() * 0.2;
                            else if (activeTimeWarpSpeed === 2) reduction = 0.3 + Math.random() * 0.2;
                            else if (activeTimeWarpSpeed === 3) reduction = 0.5 + Math.random() * 0.2;
                            else if (activeTimeWarpSpeed === 4) reduction = 0.6 + Math.random() * 0.2;
                            else if (activeTimeWarpSpeed === 5) reduction = 0.7 + Math.random() * 0.2;
                            else if (activeTimeWarpSpeed >= 6) reduction = 0.8 + Math.random() * 0.19;

                            const newNum = Math.max(1, Math.floor(originalNum * (1 - reduction)));
                            if (newNum !== originalNum) {
                                timer.innerText = timer.innerText.replace(num, newNum);
                                modified = true;
                            }
                        }
                    });
                    if (modified) { timer.setAttribute('data-uad-timer-processed', 'true'); }
                }
            }
        });
    }

    function hasSpentEnoughTimeOnStep() { return (Date.now() - stepStartTime) >= currentWaitTime; }

    function startNewStep() {
        currentStep++;
        stepStartTime = Date.now();
        currentWaitTime = stepRequiredTime;
        updateStatus(`Step ${currentStep} - Please wait...`);
    }

    function changeTimeWarpSpeed(delta) {
        let newSpeed = timeWarpSpeed + delta;
        if (newSpeed < 1) newSpeed = 1;
        if (newSpeed > 10) newSpeed = 10;
        timeWarpSpeed = newSpeed;
        activeTimeWarpSpeed = newSpeed;
        GM_setValue('uad_timewarp_speed', timeWarpSpeed);
        const display = document.getElementById('uad-speed-display');
        const select = document.getElementById('uad-speed-select');
        if (display) display.textContent = timeWarpSpeed + 'x';
        if (select) select.value = timeWarpSpeed;
        document.querySelectorAll('[data-uad-timer-processed]').forEach(timer => { timer.removeAttribute('data-uad-timer-processed'); });
        updateStatus(`Time Warp: ${timeWarpSpeed}x - Applying immediately...`);
        if (currentMode >= 2) { manipulateTimers(); }
    }

    function getElementText(el) {
        if (el.closest('#uad-hud')) { return "[UAD-HUD-IGNORE]"; }
        return (el.innerText || el.textContent || el.value || "").toUpperCase();
    }

    function isElementClickable(el) {
        if (!el || !el.parentNode) return false;
        if (el.getAttribute('data-uad-clicked') === 'true') return false;
        if (el.disabled) return false;
        if (el.style.display === 'none') return false;
        if (el.style.visibility === 'hidden') return false;
        if (el.offsetParent === null) return false;
        const rect = el.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) return false;
        return true;
    }

    function isBlacklisted(text) {
        if (text.length > 30) return true;
        return BUTTON_BLACKLIST.some(blackItem => text.includes(blackItem));
    }

    function isWhitelisted(text) { return BUTTON_WHITELIST.some(whiteItem => text.includes(whiteItem)); }

    function isSidebarOrAdElement(el) {
        if (!el || !el.parentNode) return false;

        const elId = el.id ? el.id.toLowerCase() : '';
        const arsenal = getUserArsenal();

        if (arsenal.some(k => elId.includes(k.toLowerCase()))) return false;
        if (PRIORITY_IDS.some(pid => elId === pid.toLowerCase())) return false;

        if (el.closest('nav, header, footer, .menu, .navigation, .navbar, .site-header, .site-footer, .breadcrumb, .pagination, [role="navigation"]')) {
            if (!arsenal.some(k => elId.includes(k.toLowerCase()))) {
                return true;
            }
        }

        const parentSelectors = [
            'sidebar', 'side-bar', 'side_bar', 'aside',
            'widget', 'advertisement', 'ad-container', 'ad_wrapper',
            'adsbygoogle', 'banner-ad', 'ad-slot', 'ad-area',
            'right-column', 'left-column', 'right-sidebar', 'left-sidebar',
            'google_ads_iframe', 'ad-unit', 'advertisment'
        ];
        for (let i = 0; i < 5; i++) {
            if (!el.parentElement) break;
            el = el.parentElement;
            const parentId = el.id.toLowerCase();
            const parentClass = el.className.toLowerCase();
            for (const selector of parentSelectors) {
                if (parentId.includes(selector) || parentClass.includes(selector)) { return true; }
            }
            const rect = el.getBoundingClientRect();
            if (rect.width < 300 && (rect.left < 50 || rect.right > window.innerWidth - 50)) { return true; }
        }
        return false;
    }

    function isDownloadButton(btn) {
        const text = getElementText(btn);
        const btnId = btn.id ? btn.id.toLowerCase() : '';
        const btnClass = btn.className ? btn.className.toLowerCase() : '';
        const downloadKeywords = [
            'DOWNLOAD', 'BAIXAR', 'DESCARGAR', 'TÉLÉCHARGER', 'DESCARGAR AHORA',
            'BAIXAR AGORA', 'SAVE', 'GUARDAR', 'SALVAR', 'SAVE FILE',
            'ARCHIVO', 'FILE', 'FICHEIRO', 'FICHERO', 'ARQUIVO'
        ];
        const hasDownloadText = downloadKeywords.some(keyword => text.includes(keyword));
        const hasDownloadId = btnId.includes('download') || btnId.includes('baixar') || btnId.includes('descargar');
        const hasDownloadClass = btnClass.includes('download') || btnClass.includes('baixar') || btnClass.includes('descargar');
        return hasDownloadText || hasDownloadId || hasDownloadClass;
    }

    function canClickButton(btn, mode) {
        if (!btn || !btn.parentNode) return false;
        const btnId = btn.id || 'no-id-' + getElementText(btn).substring(0, 20);
        const now = Date.now();
        const lastClick = clickHistory.get(btnId);
        if (mode === 2 && isDownloadButton(btn)) {
            updateStatus(`BYPASS: Skipping download button: ${getElementText(btn).substring(0, 30)}`);
            return false;
        }
        if (!lastClick) return true;
        if (now - lastClick < 3000) { return false; }
        return true;
    }

    function registerClick(btn) {
        if (!btn) return;
        const btnId = btn.id || 'no-id-' + getElementText(btn).substring(0, 20);
        clickHistory.set(btnId, Date.now());
    }

    function getUserArsenal() {
        const raw = GM_getValue('uad_user_arsenal', '');
        return raw.split(/[\n,]+/).map(s => s.trim()).filter(s => s.length > 0);
    }

    function checkUserArsenal() {
        const keywords = getUserArsenal();
        if (keywords.length === 0) return null;

        for (const key of keywords) {
            let el = document.getElementById(key);
            if (el && isElementClickable(el) && !isSidebarOrAdElement(el)) return { element: el, priority: 0, source: 'arsenal-id', text: 'USER ARSENAL' };

            try {
                const els = document.getElementsByClassName(key);
                for (let i = 0; i < els.length; i++) {
                    if (isElementClickable(els[i]) && !isSidebarOrAdElement(els[i])) {
                         return { element: els[i], priority: 0, source: 'arsenal-class', text: 'USER ARSENAL' };
                    }
                }
            } catch(e) {}

            const candidates = document.querySelectorAll('button, a, input[type="submit"], [role="button"], .btn');
            for (const btn of candidates) {
                if (isElementClickable(btn) && !isSidebarOrAdElement(btn)) {
                    const txt = (btn.innerText || btn.value || '').toLowerCase();
                    if (txt.includes(key.toLowerCase())) {
                        return { element: btn, priority: 0, source: 'arsenal-text', text: 'USER ARSENAL' };
                    }
                }
            }
        }
        return null;
    }

    function findPriorityButtons() {
        const foundButtons = [];
        for (const pid of PRIORITY_IDS) {
            const element = document.getElementById(pid);
            if (element && isElementClickable(element) && !isSidebarOrAdElement(element)) {
                const text = getElementText(element);
                if (!isBlacklisted(text)) {
                    foundButtons.push({ element: element, priority: 1, source: 'id-exact', id: pid, text: text });
                }
            }
        }
        for (const pid of PRIORITY_IDS) {
            const elements = document.querySelectorAll(`[id*="${pid}"]`);
            elements.forEach(element => {
                if (isElementClickable(element) && !isSidebarOrAdElement(element)) {
                    const text = getElementText(element);
                    if (!isBlacklisted(text) && !foundButtons.some(b => b.element === element)) {
                        foundButtons.push({ element: element, priority: 2, source: 'id-contains', id: element.id, text: text });
                    }
                }
            });
        }
        const priorityClasses = ['btn-continue', 'btn-proceed', 'btn-next', 'btn-skip', 'btn-success', 'btn-primary'];
        priorityClasses.forEach(className => {
            const elements = document.querySelectorAll(`.${className}`);
            elements.forEach(element => {
                if (isElementClickable(element) && !isSidebarOrAdElement(element)) {
                    const text = getElementText(element);
                    if (!isBlacklisted(text) && !foundButtons.some(b => b.element === element)) {
                        foundButtons.push({ element: element, priority: 3, source: 'class', className: className, text: text });
                    }
                }
            });
        });
        return foundButtons.sort((a, b) => a.priority - b.priority);
    }

    function findAnyRelevantButtons() {
        const foundButtons = [];
        const allElements = document.querySelectorAll('button, a, input[type="button"], input[type="submit"], [role="button"], .btn, [class*="button"]');
        allElements.forEach(element => {
            if (!isElementClickable(element) || isSidebarOrAdElement(element)) return;
            const text = getElementText(element);
            if (isBlacklisted(text)) return;
            if (!isWhitelisted(text)) return;
            if (!foundButtons.some(b => b.element === element)) {
                foundButtons.push({ element: element, priority: 4, source: 'text', text: text });
            }
        });
        return foundButtons.sort((a, b) => a.priority - b.priority);
    }

    function checkForButtons() {
        if (isCloudflareVerification && isInitialPage() && cloudflareMonitoringActive) {
            return { primary: null, secondary: null, downloadBtn: null, continueBtn: null, getLinkBtn: null, skipBtn: null, nextBtn: null, verifyBtn: null, arsenalBtn: null };
        }

        const arsenalBtn = checkUserArsenal();
        if (arsenalBtn) {
            return { primary: null, secondary: null, downloadBtn: null, continueBtn: null, getLinkBtn: null, skipBtn: null, nextBtn: null, verifyBtn: null, arsenalBtn: arsenalBtn };
        }

        const now = Date.now();
        const isPriorityPhase = (now - priorityScanStartTime) < 30000;
        let foundButtons = [];

        if (isPriorityPhase) {
            foundButtons = findPriorityButtons();
            if (foundButtons.length === 0) { foundButtons = findAnyRelevantButtons(); }
        } else {
            foundButtons = findAnyRelevantButtons();
        }

        const downloadButtons = [];
        const continueButtons = [];
        const getLinkButtons = [];
        const verifyButtons = [];
        const skipButtons = [];
        const nextButtons = [];

        foundButtons.forEach(btnData => {
            const text = btnData.text;
            const btn = btnData.element;
            if (text.includes('DOWNLOAD') || text.includes('BAIXAR') || text.includes('DESCARGAR')) { downloadButtons.push(btnData); }
            else if (text.includes('CONTINUE') || text.includes('PROCEED') || text.includes('GO')) { continueButtons.push(btnData); }
            else if (text.includes('GET LINK') || text.includes('GENERATE') || text.includes('GET')) { getLinkButtons.push(btnData); }
            else if (text.includes('VERIFY') || text.includes('SUCCESS') || text.includes('CLOUDFLARE')) { verifyButtons.push(btnData); }
            else if (text.includes('SKIP') || text.includes('PULAR') || text.includes('SALTAR')) { skipButtons.push(btnData); }
            else if (text.includes('NEXT') || text.includes('PRÓXIMO') || text.includes('SIGUIENTE')) { nextButtons.push(btnData); }
        });

        const getFirstUnclicked = (buttons) => {
            for (const btnData of buttons) {
                if (!btnData.element.getAttribute('data-uad-clicked')) { return btnData.element; }
            }
            if (buttons.length > 0) {
                const btn = buttons[0].element;
                const btnId = btn.id || 'no-id-' + getElementText(btn).substring(0, 20);
                const lastClick = clickHistory.get(btnId);
                if (!lastClick || Date.now() - lastClick > 5000) { return btn; }
            }
            return null;
        };

        return {
            primary: getFirstUnclicked(continueButtons) || getFirstUnclicked(getLinkButtons) || getFirstUnclicked(verifyButtons) || (currentMode === 3 ? getFirstUnclicked(downloadButtons) : null),
            secondary: getFirstUnclicked(skipButtons) || getFirstUnclicked(nextButtons),
            downloadBtn: getFirstUnclicked(downloadButtons),
            continueBtn: getFirstUnclicked(continueButtons),
            getLinkBtn: getFirstUnclicked(getLinkButtons),
            skipBtn: getFirstUnclicked(skipButtons),
            nextBtn: getFirstUnclicked(nextButtons),
            verifyBtn: getFirstUnclicked(verifyButtons),
            arsenalBtn: null
        };
    }

    async function performClick(btn, isFinal = false, needsVerification = false, doClick = true, isPriority = false) {
        if (isCloudflareVerification && isInitialPage() && cloudflareMonitoringActive && !needsVerification) {
            updateStatus('Waiting for Cloudflare verification...');
            return;
        }

        if (currentMode === 1 && doClick) {
            doClick = false;
        }

        if (doClick && !canClickButton(btn, currentMode)) return;

        if (currentMode === 2 && isFinal && doClick) {
            updateStatus('Bypass Mode: Final button reached! Click manually to download.');
            visualHighlighter.highlightButton(btn, 'final', 0);
            smoothScrollToElement(btn);
            return;
        }

        if (!btn || btn.getAttribute('data-uad-clicked') === 'true') return;

        if (!doClick && btn.getAttribute('data-uad-highlighted') === 'true') return;

        if (isPriority && doClick) {
             btn.classList.add('uad-clicked');
             btn.setAttribute('data-uad-clicked', 'true');
             visualHighlighter.highlightButton(btn, 'click', 0);
             startNewStep();
             registerClick(btn);
             lastClickTime = Date.now();
             emptyScanCycles = 0;
             currentScanInterval = 100;
             totalScanTime = 0;
             updateStatus('ARSENAL/PRIORITY BUTTON DETECTED!');
             await new Promise(resolve => setTimeout(resolve, 300));
             btn.click();
             setLastClick();
             visualHighlighter.clearHighlight();
             if (scanTimeout) clearTimeout(scanTimeout);
             scanTimeout = setTimeout(() => performActiveScan(), 250);
             return;
        }

        const highlightId = visualHighlighter.highlightButton(btn, 'click', doClick ? 2 : 0);

        if (doClick) {
            btn.classList.add('uad-clicked');
            btn.setAttribute('data-uad-clicked', 'true');
            startNewStep();
            registerClick(btn);
            lastClickTime = Date.now();
            emptyScanCycles = 0;
            currentScanInterval = minScanInterval;
            totalScanTime = 0;
        } else {
            btn.setAttribute('data-uad-highlighted', 'true');
            updateStatus('Button detected! Waiting for you...');
        }

        try {
            await new Promise(resolve => setTimeout(resolve, doClick ? 2000 : 800));

            if (needsVerification && doClick) {
                updateStatus('Preparing verification...');
                await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 2000));
            }

            if (doClick) updateStatus('Scrolling to element...');
            await smoothScrollToElement(btn, 1000);

            const rect = btn.getBoundingClientRect();
            await humanSimulator.simulateMouseMovement(rect.left + rect.width / 2, rect.top + rect.height / 2, 800 + Math.random() * 400);

            if (doClick) {
                await new Promise(resolve => setTimeout(resolve, getRandomDelay(300, 700)));
                btn.click();
                setLastClick();
                visualHighlighter.clearHighlight();

                if (isFinal) { updateStatus('Download started!'); }
                else if (needsVerification) { updateStatus('Verification submitted!'); }
                else { updateStatus('Action completed!'); }
            }
        } catch (error) {
            if (doClick) {
                visualHighlighter.clearHighlight();
                setTimeout(() => { if (btn && btn.parentNode) btn.click(); }, 500);
            }
        }
    }

    function clearDetectionState() {
        visualHighlighter.clearHighlight();
        emptyScanCycles = 0;
        currentScanInterval = minScanInterval;
        lastButtonFoundTime = 0;
        document.querySelectorAll('[data-uad-highlighted]').forEach(el => el.removeAttribute('data-uad-highlighted'));
        document.querySelectorAll('[data-uad-clicked]').forEach(el => el.removeAttribute('data-uad-clicked'));
        document.querySelectorAll('.uad-clicked').forEach(el => el.classList.remove('uad-clicked'));
        updateStatus('Detection state cleared');
    }

    function startPriorityScan() {
        priorityScanStartTime = Date.now();
        totalScanTime = 0;
        emptyScanCycles = 0;
        currentScanInterval = minScanInterval;
        lastButtonFoundTime = 0;
        updateStatus('Starting PRIORITY scan...');
    }

    function performActiveScan() {
        if (currentMode === 0) return;

        if (isCloudflareVerification && isInitialPage() && cloudflareMonitoringActive) {
            updateStatus('Cloudflare on initial page. Waiting...');
            scheduleNextScan();
            return;
        }

        if (isCloudflareVerification && !isInitialPage() && cloudflareDetectionCount > 0) {
            updateStatus('Continuing scan (post-initial page)...');
            isCloudflareVerification = false;
        }

        const now = Date.now();
        totalScanTime = now - priorityScanStartTime;

        if (totalScanTime > maxTotalScanTime) {
            updateStatus('Maximum scan time reached (3 minutes). Stopping.');
            return;
        }

        const buttons = checkForButtons();
        let foundSomething = false;

        if (buttons.arsenalBtn) {
            updateStatus('USER ARSENAL TARGET FOUND!');
            const shouldClick = currentMode !== 1;
            performClick(buttons.arsenalBtn.element, false, false, shouldClick, true);
            foundSomething = true;
            lastButtonFoundTime = now;
            scheduleNextScan();
            return;
        }

        let foundPriority = false;

        if (currentMode === 2 || currentMode === 3) {
            if (buttons.continueBtn || buttons.getLinkBtn || buttons.verifyBtn || (currentMode === 3 && buttons.downloadBtn)) {
                 foundPriority = true;
            }
        }

        const timeSinceLastClick = now - lastClickTime;
        if (burstModeActive || (!foundPriority && timeSinceLastClick < 3000)) {
             if (!foundSomething) {
                 currentScanInterval = 100;
                 scheduleNextScan();
                 return;
             }
        }

        if (currentMode === 1) {
            if (buttons.downloadBtn && !buttons.downloadBtn.getAttribute('data-uad-highlighted')) {
                updateStatus('Download button detected'); performClick(buttons.downloadBtn, true, false, false); foundSomething = true;
            } else if (buttons.continueBtn && !buttons.continueBtn.getAttribute('data-uad-highlighted')) {
                updateStatus('Continue button detected'); performClick(buttons.continueBtn, false, false, false); foundSomething = true;
            } else if (buttons.getLinkBtn && !buttons.getLinkBtn.getAttribute('data-uad-highlighted')) {
                updateStatus('Get Link detected'); performClick(buttons.getLinkBtn, false, false, false); foundSomething = true;
            } else if (buttons.skipBtn && !buttons.skipBtn.getAttribute('data-uad-highlighted')) {
                updateStatus('Skip button detected'); performClick(buttons.skipBtn, false, false, false); foundSomething = true;
            } else if (buttons.nextBtn && !buttons.nextBtn.getAttribute('data-uad-highlighted')) {
                updateStatus('Next button detected'); performClick(buttons.nextBtn, false, false, false); foundSomething = true;
            } else if (buttons.verifyBtn && !buttons.verifyBtn.getAttribute('data-uad-highlighted')) {
                updateStatus('Verification detected (Cloudflare)'); performClick(buttons.verifyBtn, false, true, false); foundSomething = true;
            } else { updateStatus('Scanning...'); }
        } else if (currentMode === 2 || currentMode === 3) {
            if (buttons.primary && (hasSpentEnoughTimeOnStep() || foundPriority)) {
                if (buttons.continueBtn) {
                    updateStatus('Found continue button (Priority)'); performClick(buttons.continueBtn, false, false, true, true); foundSomething = true;
                } else if (buttons.getLinkBtn) {
                    updateStatus('Found get link button (Priority)'); performClick(buttons.getLinkBtn, false, false, true, true); foundSomething = true;
                } else if (buttons.verifyBtn) {
                    updateStatus('Found verify button (Cloudflare)'); performClick(buttons.verifyBtn, false, true, true, true); foundSomething = true;
                } else if (buttons.downloadBtn && currentMode === 3) {
                    updateStatus('Found download button (Turbo Mode)'); performClick(buttons.downloadBtn, true, false, true, true); foundSomething = true;
                }
            } else if (buttons.secondary && hasSpentEnoughTimeOnStep()) {
                if (buttons.skipBtn) {
                    updateStatus('Found skip button (Time elapsed)'); performClick(buttons.skipBtn, false); foundSomething = true;
                } else if (buttons.nextBtn) {
                    updateStatus('Found next button (Time elapsed)'); performClick(buttons.nextBtn, false); foundSomething = true;
                }
            } else if (!buttons.primary && !buttons.secondary) {
                if (Date.now() - stepStartTime >= currentWaitTime) {
                    if (currentWaitTime < maxWaitTime) {
                        currentWaitTime += 10000;
                        stepStartTime = Date.now();
                        updateStatus(`Not found, extending wait time to ${currentWaitTime/1000}s`);
                    } else { updateStatus('Maximum wait time reached. No buttons found.'); }
                } else {
                    const timeSpent = Date.now() - stepStartTime;
                    const timeLeft = Math.ceil((currentWaitTime - timeSpent) / 1000);
                    if (timeLeft > 0) updateStatus(`Waiting safety timer: ${timeLeft}s`);
                }
            } else if (buttons.secondary && !hasSpentEnoughTimeOnStep()) {
                const timeSpent = Date.now() - stepStartTime;
                const timeLeft = Math.ceil((currentWaitTime - timeSpent) / 1000);
                updateStatus(`Waiting for secondary buttons: ${timeLeft}s`);
            } else { updateStatus('Scanning...'); }
        }

        if (foundSomething) lastButtonFoundTime = now;

        if (!foundSomething) {
            emptyScanCycles++;
            if (emptyScanCycles >= maxEmptyScanCycles) {
                if (currentScanInterval < maxScanInterval) { currentScanInterval += scanIncrement; }
            }
        } else {
            emptyScanCycles = 0;
            currentScanInterval = minScanInterval;
        }

        scheduleNextScan();
    }

    function scheduleNextScan() {
        if (scanTimeout) { clearTimeout(scanTimeout); }
        let nextInterval = currentScanInterval;

        if (burstModeActive) { nextInterval = 100; }

        else if (isCloudflareVerification && isInitialPage() && cloudflareMonitoringActive) { nextInterval = 3000; }
        else if (isCloudflareVerification && !isInitialPage()) { nextInterval = 1500; }
        else if (lastButtonFoundTime > 0 && (Date.now() - lastButtonFoundTime) < 3000) { nextInterval = 200; }

        scanTimeout = setTimeout(() => performActiveScan(), nextInterval);
    }

    function stopScanning() {
        if (scanTimeout) { clearTimeout(scanTimeout); scanTimeout = null; }
        updateStatus('Scanning stopped');
    }

    function resetAllActivations() {
        setMode(0);
        visualHighlighter.clearHighlight();
        stopScanning();
        updateStatus('All systems reset & paused');
    }

    function createHUD() {
        const existingHUD = document.getElementById('uad-hud');
        if (existingHUD) { existingHUD.remove(); }
        const modes = [
            { id: 0, icon: '⏸️', name: T.paused, color: '#9ca3af', bgColor: '#6b7280' },
            { id: 1, icon: '🔍', name: T.detect, color: '#60a5fa', bgColor: '#3b82f6' },
            { id: 2, icon: '🚀', name: T.bypass, color: '#f59e0b', bgColor: '#d97706' },
            { id: 3, icon: '⚡', name: T.turbo, color: '#10b981', bgColor: '#059669' }
        ];
        const speedOptions = [1, 2, 3, 4, 5, 6, 8, 10];
        const hud = document.createElement('div');
        hud.id = 'uad-hud';
        hud.innerHTML = `
            <div class="uad-header">
                <div class="uad-title-container"><div class="uad-logo">🚀</div><div class="uad-title"><div class="uad-main-title">${T.title}</div><div class="uad-subtitle">${T.subtitle}</div></div></div>
                <div class="uad-tabswitch-hint" id="uad-tabswitch-hint"><span class="uad-hint-icon">🔄</span><span class="uad-hint-text">Click TAB SWITCH first to activate buttons</span></div>
                <div class="uad-cloudflare-status" id="uad-cloudflare-status" style="display: none"><span class="uad-cf-icon">☁️</span><span class="uad-cf-text">Cloudflare detected - Waiting...</span></div>
            </div>
            <div class="uad-controls-row">
                <button id="uad-tabswitch-btn" class="uad-control-btn"><span class="uad-control-icon">🔄</span><span class="uad-control-text">${T.tab_switch}</span></button>
                <button id="uad-settings-btn" class="uad-control-btn"><span class="uad-control-icon">⚙️</span><span class="uad-control-text">Settings</span></button>
                <button id="uad-help-btn" class="uad-control-btn"><span class="uad-control-icon">❔</span><span class="uad-control-text">${T.help}</span></button>
                <button id="uad-min-btn" class="uad-control-btn"><span class="uad-control-icon">${isMinimized ? '⬈' : '⬋'}</span><span class="uad-control-text">${isMinimized ? 'Expand' : T.minimize}</span></button>
                <button id="uad-hide-btn" class="uad-control-btn"><span class="uad-control-icon">✕</span><span class="uad-control-text">${T.hide}</span></button>
            </div>
            <div id="uad-body" style="display: ${isMinimized ? 'none' : 'block'}">
                <div id="uad-main-view">
                    <div class="uad-modes-container">
                        ${modes.map(m => `<button class="uad-mode-btn ${currentMode === m.id ? 'active' : ''}" data-mode="${m.id}" style="--mode-color: ${m.color}; --mode-bg: ${m.bgColor}"><span class="uad-mode-btn-icon">${m.icon}</span><span class="uad-mode-btn-text">${m.name}</span></button>`).join('')}
                    </div>
                    <div class="uad-speed-control">
                        <div class="uad-speed-label">${T.time_warp}</div>
                        <div class="uad-speed-selector">
                            <button id="uad-speed-decrease" class="uad-speed-btn">−</button><div class="uad-speed-display" id="uad-speed-display">${timeWarpSpeed}x</div><button id="uad-speed-increase" class="uad-speed-btn">+</button>
                            <select id="uad-speed-select" class="uad-speed-dropdown">${speedOptions.map(s => `<option value="${s}" ${s === timeWarpSpeed ? 'selected' : ''}>${s}x</option>`).join('')}</select>
                        </div>
                    </div>
                    <div class="uad-info-container">
                        <div class="uad-info-row">
                            <div class="uad-info-box"><div class="uad-info-label">${T.status}</div><div class="uad-info-value" id="uad-status-text">Ready</div></div>
                            <div class="uad-info-box"><div class="uad-info-label">${T.cooldown}</div><div class="uad-info-value" id="uad-cooldown-text">0s</div></div>
                        </div>
                        <div class="uad-info-box"><div class="uad-info-label">${T.step_timer}</div><div class="uad-info-value" id="uad-step-text">${T.not_started}</div></div>
                        <div class="uad-tips-box"><div class="uad-tips-text">${T.tip}</div></div>
                        <div class="uad-footer">Developed by <strong style="font-size: 1.2em">Tauã B. Kloch Leite</strong> | Mode: ${['STOP', 'DETECT', 'BYPASS', 'TURBO'][currentMode]}</div>
                    </div>
                    <div class="uad-resize-handle"></div>
                </div>
                <div id="uad-settings-view" style="display: none;">
                    <button id="uad-settings-back" class="uad-back-btn">${T.back}</button>
                    <div class="uad-settings-title">${T.arsenal_title}</div>
                    <div class="uad-settings-desc">${T.arsenal_desc}</div>
                    <textarea id="uad-arsenal-input" class="uad-textarea" placeholder="Example:\ndownload-btn\nbtn-primary\nClick Here"></textarea>
                    <button id="uad-save-arsenal" class="uad-save-btn">${T.save}</button>
                </div>
            </div>
        `;
        const stopEvent = (e) => { e.stopPropagation(); };
        ['mousedown', 'mouseup', 'click', 'dblclick'].forEach(eventType => { hud.addEventListener(eventType, stopEvent); });
        document.body.appendChild(hud);
        applyHUDCSS();
        const savedPos = GM_getValue('uad_hud_position', { x: 20, y: 20 });
        hud.style.position = 'fixed';
        hud.style.top = savedPos.y + 'px';
        hud.style.left = savedPos.x + 'px';
        hud.style.zIndex = '2147483647';
        hud.style.transform = `scale(${hudSize})`;
        hud.style.transformOrigin = 'top left';
        if (isHidden) { hud.style.display = 'none'; }
        document.querySelectorAll('.uad-mode-btn').forEach(btn => {
            btn.onclick = (e) => { e.preventDefault(); e.stopPropagation(); setMode(parseInt(btn.dataset.mode)); };
        });
        document.getElementById('uad-tabswitch-btn').onclick = (e) => { e.preventDefault(); e.stopPropagation(); humanSimulator.simulateTabSwitch(); document.getElementById('uad-tabswitch-hint').style.display = 'none'; };
        document.getElementById('uad-min-btn').onclick = (e) => { e.preventDefault(); e.stopPropagation(); toggleMinimize(); };
        document.getElementById('uad-hide-btn').onclick = (e) => { e.preventDefault(); e.stopPropagation(); toggleHUD(); };
        document.getElementById('uad-help-btn').onclick = (e) => { e.preventDefault(); e.stopPropagation(); showHelpModal(); };
        document.getElementById('uad-speed-increase').onclick = (e) => { e.preventDefault(); e.stopPropagation(); changeTimeWarpSpeed(1); };
        document.getElementById('uad-speed-decrease').onclick = (e) => { e.preventDefault(); e.stopPropagation(); changeTimeWarpSpeed(-1); };
        document.getElementById('uad-speed-select').onchange = (e) => { e.preventDefault(); changeTimeWarpSpeed(parseInt(e.target.value) - timeWarpSpeed); };

        const mainView = document.getElementById('uad-main-view');
        const settingsView = document.getElementById('uad-settings-view');
        const arsenalInput = document.getElementById('uad-arsenal-input');

        document.getElementById('uad-settings-btn').onclick = (e) => {
            e.preventDefault(); e.stopPropagation();
            arsenalInput.value = GM_getValue('uad_user_arsenal', '');
            mainView.style.display = 'none';
            settingsView.style.display = 'block';
        };

        document.getElementById('uad-settings-back').onclick = (e) => {
            e.preventDefault(); e.stopPropagation();
            settingsView.style.display = 'none';
            mainView.style.display = 'block';
        };

        document.getElementById('uad-save-arsenal').onclick = (e) => {
            e.preventDefault(); e.stopPropagation();
            GM_setValue('uad_user_arsenal', arsenalInput.value);
            const btn = document.getElementById('uad-save-arsenal');
            const originalText = btn.textContent;
            btn.textContent = T.saved;
            btn.style.background = '#10b981';
            setTimeout(() => {
                btn.textContent = originalText;
                btn.style.background = '#2563eb';
            }, 1500);
        };

        makeDraggable(hud);
        makeResizable(hud);
        setTimeout(() => { const hint = document.getElementById('uad-tabswitch-hint'); if (hint) { hint.style.display = 'flex'; } }, 2000);
        setInterval(() => {
            const cfStatus = document.getElementById('uad-cloudflare-status');
            if (cfStatus) {
                if (isCloudflareVerification && isInitialPage()) { cfStatus.style.display = 'flex'; }
                else { cfStatus.style.display = 'none'; }
            }
        }, 1000);
    }

    function applyHUDCSS() {
        const style = document.createElement('style');
        style.textContent = `
            #uad-hud { position: fixed !important; top: 20px !important; left: 20px !important; z-index: 2147483647 !important; background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%) !important; border: 2px solid #334155 !important; border-radius: 12px !important; box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5) !important; width: 340px !important; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important; user-select: none !important; backdrop-filter: blur(10px) !important; overflow: hidden !important; isolation: isolate !important; }
            #uad-hud * { cursor: default !important; } #uad-hud button { cursor: pointer !important; }
            .uad-header { padding: 15px 15px 10px 15px !important; background: rgba(30, 41, 59, 0.8) !important; border-bottom: 1px solid #334155 !important; cursor: move !important; }
            .uad-title-container { display: flex !important; align-items: center !important; gap: 10px !important; }
            .uad-logo { font-size: 24px !important; filter: drop-shadow(0 0 8px rgba(99, 179, 237, 0.4)) !important; }
            .uad-title { display: flex !important; flex-direction: column !important; gap: 3px !important; }
            .uad-main-title { font-size: 16px !important; font-weight: 800 !important; color: #f1f5f9 !important; line-height: 1 !important; letter-spacing: 0.5px !important; }
            .uad-subtitle { font-size: 11px !important; color: #94a3b8 !important; line-height: 1 !important; }
            .uad-tabswitch-hint { display: none !important; align-items: center !important; gap: 8px !important; margin-top: 10px !important; padding: 8px 12px !important; background: rgba(245, 158, 11, 0.2) !important; border: 1px solid rgba(245, 158, 11, 0.3) !important; border-radius: 8px !important; animation: pulse 2s infinite !important; }
            .uad-hint-icon { font-size: 16px !important; color: #f59e0b !important; }
            .uad-hint-text { font-size: 10px !important; color: #f1f5f9 !important; font-weight: 600 !important; line-height: 1.2 !important; }
            .uad-cloudflare-status { display: none !important; align-items: center !important; gap: 8px !important; margin-top: 8px !important; padding: 6px 10px !important; background: rgba(59, 130, 246, 0.2) !important; border: 1px solid rgba(59, 130, 246, 0.3) !important; border-radius: 8px !important; }
            .uad-cf-icon { font-size: 14px !important; color: #60a5fa !important; }
            .uad-cf-text { font-size: 9px !important; color: #cbd5e1 !important; font-weight: 600 !important; line-height: 1.2 !important; }
            .uad-controls-row { display: flex !important; justify-content: space-between !important; padding: 8px 10px !important; background: rgba(15, 23, 42, 0.9) !important; border-bottom: 1px solid #334155 !important; gap: 5px !important; }
            .uad-control-btn { flex: 1 !important; display: flex !important; flex-direction: column !important; align-items: center !important; gap: 3px !important; padding: 6px 4px !important; border: none !important; border-radius: 6px !important; background: rgba(71, 85, 105, 0.5) !important; color: #cbd5e1 !important; cursor: pointer !important; transition: all 0.2s !important; font-size: 10px !important; min-width: 40px !important; }
            .uad-control-btn:hover { background: #475569 !important; color: white !important; transform: translateY(-1px) !important; }
            #uad-tabswitch-btn { background: rgba(245, 158, 11, 0.2) !important; color: #f59e0b !important; } #uad-tabswitch-btn:hover { background: rgba(245, 158, 11, 0.4) !important; }
            #uad-settings-btn { background: rgba(99, 102, 241, 0.2) !important; color: #818cf8 !important; } #uad-settings-btn:hover { background: rgba(99, 102, 241, 0.4) !important; }
            .uad-control-icon { font-size: 14px !important; line-height: 1 !important; }
            .uad-control-text { font-size: 9px !important; font-weight: 600 !important; line-height: 1 !important; white-space: nowrap !important; overflow: hidden !important; text-overflow: ellipsis !important; max-width: 100% !important; }
            #uad-body { padding: 15px !important; position: relative !important; }
            .uad-modes-container { display: grid !important; grid-template-columns: repeat(4, 1fr) !important; gap: 8px !important; margin-bottom: 15px !important; }
            .uad-mode-btn { padding: 10px 5px !important; border: 2px solid var(--mode-color, #334155) !important; border-radius: 8px !important; background: rgba(30, 41, 59, 0.8) !important; cursor: pointer !important; display: flex !important; flex-direction: column !important; align-items: center !important; gap: 6px !important; transition: all 0.3s !important; position: relative !important; overflow: hidden !important; }
            .uad-mode-btn:hover { transform: translateY(-2px) !important; box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2) !important; }
            .uad-mode-btn.active { background: rgba(var(--mode-color-rgb, 96, 165, 250), 0.15) !important; border-color: var(--mode-color) !important; box-shadow: 0 0 20px rgba(var(--mode-color-rgb, 96, 165, 250), 0.25) !important; }
            .uad-mode-btn.active::before { content: '✓' !important; position: absolute !important; top: 4px !important; right: 4px !important; font-size: 10px !important; color: var(--mode-color) !important; font-weight: bold !important; }
            .uad-mode-btn-icon { font-size: 18px !important; line-height: 1 !important; }
            .uad-mode-btn-text { font-size: 11px !important; font-weight: 700 !important; color: var(--mode-color) !important; letter-spacing: 0.5px !important; line-height: 1 !important; text-transform: uppercase !important; }
            .uad-speed-control { background: rgba(30, 41, 59, 0.5) !important; padding: 10px !important; border-radius: 8px !important; border: 1px solid #334155 !important; margin-bottom: 15px !important; }
            .uad-speed-label { font-size: 10px !important; color: #94a3b8 !important; font-weight: 600 !important; letter-spacing: 0.5px !important; text-transform: uppercase !important; margin-bottom: 8px !important; line-height: 1 !important; text-align: center !important; }
            .uad-speed-selector { display: flex !important; align-items: center !important; justify-content: center !important; gap: 8px !important; }
            .uad-speed-btn { background: rgba(71, 85, 105, 0.5) !important; border: none !important; width: 28px !important; height: 28px !important; border-radius: 6px !important; color: #cbd5e1 !important; cursor: pointer !important; display: flex !important; align-items: center !important; justify-content: center !important; font-size: 16px !important; font-weight: bold !important; transition: all 0.2s !important; }
            .uad-speed-btn:hover { background: #475569 !important; color: white !important; transform: translateY(-1px) !important; }
            .uad-speed-display { font-size: 14px !important; font-weight: 700 !important; color: #f59e0b !important; min-width: 40px !important; text-align: center !important; padding: 4px 8px !important; background: rgba(245, 158, 11, 0.1) !important; border-radius: 6px !important; border: 1px solid rgba(245, 158, 11, 0.3) !important; }
            .uad-speed-dropdown { background: rgba(71, 85, 105, 0.5) !important; border: 1px solid #334155 !important; color: #cbd5e1 !important; padding: 4px 8px !important; border-radius: 6px !important; font-size: 11px !important; cursor: pointer !important; margin-left: 8px !important; outline: none !important; }
            .uad-info-container { display: flex !important; flex-direction: column !important; gap: 10px !important; }
            .uad-info-row { display: grid !important; grid-template-columns: 1fr 1fr !important; gap: 10px !important; }
            .uad-info-box { background: rgba(30, 41, 59, 0.5) !important; padding: 10px !important; border-radius: 8px !important; border: 1px solid #334155 !important; }
            .uad-info-label { font-size: 10px !important; color: #94a3b8 !important; font-weight: 600 !important; letter-spacing: 0.5px !important; text-transform: uppercase !important; margin-bottom: 5px !important; line-height: 1 !important; }
            .uad-info-value { font-size: 13px !important; font-weight: 700 !important; color: #f1f5f9 !important; line-height: 1 !important; min-height: 20px !important; white-space: nowrap !important; overflow: hidden !important; text-overflow: ellipsis !important; }
            .uad-tips-box { background: rgba(59, 130, 246, 0.1) !important; padding: 12px !important; border-radius: 8px !important; border: 1px solid rgba(59, 130, 246, 0.3) !important; }
            .uad-tips-text { font-size: 12px !important; color: #cbd5e1 !important; line-height: 1.5 !important; display: flex !important; flex-direction: column !important; gap: 6px !important; }
            .uad-tip-line { display: flex !important; align-items: center !important; gap: 8px !important; }
            .uad-tip-icon { font-size: 16px !important; min-width: 20px !important; text-align: center !important; }
            .uad-tip-line b { color: #fff !important; font-weight: 700 !important; }
            .uad-footer, .uad-header { cursor: move !important; } /* Force Move Cursor */
            .uad-footer { margin-top: 12px !important; padding-top: 8px !important; border-top: 1px solid #334155 !important; font-size: 9px !important; color: #64748b !important; text-align: center !important; font-family: monospace !important; }
            .uad-footer strong { color: #94a3b8 !important; font-weight: bold !important; }
            .uad-resize-handle { position: absolute !important; bottom: 0 !important; right: 0 !important; width: 15px !important; height: 15px !important; cursor: nwse-resize !important; background: linear-gradient(135deg, transparent 50%, #64748b 50%) !important; border-bottom-right-radius: 12px !important; opacity: 0.5 !important; }
            .uad-resize-handle:hover { opacity: 1 !important; background: linear-gradient(135deg, transparent 50%, #f59e0b 50%) !important; }
            /* Settings View CSS */
            .uad-back-btn { width: 100% !important; padding: 8px !important; margin-bottom: 10px !important; background: rgba(51, 65, 85, 0.5) !important; border: 1px solid #475569 !important; border-radius: 6px !important; color: #cbd5e1 !important; cursor: pointer !important; font-size: 11px !important; font-weight: bold !important; transition: all 0.2s !important; }
            .uad-back-btn:hover { background: #475569 !important; color: white !important; }
            .uad-settings-title { font-size: 12px !important; font-weight: bold !important; color: #f59e0b !important; margin-bottom: 5px !important; text-transform: uppercase !important; }
            .uad-settings-desc { font-size: 10px !important; color: #94a3b8 !important; margin-bottom: 10px !important; line-height: 1.3 !important; }
            .uad-textarea { width: 100% !important; height: 120px !important; background: rgba(15, 23, 42, 0.8) !important; border: 1px solid #334155 !important; border-radius: 6px !important; color: #f1f5f9 !important; padding: 8px !important; font-family: monospace !important; font-size: 11px !important; resize: none !important; box-sizing: border-box !important; outline: none !important; margin-bottom: 10px !important; }
            .uad-textarea:focus { border-color: #60a5fa !important; }
            .uad-save-btn { width: 100% !important; padding: 10px !important; background: #2563eb !important; border: none !important; border-radius: 6px !important; color: white !important; font-weight: bold !important; cursor: pointer !important; transition: all 0.2s !important; font-size: 12px !important; }
            .uad-save-btn:hover { background: #1d4ed8 !important; transform: translateY(-1px) !important; }
            @keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.7; } 100% { opacity: 1; } }

            /* Modal Styles */
            .uad-modal-overlay { position: fixed !important; top: 0 !important; left: 0 !important; width: 100% !important; height: 100% !important; background: rgba(0, 0, 0, 0.7) !important; z-index: 2147483647 !important; display: flex !important; align-items: center !important; justify-content: center !important; backdrop-filter: blur(5px) !important; }
            .uad-modal-content { background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%) !important; width: 500px !important; max-width: 90% !important; border-radius: 12px !important; border: 2px solid #334155 !important; box-shadow: 0 20px 60px rgba(0, 0, 0, 0.7) !important; overflow: hidden !important; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important; animation: uad-modal-in 0.3s ease !important; }
            .uad-modal-header { padding: 15px 20px !important; background: rgba(30, 41, 59, 0.8) !important; border-bottom: 1px solid #334155 !important; display: flex !important; justify-content: space-between !important; align-items: center !important; }
            .uad-modal-header h3 { margin: 0 !important; font-size: 18px !important; color: #f1f5f9 !important; font-weight: 700 !important; }
            .uad-modal-close { background: none !important; border: none !important; color: #94a3b8 !important; font-size: 24px !important; cursor: pointer !important; line-height: 1 !important; padding: 0 !important; }
            .uad-modal-close:hover { color: white !important; }
            .uad-modal-tabs { display: flex !important; border-bottom: 1px solid #334155 !important; background: rgba(15, 23, 42, 0.5) !important; }
            .uad-tab-btn { flex: 1 !important; padding: 12px !important; background: none !important; border: none !important; color: #94a3b8 !important; font-size: 12px !important; font-weight: 600 !important; cursor: pointer !important; transition: all 0.2s !important; border-bottom: 2px solid transparent !important; }
            .uad-tab-btn:hover { color: #f1f5f9 !important; background: rgba(255, 255, 255, 0.05) !important; }
            .uad-tab-btn.active { color: #f59e0b !important; border-bottom-color: #f59e0b !important; background: rgba(245, 158, 11, 0.1) !important; }
            .uad-modal-body { padding: 20px !important; min-height: 300px !important; max-height: 70vh !important; overflow-y: auto !important; color: #cbd5e1 !important; font-size: 13px !important; line-height: 1.6 !important; }
            .uad-tab-content { display: none !important; }
            .uad-tab-content.active { display: block !important; }
            .uad-help-section h4 { color: #f59e0b !important; margin: 0 0 10px 0 !important; font-size: 14px !important; text-transform: uppercase !important; border-bottom: 1px solid #334155 !important; padding-bottom: 5px !important; }
            .uad-help-section p { margin-bottom: 15px !important; }
            .uad-shortcuts-grid { display: grid !important; grid-template-columns: 1fr 1fr !important; gap: 10px !important; }
            .uad-shortcut-item-modal { display: flex !important; justify-content: space-between !important; align-items: center !important; padding: 8px !important; background: rgba(51, 65, 85, 0.3) !important; border-radius: 6px !important; }
            .uad-shortcut-item-modal kbd { background: #1e293b !important; padding: 2px 6px !important; border-radius: 4px !important; border: 1px solid #475569 !important; font-family: monospace !important; color: #f59e0b !important; font-weight: bold !important; font-size: 11px !important; }
            .uad-modal-footer { padding: 10px 20px !important; background: rgba(15, 23, 42, 0.9) !important; border-top: 1px solid #334155 !important; text-align: center !important; font-size: 11px !important; color: #64748b !important; }
            /* Support Tab CSS */
            .sup-row { display: flex !important; align-items: center !important; gap: 8px !important; margin-bottom: 10px !important; background: rgba(51, 65, 85, 0.3) !important; padding: 8px !important; border-radius: 8px !important; }
            .sup-icon { width: 20px !important; height: 20px !important; }
            .sup-val { flex: 1 !important; background: transparent !important; border: none !important; color: #f1f5f9 !important; font-family: monospace !important; font-size: 11px !important; outline: none !important; }
            .sup-copy { background: #3b82f6 !important; border: none !important; color: white !important; padding: 4px 10px !important; border-radius: 4px !important; cursor: pointer !important; font-size: 10px !important; font-weight: bold !important; }
            .sup-copy:hover { background: #2563eb !important; }
            @keyframes uad-modal-in { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        `;

        if (document.head) {
             document.head.appendChild(style);
        }
    }

    function setMode(mode) {
        if (mode !== currentMode) { clearDetectionState(); }
        currentMode = mode;
        GM_setValue('uad_mode', mode);
        document.querySelectorAll('.uad-mode-btn').forEach(btn => {
            const btnMode = parseInt(btn.dataset.mode);
            if (btnMode === mode) { btn.classList.add('active'); } else { btn.classList.remove('active'); }
        });
        updateStatus(`Mode changed to ${['PAUSED', 'DETECT', 'BYPASS', 'TURBO'][mode]}`);
        if (mode > 0) {
            startPriorityScan();
            setTimeout(async () => {
                if (isInitialPage() && cloudflareMonitoringActive && checkForCloudflare()) {
                    updateStatus('Cloudflare detected - Quick check...');
                    await new Promise(resolve => setTimeout(resolve, 500));
                }
                try { await safeAutoTabSwitch(); } catch (error) {}
                updateStatus('Starting scan...');
                setTimeout(() => performActiveScan(), 300);
            }, 300);
        } else { stopScanning(); }
    }

    function toggleMinimize() {
        isMinimized = !isMinimized;
        GM_setValue('uad_minimized', isMinimized);
        const body = document.getElementById('uad-body');
        const btn = document.getElementById('uad-min-btn');
        const btnIcon = btn.querySelector('.uad-control-icon');
        const btnText = btn.querySelector('.uad-control-text');
        if (body && btn) {
            body.style.display = isMinimized ? 'none' : 'block';
            btnIcon.textContent = isMinimized ? '⬈' : '⬋';
            btnText.textContent = isMinimized ? 'Expand' : T.minimize;
        }
    }

    function toggleHUD() {
        isHidden = !isHidden;
        GM_setValue('uad_hidden', isHidden);
        const hud = document.getElementById('uad-hud');
        if (hud) {
            hud.style.display = isHidden ? 'none' : 'block';
            updateStatus(`HUD ${isHidden ? 'hidden' : 'shown'}`);
        }
    }

    function makeDraggable(element) {
        let isDragging = false;
        let startX, startY, startLeft, startTop;
        const header = element.querySelector('.uad-header');
        const footer = element.querySelector('.uad-footer');

        function startDrag(e) {
            if (e.target.tagName === 'BUTTON' || e.target.closest('button') || e.target.classList.contains('uad-resize-handle')) { return; }
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            const rect = element.getBoundingClientRect();
            startLeft = rect.left;
            startTop = rect.top;
            window.addEventListener('mousemove', onDrag);
            window.addEventListener('mouseup', stopDrag);
            e.preventDefault();
            document.body.style.cursor = 'move';
        }

        function onDrag(e) {
            if (!isDragging) return;
            if (e.buttons === 0) { stopDrag(); return; }

            const deltaX = e.clientX - startX;
            const deltaY = e.clientY - startY;
            let newLeft = startLeft + deltaX;
            let newTop = startTop + deltaY;

            const maxX = window.innerWidth - 50;
            const maxY = window.innerHeight - 50;

            newLeft = Math.max(-100, Math.min(newLeft, maxX));
            newTop = Math.max(-100, Math.min(newTop, maxY));

            element.style.left = newLeft + 'px';
            element.style.top = newTop + 'px';
        }

        function stopDrag() {
            if (!isDragging) return;
            isDragging = false;
            window.removeEventListener('mousemove', onDrag);
            window.removeEventListener('mouseup', stopDrag);
            document.body.style.cursor = '';
            const rect = element.getBoundingClientRect();
            GM_setValue('uad_hud_position', { x: rect.left, y: rect.top });
        }

        header.addEventListener('mousedown', startDrag);
        if (footer) {
             footer.addEventListener('mousedown', startDrag);
        }
    }

    function makeResizable(hud) {
        const handle = hud.querySelector('.uad-resize-handle');
        if (!handle) return;

        handle.addEventListener('mousedown', (e) => {
            e.preventDefault();
            e.stopPropagation();

            const startY = e.clientY;
            const startScale = hudSize;

            const onMove = (em) => {
                if (em.buttons === 0) { onUp(); return; }

                const dy = em.clientY - startY;
                const newScale = Math.max(0.5, Math.min(1.5, startScale + dy * 0.005));

                hudSize = newScale;
                hud.style.transform = `scale(${hudSize})`;
            };

            const onUp = () => {
                window.removeEventListener('mousemove', onMove);
                window.removeEventListener('mouseup', onUp);
                GM_setValue('uad_hud_size', hudSize);
            };

            window.addEventListener('mousemove', onMove);
            window.addEventListener('mouseup', onUp);
        });
    }

    function updateStatus(message) {
        const el = document.getElementById('uad-status-text');
        if (el) {
            el.textContent = message;
            el.style.animation = 'none';
            setTimeout(() => el.style.animation = 'pulse 0.5s', 10);
            const cfStatus = document.getElementById('uad-cloudflare-status');
            if (cfStatus && isCloudflareVerification && isInitialPage()) {
                cfStatus.querySelector('.uad-cf-text').textContent = `Cloudflare - ${message}`;
            }
        }
    }

    function updateCooldown(seconds) {
        const el = document.getElementById('uad-cooldown-text');
        if (el) { el.textContent = seconds + 's'; el.style.color = seconds > 0 ? '#f87171' : '#34d399'; }
    }

    function updateStepTimer() {
        const el = document.getElementById('uad-step-text');
        if (el && stepStartTime > 0) {
            const timeSpent = Date.now() - stepStartTime;
            const timeLeft = Math.max(0, currentWaitTime - timeSpent);
            const secondsLeft = Math.ceil(timeLeft / 1000);
            el.textContent = `${secondsLeft}s left`;
            el.style.color = timeLeft > 4000 ? '#34d399' : (timeLeft > 2000 ? '#f59e0b' : '#f87171');
        }
    }

    
    function showHelpModal() {
        const existingModal = document.getElementById('uad-help-modal');
        if (existingModal) { existingModal.remove(); return; }

        const ICONS = {
            pix: "https://upload.wikimedia.org/wikipedia/commons/a/a2/Logo%E2%80%94pix_powered_by_Banco_Central_%28Brazil%2C_2020%29.svg",
            paypal: "https://www.paypalobjects.com/webstatic/icon/pp258.png",
            btc: "https://cryptologos.cc/logos/bitcoin-btc-logo.svg?v=025",
            eth: "https://cryptologos.cc/logos/ethereum-eth-logo.svg?v=025",
            sol: "https://cryptologos.cc/logos/solana-sol-logo.svg?v=025",
            bnb: "https://cryptologos.cc/logos/bnb-bnb-logo.svg?v=025",
            matic: "https://cryptologos.cc/logos/polygon-matic-logo.svg?v=025",
            usdt: "https://cryptologos.cc/logos/tether-usdt-logo.svg?v=025"
        };

        const cryptoList = [
            {img: ICONS.btc, name: "BTC", val: "bc1q6gz3dtj9qvlxyyh3grz35x8xc7hkuj07knlemn"},
            {img: ICONS.eth, name: "ETH", val: "0xd8724d0b19d355e9817d2a468f49e8ce067e70a6"},
            {img: ICONS.sol, name: "SOL", val: "7ztAogE7SsyBw7mwVHhUr5ZcjUXQr99JoJ6oAgP99aCn"},
            {img: ICONS.usdt, name: "USDT", val: "0xd8724d0b19d355e9817d2a468f49e8ce067e70a6"},
            {img: ICONS.bnb, name: "BNB", val: "0xd8724d0b19d355e9817d2a468f49e8ce067e70a6"},
            {img: ICONS.matic, name: "MATIC", val: "0xd8724d0b19d355e9817d2a468f49e8ce067e70a6"}
        ].map(c => `<div class="sup-row"><img src="${c.img}" class="sup-icon"><span style="font-size:9px;color:#888;width:30px">${c.name}</span><input type="text" class="sup-val" readonly value="${c.val}"><button class="sup-copy" data-val="${c.val}">${T.btn_copy}</button></div>`).join('');

        const supContent = `
            <div style="padding:15px;text-align:center">
                <div style="color:#f59e0b;font-weight:bold;margin-bottom:5px">${T.support_title}</div>
                <div style="color:#aaa;font-size:11px;margin-bottom:15px">${T.support_desc}</div>
                <div style="text-align:left;color:#f59e0b;font-weight:bold;font-size:10px;margin-bottom:5px">${T.lbl_pix}</div>
                <div class="sup-row"><img src="${ICONS.pix}" class="sup-icon"><input type="text" class="sup-val" readonly value="69993230419"><button class="sup-copy" data-val="69993230419">${T.btn_copy}</button></div>
                <div style="text-align:left;color:#f59e0b;font-weight:bold;font-size:10px;margin:15px 0 5px">${T.wallet_title}</div>
                ${cryptoList}
                <a href="https://www.paypal.com/donate/?business=4J4UK7ACU3DS6" target="_blank" style="display:inline-flex;align-items:center;gap:8px;background:#003087;color:white;padding:8px 20px;border-radius:20px;text-decoration:none;font-weight:bold;margin-top:20px;font-size:12px"><img src="${ICONS.paypal}" style="height:20px"> PayPal</a>
            </div>
        `;

        const modal = document.createElement('div');
        modal.id = 'uad-help-modal';
        modal.className = 'uad-modal-overlay';

        
        modal.style.setProperty('z-index', '2147483647', 'important');
        modal.style.setProperty('visibility', 'visible', 'important');
        modal.style.setProperty('opacity', '1', 'important');
        modal.style.setProperty('display', 'flex', 'important');

        modal.innerHTML = `
            <div class="uad-modal-content">
                <div class="uad-modal-header"><h3>🚀 ${T.title} v1.5.1</h3><button class="uad-modal-close">×</button></div>
                <div class="uad-modal-tabs">
                    <button class="uad-tab-btn active" data-tab="instructions">📋 Instructions</button>
                    <button class="uad-tab-btn" data-tab="modes">⚙️ Modes</button>
                    <button class="uad-tab-btn" data-tab="shortcuts">⌨️ Shortcuts</button>
                    <button class="uad-tab-btn" data-tab="support">❤️ Support</button>
                </div>
                <div class="uad-modal-body">
                    <div id="instructions-tab" class="uad-tab-content active">
                        <div class="uad-help-section">
                            <h4>🔥 NEW: RAPID REACTION</h4>
                            <p>The script now scans instantly after each click to find the next button. No more waiting!</p>
                            <h4>🛠️ USER ARSENAL</h4>
                            <p>Add your own button IDs/Classes in the Settings menu (Gear Icon). They will be clicked <strong>INSTANTLY</strong>.</p>
                            <h4>🔄 SMART TAB SWITCH</h4>
                            <p>If buttons are hidden, use the "Tab Switch" button to simulate user activity and reveal them.</p>
                        </div>
                    </div>
                    <div id="modes-tab" class="uad-tab-content">
                        <div class="uad-help-section">
                            <h4>⏸️ PAUSED MODE (DEFAULT)</h4><p>Script disabled. No automation.</p>
                            <h4>🔍 DETECT MODE</h4><p>Highlights buttons (Red Border + Rocket) but DOES NOT CLICK. Useful for testing.</p>
                            <h4>🚀 BYPASS MODE</h4><p>Clicks "Continue", "Skip", "Next". DOES NOT click "Download". Best for safety.</p>
                            <h4>⚡ TURBO MODE</h4><p>Full automation. Clicks EVERYTHING including "Download". Use with caution.</p>
                        </div>
                    </div>
                    <div id="shortcuts-tab" class="uad-tab-content">
                        <div class="uad-help-section"><h4>⌨️ KEYBOARD SHORTCUTS</h4><div class="uad-shortcuts-grid">
                            <div class="uad-shortcut-item-modal"><kbd>${shortcuts.autoTabSwitch}</kbd><span>Safe Auto Tab</span></div>
                            <div class="uad-shortcut-item-modal"><kbd>${shortcuts.simulateTabSwitch}</kbd><span>Manual Tab Switch</span></div>
                            <div class="uad-shortcut-item-modal"><kbd>${shortcuts.toggleHUD}</kbd><span>Show/Hide HUD</span></div>
                            <div class="uad-shortcut-item-modal"><kbd>${shortcuts.toggleMode}</kbd><span>Cycle Mode</span></div>
                            <div class="uad-shortcut-item-modal"><kbd>${shortcuts.showHelp}</kbd><span>Show Help</span></div>
                            <div class="uad-shortcut-item-modal"><kbd>${shortcuts.increaseSpeed}</kbd><span>Speed Up</span></div>
                            <div class="uad-shortcut-item-modal"><kbd>${shortcuts.decreaseSpeed}</kbd><span>Slow Down</span></div>
                        </div></div>
                    </div>
                    <div id="support-tab" class="uad-tab-content">${supContent}</div>
                </div>
                <div class="uad-modal-footer">Developed by <strong>Tauã B. Kloch Leite</strong> | v1.5.1</div>
            </div>
        `;

        // Inject into body or HTML to ensure visibility
        (document.body || document.documentElement).appendChild(modal);

        // Modal Logic
        const closeBtn = modal.querySelector('.uad-modal-close');
        closeBtn.onclick = () => modal.remove();
        modal.onclick = (e) => { if (e.target === modal) modal.remove(); };

        const tabs = modal.querySelectorAll('.uad-tab-btn');
        const contents = modal.querySelectorAll('.uad-tab-content');

        tabs.forEach(tab => {
            tab.onclick = () => {
                tabs.forEach(t => t.classList.remove('active'));
                contents.forEach(c => c.classList.remove('active'));
                tab.classList.add('active');
                document.getElementById(`${tab.dataset.tab}-tab`).classList.add('active');
            };
        });

        // Copy Logic
        modal.querySelectorAll('.sup-copy').forEach(btn => {
            btn.onclick = () => {
                const val = btn.getAttribute('data-val');
                if (val) {
                    navigator.clipboard.writeText(val);
                    const original = btn.textContent;
                    btn.textContent = 'COPIED!';
                    btn.style.background = '#10b981';
                    setTimeout(() => {
                        btn.textContent = original;
                        btn.style.background = '#3b82f6';
                    }, 1000);
                }
            };
        });
    }

    function setupUserClickDetector() {
        document.addEventListener('click', (e) => {
            const target = e.target.closest('button, a, input[type="submit"], [role="button"], .btn');
            if (target) {
                target.setAttribute('data-uad-clicked', 'true');
                target.classList.add('uad-clicked');
                if (target.classList.contains('uad-highlight-target')) {
                    visualHighlighter.clearHighlight();
                    updateStatus('User clicked! Moving to next step...');
                    startNewStep();
                    setTimeout(() => performActiveScan(), 200);
                }
            }
        }, true);
    }

    function init() {
        initialLoadTime = Date.now();
        cloudflareCheckCount = 0;
        lastPageUrl = win.location.href;
        cloudflareMonitoringActive = true;
        isInitialPageCheckComplete = false;
        createHUD();
        setupKeyboardShortcuts();
        setupUserClickDetector();
        registerMenuCommands();
        if (isInitialPage()) { monitorCloudflareStatus(); }
        else { cloudflareMonitoringActive = false; isInitialPageCheckComplete = true; }
        if (currentMode > 0) { setMode(currentMode); }
    }

    function setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            if (e.altKey && e.shiftKey) {
                switch(e.code) {
                    case 'KeyY': e.preventDefault(); toggleHUD(); break;
                    case 'KeyH': e.preventDefault(); showHelpModal(); break;
                    case 'KeyM': { e.preventDefault(); const nextMode = (currentMode + 1) % 4; setMode(nextMode); break; }
                    case 'KeyT': e.preventDefault(); humanSimulator.simulateTabSwitch(); break;
                    case 'KeyA': e.preventDefault(); safeAutoTabSwitch(); break;
                    case 'Equal': case 'NumpadAdd': e.preventDefault(); changeTimeWarpSpeed(1); break;
                    case 'Minus': case 'NumpadSubtract': e.preventDefault(); changeTimeWarpSpeed(-1); break;
                }
            }
        });
    }

    function registerMenuCommands() {
        GM_registerMenuCommand(`🚀 Safe Auto Tab Switch (${shortcuts.autoTabSwitch})`, () => safeAutoTabSwitch());
        GM_registerMenuCommand(`🖱️ Simulate Tab Switch (${shortcuts.simulateTabSwitch})`, () => humanSimulator.simulateTabSwitch());
        GM_registerMenuCommand(`🔄 Reset All Activations`, resetAllActivations);
        GM_registerMenuCommand(`❓ Show Help Panel (${shortcuts.showHelp})`, showHelpModal);
        GM_registerMenuCommand(`👁️ Toggle HUD Visibility (${shortcuts.toggleHUD})`, toggleHUD);
        GM_registerMenuCommand(`🔀 Cycle Mode (${shortcuts.toggleMode})`, () => { const nextMode = (currentMode + 1) % 4; setMode(nextMode); });
        GM_registerMenuCommand(`⏩ Increase Time Warp (${shortcuts.increaseSpeed})`, () => changeTimeWarpSpeed(1));
        GM_registerMenuCommand(`⏪ Decrease Time Warp (${shortcuts.decreaseSpeed})`, () => changeTimeWarpSpeed(-1));
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();