// ==UserScript==
// @name         Retry Last Roulette Bet
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  Skip the roulette animation by retrying the most recent bet without spinning the wheel
// @author       Kabamgamer (Modified by Flex)
// @license      MIT
// @match        https://www.torn.com/page.php?sid=roulette
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/562302/Retry%20Last%20Roulette%20Bet.user.js
// @updateURL https://update.greasyfork.org/scripts/562302/Retry%20Last%20Roulette%20Bet.meta.js
// ==/UserScript==

(function($) {
    'use strict';

    function displayInfo(msg, color) {
        $('#infoSpotText').html(msg);
        $('#infoSpot').removeClass('red green');
        if (color) {
            $('#infoSpot').addClass(color);
        }
    };

    function onRouletteTableFinished(callback) {
        const $chips = $('#chips div.chipCont');

        // Chips are added last, so if these exist, all elements exist and the table is finished drawing
        if ($chips.length === 7) {
            return callback()
        }

        setTimeout(() => onRouletteTableFinished(...arguments), 300)
    }

    function onSuccessResponse(response) {
        const title = response.won ? `You won \$${response.won}!` : 'You lost...'
        const message = ' The ball landed on ' + response.number
        displayInfo(title + message, response.won ? 'green' : 'red')

        if (response.tokens < 1) {
            $('#kabamRetry').attr('disabled', true).off('click')
        }

        // Updating the money and token values
        $('#st_money_val').html('$' + Number(response.totalAmount));
        $('#st_tokens_val').html(response.tokens);
    }

    window.addEventListener('load', function() {
        const rouletteCanvas = document.getElementById('rouletteCanvas');
        const tornGetAction = window.getAction;
        const customRetryButton = '<button id="kabamRetry" disabled>Retry with last bet</button>';

        $('body').append(styles);

        onRouletteTableFinished(() => {
            $('#rouletteContainer').before(customRetryButton)
        })

        if (rouletteCanvas) {
            rouletteCanvas.addEventListener('mousedown', function(event) {
                window.getAction = function(options) {
                    if (options.data?.sid !== 'rouletteData' || options.data?.step !== 'processStakes') {
                        return tornGetAction(...arguments);
                    }

                    const optionsClone = jQuery.extend({}, options);
                    optionsClone.success = onSuccessResponse;

                    $('#kabamRetry').removeAttr('disabled').on('click', () => tornGetAction(optionsClone));

                    return tornGetAction(...arguments);
                }
            }, true);
        }
    }, false);
})(jQuery);

const styles = `
<style>
#kabamRetry {
    background: linear-gradient(45deg, #4caf50, #388e3c);
    border: none;
    border-radius: 5px;
    color: #fff;
    cursor: pointer;
    display: inline-block;
    font-size: 16px;
    font-weight: bold;
    padding: 10px 20px;
    text-align: center;
    text-decoration: none;
    transition: background 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
}
#kabamRetry[disabled] {
    opacity: .6;
}
</style>
`