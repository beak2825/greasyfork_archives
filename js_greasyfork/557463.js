// ==UserScript==
// @name         Display ergo on hover
// @namespace    https://eastarcti.ca/
// @version      2025-11-30
// @description  Displays the standard ergonomics on hover in the add motorcycle section. Uses defaults for motorcycle specific options.
// @author       East_Arctica
// @match        https://cycle-ergo.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cycle-ergo.com
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/557463/Display%20ergo%20on%20hover.user.js
// @updateURL https://update.greasyfork.org/scripts/557463/Display%20ergo%20on%20hover.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const infoContainer = document.createElement('div')
    infoContainer.style.position = 'absolute';
    infoContainer.style.float = 'right';
    infoContainer.style.top = '150px';
    infoContainer.style.right = '50px';
    infoContainer.style.zIndex = '999';
    infoContainer.style.display = 'none';
    infoContainer.id = 'info-container';

    const img = document.createElement('img');
    infoContainer.appendChild(img);

    document.body.appendChild(infoContainer);

    let all = {};
    for (const item of Object.values(window.Makes).map(elem => elem.Models)) {
        for (const id in item) {
            all[id] = item[id];
        }
    }

    function GetImageURL_user(Model, GripRise, GripPullback, SeatRise, PegHOffset, PegVOffset) {
        var URL = "0"; // version

        if( GetWindowWidth() < 1200 || GetWindowHeight() < 900 )
            URL += "4"; // pixels per inch
        else
            URL += "6"; // pixels per inch

        if( window.CenterOnSeat )
            URL += "s"; // center on seat
        else
            URL += "w"; // center on wheel

        var Scale = 1.0;

        if( window.UseMetric )
        {
            URL += "m";
            Scale /= 2.54;
        }
        else
        {
            URL += "i";
        }

        URL += UIntToStr( Model, 4 );
        URL += UInt2ToB62( parseInt((16*window.RiderHeight) * Scale) );
        URL += UInt2ToB62( parseInt(3844*window.RiderInseam) );
        URL += UIntToB62( parseInt(20*window.ArmStraightness) );
        URL += Int2ToB62( parseInt((6*GripRise) * Scale) );
        URL += Int2ToB62( parseInt((6*GripPullback) * Scale) );
        URL += Int2ToB62( parseInt((6*SeatRise) * Scale) );
        URL += Int2ToB62( parseInt((6*PegHOffset) * Scale) );
        URL += Int2ToB62( parseInt((6*PegVOffset) * Scale) );
        URL += window.SeatPlace;

        if (window.ShowPassenger)
        {
            URL += "p";
            URL += UInt2ToB62( parseInt((16*window.PassengerHeight) * Scale) );
            URL += UInt2ToB62( parseInt(3844*window.PassengerInseam) );
        }
        else
            URL += "n";

        if( window.IsStopped )
        {
            window.Compression = 0.75;
            URL += UIntToB62( parseInt((6*window.Compression) * Scale) );
            return "Stopped/" + URL + ".png";
        }
        else
            return "Riding/" + URL + ".png";
    }

    let hoverTimeout;
    function handleMouseEnter(event) {
        const target = event.target;
        if (hoverTimeout) clearTimeout(hoverTimeout);

        hoverTimeout = setTimeout(() => {
            const container = document.querySelector('#info-container');
            const img = container.querySelector('img');
            // onmouseover="OnOverModelListEntry(1127,1)"
            const id = event.target.onmouseover.toString().match(/OnOverModelListEntry\(([0-9]+),.*/)[1];
            img.src = GetImageURL_user(id, 0, 0, 0, 0, 0); //`https://cycle-ergo.com/Riding/06wi0131JcV0DUyUyUyUyUy0n.png`;
            container.style.display = 'block';
        }, 50);
    }

    function handleMouseLeave(event) {
        if (hoverTimeout) clearTimeout(hoverTimeout);

        const container = document.querySelector('#info-container');
        const img = container.querySelector('img');
        img.src = '';
        container.style.display = 'block';
    }

    const observerCallback = (mutationsList) => {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList') {
                // Loop through all added nodes
                mutation.addedNodes.forEach((node) => {
                    // We only care about Elements (not text nodes), usually type 1
                    if (node.nodeType === 1) {

                        // CASE A: The added node IS the list item
                        if (node.classList.contains('ModelListItem')) {
                            attachListeners(node);
                        }

                        // CASE B: The list item is nested INSIDE the added node
                        // (e.g., you appended a <ul> containing the list item)
                        if (node.querySelectorAll) {
                            const nestedItems = node.querySelectorAll('.ModelListItem');
                            nestedItems.forEach(attachListeners);
                        }
                    }
                });
            }
        }
    };

    function attachListeners(element) {
        if (element.dataset.hasHoverListener) return;

        element.addEventListener('mouseenter', handleMouseEnter);
        element.addEventListener('mouseleave', handleMouseLeave);
        element.dataset.hasHoverListener = 'true';
    }

    const observer = new MutationObserver(observerCallback);
    observer.observe(document.body, { childList: true, subtree: true });
})();