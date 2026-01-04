// ==UserScript==
// @name        GeoGebra iPadOS Text Fix
// @description Fix issues while editing object names or while adding custom text on GeoGebra. Intended for iPadOS and/or iOS. It should have no effect on desktop devices.
// @match       *://*.geogebra.org/*
// @author      dinoosauro
// @license     mit
// @version     1.0.1
// @namespace   https://github.com/dinoosauro/geogebra-ipados-text-fix
// @downloadURL https://update.greasyfork.org/scripts/552823/GeoGebra%20iPadOS%20Text%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/552823/GeoGebra%20iPadOS%20Text%20Fix.meta.js
// ==/UserScript==

(() => {
    /**
     * A WeakSet that contains all the textboxes where we have already added the custom event.
     * WeakSet is used so that HTML elements can be garbage collected after they've been removed from the DOM.
     */
    const addedItems = new WeakSet();
    
    new MutationObserver(() => {
        // First fix: small, one-line textboxes
        for (const item of document.querySelectorAll(".textField input")) {
            // On mobile devices, but not on desktop devices, GeoGebra adds a custom overlay to the textbox, so that we can have a pointer to the text. If this overlay exists, we'll apply the changes
            const overlay = item.parentElement.querySelector(".cursorOverlay");
            if (overlay && !addedItems.has(item)) {
                addedItems.add(item); // Avoid adding multiple times the same event
                item.style.opacity = "0"; // We'll make the textbox invisible, since all the charaters are copied in the overlay (and we'll need to use that to have a pointer that works; otherwise it'll be glitchy). This fixes the display issue where the text is displayed two times.
                for (const key of ["mouseup", "touchend"]) item.addEventListener(key, () => { 
                    // We'll now fix the bug where the pointer doesn't move when the user clicks inside the textbox. This appears to be only a glitch, since GeoGebra records that the pointer has changed. Therefore, we can just fix it by emulating the keypress of the left arrow, and then of the right arrow (so that we'll still be in the same position).
                    for (const eventArgs of [["ArrowLeft", 37], ["ArrowRight", 39]]) item.dispatchEvent(new KeyboardEvent("keydown", {
                        key: eventArgs[0],
                        code: eventArgs[0],
                        keyCode: eventArgs[1]
                    }));
                })
            }
        }
        // Second fix: multi-line textboxes (for example, the ones used in the "Text" tool).
        for (const item of document.querySelectorAll(".textEditor")) item.setAttribute("contenteditable", "true"); // Setting the textbox div to be contenteditable is enough to make it work.
    }).observe(document.body, {childList: true, subtree: true});

    // Third fix: edit the stylesheet to avoid putting inline text to multiple lines
    const customStyle = document.createElement("style");
    customStyle.textContent = `.cursorOverlay > .gwt-InlineLabel {
        text-wrap: nowrap
    }`;
    document.head.append(customStyle);
})()