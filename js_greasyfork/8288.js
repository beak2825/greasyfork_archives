// ==UserScript==
// @name       Mover Mensajes
// @version    1.0.1
// @description  mueve mensajes
// @match    http://www.taringa.net/mensajes/*
// @copyright  2014, lvdota
// @namespace https://greasyfork.org/users/7456
// @downloadURL https://update.greasyfork.org/scripts/8288/Mover%20Mensajes.user.js
// @updateURL https://update.greasyfork.org/scripts/8288/Mover%20Mensajes.meta.js
// ==/UserScript==

$( document ).ready(function() {
 
    var index;
    var idCarpeta = 57291;
    var mensajes = $('a.message-link'); 
    for (index = 0; index < mensajes.length; ++index) {
        var solo = mensajes[index];
        var urlMsg = solo.getAttribute('href');
        var idMsg = urlMsg.split("/")[3];
        if(solo.innerHTML.replace(/\s/g,'').substring(0, 17) == 'Extrañás la vieja Version'){ 
            $.ajax({
                url:'http://www.taringa.net/ajax/mensajes/mover',
                type:'post',
                data:'key='+global_data.user_key+'&folder='+idCarpeta+'&ids='+idMsg,
                success:function(y){console.log('done');}
            });
        }
    }
    document.location = $('a.floatR')[1].href;
 
});