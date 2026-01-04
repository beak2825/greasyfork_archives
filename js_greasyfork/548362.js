// ==UserScript==
// @name         Amazon Vine - Produktprüfung mit Menü (Keywords & ASINs)
// @description  Erster Tag: alle Seiten; ab Tag 2 dynamisch Abbruch bei altem Produkt. Seiten-Delay wird immer eingehalten, auch beim Abbruch. Menü für Keywords/ASIN
// @version      3.7.4
// @match        *://www.amazon.de/vine/vine-items*
// @require      https://code.jquery.com/jquery-3.7.1.min.js
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM_xmlhttpRequest
// @connect      media-amazon.com
// @connect      amazon.de
// @connect      api.pushover.net
// @run-at       document-end
// @namespace    https://greasyfork.org/users/83290
// @downloadURL https://update.greasyfork.org/scripts/548362/Amazon%20Vine%20-%20Produktpr%C3%BCfung%20mit%20Men%C3%BC%20%28Keywords%20%20ASINs%29.user.js
// @updateURL https://update.greasyfork.org/scripts/548362/Amazon%20Vine%20-%20Produktpr%C3%BCfung%20mit%20Men%C3%BC%20%28Keywords%20%20ASINs%29.meta.js
// ==/UserScript==

const CONFIG = {
    PUSHOVER_USER_KEY: 'u7u6ioq46a367zehqk1rz968rzv6yr',
    PUSHOVER_API_TOKEN: 'augogfpc4dvh5pd7tjpd2e3m949372',
    WAIT_TIMES: {
        BETWEEN_PRODUCTS_MIN: 400,
        BETWEEN_PRODUCTS_MAX: 1200,
        BETWEEN_SCANS_MIN: 1500,
        BETWEEN_SCANS_MAX: 3000,
        BETWEEN_PAGES_MIN: 500,
        BETWEEN_PAGES_MAX: 1000
    },
    MAX_PAGES: 100,
    CACHE_MAX_AGE_MS: 3 * 24 * 60 * 60 * 1000,
    PRICE_THRESHOLD: 100,
    ACTIVE_HOURS: { start: 6, end: 22 },
    BATCH_SIZE: 5
};

function getTodayStr() {
    const d = new Date();
    return d.getFullYear() + '-' + (d.getMonth() + 1).toString().padStart(2, '0') + '-' + d.getDate().toString().padStart(2, '0');
}

function normalize(text) {
    return text
        .normalize('NFKD') // Trenne Umlaute
        .replace(/[\u0300-\u036f]/g, "") // Lösche diakritische Zeichen
        .replace(/[.,;:!?"'()\[\]{}<>\/\\]/g, ' ') // Satzzeichen durch Leerzeichen
        .toLowerCase();
}

(async function mainLoop() {
    await createVineMenu();

    while (true) {
        const hour = new Date().getHours();
        if (hour >= CONFIG.ACTIVE_HOURS.start && hour < CONFIG.ACTIVE_HOURS.end) {
            console.log('🔄 Starte neuen Scan-Durchlauf...');
            await runProductCheck();

            const nextDelay = randomDelay(CONFIG.WAIT_TIMES.BETWEEN_SCANS_MIN, CONFIG.WAIT_TIMES.BETWEEN_SCANS_MAX);
            console.log(`⏳ Warte ${Math.floor(nextDelay / 1000)} Sekunden bis zum nächsten Durchlauf...`);
            await delay(nextDelay);
        } else {
            console.log('🌙 Außerhalb aktiver Stunden, Scan übersprungen...');

            // Angepasste Wartezeit: 30 Minuten
            const waitTime = 30 * 60 * 1000; // 30 Minuten in ms
            console.log(`⏳ Warte ${waitTime / 60000} Minuten bis zum nächsten Versuch...`);
            await delay(waitTime);
        }
    }
})();

async function runProductCheck() {
    const keywordList = await loadVineList('keywords');
    const asinList = await loadVineList('asins');
    const checkedMap = await getCheckedProductsMap();

    const todayStr = getTodayStr();
    let lastScanDay = await GM.getValue('last_scan_day', null);
    let isFirstDay = (lastScanDay === null) || (lastScanDay === todayStr);

    const todayMidnight = new Date();
    todayMidnight.setHours(0, 0, 0, 0);
    const midnightMs = todayMidnight.getTime();

    let foundOldProduct = false;

    for (let page = 1; page <= CONFIG.MAX_PAGES; page++) {
        if (!isFirstDay && foundOldProduct) {
            console.log(`🛑 Scan beendet bei Seite ${page-1} wegen erstem alten Produkt im Cache.`);
            break;
        }

        console.log(`📄 Prüfe Seite ${page}...`);
        const html = await fetchPage(page);
        if (!html) continue;

        const doc = new DOMParser().parseFromString(html, 'text/html');
        const productTiles = Array.from(doc.querySelectorAll('.vvp-item-tile'));
        if (productTiles.length === 0) break;

        // --- Batching: alle relevanten neuen Produkte sammeln ---
        let newProductTiles = [];
        for (const tile of productTiles) {
            const asin = tile.querySelector('.vvp-details-btn input[type="submit"]')?.getAttribute("data-asin");
            if (!asin) continue;

            const firstSeen = checkedMap[asin];
            if (!isFirstDay && firstSeen !== undefined && firstSeen < midnightMs) {
                if (!foundOldProduct) {
                    foundOldProduct = true;
                    console.log(`⚠️ Alt-Produkt gefunden (ASIN: ${asin}, ts: ${firstSeen}), Scan beendet ab nächster Seite.`);
                }
                continue;
            }
            
            // Prüfe erst ob bereits im Cache (auch für aktuelle Session)
            if (checkedMap[asin]) {
                // Keine Console-Ausgabe für bereits verarbeitete Produkte
                continue;
            }

            // VORABVERSIONS-CHECK HIER - VOR dem Batching!
            const title = tile.querySelector('.vvp-item-product-title-container')?.textContent.trim() || '';
            const image = tile.querySelector('img')?.src;
            const link = tile.querySelector('a')?.href;
            
            // Verbesserte Vorabversions-Erkennung
            const isPrerelease = 
                // Prüfe auf prerelease-Klassen und IDs
                !!tile.querySelector('.prerelease-title, .pre-release-message, .vvp-badge-prerelease') ||
                // Prüfe auf "Vorab"-Texte (deutsch)
                /vorab|prerelease|pre-release|vorabartikel/i.test(tile.textContent) ||
                // Prüfe Titel auf Vorab-Indikatoren
                /vorab|prerelease|pre-release|vorabartikel/i.test(title);

            if (isPrerelease) {
                console.log(`🚀 VORABVERSION gefunden: ${title} (ASIN: ${asin})`);
                
                // WICHTIG: Sofort im Cache speichern um Duplikate zu vermeiden
                checkedMap[asin] = Date.now();
                
                // Sofortige Benachrichtigung bei Vorabversion (ohne Link wenn nicht vorhanden)
                sendPushoverNotification({
                    asin,
                    title,
                    price: 'Vorabversion',
                    image,
                    link: link || `https://www.amazon.de/vine/vine-items?queue=all_items&page=${page}`, // Fallback zur Vine-Seite
                    page,
                    matchesASIN: false,
                    isPrerelease: true
                }).catch(err => console.error('Fehler bei Vorabversions-Benachrichtigung:', err));

                continue; // NICHT zu newProductTiles hinzufügen - bereits verarbeitet!
            }
            
            // Nur normale Produkte für weitere Verarbeitung sammeln (und nur wenn Link vorhanden)
            if (title && link) {
                newProductTiles.push({ tile, asin });
            } else {
                console.warn(`⚠️ Produkt ohne Link oder Titel übersprungen (ASIN: ${asin})`);
                // Auch diese ASIN cachen um sie nicht nochmal zu verarbeiten
                checkedMap[asin] = Date.now();
            }
        }

        // Cache nach jeder Seite aktualisieren (nicht nur nach Batches)
        await updateCheckedProducts(checkedMap);

        // --- In Batches abarbeiten (nur noch normale Produkte) ---
        for (let i = 0; i < newProductTiles.length; i += CONFIG.BATCH_SIZE) {
            const batch = newProductTiles.slice(i, i + CONFIG.BATCH_SIZE);
            await Promise.all(batch.map(async ({ tile, asin }) => {
                const title = tile.querySelector('.vvp-item-product-title-container')?.textContent.trim() || '';
                const image = tile.querySelector('img')?.src;
                const link = tile.querySelector('a')?.href;
                if (!title || !link) {
                    // Sollte hier nicht mehr passieren, aber sicherheitshalber
                    checkedMap[asin] = Date.now();
                    return;
                }

                console.log(`📦 Neues Produkt: ${title}`);

                const price = await fetchPriceFromASINPage(link);
                if (price !== null) {
                    const normTitle = normalize(title);
                    const matchesKW = keywordList.some(k => {
                        if (!k.trim()) return false;
                        const pattern = new RegExp(`\\b${normalize(k)}\\b`, 'i');
                        return pattern.test(normTitle);
                    });

                    const matchesASIN = asinList.includes(asin);

                    if (price > CONFIG.PRICE_THRESHOLD || matchesKW || matchesASIN) {
                        await sendPushoverNotification({ asin, title, price, image, link, page, matchesASIN, isPrerelease: false });
                        if (matchesASIN) await removeASINFromList(asin);
                    } else {
                        console.log(`⛔ Nicht relevant: ${title} (${price}€)`);
                    }
                } else {
                    console.warn(`⚠️ Preis nicht lesbar für: ${title}`);
                }

                checkedMap[asin] = Date.now();
            }));

            await updateCheckedProducts(checkedMap);

            // Nach jedem Batch ein Delay (zwischen Produkten)
            await delay(randomDelay(CONFIG.WAIT_TIMES.BETWEEN_PRODUCTS_MIN, CONFIG.WAIT_TIMES.BETWEEN_PRODUCTS_MAX));
        }

        // Seiten-Delay IMMER ausführen, auch wenn Next-Break erfolgt!
        const pageDelay = randomDelay(CONFIG.WAIT_TIMES.BETWEEN_PAGES_MIN, CONFIG.WAIT_TIMES.BETWEEN_PAGES_MAX);
        console.log(`⏳ Warte ${pageDelay} ms vor nächster Seite...`);
        await delay(pageDelay);
    }

    if (isFirstDay) await GM.setValue('last_scan_day', todayStr);

    console.log('✅ Durchlauf abgeschlossen.');
}

// === CACHE-FUNKTIONEN ===
async function getCheckedProductsMap() {
    const raw = await GM.getValue('checkedProducts', '{}');
    try {
        const now = Date.now();
        const valid = {};
        for (const [asin, ts] of Object.entries(JSON.parse(raw))) {
            if (now - ts < CONFIG.CACHE_MAX_AGE_MS) valid[asin] = ts;
        }
        return valid;
    } catch (e) {
        return {};
    }
}
async function updateCheckedProducts(map) {
    await GM.setValue('checkedProducts', JSON.stringify(map));
}

// === HTTP, DELAY, IMAGE ===
function fetchPage(pageNum) {
    const url = `https://www.amazon.de/vine/vine-items?queue=all_items&page=${pageNum}`;
    return fetch(url, { credentials: 'include' })
        .then(res => res.ok ? res.text() : null)
        .catch(err => (console.error(`❌ Fehler beim Laden Seite ${pageNum}:`, err), null));
}
function randomDelay(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function delay(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }
function parsePrice(text) {
    if (!text) return null;
    
    // Entferne HTML-Entities
    text = text.replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').trim();
    
    // Deutsche Preisformate
    const patterns = [
        /(\d{1,3}(?:\.\d{3})*),(\d{2})\s*€/,  // 1.234,56€
        /(\d+),(\d{2})\s*€/,                   // 18,99€
        /(\d+)\s*€/                            // 18€
    ];
    
    for (const pattern of patterns) {
        const match = text.match(pattern);
        if (match) {
            if (match[2]) {
                // Hat Dezimalstellen
                let wholePart = match[1].replace(/\./g, ''); // Entferne Tausendertrennzeichen
                return parseFloat(`${wholePart}.${match[2]}`);
            } else {
                // Ganze Zahl
                let wholePart = match[1].replace(/\./g, '');
                return parseFloat(wholePart);
            }
        }
    }
    
    return null;
}

async function fetchPriceFromASINPage(link) {
    return new Promise((resolve) => {
        GM_xmlhttpRequest({
            method: 'GET',
            url: link,
            onload: (res) => {
                if (res.status === 200) {
                    try {
                        const parser = new DOMParser();
                        const doc = parser.parseFromString(res.responseText, 'text/html');

                        // Strategie 1: Suche in spezifischen Hauptpreis-Containern
                        const mainPriceSelectors = [
                            '#corePrice_feature_div .a-price:not(.a-text-price) .a-offscreen',
                            '.a-price[data-a-size="xl"] .a-offscreen',
                            '.a-price[data-a-size="large"] .a-offscreen'
                        ];

                        for (const selector of mainPriceSelectors) {
                            const element = doc.querySelector(selector);
                            if (element) {
                                const priceText = element.textContent.trim();
                                // Überspringe Einheitspreise
                                if (!/pro\s*(kg|l|liter|ml|m2|qm|stück|stk|piece|gram|g)\b/i.test(priceText)) {
                                    const price = parsePrice(priceText);
                                    if (price !== null && price > 0) {
                                        resolve(price);
                                        return;
                                    }
                                }
                            }
                        }

                        // Strategie 2: Suche alle a-price Container (aber filtere besser)
                        const priceContainers = doc.querySelectorAll('span.a-price');
                        const validPrices = [];

                        for (const container of priceContainers) {
                            const offscreenSpan = container.querySelector('span.a-offscreen');
                            if (!offscreenSpan) continue;

                            const priceText = offscreenSpan.textContent.trim();

                            // Erweiterte Filterung für Einheitspreise
                            if (/pro\s*(kg|l|liter|ml|m2|qm|stück|stk|piece|gram|g)\b/i.test(priceText)) continue;
                            if (/\/\s*(kg|l|liter|ml|m2|qm|stück|stk|piece|gram|g)\b/i.test(priceText)) continue;

                            // Prüfe Container-Kontext auf Einheitspreise
                            const parent = container.closest('.aok-relative, .a-size-mini');
                            if (parent && /(pro|per|\/).*?(kg|l|liter|ml|m2|qm|stück|stk|piece|gram|g)\b/i.test(parent.textContent)) continue;

                            const price = parsePrice(priceText);
                            if (price !== null && price > 0) {
                                validPrices.push(price);
                            }
                        }

                        if (validPrices.length > 0) {
                            // Nimm den niedrigsten Preis (meist der Hauptpreis)
                            validPrices.sort((a, b) => a - b);
                            resolve(validPrices[0]);
                            return;
                        }

                        // Strategie 3: Fallback - alle offscreen spans
                        const allOffscreens = doc.querySelectorAll('span.a-offscreen');
                        for (const off of allOffscreens) {
                            const txt = off.textContent.trim();
                            if (/€/.test(txt) && !/pro\s*(kg|l|liter|ml|m2|qm|stück|stk|piece|gram|g)\b/i.test(txt)) {
                                const price = parsePrice(txt);
                                if (price !== null && price > 0) {
                                    resolve(price);
                                    return;
                                }
                            }
                        }

                        // Kein gültiger Preis gefunden
                        resolve(null);
                    } catch (e) {
                        console.error('Fehler beim Preisparsen:', e);
                        resolve(null);
                    }
                } else {
                    resolve(null);
                }
            },
            onerror: () => resolve(null)
        });
    });
}

async function sendPushoverNotification(product) {
    try {
        const imageUrl = optimizeAmazonImageUrl(product.image);
        const imageBlob = await downloadImage(imageUrl);

        let specialMark = '';
        let titlePrefix = '';
        if (product.matchesASIN) {
            specialMark = '❗️ ';
        }
        if (product.isPrerelease) {
            specialMark = '🚀 ';
            titlePrefix = '[VORABVERSION] ';
        }

        const vineLink = `https://www.amazon.de/vine/vine-items?queue=all_items&page=${product.page}`;

        const payload = new FormData();
        payload.append('token', CONFIG.PUSHOVER_API_TOKEN);
        payload.append('user', CONFIG.PUSHOVER_USER_KEY);
        payload.append('message', `${specialMark}📌 ${product.title}\n💶 ${product.price}€\n📄 Seite: ${product.page}\n🔗 Produkt: ${product.link}\n🔗 Vine-Seite: ${vineLink}`);
        payload.append('title', `${titlePrefix}${specialMark}${product.price}€ - Seite ${product.page}`);
        payload.append('url', vineLink); // Vine-Link als URL
        if (imageBlob) payload.append('attachment', imageBlob, 'image.jpg');

        GM_xmlhttpRequest({
            method: 'POST',
            url: 'https://api.pushover.net/1/messages.json',
            data: payload,
            onload: () => console.log(`📲 Benachrichtigung gesendet: ${product.title}`),
            onerror: err => console.error('❌ Fehler bei Benachrichtigung:', err)
        });
    } catch (e) {
        console.error('❌ Fehler bei Pushover:', e);
    }
}

function optimizeAmazonImageUrl(url) {
    return url ? url.split('._')[0] + '._SL300_.jpg' : null;
}
function downloadImage(url) {
    return new Promise(resolve => {
        if (!url) return resolve(null);
        GM_xmlhttpRequest({
            method: 'GET',
            url,
            responseType: 'blob',
            onload: res => resolve(res.status === 200 ? res.response : null),
            onerror: () => resolve(null)
        });
    });
}

// === MENÜ ===
async function createVineMenu() {
    const style = `
        #vineMenuIcon { width:40px; height:40px; cursor:pointer; margin-left:8px; vertical-align:middle; }
        #vineMenuPanel {
            display:none; position:absolute; top:30px; right:0; background:#fff;
            border:1px solid #ccc; border-radius:6px; padding:10px; width:250px; z-index:9999;
            font-family:Arial,sans-serif; font-size:12px; box-shadow:0 2px 6px rgba(0,0,0,0.3);
        }
        #vineMenuPanel textarea { width:100%; height:90px; margin-bottom:5px; font-size:12px; }
        #vineMenuPanel button { width:100%; margin-top:3px; }
    `;
    $('body').append(`<style>${style}</style>`);

    const keywords = await loadVineList('keywords');
    const asins = await loadVineList('asins');

    const menuHtml = `
        <li id="vine-menu-item" class="a-tab-heading" style="position:relative;">
            <img src="https://cdn-icons-png.flaticon.com/512/2099/2099058.png" id="vineMenuIcon" title="Vine-Scan Einstellungen">
            <div id="vineMenuPanel">
                <b>Keywords (Komma getrennt):</b>
                <textarea id="vineKeywords">${keywords.join(', ')}</textarea>
                <b>ASINs (Komma getrennt):</b>
                <textarea id="vineASINs">${asins.join(', ')}</textarea>
                <button id="vineSaveBtn">Speichern</button>
            </div>
        </li>`;

    const target = document.querySelector('#vvp-resources-tab');
    if (target && target.parentNode) {
        target.insertAdjacentHTML('afterend', menuHtml);
    } else {
        console.warn('⚠️ Ressourcen-Tab nicht gefunden, füge Menü oben ein.');
        $('body').prepend(menuHtml);
    }

    $('#vineMenuIcon').click((e) => {
        e.stopPropagation();
        $('#vineMenuPanel').toggle();
    });

    $('#vineSaveBtn').click(async () => {
        const kw = $('#vineKeywords').val().split(',').map(s => s.trim()).filter(Boolean);
        const asins = $('#vineASINs').val().split(',').map(s => s.trim()).filter(Boolean);
        await saveVineList('keywords', kw);
        await saveVineList('asins', asins);
        alert('✅ Gespeichert!');
    });

    $(document).click((e) => {
        if (!$(e.target).closest('#vineMenuPanel, #vineMenuIcon').length) {
            $('#vineMenuPanel').hide();
        }
    });
}

// === Keyword/ASIN Listen ===
async function loadVineList(type) {
    const raw = await GM.getValue(`vine_${type}`, '[]');
    try {
        return JSON.parse(raw);
    } catch (e) {
        return [];
    }
}
async function saveVineList(type, arr) {
    await GM.setValue(`vine_${type}`, JSON.stringify(arr));
}
async function removeASINFromList(asin) {
    const list = await loadVineList('asins');
    const filtered = list.filter(a => a !== asin);
    await saveVineList('asins', filtered);
}