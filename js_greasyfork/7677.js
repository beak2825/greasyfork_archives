// ==UserScript==
// @name          Wikimedia Page History in Sidebar [adopted]
// @description   Add History box at wikimedia's leftmost column
// @version       1.3.0
// @license       ISC
// @downstreamURL http://userscripts.org/scripts/source/124389.user.js
// @include       http://*.wikipedia.org/*
// @include       http://*.wikimedia.org/wiki/*
// @include       http://ssdl-wiki.cs.technion.ac.il/wiki/*
// @include       http://wiki.greasespot.net/*
// @include       *wiki*
// @grant         none
// @namespace https://greasyfork.org/users/8615
// @downloadURL https://update.greasyfork.org/scripts/7677/Wikimedia%20Page%20History%20in%20Sidebar%20%5Badopted%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/7677/Wikimedia%20Page%20History%20in%20Sidebar%20%5Badopted%5D.meta.js
// ==/UserScript==

/*
 * Originally called "Wikimedia+": http://userscripts-mirror.org/scripts/show/7877
 * I think it might also have been called "Wikimedia+ for Chrome (localStorage)" at some point
 *
 * 2023-01-19  Various updates for Wikipedia's new layout (but try to remain
 *             compatible with classic layout still used on many other sites)
 *
 * 2018-03-04  Use scrollbar for history.
 *
 * 2018-03-03  Renamed script.
 *             Stop adjusting CSS for sidebar.
 *             Do not store special pages in history.
 *
 * 2012-03-09  Click "More..." for longer stored history (numToRemember/numToShow)
 *
 * 2011-??-??  Work in Chrome by using localStorage instead of GM_setValue.
 *             (localStorage is per-site, not global like GM_set/getValue.)
 *
*/

var numToRemember = 500;
var numToShow = 10;
var minHoursForBreak = 4;
var alwaysUseLocalStorage = true;   // I find this preferable because it acts per-site rather than global.

// Release notes
// =============
//        2011: Implemented GM_set/getValue for Chrome using localStorage (joey)
// 21-Mar-2007: Multiple occurrences of the same page (&edit, #section) eliminated
// 22-Mar-2007: Multiple occurrences due to a printable version of the page eliminated
// 24-Mar-2007: If no left column is present, exit quietly
// 31-May-2008:
//    (a) Firefox 3.0 compatibility
//    (b) Removed the edit links that were (by definition) part of the history
//    (c) Renamed the new box to "Wikimedia+"
// 19-Nov-2010: Updates to wikipedia's css style.

// BUG TODO: appears as a portal, but collapsing does not work
// DONE: ok added manual collapsing, but still some of the formatting looks different

var delayBeforeRunning = 2200;

// Fix for Chrome
// Check if GM_getValue is missing, OR is Chrome's "not supported" function.
var GM_test;
try {
   GM_test = ""+window.GM_getValue;
} catch (e) {
   // Greasemonkey: can't convert window.GM_getValue to primitive type
   // because: window.GM_getValue.toString is not a function
   // console.log("Getting GM_test: "+e);
}
if (alwaysUseLocalStorage || typeof GM_getValue !== 'function' || (""+GM_test).indexOf("not supported")>=0) {
   console.log("[Wikimedia+] Adding localStorage implementation of GMget/setValue for Chrome.");
   if (localStorage) {
      // We add and remove leading "s" to match records saved/loaded via FallbackGMAPI.
      // This stops the bookmarklet-loaded version from trashing the userscript version's values.
      GM_getValue=function (key,def) {
         return (""+localStorage.getItem(key)).replace(/^s/,'') || def;
      };
      GM_setValue=function (key,value) {
         localStorage.setItem(key, "s"+value);
         return value;
      };
   }
}

setTimeout(function()
{
   var pref = "userscripts.org.wikimediaplus.history";
   var titleKey = pref + ".title.";
   var urlKey = pref + ".url.";
   var dateKey = pref + ".date.";
   var limit = 12;
   var read = function()
   {
      var r = new Array();
      for(var i = 0; i < numToRemember; ++i)
      {
         var o = new Object();
         o.title = GM_getValue(titleKey + i, null);
         o.url = GM_getValue(urlKey + i, null);
         o.date = parseFloat(GM_getValue(dateKey + i, null));
         if(o.title == null || o.url == null)
            continue;
         if(o.title.length == 0 || o.url.length == 0)
            continue;
         r.push(o);
      }
      return r;
   };
   var store = function(a)
   {
      for(var i = 0; i < numToRemember; ++i)
      {
         var o = a[i];
         if(!o)
         {
            o = new Object();
            o.title = "";
            o.url = "";
            o.date = 0;
         }
         GM_setValue(titleKey + i, o.title);
         GM_setValue(urlKey + i, o.url);
         GM_setValue(dateKey + i, ""+o.date);
      }
   };
   var addHist = function(url, title, date, a)
   {
      var o = new Object();
      o.url = url;
      o.title = title;
      o.date = date;
      a.unshift(o);
      var b = new Array();
      for(var i in a)
      {
         var o = a[i];
         var found = false;
         for(var j in b)
         {
            var p = b[j];
            if(p.url == o.url)
               found = true;
         }
         if(!found)
            b.push(o);
      }
      return b;
   };
   var strValue = function(o)
   {
      if(o)
        return o.toString();
      return "";
   }
   var normalizeUrl = function(loc)
   {
      return strValue(loc.protocol) + "//" + strValue(loc.hostname)
         + strValue(loc.port) + strValue(loc.pathname) + strValue(loc.search);
   };
   var recordDatesDifferEnough = function(newer,older) {
      return (newer && older && newer.date && older.date && newer.date - older.date > minHoursForBreak*1000*60*60);
   }
   var titleStr = document.title;
   var dash = titleStr.indexOf (' - ');
   titleStr = titleStr.substring(0,dash);
   var newHistoryItem = normalizeUrl(document.location);
   // Fix for when running alongside Joey's Reclaim CPU
   titleStr = titleStr.replace(/^[*#+.?] /,'');

   // We only store normal pages (articles).
   // We skip all special pages, e.g. article history, revision differences, edit pages, printable pages..
   // Except for search result pages.  We keep those.
   var skipStoring = !!document.location.search;
   if (document.location.search.indexOf('?search=') >= 0) {
      titleStr = "Search: " + titleStr;
      skipStoring = false;
   }

   var hist = read();
   // console.log("[Wikimedia+] Got "+hist.length+" recent entries.");
   if(!skipStoring)
      hist = addHist(newHistoryItem, titleStr, new Date().getTime(), hist);
   store(hist);

   // Render history and add it to sidebar
   var panel = document.getElementById("vector-main-menu") || document.getElementById("mw-panel") ||
      document.getElementById("column-one") || document.getElementById("panel")
      || document.getElementById("jq-interiorNavigation");

   var is2023Layout = panel.id === 'vector-main-menu';

   function myEscape(str) {
      return str.replace('"','&quot;','g').replace('<','&lt;','g').replace('>','&gt;','g');
   }
   var liType = is2023Layout ? 'li' : 'li';
   var listItem = function(href,name) { return `<${liType}><a href="${myEscape(href)}">${myEscape(name || href.replace(/.*\//, ''))}</a></${liType}>\n`; }
   var s = '<h3 role="navigation">Recent Pages</h3><div class="vector-menu-content _ pBody"><ul class="vector-menu-content-list">';
   if (is2023Layout) {
	   s = '<div class="vector-main-menu-action-heading vector-menu-heading">Recent Pages</div><div class="vector-main-menu-action-content vector-menu-content"><ul class="vector-menu-content-list">';
   }
   // for(var x in hist)
   for(var x=0; x<numToShow; x++)
   {
      var o = hist[x];
      if (o) {   // early users have little history
         s += listItem(o.url, o.title, o.date);
      }
      if (recordDatesDifferEnough(o,hist[x+1])) {
         s += "<hr>";
      }
   }
   s += is2023Layout ? '</ul></div>' : '</ul></div>';

   //var indentLaterLines = 'padding-left: 1.5em; text-indent: -1.5em;';
   // Note that MediaWiki sites (but not Wikipedia) augument this rule with: .portal ul { font-size: 95%; }
   //var reduceSidebarFontSize = 'div#mw-panel div.portal div.body ul li { font-size: 0.7em; }';
   //reduceSidebarFontSize += ' .portal ul { font-size: 100%; }';
   // BUG: This breaks the sidebar on rationalwiki.org
   // The following .body rule applies to the whole sidebar, so none of the above is needed.
   //s += '<style type="text/css"> .body { font-size: 0.85em; } div.body li { list-style-image: none; list-style-type: none; list-style-position: outside; '+indentLaterLines+' } '+reduceSidebarFontSize+' </style>';

   var softenOurHRSeparators = '#p-history hr { margin-left: 20%; margin-right: 20%; opacity: 0.2; }';
   //var outdentPortalHeadings2018 = '.portal > h3 { margin-left: 0 !important; } .portal > .body { margin-left: 0 !important; } .portal > .body > * { margin-left: 0.5em !important; }';
   //var emphasiseGapsBetweenPortals = 'div#mw-panel div.portal h3 { margin-top: 1.5em; font-weight: bold; }';
   var useScrollbarForHistory = 'div#mw-panel div.portal div.body ul { max-height: 90vh; overflow: auto; }';
   var fitInto2023Layout = is2023Layout ? '#p-history li { padding: 0; } ' : '';
   s += '<style type="text/css">' + softenOurHRSeparators + useScrollbarForHistory + fitInto2023Layout + '</style>';

   var e = document.createElement ("div");
   e.innerHTML = s;
   e.id = "p-history";
   e.className = "mw-portlet mw-portlet-interaction vector-menu vector-menu-portal portal _ portlet";
   if (is2023Layout) {
      e.className = "vector-main-menu-group vector-menu mw-portlet mw-portlet-wikibase-otherprojects";
   }

   if (panel) {
      panel.insertBefore(e,panel.getElementsByClassName("portal")[1]);
      /* Should be handled by Wiki's own JS.
      e.getElementsByTagName("h3")[0].addEventListener("click",function(e){
            document.getElementsByClassName("pBody")[0].style.display = ( document.getElementsByClassName("body")[0].style.display ? '' : 'none' );
      },true);
      */

      if (hist.length > numToShow) {
         var openMore = document.createElement("li");
         //openMore.style = "text-align: center";
         var openMoreLink = document.createElement("a");
         openMoreLink.textContent = "See more...";
         openMoreLink.href = "#";
         openMore.appendChild(openMoreLink);
         var targetUL = e.getElementsByTagName("ul")[0];
         targetUL.appendChild(openMore);
         openMoreLink.onclick = function(evt) {
            targetUL.removeChild(openMore);
            var fragment = document.createDocumentFragment();
            for (var i=numToShow;i<hist.length;i++) {
               var o = hist[i];
               if (o) {
                  // I tried to set innerHTML of the fragment after building a
                  // big string as above, but the items did not appear.
                  var div = document.createElement("div");
                  div.innerHTML = listItem(o.url, o.title, o.date);
                  fragment.appendChild(div);
                  if (recordDatesDifferEnough(o,hist[i+1])) {
                     fragment.appendChild(document.createElement("hr"));
                  }
               }
            }
            targetUL.appendChild(fragment);
            evt.preventDefault(); // Do not follow the #
         };
      }

   } else {
      console.log("Found no sidebar to write to.");
   }
   // Uncomment next three lines if you want to remove the copy warning message from the bottom of the edit page
   // var warn = document.getElementById("editpage-copywarn");
   // if(warn)
   //   warn.parentNode.removeChild(warn);

   function AppendCategoryTreeToSidebar() {
       try {
           /*
           var node = document.getElementById( "p-tb" )
                              .getElementsByTagName('div')[0]
                              .getElementsByTagName('ul')[0];
           */

           var node = document.querySelector('#p-tb > div > ul');

           var aNode = document.createElement( 'a' );
           var liNode = document.createElement( 'li' );

           aNode.appendChild( document.createTextNode( 'CategoryTree' ) );
           aNode.setAttribute( 'href' , 'http://en.wikipedia.org/wiki/Special:CategoryTree' );
           liNode.appendChild( aNode );
           liNode.className = 'plainlinks';
           node.appendChild( liNode );
           console.log("AppendCategoryTreeToSidebar(): Added "+liNode+" to "+node);
       } catch(e) {
           // lets just ignore what's happened
          console.log("Error in AppendCategoryTreeToSidebar(): "+e);
           return;
       }
   }

   AppendCategoryTreeToSidebar();

},delayBeforeRunning);
