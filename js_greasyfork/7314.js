// ==UserScript==
// @name         WykopSeen
// @namespace    http://www.wykop.pl/
// @require      http://ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min.js
// @version      0.93
// @description  Add Seen button to hide seen wykops
// @author       axem.pl
// @match        http://www.wykop.pl/
// @match        http://www.wykop.pl/link/*
// @match        http://www.wykop.pl/wykopalisko/*
// @match        http://www.wykop.pl/hity/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @downloadURL https://update.greasyfork.org/scripts/7314/WykopSeen.user.js
// @updateURL https://update.greasyfork.org/scripts/7314/WykopSeen.meta.js
// ==/UserScript==
 
var jq = this.$ = this.jQuery = jQuery.noConflict(true);
var seenWykopClass = 'seen';
 
function eachLi() {
    var wykopitem = jq(this);
    var wykopitemparent = wykopitem.parent();
    var btn = jq('<button class=\'seen-btn\'></button>');
    var href = wykopitem.find('h2 a').attr('href');
    if (!href) return;
    var isseen = getIsSeen(href);
 
    function btnOnClick2(event) {
        var result = btnOnClick.call(this, event);
        var jqThis = jq(this);
        var isseen = jqThis.data('isseen');
 
        if (isseen) {
            wykopitem.addClass(seenWykopClass);
            wykopitemparent.append(wykopitem);
        } else {
            wykopitem.removeClass(seenWykopClass);
            wykopitemparent.prepend(wykopitem);
        }
 
        return false;
    }
        
    if (isseen) {
        wykopitem.addClass(seenWykopClass);
        wykopitemparent.append(wykopitem);
    }
    
    btn.data('href', href).data('isseen', isseen).on('click', btnOnClick2);
    
    refreshBtnText.call(btn);
 
    wykopitem.children('div').append(btn); 
}
function refreshBtnText() {
    var jqThis = jq(this);
 
    if (jqThis.data('isseen')) {
        jqThis.text('UNSEE');
    } else {
        jqThis.text('SEEN');
    }
}
function btnOnClick(event) {
    if (event) event.preventDefault();
    var jqThis = jq(this);
    var href = jqThis.data('href');   
    var isseen = jqThis.data('isseen');
    isseen = !isseen;
    jqThis.data('isseen', isseen);
    setIsSeen(href, isseen);   
    refreshBtnText.call(jqThis);   
     
    return false;
}
function getIsSeen(href) {
    return GM_getValue(href);
}
function setIsSeen(href, value) {
    if (value) {
        GM_setValue(href, 1);
    } else {
        GM_deleteValue(href);
    } 
}
function seenFullBtn() {
    var btn = jq('<button class=\'seen-btn\'></button>');
    var href = getHrefFromLocation();
    if (!href) return;
    var isseen = getIsSeen(href);
 
    btn.data('href', href).data('isseen', isseen).on('click', btnOnClick);
    refreshBtnText.call(btn);
    
    jq('.article.fullview .lcontrast').append(btn);
}
function cssRules() {
    var rules = [
        'li.seen { background: lightgray }',
        'li.seen * { color: gray !important }',
        'li.seen .diggbox { display: none }',
        'li.seen .media-content { display: none }',
        'li.seen .fix-tagline { display: none }',
        'li.seen .description { display: none }',
        'li.seen .elements { display: none }',
        'li.seen .article { min-height: 0 }',
        '.seen-btn { position: absolute; top: 5px; right: 5px; z-index: 9999 }'
    ];
    return rules.join('\n');
}
function getHrefFromLocation() {
    var href = document.location.toString().split('#')[0];
    if (href.lastIndexOf('http://www.wykop.pl/link/', 0) === 0) {
        return href;
    }
}
function makeSeenLink() {
    var href = getHrefFromLocation();
    if (href) {
        setIsSeen(href, true);
    }
}
function exec() {
    makeSeenLink();
    jq(document.body).append(jq('<style type=\'text/css\'></style>').html(cssRules()));
    jq('#itemsStream li').each(eachLi);
    seenFullBtn();
}
exec();