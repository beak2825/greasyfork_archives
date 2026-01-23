// ==UserScript==
// @name         DDG - Remove 5-sites blocklist limit
// @namespace    https://github.com/Procyon-b
// @version      0.2
// @description  Remove the maximum limit of 5 sites blocked on DuckduckGo search results page
// @author       Achernar
// @match        https://duckduckgo.com/?*q=*
// @match        https://noai.duckduckgo.com/?*q=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/563691/DDG%20-%20Remove%205-sites%20blocklist%20limit.user.js
// @updateURL https://update.greasyfork.org/scripts/563691/DDG%20-%20Remove%205-sites%20blocklist%20limit.meta.js
// ==/UserScript==

(function() {
"use strict";

document.body.addEventListener('click', function(ev){
  //let r=ev.target, e=r.previousElementSibling;
  let r=ev.target, a, svg;

  if (r.localName == 'span') svg=r.previousElementSibling;
  else if (r.localName == 'svg') svg=r;
  else if (r.localName == 'a' && r.role == "menuitem") {
    svg=r.querySelector(':scope > svg');
    r=svg;
    }

  if (!svg || (svg.localName!='svg') || !svg.querySelector('path[d^="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0M3.708 13.21a6.75 6.75 0 0 0 9.502-9.502zM8"]') ) return;
  var A=[];
  if (window.DDG.settings._settings.kbm) {
    A=window.DDG.settings._settings.kbm.split(',');
    let s=r.closest('a')?.previousElementSibling?.href.split('-site%3A')[1].replace(/^www\./,'');
    if (!s) return;
    A.push(s);
    delete window.DDG.settings._settings.kbm;
    delete window.DDG.settings._savedSettings.kbm;
    }
  else return;

  setTimeout(function(){
    window.DDG.settings._settings.kbm=A.join(',');
    }, 0);
  }, true);

})();