// ==UserScript==
// @name        Post Spoiler for mturkgrind.com
// @author      Kerek
// @namespace   Kerek
// @version     0.2.1x
// @description Spoils posts based on keywords
// @require     http://code.jquery.com/jquery-latest.min.js
// @include     http://www.mturkgrind.com/*
// @include     http://mturkgrind.com/*
// @grant       GM_log
// @copyright   2014
// @downloadURL https://update.greasyfork.org/scripts/6209/Post%20Spoiler%20for%20mturkgrindcom.user.js
// @updateURL https://update.greasyfork.org/scripts/6209/Post%20Spoiler%20for%20mturkgrindcom.meta.js
// ==/UserScript==

// v0.2x, 2015-01-17: updates by clickhappier for MTG migration from vbulletin to xenforo

var spoil_me = ["First Example Keyword", "Second Example Keyword", "Third Example Keyword"];

var spoiler_text;
var spoiled = false;

$('[class*="messageContent"]').each(function(){
    spoiled = false;
   for (i = 0; i < spoil_me.length; i++){
       
      if ($(this).text().toLowerCase().indexOf(spoil_me[i].toLowerCase())!==-1){
             spoiler_text = spoil_me[i] + " Spoiler";
             spoiled = true;
          }
   }
        if (spoiled)
            {
         var post_content = $(this).html();
         $(this).html( '<div style="margin: 5px 20px 20px;"> <div class="smallfont" style="margin-bottom: 2px;"><b>' + spoiler_text +':</b>&nbsp;  <input value="Show" style="margin: 0px; padding: 0px; width: 45px; font-size: 10px;" onclick="if (this.parentNode.parentNode.getElementsByTagName(\'div\')[1].getElementsByTagName(\'div\')[0].style.display != \'\') { this.parentNode.parentNode.getElementsByTagName(\'div\')[1].getElementsByTagName(\'div\')[0].style.display = \'\';this.innerText = \'\'; this.value = \'Hide\'; } else { this.parentNode.parentNode.getElementsByTagName(\'div\')[1].getElementsByTagName(\'div\')[0].style.display = \'none\'; this.innerText = \'\'; this.value = \'Show\'; }" type="button"> </div> <div class="alt2" style="border: 1px inset ; margin: 0px; padding: 6px;"> <div style="display: none;">' + post_content + '</div> </div> </div>');    
     }
});