// ==UserScript==
// @name         Web3 Okx RugCheck Addon
// @namespace    http://tampermonkey.net/
// @version      1.22
// @description  Addon For RugCheck.xyz Analyzes For SOL
// @author       mamiis
// @match        https://web3.okx.com/token/solana/*
// @grant        GM_xmlhttpRequest
// @connect      api.rugcheck.xyz
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/551182/Web3%20Okx%20RugCheck%20Addon.user.js
// @updateURL https://update.greasyfork.org/scripts/551182/Web3%20Okx%20RugCheck%20Addon.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let refreshInterval;
    let currentTokenCA = null;
    let initializationAttempts = 0;
    const MAX_INIT_ATTEMPTS = 10;
    let lastLPLockedValue = null; // LP Locked değerini saklamak için
    let isFirstLoad = true; // İlk yüklemeyi kontrol etmek için

    function fixInfoSpacing() {
        const infoDiv = document.querySelector('[aria-labelledby=":rdu:-info"]');
        if (infoDiv) {
            infoDiv.style.margin = "0";
            infoDiv.style.padding = "0";
        }
    }

    const API_BASE = "https://api.rugcheck.xyz/v1";

    // Token CA'yı URL'den al
    function getTokenCAFromURL() {
        const url = window.location.href;
        const match = url.match(/\/token\/solana\/([^\/?]+)/);
        return match ? match[1] : null;
    }

    // RugCheck API'den token raporunu al
    function getTokenReport(tokenCA) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: `${API_BASE}/tokens/${tokenCA}/report/summary`,
                onload: function(response) {
                    console.log('RugCheck API Response Status:', response.status);
                    console.log('RugCheck API Response:', response.responseText);

                    if (response.status === 200) {
                        try {
                            const data = JSON.parse(response.responseText);
                            console.log('RugCheck Data Received:', data);
                            resolve(data);
                        } catch (e) {
                            console.error('JSON Parse Error:', e);
                            reject(e);
                        }
                    } else {
                        console.error('API Error Status:', response.status);
                        reject(new Error(`API error: ${response.status}`));
                    }
                },
                onerror: function(error) {
                    console.error('API Request Error:', error);
                    reject(error);
                }
            });
        });
    }

    // Raw score'u 0-100 arasında normalize et
    function normalizeScore(rawScore, maxRawScore = 20000) {
        if (!rawScore || rawScore <= 0) return 100; // Default safe score

        // Raw score arttıkça güvenlik skoru düşsün (ters orantı)
        const normalized = 100 - (Math.min(rawScore, maxRawScore) / maxRawScore * 100);
        return Math.max(0, Math.min(100, Math.round(normalized)));
    }

    // Risk seviyesine göre renk belirle
    function getRiskColor(score) {
        if (score >= 70) return 'color-up-text'; // Yeşil - Düşük risk
        if (score >= 40) return 'color-warning-text'; // Turuncu - Orta risk
        return 'color-down-text';                // Kırmızı - Yüksek risk
    }

    // Risk seviyesine göre icon belirle
    function getRiskIcon(score) {
        if (score >= 70) return 'dex-okx-defi-dex-topholder';
        if (score >= 40) return 'dex-okx-defi-dex-suspicious';
        return 'dex-okx-defi-dex-dev';
    }

    // Risk seviyesine göre metin
    function getRiskText(score) {
        if (score >= 70) return 'Low';
        if (score >= 40) return 'Medium';
        return 'High';
    }

    // Zamanı formatla (tarih ve saat)
    function formatDateTime() {
        const now = new Date();
        const date = now.toLocaleDateString('tr-TR');
        const time = now.toLocaleTimeString('tr-TR', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
        return `${date} ${time}`;
    }

    // Risk detaylarını göster/gizle
    function toggleRiskDetails() {
        const detailsContainer = document.querySelector('.risk-details-container');
        if (detailsContainer) {
            const isHidden = detailsContainer.style.display === 'none';
            detailsContainer.style.display = isHidden ? 'block' : 'none';

            // Ok iconunu güncelle
            const arrowIcon = document.querySelector('.risk-details-arrow');
            if (arrowIcon) {
                arrowIcon.className = isHidden ?
                    'icon iconfont E3QMRY__dex dex-okds-arrow-chevron-down-centered-xs ml-2 risk-details-arrow' :
                'icon iconfont E3QMRY__dex dex-okds-arrow-chevron-right-centered-xs ml-2 risk-details-arrow';
            }
        }
    }

    // Sayfanın hazır olup olmadığını kontrol et
    function isPageReady() {
        // Token detay container'ını kontrol et
        const tokenDetailContainer = document.querySelector('.fspG_T__dex.dd-module');
        if (!tokenDetailContainer) {
            console.log('Token detail container not found');
            return false;
        }

        // Tab container'ını kontrol et
        const tabContainer = findTabContainer();
        if (!tabContainer) {
            console.log('Tab container not found');
            return false;
        }

        // En az bir tab olmalı
        const tabs = tabContainer.querySelectorAll('.dex-tabs-pane[data-pane-id]');
        if (tabs.length === 0) {
            console.log('No tabs found');
            return false;
        }

        // Content container'ını kontrol et
        const contentContainer = findContentContainer();
        if (!contentContainer) {
            console.log('Content container not found');
            return false;
        }

        console.log('Page is ready for RugCheck integration');
        return true;
    }

    // Tab container'ını bul
    function findTabContainer() {
        const tokenDetailContainer = document.querySelector('.fspG_T__dex.dd-module');
        if (!tokenDetailContainer) return null;

        const tabContainer = tokenDetailContainer.querySelector('.dex-tabs-pane-list-container .dex-tabs-pane-list-flex-shrink');
        return tabContainer;
    }

    // Ana içerik container'ını bul
    function findContentContainer() {
        const tokenDetailContainer = document.querySelector('.fspG_T__dex.dd-module');
        if (!tokenDetailContainer) return null;

        const panelContainer = tokenDetailContainer.querySelector('.dex-tabs-panel-list') ||
              tokenDetailContainer.querySelector('.dex-tabs-content');
        return panelContainer;
    }

    // Tüm orijinal panelleri bul
    function findAllOriginalPanels() {
        const tokenDetailContainer = document.querySelector('.fspG_T__dex.dd-module');
        if (!tokenDetailContainer) return [];

        const panels = tokenDetailContainer.querySelectorAll('.dex-tabs-panel, [role="tabpanel"]');
        return Array.from(panels);
    }

    // Tüm tab'ları deaktive et (sadece belirtilen tab aktif)
    function activateOnlyTab(activeTab) {
        const tabContainer = findTabContainer();
        if (!tabContainer) return;

        const allTabs = tabContainer.querySelectorAll('.dex-tabs-pane[data-pane-id]');
        allTabs.forEach(tab => {
            if (tab === activeTab) {
                tab.setAttribute('aria-selected', 'true');
                tab.setAttribute('tabindex', '0');
                tab.classList.add('dex-tabs-pane-underline-active');
            } else {
                tab.setAttribute('aria-selected', 'false');
                tab.setAttribute('tabindex', '-1');
                tab.classList.remove('dex-tabs-pane-underline-active');
            }
        });
    }

    // RugCheck tab'ını ekle
    function addRugCheckTab() {
        const tabContainer = findTabContainer();
        if (!tabContainer) {
            console.log('Tab container not found!');
            return false;
        }

        // Önceki RugCheck tab'ını temizle
        const existingRugCheckTab = tabContainer.querySelector('[data-pane-id="rugcheck"]');
        if (existingRugCheckTab) existingRugCheckTab.remove();

        // Mevcut tab'ları bul
        const tabs = Array.from(tabContainer.children);
        const infoTabIndex = tabs.findIndex(tab =>
                                            tab.textContent.includes('Info') ||
                                            tab.getAttribute('data-pane-id') === 'info'
                                           );

        const devTokensTabIndex = tabs.findIndex(tab =>
                                                 tab.textContent.includes('Dev Tokens') ||
                                                 tab.getAttribute('data-pane-id') === 'devTokens'
                                                );

        console.log('Found tabs:', {
            infoTabIndex,
            devTokensTabIndex,
            tabs: tabs.map(t => t.textContent)
        });

        // RugCheck tab'ını oluştur
        const rugCheckTab = document.createElement('div');
        rugCheckTab.className = 'dex-tabs-pane dex-tabs-pane-spacing dex-tabs-pane-md dex-tabs-pane-blue dex-tabs-pane-underline no-active-border dex-tabs-pane-no-padding';
        rugCheckTab.setAttribute('data-pane-id', 'rugcheck');
        rugCheckTab.setAttribute('role', 'tab');
        rugCheckTab.setAttribute('aria-selected', 'false');
        rugCheckTab.setAttribute('tabindex', '-1');
        rugCheckTab.style.setProperty('--dex-okd-inner-tabs-spacing', '16px');
        rugCheckTab.textContent = 'RugCheck';

        // Ekleme stratejisini belirle
        let insertionIndex = tabs.length;

        if (infoTabIndex !== -1 && devTokensTabIndex !== -1) {
            insertionIndex = infoTabIndex + 1;
        } else if (infoTabIndex !== -1) {
            insertionIndex = infoTabIndex + 1;
        } else if (devTokensTabIndex !== -1) {
            insertionIndex = devTokensTabIndex;
        }

        // Tab'ı ekle
        if (insertionIndex < tabs.length) {
            const referenceTab = tabs[insertionIndex];
            tabContainer.insertBefore(rugCheckTab, referenceTab);
        } else {
            tabContainer.appendChild(rugCheckTab);
        }

        console.log('RugCheck tab added at position:', insertionIndex);
        return rugCheckTab;
    }

    // RugCheck içerik panelini oluştur
    function createRugCheckPanel() {
        const contentContainer = findContentContainer();
        if (!contentContainer) {
            console.log('Content container not found!');
            return null;
        }

        // Önceki RugCheck panelini temizle
        const existingRugCheckPanel = document.getElementById('rugcheck-panel');
        if (existingRugCheckPanel) existingRugCheckPanel.remove();

        // RugCheck panelini oluştur
        const rugCheckPanel = document.createElement('div');
        rugCheckPanel.id = 'rugcheck-panel';
        rugCheckPanel.className = 'dex-tabs-panel';
        rugCheckPanel.setAttribute('data-panel-id', 'rugcheck');
        rugCheckPanel.setAttribute('role', 'tabpanel');
        rugCheckPanel.setAttribute('aria-hidden', 'true');
        rugCheckPanel.style.display = 'none';

        // Orijinal panellerle aynı stil
        rugCheckPanel.style.position = 'relative';
        rugCheckPanel.style.width = '100%';
        rugCheckPanel.style.height = 'auto';
        rugCheckPanel.style.minHeight = 'auto';
        rugCheckPanel.style.padding = '0';
        rugCheckPanel.style.margin = '0';
        rugCheckPanel.style.overflow = 'visible';

        const rugCheckPanelContent = document.createElement('div');
        rugCheckPanelContent.className = 'rugcheck-panel-content';
        rugCheckPanelContent.style.width = '100%';
        rugCheckPanelContent.style.height = '100%';
        rugCheckPanelContent.style.padding = '0';
        rugCheckPanelContent.style.margin = '0';

        rugCheckPanel.appendChild(rugCheckPanelContent);

        // Panel container'a ekle
        contentContainer.appendChild(rugCheckPanel);

        return rugCheckPanel;
    }

    // Basit tab yöneticisi
    function setupTabManager(rugCheckTab, rugCheckPanel) {
        if (!rugCheckTab || !rugCheckPanel) return;

        const tabContainer = findTabContainer();
        if (!tabContainer) return;

        // RugCheck tab'ına click event'i
        rugCheckTab.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();

            console.log('RugCheck tab clicked');

            // Tüm orijinal panelleri gizle
            const originalPanels = findAllOriginalPanels();
            originalPanels.forEach(panel => {
                panel.style.display = 'none';
            });

            // RugCheck panelini göster
            rugCheckPanel.style.display = 'block';

            // Sadece RugCheck tab'ını aktif et
            activateOnlyTab(this);
        });

        // Orijinal tab'ların click'lerini dinle
        const originalTabs = tabContainer.querySelectorAll('.dex-tabs-pane[data-pane-id]:not([data-pane-id="rugcheck"])');

        originalTabs.forEach(tab => {
            tab.addEventListener('click', function() {
                console.log('Original tab clicked:', this.getAttribute('data-pane-id'));

                // RugCheck panelini gizle
                rugCheckPanel.style.display = 'none';

                // Tıklanan tab'ı aktif et
                activateOnlyTab(this);

                // Orijinal panelleri OKX'e bırak - onlar kendi panellerini göstersin
                const originalPanels = findAllOriginalPanels();
                originalPanels.forEach(panel => {
                    panel.style.display = '';
                });
            });
        });

        console.log('Tab manager setup completed');
    }

    // LP Locked değerini işle - 0% olmasını önle
    function processLPLocked(lpLocked, isFirstLoad = false) {
        // İlk yüklemede ve LP Locked null/0 ise "Loading..." göster
        if (isFirstLoad && (lpLocked === 0 || lpLocked === null)) {
            console.log('First load - LP Locked not available, showing Loading...');
            return null; // null döndürerek "Loading..." gösterilsin
        }

        // Sonraki güncellemelerde 0 veya null ise önceki değeri kullan
        if ((lpLocked === 0 || lpLocked === null) && lastLPLockedValue !== null) {
            console.log('LP Locked 0% detected, using previous value:', lastLPLockedValue);
            return lastLPLockedValue;
        }

        // Yeni değer geçerliyse kaydet ve döndür
        if (lpLocked !== null && lpLocked > 0) {
            lastLPLockedValue = lpLocked;
            console.log('LP Locked value updated:', lpLocked);
        }

        return lpLocked;
    }

    // Otomatik yenilemeyi başlat
    function startAutoRefresh(rugCheckPanel) {
        // Önceki interval'i temizle
        if (refreshInterval) {
            clearInterval(refreshInterval);
        }

        // 10 saniyede bir yenile
        refreshInterval = setInterval(async () => {
            const tokenCA = getTokenCAFromURL();
            if (!tokenCA) return;

            console.log('Auto-refreshing RugCheck data...');

            try {
                const rugCheckData = await getTokenReport(tokenCA);
                if (rugCheckData && typeof rugCheckData === 'object') {
                    // Artık ilk yükleme değil
                    isFirstLoad = false;
                    displayRugCheckData(rugCheckData, rugCheckPanel, false);
                }
            } catch (error) {
                console.error('Auto-refresh error:', error);
            }
        }, 10000); // 10 saniye

        console.log('Auto-refresh started (10 seconds interval)');
    }

    // Otomatik yenilemeyi durdur
    function stopAutoRefresh() {
        if (refreshInterval) {
            clearInterval(refreshInterval);
            refreshInterval = null;
            console.log('Auto-refresh stopped');
        }
    }

    // RugCheck verilerini göster
    function displayRugCheckData(data, rugCheckPanel, isFirstLoad = true) {
        if (!rugCheckPanel) return;

        const rugCheckPanelContent = rugCheckPanel.querySelector('.rugcheck-panel-content');
        if (!rugCheckPanelContent) return;

        // API'den gelen verileri işle
        const rawScore = data.score || 0;
        const normalizedScore = normalizeScore(rawScore);

        // LP Locked değerini işle (0% sorununu çöz)
        const rawLPLocked = data.lpLockedPct !== undefined ? data.lpLockedPct : null;
        const lpLocked = processLPLocked(rawLPLocked, isFirstLoad);

        const risks = data.risks || [];
        const riskCount = risks.length;
        const tokenCA = getTokenCAFromURL();
        const rugCheckLink = `https://rugcheck.xyz/tokens/${tokenCA}`;
        const shortTokenCA = tokenCA ? tokenCA.substring(0, 4) + '...' : '';
        const currentTime = formatDateTime();

        // LP Locked değeri için loading durumu
        const lpLockedDisplay = lpLocked !== null ? `${lpLocked.toFixed(1)}%` : 'Loading...';
        const lpLockedColor = lpLocked !== null ?
              (lpLocked > 99 ? '#02c076' : lpLocked >= 90 ? '#f0b90b' : '#f6465d') :
        '#a0a3bd'; // Loading durumunda gri renk
        const lpLockedIconColor = lpLocked !== null ?
              (lpLocked > 99 ? '#02c076' : lpLocked >= 90 ? '#f0b90b' : '#f6465d') :
        '#a0a3bd';

        const rugCheckHTML = `
        <div class="M5ncoe__dex" style="margin: 0; padding: 0; width: 100%;">
            <div class="nu1mxy__dex" style="padding: 12px 0px; margin: 0;">
                <a href="${rugCheckLink}" target="_blank" style="text-decoration: none; color: #02c076; border-bottom: 1px solid #02c076;" class="nIsAL2__dex">
                    rugcheck.xyz/${shortTokenCA}
                </a>
                <div class="kZenMT__dex u995Ri__dex">
                    <div class="ellipsis">Real-time risk assessment from RugCheck.xyz</div>
                </div>
            </div>
            <div class="QNCzxe__dex" style="padding: 0 0px; margin: 0;">
                <!-- Security Score -->
                <div class="n96nAX__dex">
                    <div class="ywu7Bt__dex">
                        <div class="zXEH2m__dex">Security Score</div>
                        <div class="DP2brR__dex">
                            <div class="flex items-center">
                                <i class="icon iconfont E3QMRY__dex ${getRiskIcon(normalizedScore)} mr-2" style="font-size: 14px; ${normalizedScore >= 80 ? 'color: #02c076;' : normalizedScore >= 50 ? 'color: #f0b90b;' : 'color: #f6465d;'}" role="img" aria-hidden="true"></i>
                                <span style="${normalizedScore >= 80 ? 'color: #02c076;' : normalizedScore >= 50 ? 'color: #f0b90b;' : 'color: #f6465d;'}">${normalizedScore}/100</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Risk Level -->
                <div class="cZ60GF__dex">
                    <div class="ywu7Bt__dex">
                        <div class="zXEH2m__dex">Risk Level</div>
                        <div class="DP2brR__dex">
                            <div class="flex items-center">
                                <i class="icon iconfont E3QMRY__dex ${getRiskIcon(normalizedScore)} mr-2" style="font-size: 14px; ${normalizedScore >= 80 ? 'color: #02c076;' : normalizedScore >= 50 ? 'color: #f0b90b;' : 'color: #f6465d;'}" role="img" aria-hidden="true"></i>
                                <span style="${normalizedScore >= 80 ? 'color: #02c076;' : normalizedScore >= 50 ? 'color: #f0b90b;' : 'color: #f6465d;'}">${getRiskText(normalizedScore)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- LP Locked -->
                <div class="KCMLGf__dex">
                    <div class="ywu7Bt__dex">
                        <div class="zXEH2m__dex">LP Locked</div>
                        <div class="DP2brR__dex">
                            <div class="flex items-center">
                                <i class="icon iconfont E3QMRY__dex dex-okx-defi-dex-bundler mr-2" style="font-size: 14px; color: ${lpLockedIconColor};" role="img" aria-hidden="true"></i>
                                <span style="color: ${lpLockedColor};">${lpLockedDisplay}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Token CA -->
                <div class="Vro60k__dex">
                    <div class="ywu7Bt__dex">
                        <div class="zXEH2m__dex">Token CA</div>
                        <div class="DP2brR__dex">
                            <div class="flex items-center">
                                <i class="icon iconfont E3QMRY__dex dex-okx-defi-dex-suspicious mr-2" style="font-size: 14px; color: #02c076;" role="img" aria-hidden="true"></i>
                                <span style="color: #02c076; font-size: 11px; font-family: monospace;">
                                    ${tokenCA ? tokenCA.substring(0, 6) + '...' + tokenCA.substring(tokenCA.length - 6) : 'Unknown'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Risk Details -->
                <div class="st1Wfc__dex">
                    <div class="ywu7Bt__dex">
                        <div class="zXEH2m__dex">
                            <button type="button" class="dex-plain-button flex items-center cursor-pointer LlFXqT__dex risk-details-btn">
                                Risk Details
                                <i class="icon iconfont E3QMRY__dex dex-okds-arrow-chevron-down-centered-xs ml-2 risk-details-arrow" role="img" aria-hidden="true" style="font-size: 10px;"></i>
                            </button>
                        </div>
                        <div class="DP2brR__dex">
                            <div class="flex items-center">
                                <i class="icon iconfont E3QMRY__dex dex-okx-defi-dex-snipers mr-2" style="font-size: 14px; ${riskCount === 0 ? 'color: #02c076;' : riskCount === 1 ? 'color: #f0b90b;' : 'color: #f6465d;'}" role="img" aria-hidden="true"></i>
                                <span style="${riskCount === 0 ? 'color: #02c076;' : riskCount === 1 ? 'color: #f0b90b;' : 'color: #f6465d;'}">${riskCount} Risk${riskCount !== 1 ? 's' : ''}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Risk Details Container -->
            <div class="risk-details-container" style="display: block; border-top: 1px solid #2a2d3a; padding: 16px 1px 0; margin: 0; margin-top: 16px;">
                <div class="aQxyB2__dex" style="display: flex; flex-direction: column; gap: 7px; margin: 0; padding: 0;">
                    ${risks.length > 0 ? risks.map(risk => `
                        <div class="Xt_c_D__dex" style="margin: 0;">
                            <div class="dex dex-popup-var dex-popup dex-tooltip dex-tooltip-var dex-tooltip-neutral _SiYo2__dex" style="white-space: normal; line-height: 1.3; word-wrap: break-word; color: ${risk.level === 'warn' ? '#f0b90b' : '#f6465d'}; font-size: 13px; margin-bottom: 4px;">
                                ${risk.name || 'Unknown Risk'}
                            </div>
                            <div class="CS2o3N__dex">
                                <div class="kZenMT__dex" style="width: auto; overflow: hidden;">
                                    <div style="color: #a0a3bd; white-space: normal; line-height: 1.3; word-wrap: break-word; font-size: 11px; text-align: right;">
                                        ${risk.description || 'No description available'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    `).join('') : `
                        <div class="Xt_c_D__dex" style="margin: 0;">
                            <div class="dex dex-popup-var dex-popup dex-tooltip dex-tooltip-var dex-tooltip-neutral _SiYo2__dex" style="white-space: normal; line-height: 1.3; word-wrap: break-word; color: #02c076; font-size: 13px; margin-bottom: 4px;">
                                No Risks Detected
                            </div>
                            <div class="CS2o3N__dex">
                                <div class="kZenMT__dex" style="width: auto; overflow: hidden;">
                                    <div style="color: #a0a3bd; white-space: normal; line-height: 1.3; word-wrap: break-word; font-size: 11px; text-align: right;">
                                        This token appears to be safe based on RugCheck analysis.
                                    </div>
                                </div>
                            </div>
                        </div>
                    `}

                    <!-- Analysis Time -->
                    <div class="Xt_c_D__dex" style="margin: 0; padding-top: 10px; border-top: 1px solid #2a2d3a;">
                        <div class="dex dex-popup-var dex-popup dex-tooltip dex-tooltip-var dex-tooltip-neutral _SiYo2__dex" style="white-space: normal; line-height: 1.3; font-size: 13px;">Last Update (10 Sec)</div>
                        <div class="CS2o3N__dex">
                            <div class="kZenMT__dex" style="width: auto; overflow: hidden;">
                                <div style="color: #a0a3bd; font-size: 11px; text-align: right;">${currentTime}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    rugCheckPanelContent.innerHTML = rugCheckHTML;

    // Risk Details butonuna click event'i ekle
    const riskDetailsBtn = rugCheckPanelContent.querySelector('.risk-details-btn');
    if (riskDetailsBtn) {
        riskDetailsBtn.addEventListener('click', toggleRiskDetails);
    }

    console.log('RugCheck panel content updated successfully!');
}

    // Hata mesajını göster
    function displayError(message, rugCheckPanel) {
        if (!rugCheckPanel) return;

        const rugCheckPanelContent = rugCheckPanel.querySelector('.rugcheck-panel-content');
        if (!rugCheckPanelContent) return;

        const errorHTML = `
            <div class="M5ncoe__dex" style="margin: 0; padding: 0; width: 100%;">
                <div class="nu1mxy__dex" style="padding: 12px 16px; margin: 0;">
                    <div class="nIsAL2__dex">RugCheck Analysis</div>
                    <div class="kZenMT__dex u995Ri__dex">
                        <div class="ellipsis" style="color: #f6465d;">${message}</div>
                    </div>
                </div>
            </div>
        `;

        rugCheckPanelContent.innerHTML = errorHTML;
    }

    // Sayfa yüklendiğinde çalıştır
    async function init() {
        initializationAttempts++;
        console.log(`=== RugCheck Script Initialization Attempt ${initializationAttempts} ===`);

        fixInfoSpacing();

        // Sayfanın hazır olup olmadığını kontrol et
        if (!isPageReady()) {
            if (initializationAttempts < MAX_INIT_ATTEMPTS) {
                console.log(`Page not ready, retrying in 2 seconds... (${initializationAttempts}/${MAX_INIT_ATTEMPTS})`);
                setTimeout(init, 2000);
                return;
            } else {
                console.log('Max initialization attempts reached, giving up.');
                return;
            }
        }

        console.log('Page is ready, proceeding with RugCheck integration...');

        const tokenCA = getTokenCAFromURL();

        // Token değiştiyse veya ilk yükleme ise
        if (tokenCA !== currentTokenCA) {
            currentTokenCA = tokenCA;
            lastLPLockedValue = null; // Yeni token için LP Locked değerini sıfırla
            isFirstLoad = true; // Yeni token için ilk yükleme bayrağını aç

            // Önceki yenilemeyi durdur
            stopAutoRefresh();

            // RugCheck tab'ını ekle
            const rugCheckTab = addRugCheckTab();
            if (!rugCheckTab) {
                console.log('Failed to add RugCheck tab');
                return;
            }

            // RugCheck panelini oluştur
            const rugCheckPanel = createRugCheckPanel();
            if (!rugCheckPanel) {
                console.log('Failed to create RugCheck panel');
                return;
            }

            // Basit tab yöneticisini kur
            setupTabManager(rugCheckTab, rugCheckPanel);

            if (!tokenCA) {
                console.log('No valid Token CA found');
                displayError('Token address not found in URL', rugCheckPanel);
                return;
            }

            console.log('Fetching RugCheck data for:', tokenCA);

            try {
                const rugCheckData = await getTokenReport(tokenCA);
                if (rugCheckData && typeof rugCheckData === 'object') {
                    // İlk yükleme olduğunu belirt
                    displayRugCheckData(rugCheckData, rugCheckPanel, true);
                    // Otomatik yenilemeyi başlat
                    startAutoRefresh(rugCheckPanel);
                    console.log('RugCheck integration completed successfully!');
                } else {
                    console.error('Invalid data received:', rugCheckData);
                    displayError('Invalid data received from RugCheck API', rugCheckPanel);
                }
            } catch (error) {
                console.error('RugCheck Error:', error);
                displayError(error.message || 'Failed to fetch RugCheck data', rugCheckPanel);
            }
        }

        // Başarılı oldu, attempt counter'ı sıfırla
        initializationAttempts = 0;
    }

    // URL değişikliklerini dinle
    let currentURL = window.location.href;
    const observer = new MutationObserver(() => {
        if (window.location.href !== currentURL) {
            currentURL = window.location.href;
            console.log('URL changed, reinitializing...');
            initializationAttempts = 0; // Reset attempts for new page
            setTimeout(init, 2000);
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // İlk yükleme - sayfa tam yüklenene kadar bekle
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            setTimeout(init, 3000); // DOM yüklendikten sonra 3 saniye bekle
        });
    } else {
        setTimeout(init, 3000); // Zaten yüklendiyse 3 saniye bekle
    }

    console.log('RugCheck script loaded successfully! Waiting for page to be ready...');
})();