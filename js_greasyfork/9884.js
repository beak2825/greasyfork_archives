// ==UserScript==
// @name        Flags for KAT
// @namespace   PXgamer
// @description Adds Flags
// @include     *kat.cr/*
// @include     *kickass.to/*
// @include     *localhost:999/kat/testpage
// @version     1.4
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/9884/Flags%20for%20KAT.user.js
// @updateURL https://update.greasyfork.org/scripts/9884/Flags%20for%20KAT.meta.js
// ==/UserScript==

$(window).load(function(){
  $('.bbedit-spoiler').after('<span id="flagTog" style="width:auto; padding:1px; margin-right:2px;">Show/Hide Flags</span>');
  $('.bbedit-smileybar').after('<div id="flags" class="bbedit-smileybar" style="display:none;"></div>');

//Add countries under here
var j = [
"gb",
"us",
"zw"
];

  for (var i = 0; i < j.length; i++) {
   $('#flags').append('<img title="'+j[i].toUpperCase()+'" class="cusFlag" alt="flag" src="http://www.skype-emoticons.com/images/'+j[i]+'.png" />');
  }
});

$(document).delegate('#flagTog', 'click', function() {
  $('#flags').toggle();
});

jQuery.fn.extend({
insertAtCaret: function(myValue){
  return this.each(function(i) {
    if (document.selection) {
      //For browsers like Internet Explorer
      this.focus();
      var sel = document.selection.createRange();
      sel.text = myValue;
      this.focus();
    }
    else if (this.selectionStart || this.selectionStart == '0') {
      //For browsers like Firefox and Webkit based
      var startPos = this.selectionStart;
      var endPos = this.selectionEnd;
      var scrollTop = this.scrollTop;
      this.value = this.value.substring(0, startPos)+myValue+this.value.substring(endPos,this.value.length);
      this.focus();
      this.selectionStart = startPos + myValue.length;
      this.selectionEnd = startPos + myValue.length;
      this.scrollTop = scrollTop;
    } else {
      this.value += myValue;
      this.focus();
    }
  });
}
});

$(document).delegate('.cusFlag', 'click', function() { $('textarea',$(this).closest('form')).insertAtCaret( '[img]'+ $(this).attr('src') +'[/img]' );});