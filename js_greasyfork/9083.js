// ==UserScript==
// @name         Pandabutt
// @version      0.10
// @description  Is this what my life has become?
// @author       Tjololo
// @match        http://mturkforum.com/*
// @match        http://www.mturkgrind.com/*
// @require      http://code.jquery.com/jquery-git.js
// @namespace https://greasyfork.org/users/710
// @downloadURL https://update.greasyfork.org/scripts/9083/Pandabutt.user.js
// @updateURL https://update.greasyfork.org/scripts/9083/Pandabutt.meta.js
// ==/UserScript==

$("div.postbody").each(function() { replaceText($(this)); });

$("div.messageContent").each(function() { replaceText($(this)); });

function replaceText(item) {
    var oldtext = item.html();
    var newtext = oldtext.replace(/(images\/)?butt/g, function($0,$1){ return $1?$0:"PLACEHOLDER";});
    newtext = newtext.replace(/panda/g, "butt");
    newtext = newtext.replace(/PLACEHOLDERon/g, "button");
    newtext = newtext.replace(/PLACEHOLDER/g, "panda");
    newtext = newtext.replace(/body/g, "pony");
    newtext = newtext.replace(/people/g, "ponies");
    newtext = newtext.replace(/person/g, "pony");
    newtext = newtext.replace(/hands/g, "hooves");
    newtext = newtext.replace(/hand/g, "hoof");
    newtext = newtext.replace(/foot/g, "hoof");
    newtext = newtext.replace(/feet/g, "hooves");
    newtext = newtext.replace(/hair/g, "mane");
    newtext = newtext.replace(/([\.\/-])?mturk/g, function($0,$1){ return $1?$0:"equestria";});
    newtext = newtext.replace(/tj(ol)*o?/ig, "The Sexy Pony Overlord");
    item.html(newtext);
}