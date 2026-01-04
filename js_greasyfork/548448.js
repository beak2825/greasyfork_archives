// ==UserScript==
// @name         Popcat.click bot
// @namespace    https://popcat.click/
// @version      1.0
// @description  ban proof popcat.click bot but in userscript (not mine im just putting it up since I didnt see one)
// @author       wberdowski
// @homepageURL  https://gist.github.com/wberdowski/9ccd275394a7ccf21ba602a3c736f5d9
// @match        https://popcat.click/*
// @grant        none
// @license      none
// @downloadURL https://update.greasyfork.org/scripts/548448/Popcatclick%20bot.user.js
// @updateURL https://update.greasyfork.org/scripts/548448/Popcatclick%20bot.meta.js
// ==/UserScript==

/*  
  1) Open https://popcat.click  
  2) Open console (F12 or CTRL+SHIFT+I)  
  3) Insert code & run  
  4) Monitor bot progress in the console  

  Note: popcat.click server registers only 800 pops every 30 seconds per IP address 
  (that's why this bot is slow and running it in multiple tabs won't work).  

  If you send 800 or more clicks 10 times in a row, you'll get banned for 12 hours 
  ("ban" cookie is set). This bot addresses this issue and will NOT get you banned.  

  POLSKA GUROM!  
*/

(() => {
    console.clear();
    var event = new KeyboardEvent('keydown', {
        key: 'g',
        ctrlKey: true
    });

    // Start sendStats interval
    document.dispatchEvent(event);

    // Total pops
    var total = 0;

    var iv = setInterval(() => {
        // Get VUE
        var vue = document.getElementById('app').__vue__;

        // Check if user is marked as bot (just for safety measures, very unlikely to happen)
        if (vue.bot) {
            console.log("%c You've been barked as a bot. Please clear your cookies.", "background: #a00; color: #fff");
            clearInterval(iv);
            return;
        }

        // Prevent ban
        vue.sequential_max_pops = 0;

        // Detect sendStats function run
        if (vue.accumulator == 0) {
            total += 800;
            console.log(
                `[${new Date().toLocaleTimeString()}] %c800 pops sent (Total: ${total})`,
                "color: #0f0"
            );

            // Open and close cat's mouth
            vue.open = true;
            setTimeout(() => {
                vue.open = false;
            }, 1000);
        }

        // Set 800 pops
        vue.accumulator = 800;
    }, 1000);

    console.log("%c Bot started. Waiting for the first request being sent. ", "background: #050; color: #0f0");
})();