// ==UserScript==
// @name         YMS Copy to Clipboard
// @namespace    svvannak
// @version      2.4
// @description  Adds copy-to-clipboard buttons next to vehicle IDs, license plates, modal trailer IDs, and ISA/VRID identifiers. Only the identifier value is copied (e.g. 740553172, 1116XLK9V).
// @match        https://trans-logistics.amazon.com/yms/shipclerk*
// @grant        none
// @require      https://code.jquery.com/jquery-3.7.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/554575/YMS%20Copy%20to%20Clipboard.user.js
// @updateURL https://update.greasyfork.org/scripts/554575/YMS%20Copy%20to%20Clipboard.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const style = `
        .copyUnicodeButton {
            font-size: 14px;
            margin-left: 6px;
            cursor: pointer;
            user-select: none;
        }
    `;
    $("head").append(`<style>${style}</style>`);

    function createCopyButton(text, labelType) {
        const tooltip = labelType === "ISA" ? "Copy ISA" :
                        labelType === "VRID" ? "Copy VRID" :
                        labelType === "vehicle" ? "Copy Vehicle ID" :
                        "Copy identifier";

        return $("<span>", {
            class: `copyUnicodeButton ${labelType}`,
            title: tooltip,
            text: "📋"
        }).click(function(event) {
            event.stopPropagation();
            navigator.clipboard.writeText(text.trim());
            $(this).text("✅");
            const ref = $(this);
            setTimeout(() => {
                $(ref).text("📋");
            }, 2500);
        });
    }

    function updateCopyButtons() {
        // VEHICLE ID (main yard list)
        const vehicleSelectors = [
            "span[ng-if='yardAsset.vehicleNumber']",
            "div[ng-show='move.yardAssets[0].vehicleNumber']"
        ];
        $(vehicleSelectors.join(",")).each(function() {
            if ($(this).attr("data-copied") === "true") return;
            const rawText = $(this).html().split("<br>")[0];
            const cleanText = rawText.split(" ")[0];
            $(this).after(createCopyButton(cleanText, "vehicle"));
            $(this).attr("data-copied", "true");
        });

        // LICENSE PLATE (main yard list)
        $("span[ng-if='yardAsset.licensePlateIdentifier && yardAsset.licensePlateIdentifier.registrationIdentifier']").each(function() {
            if ($(this).attr("data-copied") === "true") return;
            const html = $(this).html();
            const [plate, region] = html.split("<br>");
            const $plateSpan = $("<span>").html(plate);
            const $copyBtn = createCopyButton(plate.trim(), "license");
            const $regionSpan = $("<div>").html(region);
            $(this).empty().append($plateSpan, $copyBtn, "<br>", $regionSpan);
            $(this).attr("data-copied", "true");
        });

        // VEHICLE ID inside yms-annotation-modal (third .ng-binding)
        const $noteValues = $("#yms-annotation-modal #noteValues .ng-binding");
        if ($noteValues.length >= 3) {
            const $vehicleIdDiv = $noteValues.eq(2);
            if ($vehicleIdDiv.attr("data-copied") !== "true") {
                const vehicleId = $vehicleIdDiv.text().trim();
                const $textSpan = $("<span>").text(vehicleId);
                const $wrap = $("<span>").css({ display: "inline-flex", alignItems: "center" }).append($textSpan, createCopyButton(vehicleId, "modalVehicle"));
                $vehicleIdDiv.empty().append($wrap).attr("data-copied", "true");
            }
        }

        // ISA / VRID identifiers (copy only the trailing value)
        $("div.shipclerk-std-label span.ng-binding:contains('ISA'), div.shipclerk-std-label span.ng-binding:contains('VRID')").each(function() {
            if ($(this).attr("data-copied") === "true") return;

            const fullText = $(this).text().trim(); // e.g. "ONT2: ISA 740553172"
            const match = fullText.match(/(ISA|VRID)\s+([A-Z0-9]+)/i) || fullText.match(/(ISA|VRID)\s+(\d+)/);
            if (!match) return;

            const labelType = match[1];
            const identifierValue = match[2];

            $(this).after(createCopyButton(identifierValue, labelType));
            $(this).attr("data-copied", "true");
        });
    }

    setInterval(updateCopyButtons, 1000);
})();
