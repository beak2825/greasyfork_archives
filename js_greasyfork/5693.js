// ==UserScript==
// @name       Dirty Ghost Spellchecker
// @namespace  http://reaves.co/
// @version    0.1.3.1
// @description A solution for spellcheck in Ghost
// @match      http://*/ghost/editor/*
// @copyright  2014+, Ryan Reaves
// @downloadURL https://update.greasyfork.org/scripts/5693/Dirty%20Ghost%20Spellchecker.user.js
// @updateURL https://update.greasyfork.org/scripts/5693/Dirty%20Ghost%20Spellchecker.meta.js
// ==/UserScript==



$(document).ready(function(){
	executeDirty();
});

var checkIt = setInterval(function()
{
    if(document.getElementById('spellModal') == undefined){
        executeDirty();
        clearInterval(checkIt);
    }
}, 500);

function executeDirty(){
    var helpLink = document.querySelectorAll('a.markdown-help')[0];
    var $floatingHeader = document.querySelectorAll('header.floatingheader')[0];
    var $btn = $('<a id="spellModal" href="#" style="float:right" class="spellchecker">SPELLCHECK</a>');
    $btn.appendTo($floatingHeader);
    var textArea;
        // define a handler
    function doc_keyDown(e) {

        if (e.altKey && e.keyCode == 70) {
            document.querySelectorAll('div.CodeMirror-code')[0].childNodes[0].childNodes[0].innerHTML = "";
            theMagic();
            e.preventDefault();
        }
        else if (e.altKey && e.keyCode == 87) {
            $('a.close').trigger('click');
            e.preventDefault();
        }
    }
    // register the handler 
    document.addEventListener('keydown', doc_keyDown, false);
    $btn.on('click', function(e) {
		theMagic();
	});
    function theMagic(){
            var cpeditorElements = document.querySelectorAll('div.CodeMirror-code')[0].children.length;
    var cpeditor = document.querySelectorAll('div.CodeMirror-code')[0].childNodes[0].childNodes[0];
    var textArea = cpeditor.innerHTML;
  
    textArea = textArea.replace(/<\/?span[^>]*>/g,"");
    textArea = textArea.replace(/\u200B/g,'');
        for(i=1;i<cpeditorElements;i++){
    		cpeditor = document.querySelectorAll('div.CodeMirror-code')[0].childNodes[i].childNodes[0].innerHTML;
            cpeditor = cpeditor.replace(/<\/?span[^>]*>/g,"");
            textArea = textArea.replace(/\u200B/g,'');
            textSub = textArea.substr(textArea.length - 1);
            textArea = textArea +'&#13;'+ cpeditor;
        }
		//textArea = textArea.replace(/\u000D/g,'');
        //Content area will not highlight spelling mistakes with a space on the end, so I will attach it below
        lastChar = textArea.substr(textArea.length - 1);
        if(lastChar != " "){
            textArea = textArea + " ";
        }
        
    //initiate help link, but then override the content in the modal window for spellcheck
	helpLink.click();
    var spellModal = document.querySelectorAll('header.modal-header')[0];
	spellModal.childNodes[0].innerHTML = 'Dirty Ghost SpellCheck';
    if(document.getElementById('spellTips') == undefined){
    	spellModal.childNodes[0].insertAdjacentHTML('afterend','<span id="spellTips" style="float: right; padding-right: 25px">Open - Alt+F | Close - Alt+W</span>');
    }
    var shortcuts = document.querySelectorAll('section.modal-body')[0];
    $(".modal").css("width","75%");
    if(shortcuts != undefined){
    	shortcuts.remove();
    }
    var txtbox = "1.) When done press [Ctrl+A] & then [Ctrl+C]<br>2.) Close window [Alt+W] and press [Ctrl+A] & [Ctrl+P]<br>Note: Mac Users will use Cmd<br><textarea style='width:100%; max-width:100% !important; height:100%' rows='20' spellcheck='true' id='spellcheck'>"+textArea+"</textarea>";
    spellModal.insertAdjacentHTML('afterend',txtbox);
    $("#spellcheck").focus();
    }
}