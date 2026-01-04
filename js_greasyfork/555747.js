// ==UserScript==
// @name         Flight Rising: Auction House Dragon Search by Gene Rarity
// @namespace    volk.marjie
// @license      MIT
// @version      0.1
// @description  Search by gene rarity in the auction house.  In the Add Gene popup window, click buttons to add or remove all genes of a certain rarity (or higher).
// @author       Marjie Volk
// @match        https://www1.flightrising.com/auction-house/buy/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/555747/Flight%20Rising%3A%20Auction%20House%20Dragon%20Search%20by%20Gene%20Rarity.user.js
// @updateURL https://update.greasyfork.org/scripts/555747/Flight%20Rising%3A%20Auction%20House%20Dragon%20Search%20by%20Gene%20Rarity.meta.js
// ==/UserScript==

const rareGenes = [ "Alloy", "Bee", "Butterfly", "Circuit", "Constellation", "Crystal", "Eclipse", "Facet", "Filigree", "Glimmer", "Glowtail", "Harlequin", "Iridescent", "Jester", "Koi", "Lode", "Metallic", "Opal", "Petals", "Petrified", "Pharaoh", "Sarcophagus", "Shimmer", "Soap", "Stained", "Starmap", "Wasp", "Wish" ];
const limitedGenes = [ "Affection", "Boulder", "Capsule", "Chrysocolla", "Fern", "Firebreather", "Firefly", "Fissure", "Flecks", "Foam", "Ground", "Keel", "Loam", "Love", "Malachite", "Morph", "Myrid", "Orb", "Paisley", "Patchwork", "Pinstripe", "Poison", "Polkadot", "Python", "Scales", "Skink", "Slime", "Sludge", "Smirch", "Soil", "Stitched", "Spinner", "Tide", "Toxin", "Trail", "Veined", "Weaver" ];
const uncommonGenes = [ "Bar", "Blaze", "Boa", "Breakup", "Cherub", "Choir", "Chorus", "Cinder", "Current", "Daub", "Eel", "Flaunt", "Gecko", "Gembond", "Giraffe", "Jaguar", "Jupiter", "Lionfish", "Mosaic", "Python", "Ribbon", "Ringlets", "Ripple", "Runes", "Saddle", "Spines", "Vipera", "Breakup", "Current", "Eel", "Flair", "Hex", "Hypnotic", "Noxtide", "Rosette", "Saturn", "Seraph", "Crackle", "Ghost", "Lace", "Okapi", "Ringlets", "Smoke", "Sparkle", "Points" ];

const ancientBreeds= [ "Aberration", "Aether", "Auraoboa", "Banescale", "Cirrus", "Dusthide", "Everlux", "Gaoler", "Sandsurge", "Thorntail", "Undertide", "Veilspun" ]

function selectAll(popupElement)
{
    var hasAnyUnselected = false;

    for (let i = 1; i < arguments.length; i++)
    {
        var geneList = arguments[i];
        for (let j = 0; j < geneList.length; j++)
        {
            var geneName = geneList[j]
            var geneButton = popupElement.querySelector(`tbody tr[data-name='${geneName}']`);

            if (geneButton != null && !geneButton.classList.contains("ah-gene-selected"))
            {
                hasAnyUnselected = true;
                break;
            }

            for (let k = 0; k < ancientBreeds.length; k++)
            {
                geneButton = popupElement.querySelector(`tbody tr[data-name='${geneName} (${ancientBreeds[k]})']`);

                if (geneButton != null && !geneButton.classList.contains("ah-gene-selected"))
                {
                    hasAnyUnselected = true;
                    break;
                }
            }
        }
    }

    var shouldClearSelections = !hasAnyUnselected;

    for (let i = 1; i < arguments.length; i++)
    {
        geneList = arguments[i];
        for (let j = 0; j < geneList.length; j++)
        {
            geneName = geneList[j]
            geneButton = popupElement.querySelector(`tbody tr[data-name='${geneName}']`);

            if (geneButton != null && (shouldClearSelections || !geneButton.classList.contains("ah-gene-selected")))
            {
                geneButton.click();
            }

            for (let k = 0; k < ancientBreeds.length; k++)
            {
                geneButton = popupElement.querySelector(`tbody tr[data-name='${geneName} (${ancientBreeds[k]})']`);

                if (geneButton != null && (shouldClearSelections || !geneButton.classList.contains("ah-gene-selected")))
                {
                    geneButton.click();
                }
            }
        }
    }
}

(function() {
    'use strict';

    var geneSelectPopups = document.querySelectorAll(".ah-gene-select");

    for (let i = 0; i < geneSelectPopups.length; i++)
    {
        var geneSelectPopup = geneSelectPopups[i];

        var buttonContainer = document.createElement("div");
        buttonContainer.classList.add("common-dialog-section")
        buttonContainer.innerHTML=
            `<input id="rareButton" type="submit" class="redbutton anybutton" value="Rare"/>
             <input id="limitedButton" type="submit" class="redbutton anybutton" value="Limited +"/>
             <input id="uncommonButton" type="submit" class="redbutton anybutton" value="Uncommon +"/>`;

        buttonContainer.querySelector("#rareButton").onclick = () => selectAll(geneSelectPopups[i], rareGenes);
        buttonContainer.querySelector("#limitedButton").onclick = () => selectAll(geneSelectPopups[i], rareGenes, limitedGenes);
        buttonContainer.querySelector("#uncommonButton").onclick = () => selectAll(geneSelectPopups[i], rareGenes, limitedGenes, uncommonGenes);

        geneSelectPopup.insertBefore(buttonContainer, geneSelectPopup.querySelector(".ah-gene-select-filters"));
    }
})();
