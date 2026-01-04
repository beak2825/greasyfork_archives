// ==UserScript==
// @name         WME Coordinate Marker Slovenia - traffic reports
// @namespace    rdnnknl
// @version      0.3
// @description  Laat coördinaten DARS info zien op WME
// @author       Ronald (rdnnk)
// @match        https://www.waze.com/*editor*
// @grant        GM_xmlhttpRequest
// @connect      waze.cc
// @downloadURL https://update.greasyfork.org/scripts/549157/WME%20Coordinate%20Marker%20Slovenia%20-%20traffic%20reports.user.js
// @updateURL https://update.greasyfork.org/scripts/549157/WME%20Coordinate%20Marker%20Slovenia%20-%20traffic%20reports.meta.js
// ==/UserScript==

(function() {
    'use strict';

let customMarkerLayer = null;
let selector = null;

function setupLayer() {
    if (customMarkerLayer) return;

    customMarkerLayer = new OpenLayers.Layer.Vector("RdN Marker Layer", {
        displayInLayerSwitcher: true,
        uniqueId: "rdn_marker_layer"
    });

    W.map.addLayer(customMarkerLayer);

    selector = new OpenLayers.Control.SelectFeature(customMarkerLayer, {
        clickout: true,
        onSelect: function(feature) {
            const naam = feature.attributes.title || "Onbekend";
            const link = feature.attributes.link || null;

            console.log("RdN Marker geselecteerd via W object:", naam);

            const sidebar = document.getElementById('sidebar');
            if (sidebar) {
                let rdnInfo = document.getElementById('rdn-info-box');
                if (!rdnInfo) {
                    rdnInfo = document.createElement('div');
                    rdnInfo.id = 'rdn-info-box';
                    rdnInfo.style.cssText = "padding: 15px; background: #fff; border: 2px solid #3d7abb; border-radius: 8px; margin: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); font-family: sans-serif;";
                    sidebar.insertBefore(rdnInfo, sidebar.firstChild);
                }

                rdnInfo.innerHTML = `
                    <div style="font-size: 14px; color: #333; margin-bottom: 8px;">
                        <strong>Station:</strong> ${naam}
                    </div>
                    ${link ? `
                        <a href="${link}" target="_blank"
                           style="display: inline-block; padding: 6px 12px; background-color: #3d7abb; color: white; text-decoration: none; border-radius: 4px; font-size: 12px; font-weight: bold; text-align: center;">
                           🔗 Open Website
                        </a>` : '<span style="color: gray;">Geen link beschikbaar</span>'}
                `;
            }
            this.unselect(feature);
        }
    });

    W.map.addControl(selector);
    selector.activate();

    W.map.setLayerIndex(customMarkerLayer, W.map.layers.length);
}

function addMarker(lat, lon, naam, proc, prox, link = null) {
    // Cruciaal: Gebruik W.map voor de projectie
    alert(naam)
    const point = new OpenLayers.Geometry.Point(lon, lat).transform(
        new OpenLayers.Projection("EPSG:4326"),
        W.map.getProjectionObject()
    );

    const iconUrl = (prox === 'FRGT')
        ? 'https://maps.gstatic.com/mapfiles/ms2/micons/blue-dot.png'
        : (proc === "0000-00-00 00:00:00" || !proc)
            ? 'https://maps.gstatic.com/mapfiles/ms2/micons/yellow-dot.png'
            : 'https://maps.gstatic.com/mapfiles/ms2/micons/green-dot.png';

    const feature = new OpenLayers.Feature.Vector(
        point,
        { title: naam, link: link },
        {
            externalGraphic: iconUrl,
            graphicHeight: 32,
            graphicWidth: 32,
            graphicXOffset: -16,
            graphicYOffset: -32,
            cursor: "pointer",
            graphicTitle: naam
        }
    );

    customMarkerLayer.addFeatures([feature]);
}


    function clearMarkers() {
        if (customMarkerLayer) {
            // Unselect alles voor we verwijderen om popup-weeskinderen te voorkomen
            if(selector) {
                customMarkerLayer.features.forEach(f => selector.unselect(f));
            }
            customMarkerLayer.removeAllFeatures();
        }
    }

    function loadDataAndAddMarkers() {
        if (!W.map || !W.map.getExtent()) return;

        const projection4326 = new OpenLayers.Projection("EPSG:4326");
        const bounds = W.map.getExtent().clone().transform(
            W.map.getProjectionObject(),
            projection4326
        );

        const url = `https://waze.cc/scrpt/slo_promet.php?minLat=${bounds.bottom}&maxLat=${bounds.top}&minLon=${bounds.left}&maxLon=${bounds.right}`;
        GM_xmlhttpRequest({
            method: "GET",
            url: url,
            onload: function(response) {
                try {
                    const data = JSON.parse(response.responseText);
                    clearMarkers();
                    data.forEach(item => {
                        alert(item.naam)
                        addMarker(
                            parseFloat(item.lat),
                            parseFloat(item.lon),
                            item.naam,
                            item.PR_PROC,
                            item.prox,
                            item.link
                        );
                    });
                } catch (e) {
                    console.error("RdN Error:", e);
                }
            }
        });
        if (selector) {
    selector.deactivate();
    selector.activate();
}
    }

function init(retries = 0) {
    // 1. Basis check of de objecten bestaan
    const isReady = typeof W !== "undefined" &&
                    W.map &&
                    W.model &&
                    W.loginManager &&
                    W.loginManager.user &&
                    typeof OpenLayers !== "undefined";

    if (!isReady) {
        if (retries < 30) { // Maximaal 30 seconden proberen
            console.log("WME not ready... (" + retries + ")");
            setTimeout(() => init(retries + 1), 1000);
        }
        return;
    }

    // 2. Extra check: is de kaart-container daadwerkelijk in de DOM?
    if (!document.getElementById('WazeMap')) {
        setTimeout(() => init(retries + 1), 1000);
        return;
    }

    console.log("WME loaded. Start setup...");

    startScript();
}

function startScript() {
    setupLayer();
    loadDataAndAddMarkers();

    // Gebruik W.map.events pas nadat we zeker weten dat W.map bestaat
    W.map.events.register("moveend", W.map, loadDataAndAddMarkers);
    W.map.events.register("zoomend", W.map, loadDataAndAddMarkers);
}

// Start process
init();
})();