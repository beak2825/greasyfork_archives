// ==UserScript==
// @name       Redirect to Python 3 docs
// @namespace  gotopy3
// @version    0.2
// @description  Automatically redirect any python 2 doc URL to its V3 equivalent
// @match      http://docs.python.org/2*
// @downloadURL https://update.greasyfork.org/scripts/9024/Redirect%20to%20Python%203%20docs.user.js
// @updateURL https://update.greasyfork.org/scripts/9024/Redirect%20to%20Python%203%20docs.meta.js
// ==/UserScript==
document.location.href=document.location.href.replace(/http:\/\/docs.python.org\/2[.\d]*(?=\/)/,'http://docs.python.org/3');