// ==UserScript==
// @name RosbankIbank
// @namespace RosbankIbank
// @description Заполнение одним кликом цифр с идентификационной карты и пароля, минуя ввод через виртуальную клавиатуру
// @author Demetros
// @license MIT
// @version 1.0
// @include https://ibank.rosbank.ru/*
// @grant       unsafeWindow
// @grant       GM_getValue
// @grant       GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/6871/RosbankIbank.user.js
// @updateURL https://update.greasyfork.org/scripts/6871/RosbankIbank.meta.js
// ==/UserScript==
(function (window, undefined) {
    var w;
    if (typeof unsafeWindow != undefined) {
        w = unsafeWindow
    } else {
        w = window;
    }

    // do not run in frames
    if (w.self != w.top) {
        return;
    }

    /* =============================================================== */
    function testUrl(reStr) {
        var re = new RegExp(reStr);
        return re.test(w.location.href);
    }
    function $(selector) {
        return document.querySelector(selector);
    }
    function waitForDOM(selector, callback) {
        var element = document.querySelector(selector);
        if(element) {
            callback(element);
        } else {
            setTimeout(function() {
                waitForDOM(selector, callback);
            }, 100);
        }
    }
    function getPinAndPass() {
        var pin = GM_getValue('pin') || '',
            password = GM_getValue('password') || '';
        return {pin: pin, password: password};
    }
    function addStyles() {
        var style = document.createElement('style');
        style.type = 'text/css';
        var html = '';
        html += '.b-userscript-menu { z-index: 1000; position: fixed; left: 0; top: 0; cursor: default; }';
        html += '.b-userscript-menu__icon { position: absolute; background: #e9001f; }';
        html += '.b-userscript-menu__container { display: none; position: absolute; top: 0; left: 10px; width: 100px; }';
        html += '.b-userscript-menu__container a { display: block; padding: 5px 10px; background: #f5f5f5; }';
        html += '.b-userscript-menu:hover .b-userscript-menu__container { display: block; }';
        style.innerHTML = html;
        document.getElementsByTagName('head')[0].appendChild(style);
    }
    function addMenu() {
        var div = document.createElement('div');
        div.className = 'b-userscript-menu';
        div.id = 'userscript-menu';
        var html = '<span class="b-userscript-menu__icon">&#x2630;</span><div class="b-userscript-menu__container">';
        html += '<a href="#" id="userscript-fill">Заполнить</a>';
        html += '<a href="#" id="userscript-settings">Настройки</a>';
        html += '</div>';
        div.innerHTML = html;
        document.body.appendChild(div);

        /*
        $('#userscript-menu').addEventListener('click', function(e) {
            e.stopPropagation();
            e.preventDefault();
            fillForms();
        });
        */
        $('#userscript-settings').addEventListener('click', function(e) {
            e.stopPropagation();
            e.preventDefault();
            fillUserData();
        });
        $('#userscript-fill').addEventListener('click', function(e) {
            e.stopPropagation();
            e.preventDefault();
            fillForms();
        });
    }
    function fillUserData() {
        var userData = getPinAndPass();

        userData.pin = prompt('Введите 8 последних цифр карты доступа:', userData.pin);
        userData.pin = userData.pin.replace(/^(\d{4})/, '$1 ').replace(/\s+/, ' ').replace(/^\s+|\s+$/g, ''); // add space after first four digits
        GM_setValue('pin', userData.pin);

        userData.password = prompt('Введите пароль:', userData.password);
        GM_setValue('password', userData.password);

        return userData;
    }
    function fillForms() {
        var userData = getPinAndPass();

        if(!userData.pin || !userData.password) {
           userData = fillUserData();
        }

        var pin = $('#ctl00_MainContentPlaceHolder_CardNumTextBox');

        pin.value = userData.pin;
        pin.dispatchEvent(new Event('change'));

        setTimeout(function() {
            $('#ctl00_MainContentPlaceHolder_CardButton').dispatchEvent(new MouseEvent('click', {'view': window, 'bubbles': true, 'cancelable': true}));

            waitForDOM('#ctl00_MainContentPlaceHolder_pin3', function(password) {
                password.value = userData.password;
                password.dispatchEvent(new Event('change'));

                setTimeout(function() {
                   $('#ctl00_MainContentPlaceHolder_Pwd1Button').dispatchEvent(new MouseEvent('click', {'view': window, 'bubbles': true, 'cancelable': true}));
                }, 200);
            });
        }, 200);
    }

    // additional check for url
    if (testUrl('https://ibank.rosbank.ru/Login.aspx')) {
        addStyles();
        addMenu();
    }
})(window);
