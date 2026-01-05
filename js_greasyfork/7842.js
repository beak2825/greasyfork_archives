// ==UserScript==
// @name       insert a download link on vimeo video page
// @namespace  namespace
// @version    0.2
// @description  insert a download link on vimeo video page.
// @match      http://vimeo.com/*
// @match      https://vimeo.com/*
// @copyright  2014+, qa2
// @downloadURL https://update.greasyfork.org/scripts/7842/insert%20a%20download%20link%20on%20vimeo%20video%20page.user.js
// @updateURL https://update.greasyfork.org/scripts/7842/insert%20a%20download%20link%20on%20vimeo%20video%20page.meta.js
// ==/UserScript==

!function() {
  var dlurl = 'http://keepvid.com/?url=' + location.href;
  var el = document.createElement("a");
  el.setAttribute("href", dlurl);
  el.setAttribute("target", "_blank");
  el.innerHTML = "Download";
  el.setAttribute("style", "margin-left: 10px; color: blue");
  
  var to = document.getElementsByClassName('js-clip_title')[0];
  to.appendChild(el);
}();

