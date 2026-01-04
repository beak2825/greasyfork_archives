// ==UserScript==
// @name         Torn: Gimme Gas
// @namespace    lugburz.gimme_gass
// @version      0.1.4
// @description  Not farts
// @author       Lugburz
// @match        https://www.torn.com/shops.php?step=bitsnbobs*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/551166/Torn%3A%20Gimme%20Gas.user.js
// @updateURL https://update.greasyfork.org/scripts/551166/Torn%3A%20Gimme%20Gas.meta.js
// ==/UserScript==

function addButton() {
    if ($('div.content-title > h4').size() > 0 && $('#buygasBtn').size() < 1) {
        const button = `<button id="buygasBtn" style="color: var(--default-blue-color); cursor: pointer; margin-right: 0;">Gimme gas!</button>
                        <span id="buygasResult" style="font-size: 12px; font-weight: 100;"></span>`;
        $('div.content-title > h4').append(button);
        $('#buygasBtn').on('click', async () => {
            $('#buygasResult').text('');
            await getAction({
                type: 'post',
                action: 'shops.php',
                data: {
                    step: 'buyShopItem',
                    ID: 172,
                    amount: 100,
                    shoparea: 103
                },
                success: (str) => {
                    try {
                        const msg = JSON.parse(str);
                        $('#buygasResult').html(msg.text).css('color', msg.success ? 'green' : 'red');
                    } catch (e) {
                        console.log(e);
                    }
                }
            });
        });
    }
};

(function() {
    'use strict';

    // Your code here...
    addButton();
})();
