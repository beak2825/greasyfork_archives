// ==UserScript==
// @name         Auto Clicker by GSRHackZ (fixed version)
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  Auto Clicker for browsers. Press Q to toggle ON/OFF. Supports up to 100,000 clicks per second.
// @author       GSRHackZ (modified by thehackerclient)
// @match        *://*/*
// @icon         https://image.flaticon.com/icons/svg/99/99188.svg
// @license      MIT
// @compatible   chrome
// @compatible   firefox
// @compatible   opera
// @compatible   safari
// @downloadURL https://update.greasyfork.org/scripts/550656/Auto%20Clicker%20by%20GSRHackZ%20%28fixed%20version%29.user.js
// @updateURL https://update.greasyfork.org/scripts/550656/Auto%20Clicker%20by%20GSRHackZ%20%28fixed%20version%29.meta.js
// ==/UserScript==

let x, y, set, cps = 10;

document.addEventListener('keyup', function(evt) {
    if (evt.keyCode == 81) { // Q key
        if (!set == true) {
            set = true;
            let inp = prompt("How many clicks per second? Max recommended: 100,000 CPS");
            if (!isNaN(inp) && inp.trim().length > 0) {
                if (inp > 100000) {
                    let check = confirm(`${inp} CPS may crash your browser! Are you sure?`)
                    if (check) {
                        cps = inp;
                    } else {
                        set = false;
                        alert("Press Q again to retry.");
                    }
                } else if (inp < 1000) {
                    cps = 1000;
                } else {
                    cps = inp;
                }
            }
            alert("Click anywhere in this tab to set the autoclick point. Press Q to stop.");
            onmousedown = function(e) {
                x = e.clientX;
                y = e.clientY;
            };
            let autoClick = setInterval(function() {
                if (x !== undefined && y !== undefined && set == true) {
                    for (let i = 0; i < cps / 1000; i++) {
                        click(x, y);
                    }
                }
            }, 1);
        } else {
            set = false;
        }
    }
});

function click(x, y) {
    let ev = new MouseEvent('click', {
        'view': window,
        'bubbles': true,
        'cancelable': true,
        'screenX': x,
        'screenY': y
    });
    let el = document.elementFromPoint(x, y);
    el.dispatchEvent(ev);
}
