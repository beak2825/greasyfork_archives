// ==UserScript==
// @name         Segment Smoothing Tool
// @namespace    https://github.com/georgenqueiroz
// @version      0.1
// @description  Smooths the geometry of the selected segment in Waze Map Editor
// @author       George Queiroz (georgenqueiroz)
// @match        https://www.waze.com/editor*
// @match        https://*.waze.com/*/editor*
// @match        https://*.waze.com/editor*
// @license      MIT
// @run-at       document-idle
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/562916/Segment%20Smoothing%20Tool.user.js
// @updateURL https://update.greasyfork.org/scripts/562916/Segment%20Smoothing%20Tool.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    let wmeSDK = null;

    const TRANSLATIONS = {
        en: {
            lbl_this_script_is_currently_in_beta: "This script is currently in beta.",
            lbl_select_a_segment_to_smooth: "Select a segment to smooth.",
            lbl_to_smooth: "Smooth",

            alert_no_segment_selected: "No segment selected.",
            alert_the_tool_only_works_with_one_segment_at_a_time: "The tool only works with one segment at a time.",
            alert_the_selected_item_is_not_a_segment: "The selected item is not a segment.",
            alert_this_segment_has_too_many_geometry_nodes: "This segment has too many geometry nodes.",
            alert_this_segment_is_a_straight_line: "This segment is a straight line. Please add a geometry node manually before smoothing."
        },
        pt: {
            lbl_this_script_is_currently_in_beta: "Este script está atualmente em beta.",
            lbl_select_a_segment_to_smooth: "Selecione um segmento para suavizar.",
            lbl_to_smooth: "Suavizar",
            alert_no_segment_selected: "Nenhum segmento selecionado.",
            alert_the_tool_only_works_with_one_segment_at_a_time: "A ferramenta só funciona com um segmento por vez.",
            alert_the_selected_item_is_not_a_segment: "O item selecionado não é um segmento.",
            alert_this_segment_has_too_many_geometry_nodes: "Este segmento tem muitos nós de geometria.",
            alert_this_segment_is_a_straight_line: "Este segmento é uma linha reta. Por favor, adicione um nó de geometria manualmente antes de suavizar."
        }
    };

    function _t(key) {
        let language = I18n.locale && I18n.locale.toLowerCase();
        const isPt = language && language.startsWith('pt');
        const lang = isPt ? 'pt' : 'en';

        let text = TRANSLATIONS[lang][key] || key;
        return text;
    }

    //Smoothing - Chaikin's Algorithm
    function chaikinSmooth(coords, iterations = 1) {
        if (iterations <= 0) return coords;
        if (coords.length < 3) return coords;

        let smoothed = [];

        const Ax = Number(coords[0][0]);
        const Ay = Number(coords[0][1]);
        smoothed.push([Ax, Ay]);

        for (let i = 0; i < coords.length - 1; i++) {            
            const p0x = Number(coords[i][0]);
            const p0y = Number(coords[i][1]);
            const p1x = Number(coords[i + 1][0]);
            const p1y = Number(coords[i + 1][1]);

            // Chaikin: 25% e 75%
            const Qx = 0.75 * p0x + 0.25 * p1x;
            const Qy = 0.75 * p0y + 0.25 * p1y;

            const Rx = 0.25 * p0x + 0.75 * p1x;
            const Ry = 0.25 * p0y + 0.75 * p1y;

            smoothed.push([Qx, Qy]);
            smoothed.push([Rx, Ry]);
        }

        const Bx = Number(coords[coords.length - 1][0]);
        const By = Number(coords[coords.length - 1][1]);
        smoothed.push([Bx, By]);

        return chaikinSmooth(smoothed, iterations - 1);
    }

    function getSegmentNodeLimit(segment) {
        const lengthInMeters = segment.attributes ? segment.attributes.length : (segment.length || 0);
        const limit = Math.floor(lengthInMeters);
        const hardLimit = 60;
        return Math.min(limit, hardLimit);
    }
    
    async function smoothSegmentButtonClick()
    {        
        if (!wmeSDK) {
            try {
                wmeSDK = getWmeSdk({scriptId: "smooth-segment-tool", scriptName: "Segment Smoothing Tool"});
            } catch (e) {
                alert("Error initializing WME SDK. Try reloading the page.");
                return;
            }
        }
        
        const selection = W.selectionManager.getSelectedWMEFeatures();
        
        if (selection.length === 0) {
            alert(_t("alert_no_segment_selected"));
            return;
        }

        if (selection.length > 1) {
            alert(_t("alert_the_tool_only_works_with_one_segment_at_a_time"));
            return;
        }

        const selectedItem = selection[0];

        if (selectedItem.featureType !== "segment") {
             alert(_t("alert_the_selected_item_is_not_a_segment"));
             return;
        }
        
        const segId = selectedItem.attributes ? selectedItem.attributes.id : selectedItem.id;
        const realSegment = W.model.segments.getObjectById(segId);

        if (!realSegment) {
            alert("Error retrieving segment.");
            return;
        }

        const nodeLimit = getSegmentNodeLimit(realSegment);
        if (realSegment.getGeometry().coordinates.length * 2 > nodeLimit) {
            alert(_t("alert_this_segment_has_too_many_geometry_nodes"));
            return;
        }
        
        const geometry = realSegment.getGeometry();
        const oldCoordinates = geometry.coordinates;

        if (!oldCoordinates || oldCoordinates.length < 3) {
            alert(_t("alert_this_segment_is_a_straight_line"));
            return;
        }
        
        const newCoordinates = chaikinSmooth(oldCoordinates, 1);

        console.log(`Smoothing: from ${oldCoordinates.length} points to ${newCoordinates.length} points.`);

        const cleanCoordinates = newCoordinates.map(pt => [Number(pt[0]), Number(pt[1])]);
        
        const newGeometryGeoJSON = {
            type: "LineString",
            coordinates: cleanCoordinates
        };
        
        try {
            await wmeSDK.DataModel.Segments.updateSegment({
                segmentId: segId,
                geometry: newGeometryGeoJSON
            });

            console.log("Segment smoothed successfully!");
        } catch (e) {
            console.error("Error updating segment:", e);
            alert("Error updating segment: " + e.message);
        }
    }

    function init()
    {
       if (typeof W === 'undefined' || !W.userscripts)
       {
          window.setTimeout(init, 100);
          return;
       }       

       console.log("Initialising...");

       if (W.userscripts?.state?.isReady)
       {
          createTab();
       }
       else
       {
          document.addEventListener("wme-ready", createTab, { once: true });
       }
    }

    function createHTMLTab() {
       let html = `<div style="padding: 15px; font-family: Helvetica, Arial, sans-serif;">`;       
       html += `<p style="font-size: 13px; color: #555; line-height: 1.4;">${_t("lbl_this_script_is_currently_in_beta")}</p>`;
       html += `<p style="font-size: 13px; color: #555; line-height: 1.4;">${_t("lbl_select_a_segment_to_smooth")}</p>`;
       html += `<button id="smoothSegmentButton" style="width: 100%; padding: 8px; cursor: pointer; border: 1px solid #ccc; background-color: #f0f0f0; border-radius: 5px; display: flex; justify-content: center; align-items: center; line-height: normal;">${_t("lbl_to_smooth")}</button>`;

       html += '</div>';
       return html;
   }

    async function createTab()
    {
       let { tabLabel, tabPane } = W.userscripts.registerSidebarTab("Segment Smoothing Tool");
       tabLabel.innerText = "Segment Smoothing Tool";
       tabPane.innerHTML = createHTMLTab();

       await W.userscripts.waitForElementConnected(tabPane);

       const btn = document.getElementById("smoothSegmentButton");
       if (btn) {
           btn.addEventListener("click", smoothSegmentButtonClick);
       }
    }

    init();
})();