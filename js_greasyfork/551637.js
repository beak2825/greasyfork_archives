// ==UserScript==
// @name         Cars.com DCAP Highlighter 4.8
// @namespace    http://tampermonkey.net/
// @version      4.9
// @description  Highlight DCAP dealers on Cars.com by name
// @author       Your Name
// @match        https://www.cars.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/551637/Carscom%20DCAP%20Highlighter%2048.user.js
// @updateURL https://update.greasyfork.org/scripts/551637/Carscom%20DCAP%20Highlighter%2048.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const CONFIG = {
        HIGHLIGHT_COLOR: '#e6ffe6',
        BORDER_COLOR: '#00cc00',
        INDICATOR_BG: '#00cc00',
        INITIAL_DELAY: 3000, // Increased for slow loads
        RESCAN_DELAY: 3000,
        SELECTORS: {
            LISTINGS: '.vehicle-card, .vehicle-listing, .sds-vehicle-card, [data-testid="vehicle-card"], .listing-row',
            CONTAINER: '#vehicle-cards-container, .vehicle-cards, .sds-vehicle-grid, .search-results, main, .sds-page-section',
            DEALER: '.vehicle-dealer .dealer-name, .sds-dealer-name, .dealer-info, .sds-dealer, [data-testid="dealer-name"], .dealer-name-text'
        },
        MATCHING: {
            MIN_MATCH_RATIO: 0.7, // Increased from 0.7 for stricter matching
            MIN_MATCH_CHARS: 4,
            MIN_UNIQUE_WORDS: 2 // Require at least 2 unique non-generic words
        }
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
    { name: "Autobahn Motors Mercedes Benz", city: "Belmont" },
    { name: "Emotion Autos", city: "Benicia" },
    { name: "Rio Vista Chevrolet", city: "Buellton" },
    { name: "Community Chevrolet", city: "Burbank" },
    { name: "Putnam Chrsyler Dodge Jeep Ram", city: "Burlingame" },
    { name: "Wii Auto Sales", city: "Canoga Park" },
    { name: "Wholesale Investments", city: "Canoga Park" },
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
    { name: "Chino Hills Ford", city: "Chino" },
    { name: "Steves Chevrolet Of Chowchilla", city: "Chowchilla" },
    { name: "Puente Hills Hyundai", city: "City of Industry" },
    { name: "Puente Hills Toyota", city: "City of Industry" },
    { name: "Puente Hills Ford", city: "City of Industry" },
    { name: "Puente Hills Chrysler Dodge Jeep Ram", city: "City of Industry" },
    { name: "Claremont Toyota", city: "Claremont" },
    { name: "Mazda of Claremont", city: "Claremont" },
    { name: "Volkswagen of Clovis", city: "Clovis" },
    { name: "Toyota Of Clovis", city: "Clovis" },
    { name: "Serramonte Ford", city: "Colma" },
    { name: "Stewart Chrysler Dodge Jeep Ram", city: "Colma" },
    { name: "Golden State Nissan", city: "Colma" },
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
    { name: "Deboss Machinery DBA Deboss Motors", city: "Costa Mesa" },
    { name: "Green Light Auto Wholesale", city: "Daly City" },
    { name: "EZ Auto Sales", city: "Daly City" },
    { name: "Hanlees Chrysler Dodge Jeep Ram Kia", city: "Davis" },
    { name: "Hanlees Davis Toyota", city: "Davis" },
    { name: "Hanlees Davis Chevrolet", city: "Davis" },
    { name: "Hanlees Davis Nissan", city: "Davis" },
    { name: "Downey Nissan", city: "Downey" },
    { name: "Dublin Kia", city: "Dublin" },
    { name: "Auto City Sales", city: "El Cajon" },
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
    { name: "Herman Cook Volkswagen", city: "Encinitas" },
    { name: "Mitsubishi Escondido", city: "Escondido" },
    { name: "Mossy Volkswagen", city: "Escondido" },
    { name: "Hyundai Escondido", city: "Escondido" },
    { name: "Quality Chevrolet", city: "Escondido" },
    { name: "Northwood Auto Plaza", city: "Eureka" },
    { name: "Monarch Ford", city: "Exeter" },
    { name: "Volkswagen Of Fairfield", city: "Fairfield" },
    { name: "Fairfield Chevrolet", city: "Fairfield" },
    { name: "Hanlees Toyota", city: "Fairfield" },
    { name: "Folsom Chevrolet", city: "Folsom" },
    { name: "Folsom Lake Ford", city: "Folsom" },
    { name: "Folsom Lake Kia", city: "Folsom" },
    { name: "Ryvid, Inc.", city: "Fountain Valley" },
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
    { name: "Hyundai Of Gilroy", city: "Gilroy" },
    { name: "Sedona Motors", city: "Glendora" },
    { name: "Cardinale Way Hyundai Of Glendora", city: "Glendora" },
    { name: "Hanford Hyundai", city: "Hanford" },
    { name: "Freeway Toyota Of Hanford", city: "Hanford" },
    { name: "Jim's Auto Sales, INC.", city: "Harbor City" },
    { name: "1st Choice Auto Sales", city: "Hayward" },
    { name: "Hayward Kia", city: "Hayward" },
    { name: "Hayward Mitsubishi", city: "Hayward" },
    { name: "Hayward Nissan", city: "Hayward" },
    { name: "One Subaru of Hayward", city: "Hayward" },
    { name: "S&R Motors", city: "Hayward" },
    { name: "Tim Moran Hyundai Hemet", city: "Hemet" },
    { name: "Tim Moran Chevrolet", city: "Hemet" },
    { name: "Tim Moran Ford", city: "Hemet" },
    { name: "Hollywood Rides inc", city: "Hollywood" },
    { name: "Delillo Chevrolet", city: "Huntington Beach" },
    { name: "Toyota of Huntington Beach", city: "Huntington Beach" },
    { name: "Simpson Chevrolet of Irvine", city: "Irvine" },
    { name: "Kia Of Irvine", city: "Irvine" },
    { name: "Tuttle-click Ford Lincoln", city: "Irvine" },
    { name: "Mesa Luxury Imports", city: "Irvine" },
    { name: "A Buyers Choice", city: "Jurupa Valley" },
    { name: "Hyundai of La Quinta", city: "La Quinta" },
    { name: "Paz Auto Group", city: "Laguna Hills" },
    { name: "Toyota Of Lancaster", city: "Lancaster" },
    { name: "Hawthorne Motors Pre Owned", city: "Lawndale" },
    { name: "Onyx Moto", city: "Lemon Grove" },
    { name: "Livermore Toyota", city: "Livermore" },
    { name: "Mercedes Benz Of Los Angeles", city: "Los Angeles" },
    { name: "KIA Downtown Los Angeles", city: "Los Angeles" },
    { name: "Space Auto Group", city: "Los Angeles" },
    { name: "Finesseacar", city: "Los Angeles" },
    { name: "Polestar", city: "Los Angeles" },
    { name: "CA Automall", city: "Los Angeles" },
    { name: "Madera Car Connection Inc", city: "Madera" },
    { name: "Marin County Ford", city: "Marin" },
    { name: "Auto Resources", city: "Merced" },
    { name: "Envision Toyota of Milpitas", city: "Milpitas" },
    { name: "Modesto Subaru", city: "Modesto" },
    { name: "Central Valley Hyundai", city: "Modesto" },
    { name: "Central Valley Nissan", city: "Modesto" },
    { name: "Central Valley Volkswagen", city: "Modesto" },
    { name: "Central Valley Chrysler Jeep Dodge Ram", city: "Modesto" },
    { name: "American Chevrolet", city: "Modesto" },
    { name: "Roberts Auto Sales", city: "Modesto" },
    { name: "Modesto Mazda", city: "Modesto" },
    { name: "Honda Kawasaki KTM of Modesto", city: "Modesto" },
    { name: "Anstar Auto", city: "Monterey Park" },
    { name: "Jimmy Vasser Chevrolet", city: "Napa" },
    { name: "Jimmy Vasser Toyota", city: "Napa" },
    { name: "Napa Nissan", city: "Napa" },
    { name: "Novato Toyota", city: "Navato" },
    { name: "Face Auto Sales", city: "Newark" },
    { name: "Fremont Ford", city: "Newark" },
    { name: "Millennium Auto Sales", city: "North Highlands" },
    { name: "Hashtag Auto", city: "North Highlands" },
    { name: "Novato Chevrolet", city: "Novato" },
    { name: "Kia Of Marin", city: "Novato" },
    { name: "Steves Chevrolet of Oakdale", city: "Oakdale" },
    { name: "Citrus Motors Ontario Inc", city: "Ontario" },
    { name: "Empire Nissan", city: "Ontario" },
    { name: "Southern California Preowned", city: "Orange" },
    { name: "Premier Car Source", city: "Orange" },
    { name: "Orange Garage Auto, LLC.", city: "Orange" },
    { name: "Dong Car Inc", city: "Orange" },
    { name: "Palm Springs Nissan", city: "Palm Springs" },
    { name: "Thompson Chevrolet Buick GMC", city: "Patterson" },
    { name: "All Star Ford", city: "Pittsburg" },
    { name: "All Star Hyundai", city: "Pittsburg" },
    { name: "D&M Auto Sales", city: "Placentia" },
    { name: "Thompson's Toyota", city: "Placerville" },
    { name: "Dublin Buick GMC", city: "Pleasanton" },
    { name: "Eco Drive LLC", city: "Rancho Cordova" },
    { name: "Jmf Wholesale Autos Llc", city: "Rancho Cucamonga" },
    { name: "Redlands CDJR", city: "Redlands" },
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
    { name: "Auto King", city: "Roseville" },
    { name: "Nissan Of Sacramento", city: "Sacramento" },
    { name: "Niello BMW", city: "Sacramento" },
    { name: "Niello Volvo", city: "Sacramento" },
    { name: "Niello Volkswagen", city: "Sacramento" },
    { name: "Carsight Inc", city: "Sacramento" },
    { name: "Niello Audi", city: "Sacramento" },
    { name: "Future Chevrolet", city: "Sacramento" },
    { name: "Maita Chevrolet", city: "Sacramento / EG" },
    { name: "Salinas Honda", city: "Salinas" },
    { name: "Carlifornia Auto Wholesale", city: "San Bernardino" },
    { name: "Toyota of San Bernardino", city: "San Bernardino" },
    { name: "Ford Of Upland", city: "San Bernardino" },
    { name: "Hyundai Genesis of San Bruno", city: "San Bruno" },
    { name: "Autolink", city: "San Diego" },
    { name: "Mossy Toyota", city: "San Diego" },
    { name: "Mossy Ford", city: "San Diego" },
    { name: "San Diego Pre Owned Motors", city: "San Diego" },
    { name: "Galpin Honda (Boeckmann Automotive)", city: "San Fernando" },
    { name: "San Francisco Toyota", city: "San Francisco" },
    { name: "Dino Motors", city: "San Jose" },
    { name: "Capitol Kia", city: "San Jose" },
    { name: "Capital GMC", city: "San Jose" },
    { name: "Capitol Volkswagen", city: "San Jose" },
    { name: "Bay Area Auto Sales Inc", city: "San Jose" },
    { name: "Stevens Creek Toyota", city: "San Jose" },
    { name: "Capitol Chevrolet", city: "San Jose" },
    { name: "San Leandro Hyundai", city: "San Leandro" },
    { name: "San Leandro Nissan", city: "San Leandro" },
    { name: "FH Dailey Chevrolet", city: "San Leandro" },
    { name: "Hyundai of San Luis Obispo", city: "San Luis Obispo" },
    { name: "Sunset Honda", city: "San Luis Obispo" },
    { name: "Chevrolet San Luis Obispo", city: "San Luis Obispo" },
    { name: "Mercedes San Luis Obispo", city: "San Luis Obispo" },
    { name: "Trax Auto Wholesale", city: "San Mateo" },
    { name: "Marin Mazda", city: "San Rafael" },
    { name: "Carpapapa Auto Group", city: "Santa Ana" },
    { name: "Santa Barbara Chrysler Dodge Jeep Ram Fiat", city: "Santa Barbara" },
    { name: "Sunnyvale Volkswagen", city: "Santa Clara" },
    { name: "Starfire Auto Inc", city: "Santa Clara" },
    { name: "Enterprise Car Sales", city: "Santa Clara" },
    { name: "Santa Cruz Chrysler Dodge Jeep Ram", city: "Santa Cruz" },
    { name: "Santa Cruz Volkswagen", city: "Santa Cruz" },
    { name: "North Bay Ford", city: "Santa Cruz" },
    { name: "Kia Santa Maria", city: "Santa Maria" },
    { name: "Honda Santa Monica", city: "Santa Monica" },
    { name: "Subaru Santa Monica", city: "Santa Monica" },
    { name: "Manly Hyundai", city: "Santa Rosa" },
    { name: "Platinum Chevrolet", city: "Santa Rosa" },
    { name: "Seaside Chrysler Dodge Jeep Ram", city: "Seaside" },
    { name: "Premier Hyundai of Seaside", city: "Seaside" },
    { name: "Richland Chevrolet Co", city: "Shafter" },
    { name: "Shingle Springs Subaru", city: "Shingle Springs" },
    { name: "Fairfield Subaru", city: "Solano" },
    { name: "Audi Napa Valley", city: "Solano" },
    { name: "EuroCycle Sonoma", city: "Sonoma" },
    { name: "Sager Ford", city: "St. Helena" },
    { name: "Stevens Creek Kia", city: "Stevens Creek" },
    { name: "Stevens Creek Hyundai", city: "Stevens Creek" },
    { name: "Stockton Nissan", city: "Stockton" },
    { name: "Toyota Town Of Stockton", city: "Stockton" },
    { name: "Electric Auto Group", city: "Stockton" },
    { name: "Mega Motors Inc.", city: "Stockton" },
    { name: "209 Motors", city: "Stockton" },
    { name: "Beas Auto Sales Corporation", city: "Stockton" },
    { name: "Stockton Honda", city: "Stockton" },
    { name: "Stockton Hyundai", city: "Stockton" },
    { name: "Hollywood Rides Inc", city: "Studio City" },
    { name: "Toyota of Sunnyvale", city: "Sunnyvale" },
    { name: "Paradise Chevrolet Cadillac", city: "Temecula" },
    { name: "Allen Motors", city: "Thousand Oaks" },
    { name: "Nissan of Torrence", city: "Torrance" },
    { name: "DCH Toyota Of Torrance", city: "Torrance" },
    { name: "Tracy Ford", city: "Tracy" },
    { name: "Harvey Auto Group", city: "Tracy" },
    { name: "Tracy Honda", city: "Tracy" },
    { name: "Auto Natix", city: "Tulare" },
    { name: "Smith Chevrolet Co. Inc.", city: "Turlock" },
    { name: "Tustin Toyota", city: "Tustin" },
    { name: "Hyundai Of Vacaville", city: "Vacaville" },
    { name: "Nissan of Valencia", city: "Valencia" },
    { name: "Vallejo Hyundai", city: "Vallejo" },
    { name: "Vallejo Dodge Jeep Ram", city: "Vallejo" },
    { name: "Honda of Vallejo", city: "Vallejo" },
    { name: "Universal Mitsubishi", city: "Van Nuys" },
    { name: "Van Nuys Kia", city: "Van Nuys" },
    { name: "Kirby KIA Of Ventura", city: "Ventura" },
    { name: "Bunnin Chevrolet Of Fillmore", city: "Ventura" },
    { name: "Ocean Honda Ventura", city: "Ventura" },
    { name: "4 Crown Dodge", city: "Ventura" },
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
    { name: "Plug In Auto", city: "West Covina" },
    { name: "Plug-In Auto", city: "West Covina" },
    { name: "Plug In Auto Sales", city: "West Covina" },
    { name: "Trusted Auto", city: "West Sacramento" },
    { name: "Beach Cities Toyota Westminster", city: "Westminster" },
    { name: "EuroCycle Sonoma", city: "Windsor (Solano)" },
    { name: "Joshua Tree Chrysler Dodge Jeep Ram", city: "Yucca Valley" }
];
    const processedListings = new Set();

    // Generic brand/type words that shouldn't be used for unique matching
    const GENERIC_WORDS = new Set([
        'auto', 'automotive', 'motors', 'motor', 'sales', 'group', 'inc', 'llc', 'corp',
        'company', 'co', 'dealer', 'dealership', 'used', 'cars', 'car', 'truck', 'trucks',
        // Brand names that are too common
        'toyota', 'honda', 'ford', 'chevrolet', 'chevy', 'nissan', 'hyundai', 'kia',
        'mazda', 'subaru', 'volkswagen', 'vw', 'bmw', 'mercedes', 'benz', 'audi',
        'lexus', 'acura', 'infiniti', 'cadillac', 'buick', 'gmc', 'jeep', 'dodge',
        'ram', 'chrysler', 'mitsubishi', 'volvo', 'jaguar', 'land', 'rover',
        'porsche', 'ferrari', 'lamborghini', 'maserati', 'bentley', 'tesla',
        // Location words
        'north', 'south', 'east', 'west', 'central', 'downtown', 'city', 'county',
        'valley', 'hills', 'beach', 'coast', 'bay', 'lake', 'river', 'mountain',
        // Generic descriptors
        'new', 'pre', 'owned', 'certified', 'premium', 'luxury', 'import', 'domestic',
        'family', 'friendly', 'quality', 'best', 'top', 'premier', 'elite', 'select'
    ]);

    function normalize(str) {
        if (!str) return '';
        return str.toLowerCase().replace(/[^a-z0-9]/gi, ' ').replace(/\s+/g, ' ').trim();
    }

    function generateAliases(name) {
        const norm = normalize(name);
        const aliases = [norm];

        // Add specific aliases for known dealers
        if (name.includes('KIA Downtown Los Angeles')) {
            aliases.push('kia downtown la', 'kia downtown');
        }
        if (name.includes('Paz Auto Group')) {
            aliases.push('paz auto');
        }

        return aliases;
    }

    function getUniqueWords(text) {
        return normalize(text).split(' ')
            .filter(word => word.length >= CONFIG.MATCHING.MIN_MATCH_CHARS)
            .filter(word => !GENERIC_WORDS.has(word));
    }

    // Pre-process dealers with unique words and aliases
    const normalizedDealers = dcapDealers.map(dealer => ({
        ...dealer,
        normName: normalize(dealer.name),
        uniqueWords: getUniqueWords(dealer.name),
        aliases: generateAliases(dealer.name)
    }));

    function isDealerMatch(text, dealer) {
        if (!text) return false;
        const normText = normalize(text);
        console.log('[DCAP Cars.com] Checking match for:', normText, 'against dealer:', dealer.normName);

        // Filter known false positives more aggressively
        if (normText.includes('stg') && normText.includes('auto') && normText.includes('group')) return false;
        if (normText.includes('oc chief')) return false;
        if (normText.includes('premium autos')) return false;
        if (normText.includes('westcoast auto sales')) return false;

        // Exact match or alias match (most reliable)
        for (const alias of dealer.aliases) {
            if (normText === alias || normText.includes(alias)) {
                console.log('[DCAP Cars.com] Exact or alias match:', alias);
                return true;
            }
        }

        // For word-based matching, require more unique identifiers
        if (dealer.uniqueWords.length === 0) {
            console.log('[DCAP Cars.com] No unique words for dealer:', dealer.name);
            return false;
        }

        // Must have at least minimum unique words to consider matching
        if (dealer.uniqueWords.length < CONFIG.MATCHING.MIN_UNIQUE_WORDS) {
            console.log('[DCAP Cars.com] Dealer has too few unique words:', dealer.name, dealer.uniqueWords);
            return false;
        }

        const textUniqueWords = new Set(getUniqueWords(text));
        const matchedUniqueWords = dealer.uniqueWords.filter(word => textUniqueWords.has(word));

        if (matchedUniqueWords.length === 0) {
            console.log('[DCAP Cars.com] No unique word matches for:', normText);
            return false;
        }

        const uniqueRatio = matchedUniqueWords.length / dealer.uniqueWords.length;

        // Require higher ratio for unique words and ensure we have multiple matches
        if (uniqueRatio >= CONFIG.MATCHING.MIN_MATCH_RATIO && matchedUniqueWords.length >= CONFIG.MATCHING.MIN_UNIQUE_WORDS) {
            console.log('[DCAP Cars.com] Unique word match ratio:', uniqueRatio, 'unique words:', matchedUniqueWords);
            return true;
        }

        console.log('[DCAP Cars.com] No sufficient match for:', normText, 'ratio:', uniqueRatio, 'matches:', matchedUniqueWords);
        return false;
    }

    function getListingId(listingEl) {
        if (!listingEl) return null;
        if (!listingEl.dataset.dcapId) {
            const position = Array.from(document.querySelectorAll(CONFIG.SELECTORS.LISTINGS)).indexOf(listingEl);
            listingEl.dataset.dcapId = `listing-${position}`;
        }
        return listingEl.dataset.dcapId;
    }

    function highlightDealerElement(el, dealer) {
        if (!el) return;
        if (el.querySelector('.dcap-badge')) return;

        el.style.backgroundColor = CONFIG.HIGHLIGHT_COLOR;
        el.style.border = `2px solid ${CONFIG.BORDER_COLOR}`;
        el.style.position = 'relative';

        const badge = document.createElement('div');
        badge.className = 'dcap-badge';
        badge.textContent = 'DCAP';
        badge.title = `Matched dealer: ${dealer.name}`;
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
        el.dataset.dcapDealer = dealer.name;
        processedListings.add(id);
        console.log('[DCAP Cars.com] Successfully highlighted listing:', id, 'for dealer:', dealer.name);
    }

    function scanListings() {
        console.log('[DCAP Cars.com] Starting scan of listings');
        const listings = document.querySelectorAll(CONFIG.SELECTORS.LISTINGS);
        console.log('[DCAP Cars.com] Found', listings.length, 'total listings');

        listings.forEach(listing => {
            if (!listing || listing.dataset.dcapProcessed || listing.querySelector('.dcap-badge')) {
                return;
            }

            const dealerEls = listing.querySelectorAll(CONFIG.SELECTORS.DEALER);
            if (dealerEls.length === 0) {
                console.log('[DCAP Cars.com] No dealer elements found in listing:', getListingId(listing));
                // Mark as processed to avoid rescanning
                listing.dataset.dcapProcessed = 'true';
                return;
            }

            let matched = false;
            dealerEls.forEach(el => {
                if (matched) return; // Skip if already matched

                const text = el.textContent?.trim();
                if (!text) {
                    console.log('[DCAP Cars.com] Empty dealer text in listing:', getListingId(listing));
                    return;
                }

                console.log('[DCAP Cars.com] Checking dealer text:', text);
                const dealer = normalizedDealers.find(d => isDealerMatch(text, d));
                if (dealer) {
                    console.log('[DCAP Cars.com] Direct name match found for dealer:', dealer.name);
                    highlightDealerElement(listing, dealer);
                    matched = true;
                } else {
                    console.log('[DCAP Cars.com] No match for:', text);
                }
            });

            // Mark as processed even if no match to avoid rescanning
            if (!matched) {
                listing.dataset.dcapProcessed = 'true';
                processedListings.add(getListingId(listing));
            }
        });
    }

    function init() {
        console.log('[DCAP Cars.com] Initializing Cars.com DCAP Highlighter v4.9');
        const style = document.createElement('style');
        style.textContent = `
            .dcap-badge {
                box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                transition: all 0.2s ease;
            }
            .dcap-badge:hover {
                transform: scale(1.1);
            }
        `;
        document.head.appendChild(style);

        setTimeout(() => {
            console.log('[DCAP Cars.com] Running initial scan');
            scanListings();
            setInterval(scanListings, CONFIG.RESCAN_DELAY);

            // Set up mutation observer for dynamic content
            const container = document.querySelector(CONFIG.SELECTORS.CONTAINER);
            if (container) {
                console.log('[DCAP Cars.com] Setting up mutation observer');
                const observer = new MutationObserver(() => {
                    console.log('[DCAP Cars.com] New listings detected, scheduling scan');
                    setTimeout(scanListings, 500);
                });
                observer.observe(container, { childList: true, subtree: true });
            } else {
                console.log('[DCAP Cars.com] Warning: Container not found for mutation observer');
            }
        }, CONFIG.INITIAL_DELAY);

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                console.log('[DCAP Cars.com] DOM content loaded, re-running scan');
                scanListings();
            });
        }
    }

    try {
        init();
    } catch (error) {
        console.error('[DCAP Cars.com] Initialization error:', error);
    }
})();