// ==UserScript==
// @name        AutoLockD&DMail
// @namespace   InGame
// @description Bloque le drag and drop sur la messagerie
// @include     http://www.dreadcast.net/Main
// @include     https://www.dreadcast.eu/Main
// @version     1.01
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/9085/AutoLockDDMail.user.js
// @updateURL https://update.greasyfork.org/scripts/9085/AutoLockDDMail.meta.js
// ==/UserScript==

MenuMessagerie.prototype.handleDrag = function () {
    $("#liste_messages .message:not(.ui-draggable)").draggable({
        cursorAt: {
            top: 0,
            left: -20
        },
        helper: function () {
            var a = $("#liste_messages .content input:checked").length;
            return $('<div id="dragged_msg"><span>' + (a ? a : "") + "</span></div>")
        },
        start: function () {
    		if( document.getElementById('lock').style.backgroundImage.replace(/\"/g,'') == 'url(http://www.pubzi.com/f/Cadenas-ouvert.svg)')
            	return "-1" == $("#current_folder").attr("data-id") ? !1 : (!$(this).hasClass("selected") && $("#liste_messages").length && nav.getMessagerie().messageUnselectAll(), void($("#folder_list:hidden").length && $("#liste_messages .folder_list").trigger("click")))
        },
        stop: function () {
	    	if( document.getElementById('lock').style.backgroundImage.replace(/\"/g,'') == 'url(http://www.pubzi.com/f/Cadenas-ouvert.svg)')
            	 $("#liste_messages .folder_list").trigger("click")
        }
    })
}

var lock = document.createElement('div');
lock.id='lock';
var auth = localStorage.getItem('SIF_LockD&DMail');
if(auth!=null && auth=="on")
    lock.setAttribute("style", "width:32px;height:20px;background-image:url('http://www.infowebmaster.fr/img/news/cadenas-128px.png');background-repeat: no-repeat;background-position: 33px 0;position: absolute; right: 0px;z-index: 999999;");
else
    lock.setAttribute("style", "width:32px;height:20px;background-image:url('http://www.pubzi.com/f/Cadenas-ouvert.svg');background-repeat: no-repeat;background-position: 33px 0;position: absolute; right: 0px;z-index: 999999;");    
//$("#zone_messagerie .titre").text("");
var mess = document.getElementById('zone_messagerie');
mess.appendChild(lock);
$('#lock').css('background-position','0px 0px').css('left','120px').css('top','2px').css('background-size','15px 15px').addClass('link');

lock.onclick = function(){
    if(auth!=null && auth=="on")
    {
      if( document.getElementById('lock').style.backgroundImage.replace(/\"/g,'') == 'url(http://www.pubzi.com/f/Cadenas-ouvert.svg)')
       document.getElementById('lock').style.backgroundImage = 'url("http://www.infowebmaster.fr/img/news/cadenas-128px.png")';
     else
       document.getElementById('lock').style.backgroundImage = 'url("http://www.pubzi.com/f/Cadenas-ouvert.svg")';
    }
    else
        alert("Vous n'avez pas l'autorisation d'utiliser ce programme. Pour acheter une licence rendez vous au 420 rue Hoblet ou contactez Odul.")
};