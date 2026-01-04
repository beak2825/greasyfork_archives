// ==UserScript==
// @name         Web3 OKX Demo Trade Addon
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Add Demo Trading tab and functional demo trade panel
// @author       mamiis
// @match        https://web3.okx.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/551553/Web3%20OKX%20Demo%20Trade%20Addon.user.js
// @updateURL https://update.greasyfork.org/scripts/551553/Web3%20OKX%20Demo%20Trade%20Addon.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let demoMode = false;
    let demoBalance = 1000;
    let demoPanelVisible = false;
    let currentTokenPrice = 0.001;
    let currentSolPrice = 100;
    let currentTokenSymbol = 'TOKEN';
    let currentTokenImage = '';
    let totalPnL = 0;
    let totalPnLPercent = 0;
    let tokenPnL = 0;
    let tokenPnLPercent = 0;
    let showFiat = true;
    let pnlSectionVisible = true; // PnL section görünürlüğü

    // LocalStorage'dan ayarları yükle
    let currentSettings = JSON.parse(localStorage.getItem('demoSettings')) || {
        buySlippage: '15%',
        sellSlippage: '20%',
        buyAmounts: ['0.03', '0.05', '0.07'],
        sellPercents: ['50%', '75%', '100%'],
        serviceFee: '0.68%',
        marketFee: '0.0004-0.0009 SOL'
    };

    // Customize amounts state
    let customizeMode = false;
    let tempBuyAmounts = [...currentSettings.buyAmounts];
    let tempSellPercents = [...currentSettings.sellPercents];
    let tempServiceFee = currentSettings.serviceFee;

    // Sayfa değişikliklerini izlemek için observer
    let pageObserver = null;

    // Token bilgilerini takip etmek için yeni değişkenler
    let demoPortfolio = JSON.parse(localStorage.getItem('demoPortfolio')) || {
        'SOL': { amount: 10, avgPrice: 100 }
    };

    let totalRealizedPnL = parseFloat(localStorage.getItem('totalRealizedPnL')) || 0;
    let totalTradeVolume = parseFloat(localStorage.getItem('totalTradeVolume')) || 0;
    let tradeHistory = JSON.parse(localStorage.getItem('tradeHistory')) || [];

    // PnL değerleri
    let boughtAmount = 0;
    let soldAmount = 0;
    let balanceAmount = 0;
    let tpnlAmount = 0;

    // Duplicate önleme için kontrol değişkeni
    let isInitializing = false;
    let lastTokenCA = '';

    function formatNumber(value, isFiat = true) {
        if (value === 0 || value === null || value === undefined) {
            return isFiat ? '$0.00' : '0.00';
        }

        if (isFiat) {
            if (Math.abs(value) >= 1000000) {
                return '$' + (value / 1000000).toFixed(2) + 'M';
            } else if (Math.abs(value) >= 1000) {
                return '$' + (value / 1000).toFixed(2) + 'K';
            } else {
                return '$' + value.toFixed(2);
            }
        } else {
            // Token miktarı için formatlama - GÜNCELLENDİ
            const absValue = Math.abs(value);
            if (absValue >= 1000000) {
                return (value / 1000000).toFixed(4) + 'M';
            } else if (absValue >= 1000) {
                return (value / 1000).toFixed(4) + 'K';
            } else if (absValue >= 1) {
                return value.toFixed(4);
            } else if (absValue >= 0.01) {
                return value.toFixed(4);
            } else if (absValue >= 0.0001) {
                return value.toFixed(6);
            } else {
                return value.toFixed(8);
            }
        }
    }

    function saveSettingsToStorage() {
        localStorage.setItem('demoSettings', JSON.stringify(currentSettings));
    }

    function getTokenCAFromURL() {
        try {
            const url = window.location.href;
            console.log('🔍 Parsing URL for token:', url);

            // Önce URL'deki token parametresini kontrol et
            const urlParams = new URLSearchParams(window.location.search);
            const tokenParam = urlParams.get('token');
            if (tokenParam && tokenParam.length > 10) {
                console.log('✅ Token CA from URL params:', tokenParam);
                return tokenParam;
            }

            // Sonra sayfa yolundaki token'ı kontrol et
            const pathMatch = url.match(/\/token\/([a-zA-Z0-9]+)/);
            if (pathMatch && pathMatch[1]) {
                console.log('✅ Token CA from path:', pathMatch[1]);
                return pathMatch[1];
            }

            // Token sembolünden unique hash oluştur
            if (currentTokenSymbol && currentTokenSymbol !== 'TOKEN') {
                // Token sembolü + timestamp kullanarak unique hash oluştur
                const uniqueHash = String(currentTokenSymbol + '_' + Date.now()).split('').reduce((a, b) => {
                    a = ((a << 5) - a) + b.charCodeAt(0);
                    return a & a;
                }, 0).toString(16);
                console.log('🔑 Generated unique token CA:', currentTokenSymbol, '->', uniqueHash);
                return uniqueHash;
            }

            console.log('❌ No token identifier found');
            return 'default_token';
        } catch (error) {
            console.error('Error parsing token CA:', error);
            return 'error_token';
        }
    }

    function getCurrentTokenPortfolio() {
        // Her seferinde URL'den CA al
        const tokenCA = getTokenCAFromURL();

        console.log('🔄 Portfolio check - Current CA:', tokenCA, 'Symbol:', currentTokenSymbol);

        // Mevcut token için portföy oluştur veya getir
        if (!demoPortfolio[tokenCA]) {
            demoPortfolio[tokenCA] = {
                amount: 0,
                avgPrice: 0,
                symbol: currentTokenSymbol,
                image: currentTokenImage,
                totalInvested: 0,
                totalSold: 0
            };
            console.log('🆕 Created NEW portfolio for:', currentTokenSymbol, 'CA:', tokenCA);
        } else {
            // Mevcut portföy bilgilerini güncelle (sembol ve resim her zaman güncellenecek)
            demoPortfolio[tokenCA].symbol = currentTokenSymbol;
            demoPortfolio[tokenCA].image = currentTokenImage;
            console.log('📁 Loaded EXISTING portfolio for:', currentTokenSymbol, 'Amount:', demoPortfolio[tokenCA].amount);
        }

        return demoPortfolio[tokenCA];
    }

    function calculateTotalBalance() {
        let totalBalance = 0;

        // SOL bakiyesini ekle
        if (demoPortfolio.SOL && demoPortfolio.SOL.amount) {
            totalBalance += demoPortfolio.SOL.amount * currentSolPrice;
        }

        // Diğer tokenların bakiyesini ekle
        Object.keys(demoPortfolio).forEach(key => {
            if (key !== 'SOL' && demoPortfolio[key].amount > 0) {
                const token = demoPortfolio[key];
                // Eğer bu token şu anki token ise current price kullan, değilse avg price kullan
                const tokenPrice = (key === getTokenCAFromURL()) ? currentTokenPrice : (token.avgPrice || 0);
                totalBalance += token.amount * tokenPrice;
            }
        });

        return totalBalance;
    }

    function initDemoTrading() {
        if (isInitializing) {
            console.log('🚫 Already initializing, skipping...');
            return;
        }

        isInitializing = true;
        console.log('Initializing Demo Trading...');

        try {
            addDemoTab();
            addDemoButton();
            setupDemoMode();
            loadSettingsFromRealPanel();
            startPriceUpdates();
            startSolPriceUpdates();
            setupPageObserver();
        } catch (error) {
            console.error('Error in initDemoTrading:', error);
        } finally {
            setTimeout(() => {
                isInitializing = false;
            }, 1000);
        }
    }

    function setupPageObserver() {
        // Eğer observer zaten varsa, önce onu durdur
        if (pageObserver) {
            pageObserver.disconnect();
        }

        // Sayfa değişikliklerini izle
        pageObserver = new MutationObserver(function(mutations) {
            let shouldUpdate = false;

            mutations.forEach(function(mutation) {
                // Yeni node'lar eklendiğinde kontrol et
                if (mutation.addedNodes && mutation.addedNodes.length > 0) {
                    for (let node of mutation.addedNodes) {
                        if (node.nodeType === 1) { // Element node
                            // Tab container değişti mi?
                            if (node.querySelector && (
                                node.querySelector('.dex-tabs-pane-list-container') ||
                                node.querySelector('.Q68nJL__dex') ||
                                node.querySelector('.vP8ohB__dex')
                            )) {
                                shouldUpdate = true;
                                break;
                            }
                        }
                    }
                }

                // Attribute değişiklikleri (active tab değişimi)
                if (mutation.type === 'attributes' &&
                    (mutation.attributeName === 'class' || mutation.attributeName === 'data-pane-id')) {
                    shouldUpdate = true;
                }
            });

            if (shouldUpdate && !isInitializing) {
                console.log('Page changed, updating demo components...');
                setTimeout(updateDemoComponents, 500);
            }
        });

        // Tüm sayfayı izle
        pageObserver.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['class', 'data-pane-id']
        });
    }

    function updateDemoComponents() {
        // Demo tab'ı kontrol et ve ekle
        if (!document.querySelector('[data-pane-id="demo_trading"]')) {
            addDemoTab();
        }

        // Demo butonunu kontrol et ve ekle
        if (!document.querySelector('.demo-trade-button')) {
            addDemoButton();
        }

        // Demo panel açıksa güncelle
        if (demoPanelVisible) {
            updateDemoPanelValues();
        }

        // Aktif tab'ı güncelle
        updateActiveTab();
    }

    function loadSettingsFromRealPanel() {
        const realPanel = document.querySelector('.cIknRK__dex:not(.demo-trade-panel)');
        if (realPanel) {
            // Buy slippage
            const buySlippage = realPanel.querySelector('.Nox6EF__dex .font-500');
            if (buySlippage) {
                currentSettings.buySlippage = buySlippage.textContent || '15%';
            }

            // Sell slippage
            const sellSlippageElements = realPanel.querySelectorAll('.Nox6EF__dex .font-500');
            if (sellSlippageElements.length > 1) {
                currentSettings.sellSlippage = sellSlippageElements[1].textContent || '20%';
            }

            // Buy amounts
            const buyAmounts = realPanel.querySelectorAll('.H5f_ax__dex.Cg7h1c__dex .l5GPKh__dex');
            if (buyAmounts.length >= 3) {
                currentSettings.buyAmounts = [
                    buyAmounts[0].textContent || '0.03',
                    buyAmounts[1].textContent || '0.05',
                    buyAmounts[2].textContent || '0.07'
                ];
            }

            // Sell percents
            const sellPercents = realPanel.querySelectorAll('.H5f_ax__dex.ODJ17x__dex .l5GPKh__dex');
            if (sellPercents.length >= 3) {
                currentSettings.sellPercents = [
                    sellPercents[0].textContent || '50%',
                    sellPercents[1].textContent || '75%',
                    sellPercents[2].textContent || '100%'
                ];
            }

            saveSettingsToStorage();
        }
    }

    function getCurrentPrices() {
        try {
            const previousTokenCA = lastTokenCA;
            const previousTokenSymbol = currentTokenSymbol;

            console.log('--- COIN PRICE SEARCH STARTED ---');

            // 1. Önce token sembolünü ve resmini al
            const tokenSymbolElement = document.querySelector('.B73M_W__dex');
            if (tokenSymbolElement) {
                const symbol = tokenSymbolElement.textContent.trim();
                if (symbol && symbol !== 'SOL' && symbol !== 'USDC' && symbol !== 'USDT') {
                    currentTokenSymbol = symbol;

                    const tokenImage = document.querySelector('.vP8ohB__dex img');
                    currentTokenImage = (tokenImage && tokenImage.src) ? tokenImage.src : 'https://web3.okx.com/cdn/web3/currency/token/large/501-FM6ZsWmVFA41D72NNNTk35ZrUSg2wkCerSNzg7Wjpump-108/type=default_90_0?v=1759520281357';

                    console.log('✅ Token symbol and image updated:', currentTokenSymbol, currentTokenImage);
                }
            }

            // 2. Fiyatı al
            const priceDivs = document.querySelectorAll('.glKoFv__dex');
            let priceValue = null;

            for (let div of priceDivs) {
                const labelDiv = div.querySelector('.KMsU5K__dex');
                if (labelDiv && labelDiv.textContent === 'Price') {
                    const priceValueDiv = div.querySelector('.IMDFTB__dex');
                    if (priceValueDiv) {
                        priceValue = priceValueDiv.textContent.trim();
                        console.log('✅ PRICE TEXT FOUND:', priceValue);
                        break;
                    }
                }
            }

            if (priceValue) {
                let cleanedPrice = priceValue.replace('$', '').trim();

                const subscriptMap = {
                    '₀': 0, '₁': 1, '₂': 2, '₃': 3, '₄': 4,
                    '₅': 5, '₆': 6, '₇': 7, '₈': 8, '₉': 9
                };

                if (cleanedPrice.startsWith('0.0')) {
                    let finalPrice = '0.0';
                    let foundSubscript = false;

                    for (let i = 2; i < cleanedPrice.length; i++) {
                        const char = cleanedPrice[i];

                        if (subscriptMap.hasOwnProperty(char) && !foundSubscript) {
                            const zeroCount = subscriptMap[char];
                            finalPrice += '0'.repeat(zeroCount);
                            foundSubscript = true;
                        } else {
                            finalPrice += char;
                        }
                    }

                    cleanedPrice = finalPrice;
                    console.log('🔄 FORMATTED PRICE:', cleanedPrice);
                }

                const parsedPrice = parseFloat(cleanedPrice);
                if (!isNaN(parsedPrice) && parsedPrice > 0) {
                    currentTokenPrice = parsedPrice;
                    console.log('✅ PRICE SUCCESSFULLY PARSED:', currentTokenPrice);
                } else {
                    console.log('❌ Price parsing failed:', cleanedPrice);
                    currentTokenPrice = 0.001;
                }
            } else {
                console.log('❌ No valid token price found');
                currentTokenPrice = 0.001;
            }

            console.log('✅ FINAL TOKEN PRICE:', currentTokenPrice);
            console.log('--- COIN PRICE SEARCH ENDED ---');

            // 3. Token CA'sını güncelle
            const currentTokenCA = getTokenCAFromURL();
            lastTokenCA = currentTokenCA;

            // 4. Token değişim kontrolü - CRITICAL FIX
            const tokenChanged = (previousTokenCA !== currentTokenCA || previousTokenSymbol !== currentTokenSymbol) &&
                  currentTokenCA !== 'default_token' && currentTokenCA !== 'error_token' &&
                  currentTokenSymbol !== 'TOKEN' && previousTokenSymbol !== 'TOKEN';

            if (tokenChanged) {
                console.log('🔄 TOKEN CHANGED DETECTED!', {
                    from: `${previousTokenSymbol} (${previousTokenCA})`,
                    to: `${currentTokenSymbol} (${currentTokenCA})`
                });

                // Eski token'ın PnL'sini realize et
                if (previousTokenCA && previousTokenCA !== currentTokenCA && demoPortfolio[previousTokenCA]) {
                    const oldPortfolio = demoPortfolio[previousTokenCA];
                    if (oldPortfolio.amount > 0 && oldPortfolio.avgPrice > 0) {
                        const unrealizedPnL = oldPortfolio.amount * (currentTokenPrice - oldPortfolio.avgPrice);
                        totalRealizedPnL += unrealizedPnL;
                        console.log('💰 Realized PnL from previous token:', {
                            symbol: oldPortfolio.symbol,
                            amount: oldPortfolio.amount,
                            avgPrice: oldPortfolio.avgPrice,
                            currentPrice: currentTokenPrice,
                            pnl: unrealizedPnL
                        });
                    }
                }

                // Yeni token'ın portföyünü al
                const tokenPortfolio = getCurrentTokenPortfolio();
                const balanceText = tokenPortfolio.amount > 0 ?
                      `Balance: ${tokenPortfolio.amount.toFixed(4)} | Avg: $${tokenPortfolio.avgPrice.toFixed(6)}` :
                'No balance';

                showDemoNotification(`Switched to ${currentTokenSymbol} | ${balanceText}`, 'info');

                // DROPDOWN'LARI YENİDEN OLUŞTUR - BU ÇOK ÖNEMLİ!
                if (demoPanelVisible) {
                    console.log('🔄 Rebuilding dropdowns for new token...');
                    setTimeout(() => {
                        setupDropdowns();
                        setupDropdownEvents();
                        updateDemoPanelValues();
                    }, 100);
                }
            }

            // 5. PnL hesapla
            calculatePnL();

        } catch (e) {
            console.error('❌ Price update error:', e);
            currentTokenPrice = 0.001;
        }
    }

    // SOL fiyatını API'den çek
    function fetchSolPrice() {
        fetch('https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd')
            .then(response => response.json())
            .then(data => {
            if (data.solana && data.solana.usd) {
                currentSolPrice = data.solana.usd;
                console.log('✅ SOL PRICE FROM API:', currentSolPrice);

                // Panel açıksa değerleri güncelle
                if (demoPanelVisible) {
                    updateDemoPanelValues();
                }
            }
        })
            .catch(error => {
            console.log('❌ Coingecko API error, using default SOL price');
            currentSolPrice = 100; // Fallback price
        });
    }

    // SOL fiyatını periyodik olarak güncelle
    function startSolPriceUpdates() {
        // İlk güncellemeyi hemen yap
        fetchSolPrice();

        // Sonra her 15 saniyede bir güncelle
        setInterval(fetchSolPrice, 15000);
    }

    function calculatePnL() {
        const tokenPortfolio = getCurrentTokenPortfolio();
        const currentTokenCA = getTokenCAFromURL();

        console.log('🔄 Calculating PnL for:', {
            symbol: currentTokenSymbol,
            CA: currentTokenCA,
            amount: tokenPortfolio.amount,
            avgPrice: tokenPortfolio.avgPrice,
            currentPrice: currentTokenPrice
        });

        // Reset values
        tokenPnL = 0;
        tokenPnLPercent = 0;
        totalPnL = 0;
        totalPnLPercent = 0;

        // Sadece mevcut token için PnL hesapla
        if (tokenPortfolio.amount > 0 && tokenPortfolio.avgPrice > 0) {
            const currentValue = tokenPortfolio.amount * currentTokenPrice;
            const costBasis = tokenPortfolio.amount * tokenPortfolio.avgPrice;
            tokenPnL = currentValue - costBasis;
            tokenPnLPercent = costBasis > 0 ? (tokenPnL / costBasis) * 100 : 0;

            console.log('📊 Current Token PnL:', {
                amount: tokenPortfolio.amount,
                avgPrice: tokenPortfolio.avgPrice,
                currentPrice: currentTokenPrice,
                costBasis: costBasis,
                currentValue: currentValue,
                pnl: tokenPnL,
                percent: tokenPnLPercent
            });
        }

        // Total PnL = Sadece mevcut token PnL + realize edilmiş PnL
        totalPnL = tokenPnL + totalRealizedPnL;

        // Total PnL yüzdesi - sadece başlangıç bakiyesine göre
        const initialBalance = 1000;
        totalPnLPercent = initialBalance > 0 ? (totalPnL / initialBalance) * 100 : 0;

        // NaN kontrolü
        if (isNaN(totalPnL)) totalPnL = 0;
        if (isNaN(totalPnLPercent)) totalPnLPercent = 0;
        if (isNaN(tokenPnL)) tokenPnL = 0;
        if (isNaN(tokenPnLPercent)) tokenPnLPercent = 0;

        // PnL değerlerini güncelle
        boughtAmount = tokenPortfolio.totalInvested || 0;
        soldAmount = tokenPortfolio.totalSold || 0;
        balanceAmount = tokenPortfolio.amount * currentTokenPrice;
        tpnlAmount = totalPnL;

        console.log('✅ Final PnL:', {
            tokenPnL: tokenPnL,
            tokenPnLPercent: tokenPnLPercent.toFixed(2) + '%',
            totalPnL: totalPnL,
            totalPnLPercent: totalPnLPercent.toFixed(2) + '%',
            totalRealizedPnL: totalRealizedPnL
        });
    }

    function savePortfolioToStorage() {
        localStorage.setItem('demoPortfolio', JSON.stringify(demoPortfolio));
        localStorage.setItem('totalRealizedPnL', totalRealizedPnL.toString());
        localStorage.setItem('totalTradeVolume', totalTradeVolume.toString());
        localStorage.setItem('tradeHistory', JSON.stringify(tradeHistory));
        console.log('Portfolio saved to localStorage');
    }

    function startPriceUpdates() {
        // İlk fiyat güncellemesini hemen yap
        getCurrentPrices();
        fetchSolPrice();

        // Sonra periyodik olarak devam et - 0.5 SANİYE
        setInterval(() => {
            if (demoMode) {
                getCurrentPrices();
                if (demoPanelVisible) {
                    updateDemoPanelValues();
                }
            }
        }, 500); // 0.5 saniye
    }

    function addDemoTab() {
        const tabList = document.querySelector('.dex-tabs-pane-list-container');
        if (!tabList) {
            setTimeout(addDemoTab, 1000);
            return;
        }

        if (document.querySelector('[data-pane-id="demo_trading"]')) {
            return;
        }

        const demoTabHTML = `
            <div class="dex-tabs-pane dex-tabs-pane-lg dex-tabs-pane-blue dex-tabs-pane-underline AV2oC5__dex" data-pane-id="demo_trading" id=":r2if:-demo_trading" role="tab" aria-selected="false" tabindex="-1">
                <h2 class="font-inherit">Demo Trading</h2>
            </div>
        `;

        const lastTab = tabList.querySelector('.dex-tabs-pane:last-child');
        if (lastTab) {
            lastTab.insertAdjacentHTML('beforebegin', demoTabHTML);
            addTabClickHandler();
        }
    }

    function addDemoButton() {
        const buttonContainer = document.querySelector('.Q68nJL__dex');
        if (!buttonContainer) {
            setTimeout(addDemoButton, 1000);
            return;
        }

        if (document.querySelector('.demo-trade-button')) {
            return;
        }

        const demoButtonHTML = `
            <div data-testid="okd-popup" class="dex dex-popup-var dex-popup dex-coach-popover dex-coachmark-var demo-trade-button">
                <button type="button" class="dex-plain-button peM48g__dex MovYo___dex q7TVYE__dex demo-mode-toggle">
                    <span class="zGJMLt__dex MovYo___dex">
                        <i class="icon iconfont dex-okx-defi-dex-quick-filled uZT0ej__dex" role="img" aria-hidden="true"></i>
                        <span>Demo Trade</span>
                    </span>
                </button>
            </div>
        `;

        const instantTradeBtn = buttonContainer.querySelector('[data-testid="okd-popup"]:last-child');
        if (instantTradeBtn) {
            instantTradeBtn.insertAdjacentHTML('beforebegin', demoButtonHTML);
            addButtonClickHandler();
        }
    }

    function addTabClickHandler() {
        const demoTab = document.querySelector('[data-pane-id="demo_trading"]');
        if (demoTab) {
            demoTab.addEventListener('click', function() {
                switchToDemoMode();
                updateActiveTab();
                showDemoPanel();
            });
        }
    }

    function addButtonClickHandler() {
        const demoButton = document.querySelector('.demo-mode-toggle');
        if (demoButton) {
            demoButton.addEventListener('click', function(e) {
                e.stopPropagation();
                demoMode = !demoMode;
                updateDemoButton();

                if (demoMode) {
                    showDemoPanel();
                } else {
                    hideDemoPanel();
                }
            });
        }
    }

    function switchToDemoMode() {
        demoMode = true;
        updateDemoButton();
        showDemoPanel();
    }

    function updateDemoButton() {
        const demoButton = document.querySelector('.demo-mode-toggle');
        if (demoButton) {
            if (demoMode) {
                demoButton.style.backgroundColor = '';
                demoButton.querySelector('span span').textContent = 'Demo Active';
            } else {
                demoButton.style.backgroundColor = '';
                demoButton.querySelector('span span').textContent = 'Demo Trade';
            }
        }
    }

    function updateActiveTab() {
        const tabs = document.querySelectorAll('.dex-tabs-pane');
        tabs.forEach(tab => {
            tab.classList.remove('dex-tabs-pane-underline-active', 'p0ZfTr__dex');
        });

        const activeTab = document.querySelector('[data-pane-id="demo_trading"]');
        if (activeTab) {
            activeTab.classList.add('dex-tabs-pane-underline-active', 'p0ZfTr__dex');
        }
    }

    function showDemoPanel() {
        if (demoPanelVisible) return;

        loadSettingsFromRealPanel();
        getCurrentPrices();

        // Mevcut token portföyünü al
        const tokenPortfolio = getCurrentTokenPortfolio();

        const demoPanelHTML = `
    <div class="cIknRK__dex gRJpse__dex demo-trade-panel" role="button" tabindex="-1" style="left: 400px; top: 200px; opacity: 1; transition: all 0.2s; cursor: default; z-index: 1007;">
        <div class="vM9Rz8__dex F_UE_X__dex" role="button" tabindex="0" aria-disabled="false" aria-roledescription="draggable">
            <div class="bSH5VS__dex" aria-label="drag-to-move-dialog"><i class="icon iconfont cenOGi__dex dex-okx-defi-dex-drag" role="img" aria-hidden="true"></i></div>
            <div>
                <div class="NZD_dv__dex">
                    <div class="dex dex-select-var dex-select select-text Hp9ZjI__dex demo-default-select">
                        <div class="dex-select-value-box display-area pm_IiY__dex">
                            <div class="LFH5He__dex">
                                <div class="D3fk1I__dex">Default</div>
                                <i class="icon iconfont dex-okds-chevron-down icon-sign select-up dex-select-reference-icon dex-select-reference-icon-md" role="img" aria-label="" aria-hidden="true"></i>
                            </div>
                        </div>
                        <div data-testid="okd-popup" class="dex dex-popup-var dex-popup select-popup-reference"></div>
                    </div>
                </div>
            </div>
            <div class="aynava__dex">
                <!-- RESET BUTON -->
                <div data-testid="okd-popup" class="dex dex-popup-var dex-popup dex-tooltip dex-tooltip-var dex-tooltip-neutral">
                    <button type="button" class="dex-plain-button hs2qqD__dex demo-reset-balance">
                        <i class="icon iconfont McyHpj__dex dex-okx-defi-dex-refresh" role="img" aria-label="Reset Demo"></i>
                    </button>
                </div>

                <!-- CUSTOMIZE BUTON -->
                <div data-testid="okd-popup" class="dex dex-popup-var dex-popup">
                    <button type="button" class="dex-plain-button hs2qqD__dex demo-customize-btn ${customizeMode ? 'QzYi7N__dex' : ''}">
                        <i class="icon iconfont McyHpj__dex ${customizeMode ? 'dex-okx-defi-dex-check' : 'dex-okx-defi-marketplace-edit'}" role="img" aria-label="Customize amounts"></i>
                    </button>
                </div>

                <!-- PNL BUTON - GÜNCELLENDİ -->
                <div data-testid="okd-popup" class="dex dex-popup-var dex-popup dex-tooltip dex-tooltip-var dex-tooltip-neutral  ">
                    <button type="button" class="dex-plain-button hs2qqD__dex demo-pnl-btn ${pnlSectionVisible ? 'QzYi7N__dex' : ''}">
                        <i class="icon iconfont McyHpj__dex dex-okx-defi-web3-leaderboard ${pnlSectionVisible ? 'WAaPvo__dex' : ''}" role="img" aria-label="PnL"></i>
                    </button>
                </div>

                <i class="icon iconfont vuymPd__dex dex-okx-defi-marketplace-close dex-a11y-button demo-panel-close" role="button" aria-label="Close" tabindex="0"></i>
            </div>
        </div>
        <div class="JlS9Ws__dex">
            <div>
                <div class="flex justify-between items-center uyKNVr__dex">
                    <div class="dex dex-select-var dex-select select-text lnOLCt__dex instant-trade-token-selector-buy demo-buy-select">
                        <div class="dex-select-value-box display-area NC4WG2__dex">
                            <div class="e4mTHT__dex flex items-center font-12">
                                <span class="ioQevx__dex">Buy with</span>
                                <span class="font-500 UE7t1T__dex">SOL</span>
                                <i class="icon iconfont dex-okx-defi-dex-market-sort-down RQGYJ6__dex" role="img" aria-hidden="true"></i>
                            </div>
                        </div>
                        <div data-testid="okd-popup" class="dex dex-popup-var dex-popup select-popup-reference"></div>
                    </div>
                    <div class="flex items-center">
                        ${customizeMode ? `
                            <div class="dex dex-input-var dex-input dex-input-sm" style="width: 80px; margin-right: 8px;">
                                <div class="dex-input-box auto-size" role="none">
                                    <input autocomplete="off" readonly="" type="hidden" style="display: none;">
                                    <input inputmode="decimal" enable_thousands="true" min="0" max="9007199254740991" autocomplete="off" step="1" id="demo-sol-balance-input" class="dex-input-input demo-sol-balance-input" autocapitalize="off" autocorrect="off" type="text" value="${demoPortfolio.SOL.amount.toFixed(4)}" name="demo_sol_balance_input">
                                    <div class="dex-input-suffix"></div>
                                </div>
                            </div>
                        ` : `
                            <span class="VHD_xh__dex">${demoPortfolio.SOL.amount.toFixed(4)}</span>
                        `}
                        <picture class="dex dex-picture dex-picture-font"><source srcset="https://web3.okx.com/cdn/web3/currency/token/501-11111111111111111111111111111111-1.png/type=default_350_0?v=1734571825920&amp;x-oss-process=image/format,webp/ignore-error,1"><img width="16" height="16" class="Lrw8Qc__dex" alt="" src="https://web3.okx.com/cdn/web3/currency/token/501-11111111111111111111111111111111-1.png/type=default_350_0?v=1734571825920" style="width: 16px; height: 16px;"></picture>
                    </div>
                </div>
                <div class="flex justify-between lFouoK__dex">
                    <div class="k_jil0__dex xr2g7U__dex">
                        <div class="ThQSDh__dex options-wrapper">
                            ${customizeMode ? `
                                <!-- CUSTOMIZE MODE: INPUT ALANLARI -->
                                <div class="dex dex-input-var dex-input dex-input-md __XCfV__dex mW93WY__dex">
                                    <div class="dex-input-box auto-size E_NN8J__dex utlHnK__dex" role="none">
                                        <input autocomplete="off" readonly="" type="hidden" style="display: none;">
                                        <input inputmode="decimal" enable_thousands="true" min="0" max="9007199254740991" autocomplete="off" step="1" id="demo-buy-input-1" class="dex-input-input PfVQrS__dex demo-buy-input" autocapitalize="off" autocorrect="off" type="text" value="${tempBuyAmounts[0]}" name="demo_buy_input_1">
                                        <div class="dex-input-suffix"></div>
                                    </div>
                                </div>
                                <div class="dex dex-input-var dex-input dex-input-md __XCfV__dex mW93WY__dex">
                                    <div class="dex-input-box auto-size E_NN8J__dex utlHnK__dex" role="none">
                                        <input autocomplete="off" readonly="" type="hidden" style="display: none;">
                                        <input inputmode="decimal" enable_thousands="true" min="0" max="9007199254740991" autocomplete="off" step="1" id="demo-buy-input-2" class="dex-input-input PfVQrS__dex demo-buy-input" autocapitalize="off" autocorrect="off" type="text" value="${tempBuyAmounts[1]}" name="demo_buy_input_2">
                                        <div class="dex-input-suffix"></div>
                                    </div>
                                </div>
                                <div class="dex dex-input-var dex-input dex-input-md __XCfV__dex mW93WY__dex">
                                    <div class="dex-input-box auto-size E_NN8J__dex utlHnK__dex" role="none">
                                        <input autocomplete="off" readonly="" type="hidden" style="display: none;">
                                        <input inputmode="decimal" enable_thousands="true" min="0" max="9007199254740991" autocomplete="off" step="1" id="demo-buy-input-3" class="dex-input-input PfVQrS__dex demo-buy-input" autocapitalize="off" autocorrect="off" type="text" value="${tempBuyAmounts[2]}" name="demo_buy_input_3">
                                        <div class="dex-input-suffix"></div>
                                    </div>
                                </div>
                            ` : `
                                <!-- NORMAL MODE: BUTONLAR -->
                                <div class="flex items-center kw6r9M__dex">
                                    <div class="H5f_ax__dex Cg7h1c__dex VmOKPA__dex demo-buy-quick" data-amount="${parseFloat(currentSettings.buyAmounts[0]) || 0.03}" style="cursor: pointer;">
                                        <div class="l5GPKh__dex ellipsis">${currentSettings.buyAmounts[0] || '0.03'}</div>
                                    </div>
                                </div>
                                <div class="flex items-center kw6r9M__dex">
                                    <div class="H5f_ax__dex Cg7h1c__dex VmOKPA__dex demo-buy-quick" data-amount="${parseFloat(currentSettings.buyAmounts[1]) || 0.05}" style="cursor: pointer;">
                                        <div class="l5GPKh__dex ellipsis">${currentSettings.buyAmounts[1] || '0.05'}</div>
                                    </div>
                                </div>
                                <div class="flex items-center kw6r9M__dex">
                                    <div class="H5f_ax__dex Cg7h1c__dex VmOKPA__dex demo-buy-quick" data-amount="${parseFloat(currentSettings.buyAmounts[2]) || 0.07}" style="cursor: pointer;">
                                        <div class="l5GPKh__dex ellipsis">${currentSettings.buyAmounts[2] || '0.07'}</div>
                                    </div>
                                </div>
                            `}
                        </div>
                    </div>
                </div>
                <div class="flex justify-start Nox6EF__dex">
                    <div class="flex items-center Fb9n18__dex" role="presentation">
                        <i class="icon iconfont dex-okx-defi-dex-slippage GuPJu7__dex" role="img" aria-hidden="true"></i>
                        <span class="font-12 ml-4 font-500">${currentSettings.buySlippage}</span>
                        <span class="ROEGPH__dex"></span>
                        <i class="icon iconfont dex-okx-defi-dex-fee GuPJu7__dex" role="img" aria-hidden="true"></i>
                        <span class="font-12 ml-4 font-500">Market</span>
                        <span class="ROEGPH__dex"></span>
                        <div data-testid="okd-popup" class="dex dex-popup-var dex-popup dex-tooltip dex-tooltip-var dex-tooltip-neutral  "><div class="flex items-center"><i class="icon iconfont dex-okx-defi-web3-shield Xm6VIO__dex" role="img" aria-label="config-item"></i><span class="Or4Gzq__dex">Auto</span></div></div>
                        <i class="icon iconfont dex-okx-defi-marketplace-chevron-right C0NIv2__dex demo-buy-settings" role="img" aria-hidden="true" style="cursor: pointer;"></i>
                    </div>
                </div>
            </div>
            <div class="QwqNAT__dex">
                <div class="flex justify-between items-center uyKNVr__dex">
                    <div class="dex dex-select-var dex-select select-text lnOLCt__dex instant-trade-token-selector-sell demo-sell-select">
                        <div class="dex-select-value-box display-area NC4WG2__dex">
                            <div class="e4mTHT__dex flex items-center font-12">
                                <span class="ioQevx__dex">Sell for</span>
                                <span class="font-500 UE7t1T__dex">${currentTokenSymbol}</span>
                                <i class="icon iconfont dex-okx-defi-dex-market-sort-down RQGYJ6__dex" role="img" aria-hidden="true"></i>
                            </div>
                        </div>
                        <div data-testid="okd-popup" class="dex dex-popup-var dex-popup select-popup-reference"></div>
                    </div>
                    <div class="flex items-center">
                        ${customizeMode ? `
                            <div class="dex dex-input-var dex-input dex-input-sm" style="width: 80px; margin-right: 8px;">
                                <div class="dex-input-box auto-size" role="none">
                                    <input autocomplete="off" readonly="" type="hidden" style="display: none;">
                                    <input inputmode="decimal" enable_thousands="true" min="0" max="9007199254740991" autocomplete="off" step="1" id="demo-token-balance-input" class="dex-input-input demo-token-balance-input" autocapitalize="off" autocorrect="off" type="text" value="${tokenPortfolio.amount.toFixed(4)}" name="demo_token_balance_input">
                                    <div class="dex-input-suffix"></div>
                                </div>
                            </div>
                        ` : `
                            <span class="VHD_xh__dex">${tokenPortfolio.amount.toFixed(4)}</span>
                        `}
                        <picture class="dex dex-picture dex-picture-font"><source srcset="${tokenPortfolio.image || currentTokenImage || 'https://web3.okx.com/cdn/web3/currency/token/large/501-FM6ZsWmVFA41D72NNNTk35ZrUSg2wkCerSNzg7Wjpump-108/type=default_90_0?v=1759520281357'}&amp;x-oss-process=image/format,webp/ignore-error,1"><img width="16" height="16" class="Lrw8Qc__dex" alt="" src="${tokenPortfolio.image || currentTokenImage || 'https://web3.okx.com/cdn/web3/currency/token/large/501-FM6ZsWmVFA41D72NNNTk35ZrUSg2wkCerSNzg7Wjpump-108/type=default_90_0?v=1759520281357'}" style="width: 16px; height: 16px;"></picture>
                    </div>
                </div>
                <div class="flex justify-between lFouoK__dex">
                    <div class="k_jil0__dex xr2g7U__dex">
                        <div class="ThQSDh__dex options-wrapper">
                            ${customizeMode ? `
                                <!-- CUSTOMIZE MODE: INPUT ALANLARI -->
                                <div class="dex dex-input-var dex-input dex-input-md __XCfV__dex mW93WY__dex">
                                    <div class="dex-input-box auto-size E_NN8J__dex utlHnK__dex" role="none">
                                        <input autocomplete="off" readonly="" type="hidden" style="display: none;">
                                        <input inputmode="decimal" enable_thousands="true" min="0" max="100" autocomplete="off" step="1" id="demo-sell-input-1" class="dex-input-input PfVQrS__dex demo-sell-input" autocapitalize="off" autocorrect="off" type="text" value="${tempSellPercents[0]}" name="demo_sell_input_1">
                                        <div class="dex-input-suffix"></div>
                                    </div>
                                </div>
                                <div class="dex dex-input-var dex-input dex-input-md __XCfV__dex mW93WY__dex">
                                    <div class="dex-input-box auto-size E_NN8J__dex utlHnK__dex" role="none">
                                        <input autocomplete="off" readonly="" type="hidden" style="display: none;">
                                        <input inputmode="decimal" enable_thousands="true" min="0" max="100" autocomplete="off" step="1" id="demo-sell-input-2" class="dex-input-input PfVQrS__dex demo-sell-input" autocapitalize="off" autocorrect="off" type="text" value="${tempSellPercents[1]}" name="demo_sell_input_2">
                                        <div class="dex-input-suffix"></div>
                                    </div>
                                </div>
                                <div class="dex dex-input-var dex-input dex-input-md __XCfV__dex mW93WY__dex">
                                    <div class="dex-input-box auto-size E_NN8J__dex utlHnK__dex" role="none">
                                        <input autocomplete="off" readonly="" type="hidden" style="display: none;">
                                        <input inputmode="decimal" enable_thousands="true" min="0" max="100" autocomplete="off" step="1" id="demo-sell-input-3" class="dex-input-input PfVQrS__dex demo-sell-input" autocapitalize="off" autocorrect="off" type="text" value="${tempSellPercents[2]}" name="demo_sell_input_3">
                                        <div class="dex-input-suffix"></div>
                                    </div>
                                </div>
                            ` : `
                                <!-- NORMAL MODE: BUTONLAR -->
                                <div class="flex items-center kw6r9M__dex">
                                    <div class="H5f_ax__dex ODJ17x__dex VmOKPA__dex demo-sell-quick" data-percent="50" style="cursor: pointer;">
                                        <div class="l5GPKh__dex ellipsis">${currentSettings.sellPercents[0] || '50%'}</div>
                                    </div>
                                </div>
                                <div class="flex items-center kw6r9M__dex">
                                    <div class="H5f_ax__dex ODJ17x__dex VmOKPA__dex demo-sell-quick" data-percent="75" style="cursor: pointer;">
                                        <div class="l5GPKh__dex ellipsis">${currentSettings.sellPercents[1] || '75%'}</div>
                                    </div>
                                </div>
                                <div class="flex items-center kw6r9M__dex">
                                    <div class="H5f_ax__dex ODJ17x__dex VmOKPA__dex demo-sell-quick" data-percent="100" style="cursor: pointer;">
                                        <div class="l5GPKh__dex ellipsis">${currentSettings.sellPercents[2] || '100%'}</div>
                                    </div>
                                </div>
                            `}
                        </div>
                    </div>
                </div>
                <div class="flex justify-start Nox6EF__dex">
                    <div class="flex items-center Fb9n18__dex" role="presentation">
                        <i class="icon iconfont dex-okx-defi-dex-slippage GuPJu7__dex" role="img" aria-hidden="true"></i>
                        <span class="font-12 ml-4 font-500">${currentSettings.sellSlippage}</span>
                        <span class="ROEGPH__dex"></span>
                        <i class="icon iconfont dex-okx-defi-dex-fee GuPJu7__dex" role="img" aria-hidden="true"></i>
                        <span class="font-12 ml-4 font-500">Market</span>
                        <span class="ROEGPH__dex"></span>
                        <div data-testid="okd-popup" class="dex dex-popup-var dex-popup dex-tooltip dex-tooltip-var dex-tooltip-neutral  "><div class="flex items-center"><i class="icon iconfont dex-okx-defi-web3-shield Xm6VIO__dex" role="img" aria-label="config-item"></i><span class="Or4Gzq__dex">Auto</span></div></div>
                        <i class="icon iconfont dex-okx-defi-marketplace-chevron-right C0NIv2__dex demo-sell-settings" role="img" aria-hidden="true" style="cursor: pointer;"></i>
                    </div>
                </div>
            </div>
            <!-- SERVICE FEE KISMI - MARGIN EKLENDİ -->
            <div class="MEKLl5__dex LAaFhW__dex" style="justify-content: center; margin-bottom: ${pnlSectionVisible ? '12px' : '0'};">
                <div data-testid="okd-popup" class="dex dex-popup-var dex-popup dex-tooltip dex-tooltip-var dex-tooltip-neutral cursor-pointer  flex items-center underline-dash vgre7c__dex"><span class="Nx6sMk__dex">Service fee</span></div>
                ${customizeMode ? `
                    <div class="dex dex-input-var dex-input dex-input-sm" style="width: 80px; display: inline-block;">
                        <div class="dex-input-box auto-size" role="none">
                            <input autocomplete="off" readonly="" type="hidden" style="display: none;">
                            <input inputmode="decimal" enable_thousands="true" min="0" max="100" autocomplete="off" step="0.01" id="demo-service-fee-input" class="dex-input-input demo-service-fee-input" autocapitalize="off" autocorrect="off" type="text" value="${tempServiceFee}" name="demo_service_fee_input">
                            <div class="dex-input-suffix"></div>
                        </div>
                    </div>
                ` : `<span>${currentSettings.serviceFee}</span>`}
            </div>

            <!-- PNL BÖLÜMÜ - YENİ TASARIM -->
            ${pnlSectionVisible ? `
                <!-- ÇİZGİ EKLENDİ VE MARGIN DÜZENLENDİ -->
                <div class="zt1bsn__dex" style="margin: 8px 0;"></div>
                <div class="flex gap-2 font-12 items-center" style="margin-bottom: 8px;">
                    <div class="K_Nnu2__dex">
                        <div data-testid="okd-popup" class="dex dex-popup-var dex-popup dex-tooltip dex-tooltip-var dex-tooltip-neutral  ">
                            <div class="sU7u0q__dex underline-dash">Bought</div>
                        </div>
                        <div data-testid="okd-popup" class="dex dex-popup-var dex-popup dex-tooltip dex-tooltip-var dex-tooltip-neutral  ">
                            <div class="RYWNH6__dex HV7ko9__dex demo-pnl-bought">${formatNumber(boughtAmount, showFiat)}</div>
                        </div>
                    </div>
                    <div class="K_Nnu2__dex">
                        <div data-testid="okd-popup" class="dex dex-popup-var dex-popup dex-tooltip dex-tooltip-var dex-tooltip-neutral  ">
                            <div class="sU7u0q__dex underline-dash">Sold</div>
                        </div>
                        <div data-testid="okd-popup" class="dex dex-popup-var dex-popup dex-tooltip dex-tooltip-var dex-tooltip-neutral  ">
                            <div class="RYWNH6__dex HV7ko9__dex demo-pnl-sold">${formatNumber(soldAmount, showFiat)}</div>
                        </div>
                    </div>
                    <div class="K_Nnu2__dex">
                        <div class="sU7u0q__dex">Balance</div>
                        <div class="RYWNH6__dex HV7ko9__dex demo-pnl-balance">${formatNumber(balanceAmount, showFiat)}</div>
                    </div>
                    <div class="lWdbPD__dex">
                        <div class="flex flex-row items-center justify-center">
                            <div data-testid="okd-popup" class="dex dex-popup-var dex-popup dex-tooltip dex-tooltip-var dex-tooltip-neutral  ">
                                <div class="sU7u0q__dex underline-dash">TPnL</div>
                            </div>
                            <!-- CURRENCY TOGGLE BUTONU - GÜNCELLENDİ -->
                            <div data-testid="okd-popup" class="dex dex-popup-var dex-popup dex-tooltip dex-tooltip-var dex-tooltip-neutral  ">
                                <div role="button" tabindex="0" class="l6WLJO__dex border-1 rounded-full w-16 h-16 ml-2 demo-currency-toggle" style="display: flex; align-items: center; justify-content: center;">
                                    <i class="icon iconfont ${showFiat ? 'dex-okds-usd' : 'dex-okx-defi-dex-token'} rrglRU__dex" role="img" aria-hidden="true" style="font-size: 16px;"></i>
                                </div>
                            </div>
                        </div>
                        <div class="VlintX__dex">
                            <div class="HV7ko9__dex VlintX__dex">
                                <div data-testid="okd-popup" class="dex dex-popup-var dex-popup dex-tooltip dex-tooltip-var dex-tooltip-neutral  ">
                                    <span class="demo-pnl-tpnl" style="color: ${tpnlAmount >= 0 ? '#00a86b' : '#ff4444'}">${formatNumber(tpnlAmount, showFiat)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ` : ''}
        </div>
    </div>
    `;

        hideDemoPanel();
        document.body.insertAdjacentHTML('beforeend', demoPanelHTML);

        setTimeout(() => {
            try {
                setupDemoPanelEvents();
                setupAdvancedDragAndDrop();
                setupDropdowns();
                setupDropdownEvents();
                updateDemoPanelValues();
            } catch (error) {
                console.error('Error setting up demo panel:', error);
            }
        }, 200);

        demoPanelVisible = true;
    }

    function hideDemoPanel() {
        const demoPanel = document.querySelector('.demo-trade-panel');
        if (demoPanel) {
            demoPanel.remove();
        }
        demoPanelVisible = false;
    }

    function setupAdvancedDragAndDrop() {
        const demoPanel = document.querySelector('.demo-trade-panel');
        if (!demoPanel) return;

        let isDragging = false;
        let startX, startY, initialX, initialY;

        const dragHandle = demoPanel.querySelector('.vM9Rz8__dex');

        const dragStart = (e) => {
            if (e.target.closest('.vM9Rz8__dex')) {
                isDragging = true;
                startX = e.clientX || e.touches[0].clientX;
                startY = e.clientY || e.touches[0].clientY;

                const rect = demoPanel.getBoundingClientRect();
                initialX = rect.left;
                initialY = rect.top;

                demoPanel.style.cursor = 'grabbing';
                demoPanel.style.transition = 'none';
                demoPanel.style.opacity = '0.8';

                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();
            }
        };

        const drag = (e) => {
            if (!isDragging) return;

            const currentX = e.clientX || e.touches[0].clientX;
            const currentY = e.clientY || e.touches[0].clientY;

            const deltaX = currentX - startX;
            const deltaY = currentY - startY;

            demoPanel.style.left = (initialX + deltaX) + 'px';
            demoPanel.style.top = (initialY + deltaY) + 'px';

            e.preventDefault();
            e.stopPropagation();
        };

        const dragEnd = () => {
            if (!isDragging) return;

            isDragging = false;
            demoPanel.style.cursor = 'default';
            demoPanel.style.transition = 'all 0.2s';
            demoPanel.style.opacity = '1';
        };

        dragHandle.addEventListener('mousedown', dragStart, true);
        dragHandle.addEventListener('touchstart', dragStart, { passive: false });

        document.addEventListener('mousemove', drag, true);
        document.addEventListener('touchmove', drag, { passive: false });

        document.addEventListener('mouseup', dragEnd, true);
        document.addEventListener('touchend', dragEnd, true);
        document.addEventListener('mouseleave', dragEnd, true);
    }

    function setupDropdowns() {
        console.log('🔄 Setting up dropdowns with current token:', currentTokenSymbol, currentTokenImage);

        // Default select dropdown
        const defaultSelect = document.querySelector('.demo-default-select');
        if (defaultSelect) {
            const popupReference = defaultSelect.querySelector('.select-popup-reference');
            if (popupReference) {
                popupReference.innerHTML = `
                    <div class="dex dex-popup-var dex-popup-layer dex-popup-layer-visible" style="z-index: 10000; visibility: hidden; position: absolute; left: 0px; top: 0px; margin: 0px; transform: translate(0px, 40px);" data-popper-placement="bottom-start">
                        <div class="dex-popup-layer-content" style="width: 140px;">
                            <div class="dex-select-var dex-select-option dex-select-option-pc yip61W__dex align-left drop-mode option-md">
                                <div class="dex-select-option-box">
                                    <div class="pc-option-scroll" style="max-height: 200px;">
                                        <div class="dex-select-item-container dex-select-item-container-real">
                                            <div class="dex-select-item dex-select-item-active dex-dropdown-option demo-default-option" role="option" aria-selected="true" data-value="Default">
                                                <div class="flex justify-between items-center Be9HsZ__dex">
                                                    <div class="vZhXdm__dex">Default</div>
<i class="icon iconfont dex-okx-defi-dex-check DaCpQM__dex qriW7s__dex" role="img" aria-hidden="true"></i>
</div>
</div>
<div class="dex-select-item dex-dropdown-option demo-default-option" role="option" aria-selected="false" data-value="Meme">
    <div class="flex justify-between items-center Be9HsZ__dex">
        <div class="vZhXdm__dex">Meme</div>
<i class="icon iconfont dex-okx-defi-dex-check DaCpQM__dex" role="img" aria-hidden="true"></i>
</div>
</div>
<div class="dex-select-item dex-dropdown-option demo-default-option" role="option" aria-selected="false" data-value="AMV">
    <div class="flex justify-between items-center Be9HsZ__dex">
        <div class="vZhXdm__dex">AMV/20%/FA</div>
            <i class="icon iconfont dex-okx-defi-dex-check DaCpQM__dex" role="img" aria-hidden="true"></i>
</div>
</div>
<div class="dex-select-item dex-dropdown-option demo-default-option" role="option" aria-selected="false" data-value="MEV1">
    <div class="flex justify-between items-center Be9HsZ__dex">
        <div class="vZhXdm__dex">MEV/30%/FA</div>
            <i class="icon iconfont dex-okx-defi-dex-check DaCpQM__dex" role="img" aria-hidden="true"></i>
</div>
</div>
<div class="dex-select-item dex-dropdown-option demo-default-option" role="option" aria-selected="false" data-value="MEV2">
    <div class="flex justify-between items-center Be9HsZ__dex">
        <div class="vZhXdm__dex">MEV/30%/TURB</div>
            <i class="icon iconfont dex-okx-defi-dex-check DaCpQM__dex" role="img" aria-hidden="true"></i>
</div>
</div>
</div>
</div>
<div class="pc-option-footer">
    <div class="ViayfB__dex">
        <button type="button" class="dex-plain-button ViayfB__dex demo-edit-settings">
            <i class="icon iconfont dex-okx-defi-dex-web3-settings cQG_ch__dex" role="img" aria-hidden="true"></i>
<span>Edit</span>
</button>
</div>
</div>
</div>
</div>
</div>
</div>
`;
            }
        }

        // Buy token select dropdown
        const buySelect = document.querySelector('.demo-buy-select');
        if (buySelect) {
            const popupReference = buySelect.querySelector('.select-popup-reference');
            if (popupReference) {
                const solBalance = demoPortfolio.SOL.amount.toFixed(4);
                const solValue = (demoPortfolio.SOL.amount * currentSolPrice).toFixed(2);

                popupReference.innerHTML = `
                    <div class="dex dex-popup-var dex-popup-layer dex-popup-layer-visible" style="z-index: 10001; visibility: hidden; position: absolute; left: 0px; top: 0px; margin: 0px; transform: translate(0px, 40px);" data-popper-placement="bottom-start">
                        <div class="dex-popup-layer-content" style="width: 308px;">
                            <div class="dex-select-var dex-select-option dex-select-option-pc WFwMwa__dex instant-trade-token-selector-option-cont-buy align-left drop-mode option-md">
                                <div class="dex-select-option-box">
                                    <div class="pc-option-scroll" style="max-height: 208px;">
                                        <div class="dex-select-item-container dex-select-item-container-real">
                                            <div class="dex-select-item dex-select-item-active dex-dropdown-option demo-buy-option" role="option" aria-selected="true" data-value="SOL">
                                                <div class="flex justify-between items-center G9BMtd__dex">
                                                    <div class="flex items-center">
                                                        <picture class="dex dex-picture dex-picture-font">
                                                            <source srcset="https://web3.okx.com/cdn/web3/currency/token/501-11111111111111111111111111111111-1.png/type=default_350_0?v=1734571825920&amp;x-oss-process=image/format,webp/ignore-error,1">
                                                                <img width="28" height="28" class="jxzKU9__dex" alt="" src="https://web3.okx.com/cdn/web3/currency/token/501-11111111111111111111111111111111-1.png/type=default_350_0?v=1734571825920" style="width: 28px; height: 28px;">
                                                                    </picture>
<div class="flex flex-col">
    <span class="tiQWEG__dex">SOL</span>
<span class="inAvcR__dex">Solana</span>
</div>
</div>
<div class="flex flex-col tsKlgJ__dex">
    <span class="tiQWEG__dex">${solBalance}</span>
<span class="inAvcR__dex">$${solValue}</span>
</div>
</div>
</div>
<div class="dex-select-item dex-dropdown-option demo-buy-option" role="option" aria-selected="false" data-value="USDC">
    <div class="flex justify-between items-center G9BMtd__dex">
        <div class="flex items-center">
            <picture class="dex dex-picture dex-picture-font">
                <source srcset="https://web3.okx.com/cdn/web3/currency/token/large/637-0xbae207659db88bea0cbead6da0ed00aac12edcdda169e591cd41c94180b46f3b-107/type=default_90_0?v=1756203256814&amp;x-oss-process=image/format,webp/ignore-error,1">
                    <img width="28" height="28" class="jxzKU9__dex" alt="" src="https://web3.okx.com/cdn/web3/currency/token/large/637-0xbae207659db88bea0cbead6da0ed00aac12edcdda169e591cd41c94180b46f3b-107/type=default_90_0?v=1756203256814" style="width: 28px; height: 28px;">
                        </picture>
<div class="flex flex-col">
    <span class="tiQWEG__dex">USDC</span>
<span class="inAvcR__dex">USD Coin</span>
</div>
</div>
<div class="flex flex-col tsKlgJ__dex">
    <span class="tiQWEG__dex">0</span>
<span class="inAvcR__dex">$0.00</span>
</div>
</div>
</div>
</div>
</div>
<div class="pc-option-footer">
    <div class="CnFTM4__dex">
        <span>If you wish to trade other tokens, switch to <button type="button" class="dex-plain-button k3rUid__dex demo-swap-btn">Swap</button></span>
            </div>
</div>
</div>
</div>
</div>
</div>
`;
            }
        }

        // Sell token select dropdown
        const sellSelect = document.querySelector('.demo-sell-select');
        if (sellSelect) {
            const popupReference = sellSelect.querySelector('.select-popup-reference');
            if (popupReference) {
                const tokenPortfolio = getCurrentTokenPortfolio();
                const tokenBalance = tokenPortfolio.amount.toFixed(4);
                const tokenValue = (tokenPortfolio.amount * currentTokenPrice).toFixed(2);
                const solBalance = demoPortfolio.SOL.amount.toFixed(4);
                const solValue = (demoPortfolio.SOL.amount * currentSolPrice).toFixed(2);

                popupReference.innerHTML = `
                    <div class="dex dex-popup-var dex-popup-layer dex-popup-layer-visible" style="z-index: 10002; visibility: hidden; position: absolute; left: 0px; top: 0px; margin: 0px; transform: translate(0px, 40px);" data-popper-placement="bottom-start">
                        <div class="dex-popup-layer-content" style="width: 308px;">
                            <div class="dex-select-var dex-select-option dex-select-option-pc WFwMwa__dex instant-trade-token-selector-option-cont-sell align-left drop-mode option-md">
                                <div class="dex-select-option-box">
                                    <div class="pc-option-scroll" style="max-height: 208px;">
                                        <div class="dex-select-item-container dex-select-item-container-real">
                                            <div class="dex-select-item dex-select-item-active dex-dropdown-option demo-sell-option" role="option" aria-selected="true" data-value="${currentTokenSymbol}">
                                                <div class="flex justify-between items-center G9BMtd__dex">
                                                    <div class="flex items-center">
                                                        <picture class="dex dex-picture dex-picture-font">
                                                            <source srcset="${currentTokenImage || tokenPortfolio.image || 'https://web3.okx.com/cdn/web3/currency/token/large/501-FM6ZsWmVFA41D72NNNTk35ZrUSg2wkCerSNzg7Wjpump-108/type=default_90_0?v=1759520281357'}&amp;x-oss-process=image/format,webp/ignore-error,1">
                                                                <img width="28" height="28" class="jxzKU9__dex" alt="" src="${currentTokenImage || tokenPortfolio.image || 'https://web3.okx.com/cdn/web3/currency/token/large/501-FM6ZsWmVFA41D72NNNTk35ZrUSg2wkCerSNzg7Wjpump-108/type=default_90_0?v=1759520281357'}" style="width: 28px; height: 28px;">
                                                                    </picture>
<div class="flex flex-col">
    <span class="tiQWEG__dex">${currentTokenSymbol}</span>
<span class="inAvcR__dex">Current Token</span>
</div>
</div>
<div class="flex flex-col tsKlgJ__dex">
    <span class="tiQWEG__dex">${tokenBalance}</span>
<span class="inAvcR__dex">$${tokenValue}</span>
</div>
</div>
</div>
<div class="dex-select-item dex-dropdown-option demo-sell-option" role="option" aria-selected="false" data-value="SOL">
    <div class="flex justify-between items-center G9BMtd__dex">
        <div class="flex items-center">
            <picture class="dex dex-picture dex-picture-font">
                <source srcset="https://web3.okx.com/cdn/web3/currency/token/501-11111111111111111111111111111111-1.png/type=default_350_0?v=1734571825920&amp;x-oss-process=image/format,webp/ignore-error,1">
                    <img width="28" height="28" class="jxzKU9__dex" alt="" src="https://web3.okx.com/cdn/web3/currency/token/501-11111111111111111111111111111111-1.png/type=default_350_0?v=1734571825920" style="width: 28px; height: 28px;">
                        </picture>
<div class="flex flex-col">
    <span class="tiQWEG__dex">SOL</span>
<span class="inAvcR__dex">Solana</span>
</div>
</div>
<div class="flex flex-col tsKlgJ__dex">
    <span class="tiQWEG__dex">${solBalance}</span>
<span class="inAvcR__dex">$${solValue}</span>
</div>
</div>
</div>
</div>
</div>
<div class="pc-option-footer">
    <div class="CnFTM4__dex">
        <span>If you wish to trade other tokens, switch to <button type="button" class="dex-plain-button k3rUid__dex demo-swap-btn">Swap</button></span>
            </div>
</div>
</div>
</div>
</div>
</div>
`;

                console.log('✅ Sell dropdown updated with:', {
                    symbol: currentTokenSymbol,
                    image: currentTokenImage || tokenPortfolio.image,
                    balance: tokenBalance,
                    value: tokenValue
                });
            }
        }
    }

    function setupDropdownEvents() {
        console.log('Setting up dropdown events...');

        // Default select
        const defaultSelect = document.querySelector('.demo-default-select .dex-select-value-box');
        if (defaultSelect) {
            defaultSelect.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();

                const popup = this.closest('.dex-select').querySelector('.dex-popup-layer');
                if (popup) {
                    const isVisible = popup.style.visibility === 'visible';
                    // Tüm popup'ları kapat
                    document.querySelectorAll('.dex-popup-layer').forEach(p => {
                        p.style.visibility = 'hidden';
                        p.style.zIndex = '-1';
                    });
                    // Bu popup'ı aç
                    if (!isVisible) {
                        popup.style.visibility = 'visible';
                        popup.style.zIndex = '10008';
                    }
                }
                return false;
            }, true);
        }

        // Buy select
        const buySelect = document.querySelector('.demo-buy-select .dex-select-value-box');
        if (buySelect) {
            buySelect.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();

                const popup = this.closest('.dex-select').querySelector('.dex-popup-layer');
                if (popup) {
                    const isVisible = popup.style.visibility === 'visible';
                    document.querySelectorAll('.dex-popup-layer').forEach(p => {
                        p.style.visibility = 'hidden';
                        p.style.zIndex = '-1';
                    });
                    if (!isVisible) {
                        popup.style.visibility = 'visible';
                        popup.style.zIndex = '10009';
                    }
                }
                return false;
            }, true);
        }

        // Sell select
        const sellSelect = document.querySelector('.demo-sell-select .dex-select-value-box');
        if (sellSelect) {
            sellSelect.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();

                const popup = this.closest('.dex-select').querySelector('.dex-popup-layer');
                if (popup) {
                    const isVisible = popup.style.visibility === 'visible';
                    document.querySelectorAll('.dex-popup-layer').forEach(p => {
                        p.style.visibility = 'hidden';
                        p.style.zIndex = '-1';
                    });
                    if (!isVisible) {
                        popup.style.visibility = 'visible';
                        popup.style.zIndex = '10009';
                    }
                }
                return false;
            }, true);
        }

        // Dropdown options
        setTimeout(() => {
            document.querySelectorAll('.demo-default-option').forEach(option => {
                option.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    e.stopImmediatePropagation();

                    const value = this.getAttribute('data-value');
                    const display = document.querySelector('.demo-default-select .D3fk1I__dex');
                    if (display) display.textContent = value;

                    document.querySelectorAll('.dex-popup-layer').forEach(p => {
                        p.style.visibility = 'hidden';
                        p.style.zIndex = '-1';
                    });

                    showDemoNotification(`Mode changed to: ${value}`, 'info');
                    return false;
                }, true);
            });

            document.querySelectorAll('.demo-buy-option').forEach(option => {
                option.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    e.stopImmediatePropagation();

                    const value = this.getAttribute('data-value');
                    const display = document.querySelector('.demo-buy-select .UE7t1T__dex');
                    if (display) display.textContent = value;

                    document.querySelectorAll('.dex-popup-layer').forEach(p => {
                        p.style.visibility = 'hidden';
                        p.style.zIndex = '-1';
                    });

                    showDemoNotification(`Buy with: ${value}`, 'info');
                    return false;
                }, true);
            });

            document.querySelectorAll('.demo-sell-option').forEach(option => {
                option.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    e.stopImmediatePropagation();

                    const value = this.getAttribute('data-value');
                    const display = document.querySelector('.demo-sell-select .UE7t1T__dex');
                    if (display) display.textContent = value;

                    document.querySelectorAll('.dex-popup-layer').forEach(p => {
                        p.style.visibility = 'hidden';
                        p.style.zIndex = '-1';
                    });

                    showDemoNotification(`Sell for: ${value}`, 'info');
                    return false;
                }, true);
            });
        }, 100);

        // Document click to close dropdowns
        document.addEventListener('click', function(e) {
            // Sadece demo dropdown'ları değilse kapat
            if (!e.target.closest('.demo-default-select') &&
                !e.target.closest('.demo-buy-select') &&
                !e.target.closest('.demo-sell-select') &&
                !e.target.closest('.dex-popup-layer')) {
                document.querySelectorAll('.dex-popup-layer').forEach(popup => {
                    popup.style.visibility = 'hidden';
                    popup.style.zIndex = '-1';
                });
            }
        }, true);
    }

    function setupDemoPanelEvents() {
        console.log('Setting up demo panel events...');

        // Kapat butonu
        const closeBtn = document.querySelector('.demo-panel-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                hideDemoPanel();
                return false;
            }, true);
        }

        // Reset butonu
        const resetBtn = document.querySelector('.demo-reset-balance');
        if (resetBtn) {
            resetBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                resetDemoAccount();
                return false;
            }, true);
        }

        // Customize butonu
        const customizeBtn = document.querySelector('.demo-customize-btn');
        if (customizeBtn) {
            console.log('Customize button found, setting up click event...');

            const newCustomizeBtn = customizeBtn.cloneNode(true);
            customizeBtn.parentNode.replaceChild(newCustomizeBtn, customizeBtn);

            newCustomizeBtn.addEventListener('click', function(e) {
                console.log('✅ CUSTOMIZE BUTTON CLICKED! Mode:', customizeMode);
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();

                toggleCustomizeMode();
                return false;
            }, true);
        }

        // PnL butonu - YENİ EKLENDİ
        const pnlBtn = document.querySelector('.demo-pnl-btn');
        if (pnlBtn) {
            pnlBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();

                console.log('✅ PNL BUTTON CLICKED! Current state:', pnlSectionVisible);
                pnlSectionVisible = !pnlSectionVisible;

                // Panel'i yeniden oluştur
                if (demoPanelVisible) {
                    const currentPanel = document.querySelector('.demo-trade-panel');
                    let panelStyle = {};
                    if (currentPanel) {
                        panelStyle = {
                            left: currentPanel.style.left,
                            top: currentPanel.style.top
                        };
                    }

                    showDemoPanel();

                    // Pozisyonu geri yükle
                    if (panelStyle.left && panelStyle.top) {
                        const newPanel = document.querySelector('.demo-trade-panel');
                        if (newPanel) {
                            newPanel.style.left = panelStyle.left;
                            newPanel.style.top = panelStyle.top;
                        }
                    }
                }

                return false;
            }, true);
        }

        // Currency toggle butonu - GÜNCELLENDİ
        const currencyToggle = document.querySelector('.demo-currency-toggle');
        if (currencyToggle) {
            // Mevcut event listener'ları temizle
            const newCurrencyToggle = currencyToggle.cloneNode(true);
            currencyToggle.parentNode.replaceChild(newCurrencyToggle, currencyToggle);

            newCurrencyToggle.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();

                console.log('💰 Currency toggle clicked. Current mode:', showFiat);
                showFiat = !showFiat;

                // Butonun görünürlüğünü koru ve güncelle
                this.style.display = 'flex';
                this.style.alignItems = 'center';
                this.style.justifyContent = 'center';

                updatePnLDisplay();
                return false;
            }, true);
        }

        // Buy settings butonu
        const buySettings = document.querySelector('.demo-buy-settings');
        if (buySettings) {
            buySettings.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                showDemoNotification(`Buy settings: ${currentSettings.buySlippage} slippage`, 'info');
                return false;
            }, true);
        }

        // Sell settings butonu
        const sellSettings = document.querySelector('.demo-sell-settings');
        if (sellSettings) {
            sellSettings.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                showDemoNotification(`Sell settings: ${currentSettings.sellSlippage} slippage`, 'info');
                return false;
            }, true);
        }

        // Hızlı alım butonları (sadece customize mode kapalıyken)
        if (!customizeMode) {
            const buyButtons = document.querySelectorAll('.demo-buy-quick');
            buyButtons.forEach(btn => {
                const newBtn = btn.cloneNode(true);
                btn.parentNode.replaceChild(newBtn, btn);

                newBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    const amount = parseFloat(this.getAttribute('data-amount')) || 0.03;
                    executeDemoBuy(amount);
                    return false;
                }, true);
            });
        }

        // Hızlı satış butonları (sadece customize mode kapalıyken)
        if (!customizeMode) {
            const sellButtons = document.querySelectorAll('.demo-sell-quick');
            sellButtons.forEach(btn => {
                const newBtn = btn.cloneNode(true);
                btn.parentNode.replaceChild(newBtn, btn);

                newBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    const percent = parseInt(this.getAttribute('data-percent')) || 50;
                    executeDemoSell(percent);
                    return false;
                }, true);
            });
        }

        // Input event'leri (sadece customize mode açıkken)
        if (customizeMode) {
            // Buy amount input'ları
            const buyInputs = document.querySelectorAll('.demo-buy-input');
            buyInputs.forEach((input, index) => {
                const newInput = input.cloneNode(true);
                input.parentNode.replaceChild(newInput, input);

                newInput.addEventListener('input', function(e) {
                    tempBuyAmounts[index] = this.value;
                    console.log(`Buy amount ${index + 1} updated: ${this.value}`);
                });

                newInput.addEventListener('blur', function(e) {
                    tempBuyAmounts[index] = this.value;
                    console.log(`Buy amount ${index + 1} saved: ${this.value}`);
                });
            });

            // Sell percent input'ları
            const sellInputs = document.querySelectorAll('.demo-sell-input');
            sellInputs.forEach((input, index) => {
                const newInput = input.cloneNode(true);
                input.parentNode.replaceChild(newInput, input);

                newInput.addEventListener('input', function(e) {
                    tempSellPercents[index] = this.value;
                    console.log(`Sell percent ${index + 1} updated: ${this.value}`);
                });

                newInput.addEventListener('blur', function(e) {
                    tempSellPercents[index] = this.value;
                    console.log(`Sell percent ${index + 1} saved: ${this.value}`);
                });
            });

            // Service fee input event'i
            const serviceFeeInput = document.querySelector('.demo-service-fee-input');
            if (serviceFeeInput) {
                const newServiceFeeInput = serviceFeeInput.cloneNode(true);
                serviceFeeInput.parentNode.replaceChild(newServiceFeeInput, serviceFeeInput);

                newServiceFeeInput.addEventListener('input', function(e) {
                    tempServiceFee = this.value;
                    console.log(`Service fee updated: ${this.value}`);
                });

                newServiceFeeInput.addEventListener('blur', function(e) {
                    tempServiceFee = this.value;
                    console.log(`Service fee saved: ${this.value}`);
                });
            }

            // SOL balance input event'i
            const solBalanceInput = document.querySelector('.demo-sol-balance-input');
            if (solBalanceInput) {
                const newSolBalanceInput = solBalanceInput.cloneNode(true);
                solBalanceInput.parentNode.replaceChild(newSolBalanceInput, solBalanceInput);

                newSolBalanceInput.addEventListener('input', function(e) {
                    const newValue = parseFloat(this.value);
                    if (!isNaN(newValue) && newValue >= 0) {
                        demoPortfolio.SOL.amount = newValue;
                        console.log(`SOL balance updated: ${this.value}`);
                    }
                });

                newSolBalanceInput.addEventListener('blur', function(e) {
                    const newValue = parseFloat(this.value);
                    if (!isNaN(newValue) && newValue >= 0) {
                        demoPortfolio.SOL.amount = newValue;
                        savePortfolioToStorage();
                        console.log(`SOL balance saved: ${this.value}`);
                    }
                });
            }

            // Token balance input event'i
            const tokenBalanceInput = document.querySelector('.demo-token-balance-input');
            if (tokenBalanceInput) {
                const newTokenBalanceInput = tokenBalanceInput.cloneNode(true);
                tokenBalanceInput.parentNode.replaceChild(newTokenBalanceInput, tokenBalanceInput);

                newTokenBalanceInput.addEventListener('input', function(e) {
                    const newValue = parseFloat(this.value);
                    if (!isNaN(newValue) && newValue >= 0) {
                        const tokenPortfolio = getCurrentTokenPortfolio();
                        tokenPortfolio.amount = newValue;
                        console.log(`Token balance updated: ${this.value}`);
                    }
                });

                newTokenBalanceInput.addEventListener('blur', function(e) {
                    const newValue = parseFloat(this.value);
                    if (!isNaN(newValue) && newValue >= 0) {
                        const tokenPortfolio = getCurrentTokenPortfolio();
                        tokenPortfolio.amount = newValue;
                        savePortfolioToStorage();
                        console.log(`Token balance saved: ${this.value}`);
                    }
                });
            }
        }
    }

    function toggleCustomizeMode() {
        console.log('Toggling customize mode. Current mode:', customizeMode);
        customizeMode = !customizeMode;

        if (customizeMode) {
            // Geçici değerleri mevcut ayarlarla doldur
            tempBuyAmounts = [...currentSettings.buyAmounts];
            tempSellPercents = [...currentSettings.sellPercents];
            tempServiceFee = currentSettings.serviceFee;
            showDemoNotification('Customize amounts mode activated - Edit buy amounts, sell percentages, service fee and balances', 'info');
        } else {
            // Değişiklikleri kaydet
            currentSettings.buyAmounts = [...tempBuyAmounts];
            currentSettings.sellPercents = [...tempSellPercents];
            currentSettings.serviceFee = tempServiceFee;

            // Ayarları localStorage'a kaydet
            saveSettingsToStorage();
            savePortfolioToStorage();

            showDemoNotification('Custom amounts and service fee saved successfully!', 'success');
        }

        // PANELİ YENİDEN OLUŞTUR
        if (demoPanelVisible) {
            // Mevcut panel pozisyonunu kaydet
            const currentPanel = document.querySelector('.demo-trade-panel');
            let panelStyle = {};
            if (currentPanel) {
                panelStyle = {
                    left: currentPanel.style.left,
                    top: currentPanel.style.top
                };
            }

            // Panel'i yeniden oluştur
            showDemoPanel();

            // Pozisyonu geri yükle
            if (panelStyle.left && panelStyle.top) {
                const newPanel = document.querySelector('.demo-trade-panel');
                if (newPanel) {
                    newPanel.style.left = panelStyle.left;
                    newPanel.style.top = panelStyle.top;
                }
            }

            console.log('Panel rebuilt with customize mode:', customizeMode);
        }
    }

    function resetDemoAccount() {
        if (confirm('Are you sure you want to reset your demo account? All portfolio data will be lost.')) {
            demoBalance = 1000;
            // Sadece SOL'u koru, diğer tüm tokenları temizle
            demoPortfolio = {
                'SOL': { amount: 10, avgPrice: 100, symbol: 'SOL', image: 'https://web3.okx.com/cdn/web3/currency/token/501-11111111111111111111111111111111-1.png/type=default_350_0?v=1734571825920' }
            };
            totalPnL = 0;
            totalPnLPercent = 0;
            tokenPnL = 0;
            tokenPnLPercent = 0;
            totalRealizedPnL = 0;
            totalTradeVolume = 0;
            tradeHistory = [];

            // localStorage'ı da temizle
            savePortfolioToStorage();

            updateDemoPanelValues();
            showDemoNotification('Demo account reset! Balance: $1000, SOL: 10', 'success');
        }
    }

    // Rastgele SOL fee hesaplama fonksiyonu
    function calculateRandomSolFee() {
        const min = 0.0004;
        const max = 0.0009;
        return (Math.random() * (max - min) + min).toFixed(6);
    }

    // Service fee hesaplama fonksiyonu
    function calculateServiceFee(amount, feePercentage) {
        const percentage = parseFloat(feePercentage.replace('%', '')) / 100;
        return amount * percentage;
    }

    function executeDemoBuy(amount) {
        const tokenPortfolio = getCurrentTokenPortfolio();

        // Fiyat kontrolü
        if (!currentTokenPrice || currentTokenPrice <= 0 || isNaN(currentTokenPrice)) {
            showDemoNotification('Cannot execute buy - token price not available!', 'error');
            return;
        }

        if (!demoMode) {
            showDemoNotification('Please activate demo mode first!', 'error');
            return;
        }

        const solCost = amount;

        if (solCost > demoPortfolio.SOL.amount) {
            showDemoNotification(`Insufficient SOL! Need ${solCost.toFixed(4)} SOL but only have ${demoPortfolio.SOL.amount.toFixed(4)} SOL`, 'error');
            return;
        }

        console.log('🛒 Executing BUY for:', currentTokenSymbol, 'CA:', getTokenCAFromURL());

        // Fee hesaplamaları
        const serviceFeeAmount = calculateServiceFee(solCost, currentSettings.serviceFee);
        const marketFeeAmount = parseFloat(calculateRandomSolFee());
        const totalFees = serviceFeeAmount + marketFeeAmount;
        const totalSolCost = solCost + totalFees;

        if (totalSolCost > demoPortfolio.SOL.amount) {
            showDemoNotification(`Insufficient SOL for fees! Need ${totalSolCost.toFixed(6)} SOL`, 'error');
            return;
        }

        // Token miktarı hesaplama
        const tokenAmount = (solCost * currentSolPrice) / currentTokenPrice;
        const usdValue = solCost * currentSolPrice;

        console.log('💰 Buy calculation:', {
            tokenAmount: tokenAmount,
            tokenPrice: currentTokenPrice,
            solCost: solCost,
            usdValue: usdValue
        });

        // Weighted average price hesaplama
        const previousAmount = tokenPortfolio.amount;
        const previousAvgPrice = tokenPortfolio.avgPrice;
        const previousTotalValue = previousAmount * previousAvgPrice;
        const newTotalValue = previousTotalValue + (tokenAmount * currentTokenPrice);
        const totalTokenAmount = previousAmount + tokenAmount;

        // Yeni ortalama fiyat
        tokenPortfolio.avgPrice = totalTokenAmount > 0 ? newTotalValue / totalTokenAmount : currentTokenPrice;
        tokenPortfolio.amount = totalTokenAmount;
        tokenPortfolio.totalInvested += usdValue;

        // SOL bakiyesini güncelle
        demoPortfolio.SOL.amount -= totalSolCost;

        // Trade history
        tradeHistory.push({
            type: 'BUY',
            tokenSymbol: currentTokenSymbol,
            tokenCA: getTokenCAFromURL(),
            tokenAmount: tokenAmount,
            tokenPrice: currentTokenPrice,
            solAmount: solCost,
            usdValue: usdValue,
            timestamp: new Date()
        });

        totalTradeVolume += usdValue;

        // Local storage'a kaydet
        savePortfolioToStorage();

        calculatePnL();
        updateDemoPanelValues();
        updatePnLDisplay();

        showDemoNotification(`Bought ${tokenAmount.toFixed(2)} ${currentTokenSymbol} for ${solCost.toFixed(4)} SOL | Avg Price: $${tokenPortfolio.avgPrice.toFixed(6)}`, 'success');
    }

    function executeDemoSell(percent) {
        const tokenPortfolio = getCurrentTokenPortfolio();

        if (!demoMode) {
            showDemoNotification('Please activate demo mode first!', 'error');
            return;
        }

        if (tokenPortfolio.amount <= 0) {
            showDemoNotification(`No ${currentTokenSymbol} to sell!`, 'error');
            return;
        }

        const tokenAmount = tokenPortfolio.amount * (percent / 100);

        // Gelir hesaplama
        const solRevenue = (tokenAmount * currentTokenPrice) / currentSolPrice;
        const usdValue = tokenAmount * currentTokenPrice;

        // Fee hesaplamaları
        const serviceFeeAmount = calculateServiceFee(solRevenue, currentSettings.serviceFee);
        const marketFeeAmount = parseFloat(calculateRandomSolFee());
        const totalFees = serviceFeeAmount + marketFeeAmount;
        const netSolRevenue = solRevenue - totalFees;

        if (netSolRevenue < 0) {
            showDemoNotification(`Fees exceed revenue! Cannot sell.`, 'error');
            return;
        }

        // PnL hesaplama
        const costBasis = tokenAmount * tokenPortfolio.avgPrice;
        const realizedPnL = usdValue - costBasis;

        console.log('💰 Sell calculation:', {
            tokenAmount: tokenAmount,
            avgPrice: tokenPortfolio.avgPrice,
            currentPrice: currentTokenPrice,
            costBasis: costBasis,
            revenue: usdValue,
            realizedPnL: realizedPnL
        });

        // Portföyü güncelle
        tokenPortfolio.amount -= tokenAmount;
        tokenPortfolio.totalSold += usdValue;

        // Eğer tüm tokenlar satıldıysa average price'ı sıfırla
        if (tokenPortfolio.amount === 0) {
            tokenPortfolio.avgPrice = 0;
        }

        // SOL bakiyesine net geliri ekle
        demoPortfolio.SOL.amount += netSolRevenue;

        // Realize edilen PnL'yi güncelle
        totalRealizedPnL += realizedPnL;

        // Trade history
        tradeHistory.push({
            type: 'SELL',
            tokenSymbol: currentTokenSymbol,
            tokenCA: getTokenCAFromURL(),
            tokenAmount: tokenAmount,
            tokenPrice: currentTokenPrice,
            solAmount: netSolRevenue,
            usdValue: usdValue,
            realizedPnL: realizedPnL,
            timestamp: new Date()
        });

        totalTradeVolume += usdValue;

        // Local storage'a kaydet
        savePortfolioToStorage();

        calculatePnL();
        updateDemoPanelValues();
        updatePnLDisplay();

        const pnlPercent = costBasis > 0 ? (realizedPnL / costBasis) * 100 : 0;
        const pnlText = realizedPnL >= 0 ?
              `Profit: +$${realizedPnL.toFixed(2)} (${pnlPercent.toFixed(2)}%)` :
        `Loss: -$${Math.abs(realizedPnL).toFixed(2)} (${Math.abs(pnlPercent).toFixed(2)}%)`;

        showDemoNotification(`Sold ${tokenAmount.toFixed(2)} ${currentTokenSymbol} for ${netSolRevenue.toFixed(4)} SOL | ${pnlText}`, 'success');
    }

    function updateDemoPanelValues() {
        const demoPanel = document.querySelector('.demo-trade-panel');
        if (!demoPanel) return;

        const tokenPortfolio = getCurrentTokenPortfolio();

        // Balance hesapla - tüm tokenları dahil et
        let totalBalance = demoPortfolio.SOL.amount * currentSolPrice;
        Object.keys(demoPortfolio).forEach(key => {
            if (key !== 'SOL') {
                const token = demoPortfolio[key];
                // Geçerli token fiyatını kullan (sadece aktif token için currentTokenPrice var)
                const tokenPrice = (key === getTokenCAFromURL()) ? currentTokenPrice : (token.avgPrice || 0);
                totalBalance += token.amount * tokenPrice;
            }
        });

        demoBalance = totalBalance;

        // Token görüntülerini güncelle
        const buyTokenDisplay = demoPanel.querySelector('.instant-trade-token-selector-buy + .flex.items-center .VHD_xh__dex');
        const sellTokenDisplay = demoPanel.querySelector('.instant-trade-token-selector-sell + .flex.items-center .VHD_xh__dex');
        const sellTokenSymbol = demoPanel.querySelector('.instant-trade-token-selector-sell .UE7t1T__dex');
        const sellTokenImage = demoPanel.querySelector('.instant-trade-token-selector-sell + .flex.items-center img');

        if (buyTokenDisplay) buyTokenDisplay.textContent = demoPortfolio.SOL.amount.toFixed(4);
        if (sellTokenDisplay) sellTokenDisplay.textContent = tokenPortfolio.amount.toFixed(4);
        if (sellTokenSymbol) sellTokenSymbol.textContent = currentTokenSymbol;
        if (sellTokenImage) {
            sellTokenImage.src = currentTokenImage || tokenPortfolio.image || 'https://web3.okx.com/cdn/web3/currency/token/large/501-FM6ZsWmVFA41D72NNNTk35ZrUSg2wkCerSNzg7Wjpump-108/type=default_90_0?v=1759520281357';
            sellTokenImage.srcset = `${currentTokenImage || tokenPortfolio.image || 'https://web3.okx.com/cdn/web3/currency/token/large/501-FM6ZsWmVFA41D72NNNTk35ZrUSg2wkCerSNzg7Wjpump-108/type=default_90_0?v=1759520281357'}&amp;x-oss-process=image/format,webp/ignore-error,1`;
        }

        // PnL değerlerini güncelle
        updatePnLDisplay();

        // Dropdown içeriklerini güncelle
        setupDropdowns();
    }

    function updatePnLDisplay() {
        const demoPanel = document.querySelector('.demo-trade-panel');
        if (!demoPanel) return;

        const tokenPortfolio = getCurrentTokenPortfolio();

        // Token miktarını hesapla
        const tokenBalance = tokenPortfolio.amount;

        // Fiat değerleri hesapla
        const boughtFiat = boughtAmount;
        const soldFiat = soldAmount;
        const balanceFiat = balanceAmount;
        const tpnlFiat = tpnlAmount;

        // Token değerleri hesapla - DÜZELTİLDİ
        const boughtToken = currentTokenPrice > 0 ? boughtAmount / currentTokenPrice : 0;
        const soldToken = currentTokenPrice > 0 ? soldAmount / currentTokenPrice : 0;
        const balanceToken = tokenBalance; // Balance zaten token miktarı
        const tpnlToken = currentTokenPrice > 0 ? tpnlAmount / currentTokenPrice : 0;

        // PnL değerlerini güncelle - DÜZELTİLDİ
        const boughtElement = demoPanel.querySelector('.demo-pnl-bought');
        const soldElement = demoPanel.querySelector('.demo-pnl-sold');
        const balanceElement = demoPanel.querySelector('.demo-pnl-balance');
        const tpnlElement = demoPanel.querySelector('.demo-pnl-tpnl');
        const currencyIcon = demoPanel.querySelector('.demo-currency-toggle i');

        if (boughtElement) {
            if (showFiat) {
                boughtElement.textContent = formatNumber(boughtFiat, true);
            } else {
                boughtElement.textContent = formatNumber(boughtToken, false) + (boughtToken !== 0 ? ' ' + currentTokenSymbol : '');
            }
        }
        if (soldElement) {
            if (showFiat) {
                soldElement.textContent = formatNumber(soldFiat, true);
            } else {
                soldElement.textContent = formatNumber(soldToken, false) + (soldToken !== 0 ? ' ' + currentTokenSymbol : '');
            }
        }
        if (balanceElement) {
            if (showFiat) {
                balanceElement.textContent = formatNumber(balanceFiat, true);
            } else {
                balanceElement.textContent = formatNumber(balanceToken, false) + (balanceToken !== 0 ? ' ' + currentTokenSymbol : '');
            }
        }
        if (tpnlElement) {
            if (showFiat) {
                tpnlElement.textContent = formatNumber(tpnlAmount, true);
            } else {
                tpnlElement.textContent = formatNumber(tpnlToken, false) + (tpnlToken !== 0 ? ' ' + currentTokenSymbol : '');
            }
            tpnlElement.style.color = tpnlAmount >= 0 ? '#00a86b' : '#ff4444';
        }
        if (currencyIcon) {
            currencyIcon.className = `icon iconfont ${showFiat ? 'dex-okds-usd' : 'dex-okx-defi-dex-token'} rrglRU__dex`;
        }
    }

    function showDemoNotification(message, type = 'info') {
        // Mevcut bildirim container'ını bul veya oluştur
        let notificationContainer = document.querySelector('.dex-notification-container');
        if (!notificationContainer) {
            notificationContainer = document.createElement('div');
            notificationContainer.className = 'dex-notification-container';
            notificationContainer.style.cssText = `
            position: fixed;
top: 80px;
left: 50%;
transform: translateX(-50%);
                      z-index: 10000;
                      display: flex;
                      flex-direction: column;
                      align-items: center;
                      gap: 4px;
                      max-width: 400px;
                      width: 100%;
                      `;
            document.body.appendChild(notificationContainer);

            // CSS animasyonlarını ekle
            addNotificationStyles();
        }

        // Maksimum bildirim sayısı kontrolü (2'den fazla ise en eski bildirimleri temizle)
        const currentNotifications = notificationContainer.querySelectorAll('.dex-notification-box');
        if (currentNotifications.length >= 2) {
            // 2'den fazla varsa, fazla olanları hızlıca temizle
            const notificationsToRemove = Array.from(currentNotifications).slice(0, currentNotifications.length - 1);

            notificationsToRemove.forEach((notification, index) => {
                // Stagger effect - her birini biraz gecikmeli kaldır
                setTimeout(() => {
                    notification.style.animation = 'quickFadeOut 0.3s ease-out forwards';
                    setTimeout(() => {
                        if (notification.parentNode) {
                            notification.parentNode.removeChild(notification);
                        }
                    }, 300);
                }, index * 80); // 80ms gecikme ile sırayla
            });
        }

        // Bildirim ID'si oluştur
        const notificationId = 'demo-notification-' + Date.now();

        // Tip'e göre stil ve icon belirle
        let iconClass, boxClass, iconLabel;
        switch(type) {
            case 'error':
                iconClass = 'dex-okds-fail-circle-fill';
                boxClass = 'error';
                iconLabel = 'Error';
                break;
            case 'success':
                iconClass = 'dex-okds-success-circle-fill';
                boxClass = 'success';
                iconLabel = 'Success';
                break;
            case 'warning':
                iconClass = 'dex-okds-warning-circle-fill';
                boxClass = 'warning';
                iconLabel = 'Warning';
                break;
            case 'info':
            default:
                iconClass = 'dex-okds-info-circle-fill';
                boxClass = 'info';
                iconLabel = 'Info';
                break;
        }

        // Bildirim HTML'i oluştur
        const notificationHTML = `
        <div class="dex-notification-var dex-notification-box ${boxClass} auto-width"
                                  id="${notificationId}"
                                  role="alert"
                                  aria-live="polite"
                                  style="animation: lightSlideIn 0.4s ease-out;">
                                  <span class="dex-notification-icon-circle-container">
                                  <i class="icon iconfont dex-notification-icon-new ${iconClass}"
                                  role="img"
                                  aria-label="${iconLabel}"></i>
                                  </span>
                                  <div class="dex-notification-content">
                                  <div class="dex-notification-title-box">
                                  <span class="dex-notification-title">${message}</span>
</div>
</div>
</div>
`;

        // Bildirimi container'a EKLE (üste değil, alta ekleyeceğiz)
        notificationContainer.insertAdjacentHTML('beforeend', notificationHTML);

        // 4 saniye sonra bildirimi kaldır
        setTimeout(() => {
            const notification = document.getElementById(notificationId);
            if (notification) {
                notification.style.animation = 'lightSlideOut 0.35s ease-in forwards';
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.parentNode.removeChild(notification);
                    }
                }, 350);
            }
        }, 4000);
    }

    // CSS animasyonlarını ekleyen fonksiyon
    function addNotificationStyles() {
        if (document.querySelector('#notification-styles')) return;

        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
        @keyframes lightSlideIn {
            0% {
                transform: translateY(-15px);
                opacity: 0;
                scale: 0.98;
            }
            70% {
                transform: translateY(-5px);
                opacity: 0.8;
                scale: 0.99;
            }
            100% {
                transform: translateY(0);
                opacity: 1;
                scale: 1;
            }
        }

@keyframes lightSlideOut {
    0% {
        transform: translateY(0);
        opacity: 1;
        scale: 1;
    }
    100% {
        transform: translateY(-15px);
        opacity: 0;
        scale: 0.98;
    }
}

@keyframes quickFadeOut {
    0% {
        transform: translateY(0);
        opacity: 1;
    }
    100% {
        transform: translateY(-10px);
        opacity: 0;
    }
}

.dex-notification-box {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    will-change: transform, opacity;
}

.dex-notification-container {
    transition: all 0.3s ease-in-out;
}

/* Daha hafif geçişler */
.dex-notification-box.shifting {
    transition: transform 0.25s ease-out;
}
`;
        document.head.appendChild(style);
    }

    function setupDemoMode() {
        console.log('Demo trading mode initialized');
    }

    // Sayfa yüklendiğinde başlat
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initDemoTrading);
    } else {
        initDemoTrading();
    }

    // URL değişikliklerini dinle (SPA'lar için)
    let lastUrl = location.href;
    new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            console.log('URL changed, reinitializing demo trading...');
            setTimeout(initDemoTrading, 1000);
        }
    }).observe(document, { subtree: true, childList: true });

})();