// ==UserScript==
// @name       APP-T!
// @namespace  http://taringa.net/lvdota
// @version    0.2
// @description  Botón shutea basty love
// @match      *.taringa.net/mi
// @copyright  lvdota
// @downloadURL https://update.greasyfork.org/scripts/6793/APP-T%21.user.js
// @updateURL https://update.greasyfork.org/scripts/6793/APP-T%21.meta.js
// ==/UserScript==

function addbtn(){
    
   
$('.my-shout-attach-options').append('<div class="follow-buttons" style="display:inline-block"><a original-title="basty puto" onclick="$.ajax({url:\'/ajax/shout/add\',type:\'post\',data:\'key=\'+global_data.user_key+\'&body=%40Sir_Basty+Puto&privacy=0&attachment_type=0&attachment=\',success:function(a){}});" class="btn g"><div class="following-text">Basty <3</div></a></div>');

}

addbtn();

