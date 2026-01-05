// ==UserScript==
// @name        IPA
// @namespace   http://www.olivetti.info
// @description text to ipa
// @include     *
// @version     1
// @grant    GM_xmlhttpRequest
// @grant GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/8273/IPA.user.js
// @updateURL https://update.greasyfork.org/scripts/8273/IPA.meta.js
// ==/UserScript==

function doMonkey(){
   work(false,"words.json");
}
function doMonkey2(){
   work(true,"words.json");
}

function doMonkey3(){
   work(false,"wordsAmE.json");
}
function doMonkey4(){
   work(true,"wordsAmE.json");
}
  
function work(remove,dict){
  GM_xmlhttpRequest({
    method: 'GET',
    url: 'http://www.olivetti.info/'+dict,
    onload: function (response) {
      dataReady(response.responseText, remove);
    }
  });
}
function dataReady(text,remove) {
  words = JSON.parse(text);
  function replaceIpaString(s) {
    if (s.length == 0) return '';
    var delim = ' ,.;:<>()\n!\"—'.split('');
    var p = - 1;
    for (var i = 0; i < delim.length; i++) {
      var p2 = s.indexOf(delim[i]);
      if (p2 != - 1 && (p == - 1 || p2 < p)) p = p2;
    }
    if (p == 0) return s.charAt(0) + replaceIpaString(s.substring(1));
    var word = s;
    if (p != - 1) word = s.substring(0, p);
    var ipaword = words[word];
    var skip = word.length;
    if (ipaword !== undefined){
       if(remove)ipaword = ipaword.replace(/[.ˈ]/g,'').replace(/[(]r[)]/g,'').replace(/[ˌ]/g,'');
       word = ipaword;
    } 
    return word + replaceIpaString(s.substring(skip));
  }
  function replaceIpa(n) {
    var m;
    if (n.nodeType == 3) { // TEXT_NODE 
      var sp = n.parentNode.nodeName.toLowerCase();
      if( sp != "style" && sp != "script" ){
        ns = replaceIpaString(n.data.toLowerCase());
        n.data = ns;
      }
    } 
    else if (n.nodeType == 1) { // ELEMENT_NODE 
      for (m = n.firstChild; null != m; m = m.nextSibling) {
        replaceIpa(m);
      }
    }
  }
  replaceIpa(document.body);
}

GM_registerMenuCommand( "Convert EN", doMonkey);
GM_registerMenuCommand( "Convert EN clean", doMonkey2);
GM_registerMenuCommand( "Convert US", doMonkey3);
GM_registerMenuCommand( "Convert US clean", doMonkey4);

