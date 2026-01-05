// ==UserScript==
// @name       Baka-Tsuki Colored Conversations ", [, (
// @namespace  jamc4626
// @version    v1.3
// @description  Colors Baka-Tsuki light novel dialogues/conversations.
// @match      http://www.baka-tsuki.org/project/index.php?title=*
// @license        (CC) by-nc-sa 3.0
// @downloadURL https://update.greasyfork.org/scripts/6601/Baka-Tsuki%20Colored%20Conversations%20%22%2C%20%5B%2C%20%28.user.js
// @updateURL https://update.greasyfork.org/scripts/6601/Baka-Tsuki%20Colored%20Conversations%20%22%2C%20%5B%2C%20%28.meta.js
// ==/UserScript==

jQuery(document).ready( function() {
   
    var beginBrokenComment = false;     
    jQuery.each (
    
        jQuery(".mw-content-ltr > p"),
        function() {
         
           var possibleComment = jQuery(this).html();
           var found = false;
           
           possibleComment = possibleComment.replace(/<(?:.|\n)*?>/gm, '');
           
           for ( beginning = 0; beginning < 3; beginning++) {
             
              if ( possibleComment.charAt(beginning) == '"' ) {
                 for ( ending = possibleComment.length-1; ending > possibleComment.length-10; ending--) {
                    if ( possibleComment.charAt(ending) =='"' || possibleComment.charCodeAt(ending) == 39 ) {
                             jQuery(this).addClass('quwot');
                             found = true;
                             break;
                    }
                 }
                 break;
              }
                    
              if ( possibleComment.charAt(beginning) == '“' ) {
                 for ( ending = possibleComment.length-1; ending > possibleComment.length-10; ending--) {
                    if ( possibleComment.charAt(ending) == '”' ) {
                             jQuery(this).addClass('quwot');
                             found = true;
                             break;
                    }
                 }
                 break;
              }

              if ( possibleComment.charAt(beginning) == '“' ) {
                 for ( ending = possibleComment.length-1; ending > possibleComment.length-10; ending--) {
                    if ( possibleComment.charAt(ending) == '“' ) {
                             jQuery(this).addClass('quwot');
                             found = true;
                             break;
                    }
                 }
                 break;
              }

              if ( possibleComment.charAt(beginning) == '”' ) {
                for ( ending = possibleComment.length-1; ending > possibleComment.length-10; ending--) {
                    if ( possibleComment.charAt(ending) == '”' ) {
                             jQuery(this).addClass('quwot');
                             found = true;
                             break;
                    }
                 }
                 break;
              }

              if ( possibleComment.charAt(beginning) == '”' ) {
                for ( ending = possibleComment.length-1; ending > possibleComment.length-10; ending--) {
                  if ( possibleComment.charAt(ending) == '“' ) {
                             jQuery(this).addClass('quwot');
                             found = true;
                             break;
                    }
                }
                 break;
              }

              if ( possibleComment.charAt(beginning) == '[' ) {
                 for ( ending = possibleComment.length-1; ending > possibleComment.length-10; ending--) {
                    if ( possibleComment.charAt(ending) == ']' ) {
                             jQuery(this).addClass('quwot2');
                             found = true;
                             break;
                    }
                 }
                 break;
              }

              if ( possibleComment.charAt(beginning) == '(' ) {
                 for ( ending = possibleComment.length-1; ending > possibleComment.length-10; ending--) {
                    if ( possibleComment.charAt(ending) == ')' ) {
                             jQuery(this).addClass('thinking');
                             found = true;
                             break;
                    }
                 }
                 break;
              }
              
              
           }
           
           if (found && beginBrokenComment) {
              beginBrokenComment = false;
           }
           
           if (!found && beginBrokenComment) {
              jQuery(this).addClass('quwot3');
           }
           
           if ( possibleComment.charAt(0) == '"' && !found ) {
              var closed = false;
              for ( i=1; i<possibleComment.length-1; i++) {
                 if ( possibleComment.charAt(i) == '"') {
                    closed = true;
                    break;
                 } 
              }
              if (!closed) {
                jQuery(this).addClass('quwot3');
                beginBrokenComment = true;
              }
           }

           if ( possibleComment.charAt(possibleComment.length-2) == '"' && !found ) {
              if (beginBrokenComment) {
                jQuery(this).addClass('quwot3');
                beginBrokenComment = false;
              }
           }

           if ( possibleComment.charAt(0) == '“' && !found ) {
              var closed = false;
              for ( i=1; i<possibleComment.length-1; i++) {
                 if ( possibleComment.charAt(i) == '”') {
                    closed = true;
                    break;
                 } 
              }
              if (!closed) {
                jQuery(this).addClass('quwot3');
                beginBrokenComment = true;
              }
           }

           if ( possibleComment.charAt(possibleComment.length-2) == '”' && !found ) {
              if (beginBrokenComment) {
                jQuery(this).addClass('quwot3');
                beginBrokenComment = false;
              }
           }

           
        }
        
    );

});