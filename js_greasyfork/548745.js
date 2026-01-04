// ==UserScript==
// @name         WME PLN Core - XML Handler
// @version      9.0.0
// @description  Módulo para importar y exportar datos en formato XML para WME Place Normalizer. No funciona por sí solo.
// @author       mincho77
// @license      MIT
// @grant        none
// ==/UserScript==

// Pure core: build XML string based on provided payload (no DOM/Blob/UI)
function buildSharedDataXML(type = "words", payload) 
{
    try
    {
        let xmlParts = [];
        let rootTagName = "SharedData";
        let fileName = "wme_normalizer_data_export.xml";

        // Normalize payload pieces to plain JS structures
        const excludedWordsArr   = Array.isArray(payload?.excludedWords) ? payload.excludedWords : Array.from(payload?.excludedWords || []);
        const replacementWordsOb = payload?.replacementWords || {};
        const swapWordsArr       = Array.isArray(payload?.swapWords) ? payload.swapWords : [];
        const editorStatsObj     = payload?.editorStats || {};
        const excludedPlacesEntries = Array.isArray(payload?.excludedPlaces) 
            ? payload.excludedPlaces 
            : (payload?.excludedPlaces instanceof Map ? Array.from(payload.excludedPlaces.entries()) : []);

        if (type === "words")
        {
            rootTagName = "ExcludedWords";
            fileName = "wme_excluded_words_export.xml";

            if (excludedWordsArr.length === 0 
                && Object.keys(replacementWordsOb).length === 0
                && swapWordsArr.length === 0
                && Object.keys(editorStatsObj).length === 0)
            {
                return { xmlContent: "", fileName, empty: true, reason: "No hay datos de palabras/reemplazos/swap/estadísticas para exportar." };
            }

            // Palabras especiales
            if (excludedWordsArr.length > 0)
            {
                xmlParts.push("    <words>");
                excludedWordsArr
                    .slice()
                    .sort((a,b)=>String(a).toLowerCase().localeCompare(String(b).toLowerCase()))
                    .forEach(w => xmlParts.push(`        <word>${xmlEscape(w)}</word>`));
                xmlParts.push("    </words>");
            }

            // Reemplazos
            if (Object.keys(replacementWordsOb).length > 0)
            {
                xmlParts.push("    <replacements>");
                Object.entries(replacementWordsOb)
                    .sort((a,b)=>String(a[0]).toLowerCase().localeCompare(String(b[0]).toLowerCase()))
                    .forEach(([from,to])=>{
                        xmlParts.push(`        <replacement from="${xmlEscape(from)}">${xmlEscape(to)}</replacement>`);
                    });
                xmlParts.push("    </replacements>");
            }

            // SwapWords
            if (swapWordsArr.length > 0)
            {
                xmlParts.push("    <swapWords>");
                swapWordsArr.forEach(item=>{
                    if (item && typeof item === "object")
                    {
                        xmlParts.push(`        <swap value="${xmlEscape(item.word)}" direction="${item.direction||"start"}"/>`);
                    }
                    else
                    {
                        xmlParts.push(`        <swap value="${xmlEscape(item)}" direction="start"/>`);
                    }
                });
                xmlParts.push("    </swapWords>");
            }

            // Estadísticas
            if (Object.keys(editorStatsObj).length > 0)
            {
                xmlParts.push("    <statistics>");
                Object.entries(editorStatsObj).forEach(([userId, data])=>{
                    xmlParts.push(`        <editor id="${userId}" ` +
                        `name="${xmlEscape(data.userName||"")}" ` +
                        `total_count="${data.total_count||0}" ` +
                        `monthly_count="${data.monthly_count||0}" ` +
                        `monthly_period="${data.monthly_period||""}" ` +
                        `weekly_count="${data.weekly_count||0}" ` +
                        `weekly_period="${data.weekly_period||""}" ` +
                        `daily_count="${data.daily_count||0}" ` +
                        `daily_period="${data.daily_period||""}" ` +
                        `last_update="${data.last_update||0}" />`);
                });
                xmlParts.push("    </statistics>");
            }
        }
        else if (type === "places")
        {
            rootTagName = "ExcludedPlaces";
            fileName = "wme_excluded_places_export.xml";

            if (excludedPlacesEntries.length === 0)
            {
                return { xmlContent: "", fileName, empty: true, reason: "No hay lugares excluidos para exportar." };
            }

            xmlParts.push("    <placeIds>");
            excludedPlacesEntries
                .slice()
                .sort((a,b)=>String(a[0]).toLowerCase().localeCompare(String(b[0]).toLowerCase()))
                .forEach(([id,name])=>{
                    xmlParts.push(`        <placeId id="${xmlEscape(id)}" name="${xmlEscape(name)}"></placeId>`);
                });
            xmlParts.push("    </placeIds>");
        }
        else
        {
            return { xmlContent: "", fileName, empty: true, reason: "Tipo de exportación XML desconocido." };
        }

        const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>\n<${rootTagName}>\n${xmlParts.join("\n")}\n</${rootTagName}>`;
        return { xmlContent, fileName, empty: false };
    }
    catch (e)
    {
        plnLog('error', '[core_xml] buildSharedDataXML failed:', e);
        return { xmlContent: "", fileName: "error.xml", empty: true, reason: e?.message||'unknown' };
    }
}//buildSharedDataXML

// Pure core: parse XML text and return data without side effects (no DOM/UI writes here)
function parseSharedDataXML(type = "words", xmlText) 
{
    try
    {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(String(xmlText||''), "application/xml");
        const parserError = xmlDoc.querySelector("parsererror");
        if (parserError) 
        {
            return { success:false, error: 'Error al parsear el XML', details: parserError.textContent };
        }

        const rootTag = xmlDoc.documentElement.tagName.toLowerCase();

        const result = {
            success: true,
            type,
            newWords: 0,
            newReplacements: 0,
            overwrittenReplacements: 0,
            newPlaces: 0,
            // Parsed structures (caller decides how to merge)
            excludedWords: new Set(),
            replacementWords: {},
            swapWords: [],
            editorStats: {},
            excludedPlaces: new Map()
        };

        if (type === "words")
        {
            if (rootTag !== "excludedwords")
            {
                return { success:false, error:'Raíz incorrecta: se esperaba &lt;ExcludedWords&gt;.' };
            }

            // Words
            const words = xmlDoc.getElementsByTagName("word");
            for (let i=0; i<words.length; i++)
            {
                const val = (words[i].textContent||'').trim();
                if (val)
                {
                    if (!result.excludedWords.has(val)) result.newWords++;
                    result.excludedWords.add(val);
                }
            }

            // Reemplazos
            const replacementNodes = xmlDoc.getElementsByTagName("replacement");
            for (let i=0; i<replacementNodes.length; i++)
            {
                const from = (replacementNodes[i].getAttribute("from")||'').trim();
                const to   = (replacementNodes[i].textContent||'').trim();
                if (from && to)
                {
                    if (from in result.replacementWords)
                    {
                        if (result.replacementWords[from] !== to) result.overwrittenReplacements++;
                    }
                    else
                    {
                        result.newReplacements++;
                    }
                    result.replacementWords[from] = to;
                }
            }
        }
        else if (type === "places")
        {
            if (rootTag !== "excludedplaces")
            {
                return { success:false, error:'Raíz incorrecta: se esperaba &lt;ExcludedPlaces&gt;.' };
            }
            const placesNodes = xmlDoc.getElementsByTagName("placeId");
            for (let i=0; i<placesNodes.length; i++)
            {
                const placeId = (placesNodes[i].getAttribute("id")||'').trim();
                const placeName = (placesNodes[i].textContent||'').trim();
                if (placeId)
                {
                    if (!result.excludedPlaces.has(placeId)) result.newPlaces++;
                    result.excludedPlaces.set(placeId, placeName);
                }
            }
        }
        else
        {
            return { success:false, error:'Tipo de importación XML desconocido.' };
        }

        // SwapWords (optional section)
        const swapWordsNode = xmlDoc.querySelector("swapWords");
        if (swapWordsNode)
        {
            swapWordsNode.querySelectorAll("swap").forEach(swapNode => {
                const word = swapNode.getAttribute("value");
                const direction = swapNode.getAttribute("direction") || "start";
                if (word && !result.swapWords.some(item => (typeof item === 'object' ? item.word : item) === word))
                {
                    result.swapWords.push({ word, direction });
                }
            });
        }

        // Statistics (optional)
        const statsNode = xmlDoc.querySelector("statistics");
        if (statsNode)
        {
            const editorNode = statsNode.querySelector("editor");
            if (editorNode && editorNode.hasAttribute("total_count"))
            {
                const uid = editorNode.getAttribute("id");
                if (uid)
                {
                    result.editorStats[uid] = {
                        userName: editorNode.getAttribute("name") || '',
                        total_count: parseInt(editorNode.getAttribute("total_count"), 10) || 0,
                        monthly_count: parseInt(editorNode.getAttribute("monthly_count"), 10) || 0,
                        monthly_period: editorNode.getAttribute("monthly_period") || '',
                        weekly_count: parseInt(editorNode.getAttribute("weekly_count"), 10) || 0,
                        weekly_period: editorNode.getAttribute("weekly_period") || '',
                        daily_count: parseInt(editorNode.getAttribute("daily_count"), 10) || 0,
                        daily_period: editorNode.getAttribute("daily_period") || '',
                        last_update: parseInt(editorNode.getAttribute("last_update"), 10) || 0
                    };
                }
            }
        }

        return result;
    }
    catch (err)
    {
        return { success:false, error:'Excepción parseSharedDataXML', details: String(err) };
    }
}//parseSharedDataXML
