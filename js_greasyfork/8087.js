// ==UserScript==
// @name bangumi notification hot fix
// @namespace  com.ruocaled.bangumi
// @version    0.11
// @description  remove link to timeline 8388607
// @match      http://bangumi.tv/notify*
// @match      http://bgm.tv/notify*
// @match      http://chii.in/notify*
// @copyright  2015+, Ruocaled

// @downloadURL https://update.greasyfork.org/scripts/8087/bangumi%20notification%20hot%20fix.user.js
// @updateURL https://update.greasyfork.org/scripts/8087/bangumi%20notification%20hot%20fix.meta.js
// ==/UserScript==

$('.reply_content.tip > a').each(function(i,e){
    e.href = e.href.split('/status/8388607')[0];
});
