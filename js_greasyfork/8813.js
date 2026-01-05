// ==UserScript==
// @name        BingBackgroundInAsana
// @description Background from bing.com as background in asana.
// @namespace   BingBackgroundAsana
// @include     https://app.asana.com/*
// @version     1.3.8
// @grant GM.xmlHttpRequest
// @run-at document-start
// @downloadURL https://update.greasyfork.org/scripts/8813/BingBackgroundInAsana.user.js
// @updateURL https://update.greasyfork.org/scripts/8813/BingBackgroundInAsana.meta.js
// ==/UserScript==

GM.xmlHttpRequest({
  method: 'GET',
  url: 'https://www.bing.com/HPImageArchive.aspx?format=xml&idx=0&n=1&mkt=en-US',
  headers: {
    'User-Agent': 'Mozilla/5.0', // If not specified, navigator.userAgent will be used.
    'Accept': 'text/xml' // If not specified, browser defaults will be used.
  },
  onload: function (response) {
    parser=new DOMParser();
    xmlDoc=parser.parseFromString(response.responseText,"text/xml");
    
    var img = 'https://bing.com/' + xmlDoc.getElementsByTagName('url')[0].childNodes[0].nodeValue;
    var pos = img.lastIndexOf('_');
    img = img.substring(0,pos) + '_1920x1080.jpg';
    var DLstyle = document.createElement("style");
		DLstyle.textContent =''+
      'body, .themeBackground { background-image: url("'+ img +'") !important; background-size: cover; background-repeat: no-repeat; } '+
      'div.asanaView-topbar, div.asanaView-pageHeader, div.sidebar-mountNode, div#center_pane_container, div#right_pane_container { opacity: 0.90; }' +
      '.defaultSplash, .dialog--nux {background: transparent linear-gradient(to right top, #4F6F9A 10%, #7196A9 65%, #4F6F9A 125%) repeat scroll 0% !important; }';
		document.head.appendChild(DLstyle);
  }
});
