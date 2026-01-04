// ==UserScript==
// @name         Neopets - Karla's Double or Nothing Autoplayer
// @namespace    karla@neopointskarla
// @license      GPL3
// @version      0.0.1
// @description  Automatically plays double or nothing
// @author       Karla
// @match        *://*.neopets.com/medieval/doubleornothing.phtml*
// @icon         https://github.com/karlaneo/neopets-scripts/blob/main/favicon-32x32.png?raw=true
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/547805/Neopets%20-%20Karla%27s%20Double%20or%20Nothing%20Autoplayer.user.js
// @updateURL https://update.greasyfork.org/scripts/547805/Neopets%20-%20Karla%27s%20Double%20or%20Nothing%20Autoplayer.meta.js
// ==/UserScript==

let playing = GM_getValue('playing_don') || false;
let target = GM_getValue('target_don') || '10';
console.log(target);
let timeout;

const random_in_range = (start, end) => {
    return Math.floor(Math.random() * (end - start + 1) + start);
};

function loop() {
    timeout = setTimeout(function() {
        if (document.querySelector('[href^="process_doubleornothing.phtml"]')) {
            const anchors = document.querySelectorAll('[href^="process_doubleornothing.phtml"]');
            anchors[random_in_range(0, anchors.length - 1)].click();
        } else if (document.querySelector('[value^="Collect Your Winnings"]')) {
            const currentScore = document.querySelector('[value^="Collect Your Winnings"]').value.replace(/[^0-9]+/g, '');
            if (Number(currentScore) >= Number(target)) {
                document.querySelector('[value^="Collect Your Winnings"]').click();
            } else {
                document.querySelector('[value="Continue"]').click();
            }
        } else if (document.querySelector('[value="Try again..."]')) {
            document.querySelector('[value="Try again..."]').click();
        }

    }, random_in_range(1200, 1800));
}

(function() {
    'use strict';

    // Your code here...
    try {
        const anchor = document.querySelector('center')
        || Array.from(document.querySelectorAll('b')).find((n) => n.textContent === 'Uh oh...');

        const section = document.createElement('div');
        section.style.textAlign = 'center';
        section.style.margin = '10px';
        section.innerHTML = `
        <div style="margin-bottom: 10px">-- Double or Nothing Autoplayer --</div>
        <label>Stop at score <select>
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="80">80</option>
          <option value="160">160</option>
          <option value="320">320</option>
          <option value="640">640</option>
          <option value="1280">1280</option>
          <option value="2560">2560</option>
          <option value="5120">5120</option>
          <option value="10240">10240 (staff review)</option>
          <option value="20480">20480 (staff review)</option>
          <option value="40960">40960 (staff review)</option>
          <option value="81920">81920 (staff review)</option>
          <option value="163840">163840 (staff review)</option>
        </select>
        </label>
        <button>${playing ? 'Stop' : 'Start'}</button>
        `;
        anchor.after(section);
        section.querySelector('button').addEventListener('click', function(event) {
            playing = !playing;
            section.querySelector('select').disabled = playing;
            event.target.innerHTML = playing ? 'Stop' : 'Start';
            if (!playing) {
                clearTimeout(timeout);
            } else {
                loop();
            }
            GM_setValue('playing_don', playing);
        });
        section.querySelector('select').value = target;
        section.querySelector('select').addEventListener('change', function(event) {
            target = event.target.value;
            GM_setValue('target_don', target);
        });
        section.querySelector('select').disabled = playing;
        if (playing) {
            loop();
        }
    } catch (e) {
        console.log(e);
    }
})();