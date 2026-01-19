// ==UserScript==
// @name         Protox Block Tooltip+
// @namespace    https://restrictedword.github.io/
// @version      1.1
// @description  Adds more details to the tooltip
// @author       Word
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=protox.io
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/562171/Protox%20Block%20Tooltip%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/562171/Protox%20Block%20Tooltip%2B.meta.js
// ==/UserScript==

(() => {
    "use strict";

    const TOOLTIP_PREFIX = "[ProtoxTooltip]";
    const BLOCK_INFO_URL =
        "https://restrictedword.github.io/protox/data/block_info.json";

    let blockInfoCache = null;
    let tooltipLocked = false;
    let currentBlockId = null;

    function getGlobalTooltipElement() {
        return document.getElementById("global-tooltip");
    }

    function addTooltipProperty(tooltipElement, textValue) {
        const propertyElement = document.createElement("div");
        propertyElement.dataset.extraProp = "true";
        propertyElement.textContent = textValue;
        tooltipElement.appendChild(propertyElement);
    }

    async function loadBlockInfo() {
        if (blockInfoCache !== null) {
            return blockInfoCache;
        }

        try {
            const response = await fetch(BLOCK_INFO_URL);
            blockInfoCache = await response.json();
        } catch {
            blockInfoCache = null;
        }

        return blockInfoCache;
    }

    function clearInjectedProperties(tooltipElement) {
        const injectedNodes =
            tooltipElement.querySelectorAll("[data-extra-prop]");

        for (const node of injectedNodes) {
            node.remove();
        }
    }

    async function updateTooltipForBlock(blockId) {
        if (
            !blockId ||
            blockInfoCache === null ||
            tooltipLocked === true
        ) {
            return;
        }

        const tooltipElement = getGlobalTooltipElement();
        if (!tooltipElement) return;

        const blockData = blockInfoCache[String(blockId)];
        if (!blockData) return;

        tooltipLocked = true;

        clearInjectedProperties(tooltipElement);

        if (blockData.transparent === true) {
            addTooltipProperty(tooltipElement, "transparent: true");
        }

        if (blockData.penetrable === true) {
            addTooltipProperty(tooltipElement, "penetrable: true");
        }

        if (typeof blockData.impactResistance === "number") {
            addTooltipProperty(
                tooltipElement,
                `impactResistance: ${blockData.impactResistance}`
            );
        }

        if (blockData.climbable === true) {
            addTooltipProperty(tooltipElement, "climbable: true");
        }

        requestAnimationFrame(() => {
            tooltipLocked = false;
        });
    }

    async function initializeObserver() {
        await loadBlockInfo();

        const tooltipElement = getGlobalTooltipElement();
        if (!tooltipElement) return;

        const observer = new MutationObserver(() => {
            const textContent = tooltipElement.textContent;
            const idMatch = textContent.match(/id:\s*(\d+)/i);

            if (!idMatch) return;

            const detectedBlockId = idMatch[1];

            if (detectedBlockId === currentBlockId) {
                return;
            }

            currentBlockId = detectedBlockId;
            updateTooltipForBlock(detectedBlockId);
        });

        observer.observe(tooltipElement, {
            childList: true,
            subtree: true,
            characterData: true
        });
    }

    initializeObserver();
})();

