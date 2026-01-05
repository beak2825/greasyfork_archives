// ==UserScript==
// @name        ubuntu-it QuickReply Enhanced Editor
// @description Aggiunge alcune delle funzionalità dell'editor completo alla risposta rapida
// @namespace   ubuntu-it
// @require	http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js
// @include     http*://forum.ubuntu-it.org/viewtopic.php?*
// @version     0.202001290900
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/9549/ubuntu-it%20QuickReply%20Enhanced%20Editor.user.js
// @updateURL https://update.greasyfork.org/scripts/9549/ubuntu-it%20QuickReply%20Enhanced%20Editor.meta.js
// ==/UserScript==


(function($, window) {
    $.fn.selection = function() {
        var doc = window.doc;
        var element = this[0];
        var selection = {};
        if (window.getSelection) {
            /* except IE */
            selection.start = element.selectionStart;
            selection.end = element.selectionEnd;
            selection.text = element.value.slice(selection.start, selection.end);
        } else if (doc.selection) {
            /* for IE */
            element.focus();
            var range = doc.selection.createRange(),
                range2 = doc.body.createTextRange();
            selection.text = range.text;
            try {
                range2.moveToElementText(element);
                range2.setEndPoint('StartToStart', range);
            } catch (e) {
                range2 = element.createTextRange();
                range2.setEndPoint('StartToStart', range);
            }
            selection.start = element.value.length - range2.text.length;
            selection.end = selection.start + range.text.length;
        }
        return selection;
    }
})(jQuery, window);

//Pulsanti da inserire nell'editor
var buttons = [{
    code: 'b',
    name: 'B'
}, {
    code: 'u',
  name: 'u'
}, {
    code: 'i',
    name: 'i'
}, {
    code: 'code',
    name: 'Codice'
}, {
    code: 'img',
    name: 'IMG'
}, {
    code: 'quote',
    name: 'Cita'
}, {
    code: 'url',
    name: 'URL'
}, {
    code: 'wiki',
    name: 'Wiki'
}, {
    code: 'forum',
    name: 'Forum'
}];

var previewBtn = $('<input class="button2" type="submit" value="Anteprima" name="preview" tabindex="8" accesskey="a">');
previewBtn.click(function(){
    var action = $(this).parents('form').attr('action');
    $(this).parents('form').attr('action', action+'#preview');
});
jQuery('.submit-buttons').append(previewBtn);
jQuery('#message-box').each(function() {
    var $buttons = $('<div id="buttons"></div>');
    $(this).prepend($buttons);
    var $textarea = $('.inputbox', this);
    $.each(buttons, function(i, button) {
        var $btn = $('<input type="button" class="button2" />');
        $btn.val(button.name);
        $buttons.append($btn);
        $btn.click(function(e) {
            e.preventDefault();

            function exec($textarea,codeOpen, text,codeClose){

                var textarea = $textarea[0];
                var scrollTop = textarea.scrollTop;
                var selection = $textarea.selection();

                var val = $textarea.val();
                var pre = val.substring(0, selection.start);

                var bbcode = '[' + codeOpen + ']' + text + '[/' + codeClose + ']';
                var post = val.substring(selection.end);

                var newSelectionStart = selection.start + 2 + codeClose.length;
                var newSelectionStop = newSelectionStart + selection.text.length;
                $textarea.val(pre + bbcode + post);
                textarea.selectionStart = newSelectionStart;
                textarea.selectionEnd = newSelectionStop;
                textarea.focus();
                textarea.scrollTop = scrollTop;
            }

            var codeOpen = button.code;
            var codeClose = button.code;
            var selection = $textarea.selection();
            var text = selection.text || '';

            switch(codeOpen){
                case 'url':
                    codeOpen += '=' + prompt("Inserire l'URL");
                    if( text.length === 0 ){
                        text = prompt("Inserire il testo");
                    }
                    exec($textarea,codeOpen,text,codeClose);
                    break;
                case 'forum':
                    var url = prompt("Inserire l'URL");
                    var tid = 0;
                    if( url.match(/t=[\d]+/) ){
                        tid = url.match(/t=([\d]+)/)[1];
                    }else if( url.match(/^[\d]+$/) ){
                        tid = url;
                    }
                    if( tid>0 ){
                        url = 'https://forum.ubuntu-it.org/viewtopic.php?t='+tid;
                    }
                    jQuery.get(url,function(res){
                        var text = jQuery('h2:first',res).text()
                        codeOpen = 'url='+url;
                        codeClose = 'url';
                        exec($textarea,codeOpen,text,codeClose);
                    });
                    break;
                default:
                    exec($textarea,codeOpen,text,codeClose);
                    break;
            }

        });
    });
});