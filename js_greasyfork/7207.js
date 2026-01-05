// ==UserScript==
// @name Eliminar Mensajes de Denuncia
// @version 1.2.0
// @description elimina mensajes
// @match http://www.taringa.net/mensajes*
// @copyright 2014, lvdota
// @namespace https://greasyfork.org/users/6984
// @downloadURL https://update.greasyfork.org/scripts/7207/Eliminar%20Mensajes%20de%20Denuncia.user.js
// @updateURL https://update.greasyfork.org/scripts/7207/Eliminar%20Mensajes%20de%20Denuncia.meta.js
// ==/UserScript==
$(document).ready(function () {
  var index;
  var fin = false;
  var mensajes = $('a.message-link');
  for (index = 0; index < mensajes.length; ++index) {
    if (index == (mensajes.length - 1)) {
      fin = true;
    }
    var solo = mensajes[index];
    var urlMsg = solo.getAttribute('href');
    var idMsg = urlMsg.split('/') [3];
    if (solo.innerHTML.replace(/\s/g, '').substring(0, 17) == 'DenunciaAceptada#') {
      $.ajax({
        url: 'http://www.taringa.net/ajax/mensajes/toTrash',
        type: 'post',
        data: 'key=' + global_data.user_key + '&ids=' + idMsg,
        success: function (y) {
          console.log('borrado');
          if (fin) {
            document.location = 'http://www.taringa.net/mensajes/';
          }
        }
      });
    }
  }
});
