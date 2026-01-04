// ==UserScript==
// @name         ADC Rules and DE
// @namespace    http://tampermonkey.net/
// @version      2025-09-11
// @description  Intercepts fetch of rules and data elements in Adobe Experience SPA, colors rows, shows adaptive legends with counters and considerations (English)
// @author       You
// @match        https://*.experience.adobe.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/549616/ADC%20Rules%20and%20DE.user.js
// @updateURL https://update.greasyfork.org/scripts/549616/ADC%20Rules%20and%20DE.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let fetchHooked = false;

    /** Find the <tr> for a rule/DE by its name */
    function findRow(itemName) {
        const td = Array.from(document.querySelectorAll("td")).find(td => {
            const link = td.querySelector("a");
            if (!link) return false;
            const linkText = link.textContent.replace(/\s+/g, " ").trim().toLowerCase();
            const normalizedName = itemName.replace(/\s+/g, " ").trim().toLowerCase();
            return linkText === normalizedName;
        });
        return td ? td.closest("tr") : null;
    }

    /** Apply background color if row exists */
    function colorRow(item, color) {
        const tr = findRow(item.attributes.name);
        if (tr) tr.style.backgroundColor = color;
    }

    /** Render or update the legend + considerations */
    function renderLegend(counters, type) {
        const target = document.querySelector(".searchWithFilter.u-flex.noBorderRight");
        if (!target) return;

        let legend = document.getElementById("adc-legend");
        if (!legend) {
            legend = document.createElement("div");
            legend.id = "adc-legend";
            legend.style.marginLeft = "16px";
            legend.style.padding = "10px 14px";
            legend.style.border = "1px solid #ccc";
            legend.style.borderRadius = "6px";
            legend.style.background = "#fff";
            legend.style.fontSize = "12px";
            legend.style.display = "flex";
            legend.style.flexDirection = "column";
            legend.style.gap = "8px";
            legend.style.maxWidth = "100%";
            target.parentNode.insertBefore(legend, target.nextSibling);
        }

        const { green, red, yellow, orange } = counters;

        // Common legend row
        const legendRow = `
          <div style="display:flex;flex-wrap:wrap;gap:12px;align-items:center;">
            <strong>${type} legend:</strong>
            <span style="display:flex;align-items:center;">
              <span style="width:12px;height:12px;background:#ACD8AA;border:1px solid #666;margin-right:6px"></span>
              Published + Enabled <strong>(${green})</strong>
            </span>
            <span style="display:flex;align-items:center;">
              <span style="width:12px;height:12px;background:#F3DF86;border:1px solid #666;margin-right:6px"></span>
              Not Published + Enabled <strong>(${yellow})</strong>
            </span>
            <span style="display:flex;align-items:center;">
              <span style="width:12px;height:12px;background:#F9AD77;border:1px solid #666;margin-right:6px"></span>
              Not Published + Disabled <strong>(${orange})</strong>
            </span>
            <span style="display:flex;align-items:center;">
              <span style="width:12px;height:12px;background:#E13D3D;border:1px solid #666;margin-right:6px"></span>
              Published + Disabled <strong>(${red})</strong>
            </span>
          </div>
        `;

        // Type-specific considerations
        let considerations = "";
        if (type === "Rules") {
            considerations = `
              <ul style="margin:4px 0 0 16px; padding:0; list-style:disc;">
                <li><strong>Desired state:</strong> all rules should be <span style="color:green;font-weight:bold;">green</span> (Published + Enabled).</li>
                <li><strong>Red rules:</strong> should be copied to the legacy tag and then deleted.</li>
                <li><strong>Yellow rules:</strong> may either have a revision that is not the latest published, or have no published revision at all — in both cases they should be deleted.</li>
                <li><strong>Orange rules:</strong> are not published and disabled, they can be safely deleted.</li>
              </ul>
            `;
        } else if (type === "Data Elements") {
            considerations = `
              <ul style="margin:4px 0 0 16px; padding:0; list-style:disc;">
                <li><strong>Desired state:</strong> all data elements should be <span style="color:green;font-weight:bold;">green</span> (Published + Enabled).</li>
                <li><strong>Red DEs:</strong> check if still needed in production; if not, copy to legacy if applicable and delete.</li>
                <li><strong>Yellow DEs:</strong> might be outdated or never published — they should be reviewed and likely deleted.</li>
                <li><strong>Orange DEs:</strong> are not published and disabled, they can be safely deleted.</li>
              </ul>
            `;
        }

        legend.innerHTML = `
          ${legendRow}
          <div style="margin-top:6px;">
            <strong>Considerations:</strong>
            ${considerations}
          </div>
        `;
    }

    function processItems(data, type) {
        let green = 0, yellow = 0, orange = 0, red = 0;

        data.forEach(item => {
            if (item.attributes.published && item.attributes.enabled) {
                colorRow(item, "#ACD8AA");
                green++;
            }
            else if (item.attributes.published && !item.attributes.enabled) {
                colorRow(item, "#E13D3D");
                red++;
            }
            else if (!item.attributes.published && item.attributes.enabled) {
                colorRow(item, "#F3DF86");
                yellow++;
            }
            else if (!item.attributes.published && !item.attributes.enabled) {
                colorRow(item, "#F9AD77");
                orange++;
            }
        });

        renderLegend({ green, red, yellow, orange }, type);
    }

    function hookFetchOnce() {
        if (fetchHooked) return;
        fetchHooked = true;
        const origFetch = window.fetch;

        window.fetch = async function(...args) {
            const response = await origFetch.apply(this, args);

            try {
                if (args[0].includes("/rules")) {
                    response.clone().json().then(data => {
                        if (!data.data) return;
                        if (Array.isArray(data.data)) {
                            processItems(data.data, "Rules");
                        }
                    });
                }
                else if (args[0].includes("/data_elements")) {
                    response.clone().json().then(data => {
                        if (!data.data) return;
                        if (Array.isArray(data.data)) {
                            processItems(data.data, "Data Elements");
                        }
                    });
                }
            } catch(e) {
                console.error("Error processing fetch:", e);
            }
            return response;
        };
    }
    hookFetchOnce();
})();
