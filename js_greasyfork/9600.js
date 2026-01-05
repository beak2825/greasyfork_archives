// ==UserScript==
// @name        Collapse the Greasy Fork Header
// @namespace   english
// @description Collapse the Greasy Fork Header - remove image, make title text smaller and more subdued 
// @include     http*://*greasyfork.org*
// @version     1.24
// @run-at document-end
// @license MIT
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/9600/Collapse%20the%20Greasy%20Fork%20Header.user.js
// @updateURL https://update.greasyfork.org/scripts/9600/Collapse%20the%20Greasy%20Fork%20Header.meta.js
// ==/UserScript==

// Main - Collapse the Greasy Fork Header

var style = document.createElement('style');
style.type = 'text/css';

style.innerHTML = '         #site-name img {  display: none !important;}#main-header h1 {  font-size: 32px !important;  line-height: 150% !important;}#site-name a { font-size: 32px !important;  line-height: 150% !important;}#Head #site-name-text h1 {  line-height: 0.1em;}form.inline-form button.browser_id-login{  background-color: #fff;/*\n*/  border: 0;/*\n*/  text-indent: 90000px;/*\n*/  width: 50px;/*\n*/  height: 50px;/*\n*/  padding: 10px;/*\n*/  background-image: url(http://i.imgur.com/xtSWc9s.png); /*\n*/  background-size: 50px;/*\n*/  cursor: pointer;}/*\n*//*\n*//*\n*//*\n*/form.inline-form button.google_oauth2-login {/*\n*/    background-color: #fff;/*\n*/    border: 0;/*\n*/    text-indent: 90000px;/*\n*/    width: 50px;/*\n*/    height: 50px;/*\n*/    padding: 10px;/*\n*/    background-image: url(https://i.imgur.com/6HweuVB.png);/*\n*/    background-size: 50px;/*\n*/    cursor: pointer;/*\n*/}/*\n*//*\n*//*\n*//*\n*/form.inline-form button.gitlab-login {/*\n*/    background-color: #fff;/*\n*/    border: 0;/*\n*/    text-indent: 90000px;/*\n*/    width: 50px;/*\n*/    height: 50px;/*\n*/    padding: 10px;/*\n*/    background-image: url(https://i.imgur.com/lr7CAiS.png);/*\n*/    background-size: 50px;/*\n*/    cursor: pointer;/*\n*/}/*\n*//*\n*/ /*\n*/form.inline-form button.github-login {/*\n*/    background-color: #fff;/*\n*/    border: 0;/*\n*/    text-indent: 90000px;/*\n*/    width: 50px;/*\n*/    height: 50px;/*\n*/    padding: 10px;/*\n*/    background-image: url(https://i.imgur.com/97PDoD0.png);/*\n*/    background-size: 50px;/*\n*/    cursor: pointer;/*\n*/}/*\n*//*\n*//*\n*//*\n*/  /*\n*/ .external-login-container button{    text-indent: -999999px !important ;     height: 60px !important ;    width: 60px !important ;} #main-header {     background-image: linear-gradient(#670000, #840000) !important;}          ';

document.getElementsByTagName('head')[0].appendChild(style);
