// ==UserScript==
// @name           Encrypted Google (HTTPS/SSL)
// @namespace      Jay
// @description    Redirects Google to Encrypted Google
// @version        1.0
// @icon           http://www.sainofy.com/images/SSL-security.png
// @include        https://www.google.*
// @exclude        https://encrypted.google.com/*
// @exclude        https://accounts.google.com/*
// @exclude        https://mail.google.com/*
// @exclude        http://www.google.com/*
// @exclude        http://www.google.com/imgres?imgurl=*
// @grant          None
// @downloadURL https://update.greasyfork.org/scripts/7845/Encrypted%20Google%20%28HTTPSSSL%29.user.js
// @updateURL https://update.greasyfork.org/scripts/7845/Encrypted%20Google%20%28HTTPSSSL%29.meta.js
// ==/UserScript==

// US / UK Only (.com)

// If you use Google Search it will redirect you to Encrypted Google unless you're using Google SSL Search
// Google SSL Search (Firefox) : https://addons.mozilla.org/en-US/firefox/addon/google-ssl-search  

// 1.0
// Fixed redirecting Google Mail to Encrypted Google.
// Fixed redirecting Google Images to Encrypted Google.

window.location.href="https://encrypted.google.com/";