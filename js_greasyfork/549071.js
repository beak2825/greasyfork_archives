// ==UserScript==
// @name         ruTorrent Ratio Color
// @namespace    http://tampermonkey.net/
// @version      2025-09-10:3
// @description  Enhance ruTorrent with dynamic color coding for torrent ratios.
// @author       razorwax
// @match        *://*/*rutorrent/
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/549071/ruTorrent%20Ratio%20Color.user.js
// @updateURL https://update.greasyfork.org/scripts/549071/ruTorrent%20Ratio%20Color.meta.js
// ==/UserScript==

const config = {
    debug: false,
    maxRatio: 10.0,
    selectors: {
        ratioElem: ".stable-List-col-6",
        ratioParent: "div.stable-body tbody:not([class])",
        parentContainer: "div#List"
    }
};

let ratioElemIdentifier = config.selectors.ratioElem;
let ratioParentElemIdentifier = config.selectors.ratioParent;
let parentContainerElemIdentifier = config.selectors.parentContainer;

let alertCount = 0;

function TriggerError(msg)
{
    const taggedMsg = "[DDRatiocolor] Error: " + msg;
    console.error(taggedMsg);
    if (alertCount < 1)
    {
        alert(taggedMsg);
        alertCount++;
    }
    else
    {
        console.warn(taggedMsg);
    }
}

const TriggerLog = msg => { if (config.debug) console.log(`[DDRatiocolor] Log: ${msg}`); };

function Clamp(value, min, max)
{
    return Math.min(Math.max(value, min), max);
}

function MapRange(value, inputMin, inputMax, outputMin = 0.0, outputMax = 1.0)
{
    outputMin = typeof outputMin === 'number' ? outputMin : 0.0;
    outputMax = typeof outputMax === 'number' ? outputMax : 1.0;

    if (inputMin === inputMax)
    {
        return outputMin;
    }

    if (inputMin > inputMax)
    {
        [inputMin, inputMax] = [inputMax, inputMin];
    }

    let flippedOutput = false;
    if (outputMin > outputMax)
    {
        flippedOutput = true;
        [outputMin, outputMax] = [outputMax, outputMin];
    }

    let mappedValue = outputMin + ((value - inputMin) / (inputMax - inputMin)) * (outputMax - outputMin);

    if (flippedOutput)
    {
        mappedValue = outputMin + outputMax - mappedValue;
    }

    return Clamp(mappedValue, outputMin, outputMax);
}

// Interpolate between two colors depending on the supplied factor, it also adds an extra effect on the final color to make them match better with each other
function InterpolateColorWithEffect(color1, color2, factor)
{
    factor = Clamp(factor, 0, 1);

    const r1 = parseInt(color1.substring(1, 3), 16);
    const g1 = parseInt(color1.substring(3, 5), 16);
    const b1 = parseInt(color1.substring(5, 7), 16);

    const r2 = parseInt(color2.substring(1, 3), 16);
    const g2 = parseInt(color2.substring(3, 5), 16);
    const b2 = parseInt(color2.substring(5, 7), 16);

    const neutralFactor = 0.5;
    const addColor = neutralFactor * 200.0;
    const darkenFactor = MapRange(neutralFactor, 0.0, 1.0, 1.0, 0.5);

    const r = Math.round(Clamp((r1 + (r2 - r1) * factor + addColor) * darkenFactor, 0.0, 255.0));
    const g = Math.round(Clamp((g1 + (g2 - g1) * factor + addColor) * darkenFactor, 0.0, 255.0));
    const b = Math.round(Clamp((b1 + (b2 - b1) * factor + addColor) * darkenFactor, 0.0, 255.0));

    var hex = '#' + (r << 16 | g << 8 | b).toString(16).padStart(6, '0');

    return hex;
}

function SetColorOnRatioElem(ratioElem)
{
    if (!ratioElem)
    {
        TriggerError("SetColorOnRatioElem was called without correct elem!");
        return;
    }

    const ratio = parseFloat(ratioElem.textContent);
    if (isNaN(ratio))
    {
        TriggerError("SetColorOnRatioElem was called with a ratio element that was not converted to a valid number: " + ratioElem.textContent);
        return;
    }

    const clampedRatio = Math.min(ratio, config.maxRatio);

    const applyBackground = function(bg)
    {
        ratioElem.style.setProperty("--ddr-bg", bg, "important");
        ratioElem.classList.add("ddr-bg");
        const parentTd = ratioElem.closest("td");
        if (parentTd)
        {
            parentTd.style.setProperty("--ddr-bg", bg, "important");
            parentTd.classList.add("ddr-bg");
        }
    };

    if (clampedRatio < 0.5)
    {
        applyBackground(InterpolateColorWithEffect("#ff0000", "#ff8000", MapRange(clampedRatio, 0.0, 0.5)));
    }
    else if (clampedRatio < 1.0)
    {
        applyBackground(InterpolateColorWithEffect("#ff8000", "#e0ff00", MapRange(clampedRatio, 0.5, 1.0)));
    }
    else if (clampedRatio < 5.0)
    {
        applyBackground(InterpolateColorWithEffect("#00ff00", "#00e0e0", MapRange(clampedRatio, 1.0, 5.0)));
    }
    else
    {
        // For ratios above 5.0 up to maxRatio, interpolate to the max color; above maxRatio, stays at the max color
        applyBackground(InterpolateColorWithEffect("#00e0e0", "#8040ff", MapRange(clampedRatio, 5.0, config.maxRatio)));
    }
}

const colorTrackingObservers = new WeakMap();
const colorTrackingObservedElems = new Set();

function AddColorTracking(ratioElem)
{
    // If an observer already exists for this element, replace it to avoid duplicates
    const existing = colorTrackingObservers.get(ratioElem);
    if (existing)
    {
        existing.disconnect();
        colorTrackingObservers.delete(ratioElem);
    }

    const updateCallback = function()
    {
        SetColorOnRatioElem(ratioElem);
    };

    const observer = new MutationObserver(updateCallback);
    const config = { characterData: true, childList: true, subtree: true };

    observer.observe(ratioElem, config);

    colorTrackingObservers.set(ratioElem, observer);
    colorTrackingObservedElems.add(ratioElem);
}

function RemoveColorTracking(ratioElem)
{
    // Look up the observer for the given ratio element.
    const observer = colorTrackingObservers.get(ratioElem);
    if (observer)
    {
        observer.disconnect();
        colorTrackingObservers.delete(ratioElem);
        colorTrackingObservedElems.delete(ratioElem);
    }
}

let foundParentElement = false;
let ranDetectOnFirstFind = false;

function FoundParentElement(parentElem)
{
    if (foundParentElement)
    {
        TriggerError("Parent element was already found, but FoundParentElement was called multiple times!");
        return;
    }

    foundParentElement = true;

    TriggerLog("Found parent element, starting setting color per ratio element!");

    const findRatioElement = function(elem, callback)
    {
        if (!ranDetectOnFirstFind)
        {
            DetectRatioSelector();
            ranDetectOnFirstFind = true;
        }
        const ratioElem = elem.matches(ratioElemIdentifier) ? elem : elem.querySelector(ratioElemIdentifier);
        if (ratioElem)
        {
            callback(ratioElem);
        }
    };

    const updateCallback = function(mutationsList, observer)
    {
        for (const mutation of mutationsList)
        {
            mutation.addedNodes.forEach(addedElem =>
            {
                if (addedElem.nodeType !== Node.ELEMENT_NODE)
                {
                    return;
                }

                findRatioElement(addedElem, ratioElem =>
                {
                    SetColorOnRatioElem(ratioElem);
                    AddColorTracking(ratioElem);
                });
            });

            mutation.removedNodes.forEach(removedElem =>
            {
                if (removedElem.nodeType !== Node.ELEMENT_NODE)
                {
                    return;
                }

                findRatioElement(removedElem, ratioElem =>
                {
                    RemoveColorTracking(ratioElem);
                });
            });
        }
    };

    const observer = new MutationObserver(updateCallback);
    const config = { childList: true };
    observer.observe(parentElem, config);

    const ratioElems = parentElem.querySelectorAll(ratioElemIdentifier);
    if (ratioElems)
    {
        ratioElems.forEach(function(elem)
        {
            SetColorOnRatioElem(elem);
            AddColorTracking(elem);
        });
    }
}

function WaitForParentElement()
{
    TriggerLog("Parent element doesn't exist yet, wait for it to be created");

    const parentContainerElem = document.querySelector(parentContainerElemIdentifier);

    if (!parentContainerElem)
    {
        TriggerError("Couldn't find container for parent element, something is very wrong!");
        return;
    }

    const updateCallback = function(mutationsList, observer)
    {
        for (let mutation of mutationsList)
        {
            if (foundParentElement)
            {
                observer.disconnect();
                return;
            }

            mutation.addedNodes.forEach(function(addedElem)
            {
                if (!foundParentElement && addedElem.nodeType === 1)
                {
                    var ratioParentElem = addedElem.querySelector(ratioParentElemIdentifier);
                    if (ratioParentElem)
                    {
                        FoundParentElement(ratioParentElem);
                        return;
                    }
                }
            });
        }
    };

    const observer = new MutationObserver(updateCallback);
    const config = { childList: true, subtree: true };
    observer.observe(parentContainerElem, config);
}

function FindParentElement()
{
    const findParentRatioElemStr = parentContainerElemIdentifier + " " + ratioParentElemIdentifier;

    const parentElem = document.querySelectorAll(findParentRatioElemStr);

    if (!parentElem || parentElem.length == 0)
    {
        WaitForParentElement();
        return;
    }

    if (parentElem.length > 1)
    {
        TriggerError("Couldn't find parent element in a safe way, taking a guess");
    }

    FoundParentElement(parentElem[0]);
}


function EnsureStyleInjected()
{
    const styleId = "ddr-style";
    if (document.getElementById(styleId))
    {
        return;
    }
    const style = document.createElement("style");
    style.id = styleId;
    style.textContent = 
        ".ddr-bg{background-color:var(--ddr-bg) !important;color:#000 !important;}" +
        "td.ddr-bg{background:var(--ddr-bg) !important;}";
    document.head.appendChild(style);
}

function DetectRatioSelector()
{
    try
    {
        const tbody = document.querySelector(parentContainerElemIdentifier + " " + ratioParentElemIdentifier);
        if (!tbody)
        {
            TriggerLog("DetectRatioSelector: tbody not found yet");
            return;
        }
        const table = tbody.closest("table");
        if (!table)
        {
            TriggerLog("DetectRatioSelector: table not found from tbody");
            return;
        }
        const headerRow = table.querySelector("thead tr");
        if (!headerRow)
        {
            TriggerLog("DetectRatioSelector: thead/tr not found");
            return;
        }
        const headerCells = headerRow.querySelectorAll("td, th");
        if (!headerCells || headerCells.length === 0)
        {
            TriggerLog("DetectRatioSelector: no header cells in thead");
            return;
        }

        let ratioIndex = -1;
        for (let i = 0; i < headerCells.length; i++)
        {
            const cell = headerCells[i];
            const span = cell.querySelector('span');
            const text = ((span && span.textContent) ? span.textContent : (cell.textContent || "")).trim().toLowerCase();
            if (text === "ratio")
            {
                ratioIndex = i;
                break;
            }
        }
        if (ratioIndex === -1)
        {
            TriggerLog("DetectRatioSelector: 'Ratio' header not found; keeping defaults");
            return;
        }

        // Build selector for the corresponding body column's inner <div>
        ratioElemIdentifier = parentContainerElemIdentifier + " " + ratioParentElemIdentifier + " tr > td:nth-child(" + (ratioIndex + 1) + ") > div";
        TriggerLog("Auto-detected ratio selector: " + ratioElemIdentifier);
    }
    catch (e)
    {
        TriggerLog("Failed to auto-detect ratio selector: " + e.message);
    }
}

(function() {
    'use strict';

    try
    {
        // Do not trigger in iframes
        const inIframe = window.top != window.self;
        if (inIframe)
        {
            return;
        }

        EnsureStyleInjected();

        FindParentElement();
    }
    catch (e)
    {
        TriggerError("Unhandled initialization error: " + (e && e.message ? e.message : e));
    }
})();
