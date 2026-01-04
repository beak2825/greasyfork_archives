// ==UserScript==
// @name         Torn: Racing: Save custom race settings
// @namespace    lugburz.racing.save_custom_settings
// @version      0.1.4
// @description  Saves and automatically loads custom race settings.
// @author       Lugburz
// @match        https://www.torn.com/loader.php?sid=racing*
// @match        https://www.torn.com/page.php?sid=racing*
// @require https://update.greasyfork.org/scripts/510149/1486318/lugburz%27%20Torn%20Scripts%20library.js
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/559752/Torn%3A%20Racing%3A%20Save%20custom%20race%20settings.user.js
// @updateURL https://update.greasyfork.org/scripts/559752/Torn%3A%20Racing%3A%20Save%20custom%20race%20settings.meta.js
// ==/UserScript==

function setMenuValue(menu, value) {
    $(menu).val(value);
    $(menu).click();
    $(menu).change();
}

function loadSave() {
    if ($('#racingAdditionalContainer').find('div.title-black').text().trim() == 'Start a custom race') {
        let racename = $('#racename');
        let minDrivers = $('#createCustomRace').find('li.drivers-wrap').find('input[type=text]');
        let maxDrivers = $('#createCustomRace').find('li.drivers-max-wrap').find('input[type=text]');
        let track = $('#select-racing-track');
        let laps = $('#createCustomRace').find('li.laps-wrap').find('input[type=text]');
        let cars = $('#select-racing-cars');
        let upgrades = $('#select-allow-upgrades');
        let betAmount = $('#betAmount');
        let waitTime = $('#waitTime');
        let password = $('#password');

        if (GM_getValue('saved')) {
            $(racename).val(GM_getValue('racename'));
            $(minDrivers).val(GM_getValue('minDrivers'));
            $(maxDrivers).val(GM_getValue('maxDrivers'));
            setMenuValue(track, GM_getValue('track'));
            $(laps).val(GM_getValue('laps'));
            setMenuValue(cars, GM_getValue('cars'));
            setMenuValue(upgrades, GM_getValue('upgrades'));
            $(betAmount).val(GM_getValue('betAmount'));
            $(waitTime).val(GM_getValue('waitTime'));
            $(password).val(GM_getValue('password'));
        }

        $('#racingAdditionalContainer').find('div.custom-btn-wrap').find('input.btn-action-form').on('click', function() {
            GM_setValue('saved', 1);
            GM_setValue('racename', $(racename).val());
            GM_setValue('minDrivers', $(minDrivers).val());
            GM_setValue('maxDrivers', $(maxDrivers).val());
            GM_setValue('track', $(track).val());
            GM_setValue('laps', $(laps).val());
            GM_setValue('cars', $(cars).val());
            GM_setValue('upgrades', $(upgrades).val());
            GM_setValue('betAmount', $(betAmount).val());
            GM_setValue('waitTime', $(waitTime).val());
            GM_setValue('password', $(password).val());
        });
    }
}

(function() {
    'use strict';

    // Your code here...
    ajax((page) => {
        if (page !== 'loader' && page !== 'page') return;
        $('#racingAdditionalContainer').ready(loadSave);
    });

    $('#racingAdditionalContainer').ready(loadSave);
})();
