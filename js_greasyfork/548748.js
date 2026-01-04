// ==UserScript==
// @name         WME PLN Core Loader
// @namespace    https://greasyfork.org/en/users/mincho77
// @version      9.0.0
// @description  Cargador de módulos del núcleo para WME Place Normalizer. No funciona por sí solo.
// @author       mincho77
// @license      MIT
// @grant        none
// @require https://update.greasyfork.org/scripts/548744/1656810/WME%20PLN%20Core%20-%20Utils.js
// @require https://update.greasyfork.org/scripts/548745/1656811/WME%20PLN%20Core%20-%20XML%20Handler.js
// @require https://update.greasyfork.org/scripts/548746/1656813/WME%20PLN%20Core%20-%20AI%20Handler.js
// @require https://update.greasyfork.org/scripts/548747/1656814/WME%20PLN%20Core%20-%20Normalization%20Engine.js
// ==/UserScript==

(function() 
{
    'use strict';

    // Este objeto global 'PLNCore' contendrá todas las funciones de los módulos.
    // Esto mantiene el scope global limpio y el código organizado.
    window.PLNCore = 
    {
        // Desde _core_normalization.js
        normalization:
        {
            process: processPlaceName,
            applyReplacements: aplicarReemplazosDefinidos,
            applySwap: applySwapRules
        },

        // Desde _core_ai.js
        ai: 
        {
            getSuggestions: getAiSuggestions
        },

        // Desde _core_xml.js
        xml: 
        {
            buildSharedDataXML: buildSharedDataXML,
            parseSharedDataXML: parseSharedDataXML
        },
        // Alias de red (transporte) — mantiene compat con utils.makeRequest
        net:
        {
            request: makeRequest
        },
        // Desde _core_utils.js
        utils:
        {
            calculateDistance: calculateDistance,
            calculateArea: calculateAreaMeters,
            checkForOverlappingHours: checkForOverlappingHours,
            getCurrentDateString: getCurrentDateString,
            getCurrentISOWeekString: getCurrentISOWeekString,
            getCurrentMonthString: getCurrentMonthString,
            getLevenshteinDistance: getLevenshteinDistance,
            calculateLevenshteinDistance: calculateLevenshteinDistance,
            calculateSimilarity: calculateSimilarity,
            makeRequest: makeRequest,
            isDateWithinRange: isDateWithinRange,
            removeDiacritics: removeDiacritics,
            escapeRegExp: escapeRegExp,
            xmlEscape: xmlEscape,
            plnCapitalizeStart: plnCapitalizeStart,
            plnCapitalizeAfterHyphen: plnCapitalizeAfterHyphen,
            plnTitleCaseEs: plnTitleCaseEs,
            plnPostSwapCap: plnPostSwapCap,
            plnGetBaseVenueId: plnGetBaseVenueId
        }
    };
    // Allen Style: API estable e inmutable
    try
    {
        Object.freeze(window.PLNCore.utils);
        Object.freeze(window.PLNCore.xml);
        Object.freeze(window.PLNCore.ai);
        Object.freeze(window.PLNCore.normalization);
        Object.freeze(window.PLNCore);
    }
    catch(_){ /* entornos viejos pueden no soportar freeze */ }
})();