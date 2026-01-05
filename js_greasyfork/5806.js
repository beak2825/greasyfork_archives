// ==UserScript==
// @name           autogive_lama
// @namespace      autogive_lama
// @include        https://www.deviantart.com/modal/badge/*
// @require    	http://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js
// @version 0.0.1.20141016170732
// @description on deviantart, when giving a llama and password remembered, this will click the window away for you. especially useful with random-llama-button
// @downloadURL https://update.greasyfork.org/scripts/5806/autogive_lama.user.js
// @updateURL https://update.greasyfork.org/scripts/5806/autogive_lama.meta.js
// ==/UserScript==
// var $=unsafeWindow.jQuery,holder,query,offset,fPage,pPage,lPage;
if($("#givebadgeModal .smbutton").length>0){
$("#tos").attr("checked","true");
$("#givebadgeModal .smbutton").click();
}
if($(".secure.ultracompact.gruze").length!=0&&$("#givebadgeModal .smbutton").html()=="Done"){
window.open('','_parent','');
window.close();
}