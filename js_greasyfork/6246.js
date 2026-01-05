// ==UserScript==
// @name       PlugHKG IconPack Loader
// @namespace  http://xeonyan.wtako.net/PlugDJHKG.html
// @version    1.3
// @description  Auto Load PlugHKG IconPack
// @match      https://plug.dj/hkgolden/
// @copyright  2014+, Bus, nasaorc
// @downloadURL https://update.greasyfork.org/scripts/6246/PlugHKG%20IconPack%20Loader.user.js
// @updateURL https://update.greasyfork.org/scripts/6246/PlugHKG%20IconPack%20Loader.meta.js
// ==/UserScript==

var path = 'https://xeonyan.wtako.net/plugdj';

function print(msg){
  jQuery('#chat-messages').append('<div class="chat-update"><center><span class="chat-text" style="color:#56B8D8;font-weight:bold">' + msg + '</span></center></div>');
}

function loadScript(){
    var itv = window.setInterval(function(){
        if(jQuery('#room').length){
            window.clearInterval(itv);
            jQuery.getScript("https://cdn.firebase.com/js/client/1.0.15/firebase.js");
            jQuery.getScript(path + '/PlugDJHKG_main.js').done(function(script,status){
                print('PlugHKG IconPack 載入完成');
                print('Like Us On http://fb.com/plughkg');
            }).fail(function(jqxhr,cfg,err ) {
                print('PlugHKG IconPack 暫時未能載入<br>可能插件正在更新或網絡問題，請稍候再試');
                /**
                	 -------------------------------------------------------------------------------------
                	                 用家你好，若果你能夠看到這段訊息，證明你的步驟沒有錯             
                	                     **上面的錯誤提示只會出現於插件載入失敗時**                   
                	                                 你下一步應該做的事 :                             
                	   按下 Ctrl + A ，再按 Ctrl +C ，再依據影片所示貼上於 Tampermonkey 或 Greasemonkey  
                	                                                                                  
                	                       感謝您支持PlugHKG 高登音樂台，祝您使用愉快                        
                	
                	                       Facebook Page:       http://fb.com/plughkg                 
                	-------------------------------------------------------------------------------------
                **/
                	
            });
        }
    },999);
}

window.onload = function(){
    loadScript();
};