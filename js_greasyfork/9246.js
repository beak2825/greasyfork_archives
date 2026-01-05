// ==UserScript==
// @name           Old BF
// @version        1.0
// @namespace      http://www.erepublik.com/en/citizen/profile/4760571
// @author         MandiBT
// @description    Automatic redirection to the old battlefield page
// @include        http://www.erepublik.com/*/military/battlefield-new/*
// @downloadURL https://update.greasyfork.org/scripts/9246/Old%20BF.user.js
// @updateURL https://update.greasyfork.org/scripts/9246/Old%20BF.meta.js
// ==/UserScript==

//=== License and Disclaimer =================================+
// Software is provided 'as is' and without any warranty.     |
// Use on your own responsibility.                            |
//============================================================+

location.href = location.href.replace(/-new/g, "");	