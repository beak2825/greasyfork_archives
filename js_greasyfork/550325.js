// ==UserScript==
// @name         Torn Race Creating
// @version      1.0
// @description  Autofills the race form and moves the start button for easier custom race creation.
// @author       K1rbs
// @match        *www.torn.com/loader.php?sid=racing*
// @grant        GM_addStyle
// @namespace    https://greasyfork.org/de/users/1517997
// @downloadURL https://update.greasyfork.org/scripts/550325/Torn%20Race%20Creating.user.js
// @updateURL https://update.greasyfork.org/scripts/550325/Torn%20Race%20Creating.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // === CONFIGURATION ===
    const numberOfLaps = "1"; // Change this value to set the number of laps.
    const maxDrivers = "2"; // Change this value to set the number of maximum drivers.
    const trackName = "Speedway"; // Change to the desired track name.
    const raceName = "1 Lap Speedway"; // Change to the desired race name.
    // =====================

    GM_addStyle(`
        /* Hide the original separator line from the button's old position */
        .cont-black > form > .sep {
            display: none !important;
        }

        /* Adjust the title bar to act as a container for the button */
        .title-black.top-round {
            padding: 2px 8px !important;
            display: flex !important;
            justify-content: flex-start !important;
            align-items: center !important;
            height: 40px;
        }
    `);

    $('body').ajaxComplete(function(e, xhr, settings) {
        if (settings.url.includes("section=createCustomRace")) {
            setTimeout(function() {
                const buttonContainer = $('.custom-btn-wrap');
                const titleContainer = $('.title-black.top-round');
                const submitButton = buttonContainer.find('input[type="submit"]');

                if (buttonContainer.length && titleContainer.length) {
                    titleContainer.empty().append(buttonContainer);
                    submitButton.attr('form', 'createCustomRace');
                }
                $('#racename').val(raceName).trigger('change');
                $('.laps-wrap > .input-wrap > input').val(numberOfLaps).trigger('change');
                $('.drivers-max-wrap div.input-wrap input').val(maxDrivers).trigger('change');
                $('#select-racing-track').selectmenu();
                $('#select-racing-track-menu > li:contains(' + trackName + ')').mouseup();

            }, 200);
        }
    });
})();