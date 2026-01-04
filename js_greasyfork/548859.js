// ==UserScript==
// @name         WME PLN Module - Geolocation
// @version      9.0.0
// @description  Módulo de geolocalización para WME Place Normalizer. No funciona por sí solo.
// @author       mincho77
// @license      MIT
// @grant        none
// ==/UserScript==
//Función para obtener coordenadas de un lugar
function getPlaceCoordinates(venueOldModel, venueSDK)
{
    let lat = null;
    let lon = null;
    const placeId = venueOldModel ? venueOldModel.getID() : (venueSDK ? venueSDK.id : 'N/A');
    // PRIORIDAD 1: Usar el método recomendado getOLGeometry() del modelo antiguo, es el más estable.
    if (venueOldModel && typeof venueOldModel.getOLGeometry === 'function')
    {
        try
        {
            const geometry = venueOldModel.getOLGeometry();
            if (geometry && typeof geometry.getCentroid === 'function')
            {
                const centroid = geometry.getCentroid();
                if (centroid && typeof centroid.x === 'number' && typeof centroid.y === 'number')
                {
                    // La geometría de OpenLayers (OL) está en proyección Mercator (EPSG:3857)
                    // Necesitamos transformarla a coordenadas geográficas WGS84 (EPSG:4326)
                    if (typeof OpenLayers !== 'undefined' && OpenLayers.Projection)
                    {
                        const mercatorPoint = new OpenLayers.Geometry.Point(centroid.x, centroid.y);
                        const wgs84Point = mercatorPoint.transform(
                            new OpenLayers.Projection("EPSG:3857"),
                            new OpenLayers.Projection("EPSG:4326")
                        );
                        lat = wgs84Point.y;
                        lon = wgs84Point.x;
                        // Validar que las coordenadas resultantes sean válidas
                        if (typeof lat === 'number' && typeof lon === 'number' && Math.abs(lat) <= 90 && Math.abs(lon) <= 180)
                        {
                            return { lat, lon };
                        }
                    }
                }
            }
        }
        catch (e)
        {
            plnLog('error',`[WME PLN] Error obteniendo coordenadas con getOLGeometry() para ID ${placeId}:`, e);
        }
    }

    // PRIORIDAD 2: Fallback al objeto del SDK si el método anterior falló.
    // Esto es menos ideal porque .geometry está obsoleto, pero sirve como respaldo.
    if (venueSDK && venueSDK.geometry && Array.isArray(venueSDK.geometry.coordinates)) {
        lon = venueSDK.geometry.coordinates[0];
        lat = venueSDK.geometry.coordinates[1];

        if (typeof lat === 'number' && typeof lon === 'number' && Math.abs(lat) <= 90 && Math.abs(lon) <= 180) {
            return { lat, lon };
        }
    }

    // Si todo falló, retornar nulls
    plnLog('geo', `[WME PLN] No se pudieron obtener coordenadas válidas para el ID ${placeId}.`);
    return { lat: null, lon: null };
}//getPlaceCoordinates

// Función para detectar nombres duplicados cercanos y generar alertas
function detectAndAlertDuplicateNames(allScannedPlacesData)
{
    const DISTANCE_THRESHOLD_METERS = 50; // Umbral de distancia para considerar "cerca" (en metros)
    const duplicatesGroupedForAlert = new Map(); // Almacenará {normalizedName: [{places}, {places}]}

    // Paso 1: Agrupar por nombre NORMALIZADO y encontrar duplicados cercanos
    allScannedPlacesData.forEach(p1 =>
    {
        if (p1.lat === null || p1.lon === null) return; // Saltar si no tiene coordenadas

        // Buscar otros lugares con el mismo nombre normalizado
        const nearbyMatches = allScannedPlacesData.filter(p2 =>
        {
            if (p2.id === p1.id || p2.lat === null || p2.lon === null || p1.normalized !== p2.normalized) {
                return false;
            }
            const calcDist = PLNCore?.utils?.calculateDistance;
            const distance = typeof calcDist === 'function' ? calcDist(p1.lat, p1.lon, p2.lat, p2.lon) : Infinity;
            return distance <= DISTANCE_THRESHOLD_METERS;
        });

        if (nearbyMatches.length > 0)
        {
            // Si encontramos duplicados cercanos para p1, agruparlos
            const groupKey = p1.normalized.toLowerCase();
            if (!duplicatesGroupedForAlert.has(groupKey))
            {
                duplicatesGroupedForAlert.set(groupKey, new Set());
            }
            duplicatesGroupedForAlert.get(groupKey).add(p1); // Añadir p1
            nearbyMatches.forEach(p => duplicatesGroupedForAlert.get(groupKey).add(p)); // Añadir todos sus duplicados
        }
    });
    // Paso 2: Generar el mensaje de alerta final
    if (duplicatesGroupedForAlert.size > 0)
    {
        let totalNearbyDuplicateGroups = 0; // Para contar la cantidad de "nombres" con duplicados
        const duplicateEntriesHtml = []; // Para almacenar las líneas HTML de la alerta formateadas

        duplicatesGroupedForAlert.forEach((placesSet, normalizedName) =>
        {
            const uniquePlacesInGroup = Array.from(placesSet); // Convertir Set a Array
            if (uniquePlacesInGroup.length > 1) { // Solo si realmente hay más de un lugar en el grupo
                totalNearbyDuplicateGroups++;

                // Obtener los números de línea para cada lugar en este grupo
                const lineNumbers = uniquePlacesInGroup.map(p => {
                    const originalPlaceInInconsistents = allScannedPlacesData.find(item => item.id === p.id);
                    return originalPlaceInInconsistents ? (allScannedPlacesData.indexOf(originalPlaceInInconsistents) + 1) : 'N/A';
                }).filter(num => num !== 'N/A').sort((a, b) => a - b); // Asegurarse que son números y ordenarlos

                // Marcar los lugares en `allScannedPlacesData` para el `⚠️` visual
                uniquePlacesInGroup.forEach(p => {
                    const originalPlaceInInconsistents = allScannedPlacesData.find(item => item.id === p.id);
                    if (originalPlaceInInconsistents)
                    {
                        originalPlaceInInconsistents.isDuplicate = true;
                    }
                });
                // Construir la línea para el modal
                duplicateEntriesHtml.push(`
                    <div style="margin-bottom: 5px; font-size: 15px; text-align: left;">
                        <b>${totalNearbyDuplicateGroups}.</b> Nombre: <b>${normalizedName}</b><br>
                        <span style="font-weight: bold; color: #007bff;">Registros: [${lineNumbers.join("],[")}]</span>
                    </div>
                `);
            }
        });
        // Solo mostrar la alerta si realmente hay grupos de más de 1 duplicado cercano
        if (duplicateEntriesHtml.length > 0)
        {
            // Crear el modal
            const modal = document.createElement("div");
            modal.setAttribute("role", "dialog");
            modal.setAttribute("aria-label", "Duplicados cercanos");
            modal.style.position = "fixed";
            modal.style.top = "50%";
            modal.style.left = "50%";
            modal.style.transform = "translate(-50%, -50%)";
            modal.style.background = "#fff";
            modal.style.border = "1px solid #aad";
            modal.style.padding = "28px 32px 20px 32px";
            modal.style.zIndex = "20000"; // Z-INDEX ALTO para asegurar que esté encima
            modal.style.boxShadow = "0 4px 24px rgba(0,0,0,0.18)";
            modal.style.fontFamily = "sans-serif";
            modal.style.borderRadius = "10px";
            modal.style.textAlign = "center";
            modal.style.minWidth = "400px";
            modal.style.maxWidth = "600px";
            modal.style.maxHeight = "80vh"; // Para scroll si hay muchos duplicados
            modal.style.overflowY = "auto"; // Para scroll si hay muchos duplicados

            // Ícono visual
            const iconElement = document.createElement("div");
            iconElement.innerHTML = "⚠️"; // Signo de advertencia
            iconElement.style.fontSize = "38px";
            iconElement.style.marginBottom = "10px";
            modal.appendChild(iconElement);

            // Mensaje principal
            const messageTitle = document.createElement("div");
            messageTitle.innerHTML = `<b>¡Atención! Se encontraron ${duplicateEntriesHtml.length} nombres duplicados.</b>`;
            messageTitle.style.fontSize = "20px";
            messageTitle.style.marginBottom = "8px";
            modal.appendChild(messageTitle);

            const messageExplanation = document.createElement("div");
            messageExplanation.textContent = `Los siguientes grupos de lugares se encuentran a menos de ${DISTANCE_THRESHOLD_METERS}m uno del otro. El algoritmo asume que son el mismo lugar, por favor revisa los registros indicados en el panel flotante:`;
            messageExplanation.style.fontSize = "15px";
            messageExplanation.style.color = "#555";
            messageExplanation.style.marginBottom = "18px";
            messageExplanation.style.textAlign = "left"; // Alinear texto explicativo a la izquierda
            modal.appendChild(messageExplanation);

            // Lista de duplicados
            const duplicatesListDiv = document.createElement("div");
            duplicatesListDiv.style.textAlign = "left"; // Alinear la lista a la izquierda
            duplicatesListDiv.style.paddingLeft = "10px"; // Pequeño padding para los números
            duplicatesListDiv.innerHTML = duplicateEntriesHtml.join('');
            modal.appendChild(duplicatesListDiv);

            // Botón OK
            const buttonWrapper = document.createElement("div");
            buttonWrapper.style.display = "flex";
            buttonWrapper.style.justifyContent = "center";
            buttonWrapper.style.gap = "18px";
            buttonWrapper.style.marginTop = "20px"; // Espacio superior

            const okBtn = document.createElement("button");
            okBtn.textContent = "OK";
            okBtn.style.padding = "7px 18px";
            okBtn.style.background = "#007bff";
            okBtn.style.color = "#fff";
            okBtn.style.border = "none";
            okBtn.style.borderRadius = "4px";
            okBtn.style.cursor = "pointer";
            okBtn.style.fontWeight = "bold";

            okBtn.addEventListener("click", () => modal.remove()); // Cierra el modal

            buttonWrapper.appendChild(okBtn);
            modal.appendChild(buttonWrapper);

            document.body.appendChild(modal); // Añadir el modal al body
        }
    }
}//detectAndAlertDuplicateNames
// Función para aplicar la ciudad seleccionada a un lugar
async function plnApplyCityToVenue(venueId, selectedCityId, selectedCityName)
{
    plnLog('geo', 'apply:start', { venueId, selectedCityId, selectedCityName });
    if (!wmeSDK?.DataModel?.Venues?.updateAddress)
    {
        plnLog('geo', 'apply:sdkNotReady');
        return;
    }
    try
    {
        const venueIdStr    = String(venueId);
        const cityIdNum     = Number(selectedCityId) || 0;
        // Intento obtener houseNumber (no bloqueante), es una buena práctica mantenerlo.
        let houseNumber = '';
        try
        {
            const v0 = wmeSDK.DataModel.Venues.getById?.({ venueId: venueIdStr });
            if (v0?.address?.houseNumber) houseNumber = String(v0.address.houseNumber);
        }
        catch (_)
        { /* noop */ }

        // MODIFICACIÓN CLAVE: Se elimina la lógica de espera y el "Plan B (bridge)".
        // Simplemente llamamos a la función que aplica la ciudad y confiamos en que funciona.
        const attemptKind = plnApplyCityOnce(venueIdStr, cityIdNum, houseNumber);
        if (attemptKind)
        {
            // Si attemptKind no es nulo, significa que se pudo construir y enviar la solicitud al SDK.
            // Asumimos el éxito aquí, ya que la espera en la UI es el punto de fallo.
            plnLog('geo', 'apply:doneWithSDK: optimistic success');

            // El llamado a plnTryAutoApplyAddressPanel ya está dentro de plnApplyCityOnce,
            // por lo que se ejecutará automáticamente.
            return;
        }
        // Si plnApplyCityOnce devuelve null, significa que no pudo encontrar los IDs necesarios.
        // Solo en este caso, lanzamos el error.
        plnLog('geo', 'apply:noSdkVenueOrAddress', { reason: "Could not resolve IDs for city.", cityIdNum });
    }
    catch (e)
    {
        plnLog('error', 'apply:sdkBranchError', e);
    }
}//plnApplyCityToVenue

//**************************************************************************
    //Nombre: plnExtractAddressIds
    //Fecha modificación: 2025-08-10
    //Descripción: SDK‑only. Obtiene countryID y stateID desde sdkVenue.address,
    //             incluso cuando Street/City están vacíos.
    //**************************************************************************
    function plnExtractAddressIds(venueId, sdkVenue) {
      plnLog('geo', 'extractIds:start', { venueId, hasSdkVenue: !!sdkVenue });
      const out = { countryID: null, stateID: null, streetName: '', houseNumber: '' };
      if (sdkVenue && sdkVenue.address) {
        const addr = sdkVenue.address;
        out.countryID   = addr?.country?.id ?? addr?.countryID ?? addr?.countryId ?? null;
        out.stateID     = addr?.state?.id   ?? addr?.stateID   ?? addr?.stateId   ?? null;
        out.streetName  = addr?.street?.name ?? addr?.streetName ?? '';
        out.houseNumber = addr?.houseNumber ?? '';
      }
      plnLog('geo', 'extractIds:fromSDK', out);
      return out;
    }

    //**************************************************************************
    //Nombre: plnResolveIdsFromCity
    //Fecha modificación: 2025-08-10
    //Descripción: SDK-only. A partir de cityId intenta obtener stateID y countryID
    //             usando los repositorios del SDK (Cities → States → Countries).
    //**************************************************************************
    function plnResolveIdsFromCity(cityId)
    {
        const out = { countryID: null, stateID: null };
        try {
            if (!wmeSDK || !wmeSDK.DataModel) return out;
            const cityIdNum = Number(cityId);

            let city = null;
            try {
            if (wmeSDK.DataModel.Cities?.getById) {
                city = wmeSDK.DataModel.Cities.getById({ cityId: cityIdNum }); // <-- number
            }
            } catch(_) {}
            plnLog('geo', 'resolveFromCity:city', { requested: cityIdNum, found: !!city });
            if (!city) return out;

            let stateId = city.state?.id ?? city.stateID ?? city.stateId ?? city.attributes?.state?.attributes?.id ?? city.attributes?.state?.id ?? null;
            let countryId = city.country?.id ?? city.countryID ?? city.countryId ?? city.attributes?.country?.attributes?.id ?? city.attributes?.country?.id ?? null;

            if (!countryId && stateId && wmeSDK.DataModel.States?.getById) {
            try {
                const state = wmeSDK.DataModel.States.getById({ stateId: Number(stateId) }); // <-- number
                countryId = state?.country?.id ?? state?.countryID ?? state?.countryId ?? null;
            } catch(_) {}
            }

            if (stateId) out.stateID = Number(stateId);
            if (countryId) out.countryID = Number(countryId);
            plnLog('geo', 'resolveFromCity:result', out);
        } catch (e) {
            plnLog('error','resolveFromCity:error', e);
        }
        return out;
    }//plnResolveIdsFromCity


//Permite obtener el ID de la calle vacía (empty street) para una ciudad dada.
function plnGetEmptyStreetIdForCity(cityId)
{
    const cidNum = Number(cityId);
    try
    {
        if (wmeSDK?.DataModel?.Streets?.getStreet)
        {
            const st = wmeSDK.DataModel.Streets.getStreet({ cityId: cidNum, streetName: '' }); // <-- number
            if (st && st.id != null) { plnLog('geo', 'streets:emptyFound', { cityId: cidNum, streetId: Number(st.id) }); return Number(st.id); }
        }
    }
    catch (_)
    { }

    try
    {
        const all = (wmeSDK?.DataModel?.Streets?.getAll?.() || []);
        const found = all.find(s => Number(s?.city?.id) === cidNum && (s?.isEmpty || s?.name === '' || s?.streetName === ''));
        if (found) { plnLog('geo', 'streets:emptyFound', { cityId: cidNum, streetId: Number(found.id) }); return Number(found.id); }
    }
    catch (_)
    { }

    try
    {
        for (let i = 0; i < 8; i++)
        {
            const all = (wmeSDK?.DataModel?.Streets?.getAll?.() || []);
            const found = all.find(s => Number(s?.city?.id) === cidNum && (s?.isEmpty || s?.name === '' || s?.streetName === ''));
            if (found)
            {
                plnLog('geo', 'streets:emptyFound', { cityId: cidNum, streetId: Number(found.id) }); return Number(found.id);
            }
        }
    }
    catch (_)
    { }

    return null;
}//plnGetEmptyStreetIdForCity
//Permite obtener la ciudad asignada a un lugar en este momento (sincrónico).
function plnGetVenueCityIdNow(venueIdStr)
{
    try
    {
        const v = wmeSDK?.DataModel?.Venues?.getById?.({ venueId: String(venueIdStr) });
        const cid = v?.address?.city?.id ?? v?.address?.cityID ?? v?.address?.cityId ?? null;
        return (cid != null) ? Number(cid) : null;
    }
    catch (_)
    { return null; }
}
//Permite esperar hasta que un lugar tenga asignada la ciudad esperada (o se agote el tiempo).
function plnWaitVenueCity(venueIdStr, expectedCityId, timeoutMs = 1500)
{
    return new Promise(resolve =>
    {
    const start = Date.now();
    const target = Number(expectedCityId);
        const tick = setInterval(() =>
        {
            const cid = plnGetVenueCityIdNow(venueIdStr);
            if (cid === target){ clearInterval(tick); return resolve(true); }
            if (Date.now() - start > timeoutMs){ clearInterval(tick); return resolve(false); }
        }, 120);
    });
}
//Permite buscar una ciudad puente (bridge) en un estado dado.
function plnFindBridgeCityIdInState(stateId)
{
    try
    {
        const all = (wmeSDK?.DataModel?.Streets?.getAll?.() || []);
        const match = all.find(s =>
        (s?.isEmpty || s?.name === '' || s?.streetName === '') &&
        Number(s?.city?.state?.id ?? s?.city?.stateID ?? s?.city?.stateId) === Number(stateId)
        );
        return match?.city?.id != null ? Number(match.city.id) : null;
    }
    catch (_)
    {
        return null;
    }
}
//Permite aplicar una ciudad a un lugar, una sola vez.
function plnApplyCityOnce(venueIdStr, cityIdNum, houseNumber)
{
    // Ruta 1: street vacío específico
    const emptyStreetId = plnGetEmptyStreetIdForCity(cityIdNum);
    if (emptyStreetId != null)
    {
        const args = { venueId: venueIdStr, streetId: Number(emptyStreetId) };
        if (houseNumber) args.houseNumber = houseNumber;
        plnLog('geo', 'apply:updateAddress(args)', args);
        wmeSDK.DataModel.Venues.updateAddress(args);
        setTimeout(()=>{ try{ plnTryAutoApplyAddressPanel?.(); }catch{} }, 200);
        return 'streetId';
    }
    // Ruta 2: IDs completos con emptyStreet:true
    const ids = plnResolveIdsFromCity(cityIdNum);
    plnLog('geo', 'apply:fallbackIds', ids);
    if (ids.countryID && ids.stateID)
    {
        const args2 =
        {
            venueId:   venueIdStr,
            countryID: Number(ids.countryID),
            stateID:   Number(ids.stateID),
            cityID:    Number(cityIdNum),
            emptyStreet: true
        };
        if (houseNumber) args2.houseNumber = houseNumber;
        plnLog('geo', 'apply:updateAddress(args2)', args2);
        wmeSDK.DataModel.Venues.updateAddress(args2);
        setTimeout(()=>{ try{ plnTryAutoApplyAddressPanel?.(); }catch{} }, 200);
        return { type:'ids', ids };
    }

    return null;
}//plnApplyCityOnce



