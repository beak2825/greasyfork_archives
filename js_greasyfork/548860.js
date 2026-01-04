// ==UserScript==
// @name         WME PLN Module - Categories Handler
// @version      9.0.0
// @description  Módulo de categorías para WME Place Normalizer. No funciona por sí solo.
// @author       mincho77
// @license      MIT
// @grant        none
// ==/UserScript==
//Función Para Cargar Categorías Desde Google Sheets
async function loadDynamicCategoriesFromSheet(cfg)
{
    const SPREADSHEET_ID = cfg?.spreadsheetId || "1kJDEOn8pKLdqEyhIZ9DdcrHTb_GsoeXgIN4GisrpW2Y";
    const API_KEY       = cfg?.apiKey        || "AIzaSyAQbvIQwSPNWfj6CcVEz5BmwfNkao533i8";
    const RANGE         = cfg?.range         || "Categories!A2:E";
    const TTL_MS        = Number(cfg?.cacheTTLHours || 24) * 60 * 60 * 1000;
    window.dynamicCategoryRules = []; // Definimos la variable global para guardar las reglas
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${RANGE}?key=${API_KEY}`;

    return new Promise((resolve) =>
    {
        if (!SPREADSHEET_ID || !API_KEY)
        {
            plnLog('warn','[WME PLN] No se ha configurado SPREADSHEET_ID o API_KEY. Se omitirá la carga de categorías dinámicas.');
            resolve();
            return;
        }
        // Check for cached data first
        const cachedData = localStorage.getItem("wme_pln_categories_cache");
        if (cachedData)
        {
            try
            {
                const { data, timestamp } = JSON.parse(cachedData);
                // Use cache if less than TTL_MS old
                if (data && timestamp && (Date.now() - timestamp < TTL_MS))
                {
                   plnLog('ui', '[WME PLN] Usando categorías en caché. Reconstruyendo RegExp...');
                    // Se itera sobre los datos de la caché para reconstruir las expresiones regulares
                    window.dynamicCategoryRules = data.map(rule =>
                    {
                        if (rule.keyword)
                        { // Asegurarse de que la regla tenga keywords
                            const canonical = String(rule.keyword || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
                            const keywords = canonical.split(';').map(k => k.trim()).filter(k => k.length > 0);
                            const regexParts = keywords.map(k => `\\b${PLNCore.utils.escapeRegExp(k)}\\b`);
                            const combinedRegex = new RegExp(`(${regexParts.join('|')})`, 'i');
                            // Devolver la regla con la propiedad compiledRegex correctamente creada
                            return { ...rule, compiledRegex: combinedRegex };
                        }
                        return rule; // Devuelve la regla sin cambios si no tiene keyword
                    });
                    window.dynamicCategoryRules.sort((a, b) => b.keyword.length - a.keyword.length);
                    resolve();
                    return;
                }
            }
            catch (e)
            {
                plnLog('warn','[WME PLN] Error al leer caché de categorías:', e);
            }
        }
        PLNCore.net.request(
        {
            method: "GET",
            url: url,
            timeout: 10000, // Add timeout
                onload: function (response)
                {
                    if (response.status >= 200 && response.status < 300)
                    {
                        try
                        {
                            const data = JSON.parse(response.responseText);
                            if (data.values) {
                                // El procesamiento de los datos de la API ya era correcto
                                window.dynamicCategoryRules = data.values.map(row =>
                                {
                                    const keyword = (row[0] || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
                                    const keywords = keyword.split(';').map(k => k.trim()).filter(k => k.length > 0);
                                    const regexParts = keywords.map(k => `\\b${PLNCore.utils.escapeRegExp(k)}\\b`);
                                    const combinedRegex = new RegExp(`(${regexParts.join('|')})`, 'i');
                                    return {
                                        keyword: keyword,
                                        categoryKey: row[1] || '',
                                        icon: row[2] || '⚪',
                                        desc_es: row[3] || 'Sin descripción',
                                        desc_en: row[4] || 'No description',
                                        compiledRegex: combinedRegex
                                    };
                                });
                                window.dynamicCategoryRules.sort((a, b) => b.keyword.length - a.keyword.length);

                        // La lógica para guardar en caché también es correcta
                                try
                                {
                                    localStorage.setItem("wme_pln_categories_cache", JSON.stringify(
                                    {
                                        data: window.dynamicCategoryRules,
                                        timestamp: Date.now()
                                    }));
                                }
                                catch (e)
                                {
                                    plnLog('warn','[WME PLN] Error al guardar caché de categorías:', e);
                                }
                                plnLog('ui', '[WME PLN] Categorías cargadas desde API');
                        }
                    } 
                    catch (e) 
                    {
                        plnLog('error','[WME PLN] Error al procesar datos de categorías:', e);
                    }
                } 
                else 
                {
                    plnLog('warn',`[WME PLN] Error HTTP ${response.status} al cargar categorías`);
                }
                resolve();
            },
            onerror: function (error)
            {
                plnLog('error','[WME PLN] Error de red al cargar categorías:', error);
                resolve();
            },
            ontimeout: function ()
            {
                plnLog('error','[WME PLN] Timeout al cargar categorías');
                resolve();
            }
        });
    });
}//loadDynamicCategoriesFromSheet
// Función para encontrar la categoría de un lugar basado en su nombre
function findCategoryForPlace(placeName)
{
    if (!placeName || typeof placeName !== 'string' || !window.dynamicCategoryRules || window.dynamicCategoryRules.length === 0) // Si el nombre del lugar es inválido o no hay reglas de categoría cargadas, devuelve un array vacío de sugerencias.
        return [];
    const lowerCasePlaceName = placeName.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");// Convertir el nombre del lugar a minúsculas y normalizar para comparaciones insensibles a mayúsculas y diacríticos
    const allMatchingRules = []; // Este array almacenará todas las reglas de categoría que coincidan.
    const placeWords = lowerCasePlaceName.split(/\s+/).filter(w => w.length > 0); // Descomponer el nombre del lugar en palabras
    const SIMILARITY_THRESHOLD_FOR_KEYWORDS = 0.95; // Puedes ajustar este umbral (ej. 0.90 para 90% de similitud)
    // PASO 0: Normalizar el nombre del lugar eliminando diacríticos y caracteres especiales
    for (const rule of window.dynamicCategoryRules)
    {
        if (!rule.compiledRegex) continue; // Si la regla no tiene una expresión regular compilada (lo cual no debería pasar si se cargó correctamente), salta a la siguiente regla.
        // **PASO 1: Búsqueda por Regex Exacta
        if (rule.compiledRegex.test(lowerCasePlaceName))
        {
            if (!allMatchingRules.some(mr => mr.categoryKey === rule.categoryKey)) {
                allMatchingRules.push(rule);
            }
            // Si Ya Añadimos La Regla Por Regex Exacta, Pasar A La Siguiente Regla Para Ahorrar Cálculos De Similitud
            continue;
        }
        // **PASO 2: Búsqueda por Similitud para CADA palabra del lugar vs CADA palabra clave de la regla**
        const ruleKeywords = rule.keyword.split(';').map(k => k.trim().toLowerCase()).filter(k => k.length > 0);
        let foundSimilarityForThisRule = false; // Bandera para saber si ya encontramos una buena similitud para esta regla, para no seguir buscando más palabras clave de la regla.
        for (const pWord of placeWords) // Cada palabra del nombre del lugar
        { // Cada palabra del nombre del lugar
            if (foundSimilarityForThisRule) break; // Si ya encontramos una buena similitud para esta regla, pasamos a la siguiente.
            for (const rKeyword of ruleKeywords)
            { // Cada palabra clave de la regla
                // Asegurarse de que rKeyword no sea una expresión regular, sino la palabra literal para Levenshtein
                const similarity = PLNCore.utils.calculateSimilarity(pWord, rKeyword); // Calcular la similitud entre la palabra del lugar y la palabra clave de la regla
                if (similarity >= SIMILARITY_THRESHOLD_FOR_KEYWORDS && !allMatchingRules.some(mr => mr.categoryKey === rule.categoryKey)) // Si la similitud es alta y aún no hemos añadido esta categoría
                {
                    allMatchingRules.push(rule);
                    foundSimilarityForThisRule = true; // Marcamos que ya la encontramos para esta regla
                    break; // Salimos del bucle de rKeyword y pWord
                }
            }
        }
    }
    plnLog('ui', `[WME PLN][DEBUG] findCategoryForPlace para "${placeName}" devolvió: `, allMatchingRules);
    return allMatchingRules;
}//findCategoryForPlace
//Permite obtener el icono y descripción de una categoría
function getCategoryDetails(categoryKey)
{
    const lang = getWazeLanguage();
    // 1. Intento con la hoja de Google (window.dynamicCategoryRules)
    if (window.dynamicCategoryRules && window.dynamicCategoryRules.length > 0)
    {
        const rule = window.dynamicCategoryRules.find(r => r.categoryKey.toUpperCase() === categoryKey.toUpperCase());
        if (rule)
        {
            const description = (lang === 'es' && rule.desc_es) ? rule.desc_es : rule.desc_en;
            return { icon: rule.icon, description: description };
        }
    }
    // 2. Fallback a la lista interna del script si no se encontró en la hoja
    const hardcodedInfo = getCategoryIcon(categoryKey); // Llama a la función original
    if (hardcodedInfo && hardcodedInfo.icon !== '⚪' && hardcodedInfo.icon !== '❓')
    {
            // La función original devuelve un título "Español / English", lo separamos.
        const descriptions = hardcodedInfo.title.split(' / ');
        const description = (lang === 'es' && descriptions[0]) ? descriptions[0] : descriptions[1] || descriptions[0];
        return { icon: hardcodedInfo.icon, description: description };
    }
    // 3. Si no se encuentra en ninguna parte, devolver un valor por defecto.
    const defaultDescription = lang === 'es' ? `Categoría no encontrada (${categoryKey})` : `Category not found (${categoryKey})`;
    return { icon: '⚪', description: defaultDescription };
}//getCategoryDetails
    // Función para obtener el ícono de categoría
function getCategoryIcon(categoryName)
{


    // Mapa de categorías a íconos con soporte bilingüe
    const categoryIcons = {
        // Comida y Restaurantes / Food & Restaurants
        "FOOD_AND_DRINK": { icon: "🦞🍷", es: "Comida y Bebidas", en: "Food and Drinks" },
        "RESTAURANT": { icon: "🍽️", es: "Restaurante", en: "Restaurant" },
        "FAST_FOOD": { icon: "🍔", es: "Comida rápida", en: "Fast Food" },
        "CAFE": { icon: "☕", es: "Cafetería", en: "Cafe" },
        "BAR": { icon: "🍺", es: "Bar", en: "Bar" },
        "BAKERY": { icon: "🥖", es: "Panadería", en: "Bakery" },
        "ICE_CREAM": { icon: "🍦", es: "Heladería", en: "Ice Cream Shop" },
        "DEPARTMENT_STORE": { icon: "🏬", es: "Tienda por departamentos", en: "Department Store" },
        "PARK": { icon: "🌳", es: "Parque", en: "Park" },
        // Compras y Servicios / Shopping & Services
        "FASHION_AND_CLOTHING": { icon: "👗", es: "Moda y Ropa", en: "Fashion and Clothing" },
        "SHOPPING_AND_SERVICES": { icon: "👜👝", es: "Mercado o Tienda", en: "Shopping and Services" },
        "SHOPPING_CENTER": { icon: "🛍️", es: "Centro comercial", en: "Shopping Center" },
        "SUPERMARKET_GROCERY": { icon: "🛒", es: "Supermercado", en: "Supermarket" },
        "MARKET": { icon: "🛒", es: "Mercado", en: "Market" },
        "CONVENIENCE_STORE": { icon: "🏪", es: "Tienda", en: "Convenience Store" },
        "PHARMACY": { icon: "💊", es: "Farmacia", en: "Pharmacy" },
        "BANK": { icon: "🏦", es: "Banco", en: "Bank" },
        "ATM": { icon: "💳", es: "Cajero automático", en: "ATM" },
        "HARDWARE_STORE": { icon: "🔧", es: "Ferretería", en: "Hardware Store" },
        "COURTHOUSE": { icon: "⚖️", es: "Corte", en: "Courthouse" },
        "FURNITURE_HOME_STORE": { icon: "🛋️", es: "Tienda de muebles", en: "Furniture Store" },
        "TOURIST_ATTRACTION_HISTORIC_SITE": { icon: "🗿", es: "Atracción turística o Sitio histórico", en: "Tourist Attraction or Historic Site" },
        "PET_STORE_VETERINARIAN_SERVICES": { icon: "🦮🐈", es: "Tienda de mascotas o Veterinaria", en: "Pet Store or Veterinary Services" },
        "CEMETERY": { icon: "🪦", es: "Cementerio", en: "Cemetery" },
        "KINDERGARDEN": { icon: "🍼", es: "Jardín Infantil", en: "Kindergarten" },
        "JUNCTION_INTERCHANGE": { icon: "🔀", es: "Cruce o Intercambio", en: "Junction or Interchange" },
        "OUTDOORS": { icon: "🏞️", es: "Aire libre", en: "Outdoors" },
        "ORGANIZATION_OR_ASSOCIATION": { icon: "👔", es: "Organización o Asociación", en: "Organization or Association" },
        "TRAVEL_AGENCY": { icon: "🧳", es: "Agencia de viajes", en: "Travel Agency" },
        "BANK_FINANCIAL": { icon: "💰", es: "Banco o Financiera", en: "Bank or Financial Institution" },
        "SPORTING_GOODS": { icon: "🛼🏀🏐", es: "Artículos deportivos", en: "Sporting Goods" },
        "TOY_STORE": { icon: "🧸", es: "Tienda de juguetes", en: "Toy Store" },
        "CURRENCY_EXCHANGE": { icon: "💶💱", es: "Casa de cambio", en: "Currency Exchange" },
        "PHOTOGRAPHY": { icon: "📸", es: "Fotografía", en: "Photography" },
        "DESSERT": { icon: "🍰", es: "Postre", en: "Dessert" },
        "FOOD_COURT": { icon: "🥗", es: "Comedor o Patio de comidas", en: "Food Court" },
        "CANAL": { icon: "〰", es: "Canal", en: "Canal" },
        "JEWELRY": { icon: "💍", es: "Joyería", en: "Jewelry" },
        // Transporte / Transportation
        "TRAIN_STATION": { icon: "🚂", es: "Estación de tren", en: "Train Station" },
        "GAS_STATION": { icon: "⛽", es: "Estación de servicio", en: "Gas Station" },
        "PARKING_LOT": { icon: "🅿️", es: "Estacionamiento", en: "Parking Lot" },
        "BUS_STATION": { icon: "🚍", es: "Terminal de bus", en: "Bus Station" },
        "AIRPORT": { icon: "✈️", es: "Aeropuerto", en: "Airport" },
        "CAR_WASH": { icon: "🚗💦", es: "Lavado de autos", en: "Car Wash" },
        "CAR_RENTAL": { icon: "🚘🛺🛻🚙", es: "Alquiler de Vehículos", en: "Car Rental" },
        "TAXI_STATION": { icon: "🚕", es: "Estación de taxis", en: "Taxi Station" },
        "FOREST_GROVE": { icon: "🌳", es: "Bosque", en: "Forest Grove" },
        "GARAGE_AUTOMOTIVE_SHOP": { icon: "🔧🚗", es: "Taller mecánico", en: "Automotive Garage" },
        "GIFTS": { icon: "🎁", es: "Tienda de regalos", en: "Gift Shop" },
        "TOLL_BOOTH": { icon: "🚧", es: "Peaje", en: "Toll Booth" },
        "CHARGING_STATION": { icon: "🔋", es: "Estación de carga", en: "Charging Station" },
        "CAR_SERVICES": { icon: "🚗🔧", es: "Servicios de automóviles", en: "Car Services" },
        "STADIUM_ARENA": { icon: "🏟️", es: "Estadio o Arena", en: "Stadium or Arena" },
        "CAR_DEALERSHIP": { icon: "🚘🏢", es: "Concesionario de autos", en: "Car Dealership" },
        "FERRY_PIER": { icon: "⛴️", es: "Muelle de ferry", en: "Ferry Pier" },
        "INFORMATION_POINT": { icon: "ℹ️", es: "Punto de información", en: "Information Point" },
        "REST_AREAS": { icon: "🏜", es: "Áreas de descanso", en: "Rest Areas" },
        "MUSIC_VENUE": { icon: "🎶", es: "Lugar de música", en: "Music Venue" },
        "CASINO": { icon: "🎰", es: "Casino", en: "Casino" },
        "CITY_HALL": { icon: "🎩", es: "Ayuntamiento", en: "City Hall" },
        "PERFORMING_ARTS_VENUE": { icon: "🎭", es: "Lugar de artes escénicas", en: "Performing Arts Venue" },
        "TUNNEL": { icon: "🔳", es: "Túnel", en: "Tunnel" },
        "SEAPORT_MARINA_HARBOR": { icon: "⚓", es: "Puerto o Marina", en: "Seaport or Marina" },
        // Alojamiento / Lodging
        "HOTEL": { icon: "🏨", es: "Hotel", en: "Hotel" },
        "HOSTEL": { icon: "🛏️", es: "Hostal", en: "Hostel" },
        "LODGING": { icon: "⛺", es: "Alojamiento", en: "Lodging" },
        "MOTEL": { icon: "🛕", es: "Motel", en: "Motel" },
        "SWIMMING_POOL": { icon: "🏊", es: "Piscina", en: "Swimming Pool" },
        "RIVER_STREAM": { icon: "🌊", es: "Río o Arroyo", en: "River or Stream" },
        "CAMPING_TRAILER_PARK": { icon: "🏕️", es: "Camping o Parque de Trailers", en: "Camping or Trailer Park" },
        "SEA_LAKE_POOL": { icon: "🏖️", es: "Mar, Lago o Piscina", en: "Sea, Lake or Pool" },
        "FARM": { icon: "🚜", es: "Granja", en: "Farm" },
        "NATURAL_FEATURES": { icon: "🌲", es: "Características naturales", en: "Natural Features" },
        // Salud / Healthcare
        "HOSPITAL": { icon: "🏥", es: "Hospital", en: "Hospital" },
        "HOSPITAL_URGENT_CARE": { icon: "🏥🚑", es: "Urgencias", en: "Urgent Care" },
        "DOCTOR_CLINIC": { icon: "🏥⚕️", es: "Clínica", en: "Clinic" },
        "DOCTOR": { icon: "👨‍⚕️", es: "Consultorio médico", en: "Doctor's Office" },
        "VETERINARY": { icon: "🐾", es: "Veterinaria", en: "Veterinary" },
        "PERSONAL_CARE": { icon: "💅💇🦷", es: "Cuidado personal", en: "Personal Care" },
        "FACTORY_INDUSTRIAL": { icon: "🏭", es: "Fábrica o Industrial", en: "Factory or Industrial" },
        "MILITARY": { icon: "🪖", es: "Militar", en: "Military" },
        "LAUNDRY_DRY_CLEAN": { icon: "🧺", es: "Lavandería o Tintorería", en: "Laundry or Dry Clean" },
        "PLAYGROUND": { icon: "🛝", es: "Parque infantil", en: "Playground" },
        "TRASH_AND_RECYCLING_FACILITIES": { icon: "🗑️♻️", es: "Instalaciones de basura y reciclaje", en: "Trash and Recycling Facilities" },
        // Educación / Education
        "UNIVERSITY": { icon: "🎓", es: "Universidad", en: "University" },
        "COLLEGE_UNIVERSITY": { icon: "🏫", es: "Colegio", en: "College" },
        "SCHOOL": { icon: "🎒", es: "Escuela", en: "School" },
        "LIBRARY": { icon: "📖", es: "Biblioteca", en: "Library" },
        "FLOWERS": { icon: "💐", es: "Floristería", en: "Flower Shop" },
        "CONVENTIONS_EVENT_CENTER": { icon: "🎤🥂", es: "Centro de convenciones o eventos", en: "Convention or Event Center" },
        "CLUB": { icon: "♣", es: "Club", en: "Club" },
        "ART_GALLERY": { icon: "🖼️", es: "Galería de arte", en: "Art Gallery" },
        "NATURAL_FEATURES": { icon: "🌄", es: "Características naturales", en: "Natural Features" },
        // Entretenimiento / Entertainment
        "CINEMA": { icon: "🎬", es: "Cine", en: "Cinema" },
        "THEATER": { icon: "🎭", es: "Teatro", en: "Theater" },
        "MUSEUM": { icon: "🖼", es: "Museo", en: "Museum" },
        "CULTURE_AND_ENTERTAINEMENT": { icon: "🎨", es: "Cultura y Entretenimiento", en: "Culture and Entertainment" },
        "STADIUM": { icon: "🏟️", es: "Estadio", en: "Stadium" },
        "GYM": { icon: "💪", es: "Gimnasio", en: "Gym" },
        "GYM_FITNESS": { icon: "🏋️", es: "Gimnasio o Fitness", en: "Gym or Fitness" },
        "GAME_CLUB": { icon: "⚽🏓", es: "Club de juegos", en: "Game Club" },
        "BOOKSTORE": { icon: "📖📚", es: "Librería", en: "Bookstore" },
        "ELECTRONICS": { icon: "📱💻", es: "Electrónica", en: "Electronics" },
        "SPORTS_COURT": { icon: "⚽🏀", es: "Cancha deportiva", en: "Sports Court" },
        "GOLF_COURSE": { icon: "⛳", es: "Campo de golf", en: "Golf Course" },
        "SKI_AREA": { icon: "⛷️", es: "Área de esquí", en: "Ski Area" },
        "RACING_TRACK": { icon: "🛷⛸🏎️", es: "Pista de carreras", en: "Racing Track" },
        // Gobierno y Servicios Públicos / Government & Public Services
        "GOVERNMENT": { icon: "🏛️", es: "Oficina gubernamental", en: "Government Office" },
        "POLICE_STATION": { icon: "👮", es: "Estación de policía", en: "Police Station" },
        "FIRE_STATION": { icon: "🚒", es: "Estación de bomberos", en: "Fire Station" },
        "FIRE_DEPARTMENT": { icon: "🚒", es: "Departamento de bomberos", en: "Fire Department" },
        "POST_OFFICE": { icon: "📫", es: "Correo", en: "Post Office" },
        "TRANSPORTATION": { icon: "🚌", es: "Transporte", en: "Transportation" },
        "THEME_PARK": { icon: "🎢", es: "Parque de atracciones, Parque Temático", en: "Theme Park" },
        "PRISON_CORRECTIONAL_FACILITY": { icon: "👁️‍🗨️", es: "Prisión o Centro Correccional", en: "Prison or Correctional Facility" },
        // Religión / Religion
        "RELIGIOUS_CENTER": { icon: "⛪", es: "Iglesia", en: "Church" },
        // Otros / Others
        "RESIDENTIAL": { icon: "🏘️", es: "Residencial", en: "Residential" },
        "RESIDENCE_HOME": { icon: "🏠", es: "Residencia o Hogar", en: "Residence or Home" },
        "OFFICES": { icon: "🏢", es: "Oficina", en: "Office" },
        "FACTORY": { icon: "🏭", es: "Fábrica", en: "Factory" },
        "CONSTRUCTION_SITE": { icon: "🏗️", es: "Construcción", en: "Construction" },
        "MONUMENT": { icon: "🗽", es: "Monumento", en: "Monument" },
        "BRIDGE": { icon: "🌉", es: "Puente", en: "Bridge" },
        "PROFESSIONAL_AND_PUBLIC": { icon: "🗄💼", es: "Profesional y Público", en: "Professional and Public" },
        "OTHER": { icon: "🚪", es: "Otro", en: "Other" },
        "ARTS_AND_CRAFTS": { icon: "🎨", es: "Artes y Manualidades", en: "Arts and Crafts" },
        "COTTAGE_CABIN": { icon: "🏡", es: "Cabaña", en: "Cottage Cabin" },
        "TELECOM": { icon: "📡", es: "Telecomunicaciones", en: "Telecommunications" }
    };
    // Si no hay categoría, devolver ícono por defecto
    if (!categoryName)
    {
        return { icon: "❓", title: "Sin categoría / No category" };
    }
    // Normalizar el nombre de la categoría
    const normalizedInput = categoryName.toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim();
        plnLog('ui', "[WME_PLN][DEBUG] Buscando ícono para categoría:", categoryName);
        plnLog('ui', "[WME_PLN][DEBUG] Nombre normalizado:", normalizedInput);
    // 1. Buscar coincidencia exacta por clave interna (ej: "PARK")
    for (const [key, data] of Object.entries(categoryIcons))
    {
        if (key.toLowerCase() === normalizedInput)
        {
            return { icon: data.icon, title: `${data.es} / ${data.en}` };
        }
    }
    // Buscar coincidencia en el mapa de categorías
    for (const [key, data] of Object.entries(categoryIcons))
    {
        // Normalizar los nombres en español e inglés para la comparación
        const normalizedES = data.es.toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .trim();
        const normalizedEN = data.en.toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .trim();
        if (normalizedInput === normalizedES || normalizedInput === normalizedEN)
        {
            return { icon: data.icon, title: `${data.es} / ${data.en}` };
        }
    }
    // Si no se encuentra coincidencia, devolver ícono por defecto
    plnLog('ui', "[WME_PLN][DEBUG] No se encontró coincidencia, usando ícono por defecto");
    return {
        icon: "⚪",
        title: `${categoryName} (Sin coincidencia / No match)`
    };
}// getCategoryIcon

// Crea un dropdown para seleccionar categorías recomendadas
function createRecommendedCategoryDropdown(placeId, currentCategoryKey, dynamicCategorySuggestions)
{
    window.tempSelectedCategories = window.tempSelectedCategories || new Map();
    const wrapperDiv = document.createElement("div");
    wrapperDiv.style.position = "relative";
    wrapperDiv.style.width = "100%";
    wrapperDiv.style.minWidth = "150px";
    wrapperDiv.style.display = "flex";
    wrapperDiv.style.flexDirection = "column";
    // Parte de sugerencias dinámicas existentes
    const suggestionsWrapper = document.createElement("div"); // Contenedor para sugerencias
    suggestionsWrapper.style.display = "flex";
    suggestionsWrapper.style.flexDirection = "column";
    suggestionsWrapper.style.alignItems = "flex-start";
    suggestionsWrapper.style.gap = "4px";
    // Filtrar y ordenar las sugerencias dinámicas para la presentación
    const filteredSuggestions = dynamicCategorySuggestions.filter(suggestion => suggestion.categoryKey.toUpperCase() !== currentCategoryKey.toUpperCase());
    if (filteredSuggestions.length > 0)
    { // Solo si hay sugerencias diferentes a la actual
        filteredSuggestions.forEach(suggestion =>
        {
            const suggestionEntry = document.createElement("div");
            suggestionEntry.style.display = "flex";
            suggestionEntry.style.alignItems = "center";
            suggestionEntry.style.gap = "4px";
            suggestionEntry.style.padding = "2px 4px";
            suggestionEntry.style.border = "1px solid #dcdcdc";
            suggestionEntry.style.borderRadius = "3px";
            suggestionEntry.style.backgroundColor = "#eaf7ff"; // Un color distinto para sugerencias
            suggestionEntry.style.cursor = "pointer";
            suggestionEntry.title = `Sugerencia: ${getCategoryDetails(suggestion.categoryKey).description}`;
            //Añadir icono y descripción de la categoría
            const suggestedIconSpan = document.createElement("span");// Icono de la sugerencia
            suggestedIconSpan.textContent = suggestion.icon;
            suggestedIconSpan.style.fontSize = "16px";
            suggestionEntry.appendChild(suggestedIconSpan);
            // Añadir descripción de la categoría
            const suggestedDescSpan = document.createElement("span");
            suggestedDescSpan.textContent = getCategoryDetails(suggestion.categoryKey).description;
            suggestionEntry.appendChild(suggestedDescSpan);
            suggestionEntry.addEventListener("click", async function handler()
            { // Cambiado a función con nombre 'handler'
                const placeToUpdate = W.model.venues.getObjectById(placeId);
                if (!placeToUpdate)
                {
                    plnLog('error', 'Lugar no encontrado para actualizar categoría.');
                    return;
                }
                try
                {
                    const UpdateObject = (window.require && window.require("Waze/Action/UpdateObject")) || null;
                    if (!UpdateObject) {
                        plnLog('error', 'No se pudo cargar Waze/Action/UpdateObject (SDK no listo).');
                        plnToast('No se pudo aplicar la categoría (SDK no listo).', 3000);
                        return;
                    }
                    const action = new UpdateObject(placeToUpdate, { categories: [suggestion.categoryKey] });
                    W.model.actionManager.add(action);
                                        // Obtener la celda de la categoría original y aplicar un estilo de opacidad
                    const row = document.querySelector(`tr[data-place-id="${placeId}"]`); // Obtener la fila
                    row.dataset.categoryChanged = 'true'; // Marcar fila como modificada
                    // Habilitar el botón de aplicar sugerencia
                    const applyButton = row.querySelector('button[title="Aplicar sugerencia"]');
                    if (applyButton)
                    {
                        applyButton.disabled = false;
                        applyButton.style.opacity = "1";
                    }
                    //Actualizar visualmente la celda de Categoría Actual en la tabla
                    updateCategoryDisplayInTable(placeId, suggestion.categoryKey);

                    // Asegurarse de que la fila existe antes de intentar acceder a sus celdas
                    if (row)
                    {
                        const originalCategoryCell = row.querySelector('td:nth-child(10)'); // La décima columna es "Categoría"
                        if (originalCategoryCell)
                        {
                            originalCategoryCell.style.opacity = '0.5'; // Atenuar la celda completa
                            originalCategoryCell.title += ' (Modificada)'; // Opcional, añadir un tooltip
                        }
                    }
                    // : Mostrar chulito verde en la sugerencia misma
                    const successIcon = document.createElement("span");
                    successIcon.textContent = " ✅";
                    successIcon.style.marginLeft = "5px";
                    suggestionEntry.appendChild(successIcon); // Añadir el chulito a la entrada de la sugerencia
                    suggestionEntry.style.cursor = "default"; // Deshabilitar clic posterior

                    suggestionEntry.removeEventListener("click", handler); // Deshabilita el listener una vez que se ha hecho clic
                    suggestionEntry.style.opacity = "0.7"; // Opcional: Atenúa la sugerencia para indicar que ya se usó

                    optionsListDiv.style.display = "none"; // Ocultar lista
                    searchInput.blur(); // Quitar el foco
                    // : Eliminar la selección temporal para la categoría, ya se guardó
                    tempSelectedCategories.delete(placeId); // Si esta categoría se guardó directamente
                }
                catch (e)
                {
                    plnLog('error', 'Error al actualizar la categoría desde dropdown:', e);
                    plnToast("Error al actualizar la categoría: " + e.message, 3000); // Mantener alerta para errores
                }
            });
        suggestionsWrapper.appendChild(suggestionEntry);
        });
        wrapperDiv.appendChild(suggestionsWrapper); // Añadir contenedor de sugerencias
    }// createRecommendedCategoryDropdown
    //Fin de parte de sugerencias dinámicas
    // Input para buscar
    const searchInput = document.createElement("input");
    searchInput.type = "text";
    searchInput.placeholder = "Buscar o Seleccionar Categoría";// Placeholder más descriptivo
    searchInput.style.width = "calc(100% - 10px)";
    searchInput.style.padding = "5px";
    searchInput.style.marginTop = "5px"; //  Espacio después de sugerencias
    searchInput.style.marginBottom = "5px";
    searchInput.style.border = "1px solid #ccc";
    searchInput.style.borderRadius = "3px";
    searchInput.setAttribute('spellcheck', 'false');// Evitar corrección ortográfica
    searchInput.readOnly = false;// Permitir escribir pero no editar directamente
    searchInput.style.cursor = 'auto';// Permitir escribir pero no editar directamente
    searchInput.style.opacity = '1.0'; // Opacidad normal para el input
    wrapperDiv.appendChild(searchInput); // Añadir el input al wrapper
    // Div que actuará como la lista desplegable de opciones
    const optionsListDiv = document.createElement("div");
    optionsListDiv.style.position = "absolute";
    // Ajuste de top para que aparezca debajo del input, incluso con sugerencias
    optionsListDiv.style.top = "calc(100% + 5px)"; // Se ajusta dinámicamente o se puede hacer con position: relative dentro de un contenedor fijo.
    optionsListDiv.style.left = "0";
    optionsListDiv.style.width = "calc(100% - 2px)";
    optionsListDiv.style.maxHeight = "200px";
    optionsListDiv.style.overflowY = "auto";
    optionsListDiv.style.border = "1px solid #ddd";
    optionsListDiv.style.backgroundColor = "#fff";
    optionsListDiv.style.zIndex = "1001";
    optionsListDiv.style.display = "none";
    optionsListDiv.style.borderRadius = "3px";
    optionsListDiv.style.boxShadow = "0 2px 5px rgba(0,0,0,0.2)";
    wrapperDiv.appendChild(optionsListDiv);
    // --- Populate options list ---
    function populateOptions(filterText = "")
    {
        optionsListDiv.innerHTML = ""; // Clear existing options
        const lowerFilterText = filterText.toLowerCase(); // Normalize filter text for case-insensitive search
        // Sort rules alphabetically by their Spanish description for display
        const sortedRules = [...window.dynamicCategoryRules].sort((a, b) =>
        {
            const descA = (getWazeLanguage() === 'es' && a.desc_es) ? a.desc_es : a.desc_en;
            const descB = (getWazeLanguage() === 'es' && b.desc_es) ? b.desc_es : b.desc_en;
            return descA.localeCompare(descB);
        });
        sortedRules.forEach(rule =>
        {// Iterate through each rule
            const displayDesc = (getWazeLanguage() === 'es' && rule.desc_es) ? rule.desc_es : rule.desc_en;
            if (filterText === "" || displayDesc.toLowerCase().includes(lowerFilterText) || rule.categoryKey.toLowerCase().includes(lowerFilterText))
            {// Check if displayDesc or categoryKey contains the filter text
                const optionDiv = document.createElement("div");
                optionDiv.style.padding = "5px";
                optionDiv.style.cursor = "pointer";
                optionDiv.style.borderBottom = "1px solid #eee";
                optionDiv.style.display = "flex";
                optionDiv.style.alignItems = "center";
                optionDiv.style.gap = "5px";
                optionDiv.title = `Seleccionar: ${displayDesc} (${rule.categoryKey})`;
                // Resaltar si es la categoría actual o la temporalmente seleccionada
                const tempSelectedKey = tempSelectedCategories.get(placeId); // Obtener selección temporal
                if (rule.categoryKey.toUpperCase() === currentCategoryKey.toUpperCase())
                {// Resaltar la categoría actual
                    optionDiv.style.backgroundColor = "#e0f7fa"; // Azul claro para la actual
                    optionDiv.style.fontWeight = "bold";
                }
                else if (tempSelectedKey && rule.categoryKey.toUpperCase() === tempSelectedKey.toUpperCase())  // Resaltar selección temporal
                    optionDiv.style.backgroundColor = "#fffacd"; // Amarillo claro para la seleccionada temporalmente
                else if (dynamicCategorySuggestions.some(s => s.categoryKey.toUpperCase() === rule.categoryKey.toUpperCase()))
                    optionDiv.style.backgroundColor = "#e6ffe6"; // Verde claro para sugerida por el sistema
                const iconSpan = document.createElement("span");// Icono de la categoría
                iconSpan.textContent = rule.icon;
                iconSpan.style.fontSize = "16px";
                optionDiv.appendChild(iconSpan);
                const textSpan = document.createElement("span");// Descripción de la categoría
                textSpan.textContent = displayDesc;
                optionDiv.appendChild(textSpan);// Añadir descripción de la categoría
                optionDiv.addEventListener("mouseenter", () => optionDiv.style.backgroundColor = "#f0f0f0");
                optionDiv.addEventListener("mouseleave", () =>
                {
                    if (tempSelectedKey && rule.categoryKey.toUpperCase() === tempSelectedKey.toUpperCase())
                    {
                        optionDiv.style.backgroundColor = "#fffacd";
                    }
                    else if (rule.categoryKey.toUpperCase() === currentCategoryKey.toUpperCase())
                    {
                        optionDiv.style.backgroundColor = "#e0f7fa";
                    }
                    else if (dynamicCategorySuggestions.some(s => s.categoryKey.toUpperCase() === rule.categoryKey.toUpperCase()))
                    {
                        optionDiv.style.backgroundColor = "#e6ffe6";
                    }
                    else
                    {
                        optionDiv.style.backgroundColor = "#fff";
                    }
                });
                // Añadir evento click para seleccionar la categoría
                optionDiv.addEventListener("click", async () =>
                {
                    const placeToUpdate = W.model.venues.getObjectById(placeId);
                    if (!placeToUpdate)
                    {
                        //console.error("[WME_PLN] Lugar no encontrado para actualizar categoría.");
                        return;
                    }
                    try
                    {
                        const UpdateObject = (window.require && window.require("Waze/Action/UpdateObject")) || null;
                        if (!UpdateObject) {
                            plnLog('error', 'No se pudo cargar Waze/Action/UpdateObject (SDK no listo).');
                            plnToast('No se pudo aplicar la categoría (SDK no listo).', 3000);
                            return;
                        }
                        const action = new UpdateObject(placeToUpdate, { categories: [rule.categoryKey] });
                        W.model.actionManager.add(action);
                        // ✅ CORRECCIÓN: Se declara 'row' aquí, ANTES de su primer uso.
                        const row = document.querySelector(`tr[data-place-id="${placeId}"]`);
                        // Ahora es seguro usar la variable 'row'.
                        if (row)
                        {
                            row.dataset.categoryChanged = 'true'; // Marcar fila como modificada
                            const applyButton = row.querySelector('button[title="Aplicar sugerencia"]');
                            // Habilitar el botón de aplicar sugerencia
                            if (applyButton)
                            {
                                applyButton.disabled = false;
                                applyButton.style.opacity = "1";
                            }
                        }
                        // Actualizar visualmente la celda de Categoría Actual en la tabla
                        updateCategoryDisplayInTable(placeId, rule.categoryKey);
                        // Atenuar la celda de la categoría original
                        if (row)
                        {
                            const categoryCell = row.querySelector('td:nth-child(10)');
                            if (categoryCell)
                            {
                                const currentCategoryDiv = categoryCell.querySelector('div');
                                if (currentCategoryDiv)
                                {
                                    currentCategoryDiv.style.opacity = '0.5';
                                    currentCategoryDiv.title += ' (Modificada)';
                                }
                            }
                        }

                        // Actualizar el valor del input con icono y descripción de la selección
                        searchInput.value = `${rule.icon} ${displayDesc}`;
                        searchInput.style.setProperty('opacity', '1.0', 'important'); // Usar setProperty para asegurar visibilidad

                        // Ocultar la lista de opciones
                        optionsListDiv.style.display = "none";
                        searchInput.blur();

                    }
                    catch (e)
                    {
                       plnLog('error', "[WME_PLN] Error al actualizar la categoría desde dropdown:", e);
                       plnToast("Error al actualizar la categoría: " + e.message, 3000);
                    }
                });
                optionsListDiv.appendChild(optionDiv);
            }
        });
        if (optionsListDiv.childElementCount === 0)
        {// Si no hay opciones que coincidan con el filtro, mostrar mensaje
            const noResults = document.createElement("div");
            noResults.style.padding = "5px";
            noResults.style.color = "#777";
            noResults.textContent = "No hay resultados.";
            optionsListDiv.appendChild(noResults);
        }
    }// populateOptions
    // Limpiamos los listeners anteriores y los reescribimos de forma más robusta.
    let debounceTimer;
    searchInput.addEventListener("input", () =>
    {
        clearTimeout(debounceTimer);
        // Muestra la lista y filtra mientras el usuario escribe.
        debounceTimer = setTimeout(() => {
            populateOptions(searchInput.value);
            optionsListDiv.style.display = "block";
        }, 200);
    });
    searchInput.addEventListener("focus", () =>
    {
        // Al hacer foco, muestra la lista completa.
        populateOptions(searchInput.value);
        optionsListDiv.style.display = "block";
    });
    // Usamos 'mousedown' en lugar de 'click' para cerrar el menú.
    // Esto evita conflictos con el evento 'click' de las opciones.
    document.addEventListener("mousedown", (e) =>
    {
        if (!wrapperDiv.contains(e.target))
        {
            optionsListDiv.style.display = "none";
        }
    });
    populateOptions(""); // Cargar las opciones inicialmente (sin filtro)
    return wrapperDiv;
}// createRecommendedCategoryDropdown