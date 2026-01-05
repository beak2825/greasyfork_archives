// ==UserScript==
// @name        LOG2 scripting reference
// @namespace   jkos
// @include     http://www.grimrock.net/modding/scripting-reference/
// @version     1.2
// @grant       none
// @description Legend of Grimrock 2 scripting reference formatter
// @downloadURL https://update.greasyfork.org/scripts/6292/LOG2%20scripting%20reference.user.js
// @updateURL https://update.greasyfork.org/scripts/6292/LOG2%20scripting%20reference.meta.js
// ==/UserScript==
	   
$('h3').css('cursor','pointer')
$('h3').nextUntil('h3').hide();

$('h3').click(function(e){
  if ($(this).next().is(":visible") ){
	 $(this).nextUntil('h3').hide();
  }else{
	 $(this).nextUntil('h3').show() ;
  }
})

//$('em').css('font-weight','bold');
$('em').css('color','#b99e73');
$('em').css('font-size','1.1em');
$('li').html(function(i, val) {
  return '<span style="font-weight: bold">'+val.replace(':', ':</span>');
});
//$('a:contains("Component")').first().parent().show()
$('a').parent().show()
.click(function(){
  $(this).nextUntil('p:visible').show()
  
}).css('cursor','pointer');