// ==UserScript==
// @name           the_button_helper
// @namespace      de.moep.private.reddit
// @author         moep (selucram/marcules)
// @description    Colourise THE BUTTON with the flair you'd get when pressing it right this instance. Also makes it possible to check for your desired colour and press the button when it's (probably) hit.
// @version        0.0.2
// @match          http://*.reddit.com/r/thebutton/*
// @match          https://*.reddit.com/r/thebutton/*
// @run-at         document-end
// @grant          none
// @icon           data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3wQMDjsB0cHvhgAAAB1pVFh0Q29tbWVudAAAAAAAQ3JlYXRlZCB3aXRoIEdJTVBkLmUHAAAA4ElEQVQ4y62VsQ3CQAxF3x0LINFRwQZIFGmTAZgBFgAxQWTRQE0WgBlSUCYLpMgEpMocNAYBIhASv+4s3ZNPsv85GtghS2ABzIGxlmugANIYOX+65xpEAkz4TgXIu9i9yY7Amv9IYmRzPwx6ygCCiHCUkV8eQn3mnu4EEWGVkZdeC0J/BMBpdydsWHkdDSsWXufMirl/GloLxh5jvK6TFbXX3bSi8EBqKEydbsq1RRj8ooqRqfmmDAAy8jIiHAFBR1kSI4eXtMnILx2ln+PrSVoBM2DYImC3984aE7vvF3ADLmo/PKTWbAUAAAAASUVORK5CYII=
// @downloadURL https://update.greasyfork.org/scripts/9164/the_button_helper.user.js
// @updateURL https://update.greasyfork.org/scripts/9164/the_button_helper.meta.js
// ==/UserScript==

function tbh() {
    if (typeof(r) === "undefined")
        return;

    // colours
    // never click automatically === null
    // purple      === 6
    // blue        === 5
    // green       === 4
    // yellow      === 3
    // orange      === 2
    // red         === 1
    var wantedFlairColour = null;

    var flairColourMapping = {};
    var clicked = false;
    var buttonButton = null;
    var buttonTimer = null;
    var buttonPressed = false;

    buttonButton = document.getElementById('thebutton');
    buttonTimer = document.getElementById('thebutton-timer');

    if (buttonButton) {
        buttonPressed = buttonButton.parentNode.classList.contains('pressed');
    }

    flairColourMapping.colourNotPressed = getColourFor('flair-no-press');
    flairColourMapping['6'] = getColourFor('flair-press-6');
    flairColourMapping['5'] = getColourFor('flair-press-5');
    flairColourMapping['4'] = getColourFor('flair-press-4');
    flairColourMapping['3'] = getColourFor('flair-press-3');
    flairColourMapping['2'] = getColourFor('flair-press-2');
    flairColourMapping['1'] = getColourFor('flair-press-1');

    r.thebutton._origDraw = r.thebutton._drawPie;
    r.thebutton._drawPie = function(e, t) {
        var currentColour = flairColourMapping.colourNotPressed;
        if (e) {
            var currentSecond = Math.ceil(e / 10000);
            if (currentSecond) {
                currentColour = flairColourMapping[("" + currentSecond)];
            }

            if (currentSecond === wantedFlairColour && clicked === false) {
                buttonButton.click();
                clicked = true;
            }
        }

        var n = t - e,
            r = google.visualization.arrayToDataTable([
                ["", ""],
                ["gone", n],
                ["remaining", e]
            ]),
            i = {
                chartArea: {
                    top: 0,
                    left: 0,
                    width: 70,
                    height: 70
                },
                pieSliceBorderColor: "transparent",
                legend: "none",
                pieSliceText: "none",
                slices: {
                    0: {
                        color: "#C8C8C8"
                    },
                    1: {
                        color: currentColour
                    }
                },
                enableInteractivity: !1
            };

        buttonButton.style.backgroundColor = buttonPressed ? 'transparent' : currentColour;
        buttonButton.style.border = buttonPressed ? buttonButton.style.border : "1px solid " + currentColour;
        buttonButton.style.boxShadow = buttonPressed ? buttonButton.style.boxShadow : "0px 4px 0px 0px " + currentColour + ",0px 0px 0px 0px rgba(255,255,255,0.6),0px 6px 4px 0px rgba(0,0,0,0.3),inset 0px 1px 0px 0px rgba(255,255,255,0.2)";

        buttonTimer.style.color = currentColour;
        this._chart.draw(r, i);
    };
}

if (document.body) {
    if (typeof(r) === "undefined") {
        var script = document.createElement('script');
        script.type = "text/javascript";
        script.appendChild(document.createTextNode('(' + tbh + ')();'));
        document.body.appendChild(script);
    }
    else // Operate normally.
        tbh();
}

function getColourFor(className) {
    var pseudoElement = document.createElement('div');
    pseudoElement.className = className;
    
    document.body.appendChild(pseudoElement);
    var color = window.getComputedStyle(pseudoElement, null).getPropertyValue('background-color');
    document.body.removeChild(pseudoElement);
    
    return color;
}
