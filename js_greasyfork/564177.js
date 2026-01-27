// ==UserScript==
// @name         URL Safety Checker - Nabz Clan
// @namespace    https://developer.nabzclan.vip/
// @version      1.0
// @description  Real-time URL safety checker using Nabz Clan phishing database
// @description:es Verificador de seguridad de URL en tiempo real usando la base de datos de phishing de Nabz Clan
// @author       NabzClan Team - nabzclan.vip
// @license      MIT
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @connect      developer.nabzclan.vip
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @supportURL   https://developer.nabzclan.vip/
// @homepageURL  https://developer.nabzclan.vip/
// @run-at       document-end
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/564177/URL%20Safety%20Checker%20-%20Nabz%20Clan.user.js
// @updateURL https://update.greasyfork.org/scripts/564177/URL%20Safety%20Checker%20-%20Nabz%20Clan.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ============================================
    // CONFIGURATION
    // ============================================
    const CONFIG = {
        apiToken: 'YOUR_API_TOKEN_HERE', // Get your token at https://developer.nabzclan.vip/
        apiEndpoint: 'https://developer.nabzclan.vip/api/url-safety',
        checkType: 'all', // Options: 'all', 'domain', 'link'
        autoCheckOnLoad: true,
        displayDuration: 6000 // milliseconds
    };

    // ============================================
    // TRANSLATIONS
    // ============================================
    const lang = navigator.language || navigator.userLanguage;
    const isSpanish = lang.startsWith('es');

    const MESSAGES = {
        noToken: {
            en: 'Please configure your API token. Get one free at https://developer.nabzclan.vip/',
            es: 'Por favor configure su token API. Obtenga uno gratis en https://developer.nabzclan.vip/'
        },
        checking: {
            en: 'Checking URL safety...',
            es: 'Verificando seguridad de la URL...'
        },
        safe: {
            en: '✓ This URL is safe',
            es: '✓ Esta URL es segura'
        },
        phishing: {
            en: '⚠ Warning: Phishing detected!',
            es: '⚠ Advertencia: ¡Phishing detectado!'
        },
        unsafe: {
            en: '⚠ This URL may be unsafe',
            es: '⚠ Esta URL puede no ser segura'
        },
        critical: {
            en: '🛑 DANGER: Critical threat detected!',
            es: '🛑 PELIGRO: ¡Amenaza crítica detectada!'
        },
        error: {
            en: '✗ Error checking URL safety',
            es: '✗ Error al verificar seguridad de la URL'
        },
        riskLevel: {
            en: 'Risk Level',
            es: 'Nivel de Riesgo'
        },
        threatType: {
            en: 'Threat Type',
            es: 'Tipo de Amenaza'
        },
        poweredBy: {
            en: 'Powered by Nabz Clan - nabzclan.vip',
            es: 'Desarrollado por Nabz Clan - nabzclan.vip'
        }
    };

    const t = (key) => MESSAGES[key][isSpanish ? 'es' : 'en'];

    // ============================================
    // STYLES
    // ============================================
    const isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

    GM_addStyle(`
        #nabz-url-checker {
            position: fixed;
            top: 20px;
            right: 20px;
            min-width: 320px;
            max-width: 400px;
            padding: 16px 20px;
            border-radius: 12px;
            box-shadow: 0 8px 32px rgba(0,0,0,0.3);
            z-index: 999999;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            font-size: 14px;
            line-height: 1.5;
            opacity: 0;
            transform: translateY(-20px);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            pointer-events: none;
        }

        #nabz-url-checker.show {
            opacity: 1;
            transform: translateY(0);
            pointer-events: auto;
        }

        #nabz-url-checker.safe {
            background: ${isDarkMode ? '#1a3a1a' : '#d4edda'};
            border: 2px solid ${isDarkMode ? '#28a745' : '#28a745'};
            color: ${isDarkMode ? '#a8e6a8' : '#155724'};
        }

        #nabz-url-checker.warning {
            background: ${isDarkMode ? '#3d3a1a' : '#fff3cd'};
            border: 2px solid ${isDarkMode ? '#ffc107' : '#ffc107'};
            color: ${isDarkMode ? '#ffe066' : '#856404'};
        }

        #nabz-url-checker.danger {
            background: ${isDarkMode ? '#3d1a1a' : '#f8d7da'};
            border: 2px solid ${isDarkMode ? '#dc3545' : '#dc3545'};
            color: ${isDarkMode ? '#ff8080' : '#721c24'};
        }

        #nabz-url-checker.critical {
            background: ${isDarkMode ? '#2d0a0a' : '#f5c6cb'};
            border: 2px solid ${isDarkMode ? '#8b0000' : '#8b0000'};
            color: ${isDarkMode ? '#ff4444' : '#4d0000'};
            animation: pulse 2s infinite;
        }

        @keyframes pulse {
            0%, 100% { box-shadow: 0 8px 32px rgba(220,53,69,0.4); }
            50% { box-shadow: 0 8px 48px rgba(220,53,69,0.6); }
        }

        #nabz-url-checker .header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 12px;
        }

        #nabz-url-checker .title {
            font-weight: 600;
            font-size: 16px;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        #nabz-url-checker .close-btn {
            background: none;
            border: none;
            font-size: 20px;
            cursor: pointer;
            opacity: 0.6;
            transition: opacity 0.2s;
            color: inherit;
            padding: 0;
            line-height: 1;
        }

        #nabz-url-checker .close-btn:hover {
            opacity: 1;
        }

        #nabz-url-checker .content {
            margin-bottom: 12px;
        }

        #nabz-url-checker .detail {
            margin: 6px 0;
            font-size: 13px;
            opacity: 0.9;
        }

        #nabz-url-checker .detail strong {
            font-weight: 600;
        }

        #nabz-url-checker .spinner {
            display: inline-block;
            width: 16px;
            height: 16px;
            border: 2px solid currentColor;
            border-radius: 50%;
            border-top-color: transparent;
            animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
            to { transform: rotate(360deg); }
        }

        #nabz-url-checker .footer {
            text-align: center;
            font-size: 11px;
            opacity: 0.7;
            margin-top: 8px;
            padding-top: 8px;
            border-top: 1px solid currentColor;
        }

        #nabz-url-checker .url-display {
            font-size: 12px;
            opacity: 0.8;
            word-break: break-all;
            margin-top: 8px;
            padding: 8px;
            background: rgba(0,0,0,0.1);
            border-radius: 6px;
        }
    `);

    // ============================================
    // NOTIFICATION COMPONENT
    // ============================================
    class URLChecker {
        constructor() {
            this.element = null;
            this.timeout = null;
            this.init();
        }

        init() {
            this.element = $(`
                <div id="nabz-url-checker">
                    <div class="header">
                        <div class="title"></div>
                        <button class="close-btn">×</button>
                    </div>
                    <div class="content"></div>
                    <div class="footer">${t('poweredBy')}</div>
                </div>
            `);

            $('body').append(this.element);
            this.element.find('.close-btn').on('click', () => this.hide());
        }

        show(type, message, details = {}) {
            clearTimeout(this.timeout);

            this.element.removeClass('safe warning danger critical');
            this.element.addClass(type);

            const titleHtml = type === 'checking'
                ? `<span class="spinner"></span> ${message}`
                : message;

            this.element.find('.title').html(titleHtml);

            let contentHtml = '';
            if (details.url) {
                contentHtml += `<div class="url-display">${this.truncateUrl(details.url)}</div>`;
            }
            if (details.riskLevel) {
                contentHtml += `<div class="detail"><strong>${t('riskLevel')}:</strong> ${details.riskLevel.toUpperCase()}</div>`;
            }
            if (details.threats && details.threats.length > 0) {
                details.threats.forEach(threat => {
                    contentHtml += `<div class="detail"><strong>${t('threatType')}:</strong> ${threat.description}</div>`;
                });
            }

            this.element.find('.content').html(contentHtml);
            this.element.addClass('show');

            if (type !== 'checking') {
                this.timeout = setTimeout(() => this.hide(), CONFIG.displayDuration);
            }
        }

        hide() {
            this.element.removeClass('show');
            clearTimeout(this.timeout);
        }

        truncateUrl(url, maxLength = 50) {
            return url.length > maxLength ? url.substring(0, maxLength) + '...' : url;
        }
    }

    // ============================================
    // API HANDLER
    // ============================================
    class NabzAPI {
        constructor(token) {
            this.token = token;
        }

        async checkURL(url) {
            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: `${CONFIG.apiEndpoint}?url=${encodeURIComponent(url)}&check_type=${CONFIG.checkType}`,
                    headers: {
                        'Authorization': `Bearer ${this.token}`,
                        'Accept': 'application/json'
                    },
                    onload: (response) => {
                        try {
                            const data = JSON.parse(response.responseText);
                            resolve(data);
                        } catch (e) {
                            reject(new Error('Failed to parse response'));
                        }
                    },
                    onerror: () => reject(new Error('Network error')),
                    ontimeout: () => reject(new Error('Request timeout'))
                });
            });
        }
    }

    // ============================================
    // MAIN LOGIC
    // ============================================
    function main() {
        if (!CONFIG.apiToken || CONFIG.apiToken === 'YOUR_API_TOKEN_HERE') {
            console.error('[Nabz URL Checker]', t('noToken'));
            alert(t('noToken'));
            return;
        }

        const checker = new URLChecker();
        const api = new NabzAPI(CONFIG.apiToken);

        async function checkCurrentURL() {
            const currentURL = window.location.href;

            checker.show('checking', t('checking'), { url: currentURL });

            try {
                const result = await api.checkURL(currentURL);
                handleResult(result, currentURL);
            } catch (error) {
                console.error('[Nabz URL Checker]', error);
                checker.show('danger', t('error'), { url: currentURL });
            }
        }

        function handleResult(result, url) {
            if (result.safe) {
                checker.show('safe', t('safe'), {
                    url: url,
                    riskLevel: result.risk_level
                });
            } else {
                const type = result.risk_level === 'critical' ? 'critical' :
                           result.risk_level === 'high' ? 'danger' : 'warning';

                let message = t('unsafe');
                if (result.threats.some(t => t.type.includes('phishing'))) {
                    message = t('phishing');
                }
                if (result.risk_level === 'critical') {
                    message = t('critical');
                }

                checker.show(type, message, {
                    url: url,
                    riskLevel: result.risk_level,
                    threats: result.threats
                });
            }
        }

        if (CONFIG.autoCheckOnLoad) {
            checkCurrentURL();
        }

        let lastURL = window.location.href;
        const observer = new MutationObserver(() => {
            if (lastURL !== window.location.href) {
                lastURL = window.location.href;
                if (CONFIG.autoCheckOnLoad) {
                    checkCurrentURL();
                }
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        if (typeof GM_registerMenuCommand !== 'undefined') {
            GM_registerMenuCommand(
                isSpanish ? 'Verificar seguridad de esta URL' : 'Check this URL safety',
                checkCurrentURL
            );
        }
    }

    // ============================================
    // INITIALIZATION
    // ============================================
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', main);
    } else {
        main();
    }

})();
