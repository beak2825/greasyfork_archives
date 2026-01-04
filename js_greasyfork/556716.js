// ==UserScript==
// @name         DCAP Dealer Highlighter (Unified)
// @namespace    https://greasyfork.org/en/users/1493936-sambrears
// @version      7.0
// @description  Highlight DCAP dealers on both AutoTrader and Cars.com with enhanced matching
// @author       sambrears
// @match        https://www.autotrader.com/*
// @match        https://www.cars.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/556716/DCAP%20Dealer%20Highlighter%20%28Unified%29.user.js
// @updateURL https://update.greasyfork.org/scripts/556716/DCAP%20Dealer%20Highlighter%20%28Unified%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Detect which site we're on
    const SITE = window.location.hostname.includes('autotrader') ? 'autotrader' : 'cars.com';

    const CONFIG = {
        SITE: SITE,
        HIGHLIGHT_COLOR: '#e6ffe6',
        BORDER_COLOR: '#00cc00',
        INDICATOR_BG: '#00cc00',
        DEBOUNCE_DELAY: 100,
        INITIAL_DELAY: 500,
        RESCAN_DELAY: 15000,
        BATCH_SIZE: 5,
        SELECTORS: {
            autotrader: {
                LISTINGS: '.inventory-listing, .inventory-card, .vehicle-card-main, [data-qaid="cntnr-lstng-card"], [data-testid="vehicle-card"], .listing-card, .item-card-body, .listing-footer',
                CONTAINER: '#searchResults, .results-container, .srp-results, [data-qaid="cntnr-srp-results"], [data-testid="srp-results"], .search-results, .listings-container, main',
                DEALER: '[data-cmp="dealerName"], .dealer-name, [data-qaid="dlr-name"], [data-testid="dealer-name"], .seller-name, .dealer-info, .card-dealer, .text-subdued, .text-subdued span.text-bold, [data-analytics-name="dealerName"]'
            },
            'cars.com': {
                LISTINGS: '.vehicle-card, .vehicle-listing, .sds-vehicle-card, [data-testid="vehicle-card"], .listing-row',
                CONTAINER: '#vehicle-cards-container, .vehicle-cards, .sds-vehicle-grid, .search-results, main, .sds-page-section',
                DEALER: '.vehicle-dealer .dealer-name, .sds-dealer-name, .dealer-info, .sds-dealer, [data-testid="dealer-name"], .dealer-name-text'
            }
        },
        MATCHING: {
            MIN_MATCH_RATIO: 0.7,
            MIN_MATCH_CHARS: 3,
            MIN_UNIQUE_WORDS: 2,
            TYPO_SIMILARITY_THRESHOLD: 0.9
        },
        DEBUG: {
            LOG_MATCHES: false,
            LOG_FAILURES: false
        }
    };

    // Get site-specific selectors
    const SITE_CONFIG = CONFIG.SELECTORS[SITE];

    // Dictionary for expanding common abbreviations
    const ABBREVIATIONS = {
        'cdjr': 'chrysler dodge jeep ram',
        'vw': 'volkswagen',
        'chevy': 'chevrolet',
        'gmc': 'general motors company',
        'buick gmc': 'buick general motors company',
        'la': 'los angeles',
        'sf': 'san francisco',
        'socal': 'southern california',
        'norcal': 'northern california',
        'oc': 'orange county',
        'eg': 'elk grove'
    };

    const dcapDealers = [
    { name: "Bravo CDJR Of Alhambra", city: "Alhambra" },
    { name: "Anaheim Hyundai", city: "Anaheim" },
    { name: "Antioch Chrysler Jeep Dodge", city: "Antioch" },
    { name: "Antioch Nissan", city: "Antioch" },
    { name: "Antioch Toyota", city: "Antioch" },
    { name: "Dealers Choice", city: "Atascadero" },
    { name: "Dupratt Ford Auburn", city: "Auburn" },
    { name: "Three Way Chevrolet Co", city: "Bakersfield" },
    { name: "Nissan Of Bakersfield", city: "Bakersfield" },
    { name: "Audi Bakersfield", city: "Bakersfield" },
    { name: "Autobahn Motors Mercedes Benz", city: "Belmont" },
    { name: "Emotion Autos", city: "Benicia" },
    { name: "Rio Vista Chevrolet", city: "Buellton" },
    { name: "Premier Chevrolet", city: "Buena Park" },
    { name: "Community Chevrolet", city: "Burbank" },
    { name: "Putnam Chrysler Dodge Jeep Ram", city: "Burlingame" },
    { name: "Wii Auto Sales", city: "Canoga Park" },
    { name: "Premier Chevrolet Of Carlsbad", city: "Carlsbad" },
    { name: "AutoNation Mazda Carlsbad", city: "Carlsbad" },
    { name: "BMW of Carlsbad", city: "Carlsbad" },
    { name: "Premier Cadillac Buick GMC of Carlsbad", city: "Carlsbad" },
    { name: "Kia Of Carson", city: "Carson" },
    { name: "Rose Motorcars", city: "Castro Valley" },
    { name: "Jessup Auto Plaza", city: "Cathedral City" },
    { name: "McKenna Cerritos VW", city: "Cerritos" },
    { name: "Chico Hyundai", city: "Chico" },
    { name: "Chico Nissan", city: "Chico" },
    { name: "Chuck Patterson Toyota", city: "Chico" },
    { name: "Chino Hills Ford", city: "Chino" },
    { name: "Puente Hills Hyundai", city: "City of Industry" },
    { name: "Puente Hills Toyota", city: "City of Industry" },
    { name: "Puente Hills Ford", city: "City of Industry" },
    { name: "Puente Hills Chrysler Dodge Jeep Ram", city: "City of Industry" },
    { name: "Claremont Toyota", city: "Claremont" },
    { name: "Mazda of Claremont", city: "Claremont" },
    { name: "Volkswagen of Clovis", city: "Clovis" },
    { name: "Toyota Of Clovis", city: "Clovis" },
    { name: "Serramonte Ford", city: "Colma" },
    { name: "Serramonte Kia", city: "Colma" },
    { name: "Serramonte Volkswagen", city: "Colma" },
    { name: "Serramonte Subaru", city: "Colma" },
    { name: "Stewart Chrysler Dodge Jeep Ram", city: "Colma" },
    { name: "Golden State Nissan", city: "Colma" },
    { name: "Hoblit Chevrolet GMC", city: "Colusa" },
    { name: "Hoblit Ford", city: "Colusa" },
    { name: "Concord Nissan", city: "Concord" },
    { name: "Sigma Auto Group Inc.", city: "Concord" },
    { name: "Lexus Of Concord", city: "Concord" },
    { name: "Enterprise Car Sales", city: "Concord" },
    { name: "Auto Import Sales", city: "Contra Costa" },
    { name: "Cardinale Way Volkswagen", city: "Corona" },
    { name: "SAG California", city: "Corona" },
    { name: "Newport Fisker", city: "Costa Mesa" },
    { name: "Connell Chevrolet", city: "Costa Mesa" },
    { name: "Carbecco", city: "Costa Mesa" },
    { name: "California Beemers Teslers", city: "Costa Mesa" },
    { name: "Green Light Auto Wholesale", city: "Daly City" },
    { name: "EZ Auto Sales", city: "Daly City" },
    { name: "Century Auto Credit, LLC", city: "Daly City" },
    { name: "Hanlees Chrysler Dodge Jeep Ram Kia", city: "Davis" },
    { name: "Hanlees Davis Toyota", city: "Davis" },
    { name: "Hanlees Davis Chevrolet", city: "Davis" },
    { name: "Hanlees Davis Nissan", city: "Davis" },
    { name: "Downey Nissan", city: "Downey" },
    { name: "Dublin Kia", city: "Dublin" },
    { name: "Auto City Sales", city: "El Cajon" },
    { name: "El Cajon Ford", city: "El Cajon" },
    { name: "Edition Motors LLC", city: "El Monte" },
    { name: "Longo Toyota", city: "El Monte" },
    { name: "Apollo Auto Inc", city: "El Monte" },
    { name: "Focus Auto Service", city: "El Monte" },
    { name: "Lucy Auto Sales", city: "El Monte" },
    { name: "Nissan Elk Grove", city: "Elk Grove" },
    { name: "Mazda Elk Grove", city: "Elk Grove" },
    { name: "Elk Grove Volkswagen", city: "Elk Grove" },
    { name: "Elk Grove Audi", city: "Elk Grove" },
    { name: "Elk Grove Toyota", city: "Elk Grove" },
    { name: "Elk Grove Hyundai", city: "Elk Grove" },
    { name: "Herman Cook Volkswagen", city: "Encinitas" },
    { name: "Mossy Volkswagen & Mitsubishi Escondido", city: "Escondido" },
    { name: "Hyundai Escondido", city: "Escondido" },
    { name: "Quality Chevrolet", city: "Escondido" },
    { name: "Northwood Auto Plaza", city: "Eureka" },
    { name: "Harper Motors", city: "Eureka" },
    { name: "Monarch Ford", city: "Exeter" },
    { name: "Volkswagen Of Fairfield", city: "Fairfield" },
    { name: "Fairfield Chevrolet", city: "Fairfield" },
    { name: "Hanlees Toyota", city: "Fairfield" },
    { name: "Folsom Chevrolet", city: "Folsom" },
    { name: "Folsom Lake Ford", city: "Folsom" },
    { name: "Folsom Lake Kia", city: "Folsom" },
    { name: "Folsom Lake Hyundai", city: "Folsom" },
    { name: "Sierra Auto Center", city: "Fowler" },
    { name: "Premier Nissan of Fremont", city: "Fremont" },
    { name: "Premier Subaru of Fremont", city: "Fremont" },
    { name: "Lithia Ford Of Fresno", city: "Fresno" },
    { name: "Sierra Auto Center", city: "Fresno" },
    { name: "Sams Auto Sales", city: "Fresno" },
    { name: "Blackstone Chevrolet", city: "Fresno" },
    { name: "Blackstone Cadillac", city: "Fresno" },
    { name: "BMW Fresno", city: "Fresno" },
    { name: "Ocean Subaru Of Fullerton", city: "Fullerton" },
    { name: "VW Of Garden Grove", city: "Garden Grove" },
    { name: "Simpson Chevrolet Of Garden Grove", city: "Garden Grove" },
    { name: "Garden Grove Hyundai", city: "Garden Grove" },
    { name: "Hyundai Of Gilroy", city: "Gilroy" },
    { name: "Sedona Motors", city: "Glendora" },
    { name: "Cardinale Way Hyundai Of Glendora", city: "Glendora" },
    { name: "Hanford Hyundai", city: "Hanford" },
    { name: "Freeway Toyota Of Hanford", city: "Hanford" },
    { name: "1st Choice Auto Sales", city: "Hayward" },
    { name: "Hayward Kia", city: "Hayward" },
    { name: "Hayward Mitsubishi", city: "Hayward" },
    { name: "Hayward Nissan", city: "Hayward" },
    { name: "One Subaru of Hayward", city: "Hayward" },
    { name: "Tim Moran Hyundai Hemet", city: "Hemet" },
    { name: "Tim Moran Chevrolet", city: "Hemet" },
    { name: "Tim Moran Ford", city: "Hemet" },
    { name: "Hollywood Rides inc", city: "Hollywood" },
    { name: "Delillo Chevrolet", city: "Huntington Beach" },
    { name: "Toyota of Huntington Beach", city: "Huntington Beach" },
    { name: "Carster", city: "Huntington Beach" },
    { name: "Simpson Chevrolet of Irvine", city: "Irvine" },
    { name: "Kia Of Irvine", city: "Irvine" },
    { name: "Tuttle-click Ford Lincoln", city: "Irvine" },
    { name: "Mesa Luxury Imports", city: "Irvine" },
    { name: "A Buyers Choice", city: "Jurupa Valley" },
    { name: "Paz Auto Group", city: "Laguna Hills" },
    { name: "Hyundai of La Quinta", city: "La Quinta" },
    { name: "Toyota Of Lancaster", city: "Lancaster" },
    { name: "Antelope Valley Chevrolet", city: "Lancaster" },
    { name: "Antelope Valley GMC Cadillac", city: "Palmdale" },
    { name: "Hawthorne Motors Pre Owned", city: "Lawndale" },
    { name: "Mercedes Benz Of Los Angeles", city: "Los Angeles" },
    { name: "KIA Downtown Los Angeles", city: "Los Angeles" },
    { name: "Space Auto Group", city: "Los Angeles" },
    { name: "Finesseacar", city: "Los Angeles" },
    { name: "Polestar", city: "Los Angeles" },
    { name: "Madera Car Connection Inc", city: "Madera" },
    { name: "Marin County Ford", city: "Marin" },
    { name: "Modesto Subaru", city: "Modesto" },
    { name: "Central Valley Hyundai", city: "Modesto" },
    { name: "Central Valley Nissan", city: "Modesto" },
    { name: "Central Valley Volkswagen", city: "Modesto" },
    { name: "American Chevrolet", city: "Modesto" },
    { name: "Roberts Auto Sales", city: "Modesto" },
    { name: "Modesto Mazda", city: "Modesto" },
    { name: "Central Valley Chrysler Jeep Dodge Ram", city: "Modesto" },
    { name: "Anstar Auto", city: "Monterey Park" },
    { name: "Jimmy Vasser Chevrolet", city: "Napa" },
    { name: "Jimmy Vasser Toyota", city: "Napa" },
    { name: "Napa Nissan", city: "Napa" },
    { name: "Silveria Chevrolet", city: "Napa" },
    { name: "Novato Toyota", city: "Navato" },
    { name: "Face Auto Sales", city: "Newark" },
    { name: "Fremont Ford", city: "Newark" },
    { name: "Millennium Auto Sales", city: "North Highlands" },
    { name: "Novato Chevrolet", city: "Novato" },
    { name: "Kia Of Marin", city: "Novato" },
    { name: "Steves Chevrolet of Oakdale", city: "Oakdale" },
    { name: "VW of Oakland", city: "Oakland" },
    { name: "Citrus Motors Ontario Inc", city: "Ontario" },
    { name: "Empire Nissan", city: "Ontario" },
    { name: "Southern California Preowned", city: "Orange" },
    { name: "Premier Car Source", city: "Orange" },
    { name: "Orange Garage Auto, LLC.", city: "Orange" },
    { name: "Dong Car Inc", city: "Orange" },
    { name: "Auto Facil Club", city: "Orange" },
    { name: "Villa Ford", city: "Orange" },
    { name: "Oxnard Mitsubishi", city: "Oxnard" },
    { name: "Palm Springs Nissan", city: "Palm Springs" },
    { name: "Thompson Chevrolet Buick GMC", city: "Patterson" },
    { name: "All Star Ford", city: "Pittsburg" },
    { name: "All Star Hyundai", city: "Pittsburg" },
    { name: "Thompson's Toyota", city: "Placerville" },
    { name: "Dublin Buick GMC", city: "Pleasanton" },
    { name: "Channel Island Motor Cars", city: "Port Hueneme" },
    { name: "Eco Drive LLC", city: "Rancho Cordova" },
    { name: "Jmf Wholesale Autos Llc", city: "Rancho Cucamonga" },
    { name: "Redwood City Nissan", city: "Redwood City" },
    { name: "Enterprise Car Sales", city: "Redwood City" },
    { name: "Hilltop Ford Kia", city: "Richmond" },
    { name: "Hilltop Chrysler Jeep Dodge Ram", city: "Richmond" },
    { name: "Virtuous Automotive Group", city: "Riverside" },
    { name: "Xpert Auto Consulting", city: "Riverside" },
    { name: "Cost Less Auto Inc", city: "Rocklin" },
    { name: "East West Trust Inc", city: "Rosemead" },
    { name: "Nextcar Motor Llc", city: "Rosemead" },
    { name: "FJ Motors", city: "Rosemead" },
    { name: "Roseville Hyundai", city: "Roseville" },
    { name: "Future Ford of Roseville", city: "Roseville" },
    { name: "Roseville Chevrolet", city: "Roseville" },
    { name: "USA Car Planet LLC", city: "Roseville" },
    { name: "Nissan Of Sacramento", city: "Sacramento" },
    { name: "Niello BMW", city: "Sacramento" },
    { name: "Niello Volvo", city: "Sacramento" },
    { name: "Niello Volkswagen", city: "Sacramento" },
    { name: "Carsight Inc", city: "Sacramento" },
    { name: "Niello Audi", city: "Sacramento" },
    { name: "Maita Chevrolet", city: "Sacramento / EG" },
    { name: "My Nissan and My Kia", city: "Salinas" },
    { name: "Ford Of Upland", city: "San Bernardino" },
    { name: "CARlifornia Auto Wholesale", city: "San Bernardino" },
    { name: "Toyota of San Bernadino", city: "San Bernadino" },
    { name: "Hyundai Genesis of San Bruno", city: "San Bruno" },
    { name: "Autolink", city: "San Diego" },
    { name: "Mossy Toyota", city: "San Diego" },
    { name: "Mossy Ford", city: "San Diego" },
    { name: "Pacific Honda", city: "San Diego" },
    { name: "Sandiegocarforsale.com", city: "Lemon Grove" },
    { name: "Galpin Honda (Boeckmann Automotive)", city: "San Fernando" },
    { name: "San Francisco Toyota", city: "San Francisco" },
    { name: "Trax Auto Wholesale", city: "San Mateo" },
    { name: "Dino Motors", city: "San Jose" },
    { name: "Capitol Kia", city: "San Jose" },
    { name: "Capital GMC", city: "San Jose" },
    { name: "Capitol Volkswagen", city: "San Jose" },
    { name: "Bay Area Auto Sales Inc", city: "San Jose" },
    { name: "Stevens Creek Toyota", city: "San Jose" },
    { name: "San Leandro Hyundai", city: "San Leandro" },
    { name: "San Leandro Nissan", city: "San Leandro" },
    { name: "FH Dailey Chevrolet", city: "San Leandro" },
    { name: "Hyundai of San Luis Obispo", city: "San Luis Obispo" },
    { name: "Sunset Honda", city: "San Luis Obispo" },
    { name: "Mercedes-Benz & Chevrolet of San Luis Obispo", city: "San Luis Obispo" },
    { name: "Marin Mazda", city: "San Rafael" },
    { name: "Carpapapa Auto Group", city: "Santa Ana" },
    { name: "Santa Barbara Chrysler Dodge Jeep Ram Fiat", city: "Santa Barbara" },
    { name: "Santa Cruz Chrysler Dodge Jeep Ram", city: "Santa Cruz" },
    { name: "Santa Cruz Volkswagen", city: "Santa Cruz" },
    { name: "North Bay Ford", city: "Santa Cruz" },
    { name: "Sunnyvale Volkswagen", city: "Santa Clara" },
    { name: "Starfire Auto Inc", city: "Santa Clara" },
    { name: "Enterprise Car Sales", city: "Santa Clara" },
    { name: "Enterprise Car Sales", city: "Pasadena" },
    { name: "Stevens Creek Nissan", city: "Santa Clara" },
    { name: "Santa Clara Cycle Accessories", city: "Santa Clara" },
    { name: "Kia Santa Maria", city: "Santa Maria" },
    { name: "Honda Santa Monica", city: "Santa Monica" },
    { name: "Manly Hyundai", city: "Santa Rosa" },
    { name: "Platinum Chevrolet", city: "Santa Rosa" },
    { name: "Seaside Chrysler Dodge Jeep Ram", city: "Seaside" },
    { name: "Richland Chevrolet Co", city: "Shafter" },
    { name: "Shingle Springs Subaru", city: "Shingle Springs" },
    { name: "Fairfield Subaru", city: "Solano" },
    { name: "Audi Napa Valley", city: "Solano" },
    { name: "EuroCycle Sonoma", city: "Sonoma" },
    { name: "Sager Ford", city: "St. Helena" },
    { name: "Stockton Nissan", city: "Stockton" },
    { name: "Chase Chevrolet", city: "Stockton" },
    { name: "Toyota Town Of Stockton", city: "Stockton" },
    { name: "Electric Auto Group", city: "Stockton" },
    { name: "Mega Motors Inc.", city: "Stockton" },
    { name: "209 Motors", city: "Stockton" },
    { name: "Beas Auto Sales Corporation", city: "Stockton" },
    { name: "Stockton Honda", city: "Stockton" },
    { name: "Stockton Hyundai", city: "Stockton" },
    { name: "Toyota of Sunnyvale", city: "Sunnyvale" },
    { name: "Hollywood Rides Inc", city: "Studio City" },
    { name: "Allen Motors", city: "Thousand Oaks" },
    { name: "Nissan of Torrence", city: "Torrance" },
    { name: "DCH Toyota Of Torrance", city: "Torrance" },
    { name: "Tracy Ford", city: "Tracy" },
    { name: "Harvey Auto Group - Tracy Honda", city: "Tracy" },
    { name: "Auto Natix", city: "Tulare" },
    { name: "Smith Chevrolet Co. Inc.", city: "Turlock" },
    { name: "Bonander GMC", city: "Turlock" },
    { name: "Tustin Toyota", city: "Tustin" },
    { name: "Hyundai Of Vacaville", city: "Vacaville" },
    { name: "Nissan of Valencia", city: "Valencia" },
    { name: "Vallejo Hyundai", city: "Vallejo" },
    { name: "Vallejo Dodge Jeep Ram", city: "Vallejo" },
    { name: "Honda of Vallejo", city: "Vallejo" },
    { name: "Vallejo Nissan", city: "Vallejo" },
    { name: "Universal Mitsubishi", city: "Van Nuys" },
    { name: "Van Nuys Kia", city: "Van Nuys" },
    { name: "Kirby KIA Of Ventura", city: "Ventura" },
    { name: "Bunnin Chevrolet Of Fillmore", city: "Ventura" },
    { name: "Ocean Honda Ventura", city: "Ventura" },
    { name: "Victorville Mitsubishi", city: "Victorville" },
    { name: "Lampe Chrysler Dodge Jeep Ram", city: "Visalia" },
    { name: "Dealers Choice", city: "Visalia" },
    { name: "Visalia Hyundai", city: "Visalia" },
    { name: "Walnut Creek Cadillac", city: "Walnut Creek" },
    { name: "Walnut Creek Ford", city: "Walnut Creek" },
    { name: "Toyota Walnut Creek", city: "Walnut Creek" },
    { name: "Chevrolet of Watsonville", city: "Watsonville" },
    { name: "Watsonville Cadillac GMC", city: "Watsonville" },
    { name: "Watsonville CDJR", city: "Watsonville" },
    { name: "Watsonville Ford", city: "Watsonville" },
    { name: "Watsonville Chevrolet", city: "Watsonville" },
    { name: "Plug In Auto Sales", city: "West Covina" },
    { name: "Trusted Auto Group", city: "West Sacramento" },
    { name: "Beach Cities Toyota Westminster", city: "Westminster" },
    { name: "Kivano Inc", city: "Woodland Hills" },
    { name: "Joshua Tree Chrysler Dodge Jeep Ram", city: "Yucca Valley" }
];

    let scanInProgress = false;
    let observer = null;
    const processedListings = new Set();

    const GENERIC_WORDS = new Set([
        'auto', 'automotive', 'motors', 'motor', 'sales', 'group', 'inc', 'llc', 'corp', 'company', 'co', 'dealer', 'dealership', 'used', 'cars', 'car', 'truck', 'trucks',
        'toyota', 'honda', 'ford', 'chevrolet', 'nissan', 'hyundai', 'kia', 'mazda', 'subaru', 'volkswagen', 'bmw', 'mercedes', 'benz', 'audi', 'lexus', 'acura', 'infiniti', 'cadillac', 'buick', 'gmc', 'jeep', 'dodge', 'ram', 'chrysler', 'mitsubishi', 'volvo',
        'of', 'the', 'in', 'at',
        'north', 'south', 'east', 'west', 'central', 'downtown', 'city', 'county', 'valley', 'hills', 'beach', 'coast', 'bay', 'lake', 'river', 'mountain',
        'new', 'pre', 'owned', 'certified', 'premium', 'luxury', 'import', 'domestic', 'quality', 'premier'
    ]);

    function debug(...args) {
        if (CONFIG.DEBUG.LOG_MATCHES || CONFIG.DEBUG.LOG_FAILURES) {
            console.log(`[DCAP ${SITE} v7.0]`, ...args);
        }
    }

    function expandAbbreviations(text) {
        let expandedText = ` ${text} `;
        for (const [abbr, expansion] of Object.entries(ABBREVIATIONS)) {
            const regex = new RegExp(`\\s${abbr}\\s`, 'gi');
            expandedText = expandedText.replace(regex, ` ${expansion} `);
        }
        return expandedText.trim();
    }

    function normalize(str) {
        if (!str) return '';
        const expanded = expandAbbreviations(str.toLowerCase());
        return expanded.replace(/[^a-z0-9]/gi, ' ').replace(/\s+/g, ' ').trim();
    }

    // Levenshtein distance function to check for typos
    function levenshtein(s1, s2) {
        // Skip fuzzy matching for very long strings (performance optimization)
        if (s1.length > 50 || s2.length > 50) {
            return Infinity;
        }

        const len1 = s1.length;
        const len2 = s2.length;
        let col = Array(len1 + 1);
        let prevCol = Array(len1 + 1);

        for (let i = 0; i <= len1; i++) {
            prevCol[i] = i;
        }

        for (let i = 1; i <= len2; i++) {
            col[0] = i;
            for (let j = 1; j <= len1; j++) {
                const cost = s1[j - 1] === s2[i - 1] ? 0 : 1;
                col[j] = Math.min(prevCol[j] + 1, col[j - 1] + 1, prevCol[j - 1] + cost);
            }
            [prevCol, col] = [col, prevCol];
        }
        return prevCol[len1];
    }

    function getUniqueWords(text) {
        return text.split(' ').filter(word => word.length >= CONFIG.MATCHING.MIN_MATCH_CHARS && !GENERIC_WORDS.has(word));
    }

    const normalizedDealers = dcapDealers.map(dealer => ({
        ...dealer,
        normName: normalize(dealer.name),
        uniqueWords: getUniqueWords(normalize(dealer.name))
    }));

    function isDealerMatch(textOnPage, dealer) {
        if (!textOnPage) return null;
        const normText = normalize(textOnPage);

        // Validate normalized text
        if (!normText || normText.length < CONFIG.MATCHING.MIN_MATCH_CHARS) {
            return null;
        }

        // --- Level 1: Exact or partial match (fastest) ---
        if (normText.includes(dealer.normName)) {
            debug(`L1 Match (Partial): "${normText}" includes "${dealer.normName}"`);
            return { type: 'name', value: dealer.name };
        }

        // --- Level 2: Unique word set match (handles different word order) ---
        if (dealer.uniqueWords.length >= CONFIG.MATCHING.MIN_UNIQUE_WORDS) {
            const textUniqueWords = new Set(getUniqueWords(normText));
            const matchedUniqueWords = dealer.uniqueWords.filter(word => textUniqueWords.has(word));
            const uniqueRatio = matchedUniqueWords.length / dealer.uniqueWords.length;

            if (uniqueRatio >= CONFIG.MATCHING.MIN_MATCH_RATIO) {
                debug(`L2 Match (Words): Ratio ${uniqueRatio.toFixed(2)} for "${normText}"`, matchedUniqueWords);
                return { type: 'name', value: dealer.name };
            }
        }

        // --- Level 3: Levenshtein similarity match (catches typos) ---
        const distance = levenshtein(normText, dealer.normName);
        const maxLength = Math.max(normText.length, dealer.normName.length);
        if (maxLength === 0) return null;
        const similarity = 1 - distance / maxLength;

        if (similarity >= CONFIG.MATCHING.TYPO_SIMILARITY_THRESHOLD) {
            debug(`L3 Match (Fuzzy): Similarity ${similarity.toFixed(2)} for "${normText}" vs "${dealer.normName}"`);
            return { type: 'fuzzy', value: `Similarity: ${Math.round(similarity*100)}%` };
        }

        debug(`No match for "${normText}"`);
        return null;
    }

    function getListingId(listingEl) {
        if (!listingEl) return null;
        if (!listingEl.dataset.dcapId) {
            const position = Array.from(document.querySelectorAll(SITE_CONFIG.LISTINGS)).indexOf(listingEl);
            const textContent = (listingEl.textContent || '').substring(0, 40).replace(/\s+/g, '');
            listingEl.dataset.dcapId = `listing-${position}-${textContent.length}-${Date.now()}`;
        }
        return listingEl.dataset.dcapId;
    }

    function highlightDealerElement(el, dealer, match) {
        if (!el || el.querySelector('.dcap-badge')) {
            return false;
        }

        try {
            debug('Highlighting element for dealer:', dealer.name, 'listing ID:', getListingId(el));
            el.style.backgroundColor = CONFIG.HIGHLIGHT_COLOR;
            el.style.border = `2px solid ${CONFIG.BORDER_COLOR}`;
            el.style.position = 'relative';

            const badge = document.createElement('div');
            badge.className = 'dcap-badge';
            badge.textContent = `DCAP (${match.type.charAt(0).toUpperCase() + match.type.slice(1)})`;
            badge.title = `Matched: ${dealer.name}\nReason: ${match.value}`;
            Object.assign(badge.style, {
                position: 'absolute',
                top: '5px',
                right: '5px',
                background: CONFIG.INDICATOR_BG,
                color: '#fff',
                padding: '2px 6px',
                fontSize: '12px',
                fontWeight: 'bold',
                borderRadius: '4px',
                zIndex: '1000',
                boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
            });
            el.appendChild(badge);

            const id = getListingId(el);
            el.dataset.dcapProcessed = 'true';
            processedListings.add(id);
            return true;
        } catch (error) {
            console.error('[DCAP] Error highlighting element:', error);
            return false;
        }
    }

    async function processBatch(listings, startIndex) {
        try {
            const endIndex = Math.min(startIndex + CONFIG.BATCH_SIZE, listings.length);
            debug(`Processing batch ${startIndex} to ${endIndex-1} of ${listings.length}`);

            for (let i = startIndex; i < endIndex; i++) {
                const listing = listings[i];
                const listingId = getListingId(listing);
                if (listing.dataset.dcapProcessed === 'true') continue;

                let matched = false;
                const dealerEls = listing.querySelectorAll(SITE_CONFIG.DEALER);

                for (const dealerEl of dealerEls) {
                    const text = dealerEl.textContent.trim();
                    if (!text) continue;

                    for (const dcapDealer of normalizedDealers) {
                        const match = isDealerMatch(text, dcapDealer);
                        if (match) {
                            highlightDealerElement(listing, dcapDealer, match);
                            matched = true;
                            break;
                        }
                    }
                    if (matched) break;
                }

                if (!matched) {
                    listing.dataset.dcapProcessed = 'no-match';
                    processedListings.add(listingId);
                }
            }

            if (endIndex < listings.length) {
                setTimeout(() => processBatch(listings, endIndex), 50);
            } else {
                debug('Finished processing all batches.');
                scanInProgress = false;
            }
        } catch (error) {
            console.error('[DCAP] Error in processBatch:', error);
            scanInProgress = false;
        }
    }

    function scanListings() {
        if (scanInProgress) return;

        try {
            debug('Starting scan of listings');
            scanInProgress = true;
            const listings = Array.from(document.querySelectorAll(SITE_CONFIG.LISTINGS))
                .filter(l => l.dataset.dcapProcessed !== 'true' && l.dataset.dcapProcessed !== 'no-match');

            if (listings.length === 0) {
                debug('No new unprocessed listings found.');
                scanInProgress = false;
                return;
            }
            debug(`Found ${listings.length} new unprocessed listings.`);
            processBatch(listings, 0);
        } catch (error) {
            console.error('[DCAP] Error in scanListings:', error);
            scanInProgress = false;
        }
    }

    function cleanup() {
        try {
            if (observer) {
                observer.disconnect();
                debug('Observer disconnected');
            }
        } catch (error) {
            console.error('[DCAP] Error during cleanup:', error);
        }
    }

    function init() {
        try {
            debug(`Initializing DCAP Dealer Highlighter v7.0 for ${SITE}`);
            const style = document.createElement('style');
            style.textContent = `
                .dcap-badge { transition: all 0.2s ease; }
                .dcap-badge:hover { transform: scale(1.1); box-shadow: 0 2px 5px rgba(0,0,0,0.3); }
            `;
            document.head.appendChild(style);

            setTimeout(() => {
                scanListings();

                observer = new MutationObserver(() => {
                    setTimeout(scanListings, CONFIG.DEBOUNCE_DELAY);
                });

                const container = document.querySelector(SITE_CONFIG.CONTAINER);
                if (container) {
                    observer.observe(container, { childList: true, subtree: true });
                    debug('Mutation observer attached.');
                } else {
                    debug('Warning: Results container not found! Falling back to interval scanning.');
                    setInterval(scanListings, CONFIG.RESCAN_DELAY);
                }
            }, CONFIG.INITIAL_DELAY);

            // Cleanup on page unload
            window.addEventListener('unload', cleanup);
        } catch (error) {
            console.error('[DCAP] Error during initialization:', error);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
