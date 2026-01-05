// ==UserScript==
// @name         7themes forum code select
// @namespace    http://your.homepage/
// @version      0.1
// @description  enter something useful
// @author       drakulaboy
// @include      http://7themes.su/forum/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/8879/7themes%20forum%20code%20select.user.js
// @updateURL https://update.greasyfork.org/scripts/8879/7themes%20forum%20code%20select.meta.js
// ==/UserScript==
    $.fn.OneClickSelect = function(){
      return $(this).on('dblclick',function(){
        
         var range, selection;
         if (window.getSelection) {
            selection = window.getSelection();        
            range = document.createRange();
            range.selectNodeContents(this);
            selection.removeAllRanges();
            selection.addRange(range);
        } else if (document.body.createTextRange) {
            range = document.body.createTextRange();
            range.moveToElementText(this);
            range.select();
        }
      });
    };
    // Apply to these elements
    $('text, div.codeMessage').OneClickSelect();