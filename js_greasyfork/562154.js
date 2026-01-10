// ==UserScript==
// @name         TeaserFast.ru - Faucet
// @namespace    https://www.coded.cz/
// @version      1.0
// @description  Automated earning on teaserfast.ru with improved stability and features
// @author       Rubystance
// @license      MIT
// @match        https://teaserfast.ru/*
// @match        https://www.teaserfast.ru/*
// @grant        GM_notification
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @run-at       document-idle
// @noframes
// @homepage     https://www.coded.cz/_public/teaserfast.user.js
// @supportURL   https://www.coded.cz/contact
// @icon         https://www.google.com/s2/favicons?sz=64&domain=teaserfast.ru
// @downloadURL https://update.greasyfork.org/scripts/562154/TeaserFastru%20-%20Faucet.user.js
// @updateURL https://update.greasyfork.org/scripts/562154/TeaserFastru%20-%20Faucet.meta.js
// ==/UserScript==

(function() {
    'use strict';

    class TeaserFastBot {
        constructor() {
            this.config = {
                checkInterval: { min: 35000, max: 50000 },
                reloadTimeout: 10 * 60 * 1000, // 10 minutes
                randomDelay: { min: 5, max: 12 },
                maxRetries: 3,
                balanceCheckInterval: 15000, // 15 seconds
                version: '2.7'
            };

            this.state = {
                isRunning: false,
                currentWorker: null,
                checkInterval: null,
                reloadTimeout: null,
                balanceCheckInterval: null,
                retryCount: 0,
                metrics: {
                    adsCompleted: 0,
                    totalEarnings: 0,
                    startTime: Date.now(),
                    lastAdTime: null,
                    currentBalance: 0,
                    lastApiBalance: 0
                },
                adTimer: {
                    active: false,
                    seconds: 0,
                    maxSeconds: 0
                }
            };

            this.domains = ['teaserfast.ru', 'www.teaserfast.ru'];
            this.currentDomain = window.location.hostname;

            this.init();
        }

        async init() {
            try {
                await this.validateEnvironment();
                this.loadSavedState();
                this.setupUI();
                this.setupEventListeners();
                this.startBot();
            } catch (error) {
                console.error('Initialization failed:', error);
            }
        }

        async validateEnvironment() {
            if (typeof jQuery === 'undefined') {
                throw new Error('jQuery not loaded');
            }

            if (!this.domains.includes(this.currentDomain)) {
                throw new Error('Invalid domain');
            }
        }

        loadSavedState() {
            const saved = GM_getValue('teaserfast_state');
            if (saved) {
                this.state.metrics = { ...this.state.metrics, ...saved.metrics };
            }
        }

        saveState() {
            GM_setValue('teaserfast_state', {
                metrics: this.state.metrics,
                lastUpdate: Date.now()
            });
        }

        resetState() {
            this.state.metrics = {
                adsCompleted: 0,
                totalEarnings: 0,
                startTime: Date.now(),
                lastAdTime: null,
                currentBalance: this.state.metrics.currentBalance,
                lastApiBalance: this.state.metrics.lastApiBalance
            };
            this.saveState();
            this.updateDashboard();
            this.showNotification('Counter Reset', 'All data has been successfully reset!');
        }

        setupUI() {
            this.createDashboard();
            this.createIframe();
            this.applyStyles();
        }

        createDashboard() {
            const dashboard = `
                <div id="tf-dashboard" style="position:fixed;top:20px;right:20px;background:#2c3e50;color:white;padding:20px;border-radius:12px;z-index:10000;font-family:Arial,sans-serif;font-size:14px;min-width:350px;box-shadow:0 6px 12px rgba(0,0,0,0.2);border:2px solid #34495e;">
                    <div style="border-bottom:2px solid #34495e;padding-bottom:12px;margin-bottom:12px;text-align:center;">
                        <strong style="font-size:16px;">🤖 TeaserFast Bot v${this.config.version}</strong>
                    </div>
                    <div style="margin-bottom:8px;display:flex;justify-content:space-between;align-items:center;">
                        <span>💰 Session Earnings:</span>
                        <strong style="font-size:15px;color:#f39c12;" id="tf-earnings">${this.state.metrics.totalEarnings.toFixed(3)}</strong>
                    </div>
                    <div style="margin-bottom:8px;display:flex;justify-content:space-between;align-items:center;">
                        <span>💳 Total Balance:</span>
                        <strong style="font-size:16px;color:#2ecc71;" id="tf-balance">${this.state.metrics.currentBalance.toFixed(2)}</strong>
                    </div>
                    <div style="margin-bottom:8px;display:flex;justify-content:space-between;align-items:center;">
                        <span>📊 Ads Completed:</span>
                        <strong style="font-size:15px;color:#3498db;" id="tf-ads">${this.state.metrics.adsCompleted}</strong>
                    </div>
                    <div style="margin-bottom:8px;display:flex;justify-content:space-between;align-items:center;">
                        <span>⏱️ Total Uptime:</span>
                        <strong style="font-size:14px;color:#9b59b6;" id="tf-time">00:00:00</strong>
                    </div>
                    <div style="margin-bottom:12px;display:flex;justify-content:space-between;align-items:center;">
                        <span>⏰ Ad Timer:</span>
                        <strong style="font-size:14px;color:#f39c12;" id="tf-ad-timer">--:--</strong>
                    </div>
                    <div style="margin-top:12px;display:flex;gap:8px;">
                        <button id="tf-toggle" style="background:#e74c3c;color:white;border:none;padding:8px 12px;border-radius:6px;cursor:pointer;flex:1;font-size:13px;font-weight:bold;">🛑 Stop</button>
                        <button id="tf-reset" style="background:#e67e22;color:white;border:none;padding:8px 12px;border-radius:6px;cursor:pointer;flex:1;font-size:13px;font-weight:bold;">🔄 Reset</button>
                    </div>
                    <div style="margin-top:8px;">
                        <button id="tf-refresh-balance" style="background:#3498db;color:white;border:none;padding:8px 12px;border-radius:6px;cursor:pointer;width:100%;font-size:12px;font-weight:bold;">🔄 Refresh Balance</button>
                    </div>
                </div>
            `;
            $('body').append(dashboard);
            this.updateTimer();
            this.startAdTimer();

            // Initial balance update
            setTimeout(() => this.updateBalanceFromAPI(), 1000);
        }

        createIframe() {
            $('body').append(`
                <iframe id="tf-iframe" src="" style="position:fixed;left:50px;top:100px;border:2px solid #3498db;border-radius:8px;height:300px;width:600px;background:white;z-index:9999;display:none;"></iframe>
            `);
        }

        applyStyles() {
            GM_addStyle(`
                #tf-dashboard button:hover {
                    opacity: 0.9;
                    transform: translateY(-1px);
                }
                #tf-dashboard button:active {
                    transform: scale(0.98);
                }
                .tf-status-idle { background-color: #00bcd4 !important; }
                .tf-status-working { background-color: #ffc107 !important; }
                .tf-status-success { background-color: #4caf50 !important; }
                .tf-status-error { background-color: #f44336 !important; }
                #tf-ad-timer {
                    font-weight: bold;
                    color: #f39c12;
                }
                #tf-balance {
                    font-weight: bold;
                    color: #2ecc71;
                }
                .tf-ad-timer-active {
                    animation: pulse 1s infinite;
                }
                .tf-balance-updating {
                    animation: glow 1s infinite;
                }
                @keyframes pulse {
                    0% { opacity: 1; }
                    50% { opacity: 0.7; }
                    100% { opacity: 1; }
                }
                @keyframes glow {
                    0% { color: #2ecc71; }
                    50% { color: #f1c40f; }
                    100% { color: #2ecc71; }
                }
            `);
        }

        setupEventListeners() {
            $('#tf-toggle').on('click', () => this.toggleBot());
            $('#tf-reset').on('click', () => this.resetState());
            $('#tf-refresh-balance').on('click', () => this.updateBalanceFromAPI());

            // Auto-reload protection
            $(window).on('beforeunload', () => {
                this.cleanup();
            });
        }

        toggleBot() {
            if (this.state.isRunning) {
                this.stopBot();
            } else {
                this.startBot();
            }
        }

        startBot() {
            if (this.state.isRunning) return;

            this.handlePageNavigation();

            if (window.location.pathname === '/extn/account/') {
                this.state.isRunning = true;
                this.updateUIStatus('Bot started', 'tf-status-idle');
                $('#tf-toggle').html('🛑 Stop').css('background', '#e74c3c');
                this.startChecking();
                this.startBalanceChecker();
                this.scheduleReload();

                // Update balance via API on start
                setTimeout(() => this.updateBalanceFromAPI(), 1000);
            }
        }

        stopBot() {
            this.state.isRunning = false;
            this.cleanupIntervals();
            this.updateUIStatus('Bot stopped', 'tf-status-idle');
            $('#tf-toggle').html('🚀 Start').css('background', '#27ae60');
        }

        async updateBalanceFromAPI() {
            try {
                $('#tf-balance').addClass('tf-balance-updating').text('Loading...');
                $('#tf-refresh-balance').prop('disabled', true).text('🔄 Updating...');

                console.log('🔄 Fetching balance via API...');
                const balanceData = await this.fetchBalanceFromAPI();

                if (balanceData && balanceData.success && balanceData.balance) {
                    // Convert "21,38" to 21.38
                    const balanceValue = parseFloat(balanceData.balance.replace(',', '.'));

                    if (!isNaN(balanceValue)) {
                        this.state.metrics.currentBalance = balanceValue;
                        this.state.metrics.lastApiBalance = balanceValue;
                        this.saveState();
                        this.updateDashboard();

                        console.log('✅ Balance updated via API:', balanceValue);
                        this.showNotification('Balance Updated', `Current balance: ${balanceValue.toFixed(2)} RUB`);
                    } else {
                        throw new Error('Invalid balance format');
                    }
                } else {
                    throw new Error('Invalid API response');
                }

            } catch (error) {
                console.error('❌ Error updating balance via API:', error);

                // Fallback: try to fetch from page
                console.log('🔄 Attempting fallback: fetching balance from page...');
                const pageBalance = await this.getBalanceFromPage();
                if (pageBalance !== null) {
                    this.state.metrics.currentBalance = pageBalance;
                    this.saveState();
                    this.updateDashboard();
                    console.log('✅ Balance updated via fallback:', pageBalance);
                } else {
                    $('#tf-balance').text('Error').css('color', '#e74c3c');
                    this.showNotification('Balance Error', 'Could not update balance');

                    setTimeout(() => {
                        $('#tf-balance').css('color', '#2ecc71');
                        this.updateDashboard();
                    }, 3000);
                }
            } finally {
                $('#tf-balance').removeClass('tf-balance-updating');
                $('#tf-refresh-balance').prop('disabled', false).text('🔄 Refresh Balance');
            }
        }

        async fetchBalanceFromAPI() {
            try {
                const response = await $.ajax({
                    url: `https://${this.currentDomain}/extn/account/`,
                    method: 'GET',
                    timeout: 10000,
                    dataType: 'html'
                });

                // Try to extract JSON data from page
                const jsonMatch = response.match(/\{"success":true,.+?\}/);
                if (jsonMatch) {
                    try {
                        const jsonData = JSON.parse(jsonMatch[0]);
                        console.log('📊 API Data found:', jsonData);
                        return jsonData;
                    } catch (e) {
                        console.error('Error parsing JSON:', e);
                    }
                }

                // Try to find data in script tags
                const scriptTags = $(response).filter('script').text();
                const scriptMatch = scriptTags.match(/\{"success":true,.+?\}/);
                if (scriptMatch) {
                    try {
                        const jsonData = JSON.parse(scriptMatch[0]);
                        console.log('📊 Script data found:', jsonData);
                        return jsonData;
                    } catch (e) {
                        console.error('Error parsing script JSON:', e);
                    }
                }

                throw new Error('API Data not found');

            } catch (error) {
                console.error('API request error:', error);
                throw error;
            }
        }

        async getBalanceFromPage() {
            return new Promise((resolve) => {
                try {
                    console.log('🔍 Searching for balance on page...');

                    // Method 1: Search by selectors
                    const balanceSelectors = [
                        '.balance .label-success',
                        '.user-balance',
                        '.navbar .balance',
                        '.account-balance',
                        '.balance-sum',
                        '[class*="balance"]',
                        '[class*="money"]'
                    ];

                    for (const selector of balanceSelectors) {
                        const element = $(selector).first();
                        if (element.length) {
                            const text = element.text().trim();
                            console.log(`📝 Selector text ${selector}:`, text);
                            const balance = this.extractBalanceFromText(text);
                            if (balance !== null) {
                                console.log(`✅ Balance found:`, balance);
                                resolve(balance);
                                return;
                            }
                        }
                    }

                    // Method 2: Search for RUB text
                    const rubElements = $('*:contains("RUB")').filter(function() {
                        const text = $(this).text().trim();
                        return text.includes('RUB') && $(this).children().length === 0;
                    });

                    for (let i = 0; i < rubElements.length; i++) {
                        const text = $(rubElements[i]).text().trim();
                        const balance = this.extractBalanceFromText(text);
                        if (balance !== null) {
                            console.log(`✅ Balance found via RUB text:`, balance);
                            resolve(balance);
                            return;
                        }
                    }

                    console.log('❌ Balance not found on page');
                    resolve(null);

                } catch (error) {
                    console.error('Error fetching balance from page:', error);
                    resolve(null);
                }
            });
        }

        extractBalanceFromText(text) {
            if (!text) return null;

            const patterns = [
                /(\d+[.,]\d+)\s*RUB/i,
                /RUB\s*(\d+[.,]\d+)/i,
                /(\d+[.,]\d+)/,
                /баланс[:\s]*(\d+[.,]\d+)/i, // Keep Russian for detection
                /balance[:\s]*(\d+[.,]\d+)/i
            ];

            for (const pattern of patterns) {
                const match = text.match(pattern);
                if (match) {
                    let balanceStr = match[1];
                    balanceStr = balanceStr.replace(',', '.');
                    const balanceValue = parseFloat(balanceStr);

                    if (!isNaN(balanceValue) && balanceValue >= 0 && balanceValue < 100000) {
                        return balanceValue;
                    }
                }
            }
            return null;
        }

        startBalanceChecker() {
            // Auto-refresh balance every 15s via API
            this.balanceCheckInterval = setInterval(() => {
                if (this.state.isRunning) {
                    console.log('🔄 Automatic balance update...');
                    this.updateBalanceFromAPI();
                }
            }, this.config.balanceCheckInterval);
        }

        handlePageNavigation() {
            const path = window.location.pathname;

            if (path === '/check-captcha/') {
                this.handleCaptchaPage();
            } else if (path === '/login/') {
                // Wait for manual login
                this.stopBot();
            } else if (path !== '/extn/account/') {
                window.location.href = '/extn/account/';
            }
        }

        handleCaptchaPage() {
            if ($('.alert_success').is(':visible')) {
                window.location.href = '/extn/account/';
                return;
            }

            document.title = '🤖 CAPTCHA Required!';
            this.showNotification('CAPTCHA Required', 'Please solve the CAPTCHA to continue earning');

            // Notify every 30 seconds
            setInterval(() => {
                this.showNotification('CAPTCHA Still Required', 'The bot is waiting for you to solve CAPTCHA');
            }, 30000);
        }

        startChecking() {
            const type = this.generateRandomNumber(0, 1);
            console.log(`Starting checks with type: ${type}`);

            this.checkInterval = setInterval(() => {
                if (this.state.isRunning) {
                    this.getAdvert(type);
                }
            }, this.generateRandomNumber(this.config.checkInterval.min, this.config.checkInterval.max));

            // Initial check
            setTimeout(() => {
                this.getAdvert(type);
            }, 2000);
        }

        async getAdvert(tfType) {
            try {
                const params = {
                    extension: 1,
                    tftype: tfType,
                    version: 17,
                    get: 'submit'
                };

                const response = await this.makeRequest('/extn/get/', params);

                if (response.error) {
                    console.log('Waiting for ads...', response);
                    this.state.retryCount = 0;
                } else {
                    this.state.retryCount = 0;
                    this.processAdResponse(response);
                }
            } catch (error) {
                console.error('Error getting advert:', error);
                this.handleError(error);
            }
        }

        processAdResponse(response) {
            $('body').addClass('tf-status-working');

            if (response.teaser) {
                console.log('TEASER ad found');
                this.processTeaser(response);
            } else if (response.popup) {
                console.log('POPUP ad found');
                this.processPopup(response);
            } else if (response.captcha) {
                console.log('CAPTCHA required');
                window.location.href = '/check-captcha/';
            } else {
                console.log('Unknown response type:', response);
            }
        }

        processPopup(response) {
            console.log('Popup data:', response);

            let token, iframeUrl, seconds = 60;

            if (response.url.includes('popup-no')) {
                token = response.url.replace('https://teaserfast.ru/extn/popup-no/?hsa=', '');
                iframeUrl = response.url;
            } else {
                token = response.url.replace('https://teaserfast.ru/extn/popup-timer/?tzpha=', '');
                iframeUrl = response.url;

                const parts = response.message.split('сек.');
                if (parts.length > 1) {
                    const numberParts = parts[0].trim().split(' ');
                    seconds = parseInt(numberParts[numberParts.length - 1]) || 60;
                }
            }

            this.showIframe(iframeUrl);
            this.startRewardTimer(token, seconds, 'popup');
        }

        processTeaser(response) {
            console.log('Teaser data:', response);

            const hash = response.hash;
            const seconds = response.timer;

            this.startRewardTimer(hash, seconds, 'teaser');
        }

        startRewardTimer(hash, baseSeconds, type) {
            const randomDelay = this.generateRandomNumber(this.config.randomDelay.min, this.config.randomDelay.max);
            const totalSeconds = baseSeconds + randomDelay;

            console.log(`Starting timer: ${baseSeconds}s + ${randomDelay}s = ${totalSeconds}s`);

            this.startAdCountdown(totalSeconds);
            this.showWorkerTimer(totalSeconds, () => {
                this.claimReward(hash, type);
            });
        }

        startAdCountdown(totalSeconds) {
            this.state.adTimer = {
                active: true,
                seconds: totalSeconds,
                maxSeconds: totalSeconds
            };

            $('#tf-ad-timer').addClass('tf-ad-timer-active');
            this.updateAdTimer();
        }

        updateAdTimer() {
            if (this.state.adTimer.active && this.state.adTimer.seconds > 0) {
                const minutes = Math.floor(this.state.adTimer.seconds / 60);
                const seconds = this.state.adTimer.seconds % 60;
                const progress = ((this.state.adTimer.maxSeconds - this.state.adTimer.seconds) / this.state.adTimer.maxSeconds * 100).toFixed(1);

                $('#tf-ad-timer').text(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')} (${progress}%)`);

                this.state.adTimer.seconds--;
                setTimeout(() => this.updateAdTimer(), 1000);
            } else if (this.state.adTimer.active && this.state.adTimer.seconds <= 0) {
                this.state.adTimer.active = false;
                $('#tf-ad-timer').removeClass('tf-ad-timer-active').text('--:--');
            }
        }

        showWorkerTimer(seconds, callback) {
            this.cleanupWorker();

            const workerCode = `
                let i = ${seconds};
                const timer = setInterval(() => {
                    if (i > 0) {
                        i--;
                        postMessage(i);
                    } else {
                        clearInterval(timer);
                        postMessage(0);
                    }
                }, 1000);
            `;

            const blob = new Blob([workerCode], { type: 'text/javascript' });
            this.state.currentWorker = new Worker(URL.createObjectURL(blob));

            this.state.currentWorker.onmessage = (e) => {
                if (e.data === 0) {
                    callback();
                } else {
                    document.title = `⏳ ${e.data}s`;
                    $('#tf-time').text(this.formatTime(e.data));
                }
            };
        }

        async claimReward(hash, type) {
            try {
                const url = type === 'popup' ? '/extn/popup-check/' : '/extn/status/';
                const params = { hash: hash };

                const response = await this.makeRequest(url, params);

                if (response.error) {
                    console.error('Reward claim failed:', response);
                    this.handleError('Reward claim failed');
                } else {
                    console.log('Reward claimed successfully:', response);
                    this.handleRewardSuccess(response);
                }
            } catch (error) {
                console.error('Error claiming reward:', error);
                this.handleError(error);
            }
        }

        handleRewardSuccess(response) {
            $('body').removeClass('tf-status-working').addClass('tf-status-success');

            const earnings = parseFloat(response.earn) || 0;
            this.state.metrics.adsCompleted++;
            this.state.metrics.totalEarnings += earnings;
            this.state.metrics.lastAdTime = Date.now();

            // UPDATE BALANCE AFTER EARNING
            setTimeout(() => {
                this.updateBalanceFromAPI();
            }, 2000);

            this.saveState();
            this.updateDashboard();

            document.title = `💰 +${earnings.toFixed(3)} RUB`;

            this.showNotification('Reward Claimed', `You earned ${earnings.toFixed(3)} RUB`);

            setTimeout(() => {
                window.location.reload();
            }, 3000);
        }

        showIframe(url) {
            $('#tf-iframe').show().attr('src', url);
        }

        hideIframe() {
            $('#tf-iframe').hide().attr('src', '');
        }

        async makeRequest(endpoint, data) {
            try {
                const response = await $.ajax({
                    type: 'POST',
                    url: `https://${this.currentDomain}${endpoint}`,
                    data: $.param(data),
                    contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
                    timeout: 30000
                });

                return typeof response === 'string' ? JSON.parse(response) : response;
            } catch (error) {
                console.error('Request failed:', error);
                throw error;
            }
        }

        showNotification(title, message) {
            if (typeof GM_notification !== 'undefined') {
                GM_notification({
                    title: title,
                    text: message,
                    image: 'https://www.coded.cz/_public/captcha_notify.png',
                    timeout: 5000,
                    onclick: () => window.focus()
                });
            } else if ('Notification' in window && Notification.permission === 'granted') {
                new Notification(title, { body: message, icon: 'https://www.coded.cz/_public/captcha_notify.png' });
            }
        }

        handleError(error) {
            this.state.retryCount++;

            console.error('Bot error:', error);
            $('body').addClass('tf-status-error');

            this.updateDashboard();

            if (this.state.retryCount >= this.config.maxRetries) {
                this.showNotification('Bot Error', 'Too many errors, restarting...');
                setTimeout(() => window.location.reload(), 5000);
            }
        }

        updateUIStatus(status, cssClass) {
            $('body').removeClass('tf-status-idle tf-status-working tf-status-success tf-status-error')
                     .addClass(cssClass);
            console.log(`Status: ${status}`);
        }

        updateDashboard() {
            $('#tf-earnings').text(this.state.metrics.totalEarnings.toFixed(3));
            $('#tf-ads').text(this.state.metrics.adsCompleted);
            $('#tf-balance').text(this.state.metrics.currentBalance.toFixed(2));
        }

        updateTimer() {
            setInterval(() => {
                const uptime = Math.floor((Date.now() - this.state.metrics.startTime) / 1000);
                $('#tf-time').text(this.formatTime(uptime));
            }, 1000);
        }

        startAdTimer() {
            setInterval(() => {
                if (!this.state.adTimer.active) {
                    $('#tf-ad-timer').text('--:--');
                }
            }, 1000);
        }

        formatTime(seconds) {
            const hrs = Math.floor(seconds / 3600);
            const mins = Math.floor((seconds % 3600) / 60);
            const secs = seconds % 60;
            return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }

        scheduleReload() {
            this.state.reloadTimeout = setTimeout(() => {
                console.log('Scheduled reload');
                window.location.reload();
            }, this.config.reloadTimeout);
        }

        generateRandomNumber(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        cleanupWorker() {
            if (this.state.currentWorker) {
                this.state.currentWorker.terminate();
                this.state.currentWorker = null;
            }
        }

        cleanupIntervals() {
            if (this.checkInterval) clearInterval(this.checkInterval);
            if (this.state.reloadTimeout) clearTimeout(this.state.reloadTimeout);
            if (this.balanceCheckInterval) clearInterval(this.balanceCheckInterval);
            this.cleanupWorker();
        }

        cleanup() {
            this.stopBot();
            this.saveState();
        }
    }

    // Initialize bot when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            new TeaserFastBot();
        });
    } else {
        new TeaserFastBot();
    }
})();