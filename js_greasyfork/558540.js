// ==UserScript==
// @name         Polytoria Asset Downloader
// @namespace    http://tampermonkey.net/
// @version      0.67
// @description  Download Polytoria Assets
// @author       chinese temu workers
// @match        *://*.polytoria.com/u/*
// @license      Unlicense
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/558540/Polytoria%20Asset%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/558540/Polytoria%20Asset%20Downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function createButtonElement(name, link) {
        const aElement = document.createElement("a");
        aElement.href = link;
        aElement.target = "_blank";

        aElement.className = "btn btn-outline-primary btn-sm w-100 mb-2 text-truncate";
        aElement.innerText = name;
        aElement.title = name;

        const colDiv = document.createElement("div");
        colDiv.className = "col-6 col-lg-4 p-1";
        colDiv.appendChild(aElement);

        return colDiv;
    }

    function createColorRow(partName, hexColor) {
        if (!hexColor.startsWith('#')) hexColor = '#' + hexColor;

        const container = document.createElement("div");
        container.className = "d-flex align-items-center mb-2 border-bottom pb-1";

        const swatch = document.createElement("div");
        swatch.className = "rounded border shadow-sm mr-2";
        swatch.style.cssText = `width: 24px; height: 24px; background-color: ${hexColor}; flex-shrink: 0;`;

        const info = document.createElement("div");
        info.innerHTML = `<small class="text-muted">${partName}</small><br><span class="font-weight-bold">${hexColor}</span>`;
        info.style.lineHeight = "1.2";

        container.appendChild(swatch);
        container.appendChild(info);

        return container;
    }

    const targetContainer = document.querySelector("#user-equipped-items-card > div");
    if (!targetContainer) return;

    let avatarData = {};
    try {
        const iframeSrc = document.querySelector("#user-avatar-card > div > div.position-relative > iframe").src;
        avatarData = JSON.parse(decodeURIComponent((atob(iframeSrc.substr(40)))));
        console.log("Avatar Data:", avatarData);
    } catch (e) {
        console.error("Error parsing avatar data", e);
        return;
    }

    const card = document.createElement("div");
    card.className = "card mt-3 mb-3 shadow-sm mx-3";

    const cardHeader = document.createElement("div");
    cardHeader.className = "card-header font-weight-bold";
    cardHeader.innerText = "Avatar Details";
    card.appendChild(cardHeader);

    const cardBody = document.createElement("div");
    cardBody.className = "card-body";

    const row = document.createElement("div");
    row.className = "row";


    const colAssets = document.createElement("div");
    colAssets.className = "col-md-7 col-12 border-right";

    const assetTitle = document.createElement("h6");
    assetTitle.className = "text-muted text-uppercase mb-3";
    assetTitle.innerText = "Download Assets";
    colAssets.appendChild(assetTitle);

    const assetRow = document.createElement("div");
    assetRow.className = "row no-gutters";

    const assets = [
        { key: 'face', label: 'Face' },
        { key: 'hat', label: 'Hat' },
        { key: 'shirt', label: 'Shirt' },
        { key: 'pants', label: 'Pants' },
        { key: 'tool', label: 'Tool' },
        { key: 'torso', label: 'Torso' },
        { key: 'head', label: 'Head Mesh' }
    ];

    assetRow.appendChild(createButtonElement("Character", "https://cdn.polytoria.com/static/3dview/character.glb"));

    assets.forEach(asset => {
        if (avatarData[asset.key]) {
            assetRow.appendChild(createButtonElement(asset.label, avatarData[asset.key]));
        }
    });

    if (avatarData.items && Array.isArray(avatarData.items)) {
        avatarData.items.forEach((item, index) => {
            assetRow.appendChild(createButtonElement(`Item ${index + 1}`, item));
        });
    }

    colAssets.appendChild(assetRow);
    row.appendChild(colAssets);

    const colColors = document.createElement("div");
    colColors.className = "col-md-5 col-12 mt-3 mt-md-0"; // Margin top only on mobile

    const colorTitle = document.createElement("h6");
    colorTitle.className = "text-muted text-uppercase mb-3";
    colorTitle.innerText = "Palette";
    colColors.appendChild(colorTitle);

    const colorMap = [
        { key: 'headColor', label: 'Head' },
        { key: 'torsoColor', label: 'Torso' },
        { key: 'leftArmColor', label: 'Left Arm' },
        { key: 'rightArmColor', label: 'Right Arm' },
        { key: 'leftLegColor', label: 'Left Leg' },
        { key: 'rightLegColor', label: 'Right Leg' }
    ];

    let colorFound = false;
    colorMap.forEach(part => {
        if (avatarData[part.key]) {
            colColors.appendChild(createColorRow(part.label, avatarData[part.key]));
            colorFound = true;
        }
    });

    if (!colorFound) {
        colColors.innerHTML += '<small class="text-muted">No color data found.</small>';
    }

    row.appendChild(colColors);

    cardBody.appendChild(row);
    card.appendChild(cardBody);
    targetContainer.appendChild(card);

})();