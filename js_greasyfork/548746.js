// ==UserScript==
// @name         WME PLN Core - AI Handler
// @namespace    https://greasyfork.org/en/users/mincho77
// @version      9.0.0
// @description  Módulo de comunicación con la API de IA para WME Place Normalizer. No funciona por sí solo.
// @author       mincho77
// @license      MIT
// ==/UserScript==
// Función para realizar solicitudes HTTP usando GM_xmlhttpRequest
function makeRequest(options)
{
    try
    {
        if (typeof window.plnUiNetRequest === 'function') {
            window.plnUiNetRequest(options); // UI/adapter ejecuta GM_xmlhttpRequest real
        } else {
            throw new Error('No request adapter (plnUiNetRequest) disponible.');
        }
    }
    catch (e)
    {
        plnLog('error', 'AI core: no hay adaptador de red (plnUiNetRequest).', e);
    }
}//makeRequest

// Función para obtener sugerencias de nombres de lugares desde la API de IA
async function getAiSuggestions(placeName, wazeCategories, placeNameToCompare = '', hooks = null)
{
    const WORKER_URL = 'https://wme-normalizer-ai.cotalvaro.workers.dev/';
    return new Promise((resolve) => {
        const req = buildAiRequestOptions(placeName, wazeCategories, placeNameToCompare, WORKER_URL, 20000);
        req.onload = function (response) {
            if (response.status >= 200 && response.status < 300) {
                try { const suggestions = JSON.parse(response.responseText); resolve(suggestions); }
                catch (e) { resolve({ error: "La respuesta de la IA no es un JSON válido." }); }
            } else {
                 try { const errorResponse = JSON.parse(response.responseText); resolve(errorResponse); }
                 catch(e) { resolve({ error: `Error HTTP ${response.status} del servidor.` }); }
            }
        };
        req.onerror = function () { resolve({ error: "Error de red al contactar el Worker." }); };
        req.ontimeout = function () { resolve({ error: "Timeout al contactar el Worker." }); };
        const adjusted = plnAdjustAiPayloadIfNeeded(req, hooks);
        makeRequest(adjusted);
    });
}//getAiSuggestions

// Helper pura: arma el objeto de request para el Worker de IA (sin efectos secundarios)
function buildAiRequestOptions(placeName, wazeCategories, placeNameToCompare = '', workerUrl = 'https://wme-normalizer-ai.cotalvaro.workers.dev/', timeoutMs = 20000)
{
    const safeName = String(placeName ?? '');
    const safeCats = Array.isArray(wazeCategories) ? wazeCategories : [];
    const safeCompare = String(placeNameToCompare ?? '');
    return {
        method: "POST",
        url: workerUrl,
        headers: { "Content-Type": "application/json" },
        data: JSON.stringify({ placeName: safeName, wazeCategories: safeCats, placeNameToCompare: safeCompare }),
        timeout: timeoutMs
    };
}

//Permite ajustar la carga útil de las solicitudes a la API de IA para incluir nombres sugeridos
function plnAdjustAiPayloadIfNeeded(options, hooks = null)
{
    try
    {
        const url = (options && options.url) || '';
        if (!/wme-normalizer-ai\.cotalvaro\.workers\.dev/i.test(url)) return options;
        if (!('data' in options) || options.data == null) return options;

        let data = options.data;
        const isString = typeof data === 'string';
        let payload = null;
        if (isString)
        {
            try
            {
                payload = JSON.parse(data);
            }
            catch (_)
            {
                return options;
            }
        }
        else if (typeof data === 'object')
        {
            payload = data;
        }
        else
        {
            return options;
        }

        const getSuggested = hooks && typeof hooks.getSuggestedNameByPlaceId === 'function'
            ? hooks.getSuggestedNameByPlaceId
            : null;

        const adjustEntry = (entry)=>{
            if (!entry || typeof entry !== 'object') return entry;
            const pid = entry.placeId || entry.place_id || entry.id || entry.venueId || entry.venue_id;
            const suggested = pid && getSuggested ? getSuggested(pid) : null;
            if (suggested)
            {
                
                if ('name' in entry) entry.name = suggested;
                else if ('text' in entry) entry.text = suggested;
                else if ('placeName' in entry) entry.placeName = suggested;
                else if ('query' in entry) entry.query = suggested;
                else if ('prompt' in entry) entry.prompt = `Normaliza este nombre de lugar: ${suggested}`;
            }
            return entry;
        };

        if (Array.isArray(payload))
        {
            payload = payload.map(adjustEntry);
        }
        else if (payload && typeof payload === 'object')
        {
            if (Array.isArray(payload.places))
            {
                payload.places = payload.places.map(adjustEntry);
            }
            else
            {
                adjustEntry(payload);
            }
        }

        const newData = isString ? JSON.stringify(payload) : payload;
        const cloned = { ...options, data: newData };
        if (isString)
        {
            cloned.headers = { ...(options.headers||{}), 'Content-Type': 'application/json' };
        }
        return cloned;
    } catch (_) {
        return options;
    }
}