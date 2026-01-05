// ==UserScript==
// @name         Duolingo widescreen translation
// @namespace    http://szaliszali.github.io/duolingo-widescreen-translation/
// @version      0.2.2
// @description  Duolingo translation optimized for widescreen displays
// @author       You
// @match        https://www.duolingo.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/6219/Duolingo%20widescreen%20translation.user.js
// @updateURL https://update.greasyfork.org/scripts/6219/Duolingo%20widescreen%20translation.meta.js
// ==/UserScript==

var root='#app.wiki-translation.wide ';
var mroot=root + 'main.main-left ';
var iroot=root + '.lesson-like-document.hide-instructions.view-original ';

var mt='div.machine-translation';
var cmt="clone-machine-translation";

function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

addGlobalStyle('body div#zendesk-wrapper {display:none;}');

addGlobalStyle(root + 'div#document-hider {width:100%;}');

addGlobalStyle(mroot + '{max-width:100%; padding: 0 10px 0 10px;}');
addGlobalStyle(mroot + 'section div.responsive-container {max-width:100%; }');
addGlobalStyle(mroot + 'section div.document-header-new {width:98%;width:calc(100% - 20px); }');

addGlobalStyle(iroot + '.document-header-new { height: 72px; }');
addGlobalStyle(iroot + '#document-omnibox { margin-top: 92px; }');
addGlobalStyle(iroot + '#document-omnibox hr { display:none; }');

window.cloneDuobotTranslation=function(id) {
	var div=$('div#'+id);

    var machine=div.find(mt);
    
    var textarea=div.find("textarea.wiki-textarea");
    if(textarea.text().length===0) {
        textarea.text(machine.text());
        textarea.focus();
        return;
    }
    alert('textarea is not empty');
}

$('body').on("focus","div.no-translation",function() {
    var h4=$(this).find('h4.toggle-machine-translation');
    if(h4.length===0) return;

    $(this).find('a.save-edit').text("OK");
    $(this).find('a.cancel-edit').text("Esc");
    var container=$(this).find("div.wiki-textarea-container > div:last");
    if(container.find("."+cmt).length===0) {
        container.append("<a href='javascript:window.cloneDuobotTranslation(\""+$(this).parent("div.document-sentence-sidebar").attr('id')+"\");' style='margin-left: 10px' class='"+cmt+" btn btn-standard' data-toggle='tooltip' title='' data-original-title='Clone DuoBot translation to the textarea' onclick=''>Clone</a>");
    }

    var machine=$(this).find(mt);
    if(machine.length>0) return;

    if(!h4.hasClass("active")) {
        h4.click();
    }
});
