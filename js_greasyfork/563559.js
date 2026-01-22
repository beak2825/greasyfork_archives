// ==UserScript==
// @name         Jhudora Avatar Failsafe
// @namespace    https://github.com/saahphire/NeopetsUserscripts
// @version      1.0.0
// @description  Hides your 26th Jhudora quest under an accordion so you're less likely to complete it
// @author       saahphire
// @homepageURL  https://github.com/saahphire/NeopetsUserscripts
// @homepage     https://github.com/saahphire/NeopetsUserscripts
// @match        *://*.neopets.com/faerieland/darkfaerie.phtml*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=www.neopets.com
// @license      Unlicense
// @grant        GM.setValue
// @grant        GM.getValue
// @grant        GM.deleteValue
// @downloadURL https://update.greasyfork.org/scripts/563559/Jhudora%20Avatar%20Failsafe.user.js
// @updateURL https://update.greasyfork.org/scripts/563559/Jhudora%20Avatar%20Failsafe.meta.js
// ==/UserScript==

(async function() {
    'use strict';
    if(document.getElementsByClassName('level-item')[1]?.textContent === '25')
        GM.setValue('isAvvie', true);
    else if(document.getElementsByClassName('level-item')[1]) GM.deleteValue('isAvvie');
    if(await GM.getValue('isAvvie', false)) {
        const container = document.getElementsByClassName('container')[0];
        container.style.backgroundImage = 'linear-gradient(45deg, hsl(269deg 51% 57%) 0%, hsl(272deg 41% 58%) 19%, hsl(277deg 30% 59%) 31%, hsl(286deg 19% 59%) 38%, hsl(317deg 10% 61%) 44%, hsl(35deg 10% 62%) 49%, hsl(67deg 18% 61%) 53%, hsl(77deg 31% 61%) 57%, hsl(81deg 45% 61%) 61%, hsl(84deg 59% 61%) 66%, hsl(86deg 73% 60%) 72%, hsl(86deg 87% 58%) 81%, hsl(84deg 100% 50%) 100% )';
        if(document.getElementById('ex-text')) {
            let nextChild = container.children[0];
            let count = 0;
            while (nextChild && !nextChild.classList.contains('level-container')) {
                if(!['LINK', 'SCRIPT'].includes(nextChild.tagName)) nextChild.remove();
                else count++;
                nextChild = container.children[count];
            }
            nextChild.insertAdjacentHTML('beforebegin', '<h2 style="margin-top: 100px;background-color: red;color: white">Fail this quest to get the avatar!</h2>');
        }
        else if(document.getElementsByClassName('faerie-img')[0]) {
            const details = document.createElement('details');
            const summary = document.createElement('summary');
            details.appendChild(summary);
            [...container.children].forEach(child => details.appendChild(child));
            summary.insertAdjacentHTML('afterbegin', '<h2>Fail this quest to get the avatar, or click this to continue!');
            container.appendChild(details);
        }
    }
})();
