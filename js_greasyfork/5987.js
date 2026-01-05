// ==UserScript==
// @name         Dave Cobb Goodface
// @version      0.3
// @description  Marks all faces as "good" to begin with
// @author       You
// @match        https://dbxtagger.appspot.com/annotate*
// @match        https://s3.amazonaws.com/mturk_bulk/hits/*
// @grant        none
// @namespace https://greasyfork.org/users/710
// @downloadURL https://update.greasyfork.org/scripts/5987/Dave%20Cobb%20Goodface.user.js
// @updateURL https://update.greasyfork.org/scripts/5987/Dave%20Cobb%20Goodface.meta.js
// ==/UserScript==

setTimeout(function() {$("label[for^=goodface]").each(function() { $(this).parent().click(); });},1000);