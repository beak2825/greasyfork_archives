// ==UserScript==
// @name         WME HN Display
// @namespace    http://www.waze.com/
// @version      2025.12.10.01
// @description  Display house numbers and stop points on the map
// @author       russblau
// @require      https://cdn.jsdelivr.net/npm/@turf/turf@7/turf.min.js
// @match        *://*.waze.com/*editor*
// @exclude      *://*.waze.com/user/editor*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=waze.com
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/548514/WME%20HN%20Display.user.js
// @updateURL https://update.greasyfork.org/scripts/548514/WME%20HN%20Display.meta.js
// ==/UserScript==

/* global $, turf */
/* jslint esversion: 11 */

(function() {
    'use strict';

    window.SDK_INITIALIZED.then(init);

    function init() {
        const WME = window.getWmeSdk({scriptId: "hnDisplay", scriptName:"WME HN Display"});
        const LAYER = "HN Display layer";
        const settings = {
            lineStyle: "dot",
            minZoom: 17,
            visibility: true,
        };
        let modified_hns = {};

        function hnColor(hn) {
            return (hn.isForced ? (hn.updatedBy ? "orange" : "red") : (hn.updatedBy? "white" : "yellow"));
        }

        async function renderHNs() {
            WME.Map.removeAllFeaturesFromLayer({layerName: LAYER});
            setZIndex();
            $('.house-number-marker').css("background-color", "white");
            $(".house-number-marker").not(".valid").css("border", "1px solid red");
            $('.house-number .number').parent().css("background-color", "white");
            if (settings.visibility && WME.Map.getZoomLevel() >= settings.minZoom) {
                const segIds = WME.DataModel.Segments.getAll().map((s) => s.id);
                WME.DataModel.HouseNumbers.fetchHouseNumbers({segmentIds: segIds})
                    .then((hns) => {
                        hns.forEach((hn) => {
                            const color = hnColor(hn);
                            if (modified_hns[hn.id]) {
                                return;
                            }
                            if ($('.house-number-marker').length > 0) {
                                // WME is displaying HN markers
                                $(`.house-number-marker[data-id='${hn.id}']`).css("background-color", color).css("border", "0");
                            } else {
                                // we have to display the number ourselves
                                const feature = {type: "Feature",
                                                 id: `mk${hn.id}`,
                                                 geometry: hn.geometry,
                                                 properties: {color: color, label: hn.number, stroke: 0}
                                                };
                                WME.Map.addFeatureToLayer({layerName: LAYER, feature: feature});
                            }
                            const line = {type: "Feature",
                                          id: `ln${hn.id}`,
                                          geometry: turf.lineString([hn.geometry.coordinates, hn.fractionPoint.coordinates]).geometry,
                                          properties: {color: color, stroke: 1},
                                         };
                            WME.Map.addFeatureToLayer({layerName: LAYER, feature: line});
                        });
                    }
                );
            }
            // check for HN markers on selected segments, if any
            const selection = WME.Editing.getSelection();
            if (selection?.objectType === "segment") {
                const selectedHNs = await WME.DataModel.HouseNumbers.fetchHouseNumbers({segmentIds: selection.ids});
                $.each(selectedHNs, (_, hn) => {
                    // find HN marker that matches this number
                    if (modified_hns[hn.id] || !settings.visibility) {
                        $(`.house-number .number[value="${hn.number}"]`).parent().css("background-color", "white");
                    } else {
                        $(`.house-number .number[value="${hn.number}"]`).parent().css("background-color", hnColor(hn));
                    }
                });
            }
        }

        function hnChange( payload ) {
            const hn_id = payload.houseNumberId;
            modified_hns[hn_id] = "changed";
            renderHNs();
        }

        function hnDelete( payload ) {
            const hn_id = payload.houseNumberId;
            modified_hns[hn_id] = "deleted";
            renderHNs();
        }

        function layerCheckbox( data ) {
            if (data.name === "HN Display") {
                WME.Map.setLayerVisibility({ layerName: LAYER, visibility: data.checked });
                settings.visibility = data.checked;
                localStorage.setItem("WME_HNDisplay", JSON.stringify(settings));
                console.log(settings);
                renderHNs();
            }
        }

        function validateLineStyle( style ) {
            if (["dot", "dash", "dashdot", "longdash", "longdashdot", "solid"].includes(style.toLowerCase()) ) {
                return style.toLowerCase();
            }
            return "dot";
        }

        function changeLineStyle( e ) {
            settings.lineStyle = validateLineStyle($(`input[name="lineStyle"]:checked`).val());
            renderHNs();
            localStorage.setItem("WME_HNDisplay", JSON.stringify(settings));
            console.log(settings);
        }

        function setZIndex() {
            // does GIS Layers exist?
            if ($('span[title="GIS Layers"]').length > 0) {
                console.log("WME HN Display: adjusting Z index");
                WME.Map.setLayerZIndex({ layerName: LAYER, zIndex: WME.Map.getLayerZIndex({layerName: 'GIS Layers - Default'}) + 6 });
            } else {
                new MutationObserver(watchForGISLayers).observe(document.querySelector("#user-tabs"), {subtree: true, childList: true});
            }
        }

        function watchForGISLayers(records, observer) {
            for (const record of records) {
                if (record.addedNodes.length > 0) {
                    for (const node of record.addedNodes) {
                        if ($(node).attr("title") === "GIS Layers") {
                            console.log("WME HN Display: adjusting Z index");
                            setTimeout(() => WME.Map.setLayerZIndex({ layerName: LAYER, zIndex: WME.Map.getLayerZIndex({layerName: 'GIS Layers - Default'}) + 6 }), 100);
                            observer.disconnect();
                            return;
                        }
                    }
                }
            }
        }

        function initializeUI( result ) {
            const { tabLabel, tabPane } = result;
            tabLabel.innerText = "HND";
            tabLabel.title = "House Number Display";
            tabPane.innerHTML = `\
<h2 style="font-size: 18px;">House Number Display options</h2>
<label for="minZoom">Display HNs at zoom >= </label><input id="hndMinZoom" type="number" name="minZoom" value="${settings.minZoom}" min="14" max="22"/><br /><br />
<fieldset>
  <legend style="font-size: 16px;">Stop point line style:</legend>
  <div>
    <input type="radio" id="hndStyleDot" name="lineStyle" value="dot" required />
    <label for="hndStyleDot">Dotted</label><br />
    <input type="radio" id="hndStyleDash" name="lineStyle" value="dash" />
    <label for="hndStyleDash">Dashed</label><br />
    <input type="radio" id="hndStyleDashDot" name="lineStyle" value="dashdot" />
    <label for="hndStyleDashDot">Dash&ndash;dot</label><br />
    <input type="radio" id="hndStyleLongDash" name="lineStyle" value="longdash" />
    <label for="hndStyleLongDash">Long dash</label><br />
    <input type="radio" id="hndStyleLongDashDot" name="lineStyle" value="longdashdot" />
    <label for="hndStyleLongDashDot">Long dash&ndash;dot</label><br />
    <input type="radio" id="hndStyleSolid" name="lineStyle" value="solid" />
    <label for="hndStyleSolid">Solid</label><br />
  </div>
</fieldset>
<h4 style="font-size: 16px; border-top: 1px solid black; background-color: #e0ffff;">Legend</h4>
<div id="hndLegend" style="font-family: sans-serif; font-size: 12px; font-weight: bold; line-height: 1.75; background-color: #e0ffff;">
  <div>Edited, unforced <span style="background-color: white;">123</span></div>
  <div>Edited, forced <span style="background-color: orange;">234</span></div>
  <div>Unedited, unforced <span style="background-color: yellow;">345</span></div>
  <div>Unedited, forced <span style="background-color: red;">456</span></div>
</div>
<div style="border-bottom: 1px solid black;"></div>
`;
            $('#hndLegend span').css("border-radius", "10px").css("padding", "4px");
            $(`input[value="${validateLineStyle(settings.lineStyle)}"]`).attr("checked", true);
            $('input[name="lineStyle"]').on("input", changeLineStyle);
            $('#hndMinZoom').on("change", (e) => {
                settings.minZoom = $('#hndMinZoom').val();
                localStorage.setItem("WME_HNDisplay", JSON.stringify(settings));
                console.log(settings);
            });
        }

        // initialize script
        WME.Events.once({ eventName: "wme-ready" }).then(() => {
            $.extend(settings, JSON.parse(localStorage.getItem("WME_HNDisplay") ?? "{}"));
            WME.Map.addLayer({layerName: LAYER,
                              styleContext: {
                                  getColor: ({feature}) => feature?.properties.color ?? "white",
                                  getLabel: ({feature}) => feature?.properties.label ?? "",
                                  getLineStyle: () => settings.lineStyle,
                                  getStroke: ({feature}) => feature?.properties.stroke ?? 0
                              },
                              styleRules: [
                                  {
                                      style: {
                                          fillColor: "",
                                          fillOpacity: "",
                                          fontColor: "black",
                                          fontFamily: 'sans-serif;',
                                          fontOpacity: 1,
                                          fontSize: '12px',
                                          fontWeight: 'bold',
                                          label: "${getLabel}",
                                          labelOutlineColor: "${getColor}",
                                          labelOutlineWidth: 5,
                                          strokeColor: "${getColor}",
                                          strokeDashstyle: "${getLineStyle}",
                                          strokeOpacity: "${getStroke}",
                                          strokeWidth: 3,
                                      },
                                  },
                              ],
//                              zIndexing: true,
                             });
            WME.Map.setLayerOpacity({ layerName: LAYER, opacity: 1 })
            WME.Map.setLayerVisibility({ layerName: LAYER, visibility: settings.visibility });
            WME.Sidebar.registerScriptTab().then(initializeUI);
            WME.LayerSwitcher.addLayerCheckbox({ name: "HN Display", isChecked: settings.visibility });
            WME.Events.on({ eventName: "wme-house-number-moved", eventHandler: hnChange });
            WME.Events.on({ eventName: "wme-house-number-updated", eventHandler: hnChange });
            WME.Events.on({ eventName: "wme-house-number-deleted", eventHandler: hnDelete });
            WME.Events.on({ eventName: "wme-selection-changed", eventHandler: renderHNs });
            WME.Events.on({ eventName: "wme-map-data-loaded", eventHandler: renderHNs });
            WME.Events.on({ eventName: "wme-layer-checkbox-toggled", eventHandler: layerCheckbox });
            WME.Events.on({ eventName: "wme-save-finished", eventHandler: () => { modified_hns = {}; }});
            console.log("WME HN Display: initialized");
        });
    }
})();