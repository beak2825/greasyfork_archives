// ==UserScript==
// @license MIT
// @name         Monitor Opinii Allegro
// @namespace    http://tampermonkey.net/
// @version      2.0.3
// @description  Pobieranie negatywnych ocen Allegro + integracja z Google Sheets
// @author       CEDAR
// @match        https://allegro.pl/*
// @match        https://edge.allegro.pl/*
// @grant        GM_xmlhttpRequest
// @grant        GM_notification
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @connect      edge.allegro.pl
// @connect      allegro.pl
// @connect      api.allegro.pl
// @connect      *.allegro.pl
// @connect      script.google.com
// @connect      script.googleusercontent.com
// @connect      generativelanguage.googleapis.com
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/556145/Monitor%20Opinii%20Allegro.user.js
// @updateURL https://update.greasyfork.org/scripts/556145/Monitor%20Opinii%20Allegro.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ==================== KONFIGURACJA ====================
    const CONFIG = {
        VERSION: '1.3.0',
        GOOGLE_SHEETS: {
            // Stały URL Web App - zaktualizuj po wdrożeniu Apps Script
            WEB_APP_URL: 'https://script.google.com/macros/s/AKfycbxipmw9-qXXELvmsY0E69bRT-XuxhVIJ4ohBI9bD-AEsBRqeWIwRw8s2Vc4QqgYgMwlfA/exec'
            // Przykład: 'https://script.google.com/macros/s/AKfycbx.../exec'
        },
        ALLEGRO: {
            EDGE_API_URL: 'https://edge.allegro.pl',
            API_VERSION: 'v2'
        },
        SELLER_FILTER: {
            ENABLED: true,
            SELLER_LOGIN: 'SmA-Peterson' // Filtruj tylko recenzje od tego sprzedawcy
        },
        GEMINI: {
            // Hardcoded Gemini API key - same as in Apps Script config.gs
            API_KEY: 'AIzaSyDOKU-wl1VgyRSTMm2JLtbf2XjAanFcDMU',
            API_ENDPOINT: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent'
        }
    };

    // ==================== ZARZĄDZANIE STANEM ====================
    const STATE = {
        isRunning: false
    };

    /**
     * Ładuje konfigurację z Tampermonkey storage i nadpisuje CONFIG
     */
    function loadConfigFromStorage() {
        try {
            const savedWebAppUrl = GM_getValue('config_web_app_url', null);
            const savedSellerLogin = GM_getValue('config_seller_login', null);
            const savedGeminiKey = GM_getValue('config_gemini_api_key', null);

            if (savedWebAppUrl) {
                CONFIG.GOOGLE_SHEETS.WEB_APP_URL = savedWebAppUrl;
                console.log('✅ Załadowano Web App URL z storage');
            }

            if (savedSellerLogin) {
                CONFIG.SELLER_FILTER.SELLER_LOGIN = savedSellerLogin;
                console.log('✅ Załadowano Seller Login z storage');
            }

            if (savedGeminiKey) {
                CONFIG.GEMINI.API_KEY = savedGeminiKey;
                console.log('✅ Załadowano Gemini API Key z storage');
            }
        } catch (error) {
            console.error('❌ Błąd ładowania konfiguracji z storage:', error);
        }
    }

    // Załaduj konfigurację przy starcie
    loadConfigFromStorage();

    // ==================== FUNKCJE ALLEGRO API ====================

    /**
     * Pobierz recenzje używając natywnego fetch() (fallback gdy GM_xmlhttpRequest nie działa)
     */
    async function getProductReviewsNative(productId, page = 1, rating = null) {
        let url = `${CONFIG.ALLEGRO.EDGE_API_URL}/product-reviews?productId=${productId}&page=${page}&sortBy=NEWEST`;
        if (rating) {
            url += `&rating=${rating}`;
        }

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Accept': `application/vnd.allegro.public.${CONFIG.ALLEGRO.API_VERSION}+json`,
                'Accept-Language': 'pl-PL'
            },
            credentials: 'include' // Użyj ciasteczek
        });

        if (!response.ok) {
            if (response.status === 500) {
                throw new Error(`HTTP 500: Edge API zwróciło błąd serwera dla productId: ${productId}. Produkt może być nieaktywny lub Product ID jest nieprawidłowy.`);
            }
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        return await response.json();
    }

    /**
     * Pobierz recenzje produktu z edge.allegro.pl używając ciasteczek przeglądarki
     * @param {string} productId - UUID produktu
     * @param {number} page - Numer strony (domyślnie 1)
     * @param {number|null} rating - Opcjonalny filtr oceny (1-5), null dla wszystkich
     */
    function getProductReviews(productId, page = 1, rating = null) {
        return new Promise((resolve, reject) => {
            let url = `${CONFIG.ALLEGRO.EDGE_API_URL}/product-reviews?productId=${productId}&page=${page}&sortBy=NEWEST`;
            if (rating) {
                url += `&rating=${rating}`;
            }

            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                headers: {
                    'Accept': `application/vnd.allegro.public.${CONFIG.ALLEGRO.API_VERSION}+json`,
                    'Accept-Language': 'pl-PL',
                    'Content-Type': `application/vnd.allegro.public.${CONFIG.ALLEGRO.API_VERSION}+json`,
                    'Origin': 'https://allegro.pl',
                    'Referer': 'https://allegro.pl/'
                },
                anonymous: false, // KLUCZOWE: Wymusza użycie ciasteczek przeglądarki
                onload: function(response) {
                    if (response.status === 200) {
                        try {
                            const data = JSON.parse(response.responseText);
                            resolve(data);
                        } catch (e) {
                            reject(new Error(`Błąd parsowania JSON: ${e.message}`));
                        }
                    } else if (response.status === 401 || response.status === 403) {
                        reject(new Error(`HTTP ${response.status}: Brak autoryzacji. Musisz być zalogowany na allegro.pl`));
                    } else if (response.status === 404) {
                        reject(new Error(`HTTP 404: Nie znaleziono recenzji dla productId: ${productId}`));
                    } else if (response.status === 500) {
                        reject(new Error(`HTTP 500: Edge API zwróciło błąd serwera dla productId: ${productId}. Produkt może być nieaktywny lub Product ID jest nieprawidłowy.`));
                    } else {
                        reject(new Error(`HTTP ${response.status}: ${response.statusText || 'Nieznany błąd'}`));
                    }
                },
                onerror: async function(error) {
                    console.error('GM_xmlhttpRequest onerror:', error);
                    
                    // Jeśli status 0, spróbuj natywnego fetch() jako fallback
                    if (error.status === 0) {
                        console.warn('⚠️ GM_xmlhttpRequest zablokowany (status 0) - próbuję natywnego fetch()...');
                        try {
                            const data = await getProductReviewsNative(productId, page, rating);
                            console.log('✅ Natywny fetch() zadziałał!');
                            resolve(data);
                            return;
                        } catch (fetchError) {
                            console.error('❌ Natywny fetch() też nie zadziałał:', fetchError);
                            reject(new Error(`Oba metody nie powiodły się:\n1. GM_xmlhttpRequest: Status 0 (zablokowany)\n2. Native fetch: ${fetchError.message}\n\nSprawdź uprawnienia Tampermonkey i czy jesteś zalogowany na allegro.pl`));
                            return;
                        }
                    }
                    
                    reject(new Error(`Błąd sieci: Nie można połączyć z Allegro API (status: ${error.status})`));
                }
            });
        });
    }

    // ==================== BUYER PATTERN MATCHING ====================

    /**
     * Wyodrębnij dane autora recenzji do dopasowania z zamówieniami
     * API zwraca: author.name (zanonimizowane, np. "C...0", "R...s")
     * Pierwsza litera + ostatni znak pozwala filtrować potencjalnych klientów
     */
    function extractReviewAuthorPattern(opinion) {
        const author = opinion.author || {};
        const anonymizedName = author.name || '';

        // Parsuj zanonimizowaną nazwę (np. "C...0", "J...a", "M...k")
        let firstChar = '';
        let lastChar = '';

        if (anonymizedName && anonymizedName.length >= 5) {
            firstChar = anonymizedName[0] || '';
            lastChar = anonymizedName[anonymizedName.length - 1] || '';
        }

        return {
            anonymizedName: anonymizedName,
            firstChar: firstChar.toUpperCase(),
            lastChar: lastChar.toLowerCase(),
            seller: opinion.seller?.login || '',
            reviewId: opinion.id || ''
        };
    }

    /**
     * Sprawdź czy imię i nazwisko klienta pasuje do zanonimizowanej nazwy z recenzji
     * - Jeśli ostatni znak to LITERA → porównuj pierwszą literę imienia + ostatnią literę nazwiska
     * - Jeśli ostatni znak to CYFRA/ZNAK → porównuj tylko pierwszą literę imienia
     */
    function matchesBuyerToReviewPattern(firstName, lastName, firstChar, lastChar) {
        if (!firstName || !firstChar) {
            return { matches: false, reason: 'brak danych' };
        }

        const buyerFirstChar = firstName[0]?.toUpperCase() || '';
        const buyerLastChar = lastName ? lastName[lastName.length - 1]?.toLowerCase() : '';

        // Porównaj pierwszą literę imienia
        const firstMatches = buyerFirstChar === firstChar.toUpperCase();

        if (!firstMatches) {
            return {
                matches: false,
                reason: `imię na "${buyerFirstChar}" ≠ "${firstChar}"`
            };
        }

        // Sprawdź typ ostatniego znaku
        const isLetter = /^[a-zA-Z]$/.test(lastChar);

        if (isLetter) {
            // Ostatni znak to LITERA - porównaj z ostatnią literą nazwiska
            const lastMatches = buyerLastChar === lastChar.toLowerCase();

            if (lastMatches) {
                return {
                    matches: true,
                    reason: `${buyerFirstChar}...${buyerLastChar} ✅`
                };
            } else {
                return {
                    matches: false,
                    reason: `nazwisko na "...${buyerLastChar}" ≠ "...${lastChar}"`
                };
            }
        } else {
            // Ostatni znak to CYFRA lub INNY ZNAK
            return {
                matches: true,
                reason: `imię na "${buyerFirstChar}" ✅ (ostatni znak to cyfra/znak)`
            };
        }
    }

    /**
     * Filtruj listę kupujących na podstawie wzorca z recenzji
     * @param {Array} buyers - Lista kupujących z API zamówień
     * @param {string} anonymizedName - Zanonimizowana nazwa z recenzji (np. "C...0")
     * @returns {Object} - {matching: [], excluded: []}
     */
    function filterBuyersByReviewPattern(buyers, anonymizedName) {
        // Parsuj wzorzec
        let firstChar = '';
        let lastChar = '';

        if (anonymizedName && anonymizedName.length >= 5) {
            firstChar = anonymizedName[0] || '';
            lastChar = anonymizedName[anonymizedName.length - 1] || '';
        }

        if (!firstChar) {
            console.log(`⚠️ Nie można sparsować wzorca: "${anonymizedName}"`);
            return { matching: buyers, excluded: [] };
        }

        console.log(`🔍 Filtrowanie kupujących po wzorcu: "${anonymizedName}" (${firstChar}...${lastChar})`);

        const matchingBuyers = [];
        const excludedBuyers = [];

        for (const buyer of buyers) {
            // Wyodrębnij imię i nazwisko
            let firstName = buyer.firstName || '';
            let lastName = buyer.lastName || '';

            // Jeśli mamy buyerName (pełne imię i nazwisko), podziel
            if (!firstName && !lastName && buyer.buyerName) {
                const parts = buyer.buyerName.trim().split(/\s+/);
                if (parts.length >= 2) {
                    firstName = parts[0];
                    lastName = parts[parts.length - 1];
                } else if (parts.length === 1) {
                    firstName = parts[0];
                    lastName = parts[0];
                }
            }

            const result = matchesBuyerToReviewPattern(firstName, lastName, firstChar, lastChar);

            if (result.matches) {
                matchingBuyers.push({
                    ...buyer,
                    firstName,
                    lastName,
                    matchReason: result.reason
                });
                console.log(`   ✅ PASUJE: ${firstName} ${lastName} → ${result.reason}`);
            } else {
                excludedBuyers.push({
                    ...buyer,
                    firstName,
                    lastName,
                    excludeReason: result.reason
                });
                console.log(`   ❌ WYKLUCZ: ${firstName} ${lastName} → ${result.reason}`);
            }
        }

        console.log(`   📊 Wynik: ${matchingBuyers.length} pasujących, ${excludedBuyers.length} wykluczonych`);

        return {
            matching: matchingBuyers,
            excluded: excludedBuyers
        };
    }

    // ==================== GOOGLE SHEETS API ====================

    /**
     * Wywołaj endpoint Web App (Apps Script)
     */
    function callWebApp(action, data = {}) {
        return new Promise((resolve, reject) => {
            const webAppUrl = CONFIG.GOOGLE_SHEETS.WEB_APP_URL;

            if (!webAppUrl) {
                reject(new Error('URL Web App nie skonfigurowany'));
                return;
            }

            const payload = {
                action: action,
                ...data
            };

            GM_xmlhttpRequest({
                method: 'POST',
                url: webAppUrl,
                headers: {
                    'Content-Type': 'application/json'
                },
                data: JSON.stringify(payload),
                onload: function(response) {
                    // Sprawdź czy otrzymaliśmy HTML zamiast JSON (strona autoryzacji)
                    if (response.responseText.trim().startsWith('<!DOCTYPE') ||
                        response.responseText.trim().startsWith('<html')) {
                        reject(new Error('Web App zwrócił stronę HTML zamiast JSON.\n\nMożliwe przyczyny:\n1. Web App nie jest wdrożony\n2. Ustawienia: "Execute as" ≠ "Me"\n3. Ustawienia: "Who has access" ≠ "Anyone"\n\nKroki naprawy:\n1. Apps Script → Deploy → Manage deployments\n2. Sprawdź ustawienia\n3. Utwórz nowe wdrożenie jeśli potrzeba'));
                        return;
                    }

                    if (response.status === 200) {
                        try {
                            const result = JSON.parse(response.responseText);
                            if (result.success) {
                                resolve(result);
                            } else {
                                reject(new Error(result.error || 'Żądanie Web App nieudane'));
                            }
                        } catch (e) {
                            reject(new Error(`Błąd parsowania JSON: ${e.message}\n\nOtrzymano: ${response.responseText.substring(0, 100)}...`));
                        }
                    } else {
                        let errorMsg = `Błąd Web App: ${response.status}`;
                        try {
                            const errorData = JSON.parse(response.responseText);
                            errorMsg += ` - ${errorData.error || ''}`;
                        } catch (e) {
                            errorMsg += ` - Nie można odczytać błędu`;
                        }
                        reject(new Error(errorMsg));
                    }
                },
                onerror: function(error) {
                    console.error('GM_xmlhttpRequest onerror (Web App):', error);
                    reject(new Error(`Błąd sieci: Nie można połączyć z Google Web App. Sprawdź URL i uprawnienia.`));
                }
            });
        });
    }

    // ==================== PRZETWARZANIE DANYCH ====================

    /**
     * Wyodrębnij ID oferty z adresu URL bieżącej strony
     */
    function getOfferIdFromUrl() {
        const match = window.location.href.match(/\/oferta\/([^/?]+)/);
        return match ? match[1] : null;
    }

    /**
     * Wyodrębnij ID produktu z danych strony
     */
    function getProductIdFromPage() {
        // Próba znalezienia productId w danych Next.js lub stanie okna
        try {
            const nextData = document.getElementById('__NEXT_DATA__');
            if (nextData) {
                const data = JSON.parse(nextData.textContent);
                // Przeszukaj strukturę w poszukiwaniu productId
                // Struktura może się różnić - należy sprawdzić na rzeczywistej stronie
                return data?.props?.pageProps?.product?.id || null;
            }
        } catch (e) {
            console.error('Błąd wyodrębniania productId:', e);
        }
        return null;
    }

    // ==================== KOMPONENTY UI ====================

    /**
     * Wstrzyknij niestandardowe style CSS
     */
    GM_addStyle(`
        #allegro-tracker-panel {
            position: fixed;
            top: 20px;
            right: 20px;
            width: 360px;
            background: white;
            border: 1px solid #e0e0e0;
            border-radius: 8px;
            box-shadow: 0 8px 32px rgba(0,0,0,0.12);
            z-index: 999999;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            display: none;
            overflow: hidden;
        }

        #allegro-tracker-panel.active {
            display: block;
        }

        .tracker-header {
            background: linear-gradient(135deg, #ff5a00 0%, #ff7a00 100%);
            color: white;
            padding: 16px 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .tracker-header h3 {
            margin: 0;
            font-size: 17px;
            font-weight: 600;
        }

        .tracker-close {
            background: rgba(255,255,255,0.2);
            border: none;
            color: white;
            font-size: 20px;
            cursor: pointer;
            padding: 0;
            width: 28px;
            height: 28px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s;
        }

        .tracker-close:hover {
            background: rgba(255,255,255,0.3);
        }

        .tracker-body {
            padding: 20px;
            max-height: 500px;
            overflow-y: auto;
            background: #fafafa;
        }

        .tracker-stat {
            margin-bottom: 12px;
            padding: 14px;
            background: white;
            border-radius: 6px;
            border: 1px solid #e0e0e0;
        }

        .tracker-stat-label {
            font-size: 11px;
            color: #888;
            margin-bottom: 6px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            font-weight: 500;
        }

        .tracker-stat-value {
            font-size: 20px;
            font-weight: 600;
            color: #333;
        }

        .tracker-button {
            width: 100%;
            padding: 12px;
            margin-top: 10px;
            background: linear-gradient(135deg, #ff5a00 0%, #ff7a00 100%);
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 600;
            transition: all 0.2s;
            box-shadow: 0 2px 8px rgba(255,90,0,0.3);
        }

        .tracker-button:hover {
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(255,90,0,0.4);
        }

        .tracker-button:active {
            transform: translateY(0);
        }

        .tracker-button:disabled {
            background: #ccc;
            cursor: not-allowed;
            transform: none;
            box-shadow: none;
        }

        #tracker-fab {
            position: fixed;
            bottom: 30px;
            right: 30px;
            width: 64px;
            height: 64px;
            background: linear-gradient(135deg, #ff5a00 0%, #ff7a00 100%);
            border-radius: 50%;
            border: none;
            color: white;
            font-size: 26px;
            cursor: pointer;
            box-shadow: 0 6px 20px rgba(255,90,0,0.4);
            z-index: 999998;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        #tracker-fab:hover {
            transform: scale(1.1) translateY(-2px);
            box-shadow: 0 8px 24px rgba(255,90,0,0.5);
        }

        #tracker-fab:active {
            transform: scale(1.05);
        }

        .tracker-notification {
            position: absolute;
            top: -5px;
            right: -5px;
            background: #f44336;
            color: white;
            border-radius: 50%;
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            font-weight: bold;
            box-shadow: 0 2px 8px rgba(244,67,54,0.4);
            animation: pulse 2s infinite;
        }

        @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.1); }
        }

        @keyframes fadeIn {
            from {
                opacity: 0;
                transform: scale(0.95);
            }
            to {
                opacity: 1;
                transform: scale(1);
            }
        }

        #ai-message-modal > div,
        #buyer-selection-modal > div {
            animation: fadeIn 0.2s ease-out;
        }

        .tracker-config {
            margin-top: 16px;
            padding: 12px;
            background: #f9f9f9;
            border-radius: 4px;
        }

        .tracker-input {
            width: 100%;
            padding: 8px;
            margin-top: 4px;
            margin-bottom: 8px;
            border: 1px solid #ddd;
            border-radius: 4px;
            box-sizing: border-box;
        }

        .tracker-label {
            display: block;
            font-size: 12px;
            color: #666;
            margin-bottom: 4px;
        }

        /* Separator i przycisk konfiguracji */
        .settings-separator {
            border-top: 1px solid #e0e0e0;
            margin: 16px 0 12px 0;
        }

        .tracker-button-settings {
            background: #f5f5f5 !important;
            color: #666 !important;
            font-size: 13px !important;
            padding: 10px 12px !important;
            box-shadow: 0 1px 3px rgba(0,0,0,0.08) !important;
            margin-top: 0 !important;
        }

        .tracker-button-settings:hover {
            background: #eeeeee !important;
            transform: none !important;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1) !important;
        }

        .tracker-button-settings:active {
            transform: scale(0.98) !important;
        }
    `);

    /**
     * Utwórz panel interfejsu użytkownika
     */
    function createUI() {
        // Utwórz przycisk FAB (Floating Action Button)
        const fab = document.createElement('button');
        fab.id = 'tracker-fab';
        fab.innerHTML = '⭐';
        fab.title = 'Monitor Opinii Allegro';

        if (STATE.changesSinceLastSync > 0) {
            const notification = document.createElement('div');
            notification.className = 'tracker-notification';
            notification.textContent = STATE.changesSinceLastSync;
            fab.appendChild(notification);
        }

        // Utwórz panel kontrolny
        const panel = document.createElement('div');
        panel.id = 'allegro-tracker-panel';
        panel.innerHTML = `
            <div class="tracker-header">
                <h3>🔍 Monitor Opinii</h3>
                <button class="tracker-close">×</button>
            </div>
            <div class="tracker-body">
                <button class="tracker-button" id="process-negative-btn" style="background: #4CAF50;">
                    🚀 Przetwórz negatywne opinie
                </button>

                <button class="tracker-button" id="baseline-btn" style="margin-top: 8px; background: #2196F3;">
                    📥 Pobierz baseline (pierwsze uruchomienie)
                </button>

                <button class="tracker-button tracker-button-warning" id="retry-failed-btn" style="display: none; margin-top: 8px; background: #ff9800;">
                    🔁 Ponów nieudane (<span id="failed-count">0</span>)
                </button>

                <div class="settings-separator"></div>
                <button class="tracker-button tracker-button-settings" id="settings-btn">
                    ⚙️ Konfiguracja
                </button>
            </div>
        `;

        document.body.appendChild(fab);
        document.body.appendChild(panel);

        // Podłącz obsługę zdarzeń
        fab.addEventListener('click', () => {
            panel.classList.toggle('active');
        });

        panel.querySelector('.tracker-close').addEventListener('click', () => {
            panel.classList.remove('active');
        });

        panel.querySelector('#process-negative-btn').addEventListener('click', handleProcessNegativeReviews);
        panel.querySelector('#baseline-btn').addEventListener('click', handleFetchBaseline);
        panel.querySelector('#retry-failed-btn').addEventListener('click', handleRetryFailed);
        panel.querySelector('#settings-btn').addEventListener('click', showConfigModal);

        // Zaktualizuj stan przycisku retry dla nieudanych Jobs
        updateFailedJobsButton();
    }

    /**
     * Zaktualizuj widoczność i licznik przycisku ponowienia nieudanych Jobs
     */
    function updateFailedJobsButton() {
        try {
            const failedJobs = JSON.parse(GM_getValue('failed_jobs', '[]'));
            const button = document.getElementById('retry-failed-btn');
            const countSpan = document.getElementById('failed-count');

            if (button && countSpan) {
                if (failedJobs.length > 0) {
                    button.style.display = 'block';
                    countSpan.textContent = failedJobs.length;
                } else {
                    button.style.display = 'none';
                }
            }
        } catch (e) {
            console.error('Błąd aktualizacji przycisku nieudanych Jobs:', e);
        }
    }

    // ==================== OBSŁUGA ZDARZEŃ ====================

    /**
     * Przetwórz oczekujące Jobs - pobierz teksty recenzji i zaktualizuj arkusz Odpowiedzi
     * Nie wywołuje już START_SYNC - background monitor obsługuje aktualizacje ocen automatycznie
     */
    async function handleProcessJobs() {
        const button = document.getElementById('process-jobs-btn');
        button.disabled = true;
        button.textContent = '⏳ Pobieram Jobs...';

        try {
            console.log('🔄 Przetwarzanie oczekujących Jobs...');

            // Pobierz teksty recenzji dla oczekujących Jobs
            button.textContent = '📥 Przetwarzam...';
            await processCompletedSync(0, 0);

            // Zakończono!
            button.textContent = '✅ Zakończono';
            setTimeout(() => {
                button.disabled = false;
                button.textContent = '🔄 Pobierz i przetwórz Jobs';
            }, 3000);

        } catch (error) {
            console.error('❌ Błąd przetwarzania Jobs:', error);

            GM_notification({
                text: `Błąd: ${error.message}`,
                title: '❌ Błąd przetwarzania',
                timeout: 5000
            });

            button.textContent = '❌ Błąd';
            setTimeout(() => {
                button.disabled = false;
                button.textContent = '🔄 Pobierz i przetwórz Jobs';
            }, 3000);
        }
    }

    // ==================== PRZETWARZANIE JOBS ====================
    // Background monitor obsługuje aktualizacje ocen automatycznie
    // Ten skrypt tylko przetwarza Jobs (pobiera teksty recenzji)

    /**
     * Pobierz baseline - pierwsze uruchomienie
     * Pobiera istniejące komentarze dla wszystkich ofert z negatywnymi ocenami
     */
    async function handleFetchBaseline() {
        const button = document.getElementById('baseline-btn');

        button.disabled = true;

        try {
            console.log('🔵 Rozpoczynam pobieranie baseline...');
            
            if (CONFIG.SELLER_FILTER.ENABLED) {
                console.log(`🏷️  Filtr sprzedawcy AKTYWNY: ${CONFIG.SELLER_FILTER.SELLER_LOGIN}`);
            }

            // Pobierz listę ofert wymagających baseline
            console.log('🔍 DEBUG: Wywołanie GET_OFFERS_FOR_BASELINE...');
            const result = await callWebApp('GET_OFFERS_FOR_BASELINE', {});
            
            console.log('🔍 DEBUG: Otrzymana odpowiedź:', result);
            console.log('🔍 DEBUG: result.success:', result.success);
            console.log('🔍 DEBUG: result.offers type:', typeof result.offers);
            console.log('🔍 DEBUG: result.offers length:', result.offers ? result.offers.length : 'undefined');
            
            if (!result.success) {
                console.error('❌ ERROR: API zwróciło błąd:', result.error);
                throw new Error(result.error || 'Unknown error from GET_OFFERS_FOR_BASELINE');
            }
            
            const offers = result.offers || [];
            const stats = result.stats || {};

            console.log(`📋 Znaleziono ${offers.length} ofert wymagających baseline`);
            if (offers.length > 0) {
                console.log('🔍 DEBUG: Pierwsze 3 oferty:', offers.slice(0, 3));
            }
            if (stats.withProductId !== undefined) {
                console.log(`   → ${stats.withProductId} z Product ID`);
                console.log(`   → ${stats.withoutProductId} BEZ Product ID`);
            }


            if (offers.length === 0) {
                GM_notification({
                    text: 'Wszystkie oferty mają już komentarze baseline',
                    title: '✅ Baseline kompletny',
                    timeout: 3000
                });
                button.disabled = false;
                return;
            }

            // Ostrzeżenie jeśli są oferty bez productId
            if (stats.withoutProductId > 0) {
                console.warn(`⚠️ UWAGA: ${stats.withoutProductId} ofert nie ma Product ID i zostanie pominiętych!`);
                console.log(`ℹ️ Oferty bez Product ID najprawdopodobniej mają błąd w nazwie ("Błąd pobierania")`);
                console.log(`ℹ️ Apps Script spróbuje pobrać Product ID z Allegro API automatycznie...`);
            }

            GM_notification({
                text: `Pobieram baseline dla ${offers.length} ofert...`,
                title: '⚙️ Pobieranie baseline',
                timeout: 5000
            });

            let successCount = 0;
            let errorCount = 0;
            let noReviewsCount = 0;

            // Przetwórz każdą ofertę
            for (let i = 0; i < offers.length; i++) {
                const offer = offers[i];

                try {
                    console.log(`🔄 [${i + 1}/${offers.length}] Oferta ${offer.offerId}: ${offer.offerName}`);

                    if (!offer.productId) {
                        console.log(`   ⚠️ Brak productId dla oferty ${offer.offerId} - pomijam`);
                        noReviewsCount++;
                        continue;
                    }

                    console.log(`   → ProductId: ${offer.productId}`);
                    
                    // Pobierz recenzje dla tej oferty
                    const reviewData = await getProductReviews(offer.productId, 1, null);

                    if (reviewData && reviewData.opinions && reviewData.opinions.length > 0) {
                        // Znajdź najnowszą recenzję z tekstem
                        let latestNegativeReview = null;

                        if (CONFIG.SELLER_FILTER.ENABLED && CONFIG.SELLER_FILTER.SELLER_LOGIN) {
                            // Find newest review with text from specific seller
                            latestNegativeReview = reviewData.opinions.find(review => {
                                const hasText = review.opinion && review.opinion.trim().length > 0;
                                const sellerLogin = review.seller?.login || '';
                                
                                return hasText && sellerLogin === CONFIG.SELLER_FILTER.SELLER_LOGIN;
                            });
                            
                            if (!latestNegativeReview) {
                                console.log(`   ℹ️ Brak recenzji z tekstem od sprzedawcy ${CONFIG.SELLER_FILTER.SELLER_LOGIN}`);
                            }
                        } else {
                            // No filter - find any review with text
                            latestNegativeReview = reviewData.opinions.find(review => {
                                const hasText = review.opinion && review.opinion.trim().length > 0;
                                return hasText;
                            });
                        }

                        if (latestNegativeReview) {
                            const comment = latestNegativeReview.opinion || '';
                            const rating = parseInt(latestNegativeReview.rating?.label || '0');
                            const reviewDate = latestNegativeReview.createdAt ?
                                new Date(latestNegativeReview.createdAt).toISOString().split('T')[0] : null;

                            // Zapisz komentarz do arkusza głównego
                            await callWebApp('UPDATE_OFFER_COMMENT', {
                                offerId: offer.offerId,
                                comment: comment,
                                reviewRating: rating,
                                reviewDate: reviewDate
                            });

                            console.log(`   ✅ Baseline zapisany (${rating}★): ${comment.substring(0, 50)}...`);
                            successCount++;
                        } else {
                            // No negative with text (or none from filtered seller)
                            await callWebApp('UPDATE_OFFER_COMMENT', {
                                offerId: offer.offerId,
                                comment: '',
                                reviewRating: null,
                                reviewDate: null
                            });
                            console.log(`   ℹ️ Brak recenzji z tekstem`);
                            noReviewsCount++;
                        }

                    } else {
                        await callWebApp('UPDATE_OFFER_COMMENT', {
                            offerId: offer.offerId,
                            comment: '',
                            reviewRating: null,
                            reviewDate: null
                        });
                        if (CONFIG.SELLER_FILTER.ENABLED) {
                            console.log(`   ℹ️ Brak jakichkolwiek recenzji od sprzedawcy ${CONFIG.SELLER_FILTER.SELLER_LOGIN}`);
                        } else {
                            console.log(`   ℹ️ Brak jakichkolwiek recenzji`);
                        }
                        noReviewsCount++;
                    }

                    // Małe opóźnienie aby uniknąć limitów
                    await new Promise(resolve => setTimeout(resolve, 500));

                } catch (error) {
                    console.error(`   ❌ Błąd dla oferty ${offer.offerId}:`, error.message);
                    errorCount++;
                }
            }

            // Pokaż wyniki
            const notificationText = `Zakończono!\n✅ Pobrano: ${successCount}\n⚠️ Brak: ${noReviewsCount}${errorCount > 0 ? `\n❌ Błędy: ${errorCount}` : ''}`;

            GM_notification({
                text: notificationText,
                title: '✔️ Baseline zakończony',
                timeout: 5000
            });

            console.log('=== ✅ BASELINE ZAKOŃCZONY ===');
            console.log(`✅ Sukces: ${successCount}, ⚠️ Brak recenzji: ${noReviewsCount}, ❌ Błędy: ${errorCount}`);

        } catch (error) {
            console.error('❌ Błąd pobierania baseline:', error);

            GM_notification({
                text: `Błąd: ${error.message}`,
                title: '❌ Błąd baseline',
                timeout: 5000
            });
        } finally {
            button.disabled = false;
        }
    }

    /**
     * Ponów nieudane Jobs z localStorage
     */
    async function handleRetryFailed() {
        const button = document.getElementById('retry-failed-btn');
        button.disabled = true;
        button.textContent = '⏳ Przetwarzam...';

        try {
            // Pobierz nieudane Jobs z localStorage
            const failedJobsJson = GM_getValue('failed_jobs', '[]');
            const failedJobs = JSON.parse(failedJobsJson);

            if (failedJobs.length === 0) {
                GM_notification({
                    text: 'Brak nieudanych Jobs do ponowienia',
                    title: 'ℹ️ Info',
                    timeout: 3000
                });
                button.disabled = false;
                button.textContent = '🔁 Ponów nieudane (0)';
                return;
            }

            console.log(`🔁 Ponawiam ${failedJobs.length} nieudanych Jobs...`);

            GM_notification({
                text: `Ponawiam ${failedJobs.length} nieudanych Jobs...`,
                title: '🔁 Ponowienie',
                timeout: 3000
            });

            let successCount = 0;
            let stillFailedCount = 0;
            const stillFailed = [];

            // Ponów każdy nieudany Job
            for (const failedJob of failedJobs) {
                try {
                    console.log(`🔄 Ponawiam Job ${failedJob.jobId} - ${failedJob.offerName}`);

                    // Pobierz świeże dane Job (może mieć już productId)
                    const jobResult = await callWebApp('GET_PENDING_JOBS');
                    const job = jobResult.jobs?.find(j => j.jobId === failedJob.jobId);

                    if (!job) {
                        console.log(`   ⚠️ Job ${failedJob.jobId} nie ma już statusu PENDING_REVIEW - pomijam`);
                        continue;
                    }

                    if (!job.productId) {
                        console.log(`   ⚠️ Job ${failedJob.jobId} wciąż bez productId - zachowuję do późniejszego ponowienia`);
                        stillFailed.push(failedJob);
                        stillFailedCount++;
                        continue;
                    }

                    // Spróbuj pobrać recenzję
                    const reviewData = await getProductReviews(job.productId, 1, null);

                    if (reviewData && reviewData.opinions && reviewData.opinions.length > 0) {
                        const latestNegativeReview = reviewData.opinions.find(review => {
                            const rating = parseInt(review.rating?.label || '0');
                            const hasText = review.opinion && review.opinion.trim().length > 0;
                            return (rating === 1 || rating === 2) && hasText;
                        });

                        if (latestNegativeReview) {
                            const fullReviewText = latestNegativeReview.opinion || '';
                            const rating = parseInt(latestNegativeReview.rating?.label || '0');
                            const reviewDate = latestNegativeReview.createdAt ?
                                new Date(latestNegativeReview.createdAt).toISOString().split('T')[0] : null;
                            // API zwraca pros/cons jako STRINGI, nie tablice!
                            const advantages = latestNegativeReview.pros || '';
                            const disadvantages = latestNegativeReview.cons || '';

                            await updateJobReview(job.jobId, fullReviewText, rating, reviewDate, advantages, disadvantages);
                            console.log(`   ✅ Ponowienie udane dla Job ${job.jobId}`);
                            successCount++;
                        } else {
                            await updateJobReview(job.jobId, '', null, null, '', '');
                            console.log(`   ℹ️ Nie znaleziono negatywnych recenzji dla Job ${job.jobId}`);
                            successCount++;
                        }
                    } else {
                        await updateJobReview(job.jobId, '', null, null, '', '');
                        console.log(`   ℹ️ Nie znaleziono recenzji dla Job ${job.jobId}`);
                        successCount++;
                    }

                    // Małe opóźnienie między żądaniami
                    await new Promise(resolve => setTimeout(resolve, 500));

                } catch (error) {
                    console.error(`❌ Ponowienie nieudane dla Job ${failedJob.jobId}:`, error.message);
                    stillFailed.push(failedJob);
                    stillFailedCount++;
                }
            }

            // Zaktualizuj localStorage z wciąż nieudanymi Jobs
            GM_setValue('failed_jobs', JSON.stringify(stillFailed));

            // Zaktualizuj przycisk
            updateFailedJobsButton();

            // Pokaż notyfikację z wynikiem
            GM_notification({
                text: `✅ Sukces: ${successCount}\n❌ Wciąż błędy: ${stillFailedCount}`,
                title: '✔️ Ponowienie zakończone',
                timeout: 5000
            });

            console.log(`✅ Ponowienie zakończone: ${successCount} sukces, ${stillFailedCount} wciąż nieudane`);

            button.textContent = stillFailedCount > 0 ? `🔁 Ponów nieudane (${stillFailedCount})` : '✅ Wszystkie naprawione';
            setTimeout(() => {
                button.disabled = false;
                if (stillFailedCount === 0) {
                    button.style.display = 'none';
                }
            }, 3000);

        } catch (error) {
            console.error('❌ Błąd ponowienia nieudanych Jobs:', error);

            GM_notification({
                text: `Błąd: ${error.message}`,
                title: '❌ Błąd ponowienia',
                timeout: 5000
            });

            button.textContent = '❌ Błąd';
            setTimeout(() => {
                button.disabled = false;
                const failedJobs = JSON.parse(GM_getValue('failed_jobs', '[]'));
                button.textContent = `🔁 Ponów nieudane (${failedJobs.length})`;
            }, 3000);
        }
    }

    // ==================== BRAK PASYWNEGO MONITOROWANIA ====================
    // System działa tylko gdy użytkownik kliknie przycisk
    // Background monitor obsługuje automatyczne aktualizacje ocen
    // Brak monitorowania w tle, brak automatycznych synchronizacji

    /**
     * Przetwórz zakończoną synchronizację Apps Script - pobierz teksty recenzji dla oczekujących Jobs
     */
    async function processCompletedSync(negativeCount, commentsCount) {
        if (STATE.isRunning) {
            console.log('⏸️ Już przetwarzam');
            return;
        }

        STATE.isRunning = true;

        try {
            console.log('=== 🚀 ROZPOCZYNAM POBIERANIE TEKSTÓW RECENZJI ===');
            console.log(`📊 Wykrytych negatywnych: ${negativeCount}, komentarze: ${commentsCount}`);
            
            if (CONFIG.SELLER_FILTER.ENABLED) {
                console.log(`🏷️  Filtr sprzedawcy AKTYWNY: ${CONFIG.SELLER_FILTER.SELLER_LOGIN}`);
            }

            // Pobierz oczekujące Jobs z arkusza "Odpowiedzi" przez Web App
            const result = await callWebApp('GET_PENDING_JOBS');
            const jobsToProcess = result.jobs || [];

            console.log(`📋 Znaleziono ${jobsToProcess.length} Jobs oczekujących na pobranie treści recenzji`);

            if (jobsToProcess.length === 0) {
                console.log('✅ Brak oczekujących Jobs');

                GM_notification({
                    text: 'Brak nowych Jobs do przetworzenia',
                    title: '✅ Synchronizacja zakończona',
                    timeout: 3000
                });

                STATE.isRunning = false;
                return;
            }

            // Pokaż notyfikację
            GM_notification({
                text: `Pobieram teksty dla ${jobsToProcess.length} Jobs...`,
                title: '⚙️ Pobieranie tekstów',
                timeout: 3000
            });

            // Przetwórz każdy Job
            let successCount = 0;
            let errorCount = 0;
            let noReviewsCount = 0;

            // Śledź nieudane Jobs do ponowienia
            const failedJobs = [];

            for (const job of jobsToProcess) {
                let retryCount = 0;
                const maxRetries = 3;
                let lastError = null;
                let processed = false;

                // Pętla ponowień z wykładniczym opóźnieniem
                while (retryCount < maxRetries && !processed) {
                    try {
                        if (retryCount > 0) {
                            const delayMs = Math.pow(2, retryCount) * 1000; // 2s, 4s, 8s
                            console.log(`   🔄 Ponowienie ${retryCount}/${maxRetries - 1} dla Job ${job.jobId} po ${delayMs}ms...`);
                            await new Promise(resolve => setTimeout(resolve, delayMs));
                        }

                        console.log(`🔄 Przetwarzam Job ${job.jobId} - Oferta ${job.offerId} (Product ID: ${job.productId})`);

                        // Pobierz WSZYSTKIE ostatnie recenzje (bez filtra) i znajdź najnowszą negatywną
                        const reviewData = await getProductReviews(job.productId, 1, null);

                        if (reviewData && reviewData.opinions && reviewData.opinions.length > 0) {
                            // Znajdź najnowszą recenzję z tekstem (1 lub 2 gwiazdki) z tekstem
                            // Opcjonalnie filtruj po sprzedawcy
                            const latestNegativeReview = reviewData.opinions.find(review => {
                                const rating = parseInt(review.rating?.label || '0');
                                const hasText = review.opinion && review.opinion.trim().length > 0;
                                const isNegative = (rating === 1 || rating === 2) && hasText;
                                
                                // Sprawdź filtr sprzedawcy jeśli włączony
                                if (CONFIG.SELLER_FILTER.ENABLED) {
                                    const reviewSeller = review.seller?.login || '';
                                    const matchesSeller = reviewSeller === CONFIG.SELLER_FILTER.SELLER_LOGIN;
                                    
                                    if (isNegative && !matchesSeller) {
                                        console.log(`   ⏭️  Pomijam recenzję od sprzedawcy: ${reviewSeller} (szukam: ${CONFIG.SELLER_FILTER.SELLER_LOGIN})`);
                                    }
                                    
                                    return isNegative && matchesSeller;
                                }
                                
                                return isNegative;
                            });

                            if (latestNegativeReview) {
                                // Wyodrębnij szczegóły recenzji (struktura API: opinions[].opinion, opinions[].rating.label)
                                const fullReviewText = latestNegativeReview.opinion || '';
                                const rating = parseInt(latestNegativeReview.rating?.label || '0');
                                const reviewDate = latestNegativeReview.createdAt ?
                                    new Date(latestNegativeReview.createdAt).toISOString().split('T')[0] : null;
                                const reviewSeller = latestNegativeReview.seller?.login || 'Unknown';

                                // Wyodrębnij zalety i wady jeśli dostępne
                                // API zwraca pros/cons jako STRINGI, nie tablice!
                                const advantages = latestNegativeReview.pros || '';
                                const disadvantages = latestNegativeReview.cons || '';

                                // Wyodrębnij wzorzec autora do dopasowania z kupującymi
                                const authorPattern = extractReviewAuthorPattern(latestNegativeReview);
                                console.log(`   👤 Wzorzec autora: "${authorPattern.anonymizedName}" (szukaj: ${authorPattern.firstChar}...${authorPattern.lastChar})`);

                                // Log info o sprzedawcy
                                if (CONFIG.SELLER_FILTER.ENABLED) {
                                    console.log(`   ✓ Znaleziono recenzję od sprzedawcy: ${reviewSeller}`);
                                }

                                // Sprawdź czy tekst recenzji jest taki sam jak poprzedni (oznacza nową negatywną bez tekstu)
                                const previousReviewText = job.reviewText || '';
                                const isReviewTextSame = previousReviewText && fullReviewText === previousReviewText;

                                if (isReviewTextSame) {
                                    // Tekst recenzji niezmieniony - oznacza nową negatywną bez tekstu
                                    console.log(`   ℹ️ Tekst recenzji identyczny z poprzednim - nowa negatywna bez tekstu dla oferty ${job.offerId}`);
                                    await updateJobReview(job.jobId, fullReviewText, rating, reviewDate, advantages, disadvantages, true, authorPattern.anonymizedName);
                                    noReviewsCount++;
                                } else {
                                    // Znaleziono nowy lub inny tekst recenzji
                                    console.log(`   📝 Najnowsza negatywna recenzja: ${rating}★, tekst: ${fullReviewText.length} znaków`);
                                    await updateJobReview(job.jobId, fullReviewText, rating, reviewDate, advantages, disadvantages, false, authorPattern.anonymizedName);
                                    successCount++;
                                }

                                console.log(`   ✅ Zaktualizowano Job ${job.jobId} → Status: READY`);
                                processed = true;

                                // Małe opóźnienie aby uniknąć limitów
                                await new Promise(resolve => setTimeout(resolve, 500));

                            } else {
                                if (CONFIG.SELLER_FILTER.ENABLED) {
                                    console.log(`   ℹ️ Brak negatywnych recenzji z tekstem od sprzedawcy ${CONFIG.SELLER_FILTER.SELLER_LOGIN} dla oferty ${job.offerId}`);
                                } else {
                                    console.log(`   ℹ️ Brak negatywnych recenzji z tekstem dla oferty ${job.offerId}`);
                                }
                                await updateJobReview(job.jobId, '', null, null, '', '', false);
                                noReviewsCount++;
                                processed = true;
                            }

                        } else {
                            console.log(`   ℹ️ Brak jakichkolwiek recenzji dla oferty ${job.offerId}`);
                            await updateJobReview(job.jobId, '', null, null, '', '', false);
                            noReviewsCount++;
                            processed = true;
                        }

                    } catch (error) {
                        lastError = error;
                        retryCount++;
                        console.error(`❌ Błąd przetwarzania Job ${job.jobId} (próba ${retryCount}/${maxRetries}):`, error.message);

                        // Jeśli błąd HTTP 500 z Edge API - nie retry, od razu oznacz jako błąd
                        const isEdgeApiError = error.message.includes('HTTP 500') && error.message.includes('Edge API');
                        
                        if (isEdgeApiError || retryCount >= maxRetries) {
                            const errorType = isEdgeApiError ? 'Edge API błąd 500 (prawdopodobnie nieprawidłowy Product ID)' : `${maxRetries} prób wyczerpanych`;
                            console.error(`❌ Job ${job.jobId} nieudany: ${errorType}`);
                            
                            failedJobs.push({
                                jobId: job.jobId,
                                offerId: job.offerId,
                                offerName: job.offerName,
                                error: error.message,
                                retries: retryCount,
                                isPermanentError: isEdgeApiError
                            });

                            // Spróbuj oznaczyć Job z notką błędu (nie zmieniaj statusu)
                            try {
                                await callWebApp('UPDATE_JOB', {
                                    jobId: job.jobId,
                                    updates: {
                                        notes: `Błąd pobierania: ${error.message.substring(0, 200)} (${retryCount} prób)`
                                    }
                                });
                            } catch (updateError) {
                                console.error(`❌ Nie można zaktualizować Job ${job.jobId}:`, updateError);
                            }
                            errorCount++;
                            processed = true; // Mark as processed to stop retries
                        }
                    }
                }
            }

            // Zapisz nieudane Jobs w localStorage do potencjalnego ręcznego ponowienia
            if (failedJobs.length > 0) {
                try {
                    const existingFailed = JSON.parse(GM_getValue('failed_jobs', '[]'));
                    const allFailed = [...existingFailed, ...failedJobs];
                    // Zachowaj tylko ostatnie 50 nieudanych Jobs
                    const recentFailed = allFailed.slice(-50);
                    GM_setValue('failed_jobs', JSON.stringify(recentFailed));
                    console.log(`💾 Zapisano ${failedJobs.length} nieudanych Jobs do localStorage (łącznie: ${recentFailed.length})`);
                } catch (e) {
                    console.error('❌ Błąd zapisu nieudanych Jobs:', e);
                }
            }

            // Policz Jobs ze statusem MULTIPLE (wymaga wyboru kupującego)
            let multipleCount = 0;
            try {
                const readyResult = await callWebApp('GET_PENDING_JOBS');
                if (readyResult.jobs) {
                    multipleCount = readyResult.jobs.filter(j => j.buyerSearchStatus === 'MULTIPLE').length;
                }
            } catch (e) {
                console.log('Nie można sprawdzić statusu MULTIPLE:', e);
            }

            // Pokaż notyfikację zakończenia
            let notificationText = `Zakończono!\n✅ Pobrano: ${successCount}\n⚠️ Brak: ${noReviewsCount}`;
            if (errorCount > 0) {
                notificationText += `\n❌ Błędy: ${errorCount} (zapisane do ponowienia)`;
            }
            if (multipleCount > 0) {
                notificationText += `\n👥 ${multipleCount} wymaga wyboru kupującego`;
            }

            GM_notification({
                text: notificationText,
                title: '✔️ Synchronizacja zakończona',
                timeout: 5000
            });

            console.log('=== ✅ PRZETWARZANIE ZAKOŃCZONE ===');
            console.log(`✅ Sukces: ${successCount}, ⚠️ Brak recenzji: ${noReviewsCount}, ❌ Błędy: ${errorCount}`);
            console.log('🏁 Synchronizacja kompletna. System bezczynny do następnego kliknięcia.');

        } catch (error) {
            console.error('❌ Błąd w processCompletedSync:', error);

            GM_notification({
                text: `Błąd: ${error.message}`,
                title: '❌ Błąd pobierania',
                timeout: 5000
            });
        } finally {
            STATE.isRunning = false;
            console.log('🔄 System gotowy do kolejnej synchronizacji');
        }
    }

    /**
     * Zaktualizuj Job w arkuszu "Odpowiedzi" danymi recenzji
     * @param {string} jobId - ID Job
     * @param {string} reviewText - Tekst recenzji
     * @param {number} reviewRating - Ocena (1-5)
     * @param {string} reviewDate - Data recenzji
     * @param {string} advantages - Zalety (pros)
     * @param {string} disadvantages - Wady (cons)
     * @param {boolean} sameAsPrevious - Czy tekst taki sam jak poprzedni
     * @param {string} authorPattern - Zanonimizowana nazwa autora (np. "C...0", "R...s")
     */
    async function updateJobReview(jobId, reviewText, reviewRating, reviewDate, advantages, disadvantages, sameAsPrevious = false, authorPattern = '') {
        try {
            const updateData = {
                jobId: jobId,
                reviewText: reviewText,
                reviewRating: reviewRating,
                reviewDate: reviewDate,
                reviewAdvantages: advantages,
                reviewDisadvantages: disadvantages,
                reviewAuthorPattern: authorPattern  // Wzorzec do filtrowania kupujących
            };

            // Dodaj notatkę jeśli tekst recenzji taki sam jak poprzedni (nowa negatywna bez tekstu)
            if (sameAsPrevious) {
                updateData.notes = 'Nowa negatywna ocena bez tekstu (tekst identyczny z poprzednią)';
            }

            const result = await callWebApp('UPDATE_JOB_REVIEW', updateData);

            console.log(`💾 Zaktualizowano Job ${jobId} z treścią recenzji${sameAsPrevious ? ' (brak nowego tekstu)' : ''}${authorPattern ? ` [autor: ${authorPattern}]` : ''}`);

            // Wyświetl wynik automatycznego filtrowania kupujących
            if (result && result.filterResult) {
                const fr = result.filterResult;
                if (fr.autoAssigned) {
                    console.log(`   🎯 AUTOMATYCZNIE DOPASOWANO KUPUJĄCEGO!`);
                    console.log(`      Wzorzec: ${fr.pattern}`);
                    console.log(`      ${fr.originalCount} kupujących → ${fr.filteredCount} pasujący`);
                } else if (fr.filteredCount > 0) {
                    console.log(`   🔍 Przefiltrowano kupujących po wzorcu ${fr.pattern}:`);
                    console.log(`      ${fr.originalCount} → ${fr.filteredCount} (${fr.summary})`);
                } else if (fr.error) {
                    console.log(`   ⚠️ Błąd filtrowania: ${fr.error}`);
                }
            }
        } catch (error) {
            console.error(`❌ Błąd aktualizacji Job ${jobId}:`, error);
            throw error;
        }
    }

    // ==================== AI MESSAGING SYSTEM ====================

    /**
     * Generate AI message using Gemini API (direct browser call)
     * @param {Object} jobData - Job data with reviewText, reviewRating, buyerName, offerName
     * @returns {Promise<Object>} {success, message, error}
     */
    async function generateAIMessage(jobData) {
        return new Promise((resolve, reject) => {
            const { reviewText, reviewRating, buyerName, offerName, reviewAdvantages, reviewDisadvantages } = jobData;

            // Build context about review
            let reviewContext = '';

            if (reviewText && reviewText.trim().length > 0) {
                reviewContext = `TREŚĆ RECENZJI:\n"${reviewText}"`;

                if (reviewAdvantages) {
                    reviewContext += `\n\nZALETY WYMIENIONE PRZEZ KLIENTA:\n${reviewAdvantages}`;
                }

                if (reviewDisadvantages) {
                    reviewContext += `\n\nWADY WYMIENIONE PRZEZ KLIENTA:\n${reviewDisadvantages}`;
                }
            } else {
                reviewContext = `UWAGA: Klient zostawił tylko ocenę gwiazdkową (${reviewRating}★) BEZ treści recenzji.\nNie wiemy co konkretnie nie spodobało się klientowi.`;
            }

            // Build prompt - short and personalized
            const prompt = `Jesteś przedstawicielem obsługi klienta polskiego sklepu na Allegro.

KONTEKST:
- Klient: ${buyerName}
- Ocena: ${reviewRating}★ 
- Produkt: "${offerName}"

${reviewContext}

ZADANIE: Napisz BARDZO KRÓTKĄ (max 100 słów), ciepłą wiadomość prywatną:

1. **Forma grzecznościowa** - określ płeć na podstawie imienia:
   - Męskie (Jan, Piotr, Adam, Marek) → "Szanowny Panie [Imię]"
   - Żeńskie (Anna, Maria, Ewa, Kasia) → "Szanowna Pani [Imię]"
   - Nieznane → "Drogi Kliencie"

2. **Treść** (4-5 zdań):
   - Podziękuj za opinię
   - Przeproś za problem
   - Odnieś się konkretnie do problemu (jeśli jest w recenzji)
   - Zaproponuj POMOC (nie wymiany/zwroty!) - napisz że chcesz pomóc rozwiązać problem
   - Zachęć do kontaktu i wspomnij delikatnie o możliwości zmiany oceny

3. **WAŻNE**:
   - NIE proponuj automatycznie zwrotu/rabatu/wymiany
   - ZAWSZE proponuj pomoc w rozwiązaniu problemu
   - Pytaj co moglibyśmy zrobić, aby pomóc
   - Krótko i zwięźle - MAX 100 SŁÓW
   - BEZ podpisu, BEZ pozdrowień na końcu

4. **Ton**: ciepły, pomocny, bez formalności

PRZYKŁAD (70 słów):
"Szanowna Pani Aniu,

dziękuję za szczerą opinię o parasolu. Przykro mi, że mechanizm sprężynowy nie spełnił Pani oczekiwań.

Chciałabym pomóc rozwiązać ten problem. Czy mogłaby Pani opisać dokładniej, co sprawia trudność? Chętnie znajdziemy rozwiązanie, które będzie dla Pani satysfakcjonujące.

Proszę o kontakt - jestem do dyspozycji. Jeśli uda się rozwiązać sprawę, będę wdzięczna za rozważenie aktualizacji oceny."

**MAX 100 SŁÓW. PROPONUJ POMOC, NIE ZWROTY/RABATY. BEZ PODPISU.**

Wygeneruj wiadomość:`;

            // Call Gemini API directly from browser
            const requestBody = {
                contents: [{
                    role: 'user',
                    parts: [{
                        text: prompt
                    }]
                }],
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 8000,  // High limit to account for Gemini 2.5 thinking tokens
                    topP: 0.95,
                    topK: 40
                }
            };

            const apiUrl = `${CONFIG.GEMINI.API_ENDPOINT}?key=${CONFIG.GEMINI.API_KEY}`;

            GM_xmlhttpRequest({
                method: 'POST',
                url: apiUrl,
                headers: {
                    'Content-Type': 'application/json'
                },
                data: JSON.stringify(requestBody),
                onload: function(response) {
                    if (response.status === 200) {
                        try {
                            const result = JSON.parse(response.responseText);

                            if (!result.candidates || result.candidates.length === 0) {
                                reject(new Error('Gemini nie zwrócił odpowiedzi. Spróbuj ponownie.'));
                                return;
                            }

                            const generatedText = result.candidates[0].content.parts[0].text;
                            console.log('✅ AI message generated successfully');

                            resolve({
                                success: true,
                                message: generatedText.trim(),
                                model: 'gemini-2.5-flash',
                                timestamp: new Date().toISOString()
                            });
                        } catch (e) {
                            reject(new Error(`Błąd parsowania odpowiedzi Gemini: ${e.message}`));
                        }
                    } else {
                        reject(new Error(`Gemini API error (${response.status}): ${response.responseText}`));
                    }
                },
                onerror: function(error) {
                    console.error('Gemini API request error:', error);
                    reject(new Error('Nie można połączyć z Gemini API. Sprawdź połączenie internetowe.'));
                }
            });
        });
    }

    /**
     * Send message via Web App endpoint (which uses Allegro OAuth)
     * @param {Object} data - {jobId, buyerLogin, orderId, messageText}
     * @returns {Promise<Object>} Result from Web App
     */
    async function sendMessageViaWebApp(jobId, buyerLogin, orderId, messageText) {
        return await callWebApp('SEND_MESSAGE', {
            jobId: jobId,
            buyerLogin: buyerLogin,
            orderId: orderId,
            messageText: messageText
        });
    }

    /**
     * Send message DIRECTLY from Tampermonkey using OAuth token
     * This bypasses Apps Script for faster messaging
     * @param {string} buyerLogin - Allegro login of buyer
     * @param {string} orderId - Order UUID
     * @param {string} messageText - Message content
     * @returns {Promise<Object>} {success, messageId, threadId, error}
     */
    async function sendMessageDirect(buyerLogin, orderId, messageText) {
        try {
            console.log(`📤 Wysyłanie wiadomości bezpośrednio do ${buyerLogin}...`);

            // 1. Get OAuth token from Apps Script
            const tokenResult = await callWebApp('GET_TOKENS', {});

            if (!tokenResult.success || !tokenResult.tokens || !tokenResult.tokens.access_token) {
                throw new Error(tokenResult.error || 'Nie można pobrać tokena OAuth. Sprawdź autoryzację w Apps Script.');
            }

            const accessToken = tokenResult.tokens.access_token;
            console.log(`   ✅ Token pobrany (wygasa za ${tokenResult.tokens.seconds_until_expiry}s)`);

            // 2. Prepare request body
            const requestBody = {
                recipient: {
                    login: buyerLogin
                },
                text: messageText
            };

            // Add order link if available
            if (orderId) {
                requestBody.order = {
                    id: orderId
                };
            }

            // 3. Send message directly to Allegro API
            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'POST',
                    url: 'https://api.allegro.pl/messaging/messages',
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Accept': 'application/vnd.allegro.public.v1+json',
                        'Content-Type': 'application/vnd.allegro.public.v1+json'
                    },
                    data: JSON.stringify(requestBody),
                    onload: function(response) {
                        if (response.status === 201 || response.status === 200) {
                            try {
                                const data = JSON.parse(response.responseText);
                                console.log(`   ✅ Wiadomość wysłana! ID: ${data.id}`);
                                resolve({
                                    success: true,
                                    messageId: data.id,
                                    threadId: data.thread?.id || null,
                                    createdAt: data.createdAt
                                });
                            } catch (e) {
                                console.log('   ⚠️ Wiadomość wysłana, ale błąd parsowania odpowiedzi');
                                resolve({
                                    success: true,
                                    messageId: 'unknown',
                                    threadId: null
                                });
                            }
                        } else if (response.status === 401) {
                            reject(new Error('Token OAuth wygasł. Odśwież autoryzację w Apps Script.'));
                        } else if (response.status === 403) {
                            reject(new Error('Brak uprawnień do wysyłania wiadomości. Sprawdź scope: allegro:api:messaging:write'));
                        } else if (response.status === 400) {
                            const errorData = JSON.parse(response.responseText);
                            reject(new Error(`Błąd zapytania: ${errorData.error || response.responseText}`));
                        } else {
                            reject(new Error(`HTTP ${response.status}: ${response.statusText}`));
                        }
                    },
                    onerror: function(error) {
                        console.error('   ❌ Błąd sieci:', error);
                        reject(new Error('Nie można połączyć z Allegro API. Sprawdź połączenie internetowe.'));
                    }
                });
            });

        } catch (error) {
            console.error('❌ Błąd wysyłania wiadomości:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Update Job status after sending message
     * @param {number} jobId - Job ID
     * @param {Object} messageResult - Result from sendMessageDirect
     * @param {string} messageText - The actual message text sent
     */
    async function updateJobAfterMessageSent(jobId, messageResult, messageText) {
        const timestamp = new Date().toLocaleString('pl-PL', { timeZone: 'Europe/Warsaw' });

        const updates = {
            status: 'MESSAGE_SENT',
            messageSentDate: timestamp
        };

        // Save the sent message text (use field names from jobs.gs updateMap)
        if (messageText) {
            updates.aiMessage = messageText;  // Column R - Wygenerowana wiadomość AI
            updates.aiGeneratedDate = timestamp;  // Column S - Data generacji AI
        }

        if (messageResult.threadId) {
            updates.threadId = messageResult.threadId;
        }
        if (messageResult.messageId) {
            updates.messageId = messageResult.messageId;
        }

        updates.notes = `Wysłano bezpośrednio z Tampermonkey: ${timestamp} | Thread: ${messageResult.threadId || 'N/A'} | Msg: ${messageResult.messageId || 'N/A'}`;

        await callWebApp('UPDATE_JOB', {
            jobId: jobId,
            updates: updates
        });

        console.log(`   💾 Job ${jobId} zaktualizowany - status: MESSAGE_SENT`);
    }

    /**
     * Show communication popup with messages and disputes
     * @param {Object} buyer - Buyer object
     * @param {Object} communication - Communication data {messages, disputes}
     */
    function showCommunicationPopup(buyer, communication) {
        const existingPopup = document.getElementById('communication-popup');
        if (existingPopup) existingPopup.remove();

        const popup = document.createElement('div');
        popup.id = 'communication-popup';
        popup.innerHTML = `
            <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.6); z-index: 1000001; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(2px);">
                <div style="background: white; width: 90%; max-width: 800px; max-height: 85vh; border-radius: 8px; box-shadow: 0 10px 40px rgba(0,0,0,0.3); overflow: hidden; display: flex; flex-direction: column; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                    <!-- Header -->
                    <div style="background: linear-gradient(135deg, #2196F3 0%, #42a5f5 100%); color: white; padding: 20px 24px; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                        <div>
                            <h3 style="margin: 0; font-size: 18px; font-weight: 600;">💬 Historia komunikacji</h3>
                            <div style="font-size: 13px; opacity: 0.9; margin-top: 4px;">${buyer.buyerName || buyer.buyerLogin}</div>
                        </div>
                        <button id="comm-popup-close" class="hover-button" style="background: rgba(255,255,255,0.2); border: none; color: white; font-size: 24px; cursor: pointer; padding: 4px; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; transition: all 0.2s;">×</button>
                    </div>

                    <!-- Content -->
                    <div style="padding: 24px; overflow-y: auto; flex: 1; background: #fafafa;">
                        ${communication.hasMessages ? `
                        <!-- Messages Section -->
                        <div style="margin-bottom: 24px;">
                            <h4 style="margin: 0 0 12px 0; font-size: 15px; font-weight: 600; color: #1976d2; display: flex; align-items: center; gap: 8px;">
                                <span>💬 Wiadomości (${communication.totalMessages})</span>
                            </h4>
                            <div style="display: flex; flex-direction: column; gap: 12px;">
                                ${communication.messages.map(msg => `
                                    <div style="background: white; padding: 12px 16px; border-radius: 6px; border-left: 3px solid #2196F3;">
                                        <div style="font-size: 12px; color: #666; margin-bottom: 4px;">
                                            ${msg.lastMessageDate ? new Date(msg.lastMessageDate).toLocaleString('pl-PL') : 'Data nieznana'}
                                        </div>
                                        <div style="font-size: 13px; color: #333; line-height: 1.5;">
                                            ${msg.lastMessage || 'Brak treści wiadomości'}
                                        </div>
                                        ${msg.unreadCount > 0 ? `<div style="margin-top: 6px; font-size: 11px; color: #f57c00; font-weight: 600;">📬 ${msg.unreadCount} nieprzeczytanych</div>` : ''}
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                        ` : ''}

                        ${communication.hasDisputes ? `
                        <!-- Disputes Section -->
                        <div>
                            <h4 style="margin: 0 0 12px 0; font-size: 15px; font-weight: 600; color: #f57c00; display: flex; align-items: center; gap: 8px;">
                                <span>⚠️ Dyskusje (${communication.totalDisputes})</span>
                            </h4>
                            <div style="display: flex; flex-direction: column; gap: 12px;">
                                ${communication.disputes.map(dispute => `
                                    <div style="background: white; padding: 12px 16px; border-radius: 6px; border-left: 3px solid #ff9800;">
                                        <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 8px;">
                                            <div style="font-size: 13px; font-weight: 600; color: #333;">
                                                Dyskusja #${dispute.disputeId}
                                            </div>
                                            <div style="padding: 2px 8px; border-radius: 12px; font-size: 11px; font-weight: 600; background: #fff3e0; color: #e65100;">
                                                ${dispute.status || 'UNKNOWN'}
                                            </div>
                                        </div>
                                        ${dispute.reason ? `<div style="font-size: 12px; color: #666; margin-bottom: 6px;">Powód: ${dispute.reason}</div>` : ''}
                                        <div style="font-size: 12px; color: #888;">
                                            ${dispute.lastMessageDate ? `Ostatnia wiadomość: ${new Date(dispute.lastMessageDate).toLocaleString('pl-PL')}` : 'Brak daty'}
                                        </div>
                                        ${dispute.messagesStatus ? `<div style="margin-top: 6px; font-size: 11px; color: #666;">Status: ${dispute.messagesStatus}</div>` : ''}
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                        ` : ''}

                        ${!communication.hasMessages && !communication.hasDisputes ? `
                        <div style="text-align: center; padding: 40px 20px; color: #999;">
                            <div style="font-size: 48px; margin-bottom: 16px;">📭</div>
                            <div style="font-size: 16px; font-weight: 500;">Brak historii komunikacji</div>
                            <div style="font-size: 13px; margin-top: 8px;">Ten kupujący nie wysyłał wiadomości ani nie otwierał dyskusji</div>
                        </div>
                        ` : ''}
                    </div>

                    <!-- Footer -->
                    <div style="padding: 16px 24px; background: white; border-top: 1px solid #e0e0e0; display: flex; gap: 10px; justify-content: flex-end;">
                        <button id="comm-popup-close-btn" style="padding: 10px 20px; background: white; color: #666; border: 1px solid #ddd; border-radius: 6px; cursor: pointer; font-weight: 500; font-size: 14px; transition: all 0.2s;" onmouseover="this.style.background='#f5f5f5'" onmouseout="this.style.background='white'">
                            Zamknij
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(popup);

        // Close handlers
        popup.querySelector('#comm-popup-close').addEventListener('click', () => {
            popup.remove();
        });

        popup.querySelector('#comm-popup-close-btn').addEventListener('click', () => {
            popup.remove();
        });

        // Close on backdrop click
        popup.querySelector('div').addEventListener('click', (e) => {
            if (e.target === e.currentTarget) {
                popup.remove();
            }
        });
    }

    /**
     * Fetch communication history for buyers
     * @param {Array} buyers - Array of buyer objects
     * @returns {Promise<Map>} Map of buyerLogin -> communication data
     */
    async function fetchBuyerCommunication(buyers) {
        console.log(`📬 fetchBuyerCommunication START - ${buyers.length} buyers`);
        const communicationMap = new Map();
        
        if (!buyers || buyers.length === 0) {
            console.warn('⚠️ No buyers provided to fetchBuyerCommunication');
            return communicationMap;
        }
        
        console.log(`📬 Fetching communication for ${buyers.length} buyers...`);
        
        // Fetch communication for all buyers in parallel
        const promises = buyers.map(async (buyer, index) => {
            console.log(`  📞 [${index + 1}/${buyers.length}] Fetching for: ${buyer.buyerLogin || buyer.buyerId}`);
            const buyerLogin = buyer.buyerLogin || buyer.buyerId;
            const buyerId = buyer.buyerId || buyer.buyerLogin;
            
            try {
                const result = await callWebApp('GET_BUYER_COMMUNICATION', {
                    buyerLogin: buyerLogin,
                    buyerId: buyerId
                });
                
                if (result.success) {
                    communicationMap.set(buyerLogin, result.communication);
                    console.log(`   ✅ ${buyerLogin}: ${result.communication.totalMessages} msg, ${result.communication.totalDisputes} disputes`);
                } else {
                    console.warn(`   ⚠️ ${buyerLogin}: Failed to fetch communication`);
                    communicationMap.set(buyerLogin, {
                        messages: [],
                        disputes: [],
                        hasMessages: false,
                        hasDisputes: false,
                        totalMessages: 0,
                        totalDisputes: 0,
                        error: true
                    });
                }
            } catch (error) {
                console.error(`   ❌ ${buyerLogin}: ${error.message}`);
                communicationMap.set(buyerLogin, {
                    messages: [],
                    disputes: [],
                    hasMessages: false,
                    hasDisputes: false,
                    totalMessages: 0,
                    totalDisputes: 0,
                    error: true
                });
            }
        });
        
        await Promise.all(promises);
        
        console.log(`✅ Communication fetched for ${communicationMap.size} buyers`);
        return communicationMap;
    }

    /**
     * Show buyer selection modal when multiple buyers found
     * @param {Array} buyers - Array of buyer objects
     * @param {Object} job - Job data
     * @returns {Promise<Object|null>} Selected buyer or null if cancelled
     */
    async function showBuyerSelectionModal(buyers, job) {
        console.log(`👥 showBuyerSelectionModal called with ${buyers.length} buyers`);
        
        return new Promise(async (resolve) => {
            const existingModal = document.getElementById('buyer-selection-modal');
            if (existingModal) existingModal.remove();

            console.log(`📬 About to fetch communication for ${buyers.length} buyers...`);
            // Fetch communication data for all buyers
            let communicationMap;
            try {
                communicationMap = await fetchBuyerCommunication(buyers);
                console.log(`✅ Communication map size: ${communicationMap.size}`);
            } catch (error) {
                console.error(`❌ Error fetching communication:`, error);
                communicationMap = new Map(); // Empty map on error
            }

            const modal = document.createElement('div');
            modal.id = 'buyer-selection-modal';
            modal.innerHTML = `
                <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 1000000; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(2px);">
                    <div style="background: white; width: 90%; max-width: 700px; max-height: 85vh; border-radius: 8px; box-shadow: 0 10px 40px rgba(0,0,0,0.2); overflow: hidden; display: flex; flex-direction: column; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                        <!-- Header -->
                        <div style="background: linear-gradient(135deg, #ff9800 0%, #ffb74d 100%); color: white; padding: 20px 24px; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                            <div>
                                <h3 style="margin: 0; font-size: 18px; font-weight: 600;">👥 Wybierz kupującego</h3>
                                <div style="font-size: 13px; opacity: 0.9; margin-top: 4px;">Job #${job.jobId}</div>
                            </div>
                            <button id="buyer-modal-close" style="background: rgba(255,255,255,0.2); border: none; color: white; font-size: 24px; cursor: pointer; padding: 4px; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; transition: all 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.3)'" onmouseout="this.style.background='rgba(255,255,255,0.2)'">×</button>
                        </div>

                        <!-- Content -->
                        <div style="padding: 24px; overflow-y: auto; flex: 1; background: #fafafa;">
                            <!-- Warning Box -->
                            <div style="background: white; padding: 16px; border-radius: 6px; margin-bottom: 20px; border-left: 4px solid #ff9800;">
                                <div style="font-weight: 600; color: #e65100; margin-bottom: 8px;">⚠️ Znaleziono ${buyers.length} potencjalnych kupujących</div>
                                <div style="font-size: 13px; color: #666; line-height: 1.6;">
                                    <div><strong>Produkt:</strong> ${job.offerName?.substring(0, 60)}${job.offerName?.length > 60 ? '...' : ''}</div>
                                    <div><strong>Ocena:</strong> ${'⭐'.repeat(job.reviewRating || 1)} (${job.reviewRating || '?'}★)</div>
                                </div>
                            </div>

                            <!-- Buyers List -->
                            <div id="buyers-list" style="max-height: 420px; overflow-y: auto;">
                                ${buyers.map((buyer, index) => {
                                    const buyerLogin = buyer.buyerLogin || buyer.buyerId;
                                    const comm = communicationMap.get(buyerLogin) || {totalMessages: 0, totalDisputes: 0, hasMessages: false, hasDisputes: false};
                                    
                                    return `
                                    <div class="buyer-option" data-index="${index}" data-buyer-login="${buyerLogin}" style="background: white; border: 1px solid #e0e0e0; padding: 16px; margin-bottom: 12px; border-radius: 6px; cursor: pointer; transition: all 0.2s; position: relative;">
                                        <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 16px;">
                                            <div style="flex: 1;">
                                                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
                                                    <span style="font-size: 16px; font-weight: 600; color: #333;">${buyer.buyerName || 'Nieznane imię i nazwisko'}</span>
                                                    ${comm.hasMessages ? `<span class="comm-badge messages" data-buyer-login="${buyerLogin}" style="display: inline-flex; align-items: center; gap: 4px; padding: 3px 8px; border-radius: 12px; font-size: 11px; font-weight: 600; background: #e3f2fd; color: #1976d2; cursor: pointer; transition: all 0.2s;">💬 ${comm.totalMessages}</span>` : ''}
                                                    ${comm.hasDisputes ? `<span class="comm-badge disputes" data-buyer-login="${buyerLogin}" style="display: inline-flex; align-items: center; gap: 4px; padding: 3px 8px; border-radius: 12px; font-size: 11px; font-weight: 600; background: #fff3e0; color: #f57c00; cursor: pointer; transition: all 0.2s;">⚠️ ${comm.totalDisputes}</span>` : ''}
                                                </div>
                                                <div style="display: flex; flex-direction: column; gap: 4px; font-size: 12px; color: #888;">
                                                    <div style="display: flex; align-items: center; gap: 6px;">
                                                        <span style="color: #999;">👤</span>
                                                        <span style="font-family: monospace;">${buyer.buyerLogin || buyer.buyerId}</span>
                                                    </div>
                                                    <div style="display: flex; align-items: center; gap: 6px;">
                                                        <span style="color: #999;">📅</span>
                                                        <span>${buyer.orderDate || 'brak daty zamówienia'}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div style="text-align: right; font-size: 11px; color: #999;">
                                                <div style="background: #f5f5f5; padding: 6px 10px; border-radius: 4px; font-family: monospace; font-size: 11px; word-break: break-all;">
                                                    ${buyer.orderId || 'brak ID'}
                                                </div>
                                            </div>
                                        </div>
                                        <div style="position: absolute; right: 16px; top: 50%; transform: translateY(-50%); opacity: 0; transition: opacity 0.2s; color: #ff9800; font-size: 20px;" class="buyer-arrow">→</div>
                                    </div>
                                `}).join('')}
                            </div>
                        </div>

                        <!-- Footer -->
                        <div style="padding: 16px 24px; background: white; border-top: 1px solid #e0e0e0; display: flex; gap: 10px; justify-content: flex-end;">
                            <button id="buyer-skip-btn" style="padding: 10px 20px; background: white; color: #666; border: 1px solid #ddd; border-radius: 6px; cursor: pointer; font-weight: 500; font-size: 14px; transition: all 0.2s;" onmouseover="this.style.background='#f5f5f5'" onmouseout="this.style.background='white'">
                                ⏭️ Pomiń Job
                            </button>
                        </div>
                    </div>
                </div>
            `;

            document.body.appendChild(modal);

            // Event handlers for communication badges
            modal.querySelectorAll('.comm-badge').forEach(badge => {
                badge.addEventListener('click', (e) => {
                    e.stopPropagation(); // Prevent buyer selection
                    const buyerLogin = badge.dataset.buyerLogin;
                    const comm = communicationMap.get(buyerLogin);
                    const buyer = buyers.find(b => (b.buyerLogin || b.buyerId) === buyerLogin);
                    if (comm && buyer) {
                        showCommunicationPopup(buyer, comm);
                    }
                });
                
                badge.addEventListener('mouseenter', (e) => {
                    e.stopPropagation();
                    badge.style.transform = 'scale(1.1)';
                    badge.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)';
                });
                
                badge.addEventListener('mouseleave', (e) => {
                    e.stopPropagation();
                    badge.style.transform = 'scale(1)';
                    badge.style.boxShadow = 'none';
                });
            });

            // Hover effects for buyer options
            modal.querySelectorAll('.buyer-option').forEach(option => {
                const arrow = option.querySelector('.buyer-arrow');
                
                option.addEventListener('mouseenter', () => {
                    option.style.borderColor = '#ff9800';
                    option.style.background = '#fff8e1';
                    option.style.transform = 'translateX(4px)';
                    option.style.boxShadow = '0 4px 12px rgba(255,152,0,0.2)';
                    if (arrow) arrow.style.opacity = '1';
                });
                option.addEventListener('mouseleave', () => {
                    option.style.borderColor = '#e0e0e0';
                    option.style.background = 'white';
                    option.style.transform = 'translateX(0)';
                    option.style.boxShadow = 'none';
                    if (arrow) arrow.style.opacity = '0';
                });
                option.addEventListener('click', (e) => {
                    // Only select buyer if not clicking on badge
                    if (!e.target.classList.contains('comm-badge')) {
                        const index = parseInt(option.dataset.index);
                        modal.remove();
                        resolve(buyers[index]);
                    }
                });
            });

            modal.querySelector('#buyer-modal-close').addEventListener('click', () => {
                modal.remove();
                resolve(null);
            });

            modal.querySelector('#buyer-skip-btn').addEventListener('click', () => {
                modal.remove();
                resolve(null);
            });
        });
    }

    /**
     * Show message editor modal for a job
     * @param {Object} job - Job data
     * @param {string} generatedMessage - AI-generated message
     * @param {Function} onSend - Callback when user sends message
     * @param {Function} onRegenerate - Callback when user wants to regenerate
     * @param {Function} onSkip - Callback when user skips this job
     */
    function showMessageEditorModal(job, generatedMessage, onSend, onRegenerate, onSkip) {
        // Remove existing modal if any
        const existingModal = document.getElementById('ai-message-modal');
        if (existingModal) {
            existingModal.remove();
        }

        const modal = document.createElement('div');
        modal.id = 'ai-message-modal';
        modal.innerHTML = `
            <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 1000000; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(2px);">
                <div style="background: white; width: 90%; max-width: 700px; max-height: 85vh; border-radius: 8px; box-shadow: 0 10px 40px rgba(0,0,0,0.2); overflow: hidden; display: flex; flex-direction: column; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                    <!-- Header -->
                    <div style="background: linear-gradient(135deg, #ff5a00 0%, #ff7a00 100%); color: white; padding: 20px 24px; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                        <div>
                            <h3 style="margin: 0; font-size: 18px; font-weight: 600;">💬 Odpowiedź na opinię</h3>
                            <div style="font-size: 13px; opacity: 0.9; margin-top: 4px;">Job #${job.jobId}</div>
                        </div>
                        <button id="modal-close" style="background: rgba(255,255,255,0.2); border: none; color: white; font-size: 24px; cursor: pointer; padding: 4px; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; transition: all 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.3)'" onmouseout="this.style.background='rgba(255,255,255,0.2)'">×</button>
                    </div>

                    <!-- Content -->
                    <div style="padding: 24px; overflow-y: auto; flex: 1; background: #fafafa;">
                        <!-- Info Card -->
                        <div style="background: white; padding: 16px; border-radius: 6px; margin-bottom: 20px; border: 1px solid #e0e0e0;">
                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px 12px; font-size: 13px; color: #333;">
                                <div style="display: flex; flex-direction: column;">
                                    <span style="color: #888; font-size: 11px; margin-bottom: 4px; text-transform: uppercase; letter-spacing: 0.5px;">Produkt</span>
                                    <span style="font-weight: 500;">${job.offerName?.substring(0, 50)}${job.offerName?.length > 50 ? '...' : ''}</span>
                                </div>
                                <div style="display: flex; flex-direction: column;">
                                    <span style="color: #888; font-size: 11px; margin-bottom: 4px; text-transform: uppercase; letter-spacing: 0.5px;">Kupujący</span>
                                    <span style="font-weight: 500;">${job.buyerName || job.buyerId}</span>
                                </div>
                                <div style="display: flex; flex-direction: column;">
                                    <span style="color: #888; font-size: 11px; margin-bottom: 4px; text-transform: uppercase; letter-spacing: 0.5px;">Ocena</span>
                                    <span style="font-weight: 500;">${'⭐'.repeat(job.reviewRating || 0)} <span style="color: #888;">(${job.reviewRating || '?'}★)</span></span>
                                </div>
                                <div style="display: flex; flex-direction: column;">
                                    <span style="color: #888; font-size: 11px; margin-bottom: 4px; text-transform: uppercase; letter-spacing: 0.5px;">Zamówienie</span>
                                    <span style="font-weight: 500; font-family: monospace; font-size: 11px; word-break: break-all;">${job.orderId || 'brak ID'}</span>
                                </div>
                            </div>
                            ${job.reviewText ? `
                            <div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid #f0f0f0;">
                                <span style="color: #888; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; display: block; margin-bottom: 8px;">Treść recenzji</span>
                                <div style="padding: 12px; background: #f8f8f8; border-left: 3px solid #ff5a00; border-radius: 4px; font-size: 13px; line-height: 1.6; max-height: 120px; overflow-y: auto; color: #333;">
                                    ${job.reviewText}
                                </div>
                            </div>
                            ` : '<div style="margin-top: 16px; padding: 12px; background: #fff3e0; border-left: 3px solid #ff9800; border-radius: 4px; color: #e65100; font-size: 12px;">ℹ️ Brak treści recenzji - klient zostawił tylko ocenę gwiazdkową</div>'}
                        </div>

                        <!-- Message Editor -->
                        <div>
                            <label style="color: #555; font-size: 13px; font-weight: 600; display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                                <span>✉️ Twoja wiadomość</span>
                                <span id="char-count" style="font-weight: 400; color: #999; font-size: 12px;">0/2000</span>
                            </label>
                            <textarea id="message-text" style="width: 100%; height: 280px; padding: 14px; border: 1px solid #ddd; border-radius: 6px; font-size: 14px; line-height: 1.6; resize: vertical; box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: white; transition: border-color 0.2s;" maxlength="2000" placeholder="Edytuj wiadomość przed wysłaniem..." onfocus="this.style.borderColor='#ff5a00'" onblur="this.style.borderColor='#ddd'">${generatedMessage}</textarea>
                        </div>
                    </div>

                    <!-- Footer Actions -->
                    <div style="padding: 16px 24px; background: white; border-top: 1px solid #e0e0e0; display: flex; gap: 10px; justify-content: flex-end;">
                        <button id="btn-skip" style="padding: 10px 18px; background: white; color: #666; border: 1px solid #ddd; border-radius: 6px; cursor: pointer; font-weight: 500; font-size: 14px; transition: all 0.2s;" onmouseover="this.style.background='#f5f5f5'" onmouseout="this.style.background='white'">
                            ⏭️ Pomiń
                        </button>
                        <button id="btn-regenerate" style="padding: 10px 18px; background: #2196F3; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 500; font-size: 14px; transition: all 0.2s; box-shadow: 0 2px 4px rgba(33,150,243,0.3);" onmouseover="this.style.background='#1976D2'" onmouseout="this.style.background='#2196F3'">
                            🔄 Regeneruj
                        </button>
                        <button id="btn-send" style="padding: 10px 24px; background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%); color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 600; font-size: 14px; transition: all 0.2s; box-shadow: 0 2px 8px rgba(76,175,80,0.4);" onmouseover="this.style.transform='translateY(-1px)'; this.style.boxShadow='0 4px 12px rgba(76,175,80,0.5)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 2px 8px rgba(76,175,80,0.4)'">
                            📤 Wyślij wiadomość
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Update character count
        const textarea = modal.querySelector('#message-text');
        const charCount = modal.querySelector('#char-count');

        function updateCharCount() {
            const count = textarea.value.length;
            charCount.textContent = `${count}/2000`;
            if (count > 1900) {
                charCount.style.color = '#d32f2f';
                charCount.style.fontWeight = '600';
            } else if (count > 1700) {
                charCount.style.color = '#ff9800';
                charCount.style.fontWeight = '500';
            } else {
                charCount.style.color = '#999';
                charCount.style.fontWeight = '400';
            }
        }

        textarea.addEventListener('input', updateCharCount);
        updateCharCount();

        // Event handlers
        modal.querySelector('#modal-close').addEventListener('click', () => {
            modal.remove();
            onSkip();
        });

        modal.querySelector('#btn-skip').addEventListener('click', () => {
            modal.remove();
            onSkip();
        });

        modal.querySelector('#btn-regenerate').addEventListener('click', () => {
            const btn = modal.querySelector('#btn-regenerate');
            btn.disabled = true;
            btn.textContent = '⏳ Generuję...';
            onRegenerate();
        });

        modal.querySelector('#btn-send').addEventListener('click', () => {
            const messageText = textarea.value.trim();
            if (!messageText) {
                alert('Wiadomość nie może być pusta!');
                return;
            }
            if (messageText.length > 2000) {
                alert('Wiadomość jest zbyt długa! Maksimum 2000 znaków.');
                return;
            }
            const btn = modal.querySelector('#btn-send');
            btn.disabled = true;
            btn.textContent = '⏳ Wysyłam...';
            onSend(messageText);
        });
    }

    /**
     * Modal konfiguracji zmiennych wtyczki
     */
    function showConfigModal() {
        // Usuń istniejący modal jeśli istnieje
        const existingModal = document.getElementById('config-modal');
        if (existingModal) {
            existingModal.remove();
        }

        // Pobierz obecną konfigurację
        const currentWebAppUrl = CONFIG.GOOGLE_SHEETS.WEB_APP_URL;
        const currentSellerLogin = CONFIG.SELLER_FILTER.SELLER_LOGIN;
        const currentGeminiKey = CONFIG.GEMINI.API_KEY;

        const modal = document.createElement('div');
        modal.id = 'config-modal';
        modal.innerHTML = `
            <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 1000000; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(2px);">
                <div style="background: white; width: 90%; max-width: 600px; max-height: 85vh; border-radius: 8px; box-shadow: 0 10px 40px rgba(0,0,0,0.2); overflow: hidden; display: flex; flex-direction: column; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                    <!-- Header -->
                    <div style="background: linear-gradient(135deg, #ff5a00 0%, #ff7a00 100%); color: white; padding: 20px 24px; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                        <div>
                            <h3 style="margin: 0; font-size: 18px; font-weight: 600;">⚙️ Konfiguracja wtyczki</h3>
                            <div style="font-size: 13px; opacity: 0.9; margin-top: 4px;">Zmienne środowiskowe</div>
                        </div>
                        <button id="config-modal-close" style="background: rgba(255,255,255,0.2); border: none; color: white; font-size: 24px; cursor: pointer; padding: 4px; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; transition: all 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.3)'" onmouseout="this.style.background='rgba(255,255,255,0.2)'">×</button>
                    </div>

                    <!-- Content -->
                    <div style="padding: 24px; overflow-y: auto; flex: 1; background: #fafafa;">
                        <!-- Web App URL -->
                        <div style="margin-bottom: 20px;">
                            <label style="display: block; color: #555; font-size: 13px; font-weight: 600; margin-bottom: 8px;">
                                🔗 Web App URL
                            </label>
                            <textarea id="config-web-app-url" rows="3" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 6px; font-size: 13px; font-family: monospace; resize: vertical; box-sizing: border-box; background: white; transition: border-color 0.2s;" placeholder="https://script.google.com/macros/s/..." onfocus="this.style.borderColor='#ff5a00'" onblur="this.style.borderColor='#ddd'">${currentWebAppUrl}</textarea>
                            <div style="font-size: 11px; color: #888; margin-top: 4px;">URL z Google Apps Script deployment</div>
                        </div>

                        <!-- Seller Login -->
                        <div style="margin-bottom: 20px;">
                            <label style="display: block; color: #555; font-size: 13px; font-weight: 600; margin-bottom: 8px;">
                                👤 Seller Login
                            </label>
                            <input type="text" id="config-seller-login" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 6px; font-size: 13px; box-sizing: border-box; background: white; transition: border-color 0.2s;" placeholder="aureahome" value="${currentSellerLogin}" onfocus="this.style.borderColor='#ff5a00'" onblur="this.style.borderColor='#ddd'" />
                            <div style="font-size: 11px; color: #888; margin-top: 4px;">Login sprzedawcy na Allegro</div>
                        </div>

                        <!-- Gemini API Key -->
                        <div style="margin-bottom: 20px;">
                            <label style="display: block; color: #555; font-size: 13px; font-weight: 600; margin-bottom: 8px;">
                                🤖 Gemini API Key
                            </label>
                            <div style="position: relative;">
                                <input type="password" id="config-gemini-key" style="width: 100%; padding: 10px; padding-right: 45px; border: 1px solid #ddd; border-radius: 6px; font-size: 13px; font-family: monospace; box-sizing: border-box; background: white; transition: border-color 0.2s;" placeholder="AIzaSy..." value="${currentGeminiKey}" onfocus="this.style.borderColor='#ff5a00'" onblur="this.style.borderColor='#ddd'" />
                                <button id="toggle-visibility" type="button" style="position: absolute; right: 8px; top: 50%; transform: translateY(-50%); background: transparent; border: none; cursor: pointer; font-size: 18px; padding: 4px 8px; opacity: 0.6; transition: opacity 0.2s;" onmouseover="this.style.opacity='1'" onmouseout="this.style.opacity='0.6'">👁️</button>
                            </div>
                            <div style="font-size: 11px; color: #888; margin-top: 4px;">Klucz API z Google AI Studio</div>
                        </div>

                        <!-- Error message -->
                        <div id="config-error" style="display: none; padding: 12px; background: #ffebee; border-left: 3px solid #d32f2f; border-radius: 4px; color: #c62828; font-size: 13px; margin-top: 16px;"></div>
                    </div>

                    <!-- Footer Actions -->
                    <div style="padding: 16px 24px; background: white; border-top: 1px solid #e0e0e0; display: flex; gap: 10px; justify-content: flex-end;">
                        <button id="config-btn-cancel" style="padding: 10px 18px; background: white; color: #666; border: 1px solid #ddd; border-radius: 6px; cursor: pointer; font-weight: 500; font-size: 14px; transition: all 0.2s;" onmouseover="this.style.background='#f5f5f5'" onmouseout="this.style.background='white'">
                            ❌ Anuluj
                        </button>
                        <button id="config-btn-reset" style="padding: 10px 18px; background: #2196F3; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 500; font-size: 14px; transition: all 0.2s; box-shadow: 0 2px 4px rgba(33,150,243,0.3);" onmouseover="this.style.background='#1976D2'" onmouseout="this.style.background='#2196F3'">
                            🔄 Resetuj
                        </button>
                        <button id="config-btn-save" style="padding: 10px 24px; background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%); color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 600; font-size: 14px; transition: all 0.2s; box-shadow: 0 2px 8px rgba(76,175,80,0.4);" onmouseover="this.style.transform='translateY(-1px)'; this.style.boxShadow='0 4px 12px rgba(76,175,80,0.5)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 2px 8px rgba(76,175,80,0.4)'">
                            💾 Zapisz
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Toggle password visibility
        const toggleBtn = modal.querySelector('#toggle-visibility');
        const passwordInput = modal.querySelector('#config-gemini-key');
        toggleBtn.addEventListener('click', () => {
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                toggleBtn.textContent = '🙈';
            } else {
                passwordInput.type = 'password';
                toggleBtn.textContent = '👁️';
            }
        });

        // Close handlers
        const closeModal = () => modal.remove();
        modal.querySelector('#config-modal-close').addEventListener('click', closeModal);
        modal.querySelector('#config-btn-cancel').addEventListener('click', closeModal);

        // Reset handler
        modal.querySelector('#config-btn-reset').addEventListener('click', () => {
            // Wartości domyślne z kodu (hardcoded)
            modal.querySelector('#config-web-app-url').value = 'https://script.google.com/macros/s/AKfycbztd7tOQHGZQ8NCTjdJc5QNdWBmYBi1Kw1RxzXX8YK1GS6fPGugsVL2p3foFHSE22M8PA/exec';
            modal.querySelector('#config-seller-login').value = 'aureahome';
            modal.querySelector('#config-gemini-key').value = 'AIzaSyDOKU-wl1VgyRSTMm2JLtbf2XjAanFcDMU';

            // Ukryj błędy
            const errorDiv = modal.querySelector('#config-error');
            errorDiv.style.display = 'none';
        });

        // Save handler
        modal.querySelector('#config-btn-save').addEventListener('click', () => {
            const webAppUrl = modal.querySelector('#config-web-app-url').value.trim();
            const sellerLogin = modal.querySelector('#config-seller-login').value.trim();
            const geminiKey = modal.querySelector('#config-gemini-key').value.trim();

            // Walidacja
            const errors = [];
            if (!webAppUrl || !webAppUrl.includes('script.google.com')) {
                errors.push('❌ Web App URL musi zawierać "script.google.com"');
            }
            if (!sellerLogin) {
                errors.push('❌ Seller Login nie może być pusty');
            }
            if (!geminiKey || !geminiKey.startsWith('AIza')) {
                errors.push('❌ Gemini API Key musi zaczynać się od "AIza"');
            }

            const errorDiv = modal.querySelector('#config-error');
            if (errors.length > 0) {
                errorDiv.innerHTML = errors.join('<br>');
                errorDiv.style.display = 'block';
                return;
            }

            // Zapisz do GM storage
            GM_setValue('config_web_app_url', webAppUrl);
            GM_setValue('config_seller_login', sellerLogin);
            GM_setValue('config_gemini_api_key', geminiKey);

            // Zaktualizuj CONFIG object
            CONFIG.GOOGLE_SHEETS.WEB_APP_URL = webAppUrl;
            CONFIG.SELLER_FILTER.SELLER_LOGIN = sellerLogin;
            CONFIG.GEMINI.API_KEY = geminiKey;

            // Notyfikacja
            GM_notification({
                text: 'Konfiguracja została zapisana pomyślnie!\n\nZmiany będą obowiązywać natychmiast.',
                title: '✅ Sukces',
                timeout: 4000
            });

            closeModal();
        });
    }

    /**
     * UNIFIED WORKFLOW: Process negative reviews completely
     * 1. Fetch review text
     * 2. Search for buyer
     * 3. Generate AI message
     * 4. Send message
     */
    async function handleProcessNegativeReviews() {
        const button = document.getElementById('process-negative-btn');
        if (button) {
            button.disabled = true;
            button.textContent = '⏳ Pobieram Jobs...';
        }

        try {
            console.log('🚀 Starting unified negative reviews workflow...');

            // Get pending jobs
            const pendingResult = await callWebApp('GET_PENDING_JOBS');
            const jobs = pendingResult.jobs || [];

            console.log(`📋 Found ${jobs.length} jobs to process`);

            if (jobs.length === 0) {
                GM_notification({
                    text: 'Brak Jobs do przetworzenia.\n\nCzekaj na wykrycie nowych negatywnych opinii przez background monitor.',
                    title: 'ℹ️ Brak Jobs',
                    timeout: 5000
                });
                if (button) {
                    button.disabled = false;
                    button.textContent = '🚀 Przetwórz negatywne opinie';
                }
                return;
            }

            GM_notification({
                text: `Znaleziono ${jobs.length} Jobs do przetworzenia`,
                title: '🚀 Przetwarzanie negatywnych opinii',
                timeout: 3000
            });

            let processedCount = 0;
            let sentCount = 0;
            let skippedCount = 0;
            let errorCount = 0;

            // Process each job through the complete workflow
            for (let i = 0; i < jobs.length; i++) {
                const job = jobs[i];
                console.log(`\n🔄 Processing job ${i + 1}/${jobs.length}: Job #${job.jobId}`);

                if (button) {
                    button.textContent = `⏳ Job ${i + 1}/${jobs.length}...`;
                }

                try {
                    // STEP 1: Fetch review text (if not already fetched)
                    if (!job.reviewText && job.productId) {
                        console.log('   📖 Fetching review text from edge API...');
                        // Get all reviews (no rating filter), then filter for negative (1★ or 2★) in code
                        const reviewData = await getProductReviews(job.productId, 1, null);

                        if (reviewData && reviewData.opinions && reviewData.opinions.length > 0) {
                            // Filter for negative reviews (rating 1 or 2) and by seller if enabled
                            let latestNegative = null;
                            
                            if (CONFIG.SELLER_FILTER.ENABLED && CONFIG.SELLER_FILTER.SELLER_LOGIN) {
                                latestNegative = reviewData.opinions.find(r => {
                                    const rating = parseInt(r.rating?.label || '5');
                                    const sellerLogin = r.seller?.login || '';
                                    const isNegative = (rating === 1 || rating === 2);
                                    return isNegative && r.opinion && sellerLogin === CONFIG.SELLER_FILTER.SELLER_LOGIN;
                                });
                            } else {
                                latestNegative = reviewData.opinions.find(r => {
                                    const rating = parseInt(r.rating?.label || '5');
                                    const isNegative = (rating === 1 || rating === 2);
                                    return isNegative && r.opinion;
                                });
                            }

                            if (latestNegative) {
                                job.reviewText = latestNegative.opinion || '';
                                job.reviewRating = parseInt(latestNegative.rating?.label) || 1;
                                job.reviewAdvantages = latestNegative.pros || '';
                                job.reviewDisadvantages = latestNegative.cons || '';

                                // Update job in sheet
                                await callWebApp('UPDATE_JOB_REVIEW', {
                                    jobId: job.jobId,
                                    reviewText: job.reviewText,
                                    reviewRating: job.reviewRating,
                                    reviewDate: latestNegative.createdAt,
                                    advantages: job.reviewAdvantages,
                                    disadvantages: job.reviewDisadvantages
                                });
                                console.log(`   ✅ Review text fetched: "${job.reviewText.substring(0, 50)}..."`);
                            } else {
                                console.log('   ⚠️ No negative review with text found');
                                job.reviewText = '';
                            }
                        }
                    }

                    // STEP 2: Handle buyer search based on current status
                    if (job.buyerSearchStatus === 'MULTIPLE' && !job.buyerId) {
                        // Already searched, has multiple choices - fetch saved choices
                        console.log('   👥 Job has MULTIPLE status, fetching saved choices...');
                        const choicesResult = await callWebApp('GET_BUYER_CHOICES', { jobId: job.jobId });

                        if (choicesResult.success && choicesResult.buyers.length > 0) {
                            const selectedBuyer = await showBuyerSelectionModal(choicesResult.buyers, job);

                            if (selectedBuyer) {
                                await callWebApp('ASSIGN_BUYER', {
                                    jobId: job.jobId,
                                    buyer: selectedBuyer
                                });
                                job.buyerId = selectedBuyer.buyerLogin || selectedBuyer.buyerId;
                                job.buyerName = selectedBuyer.buyerName;
                                job.orderId = selectedBuyer.orderId;
                                console.log(`   ✅ Buyer selected: ${job.buyerName}`);
                            } else {
                                console.log('   ⏭️ Buyer selection cancelled, skipping job');
                                skippedCount++;
                                continue;
                            }
                        } else {
                            // No saved choices, need to search again
                            console.log('   ⚠️ No saved choices found, searching again...');
                            job.buyerSearchStatus = 'NEW'; // Reset status to trigger search
                        }
                    }
                    
                    // Need to search for buyer (NEW, NOT_FOUND, or no status)
                    if (!job.buyerId && job.buyerSearchStatus !== 'FOUND') {
                        console.log('   👤 Searching for buyer...');
                        const searchResult = await callWebApp('SEARCH_BUYER', { jobId: job.jobId });

                        if (searchResult.success) {
                            job.buyerSearchStatus = searchResult.status;

                            if (searchResult.status === 'FOUND' && searchResult.buyers.length === 1) {
                                const buyer = searchResult.buyers[0];
                                job.buyerId = buyer.buyerLogin || buyer.buyerId;
                                job.buyerName = buyer.buyerName;
                                job.orderId = buyer.orderId;
                                console.log(`   ✅ Buyer found: ${job.buyerName} (${job.buyerId})`);
                            } else if (searchResult.status === 'MULTIPLE') {
                                console.log(`   👥 Multiple buyers found (${searchResult.count}), showing selection...`);
                                const selectedBuyer = await showBuyerSelectionModal(searchResult.buyers, job);

                                if (selectedBuyer) {
                                    // Assign selected buyer
                                    await callWebApp('ASSIGN_BUYER', {
                                        jobId: job.jobId,
                                        buyer: selectedBuyer
                                    });
                                    job.buyerId = selectedBuyer.buyerLogin || selectedBuyer.buyerId;
                                    job.buyerName = selectedBuyer.buyerName;
                                    job.orderId = selectedBuyer.orderId;
                                    console.log(`   ✅ Buyer selected: ${job.buyerName}`);
                                } else {
                                    console.log('   ⏭️ Buyer selection cancelled, skipping job');
                                    skippedCount++;
                                    continue;
                                }
                            } else if (searchResult.status === 'NOT_FOUND') {
                                console.log('   ❌ No buyer found for this job');
                                GM_notification({
                                    text: `Job #${job.jobId}: Nie znaleziono kupującego\n(brak zamówień SENT/DELIVERED w ciągu 90 dni)`,
                                    title: '⚠️ Brak kupującego',
                                    timeout: 4000
                                });
                                skippedCount++;
                                continue;
                            }
                        } else {
                            throw new Error(searchResult.error || 'Buyer search failed');
                        }
                    }

                    // STEP 3: Ensure we have buyer and order ID
                    if (!job.buyerId || !job.orderId) {
                        console.log('   ⚠️ Missing buyer ID or order ID, skipping');
                        skippedCount++;
                        continue;
                    }

                    // STEP 4: Generate AI message
                    console.log('   🤖 Generating AI message...');
                    const aiResult = await generateAIMessage({
                        reviewText: job.reviewText || '',
                        reviewRating: job.reviewRating || 1,
                        buyerName: job.buyerName || job.buyerId,
                        offerName: job.offerName,
                        reviewAdvantages: job.reviewAdvantages || '',
                        reviewDisadvantages: job.reviewDisadvantages || ''
                    });

                    if (!aiResult.success) {
                        throw new Error(aiResult.error || 'AI generation failed');
                    }

                    // STEP 5: Show editor modal and wait for user action
                    await new Promise((resolve) => {
                        showMessageEditorModal(
                            job,
                            aiResult.message,
                            // onSend
                            async (messageText) => {
                                try {
                                    console.log('   📤 Sending message DIRECTLY to Allegro API...');

                                    const sendResult = await sendMessageDirect(
                                        job.buyerId,
                                        job.orderId,
                                        messageText
                                    );

                                    if (sendResult.success) {
                                        console.log(`   ✅ Message sent! Thread: ${sendResult.threadId}, Msg: ${sendResult.messageId}`);
                                        await updateJobAfterMessageSent(job.jobId, sendResult, messageText);
                                        sentCount++;

                                        GM_notification({
                                            text: `Wiadomość wysłana do ${job.buyerName || job.buyerId}`,
                                            title: '✅ Wysłano',
                                            timeout: 3000
                                        });
                                    } else {
                                        throw new Error(sendResult.error || 'Send failed');
                                    }

                                    document.getElementById('ai-message-modal')?.remove();
                                    resolve();
                                } catch (error) {
                                    console.error('   ❌ Error sending message:', error);
                                    errorCount++;
                                    GM_notification({
                                        text: `Błąd wysyłania: ${error.message}`,
                                        title: '❌ Błąd',
                                        timeout: 5000
                                    });
                                    document.getElementById('ai-message-modal')?.remove();
                                    resolve();
                                }
                            },
                            // onRegenerate
                            async () => {
                                const newResult = await generateAIMessage({
                                    reviewText: job.reviewText || '',
                                    reviewRating: job.reviewRating || 1,
                                    buyerName: job.buyerName || job.buyerId,
                                    offerName: job.offerName,
                                    reviewAdvantages: job.reviewAdvantages || '',
                                    reviewDisadvantages: job.reviewDisadvantages || ''
                                });
                                if (newResult.success) {
                                    document.querySelector('#message-text').value = newResult.message;
                                    document.querySelector('#btn-regenerate').textContent = '🔄 Regeneruj AI';
                                    document.querySelector('#btn-regenerate').disabled = false;
                                }
                            },
                            // onSkip
                            () => {
                                console.log('   ⏭️ Job skipped by user');
                                skippedCount++;
                                resolve();
                            }
                        );
                    });

                    processedCount++;

                } catch (error) {
                    console.error(`   ❌ Error processing job ${job.jobId}:`, error);
                    errorCount++;
                    GM_notification({
                        text: `Błąd w Job #${job.jobId}: ${error.message}`,
                        title: '❌ Błąd',
                        timeout: 5000
                    });
                }
            }

            // Final summary
            const summary = `Zakończono!\n✅ Wysłano: ${sentCount}\n⏭️ Pominięto: ${skippedCount}\n❌ Błędy: ${errorCount}`;

            GM_notification({
                text: summary,
                title: '🚀 Przetwarzanie zakończone',
                timeout: 5000
            });

            console.log('=== 🚀 NEGATIVE REVIEWS WORKFLOW COMPLETED ===');
            console.log(summary.replace(/\n/g, ' | '));

        } catch (error) {
            console.error('❌ Workflow error:', error);
            GM_notification({
                text: `Błąd: ${error.message}`,
                title: '❌ Błąd workflow',
                timeout: 5000
            });
        } finally {
            if (button) {
                button.disabled = false;
                button.textContent = '🚀 Przetwórz negatywne opinie';
            }
        }
    }

    /**
     * Main AI Messaging workflow - process jobs ready for messaging
     * @deprecated Use handleProcessNegativeReviews() instead
     */
    async function handleAIMessaging() {
        const button = document.getElementById('ai-messaging-btn');
        if (button) {
            button.disabled = true;
            button.textContent = '⏳ Pobieram Jobs...';
        }

        try {
            console.log('🤖 Starting AI Messaging workflow...');

            // Get jobs ready for messaging
            const result = await callWebApp('GET_READY_JOBS');
            const jobs = result.jobs || [];

            console.log(`📋 Found ${jobs.length} jobs ready for AI messaging`);

            if (jobs.length === 0) {
                GM_notification({
                    text: 'Brak Jobs gotowych do wysyłki wiadomości.\n\nSprawdź czy:\n1. Jobs mają status READY\n2. Kupujący został znaleziony\n3. Jest ID zamówienia',
                    title: 'ℹ️ Brak Jobs',
                    timeout: 5000
                });
                if (button) {
                    button.disabled = false;
                    button.textContent = '💬 Odpowiedź na negatywne';
                }
                return;
            }

            GM_notification({
                text: `Znaleziono ${jobs.length} Jobs do przetworzenia`,
                title: '💬 Odpowiedzi na negatywne opinie',
                timeout: 3000
            });

            let processedCount = 0;
            let sentCount = 0;
            let skippedCount = 0;
            let errorCount = 0;

            // Process jobs one by one
            for (let i = 0; i < jobs.length; i++) {
                const job = jobs[i];
                console.log(`\n🔄 Processing job ${i + 1}/${jobs.length}: Job #${job.jobId}`);

                if (button) {
                    button.textContent = `⏳ Job ${i + 1}/${jobs.length}...`;
                }

                try {
                    // Generate AI message
                    console.log('🤖 Generating AI message...');
                    const aiResult = await generateAIMessage({
                        reviewText: job.reviewText || '',
                        reviewRating: job.reviewRating || 1,
                        buyerName: job.buyerName || job.buyerId,
                        offerName: job.offerName,
                        reviewAdvantages: job.reviewAdvantages || '',
                        reviewDisadvantages: job.reviewDisadvantages || ''
                    });

                    if (!aiResult.success) {
                        throw new Error(aiResult.error || 'AI generation failed');
                    }

                    // Show editor modal and wait for user action
                    await new Promise((resolve) => {
                        showMessageEditorModal(
                            job,
                            aiResult.message,
                            // onSend
                            async (messageText) => {
                                try {
                                    console.log('📤 Sending message DIRECTLY to Allegro API...');

                                    // Send message directly via OAuth token (faster than Apps Script route)
                                    const sendResult = await sendMessageDirect(
                                        job.buyerId,
                                        job.orderId,
                                        messageText
                                    );

                                    if (sendResult.success) {
                                        console.log(`✅ Message sent successfully for Job #${job.jobId}`);
                                        console.log(`   Message ID: ${sendResult.messageId}, Thread ID: ${sendResult.threadId}`);

                                        // Update job status in sheet
                                        await updateJobAfterMessageSent(job.jobId, sendResult, messageText);

                                        sentCount++;

                                        GM_notification({
                                            text: `Wiadomość wysłana do ${job.buyerName || job.buyerId}\nThread: ${sendResult.threadId || 'N/A'}`,
                                            title: '✅ Wysłano bezpośrednio',
                                            timeout: 3000
                                        });
                                    } else {
                                        throw new Error(sendResult.error || 'Send failed');
                                    }

                                    document.getElementById('ai-message-modal')?.remove();
                                    resolve();
                                } catch (error) {
                                    console.error('❌ Error sending message:', error);
                                    errorCount++;

                                    GM_notification({
                                        text: `Błąd wysyłania: ${error.message}`,
                                        title: '❌ Błąd',
                                        timeout: 5000
                                    });

                                    document.getElementById('ai-message-modal')?.remove();
                                    resolve();
                                }
                            },
                            // onRegenerate
                            async () => {
                                try {
                                    const newResult = await generateAIMessage({
                                        reviewText: job.reviewText || '',
                                        reviewRating: job.reviewRating || 1,
                                        buyerName: job.buyerName || job.buyerId,
                                        offerName: job.offerName,
                                        reviewAdvantages: job.reviewAdvantages || '',
                                        reviewDisadvantages: job.reviewDisadvantages || ''
                                    });

                                    if (newResult.success) {
                                        const textarea = document.querySelector('#message-text');
                                        if (textarea) {
                                            textarea.value = newResult.message;
                                            textarea.dispatchEvent(new Event('input'));
                                        }
                                    }

                                    const btn = document.querySelector('#btn-regenerate');
                                    if (btn) {
                                        btn.disabled = false;
                                        btn.textContent = '🔄 Regeneruj AI';
                                    }
                                } catch (error) {
                                    console.error('❌ Error regenerating:', error);
                                    alert('Błąd regeneracji: ' + error.message);

                                    const btn = document.querySelector('#btn-regenerate');
                                    if (btn) {
                                        btn.disabled = false;
                                        btn.textContent = '🔄 Regeneruj AI';
                                    }
                                }
                            },
                            // onSkip
                            () => {
                                console.log(`⏭️ Skipped Job #${job.jobId}`);
                                skippedCount++;
                                resolve();
                            }
                        );
                    });

                    processedCount++;

                } catch (error) {
                    console.error(`❌ Error processing Job #${job.jobId}:`, error);
                    errorCount++;

                    GM_notification({
                        text: `Błąd dla Job #${job.jobId}: ${error.message}`,
                        title: '❌ Błąd',
                        timeout: 5000
                    });
                }
            }

            // Show final summary
            const summary = `Zakończono!\n✅ Wysłano: ${sentCount}\n⏭️ Pominięto: ${skippedCount}\n❌ Błędy: ${errorCount}`;

            GM_notification({
                text: summary,
                title: '💬 Odpowiedzi zakończone',
                timeout: 5000
            });

            console.log('=== 💬 ODPOWIEDZI NA NEGATYWNE WORKFLOW COMPLETED ===');
            console.log(summary.replace(/\n/g, ' | '));

        } catch (error) {
            console.error('❌ Odpowiedzi workflow error:', error);

            GM_notification({
                text: `Błąd: ${error.message}`,
                title: '❌ Błąd odpowiedzi',
                timeout: 5000
            });
        } finally {
            if (button) {
                button.disabled = false;
                button.textContent = '💬 Odpowiedź na negatywne';
            }
        }
    }

    // ==================== INICJALIZACJA ====================

    function init() {
        console.log('🚀 Monitor Opinii Allegro v' + CONFIG.VERSION + ' zainicjalizowany');

        // Pokaż status konfiguracji
        console.log('📋 Konfiguracja:');
        console.log(`  - Web App URL: ${CONFIG.GOOGLE_SHEETS.WEB_APP_URL ? '✅ Ustawione' : '❌ Brak'}`);

        if (!CONFIG.GOOGLE_SHEETS.WEB_APP_URL) {
            console.warn('⚠️ UWAGA: Nie skonfigurowano Web App!');
            console.log('ℹ️ Kliknij przycisk ⭐ w prawym dolnym rogu aby skonfigurować');
        }

        // Utwórz UI
        createUI();

        console.log('✔️ System gotowy do pracy!');
        console.log('ℹ️ Uruchomienie: Kliknij ⭐ > "🔄 Pobierz i przetwórz Jobs"');
        console.log('📌 Brak pasywnego monitorowania - działa tylko na żądanie');
    }

    // Uruchom gdy DOM będzie gotowy
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
