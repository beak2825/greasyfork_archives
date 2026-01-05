// ==UserScript==
// @name        Hide Instructions on a lot of mturk hits lol
// @namespace   localhost
// @author      zingy
// @description disable instructions by default
// @include     *
// @version     0.34
// @downloadURL https://update.greasyfork.org/scripts/6289/Hide%20Instructions%20on%20a%20lot%20of%20mturk%20hits%20lol.user.js
// @updateURL https://update.greasyfork.org/scripts/6289/Hide%20Instructions%20on%20a%20lot%20of%20mturk%20hits%20lol.meta.js
// ==/UserScript==

document.getElementsByClassName('panel panel-primary')[0].style.display='none';