// ==UserScript==
// @name          Crescent City Soccer - Team Plugin
// @namespace     Ryan Meyers
// @author        Ryan Meyers (from erosman and Jefferson "jscher2000" Scher)
// @version       1.8.1
// @description   Highlights Team Name & Creates Team Schedule atop Page
// @include       http://*.crescentcitysoccer.com/*
// @grant         GM_registerMenuCommand
// @grant         GM_setValue
// @grant         GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/7462/Crescent%20City%20Soccer%20-%20Team%20Plugin.user.js
// @updateURL https://update.greasyfork.org/scripts/7462/Crescent%20City%20Soccer%20-%20Team%20Plugin.meta.js
// ==/UserScript==

/* --------- Note ---------
  This script highlights User-defined case-insensitive Text on a page.

  TO INCLUDE SITES (only Greasy Fork is initially included):

  Go to Add-ons - User Scripts ('Ctrl+ Shift + a' on Firefox)
  Click on the Script's Option
  Under User Settings Tab, Add Included/Excluded Pages that you want the script to run on
  Click OK

  Setting Keywords & Highlight Style:
  Click on drop-down triangle next to the GreaseMonkey Icon
  User Scripts Commands...

      Set Keywords
      Input keywords separated by comma
      Example: word 1,word 2,word 3

      Set Highlight Style
      Input the Highlight Style (use proper CSS)
      Example: color: #f00; font-weight: bold; background-color: #ffe4b5;

  Note: If you find that another script clashes with this script, set Text Highlighter to Execute first.
  Go to Add-ons - User Scripts ('Ctrl+ Shift + a' on Firefox)
  Right Click on the Script
  On the context menu click: Execute first

  On Add-ons - User Scripts, you can also Click on the Execution Order (top Right) and
  change the execution order so that Text Highlighter runs before those scripts that clashes with it.


  --------- History ---------
  1.7mo Added MutationObserver (Jefferson "jscher2000" Scher)
  1.7 Changed script from matching whole words to do partial word match 
      similar to browser's FIND + escaped RegEx Quantifiers in keywords
  1.6 Code Improvement, using test()
  1.5 Code Improvement
  1.4 Code Improvement + Added support for non-English Words
  1.3 Code Improvement, 10x speed increase
  1.2 Added User Script Commands, script can now be auto-updated without losing User Data
  1.1 Total Code rewrite, Xpath pattern
  1.0 Initial release

*/


(function() { // anonymous function wrapper, used for error checking & limiting scope
  'use strict';
  
  if (window.self !== window.top) { return; } // end execution if in a frame
  
  // setting User Preferences
  function setUserPref(varName, defaultVal, menuText, promtText, sep){
    GM_registerMenuCommand(menuText, function() {
      var val = prompt(promtText, GM_getValue(varName, defaultVal));
      if (val === null)  { return; }  // end execution if clicked CANCEL
      // prepare string of variables separated by the separator
      if (sep && val){
        var pat1 = new RegExp('\\s*' + sep + '+\\s*', 'g'); // trim space/s around separator & trim repeated separator
        var pat2 = new RegExp('(?:^' + sep + '+|' + sep + '+$)', 'g'); // trim starting & trailing separator
        val = val.replace(pat1, sep).replace(pat2, '');
      }
      val = val.replace(/\s{2,}/g, ' ').trim();    // remove multiple spaces and trim
      GM_setValue(varName, val);
      // Apply changes (immediately if there are no existing highlights, or upon reload to clear the old ones)
      if(!document.body.querySelector(".THmo")) THmo_doHighlight(document.body);
      else location.reload();
    });
  }
  
  // prepare UserPrefs
  setUserPref(
  'keywords',
  'Fighting Doves II,Fightin Doves II,Fighting Doves',
  'Set Team Names',
  'Set keywords separated by comma\t\t\t\t\t\t\t\r\n\r\nExample:\r\nFighting Doves II,Fightin Doves II,Fighting Doves',
  ','
  );

  setUserPref(
  'additionalRegex',
  '\\d+:\\d+ *([aApP](?=[mM])[mM])?',
  'Set Additional Regular Expressions',
  'Set additional regular expressions\r\n\r\nExample (to detect times):\r\n\\d+:\\d+ *([aApP](?=[mM])[mM])?'
  );
  
  setUserPref(
  'highlightStyle',
  'color: #f00; background-color: rgba(80,220,80,0.3); font-size:120%;',
  'Set Highlight Style',
  'Set the Highlight Style (use proper CSS)\r\n\r\nExample:\r\ncolor: #f00; font-weight: bold; background-color: #ffe4b5;'
  );
  
/*  // Add MutationObserver to catch content added dynamically
  var THmo_MutOb = (window.MutationObserver) ? window.MutationObserver : window.WebKitMutationObserver;
  if (THmo_MutOb){
    var THmo_chgMon = new THmo_MutOb(function(mutationSet){
      mutationSet.forEach(function(mutation){
        for (var i=0; i<mutation.addedNodes.length; i++){
          if (mutation.addedNodes[i].nodeType == 1){
            THmo_doHighlight(mutation.addedNodes[i]);
          }
        }
      });
    });
  
    // attach chgMon to document.body
    var opts = {childList: true, subtree: true};
  //  THmo_chgMon.observe(document.body, opts);
  }
  */
  // Main workhorse routine
  function THmo_doHighlight(el){
    var keywords = GM_getValue('keywords');
    var additionalRegex = GM_getValue('additionalRegex');
    if(!keywords)  { return; }  // end execution if not found
    var highlightStyle = GM_getValue('highlightStyle');
    if (!highlightStyle) highlightStyle = "color:#00f; font-weight:bold; background-color: #0f0;";
    
    var rQuantifiers = /[-\/\\^$*+?.()|[\]{}]/g;
    keywords = keywords.replace(rQuantifiers, '\\$&').split(',').join('|');
    var pat = new RegExp('(' + keywords + ( !additionalRegex ? '' : '|' + additionalRegex ) + ')', 'gi');
      
       
    var span = document.createElement('span');
    // getting all text nodes with a few exceptions
      
      
          var snapElements = document.evaluate(
        './/text()[normalize-space() != "" ' +
        'and not(ancestor::style) ' +
        'and not(ancestor::script) ' +
        'and not(ancestor::textarea) ' +
        'and not(ancestor::code) ' +
        'and not(ancestor::pre)]',
        el, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
    
    

    if (!snapElements.snapshotItem(0)) { return; }  // end execution if not found

    for (var i = 0, len = snapElements.snapshotLength; i < len; i++) {
      var node = snapElements.snapshotItem(i);
     
      // check if it contains the keywords
      if (pat.test(node.nodeValue)) {
        // check that it isn't already highlighted
        if (node.className != "THmo" && node.parentNode.className != "THmo"){
          // create an element, replace the text node with an element
          var sp = span.cloneNode(true);
          sp.innerHTML = node.nodeValue.replace(pat, '<span style="' + highlightStyle + '" class="THmo">$1</span>');
          node.parentNode.replaceChild(sp, node);
        }
      }
    }

      
      
   
    
var ell = document.getElementsByClassName("bodyz");
var str = ell[0].innerHTML;

str=str.replace(/<table.*?>[\d\D]*?<\/table.*?>/gim, " ");

      
str=str.replace(/&nbsp;/gi, " ");
str=str.replace(/\s/gi, " ");
str=str.replace(/\s+/gi, " ");

//console.log(str);

str=str.replace(/<br>/gi, " \n");
str=str.replace(/<br \/>/gi, " \n");
str=str.replace(/<p.*?>/gi, " \n");



//console.log(str);

str=str.replace(/<(?:.)*?>/g, "");
      
str=str.replace(/(^\w+ \d+(th|st|nd|rd|oth)*)/gim, "$1\n");

str=str.replace(/(\n)(\s)+/gi, "$1");
str=str.replace(/(\s)+(\n)/gi, "$2");
str=str.replace(/(\s)+/gi, "$1");
      
str=str.replace(/(\s)+/gi, "$1");

console.log(str);
//      \\d+:\\d+ *([aApP](?=[mM])[mM])?
  // (?:(^\w+ \d+(?:th|st|nd|rd|oth)*)(?:[\d\D]*?))+(?!^\w+ \d+)(?:^.*?(\d+:*\d* *(?:[aApP](?=[mM])[mM])*?)*(.*?(?:Fighting Doves II|Fightin Doves II|Fighting Doves).*$))
      var re = new RegExp('(?:(^\\w+ \\d+(?:th|st|nd|rd|oth)*)(?:[\\d\\D]*?))+(?!^\\w+ \\d+)(?:(^\\d+:*\\d* *(?:[aApP](?=[mM])[mM])*?)*(.*?(?:' + keywords + ').*$))', 'gim');


var m;
      var html = "<ul id=\"SCHEDhack\" style=\"color:rgb(2,4,13); width:80%; margin:auto; list-style-type:none; font-size:110%; padding:3px;\">";
 var iii = 0;
      console.log(re);
while ((m = re.exec(str)) !== null) {
    if (m.index === re.lastIndex) {
        re.lastIndex++;
    }
    // View your result using the m-variable.
    // eg m[0] etc.
   // console.log(m);

    if (typeof m[3] !== 'undefined')
    {
        html += "<li style=\"background-color:rgba(46,144,177,"+ (iii % 2 > 0 ? "0.05" : "0.2")+"); padding:4px; \"><span style=\"font-size:110%;\">" + m[1] + "</span><span style=\"float:right\"> " +m[3]  + (typeof m[2] !== 'undefined' ? " @ " + "<strong>" + m[2] + "</strong> ": "") +"</span></li>\n";
    iii = iii+1;
    }
    
}
html += "</ul>";
var div = document.createElement("DIV");
div.innerHTML = html;
if(!document.body.querySelector("#SCHEDhack")) ell[0].insertBefore(div,ell[0].firstChild);
else{
  document.getElementById('SCHEDhack').innerHTML = html;
}
//console.log(html);

   
//console.log(str);


   
  }
  // first run
  THmo_doHighlight(document.body);
})(); // end of anonymous function