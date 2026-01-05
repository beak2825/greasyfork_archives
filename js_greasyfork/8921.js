// ==UserScript==
// @name        VK Message Encryption
// @namespace   vkencryption
// @author      FM-dev
// @description Шифрование сообщений Вконтакте
// @require       http://ajax.aspnetcdn.com/ajax/jQuery/jquery-1.11.2.min.js
// @version     21
// @match       *://vk.com/* 
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/8921/VK%20Message%20Encryption.user.js
// @updateURL https://update.greasyfork.org/scripts/8921/VK%20Message%20Encryption.meta.js
// ==/UserScript==


function encryption(){ 
  var getId = ""+$( ".im_photo_holder" ).html();
  var id = getId.substring(12, getId.indexOf("ta")-2);
  var text = ""; 
  text = $( "#im_editable"+id ).text(); 
  var password = prompt("Пароль", "");
  var encrypted = "";
  encrypted = "" + CryptoJS.AES.encrypt(text, password);
  $( "#im_editable"+id ).text(encrypted);
}
var textForDec =  "";
function decryptnew(){
  var password2 = prompt("Пароль", "");
  decrypted = CryptoJS.AES.decrypt(textForDec, password2).toString(CryptoJS.enc.Utf8);
  if(decrypted!=""){
    alert(decrypted);
  }else{
    alert("Неправильный пароль");
  }
}


// Credit to Crayon Violent http://stackoverflow.com/a/3597640
var s_ajaxListener = new Object();
s_ajaxListener.tempOpen = XMLHttpRequest.prototype.open;
s_ajaxListener.tempSend = XMLHttpRequest.prototype.send;
s_ajaxListener.callback = function () {
  // this.method :the ajax method used
  // this.url    :the url of the requested script (including query string, if any) (urlencoded) 
  // this.data   :the data sent, if any ex: foo=bar&a=b (urlencoded)

setTimeout(function() {
$( "tr[class^='im_in']" ).off("click");
$( "tr[class^='im_in']" ).on( "click", function() {
 textForDec = $( this ).find(".im_msg_text").html();

});
$( "tr[class^='im_out']" ).off("click");
$( "tr[class^='im_out']" ).on( "click", function() {
 textForDec = $( this ).find(".im_msg_text").html();
});
  var checkIfItExists = document.getElementById("encrypt");
if ( checkIfItExists == null ) {
$('<button id ="encrypt" style="display:inline-block;float:right;">&#128274</button>').insertAfter('#im_send');
$('<button id ="decrypt" class="flat_button fl_r">?</button>').insertAfter('#im_log_fav_btn');
  $( "#im_send_wrap" ).off("click", "#encrypt");
  $( "#im_send_wrap" ).on( "click", "#encrypt", encryption );
  $( "#im_log_controls" ).off("click", "#decrypt");
  $( "#im_log_controls" ).on( "click", "#decrypt", decryptnew );
}
}, 500);
}

XMLHttpRequest.prototype.open = function(a,b) {
  if (!a) var a='';
  if (!b) var b='';
  s_ajaxListener.tempOpen.apply(this, arguments);
  s_ajaxListener.method = a;  
  s_ajaxListener.url = b;
  if (a.toLowerCase() == 'get') {
    s_ajaxListener.data = b.split('?');
    s_ajaxListener.data = s_ajaxListener.data[1];
  }
}

XMLHttpRequest.prototype.send = function(a,b) {
  if (!a) var a='';
  if (!b) var b='';
  s_ajaxListener.tempSend.apply(this, arguments);
  if(s_ajaxListener.method.toLowerCase() == 'post')s_ajaxListener.data = a;
  s_ajaxListener.callback();
}


