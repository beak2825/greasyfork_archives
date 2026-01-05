// ==UserScript==
// @name         Oto altın para basma
// @website             https://sites.google.com/view/tribokoc/página-inicial
// @email               tribalwarsbr100@gmail.com
// @email_2            tw.revolution.tw@gmail.com
// @description 	    script construtor para game tribalwars, realiza upagem “Upar” dos edifícios do game, script realiza a atividade em formato inicial resolvendo as Quest do game, e após o término das Quest o script realiza upagem de acordo com perfil pré definido pelo autor do script. (mas pode ser modificado a alteração de como e feito a upagem, pelo próprio usuário.
// @codigo              Conteudo feito em linguagem javascript com base em EcmaScript totalmente Opensource
// @author		        tw.revolution.tw
// @include             http*://*.*game.php*
// @version     	    0.0.1
// @copyright           tw.revolution,tw
// @license             AGPL-3.0-or-later
// @grant               GM_getResourceText
// @grant               GM_addStyle
// @grant               GM_getValue
// @grant               unsafeWindow
// @require             http://code.jquery.com/jquery-1.12.4.min.js
// @namespace https://greasyfork.org/users/563492
// @downloadURL https://update.greasyfork.org/scripts/558244/Oto%20alt%C4%B1n%20para%20basma.user.js
// @updateURL https://update.greasyfork.org/scripts/558244/Oto%20alt%C4%B1n%20para%20basma.meta.js
// ==/UserScript==

(function() {

    //var $ = function(){};
    var urlParams = new URLSearchParams(window.location.search);
    var screen = urlParams.get('screen');

    if(screen == "snob"){

        setInterval(function(){
            document.getElementById('coin_mint_fill_max').click();
            $("[type=submit]").trigger("click");

        },2000)

        setInterval(function(){

            location.reload();
        },10000)
    }

})();