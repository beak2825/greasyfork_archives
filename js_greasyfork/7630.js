// ==UserScript==
// @name         Nihongomaster audio fix
// @namespace    http://your.homepage/
// @version      0.2
// @description  enter something useful
// @author       You
// @include      http*://m.nihongomaster.com/drill*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/7630/Nihongomaster%20audio%20fix.user.js
// @updateURL https://update.greasyfork.org/scripts/7630/Nihongomaster%20audio%20fix.meta.js
// ==/UserScript==

var regex = /^http[s]?:\/\/[a-z0-9]+\.cloudfront\.net(.*)$/i;
var fp = document.getElementById('file_path_prefix');

fp.value = fp.value.replace(regex, 'http://nihongomaster.com$1');