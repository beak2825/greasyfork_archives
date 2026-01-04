// ==UserScript==
// @name         SL Railway Autofill
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Autofill primary passenger fields on SL Railway
// @author       you
// @match        *://seatreservation.railway.gov.lk/*paymentsummary*
// @run-at       document-idle
// @grant        none
// @license        MIT
// @downloadURL https://update.greasyfork.org/scripts/557233/SL%20Railway%20Autofill.user.js
// @updateURL https://update.greasyfork.org/scripts/557233/SL%20Railway%20Autofill.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const FirstPersonData = {
        first_name: "Katerina",
        last_name: "KEK",
        email: "aaa@gmail.com",
        passport: "1234577",
        mobile_phone: "+79776746828",
        gender: "Female", // Male or Female,
        title: "Mrs" // "Mr" or "Mrs" or "Miss"
    };

    const SecondPersonData = {
        passport: "2222222",
        gender: "Female" // Male or Female
    };

    const ThirdPersonData = {
        passport: "3333333",
        gender: "Male" // Male or Female
    };

    const FouthPersonData = {
        passport: "4444444",
        gender: "Female" // Male or Female
    };


    const DATA_INPUTS = {
        fname_:  FirstPersonData['first_name'],
        lname_:  FirstPersonData['last_name'],
        email_:  FirstPersonData['email'],
        nicpp_:  FirstPersonData['passport'],
        mobile_: FirstPersonData['mobile_phone'],

        idpassenger_1: SecondPersonData['passport'],
        idpassenger_2: ThirdPersonData['passport'],
        idpassenger_3: FouthPersonData['passport']
    };

    function setSelectValueById(id, value) {
        const el = document.getElementById(id);
        if (!el) return false;

        if (el.value !== value) {
            el.value = value;
            el.dispatchEvent(new Event('change', { bubbles: true }));
        }
        return el.value === value;
    }

    // NIC / Passport → Passport
    function selectPassportType() {
        const labelPassport = document.querySelector(
            "label[onclick*=\"changeNICPattern('Passport')\"]"
        );
        if (!labelPassport) return false;

        const radio = labelPassport.querySelector('input[type="radio"]');
        if (radio && !radio.checked) {
            labelPassport.click(); // вызовет changeNICPattern('Passport') и поставит active
        }
        return radio ? radio.checked : labelPassport.classList.contains('active');
    }

    // Seat Selection: Third Class Reserved Seats
    function selectThirdClassSeat() {
        const conts = document.querySelectorAll('#onewayseatclass .cont');
        if (!conts.length) return false;

        let found = false;
        conts.forEach((c) => {
            if (c.textContent.trim() === 'Second Class Reserved Seats') {
                const box = c.closest('.box-class');
                if (box) {
                    box.click(); // триггерим стандартный обработчик
                    found = true;
                }
            }
        });

        if (!found) return false;

        const summary = document.getElementById('f_classname');
        if (summary) {
            return summary.textContent.trim() === 'Third Class Reserved Seats';
        }
        return true;
    }

    // Галочка Terms & Conditions
    function acceptTerms() {
        const cb = document.getElementById('termsAndCon');
        if (!cb) return false;

        if (!cb.checked) {
            // ставим галочку, но не кликаем, чтобы не всплывало модальное окно
            cb.checked = true;
            cb.dispatchEvent(new Event('change', { bubbles: true }));
        }
        return cb.checked;
    }

    // Галочка Age Rules
    function acceptAgeRules() {
        const cb = document.getElementById('ageLimitCon');
        if (!cb) return false;

        if (!cb.checked) {
            // ставим галочку, но не кликаем, чтобы не всплывало модальное окно
            cb.checked = true;
//            cb.dispatchEvent(new Event('change', { bubbles: true }));
        }
        return cb.checked;
    }


    function fillOnce() {
        let found = false;

        for (const id in DATA_INPUTS) {
            const el = document.getElementById(id);
            if (!el) continue;

            // не трогаем, если уже что-то введено руками
            if (!el.value) {
                el.value = DATA_INPUTS[id];
            }
            found = true;
        }

        selectPassportType();
        selectThirdClassSeat();
        acceptTerms();
        acceptAgeRules();

        setSelectValueById('title_', FirstPersonData.title);
        setSelectValueById('gender_', FirstPersonData.gender);

        setSelectValueById('passenger_1', 'Passport');
        setSelectValueById('passenger_gender_1', SecondPersonData.gender);

        setSelectValueById('passenger_2', 'Passport');
        setSelectValueById('passenger_gender_2', ThirdPersonData.gender);

        setSelectValueById('passenger_3', 'Passport');
        setSelectValueById('passenger_gender_3', FouthPersonData.gender);



        return found;
    }

    // периодически пытаемся заполнить, пока не найдём форму
    let attempts = 0;
    const maxAttempts = 40; // ~12 сек при 300 мс
    const timer = setInterval(() => {
        attempts++;
        const ok = fillOnce();

        // если нашли хотя бы одно поле ИЛИ слишком много попыток — стоп
        if (ok || attempts >= maxAttempts) {
            clearInterval(timer);
        }
    }, 300);
})();
