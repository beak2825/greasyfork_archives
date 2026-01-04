// ==UserScript==
// @name         ELPais unlocker resesona
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Para ver todos los artículos que quieras, se espera 7 segundos a que aparezca el element con premium y lo remueve, regresa contenido original del artículo
// @author       resesona
// @match        https://elpais.com/*
// @license MIT 
// @downloadURL https://update.greasyfork.org/scripts/552079/ELPais%20unlocker%20resesona.user.js
// @updateURL https://update.greasyfork.org/scripts/552079/ELPais%20unlocker%20resesona.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var cssSelMain = "#main-content > div.a_c.clearfix";
    var cuerpo = document.querySelector (cssSelMain);
    var cuerpoOriginal = cuerpo.innerHTML;
    var premium = 'ctn_freemium_article';

    if (cuerpo) {

        setTimeout(function() {
            const element = document.getElementById(premium);
            element.parentNode.removeChild(element);

            cuerpo.innerHTML = cuerpoOriginal;

        }, 7000);
    }

})();