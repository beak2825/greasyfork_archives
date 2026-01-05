// ==UserScript==
// @name CandidForum No Registration Required
// @author Arnold François Lecherche
// @namespace greasyfork.org
// @version 1.2.2
// @description Browse CandidForum and click on links without an account; not recommended if you have an active account.
// @include http://*.thecandidforum.com/*
// @include http://thecandidforum.com/*
// @include https://*.thecandidforum.com/*
// @include https://thecandidforum.com/*
// @grant none
// @run-at document-start
// @copyright 2016 Arnold François Lecherche
// @downloadURL https://update.greasyfork.org/scripts/6019/CandidForum%20No%20Registration%20Required.user.js
// @updateURL https://update.greasyfork.org/scripts/6019/CandidForum%20No%20Registration%20Required.meta.js
// ==/UserScript==

;(function (d, c) {
'use strict';
// nothing of interest is in the page's onload handler
d.body['data-pagespeed-onload'] = d.body.onload = null;

// cookie-deletion code: https://stackoverflow.com/questions/2194473/can-greasemonkey-delete-cookies-from-a-given-domain
var domain = d.domain, domain2 = domain.replace(/^www\./, ''), domain3 = domain.replace(/^(\w+\.)+?(\w+\.\w+)$/, '$2'),
  cookieList = d.cookie.split(';'), j = cookieList.length, cookieRegex = /\s*(\w+)=.+$/, p = ';path=/', dom = ';domain=',
  e = ';expires=Thu, 01-Jan-1970 00:00:01 GMT;', cookieName, r, init;

//-- Optional function, for information or debug...
function listCookies() {
  var cookieList  = d.cookie.split(';'), j = cookieList.length;
  while (j--) c.log('Cookie ', j, ': ', cookieList[j]);
}

listCookies(); //-- Optional, for information or debug...

//--- Loop through cookies and delete them.
while (j--) {
  cookieName = cookieList[j].replace(cookieRegex, '$1') + '=';
  //--- To delete a cookie, set its expiration date to a past value.
  d.cookie = cookieName + e;
  d.cookie = cookieName + p + e;
  d.cookie = cookieName + p + dom + domain + e;
  d.cookie = cookieName + p + dom + domain2 + e;
  d.cookie = cookieName + p + dom + domain3 + e;
}

listCookies(); //-- Optional, for information or debug...

// show's over, folks
init = d.write.bind(d, 'Please disable or uninstall the "CandidForum No Registration Required" UserScript and then refresh this page; see the UserScript page for more information, and use your browser\'s settings to disable scripts and cookies for this site, in case that still allows you to see the content: <a href="https://greasyfork.org/en/scripts/6019-candidforum-no-registration-required" rel="noopener noreferrer nofollow" target="_blank">GreasyFork</a><br />This is a message from Arnold François Lecherche, the developer of that UserScript.');

r = d.readyState;
if (r === 'complete' || r === 'loaded' || r === 'interactive') init();
else d.addEventListener('DOMContentLoaded', init, false);
})(document, console);