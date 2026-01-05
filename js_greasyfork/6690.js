// ==UserScript==
// @name        Goodgame chat undel
// @namespace   goodgame.ru
// @include     http://goodgame.ru/chat/*
// @version     1.1
// @description Googgame chat undel
// @downloadURL https://update.greasyfork.org/scripts/6690/Goodgame%20chat%20undel.user.js
// @updateURL https://update.greasyfork.org/scripts/6690/Goodgame%20chat%20undel.meta.js
// ==/UserScript==

c=window.chat;
t=function(){
  cc=c.$elem.find('.msg');
  for(var i=0;i<cc.length;i++){
    s=cc[i].getAttribute('id');
    if(s.indexOf('_my')==-1){
      cc[i].setAttribute('id',cc[i].getAttribute('id')+'_my');
    }
  }
};
c.client.on('message', function(msg){ setTimeout(t,1000); }); 
c.client.on('remove_message', function(msgId)
            {msgId = parseInt(msgId);
            if (msgId > 0) {
                var $dl = c.$elem.find("#msg-" + msgId+"_my");
                if ($dl) {
                    $dl.addClass("delete_mess");
                    $dl.attr("style","text-decoration:underline;");
                    }
                }
            });
