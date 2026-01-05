// ==UserScript==
// @name       WME PlaceNames
// @version    0.81
// @description  Show area and point place names in WME, color and highlight places by type and properties
// @include             https://www.waze.com/editor*
// @include             https://www.waze.com/*/editor*
// @include             https://beta.waze.com/editor*
// @include             https://beta.waze.com/*/editor*
// @copyright  2017, ragacs
// @namespace https://greasyfork.org/users/6330
// @grant               none
// @downloadURL https://update.greasyfork.org/scripts/6083/WME%20PlaceNames.user.js
// @updateURL https://update.greasyfork.org/scripts/6083/WME%20PlaceNames.meta.js
// ==/UserScript==

var wmepn_translations = 
    {
        "en":
        {
            enable_script: "Enable script",
            enable_script_tooltip: "Toggle highlighting and place names layer\nUse the Layer selector or Shift+N hotkey to toggle names only",
            color_places: "Color places",
            color_places_tooltip: "Color the places like WMECH does",
            highlight_places: "Highlight places without name/HN",
            highlight_places_tooltip: "Highlight public places without name and private places without house number (yellow)",
            show: "Show",
            show_tooltip: "Select desired names to show",
            option_areaonly: "Area only",
            option_areapoint: "Area and Point",
            option_pointonly: "Point only",
            filter: "Filter",
            filter_tooltip: "Filter only the names containing this string (you could use regex e.g. /school/i)",
            show_locklevel: "Show lock level",
            show_locklevel_tooltip: "Display lock level after the name, like [L3] or [L4]",
            stop_over: "Stop over",
            stop_over_tooltip: "Limit displayed place names to the specified value",
            option_unlimited: "Unlimited",
            showing: "Showing",
            place_names_and: {
                one: "place name and",
                other: "place names and" },
            house_numbers:  {
                one: "house number",
                other: "house numbers" },
            translator: "translated by [Your Waze Nickname]"
        },
        "hu":
        {
            enable_script: "Szkript engedélyezése",
            enable_script_tooltip: "A színezés, kiemelés és a Helynevek réteg bekapcsolása\nHasználd a rétegválasztót vagy a Shift+N forróbillentyűt, ha csak a neveket akarod kapcsolgatni",
            color_places: "Helyek színezése",
            color_places_tooltip: "Helyek színezése, ahogyan a WMECH teszi",
            highlight_places: "Név/hsz nélküli helyek kiemelése",
            highlight_places_tooltip: "Kiemeli (sárgával) a névtelen nyilvános helyeket és a házszám nélküli magánházakat",
            show: "Mutasd",
            show_tooltip: "Válaszd ki a megmutatni kívánt neveket",
            option_areaonly: "Csak terület",
            option_areapoint: "Terület és pont",
            option_pointonly: "Csak pont",
            filter: "Szűrő",
            filter_tooltip: "Csak azokat a neveket mutassa, amik ezt a szöveget tartalmazzák (reguláris kifejezések használhatók, pl. /iskola/i)",
            show_locklevel: "Védelem mutatása",
            show_locklevel_tooltip: "Mutassa a védelmi szintet is a név után, pl. [L3] vagy [L4]",
            stop_over: "Maximum",
            stop_over_tooltip: "A képernyőn egyszerre látható név-feliratok számát korlátozza",
            option_unlimited: "Korlátlan",
            showing: "Látható",
            place_names_and: "helynév és",
            house_numbers: "házszám",
            translator: "fordította ragacs"
        },
        "cs":
        {
            enable_script: "Povolit skript",
            enable_script_tooltip: "Přepínač zvýraznění a jmen míst\nPoužijte menu Vrstvy nebo klávesovou zkratku Shift+N, aby se zobrazila jen jména míst",
            color_places: "Barevné odlišení",
            color_places_tooltip: "Barevné odlišení jako WMECH",
            highlight_places: "Odlišit nepojmenovaná místa",
            highlight_places_tooltip: "Odlišit nepojmenovaná veřejná místa a soukromá místa bez čísla domu (žlutě)",
            show: "Zobrazit",
            show_tooltip: "Zobrazit požadovaná jména",
            option_areaonly: "Jen plochy",
            option_areapoint: "Plochy a body",
            option_pointonly: "Jen body",
            filter: "Filtr",
            filter_tooltip: "Filtrovat jen jména obsahující tento řetězec (lze použít regex např. /škola/i)",
            show_locklevel: "Ukázat zámek",
            show_locklevel_tooltip: "Zobrazit zámek za jménem místa (např. [L3] nebo [L4])",
            stop_over: "Omezení",
            stop_over_tooltip: "Omezit zobrazená místa na zadanou hodnotu",
            option_unlimited: "Bez omezení",
            showing: "Zobrazení",
            place_names_and: "jména míst a",
            house_numbers: "čísla domů",
            translator: "překládal bures"
        },
        "nl" :
        {
            enable_script: "Script inschakelen",
            enable_script_tooltip: "De laag voor het weergeven en markeren van plaatsnamen beheren\nGebruik de laagselector of Shift+N om enkel de namen te beheren",
            color_places: "Voeg kleur toe aan plaatsen",
            color_places_tooltip: "Kleur de plaatsen in zoals het WMECH-script dit doet",
            highlight_places: "Markeer plaatsen zonder naam of huisnummer",
            highlight_places_tooltip: "Markeer publieke plaatsen zonder naam en private plaatsen zonder huisnummer (geel)",
            show: "Weergave",
            show_tooltip: "Selecteer welke namen er moeten weergegeven worden",
            option_areaonly: "Enkel gebieden",
            option_areapoint: "Gebieden en punten",
            option_pointonly: "Enkel punten",
            filter: "Filter",
            filter_tooltip: "Toon enkel de plaatsen met de volgende naam (je kan ook een regex gebruiken zoals /school/i)",
            show_locklevel: "Lock-level weergeven",
            show_locklevel_tooltip: "Geef het lock-level weer achter de naam als [L3] of [L4]",
            stop_over: "Beperk aantal plaatsnamen",
            stop_over_tooltip: "Beperk het aantal weergegeven plaatsnamen tot dit aantal",
            option_unlimited: "Onbeperkt",
            showing: "Huidige weergave: ",
            place_names_and: {
                one: "plaatsnaam en",
                other: "plaatsnamen en" },
            house_numbers:  {
                one: "huisnummer",
                other: "huisnummers" },
            translator: "vertaald door Glodenox"    
        },
        "fr":
        {
            enable_script: "Activer le script",
            enable_script_tooltip: "Pour activer et désactiver le calque \n Utilisez le gestionnaire de calque ou Shift+N pour les noms seulement",
            color_places: "Colorer les lieux ",
            color_places_tooltip: "Colore comme WME Color Highlight",
            highlight_places: "Surbrillance les lieux sans nom/HN",
            highlight_places_tooltip: "Surbrillance (Jaune) pour les lieux publiques sans nom & les lieux résidentiels sans numéro ",
            show: "Afficher",
            show_tooltip: "Séléctione les noms à afficher",
            option_areaonly: "Zones seulement",
            option_areapoint: "Zones & lieux",
            option_pointonly: "Lieux seulement",
            filter: "Filtrer",
            filter_tooltip: "Filtre les noms contenant ces lettres/mots (utilisation possible de regex ex : /school/i )",
            show_locklevel: "Afficher le niveau de verouillage",
            show_locklevel_tooltip: "Affiche le niveau de vérouillage en fin de nom ex : [L3] ou [L4]",
            stop_over: "Limiter à",
            stop_over_tooltip: "Limite le nombre de noms de lieux affichés",
            option_unlimited: "Illimité",
            showing: "Afficher",
            place_names_and: {
                one: "nom de lieu et",
                other: "noms des lieux et" },
            house_numbers:  {
                one: "numéro de rue",
                other: "numéros de rue" },
            translator: "adapté par no1ne"
        },
        "pl" : 
        {
            enable_script: "Włącz skrypt",
            enable_script_tooltip: "Włącz podświetlanie i warstwę nazw Miejsc\nUżyj wyboru warstw lub kombinacji Shift+N, żeby włączyć tylko nazwy",
            color_places: "Kolory miejsc",
            color_places_tooltip: "Pokoloruj miejsca tak, jak robi to WME Color Highlight",
            highlight_places: "Podświetl miejsca bez nazwy/nr adresowego",
            highlight_places_tooltip: "Podświetl miejsca publiczne bez nazwy i budynki mieszkalne bez numeru domu (żółty)",
            show: "Pokaż",
            show_tooltip: "Wybierz wybrane nazwy do pokazania",
            option_areaonly: "Tylko obszary",
            option_areapoint: "Obszary i Punkty",
            option_pointonly: "Tylko punkty",
            filter: "Filtr",
            filter_tooltip: "Filtruj tylko nazwy zawierające ten ciąg znaków (możesz użyć regex np. /szkoł[ay]/i)",
            show_locklevel: "Pokaż poziom blokady",
            show_locklevel_tooltip: "Wyświetl poziom blokady po nazwie, np. [L3] lub [L4]",
            stop_over: "Zatrzymaj po",
            stop_over_tooltip: "Ogranicz wyświetlanie nazw miejsc do określonej ilości",
            option_unlimited: "Nieograniczone",
            showing: "Pokazywanie",
            place_names_and: {
                one: "nazwa miejsca",
                other: "nazwy miejsc" },
            house_numbers: {
                one: "numer domu",
                other: "numery domów" },
            translator: "przetłumaczone przez TCholewa"
        },
        "he" : 
        {
            enable_script: "הפעל תוסף",
            enable_script_tooltip: "מציג שמות ומדגיש מקומות",
            color_places: "הדגש מקומות",
            color_places_tooltip: "מדגיש את המקומות כמו בתוסף  WME Color Highlights",
            highlight_places: "הדגש מקומות ללא שם/מספר בית",
            highlight_places_tooltip: "מדגיש מקומות ציבוריים ללא שם ומקומות מגורים ללא מספר בית (צהוב)",
            show: "הצג",
            show_tooltip: "בחר שמות להצגה",
            option_areaonly: "איזור בלבד",
            option_areapoint: "איזור ונקודות",
            option_pointonly: "נקודות בלבד",
            filter: "סנן",
            filter_tooltip: "סנן מקומות אשר מכילים את השם הבא (לדוג'- בית ספר וכיוב)",
            show_locklevel: "הצג רמת נעילה",
            show_locklevel_tooltip: "מציג את דרגת הנעילה בהמשך לשם המקום",
            stop_over: " מקס' תוצאות להצגה",
            stop_over_tooltip: "מגביל את כמות התוצאות המתאימות לערך",
            option_unlimited: "ללא הגבלה",
            showing: "מציג",
            place_names_and: {
                one: "שם המקום ו",
                other: "שמות מקומות ו" },
            house_numbers:  {
                one: "מספר בית",
                other: "מספרי בתים" },
            translator: "תורגם לעברית עי okrauss"
        },
        "es" : 
        {
            enable_script: "Activar el script",
            enable_script_tooltip: "Para activar y desactivar el resaltado de la capa de Place Names\nUtiliza el selector de capas o el atajo de teclado Shift+N para activar/desactivar solo los nombres",
            color_places: "Colorear places",
            color_places_tooltip: "Colorear los places como lo hace WMECH",
            highlight_places: "Resaltar places sin nombre o número de casa",
            highlight_places_tooltip: "Resaltar places públicos sin nombre y places privados sin número de casa (en amarillo)",
            show: "Mostrar",
            show_tooltip: "Seleccionar los nombres que se desean mostrar",
            option_areaonly: "Sólo Area",
            option_areapoint: "Area y Punto",
            option_pointonly: "Sólo Punto",
            filter: "Filtar",
            filter_tooltip: "Filtrar solo los nombres que contienen este texto (puedes utilizar regex Ej: /escuela/i)",
            show_locklevel: "Mostrar el nivel de bloqueo",
            show_locklevel_tooltip: "Mostrar el nivel de bloqueo luego del nombre, como [L3] o [L4]",
            stop_over: "Limitar a",
            stop_over_tooltip: "Limitar Place Names a el valor especificado",
            option_unlimited: "Ilimitado",
            showing: "Mostrando",
            place_names_and: {
                one: "Place Name y",
                other: "Place Names y" },
            house_numbers:  {
                one: "Número de casa",
                other: "Números de casa" },
            translator: "Traducido por ancho85"
        },
        "es-419" : 
        {
            enable_script: "Activar el script",
            enable_script_tooltip: "Para activar y desactivar el resaltado de la capa de Place Names\nUtiliza el selector de capas o el atajo de teclado Shift+N para activar/desactivar solo los nombres",
            color_places: "Colorear places",
            color_places_tooltip: "Colorear los places como lo hace WMECH",
            highlight_places: "Resaltar places sin nombre o número de casa",
            highlight_places_tooltip: "Resaltar places públicos sin nombre y places privados sin número de casa (en amarillo)",
            show: "Mostrar",
            show_tooltip: "Seleccionar los nombres que se desean mostrar",
            option_areaonly: "Sólo Area",
            option_areapoint: "Area y Punto",
            option_pointonly: "Sólo Punto",
            filter: "Filtar",
            filter_tooltip: "Filtrar solo los nombres que contienen este texto (puedes utilizar regex Ej: /escuela/i)",
            show_locklevel: "Mostrar el nivel de bloqueo",
            show_locklevel_tooltip: "Mostrar el nivel de bloqueo luego del nombre, como [L3] o [L4]",
            stop_over: "Limitar a",
            stop_over_tooltip: "Limitar Place Names a el valor especificado",
            option_unlimited: "Ilimitado",
            showing: "Mostrando",
            place_names_and: {
                one: "Place Name y",
                other: "Place Names y" },
            house_numbers:  {
                one: "Número de casa",
                other: "Números de casa" },
            translator: "Traducido por ancho85"
        },
        "pt-BR":
        {
            enable_script: "Habilitar script",
            enable_script_tooltip: "Destacar camadas e nomes de locais \nUse a marcação de camadas ou Shift+N para destacar nomes apenas",
            color_places: "Locais coloridos",
            color_places_tooltip: "Colirir os locais como WMECH faz",
            highlight_places: "Destaque locais sem nome/SN",
            highlight_places_tooltip: "Destacar locais público sem nome e locais privador sem numeração (amarelo)",
            show: "Mostrar",
            show_tooltip: "Escolha nomes desejados para mostrar",
            option_areaonly: "Apenas área",
            option_areapoint: "Área e ponto",
            option_pointonly: "Apenas ponto",
            filter: "Filtro",
            filter_tooltip: "Filtrar somente nomes que contenham esta string (você pde usar regex e.g. /school/i)",
            show_locklevel: "Mostrar nível de bloqueio",
            show_locklevel_tooltip: "Mostrar nível de bloqueio após o nome, tipo [L3] or [L4]",
            stop_over: "Limite",
            stop_over_tooltip: "Limite mostrado de nomes de lugares para o valor especificado",
            option_unlimited: "Sem limite",
            showing: "Mostrando",
            place_names_and: {
                one: "nome de local e",
                other: "nomes de locais e" },
            house_numbers:  {
                one: "numeração de casa",
                other: "numerações de casas" },
            translator: "translated by GabiruDriverX"
        }     
    };

// Using parts from highlight and route speed scripts by various authors

/* bootstrap, will call initialiseLandmarkNames() */
function bootstrapLandmarkNames()
{
    /* begin running the code! */
    setTimeout(initialiseLandmarkNames, 999);
}

function wmepn_wordWrap(str, maxWidth) {
    function testWhite(x) {
        var white = new RegExp(/^[ \t\r\n\f]$/); // We are not using \s because it matches non-breaking space too
        return white.test(x.charAt(0));
    }

    var newLineStr = "\n"; done = false; res = '';
    do {                    
        found = false;
        // Inserts new line at first whitespace of the line
        for (i = maxWidth - 1; i >= 0; i--) {
            if (testWhite(str.charAt(i))) {
                res = res + [str.slice(0, i), newLineStr].join('');
                str = str.slice(i + 1);
                found = true;
                break;
            }
        }
        // Inserts new line at maxWidth position, the word is too long to wrap
        if (!found && str.length > maxWidth) {
            res += [str.slice(0, maxWidth), newLineStr].join('');
            str = str.slice(maxWidth);
        }

        if (str.length < maxWidth)
        {
            res = res + str;
            done = true;
        }
    } while (!done);

    return res;
}

function wmepn_resetLandmarks()
{
    var venues = Waze.model.venues;
    for (var mark in venues.objects) {
        var venue = venues.get(mark);
        var poly = wmepn_getId(venue.geometry.id);
        if (poly !== null) {
            if (poly.getAttribute("stroke-opacity") != 1) {
                poly.setAttribute("fill","#d191d6");
                poly.setAttribute("stroke","#d191d6");
                poly.setAttribute("fill-opacity",0.3);
                poly.setAttribute("stroke-opacity",1);
            }
        }
    }
    wmepn_showLandmarkNames();
}

function wmepn_showLandmarkNames() {    
    wmepn_NameLayer.removeAllFeatures();
    if(wmepn_getId('sidepanel-landmarknames') === null) installLandmarkNamesTab();
    if(wmepn_getId('_cbLandmarkNamesEnable') === null) return;
    if (typeof Waze.model.venues == "undefined" || wmepn_getId('_cbLandmarkNamesEnable').checked === false) {
        wmepn_getId('_stLandmarkNumber').innerHTML = 0;
        wmepn_getId('_stLandmarkHNNumber').innerHTML = 0;
        return;
    }
    var venues = Waze.model.venues;
    var streets = Waze.model.streets;
    var map = Waze.map;
    var showNames = wmepn_NameLayer.getVisibility() && map.getLayersBy("uniqueName", "landmarks")[0].getVisibility();
    // if checkbox unticked, reset places to original style
    if (!showNames
        && !wmepn_getId('_cbLandmarkColors').checked
        && !wmepn_getId('_cbLandmarkHiliteNoName').checked) {
        for (var mark in venues.objects) {
            var venue = venues.get(mark);
            var poly = wmepn_getId(venue.geometry.id);
            if (poly !== null) {
                if (poly.getAttribute("stroke-opacity") != 1) {
                    poly.setAttribute("fill","#d191d6");
                    poly.setAttribute("stroke","#d191d6");
                    poly.setAttribute("fill-opacity",0.3);
                    poly.setAttribute("stroke-opacity",1);
                }
            }
        }
        wmepn_getId('_stLandmarkNumber').innerHTML = 0;
        wmepn_getId('_stLandmarkHNNumber').innerHTML = 0;
        return;
    }

    var hiliteNoName = wmepn_getId('_cbLandmarkHiliteNoName').checked;    
    var colorLandmarks = wmepn_getId('_cbLandmarkColors').checked;
    var showPoints = (wmepn_getId('_seLandmarkPoints').value == "all" || wmepn_getId('_seLandmarkPoints').value == "point");
    var showAreas = (wmepn_getId('_seLandmarkPoints').value == "all" || wmepn_getId('_seLandmarkPoints').value == "area");
    var showLockLevel = wmepn_getId('_cbLandmarkLockLevel').checked;
    var limitNames = wmepn_getId('_seLandmarkLimit').value;
    var nameFilterArray = wmepn_getId('_inLandmarkNameFilter').value.split("/");
    var nameFilter = (nameFilterArray.length > 1 ? nameFilterArray[1] : nameFilterArray[0]);
    var nameFilterOptions = nameFilterArray[2];
    var nameFilterRegEx = (nameFilterArray.length > 1 ? new RegExp(nameFilter, nameFilterOptions) : null);
    var doFilter = function (name) {
        if(nameFilter.length === 0)
            return true; // show all when no filter entered
        if(nameFilterRegEx === null)
            return (name.indexOf(nameFilter) >= 0);
        else
            return nameFilterRegEx.test(name);
    };

    var drawnNames = 0;
    var drawnHNs = 0;
    for (var mark in venues.objects) {
        var venue = venues.get(mark);
        var poly = wmepn_getId(venue.geometry.id);
        var isPoint = venue.geometry.toString().match(/^POINT/);
        var isArea = venue.geometry.toString().match(/^POLYGON/);
        var trimmedName = venue.attributes.name.trim();
        var noTrName = (trimmedName.length == 0);
        if(showLockLevel) trimmedName +=  (noTrName ? "" : "\n") + "[L" + (venue.attributes.lockRank+1) + "]";
        var houseNumber = venue.attributes.houseNumber;
        if (poly !== null) {
            var venueStreet = streets.get(venue.attributes.streetID);
            var haveNoName = (venue.attributes.residential ? (houseNumber === undefined || houseNumber.length == 0) : noTrName);

            if(showNames && (showAreas || showPoints) && (limitNames == 0 || drawnNames < limitNames))
            {            
                var wrappedText = wmepn_wordWrap(trimmedName, 30);
                var filterMatched = (!noTrName && doFilter(trimmedName));
                if(showAreas && isArea && filterMatched)
                {
                    // Add label texts
                    var labelFeatures = [];
                    var bounds = venue.geometry.bounds;
                    var pt;
                    //if(bounds.getWidth() * bounds.getHeight() * .3 > venue.geometry.getArea() && venue.attributes.entryExitPoints.length > 0)
                    //	pt = venue.attributes.entryExitPoints[0].point;
                    //else	
                    pt = venue.geometry.getCentroid();
                    var textFeature = new OpenLayers.Feature.Vector( pt, {labelText: wrappedText, fontColor: '#F0F0F0', pointRadius: 0 } );
                    labelFeatures.push(textFeature);
                    wmepn_NameLayer.addFeatures(labelFeatures);
                    drawnNames++;
                }
                if(showPoints && isPoint && (filterMatched || (houseNumber !== undefined && houseNumber.length > 0)))
                {
                    // Add label texts
                    var labelFeatures = [];        
                    var pt = new OpenLayers.Geometry.Point(venue.geometry.x, venue.geometry.y);
                    var isHouseNumber = !filterMatched;
                    if(venue.attributes.residential)
                    {
                        // This will add house numbers to the hidden names to house numbers of residential places (user request)
                        wrappedText = houseNumber + ' - (' + wrappedText + ')';
                    }
                    var textFeature = new OpenLayers.Feature.Vector( pt, {labelText: (isHouseNumber ? houseNumber : wrappedText), fontColor: '#F0F0F0', pointRadius: 0, yOffset: -15, style: (isHouseNumber ? "italic" : "normal") } );
                    labelFeatures.push(textFeature);
                    wmepn_NameLayer.addFeatures(labelFeatures);
                    if(isHouseNumber) drawnHNs++;
                    else drawnNames++;
                }
            }

            wmepn_getId('_stLandmarkNumber').innerHTML = drawnNames;
            wmepn_getId('_stLandmarkHNNumber').innerHTML = drawnHNs;

            // Production polygons: #d191d6, Beta editor polygons: #c290c6
            if ((poly.getAttribute("fill") == "#d191d6" || poly.getAttribute("fill") == "#c290c6") && poly.getAttribute("stroke-opacity") == 1) {
                var categories   = venue.attributes.categories;
                var colored = false;

                if(colorLandmarks)
                {
                    // gas station = orange
                    if (categories.indexOf("GAS_STATION") > -1) {
                        poly.setAttribute("fill","#f90");
                        poly.setAttribute("stroke","#f90");
                        colored = true;
                    }

                    // parking lot = cyan
                    else if (categories.indexOf("PARKING_LOT") > -1) {
                        poly.setAttribute("fill","#099");
                        poly.setAttribute("stroke","#0cc");
                    }

                    // water = blue
                    else if (categories.indexOf("RIVER_STREAM") > -1 ||
                             categories.indexOf("SEA_LAKE_POOL") > -1) {
                        poly.setAttribute("fill","#09f");
                        poly.setAttribute("stroke","#06c");
                        colored = true;
                    }

                    // park/grass/trees = green
                    else if (categories.indexOf("PARK") > -1 ||
                             categories.indexOf("FARM") > -1 ||
                             categories.indexOf("FOREST_GROVE") > -1 ||
                             categories.indexOf("GOLF_COURSE") > -1) {
                        poly.setAttribute("fill","#4f4");
                        poly.setAttribute("stroke","#6a6");
                        colored = true;
                    }
                }

                poly.setAttribute("stroke-opacity",0.97);

                // highlight places which have no name and not colored before
                if (hiliteNoName && haveNoName && colored === false) {
                    poly.setAttribute("fill","#ff8");
                    poly.setAttribute("stroke","#cc0");
                    colored = true;
                }
                // if was yellow and now not yellow, reset
                else if (poly.getAttribute("fill") == "#ff8" && (!hiliteNoName || !haveNoName)) {
                    poly.setAttribute("fill","#d191d6");
                    poly.setAttribute("stroke","#d191d6");
                    poly.setAttribute("stroke-opacity",1);
                }        
            }
        }
    }
    wmepn_getId('_stLandmarkNumber').innerHTML = '<i>' + drawnNames + '</i> ' + I18n.t("wmepn.place_names_and", {count: drawnNames});
    wmepn_getId('_stLandmarkHNNumber').innerHTML = '<i>' + drawnHNs + '</i> ' + I18n.t("wmepn.house_numbers", {count: drawnHNs});
    //map.getLayersBy("name", "Place Names")[0].setZIndex(730);
}

wmepn_NameLayer = undefined;

function wmepn_toggleOptions () {
    return false;
}

/* helper function */
function wmepn_getId(node) {
    return document.getElementById(node);
}

function installLandmarkNamesTab()
{
    if(wmepn_getId('sidepanel-landmarknames') !== null || wmepn_getId('user-info') === null) return;
    
    // helper fn
    function getElementsByClassName(classname, node) {
        if(!node) node = document.getElementsByTagName("body")[0];
        var a = [];
        var re = new RegExp('\\b' + classname + '\\b');
        var els = node.getElementsByTagName("*");
        for (var i=0,j=els.length; i<j; i++)
            if (re.test(els[i].className)) a.push(els[i]);
        return a;
    }

    // Some internationalization
    I18n.translations[I18n.locale].wmepn = wmepn_translations[I18n.locale];
    if(wmepn_translations[I18n.locale] === undefined) I18n.translations[I18n.locale].wmepn = wmepn_translations[I18n.defaultLocale];
    I18n.translations[I18n.locale].layers.name.__DrawPlaceNames = 'Place Names';

    // add new box to left of the map
    var addon = document.createElement('section');
    var translator="";
    addon.id = "landmarkname-addon";

    if(I18n.defaultLocale != I18n.locale)
        translator  = 'title="'+I18n.t("wmepn.translator")+'"';

    //if (navigator.userAgent.match(/Chrome/)) { }
    addon.innerHTML  = '<b>'
        + '<a href="https://www.waze.com/forum/viewtopic.php?f=819&t=116843" target="_blank" ' + translator + '>WME PlaceNames</a></b> &nbsp; v' + GM_info.script.version;
    if(wmepn_translations[I18n.locale] === undefined)
        addon.innerHTML  += ' <small>[<a href="https://www.waze.com/forum/viewtopic.php?f=819&t=116843&p=1302802#p1302802" target="_blank">translate me!</a>]</small>';


    // highlight landmarks
    section = document.createElement('p');
    section.style.padding = "8px 16px";
    //section.style.textIndent = "-16px";
    section.id = "nameLandmarks";
    section.innerHTML  = '<div title="'+I18n.t("wmepn.enable_script_tooltip")+'"><input type="checkbox" id="_cbLandmarkNamesEnable" /> <b>'+I18n.t("wmepn.enable_script")+'</b></div>'
        +  '<div title="'+I18n.t("wmepn.color_places_tooltip")+'"><input type="checkbox" id="_cbLandmarkColors" /> <b>'+I18n.t("wmepn.color_places")+'</b></div>'
        +  '<div title="'+I18n.t("wmepn.highlight_places_tooltip")+'"><input type="checkbox" id="_cbLandmarkHiliteNoName"/> <b>'+I18n.t("wmepn.highlight_places")+'</b></div>'
        +  '<div title="'+I18n.t("wmepn.show_tooltip")+'"><b>'+I18n.t("wmepn.show")+'</b> <select id="_seLandmarkPoints">'
        + '<option value="area">'+I18n.t("wmepn.option_areaonly")+'</option>'
        + '<option value="all">'+I18n.t("wmepn.option_areapoint")+'</option>'
        + '<option value="point">'+I18n.t("wmepn.option_pointonly")+'</option></select></div>'
        +  '<div title="'+I18n.t("wmepn.filter_tooltip")+'"><b>'+I18n.t("wmepn.filter")+':</b><input type="text" id="_inLandmarkNameFilter"/></div>'
        +  '<div title="'+I18n.t("wmepn.show_locklevel_tooltip")+'"><input type="checkbox" id="_cbLandmarkLockLevel" /> <b>'+I18n.t("wmepn.show_locklevel")+'</b></div>'
        +  '<div title="'+I18n.t("wmepn.stop_over_tooltip")+'"><b>'+I18n.t("wmepn.stop_over")+'</b> <select id="_seLandmarkLimit">'
        + '<option value="0">'+I18n.t("wmepn.option_unlimited")+'</option>'
        + '<option value="500">500</option>'
        + '<option value="200">200</option>'
        + '<option value="100">100</option>'
        + '<option value="50">50</option>'
        + '<option value="25">25</option>'
        + '<option value="10">10</option>'
        +'</select></div>'
        +   '<div><small>'+I18n.t("wmepn.showing")+' <span id="_stLandmarkNumber"></span> <span id="_stLandmarkHNNumber"></span></small></div>';
    addon.appendChild(section);

    var userTabs = wmepn_getId('user-info');
    var navTabs = getElementsByClassName('nav-tabs', userTabs)[0];
    var tabContent = getElementsByClassName('tab-content', userTabs)[0];

    newtab = document.createElement('li');
    newtab.innerHTML = '<a href="#sidepanel-landmarknames" data-toggle="tab">PlaceNames</a>';
    navTabs.appendChild(newtab);

    addon.id = "sidepanel-landmarknames";
    addon.className = "tab-pane";
    tabContent.appendChild(addon);

    // setup onclick handlers for instant update:
    wmepn_getId('_cbLandmarkColors').onclick = wmepn_resetLandmarks;
    wmepn_getId('_cbLandmarkHiliteNoName').onclick = wmepn_resetLandmarks;
    wmepn_getId('_seLandmarkPoints').onchange = wmepn_resetLandmarks;
    wmepn_getId('_cbLandmarkNamesEnable').onclick = wmepn_resetLandmarks;
    wmepn_getId('_inLandmarkNameFilter').oninput = wmepn_showLandmarkNames;
    wmepn_getId('_cbLandmarkLockLevel').onclick = wmepn_showLandmarkNames;
    wmepn_getId('_seLandmarkLimit').onchange = wmepn_showLandmarkNames;
    
    // restore saved settings
    if (localStorage.WMELandmarkNamesScript) {
        console.log("WME LandmarkNames: loading options");
        options = JSON.parse(localStorage.WMELandmarkNamesScript);

        wmepn_getId('_cbLandmarkColors').checked   	    = options[1];
        wmepn_getId('_cbLandmarkHiliteNoName').checked  = options[2];
        wmepn_getId('_seLandmarkPoints').value    		= options[3];
        wmepn_NameLayer.setVisibility(options[4]);
        if(options[5] !== undefined)
            wmepn_getId('_cbLandmarkNamesEnable').checked   = options[5];
        else wmepn_NameLayer.setVisibility(true);
        if(options[6] !== undefined)
            wmepn_getId('_inLandmarkNameFilter').value		= options[6];
        if(options[7] !== undefined)
            wmepn_getId('_cbLandmarkLockLevel').checked     = options[7];
        if(options[8] !== undefined)
            wmepn_getId('_seLandmarkLimit').value     = options[8];
        else
            wmepn_getId('_seLandmarkLimit').value     = 100;
    } else {
        wmepn_getId('_cbLandmarkColors').checked = true;
        wmepn_getId('_cbLandmarkHiliteNoName').checked = true;
        wmepn_getId('_seLandmarkPoints').value = "area";
        wmepn_NameLayer.setVisibility(true);    
        wmepn_getId('_cbLandmarkNamesEnable').checked = true;
        wmepn_getId('_cbLandmarkLockLevel').checked = false;
        wmepn_getId('_seLandmarkLimit').value = 100;
    }
    var layerItem = '<li><div class="controls-container toggler"><input class="layer-switcher-item_placenames toggle" id="layer-switcher-item_placenames" type="checkbox"><label for="layer-switcher-item_placenames"><span class="label-text">PlaceNames</span></label></div></li>';
    $("#layer-switcher-group_places").parent().parent().children("ul.children").append(layerItem);
    $("#layer-switcher-item_placenames").click(function() { wmepn_NameLayer.setVisibility(!wmepn_NameLayer.getVisibility()); });
    $("#layer-switcher-item_placenames").prop("checked", wmepn_NameLayer.getVisibility());

    if (typeof Waze.model.venues == "undefined") {
        wmepn_getId('_cbLandmarkColors').checked = false;
        wmepn_getId('_cbLandmarkHiliteNoName').checked = false;
        wmepn_getId('_cbLandmarkColors').disabled = true;
        wmepn_getId('_cbLandmarkHiliteNoName').disabled = true;
        wmepn_getId('_seLandmarkPoints').disabled = true;      
        wmepn_getId('_cbLandmarkLockLevel').disabled = true;
        wmepn_getId('_seLandmarkLimit').disabled = true;
    }    
}


/* =========================================================================== */

function initialiseLandmarkNames()
{
    // global variables
    wmepn_betaMode = location.hostname.match(/beta.waze.com/);

    var map = Waze.map;
    // Create PlaceName layer
    var rlayers = map.getLayersBy("uniqueName","__DrawPlaceNames");
    if(rlayers.length === 0) {
        var lname = "Place Names";
        var style = new OpenLayers.Style({
            strokeDashstyle: 'solid',
            strokeColor : "${strokeColor}",
            strokeOpacity: 1.0,
            strokeWidth: "${strokeWidth}",
            fillColor: '#0040FF',
            fillOpacity: 1.0,
            pointRadius: "${pointRadius}",
            label : "${labelText}",
            fontFamily: "Tahoma, Arial, Verdana",
            labelOutlineColor: '#FFEEEE',
            labelOutlineWidth: 2,
            labelAlign: 'cm',
            fontColor: "#301130",
            fontOpacity: 1.0,
            fontSize: "11px",
            display: 'block',
            labelYOffset: "${yOffset}",
            fontStyle: "${style}"
        });
        var nameLayer = new OpenLayers.Layer.Vector(lname, {
            displayInLayerSwitcher: true,
            uniqueName: "__DrawPlaceNames",
            shortcutKey: "S+n",
            accelerator: "toggle" + lname.replace(/\s+/g,''),
            styleMap: new OpenLayers.StyleMap(style)
        });
        nameLayer.setVisibility(true);
        //drc_mapLayer1.moveLayerToTop();
        map.addLayer(nameLayer);
        //var zLandmarks = map.getLayersBy("uniqueName", "landmarks")[0].getZIndex();
        //var zPlaceNames = drc_mapLayer1.getZIndex();   
        //map.getLayersBy("uniqueName", "landmarks")[0].setZIndex(zPlaceNames);
        //drc_mapLayer1.setZIndex(zLandmarks);
        wmepn_NameLayer = nameLayer;
    }
    else wmepn_NameLayer = rlayers[0];

    installLandmarkNamesTab();
    
    // overload the WME exit function
    wmepn_saveLandmarkNamesOptions = function() {
        if (localStorage && wmepn_getId('_cbLandmarkColors') !== null) {
            console.log("WME LandmarkNames: saving options");
            var options = [];

            // preserve previous options which may get lost after logout
            if (localStorage.WMELandmarkNamesScript)
                options = JSON.parse(localStorage.WMELandmarkNamesScript);

            options[1] = wmepn_getId('_cbLandmarkColors').checked;
            options[2] = wmepn_getId('_cbLandmarkHiliteNoName').checked;
            options[3] = wmepn_getId('_seLandmarkPoints').value;
            options[4] = wmepn_NameLayer.getVisibility();
            options[5] = wmepn_getId('_cbLandmarkNamesEnable').checked;
            options[6] = wmepn_getId('_inLandmarkNameFilter').value;
            options[7] = wmepn_getId('_cbLandmarkLockLevel').checked;
            options[8] = wmepn_getId('_seLandmarkLimit').value;

            localStorage.WMELandmarkNamesScript = JSON.stringify(options);
        }
    };
    window.addEventListener("beforeunload", wmepn_saveLandmarkNamesOptions, false);
    //window.setInterval(wmepn_saveLandmarkNamesOptions, 10000);

    // begin periodic updates
    //window.setInterval(wmepn_showLandmarkNames,500);

    // trigger code when page is fully loaded, to catch any missing bits
    window.addEventListener("load", function(e) {
        var mapProblems = wmepn_getId('map-problems-explanation');
        if (mapProblems !== null) mapProblems.style.display = "none";
    });

    // register some events...
    map.events.register("zoomend", null, wmepn_showLandmarkNames);
    map.events.register("changelayer", null, wmepn_showLandmarkNames);
    map.events.register("mouseout", null, wmepn_showLandmarkNames);
    Waze.selectionManager.events.register("selectionchanged", null, wmepn_showLandmarkNames);
}

/* engage! =================================================================== */
bootstrapLandmarkNames();

/* end ======================================================================= */
