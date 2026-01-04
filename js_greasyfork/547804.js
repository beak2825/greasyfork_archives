// ==UserScript==
// @name         Neopets - Karla's Gormball Autoplayer
// @namespace    karla@neopointskarla
// @license      GPL3
// @version      0.0.1
// @description  Automatically plays Gormball
// @author       Karla
// @match        *://*.neopets.com/space/gormball.phtml*
// @match        *://*.neopets.com/space/gormball2.phtml*
// @icon         https://github.com/karlaneo/neopets-scripts/blob/main/favicon-32x32.png?raw=true
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/547804/Neopets%20-%20Karla%27s%20Gormball%20Autoplayer.user.js
// @updateURL https://update.greasyfork.org/scripts/547804/Neopets%20-%20Karla%27s%20Gormball%20Autoplayer.meta.js
// ==/UserScript==

let playing = GM_getValue('playing_gormball') || false;
let timeout;

const sleep = (time) => new Promise((resolve) => setTimeout(resolve, time));
const random_in_range = (start, end) => {
    return Math.floor(Math.random() * (end - start + 1) + start);
};

function loop() {
    timeout = setTimeout(async function() {
        console.log(document.querySelector('#playerDD'))
        if (document.querySelector('#playerDD')) {
            await sleep(random_in_range(600, 900));
            document.querySelector('#playerDD').selectedIndex = random_in_range(1, document.querySelectorAll('#playerDD option').length - 1);
            await sleep(random_in_range(600, 900));
            document.querySelector('[value="Plaaay Ball!"]').click();
        } else if (document.querySelector('[value="Next >>>"]')) {
            await sleep(random_in_range(600, 900));
            document.querySelector('[value="Next >>>"]').click();
        } else if (document.querySelector('[name="turns_waited"]')) {
            await sleep(random_in_range(600, 900));
            document.querySelector('[name="turns_waited"]').selectedIndex = 1;
            await sleep(random_in_range(600, 900));
            document.querySelector('[value="Throw!"]').click();
        } else if (document.querySelector('[value="Continue!"]')) {
            document.querySelector('[value="Continue!"]').click();
        } else if (document.querySelector('[value="Play Again"]')) {
            document.querySelector('[value="Play Again"]').click();
        }

    }, random_in_range(1200, 1800));
}

(function() {
    'use strict';

    // Your code here...
    try {
        const anchor = document.querySelector('#content .content b');

        const section = document.createElement('div');
        section.style.textAlign = 'center';
        section.style.margin = '10px';
        section.innerHTML = `
        <div style="margin-bottom: 10px">-- Gormball Autoplayer --</div>
        <button>${playing ? 'Stop' : 'Start'}</button>
        `;
        anchor.after(section);
        section.querySelector('button').addEventListener('click', function(event) {
            playing = !playing;
            event.target.innerHTML = playing ? 'Stop' : 'Start';
            if (!playing) {
                clearTimeout(timeout);
            } else {
                loop();
            }
            GM_setValue('playing_gormball', playing);
        });
        if (playing) {
            loop();
        }
    } catch (e) {
        console.log(e);
    }
})();